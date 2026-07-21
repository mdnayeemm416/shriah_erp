GRANT EXECUTE ON FUNCTION public.soft_delete_record(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_record(text, uuid) TO authenticated;