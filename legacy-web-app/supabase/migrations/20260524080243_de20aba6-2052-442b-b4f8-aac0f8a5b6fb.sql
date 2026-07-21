
-- ============================================================
-- POS CUSTOMERS
-- ============================================================
CREATE TABLE public.pos_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  alias text,
  opening_due numeric NOT NULL DEFAULT 0,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pos_customers_phone ON public.pos_customers (phone);
CREATE INDEX idx_pos_customers_name_lower ON public.pos_customers (lower(name));

ALTER TABLE public.pos_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pos_customers admin all"
  ON public.pos_customers FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE POLICY "pos_customers staff read"
  ON public.pos_customers FOR SELECT TO authenticated
  USING (true);

CREATE TRIGGER trg_pos_customers_updated
  BEFORE UPDATE ON public.pos_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SHOP_SALES: ledger columns
-- ============================================================
ALTER TABLE public.shop_sales
  ADD COLUMN customer_id uuid REFERENCES public.pos_customers(id) ON DELETE SET NULL,
  ADD COLUMN paid_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN due_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN payment_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN edit_count integer NOT NULL DEFAULT 0;

CREATE INDEX idx_shop_sales_customer_id ON public.shop_sales (customer_id);

-- ============================================================
-- POS PAYMENTS  (Payment In and partial payment receipts)
-- ============================================================
CREATE TABLE public.pos_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.pos_customers(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  method text NOT NULL DEFAULT 'cash',                -- cash | pos | bank | mixed
  txn_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  sale_id uuid REFERENCES public.shop_sales(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'payment_in',            -- payment_in | sale_partial | refund
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_pos_payments_customer ON public.pos_payments (customer_id);
CREATE INDEX idx_pos_payments_sale ON public.pos_payments (sale_id);

ALTER TABLE public.pos_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pos_payments admin all"
  ON public.pos_payments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE POLICY "pos_payments staff read"
  ON public.pos_payments FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- POS SALE EDITS  (audit log)
-- ============================================================
CREATE TABLE public.pos_sale_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.shop_sales(id) ON DELETE CASCADE,
  changed_by uuid DEFAULT auth.uid(),
  changed_at timestamptz NOT NULL DEFAULT now(),
  diff jsonb NOT NULL DEFAULT '{}'::jsonb,
  note text
);
CREATE INDEX idx_pos_sale_edits_sale ON public.pos_sale_edits (sale_id, changed_at DESC);

ALTER TABLE public.pos_sale_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pos_sale_edits admin write"
  ON public.pos_sale_edits FOR INSERT TO authenticated
  WITH CHECK (
    (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
    AND changed_by = auth.uid()
  );

CREATE POLICY "pos_sale_edits read"
  ON public.pos_sale_edits FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- Balance function
-- ============================================================
CREATE OR REPLACE FUNCTION public.pos_customer_balance(_customer_id uuid)
RETURNS TABLE(opening numeric, total_sales numeric, total_paid numeric, current_due numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH c AS (
    SELECT COALESCE(opening_due,0) AS opening
    FROM public.pos_customers WHERE id = _customer_id
  ),
  s AS (
    SELECT COALESCE(SUM(due_amount),0) AS sales_due,
           COALESCE(SUM(paid_amount),0) AS sales_paid
    FROM public.shop_sales
    WHERE customer_id = _customer_id AND status <> 'cancelled'
  ),
  p AS (
    SELECT COALESCE(SUM(CASE WHEN kind='payment_in' THEN amount ELSE 0 END),0) AS payments_in
    FROM public.pos_payments
    WHERE customer_id = _customer_id
  )
  SELECT
    c.opening,
    s.sales_due + s.sales_paid AS total_sales,
    s.sales_paid + p.payments_in AS total_paid,
    c.opening + s.sales_due - p.payments_in AS current_due
  FROM c, s, p;
$$;

-- ============================================================
-- Trigger: auto-log sale_partial payment row when sale has paid amount
-- ============================================================
CREATE OR REPLACE FUNCTION public.pos_log_sale_payment()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL
     AND COALESCE(NEW.paid_amount,0) > 0
     AND COALESCE(NEW.status,'completed') <> 'cancelled' THEN
    INSERT INTO public.pos_payments
      (customer_id, amount, method, txn_date, sale_id, kind, notes, created_by)
    VALUES
      (NEW.customer_id, NEW.paid_amount,
       COALESCE(NEW.payment_method,'cash'),
       NEW.txn_date, NEW.id, 'sale_partial',
       'Auto: payment received with sale #' || NEW.invoice_number,
       NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_pos_log_sale_payment
  AFTER INSERT ON public.shop_sales
  FOR EACH ROW EXECUTE FUNCTION public.pos_log_sale_payment();
