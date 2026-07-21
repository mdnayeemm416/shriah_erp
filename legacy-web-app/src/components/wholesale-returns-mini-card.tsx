import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Undo2, ChevronRight } from "lucide-react";
import { SAR } from "@/lib/format";

type Row = { created_at: string; return_value: number };

export function WholesaleReturnsMiniCard() {
  const q = useQuery({
    queryKey: ["wholesale-returns-mini"],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("sales_returns" as any)
        .select("created_at,return_value")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as any;
    },
    staleTime: 60_000,
  });

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const rows = q.data ?? [];
  const today = rows.filter((r) => r.created_at >= dayStart).reduce((s, r) => s + Number(r.return_value), 0);
  const monthly = rows.filter((r) => r.created_at >= monthStart).reduce((s, r) => s + Number(r.return_value), 0);
  const total = rows.reduce((s, r) => s + Number(r.return_value), 0);

  return (
    <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-950/10">
      <CardContent className="p-3">
        <Link to="/sales-return" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Undo2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Sales Returns</p>
              <p className="text-[11px] text-muted-foreground">Tap to view full history</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <Stat label="Today" value={SAR(today)} />
          <Stat label="This Month" value={SAR(monthly)} />
          <Stat label="Total" value={SAR(total)} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background/70 py-1.5">
      <p className="text-[9px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{value}</p>
    </div>
  );
}
