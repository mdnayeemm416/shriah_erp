import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type OrderNotification = {
  id: string;
  orderId: string;
  orderNumber: number;
  customer: string;
  mobile: string;
  total: number;
  itemCount: number;
  status: string;
  createdAt: string;
  read: boolean;
};

type Ctx = {
  notifications: OrderNotification[];
  unread: number;
  muted: boolean;
  setMuted: (v: boolean) => void;
  permission: NotificationPermission | "unsupported";
  requestPermission: () => Promise<void>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clear: () => void;
  openWhatsApp: (n: OrderNotification) => void;
  whatsappNumber: string;
};

const OrderNotificationsContext = createContext<Ctx | null>(null);

const ADMIN_WA_FALLBACK = "0553687388";
const STORAGE_KEY = "erp_order_notifications_v1";
const MUTE_KEY = "erp_order_notifications_muted";
const MAX_KEEP = 50;

function normalizeWA(num: string): string {
  const digits = (num || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "966" + digits.slice(1);
  return digits;
}

function loadStored(): OrderNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_KEEP) : [];
  } catch {
    return [];
  }
}

// Lightweight beep via WebAudio — no asset download
function playBeep() {
  try {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.setValueAtTime(660, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start();
    o.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close(), 600);
  } catch { /* noop */ }
}

export function OrderNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<OrderNotification[]>(() => loadStored());
  const [muted, setMutedState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MUTE_KEY) === "1";
  });
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [whatsappNumber, setWhatsappNumber] = useState<string>(ADMIN_WA_FALLBACK);
  const seenIds = useRef<Set<string>>(new Set(notifications.map(n => n.orderId)));

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_KEEP))); } catch { /* noop */ }
  }, [notifications]);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    try { localStorage.setItem(MUTE_KEY, v ? "1" : "0"); } catch { /* noop */ }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
    } catch { /* noop */ }
  }, []);

  // Load admin WhatsApp number from settings
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await (supabase as any).from("app_settings").select("store_whatsapp").eq("id", 1).maybeSingle();
        if (alive && data?.store_whatsapp) setWhatsappNumber(data.store_whatsapp);
      } catch { /* noop */ }
    })();
    return () => { alive = false; };
  }, []);

  // Log admin notification token count once (for diagnostics)
  useEffect(() => {
    (async () => {
      try {
        const { count, error } = await (supabase as any)
          .from("notification_tokens")
          .select("id", { count: "exact", head: true })
          .in("role", ["admin", "super_admin"]);
        if (error) {
          console.warn("[OrderNotify] token count query failed:", error.message);
        } else {
          console.log("[OrderNotify] admin/super_admin notification tokens registered:", count ?? 0);
        }
      } catch (e) {
        console.warn("[OrderNotify] token count check failed:", e);
      }
    })();
  }, []);

  const pushNotification = useCallback((row: any) => {
    const orderId: string = row.id;
    if (seenIds.current.has(orderId)) return;
    seenIds.current.add(orderId);
    const items = Array.isArray(row.items) ? row.items : [];
    const itemCount = items.reduce((s: number, it: any) => s + (Number(it?.qty) || 1), 0) || items.length;
    const n: OrderNotification = {
      id: `${orderId}-${Date.now()}`,
      orderId,
      orderNumber: row.order_number ?? 0,
      customer: row.customer_name ?? "Customer",
      mobile: row.customer_mobile ?? "",
      total: Number(row.total ?? 0),
      itemCount,
      status: row.status ?? "pending",
      createdAt: row.created_at ?? new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [n, ...prev].slice(0, MAX_KEEP));

    // Sound
    if (!muted) playBeep();

    // Toast (foreground UI)
    toast.success(`🛒 New Wholesale Order #${n.orderNumber}`, {
      description: `${n.customer} — SAR ${n.total.toFixed(2)}`,
      duration: 6000,
    });

    // Browser / SW notification (works on Android Chrome PWA in background)
    const title = "New Wholesale Order";
    const body = `${n.customer} placed an order worth SAR ${n.total.toFixed(2)}`;
    const opts: NotificationOptions = {
      body,
      tag: `order-${orderId}`, // dedupe
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: "/store-admin", orderId },
    };

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      // Prefer SW registration (background-capable on Android)
      const showViaSw = async () => {
        try {
          if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) {
              await reg.showNotification(title, opts);
              console.log("[OrderNotify] sent via SW for order", orderId);
              return true;
            }
          }
        } catch (e) {
          console.warn("[OrderNotify] SW notification failed:", e);
        }
        return false;
      };
      showViaSw().then((ok) => {
        if (ok) return;
        try {
          const note = new Notification(title, opts);
          note.onclick = () => { try { window.focus(); } catch { /* noop */ } note.close(); };
          console.log("[OrderNotify] sent via Notification() for order", orderId);
        } catch (e) {
          console.warn("[OrderNotify] notification failed:", e);
        }
      });
    } else {
      console.log("[OrderNotify] skipped — permission:", typeof Notification !== "undefined" ? Notification.permission : "unsupported");
    }
  }, [muted]);

  // Realtime subscription — event-driven, no polling
  useEffect(() => {
    const channel = supabase
      .channel("shop_orders_alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shop_orders" },
        (payload) => {
          const row = payload.new as any;
          if (!row || row.is_deleted) return;
          console.log("[OrderNotify] new order received:", row.id, "customer:", row.customer_name, "total:", row.total);
          try {
            pushNotification(row);
          } catch (e) {
            // Never break the order flow on notification failure
            console.warn("[OrderNotify] push failed (non-fatal):", e);
          }
        }
      )
      .subscribe((status) => {
        console.log("[OrderNotify] realtime channel status:", status);
      });
    return () => { supabase.removeChannel(channel); };
  }, [pushNotification]);


  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const clear = useCallback(() => {
    setNotifications([]);
    seenIds.current.clear();
  }, []);

  const openWhatsApp = useCallback((n: OrderNotification) => {
    const wa = normalizeWA(whatsappNumber);
    const msg =
      `🛒 New Order Received%0A%0A` +
      `Customer: ${encodeURIComponent(n.customer)}%0A` +
      `Order ID: #${n.orderNumber}%0A` +
      `Items: ${n.itemCount}%0A` +
      `Total: SAR ${n.total.toFixed(2)}%0A%0A` +
      `Open ERP to review order.`;
    const url = `https://wa.me/${wa}?text=${msg}`;
    try { window.open(url, "_blank", "noopener,noreferrer"); } catch { /* noop */ }
  }, [whatsappNumber]);

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value: Ctx = {
    notifications, unread, muted, setMuted,
    permission, requestPermission,
    markAllRead, markRead, clear, openWhatsApp, whatsappNumber,
  };

  return (
    <OrderNotificationsContext.Provider value={value}>
      {children}
    </OrderNotificationsContext.Provider>
  );
}

export function useOrderNotifications() {
  const ctx = useContext(OrderNotificationsContext);
  if (!ctx) throw new Error("useOrderNotifications must be used within OrderNotificationsProvider");
  return ctx;
}
