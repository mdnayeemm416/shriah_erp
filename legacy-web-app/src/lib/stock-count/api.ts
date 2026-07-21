import { supabase } from "@/integrations/supabase/client";
import type {
  StockCountSession,
  StockCountItem,
  StockCountAdjustment,
  StockCountItemPage,
  StockCountSummary,
  StockCountStatus,
  ScanMode,
} from "./types";

export async function listSessions(): Promise<StockCountSession[]> {
  const { data, error } = await supabase
    .from("stock_count_sessions")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as any;
}

export async function getSession(id: string): Promise<StockCountSession> {
  const { data, error } = await supabase
    .from("stock_count_sessions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as any;
}

export async function createSession(input: {
  name: string;
  count_date: string;
  shop_id: string | null;
  blind_count: boolean;
  scan_mode: ScanMode;
}): Promise<StockCountSession> {
  const user = (await supabase.auth.getUser()).data.user;
  const { data, error } = await supabase
    .from("stock_count_sessions")
    .insert({
      name: input.name,
      count_date: input.count_date,
      shop_id: input.shop_id,
      blind_count: input.blind_count,
      scan_mode: input.scan_mode,
      status: "draft",
      created_by: user?.id ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  // Snapshot products
  const { error: rpcErr } = await supabase.rpc("start_stock_count_session", {
    _session_id: data.id,
  });
  if (rpcErr) throw rpcErr;
  return data as any;
}

export async function listItems(sessionId: string): Promise<StockCountItem[]> {
  return (await listItemsPage({ sessionId, limit: 100, offset: 0 })).items;
}

export async function listItemsPage(input: {
  sessionId: string;
  limit?: number;
  offset?: number;
  filter?: "all" | "counted" | "not_counted" | "diff" | "pos" | "neg" | "nodiff";
  search?: string;
}): Promise<StockCountItemPage> {
  const limit = input.limit ?? 100;
  const offset = input.offset ?? 0;
  const { data, error } = await supabase.rpc("stock_count_items_page" as any, {
    _session_id: input.sessionId,
    _limit: limit,
    _offset: offset,
    _filter: input.filter ?? "all",
    _search: input.search?.trim() || null,
  });
  if (error) throw error;
  const rows = (data ?? []) as any[];
  return {
    items: rows.map(({ total_count: _total, ...row }) => row) as any,
    total: Number(rows[0]?.total_count ?? 0),
    limit,
    offset,
  };
}

export async function getStockCountSummary(sessionId: string): Promise<StockCountSummary> {
  const { data, error } = await supabase.rpc("stock_count_summary" as any, { _session_id: sessionId });
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
    missingValue: Number(row?.missing_value ?? 0),
  };
}

export async function getItemByBarcode(sessionId: string, barcode: string): Promise<StockCountItem | null> {
  const { data, error } = await supabase
    .from("stock_count_items")
    .select("id,session_id,product_id,barcode,name,category,purchase_price,frozen_qty,physical_qty,counted_at,counted_by")
    .eq("session_id", sessionId)
    .eq("barcode", barcode.trim())
    .maybeSingle();
  if (error) throw error;
  return (data as any) ?? null;
}

export async function resetStockCountSession(sessionId: string): Promise<number> {
  const { data, error } = await supabase.rpc("reset_stock_count_session" as any, {
    _session_id: sessionId,
  });
  if (error) throw error;
  return Number(data ?? 0);
}

export async function endStockCountSession(
  sessionId: string
): Promise<{ adjustments: number; diff_qty: number; diff_value: number }> {
  const { data, error } = await supabase.rpc("end_stock_count_session" as any, {
    _session_id: sessionId,
  });
  if (error) throw error;
  return data as any;
}

export async function startNewStockCountSession(): Promise<StockCountSession> {
  const { count } = await supabase
    .from("stock_count_sessions")
    .select("id", { count: "exact", head: true });
  const n = (count ?? 0) + 1;
  const today = new Date().toISOString().slice(0, 10);
  return createSession({
    name: `Stock Count #${n}`,
    count_date: today,
    shop_id: null,
    blind_count: false,
    scan_mode: "manual",
  });
}

export async function updateItemQty(itemId: string, physical_qty: number | null): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  const { error } = await supabase
    .from("stock_count_items")
    .update({
      physical_qty,
      counted_at: physical_qty === null ? null : new Date().toISOString(),
      counted_by: physical_qty === null ? null : user?.id ?? null,
    })
    .eq("id", itemId);
  if (error) throw error;
}

export async function refreshProgress(sessionId: string): Promise<void> {
  await supabase.rpc("refresh_stock_count_progress", { _session_id: sessionId });
}

export async function updateSession(
  id: string,
  patch: Partial<Pick<StockCountSession, "name" | "blind_count" | "scan_mode" | "status">>
): Promise<void> {
  const { error } = await supabase.from("stock_count_sessions").update(patch).eq("id", id);
  if (error) throw error;
}

export async function setStatus(id: string, status: StockCountStatus) {
  return updateSession(id, { status });
}

export async function softDeleteSession(id: string) {
  const { error } = await supabase.from("stock_count_sessions").update({ is_deleted: true }).eq("id", id);
  if (error) throw error;
}

export async function approveSession(
  id: string,
  reason: string,
  note: string
): Promise<{ adjustments: number; diff_qty: number; diff_value: number }> {
  const reasonMap = { _default: { reason, note } } as any;
  const { data, error } = await supabase.rpc("approve_stock_count", {
    _session_id: id,
    _reason_map: reasonMap,
  });
  if (error) throw error;
  return data as any;
}

export async function listAdjustments(sessionId: string): Promise<StockCountAdjustment[]> {
  const { data, error } = await supabase
    .from("stock_count_adjustments")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any;
}

export async function reapplyStockCount(sessionId: string): Promise<{ applied: number }> {
  const { data, error } = await supabase.rpc("reapply_stock_count" as any, {
    _session_id: sessionId,
  });
  if (error) throw error;
  return data as any;
}

export async function listShops() {
  const { data, error } = await supabase
    .from("shops")
    .select("id,name")
    .eq("is_deleted", false)
    .order("name");
  if (error) throw error;
  return data ?? [];
}
