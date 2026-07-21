import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, MessageCircle, Pencil, Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { shareStatement, type StatementRow } from "@/lib/invoice-image";
import { useUserAccess } from "@/hooks/use-user-access";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customer: PosCustomer | null;
  onPaymentIn?: () => void;
};

export function PosCustomerStatementDialog({ open, onOpenChange, customer, onPaymentIn }: Props) {
  const qc = useQueryClient();
  const { isAdmin, isManager } = useUserAccess();
  const canEditOpening = isAdmin || isManager;
  const confirm = useConfirm();

  const [editOpen, setEditOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editNote, setEditNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editOpen && customer) {
      setEditValue(String(customer.opening_due ?? 0));
      setEditNote("");
    }
  }, [editOpen, customer]);

  async function handleSaveOpening() {
    if (!customer) return;
    const next = Number(editValue);
    if (!Number.isFinite(next) || next < 0) {
      toast.error("Enter a valid opening balance");
      return;
    }
    const old = Number(customer.opening_due ?? 0);
    if (next === old) { setEditOpen(false); return; }
    const ok = await confirm({
      tone: "warning",
      title: "Update opening balance?",
      description: `Change from SAR ${old.toFixed(2)} to SAR ${next.toFixed(2)}. Ledger history stays intact; only the base balance changes.`,
      confirmText: "Update",
    });
    if (!ok) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("pos_customers")
        .update({ opening_due: next })
        .eq("id", customer.id);
      if (error) throw error;
      await supabase.from("pos_customer_opening_edits").insert({
        customer_id: customer.id,
        old_value: old,
        new_value: next,
        note: editNote || null,
      });
      toast.success("Opening balance updated");
      setEditOpen(false);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["pos-balance", customer.id] }),
        qc.invalidateQueries({ queryKey: ["pos-customers"] }),
        qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] }),
        qc.invalidateQueries({ queryKey: ["warehouse-financial"] }),
      ]);
      // Mutate local field so the UI shows new value without re-open
      (customer as any).opening_due = next;
    } catch (e: any) {
      toast.error(e?.message || "Failed to update opening balance");
    } finally {
      setSaving(false);
    }
  }

  const balance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer!.id),
  });

  const sales = useQuery({
    queryKey: ["pos-cust-sales", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_sales")
        .select("id,invoice_number,total,paid_amount,due_amount,txn_date,created_at,status,payment_method")
        .eq("customer_id", customer!.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const payments = useQuery({
    queryKey: ["pos-cust-payments", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pos_payments")
        .select("id,amount,method,txn_date,created_at,kind,notes,sale_id")
        .eq("customer_id", customer!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rows: StatementRow[] = useMemo(() => {
    if (!customer) return [];
    const items: Array<{ ts: string; date: string; label: string; sub?: string; debit?: number; credit?: number }> = [];
    for (const s of sales.data ?? []) {
      if (s.status === "cancelled") continue;
      items.push({
        ts: s.created_at,
        date: new Date(s.created_at).toLocaleDateString(),
        label: `Sale #${s.invoice_number}`,
        sub: `Paid ${Number(s.paid_amount).toFixed(2)} · Due ${Number(s.due_amount).toFixed(2)}`,
        debit: Number(s.total),
      });
      if (Number(s.paid_amount) > 0) {
        items.push({
          ts: s.created_at,
          date: new Date(s.created_at).toLocaleDateString(),
          label: `Sale payment`,
          sub: `Via ${s.payment_method}`,
          credit: Number(s.paid_amount),
        });
      }
    }
    for (const p of payments.data ?? []) {
      if (p.kind === "sale_partial") continue; // already counted with the sale
      items.push({
        ts: p.created_at,
        date: new Date(p.created_at).toLocaleDateString(),
        label: p.kind === "refund" ? "Refund" : "Payment In",
        sub: p.notes ?? `via ${p.method}`,
        credit: Number(p.amount),
      });
    }
    items.sort((a, b) => a.ts.localeCompare(b.ts));

    let bal = customer.opening_due;
    const out: StatementRow[] = [];
    for (const it of items) {
      bal += (it.debit ?? 0) - (it.credit ?? 0);
      out.push({ date: it.date, label: it.label, sub: it.sub, debit: it.debit, credit: it.credit, balance: bal });
    }
    return out;
  }, [customer, sales.data, payments.data]);

  async function handleShare() {
    if (!customer || !balance.data) return;
    await shareStatement({
      customerName: customer.name,
      customerMobile: customer.phone ?? undefined,
      opening: customer.opening_due,
      rows,
      currentDue: balance.data.current_due,
      totalPaid: balance.data.total_paid,
      totalSales: balance.data.total_sales,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            {customer?.name ?? "Customer"} statement
          </DialogTitle>
        </DialogHeader>

        {!customer ? null : balance.isLoading ? (
          <div className="flex items-center justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Opening" value={customer.opening_due} />
              <Stat label="Total paid" value={balance.data?.total_paid ?? 0} tone="success" />
              <Stat label="Current due" value={balance.data?.current_due ?? 0} tone={balance.data && balance.data.current_due > 0 ? "danger" : "success"} highlight />
            </div>

            <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Activity</span>
                <span>Balance</span>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Opening balance</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">SAR {customer.opening_due.toFixed(2)}</span>
                  {canEditOpening && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditOpen(true)}
                      title="Edit opening balance"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              {rows.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">No activity yet</p>
              ) : (
                rows.slice().reverse().map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{r.date}{r.sub ? ` · ${r.sub}` : ""}</p>
                    </div>
                    <div className="text-right">
                      {r.debit ? <p className="text-sm font-semibold text-rose-600">+{r.debit.toFixed(2)}</p> : null}
                      {r.credit ? <p className="text-sm font-semibold text-emerald-600">-{r.credit.toFixed(2)}</p> : null}
                      <p className="text-[10px] text-muted-foreground">Bal {r.balance.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-border bg-muted/20 px-4 py-3">
          <Button variant="outline" onClick={onPaymentIn}><Wallet className="mr-1 h-4 w-4" /> Payment In</Button>
          <Button onClick={handleShare} className="bg-emerald-600 text-white hover:bg-emerald-700">
            <MessageCircle className="mr-1 h-4 w-4" /> Share statement
          </Button>
        </div>
      </DialogContent>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Edit opening balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Opening balance (SAR)</label>
              <Input
                type="number"
                inputMode="decimal"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Note (optional)</label>
              <Textarea
                rows={2}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Reason for adjustment"
              />
            </div>
            <p className="rounded-md bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground">
              Ledger entries stay unchanged. Current due will recalculate as: opening + sales due − payments in.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveOpening} disabled={saving}>
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function Stat({ label, value, tone, highlight }: { label: string; value: number; tone?: "success" | "danger"; highlight?: boolean }) {
  const color = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-rose-600" : "text-foreground";
  return (
    <div className={`rounded-xl border border-border ${highlight ? "bg-primary/5" : "bg-card"} px-2 py-2 text-center`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${color}`}>{value.toFixed(2)}</p>
    </div>
  );
}
