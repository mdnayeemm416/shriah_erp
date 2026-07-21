// Custom global ordering for shops. Most-used shops appear first.
// Any shop not in this list is appended afterwards, alphabetically.
export const SHOP_ORDER = ["Azzouz", "Nujum", "Aklas", "Khaled"];

const normalize = (s: string) => (s ?? "").trim().toLowerCase();

const ORDER_INDEX = new Map(SHOP_ORDER.map((n, i) => [normalize(n), i]));

export function shopRank(name?: string | null): number {
  const idx = ORDER_INDEX.get(normalize(name ?? ""));
  return idx === undefined ? Number.MAX_SAFE_INTEGER : idx;
}

export function sortShops<T extends { name?: string | null }>(shops: T[]): T[] {
  return [...shops].sort((a, b) => {
    const ra = shopRank(a.name);
    const rb = shopRank(b.name);
    if (ra !== rb) return ra - rb;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}

/** Shop workflow type. */
export type ShopType = "full_erp" | "simple_cash";

export function isSimpleShop(shop?: { shop_type?: string | null } | null): boolean {
  return shop?.shop_type === "simple_cash";
}

export const SHOP_TYPE_LABEL: Record<ShopType, string> = {
  full_erp: "Full ERP",
  simple_cash: "Simple Cash",
};
