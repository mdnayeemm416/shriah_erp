import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SAR } from "@/lib/format";
import { sortShops } from "@/lib/shop-order";
import {
  CalendarRange, ChevronDown, ChevronUp, FileBarChart, Plus, Printer,
  Trash2, Wallet, Users, Sparkles, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/profit-summary")({
  component: ProfitSummaryPage,
});

// ============================================================
// Types
// ============================================================

type ShopRow = { id: string; name: string; shop_type: string };

type SalaryRow = {
  name: string;
  monthly_salary: number;
  worked_days: number;
  calculated_salary: number;
};

type ExpenseRow = { date: string; note: string; amount: number };

type ShopProfit = {
  shop_id: string;
  shop_name: string;
  cash_position: number;
  profit_before_expense: number;
  total_expense: number;
  net_profit: number;
  cash_sale: number;
  bank_withdraw: number;
  total_purchase: number;
  plus_minus: number;
  expense_breakdown: { label: string; amount: number }[];
  expenses: ExpenseRow[];
  salary_rows: SalaryRow[];
  salary_total: number;
  salary_employee_count: number;
  salary_worked_days_total: number;
};

type CompanyTxn = { date: string; type: "income" | "expense"; category: string; note: string; amount: number };

type CompanyTotals = {
  income: number;
  expense: number;
  net: number;
  income_breakdown: { label: string; amount: number }[];
  expense_breakdown: { label: string; amount: number }[];
  txns: CompanyTxn[];
};

type ReportData = {
  scope: "shop" | "company";
  period_from: string;
  period_to: string;
  period_label: string;
  period_days: number;
  shops: ShopProfit[];
  totals: {
    cash_position: number;
    profit_before_expense: number;
    total_expense: number;
    net_profit: number;
    salary_total: number;
    salary_employee_count: number;
    salary_worked_days_total: number;
  };
  company: CompanyTotals;
  final_business_profit: number;
};


// ============================================================
// Date helpers
// ============================================================

function pad(n: number) { return String(n).padStart(2, "0"); }
function toISO(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function monthRange(monthISO: string): { from: string; to: string; label: string } {
  // monthISO = "YYYY-MM"
  const [y, m] = monthISO.split("-").map(Number);
  const first = new Date(y, (m || 1) - 1, 1);
  const last = new Date(y, (m || 1), 0);
  const label = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return { from: toISO(first), to: toISO(last), label };
}

// ============================================================
// Expense label — always use the user-written Note text as-is.
// The Expense Category name is intentionally ignored everywhere
// (Profit Summary, Summary Report, PDF/Excel/Share exports).
// Fallback to "Other Expense" only when the Note is empty.
// ============================================================

function bucketExpense(note: string | null | undefined): string {
  const n = (note ?? "").trim();
  return n.length > 0 ? n : "Other Expense";
}

// ============================================================
// Core compute — runs only when user clicks Generate Report
// ============================================================

async function computeReport(opts: {
  scope: "shop" | "company";
  shopId?: string | null;
  from: string;
  to: string;
  periodLabel: string;
}): Promise<ReportData> {
  const { from, to } = opts;

  // 1. Fetch shops + shop_entries + employee data — scoped to the period.
  const shopsRes = await supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false);
  const allShops = sortShops((shopsRes.data ?? []) as any[]) as ShopRow[];
  const targetShops: ShopRow[] = opts.scope === "company"
    ? allShops
    : allShops.filter((s) => s.id === opts.shopId);

  // Period day count — inclusive. "Auto = full period days" per product spec.
  const fromDate = new Date(from + "T00:00:00");
  const toDate = new Date(to + "T00:00:00");
  const period_days = Math.max(
    1,
    Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1,
  );

  const emptyTotals = {
    cash_position: 0, profit_before_expense: 0, total_expense: 0, net_profit: 0,
    salary_total: 0, salary_employee_count: 0, salary_worked_days_total: 0,
  };

  // Company-level transactions (head office) — independent of any shop.
  // Included for ALL scopes so Final Business Profit can be displayed.
  const companyRes = await (supabase as any)
    .from("company_transactions")
    .select("txn_date,txn_type,category,amount,notes")
    .eq("is_deleted", false)
    .gte("txn_date", from).lte("txn_date", to)
    .order("txn_date", { ascending: false });
  const companyRows = (companyRes.data ?? []) as any[];
  const incomeBuckets = new Map<string, number>();
  const expenseBuckets = new Map<string, number>();
  const companyTxns: CompanyTxn[] = [];
  let companyIncome = 0, companyExpense = 0;
  for (const r of companyRows) {
    const amt = Number(r.amount || 0);
    if (amt <= 0) continue;
    const note = (r.notes && String(r.notes).trim()) || "";
    const label = note || r.category || "Other";
    companyTxns.push({
      date: String(r.txn_date ?? "").slice(0, 10),
      type: r.txn_type,
      category: r.category || "Other",
      note,
      amount: amt,
    });
    if (r.txn_type === "income") {
      companyIncome += amt;
      incomeBuckets.set(label, (incomeBuckets.get(label) ?? 0) + amt);
    } else if (r.txn_type === "expense") {
      companyExpense += amt;
      expenseBuckets.set(label, (expenseBuckets.get(label) ?? 0) + amt);
    }
  }
  const company: CompanyTotals = {
    income: companyIncome,
    expense: companyExpense,
    net: companyIncome - companyExpense,
    income_breakdown: Array.from(incomeBuckets.entries())
      .map(([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount),
    expense_breakdown: Array.from(expenseBuckets.entries())
      .map(([label, amount]) => ({ label, amount })).sort((a, b) => b.amount - a.amount),
    txns: companyTxns,
  };

  if (!targetShops.length) {
    return {
      scope: opts.scope, period_from: from, period_to: to,
      period_label: opts.periodLabel, period_days,
      shops: [], totals: emptyTotals,
      company, final_business_profit: company.net,
    };
  }


  const targetIds = targetShops.map((s) => s.id);

  const [entriesRes, employeesRes] = await Promise.all([
    supabase
      .from("shop_entries").select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount,difference,notes,txn_date")
      .eq("is_deleted", false).in("shop_id", targetIds)
      .gte("txn_date", from).lte("txn_date", to),
    supabase
      .from("employees").select("id,name,shop_id,monthly_salary")
      .eq("is_deleted", false).in("shop_id", targetIds),
  ]);

  const entries = (entriesRes.data ?? []) as any[];
  const employees = (employeesRes.data ?? []) as any[];

  // 2. Per-shop totals using the SAME formula as useShopPositions.
  const shopProfits: ShopProfit[] = targetShops.map((s) => {
    const rows = entries.filter((e) => e.shop_id === s.id);
    const isSimple = s.shop_type === "simple_cash";

    let cashSale = 0, withdraw = 0, purchase = 0, expense = 0, plusMinus = 0;
    let simpleCashIn = 0, simpleExpense = 0;
    const buckets = new Map<string, number>();
    const expenses: ExpenseRow[] = [];

    for (const e of rows) {
      cashSale += Number(e.cash_sale || 0);
      withdraw += Number(e.withdraw_amount || 0);
      purchase += Number(e.purchase_amount || 0);
      expense  += Number(e.expense_amount || 0);
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
          expenses.push({ date: String(e.txn_date ?? "").slice(0, 10), note: k, amount: amt });
        }
      }
    }

    expenses.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const cash_position = isSimple
      ? simpleCashIn - simpleExpense
      : (cashSale + withdraw) - (purchase + expense);
    const total_expense = isSimple ? simpleExpense : expense;
    const profit_before_expense = cash_position + total_expense;
    const net_profit = profit_before_expense - total_expense;

    const expense_breakdown = Array.from(buckets.entries())
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Per-shop salary detail — computed from Employee Profile salary +
    // attendance worked days. "Auto = full period days" mode: every
    // employee gets the period day count as Worked Days.
    const shopEmps = employees.filter((emp) => emp.shop_id === s.id);
    const salary_rows: SalaryRow[] = shopEmps.map((emp) => {
      const monthly_salary = Number(emp.monthly_salary || 0);
      const worked_days = period_days;
      const calculated_salary = (monthly_salary / 30) * worked_days;
      return { name: emp.name, monthly_salary, worked_days, calculated_salary };
    });
    const salary_total = salary_rows.reduce((sum, r) => sum + r.calculated_salary, 0);
    const salary_worked_days_total = salary_rows.reduce((sum, r) => sum + r.worked_days, 0);

    return {
      shop_id: s.id, shop_name: s.name,
      cash_position, profit_before_expense, total_expense, net_profit,
      cash_sale: isSimple ? simpleCashIn : cashSale,
      bank_withdraw: isSimple ? 0 : withdraw,
      total_purchase: isSimple ? 0 : purchase,
      plus_minus: isSimple ? 0 : plusMinus,
      expense_breakdown, expenses,
      salary_rows, salary_total,
      salary_employee_count: salary_rows.length,
      salary_worked_days_total,
    };
  });

  const totals = shopProfits.reduce(
    (acc, s) => ({
      cash_position:             acc.cash_position             + s.cash_position,
      profit_before_expense:     acc.profit_before_expense     + s.profit_before_expense,
      total_expense:             acc.total_expense             + s.total_expense,
      net_profit:                acc.net_profit                + s.net_profit,
      salary_total:              acc.salary_total              + s.salary_total,
      salary_employee_count:     acc.salary_employee_count     + s.salary_employee_count,
      salary_worked_days_total:  acc.salary_worked_days_total  + s.salary_worked_days_total,
    }),
    { ...emptyTotals },
  );


  return {
    scope: opts.scope, period_from: from, period_to: to,
    period_label: opts.periodLabel, period_days,
    shops: shopProfits, totals,
    company,
    final_business_profit: totals.net_profit + company.net,
  };
}

// ============================================================
// Page
// ============================================================

function ProfitSummaryPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { workingDate } = useWorkingDate();

  // Filter state
  const [scope, setScope] = useState<"shop" | "company">("company");
  const [shopId, setShopId] = useState<string>("");
  const [periodMode, setPeriodMode] = useState<"month" | "custom">("month");

  const [wy, wm] = workingDate.split("-");
  const [monthISO, setMonthISO] = useState<string>(`${wy}-${wm}`);

  const [customFrom, setCustomFrom] = useState<string>(workingDate);
  const [customTo, setCustomTo] = useState<string>(workingDate);

  // Generated report (only set after click)
  const [report, setReport] = useState<ReportData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Snapshots
  const [snapshots, setSnapshots] = useState<any[] | null>(null);
  const [openSnap, setOpenSnap] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<"report" | "saved">("report");
  const [monthStatus, setMonthStatus] = useState<"open" | "closed">("open");

  useEffect(() => {
    (async () => {
      if (periodMode !== "month") { setMonthStatus("open"); return; }
      const monthKey = `${monthISO}-01`;
      const { data } = await (supabase as any)
        .from("monthly_closings").select("status").eq("month", monthKey).maybeSingle();
      const status = data?.status === "closed" ? "closed" : "open";
      setMonthStatus(status);
      // Clear any stale report when switching to a closed month so closed
      // data isn't shown without an explicit user action.
      if (status === "closed") setReport(null);
    })();
  }, [periodMode, monthISO]);

  // Shops for filter dropdown
  const [shopOptions, setShopOptions] = useState<ShopRow[]>([]);

  const loadShops = async () => {
    if (shopOptions.length) return;
    const { data } = await supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false);
    const list = sortShops((data ?? []) as any[]) as ShopRow[];
    setShopOptions(list);
    if (!shopId && list.length) setShopId(list[0].id);
  };

  useMemo(() => { loadShops(); /* eslint-disable-next-line */ }, []);

  const loadSnapshots = async () => {
    const { data } = await supabase
      .from("profit_snapshots" as any).select("*")
      .order("created_at", { ascending: false });
    setSnapshots((data ?? []) as any[]);
  };

  const resolveRange = () => {
    if (periodMode === "month") return monthRange(monthISO);
    return { from: customFrom, to: customTo, label: `${customFrom} → ${customTo}` };
  };

  const onGenerate = async () => {
    // Closed months must not auto-load. Push the user to Monthly Closing History
    // where the closed snapshot lives.
    if (periodMode === "month" && monthStatus === "closed") {
      toast.error("This month is closed. Open Monthly Closing History to view it.");
      return;
    }
    setGenerating(true);
    try {
      const r = resolveRange();
      const data = await computeReport({
        scope, shopId: scope === "shop" ? shopId : null,
        from: r.from, to: r.to, periodLabel: r.label,
      });
      setReport(data);
      setTab("report");
      toast.success("Report generated");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const onSaveSnapshot = async () => {
    if (!report) { toast.error("Generate a report first"); return; }
    if (!user) { toast.error("Sign in required"); return; }
    setSaving(true);
    try {
      const name = report.scope === "company"
        ? `${report.period_label} · Company`
        : `${report.period_label} · ${report.shops[0]?.shop_name ?? "Shop"}`;
      const { error } = await (supabase as any).from("profit_snapshots").insert({
        name,
        period_from: report.period_from,
        period_to: report.period_to,
        scope: report.scope,
        shop_id: report.scope === "shop" ? (report.shops[0]?.shop_id ?? null) : null,
        shop_name: report.scope === "shop" ? (report.shops[0]?.shop_name ?? null) : "All Shops",
        cash_position: report.totals.cash_position,
        total_expense: report.totals.total_expense,
        net_profit: report.totals.net_profit,
        payload: report,
        created_by: user.id,
      });
      if (error) throw error;
      toast.success("Snapshot saved");
      await loadSnapshots();
      qc.invalidateQueries({ queryKey: ["profit_snapshots"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onTabChange = (v: string) => {
    setTab(v as any);
    if (v === "saved" && snapshots === null) loadSnapshots();
  };

  const performDelete = async () => {
    if (!deleteId) return;
    const { error } = await (supabase as any).from("profit_snapshots").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Snapshot deleted");
    setDeleteId(null);
    setSnapshots((prev) => (prev ?? []).filter((s) => s.id !== deleteId));
  };

  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-primary" /> Profit Summary
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Lightweight reporting — calculates only when you click Generate.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {periodMode === "month" && (
            monthStatus === "closed" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                🔒 Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Open
              </span>
            )
          )}
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Read-only
          </span>
        </div>
      </div>


      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="saved">Saved Snapshots</TabsTrigger>
        </TabsList>

        {/* ============ REPORT TAB ============ */}
        <TabsContent value="report" className="mt-3 space-y-3">
          {/* Filter section */}
          <Card className="rounded-2xl p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shop</Label>
                <Select
                  value={scope === "company" ? "__all__" : shopId}
                  onValueChange={(v) => {
                    if (v === "__all__") setScope("company");
                    else { setScope("shop"); setShopId(v); }
                  }}
                >
                  <SelectTrigger className="h-10 mt-1"><SelectValue placeholder="Select shop" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Shops</SelectItem>
                    {shopOptions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Period</Label>
                <Select value={periodMode} onValueChange={(v) => setPeriodMode(v as any)}>
                  <SelectTrigger className="h-10 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="custom">Custom Date Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {periodMode === "month" ? (
                <div className="sm:col-span-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Month</Label>
                  <Input type="month" className="h-10 mt-1" value={monthISO} onChange={(e) => setMonthISO(e.target.value)} />
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</Label>
                    <Input type="date" className="h-10 mt-1" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">To</Label>
                    <Input type="date" className="h-10 mt-1" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                  </div>
                </>
              )}
            </div>

            {periodMode === "month" && monthStatus === "closed" ? (
              <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50/60 p-3 text-[12px] dark:border-amber-900/60 dark:bg-amber-950/30">
                <p className="font-semibold text-amber-800 dark:text-amber-300">This month is closed.</p>
                <p className="mt-0.5 text-amber-700/80 dark:text-amber-400/80">
                  Closed month data is not auto-loaded. View it from Monthly Closing History.
                </p>
                <Button asChild size="sm" className="mt-2 h-9 gap-1.5">
                  <Link to="/monthly-closing">
                    <CalendarRange className="h-4 w-4" /> Open Monthly Closing History
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={onGenerate} disabled={generating} className="h-10 gap-1.5 flex-1 sm:flex-initial">
                  <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate Report"}
                </Button>
                <Button
                  onClick={onSaveSnapshot}
                  disabled={!report || saving}
                  variant="outline"
                  className="h-10 gap-1.5 flex-1 sm:flex-initial"
                >
                  <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Save Snapshot"}
                </Button>
                {report && (
                  <Button variant="ghost" className="h-10 gap-1.5" onClick={() => setOpenSnap({ payload: report, name: `${report.period_label} · ${report.scope === "company" ? "Company" : report.shops[0]?.shop_name}`, created_at: new Date().toISOString() })}>
                    <Printer className="h-4 w-4" /> Print / PDF
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Report body */}
          {!report ? (
            <Card className="rounded-2xl p-10 text-center">
              <FileBarChart className="mx-auto mb-2 h-7 w-7 text-muted-foreground/50" />
              <p className="text-sm font-medium">No report yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Choose a shop and period, then click Generate Report.</p>
            </Card>
          ) : (
            <ReportBody data={report} />
          )}
        </TabsContent>

        {/* ============ SAVED SNAPSHOTS TAB ============ */}
        <TabsContent value="saved" className="mt-3 space-y-2">
          {snapshots === null ? (
            <Card className="rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading…</Card>
          ) : snapshots.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center">
              <CalendarRange className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
              <p className="text-sm font-medium">No snapshots saved yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Generate a report and click Save Snapshot.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {snapshots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setOpenSnap(s)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-display text-sm font-bold truncate">
                      <CalendarRange className="h-4 w-4 text-muted-foreground shrink-0" />
                      {s.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Saved {new Date(s.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                      Net Profit: <span className={cn("font-semibold", Number(s.net_profit) >= 0 ? "text-emerald-600" : "text-destructive")}>
                        {SAR(Number(s.net_profit))}
                      </span>
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100">
                    Open →
                  </span>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Snapshot detail / print sheet */}
      <Sheet open={!!openSnap} onOpenChange={(o) => !o && setOpenSnap(null)}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto p-0">
          {openSnap && (
            <SnapshotDetail
              snapshot={openSnap}
              onDelete={openSnap.id ? () => { setDeleteId(openSnap.id); setOpenSnap(null); } : undefined}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete snapshot?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the saved profit summary. No transactions are affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================
// Report body (live, on-screen)
// ============================================================

function ReportBody({ data }: { data: ReportData }) {
  const isCompany = data.scope === "company";
  const onlyShop = !isCompany ? data.shops[0] : null;

  return (
    <div className="space-y-3">
      {/* Title strip */}
      <div className="rounded-2xl border border-border/60 bg-card px-4 py-2.5 text-[12px] flex items-center justify-between">
        <span className="font-semibold">{isCompany ? "All Shops" : onlyShop?.shop_name}</span>
        <span className="text-muted-foreground">{data.period_label}</span>
      </div>

      {/* Shop cards (Owner Monthly Report style) */}
      <div className="space-y-3">
        {data.shops.map((s) => (
          <ProfitShopCard key={s.shop_id} shop={s} />
        ))}
      </div>

      {/* Summary section: Total Income / Total Expense / Net Profit */}
      <ProfitSummaryTotals
        income={data.totals.profit_before_expense}
        expense={data.totals.total_expense}
        profit={data.totals.net_profit}
      />

      {isCompany ? (
        <SalarySection
          rows={data.shops.flatMap((s) => s.salary_rows)}
          total={data.totals.salary_total}
          employeeCount={data.totals.salary_employee_count}
          workedDaysTotal={data.totals.salary_worked_days_total}
          periodDays={data.period_days}
        />
      ) : onlyShop && (
        <SalarySection
          rows={onlyShop.salary_rows}
          total={onlyShop.salary_total}
          employeeCount={onlyShop.salary_employee_count}
          workedDaysTotal={onlyShop.salary_worked_days_total}
          periodDays={data.period_days}
        />
      )}

      {/* ============================================================
          COMPANY TRANSACTIONS (Head Office) — shown for every scope.
          Shop calculations above are untouched.
          ============================================================ */}
      <CompanySection
        company={data.company}
        shopNetProfit={data.totals.net_profit}
        finalProfit={data.final_business_profit}
      />
    </div>
  );
}

function CompanySection({
  company, shopNetProfit, finalProfit,
}: { company: CompanyTotals; shopNetProfit: number; finalProfit: number }) {
  const [open, setOpen] = useState(false);
  // Lazy mount: don't build the income/expense tables until first expand.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (open && !hasOpened) setHasOpened(true); }, [open, hasOpened]);
  const incomeTxns = useMemo(() => hasOpened ? company.txns.filter((t) => t.type === "income") : [], [hasOpened, company.txns]);
  const expenseTxns = useMemo(() => hasOpened ? company.txns.filter((t) => t.type === "expense") : [], [hasOpened, company.txns]);
  const netTone: PSTone = company.net >= 0 ? "primary" : "negative";
  return (
    <>
      <Card className="rounded-xl overflow-hidden">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full text-left p-4 transition-colors hover:bg-muted/40 active:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-[18px] font-semibold leading-tight">
                  <Building2 className="h-4 w-4 text-primary" /> Company (Head Office)
                </div>
                <span className="shrink-0 mt-0.5 text-muted-foreground" aria-hidden>
                  {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <PSStatBlock label="Income" value={company.income} tone="positive" />
                <PSStatBlock label="Expense" value={company.expense} tone="negative" />
                <PSStatBlock label="Net Position" value={company.net} tone={netTone} />
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="px-4 pb-4 space-y-3">
              {hasOpened && (
                <>
                  <CompanyTxnTable title="Income" txns={incomeTxns} tone="positive" total={company.income} />
                  <CompanyTxnTable title="Expense" txns={expenseTxns} tone="negative" total={company.expense} />
                </>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Final business profit = Shop net profit + Company net profit */}
      <Card className={cn(
        "rounded-2xl p-5 border-2",
        finalProfit >= 0
          ? "border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5"
          : "border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5",
      )}>
        <div className="flex items-center gap-2">
          <Wallet className={cn("h-4 w-4", finalProfit >= 0 ? "text-primary" : "text-destructive")} />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Final Business Profit</p>
        </div>
        <p className={cn("mt-2 font-display text-3xl font-bold tabular-nums",
          finalProfit >= 0 ? "text-primary" : "text-destructive")}>
          {SAR(finalProfit)}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
          Shop Net Profit {SAR(shopNetProfit)} + Company Net Profit {SAR(company.net)}
        </p>
      </Card>
    </>
  );
}

function CompanyTxnTable({
  title, txns, tone, total,
}: { title: string; txns: CompanyTxn[]; tone: "positive" | "negative"; total: number }) {
  const amountClass = tone === "positive"
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
  return (
    <div>
      <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        {txns.length === 0 ? (
          <p className="px-3 py-3 text-[12px] text-muted-foreground">No {title.toLowerCase()} in this period.</p>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
              <div className="col-span-3">Date</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Note</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>
            {txns.map((t, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/40">
                <div className="col-span-3 text-muted-foreground tabular-nums">{t.date}</div>
                <div className="col-span-3 break-words whitespace-normal">{t.category}</div>
                <div className="col-span-3 break-words whitespace-normal text-muted-foreground">{t.note || "—"}</div>
                <div className={cn("col-span-3 text-right tabular-nums whitespace-nowrap", amountClass)}>
                  {SAR_SMART(t.amount)}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/60 bg-muted/30 font-semibold">
              <div className="col-span-9">Total {title}</div>
              <div className={cn("col-span-3 text-right tabular-nums whitespace-nowrap", amountClass)}>
                {SAR_SMART(total)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Shared bits
// ============================================================

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
    </div>
  );
}

function RowLine({ label, value, strong, tone }: { label: string; value: number; strong?: boolean; tone?: "danger" }) {
  return (
    <div className={cn("flex items-center justify-between py-1.5 text-[13px]", strong && "font-semibold")}>
      <span className={cn(strong && "uppercase tracking-wider text-[11px] font-bold")}>{label}</span>
      <span className={cn("tabular-nums", tone === "danger" && "text-destructive")}>{SAR(value)}</span>
    </div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-border/60" />;
}

void NetProfitCard;
function NetProfitCard({
  before, expense, profit, label = "NET PROFIT",
}: { before: number; expense: number; profit: number; label?: string }) {
  const positive = profit >= 0;
  return (
    <Card className={cn(
      "rounded-2xl p-5 border-2",
      positive ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"
               : "border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5",
    )}>
      <div className="flex items-center gap-2">
        <Wallet className={cn("h-4 w-4", positive ? "text-emerald-600" : "text-destructive")} />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      </div>
      <p className={cn("mt-2 font-display text-3xl font-bold tabular-nums", positive ? "text-emerald-600" : "text-destructive")}>
        {SAR(profit)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
        Profit Before Expense {SAR(before)} − Total Expense {SAR(expense)}
      </p>
    </Card>
  );
}




// ============================================================
// Printable detail view
// ============================================================

function SnapshotDetail({ snapshot, onDelete }: { snapshot: any; onDelete?: () => void }) {
  const p: ReportData = snapshot.payload || {};
  const shops = p.shops ?? [];
  const totals = p.totals ?? { cash_position: 0, total_expense: 0, net_profit: 0 };

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
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
      `}</style>

      <SheetHeader className="sticky top-0 z-10 border-b bg-background px-4 py-3 no-print">
        <div className="flex items-center justify-between gap-2">
          <SheetTitle className="text-base">{snapshot.name}</SheetTitle>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </Button>
            {onDelete && (
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive hover:bg-destructive/10" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        </div>
      </SheetHeader>

      <div id="profit-print" className="mx-auto max-w-3xl px-4 py-5 text-[12.5px]">
        {/* Header */}
        <div className="border-b border-foreground/30 pb-3 text-center">
          <p className="text-[22px] font-bold tracking-tight">ShRiAh Group</p>
          <p className="mt-1 text-[15px] font-semibold">Profit Summary</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {p.scope === "company" ? "All Shops" : shops[0]?.shop_name ?? ""} · {p.period_label}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Generated {new Date(snapshot.created_at).toLocaleString()}
          </p>
        </div>

        {p.scope === "company" ? (
          <>
            <h3 className="mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">Per-Shop Profit</h3>
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-foreground/40 text-left">
                  <th className="py-1.5 pr-2 font-semibold">Shop</th>
                  <th className="py-1.5 px-1 text-right font-semibold">Profit Before Exp.</th>
                  <th className="py-1.5 px-1 text-right font-semibold">Total Expense</th>
                  <th className="py-1.5 pl-1 text-right font-semibold">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((s) => (
                  <tr key={s.shop_id} className="border-b border-foreground/10">
                    <td className="py-1 pr-2 font-medium">{s.shop_name}</td>
                    <td className="py-1 px-1 text-right tabular-nums">{SAR(s.profit_before_expense)}</td>
                    <td className="py-1 px-1 text-right tabular-nums">{SAR(s.total_expense)}</td>
                    <td className="py-1 pl-1 text-right font-bold tabular-nums">{SAR(s.net_profit)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-foreground/60">
                  <td className="py-2 pr-2 font-bold">Total Company</td>
                  <td className="py-2 px-1 text-right font-bold tabular-nums">{SAR(totals.profit_before_expense)}</td>
                  <td className="py-2 px-1 text-right font-bold tabular-nums">{SAR(totals.total_expense)}</td>
                  <td className="py-2 pl-1 text-right font-bold tabular-nums">{SAR(totals.net_profit)}</td>
                </tr>
              </tbody>
            </table>

          </>
        ) : shops[0] && (
          <>
            <h3 className="mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">Income</h3>
            <PrintRow label="Profit Before Expense" v={shops[0].profit_before_expense} />
            <PrintRow label="Total Income" v={shops[0].profit_before_expense} bold />


            <h3 className="mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">Expenses</h3>
            {shops[0].expense_breakdown.length === 0
              ? <p className="text-[11px] text-muted-foreground">No expenses recorded.</p>
              : shops[0].expense_breakdown.map((b) => <PrintRow key={b.label} label={b.label} v={b.amount} />)
            }
            <PrintRow label="Total Expense" v={shops[0].total_expense} bold />

            <div className="mt-5 rounded-md border-2 border-foreground/40 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Net Profit</p>
              <p className="mt-1 text-[22px] font-bold tabular-nums">{SAR(shops[0].net_profit)}</p>
            </div>

            {shops[0].salary_rows.length > 0 && (
              <>
                <h3 className="mt-5 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">
                  Salary Summary
                </h3>
                <p className="mb-2 text-[11px] text-muted-foreground">
                  Employees: {shops[0].salary_employee_count} · Worked Days Total:{" "}
                  {shops[0].salary_worked_days_total} · Total Salary Expense:{" "}
                  <span className="font-semibold">{SAR(shops[0].salary_total)}</span>
                </p>
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-foreground/40 text-left">
                      <th className="py-1 pr-2 font-semibold">Employee</th>
                      <th className="py-1 px-1 text-right font-semibold">Monthly Salary</th>
                      <th className="py-1 px-1 text-right font-semibold">Worked Days</th>
                      <th className="py-1 pl-1 text-right font-semibold">Calculated Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops[0].salary_rows.map((r) => (
                      <tr key={r.name} className="border-b border-foreground/10">
                        <td className="py-1 pr-2">{r.name}</td>
                        <td className="py-1 px-1 text-right tabular-nums">{SAR(r.monthly_salary)}</td>
                        <td className="py-1 px-1 text-right tabular-nums">{r.worked_days}</td>
                        <td className="py-1 pl-1 text-right font-semibold tabular-nums">{SAR(r.calculated_salary)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-foreground/60">
                      <td colSpan={3} className="py-1.5 text-right font-bold">Total Salary Expense</td>
                      <td className="py-1.5 text-right font-bold tabular-nums">{SAR(shops[0].salary_total)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </>
        )}

        {/* Company (Head Office) summary + Final Business Profit */}
        {p.company && (
          <>
            <h3 className="mt-6 mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">Company (Head Office)</h3>
            <PrintRow label="Total Shop Profit" v={totals.net_profit ?? 0} />
            <PrintRow label="Company Income" v={p.company.income} />
            <PrintRow label="Company Expense" v={p.company.expense} />
            <PrintRow label="Company Net Profit" v={p.company.net} bold />

            <div className="mt-4 rounded-md border-2 border-foreground/50 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Final Business Profit</p>
              <p className="mt-1 text-[22px] font-bold tabular-nums">{SAR(p.final_business_profit ?? 0)}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Total Shop Net Profit + Company Net Profit
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function PrintRow({ label, v, bold }: { label: string; v: number; bold?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-foreground/10 py-1", bold && "border-foreground/40 font-bold")}>
      <span>{label}</span>
      <span className="tabular-nums">{SAR(v)}</span>
    </div>
  );
}

// ============================================================
// Salary section — Employee Profile salary × attendance worked days.
// Ledger balances are intentionally excluded; advances/dues live in the
// Employee Ledger only.
// ============================================================

function SalarySection({
  rows, total, employeeCount, workedDaysTotal, periodDays,
}: {
  rows: SalaryRow[];
  total: number;
  employeeCount: number;
  workedDaysTotal: number;
  periodDays: number;
}) {
  return (
    <Collapsible defaultOpen>
      <Card className="rounded-2xl">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-muted-foreground" /> Salary Summary
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/60 px-4 py-3 space-y-3">
            {/* Summary chips */}
            <div className="grid grid-cols-3 gap-2">
              <SalaryStat label="Total Employees" value={String(employeeCount)} />
              <SalaryStat label="Worked Days" value={String(workedDaysTotal)} />
              <SalaryStat label="Salary Expense" value={SAR(total)} accent />
            </div>
            <p className="text-[10.5px] text-muted-foreground">
              Daily Salary = Monthly Salary ÷ 30 · Period = {periodDays} day{periodDays === 1 ? "" : "s"}.
              Calculated from the Employee Profile salary; ledger balances are excluded.
            </p>

            {rows.length === 0 ? (
              <p className="py-3 text-center text-xs text-muted-foreground">
                No employees configured for this scope.
              </p>
            ) : (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="py-1.5 font-medium">Employee</th>
                    <th className="py-1.5 text-right font-medium">Monthly</th>
                    <th className="py-1.5 text-right font-medium">Days</th>
                    <th className="py-1.5 text-right font-medium">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${r.name}-${i}`} className="border-b border-border/40">
                      <td className="py-1.5">{r.name}</td>
                      <td className="py-1.5 text-right tabular-nums">{SAR(r.monthly_salary)}</td>
                      <td className="py-1.5 text-right tabular-nums">{r.worked_days}</td>
                      <td className="py-1.5 text-right tabular-nums font-semibold">{SAR(r.calculated_salary)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="py-2 text-right font-semibold">Total Salary Expense</td>
                    <td className="py-2 text-right font-bold tabular-nums">{SAR(total)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function SalaryStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border px-2.5 py-2",
      accent ? "border-primary/30 bg-primary/5" : "border-border/60",
    )}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-[13px] font-bold tabular-nums", accent && "text-primary")}>{value}</p>
    </div>
  );
}

// ============================================================
// Owner-Report-style Shop Card + Summary (Profit Summary page only)
// ============================================================

const SAR_SMART = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  const num = v || 0;
  const hasDecimal = Math.abs(num - Math.round(num)) > 0.0049;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  }).format(num);
};

type PSTone = "positive" | "negative" | "primary";
const psToneClass: Record<PSTone, string> = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-rose-600 dark:text-rose-400",
  primary: "text-primary",
};

function PSStatBlock({ label, value, tone }: { label: string; value: number; tone: PSTone }) {
  return (
    <div className="min-w-0">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className={cn(
        "mt-0.5 font-bold tabular-nums whitespace-nowrap leading-tight text-[clamp(13px,4vw,17px)]",
        psToneClass[tone],
      )}>
        {SAR_SMART(value)}
      </div>
    </div>
  );
}

type ShopCardView = "income" | "expense" | "profit";

function PSStatButton({
  label, value, tone, active, onClick,
}: { label: string; value: number; tone: PSTone; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-0 text-left rounded-lg px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-muted/70 ring-1 ring-border" : "hover:bg-muted/40 active:bg-muted/60",
      )}
    >
      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
        <span className="truncate">{label}</span>
        <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform", active && "rotate-180")} />
      </div>
      <div className={cn(
        "mt-0.5 font-bold tabular-nums whitespace-nowrap leading-tight text-[clamp(13px,4vw,17px)]",
        psToneClass[tone],
      )}>
        {SAR_SMART(value)}
      </div>
    </button>
  );
}

function FormulaLine({ label, value, op, total }: { label: string; value: number; op?: "+" | "-"; total?: boolean }) {
  const display = op === "-" ? -Math.abs(value) : value;
  return (
    <div className={cn(
      "grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px]",
      total ? "bg-muted/40 font-semibold border-t border-border/60" : "border-t border-border/40",
    )}>
      <div className="col-span-1 text-muted-foreground tabular-nums text-center">{total ? "=" : (op ?? "+")}</div>
      <div className="col-span-7 break-words">{label}</div>
      <div className={cn(
        "col-span-4 text-right tabular-nums whitespace-nowrap",
        !total && (op === "-" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"),
      )}>
        {SAR_SMART(display)}
      </div>
    </div>
  );
}

function ProfitShopCard({ shop }: { shop: ShopProfit }) {
  const [view, setView] = useState<ShopCardView | null>(null);
  // Lazy mount: track whether the user has ever opened the detail panel.
  // Until then we never build the expense table rows.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => { if (view !== null && !hasOpened) setHasOpened(true); }, [view, hasOpened]);
  const income = shop.profit_before_expense;
  const expense = shop.total_expense;
  const profit = shop.net_profit;

  const toggle = (v: ShopCardView) => setView((prev) => (prev === v ? null : v));
  const open = view !== null;

  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="text-[18px] font-semibold leading-tight">{shop.shop_name}</div>
          <span className="shrink-0 mt-0.5 text-muted-foreground" aria-hidden>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <PSStatButton label="Income" value={income} tone="positive"
            active={view === "income"} onClick={() => toggle("income")} />
          <PSStatButton label="Expense" value={expense} tone="negative"
            active={view === "expense"} onClick={() => toggle("expense")} />
          <PSStatButton label="Profit" value={profit} tone={profit >= 0 ? "primary" : "negative"}
            active={view === "profit"} onClick={() => toggle("profit")} />
        </div>
      </div>

      <Collapsible open={open}>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="px-4 pb-4">
            {hasOpened && (
              <>
                {view === "income" && (
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    <div className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
                      Income Details
                    </div>
                    <FormulaLine label="Cash Sale" value={shop.cash_sale} op="+" />
                    <FormulaLine label="Bank Withdraw" value={shop.bank_withdraw} op="+" />
                    <FormulaLine label="Total Purchase" value={shop.total_purchase} op="-" />
                    <FormulaLine label="Shop Income" value={income} total />
                  </div>
                )}

                {view === "expense" && (
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    {shop.expenses.length === 0 ? (
                      <p className="px-3 py-3 text-[12px] text-muted-foreground">No expenses in this period.</p>
                    ) : (
                      <>
                        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
                          <div className="col-span-4">Date</div>
                          <div className="col-span-5">Note</div>
                          <div className="col-span-3 text-right">Amount</div>
                        </div>
                        {shop.expenses.map((e, i) => (
                          <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/40">
                            <div className="col-span-4 text-muted-foreground tabular-nums">{e.date}</div>
                            <div className="col-span-5 break-words whitespace-normal">{e.note}</div>
                            <div className="col-span-3 text-right tabular-nums whitespace-nowrap text-rose-600 dark:text-rose-400">
                              {SAR_SMART(e.amount)}
                            </div>
                          </div>
                        ))}
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[12.5px] border-t border-border/60 bg-muted/30 font-semibold">
                          <div className="col-span-9">Total Shop Expense</div>
                          <div className="col-span-3 text-right tabular-nums whitespace-nowrap text-rose-600 dark:text-rose-400">
                            {SAR_SMART(expense)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {view === "profit" && (
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    <div className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/40">
                      Profit Calculation
                    </div>
                    <FormulaLine label="Income" value={income} op="+" />
                    <FormulaLine label="Expense" value={expense} op="-" />
                    <FormulaLine label="Net Profit" value={profit} total />
                  </div>
                )}
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}


function ProfitSummaryTotals({ income, expense, profit }: { income: number; expense: number; profit: number }) {
  return (
    <Card className="rounded-2xl p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-3">Summary</p>
      <div className="grid grid-cols-3 gap-3">
        <PSStatBlock label="Total Income" value={income} tone="positive" />
        <PSStatBlock label="Total Expense" value={expense} tone="negative" />
        <PSStatBlock label="Net Profit" value={profit} tone={profit >= 0 ? "primary" : "negative"} />
      </div>
    </Card>
  );
}
