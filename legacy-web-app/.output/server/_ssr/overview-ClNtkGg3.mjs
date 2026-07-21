import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { J as sortShops, B as Button, d as cn, P as Popover, p as PopoverTrigger, q as PopoverContent, L as Label, I as Input, C as Card, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, k as useAuth, o as useWorkingDate, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, T as Textarea, G as DialogFooter, u as useConfirm } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { I as InfoButton } from "./info-button-BBedyB3N.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useShopPositions } from "./use-shop-positions-B07f-IJE.mjs";
import { u as useWholesaleFinancials } from "./use-wholesale-financials-C4OBwATG.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { P as Plus, aT as CalendarDays, ao as RefreshCw, U as Users, bf as CircleArrowDown, aa as Store, ay as Coins, ax as TrendingDown, aD as Receipt, ae as TrendingUp, l as Sparkles, ad as CircleArrowUp, aK as Settings2, q as Paperclip, X, b8 as Copy, Y as Share2, n as Check, a5 as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";

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
import "./help-content-CrTK3PSB.mjs";
const fmt = (n) => Number(n || 0).toFixed(2);
function LiveFormulaSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  items,
  total,
  totalLabel = "Result",
  tone = "neutral"
}) {
  const buildText = () => {
    const lines = [
      `*${title}*`,
      ...items.map((i) => `${i.op ?? "+"} ${i.label}: SAR ${fmt(i.value)}`),
      `= ${totalLabel}: SAR ${fmt(total)}`
    ];
    return lines.join("\n");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      toast.success("Formula copied");
    } catch {
      toast.error("Could not copy");
    }
  };
  const share = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
  };
  const toneClass = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[85vh] overflow-y-auto rounded-t-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Live formula"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: title })
      ] }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1.5", children: [
      items.map((i, idx) => {
        const sign = i.op ?? "+";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5",
              i.muted && "opacity-60"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      sign === "-" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                    ),
                    children: sign
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium", children: i.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm tabular-nums", children: [
                "SAR ",
                fmt(i.value)
              ] })
            ]
          },
          idx
        );
      }),
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-xs text-muted-foreground", children: "No values yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
        "= ",
        totalLabel
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: total, size: "xl", className: toneClass })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: copy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Copy"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: share, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1.5 h-3.5 w-3.5" }),
        " WhatsApp"
      ] })
    ] })
  ] }) });
}
const DEFAULT_INCOME_CATEGORIES = ["Outside Income", "Misc Income", "Owner Deposit"];
const DEFAULT_COST_CATEGORIES = ["Room Expense", "Profit Share", "Electricity", "Rent", "Fuel", "Repairs", "Other Costs"];
function getRange(key, custom) {
  const today = /* @__PURE__ */ new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  if (key === "today") return {
    from: iso(today),
    to: iso(today),
    label: "Today"
  };
  if (key === "week") {
    const day = today.getDay() || 7;
    const start = new Date(today);
    start.setDate(today.getDate() - (day - 1));
    return {
      from: iso(start),
      to: iso(today),
      label: "This Week"
    };
  }
  if (key === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: iso(start),
      to: iso(today),
      label: "This Month"
    };
  }
  if (key === "all") return {
    from: null,
    to: null,
    label: "All Time"
  };
  return {
    from: custom.from || null,
    to: custom.to || null,
    label: "Custom"
  };
}
function OverviewPage() {
  const pageQc = useQueryClient();
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const [rangeKey, setRangeKey] = reactExports.useState("all");
  const [custom, setCustom] = reactExports.useState({
    from: "",
    to: ""
  });
  const range = getRange(rangeKey, custom);
  const refreshBalances = async () => {
    setRefreshing(true);
    try {
      await Promise.all([pageQc.invalidateQueries({
        queryKey: ["shops"]
      }), pageQc.invalidateQueries({
        queryKey: ["wh_ledger"]
      }), pageQc.invalidateQueries({
        queryKey: ["parties"]
      }), pageQc.invalidateQueries({
        queryKey: ["app_settings"]
      }), pageQc.invalidateQueries({
        queryKey: ["employee-entries", "all"]
      }), pageQc.invalidateQueries({
        queryKey: ["txns"]
      }), pageQc.invalidateQueries({
        queryKey: ["shop_entries", "all"]
      }), pageQc.invalidateQueries({
        queryKey: ["overview_entries"]
      }), pageQc.invalidateQueries({
        queryKey: ["overview_categories"]
      })]);
      toast.success("Balances refreshed");
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [formDefaults, setFormDefaults] = reactExports.useState(null);
  const [manageCatOpen, setManageCatOpen] = reactExports.useState(false);
  const [editOpeningOpen, setEditOpeningOpen] = reactExports.useState(false);
  const [formulaSheet, setFormulaSheet] = reactExports.useState(null);
  const [drill, setDrill] = reactExports.useState(null);
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops(data ?? []);
    }
  });
  const {
    data: whLedger = []
  } = useQuery({
    queryKey: ["wh_ledger"],
    queryFn: async () => (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: parties = []
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await supabase.from("parties").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: settings
  } = useQuery({
    queryKey: ["app_settings"],
    queryFn: async () => (await supabase.from("app_settings").select("*").eq("id", 1).single()).data
  });
  const {
    data: employeeEntries = []
  } = useQuery({
    queryKey: ["employee-entries", "all"],
    queryFn: async () => (await supabase.from("employee_entries").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["txns"],
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: shopEntries = []
  } = useQuery({
    queryKey: ["shop_entries", "all"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: overviewEntries = []
  } = useQuery({
    queryKey: ["overview_entries"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("overview_entries").select("*").eq("is_deleted", false).order("txn_date", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const {
    data: categories = []
  } = useQuery({
    queryKey: ["overview_categories"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("overview_categories").select("*").eq("is_deleted", false).order("name");
      return data ?? [];
    }
  });
  const inRange = (d) => {
    if (range.from && d < range.from) return false;
    if (range.to && d > range.to) return false;
    return true;
  };
  const overviewR = reactExports.useMemo(() => overviewEntries.filter((e) => inRange(e.txn_date)), [overviewEntries, range.from, range.to]);
  const openingBalance = Number(settings?.opening_company_balance ?? 0);
  const openingWarehouseValue = Number(settings?.opening_warehouse_balance ?? 0);
  const {
    data: whFin
  } = useWholesaleFinancials();
  const warehouseBreakdown = reactExports.useMemo(() => ({
    currentStock: whFin?.currentStock ?? 0,
    dueReceivable: whFin?.receivable ?? 0,
    currentValue: whFin?.warehouseValue ?? 0
  }), [whFin]);
  const warehouseValue = warehouseBreakdown.currentValue;
  const warehouseConverted = warehouseValue - openingWarehouseValue;
  const employeeOutstanding = reactExports.useMemo(() => {
    let given = 0, received = 0;
    for (const e of employeeEntries) {
      if (e.entry_type === "given") given += Number(e.amount || 0);
      else if (e.entry_type === "received") received += Number(e.amount || 0);
    }
    return given - received;
  }, [employeeEntries]);
  const incomeEntries = reactExports.useMemo(() => overviewR.filter((e) => e.entry_type === "income"), [overviewR]);
  const outsideIncome = reactExports.useMemo(() => incomeEntries.reduce((s, e) => s + Number(e.amount), 0), [incomeEntries]);
  const {
    byId: masterPositions
  } = useShopPositions(range);
  const shopPositions = reactExports.useMemo(() => {
    return shops.map((s) => {
      return {
        id: s.id,
        name: s.name,
        position: masterPositions.get(s.id) ?? 0,
        kind: s.shop_type === "simple_cash" ? "simple" : "erp"
      };
    });
  }, [shops, masterPositions]);
  const positiveShopPositions = shopPositions.filter((s) => s.position >= 0);
  const negativeShopPositions = shopPositions.filter((s) => s.position < 0);
  const negativeShopAssets = negativeShopPositions.reduce((s, x) => s + Math.abs(x.position), 0);
  const totalAssets = warehouseConverted + employeeOutstanding + outsideIncome + negativeShopAssets;
  const costEntries = reactExports.useMemo(() => overviewR.filter((e) => e.entry_type === "cost"), [overviewR]);
  const liabilityGroups = reactExports.useMemo(() => {
    const groups = /* @__PURE__ */ new Map();
    for (const e of costEntries) {
      const cat = e.category || "Other Costs";
      const cur = groups.get(cat) ?? {
        category: cat,
        total: 0,
        rows: []
      };
      cur.total += Number(e.amount);
      cur.rows.push(e);
      groups.set(cat, cur);
    }
    return Array.from(groups.values()).sort((a, b) => b.total - a.total);
  }, [costEntries]);
  const totalCostLiabilities = liabilityGroups.reduce((s, g) => s + g.total, 0);
  const totalShopPositiveLiabilities = positiveShopPositions.reduce((s, x) => s + x.position, 0);
  const totalLiabilities = totalCostLiabilities + totalShopPositiveLiabilities;
  const expectedCashInHand = totalAssets - totalLiabilities;
  const openIncomeDrill = () => {
    const rows = incomeEntries.map((e) => ({
      id: e.id,
      label: e.notes || e.category || "Outside Income",
      date: e.txn_date,
      amount: Number(e.amount),
      tone: "in"
    }));
    setDrill({
      title: "Outside Income",
      rows,
      total: outsideIncome
    });
  };
  const openLiabilityDrill = (g) => {
    const rows = g.rows.map((e) => ({
      id: e.id,
      label: e.notes || g.category,
      date: e.txn_date,
      amount: Number(e.amount),
      tone: "out"
    }));
    setDrill({
      title: g.category,
      rows,
      total: g.total
    });
  };
  const openEmployeeDrill = () => {
    const byEmp = /* @__PURE__ */ new Map();
    for (const e of employeeEntries) {
      const id = e.employee_id;
      const cur = byEmp.get(id) ?? {
        given: 0,
        received: 0
      };
      if (e.entry_type === "given") cur.given += Number(e.amount || 0);
      else cur.received += Number(e.amount || 0);
      byEmp.set(id, cur);
    }
    const rows = Array.from(byEmp.entries()).map(([id, v]) => ({
      id,
      label: id.slice(0, 8),
      date: "",
      amount: v.given - v.received,
      tone: v.given - v.received >= 0 ? "in" : "out"
    }));
    setDrill({
      title: "Employee Outstanding",
      rows,
      total: employeeOutstanding
    });
  };
  const openNewEntry = (defaults) => {
    setFormDefaults(defaults ?? null);
    setFormOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in md:gap-7", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight md:text-3xl", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "How much cash should you actually have right now?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => openNewEntry(), size: "sm", className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New entry"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1", children: [
      [["all", "All Time"], ["month", "Monthly"], ["week", "Weekly"], ["today", "Today"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRangeKey(k), className: cn("shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all", rangeKey === k ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted"), children: label }, k)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: cn("flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all", rangeKey === "custom" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
          " Custom"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-72 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.from, onChange: (e) => setCustom((c) => ({
              ...c,
              from: e.target.value
            })), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: custom.to, onChange: (e) => setCustom((c) => ({
              ...c,
              to: e.target.value
            })), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => setRangeKey("custom"), children: "Apply" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-auto shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: range.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: refreshBalances, disabled: refreshing, "aria-label": "Refresh balances", className: "shrink-0 rounded-full border border-border bg-card p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3.5 w-3.5", refreshing && "animate-spin") }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConvertedToCashCard, { openingStock: openingWarehouseValue, currentStock: warehouseBreakdown.currentStock, receivable: warehouseBreakdown.dueReceivable, currentValue: warehouseValue, convertedToCash: warehouseConverted, onInfo: () => setFormulaSheet("converted") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Assets / Receivable", subtitle: "What the business owns or expects to receive", accent: "success", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Employee Outstanding", value: employeeOutstanding, tone: employeeOutstanding >= 0 ? "success" : "warning", icon: Users, metric: "employee_outstanding", onClick: openEmployeeDrill }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Outside Income", value: outsideIncome, tone: "success", icon: CircleArrowDown, metric: "outside_income", onClick: openIncomeDrill }),
        negativeShopPositions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: `${s.name} Recoverable`, value: Math.abs(s.position), tone: "success", icon: Store, hint: "Shop owes the business" }, `neg-${s.id}`)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openNewEntry({
          type: "income"
        }), className: "group flex min-h-[124px] flex-col items-center justify-center gap-1.5 rounded-3xl border border-dashed border-border/70 bg-card/40 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 transition-transform group-hover:scale-110" }),
          "Add income / asset"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TotalCard, { label: "Total Assets", value: totalAssets, tone: "success", icon: Coins, formula: "Converted To Cash + Employee + Income + Recoverable", onInfo: () => setFormulaSheet("assets") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Liabilities / Payable", subtitle: "What the business owes or must pay out", accent: "danger", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: [
        positiveShopPositions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: `${s.name} Cash Position`, value: s.position, tone: "danger", icon: Store, metric: "shop_cash_position", hint: "Synced with Dashboard" }, `pos-${s.id}`)),
        liabilityGroups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: g.category, value: g.total, tone: "danger", icon: TrendingDown, hint: `${g.rows.length} entr${g.rows.length === 1 ? "y" : "ies"}`, onClick: () => openLiabilityDrill(g) }, g.category)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openNewEntry({
          type: "cost"
        }), className: "group flex min-h-[124px] flex-col items-center justify-center gap-1.5 rounded-3xl border border-dashed border-border/70 bg-card/40 px-3 text-xs font-medium text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 transition-transform group-hover:scale-110" }),
          "Add liability / cost"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TotalCard, { label: "Total Liabilities", value: totalLiabilities, tone: "danger", icon: Receipt, formula: "Positive Shop Cash Positions + Manual Costs", onInfo: () => setFormulaSheet("liabilities") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroCard, { value: expectedCashInHand, assets: totalAssets, liabilities: totalLiabilities, onInfo: () => setFormulaSheet("expected") }),
    overviewEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Recent Activity", subtitle: "Latest income & liabilities", accent: "primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/60", children: overviewEntries.slice(0, 10).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EntryRow, { entry: e }, e.id)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openNewEntry(), className: "hidden", "aria-label": "New entry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewEntryDialog, { open: formOpen, defaults: formDefaults, categories, onManageCategories: () => setManageCatOpen(true), onOpenChange: (v) => {
      setFormOpen(v);
      if (!v) setFormDefaults(null);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryManagerDialog, { open: manageCatOpen, onOpenChange: setManageCatOpen, categories }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OpeningBalanceDialog, { open: editOpeningOpen, onOpenChange: setEditOpeningOpen, current: openingBalance }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!drill, onOpenChange: (v) => !v && setDrill(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: drill?.title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        drill?.rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No entries in this range." }),
        drill?.rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: r.label }),
            r.date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: r.date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-sm font-semibold tabular-nums", r.tone === "out" ? "text-destructive" : "text-success"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: r.amount, size: "sm" }) })
        ] }, r.id ?? i)),
        drill?.total !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between border-t border-border pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: drill.total, size: "lg" })
        ] })
      ] })
    ] }) }),
    (() => {
      const assetItems = [{
        label: "Converted To Cash",
        value: warehouseConverted,
        op: "+"
      }, {
        label: "Employee Outstanding",
        value: employeeOutstanding,
        op: "+"
      }, {
        label: "Outside Income",
        value: outsideIncome,
        op: "+"
      }, ...negativeShopPositions.map((s) => ({
        label: `${s.name} Recoverable`,
        value: Math.abs(s.position),
        op: "+"
      }))];
      const convertedItems = [{
        label: "Current Stock",
        value: warehouseBreakdown.currentStock,
        op: "+"
      }, {
        label: "Receivable",
        value: warehouseBreakdown.dueReceivable,
        op: "+"
      }, {
        label: "Opening Stock",
        value: openingWarehouseValue,
        op: "-"
      }];
      const liabilityItems = [...positiveShopPositions.map((s) => ({
        label: `${s.name} Cash Position`,
        value: s.position,
        op: "+"
      })), ...liabilityGroups.map((g) => ({
        label: g.category,
        value: g.total,
        op: "+"
      }))];
      const expectedItems = [{
        label: "Total Assets",
        value: totalAssets,
        op: "+"
      }, {
        label: "Total Liabilities",
        value: totalLiabilities,
        op: "-"
      }];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFormulaSheet, { open: formulaSheet === "assets", onOpenChange: (v) => !v && setFormulaSheet(null), title: "Total Assets", subtitle: "What the business owns or expects to receive.", items: assetItems, total: totalAssets, totalLabel: "Total Assets", tone: "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFormulaSheet, { open: formulaSheet === "liabilities", onOpenChange: (v) => !v && setFormulaSheet(null), title: "Total Liabilities", subtitle: "What the business owes or must pay out.", items: liabilityItems, total: totalLiabilities, totalLabel: "Total Liabilities", tone: "danger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFormulaSheet, { open: formulaSheet === "expected", onOpenChange: (v) => !v && setFormulaSheet(null), title: "Expected Cash In Hand", subtitle: "Total Assets minus Total Liabilities.", items: expectedItems, total: expectedCashInHand, totalLabel: "Expected Cash In Hand", tone: expectedCashInHand >= 0 ? "success" : "danger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LiveFormulaSheet, { open: formulaSheet === "converted", onOpenChange: (v) => !v && setFormulaSheet(null), title: "Converted To Cash", subtitle: "(Current Stock + Receivable) minus Opening Stock.", items: convertedItems, total: warehouseConverted, totalLabel: "Converted To Cash", tone: warehouseConverted >= 0 ? "success" : "danger" })
      ] });
    })()
  ] });
}
function HeroCard({
  value,
  assets,
  liabilities,
  onInfo
}) {
  const positive = value >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("relative overflow-hidden p-6 md:p-8", positive ? "border-success/40" : "border-destructive/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pointer-events-none absolute -inset-px rounded-3xl opacity-70", positive ? "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--success)_22%,transparent),transparent_60%)]" : "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--destructive)_22%,transparent),transparent_60%)]") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-semibold uppercase tracking-wider", positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " Executive"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Expected Cash In Hand" })
        ] }),
        onInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onInfo, className: "inline-flex h-7 items-center gap-1 rounded-full bg-muted/60 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-muted hover:text-foreground", "aria-label": "Live formula", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          " Live formula"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { metric: "expected_cash_in_hand" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 md:mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "3xl", className: positive ? "text-success" : "text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-2 text-xs font-semibold uppercase tracking-wider", positive ? "text-success" : "text-destructive"), children: positive ? "✓ Healthy Cash Position" : "⚠ Cash Shortage Detected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Total Assets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-success", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: assets, size: "md" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Total Liabilities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: liabilities, size: "md" }) })
        ] })
      ] })
    ] })
  ] });
}
function ConvertedToCashCard({
  openingStock,
  currentStock,
  receivable,
  currentValue,
  convertedToCash,
  onInfo
}) {
  const positive = convertedToCash >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("relative overflow-hidden p-4", positive ? "border-success/50" : "border-destructive/50"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pointer-events-none absolute -inset-px rounded-3xl opacity-70", positive ? "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--success)_18%,transparent),transparent_65%)]" : "[background:radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklab,var(--destructive)_18%,transparent),transparent_65%)]") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-semibold uppercase tracking-wider", positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: [
            positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-2.5 w-2.5" }),
            "Warehouse"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground", children: "Converted To Cash" }),
          onInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onInfo, className: "inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground", "aria-label": "Live formula", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 truncate text-[10.5px] font-mono text-muted-foreground tabular-nums", children: [
          "(",
          currentStock.toFixed(0),
          " + ",
          receivable.toFixed(0),
          ") − ",
          openingStock.toFixed(0)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: convertedToCash, size: "xl", className: positive ? "text-success" : "text-destructive" })
    ] })
  ] });
}
function Section({
  title,
  subtitle,
  children,
  accent
}) {
  const dot = accent === "success" ? "bg-success" : accent === "danger" ? "bg-destructive" : "bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-2 w-2 rounded-full", dot) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: subtitle })
      ] })
    ] }),
    children
  ] });
}
const TONE = {
  primary: {
    ring: "hover:ring-primary/30",
    chip: "bg-primary/10 text-primary",
    icon: "text-primary"
  },
  info: {
    ring: "hover:ring-blue-500/30",
    chip: "bg-blue-500/10 text-blue-500",
    icon: "text-blue-500"
  },
  success: {
    ring: "hover:ring-success/30",
    chip: "bg-success/10 text-success",
    icon: "text-success"
  },
  danger: {
    ring: "hover:ring-destructive/30",
    chip: "bg-destructive/10 text-destructive",
    icon: "text-destructive"
  },
  warning: {
    ring: "hover:ring-amber-500/30",
    chip: "bg-amber-500/10 text-amber-500",
    icon: "text-amber-500"
  }
};
function MetricCard({
  label,
  value,
  tone,
  icon: Icon,
  metric,
  onClick,
  hint,
  dim,
  actionIcon: ActionIcon,
  onAction
}) {
  const t = TONE[tone];
  const clickable = !!onClick;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick, className: cn("group relative min-h-[124px] overflow-hidden p-4 ring-1 ring-transparent transition-all", clickable && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg", dim && "opacity-60", t.ring), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-9 w-9 items-center justify-center rounded-xl", t.chip), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-4 w-4", t.icon) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        ActionIcon && onAction && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          onAction();
        }, className: "rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActionIcon, { className: "h-3.5 w-3.5" }) }),
        metric && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { metric, size: "xs" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "lg", className: value < 0 ? "text-destructive" : "" }) }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-[10px] text-muted-foreground/70", children: hint })
  ] });
}
function TotalCard({
  label,
  value,
  tone,
  icon: Icon,
  formula,
  onInfo
}) {
  const t = TONE[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("relative flex items-center justify-between gap-3 overflow-hidden px-5 py-4 ring-1", tone === "success" ? "ring-success/30" : tone === "danger" ? "ring-destructive/30" : "ring-border/60"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute inset-y-0 start-0 w-1", t.chip) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3 ps-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-10 w-10 items-center justify-center rounded-xl", t.chip), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-5 w-5", t.icon) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: label }),
        formula && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-[10px] text-muted-foreground/70", children: formula })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "xl", className: value < 0 ? "text-destructive" : tone === "success" ? "text-success" : "text-destructive" }),
      onInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onInfo, className: "rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground", "aria-label": "Live formula", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }) })
    ] })
  ] });
}
function EntryRow({
  entry
}) {
  const isIncome = entry.entry_type === "income";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", isIncome ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"), children: isIncome ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: entry.category || entry.notes || (isIncome ? "Outside Income" : "Cost") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          entry.txn_date,
          entry.notes && entry.category ? ` · ${entry.notes}` : "",
          entry.attachment_url ? " · 📎" : ""
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-sm font-semibold", isIncome ? "text-success" : "text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.amount, size: "sm" }) })
  ] });
}
function OpeningBalanceDialog({
  open,
  onOpenChange,
  current
}) {
  const qc = useQueryClient();
  const [val, setVal] = reactExports.useState(String(current ?? 0));
  reactExports.useEffect(() => {
    if (open) setVal(String(current ?? 0));
  }, [open, current]);
  const save = useMutation({
    mutationFn: async () => {
      const num = parseFloat(val || "0");
      if (Number.isNaN(num)) throw new Error("Enter a valid number");
      const {
        error
      } = await supabase.from("app_settings").update({
        opening_company_balance: num
      }).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Opening balance updated");
      qc.invalidateQueries({
        queryKey: ["app_settings"]
      });
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message || "Failed to update")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Company Opening Balance" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Single global opening cash that the business started with. This is independent of individual shop opening cash." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (SAR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", step: "0.01", value: val, onChange: (e) => setVal(e.target.value), className: "text-lg font-semibold tabular-nums", autoFocus: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? "Saving…" : "Save" })
    ] })
  ] }) });
}
function OverviewEntryDialog({
  open,
  defaults,
  onOpenChange,
  categories,
  onManageCategories
}) {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [type, setType] = reactExports.useState("cost");
  const [category, setCategory] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const {
    workingDate
  } = useWorkingDate();
  const [date, setDate] = reactExports.useState(() => workingDate);
  const [notes, setNotes] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) {
      setType(defaults?.type ?? "cost");
      setCategory(defaults?.category ?? "");
    }
  }, [open, defaults]);
  const reset = () => {
    setType("cost");
    setCategory("");
    setAmount("");
    setDate(workingDate);
    setNotes("");
    setFile(null);
  };
  const managedOptions = categories.filter((c) => c.entry_type === type).map((c) => c.name);
  const defaultOptions = type === "income" ? DEFAULT_INCOME_CATEGORIES : DEFAULT_COST_CATEGORIES;
  const seen = /* @__PURE__ */ new Set();
  const categoryOptions = [];
  for (const n of [...managedOptions, ...defaultOptions]) {
    if (!seen.has(n)) {
      seen.add(n);
      categoryOptions.push(n);
    }
  }
  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      let url = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/overview/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const {
        error
      } = await supabase.from("overview_entries").insert({
        entry_type: type,
        amount: amt,
        txn_date: date,
        category: category.trim() || (type === "income" ? "Outside Income" : "Other Costs"),
        notes: notes.trim() || null,
        attachment_url: url,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry saved");
      qc.invalidateQueries({
        queryKey: ["overview_entries"]
      });
      reset();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message || "Failed to save")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    onOpenChange(v);
    if (!v) reset();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New overview entry" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SegPill, { active: type === "income", onClick: () => {
          setType("income");
          setCategory("");
        }, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "h-4 w-4" }), label: "Income / Asset", tone: "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SegPill, { active: type === "cost", onClick: () => {
          setType("cost");
          setCategory("");
        }, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "h-4 w-4" }), label: "Liability / Cost", tone: "destructive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onManageCategories, className: "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3 w-3" }),
            " Manage"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: categoryOptions.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setCategory(c), className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all", category === c ? type === "income" ? "border-success bg-success/10 text-success" : "border-destructive bg-destructive/10 text-destructive" : "border-border bg-card text-muted-foreground hover:bg-muted"), children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: category, onChange: (e) => setCategory(e.target.value), placeholder: "Or type a custom category", className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (SAR) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", min: 0, step: "0.01", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "text-lg font-semibold tabular-nums", autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), maxLength: 500, rows: 2, placeholder: "Optional details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Attachment (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3.5 w-3.5" }),
          file ? file.name : "Choose file",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) }),
          file && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (ev) => {
            ev.preventDefault();
            setFile(null);
          }, className: "ms-auto text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? "Saving…" : "Save entry" })
    ] })
  ] }) });
}
function SegPill({
  active,
  onClick,
  icon,
  label,
  tone
}) {
  const activeCls = tone === "destructive" ? "bg-destructive/15 text-destructive shadow-sm" : "bg-success/15 text-success shadow-sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", active ? activeCls : "text-muted-foreground hover:text-foreground"), children: [
    icon,
    label
  ] });
}
function CategoryManagerDialog({
  open,
  onOpenChange,
  categories
}) {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [newName, setNewName] = reactExports.useState("");
  const [newType, setNewType] = reactExports.useState("cost");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editVal, setEditVal] = reactExports.useState("");
  const refresh = () => qc.invalidateQueries({
    queryKey: ["overview_categories"]
  });
  const add = async () => {
    const name = newName.trim();
    if (!name || !user) return;
    const {
      error
    } = await supabase.from("overview_categories").insert({
      name,
      entry_type: newType,
      created_by: user.id
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Category added");
      setNewName("");
      refresh();
    }
  };
  const saveEdit = async (id) => {
    const name = editVal.trim();
    if (!name) return;
    const {
      error
    } = await supabase.from("overview_categories").update({
      name,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Updated");
      setEditingId(null);
      refresh();
    }
  };
  const remove = async (id) => {
    if (!await confirm({
      title: "Delete category?",
      description: "Old entries will still show this category. This action removes it from the picker.",
      confirmText: "Delete",
      tone: "danger"
    })) return;
    const {
      error
    } = await supabase.from("overview_categories").update({
      is_deleted: true,
      deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
      deleted_by: user?.id
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      refresh();
    }
  };
  const incomeCats = categories.filter((c) => c.entry_type === "income");
  const costCats = categories.filter((c) => c.entry_type === "cost");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-4 w-4 text-primary" }),
      " Manage Categories"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/70 bg-muted/30 p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Add new category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "e.g. Owner Deposit", onKeyDown: (e) => e.key === "Enter" && add() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newType, onChange: (e) => setNewType(e.target.value), className: "rounded-md border border-input bg-transparent px-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cost", children: "Cost" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "income", children: "Income" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: add, disabled: !newName.trim(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CatList, { title: "Income", tone: "success", items: incomeCats, editingId, editVal, setEditingId, setEditVal, onSave: saveEdit, onDelete: remove }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CatList, { title: "Cost", tone: "danger", items: costCats, editingId, editVal, setEditingId, setEditVal, onSave: saveEdit, onDelete: remove })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Deleted categories are hidden from new entries but old entries remain unaffected." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onOpenChange(false), children: "Done" }) })
  ] }) });
}
function CatList({
  title,
  tone,
  items,
  editingId,
  editVal,
  setEditingId,
  setEditVal,
  onSave,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/70 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider", tone === "success" ? "text-success" : "text-destructive"), children: title }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 py-3 text-center text-[11px] text-muted-foreground", children: "No custom categories" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 max-h-48 overflow-y-auto", children: items.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-muted/40", children: editingId === c.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editVal, onChange: (e) => setEditVal(e.target.value), className: "h-7 text-xs", autoFocus: true, onKeyDown: (e) => e.key === "Enter" && onSave(c.id) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(c.id), className: "text-success hover:opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditingId(null), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-xs", children: c.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setEditingId(c.id);
        setEditVal(c.name);
      }, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(c.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
    ] }) }, c.id)) })
  ] });
}
export {
  OverviewPage as component
};
