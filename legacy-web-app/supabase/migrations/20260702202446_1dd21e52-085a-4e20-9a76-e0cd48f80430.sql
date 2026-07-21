
-- 1) Link auth users to employees
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS employees_user_id_idx ON public.employees(user_id);

-- 2) Add 'kind' to employee_entries so we can distinguish
--    normal cash movements from expense-reimbursement mirror rows.
ALTER TABLE public.employee_entries
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'cash';

-- 3) Only sync CASH employee entries to the company transactions ledger.
--    Expense reimbursement mirror rows must NOT touch company cash.
CREATE OR REPLACE FUNCTION public.sync_employee_to_transactions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_emp_name text;
  v_txn_type public.txn_type;
  v_prefix text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.transactions WHERE source = 'employee' AND source_ref_id = OLD.id;
    RETURN OLD;
  END IF;

  DELETE FROM public.transactions WHERE source = 'employee' AND source_ref_id = NEW.id;

  IF COALESCE(NEW.is_deleted, false) THEN
    RETURN NEW;
  END IF;

  -- Skip company cash sync for non-cash entries (e.g. expense reimbursement mirrors).
  IF COALESCE(NEW.kind, 'cash') <> 'cash' THEN
    RETURN NEW;
  END IF;

  SELECT name INTO v_emp_name FROM public.employees WHERE id = NEW.employee_id;

  IF NEW.entry_type = 'given' THEN
    v_txn_type := 'cash_out';
    v_prefix := 'Employee: ' || COALESCE(v_emp_name,'') || ' (Given)';
  ELSE
    v_txn_type := 'cash_in';
    v_prefix := 'Employee: ' || COALESCE(v_emp_name,'') || ' (Received)';
  END IF;

  IF COALESCE(NEW.notes,'') <> '' THEN
    v_prefix := v_prefix || ' — ' || NEW.notes;
  END IF;

  IF NEW.amount > 0 THEN
    INSERT INTO public.transactions
      (type, amount, payment_method, txn_date, notes, attachment_url, created_by, source, source_ref_id, category)
    VALUES
      (v_txn_type, NEW.amount, 'cash', NEW.txn_date, v_prefix, NEW.attachment_url, NEW.created_by, 'employee', NEW.id, 'Employee');
  END IF;

  RETURN NEW;
END $function$;

-- 4) Employee expenses table (reimbursement tracker).
CREATE TABLE IF NOT EXISTS public.employee_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  note text NOT NULL,
  attachment_url text,
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  linked_entry_id uuid REFERENCES public.employee_entries(id) ON DELETE SET NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS employee_expenses_employee_idx ON public.employee_expenses(employee_id);
CREATE INDEX IF NOT EXISTS employee_expenses_user_idx ON public.employee_expenses(user_id);
CREATE INDEX IF NOT EXISTS employee_expenses_date_idx ON public.employee_expenses(txn_date DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_expenses TO authenticated;
GRANT ALL ON public.employee_expenses TO service_role;

ALTER TABLE public.employee_expenses ENABLE ROW LEVEL SECURITY;

-- Admin/manager: full access
CREATE POLICY "employee_expenses admin all"
  ON public.employee_expenses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- Owner (linked employee): can view own
CREATE POLICY "employee_expenses select own"
  ON public.employee_expenses FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.user_id = auth.uid())
  );

-- Owner: can insert for themselves
CREATE POLICY "employee_expenses insert own"
  ON public.employee_expenses FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND e.user_id = auth.uid())
  );

-- Owner: can update own within 24h
CREATE POLICY "employee_expenses update own 24h"
  ON public.employee_expenses FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    AND created_at > now() - interval '24 hours'
    AND COALESCE(is_deleted, false) = false
  )
  WITH CHECK (created_by = auth.uid());

-- Owner: can soft-delete own within 24h (hard delete via UPDATE is_deleted=true handled by policy above; also allow DELETE)
CREATE POLICY "employee_expenses delete own 24h"
  ON public.employee_expenses FOR DELETE TO authenticated
  USING (
    created_by = auth.uid()
    AND created_at > now() - interval '24 hours'
  );

-- updated_at trigger
DROP TRIGGER IF EXISTS employee_expenses_touch_updated ON public.employee_expenses;
CREATE TRIGGER employee_expenses_touch_updated
  BEFORE UPDATE ON public.employee_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Mirror to employee_entries so Outstanding balance stays correct.
--    Insert  -> create linked 'received' entry (kind='expense_reimbursement').
--    Update  -> update the linked entry's amount/date/notes.
--    Delete / soft-delete -> soft-delete the linked entry.
CREATE OR REPLACE FUNCTION public.sync_employee_expense_to_entry()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_note text;
  v_new_entry_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_note := '[EXP:' || COALESCE(NEW.category, 'Other') || '] ' || COALESCE(NEW.note, '');
    INSERT INTO public.employee_entries
      (employee_id, entry_type, amount, txn_date, notes, attachment_url, created_by, kind)
    VALUES
      (NEW.employee_id, 'received', NEW.amount, NEW.txn_date, v_note, NEW.attachment_url,
       COALESCE(NEW.created_by, auth.uid()), 'expense_reimbursement')
    RETURNING id INTO v_new_entry_id;
    NEW.linked_entry_id := v_new_entry_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF COALESCE(NEW.is_deleted, false) AND NOT COALESCE(OLD.is_deleted, false) THEN
      IF NEW.linked_entry_id IS NOT NULL THEN
        UPDATE public.employee_entries SET is_deleted = true, deleted_at = now(), deleted_by = auth.uid()
          WHERE id = NEW.linked_entry_id;
      END IF;
    ELSIF NOT COALESCE(NEW.is_deleted, false) AND NEW.linked_entry_id IS NOT NULL THEN
      v_note := '[EXP:' || COALESCE(NEW.category, 'Other') || '] ' || COALESCE(NEW.note, '');
      UPDATE public.employee_entries
        SET amount = NEW.amount,
            txn_date = NEW.txn_date,
            notes = v_note,
            attachment_url = NEW.attachment_url,
            is_deleted = false,
            deleted_at = NULL,
            deleted_by = NULL
        WHERE id = NEW.linked_entry_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.linked_entry_id IS NOT NULL THEN
      DELETE FROM public.employee_entries WHERE id = OLD.linked_entry_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END $function$;

DROP TRIGGER IF EXISTS trg_employee_expense_sync_ins ON public.employee_expenses;
CREATE TRIGGER trg_employee_expense_sync_ins
  BEFORE INSERT ON public.employee_expenses
  FOR EACH ROW EXECUTE FUNCTION public.sync_employee_expense_to_entry();

DROP TRIGGER IF EXISTS trg_employee_expense_sync_upd ON public.employee_expenses;
CREATE TRIGGER trg_employee_expense_sync_upd
  AFTER UPDATE ON public.employee_expenses
  FOR EACH ROW EXECUTE FUNCTION public.sync_employee_expense_to_entry();

DROP TRIGGER IF EXISTS trg_employee_expense_sync_del ON public.employee_expenses;
CREATE TRIGGER trg_employee_expense_sync_del
  AFTER DELETE ON public.employee_expenses
  FOR EACH ROW EXECUTE FUNCTION public.sync_employee_expense_to_entry();

-- 6) Make employee_expenses restorable via existing recycle bin.
CREATE OR REPLACE FUNCTION public.is_soft_deletable_table(_table_name text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT _table_name = ANY (ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops',
    'employees','employee_entries','employee_expenses',
    'shop_sales','shop_purchases','shop_orders','shop_products','pos_customers'
  ]);
$function$;
