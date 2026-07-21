// Price Compare — standalone independent module.
// No dependency on shop/wholesale/warehouse/purchase-history.
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MoreVertical, Package, RefreshCcw, FileText, FileSpreadsheet, Printer, Share2,
  ScanLine, Search, Plus, Pencil, Trash2,
  Tag, Wallet, ArrowDown, ArrowUp, Building2,
  SlidersHorizontal, Calendar, Image as ImageIcon, FileIcon, X, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { ProductPickerDialog } from "@/components/price-compare/product-picker-dialog";
import { ProductFormDialog } from "@/components/price-compare/product-form-dialog";
import { RecordFormDialog } from "@/components/price-compare/record-form-dialog";
import { BarcodeScanner } from "@/components/barcode-scanner";
import {
  loadRecords, computeSummary, bySupplier, withDeltas,
  listSuppliers, findProductByBarcode, deleteRecord, deleteProduct,
  searchProducts, listCategories, loadProductSummaries,
  type PCFilters, type PCProduct, type PCRecord,
} from "@/lib/price-compare/queries";
import { exportPriceCompareExcel, exportPriceComparePDF, sharePriceCompareWhatsApp } from "@/lib/price-compare/export";
import { SAR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useProfileMap, displayProfile } from "@/hooks/use-profile-map";

import { toast } from "sonner";

export const Route = createFileRoute("/_app/price-compare")({
  head: () => ({
    meta: [
      { title: "Price Compare — Independent Product Price Tracker" },
      { name: "description", content: "Track and compare purchase, selling and offer prices of your products across markets and suppliers." },
    ],
  }),
  component: PriceComparePage,
});

type DatePreset = "today" | "week" | "month" | "all" | "custom";

function presetBounds(p: DatePreset): { from: string | null; to: string | null } {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  if (p === "today") return { from: iso(today), to: iso(today) };
  if (p === "week") { const s = new Date(today); s.setDate(s.getDate() - 6); return { from: iso(s), to: iso(today) }; }
  if (p === "month") { const s = new Date(today.getFullYear(), today.getMonth(), 1); return { from: iso(s), to: iso(today) }; }
  return { from: null, to: null };
}



function PriceComparePage() {
  const qc = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [product, setProduct] = useState<PCProduct | null>(null);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PCRecord | null>(null);
  const [confirmDelRecord, setConfirmDelRecord] = useState<PCRecord | null>(null);
  const [confirmDelProduct, setConfirmDelProduct] = useState(false);
  const [preset, setPreset] = useState<DatePreset>("all");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  const [scanOpen, setScanOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Landing (list) state
  const [listQuery, setListQuery] = useState("");
  const [listCategory, setListCategory] = useState<string | null>(null);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const debouncedListQuery = useDebouncedValue(listQuery, 150);

  const filters: PCFilters = useMemo(() => {
    const b = preset === "custom"
      ? { from: customFrom || null, to: customTo || null }
      : presetBounds(preset);
    return { from: b.from, to: b.to, supplier: supplier || null };
  }, [preset, customFrom, customTo, supplier]);

  const historyQuery = useQuery({
    queryKey: ["price-compare", product?.id, filters],
    queryFn: () => loadRecords(product!.id, filters),
    enabled: !!product,
    staleTime: 60_000,
  });

  const supplierListQuery = useQuery({
    queryKey: ["price-compare-suppliers"],
    queryFn: listSuppliers,
    staleTime: 5 * 60_000,
  });

  const rows = historyQuery.data ?? [];
  const summary = useMemo(() => computeSummary(rows), [rows]);
  const history = useMemo(() => withDeltas(rows), [rows]);
  const suppliers = useMemo(() => bySupplier(rows), [rows]);

  // Helpers for the summary cards (company + date of latest/lowest/highest records).
  const { latestRow, lowestRow, highestRow } = useMemo(() => {
    if (!rows.length) return { latestRow: null, lowestRow: null, highestRow: null };
    const byDate = [...rows].sort((a, b) => b.record_date.localeCompare(a.record_date));
    const byPriceAsc = [...rows].sort((a, b) => a.purchase_price - b.purchase_price);
    return {
      latestRow: byDate[0],
      lowestRow: byPriceAsc[0],
      highestRow: byPriceAsc[byPriceAsc.length - 1],
    };
  }, [rows]);

  const lastUpdated = useMemo(() => {
    return rows.reduce<string>((acc, r) => (r.record_date > acc ? r.record_date : acc), "");
  }, [rows]);

  const activeFilterCount =
    (preset !== "all" ? 1 : 0) + (supplier ? 1 : 0);

  const handleSelect = useCallback((p: PCProduct) => {
    setProduct(p);
    setPickerOpen(false);
  }, []);

  async function onScanned(code: string) {
    const p = await findProductByBarcode(code);
    if (p) { setScanOpen(false); handleSelect(p); return; }
    toast.error("No product matches this barcode");
  }

  async function doDeleteRecord(r: PCRecord) {
    try {
      await deleteRecord(r.id);
      toast.success("Record deleted");
      qc.invalidateQueries({ queryKey: ["price-compare", product?.id] });
      qc.invalidateQueries({ queryKey: ["price-compare-suppliers"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    } finally { setConfirmDelRecord(null); }
  }

  async function doDeleteProduct() {
    if (!product) return;
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      setProduct(null);
      setConfirmDelProduct(false);
      qc.invalidateQueries({ queryKey: ["price-compare"] });
      setPickerOpen(true);
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background print:bg-white pb-28">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur bg-background/85 border-b print:hidden">
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-3 py-2.5">
          <h1 className="text-base sm:text-lg font-semibold flex-1 truncate">Price Compare</h1>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setScanOpen(true)} title="Scan barcode">
            <ScanLine className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!product || !history.length}
                onClick={() => exportPriceComparePDF(product!.name, summary, history, suppliers)}
              ><FileText className="h-4 w-4 mr-2" />Export PDF</DropdownMenuItem>
              <DropdownMenuItem
                disabled={!product || !history.length}
                onClick={() => exportPriceCompareExcel(product!.name, history, suppliers)}
              ><FileSpreadsheet className="h-4 w-4 mr-2" />Export Excel</DropdownMenuItem>
              <DropdownMenuItem disabled={!product} onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />Print
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!product || !history.length}
                onClick={() => sharePriceCompareWhatsApp(product!.name, summary, suppliers)}
              ><Share2 className="h-4 w-4 mr-2" />Share on WhatsApp</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => historyQuery.refetch()}>
                <RefreshCcw className="h-4 w-4 mr-2" />Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {!product ? (
          <LandingView
            query={listQuery}
            onQueryChange={setListQuery}
            debouncedQuery={debouncedListQuery}
            category={listCategory}
            onCategoryChange={setListCategory}
            onSelect={handleSelect}
            onScan={() => setScanOpen(true)}
            onAdd={() => setNewProductOpen(true)}
          />
        ) : (
          <>
            {/* Sticky Product Header */}
            <div className="sticky top-[52px] z-20 -mx-3 sm:-mx-4 px-3 sm:px-4 pt-3 pb-2 bg-gradient-to-b from-background/95 to-background/70 backdrop-blur print:static print:bg-transparent">
              <div className="rounded-3xl overflow-hidden border bg-card shadow-md">
                <div className="flex gap-3 p-3">
                  <button
                    onClick={() => product.image_url && setLightbox(product.image_url)}
                    className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl bg-muted overflow-hidden flex items-center justify-center"
                  >
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      : <Package className="h-8 w-8 text-muted-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold leading-tight line-clamp-2">{product.name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        {product.barcode && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                            <Tag className="h-3 w-3" />{product.barcode}
                          </span>
                        )}
                        {product.brand && <span className="truncate">{product.brand}</span>}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <MiniPill label="Sale" value={SAR(summary.currentSell || product.sale_price || 0)} tone="primary" />
                      <MiniPill label="Lowest" value={SAR(summary.lowest)} tone="green" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {lastUpdated ? `Updated ${lastUpdated}` : "No records yet"}
                  </span>
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="font-medium text-primary hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(["today", "week", "month", "custom", "all"] as DatePreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={cn(
                      "shrink-0 text-xs rounded-full px-3 py-1.5 border transition-colors",
                      preset === p ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent",
                    )}
                  >
                    {p === "today" ? "Today" : p === "week" ? "Weekly" : p === "month" ? "Monthly" : p === "custom" ? "Custom" : "All"}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setFilterOpen(true)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 text-xs rounded-full px-3 py-1.5 border transition-colors relative",
                    supplier ? "bg-primary/10 border-primary text-primary" : "bg-background hover:bg-accent",
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {preset === "custom" && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                  <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                </div>
              )}
            </div>

            {/* Summary cards */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <StatCard icon={<Tag className="h-4 w-4" />} label="Sale Price"
                value={SAR(summary.currentSell || product.sale_price || 0)} tone="primary" />
              <StatCard icon={<Wallet className="h-4 w-4" />} label="Latest Purchase"
                value={SAR(latestRow?.purchase_price ?? 0)}
                sub={latestRow ? (latestRow.supplier_name || latestRow.market_name || "—") : "—"}
                date={latestRow?.record_date || null} tone="indigo" />
              <StatCard icon={<ArrowDown className="h-4 w-4" />} label="Lowest Purchase"
                value={SAR(summary.lowest)}
                sub={lowestRow ? (lowestRow.supplier_name || lowestRow.market_name || "—") : "—"}
                date={lowestRow?.record_date || null} tone="green" />
              <StatCard icon={<ArrowUp className="h-4 w-4" />} label="Highest Purchase"
                value={SAR(summary.highest)}
                sub={highestRow ? (highestRow.supplier_name || highestRow.market_name || "—") : "—"}
                date={highestRow?.record_date || null} tone="red" />
            </div>

            {/* Supplier records — flat, fully visible */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <h2 className="text-sm font-semibold">Suppliers</h2>
                <span className="text-[11px] text-muted-foreground">Cheapest first</span>
              </div>
              {rows.length ? (
                <div className="space-y-2.5">
                  {[...rows].sort((a, b) => a.purchase_price - b.purchase_price).map((r) => (
                    <div key={r.id} className="rounded-2xl border bg-card shadow-sm p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-muted text-muted-foreground grid place-items-center text-sm font-bold">
                          {(r.supplier_name || r.market_name || "—").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-sm truncate">
                              {r.supplier_name || r.market_name || "—"}
                            </div>
                            <div className="text-base font-bold tabular-nums text-right shrink-0">
                              {SAR(r.purchase_price)}
                            </div>
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{r.record_date || "—"}
                          </div>
                          {r.notes && (
                            <div className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">{r.notes}</div>
                          )}
                          {r.image_url && (
                            <button
                              onClick={() => setLightbox(r.image_url!)}
                              className="mt-2 h-12 w-12 rounded-lg bg-muted overflow-hidden grid place-items-center border"
                            >
                              {/\.pdf($|\?)/i.test(r.image_url)
                                ? <FileIcon className="h-4 w-4 text-muted-foreground" />
                                : <img src={r.image_url} alt="" className="h-full w-full object-cover" />}
                            </button>
                          )}
                          <div className="mt-2.5 flex items-center justify-end gap-0.5">
                            <Button size="icon" variant="ghost" className="h-8 w-8"
                              onClick={() => { setEditingRecord(r); setRecordFormOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                              onClick={() => setConfirmDelRecord(r)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
                  {historyQuery.isLoading ? "Loading…" : (
                    <div className="space-y-3">
                      <ImageIcon className="h-8 w-8 mx-auto opacity-40" />
                      <div>No price records yet.</div>
                      <Button size="sm" onClick={() => { setEditingRecord(null); setRecordFormOpen(true); }}>
                        <Plus className="h-4 w-4 mr-1" /> Add First Record
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      {product ? (
        <div className="fixed bottom-5 right-5 z-40 print:hidden flex flex-col items-end gap-2">
          {fabOpen && (
            <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2">
              <FabItem label="Add Price Record" icon={<Plus className="h-4 w-4" />}
                onClick={() => { setFabOpen(false); setEditingRecord(null); setRecordFormOpen(true); }} />
              <FabItem label="Edit Product" icon={<Pencil className="h-4 w-4" />}
                onClick={() => { setFabOpen(false); setProductFormOpen(true); }} />
              <FabItem label="Delete Product" icon={<Trash2 className="h-4 w-4" />} tone="destructive"
                onClick={() => { setFabOpen(false); setConfirmDelProduct(true); }} />
            </div>
          )}
          <button
            onClick={() => setFabOpen((v) => !v)}
            className={cn(
              "h-14 w-14 rounded-full grid place-items-center shadow-xl transition-all",
              "bg-primary text-primary-foreground hover:scale-105",
              fabOpen && "rotate-45",
            )}
            aria-label="Actions"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setNewProductOpen(true)}
          className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full grid place-items-center shadow-xl bg-primary text-primary-foreground hover:scale-105 transition-all print:hidden"
          aria-label="Add product"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1.5">Supplier</div>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="h-10 w-full rounded-lg border bg-transparent px-3 text-sm"
              >
                <option value="">All suppliers</option>
                {(supplierListQuery.data ?? []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setSupplier(""); setPreset("all"); }}>
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setFilterOpen(false)}>Apply</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Attachment lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[60] bg-black/90 grid place-items-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 grid place-items-center text-white" onClick={() => setLightbox(null)}>
            <X className="h-5 w-5" />
          </button>
          {/\.pdf($|\?)/i.test(lightbox)
            ? <iframe src={lightbox} className="w-full h-full max-w-3xl bg-white rounded-lg" />
            : <img src={lightbox} alt="" className="max-h-full max-w-full rounded-lg" />}
        </div>
      )}

      <ProductPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelect}
        recent={[]}
      />
      <ProductFormDialog
        open={productFormOpen}
        onOpenChange={setProductFormOpen}
        product={product}
        onSaved={(p) => setProduct(p)}
      />
      <ProductFormDialog
        open={newProductOpen}
        onOpenChange={setNewProductOpen}
        product={null}
        onSaved={(p) => {
          setNewProductOpen(false);
          qc.invalidateQueries({ queryKey: ["pc-landing-products"] });
          qc.invalidateQueries({ queryKey: ["pc-landing-categories"] });
          setProduct(p);
        }}
      />
      {product && (
        <RecordFormDialog
          open={recordFormOpen}
          onOpenChange={setRecordFormOpen}
          productId={product.id}
          record={editingRecord}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["price-compare", product.id] });
            qc.invalidateQueries({ queryKey: ["price-compare-suppliers"] });
          }}
        />
      )}
      <BarcodeScanner
        open={scanOpen}
        onOpenChange={setScanOpen}
        onDetected={(c) => { void onScanned(c); }}
        mode="single"
        title="Scan product"
      />
      <AlertDialog open={!!confirmDelRecord} onOpenChange={(o) => !o && setConfirmDelRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this price record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelRecord && doDeleteRecord(confirmDelRecord)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={confirmDelProduct} onOpenChange={setConfirmDelProduct}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>All price records for this product will also be removed. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doDeleteProduct}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

const TONES: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function StatCard({
  icon, label, value, sub, date, tone = "primary", className,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; date?: string | null; tone?: keyof typeof TONES | string; className?: string }) {
  const toneClass = TONES[tone] ?? TONES.primary;
  return (
    <div className={cn("rounded-2xl border bg-card p-3 shadow-sm flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <div className={cn("h-8 w-8 rounded-lg grid place-items-center", toneClass)}>{icon}</div>
        <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
      </div>
      <div className="mt-1.5 text-lg font-bold tabular-nums">{value}</div>
      {(sub || date) && (
        <div className="mt-1.5 space-y-0.5">
          {sub && <div className="text-[11px] text-foreground truncate leading-tight">{sub}</div>}
          {date && (
            <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />{date}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MiniPill({ label, value, tone }: { label: string; value: string; tone?: "primary" | "green" }) {
  const t = tone === "green" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                             : "bg-primary/10 text-primary";
  return (
    <div className={cn("rounded-lg px-2 py-1", t)}>
      <div className="text-[10px] font-medium uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-xs font-bold tabular-nums truncate">{value}</div>
    </div>
  );
}


function FabItem({ label, icon, onClick, tone }: { label: string; icon: React.ReactNode; onClick: () => void; tone?: "destructive" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full pl-4 pr-3 py-2 shadow-lg text-sm font-medium border",
        tone === "destructive"
          ? "bg-destructive text-destructive-foreground border-destructive"
          : "bg-card text-foreground hover:bg-accent",
      )}
    >
      <span>{label}</span>
      <span className="h-8 w-8 rounded-full bg-background/20 grid place-items-center">{icon}</span>
    </button>
  );
}


/* ---------- Landing (home) view ---------- */

function LandingView({
  query, onQueryChange, debouncedQuery, category, onCategoryChange,
  onSelect, onScan, onAdd,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  debouncedQuery: string;
  category: string | null;
  onCategoryChange: (c: string | null) => void;
  onSelect: (p: PCProduct) => void;
  onScan: () => void;
  onAdd: () => void;
}) {
  const categoriesQuery = useQuery({
    queryKey: ["pc-landing-categories"],
    queryFn: listCategories,
    staleTime: 5 * 60_000,
  });

  const productsQuery = useQuery({
    queryKey: ["pc-landing-products", debouncedQuery, category],
    queryFn: () => searchProducts({ q: debouncedQuery, category, limit: 200 }),
    staleTime: 30_000,
  });

  const products = productsQuery.data ?? [];
  const productIds = useMemo(() => products.map((p) => p.id), [products]);

  const summariesQuery = useQuery({
    queryKey: ["pc-landing-summaries", productIds],
    enabled: productIds.length > 0,
    queryFn: () => loadProductSummaries(productIds),
    staleTime: 30_000,
  });

  const summaries = summariesQuery.data;
  const cats = categoriesQuery.data ?? [];

  return (
    <div className="pt-4 pb-8 space-y-4">
      {/* Premium hero search */}
      <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-5 shadow-sm">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Price Compare
        </div>
        <div className="mt-1 text-lg sm:text-xl font-bold">Find & compare product prices</div>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name or barcode…"
            className="h-12 pl-9 pr-3 rounded-2xl bg-background/80 border-border/70 shadow-sm text-base"
          />
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={onScan}
            className="h-11 rounded-2xl gap-2 bg-background/70"
          >
            <ScanLine className="h-4 w-4" />
            Scan Barcode
          </Button>
          <Button onClick={onAdd} className="h-11 rounded-2xl gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Category chips */}
      {cats.length > 0 && (
        <div className="-mx-1 px-1 flex gap-1.5 overflow-x-auto no-scrollbar">
          <CategoryChip active={!category} onClick={() => onCategoryChange(null)}>All</CategoryChip>
          {cats.map((c) => (
            <CategoryChip key={c} active={category === c} onClick={() => onCategoryChange(c)}>
              {c}
            </CategoryChip>
          ))}
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">
            {debouncedQuery ? "Results" : category ? category : "All Products"}
          </h2>
          {!productsQuery.isLoading && (
            <span className="text-[11px] text-muted-foreground">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {productsQuery.isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState hasQuery={!!debouncedQuery || !!category} />
        ) : (
          <div className="space-y-2.5">
            {products.map((p) => (
              <ProductListCard
                key={p.id}
                product={p}
                summary={summaries?.get(p.id)}
                onSelect={() => onSelect(p)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card hover:bg-accent border-border/70",
      )}
    >
      {children}
    </button>
  );
}

function ProductListCard({
  product, summary, onSelect,
}: { product: PCProduct; summary: import("@/lib/price-compare/queries").PCProductSummary | undefined; onSelect: () => void }) {
  const profiles = useProfileMap();
  const lowest = summary?.lowest ?? 0;
  const lowestCompany = summary?.lowestCompany || summary?.lowestMarket || null;
  const lowestDate = summary?.lowestCompanyLastDate ?? "";
  const hasRecords = lowest > 0;

  const latestUserId = summary?.latestUserId;
  const userId = latestUserId || product.user_id;
  const userName = displayProfile(profiles[userId]);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-2xl border bg-card shadow-sm p-3",
        "flex items-center gap-3 transition-all",
        "hover:shadow-md active:scale-[0.995] active:bg-accent/40",
      )}
    >
      <div className="h-16 w-16 shrink-0 rounded-xl bg-muted overflow-hidden grid place-items-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Package className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0 h-16 flex flex-col justify-between">
        <div className="font-bold text-[13px] leading-tight line-clamp-1 text-foreground">
          {product.name}
        </div>

        {hasRecords ? (
          <div className="text-xl leading-none font-bold text-emerald-600 tabular-nums">
            {SAR(lowest)}
          </div>
        ) : (
          <div className="text-base leading-none font-semibold text-muted-foreground">
            No price records
          </div>
        )}

        <div className="text-[11px] leading-tight text-muted-foreground truncate inline-flex items-center gap-1">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{lowestCompany || "—"}</span>
        </div>

        <div className="text-[11px] leading-tight text-muted-foreground truncate inline-flex items-center gap-1">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>{lowestDate || "—"}</span>
        </div>
      </div>

      <div className="h-16 flex flex-col justify-start items-end shrink-0 max-w-[110px]">
        <div className="text-[11px] leading-tight font-medium truncate inline-flex items-center gap-1">
          <User className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate text-muted-foreground">{userName}</span>
        </div>
      </div>
    </button>
  );
}


function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="rounded-3xl border-2 border-dashed bg-card/50 p-8 sm:p-10 text-center">
      <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 grid place-items-center mb-4">
        <Package className="h-9 w-9 text-primary/70" />
      </div>
      {hasQuery ? (
        <>
          <div className="text-base font-semibold">No products found.</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Try a different search or add this product using the + button.
          </div>
        </>
      ) : (
        <>
          <div className="text-base font-semibold">No products available.</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Tap the <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground align-middle mx-0.5"><Plus className="h-3 w-3" /></span> button to add your first product.
          </div>
        </>
      )}
    </div>
  );
}

