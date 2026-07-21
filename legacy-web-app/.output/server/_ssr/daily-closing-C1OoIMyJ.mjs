import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { o as useWorkingDate, k as useAuth, C as Card, I as Input, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, d as cn, T as Textarea, B as Button, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, P as Popover, p as PopoverTrigger, q as PopoverContent, af as SAR } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { E as EditHistoryButton } from "./edit-history-D9fAqzXB.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { ae as TrendingUp, ax as TrendingDown, C as CircleCheck, at as Calendar, L as Lock, a as TriangleAlert, b as RotateCcw, a5 as Pencil, bm as PackageOpen, X, P as Plus, Y as Share2, a4 as History, T as Trash2, aA as Info, l as Sparkles, k as LoaderCircle, bn as OctagonAlert } from "../_libs/lucide-react.mjs";

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
const HARD_GAP_MIN = 10;
const SOFT_GAP_MIN = 120;
function fmt$1(n) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n || 0);
}
function minutesBetween(a, b) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 6e4;
}
function detectDuplicates(input) {
  const rows = [];
  for (const e of input.shopEntries) {
    const t = e.entry_type;
    const amount = t === "purchase" ? Number(e.purchase_amount || 0) : t === "withdraw" ? Number(e.withdraw_amount || 0) : t === "expense" ? Number(e.expense_amount || 0) : t === "sale" ? Number(e.cash_sale || 0) + Number(e.pos_sale || 0) + Number(e.bank_sale || 0) + Number(e.credit_sale || 0) : 0;
    if (amount > 0) rows.push({ id: e.id, type: `shop_${t}`, amount, created_at: e.created_at });
  }
  for (const e of input.empEntries) {
    const amount = Number(e.amount || 0);
    if (amount > 0) rows.push({ id: e.id, type: `emp_${e.entry_type}`, amount, created_at: e.created_at });
  }
  for (const e of input.whEntries) {
    const amount = Number(e.amount || 0);
    if (amount > 0) rows.push({ id: e.id, type: `wh_${e.entry_type}`, amount, created_at: e.created_at });
  }
  const groups = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const k = `${r.type}|${r.amount}`;
    const g = groups.get(k);
    if (g) g.push(r);
    else groups.set(k, [r]);
  }
  const out = [];
  for (const [k, g] of groups) {
    if (g.length < 2) continue;
    g.sort((a, b) => a.created_at.localeCompare(b.created_at));
    for (let i = 1; i < g.length; i++) {
      const gap = minutesBetween(g[i - 1].created_at, g[i].created_at);
      const [type, amt] = k.split("|");
      const label = type.replace("_", " ");
      if (gap <= HARD_GAP_MIN) {
        out.push({
          id: `dup-${g[i].id}`,
          severity: "critical",
          title: `Possible duplicate ${label}`,
          detail: `Two ${label} entries of ${fmt$1(Number(amt))} saved ${Math.round(gap)} min apart`,
          hint: "Review and remove the accidental copy."
        });
      } else if (gap <= SOFT_GAP_MIN) {
        out.push({
          id: `dup-${g[i].id}`,
          severity: "warning",
          title: `Repeated ${label} amount`,
          detail: `Two ${label} entries of ${fmt$1(Number(amt))} within ${Math.round(gap)} min`,
          hint: "Verify these are intentional separate transactions."
        });
      }
    }
  }
  return out;
}
function analyzeClosing(input) {
  const out = [];
  const absDiff = Math.abs(input.diff);
  if (absDiff > 0.01) {
    const sev = absDiff > 500 ? "critical" : absDiff > 50 ? "warning" : "info";
    out.push({
      id: "diff",
      severity: sev,
      title: input.diff > 0 ? "Extra cash detected" : "Cash shortage detected",
      detail: `Actual ${fmt$1(input.counted)} vs Expected ${fmt$1(input.expected)} — diff ${input.diff > 0 ? "+" : ""}${fmt$1(input.diff)}`,
      hint: input.diff < 0 ? "Likely missing an expense or unrecorded withdrawal." : "Check for missed cash sale or duplicate expense entry."
    });
  }
  out.push(...detectDuplicates(input));
  if (input.withdraw > 0 && input.distributionTotal === 0) {
    out.push({
      id: "withdraw-no-dist",
      severity: "warning",
      title: "Withdraw not distributed",
      detail: `Withdrew ${fmt$1(input.withdraw)} but no tomorrow distribution recorded`,
      hint: "Assign cash to shops or confirm withdraw stays in drawer."
    });
  }
  if (input.tomorrowPurchases.length > 0 && input.distributionTotal === 0) {
    out.push({
      id: "purchase-no-dist",
      severity: "warning",
      title: "Tomorrow purchases pending distribution",
      detail: `${input.tomorrowPurchases.length} purchase entries on next day with no cash assigned`,
      hint: "Open distribution panel and split cash by shop."
    });
  }
  for (const e of input.shopEntries) {
    if (e.entry_type !== "expense") continue;
    const amt = Number(e.expense_amount || 0);
    if (amt > 500 && input.expense > 0 && amt / input.expense > 0.3) {
      out.push({
        id: `big-exp-${e.id}`,
        severity: "info",
        title: "Large expense entry",
        detail: `${fmt$1(amt)} — ${Math.round(amt / input.expense * 100)}% of today's expenses`,
        hint: e.notes ? void 0 : "Add a note for audit trail."
      });
    }
  }
  for (const e of input.shopEntries) {
    if (e.entry_type !== "withdraw") continue;
    if (!e.cashier_id && !e.notes) {
      out.push({
        id: `unassigned-w-${e.id}`,
        severity: "warning",
        title: "Unassigned withdraw",
        detail: `Withdraw ${fmt$1(Number(e.withdraw_amount || 0))} has no cashier or notes`,
        hint: "Assign a cashier so the cash trail is clear."
      });
    }
  }
  if (input.shopEntries.length === 0 && input.whEntries.length === 0 && input.empEntries.length === 0) {
    out.push({
      id: "no-activity",
      severity: "info",
      title: "No entries recorded today",
      detail: "If today was an active business day, entries may be missing."
    });
  }
  if (out.length === 0) {
    out.push({
      id: "ok",
      severity: "info",
      title: "Closing looks clean",
      detail: "No anomalies detected by the assistant."
    });
  }
  return out;
}
const META = {
  critical: {
    icon: OctagonAlert,
    cls: "border-rose-200 bg-rose-50/60",
    pill: "bg-rose-100 text-rose-700",
    label: "Critical"
  },
  warning: {
    icon: TriangleAlert,
    cls: "border-amber-200 bg-amber-50/60",
    pill: "bg-amber-100 text-amber-800",
    label: "Warning"
  },
  info: {
    icon: Info,
    cls: "border-border/60 bg-muted/30",
    pill: "bg-muted text-foreground/70",
    label: "Info"
  }
};
function ClosingAssistant(props) {
  const [findings, setFindings] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [ranAt, setRanAt] = reactExports.useState(null);
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      const res = analyzeClosing(props);
      setFindings(res);
      setRanAt((/* @__PURE__ */ new Date()).toLocaleTimeString());
      setBusy(false);
    }, 30);
  };
  const counts = findings ? findings.reduce(
    (acc, f) => (acc[f.severity] = (acc[f.severity] || 0) + 1, acc),
    { critical: 0, warning: 0, info: 0 }
  ) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border-border/60 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold", children: "Closing Assistant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground", children: ranAt ? `Last run ${ranAt}` : "Rule-based anomaly check — runs on demand" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: run,
          disabled: busy,
          size: "sm",
          variant: findings ? "outline" : "default",
          className: "h-9 shrink-0",
          children: [
            busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[12px]", children: findings ? "Re-analyze" : "Analyze Closing" })
          ]
        }
      )
    ] }),
    counts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SevPill, { severity: "critical", count: counts.critical }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SevPill, { severity: "warning", count: counts.warning }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SevPill, { severity: "info", count: counts.info })
    ] }),
    findings && findings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1.5", children: findings.map((f) => {
      const m = META[f.severity];
      const Icon = m.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: cn(
            "rounded-xl border px-3 py-2.5 transition-colors",
            m.cls
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn(
              "mt-0.5 h-3.5 w-3.5 shrink-0",
              f.severity === "critical" ? "text-rose-700" : f.severity === "warning" ? "text-amber-700" : "text-muted-foreground"
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12.5px] font-semibold text-foreground/90", children: f.title }),
              f.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11.5px] text-foreground/70 leading-snug", children: f.detail }),
              f.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10.5px] text-muted-foreground italic", children: f.hint })
            ] })
          ] })
        },
        f.id
      );
    }) }),
    findings && findings.length === 1 && findings[0].id === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
      " All checks passed"
    ] })
  ] });
}
function SevPill({ severity, count }) {
  if (!count) return null;
  const m = META[severity];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", m.pill), children: [
    count,
    " ",
    m.label
  ] });
}
const newHolderId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
const DEFAULT_HOLDERS = [{
  id: "h-main",
  name: "Main Drawer",
  amount: 0
}];
const DIST_TARGETS = ["Azzouz", "Nujum", "Aklas", "Khaled", "Warehouse"];
function fmt(n) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2
  }).format(n || 0);
}
function DailyClosingPage() {
  const qc = useQueryClient();
  const {
    workingDate
  } = useWorkingDate();
  const [date, setDate] = reactExports.useState(workingDate);
  const [holders, setHolders] = reactExports.useState(DEFAULT_HOLDERS);
  const [openingOverride, setOpeningOverride] = reactExports.useState("");
  const [openingLocked, setOpeningLocked] = reactExports.useState(true);
  const [distLocked, setDistLocked] = reactExports.useState(true);
  const [openingEditWarn, setOpeningEditWarn] = reactExports.useState(false);
  const [distEditWarn, setDistEditWarn] = reactExports.useState(false);
  const [notes, setNotes] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [detail, setDetail] = reactExports.useState(null);
  const [cardDetail, setCardDetail] = reactExports.useState(null);
  const [distribution, setDistribution] = reactExports.useState(DIST_TARGETS.map((n) => ({
    name: n,
    amount: 0
  })));
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const {
    user
  } = useAuth();
  const {
    data: isAdmin = false
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  reactExports.useEffect(() => {
    setDate(workingDate);
  }, [workingDate]);
  const nextDate = reactExports.useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setDate(dt.getDate() + 1);
    const ny = dt.getFullYear();
    const nm = String(dt.getMonth() + 1).padStart(2, "0");
    const nd = String(dt.getDate()).padStart(2, "0");
    return `${ny}-${nm}-${nd}`;
  }, [date]);
  const {
    data: shopEntries = []
  } = useQuery({
    queryKey: ["shop_entries_for_day", date],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false).eq("txn_date", date)).data ?? []
  });
  const {
    data: whEntries = []
  } = useQuery({
    queryKey: ["wh_ledger_for_day", date],
    queryFn: async () => (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false).eq("txn_date", date)).data ?? []
  });
  const {
    data: empEntries = []
  } = useQuery({
    queryKey: ["employee_entries_for_day", date],
    queryFn: async () => (await supabase.from("employee_entries").select("*").eq("is_deleted", false).eq("txn_date", date)).data ?? []
  });
  const {
    data: tomorrowPurchases = []
  } = useQuery({
    queryKey: ["shop_entries_for_day", nextDate, "purchase"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false).eq("txn_date", nextDate).eq("entry_type", "purchase")).data ?? []
  });
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["txns_for_day", date],
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false).eq("txn_date", date)).data ?? []
  });
  const {
    data: shopList = []
  } = useQuery({
    queryKey: ["shops_for_closing"],
    queryFn: async () => (await supabase.from("shops").select("id,name").eq("is_deleted", false)).data ?? []
  });
  const shopName = (id) => shopList.find((s) => s.id === id)?.name ?? "—";
  const {
    data: prevClosing
  } = useQuery({
    queryKey: ["daily_closings_prev", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("daily_closings").select("*").eq("is_deleted", false).lt("closing_date", date).order("closing_date", {
        ascending: false
      }).limit(1).maybeSingle();
      return data ?? null;
    }
  });
  const {
    data: existingClosing
  } = useQuery({
    queryKey: ["daily_closings_on", date],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("daily_closings").select("*").eq("is_deleted", false).eq("closing_date", date).maybeSingle();
      return data ?? null;
    }
  });
  const {
    data: closings = []
  } = useQuery({
    queryKey: ["daily_closings_recent"],
    queryFn: async () => (await supabase.from("daily_closings").select("*").eq("is_deleted", false).order("closing_date", {
      ascending: false
    }).limit(30)).data ?? []
  });
  const autoDistribution = reactExports.useMemo(() => {
    const byShop = /* @__PURE__ */ new Map();
    for (const e of tomorrowPurchases) {
      const name = shopName(e.shop_id) ?? "—";
      byShop.set(name, (byShop.get(name) || 0) + Number(e.purchase_amount || 0));
    }
    return DIST_TARGETS.map((n) => ({
      name: n,
      amount: Math.floor(byShop.get(n) || 0)
    }));
  }, [tomorrowPurchases, shopList]);
  reactExports.useEffect(() => {
    if (existingClosing) {
      const savedHolders = Array.isArray(existingClosing.holders) ? existingClosing.holders : [];
      const mapped = savedHolders.filter((h) => h && (h.name || h.amount !== void 0)).map((h) => ({
        id: newHolderId(),
        name: String(h.name ?? "Cash"),
        amount: Number(h.amount) || 0
      }));
      setHolders(mapped.length > 0 ? mapped : [{
        id: newHolderId(),
        name: "Main Drawer",
        amount: Number(existingClosing.counted_cash) || 0
      }]);
      setOpeningOverride(String(existingClosing.opening_cash ?? ""));
      setOpeningLocked(true);
      setDistLocked(true);
      setNotes(existingClosing.notes ?? "");
      const saved = Array.isArray(existingClosing.distribution) ? existingClosing.distribution : [];
      setDistribution(DIST_TARGETS.map((n) => {
        const row = saved.find((r) => (r?.name ?? "").toLowerCase() === n.toLowerCase());
        return {
          name: n,
          amount: Number(row?.amount) || 0
        };
      }));
    } else {
      setHolders([{
        id: newHolderId(),
        name: "Main Drawer",
        amount: 0
      }]);
      setOpeningOverride("");
      setOpeningLocked(true);
      setDistLocked(true);
      setNotes("");
      setDistribution(autoDistribution);
    }
  }, [existingClosing?.id, prevClosing?.id, autoDistribution]);
  const suggestedOpening = Number(prevClosing?.counted_cash ?? 0);
  const openingCash = openingLocked ? suggestedOpening : openingOverride === "" ? suggestedOpening : Number(openingOverride) || 0;
  const openingOverridden = !openingLocked && Math.abs(openingCash - suggestedOpening) > 0.01;
  const autoDistTotal = reactExports.useMemo(() => autoDistribution.reduce((s, r) => s + (Number(r.amount) || 0), 0), [autoDistribution]);
  const cashSale = reactExports.useMemo(() => shopEntries.filter((e) => e.entry_type === "sale").reduce((s, e) => s + Number(e.cash_sale || 0), 0), [shopEntries]);
  const withdraw = reactExports.useMemo(() => shopEntries.filter((e) => e.entry_type === "withdraw").reduce((s, e) => s + Number(e.withdraw_amount || 0), 0), [shopEntries]);
  const otherCashIn = reactExports.useMemo(() => txns.filter((t) => t.type === "cash_in" && t.payment_method === "cash" && !t.source).reduce((s, t) => s + Number(t.amount || 0), 0), [txns]);
  const employeeReceived = reactExports.useMemo(() => empEntries.filter((e) => e.entry_type === "received").reduce((s, e) => s + Number(e.amount || 0), 0), [empEntries]);
  const shopPurchase = reactExports.useMemo(() => shopEntries.filter((e) => e.entry_type === "purchase").reduce((s, e) => s + Number(e.purchase_amount || 0), 0), [shopEntries]);
  const whPurchase = reactExports.useMemo(() => whEntries.filter((e) => e.entry_type === "warehouse_purchase" && (e.payment_status === "cash" || e.payment_status === "partial")).reduce((s, e) => s + Number(e.payment_status === "cash" ? e.amount : e.paid_amount || 0), 0), [whEntries]);
  const purchase = shopPurchase + whPurchase;
  const employeePaid = reactExports.useMemo(() => empEntries.filter((e) => e.entry_type === "given").reduce((s, e) => s + Number(e.amount || 0), 0), [empEntries]);
  const expense = reactExports.useMemo(() => shopEntries.filter((e) => e.entry_type === "expense").reduce((s, e) => s + Number(e.expense_amount || 0), 0) + txns.filter((t) => t.type === "cash_out" && !t.source).reduce((s, t) => s + Number(t.amount || 0), 0), [shopEntries, txns]);
  const totalReceived = cashSale + withdraw + otherCashIn + employeeReceived;
  const totalGiven = purchase + expense + employeePaid;
  const distributionTotal = reactExports.useMemo(() => distribution.reduce((s, r) => s + (Number(r.amount) || 0), 0), [distribution]);
  const totalAvailable = openingCash + totalReceived;
  const expectedInflow = openingCash + withdraw + otherCashIn + employeeReceived;
  const expectedOutflow = distributionTotal + expense + employeePaid;
  const expectedClosing = expectedInflow - expectedOutflow;
  const expectedNegative = expectedClosing < 0;
  const totalCounted = reactExports.useMemo(() => holders.reduce((s, h) => s + (Number(h.amount) || 0), 0), [holders]);
  const anyHolderEntered = holders.some((h) => Number(h.amount) > 0);
  const diff = totalCounted - expectedClosing;
  let statusTone = "matched";
  if (diff < -0.01) statusTone = "shortage";
  else if (diff > 0.01) statusTone = "extra";
  const statusMeta = {
    matched: {
      label: "Closing Matched",
      icon: CircleCheck,
      bg: "bg-muted/40",
      border: "border-border/60",
      text: "text-foreground/70",
      pill: "bg-muted text-foreground/70"
    },
    shortage: {
      label: "Cash Shortage",
      icon: TrendingDown,
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-700",
      pill: "bg-rose-100 text-rose-700"
    },
    extra: {
      label: "Extra Cash",
      icon: TrendingUp,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      pill: "bg-emerald-100 text-emerald-700"
    }
  }[statusTone];
  const StatusIcon = statusMeta.icon;
  const lockWarning = reactExports.useMemo(() => {
    if (!existingClosing) return null;
    const closedAt = new Date(existingClosing.updated_at || existingClosing.created_at).getTime();
    return [...txns.map((t) => new Date(t.created_at).getTime()), ...shopEntries.map((e) => new Date(e.created_at).getTime())].some((ts) => ts > closedAt);
  }, [existingClosing, txns, shopEntries]);
  const saveClosing = async () => {
    if (totalCounted <= 0 && !anyHolderEntered) {
      return toast.error("Enter the actual cash in hand");
    }
    setSaving(true);
    try {
      const {
        data: userData
      } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Not signed in");
      const holdersPayload = holders.filter((h) => Number(h.amount) > 0 || h.name && h.name.trim() !== "").map((h) => ({
        name: h.name || "Cash",
        amount: Number(h.amount) || 0
      }));
      const payload = {
        closing_date: date,
        opening_cash: openingCash,
        cash_sale: cashSale + otherCashIn + employeeReceived,
        withdraw,
        purchase,
        expense: expense + employeePaid,
        expected_cash: expectedClosing,
        counted_cash: totalCounted,
        difference: diff,
        status: statusTone,
        notes: notes || null,
        holders: holdersPayload,
        distribution: distribution.filter((r) => r.amount > 0),
        distribution_total: distributionTotal,
        created_by: userId
      };
      const wasNew = !existingClosing;
      if (existingClosing) {
        const {
          error
        } = await supabase.from("daily_closings").update(payload).eq("id", existingClosing.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("daily_closings").insert(payload);
        if (error) throw error;
      }
      toast.success(existingClosing ? "Closing updated" : "Closing saved");
      qc.invalidateQueries({
        queryKey: ["daily_closings_recent"]
      });
      qc.invalidateQueries({
        queryKey: ["daily_closings_on", date]
      });
      qc.invalidateQueries({
        queryKey: ["daily_closings_prev"]
      });
      if (wasNew) {
        setHolders([{
          id: newHolderId(),
          name: "Main Drawer",
          amount: 0
        }]);
        setOpeningOverride("");
        setOpeningLocked(true);
        setDistLocked(true);
        setNotes("");
      }
    } catch (e) {
      toast.error(e?.message ?? "Failed to save closing");
    } finally {
      setSaving(false);
    }
  };
  const deleteClosing = async (id) => {
    try {
      const {
        data: userData
      } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const {
        error
      } = await supabase.from("daily_closings").update({
        is_deleted: true,
        deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
        deleted_by: userId
      }).eq("id", id);
      if (error) throw error;
      toast.success("Closing deleted");
      setDeleteTarget(null);
      setDetail(null);
      qc.invalidateQueries({
        queryKey: ["daily_closings_recent"]
      });
      qc.invalidateQueries({
        queryKey: ["daily_closings_on", date]
      });
      qc.invalidateQueries({
        queryKey: ["daily_closings_prev"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Failed to delete closing");
    }
  };
  const editClosing = (c) => {
    setDate(c.closing_date);
    setDetail(null);
    toast.message("Edit mode", {
      description: `Loaded closing for ${c.closing_date}`
    });
  };
  const shareClosingReport = async () => {
    const rows = [{
      label: "Opening Cash",
      value: SAR(openingCash)
    }, {
      label: "Cash Sale",
      value: SAR(cashSale)
    }, {
      label: "Withdraw",
      value: SAR(withdraw)
    }];
    if (employeeReceived) rows.push({
      label: "Employee Received",
      value: SAR(employeeReceived)
    });
    if (otherCashIn) rows.push({
      label: "Other Cash In",
      value: SAR(otherCashIn)
    });
    rows.push({
      label: "— Total Received",
      value: SAR(totalReceived)
    });
    rows.push({
      label: "Purchase",
      value: "− " + SAR(purchase)
    });
    rows.push({
      label: "Expense",
      value: "− " + SAR(expense)
    });
    if (employeePaid) rows.push({
      label: "Employee Payment",
      value: "− " + SAR(employeePaid)
    });
    rows.push({
      label: "— Total Given",
      value: "− " + SAR(totalGiven)
    });
    if (distributionTotal > 0) {
      distribution.filter((r) => r.amount > 0).forEach((r) => rows.push({
        label: `Distrib · ${r.name}`,
        value: "− " + SAR(r.amount)
      }));
      rows.push({
        label: "— Tomorrow Distribution",
        value: "− " + SAR(distributionTotal)
      });
    }
    rows.push({
      label: "Expected Cash",
      value: SAR(expectedClosing)
    });
    rows.push({
      label: "Actual Cash",
      value: SAR(totalCounted)
    });
    await shareToWhatsApp({
      title: "Daily Closing",
      subtitle: date,
      amount: SAR(Math.abs(diff)),
      amountLabel: statusMeta.label,
      badge: statusTone === "matched" ? "Matched" : statusTone === "extra" ? "Extra Cash" : "Shortage",
      accent: statusTone === "shortage" ? "out" : statusTone === "extra" ? "in" : "neutral",
      date,
      rows,
      notes: notes || null,
      footerNote: "By AhsAN Manager ShRiAh Group"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "bg-transparent text-xs font-medium outline-none" })
    ] }) }),
    existingClosing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
      "Closing already saved for this date. Editing will update it."
    ] }),
    lockWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
      "Entries changed after closing — re-save to reconcile."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "01", title: "Opening Cash" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { onClick: () => setCardDetail("opening"), className: "cursor-pointer rounded-2xl border-border/60 p-4 transition-all hover:border-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Cash on hand before today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-muted-foreground/80", children: prevClosing ? `Auto from ${prevClosing.closing_date}: ${fmt(suggestedOpening)}` : "No prior closing — enter manually" }),
        openingOverridden && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-800", children: "Manual Override" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
            e.stopPropagation();
            setOpeningOverride("");
            setOpeningLocked(true);
            toast.success("Opening Cash reset to auto value");
          }, className: "inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
            " Reset to Auto"
          ] })
        ] })
      ] }),
      openingLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold tabular-nums", children: fmt(suggestedOpening) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setOpeningEditWarn(true);
        }, className: "inline-flex h-8 items-center gap-1 rounded-md border border-border/60 bg-background px-2 text-[11px] text-muted-foreground hover:bg-muted", "aria-label": "Edit opening cash", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
          " Edit"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", value: openingOverride, placeholder: String(suggestedOpening), onChange: (e) => setOpeningOverride(e.target.value), onClick: (e) => e.stopPropagation(), autoFocus: true, className: "h-10 w-32 text-end font-display text-base font-semibold tabular-nums" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: openingEditWarn, onOpenChange: setOpeningEditWarn, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600" }),
          "Override auto-calculated value?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "You are overriding automatically calculated finance values. Opening Cash is normally carried forward from the previous day's closing." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          setOpeningLocked(false);
          if (openingOverride === "") setOpeningOverride(String(suggestedOpening));
          setOpeningEditWarn(false);
        }, children: "Continue Editing" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "02", title: "Today Cash Received" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick: () => setCardDetail("received"), className: "cursor-pointer rounded-2xl border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-white p-4 transition-all hover:border-emerald-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-700", children: "Total Received" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Today Cash Received", formula: `${fmt(cashSale)} (sale) + ${fmt(withdraw)} (withdraw) + ${fmt(otherCashIn + employeeReceived)} (other)
= ${fmt(totalReceived)}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalReceived, size: "2xl", className: "text-emerald-900" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Cash Sale", value: cashSale, onClick: () => setCardDetail("cash_sale") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Withdraw", value: withdraw, onClick: () => setCardDetail("withdraw") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Other In", value: otherCashIn + employeeReceived })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "03", title: "Today Cash Given" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick: () => setCardDetail("given"), className: "cursor-pointer rounded-2xl border-rose-200/60 bg-gradient-to-br from-rose-50 via-white to-white p-4 transition-all hover:border-rose-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-rose-700", children: "Total Given" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Today Cash Given", formula: `${fmt(purchase)} (purchase) + ${fmt(expense)} (expense) + ${fmt(employeePaid)} (employees)
= ${fmt(totalGiven)}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalGiven, size: "2xl", className: "text-rose-900" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Purchase", value: purchase, onClick: () => setCardDetail("purchase") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Expense", value: expense, onClick: () => setCardDetail("expense") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Employee", value: employeePaid, onClick: () => setCardDetail("employee") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "04", title: "Tomorrow Purchase Distribution" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-white p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, { className: "h-4 w-4 text-amber-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-800", children: "Cash given out tonight for tomorrow's purchases" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          distLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setDistEditWarn(true), className: "inline-flex h-7 items-center gap-1 rounded-md border border-amber-300 bg-white px-2 text-[10px] text-amber-800 hover:bg-amber-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
            " Edit"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            setDistribution(autoDistribution);
            setDistLocked(true);
            toast.success("Distribution reset to auto values");
          }, className: "inline-flex h-7 items-center gap-1 rounded-md border border-amber-300 bg-white px-2 text-[10px] text-amber-800 hover:bg-amber-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
            " Reset"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Tomorrow Purchase Distribution", formula: distribution.map((r) => `${r.name}: ${fmt(r.amount)}`).join("\n") + `
= ${fmt(distributionTotal)}`, lines: ["Subtracts from Expected Cash", "Use after collecting shop cash & withdrawing from bank"] }) })
        ] })
      ] }),
      tomorrowPurchases.length === 0 && distributionTotal === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-100/40 px-2.5 py-1.5 text-[10.5px] text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
        "No tomorrow purchase entries found for ",
        nextDate
      ] }),
      tomorrowPurchases.length > 0 && distLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 rounded-lg border border-emerald-200/60 bg-emerald-50/60 px-2.5 py-1.5 text-[10.5px] text-emerald-800", children: [
        "Auto-filled from ",
        tomorrowPurchases.length,
        " purchase ",
        tomorrowPurchases.length === 1 ? "entry" : "entries",
        " on ",
        nextDate
      ] }),
      !distLocked && Math.abs(distributionTotal - autoDistTotal) > 0.01 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-start gap-1.5 rounded-lg border border-amber-300 bg-amber-100/60 px-2.5 py-1.5 text-[10.5px] text-amber-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3 w-3 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Manual Override:" }),
          " Difference detected: ",
          distributionTotal - autoDistTotal >= 0 ? "+" : "",
          fmt(distributionTotal - autoDistTotal),
          " SAR from auto-calculated purchase distribution (auto = ",
          fmt(autoDistTotal),
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: distribution.map((row, idx) => {
        const autoVal = autoDistribution.find((r) => r.name === row.name)?.amount ?? 0;
        const rowOverride = !distLocked && Math.abs((Number(row.amount) || 0) - autoVal) > 0.01;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 truncate text-[12px] font-medium text-foreground/85", children: [
            row.name,
            rowOverride && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 rounded bg-amber-100 px-1 py-0.5 text-[8.5px] font-semibold uppercase text-amber-800", children: "override" })
          ] }),
          distLocked ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-28 text-end font-display text-sm font-semibold tabular-nums text-foreground/85", children: fmt(row.amount) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "numeric", step: "1", min: "0", value: row.amount === 0 ? "" : String(row.amount), placeholder: String(autoVal), onChange: (e) => {
            const v = Math.max(0, Math.floor(Number(e.target.value.replace(/\D/g, "")) || 0));
            setDistribution((prev) => prev.map((r, i) => i === idx ? {
              ...r,
              amount: v
            } : r));
          }, className: "h-9 w-28 text-end font-display text-sm font-semibold tabular-nums" })
        ] }, row.name);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCardDetail("distribution"), className: "mt-3 flex w-full items-center justify-between rounded-xl bg-amber-100/60 px-3 py-2 text-left transition hover:bg-amber-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-800", children: "Total Distributed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: distributionTotal, size: "lg", className: "text-amber-900" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between rounded-lg border border-amber-200/60 bg-white/60 px-3 py-1.5 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold tabular-nums", children: fmt(totalAvailable) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: distEditWarn, onOpenChange: setDistEditWarn, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-600" }),
          "Override auto-calculated values?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "You are overriding automatically calculated finance values. Tomorrow Purchase Distribution is normally filled from the next day's purchase entries (auto total = ",
          fmt(autoDistTotal),
          " SAR)."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          setDistLocked(false);
          setDistEditWarn(false);
        }, children: "Continue Editing" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "05", title: "Expected Cash In Hand" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick: () => setCardDetail("expected"), className: cn("cursor-pointer rounded-2xl p-5 transition-all", expectedNegative ? "border-rose-300 bg-gradient-to-br from-rose-50 via-card to-card hover:border-rose-400" : "border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card hover:border-primary/50"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-[10px] font-semibold uppercase tracking-wider", expectedNegative ? "text-rose-700" : "text-primary"), children: "Expected Cash" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: "Opening + Withdraw + Other In + Emp Received − Distribution − Expense − Emp Given" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Expected Cash In Hand", formula: `Opening:            ${fmt(openingCash)}
+ Withdraw:         ${fmt(withdraw)}
+ Other Income:     ${fmt(otherCashIn)}
+ Emp Received:     ${fmt(employeeReceived)}
− Tomorrow Distrib: ${fmt(distributionTotal)}
− Expense:          ${fmt(expense)}
− Employee Given:   ${fmt(employeePaid)}
= Expected Cash:    ${fmt(expectedClosing)}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: expectedClosing, size: "3xl", className: expectedNegative ? "text-rose-700" : "text-foreground" }) }),
      expectedNegative && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-100/60 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
        "Expected Cash Negative"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "06", title: "Actual Cash In Hand" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Cash counted across all holders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalCounted, size: "lg" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: holders.map((h, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", value: h.name, placeholder: "Label (e.g. Main Drawer)", onChange: (e) => setHolders((prev) => prev.map((row, i) => i === idx ? {
          ...row,
          name: e.target.value
        } : row)), className: "h-10 flex-1 text-[13px]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "numeric", step: "1", placeholder: "0", value: h.amount === 0 ? "" : String(h.amount), onChange: (e) => {
          const v = Math.max(0, Math.floor(Number(e.target.value.replace(/\D/g, "")) || 0));
          setHolders((prev) => prev.map((row, i) => i === idx ? {
            ...row,
            amount: v
          } : row));
        }, className: "h-10 w-28 text-end font-display text-sm font-semibold tabular-nums" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setHolders((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev), disabled: holders.length <= 1, className: "flex h-10 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:bg-muted disabled:opacity-40", "aria-label": "Remove field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
      ] }, h.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setHolders((prev) => [...prev, {
        id: newHolderId(),
        name: "",
        amount: 0
      }]), className: "mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
        " Add Cash Field"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Final Actual Cash In Hand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalCounted, size: "xl" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "07", title: "Difference" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick: () => setCardDetail("difference"), className: cn("cursor-pointer rounded-2xl border p-5 transition-all", statusMeta.bg, statusMeta.border), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", statusMeta.pill), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
          statusMeta.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoPop, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBlock, { title: "Difference", formula: `${fmt(totalCounted)} − ${fmt(expectedClosing)} = ${diff >= 0 ? "+" : ""}${fmt(diff)}`, lines: ["Positive → Extra cash", "Negative → Shortage", "Zero → Perfectly matched"] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Math.abs(diff), size: "3xl", className: statusMeta.text }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "AI", title: "Closing Assistant" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ClosingAssistant, { date, openingCash, expected: expectedClosing, counted: totalCounted, diff, cashSale, withdraw, purchase, expense, employeePaid, employeeReceived, distributionTotal, shopEntries, whEntries, empEntries, tomorrowPurchases }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Closing Notes (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Add any context about today's closing…", className: "mt-2 min-h-[70px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto] gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveClosing, disabled: saving, className: "h-12 text-base", children: saving ? "Saving…" : existingClosing ? "Update Closing" : "Confirm Closing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: shareClosingReport, variant: "outline", className: "h-12 px-4", "aria-label": "Share closing report", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { index: "08", title: "Closing History" }),
    closings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl p-6 text-center text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "mx-auto mb-2 h-5 w-5 opacity-60" }),
      "No closings yet."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: closings.map((c) => {
      const d = Number(c.difference) || 0;
      const tone = Math.abs(d) < 0.01 ? "text-foreground/70" : d > 0 ? "text-emerald-700" : "text-rose-700";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDetail(c), className: "flex w-full items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-start transition-colors hover:bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: c.closing_date }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
            "Exp ",
            fmt(Number(c.expected_cash)),
            " · Cnt ",
            fmt(Number(c.counted_cash))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Diff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-display text-sm font-semibold tabular-nums", tone), children: [
            d >= 0 ? "+" : "",
            fmt(d)
          ] })
        ] })
      ] }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDetailSheet, { cardKey: cardDetail, onClose: () => setCardDetail(null), date, opening: openingCash, cashSale, withdraw, purchase, expense, employeePaid, employeeReceived, otherCashIn, totalReceived, totalGiven, expected: expectedClosing, counted: totalCounted, diff, txns, shopEntries, whEntries, empEntries, tomorrowPurchases, nextDate, prevClosing, shopName, distribution, distributionTotal }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!detail, onOpenChange: (o) => !o && setDetail(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[85vh] overflow-y-auto rounded-t-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { children: [
        "Closing — ",
        detail?.closing_date
      ] }) }),
      detail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Opening Cash", value: Number(detail.opening_cash) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Cash Sale + Other", value: Number(detail.cash_sale) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Withdraw", value: Number(detail.withdraw) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Purchase", value: -Number(detail.purchase) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Expense + Employee", value: -Number(detail.expense) }),
        Number(detail.distribution_total) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Tomorrow Distribution", value: -Number(detail.distribution_total) }),
        Array.isArray(detail.distribution) && detail.distribution.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/60 bg-amber-50/40 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-800", children: "Distribution breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1.5 space-y-1", children: detail.distribution.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/85", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold tabular-nums", children: fmt(Number(r.amount)) })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-primary", children: "Expected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(detail.expected_cash), size: "lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Actual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(detail.counted_cash), size: "lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Difference" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(detail.difference), size: "lg", showSign: true })
        ] }),
        detail.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 px-4 py-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-wrap text-foreground/85", children: detail.notes })
        ] }),
        Array.isArray(detail.holders) && detail.holders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/50 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Cash Holders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1.5 space-y-1", children: detail.holders.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/85", children: h.name ?? "Cash" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold tabular-nums", children: fmt(Number(h.amount) || 0) })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditHistoryButton, { entityType: "daily_closings", entityId: detail.id, label: "View Edit History", variant: "outline" }) }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => editClosing(detail), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1 h-4 w-4" }),
            " Edit Closing"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: () => setDeleteTarget(detail), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-4 w-4" }),
            " Delete Closing"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (o) => !o && setDeleteTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this closing?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Closing for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteTarget?.closing_date }),
          " will be moved to the recycle bin. You can restore it later if needed."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => deleteTarget && deleteClosing(deleteTarget.id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function SectionLabel({
  index,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/60", children: index }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border/70" })
  ] });
}
function MiniStat({
  label,
  value,
  onClick
}) {
  const clickable = !!onClick;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { onClick, className: cn("rounded-xl p-2.5", clickable && "cursor-pointer transition-all hover:border-primary/40 active:scale-[0.98]"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "sm" }) })
  ] });
}
function InfoPop({
  content
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => e.stopPropagation(), className: "flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground/70 hover:bg-muted hover:text-foreground", "aria-label": "Info", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { align: "end", sideOffset: 6, className: "w-72 p-0", children: content })
  ] });
}
function InfoBlock({
  title,
  formula,
  lines
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: "Live formula" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 px-4 py-3 text-[12px] leading-relaxed", children: [
      lines?.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80", children: l }, i)),
      formula && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] text-foreground", children: formula })
    ] })
  ] });
}
function BreakdownRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md", showSign: true })
  ] });
}
const CARD_META = {
  opening: {
    title: "Opening Cash",
    subtitle: "Cash on hand before today"
  },
  cash_sale: {
    title: "Cash Sale",
    subtitle: "Today's cash sales by shop"
  },
  withdraw: {
    title: "Bank Withdraw",
    subtitle: "Today's bank withdrawals"
  },
  purchase: {
    title: "Purchase",
    subtitle: "Today's purchase cash out"
  },
  expense: {
    title: "Expense",
    subtitle: "Today's expenses (non-employee)"
  },
  employee: {
    title: "Employee Payments",
    subtitle: "Today's payments to employees"
  },
  received: {
    title: "Total Cash Received",
    subtitle: "All cash that came in today"
  },
  given: {
    title: "Total Cash Given",
    subtitle: "All cash that went out today"
  },
  distribution: {
    title: "Tomorrow Distribution",
    subtitle: "Cash distributed for next-day purchases"
  },
  expected: {
    title: "Expected Cash",
    subtitle: "Live formula breakdown"
  },
  actual: {
    title: "Actual Cash",
    subtitle: "Counted real-world cash"
  },
  difference: {
    title: "Difference",
    subtitle: "Actual − Expected"
  }
};
function CardDetailSheet(props) {
  const k = props.cardKey;
  const meta = k ? CARD_META[k] : null;
  const entries = reactExports.useMemo(() => {
    if (!k) return [];
    if (k === "cash_sale") return props.shopEntries.filter((e) => e.entry_type === "sale").map((e) => ({
      ...e,
      _amount: Number(e.cash_sale || 0),
      _label: props.shopName(e.shop_id)
    }));
    if (k === "withdraw") return props.shopEntries.filter((e) => e.entry_type === "withdraw").map((e) => ({
      ...e,
      _amount: Number(e.withdraw_amount || 0),
      _label: props.shopName(e.shop_id)
    }));
    if (k === "purchase") return [...props.shopEntries.filter((e) => e.entry_type === "purchase").map((e) => ({
      ...e,
      _amount: Number(e.purchase_amount || 0),
      _label: props.shopName(e.shop_id)
    })), ...props.whEntries.filter((e) => e.entry_type === "warehouse_purchase" && (e.payment_status === "cash" || e.payment_status === "partial")).map((e) => ({
      ...e,
      _amount: Number(e.payment_status === "cash" ? e.amount : e.paid_amount || 0),
      _label: `Warehouse · ${e.party_name ?? "—"}`
    }))];
    if (k === "expense") return props.shopEntries.filter((e) => e.entry_type === "expense").map((e) => ({
      ...e,
      _amount: Number(e.expense_amount || 0),
      _label: props.shopName(e.shop_id)
    }));
    if (k === "employee") return props.empEntries.filter((e) => e.entry_type === "given").map((e) => ({
      ...e,
      _amount: Number(e.amount || 0),
      _label: "Employee"
    }));
    if (k === "distribution") return props.tomorrowPurchases.map((e) => ({
      ...e,
      _amount: Number(e.purchase_amount || 0),
      _label: props.shopName(e.shop_id)
    }));
    return [];
  }, [k, props.shopEntries, props.whEntries, props.empEntries, props.tomorrowPurchases, props.shopName]);
  const total = reactExports.useMemo(() => {
    if (!k) return 0;
    if (k === "opening") return props.opening;
    if (k === "cash_sale") return props.cashSale;
    if (k === "withdraw") return props.withdraw;
    if (k === "purchase") return props.purchase;
    if (k === "expense") return props.expense;
    if (k === "employee") return props.employeePaid;
    if (k === "received") return props.totalReceived;
    if (k === "given") return props.totalGiven;
    if (k === "distribution") return props.distributionTotal;
    if (k === "expected") return props.expected;
    if (k === "actual") return props.counted;
    return props.diff;
  }, [k, props]);
  const formula = reactExports.useMemo(() => {
    if (!k) return "";
    if (k === "opening") return props.prevClosing ? `Carried from ${props.prevClosing.closing_date} = ${fmt(props.opening)}` : "Manually entered";
    if (k === "received") return `${fmt(props.cashSale)} + ${fmt(props.withdraw)} + ${fmt(props.otherCashIn + props.employeeReceived)} = ${fmt(props.totalReceived)}`;
    if (k === "given") return `${fmt(props.purchase)} + ${fmt(props.expense)} + ${fmt(props.employeePaid)} = ${fmt(props.totalGiven)}`;
    if (k === "distribution") return props.distribution.map((r) => `${r.name}: ${fmt(r.amount)}`).join("\n") + `
= ${fmt(props.distributionTotal)}`;
    if (k === "expected") return `Opening:            ${fmt(props.opening)}
+ Withdraw:         ${fmt(props.withdraw)}
+ Other Income:     ${fmt(props.otherCashIn)}
+ Emp Received:     ${fmt(props.employeeReceived)}
− Tomorrow Distrib: ${fmt(props.distributionTotal)}
− Expense:          ${fmt(props.expense)}
− Employee Given:   ${fmt(props.employeePaid)}
= Expected Cash:    ${fmt(props.expected)}`;
    if (k === "difference") return `${fmt(props.counted)} − ${fmt(props.expected)} = ${props.diff >= 0 ? "+" : ""}${fmt(props.diff)}`;
    return `${entries.length} entr${entries.length === 1 ? "y" : "ies"} · Σ = ${fmt(total)}`;
  }, [k, props, entries.length, total]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!k, onOpenChange: (o) => !o && props.onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[88vh] overflow-y-auto rounded-t-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { children: [
        meta?.title,
        " — ",
        props.date
      ] }),
      meta?.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta.subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: k === "difference" ? Math.abs(total) : total, size: "2xl", showSign: k === "difference" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-3 whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px]", children: formula })
      ] }),
      k === "received" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Cash Sale", value: props.cashSale }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Withdraw", value: props.withdraw }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Employee Received", value: props.employeeReceived }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Other Cash In", value: props.otherCashIn })
      ] }),
      k === "given" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Purchase", value: -props.purchase }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Expense", value: -props.expense }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Employee Payments", value: -props.employeePaid })
      ] }),
      k === "distribution" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: props.distribution.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: r.name, value: -r.amount }, r.name)) }),
      k === "expected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Opening Cash", value: props.opening }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Withdraw", value: props.withdraw }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Other Income", value: props.otherCashIn }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Employee Received", value: props.employeeReceived }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Tomorrow Distribution", value: -props.distributionTotal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Expense", value: -props.expense }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Employee Given", value: -props.employeePaid })
      ] }),
      k === "difference" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Actual", value: props.counted }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreakdownRow, { label: "Expected", value: -props.expected })
      ] }),
      (k === "cash_sale" || k === "withdraw" || k === "purchase" || k === "expense" || k === "employee" || k === "distribution") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          k === "distribution" ? `Tomorrow purchases (${props.nextDate})` : `Entries`,
          " (",
          entries.length,
          ")"
        ] }),
        entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-[12px] text-muted-foreground", children: k === "distribution" ? `No tomorrow purchase entries found for ${props.nextDate}.` : "No entries on this date." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-lg border border-border/60 bg-card/50 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: e._label ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: new Date(e.created_at).toLocaleTimeString(void 0, {
              hour: "2-digit",
              minute: "2-digit"
            }) }),
            e.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-foreground/70 line-clamp-2", children: e.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(e._amount ?? e.amount ?? 0), size: "sm" })
        ] }) }, e.id)) })
      ] })
    ] })
  ] }) });
}
export {
  DailyClosingPage as component
};
