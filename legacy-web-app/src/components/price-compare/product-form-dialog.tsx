// Price Compare — Premium Add/Edit Product with repeatable Purchase blocks.
// UI-only redesign. No changes to DB structure or business logic.
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { toast } from "sonner";
import {
  Camera, X, ScanLine, Plus, Trash2, FileText, Package, Building2,
  ChevronDown, ChevronUp, ImagePlus, Search, Loader2, Sparkles, Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { uploadProductImage, uploadAttachmentFile } from "@/lib/image-upload";
import {
  createProduct, updateProduct, loadRecords, createRecord, updateRecord, deleteRecord,
  searchProducts, listSuppliers, getProductById,
  type PCProduct, type PCProductInput, type PCRecord,
} from "@/lib/price-compare/queries";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { FindProductImageDialog } from "@/components/find-product-image-dialog";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product?: PCProduct | null;
  onSaved: (p: PCProduct) => void;
};

type PurchaseBlock = {
  key: string;
  id: string | null;
  company_name: string;
  purchase_price: string;
  memo_date: string;
  memo_url: string | null;
  memo_mime: string | null;
  collapsed?: boolean;
  _deleted?: boolean;
};

function todayIso() { return new Date().toISOString().slice(0, 10); }
function uid() { return Math.random().toString(36).slice(2, 10); }

const EMPTY_PRODUCT: PCProductInput = {
  name: "", barcode: null, category: null, brand: null, unit: null,
  notes: null, image_url: null, sale_price: null,
};

function newBlock(): PurchaseBlock {
  return {
    key: uid(), id: null,
    company_name: "", purchase_price: "",
    memo_date: todayIso(), memo_url: null, memo_mime: null,
    collapsed: false,
  };
}

function recordToBlock(r: PCRecord): PurchaseBlock {
  return {
    key: uid(), id: r.id,
    company_name: r.supplier_name ?? "",
    purchase_price: r.purchase_price ? String(r.purchase_price) : "",
    memo_date: r.record_date,
    memo_url: r.image_url,
    memo_mime: r.image_url && /\.pdf(\?|$)/i.test(r.image_url) ? "application/pdf" : null,
    collapsed: true,
  };
}

export function ProductFormDialog({ open, onOpenChange, product, onSaved }: Props) {
  const [form, setForm] = useState<PCProductInput>(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<PurchaseBlock[]>([newBlock()]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // Autocomplete: product name
  const [nameFocused, setNameFocused] = useState(false);
  const debouncedName = useDebouncedValue(form.name, 180);
  const [nameOptions, setNameOptions] = useState<PCProduct[]>([]);
  const [nameLoading, setNameLoading] = useState(false);

  // Autocomplete: suppliers list (loaded once when dialog opens)
  const [suppliers, setSuppliers] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (product) {
      const { id, ...rest } = product;
      setEditingId(id);
      setForm(rest);
      void loadRecords(product.id, { from: null, to: null, supplier: null }).then((rows) => {
        setBlocks(rows.length ? rows.map(recordToBlock) : [newBlock()]);
      });
    } else {
      setEditingId(null);
      setForm(EMPTY_PRODUCT);
      setBlocks([newBlock()]);
    }
    void listSuppliers().then(setSuppliers).catch(() => setSuppliers([]));
  }, [open, product]);

  // Search products as user types name (only when not already editing a loaded product)
  useEffect(() => {
    if (!open) return;
    const q = (debouncedName ?? "").trim();
    if (!nameFocused || q.length < 1) { setNameOptions([]); return; }
    let cancelled = false;
    setNameLoading(true);
    searchProducts({ q, limit: 8 })
      .then((rows) => { if (!cancelled) setNameOptions(rows); })
      .catch(() => { if (!cancelled) setNameOptions([]); })
      .finally(() => { if (!cancelled) setNameLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedName, nameFocused, open]);

  function setField<K extends keyof PCProductInput>(k: K, v: PCProductInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updateBlock(key: string, patch: Partial<PurchaseBlock>) {
    setBlocks((bs) => bs.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  }
  function removeBlock(key: string) {
    setBlocks((bs) => {
      const target = bs.find((b) => b.key === key);
      if (!target) return bs;
      if (target.id) return bs.map((b) => (b.key === key ? { ...b, _deleted: true } : b));
      return bs.filter((b) => b.key !== key);
    });
  }
  function addBlock() {
    setBlocks((bs) => [...bs.map((b) => ({ ...b, collapsed: true })), newBlock()]);
  }
  function toggleCollapse(key: string) {
    setBlocks((bs) => bs.map((b) => (b.key === key ? { ...b, collapsed: !b.collapsed } : b)));
  }

  async function pickExistingProduct(p: PCProduct) {
    setNameFocused(false);
    setNameOptions([]);
    try {
      const full = (await getProductById(p.id)) ?? p;
      const { id, ...rest } = full;
      setEditingId(id);
      setForm(rest);
      const rows = await loadRecords(id, { from: null, to: null, supplier: null });
      setBlocks(rows.length ? rows.map(recordToBlock) : [newBlock()]);
      toast.success("Loaded existing product");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load product");
    }
  }

  async function onImageFile(file: File | null) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setField("image_url", url);
    } catch (e: any) { toast.error(e?.message ?? "Upload failed"); }
    finally { setUploadingImage(false); }
  }

  async function onMemoFile(key: string, file: File | null) {
    if (!file) return;
    updateBlock(key, { memo_url: "__uploading__" });
    try {
      const url = await uploadAttachmentFile(file);
      updateBlock(key, { memo_url: url, memo_mime: file.type || null });
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
      updateBlock(key, { memo_url: null, memo_mime: null });
    }
  }

  async function submit() {
    const name = form.name.trim();
    if (!name) { toast.error("Product name is required"); return; }

    const active = blocks.filter((b) => !b._deleted);
    for (const b of active) {
      if (b.company_name.trim() || b.purchase_price || b.memo_url) {
        if (!b.company_name.trim()) { toast.error("Company name is required for each purchase"); return; }
        if (!(Number(b.purchase_price) > 0)) { toast.error("Purchase price is required for each purchase"); return; }
        if (!b.memo_date) { toast.error("Memo date is required for each purchase"); return; }
      }
    }

    setSaving(true);
    try {
      const payload: PCProductInput = {
        name,
        barcode: form.barcode?.toString().trim() || null,
        category: form.category?.toString().trim() || null,
        brand: form.brand?.toString().trim() || null,
        unit: form.unit?.toString().trim() || null,
        notes: form.notes?.toString().trim() || null,
        image_url: form.image_url || null,
        sale_price: form.sale_price != null && String(form.sale_price) !== ""
          ? Number(form.sale_price) : null,
      };
      const saved = editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);

      for (const b of blocks) {
        if (b._deleted) {
          if (b.id) await deleteRecord(b.id);
          continue;
        }
        const hasData = b.company_name.trim() || Number(b.purchase_price) > 0 || b.memo_url;
        if (!hasData) continue;
        const rec = {
          product_id: saved.id,
          record_date: b.memo_date,
          market_name: null,
          supplier_name: b.company_name.trim() || null,
          purchase_price: Number(b.purchase_price) || 0,
          selling_price: null,
          offer_price: null,
          notes: null,
          image_url: b.memo_url && b.memo_url !== "__uploading__" ? b.memo_url : null,
        };
        if (b.id) await updateRecord(b.id, rec);
        else await createRecord(rec);
      }

      onSaved(saved);
      onOpenChange(false);
      toast.success(editingId ? "Product updated" : "Product added");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const visibleBlocks = blocks.filter((b) => !b._deleted);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg h-[100dvh] sm:h-auto sm:max-h-[92dvh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b bg-gradient-to-b from-muted/40 to-transparent">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              {editingId ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Save product details once, then add unlimited company prices.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-muted/20">
            {/* Product Information Card */}
            <section className="rounded-2xl border bg-card shadow-sm p-4 space-y-4 animate-in fade-in-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold leading-tight">Product Information</h3>
                  <p className="text-[11px] text-muted-foreground">Entered once per product</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Name with autocomplete */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Product Name *</Label>
                  <Popover open={nameFocused && (nameOptions.length > 0 || nameLoading)}>
                    <PopoverAnchor asChild>
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          value={form.name}
                          onChange={(e) => { setField("name", e.target.value); setEditingId((id) => id); }}
                          onFocus={() => setNameFocused(true)}
                          onBlur={() => setTimeout(() => setNameFocused(false), 150)}
                          placeholder="Search or type new name"
                          autoFocus
                          className="h-11 pl-9 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                        {nameLoading && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </PopoverAnchor>
                    <PopoverContent
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      className="p-1 w-[var(--radix-popover-trigger-width)] max-h-64 overflow-y-auto"
                    >
                      {nameOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pickExistingProduct(p)}
                          className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent"
                        >
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-8 w-8 rounded object-cover border" />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted grid place-items-center">
                              <Package className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm truncate">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {p.barcode ?? p.brand ?? p.category ?? "Existing product"}
                            </div>
                          </div>
                        </button>
                      ))}
                      {!nameLoading && nameOptions.length === 0 && (
                        <div className="px-2 py-3 text-xs text-muted-foreground">No matches</div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Barcode</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.barcode ?? ""}
                        onChange={(e) => setField("barcode", e.target.value)}
                        placeholder="Scan or enter"
                        className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                      <Button
                        type="button" variant="outline" size="icon"
                        onClick={() => setScanOpen(true)}
                        title="Scan barcode"
                        className="h-11 w-11 rounded-xl shrink-0"
                      >
                        <ScanLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Sale Price</Label>
                    <Input
                      type="number" inputMode="decimal" step="0.01"
                      value={form.sale_price ?? ""}
                      onChange={(e) => setField("sale_price",
                        e.target.value === "" ? null : Number(e.target.value))}
                      placeholder="0.00"
                      className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Product Image</Label>
                  {form.image_url ? (
                    <div className="relative w-full aspect-[4/3] max-h-56 rounded-2xl overflow-hidden border bg-muted">
                      <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setField("image_url", null)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1.5 transition"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed",
                      "h-36 bg-muted/40 transition",
                    )}>
                      <div className="h-10 w-10 rounded-full bg-background grid place-items-center shadow-sm">
                        {uploadingImage
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <ImagePlus className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="text-xs font-medium">
                        {uploadingImage ? "Uploading…" : "Add a product photo"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">Camera, Gallery, or Find online</div>
                    </div>
                  )}

                  <input ref={galleryRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { onImageFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => { onImageFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button type="button" variant="outline" size="sm" disabled={uploadingImage}
                      onClick={() => cameraRef.current?.click()} className="h-10 rounded-xl gap-1.5">
                      <Camera className="h-4 w-4" /> Camera
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled={uploadingImage}
                      onClick={() => galleryRef.current?.click()} className="h-10 rounded-xl gap-1.5">
                      <Upload className="h-4 w-4" /> Gallery
                    </Button>
                    <Button type="button" variant="outline" size="sm" disabled={uploadingImage}
                      onClick={() => {
                        if (!form.name.trim()) { toast.error("Enter Product Name first"); return; }
                        setFindOpen(true);
                      }}
                      className="h-10 rounded-xl gap-1.5 border-primary/40 text-primary hover:bg-primary/10">
                      <Sparkles className="h-4 w-4" /> Find
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Purchase Information Cards */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">Purchase Information</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {visibleBlocks.length} {visibleBlocks.length === 1 ? "company" : "companies"}
                    </p>
                  </div>
                </div>
              </div>

              {visibleBlocks.map((b, idx) => (
                <PurchaseCard
                  key={b.key}
                  block={b}
                  index={idx}
                  canRemove={!(visibleBlocks.length === 1 && !b.id)}
                  suppliers={suppliers}
                  onToggle={() => toggleCollapse(b.key)}
                  onChange={(patch) => updateBlock(b.key, patch)}
                  onRemove={() => removeBlock(b.key)}
                  onFile={(f) => onMemoFile(b.key, f)}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addBlock}
                className={cn(
                  "w-full h-12 rounded-xl border-2 border-dashed border-primary/30",
                  "text-primary hover:bg-primary/5 hover:border-primary/50 transition",
                  "font-medium",
                )}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Another Company
              </Button>
            </section>
          </div>

          <DialogFooter className="p-3 border-t bg-background sm:justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving || uploadingImage} className="rounded-xl min-w-32">
              {saving ? (<><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving…</>) : (editingId ? "Update Product" : "Save Product")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BarcodeScanner
        open={scanOpen}
        onOpenChange={setScanOpen}
        onDetected={(code) => { setField("barcode", code); setScanOpen(false); }}
        mode="single"
        title="Scan barcode"
      />

      <FindProductImageDialog
        open={findOpen}
        onOpenChange={setFindOpen}
        name={form.name}
        barcode={form.barcode}
        brand={form.brand}
        onPicked={(url) => setField("image_url", url)}
      />
    </>
  );
}

/* ---------- Purchase Card ---------- */

function PurchaseCard({
  block, index, canRemove, suppliers,
  onToggle, onChange, onRemove, onFile,
}: {
  block: PurchaseBlock;
  index: number;
  canRemove: boolean;
  suppliers: string[];
  onToggle: () => void;
  onChange: (p: Partial<PurchaseBlock>) => void;
  onRemove: () => void;
  onFile: (f: File | null) => void;
}) {
  const [companyFocused, setCompanyFocused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const companyMatches = useMemo(() => {
    const q = block.company_name.trim().toLowerCase();
    if (!companyFocused || q.length < 1) return [];
    return suppliers.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [suppliers, block.company_name, companyFocused]);

  const isPdf = !!(block.memo_url && (block.memo_mime === "application/pdf" || /\.pdf(\?|$)/i.test(block.memo_url)));
  const summary = block.company_name || `Purchase #${index + 1}`;

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/40 transition"
      >
        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-xs font-semibold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{summary}</div>
          <div className="text-[11px] text-muted-foreground">
            {block.purchase_price ? `${block.purchase_price} · ${block.memo_date}` : "Tap to fill details"}
          </div>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="h-8 w-8 grid place-items-center rounded-lg text-destructive hover:bg-destructive/10 transition"
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {block.collapsed
          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
          : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      <div
        ref={contentRef}
        className={cn(
          "grid transition-all duration-300 ease-out",
          block.collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 space-y-3 border-t bg-muted/20">
            {/* Company autocomplete */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company Name</Label>
              <Popover open={companyFocused && companyMatches.length > 0}>
                <PopoverAnchor asChild>
                  <Input
                    value={block.company_name}
                    onChange={(e) => onChange({ company_name: e.target.value })}
                    onFocus={() => setCompanyFocused(true)}
                    onBlur={() => setTimeout(() => setCompanyFocused(false), 150)}
                    placeholder="Search or type new company"
                    className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </PopoverAnchor>
                <PopoverContent
                  align="start"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="p-1 w-[var(--radix-popover-trigger-width)] max-h-56 overflow-y-auto"
                >
                  {companyMatches.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { onChange({ company_name: s }); setCompanyFocused(false); }}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent text-sm"
                    >
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Purchase Price</Label>
                <Input
                  type="number" inputMode="decimal" step="0.01"
                  value={block.purchase_price}
                  onChange={(e) => onChange({ purchase_price: e.target.value })}
                  placeholder="0.00"
                  className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Memo Date</Label>
                <Input
                  type="date"
                  value={block.memo_date}
                  onChange={(e) => onChange({ memo_date: e.target.value })}
                  className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Memo (Image or PDF)</Label>
              {block.memo_url && block.memo_url !== "__uploading__" ? (
                <div className="flex items-center gap-3 rounded-xl border bg-background p-2.5">
                  {isPdf ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-muted grid place-items-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <a href={block.memo_url} target="_blank" rel="noreferrer"
                         className="text-xs text-primary truncate hover:underline">
                        View PDF
                      </a>
                    </div>
                  ) : (
                    <>
                      <a href={block.memo_url} target="_blank" rel="noreferrer" className="shrink-0">
                        <img src={block.memo_url} alt=""
                             className="h-14 w-14 rounded-lg object-cover border" />
                      </a>
                      <div className="text-xs text-muted-foreground flex-1">Attached</div>
                    </>
                  )}
                  <Button type="button" size="icon" variant="ghost"
                          onClick={() => onChange({ memo_url: null, memo_mime: null })}
                          className="h-8 w-8 rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border-2 border-dashed",
                  "h-20 cursor-pointer bg-muted/40 hover:bg-accent/40 hover:border-primary/40 transition",
                )}>
                  {block.memo_url === "__uploading__" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Uploading…</span>
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium">Attach image or PDF</span>
                    </>
                  )}
                  <input type="file" accept="image/*,application/pdf" className="hidden"
                         onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
