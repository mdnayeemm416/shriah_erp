
CREATE INDEX IF NOT EXISTS shop_entries_active_date_idx
  ON public.shop_entries (txn_date DESC, created_at DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS shop_entries_active_shop_date_idx
  ON public.shop_entries (shop_id, txn_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS transactions_active_date_idx
  ON public.transactions (txn_date DESC, created_at DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS transactions_active_shop_date_idx
  ON public.transactions (shop_id, txn_date DESC)
  WHERE is_deleted = false AND shop_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS shop_sales_active_date_idx
  ON public.shop_sales (txn_date DESC, created_at DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS shop_sales_active_due_idx
  ON public.shop_sales (created_at DESC)
  WHERE is_deleted = false AND due_amount > 0;

CREATE INDEX IF NOT EXISTS company_transactions_active_date_idx
  ON public.company_transactions (txn_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS warehouse_ledger_active_date_idx
  ON public.warehouse_ledger (txn_date DESC, created_at DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS employee_entries_active_date_idx
  ON public.employee_entries (txn_date DESC)
  WHERE is_deleted = false;
