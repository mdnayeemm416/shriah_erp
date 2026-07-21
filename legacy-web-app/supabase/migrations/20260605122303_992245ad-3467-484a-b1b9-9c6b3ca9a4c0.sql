
-- Allow public (anon) customers to update or cancel their own pending orders,
-- validated by matching the customer's mobile number.

CREATE OR REPLACE FUNCTION public.cancel_public_shop_order(
  _order_id uuid,
  _customer_mobile text
) RETURNS public.shop_order_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status public.shop_order_status;
  v_mobile text;
BEGIN
  IF _order_id IS NULL OR _customer_mobile IS NULL OR length(trim(_customer_mobile)) = 0 THEN
    RAISE EXCEPTION 'Invalid request';
  END IF;

  SELECT status, customer_mobile INTO v_status, v_mobile
  FROM public.shop_orders
  WHERE id = _order_id AND COALESCE(is_deleted,false) = false
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF regexp_replace(coalesce(v_mobile,''), '\D', '', 'g')
     <> regexp_replace(trim(_customer_mobile), '\D', '', 'g')
     OR length(regexp_replace(trim(_customer_mobile), '\D', '', 'g')) = 0 THEN
    RAISE EXCEPTION 'Mobile number does not match';
  END IF;

  IF v_status <> 'pending'::public.shop_order_status THEN
    RAISE EXCEPTION 'This order can no longer be cancelled';
  END IF;

  UPDATE public.shop_orders
    SET status = 'cancelled'::public.shop_order_status,
        updated_at = now()
  WHERE id = _order_id;

  RETURN 'cancelled'::public.shop_order_status;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_public_shop_order(
  _order_id uuid,
  _customer_mobile text,
  _items jsonb,
  _total numeric,
  _notes text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status public.shop_order_status;
  v_mobile text;
  v_name text;
  v_address text;
BEGIN
  IF _order_id IS NULL OR _customer_mobile IS NULL OR length(trim(_customer_mobile)) = 0 THEN
    RAISE EXCEPTION 'Invalid request';
  END IF;

  SELECT status, customer_mobile, customer_name, customer_address
    INTO v_status, v_mobile, v_name, v_address
  FROM public.shop_orders
  WHERE id = _order_id AND COALESCE(is_deleted,false) = false
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF regexp_replace(coalesce(v_mobile,''), '\D', '', 'g')
     <> regexp_replace(trim(_customer_mobile), '\D', '', 'g')
     OR length(regexp_replace(trim(_customer_mobile), '\D', '', 'g')) = 0 THEN
    RAISE EXCEPTION 'Mobile number does not match';
  END IF;

  IF v_status <> 'pending'::public.shop_order_status THEN
    RAISE EXCEPTION 'This order can no longer be edited';
  END IF;

  -- Reuse existing validator (validates item shape, totals, product visibility)
  IF NOT public.is_valid_public_shop_order(
    v_name,
    v_mobile,
    v_address,
    _items,
    _total,
    'pending'::public.shop_order_status,
    _notes,
    NULL,
    false
  ) THEN
    RAISE EXCEPTION 'Invalid order details';
  END IF;

  UPDATE public.shop_orders
    SET items = _items,
        total = _total,
        notes = NULLIF(trim(coalesce(_notes,'')), ''),
        admin_notes = CASE
          WHEN admin_notes IS NULL OR admin_notes = '' THEN '[Customer edited ' || to_char(now(),'YYYY-MM-DD HH24:MI') || ']'
          ELSE admin_notes || E'\n[Customer edited ' || to_char(now(),'YYYY-MM-DD HH24:MI') || ']'
        END,
        updated_at = now()
  WHERE id = _order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_public_shop_order(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_public_shop_order(uuid, text, jsonb, numeric, text) TO anon, authenticated;
