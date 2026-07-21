import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Share2, Download, Printer, FileText } from "lucide-react";
import {
  INVOICE_A4_PICKER_EVENT,
  shareA4Invoice,
  printA4Invoice,
  downloadA4InvoicePdf,
  downloadA4InvoicePng,
} from "@/lib/invoice-a4-render";
import { fetchCustomerVatForSale } from "@/lib/pos-ledger";
import type { InvoicePayload } from "@/lib/invoice-image";

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

export function InvoiceA4ShareHost() {
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState<"share" | "print" | "pdf" | "png" | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ payload: InvoicePayload; captionExtra?: string }>;
      if (!ce.detail?.payload) return;
      setPending(ce.detail);
    };
    window.addEventListener(INVOICE_A4_PICKER_EVENT, handler as EventListener);
    return () => window.removeEventListener(INVOICE_A4_PICKER_EVENT, handler as EventListener);
  }, []);

  const close = () => { if (!busy) setPending(null); };

  const onShare = async () => {
    if (!pending) return;
    setBusy("share");
    try {
      const payload = await withCustomerVat(pending.payload);
      await shareA4Invoice(payload, pending.captionExtra);
    } finally { setBusy(null); setPending(null); }
  };

  const onPrint = async () => {
    if (!pending) return;
    setBusy("print");
    try {
      const payload = await withCustomerVat(pending.payload);
      await printA4Invoice(payload);
      setPending(null);
    } finally { setBusy(null); }
  };

  const onPdf = async () => {
    if (!pending) return;
    setBusy("pdf");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadA4InvoicePdf(payload);
    } finally { setBusy(null); }
  };

  const onPng = async () => {
    if (!pending) return;
    setBusy("png");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadA4InvoicePng(payload);
    } finally { setBusy(null); }
  };

  return (
    <Dialog open={!!pending} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>📄 A4 Portrait Invoice</DialogTitle>
          <DialogDescription>
            Professional A4 invoice. Print, share via WhatsApp, or download as PDF / image — all from the same A4 template.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex flex-col gap-2">
          <Button onClick={onShare} disabled={!!busy} className="w-full gap-2">
            {busy === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            Share on WhatsApp
          </Button>
          <Button onClick={onPrint} disabled={!!busy} variant="secondary" className="w-full gap-2">
            {busy === "print" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            Print A4
          </Button>
          <Button onClick={onPdf} disabled={!!busy} variant="outline" className="w-full gap-2">
            {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Download PDF
          </Button>
          <Button onClick={onPng} disabled={!!busy} variant="ghost" className="w-full gap-2">
            {busy === "png" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Image
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            Independent from thermal receipt — A4 portrait pipeline.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
