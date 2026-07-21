import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SAR } from "@/lib/format";
import { useBackClose } from "@/hooks/use-back-close";
import { parseSmartQuery } from "@/lib/smart-query";

type Source = "all" | "shop" | "warehouse" | "employee" | "transaction";
type SourceTable = "shop_entries" | "warehouse_ledger" | "employee_entries" | "company_transactions" | "app_settings" | "parties";

type Hit = {
  key: string;
  source: Exclude<Source, "all">;
  sourceTable: SourceTable;
  sourceRecordId: string;
  recordId: string;
  title: string;
  subtitle?: string;
  amount?: number | null;
  date?: string | null;
  matchedField?: string;
  matchedText?: string;
  similar?: boolean;
  delta?: number;
  raw: any;
};

const LIMIT = 20;

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function esc(q: string) {
  // PostgREST 'or' uses commas; escape commas/parens, then wrap with %
  return q.replace(/[,()]/g, " ").trim();
}

function calendarMonthStart() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function nextMonthStart(month: string) {
  const [yy, mm] = month.split("-").map(Number);
  if (!yy || !mm) return calendarMonthStart();
  const next = new Date(yy, mm, 1);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

function debugMagicSearch(label: string, payload: Record<string, unknown>) {
  if (typeof console !== "undefined") console.debug(`[MagicSearch] ${label}`, payload);
}

function highlight(text: string | null | undefined, q: string) {
  if (!text) return null;
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200/70 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function snippet(text: string | null | undefined, q: string, max = 80) {
  if (!text) return "";
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text.length > max ? text.slice(0, max) + "…" : text;
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + q.length + 40);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

// ── Advanced amount-query parser ────────────────────────────────────────
type AmountQ =
  | { mode: "exact"; value: number }
  | { mode: "gt"; value: number; inclusive: boolean }
  | { mode: "lt"; value: number; inclusive: boolean }
  | { mode: "range"; lo: number; hi: number }
  | null;

function parseAmountQ(text: string): { aq: AmountQ; rest: string } {
  const t = text.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(/^(>=|<=|>|<)\s*([0-9]+(?:\.[0-9]+)?)$/))) {
    const v = Number(m[2]);
    if (m[1] === ">") return { aq: { mode: "gt", value: v, inclusive: false }, rest: "" };
    if (m[1] === ">=") return { aq: { mode: "gt", value: v, inclusive: true }, rest: "" };
    if (m[1] === "<") return { aq: { mode: "lt", value: v, inclusive: false }, rest: "" };
    if (m[1] === "<=") return { aq: { mode: "lt", value: v, inclusive: true }, rest: "" };
  }
  if ((m = t.match(/^([0-9]+(?:\.[0-9]+)?)\s*[-–to]+\s*([0-9]+(?:\.[0-9]+)?)$/i))) {
    const lo = Number(m[1]); const hi = Number(m[2]);
    if (hi >= lo) return { aq: { mode: "range", lo, hi }, rest: "" };
  }
  if (/^[0-9]+(?:\.[0-9]+)?$/.test(t)) return { aq: { mode: "exact", value: Number(t) }, rest: "" };
  // Mixed: "Azzouz 7000" / "7000 Azzouz" / "wifi >500"
  const tokens = t.split(/\s+/);
  const numTok = tokens.find((x) => /^(>=|<=|>|<)?[0-9]+(?:\.[0-9]+)?$/.test(x))
              ?? tokens.find((x) => /^[0-9]+(?:\.[0-9]+)?\s*-\s*[0-9]+(?:\.[0-9]+)?$/.test(x));
  if (numTok) {
    const { aq } = parseAmountQ(numTok);
    if (aq) {
      const rest = tokens.filter((x) => x !== numTok).join(" ").trim();
      return { aq, rest };
    }
  }
  return { aq: null, rest: t };
}

function amountVariants(v: number): number[] {
  const out: number[] = [];
  const seen = new Set<number>([v]);
  const push = (x: number) => { if (x > 0 && Number.isFinite(x) && !seen.has(x)) { seen.add(x); out.push(x); } };
  // Trailing-zero variants
  push(v / 10); push(v * 10); push(v / 100); push(v * 100);
  return out.filter((x) => Number.isInteger(x) || Math.abs(x - Math.round(x)) < 0.001);
}

export function GlobalSearch({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [source, setSource] = useState<Source>("all");
  const [includeClosed, setIncludeClosed] = useState(false);
  const [openMonthStart, setOpenMonthStart] = useState<string | null>(() => calendarMonthStart());
  const [openMonthReady, setOpenMonthReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dq = useDebounced(q.trim(), 250);

  useBackClose(open, onOpenChange);

  // On mobile (Android Chrome/PWA) re-tapping an already-focused input does
  // not always re-open the keyboard. Blur + refocus forces it.
  const forceFocus = () => {
    const el = inputRef.current;
    if (!el) return;
    try { el.blur(); } catch { /* noop */ }
    requestAnimationFrame(() => {
      el.focus({ preventScroll: true } as any);
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch { /* noop */ }
    });
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => forceFocus(), 30);
    } else {
      setQ("");
      setSource("all");
    }
  }, [open]);

  // Default search scope = the current OPEN month (day after the latest
  // closed month). Falls back to the start of the current calendar month.
  useEffect(() => {
    if (!open) return;
    setOpenMonthReady(false);
    (async () => {
      const { data, error } = await supabase
        .from("monthly_closings")
        .select("month")
        .eq("status", "closed")
        .order("month", { ascending: false })
        .limit(1);
      if (error) {
        const fallback = calendarMonthStart();
        setOpenMonthStart(fallback);
        setOpenMonthReady(true);
        debugMagicSearch("open-month-boundary", { status: "fallback", from: fallback, error: error.message });
        return;
      }
      const last = data?.[0]?.month;
      if (last) {
        const from = nextMonthStart(last);
        setOpenMonthStart(from);
        debugMagicSearch("open-month-boundary", { lastClosedMonth: last, from });
      } else {
        const from = calendarMonthStart();
        setOpenMonthStart(from);
        debugMagicSearch("open-month-boundary", { lastClosedMonth: null, from });
      }
      setOpenMonthReady(true);
    })();
  }, [open]);

  const openFullWorkspace = (query?: string) => {
    onOpenChange(false);
    const trimmed = (query ?? q).trim();
    navigate({ to: "/ai-insights", search: (trimmed ? { q: trimmed } : {}) as any });
  };

  // Entity names — fetched once per session, used to enrich the parser + suggestions.
  const { data: entities = { parties: [], cashiers: [], employees: [], shops: [] as Array<{id:string;name:string}> } } = useQuery<{
    parties: string[]; cashiers: string[]; employees: string[]; shops: Array<{id:string;name:string}>;
  }>({
    queryKey: ["magic-search-entities"],
    enabled: open,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const [{ data: pts }, { data: wh }, { data: csh }, { data: emp }, { data: shp }] = await Promise.all([
        supabase.from("parties").select("name").eq("is_deleted", false).limit(200),
        supabase.from("warehouse_ledger").select("party_name").eq("is_deleted", false).not("party_name", "is", null).limit(200),
        supabase.from("cashiers").select("name").eq("is_deleted", false).limit(100),
        supabase.from("employees").select("name").eq("is_deleted", false).limit(200),
        supabase.from("shops").select("id,name").eq("is_deleted", false).limit(50),
      ]);
      const parties = new Set<string>();
      (pts ?? []).forEach((p: any) => p?.name && parties.add(p.name));
      (wh ?? []).forEach((w: any) => w?.party_name && parties.add(w.party_name));
      return {
        parties: Array.from(parties),
        cashiers: (csh ?? []).map((c: any) => c.name).filter(Boolean),
        employees: (emp ?? []).map((e: any) => e.name).filter(Boolean),
        shops: (shp ?? []).map((s: any) => ({ id: s.id, name: s.name })).filter((s) => s.name),
      };
    },
  });

  // Keyboard shortcut: Cmd/Ctrl+K — and listen for global open events.
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    const openEvt = () => onOpenChange(true);
    window.addEventListener("keydown", fn);
    window.addEventListener("lovable:open-ai-copilot", openEvt);
    return () => {
      window.removeEventListener("keydown", fn);
      window.removeEventListener("lovable:open-ai-copilot", openEvt);
    };
  }, [open, onOpenChange]);

  // Smart natural-language parser (today, last week, purchase 5000, etc.)
  const sq = parseSmartQuery(dq);
  // Advanced amount-q parser runs on the *raw* trimmed query so it sees
  // ">", "<", ranges, and "Shop 7000" combos.
  const { aq: amountQ, rest: amountRest } = parseAmountQ(dq);
  // Free text = whatever the smart parser couldn't classify, OR the leftover
  // after stripping the numeric operator (whichever is non-empty).
  const searchText = ((sq.text || "").trim() || amountRest.trim()).trim();
  const hasText = searchText.length > 0 && !/^[0-9]+(\.[0-9]+)?$/.test(searchText);
  const numVal = amountQ?.mode === "exact" ? amountQ.value
    : (sq.amount != null ? sq.amount : (/^[0-9]+(\.[0-9]+)?$/.test(dq) ? Number(dq) : null));
  const isNumeric = amountQ != null;

  // Detect "Azzouz 7000" — shop name (or partial) inside the free-text portion.
  const matchedShop = (() => {
    const haystack = (searchText || dq).toLowerCase();
    if (!haystack) return null;
    return entities.shops.find((s) => {
      const n = s.name.toLowerCase();
      return n.length >= 3 && new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack);
    }) ?? null;
  })();

  // Effective lower-bound date — open-month-start unless "Include Closed Months" is on.
  const effectiveFrom = (!includeClosed && openMonthStart)
    ? (sq.dateFrom && sq.dateFrom > openMonthStart ? sq.dateFrom : openMonthStart)
    : sq.dateFrom ?? null;

  // Build PostgREST 'or' filter fragments for amount-Q (exact / range / gt / lt).
  function numFilters(field: string): string[] {
    if (!amountQ) return [];
    switch (amountQ.mode) {
      case "exact": return [`${field}.eq.${amountQ.value}`];
      case "gt":    return [`and(${field}.gt.0,${field}.${amountQ.inclusive ? "gte" : "gt"}.${amountQ.value})`];
      case "lt":    return [`and(${field}.gt.0,${field}.${amountQ.inclusive ? "lte" : "lt"}.${amountQ.value})`];
      case "range": return [`and(${field}.gte.${amountQ.lo},${field}.lte.${amountQ.hi})`];
    }
  }
  const amountMatches = (v: number): boolean => {
    if (!amountQ || !(v > 0)) return false;
    switch (amountQ.mode) {
      case "exact": return v === amountQ.value;
      case "gt":    return amountQ.inclusive ? v >= amountQ.value : v > amountQ.value;
      case "lt":    return amountQ.inclusive ? v <= amountQ.value : v < amountQ.value;
      case "range": return v >= amountQ.lo && v <= amountQ.hi;
    }
  };


  const enabled = open && dq.length >= 1 && (includeClosed || openMonthReady);

  const { data: results = [], isFetching } = useQuery<Hit[]>({
    enabled,
    queryKey: ["global-search", dq, source, effectiveFrom, sq.dateTo, sq.types.join(","), sq.amount ?? "", includeClosed],
    queryFn: async () => {
      const like = `%${esc(searchText || dq)}%`;
      const tasks: Promise<Hit[]>[] = [];
      debugMagicSearch("query", {
        query: dq,
        source,
        includeClosed,
        openMonthStart,
        effectiveFrom,
        dateTo: sq.dateTo,
        amount: numVal,
        text: hasText ? searchText : null,
      });

      // Helper builders — refine by parsed entry types
      const typeSet = new Set(sq.types);
      // "Azzouz 7000" — scope strictly to the shop module.
      const shopOnly = !!matchedShop;
      const wantShop = (source === "all" || source === "shop") &&
        (typeSet.size === 0 || typeSet.has("sale") || typeSet.has("purchase") || typeSet.has("withdraw") || typeSet.has("expense"));
      const wantWh = !shopOnly && (source === "all" || source === "warehouse") &&
        (typeSet.size === 0 || typeSet.has("warehouse") || typeSet.has("purchase") || typeSet.has("sale"));
      const wantEmp = !shopOnly && (source === "all" || source === "employee") &&
        (typeSet.size === 0 || typeSet.has("employee"));
      const wantTxn = !shopOnly && (source === "all" || source === "transaction") &&
        (typeSet.size === 0);

      const shopTypes = ["sale", "purchase", "withdraw", "expense"].filter((t) => typeSet.has(t as any));
      const applyDate = <T extends { gte: any; lte: any }>(qb: T): T => {
        if (sq.dateFrom) (qb as any).gte("txn_date", sq.dateFrom);
        if (sq.dateTo) (qb as any).lte("txn_date", sq.dateTo);
        return qb;
      };
      void applyDate;

      // Shop entries: notes + amount fields
      if (wantShop) tasks.push((async () => {
        const filters: string[] = [];
        // When shop is matched, the shop name itself is the filter — don't
        // search for it inside notes (would match nothing).
        const shopNoteText = matchedShop
          ? (searchText || "").replace(new RegExp(matchedShop.name, "ig"), "").trim()
          : searchText;
        const hasShopNoteText = shopNoteText.length > 0 && !/^[0-9]+(\.[0-9]+)?$/.test(shopNoteText);
        if (hasShopNoteText) filters.push(`notes.ilike.%${esc(shopNoteText)}%`);
        for (const f of ["cash_sale", "pos_sale", "bank_sale", "credit_sale", "purchase_amount", "withdraw_amount", "expense_amount"]) {
          filters.push(...numFilters(f));
        }
        let qb: any = supabase.from("shop_entries")
          .select("id, entry_type, notes, txn_date, created_at, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)")
          .eq("is_deleted", false);
        if (matchedShop) qb = qb.eq("shop_id", matchedShop.id);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (shopTypes.length) qb = qb.in("entry_type", shopTypes);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r: any) => {
          const labels: Record<string, string> = { sale: "Sale", purchase: "Purchase", withdraw: "Withdraw", expense: "Expense" };
          let matchedField: string | undefined;
          let amount = 0;
          const fieldMap: Record<string, string> = {
            cash_sale: "Cash Sale", pos_sale: "POS Sale", bank_sale: "Bank Sale", credit_sale: "Credit Sale",
            purchase_amount: "Purchase", withdraw_amount: "Withdraw", expense_amount: "Expense",
          };
          if (isNumeric && numVal != null) {
            for (const [k, lbl] of Object.entries(fieldMap)) {
              const v = Number(r[k] ?? 0);
              if (amountMatches(v)) {
                matchedField = lbl; amount = v; break;
              }
            }
          }
          if (!amount) {
            amount =
              r.entry_type === "sale" ? Number(r.cash_sale ?? 0) + Number(r.pos_sale ?? 0) + Number(r.bank_sale ?? 0) + Number(r.credit_sale ?? 0)
              : r.entry_type === "purchase" ? Number(r.purchase_amount ?? 0)
              : r.entry_type === "withdraw" ? Number(r.withdraw_amount ?? 0)
              : r.entry_type === "expense" ? Number(r.expense_amount ?? 0)
              : 0;
          }
          if (!matchedField && hasText && r.notes && r.notes.toLowerCase().includes(searchText.toLowerCase())) matchedField = "Note";
          return {
            key: `s-${r.id}`, source: "shop" as const, sourceTable: "shop_entries" as const, sourceRecordId: r.id, recordId: r.id,
            title: `Shop ${labels[r.entry_type] ?? r.entry_type}`,
            subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
            amount, date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? (r.notes ?? undefined) : undefined,
            raw: r,
          };
        });
      })());

      // Warehouse ledger
      if (wantWh) tasks.push((async () => {
        const filters: string[] = [];
        if (hasText) filters.push(`notes.ilike.${like}`, `party_name.ilike.${like}`);
        for (const f of ["amount", "paid_amount", "remaining_due"]) {
          filters.push(...numFilters(f));
        }
        let qb: any = supabase.from("warehouse_ledger")
          .select("id, entry_type, notes, txn_date, amount, party_name, paid_amount, remaining_due")
          .eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r: any) => {
          const labels: Record<string, string> = {
            warehouse_sale: "Sale", warehouse_purchase: "Purchase",
            payment_received: "Payment Received", supplier_payment: "Supplier Payment",
          };
          const matchParty = hasText && r.party_name?.toLowerCase().includes(searchText.toLowerCase());
          const matchNote = hasText && r.notes?.toLowerCase().includes(searchText.toLowerCase());
          let matchedField: string | undefined;
          let matchedText: string | undefined;
          if (isNumeric && numVal != null) {
            for (const [k, lbl] of [["amount", "Amount"], ["paid_amount", "Paid"], ["remaining_due", "Remaining Due"]] as const) {
              const v = Number(r[k] ?? 0);
              if (amountMatches(v)) { matchedField = lbl; break; }
            }
          }
          if (!matchedField) {
            matchedField = matchNote ? "Note" : matchParty ? "Party" : undefined;
            matchedText = matchNote ? r.notes : matchParty ? r.party_name : undefined;
          }
          return {
            key: `w-${r.id}`, source: "warehouse" as const, sourceTable: "warehouse_ledger" as const, sourceRecordId: r.id, recordId: r.id,
            title: `Warehouse ${labels[r.entry_type] ?? r.entry_type}`,
            subtitle: r.party_name ?? undefined,
            amount: Number(r.amount ?? 0), date: r.txn_date,
            matchedField, matchedText,
            raw: r,
          };
        });
      })());

      // Employee entries (+ join name)
      if (wantEmp) tasks.push((async () => {
        const empIds: string[] = hasText ? (await supabase.from("employees")
          .select("id, name").eq("is_deleted", false).ilike("name", like).limit(20))
          .data?.map((e: any) => e.id) ?? [] : [];

        const filters: string[] = [];
        if (hasText) filters.push(`notes.ilike.${like}`);
        filters.push(...numFilters("amount"));
        if (empIds.length) filters.push(`employee_id.in.(${empIds.join(",")})`);

        let qb: any = supabase.from("employee_entries")
          .select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)" as any)
          .eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);

        return (data ?? []).map((r: any) => {
          let matchedField: string | undefined;
          if (isNumeric && numVal != null) {
            const v = Number(r.amount ?? 0);
            if (amountMatches(v)) matchedField = "Amount";
          }
          if (!matchedField && hasText) {
            matchedField = r.notes?.toLowerCase().includes(searchText.toLowerCase()) ? "Note"
              : r.employees?.name?.toLowerCase().includes(searchText.toLowerCase()) ? "Employee" : undefined;
          }
          return {
            key: `e-${r.id}`, source: "employee" as const, sourceTable: "employee_entries" as const, sourceRecordId: r.id, recordId: r.id,
            title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
            subtitle: r.employees?.name ?? undefined,
            amount: Number(r.amount ?? 0), date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? (r.notes ?? undefined) : undefined,
            raw: r,
          };
        });
      })());

      // Company transactions only. The generic transactions ledger mirrors shop,
      // employee, and warehouse source records, so searching it here duplicates
      // results and navigates to the wrong module.
      if (wantTxn) tasks.push((async () => {
        const filters: string[] = [];
        if (hasText) filters.push(`notes.ilike.${like}`, `category.ilike.${like}`);
        filters.push(...numFilters("amount"));
        let qb: any = supabase.from("company_transactions")
          .select("id, txn_date, txn_type, category, amount, notes")
          .eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r: any) => {
          let matchedField: string | undefined;
          if (isNumeric && numVal != null) {
            const v = Number(r.amount ?? 0);
            if (amountMatches(v)) matchedField = "Amount";
          }
          if (!matchedField && hasText && r.notes?.toLowerCase().includes(searchText.toLowerCase())) matchedField = "Note";
          return {
            key: `c-${r.id}`, source: "transaction" as const, sourceTable: "company_transactions" as const, sourceRecordId: r.id, recordId: r.id,
            title: r.txn_type === "income" ? "Company Income" : "Company Expense",
            subtitle: r.category ?? undefined,
            amount: Number(r.amount ?? 0), date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? (r.notes ?? undefined) : undefined,
            raw: r,
          };
        });
      })());

      // Opening balances (app_settings + parties) — surfaced for numeric searches
      if (includeClosed && isNumeric && numVal != null && (source === "all" || source === "warehouse")) tasks.push((async () => {
        const hits: Hit[] = [];
        const matches = (v: number) =>
          amountMatches(v);

        const { data: settings } = await supabase.from("app_settings").select("*").eq("id", 1).single();
        if (settings) {
          const settingFields: Array<[string, string]> = [
            ["opening_due_receivable", "Opening Due"],
            ["opening_supplier_payable", "Opening Supplier Payable"],
            ["opening_warehouse_balance", "Opening Warehouse Balance"],
            ["opening_stock_value", "Opening Stock"],
            ["opening_cash_received", "Opening Cash"],
            ["opening_bank_balance", "Opening Bank"],
            ["opening_company_balance", "Opening Company"],
          ];
          for (const [k, lbl] of settingFields) {
            const v = Number((settings as any)[k] ?? 0);
            if (matches(v)) {
              hits.push({
                key: `o-${k}`, source: "warehouse", sourceTable: "app_settings", sourceRecordId: "1", recordId: "settings",
                title: lbl, subtitle: "Opening setup",
                amount: v, date: null,
                matchedField: lbl, matchedText: undefined,
                raw: { _opening: true, field: k },
              });
            }
          }
        }

        const { data: pts } = await supabase.from("parties")
          .select("id, name, opening_due, opening_advance, opening_payable")
          .eq("is_deleted", false).limit(200);
        for (const p of (pts ?? []) as any[]) {
          const fields: Array<[string, string]> = [
            ["opening_due", "Party Opening Due"],
            ["opening_advance", "Party Advance"],
            ["opening_payable", "Party Opening Payable"],
          ];
          for (const [k, lbl] of fields) {
            const v = Number(p[k] ?? 0);
            if (matches(v)) {
              hits.push({
                key: `op-${p.id}-${k}`, source: "warehouse", sourceTable: "parties", sourceRecordId: p.id, recordId: p.id,
                title: lbl, subtitle: p.name,
                amount: v, date: null,
                matchedField: lbl, matchedText: undefined,
                raw: { _opening: true, partyId: p.id, field: k },
              });
            }
          }
        }
        return hits;
      })());

      const rawHits = (await Promise.all(tasks)).flat();
      const seen = new Set<string>();
      const duplicateKeys: string[] = [];
      let all = rawHits.filter((h) => {
        const dedupeKey = `${h.sourceTable}:${h.sourceRecordId}:${h.matchedField ?? ""}`;
        if (seen.has(dedupeKey)) {
          duplicateKeys.push(dedupeKey);
          return false;
        }
        seen.add(dedupeKey);
        return true;
      });
      debugMagicSearch("matches", {
        query: dq,
        rawCount: rawHits.length,
        uniqueCount: all.length,
        duplicateKeys,
      });

      // ── Smart amount correction (trailing-zero variants) ────────────────
      // 70000 → try 7000 / 700 etc. when the original returned nothing.
      if (amountQ?.mode === "exact" && numVal != null && !hasText && all.length === 0) {
        const variants = amountVariants(numVal);
        for (const v of variants) {
          const orFor = (fields: string[]) => fields.map((f) => `${f}.eq.${v}`).join(",");
          const variantTasks: Promise<Hit[]>[] = [];
          if (wantShop) variantTasks.push((async () => {
            const fieldMap: Record<string, string> = {
              cash_sale: "Cash Sale", pos_sale: "POS Sale", bank_sale: "Bank Sale", credit_sale: "Credit Sale",
              purchase_amount: "Purchase", withdraw_amount: "Withdraw", expense_amount: "Expense",
            };
            let qb: any = supabase.from("shop_entries")
              .select("id, entry_type, notes, txn_date, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)")
              .eq("is_deleted", false);
            if (matchedShop) qb = qb.eq("shop_id", matchedShop.id);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            qb = qb.or(orFor(Object.keys(fieldMap)));
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r: any): Hit | null => {
              const k = Object.keys(fieldMap).find((kk) => Number(r[kk] ?? 0) === v);
              if (!k) return null;
              return {
                key: `s-var-${r.id}-${k}`, source: "shop", sourceTable: "shop_entries",
                sourceRecordId: r.id, recordId: r.id,
                title: `Shop ${fieldMap[k]}`,
                subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
                amount: v, date: r.txn_date,
                matchedField: fieldMap[k], similar: true, delta: Math.abs(v - numVal), raw: r,
              };
            }).filter(Boolean) as Hit[];
          })());
          if (wantWh) variantTasks.push((async () => {
            let qb: any = supabase.from("warehouse_ledger")
              .select("id, entry_type, notes, txn_date, amount, party_name")
              .eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r: any): Hit => ({
              key: `w-var-${r.id}`, source: "warehouse", sourceTable: "warehouse_ledger",
              sourceRecordId: r.id, recordId: r.id,
              title: `Warehouse ${r.entry_type}`,
              subtitle: r.party_name ?? undefined,
              amount: v, date: r.txn_date,
              similar: true, delta: Math.abs(v - numVal), raw: r,
            }));
          })());
          if (wantEmp) variantTasks.push((async () => {
            let qb: any = supabase.from("employee_entries")
              .select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)" as any)
              .eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r: any): Hit => ({
              key: `e-var-${r.id}`, source: "employee", sourceTable: "employee_entries",
              sourceRecordId: r.id, recordId: r.id,
              title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
              subtitle: r.employees?.name ?? undefined,
              amount: v, date: r.txn_date,
              similar: true, delta: Math.abs(v - numVal), raw: r,
            }));
          })());
          if (wantTxn) variantTasks.push((async () => {
            let qb: any = supabase.from("company_transactions")
              .select("id, txn_date, txn_type, category, amount, notes")
              .eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r: any): Hit => ({
              key: `c-var-${r.id}`, source: "transaction", sourceTable: "company_transactions",
              sourceRecordId: r.id, recordId: r.id,
              title: r.txn_type === "income" ? "Company Income" : "Company Expense",
              subtitle: r.category ?? undefined,
              amount: v, date: r.txn_date,
              similar: true, delta: Math.abs(v - numVal), raw: r,
            }));
          })());
          const variantHits = (await Promise.all(variantTasks)).flat();
          if (variantHits.length) {
            const seenV = new Set<string>();
            all = variantHits.filter((h) => {
              const k = `${h.sourceTable}:${h.sourceRecordId}:${h.matchedField ?? ""}`;
              if (seenV.has(k)) return false;
              seenV.add(k);
              return true;
            });
            debugMagicSearch("smart-correction", { target: numVal, variant: v, count: all.length });
            break;
          }
        }
      }

      // ── Similar-amount fallback ─────────────────────────────────────────
      // Only run when user searched a pure exact amount, no exact match was found,
      // and the search is amount-only (no text). Range = ±20%.
      if (amountQ?.mode === "exact" && numVal != null && !hasText && all.length === 0) {
        const lo = +(numVal * 0.8).toFixed(2);
        const hi = +(numVal * 1.2).toFixed(2);
        const SIM_LIMIT = 30;
        const rangeOr = (fields: string[]) =>
          fields.map((f) => `and(${f}.gte.${lo},${f}.lte.${hi})`).join(",");
        const closest = (vals: Array<[string, number]>): [string, number, number] | null => {
          let best: [string, number, number] | null = null;
          for (const [k, v] of vals) {
            if (!(v > 0)) continue;
            if (v < lo || v > hi) continue;
            const d = Math.abs(v - numVal);
            if (!best || d < best[2]) best = [k, v, d];
          }
          return best;
        };
        const simTasks: Promise<Hit[]>[] = [];

        if (wantShop) simTasks.push((async () => {
          const fieldMap: Record<string, string> = {
            cash_sale: "Cash Sale", pos_sale: "POS Sale", bank_sale: "Bank Sale", credit_sale: "Credit Sale",
            purchase_amount: "Purchase", withdraw_amount: "Withdraw", expense_amount: "Expense",
          };
          let qb: any = supabase.from("shop_entries")
            .select("id, entry_type, notes, txn_date, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)")
            .eq("is_deleted", false);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          qb = qb.or(rangeOr(Object.keys(fieldMap)));
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r: any) => {
            const best = closest(Object.keys(fieldMap).map((k) => [k, Number(r[k] ?? 0)]));
            if (!best) return null;
            const [k, amt, d] = best;
            return {
              key: `s-sim-${r.id}-${k}`, source: "shop" as const, sourceTable: "shop_entries" as const,
              sourceRecordId: r.id, recordId: r.id,
              title: `Shop ${fieldMap[k]}`,
              subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
              amount: amt, date: r.txn_date,
              matchedField: fieldMap[k], similar: true, delta: d, raw: r,
            } as Hit;
          }).filter(Boolean) as Hit[];
        })());

        if (wantWh) simTasks.push((async () => {
          let qb: any = supabase.from("warehouse_ledger")
            .select("id, entry_type, notes, txn_date, amount, party_name, paid_amount, remaining_due")
            .eq("is_deleted", false);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          qb = qb.or(rangeOr(["amount", "paid_amount", "remaining_due"]));
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          const labels: Record<string, string> = {
            warehouse_sale: "Sale", warehouse_purchase: "Purchase",
            payment_received: "Payment Received", supplier_payment: "Supplier Payment",
          };
          return (data ?? []).map((r: any) => {
            const best = closest([["amount", Number(r.amount ?? 0)], ["paid_amount", Number(r.paid_amount ?? 0)], ["remaining_due", Number(r.remaining_due ?? 0)]]);
            if (!best) return null;
            const [, amt, d] = best;
            return {
              key: `w-sim-${r.id}`, source: "warehouse" as const, sourceTable: "warehouse_ledger" as const,
              sourceRecordId: r.id, recordId: r.id,
              title: `Warehouse ${labels[r.entry_type] ?? r.entry_type}`,
              subtitle: r.party_name ?? undefined,
              amount: amt, date: r.txn_date,
              similar: true, delta: d, raw: r,
            } as Hit;
          }).filter(Boolean) as Hit[];
        })());

        if (wantEmp) simTasks.push((async () => {
          let qb: any = supabase.from("employee_entries")
            .select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)" as any)
            .eq("is_deleted", false)
            .gte("amount", lo).lte("amount", hi);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r: any) => {
            const amt = Number(r.amount ?? 0);
            return {
              key: `e-sim-${r.id}`, source: "employee" as const, sourceTable: "employee_entries" as const,
              sourceRecordId: r.id, recordId: r.id,
              title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
              subtitle: r.employees?.name ?? undefined,
              amount: amt, date: r.txn_date,
              similar: true, delta: Math.abs(amt - numVal), raw: r,
            } as Hit;
          });
        })());

        if (wantTxn) simTasks.push((async () => {
          let qb: any = supabase.from("company_transactions")
            .select("id, txn_date, txn_type, category, amount, notes")
            .eq("is_deleted", false)
            .gte("amount", lo).lte("amount", hi);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r: any) => {
            const amt = Number(r.amount ?? 0);
            return {
              key: `c-sim-${r.id}`, source: "transaction" as const, sourceTable: "company_transactions" as const,
              sourceRecordId: r.id, recordId: r.id,
              title: r.txn_type === "income" ? "Company Income" : "Company Expense",
              subtitle: r.category ?? undefined,
              amount: amt, date: r.txn_date,
              similar: true, delta: Math.abs(amt - numVal), raw: r,
            } as Hit;
          });
        })());

        const simHits = (await Promise.all(simTasks)).flat();
        const simSeen = new Set<string>();
        const dedupedSim = simHits.filter((h) => {
          const k = `${h.sourceTable}:${h.sourceRecordId}`;
          if (simSeen.has(k)) return false;
          simSeen.add(k);
          return true;
        });
        dedupedSim.sort((a, b) => (a.delta ?? 0) - (b.delta ?? 0));
        all = dedupedSim.slice(0, 20);
        debugMagicSearch("similar-fallback", { target: numVal, lo, hi, count: all.length });
      } else {
        // Sort exact pass: numeric exact first, then date desc
        all.sort((a, b) => {
          if (isNumeric && numVal != null) {
            const ax = a.amount === numVal ? 0 : 1;
            const bx = b.amount === numVal ? 0 : 1;
            if (ax !== bx) return ax - bx;
          }
          if (a.date && b.date) return a.date < b.date ? 1 : -1;
          if (a.date) return -1;
          if (b.date) return 1;
          return 0;
        });
      }
      return all;
    },
    staleTime: 30_000,
  });


  const handleClick = (h: Hit) => {
    if ((h.raw as any)?._opening) {
      onOpenChange(false);
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/settings",
      });
      navigate({ to: "/settings" });
      return;
    }
    onOpenChange(false);
    // Navigate to the actual source module with ?highlight=<id>. The target
    // page wires useHighlightRecord() which auto-scrolls + flashes the row.
    if (h.source === "employee") {
      const empId = (h.raw as any).employee_id;
      if (empId) {
        debugMagicSearch("navigate", {
          searchResultId: h.key,
          sourceTable: h.sourceTable,
          sourceRecordId: h.sourceRecordId,
          target: `/employees/${empId}?highlight=${h.recordId}`,
        });
        navigate({ to: "/employees/$employeeId", params: { employeeId: empId }, search: { highlight: h.recordId } as any });
      } else {
        debugMagicSearch("navigate", {
          searchResultId: h.key,
          sourceTable: h.sourceTable,
          sourceRecordId: h.sourceRecordId,
          target: `/employees?highlight=${h.recordId}`,
        });
        navigate({ to: "/employees", search: { highlight: h.recordId } as any });
      }
      return;
    }
    if (h.source === "shop") {
      const shopId = (h.raw as any).shop_id ?? undefined;
      const search = { highlight: h.recordId, date: h.date ?? undefined, shop: shopId } as any;
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/shop",
        search,
      });
      navigate({ to: "/shop", search });
      return;
    }
    if (h.source === "warehouse") {
      const search = { tab: "cash-flow", highlight: h.recordId, date: h.date ?? undefined, shop: (h.raw as any).shop_id ?? "__wh__" } as any;
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/finance-workflow",
        search,
      });
      navigate({ to: "/finance-workflow", search });
      return;
    }
    // transaction
    const search = { highlight: h.recordId, date: h.date ?? undefined } as any;
    debugMagicSearch("navigate", {
      searchResultId: h.key,
      sourceTable: h.sourceTable,
      sourceRecordId: h.sourceRecordId,
      target: "/company-transactions",
      search,
    });
    navigate({ to: "/company-transactions", search });
  };


  const chips: { v: Source; label: string }[] = [
    { v: "all", label: "All" },
    { v: "shop", label: "Shop" },
    { v: "warehouse", label: "Warehouse" },
    { v: "employee", label: "Employee" },
    { v: "transaction", label: "Transaction" },
  ];

  const showEmptyState = !enabled;

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-0 top-[calc(var(--mobile-topbar-height)+0.35rem)] z-50 mx-2 md:left-1/2 md:top-5 md:mx-0 md:w-[calc(100vw-1rem)] md:max-w-xl md:-translate-x-1/2"
          role="dialog"
          aria-label="Search"
        >
          <div className="rounded-2xl border border-border/50 bg-background shadow-md">
            {/* Search bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); }}
              className="flex items-center gap-2 px-3 py-2"
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground/70" />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onClick={forceFocus}
                onTouchEnd={(e) => {
                  if (document.activeElement === inputRef.current) e.preventDefault();
                  forceFocus();
                }}
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Search records…  e.g. 7000, wifi, salary"
                style={{
                  color: "#111827",
                  caretColor: "#111827",
                  WebkitTextFillColor: "#111827",
                  opacity: 1,
                  backgroundColor: "#ffffff",
                  fontSize: "15px",
                  lineHeight: "20px",
                  textIndent: 0,
                  position: "relative",
                  zIndex: 1,
                }}
                className="magic-search-input block min-w-0 flex-1 outline-none placeholder:text-[#9CA3AF]"
              />
              {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/60" />}
              <button
                type="button"
                onClick={() => (q ? setQ("") : onOpenChange(false))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-muted/60 hover:text-foreground/80"
                aria-label={q ? "Clear" : "Close"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Results */}
            {enabled && (
              <div className="border-t border-border/30">
                {results.length === 0 && !isFetching ? (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground/70">No matching records found</p>
                ) : (
                  <ul className="max-h-[70vh] divide-y divide-border/30 overflow-y-auto">
                    {results.map((h) => (
                      <li key={h.key}>
                        <button
                          onClick={() => handleClick(h)}
                          className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-muted/40 active:bg-muted/60"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[12px] font-medium text-foreground/80">{h.title}</span>
                              {h.amount != null && h.amount > 0 && (
                                <span className="shrink-0 text-[13px] font-semibold tabular-nums">{SAR(h.amount)}</span>
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-muted-foreground/70">
                              {h.date ? new Date(h.date + "T00:00:00").toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "2-digit" }) : "—"}
                              {h.subtitle ? ` · ${h.subtitle}` : ""}
                              {h.matchedText ? ` · ${snippet(h.matchedText, dq, 40)}` : ""}
                            </p>
                            {h.similar && (
                              <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-amber-800">
                                Similar Match
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


// Trigger button for header
export function GlobalSearchTrigger({
  onClick, className,
}: { onClick: () => void; className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("h-10 w-10", className)}
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </Button>
  );
}
