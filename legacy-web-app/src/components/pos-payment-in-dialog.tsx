import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, MessageCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PosCustomerPicker } from "./pos-customer-picker";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { sharePaymentReceipt } from "@/lib/invoice-image";
import { refreshWholesaleDataInBackground, traceWholesaleFlow } from "@/lib/wholesale-query-utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialCustomer?: PosCustomer | null;
};

export function PosPaymentInDialog({ open, onOpenChange, initialCustomer }: Props) {
  const qc = useQueryClient();
  const [customer, setCustomer] = useState<PosCustomer | null>(initialCustomer ?? null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setCustomer(initialCustomer ?? null);
      setAmount(""); setMethod("cash"); setNotes("");
    }
  }, [open, initialCustomer]);

  const balance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer!.id),
  });

  const save = useMutation({
    mutationFn: async (alsoShare: boolean) => {
      if (!customer) throw new Error("Pick a customer");
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { data, error } = await supabase.from("pos_payments").insert({
        customer_id: customer.id, amount: amt, method, notes: notes.trim() || null, kind: "payment_in",
      }).select("*").single();
      if (error) throw error;
      return { row: data, alsoShare, prev: balance.data?.current_due ?? 0 };
    },
    onSuccess: async ({ row, alsoShare, prev }) => {
      traceWholesaleFlow("mutation success", { type: "payment_in", id: row.id });
      qc.setQueryData<Map<string, number>>(["pos-customer-due-map"], (old) => {
        const next = new Map(old ?? []);
        next.set(customer!.id, (next.get(customer!.id) ?? prev) - Number(row.amount ?? 0));
        return next;
      });
      qc.setQueryData(["pos-balance", customer!.id], (old: any) => old ? {
        ...old,
        total_paid: Number(old.total_paid ?? 0) + Number(row.amount ?? 0),
        current_due: Number(old.current_due ?? prev) - Number(row.amount ?? 0),
      } : old);
      qc.setQueryData<any[]>(["wh-recent-entries", 20], (old = []) => [{
        id: `payment_in-${row.id}`,
        refId: row.id,
        kind: "payment_in",
        title: customer!.name,
        subtitle: row.notes || "Payment received",
        amount: Number(row.amount ?? 0),
        at: row.created_at,
      }, ...old].slice(0, 20));
      refreshWholesaleDataInBackground(qc);
      toast.success("Payment recorded");
      onOpenChange(false);
      if (alsoShare && customer) {
        await sharePaymentReceipt({
          receiptNumber: String(row.id).slice(0, 8).toUpperCase(),
          date: new Date(row.created_at).toLocaleDateString(),
          customerName: customer.name,
          customerMobile: customer.phone ?? undefined,
          amount: Number(row.amount),
          method: row.method,
          notes: row.notes ?? undefined,
          previousDue: prev,
          newDue: prev - Number(row.amount),
        });
      }
    },
    onError: (e: any) => { traceWholesaleFlow("mutation failed", { type: "payment_in", message: e?.message }); toast.error(e?.message ?? "Failed"); },
  });

  const prevDue = balance.data?.current_due ?? 0;
  const newDue = prevDue - (Number(amount) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-emerald-600" />
            Payment In
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 px-4 py-4">
          <PosCustomerPicker value={customer} onChange={setCustomer} showDue dueByCustomer={customer ? new Map([[customer.id, prevDue]]) : undefined} />

          {customer && balance.data && (
            <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Current due</span><span className="font-bold">SAR {prevDue.toFixed(2)}</span></div>
              {amount && (
                <div className="mt-1 flex justify-between border-t border-border/60 pt-1">
                  <span className="text-muted-foreground">After this payment</span>
                  <span className={newDue > 0 ? "font-bold text-rose-600" : "font-bold text-emerald-600"}>
                    SAR {newDue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Amount *</label>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className="h-11 text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Method</label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="bank">Bank transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Textarea placeholder="Notes (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />

          {newDue < 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-3.5 w-3.5" />
              Payment exceeds current due — customer will have credit balance.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-border bg-muted/20 px-4 py-3">
          <Button variant="outline" disabled={save.isPending} onClick={() => save.mutate(true)} className="gap-1.5">
            <MessageCircle className="h-4 w-4" /> Save & Share
          </Button>
          <Button disabled={save.isPending} onClick={() => save.mutate(false)}>
            Save payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
