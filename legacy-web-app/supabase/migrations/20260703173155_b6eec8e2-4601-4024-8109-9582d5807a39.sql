
DROP FUNCTION IF EXISTS public.stock_count_summary(uuid);

CREATE FUNCTION public.stock_count_summary(_session_id uuid)
RETURNS TABLE(
  total bigint,
  counted bigint,
  diff_count bigint,
  missing_qty numeric,
  extra_qty numeric,
  diff_value numeric,
  prev_total_qty numeric,
  curr_total_qty numeric,
  prev_total_value numeric,
  curr_total_value numeric,
  extra_products bigint,
  missing_products bigint,
  nodiff_products bigint,
  extra_value numeric,
  missing_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    COUNT(*)::bigint,
    COUNT(i.physical_qty)::bigint,
    COUNT(*) FILTER (WHERE i.physical_qty IS NOT NULL AND i.physical_qty <> i.frozen_qty)::bigint,
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty < i.frozen_qty THEN i.frozen_qty - i.physical_qty ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty > i.frozen_qty THEN i.physical_qty - i.frozen_qty ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL THEN (i.physical_qty - i.frozen_qty) * COALESCE(i.purchase_price, 0) ELSE 0 END), 0),
    COALESCE(SUM(i.frozen_qty), 0),
    COALESCE(SUM(COALESCE(i.physical_qty, i.frozen_qty)), 0),
    COALESCE(SUM(i.frozen_qty * COALESCE(i.purchase_price, 0)), 0),
    COALESCE(SUM(COALESCE(i.physical_qty, i.frozen_qty) * COALESCE(i.purchase_price, 0)), 0),
    COUNT(*) FILTER (WHERE i.physical_qty IS NOT NULL AND i.physical_qty > i.frozen_qty)::bigint,
    COUNT(*) FILTER (WHERE i.physical_qty IS NOT NULL AND i.physical_qty < i.frozen_qty)::bigint,
    COUNT(*) FILTER (WHERE i.physical_qty IS NOT NULL AND i.physical_qty = i.frozen_qty)::bigint,
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty > i.frozen_qty THEN (i.physical_qty - i.frozen_qty) * COALESCE(i.purchase_price, 0) ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN i.physical_qty IS NOT NULL AND i.physical_qty < i.frozen_qty THEN (i.frozen_qty - i.physical_qty) * COALESCE(i.purchase_price, 0) ELSE 0 END), 0)
  FROM public.stock_count_items i
  WHERE i.session_id = _session_id;
END $function$;

GRANT EXECUTE ON FUNCTION public.stock_count_summary(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.stock_count_items_page(_session_id uuid, _limit integer DEFAULT 100, _offset integer DEFAULT 0, _filter text DEFAULT 'all'::text, _search text DEFAULT NULL::text)
RETURNS TABLE(id uuid, session_id uuid, product_id uuid, barcode text, name text, category text, purchase_price numeric, frozen_qty numeric, physical_qty numeric, counted_at timestamp with time zone, counted_by uuid, total_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
        OR (v_filter = 'nodiff' AND i.physical_qty IS NOT NULL AND i.physical_qty = i.frozen_qty)
      )
      AND (
        v_search IS NULL
        OR i.name ILIKE '%' || v_search || '%'
        OR COALESCE(i.barcode,'') ILIKE '%' || v_search || '%'
      )
  ), counted AS (
    SELECT count(*)::bigint AS n FROM filtered
  )
  SELECT f.id, f.session_id, f.product_id, f.barcode, f.name, f.category, f.purchase_price,
         f.frozen_qty, f.physical_qty, f.counted_at, f.counted_by,
         (SELECT n FROM counted)
  FROM filtered f
  ORDER BY f.name ASC
  LIMIT v_limit OFFSET v_offset;
END $function$;

CREATE OR REPLACE FUNCTION public.reset_stock_count_session(_session_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_shop uuid;
  v_status text;
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT shop_id, status INTO v_shop, v_status
  FROM public.stock_count_sessions
  WHERE id = _session_id AND COALESCE(is_deleted,false) = false
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;

  IF NOT public.user_can_access_shop(auth.uid(), v_shop) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF v_status = 'approved' THEN
    RAISE EXCEPTION 'Cannot reset an approved session';
  END IF;

  DELETE FROM public.stock_count_items WHERE session_id = _session_id;

  INSERT INTO public.stock_count_items
    (session_id, product_id, barcode, name, category, purchase_price, frozen_qty)
  SELECT _session_id, w.id, NULL, w.product_name, NULL,
         COALESCE(w.purchase_price, 0),
         COALESCE(w.quantity, 0)
  FROM public.warehouse_items w
  WHERE COALESCE(w.is_deleted,false) = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.stock_count_sessions
    SET total_products = v_count,
        counted_products = 0,
        diff_qty = 0,
        diff_value = 0,
        status = 'in_progress',
        updated_at = now()
  WHERE id = _session_id;

  RETURN v_count;
END $function$;

GRANT EXECUTE ON FUNCTION public.reset_stock_count_session(uuid) TO authenticated;
