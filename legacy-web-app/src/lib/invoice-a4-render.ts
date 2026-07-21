// ─────────────────────────────────────────────────────────────────────────────
// A4 Invoice render pipeline — fully independent from thermal code.
// Builds an off-screen A4-sized iframe, then exports to PDF / PNG / Print /
// Share. Does NOT call printThermalReceipt, prepareThermalPrintDom, or any
// thermal capture helper.
// ─────────────────────────────────────────────────────────────────────────────

import { toast } from "sonner";
import { buildA4InvoiceHTML, type A4BuildOptions } from "./invoice-a4";
import type { InvoicePayload } from "./invoice-image";

type MountedA4 = {
  iframe: HTMLIFrameElement;
  doc: Document;
  sheet: HTMLElement;
  cleanup: () => void;
};

async function mountA4(p: InvoicePayload, opts: A4BuildOptions = {}, label = "a4"): Promise<MountedA4> {
  const html = buildA4InvoiceHTML(p, opts);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", `A4 Invoice ${label}`);
  iframe.setAttribute("data-receipt-source", "A4Invoice");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "320mm";
  iframe.style.border = "0";
  iframe.style.background = "#fff";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) { iframe.remove(); throw new Error("A4: could not create iframe document"); }
  doc.open(); doc.write(html); doc.close();

  await new Promise<void>((resolve) => {
    if (doc.readyState === "complete") return resolve();
    const onLoad = () => resolve();
    iframe.addEventListener("load", onLoad, { once: true });
    setTimeout(onLoad, 600);
  });

  try { await (doc as any).fonts?.ready; } catch {}
  // Wait for QR image to load
  const imgs = Array.from(doc.querySelectorAll("img"));
  await Promise.all(imgs.map(img =>
    img.complete && (img as HTMLImageElement).naturalWidth > 0
      ? Promise.resolve()
      : new Promise<void>((res) => {
          (img as HTMLImageElement).addEventListener("load", () => res(), { once: true });
          (img as HTMLImageElement).addEventListener("error", () => res(), { once: true });
          setTimeout(res, 1500);
        })
  ));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));

  const sheet = doc.querySelector("#a4-sheet") as HTMLElement | null;
  if (!sheet) { iframe.remove(); throw new Error("A4: .sheet not found"); }
  // Resize iframe to actual rendered height for clean capture
  const rect = sheet.getBoundingClientRect();
  const h = Math.max(rect.height, sheet.scrollHeight, 297 * 3.7795);
  iframe.style.height = `${Math.ceil(h) + 40}px`;

  console.log("[A4Invoice] DOM mounted", { label, width: sheet.scrollWidth, height: sheet.scrollHeight });
  return { iframe, doc, sheet, cleanup: () => iframe.remove() };
}

async function captureA4AsPng(m: MountedA4): Promise<{ blob: Blob; width: number; height: number; dataUrl: string }> {
  const htmlToImage = await import("html-to-image");
  const sheet = m.sheet;
  const width = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width, 794); // 210mm @ 96dpi ≈ 794
  const height = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height, 1123);
  const dataUrl = await htmlToImage.toPng(sheet, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    width,
    height,
    cacheBust: true,
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  console.log("[A4Invoice] PNG captured", { width, height, size: blob.size });
  return { blob, width, height, dataUrl };
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function renderA4InvoicePng(p: InvoicePayload, opts: A4BuildOptions = {}): Promise<Blob> {
  const m = await mountA4(p, opts, "png");
  try { const cap = await captureA4AsPng(m); return cap.blob; }
  finally { m.cleanup(); }
}

export async function renderA4InvoicePdf(p: InvoicePayload, opts: A4BuildOptions = {}): Promise<Blob> {
  const m = await mountA4(p, opts, "pdf");
  try {
    const cap = await captureA4AsPng(m);
    const { default: JsPDF } = await import("jspdf");
    const pdf = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();   // 210
    const pageH = pdf.internal.pageSize.getHeight();  // 297
    const imgRatio = cap.height / cap.width;
    const totalHmm = pageW * imgRatio;
    if (totalHmm <= pageH) {
      pdf.addImage(cap.dataUrl, "PNG", 0, 0, pageW, totalHmm, undefined, "FAST");
    } else {
      // Slice canvas into A4-height chunks to support multi-page.
      const srcImg = await new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image();
        im.onload = () => res(im); im.onerror = () => rej(new Error("A4 page slice image load failed"));
        im.src = cap.dataUrl;
      });
      const pxPerMm = cap.width / pageW;
      const pageHpx = Math.floor(pageH * pxPerMm);
      let y = 0; let pageIdx = 0;
      while (y < cap.height) {
        const sliceH = Math.min(pageHpx, cap.height - y);
        const c = document.createElement("canvas");
        c.width = cap.width; c.height = sliceH;
        const ctx = c.getContext("2d");
        if (!ctx) throw new Error("A4 slice canvas context unavailable");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(srcImg, 0, y, cap.width, sliceH, 0, 0, cap.width, sliceH);
        const sliceUrl = c.toDataURL("image/png");
        const sliceHmm = sliceH / pxPerMm;
        if (pageIdx > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(sliceUrl, "PNG", 0, 0, pageW, sliceHmm, undefined, "FAST");
        y += sliceH; pageIdx++;
      }
    }
    return pdf.output("blob");
  } finally { m.cleanup(); }
}

export async function printA4Invoice(p: InvoicePayload, opts: A4BuildOptions = {}): Promise<void> {
  const m = await mountA4(p, opts, "print");
  setTimeout(() => {
    try {
      m.iframe.contentWindow?.focus();
      m.iframe.contentWindow?.print();
    } catch (e) {
      console.error("[A4Invoice] print failed", e);
      toast.error("Could not open print dialog");
    }
    setTimeout(() => m.cleanup(), 2000);
  }, 120);
}

function captionFor(p: InvoicePayload, extra?: string) {
  return extra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber}`;
}

export async function shareA4Invoice(p: InvoicePayload, captionExtra?: string, opts: A4BuildOptions = {}): Promise<void> {
  try {
    // Prefer PDF for WhatsApp share — best fidelity on A4.
    const blob = await renderA4InvoicePdf(p, opts);
    const fileName = `${p.kind}_${p.invoiceNumber}_A4.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });
    const cap = captionFor(p, captionExtra);
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean; share?: (d: ShareData) => Promise<void> };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try { await nav.share({ files: [file], text: cap }); return; }
      catch (err: any) { if (err?.name === "AbortError") return; console.warn("[A4Invoice] PDF share failed, trying PNG", err); }
    }
    // PNG fallback (some share sheets prefer images)
    const pngBlob = await renderA4InvoicePng(p, opts);
    const pngFile = new File([pngBlob], `${p.kind}_${p.invoiceNumber}_A4.png`, { type: "image/png" });
    if (nav.share && nav.canShare?.({ files: [pngFile] })) {
      try { await nav.share({ files: [pngFile], text: cap }); return; }
      catch (err: any) { if (err?.name === "AbortError") return; console.warn("[A4Invoice] PNG share failed, downloading", err); }
    }
    // Final fallback — download the PDF and open wa.me
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 PDF downloaded — attach in WhatsApp");
    window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
  } catch (e: any) {
    console.error("[A4Invoice] share failed", e);
    toast.error(`A4 share failed: ${e?.message ?? e}`);
  }
}

export async function downloadA4InvoicePdf(p: InvoicePayload, opts: A4BuildOptions = {}): Promise<void> {
  try {
    const blob = await renderA4InvoicePdf(p, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${p.kind}_${p.invoiceNumber}_A4.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 PDF downloaded");
  } catch (e: any) {
    console.error("[A4Invoice] PDF download failed", e);
    toast.error(`A4 PDF failed: ${e?.message ?? e}`);
  }
}

export async function downloadA4InvoicePng(p: InvoicePayload, opts: A4BuildOptions = {}): Promise<void> {
  try {
    const blob = await renderA4InvoicePng(p, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${p.kind}_${p.invoiceNumber}_A4.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 image downloaded");
  } catch (e: any) {
    console.error("[A4Invoice] PNG download failed", e);
    toast.error(`A4 image failed: ${e?.message ?? e}`);
  }
}

// ── Imperative open API (event-based, separate from thermal) ────────────────

export const INVOICE_A4_PICKER_EVENT = "lovable:invoice-a4-share";

export function openA4InvoiceShare(_payload: InvoicePayload, _captionExtra?: string) {
  // LEGACY (DISABLED) — A4 invoice UI is locked down until the new invoice system ships.
  console.warn("[InvoiceLockdown] openA4InvoiceShare blocked — Legacy Invoice System Disabled");
  try { toast.message("Legacy Invoice System Disabled", { description: "A4 invoices are temporarily unavailable while the new invoice system is being built." }); } catch {}
}
