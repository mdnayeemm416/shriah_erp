import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkingDate } from "@/hooks/use-working-date";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { SARAmount } from "@/components/sar-amount";
import { InfoButton } from "@/components/info-button";
import { LiveFormulaSheet, type FormulaItem } from "@/components/live-formula-sheet";
import { useShopPositions } from "@/hooks/use-shop-positions";
import { useWholesaleFinancials } from "@/lib/use-wholesale-financials";


import { sortShops } from "@/lib/shop-order";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Wallet, TrendingDown, TrendingUp, Sparkles, Package, Users,
  Plus, CalendarDays, ArrowDownCircle, ArrowUpCircle, Paperclip, X,
  Coins, Receipt, Store, Pencil, Settings2, Trash2, Check, RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/_app/overview")({
  component: OverviewPage,
});

const DEFAULT_INCOME_CATEGORIES = ["Outside Income", "Misc Income", "Owner Deposit"];
const DEFAULT_COST_CATEGORIES = ["Room Expense", "Profit Share", "Electricity", "Rent", "Fuel", "Repairs", "Other Costs"];

// ---------- date range ----------
type RangeKey = "today" | "week" | "month" | "all" | "custom";

function getRange(key: RangeKey, custom: { from: string; to: string }) {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  if (key === "today") return { from: iso(today), to: iso(today), label: "Today" };
  if (key === "week") {
    const day = today.getDay() || 7;
    const start = new Date(today); start.setDate(today.getDate() - (day - 1));
    return { from: iso(start), to: iso(today), label: "This Week" };
  }
  if (key === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: iso(start), to: iso(today), label: "This Month" };
  }
  if (key === "all") return { from: null as any, to: null as any, label: "All Time" };
  return { from: custom.from || null, to: custom.to || null, label: "Custom" };
}

type OverviewEntry = {
  id: string;
  entry_type: "income" | "cost";
  amount: number;
  txn_date: string;
  notes: string | null;
  category: string | null;
  attachment_url: string | null;
  created_at: string;
};

type Cat = {
  id: string;
  name: string;
  entry_type: "income" | "cost";
};

function OverviewPage() {
  const pageQc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [rangeKey, setRangeKey] = useState<RangeKey>("all");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const range = getRange(rangeKey, custom);

  const refreshBalances = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        pageQc.invalidateQueries({ queryKey: ["shops"] }),
        pageQc.invalidateQueries({ queryKey: ["wh_ledger"] }),
        pageQc.invalidateQueries({ queryKey: ["parties"] }),
        pageQc.invalidateQueries({ queryKey: ["app_settings"] }),
        pageQc.invalidateQueries({ queryKey: ["employee-entries", "all"] }),
        pageQc.invalidateQueries({ queryKey: ["txns"] }),
        pageQc.invalidateQueries({ queryKey: ["shop_entries", "all"] }),
        pageQc.invalidateQueries({ queryKey: ["overview_entries"] }),
        pageQc.invalidateQueries({ queryKey: ["overview_categories"] }),
      ]);
      toast.success("Balances refreshed");
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  const [formOpen, setFormOpen] = useState(false);
  const [formDefaults, setFormDefaults] = useState<{ type: "income" | "cost"; category?: string } | null>(null);
  const [manageCatOpen, setManageCatOpen] = useState(false);
  const [editOpeningOpen, setEditOpeningOpen] = useState(false);
  const [formulaSheet, setFormulaSheet] = useState<null | "expected" | "assets" | "liabilities" | "converted">(null);
  const [drill, setDrill] = useState<null | {
    title: string;
    rows: Array<{ id?: string; label: string; sub?: string; amount: number; date?: string; tone?: "in" | "out" }>;
    total?: number;
  }>(null);


  // ---- data ----
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops((data ?? []) as any[]);
    },
  });
  const { data: whLedger = [] } = useQuery<any[]>({
    queryKey: ["wh_ledger"],
    queryFn: async () => (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false)).data ?? [],
  });
  const { data: parties = [] } = useQuery<any[]>({
    queryKey: ["parties"],
    queryFn: async () => (((await (supabase as any).from("parties").select("*").eq("is_deleted", false)).data) ?? []) as any[],
  });
  void parties;

  const { data: settings } = useQuery<any>({
    queryKey: ["app_settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*").eq("id", 1).single()).data,
  });
  const { data: employeeEntries = [] } = useQuery<any[]>({
    queryKey: ["employee-entries", "all"],
    queryFn: async () => (((await (supabase as any).from("employee_entries").select("*").eq("is_deleted", false)).data) ?? []) as any[],
  });
  const { data: txns = [] } = useQuery<any[]>({
    queryKey: ["txns"],
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false)).data ?? [],
  });
  const { data: shopEntries = [] } = useQuery<any[]>({
    queryKey: ["shop_entries", "all"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? [],
  });
  const { data: overviewEntries = [] } = useQuery<OverviewEntry[]>({
    queryKey: ["overview_entries"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("overview_entries")
        .select("*")
        .eq("is_deleted", false)
        .order("txn_date", { ascending: false });
      return (data ?? []) as OverviewEntry[];
    },
  });
  const { data: categories = [] } = useQuery<Cat[]>({
    queryKey: ["overview_categories"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("overview_categories")
        .select("*")
        .eq("is_deleted", false)
        .order("name");
      return (data ?? []) as Cat[];
    },
  });

  // ---- filtering ----
  const inRange = (d: string) => {
    if (range.from && d < range.from) return false;
    if (range.to && d > range.to) return false;
    return true;
  };
  const overviewR = useMemo(
    () => overviewEntries.filter((e) => inRange(e.txn_date)),
    [overviewEntries, range.from, range.to],
  );
  void txns;
  void shopEntries;

  // ---- ASSETS ----
  const openingBalance = Number(settings?.opening_company_balance ?? 0);
  // Opening Stock for Converted-To-Cash = manual admin value (mirrors Warehouse Health)
  const openingWarehouseValue = Number(settings?.opening_warehouse_balance ?? 0);

  // Warehouse breakdown — SINGLE SOURCE OF TRUTH shared with the Wholesale
  // Dashboard "Wholesale Value" card and the Home/Summary page via
  // useWholesaleFinancials(). Do not recompute locally.
  void whLedger;
  const { data: whFin } = useWholesaleFinancials();
  const warehouseBreakdown = useMemo(
    () => ({
      currentStock: whFin?.currentStock ?? 0,
      dueReceivable: whFin?.receivable ?? 0,
      currentValue: whFin?.warehouseValue ?? 0,
    }),
    [whFin],
  );


  const warehouseValue = warehouseBreakdown.currentValue;
  // Warehouse value already converted to cash / receivable
  const warehouseConverted = warehouseValue - openingWarehouseValue;

  const employeeOutstanding = useMemo(() => {
    let given = 0, received = 0;
    for (const e of employeeEntries) {
      if (e.entry_type === "given") given += Number(e.amount || 0);
      else if (e.entry_type === "received") received += Number(e.amount || 0);
    }
    return given - received;
  }, [employeeEntries]);

  // Outside income from overview entries
  const incomeEntries = useMemo(() => overviewR.filter((e) => e.entry_type === "income"), [overviewR]);
  const outsideIncome = useMemo(
    () => incomeEntries.reduce((s, e) => s + Number(e.amount), 0),
    [incomeEntries],
  );

  // ---- SHOP CASH POSITIONS (single source: Shop Page Cash Position engine) ----
  const { byId: masterPositions } = useShopPositions(range);
  const shopPositions = useMemo(() => {
    return shops.map((s: any) => {
      return {
        id: s.id,
        name: s.name,
        position: masterPositions.get(s.id) ?? 0,
        kind: s.shop_type === "simple_cash" ? "simple" as const : "erp" as const,
      };
    });
  }, [shops, masterPositions]);

  // Positive position → Liability ; Negative → Asset (business should receive)
  const positiveShopPositions = shopPositions.filter((s) => s.position >= 0);
  const negativeShopPositions = shopPositions.filter((s) => s.position < 0);
  const negativeShopAssets = negativeShopPositions.reduce((s, x) => s + Math.abs(x.position), 0);

  // ---- TOTAL ASSETS (real business cash flow) ----
  const totalAssets =
    warehouseConverted + employeeOutstanding + outsideIncome + negativeShopAssets;


  // ---- LIABILITIES ----
  const costEntries = useMemo(() => overviewR.filter((e) => e.entry_type === "cost"), [overviewR]);
  const liabilityGroups = useMemo(() => {
    const groups = new Map<string, { category: string; total: number; rows: OverviewEntry[] }>();
    for (const e of costEntries) {
      const cat = e.category || "Other Costs";
      const cur = groups.get(cat) ?? { category: cat, total: 0, rows: [] };
      cur.total += Number(e.amount);
      cur.rows.push(e);
      groups.set(cat, cur);
    }
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [costEntries]);

  const totalCostLiabilities = liabilityGroups.reduce((s, g) => s + g.total, 0);
  const totalShopPositiveLiabilities = positiveShopPositions.reduce((s, x) => s + x.position, 0);
  const totalLiabilities = totalCostLiabilities + totalShopPositiveLiabilities;

  const expectedCashInHand = totalAssets - totalLiabilities;

  // ---- drill openers ----
  const openIncomeDrill = () => {
    const rows = incomeEntries.map((e) => ({
      id: e.id, label: e.notes || e.category || "Outside Income",
      date: e.txn_date, amount: Number(e.amount), tone: "in" as const,
    }));
    setDrill({ title: "Outside Income", rows, total: outsideIncome });
  };
  const openLiabilityDrill = (g: { category: string; total: number; rows: OverviewEntry[] }) => {
    const rows = g.rows.map((e) => ({
      id: e.id, label: e.notes || g.category, date: e.txn_date,
      amount: Number(e.amount), tone: "out" as const,
    }));
    setDrill({ title: g.category, rows, total: g.total });
  };
  const openEmployeeDrill = () => {
    const byEmp = new Map<string, { given: number; received: number }>();
    for (const e of employeeEntries) {
      const id = e.employee_id as string;
      const cur = byEmp.get(id) ?? { given: 0, received: 0 };
      if (e.entry_type === "given") cur.given += Number(e.amount || 0);
      else cur.received += Number(e.amount || 0);
      byEmp.set(id, cur);
    }
    const rows = Array.from(byEmp.entries()).map(([id, v]) => ({
      id, label: id.slice(0, 8), date: "", amount: v.given - v.received,
      tone: (v.given - v.received) >= 0 ? "in" as const : "out" as const,
    }));
    setDrill({ title: "Employee Outstanding", rows, total: employeeOutstanding });
  };

  const openNewEntry = (defaults?: { type: "income" | "cost"; category?: string }) => {
    setFormDefaults(defaults ?? null);
    setFormOpen(true);
  };

  return (
    <div className="mobile-page-stack animate-fade-in md:gap-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
          <p className="text-sm text-muted-foreground">How much cash should you actually have right now?</p>
        </div>
        <Button onClick={() => openNewEntry()} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> New entry
        </Button>
      </div>

      {/* Date range pills */}
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {([
          ["all", "All Time"],
          ["month", "Monthly"],
          ["week", "Weekly"],
          ["today", "Today"],
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
            <button className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
              rangeKey === "custom" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}>
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
              <Button size="sm" onClick={() => setRangeKey("custom")}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
        <span className="ms-auto shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {range.label}
        </span>
        <button
          type="button"
          onClick={refreshBalances}
          disabled={refreshing}
          aria-label="Refresh balances"
          className="shrink-0 rounded-full border border-border bg-card p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
        </button>
      </div>

      {/* ====== CONVERTED TO CASH (standalone highlighted card) ====== */}
      <ConvertedToCashCard
        openingStock={openingWarehouseValue}
        currentStock={warehouseBreakdown.currentStock}
        receivable={warehouseBreakdown.dueReceivable}
        currentValue={warehouseValue}
        convertedToCash={warehouseConverted}
        onInfo={() => setFormulaSheet("converted")}
      />

      {/* ====== SECTION 1: ASSETS ====== */}
      <Section
        title="Assets / Receivable"
        subtitle="What the business owns or expects to receive"
        accent="success"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <MetricCard
            label="Employee Outstanding"
            value={employeeOutstanding}
            tone={employeeOutstanding >= 0 ? "success" : "warning"}
            icon={Users}
            metric="employee_outstanding"
            onClick={openEmployeeDrill}
          />
          <MetricCard
            label="Outside Income"
            value={outsideIncome}
            tone="success"
            icon={ArrowDownCircle}
            metric="outside_income"
            onClick={openIncomeDrill}
          />

          {/* Negative shop positions surface here as recoverable assets */}
          {negativeShopPositions.map((s) => (
            <MetricCard
              key={`neg-${s.id}`}
              label={`${s.name} Recoverable`}
              value={Math.abs(s.position)}
              tone="success"
              icon={Store}
              hint="Shop owes the business"
            />
          ))}

          <button
            type="button"
            onClick={() => openNewEntry({ type: "income" })}
            className="group flex min-h-[124px] flex-col items-center justify-center gap-1.5 rounded-3xl border border-dashed border-border/70 bg-card/40 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
            Add income / asset
          </button>
        </div>

        <TotalCard
          label="Total Assets"
          value={totalAssets}
          tone="success"
          icon={Coins}
          formula="Converted To Cash + Employee + Income + Recoverable"
          onInfo={() => setFormulaSheet("assets")}
        />

      </Section>

      {/* ====== SECTION 2: LIABILITIES ====== */}
      <Section
        title="Liabilities / Payable"
        subtitle="What the business owes or must pay out"
        accent="danger"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {/* Shop Cash Positions (positive only) */}
          {positiveShopPositions.map((s) => (
            <MetricCard
              key={`pos-${s.id}`}
              label={`${s.name} Cash Position`}
              value={s.position}
              tone="danger"
              icon={Store}
              metric="shop_cash_position"
              hint="Synced with Dashboard"
            />
          ))}

          {/* Manual cost groups */}
          {liabilityGroups.map((g) => (
            <MetricCard
              key={g.category}
              label={g.category}
              value={g.total}
              tone="danger"
              icon={TrendingDown}
              hint={`${g.rows.length} entr${g.rows.length === 1 ? "y" : "ies"}`}
              onClick={() => openLiabilityDrill(g)}
            />
          ))}

          <button
            type="button"
            onClick={() => openNewEntry({ type: "cost" })}
            className="group flex min-h-[124px] flex-col items-center justify-center gap-1.5 rounded-3xl border border-dashed border-border/70 bg-card/40 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
            Add liability / cost
          </button>
        </div>

        <TotalCard
          label="Total Liabilities"
          value={totalLiabilities}
          tone="danger"
          icon={Receipt}
          formula="Positive Shop Cash Positions + Manual Costs"
          onInfo={() => setFormulaSheet("liabilities")}
        />
      </Section>

      {/* ====== SECTION 3: EXPECTED CASH IN HAND ====== */}
      <HeroCard
        value={expectedCashInHand}
        assets={totalAssets}
        liabilities={totalLiabilities}
        onInfo={() => setFormulaSheet("expected")}
      />


      {/* Recent timeline */}
      {overviewEntries.length > 0 && (
        <Section title="Recent Activity" subtitle="Latest income & liabilities" accent="primary">
          <Card className="overflow-hidden p-0">
            <div className="divide-y divide-border/60">
              {overviewEntries.slice(0, 10).map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </Card>
        </Section>
      )}

      {/* Mobile floating add disabled during scroll recovery. */}
      <button
        onClick={() => openNewEntry()}
        className="hidden"
        aria-label="New entry"
      >
        <Plus className="h-6 w-6" />
      </button>

      <OverviewEntryDialog
        open={formOpen}
        defaults={formDefaults}
        categories={categories}
        onManageCategories={() => setManageCatOpen(true)}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setFormDefaults(null); }}
      />

      <CategoryManagerDialog
        open={manageCatOpen}
        onOpenChange={setManageCatOpen}
        categories={categories}
      />

      <OpeningBalanceDialog
        open={editOpeningOpen}
        onOpenChange={setEditOpeningOpen}
        current={openingBalance}
      />

      {/* Drill-down sheet */}
      <Sheet open={!!drill} onOpenChange={(v) => !v && setDrill(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{drill?.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {drill?.rows.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No entries in this range.</p>
            )}
            {drill?.rows.map((r, i) => (
              <div key={r.id ?? i} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.label}</p>
                  {r.date && <p className="text-[11px] text-muted-foreground">{r.date}</p>}
                </div>
                <div className={cn("text-sm font-semibold tabular-nums", r.tone === "out" ? "text-destructive" : "text-success")}>
                  <SARAmount value={r.amount} size="sm" />
                </div>
              </div>
            ))}
            {drill?.total !== undefined && (
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</span>
                <SARAmount value={drill.total} size="lg" />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Live formula sheets */}
      {(() => {
        const assetItems: FormulaItem[] = [
          { label: "Converted To Cash", value: warehouseConverted, op: "+" },
          { label: "Employee Outstanding", value: employeeOutstanding, op: "+" },
          { label: "Outside Income", value: outsideIncome, op: "+" },
          ...negativeShopPositions.map((s) => ({
            label: `${s.name} Recoverable`,
            value: Math.abs(s.position),
            op: "+" as const,
          })),
        ];
        const convertedItems: FormulaItem[] = [
          { label: "Current Stock", value: warehouseBreakdown.currentStock, op: "+" },
          { label: "Receivable", value: warehouseBreakdown.dueReceivable, op: "+" },
          { label: "Opening Stock", value: openingWarehouseValue, op: "-" },
        ];
        const liabilityItems: FormulaItem[] = [
          ...positiveShopPositions.map((s) => ({
            label: `${s.name} Cash Position`,
            value: s.position,
            op: "+" as const,
          })),
          ...liabilityGroups.map((g) => ({
            label: g.category,
            value: g.total,
            op: "+" as const,
          })),
        ];
        const expectedItems: FormulaItem[] = [
          { label: "Total Assets", value: totalAssets, op: "+" },
          { label: "Total Liabilities", value: totalLiabilities, op: "-" },
        ];
        return (
          <>
            <LiveFormulaSheet
              open={formulaSheet === "assets"}
              onOpenChange={(v) => !v && setFormulaSheet(null)}
              title="Total Assets"
              subtitle="What the business owns or expects to receive."
              items={assetItems}
              total={totalAssets}
              totalLabel="Total Assets"
              tone="success"
            />
            <LiveFormulaSheet
              open={formulaSheet === "liabilities"}
              onOpenChange={(v) => !v && setFormulaSheet(null)}
              title="Total Liabilities"
              subtitle="What the business owes or must pay out."
              items={liabilityItems}
              total={totalLiabilities}
              totalLabel="Total Liabilities"
              tone="danger"
            />
            <LiveFormulaSheet
              open={formulaSheet === "expected"}
              onOpenChange={(v) => !v && setFormulaSheet(null)}
              title="Expected Cash In Hand"
              subtitle="Total Assets minus Total Liabilities."
              items={expectedItems}
              total={expectedCashInHand}
              totalLabel="Expected Cash In Hand"
              tone={expectedCashInHand >= 0 ? "success" : "danger"}
            />
            <LiveFormulaSheet
              open={formulaSheet === "converted"}
              onOpenChange={(v) => !v && setFormulaSheet(null)}
              title="Converted To Cash"
              subtitle="(Current Stock + Receivable) minus Opening Stock."
              items={convertedItems}
              total={warehouseConverted}
              totalLabel="Converted To Cash"
              tone={warehouseConverted >= 0 ? "success" : "danger"}
            />
          </>
        );
      })()}
    </div>

  );
}

// ============== HERO ==============
function HeroCard({ value, assets, liabilities, onInfo }: {
  value: number; assets: number; liabilities: number; onInfo?: () => void;
}) {
  const positive = value >= 0;
  return (
    <Card className={cn(
      "relative overflow-hidden p-6 md:p-8",
      positive ? "border-success/40" : "border-destructive/40",
    )}>
      <div className={cn(
        "pointer-events-none absolute -inset-px rounded-3xl opacity-70",
        positive
          ? "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--success)_22%,transparent),transparent_60%)]"
          : "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--destructive)_22%,transparent),transparent_60%)]",
      )} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider",
              positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}>
              <Sparkles className="h-3 w-3" /> Executive
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Expected Cash In Hand
            </p>
          </div>
          {onInfo ? (
            <button
              type="button"
              onClick={onInfo}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-muted/60 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Live formula"
            >
              <Sparkles className="h-3 w-3" /> Live formula
            </button>
          ) : (
            <InfoButton metric="expected_cash_in_hand" />
          )}
        </div>

        <div className="mt-5 md:mt-6">
          <SARAmount value={value} size="3xl" className={positive ? "text-success" : "text-destructive"} />
          <p className={cn(
            "mt-2 text-xs font-semibold uppercase tracking-wider",
            positive ? "text-success" : "text-destructive",
          )}>
            {positive ? "✓ Healthy Cash Position" : "⚠ Cash Shortage Detected"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Assets
            </p>
            <div className="mt-1 text-success"><SARAmount value={assets} size="md" /></div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Liabilities
            </p>
            <div className="mt-1 text-destructive"><SARAmount value={liabilities} size="md" /></div>
          </div>
        </div>
      </div>
    </Card>
  );
}


// ============== CONVERTED TO CASH (standalone premium card) ==============
function ConvertedToCashCard({
  openingStock, currentStock, receivable, currentValue, convertedToCash, onInfo,
}: {
  openingStock: number;
  currentStock: number;
  receivable: number;
  currentValue: number;
  convertedToCash: number;
  onInfo?: () => void;
}) {
  const positive = convertedToCash >= 0;
  return (
    <Card className={cn(
      "relative overflow-hidden p-4",
      positive ? "border-success/50" : "border-destructive/50",
    )}>
      <div className={cn(
        "pointer-events-none absolute -inset-px rounded-3xl opacity-70",
        positive
          ? "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--success)_18%,transparent),transparent_65%)]"
          : "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--destructive)_18%,transparent),transparent_65%)]",
      )} />
      <div className="relative flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-semibold uppercase tracking-wider",
              positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}>
              {positive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
              Warehouse
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Converted To Cash
            </p>
            {onInfo && (
              <button
                type="button"
                onClick={onInfo}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground"
                aria-label="Live formula"
              >
                <Sparkles className="h-3 w-3" />
              </button>
            )}
          </div>
          <p className="mt-1 truncate text-[10.5px] font-mono text-muted-foreground tabular-nums">
            ({currentStock.toFixed(0)} + {receivable.toFixed(0)}) − {openingStock.toFixed(0)}
          </p>
        </div>
        <SARAmount
          value={convertedToCash}
          size="xl"
          className={positive ? "text-success" : "text-destructive"}
        />
      </div>
    </Card>
  );
}







// ============== Section heading ==============
function Section({ title, subtitle, children, accent }: {
  title: string; subtitle?: string; children: React.ReactNode;
  accent?: "success" | "danger" | "primary";
}) {
  const dot = accent === "success" ? "bg-success" : accent === "danger" ? "bg-destructive" : "bg-primary";
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", dot)} />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ============== Metric card ==============
type Tone = "primary" | "info" | "success" | "danger" | "warning";

const TONE: Record<Tone, { ring: string; chip: string; icon: string }> = {
  primary: { ring: "hover:ring-primary/30", chip: "bg-primary/10 text-primary", icon: "text-primary" },
  info:    { ring: "hover:ring-blue-500/30", chip: "bg-blue-500/10 text-blue-500", icon: "text-blue-500" },
  success: { ring: "hover:ring-success/30", chip: "bg-success/10 text-success", icon: "text-success" },
  danger:  { ring: "hover:ring-destructive/30", chip: "bg-destructive/10 text-destructive", icon: "text-destructive" },
  warning: { ring: "hover:ring-amber-500/30", chip: "bg-amber-500/10 text-amber-500", icon: "text-amber-500" },
};

function MetricCard({
  label, value, tone, icon: Icon, metric, onClick, hint, dim, actionIcon: ActionIcon, onAction,
}: {
  label: string;
  value: number;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
  metric?: string;
  onClick?: () => void;
  hint?: string;
  dim?: boolean;
  actionIcon?: React.ComponentType<{ className?: string }>;
  onAction?: () => void;
}) {
  const t = TONE[tone];
  const clickable = !!onClick;
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative min-h-[124px] overflow-hidden p-4 ring-1 ring-transparent transition-all",
        clickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
        dim && "opacity-60",
        t.ring,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", t.chip)}>
          <Icon className={cn("h-4 w-4", t.icon)} />
        </div>
        <div className="flex items-center gap-1">
          {ActionIcon && onAction && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAction(); }}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Edit"
            >
              <ActionIcon className="h-3.5 w-3.5" />
            </button>
          )}
          {metric && <InfoButton metric={metric} size="xs" />}
        </div>
      </div>
      <p className="mt-3 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">
        <SARAmount value={value} size="lg" className={value < 0 ? "text-destructive" : ""} />
      </div>
      {hint && (
        <p className="mt-1 truncate text-[10px] text-muted-foreground/70">{hint}</p>
      )}
    </Card>
  );
}

function TotalCard({ label, value, tone, icon: Icon, formula, onInfo }: {
  label: string; value: number; tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
  formula?: string;
  onInfo?: () => void;
}) {
  const t = TONE[tone];
  return (
    <Card className={cn(
      "relative flex items-center justify-between gap-3 overflow-hidden px-5 py-4 ring-1",
      tone === "success" ? "ring-success/30" : tone === "danger" ? "ring-destructive/30" : "ring-border/60",
    )}>
      <div className={cn("absolute inset-y-0 start-0 w-1", t.chip)} />
      <div className="flex min-w-0 items-center gap-3 ps-2">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", t.chip)}>
          <Icon className={cn("h-5 w-5", t.icon)} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          {formula && <p className="mt-0.5 truncate text-[10px] text-muted-foreground/70">{formula}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SARAmount value={value} size="xl" className={value < 0 ? "text-destructive" : tone === "success" ? "text-success" : "text-destructive"} />
        {onInfo && (
          <button
            type="button"
            onClick={onInfo}
            className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Live formula"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </Card>
  );
}


// ============== Entry row ==============
function EntryRow({ entry }: { entry: OverviewEntry }) {
  const isIncome = entry.entry_type === "income";
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          isIncome ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        )}>
          {isIncome ? <ArrowDownCircle className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {entry.category || entry.notes || (isIncome ? "Outside Income" : "Cost")}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {entry.txn_date}
            {entry.notes && entry.category ? ` · ${entry.notes}` : ""}
            {entry.attachment_url ? " · 📎" : ""}
          </p>
        </div>
      </div>
      <div className={cn("text-sm font-semibold", isIncome ? "text-success" : "text-destructive")}>
        <SARAmount value={entry.amount} size="sm" />
      </div>
    </div>
  );
}

// ============== Opening balance dialog ==============
function OpeningBalanceDialog({ open, onOpenChange, current }: { open: boolean; onOpenChange: (v: boolean) => void; current: number }) {
  const qc = useQueryClient();
  const [val, setVal] = useState(String(current ?? 0));
  useEffect(() => { if (open) setVal(String(current ?? 0)); }, [open, current]);

  const save = useMutation({
    mutationFn: async () => {
      const num = parseFloat(val || "0");
      if (Number.isNaN(num)) throw new Error("Enter a valid number");
      const { error } = await (supabase as any)
        .from("app_settings")
        .update({ opening_company_balance: num })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Opening balance updated");
      qc.invalidateQueries({ queryKey: ["app_settings"] });
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to update"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Company Opening Balance</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Single global opening cash that the business started with. This is independent of individual shop opening cash.</p>
          <div className="space-y-1.5">
            <Label>Amount (SAR)</Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="text-lg font-semibold tabular-nums"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============== Entry dialog ==============
function OverviewEntryDialog({
  open, defaults, onOpenChange, categories, onManageCategories,
}: {
  open: boolean;
  defaults: { type: "income" | "cost"; category?: string } | null;
  categories: Cat[];
  onManageCategories: () => void;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [type, setType] = useState<"income" | "cost">("cost");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState("");
  const { workingDate } = useWorkingDate();
  const [date, setDate] = useState(() => workingDate);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setType(defaults?.type ?? "cost");
      setCategory(defaults?.category ?? "");
    }
  }, [open, defaults]);

  const reset = () => {
    setType("cost"); setCategory(""); setAmount("");
    setDate(workingDate);
    setNotes(""); setFile(null);
  };

  const managedOptions = categories.filter((c) => c.entry_type === type).map((c) => c.name);
  const defaultOptions = type === "income" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_COST_CATEGORIES;
  // Merge managed + defaults, dedupe, preserve order (managed first)
  const seen = new Set<string>();
  const categoryOptions: string[] = [];
  for (const n of [...managedOptions, ...defaultOptions]) {
    if (!seen.has(n)) { seen.add(n); categoryOptions.push(n); }
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      let url: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/overview/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await (supabase as any).from("overview_entries").insert({
        entry_type: type,
        amount: amt,
        txn_date: date,
        category: category.trim() || (type === "income" ? "Outside Income" : "Other Costs"),
        notes: notes.trim() || null,
        attachment_url: url,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry saved");
      qc.invalidateQueries({ queryKey: ["overview_entries"] });
      reset();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New overview entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Type selector */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-1">
            <SegPill
              active={type === "income"}
              onClick={() => { setType("income"); setCategory(""); }}
              icon={<ArrowDownCircle className="h-4 w-4" />}
              label="Income / Asset"
              tone="success"
            />
            <SegPill
              active={type === "cost"}
              onClick={() => { setType("cost"); setCategory(""); }}
              icon={<ArrowUpCircle className="h-4 w-4" />}
              label="Liability / Cost"
              tone="destructive"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Category</Label>
              <button
                type="button"
                onClick={onManageCategories}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10"
              >
                <Settings2 className="h-3 w-3" /> Manage
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categoryOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                    category === c
                      ? type === "income"
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Or type a custom category"
              className="mt-1.5"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Amount (SAR) *</Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg font-semibold tabular-nums"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} placeholder="Optional details" />
          </div>

          <div className="space-y-1.5">
            <Label>Attachment (optional)</Label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50">
              <Paperclip className="h-3.5 w-3.5" />
              {file ? file.name : "Choose file"}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <button
                  type="button"
                  onClick={(ev) => { ev.preventDefault(); setFile(null); }}
                  className="ms-auto text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SegPill({
  active, onClick, icon, label, tone,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
  tone: "destructive" | "success";
}) {
  const activeCls =
    tone === "destructive"
      ? "bg-destructive/15 text-destructive shadow-sm"
      : "bg-success/15 text-success shadow-sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active ? activeCls : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

// ============== Category manager dialog ==============
function CategoryManagerDialog({ open, onOpenChange, categories }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categories: Cat[];
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"income" | "cost">("cost");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const refresh = () => qc.invalidateQueries({ queryKey: ["overview_categories"] });

  const add = async () => {
    const name = newName.trim();
    if (!name || !user) return;
    const { error } = await (supabase as any).from("overview_categories").insert({
      name, entry_type: newType, created_by: user.id,
    });
    if (error) toast.error(error.message);
    else { toast.success("Category added"); setNewName(""); refresh(); }
  };

  const saveEdit = async (id: string) => {
    const name = editVal.trim();
    if (!name) return;
    const { error } = await (supabase as any).from("overview_categories")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); setEditingId(null); refresh(); }
  };

  const remove = async (id: string) => {
    if (!(await confirm({ title: "Delete category?", description: "Old entries will still show this category. This action removes it from the picker.", confirmText: "Delete", tone: "danger" }))) return;
    const { error } = await (supabase as any).from("overview_categories")
      .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: user?.id })
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  };

  const incomeCats = categories.filter((c) => c.entry_type === "income");
  const costCats = categories.filter((c) => c.entry_type === "cost");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" /> Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2">
            <Label className="text-xs">Add new category</Label>
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Owner Deposit"
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="rounded-md border border-input bg-transparent px-2 text-sm"
              >
                <option value="cost">Cost</option>
                <option value="income">Income</option>
              </select>
              <Button size="sm" onClick={add} disabled={!newName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lists */}
          <div className="grid gap-3 sm:grid-cols-2">
            <CatList
              title="Income"
              tone="success"
              items={incomeCats}
              editingId={editingId}
              editVal={editVal}
              setEditingId={setEditingId}
              setEditVal={setEditVal}
              onSave={saveEdit}
              onDelete={remove}
            />
            <CatList
              title="Cost"
              tone="danger"
              items={costCats}
              editingId={editingId}
              editVal={editVal}
              setEditingId={setEditingId}
              setEditVal={setEditVal}
              onSave={saveEdit}
              onDelete={remove}
            />
          </div>

          <p className="text-[10px] text-muted-foreground">
            Deleted categories are hidden from new entries but old entries remain unaffected.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CatList({
  title, tone, items, editingId, editVal, setEditingId, setEditVal, onSave, onDelete,
}: {
  title: string;
  tone: "success" | "danger";
  items: Cat[];
  editingId: string | null;
  editVal: string;
  setEditingId: (v: string | null) => void;
  setEditVal: (v: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border/70 p-2">
      <p className={cn(
        "px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider",
        tone === "success" ? "text-success" : "text-destructive",
      )}>{title}</p>
      {items.length === 0 ? (
        <p className="px-1 py-3 text-center text-[11px] text-muted-foreground">No custom categories</p>
      ) : (
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {items.map((c) => (
            <li key={c.id} className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-muted/40">
              {editingId === c.id ? (
                <>
                  <Input
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    className="h-7 text-xs"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && onSave(c.id)}
                  />
                  <button onClick={() => onSave(c.id)} className="text-success hover:opacity-70"><Check className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 truncate text-xs">{c.name}</span>
                  <button onClick={() => { setEditingId(c.id); setEditVal(c.name); }} className="text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => onDelete(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
