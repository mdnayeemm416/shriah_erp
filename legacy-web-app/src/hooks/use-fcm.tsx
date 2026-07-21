import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserAccess } from "@/hooks/use-user-access";

const REGISTERED_KEY = "fcm_token_registered_v1";

async function saveToken(userId: string, token: string, role: string) {
  try {
    // Upsert by unique(token) — refresh user/role/timestamp on reuse.
    const { error } = await (supabase as any)
      .from("notification_tokens")
      .upsert(
        {
          user_id: userId,
          token,
          role,
          platform: typeof navigator !== "undefined" ? navigator.platform : null,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "token" },
      );
    if (error) throw error;
    try { localStorage.setItem(REGISTERED_KEY, token); } catch { /* noop */ }
    console.log("[FCM] token saved correctly:", { role, token: token.slice(0, 12) });
  } catch (e) {
    console.warn("[FCM] saveToken failed:", e);
  }
}

/**
 * Register the current device for push notifications.
 * Lazy-loads firebase only when this is called — zero cost otherwise.
 * Safe no-op if browser doesn't support FCM or permission is denied.
 */
export function useFcmRegister() {
  const { user } = useAuth();
  const access = useUserAccess();
  const triedRef = useRef(false);

  const register = useCallback(async (opts?: { silent?: boolean }) => {
    if (!user) return null;
    if (typeof window === "undefined" || !("Notification" in window)) return null;

    try {
      const { requestFcmToken, onForegroundMessage } = await import("@/lib/firebase");
      const token = await requestFcmToken();
      if (!token) {
        if (!opts?.silent && Notification.permission === "denied") {
          toast.error("Notifications blocked in browser settings.");
        }
        return null;
      }
      console.log("[FCM] token registration:", token.slice(0, 12));
      const role = access.isSuperAdmin
        ? "super_admin"
        : access.isAdmin
          ? "admin"
          : (access.roles[0] ?? "user");
      await saveToken(user.id, token, role);

      // Foreground messages → toast (no duplicate; SW handles background).
      // Skip order pushes here — the realtime channel in
      // use-order-notifications already toasts/dedupes those.
      onForegroundMessage((payload) => {
        if (payload?.data?.orderId) return;
        const title = payload?.notification?.title || payload?.data?.title || "Notification";
        const body = payload?.notification?.body || payload?.data?.body || "";
        toast(title, { description: body });
      }).catch(() => {});

      if (!opts?.silent) toast.success("Push notifications enabled");
      return token;
    } catch (e) {
      console.warn("[FCM] register failed:", e);
      return null;
    }
  }, [user, access.isAdmin, access.isSuperAdmin, access.roles]);

  // Auto-register once per session if already granted (no prompt spam).
  useEffect(() => {
    if (triedRef.current || !user || access.loading) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    triedRef.current = true;
    // Skip if same token already registered this device.
    let last: string | null = null;
    try { last = localStorage.getItem(REGISTERED_KEY); } catch { /* noop */ }
    register({ silent: true }).then((tok) => {
      if (tok && tok === last) { /* already up-to-date */ }
    });
  }, [user, access.loading, register]);

  return { register };
}
