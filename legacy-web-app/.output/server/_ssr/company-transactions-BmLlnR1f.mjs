import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { av as useHighlightRecord, k as useAuth, o as useWorkingDate, s as useUserAccess, B as Button, C as Card, L as Label, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, I as Input, af as SAR, d as cn, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, G as DialogFooter, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, T as Textarea, aA as sendAuditEmail } from "./router-KeVl8_Ln.mjs";
import { d as useSearch } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { softDelete } from "./soft-delete-DQY0d6eC.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { ai as Building2, P as Plus, bo as PiggyBank, a5 as Pencil, W as Wallet, ae as TrendingUp, ax as TrendingDown, q as Paperclip, T as Trash2 } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


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
import "../_libs/tslib.mjs";
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
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/isbot.mjs";
import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
const INCOME_CATEGORIES = ["Rent Income", "Commission", "Rebate", "Other"];
const EXPENSE_CATEGORIES = ["Vehicle Expense", "Office Expense", "Internet Bill", "Government Fee", "Salary", "Maintenance", "Other"];
function pad(n) {
  return String(n).padStart(2, "0");
}
function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function resolvePeriod(mode, anchor, customFrom, customTo) {
  const d = /* @__PURE__ */ new Date(anchor + "T00:00:00");
  if (mode === "daily") return {
    from: anchor,
    to: anchor
  };
  if (mode === "weekly") {
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      from: toISO(start),
      to: toISO(end)
    };
  }
  if (mode === "monthly") {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return {
      from: toISO(first),
      to: toISO(last)
    };
  }
  return {
    from: customFrom,
    to: customTo
  };
}
function CompanyTransactionsPage() {
  useHighlightRecord();
  const search = useSearch({
    from: "/_app/company-transactions"
  });
  const {
    user
  } = useAuth();
  const {
    workingDate
  } = useWorkingDate();
  const {
    isAdmin
  } = useUserAccess();
  const [rows, setRows] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [shopProfit, setShopProfit] = reactExports.useState(0);
  const [openingBalance, setOpeningBalance] = reactExports.useState(0);
  const [openingDialog, setOpeningDialog] = reactExports.useState(false);
  const [openingInput, setOpeningInput] = reactExports.useState("");
  const [periodMode, setPeriodMode] = reactExports.useState("monthly");
  const [anchor, setAnchor] = reactExports.useState(workingDate);
  const [customFrom, setCustomFrom] = reactExports.useState(workingDate);
  const [customTo, setCustomTo] = reactExports.useState(workingDate);
  const [openForm, setOpenForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!search.highlight || !search.date) return;
    setPeriodMode("daily");
    setAnchor(search.date);
  }, [search.highlight, search.date]);
  const period = reactExports.useMemo(() => resolvePeriod(periodMode, anchor, customFrom, customTo), [periodMode, anchor, customFrom, customTo]);
  const monthKey = reactExports.useMemo(() => {
    const d = /* @__PURE__ */ new Date(period.from + "T00:00:00");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
  }, [period.from]);
  const load = async () => {
    setLoading(true);
    const [txnRes, shopsRes, entriesRes] = await Promise.all([supabase.from("company_transactions").select("*").eq("is_deleted", false).gte("txn_date", period.from).lte("txn_date", period.to).order("txn_date", {
      ascending: false
    }).order("created_at", {
      ascending: false
    }), supabase.from("shops").select("id,shop_type").eq("is_deleted", false), supabase.from("shop_entries").select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount").eq("is_deleted", false).gte("txn_date", period.from).lte("txn_date", period.to)]);
    setLoading(false);
    if (txnRes.error) {
      toast.error(txnRes.error.message);
      return;
    }
    setRows(txnRes.data ?? []);
    const shops = shopsRes.data ?? [];
    const entries = entriesRes.data ?? [];
    let total = 0;
    for (const s of shops) {
      const rs = entries.filter((e) => e.shop_id === s.id);
      const isSimple = s.shop_type === "simple_cash";
      let cashSale = 0, withdraw = 0, purchase = 0, expense = 0;
      let simpleCashIn = 0, simpleExpense = 0;
      for (const e of rs) {
        cashSale += Number(e.cash_sale || 0);
        withdraw += Number(e.withdraw_amount || 0);
        purchase += Number(e.purchase_amount || 0);
        expense += Number(e.expense_amount || 0);
        if (isSimple) {
          if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
          else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
        }
      }
      const cash_position = isSimple ? simpleCashIn - simpleExpense : cashSale + withdraw - (purchase + expense);
      const net_profit = cash_position;
      total += net_profit;
    }
    setShopProfit(total);
  };
  reactExports.useEffect(() => {
    load();
  }, [period.from, period.to]);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.from("company_opening_balances").select("amount").eq("month", monthKey).maybeSingle();
      setOpeningBalance(Number(data?.amount ?? 0));
    })();
  }, [monthKey]);
  const totals = reactExports.useMemo(() => {
    const income = (rows ?? []).filter((r) => r.txn_type === "income").reduce((s, r) => s + Number(r.amount || 0), 0);
    const expense = (rows ?? []).filter((r) => r.txn_type === "expense").reduce((s, r) => s + Number(r.amount || 0), 0);
    return {
      income,
      expense,
      net: income - expense
    };
  }, [rows]);
  const onDelete = async () => {
    if (!deleteId) return;
    const existing = (rows ?? []).find((r) => r.id === deleteId);
    const {
      error
    } = await softDelete("company_transactions", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setDeleteId(null);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== deleteId));
    try {
      sendAuditEmail({
        action: "deleted",
        module: "Company Transaction",
        userName: user?.email || null,
        recordId: deleteId,
        oldValues: existing || {
          id: deleteId
        },
        notes: existing?.notes || null,
        amount: Number(existing?.amount ?? 0)
      });
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }),
          " Company Transactions"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Head office income & expenses — not linked to any shop." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditing(null);
        setOpenForm(true);
      }, disabled: !user, className: "h-9 gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Period" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: periodMode, onValueChange: (v) => setPeriodMode(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "monthly", children: "Monthly" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "Custom Range" })
            ] })
          ] })
        ] }),
        periodMode === "custom" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9 mt-1", value: customFrom, onChange: (e) => setCustomFrom(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9 mt-1", value: customTo, onChange: (e) => setCustomTo(e.target.value) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Anchor date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-9 mt-1", value: anchor, onChange: (e) => setAnchor(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[10.5px] text-muted-foreground", children: [
        "Showing ",
        period.from,
        " → ",
        period.to
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-3.5 w-3.5 text-amber-600" }),
          " Opening Balance"
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-6 w-6 -mr-1 -mt-1", onClick: () => {
          setOpeningInput(String(openingBalance || ""));
          setOpeningDialog(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-display text-3xl font-bold tabular-nums tracking-tight text-amber-700 dark:text-amber-500", children: SAR(openingBalance) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[10px] text-muted-foreground", children: [
        "Carried forward · Month of ",
        monthKey.slice(0, 7)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-primary" }),
        " Final Business Profit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-1 font-display text-3xl font-bold tabular-nums tracking-tight", shopProfit + totals.net >= 0 ? "text-emerald-600" : "text-destructive"), children: SAR(shopProfit + totals.net) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between rounded-lg bg-muted/40 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop Profit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: SAR(shopProfit) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between rounded-lg bg-muted/40 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Company Net" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-semibold tabular-nums", totals.net >= 0 ? "text-emerald-600" : "text-destructive"), children: SAR(totals.net) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[10px] text-muted-foreground", children: [
        "Shop Profit + Company Income − Company Expense · ",
        period.from,
        " → ",
        period.to
      ] })
    ] }),
    (() => {
      const current = openingBalance + totals.income - totals.expense;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-emerald-600" }),
          " Current Company Balance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-1 font-display text-3xl font-bold tabular-nums tracking-tight", current >= 0 ? "text-emerald-600" : "text-destructive"), children: SAR(current) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "Opening + Company Income − Company Expense" })
      ] });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SumCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-emerald-600" }), label: "Income", value: totals.income, tone: "ok" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SumCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5 text-destructive" }), label: "Expense", value: totals.expense, tone: "bad" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SumCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-primary" }), label: "Net", value: totals.net, tone: totals.net >= 0 ? "ok" : "bad" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loading && rows === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : (rows ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No company transactions in this period" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Click Add to record income or expense." })
    ] }) : (rows ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-record-id": r.id, className: "rounded-2xl p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", r.txn_type === "income" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-destructive/15 text-destructive"), children: [
            r.txn_type === "income" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
            r.txn_type
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: r.txn_date })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] font-semibold", children: r.category }),
        r.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11.5px] text-muted-foreground line-clamp-2", children: r.notes }),
        r.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: r.attachment_url, target: "_blank", rel: "noreferrer", className: "mt-1 inline-flex items-center gap-1 text-[10.5px] text-primary hover:underline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
          " Attachment"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-display text-base font-bold tabular-nums", r.txn_type === "income" ? "text-emerald-600" : "text-destructive"), children: SAR(Number(r.amount)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: () => {
            setEditing(r);
            setOpenForm(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7 text-destructive hover:bg-destructive/10", onClick: () => setDeleteId(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] })
    ] }) }, r.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyTxnForm, { open: openForm, onOpenChange: (o) => {
      setOpenForm(o);
      if (!o) setEditing(null);
    }, editing, defaultDate: workingDate, onSaved: () => {
      setOpenForm(false);
      setEditing(null);
      load();
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: openingDialog, onOpenChange: setOpeningDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Set Opening Balance" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: monthKey.slice(0, 7), disabled: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (SAR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", step: "0.01", value: openingInput, onChange: (e) => setOpeningInput(e.target.value), placeholder: "0.00" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Carried forward from the previous month's Final Business Profit. Admins only." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setOpeningDialog(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: async () => {
          const amt = Number(openingInput || 0);
          const {
            error
          } = await supabase.from("company_opening_balances").upsert({
            month: monthKey,
            amount: amt
          }, {
            onConflict: "month"
          });
          if (error) {
            toast.error(error.message);
            return;
          }
          setOpeningBalance(amt);
          setOpeningDialog(false);
          toast.success("Opening balance saved");
        }, children: "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this transaction?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The record will be moved to the recycle bin. Admins can restore it." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: onDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function SumCard({
  icon,
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
      icon,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-1 font-display text-[15px] font-bold tabular-nums", tone === "ok" ? "text-emerald-600" : "text-destructive"), children: SAR(value) })
  ] });
}
function CompanyTxnForm({
  open,
  onOpenChange,
  editing,
  defaultDate,
  onSaved
}) {
  const {
    user
  } = useAuth();
  const [saving, setSaving] = reactExports.useState(false);
  const [txnDate, setTxnDate] = reactExports.useState(defaultDate);
  const [txnType, setTxnType] = reactExports.useState("expense");
  const [category, setCategory] = reactExports.useState("Other");
  const [amount, setAmount] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [attachmentUrl, setAttachmentUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (open) {
      if (editing) {
        setTxnDate(editing.txn_date);
        setTxnType(editing.txn_type);
        setCategory(editing.category);
        setAmount(String(editing.amount));
        setNotes(editing.notes ?? "");
        setAttachmentUrl(editing.attachment_url ?? "");
      } else {
        setTxnDate(defaultDate);
        setTxnType("expense");
        setCategory("Other");
        setAmount("");
        setNotes("");
        setAttachmentUrl("");
      }
    }
  }, [open, editing, defaultDate]);
  const categories = txnType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const onSubmit = async () => {
    if (!user) {
      toast.error("Sign in required");
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!category.trim()) {
      toast.error("Pick a category");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        txn_date: txnDate,
        txn_type: txnType,
        category,
        amount: amt,
        notes: notes.trim() || null,
        attachment_url: attachmentUrl.trim() || null
      };
      if (editing) {
        const {
          error
        } = await supabase.from("company_transactions").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const {
          error
        } = await supabase.from("company_transactions").insert({
          ...payload,
          created_by: user.id
        });
        if (error) throw error;
        toast.success("Saved");
      }
      try {
        sendAuditEmail({
          action: editing ? "edited" : "created",
          module: "Company Transaction",
          userName: user?.email || null,
          recordId: editing?.id ?? null,
          oldValues: editing ? editing : null,
          newValues: payload,
          notes: notes.trim() || null,
          amount: amt
        });
      } catch (e) {
      }
      onSaved();
    } catch (e) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Company Transaction" : "Add Company Transaction" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: txnDate, onChange: (e) => setTxnDate(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: txnType, onValueChange: (v) => {
            setTxnType(v);
            setCategory("Other");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "income", children: "Income" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "expense", children: "Expense" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (SAR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", min: "0", step: "0.01", value: amount, onChange: (e) => setAmount(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Note" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Optional description" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Attachment URL (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: attachmentUrl, onChange: (e) => setAttachmentUrl(e.target.value), placeholder: "https://..." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSubmit, disabled: saving, children: saving ? "Saving…" : editing ? "Update" : "Save" })
    ] })
  ] }) });
}
export {
  CompanyTransactionsPage as component
};
