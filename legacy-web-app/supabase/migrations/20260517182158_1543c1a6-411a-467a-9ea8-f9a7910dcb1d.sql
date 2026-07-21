
ALTER TABLE public.shop_entries
  ADD COLUMN IF NOT EXISTS ocr_scan_id uuid REFERENCES public.ai_scans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS ocr_original_amount numeric,
  ADD COLUMN IF NOT EXISTS ocr_confidence text;

CREATE INDEX IF NOT EXISTS idx_shop_entries_ocr_scan_id ON public.shop_entries(ocr_scan_id);
