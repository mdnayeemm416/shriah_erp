// AI Comparison card — side-by-side rows with winner highlighting.

import { Sparkles, Trophy, Share2 } from "lucide-react";
import { SAR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CompareResult } from "@/lib/ai-compare";

export function AiCompareCard({
  r, onShare,
}: { r: CompareResult; onShare?: () => void }) {
  const totalA = r.rows.reduce((a, x) => a + x.a, 0);
  const totalB = r.rows.reduce((a, x) => a + x.b, 0);
  const diff = r.headline.a - r.headline.b;
  const pct = Math.abs(r.headline.b > 0 ? (diff / r.headline.b) * 100 : 0);

  return (
    <div className="m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
        <Sparkles className="h-3 w-3" /> AI Compare · {r.kind}
      </div>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{r.dateLabel}</p>

      {/* Headline winner banner */}
      <div className={cn(
        "mt-2 flex items-center gap-2 rounded-xl border px-3 py-2",
        r.winner === "tie"
          ? "border-border/60 bg-muted/40"
          : "border-amber-300/40 bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-900/20",
      )}>
        <Trophy className={cn("h-4 w-4", r.winner === "tie" ? "text-muted-foreground" : "text-amber-500")} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {r.winner === "tie" ? "Tied on " : "Winner · "}{r.headline.label}
          </p>
          <p className="truncate text-[13px] font-semibold">
            {r.winner === "tie" ? `${r.aLabel} = ${r.bLabel}`
              : r.winner === "a" ? `${r.aLabel} leads by ${SAR(Math.abs(diff))} (${pct.toFixed(1)}%)`
              : `${r.bLabel} leads by ${SAR(Math.abs(diff))} (${pct.toFixed(1)}%)`}
          </p>
        </div>
      </div>

      {/* Header row */}
      <div className="mt-3 grid grid-cols-[1fr,auto,auto] gap-2 border-b border-border/40 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Metric</span>
        <span className="text-right">{r.aLabel}</span>
        <span className="text-right">{r.bLabel}</span>
      </div>

      <ul className="divide-y divide-border/30">
        {r.rows.map((row) => {
          const aw = row.a > row.b, bw = row.b > row.a;
          return (
            <li key={row.label} className="grid grid-cols-[1fr,auto,auto] gap-2 py-1.5 text-[12px]">
              <span className="text-muted-foreground">{row.label}</span>
              <span className={cn("text-right tabular-nums", aw && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                {SAR(row.a)}
              </span>
              <span className={cn("text-right tabular-nums", bw && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                {SAR(row.b)}
              </span>
            </li>
          );
        })}
        <li className="grid grid-cols-[1fr,auto,auto] gap-2 py-1.5 text-[12px] font-bold">
          <span>Total</span>
          <span className="text-right tabular-nums">{SAR(totalA)}</span>
          <span className="text-right tabular-nums">{SAR(totalB)}</span>
        </li>
      </ul>

      {onShare && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      )}
    </div>
  );
}
