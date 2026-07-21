-- Public shop order creation must not depend on auth.uid().
-- Keep customer order data private: anon can create only, not read/update/delete.

CREATE OR REPLACE FUNCTION public.is_valid_public_shop_order(
  _customer_name text,
  _customer_mobile text,
  _customer_address text,
  _items jsonb,
  _total numeric,
  _status public.shop_order_status,
  _notes text,
  _admin_notes text,
  _is_deleted boolean
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  product_id_text text;
  product_id_value uuid;
  qty_text text;
  price_text text;
  qty_value numeric;
  price_value numeric;
  expected_total numeric := 0;
BEGIN
  IF length(trim(coalesce(_customer_name, ''))) NOT BETWEEN 1 AND 100 THEN
    RETURN false;
  END IF;

  IF length(trim(coalesce(_customer_mobile, ''))) NOT BETWEEN 4 AND 20 THEN
    RETURN false;
  END IF;

  IF trim(coalesce(_customer_mobile, '')) !~ '^[0-9+() -]{4,20}$' THEN
    RETURN false;
  END IF;

  IF length(coalesce(_customer_address, '')) > 500 THEN
    RETURN false;
  END IF;

  IF length(coalesce(_notes, '')) > 1000 THEN
    RETURN false;
  END IF;

  IF coalesce(length(trim(coalesce(_admin_notes, ''))), 0) > 0 THEN
    RETURN false;
  END IF;

  IF _status <> 'pending'::public.shop_order_status THEN
    RETURN false;
  END IF;

  IF coalesce(_is_deleted, false) <> false THEN
    RETURN false;
  END IF;

  IF coalesce(_total, 0) <= 0 THEN
    RETURN false;
  END IF;

  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) NOT BETWEEN 1 AND 100 THEN
    RETURN false;
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    IF jsonb_typeof(item) <> 'object' THEN
      RETURN false;
    END IF;

    product_id_text := coalesce(item->>'id', item->>'product_id', '');
    IF product_id_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      RETURN false;
    END IF;
    product_id_value := product_id_text::uuid;

    IF length(trim(coalesce(item->>'name', ''))) NOT BETWEEN 1 AND 250 THEN
      RETURN false;
    END IF;

    qty_text := coalesce(item->>'qty', '');
    price_text := coalesce(item->>'price', '');

    IF qty_text !~ '^\d+(\.\d{1,3})?$' OR price_text !~ '^\d+(\.\d{1,2})?$' THEN
      RETURN false;
    END IF;

    qty_value := qty_text::numeric;
    price_value := price_text::numeric;

    IF qty_value <= 0 OR qty_value > 10000 OR price_value < 0 THEN
      RETURN false;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.shop_products p
      WHERE p.id = product_id_value
        AND coalesce(p.is_visible, false) = true
        AND coalesce(p.is_deleted, false) = false
    ) THEN
      RETURN false;
    END IF;

    expected_total := expected_total + (qty_value * price_value);
  END LOOP;

  IF abs(expected_total - _total) > 0.05 THEN
    RETURN false;
  END IF;

  RETURN true;
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_public_shop_order(
  _customer_name text,
  _customer_mobile text,
  _customer_address text,
  _notes text,
  _items jsonb,
  _total numeric
)
RETURNS TABLE(id uuid, order_number integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_order public.shop_orders%ROWTYPE;
BEGIN
  IF NOT public.is_valid_public_shop_order(
    _customer_name,
    _customer_mobile,
    _customer_address,
    _items,
    _total,
    'pending'::public.shop_order_status,
    _notes,
    NULL,
    false
  ) THEN
    RAISE EXCEPTION 'Invalid order details';
  END IF;

  INSERT INTO public.shop_orders (
    customer_name,
    customer_mobile,
    customer_address,
    notes,
    items,
    total,
    status,
    admin_notes,
    is_deleted
  )
  VALUES (
    trim(_customer_name),
    trim(_customer_mobile),
    NULLIF(trim(coalesce(_customer_address, '')), ''),
    NULLIF(trim(coalesce(_notes, '')), ''),
    _items,
    _total,
    'pending'::public.shop_order_status,
    NULL,
    false
  )
  RETURNING * INTO inserted_order;

  id := inserted_order.id;
  order_number := inserted_order.order_number;
  RETURN NEXT;
END;
$$;

REVOKE SELECT, UPDATE, DELETE ON public.shop_orders FROM anon;
GRANT INSERT ON public.shop_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_orders TO authenticated;
GRANT ALL ON public.shop_orders TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.shop_orders_order_number_seq TO anon, authenticated;
GRANT ALL ON SEQUENCE public.shop_orders_order_number_seq TO service_role;
GRANT EXECUTE ON FUNCTION public.create_public_shop_order(text, text, text, text, jsonb, numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_public_shop_order(text, text, text, jsonb, numeric, public.shop_order_status, text, text, boolean) TO anon, authenticated;

ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop_orders public insert" ON public.shop_orders;
DROP POLICY IF EXISTS "shop_orders admin insert" ON public.shop_orders;
DROP POLICY IF EXISTS "shop_orders admin read" ON public.shop_orders;
DROP POLICY IF EXISTS "shop_orders admin update" ON public.shop_orders;
DROP POLICY IF EXISTS "shop_orders admin delete" ON public.shop_orders;

CREATE POLICY "shop_orders public insert"
ON public.shop_orders
FOR INSERT
TO anon
WITH CHECK (
  public.is_valid_public_shop_order(
    customer_name,
    customer_mobile,
    customer_address,
    items,
    total,
    status,
    notes,
    admin_notes,
    is_deleted
  )
);

CREATE POLICY "shop_orders admin insert"
ON public.shop_orders
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "shop_orders admin read"
ON public.shop_orders
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
  OR public.has_role(auth.uid(), 'manager'::public.app_role)
  OR public.has_role(auth.uid(), 'staff'::public.app_role)
);

CREATE POLICY "shop_orders admin update"
ON public.shop_orders
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "shop_orders admin delete"
ON public.shop_orders
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

DO $$
BEGIN
  IF to_regclass('public.shop_order_items') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.shop_order_items ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT, UPDATE, DELETE ON public.shop_order_items FROM anon';
    EXECUTE 'GRANT INSERT ON public.shop_order_items TO anon';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_order_items TO authenticated';
    EXECUTE 'GRANT ALL ON public.shop_order_items TO service_role';

    EXECUTE 'DROP POLICY IF EXISTS "shop_order_items public insert" ON public.shop_order_items';
    EXECUTE 'DROP POLICY IF EXISTS "shop_order_items admin read" ON public.shop_order_items';
    EXECUTE 'DROP POLICY IF EXISTS "shop_order_items admin update" ON public.shop_order_items';
    EXECUTE 'DROP POLICY IF EXISTS "shop_order_items admin delete" ON public.shop_order_items';

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'shop_order_items'
        AND column_name IN ('order_id', 'product_id', 'qty')
      GROUP BY table_schema, table_name
      HAVING count(*) = 3
    ) THEN
      EXECUTE 'CREATE POLICY "shop_order_items public insert" ON public.shop_order_items FOR INSERT TO anon WITH CHECK (order_id IS NOT NULL AND product_id IS NOT NULL AND qty > 0)';
    END IF;

    EXECUTE 'CREATE POLICY "shop_order_items admin read" ON public.shop_order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''::public.app_role) OR public.has_role(auth.uid(), ''super_admin''::public.app_role) OR public.has_role(auth.uid(), ''manager''::public.app_role) OR public.has_role(auth.uid(), ''staff''::public.app_role))';
    EXECUTE 'CREATE POLICY "shop_order_items admin update" ON public.shop_order_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''::public.app_role) OR public.has_role(auth.uid(), ''super_admin''::public.app_role)) WITH CHECK (public.has_role(auth.uid(), ''admin''::public.app_role) OR public.has_role(auth.uid(), ''super_admin''::public.app_role))';
    EXECUTE 'CREATE POLICY "shop_order_items admin delete" ON public.shop_order_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''::public.app_role) OR public.has_role(auth.uid(), ''super_admin''::public.app_role))';
  END IF;
END $$;