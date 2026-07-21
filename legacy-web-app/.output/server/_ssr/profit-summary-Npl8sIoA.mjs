import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, o as useWorkingDate, aI as Tabs, aJ as TabsList, aK as TabsTrigger, aL as TabsContent, C as Card, L as Label, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, I as Input, B as Button, af as SAR, d as cn, S as Sheet, e as SheetContent, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, J as sortShops, f as SheetHeader, g as SheetTitle } from "./router-KeVl8_Ln.mjs";
import { C as Collapsible, b as CollapsibleContent, a as CollapsibleTrigger } from "./collapsible-DUtqt5i7.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { ac as FileChartColumnIncreasing, ah as CalendarRange, l as Sparkles, P as Plus, J as Printer, T as Trash2, p as ChevronUp, m as ChevronDown, U as Users, ai as Building2, W as Wallet } from "../_libs/lucide-react.mjs";

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
import "../_libs/radix-ui__react-collapsible.mjs";
function pad(n) {
  return String(n).padStart(2, "0");
}
function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function monthRange(monthISO) {
  const [y, m] = monthISO.split("-").map(Number);
  const first = new Date(y, (m || 1) - 1, 1);
  const last = new Date(y, m || 1, 0);
  const label = first.toLocaleDateString(void 0, {
    month: "long",
    year: "numeric"
  });
  return {
    from: toISO(first),
    to: toISO(last),
    label
  };
}
function bucketExpense(note) {
  const n = (note ?? "").trim();
  return n.length > 0 ? n : "Other Expense";
}
async function computeReport(opts) {
  const {
    from,
    to
  } = opts;
  const shopsRes = await supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false);
  const allShops = sortShops(shopsRes.data ?? []);
  const targetShops = opts.scope === "company" ? allShops : allShops.filter((s) => s.id === opts.shopId);
  const fromDate = /* @__PURE__ */ new Date(from + "T00:00:00");
  const toDate = /* @__PURE__ */ new Date(to + "T00:00:00");
  const period_days = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / 864e5) + 1);
  const emptyTotals = {
    cash_position: 0,
    profit_before_expense: 0,
    total_expense: 0,
    net_profit: 0,
    salary_total: 0,
    salary_employee_count: 0,
    salary_worked_days_total: 0
  };
  const companyRes = await supabase.from("company_transactions").select("txn_date,txn_type,category,amount,notes").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to).order("txn_date", {
    ascending: false
  });
  const companyRows = companyRes.data ?? [];
  const incomeBuckets = /* @__PURE__ */ new Map();
  const expenseBuckets = /* @__PURE__ */ new Map();
  const companyTxns = [];
  let companyIncome = 0, companyExpense = 0;
  for (const r of companyRows) {
    const amt = Number(r.amount || 0);
    if (amt <= 0) continue;
    const note = r.notes && String(r.notes).trim() || "";
    const label = note || r.category || "Other";
    companyTxns.push({
      date: String(r.txn_date ?? "").slice(0, 10),
      type: r.txn_type,
      category: r.category || "Other",
      note,
      amount: amt
    });
    if (r.txn_type === "income") {
      companyIncome += amt;
      incomeBuckets.set(label, (incomeBuckets.get(label) ?? 0) + amt);
    } else if (r.txn_type === "expense") {
      companyExpense += amt;
      expenseBuckets.set(label, (expenseBuckets.get(label) ?? 0) + amt);
    }
  }
  const company = {
    income: companyIncome,
    expense: companyExpense,
    net: companyIncome - companyExpense,
    income_breakdown: Array.from(incomeBuckets.entries()).map(([label, amount]) => ({
      label,
      amount
    })).sort((a, b) => b.amount - a.amount),
    expense_breakdown: Array.from(expenseBuckets.entries()).map(([label, amount]) => ({
      label,
      amount
    })).sort((a, b) => b.amount - a.amount),
    txns: companyTxns
  };
  if (!targetShops.length) {
    return {
      scope: opts.scope,
      period_from: from,
      period_to: to,
      period_label: opts.periodLabel,
      period_days,
      shops: [],
      totals: emptyTotals,
      company,
      final_business_profit: company.net
    };
  }
  const targetIds = targetShops.map((s) => s.id);
  const [entriesRes, employeesRes] = await Promise.all([supabase.from("shop_entries").select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount,difference,notes,txn_date").eq("is_deleted", false).in("shop_id", targetIds).gte("txn_date", from).lte("txn_date", to), supabase.from("employees").select("id,name,shop_id,monthly_salary").eq("is_deleted", false).in("shop_id", targetIds)]);
  const entries = entriesRes.data ?? [];
  const employees = employeesRes.data ?? [];
  const shopProfits = targetShops.map((s) => {
    const rows = entries.filter((e) => e.shop_id === s.id);
    const isSimple = s.shop_type === "simple_cash";
    let cashSale = 0, withdraw = 0, purchase = 0, expense = 0, plusMinus = 0;
    let simpleCashIn = 0, simpleExpense = 0;
    const buckets = /* @__PURE__ */ new Map();
    const expenses = [];
    for (const e of rows) {
      cashSale += Number(e.cash_sale || 0);
      withdraw += Number(e.withdraw_amount || 0);
      purchase += Number(e.purchase_amount || 0);
      expense += Number(e.expense_amount || 0);
      plusMinus += Number(e.difference || 0);
      if (isSimple) {
        if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
        else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
      }
      if (e.entry_type === "expense") {
        const amt = Number(e.expense_amount || 0);
        if (amt > 0) {
          const k = bucketExpense(e.notes);
          buckets.set(k, (buckets.get(k) ?? 0) + amt);
          expenses.push({
            date: String(e.txn_date ?? "").slice(0, 10),
            note: k,
            amount: amt
          });
        }
      }
    }
    expenses.sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
    const cash_position = isSimple ? simpleCashIn - simpleExpense : cashSale + withdraw - (purchase + expense);
    const total_expense = isSimple ? simpleExpense : expense;
    const profit_before_expense = cash_position + total_expense;
    const net_profit = profit_before_expense - total_expense;
    const expense_breakdown = Array.from(buckets.entries()).map(([label, amount]) => ({
      label,
      amount
    })).sort((a, b) => b.amount - a.amount);
    const shopEmps = employees.filter((emp) => emp.shop_id === s.id);
    const salary_rows = shopEmps.map((emp) => {
      const monthly_salary = Number(emp.monthly_salary || 0);
      const worked_days = period_days;
      const calculated_salary = monthly_salary / 30 * worked_days;
      return {
        name: emp.name,
        monthly_salary,
        worked_days,
        calculated_salary
      };
    });
    const salary_total = salary_rows.reduce((sum, r) => sum + r.calculated_salary, 0);
    const salary_worked_days_total = salary_rows.reduce((sum, r) => sum + r.worked_days, 0);
    return {
      shop_id: s.id,
      shop_name: s.name,
      cash_position,
      profit_before_expense,
      total_expense,
      net_profit,
      cash_sale: isSimple ? simpleCashIn : cashSale,
      bank_withdraw: isSimple ? 0 : withdraw,
      total_purchase: isSimple ? 0 : purchase,
      plus_minus: isSimple ? 0 : plusMinus,
      expense_breakdown,
      expenses,
      salary_rows,
      salary_total,
      salary_employee_count: salary_rows.length,
      salary_worked_days_total
    };
  });
  const totals = shopProfits.reduce((acc, s) => ({
    cash_position: acc.cash_position + s.cash_position,
    profit_before_expense: acc.profit_before_expense + s.profit_before_expense,
    total_expense: acc.total_expense + s.total_expense,
    net_profit: acc.net_profit + s.net_profit,
    salary_total: acc.salary_total + s.salary_total,
    salary_employee_count: acc.salary_employee_count + s.salary_employee_count,
    salary_worked_days_total: acc.salary_worked_days_total + s.salary_worked_days_total
  }), {
    ...emptyTotals
  });
  return {
    scope: opts.scope,
    period_from: from,
    period_to: to,
    period_label: opts.periodLabel,
    period_days,
    shops: shopProfits,
    totals,
    company,
    final_business_profit: totals.net_profit + company.net
  };
}
function ProfitSummaryPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const {
    workingDate
  } = useWorkingDate();
  const [scope, setScope] = reactExports.useState("company");
  const [shopId, setShopId] = reactExports.useState("");
  const [periodMode, setPeriodMode] = reactExports.useState("month");
  const [wy, wm] = workingDate.split("-");
  const [monthISO, setMonthISO] = reactExports.useState(`${wy}-${wm}`);
  const [customFrom, setCustomFrom] = reactExports.useState(workingDate);
  const [customTo, setCustomTo] = reactExports.useState(workingDate);
  const [report, setReport] = reactExports.useState(null);
  const [generating, setGenerating] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [snapshots, setSnapshots] = reactExports.useState(null);
  const [openSnap, setOpenSnap] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("report");
  const [monthStatus, setMonthStatus] = reactExports.useState("open");
  reactExports.useEffect(() => {
    (async () => {
      if (periodMode !== "month") {
        setMonthStatus("open");
        return;
      }
      const monthKey = `${monthISO}-01`;
      const {
        data
      } = await supabase.from("monthly_closings").select("status").eq("month", monthKey).maybeSingle();
      const status = data?.status === "closed" ? "closed" : "open";
      setMonthStatus(status);
      if (status === "closed") setReport(null);
    })();
  }, [periodMode, monthISO]);
  const [shopOptions, setShopOptions] = reactExports.useState([]);
  const loadShops = async () => {
    if (shopOptions.length) return;
    const {
      data
    } = await supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false);
    const list = sortShops(data ?? []);
    setShopOptions(list);
    if (!shopId && list.length) setShopId(list[0].id);
  };
  reactExports.useMemo(() => {
    loadShops();
  }, []);
  const loadSnapshots = async () => {
    const {
      data
    } = await supabase.from("profit_snapshots").select("*").order("created_at", {
      ascending: false
    });
    setSnapshots(data ?? []);
  };
  const resolveRange = () => {
    if (periodMode === "month") return monthRange(monthISO);
    return {
      from: customFrom,
      to: customTo,
      label: `${customFrom} → ${customTo}`
    };
  };
  const onGenerate = async () => {
    if (periodMode === "month" && monthStatus === "closed") {
      toast.error("This month is closed. Open Monthly Closing History to view it.");
      return;
    }
    setGenerating(true);
    try {
      const r = resolveRange();
      const data = await computeReport({
        scope,
        shopId: scope === "shop" ? shopId : null,
        from: r.from,
        to: r.to,
        periodLabel: r.label
      });
      setReport(data);
      setTab("report");
      toast.success("Report generated");
    } catch (e) {
      toast.error(e?.message ?? "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };
  const onSaveSnapshot = async () => {
    if (!report) {
      toast.error("Generate a report first");
      return;
    }
    if (!user) {
      toast.error("Sign in required");
      return;
    }
    setSaving(true);
    try {
      const name = report.scope === "company" ? `${report.period_label} · Company` : `${report.period_label} · ${report.shops[0]?.shop_name ?? "Shop"}`;
      const {
        error
      } = await supabase.from("profit_snapshots").insert({
        name,
        period_from: report.period_from,
        period_to: report.period_to,
        scope: report.scope,
        shop_id: report.scope === "shop" ? report.shops[0]?.shop_id ?? null : null,
        shop_name: report.scope === "shop" ? report.shops[0]?.shop_name ?? null : "All Shops",
        cash_position: report.totals.cash_position,
        total_expense: report.totals.total_expense,
        net_profit: report.totals.net_profit,
        payload: report,
        created_by: user.id
      });
      if (error) throw error;
      toast.success("Snapshot saved");
      await loadSnapshots();
      qc.invalidateQueries({
        queryKey: ["profit_snapshots"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };
  const onTabChange = (v) => {
    setTab(v);
    if (v === "saved" && snapshots === null) loadSnapshots();
  };
  const performDelete = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("profit_snapshots").delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Snapshot deleted");
    setDeleteId(null);
    setSnapshots((prev) => (prev ?? []).filter((s) => s.id !== deleteId));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "h-5 w-5 text-primary" }),
          " Profit Summary"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Lightweight reporting — calculates only when you click Generate." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        periodMode === "month" && (monthStatus === "closed" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive", children: "🔒 Closed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400", children: "Open" })),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Read-only" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: onTabChange, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "report", children: "Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "saved", children: "Saved Snapshots" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "report", className: "mt-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Shop" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: scope === "company" ? "__all__" : shopId, onValueChange: (v) => {
                if (v === "__all__") setScope("company");
                else {
                  setScope("shop");
                  setShopId(v);
                }
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select shop" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__all__", children: "All Shops" }),
                  shopOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Period" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: periodMode, onValueChange: (v) => setPeriodMode(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "month", children: "Monthly" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "Custom Date Range" })
                ] })
              ] })
            ] }),
            periodMode === "month" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", className: "h-10 mt-1", value: monthISO, onChange: (e) => setMonthISO(e.target.value) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-10 mt-1", value: customFrom, onChange: (e) => setCustomFrom(e.target.value) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "h-10 mt-1", value: customTo, onChange: (e) => setCustomTo(e.target.value) })
              ] })
            ] })
          ] }),
          periodMode === "month" && monthStatus === "closed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-amber-300/60 bg-amber-50/60 p-3 text-[12px] dark:border-amber-900/60 dark:bg-amber-950/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-amber-800 dark:text-amber-300", children: "This month is closed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-amber-700/80 dark:text-amber-400/80", children: "Closed month data is not auto-loaded. View it from Monthly Closing History." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", className: "mt-2 h-9 gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/monthly-closing", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4" }),
              " Open Monthly Closing History"
            ] }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onGenerate, disabled: generating, className: "h-10 gap-1.5 flex-1 sm:flex-initial", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              " ",
              generating ? "Generating…" : "Generate Report"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSaveSnapshot, disabled: !report || saving, variant: "outline", className: "h-10 gap-1.5 flex-1 sm:flex-initial", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " ",
              saving ? "Saving…" : "Save Snapshot"
            ] }),
            report && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "h-10 gap-1.5", onClick: () => setOpenSnap({
              payload: report,
              name: `${report.period_label} · ${report.scope === "company" ? "Company" : report.shops[0]?.shop_name}`,
              created_at: (/* @__PURE__ */ new Date()).toISOString()
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
              " Print / PDF"
            ] })
          ] })
        ] }),
        !report ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-10 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "mx-auto mb-2 h-7 w-7 text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No report yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Choose a shop and period, then click Generate Report." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReportBody, { data: report })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "saved", className: "mt-3 space-y-2", children: snapshots === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : snapshots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No snapshots saved yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Generate a report and click Save Snapshot." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: snapshots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenSnap(s), className: "group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 font-display text-sm font-bold truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
            s.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
            "Saved ",
            new Date(s.created_at).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] tabular-nums text-muted-foreground", children: [
            "Net Profit: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-semibold", Number(s.net_profit) >= 0 ? "text-emerald-600" : "text-destructive"), children: SAR(Number(s.net_profit)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100", children: "Open →" })
      ] }, s.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!openSnap, onOpenChange: (o) => !o && setOpenSnap(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "bottom", className: "h-[92vh] overflow-y-auto p-0", children: openSnap && /* @__PURE__ */ jsxRuntimeExports.jsx(SnapshotDetail, { snapshot: openSnap, onDelete: openSnap.id ? () => {
      setDeleteId(openSnap.id);
      setOpenSnap(null);
    } : void 0 }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete snapshot?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This removes the saved profit summary. No transactions are affected." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: performDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function ReportBody({
  data
}) {
  const isCompany = data.scope === "company";
  const onlyShop = !isCompany ? data.shops[0] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card px-4 py-2.5 text-[12px] flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: isCompany ? "All Shops" : onlyShop?.shop_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: data.period_label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: data.shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitShopCard, { shop: s }, s.shop_id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitSummaryTotals, { income: data.totals.profit_before_expense, expense: data.totals.total_expense, profit: data.totals.net_profit }),
    isCompany ? /* @__PURE__ */ jsxRuntimeExports.jsx(SalarySection, { rows: data.shops.flatMap((s) => s.salary_rows), total: data.totals.salary_total, employeeCount: data.totals.salary_employee_count, workedDaysTotal: data.totals.salary_worked_days_total, periodDays: data.period_days }) : onlyShop && /* @__PURE__ */ jsxRuntimeExports.jsx(SalarySection, { rows: onlyShop.salary_rows, total: onlyShop.salary_total, employeeCount: onlyShop.salary_employee_count, workedDaysTotal: onlyShop.salary_worked_days_total, periodDays: data.period_days }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CompanySection, { company: data.company, shopNetProfit: data.totals.net_profit, finalProfit: data.final_business_profit })
  ] });
}
function CompanySection({
  company,
  shopNetProfit,
  finalProfit
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [hasOpened, setHasOpened] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open && !hasOpened) setHasOpened(true);
  }, [open, hasOpened]);
  const incomeTxns = reactExports.useMemo(() => hasOpened ? company.txns.filter((t) => t.type === "income") : [], [hasOpened, company.txns]);
  const expenseTxns = reactExports.useMemo(() => hasOpened ? company.txns.filter((t) => t.type === "expense") : [], [hasOpened, company.txns]);
  const netTone = company.net >= 0 ? "primary" : "negative";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapsible, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "w-full text-left p-4 transition-colors hover:bg-muted/40 active:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[18px] font-semibold leading-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4 text-primary" }),
            " Company (Head Office)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5 text-muted-foreground", "aria-hidden": true, children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Income", value: company.income, tone: "positive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Expense", value: company.expense, tone: "negative" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Net Position", value: company.net, tone: netTone })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 space-y-3", children: hasOpened && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyTxnTable, { title: "Income", txns: incomeTxns, tone: "positive", total: company.income }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyTxnTable, { title: "Expense", txns: expenseTxns, tone: "negative", total: company.expense })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("rounded-2xl p-5 border-2", finalProfit >= 0 ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5" : "border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: cn("h-4 w-4", finalProfit >= 0 ? "text-primary" : "text-destructive") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground", children: "Final Business Profit" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-2 font-display text-3xl font-bold tabular-nums", finalProfit >= 0 ? "text-primary" : "text-destructive"), children: SAR(finalProfit) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground tabular-nums", children: [
        "Shop Net Profit ",
        SAR(shopNetProfit),
        " + Company Net Profit ",
        SAR(company.net)
      ] })
    ] })
  ] });
}
function CompanyTxnTable({
  title,
  txns,
  tone,
  total
}) {
  const amountClass = tone === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border/60 overflow-hidden", children: txns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-3 py-3 text-[12px] text-muted-foreground", children: [
      "No ",
      title.toLowerCase(),
      " in this period."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Note" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right", children: "Amount" })
      ] }),
      txns.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-muted-foreground tabular-nums", children: t.date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 break-words whitespace-normal", children: t.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 break-words whitespace-normal text-muted-foreground", children: t.note || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("col-span-3 text-right tabular-nums whitespace-nowrap", amountClass), children: SAR_SMART(t.amount) })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/60 bg-muted/30 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-9", children: [
          "Total ",
          title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("col-span-3 text-right tabular-nums whitespace-nowrap", amountClass), children: SAR_SMART(total) })
      ] })
    ] }) })
  ] });
}
function SnapshotDetail({
  snapshot,
  onDelete
}) {
  const p = snapshot.payload || {};
  const shops = p.shops ?? [];
  const totals = p.totals ?? {
    total_expense: 0,
    net_profit: 0
  };
  const handlePrint = () => window.print();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          body * { visibility: hidden !important; }
          #profit-print, #profit-print * { visibility: visible !important; }
          #profit-print {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; padding: 16px !important; background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "sticky top-0 z-10 border-b bg-background px-4 py-3 no-print", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-base", children: snapshot.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 gap-1.5", onClick: handlePrint, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5" }),
          " Print / PDF"
        ] }),
        onDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 gap-1.5 text-destructive hover:bg-destructive/10", onClick: onDelete, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
          " Delete"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "profit-print", className: "mx-auto max-w-3xl px-4 py-5 text-[12.5px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-foreground/30 pb-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[22px] font-bold tracking-tight", children: "ShRiAh Group" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[15px] font-semibold", children: "Profit Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
          p.scope === "company" ? "All Shops" : shops[0]?.shop_name ?? "",
          " · ",
          p.period_label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
          "Generated ",
          new Date(snapshot.created_at).toLocaleString()
        ] })
      ] }),
      p.scope === "company" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]", children: "Per-Shop Profit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[12px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/40 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 pr-2 font-semibold", children: "Shop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Profit Before Exp." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Total Expense" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 pl-1 text-right font-semibold", children: "Net Profit" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pr-2 font-medium", children: s.shop_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.profit_before_expense) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.total_expense) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pl-1 text-right font-bold tabular-nums", children: SAR(s.net_profit) })
            ] }, s.shop_id)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-foreground/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-2 font-bold", children: "Total Company" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-1 text-right font-bold tabular-nums", children: SAR(totals.profit_before_expense) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-1 text-right font-bold tabular-nums", children: SAR(totals.total_expense) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pl-1 text-right font-bold tabular-nums", children: SAR(totals.net_profit) })
            ] })
          ] })
        ] })
      ] }) : shops[0] && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]", children: "Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Profit Before Expense", v: shops[0].profit_before_expense }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Total Income", v: shops[0].profit_before_expense, bold: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]", children: "Expenses" }),
        shops[0].expense_breakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "No expenses recorded." }) : shops[0].expense_breakdown.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: b.label, v: b.amount }, b.label)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Total Expense", v: shops[0].total_expense, bold: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-md border-2 border-foreground/40 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground", children: "Net Profit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[22px] font-bold tabular-nums", children: SAR(shops[0].net_profit) })
        ] }),
        shops[0].salary_rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]", children: "Salary Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[11px] text-muted-foreground", children: [
            "Employees: ",
            shops[0].salary_employee_count,
            " · Worked Days Total:",
            " ",
            shops[0].salary_worked_days_total,
            " · Total Salary Expense:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: SAR(shops[0].salary_total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/40 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 pr-2 font-semibold", children: "Employee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 px-1 text-right font-semibold", children: "Monthly Salary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 px-1 text-right font-semibold", children: "Worked Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1 pl-1 text-right font-semibold", children: "Calculated Salary" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              shops[0].salary_rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pr-2", children: r.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(r.monthly_salary) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: r.worked_days }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pl-1 text-right font-semibold tabular-nums", children: SAR(r.calculated_salary) })
              ] }, r.name)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-foreground/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "py-1.5 text-right font-bold", children: "Total Salary Expense" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right font-bold tabular-nums", children: SAR(shops[0].salary_total) })
              ] })
            ] })
          ] })
        ] })
      ] }),
      p.company && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]", children: "Company (Head Office)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Total Shop Profit", v: totals.net_profit ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Company Income", v: p.company.income }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Company Expense", v: p.company.expense }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PrintRow, { label: "Company Net Profit", v: p.company.net, bold: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border-2 border-foreground/50 p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground", children: "Final Business Profit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[22px] font-bold tabular-nums", children: SAR(p.final_business_profit ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "Total Shop Net Profit + Company Net Profit" })
        ] })
      ] })
    ] })
  ] });
}
function PrintRow({
  label,
  v,
  bold
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center justify-between border-b border-foreground/10 py-1", bold && "border-foreground/40 font-bold"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(v) })
  ] });
}
function SalarySection({
  rows,
  total,
  employeeCount,
  workedDaysTotal,
  periodDays
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Collapsible, { defaultOpen: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleTrigger, { className: "flex w-full items-center justify-between px-4 py-3 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
        " Salary Summary"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 px-4 py-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryStat, { label: "Total Employees", value: String(employeeCount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryStat, { label: "Worked Days", value: String(workedDaysTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SalaryStat, { label: "Salary Expense", value: SAR(total), accent: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10.5px] text-muted-foreground", children: [
        "Daily Salary = Monthly Salary ÷ 30 · Period = ",
        periodDays,
        " day",
        periodDays === 1 ? "" : "s",
        ". Calculated from the Employee Profile salary; ledger balances are excluded."
      ] }),
      rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-3 text-center text-xs text-muted-foreground", children: "No employees configured for this scope." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 text-left text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 font-medium", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 text-right font-medium", children: "Monthly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 text-right font-medium", children: "Days" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 text-right font-medium", children: "Salary" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right tabular-nums", children: SAR(r.monthly_salary) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right tabular-nums", children: r.worked_days }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-right tabular-nums font-semibold", children: SAR(r.calculated_salary) })
          ] }, `${r.name}-${i}`)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "py-2 text-right font-semibold", children: "Total Salary Expense" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-bold tabular-nums", children: SAR(total) })
          ] })
        ] })
      ] })
    ] }) })
  ] }) });
}
function SalaryStat({
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border px-2.5 py-2", accent ? "border-primary/30 bg-primary/5" : "border-border/60"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-0.5 text-[13px] font-bold tabular-nums", accent && "text-primary"), children: value })
  ] });
}
const SAR_SMART = (n) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  const num = v || 0;
  const hasDecimal = Math.abs(num - Math.round(num)) > 49e-4;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0
  }).format(num);
};
const psToneClass = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  primary: "text-primary"
};
function PSStatBlock({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 font-bold tabular-nums whitespace-nowrap leading-tight text-[clamp(13px,4vw,17px)]", psToneClass[tone]), children: SAR_SMART(value) })
  ] });
}
function PSStatButton({
  label,
  value,
  tone,
  active,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("min-w-0 text-left rounded-lg px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-muted/70 ring-1 ring-border" : "hover:bg-muted/40 active:bg-muted/60"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[12px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("h-3 w-3 shrink-0 transition-transform", active && "rotate-180") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 font-bold tabular-nums whitespace-nowrap leading-tight text-[clamp(13px,4vw,17px)]", psToneClass[tone]), children: SAR_SMART(value) })
  ] });
}
function FormulaLine({
  label,
  value,
  op,
  total
}) {
  const display = op === "-" ? -Math.abs(value) : value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px]", total ? "bg-muted/40 font-semibold border-t border-border/60" : "border-t border-border/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 text-muted-foreground tabular-nums text-center", children: total ? "=" : op ?? "+" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-7 break-words", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("col-span-4 text-right tabular-nums whitespace-nowrap", !total && (op === "-" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")), children: SAR_SMART(display) })
  ] });
}
function ProfitShopCard({
  shop
}) {
  const [view, setView] = reactExports.useState(null);
  const [hasOpened, setHasOpened] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (view !== null && !hasOpened) setHasOpened(true);
  }, [view, hasOpened]);
  const income = shop.profit_before_expense;
  const expense = shop.total_expense;
  const profit = shop.net_profit;
  const toggle = (v) => setView((prev) => prev === v ? null : v);
  const open = view !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[18px] font-semibold leading-tight", children: shop.shop_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5 text-muted-foreground", "aria-hidden": true, children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatButton, { label: "Income", value: income, tone: "positive", active: view === "income", onClick: () => toggle("income") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatButton, { label: "Expense", value: expense, tone: "negative", active: view === "expense", onClick: () => toggle("expense") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatButton, { label: "Profit", value: profit, tone: profit >= 0 ? "primary" : "negative", active: view === "profit", onClick: () => toggle("profit") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Collapsible, { open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: hasOpened && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      view === "income" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40", children: "Income Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Cash Sale", value: shop.cash_sale, op: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Bank Withdraw", value: shop.bank_withdraw, op: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Total Purchase", value: shop.total_purchase, op: "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Shop Income", value: income, total: true })
      ] }),
      view === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border/60 overflow-hidden", children: shop.expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-3 text-[12px] text-muted-foreground", children: "No expenses in this period." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5", children: "Note" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right", children: "Amount" })
        ] }),
        shop.expenses.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4 text-muted-foreground tabular-nums", children: e.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5 break-words whitespace-normal", children: e.note }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right tabular-nums whitespace-nowrap text-rose-600 dark:text-rose-400", children: SAR_SMART(e.amount) })
        ] }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/60 bg-muted/30 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-9", children: "Total Shop Expense" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3 text-right tabular-nums whitespace-nowrap text-rose-600 dark:text-rose-400", children: SAR_SMART(expense) })
        ] })
      ] }) }),
      view === "profit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40", children: "Profit Calculation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Income", value: income, op: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Expense", value: expense, op: "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { label: "Net Profit", value: profit, total: true })
      ] })
    ] }) }) }) })
  ] });
}
function ProfitSummaryTotals({
  income,
  expense,
  profit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-3", children: "Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Total Income", value: income, tone: "positive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Total Expense", value: expense, tone: "negative" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PSStatBlock, { label: "Net Profit", value: profit, tone: profit >= 0 ? "primary" : "negative" })
    ] })
  ] });
}
export {
  ProfitSummaryPage as component
};
