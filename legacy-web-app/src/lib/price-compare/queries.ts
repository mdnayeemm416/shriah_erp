// Price Compare — INDEPENDENT module.
// Uses its own tables: price_compare_products + price_compare_records.
// No dependency on shop_products, shop_purchases, warehouse, or any existing module.

import { supabase } from "@/integrations/supabase/client";

export type PCProduct = {
  id: string;
  name: string;
  barcode: string | null;
  category: string | null;
  brand: string | null;
  unit: string | null;
  notes: string | null;
  image_url: string | null;
  sale_price: number | null;
  user_id: string;
};

export type PCProductInput = Omit<PCProduct, "id" | "user_id">;


export type PCRecord = {
  id: string;
  product_id: string;
  record_date: string;      // yyyy-mm-dd
  market_name: string | null;
  supplier_name: string | null;
  purchase_price: number;
  selling_price: number | null;
  offer_price: number | null;
  notes: string | null;
  image_url: string | null;
  created_at: string;
};

export type PCRecordInput = Omit<PCRecord, "id" | "created_at">;

export type PCFilters = {
  from: string | null;
  to: string | null;
  supplier: string | null;
};

/* ---------- Products CRUD ---------- */

function mapProduct(r: any): PCProduct {
  return {
    id: r.id,
    name: r.name,
    barcode: r.barcode ?? null,
    category: r.category ?? null,
    brand: r.brand ?? null,
    unit: r.unit ?? null,
    notes: r.notes ?? null,
    image_url: r.image_url ?? null,
    sale_price: r.sale_price == null ? null : Number(r.sale_price),
    user_id: r.user_id,
  };
}

export async function searchProducts(opts: {
  q: string;
  category?: string | null;
  limit?: number;
  offset?: number;
}): Promise<PCProduct[]> {
  const limit = opts.limit ?? 40;
  const offset = opts.offset ?? 0;
  let qb: any = supabase
    .from("price_compare_products")
    .select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id")
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);
  const term = opts.q.trim();
  if (term) qb = qb.or(`name.ilike.%${term}%,barcode.ilike.%${term}%,brand.ilike.%${term}%`);
  if (opts.category) qb = qb.eq("category", opts.category);
  const { data, error } = await qb;
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function findProductByBarcode(code: string): Promise<PCProduct | null> {
  const { data } = await supabase
    .from("price_compare_products")
    .select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id")
    .eq("barcode", code)
    .limit(1)
    .maybeSingle();
  return data ? mapProduct(data) : null;
}

export async function getProductById(id: string): Promise<PCProduct | null> {
  const { data } = await supabase
    .from("price_compare_products")
    .select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id")
    .eq("id", id)
    .maybeSingle();
  return data ? mapProduct(data) : null;
}

export async function listCategories(): Promise<string[]> {
  const { data } = await supabase
    .from("price_compare_products")
    .select("category")
    .not("category", "is", null)
    .limit(2000);
  const set = new Set<string>();
  for (const r of (data ?? []) as any[]) if (r.category) set.add(r.category);
  return [...set].sort();
}

export async function createProduct(input: PCProductInput): Promise<PCProduct> {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  if (!user_id) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("price_compare_products")
    .insert({ ...input, user_id })
    .select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id")
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function updateProduct(id: string, input: Partial<PCProductInput>): Promise<PCProduct> {
  const { data, error } = await supabase
    .from("price_compare_products")
    .update(input)
    .eq("id", id)
    .select("id,name,barcode,category,brand,unit,notes,image_url,sale_price,user_id")
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("price_compare_products").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- Records CRUD ---------- */

function mapRecord(r: any): PCRecord {
  return {
    id: r.id,
    product_id: r.product_id,
    record_date: r.record_date,
    market_name: r.market_name ?? null,
    supplier_name: r.supplier_name ?? null,
    purchase_price: Number(r.purchase_price) || 0,
    selling_price: r.selling_price == null ? null : Number(r.selling_price),
    offer_price: r.offer_price == null ? null : Number(r.offer_price),
    notes: r.notes ?? null,
    image_url: r.image_url ?? null,
    created_at: r.created_at,
  };
}

export async function loadRecords(productId: string, f: PCFilters): Promise<PCRecord[]> {
  let qb: any = supabase
    .from("price_compare_records")
    .select("*")
    .eq("product_id", productId)
    .order("record_date", { ascending: false })
    .limit(2000);
  if (f.from) qb = qb.gte("record_date", f.from);
  if (f.to) qb = qb.lte("record_date", f.to);
  if (f.supplier) qb = qb.ilike("supplier_name", f.supplier);
  const { data, error } = await qb;
  if (error) throw error;
  return (data ?? []).map(mapRecord);
}

export async function listSuppliers(): Promise<string[]> {
  const { data } = await supabase
    .from("price_compare_records")
    .select("supplier_name")
    .not("supplier_name", "is", null)
    .limit(2000);
  const set = new Set<string>();
  for (const r of (data ?? []) as any[]) if (r.supplier_name) set.add(r.supplier_name);
  return [...set].sort();
}

export async function createRecord(input: PCRecordInput): Promise<PCRecord> {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  if (!user_id) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("price_compare_records")
    .insert({ ...input, user_id })
    .select("*")
    .single();
  if (error) throw error;
  return mapRecord(data);
}

export async function updateRecord(id: string, input: Partial<PCRecordInput>): Promise<PCRecord> {
  const { data, error } = await supabase
    .from("price_compare_records")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRecord(data);
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from("price_compare_records").delete().eq("id", id);
  if (error) throw error;
}

export type PCProductSummary = {
  lowest: number;
  companies: number;
  lastDate: string;
  records: number;
  lowestCompany: string | null;
  lowestMarket: string | null;
  lowestCompanyLastDate: string | null;
  latestUserId: string | null;
};

/** Aggregate records for many products in a single query (read-only helper). */
export async function loadProductSummaries(ids: string[]): Promise<Map<string, PCProductSummary>> {
  const out = new Map<string, PCProductSummary>();
  if (!ids.length) return out;
  const { data, error } = await supabase
    .from("price_compare_records")
    .select("product_id,purchase_price,supplier_name,market_name,record_date,user_id")
    .in("product_id", ids);
  if (error) throw error;
  const byProd = new Map<string, any[]>();
  for (const r of (data ?? []) as any[]) {
    if (!byProd.has(r.product_id)) byProd.set(r.product_id, []);
    byProd.get(r.product_id)!.push(r);
  }
  for (const [pid, rows] of byProd) {
    const prices = rows.map((r) => Number(r.purchase_price) || 0).filter((p) => p > 0);
    const suppliers = new Set<string>();
    let lastDate = "";
    let minPrice = Infinity;
    const lowestRows: any[] = [];
    let latestRow: any = null;
    for (const r of rows) {
      const key = r.supplier_name || r.market_name;
      if (key) suppliers.add(key);
      if (r.record_date && r.record_date > lastDate) {
        lastDate = r.record_date;
        latestRow = r;
      }
      const p = Number(r.purchase_price) || 0;
      if (p > 0 && p < minPrice) {
        minPrice = p;
        lowestRows.length = 0;
        lowestRows.push(r);
      } else if (p > 0 && p === minPrice) {
        lowestRows.push(r);
      }
    }
    let lowestCompanyLastDate = "";
    for (const r of lowestRows) {
      if (r.record_date && r.record_date > lowestCompanyLastDate) lowestCompanyLastDate = r.record_date;
    }
    const lowestRow = lowestRows[0] ?? null;
    out.set(pid, {
      lowest: prices.length ? Math.min(...prices) : 0,
      companies: suppliers.size,
      lastDate,
      records: rows.length,
      lowestCompany: lowestRow?.supplier_name ?? null,
      lowestMarket: lowestRow?.market_name ?? null,
      lowestCompanyLastDate: lowestCompanyLastDate || null,
      latestUserId: latestRow?.user_id ?? null,
    });
  }
  return out;
}


/* ---------- Derived aggregates ---------- */

export type PCSummary = {
  currentPurchase: number;
  lastPurchase: number;
  lowest: number;
  highest: number;
  average: number;
  totalRecords: number;
  currentSell: number;
  currentOffer: number;
};

export function computeSummary(rows: PCRecord[]): PCSummary {
  if (!rows.length) {
    return { currentPurchase: 0, lastPurchase: 0, lowest: 0, highest: 0, average: 0, totalRecords: 0, currentSell: 0, currentOffer: 0 };
  }
  const sorted = [...rows].sort((a, b) => (a.record_date < b.record_date ? 1 : -1));
  const prices = sorted.map((l) => l.purchase_price).filter((p) => p > 0);
  const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
  return {
    currentPurchase: sorted[0]?.purchase_price ?? 0,
    lastPurchase: sorted[1]?.purchase_price ?? sorted[0]?.purchase_price ?? 0,
    lowest: prices.length ? Math.min(...prices) : 0,
    highest: prices.length ? Math.max(...prices) : 0,
    average: avg,
    totalRecords: rows.length,
    currentSell: sorted[0]?.selling_price ?? 0,
    currentOffer: sorted[0]?.offer_price ?? 0,
  };
}

export type PCSupplierRow = {
  supplier: string;
  last: number;
  lowest: number;
  highest: number;
  average: number;
  count: number;
  lastDate: string;
};

export function bySupplier(rows: PCRecord[]): PCSupplierRow[] {
  const map = new Map<string, PCRecord[]>();
  for (const l of rows) {
    const key = l.supplier_name || l.market_name || "—";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  const out: PCSupplierRow[] = [];
  for (const [supplier, ls] of map) {
    const sorted = [...ls].sort((a, b) => (a.record_date < b.record_date ? 1 : -1));
    const prices = ls.map((l) => l.purchase_price).filter((p) => p > 0);
    const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
    out.push({
      supplier,
      last: sorted[0]?.purchase_price ?? 0,
      lowest: prices.length ? Math.min(...prices) : 0,
      highest: prices.length ? Math.max(...prices) : 0,
      average: avg,
      count: ls.length,
      lastDate: sorted[0]?.record_date ?? "",
    });
  }
  return out.sort((a, b) => (a.lowest || Infinity) - (b.lowest || Infinity));
}

export type PCHistoryRow = PCRecord & { prev: number; delta: number; deltaPct: number };
export function withDeltas(rows: PCRecord[]): PCHistoryRow[] {
  const chrono = [...rows].sort((a, b) => (a.record_date < b.record_date ? -1 : 1));
  let prev = 0;
  const out: PCHistoryRow[] = chrono.map((l) => {
    const p = prev;
    const delta = p ? l.purchase_price - p : 0;
    const deltaPct = p ? (delta / p) * 100 : 0;
    prev = l.purchase_price;
    return { ...l, prev: p, delta, deltaPct };
  });
  return out.reverse();
}
