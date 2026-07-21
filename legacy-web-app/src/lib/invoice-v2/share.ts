// Invoice V2 — share & download helpers (PDF + Image).

import { toast } from "sonner";
import { buildInvoiceV2Pdf } from "./pdf";
import { buildInvoiceV2Png } from "./image";
import type { InvoiceV2Data } from "./types";

function caption(d: InvoiceV2Data) {
  return `Tax Invoice #${d.invoiceNumber} — ${d.customerName || "Customer"}`;
}

/* ----------------------------- PDF ----------------------------- */

export async function downloadInvoiceV2Pdf(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Pdf(data);
    triggerDownload(blob, fileName);
    toast.success("PDF downloaded");
  } catch (e: any) {
    console.error("[InvoiceV2] download pdf failed", e);
    toast.error(`PDF failed: ${e?.message ?? e}`);
  }
}

export async function shareInvoiceV2Pdf(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Pdf(data);
    await shareOrFallback(blob, fileName, "application/pdf", caption(data));
  } catch (e: any) {
    console.error("[InvoiceV2] share pdf failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}

/* ---------------------------- Image ---------------------------- */

export async function downloadInvoiceV2Image(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Png(data);
    triggerDownload(blob, fileName);
    toast.success("Image downloaded");
  } catch (e: any) {
    console.error("[InvoiceV2] download image failed", e);
    toast.error(`Image failed: ${e?.message ?? e}`);
  }
}

export async function shareInvoiceV2Image(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Png(data);
    await shareOrFallback(blob, fileName, "image/png", caption(data));
  } catch (e: any) {
    console.error("[InvoiceV2] share image failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}

/* --------------------------- helpers --------------------------- */

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function shareOrFallback(blob: Blob, fileName: string, mime: string, cap: string) {
  const file = new File([blob], fileName, { type: mime });
  const nav = navigator as any;
  const canNativeShare =
    typeof nav.canShare === "function" &&
    nav.canShare({ files: [file] }) &&
    typeof nav.share === "function";

  if (canNativeShare) {
    try {
      await nav.share({ files: [file], text: cap, title: cap });
      return;
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.warn("[InvoiceV2] native share failed, falling back", err);
    }
  }

  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}

/* ----------------- Event-based opener (unchanged) ---------------- */

export const INVOICE_V2_EVENT = "lovable:invoice-v2";

export function openInvoiceV2(data: InvoiceV2Data) {
  try {
    window.dispatchEvent(new CustomEvent(INVOICE_V2_EVENT, { detail: data }));
  } catch (e) {
    console.error("[InvoiceV2] open failed", e);
  }
}
