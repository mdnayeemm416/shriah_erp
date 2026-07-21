
ALTER TABLE public.shop_ads
  ADD COLUMN IF NOT EXISTS link_type text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS link_value text,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

ALTER TABLE public.shop_ads DROP CONSTRAINT IF EXISTS shop_ads_link_type_check;
ALTER TABLE public.shop_ads
  ADD CONSTRAINT shop_ads_link_type_check
  CHECK (link_type IN ('none','product','category','url'));

CREATE INDEX IF NOT EXISTS shop_ads_sort_idx ON public.shop_ads (sort_order, created_at DESC);
