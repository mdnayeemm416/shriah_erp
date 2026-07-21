ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_orders;
ALTER TABLE public.shop_orders REPLICA IDENTITY FULL;