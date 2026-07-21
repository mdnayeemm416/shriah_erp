const TYPE_WORDS = {
  sale: "sale",
  sales: "sale",
  sold: "sale",
  purchase: "purchase",
  buy: "purchase",
  bought: "purchase",
  purchases: "purchase",
  withdraw: "withdraw",
  withdrawn: "withdraw",
  withdrawal: "withdraw",
  expense: "expense",
  expenses: "expense",
  cost: "expense",
  spent: "expense",
  employee: "employee",
  salary: "employee",
  payroll: "employee",
  staff: "employee",
  worker: "employee",
  warehouse: "warehouse",
  supplier: "warehouse",
  ledger: "warehouse",
  closing: "closing",
  close: "closing",
  ocr: "ocr",
  scan: "ocr"
};
const PAYMENT_WORDS = {
  cash: "cash",
  bank: "bank",
  pos: "pos",
  card: "pos",
  credit: "credit",
  due: "due",
  pending: "due"
};
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
const MONTHS = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11
};
const MONTH_RE = Object.keys(MONTHS).join("|");
function resolveRange(q) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const matched = [];
  let range = null;
  const lower = " " + q.toLowerCase() + " ";
  const has = (re) => {
    const m = lower.match(re);
    if (m) matched.push(m[0].trim());
    return !!m;
  };
  if (has(/\btoday\b/)) range = "today";
  else if (has(/\byesterday\b/)) range = "yesterday";
  else if (has(/\blast\s*week\b/)) range = "last_week";
  else if (has(/\bthis\s*week\b/)) range = "this_week";
  else if (has(/\blast\s*month\b/)) range = "last_month";
  else if (has(/\bthis\s*month\b/)) range = "this_month";
  let from = null, to = null;
  switch (range) {
    case "today":
      from = new Date(today);
      to = new Date(today);
      break;
    case "yesterday":
      from = new Date(today);
      from.setDate(from.getDate() - 1);
      to = new Date(from);
      break;
    case "this_week": {
      from = new Date(today);
      from.setDate(from.getDate() - from.getDay());
      to = new Date(today);
      break;
    }
    case "last_week": {
      from = new Date(today);
      from.setDate(from.getDate() - from.getDay() - 7);
      to = new Date(from);
      to.setDate(to.getDate() + 6);
      break;
    }
    case "this_month": {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today);
      break;
    }
    case "last_month": {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    }
  }
  if (!range) {
    const yr2 = (s) => s.length === 2 ? 2e3 + +s : +s;
    let m;
    if (m = lower.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/)) {
      from = to = new Date(+m[1], +m[2] - 1, +m[3]);
      matched.push(m[0]);
    } else if (m = lower.match(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_RE})(?:\\s+(\\d{2,4}))?\\b`))) {
      from = to = new Date(m[3] ? yr2(m[3]) : today.getFullYear(), MONTHS[m[2]], +m[1]);
      matched.push(m[0]);
    } else if (m = lower.match(new RegExp(`\\b(${MONTH_RE})\\s+(\\d{1,2})(?:[,\\s]+(\\d{2,4}))?\\b`))) {
      from = to = new Date(m[3] ? yr2(m[3]) : today.getFullYear(), MONTHS[m[1]], +m[2]);
      matched.push(m[0]);
    } else if (m = lower.match(new RegExp(`\\b(${MONTH_RE})(?:\\s+(\\d{2,4}))?\\b`))) {
      const mo = MONTHS[m[1]];
      const yr = m[2] ? yr2(m[2]) : today.getFullYear();
      from = new Date(yr, mo, 1);
      to = new Date(yr, mo + 1, 0);
      matched.push(m[0]);
    } else if (m = lower.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/)) {
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
    matched
  };
}
function parseSmartQuery(input) {
  const raw = (input || "").trim();
  if (!raw) {
    return { raw, text: "", amount: null, types: [], payments: [], range: null, dateFrom: null, dateTo: null };
  }
  const { range, from, to, matched: dateMatched } = resolveRange(raw);
  raw.split(/\s+/);
  const types = /* @__PURE__ */ new Set();
  const payments = /* @__PURE__ */ new Set();
  let amount = null;
  const remaining = [];
  let leftover = raw;
  for (const m of dateMatched) {
    const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    leftover = leftover.replace(new RegExp(escaped, "i"), " ");
  }
  for (const tok of leftover.split(/\s+/).filter(Boolean)) {
    const low = tok.toLowerCase().replace(/[.,;:!?]+$/g, "");
    if (!low) continue;
    if (TYPE_WORDS[low]) {
      types.add(TYPE_WORDS[low]);
      continue;
    }
    if (PAYMENT_WORDS[low]) {
      payments.add(PAYMENT_WORDS[low]);
      continue;
    }
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
    dateTo: to
  };
}
export {
  parseSmartQuery as p
};
