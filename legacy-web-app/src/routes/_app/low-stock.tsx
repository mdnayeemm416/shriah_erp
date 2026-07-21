import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Pencil, Plus, RefreshCw, Package } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SAR } from "@/lib/format";

export const Route = createFileRoute("/_app/low-stock")({
  component: LowStockPage,
});

type LowProduct = {
  id: string;
  name: string;
  image_url: string | null;
  stock: number;
  min_stock: number;
  price: number;
  purchase_price: number;
};

type Bucket = "all" | "negative" | "zero" | "low";

function LowStockPage() {
  const qc = useQueryClient();
  const [bucket, setBucket] = useState<Bucket>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<LowProduct | null>(null);
  const [editStock, setEditStock] = useState<string>("");

  const list = useQuery({
    queryKey: ["low-stock-products"],
    staleTime: 30_000,
    queryFn: async (): Promise<LowProduct[]> => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name,image_url,stock,min_stock,price,purchase_price")
        .eq("is_deleted", false)
        .order("stock", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as LowProduct[]).filter((p) => {
        const st = Number(p.stock ?? 0);
        const min = Number(p.min_stock ?? 0);
        return st <= 0 || (min > 0 && st <= min);
      });
    },
  });

  const counts = useMemo(() => {
    const items = list.data ?? [];
    let neg = 0, zero = 0, low = 0;
    for (const p of items) {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (st < 0) neg++;
      else if (st === 0) zero++;
      else if (min > 0 && st <= min) low++;
    }
    return { all: items.length, negative: neg, zero, low };
  }, [list.data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (list.data ?? []).filter((p) => {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (bucket === "negative" && !(st < 0)) return false;
      if (bucket === "zero" && st !== 0) return false;
      if (bucket === "low" && !(st > 0 && min > 0 && st <= min)) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list.data, bucket, search]);

  const save = useMutation({
    mutationFn: async ({ id, stock }: { id: string; stock: number }) => {
      const { error } = await supabase.from("shop_products").update({ stock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["low-stock-products"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-admin-overview"] });
      qc.invalidateQueries({ queryKey: ["warehouse-value-snapshot"] });
      setEditing(null);
      toast.success("Stock updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const tone = (p: LowProduct) => {
    const st = Number(p.stock ?? 0);
    if (st < 0) return { ring: "ring-rose-500/40 bg-rose-500/[0.04]", badge: "bg-rose-500", label: "Negative stock" };
    if (st === 0) return { ring: "ring-orange-500/40 bg-orange-500/[0.04]", badge: "bg-orange-500", label: "Out of stock" };
    return { ring: "ring-amber-500/40 bg-amber-500/[0.04]", badge: "bg-amber-500", label: "Low stock" };
  };

  const chips: { key: Bucket; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "negative", label: "Negative", count: counts.negative },
    { key: "zero", label: "Zero", count: counts.zero },
    { key: "low", label: "Low", count: counts.low },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Link to="/store-admin" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Warehouse Admin
            </Link>
          </div>
          <h1 className="mt-1 flex items-center gap-2 text-[22px] font-bold tracking-tight">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Low Stock
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Products that are zero, negative, or at/below their minimum stock threshold.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => list.refetch()} className="gap-1.5">
          <RefreshCw className={`h-4 w-4 ${list.isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </header>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name…"
              className="h-9 pr-9"
            />
            {search.trim() && filtered.length === 0 && !list.isLoading && (
              <Link
                to="/store-admin"
                search={{ tab: "products", newName: search.trim() } as any}
                className="absolute right-1 top-1/2 -translate-y-1/2"
                aria-label="Add new product"
                title={`Add "${search.trim()}" as new product`}
              >
                <Button
                  type="button"
                  size="icon"
                  className="h-7 w-7 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
          <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1">
            {chips.map((c) => (
              <button
                key={c.key}
                onClick={() => setBucket(c.key)}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${
                  bucket === c.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {c.label} <span className="opacity-70">({c.count})</span>
              </button>
            ))}
          </div>
        </div>
        {search.trim() && filtered.length === 0 && !list.isLoading && (
          <p className="mt-1.5 text-[12px] text-muted-foreground">
            No Match Found —{" "}
            <Link
              to="/store-admin"
              search={{ tab: "products", newName: search.trim() } as any}
              className="font-medium text-emerald-600 hover:underline"
            >
              Add "{search.trim()}" as new product
            </Link>
          </p>
        )}
      </Card>

      {list.isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        !search.trim() && (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <Package className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">All clear</p>
            <p className="text-[12px] text-muted-foreground">No products match this filter.</p>
          </Card>
        )


      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((p) => {
            const t = tone(p);
            const cost = Number(p.purchase_price ?? 0) || Number(p.price ?? 0);
            const impact = Math.max(0, Number(p.stock ?? 0)) * cost;
            return (
              <Card key={p.id} className={`p-3 ring-1 ${t.ring}`}>
                <div className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium leading-tight">{p.name}</p>
                      <Badge className={`${t.badge} text-white text-[10px] shrink-0`}>{t.label}</Badge>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11.5px] text-muted-foreground">
                      <span>Stock: <b className={Number(p.stock) < 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"}>{p.stock}</b>{p.min_stock > 0 && <> / min {p.min_stock}</>}</span>
                      <span>Sale: <b className="text-foreground">{SAR(p.price)}</b></span>
                      <span>Cost: <b className="text-foreground">{SAR(p.purchase_price)}</b></span>
                      <span>Value: <b className="text-foreground">{SAR(impact)}</b></span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => { setEditing(p); setEditStock(String(p.stock ?? 0)); }}>
                    <Pencil className="h-3.5 w-3.5" /> Edit stock
                  </Button>
                  <Link to="/store-admin" search={{ tab: "products" } as any}>
                    <Button size="sm" variant="ghost" className="h-8 gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Open product
                    </Button>
                  </Link>
                  <Link to="/store-admin" search={{ tab: "purchases" } as any}>
                    <Button size="sm" variant="ghost" className="h-8 gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Create purchase
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Adjust stock</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{editing.name}</p>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">New stock</label>
                <Input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  autoFocus
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Current: {editing.stock} · Min: {editing.min_stock || "—"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              disabled={save.isPending}
              onClick={() => editing && save.mutate({ id: editing.id, stock: Number(editStock || 0) })}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
