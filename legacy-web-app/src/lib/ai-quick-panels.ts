// AI Quick Panels — pre-computed lightweight insights for the empty state.
// One Supabase round-trip per panel. Cached results are passed via React state.

import { supabase } from "@/integrations/supabase/client";

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export type DailySummary = {
  totalSale: number;
  cashSale: number;
  expense: number;
  withdraw: number;
  purchase: number;
  closingDiff: number;
};

export async function fetchDailySummary(date = new Date()): Promise<DailySummary> {
  const d = ymd(date);
  const [{ data: shop }, { data: cls }] = await Promise.all([
    supabase.from("shop_entries")
      .select("entry_type, cash_sale, pos_sale, bank_sale, credit_sale, expense_amount, withdraw_amount, purchase_amount")
      .eq("is_deleted", false).eq("txn_date", d),
    supabase.from("daily_closings")
      .select("difference").eq("is_deleted", false).eq("closing_date", d),
  ]);
  const s = { cash: 0, pos: 0, bank: 0, credit: 0, expense: 0, withdraw: 0, purchase: 0 };
  for (const r of (shop ?? []) as any[]) {
    if (r.entry_type === "sale") {
      s.cash += +r.cash_sale || 0; s.pos += +r.pos_sale || 0;
      s.bank += +r.bank_sale || 0; s.credit += +r.credit_sale || 0;
    } else if (r.entry_type === "expense") s.expense += +r.expense_amount || 0;
    else if (r.entry_type === "withdraw") s.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "purchase") s.purchase += +r.purchase_amount || 0;
  }
  const closingDiff = (cls ?? []).reduce((a, r: any) => a + (+r.difference || 0), 0);
  return {
    totalSale: s.cash + s.pos + s.bank + s.credit,
    cashSale: s.cash, expense: s.expense, withdraw: s.withdraw,
    purchase: s.purchase, closingDiff,
  };
}

export type CashHealth = {
  inflow: number;
  outflow: number;
  net: number;
  ratio: number; // inflow / max(outflow,1)
  status: "healthy" | "watch" | "risk";
};

export async function fetchCashHealth(days = 30): Promise<CashHealth> {
  const end = new Date(); const start = new Date(); start.setDate(start.getDate() - days + 1);
  const from = ymd(start), to = ymd(end);
  const { data } = await supabase.from("shop_entries")
    .select("entry_type, cash_sale, expense_amount, withdraw_amount, purchase_amount")
    .eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to).limit(5000);
  let inflow = 0, outflow = 0;
  for (const r of (data ?? []) as any[]) {
    if (r.entry_type === "sale") inflow += +r.cash_sale || 0;
    else if (r.entry_type === "withdraw") inflow += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") outflow += +r.expense_amount || 0;
    else if (r.entry_type === "purchase") outflow += +r.purchase_amount || 0;
  }
  const ratio = inflow / Math.max(outflow, 1);
  const status: CashHealth["status"] =
    ratio >= 1.2 ? "healthy" : ratio >= 0.95 ? "watch" : "risk";
  return { inflow, outflow, net: inflow - outflow, ratio, status };
}

export type StabilityScore = {
  score: number;       // 0–100
  components: { label: string; value: number; max: number }[];
};

export async function fetchStabilityScore(): Promise<StabilityScore> {
  const end = new Date(); const start30 = new Date(); start30.setDate(start30.getDate() - 29);
  const from = ymd(start30), to = ymd(end);

  const [{ data: shop }, { data: cls }] = await Promise.all([
    supabase.from("shop_entries")
      .select("txn_date, entry_type, cash_sale, pos_sale, bank_sale, credit_sale, expense_amount, withdraw_amount, purchase_amount")
      .eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to).limit(10000),
    supabase.from("daily_closings")
      .select("difference, closing_date").eq("is_deleted", false).gte("closing_date", from).lte("closing_date", to),
  ]);

  // Daily revenue series
  const perDay = new Map<string, { sale: number; out: number }>();
  for (const r of (shop ?? []) as any[]) {
    const day = perDay.get(r.txn_date) ?? { sale: 0, out: 0 };
    if (r.entry_type === "sale") {
      day.sale += (+r.cash_sale || 0) + (+r.pos_sale || 0) + (+r.bank_sale || 0) + (+r.credit_sale || 0);
    } else if (r.entry_type === "expense") day.out += +r.expense_amount || 0;
    else if (r.entry_type === "purchase") day.out += +r.purchase_amount || 0;
    perDay.set(r.txn_date, day);
  }
  const days = Array.from(perDay.values());
  const totalSale = days.reduce((a, d) => a + d.sale, 0);
  const totalOut = days.reduce((a, d) => a + d.out, 0);

  // 1) Profitability proxy (max 40)
  const margin = totalSale > 0 ? Math.max(0, (totalSale - totalOut) / totalSale) : 0;
  const profitability = Math.round(margin * 40);

  // 2) Revenue consistency (max 30) — lower stddev / mean = higher score
  const mean = days.length ? totalSale / days.length : 0;
  const variance = days.length ? days.reduce((a, d) => a + (d.sale - mean) ** 2, 0) / days.length : 0;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
  const consistency = Math.max(0, Math.round(30 * (1 - Math.min(cv, 1))));

  // 3) Closing accuracy (max 30) — small abs diffs = high score
  const diffs = (cls ?? []).map((r: any) => Math.abs(+r.difference || 0));
  const avgDiff = diffs.length ? diffs.reduce((a, x) => a + x, 0) / diffs.length : 0;
  const denom = Math.max(mean * 0.05, 50);
  const accuracy = Math.max(0, Math.round(30 * (1 - Math.min(avgDiff / denom, 1))));

  const score = Math.min(100, profitability + consistency + accuracy);
  return {
    score,
    components: [
      { label: "Profitability", value: profitability, max: 40 },
      { label: "Revenue Consistency", value: consistency, max: 30 },
      { label: "Closing Accuracy", value: accuracy, max: 30 },
    ],
  };
}
