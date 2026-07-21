import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackClose } from "@/hooks/use-back-close";

export type LightboxItem = { url: string; mime?: string | null; label?: string };

type Props = {
  open: boolean;
  items: LightboxItem[];
  startIndex?: number;
  onClose: () => void;
};

/**
 * In-page swipeable image viewer with zoom / rotate / fullscreen.
 * For PDFs falls back to an embedded <iframe>. No external tabs.
 */
export function CfAttachmentLightbox({ open, items, startIndex = 0, onClose }: Props) {
  const [idx, setIdx] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [fs, setFs] = useState(false);
  useBackClose(open, (o) => { if (!o) onClose(); });

  useEffect(() => { if (open) { setIdx(Math.max(0, Math.min(startIndex, items.length - 1))); setScale(1); setRotate(0); } }, [open, startIndex, items.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(items.length - 1, i + 1));
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === "r") setRotate((r) => (r + 90) % 360);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, items.length]);

  if (!open || items.length === 0) return null;
  const cur = items[idx];
  const isPdf = (cur.mime ?? "").includes("pdf") || cur.url.toLowerCase().endsWith(".pdf");

  // Swipe
  let startX = 0;
  const onStart = (e: React.TouchEvent) => { startX = e.touches[0].clientX; };
  const onEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40 && scale === 1) {
      if (dx < 0) setIdx((i) => Math.min(items.length - 1, i + 1));
      else setIdx((i) => Math.max(0, i - 1));
    }
  };

  return (
    <div
      onClick={onClose}
      className={cn("fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-150", fs && "p-0")}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs text-white/60 truncate">{cur.label ?? `Attachment ${idx + 1} / ${items.length}`}</span>
        <div className="flex items-center gap-0.5">
          {!isPdf && <>
            <IconBtn onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))} title="Zoom out"><ZoomOut className="h-4 w-4" /></IconBtn>
            <span className="min-w-[40px] text-center text-xs text-white/70">{Math.round(scale * 100)}%</span>
            <IconBtn onClick={() => setScale((s) => Math.min(s + 0.25, 4))} title="Zoom in"><ZoomIn className="h-4 w-4" /></IconBtn>
            <IconBtn onClick={() => setRotate((r) => (r + 90) % 360)} title="Rotate"><RotateCw className="h-4 w-4" /></IconBtn>
          </>}
          <IconBtn onClick={() => setFs((f) => !f)} title="Fullscreen"><Maximize2 className="h-4 w-4" /></IconBtn>
          <IconBtn onClick={onClose} title="Close"><X className="h-4 w-4" /></IconBtn>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()} onTouchStart={onStart} onTouchEnd={onEnd}>
        {items.length > 1 && idx > 0 && (
          <button onClick={() => setIdx(idx - 1)} className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur hover:bg-white/20">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {items.length > 1 && idx < items.length - 1 && (
          <button onClick={() => setIdx(idx + 1)} className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur hover:bg-white/20">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        {isPdf ? (
          <iframe src={cur.url} title="attachment" className="h-full w-full bg-white" />
        ) : (
          <img
            src={cur.url}
            alt={cur.label ?? "attachment"}
            className="max-h-full max-w-full select-none rounded-lg shadow-2xl transition-transform"
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            draggable={false}
          />
        )}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1 border-t border-white/10 py-2" onClick={(e) => e.stopPropagation()}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === idx ? "w-6 bg-white" : "w-1.5 bg-white/30")} />
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10">
      {children}
    </button>
  );
}
