ALTER TABLE public.shop_categories ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS shop_categories_slug_unique ON public.shop_categories (lower(slug)) WHERE slug IS NOT NULL;

UPDATE public.shop_categories SET slug = 'best-seller'  WHERE slug IS NULL AND lower(name) IN ('best seller','best sellers','bestseller','bestsellers');
UPDATE public.shop_categories SET slug = 'new-arrival'  WHERE slug IS NULL AND lower(name) IN ('new arrival','new arrivals','new');
UPDATE public.shop_categories SET slug = 'offer'        WHERE slug IS NULL AND lower(name) IN ('offer','offers','offer items','offer item','deals','deal');
UPDATE public.shop_categories SET slug = 'recommended'  WHERE slug IS NULL AND lower(name) IN ('recommended','recommend','staff picks');