import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, I as Input, M as AlertDialog, aN as AlertDialogTrigger, B as Button, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, h as Badge, d as cn, af as SAR } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { SOFT_DELETABLE_TABLES, TABLE_LABELS, hardDeleteMany, restore, hardDelete } from "./soft-delete-DQY0d6eC.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { aW as Inbox, y as Search, T as Trash2, a as TriangleAlert, m as ChevronDown, h as Undo2 } from "../_libs/lucide-react.mjs";

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
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/isbot.mjs";
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
const AMOUNT_FIELDS = {
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
  company_transactions: (r) => Number(r.amount) || 0
};
const TITLE_FIELDS = {
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
  company_transactions: (r) => `${r.txn_type} · ${r.category}`
};
const KIND_FIELDS = {
  shop_entries: (r) => r.entry_type ?? null,
  warehouse_ledger: (r) => r.entry_type ?? null,
  employee_entries: (r) => r.entry_type ?? null,
  transactions: (r) => r.type ?? null,
  company_transactions: (r) => r.txn_type ?? null
};
const DATE_FIELDS = {
  shop_entries: (r) => r.txn_date,
  warehouse_ledger: (r) => r.txn_date,
  employee_entries: (r) => r.txn_date,
  transactions: (r) => r.txn_date,
  company_transactions: (r) => r.txn_date,
  shop_sales: (r) => r.sale_date ?? r.created_at?.slice(0, 10),
  shop_purchases: (r) => r.purchase_date ?? r.created_at?.slice(0, 10),
  shop_orders: (r) => r.created_at?.slice(0, 10)
};
const KIND_COLOR = {
  sale: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  purchase: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  expense: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  withdraw: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  cash_in: "bg-emerald-100 text-emerald-800",
  cash_out: "bg-rose-100 text-rose-800",
  salary: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  advance: "bg-amber-100 text-amber-800"
};
const TABLE_COLOR = {
  shop_entries: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  employee_entries: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  shop_sales: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  shop_purchases: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900",
  shop_products: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900",
  company_transactions: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  warehouse_ledger: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900",
  pos_customers: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900"
};
function RecycleBin() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = reactExports.useState("all");
  const [query, setQuery] = reactExports.useState("");
  const [expanded, setExpanded] = reactExports.useState(null);
  const { data: isAdmin = false, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  const queries = SOFT_DELETABLE_TABLES.map(
    (t) => useQuery({
      queryKey: ["trash", t],
      enabled: isAdmin,
      queryFn: async () => {
        const { data } = await supabase.from(t).select("*").eq("is_deleted", true).order("deleted_at", { ascending: false }).limit(200);
        return (data ?? []).map((r) => ({ ...r, __table: t }));
      }
    })
  );
  const isLoading = queries.some((q) => q.isLoading);
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? []
  });
  const profMap = reactExports.useMemo(
    () => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])),
    [profiles]
  );
  const { data: shops = [] } = useQuery({
    queryKey: ["shops-all-recycle"],
    enabled: isAdmin,
    queryFn: async () => (await supabase.from("shops").select("id,name")).data ?? []
  });
  const shopMap = reactExports.useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);
  const { data: cashiers = [] } = useQuery({
    queryKey: ["cashiers-all-recycle"],
    enabled: isAdmin,
    queryFn: async () => (await supabase.from("cashiers").select("id,name")).data ?? []
  });
  const cashierMap = reactExports.useMemo(() => new Map(cashiers.map((c) => [c.id, c.name])), [cashiers]);
  const rows = reactExports.useMemo(() => {
    const all = queries.flatMap(
      (q2) => (q2.data ?? []).map((r) => {
        const table = r.__table;
        const shopName = r.shop_id ? shopMap.get(r.shop_id) ?? null : r.shop_name ?? null;
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
          raw: r
        };
      })
    );
    const sorted = all.sort((a, b) => a.deleted_at < b.deleted_at ? 1 : -1);
    const byTab = filter === "all" ? sorted : sorted.filter((r) => r.table === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((r) => {
      const cashierName = r.raw.cashier_id ? cashierMap.get(r.raw.cashier_id) ?? "" : "";
      const blob = [
        r.title,
        r.shopName ?? "",
        r.raw.notes ?? "",
        cashierName,
        r.amount?.toString() ?? "",
        r.txnDate ?? "",
        r.kind ?? ""
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [queries.map((q) => q.dataUpdatedAt).join(","), filter, query, shopMap, cashierMap]);
  const invalidateAll = () => {
    [
      "trash",
      "txns",
      "shop_entries",
      "wh_ledger",
      "parties",
      "shops",
      "cashiers",
      "categories",
      "sub_categories",
      "employees",
      "employee-entries",
      "admin-sales",
      "admin-purchases",
      "admin-orders",
      "admin-products",
      "pos-customers-admin",
      "pos-due-map",
      "store-admin-overview",
      "store-products"
    ].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };
  reactExports.useEffect(() => {
    if (!isAdmin) return;
    const KEY = "recycle_bin_autoclean_v1";
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(KEY) === today) return;
    } catch {
    }
    (async () => {
      const { data, error } = await supabase.rpc("cleanup_recycle_bin", { _days: 7 });
      if (!error) {
        try {
          localStorage.setItem(KEY, today);
        } catch {
        }
        if (typeof data === "number" && data > 0) {
          toast.success(`Auto-cleaned ${data} old Recycle Bin record${data === 1 ? "" : "s"}`);
          invalidateAll();
        }
      }
    })();
  }, [isAdmin]);
  const onRestore = async (r) => {
    const { error } = await restore(r.table, r.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Record restored");
      invalidateAll();
    }
  };
  const onPurge = async (r) => {
    const { error } = await hardDelete(r.table, r.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Permanently deleted");
      invalidateAll();
    }
  };
  const [purging, setPurging] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(null);
  const onEmptyAll = async () => {
    if (!rows.length) return;
    setPurging(true);
    const total2 = rows.length;
    setProgress({ done: 0, total: total2 });
    const byTable = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const arr = byTable.get(r.table) ?? [];
      arr.push(r.id);
      byTable.set(r.table, arr);
    }
    let ok = 0, fail = 0, globalDone = 0;
    for (const [table, ids] of byTable) {
      const res = await hardDeleteMany(table, ids, 100, (done) => {
        setProgress({ done: globalDone + done, total: total2 });
      });
      ok += res.ok;
      fail += res.fail;
      globalDone += ids.length;
      setProgress({ done: globalDone, total: total2 });
    }
    setPurging(false);
    setProgress(null);
    if (fail) toast.error(`${ok} deleted, ${fail} failed`);
    else toast.success(`${ok} permanently deleted`);
    invalidateAll();
  };
  const counts = SOFT_DELETABLE_TABLES.reduce((acc, t, i) => {
    acc[t] = (queries[i].data ?? []).length;
    return acc;
  }, {});
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (roleLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-sm text-muted-foreground", children: "Loading…" });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-muted/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Admins only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Recycle Bin is restricted to administrators." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
          "Recycle Bin (",
          total,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Auto-deletes after 7 days" })
    ] }),
    purging && progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] font-medium text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Deleting permanently…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          progress.done,
          " / ",
          progress.total
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-destructive/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-destructive transition-[width] duration-150",
          style: { width: `${Math.round(progress.done / Math.max(1, progress.total) * 100)}%` }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search by amount, shop, cashier, note, date…",
          className: "h-9 pl-8 text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "all", onClick: () => setFilter("all"), label: "All", count: total }),
        SOFT_DELETABLE_TABLES.map(
          (t) => counts[t] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            FilterChip,
            {
              active: filter === t,
              onClick: () => setFilter(t),
              label: TABLE_LABELS[t].label,
              count: counts[t]
            },
            t
          ) : null
        )
      ] }),
      rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            disabled: purging,
            className: "shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              purging ? "Emptying…" : filter === "all" ? "Empty Bin" : "Delete All"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
              " Permanent Delete"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              rows.length,
              " record",
              rows.length === 1 ? "" : "s",
              " will be permanently removed. This action cannot be undone."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: onEmptyAll,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: "Delete Permanently"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border/50 py-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "mx-auto mb-2 h-5 w-5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: query ? "No matching records found" : "Recycle Bin is empty" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: rows.map((r) => {
      const key = `${r.table}-${r.id}`;
      const isOpen = expanded === key;
      const cashierName = r.raw.cashier_id ? cashierMap.get(r.raw.cashier_id) : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "overflow-hidden rounded-xl border border-border/50 bg-card transition-shadow hover:shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setExpanded(isOpen ? null : key),
                className: "flex w-full items-start gap-2.5 px-3 py-2.5 text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: cn("text-[10px] font-medium", TABLE_COLOR[r.table] ?? ""),
                          children: TABLE_LABELS[r.table].label
                        }
                      ),
                      r.kind && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                        KIND_COLOR[r.kind] ?? "bg-muted text-muted-foreground"
                      ), children: r.kind }),
                      r.shopName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs font-medium text-foreground", children: r.shopName })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
                        "Deleted ",
                        new Date(r.deleted_at).toLocaleDateString(),
                        r.txnDate ? ` · ${r.txnDate}` : ""
                      ] }),
                      r.amount !== null && r.amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-sm font-semibold tabular-nums", children: SAR(r.amount) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn(
                    "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  ) })
                ]
              }
            ),
            isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t border-border/40 bg-muted/20 px-3 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DetailGrid, { items: [
                ["Type", r.title || "—"],
                ["Shop", r.shopName ?? "—"],
                ["Date", r.txnDate ?? "—"],
                ["Amount", r.amount !== null ? SAR(r.amount) : "—"],
                ["Cashier", cashierName ?? "—"],
                ["Module", TABLE_LABELS[r.table].source],
                ["Created", r.raw.created_at ? new Date(r.raw.created_at).toLocaleString() : "—"],
                ["Deleted", new Date(r.deleted_at).toLocaleString()],
                ["Deleted by", r.deleted_by ? profMap.get(r.deleted_by) ?? "—" : "—"],
                ["Ref ID", String(r.id).slice(0, 8)]
              ] }),
              r.raw.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background/60 px-2 py-1.5 text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-muted-foreground", children: "Note: " }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.raw.notes })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-3.5 w-3.5" }),
                    " Restore"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Restore this record?" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 rounded-md border border-border/50 bg-muted/30 p-2.5 text-xs", children: [
                        r.shopName && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Shop", v: r.shopName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Type", v: r.title || TABLE_LABELS[r.table].label }),
                        r.amount !== null && r.amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Amount", v: SAR(r.amount) }),
                        r.txnDate && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Date", v: r.txnDate })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => onRestore(r), children: "Restore" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                        " Delete forever"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 text-destructive", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
                        " Permanent Delete"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This record will be permanently removed. This action cannot be undone." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs", children: [
                          r.shopName && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Shop", v: r.shopName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Type", v: r.title || TABLE_LABELS[r.table].label }),
                          r.amount !== null && r.amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Amount", v: SAR(r.amount) }),
                          r.txnDate && /* @__PURE__ */ jsxRuntimeExports.jsx(Pair, { k: "Date", v: r.txnDate })
                        ] })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDialogAction,
                        {
                          onClick: () => onPurge(r),
                          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                          children: "Delete Permanently"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ]
        },
        key
      );
    }) })
  ] });
}
function DetailGrid({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5", children: items.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-medium text-foreground", children: v })
  ] }, k)) });
}
function Pair({ k, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: v })
  ] });
}
function FilterChip({
  active,
  onClick,
  label,
  count
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-background hover:bg-muted/50"
      ),
      children: [
        label,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
          "· ",
          count
        ] })
      ]
    }
  );
}
export {
  RecycleBin
};
