import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { s as useUserAccess, k as useAuth, C as Card, ah as CardContent, d as cn, Z as DropdownMenu, _ as DropdownMenuTrigger, B as Button, $ as DropdownMenuContent, at as DropdownMenuLabel, a0 as DropdownMenuItem, a1 as DropdownMenuSeparator, I as Input, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { A as AttachmentLightbox } from "./attachment-lightbox-DWyyAMyd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as computeWalletTotals, e as exportWalletPDF, a as exportWalletExcel, s as shareWalletWhatsApp } from "./employee-wallet-CihY7fyt.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/jspdf.mjs";
import { S as ShieldAlert, av as EllipsisVertical, ba as SlidersHorizontal, aX as FileDown, aH as FileSpreadsheet, Y as Share2, J as Printer, y as Search, f as Clock, W as Wallet, u as ChevronRight, aD as Receipt, bf as CircleArrowDown, ad as CircleArrowUp, n as Check } from "../_libs/lucide-react.mjs";

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
import "../_libs/xlsx.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
function presetRange(p) {
  const today = /* @__PURE__ */ new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  if (p === "today") return {
    from: iso(today),
    to: iso(today)
  };
  if (p === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return {
      from: iso(y),
      to: iso(y)
    };
  }
  if (p === "week") {
    const s2 = new Date(today);
    s2.setDate(s2.getDate() - 6);
    return {
      from: iso(s2),
      to: iso(today)
    };
  }
  const s = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    from: iso(s),
    to: iso(today)
  };
}
function AllEmployeeWalletPage() {
  const {
    isAdmin,
    isManager
  } = useUserAccess();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const canView = isAdmin || isManager;
  const [empFilter, setEmpFilter] = reactExports.useState("all");
  const [shopFilter, setShopFilter] = reactExports.useState("all");
  const [catFilter, setCatFilter] = reactExports.useState("all");
  const [kindFilter, setKindFilter] = reactExports.useState("all");
  const [preset, setPreset] = reactExports.useState("month");
  const initial = presetRange("month");
  const [fromDate, setFromDate] = reactExports.useState(initial.from);
  const [toDate, setToDate] = reactExports.useState(initial.to);
  const [search, setSearch] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const applyPreset = (p) => {
    setPreset(p);
    if (p === "custom") return;
    const r = presetRange(p);
    setFromDate(r.from);
    setToDate(r.to);
  };
  const {
    data: employees = []
  } = useQuery({
    queryKey: ["employees", "for-wallet-linked"],
    enabled: canView,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employees").select("id, name, shop_id, shop_name, user_id").eq("is_deleted", false).not("user_id", "is", null).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const {
    data: categories = []
  } = useQuery({
    queryKey: ["employee-expense-categories", "filter"],
    enabled: canView,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employee_expense_categories").select("id, name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const {
    data: rows = [],
    isLoading
  } = useQuery({
    queryKey: ["employee-wallet", "all", fromDate, toDate],
    enabled: canView,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("employee_expenses").select("id, employee_id, kind, status, amount, category, note, txn_date, attachment_url, created_at").eq("is_deleted", false).gte("txn_date", fromDate).lte("txn_date", toDate).order("txn_date", {
        ascending: false
      }).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const empById = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    employees.forEach((e) => m.set(e.id, e));
    return m;
  }, [employees]);
  const shops = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Map();
    employees.forEach((e) => {
      if (e.shop_id && e.shop_name) set.set(e.shop_id, e.shop_name);
    });
    return Array.from(set, ([id, name]) => ({
      id,
      name
    }));
  }, [employees]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((x) => {
      const emp = empById.get(x.employee_id);
      if (!emp) return false;
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
  const totals = reactExports.useMemo(() => computeWalletTotals(filtered), [filtered]);
  const walletBalanceByEmp = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const cur = map.get(r.employee_id) ?? {
        deposit: 0,
        expense: 0,
        balance: 0,
        pending: 0
      };
      if (r.kind === "deposit") {
        if (r.status === "verified") cur.deposit += Number(r.amount);
        else if (r.status === "pending") cur.pending += 1;
      } else cur.expense += Number(r.amount);
      cur.balance = cur.deposit - cur.expense;
      map.set(r.employee_id, cur);
    }
    return map;
  }, [rows]);
  const perEmployee = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const x of filtered) {
      const cur = map.get(x.employee_id) ?? {
        total: 0,
        count: 0
      };
      cur.total += Number(x.amount);
      cur.count += 1;
      map.set(x.employee_id, cur);
    }
    return Array.from(map, ([empId, v]) => ({
      empId,
      ...v
    })).sort((a, b) => b.total - a.total);
  }, [filtered]);
  const verifyMut = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("employee_expenses").update({
        status: "verified",
        verified_by: user?.id,
        verified_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deposit verified");
      qc.invalidateQueries({
        queryKey: ["employee-wallet"]
      });
    },
    onError: (e) => toast.error(e.message || "Failed")
  });
  const nameLookup = (id) => empById.get(id)?.name ?? "Unknown";
  if (!canView) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-page-stack", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mx-auto mb-3 h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Admin/Manager access required." })
    ] }) }) });
  }
  const presetChips = [{
    key: "today",
    label: "Today"
  }, {
    key: "yesterday",
    label: "Yesterday"
  }, {
    key: "week",
    label: "This Week"
  }, {
    key: "month",
    label: "This Month"
  }, {
    key: "custom",
    label: "Custom"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold", children: "Employee Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Tracking only — never affects company accounting." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.balance, size: "md", className: cn(totals.balance >= 0 ? "text-primary" : "text-destructive") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-9 w-9 shrink-0", "aria-label": "More actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "text-[10px]", children: "Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setShowFilters((v) => !v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }),
              " ",
              showFilters ? "Hide filters" : "Filters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => exportWalletPDF(filtered, nameLookup), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4" }),
              " Export PDF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => exportWalletExcel(filtered, nameLookup), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
              " Export Excel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => shareWalletWhatsApp(filtered, nameLookup), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
              " Share Report"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => window.print(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
              " Print"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: presetChips.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => applyPreset(p.key), className: cn("rounded-full border px-3 py-1 text-[11px] font-medium transition-colors", preset === p.key ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-card text-muted-foreground hover:border-primary/40"), children: p.label }, p.key)) }),
    preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: fromDate, onChange: (e) => setFromDate(e.target.value), className: "h-9 text-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: toDate, onChange: (e) => setToDate(e.target.value), className: "h-9 text-xs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Deposit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.deposit, size: "sm", className: "text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Expense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totals.expense, size: "sm", className: "text-destructive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: filtered.length })
      ] })
    ] }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-2xl border border-border/60 bg-card p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search employee, note, or amount", className: "h-9 pl-7 text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: empFilter, onValueChange: setEmpFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Employee" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All employees" }),
            employees.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: e.id, children: e.name }, e.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: shopFilter, onValueChange: setShopFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Shop" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All shops" }),
            shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: catFilter, onValueChange: setCatFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All categories" }),
            categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.name, children: c.name }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: kindFilter, onValueChange: (v) => setKindFilter(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Type" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All types" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "expense", children: "Expense" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "deposit", children: "Deposit" })
          ] })
        ] })
      ] })
    ] }),
    perEmployee.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "By employee" }),
      perEmployee.map(({
        empId,
        count
      }) => {
        const emp = empById.get(empId);
        const w = walletBalanceByEmp.get(empId) ?? {
          balance: 0,
          pending: 0
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/employees/$employeeId", params: {
          employeeId: empId
        }, className: "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold", children: emp?.name?.[0] ?? "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-semibold", children: [
              emp?.name ?? "Unknown",
              w.pending > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
                " ",
                w.pending,
                " pending"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              emp?.shop_name ?? "—",
              " · ",
              count,
              " in range"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3" }),
              " Wallet"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: w.balance, size: "sm", className: cn(w.balance >= 0 ? "text-primary" : "text-destructive") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
        ] }, empId);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: [
        "All transactions (",
        filtered.length,
        ")"
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 animate-pulse rounded-2xl bg-muted/40" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-8 text-center text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "mx-auto mb-2 h-6 w-6" }),
        "No transactions match these filters."
      ] }) }) : filtered.map((x) => {
        const emp = empById.get(x.employee_id);
        const isDeposit = x.kind === "deposit";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3", children: [
          x.attachment_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLightbox(x.attachment_url), className: "h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: x.attachment_url, alt: "Receipt", className: "h-full w-full object-cover", loading: "lazy" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: emp?.name ?? "Unknown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", isDeposit ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"), children: [
                isDeposit ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-2.5 w-2.5" }),
                isDeposit ? "Deposit" : x.category ?? "Expense"
              ] }),
              x.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
                " Pending"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
              new Date(x.txn_date).toLocaleDateString(),
              " · ",
              x.note
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(x.amount), size: "sm", className: cn("shrink-0", isDeposit ? "text-success" : "text-destructive") }),
          x.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-8 w-8", title: "Verify", onClick: () => verifyMut.mutate(x.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
        ] }, x.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentLightbox, { open: !!lightbox, url: lightbox, onClose: () => setLightbox(null) })
  ] });
}
export {
  AllEmployeeWalletPage as component
};
