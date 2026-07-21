
-- Stock Count (Physical Inventory) module
-- New self-contained tables; no edits to existing tables/triggers.

CREATE TABLE public.stock_count_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  count_date date NOT NULL DEFAULT CURRENT_DATE,
  shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  blind_count boolean NOT NULL DEFAULT false,
  scan_mode text NOT NULL DEFAULT 'manual',
  total_products integer NOT NULL DEFAULT 0,
  counted_products integer NOT NULL DEFAULT 0,
  diff_qty numeric NOT NULL DEFAULT 0,
  diff_value numeric NOT NULL DEFAULT 0,
  created_by uuid,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT stock_count_sessions_status_check CHECK (status IN ('draft','in_progress','completed','approved')),
  CONSTRAINT stock_count_sessions_scan_mode_check CHECK (scan_mode IN ('manual','increment'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_count_sessions TO authenticated;
GRANT ALL ON public.stock_count_sessions TO service_role;
ALTER TABLE public.stock_count_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sc_sessions_select" ON public.stock_count_sessions FOR SELECT TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "sc_sessions_insert" ON public.stock_count_sessions FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "sc_sessions_update" ON public.stock_count_sessions FOR UPDATE TO authenticated
  USING (public.user_can_access_shop(auth.uid(), shop_id))
  WITH CHECK (public.user_can_access_shop(auth.uid(), shop_id));
CREATE POLICY "sc_sessions_delete" ON public.stock_count_sessions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_sc_sessions_updated BEFORE UPDATE ON public.stock_count_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sc_sessions_status ON public.stock_count_sessions(status) WHERE is_deleted = false;
CREATE INDEX idx_sc_sessions_created ON public.stock_count_sessions(created_at DESC);

-- ITEMS
CREATE TABLE public.stock_count_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.stock_count_sessions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE CASCADE,
  barcode text,
  name text NOT NULL,
  category text,
  purchase_price numeric NOT NULL DEFAULT 0,
  frozen_qty numeric NOT NULL DEFAULT 0,
  physical_qty numeric,
  counted_at timestamptz,
  counted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_count_items TO authenticated;
GRANT ALL ON public.stock_count_items TO service_role;
ALTER TABLE public.stock_count_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sc_items_all" ON public.stock_count_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stock_count_sessions s
                 WHERE s.id = session_id AND public.user_can_access_shop(auth.uid(), s.shop_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.stock_count_sessions s
                 WHERE s.id = session_id AND public.user_can_access_shop(auth.uid(), s.shop_id)));

CREATE INDEX idx_sc_items_session ON public.stock_count_items(session_id);
CREATE INDEX idx_sc_items_barcode ON public.stock_count_items(session_id, barcode);
CREATE INDEX idx_sc_items_product ON public.stock_count_items(product_id);

CREATE TRIGGER trg_sc_items_updated BEFORE UPDATE ON public.stock_count_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Freeze trigger: frozen_qty + product_id + session_id immutable after insert
CREATE OR REPLACE FUNCTION public.sc_items_freeze_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.frozen_qty IS DISTINCT FROM OLD.frozen_qty
     OR NEW.product_id <> OLD.product_id
     OR NEW.session_id <> OLD.session_id THEN
    RAISE EXCEPTION 'Frozen stock count fields are immutable';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_sc_items_freeze BEFORE UPDATE ON public.stock_count_items
  FOR EACH ROW EXECUTE FUNCTION public.sc_items_freeze_guard();

-- ADJUSTMENTS (audit, written only on approval)
CREATE TABLE public.stock_count_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.stock_count_sessions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.shop_products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  system_qty numeric NOT NULL,
  physical_qty numeric NOT NULL,
  diff_qty numeric NOT NULL,
  diff_value numeric NOT NULL DEFAULT 0,
  reason text,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.stock_count_adjustments TO authenticated;
GRANT ALL ON public.stock_count_adjustments TO service_role;
ALTER TABLE public.stock_count_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sc_adj_select" ON public.stock_count_adjustments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.stock_count_sessions s
                 WHERE s.id = session_id AND public.user_can_access_shop(auth.uid(), s.shop_id)));
CREATE POLICY "sc_adj_insert_admin" ON public.stock_count_adjustments FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_sc_adj_session ON public.stock_count_adjustments(session_id);
CREATE INDEX idx_sc_adj_product ON public.stock_count_adjustments(product_id);

-- ============================================================
-- Freeze: snapshot shop_products into items on session creation
-- ============================================================
CREATE OR REPLACE FUNCTION public.start_stock_count_session(_session_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_shop uuid;
  v_count integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT shop_id INTO v_shop FROM public.stock_count_sessions
    WHERE id = _session_id AND COALESCE(is_deleted,false) = false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;

  IF NOT public.user_can_access_shop(auth.uid(), v_shop) THEN
    RAISE EXCEPTION 'Not authorized for this shop';
  END IF;

  -- Idempotent: do nothing if items already exist
  IF EXISTS (SELECT 1 FROM public.stock_count_items WHERE session_id = _session_id LIMIT 1) THEN
    SELECT count(*) INTO v_count FROM public.stock_count_items WHERE session_id = _session_id;
    RETURN v_count;
  END IF;

  INSERT INTO public.stock_count_items
    (session_id, product_id, barcode, name, category, purchase_price, frozen_qty)
  SELECT _session_id, p.id, p.barcode, p.name,
         (SELECT c.name FROM public.shop_categories c WHERE c.id = p.category_id),
         COALESCE(p.purchase_price, 0),
         COALESCE(p.stock, 0)
  FROM public.shop_products p
  WHERE COALESCE(p.is_deleted,false) = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE public.stock_count_sessions
    SET total_products = v_count, status = 'in_progress', updated_at = now()
  WHERE id = _session_id;

  RETURN v_count;
END $$;

GRANT EXECUTE ON FUNCTION public.start_stock_count_session(uuid) TO authenticated;

-- ============================================================
-- Approve: admin-only, write adjustments + update live stock
-- Reason map: { "<product_id>": { "reason": "...", "note": "..." } }
-- A "_default" key applies to items missing an explicit entry.
-- ============================================================
CREATE OR REPLACE FUNCTION public.approve_stock_count(_session_id uuid, _reason_map jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_status text;
  v_uid uuid := auth.uid();
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

  SELECT status INTO v_status FROM public.stock_count_sessions
    WHERE id = _session_id AND COALESCE(is_deleted,false) = false FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session not found'; END IF;
  IF v_status = 'approved' THEN RAISE EXCEPTION 'Session already approved'; END IF;

  v_default_reason := _reason_map->'_default'->>'reason';
  v_default_note   := _reason_map->'_default'->>'note';

  FOR r IN
    SELECT i.product_id, i.name, i.purchase_price, i.frozen_qty, i.physical_qty,
           (i.physical_qty - i.frozen_qty) AS diff
    FROM public.stock_count_items i
    WHERE i.session_id = _session_id
      AND i.physical_qty IS NOT NULL
      AND i.physical_qty <> i.frozen_qty
  LOOP
    v_reason := COALESCE(_reason_map->r.product_id::text->>'reason', v_default_reason);
    v_note   := COALESCE(_reason_map->r.product_id::text->>'note',   v_default_note);

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
        diff_qty = v_total_diff_qty,
        diff_value = v_total_diff_val,
        updated_at = now()
  WHERE id = _session_id;

  RETURN jsonb_build_object('adjustments', v_rows, 'diff_qty', v_total_diff_qty, 'diff_value', v_total_diff_val);
END $$;

GRANT EXECUTE ON FUNCTION public.approve_stock_count(uuid, jsonb) TO authenticated;

-- ============================================================
-- Progress refresh helper (called after batch updates)
-- ============================================================
CREATE OR REPLACE FUNCTION public.refresh_stock_count_progress(_session_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_counted integer;
BEGIN
  SELECT count(*) INTO v_counted FROM public.stock_count_items
   WHERE session_id = _session_id AND physical_qty IS NOT NULL;
  UPDATE public.stock_count_sessions
     SET counted_products = v_counted, updated_at = now()
   WHERE id = _session_id;
END $$;

GRANT EXECUTE ON FUNCTION public.refresh_stock_count_progress(uuid) TO authenticated;
