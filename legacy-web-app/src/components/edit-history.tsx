import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  entityType: string;
  entityId: string;
  label?: string;
  variant?: "ghost" | "outline" | "secondary";
};

const FIELD_LABEL: Record<string, string> = {
  amount: "Amount",
  type: "Type",
  category: "Category",
  subcategory: "Sub-category",
  notes: "Notes",
  txn_date: "Date",
  payment_method: "Payment method",
  shop_id: "Shop",
  cashier_id: "Cashier",
  cashier: "Cashier",
  attachment_url: "Attachment",
  name: "Name",
  phone: "Phone",
  address: "Address",
  party_type: "Party type",
  party_name: "Party",
  party_id: "Party",
  entry_type: "Entry type",
  cash_sale: "Cash sale",
  pos_sale: "POS sale",
  bank_sale: "Bank sale",
  credit_sale: "Credit sale",
  difference: "Difference",
  purchase_amount: "Purchase amount",
  withdraw_amount: "Withdraw amount",
  expense_amount: "Expense amount",
  payment_status: "Payment status",
  paid_amount: "Paid amount",
  remaining_due: "Remaining due",
  product_name: "Product",
  quantity: "Quantity",
  purchase_price: "Purchase price",
  status: "Status",
  is_deleted: "Deleted",
};

function fmt(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export function EditHistoryButton({ entityType, entityId, label = "View Edit History", variant = "ghost" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" type="button">
          <History className="h-3.5 w-3.5" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit history</DialogTitle>
        </DialogHeader>
        {open && <HistoryTimeline entityType={entityType} entityId={entityId} />}
      </DialogContent>
    </Dialog>
  );
}

function HistoryTimeline({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data: rows = [], isLoading } = useQuery<any[]>({
    queryKey: ["entity_history", entityType, entityId],
    queryFn: async () => {
      const { data } = await supabase
        .from("entity_history" as any)
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("changed_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });

  const { data: profiles = [] } = useQuery<any[]>({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? [],
  });
  const profMap = useMemo(
    () => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])),
    [profiles],
  );

  if (isLoading) return <p className="py-4 text-center text-sm text-muted-foreground">Loading…</p>;
  if (rows.length === 0)
    return <p className="py-4 text-center text-sm text-muted-foreground">No edits recorded yet.</p>;

  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-4">
      {rows.map((r) => {
        const changes = (r.changes ?? {}) as Record<string, { from: any; to: any }>;
        const fields = Object.keys(changes);
        const tag =
          r.action === "soft_delete" ? "Moved to Recycle Bin"
          : r.action === "restore" ? "Restored"
          : "Edited";
        return (
          <li key={r.id} className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            <div className="flex items-center justify-between gap-2 text-[11.5px] text-muted-foreground">
              <span>{new Date(r.changed_at).toLocaleString()}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                {tag}
              </span>
            </div>
            <p className="text-[11.5px] text-muted-foreground">
              By {r.changed_by ? (profMap.get(r.changed_by) ?? "—") : "system"}
            </p>
            {fields.length > 0 && (
              <ul className="mt-2 space-y-1.5 rounded-lg border border-border/40 bg-muted/30 p-2.5">
                {fields.map((f) => (
                  <li key={f} className="text-xs">
                    <span className="font-medium">{FIELD_LABEL[f] ?? f}: </span>
                    <span className="rounded bg-destructive/10 px-1 text-destructive line-through">
                      {fmt(changes[f].from)}
                    </span>
                    <span className="mx-1 text-muted-foreground">→</span>
                    <span className="rounded bg-emerald-500/10 px-1 text-emerald-700 dark:text-emerald-400">
                      {fmt(changes[f].to)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
