// Sales Return Invoice — share/download/print helpers.
import { toast } from "sonner";
import { buildSalesReturnInvoicePng } from "./image";
import { buildSalesReturnInvoicePdf } from "./pdf";
import { buildSalesReturnInvoiceThermalPng } from "./thermal";
import { fetchSalesReturnInvoice } from "./from-db";
import type { SalesReturnInvoiceData } from "./types";

export const SALES_RETURN_INVOICE_EVENT = "lovable:sales-return-invoice";

export function openSalesReturnInvoice(input: string | SalesReturnInvoiceData) {
  try {
    window.dispatchEvent(new CustomEvent(SALES_RETURN_INVOICE_EVENT, { detail: input }));
  } catch (e) {
    console.error("[SalesReturnInvoice] open failed", e);
  }
}

function caption(d: SalesReturnInvoiceData) {
  return `Sales Return ${d.returnNumber} — ${d.customerName || "Customer"} · SAR ${d.totalReturnValue.toFixed(2)}`;
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = fileName;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function shareOrFallback(blob: Blob, fileName: string, mime: string, cap: string) {
  const file = new File([blob], fileName, { type: mime });
  const nav = navigator as any;
  if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && typeof nav.share === "function") {
    try { await nav.share({ files: [file], text: cap, title: cap }); return; }
    catch (err: any) { if (err?.name === "AbortError") return; }
  }
  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}

export async function resolveReturnData(input: string | SalesReturnInvoiceData): Promise<SalesReturnInvoiceData> {
  return typeof input === "string" ? await fetchSalesReturnInvoice(input) : input;
}

export async function downloadSalesReturnPdf(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoicePdf(d); triggerDownload(blob, fileName); toast.success("PDF downloaded"); }
  catch (e: any) { toast.error(`PDF failed: ${e?.message ?? e}`); }
}
export async function shareSalesReturnPdf(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoicePdf(d); await shareOrFallback(blob, fileName, "application/pdf", caption(d)); }
  catch (e: any) { toast.error(`Share failed: ${e?.message ?? e}`); }
}
export async function downloadSalesReturnA4Image(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoicePng(d); triggerDownload(blob, fileName); toast.success("Image downloaded"); }
  catch (e: any) { toast.error(`Image failed: ${e?.message ?? e}`); }
}
export async function shareSalesReturnA4Image(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoicePng(d); await shareOrFallback(blob, fileName, "image/png", caption(d)); }
  catch (e: any) { toast.error(`Share failed: ${e?.message ?? e}`); }
}
export async function downloadSalesReturnThermalImage(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoiceThermalPng(d); triggerDownload(blob, fileName); toast.success("80mm image downloaded"); }
  catch (e: any) { toast.error(`80mm failed: ${e?.message ?? e}`); }
}
export async function shareSalesReturnThermalImage(d: SalesReturnInvoiceData) {
  try { const { blob, fileName } = await buildSalesReturnInvoiceThermalPng(d); await shareOrFallback(blob, fileName, "image/png", caption(d)); }
  catch (e: any) { toast.error(`Share failed: ${e?.message ?? e}`); }
}

export async function printSalesReturnInvoice(d: SalesReturnInvoiceData) {
  try {
    const { dataUrl } = await buildSalesReturnInvoicePng(d);
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) { toast.error("Popup blocked"); return; }
    w.document.write(`<!doctype html><html><head><title>${d.returnNumber}</title>
      <style>@page{size:A4;margin:8mm;} body{margin:0;} img{width:100%;display:block;}</style>
      </head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.focus();window.print();},200)"/></body></html>`);
    w.document.close();
  } catch (e: any) {
    toast.error(`Print failed: ${e?.message ?? e}`);
  }
}
