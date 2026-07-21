// Sales Returns — client helpers.
// The heavy lifting (validation, stock-back, due reduction, refund cash-out)
// lives in the `process_sales_return` Postgres function so a return is atomic.

import { supabase } from "@/integrations/supabase/client";

export type ReturnReason =
  | "Expired"
  | "Damaged"
  | "Wrong Item"
  | "Customer Changed Mind"
  | "Other";

export const RETURN_REASONS: ReturnReason[] = [
  "Expired",
  "Damaged",
  "Wrong Item",
  "Customer Changed Mind",
  "Other",
];

export type RefundType = "due_reduction" | "cash" | "credit";

export type ReturnLineInput = {
  product_id?: string | null;
  name: string;
  qty: number;
  price: number;
  reason?: string;
};

export async function processSalesReturn(opts: {
  saleId: string;
  items: ReturnLineInput[];
  refundType: RefundType;
  notes?: string;
  reason?: string;
}): Promise<string> {
  const payload = opts.items.filter((l) => l.qty > 0).map((l) => ({
    product_id: l.product_id ?? null,
    name: l.name,
    qty: Number(l.qty) || 0,
    price: Number(l.price) || 0,
    reason: l.reason ?? null,
  }));
  const { data, error } = await supabase.rpc("process_sales_return" as any, {
    _sale_id: opts.saleId,
    _items: payload,
    _refund_type: opts.refundType,
    _notes: opts.notes ?? null,
    _reason: opts.reason ?? null,
  });
  if (error) throw error;
  return data as string;
}

/** Sum of previously returned qty per item, keyed by product_id (or name). */
export async function fetchReturnedQtyMap(saleId: string): Promise<Map<string, { qty: number; value: number }>> {
  const { data, error } = await supabase
    .from("sale_returned_qty_v" as any)
    .select("item_key,returned_qty,returned_value")
    .eq("sale_id", saleId);
  if (error) throw error;
  const map = new Map<string, { qty: number; value: number }>();
  for (const r of (data ?? []) as any[]) {
    map.set(String(r.item_key), {
      qty: Number(r.returned_qty ?? 0),
      value: Number(r.returned_value ?? 0),
    });
  }
  return map;
}

export type ReturnHeader = {
  id: string;
  sale_id: string;
  invoice_number: number | null;
  return_number: string | null;
  customer_id: string | null;
  customer_name: string | null;
  customer_mobile: string | null;
  total_qty: number;
  return_value: number;
  refund_type: RefundType;
  refund_amount: number;
  reason: string | null;
  notes: string | null;
  processed_by_name: string | null;
  created_by: string | null;
  created_at: string;
};

export async function fetchReturnsForSale(saleId: string): Promise<ReturnHeader[]> {
  const { data, error } = await supabase
    .from("sales_returns" as any)
    .select("*")
    .eq("sale_id", saleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any;
}
