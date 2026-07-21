
ALTER TABLE public.shop_products
  ADD COLUMN IF NOT EXISTS barcode text,
  ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS tax_inclusive boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_shop_products_barcode ON public.shop_products(barcode) WHERE barcode IS NOT NULL;

-- Public storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('shop-product-images', 'shop-product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
DROP POLICY IF EXISTS "shop_product_images public read" ON storage.objects;
CREATE POLICY "shop_product_images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-product-images');

DROP POLICY IF EXISTS "shop_product_images admin insert" ON storage.objects;
CREATE POLICY "shop_product_images admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'shop-product-images'
    AND (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'manager'::public.app_role))
  );

DROP POLICY IF EXISTS "shop_product_images admin update" ON storage.objects;
CREATE POLICY "shop_product_images admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'shop-product-images'
    AND (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'manager'::public.app_role))
  );

DROP POLICY IF EXISTS "shop_product_images admin delete" ON storage.objects;
CREATE POLICY "shop_product_images admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'shop-product-images'
    AND (public.has_role(auth.uid(),'admin'::public.app_role) OR public.has_role(auth.uid(),'manager'::public.app_role))
  );
