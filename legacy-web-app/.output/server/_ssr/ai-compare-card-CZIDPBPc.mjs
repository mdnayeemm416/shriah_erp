import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as cn, af as SAR } from "./router-KeVl8_Ln.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { l as Sparkles, bH as Trophy, Y as Share2 } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "./client-Bs6QIVWe.mjs";
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
function AiCompareCard({
  r,
  onShare
}) {
  const totalA = r.rows.reduce((a, x) => a + x.a, 0);
  const totalB = r.rows.reduce((a, x) => a + x.b, 0);
  const diff = r.headline.a - r.headline.b;
  const pct = Math.abs(r.headline.b > 0 ? diff / r.headline.b * 100 : 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-3.5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
      " AI Compare · ",
      r.kind
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: r.dateLabel }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
      "mt-2 flex items-center gap-2 rounded-xl border px-3 py-2",
      r.winner === "tie" ? "border-border/60 bg-muted/40" : "border-amber-300/40 bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-900/20"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: cn("h-4 w-4", r.winner === "tie" ? "text-muted-foreground" : "text-amber-500") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: [
          r.winner === "tie" ? "Tied on " : "Winner · ",
          r.headline.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-semibold", children: r.winner === "tie" ? `${r.aLabel} = ${r.bLabel}` : r.winner === "a" ? `${r.aLabel} leads by ${SAR(Math.abs(diff))} (${pct.toFixed(1)}%)` : `${r.bLabel} leads by ${SAR(Math.abs(diff))} (${pct.toFixed(1)}%)` })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-[1fr,auto,auto] gap-2 border-b border-border/40 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Metric" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: r.aLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: r.bLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border/30", children: [
      r.rows.map((row) => {
        const aw = row.a > row.b, bw = row.b > row.a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid grid-cols-[1fr,auto,auto] gap-2 py-1.5 text-[12px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: row.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-right tabular-nums", aw && "font-semibold text-emerald-600 dark:text-emerald-400"), children: SAR(row.a) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-right tabular-nums", bw && "font-semibold text-emerald-600 dark:text-emerald-400"), children: SAR(row.b) })
        ] }, row.label);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid grid-cols-[1fr,auto,auto] gap-2 py-1.5 text-[12px] font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(totalA) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums", children: SAR(totalB) })
      ] })
    ] }),
    onShare && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onShare,
        className: "inline-flex h-8 items-center gap-1 rounded-full bg-emerald-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-600",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3.5 w-3.5" }),
          " Share"
        ]
      }
    ) })
  ] });
}
export {
  AiCompareCard
};
