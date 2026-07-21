// Invoice format dispatcher.
//
// • Thermal (80mm) — unified print/share/download pipeline (untouched).
// • A4 Portrait — completely independent module (src/lib/invoice-a4*.ts).
//   Thermal helpers are NOT reused for A4, and A4 helpers are NOT reused
//   for thermal.

import { toast } from "sonner";
import type { InvoicePayload } from "./invoice-image";
import { describeThermalExportError, renderPrintedThermalReceiptImage } from "./invoice-print";
import { renderA4InvoicePdf } from "./invoice-a4-render";

export type InvoiceFormat = "a4" | "thermal88" | "thermal58";

export const INVOICE_FORMAT_LABELS: Record<InvoiceFormat, string> = {
  a4: "A4 Invoice",
  thermal88: "88mm Thermal Receipt",
  thermal58: "58mm Thermal Receipt",
};

const LS_DEFAULT = "invoice.defaultFormat";
const LS_LAST = "invoice.lastFormat";
const BRAND_DEFAULT = "Azzouz WholeSale";

function safeLS(): Storage | null {
  try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; }
}
function readFmt(key: string): InvoiceFormat | null {
  const v = safeLS()?.getItem(key);
  return v === "a4" || v === "thermal88" || v === "thermal58" ? v : null;
}
export function getDefaultInvoiceFormat(): InvoiceFormat {
  return readFmt(LS_DEFAULT) ?? "thermal88";
}
export function setDefaultInvoiceFormat(f: InvoiceFormat) {
  try { safeLS()?.setItem(LS_DEFAULT, f); } catch {}
}
export function getLastInvoiceFormat(): InvoiceFormat {
  return readFmt(LS_LAST) ?? getDefaultInvoiceFormat();
}
export function setLastInvoiceFormat(f: InvoiceFormat) {
  try { safeLS()?.setItem(LS_LAST, f); } catch {}
}

/* ---------------- Dispatcher ---------------- */

export async function renderInvoiceImageByFormat(p: InvoicePayload, _format?: InvoiceFormat): Promise<Blob> {
  // Thermal pipeline (unchanged): single 80mm DOM used by print + share + download.
  console.log("[InvoiceRender] Receipt Source: ThermalReceipt (print DOM)", { note: "Share == Print: single 80mm pipeline" });
  return await renderPrintedThermalReceiptImage(p);
}

export async function renderInvoicePdfA4(p: InvoicePayload): Promise<Blob> {
  // A4 PDF — uses the NEW independent A4 module. Does NOT wrap the thermal PNG.
  console.log("[InvoiceRender] A4 PDF via new independent A4 module");
  return await renderA4InvoicePdf(p);
}



function caption(p: InvoicePayload, extra?: string) {
  return extra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber} — ${p.brand ?? BRAND_DEFAULT}`;
}

export async function shareInvoiceWithFormat(p: InvoicePayload, format: InvoiceFormat, captionExtra?: string) {
  const tag = "[InvoiceShare]";
  let blob: Blob | null = null;
  let file: File | null = null;
  try {
    console.log(`${tag} step=start`, {
      invoiceNumber: p.invoiceNumber,
      kind: p.kind,
      customer: p.partyName,
      format,
      itemCount: p.items?.length ?? 0,
    });

    // Master template: 88mm print DOM → PNG. No alternate share layout.
    const ext = "png";
    const mime = "image/png";
    try {
      console.log(`${tag} step=render-image (thermal88 master)`);
      blob = await renderInvoiceImageByFormat(p, format);
      console.log(`${tag} step=render-image ok`, { size: blob.size, type: blob.type });
    } catch (pngErr: any) {
      const d = describeThermalExportError(pngErr);
      console.error(`${tag} render FAILED\nFailed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, pngErr);
      toast.error(`Failed at ${d.functionName}: ${d.exception}`);
      return;
    }

    // 2) Build file
    try {
      const fileName = `${p.kind}_${p.invoiceNumber}_${format}_${Date.now()}.${ext}`;
      file = new File([blob], fileName, { type: mime });
      console.log(`${tag} step=file-created`, { name: file.name, size: file.size, mime });
    } catch (fileErr: any) {
      const d = describeThermalExportError(fileErr);
      console.error(`${tag} file creation FAILED\nFailed at:\nnew File()\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, fileErr);
      toast.error(`Failed at new File(): ${d.exception}`);
      return;
    }

    const cap = caption(p, captionExtra);
    const nav = navigator as any;
    const canNativeShare = typeof nav.canShare === "function"
      && nav.canShare({ files: [file] })
      && typeof nav.share === "function";
    console.log(`${tag} step=share-check`, {
      canNativeShare,
      hasShare: typeof nav.share === "function",
      hasCanShare: typeof nav.canShare === "function",
    });
    console.log(`${tag} Step 7: Share started`, { functionName: "shareInvoiceWithFormat()", canNativeShare });

    // 3) Native share
    if (canNativeShare) {
      try {
        console.log(`${tag} step=navigator.share opening`, { functionName: "navigator.share()", file: file.name, size: file.size });
        await nav.share({ files: [file], text: cap });
        console.log(`${tag} step=native-share ok`);
        return;
      } catch (shareErr: any) {
        if (shareErr?.name === "AbortError") {
          console.log(`${tag} step=native-share aborted by user`);
          return;
        }
        const d = describeThermalExportError(shareErr);
        console.error(`${tag} native share FAILED\nFailed at:\nnavigator.share()\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, shareErr);
        toast.message(`Share API failed: ${d.exception} — downloading image instead`);
        // fall through to download
      }
    } else {
      console.warn(`${tag} Native Share API not available — downloading instead`);
      toast.message("Native Share not supported — downloading image");
    }

    // 4) Download fallback + WhatsApp web
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      console.log(`${tag} step=download ok`);
      toast.success("Image downloaded — attach it in WhatsApp");
      window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
    } catch (dlErr: any) {
      const d = describeThermalExportError(dlErr);
      console.error(`${tag} download FAILED\nFailed at:\ndownloadFallback()\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, dlErr);
      toast.error(`Failed at downloadFallback(): ${d.exception}`);
    }
  } catch (e: any) {
    if (e?.name === "AbortError") return;
    const d = describeThermalExportError(e);
    console.error(`${tag} FATAL\nFailed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, e);
    toast.error(`Failed at ${d.functionName}: ${d.exception}`);
  }
}

export async function downloadInvoiceImage(p: InvoicePayload, format: InvoiceFormat) {
  const tag = "[InvoiceImage]";
  try {
    console.log(`${tag} step=render format=${format} inv=${p.invoiceNumber}`);
    const blob = await renderInvoiceImageByFormat(p, format);
    console.log(`${tag} step=render ok size=${blob.size}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.kind}_${p.invoiceNumber}_${format}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Image downloaded");
  } catch (e: any) {
    const d = describeThermalExportError(e);
    console.error(`${tag} FAILED\nFailed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, e);
    toast.error(`Failed at ${d.functionName}: ${d.exception}`);
  }
}

export async function downloadInvoicePdf(p: InvoicePayload) {
  const tag = "[InvoicePDF]";
  try {
    console.log(`${tag} step=render inv=${p.invoiceNumber}`);
    const blob = await renderInvoicePdfA4(p);
    console.log(`${tag} step=render ok size=${blob.size}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.kind}_${p.invoiceNumber}.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("PDF downloaded");
  } catch (e: any) {
    console.error(`${tag} FAILED`, e);
    toast.error(`PDF generation failed: ${e?.message ?? e}`);
  }
}

/* ---------------- Imperative open API (event-based, no caller refactor) ---------------- */

export const INVOICE_PICKER_EVENT = "lovable:invoice-share";

export function openInvoiceShare(_payload: InvoicePayload, _captionExtra?: string) {
  // LEGACY (DISABLED) — Thermal invoice UI is locked down until the new invoice system ships.
  console.warn("[InvoiceLockdown] openInvoiceShare blocked — Legacy Invoice System Disabled");
  try { toast.message("Legacy Invoice System Disabled", { description: "Thermal receipts are temporarily unavailable while the new invoice system is being built." }); } catch {}
}
