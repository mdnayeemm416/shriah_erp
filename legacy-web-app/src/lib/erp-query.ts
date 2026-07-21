// Magic Search ERP query engine. Detects metric, scopes (shop / cashier /
// employee / party), and report mode. Pure functions only.

import { SHOP_ORDER } from "./shop-order";

export type ErpMetric =
  | "cash_sale" | "pos_sale" | "bank_sale" | "credit_sale" | "total_sale"
  | "cash_buy" | "due_payment" | "credit_buy" | "total_purchase"
  | "expense" | "withdraw"
  | "employee_given" | "employee_received"
  | "other_income"
  | "cash_position" | "plus_minus"
  | "daily_closing" | "expected_cash" | "actual_cash";

export type ErpScope = "all" | "warehouse" | string; // shop name or 'warehouse'

export type ErpIntent = {
  metric: ErpMetric | null;
  scope: ErpScope;
  cashier: string | null;     // matched cashier name
  employee: string | null;    // matched employee name
  party: string | null;       // matched supplier/party name
  reportMode: boolean;
  matched: string[];
};

export type ErpEntities = {
  cashiers?: string[];
  employees?: string[];
  parties?: string[];
};

export const METRIC_LABEL: Record<ErpMetric, string> = {
  cash_sale: "Cash Sale", pos_sale: "POS Sale", bank_sale: "Bank Sale",
  credit_sale: "Credit Sale", total_sale: "Total Sale",
  cash_buy: "Cash Buy", due_payment: "Due Payment", credit_buy: "Credit Buy",
  total_purchase: "Total Purchase",
  expense: "Expense", withdraw: "Withdraw",
  employee_given: "Employee Given", employee_received: "Employee Received",
  other_income: "Other Income",
  cash_position: "Cash Position", plus_minus: "Plus / Minus",
  daily_closing: "Daily Closing", expected_cash: "Expected Cash", actual_cash: "Actual Cash",
};

const METRIC_PHRASES: Array<[RegExp, ErpMetric]> = [
  [/\btotal\s*sale(s)?\b/, "total_sale"],
  [/\btotal\s*purchase(s)?\b/, "total_purchase"],
  [/\bcash\s*sale\b/, "cash_sale"],
  [/\bpos\s*sale\b/, "pos_sale"],
  [/\bbank\s*sale\b/, "bank_sale"],
  [/\bcredit\s*sale\b/, "credit_sale"],
  [/\bcash\s*buy\b/, "cash_buy"],
  [/\bcredit\s*buy\b/, "credit_buy"],
  [/\bdue\s*payment\b|\bdue\b/, "due_payment"],
  [/\bemployee\s*given\b|\bgiven\s*employee\b|\bsalary\s*given\b/, "employee_given"],
  [/\bemployee\s*received\b|\breceived\s*employee\b|\bsalary\s*received\b/, "employee_received"],
  [/\bemployee\s*payment\b|\bemployee\b/, "employee_given"],
  [/\bother\s*income\b|\bextra\s*income\b/, "other_income"],
  [/\bcash\s*position\b/, "cash_position"],
  [/\bplus\s*minus\b|\bdifference\b/, "plus_minus"],
  [/\bdaily\s*closing\b|\bclosing\b/, "daily_closing"],
  [/\bexpected\s*cash\b/, "expected_cash"],
  [/\bactual\s*cash\b|\bcounted\s*cash\b/, "actual_cash"],
  [/\bexpense(s)?\b/, "expense"],
  [/\bwithdraw(al)?\b/, "withdraw"],
  [/\bpurchase(s)?\b/, "total_purchase"],
  [/\bsale(s)?\b/, "total_sale"],
];

const REPORT_RE = /\ball\s*shop\s*report\b|\bfull\s*report\b|\bcompany\s*summary\b|\ball\s*shops\s*summary\b|\bcompany\s*report\b|\breport\b|\bsummary\b/;

const SHOP_NAMES = [...SHOP_ORDER, "Warehouse"];

const DEFAULT_CASHIERS = ["Anwer", "Imran", "Sajib", "Saiful"];

function matchName(low: string, names: string[]): string | null {
  for (const n of names) {
    const re = new RegExp(`\\b${n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(low)) return n;
  }
  return null;
}

export function parseErpIntent(input: string, entities: ErpEntities = {}): ErpIntent {
  const matched: string[] = [];
  const low = " " + (input || "").toLowerCase() + " ";

  let reportMode = false;
  const reportHit = low.match(REPORT_RE);
  if (reportHit) { reportMode = true; matched.push(reportHit[0].trim()); }

  // Shop scope
  let scope: ErpScope = "all";
  for (const name of SHOP_NAMES) {
    const re = new RegExp(`\\b${name.toLowerCase()}\\b`);
    const m = low.match(re);
    if (m) {
      scope = name.toLowerCase() === "warehouse" ? "warehouse" : name;
      matched.push(m[0].trim());
      break;
    }
  }

  // Cashier — defaults + provided
  const cashierPool = Array.from(new Set([...(entities.cashiers ?? []), ...DEFAULT_CASHIERS]));
  const cashier = matchName(low, cashierPool);
  if (cashier) matched.push(cashier.toLowerCase());

  // Employee
  const employee = matchName(low, entities.employees ?? []);
  if (employee) matched.push(employee.toLowerCase());

  // Party (suppliers / customers)
  const party = matchName(low, entities.parties ?? []);
  if (party) matched.push(party.toLowerCase());

  // Metric (skip if report mode)
  let metric: ErpMetric | null = null;
  if (!reportMode) {
    for (const [re, m] of METRIC_PHRASES) {
      const hit = low.match(re);
      if (hit) { metric = m; matched.push(hit[0].trim()); break; }
    }
  }

  // If a party is in scope and no metric → default to total purchase (supplier view)
  if (!metric && !reportMode && party) metric = "total_purchase";
  // Employee scope without explicit metric → default given
  if (!metric && !reportMode && employee) metric = "employee_given";

  return { metric, scope, cashier, employee, party, reportMode, matched };
}

export function hasErpIntent(i: ErpIntent): boolean {
  return i.reportMode || i.metric != null;
}
