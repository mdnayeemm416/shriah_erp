CREATE OR REPLACE FUNCTION public.stock_count_items_page(
  _session_id uuid,
  _limit integer DEFAULT 100,
  _offset integer DEFAULT 0,
  _filter text DEFAULT 'all',
  _search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  session_id uuid,
  product_id uuid,
  barcode text,
  name text,
  category text,
  purchase_price numeric,
  frozen_qty numeric,
  physical_qty numeric,
  counted_at timestamptz,
  counted_by uuid,
  total_count bigint
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_shop uuid;
  v_limit integer := LEAST(GREATEST(COALESCE(_limit, 100), 1), 100);
  v_offset integer := GREATEST(COALESCE(_offset, 0), 0);
  v_filter text := COALESCE(NULLIF(_filter, ''), 'all');
  v_search text := NULLIF(TRIM(COALESCE(_search, '')), '');
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT s.shop_id INTO v_shop
  FROM public.stock_count_sessions s
  WHERE s.id = _session_id AND COALESCE(s.is_deleted, false) = false;

  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF NOT public.user_can_access_shop(auth.uid(), v_shop) THEN
    RAISE EXCEPTION 'Not authorized for this shop';
  END IF;

  RETURN QUERY
  WITH filtered AS (
    SELECT i.*
    FROM public.stock_count_items i
    WHERE i.session_id = _session_id
      AND (
        v_filter = 'all'
        OR (v_filter = 'counted' AND i.physical_qty IS NOT NULL)
        OR (v_filter = 'not_counted' AND i.physical_qty IS NULL)
        OR (v_filter = 'diff' AND i.physical_qty IS NOT NULL AND i.physical_qty <> i.frozen_qty)
        OR (v_filter = 'pos' AND i.physical_qty IS NOT NULL AND i.physical_qty > i.frozen_qty)
        OR (v_filter = 'neg' AND i.physical_qty IS NOT NULL AND i.physical_qty < i.frozen_qty)
      )
      AND (
        v_search IS NULL
        OR i.name ILIKE '%' || v_search || '%'
        OR COALESCE(i.barcode, '') ILIKE '%' || v_search || '%'
      )
  )
  SELECT
    f.id, f.session_id, f.product_id, f.barcode, f.name, f.category,
    f.purchase_price, f.frozen_qty, f.physical_qty, f.counted_at, f.counted_by,
    COUNT(*) OVER() AS total_count
  FROM filtered f
  ORDER BY lower(f.name), f.id
  LIMIT v_limit OFFSET v_offset;
END $$;

GRANT EXECUTE ON FUNCTION public.stock_count_items_page(uuid, integer, integer, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.stock_count_summary(_session_id uuid)
RETURNS TABLE (
  total bigint,
  counted bigint,
  diff_count bigint,
  missing_qty numeric,
  extra_qty numeric,
  diff_value numeric
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_shop uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT s.shop_id INTO v_shop
  FROM public.stock_count_sessions s
  WHERE s.id = _session_id AND COALESCE(s.is_deleted, false) = false;

  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF NOT public.user_can_access_shop(auth.uid(), v_shop) THEN
    RAISE EXCEPTION 'Not authorized for this shop';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*)::bigint AS total,
    COUNT(i.physical_qty)::bigint AS counted,
    COUNT(*) FILTER (WHERE i.physical_qty IS NOT NULL AND i.physical_qty <> i.frozen_qty)::bigint AS diff_count,
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty < i.frozen_qty THEN i.frozen_qty - i.physical_qty ELSE 0 END), 0) AS missing_qty,
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty > i.frozen_qty THEN i.physical_qty - i.frozen_qty ELSE 0 END), 0) AS extra_qty,
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL THEN (i.physical_qty - i.frozen_qty) * COALESCE(i.purchase_price, 0) ELSE 0 END), 0) AS diff_value
  FROM public.stock_count_items i
  WHERE i.session_id = _session_id;
END $$;

GRANT EXECUTE ON FUNCTION public.stock_count_summary(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.refresh_stock_count_progress(_session_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_counted integer;
  v_total integer;
BEGIN
  SELECT COUNT(*), COUNT(physical_qty) INTO v_total, v_counted
  FROM public.stock_count_items
  WHERE session_id = _session_id;

  UPDATE public.stock_count_sessions
     SET counted_products = COALESCE(v_counted, 0),
         total_products = COALESCE(v_total, total_products),
         status = CASE
           WHEN status = 'approved' THEN status
           WHEN COALESCE(v_total, 0) > 0 AND COALESCE(v_counted, 0) >= COALESCE(v_total, 0) THEN 'completed'
           ELSE 'in_progress'
         END,
         updated_at = now()
   WHERE id = _session_id;
END $$;

GRANT EXECUTE ON FUNCTION public.refresh_stock_count_progress(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_stock_count(_session_id uuid, _reason_map jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  IF NOT public.user_can_access_shop(v_uid, v_shop) THEN RAISE EXCEPTION 'Not authorized for this shop'; END IF;

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

    UPDATE public.shop_products
      SET stock = COALESCE(stock,0) + r.diff
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
END $$;

GRANT EXECUTE ON FUNCTION public.approve_stock_count(uuid, jsonb) TO authenticated;