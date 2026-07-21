// Invoice V2 — action sheet. No preview. Four actions only.

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Download, Loader2, Image as ImageIcon } from "lucide-react";
import {
  INVOICE_V2_EVENT,
  downloadInvoiceV2Pdf,
  shareInvoiceV2Pdf,
  downloadInvoiceV2Image,
  shareInvoiceV2Image,
} from "@/lib/invoice-v2/share";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";

export function InvoiceV2Host() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<InvoiceV2Data | null>(null);
  const [busy, setBusy] = useState<null | "pdf-d" | "pdf-s" | "img-d" | "img-s">(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<InvoiceV2Data>).detail;
      if (!detail) return;
      setData(detail);
      setOpen(true);
    };
    window.addEventListener(INVOICE_V2_EVENT, onOpen as any);
    return () => window.removeEventListener(INVOICE_V2_EVENT, onOpen as any);
  }, []);

  async function run(kind: NonNullable<typeof busy>, fn: () => Promise<void>) {
    if (!data) return;
    setBusy(kind);
    try { await fn(); } finally { setBusy(null); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Invoice V2 — #{data?.invoiceNumber ?? "—"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 p-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => run("pdf-d", () => downloadInvoiceV2Pdf(data!))}
            disabled={!!busy || !data}
          >
            {busy === "pdf-d" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Download className="mr-1 h-4 w-4" />}
            PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => run("img-d", () => downloadInvoiceV2Image(data!))}
            disabled={!!busy || !data}
          >
            {busy === "img-d" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-1 h-4 w-4" />}
            Image
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => run("img-s", () => shareInvoiceV2Image(data!))}
            disabled={!!busy || !data}
          >
            {busy === "img-s" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Share2 className="mr-1 h-4 w-4" />}
            Share Image
          </Button>
          <Button
            size="sm"
            className="bg-emerald-700 text-white hover:bg-emerald-800"
            onClick={() => run("pdf-s", () => shareInvoiceV2Pdf(data!))}
            disabled={!!busy || !data}
          >
            {busy === "pdf-s" ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Share2 className="mr-1 h-4 w-4" />}
            Share PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
