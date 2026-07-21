import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { aQ as useBackClose, af as SAR } from "./router-KeVl8_Ln.mjs";
import { p as parseSmartQuery } from "./smart-query-D0_hbLNl.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { y as Search, k as LoaderCircle, X } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
const LIMIT = 20;
function useDebounced(value, ms) {
  const [v, setV] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
function esc(q) {
  return q.replace(/[,()]/g, " ").trim();
}
function calendarMonthStart() {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}
function nextMonthStart(month) {
  const [yy, mm] = month.split("-").map(Number);
  if (!yy || !mm) return calendarMonthStart();
  const next = new Date(yy, mm, 1);
  const y = next.getFullYear();
  const m = String(next.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}
function debugMagicSearch(label, payload) {
  if (typeof console !== "undefined") console.debug(`[MagicSearch] ${label}`, payload);
}
function snippet(text, q, max = 80) {
  if (!text) return "";
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text.length > max ? text.slice(0, max) + "…" : text;
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + q.length + 40);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}
function parseAmountQ(text) {
  const t = text.trim();
  let m;
  if (m = t.match(/^(>=|<=|>|<)\s*([0-9]+(?:\.[0-9]+)?)$/)) {
    const v = Number(m[2]);
    if (m[1] === ">") return { aq: { mode: "gt", value: v, inclusive: false }, rest: "" };
    if (m[1] === ">=") return { aq: { mode: "gt", value: v, inclusive: true }, rest: "" };
    if (m[1] === "<") return { aq: { mode: "lt", value: v, inclusive: false }, rest: "" };
    if (m[1] === "<=") return { aq: { mode: "lt", value: v, inclusive: true }, rest: "" };
  }
  if (m = t.match(/^([0-9]+(?:\.[0-9]+)?)\s*[-–to]+\s*([0-9]+(?:\.[0-9]+)?)$/i)) {
    const lo = Number(m[1]);
    const hi = Number(m[2]);
    if (hi >= lo) return { aq: { mode: "range", lo, hi }, rest: "" };
  }
  if (/^[0-9]+(?:\.[0-9]+)?$/.test(t)) return { aq: { mode: "exact", value: Number(t) }, rest: "" };
  const tokens = t.split(/\s+/);
  const numTok = tokens.find((x) => /^(>=|<=|>|<)?[0-9]+(?:\.[0-9]+)?$/.test(x)) ?? tokens.find((x) => /^[0-9]+(?:\.[0-9]+)?\s*-\s*[0-9]+(?:\.[0-9]+)?$/.test(x));
  if (numTok) {
    const { aq } = parseAmountQ(numTok);
    if (aq) {
      const rest = tokens.filter((x) => x !== numTok).join(" ").trim();
      return { aq, rest };
    }
  }
  return { aq: null, rest: t };
}
function amountVariants(v) {
  const out = [];
  const seen = /* @__PURE__ */ new Set([v]);
  const push = (x) => {
    if (x > 0 && Number.isFinite(x) && !seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  };
  push(v / 10);
  push(v * 10);
  push(v / 100);
  push(v * 100);
  return out.filter((x) => Number.isInteger(x) || Math.abs(x - Math.round(x)) < 1e-3);
}
function GlobalSearch({
  open,
  onOpenChange
}) {
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [source, setSource] = reactExports.useState("all");
  const [includeClosed, setIncludeClosed] = reactExports.useState(false);
  const [openMonthStart, setOpenMonthStart] = reactExports.useState(() => calendarMonthStart());
  const [openMonthReady, setOpenMonthReady] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const dq = useDebounced(q.trim(), 250);
  useBackClose(open, onOpenChange);
  const forceFocus = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.blur();
    } catch {
    }
    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      try {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      } catch {
      }
    });
  };
  reactExports.useEffect(() => {
    if (open) {
      setTimeout(() => forceFocus(), 30);
    } else {
      setQ("");
      setSource("all");
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (!open) return;
    setOpenMonthReady(false);
    (async () => {
      const { data, error } = await supabase.from("monthly_closings").select("month").eq("status", "closed").order("month", { ascending: false }).limit(1);
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
  const { data: entities = { parties: [], cashiers: [], employees: [], shops: [] } } = useQuery({
    queryKey: ["magic-search-entities"],
    enabled: open,
    staleTime: 5 * 6e4,
    queryFn: async () => {
      const [{ data: pts }, { data: wh }, { data: csh }, { data: emp }, { data: shp }] = await Promise.all([
        supabase.from("parties").select("name").eq("is_deleted", false).limit(200),
        supabase.from("warehouse_ledger").select("party_name").eq("is_deleted", false).not("party_name", "is", null).limit(200),
        supabase.from("cashiers").select("name").eq("is_deleted", false).limit(100),
        supabase.from("employees").select("name").eq("is_deleted", false).limit(200),
        supabase.from("shops").select("id,name").eq("is_deleted", false).limit(50)
      ]);
      const parties = /* @__PURE__ */ new Set();
      (pts ?? []).forEach((p) => p?.name && parties.add(p.name));
      (wh ?? []).forEach((w) => w?.party_name && parties.add(w.party_name));
      return {
        parties: Array.from(parties),
        cashiers: (csh ?? []).map((c) => c.name).filter(Boolean),
        employees: (emp ?? []).map((e) => e.name).filter(Boolean),
        shops: (shp ?? []).map((s) => ({ id: s.id, name: s.name })).filter((s) => s.name)
      };
    }
  });
  reactExports.useEffect(() => {
    const fn = (e) => {
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
  const sq = parseSmartQuery(dq);
  const { aq: amountQ, rest: amountRest } = parseAmountQ(dq);
  const searchText = ((sq.text || "").trim() || amountRest.trim()).trim();
  const hasText = searchText.length > 0 && !/^[0-9]+(\.[0-9]+)?$/.test(searchText);
  const numVal = amountQ?.mode === "exact" ? amountQ.value : sq.amount != null ? sq.amount : /^[0-9]+(\.[0-9]+)?$/.test(dq) ? Number(dq) : null;
  const isNumeric = amountQ != null;
  const matchedShop = (() => {
    const haystack = (searchText || dq).toLowerCase();
    if (!haystack) return null;
    return entities.shops.find((s) => {
      const n = s.name.toLowerCase();
      return n.length >= 3 && new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack);
    }) ?? null;
  })();
  const effectiveFrom = !includeClosed && openMonthStart ? sq.dateFrom && sq.dateFrom > openMonthStart ? sq.dateFrom : openMonthStart : sq.dateFrom ?? null;
  function numFilters(field) {
    if (!amountQ) return [];
    switch (amountQ.mode) {
      case "exact":
        return [`${field}.eq.${amountQ.value}`];
      case "gt":
        return [`and(${field}.gt.0,${field}.${amountQ.inclusive ? "gte" : "gt"}.${amountQ.value})`];
      case "lt":
        return [`and(${field}.gt.0,${field}.${amountQ.inclusive ? "lte" : "lt"}.${amountQ.value})`];
      case "range":
        return [`and(${field}.gte.${amountQ.lo},${field}.lte.${amountQ.hi})`];
    }
  }
  const amountMatches = (v) => {
    if (!amountQ || !(v > 0)) return false;
    switch (amountQ.mode) {
      case "exact":
        return v === amountQ.value;
      case "gt":
        return amountQ.inclusive ? v >= amountQ.value : v > amountQ.value;
      case "lt":
        return amountQ.inclusive ? v <= amountQ.value : v < amountQ.value;
      case "range":
        return v >= amountQ.lo && v <= amountQ.hi;
    }
  };
  const enabled = open && dq.length >= 1 && (includeClosed || openMonthReady);
  const { data: results = [], isFetching } = useQuery({
    enabled,
    queryKey: ["global-search", dq, source, effectiveFrom, sq.dateTo, sq.types.join(","), sq.amount ?? "", includeClosed],
    queryFn: async () => {
      const like = `%${esc(searchText || dq)}%`;
      const tasks = [];
      debugMagicSearch("query", {
        query: dq,
        source,
        includeClosed,
        openMonthStart,
        effectiveFrom,
        dateTo: sq.dateTo,
        amount: numVal,
        text: hasText ? searchText : null
      });
      const typeSet = new Set(sq.types);
      const shopOnly = !!matchedShop;
      const wantShop = (source === "all" || source === "shop") && (typeSet.size === 0 || typeSet.has("sale") || typeSet.has("purchase") || typeSet.has("withdraw") || typeSet.has("expense"));
      const wantWh = !shopOnly && (source === "all" || source === "warehouse") && (typeSet.size === 0 || typeSet.has("warehouse") || typeSet.has("purchase") || typeSet.has("sale"));
      const wantEmp = !shopOnly && (source === "all" || source === "employee") && (typeSet.size === 0 || typeSet.has("employee"));
      const wantTxn = !shopOnly && (source === "all" || source === "transaction") && typeSet.size === 0;
      const shopTypes = ["sale", "purchase", "withdraw", "expense"].filter((t) => typeSet.has(t));
      if (wantShop) tasks.push((async () => {
        const filters = [];
        const shopNoteText = matchedShop ? (searchText || "").replace(new RegExp(matchedShop.name, "ig"), "").trim() : searchText;
        const hasShopNoteText = shopNoteText.length > 0 && !/^[0-9]+(\.[0-9]+)?$/.test(shopNoteText);
        if (hasShopNoteText) filters.push(`notes.ilike.%${esc(shopNoteText)}%`);
        for (const f of ["cash_sale", "pos_sale", "bank_sale", "credit_sale", "purchase_amount", "withdraw_amount", "expense_amount"]) {
          filters.push(...numFilters(f));
        }
        let qb = supabase.from("shop_entries").select("id, entry_type, notes, txn_date, created_at, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)").eq("is_deleted", false);
        if (matchedShop) qb = qb.eq("shop_id", matchedShop.id);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (shopTypes.length) qb = qb.in("entry_type", shopTypes);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r) => {
          const labels = { sale: "Sale", purchase: "Purchase", withdraw: "Withdraw", expense: "Expense" };
          let matchedField;
          let amount = 0;
          const fieldMap = {
            cash_sale: "Cash Sale",
            pos_sale: "POS Sale",
            bank_sale: "Bank Sale",
            credit_sale: "Credit Sale",
            purchase_amount: "Purchase",
            withdraw_amount: "Withdraw",
            expense_amount: "Expense"
          };
          if (isNumeric && numVal != null) {
            for (const [k, lbl] of Object.entries(fieldMap)) {
              const v = Number(r[k] ?? 0);
              if (amountMatches(v)) {
                matchedField = lbl;
                amount = v;
                break;
              }
            }
          }
          if (!amount) {
            amount = r.entry_type === "sale" ? Number(r.cash_sale ?? 0) + Number(r.pos_sale ?? 0) + Number(r.bank_sale ?? 0) + Number(r.credit_sale ?? 0) : r.entry_type === "purchase" ? Number(r.purchase_amount ?? 0) : r.entry_type === "withdraw" ? Number(r.withdraw_amount ?? 0) : r.entry_type === "expense" ? Number(r.expense_amount ?? 0) : 0;
          }
          if (!matchedField && hasText && r.notes && r.notes.toLowerCase().includes(searchText.toLowerCase())) matchedField = "Note";
          return {
            key: `s-${r.id}`,
            source: "shop",
            sourceTable: "shop_entries",
            sourceRecordId: r.id,
            recordId: r.id,
            title: `Shop ${labels[r.entry_type] ?? r.entry_type}`,
            subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
            amount,
            date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? r.notes ?? void 0 : void 0,
            raw: r
          };
        });
      })());
      if (wantWh) tasks.push((async () => {
        const filters = [];
        if (hasText) filters.push(`notes.ilike.${like}`, `party_name.ilike.${like}`);
        for (const f of ["amount", "paid_amount", "remaining_due"]) {
          filters.push(...numFilters(f));
        }
        let qb = supabase.from("warehouse_ledger").select("id, entry_type, notes, txn_date, amount, party_name, paid_amount, remaining_due").eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r) => {
          const labels = {
            warehouse_sale: "Sale",
            warehouse_purchase: "Purchase",
            payment_received: "Payment Received",
            supplier_payment: "Supplier Payment"
          };
          const matchParty = hasText && r.party_name?.toLowerCase().includes(searchText.toLowerCase());
          const matchNote = hasText && r.notes?.toLowerCase().includes(searchText.toLowerCase());
          let matchedField;
          let matchedText;
          if (isNumeric && numVal != null) {
            for (const [k, lbl] of [["amount", "Amount"], ["paid_amount", "Paid"], ["remaining_due", "Remaining Due"]]) {
              const v = Number(r[k] ?? 0);
              if (amountMatches(v)) {
                matchedField = lbl;
                break;
              }
            }
          }
          if (!matchedField) {
            matchedField = matchNote ? "Note" : matchParty ? "Party" : void 0;
            matchedText = matchNote ? r.notes : matchParty ? r.party_name : void 0;
          }
          return {
            key: `w-${r.id}`,
            source: "warehouse",
            sourceTable: "warehouse_ledger",
            sourceRecordId: r.id,
            recordId: r.id,
            title: `Warehouse ${labels[r.entry_type] ?? r.entry_type}`,
            subtitle: r.party_name ?? void 0,
            amount: Number(r.amount ?? 0),
            date: r.txn_date,
            matchedField,
            matchedText,
            raw: r
          };
        });
      })());
      if (wantEmp) tasks.push((async () => {
        const empIds = hasText ? (await supabase.from("employees").select("id, name").eq("is_deleted", false).ilike("name", like).limit(20)).data?.map((e) => e.id) ?? [] : [];
        const filters = [];
        if (hasText) filters.push(`notes.ilike.${like}`);
        filters.push(...numFilters("amount"));
        if (empIds.length) filters.push(`employee_id.in.(${empIds.join(",")})`);
        let qb = supabase.from("employee_entries").select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)").eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r) => {
          let matchedField;
          if (isNumeric && numVal != null) {
            const v = Number(r.amount ?? 0);
            if (amountMatches(v)) matchedField = "Amount";
          }
          if (!matchedField && hasText) {
            matchedField = r.notes?.toLowerCase().includes(searchText.toLowerCase()) ? "Note" : r.employees?.name?.toLowerCase().includes(searchText.toLowerCase()) ? "Employee" : void 0;
          }
          return {
            key: `e-${r.id}`,
            source: "employee",
            sourceTable: "employee_entries",
            sourceRecordId: r.id,
            recordId: r.id,
            title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
            subtitle: r.employees?.name ?? void 0,
            amount: Number(r.amount ?? 0),
            date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? r.notes ?? void 0 : void 0,
            raw: r
          };
        });
      })());
      if (wantTxn) tasks.push((async () => {
        const filters = [];
        if (hasText) filters.push(`notes.ilike.${like}`, `category.ilike.${like}`);
        filters.push(...numFilters("amount"));
        let qb = supabase.from("company_transactions").select("id, txn_date, txn_type, category, amount, notes").eq("is_deleted", false);
        if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
        if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
        if (filters.length) qb = qb.or(filters.join(","));
        const { data } = await qb.order("txn_date", { ascending: false }).limit(LIMIT);
        return (data ?? []).map((r) => {
          let matchedField;
          if (isNumeric && numVal != null) {
            const v = Number(r.amount ?? 0);
            if (amountMatches(v)) matchedField = "Amount";
          }
          if (!matchedField && hasText && r.notes?.toLowerCase().includes(searchText.toLowerCase())) matchedField = "Note";
          return {
            key: `c-${r.id}`,
            source: "transaction",
            sourceTable: "company_transactions",
            sourceRecordId: r.id,
            recordId: r.id,
            title: r.txn_type === "income" ? "Company Income" : "Company Expense",
            subtitle: r.category ?? void 0,
            amount: Number(r.amount ?? 0),
            date: r.txn_date,
            matchedField,
            matchedText: matchedField === "Note" ? r.notes ?? void 0 : void 0,
            raw: r
          };
        });
      })());
      if (includeClosed && isNumeric && numVal != null && (source === "all" || source === "warehouse")) tasks.push((async () => {
        const hits = [];
        const matches = (v) => amountMatches(v);
        const { data: settings } = await supabase.from("app_settings").select("*").eq("id", 1).single();
        if (settings) {
          const settingFields = [
            ["opening_due_receivable", "Opening Due"],
            ["opening_supplier_payable", "Opening Supplier Payable"],
            ["opening_warehouse_balance", "Opening Warehouse Balance"],
            ["opening_stock_value", "Opening Stock"],
            ["opening_cash_received", "Opening Cash"],
            ["opening_bank_balance", "Opening Bank"],
            ["opening_company_balance", "Opening Company"]
          ];
          for (const [k, lbl] of settingFields) {
            const v = Number(settings[k] ?? 0);
            if (matches(v)) {
              hits.push({
                key: `o-${k}`,
                source: "warehouse",
                sourceTable: "app_settings",
                sourceRecordId: "1",
                recordId: "settings",
                title: lbl,
                subtitle: "Opening setup",
                amount: v,
                date: null,
                matchedField: lbl,
                matchedText: void 0,
                raw: { _opening: true, field: k }
              });
            }
          }
        }
        const { data: pts } = await supabase.from("parties").select("id, name, opening_due, opening_advance, opening_payable").eq("is_deleted", false).limit(200);
        for (const p of pts ?? []) {
          const fields = [
            ["opening_due", "Party Opening Due"],
            ["opening_advance", "Party Advance"],
            ["opening_payable", "Party Opening Payable"]
          ];
          for (const [k, lbl] of fields) {
            const v = Number(p[k] ?? 0);
            if (matches(v)) {
              hits.push({
                key: `op-${p.id}-${k}`,
                source: "warehouse",
                sourceTable: "parties",
                sourceRecordId: p.id,
                recordId: p.id,
                title: lbl,
                subtitle: p.name,
                amount: v,
                date: null,
                matchedField: lbl,
                matchedText: void 0,
                raw: { _opening: true, partyId: p.id, field: k }
              });
            }
          }
        }
        return hits;
      })());
      const rawHits = (await Promise.all(tasks)).flat();
      const seen = /* @__PURE__ */ new Set();
      const duplicateKeys = [];
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
        duplicateKeys
      });
      if (amountQ?.mode === "exact" && numVal != null && !hasText && all.length === 0) {
        const variants = amountVariants(numVal);
        for (const v of variants) {
          const orFor = (fields) => fields.map((f) => `${f}.eq.${v}`).join(",");
          const variantTasks = [];
          if (wantShop) variantTasks.push((async () => {
            const fieldMap = {
              cash_sale: "Cash Sale",
              pos_sale: "POS Sale",
              bank_sale: "Bank Sale",
              credit_sale: "Credit Sale",
              purchase_amount: "Purchase",
              withdraw_amount: "Withdraw",
              expense_amount: "Expense"
            };
            let qb = supabase.from("shop_entries").select("id, entry_type, notes, txn_date, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)").eq("is_deleted", false);
            if (matchedShop) qb = qb.eq("shop_id", matchedShop.id);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            qb = qb.or(orFor(Object.keys(fieldMap)));
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r) => {
              const k = Object.keys(fieldMap).find((kk) => Number(r[kk] ?? 0) === v);
              if (!k) return null;
              return {
                key: `s-var-${r.id}-${k}`,
                source: "shop",
                sourceTable: "shop_entries",
                sourceRecordId: r.id,
                recordId: r.id,
                title: `Shop ${fieldMap[k]}`,
                subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
                amount: v,
                date: r.txn_date,
                matchedField: fieldMap[k],
                similar: true,
                delta: Math.abs(v - numVal),
                raw: r
              };
            }).filter(Boolean);
          })());
          if (wantWh) variantTasks.push((async () => {
            let qb = supabase.from("warehouse_ledger").select("id, entry_type, notes, txn_date, amount, party_name").eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r) => ({
              key: `w-var-${r.id}`,
              source: "warehouse",
              sourceTable: "warehouse_ledger",
              sourceRecordId: r.id,
              recordId: r.id,
              title: `Warehouse ${r.entry_type}`,
              subtitle: r.party_name ?? void 0,
              amount: v,
              date: r.txn_date,
              similar: true,
              delta: Math.abs(v - numVal),
              raw: r
            }));
          })());
          if (wantEmp) variantTasks.push((async () => {
            let qb = supabase.from("employee_entries").select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)").eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r) => ({
              key: `e-var-${r.id}`,
              source: "employee",
              sourceTable: "employee_entries",
              sourceRecordId: r.id,
              recordId: r.id,
              title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
              subtitle: r.employees?.name ?? void 0,
              amount: v,
              date: r.txn_date,
              similar: true,
              delta: Math.abs(v - numVal),
              raw: r
            }));
          })());
          if (wantTxn) variantTasks.push((async () => {
            let qb = supabase.from("company_transactions").select("id, txn_date, txn_type, category, amount, notes").eq("is_deleted", false).eq("amount", v);
            if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
            if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
            const { data } = await qb.order("txn_date", { ascending: false }).limit(20);
            return (data ?? []).map((r) => ({
              key: `c-var-${r.id}`,
              source: "transaction",
              sourceTable: "company_transactions",
              sourceRecordId: r.id,
              recordId: r.id,
              title: r.txn_type === "income" ? "Company Income" : "Company Expense",
              subtitle: r.category ?? void 0,
              amount: v,
              date: r.txn_date,
              similar: true,
              delta: Math.abs(v - numVal),
              raw: r
            }));
          })());
          const variantHits = (await Promise.all(variantTasks)).flat();
          if (variantHits.length) {
            const seenV = /* @__PURE__ */ new Set();
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
      if (amountQ?.mode === "exact" && numVal != null && !hasText && all.length === 0) {
        const lo = +(numVal * 0.8).toFixed(2);
        const hi = +(numVal * 1.2).toFixed(2);
        const SIM_LIMIT = 30;
        const rangeOr = (fields) => fields.map((f) => `and(${f}.gte.${lo},${f}.lte.${hi})`).join(",");
        const closest = (vals) => {
          let best = null;
          for (const [k, v] of vals) {
            if (!(v > 0)) continue;
            if (v < lo || v > hi) continue;
            const d = Math.abs(v - numVal);
            if (!best || d < best[2]) best = [k, v, d];
          }
          return best;
        };
        const simTasks = [];
        if (wantShop) simTasks.push((async () => {
          const fieldMap = {
            cash_sale: "Cash Sale",
            pos_sale: "POS Sale",
            bank_sale: "Bank Sale",
            credit_sale: "Credit Sale",
            purchase_amount: "Purchase",
            withdraw_amount: "Withdraw",
            expense_amount: "Expense"
          };
          let qb = supabase.from("shop_entries").select("id, entry_type, notes, txn_date, cash_sale, pos_sale, bank_sale, credit_sale, purchase_amount, withdraw_amount, expense_amount, shop_id, cashier_id, shops(name), cashiers(name)").eq("is_deleted", false);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          qb = qb.or(rangeOr(Object.keys(fieldMap)));
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r) => {
            const best = closest(Object.keys(fieldMap).map((k2) => [k2, Number(r[k2] ?? 0)]));
            if (!best) return null;
            const [k, amt, d] = best;
            return {
              key: `s-sim-${r.id}-${k}`,
              source: "shop",
              sourceTable: "shop_entries",
              sourceRecordId: r.id,
              recordId: r.id,
              title: `Shop ${fieldMap[k]}`,
              subtitle: [r.shops?.name, r.cashiers?.name].filter(Boolean).join(" · "),
              amount: amt,
              date: r.txn_date,
              matchedField: fieldMap[k],
              similar: true,
              delta: d,
              raw: r
            };
          }).filter(Boolean);
        })());
        if (wantWh) simTasks.push((async () => {
          let qb = supabase.from("warehouse_ledger").select("id, entry_type, notes, txn_date, amount, party_name, paid_amount, remaining_due").eq("is_deleted", false);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          qb = qb.or(rangeOr(["amount", "paid_amount", "remaining_due"]));
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          const labels = {
            warehouse_sale: "Sale",
            warehouse_purchase: "Purchase",
            payment_received: "Payment Received",
            supplier_payment: "Supplier Payment"
          };
          return (data ?? []).map((r) => {
            const best = closest([["amount", Number(r.amount ?? 0)], ["paid_amount", Number(r.paid_amount ?? 0)], ["remaining_due", Number(r.remaining_due ?? 0)]]);
            if (!best) return null;
            const [, amt, d] = best;
            return {
              key: `w-sim-${r.id}`,
              source: "warehouse",
              sourceTable: "warehouse_ledger",
              sourceRecordId: r.id,
              recordId: r.id,
              title: `Warehouse ${labels[r.entry_type] ?? r.entry_type}`,
              subtitle: r.party_name ?? void 0,
              amount: amt,
              date: r.txn_date,
              similar: true,
              delta: d,
              raw: r
            };
          }).filter(Boolean);
        })());
        if (wantEmp) simTasks.push((async () => {
          let qb = supabase.from("employee_entries").select("id, entry_type, amount, notes, txn_date, employee_id, employees:employee_id(name)").eq("is_deleted", false).gte("amount", lo).lte("amount", hi);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r) => {
            const amt = Number(r.amount ?? 0);
            return {
              key: `e-sim-${r.id}`,
              source: "employee",
              sourceTable: "employee_entries",
              sourceRecordId: r.id,
              recordId: r.id,
              title: r.entry_type === "given" ? "Employee Given" : "Employee Received",
              subtitle: r.employees?.name ?? void 0,
              amount: amt,
              date: r.txn_date,
              similar: true,
              delta: Math.abs(amt - numVal),
              raw: r
            };
          });
        })());
        if (wantTxn) simTasks.push((async () => {
          let qb = supabase.from("company_transactions").select("id, txn_date, txn_type, category, amount, notes").eq("is_deleted", false).gte("amount", lo).lte("amount", hi);
          if (effectiveFrom) qb = qb.gte("txn_date", effectiveFrom);
          if (sq.dateTo) qb = qb.lte("txn_date", sq.dateTo);
          const { data } = await qb.order("txn_date", { ascending: false }).limit(SIM_LIMIT);
          return (data ?? []).map((r) => {
            const amt = Number(r.amount ?? 0);
            return {
              key: `c-sim-${r.id}`,
              source: "transaction",
              sourceTable: "company_transactions",
              sourceRecordId: r.id,
              recordId: r.id,
              title: r.txn_type === "income" ? "Company Income" : "Company Expense",
              subtitle: r.category ?? void 0,
              amount: amt,
              date: r.txn_date,
              similar: true,
              delta: Math.abs(amt - numVal),
              raw: r
            };
          });
        })());
        const simHits = (await Promise.all(simTasks)).flat();
        const simSeen = /* @__PURE__ */ new Set();
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
    staleTime: 3e4
  });
  const handleClick = (h) => {
    if (h.raw?._opening) {
      onOpenChange(false);
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/settings"
      });
      navigate({ to: "/settings" });
      return;
    }
    onOpenChange(false);
    if (h.source === "employee") {
      const empId = h.raw.employee_id;
      if (empId) {
        debugMagicSearch("navigate", {
          searchResultId: h.key,
          sourceTable: h.sourceTable,
          sourceRecordId: h.sourceRecordId,
          target: `/employees/${empId}?highlight=${h.recordId}`
        });
        navigate({ to: "/employees/$employeeId", params: { employeeId: empId }, search: { highlight: h.recordId } });
      } else {
        debugMagicSearch("navigate", {
          searchResultId: h.key,
          sourceTable: h.sourceTable,
          sourceRecordId: h.sourceRecordId,
          target: `/employees?highlight=${h.recordId}`
        });
        navigate({ to: "/employees", search: { highlight: h.recordId } });
      }
      return;
    }
    if (h.source === "shop") {
      const shopId = h.raw.shop_id ?? void 0;
      const search2 = { highlight: h.recordId, date: h.date ?? void 0, shop: shopId };
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/shop",
        search: search2
      });
      navigate({ to: "/shop", search: search2 });
      return;
    }
    if (h.source === "warehouse") {
      const search2 = { tab: "cash-flow", highlight: h.recordId, date: h.date ?? void 0, shop: h.raw.shop_id ?? "__wh__" };
      debugMagicSearch("navigate", {
        searchResultId: h.key,
        sourceTable: h.sourceTable,
        sourceRecordId: h.sourceRecordId,
        target: "/finance-workflow",
        search: search2
      });
      navigate({ to: "/finance-workflow", search: search2 });
      return;
    }
    const search = { highlight: h.recordId, date: h.date ?? void 0 };
    debugMagicSearch("navigate", {
      searchResultId: h.key,
      sourceTable: h.sourceTable,
      sourceRecordId: h.sourceRecordId,
      target: "/company-transactions",
      search
    });
    navigate({ to: "/company-transactions", search });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-x-0 top-[calc(var(--mobile-topbar-height)+0.35rem)] z-50 mx-2 md:left-1/2 md:top-5 md:mx-0 md:w-[calc(100vw-1rem)] md:max-w-xl md:-translate-x-1/2",
      role: "dialog",
      "aria-label": "Search",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-background shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
            },
            className: "flex items-center gap-2 px-3 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground/70" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  value: q,
                  onChange: (e) => setQ(e.target.value),
                  onClick: forceFocus,
                  onTouchEnd: (e) => {
                    if (document.activeElement === inputRef.current) e.preventDefault();
                    forceFocus();
                  },
                  inputMode: "search",
                  enterKeyHint: "search",
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: false,
                  placeholder: "Search records…  e.g. 7000, wifi, salary",
                  style: {
                    color: "#111827",
                    caretColor: "#111827",
                    WebkitTextFillColor: "#111827",
                    opacity: 1,
                    backgroundColor: "#ffffff",
                    fontSize: "15px",
                    lineHeight: "20px",
                    textIndent: 0,
                    position: "relative",
                    zIndex: 1
                  },
                  className: "magic-search-input block min-w-0 flex-1 outline-none placeholder:text-[#9CA3AF]"
                }
              ),
              isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => q ? setQ("") : onOpenChange(false),
                  className: "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 hover:bg-muted/60 hover:text-foreground/80",
                  "aria-label": q ? "Clear" : "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          }
        ),
        enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30", children: results.length === 0 && !isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-6 text-center text-xs text-muted-foreground/70", children: "No matching records found" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-[70vh] divide-y divide-border/30 overflow-y-auto", children: results.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleClick(h),
            className: "flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-muted/40 active:bg-muted/60",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[12px] font-medium text-foreground/80", children: h.title }),
                h.amount != null && h.amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[13px] font-semibold tabular-nums", children: SAR(h.amount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 truncate text-[11px] text-muted-foreground/70", children: [
                h.date ? (/* @__PURE__ */ new Date(h.date + "T00:00:00")).toLocaleDateString(void 0, { day: "2-digit", month: "short", year: "2-digit" }) : "—",
                h.subtitle ? ` · ${h.subtitle}` : "",
                h.matchedText ? ` · ${snippet(h.matchedText, dq, 40)}` : ""
              ] }),
              h.similar && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-amber-800", children: "Similar Match" })
            ] })
          }
        ) }, h.key)) }) })
      ] })
    }
  ) });
}
export {
  GlobalSearch
};
