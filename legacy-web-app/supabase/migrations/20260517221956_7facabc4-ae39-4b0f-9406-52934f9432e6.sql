DROP TRIGGER IF EXISTS trg_sync_shop_to_transactions ON public.shop_entries;
DROP TRIGGER IF EXISTS trg_sync_warehouse_to_transactions ON public.warehouse_ledger;

DROP TRIGGER IF EXISTS trg_sync_shop_to_txn ON public.shop_entries;
CREATE TRIGGER trg_sync_shop_to_txn
AFTER INSERT OR UPDATE OR DELETE ON public.shop_entries
FOR EACH ROW EXECUTE FUNCTION public.sync_shop_to_transactions();

DROP TRIGGER IF EXISTS trg_sync_wh_to_txn ON public.warehouse_ledger;
CREATE TRIGGER trg_sync_wh_to_txn
AFTER INSERT OR UPDATE OR DELETE ON public.warehouse_ledger
FOR EACH ROW EXECUTE FUNCTION public.sync_warehouse_to_transactions();