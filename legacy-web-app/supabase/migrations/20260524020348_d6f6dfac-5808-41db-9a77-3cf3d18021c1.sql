
-- Shared timestamp helper (idempotent)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Enums
CREATE TYPE public.shop_order_status AS ENUM ('pending','confirmed','preparing','delivered','cancelled');
CREATE TYPE public.shop_notification_type AS ENUM ('offer','stock','new_product','important');

-- Categories
CREATE TABLE public.shop_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_bn text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.shop_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_categories public read" ON public.shop_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "shop_categories admin all" ON public.shop_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

-- Products
CREATE TABLE public.shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_bn text,
  description text,
  image_url text,
  price numeric NOT NULL DEFAULT 0,
  stock numeric NOT NULL DEFAULT 0,
  category_id uuid REFERENCES public.shop_categories(id) ON DELETE SET NULL,
  warehouse_item_id uuid REFERENCES public.warehouse_items(id) ON DELETE SET NULL,
  is_visible boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  show_stock boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_products public read" ON public.shop_products FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "shop_products admin all" ON public.shop_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE INDEX idx_shop_products_visible ON public.shop_products(is_visible) WHERE is_visible = true;
CREATE INDEX idx_shop_products_category ON public.shop_products(category_id);

-- Orders
CREATE TABLE public.shop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number serial UNIQUE,
  customer_name text NOT NULL,
  customer_mobile text NOT NULL,
  customer_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  status public.shop_order_status NOT NULL DEFAULT 'pending',
  notes text,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_orders public insert" ON public.shop_orders FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(customer_name)) BETWEEN 1 AND 100
    AND length(trim(customer_mobile)) BETWEEN 4 AND 20
    AND jsonb_typeof(items) = 'array'
  );
CREATE POLICY "shop_orders admin read" ON public.shop_orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "shop_orders admin update" ON public.shop_orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE POLICY "shop_orders admin delete" ON public.shop_orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_shop_orders_status ON public.shop_orders(status);
CREATE INDEX idx_shop_orders_created ON public.shop_orders(created_at DESC);

-- Ad popup
CREATE TABLE public.shop_ad_popup (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title text,
  message text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shop_ad_popup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_ad_popup public read" ON public.shop_ad_popup FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "shop_ad_popup admin insert" ON public.shop_ad_popup FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
CREATE POLICY "shop_ad_popup admin update" ON public.shop_ad_popup FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));
INSERT INTO public.shop_ad_popup (id, is_active) VALUES (1, false);

-- Notifications
CREATE TABLE public.shop_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  type public.shop_notification_type NOT NULL DEFAULT 'important',
  is_active boolean NOT NULL DEFAULT true,
  is_pinned boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.shop_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_notifications public read" ON public.shop_notifications FOR SELECT TO anon, authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "shop_notifications admin all" ON public.shop_notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

-- updated_at triggers
CREATE TRIGGER shop_products_updated_at BEFORE UPDATE ON public.shop_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER shop_categories_updated_at BEFORE UPDATE ON public.shop_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER shop_orders_updated_at BEFORE UPDATE ON public.shop_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
