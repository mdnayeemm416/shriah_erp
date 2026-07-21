REVOKE EXECUTE ON FUNCTION public.sync_employee_to_transactions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_soft_deletable_table(text) FROM PUBLIC, anon, authenticated;