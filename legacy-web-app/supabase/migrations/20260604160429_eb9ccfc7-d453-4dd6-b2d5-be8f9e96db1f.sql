
ALTER TABLE public.shop_banners
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS start_date timestamptz,
  ADD COLUMN IF NOT EXISTS end_date timestamptz,
  ADD COLUMN IF NOT EXISTS link_type text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS link_value text;

-- Backfill link_type for existing rows that used link_url
UPDATE public.shop_banners
   SET link_type = 'url', link_value = link_url
 WHERE link_url IS NOT NULL AND link_type = 'none';

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shop_banners_link_type_check'
  ) THEN
    ALTER TABLE public.shop_banners
      ADD CONSTRAINT shop_banners_link_type_check
      CHECK (link_type IN ('none','product','category','url'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS shop_banners_active_sort_idx
  ON public.shop_banners (is_active, sort_order)
  WHERE is_active = true;
