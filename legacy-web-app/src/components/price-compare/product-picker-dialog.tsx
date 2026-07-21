// Full-screen product picker for Price Compare — independent module with Add/Edit/Delete.
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, ScanLine, Star, StarOff, X, Package, Plus, Pencil, Trash2 } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  searchProducts, findProductByBarcode, listCategories, deleteProduct,
  type PCProduct,
} from "@/lib/price-compare/queries";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { ProductFormDialog } from "@/components/price-compare/product-form-dialog";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSelect: (p: PCProduct) => void;
  recent: PCProduct[];
};

const FAV_KEY = "pc:favorites";
const PAGE = 40;

export function ProductPickerDialog({ open, onOpenChange, onSelect, recent }: Props) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 250);
  const [category, setCategory] = useState<string | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [items, setItems] = useState<PCProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scanOpen, setScanOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PCProduct | null>(null);
  const [confirmDel, setConfirmDel] = useState<PCProduct | null>(null);
  const [favIds, setFavIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    void listCategories().then(setCats);
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return;
    setItems([]); setOffset(0); setEnd(false);
    void loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, debouncedQ, category]);

  async function loadPage(off: number, reset = false) {
    setLoading(true);
    try {
      const rows = await searchProducts({ q: debouncedQ, category, limit: PAGE, offset: off });
      setItems((prev) => (reset ? rows : [...prev, ...rows]));
      setOffset(off + rows.length);
      if (rows.length < PAGE) setEnd(true);
    } finally { setLoading(false); }
  }

  const favSet = useMemo(() => new Set(favIds), [favIds]);
  function toggleFav(id: string) {
    const next = favSet.has(id) ? favIds.filter((x) => x !== id) : [id, ...favIds].slice(0, 50);
    setFavIds(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  }

  async function onScanned(code: string) {
    const p = await findProductByBarcode(code);
    if (p) { setScanOpen(false); onSelect(p); return; }
    toast.error("No product matches this barcode");
  }

  async function doDelete(p: PCProduct) {
    try {
      await deleteProduct(p.id);
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Product deleted");
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    } finally { setConfirmDel(null); }
  }

  const showRecent = !debouncedQ && !category && recent.length > 0;
  const favProducts = items.filter((p) => favSet.has(p.id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full sm:max-w-3xl h-[100dvh] sm:h-[90dvh] p-0 flex flex-col gap-0">
          <DialogHeader className="p-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base">Select Product</DialogTitle>
              <Button size="sm" variant="default" className="ml-auto h-8" onClick={() => { setEditing(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, barcode, brand…"
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => setScanOpen(true)} title="Scan barcode">
                <ScanLine className="h-4 w-4" />
              </Button>
            </div>
            {cats.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto mt-2 pb-1 -mx-1 px-1">
                <Chip active={!category} onClick={() => setCategory(null)}>All</Chip>
                {cats.map((c) => (
                  <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            )}
          </DialogHeader>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-4"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (!end && !loading && el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
                void loadPage(offset);
              }
            }}
          >
            {showRecent && (
              <Section title="Recently Compared">
                {recent.map((p) => (
                  <ProductRow key={"r-" + p.id} p={p} onSelect={onSelect}
                    isFav={favSet.has(p.id)} onFav={toggleFav}
                    onEdit={(pp) => { setEditing(pp); setFormOpen(true); }}
                    onDelete={setConfirmDel} />
                ))}
              </Section>
            )}
            {favProducts.length > 0 && (
              <Section title="Favorites">
                {favProducts.map((p) => (
                  <ProductRow key={"f-" + p.id} p={p} onSelect={onSelect}
                    isFav onFav={toggleFav}
                    onEdit={(pp) => { setEditing(pp); setFormOpen(true); }}
                    onDelete={setConfirmDel} />
                ))}
              </Section>
            )}
            <Section title={debouncedQ ? "Results" : "All Products"}>
              {items.map((p) => (
                <ProductRow key={p.id} p={p} onSelect={onSelect}
                  isFav={favSet.has(p.id)} onFav={toggleFav}
                  onEdit={(pp) => { setEditing(pp); setFormOpen(true); }}
                  onDelete={setConfirmDel} />
              ))}
              {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              {!loading && !items.length && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No products yet. Tap <b>Add</b> to create one.
                </div>
              )}
              {end && items.length > 0 && (
                <div className="text-center text-xs text-muted-foreground py-3">End of list</div>
              )}
            </Section>
          </div>
        </DialogContent>
      </Dialog>

      <BarcodeScanner
        open={scanOpen}
        onOpenChange={setScanOpen}
        onDetected={(code) => { void onScanned(code); }}
        mode="single"
        title="Scan product"
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSaved={(p) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.id === p.id);
            if (idx >= 0) { const c = [...prev]; c[idx] = p; return c; }
            return [p, ...prev];
          });
        }}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              "{confirmDel?.name}" and all its price records will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && doDelete(confirmDel)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 text-xs rounded-full px-3 py-1 border transition-colors " +
        (active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent")
      }
    >
      {children}
    </button>
  );
}

function ProductRow({
  p, onSelect, isFav, onFav, onEdit, onDelete,
}: {
  p: PCProduct; onSelect: (p: PCProduct) => void;
  isFav: boolean; onFav: (id: string) => void;
  onEdit: (p: PCProduct) => void; onDelete: (p: PCProduct) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2 hover:bg-accent/40 transition-colors">
      <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => onSelect(p)}>
        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
          {p.image_url ? (
            <img src={p.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <Package className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{p.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">
            {p.barcode ? `Barcode: ${p.barcode}` : "No barcode"}
            {p.brand ? ` · ${p.brand}` : ""}
            {p.unit ? ` · ${p.unit}` : ""}
          </div>
        </div>
        {p.category ? <Badge variant="secondary" className="shrink-0">{p.category}</Badge> : null}
      </button>
      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => onFav(p.id)}>
        {isFav ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => onEdit(p)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive" onClick={() => onDelete(p)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
