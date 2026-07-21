import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { B as Button, I as Input, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, C as Card, ah as CardContent, d as cn } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { E as EmployeeFormDialog } from "./employee-form-dialog-BkPxYhm1.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { U as Users, P as Plus, y as Search, aa as Store, x as Phone, u as ChevronRight } from "../_libs/lucide-react.mjs";

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
function EmployeesIndex() {
  const [search, setSearch] = reactExports.useState("");
  const [shopFilter, setShopFilter] = reactExports.useState("all");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("id, name").eq("is_deleted", false).order("name");
      return data ?? [];
    }
  });
  const {
    data: employees = [],
    isLoading
  } = useQuery({
    queryKey: ["employees", "with-balances"],
    queryFn: async () => {
      const {
        data: emps,
        error
      } = await supabase.from("employees").select("id, name, shop_id, shop_name, mobile, iqama").eq("is_deleted", false).order("name");
      if (error) throw error;
      if (!emps || emps.length === 0) return [];
      const ids = emps.map((e) => e.id);
      const {
        data: entries
      } = await supabase.from("employee_entries").select("employee_id, entry_type, amount, txn_date").in("employee_id", ids).eq("is_deleted", false);
      const map = /* @__PURE__ */ new Map();
      for (const e of entries ?? []) {
        const m = map.get(e.employee_id) ?? {
          g: 0,
          r: 0,
          last: null
        };
        if (e.entry_type === "given") m.g += Number(e.amount);
        else m.r += Number(e.amount);
        if (!m.last || e.txn_date > m.last) m.last = e.txn_date;
        map.set(e.employee_id, m);
      }
      return emps.map((e) => {
        const m = map.get(e.id) ?? {
          g: 0,
          r: 0,
          last: null
        };
        return {
          ...e,
          total_given: m.g,
          total_received: m.r,
          balance: m.g - m.r,
          last_activity: m.last
        };
      });
    }
  });
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      if (shopFilter !== "all" && e.shop_id !== shopFilter) return false;
      if (!q) return true;
      return e.name.toLowerCase().includes(q) || (e.mobile ?? "").toLowerCase().includes(q) || (e.iqama ?? "").toLowerCase().includes(q) || (e.shop_name ?? "").toLowerCase().includes(q);
    });
  }, [employees, search, shopFilter]);
  const totals = reactExports.useMemo(() => {
    return employees.reduce((a, e) => ({
      given: a.given + e.total_given,
      received: a.received + e.total_received,
      outstanding: a.outstanding + Math.max(0, e.balance)
    }), {
      given: 0,
      received: 0,
      outstanding: 0
    });
  }, [employees]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Employees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Track money given, received and live balances." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full gap-2 sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "flex-1 sm:flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employees/expenses", children: "Employee Wallet" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), className: "flex-1 sm:flex-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add Employee"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Total Given", value: totals.given, tone: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Total Received", value: totals.received, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryTile, { label: "Outstanding", value: totals.outstanding, tone: "primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name, mobile, iqama…", className: "pl-9", maxLength: 80 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: shopFilter, onValueChange: setShopFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "sm:w-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All shops" }),
          shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 animate-pulse rounded-2xl bg-muted/40" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center gap-2 py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No employees yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Add an employee to start tracking money given and received." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setAddOpen(true), className: "mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
        " Add Employee"
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/employees/$employeeId", params: {
      employeeId: e.id
    }, className: "group block rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] tap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-bold text-primary", children: initials(e.name) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground", children: [
              e.shop_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
                " ",
                e.shop_name
              ] }),
              e.mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                " ",
                e.mobile
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(e.balance), size: "lg", className: cn(e.balance > 0 && "text-destructive", e.balance < 0 && "text-success", e.balance === 0 && "text-muted-foreground") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: e.balance > 0 ? "Due from employee" : e.balance < 0 ? "Advance" : "Settled" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Given ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: fmt(e.total_given) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Received ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: fmt(e.total_received) })
          ] })
        ] })
      ] })
    ] }, e.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeFormDialog, { open: addOpen, onOpenChange: setAddOpen })
  ] });
}
function SummaryTile({
  label,
  value,
  tone
}) {
  const cls = tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md", className: cn("mt-1", cls) })
  ] });
}
function initials(name) {
  return name.split(/\s+/).map((s) => s[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join("");
}
function fmt(n) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0
  }).format(n);
}
export {
  EmployeesIndex as component
};
