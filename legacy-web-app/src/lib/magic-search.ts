// Magic Search — cross-ERP lightweight search engine.
// Looks up exact / fuzzy amounts, free-text notes, and date ranges across
// every transactional table. Pure client-side using existing indexes.

import { supabase } from "@/integrations/supabase/client";

export type MagicHit = {
  id: string;
  rawId: string;        // the underlying DB row id (used for scroll-to-highlight)
  module: string;       // e.g. "Shop · Azzouz"
  refType: string;      // e.g. "Cash Sale", "Expense", "Purchase"
  reference: string;    // party / shop / employee name
  note: string;
  amount: number;
  date: string;         // YYYY-MM-DD
  delta?: number;       // |amount - target|
  link?: string;        // route to open (without query)
  highlightId?: string; // value to put in ?highlight=
};

export type MagicSearchInput = {
  amount: number | null;
  text: string | null;
  dateFrom: string | null;
  dateTo: string | null;
};

export type MagicSearchResult = {
  exact: MagicHit[];
  nearby: MagicHit[];
  total: number;
};

const PER_TABLE_LIMIT = 200;
const MAX_RETURN = 60;

function withinAmount(amt: number, target: number | null): { include: boolean; delta: number } {
  if (target == null) return { include: true, delta: 0 };
  const delta = Math.abs(amt - target);
  const tolerance = Math.max(50, target * 0.15);
  return { include: delta <= tolerance, delta };
}

function escapeLike(s: string) {
  return s.replace(/[%_]/g, (m) => `\\${m}`);
}

export async function runMagicSearch(input: MagicSearchInput): Promise<MagicSearchResult> {
  if (input.amount == null && !input.text && !input.dateFrom) {
    return { exact: [], nearby: [], total: 0 };
  }

  const textLike = input.text ? `%${escapeLike(input.text)}%` : null;
  const hits: MagicHit[] = [];

  // Resolve shop / employee name maps in parallel with main queries.
  const [shopRes, empRes] = await Promise.all([
    supabase.from("shops").select("id,name"),
    supabase.from("employees").select("id,name"),
  ]);
  const shopMap = new Map<string, string>((shopRes.data ?? []).map((s: any) => [s.id, s.name]));
  const empMap = new Map<string, string>((empRes.data ?? []).map((e: any) => [e.id, e.name]));

  const queries: Promise<void>[] = [];

  // --- shop_entries -------------------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("shop_entries")
      .select("id,txn_date,shop_id,entry_type,pos_sale,cash_sale,bank_sale,credit_sale,purchase_amount,withdraw_amount,expense_amount,notes")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.ilike("notes", textLike);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const shop = (r.shop_id && shopMap.get(r.shop_id)) || "Shop";
      const cols: Array<[string, number]> = [
        ["POS Sale", Number(r.pos_sale)],
        ["Cash Sale", Number(r.cash_sale)],
        ["Bank Sale", Number(r.bank_sale)],
        ["Credit Sale", Number(r.credit_sale)],
        ["Purchase", Number(r.purchase_amount)],
        ["Withdraw", Number(r.withdraw_amount)],
        ["Expense", Number(r.expense_amount)],
      ];
      for (const [label, amt] of cols) {
        if (!amt) continue;
        const m = withinAmount(amt, input.amount);
        if (!m.include) continue;
        hits.push({
          id: `${r.id}-${label}`,
          rawId: r.id,
          module: `Shop · ${shop}`,
          refType: label,
          reference: shop,
          note: r.notes ?? "",
          amount: amt,
          date: r.txn_date,
          delta: m.delta,
          link: `/shop?highlight=${r.id}`,
          highlightId: r.id,
        });
      }
    }
  })());

  // --- company_transactions ----------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("company_transactions")
      .select("id,txn_date,txn_type,category,amount,notes")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},category.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Company",
        refType: `${r.txn_type ?? ""} · ${r.category ?? ""}`.trim(),
        reference: r.category ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/company-transactions?highlight=${r.id}`,
        highlightId: r.id,
      });
    }
  })());

  // --- employee_entries --------------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("employee_entries")
      .select("id,txn_date,employee_id,entry_type,amount,notes")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.ilike("notes", textLike);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      const name = (r.employee_id && empMap.get(r.employee_id)) || "Employee";
      hits.push({
        id: r.id,
        rawId: r.id,
        module: `Employee · ${name}`,
        refType: r.entry_type === "given" ? "Given" : "Received",
        reference: name,
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: r.employee_id
          ? `/employees/${r.employee_id}?highlight=${r.id}`
          : `/employees?highlight=${r.id}`,
        highlightId: r.id,
      });
    }
  })());

  // --- cash_flow_purchases -----------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("cash_flow_purchases")
      .select("id,day_date,shop_id,company,cash_amount,due_amount,credit_amount,notes")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("day_date", input.dateFrom);
    if (input.dateTo) q = q.lte("day_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},company.ilike.${textLike}`);
    q = q.order("day_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const shop = (r.shop_id && shopMap.get(r.shop_id)) || "Shop";
      const cols: Array<[string, number]> = [
        ["Cash Buy", Number(r.cash_amount)],
        ["Due Buy", Number(r.due_amount)],
        ["Credit Buy", Number(r.credit_amount)],
      ];
      for (const [label, amt] of cols) {
        if (!amt) continue;
        const m = withinAmount(amt, input.amount);
        if (!m.include) continue;
        hits.push({
          id: `${r.id}-${label}`,
          rawId: r.id,
          module: `Cash Flow · ${shop}`,
          refType: label,
          reference: r.company ?? "",
          note: r.notes ?? "",
          amount: amt,
          date: r.day_date,
          delta: m.delta,
          link: `/cash-flow?highlight=${r.id}`,
          highlightId: r.id,
        });
      }
    }
  })());

  // --- warehouse_ledger --------------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("warehouse_ledger")
      .select("id,txn_date,party_name,entry_type,payment_status,amount,paid_amount,remaining_due,notes")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},party_name.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Wholesale",
        refType: `${r.entry_type} · ${r.payment_status}`,
        reference: r.party_name ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/cash-flow?highlight=${r.id}`,
        highlightId: r.id,
      });
    }
  })());

  // --- transactions ------------------------------------------------------
  queries.push((async () => {
    let q = supabase
      .from("transactions")
      .select("id,txn_date,type,amount,notes,category,payment_method")
      .eq("is_deleted", false);
    if (input.dateFrom) q = q.gte("txn_date", input.dateFrom);
    if (input.dateTo) q = q.lte("txn_date", input.dateTo);
    if (textLike) q = q.or(`notes.ilike.${textLike},category.ilike.${textLike}`);
    q = q.order("txn_date", { ascending: false }).limit(PER_TABLE_LIMIT);
    const { data } = await q;
    for (const r of data ?? []) {
      const amt = Number(r.amount);
      const m = withinAmount(amt, input.amount);
      if (!m.include) continue;
      hits.push({
        id: r.id,
        rawId: r.id,
        module: "Transactions",
        refType: `${r.type} · ${r.payment_method ?? ""}`.trim(),
        reference: r.category ?? "",
        note: r.notes ?? "",
        amount: amt,
        date: r.txn_date,
        delta: m.delta,
        link: `/summary?highlight=${r.id}`,
        highlightId: r.id,
      });
    }
  })());

  await Promise.all(queries);

  // Rank: exact amount first, then closest, then most recent.
  const sorted = hits.sort((a, b) => {
    const da = a.delta ?? 0;
    const db = b.delta ?? 0;
    if (da !== db) return da - db;
    return b.date.localeCompare(a.date);
  });

  const exact = input.amount != null
    ? sorted.filter((h) => (h.delta ?? 0) === 0)
    : sorted.filter((h) => true);
  const nearby = input.amount != null
    ? sorted.filter((h) => (h.delta ?? 0) > 0)
    : [];

  return {
    exact: exact.slice(0, MAX_RETURN),
    nearby: nearby.slice(0, MAX_RETURN),
    total: sorted.length,
  };
}
