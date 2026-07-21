
ALTER TABLE public.shop_products
  ADD COLUMN IF NOT EXISTS item_code text,
  ADD COLUMN IF NOT EXISTS min_stock numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS search_keywords text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS purchase_price numeric NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS shop_products_item_code_unique
  ON public.shop_products (lower(item_code))
  WHERE item_code IS NOT NULL AND length(trim(item_code)) > 0;

CREATE INDEX IF NOT EXISTS shop_products_search_keywords_gin
  ON public.shop_products USING gin (search_keywords);
