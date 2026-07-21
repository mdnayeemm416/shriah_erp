// Lightweight predictive suggestions for the global search box.
// Pure functions — no network, runs on every keystroke.

const TIME_PHRASES = [
  "today", "yesterday", "this week", "last week", "this month", "last month",
];

const TYPE_PHRASES = [
  "purchase", "sale", "expense", "withdraw", "due",
  "cash sale", "credit sale", "bank sale", "pos sale", "total sale",
  "cash buy", "credit buy", "due payment", "total purchase",
  "employee given", "employee received", "salary", "other income",
  "cash position", "plus minus", "daily closing", "expected cash", "actual cash",
  "all shop report", "full report", "company summary",
  "cash position", "cash health", "business stability score",
];

const WHY_PHRASES = [
  "Why was cash short yesterday?",
  "Why did expense increase this week?",
  "Why is warehouse cost high?",
  "Why was sale low yesterday?",
  "Why did purchase spike this month?",
  "Compare this month vs last month",
  "Top suppliers this month",
  "Highest due supplier",
  "Which employee received most money?",
  "Employee payout summary",
  "How healthy is cash flow this month?",
  "Business stability score",
  "Daily summary",
  "Weekly summary",
];

const SHOP_PHRASES = ["azzouz", "nujum", "aklas", "khaled", "warehouse"];
const CASHIER_PHRASES = ["anwer", "imran", "sajib", "saiful"];

// Cartesian templates used as the static suggestion bank.
const BASE_TEMPLATES: string[] = (() => {
  const out: string[] = [];
  for (const t of TIME_PHRASES) {
    for (const ty of TYPE_PHRASES) {
      out.push(`${t} ${ty}`);
      out.push(`${ty} ${t}`);
    }
  }
  for (const sh of SHOP_PHRASES) {
    for (const ty of TYPE_PHRASES) out.push(`${sh} ${ty}`);
    for (const t of TIME_PHRASES) {
      out.push(`${t} ${sh} cash sale`);
      out.push(`${t} ${sh} purchase`);
      out.push(`${t} ${sh} expense`);
    }
  }
  for (const c of CASHIER_PHRASES) {
    out.push(`${c} cash sale today`);
    out.push(`${c} pos sale`);
    out.push(`${c} total sale`);
    out.push(`today ${c} cash sale`);
    out.push(`this month ${c} total sale`);
  }
  for (const t of TIME_PHRASES) {
    out.push(`${t} all shop report`);
    out.push(`${t} full report`);
    out.push(`${t} employee given`);
    out.push(`${t} employee received`);
  }
  for (const t of TIME_PHRASES) out.push(t);
  for (const ty of TYPE_PHRASES) out.push(ty);
  return Array.from(new Set(out));
})();

const PARTY_SUFFIXES = [
  "due", "purchase", "cash buy", "credit buy", "monthly purchase", "payment", "this month",
];

export function buildSuggestionPool(parties: string[], cashiers: string[] = [], employees: string[] = []): string[] {
  const pool: string[] = [...BASE_TEMPLATES];
  for (const p of parties) {
    const name = p.trim();
    if (!name) continue;
    pool.push(name);
    for (const s of PARTY_SUFFIXES) pool.push(`${name} ${s}`);
  }
  for (const c of cashiers) {
    const n = c.trim();
    if (!n) continue;
    pool.push(`${n} cash sale today`);
    pool.push(`${n} pos sale`);
    pool.push(`${n} total sale`);
    pool.push(`this month ${n} total sale`);
  }
  for (const e of employees) {
    const n = e.trim();
    if (!n) continue;
    pool.push(`${n} employee given`);
    pool.push(`${n} employee payment`);
    pool.push(`this month ${n} salary`);
  }
  for (const w of WHY_PHRASES) pool.push(w);
  return pool;
}


/**
 * Rank suggestions for a given input prefix.
 * - startsWith match scores highest
 * - word-boundary match second
 * - substring match last
 */
export function rankSuggestions(input: string, pool: string[], limit = 6): string[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  const scored: Array<{ s: string; score: number }> = [];
  for (const s of pool) {
    const low = s.toLowerCase();
    if (low === q) continue;
    let score = -1;
    if (low.startsWith(q)) score = 3;
    else if (low.includes(" " + q)) score = 2;
    else if (low.includes(q)) score = 1;
    if (score > 0) scored.push({ s, score: score * 100 - s.length });
  }
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const { s } of scored) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}
