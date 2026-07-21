DROP POLICY IF EXISTS "public read settings" ON public.app_settings;

DROP POLICY IF EXISTS "shop_products public read" ON public.shop_products;

DROP POLICY IF EXISTS "shop_products auth read" ON public.shop_products;
CREATE POLICY "shop_products auth read"
  ON public.shop_products
  FOR SELECT
  TO authenticated
  USING (true);

REVOKE SELECT ON public.shop_products FROM anon;

DROP VIEW IF EXISTS public.shop_products_public;
CREATE VIEW public.shop_products_public
WITH (security_invoker = true) AS
SELECT
  id, name, name_bn, name_ar, description, image_url, gallery_image_urls,
  price, stock, show_stock, min_stock,
  category_id, category_ids, warehouse_item_id, item_code, barcode,
  tax_rate, tax_inclusive, is_visible, is_featured, sort_order,
  search_keywords, location, created_at, updated_at
FROM public.shop_products
WHERE is_visible = true AND COALESCE(is_deleted, false) = false;

GRANT SELECT ON public.shop_products_public TO anon, authenticated;