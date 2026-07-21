
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- Tighten update policies
DROP POLICY "auth update shops" ON public.shops;
CREATE POLICY "auth update shops" ON public.shops FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin'));

DROP POLICY "auth update wh" ON public.warehouse_items;
CREATE POLICY "auth update wh" ON public.warehouse_items FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'manager'));

-- Restrict bucket listing: only authenticated can list, but objects still publicly readable via URL
DROP POLICY "public read attachments" ON storage.objects;
CREATE POLICY "auth read attachments" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'attachments');
