
DROP FUNCTION IF EXISTS public.start_stock_count_session(uuid);

CREATE FUNCTION public.start_stock_count_session(_session_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_count integer;
BEGIN
  DELETE FROM public.stock_count_items WHERE session_id = _session_id;

  INSERT INTO public.stock_count_items
    (session_id, product_id, barcode, name, category, purchase_price, frozen_qty)
  SELECT _session_id,
         p.id,
         NULLIF(p.barcode,''),
         p.name,
         NULL,
         COALESCE(p.purchase_price, 0),
         COALESCE(p.stock, 0)
  FROM public.shop_products p
  WHERE COALESCE(p.is_deleted, false) = false;

  SELECT count(*) INTO v_count FROM public.stock_count_items WHERE session_id = _session_id;

  UPDATE public.stock_count_sessions
     SET total_products = v_count,
         counted_products = 0,
         updated_at = now()
   WHERE id = _session_id;

  RETURN v_count;
END $$;

DELETE FROM public.stock_count_items i
 WHERE NOT EXISTS (SELECT 1 FROM public.shop_products p WHERE p.id = i.product_id);

ALTER TABLE public.stock_count_items
  DROP CONSTRAINT IF EXISTS stock_count_items_product_id_fkey;

ALTER TABLE public.stock_count_items
  ADD CONSTRAINT stock_count_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.shop_products(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.end_stock_count_session(_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_status text;
  v_shop uuid;
  v_uid uuid := auth.uid();
  v_total_diff_qty numeric := 0;
  v_total_diff_val numeric := 0;
  v_rows integer := 0;
  r record;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT status, shop_id INTO v_status, v_shop
    FROM public.stock_count_sessions
   WHERE id = _session_id AND COALESCE(is_deleted,false) = false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF v_status = 'approved' THEN RAISE EXCEPTION 'Session already ended'; END IF;
  IF NOT public.user_can_access_shop(v_uid, v_shop) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.stock_count_adjustments WHERE session_id = _session_id;

  FOR r IN
    SELECT i.product_id, i.name, i.purchase_price, i.frozen_qty, i.physical_qty,
           (i.physical_qty - i.frozen_qty) AS diff
      FROM public.stock_count_items i
     WHERE i.session_id = _session_id
       AND i.physical_qty IS NOT NULL
       AND i.physical_qty <> i.frozen_qty
  LOOP
    INSERT INTO public.stock_count_adjustments
      (session_id, product_id, product_name, system_qty, physical_qty,
       diff_qty, diff_value, reason, note, created_by)
    VALUES
      (_session_id, r.product_id, r.name, r.frozen_qty, r.physical_qty, r.diff,
       r.diff * COALESCE(r.purchase_price,0),
       'Stock Count End', NULL, v_uid);

    UPDATE public.shop_products
       SET stock = COALESCE(stock,0) + r.diff,
           updated_at = now()
     WHERE id = r.product_id;

    v_total_diff_qty := v_total_diff_qty + r.diff;
    v_total_diff_val := v_total_diff_val + (r.diff * COALESCE(r.purchase_price,0));
    v_rows := v_rows + 1;
  END LOOP;

  UPDATE public.stock_count_sessions
     SET status = 'approved',
         approved_by = v_uid,
         approved_at = now(),
         diff_qty = v_total_diff_qty,
         diff_value = v_total_diff_val,
         updated_at = now()
   WHERE id = _session_id;

  RETURN jsonb_build_object(
    'adjustments', v_rows,
    'diff_qty', v_total_diff_qty,
    'diff_value', v_total_diff_val
  );
END $$;

CREATE OR REPLACE FUNCTION public.reset_stock_count_session(_session_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_status text;
  v_shop uuid;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT status, shop_id INTO v_status, v_shop
    FROM public.stock_count_sessions
   WHERE id = _session_id AND COALESCE(is_deleted,false)=false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF v_status = 'approved' THEN RAISE EXCEPTION 'Cannot reset an ended session'; END IF;
  IF NOT public.user_can_access_shop(v_uid, v_shop) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN public.start_stock_count_session(_session_id);
END $$;

-- Re-seed current active (non-approved) sessions so products appear immediately
DO $$
DECLARE s record;
BEGIN
  FOR s IN SELECT id FROM public.stock_count_sessions
            WHERE COALESCE(is_deleted,false)=false AND status <> 'approved'
  LOOP
    PERFORM public.start_stock_count_session(s.id);
  END LOOP;
END $$;
