
-- 1. New columns
ALTER TABLE public.employee_expenses
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'expense',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS verified_by uuid,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- 2. Constraints
DO $$ BEGIN
  ALTER TABLE public.employee_expenses ADD CONSTRAINT employee_expenses_kind_chk CHECK (kind IN ('expense','deposit'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.employee_expenses ADD CONSTRAINT employee_expenses_status_chk CHECK (status IN ('pending','verified','rejected'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.employee_expenses ALTER COLUMN category DROP NOT NULL;

DO $$ BEGIN
  ALTER TABLE public.employee_expenses ADD CONSTRAINT employee_expenses_kind_category_chk
    CHECK (kind = 'deposit' OR (category IS NOT NULL AND length(btrim(category)) > 0));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Remove financial coupling
DROP TRIGGER IF EXISTS trg_employee_expense_sync_ins ON public.employee_expenses;
DROP TRIGGER IF EXISTS trg_employee_expense_sync_upd ON public.employee_expenses;
DROP TRIGGER IF EXISTS trg_employee_expense_sync_del ON public.employee_expenses;

UPDATE public.employee_entries
   SET is_deleted = true, deleted_at = COALESCE(deleted_at, now())
 WHERE kind = 'expense_reimbursement'
   AND COALESCE(is_deleted, false) = false;

-- 4. Refined INSERT policy — employees can create expense (verified) or deposit (pending)
DROP POLICY IF EXISTS "employee_expenses insert own" ON public.employee_expenses;
CREATE POLICY "employee_expenses insert own" ON public.employee_expenses
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = employee_expenses.employee_id AND e.user_id = auth.uid()
    )
    AND (
      (kind = 'expense' AND status = 'verified')
      OR (kind = 'deposit' AND status = 'pending')
    )
  );
