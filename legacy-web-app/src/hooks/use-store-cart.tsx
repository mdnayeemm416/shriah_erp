import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  /** Optional "Other Company Price" used for savings UI. */
  compare_price?: number | null;
  image_url?: string | null;
  qty: number;
};

const KEY = "store_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  // notify other hook instances in same tab
  window.dispatchEvent(new CustomEvent("store-cart-changed"));
}

export function useStoreCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("store-cart-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("store-cart-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const setQty = useCallback((p: Omit<CartItem, "qty">, qty: number) => {
    const cur = read();
    const idx = cur.findIndex(i => i.id === p.id);
    let next = cur;
    if (qty <= 0) {
      next = cur.filter(i => i.id !== p.id);
    } else if (idx >= 0) {
      next = cur.map(i => i.id === p.id ? { ...i, qty } : i);
    } else {
      next = [...cur, { ...p, qty }];
    }
    write(next);
  }, []);

  const add = useCallback((p: Omit<CartItem, "qty">, delta: number = 1) => {
    const cur = read();
    const existing = cur.find(i => i.id === p.id);
    setQty(p, Math.max(0, (existing?.qty ?? 0) + delta));
  }, [setQty]);

  const remove = useCallback((id: string) => {
    write(read().filter(i => i.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return { items, count, total, add, setQty, remove, clear };
}
