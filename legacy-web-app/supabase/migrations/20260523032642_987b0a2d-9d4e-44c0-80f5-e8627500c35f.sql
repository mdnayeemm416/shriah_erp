
CREATE OR REPLACE FUNCTION public.cf_can_verify(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='public' AS $$
  SELECT public.has_role(_user,'admin'::public.app_role)
      OR public.has_role(_user,'manager'::public.app_role)
      OR public.has_role(_user,'accountant'::public.app_role)
      OR public.has_role(_user,'verifier'::public.app_role);
$$;

ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS cf_require_attachment boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.user_page_access (
  user_id uuid NOT NULL,
  page_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, page_key)
);
ALTER TABLE public.user_page_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "upa self or admin read" ON public.user_page_access
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'::public.app_role));
CREATE POLICY "upa admin manage" ON public.user_page_access
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));

CREATE TABLE IF NOT EXISTS public.cf_purchase_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL,
  storage_path text NOT NULL,
  mime text,
  kind text DEFAULT 'receipt',
  notes text,
  uploaded_by uuid NOT NULL DEFAULT auth.uid(),
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cf_pa_purchase_idx ON public.cf_purchase_attachments(purchase_id);
ALTER TABLE public.cf_purchase_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cfpa select all auth" ON public.cf_purchase_attachments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "cfpa insert by owner or admin" ON public.cf_purchase_attachments
  FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND (
      public.has_role(auth.uid(),'admin'::public.app_role)
      OR EXISTS (
        SELECT 1 FROM public.cash_flow_purchases p
        WHERE p.id = purchase_id
          AND (p.created_by = auth.uid() OR public.cf_can_verify(auth.uid()))
          AND (NOT public.cf_is_locked(p.shop_id, p.day_date) OR public.has_role(auth.uid(),'admin'::public.app_role))
      )
    )
  );

CREATE POLICY "cfpa delete by owner or admin" ON public.cf_purchase_attachments
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin'::public.app_role)
    OR (uploaded_by = auth.uid() AND EXISTS (
        SELECT 1 FROM public.cash_flow_purchases p
        WHERE p.id = purchase_id
          AND NOT public.cf_is_locked(p.shop_id, p.day_date)
    ))
  );

CREATE TABLE IF NOT EXISTS public.cf_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  target_table text,
  target_id uuid,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor uuid NOT NULL DEFAULT auth.uid(),
  at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cf_log_at_idx ON public.cf_activity_log(at DESC);
ALTER TABLE public.cf_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cflog insert auth" ON public.cf_activity_log
  FOR INSERT TO authenticated WITH CHECK (actor = auth.uid());

CREATE POLICY "cflog select privileged" ON public.cf_activity_log
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin'::public.app_role)
    OR public.has_role(auth.uid(),'manager'::public.app_role)
    OR public.has_role(auth.uid(),'accountant'::public.app_role)
  );

CREATE OR REPLACE FUNCTION public.cf_enforce_attachment_on_verify()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='public' AS $$
DECLARE v_required boolean;
BEGIN
  IF NEW.verify_status = 'verified'::public.cf_verify_status
     AND (OLD.verify_status IS DISTINCT FROM NEW.verify_status) THEN
    SELECT cf_require_attachment INTO v_required FROM public.app_settings WHERE id=1;
    IF COALESCE(v_required,false) AND NOT EXISTS (
      SELECT 1 FROM public.cf_purchase_attachments WHERE purchase_id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Attachment required before verification';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS cf_attach_required_trg ON public.cash_flow_purchases;
CREATE TRIGGER cf_attach_required_trg
BEFORE UPDATE ON public.cash_flow_purchases
FOR EACH ROW EXECUTE FUNCTION public.cf_enforce_attachment_on_verify();
