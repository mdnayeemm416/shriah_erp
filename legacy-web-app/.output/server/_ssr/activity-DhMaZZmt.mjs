import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { o as useWorkingDate, u as useConfirm, B as Button, d as cn, I as Input, h as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, af as SAR } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { t as ChevronLeft, aR as Activity, T as Trash2, y as Search, X, n as Check, bA as Funnel, F as ShoppingCart, v as Package, U as Users, aZ as Banknote, bB as ClipboardCheck, P as Plus, b as RotateCcw, a5 as Pencil, aQ as ArrowRight, bw as ExternalLink } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
const RETENTION_KEY = "activity-log-retention-days";
const AUTO_CLEAN_KEY = "activity-log-last-cleanup";
const ENTITY_LABEL = {
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
  pos_customers: "Customer"
};
function businessName(entity, snap) {
  const get = (k) => {
    const v = snap?.[k];
    if (v && typeof v === "object" && "to" in v) return v.to ?? v.from;
    return v;
  };
  if (entity === "transactions") {
    const t = String(get("type") ?? "").toLowerCase();
    const map = {
      cash_in: "Cash In",
      cash_out: "Cash Out",
      bank_withdraw: "Bank Withdraw",
      purchase: "Warehouse Purchase",
      expense: "Expense",
      supervisor_payment: "Supervisor Payment",
      adjustment: "Adjustment"
    };
    return map[t] ?? "Transaction";
  }
  if (entity === "shop_entries") {
    const t = String(get("entry_type") ?? "").toLowerCase();
    const map = {
      sale: "Shop Sale",
      purchase: "Shop Purchase",
      withdraw: "Bank Withdraw",
      expense: "Shop Expense"
    };
    return map[t] ?? "Shop Entry";
  }
  if (entity === "warehouse_ledger") {
    const t = String(get("entry_type") ?? "").toLowerCase();
    const map = {
      warehouse_sale: "Warehouse Sale",
      warehouse_purchase: "Warehouse Purchase",
      payment_received: "Payment Received",
      supplier_payment: "Supplier Payment"
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
const FIELD_LABEL = {
  amount: "Amount",
  type: "Type",
  category: "Category",
  subcategory: "Sub-category",
  notes: "Notes",
  note: "Note",
  txn_date: "Date",
  payment_method: "Payment",
  shop_id: "Shop",
  cashier_id: "Cashier",
  cashier: "Cashier",
  attachment_url: "Attachment",
  name: "Name",
  phone: "Phone",
  address: "Address",
  party_type: "Party type",
  party_name: "Party",
  party_id: "Party",
  entry_type: "Entry type",
  cash_sale: "Cash sale",
  pos_sale: "POS sale",
  bank_sale: "Bank sale",
  credit_sale: "Credit sale",
  difference: "Difference",
  purchase_amount: "Purchase amount",
  withdraw_amount: "Withdraw amount",
  expense_amount: "Expense amount",
  payment_status: "Payment status",
  paid_amount: "Paid",
  due_amount: "Due",
  remaining_due: "Remaining due",
  product_name: "Product",
  quantity: "Quantity",
  purchase_price: "Purchase price",
  sale_price: "Sale price",
  price: "Price",
  stock: "Stock",
  barcode: "Barcode",
  sku: "SKU",
  status: "Status",
  is_deleted: "Deleted",
  customer_id: "Customer",
  customer_name: "Customer",
  supplier_name: "Supplier",
  invoice_number: "Invoice",
  total: "Total",
  discount: "Discount",
  tax: "Tax",
  sub_total: "Subtotal",
  items: "Products",
  salary: "Salary",
  opening_due: "Outstanding",
  employee_id: "Employee",
  kind: "Kind",
  method: "Method",
  month: "Month"
};
const ENTITY_ROUTE = {
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
  company_transactions: "/company-transactions"
};
const MONEY_FIELDS = /* @__PURE__ */ new Set(["amount", "total", "sub_total", "paid_amount", "paid", "due_amount", "remaining_due", "cash_sale", "pos_sale", "bank_sale", "credit_sale", "purchase_amount", "withdraw_amount", "expense_amount", "difference", "discount", "tax", "price", "purchase_price", "sale_price", "salary", "opening_due"]);
const DATE_FIELDS = /* @__PURE__ */ new Set(["txn_date", "sale_date", "purchase_date", "month", "day_date"]);
function shiftDays(iso, n) {
  const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function periodFrom(period, workingDate, customFrom) {
  if (period === "custom") return customFrom || null;
  if (period === "today") return workingDate;
  if (period === "yesterday") return shiftDays(workingDate, -1);
  if (period === "week") return shiftDays(workingDate, -6);
  if (period === "month") return shiftDays(workingDate, -29);
  return null;
}
function periodTo(period, workingDate, customTo) {
  if (period === "custom") return customTo || null;
  if (period === "yesterday") return shiftDays(workingDate, -1);
  return workingDate;
}
function tagFor(item) {
  if (item.action === "create") {
    if (item.entity_type === "shop_entries" || item.entity_type === "shop_sales") {
      return {
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Icon: ShoppingCart
      };
    }
    if (item.entity_type === "shop_purchases" || item.entity_type === "warehouse_ledger") {
      return {
        cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
        Icon: Package
      };
    }
    if (item.entity_type === "employee_entries") {
      return {
        cls: "bg-violet-50 text-violet-700 border-violet-200",
        Icon: Users
      };
    }
    if (item.entity_type === "transactions" || item.entity_type === "company_transactions" || item.entity_type === "pos_payments") {
      return {
        cls: "bg-teal-50 text-teal-700 border-teal-200",
        Icon: Banknote
      };
    }
    if (item.entity_type === "daily_closings") {
      return {
        cls: "bg-amber-50 text-amber-700 border-amber-200",
        Icon: ClipboardCheck
      };
    }
    return {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Icon: Plus
    };
  }
  if (item.action === "soft_delete") return {
    cls: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: Trash2
  };
  if (item.action === "restore") return {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: RotateCcw
  };
  return {
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    Icon: Pencil
  };
}
function ActivityPage() {
  const {
    workingDate
  } = useWorkingDate();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const [period, setPeriod] = reactExports.useState("week");
  const [customFrom, setCustomFrom] = reactExports.useState("");
  const [customTo, setCustomTo] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [userFilter, setUserFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [limit, setLimit] = reactExports.useState(10);
  const [activeHistory, setActiveHistory] = reactExports.useState(null);
  const [selectedIds, setSelectedIds] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const [deletingIds, setDeletingIds] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const [retention, setRetention] = reactExports.useState(() => {
    if (typeof window === "undefined") return 7;
    const v = Number(localStorage.getItem(RETENTION_KEY));
    return [7, 15, 30, 0].includes(v) ? v : 7;
  });
  const [clearing, setClearing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    localStorage.setItem(RETENTION_KEY, String(retention));
  }, [retention]);
  reactExports.useEffect(() => {
    if (retention === 0) return;
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (localStorage.getItem(AUTO_CLEAN_KEY) === today) return;
    (async () => {
      const {
        error
      } = await supabase.rpc("cleanup_entity_history", {
        _days: retention
      });
      if (!error) {
        localStorage.setItem(AUTO_CLEAN_KEY, today);
        qc.invalidateQueries({
          queryKey: ["entity_history"]
        });
        qc.invalidateQueries({
          queryKey: ["entity_history_count"]
        });
      }
    })();
  }, [retention, qc]);
  reactExports.useEffect(() => {
    const ch = supabase.channel("entity_history_feed").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "entity_history"
    }, () => {
      qc.invalidateQueries({
        queryKey: ["entity_history"]
      });
      qc.invalidateQueries({
        queryKey: ["entity_history_count"]
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const fromDate = periodFrom(period, workingDate, customFrom);
  const toDate = periodTo(period, workingDate, customTo);
  const fromTs = fromDate ? fromDate + "T00:00:00" : null;
  const toTs = toDate ? toDate + "T23:59:59" : null;
  const refreshActivityLog = async () => {
    qc.removeQueries({
      queryKey: ["activity_snapshot"]
    });
    await Promise.all([qc.invalidateQueries({
      queryKey: ["entity_history"],
      refetchType: "active"
    }), qc.invalidateQueries({
      queryKey: ["entity_history_count"],
      refetchType: "active"
    })]);
  };
  const {
    data: historyCount = 0
  } = useQuery({
    queryKey: ["entity_history_count"],
    queryFn: async () => {
      const {
        count
      } = await supabase.from("entity_history").select("*", {
        count: "exact",
        head: true
      });
      return count ?? 0;
    },
    staleTime: 3e4
  });
  const handleDeleteActivityLogs = async (ids) => {
    const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
    if (uniqueIds.length === 0) return;
    const ok = await confirm({
      title: uniqueIds.length === 1 ? "Delete Activity Log?" : `Delete ${uniqueIds.length} Activity Logs?`,
      description: "This deletes only Activity Log records. Original financial and operational records will not be changed.",
      confirmText: uniqueIds.length === 1 ? "Delete Log" : "Delete Logs",
      cancelText: "Cancel",
      tone: "destroy",
      icon: "warning",
      badge: `${uniqueIds.length} selected`
    });
    if (!ok) return;
    const previousHistory = qc.getQueriesData({
      queryKey: ["entity_history"]
    });
    const previousCount = qc.getQueryData(["entity_history_count"]);
    setActiveHistory((current) => current && uniqueIds.includes(current.id) ? null : current);
    setSelectedIds((current) => {
      const next = new Set(current);
      uniqueIds.forEach((id) => next.delete(id));
      return next;
    });
    setDeletingIds((current) => /* @__PURE__ */ new Set([...current, ...uniqueIds]));
    qc.setQueriesData({
      queryKey: ["entity_history"]
    }, (current) => Array.isArray(current) ? current.filter((row) => !uniqueIds.includes(row.id)) : current);
    qc.setQueryData(["entity_history_count"], (current) => Math.max(0, (current ?? historyCount) - uniqueIds.length));
    const {
      data,
      error
    } = await supabase.rpc("delete_entity_history", {
      _ids: uniqueIds
    });
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
      description: `${data ?? uniqueIds.length} activity logs deleted.`
    });
    await refreshActivityLog();
  };
  const handleClearAll = async () => {
    const ok = await confirm({
      title: "Clear Activity Log",
      description: "This will permanently delete all Activity Log records. Financial records will NOT be affected — only Activity Log entries will be removed.",
      confirmText: "Delete Logs",
      cancelText: "Cancel",
      tone: "destroy",
      icon: "warning",
      badge: historyCount ? `${historyCount} entries` : void 0
    });
    if (!ok) return;
    setClearing(true);
    const {
      data,
      error
    } = await supabase.rpc("cleanup_entity_history", {
      _days: 0
    });
    setClearing(false);
    if (error) {
      toast.error(error.message || "Failed to clear logs");
      return;
    }
    toast.success("Activity Log cleared successfully.", {
      description: `${data ?? 0} activity logs deleted.`
    });
    setActiveHistory(null);
    setSelectedIds(/* @__PURE__ */ new Set());
    qc.setQueriesData({
      queryKey: ["entity_history"]
    }, []);
    qc.setQueryData(["entity_history_count"], 0);
    await refreshActivityLog();
  };
  const {
    data: profiles = []
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? [],
    staleTime: 5 * 6e4
  });
  const profMap = reactExports.useMemo(() => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])), [profiles]);
  const {
    data: history = [],
    isLoading: lh
  } = useQuery({
    queryKey: ["entity_history", fromTs, toTs],
    queryFn: async () => {
      let q = supabase.from("entity_history").select("*").order("changed_at", {
        ascending: false
      }).limit(500);
      if (fromTs) q = q.gte("changed_at", fromTs);
      if (toTs) q = q.lte("changed_at", toTs);
      const {
        data
      } = await q;
      return data ?? [];
    }
  });
  const isLoading = lh;
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops-lite"],
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? [],
    staleTime: 5 * 6e4
  });
  const shopMap = reactExports.useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);
  const feed = reactExports.useMemo(() => {
    const items = [];
    const pickNum = (ch) => {
      const v = ch?.to ?? ch?.from;
      const n = v != null ? Number(v) : NaN;
      return isFinite(n) && n > 0 ? n : null;
    };
    const pickStr = (ch) => ch?.to ?? ch?.from ?? null;
    for (const h of history) {
      const c = h.changes ?? {};
      const amt = pickNum(c.total) ?? pickNum(c.amount) ?? pickNum(c.cash_sale) ?? pickNum(c.purchase_amount) ?? pickNum(c.expense_amount) ?? pickNum(c.withdraw_amount) ?? pickNum(c.paid_amount);
      const shopId = pickStr(c.shop_id);
      const verb = h.action === "create" ? "Created " : h.action === "soft_delete" ? "Deleted " : h.action === "restore" ? "Restored " : "Edited ";
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
        raw: h
      });
    }
    items.sort((a, b) => a.at < b.at ? 1 : -1);
    return items;
  }, [history]);
  const classify = (it) => {
    if (it.action === "create") return "created";
    if (it.action === "soft_delete" || it.action === "restore") return "deleted";
    return "edited";
  };
  const filtered = reactExports.useMemo(() => {
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
  const visible = reactExports.useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const visibleHistoryIds = reactExports.useMemo(() => visible.map((it) => String(it.raw.id)), [visible]);
  const selectedCount = selectedIds.size;
  const allVisibleSelected = visibleHistoryIds.length > 0 && visibleHistoryIds.every((id) => selectedIds.has(id));
  reactExports.useEffect(() => {
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
  const toggleActivitySelection = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const users = reactExports.useMemo(() => {
    const ids = Array.from(new Set(feed.map((r) => r.user).filter(Boolean)));
    return ids.map((id) => ({
      id,
      name: profMap.get(id) ?? "—"
    }));
  }, [feed, profMap]);
  const counts = reactExports.useMemo(() => {
    let created = 0, edited = 0, deleted = 0;
    for (const it of feed) {
      const c = classify(it);
      if (c === "created") created++;
      else if (c === "edited") edited++;
      else if (c === "deleted") deleted++;
    }
    return {
      created,
      edited,
      deleted,
      total: feed.length
    };
  }, [feed]);
  const handleItemClick = (it) => {
    setActiveHistory(it.raw);
  };
  const clearFilters = () => {
    setFilter("all");
    setUserFilter("all");
    setSearch("");
  };
  const activeFilterCount = (filter !== "all" ? 1 : 0) + (userFilter !== "all" ? 1 : 0) + (search ? 1 : 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-4 animate-in fade-in-0 duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
          " Activity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "All new entries, edits, deletes and restores · ",
          counts.total,
          " logs"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-card/50 p-2.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Keep logs for" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: retention, onChange: (e) => setRetention(Number(e.target.value)), className: "rounded-lg border border-border/50 bg-background px-2 py-1.5 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 7, children: "7 Days (Default)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 15, children: "15 Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 30, children: "30 Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 0, children: "Forever" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleClearAll, disabled: clearing || historyCount === 0, className: "h-8 text-destructive hover:bg-destructive/10 hover:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
        clearing ? "Deleting…" : "Delete All Logs"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "All", value: counts.total, active: filter === "all", onClick: () => setFilter("all") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Created", value: counts.created, tone: "emerald", active: filter === "created", onClick: () => setFilter(filter === "created" ? "all" : "created") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Edited", value: counts.edited, tone: "blue", active: filter === "edited", onClick: () => setFilter(filter === "edited" ? "all" : "edited") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Deleted", value: counts.deleted, tone: "rose", active: filter === "deleted", onClick: () => setFilter(filter === "deleted" ? "all" : "deleted") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["today", "yesterday", "week", "month", "custom"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPeriod(p), className: cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", period === p ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-background hover:bg-muted/50"), children: p === "week" ? "Weekly" : p === "month" ? "Monthly" : p.charAt(0).toUpperCase() + p.slice(1) }, p)) }),
    period === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value), className: "h-9 w-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value), className: "h-9 w-auto" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-xl border border-border/40 bg-card/50 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search activity…", className: "h-9 pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: userFilter, onChange: (e) => setUserFilter(e.target.value), className: "rounded-lg border border-border/50 bg-background px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All users" }),
          users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: u.id, children: u.name }, u.id))
        ] }),
        activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: clearFilters, className: "h-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
          " Clear (",
          activeFilterCount,
          ")"
        ] })
      ] })
    ] }),
    visibleHistoryIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 rounded-xl border border-border/40 bg-card/50 p-2.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: toggleVisibleSelection, className: "h-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
        allVisibleSelected ? "Unselect Visible" : "Select Visible"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        selectedCount,
        " selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleDeleteActivityLogs(Array.from(selectedIds)), disabled: selectedCount === 0 || deletingIds.size > 0, className: "ml-auto h-8 text-destructive hover:bg-destructive/10 hover:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
        " Delete Selected"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "Loading…" }) : visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border/50 py-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "mx-auto mb-2 h-5 w-5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No activity in this range" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/50 rounded-xl border border-border/40 bg-card/30", children: visible.map((it) => {
        const tag = tagFor(it);
        const Icon = tag.Icon;
        const rowId = String(it.raw.id);
        const isSelected = selectedIds.has(rowId);
        const isDeleting = deletingIds.has(rowId);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: cn(isSelected && "bg-primary/5"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-2 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleActivitySelection(rowId), "aria-label": isSelected ? "Unselect activity log" : "Select activity log", className: cn("mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/60 transition-colors hover:bg-muted/60", isSelected && "border-primary bg-primary/10 text-primary"), children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleItemClick(it), className: "flex min-w-0 flex-1 items-start gap-3 rounded-lg px-1 py-0.5 text-left hover:bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", tag.cls), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: it.title }),
                it.amount != null && it.amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                  "SAR ",
                  Number(it.amount).toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground truncate", children: [
                it.shop_id && shopMap.get(it.shop_id) ? `${shopMap.get(it.shop_id)} · ` : "",
                new Date(it.at).toLocaleString(void 0, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleDeleteActivityLogs([rowId]), disabled: isDeleting, "aria-label": "Delete activity log", className: "mt-0.5 h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }) }, it.key);
      }) }),
      filtered.length > visible.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setLimit((n) => n + 10), children: [
        "Load more (",
        filtered.length - visible.length,
        ")"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DetailErrorBoundary, { onClose: () => setActiveHistory(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityDetailModal, { active: activeHistory, onClose: () => setActiveHistory(null), profMap, onDelete: (id) => handleDeleteActivityLogs([id]) }) })
  ] });
}
function fmtVal(field, v) {
  if (v === null || v === void 0 || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (MONEY_FIELDS.has(field) && (typeof v === "number" || !isNaN(Number(v)) && typeof v !== "object")) {
    return SAR(Number(v));
  }
  if (DATE_FIELDS.has(field)) {
    const s = String(v).slice(0, 10);
    const d = /* @__PURE__ */ new Date(s + "T00:00:00");
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(void 0, {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  }
  if (typeof v === "object") {
    if (Array.isArray(v)) {
      return v.map((it) => {
        const n = it?.name ?? it?.product_name ?? "Item";
        const q = it?.qty ?? it?.quantity;
        return q ? `${n} ×${q}` : n;
      }).join(", ");
    }
    return JSON.stringify(v);
  }
  return String(v);
}
function extractItems(snapshot) {
  if (!snapshot) return [];
  const arr = snapshot.items;
  if (!Array.isArray(arr)) return [];
  return arr.map((it) => ({
    name: it?.name ?? it?.product_name ?? "Item",
    qty: it?.qty ?? it?.quantity ?? 1,
    price: it?.price
  }));
}
const DISPLAY_ORDER = {
  shop_sales: ["txn_date", "shop_id", "customer_name", "payment_method", "total", "discount", "tax", "paid_amount", "due_amount", "invoice_number", "notes"],
  shop_purchases: ["txn_date", "shop_id", "supplier_name", "invoice_number", "total", "tax", "discount", "paid_amount", "due_amount", "notes"],
  shop_products: ["name", "barcode", "category", "sale_price", "purchase_price", "stock", "notes"],
  shop_entries: ["txn_date", "entry_type", "shop_id", "cashier", "cash_sale", "pos_sale", "bank_sale", "credit_sale", "purchase_amount", "withdraw_amount", "expense_amount", "difference", "notes"],
  transactions: ["txn_date", "type", "amount", "payment_method", "category", "subcategory", "notes"],
  company_transactions: ["txn_date", "type", "category", "amount", "notes"],
  employees: ["name", "phone", "salary", "opening_due", "shop_id"],
  employee_entries: ["txn_date", "employee_id", "entry_type", "amount", "notes"],
  pos_payments: ["txn_date", "customer_id", "amount", "method", "kind", "notes"],
  warehouse_ledger: ["txn_date", "entry_type", "party_name", "amount", "payment_status", "paid_amount", "remaining_due", "notes"],
  daily_closings: ["txn_date", "shop_id", "cash_sale", "pos_sale", "bank_sale", "credit_sale", "difference", "notes"],
  monthly_closings: ["month", "notes"]
};
const GENERIC_FIELDS = ["txn_date", "name", "amount", "total", "payment_method", "category", "notes"];
function ActivityDetailModal({
  active,
  onClose,
  profMap,
  onDelete
}) {
  const navigate = useNavigate();
  const [openingOriginal, setOpeningOriginal] = reactExports.useState(false);
  const {
    data: snapshot,
    isLoading: snapLoading
  } = useQuery({
    enabled: !!active,
    queryKey: ["activity_snapshot", active?.entity_type, active?.entity_id],
    queryFn: async () => {
      if (!active) return null;
      const {
        data
      } = await supabase.from(active.entity_type).select("*").eq("id", active.entity_id).maybeSingle();
      return data ?? null;
    }
  });
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops-lite"],
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? [],
    staleTime: 5 * 6e4
  });
  const shopMap = reactExports.useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);
  const reconstructed = reactExports.useMemo(() => {
    if (!active) return null;
    if (snapshot) return snapshot;
    if (active.action !== "soft_delete" && active.action !== "create") return null;
    const obj = {};
    for (const [k, ch] of Object.entries(active.changes ?? {})) {
      obj[k] = active.action === "create" ? ch.to : ch.from ?? ch.to;
    }
    return obj;
  }, [snapshot, active]);
  if (!active) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: false, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, {}) });
  }
  const action = active.action;
  const isCreate = action === "create";
  const isDel = action === "soft_delete";
  const isRes = action === "restore";
  const isEdit = action === "update";
  const badge = isCreate ? {
    label: "Created",
    bg: "bg-emerald-500",
    Icon: Plus
  } : isDel ? {
    label: "Deleted",
    bg: "bg-rose-500",
    Icon: Trash2
  } : isRes ? {
    label: "Restored",
    bg: "bg-emerald-500",
    Icon: RotateCcw
  } : {
    label: "Edited",
    bg: "bg-blue-500",
    Icon: Pencil
  };
  const BadgeIcon = badge.Icon;
  const entityLabel = ENTITY_LABEL[active.entity_type] ?? active.entity_type;
  const route = ENTITY_ROUTE[active.entity_type];
  const userName = active.changed_by ? profMap.get(active.changed_by) ?? "—" : "system";
  const businessDate = reconstructed?.txn_date ?? reconstructed?.sale_date ?? reconstructed?.month ?? null;
  const displayFields = (DISPLAY_ORDER[active.entity_type] ?? GENERIC_FIELDS).filter((k) => {
    const v = reconstructed?.[k];
    return v !== null && v !== void 0 && v !== "" && !(typeof v === "number" && v === 0 && !["amount", "total"].includes(k));
  });
  const items = extractItems(reconstructed);
  const fieldEntries = Object.entries(active.changes ?? {}).filter(([k]) => k !== "items");
  const renderValue = (field, v) => {
    if (field === "shop_id" && typeof v === "string") return shopMap.get(v) ?? "—";
    return fmtVal(field, v);
  };
  const openOriginal = async () => {
    if (!route) return;
    setOpeningOriginal(true);
    onClose();
    await navigate({
      to: route,
      search: {
        highlight: active.entity_id
      }
    });
    setOpeningOriginal(false);
  };
  const originalMissing = !snapLoading && !snapshot;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!active, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[88vh] overflow-y-auto p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "sr-only", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      badge.label,
      " ",
      entityLabel
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("relative px-5 pt-5 pb-4 text-white", badge.bg), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeIcon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider opacity-90", children: badge.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold leading-tight", children: [
          badge.label,
          " ",
          entityLabel
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 rounded-xl border border-border/40 bg-muted/30 p-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Action Time", value: new Date(active.changed_at).toLocaleString(void 0, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }) }),
        businessDate && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Business Date", value: fmtVal("txn_date", businessDate) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: isCreate ? "Created By" : isDel ? "Deleted By" : "Changed By", value: userName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Module", value: entityLabel })
      ] }),
      isEdit && (fieldEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg bg-muted/30 p-3 text-center text-xs text-muted-foreground", children: "No field-level changes recorded." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-card/50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Changes (",
          fieldEntries.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: fieldEntries.map(([f, ch]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border border-border/40 bg-background p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] font-medium text-muted-foreground", children: FIELD_LABEL[f] ?? f }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-rose-50 px-2 py-0.5 text-rose-700 line-through dark:bg-rose-500/10 dark:text-rose-300", children: renderValue(f, ch.from) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300", children: renderValue(f, ch.to) })
          ] })
        ] }, f)) })
      ] })),
      !isEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-card/50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: isDel ? "Entry before deletion" : isRes ? "Restored entry" : "Entry details" }),
        !reconstructed ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No data available." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: displayFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start justify-between gap-3 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs pt-0.5", children: FIELD_LABEL[f] ?? f }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[65%] text-right font-medium", children: renderValue(f, reconstructed[f]) })
        ] }, f)) }),
        items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg border border-border/40 bg-background p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
            "Products (",
            items.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              it.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "×",
                it.qty
              ] })
            ] }),
            it.price != null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tabular-nums", children: SAR(Number(it.price)) })
          ] }, i)) })
        ] }),
        reconstructed?.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: reconstructed.attachment_url, target: "_blank", rel: "noreferrer", className: "mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline", children: [
          "View attachment ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
        route && !originalMissing && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openOriginal, disabled: openingOriginal, className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
          " Open Original Entry"
        ] }),
        originalMissing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-center text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300", children: "This original record is no longer available." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => onDelete(active.id), className: "w-full text-destructive hover:bg-destructive/10 hover:text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
          " Delete Activity Log Only"
        ] })
      ] })
    ] })
  ] }) });
}
class DetailErrorBoundary extends React__default.Component {
  state = {
    hasError: false
  };
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(err) {
    console.error("[ActivityDetail]", err);
  }
  componentDidUpdate(prev) {
    if (prev.children !== this.props.children && this.state.hasError) {
      this.setState({
        hasError: false
      });
    }
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => {
        if (!o) {
          this.setState({
            hasError: false
          });
          this.props.onClose();
        }
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Unable to load activity details" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Something went wrong while opening this entry. Please try again." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          this.setState({
            hasError: false
          });
          this.props.onClose();
        }, children: "Close" })
      ] }) });
    }
    return this.props.children;
  }
}
function MetaRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium truncate", children: value })
  ] });
}
function SummaryCard({
  label,
  value,
  tone,
  active,
  onClick
}) {
  const toneCls = tone === "blue" ? "text-blue-700" : tone === "rose" ? "text-rose-700" : tone === "emerald" ? "text-emerald-700" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: cn("rounded-xl border bg-card px-3 py-2.5 text-left shadow-sm transition-all hover:shadow-md", active ? "border-primary ring-1 ring-primary/30" : "border-border/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-1 text-xl font-semibold tabular-nums", toneCls), children: value })
  ] });
}
export {
  ActivityPage as component
};
