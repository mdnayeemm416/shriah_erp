// AI Compare Engine — detects "compare X and Y" / "X vs Y" intent and runs
// side-by-side aggregations across shops / cashiers / employees / suppliers / periods.
// Pure parsing + thin Supabase calls. No heavy realtime work.

import { supabase } from "@/integrations/supabase/client";

export type ComparePair = "shop" | "cashier" | "employee" | "party" | "period";

export type CompareIntent = {
  kind: ComparePair;
  a: string;
  b: string;
  raw: string;
};

const COMPARE_RE = /\bcompare\s+(.+?)\s+(?:and|vs|versus|with|to)\s+(.+)$/i;
const VS_RE = /^(.+?)\s+(?:vs|versus)\s+(.+)$/i;

const PERIOD_TOKENS = [
  "this month", "last month", "this week", "last week",
  "today", "yesterday", "this year", "last year",
];

export function detectCompareIntent(
  input: string,
  entities: { shops?: string[]; cashiers?: string[]; employees?: string[]; parties?: string[] } = {},
): CompareIntent | null {
  const raw = input.trim();
  const m = raw.match(COMPARE_RE) ?? raw.match(VS_RE);
  if (!m) return null;
  const a = m[1].trim().replace(/[?.!]+$/, "");
  const b = m[2].trim().replace(/[?.!]+$/, "");
  if (!a || !b) return null;

  const lowA = a.toLowerCase(), lowB = b.toLowerCase();
  if (PERIOD_TOKENS.includes(lowA) && PERIOD_TOKENS.includes(lowB)) {
    return { kind: "period", a: lowA, b: lowB, raw };
  }

  const find = (s: string, pool: string[] | undefined) =>
    (pool ?? []).find((n) => n.toLowerCase() === s);

  // Try each entity bucket in priority order.
  for (const [kind, pool] of [
    ["shop", entities.shops],
    ["cashier", entities.cashiers],
    ["employee", entities.employees],
    ["party", entities.parties],
  ] as [ComparePair, string[] | undefined][]) {
    const ma = find(lowA, pool); const mb = find(lowB, pool);
    if (ma && mb) return { kind, a: ma, b: mb, raw };
  }
  // Loose contains fallback
  for (const [kind, pool] of [
    ["shop", entities.shops],
    ["cashier", entities.cashiers],
    ["employee", entities.employees],
    ["party", entities.parties],
  ] as [ComparePair, string[] | undefined][]) {
    const ma = (pool ?? []).find((n) => lowA.includes(n.toLowerCase()));
    const mb = (pool ?? []).find((n) => lowB.includes(n.toLowerCase()));
    if (ma && mb) return { kind, a: ma, b: mb, raw };
  }
  return null;
}

export type CompareRow = { label: string; a: number; b: number };

export type CompareResult = {
  kind: ComparePair;
  aLabel: string;
  bLabel: string;
  dateLabel: string;
  rows: CompareRow[];
  winner: "a" | "b" | "tie";
  headline: { label: string; a: number; b: number };
};

type Bounds = { from: string | null; to: string | null };

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export function periodToBounds(p: string): Bounds {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let f = new Date(today), t = new Date(today);
  if (p === "today") { /* same day */ }
  else if (p === "yesterday") { f.setDate(f.getDate() - 1); t = new Date(f); }
  else if (p === "this week") { f.setDate(f.getDate() - f.getDay()); }
  else if (p === "last week") { f.setDate(f.getDate() - f.getDay() - 7); t = new Date(f); t.setDate(t.getDate() + 6); }
  else if (p === "this month") { f = new Date(today.getFullYear(), today.getMonth(), 1); }
  else if (p === "last month") {
    f = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    t = new Date(today.getFullYear(), today.getMonth(), 0);
  }
  else if (p === "this year") { f = new Date(today.getFullYear(), 0, 1); }
  else if (p === "last year") {
    f = new Date(today.getFullYear() - 1, 0, 1);
    t = new Date(today.getFullYear() - 1, 11, 31);
  }
  return { from: ymd(f), to: ymd(t) };
}

async function shopAgg(filter: { shopName?: string; cashierName?: string }, b: Bounds) {
  let qb: any = supabase.from("shop_entries")
    .select("entry_type, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shops!inner(name), cashiers(name)")
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  if (filter.shopName) qb = qb.ilike("shops.name", filter.shopName);
  if (filter.cashierName) qb = qb.ilike("cashiers.name", filter.cashierName);
  const { data } = await qb.limit(5000);
  const t = { cash_sale: 0, pos_sale: 0, bank_sale: 0, credit_sale: 0, total_sale: 0, purchase: 0, withdraw: 0, expense: 0 };
  for (const r of (data ?? []) as any[]) {
    if (r.entry_type === "sale") {
      t.cash_sale += +r.cash_sale || 0;
      t.pos_sale += +r.pos_sale || 0;
      t.bank_sale += +r.bank_sale || 0;
      t.credit_sale += +r.credit_sale || 0;
    } else if (r.entry_type === "purchase") t.purchase += +r.purchase_amount || 0;
    else if (r.entry_type === "withdraw") t.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") t.expense += +r.expense_amount || 0;
  }
  t.total_sale = t.cash_sale + t.pos_sale + t.bank_sale + t.credit_sale;
  return t;
}

async function employeeAgg(name: string, b: Bounds) {
  let qb: any = supabase.from("employee_entries")
    .select("entry_type, amount, employees!inner(name)")
    .eq("is_deleted", false);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  qb = qb.ilike("employees.name", name);
  const { data } = await qb.limit(2000);
  const t = { given: 0, received: 0, net: 0 };
  for (const r of (data ?? []) as any[]) {
    const a = +r.amount || 0;
    if (r.entry_type === "given") t.given += a; else t.received += a;
  }
  t.net = t.given - t.received;
  return t;
}

async function partyAgg(name: string, b: Bounds) {
  let qb: any = supabase.from("warehouse_ledger")
    .select("entry_type, payment_status, amount, paid_amount, remaining_due")
    .eq("is_deleted", false).ilike("party_name", name);
  if (b.from) qb = qb.gte("txn_date", b.from);
  if (b.to) qb = qb.lte("txn_date", b.to);
  const { data } = await qb.limit(2000);
  const t = { total_purchase: 0, cash_buy: 0, credit_buy: 0, due_payment: 0 };
  for (const r of (data ?? []) as any[]) {
    if (r.entry_type === "warehouse_purchase") {
      const a = +r.amount || 0;
      t.total_purchase += a;
      if (r.payment_status === "cash") t.cash_buy += a;
      else if (r.payment_status === "credit") t.credit_buy += a;
      else if (r.payment_status === "partial") {
        t.cash_buy += +r.paid_amount || 0;
        t.credit_buy += +r.remaining_due || 0;
      }
    } else if (r.entry_type === "supplier_payment") t.due_payment += +r.amount || 0;
  }
  return t;
}

export async function runCompare(intent: CompareIntent, bounds: Bounds): Promise<CompareResult> {
  const dLabel = bounds.from && bounds.to
    ? (bounds.from === bounds.to ? bounds.from : `${bounds.from} → ${bounds.to}`)
    : "All time";

  if (intent.kind === "shop") {
    const [A, B] = await Promise.all([
      shopAgg({ shopName: intent.a }, bounds),
      shopAgg({ shopName: intent.b }, bounds),
    ]);
    const rows: CompareRow[] = [
      { label: "Total Sale", a: A.total_sale, b: B.total_sale },
      { label: "Cash Sale", a: A.cash_sale, b: B.cash_sale },
      { label: "POS Sale", a: A.pos_sale, b: B.pos_sale },
      { label: "Bank Sale", a: A.bank_sale, b: B.bank_sale },
      { label: "Credit Sale", a: A.credit_sale, b: B.credit_sale },
      { label: "Purchase", a: A.purchase, b: B.purchase },
      { label: "Expense", a: A.expense, b: B.expense },
      { label: "Withdraw", a: A.withdraw, b: B.withdraw },
    ];
    return finalize(intent, dLabel, rows, "Total Sale");
  }
  if (intent.kind === "cashier") {
    const [A, B] = await Promise.all([
      shopAgg({ cashierName: intent.a }, bounds),
      shopAgg({ cashierName: intent.b }, bounds),
    ]);
    const rows: CompareRow[] = [
      { label: "Total Sale", a: A.total_sale, b: B.total_sale },
      { label: "Cash Sale", a: A.cash_sale, b: B.cash_sale },
      { label: "POS Sale", a: A.pos_sale, b: B.pos_sale },
      { label: "Bank Sale", a: A.bank_sale, b: B.bank_sale },
      { label: "Expense Handled", a: A.expense, b: B.expense },
      { label: "Withdraw Handled", a: A.withdraw, b: B.withdraw },
    ];
    return finalize(intent, dLabel, rows, "Total Sale");
  }
  if (intent.kind === "employee") {
    const [A, B] = await Promise.all([
      employeeAgg(intent.a, bounds), employeeAgg(intent.b, bounds),
    ]);
    const rows: CompareRow[] = [
      { label: "Given", a: A.given, b: B.given },
      { label: "Received", a: A.received, b: B.received },
      { label: "Net", a: A.net, b: B.net },
    ];
    return finalize(intent, dLabel, rows, "Given");
  }
  if (intent.kind === "party") {
    const [A, B] = await Promise.all([
      partyAgg(intent.a, bounds), partyAgg(intent.b, bounds),
    ]);
    const rows: CompareRow[] = [
      { label: "Total Purchase", a: A.total_purchase, b: B.total_purchase },
      { label: "Cash Buy", a: A.cash_buy, b: B.cash_buy },
      { label: "Credit Buy", a: A.credit_buy, b: B.credit_buy },
      { label: "Due Payment", a: A.due_payment, b: B.due_payment },
    ];
    return finalize(intent, dLabel, rows, "Total Purchase");
  }
  // period
  const [bA, bB] = [periodToBounds(intent.a), periodToBounds(intent.b)];
  const [A, B] = await Promise.all([shopAgg({}, bA), shopAgg({}, bB)]);
  const rows: CompareRow[] = [
    { label: "Total Sale", a: A.total_sale, b: B.total_sale },
    { label: "Cash Sale", a: A.cash_sale, b: B.cash_sale },
    { label: "POS Sale", a: A.pos_sale, b: B.pos_sale },
    { label: "Expense", a: A.expense, b: B.expense },
    { label: "Withdraw", a: A.withdraw, b: B.withdraw },
    { label: "Purchase", a: A.purchase, b: B.purchase },
  ];
  return finalize(
    { ...intent, a: titleCase(intent.a), b: titleCase(intent.b) },
    `${bA.from}…${bA.to}  vs  ${bB.from}…${bB.to}`,
    rows, "Total Sale",
  );
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function finalize(intent: CompareIntent, dateLabel: string, rows: CompareRow[], headlineLabel: string): CompareResult {
  const headline = rows.find((r) => r.label === headlineLabel) ?? rows[0];
  const winner: "a" | "b" | "tie" =
    headline.a > headline.b ? "a" : headline.b > headline.a ? "b" : "tie";
  return {
    kind: intent.kind,
    aLabel: intent.a,
    bLabel: intent.b,
    dateLabel,
    rows,
    winner,
    headline,
  };
}
