
-- Sales Returns module
CREATE TABLE public.sales_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.shop_sales(id) ON DELETE RESTRICT,
  invoice_number bigint,
  customer_id uuid,
  customer_name text,
  customer_mobile text,
  total_qty numeric NOT NULL DEFAULT 0,
  return_value numeric NOT NULL DEFAULT 0,
  refund_type text NOT NULL DEFAULT 'due_reduction' CHECK (refund_type IN ('due_reduction','cash','credit')),
  refund_amount numeric NOT NULL DEFAULT 0,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON public.sales_returns (sale_id);
CREATE INDEX ON public.sales_returns (customer_id);
CREATE INDEX ON public.sales_returns (created_at DESC);

CREATE TABLE public.sales_return_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id uuid NOT NULL REFERENCES public.sales_returns(id) ON DELETE CASCADE,
  product_id uuid,
  name text NOT NULL,
  qty numeric NOT NULL CHECK (qty > 0),
  price numeric NOT NULL DEFAULT 0,
  line_value numeric NOT NULL DEFAULT 0,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.sales_return_items (return_id);
CREATE INDEX ON public.sales_return_items (product_id);

GRANT SELECT, INSERT ON public.sales_returns TO authenticated;
GRANT SELECT, INSERT ON public.sales_return_items TO authenticated;
GRANT ALL ON public.sales_returns TO service_role;
GRANT ALL ON public.sales_return_items TO service_role;

ALTER TABLE public.sales_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_return_items ENABLE ROW LEVEL SECURITY;

-- Read: any authenticated user (mirrors shop_sales visibility)
CREATE POLICY "sr read" ON public.sales_returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "sri read" ON public.sales_return_items FOR SELECT TO authenticated USING (true);

-- Insert: only via RPC (SECURITY DEFINER). Block direct inserts unless admin.
CREATE POLICY "sr insert admin" ON public.sales_returns FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "sri insert admin" ON public.sales_return_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- Immutability triggers
CREATE OR REPLACE FUNCTION public._block_sales_return_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'sales_returns records are immutable';
END; $$;

CREATE TRIGGER sr_no_update BEFORE UPDATE ON public.sales_returns
  FOR EACH ROW EXECUTE FUNCTION public._block_sales_return_mutation();
CREATE TRIGGER sr_no_delete BEFORE DELETE ON public.sales_returns
  FOR EACH ROW EXECUTE FUNCTION public._block_sales_return_mutation();
CREATE TRIGGER sri_no_update BEFORE UPDATE ON public.sales_return_items
  FOR EACH ROW EXECUTE FUNCTION public._block_sales_return_mutation();

-- Main RPC: atomically process a sales return.
--   _items :: jsonb array of { product_id?, name, qty, price, reason }
--   _refund_type :: 'due_reduction' | 'cash' | 'credit'
CREATE OR REPLACE FUNCTION public.process_sales_return(
  _sale_id uuid,
  _items jsonb,
  _refund_type text DEFAULT 'due_reduction',
  _notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sale record;
  v_return_id uuid;
  v_line jsonb;
  v_key text;
  v_sold_map jsonb := '{}'::jsonb;
  v_returned_map jsonb := '{}'::jsonb;
  v_orig_item jsonb;
  v_prev record;
  v_sold numeric;
  v_already numeric;
  v_reqqty numeric;
  v_line_value numeric;
  v_total_qty numeric := 0;
  v_return_value numeric := 0;
  v_refund_amt numeric := 0;
  v_due_reduce numeric := 0;
  v_total_sold_qty numeric := 0;
  v_total_returned_qty numeric := 0;
  v_new_status text;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager')) THEN
    -- Allow any user with explicit sales-return page grant
    IF NOT EXISTS (
      SELECT 1 FROM public.user_page_access
      WHERE user_id = auth.uid() AND page_key = 'sales-return'
    ) THEN
      RAISE EXCEPTION 'Not authorised to process returns';
    END IF;
  END IF;

  SELECT * INTO v_sale FROM public.shop_sales WHERE id = _sale_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Sale not found'; END IF;
  IF v_sale.is_deleted THEN RAISE EXCEPTION 'Sale is deleted'; END IF;

  -- Build sold-qty map keyed by product_id (or name fallback)
  FOR v_orig_item IN SELECT * FROM jsonb_array_elements(v_sale.items) LOOP
    v_key := COALESCE(v_orig_item->>'product_id', v_orig_item->>'name');
    v_sold_map := jsonb_set(
      v_sold_map, ARRAY[v_key],
      to_jsonb(COALESCE((v_sold_map->>v_key)::numeric, 0) + COALESCE((v_orig_item->>'qty')::numeric, 0))
    );
    v_total_sold_qty := v_total_sold_qty + COALESCE((v_orig_item->>'qty')::numeric, 0);
  END LOOP;

  -- Sum previously returned qty per key
  FOR v_prev IN
    SELECT COALESCE(sri.product_id::text, sri.name) AS k, SUM(sri.qty) AS q
    FROM public.sales_return_items sri
    JOIN public.sales_returns sr ON sr.id = sri.return_id
    WHERE sr.sale_id = _sale_id
    GROUP BY 1
  LOOP
    v_returned_map := jsonb_set(v_returned_map, ARRAY[v_prev.k], to_jsonb(v_prev.q));
    v_total_returned_qty := v_total_returned_qty + v_prev.q;
  END LOOP;

  -- Create header
  INSERT INTO public.sales_returns
    (sale_id, invoice_number, customer_id, customer_name, customer_mobile,
     total_qty, return_value, refund_type, refund_amount, notes, created_by)
  VALUES
    (_sale_id, v_sale.invoice_number, v_sale.customer_id, v_sale.customer_name,
     v_sale.customer_mobile, 0, 0, _refund_type, 0, _notes, auth.uid())
  RETURNING id INTO v_return_id;

  -- Process each line
  FOR v_line IN SELECT * FROM jsonb_array_elements(_items) LOOP
    v_reqqty := COALESCE((v_line->>'qty')::numeric, 0);
    IF v_reqqty <= 0 THEN CONTINUE; END IF;
    v_key := COALESCE(v_line->>'product_id', v_line->>'name');
    v_sold := COALESCE((v_sold_map->>v_key)::numeric, 0);
    v_already := COALESCE((v_returned_map->>v_key)::numeric, 0);
    IF v_reqqty > (v_sold - v_already) THEN
      RAISE EXCEPTION 'Return qty for % exceeds remaining (max %)',
        COALESCE(v_line->>'name', v_key), (v_sold - v_already);
    END IF;

    v_line_value := v_reqqty * COALESCE((v_line->>'price')::numeric, 0);

    INSERT INTO public.sales_return_items
      (return_id, product_id, name, qty, price, line_value, reason)
    VALUES
      (v_return_id,
       NULLIF(v_line->>'product_id','')::uuid,
       v_line->>'name',
       v_reqqty,
       COALESCE((v_line->>'price')::numeric, 0),
       v_line_value,
       v_line->>'reason');

    -- Return stock to warehouse (shop_products)
    IF (v_line->>'product_id') IS NOT NULL AND (v_line->>'product_id') <> '' THEN
      UPDATE public.shop_products
      SET stock = COALESCE(stock, 0) + v_reqqty,
          updated_at = now()
      WHERE id = (v_line->>'product_id')::uuid;
    END IF;

    v_total_qty := v_total_qty + v_reqqty;
    v_return_value := v_return_value + v_line_value;
    v_total_returned_qty := v_total_returned_qty + v_reqqty;
  END LOOP;

  -- Reduce sale due first
  v_due_reduce := LEAST(COALESCE(v_sale.due_amount, 0), v_return_value);
  v_refund_amt := v_return_value - v_due_reduce;

  UPDATE public.shop_sales
  SET due_amount = COALESCE(due_amount, 0) - v_due_reduce
  WHERE id = _sale_id;

  -- Register the credit as a payment_in against the customer so due-map reflects it.
  IF v_sale.customer_id IS NOT NULL AND v_return_value > 0 THEN
    INSERT INTO public.pos_payments (customer_id, amount, kind, method, notes, created_by)
    VALUES (
      v_sale.customer_id, v_return_value, 'payment_in',
      'return_credit',
      'Sales Return credit for INV#' || v_sale.invoice_number,
      auth.uid()
    );
  END IF;

  -- Cash refund → transactions cash_out for admin trail
  IF _refund_type = 'cash' AND v_refund_amt > 0 THEN
    INSERT INTO public.transactions (kind, amount, method, notes, created_by, txn_date)
    VALUES ('cash_out', v_refund_amt, 'cash',
            'Cash refund — Sales Return INV#' || v_sale.invoice_number,
            auth.uid(), now());
  END IF;

  -- Recompute status
  IF v_total_returned_qty <= 0 THEN
    v_new_status := v_sale.status;
  ELSIF v_total_returned_qty >= v_total_sold_qty THEN
    v_new_status := 'fully_returned';
  ELSE
    v_new_status := 'partially_returned';
  END IF;

  UPDATE public.shop_sales SET status = v_new_status WHERE id = _sale_id;

  -- Bypass immutability trigger to write final totals on the header
  ALTER TABLE public.sales_returns DISABLE TRIGGER sr_no_update;
  UPDATE public.sales_returns
  SET total_qty = v_total_qty,
      return_value = v_return_value,
      refund_amount = v_refund_amt
  WHERE id = v_return_id;
  ALTER TABLE public.sales_returns ENABLE TRIGGER sr_no_update;

  RETURN v_return_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.process_sales_return(uuid, jsonb, text, text) TO authenticated;

-- Aggregated returns per sale (used for stamping invoice lines)
CREATE OR REPLACE VIEW public.sale_returned_qty_v AS
SELECT sr.sale_id,
       COALESCE(sri.product_id::text, sri.name) AS item_key,
       SUM(sri.qty)::numeric AS returned_qty,
       SUM(sri.line_value)::numeric AS returned_value
FROM public.sales_returns sr
JOIN public.sales_return_items sri ON sri.return_id = sr.id
GROUP BY sr.sale_id, COALESCE(sri.product_id::text, sri.name);

GRANT SELECT ON public.sale_returned_qty_v TO authenticated;
