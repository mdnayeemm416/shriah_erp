import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Info, Calendar, TrendingDown, TrendingUp, CheckCircle2,
  Lock, AlertTriangle, History, Share2, PackageOpen, Trash2, Pencil, Plus,
  X, RotateCcw,
} from "lucide-react";
import { useWorkingDate } from "@/hooks/use-working-date";
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { SAR } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { sortShops } from "@/lib/shop-order";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditHistoryButton } from "@/components/edit-history";
import { ClosingAssistant } from "@/components/closing-assistant";

type Holder = { id: string; name: string; amount: number };
const newHolderId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
const DEFAULT_HOLDERS: Holder[] = [
  { id: "h-main", name: "Main Drawer", amount: 0 },
];

export const Route = createFileRoute("/_app/daily-closing")({
  component: DailyClosingPage,
});

type CardKey =
  | "opening" | "cash_sale" | "withdraw" | "purchase"
  | "expense" | "employee" | "received" | "given"
  | "expected" | "actual" | "difference" | "distribution";

const DIST_TARGETS = ["Azzouz", "Nujum", "Aklas", "Khaled", "Warehouse"] as const;
type DistRow = { name: string; amount: number };

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n || 0);
}

function DailyClosingPage() {
  const qc = useQueryClient();
  const { workingDate } = useWorkingDate();
  const [date, setDate] = useState<string>(workingDate);
  const [holders, setHolders] = useState<Holder[]>(DEFAULT_HOLDERS);
  const [openingOverride, setOpeningOverride] = useState<string>("");
  const [openingLocked, setOpeningLocked] = useState<boolean>(true);
  const [distLocked, setDistLocked] = useState<boolean>(true);
  const [openingEditWarn, setOpeningEditWarn] = useState(false);
  const [distEditWarn, setDistEditWarn] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<any | null>(null);
  const [cardDetail, setCardDetail] = useState<CardKey | null>(null);
  const [distribution, setDistribution] = useState<DistRow[]>(
    DIST_TARGETS.map((n) => ({ name: n, amount: 0 })),
  );
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const { user } = useAuth();

  // admin role check
  const { data: isAdmin = false } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", user!.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  useEffect(() => { setDate(workingDate); }, [workingDate]);

  // Next-day date (for auto tomorrow distribution) — uses LOCAL components to avoid UTC drift
  const nextDate = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setDate(dt.getDate() + 1);
    const ny = dt.getFullYear();
    const nm = String(dt.getMonth() + 1).padStart(2, "0");
    const nd = String(dt.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
  }, [date]);

  // ---- today's activity (source tables — guarantees no duplicate counting) ----
  const { data: shopEntries = [] } = useQuery<any[]>({
    queryKey: ["shop_entries_for_day", date],
    queryFn: async () => (await supabase
      .from("shop_entries").select("*").eq("is_deleted", false)
      .eq("txn_date", date)).data ?? [],
  });
  const { data: whEntries = [] } = useQuery<any[]>({
    queryKey: ["wh_ledger_for_day", date],
    queryFn: async () => (await supabase
      .from("warehouse_ledger").select("*").eq("is_deleted", false)
      .eq("txn_date", date)).data ?? [],
  });
  const { data: empEntries = [] } = useQuery<any[]>({
    queryKey: ["employee_entries_for_day", date],
    queryFn: async () => (((await (supabase as any)
      .from("employee_entries").select("*").eq("is_deleted", false)
      .eq("txn_date", date)).data) ?? []) as any[],
  });

  // Tomorrow's shop purchase entries (for auto distribution)
  const { data: tomorrowPurchases = [] } = useQuery<any[]>({
    queryKey: ["shop_entries_for_day", nextDate, "purchase"],
    queryFn: async () => (await supabase
      .from("shop_entries").select("*").eq("is_deleted", false)
      .eq("txn_date", nextDate).eq("entry_type", "purchase")).data ?? [],
  });

  // legacy: transactions for "Other cash in" (overview / manual cash entries not synced from sources above)
  const { data: txns = [] } = useQuery<any[]>({
    queryKey: ["txns_for_day", date],
    queryFn: async () => (await supabase
      .from("transactions").select("*").eq("is_deleted", false)
      .eq("txn_date", date)).data ?? [],
  });

  const { data: shopList = [] } = useQuery<any[]>({
    queryKey: ["shops_for_closing"],
    queryFn: async () => (await supabase.from("shops").select("id,name").eq("is_deleted", false)).data ?? [],
  });
  const shopName = (id: string | null | undefined) =>
    (shopList.find((s) => s.id === id) as any)?.name ?? "—";

  // ---- previous closing → suggested opening ----
  const { data: prevClosing } = useQuery<any | null>({
    queryKey: ["daily_closings_prev", date],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("daily_closings").select("*").eq("is_deleted", false)
        .lt("closing_date", date)
        .order("closing_date", { ascending: false })
        .limit(1).maybeSingle();
      return data ?? null;
    },
  });

  // ---- existing closing for selected date ----
  const { data: existingClosing } = useQuery<any | null>({
    queryKey: ["daily_closings_on", date],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("daily_closings").select("*").eq("is_deleted", false)
        .eq("closing_date", date).maybeSingle();
      return data ?? null;
    },
  });

  // ---- closing history ----
  const { data: closings = [] } = useQuery<any[]>({
    queryKey: ["daily_closings_recent"],
    queryFn: async () => (await (supabase as any)
      .from("daily_closings").select("*").eq("is_deleted", false)
      .order("closing_date", { ascending: false })
      .limit(30)).data ?? [],
  });

  // Auto-fill tomorrow distribution from next-day purchase entries (grouped by shop)
  // Only auto-fills when user hasn't manually typed values yet for this date
  const autoDistribution = useMemo<DistRow[]>(() => {
    const byShop = new Map<string, number>();
    for (const e of tomorrowPurchases) {
      const name = shopName(e.shop_id) ?? "—";
      byShop.set(name, (byShop.get(name) || 0) + Number(e.purchase_amount || 0));
    }
    return DIST_TARGETS.map((n) => ({
      name: n,
      amount: Math.floor(byShop.get(n) || 0),
    }));
  }, [tomorrowPurchases, shopList]);

  // hydrate form from existing / suggested opening
  useEffect(() => {
    if (existingClosing) {
      const savedHolders = Array.isArray(existingClosing.holders) ? existingClosing.holders : [];
      const mapped: Holder[] = savedHolders
        .filter((h: any) => h && (h.name || h.amount !== undefined))
        .map((h: any) => ({
          id: newHolderId(),
          name: String(h.name ?? "Cash"),
          amount: Number(h.amount) || 0,
        }));
      setHolders(mapped.length > 0 ? mapped : [{ id: newHolderId(), name: "Main Drawer", amount: Number(existingClosing.counted_cash) || 0 }]);
      setOpeningOverride(String(existingClosing.opening_cash ?? ""));
      // Lock by default; user opens edit explicitly
      setOpeningLocked(true);
      setDistLocked(true);
      setNotes(existingClosing.notes ?? "");
      const saved = Array.isArray(existingClosing.distribution) ? existingClosing.distribution : [];
      setDistribution(
        DIST_TARGETS.map((n) => {
          const row = saved.find((r: any) => (r?.name ?? "").toLowerCase() === n.toLowerCase());
          return { name: n, amount: Number(row?.amount) || 0 };
        }),
      );
    } else {
      setHolders([{ id: newHolderId(), name: "Main Drawer", amount: 0 }]);
      setOpeningOverride("");
      setOpeningLocked(true);
      setDistLocked(true);
      setNotes("");
      setDistribution(autoDistribution);
    }
  }, [existingClosing?.id, prevClosing?.id, autoDistribution]);

  // ---- derived ----
  const suggestedOpening = Number(prevClosing?.counted_cash ?? 0);
  // Locked → always use auto (suggested). Unlocked → use the override field.
  const openingCash = openingLocked
    ? suggestedOpening
    : (openingOverride === "" ? suggestedOpening : Number(openingOverride) || 0);
  const openingOverridden = !openingLocked && Math.abs(openingCash - suggestedOpening) > 0.01;
  const autoDistTotal = useMemo(
    () => autoDistribution.reduce((s, r) => s + (Number(r.amount) || 0), 0),
    [autoDistribution],
  );

  // Aggregate from SOURCE TABLES (deduped via primary key) — prevents
  // duplicate counting that exists in legacy `transactions` rows.
  const cashSale = useMemo(
    () => shopEntries.filter((e) => e.entry_type === "sale")
      .reduce((s, e) => s + Number(e.cash_sale || 0), 0),
    [shopEntries],
  );
  const withdraw = useMemo(
    () => shopEntries.filter((e) => e.entry_type === "withdraw")
      .reduce((s, e) => s + Number(e.withdraw_amount || 0), 0),
    [shopEntries],
  );
  // Other manual cash-in via Transactions page (not synced from sources above)
  const otherCashIn = useMemo(
    () => txns.filter((t) => t.type === "cash_in" && t.payment_method === "cash"
      && !t.source) // pure manual entries only
      .reduce((s, t) => s + Number(t.amount || 0), 0),
    [txns],
  );
  const employeeReceived = useMemo(
    () => empEntries.filter((e) => e.entry_type === "received")
      .reduce((s, e) => s + Number(e.amount || 0), 0),
    [empEntries],
  );

  const shopPurchase = useMemo(
    () => shopEntries.filter((e) => e.entry_type === "purchase")
      .reduce((s, e) => s + Number(e.purchase_amount || 0), 0),
    [shopEntries],
  );
  const whPurchase = useMemo(
    () => whEntries.filter((e) =>
      e.entry_type === "warehouse_purchase" &&
      (e.payment_status === "cash" || e.payment_status === "partial"))
      .reduce((s, e) => s + Number(e.payment_status === "cash" ? e.amount : e.paid_amount || 0), 0),
    [whEntries],
  );
  const purchase = shopPurchase + whPurchase;

  const employeePaid = useMemo(
    () => empEntries.filter((e) => e.entry_type === "given")
      .reduce((s, e) => s + Number(e.amount || 0), 0),
    [empEntries],
  );
  const expense = useMemo(
    () => shopEntries.filter((e) => e.entry_type === "expense")
      .reduce((s, e) => s + Number(e.expense_amount || 0), 0)
      + txns.filter((t) => t.type === "cash_out" && !t.source)
        .reduce((s, t) => s + Number(t.amount || 0), 0),
    [shopEntries, txns],
  );

  const totalReceived = cashSale + withdraw + otherCashIn + employeeReceived;
  const totalGiven = purchase + expense + employeePaid;
  const distributionTotal = useMemo(
    () => distribution.reduce((s, r) => s + (Number(r.amount) || 0), 0),
    [distribution],
  );
  const totalAvailable = openingCash + totalReceived;

  // NEW Expected Cash formula (excludes Cash Sale & Purchase):
  // (Opening + Withdraw + Other Income + Employee Received)
  //   − (Tomorrow Distribution + Expense + Employee Given)
  const expectedInflow = openingCash + withdraw + otherCashIn + employeeReceived;
  const expectedOutflow = distributionTotal + expense + employeePaid;
  const expectedClosing = expectedInflow - expectedOutflow;
  const expectedNegative = expectedClosing < 0;

  const totalCounted = useMemo(
    () => holders.reduce((s, h) => s + (Number(h.amount) || 0), 0),
    [holders],
  );
  const anyHolderEntered = holders.some((h) => Number(h.amount) > 0);
  const diff = totalCounted - expectedClosing;

  let statusTone: "matched" | "shortage" | "extra" = "matched";
  if (diff < -0.01) statusTone = "shortage";
  else if (diff > 0.01) statusTone = "extra";

  const statusMeta = {
    matched: {
      label: "Closing Matched", icon: CheckCircle2,
      bg: "bg-muted/40", border: "border-border/60", text: "text-foreground/70",
      pill: "bg-muted text-foreground/70",
    },
    shortage: {
      label: "Cash Shortage", icon: TrendingDown,
      bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700",
      pill: "bg-rose-100 text-rose-700",
    },
    extra: {
      label: "Extra Cash", icon: TrendingUp,
      bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700",
      pill: "bg-emerald-100 text-emerald-700",
    },
  }[statusTone];
  const StatusIcon = statusMeta.icon;

  // tamper detection
  const lockWarning = useMemo(() => {
    if (!existingClosing) return null;
    const closedAt = new Date(existingClosing.updated_at || existingClosing.created_at).getTime();
    return [
      ...txns.map((t) => new Date(t.created_at).getTime()),
      ...shopEntries.map((e) => new Date(e.created_at).getTime()),
    ].some((ts) => ts > closedAt);
  }, [existingClosing, txns, shopEntries]);

  // ---- save ----
  const saveClosing = async () => {
    if (totalCounted <= 0 && !anyHolderEntered) {
      return toast.error("Enter the actual cash in hand");
    }
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");
      const holdersPayload = holders
        .filter((h) => Number(h.amount) > 0 || (h.name && h.name.trim() !== ""))
        .map((h) => ({ name: h.name || "Cash", amount: Number(h.amount) || 0 }));
      const payload = {
        closing_date: date,
        opening_cash: openingCash,
        cash_sale: cashSale + otherCashIn + employeeReceived,
        withdraw,
        purchase,
        expense: expense + employeePaid,
        expected_cash: expectedClosing,
        counted_cash: totalCounted,
        difference: diff,
        status: statusTone,
        notes: notes || null,
        holders: holdersPayload,
        distribution: distribution.filter((r) => r.amount > 0),
        distribution_total: distributionTotal,
        created_by: userId,
      };
      const wasNew = !existingClosing;
      if (existingClosing) {
        const { error } = await (supabase as any)
          .from("daily_closings").update(payload).eq("id", existingClosing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("daily_closings").insert(payload);
        if (error) throw error;
      }
      toast.success(existingClosing ? "Closing updated" : "Closing saved");
      qc.invalidateQueries({ queryKey: ["daily_closings_recent"] });
      qc.invalidateQueries({ queryKey: ["daily_closings_on", date] });
      qc.invalidateQueries({ queryKey: ["daily_closings_prev"] });
      // Auto-reset transient inputs after a fresh confirm (does NOT touch saved snapshot)
      if (wasNew) {
        setHolders([{ id: newHolderId(), name: "Main Drawer", amount: 0 }]);
        setOpeningOverride("");
        setOpeningLocked(true);
        setDistLocked(true);
        setNotes("");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save closing");
    } finally {
      setSaving(false);
    }
  };

  // ---- delete closing (admin, testing phase) ----
  const deleteClosing = async (id: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const { error } = await (supabase as any)
        .from("daily_closings")
        .update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: userId })
        .eq("id", id);
      if (error) throw error;
      toast.success("Closing deleted");
      setDeleteTarget(null);
      setDetail(null);
      qc.invalidateQueries({ queryKey: ["daily_closings_recent"] });
      qc.invalidateQueries({ queryKey: ["daily_closings_on", date] });
      qc.invalidateQueries({ queryKey: ["daily_closings_prev"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to delete closing");
    }
  };

  // edit closing → jump to its date so it hydrates into the form
  const editClosing = (c: any) => {
    setDate(c.closing_date);
    setDetail(null);
    toast.message("Edit mode", { description: `Loaded closing for ${c.closing_date}` });
  };

  // ---- WhatsApp closing report ----
  const shareClosingReport = async () => {
    const rows: { label: string; value: string }[] = [
      { label: "Opening Cash", value: SAR(openingCash) },
      { label: "Cash Sale", value: SAR(cashSale) },
      { label: "Withdraw", value: SAR(withdraw) },
    ];
    if (employeeReceived) rows.push({ label: "Employee Received", value: SAR(employeeReceived) });
    if (otherCashIn) rows.push({ label: "Other Cash In", value: SAR(otherCashIn) });
    rows.push({ label: "— Total Received", value: SAR(totalReceived) });
    rows.push({ label: "Purchase", value: "− " + SAR(purchase) });
    rows.push({ label: "Expense", value: "− " + SAR(expense) });
    if (employeePaid) rows.push({ label: "Employee Payment", value: "− " + SAR(employeePaid) });
    rows.push({ label: "— Total Given", value: "− " + SAR(totalGiven) });
    if (distributionTotal > 0) {
      distribution
        .filter((r) => r.amount > 0)
        .forEach((r) => rows.push({ label: `Distrib · ${r.name}`, value: "− " + SAR(r.amount) }));
      rows.push({ label: "— Tomorrow Distribution", value: "− " + SAR(distributionTotal) });
    }
    rows.push({ label: "Expected Cash", value: SAR(expectedClosing) });
    rows.push({ label: "Actual Cash", value: SAR(totalCounted) });

    await shareToWhatsApp({
      title: "Daily Closing",
      subtitle: date,
      amount: SAR(Math.abs(diff)),
      amountLabel: statusMeta.label,
      badge: statusTone === "matched" ? "Matched" : statusTone === "extra" ? "Extra Cash" : "Shortage",
      accent: statusTone === "shortage" ? "out" : statusTone === "extra" ? "in" : "neutral",
      date,
      rows,
      notes: notes || null,
      footerNote: "By AhsAN Manager ShRiAh Group",
    });
  };


  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* Date chip */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-xs font-medium outline-none"
          />
        </div>
      </div>

      {existingClosing && (
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          Closing already saved for this date. Editing will update it.
        </div>
      )}
      {lockWarning && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          <AlertTriangle className="h-3 w-3" />
          Entries changed after closing — re-save to reconcile.
        </div>
      )}

      {/* 01 — OPENING CASH (auto, click Edit to override) */}
      <SectionLabel index="01" title="Opening Cash" />
      <Card
        onClick={() => setCardDetail("opening")}
        className="cursor-pointer rounded-2xl border-border/60 p-4 transition-all hover:border-primary/40"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cash on hand before today
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/80">
              {prevClosing
                ? `Auto from ${prevClosing.closing_date}: ${fmt(suggestedOpening)}`
                : "No prior closing — enter manually"}
            </p>
            {openingOverridden && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800">
                  Manual Override
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpeningOverride("");
                    setOpeningLocked(true);
                    toast.success("Opening Cash reset to auto value");
                  }}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> Reset to Auto
                </button>
              </div>
            )}
          </div>
          {openingLocked ? (
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-semibold tabular-nums">{fmt(suggestedOpening)}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpeningEditWarn(true); }}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 bg-background px-2 text-[11px] text-muted-foreground hover:bg-muted"
                aria-label="Edit opening cash"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            </div>
          ) : (
            <Input
              type="number" inputMode="decimal"
              value={openingOverride}
              placeholder={String(suggestedOpening)}
              onChange={(e) => setOpeningOverride(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="h-10 w-32 text-end font-display text-base font-semibold tabular-nums"
            />
          )}
        </div>
      </Card>

      <AlertDialog open={openingEditWarn} onOpenChange={setOpeningEditWarn}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Override auto-calculated value?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are overriding automatically calculated finance values. Opening Cash is normally carried forward from the previous day's closing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setOpeningLocked(false);
              if (openingOverride === "") setOpeningOverride(String(suggestedOpening));
              setOpeningEditWarn(false);
            }}>
              Continue Editing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 02 — TODAY CASH RECEIVED */}
      <SectionLabel index="02" title="Today Cash Received" />
      <Card
        onClick={() => setCardDetail("received")}
        className="cursor-pointer rounded-2xl border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-white p-4 transition-all hover:border-emerald-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            Total Received
          </span>
          <InfoPop content={
            <InfoBlock title="Today Cash Received"
              formula={`${fmt(cashSale)} (sale) + ${fmt(withdraw)} (withdraw) + ${fmt(otherCashIn + employeeReceived)} (other)\n= ${fmt(totalReceived)}`}
            />
          } />
        </div>
        <div className="mt-1.5">
          <SARAmount value={totalReceived} size="2xl" className="text-emerald-900" />
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Cash Sale" value={cashSale} onClick={() => setCardDetail("cash_sale")} />
        <MiniStat label="Withdraw" value={withdraw} onClick={() => setCardDetail("withdraw")} />
        <MiniStat label="Other In" value={otherCashIn + employeeReceived} />
      </div>

      {/* 03 — TODAY CASH GIVEN */}
      <SectionLabel index="03" title="Today Cash Given" />
      <Card
        onClick={() => setCardDetail("given")}
        className="cursor-pointer rounded-2xl border-rose-200/60 bg-gradient-to-br from-rose-50 via-white to-white p-4 transition-all hover:border-rose-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">
            Total Given
          </span>
          <InfoPop content={
            <InfoBlock title="Today Cash Given"
              formula={`${fmt(purchase)} (purchase) + ${fmt(expense)} (expense) + ${fmt(employeePaid)} (employees)\n= ${fmt(totalGiven)}`}
            />
          } />
        </div>
        <div className="mt-1.5">
          <SARAmount value={totalGiven} size="2xl" className="text-rose-900" />
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Purchase" value={purchase} onClick={() => setCardDetail("purchase")} />
        <MiniStat label="Expense" value={expense} onClick={() => setCardDetail("expense")} />
        <MiniStat label="Employee" value={employeePaid} onClick={() => setCardDetail("employee")} />
      </div>

      {/* 04 — TOMORROW PURCHASE DISTRIBUTION */}
      <SectionLabel index="04" title="Tomorrow Purchase Distribution" />
      <Card className="rounded-2xl border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PackageOpen className="h-4 w-4 text-amber-700" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
              Cash given out tonight for tomorrow's purchases
            </span>
          </div>
          <div className="flex items-center gap-1">
            {distLocked ? (
              <button
                type="button"
                onClick={() => setDistEditWarn(true)}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-amber-300 bg-white px-2 text-[10px] text-amber-800 hover:bg-amber-50"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDistribution(autoDistribution);
                  setDistLocked(true);
                  toast.success("Distribution reset to auto values");
                }}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-amber-300 bg-white px-2 text-[10px] text-amber-800 hover:bg-amber-50"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
            <InfoPop content={
              <InfoBlock title="Tomorrow Purchase Distribution"
                formula={distribution.map((r) => `${r.name}: ${fmt(r.amount)}`).join("\n") + `\n= ${fmt(distributionTotal)}`}
                lines={["Subtracts from Expected Cash", "Use after collecting shop cash & withdrawing from bank"]}
              />
            } />
          </div>
        </div>
        {tomorrowPurchases.length === 0 && distributionTotal === 0 && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-100/40 px-2.5 py-1.5 text-[10.5px] text-amber-800">
            <AlertTriangle className="h-3 w-3" />
            No tomorrow purchase entries found for {nextDate}
          </div>
        )}
        {tomorrowPurchases.length > 0 && distLocked && (
          <div className="mb-2 rounded-lg border border-emerald-200/60 bg-emerald-50/60 px-2.5 py-1.5 text-[10.5px] text-emerald-800">
            Auto-filled from {tomorrowPurchases.length} purchase {tomorrowPurchases.length === 1 ? "entry" : "entries"} on {nextDate}
          </div>
        )}
        {!distLocked && Math.abs(distributionTotal - autoDistTotal) > 0.01 && (
          <div className="mb-2 flex items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-100/60 px-2.5 py-1.5 text-[10.5px] text-amber-900">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <div>
              <span className="font-semibold">Manual Override:</span> Difference detected: {distributionTotal - autoDistTotal >= 0 ? "+" : ""}{fmt(distributionTotal - autoDistTotal)} SAR from auto-calculated purchase distribution (auto = {fmt(autoDistTotal)}).
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          {distribution.map((row, idx) => {
            const autoVal = autoDistribution.find((r) => r.name === row.name)?.amount ?? 0;
            const rowOverride = !distLocked && Math.abs((Number(row.amount) || 0) - autoVal) > 0.01;
            return (
              <div key={row.name} className="flex items-center gap-2">
                <span className="flex-1 truncate text-[12px] font-medium text-foreground/85">
                  {row.name}
                  {rowOverride && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-[8.5px] font-semibold uppercase text-amber-800">
                      override
                    </span>
                  )}
                </span>
                {distLocked ? (
                  <span className="w-28 text-end font-display text-sm font-semibold tabular-nums text-foreground/85">
                    {fmt(row.amount)}
                  </span>
                ) : (
                  <Input
                    type="number" inputMode="numeric" step="1" min="0"
                    value={row.amount === 0 ? "" : String(row.amount)}
                    placeholder={String(autoVal)}
                    onChange={(e) => {
                      const v = Math.max(0, Math.floor(Number(e.target.value.replace(/\D/g, "")) || 0));
                      setDistribution((prev) =>
                        prev.map((r, i) => (i === idx ? { ...r, amount: v } : r)),
                      );
                    }}
                    className="h-9 w-28 text-end font-display text-sm font-semibold tabular-nums"
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setCardDetail("distribution")}
          className="mt-3 flex w-full items-center justify-between rounded-xl bg-amber-100/60 px-3 py-2 text-left transition hover:bg-amber-100"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Total Distributed
          </span>
          <SARAmount value={distributionTotal} size="lg" className="text-amber-900" />
        </button>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-amber-200/60 bg-white/60 px-3 py-1.5 text-[11px]">
          <span className="text-muted-foreground">Total Available</span>
          <span className="font-display font-semibold tabular-nums">{fmt(totalAvailable)}</span>
        </div>
      </Card>

      <AlertDialog open={distEditWarn} onOpenChange={setDistEditWarn}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Override auto-calculated values?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are overriding automatically calculated finance values. Tomorrow Purchase Distribution is normally filled from the next day's purchase entries (auto total = {fmt(autoDistTotal)} SAR).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setDistLocked(false); setDistEditWarn(false); }}>
              Continue Editing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 05 — EXPECTED CASH IN HAND */}
      <SectionLabel index="05" title="Expected Cash In Hand" />
      <Card
        onClick={() => setCardDetail("expected")}
        className={cn(
          "cursor-pointer rounded-2xl p-5 transition-all",
          expectedNegative
            ? "border-rose-300 bg-gradient-to-br from-rose-50 via-card to-card hover:border-rose-400"
            : "border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card hover:border-primary/50",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={cn(
              "text-[10px] font-semibold uppercase tracking-wider",
              expectedNegative ? "text-rose-700" : "text-primary",
            )}>
              Expected Cash
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Opening + Withdraw + Other In + Emp Received − Distribution − Expense − Emp Given
            </p>
          </div>
          <InfoPop content={
            <InfoBlock title="Expected Cash In Hand"
              formula={
                `Opening:            ${fmt(openingCash)}\n` +
                `+ Withdraw:         ${fmt(withdraw)}\n` +
                `+ Other Income:     ${fmt(otherCashIn)}\n` +
                `+ Emp Received:     ${fmt(employeeReceived)}\n` +
                `− Tomorrow Distrib: ${fmt(distributionTotal)}\n` +
                `− Expense:          ${fmt(expense)}\n` +
                `− Employee Given:   ${fmt(employeePaid)}\n` +
                `= Expected Cash:    ${fmt(expectedClosing)}`
              }
            />
          } />
        </div>
        <div className="mt-2">
          <SARAmount value={expectedClosing} size="3xl" className={expectedNegative ? "text-rose-700" : "text-foreground"} />
        </div>
        {expectedNegative && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-100/60 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            Expected Cash Negative
          </div>
        )}
      </Card>


      {/* 06 — ACTUAL CASH IN HAND (multi-holder) */}
      <SectionLabel index="06" title="Actual Cash In Hand" />
      <Card className="rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cash counted across all holders
          </p>
          <SARAmount value={totalCounted} size="lg" />
        </div>
        <div className="mt-3 space-y-2">
          {holders.map((h, idx) => (
            <div key={h.id} className="flex items-center gap-2">
              <Input
                type="text"
                value={h.name}
                placeholder="Label (e.g. Main Drawer)"
                onChange={(e) => setHolders((prev) =>
                  prev.map((row, i) => i === idx ? { ...row, name: e.target.value } : row),
                )}
                className="h-10 flex-1 text-[13px]"
              />
              <Input
                type="number" inputMode="numeric" step="1" placeholder="0"
                value={h.amount === 0 ? "" : String(h.amount)}
                onChange={(e) => {
                  const v = Math.max(0, Math.floor(Number(e.target.value.replace(/\D/g, "")) || 0));
                  setHolders((prev) =>
                    prev.map((row, i) => i === idx ? { ...row, amount: v } : row),
                  );
                }}
                className="h-10 w-28 text-end font-display text-sm font-semibold tabular-nums"
              />
              <button
                type="button"
                onClick={() => setHolders((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)}
                disabled={holders.length <= 1}
                className="flex h-10 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:bg-muted disabled:opacity-40"
                aria-label="Remove field"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setHolders((prev) => [...prev, { id: newHolderId(), name: "", amount: 0 }])}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/60"
        >
          <Plus className="h-3.5 w-3.5" /> Add Cash Field
        </button>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Final Actual Cash In Hand
          </span>
          <SARAmount value={totalCounted} size="xl" />
        </div>
      </Card>

      {/* 07 — DIFFERENCE */}
      <SectionLabel index="07" title="Difference" />
      <Card
        onClick={() => setCardDetail("difference")}
        className={cn("cursor-pointer rounded-2xl border p-5 transition-all", statusMeta.bg, statusMeta.border)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusMeta.pill)}>
            <StatusIcon className="h-3 w-3" />
            {statusMeta.label}
          </div>
          <InfoPop content={
            <InfoBlock title="Difference"
              formula={`${fmt(totalCounted)} − ${fmt(expectedClosing)} = ${diff >= 0 ? "+" : ""}${fmt(diff)}`}
              lines={["Positive → Extra cash", "Negative → Shortage", "Zero → Perfectly matched"]}
            />
          } />
        </div>
        <div className="mt-2">
          <SARAmount value={Math.abs(diff)} size="3xl" className={statusMeta.text} />
        </div>
      </Card>

      {/* SMART CLOSING ASSISTANT */}
      <SectionLabel index="AI" title="Closing Assistant" />
      <ClosingAssistant
        date={date}
        openingCash={openingCash}
        expected={expectedClosing}
        counted={totalCounted}
        diff={diff}
        cashSale={cashSale}
        withdraw={withdraw}
        purchase={purchase}
        expense={expense}
        employeePaid={employeePaid}
        employeeReceived={employeeReceived}
        distributionTotal={distributionTotal}
        shopEntries={shopEntries}
        whEntries={whEntries}
        empEntries={empEntries}
        tomorrowPurchases={tomorrowPurchases}
      />

      {/* NOTES */}
      <Card className="rounded-2xl p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Closing Notes (optional)
        </p>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any context about today's closing…"
          className="mt-2 min-h-[70px]"
        />
      </Card>

      {/* ACTIONS */}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button onClick={saveClosing} disabled={saving} className="h-12 text-base">
          {saving ? "Saving…" : existingClosing ? "Update Closing" : "Confirm Closing"}
        </Button>
        <Button
          onClick={shareClosingReport}
          variant="outline"
          className="h-12 px-4"
          aria-label="Share closing report"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 08 — HISTORY */}
      <SectionLabel index="08" title="Closing History" />
      {closings.length === 0 ? (
        <Card className="rounded-2xl p-6 text-center text-xs text-muted-foreground">
          <History className="mx-auto mb-2 h-5 w-5 opacity-60" />
          No closings yet.
        </Card>
      ) : (
        <div className="space-y-1.5">
          {closings.map((c) => {
            const d = Number(c.difference) || 0;
            const tone = Math.abs(d) < 0.01
              ? "text-foreground/70"
              : d > 0 ? "text-emerald-700" : "text-rose-700";
            return (
              <button
                key={c.id}
                onClick={() => setDetail(c)}
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-start transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{c.closing_date}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Exp {fmt(Number(c.expected_cash))} · Cnt {fmt(Number(c.counted_cash))}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Diff</p>
                  <span className={cn("font-display text-sm font-semibold tabular-nums", tone)}>
                    {d >= 0 ? "+" : ""}{fmt(d)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* CARD DETAIL SHEET */}
      <CardDetailSheet
        cardKey={cardDetail}
        onClose={() => setCardDetail(null)}
        date={date}
        opening={openingCash}
        cashSale={cashSale}
        withdraw={withdraw}
        purchase={purchase}
        expense={expense}
        employeePaid={employeePaid}
        employeeReceived={employeeReceived}
        otherCashIn={otherCashIn}
        totalReceived={totalReceived}
        totalGiven={totalGiven}
        expected={expectedClosing}
        counted={totalCounted}
        diff={diff}
        txns={txns}
        shopEntries={shopEntries}
        whEntries={whEntries}
        empEntries={empEntries}
        tomorrowPurchases={tomorrowPurchases}
        nextDate={nextDate}
        prevClosing={prevClosing}
        shopName={shopName}
        distribution={distribution}
        distributionTotal={distributionTotal}
      />

      {/* HISTORY DETAIL SHEET */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Closing — {detail?.closing_date}</SheetTitle>
          </SheetHeader>
          {detail && (
            <div className="mt-4 space-y-2">
              <BreakdownRow label="Opening Cash" value={Number(detail.opening_cash)} />
              <BreakdownRow label="Cash Sale + Other" value={Number(detail.cash_sale)} />
              <BreakdownRow label="Withdraw" value={Number(detail.withdraw)} />
              <BreakdownRow label="Purchase" value={-Number(detail.purchase)} />
              <BreakdownRow label="Expense + Employee" value={-Number(detail.expense)} />
              {Number(detail.distribution_total) > 0 && (
                <BreakdownRow label="Tomorrow Distribution" value={-Number(detail.distribution_total)} />
              )}
              {Array.isArray(detail.distribution) && detail.distribution.length > 0 && (
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                    Distribution breakdown
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {detail.distribution.map((r: any, i: number) => (
                      <li key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-foreground/85">{r.name}</span>
                        <span className="font-display font-semibold tabular-nums">{fmt(Number(r.amount))}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Expected</span>
                <SARAmount value={Number(detail.expected_cash)} size="lg" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actual</span>
                <SARAmount value={Number(detail.counted_cash)} size="lg" />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difference</span>
                <SARAmount value={Number(detail.difference)} size="lg" showSign />
              </div>
              {detail.notes && (
                <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap text-foreground/85">{detail.notes}</p>
                </div>
              )}

              {Array.isArray(detail.holders) && detail.holders.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card/50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Cash Holders
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {detail.holders.map((h: any, i: number) => (
                      <li key={i} className="flex items-center justify-between text-[12px]">
                        <span className="text-foreground/85">{h.name ?? "Cash"}</span>
                        <span className="font-display font-semibold tabular-nums">{fmt(Number(h.amount) || 0)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center pt-1">
                <EditHistoryButton
                  entityType="daily_closings"
                  entityId={detail.id}
                  label="View Edit History"
                  variant="outline"
                />
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" onClick={() => editClosing(detail)}>
                    <Pencil className="mr-1 h-4 w-4" /> Edit Closing
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleteTarget(detail)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Delete Closing
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this closing?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing for <strong>{deleteTarget?.closing_date}</strong> will be moved to the recycle bin. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteClosing(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------- helpers ---------- */

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/60">{index}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  );
}

function MiniStat({
  label, value, onClick,
}: { label: string; value: number; onClick?: () => void }) {
  const clickable = !!onClick;
  return (
    <Card
      onClick={onClick}
      className={cn(
        "rounded-xl p-2.5",
        clickable && "cursor-pointer transition-all hover:border-primary/40 active:scale-[0.98]",
      )}
    >
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1">
        <SARAmount value={value} size="sm" />
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
          className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground"
          aria-label="Info"
        >
          <Info className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-72 p-0">
        {content}
      </PopoverContent>
    </Popover>
  );
}

function InfoBlock({
  title, formula, lines,
}: { title: string; formula?: string; lines?: string[] }) {
  return (
    <div>
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Live formula</p>
      </div>
      <div className="space-y-2 px-4 py-3 text-[12px] leading-relaxed">
        {lines?.map((l, i) => <p key={i} className="text-foreground/80">{l}</p>)}
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
      <SARAmount value={value} size="md" showSign />
    </div>
  );
}

/* ---------- card detail sheet ---------- */

const CARD_META: Record<CardKey, { title: string; subtitle: string }> = {
  opening:    { title: "Opening Cash",       subtitle: "Cash on hand before today" },
  cash_sale:  { title: "Cash Sale",          subtitle: "Today's cash sales by shop" },
  withdraw:   { title: "Bank Withdraw",      subtitle: "Today's bank withdrawals" },
  purchase:   { title: "Purchase",           subtitle: "Today's purchase cash out" },
  expense:    { title: "Expense",            subtitle: "Today's expenses (non-employee)" },
  employee:   { title: "Employee Payments",  subtitle: "Today's payments to employees" },
  received:   { title: "Total Cash Received",subtitle: "All cash that came in today" },
  given:      { title: "Total Cash Given",   subtitle: "All cash that went out today" },
  distribution:{title: "Tomorrow Distribution", subtitle: "Cash distributed for next-day purchases" },
  expected:   { title: "Expected Cash",      subtitle: "Live formula breakdown" },
  actual:     { title: "Actual Cash",        subtitle: "Counted real-world cash" },
  difference: { title: "Difference",         subtitle: "Actual − Expected" },
};

function CardDetailSheet(props: {
  cardKey: CardKey | null;
  onClose: () => void;
  date: string;
  opening: number; cashSale: number; withdraw: number; purchase: number;
  expense: number; employeePaid: number; employeeReceived: number; otherCashIn: number;
  totalReceived: number; totalGiven: number; expected: number; counted: number; diff: number;
  txns: any[]; shopEntries: any[]; whEntries: any[]; empEntries: any[];
  tomorrowPurchases: any[]; nextDate: string;
  prevClosing: any; shopName: (id?: string | null) => string;
  distribution: DistRow[]; distributionTotal: number;
}) {
  const k = props.cardKey;
  const meta = k ? CARD_META[k] : null;

  // Drill-down entries come from SOURCE TABLES so amounts match aggregation
  // exactly (dedup-safe, never double-counted from legacy `transactions`).
  const entries = useMemo(() => {
    if (!k) return [] as any[];
    if (k === "cash_sale")
      return props.shopEntries
        .filter((e) => e.entry_type === "sale")
        .map((e) => ({ ...e, _amount: Number(e.cash_sale || 0), _label: props.shopName(e.shop_id) }));
    if (k === "withdraw")
      return props.shopEntries
        .filter((e) => e.entry_type === "withdraw")
        .map((e) => ({ ...e, _amount: Number(e.withdraw_amount || 0), _label: props.shopName(e.shop_id) }));
    if (k === "purchase")
      return [
        ...props.shopEntries
          .filter((e) => e.entry_type === "purchase")
          .map((e) => ({ ...e, _amount: Number(e.purchase_amount || 0), _label: props.shopName(e.shop_id) })),
        ...props.whEntries
          .filter((e) => e.entry_type === "warehouse_purchase" &&
            (e.payment_status === "cash" || e.payment_status === "partial"))
          .map((e) => ({
            ...e,
            _amount: Number(e.payment_status === "cash" ? e.amount : e.paid_amount || 0),
            _label: `Warehouse · ${e.party_name ?? "—"}`,
          })),
      ];
    if (k === "expense")
      return props.shopEntries
        .filter((e) => e.entry_type === "expense")
        .map((e) => ({ ...e, _amount: Number(e.expense_amount || 0), _label: props.shopName(e.shop_id) }));
    if (k === "employee")
      return props.empEntries
        .filter((e) => e.entry_type === "given")
        .map((e) => ({ ...e, _amount: Number(e.amount || 0), _label: "Employee" }));
    if (k === "distribution")
      return props.tomorrowPurchases
        .map((e) => ({ ...e, _amount: Number(e.purchase_amount || 0), _label: props.shopName(e.shop_id) }));
    return [];
  }, [k, props.shopEntries, props.whEntries, props.empEntries, props.tomorrowPurchases, props.shopName]);

  const total = useMemo(() => {
    if (!k) return 0;
    if (k === "opening") return props.opening;
    if (k === "cash_sale") return props.cashSale;
    if (k === "withdraw") return props.withdraw;
    if (k === "purchase") return props.purchase;
    if (k === "expense") return props.expense;
    if (k === "employee") return props.employeePaid;
    if (k === "received") return props.totalReceived;
    if (k === "given") return props.totalGiven;
    if (k === "distribution") return props.distributionTotal;
    if (k === "expected") return props.expected;
    if (k === "actual") return props.counted;
    return props.diff;
  }, [k, props]);

  const formula = useMemo(() => {
    if (!k) return "";
    if (k === "opening")
      return props.prevClosing
        ? `Carried from ${props.prevClosing.closing_date} = ${fmt(props.opening)}`
        : "Manually entered";
    if (k === "received")
      return `${fmt(props.cashSale)} + ${fmt(props.withdraw)} + ${fmt(props.otherCashIn + props.employeeReceived)} = ${fmt(props.totalReceived)}`;
    if (k === "given")
      return `${fmt(props.purchase)} + ${fmt(props.expense)} + ${fmt(props.employeePaid)} = ${fmt(props.totalGiven)}`;
    if (k === "distribution")
      return props.distribution.map((r) => `${r.name}: ${fmt(r.amount)}`).join("\n") + `\n= ${fmt(props.distributionTotal)}`;
    if (k === "expected")
      return (
        `Opening:            ${fmt(props.opening)}\n` +
        `+ Withdraw:         ${fmt(props.withdraw)}\n` +
        `+ Other Income:     ${fmt(props.otherCashIn)}\n` +
        `+ Emp Received:     ${fmt(props.employeeReceived)}\n` +
        `− Tomorrow Distrib: ${fmt(props.distributionTotal)}\n` +
        `− Expense:          ${fmt(props.expense)}\n` +
        `− Employee Given:   ${fmt(props.employeePaid)}\n` +
        `= Expected Cash:    ${fmt(props.expected)}`
      );
    if (k === "difference")
      return `${fmt(props.counted)} − ${fmt(props.expected)} = ${props.diff >= 0 ? "+" : ""}${fmt(props.diff)}`;
    return `${entries.length} entr${entries.length === 1 ? "y" : "ies"} · Σ = ${fmt(total)}`;
  }, [k, props, entries.length, total]);

  return (
    <Sheet open={!!k} onOpenChange={(o) => !o && props.onClose()}>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>{meta?.title} — {props.date}</SheetTitle>
          {meta?.subtitle && <p className="text-xs text-muted-foreground">{meta.subtitle}</p>}
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <Card className="rounded-2xl border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Total</span>
              <SARAmount
                value={k === "difference" ? Math.abs(total) : total}
                size="2xl"
                showSign={k === "difference"}
              />
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px]">{formula}</pre>
          </Card>

          {k === "received" && (
            <div className="space-y-2">
              <BreakdownRow label="Cash Sale" value={props.cashSale} />
              <BreakdownRow label="Withdraw" value={props.withdraw} />
              <BreakdownRow label="Employee Received" value={props.employeeReceived} />
              <BreakdownRow label="Other Cash In" value={props.otherCashIn} />
            </div>
          )}
          {k === "given" && (
            <div className="space-y-2">
              <BreakdownRow label="Purchase" value={-props.purchase} />
              <BreakdownRow label="Expense" value={-props.expense} />
              <BreakdownRow label="Employee Payments" value={-props.employeePaid} />
            </div>
          )}
          {k === "distribution" && (
            <div className="space-y-2">
              {props.distribution.map((r) => (
                <BreakdownRow key={r.name} label={r.name} value={-r.amount} />
              ))}
            </div>
          )}
          {k === "expected" && (
            <div className="space-y-2">
              <BreakdownRow label="Opening Cash" value={props.opening} />
              <BreakdownRow label="Withdraw" value={props.withdraw} />
              <BreakdownRow label="Other Income" value={props.otherCashIn} />
              <BreakdownRow label="Employee Received" value={props.employeeReceived} />
              <BreakdownRow label="Tomorrow Distribution" value={-props.distributionTotal} />
              <BreakdownRow label="Expense" value={-props.expense} />
              <BreakdownRow label="Employee Given" value={-props.employeePaid} />
            </div>
          )}
          {k === "difference" && (
            <div className="space-y-2">
              <BreakdownRow label="Actual" value={props.counted} />
              <BreakdownRow label="Expected" value={-props.expected} />
            </div>
          )}

          {(k === "cash_sale" || k === "withdraw" || k === "purchase" || k === "expense" || k === "employee" || k === "distribution") && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {k === "distribution" ? `Tomorrow purchases (${props.nextDate})` : `Entries`} ({entries.length})
              </p>
              {entries.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-[12px] text-muted-foreground">
                  {k === "distribution"
                    ? `No tomorrow purchase entries found for ${props.nextDate}.`
                    : "No entries on this date."}
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {entries.map((e) => (
                    <li key={e.id} className="rounded-lg border border-border/60 bg-card/50 px-3 py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{e._label ?? "—"}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(e.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {e.notes && <p className="mt-0.5 text-[11px] text-foreground/70 line-clamp-2">{e.notes}</p>}
                        </div>
                        <SARAmount value={Number(e._amount ?? e.amount ?? 0)} size="sm" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
