// Sales Return Invoice — host modal. Listens for the event, resolves data
// (accepts either an id or a full payload), and offers Print / PDF / Image /
// 80mm / WhatsApp Share actions.

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, FileText, Image as ImageIcon, Share2, Undo2 } from "lucide-react";
import {
  SALES_RETURN_INVOICE_EVENT,
  resolveReturnData,
  downloadSalesReturnPdf,
  shareSalesReturnPdf,
  downloadSalesReturnA4Image,
  shareSalesReturnA4Image,
  downloadSalesReturnThermalImage,
  shareSalesReturnThermalImage,
  printSalesReturnInvoice,
} from "@/lib/sales-return-invoice/share";
import type { SalesReturnInvoiceData } from "@/lib/sales-return-invoice/types";

export function SalesReturnInvoiceHost() {
  const [data, setData] = useState<SalesReturnInvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setLoading(true);
      setData(null);
      try {
        const d = await resolveReturnData(detail);
        setData(d);
      } catch (err: any) {
        console.error("[SalesReturnInvoice] load failed", err);
      } finally {
        setLoading(false);
      }
    };
    window.addEventListener(SALES_RETURN_INVOICE_EVENT, handler as any);
    return () => window.removeEventListener(SALES_RETURN_INVOICE_EVENT, handler as any);
  }, []);

  const open = loading || !!data;
  const wrap = (key: string, fn: () => Promise<void>) => async () => {
    setBusy(key); try { await fn(); } finally { setBusy(null); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setData(null)}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-rose-600 px-4 py-3 text-white">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Undo2 className="h-4 w-4" /> Sales Return Invoice
            {data && <span className="ml-auto text-xs font-mono">{data.returnNumber}</span>}
          </DialogTitle>
        </DialogHeader>

        {loading || !data ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <>
            <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs">
              <div className="flex justify-between">
                <span>Original</span>
                <b>INV-{data.originalInvoiceNumber ?? "—"}</b>
              </div>
              <div className="flex justify-between">
                <span>Customer</span>
                <b className="max-w-[60%] truncate text-right">{data.customerName}</b>
              </div>
              <div className="flex justify-between">
                <span>Return Value</span>
                <b className="text-rose-700">SAR {data.totalReturnValue.toFixed(2)}</b>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3">
              <Button size="sm" disabled={!!busy} onClick={wrap("print", () => printSalesReturnInvoice(data))}>
                <Printer className="mr-1 h-4 w-4" /> {busy === "print" ? "…" : "Print"}
              </Button>
              <Button size="sm" variant="outline" disabled={!!busy} onClick={wrap("pdf", () => downloadSalesReturnPdf(data))}>
                <FileText className="mr-1 h-4 w-4" /> {busy === "pdf" ? "…" : "PDF"}
              </Button>
              <Button size="sm" variant="outline" disabled={!!busy} onClick={wrap("a4img", () => downloadSalesReturnA4Image(data))}>
                <ImageIcon className="mr-1 h-4 w-4" /> {busy === "a4img" ? "…" : "A4 Image"}
              </Button>
              <Button size="sm" variant="outline" disabled={!!busy} onClick={wrap("thermal", () => downloadSalesReturnThermalImage(data))}>
                <ImageIcon className="mr-1 h-4 w-4" /> {busy === "thermal" ? "…" : "80mm"}
              </Button>
              <Button
                size="sm"
                className="col-span-2 bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={!!busy}
                onClick={wrap("share-img", () => shareSalesReturnA4Image(data))}
              >
                <Share2 className="mr-1 h-4 w-4" /> {busy === "share-img" ? "…" : "WhatsApp / Share Image"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="col-span-2"
                disabled={!!busy}
                onClick={wrap("share-pdf", () => shareSalesReturnPdf(data))}
              >
                <Share2 className="mr-1 h-4 w-4" /> {busy === "share-pdf" ? "…" : "Share PDF"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="col-span-2"
                disabled={!!busy}
                onClick={wrap("share-thermal", () => shareSalesReturnThermalImage(data))}
              >
                <Share2 className="mr-1 h-4 w-4" /> {busy === "share-thermal" ? "…" : "Share 80mm"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
