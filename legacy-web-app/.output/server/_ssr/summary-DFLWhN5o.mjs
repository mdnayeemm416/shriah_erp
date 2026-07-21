import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, o as useWorkingDate, J as sortShops, C as Card, I as Input, B as Button, d as cn, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, P as Popover, p as PopoverTrigger, q as PopoverContent } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { u as useShopPositions } from "./use-shop-positions-B07f-IJE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useWholesaleFinancials } from "./use-wholesale-financials-C4OBwATG.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { ae as TrendingUp, ax as TrendingDown, C as CircleCheck, W as Wallet, l as Sparkles, u as ChevronRight, v as Package, ay as Coins, ai as Building2, T as Trash2, P as Plus, az as Save, a4 as History, aA as Info } from "../_libs/lucide-react.mjs";

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
const COMPANY_OPENING = 175e3;
const LS_KEY = "summary_cash_holders_v1";
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function loadHolders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function SummaryPage() {
  const [holders, setHolders] = reactExports.useState([]);
  const [drill, setDrill] = reactExports.useState(null);
  const {
    user
  } = useAuth();
  const {
    workingDate
  } = useWorkingDate();
  const qc = useQueryClient();
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const loaded = loadHolders();
    setHolders(loaded.length ? loaded : [{
      id: uid(),
      name: "",
      amount: 0
    }]);
  }, []);
  reactExports.useEffect(() => {
    if (holders.length === 0) return;
    localStorage.setItem(LS_KEY, JSON.stringify(holders));
  }, [holders]);
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops(data ?? []);
    }
  });
  const {
    data: parties = []
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await supabase.from("parties").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: settings
  } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*").eq("id", 1).single()).data
  });
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["txns"],
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: empEntries = []
  } = useQuery({
    queryKey: ["employee-entries", "all-with-date"],
    queryFn: async () => (await supabase.from("employee_entries").select("employee_id, entry_type, amount, txn_date").eq("is_deleted", false)).data ?? []
  });
  const {
    data: whFin
  } = useWholesaleFinancials();
  const warehouse = reactExports.useMemo(() => ({
    currentStock: whFin?.currentStock ?? 0,
    dueReceivable: whFin?.receivable ?? 0,
    currentValue: whFin?.warehouseValue ?? 0
  }), [whFin]);
  const shopRange = reactExports.useMemo(() => {
    const [yy, mm, dd] = workingDate.split("-").map(Number);
    const pad = (n) => String(n).padStart(2, "0");
    return {
      from: `${yy}-${pad(mm || 1)}-01`,
      to: `${yy}-${pad(mm || 1)}-${pad(dd || 1)}`
    };
  }, [workingDate]);
  const {
    byId: masterPositions
  } = useShopPositions(shopRange);
  const shopPositions = reactExports.useMemo(() => shops.map((s) => ({
    id: s.id,
    name: s.name,
    position: masterPositions.get(s.id) ?? 0
  })), [shops, masterPositions]);
  const employeeOutstanding = reactExports.useMemo(() => {
    let given = 0, received = 0;
    for (const e of empEntries) {
      const amt = Number(e.amount) || 0;
      if (e.entry_type === "given") given += amt;
      else received += amt;
    }
    return given - received;
  }, [empEntries]);
  const monthKey = reactExports.useMemo(() => `${shopRange.from.slice(0, 7)}-01`, [shopRange.from]);
  const {
    data: companyTxns = []
  } = useQuery({
    queryKey: ["company_txns", shopRange.from, shopRange.to],
    queryFn: async () => (await supabase.from("company_transactions").select("txn_type, amount").eq("is_deleted", false).gte("txn_date", shopRange.from).lte("txn_date", shopRange.to)).data ?? []
  });
  const {
    data: companyOpening = 0
  } = useQuery({
    queryKey: ["company_opening_balance", monthKey],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("company_opening_balances").select("amount").eq("month", monthKey).maybeSingle();
      return Number(data?.amount ?? 0);
    }
  });
  const currentCompanyBalance = reactExports.useMemo(() => {
    let income = 0, expense = 0;
    for (const r of companyTxns) {
      const a = Number(r.amount) || 0;
      if (r.txn_type === "income") income += a;
      else if (r.txn_type === "expense") expense += a;
    }
    return companyOpening + income - expense;
  }, [companyTxns, companyOpening]);
  const totalShopCash = shopPositions.reduce((s, x) => s + x.position, 0);
  const totalInvest = COMPANY_OPENING + totalShopCash + currentCompanyBalance;
  const wholesaleValue = warehouse.currentValue;
  const totalCashInApp = totalInvest - wholesaleValue - employeeOutstanding;
  const totalCashInHand = holders.reduce((s, h) => s + (Number(h.amount) || 0), 0);
  const difference = totalCashInHand - totalCashInApp;
  const addHolder = () => setHolders((h) => [...h, {
    id: uid(),
    name: "",
    amount: 0
  }]);
  const updateHolder = (id, patch) => setHolders((h) => h.map((x) => x.id === id ? {
    ...x,
    ...patch
  } : x));
  const removeHolder = (id) => setHolders((h) => h.length <= 1 ? h : h.filter((x) => x.id !== id));
  const {
    data: snapshots = []
  } = useQuery({
    queryKey: ["cash_in_hand_snapshots"],
    queryFn: async () => (await supabase.from("cash_in_hand_snapshots").select("*").order("snapshot_date", {
      ascending: false
    }).order("created_at", {
      ascending: false
    }).limit(60)).data ?? []
  });
  const saveSnapshot = async () => {
    if (!user) {
      toast.error("Please sign in");
      return;
    }
    setSaving(true);
    const payload = {
      snapshot_date: workingDate,
      cash_in_hand: Number(totalCashInHand.toFixed(2)),
      cash_in_app: Number(totalCashInApp.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      holders: holders.filter((h) => h.name || h.amount),
      created_by: user.id
    };
    const {
      error
    } = await supabase.from("cash_in_hand_snapshots").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message || "Save failed");
      return;
    }
    toast.success(`Saved snapshot for ${workingDate}`);
    qc.invalidateQueries({
      queryKey: ["cash_in_hand_snapshots"]
    });
  };
  const deleteSnapshot = async (id) => {
    const {
      error
    } = await supabase.from("cash_in_hand_snapshots").delete().eq("id", id);
    if (error) {
      toast.error(error.message || "Delete failed");
      return;
    }
    toast.success("Snapshot deleted");
    qc.invalidateQueries({
      queryKey: ["cash_in_hand_snapshots"]
    });
  };
  let statusTone = "perfect";
  if (difference < -0.01) statusTone = "short";
  else if (difference > 0.01) statusTone = "extra";
  const statusMeta = {
    perfect: {
      label: "Perfect Match",
      icon: CircleCheck,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      pill: "bg-emerald-100 text-emerald-700"
    },
    short: {
      label: "Cash Shortage",
      icon: TrendingDown,
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      pill: "bg-rose-100 text-rose-700"
    },
    extra: {
      label: "Extra Cash Found",
      icon: TrendingUp,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      pill: "bg-amber-100 text-amber-800"
    }
  }[statusTone];
  const StatusIcon = statusMeta.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 px-1 md:-mx-8 md:px-8 md:pt-1 md:pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl border-teal-200/70 bg-gradient-to-r from-teal-50 via-white to-white px-4 py-3 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700/80", children: "Total Cash In App" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalCashInApp, size: "2xl", className: "text-teal-900 transition-all" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Total Cash In App", formula: `Total Invest:        ${fmt(totalInvest)}
− Wholesale Value:   ${fmt(wholesaleValue)}
− Employee Outstand: ${fmt(employeeOutstanding)}
──────────
= Cash In App:       ${fmt(totalCashInApp)}`, lines: ["Total Invest − Wholesale Current Value − Employee Outstanding."] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ai-insights", className: "-mx-1 px-1 md:-mx-8 md:px-8", "aria-label": "Ask AI", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-3 rounded-2xl border-primary/30 bg-gradient-to-r from-primary/10 via-background to-background px-4 py-3 shadow-sm transition-all hover:from-primary/15 hover:shadow-[var(--shadow-glow)] active:scale-[0.99]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80", children: "Ask AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium text-foreground", children: "Get insights on demand" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground rtl:rotate-180" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "01", title: "Company Foundation" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceRow, { label: "Company Opening Balance", value: COMPANY_OPENING, info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Company Opening Balance", lines: ["Fixed company-level opening capital.", "Not editable."], formula: `= ${fmt(COMPANY_OPENING)} SAR` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceRow, { label: "Total Shop Cash Position", value: totalShopCash, onClick: () => setDrill("shops"), info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Total Shop Cash Position", lines: ["Sum of Cash Position from every shop on the Shop Page (single source)."], formula: shopPositions.length ? shopPositions.map((s) => `${s.name}: ${fmt(s.position)}`).join("\n") + `
──────────
Total: ${fmt(totalShopCash)}` : "No shops yet" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FinanceRow, { label: "Total Invest", value: totalInvest, emphasis: true, info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Total Invest", formula: `${fmt(COMPANY_OPENING)} + ${fmt(totalShopCash)} + ${fmt(currentCompanyBalance)} = ${fmt(totalInvest)}`, lines: ["Company Opening Balance + Total Shop Cash Position + Current Company Balance."] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "02", title: "Wholesale & Employee" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Wholesale Current Value", value: wholesaleValue, icon: Package, onClick: () => setDrill("warehouse"), info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Wholesale Current Value", lines: ["Same value as Warehouse → Current Value."], formula: `Current Stock ${fmt(warehouse.currentStock)} + Receivable ${fmt(warehouse.dueReceivable)} = ${fmt(wholesaleValue)}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Employee Outstanding", value: employeeOutstanding, icon: Coins, info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Employee Outstanding", lines: ["All-time outstanding (Given − Received). Not affected by Monthly Closing."], formula: `Σ Given − Σ Received (all time) = ${fmt(employeeOutstanding)}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Current Company Balance", value: currentCompanyBalance, icon: Building2, info: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Current Company Balance", lines: ["Same as Company Transactions → Current Company Balance card."], formula: `Opening ${fmt(companyOpening)} + Income − Expense = ${fmt(currentCompanyBalance)}` }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "04", title: "Cash In Hand" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: "Real-world cash holders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add every person or location that physically holds cash." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: holders.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_140px_36px] items-center gap-2 rounded-xl border border-border/60 bg-card/50 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: `Holder ${i + 1} name`, value: h.name, onChange: (e) => updateHolder(h.id, {
          name: e.target.value
        }), className: "h-10 border-none bg-transparent focus-visible:ring-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", placeholder: "0", value: h.amount || "", onChange: (e) => updateHolder(h.id, {
          amount: parseFloat(e.target.value) || 0
        }), className: "h-10 text-end tabular-nums" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeHolder(h.id), disabled: holders.length <= 1, className: "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground", "aria-label": "Remove holder", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, h.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: addHolder, className: "mt-3 w-full gap-1.5 border-dashed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add Holder"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Total Cash In Hand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalCashInHand, size: "xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: saveSnapshot, disabled: saving, className: "mt-3 w-full gap-1.5", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        saving ? "Saving..." : `Save Today (${workingDate})`
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "04b", title: "Cash In Hand History" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-4", children: snapshots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-5 w-5 text-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No saved snapshots yet. Save your first daily cash count above." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: snapshots.map((s) => {
      const diff = Number(s.difference) || 0;
      const tone = diff < -0.01 ? "short" : diff > 0.01 ? "extra" : "perfect";
      const toneMeta = {
        perfect: {
          label: "Matched",
          chip: "bg-emerald-100 text-emerald-700",
          icon: CircleCheck
        },
        short: {
          label: `Shortage ${fmt(diff)}`,
          chip: "bg-rose-100 text-rose-700",
          icon: TrendingDown
        },
        extra: {
          label: `Extra +${fmt(diff)}`,
          chip: "bg-amber-100 text-amber-800",
          icon: TrendingUp
        }
      }[tone];
      const Icon = toneMeta.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-semibold tabular-nums", children: s.snapshot_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", toneMeta.chip), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
              toneMeta.label
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
            "Hand ",
            fmt(Number(s.cash_in_hand)),
            " · App ",
            fmt(Number(s.cash_in_app))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteSnapshot(s.id), className: "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600", "aria-label": "Delete snapshot", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] }, s.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "05", title: "Verification" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("rounded-2xl border p-5", statusMeta.bg, statusMeta.border), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusMeta.pill), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
            statusMeta.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Cash In Hand − Cash In App" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Difference", formula: `${fmt(totalCashInHand)} − ${fmt(totalCashInApp)} = ${fmt(difference)}`, lines: ["0 → Perfect Match", "Negative → Cash Shortage", "Positive → Extra Cash Found"] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(difference), size: "3xl", className: statusMeta.text }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!drill, onOpenChange: (o) => !o && setDrill(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[80vh] overflow-y-auto rounded-t-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: drill === "shops" ? "Shop Cash Position Breakdown" : "Warehouse Current Value" }) }),
      drill === "shops" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        shopPositions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No shops yet." }),
        shopPositions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: s.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.position, size: "md" })
        ] }, s.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-teal-700", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalShopCash, size: "lg", className: "text-teal-900" })
        ] })
      ] }),
      drill === "warehouse" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Current Stock", value: warehouse.currentStock }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Receivable", value: warehouse.dueReceivable }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-teal-700", children: "Current Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: wholesaleValue, size: "lg", className: "text-teal-900" })
        ] })
      ] })
    ] }) })
  ] });
}
function fmt(n) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2
  }).format(n || 0);
}
function SectionLabel({
  index,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/60", children: index }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border/70" })
  ] });
}
function FinanceRow({
  label,
  value,
  info,
  emphasis,
  onClick
}) {
  const clickable = !!onClick;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick, className: cn("flex items-center justify-between gap-3 py-2.5", clickable && "cursor-pointer rounded-lg -mx-2 px-2 hover:bg-muted/40 active:scale-[0.995] transition-colors"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("truncate text-[12.5px]", emphasis ? "font-semibold text-foreground" : "text-muted-foreground"), children: label }),
      info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: info })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: emphasis ? "lg" : "md", className: emphasis ? "text-teal-900" : void 0 }),
      clickable && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/60" })
    ] })
  ] });
}
function StatCard({
  label,
  value,
  icon: Icon,
  info,
  accent,
  locked,
  fullWidth,
  onClick
}) {
  const clickable = !!onClick;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick, className: cn("relative rounded-2xl p-4 transition-all", accent && "border-teal-200/70 bg-gradient-to-br from-teal-50/60 to-white", clickable && "cursor-pointer hover:border-teal-300 hover:shadow-md active:scale-[0.99]", fullWidth && "p-5"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex h-8 w-8 items-center justify-center rounded-lg", accent ? "bg-teal-100 text-teal-700" : "bg-muted text-muted-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        locked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Fixed" }),
        info && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: info })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-end justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: fullWidth ? "2xl" : "xl" }),
      clickable && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/60" })
    ] })
  ] });
}
function InfoPop({
  content
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => e.stopPropagation(), className: "flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground", "aria-label": "Info", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { align: "end", sideOffset: 6, className: "w-72 p-0", onClick: (e) => e.stopPropagation(), children: content })
  ] });
}
function InfoBlock({
  title,
  formula,
  lines
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: "Live formula" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3 text-[12px] leading-relaxed", children: [
      lines?.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80", children: l }, i)),
      formula && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground", children: formula })
    ] })
  ] });
}
function BreakdownRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md" })
  ] });
}
export {
  SummaryPage as component
};
