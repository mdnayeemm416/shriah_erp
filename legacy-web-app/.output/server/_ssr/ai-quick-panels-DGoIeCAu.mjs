import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card, af as SAR, d as cn } from "./router-KeVl8_Ln.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { aR as Activity, aV as ArrowUpRight, by as HeartPulse, bz as Gauge } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/tslib.mjs";
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
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
function pad(n) {
  return String(n).padStart(2, "0");
}
function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
async function fetchDailySummary(date = /* @__PURE__ */ new Date()) {
  const d = ymd(date);
  const [{ data: shop }, { data: cls }] = await Promise.all([
    supabase.from("shop_entries").select("entry_type, cash_sale, pos_sale, bank_sale, credit_sale, expense_amount, withdraw_amount, purchase_amount").eq("is_deleted", false).eq("txn_date", d),
    supabase.from("daily_closings").select("difference").eq("is_deleted", false).eq("closing_date", d)
  ]);
  const s = { cash: 0, pos: 0, bank: 0, credit: 0, expense: 0, withdraw: 0, purchase: 0 };
  for (const r of shop ?? []) {
    if (r.entry_type === "sale") {
      s.cash += +r.cash_sale || 0;
      s.pos += +r.pos_sale || 0;
      s.bank += +r.bank_sale || 0;
      s.credit += +r.credit_sale || 0;
    } else if (r.entry_type === "expense") s.expense += +r.expense_amount || 0;
    else if (r.entry_type === "withdraw") s.withdraw += +r.withdraw_amount || 0;
    else if (r.entry_type === "purchase") s.purchase += +r.purchase_amount || 0;
  }
  const closingDiff = (cls ?? []).reduce((a, r) => a + (+r.difference || 0), 0);
  return {
    totalSale: s.cash + s.pos + s.bank + s.credit,
    cashSale: s.cash,
    expense: s.expense,
    withdraw: s.withdraw,
    purchase: s.purchase,
    closingDiff
  };
}
async function fetchCashHealth(days = 30) {
  const end = /* @__PURE__ */ new Date();
  const start = /* @__PURE__ */ new Date();
  start.setDate(start.getDate() - days + 1);
  const from = ymd(start), to = ymd(end);
  const { data } = await supabase.from("shop_entries").select("entry_type, cash_sale, expense_amount, withdraw_amount, purchase_amount").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to).limit(5e3);
  let inflow = 0, outflow = 0;
  for (const r of data ?? []) {
    if (r.entry_type === "sale") inflow += +r.cash_sale || 0;
    else if (r.entry_type === "withdraw") inflow += +r.withdraw_amount || 0;
    else if (r.entry_type === "expense") outflow += +r.expense_amount || 0;
    else if (r.entry_type === "purchase") outflow += +r.purchase_amount || 0;
  }
  const ratio = inflow / Math.max(outflow, 1);
  const status = ratio >= 1.2 ? "healthy" : ratio >= 0.95 ? "watch" : "risk";
  return { inflow, outflow, net: inflow - outflow, ratio, status };
}
async function fetchStabilityScore() {
  const end = /* @__PURE__ */ new Date();
  const start30 = /* @__PURE__ */ new Date();
  start30.setDate(start30.getDate() - 29);
  const from = ymd(start30), to = ymd(end);
  const [{ data: shop }, { data: cls }] = await Promise.all([
    supabase.from("shop_entries").select("txn_date, entry_type, cash_sale, pos_sale, bank_sale, credit_sale, expense_amount, withdraw_amount, purchase_amount").eq("is_deleted", false).gte("txn_date", from).lte("txn_date", to).limit(1e4),
    supabase.from("daily_closings").select("difference, closing_date").eq("is_deleted", false).gte("closing_date", from).lte("closing_date", to)
  ]);
  const perDay = /* @__PURE__ */ new Map();
  for (const r of shop ?? []) {
    const day = perDay.get(r.txn_date) ?? { sale: 0, out: 0 };
    if (r.entry_type === "sale") {
      day.sale += (+r.cash_sale || 0) + (+r.pos_sale || 0) + (+r.bank_sale || 0) + (+r.credit_sale || 0);
    } else if (r.entry_type === "expense") day.out += +r.expense_amount || 0;
    else if (r.entry_type === "purchase") day.out += +r.purchase_amount || 0;
    perDay.set(r.txn_date, day);
  }
  const days = Array.from(perDay.values());
  const totalSale = days.reduce((a, d) => a + d.sale, 0);
  const totalOut = days.reduce((a, d) => a + d.out, 0);
  const margin = totalSale > 0 ? Math.max(0, (totalSale - totalOut) / totalSale) : 0;
  const profitability = Math.round(margin * 40);
  const mean = days.length ? totalSale / days.length : 0;
  const variance = days.length ? days.reduce((a, d) => a + (d.sale - mean) ** 2, 0) / days.length : 0;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
  const consistency = Math.max(0, Math.round(30 * (1 - Math.min(cv, 1))));
  const diffs = (cls ?? []).map((r) => Math.abs(+r.difference || 0));
  const avgDiff = diffs.length ? diffs.reduce((a, x) => a + x, 0) / diffs.length : 0;
  const denom = Math.max(mean * 0.05, 50);
  const accuracy = Math.max(0, Math.round(30 * (1 - Math.min(avgDiff / denom, 1))));
  const score = Math.min(100, profitability + consistency + accuracy);
  return {
    score,
    components: [
      { label: "Profitability", value: profitability, max: 40 },
      { label: "Revenue Consistency", value: consistency, max: 30 },
      { label: "Closing Accuracy", value: accuracy, max: 30 }
    ]
  };
}
const CACHE_KEY = "ai-quick-panels:v1";
function todayKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
function readCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.day === todayKey() ? parsed : null;
  } catch {
    return null;
  }
}
function writeCache(p) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ day: todayKey(), ...p }));
  } catch {
  }
}
function AiQuickPanels({ onRun }) {
  const cached = readCache();
  const [daily, setDaily] = reactExports.useState(cached?.daily ?? null);
  const [health, setHealth] = reactExports.useState(cached?.health ?? null);
  const [score, setScore] = reactExports.useState(cached?.score ?? null);
  reactExports.useEffect(() => {
    if (cached) return;
    let alive = true;
    (async () => {
      const [a, b, c] = await Promise.allSettled([
        fetchDailySummary(),
        fetchCashHealth(),
        fetchStabilityScore()
      ]);
      if (!alive) return;
      const next = {
        daily: a.status === "fulfilled" ? a.value : null,
        health: b.status === "fulfilled" ? b.value : null,
        score: c.status === "fulfilled" ? c.value : null
      };
      if (next.daily) setDaily(next.daily);
      if (next.health) setHealth(next.health);
      if (next.score) setScore(next.score);
      writeCache(next);
    })();
    return () => {
      alive = false;
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2.5 sm:grid-cols-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        role: "button",
        onClick: () => onRun("today full report"),
        className: "group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
            " Today"
          ] }),
          daily ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-base font-bold tabular-nums", children: SAR(daily.totalSale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground", children: "Total sale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 grid grid-cols-2 gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Expense", v: daily.expense }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Withdraw", v: daily.withdraw })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        role: "button",
        onClick: () => onRun("how healthy is cash flow this month?"),
        className: "group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "h-3 w-3" }),
            " Cash Health · 30d"
          ] }),
          health ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                "text-base font-bold",
                health.status === "healthy" && "text-emerald-500",
                health.status === "watch" && "text-amber-500",
                health.status === "risk" && "text-rose-500"
              ), children: health.status === "healthy" ? "Healthy" : health.status === "watch" ? "Watch" : "Risk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10.5px] text-muted-foreground", children: [
                "×",
                health.ratio.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-muted-foreground", children: "In/Out ratio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 grid grid-cols-2 gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "In", v: health.inflow }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Out", v: health.outflow })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        role: "button",
        onClick: () => onRun("business stability score"),
        className: "group relative cursor-pointer overflow-hidden border-border/60 p-3 transition-all hover:border-primary/40 hover:shadow-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gauge, { className: "h-3 w-3" }),
            " Stability"
          ] }),
          score ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold tabular-nums", children: score.score }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-muted-foreground", children: "/100" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "h-full rounded-full transition-all",
                  score.score >= 75 ? "bg-emerald-500" : score.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                ),
                style: { width: `${score.score}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 space-y-0.5 text-[10px] text-muted-foreground", children: score.components.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
                c.value,
                "/",
                c.max
              ] })
            ] }, c.label)) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-primary" })
        ]
      }
    )
  ] });
}
function Mini({ label, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md bg-muted/40 px-1.5 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums", children: Math.round(v).toLocaleString() })
  ] });
}
function Skeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-20 rounded bg-muted animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-28 rounded bg-muted/60 animate-pulse" })
  ] });
}
export {
  AiQuickPanels
};
