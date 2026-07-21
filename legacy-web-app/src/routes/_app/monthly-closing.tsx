import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SAR } from "@/lib/format";
import { Lock, Unlock, ShieldAlert, CalendarRange, History, Eye, KeyRound } from "lucide-react";
import { useProfileMap } from "@/hooks/use-profile-map";
import { sortShops } from "@/lib/shop-order";

export const Route = createFileRoute("/_app/monthly-closing")({
  component: MonthlyClosingPage,
});

type ShopBreakdown = {
  shop_id: string;
  name: string;
  income: number;
  expense: number;
  profit: number;
};

type Snapshot = {
  period_start: string;
  period_end: string;
  total_shop_income: number;
  total_shop_expense: number;
  total_shop_profit: number;
  company_income: number;
  company_expense: number;
  company_net: number;
  final_business_profit: number;
  total_shop_cash_position: number;
  opening_balance: number;
  bank_balance: number;
  shops: ShopBreakdown[];
};

type Closing = {
  id: string;
  month: string;
  status: "closed" | "reopened";
  closed_at: string;
  closed_by: string | null;
  reopened_at: string | null;
  reopened_by: string | null;
  total_shop_income: number;
  total_shop_expense: number;
  total_shop_profit: number;
  company_income: number;
  company_expense: number;
  final_business_profit: number;
  bank_balance: number;
  total_shop_cash_position: number;
  snapshot: Snapshot | any;
};

function pad(n: number) { return String(n).padStart(2, "0"); }

function monthLabel(monthISO: string) {
  const d = new Date(monthISO + (monthISO.length === 7 ? "-01" : "") + "T00:00:00");
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

/** Reopen password format: ShortMonth + YY (e.g. May26, Jun26). */
function expectedReopenPassword(monthISO: string) {
  const d = new Date(monthISO + (monthISO.length === 7 ? "-01" : "") + "T00:00:00");
  const mon = d.toLocaleString("en-US", { month: "short" }); // Jan..Dec
  const yy = String(d.getFullYear()).slice(-2);
  return `${mon}${yy}`;
}

function MonthlyClosingPage() {
  const { user } = useAuth();
  const { isAdmin } = useUserAccess();
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

  const [monthISO, setMonthISO] = useState<string>(defaultMonth);
  const [bankBalance, setBankBalance] = useState<string>("");
  const [closings, setClosings] = useState<Closing[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmReopen, setConfirmReopen] = useState<Closing | null>(null);
  const [reopenPwd, setReopenPwd] = useState("");
  const [detail, setDetail] = useState<Closing | null>(null);
  const [busy, setBusy] = useState(false);

  const monthKey = `${monthISO}-01`;
  const profileMap = useProfileMap();

  const loadHistory = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("monthly_closings").select("*")
      .order("month", { ascending: false });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setClosings((data ?? []) as Closing[]);
  };

  useEffect(() => { loadHistory(); }, []);

  const currentClosing = useMemo(
    () => closings.find((c) => c.month === monthKey) ?? null,
    [closings, monthKey],
  );
  const isClosed = currentClosing?.status === "closed";

  // Build snapshot for the selected month from existing data.
  const buildSnapshot = async (): Promise<Snapshot> => {
    const d = new Date(monthKey + "T00:00:00");
    const from = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const to = `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;

    const [shopsRes, entriesRes, companyRes, openingRes] = await Promise.all([
      supabase.from("shops").select("id,name,shop_type").eq("is_deleted", false),
      supabase.from("shop_entries")
        .select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount")
        .eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to),
      (supabase as any).from("company_transactions")
        .select("txn_type,amount")
        .eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to),
      (supabase as any).from("company_opening_balances")
        .select("amount").eq("month", monthKey).maybeSingle(),
    ]);
    const shops = sortShops((shopsRes.data ?? []) as any[]);
    const entries = (entriesRes.data ?? []) as any[];
    const company = (companyRes.data ?? []) as any[];
    const openingBalance = Number(openingRes?.data?.amount ?? 0);

    const breakdown: ShopBreakdown[] = [];
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
        expense  += Number(e.expense_amount || 0);
        if (isSimple) {
          if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
          else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
        }
      }
      const income = isSimple ? simpleCashIn : (cashSale + withdraw);
      const exp = isSimple ? simpleExpense : (purchase + expense);
      const profit = income - exp;
      breakdown.push({ shop_id: s.id, name: s.name ?? "—", income, expense: exp, profit });
      shopIncome += isSimple ? simpleCashIn : (cashSale + withdraw - purchase);
      shopExpense += isSimple ? simpleExpense : expense;
      shopProfit += profit;
      shopCashPos += profit;
    }

    const companyIncome = company.filter((r) => r.txn_type === "income").reduce((s, r) => s + Number(r.amount || 0), 0);
    const companyExpense = company.filter((r) => r.txn_type === "expense").reduce((s, r) => s + Number(r.amount || 0), 0);
    const companyNet = companyIncome - companyExpense;
    const finalProfit = shopProfit + companyNet;

    return {
      period_start: from, period_end: to,
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
      shops: breakdown,
    };
  };

  const onCloseMonth = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const snap = await buildSnapshot();
      const bank = Number(bankBalance || 0);
      const fullSnap: Snapshot = { ...snap, bank_balance: bank };
      const { error } = await (supabase as any).from("monthly_closings").upsert({
        month: monthKey,
        status: "closed",
        closed_at: new Date().toISOString(),
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
        snapshot: fullSnap,
      }, { onConflict: "month" });
      if (error) throw error;

      // Carry forward Final Business Profit to next month's opening balance.
      const next = new Date(monthKey + "T00:00:00");
      next.setMonth(next.getMonth() + 1);
      const nextKey = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-01`;
      const { error: obErr } = await (supabase as any)
        .from("company_opening_balances")
        .upsert({
          month: nextKey,
          amount: snap.final_business_profit,
          notes: `Auto: carried from ${monthISO}`,
          created_by: user.id,
        }, { onConflict: "month" });
      if (obErr) console.warn("opening balance update:", obErr.message);

      toast.success(`${monthLabel(monthISO)} closed`);
      setConfirmClose(false);
      setBankBalance("");
      loadHistory();
    } catch (e: any) {
      toast.error(e.message ?? "Could not close month");
    } finally {
      setBusy(false);
    }
  };

  const onReopen = async () => {
    if (!confirmReopen || !user) return;
    setBusy(true);
    const { error } = await supabase
      .from("monthly_closings")
      .update({
        status: "reopened",
        reopened_at: new Date().toISOString(),
        reopened_by: user.id,
      })
      .eq("id", confirmReopen.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${monthLabel(confirmReopen.month)} reopened`);
    setConfirmReopen(null);
    setReopenPwd("");
    loadHistory();
  };


  if (!isAdmin) {
    return (
      <div className="mobile-page-stack animate-fade-in">
        <Card className="rounded-2xl p-6 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="mt-2 font-semibold">Admin only</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monthly Closing can only be performed by an administrator.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-page-stack animate-fade-in">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" /> Monthly Closing
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Close a month to lock all financial records. Carries Final Business Profit
          forward as next month's Company Opening Balance.
        </p>
      </div>

      {/* Close month card */}
      <Card className="rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Select month
          </span>
          {isClosed ? (
            <Badge variant="destructive" className="ml-auto gap-1">
              <Lock className="h-3 w-3" /> CLOSED
            </Badge>
          ) : (
            <Badge className="ml-auto gap-1 bg-emerald-500 text-white hover:bg-emerald-500/90">
              <Unlock className="h-3 w-3" /> OPEN
            </Badge>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label className="text-[11px]">Month</Label>
            <Input type="month" className="h-9 mt-1" value={monthISO}
              onChange={(e) => setMonthISO(e.target.value)} />
          </div>
          {!isClosed && (
            <div>
              <Label className="text-[11px]">Bank balance (SAR)</Label>
              <Input type="number" inputMode="decimal" step="0.01" className="h-9 mt-1"
                value={bankBalance} placeholder="0.00"
                onChange={(e) => setBankBalance(e.target.value)} />
            </div>
          )}
        </div>

        {isClosed ? (
          <div className="space-y-2">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-[12px] space-y-1">
              <p className="font-semibold text-destructive flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Month is closed
              </p>
              <p className="text-muted-foreground">
                All transactions, purchases, expenses and company entries in this month
                are locked. Reopen to make changes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="gap-2"
                onClick={() => setDetail(currentClosing!)}>
                <Eye className="h-4 w-4" /> View Details
              </Button>
              <Button variant="outline" className="gap-2"
                onClick={() => setConfirmReopen(currentClosing!)}>
                <Unlock className="h-4 w-4" /> Reopen Month
              </Button>
            </div>
          </div>
        ) : (
          <Button className="w-full gap-2" onClick={() => setConfirmClose(true)}>
            <Lock className="h-4 w-4" /> Close Month
          </Button>
        )}

        {currentClosing && (
          <div className="rounded-xl border bg-muted/30 p-3 text-[12px] grid grid-cols-2 gap-y-1">
            <span className="text-muted-foreground">Shop Income</span><span className="text-right tabular-nums">{SAR(currentClosing.total_shop_income)}</span>
            <span className="text-muted-foreground">Shop Expense</span><span className="text-right tabular-nums">{SAR(currentClosing.total_shop_expense)}</span>
            <span className="text-muted-foreground">Shop Profit</span><span className="text-right tabular-nums">{SAR(currentClosing.total_shop_profit)}</span>
            <span className="text-muted-foreground">Company Income</span><span className="text-right tabular-nums">{SAR(currentClosing.company_income)}</span>
            <span className="text-muted-foreground">Company Expense</span><span className="text-right tabular-nums">{SAR(currentClosing.company_expense)}</span>
            <span className="text-muted-foreground">Bank Balance</span><span className="text-right tabular-nums">{SAR(currentClosing.bank_balance)}</span>
            <span className="text-muted-foreground">Shop Cash Position</span><span className="text-right tabular-nums">{SAR(currentClosing.total_shop_cash_position)}</span>
            <span className="font-semibold">Final Business Profit</span><span className="text-right tabular-nums font-semibold">{SAR(currentClosing.final_business_profit)}</span>
          </div>
        )}
      </Card>

      {/* History */}
      <Card className="rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Closing History</h2>
        </div>
        {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
        {!loading && closings.length === 0 && (
          <p className="text-xs text-muted-foreground">No closings yet.</p>
        )}
        <div className="space-y-2">
          {closings.map((c) => {
            const closedName = c.closed_by ? (profileMap[c.closed_by]?.full_name ?? "—") : "—";
            return (
              <button key={c.id}
                onClick={() => setDetail(c)}
                className="w-full text-left rounded-xl border p-3 text-[12px] flex items-start justify-between gap-2 hover:bg-muted/40 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{monthLabel(c.month)}</span>
                    {c.status === "closed" ? (
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] gap-0.5">
                        <Lock className="h-2.5 w-2.5" /> Closed
                      </Badge>
                    ) : (
                      <Badge className="h-5 px-1.5 text-[10px] gap-0.5 bg-emerald-500 text-white hover:bg-emerald-500/90">
                        <Unlock className="h-2.5 w-2.5" /> Reopened
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5">
                    {new Date(c.closed_at).toLocaleString()} · by {closedName}
                  </p>
                  <p className="mt-1 tabular-nums">
                    Final Profit: <span className="font-semibold">{SAR(c.final_business_profit)}</span>
                  </p>
                </div>
                <Eye className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Close confirm */}
      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> WARNING
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>You are about to close:</p>
                <p className="font-semibold text-foreground">Month: {monthLabel(monthISO)}</p>
                <p>After closing:</p>
                <ul className="list-disc pl-5 text-[12px] space-y-0.5">
                  <li>Transactions cannot be edited or deleted</li>
                  <li>Purchases cannot be edited or deleted</li>
                  <li>Expenses cannot be edited or deleted</li>
                  <li>Company Transactions cannot be edited or deleted</li>
                </ul>
                <p>Continue?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onCloseMonth} disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {busy ? "Closing…" : "Close Month"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reopen — hard warning */}
      <AlertDialog open={!!confirmReopen} onOpenChange={(o) => { if (!o) { setConfirmReopen(null); setReopenPwd(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" /> ⚠️ Reopen Closed Month
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p>
                  You are about to reopen{" "}
                  <b className="text-foreground">{confirmReopen ? monthLabel(confirmReopen.month) : ""}</b>, a closed accounting month.
                </p>
                <p>Reopening a month may affect:</p>
                <ul className="list-disc pl-5 text-[12px]">
                  <li>Reports</li>
                  <li>Profit calculations</li>
                  <li>Dashboard values</li>
                  <li>Financial summaries</li>
                  <li>Closing history</li>
                </ul>
                <p className="text-[12px]">
                  Only reopen the month if you are certain that corrections are required. This action should only be performed by an authorized administrator.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel autoFocus disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onReopen}
              disabled={busy}
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              {busy ? "Reopening…" : "Reopen Month"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Closing Details */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              {detail ? monthLabel(detail.month) : ""} Closing Details
            </DialogTitle>
          </DialogHeader>
          {detail && <ClosingDetails closing={detail} profileMap={profileMap} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px] py-0.5">
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${strong ? "font-semibold" : ""}`}>{SAR(value)}</span>
    </div>
  );
}

function ClosingDetails({ closing, profileMap }: { closing: Closing; profileMap: Record<string, any> }) {
  const snap: Snapshot | undefined = closing.snapshot && typeof closing.snapshot === "object"
    ? (closing.snapshot as Snapshot) : undefined;
  const shops: ShopBreakdown[] = snap?.shops ?? [];
  const closedBy = closing.closed_by ? (profileMap[closing.closed_by]?.full_name ?? "—") : "—";

  return (
    <div className="space-y-3 text-sm">
      {/* Header */}
      <div className="rounded-xl border bg-muted/30 p-3 space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Month</span>
          <span className="font-semibold">{monthLabel(closing.month)}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">Closed Date</span>
          <span>{new Date(closing.closed_at).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">Closed By</span>
          <span>{closedBy}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-muted-foreground">Status</span>
          {closing.status === "closed" ? (
            <Badge variant="destructive" className="h-5 text-[10px] gap-0.5">
              <Lock className="h-2.5 w-2.5" /> Closed
            </Badge>
          ) : (
            <Badge className="h-5 text-[10px] gap-0.5 bg-emerald-500 text-white">
              <Unlock className="h-2.5 w-2.5" /> Reopened
            </Badge>
          )}
        </div>
      </div>

      {/* Shop Summary */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Shop Summary
        </h3>
        {shops.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">
            No per-shop breakdown saved for this closing.
          </p>
        ) : (
          <div className="space-y-2">
            {shops.map((s) => (
              <div key={s.shop_id} className="rounded-xl border p-2.5">
                <p className="font-semibold text-[13px] mb-1">{s.name}</p>
                <Row label="Income" value={s.income} />
                <Row label="Expense" value={s.expense} />
                <Row label="Profit" value={s.profit} strong />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company */}
      <div className="rounded-xl border p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Company Transactions
        </h3>
        <Row label="Company Income" value={closing.company_income} />
        <Row label="Company Expense" value={closing.company_expense} />
        <Row label="Company Net Position" value={snap?.company_net ?? (closing.company_income - closing.company_expense)} strong />
      </div>

      {/* Snapshot */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
          Closing Snapshot
        </h3>
        <Row label="Opening Balance" value={snap?.opening_balance ?? 0} />
        <Row label="Total Shop Profit" value={closing.total_shop_profit} />
        <Row label="Bank Balance" value={closing.bank_balance} />
        <Row label="Final Business Profit" value={closing.final_business_profit} strong />
      </div>

      <p className="text-[10.5px] text-muted-foreground text-center">
        Values shown exactly as saved on closing date. Never recalculated.
      </p>
    </div>
  );
}
