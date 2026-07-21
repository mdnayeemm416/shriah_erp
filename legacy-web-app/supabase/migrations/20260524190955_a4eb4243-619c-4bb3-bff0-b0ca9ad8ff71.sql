
ALTER TABLE public.shop_products ADD COLUMN IF NOT EXISTS name_ar text;
ALTER TABLE public.shop_categories ADD COLUMN IF NOT EXISTS name_ar text;

UPDATE public.app_settings SET store_whatsapp = '0553687388' WHERE id = 1 AND (store_whatsapp IS NULL OR store_whatsapp = '' OR store_whatsapp = '966500000000');
INSERT INTO public.app_settings (id, store_whatsapp) VALUES (1, '0553687388') ON CONFLICT (id) DO NOTHING;
