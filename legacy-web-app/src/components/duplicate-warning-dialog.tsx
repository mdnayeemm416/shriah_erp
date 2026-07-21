import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export type DuplicateWarningKind = "hard" | "soft";

export type DuplicateDetails = {
  date?: string;
  shop?: string;
  cashier?: string;
  amount?: string;
  entryType?: string; // "Sale" | "Purchase" | ...
};

type Props = {
  open: boolean;
  kind: DuplicateWarningKind;
  /** Existing duplicate entry */
  existing?: { id: string; label?: string } | null;
  /** Structured details to display in the warning */
  details?: DuplicateDetails | null;
  /** When true, action is logged as admin override */
  isAdmin?: boolean;
  /** Continue with save anyway (available to everyone) */
  onContinue?: () => void;
  /** Legacy admin-only override handler — falls back to onContinue when not provided */
  onConfirmOverride?: () => void;
  onViewExisting?: () => void;
  onCancel: () => void;
};

export function DuplicateWarningDialog({
  open, kind, existing, details, isAdmin, onConfirmOverride, onContinue, onViewExisting, onCancel,
}: Props) {
  const isHard = kind === "hard";
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      // Default focus → Cancel
      const t = setTimeout(() => cancelRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleContinue = () => {
    if (isAdmin && onConfirmOverride) return onConfirmOverride();
    onContinue?.();
  };

  const titleText = isHard
    ? `Duplicate ${details?.entryType ?? "Entry"} Detected`
    : "Possible Duplicate Withdraw";

  const detailRows: { label: string; value?: string }[] = [
    { label: "Date", value: details?.date },
    { label: "Shop", value: details?.shop },
    { label: "Cashier", value: details?.cashier },
    { label: "Amount", value: details?.amount },
  ].filter((r) => !!r.value);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent
        className={cn(
          "max-w-md gap-0 overflow-hidden p-0 border-2",
          "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-screen max-sm:max-w-none max-sm:rounded-none max-sm:border-0",
          isHard ? "border-destructive" : "border-amber-500",
        )}
      >
        <div
          className={cn(
            "flex items-start gap-3 px-5 py-4 text-white",
            isHard ? "bg-destructive" : "bg-amber-500",
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            {isHard ? <ShieldAlert className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold leading-tight">
              ⚠ {titleText.toUpperCase()}
            </h2>
            <p className="mt-0.5 text-xs opacity-90">
              {isHard ? "Verify before creating another entry" : "Please verify before continuing"}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 px-5 py-5 max-sm:overflow-y-auto">
          <div className="space-y-3 text-sm">
            <p className="text-foreground">
              A <span className="font-semibold">{details?.entryType ?? "matching"} entry</span> already
              exists for this shop and date.
            </p>
            <p className="text-muted-foreground">
              Creating multiple {details?.entryType?.toLowerCase() ?? "duplicate"} entries may cause
              incorrect financial calculations.
            </p>

            {detailRows.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Existing entry
                </p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {detailRows.map((r) => (
                    <div key={r.label} className="contents">
                      <dt className="text-muted-foreground">{r.label}</dt>
                      <dd className="text-right font-medium">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {isHard && isAdmin && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-[11px] text-muted-foreground">
                Admin override will be recorded in the audit log.
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col-reverse gap-2 border-t border-border bg-muted/30 px-5 py-3 sm:flex-row sm:justify-end",
            "max-sm:sticky max-sm:bottom-0",
          )}
        >
          <Button ref={cancelRef} variant="outline" size="lg" className="sm:size-default" onClick={onCancel}>
            Cancel
          </Button>
          {existing && onViewExisting && (
            <Button variant="secondary" size="lg" className="sm:size-default" onClick={onViewExisting}>
              <Eye className="mr-1.5 h-4 w-4" /> View Existing
            </Button>
          )}
          {(onContinue || onConfirmOverride) && (
            <Button
              size="lg"
              className={cn(
                "sm:size-default text-white",
                isHard
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-amber-500 hover:bg-amber-600",
              )}
              onClick={handleContinue}
            >
              Create Anyway
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
