// Page-permission system for ERP RBAC.
// Page keys correspond to top-level route segments under /_app.

export type PageKey =
  | "summary" | "shop" | "reports"
  | "finance-workflow" | "cash-flow" | "cash-custody"
  | "daily-closing"
  | "ai-insights" | "employees"
  | "settings" | "team" | "backup-center" | "store-admin"
  | "company-transactions"
  | "sales-return"
  | "my-expenses"
  | "employee-expenses"
  | "price-compare";


export const ALL_PAGES: { key: PageKey; label: string }[] = [
  { key: "summary",          label: "Home / Summary" },
  { key: "shop",             label: "Shop" },
  { key: "reports",          label: "Reports" },
  { key: "finance-workflow", label: "Finance Workflow" },
  { key: "cash-flow",        label: "Cash Flow (legacy)" },
  { key: "cash-custody",     label: "Cash Custody (legacy)" },
  { key: "daily-closing",    label: "Daily Closing" },
  { key: "ai-insights",      label: "Ask AI" },
  { key: "employees",        label: "Employees" },
  { key: "company-transactions", label: "Company Transactions" },
  { key: "settings",         label: "Settings" },
  { key: "team",             label: "Team & Access" },
  { key: "backup-center",    label: "Backup Center" },
  { key: "store-admin",      label: "WholeSale" },
  { key: "sales-return",     label: "Sales Returns" },
  { key: "my-expenses",      label: "My Wallet (Employee)" },
  { key: "employee-expenses", label: "Employee Wallet (Admin)" },
  { key: "price-compare",    label: "Price Compare" },
];

export type AppRole =
  | "super_admin" | "admin" | "manager" | "accountant"
  | "cashier" | "purchaser" | "verifier" | "deliveryman"
  | "sales_delivery"
  | "staff" | "viewer";

const ALL_KEYS = ALL_PAGES.map(p => p.key);

const ROLE_DEFAULTS: Record<AppRole, PageKey[]> = {
  super_admin: ALL_KEYS,
  admin:       ALL_KEYS,
  manager:     ALL_KEYS,
  accountant:  ["finance-workflow", "reports", "daily-closing", "summary"],
  cashier:     ["shop", "my-expenses"],
  purchaser:   ["finance-workflow", "my-expenses"],
  verifier:    ["finance-workflow", "my-expenses"],
  deliveryman: ["store-admin", "my-expenses"],
  sales_delivery: ["store-admin", "my-expenses"],
  staff:       ["summary", "shop", "reports", "my-expenses"],
  viewer:      [], // viewer only sees explicitly-granted pages
};

/** Compute the union of page keys allowed for a set of roles, merged with explicit grants. */
export function computeAllowedPages(roles: string[], explicitGrants: string[]): PageKey[] {
  const set = new Set<string>(explicitGrants);
  for (const r of roles) {
    const defs = ROLE_DEFAULTS[r as AppRole];
    if (defs) defs.forEach(k => set.add(k));
  }
  // Super Admin / Admin override
  if (roles.includes("super_admin") || roles.includes("admin")) return ALL_KEYS;
  return ALL_KEYS.filter(k => set.has(k));
}

/** Map a current pathname (e.g. "/cash-flow/foo") to the closest known PageKey. */
export function pageKeyFromPath(pathname: string): PageKey | null {
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  if (!seg) return "summary";
  const match = ALL_KEYS.find(k => k === seg);
  return (match as PageKey) ?? null;
}

export function roleDefaults(role: AppRole): PageKey[] {
  return ROLE_DEFAULTS[role] ?? [];
}

/** Read-only roles cannot mutate data anywhere in the UI. */
export function isReadOnlyRole(roles: string[]): boolean {
  if (!roles.length) return false;
  return roles.every((r) => r === "viewer");
}
