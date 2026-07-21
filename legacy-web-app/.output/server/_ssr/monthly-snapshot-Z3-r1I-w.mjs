import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, s as useUserAccess, C as Card, L as Label, I as Input, B as Button, af as SAR, S as Sheet, e as SheetContent, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, f as SheetHeader, g as SheetTitle, J as sortShops, d as cn } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { L as Lock, P as Plus, S as ShieldAlert, ac as FileChartColumnIncreasing, ah as CalendarRange, J as Printer, T as Trash2 } from "../_libs/lucide-react.mjs";

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
const COMPANY_OPENING = 175e3;
function pad(n) {
  return String(n).padStart(2, "0");
}
function monthFirstISO(year, month0) {
  return `${year}-${pad(month0 + 1)}-01`;
}
function monthLastISO(year, month0) {
  const last = new Date(year, month0 + 1, 0).getDate();
  return `${year}-${pad(month0 + 1)}-${pad(last)}`;
}
function monthLabel(year, month0) {
  return new Date(year, month0, 1).toLocaleDateString(void 0, {
    month: "long",
    year: "numeric"
  });
}
function previousMonth() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return {
    year: d.getFullYear(),
    month0: d.getMonth()
  };
}
function parseMonthISO(iso) {
  const [y, m] = iso.split("-").map(Number);
  return {
    year: y,
    month0: (m || 1) - 1
  };
}
async function computeSnapshot(year, month0) {
  const from = monthFirstISO(year, month0);
  const to = monthLastISO(year, month0);
  const [shopsRes, entriesRes, productsRes, customersRes, salesRes, paymentsRes, empRes, partiesRes] = await Promise.all([
    supabase.from("shops").select("*").eq("is_deleted", false),
    supabase.from("shop_entries").select("*").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to),
    supabase.from("shop_products").select("stock,purchase_price").eq("is_deleted", false),
    supabase.from("pos_customers").select("opening_due").eq("is_active", true).eq("is_deleted", false),
    supabase.from("shop_sales").select("due_amount").eq("is_deleted", false).neq("status", "cancelled"),
    supabase.from("pos_payments").select("amount,kind"),
    // Employee entries: cumulative through end-of-month.
    supabase.from("employee_entries").select("entry_type,amount,txn_date").eq("is_deleted", false).lte("txn_date", to),
    // Supplier opening payables — best lightweight signal we have without scanning all transactions.
    supabase.from("parties").select("party_type,opening_payable").eq("is_deleted", false)
  ]);
  const shops = sortShops(shopsRes.data ?? []);
  const entries = entriesRes.data ?? [];
  const shopSummaries = shops.map((s) => {
    const rows = entries.filter((e) => e.shop_id === s.id);
    let pos = 0, cash = 0, bank = 0, credit = 0, purchase = 0, expense = 0, withdraw = 0;
    let simpleCashIn = 0, simpleExpense = 0;
    for (const e of rows) {
      pos += Number(e.pos_sale || 0);
      cash += Number(e.cash_sale || 0);
      bank += Number(e.bank_sale || 0);
      credit += Number(e.credit_sale || 0);
      purchase += Number(e.purchase_amount || 0);
      expense += Number(e.expense_amount || 0);
      withdraw += Number(e.withdraw_amount || 0);
      if (s.shop_type === "simple_cash") {
        if (e.entry_type === "sale") simpleCashIn += Number(e.cash_sale || 0);
        else if (e.entry_type === "expense") simpleExpense += Number(e.expense_amount || 0);
      }
    }
    const isSimple = s.shop_type === "simple_cash";
    const cash_position = isSimple ? simpleCashIn - simpleExpense : cash + withdraw - (purchase + expense);
    const expected_balance = isSimple ? 0 : bank - withdraw;
    const total_sale = isSimple ? simpleCashIn : pos;
    return {
      shop_id: s.id,
      shop_name: s.name,
      total_sale,
      cash_sale: isSimple ? simpleCashIn : cash,
      bank_sale: isSimple ? 0 : bank,
      credit_sale: isSimple ? 0 : credit,
      purchase: isSimple ? 0 : purchase,
      expense: isSimple ? simpleExpense : expense,
      withdraw: isSimple ? 0 : withdraw,
      expected_balance,
      cash_position
    };
  });
  const totalCashPosition = shopSummaries.reduce((s, x) => s + x.cash_position, 0);
  const totalBankBalance = shopSummaries.reduce((s, x) => s + x.expected_balance, 0);
  const currentStock = (productsRes.data ?? []).reduce((s, p) => {
    return s + Math.max(0, Number(p.stock ?? 0)) * Math.max(0, Number(p.purchase_price ?? 0));
  }, 0);
  const openingDue = (customersRes.data ?? []).reduce((s, r) => s + Number(r.opening_due ?? 0), 0);
  const dueSum = (salesRes.data ?? []).reduce((s, r) => s + Number(r.due_amount ?? 0), 0);
  const paidIn = (paymentsRes.data ?? []).filter((p) => p.kind === "payment_in").reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const receivable = Math.max(0, openingDue + dueSum - paidIn);
  const wholesaleValue = currentStock + receivable;
  let given = 0, received = 0;
  for (const e of empRes.data ?? []) {
    const amt = Number(e.amount) || 0;
    if (e.entry_type === "given") given += amt;
    else received += amt;
  }
  const totalSupplierDue = (partiesRes.data ?? []).filter((p) => p.party_type === "supplier").reduce((s, r) => s + Number(r.opening_payable ?? 0), 0);
  return {
    company: {
      total_cash_position: totalCashPosition,
      total_bank_balance: totalBankBalance,
      total_invest: COMPANY_OPENING + totalCashPosition,
      wholesale_value: wholesaleValue
    },
    shops: shopSummaries,
    wholesale: {
      current_stock: currentStock,
      receivable,
      value: wholesaleValue
    },
    employees: {
      given,
      received,
      balance: given - received
    },
    suppliers: {
      total_due: totalSupplierDue
    },
    meta: {
      company_opening: COMPANY_OPENING,
      generated_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
}
function MonthlySnapshotPage() {
  const {
    user
  } = useAuth();
  const {
    isAdmin
  } = useUserAccess();
  const qc = useQueryClient();
  const prev = previousMonth();
  const [selMonth, setSelMonth] = reactExports.useState(monthFirstISO(prev.year, prev.month0));
  const [creating, setCreating] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: snapshots = [],
    isLoading
  } = useQuery({
    queryKey: ["monthly_snapshots"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("monthly_snapshots").select("*").order("month", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const existing = reactExports.useMemo(() => new Set(snapshots.map((s) => s.month)), [snapshots]);
  const createSnapshot = async () => {
    if (!isAdmin) {
      toast.error("Admins only");
      return;
    }
    if (!user) {
      toast.error("Sign in required");
      return;
    }
    if (existing.has(selMonth)) {
      toast.error("Snapshot for this month already exists");
      return;
    }
    setCreating(true);
    try {
      const {
        year,
        month0
      } = parseMonthISO(selMonth);
      const payload = await computeSnapshot(year, month0);
      const label = monthLabel(year, month0);
      const {
        error
      } = await supabase.from("monthly_snapshots").insert({
        month: selMonth,
        label,
        payload,
        created_by: user.id
      });
      if (error) throw error;
      toast.success(`Snapshot saved for ${label}`);
      qc.invalidateQueries({
        queryKey: ["monthly_snapshots"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Could not create snapshot");
    } finally {
      setCreating(false);
    }
  };
  const performDelete = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("monthly_snapshots").delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Snapshot deleted");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["monthly_snapshots"]
    });
  };
  const openSnapshot = snapshots.find((s) => s.id === openId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold tracking-tight", children: "Monthly Snapshot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Read-only month-end summary. Does not affect any reports, balances, or live data." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
        " Read-only archive"
      ] })
    ] }),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Create Monthly Snapshot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Captures month totals + current wholesale / employee / supplier balances." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", className: "h-10", value: selMonth.slice(0, 7), onChange: (e) => {
            const v = e.target.value;
            if (/^\d{4}-\d{2}$/.test(v)) setSelMonth(`${v}-01`);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: createSnapshot, disabled: creating || existing.has(selMonth), className: "h-10 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          creating ? "Saving…" : existing.has(selMonth) ? "Already exists" : "Create Snapshot"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl border-amber-200 bg-amber-50/50 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-[12px] text-amber-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4" }),
      "Only Admins can create or delete snapshots. You can view existing snapshots below."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Saved Snapshots" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : snapshots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "mx-auto mb-2 h-6 w-6 text-muted-foreground/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No snapshots yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: isAdmin ? "Create your first month-end snapshot above." : "Ask an admin to create the first snapshot." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: snapshots.map((s) => {
        const p = s.payload || {};
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenId(s.id), className: "group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 font-display text-sm font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-4 w-4 text-muted-foreground" }),
              s.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
              "Saved ",
              new Date(s.created_at).toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] tabular-nums text-muted-foreground", children: [
              "Invest: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: SAR(p.company?.total_invest ?? 0) }),
              "  ·  ",
              "WH: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: SAR(p.company?.wholesale_value ?? 0) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100", children: "Open →" })
        ] }, s.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!openId, onOpenChange: (o) => !o && setOpenId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "bottom", className: "h-[92vh] overflow-y-auto p-0", children: openSnapshot && /* @__PURE__ */ jsxRuntimeExports.jsx(SnapshotDetail, { snapshot: openSnapshot, canDelete: isAdmin, onDelete: () => {
      setOpenId(null);
      setDeleteId(openSnapshot.id);
    } }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete snapshot?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This permanently removes the saved month-end summary. No transactions are affected." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: performDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function SnapshotDetail({
  snapshot,
  canDelete,
  onDelete
}) {
  const p = snapshot.payload || {};
  const shops = p.shops ?? [];
  const company = p.company ?? {
    total_cash_position: 0,
    total_bank_balance: 0,
    total_invest: 0,
    wholesale_value: 0
  };
  const handlePrint = () => window.print();
  const sum = (k) => shops.reduce((s, x) => s + (Number(x[k]) || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @media print {
          body * { visibility: hidden !important; }
          #snapshot-print, #snapshot-print * { visibility: visible !important; }
          #snapshot-print {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important; padding: 16px !important; background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "sticky top-0 z-10 border-b bg-background px-4 py-3 no-print", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "text-base", children: [
        snapshot.label,
        " · Snapshot"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 gap-1.5", onClick: handlePrint, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-3.5 w-3.5" }),
          " Print / PDF"
        ] }),
        canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 gap-1.5 text-destructive hover:bg-destructive/10", onClick: onDelete, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
          " Delete"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "snapshot-print", className: "mx-auto max-w-3xl px-4 py-5 text-[12.5px] text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-foreground/30 pb-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[22px] font-bold tracking-tight", children: "ShRiAh Group" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[15px] font-semibold", children: "Monthly Snapshot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
          snapshot.label,
          " · Generated ",
          new Date(snapshot.created_at).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Company Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Rows, { rows: [["Total Cash Position", company.total_cash_position], ["Total Bank Balance", company.total_bank_balance], ["Total Invest", company.total_invest, true], ["Wholesale Value", company.wholesale_value]] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Shop Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-[11.5px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/40 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 pr-2 font-semibold", children: "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Total Sale" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Cash" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Bank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Credit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Purchase" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Expense" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Withdraw" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 px-1 text-right font-semibold", children: "Exp. Bank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5 pl-1 text-right font-semibold", children: "Cash Pos." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          shops.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "py-3 text-center text-muted-foreground", children: "No shop data." }) }) : shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-foreground/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pr-2 font-medium", children: s.shop_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.total_sale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.cash_sale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.bank_sale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.credit_sale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.purchase) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.expense) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.withdraw) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 px-1 text-right tabular-nums", children: SAR(s.expected_balance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1 pl-1 text-right font-semibold tabular-nums", children: SAR(s.cash_position) })
          ] }, s.shop_id)),
          shops.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-foreground/60 font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pr-2", children: "TOTAL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("total_sale")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("cash_sale")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("bank_sale")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("credit_sale")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("purchase")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("expense")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("withdraw")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-1 text-right tabular-nums", children: SAR(sum("expected_balance")) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pl-1 text-right tabular-nums", children: SAR(sum("cash_position")) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Wholesale Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Rows, { rows: [["Current Stock", p.wholesale?.current_stock ?? 0], ["Receivable", p.wholesale?.receivable ?? 0], ["Wholesale Value", p.wholesale?.value ?? 0, true]] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Employee Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Rows, { rows: [["Given (cumulative)", p.employees?.given ?? 0], ["Received (cumulative)", p.employees?.received ?? 0], ["Total Employee Balance", p.employees?.balance ?? 0, true]] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { children: "Supplier Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Rows, { rows: [["Total Supplier Due", p.suppliers?.total_due ?? 0, true]] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 border-t border-foreground/20 pt-2 text-center text-[10px] text-muted-foreground", children: "This snapshot is a read-only archive. It does not affect any live calculations or reports." })
    ] })
  ] });
}
function SectionTitle({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 mb-1 border-b border-foreground/20 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/80", children });
}
function Rows({
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-foreground/10", children: rows.map(([label, val, emphasis], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-baseline justify-between py-1.5", emphasis && "font-bold"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12.5px]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(val) })
  ] }, i)) });
}
export {
  MonthlySnapshotPage as component
};
