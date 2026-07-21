import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import type { MetricResult, ReportResult, BreakdownEntry } from "@/lib/erp-runner";
import { Sparkles, TrendingUp, Info, Share2, ChevronDown, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { renderMetricImage, renderReportImage } from "@/lib/magic-share";
import { AiShareModal } from "@/components/ai-share-modal";
import { SAR } from "@/lib/format";

function shareCaption(label: string, value: number, scope: string, range: string, query: string) {
  return `*AI Copilot*\n${label}: ${SAR(value)}\n${scope} · ${range}\nQuery: "${query}"\n— Manager AhsAN · ShRiAh Group`;
}

function deepLinkFromMetric(r: MetricResult): Record<string, string> {
  const params: Record<string, string> = {};
  const scope = r.intent.scope;
  if (scope && scope !== "all" && scope !== "warehouse") params.shop = scope;
  const m: string = r.metric as string;
  if (["cash_sale", "pos_sale", "bank_sale", "credit_sale", "total_sale"].includes(m)) {
    params.source = "shop";
  } else if (m === "expense") params.source = "expense";
  else if (m === "withdraw") params.source = "withdraw";
  else if (m === "cash_buy" || m === "credit_buy" || m === "total_purchase") params.source = "purchase";
  if (r.entries && r.entries.length > 0) {
    const dates = r.entries.map((e) => e.date).filter((d): d is string => !!d).sort();
    if (dates[0]) params.from = dates[0];
    if (dates[dates.length - 1]) params.to = dates[dates.length - 1];
  }
  return params;
}


function ActionRow({ onInfo, onShare, onOpen, infoOpen }: { onInfo: () => void; onShare: () => void; onOpen?: () => void; infoOpen: boolean }) {
  return (
    <div className="mt-2 flex items-center justify-end gap-1">
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15 active:bg-primary/20"
          aria-label="Open source entries"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Entries
        </button>
      )}
      <button
        type="button"
        onClick={onInfo}
        className="inline-flex h-8 items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 text-[11px] font-medium text-foreground/80 hover:bg-muted active:bg-muted/80"
        aria-label="Show calculation breakdown"
      >
        <Info className="h-3.5 w-3.5" /> Info
        <ChevronDown className={cn("h-3 w-3 transition-transform", infoOpen && "rotate-180")} />
      </button>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700"
        aria-label="Share via WhatsApp"
      >
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
    </div>
  );
}

export function ErpMetricCard({
  r, query = "", onOpenEntry,
}: {
  r: MetricResult;
  query?: string;
  onOpenEntry?: (e: BreakdownEntry) => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleShare = () => {
    setShareUrl(renderMetricImage(r, query));
    setShareOpen(true);
  };

  const handleEntry = (e: BreakdownEntry) => {
    if (onOpenEntry) return onOpenEntry(e);
    if (e.kind === "employee") {
      // best-effort: open employees list
      navigate({ to: "/employees" });
    } else {
      navigate({ to: "/summary" });
    }
  };

  const handleOpenSource = () => {
    const params = deepLinkFromMetric(r);
    if (r.intent.scope === "warehouse") {
      navigate({ to: "/summary" });
    } else {
      navigate({ to: "/summary", search: params as any });
    }
  };

  return (
    <div className="m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
        <Sparkles className="h-3 w-3" /> AI Copilot
      </div>
      <button
        type="button"
        onClick={handleOpenSource}
        className="mt-1 flex w-full items-baseline justify-between gap-2 rounded-lg text-left hover:bg-primary/5 active:bg-primary/10 -mx-1 px-1 py-0.5 transition-colors"
        aria-label="Open source entries"
      >
        <span className="truncate text-[13px] font-medium text-foreground/90">{r.label}</span>
        <SARAmount value={r.value} size="xl" />
      </button>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {r.scopeLabel} · {r.dateLabel}
      </p>
      {r.breakdown && r.breakdown.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {r.breakdown.map((b) => (
            <div key={b.label} className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.label}</span>
              <span className="text-[11px] font-semibold tabular-nums">
                {Math.abs(b.value).toLocaleString("en", { maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}

      <ActionRow
        onInfo={() => setInfoOpen((v) => !v)}
        onShare={handleShare}
        onOpen={handleOpenSource}
        infoOpen={infoOpen}
      />


      {infoOpen && (
        <div className="mt-2 rounded-xl border border-border/50 bg-muted/30 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Live Calculation</p>
          <p className="mt-1 text-[11px] text-foreground/80">
            <span className="font-semibold">{r.label}:</span> <span className="tabular-nums">{SAR(r.value)}</span>
          </p>
          <ul className="mt-1.5 space-y-0.5 text-[10.5px] text-muted-foreground">
            {r.intent.scope !== "all" && <li>Shop: <span className="text-foreground/80">{r.intent.scope === "warehouse" ? "Warehouse" : r.intent.scope}</span></li>}
            {r.intent.cashier && <li>Cashier: <span className="text-foreground/80">{r.intent.cashier}</span></li>}
            {r.intent.employee && <li>Employee: <span className="text-foreground/80">{r.intent.employee}</span></li>}
            {r.intent.party && <li>Party: <span className="text-foreground/80">{r.intent.party}</span></li>}
            <li>Date: <span className="text-foreground/80">{r.dateLabel}</span></li>
          </ul>

          {r.entries && r.entries.length > 0 ? (
            <>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Included entries ({r.entries.length})
              </p>
              <ul className="mt-1 max-h-56 divide-y divide-border/40 overflow-y-auto rounded-md border border-border/40 bg-background">
                {r.entries.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => handleEntry(e)}
                      className="flex w-full items-center justify-between gap-2 px-2 py-2 text-left hover:bg-muted/60 active:bg-muted/80"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium">{e.label}</p>
                        <p className="text-[10px] text-muted-foreground">{e.date}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold tabular-nums">{SAR(e.amount)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-[10.5px] italic text-muted-foreground/80">
              No itemised entries for this metric.
            </p>
          )}
        </div>
      )}
      <AiShareModal
        open={shareOpen} onOpenChange={setShareOpen}
        dataUrl={shareUrl} filename={`magic-${r.metric}.png`}
        caption={shareCaption(r.label, r.value, r.scopeLabel, r.dateLabel, query)}
      />
    </div>
  );
}

export function ErpReportCard({
  r, query = "",
}: { r: ReportResult; query?: string }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleShare = () => {
    setShareUrl(renderReportImage(r, query));
    setShareOpen(true);
  };
  const handleOpenSource = () => {
    const scope = r.intent.scope;
    const params: Record<string, string> = {};
    if (scope && scope !== "all" && scope !== "warehouse") params.shop = scope;
    if (scope === "warehouse") {
      navigate({ to: "/summary" });
    } else {
      navigate({ to: "/summary", search: params as any });
    }
  };

  return (
    <div className="m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
        <TrendingUp className="h-3 w-3" /> AI Copilot · Report
      </div>
      <button
        type="button"
        onClick={handleOpenSource}
        className="mt-0.5 flex w-full items-baseline justify-between gap-2 rounded-lg text-left hover:bg-primary/5 active:bg-primary/10 -mx-1 px-1 py-0.5 transition-colors"
      >
        <span className="text-[13px] font-semibold">{r.scopeLabel} Summary</span>
        <span className="text-[11px] text-muted-foreground">{r.dateLabel}</span>
      </button>
      <ul className="mt-2 divide-y divide-border/40">
        {r.rows.map((row) => (
          <li
            key={row.label}
            className={cn(
              "flex items-center justify-between gap-2 py-1.5",
              row.emphasis && "font-semibold",
            )}
          >
            <span className={cn("text-[12px]", !row.emphasis && "text-muted-foreground")}>{row.label}</span>
            <span className="text-[12px] tabular-nums">
              {row.value.toLocaleString("en", { maximumFractionDigits: 2 })}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={handleOpenSource}
          className="inline-flex h-8 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 text-[11px] font-semibold text-primary hover:bg-primary/15 active:bg-primary/20"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open Entries
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600 active:bg-emerald-700"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
      </div>
      <AiShareModal
        open={shareOpen} onOpenChange={setShareOpen}
        dataUrl={shareUrl} filename="copilot-report.png"
        caption={`*AI Copilot Report*\n${r.scopeLabel} · ${r.dateLabel}\nQuery: "${query}"\n— Manager AhsAN · ShRiAh Group`}
      />
    </div>
  );
}

// keep popover import alive (unused fallback for future use)
void Popover; void PopoverContent; void PopoverTrigger;
