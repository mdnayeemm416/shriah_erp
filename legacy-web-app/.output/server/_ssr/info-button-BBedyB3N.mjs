import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as Popover, p as PopoverTrigger, d as cn, q as PopoverContent } from "./router-KeVl8_Ln.mjs";
import { M as METRIC_INFO } from "./help-content-CrTK3PSB.mjs";
import { aA as Info } from "../_libs/lucide-react.mjs";
function InfoButton({ metric, info, size = "sm", className, ariaLabel }) {
  const data = info ?? (metric ? METRIC_INFO[metric] : void 0);
  if (!data) return null;
  const dim = size === "xs" ? "h-4 w-4" : "h-5 w-5";
  const ico = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": ariaLabel ?? `What is ${data.title}?`,
        className: cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground/70",
          "transition-colors hover:bg-muted hover:text-foreground",
          dim,
          className
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: ico })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        align: "start",
        sideOffset: 6,
        className: "w-72 p-0 animate-scale-in",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: data.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: "What it means" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3 text-[12px] leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/85", children: data.what }),
            data.formula && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/40 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Formula" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-[11px] text-foreground", children: data.formula })
            ] }),
            data.inputs && data.inputs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Affected by" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 list-disc space-y-0.5 pl-4 text-foreground/80", children: data.inputs.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: i }, i)) })
            ] }),
            data.example && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md bg-primary/5 px-2.5 py-2 text-[11px] italic text-foreground/75", children: data.example })
          ] })
        ]
      }
    )
  ] });
}
export {
  InfoButton as I
};
