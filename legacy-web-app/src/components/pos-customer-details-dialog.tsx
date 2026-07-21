import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet, FileText, ShoppingCart, MessageCircle, Pencil, Trash2,
  X, Save, Phone, MapPin, Hash, Loader2, User2, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { shareStatement, type StatementRow } from "@/lib/invoice-image";
import { softDelete } from "@/lib/soft-delete";
import { useConfirm } from "@/hooks/use-confirm";
import { useUserAccess } from "@/hooks/use-user-access";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customerId: string | null;
  onPaymentIn?: (c: PosCustomer) => void;
  onViewStatement?: (c: PosCustomer) => void;
  onNewSale?: (c: PosCustomer) => void;
};

const TAG_OPTIONS: { key: string; label: string; cls: string }[] = [
  { key: "vip",      label: "VIP",             cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  { key: "cash",     label: "Cash Customer",   cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  { key: "credit",   label: "Credit Customer", cls: "bg-sky-500/15 text-sky-700 border-sky-500/30" },
  { key: "blocked",  label: "Blocked",         cls: "bg-rose-500/15 text-rose-700 border-rose-500/30" },
];

type Draft = {
  name: string;
  phone: string;
  vat_number: string;
  address: string;
  notes: string;
  opening_due: string;
  credit_limit: string;
  tags: string[];
};

export function PosCustomerDetailsDialog({
  open, onOpenChange, customerId, onPaymentIn, onViewStatement, onNewSale,
}: Props) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const { isAdmin, isManager } = useUserAccess();
  const canEditOpening = isAdmin || isManager;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const customer = useQuery({
    queryKey: ["pos-customer-detail", customerId],
    enabled: open && !!customerId,
    queryFn: async (): Promise<PosCustomer | null> => {
      const { data, error } = await supabase
        .from("pos_customers")
        .select("*")
        .eq("id", customerId!)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const balance = useQuery({
    queryKey: ["pos-customer-balance", customerId],
    enabled: open && !!customerId,
    queryFn: () => fetchCustomerBalance(customerId!),
  });

  const lastPayment = useQuery({
    queryKey: ["pos-customer-last-payment", customerId],
    enabled: open && !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pos_payments")
        .select("txn_date,created_at")
        .eq("customer_id", customerId!)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const historyCounts = useQuery({
    queryKey: ["pos-customer-history-counts", customerId],
    enabled: open && !!customerId,
    queryFn: async () => {
      const [sales, payments, returns] = await Promise.all([
        supabase.from("shop_sales").select("id", { count: "exact", head: true }).eq("customer_id", customerId!),
        supabase.from("pos_payments").select("id", { count: "exact", head: true }).eq("customer_id", customerId!),
        supabase.from("sales_returns").select("id", { count: "exact", head: true }).eq("customer_id", customerId!),
      ]);
      if (sales.error) throw sales.error;
      if (payments.error) throw payments.error;
      if (returns.error) throw returns.error;
      return {
        sales: sales.count ?? 0,
        payments: payments.count ?? 0,
        returns: returns.count ?? 0,
      };
    },
  });

  useEffect(() => {
    if (!open) { setEditing(false); setDraft(null); }
  }, [open]);

  useEffect(() => {
    if (editing && customer.data) {
      const c: any = customer.data;
      setDraft({
        name: c.name ?? "",
        phone: c.phone ?? "",
        vat_number: c.vat_number ?? "",
        address: c.address ?? "",
        notes: c.notes ?? "",
        opening_due: String(c.opening_due ?? 0),
        credit_limit: String(c.credit_limit ?? 0),
        tags: Array.isArray(c.tags) ? [...c.tags] : [],
      });
    }
  }, [editing, customer.data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!draft || !customer.data) return;
      const orig: any = customer.data;
      const name = draft.name.trim();
      if (!name) throw new Error("Customer name required");
      const nextOpening = Number(draft.opening_due) || 0;
      const oldOpening = Number(orig.opening_due ?? 0);
      const openingChanged = nextOpening !== oldOpening;

      if (openingChanged && !canEditOpening) {
        throw new Error("Only admin or manager can change opening balance");
      }

      const payload: any = {
        name,
        phone: draft.phone.trim() || null,
        vat_number: draft.vat_number.trim() || null,
        address: draft.address.trim() || null,
        notes: draft.notes.trim() || null,
        opening_due: nextOpening,
        credit_limit: Number(draft.credit_limit) || 0,
        tags: draft.tags,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("pos_customers").update(payload).eq("id", orig.id);
      if (error) throw error;

      if (openingChanged) {
        await supabase.from("pos_customer_opening_edits").insert({
          customer_id: orig.id,
          old_value: oldOpening,
          new_value: nextOpening,
          note: "Updated from customer details",
        } as any);
      }
    },
    onSuccess: () => {
      toast.success("Customer updated");
      qc.invalidateQueries({ queryKey: ["pos-customer-detail", customerId] });
      qc.invalidateQueries({ queryKey: ["pos-customer-balance", customerId] });
      qc.invalidateQueries({ queryKey: ["pos-customers"] });
      qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
      qc.invalidateQueries({ queryKey: ["pos-due-map"] });
      setEditing(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  async function handleDelete() {
    if (!customer.data) return;
    const counts = historyCounts.data;
    const hasHistory = !!counts && (counts.sales > 0 || counts.payments > 0 || counts.returns > 0);
    if (hasHistory) {
      toast.error("Customer has ledger history and cannot be deleted");
      return;
    }
    const ok = await confirm({
      title: "Delete this customer?",
      description: "The customer will be moved to the recycle bin. Existing sales and payments remain unchanged.",
      tone: "warning",
      confirmText: "Delete",
    });
    if (!ok) return;
    const { error } = await softDelete("pos_customers", customer.data.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Moved to recycle bin");
    qc.invalidateQueries({ queryKey: ["pos-customers"] });
    qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
    qc.invalidateQueries({ queryKey: ["pos-due-map"] });
    onOpenChange(false);
  }

  async function handleShareStatement() {
    if (!customer.data || !balance.data) return;
    const rows: StatementRow[] = [];
    await shareStatement({
      customerName: customer.data.name,
      customerMobile: customer.data.phone ?? undefined,
      opening: Number(customer.data.opening_due ?? 0),
      rows,
      currentDue: balance.data.current_due,
      totalPaid: balance.data.total_paid,
      totalSales: balance.data.total_sales,
    });
  }

  const c = customer.data;
  const lastPaymentDate = useMemo(() => {
    const lp: any = lastPayment.data;
    if (!lp) return null;
    return new Date(lp.created_at ?? lp.txn_date).toLocaleDateString();
  }, [lastPayment.data]);

  function toggleTag(key: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      tags: draft.tags.includes(key)
        ? draft.tags.filter(t => t !== key)
        : [...draft.tags, key],
    });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader className="border-b border-border px-4 py-3">
          <DrawerTitle className="flex items-center justify-between gap-2 text-base">
            <span className="flex items-center gap-2 truncate">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User2 className="h-4 w-4" />
              </span>
              <span className="truncate">{c?.name ?? "Customer"}</span>
            </span>
            {(c as any)?.tags?.length > 0 && !editing && (
              <div className="hidden gap-1 sm:flex">
                {((c as any).tags as string[]).slice(0, 3).map(tag => {
                  const opt = TAG_OPTIONS.find(t => t.key === tag);
                  if (!opt) return null;
                  return <Badge key={tag} variant="outline" className={cn("text-[10px]", opt.cls)}>{opt.label}</Badge>;
                })}
              </div>
            )}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {customer.isLoading || !c ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Current due</p>
                {balance.isLoading ? (
                  <Skeleton className="mt-1 h-8 w-32" />
                ) : (
                  <p className={cn(
                    "text-3xl font-bold tabular-nums",
                    (balance.data?.current_due ?? 0) > 0 ? "text-rose-600" : "text-emerald-700",
                  )}>
                    SAR {(balance.data?.current_due ?? 0).toFixed(2)}
                  </p>
                )}
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <Mini label="Opening" value={Number(c.opening_due ?? 0)} />
                  <Mini label="Total sales" value={balance.data?.total_sales ?? 0} loading={balance.isLoading} />
                  <Mini label="Total paid" value={balance.data?.total_paid ?? 0} loading={balance.isLoading} tone="success" />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Last payment: {lastPayment.isLoading ? "…" : lastPaymentDate ?? "—"}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <ActionTile icon={Wallet} label="Payment In" onClick={() => onPaymentIn?.(c)} />
                <ActionTile icon={FileText} label="Statement" onClick={() => onViewStatement?.(c)} />
                <ActionTile icon={ShoppingCart} label="New Sale" onClick={() => onNewSale?.(c)} />
                <ActionTile icon={MessageCircle} label="Share" onClick={handleShareStatement} />
                <ActionTile icon={Pencil} label={editing ? "Editing…" : "Edit"} onClick={() => setEditing(true)} active={editing} />
                <ActionTile
                  icon={Trash2}
                  label={historyCounts.isLoading ? "Checking…" : "Delete"}
                  onClick={handleDelete}
                  tone="danger"
                  disabled={historyCounts.isLoading}
                />
              </div>

              <div className="mt-3 rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Basic info</p>
                {editing && draft ? (
                  <div className="space-y-2">
                    <Field label="Customer name *">
                      <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Mobile">
                        <Input value={draft.phone} inputMode="tel" onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                      </Field>
                      <Field label="Tax/VAT number">
                        <Input value={draft.vat_number} onChange={(e) => setDraft({ ...draft, vat_number: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Address">
                      <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                    </Field>
                    <Field label="Notes">
                      <Textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                    </Field>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-sm">
                    <InfoRow icon={Phone} value={c.phone ?? "—"} />
                    <InfoRow icon={Hash} value={(c as any).vat_number ?? "No VAT number"} />
                    <InfoRow icon={MapPin} value={(c as any).address ?? "—"} />
                    {c.notes && <p className="rounded-lg bg-muted/40 px-2 py-1.5 text-xs">{c.notes}</p>}
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Financial</p>
                {editing && draft ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Opening balance" hint={canEditOpening ? "Receivable auto-recalculates" : "Admin/manager only"}>
                      <Input
                        type="number" inputMode="decimal" step="0.01"
                        value={draft.opening_due}
                        disabled={!canEditOpening}
                        onChange={(e) => setDraft({ ...draft, opening_due: e.target.value })}
                      />
                    </Field>
                    <Field label="Credit limit">
                      <Input
                        type="number" inputMode="decimal" step="0.01"
                        value={draft.credit_limit}
                        onChange={(e) => setDraft({ ...draft, credit_limit: e.target.value })}
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <KV label="Opening balance" value={`SAR ${Number(c.opening_due ?? 0).toFixed(2)}`} />
                    <KV label="Credit limit" value={`SAR ${Number((c as any).credit_limit ?? 0).toFixed(2)}`} />
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-border bg-card p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map(opt => {
                    const tags = editing && draft ? draft.tags : ((c as any).tags ?? []);
                    const active = tags.includes(opt.key);
                    if (!editing && !active) return null;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={!editing}
                        onClick={() => toggleTag(opt.key)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                          active ? opt.cls : "border-border text-muted-foreground hover:border-primary/40",
                          !editing && "cursor-default",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                  {!editing && (!((c as any).tags) || (c as any).tags.length === 0) && (
                    <p className="text-xs text-muted-foreground">No tags. Tap Edit to add.</p>
                  )}
                </div>
              </div>

              {((c as any).tags ?? []).includes("blocked") && !editing && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  <ShieldAlert className="h-3.5 w-3.5" /> This customer is marked as blocked.
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-border bg-muted/20 px-4 py-3">
          {editing ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button className="flex-1" disabled={save.isPending} onClick={() => save.mutate()}>
                {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                Save changes
              </Button>
            </>
          ) : (
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Mini({ label, value, loading, tone }: { label: string; value: number; loading?: boolean; tone?: "success" }) {
  return (
    <div className="rounded-lg bg-background/60 px-2 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {loading ? <Skeleton className="mt-0.5 h-3.5 w-14" /> : (
        <p className={cn("text-xs font-bold tabular-nums", tone === "success" ? "text-emerald-700" : "text-foreground")}>
          {value.toFixed(2)}
        </p>
      )}
    </div>
  );
}

function ActionTile({
  icon: Icon, label, onClick, tone, active, disabled,
}: { icon: any; label: string; onClick?: () => void; tone?: "danger"; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[11px] font-medium transition active:scale-[0.97]",
        tone === "danger" && "border-rose-300/60 text-rose-600 hover:bg-rose-50",
        active && "border-primary/50 bg-primary/5 text-primary",
        !tone && !active && "hover:border-primary/40 hover:bg-muted/40",
        disabled && "cursor-not-allowed opacity-60 active:scale-100",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-foreground/80">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 px-2 py-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
