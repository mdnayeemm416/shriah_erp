import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { SARAmount } from "@/components/sar-amount";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet, Landmark, TrendingDown, Package, ArrowRight, FileBarChart, ArrowLeftRight, Warehouse,
  Info, Store, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopDrilldownSheet, type DrillKind } from "@/components/shop-drilldown-sheet";
import { useShopPositions } from "@/hooks/use-shop-positions";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

type Txn = {
  id: string;
  type: string;
  shop_id: string | null;
  amount: number;
  txn_date: string;
  payment_method: string;
};

type RangeKey = "today" | "week" | "month" | "all" | "custom";

function getRange(key: RangeKey, custom: { from: string; to: string }): { from: string | null; to: string | null; label: string } {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  if (key === "today") return { from: iso(today), to: iso(today), label: "Today" };
  if (key === "week") {
    const day = today.getDay() || 7; // Mon=1..Sun=7
    const start = new Date(today); start.setDate(today.getDate() - (day - 1));
    return { from: iso(start), to: iso(today), label: "This Week" };
  }
  if (key === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: iso(start), to: iso(today), label: "This Month" };
  }
  if (key === "custom") return { from: custom.from || null, to: custom.to || null, label: "Custom" };
  return { from: null, to: null, label: "All Time" };
}

function Dashboard() {
  const [rangeKey, setRangeKey] = useState<RangeKey>("month");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [drill, setDrill] = useState<{ shop: { id: string; name: string }; kind: DrillKind } | null>(null);
  const range = getRange(rangeKey, custom);

  // 5-minute cache for dashboard aggregates. Mutations elsewhere call
  // queryClient.invalidateQueries(['txns'|'shop_entries'|...]) which refreshes immediately.
  const DASH_CACHE = { staleTime: 5 * 60_000, gcTime: 10 * 60_000, refetchInterval: 5 * 60_000, refetchOnWindowFocus: false } as const;

  const { data: txns = [] } = useQuery({
    queryKey: ["txns"],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      return (data ?? []) as Txn[];
    },
    ...DASH_CACHE,
  });
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return (await import("@/lib/shop-order")).sortShops((data ?? []) as any[]);
    },
    ...DASH_CACHE,
  });
  const { data: settings } = useQuery<any>({
    queryKey: ["app_settings"],
    queryFn: async () =>
      (await supabase.from("app_settings").select("*").eq("id", 1).single()).data,
    ...DASH_CACHE,
  });
  const { data: shopEntries = [] } = useQuery<any[]>({
    queryKey: ["shop_entries", "all"],
    queryFn: async () =>
      (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? [],
    ...DASH_CACHE,
  });
  const { data: whLedger = [] } = useQuery<any[]>({
    queryKey: ["wh_ledger"],
    queryFn: async () =>
      (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false)).data ?? [],
    ...DASH_CACHE,
  });
  const { data: parties = [] } = useQuery<any[]>({
    queryKey: ["parties"],
    queryFn: async () =>
      (((await (supabase as any).from("parties").select("*").eq("is_deleted", false)).data) ?? []) as any[],
    ...DASH_CACHE,
  });

  // MASTER Cash Position values — read-only (no recalc here).
  const { byId: masterPositions } = useShopPositions(range);

  // Apply date filter
  const inRange = (d: string) => {
    if (range.from && d < range.from) return false;
    if (range.to && d > range.to) return false;
    return true;
  };
  const txnsR = useMemo(() => txns.filter((t) => inRange(t.txn_date)), [txns, range.from, range.to]);
  const shopEntriesR = useMemo(() => shopEntries.filter((e: any) => inRange(e.txn_date)), [shopEntries, range.from, range.to]);
  const whLedgerR = useMemo(() => whLedger.filter((e: any) => inRange(e.txn_date)), [whLedger, range.from, range.to]);

  const totalOpening = shops.reduce((s, x: any) => s + Number(x.opening_cash || 0), 0);
  const sumByType = (t: string) =>
    txnsR.filter((x) => x.type === t).reduce((s, x) => s + Number(x.amount), 0);

  const cashIn = sumByType("cash_in");
  const cashOut = sumByType("cash_out");
  const bankWithdraw = sumByType("bank_withdraw");
  const purchases = sumByType("purchase");
  const expensesShop = txnsR.filter((x) => x.type === "expense" && x.shop_id).reduce((s, x) => s + Number(x.amount), 0);
  const expensesManual = txnsR.filter((x) => (x.type === "expense" && !x.shop_id) || x.type === "supervisor_payment" || x.type === "cash_out").reduce((s, x) => s + Number(x.amount), 0);
  const expenses = sumByType("expense") + sumByType("supervisor_payment");
  const adjustments = sumByType("adjustment");

  // Shop bank sales come from shop_entries directly (not synced to transactions)
  const shopBankSales = shopEntriesR
    .filter((e: any) => e.entry_type === "sale")
    .reduce((s, e: any) => s + Number(e.bank_sale || 0), 0);

  // Split cash_in into shop vs warehouse sources
  const shopCashSales = txnsR.filter((t) => t.type === "cash_in" && t.payment_method === "cash" && t.shop_id).reduce((s, t) => s + Number(t.amount), 0);
  const warehouseCashSales = txnsR.filter((t) => t.type === "cash_in" && !t.shop_id).reduce((s, t) => s + Number(t.amount), 0);

  // For "all time" include opening; for date-range view, show movement-only cash position
  const includeOpening = rangeKey === "all";
  const openingCashUsed = includeOpening ? totalOpening : 0;
  const cashInHand =
    openingCashUsed +
    cashIn + bankWithdraw - cashOut - purchases - expenses + adjustments;
  const openingBank = includeOpening ? Number(settings?.opening_bank_balance ?? 0) : 0;
  const bankBalance = openingBank + shopBankSales - bankWithdraw;
  const totalExpense = cashOut + purchases + expenses;

  // Warehouse Value — global (not date-filtered) to reflect true stock position
  const openingStock = Number(settings?.opening_stock_value ?? 0);
  const openingDue = Number(settings?.opening_due_receivable ?? 0);
  const partyOpeningDue = parties.reduce((s, p: any) => s + Number(p.opening_due || 0), 0);
  const partyOpeningAdvance = parties.reduce((s, p: any) => s + Number(p.opening_advance || 0), 0);

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

  // Per-shop summary (date-filtered) — split into Full ERP vs Simple Cash
  const erpShopSummaries = useMemo(() => {
    return shops.filter((s: any) => s.shop_type !== "simple_cash").map((s: any) => {
      const shopTxns = txnsR.filter((t) => t.shop_id === s.id);
      const cashSale = shopTxns
        .filter((t) => t.type === "cash_in" && t.payment_method === "cash")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const bankWith = shopTxns
        .filter((t) => t.type === "bank_withdraw")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const purch = shopTxns
        .filter((t) => t.type === "purchase")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expense = shopEntriesR
        .filter((e: any) => e.shop_id === s.id && e.entry_type === "expense")
        .reduce((sum: number, e: any) => sum + Number(e.expense_amount || 0), 0);
      const totalCash = cashSale + bankWith;
      const totalCost = purch + expense;
      return {
        id: s.id, name: s.name, cashSale, bankWithdraw: bankWith, purchase: purch, expense,
        totalCash, totalCost,
        // Cash Position = MASTER (single source, all-time). Period rows above are informational.
        position: masterPositions.get(s.id) ?? 0,
      };
    });
  }, [shops, txnsR, shopEntriesR, masterPositions]);

  const simpleShopSummaries = useMemo(() => {
    return shops.filter((s: any) => s.shop_type === "simple_cash").map((s: any) => {
      const entries = shopEntriesR.filter((e: any) => e.shop_id === s.id);
      const cashIn = entries.filter((e: any) => e.entry_type === "sale").reduce((sum: number, e: any) => sum + Number(e.cash_sale || 0), 0);
      const expense = entries.filter((e: any) => e.entry_type === "expense").reduce((sum: number, e: any) => sum + Number(e.expense_amount || 0), 0);
      // Balance = MASTER Cash Position (single source, all-time).
      return { id: s.id, name: s.name, cashIn, expense, balance: masterPositions.get(s.id) ?? 0 };
    });
  }, [shops, shopEntriesR, masterPositions]);

  void whLedgerR;
  void adjustments;

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">At-a-glance financial position.</p>
        </div>
      </div>

      {/* Date range pills */}
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {([
          ["today", "Today"],
          ["week", "Week"],
          ["month", "Month"],
          ["all", "All"],
        ] as [RangeKey, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setRangeKey(k)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
              rangeKey === k
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                rangeKey === "custom"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" /> Custom
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 space-y-3">
            <div>
              <Label className="text-xs">From</Label>
              <Input type="date" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Input type="date" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} className="mt-1" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setRangeKey("custom")}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <span className="ml-auto shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {range.label}
        </span>
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Cash in Hand" value={cashInHand} icon={Wallet} tone="primary"
          breakdown={{
            period: range.label,
            formula: "Opening Cash + Shop Cash Sales + Warehouse Cash Sales + Bank Withdraw − Purchases − Expenses − Cash Out",
            rows: [
              { label: "Opening Cash", value: openingCashUsed, note: includeOpening ? undefined : "Excluded for date-filtered view" },
              { label: "Shop Cash Sales", value: shopCashSales },
              { label: "Warehouse Cash Sales", value: warehouseCashSales },
              { label: "Bank Withdraw", value: bankWithdraw },
              { label: "Purchases", value: purchases, negative: true },
              { label: "Expenses", value: expenses, negative: true },
              { label: "Cash Out", value: cashOut, negative: true },
              ...(adjustments ? [{ label: "Adjustments", value: adjustments }] : []),
            ],
            total: cashInHand,
          }}
        />
        <KpiCard
          label="Bank Balance" value={bankBalance} icon={Landmark} tone="info"
          breakdown={{
            period: range.label,
            formula: "Opening Bank Balance + Shop Bank Sale − Bank Withdraw",
            rows: [
              { label: "Opening Bank Balance", value: openingBank, note: includeOpening ? undefined : "Excluded for date-filtered view" },
              { label: "Shop Bank Sale", value: shopBankSales },
              { label: "Bank Withdraw", value: bankWithdraw, negative: true },
            ],
            total: bankBalance,
          }}
        />
        <KpiCard
          label="Total Expense" value={totalExpense} icon={TrendingDown} tone="danger"
          breakdown={{
            period: range.label,
            formula: "Shop Expenses + Manual Expenses + Warehouse Purchases",
            rows: [
              { label: "Shop Expenses", value: expensesShop },
              { label: "Manual / Cash Out", value: expensesManual },
              { label: "Warehouse Purchases", value: purchases },
            ],
            total: totalExpense,
          }}
        />
        <KpiCard
          label="Warehouse Value" value={warehouseValue} icon={Package} tone="success"
          breakdown={{
            period: "All Time",
            formula: "Opening Stock + Due Receivable + New Purchases − Warehouse Sales",
            rows: [
              { label: "Opening Stock", value: openingStock },
              { label: "Due Receivable", value: dueReceivable },
              { label: "New Purchases", value: whPurchases },
              { label: "Warehouse Sales", value: whSales, negative: true },
            ],
            total: warehouseValue,
          }}
        />
      </div>

      {/* Full ERP Shop Summary */}
      {erpShopSummaries.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full ERP Shop Summary
            </p>
            <span className="text-[11px] text-muted-foreground">{range.label}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {erpShopSummaries.map((s: any) => (
              <ShopSummaryCard
                key={s.id}
                shop={s}
                onDrill={(kind) => setDrill({ shop: { id: s.id, name: s.name }, kind })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Simple Cash Shop Summary */}
      {simpleShopSummaries.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Simple Cash Shop Summary
            </p>
            <span className="text-[11px] text-muted-foreground">{range.label}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {simpleShopSummaries.map((s: any) => {
              const positive = s.balance >= 0;
              return (
                <Card key={s.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                        <Store className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="truncate font-display font-semibold tracking-tight">{s.name}</h3>
                    </div>
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">Simple</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <button
                      type="button"
                      onClick={() => setDrill({ shop: { id: s.id, name: s.name }, kind: "cash_in" })}
                      className="rounded-lg bg-muted/40 px-2 py-2 transition-all hover:bg-success/10 hover:ring-1 hover:ring-success/40 active:scale-[0.97]"
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Cash In</p>
                      <div className="mt-0.5"><SARAmount value={s.cashIn} size="sm" /></div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrill({ shop: { id: s.id, name: s.name }, kind: "expense" })}
                      className="rounded-lg bg-muted/40 px-2 py-2 transition-all hover:bg-destructive/10 hover:ring-1 hover:ring-destructive/40 active:scale-[0.97]"
                    >
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Expense</p>
                      <div className="mt-0.5 text-destructive"><SARAmount value={s.expense} size="sm" /></div>
                    </button>
                  </div>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Balance</p>
                    <div className={cn("mt-1", positive ? "text-success" : "text-destructive")}>
                      <SARAmount value={s.balance} size="2xl" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <ShopDrilldownSheet
        open={!!drill}
        onOpenChange={(v) => !v && setDrill(null)}
        shop={drill?.shop ?? null}
        kind={drill?.kind ?? null}
        initialFrom={range.from}
        initialTo={range.to}
      />


      {/* Quick links */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Open
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          <QuickLink to="/reports" label="Reports" desc="Charts & exports" icon={FileBarChart} />
        </div>
      </div>
    </div>
  );
}

type BreakdownRow = { label: string; value: number; negative?: boolean; note?: string };
type Breakdown = { rows: BreakdownRow[]; total: number; formula: string; period: string };

function KpiCard({
  label, value, icon: Icon, tone, breakdown,
}: { label: string; value: number; icon: any; tone: "primary" | "info" | "danger" | "success"; breakdown?: Breakdown }) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    info: "bg-chart-2/10 text-chart-2",
    danger: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  }[tone];
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)] active:translate-y-0",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">{label}</p>
          {breakdown && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`How ${label} is calculated`}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0 animate-scale-in">
                <div className="border-b border-border px-4 py-3">
                  <p className="font-display text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {breakdown.period} · live breakdown
                  </p>
                </div>
                <div className="px-4 py-3">
                  <ul className="divide-y divide-border/60">
                    {breakdown.rows.map((r) => (
                      <li key={r.label} className="flex items-center justify-between py-2">
                        <div className="min-w-0">
                          <p className="text-[12px] text-foreground/90">{r.label}</p>
                          {r.note && <p className="text-[10px] text-muted-foreground">{r.note}</p>}
                        </div>
                        <span className={cn(r.negative && "text-destructive")}>
                          {r.negative && <span className="text-destructive">− </span>}
                          <SARAmount value={r.value} size="sm" />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">Result</span>
                    <SARAmount value={breakdown.total} size="md" bold />
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground/70">Formula: </span>{breakdown.formula}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClass)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="mt-5">
        <SARAmount value={value} size="2xl" />
      </div>
    </Card>
  );
}

function ShopSummaryCard({
  shop,
  onDrill,
}: {
  shop: {
    id: string; name: string;
    cashSale: number; bankWithdraw: number; purchase: number; expense: number;
    totalCash: number; totalCost: number; position: number;
  };
  onDrill: (kind: DrillKind) => void;
}) {
  const positive = shop.position >= 0;
  return (
    <Card className="relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-4.5 w-4.5" />
          </div>
          <h3 className="truncate font-display font-semibold tracking-tight">{shop.name}</h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="How this is calculated"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Info className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cash Position
            </p>
            <div className="space-y-1.5">
              <Row label="Cash Sale" value={shop.cashSale} tone="success" />
              <Row label="Bank Withdraw" value={shop.bankWithdraw} tone="success" />
              <Row label="Total Cash" value={shop.totalCash} tone="success" bold />
              <div className="my-1.5 border-t border-border/60" />
              <Row label="Purchase" value={shop.purchase} tone="danger" />
              <Row label="Expense" value={shop.expense} tone="danger" />
              <Row label="Total Cost" value={shop.totalCost} tone="danger" bold />
              <div className="my-2 border-t border-border" />
              <Row label="Cash Position" value={shop.position} tone={positive ? "success" : "danger"} bold />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Total Cash = Cash Sale + Withdraw<br />
              Total Cost = Purchase + Expense<br />
              Cash Position = Total Cash − Total Cost
            </p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <MiniMetric label="Total Cash" value={shop.totalCash} />
        <MiniMetric label="Total Cost" value={shop.totalCost} negative />
        <MiniMetric label="Total Expense" value={shop.expense} negative onClick={() => onDrill("expense")} />
        <MiniMetric label="Cash Position" value={shop.position} negative={!positive} />
      </div>
    </Card>
  );
}

function MiniMetric({ label, value, negative, onClick }: { label: string; value: number; negative?: boolean; onClick?: () => void }) {
  const Comp: any = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-lg bg-muted/40 px-2 py-2 text-left",
        onClick && "group cursor-pointer transition-all hover:bg-primary/10 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)] active:scale-[0.98]",
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className={cn("mt-0.5", negative ? "text-destructive" : "", onClick && "group-hover:underline decoration-dotted underline-offset-2")}>
        <SARAmount value={value} size="sm" />
      </div>
    </Comp>
  );
}

function Row({ label, value, tone, bold }: { label: string; value: number; tone: "success" | "danger"; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn("text-xs text-muted-foreground", bold && "font-semibold text-foreground")}>{label}</span>
      <span className={cn(tone === "success" ? "text-success" : "text-destructive")}>
        <SARAmount value={value} size={bold ? "md" : "sm"} bold={bold} />
      </span>
    </div>
  );
}

function QuickLink({
  to, label, desc, icon: Icon,
}: { to: string; label: string; desc: string; icon: any }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:translate-y-0"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
