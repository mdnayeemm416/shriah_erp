
CREATE TABLE IF NOT EXISTS public.wholesale_stock_checks (
  product_id UUID PRIMARY KEY REFERENCES public.shop_products(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wholesale_stock_checks TO authenticated;
GRANT ALL ON public.wholesale_stock_checks TO service_role;

ALTER TABLE public.wholesale_stock_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read stock checks"
  ON public.wholesale_stock_checks FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "auth mark stock checks"
  ON public.wholesale_stock_checks FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "auth update stock checks"
  ON public.wholesale_stock_checks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth delete stock checks"
  ON public.wholesale_stock_checks FOR DELETE
  TO authenticated USING (true);
