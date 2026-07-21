import { r as reactExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
function defaultMonthRange() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const fmt = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return { from: fmt(new Date(y, m, 1)), to: fmt(d) };
}
function entryKey(e) {
  return `${e.id ?? "no-id"}|shop_entries|${e.entry_type ?? "unknown"}|${e.txn_date ?? "no-date"}`;
}
function useShopPositions(range) {
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => (await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const { data: shopEntries = [] } = useQuery({
    queryKey: ["shop_entries", "all"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  return reactExports.useMemo(() => {
    const bounds = range === void 0 ? defaultMonthRange() : range;
    const byId = /* @__PURE__ */ new Map();
    const totalsById = /* @__PURE__ */ new Map();
    let total = 0;
    for (const s of shops) {
      const seen = /* @__PURE__ */ new Set();
      const rows = shopEntries.filter((e) => {
        if (e.shop_id !== s.id) return false;
        if (bounds.from && e.txn_date < bounds.from) return false;
        if (bounds.to && e.txn_date > bounds.to) return false;
        const key = entryKey(e);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const t = {
        cashSale: 0,
        bankWithdraw: 0,
        purchase: 0,
        expense: 0,
        bankSale: 0,
        cashIn: 0,
        simpleExpense: 0,
        position: 0
      };
      if (s.shop_type === "simple_cash") {
        for (const e of rows) {
          if (e.entry_type === "sale") t.cashIn += Number(e.cash_sale || 0);
          else if (e.entry_type === "expense") t.simpleExpense += Number(e.expense_amount || 0);
        }
        t.position = t.cashIn - t.simpleExpense;
      } else {
        for (const e of rows) {
          t.cashSale += Number(e.cash_sale || 0);
          t.bankWithdraw += Number(e.withdraw_amount || 0);
          t.purchase += Number(e.purchase_amount || 0);
          t.expense += Number(e.expense_amount || 0);
          t.bankSale += Number(e.bank_sale || 0);
        }
        t.position = t.cashSale + t.bankWithdraw - (t.purchase + t.expense);
      }
      byId.set(s.id, t.position);
      totalsById.set(s.id, t);
      total += t.position;
    }
    if (typeof window !== "undefined" && window.__SHOP_POS_DEBUG__) {
      console.info("[useShopPositions] master positions", Object.fromEntries(byId), "total", total);
    }
    return { byId, totalsById, total };
  }, [shops, shopEntries, range?.from, range?.to]);
}
function assertShopPositionMatch(shopId, local, master, source) {
  if (typeof window === "undefined") return;
  if (Math.abs(local - master) > 0.01) {
    console.warn(
      `[ShopPosition mismatch] shop=${shopId} source=${source} local=${local} master=${master} diff=${local - master}`
    );
  }
}
export {
  assertShopPositionMatch as a,
  useShopPositions as u
};
