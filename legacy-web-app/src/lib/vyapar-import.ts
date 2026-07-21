// Vyapar / generic product spreadsheet import engine.
// Detects Vyapar item-list exports (xlsx / csv), maps known column aliases,
// cleans rows, normalizes numbers, dedupes, auto-detects category, and
// generates search keywords / aliases for each product.

import * as XLSX from "xlsx";

export type VyaparRow = {
  name: string;
  item_code: string | null;
  barcode: string | null;
  price: number;
  compare_price: number | null;
  purchase_price: number;
  tax_rate: number;
  stock: number;
  min_stock: number;
  location: string | null;
  description: string | null;
  category_hint: string | null;
  search_keywords: string[];
};

export type ParseResult = {
  rows: VyaparRow[];
  skipped: number;
  duplicates: number;
  missingPrice: number;
  missingStock: number;
  detectedFormat: "vyapar" | "generic";
  headerMap: Record<string, string>;
};

/* ───────────────── column alias map ─────────────────
   Order matters: more specific fields are checked first so
   "min stock" isn't gobbled by "stock". */

const FIELD_ORDER: (keyof VyaparRow)[] = [
  "min_stock", "purchase_price", "compare_price", "tax_rate", "stock",
  "barcode", "item_code", "price",
  "location", "category_hint", "description", "search_keywords", "name",
];

const FIELD_ALIASES: Record<keyof VyaparRow, string[]> = {
  name: [
    "item name", "product name", "name", "item", "product", "particulars", "title",
  ],
  // NOTE: "Current Stock Quantity" (Vyapar's canonical column) is matched
  // first inside the stock aliases below — we import the exact raw value.
  item_code: [
    "item code", "itemcode", "code", "sku", "hsn", "hsn code",
    "product code", "ref", "reference", "item id",
  ],
  barcode: [
    "barcode", "bar code", "ean", "upc", "qr code", "qrcode",
  ],
  price: [
    "sale price", "selling price", "mrp", "rate", "price",
    "sales price", "unit price", "retail price", "sale rate", "sales rate",
  ],
  purchase_price: [
    "purchase price", "buying price", "cost", "cost price", "buy price",
    "purchase rate", "buy rate", "purchase cost", "wholesale price",
  ],
  compare_price: [
    "other company price", "compare price", "compare at price", "compare-at price",
    "market price", "competitor price", "other price", "rrp", "list price",
    "original price", "old price", "was price",
  ],
  tax_rate: [
    "tax", "tax %", "tax%", "gst", "gst %", "vat", "vat %", "vat%", "tax rate",
  ],
  stock: [
    // "current stock quantity" is the canonical Vyapar header — keep it first.
    "current stock quantity", "current stock qty", "current stock",
    "stock quantity", "stock qty", "stock",
    "available qty", "available quantity", "qty", "quantity",
    "opening stock", "opening qty", "opening quantity",
    "closing stock", "closing qty", "closing quantity",
    "in stock", "balance", "stk", "qty in stock", "on hand", "in hand",
  ],
  min_stock: [
    "minimum stock", "min stock", "min stk", "reorder level", "reorder point",
    "low stock", "low stock alert", "min qty", "minimum quantity", "min quantity",
  ],
  location: [
    "item location", "location", "rack", "shelf", "warehouse location", "bin",
  ],
  description: [
    "details", "remarks", "notes", "long description", "description",
  ],
  category_hint: [
    "category", "group", "item category", "product category", "type", "item group",
  ],
  search_keywords: ["keywords", "aliases", "tags"],
};

const VYAPAR_HEADER_HINTS = [
  "item name", "sale price", "purchase price", "current stock", "item code",
  "stock quantity", "opening stock",
];

/* ───────────────── file readers ───────────────── */

export async function readSpreadsheet(file: File): Promise<unknown[][]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const first = wb.SheetNames[0];
  const sheet = wb.Sheets[first];
  return XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });
}

/* ───────────────── header detection ───────────────── */

function normHeader(s: unknown): string {
  return String(s ?? "")
    .replace(/[*:()\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function findHeaderRow(rows: unknown[][]): number {
  // Scan first 20 rows for the one with the most known aliases.
  const aliasSet = new Set(Object.values(FIELD_ALIASES).flat());
  let bestRow = 0;
  let bestScore = 0;
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const cells = rows[i].map(normHeader);
    const score = cells.filter((c) => aliasSet.has(c)).length;
    if (score > bestScore) { bestScore = score; bestRow = i; }
  }
  return bestScore >= 2 ? bestRow : 0;
}

function matchHeader(h: string): keyof VyaparRow | null {
  // Exact alias match first, then prefix/contains fallback — checked in FIELD_ORDER
  // so specific fields (min_stock, purchase_price) win over generic ones (stock, price).
  for (const field of FIELD_ORDER) {
    if (FIELD_ALIASES[field].includes(h)) return field;
  }
  for (const field of FIELD_ORDER) {
    for (const a of FIELD_ALIASES[field]) {
      if (h === a || h.startsWith(a + " ") || h.endsWith(" " + a) || h === a.replace(/\s+/g, "")) {
        return field;
      }
    }
  }
  return null;
}

function mapHeaders(headers: string[]): {
  map: Record<number, keyof VyaparRow>;
  human: Record<string, string>;
} {
  const map: Record<number, keyof VyaparRow> = {};
  const human: Record<string, string> = {};
  const claimed = new Set<keyof VyaparRow>();
  headers.forEach((raw, idx) => {
    const h = normHeader(raw);
    if (!h) return;
    const field = matchHeader(h);
    if (field && !claimed.has(field)) {
      map[idx] = field;
      human[raw] = field;
      claimed.add(field);
    }
  });
  return { map, human };
}

/* ───────────────── number / text cleaners ───────────────── */

function toNumber(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  // Strip currency symbols, commas, units like "pcs", "kg", "%".
  const s = String(v)
    .replace(/[,٬]/g, "")
    .replace(/[a-zA-Z%₹$€£﷼]/g, "")
    .replace(/[^\d.\-]/g, " ")
    .trim()
    .split(/\s+/)[0] ?? "";
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function toText(v: unknown): string {
  return String(v ?? "").replace(/\s+/g, " ").trim();
}

/* ───────────────── category auto-detect ───────────────── */

const CATEGORY_KEYWORDS: { name: string; words: string[] }[] = [
  { name: "Oil",     words: ["oil", "ghee", "sunflower", "olive", "vegetable oil"] },
  { name: "Drinks",  words: ["water", "juice", "cola", "pepsi", "soda", "drink", "beverage", "tea", "coffee", "milk"] },
  { name: "Snacks",  words: ["chips", "biscuit", "cookie", "snack", "wafer", "chocolate", "candy", "nuts"] },
  { name: "Frozen",  words: ["frozen", "ice cream", "icecream", "freeze"] },
  { name: "Dairy",   words: ["milk", "cheese", "yogurt", "yoghurt", "butter", "labneh", "cream", "dairy"] },
  { name: "Grains",  words: ["rice", "flour", "wheat", "sugar", "salt", "pasta", "noodle", "bread"] },
  { name: "Spices",  words: ["spice", "masala", "pepper", "cumin", "turmeric", "cinnamon", "cardamom"] },
  { name: "Canned",  words: ["tuna", "sardine", "can", "canned", "tomato paste", "beans"] },
  { name: "Cleaning",words: ["soap", "detergent", "cleaner", "bleach", "tissue", "shampoo"] },
];

export function detectCategory(name: string): string | null {
  const n = name.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.words.some((w) => n.includes(w))) return cat.name;
  }
  return null;
}

/* ───────────────── search keywords / aliases ───────────────── */

const STOP = new Set(["the", "a", "an", "of", "with", "and", "for", "in", "ml", "gm", "kg", "g", "l", "pcs", "pc", "x"]);

export function generateKeywords(name: string, code: string | null): string[] {
  const out = new Set<string>();
  const lower = name.toLowerCase();
  out.add(lower);

  const tokens = lower
    .replace(/[^a-z0-9\u0600-\u06FF\u0980-\u09FF\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t && t.length >= 2 && !STOP.has(t));
  tokens.forEach((t) => out.add(t));

  if (tokens.length >= 2) out.add(`${tokens[0]} ${tokens[1]}`);
  if (code) out.add(code.toLowerCase());

  return Array.from(out).slice(0, 20);
}

/* ───────────────── main parser ───────────────── */

export async function parseVyaparFile(file: File): Promise<ParseResult> {
  const rows = await readSpreadsheet(file);
  if (rows.length === 0) {
    return { rows: [], skipped: 0, duplicates: 0, missingPrice: 0, missingStock: 0, detectedFormat: "generic", headerMap: {} };
  }

  const headerRowIdx = findHeaderRow(rows);
  const headers = rows[headerRowIdx].map((c) => toText(c));
  const { map, human } = mapHeaders(headers);

  const headerStr = headers.map(normHeader).join(" ");
  const isVyapar = VYAPAR_HEADER_HINTS.filter((h) => headerStr.includes(h)).length >= 2;

  // Reverse index: field -> column index.
  const fieldIdx: Partial<Record<keyof VyaparRow, number>> = {};
  for (const [idx, field] of Object.entries(map)) {
    fieldIdx[field] = Number(idx);
  }

  const nameSet = new Set<string>();
  const codeSet = new Set<string>();
  const out: VyaparRow[] = [];
  let skipped = 0;
  let duplicates = 0;
  let missingPrice = 0;
  let missingStock = 0;

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const cells = rows[i] ?? [];

    const get = (field: keyof VyaparRow): unknown => {
      const idx = fieldIdx[field];
      return idx !== undefined ? cells[idx] : "";
    };

    const name = toText(get("name"));
    if (!name || name.length < 2) { skipped++; continue; }
    // Skip obvious totals / footer rows
    if (/^(total|grand total|subtotal)$/i.test(name)) { skipped++; continue; }

    const code = toText(get("item_code")) || null;
    if ((code && codeSet.has(code.toLowerCase())) || (!code && nameSet.has(name.toLowerCase()))) {
      duplicates++;
      continue;
    }
    if (code) codeSet.add(code.toLowerCase());
    nameSet.add(name.toLowerCase());

    const price = toNumber(get("price"));
    let stock = toNumber(get("stock"));
    // Negative stock is treated as 0 — we never corrupt totals with negatives.
    if (!Number.isFinite(stock) || stock < 0) stock = 0;
    if (price <= 0) missingPrice++;
    if (stock <= 0 && fieldIdx.stock === undefined) missingStock++;

    const row: VyaparRow = {
      name,
      item_code: code,
      barcode: toText(get("barcode")) || null,
      price,
      compare_price: fieldIdx.compare_price !== undefined ? (toNumber(get("compare_price")) || null) : null,
      purchase_price: toNumber(get("purchase_price")),
      tax_rate: fieldIdx.tax_rate !== undefined ? toNumber(get("tax_rate")) : 15,
      stock,
      min_stock: toNumber(get("min_stock")),
      location: toText(get("location")) || null,
      description: toText(get("description")) || null,
      category_hint: toText(get("category_hint")) || detectCategory(name),
      search_keywords: generateKeywords(name, code),
    };
    out.push(row);
  }

  return {
    rows: out,
    skipped,
    duplicates,
    missingPrice,
    missingStock,
    detectedFormat: isVyapar ? "vyapar" : "generic",
    headerMap: human,
  };
}

/* ───────────────── DB writer ───────────────── */

export type ImportMode = "merge" | "replace" | "skip" | "stock_only";

export type ImportSummary = {
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
  stockImported: number;
  errors: string[];
};

import { supabase } from "@/integrations/supabase/client";

export async function commitImport(
  rows: VyaparRow[],
  mode: ImportMode,
  options: {
    includeStock: boolean;
    categoryMap: Record<string, string | null>;
    onProgress?: (done: number, total: number) => void;
  },
): Promise<ImportSummary> {
  const summary: ImportSummary = { inserted: 0, updated: 0, skipped: 0, failed: 0, stockImported: 0, errors: [] };
  if (rows.length === 0) return summary;

  const { data: existing, error: exErr } = await supabase
    .from("shop_products")
    .select("id,name,item_code,barcode");
  if (exErr) { summary.errors.push(exErr.message); return summary; }

  // Match priority: barcode → item_code → exact normalized name.
  const byBarcode = new Map<string, { id: string }>();
  const byCode = new Map<string, { id: string }>();
  const byName = new Map<string, { id: string }>();
  (existing ?? []).forEach((p: any) => {
    if (p.barcode) byBarcode.set(String(p.barcode).trim().toLowerCase(), { id: p.id });
    if (p.item_code) byCode.set(String(p.item_code).trim().toLowerCase(), { id: p.id });
    byName.set(String(p.name).trim().toLowerCase(), { id: p.id });
  });

  const CHUNK = 50;
  let processed = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await Promise.all(chunk.map(async (r) => {
      try {
        const matchId =
          (r.barcode && byBarcode.get(r.barcode.trim().toLowerCase())?.id) ||
          (r.item_code && byCode.get(r.item_code.trim().toLowerCase())?.id) ||
          byName.get(r.name.trim().toLowerCase())?.id ||
          null;

        if (matchId && mode === "skip") { summary.skipped++; return; }

        // Sanitize stock once more right before writing.
        const safeStock = Number.isFinite(r.stock) && r.stock >= 0 ? r.stock : 0;

        const base: Record<string, unknown> = {
          name: r.name,
          item_code: r.item_code,
          barcode: r.barcode,
          price: r.price,
          compare_price: r.compare_price,
          purchase_price: r.purchase_price,
          tax_rate: r.tax_rate ?? 15,
          tax_inclusive: true,
          min_stock: r.min_stock,
          location: r.location,
          description: r.description,
          search_keywords: r.search_keywords,
          category_id: r.category_hint ? options.categoryMap[r.category_hint] ?? null : null,
        };
        if (options.includeStock || mode === "stock_only") base.stock = safeStock;

        if (mode === "stock_only") {
          if (!matchId) { summary.skipped++; return; }
          // Pure inventory sync: REPLACE stock with imported value, nothing else.
          const { error } = await supabase
            .from("shop_products")
            .update({ stock: safeStock })
            .eq("id", matchId);
          if (error) throw error;
          summary.updated++;
          summary.stockImported += safeStock;
          return;
        }

        if (matchId && (mode === "merge" || mode === "replace")) {
          // Merge: skip empty/null fields so we don't blank existing data,
          // BUT always overwrite stock with the imported value (raw replace, no addition).
          const patch: any = mode === "replace"
            ? { ...base, is_visible: true }
            : Object.fromEntries(Object.entries(base).filter(([, v]) => v !== null && v !== "" && v !== undefined));
          if (options.includeStock) patch.stock = safeStock;
          const { error } = await supabase.from("shop_products").update(patch).eq("id", matchId);
          if (error) throw error;
          summary.updated++;
          if (options.includeStock) summary.stockImported += safeStock;
          return;
        }

        const insertPayload: any = { ...base, is_visible: true, stock: options.includeStock ? safeStock : 0 };
        const { error } = await supabase.from("shop_products").insert(insertPayload);
        if (error) throw error;
        summary.inserted++;
        if (options.includeStock) summary.stockImported += safeStock;

      } catch (e: any) {
        summary.failed++;
        if (summary.errors.length < 10) summary.errors.push(`${r.name}: ${e?.message ?? e}`);
      } finally {
        processed++;
        options.onProgress?.(processed, rows.length);
      }
    }));
  }

  return summary;
}

/* ───────────────── stock preview (Vyapar → ERP after import) ───────────────── */

export type StockPreviewRow = {
  name: string;
  match: "barcode" | "item_code" | "name" | "new";
  currentStock: number | null;
  importedStock: number;
};

export async function buildStockPreview(rows: VyaparRow[]): Promise<StockPreviewRow[]> {
  const { data: existing } = await supabase
    .from("shop_products")
    .select("id,name,item_code,barcode,stock");
  const byBarcode = new Map<string, any>();
  const byCode = new Map<string, any>();
  const byName = new Map<string, any>();
  (existing ?? []).forEach((p: any) => {
    if (p.barcode) byBarcode.set(String(p.barcode).trim().toLowerCase(), p);
    if (p.item_code) byCode.set(String(p.item_code).trim().toLowerCase(), p);
    byName.set(String(p.name).trim().toLowerCase(), p);
  });
  return rows.map<StockPreviewRow>((r) => {
    const bc = r.barcode && byBarcode.get(r.barcode.trim().toLowerCase());
    if (bc) return { name: r.name, match: "barcode", currentStock: Number(bc.stock ?? 0), importedStock: r.stock };
    const ic = r.item_code && byCode.get(r.item_code.trim().toLowerCase());
    if (ic) return { name: r.name, match: "item_code", currentStock: Number(ic.stock ?? 0), importedStock: r.stock };
    const nm = byName.get(r.name.trim().toLowerCase());
    if (nm) return { name: r.name, match: "name", currentStock: Number(nm.stock ?? 0), importedStock: r.stock };
    return { name: r.name, match: "new", currentStock: null, importedStock: r.stock };
  });
}

/* ───────────────── category resolution helper ───────────────── */

export async function resolveCategories(hints: string[]): Promise<Record<string, string | null>> {
  const uniq = Array.from(new Set(hints.filter(Boolean)));
  if (uniq.length === 0) return {};

  const { data: existing } = await supabase.from("shop_categories").select("id,name");
  const map: Record<string, string | null> = {};
  const byName = new Map<string, string>();
  (existing ?? []).forEach((c: any) => byName.set(String(c.name).toLowerCase(), c.id));

  const toCreate: string[] = [];
  for (const h of uniq) {
    const found = byName.get(h.toLowerCase());
    if (found) map[h] = found;
    else toCreate.push(h);
  }

  if (toCreate.length) {
    const { data: created } = await supabase
      .from("shop_categories")
      .insert(toCreate.map((name, i) => ({ name, sort_order: i, is_active: true })))
      .select("id,name");
    (created ?? []).forEach((c: any) => { map[c.name] = c.id; });
  }

  return map;
}
