import { useCallback, useEffect, useState } from "react";

export type StoreProfile = {
  name: string;
  mobile: string;
  address: string;
};

export type StoreOrderHistoryItem = {
  id?: string;
  order_number: number;
  created_at: string;
  total: number;
  status?: string;
  items: { id: string; name: string; qty: number; price: number; compare_price?: number | null; image_url?: string | null }[];
  notes?: string;
};

const PROFILE_KEY = "store_profile_v1";
const HISTORY_KEY = "store_order_history_v1";
const MAX_HISTORY = 20;

function readProfile(): StoreProfile {
  if (typeof window === "undefined") return { name: "", mobile: "", address: "" };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: "", mobile: "", address: "" };
    const p = JSON.parse(raw);
    return {
      name: typeof p?.name === "string" ? p.name : "",
      mobile: typeof p?.mobile === "string" ? p.mobile : "",
      address: typeof p?.address === "string" ? p.address : "",
    };
  } catch {
    return { name: "", mobile: "", address: "" };
  }
}

function readHistory(): StoreOrderHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function writeProfile(p: StoreProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
  window.dispatchEvent(new CustomEvent("store-profile-changed"));
}

function writeHistory(list: StoreOrderHistoryItem[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY))); } catch {}
  window.dispatchEvent(new CustomEvent("store-history-changed"));
}

export function useStoreProfile() {
  const [profile, setProfile] = useState<StoreProfile>({ name: "", mobile: "", address: "" });
  const [history, setHistory] = useState<StoreOrderHistoryItem[]>([]);

  useEffect(() => {
    setProfile(readProfile());
    setHistory(readHistory());
    const onP = () => setProfile(readProfile());
    const onH = () => setHistory(readHistory());
    window.addEventListener("store-profile-changed", onP);
    window.addEventListener("store-history-changed", onH);
    window.addEventListener("storage", onP);
    return () => {
      window.removeEventListener("store-profile-changed", onP);
      window.removeEventListener("store-history-changed", onH);
      window.removeEventListener("storage", onP);
    };
  }, []);

  const saveProfile = useCallback((p: StoreProfile) => writeProfile(p), []);
  const clearProfile = useCallback(() => writeProfile({ name: "", mobile: "", address: "" }), []);

  const addOrder = useCallback((o: StoreOrderHistoryItem) => {
    const cur = readHistory();
    writeHistory([o, ...cur.filter(x => x.order_number !== o.order_number)]);
  }, []);

  const updateOrder = useCallback((order_number: number, patch: Partial<StoreOrderHistoryItem>) => {
    const cur = readHistory();
    writeHistory(cur.map(x => x.order_number === order_number ? { ...x, ...patch } : x));
  }, []);

  return { profile, saveProfile, clearProfile, history, addOrder, updateOrder };
}
