
DROP TRIGGER IF EXISTS cf_attach_required_trg ON public.cash_flow_purchases;
DROP FUNCTION IF EXISTS public.cf_enforce_attachment_on_verify();

CREATE TABLE IF NOT EXISTS public.cf_closing_proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_date date NOT NULL,
  shop_id uuid NULL REFERENCES public.shops(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  mime text,
  notes text,
  uploaded_by uuid NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cf_closing_proofs_day_idx ON public.cf_closing_proofs (day_date, shop_id);

ALTER TABLE public.cf_closing_proofs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cf_closing_proofs_select" ON public.cf_closing_proofs;
CREATE POLICY "cf_closing_proofs_select" ON public.cf_closing_proofs
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "cf_closing_proofs_insert" ON public.cf_closing_proofs;
CREATE POLICY "cf_closing_proofs_insert" ON public.cf_closing_proofs
  FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid());

DROP POLICY IF EXISTS "cf_closing_proofs_delete" ON public.cf_closing_proofs;
CREATE POLICY "cf_closing_proofs_delete" ON public.cf_closing_proofs
  FOR DELETE TO authenticated USING (
    uploaded_by = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );
