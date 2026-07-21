import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, Download, Printer } from "lucide-react";
import {
  INVOICE_PICKER_EVENT,
  shareInvoiceWithFormat,
  downloadInvoiceImage,
  renderInvoiceImageByFormat,
} from "@/lib/invoice-formats";
import { describeThermalExportError, printThermalReceipt } from "@/lib/invoice-print";
import { fetchCustomerVatForSale } from "@/lib/pos-ledger";
import { toast } from "sonner";
import type { InvoicePayload } from "@/lib/invoice-image";

/** Auto-attach customer VAT number from the customer ledger when missing. */
async function withCustomerVat(payload: InvoicePayload): Promise<InvoicePayload> {
  if (payload.partyTaxNo && payload.partyTaxNo.trim()) return payload;
  if (!payload.partyMobile && !(payload as any).partyId) return payload;
  try {
    const vat = await fetchCustomerVatForSale({
      customer_id: (payload as any).partyId ?? null,
      customer_mobile: payload.partyMobile ?? null,
    });
    return vat ? { ...payload, partyTaxNo: vat } : payload;
  } catch { return payload; }
}

type Pending = { payload: InvoicePayload; captionExtra?: string } | null;

// Master template: 88mm thermal receipt. Print == Share == Download.
const FORMAT = "thermal88" as const;

export function InvoiceShareHost() {
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState<"share" | "printed-share" | "img" | "print" | "debug" | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ payload: InvoicePayload; captionExtra?: string }>;
      if (!ce.detail?.payload) return;
      setPending(ce.detail);
    };
    window.addEventListener(INVOICE_PICKER_EVENT, handler as EventListener);
    return () => window.removeEventListener(INVOICE_PICKER_EVENT, handler as EventListener);
  }, []);

  const close = () => { if (!busy) { setPending(null); } };

  const onShare = async () => {
    if (!pending) return;
    setBusy("share");
    try {
      const payload = await withCustomerVat(pending.payload);
      console.log("[InvoiceShare] pre-share debug", {
        invoiceNumber: payload.invoiceNumber,
        customer: payload.partyName,
        items: payload.items?.length ?? 0,
        total: payload.total,
        template: FORMAT,
      });
      await shareInvoiceWithFormat(payload, FORMAT, pending.captionExtra);
    }
    finally { setBusy(null); setPending(null); }
  };

  const onSharePrintedReceipt = async () => {
    if (!pending) return;
    setBusy("printed-share");
    let blob: Blob | null = null;
    try {
      const payload = await withCustomerVat(pending.payload);
      // Use the EXACT same function as Debug Export — no separate capture path.
      try {
        blob = await renderInvoiceImageByFormat(payload, FORMAT);
      } catch (genErr) {
        const d = describeThermalExportError(genErr);
        console.error(`[SHARE] Image generation failed\nFailed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, genErr);
        toast.error(`Image generation failed: ${d.exception}`);
        return;
      }
      if (!blob || blob.size === 0) {
        console.error("[SHARE] Blob creation failed", { blob });
        toast.error("Blob creation failed");
        return;
      }
      console.log("[SHARE] Image generated");
      console.log("[SHARE] Blob size", blob.size, blob.type);

      const fileName = `${payload.kind}_${payload.invoiceNumber}_printed_receipt.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const cap = pending.captionExtra ?? `Invoice #${payload.invoiceNumber}`;
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> };

      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          console.log("[SHARE] Share started");
          await nav.share({ files: [file], text: cap });
          console.log("[SHARE] Share success");
          setPending(null);
          return;
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") { return; }
          console.error("[SHARE] Android share failed", shareErr);
          toast.error(`Android share failed: ${shareErr?.message ?? String(shareErr)}`);
          return;
        }
      }

      // Fallback: download the same blob
      console.log("[SHARE] navigator.share unavailable — falling back to download");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fileName;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      console.log("[SHARE] Share success (download fallback)");
      setPending(null);
    } finally { setBusy(null); }
  };

  const onDownloadImage = async () => {
    if (!pending) return;
    setBusy("img");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadInvoiceImage(payload, FORMAT);
    }
    finally { setBusy(null); }
  };

  const onPrint = async () => {
    if (!pending) return;
    setBusy("print");
    try {
      const payload = await withCustomerVat(pending.payload);
      await printThermalReceipt(payload);
      setPending(null);
    } catch (e) {
      console.error(e);
      toast.error("Could not open print window");
    } finally { setBusy(null); }
  };

  const onDebugExport = async () => {
    if (!pending) return;
    setBusy("debug");
    try {
      const payload = await withCustomerVat(pending.payload);
      console.log("[InvoiceDebug] Debug Export started", { invoiceNumber: payload.invoiceNumber, template: FORMAT });
      const blob = await renderInvoiceImageByFormat(payload, FORMAT);
      console.log("[InvoiceDebug] image generation works — issue is Share API if sharing still fails", { size: blob.size, type: blob.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.kind}_${payload.invoiceNumber}_${FORMAT}_debug.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast.success("Debug Export downloaded — image generation works");
    } catch (e) {
      const d = describeThermalExportError(e);
      console.error(`[InvoiceDebug] FAILED\nFailed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`, e);
      toast.error(`Failed at ${d.functionName}: ${d.exception}`);
    } finally { setBusy(null); }
  };

  return (
    <Dialog open={!!pending} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>🧾 88mm Thermal Receipt</DialogTitle>
          <DialogDescription>
            Print, Share and Download all use the exact same 88mm receipt — what prints on paper is what gets shared.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex flex-col gap-2">
          <Button onClick={onShare} disabled={!!busy} className="w-full gap-2">
            {busy === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Generate &amp; Share
          </Button>
          <Button onClick={onSharePrintedReceipt} disabled={!!busy} variant="secondary" className="w-full gap-2">
            {busy === "printed-share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Share Printed Receipt
          </Button>
          <Button variant="outline" onClick={onDownloadImage} disabled={!!busy} className="w-full gap-2">
            {busy === "img" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Image
          </Button>
          <Button
            variant="secondary"
            onClick={onPrint}
            disabled={!!busy}
            className="w-full gap-2"
            title="Direct 80mm thermal print"
          >
            {busy === "print" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            🖨️ Print Receipt
          </Button>
          <Button
            variant="ghost"
            disabled={!!busy}
            className="w-full gap-2 text-xs"
            title="Generate and download the exact thermal receipt image without opening the Share API."
            onClick={onDebugExport}
          >
            {busy === "debug" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Debug Export
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            Master template: 88mm thermal. Image shares via WhatsApp / Android share sheet.
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
}
