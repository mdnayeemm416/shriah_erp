import { useHighlightRecord } from "@/hooks/use-highlight-record";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SAR } from "@/lib/format";
import {
  Building2, Plus, TrendingDown, TrendingUp, Wallet, Trash2, Pencil, Paperclip, PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserAccess } from "@/hooks/use-user-access";
import { softDelete } from "@/lib/soft-delete";
import { sendAuditEmail } from "@/lib/audit-email";

export const Route = createFileRoute("/_app/company-transactions")({
  validateSearch: (s: Record<string, unknown>) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
  }),
  component: CompanyTransactionsPage,
});

type CompanyTxn = {
  id: string;
  txn_date: string;
  txn_type: "income" | "expense";
  category: string;
  amount: number;
  notes: string | null;
  attachment_url: string | null;
  created_by: string;
  created_at: string;
};

const INCOME_CATEGORIES = ["Rent Income", "Commission", "Rebate", "Other"];
const EXPENSE_CATEGORIES = [
  "Vehicle Expense", "Office Expense", "Internet Bill", "Government Fee",
  "Salary", "Maintenance", "Other",
];

type PeriodMode = "daily" | "weekly" | "monthly" | "custom";

function pad(n: number) { return String(n).padStart(2, "0"); }
function toISO(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function resolvePeriod(mode: PeriodMode, anchor: string, customFrom: string, customTo: string) {
  const d = new Date(anchor + "T00:00:00");
  if (mode === "daily") return { from: anchor, to: anchor };
  if (mode === "weekly") {
    const day = d.getDay();
    const start = new Date(d); start.setDate(d.getDate() - day);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return { from: toISO(start), to: toISO(end) };
  }
  if (mode === "monthly") {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { from: toISO(first), to: toISO(last) };
  }
  return { from: customFrom, to: customTo };
}

function CompanyTransactionsPage() {
  useHighlightRecord();
  const search = useSearch({ from: "/_app/company-transactions" });
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const { isAdmin } = useUserAccess();

  const [rows, setRows] = useState<CompanyTxn[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [shopProfit, setShopProfit] = useState<number>(0);
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [openingDialog, setOpeningDialog] = useState(false);
  const [openingInput, setOpeningInput] = useState<string>("");

  const [periodMode, setPeriodMode] = useState<PeriodMode>("monthly");
  const [anchor, setAnchor] = useState<string>(workingDate);
  const [customFrom, setCustomFrom] = useState<string>(workingDate);
  const [customTo, setCustomTo] = useState<string>(workingDate);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<CompanyTxn | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!search.highlight || !search.date) return;
    setPeriodMode("daily");
    setAnchor(search.date);
  }, [search.highlight, search.date]);

  const period = useMemo(
    () => resolvePeriod(periodMode, anchor, customFrom, customTo),
    [periodMode, anchor, customFrom, customTo],
  );

  // Opening balance is per-month, keyed by the first day of the period's starting month.
  const monthKey = useMemo(() => {
    const d = new Date(period.from + "T00:00:00");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
  }, [period.from]);

  const load = async () => {
    setLoading(true);
    const [txnRes, shopsRes, entriesRes] = await Promise.all([
      (supabase as any)
        .from("company_transactions").select("*")
        .eq("is_deleted", false)
        .gte("txn_date", period.from).lte("txn_date", period.to)
        .order("txn_date", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("shops").select("id,shop_type").eq("is_deleted", false),
      supabase.from("shop_entries")
        .select("shop_id,entry_type,cash_sale,withdraw_amount,purchase_amount,expense_amount")
        .eq("is_deleted", false)
        .gte("txn_date", period.from).lte("txn_date", period.to),
    ]);
    setLoading(false);
    if (txnRes.error) { toast.error(txnRes.error.message); return; }
    setRows((txnRes.data ?? []) as CompanyTxn[]);

    // Final Business Profit uses the same per-shop net profit formula as Profit Summary.
    const shops = (shopsRes.data ?? []) as any[];
    const entries = (entriesRes.data ?? []) as any[];
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
        expense  += Number(e.expense_amount || 0);
        if (isSimple) {
          if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
          else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
        }
      }
      const cash_position = isSimple
        ? simpleCashIn - simpleExpense
        : (cashSale + withdraw) - (purchase + expense);
      const total_expense = isSimple ? simpleExpense : expense;
      const net_profit = cash_position; // profit_before_expense - total_expense = cash_position
      void total_expense;
      total += net_profit;
    }
    setShopProfit(total);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [period.from, period.to]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("company_opening_balances")
        .select("amount")
        .eq("month", monthKey)
        .maybeSingle();
      setOpeningBalance(Number(data?.amount ?? 0));
    })();
  }, [monthKey]);

  const totals = useMemo(() => {
    const income = (rows ?? []).filter(r => r.txn_type === "income").reduce((s, r) => s + Number(r.amount || 0), 0);
    const expense = (rows ?? []).filter(r => r.txn_type === "expense").reduce((s, r) => s + Number(r.amount || 0), 0);
    return { income, expense, net: income - expense };
  }, [rows]);

  const onDelete = async () => {
    if (!deleteId) return;
    const existing = (rows ?? []).find((r) => r.id === deleteId);
    const { error } = await softDelete("company_transactions" as any, deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    setDeleteId(null);
    setRows((prev) => (prev ?? []).filter((r) => r.id !== deleteId));
    try {
      sendAuditEmail({
        action: "deleted",
        module: "Company Transaction",
        userName: user?.email || null,
        recordId: deleteId,
        oldValues: existing || { id: deleteId },
        notes: (existing as any)?.notes || null,
        amount: Number((existing as any)?.amount ?? 0),
      });
    } catch (e) { /* noop */ }
  };

  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Company Transactions
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Head office income &amp; expenses — not linked to any shop.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} disabled={!user} className="h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Period</Label>
            <Select value={periodMode} onValueChange={(v) => setPeriodMode(v as PeriodMode)}>
              <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {periodMode === "custom" ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</Label>
                <Input type="date" className="h-9 mt-1" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              </div>
              <div>
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">To</Label>
                <Input type="date" className="h-9 mt-1" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
              </div>
            </div>
          ) : (
            <div>
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Anchor date</Label>
              <Input type="date" className="h-9 mt-1" value={anchor} onChange={(e) => setAnchor(e.target.value)} />
            </div>
          )}
        </div>
        <p className="mt-2 text-[10.5px] text-muted-foreground">
          Showing {period.from} → {period.to}
        </p>
      </Card>

      {/* Opening Balance (carried forward from previous month) */}
      <Card className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <PiggyBank className="h-3.5 w-3.5 text-amber-600" /> Opening Balance
          </div>
          {isAdmin && (
            <Button
              size="icon" variant="ghost" className="h-6 w-6 -mr-1 -mt-1"
              onClick={() => { setOpeningInput(String(openingBalance || "")); setOpeningDialog(true); }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <p className="mt-1 font-display text-3xl font-bold tabular-nums tracking-tight text-amber-700 dark:text-amber-500">
          {SAR(openingBalance)}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Carried forward · Month of {monthKey.slice(0, 7)}
        </p>
      </Card>

      {/* Final Business Profit */}
      <Card className="rounded-2xl p-4 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Wallet className="h-3.5 w-3.5 text-primary" /> Final Business Profit
        </div>
        <p className={cn(
          "mt-1 font-display text-3xl font-bold tabular-nums tracking-tight",
          (shopProfit + totals.net) >= 0 ? "text-emerald-600" : "text-destructive",
        )}>
          {SAR(shopProfit + totals.net)}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex justify-between rounded-lg bg-muted/40 px-2 py-1.5">
            <span className="text-muted-foreground">Shop Profit</span>
            <span className="font-semibold tabular-nums">{SAR(shopProfit)}</span>
          </div>
          <div className="flex justify-between rounded-lg bg-muted/40 px-2 py-1.5">
            <span className="text-muted-foreground">Company Net</span>
            <span className={cn("font-semibold tabular-nums", totals.net >= 0 ? "text-emerald-600" : "text-destructive")}>
              {SAR(totals.net)}
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Shop Profit + Company Income − Company Expense · {period.from} → {period.to}
        </p>
      </Card>

      {/* Current Company Balance (Opening + Income − Expense; excludes shops) */}
      {(() => {
        const current = openingBalance + totals.income - totals.expense;
        return (
          <Card className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Wallet className="h-3.5 w-3.5 text-emerald-600" /> Current Company Balance
            </div>
            <p className={cn(
              "mt-1 font-display text-3xl font-bold tabular-nums tracking-tight",
              current >= 0 ? "text-emerald-600" : "text-destructive",
            )}>
              {SAR(current)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Opening + Company Income − Company Expense
            </p>
          </Card>
        );
      })()}

      {/* Totals */}
      <div className="grid grid-cols-3 gap-2">
        <SumCard icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-600" />} label="Income" value={totals.income} tone="ok" />
        <SumCard icon={<TrendingDown className="h-3.5 w-3.5 text-destructive" />} label="Expense" value={totals.expense} tone="bad" />
        <SumCard icon={<Wallet className="h-3.5 w-3.5 text-primary" />} label="Net" value={totals.net} tone={totals.net >= 0 ? "ok" : "bad"} />
      </div>


      {/* List */}
      <div className="space-y-2">
        {loading && rows === null ? (
          <Card className="rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading…</Card>
        ) : (rows ?? []).length === 0 ? (
          <Card className="rounded-2xl p-8 text-center">
            <Building2 className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
            <p className="text-sm font-medium">No company transactions in this period</p>
            <p className="mt-1 text-xs text-muted-foreground">Click Add to record income or expense.</p>
          </Card>
        ) : (
          (rows ?? []).map((r) => (
            <Card key={r.id} data-record-id={r.id} className="rounded-2xl p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      r.txn_type === "income"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-destructive/15 text-destructive",
                    )}>
                      {r.txn_type === "income" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {r.txn_type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.txn_date}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-semibold">{r.category}</p>
                  {r.notes && <p className="mt-0.5 text-[11.5px] text-muted-foreground line-clamp-2">{r.notes}</p>}
                  {r.attachment_url && (
                    <a href={r.attachment_url} target="_blank" rel="noreferrer"
                       className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-primary hover:underline">
                      <Paperclip className="h-3 w-3" /> Attachment
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className={cn("font-display text-base font-bold tabular-nums",
                    r.txn_type === "income" ? "text-emerald-600" : "text-destructive")}>
                    {SAR(Number(r.amount))}
                  </p>
                  <div className="mt-1 flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7"
                            onClick={() => { setEditing(r); setOpenForm(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteId(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <CompanyTxnForm
        open={openForm}
        onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null); }}
        editing={editing}
        defaultDate={workingDate}
        onSaved={() => { setOpenForm(false); setEditing(null); load(); }}
      />

      <Dialog open={openingDialog} onOpenChange={setOpeningDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Opening Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Month</Label>
            <Input value={monthKey.slice(0, 7)} disabled />
            <Label>Amount (SAR)</Label>
            <Input
              type="number" inputMode="decimal" step="0.01"
              value={openingInput} onChange={(e) => setOpeningInput(e.target.value)}
              placeholder="0.00"
            />
            <p className="text-[11px] text-muted-foreground">
              Carried forward from the previous month's Final Business Profit. Admins only.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpeningDialog(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                const amt = Number(openingInput || 0);
                const { error } = await (supabase as any)
                  .from("company_opening_balances")
                  .upsert({ month: monthKey, amount: amt }, { onConflict: "month" });
                if (error) { toast.error(error.message); return; }
                setOpeningBalance(amt);
                setOpeningDialog(false);
                toast.success("Opening balance saved");
              }}
            >Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              The record will be moved to the recycle bin. Admins can restore it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SumCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "ok" | "bad" }) {
  return (
    <Card className="rounded-2xl p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <p className={cn("mt-1 font-display text-[15px] font-bold tabular-nums",
        tone === "ok" ? "text-emerald-600" : "text-destructive")}>
        {SAR(value)}
      </p>
    </Card>
  );
}

function CompanyTxnForm({
  open, onOpenChange, editing, defaultDate, onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: CompanyTxn | null;
  defaultDate: string;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [txnDate, setTxnDate] = useState(defaultDate);
  const [txnType, setTxnType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<string>("Other");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  useEffect(() => {
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
    if (!user) { toast.error("Sign in required"); return; }
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (!category.trim()) { toast.error("Pick a category"); return; }
    setSaving(true);
    try {
      const payload: any = {
        txn_date: txnDate,
        txn_type: txnType,
        category,
        amount: amt,
        notes: notes.trim() || null,
        attachment_url: attachmentUrl.trim() || null,
      };
      if (editing) {
        const { error } = await (supabase as any).from("company_transactions")
          .update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await (supabase as any).from("company_transactions")
          .insert({ ...payload, created_by: user.id });
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
          amount: amt,
        });
      } catch (e) { /* noop */ }
      onSaved();
    } catch (e: any) {
      toast.error(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Company Transaction" : "Add Company Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Date</Label>
              <Input type="date" value={txnDate} onChange={(e) => setTxnDate(e.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={txnType} onValueChange={(v) => { setTxnType(v as any); setCategory("Other"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount (SAR)</Label>
            <Input type="number" inputMode="decimal" min="0" step="0.01"
                   value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div>
            <Label>Note</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional description" />
          </div>

          <div>
            <Label>Attachment URL (optional)</Label>
            <Input value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)}
                   placeholder="https://..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={saving}>{saving ? "Saving…" : (editing ? "Update" : "Save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
