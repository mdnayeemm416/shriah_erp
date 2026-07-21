import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { ar as useDebouncedValue, B as Button, Z as DropdownMenu, _ as DropdownMenuTrigger, $ as DropdownMenuContent, a0 as DropdownMenuItem, a1 as DropdownMenuSeparator, af as SAR, d as cn, I as Input, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, as as BarcodeScanner, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, P as Popover, aM as PopoverAnchor, q as PopoverContent, G as DialogFooter, T as Textarea, ad as useProfileMap, ae as displayProfile, h as Badge } from "./router-KeVl8_Ln.mjs";
import { S as Skeleton } from "./skeleton-BjboBqhG.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { uploadProductImage, uploadAttachmentFile } from "./image-upload-CX99TgIR.mjs";
import { F as FindProductImageDialog } from "./find-product-image-dialog-DiFuh3SA.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import E from "../_libs/jspdf.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { E as ScanLine, av as EllipsisVertical, $ as FileText, aH as FileSpreadsheet, J as Printer, Y as Share2, b9 as RefreshCcw, v as Package, aJ as Tag, at as Calendar, ba as SlidersHorizontal, W as Wallet, bb as ArrowDown, bc as ArrowUp, bd as File, a5 as Pencil, T as Trash2, a0 as Image, P as Plus, X, y as Search, k as LoaderCircle, au as ImagePlus, i as Camera, j as Upload, l as Sparkles, ai as Building2, o as User, a1 as Star, be as StarOff, m as ChevronDown, p as ChevronUp } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/tslib.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
function mapProduct(r) {
  return {
    id: r.id,
    name: r.name,
    barcode: r.barcode ?? null,
    category: r.category ?? null,
    brand: r.brand ?? null,
    unit: r.unit ?? null,
    notes: r.notes ?? null,
    image_url: r.image_url ?? null,
    sale_price: r.sale_price == null ? null : Number(r.sale_price),
    user_id: r.user_id
  };
}
async function searchProducts(opts) {
  const limit = opts.limit ?? 40;
  const offset = opts.offset ?? 0;
  let qb = supabase.from("price_compare_products").select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id").order("name", { ascending: true }).range(offset, offset + limit - 1);
  const term = opts.q.trim();
  if (term) qb = qb.or(`name.ilike.%${term}%,barcode.ilike.%${term}%,brand.ilike.%${term}%`);
  if (opts.category) qb = qb.eq("category", opts.category);
  const { data, error } = await qb;
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}
async function findProductByBarcode(code) {
  const { data } = await supabase.from("price_compare_products").select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id").eq("barcode", code).limit(1).maybeSingle();
  return data ? mapProduct(data) : null;
}
async function getProductById(id) {
  const { data } = await supabase.from("price_compare_products").select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id").eq("id", id).maybeSingle();
  return data ? mapProduct(data) : null;
}
async function listCategories() {
  const { data } = await supabase.from("price_compare_products").select("category").not("category", "is", null).limit(2e3);
  const set = /* @__PURE__ */ new Set();
  for (const r of data ?? []) if (r.category) set.add(r.category);
  return [...set].sort();
}
async function createProduct(input) {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  if (!user_id) throw new Error("Not signed in");
  const { data, error } = await supabase.from("price_compare_products").insert({ ...input, user_id }).select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id").single();
  if (error) throw error;
  return mapProduct(data);
}
async function updateProduct(id, input) {
  const { data, error } = await supabase.from("price_compare_products").update(input).eq("id", id).select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id").single();
  if (error) throw error;
  return mapProduct(data);
}
async function deleteProduct(id) {
  const { error } = await supabase.from("price_compare_products").delete().eq("id", id);
  if (error) throw error;
}
function mapRecord(r) {
  return {
    id: r.id,
    product_id: r.product_id,
    record_date: r.record_date,
    market_name: r.market_name ?? null,
    supplier_name: r.supplier_name ?? null,
    purchase_price: Number(r.purchase_price) || 0,
    selling_price: r.selling_price == null ? null : Number(r.selling_price),
    offer_price: r.offer_price == null ? null : Number(r.offer_price),
    notes: r.notes ?? null,
    image_url: r.image_url ?? null,
    created_at: r.created_at
  };
}
async function loadRecords(productId, f) {
  let qb = supabase.from("price_compare_records").select("*").eq("product_id", productId).order("record_date", { ascending: false }).limit(2e3);
  if (f.from) qb = qb.gte("record_date", f.from);
  if (f.to) qb = qb.lte("record_date", f.to);
  if (f.supplier) qb = qb.ilike("supplier_name", f.supplier);
  const { data, error } = await qb;
  if (error) throw error;
  return (data ?? []).map(mapRecord);
}
async function listSuppliers() {
  const { data } = await supabase.from("price_compare_records").select("supplier_name").not("supplier_name", "is", null).limit(2e3);
  const set = /* @__PURE__ */ new Set();
  for (const r of data ?? []) if (r.supplier_name) set.add(r.supplier_name);
  return [...set].sort();
}
async function createRecord(input) {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  if (!user_id) throw new Error("Not signed in");
  const { data, error } = await supabase.from("price_compare_records").insert({ ...input, user_id }).select("*").single();
  if (error) throw error;
  return mapRecord(data);
}
async function updateRecord(id, input) {
  const { data, error } = await supabase.from("price_compare_records").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return mapRecord(data);
}
async function deleteRecord(id) {
  const { error } = await supabase.from("price_compare_records").delete().eq("id", id);
  if (error) throw error;
}
async function loadProductSummaries(ids) {
  const out = /* @__PURE__ */ new Map();
  if (!ids.length) return out;
  const { data, error } = await supabase.from("price_compare_records").select("product_id,purchase_price,supplier_name,market_name,record_date,user_id").in("product_id", ids);
  if (error) throw error;
  const byProd = /* @__PURE__ */ new Map();
  for (const r of data ?? []) {
    if (!byProd.has(r.product_id)) byProd.set(r.product_id, []);
    byProd.get(r.product_id).push(r);
  }
  for (const [pid, rows] of byProd) {
    const prices = rows.map((r) => Number(r.purchase_price) || 0).filter((p) => p > 0);
    const suppliers = /* @__PURE__ */ new Set();
    let lastDate = "";
    let minPrice = Infinity;
    const lowestRows = [];
    let latestRow = null;
    for (const r of rows) {
      const key = r.supplier_name || r.market_name;
      if (key) suppliers.add(key);
      if (r.record_date && r.record_date > lastDate) {
        lastDate = r.record_date;
        latestRow = r;
      }
      const p = Number(r.purchase_price) || 0;
      if (p > 0 && p < minPrice) {
        minPrice = p;
        lowestRows.length = 0;
        lowestRows.push(r);
      } else if (p > 0 && p === minPrice) {
        lowestRows.push(r);
      }
    }
    let lowestCompanyLastDate = "";
    for (const r of lowestRows) {
      if (r.record_date && r.record_date > lowestCompanyLastDate) lowestCompanyLastDate = r.record_date;
    }
    const lowestRow = lowestRows[0] ?? null;
    out.set(pid, {
      lowest: prices.length ? Math.min(...prices) : 0,
      companies: suppliers.size,
      lastDate,
      records: rows.length,
      lowestCompany: lowestRow?.supplier_name ?? null,
      lowestMarket: lowestRow?.market_name ?? null,
      lowestCompanyLastDate: lowestCompanyLastDate || null,
      latestUserId: latestRow?.user_id ?? null
    });
  }
  return out;
}
function computeSummary(rows) {
  if (!rows.length) {
    return { currentPurchase: 0, lastPurchase: 0, lowest: 0, highest: 0, average: 0, totalRecords: 0, currentSell: 0, currentOffer: 0 };
  }
  const sorted = [...rows].sort((a, b) => a.record_date < b.record_date ? 1 : -1);
  const prices = sorted.map((l) => l.purchase_price).filter((p) => p > 0);
  const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
  return {
    currentPurchase: sorted[0]?.purchase_price ?? 0,
    lastPurchase: sorted[1]?.purchase_price ?? sorted[0]?.purchase_price ?? 0,
    lowest: prices.length ? Math.min(...prices) : 0,
    highest: prices.length ? Math.max(...prices) : 0,
    average: avg,
    totalRecords: rows.length,
    currentSell: sorted[0]?.selling_price ?? 0,
    currentOffer: sorted[0]?.offer_price ?? 0
  };
}
function bySupplier(rows) {
  const map = /* @__PURE__ */ new Map();
  for (const l of rows) {
    const key = l.supplier_name || l.market_name || "—";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(l);
  }
  const out = [];
  for (const [supplier, ls] of map) {
    const sorted = [...ls].sort((a, b) => a.record_date < b.record_date ? 1 : -1);
    const prices = ls.map((l) => l.purchase_price).filter((p) => p > 0);
    const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
    out.push({
      supplier,
      last: sorted[0]?.purchase_price ?? 0,
      lowest: prices.length ? Math.min(...prices) : 0,
      highest: prices.length ? Math.max(...prices) : 0,
      average: avg,
      count: ls.length,
      lastDate: sorted[0]?.record_date ?? ""
    });
  }
  return out.sort((a, b) => (a.lowest || Infinity) - (b.lowest || Infinity));
}
function withDeltas(rows) {
  const chrono = [...rows].sort((a, b) => a.record_date < b.record_date ? -1 : 1);
  let prev = 0;
  const out = chrono.map((l) => {
    const p = prev;
    const delta = p ? l.purchase_price - p : 0;
    const deltaPct = p ? delta / p * 100 : 0;
    prev = l.purchase_price;
    return { ...l, prev: p, delta, deltaPct };
  });
  return out.reverse();
}
function todayIso$1() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
const EMPTY_PRODUCT = {
  name: "",
  barcode: null,
  category: null,
  brand: null,
  unit: null,
  notes: null,
  image_url: null,
  sale_price: null
};
function newBlock() {
  return {
    key: uid(),
    id: null,
    company_name: "",
    purchase_price: "",
    memo_date: todayIso$1(),
    memo_url: null,
    memo_mime: null,
    collapsed: false
  };
}
function recordToBlock(r) {
  return {
    key: uid(),
    id: r.id,
    company_name: r.supplier_name ?? "",
    purchase_price: r.purchase_price ? String(r.purchase_price) : "",
    memo_date: r.record_date,
    memo_url: r.image_url,
    memo_mime: r.image_url && /\.pdf(\?|$)/i.test(r.image_url) ? "application/pdf" : null,
    collapsed: true
  };
}
function ProductFormDialog({ open, onOpenChange, product, onSaved }) {
  const [form, setForm] = reactExports.useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [blocks, setBlocks] = reactExports.useState([newBlock()]);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploadingImage, setUploadingImage] = reactExports.useState(false);
  const [scanOpen, setScanOpen] = reactExports.useState(false);
  const [findOpen, setFindOpen] = reactExports.useState(false);
  const galleryRef = reactExports.useRef(null);
  const cameraRef = reactExports.useRef(null);
  const [nameFocused, setNameFocused] = reactExports.useState(false);
  const debouncedName = useDebouncedValue(form.name, 180);
  const [nameOptions, setNameOptions] = reactExports.useState([]);
  const [nameLoading, setNameLoading] = reactExports.useState(false);
  const [suppliers, setSuppliers] = reactExports.useState([]);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    if (!open) return;
    const q = (debouncedName ?? "").trim();
    if (!nameFocused || q.length < 1) {
      setNameOptions([]);
      return;
    }
    let cancelled = false;
    setNameLoading(true);
    searchProducts({ q, limit: 8 }).then((rows) => {
      if (!cancelled) setNameOptions(rows);
    }).catch(() => {
      if (!cancelled) setNameOptions([]);
    }).finally(() => {
      if (!cancelled) setNameLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedName, nameFocused, open]);
  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function updateBlock(key, patch) {
    setBlocks((bs) => bs.map((b) => b.key === key ? { ...b, ...patch } : b));
  }
  function removeBlock(key) {
    setBlocks((bs) => {
      const target = bs.find((b) => b.key === key);
      if (!target) return bs;
      if (target.id) return bs.map((b) => b.key === key ? { ...b, _deleted: true } : b);
      return bs.filter((b) => b.key !== key);
    });
  }
  function addBlock() {
    setBlocks((bs) => [...bs.map((b) => ({ ...b, collapsed: true })), newBlock()]);
  }
  function toggleCollapse(key) {
    setBlocks((bs) => bs.map((b) => b.key === key ? { ...b, collapsed: !b.collapsed } : b));
  }
  async function pickExistingProduct(p) {
    setNameFocused(false);
    setNameOptions([]);
    try {
      const full = await getProductById(p.id) ?? p;
      const { id, ...rest } = full;
      setEditingId(id);
      setForm(rest);
      const rows = await loadRecords(id, { from: null, to: null, supplier: null });
      setBlocks(rows.length ? rows.map(recordToBlock) : [newBlock()]);
      toast.success("Loaded existing product");
    } catch (e) {
      toast.error(e?.message ?? "Failed to load product");
    }
  }
  async function onImageFile(file) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setField("image_url", url);
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }
  async function onMemoFile(key, file) {
    if (!file) return;
    updateBlock(key, { memo_url: "__uploading__" });
    try {
      const url = await uploadAttachmentFile(file);
      updateBlock(key, { memo_url: url, memo_mime: file.type || null });
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
      updateBlock(key, { memo_url: null, memo_mime: null });
    }
  }
  async function submit() {
    const name = form.name.trim();
    if (!name) {
      toast.error("Product name is required");
      return;
    }
    const active = blocks.filter((b) => !b._deleted);
    for (const b of active) {
      if (b.company_name.trim() || b.purchase_price || b.memo_url) {
        if (!b.company_name.trim()) {
          toast.error("Company name is required for each purchase");
          return;
        }
        if (!(Number(b.purchase_price) > 0)) {
          toast.error("Purchase price is required for each purchase");
          return;
        }
        if (!b.memo_date) {
          toast.error("Memo date is required for each purchase");
          return;
        }
      }
    }
    setSaving(true);
    try {
      const payload = {
        name,
        barcode: form.barcode?.toString().trim() || null,
        category: form.category?.toString().trim() || null,
        brand: form.brand?.toString().trim() || null,
        unit: form.unit?.toString().trim() || null,
        notes: form.notes?.toString().trim() || null,
        image_url: form.image_url || null,
        sale_price: form.sale_price != null && String(form.sale_price) !== "" ? Number(form.sale_price) : null
      };
      const saved = editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
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
          image_url: b.memo_url && b.memo_url !== "__uploading__" ? b.memo_url : null
        };
        if (b.id) await updateRecord(b.id, rec);
        else await createRecord(rec);
      }
      onSaved(saved);
      onOpenChange(false);
      toast.success(editingId ? "Product updated" : "Product added");
    } catch (e) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }
  const visibleBlocks = blocks.filter((b) => !b._deleted);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg h-[100dvh] sm:h-auto sm:max-h-[92dvh] flex flex-col p-0 gap-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-5 py-4 border-b bg-gradient-to-b from-muted/40 to-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-semibold tracking-tight", children: editingId ? "Edit Product" : "Add Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Save product details once, then add unlimited company prices." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border bg-card shadow-sm p-4 space-y-4 animate-in fade-in-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-tight", children: "Product Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Entered once per product" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Product Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: nameFocused && (nameOptions.length > 0 || nameLoading), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverAnchor, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: form.name,
                      onChange: (e) => {
                        setField("name", e.target.value);
                        setEditingId((id) => id);
                      },
                      onFocus: () => setNameFocused(true),
                      onBlur: () => setTimeout(() => setNameFocused(false), 150),
                      placeholder: "Search or type new name",
                      autoFocus: true,
                      className: "h-11 pl-9 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                    }
                  ),
                  nameLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  PopoverContent,
                  {
                    align: "start",
                    onOpenAutoFocus: (e) => e.preventDefault(),
                    className: "p-1 w-[var(--radix-popover-trigger-width)] max-h-64 overflow-y-auto",
                    children: [
                      nameOptions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onMouseDown: (e) => e.preventDefault(),
                          onClick: () => pickExistingProduct(p),
                          className: "w-full flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent",
                          children: [
                            p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "h-8 w-8 rounded object-cover border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded bg-muted grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-muted-foreground" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm truncate", children: p.name }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: p.barcode ?? p.brand ?? p.category ?? "Existing product" })
                            ] })
                          ]
                        },
                        p.id
                      )),
                      !nameLoading && nameOptions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-3 text-xs text-muted-foreground", children: "No matches" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Barcode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: form.barcode ?? "",
                      onChange: (e) => setField("barcode", e.target.value),
                      placeholder: "Scan or enter",
                      className: "h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "icon",
                      onClick: () => setScanOpen(true),
                      title: "Scan barcode",
                      className: "h-11 w-11 rounded-xl shrink-0",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Sale Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    inputMode: "decimal",
                    step: "0.01",
                    value: form.sale_price ?? "",
                    onChange: (e) => setField(
                      "sale_price",
                      e.target.value === "" ? null : Number(e.target.value)
                    ),
                    placeholder: "0.00",
                    className: "h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Product Image" }),
              form.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[4/3] max-h-56 rounded-2xl overflow-hidden border bg-muted", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image_url, alt: "", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setField("image_url", null),
                    className: "absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1.5 transition",
                    "aria-label": "Remove image",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 text-white" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed",
                "h-36 bg-muted/40 transition"
              ), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-background grid place-items-center shadow-sm", children: uploadingImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-4 w-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium", children: uploadingImage ? "Uploading…" : "Add a product photo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Camera, Gallery, or Find online" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: galleryRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => {
                    onImageFile(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: cameraRef,
                  type: "file",
                  accept: "image/*",
                  capture: "environment",
                  className: "hidden",
                  onChange: (e) => {
                    onImageFile(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    disabled: uploadingImage,
                    onClick: () => cameraRef.current?.click(),
                    className: "h-10 rounded-xl gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
                      " Camera"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    disabled: uploadingImage,
                    onClick: () => galleryRef.current?.click(),
                    className: "h-10 rounded-xl gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
                      " Gallery"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    disabled: uploadingImage,
                    onClick: () => {
                      if (!form.name.trim()) {
                        toast.error("Enter Product Name first");
                        return;
                      }
                      setFindOpen(true);
                    },
                    className: "h-10 rounded-xl gap-1.5 border-primary/40 text-primary hover:bg-primary/10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                      " Find"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-tight", children: "Purchase Information" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                visibleBlocks.length,
                " ",
                visibleBlocks.length === 1 ? "company" : "companies"
              ] })
            ] })
          ] }) }),
          visibleBlocks.map((b, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PurchaseCard,
            {
              block: b,
              index: idx,
              canRemove: !(visibleBlocks.length === 1 && !b.id),
              suppliers,
              onToggle: () => toggleCollapse(b.key),
              onChange: (patch) => updateBlock(b.key, patch),
              onRemove: () => removeBlock(b.key),
              onFile: (f) => onMemoFile(b.key, f)
            },
            b.key
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: addBlock,
              className: cn(
                "w-full h-12 rounded-xl border-2 border-dashed border-primary/30",
                "text-primary hover:bg-primary/5 hover:border-primary/50 transition",
                "font-medium"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
                " Add Another Company"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-3 border-t bg-background sm:justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: saving, className: "rounded-xl", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: saving || uploadingImage, className: "rounded-xl min-w-32", children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-1.5 animate-spin" }),
          " Saving…"
        ] }) : editingId ? "Update Product" : "Save Product" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BarcodeScanner,
      {
        open: scanOpen,
        onOpenChange: setScanOpen,
        onDetected: (code) => {
          setField("barcode", code);
          setScanOpen(false);
        },
        mode: "single",
        title: "Scan barcode"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindProductImageDialog,
      {
        open: findOpen,
        onOpenChange: setFindOpen,
        name: form.name,
        barcode: form.barcode,
        brand: form.brand,
        onPicked: (url) => setField("image_url", url)
      }
    )
  ] });
}
function PurchaseCard({
  block,
  index,
  canRemove,
  suppliers,
  onToggle,
  onChange,
  onRemove,
  onFile
}) {
  const [companyFocused, setCompanyFocused] = reactExports.useState(false);
  const contentRef = reactExports.useRef(null);
  const companyMatches = reactExports.useMemo(() => {
    const q = block.company_name.trim().toLowerCase();
    if (!companyFocused || q.length < 1) return [];
    return suppliers.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [suppliers, block.company_name, companyFocused]);
  const isPdf = !!(block.memo_url && (block.memo_mime === "application/pdf" || /\.pdf(\?|$)/i.test(block.memo_url)));
  const summary = block.company_name || `Purchase #${index + 1}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/40 transition",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-xs font-semibold shrink-0", children: index + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: summary }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: block.purchase_price ? `${block.purchase_price} · ${block.memo_date}` : "Tap to fill details" })
          ] }),
          canRemove && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onRemove();
              },
              className: "h-8 w-8 grid place-items-center rounded-lg text-destructive hover:bg-destructive/10 transition",
              title: "Remove",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          ),
          block.collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: contentRef,
        className: cn(
          "grid transition-all duration-300 ease-out",
          block.collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-1 space-y-3 border-t bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Company Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: companyFocused && companyMatches.length > 0, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverAnchor, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: block.company_name,
                  onChange: (e) => onChange({ company_name: e.target.value }),
                  onFocus: () => setCompanyFocused(true),
                  onBlur: () => setTimeout(() => setCompanyFocused(false), 150),
                  placeholder: "Search or type new company",
                  className: "h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PopoverContent,
                {
                  align: "start",
                  onOpenAutoFocus: (e) => e.preventDefault(),
                  className: "p-1 w-[var(--radix-popover-trigger-width)] max-h-56 overflow-y-auto",
                  children: companyMatches.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onMouseDown: (e) => e.preventDefault(),
                      onClick: () => {
                        onChange({ company_name: s });
                        setCompanyFocused(false);
                      },
                      className: "w-full flex items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: s })
                      ]
                    },
                    s
                  ))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Purchase Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  inputMode: "decimal",
                  step: "0.01",
                  value: block.purchase_price,
                  onChange: (e) => onChange({ purchase_price: e.target.value }),
                  placeholder: "0.00",
                  className: "h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Memo Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: block.memo_date,
                  onChange: (e) => onChange({ memo_date: e.target.value }),
                  className: "h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Memo (Image or PDF)" }),
            block.memo_url && block.memo_url !== "__uploading__" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border bg-background p-2.5", children: [
              isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-lg bg-muted grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: block.memo_url,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "text-xs text-primary truncate hover:underline",
                    children: "View PDF"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: block.memo_url, target: "_blank", rel: "noreferrer", className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: block.memo_url,
                    alt: "",
                    className: "h-14 w-14 rounded-lg object-cover border"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground flex-1", children: "Attached" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  onClick: () => onChange({ memo_url: null, memo_mime: null }),
                  className: "h-8 w-8 rounded-lg",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 border-dashed",
              "h-20 cursor-pointer bg-muted/40 hover:bg-accent/40 hover:border-primary/40 transition"
            ), children: [
              block.memo_url === "__uploading__" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Uploading…" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Attach image or PDF" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*,application/pdf",
                  className: "hidden",
                  onChange: (e) => onFile(e.target.files?.[0] ?? null)
                }
              )
            ] })
          ] })
        ] }) })
      }
    )
  ] });
}
const FAV_KEY = "pc:favorites";
const PAGE = 40;
function ProductPickerDialog({ open, onOpenChange, onSelect, recent }) {
  const [q, setQ] = reactExports.useState("");
  const debouncedQ = useDebouncedValue(q, 250);
  const [category, setCategory] = reactExports.useState(null);
  const [cats, setCats] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [end, setEnd] = reactExports.useState(false);
  const [offset, setOffset] = reactExports.useState(0);
  const [scanOpen, setScanOpen] = reactExports.useState(false);
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [confirmDel, setConfirmDel] = reactExports.useState(null);
  const [favIds, setFavIds] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    void listCategories().then(setCats);
  }, [open, items.length]);
  reactExports.useEffect(() => {
    if (!open) return;
    setItems([]);
    setOffset(0);
    setEnd(false);
    void loadPage(0, true);
  }, [open, debouncedQ, category]);
  async function loadPage(off, reset = false) {
    setLoading(true);
    try {
      const rows = await searchProducts({ q: debouncedQ, category, limit: PAGE, offset: off });
      setItems((prev) => reset ? rows : [...prev, ...rows]);
      setOffset(off + rows.length);
      if (rows.length < PAGE) setEnd(true);
    } finally {
      setLoading(false);
    }
  }
  const favSet = reactExports.useMemo(() => new Set(favIds), [favIds]);
  function toggleFav(id) {
    const next = favSet.has(id) ? favIds.filter((x) => x !== id) : [id, ...favIds].slice(0, 50);
    setFavIds(next);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
  }
  async function onScanned(code) {
    const p = await findProductByBarcode(code);
    if (p) {
      setScanOpen(false);
      onSelect(p);
      return;
    }
    toast.error("No product matches this barcode");
  }
  async function doDelete(p) {
    try {
      await deleteProduct(p.id);
      setItems((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e?.message ?? "Delete failed");
    } finally {
      setConfirmDel(null);
    }
  }
  const showRecent = !debouncedQ && !category && recent.length > 0;
  const favProducts = items.filter((p) => favSet.has(p.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-full sm:max-w-3xl h-[100dvh] sm:h-[90dvh] p-0 flex flex-col gap-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "p-4 pb-2 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Select Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "default", className: "ml-auto h-8", onClick: () => {
            setEditing(null);
            setFormOpen(true);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
            " Add"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => onOpenChange(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                autoFocus: true,
                value: q,
                onChange: (e) => setQ(e.target.value),
                placeholder: "Search name, barcode, brand…",
                className: "pl-8"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: () => setScanOpen(true), title: "Scan barcode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" }) })
        ] }),
        cats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 overflow-x-auto mt-2 pb-1 -mx-1 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: !category, onClick: () => setCategory(null), children: "All" }),
          cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: category === c, onClick: () => setCategory(c), children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: scrollRef,
          className: "flex-1 overflow-y-auto p-3 space-y-4",
          onScroll: (e) => {
            const el = e.currentTarget;
            if (!end && !loading && el.scrollTop + el.clientHeight >= el.scrollHeight - 200) {
              void loadPage(offset);
            }
          },
          children: [
            showRecent && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Recently Compared", children: recent.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductRow,
              {
                p,
                onSelect,
                isFav: favSet.has(p.id),
                onFav: toggleFav,
                onEdit: (pp) => {
                  setEditing(pp);
                  setFormOpen(true);
                },
                onDelete: setConfirmDel
              },
              "r-" + p.id
            )) }),
            favProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Favorites", children: favProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductRow,
              {
                p,
                onSelect,
                isFav: true,
                onFav: toggleFav,
                onEdit: (pp) => {
                  setEditing(pp);
                  setFormOpen(true);
                },
                onDelete: setConfirmDel
              },
              "f-" + p.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: debouncedQ ? "Results" : "All Products", children: [
              items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProductRow,
                {
                  p,
                  onSelect,
                  isFav: favSet.has(p.id),
                  onFav: toggleFav,
                  onEdit: (pp) => {
                    setEditing(pp);
                    setFormOpen(true);
                  },
                  onDelete: setConfirmDel
                },
                p.id
              )),
              loading && Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)),
              !loading && !items.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-muted-foreground py-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
                "No products yet. Tap ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Add" }),
                " to create one."
              ] }),
              end && items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-muted-foreground py-3", children: "End of list" })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BarcodeScanner,
      {
        open: scanOpen,
        onOpenChange: setScanOpen,
        onDetected: (code) => {
          void onScanned(code);
        },
        mode: "single",
        title: "Scan product"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: formOpen,
        onOpenChange: setFormOpen,
        product: editing,
        onSaved: (p) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.id === p.id);
            if (idx >= 0) {
              const c = [...prev];
              c[idx] = p;
              return c;
            }
            return [p, ...prev];
          });
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmDel, onOpenChange: (o) => !o && setConfirmDel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this product?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          '"',
          confirmDel?.name,
          '" and all its price records will be permanently deleted.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => confirmDel && doDelete(confirmDel), children: "Delete" })
      ] })
    ] }) })
  ] });
}
function Section({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children })
  ] });
}
function Chip({ active, onClick, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: "shrink-0 text-xs rounded-full px-3 py-1 border transition-colors " + (active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"),
      children
    }
  );
}
function ProductRow({
  p,
  onSelect,
  isFav,
  onFav,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border bg-card p-2 hover:bg-accent/40 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-3 flex-1 min-w-0 text-left", onClick: () => onSelect(p), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
          p.barcode ? `Barcode: ${p.barcode}` : "No barcode",
          p.brand ? ` · ${p.brand}` : "",
          p.unit ? ` · ${p.unit}` : ""
        ] })
      ] }),
      p.category ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "shrink-0", children: p.category }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 shrink-0", onClick: () => onFav(p.id), children: isFav ? /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-yellow-400 text-yellow-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StarOff, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 shrink-0", onClick: () => onEdit(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 shrink-0 text-destructive", onClick: () => onDelete(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
  ] });
}
function todayIso() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
const emptyFor = (productId) => ({
  product_id: productId,
  record_date: todayIso(),
  market_name: null,
  supplier_name: null,
  purchase_price: 0,
  selling_price: null,
  offer_price: null,
  notes: null,
  image_url: null
});
function RecordFormDialog({ open, onOpenChange, productId, record, onSaved }) {
  const [form, setForm] = reactExports.useState(emptyFor(productId));
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) return;
    if (record) {
      const { id: _id, created_at: _c, ...rest } = record;
      setForm(rest);
    } else setForm(emptyFor(productId));
  }, [open, record, productId]);
  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  async function onFile(f) {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(f);
      set("image_url", url);
      toast.success("Photo uploaded");
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  async function submit() {
    if (!form.record_date) {
      toast.error("Date is required");
      return;
    }
    if (!(Number(form.purchase_price) > 0)) {
      toast.error("Purchase price is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        product_id: productId,
        record_date: form.record_date,
        market_name: form.market_name?.toString().trim() || null,
        supplier_name: form.supplier_name?.toString().trim() || null,
        purchase_price: Number(form.purchase_price) || 0,
        selling_price: form.selling_price != null && form.selling_price !== "" ? Number(form.selling_price) : null,
        offer_price: form.offer_price != null && form.offer_price !== "" ? Number(form.offer_price) : null,
        notes: form.notes?.toString().trim() || null,
        image_url: form.image_url || null
      };
      const saved = record ? await updateRecord(record.id, payload) : await createRecord(payload);
      onSaved(saved);
      onOpenChange(false);
      toast.success(record ? "Record updated" : "Record added");
    } catch (e) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: record ? "Edit Price Record" : "Add Price Record" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: form.record_date,
            onChange: (e) => set("record_date", e.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Market / Shop", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.market_name ?? "", onChange: (e) => set("market_name", e.target.value) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Supplier", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.supplier_name ?? "", onChange: (e) => set("supplier_name", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Purchase *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            step: "0.01",
            value: form.purchase_price || "",
            onChange: (e) => set("purchase_price", Number(e.target.value) || 0)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Selling", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            step: "0.01",
            value: form.selling_price ?? "",
            onChange: (e) => set("selling_price", e.target.value === "" ? null : Number(e.target.value))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Offer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            step: "0.01",
            value: form.offer_price ?? "",
            onChange: (e) => set("offer_price", e.target.value === "" ? null : Number(e.target.value))
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.notes ?? "", onChange: (e) => set("notes", e.target.value) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product Photo", children: form.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-24 h-24 rounded-md overflow-hidden border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image_url, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => set("image_url", null),
            className: "absolute top-1 right-1 bg-black/60 rounded-full p-1",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 text-white" })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-center gap-2 rounded-md border-2 border-dashed h-20 cursor-pointer hover:bg-accent/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: uploading ? "Uploading…" : "Add photo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: (e) => onFile(e.target.files?.[0] ?? null)
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: saving, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: saving || uploading, children: saving ? "Saving…" : record ? "Update" : "Add Record" })
    ] })
  ] }) });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
    children
  ] });
}
function exportPriceCompareExcel(productName, history, suppliers) {
  const wb = utils.book_new();
  const historySheet = utils.json_to_sheet(
    history.map((r) => ({
      Date: r.record_date,
      Market: r.market_name ?? "—",
      Supplier: r.supplier_name ?? "—",
      Purchase: r.purchase_price,
      Selling: r.selling_price ?? "",
      Offer: r.offer_price ?? "",
      "Previous Purchase": r.prev,
      "Δ SAR": r.delta,
      "Δ %": Number(r.deltaPct.toFixed(2)),
      Notes: r.notes ?? ""
    }))
  );
  const supplierSheet = utils.json_to_sheet(
    suppliers.map((s) => ({
      Supplier: s.supplier,
      "Last Price": s.last,
      "Lowest Price": s.lowest,
      "Highest Price": s.highest,
      "Average Price": Number(s.average.toFixed(2)),
      Records: s.count,
      "Last Date": s.lastDate
    }))
  );
  utils.book_append_sheet(wb, historySheet, "History");
  utils.book_append_sheet(wb, supplierSheet, "Suppliers");
  const safe = productName.replace(/[^\w\-]+/g, "_").slice(0, 40);
  writeFileSync(wb, `price-compare-${safe}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
}
function exportPriceComparePDF(productName, summary, history, suppliers) {
  const doc = new E({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(14);
  doc.text("Price Compare Report", pageW / 2, 40, { align: "center" });
  doc.setFontSize(10);
  doc.text(productName, pageW / 2, 58, { align: "center" });
  doc.text(`Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, pageW / 2, 72, { align: "center" });
  let y = 100;
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 40, y);
  doc.setFont("helvetica", "normal");
  y += 16;
  const s = summary;
  const lines = [
    `Current: SAR ${s.currentPurchase.toFixed(2)}   Last: SAR ${s.lastPurchase.toFixed(2)}`,
    `Lowest: SAR ${s.lowest.toFixed(2)}   Highest: SAR ${s.highest.toFixed(2)}   Avg: SAR ${s.average.toFixed(2)}`,
    `Records: ${s.totalRecords}   Current Sell: SAR ${s.currentSell.toFixed(2)}   Offer: SAR ${s.currentOffer.toFixed(2)}`
  ];
  for (const l of lines) {
    doc.text(l, 40, y);
    y += 14;
  }
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Price Records", 40, y);
  y += 14;
  const headers = ["Date", "Market", "Supplier", "Purchase", "Sell", "Offer", "Δ"];
  const cols = [40, 110, 200, 290, 350, 400, 450];
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  doc.setFont("helvetica", "normal");
  y += 12;
  for (const r of history) {
    if (y > 780) {
      doc.addPage();
      y = 60;
    }
    doc.text(r.record_date, cols[0], y);
    doc.text(String(r.market_name ?? "—").slice(0, 16), cols[1], y);
    doc.text(String(r.supplier_name ?? "—").slice(0, 16), cols[2], y);
    doc.text(r.purchase_price.toFixed(2), cols[3], y);
    doc.text(r.selling_price != null ? r.selling_price.toFixed(2) : "—", cols[4], y);
    doc.text(r.offer_price != null ? r.offer_price.toFixed(2) : "—", cols[5], y);
    doc.text(`${r.delta.toFixed(2)}`, cols[6], y);
    y += 12;
  }
  y += 10;
  if (y > 740) {
    doc.addPage();
    y = 60;
  }
  doc.setFont("helvetica", "bold");
  doc.text("Suppliers (sorted by lowest price)", 40, y);
  y += 14;
  const sh = ["Supplier", "Last", "Low", "High", "Avg", "Records", "Last Date"];
  const sc = [40, 200, 250, 300, 350, 400, 460];
  sh.forEach((h, i) => doc.text(h, sc[i], y));
  doc.setFont("helvetica", "normal");
  y += 12;
  for (const r of suppliers) {
    if (y > 780) {
      doc.addPage();
      y = 60;
    }
    doc.text(String(r.supplier).slice(0, 26), sc[0], y);
    doc.text(r.last.toFixed(2), sc[1], y);
    doc.text(r.lowest.toFixed(2), sc[2], y);
    doc.text(r.highest.toFixed(2), sc[3], y);
    doc.text(r.average.toFixed(2), sc[4], y);
    doc.text(String(r.count), sc[5], y);
    doc.text(r.lastDate, sc[6], y);
    y += 12;
  }
  const safe = productName.replace(/[^\w\-]+/g, "_").slice(0, 40);
  doc.save(`price-compare-${safe}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`);
}
function sharePriceCompareWhatsApp(productName, summary, suppliers) {
  const s = summary;
  const top = suppliers.slice(0, 5).map((r, i) => `${i + 1}. ${r.supplier} — SAR ${r.lowest.toFixed(2)} (avg ${r.average.toFixed(2)})`).join("\n");
  const text = [
    `*Price Compare — ${productName}*`,
    `Current: SAR ${s.currentPurchase.toFixed(2)}  •  Last: SAR ${s.lastPurchase.toFixed(2)}`,
    `Low: SAR ${s.lowest.toFixed(2)}  •  High: SAR ${s.highest.toFixed(2)}  •  Avg: SAR ${s.average.toFixed(2)}`,
    `Records: ${s.totalRecords}`,
    "",
    "*Best Suppliers:*",
    top || "(no data)"
  ].join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
function presetBounds(p) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const iso = (d) => d.toISOString().slice(0, 10);
  if (p === "today") return {
    from: iso(today),
    to: iso(today)
  };
  if (p === "week") {
    const s = new Date(today);
    s.setDate(s.getDate() - 6);
    return {
      from: iso(s),
      to: iso(today)
    };
  }
  if (p === "month") {
    const s = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: iso(s),
      to: iso(today)
    };
  }
  return {
    from: null,
    to: null
  };
}
function PriceComparePage() {
  const qc = useQueryClient();
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const [product, setProduct] = reactExports.useState(null);
  const [productFormOpen, setProductFormOpen] = reactExports.useState(false);
  const [recordFormOpen, setRecordFormOpen] = reactExports.useState(false);
  const [editingRecord, setEditingRecord] = reactExports.useState(null);
  const [confirmDelRecord, setConfirmDelRecord] = reactExports.useState(null);
  const [confirmDelProduct, setConfirmDelProduct] = reactExports.useState(false);
  const [preset, setPreset] = reactExports.useState("all");
  const [customFrom, setCustomFrom] = reactExports.useState("");
  const [customTo, setCustomTo] = reactExports.useState("");
  const [supplier, setSupplier] = reactExports.useState("");
  const [scanOpen, setScanOpen] = reactExports.useState(false);
  const [filterOpen, setFilterOpen] = reactExports.useState(false);
  const [fabOpen, setFabOpen] = reactExports.useState(false);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const [listQuery, setListQuery] = reactExports.useState("");
  const [listCategory, setListCategory] = reactExports.useState(null);
  const [newProductOpen, setNewProductOpen] = reactExports.useState(false);
  const debouncedListQuery = useDebouncedValue(listQuery, 150);
  const filters = reactExports.useMemo(() => {
    const b = preset === "custom" ? {
      from: customFrom || null,
      to: customTo || null
    } : presetBounds(preset);
    return {
      from: b.from,
      to: b.to,
      supplier: supplier || null
    };
  }, [preset, customFrom, customTo, supplier]);
  const historyQuery = useQuery({
    queryKey: ["price-compare", product?.id, filters],
    queryFn: () => loadRecords(product.id, filters),
    enabled: !!product,
    staleTime: 6e4
  });
  const supplierListQuery = useQuery({
    queryKey: ["price-compare-suppliers"],
    queryFn: listSuppliers,
    staleTime: 5 * 6e4
  });
  const rows = historyQuery.data ?? [];
  const summary = reactExports.useMemo(() => computeSummary(rows), [rows]);
  const history = reactExports.useMemo(() => withDeltas(rows), [rows]);
  const suppliers = reactExports.useMemo(() => bySupplier(rows), [rows]);
  const {
    latestRow,
    lowestRow,
    highestRow
  } = reactExports.useMemo(() => {
    if (!rows.length) return {
      latestRow: null,
      lowestRow: null,
      highestRow: null
    };
    const byDate = [...rows].sort((a, b) => b.record_date.localeCompare(a.record_date));
    const byPriceAsc = [...rows].sort((a, b) => a.purchase_price - b.purchase_price);
    return {
      latestRow: byDate[0],
      lowestRow: byPriceAsc[0],
      highestRow: byPriceAsc[byPriceAsc.length - 1]
    };
  }, [rows]);
  const lastUpdated = reactExports.useMemo(() => {
    return rows.reduce((acc, r) => r.record_date > acc ? r.record_date : acc, "");
  }, [rows]);
  const activeFilterCount = (preset !== "all" ? 1 : 0) + (supplier ? 1 : 0);
  const handleSelect = reactExports.useCallback((p) => {
    setProduct(p);
    setPickerOpen(false);
  }, []);
  async function onScanned(code) {
    const p = await findProductByBarcode(code);
    if (p) {
      setScanOpen(false);
      handleSelect(p);
      return;
    }
    toast.error("No product matches this barcode");
  }
  async function doDeleteRecord(r) {
    try {
      await deleteRecord(r.id);
      toast.success("Record deleted");
      qc.invalidateQueries({
        queryKey: ["price-compare", product?.id]
      });
      qc.invalidateQueries({
        queryKey: ["price-compare-suppliers"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Delete failed");
    } finally {
      setConfirmDelRecord(null);
    }
  }
  async function doDeleteProduct() {
    if (!product) return;
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      setProduct(null);
      setConfirmDelProduct(false);
      qc.invalidateQueries({
        queryKey: ["price-compare"]
      });
      setPickerOpen(true);
    } catch (e) {
      toast.error(e?.message ?? "Delete failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-b from-muted/30 to-background print:bg-white pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-30 backdrop-blur bg-background/85 border-b print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto flex items-center gap-2 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base sm:text-lg font-semibold flex-1 truncate", children: "Price Compare" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full", onClick: () => setScanOpen(true), title: "Scan barcode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { disabled: !product || !history.length, onClick: () => exportPriceComparePDF(product.name, summary, history, suppliers), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
            "Export PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { disabled: !product || !history.length, onClick: () => exportPriceCompareExcel(product.name, history, suppliers), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 mr-2" }),
            "Export Excel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { disabled: !product, onClick: () => window.print(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-2" }),
            "Print"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { disabled: !product || !history.length, onClick: () => sharePriceCompareWhatsApp(product.name, summary, suppliers), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 mr-2" }),
            "Share on WhatsApp"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => historyQuery.refetch(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4 mr-2" }),
            "Refresh"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto px-3 sm:px-4", children: !product ? /* @__PURE__ */ jsxRuntimeExports.jsx(LandingView, { query: listQuery, onQueryChange: setListQuery, debouncedQuery: debouncedListQuery, category: listCategory, onCategoryChange: setListCategory, onSelect: handleSelect, onScan: () => setScanOpen(true), onAdd: () => setNewProductOpen(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-[52px] z-20 -mx-3 sm:-mx-4 px-3 sm:px-4 pt-3 pb-2 bg-gradient-to-b from-background/95 to-background/70 backdrop-blur print:static print:bg-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl overflow-hidden border bg-card shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => product.image_url && setLightbox(product.image_url), className: "h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl bg-muted overflow-hidden flex items-center justify-center", children: product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: product.name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base sm:text-lg font-bold leading-tight line-clamp-2", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground", children: [
                  product.barcode && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3" }),
                    product.barcode
                  ] }),
                  product.brand && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: product.brand })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MiniPill, { label: "Sale", value: SAR(summary.currentSell || product.sale_price || 0), tone: "primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(MiniPill, { label: "Lowest", value: SAR(summary.lowest), tone: "green" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              lastUpdated ? `Updated ${lastUpdated}` : "No records yet"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPickerOpen(true), className: "font-medium text-primary hover:underline", children: "Change" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar", children: [
          ["today", "week", "month", "custom", "all"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreset(p), className: cn("shrink-0 text-xs rounded-full px-3 py-1.5 border transition-colors", preset === p ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"), children: p === "today" ? "Today" : p === "week" ? "Weekly" : p === "month" ? "Monthly" : p === "custom" ? "Custom" : "All" }, p)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilterOpen(true), className: cn("shrink-0 inline-flex items-center gap-1 text-xs rounded-full px-3 py-1.5 border transition-colors relative", supplier ? "bg-primary/10 border-primary text-primary" : "bg-background hover:bg-accent"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
            "Filters",
            activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0", children: activeFilterCount })
          ] })
        ] }),
        preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4" }), label: "Sale Price", value: SAR(summary.currentSell || product.sale_price || 0), tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), label: "Latest Purchase", value: SAR(latestRow?.purchase_price ?? 0), sub: latestRow ? latestRow.supplier_name || latestRow.market_name || "—" : "—", date: latestRow?.record_date || null, tone: "indigo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-4 w-4" }), label: "Lowest Purchase", value: SAR(summary.lowest), sub: lowestRow ? lowestRow.supplier_name || lowestRow.market_name || "—" : "—", date: lowestRow?.record_date || null, tone: "green" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-4 w-4" }), label: "Highest Purchase", value: SAR(summary.highest), sub: highestRow ? highestRow.supplier_name || highestRow.market_name || "—" : "—", date: highestRow?.record_date || null, tone: "red" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Suppliers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: "Cheapest first" })
        ] }),
        rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [...rows].sort((a, b) => a.purchase_price - b.purchase_price).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card shadow-sm p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 shrink-0 rounded-xl bg-muted text-muted-foreground grid place-items-center text-sm font-bold", children: (r.supplier_name || r.market_name || "—").slice(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate", children: r.supplier_name || r.market_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold tabular-nums text-right shrink-0", children: SAR(r.purchase_price) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-[11px] text-muted-foreground inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              r.record_date || "—"
            ] }),
            r.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-[11px] text-muted-foreground line-clamp-2", children: r.notes }),
            r.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLightbox(r.image_url), className: "mt-2 h-12 w-12 rounded-lg bg-muted overflow-hidden grid place-items-center border", children: /\.pdf($|\?)/i.test(r.image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.image_url, alt: "", className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 flex items-center justify-end gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => {
                setEditingRecord(r);
                setRecordFormOpen(true);
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", onClick: () => setConfirmDelRecord(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] })
        ] }) }, r.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground", children: historyQuery.isLoading ? "Loading…" : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 mx-auto opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "No price records yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
            setEditingRecord(null);
            setRecordFormOpen(true);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
            " Add First Record"
          ] })
        ] }) })
      ] })
    ] }) }),
    product ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-5 right-5 z-40 print:hidden flex flex-col items-end gap-2", children: [
      fabOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FabItem, { label: "Add Price Record", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }), onClick: () => {
          setFabOpen(false);
          setEditingRecord(null);
          setRecordFormOpen(true);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FabItem, { label: "Edit Product", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }), onClick: () => {
          setFabOpen(false);
          setProductFormOpen(true);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FabItem, { label: "Delete Product", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }), tone: "destructive", onClick: () => {
          setFabOpen(false);
          setConfirmDelProduct(true);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFabOpen((v) => !v), className: cn("h-14 w-14 rounded-full grid place-items-center shadow-xl transition-all", "bg-primary text-primary-foreground hover:scale-105", fabOpen && "rotate-45"), "aria-label": "Actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNewProductOpen(true), className: "fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full grid place-items-center shadow-xl bg-primary text-primary-foreground hover:scale-105 transition-all print:hidden", "aria-label": "Add product", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: filterOpen, onOpenChange: setFilterOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "rounded-t-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Filters" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: "Supplier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: supplier, onChange: (e) => setSupplier(e.target.value), className: "h-10 w-full rounded-lg border bg-transparent px-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All suppliers" }),
            (supplierListQuery.data ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => {
            setSupplier("");
            setPreset("all");
          }, children: "Reset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: () => setFilterOpen(false), children: "Apply" })
        ] })
      ] })
    ] }) }),
    lightbox && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] bg-black/90 grid place-items-center p-4", onClick: () => setLightbox(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 grid place-items-center text-white", onClick: () => setLightbox(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
      /\.pdf($|\?)/i.test(lightbox) ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: lightbox, className: "w-full h-full max-w-3xl bg-white rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lightbox, alt: "", className: "max-h-full max-w-full rounded-lg" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductPickerDialog, { open: pickerOpen, onOpenChange: setPickerOpen, onSelect: handleSelect, recent: [] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductFormDialog, { open: productFormOpen, onOpenChange: setProductFormOpen, product, onSaved: (p) => setProduct(p) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductFormDialog, { open: newProductOpen, onOpenChange: setNewProductOpen, product: null, onSaved: (p) => {
      setNewProductOpen(false);
      qc.invalidateQueries({
        queryKey: ["pc-landing-products"]
      });
      qc.invalidateQueries({
        queryKey: ["pc-landing-categories"]
      });
      setProduct(p);
    } }),
    product && /* @__PURE__ */ jsxRuntimeExports.jsx(RecordFormDialog, { open: recordFormOpen, onOpenChange: setRecordFormOpen, productId: product.id, record: editingRecord, onSaved: () => {
      qc.invalidateQueries({
        queryKey: ["price-compare", product.id]
      });
      qc.invalidateQueries({
        queryKey: ["price-compare-suppliers"]
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BarcodeScanner, { open: scanOpen, onOpenChange: setScanOpen, onDetected: (c) => {
      void onScanned(c);
    }, mode: "single", title: "Scan product" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmDelRecord, onOpenChange: (o) => !o && setConfirmDelRecord(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this price record?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => confirmDelRecord && doDeleteRecord(confirmDelRecord), children: "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmDelProduct, onOpenChange: setConfirmDelProduct, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this product?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "All price records for this product will also be removed. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: doDeleteProduct, children: "Delete" })
      ] })
    ] }) })
  ] });
}
const TONES = {
  primary: "bg-primary/10 text-primary",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
};
function StatCard({
  icon,
  label,
  value,
  sub,
  date,
  tone = "primary",
  className
}) {
  const toneClass = TONES[tone] ?? TONES.primary;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-2xl border bg-card p-3 shadow-sm flex flex-col", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-lg grid place-items-center", toneClass), children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium text-muted-foreground uppercase tracking-wide", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-lg font-bold tabular-nums", children: value }),
    (sub || date) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 space-y-0.5", children: [
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-foreground truncate leading-tight", children: sub }),
      date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
        date
      ] })
    ] })
  ] });
}
function MiniPill({
  label,
  value,
  tone
}) {
  const t = tone === "green" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-primary/10 text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-lg px-2 py-1", t), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium uppercase tracking-wide opacity-80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold tabular-nums truncate", children: value })
  ] });
}
function FabItem({
  label,
  icon,
  onClick,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: cn("inline-flex items-center gap-2 rounded-full pl-4 pr-3 py-2 shadow-lg text-sm font-medium border", tone === "destructive" ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card text-foreground hover:bg-accent"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-8 w-8 rounded-full bg-background/20 grid place-items-center", children: icon })
  ] });
}
function LandingView({
  query,
  onQueryChange,
  debouncedQuery,
  category,
  onCategoryChange,
  onSelect,
  onScan,
  onAdd
}) {
  const categoriesQuery = useQuery({
    queryKey: ["pc-landing-categories"],
    queryFn: listCategories,
    staleTime: 5 * 6e4
  });
  const productsQuery = useQuery({
    queryKey: ["pc-landing-products", debouncedQuery, category],
    queryFn: () => searchProducts({
      q: debouncedQuery,
      category,
      limit: 200
    }),
    staleTime: 3e4
  });
  const products = productsQuery.data ?? [];
  const productIds = reactExports.useMemo(() => products.map((p) => p.id), [products]);
  const summariesQuery = useQuery({
    queryKey: ["pc-landing-summaries", productIds],
    enabled: productIds.length > 0,
    queryFn: () => loadProductSummaries(productIds),
    staleTime: 3e4
  });
  const summaries = summariesQuery.data;
  const cats = categoriesQuery.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 pb-8 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground font-semibold", children: "Price Compare" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg sm:text-xl font-bold", children: "Find & compare product prices" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: query, onChange: (e) => onQueryChange(e.target.value), placeholder: "Search by name or barcode…", className: "h-12 pl-9 pr-3 rounded-2xl bg-background/80 border-border/70 shadow-sm text-base" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onScan, className: "h-11 rounded-2xl gap-2 bg-background/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" }),
          "Scan Barcode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onAdd, className: "h-11 rounded-2xl gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Add Product"
        ] })
      ] })
    ] }),
    cats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-1 px-1 flex gap-1.5 overflow-x-auto no-scrollbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryChip, { active: !category, onClick: () => onCategoryChange(null), children: "All" }),
      cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryChip, { active: category === c, onClick: () => onCategoryChange(c), children: c }, c))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: debouncedQuery ? "Results" : category ? category : "All Products" }),
        !productsQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
          products.length,
          " ",
          products.length === 1 ? "item" : "items"
        ] })
      ] }),
      productsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: Array.from({
        length: 5
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 rounded-2xl bg-muted/50 animate-pulse" }, i)) }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { hasQuery: !!debouncedQuery || !!category }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductListCard, { product: p, summary: summaries?.get(p.id), onSelect: () => onSelect(p) }, p.id)) })
    ] })
  ] });
}
function CategoryChip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: cn("shrink-0 text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors", active ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card hover:bg-accent border-border/70"), children });
}
function ProductListCard({
  product,
  summary,
  onSelect
}) {
  const profiles = useProfileMap();
  const lowest = summary?.lowest ?? 0;
  const lowestCompany = summary?.lowestCompany || summary?.lowestMarket || null;
  const lowestDate = summary?.lowestCompanyLastDate ?? "";
  const hasRecords = lowest > 0;
  const latestUserId = summary?.latestUserId;
  const userId = latestUserId || product.user_id;
  const userName = displayProfile(profiles[userId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSelect, className: cn("w-full text-left rounded-2xl border bg-card shadow-sm p-3", "flex items-center gap-3 transition-all", "hover:shadow-md active:scale-[0.995] active:bg-accent/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 shrink-0 rounded-xl bg-muted overflow-hidden grid place-items-center", children: product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: product.name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 h-16 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[13px] leading-tight line-clamp-1 text-foreground", children: product.name }),
      hasRecords ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl leading-none font-bold text-emerald-600 tabular-nums", children: SAR(lowest) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base leading-none font-semibold text-muted-foreground", children: "No price records" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] leading-tight text-muted-foreground truncate inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3 w-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: lowestCompany || "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] leading-tight text-muted-foreground truncate inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lowestDate || "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 flex flex-col justify-start items-end shrink-0 max-w-[110px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] leading-tight font-medium truncate inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 shrink-0 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-muted-foreground", children: userName })
    ] }) })
  ] });
}
function EmptyState({
  hasQuery
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-2 border-dashed bg-card/50 p-8 sm:p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-20 w-20 rounded-full bg-primary/10 grid place-items-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-9 w-9 text-primary/70" }) }),
    hasQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold", children: "No products found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: "Try a different search or add this product using the + button." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold", children: "No products available." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
        "Tap the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground align-middle mx-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) }),
        " button to add your first product."
      ] })
    ] })
  ] });
}
export {
  PriceComparePage as component
};
