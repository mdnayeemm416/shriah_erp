export type StockCountStatus = "draft" | "in_progress" | "completed" | "approved";
export type ScanMode = "manual" | "increment";

export interface StockCountSession {
  id: string;
  name: string;
  count_date: string;
  shop_id: string | null;
  status: StockCountStatus;
  blind_count: boolean;
  scan_mode: ScanMode;
  total_products: number;
  counted_products: number;
  diff_qty: number;
  diff_value: number;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  stock_applied?: boolean;
  stock_applied_at?: string | null;
  stock_applied_by?: string | null;
}

export interface StockCountItem {
  id: string;
  session_id: string;
  product_id: string;
  barcode: string | null;
  name: string;
  category: string | null;
  purchase_price: number;
  frozen_qty: number;
  physical_qty: number | null;
  counted_at: string | null;
  counted_by: string | null;
}

export interface StockCountAdjustment {
  id: string;
  session_id: string;
  product_id: string;
  product_name: string;
  system_qty: number;
  physical_qty: number;
  diff_qty: number;
  diff_value: number;
  reason: string | null;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface StockCountItemPage {
  items: StockCountItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface StockCountSummary {
  total: number;
  counted: number;
  diffCount: number;
  missing: number;
  extra: number;
  diffValue: number;
  prevTotalQty: number;
  currTotalQty: number;
  prevTotalValue: number;
  currTotalValue: number;
  extraProducts: number;
  missingProducts: number;
  nodiffProducts: number;
  extraValue: number;
  missingValue: number;
}

export const REASON_OPTIONS = [
  "Damage",
  "Expired",
  "Missing",
  "Counting Error",
  "Supplier Issue",
  "Other",
] as const;
