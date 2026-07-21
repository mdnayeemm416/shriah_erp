// Premium share preview modal — shows the rendered image first, then offers
// Download / WhatsApp / Copy actions instead of auto-downloading.

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, MessageCircle, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AiShareModal({
  open, onOpenChange, dataUrl, filename, caption,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dataUrl: string | null;
  filename: string;
  caption: string;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!open) setCopied(false); }, [open]);

  async function handleDownload() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    toast.success("Image downloaded");
  }

  async function handleWhatsApp() {
    if (!dataUrl) return;
    setBusy(true);
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      const nav: any = navigator;
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], title: "AI Insight", text: caption });
        return;
      }
      window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
    } finally { setBusy(false); }
  }

  async function handleCopy() {
    if (!dataUrl) return;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const CI = (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem;
      if (!CI) throw new Error("Clipboard image not supported");
      await navigator.clipboard.write([new CI({ "image/png": blob })]);
      setCopied(true); toast.success("Image copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      await navigator.clipboard.writeText(caption);
      toast.success("Caption copied");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Share AI Insight</DialogTitle>
        <div className="bg-gradient-to-br from-primary/15 via-background to-background px-4 pb-2 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">Share Preview</p>
          <h3 className="font-display text-base font-bold">AI Insight</h3>
        </div>
        <div className="max-h-[55vh] overflow-y-auto bg-muted/30 p-3">
          {dataUrl ? (
            <img loading="lazy" decoding="async" src={dataUrl} alt="Share preview" className="w-full rounded-xl border border-border/40 shadow-sm" />
          ) : (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-border/50 p-3">
          <Button variant="outline" onClick={handleDownload} disabled={!dataUrl || busy}>
            <Download className="h-4 w-4" /> Save
          </Button>
          <Button onClick={handleWhatsApp} disabled={!dataUrl || busy}
            className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={!dataUrl || busy}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
