import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type RangeMode = "daily" | "weekly" | "monthly" | "custom";

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeRange(
  mode: RangeMode,
  anchor: string,
  from: string,
  to: string,
): { start: Date; end: Date } {
  if (mode === "custom") {
    const s = new Date(`${from}T00:00:00`);
    const e = new Date(`${to}T00:00:00`);
    e.setDate(e.getDate() + 1);
    return { start: s, end: e };
  }
  const base = new Date(`${anchor}T00:00:00`);
  if (mode === "daily") {
    const end = new Date(base);
    end.setDate(end.getDate() + 1);
    return { start: base, end };
  }
  if (mode === "weekly") {
    const start = new Date(base);
    const dow = start.getDay();
    start.setDate(start.getDate() - dow);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { start, end };
  }
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  return { start, end };
}

const fmtSAR = (n: number) =>
  `SAR ${Math.round(n).toLocaleString("en-US")}`;

export function WholesaleTotalSaleCard() {
  const today = toISODate(new Date());
  const [mode, setMode] = useState<RangeMode>("daily");
  const [anchor, setAnchor] = useState<string>(today);
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);

  const { start, end } = useMemo(
    () => computeRange(mode, anchor, from, to),
    [mode, anchor, from, to],
  );

  const { data, isFetching } = useQuery({
    queryKey: ["wh-total-sale", mode, start.toISOString(), end.toISOString()],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_sales" as any)
        .select("total")
        .eq("is_deleted", false)
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString());
      if (error) throw error;
      return (data ?? []).reduce(
        (s: number, r: any) => s + Number(r.total ?? 0),
        0,
      );
    },
  });

  const total = data ?? 0;
  const MODES: { key: RangeMode; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <Card className="rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Total Sale
          </p>
          <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-emerald-700 dark:text-emerald-400">
            {isFetching ? "…" : fmtSAR(total)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              mode === m.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode !== "custom" ? (
        <div className="mt-2">
          <Input
            type="date"
            value={anchor}
            onChange={(e) => setAnchor(e.target.value || today)}
            className="h-9 text-[12px]"
          />
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value || today)}
            className="h-9 text-[12px]"
          />
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value || today)}
            className="h-9 text-[12px]"
          />
        </div>
      )}
    </Card>
  );
}
