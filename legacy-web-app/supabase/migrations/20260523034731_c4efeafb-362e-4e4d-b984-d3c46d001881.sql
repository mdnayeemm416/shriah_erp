
-- =========================================================
-- CASH CUSTODY ENGINE
-- =========================================================

-- Status enum for handovers
DO $$ BEGIN
  CREATE TYPE public.cash_handover_status AS ENUM
    ('pending','accepted','rejected','returned','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add page key 'cash-custody' is handled in code; no DB change needed.

-- Extend cash_flow_cash_in with optional recipient
ALTER TABLE public.cash_flow_cash_in
  ADD COLUMN IF NOT EXISTS recipient_user_id uuid;

-- ---------------------------------------------------------
-- cash_handovers
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cash_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  shop_id uuid,
  amount numeric NOT NULL CHECK (amount > 0),
  purpose text,
  notes text,
  attachment_url text,
  status public.cash_handover_status NOT NULL DEFAULT 'pending',
  parent_handover_id uuid REFERENCES public.cash_handovers(id) ON DELETE SET NULL,
  day_date date NOT NULL DEFAULT CURRENT_DATE,
  reject_reason text,
  accepted_at timestamptz,
  rejected_at timestamptz,
  closed_at timestamptz,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_handovers_from   ON public.cash_handovers(from_user);
CREATE INDEX IF NOT EXISTS idx_handovers_to     ON public.cash_handovers(to_user);
CREATE INDEX IF NOT EXISTS idx_handovers_status ON public.cash_handovers(status);
CREATE INDEX IF NOT EXISTS idx_handovers_day    ON public.cash_handovers(day_date);

ALTER TABLE public.cash_handovers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "handovers_select" ON public.cash_handovers
  FOR SELECT TO authenticated USING (
    auth.uid() = from_user
    OR auth.uid() = to_user
    OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'manager'::app_role)
    OR has_role(auth.uid(),'accountant'::app_role)
  );

CREATE POLICY "handovers_insert" ON public.cash_handovers
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = created_by AND auth.uid() = from_user
  );

CREATE POLICY "handovers_update" ON public.cash_handovers
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(),'admin'::app_role)
    OR (auth.uid() = from_user AND status = 'pending')
    OR (auth.uid() = to_user)   -- recipient can accept/reject
  );

CREATE POLICY "handovers_delete_admin" ON public.cash_handovers
  FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER cash_handovers_touch_updated
  BEFORE UPDATE ON public.cash_handovers
  FOR EACH ROW EXECUTE FUNCTION public.cf_touch_updated();

-- Activity log trigger
CREATE OR REPLACE FUNCTION public.cash_handover_log()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.cf_activity_log(action, target_table, target_id, meta, actor)
    VALUES ('handover_create','cash_handovers', NEW.id,
            jsonb_build_object('from',NEW.from_user,'to',NEW.to_user,'amount',NEW.amount),
            COALESCE(auth.uid(), NEW.created_by));
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.cf_activity_log(action, target_table, target_id, meta, actor)
    VALUES ('handover_' || NEW.status::text, 'cash_handovers', NEW.id,
            jsonb_build_object('from_status',OLD.status,'to_status',NEW.status,'amount',NEW.amount,
                               'reason',NEW.reject_reason),
            COALESCE(auth.uid(), NEW.created_by));
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER cash_handover_log_trg
  AFTER INSERT OR UPDATE ON public.cash_handovers
  FOR EACH ROW EXECUTE FUNCTION public.cash_handover_log();

-- ---------------------------------------------------------
-- cash_returns
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cash_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL,                  -- who is returning
  to_user uuid,                             -- null = back to company
  related_handover_id uuid REFERENCES public.cash_handovers(id) ON DELETE SET NULL,
  shop_id uuid,
  amount numeric NOT NULL CHECK (amount > 0),
  notes text,
  attachment_url text,
  day_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_returns_from ON public.cash_returns(from_user);
CREATE INDEX IF NOT EXISTS idx_returns_day  ON public.cash_returns(day_date);

ALTER TABLE public.cash_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "returns_select" ON public.cash_returns
  FOR SELECT TO authenticated USING (
    auth.uid() = from_user
    OR auth.uid() = to_user
    OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'manager'::app_role)
    OR has_role(auth.uid(),'accountant'::app_role)
  );

CREATE POLICY "returns_insert" ON public.cash_returns
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = created_by AND auth.uid() = from_user
  );

CREATE POLICY "returns_update" ON public.cash_returns
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(),'admin'::app_role) OR auth.uid() = created_by
  );

CREATE POLICY "returns_delete_admin" ON public.cash_returns
  FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role));

-- ---------------------------------------------------------
-- v_cash_holders: live balance per user
-- ---------------------------------------------------------
CREATE OR REPLACE VIEW public.v_cash_holders AS
WITH received_in AS (
  SELECT recipient_user_id AS user_id, COALESCE(SUM(amount),0) AS amt
  FROM public.cash_flow_cash_in
  WHERE NOT is_deleted AND recipient_user_id IS NOT NULL
  GROUP BY recipient_user_id
),
received_handovers AS (
  SELECT to_user AS user_id, COALESCE(SUM(amount),0) AS amt
  FROM public.cash_handovers
  WHERE NOT is_deleted AND status = 'accepted'
  GROUP BY to_user
),
given_handovers AS (
  SELECT from_user AS user_id, COALESCE(SUM(amount),0) AS amt
  FROM public.cash_handovers
  WHERE NOT is_deleted AND status = 'accepted'
  GROUP BY from_user
),
spent_purchases AS (
  SELECT purchaser AS user_id, COALESCE(SUM(cash_amount),0) AS amt
  FROM public.cash_flow_purchases
  WHERE NOT is_deleted AND purchaser IS NOT NULL
    AND verify_status <> 'rejected'::public.cf_verify_status
  GROUP BY purchaser
),
returned AS (
  SELECT from_user AS user_id, COALESCE(SUM(amount),0) AS amt
  FROM public.cash_returns
  WHERE NOT is_deleted
  GROUP BY from_user
)
SELECT
  p.id AS user_id,
  COALESCE(p.full_name, p.email, p.username, 'User') AS display_name,
  COALESCE(ri.amt,0) + COALESCE(rh.amt,0) AS total_received,
  COALESCE(gh.amt,0) AS total_given,
  COALESCE(sp.amt,0) AS total_spent,
  COALESCE(rt.amt,0) AS total_returned,
  (COALESCE(ri.amt,0) + COALESCE(rh.amt,0))
    - COALESCE(gh.amt,0) - COALESCE(sp.amt,0) - COALESCE(rt.amt,0) AS balance
FROM public.profiles p
LEFT JOIN received_in        ri ON ri.user_id = p.id
LEFT JOIN received_handovers rh ON rh.user_id = p.id
LEFT JOIN given_handovers    gh ON gh.user_id = p.id
LEFT JOIN spent_purchases    sp ON sp.user_id = p.id
LEFT JOIN returned           rt ON rt.user_id = p.id
WHERE COALESCE(ri.amt,0) + COALESCE(rh.amt,0) + COALESCE(gh.amt,0)
    + COALESCE(sp.amt,0) + COALESCE(rt.amt,0) > 0;

GRANT SELECT ON public.v_cash_holders TO authenticated;

-- ---------------------------------------------------------
-- v_cash_reconciliation: per shop / day reconciliation
-- ---------------------------------------------------------
CREATE OR REPLACE VIEW public.v_cash_reconciliation AS
SELECT
  d.day_date,
  d.shop_id,
  COALESCE((SELECT SUM(amount) FROM public.cash_flow_cash_in c
             WHERE c.day_date=d.day_date AND c.shop_id IS NOT DISTINCT FROM d.shop_id
               AND NOT c.is_deleted),0) AS cash_in,
  COALESCE((SELECT SUM(amount) FROM public.cash_handovers h
             WHERE h.day_date=d.day_date AND h.shop_id IS NOT DISTINCT FROM d.shop_id
               AND h.status='accepted' AND NOT h.is_deleted),0) AS distributed,
  COALESCE((SELECT SUM(cash_amount) FROM public.cash_flow_purchases p
             WHERE p.day_date=d.day_date AND p.shop_id IS NOT DISTINCT FROM d.shop_id
               AND NOT p.is_deleted),0) AS purchases,
  COALESCE((SELECT SUM(amount) FROM public.cash_returns r
             WHERE r.day_date=d.day_date AND r.shop_id IS NOT DISTINCT FROM d.shop_id
               AND NOT r.is_deleted),0) AS returns
FROM (
  SELECT DISTINCT day_date, shop_id FROM public.cash_flow_cash_in WHERE NOT is_deleted
  UNION
  SELECT DISTINCT day_date, shop_id FROM public.cash_handovers WHERE NOT is_deleted
  UNION
  SELECT DISTINCT day_date, shop_id FROM public.cash_flow_purchases WHERE NOT is_deleted
  UNION
  SELECT DISTINCT day_date, shop_id FROM public.cash_returns WHERE NOT is_deleted
) d;

GRANT SELECT ON public.v_cash_reconciliation TO authenticated;

-- ---------------------------------------------------------
-- trace_cash(handover_id) -> chain of handovers back to the root
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trace_cash(_handover_id uuid)
RETURNS TABLE (
  level int,
  id uuid,
  from_user uuid,
  to_user uuid,
  amount numeric,
  status public.cash_handover_status,
  day_date date,
  parent_handover_id uuid
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH RECURSIVE chain AS (
    SELECT 0 AS level, h.id, h.from_user, h.to_user, h.amount, h.status,
           h.day_date, h.parent_handover_id
    FROM public.cash_handovers h WHERE h.id = _handover_id
    UNION ALL
    SELECT c.level + 1, h.id, h.from_user, h.to_user, h.amount, h.status,
           h.day_date, h.parent_handover_id
    FROM public.cash_handovers h
    JOIN chain c ON h.id = c.parent_handover_id
  )
  SELECT * FROM chain ORDER BY level;
$$;
