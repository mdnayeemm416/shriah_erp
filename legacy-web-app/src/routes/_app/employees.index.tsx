import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SARAmount } from "@/components/sar-amount";
import { Plus, Search, ChevronRight, Phone, Store, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeFormDialog } from "@/components/employee-form-dialog";

export const Route = createFileRoute("/_app/employees/")({
  component: EmployeesIndex,
});

type EmployeeBalance = {
  id: string;
  name: string;
  shop_id: string | null;
  shop_name: string | null;
  mobile: string | null;
  iqama: string | null;
  total_given: number;
  total_received: number;
  balance: number;
  last_activity: string | null;
};

function EmployeesIndex() {
  const [search, setSearch] = useState("");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("shops")
        .select("id, name")
        .eq("is_deleted", false)
        .order("name");
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", "with-balances"],
    queryFn: async () => {
      const { data: emps, error } = await (supabase as any)
        .from("employees")
        .select("id, name, shop_id, shop_name, mobile, iqama")
        .eq("is_deleted", false)
        .order("name");
      if (error) throw error;
      if (!emps || emps.length === 0) return [] as EmployeeBalance[];

      const ids = emps.map((e: any) => e.id);
      const { data: entries } = await (supabase as any)
        .from("employee_entries")
        .select("employee_id, entry_type, amount, txn_date")
        .in("employee_id", ids)
        .eq("is_deleted", false);

      const map = new Map<string, { g: number; r: number; last: string | null }>();
      for (const e of (entries ?? []) as any[]) {
        const m = map.get(e.employee_id) ?? { g: 0, r: 0, last: null };
        if (e.entry_type === "given") m.g += Number(e.amount);
        else m.r += Number(e.amount);
        if (!m.last || e.txn_date > m.last) m.last = e.txn_date;
        map.set(e.employee_id, m);
      }

      return emps.map((e: any): EmployeeBalance => {
        const m = map.get(e.id) ?? { g: 0, r: 0, last: null };
        return {
          ...e,
          total_given: m.g,
          total_received: m.r,
          balance: m.g - m.r,
          last_activity: m.last,
        };
      });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e: EmployeeBalance) => {
      if (shopFilter !== "all" && e.shop_id !== shopFilter) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        (e.mobile ?? "").toLowerCase().includes(q) ||
        (e.iqama ?? "").toLowerCase().includes(q) ||
        (e.shop_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [employees, search, shopFilter]);

  const totals = useMemo(() => {
    return employees.reduce(
      (a: { given: number; received: number; outstanding: number }, e: EmployeeBalance) => ({
        given: a.given + e.total_given,
        received: a.received + e.total_received,
        outstanding: a.outstanding + Math.max(0, e.balance),
      }),
      { given: 0, received: 0, outstanding: 0 },
    );
  }, [employees]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Employees</h1>
            <p className="text-xs text-muted-foreground">Track money given, received and live balances.</p>
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link to="/employees/expenses">Employee Wallet</Link>
          </Button>
          <Button onClick={() => setAddOpen(true)} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </header>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryTile label="Total Given" value={totals.given} tone="destructive" />
        <SummaryTile label="Total Received" value={totals.received} tone="success" />
        <SummaryTile label="Outstanding" value={totals.outstanding} tone="primary" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, iqama…"
            className="pl-9"
            maxLength={80}
          />
        </div>
        <Select value={shopFilter} onValueChange={setShopFilter}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All shops</SelectItem>
            {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Users className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No employees yet</p>
            <p className="text-xs text-muted-foreground">Add an employee to start tracking money given and received.</p>
            <Button size="sm" onClick={() => setAddOpen(true)} className="mt-2">
              <Plus className="h-3.5 w-3.5" /> Add Employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((e: EmployeeBalance) => (
            <Link
              key={e.id}
              to="/employees/$employeeId"
              params={{ employeeId: e.id }}
              className="group block rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] tap"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-bold text-primary">
                    {initials(e.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{e.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground">
                      {e.shop_name && (
                        <span className="inline-flex items-center gap-1"><Store className="h-3 w-3" /> {e.shop_name}</span>
                      )}
                      {e.mobile && (
                        <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {e.mobile}</span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance</p>
                  <SARAmount
                    value={Math.abs(e.balance)}
                    size="lg"
                    className={cn(
                      e.balance > 0 && "text-destructive",
                      e.balance < 0 && "text-success",
                      e.balance === 0 && "text-muted-foreground",
                    )}
                  />
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {e.balance > 0 ? "Due from employee" : e.balance < 0 ? "Advance" : "Settled"}
                  </p>
                </div>
                <div className="text-right text-[10px] text-muted-foreground">
                  <p>Given <span className="font-semibold text-foreground">{fmt(e.total_given)}</span></p>
                  <p>Received <span className="font-semibold text-foreground">{fmt(e.total_received)}</span></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <EmployeeFormDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}

function SummaryTile({
  label, value, tone,
}: {
  label: string;
  value: number;
  tone: "destructive" | "success" | "primary";
}) {
  const cls =
    tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <SARAmount value={value} size="md" className={cn("mt-1", cls)} />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((s) => s[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n);
}
