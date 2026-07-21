import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackClose } from "@/hooks/use-back-close";

type Props = {
  open: boolean;
  url: string | null;
  onClose: () => void;
  alt?: string;
};

/**
 * Fullscreen attachment viewer with zoom, rotate and download.
 * Use for images. PDFs/other files should open in a new tab directly.
 */
export function AttachmentLightbox({ open, url, onClose, alt = "attachment" }: Props) {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  useBackClose(open, (o) => { if (!o) onClose(); });

  useEffect(() => {
    if (!open) return;
    setScale(1);
    setRotate(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === "r") setRotate((r) => (r + 90) % 360);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !url) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-150"
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-white/60">Attachment viewer</span>
        <div className="flex items-center gap-1">
          <IconBtn onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <span className="min-w-[44px] text-center text-xs text-white/70">
            {Math.round(scale * 100)}%
          </span>
          <IconBtn onClick={() => setScale((s) => Math.min(s + 0.25, 4))} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
          <IconBtn onClick={() => setRotate((r) => (r + 90) % 360)} title="Rotate">
            <RotateCw className="h-4 w-4" />
          </IconBtn>
          <a
            href={url}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
          <IconBtn onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      {/* Image */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <img
          src={url}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className={cn("max-h-full max-w-full select-none rounded-lg shadow-2xl transition-transform")}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          draggable={false}
        />
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
    >
      {children}
    </button>
  );
}
