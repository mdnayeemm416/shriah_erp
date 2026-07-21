// "80mm by AM" — host modal. Listens for the AM80 event and shows the four
// thermal actions (Print, PDF, Image, Share). No preview rendered to keep
// it lightweight on mobile; the receipt is generated on demand per action.

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Image as ImageIcon, Share2, X } from "lucide-react";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";
import {
  INVOICE_AM80_EVENT,
  downloadAm80Image,
  downloadAm80Pdf,
  printAm80,
  shareAm80Image,
  shareAm80Pdf,
} from "@/lib/invoice-am80/share";

export function InvoiceAm80Host() {
  const [data, setData] = useState<InvoiceV2Data | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => setData((e as CustomEvent).detail as InvoiceV2Data);
    window.addEventListener(INVOICE_AM80_EVENT, handler as any);
    return () => window.removeEventListener(INVOICE_AM80_EVENT, handler as any);
  }, []);

  const wrap = (key: string, fn: () => Promise<void>) => async () => {
    setBusy(key);
    try { await fn(); } finally { setBusy(null); }
  };

  if (!data) return null;

  return (
    <Dialog open={!!data} onOpenChange={(o) => !o && setData(null)}>
      <DialogContent className="max-w-sm gap-3 p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center justify-between text-base">
            <span>80mm by AM — #{data.invoiceNumber}</span>
            <button onClick={() => setData(null)} aria-label="Close" className="rounded p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          <Button disabled={!!busy} onClick={wrap("print", () => printAm80(data))}>
            <Printer className="mr-1 h-4 w-4" /> {busy === "print" ? "…" : "Print"}
          </Button>
          <Button variant="outline" disabled={!!busy} onClick={wrap("pdf", () => downloadAm80Pdf(data))}>
            <FileText className="mr-1 h-4 w-4" /> {busy === "pdf" ? "…" : "PDF"}
          </Button>
          <Button variant="outline" disabled={!!busy} onClick={wrap("img", () => downloadAm80Image(data))}>
            <ImageIcon className="mr-1 h-4 w-4" /> {busy === "img" ? "…" : "Image"}
          </Button>
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={!!busy}
            onClick={wrap("share-img", () => shareAm80Image(data))}
          >
            <Share2 className="mr-1 h-4 w-4" /> {busy === "share-img" ? "…" : "Share Image"}
          </Button>
          <Button
            variant="outline"
            className="col-span-2"
            disabled={!!busy}
            onClick={wrap("share-pdf", () => shareAm80Pdf(data))}
          >
            <Share2 className="mr-1 h-4 w-4" /> {busy === "share-pdf" ? "…" : "Share PDF"}
          </Button>
        </div>

        <p className="border-t border-border bg-muted/40 px-4 py-2 text-center text-[11px] text-muted-foreground">
          Optimized for Epson TM-T20II / T20III, XPrinter, Sunmi (80mm).
        </p>
      </DialogContent>
    </Dialog>
  );
}
