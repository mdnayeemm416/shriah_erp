import { useEffect, useMemo, useState } from "react";
import { Printer, FileText, Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoreProfile } from "@/hooks/use-store-profile";

// Field definitions (id, label, minimum column width in px)
type FieldId =
  | "image" | "name" | "name_ar" | "barcode" | "sku" | "category" | "brand"
  | "unit" | "supplier" | "purchase_price" | "sale_price" | "stock"
  | "min_stock" | "stock_value" | "location" | "expiry" | "notes"
  | "created_at" | "updated_at";

const FIELDS: { id: FieldId; label: string; align?: "left" | "right" | "center" }[] = [
  { id: "image", label: "Product Image", align: "center" },
  { id: "name", label: "Product Name" },
  { id: "name_ar", label: "Arabic Name" },
  { id: "barcode", label: "Barcode" },
  { id: "sku", label: "SKU" },
  { id: "category", label: "Category" },
  { id: "brand", label: "Brand" },
  { id: "unit", label: "Unit", align: "center" },
  { id: "supplier", label: "Supplier" },
  { id: "purchase_price", label: "Purchase Price", align: "right" },
  { id: "sale_price", label: "Sale Rate", align: "right" },
  { id: "stock", label: "Current Stock", align: "center" },
  { id: "min_stock", label: "Min Stock", align: "center" },
  { id: "stock_value", label: "Stock Value", align: "right" },
  { id: "location", label: "Location" },
  { id: "expiry", label: "Expiry Date", align: "center" },
  { id: "notes", label: "Notes" },
  { id: "created_at", label: "Created", align: "center" },
  { id: "updated_at", label: "Updated", align: "center" },
];

const DEFAULT_FIELDS: FieldId[] = ["name", "barcode", "category", "purchase_price", "sale_price", "stock"];

type PaperSize = "A4" | "A5" | "Letter";
type Orientation = "portrait" | "landscape";

type PrintOptions = {
  showCompany: boolean;
  showTitle: boolean;
  showDateTime: boolean;
  showTotal: boolean;
  repeatHeader: boolean;
  showBorders: boolean;
  altRows: boolean;
};

type Prefs = {
  fields: FieldId[];
  paper: PaperSize;
  orientation: Orientation;
  options: PrintOptions;
  includeOutOfStock: boolean;
};

const STORAGE_KEY = "wh_print_product_list_prefs_v3";

const DEFAULT_PREFS: Prefs = {
  fields: DEFAULT_FIELDS,
  paper: "A4",
  orientation: "portrait",
  options: {
    showCompany: true,
    showTitle: true,
    showDateTime: true,
    showTotal: true,
    repeatHeader: true,
    showBorders: true,
    altRows: true,
  },
  includeOutOfStock: true,
};

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw);
    return {
      fields: Array.isArray(p.fields) && p.fields.length ? p.fields : DEFAULT_PREFS.fields,
      paper: (["A4", "A5", "Letter"].includes(p.paper) ? p.paper : "A4") as PaperSize,
      orientation: (["portrait", "landscape"].includes(p.orientation) ? p.orientation : "portrait") as Orientation,
      options: { ...DEFAULT_PREFS.options, ...(p.options ?? {}) },
      includeOutOfStock: typeof p.includeOutOfStock === "boolean" ? p.includeOutOfStock : true,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(p: Prefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

// Category lookup type
export type PrintProduct = {
  id: string;
  name: string;
  name_ar?: string | null;
  barcode?: string | null;
  item_code?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  price?: number | null;
  purchase_price?: number | null;
  stock?: number | null;
  min_stock?: number | null;
  location?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [k: string]: any;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: PrintProduct[];
  categoryMap?: Map<string, { name: string }>;
};

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function attr(s: unknown): string {
  return esc(s).replace(/`/g, "&#96;");
}

function fmtMoney(n: number | null | undefined): string {
  const v = Number(n ?? 0);
  if (!isFinite(v)) return "—";
  return v.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return "—";
  try { return new Date(s).toLocaleDateString("en-GB"); } catch { return "—"; }
}

function getPageMetrics(prefs: Pick<Prefs, "paper" | "orientation">) {
  const base = prefs.paper === "A5" ? { width: 148, height: 210 } : prefs.paper === "Letter" ? { width: 215.9, height: 279.4 } : { width: 210, height: 297 };
  const width = prefs.orientation === "landscape" ? base.height : base.width;
  const height = prefs.orientation === "landscape" ? base.width : base.height;
  const margin = prefs.paper === "A5" ? 10 : 12;
  const bottomMargin = 18;

  return {
    width,
    height,
    margin,
    bottomMargin,
    contentWidth: width - margin * 2,
    contentHeight: height - margin - bottomMargin,
  };
}

function cellValue(p: PrintProduct, field: FieldId, categoryMap?: Map<string, { name: string }>): string {
  switch (field) {
    case "image": return p.image_url ? `<img class="product-thumb" src="${attr(p.image_url)}" alt="" onerror="this.replaceWith(document.createTextNode('—'))"/>` : "—";
    case "name": return `<strong class="product-name">${esc(p.name || "—")}</strong>`;
    case "name_ar": return esc(p.name_ar || "—");
    case "barcode": return esc(p.barcode || "—");
    case "sku": return esc(p.item_code || "—");
    case "category": return esc((p.category_id && categoryMap?.get(p.category_id)?.name) || "—");
    case "brand": return esc((p as any).brand || "—");
    case "unit": return esc((p as any).unit || "—");
    case "supplier": return esc((p as any).supplier || "—");
    case "purchase_price": return fmtMoney(p.purchase_price);
    case "sale_price": return fmtMoney(p.price);
    case "stock": return String(p.stock ?? 0);
    case "min_stock": return String(p.min_stock ?? 0);
    case "stock_value": return fmtMoney(Number(p.stock ?? 0) * Number(p.purchase_price ?? 0));
    case "location": return esc(p.location || "—");
    case "expiry": return fmtDate((p as any).expiry_date);
    case "notes": return esc(p.description || "—");
    case "created_at": return fmtDate(p.created_at);
    case "updated_at": return fmtDate(p.updated_at);
  }
}

function buildHtml(
  products: PrintProduct[],
  prefs: Prefs,
  companyName: string,
  companyLogo?: string,
  categoryMap?: Map<string, { name: string }>,
): string {
  const selected = FIELDS.filter((f) => prefs.fields.includes(f.id));
  const cols = selected.length;
  const fontSize = cols <= 5 ? 11 : cols <= 8 ? 10 : 9;
  const cellPad = cols <= 8 ? "7px 8px" : "5px 6px";
  const containsImage = selected.some((f) => f.id === "image");
  const pageMetrics = getPageMetrics(prefs);
  const contentHeightMm = pageMetrics.contentHeight;
  const estimatedHeaderMm = companyLogo ? 35 : 27;
  const estimatedFooterMm = 9;
  const estimatedTableHeadMm = 8;
  const estimatedRowMm = containsImage ? 16 : cols >= 10 ? 8 : 7;
  const rowsPerPage = Math.max(
    containsImage ? 3 : 6,
    Math.floor((contentHeightMm - estimatedHeaderMm - estimatedFooterMm - estimatedTableHeadMm) / estimatedRowMm),
  );

  const border = prefs.options.showBorders ? "1px solid #2f2f2f" : "none";
  const widthWeight = (field: FieldId) =>
    field === "image" ? 0.9 :
    field === "stock" || field === "min_stock" || field === "unit" ? 0.7 :
    field === "purchase_price" || field === "sale_price" || field === "stock_value" ? 0.95 :
    field === "name" || field === "name_ar" ? 1.7 :
    field === "notes" ? 1.45 : 1;
  const totalWeight = selected.reduce((sum, f) => sum + widthWeight(f.id), 0) || 1;
  const colgroup = selected
    .map((f) => {
      const width = `${((widthWeight(f.id) / totalWeight) * 100).toFixed(2)}%`;
      return `<col style="width:${width};"/>`;
    })
    .join("");
  const thead = `<thead><tr>${selected
    .map((f) => `<th style="border:${border};padding:${cellPad};text-align:${f.align ?? "left"};">${esc(f.label)}</th>`)
    .join("")}</tr></thead>`;

  const makeRows = (items: PrintProduct[], offset: number) => items
    .map((p, i) => {
      const bg = prefs.options.altRows && i % 2 === 1 ? "background:#fafafa;" : "";
      const tds = selected
        .map((f) => `<td class="cell-${f.id}" style="border:${border};padding:${cellPad};text-align:${f.align ?? "left"};vertical-align:middle;">${cellValue(p, f.id, categoryMap)}</td>`)
        .join("");
      return `<tr data-row="${offset + i + 1}" style="${bg}page-break-inside:avoid;">${tds}</tr>`;
    })
    .join("");

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const dateStr = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;

  const header = `
    <div class="report-header">
      ${prefs.options.showTotal ? `<div class="header-meta header-total">Total Products: ${products.length}</div>` : ""}
      ${prefs.options.showDateTime ? `<div class="header-meta print-date">Printed: ${esc(dateStr)}</div>` : ""}
      ${companyLogo ? `<img class="company-logo" src="${attr(companyLogo)}" alt="Company Logo"/>` : ""}
      ${prefs.options.showCompany ? `<div class="company-name">Azzouz WholeSale</div>` : ""}
      ${prefs.options.showTitle ? `<div class="report-title">Wholesale Product List</div>` : ""}
    </div>`;

  const chunks: PrintProduct[][] = [];
  for (let i = 0; i < products.length; i += rowsPerPage) chunks.push(products.slice(i, i + rowsPerPage));
  if (!chunks.length) chunks.push([]);
  const totalPages = chunks.length;
  const pages = chunks
    .map((chunk, pageIndex) => {
      const bodyRows = chunk.length
        ? makeRows(chunk, pageIndex * rowsPerPage)
        : `<tr><td style="padding:20px;text-align:center;color:#666;" colspan="${Math.max(cols, 1)}">No products to print</td></tr>`;
      return `<section class="catalogue-page">
        ${header}
        <div class="table-wrap"><table>${colgroup}${thead}<tbody>${bodyRows}</tbody></table></div>
        <div class="print-footer"><span>Total Products: ${products.length}</span><span class="center">Page ${pageIndex + 1} of ${totalPages}</span><span class="right">Generated by ShRiAh ERP</span></div>
      </section>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"/>
<title>Wholesale Product List</title>
<style>
  @page { size: ${prefs.paper} ${prefs.orientation}; margin: ${pageMetrics.margin}mm ${pageMetrics.margin}mm ${pageMetrics.bottomMargin}mm ${pageMetrics.margin}mm; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; color:#000; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; background:#fff; }
  body { font-size: ${fontSize}pt; }
  .catalogue-page { min-height:${contentHeightMm}mm; display:flex; flex-direction:column; page-break-after:always; break-after:page; background:#fff; }
  .catalogue-page:last-child { page-break-after:auto; break-after:auto; }
  .table-wrap { flex:1 1 auto; }
  .report-header { position: relative; text-align:center; margin-bottom:12px; padding:0 34mm 10px; border-bottom:1.5px solid #111; min-height:${companyLogo ? "28mm" : "20mm"}; }
  .header-meta { position:absolute; top:1mm; font-size:9pt; color:#222; white-space:nowrap; }
  .header-total { left:0; }
  .print-date { right:0; }
  .company-logo { display:block; width:auto; max-width:30mm; max-height:18mm; object-fit:contain; margin:0 auto 2mm; }
  .company-name { font-size:20pt; font-weight:800; line-height:1.1; letter-spacing:0; }
  .report-title { font-size:13pt; font-weight:700; margin-top:3px; }
  table { width:100%; border-collapse: collapse; table-layout: fixed; }
  thead { display:${prefs.options.repeatHeader ? "table-header-group" : "table-row-group"}; }
  tfoot { display: table-footer-group; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  th { background:#1f1f1f !important; color:#fff !important; font-weight:800; line-height:1.2; }
  td { line-height:1.25; overflow-wrap:anywhere; }
  .product-thumb { width:45px; height:45px; object-fit:cover; border:1px solid #999; display:block; margin:0 auto; }
  .product-name { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-weight:800; }
  ${containsImage ? "tbody tr { min-height:52px; }" : ""}
  .print-footer { margin-top:auto; display:grid; grid-template-columns:1fr 1fr 1fr; align-items:center; font-size:8.5pt; color:#333; border-top:1px solid #999; padding-top:2mm; }
  .print-footer .center { text-align:center; }
  .print-footer .right { text-align:right; }
  @media print {
    html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background:#fff !important; }
  }
</style></head><body>
${pages}
</body></html>`;
}

function printDedicatedDocument(html: string, existingWindow?: Window | null) {
  const waitForImages = async (doc: Document) => {
    const images = Array.from(doc.images);
    await Promise.all(images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }));
  };

  const printWindow = existingWindow ?? window.open("", "_blank", "width=1100,height=900");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    const runPrint = async () => {
      await waitForImages(printWindow.document);
      try { printWindow.focus(); printWindow.print(); } catch {}
    };
    printWindow.addEventListener("afterprint", () => {
      try { printWindow.close(); } catch {}
    });
    if (printWindow.document.readyState === "complete") setTimeout(runPrint, 350);
    else printWindow.addEventListener("load", () => setTimeout(runPrint, 350), { once: true });
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  const win = iframe.contentWindow;
  if (!win) return;
  const trigger = async () => {
    await waitForImages(doc);
    try { win.focus(); win.print(); } catch {}
    setTimeout(() => { try { document.body.removeChild(iframe); } catch {} }, 1500);
  };
  if (doc.readyState === "complete") setTimeout(trigger, 350);
  else win.addEventListener("load", () => setTimeout(trigger, 350), { once: true });
}

async function waitForImages(root: ParentNode) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }));
}

async function createCataloguePdf(html: string, prefs: Prefs) {
  const [{ jsPDF }, html2canvasModule] = await Promise.all([import("jspdf"), import("html2canvas")]);
  const html2canvas = html2canvasModule.default;
  const metrics = getPageMetrics(prefs);
  const pdf = new jsPDF({
    orientation: prefs.orientation,
    unit: "mm",
    format: prefs.paper.toLowerCase(),
    compress: true,
  });

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = `${metrics.contentWidth}mm`;
  container.style.background = "#ffffff";
  container.style.pointerEvents = "none";
  container.innerHTML = `
    ${styleMatch ? `<style>${styleMatch[1]}</style>` : ""}
    <style>.catalogue-page{width:${metrics.contentWidth}mm;min-height:${metrics.contentHeight}mm;}</style>
    ${bodyMatch ? bodyMatch[1] : html}
  `;

  document.body.appendChild(container);
  try {
    if ("fonts" in document) await (document as Document & { fonts: { ready: Promise<void> } }).fonts.ready;
    await waitForImages(container);

    const pages = Array.from(container.querySelectorAll<HTMLElement>(".catalogue-page"));
    const renderPages = pages.length ? pages : [container];

    for (const [index, page] of renderPages.entries()) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight,
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      const imageHeight = Math.min(metrics.contentHeight, (canvas.height * metrics.contentWidth) / Math.max(canvas.width, 1));
      if (index > 0) pdf.addPage();
      pdf.addImage(imageData, "JPEG", metrics.margin, metrics.margin, metrics.contentWidth, imageHeight, undefined, "FAST");
    }
  } finally {
    try { document.body.removeChild(container); } catch {}
  }

  return pdf;
}

export function PrintProductListDialog({ open, onOpenChange, products, categoryMap }: Props) {
  const { profile } = useStoreProfile();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [isPreviewingPdf, setIsPreviewingPdf] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewPrefs, setPreviewPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => { if (open) setPrefs(loadPrefs()); }, [open]);
  useEffect(() => { savePrefs(prefs); }, [prefs]);

  const toggleField = (id: FieldId) => {
    setPrefs((p) => ({ ...p, fields: p.fields.includes(id) ? p.fields.filter((f) => f !== id) : [...p.fields, id] }));
  };

  const selectAll = () => setPrefs((p) => ({ ...p, fields: FIELDS.map((f) => f.id) }));
  const clearAll = () => setPrefs((p) => ({ ...p, fields: [] }));

  // Auto-recommend landscape (advisory only)
  const recommendLandscape = prefs.fields.length >= 7;

  const filteredProducts = useMemo(() => {
    if (prefs.includeOutOfStock) return products;
    return products.filter((p) => Number(p.stock ?? 0) > 0);
  }, [products, prefs.includeOutOfStock]);

  const html = useMemo(
    () => buildHtml(filteredProducts, prefs, profile.name || "", (profile as any).logoDataUrl || (profile as any).logo || "", categoryMap),
    [filteredProducts, prefs, profile, categoryMap],
  );

  const handlePrint = () => {
    if (!prefs.fields.length) return;
    const printWindow = window.open("", "_blank", "width=1100,height=900");
    onOpenChange(false);
    setTimeout(() => printDedicatedDocument(html, printWindow), 150);
  };

  const handlePreviewPdf = () => {
    if (!prefs.fields.length) return;
    setPreviewHtml(html);
    setPreviewPrefs(prefs);
    onOpenChange(false);
    setPreviewOpen(true);
  };

  const handleDownloadPdfFromPreview = async () => {
    if (!previewHtml) return;
    setIsPreviewingPdf(true);
    try {
      const pdf = await createCataloguePdf(previewHtml, previewPrefs);
      const today = new Date().toISOString().slice(0, 10);
      pdf.save(`Wholesale_Product_List_${today}.pdf`);
    } finally {
      setIsPreviewingPdf(false);
    }
  };

  const handlePrintFromPreview = () => {
    if (!previewHtml) return;
    printDedicatedDocument(previewHtml);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden flex flex-col p-0 sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2"><Printer className="h-5 w-5"/> Print Product List</DialogTitle>
          <DialogDescription>
            {filteredProducts.length} of {products.length} products · {prefs.fields.length} field{prefs.fields.length === 1 ? "" : "s"} selected
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 py-2">
            {/* Fields */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Fields to Print</h3>
                <div className="flex gap-1.5">
                  <Button type="button" size="sm" variant="outline" onClick={selectAll}>Select All</Button>
                  <Button type="button" size="sm" variant="outline" onClick={clearAll}>Clear All</Button>
                </div>
              </div>
              <div className="mb-3 rounded-lg border p-3">
                <h4 className="mb-2 text-sm font-semibold">Products Filter</h4>
                <label className="flex cursor-pointer items-center gap-2 text-sm hover:bg-accent">
                  <Checkbox
                    checked={prefs.includeOutOfStock}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, includeOutOfStock: !!v }))}
                  />
                  <span>Include Out of Stock Products</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FIELDS.map((f) => (
                  <label key={f.id} className="flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm hover:bg-accent">
                    <Checkbox checked={prefs.fields.includes(f.id)} onCheckedChange={() => toggleField(f.id)} />
                    <span className="truncate">{f.label}</span>
                  </label>
                ))}
              </div>
            </section>

            <Separator />

            {/* Paper */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold">Paper Size</h3>
                <RadioGroup value={prefs.paper} onValueChange={(v) => setPrefs((p) => ({ ...p, paper: v as PaperSize }))} className="flex gap-4">
                  {(["A4", "A5", "Letter"] as PaperSize[]).map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <RadioGroupItem id={`paper-${s}`} value={s} />
                      <Label htmlFor={`paper-${s}`} className="cursor-pointer">{s}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Orientation</h3>
                <RadioGroup value={prefs.orientation} onValueChange={(v) => setPrefs((p) => ({ ...p, orientation: v as Orientation }))} className="flex gap-4">
                  {(["portrait", "landscape"] as Orientation[]).map((o) => (
                    <div key={o} className="flex items-center gap-2">
                      <RadioGroupItem id={`orient-${o}`} value={o} />
                      <Label htmlFor={`orient-${o}`} className="cursor-pointer capitalize">{o}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {recommendLandscape && prefs.orientation === "portrait" && (
                  <p className="mt-1.5 text-[11px] text-amber-600">Tip: Landscape recommended for {prefs.fields.length} columns.</p>
                )}
              </div>
            </section>

            <Separator />

            {/* Print Options */}
            <section>
              <h3 className="mb-2 text-sm font-semibold">Layout Options</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {([
                  ["showCompany", "Show Company Name"],
                  ["showTitle", "Show Report Title"],
                  ["showDateTime", "Show Print Date & Time"],
                  ["showTotal", "Show Total Products"],
                  ["repeatHeader", "Repeat Table Header on Every Page"],
                  ["showBorders", "Show Grid Borders"],
                  ["altRows", "Alternate Row Colors"],
                ] as [keyof PrintOptions, string][]).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm hover:bg-accent">
                    <Checkbox
                      checked={prefs.options[key]}
                      onCheckedChange={(v) => setPrefs((p) => ({ ...p, options: { ...p.options, [key]: !!v } }))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <Separator />

            {/* Preview */}
            <section>
              <h3 className="mb-2 text-sm font-semibold">Live Preview</h3>
              <div className="overflow-hidden rounded-lg border bg-white">
                <iframe title="preview" srcDoc={html} className="h-[420px] w-full" />
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t bg-muted/30 px-6 py-4 gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handlePrint} disabled={!prefs.fields.length || !filteredProducts.length}>
            <Printer className="mr-1.5 h-4 w-4"/> Print ({filteredProducts.length})
          </Button>
          <Button variant="secondary" onClick={handlePreviewPdf} disabled={!prefs.fields.length || !filteredProducts.length}>
            <FileText className="mr-1.5 h-4 w-4"/> Preview PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className="max-h-[95vh] w-[95vw] sm:max-w-5xl overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-5 pb-2">
          <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Wholesale Product List — Preview</DialogTitle>
          <DialogDescription>Preview the final A4 catalog before printing or downloading.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted/40 p-3">
          <iframe title="pdf-preview" srcDoc={previewHtml} className="h-[70vh] w-full rounded border bg-white" />
        </div>
        <DialogFooter className="border-t bg-muted/30 px-6 py-4 gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setPreviewOpen(false)}>
            <X className="mr-1.5 h-4 w-4"/> Close
          </Button>
          <Button onClick={handlePrintFromPreview}>
            <Printer className="mr-1.5 h-4 w-4"/> Print
          </Button>
          <Button variant="secondary" onClick={handleDownloadPdfFromPreview} disabled={isPreviewingPdf}>
            <Download className="mr-1.5 h-4 w-4"/> {isPreviewingPdf ? "Generating PDF…" : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
