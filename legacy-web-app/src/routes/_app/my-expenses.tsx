import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SARAmount } from "@/components/sar-amount";
import {
  Pencil, Trash2, Paperclip, Wallet, Receipt, ArrowUpCircle, ArrowDownCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EmployeeExpenseDialog, type EmployeeExpenseRow,
} from "@/components/employee-expense-dialog";
import { computeWalletTotals, type WalletKind, type WalletRow } from "@/lib/employee-wallet";

export const Route = createFileRoute("/_app/my-expenses")({
  component: MyWalletPage,
});

type FilterKey = "today" | "week" | "month" | "custom" | "all";

function MyWalletPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>("month");
  const [customFrom, setCustomFrom] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [customTo, setCustomTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKind, setDialogKind] = useState<WalletKind>("expense");
  const [editing, setEditing] = useState<EmployeeExpenseRow | null>(null);
  const [delTarget, setDelTarget] = useState<EmployeeExpenseRow | null>(null);

  const { data: employee, isLoading: empLoading } = useQuery({
    queryKey: ["my-employee-link", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employees")
        .select("id, name, shop_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as { id: string; name: string; shop_name: string | null } | null;
    },
  });

  const { data: rows = [] } = useQuery({
    queryKey: ["employee-wallet", employee?.id],
    enabled: !!employee?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expenses")
        .select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at, created_by")
        .eq("employee_id", employee!.id)
        .eq("is_deleted", false)
        .order("txn_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WalletRow[];
    },
  });

  const totals = useMemo(() => computeWalletTotals(rows), [rows]);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "custom") return rows.filter((r) => r.txn_date >= customFrom && r.txn_date <= customTo);
    const now = new Date();
    const start = new Date(now);
    if (filter === "today") start.setHours(0, 0, 0, 0);
    else if (filter === "week") { start.setDate(now.getDate() - 7); start.setHours(0, 0, 0, 0); }
    else if (filter === "month") start.setDate(1);
    const startISO = start.toISOString().slice(0, 10);
    return rows.filter((r) => r.txn_date >= startISO);
  }, [rows, filter, customFrom, customTo]);

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("employee_expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
      qc.invalidateQueries({ queryKey: ["employee-expenses"] });
      setDelTarget(null);
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  });

  if (empLoading) return <div className="h-40 animate-pulse rounded-2xl bg-muted/40" />;

  if (!employee) {
    return (
      <div className="mobile-page-stack">
        <Card>
          <CardContent className="py-10 text-center">
            <Receipt className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Not linked to an employee profile</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask an admin to link your login to your employee record from Employees → Edit.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canEdit = (e: WalletRow) => {
    if (!e.created_at) return false;
    const age = Date.now() - new Date(e.created_at).getTime();
    return age < 24 * 60 * 60 * 1000 && e.created_by === user?.id;
  };

  const openNew = (kind: WalletKind) => { setEditing(null); setDialogKind(kind); setDialogOpen(true); };

  return (
    <div className="mobile-page-stack animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">My Wallet</h1>
          <p className="text-[11px] text-muted-foreground">
            {employee.name}{employee.shop_name ? ` · ${employee.shop_name}` : ""}
          </p>
        </div>
      </div>

      {/* Wallet balance hero */}
      <div className={cn(
        "rounded-2xl border p-4",
        totals.balance >= 0
          ? "border-primary/40 bg-primary/5"
          : "border-destructive/40 bg-destructive/5",
      )}>
        <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          <Wallet className="h-3.5 w-3.5" /> Wallet Balance
        </p>
        <SARAmount value={totals.balance} size="lg" className={cn(totals.balance >= 0 ? "text-primary" : "text-destructive")} />
        <p className="mt-1 text-[11px] text-muted-foreground">
          {totals.balance >= 0
            ? "You are still holding this much company money."
            : "The company owes you this amount."}
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2">
        <SummaryTile label="Total Deposit" value={totals.deposit} tone="success" />
        <SummaryTile label="Total Expense" value={totals.expense} tone="destructive" />
        <SummaryTile label="Deposit (This Month)" value={totals.depositMonth} tone="success" />
        <SummaryTile label="Expense (This Month)" value={totals.expenseMonth} tone="destructive" />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => openNew("expense")}>
          <ArrowUpCircle className="h-4 w-4 text-destructive" /> New Expense
        </Button>
        <Button variant="outline" onClick={() => openNew("deposit")}>
          <ArrowDownCircle className="h-4 w-4 text-success" /> New Deposit
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {(["today", "week", "month", "custom", "all"] as FilterKey[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium capitalize transition-colors",
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40",
            )}
          >
            {f === "all" ? "All" : f === "today" ? "Today" : f === "week" ? "This Week" : f === "month" ? "This Month" : "Custom"}
          </button>
        ))}
      </div>

      {filter === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-9 text-xs" />
          <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-9 text-xs" />
        </div>
      )}

      {/* Transaction list */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-xs text-muted-foreground">
            No transactions in this range.
          </CardContent></Card>
        ) : (
          filtered.map((e) => {
            const isDeposit = e.kind === "deposit";
            return (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  isDeposit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                )}>
                  {isDeposit ? <ArrowDownCircle className="h-5 w-5" /> : <ArrowUpCircle className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{isDeposit ? "Deposit" : e.category ?? "Expense"}</p>
                    {e.attachment_url && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                    {e.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {new Date(e.txn_date).toLocaleDateString()} · {e.note}
                  </p>
                </div>
                <SARAmount value={Number(e.amount)} size="md" className={cn("shrink-0", isDeposit ? "text-success" : "text-destructive")} />
                {canEdit(e) && (
                  <div className="flex items-center gap-0.5">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(e); setDialogKind(e.kind); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDelTarget(e)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <EmployeeExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employeeId={employee.id}
        expense={editing}
        initialKind={dialogKind}
      />

      <AlertDialog open={!!delTarget} onOpenChange={(v) => { if (!v) setDelTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this wallet entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This only removes the wallet record. It does not affect any company accounting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => delTarget && delMut.mutate(delTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SummaryTile({ label, value, tone }: { label: string; value: number; tone?: "success" | "destructive" }) {
  return (
    <div className="rounded-2xl border border-border/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <SARAmount value={value} size="md" className={cn(
        "mt-0.5",
        tone === "success" && "text-success",
        tone === "destructive" && "text-destructive",
      )} />
    </div>
  );
}
