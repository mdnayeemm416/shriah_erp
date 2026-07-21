import { s as supabase } from "./client-Bs6QIVWe.mjs";
const RETURN_REASONS = [
  "Expired",
  "Damaged",
  "Wrong Item",
  "Customer Changed Mind",
  "Other"
];
async function processSalesReturn(opts) {
  const payload = opts.items.filter((l) => l.qty > 0).map((l) => ({
    product_id: l.product_id ?? null,
    name: l.name,
    qty: Number(l.qty) || 0,
    price: Number(l.price) || 0,
    reason: l.reason ?? null
  }));
  const { data, error } = await supabase.rpc("process_sales_return", {
    _sale_id: opts.saleId,
    _items: payload,
    _refund_type: opts.refundType,
    _notes: opts.notes ?? null,
    _reason: opts.reason ?? null
  });
  if (error) throw error;
  return data;
}
async function fetchReturnedQtyMap(saleId) {
  const { data, error } = await supabase.from("sale_returned_qty_v").select("item_key,returned_qty,returned_value").eq("sale_id", saleId);
  if (error) throw error;
  const map = /* @__PURE__ */ new Map();
  for (const r of data ?? []) {
    map.set(String(r.item_key), {
      qty: Number(r.returned_qty ?? 0),
      value: Number(r.returned_value ?? 0)
    });
  }
  return map;
}
export {
  RETURN_REASONS as R,
  fetchReturnedQtyMap as f,
  processSalesReturn as p
};
