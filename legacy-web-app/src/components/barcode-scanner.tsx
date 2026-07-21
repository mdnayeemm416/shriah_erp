import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Flashlight, FlashlightOff, CheckCircle2, Loader2, Keyboard, Camera, Plus, Minus, Trash2, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable fullscreen barcode scanner.
 * - Uses @zxing/browser (loaded lazily) for EAN/UPC/Code128/Code39/QR.
 * - Continuous mode keeps the camera open and debounces repeated reads.
 * - Vibrates + beeps on every successful read.
 * - Manual fallback input is always available.
 */
export type CartPreviewItem = { id: string; name: string; qty: number; image_url?: string | null };
export type CartPreview = {
  items: CartPreviewItem[];
  onInc?: (id: string) => void;
  onDec?: (id: string) => void;
  onRemove?: (id: string) => void;
};

export type BarcodeScannerProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Called for every accepted barcode when no product lookup is supplied. */
  onDetected?: (code: string) => void | Promise<void>;
  /** Optional fresh product lookup for cart scanners. */
  lookupProduct?: (code: string) => Promise<unknown | null>;
  /** Called immediately after a barcode matches a product. */
  onProductScanned?: (product: unknown, code: string) => void;
  /** Called when a barcode is valid but no product exists. */
  onNotFound?: (code: string) => void;
  /** continuous = stay open after each scan. single = close after first scan. */
  mode?: "single" | "continuous";
  title?: string;
  /** Optional status badge (e.g. last-scanned product name + qty). */
  statusBadge?: { label: string; sub?: string } | null;
  /** Floating live cart preview shown over the camera. */
  cartPreview?: CartPreview | null;
};


// Supermarket product barcodes only — QR codes and GS1 Digital Link URLs are ignored.
const SCANNER_FORMATS = [
  "EAN_13", "EAN_8", "UPC_A", "UPC_E", "CODE_128", "CODE_39",
];

// Normalize: strip whitespace + zero-width/control chars.
function normalizeBarcode(code: string): string {
  return (code || "")
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, "")
    .trim();
}

// Accept only 1D supermarket barcodes. Reject QR/URL/GS1 Digital Link/text payloads.
function isProductBarcode(code: string): boolean {
  const v = normalizeBarcode(code);
  if (!v) return false;
  if (/^https?:\/\//i.test(v)) return false;
  if (/[\/\?#=\s]/.test(v)) return false; // URL-ish or whitespace
  // Code39/128 may include letters & a few symbols; EAN/UPC are digits only.
  if (!/^[0-9A-Za-z\-_.$+%]+$/.test(v)) return false;
  if (v.length < 6 || v.length > 32) return false;
  return true;
}

let beepCtx: AudioContext | null = null;
function beep() {
  try {
    beepCtx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = beepCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); }, 90);
  } catch { /* ignore */ }
}

export function BarcodeScanner({
  open, onOpenChange, onDetected, lookupProduct, onProductScanned, onNotFound, mode = "continuous", title = "Scan barcode", statusBadge, cartPreview,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lastCodeRef = useRef<{ code: string; at: number }>({ code: "", at: 0 });
  const lockUntilRef = useRef<number>(0);
  // Stability buffer: candidate code must be seen >=2 frames within 500ms before accepting.
  const candidateRef = useRef<{ code: string; count: number; firstAt: number }>({ code: "", count: 0, firstAt: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [manual, setManual] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [flash, setFlash] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [cartExpanded, setCartExpanded] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);


  const handleHit = async (code: string) => {
    const clean = normalizeBarcode(code);
    if (!clean) return;
    if (!isProductBarcode(clean)) return; // ignore QR/URL/GS1 Digital Link payloads
    const now = Date.now();
    // Global 800ms scan-lock after any accepted read (freeze-frame behavior).
    if (now < lockUntilRef.current) return;
    // Same-code dedupe within 1s — never trigger Not Found twice for the same label.
    if (lastCodeRef.current.code === clean && now - lastCodeRef.current.at < 1000) return;
    lastCodeRef.current = { code: clean, at: now };
    lockUntilRef.current = now + 800;
    console.debug("[barcode-scan]", { scanned: code, normalized: clean, at: now });

    let matched = true;
    if (lookupProduct) {
      const product = await lookupProduct(clean);
      if (!product) {
        matched = false;
        onNotFound?.(clean);
      } else {
        onProductScanned?.(product, clean);
      }
    } else {
      await onDetected?.(clean);
    }
    if (matched) {
      try { navigator.vibrate?.(60); } catch {/* ignore */}
      beep();
      setFlash(true);
      setFrozen(true);
      setTimeout(() => setFlash(false), 250);
      // Resume after 800ms — matches the scan lock.
      setTimeout(() => setFrozen(false), 800);
    }
    if (mode === "single" && matched) onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    setLoading(true);
    setTorchOn(false);
    setTorchSupported(false);

    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const { DecodeHintType, BarcodeFormat } = await import("@zxing/library");
        const allowedFormats = SCANNER_FORMATS.map(f => (BarcodeFormat as any)[f]).filter((v) => v !== undefined);
        const allowedSet = new Set<number>(allowedFormats);
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, allowedFormats);
        hints.set(DecodeHintType.TRY_HARDER, true);
        // Restrict to 1D supermarket barcodes via POSSIBLE_FORMATS hint — QR is never decoded.
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 120 });

        // Pick the back camera if possible.
        const devices = await BrowserMultiFormatReader.listVideoInputDevices().catch(() => []);
        const back = devices.find(d => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];

        // Keep initial constraints minimal/standard — non-standard keys (focusMode) on
        // the initial getUserMedia call cause OverconstrainedError on some Android browsers,
        // which leaves the <video> black. We apply focusMode/zoom AFTER the track starts.
        const videoBase: MediaTrackConstraints = {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        };
        const constraints: MediaStreamConstraints = back?.deviceId
          ? { video: { ...videoBase, deviceId: { exact: back.deviceId } }, audio: false }
          : { video: videoBase, audio: false };

        if (cancelled) return;
        if (!videoRef.current) return;
        const controls = await reader.decodeFromConstraints(constraints, videoRef.current, (result) => {
          if (!result) return;
          // Drop any non-allowed format (e.g. QR) before passing to handler.
          const fmt = (result as any).getBarcodeFormat?.();
          if (fmt != null && !allowedSet.has(fmt)) return;

          // Center-lock: ignore barcodes whose result points fall outside the
          // central horizontal band of the frame. Only the barcode aligned with
          // the green guide should be accepted.
          try {
            const pts = (result as any).getResultPoints?.() as Array<{ getX: () => number; getY: () => number }> | undefined;
            const video = videoRef.current;
            const vw = video?.videoWidth ?? 0;
            const vh = video?.videoHeight ?? 0;
            if (pts && pts.length && vw > 0 && vh > 0) {
              const cx = vw / 2, cy = vh / 2;
              // Accept if mean point lies within central 55% horizontally and 65% vertically.
              const mx = pts.reduce((s, p) => s + p.getX(), 0) / pts.length;
              const my = pts.reduce((s, p) => s + p.getY(), 0) / pts.length;
              if (Math.abs(mx - cx) > vw * 0.275) return;
              if (Math.abs(my - cy) > vh * 0.325) return;
            }
          } catch { /* ignore — fall through */ }

          // Stability: require the same code to appear in >=2 frames within 500ms.
          const text = result.getText();
          const now = Date.now();
          const cand = candidateRef.current;
          if (cand.code === text && now - cand.firstAt < 500) {
            cand.count += 1;
          } else {
            candidateRef.current = { code: text, count: 1, firstAt: now };
            return;
          }
          if (cand.count < 2) return;
          // Reset candidate after acceptance.
          candidateRef.current = { code: "", count: 0, firstAt: 0 };
          handleHit(text);
        });
        if (cancelled) { controls.stop(); return; }
        controlsRef.current = controls;
        streamRef.current = (videoRef.current.srcObject as MediaStream) ?? null;
        // Ensure the preview is actually playing (some browsers don't auto-play after srcObject assign).
        try { await videoRef.current.play?.(); } catch { /* ignore */ }

        // Apply continuous autofocus + modest zoom for small/far barcodes; detect torch.
        try {
          const track = streamRef.current?.getVideoTracks?.()[0];
          const caps = (track?.getCapabilities?.() ?? {}) as any;
          if (caps && "torch" in caps) setTorchSupported(true);
          const advanced: any[] = [];
          if (caps?.focusMode?.includes?.("continuous")) advanced.push({ focusMode: "continuous" });
          if (caps?.zoom) {
            const target = Math.min(caps.zoom.max ?? 1, Math.max(caps.zoom.min ?? 1, 1.8));
            if (target > (caps.zoom.min ?? 1)) advanced.push({ zoom: target });
          }
          if (advanced.length) await track?.applyConstraints({ advanced } as any).catch(() => {});
        } catch {/* ignore */}
        setLoading(false);
      } catch (e: any) {
        if (cancelled) return;
        const name = e?.name ?? "";
        const msg = name === "NotAllowedError"
          ? "Camera permission denied. Enable it in browser settings or use manual entry."
          : name === "NotFoundError"
          ? "No camera found. Use manual entry below."
          : (e?.message ?? "Failed to start camera.");
        setError(msg);
        setLoading(false);
        setShowManual(true);
      }
    })();

    return () => {
      cancelled = true;
      try { controlsRef.current?.stop(); } catch {/* ignore */}
      controlsRef.current = null;
      try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {/* ignore */}
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function toggleTorch() {
    try {
      const track = streamRef.current?.getVideoTracks?.()[0];
      if (!track) return;
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next } as any] });
      setTorchOn(next);
    } catch {
      setTorchSupported(false);
    }
  }

  function submitManual() {
    const v = manual.trim();
    if (!v) return;
    setManual("");
    handleHit(v);
  }

  const overlay = useMemo(() => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-44 w-72 max-w-[80%] rounded-2xl border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-emerald-400" />
        <span className="absolute -left-0.5 -top-0.5 h-5 w-5 rounded-tl-2xl border-l-4 border-t-4 border-emerald-300" />
        <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-tr-2xl border-r-4 border-t-4 border-emerald-300" />
        <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 rounded-bl-2xl border-b-4 border-l-4 border-emerald-300" />
        <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-br-2xl border-b-4 border-r-4 border-emerald-300" />
      </div>
    </div>
  ), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Bottom-sheet override: anchor to bottom, ~45dvh tall, rounded top.
          "left-0 right-0 top-auto bottom-0 translate-x-0 translate-y-0",
          "flex h-[45dvh] max-h-[45dvh] w-screen max-w-none flex-col gap-0 overflow-hidden",
          "rounded-t-3xl rounded-b-none border-0 border-t border-white/10 bg-black p-0 text-white",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:max-w-none",
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {/* Drag handle */}
        <div className="z-10 flex justify-center pt-2">
          <div className="h-1 w-10 rounded-full bg-white/30" />
        </div>

        {/* Top bar */}
        <div className="z-10 flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Camera className="h-4 w-4 text-emerald-400" />
            {title}
          </div>
          <div className="flex items-center gap-1">
            {torchSupported && (
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={toggleTorch}>
                {torchOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setShowManual((v) => !v)} title="Manual entry">
              <Keyboard className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => onOpenChange(false)} title="Close scanner">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Live cart preview — floats above camera, inside sheet */}
        {cartPreview && cartPreview.items.length > 0 && (() => {
          const totalQty = cartPreview.items.reduce((s, i) => s + i.qty, 0);
          return (
            <div className="z-20 mx-3 mb-2 overflow-hidden rounded-xl border border-emerald-400/50 bg-black/70 backdrop-blur">
              <button
                type="button"
                onClick={() => setCartExpanded((v) => !v)}
                className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ShoppingCart className="h-3.5 w-3.5 text-emerald-400" />
                  Cart
                  <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {cartPreview.items.length} items · {totalQty} qty
                  </span>
                </div>
                {cartExpanded ? <ChevronDown className="h-3.5 w-3.5 text-white/70" /> : <ChevronUp className="h-3.5 w-3.5 text-white/70" />}
              </button>
              {cartExpanded && (
                <ul className="max-h-28 divide-y divide-white/10 overflow-y-auto px-2 pb-1.5">
                  {cartPreview.items.slice().reverse().map((it) => (
                    <li key={it.id} className="flex items-center gap-2 py-1">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-medium text-white">{it.name}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-white/10 text-white hover:bg-white/20"
                          onClick={() => cartPreview.onDec?.(it.id)} disabled={!cartPreview.onDec}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="min-w-[1.5rem] text-center text-xs font-semibold text-white">{it.qty}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full bg-white/10 text-white hover:bg-white/20"
                          onClick={() => cartPreview.onInc?.(it.id)} disabled={!cartPreview.onInc}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                          onClick={() => cartPreview.onRemove?.(it.id)} disabled={!cartPreview.onRemove}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })()}

        {/* Camera */}
        <div className="relative flex-1 overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
            autoPlay
          />
          {overlay}
          <div className={cn("pointer-events-none absolute inset-0 bg-emerald-400/30 transition-opacity duration-200", flash ? "opacity-100" : "opacity-0")} />
          {frozen && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="animate-in zoom-in-50 fade-in rounded-full bg-emerald-500/90 p-3 shadow-xl">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/50 text-xs">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              Starting camera…
            </div>
          )}
          {error && (
            <div className="absolute inset-x-3 top-2 z-10 rounded-xl border border-rose-400/50 bg-rose-950/70 p-2 text-[11px] text-rose-100">
              {error}
            </div>
          )}

          {statusBadge && (
            <div className="absolute inset-x-3 bottom-2 z-10 mx-auto max-w-md rounded-lg border border-emerald-400/60 bg-black/70 px-2.5 py-1.5 backdrop-blur">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{statusBadge.label}</p>
                  {statusBadge.sub && <p className="truncate text-[10px] text-emerald-200/90">{statusBadge.sub}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="z-10 space-y-1.5 px-3 pb-3 pt-2">
          {showManual ? (
            <div className="flex items-center gap-1.5">
              <Input
                autoFocus
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitManual(); }}
                placeholder="Enter barcode…"
                className="h-9 flex-1 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50"
              />
              <Button onClick={submitManual} className="h-9 bg-emerald-600 hover:bg-emerald-700">Add</Button>
            </div>
          ) : (
            <Button
              onClick={() => onOpenChange(false)}
              className="h-9 w-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <X className="mr-1.5 h-4 w-4" /> Close Scanner
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
