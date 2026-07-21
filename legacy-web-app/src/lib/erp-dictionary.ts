// ERP Smart Dictionary + Query Normalizer.
// Pure functions. Local-first. Used by the AI Insights search box.
//
// Responsibilities:
//  1. Hold a curated dictionary of ERP terms (months, transaction types,
//     payment methods, shops, cashiers, employees, suppliers, commands).
//  2. Pre-normalize user input before it reaches parseSmartQuery / parseErpIntent:
//       - "20may" → "20 may"
//       - "azzouzsale" → "azzouz sale"
//       - "azzoz" → "azzouz", "wdraw" → "withdraw", "emplye" → "employee"
//  3. Provide typo-aware suggestions for unknown tokens.

const MONTHS = [
  "jan","feb","mar","apr","may","jun","jul","aug","sep","sept","oct","nov","dec",
  "january","february","march","april","june","july","august","september","october","november","december",
];

const TX_TYPES = [
  "sale","sales","purchase","purchases","buy","bought","expense","expenses",
  "withdraw","withdrawal","withdrawn","cost","spent",
  "salary","payroll","employee","staff","worker","supplier","ledger",
  "closing","close","ocr","scan",
];

const PAYMENTS = ["cash","bank","pos","card","credit","due","pending"];

const COMMANDS = [
  "open","go","show","view","report","reports","summary","compare","vs","versus",
  "top","highest","lowest","why","how","when","what","total","this","last","next",
  "today","yesterday","week","month","year","given","received","income","money",
  "position","difference","stability","health","score","payment","payments",
];

const TIME_GLUE = ["today","yesterday","week","month","year","weekend"];

// Frequent typo / shorthand → canonical.
const TYPO_FIX: Record<string, string> = {
  azzoz: "azzouz", azouz: "azzouz", azouze: "azzouz", azzou: "azzouz",
  nojom: "nujum", nujm: "nujum", nujom: "nujum",
  aklass: "aklas", aklaas: "aklas",
  khald: "khaled", khalid: "khaled",
  warehous: "warehouse", wherehouse: "warehouse",
  emplye: "employee", emploee: "employee", employe: "employee", emplyee: "employee",
  wdraw: "withdraw", withraw: "withdraw", withdr: "withdraw", withdrawl: "withdrawal",
  exprnse: "expense", expence: "expense", expenes: "expense",
  prchase: "purchase", purchse: "purchase", perchase: "purchase",
  recived: "received", recieved: "received", recive: "receive",
  empoyee: "employee", suplier: "supplier", suppler: "supplier",
  ystrday: "yesterday", yesturday: "yesterday", yestrday: "yesterday",
  todayy: "today", tody: "today",
  rport: "report", reort: "report", reprt: "report",
  setings: "settings", setting: "settings",
  comapre: "compare", comp: "compare",
  // Bengali / Arabic-ish phonetic short forms
  almeray: "almarai", almerai: "almarai", almeraie: "almarai",
};

let _dict: Set<string> | null = null;
let _dictArr: string[] = [];

export function buildDictionary(extra: { shops?: string[]; cashiers?: string[]; employees?: string[]; parties?: string[] } = {}) {
  const all = new Set<string>();
  const add = (w: string) => {
    const t = (w || "").trim().toLowerCase();
    if (t && /^[a-z][a-z0-9]*$/.test(t)) all.add(t);
    // also split multi-word names into single-word tokens
    if (t) for (const p of t.split(/\s+/)) if (/^[a-z][a-z0-9]*$/.test(p)) all.add(p);
  };
  [...MONTHS, ...TX_TYPES, ...PAYMENTS, ...COMMANDS, ...TIME_GLUE].forEach(add);
  // Default ERP entities used as fallbacks
  ["azzouz","nujum","aklas","khaled","warehouse","anwer","imran","sajib","saiful"].forEach(add);
  (extra.shops ?? []).forEach(add);
  (extra.cashiers ?? []).forEach(add);
  (extra.employees ?? []).forEach(add);
  (extra.parties ?? []).forEach(add);
  _dict = all;
  _dictArr = Array.from(all);
}

function ensureDict() {
  if (!_dict) buildDictionary();
  return _dict!;
}

function lev(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

/** Best dictionary correction for a single token. Returns original if no good match. */
export function correctToken(tok: string): string {
  const low = tok.toLowerCase();
  if (!low || low.length < 2) return tok;
  if (/^\d+(\.\d+)?$/.test(low)) return low;
  if (TYPO_FIX[low]) return TYPO_FIX[low];
  const dict = ensureDict();
  if (dict.has(low)) return low;
  // Only attempt fuzzy correction for 3+ char alphabetic tokens
  if (!/^[a-z]{3,}$/.test(low)) return tok;
  let best: { word: string; d: number } | null = null;
  for (const w of _dictArr) {
    if (Math.abs(w.length - low.length) > 2) continue;
    const d = lev(low, w);
    if (d <= 1 || (low.length >= 5 && d === 2)) {
      if (!best || d < best.d || (d === best.d && w.length > best.word.length)) {
        best = { word: w, d };
      }
    }
  }
  return best ? best.word : tok;
}

/** Split a glued token using longest-prefix matches against the dictionary. */
function splitGlued(tok: string): string[] {
  const low = tok.toLowerCase();
  if (!low || low.length < 4) return [tok];
  if (/^\d+$/.test(low)) return [low];
  if (low.includes(" ")) return [low];
  const dict = ensureDict();
  if (dict.has(low)) return [low]; // already a known word
  // Also handle leading-digit + word, e.g. "20may", "5jan"
  const m = low.match(/^(\d{1,2})([a-z]+)$/);
  if (m) {
    const rest = splitGlued(m[2]);
    return [m[1], ...rest];
  }
  // Greedy longest-prefix split
  const out: string[] = [];
  let i = 0;
  while (i < low.length) {
    let matched = "";
    for (let j = Math.min(low.length, i + 14); j > i + 1; j--) {
      const sub = low.slice(i, j);
      if (dict.has(sub) || TYPO_FIX[sub]) { matched = sub; break; }
    }
    if (!matched) {
      // attempt fuzzy on a 4-8 char chunk
      for (let j = Math.min(low.length, i + 8); j >= i + 4; j--) {
        const sub = low.slice(i, j);
        const fix = correctToken(sub);
        if (fix !== sub) { matched = fix; i = j; break; }
      }
      if (!matched) return [low]; // give up – keep original
    } else {
      i += matched.length;
    }
    out.push(TYPO_FIX[matched] ?? matched);
  }
  return out.length > 1 ? out : [low];
}

/**
 * Normalize a raw user query: insert missing spaces, fix typos, expand month
 * shorthand like "20may" → "20 may". Returns the cleaned query (lowercased
 * for parser stability; downstream parsers are already case-insensitive).
 */
export function normalizeQuery(raw: string): string {
  if (!raw) return "";
  let s = raw.toString();

  // 1. Insert spaces between digit↔letter boundaries: "20may" → "20 may"
  s = s.replace(/(\d)([a-zA-Z])/g, "$1 $2").replace(/([a-zA-Z])(\d)/g, "$1 $2");
  // 2. Collapse repeated whitespace
  s = s.replace(/\s+/g, " ").trim();

  const tokens = s.split(" ");
  const out: string[] = [];
  for (const tok of tokens) {
    if (!tok) continue;
    // If pure number, keep
    if (/^\d+(\.\d+)?$/.test(tok)) { out.push(tok); continue; }
    // Try dictionary split for glued words first
    const parts = splitGlued(tok);
    for (const p of parts) out.push(correctToken(p));
  }
  return out.join(" ");
}

/** Suggest a corrected version when something changed. Otherwise null. */
export function suggestCorrection(raw: string): string | null {
  const n = normalizeQuery(raw);
  if (!n || n.toLowerCase() === raw.toLowerCase().replace(/\s+/g, " ").trim()) return null;
  return n;
}
