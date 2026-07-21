
CREATE TABLE public.price_compare_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  barcode TEXT,
  category TEXT,
  brand TEXT,
  unit TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_compare_products TO authenticated;
GRANT ALL ON public.price_compare_products TO service_role;
ALTER TABLE public.price_compare_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pc products" ON public.price_compare_products
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX price_compare_products_user_idx ON public.price_compare_products(user_id);
CREATE INDEX price_compare_products_barcode_idx ON public.price_compare_products(user_id, barcode);

CREATE TABLE public.price_compare_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.price_compare_products(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  market_name TEXT,
  supplier_name TEXT,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC,
  offer_price NUMERIC,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_compare_records TO authenticated;
GRANT ALL ON public.price_compare_records TO service_role;
ALTER TABLE public.price_compare_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pc records" ON public.price_compare_records
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX price_compare_records_product_idx ON public.price_compare_records(product_id, record_date DESC);
CREATE INDEX price_compare_records_user_idx ON public.price_compare_records(user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER pc_products_updated_at BEFORE UPDATE ON public.price_compare_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER pc_records_updated_at BEFORE UPDATE ON public.price_compare_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
