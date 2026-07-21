
-- Phase 3 perf: composite indexes for hot filter paths.

CREATE INDEX IF NOT EXISTS txn_shop_type_date_idx
  ON public.transactions (shop_id, type, txn_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS txn_created_by_date_idx
  ON public.transactions (created_by, txn_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS txn_source_date_idx
  ON public.transactions (source, txn_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS cf_purchase_created_status_day_idx
  ON public.cash_flow_purchases (created_by, verify_status, day_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS cf_purchase_company_idx
  ON public.cash_flow_purchases (lower(company))
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS handovers_to_status_idx
  ON public.cash_handovers (to_user, status, day_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS handovers_shop_day_idx
  ON public.cash_handovers (shop_id, day_date DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS wh_ledger_active_date_idx
  ON public.warehouse_ledger (txn_date DESC)
  WHERE is_deleted = false;
