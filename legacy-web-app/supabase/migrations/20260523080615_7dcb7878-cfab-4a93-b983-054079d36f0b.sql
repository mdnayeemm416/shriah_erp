ALTER TABLE public.cash_flow_purchases
  ADD COLUMN IF NOT EXISTS ocr_confidence text,
  ADD COLUMN IF NOT EXISTS ocr_meta jsonb;