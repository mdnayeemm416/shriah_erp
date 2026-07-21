
-- Repoint stock count to Wholesale (warehouse_items) instead of Shop (shop_products).

CREATE OR REPLACE FUNCTION public.start_stock_count_session(_session_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_shop uuid;
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT shop_id INTO v_shop FROM public.stock_count_sessions
    WHERE id = _session_id AND COALESCE(is_deleted,false) = false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;

  IF NOT public.user_can_access_shop(auth.uid(), v_shop) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF EXISTS (SELECT 1 FROM public.stock_count_items WHERE session_id = _session_id LIMIT 1) THEN
    SELECT count(*) INTO v_count FROM public.stock_count_items WHERE session_id = _session_id;
    RETURN v_count;
  END IF;

  -- Snapshot from Wholesale warehouse_items (no shop link, no barcode/category).
  INSERT INTO public.stock_count_items
    (session_id, product_id, barcode, name, category, purchase_price, frozen_qty)
  SELECT _session_id, w.id, NULL, w.product_name, NULL,
         COALESCE(w.purchase_price, 0),
         COALESCE(w.quantity, 0)
  FROM public.warehouse_items w
  WHERE COALESCE(w.is_deleted,false) = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.stock_count_sessions
    SET total_products = v_count, status = 'in_progress', updated_at = now()
  WHERE id = _session_id;

  RETURN v_count;
END $function$;

CREATE OR REPLACE FUNCTION public.approve_stock_count(_session_id uuid, _reason_map jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_status text;
  v_shop uuid;
  v_uid uuid := auth.uid();
  v_uncounted integer;
  v_total_diff_qty numeric := 0;
  v_total_diff_val numeric := 0;
  v_rows integer := 0;
  r record;
  v_reason text;
  v_note text;
  v_default_reason text;
  v_default_note text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(v_uid, 'admin') THEN RAISE EXCEPTION 'Admins only'; END IF;

  SELECT status, shop_id INTO v_status, v_shop FROM public.stock_count_sessions
    WHERE id = _session_id AND COALESCE(is_deleted,false) = false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF v_status = 'approved' THEN RAISE EXCEPTION 'Session already approved'; END IF;
  IF NOT public.user_can_access_shop(v_uid, v_shop) THEN RAISE EXCEPTION 'Not authorized'; END IF;

  SELECT COUNT(*) INTO v_uncounted
  FROM public.stock_count_items
  WHERE session_id = _session_id AND physical_qty IS NULL;
  IF COALESCE(v_uncounted, 0) > 0 THEN
    RAISE EXCEPTION 'Cannot approve: % products are not counted', v_uncounted;
  END IF;

  v_default_reason := NULLIF(_reason_map->'_default'->>'reason', '');
  v_default_note   := NULLIF(_reason_map->'_default'->>'note', '');
  IF v_default_reason IS NULL THEN RAISE EXCEPTION 'Approval reason is required'; END IF;

  DELETE FROM public.stock_count_adjustments WHERE session_id = _session_id;

  FOR r IN
    SELECT i.product_id, i.name, i.purchase_price, i.frozen_qty, i.physical_qty,
           (i.physical_qty - i.frozen_qty) AS diff
    FROM public.stock_count_items i
    WHERE i.session_id = _session_id
      AND i.physical_qty IS NOT NULL
      AND i.physical_qty <> i.frozen_qty
  LOOP
    v_reason := COALESCE(NULLIF(_reason_map->r.product_id::text->>'reason', ''), v_default_reason);
    v_note   := COALESCE(NULLIF(_reason_map->r.product_id::text->>'note', ''),   v_default_note);

    INSERT INTO public.stock_count_adjustments
      (session_id, product_id, product_name, system_qty, physical_qty, diff_qty, diff_value, reason, note, created_by)
    VALUES
      (_session_id, r.product_id, r.name, r.frozen_qty, r.physical_qty, r.diff,
       r.diff * COALESCE(r.purchase_price,0), v_reason, v_note, v_uid);

    -- Apply to Wholesale warehouse_items instead of Shop.
    UPDATE public.warehouse_items
      SET quantity = COALESCE(quantity,0) + r.diff
      WHERE id = r.product_id;

    v_total_diff_qty := v_total_diff_qty + r.diff;
    v_total_diff_val := v_total_diff_val + (r.diff * COALESCE(r.purchase_price,0));
    v_rows := v_rows + 1;
  END LOOP;

  UPDATE public.stock_count_sessions
    SET status = 'approved',
        approved_by = v_uid,
        approved_at = now(),
        counted_products = total_products,
        diff_qty = v_total_diff_qty,
        diff_value = v_total_diff_val,
        updated_at = now()
  WHERE id = _session_id;

  RETURN jsonb_build_object('adjustments', v_rows, 'diff_qty', v_total_diff_qty, 'diff_value', v_total_diff_val);
END $function$;
