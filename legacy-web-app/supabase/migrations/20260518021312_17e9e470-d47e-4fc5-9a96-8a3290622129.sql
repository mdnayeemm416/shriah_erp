-- Employees module
CREATE TYPE public.employee_entry_type AS ENUM ('given', 'received');

CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL,
  shop_name text,
  mobile text,
  iqama text,
  notes text,
  attachment_url text,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid
);

CREATE INDEX idx_employees_shop ON public.employees(shop_id) WHERE NOT is_deleted;
CREATE INDEX idx_employees_active ON public.employees(is_deleted);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update employees" ON public.employees FOR UPDATE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin delete employees" ON public.employees FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.set_ai_scans_updated_at();

CREATE TRIGGER trg_employees_admin_delete
BEFORE UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();

CREATE TABLE public.employee_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  entry_type public.employee_entry_type NOT NULL,
  amount numeric NOT NULL DEFAULT 0 CHECK (amount >= 0),
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  attachment_url text,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid
);

CREATE INDEX idx_employee_entries_employee ON public.employee_entries(employee_id) WHERE NOT is_deleted;
CREATE INDEX idx_employee_entries_date ON public.employee_entries(txn_date DESC);

ALTER TABLE public.employee_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read employee_entries" ON public.employee_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert employee_entries" ON public.employee_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update employee_entries" ON public.employee_entries FOR UPDATE TO authenticated USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin delete employee_entries" ON public.employee_entries FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_employee_entries_admin_delete
BEFORE UPDATE ON public.employee_entries
FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_soft_delete();

-- Allow soft delete on these tables
CREATE OR REPLACE FUNCTION public.is_soft_deletable_table(_table_name text)
 RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT _table_name = ANY (ARRAY[
    'transactions','shop_entries','warehouse_ledger','warehouse_items',
    'ai_scans','categories','sub_categories','parties','cashiers','shops',
    'employees','employee_entries'
  ]);
$function$;

-- Sync employee_entries -> transactions
CREATE OR REPLACE FUNCTION public.sync_employee_to_transactions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
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
END $$;

CREATE TRIGGER trg_employee_entries_sync
AFTER INSERT OR UPDATE OR DELETE ON public.employee_entries
FOR EACH ROW EXECUTE FUNCTION public.sync_employee_to_transactions();

-- Log history changes
CREATE TRIGGER trg_employees_history
AFTER UPDATE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();

CREATE TRIGGER trg_employee_entries_history
AFTER UPDATE ON public.employee_entries
FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();