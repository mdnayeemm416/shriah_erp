import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const NUM_SIZE: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl",
};

const CCY_SIZE: Record<Size, string> = {
  sm: "text-[0.62em]",
  md: "text-[0.62em]",
  lg: "text-[0.55em]",
  xl: "text-[0.5em]",
  "2xl": "text-[0.42em]",
  "3xl": "text-[0.36em]",
};

/**
 * Renders SAR amounts with small currency label and large bold number.
 *
 * Decimal rule (project-wide):
 *   - "lg", "xl", "2xl", "3xl" → whole numbers by default (dashboard / KPI /
 *     summary cards). Pass `whole={false}` to force two decimals.
 *   - "sm", "md" → two decimals by default (inline detail rows, ledger
 *     entries, invoices). Pass `whole` to override.
 *
 * Example: <SARAmount value={5000} size="2xl" />  ->  "SAR  5,000"
 *          <SARAmount value={8.5}  size="sm"  />  ->  "SAR  8.50"
 */
export function SARAmount({
  value,
  size = "md",
  className,
  currencyClassName,
  showSign = false,
  bold = true,
  whole,
}: {
  value: number | string | null | undefined;
  size?: Size;
  className?: string;
  currencyClassName?: string;
  showSign?: boolean;
  bold?: boolean;
  /** Force whole-number vs two-decimal display. Defaults from `size`. */
  whole?: boolean;
}) {
  const v = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const n = Number.isFinite(v) ? v : 0;
  const sign = showSign ? (n > 0 ? "+" : n < 0 ? "−" : "") : n < 0 ? "−" : "";
  const isCardSize = size === "lg" || size === "xl" || size === "2xl" || size === "3xl";
  const useWhole = whole ?? isCardSize;
  const abs = Math.abs(n);
  const num = useWhole
    ? new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(Math.round(abs))
    : new Intl.NumberFormat("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(abs);

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 tabular-nums leading-none",
        NUM_SIZE[size],
        bold && "font-bold font-display tracking-tight",
        className,
      )}
    >
      <span
        className={cn(
          "font-medium uppercase tracking-wider text-muted-foreground",
          CCY_SIZE[size],
          currencyClassName,
        )}
      >
        SAR
      </span>
      <span>
        {sign}
        {num}
      </span>
    </span>
  );
}

