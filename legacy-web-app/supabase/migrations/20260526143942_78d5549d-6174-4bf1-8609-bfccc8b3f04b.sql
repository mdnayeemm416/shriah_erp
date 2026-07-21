
CREATE OR REPLACE FUNCTION public.pos_customer_balance(_customer_id uuid)
RETURNS TABLE(opening numeric, total_sales numeric, total_paid numeric, current_due numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH c AS (
    SELECT COALESCE(opening_due, 0) AS opening
    FROM public.pos_customers WHERE id = _customer_id
  ),
  s AS (
    SELECT
      COALESCE(SUM(total), 0) AS total_sales,
      COALESCE(SUM(paid_amount), 0) AS sales_paid,
      COALESCE(SUM(due_amount), 0) AS sales_due
    FROM public.shop_sales
    WHERE customer_id = _customer_id
      AND COALESCE(is_deleted, false) = false
      AND COALESCE(status, '') <> 'cancelled'
  ),
  p AS (
    SELECT COALESCE(SUM(amount), 0) AS payments_in
    FROM public.pos_payments pp
    WHERE pp.customer_id = _customer_id
      AND pp.kind = 'payment_in'
      AND (
        pp.sale_id IS NULL
        OR NOT EXISTS (
          SELECT 1 FROM public.shop_sales ss
          WHERE ss.id = pp.sale_id AND COALESCE(ss.is_deleted, false) = true
        )
      )
  )
  SELECT
    c.opening,
    s.total_sales,
    (s.sales_paid + p.payments_in) AS total_paid,
    (c.opening + s.sales_due - p.payments_in) AS current_due
  FROM c, s, p;
$$;

GRANT EXECUTE ON FUNCTION public.pos_customer_balance(uuid) TO authenticated, anon, service_role;

CREATE TABLE IF NOT EXISTS public.pos_customer_opening_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  old_value numeric NOT NULL DEFAULT 0,
  new_value numeric NOT NULL DEFAULT 0,
  note text,
  changed_by uuid DEFAULT auth.uid(),
  changed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.pos_customer_opening_edits TO authenticated;
GRANT ALL ON public.pos_customer_opening_edits TO service_role;

ALTER TABLE public.pos_customer_opening_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opening_edits read auth"
  ON public.pos_customer_opening_edits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "opening_edits insert admin"
  ON public.pos_customer_opening_edits
  FOR INSERT TO authenticated
  WITH CHECK (
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
    AND changed_by = auth.uid()
  );

CREATE INDEX IF NOT EXISTS idx_pos_customer_opening_edits_cust
  ON public.pos_customer_opening_edits(customer_id, changed_at DESC);
