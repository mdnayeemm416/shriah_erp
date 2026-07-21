import { r as reactExports } from "../_libs/react.mjs";
const PROFILE_KEY = "store_profile_v1";
const HISTORY_KEY = "store_order_history_v1";
const MAX_HISTORY = 20;
function readProfile() {
  if (typeof window === "undefined") return { name: "", mobile: "", address: "" };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: "", mobile: "", address: "" };
    const p = JSON.parse(raw);
    return {
      name: typeof p?.name === "string" ? p.name : "",
      mobile: typeof p?.mobile === "string" ? p.mobile : "",
      address: typeof p?.address === "string" ? p.address : ""
    };
  } catch {
    return { name: "", mobile: "", address: "" };
  }
}
function readHistory() {
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
function writeProfile(p) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("store-profile-changed"));
}
function writeHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("store-history-changed"));
}
function useStoreProfile() {
  const [profile, setProfile] = reactExports.useState({ name: "", mobile: "", address: "" });
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
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
  const saveProfile = reactExports.useCallback((p) => writeProfile(p), []);
  const clearProfile = reactExports.useCallback(() => writeProfile({ name: "", mobile: "", address: "" }), []);
  const addOrder = reactExports.useCallback((o) => {
    const cur = readHistory();
    writeHistory([o, ...cur.filter((x) => x.order_number !== o.order_number)]);
  }, []);
  const updateOrder = reactExports.useCallback((order_number, patch) => {
    const cur = readHistory();
    writeHistory(cur.map((x) => x.order_number === order_number ? { ...x, ...patch } : x));
  }, []);
  return { profile, saveProfile, clearProfile, history, addOrder, updateOrder };
}
export {
  useStoreProfile as u
};
