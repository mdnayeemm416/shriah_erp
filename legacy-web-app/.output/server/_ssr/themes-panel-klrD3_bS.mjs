import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { aD as useTheme, B as Button, d as cn } from "./router-KeVl8_Ln.mjs";
import { S as Switch } from "./switch-BxdoXYZW.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { b as RotateCcw, n as Check, l as Sparkles } from "../_libs/lucide-react.mjs";

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
import "../_libs/radix-ui__react-switch.mjs";
function ThemesPanel() {
  const { themes, themeId, setThemeId, options, setOptions, resetOptions } = useTheme();
  const darkThemes = themes.filter((t) => t.mode === "dark");
  const lightThemes = themes.filter((t) => t.mode === "light");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Dark themes", subtitle: "Premium dark palettes tuned for finance dashboards.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeGrid, { items: darkThemes, active: themeId, onSelect: setThemeId }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Light themes", subtitle: "Clean light palettes for daytime workflows.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeGrid, { items: lightThemes, active: themeId, onSelect: setThemeId }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Advanced options", subtitle: "Fine-tune density, corners, glass and motion.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OptionRow,
          {
            label: "Compact mode",
            hint: "Tighter spacing across the app.",
            checked: options.compact,
            onChange: (v) => setOptions({ compact: v })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OptionRow,
          {
            label: "Glass effect",
            hint: "Frosted blur on cards & popovers.",
            checked: options.glass,
            onChange: (v) => setOptions({ glass: v })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SegmentRow,
          {
            label: "Rounded corners",
            value: options.rounded,
            options: [
              { value: "sharp", label: "Sharp" },
              { value: "soft", label: "Soft" },
              { value: "round", label: "Round" }
            ],
            onChange: (v) => setOptions({ rounded: v })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SegmentRow,
          {
            label: "Animation",
            value: options.motion,
            options: [
              { value: "off", label: "Off" },
              { value: "subtle", label: "Subtle" },
              { value: "full", label: "Full" }
            ],
            onChange: (v) => setOptions({ motion: v })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: resetOptions, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
        " Reset options"
      ] }) })
    ] })
  ] });
}
function Section({ title, subtitle, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold tracking-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: subtitle })
    ] }),
    children
  ] });
}
function ThemeGrid({
  items,
  active,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCard, { theme: t, active: t.id === active, onClick: () => onSelect(t.id) }, t.id)) });
}
function ThemeCard({ theme, active, onClick }) {
  const { bg, surface, accent, text } = theme.preview;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: cn(
        "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all tap",
        "hover:border-primary/50 hover:shadow-[var(--shadow-soft)]",
        active ? "border-primary ring-2 ring-primary/30" : "border-border/60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative h-24 w-full overflow-hidden rounded-xl border border-black/10",
            style: { background: bg },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute left-2 top-2 h-3 w-12 rounded-full",
                  style: { background: surface, opacity: 0.9 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute left-2 top-7 h-9 w-[55%] rounded-md",
                  style: { background: surface }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute right-2 top-7 h-9 w-[30%] rounded-md",
                  style: {
                    background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                    boxShadow: `0 4px 14px -2px ${accent}66`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute bottom-2 left-2 h-1.5 w-[40%] rounded-full",
                  style: { background: text, opacity: 0.6 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute bottom-2 left-[44%] h-1.5 w-[30%] rounded-full",
                  style: { background: text, opacity: 0.3 }
                }
              ),
              active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full",
                  style: { background: accent, color: bg },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-semibold leading-tight", children: theme.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10.5px] text-muted-foreground", children: theme.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Sparkles,
            {
              className: cn(
                "mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors",
                active ? "text-primary" : "text-muted-foreground/40"
              )
            }
          )
        ] })
      ]
    }
  );
}
function OptionRow({
  label,
  hint,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: hint })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked, onCheckedChange: onChange })
  ] });
}
function SegmentRow({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 rounded-lg bg-muted/60 p-1", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange(o.value),
        className: cn(
          "flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition-all",
          value === o.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        ),
        children: o.label
      },
      o.value
    )) })
  ] });
}
export {
  ThemesPanel
};
