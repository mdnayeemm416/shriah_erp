import { useHighlightRecord } from "@/hooks/use-highlight-record";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SARAmount } from "@/components/sar-amount";
import {
  ArrowLeft, ArrowDownCircle, ArrowUpCircle, Pencil, Trash2, Share2,
  Phone, Store, IdCard, FileText, Plus, MoreVertical, Paperclip,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { EmployeeFormDialog, type EmployeeRow } from "@/components/employee-form-dialog";
import { EmployeeEntryDialog, type EntryRow } from "@/components/employee-entry-dialog";
import { EmployeeExpenseDialog } from "@/components/employee-expense-dialog";
import { shareEmployeeEntry } from "@/components/employee-share-card";
import { EmployeeEntryDetailDialog } from "@/components/employee-entry-detail-dialog";
import { shareEmployeeStatementWhatsApp, downloadStatementImage, type StatementInput } from "@/components/employee-history-share";
import { softDelete } from "@/lib/soft-delete";
import { sendAuditEmail } from "@/lib/audit-email";

export const Route = createFileRoute("/_app/employees/$employeeId")({
  component: EmployeeDetail,
});

function EmployeeDetail() {
  useHighlightRecord();
  const { employeeId } = Route.useParams();
  const qc = useQueryClient();
  const nav = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryType, setEntryType] = useState<"given" | "received">("given");
  const [editEntry, setEditEntry] = useState<EntryRow | null>(null);
  const [delOpen, setDelOpen] = useState(false);
  const [delEntry, setDelEntry] = useState<EntryRow | null>(null);
  const [delEmployee, setDelEmployee] = useState(false);
  const [detailEntry, setDetailEntry] = useState<(EntryRow & { created_at?: string; created_by?: string | null }) | null>(null);

  const { user } = useAuth();
  const { data: isAdmin = false } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employees", employeeId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .maybeSingle();
      if (error) throw error;
      return data as EmployeeRow | null;
    },
  });

  const { data: entries = [] } = useQuery({
    queryKey: ["employee-entries", employeeId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_entries")
        .select("id, employee_id, entry_type, amount, txn_date, notes, attachment_url, created_at")
        .eq("employee_id", employeeId)
        .eq("is_deleted", false)
        .order("txn_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as (EntryRow & { created_at: string })[];
    },
  });

  const totals = useMemo(() => {
    const t = { given: 0, received: 0 };
    for (const e of entries) {
      if (e.entry_type === "given") t.given += Number(e.amount);
      else t.received += Number(e.amount);
    }
    return { ...t, balance: t.given - t.received };
  }, [entries]);

  const delEntryMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await softDelete("employee_entries", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({ queryKey: ["employee-entries"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setDelOpen(false);
      setDelEntry(null);
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  });

  const delEmpMut = useMutation({
    mutationFn: async () => {
      const { error } = await softDelete("employees", employeeId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Employee removed");
      qc.invalidateQueries({ queryKey: ["employees"] });
      nav({ to: "/employees" });
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete employee"),
  });

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted/40" />;
  }
  if (!employee) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm font-medium">Employee not found</p>
          <Link to="/employees" className="mt-3 inline-block text-xs text-primary underline">Back to employees</Link>
        </CardContent>
      </Card>
    );
  }

  const statement: StatementInput = {
    employeeName: employee.name,
    shopName: employee.shop_name,
    mobile: employee.mobile,
    iqama: employee.iqama,
    totalGiven: totals.given,
    totalReceived: totals.received,
    balance: totals.balance,
    entries: entries.map((e) => ({
      id: e.id,
      entry_type: e.entry_type,
      amount: Number(e.amount),
      txn_date: e.txn_date,
      notes: e.notes,
    })),
  };

  return (
    <div className="mobile-page-stack animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/employees"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All employees
        </Link>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={async () => {
              try {
                const res = await shareEmployeeStatementWhatsApp(statement);
                if (res.kind === "fallback-link") {
                  toast.message("WhatsApp opened. Image copied — paste it into the chat.");
                } else if (res.kind === "unsupported") {
                  toast.message("Sharing not supported on this device.", {
                    action: {
                      label: "Download Image",
                      onClick: () => downloadStatementImage(res.blob, res.fileName),
                    },
                  });
                }
              } catch (e: any) {
                toast.error(e?.message || "Failed to share statement");
              }
            }}
          >
            <MessageCircle className="h-3.5 w-3.5" /> Share History
          </Button>
          {isAdmin && (
            <>
              <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDelEmployee(true)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile card */}
      <Card className="card-hero">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                {employee.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">{employee.name}</h1>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  {employee.shop_name && <span className="inline-flex items-center gap-1"><Store className="h-3 w-3" />{employee.shop_name}</span>}
                  {employee.mobile && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{employee.mobile}</span>}
                  {employee.iqama && <span className="inline-flex items-center gap-1"><IdCard className="h-3 w-3" />{employee.iqama}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Current Balance</p>
            <SARAmount
              value={Math.abs(totals.balance)}
              size="3xl"
              className={cn(
                "mt-1",
                totals.balance > 0 && "text-destructive",
                totals.balance < 0 && "text-success",
                totals.balance === 0 && "text-muted-foreground",
              )}
            />
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {totals.balance > 0 ? "Due from employee" : totals.balance < 0 ? "Advance held" : "Fully settled"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Given</p>
              <SARAmount value={totals.given} size="md" className="mt-0.5 text-destructive" />
            </div>
            <div className="rounded-xl border border-border/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Received</p>
              <SARAmount value={totals.received} size="md" className="mt-0.5 text-success" />
            </div>
          </div>

          {employee.notes && (
            <div className="mt-4 rounded-xl border border-border/40 bg-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes</p>
              <p className="mt-1 text-xs">{employee.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-12 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => { setEntryType("given"); setEditEntry(null); setEntryOpen(true); }}
        >
          <ArrowUpCircle className="h-4 w-4" /> Money Given
        </Button>
        <Button
          variant="outline"
          className="h-12 border-success/30 text-success hover:bg-success/10 hover:text-success"
          onClick={() => { setEntryType("received"); setEditEntry(null); setEntryOpen(true); }}
        >
          <ArrowDownCircle className="h-4 w-4" /> Money Received
        </Button>
      </div>

      {/* Employee Expenses (admin view) */}
      {isAdmin && <EmployeeExpensesAdminSection employeeId={employeeId} />}

      {/* Entries */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent entries</h3>
          <span className="text-[11px] text-muted-foreground">{entries.length} total</span>
        </div>

        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-xs text-muted-foreground">
              No entries yet. Add money given or received above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {entries.map((e) => {
              const isGiven = e.entry_type === "given";
              const shareEntry = () =>
                shareEmployeeEntry({
                  employeeName: employee.name,
                  shopName: employee.shop_name,
                  amount: Number(e.amount),
                  entryType: e.entry_type,
                  date: new Date(e.txn_date).toLocaleDateString(),
                  notes: e.notes,
                  balanceAfter: totals.balance,
                });
              return (
                <div
                  key={e.id}
                  data-record-id={e.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetailEntry(e)}
                  onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") setDetailEntry(e); }}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-all hover:border-primary/30 hover:bg-muted/30 active:scale-[0.99]"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      isGiven ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
                    )}
                  >
                    {isGiven ? <ArrowUpCircle className="h-5 w-5" /> : <ArrowDownCircle className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{isGiven ? "Given" : "Received"}</p>
                      {e.attachment_url && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {new Date(e.txn_date).toLocaleDateString()}{e.notes ? " · " + e.notes : ""}
                    </p>
                  </div>
                  <SARAmount
                    value={Number(e.amount)}
                    size="md"
                    className={cn("shrink-0", isGiven ? "text-destructive" : "text-success")}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 text-muted-foreground"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(ev) => ev.stopPropagation()}>
                      <DropdownMenuItem onClick={shareEntry}>
                        <Share2 className="h-3.5 w-3.5" /> Share to WhatsApp
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => { setEditEntry(e); setEntryOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                      )}
                      {e.attachment_url && (
                        <DropdownMenuItem onClick={() => window.open(e.attachment_url!, "_blank")}>
                          <FileText className="h-3.5 w-3.5" /> View attachment
                        </DropdownMenuItem>
                      )}
                      {isAdmin && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => { setDelEntry(e); setDelOpen(true); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add button: hidden on mobile during scroll recovery to avoid blocking content. */}
      <button
        onClick={() => { setEditEntry(null); setEntryType("given"); setEntryOpen(true); }}
        className="fixed end-5 z-30 hidden h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20 transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:flex md:h-14 md:w-14"
        aria-label="New entry"
      >
        <Plus className="h-6 w-6" />
      </button>

      <EmployeeFormDialog open={editOpen} onOpenChange={setEditOpen} employee={employee} />
      <EmployeeEntryDialog
        open={entryOpen}
        onOpenChange={setEntryOpen}
        employeeId={employeeId}
        initialType={entryType}
        entry={editEntry}
      />

      <EmployeeEntryDetailDialog
        open={!!detailEntry}
        onOpenChange={(v) => { if (!v) setDetailEntry(null); }}
        entry={detailEntry}
        employeeName={employee.name}
        isAdmin={isAdmin}
        onEdit={() => {
          if (!detailEntry) return;
          setEditEntry(detailEntry);
          setDetailEntry(null);
          setEntryOpen(true);
        }}
        onDelete={() => {
          if (!detailEntry) return;
          setDelEntry(detailEntry);
          setDetailEntry(null);
          setDelOpen(true);
        }}
        onShare={() => {
          if (!detailEntry) return;
          shareEmployeeEntry({
            employeeName: employee.name,
            shopName: employee.shop_name,
            amount: Number(detailEntry.amount),
            entryType: detailEntry.entry_type,
            date: new Date(detailEntry.txn_date).toLocaleDateString(),
            notes: detailEntry.notes,
            balanceAfter: totals.balance,
          });
        }}
      />

      <AlertDialog open={delOpen} onOpenChange={setDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              The linked transaction will also be removed. Cash balances will update automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => delEntry && delEntryMut.mutate(delEntry.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={delEmployee} onOpenChange={setDelEmployee}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this employee?</AlertDialogTitle>
            <AlertDialogDescription>
              All entries will be removed and linked transactions reversed. Admin only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => delEmpMut.mutate()}
              className="bg-destructive text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Admin: Employee Wallet section (tracking only, no accounting impact) ---
function EmployeeExpensesAdminSection({ employeeId }: { employeeId: string }) {
  const qc = useQueryClient();
  const [expDlgOpen, setExpDlgOpen] = useState(false);
  const [editExp, setEditExp] = useState<any>(null);
  const [delExp, setDelExp] = useState<any>(null);
  const [dlgKind, setDlgKind] = useState<"expense" | "deposit">("expense");

  const { data: rows = [] } = useQuery({
    queryKey: ["employee-wallet", employeeId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expenses")
        .select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at, created_by")
        .eq("employee_id", employeeId)
        .eq("is_deleted", false)
        .order("txn_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const totals = (() => {
    const monthPrefix = new Date().toISOString().slice(0, 7);
    let d = 0, e = 0, dm = 0, em = 0;
    for (const r of rows) {
      const amt = Number(r.amount);
      if (r.kind === "deposit") {
        if (r.status === "verified") { d += amt; if (r.txn_date.startsWith(monthPrefix)) dm += amt; }
      } else {
        e += amt; if (r.txn_date.startsWith(monthPrefix)) em += amt;
      }
    }
    return { deposit: d, expense: e, balance: d - e, depositMonth: dm, expenseMonth: em };
  })();

  const verifyMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("employee_expenses")
        .update({ status: "verified", verified_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit verified");
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const delMut = useMutation({
    mutationFn: async (row: any) => {
      const { error } = await (supabase as any).from("employee_expenses").delete().eq("id", row.id);
      if (error) throw error;
      sendAuditEmail({
        action: "deleted", module: "Employee Wallet",
        recordId: row.id, amount: Number(row.amount), notes: row.note,
        oldValues: { employee_id: row.employee_id, kind: row.kind, amount: row.amount, category: row.category, note: row.note, txn_date: row.txn_date, attachment_url: row.attachment_url },
      });
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
      setDelExp(null);
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  });

  const openNew = (k: "expense" | "deposit") => { setDlgKind(k); setEditExp(null); setExpDlgOpen(true); };

  return (
    <div className="space-y-2 rounded-2xl border border-primary/20 bg-primary/[0.02] p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Employee Wallet</h3>
          <p className="text-[10px] text-muted-foreground">
            Tracking only — does not affect company accounting.
          </p>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => openNew("expense")}>
            <Plus className="h-3.5 w-3.5" /> Expense
          </Button>
          <Button size="sm" variant="outline" onClick={() => openNew("deposit")}>
            <Plus className="h-3.5 w-3.5" /> Deposit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border/60 p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Balance</p>
          <SARAmount value={totals.balance} size="sm" className={totals.balance >= 0 ? "text-primary" : "text-destructive"} />
        </div>
        <div className="rounded-xl border border-border/60 p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Deposit</p>
          <SARAmount value={totals.deposit} size="sm" className="text-success" />
        </div>
        <div className="rounded-xl border border-border/60 p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Expense</p>
          <SARAmount value={totals.expense} size="sm" className="text-destructive" />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">No wallet entries yet.</p>
      ) : (
        <div className="space-y-1">
          {rows.slice(0, 20).map((e) => {
            const isDep = e.kind === "deposit";
            return (
              <div key={e.id} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card p-2.5 text-xs">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isDep ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                )}>
                  {isDep ? <ArrowDownCircle className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{isDep ? "Deposit" : (e.category ?? "Expense")}</span>
                    {e.attachment_url && (
                      <a href={e.attachment_url} target="_blank" rel="noreferrer" className="text-primary">
                        <Paperclip className="h-3 w-3" />
                      </a>
                    )}
                    {e.status === "pending" && (
                      <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground">Pending</span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {new Date(e.txn_date).toLocaleDateString()} · {e.note}
                  </p>
                </div>
                <SARAmount value={Number(e.amount)} size="sm" className={isDep ? "text-success" : "text-destructive"} />
                {e.status === "pending" && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-success" title="Verify" onClick={() => verifyMut.mutate(e.id)}>
                    <ArrowDownCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setDlgKind(e.kind); setEditExp(e); setExpDlgOpen(true); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDelExp(e)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <EmployeeExpenseDialog
        open={expDlgOpen}
        onOpenChange={setExpDlgOpen}
        employeeId={employeeId}
        expense={editExp}
        initialKind={dlgKind}
        isAdmin
      />

      <AlertDialog open={!!delExp} onOpenChange={(v) => { if (!v) setDelExp(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this wallet entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Wallet-only record. Does not affect any company accounting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => delExp && delMut.mutate(delExp)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


