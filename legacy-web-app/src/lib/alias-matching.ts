// Alias normalization + fuzzy matching for Smart Purchase Scan.
// Handles Bangla, Arabic and Latin company names.

import { supabase } from "@/integrations/supabase/client";

export type Alias = {
  id: string;
  alias: string;
  alias_normalized: string;
  canonical: string;
  usage_count: number;
  source: string;
};

const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

// Rough phonetic transliteration so brands written in Bangla / Arabic script
// can fuzzy-match their Latin canonical form ("আলমেরাই" ↔ "almarai").
// Not linguistically perfect — just enough Latin "sound" for Levenshtein/Jaccard.
const BN_MAP: Record<string, string> = {
  "অ":"a","আ":"a","ই":"i","ঈ":"i","উ":"u","ঊ":"u","ঋ":"ri","এ":"e","ঐ":"oi","ও":"o","ঔ":"ou",
  "ক":"k","খ":"kh","গ":"g","ঘ":"gh","ঙ":"ng","চ":"ch","ছ":"ch","জ":"j","ঝ":"jh","ঞ":"n",
  "ট":"t","ঠ":"th","ড":"d","ঢ":"dh","ণ":"n","ত":"t","থ":"th","দ":"d","ধ":"dh","ন":"n",
  "প":"p","ফ":"ph","ব":"b","ভ":"bh","ম":"m","য":"y","র":"r","ল":"l","শ":"sh","ষ":"sh",
  "স":"s","হ":"h","ড়":"r","ঢ়":"rh","য়":"y","ৎ":"t","ং":"ng","ঃ":"h","ঁ":"",
  "া":"a","ি":"i","ী":"i","ু":"u","ূ":"u","ৃ":"ri","ে":"e","ৈ":"oi","ো":"o","ৌ":"ou","্":"",
};
const AR_MAP: Record<string, string> = {
  "ا":"a","أ":"a","إ":"i","آ":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh",
  "د":"d","ذ":"dh","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"d","ط":"t","ظ":"z",
  "ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w",
  "ي":"y","ى":"a","ئ":"y","ؤ":"w","ة":"a","ء":"","ـ":"",
  "َ":"","ُ":"","ِ":"","ْ":"","ّ":"","ً":"","ٌ":"","ٍ":"",
};

/** Phonetic Latin form for cross-script matching. Returns "" for pure-Latin input. */
export function phoneticize(input: string): string {
  if (!input) return "";
  let out = ""; let hadNonLatin = false;
  for (const ch of input) {
    if (BN_MAP[ch] !== undefined) { out += BN_MAP[ch]; hadNonLatin = true; }
    else if (AR_MAP[ch] !== undefined) { out += AR_MAP[ch]; hadNonLatin = true; }
    else out += ch;
  }
  if (!hadNonLatin) return "";
  return out.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Normalise a brand string for matching: lowercase, strip diacritics, fold digits, collapse spaces. */
export function normalize(input: string): string {
  if (!input) return "";
  let s = input.toString();
  // Fold Bengali / Arabic-Indic digits to ASCII
  s = s.replace(/./g, (ch) => {
    const b = BENGALI_DIGITS.indexOf(ch);
    if (b >= 0) return String(b);
    const a = ARABIC_DIGITS.indexOf(ch);
    if (a >= 0) return String(a);
    return ch;
  });
  // Strip Latin diacritics
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remove common punctuation + repeated whitespace
  s = s.toLowerCase().replace(/[.,;:!?'"()\[\]{}\-_/\\]+/g, " ").replace(/\s+/g, " ").trim();
  return s;
}

/** Levenshtein distance (small strings). */
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

/** Token-set Jaccard similarity on normalized words. Robust to word order/extras. */
function tokenSim(a: string, b: string): number {
  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  ta.forEach((t) => { if (tb.has(t)) inter++; });
  return inter / (ta.size + tb.size - inter);
}

export function similarity(a: string, b: string): number {
  const na = normalize(a), nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const d = lev(na, nb);
  const m = Math.max(na.length, nb.length);
  const ed = 1 - d / m;
  const ts = tokenSim(na, nb);
  const sub = na.length >= 2 && (nb.includes(na) || na.includes(nb)) ? 0.85 : 0;
  // Cross-script: if either side has non-Latin glyphs, also compare phonetic Latin forms.
  const pa = phoneticize(a), pb = phoneticize(b);
  let phon = 0;
  if (pa || pb) {
    const xa = pa || na, xb = pb || nb;
    if (xa && xb) {
      const ld = lev(xa, xb);
      const lm = Math.max(xa.length, xb.length);
      phon = Math.max(1 - ld / lm, tokenSim(xa, xb));
      if (xa.length >= 2 && (xb.includes(xa) || xa.includes(xb))) phon = Math.max(phon, 0.82);
    }
  }
  return Math.max(ed, ts, sub, phon);
}

export type AliasMatch = {
  canonical: string;
  score: number;          // 0..1
  reason: "exact" | "fuzzy";
  alias?: Alias;
};

/** Find the best alias match for a raw OCR brand string. */
export function matchAlias(raw: string, aliases: Alias[]): AliasMatch | null {
  if (!raw || !aliases.length) return null;
  const n = normalize(raw);
  if (!n) return null;

  // 1. Exact match against alias_normalized OR canonical
  for (const a of aliases) {
    if (a.alias_normalized === n) {
      return { canonical: a.canonical, score: 1, reason: "exact", alias: a };
    }
  }
  for (const a of aliases) {
    if (normalize(a.canonical) === n) {
      return { canonical: a.canonical, score: 1, reason: "exact", alias: a };
    }
  }

  // 2. Fuzzy — pick best similarity over aliases + canonicals
  let best: AliasMatch | null = null;
  for (const a of aliases) {
    const s1 = similarity(n, a.alias_normalized);
    const s2 = similarity(n, a.canonical);
    const score = Math.max(s1, s2);
    if (score >= 0.7 && (!best || score > best.score)) {
      best = { canonical: a.canonical, score, reason: "fuzzy", alias: a };
    }
  }
  return best;
}

/** Top-N distinct canonical suggestions for low-confidence rows. */
export function topMatches(raw: string, aliases: Alias[], limit = 3): AliasMatch[] {
  if (!raw || !aliases.length) return [];
  const n = normalize(raw);
  if (!n) return [];
  const scored = new Map<string, AliasMatch>();
  for (const a of aliases) {
    const score = Math.max(
      similarity(n, a.alias_normalized),
      similarity(n, a.canonical),
    );
    if (score < 0.55) continue;
    const cur = scored.get(a.canonical);
    if (!cur || score > cur.score) {
      scored.set(a.canonical, {
        canonical: a.canonical,
        score,
        reason: score >= 0.999 ? "exact" : "fuzzy",
        alias: a,
      });
    }
  }
  return [...scored.values()]
    .sort((x, y) =>
      (y.score - x.score) +
      ((y.alias?.usage_count ?? 0) - (x.alias?.usage_count ?? 0)) * 0.001,
    )
    .slice(0, limit);
}

export async function fetchAliases(): Promise<Alias[]> {
  const { data, error } = await (supabase as any)
    .from("company_aliases")
    .select("id, alias, alias_normalized, canonical, usage_count, source")
    .order("usage_count", { ascending: false })
    .limit(1000);
  if (error) return [];
  return (data ?? []) as Alias[];
}

/** Upsert an alias mapping (called when user corrects a scanned row). */
export async function learnAlias(rawAlias: string, canonical: string, source: "manual" | "auto" = "auto") {
  const alias = rawAlias.trim();
  const canon = canonical.trim();
  if (!alias || !canon) return;
  const alias_normalized = normalize(alias);
  if (!alias_normalized || alias_normalized === normalize(canon)) return; // nothing to learn
  // Try to update existing first
  const existing = await (supabase as any)
    .from("company_aliases")
    .select("id, usage_count")
    .eq("alias_normalized", alias_normalized)
    .eq("canonical", canon)
    .maybeSingle();
  if (existing.data?.id) {
    await (supabase as any).from("company_aliases")
      .update({ usage_count: (existing.data.usage_count ?? 0) + 1 })
      .eq("id", existing.data.id);
    return;
  }
  await (supabase as any).from("company_aliases").insert({
    alias, alias_normalized, canonical: canon, source, usage_count: 1,
  });
}
