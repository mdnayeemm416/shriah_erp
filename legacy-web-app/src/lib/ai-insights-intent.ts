// AI Insights — detects high-level intents on top of smart-query + erp-query.
// Pure functions, runs locally without AI calls.

import type { SmartQuery } from "./smart-query";
import type { ErpIntent } from "./erp-query";

export type NavigationTarget =
  | "/shop" | "/reports"
  | "/daily-closing" | "/employees"
  | "/summary" | "/settings";

const NAV_PATTERNS: Array<[RegExp, NavigationTarget, string]> = [
  [/\b(open|go to|show)\s+(shop|shops)\b/i, "/shop", "Shop"],
  [/\b(open|go to|show)\s+report(s)?\b/i, "/reports", "Reports"],
  [/\b(open|go to|show)\s+(transactions?|txn)\b/i, "/summary", "Transactions"],
  [/\b(open|go to|show)\s+(daily\s*closing|closing)\b/i, "/daily-closing", "Daily Closing"],
  [/\b(open|go to|show)\s+employees?\b/i, "/employees", "Employees"],
  [/\b(open|go to|show)\s+summary\b/i, "/summary", "Summary"],
  [/\b(open|go to|show)\s+settings\b/i, "/settings", "Settings"],
];

export type NavigationIntent = { kind: "navigate"; to: NavigationTarget; label: string };

export function detectNavigationIntent(input: string): NavigationIntent | null {
  for (const [re, to, label] of NAV_PATTERNS) {
    if (re.test(input)) return { kind: "navigate", to, label };
  }
  return null;
}

export type EntryDraft = {
  kind: "entry";
  type: "purchase" | "expense" | "withdraw" | "employee_given" | "employee_received";
  amount: number;
  date: string | null;
  shop: string | null;
  party: string | null;
  employee: string | null;
  note: string | null;
};

export function detectEntryIntent(
  raw: string,
  sq: SmartQuery,
  erp: ErpIntent,
): EntryDraft | null {
  if (sq.amount == null) return null;
  const low = raw.toLowerCase();

  let type: EntryDraft["type"] | null = null;
  if (/\bpurchase|buy|bought\b/.test(low)) type = "purchase";
  else if (/\bexpense|cost|spent|fuel\b/.test(low)) type = "expense";
  else if (/\bwithdraw\b/.test(low)) type = "withdraw";
  else if (/\b(employee\s+given|given\s+employee|salary\s+given)\b/.test(low)) type = "employee_given";
  else if (/\b(employee\s+received|received\s+employee|salary\s+received)\b/.test(low)) type = "employee_received";

  if (!type) return null;

  // Strip "today/yesterday" already removed in sq.text — leftover may contain a note like "fuel".
  const note = (sq.text || "").trim() || null;

  return {
    kind: "entry",
    type,
    amount: sq.amount,
    date: sq.dateFrom ?? sq.dateTo ?? null,
    shop: erp.scope !== "all" && erp.scope !== "warehouse" ? erp.scope : null,
    party: erp.party,
    employee: erp.employee,
    note,
  };
}

export const INSIGHT_SUGGESTIONS = [
  "Summarise this week's performance",
  "Which shop has highest expense?",
  "Flag cash differences over SAR 100",
  "Top suppliers by spend",
  "Show employee payout summary",
  "Which employee received most money?",
];

export type DateQuickRange = "today" | "yesterday" | "this_week" | "this_month" | "last_month" | "custom";

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export function resolveQuickRange(r: DateQuickRange): { from: string; to: string } | null {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let from = new Date(today), to = new Date(today);
  switch (r) {
    case "today": break;
    case "yesterday": from.setDate(from.getDate() - 1); to = new Date(from); break;
    case "this_week": from.setDate(from.getDate() - from.getDay()); break;
    case "this_month": from = new Date(today.getFullYear(), today.getMonth(), 1); break;
    case "last_month":
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "custom": return null;
  }
  return { from: ymd(from), to: ymd(to) };
}
