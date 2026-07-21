import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as cn } from "./router-KeVl8_Ln.mjs";
const NUM_SIZE = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl"
};
const CCY_SIZE = {
  sm: "text-[0.62em]",
  md: "text-[0.62em]",
  lg: "text-[0.55em]",
  xl: "text-[0.5em]",
  "2xl": "text-[0.42em]",
  "3xl": "text-[0.36em]"
};
function SARAmount({
  value,
  size = "md",
  className,
  currencyClassName,
  showSign = false,
  bold = true,
  whole
}) {
  const v = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const n = Number.isFinite(v) ? v : 0;
  const sign = showSign ? n > 0 ? "+" : n < 0 ? "−" : "" : n < 0 ? "−" : "";
  const isCardSize = size === "lg" || size === "xl" || size === "2xl" || size === "3xl";
  const useWhole = whole ?? isCardSize;
  const abs = Math.abs(n);
  const num = useWhole ? new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(Math.round(abs)) : new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(abs);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-baseline gap-1.5 tabular-nums leading-none",
        NUM_SIZE[size],
        bold && "font-bold font-display tracking-tight",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "font-medium uppercase tracking-wider text-muted-foreground",
              CCY_SIZE[size],
              currencyClassName
            ),
            children: "SAR"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sign,
          num
        ] })
      ]
    }
  );
}
export {
  SARAmount as S
};
