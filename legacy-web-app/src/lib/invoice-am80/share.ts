// "80mm by AM" — share / download / print orchestrator.

import { toast } from "sonner";
import { buildInvoiceAm80Pdf } from "./pdf";
import { buildInvoiceAm80Png } from "./image";
import { buildInvoiceAm80Node } from "./html";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";

function caption(d: InvoiceV2Data) {
  return `Invoice #${d.invoiceNumber} — ${d.customerName || "Customer"}`;
}

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
      console.warn("[AM80] native share failed, falling back", err);
    }
  }
  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}

/* ---------------------------- Public API ---------------------------- */

export async function downloadAm80Pdf(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Pdf(data);
    triggerDownload(blob, fileName);
    toast.success("PDF downloaded");
  } catch (e: any) {
    console.error("[AM80] pdf download failed", e);
    toast.error(`PDF failed: ${e?.message ?? e}`);
  }
}

export async function shareAm80Pdf(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Pdf(data);
    await shareOrFallback(blob, fileName, "application/pdf", caption(data));
  } catch (e: any) {
    console.error("[AM80] pdf share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}

export async function downloadAm80Image(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    triggerDownload(blob, fileName);
    toast.success("Image downloaded");
  } catch (e: any) {
    console.error("[AM80] image download failed", e);
    toast.error(`Image failed: ${e?.message ?? e}`);
  }
}

export async function shareAm80Image(data: InvoiceV2Data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    await shareOrFallback(blob, fileName, "image/png", caption(data));
  } catch (e: any) {
    console.error("[AM80] image share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}

/**
 * Save & Share flow — targets the customer's WhatsApp chat directly using
 * their mobile number. Tries native share (sends image + text into whichever
 * chat the user picks), and always falls back to downloading the PNG and
 * opening the customer's wa.me chat URL for manual attachment.
 */
export async function shareAm80ImageToCustomer(data: InvoiceV2Data, mobile: string | null | undefined) {
  const { normalizeMobile } = await import("@/lib/whatsapp");
  const digits = normalizeMobile(mobile ?? "");
  if (!digits) {
    toast.error("Customer mobile number not found.");
    return;
  }
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    const cap = caption(data);
    const file = new File([blob], fileName, { type: "image/png" });
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
        console.warn("[AM80] native share failed, opening WhatsApp chat", err);
      }
    }

    // Fallback: download the image and open the customer's WhatsApp chat.
    triggerDownload(blob, fileName);
    toast.success("Invoice downloaded — attach it in WhatsApp");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(cap)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e: any) {
    console.error("[AM80] customer share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}

/**
 * Print only the 80mm receipt — uses a hidden iframe so app UI never shows
 * up in the print output, and applies @page { size: 80mm auto; margin: 0 }
 * for the supported thermal printers.
 */
export async function printAm80(data: InvoiceV2Data) {
  let iframe: HTMLIFrameElement | null = null;
  try {
    const { node } = await buildInvoiceAm80Node(data);
    const html = (node as HTMLElement).outerHTML;
    // Pull node out of its offscreen wrapper so we don't keep two copies live.
    const wrapper = (node as any).__wrapper as HTMLElement | undefined;
    wrapper?.remove();

    iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8" />
<title>Invoice ${data.invoiceNumber}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: 80mm; }
</style>
</head><body>${html}</body></html>`);
    doc.close();

    // Wait for layout + QR <img> to decode inside the iframe.
    await new Promise((r) => setTimeout(r, 400));
    const win = iframe.contentWindow!;
    win.focus();
    win.print();
  } catch (e: any) {
    console.error("[AM80] print failed", e);
    toast.error(`Print failed: ${e?.message ?? e}`);
  } finally {
    setTimeout(() => iframe?.remove(), 2000);
  }
}

/* ------------------------- Event-based opener ------------------------- */

export const INVOICE_AM80_EVENT = "lovable:invoice-am80";

export function openInvoiceAm80(data: InvoiceV2Data) {
  try {
    window.dispatchEvent(new CustomEvent(INVOICE_AM80_EVENT, { detail: data }));
  } catch (e) {
    console.error("[AM80] open failed", e);
  }
}
