import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { SARAmount } from "@/components/sar-amount";
import { sortShops } from "@/lib/shop-order";
import { useShopPositions } from "@/hooks/use-shop-positions";
import { cn } from "@/lib/utils";
import {
  Info, Plus, Trash2, Wallet, Building2, Coins, Package,
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, ChevronRight, Save, History, Sparkles,
} from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { useWholesaleFinancials } from "@/lib/use-wholesale-financials";


export const Route = createFileRoute("/_app/summary")({
  component: SummaryPage,
});

const COMPANY_OPENING = 175000;
const LS_KEY = "summary_cash_holders_v1";

type Holder = { id: string; name: string; amount: number };

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadHolders(): Holder[] {
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
  const [holders, setHolders] = useState<Holder[]>([]);
  const [drill, setDrill] = useState<null | "shops" | "warehouse">(null);
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loaded = loadHolders();
    setHolders(loaded.length ? loaded : [{ id: uid(), name: "", amount: 0 }]);
  }, []);

  useEffect(() => {
    if (holders.length === 0) return;
    localStorage.setItem(LS_KEY, JSON.stringify(holders));
  }, [holders]);

  // ---- data ----
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops((data ?? []) as any[]);
    },
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
  void settings;
  const { data: txns = [] } = useQuery<any[]>({
    queryKey: ["txns"],
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false)).data ?? [],
  });
  void txns;

  // shop_entries no longer fetched here — useShopPositions owns the master calc.
  const { data: empEntries = [] } = useQuery<any[]>({
    queryKey: ["employee-entries", "all-with-date"],
    queryFn: async () =>
      ((await (supabase as any)
        .from("employee_entries")
        .select("employee_id, entry_type, amount, txn_date")
        .eq("is_deleted", false)).data ?? []) as any[],
  });

  // ---- Warehouse / Wholesale Value ----
  // SINGLE SOURCE OF TRUTH — shared with Wholesale Dashboard "Wholesale Value"
  // card via useWholesaleFinancials() so both pages always show the same number.
  const { data: whFin } = useWholesaleFinancials();
  const warehouse = useMemo(
    () => ({
      currentStock: whFin?.currentStock ?? 0,
      dueReceivable: whFin?.receivable ?? 0,
      currentValue: whFin?.warehouseValue ?? 0,
    }),
    [whFin],
  );


  // ---- Shop Cash Positions ----
  // SINGLE SOURCE OF TRUTH: must match Shop Page exactly. Shop Page defaults to
  // the "month" range (1st of working month → working date), so Home uses the
  // same bounds. Do NOT use { from: null } here — that would sum all-time and
  // diverge from the per-shop card values shown on the Shop Page.
  const shopRange = useMemo(() => {
    const [yy, mm, dd] = workingDate.split("-").map(Number);
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      from: `${yy}-${pad(mm || 1)}-01`,
      to: `${yy}-${pad(mm || 1)}-${pad(dd || 1)}`,
    };
  }, [workingDate]);
  const { byId: masterPositions } = useShopPositions(shopRange);

  const shopPositions = useMemo(
    () =>
      shops.map((s: any) => ({
        id: s.id,
        name: s.name,
        position: masterPositions.get(s.id) ?? 0,
      })),
    [shops, masterPositions],
  );

  // ALL-TIME Employee Outstanding — Monthly Closing must NOT affect this.
  // Closed months are still included so Cash In App stays consistent.
  const employeeOutstanding = useMemo(() => {
    let given = 0, received = 0;
    for (const e of empEntries) {
      const amt = Number(e.amount) || 0;
      if (e.entry_type === "given") given += amt;
      else received += amt;
    }
    return given - received;
  }, [empEntries]);

  // ---- Current Company Balance (same as Company Transactions page card) ----
  // = Opening Balance (for month) + Company Income − Company Expense (this month).
  const monthKey = useMemo(() => `${shopRange.from.slice(0, 7)}-01`, [shopRange.from]);
  const { data: companyTxns = [] } = useQuery<any[]>({
    queryKey: ["company_txns", shopRange.from, shopRange.to],
    queryFn: async () =>
      ((await (supabase as any)
        .from("company_transactions")
        .select("txn_type, amount")
        .eq("is_deleted", false)
        .gte("txn_date", shopRange.from)
        .lte("txn_date", shopRange.to)).data ?? []) as any[],
  });
  const { data: companyOpening = 0 } = useQuery<number>({
    queryKey: ["company_opening_balance", monthKey],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("company_opening_balances")
        .select("amount")
        .eq("month", monthKey)
        .maybeSingle();
      return Number(data?.amount ?? 0);
    },
  });
  const currentCompanyBalance = useMemo(() => {
    let income = 0, expense = 0;
    for (const r of companyTxns) {
      const a = Number(r.amount) || 0;
      if (r.txn_type === "income") income += a;
      else if (r.txn_type === "expense") expense += a;
    }
    return companyOpening + income - expense;
  }, [companyTxns, companyOpening]);

  const totalShopCash = shopPositions.reduce((s, x) => s + x.position, 0);
  // Total Invest = Company Opening + Total Shop Cash Position + Current Company Balance
  const totalInvest = COMPANY_OPENING + totalShopCash + currentCompanyBalance;
  const wholesaleValue = warehouse.currentValue;
  // Cash In App = Total Invest − Wholesale Current Value − Employee Outstanding
  const totalCashInApp = totalInvest - wholesaleValue - employeeOutstanding;



  const totalCashInHand = holders.reduce((s, h) => s + (Number(h.amount) || 0), 0);
  const difference = totalCashInHand - totalCashInApp;

  // ---- holders mgmt ----
  const addHolder = () => setHolders((h) => [...h, { id: uid(), name: "", amount: 0 }]);
  const updateHolder = (id: string, patch: Partial<Holder>) =>
    setHolders((h) => h.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeHolder = (id: string) =>
    setHolders((h) => (h.length <= 1 ? h : h.filter((x) => x.id !== id)));

  // ---- cash in hand snapshots (history) ----
  const { data: snapshots = [] } = useQuery<any[]>({
    queryKey: ["cash_in_hand_snapshots"],
    queryFn: async () =>
      ((await (supabase as any)
        .from("cash_in_hand_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(60)).data ?? []) as any[],
  });

  const saveSnapshot = async () => {
    if (!user) { toast.error("Please sign in"); return; }
    setSaving(true);
    const payload = {
      snapshot_date: workingDate,
      cash_in_hand: Number(totalCashInHand.toFixed(2)),
      cash_in_app: Number(totalCashInApp.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      holders: holders.filter((h) => h.name || h.amount),
      created_by: user.id,
    };
    const { error } = await (supabase as any).from("cash_in_hand_snapshots").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message || "Save failed"); return; }
    toast.success(`Saved snapshot for ${workingDate}`);
    qc.invalidateQueries({ queryKey: ["cash_in_hand_snapshots"] });
  };

  const deleteSnapshot = async (id: string) => {
    const { error } = await (supabase as any).from("cash_in_hand_snapshots").delete().eq("id", id);
    if (error) { toast.error(error.message || "Delete failed"); return; }
    toast.success("Snapshot deleted");
    qc.invalidateQueries({ queryKey: ["cash_in_hand_snapshots"] });
  };

  // ---- status ----
  let statusTone: "perfect" | "short" | "extra" = "perfect";
  if (difference < -0.01) statusTone = "short";
  else if (difference > 0.01) statusTone = "extra";

  const statusMeta = {
    perfect: {
      label: "Perfect Match",
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      pill: "bg-emerald-100 text-emerald-700",
    },
    short: {
      label: "Cash Shortage",
      icon: TrendingDown,
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      pill: "bg-rose-100 text-rose-700",
    },
    extra: {
      label: "Extra Cash Found",
      icon: TrendingUp,
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      pill: "bg-amber-100 text-amber-800",
    },
  }[statusTone];
  const StatusIcon = statusMeta.icon;

  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* TOTAL CASH IN APP */}
      <div className="-mx-1 px-1 md:-mx-8 md:px-8 md:pt-1 md:pb-2">
        <Card className="rounded-2xl border-teal-200/70 bg-gradient-to-r from-teal-50 via-white to-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Wallet className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700/80">Total Cash In App</p>
                <SARAmount value={totalCashInApp} size="2xl" className="text-teal-900 transition-all" />
              </div>
            </div>
            <InfoPop
              content={
                <InfoBlock
                  title="Total Cash In App"
                  formula={`Total Invest:        ${fmt(totalInvest)}\n− Wholesale Value:   ${fmt(wholesaleValue)}\n− Employee Outstand: ${fmt(employeeOutstanding)}\n──────────\n= Cash In App:       ${fmt(totalCashInApp)}`}
                  lines={["Total Invest − Wholesale Current Value − Employee Outstanding."]}


                />
              }
            />

          </div>
        </Card>
      </div>

      {/* Ask AI — lightweight on-demand access */}
      <Link
        to="/ai-insights"
        className="-mx-1 px-1 md:-mx-8 md:px-8"
        aria-label="Ask AI"
      >
        <Card className="flex items-center gap-3 rounded-2xl border-primary/30 bg-gradient-to-r from-primary/10 via-background to-background px-4 py-3 shadow-sm transition-all hover:from-primary/15 hover:shadow-[var(--shadow-glow)] active:scale-[0.99]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">Ask AI</p>
            <p className="truncate text-[13px] font-medium text-foreground">Get insights on demand</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
        </Card>
      </Link>


      {/* SECTION 1: COMPANY FOUNDATION (minimal finance rows) */}
      <SectionLabel index="01" title="Company Foundation" />
      <Card className="rounded-2xl px-4 py-3">
        <div className="divide-y divide-border/50">
          <FinanceRow
            label="Company Opening Balance"
            value={COMPANY_OPENING}
            info={
              <InfoBlock
                title="Company Opening Balance"
                lines={["Fixed company-level opening capital.", "Not editable."]}
                formula={`= ${fmt(COMPANY_OPENING)} SAR`}
              />
            }
          />
          <FinanceRow
            label="Total Shop Cash Position"
            value={totalShopCash}
            onClick={() => setDrill("shops")}
            info={
              <InfoBlock
                title="Total Shop Cash Position"
                lines={["Sum of Cash Position from every shop on the Shop Page (single source)."]}
                formula={
                  shopPositions.length
                    ? shopPositions.map((s) => `${s.name}: ${fmt(s.position)}`).join("\n") +
                      `\n──────────\nTotal: ${fmt(totalShopCash)}`
                    : "No shops yet"
                }
              />
            }
          />
          <FinanceRow
            label="Total Invest"
            value={totalInvest}
            emphasis
            info={
              <InfoBlock
                title="Total Invest"
                formula={`${fmt(COMPANY_OPENING)} + ${fmt(totalShopCash)} + ${fmt(currentCompanyBalance)} = ${fmt(totalInvest)}`}
                lines={["Company Opening Balance + Total Shop Cash Position + Current Company Balance."]}

              />
            }
          />
        </div>
      </Card>

      {/* SECTION 2: WHOLESALE & EMPLOYEE OUTSTANDING */}
      <SectionLabel index="02" title="Wholesale & Employee" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCard
          label="Wholesale Current Value"
          value={wholesaleValue}
          icon={Package}
          onClick={() => setDrill("warehouse")}
          info={
            <InfoBlock
              title="Wholesale Current Value"
              lines={["Same value as Warehouse → Current Value."]}
              formula={`Current Stock ${fmt(warehouse.currentStock)} + Receivable ${fmt(warehouse.dueReceivable)} = ${fmt(wholesaleValue)}`}
            />
          }
        />
        <StatCard
          label="Employee Outstanding"
          value={employeeOutstanding}
          icon={Coins}
          info={
            <InfoBlock
              title="Employee Outstanding"
              lines={["All-time outstanding (Given − Received). Not affected by Monthly Closing."]}
              formula={`Σ Given − Σ Received (all time) = ${fmt(employeeOutstanding)}`}

            />
          }
        />
        <StatCard
          label="Current Company Balance"
          value={currentCompanyBalance}
          icon={Building2}
          info={
            <InfoBlock
              title="Current Company Balance"
              lines={["Same as Company Transactions → Current Company Balance card."]}
              formula={`Opening ${fmt(companyOpening)} + Income − Expense = ${fmt(currentCompanyBalance)}`}

            />
          }
        />
      </div>

      {/* Total Cash In App is shown in the sticky bar at top of page. */}



      {/* SECTION 4: CASH IN HAND */}
      <SectionLabel index="04" title="Cash In Hand" />
      <Card className="rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-sm font-semibold">Real-world cash holders</p>
            <p className="text-xs text-muted-foreground">Add every person or location that physically holds cash.</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {holders.map((h, i) => (
            <div
              key={h.id}
              className="grid grid-cols-[1fr_140px_36px] items-center gap-2 rounded-xl border border-border/60 bg-card/50 p-2"
            >
              <Input
                placeholder={`Holder ${i + 1} name`}
                value={h.name}
                onChange={(e) => updateHolder(h.id, { name: e.target.value })}
                className="h-10 border-none bg-transparent focus-visible:ring-1"
              />
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={h.amount || ""}
                onChange={(e) => updateHolder(h.id, { amount: parseFloat(e.target.value) || 0 })}
                className="h-10 text-end tabular-nums"
              />
              <button
                type="button"
                onClick={() => removeHolder(h.id)}
                disabled={holders.length <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                aria-label="Remove holder"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addHolder}
          className="mt-3 w-full gap-1.5 border-dashed"
        >
          <Plus className="h-4 w-4" /> Add Holder
        </Button>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Cash In Hand
          </span>
          <SARAmount value={totalCashInHand} size="xl" />
        </div>

        <Button
          onClick={saveSnapshot}
          disabled={saving}
          className="mt-3 w-full gap-1.5"
          size="sm"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : `Save Today (${workingDate})`}
        </Button>
      </Card>

      {/* CASH IN HAND HISTORY */}
      <SectionLabel index="04b" title="Cash In Hand History" />
      <Card className="rounded-2xl p-4">
        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <History className="h-5 w-5 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">No saved snapshots yet. Save your first daily cash count above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {snapshots.map((s: any) => {
              const diff = Number(s.difference) || 0;
              const tone = diff < -0.01 ? "short" : diff > 0.01 ? "extra" : "perfect";
              const toneMeta = {
                perfect: { label: "Matched", chip: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
                short:   { label: `Shortage ${fmt(diff)}`, chip: "bg-rose-100 text-rose-700", icon: TrendingDown },
                extra:   { label: `Extra +${fmt(diff)}`, chip: "bg-amber-100 text-amber-800", icon: TrendingUp },
              }[tone];
              const Icon = toneMeta.icon;
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold tabular-nums">{s.snapshot_date}</span>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", toneMeta.chip)}>
                        <Icon className="h-3 w-3" />
                        {toneMeta.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Hand {fmt(Number(s.cash_in_hand))} · App {fmt(Number(s.cash_in_app))}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSnapshot(s.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete snapshot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* SECTION 5: DIFFERENCE */}
      <SectionLabel index="05" title="Verification" />
      <Card className={cn("rounded-2xl border p-5", statusMeta.bg, statusMeta.border)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusMeta.pill)}>
              <StatusIcon className="h-3 w-3" />
              {statusMeta.label}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Cash In Hand − Cash In App
            </p>
          </div>
          <InfoPop
            content={
              <InfoBlock
                title="Difference"
                formula={`${fmt(totalCashInHand)} − ${fmt(totalCashInApp)} = ${fmt(difference)}`}
                lines={[
                  "0 → Perfect Match",
                  "Negative → Cash Shortage",
                  "Positive → Extra Cash Found",
                ]}
              />
            }
          />
        </div>
        <div className="mt-3">
          <SARAmount
            value={Math.abs(difference)}
            size="3xl"
            className={statusMeta.text}
          />
        </div>
      </Card>

      {/* Drill sheets */}
      <Sheet open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>
              {drill === "shops" ? "Shop Cash Position Breakdown" : "Warehouse Current Value"}
            </SheetTitle>
          </SheetHeader>

          {drill === "shops" && (
            <div className="mt-4 space-y-2">
              {shopPositions.length === 0 && (
                <p className="text-sm text-muted-foreground">No shops yet.</p>
              )}
              {shopPositions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <Coins className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <SARAmount value={s.position} size="md" />
                </div>
              ))}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Total
                </span>
                <SARAmount value={totalShopCash} size="lg" className="text-teal-900" />
              </div>
            </div>
          )}

          {drill === "warehouse" && (
            <div className="mt-4 space-y-2">
              <BreakdownRow label="Current Stock" value={warehouse.currentStock} />
              <BreakdownRow label="Receivable" value={warehouse.dueReceivable} />
              <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Current Value
                </span>
                <SARAmount value={wholesaleValue} size="lg" className="text-teal-900" />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Helpers ----------

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n || 0);
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/60">
        {index}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  );
}

function FinanceRow({
  label, value, info, emphasis, onClick,
}: {
  label: string;
  value: number;
  info?: React.ReactNode;
  emphasis?: boolean;
  onClick?: () => void;
}) {
  const clickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 py-2.5",
        clickable && "cursor-pointer rounded-lg -mx-2 px-2 hover:bg-muted/40 active:scale-[0.995] transition-colors",
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={cn(
          "truncate text-[12.5px]",
          emphasis ? "font-semibold text-foreground" : "text-muted-foreground",
        )}>
          {label}
        </span>
        {info && <InfoPop content={info} />}
      </div>
      <div className="flex items-center gap-1">
        <SARAmount value={value} size={emphasis ? "lg" : "md"} className={emphasis ? "text-teal-900" : undefined} />
        {clickable && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
      </div>
    </div>
  );
}


function StatCard({
  label, value, icon: Icon, info, accent, locked, fullWidth, onClick,
}: {
  label: string;
  value: number;
  icon: any;
  info?: React.ReactNode;
  accent?: boolean;
  locked?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}) {
  const clickable = !!onClick;
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative rounded-2xl p-4 transition-all",
        accent && "border-teal-200/70 bg-gradient-to-br from-teal-50/60 to-white",
        clickable && "cursor-pointer hover:border-teal-300 hover:shadow-md active:scale-[0.99]",
        fullWidth && "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent ? "bg-teal-100 text-teal-700" : "bg-muted text-muted-foreground",
          )}>
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {locked && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Fixed
            </span>
          )}
          {info && <InfoPop content={info} />}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <SARAmount value={value} size={fullWidth ? "2xl" : "xl"} />
        {clickable && <ChevronRight className="h-4 w-4 text-muted-foreground/60" />}
      </div>
    </Card>
  );
}

function InfoPop({ content }: { content: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground"
          aria-label="Info"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-72 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

function InfoBlock({
  title, formula, lines,
}: {
  title: string;
  formula?: string;
  lines?: string[];
}) {
  return (
    <div>
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          Live formula
        </p>
      </div>
      <div className="space-y-3 px-4 py-3 text-[12px] leading-relaxed">
        {lines?.map((l, i) => (
          <p key={i} className="text-foreground/80">{l}</p>
        ))}
        {formula && (
          <pre className="whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground">
            {formula}
          </pre>
        )}
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <SARAmount value={value} size="md" />
    </div>
  );
}
