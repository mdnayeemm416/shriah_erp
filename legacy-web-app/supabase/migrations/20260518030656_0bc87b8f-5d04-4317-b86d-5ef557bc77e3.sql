REVOKE ALL ON FUNCTION public.soft_delete_record(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.restore_record(text, uuid) FROM PUBLIC, anon, authenticated;