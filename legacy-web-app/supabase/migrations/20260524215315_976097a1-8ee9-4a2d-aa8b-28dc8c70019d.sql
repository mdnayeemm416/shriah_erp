CREATE TABLE IF NOT EXISTS public.shop_ads (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text,
  button_text text,
  button_link text,
  placement text not null default 'home',
  is_active boolean not null default true,
  start_date timestamptz,
  end_date timestamptz,
  priority integer not null default 0,
  view_count integer not null default 0,
  click_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  CONSTRAINT shop_ads_placement_chk CHECK (placement IN ('home','success','both'))
);

ALTER TABLE public.shop_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shop_ads public read"
  ON public.shop_ads FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

CREATE POLICY "shop_ads admin all"
  ON public.shop_ads FOR ALL
  TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'manager'::app_role));

CREATE INDEX IF NOT EXISTS shop_ads_placement_idx ON public.shop_ads(placement, priority DESC, is_active);

CREATE TRIGGER shop_ads_set_updated_at
  BEFORE UPDATE ON public.shop_ads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.shop_ad_track(_ad_id uuid, _kind text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.shop_ads
  SET view_count  = view_count  + CASE WHEN _kind = 'view'  THEN 1 ELSE 0 END,
      click_count = click_count + CASE WHEN _kind = 'click' THEN 1 ELSE 0 END
  WHERE id = _ad_id;
$$;

GRANT EXECUTE ON FUNCTION public.shop_ad_track(uuid, text) TO anon, authenticated;