ALTER TABLE public.daily_closings
ADD COLUMN IF NOT EXISTS distribution jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS distribution_total numeric NOT NULL DEFAULT 0;