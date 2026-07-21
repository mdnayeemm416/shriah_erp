import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, AlertOctagon, Info, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeClosing, type Finding, type Severity } from "@/lib/closing-analyzer";

type Props = {
  date: string;
  openingCash: number;
  expected: number;
  counted: number;
  diff: number;
  cashSale: number;
  withdraw: number;
  purchase: number;
  expense: number;
  employeePaid: number;
  employeeReceived: number;
  distributionTotal: number;
  shopEntries: any[];
  whEntries: any[];
  empEntries: any[];
  tomorrowPurchases: any[];
};

const META: Record<Severity, { icon: typeof Info; cls: string; pill: string; label: string }> = {
  critical: {
    icon: AlertOctagon,
    cls: "border-rose-200 bg-rose-50/60",
    pill: "bg-rose-100 text-rose-700",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    cls: "border-amber-200 bg-amber-50/60",
    pill: "bg-amber-100 text-amber-800",
    label: "Warning",
  },
  info: {
    icon: Info,
    cls: "border-border/60 bg-muted/30",
    pill: "bg-muted text-foreground/70",
    label: "Info",
  },
};

export function ClosingAssistant(props: Props) {
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [ranAt, setRanAt] = useState<string | null>(null);

  const run = () => {
    setBusy(true);
    // Defer to next tick so the spinner can render on slow phones.
    setTimeout(() => {
      const res = analyzeClosing(props);
      setFindings(res);
      setRanAt(new Date().toLocaleTimeString());
      setBusy(false);
    }, 30);
  };

  const counts = findings
    ? findings.reduce(
        (acc, f) => ((acc[f.severity] = (acc[f.severity] || 0) + 1), acc),
        { critical: 0, warning: 0, info: 0 } as Record<Severity, number>,
      )
    : null;

  return (
    <Card className="rounded-2xl border-border/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold">Closing Assistant</p>
            <p className="text-[10.5px] text-muted-foreground">
              {ranAt ? `Last run ${ranAt}` : "Rule-based anomaly check — runs on demand"}
            </p>
          </div>
        </div>
        <Button
          onClick={run}
          disabled={busy}
          size="sm"
          variant={findings ? "outline" : "default"}
          className="h-9 shrink-0"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          <span className="ml-1.5 text-[12px]">{findings ? "Re-analyze" : "Analyze Closing"}</span>
        </Button>
      </div>

      {counts && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <SevPill severity="critical" count={counts.critical} />
          <SevPill severity="warning" count={counts.warning} />
          <SevPill severity="info" count={counts.info} />
        </div>
      )}

      {findings && findings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {findings.map((f) => {
            const m = META[f.severity];
            const Icon = m.icon;
            return (
              <li
                key={f.id}
                className={cn(
                  "rounded-xl border px-3 py-2.5 transition-colors",
                  m.cls,
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    f.severity === "critical" ? "text-rose-700"
                      : f.severity === "warning" ? "text-amber-700"
                      : "text-muted-foreground",
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-foreground/90">{f.title}</p>
                    {f.detail && (
                      <p className="mt-0.5 text-[11.5px] text-foreground/70 leading-snug">{f.detail}</p>
                    )}
                    {f.hint && (
                      <p className="mt-1 text-[10.5px] text-muted-foreground italic">{f.hint}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {findings && findings.length === 1 && findings[0].id === "ok" && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> All checks passed
        </div>
      )}
    </Card>
  );
}

function SevPill({ severity, count }: { severity: Severity; count: number }) {
  if (!count) return null;
  const m = META[severity];
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", m.pill)}>
      {count} {m.label}
    </span>
  );
}
