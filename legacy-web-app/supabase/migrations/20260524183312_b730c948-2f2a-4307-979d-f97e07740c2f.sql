ALTER TABLE public.shop_products
  ADD COLUMN IF NOT EXISTS gallery_image_urls text[] NOT NULL DEFAULT '{}'::text[];