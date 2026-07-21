import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, C as Card, ah as CardContent, d as cn, B as Button, I as Input, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as EmployeeExpenseDialog } from "./employee-expense-dialog-Z_5ikAO2.mjs";
import { c as computeWalletTotals } from "./employee-wallet-CihY7fyt.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/jspdf.mjs";
import { aD as Receipt, W as Wallet, ad as CircleArrowUp, bf as CircleArrowDown, q as Paperclip, f as Clock, a5 as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";

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
import "./image-upload-CX99TgIR.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
function MyWalletPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState("month");
  const [customFrom, setCustomFrom] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [customTo, setCustomTo] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [dialogKind, setDialogKind] = reactExports.useState("expense");
  const [editing, setEditing] = reactExports.useState(null);
  const [delTarget, setDelTarget] = reactExports.useState(null);
  const {
    data: employee,
    isLoading: empLoading
  } = useQuery({
    queryKey: ["my-employee-link", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employees").select("id, name, shop_name").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: rows = []
  } = useQuery({
    queryKey: ["employee-wallet", employee?.id],
    enabled: !!employee?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employee_expenses").select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at, created_by").eq("employee_id", employee.id).eq("is_deleted", false).order("txn_date", {
        ascending: false
      }).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const totals = reactExports.useMemo(() => computeWalletTotals(rows), [rows]);
  const filtered = reactExports.useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "custom") return rows.filter((r) => r.txn_date >= customFrom && r.txn_date <= customTo);
    const now = /* @__PURE__ */ new Date();
    const start = new Date(now);
    if (filter === "today") start.setHours(0, 0, 0, 0);
    else if (filter === "week") {
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (filter === "month") start.setDate(1);
    const startISO = start.toISOString().slice(0, 10);
    return rows.filter((r) => r.txn_date >= startISO);
  }, [rows, filter, customFrom, customTo]);
  const delMut = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("employee_expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({
        queryKey: ["employee-wallet"]
      });
      qc.invalidateQueries({
        queryKey: ["employee-expenses"]
      });
      setDelTarget(null);
    },
    onError: (e) => toast.error(e.message || "Failed to delete")
  });
  if (empLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted/40" });
  if (!employee) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-page-stack", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "mx-auto mb-3 h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Not linked to an employee profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Ask an admin to link your login to your employee record from Employees → Edit." })
    ] }) }) });
  }
  const canEdit = (e) => {
    if (!e.created_at) return false;
    const age = Date.now() - new Date(e.created_at).getTime();
    return age < 24 * 60 * 60 * 1e3 && e.created_by === user?.id;
  };
  const openNew = (kind) => {
    setEditing(null);
    setDialogKind(kind);
    setDialogOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold", children: "My Wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        employee.name,
        employee.shop_name ? ` · ${employee.shop_name}` : ""
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-2xl border p-4", totals.balance >= 0 ? "border-primary/40 bg-primary/5" : "border-destructive/40 bg-destructive/5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" }),
        " Wallet Balance"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.balance, size: "lg", className: cn(totals.balance >= 0 ? "text-primary" : "text-destructive") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: totals.balance >= 0 ? "You are still holding this much company money." : "The company owes you this amount." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Total Deposit", value: totals.deposit, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Total Expense", value: totals.expense, tone: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Deposit (This Month)", value: totals.depositMonth, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Expense (This Month)", value: totals.expenseMonth, tone: "destructive" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => openNew("expense"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4 text-destructive" }),
        " New Expense"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => openNew("deposit"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4 text-success" }),
        " New Deposit"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["today", "week", "month", "custom", "all"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: cn("rounded-full border px-3 py-1 text-[11px] font-medium capitalize transition-colors", filter === f ? "border-primary bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:border-primary/40"), children: f === "all" ? "All" : f === "today" ? "Today" : f === "week" ? "This Week" : f === "month" ? "This Month" : "Custom" }, f)) }),
    filter === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value), className: "h-9 text-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value), className: "h-9 text-xs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-xs text-muted-foreground", children: "No transactions in this range." }) }) : filtered.map((e) => {
      const isDeposit = e.kind === "deposit";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", isDeposit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"), children: isDeposit ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: isDeposit ? "Deposit" : e.category ?? "Expense" }),
            e.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3 text-muted-foreground" }),
            e.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
              " Pending"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
            new Date(e.txn_date).toLocaleDateString(),
            " · ",
            e.note
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(e.amount), size: "md", className: cn("shrink-0", isDeposit ? "text-success" : "text-destructive") }),
        canEdit(e) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => {
            setEditing(e);
            setDialogKind(e.kind);
            setDialogOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", onClick: () => setDelTarget(e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, e.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeExpenseDialog, { open: dialogOpen, onOpenChange: setDialogOpen, employeeId: employee.id, expense: editing, initialKind: dialogKind }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!delTarget, onOpenChange: (v) => {
      if (!v) setDelTarget(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this wallet entry?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This only removes the wallet record. It does not affect any company accounting." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", onClick: () => delTarget && delMut.mutate(delTarget.id), children: "Delete" })
      ] })
    ] }) })
  ] });
}
function SummaryTile({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md", className: cn("mt-0.5", tone === "success" && "text-success", tone === "destructive" && "text-destructive") })
  ] });
}
export {
  MyWalletPage as component
};
