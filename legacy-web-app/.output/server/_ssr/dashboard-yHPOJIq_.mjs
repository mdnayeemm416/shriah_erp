import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { d as cn, P as Popover, p as PopoverTrigger, q as PopoverContent, L as Label, I as Input, C as Card } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { S as ShopDrilldownSheet } from "./shop-drilldown-sheet-C3mMqF9g.mjs";
import { u as useShopPositions } from "./use-shop-positions-B07f-IJE.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { aT as CalendarDays, W as Wallet, bl as Landmark, ax as TrendingDown, v as Package, aa as Store, ac as FileChartColumnIncreasing, aA as Info, aQ as ArrowRight } from "../_libs/lucide-react.mjs";

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
import "./soft-delete-DQY0d6eC.mjs";
import "./attachment-lightbox-DWyyAMyd.mjs";
import "./whatsapp-share-Bc5049Za.mjs";
function getRange(key, custom) {
  const today = /* @__PURE__ */ new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  if (key === "today") return {
    from: iso(today),
    to: iso(today),
    label: "Today"
  };
  if (key === "week") {
    const day = today.getDay() || 7;
    const start = new Date(today);
    start.setDate(today.getDate() - (day - 1));
    return {
      from: iso(start),
      to: iso(today),
      label: "This Week"
    };
  }
  if (key === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: iso(start),
      to: iso(today),
      label: "This Month"
    };
  }
  if (key === "custom") return {
    from: custom.from || null,
    to: custom.to || null,
    label: "Custom"
  };
  return {
    from: null,
    to: null,
    label: "All Time"
  };
}
function Dashboard() {
  const [rangeKey, setRangeKey] = reactExports.useState("month");
  const [custom, setCustom] = reactExports.useState({
    from: "",
    to: ""
  });
  const [drill, setDrill] = reactExports.useState(null);
  const range = getRange(rangeKey, custom);
  const DASH_CACHE = {
    staleTime: 5 * 6e4,
    gcTime: 10 * 6e4,
    refetchInterval: 5 * 6e4,
    refetchOnWindowFocus: false
  };
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["txns"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("transactions").select("*").eq("is_deleted", false).order("created_at", {
        ascending: false
      });
      return data ?? [];
    },
    ...DASH_CACHE
  });
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return (await import("./router-KeVl8_Ln.mjs").then((n) => n.b2)).sortShops(data ?? []);
    },
    ...DASH_CACHE
  });
  const {
    data: settings
  } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*").eq("id", 1).single()).data,
    ...DASH_CACHE
  });
  const {
    data: shopEntries = []
  } = useQuery({
    queryKey: ["shop_entries", "all"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? [],
    ...DASH_CACHE
  });
  const {
    data: whLedger = []
  } = useQuery({
    queryKey: ["wh_ledger"],
    queryFn: async () => (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false)).data ?? [],
    ...DASH_CACHE
  });
  const {
    data: parties = []
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await supabase.from("parties").select("*").eq("is_deleted", false)).data ?? [],
    ...DASH_CACHE
  });
  const {
    byId: masterPositions
  } = useShopPositions(range);
  const inRange = (d) => {
    if (range.from && d < range.from) return false;
    if (range.to && d > range.to) return false;
    return true;
  };
  const txnsR = reactExports.useMemo(() => txns.filter((t) => inRange(t.txn_date)), [txns, range.from, range.to]);
  const shopEntriesR = reactExports.useMemo(() => shopEntries.filter((e) => inRange(e.txn_date)), [shopEntries, range.from, range.to]);
  reactExports.useMemo(() => whLedger.filter((e) => inRange(e.txn_date)), [whLedger, range.from, range.to]);
  const totalOpening = shops.reduce((s, x) => s + Number(x.opening_cash || 0), 0);
  const sumByType = (t) => txnsR.filter((x) => x.type === t).reduce((s, x) => s + Number(x.amount), 0);
  const cashIn = sumByType("cash_in");
  const cashOut = sumByType("cash_out");
  const bankWithdraw = sumByType("bank_withdraw");
  const purchases = sumByType("purchase");
  const expensesShop = txnsR.filter((x) => x.type === "expense" && x.shop_id).reduce((s, x) => s + Number(x.amount), 0);
  const expensesManual = txnsR.filter((x) => x.type === "expense" && !x.shop_id || x.type === "supervisor_payment" || x.type === "cash_out").reduce((s, x) => s + Number(x.amount), 0);
  const expenses = sumByType("expense") + sumByType("supervisor_payment");
  const adjustments = sumByType("adjustment");
  const shopBankSales = shopEntriesR.filter((e) => e.entry_type === "sale").reduce((s, e) => s + Number(e.bank_sale || 0), 0);
  const shopCashSales = txnsR.filter((t) => t.type === "cash_in" && t.payment_method === "cash" && t.shop_id).reduce((s, t) => s + Number(t.amount), 0);
  const warehouseCashSales = txnsR.filter((t) => t.type === "cash_in" && !t.shop_id).reduce((s, t) => s + Number(t.amount), 0);
  const includeOpening = rangeKey === "all";
  const openingCashUsed = includeOpening ? totalOpening : 0;
  const cashInHand = openingCashUsed + cashIn + bankWithdraw - cashOut - purchases - expenses + adjustments;
  const openingBank = includeOpening ? Number(settings?.opening_bank_balance ?? 0) : 0;
  const bankBalance = openingBank + shopBankSales - bankWithdraw;
  const totalExpense = cashOut + purchases + expenses;
  const openingStock = Number(settings?.opening_stock_value ?? 0);
  const openingDue = Number(settings?.opening_due_receivable ?? 0);
  const partyOpeningDue = parties.reduce((s, p) => s + Number(p.opening_due || 0), 0);
  const partyOpeningAdvance = parties.reduce((s, p) => s + Number(p.opening_advance || 0), 0);
  let whPurchases = 0;
  let whSales = 0;
  let whDueDelta = 0;
  for (const e of whLedger) {
    const amt = Number(e.amount) || 0;
    const due = Number(e.remaining_due) || 0;
    if (e.entry_type === "warehouse_purchase") whPurchases += amt;
    else if (e.entry_type === "warehouse_sale") {
      whSales += amt;
      if (e.payment_status === "credit") whDueDelta += amt;
      else if (e.payment_status === "partial") whDueDelta += due;
    } else if (e.entry_type === "payment_received") {
      whDueDelta -= amt;
    }
  }
  const dueReceivable = Math.max(0, openingDue + partyOpeningDue + whDueDelta - partyOpeningAdvance);
  const warehouseValue = openingStock + dueReceivable + whPurchases - whSales;
  const erpShopSummaries = reactExports.useMemo(() => {
    return shops.filter((s) => s.shop_type !== "simple_cash").map((s) => {
      const shopTxns = txnsR.filter((t) => t.shop_id === s.id);
      const cashSale = shopTxns.filter((t) => t.type === "cash_in" && t.payment_method === "cash").reduce((sum, t) => sum + Number(t.amount), 0);
      const bankWith = shopTxns.filter((t) => t.type === "bank_withdraw").reduce((sum, t) => sum + Number(t.amount), 0);
      const purch = shopTxns.filter((t) => t.type === "purchase").reduce((sum, t) => sum + Number(t.amount), 0);
      const expense = shopEntriesR.filter((e) => e.shop_id === s.id && e.entry_type === "expense").reduce((sum, e) => sum + Number(e.expense_amount || 0), 0);
      const totalCash = cashSale + bankWith;
      const totalCost = purch + expense;
      return {
        id: s.id,
        name: s.name,
        cashSale,
        bankWithdraw: bankWith,
        purchase: purch,
        expense,
        totalCash,
        totalCost,
        // Cash Position = MASTER (single source, all-time). Period rows above are informational.
        position: masterPositions.get(s.id) ?? 0
      };
    });
  }, [shops, txnsR, shopEntriesR, masterPositions]);
  const simpleShopSummaries = reactExports.useMemo(() => {
    return shops.filter((s) => s.shop_type === "simple_cash").map((s) => {
      const entries = shopEntriesR.filter((e) => e.shop_id === s.id);
      const cashIn2 = entries.filter((e) => e.entry_type === "sale").reduce((sum, e) => sum + Number(e.cash_sale || 0), 0);
      const expense = entries.filter((e) => e.entry_type === "expense").reduce((sum, e) => sum + Number(e.expense_amount || 0), 0);
      return {
        id: s.id,
        name: s.name,
        cashIn: cashIn2,
        expense,
        balance: masterPositions.get(s.id) ?? 0
      };
    });
  }, [shops, shopEntriesR, masterPositions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-7 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight md:text-3xl", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "At-a-glance financial position." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1", children: [
      [["today", "Today"], ["week", "Week"], ["month", "Month"], ["all", "All"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRangeKey(k), className: cn("shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all", rangeKey === k ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted"), children: label }, k)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: cn("flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all", rangeKey === "custom" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
          " Custom"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-72 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.from, onChange: (e) => setCustom((c) => ({
              ...c,
              from: e.target.value
            })), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.to, onChange: (e) => setCustom((c) => ({
              ...c,
              to: e.target.value
            })), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRangeKey("custom"), className: "rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Apply" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: range.label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Cash in Hand", value: cashInHand, icon: Wallet, tone: "primary", breakdown: {
        period: range.label,
        formula: "Opening Cash + Shop Cash Sales + Warehouse Cash Sales + Bank Withdraw − Purchases − Expenses − Cash Out",
        rows: [{
          label: "Opening Cash",
          value: openingCashUsed,
          note: includeOpening ? void 0 : "Excluded for date-filtered view"
        }, {
          label: "Shop Cash Sales",
          value: shopCashSales
        }, {
          label: "Warehouse Cash Sales",
          value: warehouseCashSales
        }, {
          label: "Bank Withdraw",
          value: bankWithdraw
        }, {
          label: "Purchases",
          value: purchases,
          negative: true
        }, {
          label: "Expenses",
          value: expenses,
          negative: true
        }, {
          label: "Cash Out",
          value: cashOut,
          negative: true
        }, ...adjustments ? [{
          label: "Adjustments",
          value: adjustments
        }] : []],
        total: cashInHand
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Bank Balance", value: bankBalance, icon: Landmark, tone: "info", breakdown: {
        period: range.label,
        formula: "Opening Bank Balance + Shop Bank Sale − Bank Withdraw",
        rows: [{
          label: "Opening Bank Balance",
          value: openingBank,
          note: includeOpening ? void 0 : "Excluded for date-filtered view"
        }, {
          label: "Shop Bank Sale",
          value: shopBankSales
        }, {
          label: "Bank Withdraw",
          value: bankWithdraw,
          negative: true
        }],
        total: bankBalance
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Expense", value: totalExpense, icon: TrendingDown, tone: "danger", breakdown: {
        period: range.label,
        formula: "Shop Expenses + Manual Expenses + Warehouse Purchases",
        rows: [{
          label: "Shop Expenses",
          value: expensesShop
        }, {
          label: "Manual / Cash Out",
          value: expensesManual
        }, {
          label: "Warehouse Purchases",
          value: purchases
        }],
        total: totalExpense
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Warehouse Value", value: warehouseValue, icon: Package, tone: "success", breakdown: {
        period: "All Time",
        formula: "Opening Stock + Due Receivable + New Purchases − Warehouse Sales",
        rows: [{
          label: "Opening Stock",
          value: openingStock
        }, {
          label: "Due Receivable",
          value: dueReceivable
        }, {
          label: "New Purchases",
          value: whPurchases
        }, {
          label: "Warehouse Sales",
          value: whSales,
          negative: true
        }],
        total: warehouseValue
      } })
    ] }),
    erpShopSummaries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Full ERP Shop Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: range.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: erpShopSummaries.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShopSummaryCard, { shop: s, onDrill: (kind) => setDrill({
        shop: {
          id: s.id,
          name: s.name
        },
        kind
      }) }, s.id)) })
    ] }),
    simpleShopSummaries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Simple Cash Shop Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: range.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: simpleShopSummaries.map((s) => {
        const positive = s.balance >= 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4.5 w-4.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-display font-semibold tracking-tight", children: s.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300", children: "Simple" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setDrill({
              shop: {
                id: s.id,
                name: s.name
              },
              kind: "cash_in"
            }), className: "rounded-lg bg-muted/40 px-2 py-2 transition-all hover:bg-success/10 hover:ring-1 hover:ring-success/40 active:scale-[0.97]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Cash In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.cashIn, size: "sm" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setDrill({
              shop: {
                id: s.id,
                name: s.name
              },
              kind: "expense"
            }), className: "rounded-lg bg-muted/40 px-2 py-2 transition-all hover:bg-destructive/10 hover:ring-1 hover:ring-destructive/40 active:scale-[0.97]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Expense" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.expense, size: "sm" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-border pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-1", positive ? "text-success" : "text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.balance, size: "2xl" }) })
          ] })
        ] }, s.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopDrilldownSheet, { open: !!drill, onOpenChange: (v) => !v && setDrill(null), shop: drill?.shop ?? null, kind: drill?.kind ?? null, initialFrom: range.from, initialTo: range.to }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Open" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickLink, { to: "/reports", label: "Reports", desc: "Charts & exports", icon: FileChartColumnIncreasing }) })
    ] })
  ] });
}
function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  breakdown
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    info: "bg-chart-2/10 text-chart-2",
    danger: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("group relative overflow-hidden p-5 transition-all duration-300", "hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)] active:translate-y-0"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate", children: label }),
        breakdown && /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `How ${label} is calculated`, className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "start", className: "w-80 p-0 animate-scale-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: [
                breakdown.period,
                " · live breakdown"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: breakdown.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-foreground/90", children: r.label }),
                  r.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: r.note })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(r.negative && "text-destructive"), children: [
                  r.negative && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "− " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: r.value, size: "sm" })
                ] })
              ] }, r.label)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-primary/80", children: "Result" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: breakdown.total, size: "md", bold: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[10px] leading-relaxed text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground/70", children: "Formula: " }),
                breakdown.formula
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClass), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "2xl" }) })
  ] });
}
function ShopSummaryCard({
  shop,
  onDrill
}) {
  const positive = shop.position >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4.5 w-4.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate font-display font-semibold tracking-tight", children: shop.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "How this is calculated", className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-72 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Cash Position" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cash Sale", value: shop.cashSale, tone: "success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bank Withdraw", value: shop.bankWithdraw, tone: "success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total Cash", value: shop.totalCash, tone: "success", bold: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1.5 border-t border-border/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Purchase", value: shop.purchase, tone: "danger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Expense", value: shop.expense, tone: "danger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total Cost", value: shop.totalCost, tone: "danger", bold: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 border-t border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cash Position", value: shop.position, tone: positive ? "success" : "danger", bold: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[11px] leading-relaxed text-muted-foreground", children: [
            "Total Cash = Cash Sale + Withdraw",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Total Cost = Purchase + Expense",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Cash Position = Total Cash − Total Cost"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMetric, { label: "Total Cash", value: shop.totalCash }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMetric, { label: "Total Cost", value: shop.totalCost, negative: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMetric, { label: "Total Expense", value: shop.expense, negative: true, onClick: () => onDrill("expense") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMetric, { label: "Cash Position", value: shop.position, negative: !positive })
    ] })
  ] });
}
function MiniMetric({
  label,
  value,
  negative,
  onClick
}) {
  const Comp = onClick ? "button" : "div";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Comp, { type: onClick ? "button" : void 0, onClick, className: cn("rounded-lg bg-muted/40 px-2 py-2 text-left", onClick && "group cursor-pointer transition-all hover:bg-primary/10 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)] active:scale-[0.98]"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5", negative ? "text-destructive" : "", onClick && "group-hover:underline decoration-dotted underline-offset-2"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "sm" }) })
  ] });
}
function Row({
  label,
  value,
  tone,
  bold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs text-muted-foreground", bold && "font-semibold text-foreground"), children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(tone === "success" ? "text-success" : "text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: bold ? "md" : "sm", bold }) })
  ] });
}
function QuickLink({
  to,
  label,
  desc,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:translate-y-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold leading-tight", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
  ] });
}
export {
  Dashboard as component
};
