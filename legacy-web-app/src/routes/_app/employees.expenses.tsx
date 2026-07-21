import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SARAmount } from "@/components/sar-amount";
import {
  Receipt, Search, ChevronRight, ShieldAlert, ArrowUpCircle, ArrowDownCircle,
  FileDown, FileSpreadsheet, Share2, Check, Clock, Wallet, MoreVertical, SlidersHorizontal, Printer,
} from "lucide-react";
import { AttachmentLightbox } from "@/components/attachment-lightbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  computeWalletTotals, exportWalletExcel, exportWalletPDF, shareWalletWhatsApp,
  type WalletKind, type WalletRow,
} from "@/lib/employee-wallet";

export const Route = createFileRoute("/_app/employees/expenses")({
  component: AllEmployeeWalletPage,
});

type EmpRow = { id: string; name: string; shop_id: string | null; shop_name: string | null; user_id: string | null };

type DatePreset = "today" | "yesterday" | "week" | "month" | "custom";

function presetRange(p: DatePreset): { from: string; to: string } {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  if (p === "today") return { from: iso(today), to: iso(today) };
  if (p === "yesterday") {
    const y = new Date(today); y.setDate(y.getDate() - 1);
    return { from: iso(y), to: iso(y) };
  }
  if (p === "week") {
    const s = new Date(today); s.setDate(s.getDate() - 6);
    return { from: iso(s), to: iso(today) };
  }
  // month
  const s = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: iso(s), to: iso(today) };
}

function AllEmployeeWalletPage() {
  const { isAdmin, isManager } = useUserAccess();
  const { user } = useAuth();
  const qc = useQueryClient();
  const canView = isAdmin || isManager;

  const [empFilter, setEmpFilter] = useState<string>("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<"all" | WalletKind>("all");
  const [preset, setPreset] = useState<DatePreset>("month");
  const initial = presetRange("month");
  const [fromDate, setFromDate] = useState<string>(initial.from);
  const [toDate, setToDate] = useState<string>(initial.to);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const applyPreset = (p: DatePreset) => {
    setPreset(p);
    if (p === "custom") return;
    const r = presetRange(p);
    setFromDate(r.from); setToDate(r.to);
  };

  const { data: employees = [] } = useQuery({
    queryKey: ["employees", "for-wallet-linked"],
    enabled: canView,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employees").select("id, name, shop_id, shop_name, user_id")
        .eq("is_deleted", false)
        .not("user_id", "is", null)
        .order("name");
      if (error) throw error;
      return (data ?? []) as EmpRow[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["employee-expense-categories", "filter"],
    enabled: canView,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expense_categories").select("id, name").order("sort_order");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["employee-wallet", "all", fromDate, toDate],
    enabled: canView,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expenses")
        .select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at")
        .eq("is_deleted", false)
        .gte("txn_date", fromDate).lte("txn_date", toDate)
        .order("txn_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as WalletRow[];
    },
  });

  const empById = useMemo(() => {
    const m = new Map<string, EmpRow>();
    employees.forEach((e) => m.set(e.id, e));
    return m;
  }, [employees]);

  const shops = useMemo(() => {
    const set = new Map<string, string>();
    employees.forEach((e) => { if (e.shop_id && e.shop_name) set.set(e.shop_id, e.shop_name); });
    return Array.from(set, ([id, name]) => ({ id, name }));
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((x) => {
      const emp = empById.get(x.employee_id);
      if (!emp) return false; // only linked employees
      if (empFilter !== "all" && x.employee_id !== empFilter) return false;
      if (shopFilter !== "all" && emp?.shop_id !== shopFilter) return false;
      if (catFilter !== "all" && x.category !== catFilter) return false;
      if (kindFilter !== "all" && x.kind !== kindFilter) return false;
      if (q) {
        const hay = `${emp?.name ?? ""} ${x.note} ${x.amount}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, empById, empFilter, shopFilter, catFilter, kindFilter, search]);

  const totals = useMemo(() => computeWalletTotals(filtered), [filtered]);

  // Wallet balance per employee (uses ALL wallet rows for the employee, not just filtered).
  const walletBalanceByEmp = useMemo(() => {
    const map = new Map<string, { deposit: number; expense: number; balance: number; pending: number }>();
    for (const r of rows) {
      const cur = map.get(r.employee_id) ?? { deposit: 0, expense: 0, balance: 0, pending: 0 };
      if (r.kind === "deposit") {
        if (r.status === "verified") cur.deposit += Number(r.amount);
        else if (r.status === "pending") cur.pending += 1;
      } else cur.expense += Number(r.amount);
      cur.balance = cur.deposit - cur.expense;
      map.set(r.employee_id, cur);
    }
    return map;
  }, [rows]);

  const perEmployee = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const x of filtered) {
      const cur = map.get(x.employee_id) ?? { total: 0, count: 0 };
      cur.total += Number(x.amount); cur.count += 1;
      map.set(x.employee_id, cur);
    }
    return Array.from(map, ([empId, v]) => ({ empId, ...v }))
      .sort((a, b) => b.total - a.total);
  }, [filtered]);

  const verifyMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("employee_expenses")
        .update({ status: "verified", verified_by: user?.id, verified_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit verified");
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const nameLookup = (id: string) => empById.get(id)?.name ?? "Unknown";

  if (!canView) {
    return (
      <div className="mobile-page-stack">
        <Card><CardContent className="py-10 text-center">
          <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Admin/Manager access required.</p>
        </CardContent></Card>
      </div>
    );
  }

  const presetChips: { key: DatePreset; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div className="mobile-page-stack animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg font-bold">Employee Wallet</h1>
          <p className="text-[11px] text-muted-foreground">
            Tracking only — never affects company accounting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance</p>
            <SARAmount value={totals.balance} size="md" className={cn(totals.balance >= 0 ? "text-primary" : "text-destructive")} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-9 w-9 shrink-0" aria-label="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[10px]">Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowFilters((v) => !v)}>
                <SlidersHorizontal className="h-4 w-4" /> {showFilters ? "Hide filters" : "Filters"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportWalletPDF(filtered, nameLookup)}>
                <FileDown className="h-4 w-4" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportWalletExcel(filtered, nameLookup)}>
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareWalletWhatsApp(filtered, nameLookup)}>
                <Share2 className="h-4 w-4" /> Share Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date preset chips */}
      <div className="flex flex-wrap gap-1.5">
        {presetChips.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
              preset === p.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-card text-muted-foreground hover:border-primary/40",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-9 text-xs" />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-9 text-xs" />
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deposit</p>
          <SARAmount value={totals.deposit} size="sm" className="text-success" />
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expense</p>
          <SARAmount value={totals.expense} size="sm" className="text-destructive" />
        </div>
        <div className="rounded-2xl border border-border/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Records</p>
          <p className="text-sm font-semibold">{filtered.length}</p>
        </div>
      </div>

      {/* Filters (collapsible) */}
      {showFilters && (
        <div className="space-y-2 rounded-2xl border border-border/60 bg-card p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, note, or amount"
              className="h-9 pl-7 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Select value={empFilter} onValueChange={setEmpFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Employee" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All employees</SelectItem>
                {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Shop" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All shops</SelectItem>
                {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as any)}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Per-employee summary with wallet balances */}
      {perEmployee.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">By employee</p>
          {perEmployee.map(({ empId, count }) => {
            const emp = empById.get(empId);
            const w = walletBalanceByEmp.get(empId) ?? { deposit: 0, expense: 0, balance: 0, pending: 0 };
            return (
              <Link
                key={empId}
                to="/employees/$employeeId"
                params={{ employeeId: empId }}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
                  {emp?.name?.[0] ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {emp?.name ?? "Unknown"}
                    {w.pending > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground">
                        <Clock className="h-2.5 w-2.5" /> {w.pending} pending
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {emp?.shop_name ?? "—"} · {count} in range
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1">
                    <Wallet className="h-3 w-3" /> Wallet
                  </p>
                  <SARAmount value={w.balance} size="sm" className={cn(w.balance >= 0 ? "text-primary" : "text-destructive")} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Detail list */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">All transactions ({filtered.length})</p>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-muted/40" />
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-xs text-muted-foreground">
            <Receipt className="mx-auto mb-2 h-6 w-6" />
            No transactions match these filters.
          </CardContent></Card>
        ) : (
          filtered.map((x) => {
            const emp = empById.get(x.employee_id);
            const isDeposit = x.kind === "deposit";
            return (
              <div key={x.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
                {x.attachment_url ? (
                  <button
                    onClick={() => setLightbox(x.attachment_url)}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/60"
                  >
                    <img src={x.attachment_url} alt="Receipt" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Receipt className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{emp?.name ?? "Unknown"}</p>
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      isDeposit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                    )}>
                      {isDeposit ? <ArrowDownCircle className="h-2.5 w-2.5" /> : <ArrowUpCircle className="h-2.5 w-2.5" />}
                      {isDeposit ? "Deposit" : (x.category ?? "Expense")}
                    </span>
                    {x.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {new Date(x.txn_date).toLocaleDateString()} · {x.note}
                  </p>
                </div>
                <SARAmount value={Number(x.amount)} size="sm" className={cn("shrink-0", isDeposit ? "text-success" : "text-destructive")} />
                {x.status === "pending" && (
                  <Button size="icon" variant="outline" className="h-8 w-8" title="Verify" onClick={() => verifyMut.mutate(x.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      <AttachmentLightbox open={!!lightbox} url={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
