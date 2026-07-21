import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ShopPositionTotals = {
  cashSale: number;
  bankWithdraw: number;
  purchase: number;
  expense: number;
  bankSale: number;
  // Simple-shop variant
  cashIn: number;
  simpleExpense: number;
  position: number;
};

type ShopPositionRange = { from?: string | null; to?: string | null };

function defaultMonthRange(): Required<Pick<ShopPositionRange, "from" | "to">> {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return { from: fmt(new Date(y, m, 1)), to: fmt(d) };
}

function entryKey(e: any) {
  return `${e.id ?? "no-id"}|shop_entries|${e.entry_type ?? "unknown"}|${e.txn_date ?? "no-date"}`;
}

/**
 * SINGLE SOURCE OF TRUTH — Shop Cash Position.
 *
 * Calculated ONCE here from period-bound shop_entries. Every page (Shop card,
 * Summary, Dashboard, Reports, Daily Closing, Cash In App) must read from
 * this hook instead of recomputing locally. Date filters on individual pages
 * pass their range here; pages without a range use the Shop Page default month.
 *
 * Formula (locked — do not change without updating every consumer):
 *   full_erp:    (Cash Sale + Bank Withdraw) − (Purchase + Expense)
 *   simple_cash: Cash In − Expense
 *
 * Explicitly EXCLUDED from Cash Position: POS Sale, Bank Sale, Credit Sale,
 * Difference. Those are tracked elsewhere (Expected Bank Balance, etc.).
 */
export function useShopPositions(range?: ShopPositionRange) {
  // TRUE manual-refresh mode: snapshot only, no background refetch.
  // Data updates exclusively when the user clicks Refresh / a summary card
  // on the Shop Page (which calls qc.invalidateQueries on these keys).
  const { data: shops = [] } = useQuery<any[]>({
    queryKey: ["shops"],
    queryFn: async () => (await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: shopEntries = [] } = useQuery<any[]>({
    queryKey: ["shop_entries", "all"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return useMemo(() => {
    const bounds = range === undefined ? defaultMonthRange() : range;
    const byId = new Map<string, number>();
    const totalsById = new Map<string, ShopPositionTotals>();
    let total = 0;

    for (const s of shops as any[]) {
      const seen = new Set<string>();
      const rows = (shopEntries as any[]).filter((e) => {
        if (e.shop_id !== s.id) return false;
        if (bounds.from && e.txn_date < bounds.from) return false;
        if (bounds.to && e.txn_date > bounds.to) return false;
        const key = entryKey(e);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const t: ShopPositionTotals = {
        cashSale: 0, bankWithdraw: 0, purchase: 0, expense: 0, bankSale: 0,
        cashIn: 0, simpleExpense: 0, position: 0,
      };

      if (s.shop_type === "simple_cash") {
        for (const e of rows) {
          if (e.entry_type === "sale") t.cashIn += Number(e.cash_sale || 0);
          else if (e.entry_type === "expense") t.simpleExpense += Number(e.expense_amount || 0);
        }
        t.position = t.cashIn - t.simpleExpense;
      } else {
        // full_erp — Cash Position uses ONLY: cash_sale, withdraw_amount, purchase_amount, expense_amount.
        // Bank/POS/Credit sales are NOT included.
        for (const e of rows) {
          t.cashSale += Number(e.cash_sale || 0);
          t.bankWithdraw += Number(e.withdraw_amount || 0);
          t.purchase += Number(e.purchase_amount || 0);
          t.expense += Number(e.expense_amount || 0);
          t.bankSale += Number(e.bank_sale || 0);
        }
        t.position = (t.cashSale + t.bankWithdraw) - (t.purchase + t.expense);
      }

      byId.set(s.id, t.position);
      totalsById.set(s.id, t);
      total += t.position;

    }

    if (typeof window !== "undefined" && (window as any).__SHOP_POS_DEBUG__) {
      // eslint-disable-next-line no-console
      console.info("[useShopPositions] master positions", Object.fromEntries(byId), "total", total);
    }

    return { byId, totalsById, total };
  }, [shops, shopEntries, range?.from, range?.to]);
}

/** Helper: assert a locally-computed position matches the master. */
export function assertShopPositionMatch(shopId: string, local: number, master: number, source: string) {
  if (typeof window === "undefined") return;
  if (Math.abs(local - master) > 0.01) {
    // eslint-disable-next-line no-console
    console.warn(
      `[ShopPosition mismatch] shop=${shopId} source=${source} local=${local} master=${master} diff=${local - master}`,
    );
  }
}
