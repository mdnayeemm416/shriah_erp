// Lightweight natural-language query parser for Smart Global Search.
// Pure functions — zero deps, runs on every keystroke without lag.

export type EntryType =
  | "sale" | "purchase" | "withdraw" | "expense"
  | "employee" | "warehouse" | "closing" | "ocr";

export type PaymentMethod = "cash" | "bank" | "pos" | "credit" | "due";

export type DateRange = "today" | "yesterday" | "this_week" | "last_week"
  | "this_month" | "last_month" | null;

export type SmartQuery = {
  raw: string;
  text: string;                 // remaining free-text (company / notes)
  amount: number | null;        // exact amount if found
  types: EntryType[];           // detected entry types
  payments: PaymentMethod[];    // detected payment methods
  range: DateRange;
  dateFrom: string | null;      // YYYY-MM-DD
  dateTo: string | null;
};

const TYPE_WORDS: Record<string, EntryType> = {
  sale: "sale", sales: "sale", sold: "sale",
  purchase: "purchase", buy: "purchase", bought: "purchase", purchases: "purchase",
  withdraw: "withdraw", withdrawn: "withdraw", withdrawal: "withdraw",
  expense: "expense", expenses: "expense", cost: "expense", spent: "expense",
  employee: "employee", salary: "employee", payroll: "employee", staff: "employee", worker: "employee",
  warehouse: "warehouse", supplier: "warehouse", ledger: "warehouse",
  closing: "closing", close: "closing",
  ocr: "ocr", scan: "ocr",
};

const PAYMENT_WORDS: Record<string, PaymentMethod> = {
  cash: "cash",
  bank: "bank",
  pos: "pos", card: "pos",
  credit: "credit",
  due: "due", pending: "due",
};

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3,
  may: 4, jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7,
  sep: 8, sept: 8, september: 8, oct: 9, october: 9, nov: 10, november: 10,
  dec: 11, december: 11,
};
const MONTH_RE = Object.keys(MONTHS).join("|");

function resolveRange(q: string): { range: DateRange; from: string | null; to: string | null; matched: string[] } {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const matched: string[] = [];
  let range: DateRange = null;

  const lower = " " + q.toLowerCase() + " ";
  const has = (re: RegExp) => { const m = lower.match(re); if (m) matched.push(m[0].trim()); return !!m; };

  if (has(/\btoday\b/)) range = "today";
  else if (has(/\byesterday\b/)) range = "yesterday";
  else if (has(/\blast\s*week\b/)) range = "last_week";
  else if (has(/\bthis\s*week\b/)) range = "this_week";
  else if (has(/\blast\s*month\b/)) range = "last_month";
  else if (has(/\bthis\s*month\b/)) range = "this_month";

  let from: Date | null = null, to: Date | null = null;
  switch (range) {
    case "today":      from = new Date(today); to = new Date(today); break;
    case "yesterday":  from = new Date(today); from.setDate(from.getDate() - 1); to = new Date(from); break;
    case "this_week": {
      from = new Date(today); from.setDate(from.getDate() - from.getDay());
      to = new Date(today); break;
    }
    case "last_week": {
      from = new Date(today); from.setDate(from.getDate() - from.getDay() - 7);
      to = new Date(from); to.setDate(to.getDate() + 6); break;
    }
    case "this_month": {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today); break;
    }
    case "last_month": {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0); break;
    }
  }

  // Natural date phrases — only when no keyword range was matched.
  if (!range) {
    const yr2 = (s: string) => (s.length === 2 ? 2000 + +s : +s);
    let m: RegExpMatchArray | null;
    // ISO yyyy-mm-dd
    if ((m = lower.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/))) {
      from = to = new Date(+m[1], +m[2] - 1, +m[3]); matched.push(m[0]);
    }
    // "19 may [2026|26]"
    else if ((m = lower.match(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_RE})(?:\\s+(\\d{2,4}))?\\b`)))) {
      from = to = new Date(m[3] ? yr2(m[3]) : today.getFullYear(), MONTHS[m[2]], +m[1]);
      matched.push(m[0]);
    }
    // "may 19 [2026]"
    else if ((m = lower.match(new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})(?:[,\\s]+(\\d{2,4}))?\\b`)))) {
      from = to = new Date(m[3] ? yr2(m[3]) : today.getFullYear(), MONTHS[m[1]], +m[2]);
      matched.push(m[0]);
    }
    // "may 2026" or "may" — whole month
    else if ((m = lower.match(new RegExp(`\\b(${MONTH_RE})(?:\\s+(\\d{2,4}))?\\b`)))) {
      const mo = MONTHS[m[1]];
      const yr = m[2] ? yr2(m[2]) : today.getFullYear();
      from = new Date(yr, mo, 1);
      to = new Date(yr, mo + 1, 0);
      matched.push(m[0]);
    }
    // "19/5" or "19/5/2026" or "19-5-2026"
    else if ((m = lower.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/))) {
      const day = +m[1], mo = +m[2] - 1;
      if (mo >= 0 && mo < 12 && day >= 1 && day <= 31) {
        from = to = new Date(m[3] ? yr2(m[3]) : today.getFullYear(), mo, day);
        matched.push(m[0]);
      }
    }
  }

  return {
    range,
    from: from ? ymd(from) : null,
    to: to ? ymd(to) : null,
    matched,
  };
}

export function parseSmartQuery(input: string): SmartQuery {
  const raw = (input || "").trim();
  if (!raw) {
    return { raw, text: "", amount: null, types: [], payments: [], range: null, dateFrom: null, dateTo: null };
  }

  const { range, from, to, matched: dateMatched } = resolveRange(raw);

  const tokens = raw.split(/\s+/);
  const types = new Set<EntryType>();
  const payments = new Set<PaymentMethod>();
  let amount: number | null = null;
  const remaining: string[] = [];
  // Remove the date phrase as a single block (case-insensitive)
  let leftover = raw;
  for (const m of dateMatched) {
    const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    leftover = leftover.replace(new RegExp(escaped, "i"), " ");
  }

  for (const tok of leftover.split(/\s+/).filter(Boolean)) {
    const low = tok.toLowerCase().replace(/[.,;:!?]+$/g, "");
    if (!low) continue;
    if (TYPE_WORDS[low])    { types.add(TYPE_WORDS[low]); continue; }
    if (PAYMENT_WORDS[low]) { payments.add(PAYMENT_WORDS[low]); continue; }
    if (amount == null && /^[0-9]+(\.[0-9]+)?$/.test(low)) {
      amount = Number(low);
      continue;
    }
    remaining.push(tok);
  }

  return {
    raw,
    text: remaining.join(" ").trim(),
    amount,
    types: Array.from(types),
    payments: Array.from(payments),
    range,
    dateFrom: from,
    dateTo: to,
  };
}

export function describeSmartQuery(q: SmartQuery): string[] {
  const chips: string[] = [];
  if (q.range) chips.push(q.range.replace("_", " "));
  else if (q.dateFrom && q.dateTo) {
    chips.push(q.dateFrom === q.dateTo ? q.dateFrom : `${q.dateFrom} → ${q.dateTo}`);
  }
  if (q.types.length) chips.push(q.types.join(" / "));
  if (q.payments.length) chips.push(q.payments.join(" / "));
  if (q.amount != null) chips.push(`= ${q.amount}`);
  return chips;
}
