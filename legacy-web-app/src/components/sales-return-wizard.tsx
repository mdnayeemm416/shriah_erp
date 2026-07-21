// Standalone Sales Return wizard (customer → invoice → lines → settlement).
// Not opened from the Sales Invoice — invoked only from the Sales Return page.
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Undo2, Wallet, Coins, Check } from "lucide-react";
import { SAR } from "@/lib/format";
import { PosCustomerPicker } from "@/components/pos-customer-picker";
import {
  fetchReturnedQtyMap, processSalesReturn, RETURN_REASONS, type RefundType,
} from "@/lib/sales-returns";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { openSalesReturnInvoice } from "@/lib/sales-return-invoice/share";
import { cn } from "@/lib/utils";
import { usePosDueMap } from "@/hooks/use-pos-due-map";

type SaleItem = { product_id?: string; name: string; qty: number; price: number };
type SaleRow = {
  id: string;
  invoice_number: number;
  created_at: string;
  total: number;
  paid_amount: number;
  due_amount: number;
  status: string;
  items: SaleItem[];
};

type LineDraft = {
  key: string;
  product_id: string | null;
  name: string;
  sold: number;
  already: number;
  price: number;
  qty: number;
  reason: string;
};

type Step = 1 | 2 | 3;

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const keyOf = (it: { product_id?: string | null; name: string }) =>
  String(it.product_id ?? it.name);

export function SalesReturnWizard({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState<PosCustomer | null>(null);
  const [sale, setSale] = useState<SaleRow | null>(null);
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [refundType, setRefundType] = useState<RefundType>("due_reduction");
  const [notes, setNotes] = useState("");
  const dueMap = usePosDueMap(open);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setCustomer(null);
      setSale(null);
      setLines([]);
      setRefundType("due_reduction");
      setNotes("");
    }
  }, [open]);

  // Step 2: sales for the chosen customer.
  const sales = useQuery({
    queryKey: ["sr-wizard-sales", customer?.id],
    enabled: open && step === 2 && !!customer?.id,
    queryFn: async (): Promise<SaleRow[]> => {
      const { data, error } = await supabase
        .from("shop_sales")
        .select("id,invoice_number,created_at,total,paid_amount,due_amount,status,items")
        .eq("customer_id", customer!.id)
        .neq("status", "fully_returned")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  // Step 3: current customer balance + already-returned map.
  const balance = useQuery({
    queryKey: ["sr-wizard-balance", customer?.id],
    enabled: open && step === 3 && !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer!.id!),
  });
  const returned = useQuery({
    queryKey: ["sr-wizard-returned", sale?.id],
    enabled: open && step === 3 && !!sale?.id,
    queryFn: () => fetchReturnedQtyMap(sale!.id),
  });

  useEffect(() => {
    if (step !== 3 || !sale || !returned.data) return;
    setLines(
      (sale.items ?? []).map((it) => {
        const k = keyOf(it);
        const already = returned.data!.get(k)?.qty ?? 0;
        return {
          key: k,
          product_id: it.product_id ?? null,
          name: it.name,
          sold: Number(it.qty) || 0,
          already,
          price: Number(it.price) || 0,
          qty: 0,
          reason: "",
        };
      }),
    );
  }, [step, sale, returned.data]);

  const totals = useMemo(() => {
    const value = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const totalQty = lines.reduce((s, l) => s + l.qty, 0);
    const oldBal = Number(balance.data?.current_due ?? 0);
    const newBal = refundType === "due_reduction" ? oldBal - value : oldBal;
    return { value, totalQty, oldBal, newBal };
  }, [lines, balance.data, refundType]);

  const canSubmit =
    step === 3 &&
    totals.totalQty > 0 &&
    lines.every((l) => l.qty === 0 || (l.qty > 0 && l.qty <= l.sold - l.already && l.reason));

  const submit = useMutation({
    mutationFn: async () => {
      if (!sale) return null;
      const items = lines
        .filter((l) => l.qty > 0)
        .map((l) => ({
          product_id: l.product_id ?? null,
          name: l.name,
          qty: l.qty,
          price: l.price,
          reason: l.reason,
        }));
      const tally = new Map<string, number>();
      for (const l of items) tally.set(l.reason, (tally.get(l.reason) ?? 0) + l.qty);
      const headerReason = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return processSalesReturn({
        saleId: sale.id,
        items,
        refundType,
        notes,
        reason: headerReason,
      });
    },
    onSuccess: (id) => {
      toast.success("Sales return recorded");
      qc.invalidateQueries({ queryKey: ["sales-returns"] });
      qc.invalidateQueries({ queryKey: ["admin-sales"] });
      qc.invalidateQueries({ queryKey: ["shop_products"] });
      qc.invalidateQueries({ queryKey: ["pos-balance"] });
      qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
      onOpenChange(false);
      if (id) openSalesReturnInvoice(id);
    },
    onError: (e: any) => toast.error(e?.message ?? "Return failed"),
  });

  function updateLine(idx: number, patch: Partial<LineDraft>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Undo2 className="h-4 w-4 text-rose-600" /> New Sales Return
            <Badge variant="outline" className="ml-auto text-[10px]">Step {step} of 3</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Select the customer who is returning items.</p>
              <PosCustomerPicker value={customer} onChange={setCustomer} showDue dueByCustomer={dueMap.data} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Pick the invoice being returned for <b>{customer?.name}</b>.
              </p>
              {sales.isLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : (sales.data ?? []).length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No returnable invoices for this customer.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {sales.data!.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setSale(s); setStep(3); }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
                        sale?.id === s.id && "border-primary bg-primary/10",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">INV-{s.invoice_number}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(s.created_at).toLocaleString()} · {s.items?.length ?? 0} items
                        </p>
                        {s.status === "partially_returned" && (
                          <Badge className="mt-1 bg-amber-500 text-[9px] text-white hover:bg-amber-500">Partial Return</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{SAR(s.total)}</p>
                        {s.due_amount > 0 && (
                          <p className="text-[10px] text-rose-600">Due {SAR(s.due_amount)}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && sale && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Returning
                </p>
                <p className="text-sm font-medium">{customer?.name} · INV-{sale.invoice_number}</p>
                <p className="text-[11px] text-muted-foreground">
                  Current balance: <b>{SAR(totals.oldBal)}</b>
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card">
                {lines.map((l, i) => {
                  const max = l.sold - l.already;
                  const invalid = l.qty > max;
                  return (
                    <div key={l.key + i} className="border-b border-border p-3 last:border-b-0">
                      <p className="text-sm font-medium">{l.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Sold <b>{l.sold}</b> · Returned <b>{l.already}</b> · Available{" "}
                        <b className={max === 0 ? "text-muted-foreground" : "text-primary"}>{max}</b> ·{" "}
                        {SAR(l.price)}
                      </p>
                      <div className="mt-2 flex items-end gap-2">
                        <div className="flex-1">
                          <Label className="text-[10px] text-muted-foreground">Return Qty</Label>
                          <Input
                            type="number" min={0} max={max} step="1"
                            value={l.qty || ""}
                            disabled={max === 0}
                            onChange={(e) => {
                              const v = Math.max(0, Math.min(max, Number(e.target.value) || 0));
                              updateLine(i, { qty: v });
                            }}
                            className={invalid ? "border-rose-500" : ""}
                          />
                        </div>
                        <div className="flex-[1.4]">
                          <Label className="text-[10px] text-muted-foreground">Reason</Label>
                          <Select
                            value={l.reason}
                            onValueChange={(v) => updateLine(i, { reason: v })}
                            disabled={l.qty === 0}
                          >
                            <SelectTrigger><SelectValue placeholder="Reason" /></SelectTrigger>
                            <SelectContent>
                              {RETURN_REASONS.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {l.qty > 0 && (
                        <p className="mt-1 text-right text-xs font-semibold">
                          Line: {SAR(l.qty * l.price)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <Label className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Settlement
                </Label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundType("due_reduction")}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition",
                      refundType === "due_reduction"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">Adjust Customer Due</span>
                    <span className="text-[10px] text-muted-foreground">Reduce outstanding balance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundType("cash")}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition",
                      refundType === "cash"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold">Cash Refund</span>
                    <span className="text-[10px] text-muted-foreground">Pay customer immediately</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-3 text-sm">
                <Row label="Return Value" value={SAR(totals.value)} bold />
                <Row label="Old Balance" value={SAR(totals.oldBal)} muted />
                <Row
                  label="New Balance"
                  value={SAR(totals.newBal)}
                  bold
                  tone={totals.newBal < 0 ? "danger" : undefined}
                />
                {refundType === "cash" && (
                  <div className="mt-2 flex justify-between rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <span>Cash out to customer</span>
                    <b>{SAR(totals.value)}</b>
                  </div>
                )}
              </div>

              <Textarea
                rows={2}
                placeholder="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border bg-muted/20 px-4 py-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as Step)}
              disabled={submit.isPending}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          )}

          {step === 1 && (
            <Button
              className="flex-1"
              disabled={!customer}
              onClick={() => setStep(2)}
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          {step === 2 && (
            <Button className="flex-1" disabled={!sale} onClick={() => setStep(3)}>
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          {step === 3 && (
            <Button
              className="flex-1"
              disabled={!canSubmit || submit.isPending}
              onClick={() => submit.mutate()}
            >
              {submit.isPending
                ? <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                : <Check className="mr-1 h-4 w-4" />}
              Confirm Return
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label, value, bold, muted, tone,
}: { label: string; value: string; bold?: boolean; muted?: boolean; tone?: "danger" }) {
  return (
    <div className={cn(
      "flex justify-between",
      muted && "text-xs text-muted-foreground",
      tone === "danger" && "text-rose-600",
    )}>
      <span>{label}</span>
      {bold ? <b>{value}</b> : <span>{value}</span>}
    </div>
  );
}
