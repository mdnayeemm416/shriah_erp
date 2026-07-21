import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Plus, Pencil, Trash2, Search, Store } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sortShops } from "@/lib/shop-order";
import { useConfirm } from "@/hooks/use-confirm";

type Cashier = { id: string; name: string; shop_id: string };
type Shop = { id: string; name: string };

export function CashierManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [activeShopId, setActiveShopId] = useState<string | null>(null);

  const { data: shops = [] } = useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: async () => sortShops(((await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? []) as Shop[]),
  });
  const { data: cashiers = [] } = useQuery<Cashier[]>({
    queryKey: ["cashiers", "all"],
    queryFn: async () => ((await (supabase as any).from("cashiers").select("*").eq("is_deleted", false).order("name")).data ?? []) as Cashier[],
  });

  const filteredShops = shops.filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()));
  const activeShop = shops.find((s) => s.id === activeShopId);
  const activeCashiers = cashiers.filter((c) => c.shop_id === activeShopId);

  const deleteCashier = async (id: string) => {
    if (!(await confirm({ title: "Move cashier to Recycle Bin?", description: "Their past entries stay intact and you can restore the cashier from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("cashiers", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["cashiers"] });
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          <Users className="h-4 w-4 text-primary" /> Cashiers
        </h2>
        {activeShop && <CashierFormDialog userId={user?.id} shopId={activeShop.id} />}
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search shops…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Shops list */}
        <div className="rounded-lg border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Shops
          </div>
          {filteredShops.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No shops — add above.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {filteredShops.map((s) => {
                const isActive = s.id === activeShopId;
                const count = cashiers.filter((c) => c.shop_id === s.id).length;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors",
                      isActive ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                    onClick={() => setActiveShopId(s.id)}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Store className="h-3.5 w-3.5" />
                    </div>
                    <span className="flex-1 truncate text-sm font-medium">{s.name}</span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Cashiers */}
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {activeShop ? `Cashiers of ${activeShop.name}` : "Cashiers"}
            </span>
          </div>
          {!activeShop ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Select a shop to view its cashiers.</p>
          ) : activeCashiers.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No cashiers yet.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {activeCashiers.map((c) => (
                <li key={c.id} className="flex items-center gap-2 px-3 py-2.5">
                  <span className="flex-1 truncate text-sm">{c.name}</span>
                  <CashierFormDialog userId={user?.id} shopId={c.shop_id} editing={c} trigger={
                    <button className="text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  } />
                  <button onClick={() => deleteCashier(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

function CashierFormDialog({
  userId, shopId, editing, trigger,
}: { userId?: string; shopId: string; editing?: Cashier; trigger?: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(editing?.name ?? "");
  const [targetShopId, setTargetShopId] = useState(editing?.shop_id ?? shopId);
  const [busy, setBusy] = useState(false);

  const { data: shops = [] } = useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: async () => sortShops(((await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? []) as Shop[]),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const payload = { name: name.trim(), shop_id: targetShopId };
    const { error } = editing
      ? await (supabase as any).from("cashiers").update(payload).eq("id", editing.id)
      : await (supabase as any).from("cashiers").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["cashiers"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add cashier</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} cashier</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="e.g. Anwer" />
          </div>
          <div>
            <Label>Shop</Label>
            <Select value={targetShopId} onValueChange={setTargetShopId}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy} className="w-full">{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
