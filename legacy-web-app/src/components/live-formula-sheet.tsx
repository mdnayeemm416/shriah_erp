import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SARAmount } from "@/components/sar-amount";
import { Copy, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type FormulaItem = {
  label: string;
  value: number;
  op?: "+" | "-"; // sign in the equation; default "+"
  muted?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  items: FormulaItem[];
  total: number;
  totalLabel?: string;
  tone?: "success" | "danger" | "neutral";
};

const fmt = (n: number) => Number(n || 0).toFixed(2);

export function LiveFormulaSheet({
  open, onOpenChange, title, subtitle, items, total,
  totalLabel = "Result", tone = "neutral",
}: Props) {
  const buildText = () => {
    const lines = [
      `*${title}*`,
      ...items.map((i) => `${i.op ?? "+"} ${i.label}: SAR ${fmt(i.value)}`),
      `= ${totalLabel}: SAR ${fmt(total)}`,
    ];
    return lines.join("\n");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      toast.success("Formula copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
  };

  const toneClass =
    tone === "success" ? "text-success"
    : tone === "danger" ? "text-destructive"
    : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Live formula
            </span>
            <span className="truncate">{title}</span>
          </SheetTitle>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </SheetHeader>

        <div className="mt-4 space-y-1.5">
          {items.map((i, idx) => {
            const sign = i.op ?? "+";
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5",
                  i.muted && "opacity-60",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      sign === "-" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success",
                    )}
                  >
                    {sign}
                  </span>
                  <span className="truncate text-sm font-medium">{i.label}</span>
                </div>
                <span className="font-mono text-sm tabular-nums">SAR {fmt(i.value)}</span>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No values yet.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            = {totalLabel}
          </span>
          <SARAmount value={total} size="xl" className={toneClass} />
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={copy}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={share}>
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
