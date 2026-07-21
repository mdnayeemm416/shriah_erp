
-- Day locks
CREATE TABLE public.cash_flow_day_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid,
  day_date date NOT NULL,
  is_locked boolean NOT NULL DEFAULT true,
  locked_by uuid,
  locked_at timestamptz NOT NULL DEFAULT now(),
  unlocked_by uuid,
  unlocked_at timestamptz,
  notes text,
  UNIQUE (shop_id, day_date)
);
ALTER TABLE public.cash_flow_day_locks ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.cf_is_locked(_shop_id uuid, _day date)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT COALESCE((SELECT is_locked FROM public.cash_flow_day_locks
                    WHERE day_date=_day AND shop_id IS NOT DISTINCT FROM _shop_id
                    LIMIT 1), false);
$$;
REVOKE EXECUTE ON FUNCTION public.cf_is_locked(uuid,date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cf_is_locked(uuid,date) TO authenticated;

CREATE OR REPLACE FUNCTION public.cf_can_verify(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT public.has_role(_user,'admin'::public.app_role)
      OR public.has_role(_user,'manager'::public.app_role)
      OR public.has_role(_user,'accountant'::public.app_role);
$$;
REVOKE EXECUTE ON FUNCTION public.cf_can_verify(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cf_can_verify(uuid) TO authenticated;

CREATE POLICY cf_locks_select ON public.cash_flow_day_locks FOR SELECT TO authenticated USING (true);
CREATE POLICY cf_locks_admin_all ON public.cash_flow_day_locks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));

-- Cash In
CREATE TABLE public.cash_flow_cash_in (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid,
  day_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric NOT NULL DEFAULT 0 CHECK (amount >= 0),
  source text,
  notes text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);
CREATE INDEX cf_cashin_shop_day_idx ON public.cash_flow_cash_in (shop_id, day_date) WHERE NOT is_deleted;
ALTER TABLE public.cash_flow_cash_in ENABLE ROW LEVEL SECURITY;

CREATE POLICY cf_cashin_select ON public.cash_flow_cash_in FOR SELECT TO authenticated USING (true);
CREATE POLICY cf_cashin_insert ON public.cash_flow_cash_in FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=created_by AND NOT public.cf_is_locked(shop_id, day_date));
CREATE POLICY cf_cashin_update ON public.cash_flow_cash_in FOR UPDATE TO authenticated
  USING ((auth.uid()=created_by OR public.has_role(auth.uid(),'admin'::public.app_role))
         AND (NOT public.cf_is_locked(shop_id, day_date) OR public.has_role(auth.uid(),'admin'::public.app_role)));
CREATE POLICY cf_cashin_delete ON public.cash_flow_cash_in FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role));

-- Purchases
CREATE TYPE public.cf_verify_status AS ENUM ('pending','verified','rejected');

CREATE TABLE public.cash_flow_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid,
  day_date date NOT NULL DEFAULT CURRENT_DATE,
  company text NOT NULL,
  cash_amount numeric NOT NULL DEFAULT 0 CHECK (cash_amount >= 0),
  due_amount numeric NOT NULL DEFAULT 0 CHECK (due_amount >= 0),
  credit_amount numeric NOT NULL DEFAULT 0 CHECK (credit_amount >= 0),
  notes text,
  attachment_url text,
  verify_status public.cf_verify_status NOT NULL DEFAULT 'pending',
  verified_by uuid,
  verified_at timestamptz,
  reject_reason text,
  cash_in_ref uuid REFERENCES public.cash_flow_cash_in(id) ON DELETE SET NULL,
  purchaser uuid,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);
CREATE INDEX cf_purchase_shop_day_idx ON public.cash_flow_purchases (shop_id, day_date) WHERE NOT is_deleted;
CREATE INDEX cf_purchase_status_idx ON public.cash_flow_purchases (verify_status) WHERE NOT is_deleted;
ALTER TABLE public.cash_flow_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY cf_purchase_select ON public.cash_flow_purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY cf_purchase_insert ON public.cash_flow_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=created_by AND NOT public.cf_is_locked(shop_id, day_date));
CREATE POLICY cf_purchase_update ON public.cash_flow_purchases FOR UPDATE TO authenticated
  USING (
    (NOT public.cf_is_locked(shop_id, day_date) OR public.has_role(auth.uid(),'admin'::public.app_role))
    AND (auth.uid()=created_by OR public.cf_can_verify(auth.uid()))
  );
CREATE POLICY cf_purchase_delete ON public.cash_flow_purchases FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.cf_touch_updated() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER cf_cashin_touch BEFORE UPDATE ON public.cash_flow_cash_in
  FOR EACH ROW EXECUTE FUNCTION public.cf_touch_updated();
CREATE TRIGGER cf_purchase_touch BEFORE UPDATE ON public.cash_flow_purchases
  FOR EACH ROW EXECUTE FUNCTION public.cf_touch_updated();

CREATE TRIGGER cf_cashin_history AFTER UPDATE ON public.cash_flow_cash_in
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();
CREATE TRIGGER cf_purchase_history AFTER UPDATE ON public.cash_flow_purchases
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();
CREATE TRIGGER cf_locks_history AFTER UPDATE ON public.cash_flow_day_locks
  FOR EACH ROW EXECUTE FUNCTION public.log_entity_changes();
