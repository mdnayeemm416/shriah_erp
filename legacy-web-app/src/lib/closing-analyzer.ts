// Lightweight rule-based analyzer for Smart Daily Closing Assistant.
// Runs only on user click — never on render. No AI / network calls.

export type Severity = "info" | "warning" | "critical";

export type Finding = {
  id: string;
  severity: Severity;
  title: string;
  detail?: string;
  hint?: string;
};

type AnalyzeInput = {
  date: string;
  openingCash: number;
  expected: number;
  counted: number;
  diff: number;
  cashSale: number;
  withdraw: number;
  purchase: number;
  expense: number;
  employeePaid: number;
  employeeReceived: number;
  distributionTotal: number;
  shopEntries: any[];
  whEntries: any[];
  empEntries: any[];
  tomorrowPurchases: any[];
};

const HARD_GAP_MIN = 10;   // minutes
const SOFT_GAP_MIN = 120;  // minutes

function fmt(n: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n || 0);
}

function minutesBetween(a: string, b: string) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 60000;
}

// Detect duplicate transactions ignoring company / party name.
// Group by (type, amount) on the SAME date — flag pairs by time gap.
function detectDuplicates(input: AnalyzeInput): Finding[] {
  type Row = { id: string; type: string; amount: number; created_at: string };
  const rows: Row[] = [];

  for (const e of input.shopEntries) {
    const t = e.entry_type as string;
    const amount =
      t === "purchase" ? Number(e.purchase_amount || 0) :
      t === "withdraw" ? Number(e.withdraw_amount || 0) :
      t === "expense"  ? Number(e.expense_amount || 0) :
      t === "sale"     ? Number(e.cash_sale || 0) + Number(e.pos_sale || 0) + Number(e.bank_sale || 0) + Number(e.credit_sale || 0)
      : 0;
    if (amount > 0) rows.push({ id: e.id, type: `shop_${t}`, amount, created_at: e.created_at });
  }
  for (const e of input.empEntries) {
    const amount = Number(e.amount || 0);
    if (amount > 0) rows.push({ id: e.id, type: `emp_${e.entry_type}`, amount, created_at: e.created_at });
  }
  for (const e of input.whEntries) {
    const amount = Number(e.amount || 0);
    if (amount > 0) rows.push({ id: e.id, type: `wh_${e.entry_type}`, amount, created_at: e.created_at });
  }

  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    const k = `${r.type}|${r.amount}`;
    const g = groups.get(k); if (g) g.push(r); else groups.set(k, [r]);
  }

  const out: Finding[] = [];
  for (const [k, g] of groups) {
    if (g.length < 2) continue;
    g.sort((a, b) => a.created_at.localeCompare(b.created_at));
    for (let i = 1; i < g.length; i++) {
      const gap = minutesBetween(g[i - 1].created_at, g[i].created_at);
      const [type, amt] = k.split("|");
      const label = type.replace("_", " ");
      if (gap <= HARD_GAP_MIN) {
        out.push({
          id: `dup-${g[i].id}`,
          severity: "critical",
          title: `Possible duplicate ${label}`,
          detail: `Two ${label} entries of ${fmt(Number(amt))} saved ${Math.round(gap)} min apart`,
          hint: "Review and remove the accidental copy.",
        });
      } else if (gap <= SOFT_GAP_MIN) {
        out.push({
          id: `dup-${g[i].id}`,
          severity: "warning",
          title: `Repeated ${label} amount`,
          detail: `Two ${label} entries of ${fmt(Number(amt))} within ${Math.round(gap)} min`,
          hint: "Verify these are intentional separate transactions.",
        });
      }
    }
  }
  return out;
}

export function analyzeClosing(input: AnalyzeInput): Finding[] {
  const out: Finding[] = [];

  // 1. Cash mismatch
  const absDiff = Math.abs(input.diff);
  if (absDiff > 0.01) {
    const sev: Severity = absDiff > 500 ? "critical" : absDiff > 50 ? "warning" : "info";
    out.push({
      id: "diff",
      severity: sev,
      title: input.diff > 0 ? "Extra cash detected" : "Cash shortage detected",
      detail: `Actual ${fmt(input.counted)} vs Expected ${fmt(input.expected)} — diff ${input.diff > 0 ? "+" : ""}${fmt(input.diff)}`,
      hint: input.diff < 0
        ? "Likely missing an expense or unrecorded withdrawal."
        : "Check for missed cash sale or duplicate expense entry.",
    });
  }

  // 2. Duplicate detection
  out.push(...detectDuplicates(input));

  // 3. Withdraw without tomorrow distribution
  if (input.withdraw > 0 && input.distributionTotal === 0) {
    out.push({
      id: "withdraw-no-dist",
      severity: "warning",
      title: "Withdraw not distributed",
      detail: `Withdrew ${fmt(input.withdraw)} but no tomorrow distribution recorded`,
      hint: "Assign cash to shops or confirm withdraw stays in drawer.",
    });
  }

  // 4. Tomorrow purchases without distribution
  if (input.tomorrowPurchases.length > 0 && input.distributionTotal === 0) {
    out.push({
      id: "purchase-no-dist",
      severity: "warning",
      title: "Tomorrow purchases pending distribution",
      detail: `${input.tomorrowPurchases.length} purchase entries on next day with no cash assigned`,
      hint: "Open distribution panel and split cash by shop.",
    });
  }

  // 5. Unusual expense — single line > 30% of total expenses & > 500
  for (const e of input.shopEntries) {
    if (e.entry_type !== "expense") continue;
    const amt = Number(e.expense_amount || 0);
    if (amt > 500 && input.expense > 0 && amt / input.expense > 0.3) {
      out.push({
        id: `big-exp-${e.id}`,
        severity: "info",
        title: "Large expense entry",
        detail: `${fmt(amt)} — ${Math.round((amt / input.expense) * 100)}% of today's expenses`,
        hint: e.notes ? undefined : "Add a note for audit trail.",
      });
    }
  }

  // 6. Withdraw with no cashier / notes
  for (const e of input.shopEntries) {
    if (e.entry_type !== "withdraw") continue;
    if (!e.cashier_id && !e.notes) {
      out.push({
        id: `unassigned-w-${e.id}`,
        severity: "warning",
        title: "Unassigned withdraw",
        detail: `Withdraw ${fmt(Number(e.withdraw_amount || 0))} has no cashier or notes`,
        hint: "Assign a cashier so the cash trail is clear.",
      });
    }
  }

  // 7. No entries at all
  if (
    input.shopEntries.length === 0 &&
    input.whEntries.length === 0 &&
    input.empEntries.length === 0
  ) {
    out.push({
      id: "no-activity",
      severity: "info",
      title: "No entries recorded today",
      detail: "If today was an active business day, entries may be missing.",
    });
  }

  // 8. Perfect match — celebratory info
  if (out.length === 0) {
    out.push({
      id: "ok",
      severity: "info",
      title: "Closing looks clean",
      detail: "No anomalies detected by the assistant.",
    });
  }

  return out;
}
