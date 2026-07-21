ALTER TABLE public.shop_products ADD COLUMN IF NOT EXISTS category_ids uuid[] NOT NULL DEFAULT '{}';
UPDATE public.shop_products SET category_ids = ARRAY[category_id] WHERE category_id IS NOT NULL AND (category_ids IS NULL OR array_length(category_ids,1) IS NULL);
CREATE INDEX IF NOT EXISTS idx_shop_products_category_ids ON public.shop_products USING GIN(category_ids);