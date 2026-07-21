
CREATE TABLE public.ai_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  file_url TEXT,
  file_type TEXT,
  raw_text TEXT,
  extracted JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own scans" ON public.ai_scans FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users insert own scans" ON public.ai_scans FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users update own scans" ON public.ai_scans FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users delete own scans" ON public.ai_scans FOR DELETE USING (auth.uid() = created_by);

CREATE OR REPLACE FUNCTION public.set_ai_scans_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_ai_scans_updated_at
BEFORE UPDATE ON public.ai_scans
FOR EACH ROW EXECUTE FUNCTION public.set_ai_scans_updated_at();
