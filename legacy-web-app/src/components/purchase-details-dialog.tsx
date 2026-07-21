import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2, X, Truck, FileText, CalendarDays, User2, Hash } from "lucide-react";
import { toast } from "sonner";
import { softDelete, restore } from "@/lib/soft-delete";
import { useConfirm } from "@/hooks/use-confirm";
import { SAR } from "@/lib/format";
import { useProfileMap, displayProfile } from "@/hooks/use-profile-map";
import { TransactionDialog } from "@/components/transaction-dialog";

type PurchaseItem = {
  product_id?: string;
  name: string;
  qty: number;
  price: number;
  cost?: number;
};

type Purchase = {
  id: string;
  invoice_number: number;
  supplier_name: string | null;
  supplier_mobile: string | null;
  txn_date: string | null;
  memo_date: string | null;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  purchaseId: string | null;
};

export function PurchaseDetailsDialog({ open, onOpenChange, purchaseId }: Props) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const profiles = useProfileMap();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const purchase = useQuery({
    queryKey: ["purchase-detail", purchaseId],
    enabled: open && !!purchaseId,
    queryFn: async (): Promise<Purchase | null> => {
      const { data, error } = await supabase
        .from("shop_purchases")
        .select("*")
        .eq("id", purchaseId!)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as any;
    },
  });

  const p = purchase.data;
  const items: PurchaseItem[] = useMemo(() => (p?.items ?? []) as any, [p]);

  const totals = useMemo(() => {
    let qty = 0;
    let subtotal = 0;
    for (const it of items) {
      const q = Number(it.qty) || 0;
      const price = Number(it.price) || 0;
      qty += q;
      subtotal += q * price;
    }
    return { qty, subtotal };
  }, [items]);

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["purchase-detail", purchaseId] });
    qc.invalidateQueries({ queryKey: ["admin-purchases"] });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["warehouse-value"] });
    qc.invalidateQueries({ queryKey: ["store-admin-overview"] });
  };

  const handleDelete = async () => {
    if (!p) return;
    const ok = await confirm({
      title: "Delete purchase?",
      description: "This will move the purchase to Recycle Bin and reverse the stock movement. You can restore it later.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning",
      details: [
        { label: "Invoice", value: `#${p.invoice_number}` },
        { label: "Supplier", value: p.supplier_name || "—" },
        { label: "Amount", value: `SAR ${Number(p.total ?? 0).toFixed(2)}` },
        { label: "Date", value: new Date(p.created_at).toLocaleDateString() },
      ],
    });
    if (!ok) return;
    setBusy(true);
    const { error } = await softDelete("shop_purchases", p.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin — stock restored", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: rErr } = await restore("shop_purchases", p.id);
          if (rErr) {
            toast.error(rErr.message);
            return;
          }
          toast.success("Purchase restored");
          invalidateAll();
        },
      },
    });
    invalidateAll();
    onOpenChange(false);
  };

  const createdByName = p?.created_by ? displayProfile(profiles[p.created_by]) : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3 text-left">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Truck className="h-4 w-4 text-amber-600" />
            Purchase {p?.invoice_number ? `#${p.invoice_number}` : "…"}
          </DialogTitle>
        </DialogHeader>

        {purchase.isLoading || !p ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* Hero: Total */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Total Purchase
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{SAR(p.total)}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(p.created_at).toLocaleString()}
                </span>
                {p.invoice_number != null && (
                  <span className="inline-flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Invoice #{p.invoice_number}
                  </span>
                )}
              </p>
            </div>

            {/* Meta grid */}
            <dl className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              <MetaRow label="Supplier" value={p.supplier_name || "—"} sub={p.supplier_mobile || undefined} />
              <MetaRow label="Invoice / Memo #" value={p.invoice_number != null ? `#${p.invoice_number}` : "—"} />
              {p.memo_date && (
                <MetaRow label="Memo Date" value={new Date(p.memo_date).toLocaleDateString()} />
              )}
              <MetaRow label="Created By" value={createdByName} icon={<User2 className="h-3.5 w-3.5" />} />
              {p.txn_date && (
                <MetaRow label="Entry Date" value={new Date(p.txn_date).toLocaleDateString()} />
              )}
            </dl>

            {/* Products */}
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Purchased Products
                </span>
                <span className="text-[10px] text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</span>
              </div>

              {items.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">No items</p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {items.map((it, i) => {
                    const q = Number(it.qty) || 0;
                    const price = Number(it.price) || 0;
                    const line = q * price;
                    return (
                      <li key={i} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-3 py-2 text-sm">
                        <span className="min-w-0 truncate font-medium">{it.name}</span>
                        <span className="shrink-0 tabular-nums font-semibold">{SAR(line)}</span>
                        <span className="col-span-2 text-[11px] text-muted-foreground tabular-nums">
                          Qty {q} × {SAR(price)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Totals footer */}
              <div className="divide-y divide-border border-t border-border bg-muted/30">
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Total Quantity</span>
                  <span className="tabular-nums font-medium">{totals.qty}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{SAR(p.subtotal)}</span>
                </div>
                {Number(p.tax ?? 0) > 0 && (
                  <div className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="tabular-nums">{SAR(p.tax)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between bg-amber-500/10 px-3 py-2 text-sm font-semibold">
                  <span>Grand Total</span>
                  <span className="tabular-nums">{SAR(p.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {p.notes && (
              <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3 w-3" /> Notes
                </p>
                <p className="whitespace-pre-wrap text-sm">{p.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t border-border bg-muted/20 px-4 py-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="mr-1.5 h-3.5 w-3.5" /> Close
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setEditOpen(true)}
            disabled={busy || !p}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleDelete}
            disabled={busy || !p}
          >
            {busy ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Delete
          </Button>
        </div>
      </DialogContent>

      <TransactionDialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) {
            invalidateAll();
          }
        }}
        kind="purchase"
        editId={purchaseId}
      />
    </Dialog>
  );
}

function MetaRow({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-2">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">
        <span className="inline-flex items-center gap-1">
          {icon}
          {value}
        </span>
        {sub && <div className="text-[11px] font-normal text-muted-foreground">{sub}</div>}
      </dd>
    </div>
  );
}
