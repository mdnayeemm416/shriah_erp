
-- Banners table
CREATE TABLE IF NOT EXISTS public.shop_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  link_url text,
  title text,
  title_bn text,
  title_ar text,
  message text,
  message_bn text,
  message_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.shop_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_banners public read"
  ON public.shop_banners FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "shop_banners admin all"
  ON public.shop_banners FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

CREATE TRIGGER trg_shop_banners_updated
  BEFORE UPDATE ON public.shop_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- WhatsApp settings
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS store_whatsapp text;

-- Public read for app_settings (only safe public fields are read client-side)
DROP POLICY IF EXISTS "public read settings" ON public.app_settings;
CREATE POLICY "public read settings"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read for shop_categories (already used by store)
DROP POLICY IF EXISTS "shop_categories public read" ON public.shop_categories;
CREATE POLICY "shop_categories public read"
  ON public.shop_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Public read for shop_notifications (used by store)
DROP POLICY IF EXISTS "shop_notifications public read" ON public.shop_notifications;
CREATE POLICY "shop_notifications public read"
  ON public.shop_notifications FOR SELECT
  TO anon, authenticated
  USING (true);
