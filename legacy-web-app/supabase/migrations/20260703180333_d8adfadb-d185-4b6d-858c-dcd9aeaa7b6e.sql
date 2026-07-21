
-- Fix FK: stock_count_items.product_id must reference wholesale warehouse_items, not shop_products
ALTER TABLE public.stock_count_items
  DROP CONSTRAINT IF EXISTS stock_count_items_product_id_fkey;

-- Remove any orphan rows that don't map to a current warehouse_items record
DELETE FROM public.stock_count_items sci
WHERE NOT EXISTS (SELECT 1 FROM public.warehouse_items w WHERE w.id = sci.product_id);

ALTER TABLE public.stock_count_items
  ADD CONSTRAINT stock_count_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.warehouse_items(id) ON DELETE CASCADE;

-- Harden snapshot function: only insert products that exist and are not soft-deleted
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

  INSERT INTO public.stock_count_items
    (session_id, product_id, barcode, name, category, purchase_price, frozen_qty)
  SELECT _session_id, w.id, NULL, w.product_name, NULL,
         COALESCE(w.purchase_price, 0),
         COALESCE(w.quantity, 0)
  FROM public.warehouse_items w
  WHERE COALESCE(w.is_deleted,false) = false
    AND w.id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.warehouse_items x WHERE x.id = w.id);

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.stock_count_sessions
    SET total_products = v_count, status = 'in_progress', updated_at = now()
  WHERE id = _session_id;

  RETURN v_count;
END $function$;
