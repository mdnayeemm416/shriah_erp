
CREATE TABLE public.company_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias text NOT NULL,
  alias_normalized text NOT NULL,
  canonical text NOT NULL,
  usage_count integer NOT NULL DEFAULT 1,
  source text NOT NULL DEFAULT 'manual',
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (alias_normalized, canonical)
);

CREATE INDEX idx_company_aliases_norm ON public.company_aliases(alias_normalized);
CREATE INDEX idx_company_aliases_canonical ON public.company_aliases(canonical);

ALTER TABLE public.company_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read aliases" ON public.company_aliases
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert aliases" ON public.company_aliases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "auth update aliases" ON public.company_aliases
  FOR UPDATE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "auth delete aliases" ON public.company_aliases
  FOR DELETE TO authenticated
  USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.set_company_aliases_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_company_aliases_updated_at
  BEFORE UPDATE ON public.company_aliases
  FOR EACH ROW EXECUTE FUNCTION public.set_company_aliases_updated_at();
