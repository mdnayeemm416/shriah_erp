// AI Quick Panels — lightweight cards shown on the empty state.
// Loads in parallel after mount; renders skeletons while pending.

import { useEffect, useState } from "react";
import { Activity, HeartPulse, Gauge, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SAR } from "@/lib/format";
import {
  fetchDailySummary, fetchCashHealth, fetchStabilityScore,
  type DailySummary, type CashHealth, type StabilityScore,
} from "@/lib/ai-quick-panels";

const CACHE_KEY = "ai-quick-panels:v1";
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function readCache(): { day: string; daily: DailySummary | null; health: CashHealth | null; score: StabilityScore | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.day === todayKey() ? parsed : null;
  } catch { return null; }
}
function writeCache(p: { daily: DailySummary | null; health: CashHealth | null; score: StabilityScore | null }) {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ day: todayKey(), ...p })); } catch { /* noop */ }
}

export function AiQuickPanels({ onRun }: { onRun: (q: string) => void }) {
  const cached = readCache();
  const [daily, setDaily] = useState<DailySummary | null>(cached?.daily ?? null);
  const [health, setHealth] = useState<CashHealth | null>(cached?.health ?? null);
  const [score, setScore] = useState<StabilityScore | null>(cached?.score ?? null);

  useEffect(() => {
    // Skip network if we already have today's cached values.
    if (cached) return;
    let alive = true;
    (async () => {
      const [a, b, c] = await Promise.allSettled([
        fetchDailySummary(), fetchCashHealth(), fetchStabilityScore(),
      ]);
      if (!alive) return;
      const next = {
        daily: a.status === "fulfilled" ? a.value : null,
        health: b.status === "fulfilled" ? b.value : null,
        score: c.status === "fulfilled" ? c.value : null,
      };
      if (next.daily) setDaily(next.daily);
      if (next.health) setHealth(next.health);
      if (next.score) setScore(next.score);
      writeCache(next);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {/* Today Summary */}
      <Card
        role="button"
        onClick={() => onRun("today full report")}
        className="group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
          <Activity className="h-3 w-3" /> Today
        </div>
        {daily ? (
          <>
            <div className="mt-1 text-base font-bold tabular-nums">{SAR(daily.totalSale)}</div>
            <p className="text-[10.5px] text-muted-foreground">Total sale</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px]">
              <Mini label="Expense" v={daily.expense} />
              <Mini label="Withdraw" v={daily.withdraw} />
            </div>
          </>
        ) : <Skeleton />}
        <ArrowUpRight className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </Card>

      {/* Cash Health */}
      <Card
        role="button"
        onClick={() => onRun("how healthy is cash flow this month?")}
        className="group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
          <HeartPulse className="h-3 w-3" /> Cash Health · 30d
        </div>
        {health ? (
          <>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={cn(
                "text-base font-bold",
                health.status === "healthy" && "text-emerald-500",
                health.status === "watch" && "text-amber-500",
                health.status === "risk" && "text-rose-500",
              )}>
                {health.status === "healthy" ? "Healthy" : health.status === "watch" ? "Watch" : "Risk"}
              </span>
              <span className="text-[10.5px] text-muted-foreground">×{health.ratio.toFixed(2)}</span>
            </div>
            <p className="text-[10.5px] text-muted-foreground">In/Out ratio</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px]">
              <Mini label="In" v={health.inflow} />
              <Mini label="Out" v={health.outflow} />
            </div>
          </>
        ) : <Skeleton />}
        <ArrowUpRight className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </Card>

      {/* Business Stability Score */}
      <Card
        role="button"
        onClick={() => onRun("business stability score")}
        className="group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
          <Gauge className="h-3 w-3" /> Stability
        </div>
        {score ? (
          <>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums">{score.score}</span>
              <span className="text-[10.5px] text-muted-foreground">/100</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  score.score >= 75 ? "bg-emerald-500" : score.score >= 50 ? "bg-amber-500" : "bg-rose-500",
                )}
                style={{ width: `${score.score}%` }}
              />
            </div>
            <div className="mt-1.5 space-y-0.5 text-[10px] text-muted-foreground">
              {score.components.map((c) => (
                <div key={c.label} className="flex justify-between">
                  <span className="truncate">{c.label}</span>
                  <span className="tabular-nums">{c.value}/{c.max}</span>
                </div>
              ))}
            </div>
          </>
        ) : <Skeleton />}
        <ArrowUpRight className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" />
      </Card>
    </div>
  );
}

function Mini({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-1.5 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{Math.round(v).toLocaleString()}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-1 space-y-1.5">
      <div className="h-5 w-20 rounded bg-muted animate-pulse" />
      <div className="h-3 w-28 rounded bg-muted/60 animate-pulse" />
    </div>
  );
}
