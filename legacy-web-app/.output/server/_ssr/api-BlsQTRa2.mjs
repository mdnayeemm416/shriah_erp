import { s as supabase } from "./client-Bs6QIVWe.mjs";
async function listSessions() {
  const { data, error } = await supabase.from("stock_count_sessions").select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return data ?? [];
}
async function getSession(id) {
  const { data, error } = await supabase.from("stock_count_sessions").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}
async function createSession(input) {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase.from("stock_count_sessions").insert({
    name: input.name,
    count_date: input.count_date,
    shop_id: input.shop_id,
    blind_count: input.blind_count,
    scan_mode: input.scan_mode,
    status: "draft",
    created_by: user?.id ?? null
  }).select().single();
  if (error) throw error;
  const { error: rpcErr } = await supabase.rpc("start_stock_count_session", {
    _session_id: data.id
  });
  if (rpcErr) throw rpcErr;
  return data;
}
async function listItemsPage(input) {
  const limit = input.limit ?? 100;
  const offset = input.offset ?? 0;
  const { data, error } = await supabase.rpc("stock_count_items_page", {
    _session_id: input.sessionId,
    _limit: limit,
    _offset: offset,
    _filter: input.filter ?? "all",
    _search: input.search?.trim() || null
  });
  if (error) throw error;
  const rows = data ?? [];
  return {
    items: rows.map(({ total_count: _total, ...row }) => row),
    total: Number(rows[0]?.total_count ?? 0),
    limit,
    offset
  };
}
async function getStockCountSummary(sessionId) {
  const { data, error } = await supabase.rpc("stock_count_summary", { _session_id: sessionId });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    total: Number(row?.total ?? 0),
    counted: Number(row?.counted ?? 0),
    diffCount: Number(row?.diff_count ?? 0),
    missing: Number(row?.missing_qty ?? 0),
    extra: Number(row?.extra_qty ?? 0),
    diffValue: Number(row?.diff_value ?? 0),
    prevTotalQty: Number(row?.prev_total_qty ?? 0),
    currTotalQty: Number(row?.curr_total_qty ?? 0),
    prevTotalValue: Number(row?.prev_total_value ?? 0),
    currTotalValue: Number(row?.curr_total_value ?? 0),
    extraProducts: Number(row?.extra_products ?? 0),
    missingProducts: Number(row?.missing_products ?? 0),
    nodiffProducts: Number(row?.nodiff_products ?? 0),
    extraValue: Number(row?.extra_value ?? 0),
    missingValue: Number(row?.missing_value ?? 0)
  };
}
async function getItemByBarcode(sessionId, barcode) {
  const { data, error } = await supabase.from("stock_count_items").select("id,session_id,product_id,barcode,name,category,purchase_price,frozen_qty,physical_qty,counted_at,counted_by").eq("session_id", sessionId).eq("barcode", barcode.trim()).maybeSingle();
  if (error) throw error;
  return data ?? null;
}
async function resetStockCountSession(sessionId) {
  const { data, error } = await supabase.rpc("reset_stock_count_session", {
    _session_id: sessionId
  });
  if (error) throw error;
  return Number(data ?? 0);
}
async function endStockCountSession(sessionId) {
  const { data, error } = await supabase.rpc("end_stock_count_session", {
    _session_id: sessionId
  });
  if (error) throw error;
  return data;
}
async function startNewStockCountSession() {
  const { count } = await supabase.from("stock_count_sessions").select("id", { count: "exact", head: true });
  const n = (count ?? 0) + 1;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return createSession({
    name: `Stock Count #${n}`,
    count_date: today,
    shop_id: null,
    blind_count: false,
    scan_mode: "manual"
  });
}
async function updateItemQty(itemId, physical_qty) {
  const user = (await supabase.auth.getUser()).data.user;
  const { error } = await supabase.from("stock_count_items").update({
    physical_qty,
    counted_at: physical_qty === null ? null : (/* @__PURE__ */ new Date()).toISOString(),
    counted_by: physical_qty === null ? null : user?.id ?? null
  }).eq("id", itemId);
  if (error) throw error;
}
async function refreshProgress(sessionId) {
  await supabase.rpc("refresh_stock_count_progress", { _session_id: sessionId });
}
async function updateSession(id, patch) {
  const { error } = await supabase.from("stock_count_sessions").update(patch).eq("id", id);
  if (error) throw error;
}
async function softDeleteSession(id) {
  const { error } = await supabase.from("stock_count_sessions").update({ is_deleted: true }).eq("id", id);
  if (error) throw error;
}
async function approveSession(id, reason, note) {
  const reasonMap = { _default: { reason, note } };
  const { data, error } = await supabase.rpc("approve_stock_count", {
    _session_id: id,
    _reason_map: reasonMap
  });
  if (error) throw error;
  return data;
}
async function listAdjustments(sessionId) {
  const { data, error } = await supabase.from("stock_count_adjustments").select("*").eq("session_id", sessionId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
async function reapplyStockCount(sessionId) {
  const { data, error } = await supabase.rpc("reapply_stock_count", {
    _session_id: sessionId
  });
  if (error) throw error;
  return data;
}
export {
  softDeleteSession as a,
  getStockCountSummary as b,
  listAdjustments as c,
  refreshProgress as d,
  endStockCountSession as e,
  getItemByBarcode as f,
  getSession as g,
  resetStockCountSession as h,
  updateSession as i,
  listItemsPage as j,
  approveSession as k,
  listSessions as l,
  reapplyStockCount as r,
  startNewStockCountSession as s,
  updateItemQty as u
};
