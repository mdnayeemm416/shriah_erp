// Standalone Sales Return module — Wholesale.
// Recent returns, filters, analytics, and the "New Sales Return" wizard.
import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Undo2, Users, Calendar, FileText, BarChart3, Package,
} from "lucide-react";
import { SAR } from "@/lib/format";
import { openSalesReturnInvoice } from "@/lib/sales-return-invoice/share";
import { SalesReturnWizard } from "@/components/sales-return-wizard";

export const Route = createFileRoute("/_app/sales-return")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s.new === "1" || s.new === 1 || s.new === true ? 1 : undefined }),
  component: SalesReturnPage,
});

type ReturnRow = {
  id: string;
  sale_id: string;
  return_number: string | null;
  invoice_number: number | null;
  customer_name: string | null;
  customer_mobile: string | null;
  total_qty: number;
  return_value: number;
  refund_type: string;
  refund_amount: number;
  reason: string | null;
  processed_by_name: string | null;
  notes: string | null;
  created_at: string;
};
type ReturnItemRow = {
  return_id: string;
  name: string;
  qty: number;
  line_value: number;
};

type RangeKey = "today" | "week" | "month" | "all";
type SettlementKey = "all" | "due_reduction" | "cash" | "credit";

function startOf(range: RangeKey): string | null {
  const now = new Date();
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  if (range === "week") {
    const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString();
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  return null;
}

function SalesReturnPage() {
  const access = useUserAccess();
  const canView = access.isAdmin || access.isManager || access.hasPage("sales-return");
  const [q, setQ] = useState("");
  const [range, setRange] = useState<RangeKey>("month");
  const [settlement, setSettlement] = useState<SettlementKey>("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  useEffect(() => {
    if (search.new === 1) {
      setWizardOpen(true);
      navigate({ search: { new: undefined }, replace: true });
    }
  }, [search.new, navigate]);

  const returns = useQuery({
    queryKey: ["sales-returns", "list"],
    enabled: canView,
    queryFn: async (): Promise<ReturnRow[]> => {
      const { data, error } = await supabase
        .from("sales_returns" as any)
        .select("id,sale_id,return_number,invoice_number,customer_name,customer_mobile,total_qty,return_value,refund_type,refund_amount,reason,processed_by_name,notes,created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const returnItems = useQuery({
    queryKey: ["sales-returns", "items"],
    enabled: canView,
    queryFn: async (): Promise<ReturnItemRow[]> => {
      const { data, error } = await supabase
        .from("sales_return_items" as any)
        .select("return_id,name,qty,line_value")
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const filtered = useMemo(() => {
    const list = returns.data ?? [];
    const from = startOf(range);
    const needle = q.trim().toLowerCase();
    return list.filter((r) => {
      if (from && r.created_at < from) return false;
      if (settlement !== "all" && r.refund_type !== settlement) return false;
      if (!needle) return true;
      return (
        String(r.invoice_number ?? "").includes(needle) ||
        (r.return_number ?? "").toLowerCase().includes(needle) ||
        (r.customer_name ?? "").toLowerCase().includes(needle) ||
        (r.customer_mobile ?? "").toLowerCase().includes(needle)
      );
    });
  }, [returns.data, q, range, settlement]);

  const stats = useMemo(() => {
    const totalValue = filtered.reduce((s, r) => s + Number(r.return_value), 0);
    const totalQty = filtered.reduce((s, r) => s + Number(r.total_qty), 0);
    return { totalValue, totalQty, count: filtered.length };
  }, [filtered]);

  const byCustomer = useMemo(() => {
    const m = new Map<string, { name: string; qty: number; value: number }>();
    for (const r of filtered) {
      const k = r.customer_name || "Walk-in";
      const cur = m.get(k) ?? { name: k, qty: 0, value: 0 };
      cur.qty += Number(r.total_qty);
      cur.value += Number(r.return_value);
      m.set(k, cur);
    }
    return Array.from(m.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  const byProduct = useMemo(() => {
    const ids = new Set(filtered.map((r) => r.id));
    const m = new Map<string, { name: string; qty: number; value: number }>();
    for (const it of returnItems.data ?? []) {
      if (!ids.has(it.return_id)) continue;
      const cur = m.get(it.name) ?? { name: it.name, qty: 0, value: 0 };
      cur.qty += Number(it.qty);
      cur.value += Number(it.line_value);
      m.set(it.name, cur);
    }
    return Array.from(m.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered, returnItems.data]);

  const byDate = useMemo(() => {
    const m = new Map<string, { date: string; value: number; count: number }>();
    for (const r of filtered) {
      const d = r.created_at.slice(0, 10);
      const cur = m.get(d) ?? { date: d, value: 0, count: 0 };
      cur.value += Number(r.return_value);
      cur.count += 1;
      m.set(d, cur);
    }
    return Array.from(m.values()).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 14);
  }, [filtered]);

  if (!canView) {
    return <div className="p-6 text-sm text-muted-foreground">You don't have permission to view sales returns.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Undo2 className="h-5 w-5 text-rose-600" /> Sales Return
          </h1>
          <p className="text-xs text-muted-foreground">Standalone module for processing and tracking returns.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={<Calendar className="h-4 w-4" />} label="Total Return" value={SAR(stats.totalValue)} sub={`${stats.count} returns`} />
        <StatCard icon={<Package className="h-4 w-4" />} label="Total Qty" value={String(stats.totalQty)} sub="units returned" />
        <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Avg / Return" value={SAR(stats.count ? stats.totalValue / stats.count : 0)} sub="per invoice" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={settlement} onValueChange={(v) => setSettlement(v as SettlementKey)}>
          <SelectTrigger><SelectValue placeholder="Settlement" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All settlements</SelectItem>
            <SelectItem value="due_reduction">Due reduced</SelectItem>
            <SelectItem value="cash">Cash refund</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search return #, invoice, customer…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ReportBlock title="Top Customers" icon={<Users className="h-3.5 w-3.5" />} rows={byCustomer.map((c) => ({ label: c.name, value: SAR(c.value), sub: `${c.qty} qty` }))} />
        <ReportBlock title="Top Products" icon={<Package className="h-3.5 w-3.5" />} rows={byProduct.map((p) => ({ label: p.name, value: SAR(p.value), sub: `${p.qty} qty` }))} />
      </div>
      <ReportBlock
        title="By Date"
        icon={<Calendar className="h-3.5 w-3.5" />}
        rows={byDate.map((d) => ({
          label: new Date(d.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
          value: SAR(d.value),
          sub: `${d.count} returns`,
        }))}
      />

      <Card>
        <CardContent className="p-0">
          {returns.isLoading ? (
            <div className="flex justify-center p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No returns match the current filters.</p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => openSalesReturnInvoice(r.id)}
                  className="w-full p-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
                        <FileText className="h-3.5 w-3.5" />
                        {r.return_number ?? `#${String(r.id).slice(0, 6)}`}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Original: INV-{r.invoice_number ?? "—"}</p>
                      <p className="mt-0.5 truncate text-xs">
                        {r.customer_name || "Walk-in"}{r.customer_mobile ? ` · ${r.customer_mobile}` : ""}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                        {r.processed_by_name ? ` · by ${r.processed_by_name}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{SAR(r.return_value)}</p>
                      <Badge variant="outline" className="text-[9px]">
                        {r.refund_type === "cash" ? "Cash refund" : r.refund_type === "credit" ? "Credit" : "Due reduced"}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SalesReturnWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {icon} {label}
        </div>
        <p className="mt-1 text-lg font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function ReportBlock({
  title, icon, rows,
}: { title: string; icon: React.ReactNode; rows: { label: string; value: string; sub: string }[] }) {
  return (
    <Card>
      <CardContent className="p-3">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
          {icon} {title}
        </p>
        {rows.length === 0 ? (
          <p className="text-xs text-muted-foreground">No data</p>
        ) : (
          <div className="space-y-1 text-sm">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-2 border-b border-border/60 py-1 last:border-b-0">
                <span className="truncate">{r.label}</span>
                <div className="text-right">
                  <p className="font-medium">{r.value}</p>
                  <p className="text-[10px] text-muted-foreground">{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
