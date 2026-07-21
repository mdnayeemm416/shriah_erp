import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Trash2, RotateCcw, Recycle, ShieldAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type ConfirmTone = "danger" | "warning" | "safe" | "destroy";

export type ConfirmDetail = { label: string; value: ReactNode };

export type ConfirmOptions = {
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
  /** Optional badge above title, e.g. "24 items selected" */
  badge?: string;
  /** Override default icon */
  icon?: "trash" | "warning" | "recycle" | "restore" | "shield";
  /** Optional compact summary rows shown above the action buttons. */
  details?: ConfirmDetail[];
};

type Ctx = (opts: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<Ctx | null>(null);

const TONE_STYLES: Record<ConfirmTone, { iconWrap: string; icon: string; btn: string; badge: string }> = {
  danger: {
    iconWrap: "bg-red-500/10 ring-1 ring-red-500/20",
    icon: "text-red-500",
    btn: "bg-gradient-to-b from-red-500 to-red-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.5)]",
    badge: "bg-red-500/10 text-red-500 ring-1 ring-red-500/20",
  },
  warning: {
    iconWrap: "bg-orange-500/10 ring-1 ring-orange-500/20",
    icon: "text-orange-500",
    btn: "bg-gradient-to-b from-orange-500 to-orange-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(249,115,22,0.5)]",
    badge: "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20",
  },
  safe: {
    iconWrap: "bg-emerald-500/10 ring-1 ring-emerald-500/20",
    icon: "text-emerald-500",
    btn: "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20",
  },
  destroy: {
    iconWrap: "bg-red-600/15 ring-1 ring-red-600/30",
    icon: "text-red-600",
    btn: "bg-gradient-to-b from-red-600 to-red-700 text-white hover:brightness-110 shadow-[0_8px_28px_-6px_rgba(220,38,38,0.6)]",
    badge: "bg-red-600/10 text-red-600 ring-1 ring-red-600/30",
  },
};

function pickIcon(opts: ConfirmOptions) {
  const key = opts.icon ?? (opts.tone === "safe" ? "restore" : opts.tone === "warning" ? "warning" : opts.tone === "destroy" ? "shield" : "trash");
  switch (key) {
    case "restore": return RotateCcw;
    case "warning": return AlertTriangle;
    case "recycle": return Recycle;
    case "shield": return ShieldAlert;
    default: return Trash2;
  }
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({});
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<Ctx>((input) => {
    const next: ConfirmOptions = typeof input === "string" ? { description: input } : input;
    setOpts(next);
    setOpen(true);
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);

  const finish = (v: boolean) => {
    setOpen(false);
    resolver.current?.(v);
    resolver.current = null;
  };

  const tone = opts.tone ?? "danger";
  const t = TONE_STYLES[tone];
  const Icon = pickIcon(opts);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={(o) => { if (!o) finish(false); }}>
        <AlertDialogContent
          className={cn(
            "max-w-[min(92vw,420px)] gap-0 overflow-hidden border-border/40 bg-background/95 p-0 backdrop-blur-xl",
            "rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)]",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          <div className="flex flex-col items-center px-6 pb-2 pt-6 text-center">
            <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-full", t.iconWrap)}>
              <Icon className={cn("h-6 w-6", t.icon)} />
            </div>
            {opts.badge && (
              <span className={cn("mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide", t.badge)}>
                {opts.badge}
              </span>
            )}
            <AlertDialogHeader className="space-y-1.5 text-center sm:text-center">
              <AlertDialogTitle className="text-[17px] font-semibold leading-tight">
                {opts.title ?? (tone === "safe" ? "Confirm action" : tone === "destroy" ? "Delete permanently?" : "Are you sure?")}
              </AlertDialogTitle>
              {opts.description && (
                <AlertDialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
                  {opts.description}
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
          </div>
          {opts.details && opts.details.length > 0 && (
            <div className="mx-5 mb-3 mt-1 overflow-hidden rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm">
              <dl className="divide-y divide-border/40">
                {opts.details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 text-[12px]">
                    <dt className="shrink-0 text-muted-foreground">{d.label}</dt>
                    <dd className="min-w-0 truncate text-right font-medium text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <AlertDialogFooter className="flex-row gap-2 border-t border-border/40 bg-muted/30 p-3 sm:flex-row sm:justify-stretch sm:space-x-0">
            <AlertDialogCancel className="m-0 h-11 flex-1 rounded-xl">
              {opts.cancelText ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => finish(true)}
              className={cn("m-0 h-11 flex-1 rounded-xl border-0 font-semibold transition-transform active:scale-[0.97]", t.btn)}
            >
              {opts.confirmText ?? (tone === "safe" ? "Confirm" : tone === "destroy" ? "Delete forever" : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Ctx {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
