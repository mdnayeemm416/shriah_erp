
CREATE TABLE public.invoice_v3_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_v3_templates TO authenticated;
GRANT ALL ON public.invoice_v3_templates TO service_role;

ALTER TABLE public.invoice_v3_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners manage own templates"
  ON public.invoice_v3_templates
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE INDEX idx_invoice_v3_templates_owner ON public.invoice_v3_templates(owner_id);

CREATE TRIGGER trg_invoice_v3_templates_updated
  BEFORE UPDATE ON public.invoice_v3_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
