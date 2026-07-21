import { r as reactExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, s as useUserAccess } from "./router-KeVl8_Ln.mjs";
const REGISTERED_KEY = "fcm_token_registered_v1";
async function saveToken(userId, token, role) {
  try {
    const { error } = await supabase.from("notification_tokens").upsert(
      {
        user_id: userId,
        token,
        role,
        platform: typeof navigator !== "undefined" ? navigator.platform : null,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      { onConflict: "token" }
    );
    if (error) throw error;
    try {
      localStorage.setItem(REGISTERED_KEY, token);
    } catch {
    }
    console.log("[FCM] token saved correctly:", { role, token: token.slice(0, 12) });
  } catch (e) {
    console.warn("[FCM] saveToken failed:", e);
  }
}
function useFcmRegister() {
  const { user } = useAuth();
  const access = useUserAccess();
  const triedRef = reactExports.useRef(false);
  const register = reactExports.useCallback(async (opts) => {
    if (!user) return null;
    if (typeof window === "undefined" || !("Notification" in window)) return null;
    try {
      const { requestFcmToken, onForegroundMessage } = await import("./firebase-DqLwa6e3.mjs");
      const token = await requestFcmToken();
      if (!token) {
        if (!opts?.silent && Notification.permission === "denied") {
          toast.error("Notifications blocked in browser settings.");
        }
        return null;
      }
      console.log("[FCM] token registration:", token.slice(0, 12));
      const role = access.isSuperAdmin ? "super_admin" : access.isAdmin ? "admin" : access.roles[0] ?? "user";
      await saveToken(user.id, token, role);
      onForegroundMessage((payload) => {
        if (payload?.data?.orderId) return;
        const title = payload?.notification?.title || payload?.data?.title || "Notification";
        const body = payload?.notification?.body || payload?.data?.body || "";
        toast(title, { description: body });
      }).catch(() => {
      });
      if (!opts?.silent) toast.success("Push notifications enabled");
      return token;
    } catch (e) {
      console.warn("[FCM] register failed:", e);
      return null;
    }
  }, [user, access.isAdmin, access.isSuperAdmin, access.roles]);
  reactExports.useEffect(() => {
    if (triedRef.current || !user || access.loading) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    triedRef.current = true;
    let last = null;
    try {
      last = localStorage.getItem(REGISTERED_KEY);
    } catch {
    }
    register({ silent: true }).then((tok) => {
    });
  }, [user, access.loading, register]);
  return { register };
}
export {
  useFcmRegister as u
};
