import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarRange, FileBarChart, Plus, Printer, Trash2, ShieldAlert, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/monthly-snapshot")({
  component: MonthlySnapshotPage,
});

// ============================================================
// Types
// ============================================================

type ShopSummary = {
  shop_id: string;
  shop_name: string;
  total_sale: number;     // pos_sale (Z-report total) when full_erp, else cash_sale for simple_cash
  cash_sale: number;
  bank_sale: number;
  credit_sale: number;
  purchase: number;
  expense: number;
  withdraw: number;
  expected_balance: number;  // bank_sale − withdraw  (Expected Bank Balance contribution)
  cash_position: number;     // (cash + withdraw) − (purchase + expense)
};

type SnapshotPayload = {
  company: {
    total_cash_position: number;   // Σ shop cash positions
    total_bank_balance: number;    // Σ shop (bank_sale − withdraw)
    total_invest: number;          // company opening + total cash position
    wholesale_value: number;
  };
  shops: ShopSummary[];
  wholesale: {
    current_stock: number;
    receivable: number;
    value: number;
  };
  employees: {
    given: number;
    received: number;
    balance: number;             // given − received
  };
  suppliers: {
    total_due: number;
  };
  meta: {
    company_opening: number;
    generated_at: string;
  };
};

const COMPANY_OPENING = 175_000;

// ============================================================
// Date helpers
// ============================================================

function pad(n: number) { return String(n).padStart(2, "0"); }
function monthFirstISO(year: number, month0: number): string {
  return `${year}-${pad(month0 + 1)}-01`;
}
function monthLastISO(year: number, month0: number): string {
  const last = new Date(year, month0 + 1, 0).getDate();
  return `${year}-${pad(month0 + 1)}-${pad(last)}`;
}
function monthLabel(year: number, month0: number): string {
  return new Date(year, month0, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
function previousMonth(): { year: number; month0: number } {
  const d = new Date();
  d.setDate(1); d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month0: d.getMonth() };
}
function parseMonthISO(iso: string): { year: number; month0: number } {
  const [y, m] = iso.split("-").map(Number);
  return { year: y, month0: (m || 1) - 1 };
}

// ============================================================
// Snapshot computation (called once when admin creates a snapshot)
// ============================================================

async function computeSnapshot(year: number, month0: number): Promise<SnapshotPayload> {
  const from = monthFirstISO(year, month0);
  const to = monthLastISO(year, month0);

  const [shopsRes, entriesRes, productsRes, customersRes, salesRes, paymentsRes, empRes, partiesRes] =
    await Promise.all([
      supabase.from("shops").select("*").eq("is_deleted", false),
      supabase.from("shop_entries").select("*").eq("is_deleted", false)
        .gte("txn_date", from).lte("txn_date", to),
      supabase.from("shop_products").select("stock,purchase_price").eq("is_deleted", false),
      supabase.from("pos_customers").select("opening_due").eq("is_active", true).eq("is_deleted", false),
      supabase.from("shop_sales" as any).select("due_amount").eq("is_deleted", false).neq("status", "cancelled"),
      supabase.from("pos_payments" as any).select("amount,kind"),
      // Employee entries: cumulative through end-of-month.
      supabase.from("employee_entries").select("entry_type,amount,txn_date")
        .eq("is_deleted", false).lte("txn_date", to),
      // Supplier opening payables — best lightweight signal we have without scanning all transactions.
      (supabase as any).from("parties").select("party_type,opening_payable").eq("is_deleted", false),
    ]);

  const shops = sortShops((shopsRes.data ?? []) as any[]);
  const entries = (entriesRes.data ?? []) as any[];

  // --- shop totals ---
  const shopSummaries: ShopSummary[] = shops.map((s: any) => {
    const rows = entries.filter((e) => e.shop_id === s.id);
    let pos = 0, cash = 0, bank = 0, credit = 0, purchase = 0, expense = 0, withdraw = 0;
    let simpleCashIn = 0, simpleExpense = 0;
    for (const e of rows) {
      pos += Number(e.pos_sale || 0);
      cash += Number(e.cash_sale || 0);
      bank += Number(e.bank_sale || 0);
      credit += Number(e.credit_sale || 0);
      purchase += Number(e.purchase_amount || 0);
      expense += Number(e.expense_amount || 0);
      withdraw += Number(e.withdraw_amount || 0);
      if (s.shop_type === "simple_cash") {
        if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
        else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
      }
    }
    const isSimple = s.shop_type === "simple_cash";
    const cash_position = isSimple
      ? simpleCashIn - simpleExpense
      : (cash + withdraw) - (purchase + expense);
    const expected_balance = isSimple ? 0 : (bank - withdraw);
    const total_sale = isSimple ? simpleCashIn : pos;
    return {
      shop_id: s.id,
      shop_name: s.name,
      total_sale,
      cash_sale: isSimple ? simpleCashIn : cash,
      bank_sale: isSimple ? 0 : bank,
      credit_sale: isSimple ? 0 : credit,
      purchase: isSimple ? 0 : purchase,
      expense: isSimple ? simpleExpense : expense,
      withdraw: isSimple ? 0 : withdraw,
      expected_balance,
      cash_position,
    };
  });

  const totalCashPosition = shopSummaries.reduce((s, x) => s + x.cash_position, 0);
  const totalBankBalance = shopSummaries.reduce((s, x) => s + x.expected_balance, 0);

  // --- wholesale (current snapshot — same formula as useWholesaleFinancials) ---
  const currentStock = (productsRes.data ?? []).reduce((s: number, p: any) => {
    return s + Math.max(0, Number(p.stock ?? 0)) * Math.max(0, Number(p.purchase_price ?? 0));
  }, 0);
  const openingDue = (customersRes.data ?? []).reduce((s: number, r: any) => s + Number(r.opening_due ?? 0), 0);
  const dueSum = ((salesRes.data ?? []) as any[]).reduce((s, r) => s + Number(r.due_amount ?? 0), 0);
  const paidIn = ((paymentsRes.data ?? []) as any[])
    .filter((p) => p.kind === "payment_in")
    .reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const receivable = Math.max(0, openingDue + dueSum - paidIn);
  const wholesaleValue = currentStock + receivable;

  // --- employees (cumulative through end of selected month) ---
  let given = 0, received = 0;
  for (const e of (empRes.data ?? []) as any[]) {
    const amt = Number(e.amount) || 0;
    if (e.entry_type === "given") given += amt; else received += amt;
  }

  // --- suppliers ---
  const totalSupplierDue = ((partiesRes.data ?? []) as any[])
    .filter((p) => p.party_type === "supplier")
    .reduce((s, r) => s + Number(r.opening_payable ?? 0), 0);

  return {
    company: {
      total_cash_position: totalCashPosition,
      total_bank_balance: totalBankBalance,
      total_invest: COMPANY_OPENING + totalCashPosition,
      wholesale_value: wholesaleValue,
    },
    shops: shopSummaries,
    wholesale: { current_stock: currentStock, receivable, value: wholesaleValue },
    employees: { given, received, balance: given - received },
    suppliers: { total_due: totalSupplierDue },
    meta: { company_opening: COMPANY_OPENING, generated_at: new Date().toISOString() },
  };
}

// ============================================================
// Page
// ============================================================

function MonthlySnapshotPage() {
  const { user } = useAuth();
  const { isAdmin } = useUserAccess();
  const qc = useQueryClient();

  const prev = previousMonth();
  const [selMonth, setSelMonth] = useState<string>(monthFirstISO(prev.year, prev.month0));
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: snapshots = [], isLoading } = useQuery<any[]>({
    queryKey: ["monthly_snapshots"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("monthly_snapshots")
        .select("*")
        .order("month", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const existing = useMemo(
    () => new Set(snapshots.map((s) => s.month)),
    [snapshots],
  );

  const createSnapshot = async () => {
    if (!isAdmin) { toast.error("Admins only"); return; }
    if (!user) { toast.error("Sign in required"); return; }
    if (existing.has(selMonth)) { toast.error("Snapshot for this month already exists"); return; }
    setCreating(true);
    try {
      const { year, month0 } = parseMonthISO(selMonth);
      const payload = await computeSnapshot(year, month0);
      const label = monthLabel(year, month0);
      const { error } = await (supabase as any)
        .from("monthly_snapshots")
        .insert({ month: selMonth, label, payload, created_by: user.id });
      if (error) throw error;
      toast.success(`Snapshot saved for ${label}`);
      qc.invalidateQueries({ queryKey: ["monthly_snapshots"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not create snapshot");
    } finally {
      setCreating(false);
    }
  };

  const performDelete = async () => {
    if (!deleteId) return;
    const { error } = await (supabase as any).from("monthly_snapshots").delete().eq("id", deleteId);
    if (error) { toast.error(error.message); return; }
    toast.success("Snapshot deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["monthly_snapshots"] });
  };

  const openSnapshot = snapshots.find((s) => s.id === openId);

  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">Monthly Snapshot</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Read-only month-end summary. Does not affect any reports, balances, or live data.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Lock className="h-3 w-3" /> Read-only archive
        </span>
      </div>

      {/* Admin: create snapshot */}
      {isAdmin ? (
        <Card className="rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Create Monthly Snapshot</p>
              <p className="text-[11px] text-muted-foreground">
                Captures month totals + current wholesale / employee / supplier balances.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[160px]">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Month</Label>
              <Input
                type="month"
                className="h-10"
                value={selMonth.slice(0, 7)}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d{4}-\d{2}$/.test(v)) setSelMonth(`${v}-01`);
                }}
              />
            </div>
            <Button
              onClick={createSnapshot}
              disabled={creating || existing.has(selMonth)}
              className="h-10 gap-1.5"
            >
              <Plus className="h-4 w-4" />
              {creating ? "Saving…" : existing.has(selMonth) ? "Already exists" : "Create Snapshot"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border-amber-200 bg-amber-50/50 p-3">
          <p className="flex items-center gap-2 text-[12px] text-amber-800">
            <ShieldAlert className="h-4 w-4" />
            Only Admins can create or delete snapshots. You can view existing snapshots below.
          </p>
        </Card>
      )}

      {/* Snapshot list */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Saved Snapshots
        </p>
        {isLoading ? (
          <Card className="rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading…</Card>
        ) : snapshots.length === 0 ? (
          <Card className="rounded-2xl p-8 text-center">
            <FileBarChart className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
            <p className="text-sm font-medium">No snapshots yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isAdmin ? "Create your first month-end snapshot above." : "Ask an admin to create the first snapshot."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {snapshots.map((s) => {
              const p: SnapshotPayload = s.payload || {};
              return (
                <button
                  key={s.id}
                  onClick={() => setOpenId(s.id)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display text-sm font-bold">
                      <CalendarRange className="h-4 w-4 text-muted-foreground" />
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Saved {new Date(s.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                      Invest: <span className="font-semibold text-foreground">{SAR(p.company?.total_invest ?? 0)}</span>
                      {"  ·  "}
                      WH: <span className="font-semibold text-foreground">{SAR(p.company?.wholesale_value ?? 0)}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100">
                    Open →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail sheet */}
      <Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto p-0">
          {openSnapshot && (
            <SnapshotDetail
              snapshot={openSnapshot}
              canDelete={isAdmin}
              onDelete={() => { setOpenId(null); setDeleteId(openSnapshot.id); }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete snapshot?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the saved month-end summary. No transactions are affected.
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
// Detail view (printable)
// ============================================================

function SnapshotDetail({
  snapshot, canDelete, onDelete,
}: { snapshot: any; canDelete: boolean; onDelete: () => void }) {
  const p: SnapshotPayload = snapshot.payload || {};
  const shops = p.shops ?? [];
  const company = p.company ?? { total_cash_position: 0, total_bank_balance: 0, total_invest: 0, wholesale_value: 0 };

  const handlePrint = () => window.print();

  // Totals across shops for the bottom table row
  const sum = (k: keyof ShopSummary) => shops.reduce((s, x) => s + (Number(x[k]) || 0), 0);

  return (
    <>
      {/* Print-only CSS — hides everything except the printable surface. */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #snapshot-print, #snapshot-print * { visibility: visible !important; }
          #snapshot-print {
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
          <SheetTitle className="text-base">{snapshot.label} · Snapshot</SheetTitle>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </Button>
            {canDelete && (
              <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive hover:bg-destructive/10" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        </div>
      </SheetHeader>

      <div id="snapshot-print" className="mx-auto max-w-3xl px-4 py-5 text-[12.5px] text-foreground">
        {/* Header */}
        <div className="border-b border-foreground/30 pb-3 text-center">
          <p className="text-[22px] font-bold tracking-tight">ShRiAh Group</p>
          <p className="mt-1 text-[15px] font-semibold">Monthly Snapshot</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {snapshot.label} · Generated {new Date(snapshot.created_at).toLocaleString()}
          </p>
        </div>

        {/* Company Summary */}
        <SectionTitle>Company Summary</SectionTitle>
        <Rows
          rows={[
            ["Total Cash Position", company.total_cash_position],
            ["Total Bank Balance", company.total_bank_balance],
            ["Total Invest", company.total_invest, true],
            ["Wholesale Value", company.wholesale_value],
          ]}
        />

        {/* Shop Summary table */}
        <SectionTitle>Shop Summary</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11.5px]">
            <thead>
              <tr className="border-b border-foreground/40 text-left">
                <th className="py-1.5 pr-2 font-semibold">Shop</th>
                <th className="py-1.5 px-1 text-right font-semibold">Total Sale</th>
                <th className="py-1.5 px-1 text-right font-semibold">Cash</th>
                <th className="py-1.5 px-1 text-right font-semibold">Bank</th>
                <th className="py-1.5 px-1 text-right font-semibold">Credit</th>
                <th className="py-1.5 px-1 text-right font-semibold">Purchase</th>
                <th className="py-1.5 px-1 text-right font-semibold">Expense</th>
                <th className="py-1.5 px-1 text-right font-semibold">Withdraw</th>
                <th className="py-1.5 px-1 text-right font-semibold">Exp. Bank</th>
                <th className="py-1.5 pl-1 text-right font-semibold">Cash Pos.</th>
              </tr>
            </thead>
            <tbody>
              {shops.length === 0 ? (
                <tr><td colSpan={10} className="py-3 text-center text-muted-foreground">No shop data.</td></tr>
              ) : shops.map((s) => (
                <tr key={s.shop_id} className="border-b border-foreground/10">
                  <td className="py-1 pr-2 font-medium">{s.shop_name}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.total_sale)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.cash_sale)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.bank_sale)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.credit_sale)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.purchase)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.expense)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.withdraw)}</td>
                  <td className="py-1 px-1 text-right tabular-nums">{SAR(s.expected_balance)}</td>
                  <td className="py-1 pl-1 text-right font-semibold tabular-nums">{SAR(s.cash_position)}</td>
                </tr>
              ))}
              {shops.length > 0 && (
                <tr className="border-t-2 border-foreground/60 font-bold">
                  <td className="py-1.5 pr-2">TOTAL</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("total_sale"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("cash_sale"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("bank_sale"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("credit_sale"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("purchase"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("expense"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("withdraw"))}</td>
                  <td className="py-1.5 px-1 text-right tabular-nums">{SAR(sum("expected_balance"))}</td>
                  <td className="py-1.5 pl-1 text-right tabular-nums">{SAR(sum("cash_position"))}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Wholesale Summary */}
        <SectionTitle>Wholesale Summary</SectionTitle>
        <Rows
          rows={[
            ["Current Stock", p.wholesale?.current_stock ?? 0],
            ["Receivable", p.wholesale?.receivable ?? 0],
            ["Wholesale Value", p.wholesale?.value ?? 0, true],
          ]}
        />

        {/* Employee Summary */}
        <SectionTitle>Employee Summary</SectionTitle>
        <Rows
          rows={[
            ["Given (cumulative)", p.employees?.given ?? 0],
            ["Received (cumulative)", p.employees?.received ?? 0],
            ["Total Employee Balance", p.employees?.balance ?? 0, true],
          ]}
        />

        {/* Supplier Summary */}
        <SectionTitle>Supplier Summary</SectionTitle>
        <Rows rows={[["Total Supplier Due", p.suppliers?.total_due ?? 0, true]]} />

        <div className="mt-6 border-t border-foreground/20 pt-2 text-center text-[10px] text-muted-foreground">
          This snapshot is a read-only archive. It does not affect any live calculations or reports.
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-1 border-b border-foreground/20 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/80">
      {children}
    </p>
  );
}

function Rows({ rows }: { rows: Array<[string, number, boolean?]> }) {
  return (
    <div className="divide-y divide-foreground/10">
      {rows.map(([label, val, emphasis], i) => (
        <div key={i} className={cn("flex items-baseline justify-between py-1.5", emphasis && "font-bold")}>
          <span className="text-[12.5px]">{label}</span>
          <span className="tabular-nums">{SAR(val)}</span>
        </div>
      ))}
    </div>
  );
}
