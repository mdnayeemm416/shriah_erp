ALTER TABLE public.overview_entries ADD COLUMN IF NOT EXISTS category TEXT;
CREATE INDEX IF NOT EXISTS idx_overview_entries_category ON public.overview_entries(category);