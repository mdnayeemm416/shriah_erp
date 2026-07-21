import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Pencil, Trash2, Search, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

export type Party = {
  id: string;
  name: string;
  party_type: "customer" | "supplier" | "mixed";
  phone: string | null;
  address: string | null;
  opening_due: number;
  opening_advance: number;
  opening_payable: number;
  opening_notes: string | null;
};

const TYPE_LABEL: Record<Party["party_type"], string> = {
  customer: "Customer",
  supplier: "Supplier",
  mixed: "Mixed",
};

const TYPE_TONE: Record<Party["party_type"], string> = {
  customer: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  supplier: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  mixed: "bg-primary/15 text-primary",
};

export function PartyManager({ defaultType = "all" }: { defaultType?: "all" | Party["party_type"] } = {}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Party["party_type"]>(defaultType);
  const [editing, setEditing] = useState<Party | null>(null);
  const [open, setOpen] = useState(false);

  const { data: parties = [] } = useQuery<Party[]>({
    queryKey: ["parties"],
    queryFn: async () =>
      (((await (supabase as any).from("parties").select("*").eq("is_deleted", false).order("name")).data) ?? []) as Party[],
  });

  const filtered = useMemo(() => {
    return parties.filter((p) => {
      if (typeFilter !== "all" && p.party_type !== typeFilter) return false;
      if (q && !`${p.name} ${p.phone ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [parties, q, typeFilter]);

  const remove = async (id: string) => {
    if (!(await confirm({ title: "Move party to Recycle Bin?", description: "Linked ledger history is preserved. You can restore this party anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("parties", id);
    if (error) toast.error(error.message);
    else { toast.success("Moved to Recycle Bin"); qc.invalidateQueries({ queryKey: ["parties"] }); }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <Users className="h-4 w-4 text-primary" /> Parties
        </h2>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Add party
        </Button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="supplier">Supplier</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No parties yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {filtered.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{p.name}</p>
                  <Badge className={cn("border-0", TYPE_TONE[p.party_type])} variant="outline">
                    {TYPE_LABEL[p.party_type]}
                  </Badge>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {p.phone}</span>}
                  {p.address && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.address}</span>}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-[11px]">
                  {Number(p.opening_due) > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      Opening Due&nbsp;<SARAmount value={p.opening_due} size="sm" bold={false} />
                    </span>
                  )}
                  {Number(p.opening_advance) > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Advance&nbsp;<SARAmount value={p.opening_advance} size="sm" bold={false} />
                    </span>
                  )}
                  {Number(p.opening_payable) > 0 && (
                    <span className="text-rose-600 dark:text-rose-400">
                      Payable&nbsp;<SARAmount value={p.opening_payable} size="sm" bold={false} />
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => { setEditing(p); setOpen(true); }} className="text-muted-foreground hover:text-foreground">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <PartyFormDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        userId={user?.id}
        onSaved={() => qc.invalidateQueries({ queryKey: ["parties"] })}
      />
    </Card>
  );
}

function PartyFormDialog({
  open, onOpenChange, editing, userId, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Party | null;
  userId?: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [partyType, setPartyType] = useState<Party["party_type"]>("customer");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openingDue, setOpeningDue] = useState("0");
  const [openingAdvance, setOpeningAdvance] = useState("0");
  const [openingPayable, setOpeningPayable] = useState("0");
  const [openingNotes, setOpeningNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useMemo(() => {
    if (open) {
      setName(editing?.name ?? "");
      setPartyType(editing?.party_type ?? "customer");
      setPhone(editing?.phone ?? "");
      setAddress(editing?.address ?? "");
      setOpeningDue(String(editing?.opening_due ?? 0));
      setOpeningAdvance(String(editing?.opening_advance ?? 0));
      setOpeningPayable(String(editing?.opening_payable ?? 0));
      setOpeningNotes(editing?.opening_notes ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error("Not signed in");
    if (!name.trim()) return toast.error("Name required");
    setBusy(true);
    const payload = {
      name: name.trim(),
      party_type: partyType,
      phone: phone.trim() || null,
      address: address.trim() || null,
      opening_due: Number(openingDue) || 0,
      opening_advance: Number(openingAdvance) || 0,
      opening_payable: Number(openingPayable) || 0,
      opening_notes: openingNotes.trim() || null,
    };
    const res = editing
      ? await (supabase as any).from("parties").update(payload).eq("id", editing.id)
      : await (supabase as any).from("parties").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Added");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit party" : "New party"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
            <div>
              <Label>Name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bata Quraish" className="mt-1" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={partyType} onValueChange={(v: any) => setPartyType(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966…" className="mt-1" />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Opening balance</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Opening Due</Label>
                <Input type="number" step="0.01" value={openingDue} onChange={(e) => setOpeningDue(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Opening Advance</Label>
                <Input type="number" step="0.01" value={openingAdvance} onChange={(e) => setOpeningAdvance(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Opening Payable</Label>
                <Input type="number" step="0.01" value={openingPayable} onChange={(e) => setOpeningPayable(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-xs">Opening Notes</Label>
              <Textarea rows={2} value={openingNotes} onChange={(e) => setOpeningNotes(e.target.value)} className="mt-1" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
