
-- 1. monthly_closings table
CREATE TABLE public.monthly_closings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL UNIQUE, -- first day of month
  status TEXT NOT NULL DEFAULT 'closed' CHECK (status IN ('closed','reopened')),
  closed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_by UUID,
  reopened_at TIMESTAMPTZ,
  reopened_by UUID,
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_shop_income NUMERIC NOT NULL DEFAULT 0,
  total_shop_expense NUMERIC NOT NULL DEFAULT 0,
  total_shop_profit NUMERIC NOT NULL DEFAULT 0,
  company_income NUMERIC NOT NULL DEFAULT 0,
  company_expense NUMERIC NOT NULL DEFAULT 0,
  final_business_profit NUMERIC NOT NULL DEFAULT 0,
  bank_balance NUMERIC NOT NULL DEFAULT 0,
  total_shop_cash_position NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_closings TO authenticated;
GRANT ALL ON public.monthly_closings TO service_role;

ALTER TABLE public.monthly_closings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view closings"
  ON public.monthly_closings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert closings"
  ON public.monthly_closings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can update closings"
  ON public.monthly_closings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can delete closings"
  ON public.monthly_closings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_monthly_closings_updated
  BEFORE UPDATE ON public.monthly_closings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. helper
CREATE OR REPLACE FUNCTION public.is_month_closed(_d DATE)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.monthly_closings
    WHERE status = 'closed'
      AND month = date_trunc('month', _d)::date
  );
$$;

-- 3. block edits/deletes on closed months
CREATE OR REPLACE FUNCTION public.enforce_month_lock()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_date DATE;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_date := OLD.txn_date;
  ELSE
    v_date := COALESCE(NEW.txn_date, OLD.txn_date);
    -- also block moving a row INTO a closed month
    IF OLD.txn_date IS DISTINCT FROM NEW.txn_date
       AND public.is_month_closed(NEW.txn_date) THEN
      RAISE EXCEPTION 'MONTH_CLOSED: cannot move record into a closed month (%).', to_char(NEW.txn_date,'YYYY-MM');
    END IF;
  END IF;

  IF v_date IS NOT NULL AND public.is_month_closed(v_date) THEN
    RAISE EXCEPTION 'MONTH_CLOSED: % is inside a closed month (%). Reopen the month to make changes.',
      TG_TABLE_NAME, to_char(v_date,'YYYY-MM');
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER trg_month_lock_transactions
  BEFORE UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_month_lock();

CREATE TRIGGER trg_month_lock_shop_entries
  BEFORE UPDATE OR DELETE ON public.shop_entries
  FOR EACH ROW EXECUTE FUNCTION public.enforce_month_lock();
