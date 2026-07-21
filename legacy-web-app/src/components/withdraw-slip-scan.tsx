import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Upload, Loader2, ScanLine, Paperclip, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { scanSlip } from "@/lib/slip-scan.functions";

export type SlipResult = {
  slip_type?: "atm" | "pos" | "unknown";
  amount?: number | null;
  date?: string | null;
  time?: string | null;
  bank_name?: string | null;
  merchant_name?: string | null;
  confidence?: "low" | "medium" | "high";
  fallback?: boolean;
  reason?: string;
};


type Props = {
  onApply: (data: {
    amount: number;
    date?: string | null;
    note: string;
    file: File;
  }) => void;
};

// Compress image client-side: max 1024px long edge, JPEG q=0.72.
// Smaller payload → faster OCR + faster upload on mobile networks.
async function compressImage(file: File, maxEdge = 1024, quality = 0.72): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob) return file;
    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

function fileToDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });
}

export function WithdrawSlipScan({ onApply }: Props) {
  const run = useServerFn(scanSlip);
  const camRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [attached, setAttached] = useState<{ name: string; size: number } | null>(null);
  const [needsEdit, setNeedsEdit] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.files?.[0];
    e.target.value = "";
    if (!raw) return;
    if (!raw.type.startsWith("image/")) {
      toast.error("Please select an image of the slip.");
      return;
    }

    setBusy(true);
    setNeedsEdit(false);

    // 1) Compress first — small file always attaches even if OCR fails.
    const small = await compressImage(raw);

    // 2) Always auto-attach the image immediately (failsafe).
    setAttached({ name: small.name, size: small.size });
    setPendingFile(small);

    try {
      const dataUrl = await fileToDataUrl(small);
      const r = (await run({
        data: { imageDataUrl: dataUrl, mimeType: small.type },
      })) as SlipResult;

      if (r?.fallback) {
        // OCR unavailable — silently fall back to manual entry. No red error.
        setNeedsEdit(true);
        setBusy(false);
        return;
      }

      const amtRaw = r.amount != null ? Number(r.amount) : NaN;
      // Decimal rule: always round down to integer SAR (575.25 → 575).
      const amt = Number.isFinite(amtRaw) ? Math.floor(amtRaw) : NaN;
      const who =
        (r.slip_type === "pos" ? r.merchant_name : r.bank_name) ??
        r.bank_name ??
        r.merchant_name ??
        "";
      const note = r.slip_type === "pos"
        ? `POS Slip${who ? " - " + who : ""}`
        : `Cash Withdraw${who ? " - " + who : ""}`;

      if (Number.isFinite(amt) && amt > 0) {
        onApply({ amount: amt, date: r.date ?? null, note, file: small });
        toast.success("Slip scanned");
        setPendingFile(null);
      } else {
        // OCR couldn't read amount — keep attachment, let user type it.
        setNeedsEdit(true);
      }
    } catch (err: any) {
      // Failsafe: attachment stays, user types amount manually. No red error.
      setNeedsEdit(true);
    } finally {
      setBusy(false);
    }
  }


  function applyManual() {
    if (!pendingFile) return;
    const amt = Math.floor(Number(editAmount));
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    onApply({ amount: amt, date: null, note: "Cash Withdraw", file: pendingFile });
    setPendingFile(null);
    setNeedsEdit(false);
    setEditAmount("");
    toast.success("Slip applied");
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
      <div className="mb-2 flex items-center gap-1.5">
        <ScanLine className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Scan Slip
        </span>
        {!busy && attached && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-600">
            <Paperclip className="h-3 w-3" />
            Attached
          </span>
        )}
      </div>

      {busy ? (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="font-display text-base font-semibold tracking-tight text-foreground">
            Scanning Slip…
          </p>
          <p className="text-[11px] text-muted-foreground">Reading amount &amp; bank</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => camRef.current?.click()}
          >
            <Camera className="mr-1 h-4 w-4" /> Camera
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => imgRef.current?.click()}
          >
            <Upload className="mr-1 h-4 w-4" /> Upload
          </Button>
        </div>
      )}

      <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
      <input ref={imgRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPick} />

      {needsEdit && pendingFile && (
        <div className="mt-2.5 space-y-2 rounded-lg border border-amber-500/40 bg-amber-50/40 p-2 dark:bg-amber-950/20">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
            <Pencil className="h-3 w-3" />
            Couldn't read amount — enter it manually
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="sr-only">Amount</Label>
              <Input
                type="number"
                inputMode="numeric"
                step="1"
                placeholder="Amount (SAR)"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value.replace(/\D/g, ""))}
                className="h-9"
              />
            </div>
            <Button type="button" size="sm" onClick={applyManual}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
