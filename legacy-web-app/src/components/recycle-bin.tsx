import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Undo2, Inbox, Search, ChevronDown, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  SOFT_DELETABLE_TABLES,
  TABLE_LABELS,
  restore,
  hardDelete,
  hardDeleteMany,
  type SoftDeletableTable,
} from "@/lib/soft-delete";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { SAR } from "@/lib/format";

type Row = {
  id: string;
  table: SoftDeletableTable;
  title: string;
  subtitle: string;
  shopName: string | null;
  amount: number | null;
  txnDate: string | null;
  kind: string | null;
  deleted_at: string;
  deleted_by: string | null;
  raw: any;
};

const AMOUNT_FIELDS: Partial<Record<SoftDeletableTable, (r: any) => number | null>> = {
  transactions: (r) => Number(r.amount) || 0,
  shop_entries: (r) => Number(r.cash_sale || r.purchase_amount || r.expense_amount || r.withdraw_amount || r.pos_sale) || 0,
  warehouse_ledger: (r) => Number(r.amount) || 0,
  warehouse_items: (r) => Number(r.quantity || 0) * Number(r.purchase_price || 0),
  shop_sales: (r) => Number(r.total) || 0,
  shop_purchases: (r) => Number(r.total) || 0,
  shop_orders: (r) => Number(r.total) || 0,
  shop_products: (r) => Number(r.price) || 0,
  pos_customers: (r) => Number(r.opening_due) || 0,
  employee_entries: (r) => Number(r.amount) || 0,
  company_transactions: (r) => Number(r.amount) || 0,
};

const TITLE_FIELDS: Record<SoftDeletableTable, (r: any) => string> = {
  transactions: (r) => `${r.type}`,
  shop_entries: (r) => `${r.entry_type}`,
  warehouse_ledger: (r) => `${r.entry_type} · ${r.party_name ?? ""}`,
  warehouse_items: (r) => `${r.product_name} (qty ${r.quantity})`,
  ai_scans: (r) => `Scan · ${new Date(r.created_at).toLocaleDateString()}`,
  categories: (r) => r.name,
  sub_categories: (r) => r.name,
  parties: (r) => `${r.name}${r.party_type ? ` (${r.party_type})` : ""}`,
  cashiers: (r) => r.name,
  shops: (r) => r.name,
  employees: (r) => r.name,
  employee_entries: (r) => `${r.entry_type}`,
  shop_sales: (r) => `Sale #${r.invoice_number ?? "—"} · ${r.customer_name ?? "—"}`,
  shop_purchases: (r) => `Purchase #${r.invoice_number ?? "—"} · ${r.supplier_name ?? "—"}`,
  shop_orders: (r) => `Order #${r.order_number ?? "—"} · ${r.customer_name ?? "—"}`,
  shop_products: (r) => `${r.name}${r.item_code ? ` (${r.item_code})` : ""}`,
  pos_customers: (r) => `${r.name}${r.phone ? ` · ${r.phone}` : ""}`,
  company_transactions: (r) => `${r.txn_type} · ${r.category}`,
};

const KIND_FIELDS: Partial<Record<SoftDeletableTable, (r: any) => string | null>> = {
  shop_entries: (r) => r.entry_type ?? null,
  warehouse_ledger: (r) => r.entry_type ?? null,
  employee_entries: (r) => r.entry_type ?? null,
  transactions: (r) => r.type ?? null,
  company_transactions: (r) => r.txn_type ?? null,
};

const DATE_FIELDS: Partial<Record<SoftDeletableTable, (r: any) => string | null>> = {
  shop_entries: (r) => r.txn_date,
  warehouse_ledger: (r) => r.txn_date,
  employee_entries: (r) => r.txn_date,
  transactions: (r) => r.txn_date,
  company_transactions: (r) => r.txn_date,
  shop_sales: (r) => r.sale_date ?? r.created_at?.slice(0, 10),
  shop_purchases: (r) => r.purchase_date ?? r.created_at?.slice(0, 10),
  shop_orders: (r) => r.created_at?.slice(0, 10),
};

// Map common entry kinds to badge colors (using tailwind palette via inline classes).
const KIND_COLOR: Record<string, string> = {
  sale: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  purchase: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  expense: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  withdraw: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  cash_in: "bg-emerald-100 text-emerald-800",
  cash_out: "bg-rose-100 text-rose-800",
  salary: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  advance: "bg-amber-100 text-amber-800",
};

const TABLE_COLOR: Partial<Record<SoftDeletableTable, string>> = {
  shop_entries: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  employee_entries: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  shop_sales: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  shop_purchases: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
  shop_products: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900",
  company_transactions: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  warehouse_ledger: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
  pos_customers: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900",
};

export function RecycleBin() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | SoftDeletableTable>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: isAdmin = false, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles").select("role").eq("user_id", user!.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  const queries = SOFT_DELETABLE_TABLES.map((t) =>
    useQuery({
      queryKey: ["trash", t],
      enabled: isAdmin,
      queryFn: async () => {
        const { data } = await (supabase as any)
          .from(t).select("*").eq("is_deleted", true)
          .order("deleted_at", { ascending: false }).limit(200);
        return ((data as any[]) ?? []).map((r) => ({ ...r, __table: t as SoftDeletableTable }));
      },
    }),
  );
  const isLoading = queries.some((q) => q.isLoading);

  const { data: profiles = [] } = useQuery<any[]>({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? [],
  });
  const profMap = useMemo(
    () => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])),
    [profiles],
  );

  const { data: shops = [] } = useQuery<any[]>({
    queryKey: ["shops-all-recycle"],
    enabled: isAdmin,
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? [],
  });
  const shopMap = useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);

  const { data: cashiers = [] } = useQuery<any[]>({
    queryKey: ["cashiers-all-recycle"],
    enabled: isAdmin,
    queryFn: async () => (await supabase.from("cashiers").select("id,name")).data ?? [],
  });
  const cashierMap = useMemo(() => new Map(cashiers.map((c) => [c.id, c.name])), [cashiers]);

  const rows: Row[] = useMemo(() => {
    const all = queries.flatMap((q) =>
      ((q.data as any[]) ?? []).map((r) => {
        const table = r.__table as SoftDeletableTable;
        const shopName = r.shop_id ? (shopMap.get(r.shop_id) ?? null) : (r.shop_name ?? null);
        return {
          id: r.id,
          table,
          title: TITLE_FIELDS[table](r),
          subtitle: shopName ?? "",
          shopName,
          amount: AMOUNT_FIELDS[table]?.(r) ?? null,
          txnDate: DATE_FIELDS[table]?.(r) ?? null,
          kind: KIND_FIELDS[table]?.(r) ?? null,
          deleted_at: r.deleted_at,
          deleted_by: r.deleted_by ?? null,
          raw: r,
        } as Row;
      }),
    );
    const sorted = all.sort((a, b) => (a.deleted_at < b.deleted_at ? 1 : -1));
    const byTab = filter === "all" ? sorted : sorted.filter((r) => r.table === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((r) => {
      const cashierName = r.raw.cashier_id ? (cashierMap.get(r.raw.cashier_id) ?? "") : "";
      const blob = [
        r.title, r.shopName ?? "", r.raw.notes ?? "", cashierName,
        r.amount?.toString() ?? "", r.txnDate ?? "", r.kind ?? "",
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries.map((q) => q.dataUpdatedAt).join(","), filter, query, shopMap, cashierMap]);

  const invalidateAll = () => {
    ["trash","txns","shop_entries","wh_ledger","parties","shops","cashiers","categories",
     "sub_categories","employees","employee-entries","admin-sales","admin-purchases",
     "admin-orders","admin-products","pos-customers-admin","pos-due-map",
     "store-admin-overview","store-products"]
      .forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };

  // Auto-cleanup: permanently delete Recycle Bin items older than 7 days.
  // Runs once per day per device (gated by localStorage marker), admin-only.
  useEffect(() => {
    if (!isAdmin) return;
    const KEY = "recycle_bin_autoclean_v1";
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(KEY) === today) return;
    } catch { /* noop */ }
    (async () => {
      const { data, error } = await (supabase as any).rpc("cleanup_recycle_bin", { _days: 7 });
      if (!error) {
        try { localStorage.setItem(KEY, today); } catch { /* noop */ }
        if (typeof data === "number" && data > 0) {
          toast.success(`Auto-cleaned ${data} old Recycle Bin record${data === 1 ? "" : "s"}`);
          invalidateAll();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const onRestore = async (r: Row) => {
    const { error } = await restore(r.table, r.id);
    if (error) toast.error(error.message);
    else { toast.success("Record restored"); invalidateAll(); }
  };
  const onPurge = async (r: Row) => {
    const { error } = await hardDelete(r.table, r.id);
    if (error) toast.error(error.message);
    else { toast.success("Permanently deleted"); invalidateAll(); }
  };

  const [purging, setPurging] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const onEmptyAll = async () => {
    if (!rows.length) return;
    setPurging(true);
    const total = rows.length;
    setProgress({ done: 0, total });
    const byTable = new Map<SoftDeletableTable, string[]>();
    for (const r of rows) {
      const arr = byTable.get(r.table) ?? [];
      arr.push(r.id);
      byTable.set(r.table, arr);
    }
    let ok = 0, fail = 0, globalDone = 0;
    for (const [table, ids] of byTable) {
      const res = await hardDeleteMany(table, ids, 100, (done) => {
        setProgress({ done: globalDone + done, total });
      });
      ok += res.ok; fail += res.fail;
      globalDone += ids.length;
      setProgress({ done: globalDone, total });
    }
    setPurging(false);
    setProgress(null);
    if (fail) toast.error(`${ok} deleted, ${fail} failed`);
    else toast.success(`${ok} permanently deleted`);
    invalidateAll();
  };

  const counts = SOFT_DELETABLE_TABLES.reduce<Record<string, number>>((acc, t, i) => {
    acc[t] = ((queries[i].data as any[]) ?? []).length;
    return acc;
  }, {});
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (roleLoading) return <p className="py-6 text-sm text-muted-foreground">Loading…</p>;

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
        <p className="text-sm font-medium">Admins only</p>
        <p className="mt-1 text-xs text-muted-foreground">Recycle Bin is restricted to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">Recycle Bin ({total})</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Auto-deletes after 7 days</span>
      </div>
      {purging && progress && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-2.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-destructive">
            <span>Deleting permanently…</span><span>{progress.done} / {progress.total}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-destructive/15">
            <div className="h-full bg-destructive transition-[width] duration-150"
              style={{ width: `${Math.round((progress.done / Math.max(1, progress.total)) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by amount, shop, cashier, note, date…"
          className="h-9 pl-8 text-sm"
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" count={total} />
          {SOFT_DELETABLE_TABLES.map((t) =>
            counts[t] ? (
              <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)}
                label={TABLE_LABELS[t].label} count={counts[t]} />
            ) : null,
          )}
        </div>
        {rows.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={purging}
                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                {purging ? "Emptying…" : filter === "all" ? "Empty Bin" : "Delete All"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" /> Permanent Delete
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {rows.length} record{rows.length === 1 ? "" : "s"} will be permanently removed.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onEmptyAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 py-10 text-center">
          <Inbox className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {query ? "No matching records found" : "Recycle Bin is empty"}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const key = `${r.table}-${r.id}`;
            const isOpen = expanded === key;
            const cashierName = r.raw.cashier_id ? cashierMap.get(r.raw.cashier_id) : null;
            return (
              <li key={key}
                className="overflow-hidden rounded-xl border border-border/50 bg-card transition-shadow hover:shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline"
                        className={cn("text-[10px] font-medium", TABLE_COLOR[r.table] ?? "")}>
                        {TABLE_LABELS[r.table].label}
                      </Badge>
                      {r.kind && (
                        <span className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                          KIND_COLOR[r.kind] ?? "bg-muted text-muted-foreground",
                        )}>{r.kind}</span>
                      )}
                      {r.shopName && (
                        <span className="truncate text-xs font-medium text-foreground">{r.shopName}</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] text-muted-foreground">
                        Deleted {new Date(r.deleted_at).toLocaleDateString()}
                        {r.txnDate ? ` · ${r.txnDate}` : ""}
                      </p>
                      {r.amount !== null && r.amount > 0 && (
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{SAR(r.amount)}</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )} />
                </button>

                {isOpen && (
                  <div className="space-y-2 border-t border-border/40 bg-muted/20 px-3 py-2.5">
                    <DetailGrid items={[
                      ["Type", r.title || "—"],
                      ["Shop", r.shopName ?? "—"],
                      ["Date", r.txnDate ?? "—"],
                      ["Amount", r.amount !== null ? SAR(r.amount) : "—"],
                      ["Cashier", cashierName ?? "—"],
                      ["Module", TABLE_LABELS[r.table].source],
                      ["Created", r.raw.created_at ? new Date(r.raw.created_at).toLocaleString() : "—"],
                      ["Deleted", new Date(r.deleted_at).toLocaleString()],
                      ["Deleted by", r.deleted_by ? (profMap.get(r.deleted_by) ?? "—") : "—"],
                      ["Ref ID", String(r.id).slice(0, 8)],
                    ]} />
                    {r.raw.notes && (
                      <div className="rounded-md bg-background/60 px-2 py-1.5 text-[11px]">
                        <span className="font-medium text-muted-foreground">Note: </span>
                        <span className="text-foreground">{r.raw.notes}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Undo2 className="h-3.5 w-3.5" /> Restore
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restore this record?</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="mt-2 space-y-1 rounded-md border border-border/50 bg-muted/30 p-2.5 text-xs">
                                {r.shopName && <Pair k="Shop" v={r.shopName} />}
                                <Pair k="Type" v={r.title || TABLE_LABELS[r.table].label} />
                                {r.amount !== null && r.amount > 0 && <Pair k="Amount" v={SAR(r.amount)} />}
                                {r.txnDate && <Pair k="Date" v={r.txnDate} />}
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onRestore(r)}>Restore</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Delete forever
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                              <AlertTriangle className="h-4 w-4" /> Permanent Delete
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild>
                              <div className="space-y-2">
                                <p>This record will be permanently removed. This action cannot be undone.</p>
                                <div className="space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs">
                                  {r.shopName && <Pair k="Shop" v={r.shopName} />}
                                  <Pair k="Type" v={r.title || TABLE_LABELS[r.table].label} />
                                  {r.amount !== null && r.amount > 0 && <Pair k="Amount" v={SAR(r.amount)} />}
                                  {r.txnDate && <Pair k="Date" v={r.txnDate} />}
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onPurge(r)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DetailGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</p>
          <p className="truncate text-xs font-medium text-foreground">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Pair({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}

function FilterChip({
  active, onClick, label, count,
}: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary"
               : "border-border/50 bg-background hover:bg-muted/50",
      )}>
      {label} <span className="opacity-60">· {count}</span>
    </button>
  );
}
