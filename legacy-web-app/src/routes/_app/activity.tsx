import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkingDate } from "@/hooks/use-working-date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity as ActivityIcon, Pencil, Trash2, RotateCcw, ChevronLeft, Search, Filter, X,
  ExternalLink, Plus, ShoppingCart, Package, Users as UsersIcon,
  Banknote, ClipboardCheck, Check, ArrowRight,
} from "lucide-react";
import { SAR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/activity")({
  component: ActivityPage,
});

type RetentionDays = 7 | 15 | 30 | 0; // 0 = forever
type ActivityFilter = "all" | "created" | "edited" | "deleted";
const RETENTION_KEY = "activity-log-retention-days";
const AUTO_CLEAN_KEY = "activity-log-last-cleanup";


// ---------- Types ----------
type HistoryRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: Record<string, { from: any; to: any }>;
  changed_at: string;
  changed_by: string | null;
};

type FeedItem = {
  key: string;
  kind: "history" | "created";
  at: string;
  user: string | null;
  entity_type: string; // table name
  entity_id: string;
  action: string; // create | update | soft_delete | restore
  amount?: number | null;
  shop_id?: string | null;
  title: string;
  subtitle?: string;
  raw: any;
};

// ---------- Labels ----------
const ENTITY_LABEL: Record<string, string> = {
  transactions: "Transaction",
  shop_entries: "Shop Entry",
  shop_sales: "Sale",
  shop_purchases: "Purchase",
  shop_products: "Product",
  warehouse_ledger: "Warehouse Entry",
  warehouse_items: "Stock Item",
  employee_entries: "Employee Payment",
  employees: "Employee",
  shops: "Shop",
  cashiers: "Cashier",
  categories: "Category",
  sub_categories: "Sub-category",
  parties: "Party",
  ai_scans: "OCR Scan",
  daily_closings: "Daily Closing",
  monthly_closings: "Monthly Closing",
  company_transactions: "Company Transaction",
  pos_payments: "Customer Payment",
  pos_customers: "Customer",
};

// Business-friendly action names derived from snapshot fields
function businessName(entity: string, snap: any): string {
  const get = (k: string) => {
    const v = snap?.[k];
    if (v && typeof v === "object" && "to" in v) return (v as any).to ?? (v as any).from;
    return v;
  };
  if (entity === "transactions") {
    const t = String(get("type") ?? "").toLowerCase();
    const map: Record<string, string> = {
      cash_in: "Cash In", cash_out: "Cash Out", bank_withdraw: "Bank Withdraw",
      purchase: "Warehouse Purchase", expense: "Expense",
      supervisor_payment: "Supervisor Payment", adjustment: "Adjustment",
    };
    return map[t] ?? "Transaction";
  }
  if (entity === "shop_entries") {
    const t = String(get("entry_type") ?? "").toLowerCase();
    const map: Record<string, string> = {
      sale: "Shop Sale", purchase: "Shop Purchase",
      withdraw: "Bank Withdraw", expense: "Shop Expense",
    };
    return map[t] ?? "Shop Entry";
  }
  if (entity === "warehouse_ledger") {
    const t = String(get("entry_type") ?? "").toLowerCase();
    const map: Record<string, string> = {
      warehouse_sale: "Warehouse Sale", warehouse_purchase: "Warehouse Purchase",
      payment_received: "Payment Received", supplier_payment: "Supplier Payment",
    };
    return map[t] ?? "Warehouse Entry";
  }
  if (entity === "employee_entries") {
    const t = String(get("entry_type") ?? "").toLowerCase();
    return t === "given" ? "Employee Payment Given" : t === "received" ? "Employee Payment Received" : "Employee Payment";
  }
  if (entity === "company_transactions") {
    const t = String(get("type") ?? "").toLowerCase();
    return t === "income" ? "Company Income" : t === "expense" ? "Company Expense" : "Company Transaction";
  }
  if (entity === "pos_payments") {
    const k = String(get("kind") ?? "").toLowerCase();
    return k === "payment_in" ? "Payment In" : k === "payment_out" ? "Payment Out" : "Customer Payment";
  }
  return ENTITY_LABEL[entity] ?? entity;
}

const FIELD_LABEL: Record<string, string> = {
  amount: "Amount", type: "Type", category: "Category", subcategory: "Sub-category",
  notes: "Notes", note: "Note", txn_date: "Date", payment_method: "Payment",
  shop_id: "Shop", cashier_id: "Cashier", cashier: "Cashier",
  attachment_url: "Attachment",
  name: "Name", phone: "Phone", address: "Address", party_type: "Party type",
  party_name: "Party", party_id: "Party", entry_type: "Entry type",
  cash_sale: "Cash sale", pos_sale: "POS sale", bank_sale: "Bank sale",
  credit_sale: "Credit sale", difference: "Difference",
  purchase_amount: "Purchase amount", withdraw_amount: "Withdraw amount",
  expense_amount: "Expense amount", payment_status: "Payment status",
  paid_amount: "Paid", due_amount: "Due", remaining_due: "Remaining due",
  product_name: "Product", quantity: "Quantity", purchase_price: "Purchase price",
  sale_price: "Sale price", price: "Price", stock: "Stock", barcode: "Barcode",
  sku: "SKU", status: "Status", is_deleted: "Deleted",
  customer_id: "Customer", customer_name: "Customer", supplier_name: "Supplier",
  invoice_number: "Invoice", total: "Total", discount: "Discount", tax: "Tax",
  sub_total: "Subtotal", items: "Products",
  salary: "Salary", opening_due: "Outstanding",
  employee_id: "Employee", kind: "Kind", method: "Method", month: "Month",
};

const ENTITY_ROUTE: Record<string, string> = {
  transactions: "/summary",
  shop_entries: "/shop",
  shop_sales: "/shop",
  shop_purchases: "/shop",
  shop_products: "/shop",
  pos_payments: "/shop",
  pos_customers: "/shop",
  warehouse_ledger: "/summary",
  warehouse_items: "/summary",
  employee_entries: "/employees",
  employees: "/employees",
  daily_closings: "/daily-closing",
  monthly_closings: "/monthly-closing",
  company_transactions: "/company-transactions",
};

const MONEY_FIELDS = new Set([
  "amount","total","sub_total","paid_amount","paid","due_amount","remaining_due",
  "cash_sale","pos_sale","bank_sale","credit_sale","purchase_amount","withdraw_amount",
  "expense_amount","difference","discount","tax","price","purchase_price","sale_price",
  "salary","opening_due",
]);
const DATE_FIELDS = new Set(["txn_date","sale_date","purchase_date","month","day_date"]);

// ---------- Date helpers ----------
type Period = "today" | "yesterday" | "week" | "month" | "custom";
function shiftDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function periodFrom(period: Period, workingDate: string, customFrom: string): string | null {
  if (period === "custom") return customFrom || null;
  if (period === "today") return workingDate;
  if (period === "yesterday") return shiftDays(workingDate, -1);
  if (period === "week") return shiftDays(workingDate, -6);
  if (period === "month") return shiftDays(workingDate, -29);
  return null;
}
function periodTo(period: Period, workingDate: string, customTo: string): string | null {
  if (period === "custom") return customTo || null;
  if (period === "yesterday") return shiftDays(workingDate, -1);
  return workingDate;
}
function fmt(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

// ---------- Tag styling ----------
function tagFor(item: FeedItem) {
  if (item.action === "create") {
    if (item.entity_type === "shop_entries" || item.entity_type === "shop_sales") {
      return { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: ShoppingCart };
    }
    if (item.entity_type === "shop_purchases" || item.entity_type === "warehouse_ledger") {
      return { cls: "bg-indigo-50 text-indigo-700 border-indigo-200", Icon: Package };
    }
    if (item.entity_type === "employee_entries") {
      return { cls: "bg-violet-50 text-violet-700 border-violet-200", Icon: UsersIcon };
    }
    if (item.entity_type === "transactions" || item.entity_type === "company_transactions" || item.entity_type === "pos_payments") {
      return { cls: "bg-teal-50 text-teal-700 border-teal-200", Icon: Banknote };
    }
    if (item.entity_type === "daily_closings") {
      return { cls: "bg-amber-50 text-amber-700 border-amber-200", Icon: ClipboardCheck };
    }
    return { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: Plus };
  }
  if (item.action === "soft_delete") return { cls: "bg-rose-50 text-rose-700 border-rose-200", Icon: Trash2 };
  if (item.action === "restore") return { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: RotateCcw };
  return { cls: "bg-blue-50 text-blue-700 border-blue-200", Icon: Pencil };
}

// ---------- Page ----------
function ActivityPage() {
  const { workingDate } = useWorkingDate();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const [period, setPeriod] = useState<Period>("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [activeHistory, setActiveHistory] = useState<HistoryRow | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(() => new Set());
  const [retention, setRetention] = useState<RetentionDays>(() => {
    if (typeof window === "undefined") return 7;
    const v = Number(localStorage.getItem(RETENTION_KEY));
    return ([7, 15, 30, 0] as number[]).includes(v) ? (v as RetentionDays) : 7;
  });
  const [clearing, setClearing] = useState(false);

  // Persist retention
  useEffect(() => {
    localStorage.setItem(RETENTION_KEY, String(retention));
  }, [retention]);

  // Auto cleanup: run once per day per device, based on retention setting
  useEffect(() => {
    if (retention === 0) return; // Forever
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(AUTO_CLEAN_KEY) === today) return;
    (async () => {
      const { error } = await supabase.rpc("cleanup_entity_history" as any, { _days: retention });
      if (!error) {
        localStorage.setItem(AUTO_CLEAN_KEY, today);
        qc.invalidateQueries({ queryKey: ["entity_history"] });
        qc.invalidateQueries({ queryKey: ["entity_history_count"] });
      }
    })();
  }, [retention, qc]);

  // Realtime: refresh Activity Log immediately when any new history row arrives.
  useEffect(() => {
    const ch = supabase
      .channel("entity_history_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "entity_history" }, () => {
        qc.invalidateQueries({ queryKey: ["entity_history"] });
        qc.invalidateQueries({ queryKey: ["entity_history_count"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const fromDate = periodFrom(period, workingDate, customFrom);
  const toDate = periodTo(period, workingDate, customTo);
  const fromTs = fromDate ? fromDate + "T00:00:00" : null;
  const toTs = toDate ? toDate + "T23:59:59" : null;

  const refreshActivityLog = async () => {
    qc.removeQueries({ queryKey: ["activity_snapshot"] });
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["entity_history"], refetchType: "active" }),
      qc.invalidateQueries({ queryKey: ["entity_history_count"], refetchType: "active" }),
    ]);
  };

  // Audit-log only count (entity_history rows) — drives the Clear button state
  const { data: historyCount = 0 } = useQuery<number>({
    queryKey: ["entity_history_count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("entity_history" as any)
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    staleTime: 30_000,
  });

  const handleDeleteActivityLogs = async (ids: string[]) => {
    const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
    if (uniqueIds.length === 0) return;

    const ok = await confirm({
      title: uniqueIds.length === 1 ? "Delete Activity Log?" : `Delete ${uniqueIds.length} Activity Logs?`,
      description:
        "This deletes only Activity Log records. Original financial and operational records will not be changed.",
      confirmText: uniqueIds.length === 1 ? "Delete Log" : "Delete Logs",
      cancelText: "Cancel",
      tone: "destroy",
      icon: "warning",
      badge: `${uniqueIds.length} selected`,
    });
    if (!ok) return;

    const previousHistory = qc.getQueriesData<HistoryRow[]>({ queryKey: ["entity_history"] });
    const previousCount = qc.getQueryData<number>(["entity_history_count"]);

    setActiveHistory((current) => (current && uniqueIds.includes(current.id) ? null : current));
    setSelectedIds((current) => {
      const next = new Set(current);
      uniqueIds.forEach((id) => next.delete(id));
      return next;
    });
    setDeletingIds((current) => new Set([...current, ...uniqueIds]));

    qc.setQueriesData<HistoryRow[]>({ queryKey: ["entity_history"] }, (current) => (
      Array.isArray(current) ? current.filter((row) => !uniqueIds.includes(row.id)) : current
    ));
    qc.setQueryData<number>(["entity_history_count"], (current) => Math.max(0, (current ?? historyCount) - uniqueIds.length));

    const { data, error } = await supabase.rpc("delete_entity_history" as any, { _ids: uniqueIds } as any);

    setDeletingIds((current) => {
      const next = new Set(current);
      uniqueIds.forEach((id) => next.delete(id));
      return next;
    });

    if (error) {
      previousHistory.forEach(([key, value]) => qc.setQueryData(key, value));
      qc.setQueryData(["entity_history_count"], previousCount);
      toast.error(error.message || "Failed to delete Activity Log");
      await refreshActivityLog();
      return;
    }

    toast.success("Activity Log deleted successfully.", {
      description: `${data ?? uniqueIds.length} activity logs deleted.`,
    });
    await refreshActivityLog();
  };

  const handleClearAll = async () => {
    const ok = await confirm({
      title: "Clear Activity Log",
      description:
        "This will permanently delete all Activity Log records. Financial records will NOT be affected — only Activity Log entries will be removed.",
      confirmText: "Delete Logs",
      cancelText: "Cancel",
      tone: "destroy",
      icon: "warning",
      badge: historyCount ? `${historyCount} entries` : undefined,
    });
    if (!ok) return;
    setClearing(true);
    const { data, error } = await supabase.rpc("cleanup_entity_history" as any, { _days: 0 });
    setClearing(false);
    if (error) {
      toast.error(error.message || "Failed to clear logs");
      return;
    }
    toast.success("Activity Log cleared successfully.", {
      description: `${data ?? 0} activity logs deleted.`,
    });
    // Clear any open detail / selection state so removed rows don't linger
    setActiveHistory(null);
    setSelectedIds(new Set());
    qc.setQueriesData<HistoryRow[]>({ queryKey: ["entity_history"] }, []);
    qc.setQueryData(["entity_history_count"], 0);
    await refreshActivityLog();
  };



  // Lookups
  const { data: profiles = [] } = useQuery<any[]>({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? [],
    staleTime: 5 * 60_000,
  });
  const profMap = useMemo(
    () => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])),
    [profiles],
  );
  // History
  const { data: history = [], isLoading: lh } = useQuery<HistoryRow[]>({
    queryKey: ["entity_history", fromTs, toTs],
    queryFn: async () => {
      let q = supabase.from("entity_history" as any).select("*")
        .order("changed_at", { ascending: false }).limit(500);
      if (fromTs) q = q.gte("changed_at", fromTs);
      if (toTs) q = q.lte("changed_at", toTs);
      const { data } = await q;
      return (data as any[]) ?? [];
    },
  });

  const isLoading = lh;

  // Merge
  // Lookup shops for friendly summary names
  const { data: shops = [] } = useQuery<any[]>({
    queryKey: ["shops-lite"],
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? [],
    staleTime: 5 * 60_000,
  });
  const shopMap = useMemo(() => new Map(shops.map((s: any) => [s.id, s.name])), [shops]);

  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = [];
    const pickNum = (ch: any) => {
      const v = ch?.to ?? ch?.from;
      const n = v != null ? Number(v) : NaN;
      return isFinite(n) && n > 0 ? n : null;
    };
    const pickStr = (ch: any) => (ch?.to ?? ch?.from ?? null) as string | null;
    for (const h of history) {
      const c = h.changes ?? {};
      const amt =
        pickNum((c as any).total) ??
        pickNum((c as any).amount) ??
        pickNum((c as any).cash_sale) ??
        pickNum((c as any).purchase_amount) ??
        pickNum((c as any).expense_amount) ??
        pickNum((c as any).withdraw_amount) ??
        pickNum((c as any).paid_amount);
      const shopId = pickStr((c as any).shop_id);
      const verb =
        h.action === "create" ? "Created " :
        h.action === "soft_delete" ? "Deleted " :
        h.action === "restore" ? "Restored " : "Edited ";
      items.push({
        key: `h-${h.id}`,
        kind: "history",
        at: h.changed_at,
        user: h.changed_by,
        entity_type: h.entity_type,
        entity_id: h.entity_id,
        action: h.action,
        amount: amt,
        shop_id: shopId,
        title: verb + businessName(h.entity_type, c),
        raw: h,
      });
    }
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    return items;
  }, [history]);

  // Classify an audit row by activity action so filters never depend on original records.
  // Kept in one place so chips + counts stay in sync.
  const classify = (it: FeedItem): Exclude<ActivityFilter, "all"> => {
    if (it.action === "create") return "created";
    if (it.action === "soft_delete" || it.action === "restore") return "deleted";
    return "edited";
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feed.filter((it) => {
      if (filter !== "all") {
        if (classify(it) !== filter) return false;
      }
      if (userFilter !== "all" && it.user !== userFilter) return false;
      if (q) {
        const hay = `${it.title} ${it.subtitle ?? ""} ${ENTITY_LABEL[it.entity_type] ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [feed, filter, userFilter, search]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  const visibleHistoryIds = useMemo(() => visible.map((it) => String(it.raw.id)), [visible]);
  const selectedCount = selectedIds.size;
  const allVisibleSelected = visibleHistoryIds.length > 0 && visibleHistoryIds.every((id) => selectedIds.has(id));

  useEffect(() => {
    const availableIds = new Set(history.map((row) => row.id));
    setSelectedIds((current) => {
      const next = new Set([...current].filter((id) => availableIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [history]);

  const toggleVisibleSelection = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) visibleHistoryIds.forEach((id) => next.delete(id));
      else visibleHistoryIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleActivitySelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const users = useMemo(() => {
    const ids = Array.from(new Set(feed.map((r) => r.user).filter(Boolean) as string[]));
    return ids.map((id) => ({ id, name: profMap.get(id) ?? "—" }));
  }, [feed, profMap]);

  const counts = useMemo(() => {
    let created = 0, edited = 0, deleted = 0;
    for (const it of feed) {
      const c = classify(it);
      if (c === "created") created++;
      else if (c === "edited") edited++;
      else if (c === "deleted") deleted++;
    }
    return { created, edited, deleted, total: feed.length };
  }, [feed]);

  const handleItemClick = (it: FeedItem) => {
    setActiveHistory(it.raw as HistoryRow);
  };

  const clearFilters = () => { setFilter("all"); setUserFilter("all"); setSearch(""); };
  const activeFilterCount =
    (filter !== "all" ? 1 : 0) + (userFilter !== "all" ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="mx-auto max-w-3xl space-y-4 animate-in fade-in-0 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/settings"><Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-primary" /> Activity
            </h1>
            <p className="text-xs text-muted-foreground">
              All new entries, edits, deletes and restores · {counts.total} logs
            </p>
          </div>
        </div>
      </div>

      {/* Retention controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-card/50 p-2.5 text-xs">
        <span className="text-muted-foreground">Keep logs for</span>
        <select
          value={retention}
          onChange={(e) => setRetention(Number(e.target.value) as RetentionDays)}
          className="rounded-lg border border-border/50 bg-background px-2 py-1.5 font-medium"
        >
          <option value={7}>7 Days (Default)</option>
          <option value={15}>15 Days</option>
          <option value={30}>30 Days</option>
          <option value={0}>Forever</option>
        </select>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={clearing || historyCount === 0}
            className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {clearing ? "Deleting…" : "Delete All Logs"}
          </Button>
        </div>
      </div>


      {/* Summary / Filter chips */}
      <div className="grid grid-cols-4 gap-2">
        <SummaryCard label="All" value={counts.total} active={filter === "all"} onClick={() => setFilter("all")} />
        <SummaryCard label="Created" value={counts.created} tone="emerald" active={filter === "created"} onClick={() => setFilter(filter === "created" ? "all" : "created")} />
        <SummaryCard label="Edited" value={counts.edited} tone="blue" active={filter === "edited"} onClick={() => setFilter(filter === "edited" ? "all" : "edited")} />
        <SummaryCard label="Deleted" value={counts.deleted} tone="rose" active={filter === "deleted"} onClick={() => setFilter(filter === "deleted" ? "all" : "deleted")} />
      </div>

      {/* Period tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(["today", "yesterday", "week", "month", "custom"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              period === p ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-background hover:bg-muted/50",
            )}
          >
            {p === "week" ? "Weekly" : p === "month" ? "Monthly" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-9 w-auto" />
          <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="h-9 w-auto" />
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2 rounded-xl border border-border/40 bg-card/50 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity…"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="rounded-lg border border-border/50 bg-background px-2 py-1.5"
          >
            <option value="all">All users</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              <X className="h-3.5 w-3.5" /> Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {visibleHistoryIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-card/50 p-2.5 text-xs">
          <Button variant="ghost" size="sm" onClick={toggleVisibleSelection} className="h-8">
            <Check className="h-3.5 w-3.5" />
            {allVisibleSelected ? "Unselect Visible" : "Select Visible"}
          </Button>
          <span className="text-muted-foreground">{selectedCount} selected</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteActivityLogs(Array.from(selectedIds))}
            disabled={selectedCount === 0 || deletingIds.size > 0}
            className="ml-auto h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
          </Button>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 py-10 text-center">
          <Filter className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No activity in this range</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-border/50 rounded-xl border border-border/40 bg-card/30">
            {visible.map((it) => {
              const tag = tagFor(it);
              const Icon = tag.Icon;
              const rowId = String(it.raw.id);
              const isSelected = selectedIds.has(rowId);
              const isDeleting = deletingIds.has(rowId);
              return (
                <li key={it.key} className={cn(isSelected && "bg-primary/5")}>
                  <div className="flex items-start gap-2 px-2 py-2">
                    <button
                      type="button"
                      onClick={() => toggleActivitySelection(rowId)}
                      aria-label={isSelected ? "Unselect activity log" : "Select activity log"}
                      className={cn(
                        "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/60 transition-colors hover:bg-muted/60",
                        isSelected && "border-primary bg-primary/10 text-primary",
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  <button
                    onClick={() => handleItemClick(it)}
                    className="flex min-w-0 flex-1 items-start gap-3 rounded-lg px-1 py-0.5 text-left hover:bg-muted/40"
                  >
                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", tag.cls)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{it.title}</span>
                        {it.amount != null && it.amount > 0 && (
                          <Badge variant="secondary" className="text-[10px]">SAR {Number(it.amount).toFixed(2)}</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                        {it.shop_id && shopMap.get(it.shop_id) ? `${shopMap.get(it.shop_id)} · ` : ""}
                        {new Date(it.at).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteActivityLogs([rowId])}
                      disabled={isDeleting}
                      aria-label="Delete activity log"
                      className="mt-0.5 h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {filtered.length > visible.length && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setLimit((n) => n + 10)}>
                Load more ({filtered.length - visible.length})
              </Button>
            </div>
          )}
        </>
      )}

      {/* History detail modal */}
      <DetailErrorBoundary onClose={() => setActiveHistory(null)}>
        <ActivityDetailModal
          active={activeHistory}
          onClose={() => setActiveHistory(null)}
          profMap={profMap}
          onDelete={(id) => handleDeleteActivityLogs([id])}
        />
      </DetailErrorBoundary>


    </div>
  );
}

// ---------- Value formatting for detail modal ----------
function fmtVal(field: string, v: any): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (MONEY_FIELDS.has(field) && (typeof v === "number" || (!isNaN(Number(v)) && typeof v !== "object"))) {
    return SAR(Number(v));
  }
  if (DATE_FIELDS.has(field)) {
    const s = String(v).slice(0, 10);
    const d = new Date(s + "T00:00:00");
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
    }
  }
  if (typeof v === "object") {
    if (Array.isArray(v)) {
      return v.map((it: any) => {
        const n = it?.name ?? it?.product_name ?? "Item";
        const q = it?.qty ?? it?.quantity;
        return q ? `${n} ×${q}` : n;
      }).join(", ");
    }
    return JSON.stringify(v);
  }
  return String(v);
}

// Pull a list of products out of a snapshot (shop_sales / shop_purchases use jsonb items).
function extractItems(snapshot: any): Array<{ name: string; qty: any; price?: any }> {
  if (!snapshot) return [];
  const arr = snapshot.items;
  if (!Array.isArray(arr)) return [];
  return arr.map((it: any) => ({
    name: it?.name ?? it?.product_name ?? "Item",
    qty: it?.qty ?? it?.quantity ?? 1,
    price: it?.price,
  }));
}

// Per-entity field display order. Falls back to a generic list.
const DISPLAY_ORDER: Record<string, string[]> = {
  shop_sales: ["txn_date","shop_id","customer_name","payment_method","total","discount","tax","paid_amount","due_amount","invoice_number","notes"],
  shop_purchases: ["txn_date","shop_id","supplier_name","invoice_number","total","tax","discount","paid_amount","due_amount","notes"],
  shop_products: ["name","barcode","category","sale_price","purchase_price","stock","notes"],
  shop_entries: ["txn_date","entry_type","shop_id","cashier","cash_sale","pos_sale","bank_sale","credit_sale","purchase_amount","withdraw_amount","expense_amount","difference","notes"],
  transactions: ["txn_date","type","amount","payment_method","category","subcategory","notes"],
  company_transactions: ["txn_date","type","category","amount","notes"],
  employees: ["name","phone","salary","opening_due","shop_id"],
  employee_entries: ["txn_date","employee_id","entry_type","amount","notes"],
  pos_payments: ["txn_date","customer_id","amount","method","kind","notes"],
  warehouse_ledger: ["txn_date","entry_type","party_name","amount","payment_status","paid_amount","remaining_due","notes"],
  daily_closings: ["txn_date","shop_id","cash_sale","pos_sale","bank_sale","credit_sale","difference","notes"],
  monthly_closings: ["month","notes"],
};
const GENERIC_FIELDS = ["txn_date","name","amount","total","payment_method","category","notes"];

function ActivityDetailModal({
  active, onClose, profMap, onDelete,
}: { active: HistoryRow | null; onClose: () => void; profMap: Map<string, string>; onDelete: (id: string) => void }) {
  const navigate = useNavigate();
  const [openingOriginal, setOpeningOriginal] = useState(false);

  const { data: snapshot, isLoading: snapLoading } = useQuery<any | null>({
    enabled: !!active,
    queryKey: ["activity_snapshot", active?.entity_type, active?.entity_id],
    queryFn: async () => {
      if (!active) return null;
      const { data } = await (supabase as any)
        .from(active.entity_type)
        .select("*")
        .eq("id", active.entity_id)
        .maybeSingle();
      return data ?? null;
    },
  });

  // Lookup shop names for snapshot display
  const { data: shops = [] } = useQuery<any[]>({
    queryKey: ["shops-lite"],
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? [],
    staleTime: 5 * 60_000,
  });
  const shopMap = useMemo(() => new Map(shops.map((s: any) => [s.id, s.name])), [shops]);

  // Build a "merged" view of the entity: snapshot if available, else reconstruct from changes (for deleted records).
  // IMPORTANT: this hook MUST run on every render — keep it above any early return.
  const reconstructed = useMemo(() => {
    if (!active) return null;
    if (snapshot) return snapshot;
    if (active.action !== "soft_delete" && active.action !== "create") return null;
    const obj: any = {};
    for (const [k, ch] of Object.entries(active.changes ?? {})) {
      obj[k] = active.action === "create" ? (ch as any).to : (ch as any).from ?? (ch as any).to;
    }
    return obj;
  }, [snapshot, active]);

  if (!active) {
    return (
      <Dialog open={false} onOpenChange={(o) => !o && onClose()}><DialogContent /></Dialog>
    );
  }

  const action = active.action;
  const isCreate = action === "create";
  const isDel = action === "soft_delete";
  const isRes = action === "restore";
  const isEdit = action === "update";

  const badge = isCreate
    ? { label: "Created", bg: "bg-emerald-500", ring: "ring-emerald-200", Icon: Plus }
    : isDel
    ? { label: "Deleted", bg: "bg-rose-500", ring: "ring-rose-200", Icon: Trash2 }
    : isRes
    ? { label: "Restored", bg: "bg-emerald-500", ring: "ring-emerald-200", Icon: RotateCcw }
    : { label: "Edited", bg: "bg-blue-500", ring: "ring-blue-200", Icon: Pencil };
  const BadgeIcon = badge.Icon;

  const entityLabel = ENTITY_LABEL[active.entity_type] ?? active.entity_type;
  const route = ENTITY_ROUTE[active.entity_type];
  const userName = active.changed_by ? (profMap.get(active.changed_by) ?? "—") : "system";

  const businessDate =
    reconstructed?.txn_date ?? reconstructed?.sale_date ?? reconstructed?.month ?? null;

  const displayFields = (DISPLAY_ORDER[active.entity_type] ?? GENERIC_FIELDS).filter((k) => {
    const v = reconstructed?.[k];
    return v !== null && v !== undefined && v !== "" && !(typeof v === "number" && v === 0 && !["amount","total"].includes(k));
  });

  const items = extractItems(reconstructed);
  const fieldEntries = Object.entries(active.changes ?? {}).filter(([k]) => k !== "items");

  const renderValue = (field: string, v: any) => {
    if (field === "shop_id" && typeof v === "string") return shopMap.get(v) ?? "—";
    return fmtVal(field, v);
  };

  const openOriginal = async () => {
    if (!route) return;
    setOpeningOriginal(true);
    onClose();
    await navigate({ to: route as any, search: { highlight: active.entity_id } as any });
    setOpeningOriginal(false);
  };

  const originalMissing = !snapLoading && !snapshot;


  return (
    <Dialog open={!!active} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{badge.label} {entityLabel}</DialogTitle>
        </DialogHeader>

        {/* Coloured header banner */}
        <div className={cn("relative px-5 pt-5 pb-4 text-white", badge.bg)}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/15">
              <BadgeIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider opacity-90">{badge.label}</p>
              <h2 className="text-lg font-semibold leading-tight">{badge.label} {entityLabel}</h2>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {/* Meta card */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/40 bg-muted/30 p-3 text-xs">
            <MetaRow label="Action Time" value={new Date(active.changed_at).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
            {businessDate && (
              <MetaRow label="Business Date" value={fmtVal("txn_date", businessDate)} />
            )}
            <MetaRow label={isCreate ? "Created By" : isDel ? "Deleted By" : "Changed By"} value={userName} />
            <MetaRow label="Module" value={entityLabel} />
          </div>

          {/* EDIT: show only changed fields */}
          {isEdit && (
            fieldEntries.length === 0 ? (
              <p className="rounded-lg bg-muted/30 p-3 text-center text-xs text-muted-foreground">No field-level changes recorded.</p>
            ) : (
              <div className="rounded-xl border border-border/40 bg-card/50 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Changes ({fieldEntries.length})
                </p>
                <ul className="space-y-2.5">
                  {fieldEntries.map(([f, ch]) => (
                    <li key={f} className="rounded-lg border border-border/40 bg-background p-2.5">
                      <p className="mb-1 text-[11px] font-medium text-muted-foreground">{FIELD_LABEL[f] ?? f}</p>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-rose-700 line-through dark:bg-rose-500/10 dark:text-rose-300">
                          {renderValue(f, ch.from)}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          {renderValue(f, ch.to)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* CREATE / DELETE / RESTORE: show business detail card */}
          {!isEdit && (
            <div className="rounded-xl border border-border/40 bg-card/50 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {isDel ? "Entry before deletion" : isRes ? "Restored entry" : "Entry details"}
              </p>
              {!reconstructed ? (
                <p className="text-xs text-muted-foreground">No data available.</p>
              ) : (
                <ul className="divide-y divide-border/40">
                  {displayFields.map((f) => (
                    <li key={f} className="flex items-start justify-between gap-3 py-1.5 text-sm">
                      <span className="text-muted-foreground text-xs pt-0.5">{FIELD_LABEL[f] ?? f}</span>
                      <span className="max-w-[65%] text-right font-medium">{renderValue(f, reconstructed[f])}</span>
                    </li>
                  ))}
                </ul>
              )}

              {items.length > 0 && (
                <div className="mt-3 rounded-lg border border-border/40 bg-background p-2.5">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Products ({items.length})
                  </p>
                  <ul className="space-y-1">
                    {items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between text-xs">
                        <span className="truncate">{it.name} <span className="text-muted-foreground">×{it.qty}</span></span>
                        {it.price != null && <span className="font-medium tabular-nums">{SAR(Number(it.price))}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {reconstructed?.attachment_url && (
                <a
                  href={reconstructed.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View attachment <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* Open original / delete actions */}
          <div className="space-y-2 pt-1">
            {route && !originalMissing && (
              <Button onClick={openOriginal} disabled={openingOriginal} className="w-full">
                <ExternalLink className="h-3.5 w-3.5" /> Open Original Entry
              </Button>
            )}
            {originalMissing && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-center text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                This original record is no longer available.
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(active.id)}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Activity Log Only
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

class DetailErrorBoundary extends React.Component<
  { children: React.ReactNode; onClose: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.error("[ActivityDetail]", err); }
  componentDidUpdate(prev: { children: React.ReactNode }) {
    if (prev.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <Dialog open onOpenChange={(o) => { if (!o) { this.setState({ hasError: false }); this.props.onClose(); } }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Unable to load activity details</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Something went wrong while opening this entry. Please try again.
            </p>
            <Button onClick={() => { this.setState({ hasError: false }); this.props.onClose(); }}>Close</Button>
          </DialogContent>
        </Dialog>
      );
    }
    return this.props.children;
  }
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xs font-medium truncate">{value}</p>
    </div>
  );
}


function SummaryCard({
  label, value, tone, active, onClick,
}: { label: string; value: number; tone?: "blue" | "rose" | "emerald"; active?: boolean; onClick?: () => void }) {
  const toneCls =
    tone === "blue" ? "text-blue-700"
    : tone === "rose" ? "text-rose-700"
    : tone === "emerald" ? "text-emerald-700"
    : "text-foreground";
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:shadow-md",
        active ? "border-primary ring-1 ring-primary/30" : "border-border/40",
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-xl font-semibold tabular-nums", toneCls)}>{value}</p>
    </button>
  );
}
