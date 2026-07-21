import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

export function ShopsManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [name, setName] = useState("");
  const [opening, setOpening] = useState("0");
  const [shopType, setShopType] = useState<"full_erp" | "simple_cash">("full_erp");
  const [busy, setBusy] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      const { sortShops } = await import("@/lib/shop-order");
      return sortShops((data ?? []) as any[]);
    },
  });

  const addShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await (supabase as any).from("shops").insert({
      name, opening_cash: Number(opening), shop_type: shopType, created_by: user.id,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Shop added");
      setName(""); setOpening("0"); setShopType("full_erp");
      qc.invalidateQueries({ queryKey: ["shops"] });
    }
  };

  const setType = async (id: string, t: "full_erp" | "simple_cash") => {
    const { error } = await (supabase as any).from("shops").update({ shop_type: t }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Type updated"); qc.invalidateQueries({ queryKey: ["shops"] }); }
  };

  const deleteShop = async (id: string) => {
    if (!(await confirm({ title: "Move shop to Recycle Bin?", description: "All entries linked to this shop stay archived. You can restore the shop anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("shops", id);
    if (error) toast.error(error.message);
    else { toast.success("Moved to Recycle Bin"); qc.invalidateQueries({ queryKey: ["shops"] }); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addShop} className="grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]">
        <div><Label className="text-xs">Shop name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main branch" className="mt-1.5" /></div>
        <div><Label className="text-xs">Opening cash</Label><Input type="number" step="0.01" value={opening} onChange={(e) => setOpening(e.target.value)} className="mt-1.5" /></div>
        <div>
          <Label className="text-xs">Type</Label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value as any)}
            className="mt-1.5 block h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            <option value="full_erp">Full ERP</option>
            <option value="simple_cash">Simple Cash</option>
          </select>
        </div>
        <Button type="submit" disabled={busy} className="sm:self-end"><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </form>

      <ul className="divide-y divide-border/50 rounded-xl border border-border/40">
        {shops.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No shops yet.</li>}
        {shops.map((s: any) => {
          const simple = s.shop_type === "simple_cash";
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <span className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                    simple
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                      : "bg-primary/15 text-primary",
                  )}>
                    {simple ? "Simple" : "ERP"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Opening · <SARAmount value={s.opening_cash} size="sm" bold={false} /></p>
              </div>
              <select
                value={s.shop_type ?? "full_erp"}
                onChange={(e) => setType(s.id, e.target.value as any)}
                className="h-8 rounded-md border border-input bg-transparent px-1.5 text-xs"
                aria-label="Shop type"
              >
                <option value="full_erp">Full ERP</option>
                <option value="simple_cash">Simple Cash</option>
              </select>
              <button onClick={() => deleteShop(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
