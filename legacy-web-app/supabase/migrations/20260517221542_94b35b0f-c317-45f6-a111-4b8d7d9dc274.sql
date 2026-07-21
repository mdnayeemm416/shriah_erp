-- Limit execution of security-definer helper functions to the smallest practical audience
REVOKE ALL ON FUNCTION public.is_soft_deletable_table(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_shop_to_transactions() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_warehouse_to_transactions() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_entity_changes() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.soft_delete_record(text, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.restore_record(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_record(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_record(text, uuid) TO authenticated;