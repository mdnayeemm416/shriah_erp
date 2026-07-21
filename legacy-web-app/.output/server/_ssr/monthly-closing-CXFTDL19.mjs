import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, s as useUserAccess, ad as useProfileMap, C as Card, h as Badge, L as Label, I as Input, B as Button, af as SAR, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, G as DialogFooter, J as sortShops } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { S as ShieldAlert, L as Lock, ah as CalendarRange, d as LockOpen, a7 as Eye, a4 as History } from "../_libs/lucide-react.mjs";

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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/isbot.mjs";
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
function pad(n) {
  return String(n).padStart(2, "0");
}
function monthLabel(monthISO) {
  const d = /* @__PURE__ */ new Date(monthISO + (monthISO.length === 7 ? "-01" : "") + "T00:00:00");
  return d.toLocaleString(void 0, {
    month: "long",
    year: "numeric"
  });
}
function MonthlyClosingPage() {
  const {
    user
  } = useAuth();
  const {
    isAdmin
  } = useUserAccess();
  const now = /* @__PURE__ */ new Date();
  const defaultMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const [monthISO, setMonthISO] = reactExports.useState(defaultMonth);
  const [bankBalance, setBankBalance] = reactExports.useState("");
  const [closings, setClosings] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [confirmClose, setConfirmClose] = reactExports.useState(false);
  const [confirmReopen, setConfirmReopen] = reactExports.useState(null);
  const [reopenPwd, setReopenPwd] = reactExports.useState("");
  const [detail, setDetail] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const monthKey = `${monthISO}-01`;
  const profileMap = useProfileMap();
  const loadHistory = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("monthly_closings").select("*").order("month", {
      ascending: false
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setClosings(data ?? []);
  };
  reactExports.useEffect(() => {
    loadHistory();
  }, []);
  const currentClosing = reactExports.useMemo(() => closings.find((c) => c.month === monthKey) ?? null, [closings, monthKey]);
  const isClosed = currentClosing?.status === "closed";
  const buildSnapshot = async () => {
    const d = /* @__PURE__ */ new Date(monthKey + "T00:00:00");
    const from = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const to = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;
    const [shopsRes, entriesRes, companyRes, openingRes] = await Promise.all([supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false), supabase.from("shop_entries").select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to), supabase.from("company_transactions").select("txn_type,amount").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to), supabase.from("company_opening_balances").select("amount").eq("month", monthKey).maybeSingle()]);
    const shops = sortShops(shopsRes.data ?? []);
    const entries = entriesRes.data ?? [];
    const company = companyRes.data ?? [];
    const openingBalance = Number(openingRes?.data?.amount ?? 0);
    const breakdown = [];
    let shopIncome = 0, shopExpense = 0, shopProfit = 0, shopCashPos = 0;
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
      const income = isSimple ? simpleCashIn : cashSale + withdraw;
      const exp = isSimple ? simpleExpense : purchase + expense;
      const profit = income - exp;
      breakdown.push({
        shop_id: s.id,
        name: s.name ?? "—",
        income,
        expense: exp,
        profit
      });
      shopIncome += isSimple ? simpleCashIn : cashSale + withdraw - purchase;
      shopExpense += isSimple ? simpleExpense : expense;
      shopProfit += profit;
      shopCashPos += profit;
    }
    const companyIncome = company.filter((r) => r.txn_type === "income").reduce((s, r) => s + Number(r.amount || 0), 0);
    const companyExpense = company.filter((r) => r.txn_type === "expense").reduce((s, r) => s + Number(r.amount || 0), 0);
    const companyNet = companyIncome - companyExpense;
    const finalProfit = shopProfit + companyNet;
    return {
      period_start: from,
      period_end: to,
      total_shop_income: shopIncome,
      total_shop_expense: shopExpense,
      total_shop_profit: shopProfit,
      company_income: companyIncome,
      company_expense: companyExpense,
      company_net: companyNet,
      final_business_profit: finalProfit,
      total_shop_cash_position: shopCashPos,
      opening_balance: openingBalance,
      bank_balance: 0,
      shops: breakdown
    };
  };
  const onCloseMonth = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const snap = await buildSnapshot();
      const bank = Number(bankBalance || 0);
      const fullSnap = {
        ...snap,
        bank_balance: bank
      };
      const {
        error
      } = await supabase.from("monthly_closings").upsert({
        month: monthKey,
        status: "closed",
        closed_at: (/* @__PURE__ */ new Date()).toISOString(),
        closed_by: user.id,
        reopened_at: null,
        reopened_by: null,
        bank_balance: bank,
        total_shop_income: snap.total_shop_income,
        total_shop_expense: snap.total_shop_expense,
        total_shop_profit: snap.total_shop_profit,
        company_income: snap.company_income,
        company_expense: snap.company_expense,
        final_business_profit: snap.final_business_profit,
        total_shop_cash_position: snap.total_shop_cash_position,
        snapshot: fullSnap
      }, {
        onConflict: "month"
      });
      if (error) throw error;
      const next = /* @__PURE__ */ new Date(monthKey + "T00:00:00");
      next.setMonth(next.getMonth() + 1);
      const nextKey = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-01`;
      const {
        error: obErr
      } = await supabase.from("company_opening_balances").upsert({
        month: nextKey,
        amount: snap.final_business_profit,
        notes: `Auto: carried from ${monthISO}`,
        created_by: user.id
      }, {
        onConflict: "month"
      });
      if (obErr) console.warn("opening balance update:", obErr.message);
      toast.success(`${monthLabel(monthISO)} closed`);
      setConfirmClose(false);
      setBankBalance("");
      loadHistory();
    } catch (e) {
      toast.error(e.message ?? "Could not close month");
    } finally {
      setBusy(false);
    }
  };
  const onReopen = async () => {
    if (!confirmReopen || !user) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("monthly_closings").update({
      status: "reopened",
      reopened_at: (/* @__PURE__ */ new Date()).toISOString(),
      reopened_by: user.id
    }).eq("id", confirmReopen.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${monthLabel(confirmReopen.month)} reopened`);
    setConfirmReopen(null);
    setReopenPwd("");
    loadHistory();
  };
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-page-stack animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mx-auto h-8 w-8 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 font-semibold", children: "Admin only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Monthly Closing can only be performed by an administrator." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-primary" }),
        " Monthly Closing"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Close a month to lock all financial records. Carries Final Business Profit forward as next month's Company Opening Balance." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Select month" }),
        isClosed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "ml-auto gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
          " CLOSED"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-auto gap-1 bg-emerald-500 text-white hover:bg-emerald-500/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-3 w-3" }),
          " OPEN"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px]", children: "Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", className: "h-9 mt-1", value: monthISO, onChange: (e) => setMonthISO(e.target.value) })
        ] }),
        !isClosed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px]", children: "Bank balance (SAR)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", step: "0.01", className: "h-9 mt-1", value: bankBalance, placeholder: "0.00", onChange: (e) => setBankBalance(e.target.value) })
        ] })
      ] }),
      isClosed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-[12px] space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-destructive flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
            " Month is closed"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "All transactions, purchases, expenses and company entries in this month are locked. Reopen to make changes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => setDetail(currentClosing), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
            " View Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", onClick: () => setConfirmReopen(currentClosing), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-4 w-4" }),
            " Reopen Month"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2", onClick: () => setConfirmClose(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
        " Close Month"
      ] }),
      currentClosing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-muted/30 p-3 text-[12px] grid grid-cols-2 gap-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.total_shop_income) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop Expense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.total_shop_expense) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop Profit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.total_shop_profit) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Company Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.company_income) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Company Expense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.company_expense) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Bank Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.bank_balance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shop Cash Position" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(currentClosing.total_shop_cash_position) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Final Business Profit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums font-semibold", children: SAR(currentClosing.final_business_profit) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Closing History" })
      ] }),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Loading…" }),
      !loading && closings.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No closings yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: closings.map((c) => {
        const closedName = c.closed_by ? profileMap[c.closed_by]?.full_name ?? "—" : "—";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDetail(c), className: "w-full text-left rounded-xl border p-3 text-[12px] flex items-start justify-between gap-2 hover:bg-muted/40 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: monthLabel(c.month) }),
              c.status === "closed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "h-5 px-1.5 text-[10px] gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
                " Closed"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "h-5 px-1.5 text-[10px] gap-0.5 bg-emerald-500 text-white hover:bg-emerald-500/90", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-2.5 w-2.5" }),
                " Reopened"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10.5px] text-muted-foreground mt-0.5", children: [
              new Date(c.closed_at).toLocaleString(),
              " · by ",
              closedName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 tabular-nums", children: [
              "Final Profit: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: SAR(c.final_business_profit) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-muted-foreground mt-1 shrink-0" })
        ] }, c.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmClose, onOpenChange: setConfirmClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-5 w-5 text-destructive" }),
          " WARNING"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You are about to close:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
            "Month: ",
            monthLabel(monthISO)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "After closing:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 text-[12px] space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Transactions cannot be edited or deleted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Purchases cannot be edited or deleted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Expenses cannot be edited or deleted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Company Transactions cannot be edited or deleted" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Continue?" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: onCloseMonth, disabled: busy, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: busy ? "Closing…" : "Close Month" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmReopen, onOpenChange: (o) => {
      if (!o) {
        setConfirmReopen(null);
        setReopenPwd("");
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-5 w-5 text-amber-500" }),
          " ⚠️ Reopen Closed Month"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "You are about to reopen",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: confirmReopen ? monthLabel(confirmReopen.month) : "" }),
            ", a closed accounting month."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Reopening a month may affect:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Reports" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Profit calculations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Dashboard values" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Financial summaries" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Closing history" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px]", children: "Only reopen the month if you are certain that corrections are required. This action should only be performed by an authorized administrator." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { autoFocus: true, disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: onReopen, disabled: busy, className: "bg-amber-500 text-white hover:bg-amber-600", children: busy ? "Reopening…" : "Reopen Month" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detail, onOpenChange: (o) => !o && setDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[85vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-primary" }),
        detail ? monthLabel(detail.month) : "",
        " Closing Details"
      ] }) }),
      detail && /* @__PURE__ */ jsxRuntimeExports.jsx(ClosingDetails, { closing: detail, profileMap }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDetail(null), children: "Close" }) })
    ] }) })
  ] });
}
function Row({
  label,
  value,
  strong
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[12px] py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: strong ? "font-semibold" : "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tabular-nums ${strong ? "font-semibold" : ""}`, children: SAR(value) })
  ] });
}
function ClosingDetails({
  closing,
  profileMap
}) {
  const snap = closing.snapshot && typeof closing.snapshot === "object" ? closing.snapshot : void 0;
  const shops = snap?.shops ?? [];
  const closedBy = closing.closed_by ? profileMap[closing.closed_by]?.full_name ?? "—" : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-muted/30 p-3 space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: monthLabel(closing.month) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Closed Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(closing.closed_at).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Closed By" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: closedBy })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status" }),
        closing.status === "closed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "h-5 text-[10px] gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
          " Closed"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "h-5 text-[10px] gap-0.5 bg-emerald-500 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-2.5 w-2.5" }),
          " Reopened"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5", children: "Shop Summary" }),
      shops.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: "No per-shop breakdown saved for this closing." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[13px] mb-1", children: s.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Income", value: s.income }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Expense", value: s.expense }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Profit", value: s.profit, strong: true })
      ] }, s.shop_id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1", children: "Company Transactions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Company Income", value: closing.company_income }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Company Expense", value: closing.company_expense }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Company Net Position", value: snap?.company_net ?? closing.company_income - closing.company_expense, strong: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/5 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-wider text-primary mb-1", children: "Closing Snapshot" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Opening Balance", value: snap?.opening_balance ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total Shop Profit", value: closing.total_shop_profit }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bank Balance", value: closing.bank_balance }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Final Business Profit", value: closing.final_business_profit, strong: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground text-center", children: "Values shown exactly as saved on closing date. Never recalculated." })
  ] });
}
export {
  MonthlyClosingPage as component
};
