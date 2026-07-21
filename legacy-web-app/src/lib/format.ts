// Money formatting helpers.
//
// Display rule (project-wide):
//   - Summary / dashboard / KPI cards and printable Summary Reports show
//     WHOLE numbers (no decimals).
//   - Invoices, ledger details, product prices, detail reports keep two
//     decimal places — unchanged.
// Storage is always full precision; this only affects display.

export const SAR = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2,
  }).format(v || 0);
};

/** Whole-number SAR (rounded) for dashboard / summary / KPI cards. */
export const SAR_WHOLE = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(Math.round(v || 0));
};

export const TXN_LABELS: Record<string, string> = {
  cash_in: "Cash In",
  cash_out: "Cash Out",
  bank_withdraw: "Bank Withdraw",
  purchase: "Warehouse Purchase",
  expense: "Expense",
  supervisor_payment: "Supervisor Payment",
  adjustment: "Adjustment",
};

export const PAY_METHODS = ["cash", "bank", "card", "other"] as const;
