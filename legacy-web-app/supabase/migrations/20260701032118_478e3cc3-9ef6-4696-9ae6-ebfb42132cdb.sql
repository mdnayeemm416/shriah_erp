
CREATE TABLE public.warehouse_stock_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  product_name text NOT NULL,
  old_qty numeric NOT NULL,
  new_qty numeric NOT NULL,
  diff_qty numeric NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.warehouse_stock_adjustments TO authenticated;
GRANT ALL ON public.warehouse_stock_adjustments TO service_role;

ALTER TABLE public.warehouse_stock_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read warehouse stock adjustments"
  ON public.warehouse_stock_adjustments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert warehouse stock adjustments"
  ON public.warehouse_stock_adjustments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX idx_wsa_product ON public.warehouse_stock_adjustments(product_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.adjust_warehouse_stock(
  _product_id uuid,
  _new_qty numeric,
  _note text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_old numeric;
  v_name text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _new_qty IS NULL OR _new_qty < 0 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;

  SELECT COALESCE(quantity,0), product_name INTO v_old, v_name
  FROM public.warehouse_items
  WHERE id = _product_id AND COALESCE(is_deleted,false) = false
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;

  UPDATE public.warehouse_items
     SET quantity = _new_qty, updated_at = now()
   WHERE id = _product_id;

  INSERT INTO public.warehouse_stock_adjustments
    (product_id, product_name, old_qty, new_qty, diff_qty, note, created_by)
  VALUES
    (_product_id, v_name, v_old, _new_qty, _new_qty - v_old, NULLIF(trim(coalesce(_note,'')),''), v_uid);

  RETURN jsonb_build_object('product_id', _product_id, 'old_qty', v_old, 'new_qty', _new_qty, 'diff', _new_qty - v_old);
END $$;
