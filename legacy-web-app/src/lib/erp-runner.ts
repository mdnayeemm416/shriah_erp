// Magic Search aggregator — runs minimal indexed queries per metric/report.
// Filters by shop, cashier, employee, and party scopes server-side.

import { supabase } from "@/integrations/supabase/client";
import type { ErpIntent, ErpMetric } from "./erp-query";
import { METRIC_LABEL } from "./erp-query";

export type BreakdownEntry = {
  id: string;
  kind: "shop" | "warehouse" | "employee";
  label: string;
  date: string | null;
  amount: number;
  note?: string;
};

export type MetricResult = {
  metric: ErpMetric;
  label: string;
  value: number;
  scopeLabel: string;
  dateLabel: string;
  intent: ErpIntent;
  query?: string;
  breakdown?: Array<{ label: string; value: number }>;
  entries?: BreakdownEntry[];
};

export type ReportResult = {
  scopeLabel: string;
  dateLabel: string;
  intent: ErpIntent;
  query?: string;
  rows: Array<{ label: string; value: number; emphasis?: boolean }>;
};

type Bounds = { from: string | null; to: string | null };

async function fetchShopIdByName(name: string): Promise<string | null> {
  const { data } = await supabase.from("shops").select("id, name").eq("is_deleted", false).ilike("name", name).limit(1);
  return data?.[0]?.id ?? null;
}

async function fetchCashierIdByName(name: string, shopId: string | null): Promise<string | null> {
  let qb: any = supabase.from("cashiers").select("id, name, shop_id").eq("is_deleted", false).ilike("name", name);
  if (shopId) qb = qb.eq("shop_id", shopId);
  const { data } = await qb.limit(1);
  return data?.[0]?.id ?? null;
}

async function fetchEmployeeIdByName(name: string): Promise<string | null> {
  const { data } = await supabase.from("employees").select("id, name").eq("is_deleted", false).ilike("name", name).limit(1);
  return data?.[0]?.id ?? null;
}

async function shopAggregates(shopId: string | null, cashierId: string | null, b: Bounds) {
  let qb: any = supabase.from("shop_entries")
    .select("id, txn_date, entry_type, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, notes, shop_id, cashier_id, shops(name), cashiers(name)")
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (shopId) qb = qb.eq("shop_id", shopId);
  if (cashierId) qb = qb.eq("cashier_id", cashierId);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2000);
  const tot = { cash_sale: 0, pos_sale: 0, bank_sale: 0, credit_sale: 0, purchase: 0, withdraw: 0, expense: 0 };
  const rows = (data ?? []) as any[];
  for (const r of rows) {
    if (r.entry_type === "sale") {
      tot.cash_sale += +r.cash_sale || 0;
      tot.pos_sale += +r.pos_sale || 0;
      tot.bank_sale += +r.bank_sale || 0;
      tot.credit_sale += +r.credit_sale || 0;
    } else if (r.entry_type === "purchase") tot.purchase += +r.purchase_amount || 0;
    else if (r.entry_type === "withdraw") tot.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") tot.expense += +r.expense_amount || 0;
  }
  return { tot, rows };
}

async function warehouseAggregates(party: string | null, b: Bounds) {
  let qb: any = supabase.from("warehouse_ledger")
    .select("id, txn_date, entry_type, payment_status, amount, paid_amount, remaining_due, party_name, notes")
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (party) qb = qb.ilike("party_name", party);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2000);
  const tot = { cash_buy: 0, credit_buy: 0, due_payment: 0, total_purchase: 0 };
  const rows = (data ?? []) as any[];
  for (const r of rows) {
    if (r.entry_type === "warehouse_purchase") {
      const a = +r.amount || 0;
      tot.total_purchase += a;
      if (r.payment_status === "cash") tot.cash_buy += a;
      else if (r.payment_status === "credit") tot.credit_buy += a;
      else if (r.payment_status === "partial") {
        tot.cash_buy += +r.paid_amount || 0;
        tot.credit_buy += +r.remaining_due || 0;
      }
    } else if (r.entry_type === "supplier_payment") {
      tot.due_payment += +r.amount || 0;
    }
  }
  return { tot, rows };
}

async function employeeAggregates(employeeId: string | null, b: Bounds) {
  let qb: any = supabase.from("employee_entries")
    .select("id, txn_date, entry_type, amount, notes, employee_id, employees:employee_id(name)" as any)
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (employeeId) qb = qb.eq("employee_id", employeeId);
  const { data } = await qb.order("txn_date", { ascending: false }).limit(2000);
  const tot = { given: 0, received: 0 };
  const rows = (data ?? []) as any[];
  for (const r of rows) {
    const a = +r.amount || 0;
    if (r.entry_type === "given") tot.given += a; else tot.received += a;
  }
  return { tot, rows };
}

async function otherIncome(b: Bounds) {
  let qb: any = supabase.from("overview_entries").select("entry_type, amount").eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  const { data } = await qb.limit(2000);
  let total = 0;
  for (const r of (data ?? []) as any[]) {
    if (r.entry_type === "income" || r.entry_type === "other_income") total += +r.amount || 0;
  }
  return total;
}

async function closingAggregates(b: Bounds) {
  let qb: any = supabase.from("daily_closings")
    .select("expected_cash, counted_cash, difference, closing_date")
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("closing_date", b.from);
  if (b.to) qb = qb.lte("closing_date", b.to);
  const { data } = await qb.limit(1000);
  const tot = { expected: 0, actual: 0, diff: 0, count: 0 };
  for (const r of (data ?? []) as any[]) {
    tot.expected += +r.expected_cash || 0;
    tot.actual += +r.counted_cash || 0;
    tot.diff += +r.difference || 0;
    tot.count++;
  }
  return tot;
}

function scopeLabel(intent: ErpIntent): string {
  const bits: string[] = [];
  if (intent.scope === "warehouse") bits.push("Warehouse");
  else if (intent.scope !== "all") bits.push(intent.scope);
  if (intent.cashier) bits.push(intent.cashier);
  if (intent.employee) bits.push(intent.employee);
  if (intent.party) bits.push(intent.party);
  return bits.length ? bits.join(" · ") : "All Shops";
}

function dateLabel(b: Bounds): string {
  if (!b.from && !b.to) return "All time";
  if (b.from && b.to && b.from === b.to) return b.from;
  return `${b.from ?? "…"} → ${b.to ?? "…"}`;
}

function shopEntriesToBreakdown(rows: any[], pick: (r: any) => number, label: (r: any) => string, limit = 25): BreakdownEntry[] {
  return rows
    .map((r) => ({
      id: r.id,
      kind: "shop" as const,
      label: label(r),
      date: r.txn_date,
      amount: pick(r),
      note: r.notes ?? undefined,
    }))
    .filter((e) => e.amount > 0)
    .slice(0, limit);
}

export async function runMetric(intent: ErpIntent, b: Bounds): Promise<MetricResult | null> {
  if (!intent.metric) return null;
  const sLabel = scopeLabel(intent);
  const dLabel = dateLabel(b);
  const m = intent.metric;

  const shopId = intent.scope !== "all" && intent.scope !== "warehouse"
    ? await fetchShopIdByName(intent.scope) : null;
  const cashierId = intent.cashier ? await fetchCashierIdByName(intent.cashier, shopId) : null;
  const employeeId = intent.employee ? await fetchEmployeeIdByName(intent.employee) : null;

  // Shop-side metrics
  if (["cash_sale","pos_sale","bank_sale","credit_sale","total_sale","expense","withdraw"].includes(m)) {
    const { tot: t, rows } = await shopAggregates(shopId, cashierId, b);
    let value = 0;
    let entries: BreakdownEntry[] = [];
    if (m === "cash_sale") {
      value = t.cash_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.cash_sale || 0, (r) => `Cash Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "pos_sale") {
      value = t.pos_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.pos_sale || 0, (r) => `POS Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "bank_sale") {
      value = t.bank_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.bank_sale || 0, (r) => `Bank Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "credit_sale") {
      value = t.credit_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"), (r) => +r.credit_sale || 0, (r) => `Credit Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "total_sale") {
      value = t.cash_sale + t.pos_sale + t.bank_sale + t.credit_sale;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "sale"),
        (r) => (+r.cash_sale || 0) + (+r.pos_sale || 0) + (+r.bank_sale || 0) + (+r.credit_sale || 0),
        (r) => `Sale · ${r.shops?.name ?? ""}`);
    } else if (m === "expense") {
      value = t.expense;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "expense"), (r) => +r.expense_amount || 0, (r) => `Expense · ${r.shops?.name ?? ""}`);
    } else if (m === "withdraw") {
      value = t.withdraw;
      entries = shopEntriesToBreakdown(rows.filter((r) => r.entry_type === "withdraw"), (r) => +r.withdraw_amount || 0, (r) => `Withdraw · ${r.shops?.name ?? ""}`);
    }
    const breakdown = m === "total_sale" ? [
      { label: "Cash", value: t.cash_sale },
      { label: "POS", value: t.pos_sale },
      { label: "Bank", value: t.bank_sale },
      { label: "Credit", value: t.credit_sale },
    ] : undefined;
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, breakdown, entries, intent };
  }

  if (m === "cash_position") {
    const { tot: t } = await shopAggregates(shopId, cashierId, b);
    const value = (t.cash_sale + t.withdraw) - (t.purchase + t.expense);
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, intent };
  }

  if (["cash_buy","credit_buy","due_payment","total_purchase"].includes(m)) {
    const { tot: w, rows } = await warehouseAggregates(intent.party, b);
    const value = (w as any)[m] ?? 0;
    const entries: BreakdownEntry[] = rows
      .filter((r) => {
        if (m === "due_payment") return r.entry_type === "supplier_payment";
        if (m === "credit_buy") return r.entry_type === "warehouse_purchase" && (r.payment_status === "credit" || r.payment_status === "partial");
        if (m === "cash_buy") return r.entry_type === "warehouse_purchase" && (r.payment_status === "cash" || r.payment_status === "partial");
        return r.entry_type === "warehouse_purchase";
      })
      .slice(0, 25)
      .map((r) => ({
        id: r.id, kind: "warehouse" as const,
        label: `${r.entry_type === "supplier_payment" ? "Payment" : "Purchase"} · ${r.party_name ?? ""}`,
        date: r.txn_date,
        amount: +r.amount || 0,
        note: r.notes ?? undefined,
      }));
    return {
      metric: m, label: METRIC_LABEL[m], value,
      scopeLabel: intent.party ? `${intent.party} · Warehouse` : "Warehouse",
      dateLabel: dLabel, entries, intent,
    };
  }

  if (m === "employee_given" || m === "employee_received") {
    const { tot: e, rows } = await employeeAggregates(employeeId, b);
    const value = m === "employee_given" ? e.given : e.received;
    const entries: BreakdownEntry[] = rows
      .filter((r) => r.entry_type === (m === "employee_given" ? "given" : "received"))
      .slice(0, 25)
      .map((r) => ({
        id: r.id, kind: "employee" as const,
        label: `${m === "employee_given" ? "Given" : "Received"} · ${r.employees?.name ?? ""}`,
        date: r.txn_date, amount: +r.amount || 0, note: r.notes ?? undefined,
      }));
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, entries, intent };
  }

  if (m === "other_income") {
    const value = await otherIncome(b);
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, intent };
  }

  if (m === "plus_minus" || m === "expected_cash" || m === "actual_cash" || m === "daily_closing") {
    const c = await closingAggregates(b);
    const value = m === "plus_minus" ? c.diff
      : m === "expected_cash" ? c.expected
      : m === "actual_cash" ? c.actual
      : c.diff;
    const breakdown = m === "daily_closing" ? [
      { label: "Expected", value: c.expected },
      { label: "Actual", value: c.actual },
      { label: "Difference", value: c.diff },
      { label: "Closings", value: c.count },
    ] : undefined;
    return { metric: m, label: METRIC_LABEL[m], value, scopeLabel: sLabel, dateLabel: dLabel, breakdown, intent };
  }

  return null;
}

export async function runReport(intent: ErpIntent, b: Bounds): Promise<ReportResult> {
  const sLabel = scopeLabel(intent);
  const dLabel = dateLabel(b);
  const shopId = intent.scope !== "all" && intent.scope !== "warehouse"
    ? await fetchShopIdByName(intent.scope) : null;
  const cashierId = intent.cashier ? await fetchCashierIdByName(intent.cashier, shopId) : null;
  const employeeId = intent.employee ? await fetchEmployeeIdByName(intent.employee) : null;

  const [s, w, e, c] = await Promise.all([
    shopAggregates(shopId, cashierId, b),
    warehouseAggregates(intent.party, b),
    employeeAggregates(employeeId, b),
    closingAggregates(b),
  ]);

  const totalSale = s.tot.cash_sale + s.tot.pos_sale + s.tot.bank_sale + s.tot.credit_sale;
  const cashPosition = (s.tot.cash_sale + s.tot.withdraw) - (s.tot.purchase + s.tot.expense);

  return {
    scopeLabel: sLabel,
    dateLabel: dLabel,
    intent,
    rows: [
      { label: "Cash Sale", value: s.tot.cash_sale },
      { label: "POS Sale", value: s.tot.pos_sale },
      { label: "Bank Sale", value: s.tot.bank_sale },
      { label: "Credit Sale", value: s.tot.credit_sale },
      { label: "Total Sale", value: totalSale, emphasis: true },
      { label: "Shop Purchase", value: s.tot.purchase },
      { label: "Warehouse Purchase", value: w.tot.total_purchase },
      { label: "Expense", value: s.tot.expense },
      { label: "Withdraw", value: s.tot.withdraw },
      { label: "Employee Given", value: e.tot.given },
      { label: "Employee Received", value: e.tot.received },
      { label: "Cash Position", value: cashPosition, emphasis: true },
      { label: "Plus / Minus", value: c.diff, emphasis: true },
    ],
  };
}
