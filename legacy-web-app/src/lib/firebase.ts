// Lazy Firebase Messaging setup — client only. No bundle cost until used.
import { initializeApp, getApps, deleteApp, type FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
  isSupported,
  type Messaging,
} from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyC0KJvWgfX-RysDJzVBqANOTPeRfRLSkfw",
  authDomain: "shriah-app.firebaseapp.com",
  projectId: "shriah-app",
  storageBucket: "shriah-app.firebasestorage.app",
  messagingSenderId: "723242229889",
  appId: "1:723242229889:web:0baf9ffb84e69daa4c6d80",
  measurementId: "G-XDSLVN868Y",
};

export const VAPID_KEY =
  "BKSDr1voK1RogexAf6WBHDRIRkrUxsda-bpA-Of0ydAogGRfS0v2xnpYFkab5CXPz23k16cGW0hKsg710mOnSZM";

// Last error surfaced by getToken — exposed to the UI for debugging.
export let lastTokenError: string | null = null;

let _app: FirebaseApp | null = null;
let _messaging: Messaging | null = null;

function verifyFirebaseConfig(): string | null {
  const required = ["apiKey", "projectId", "messagingSenderId", "appId"] as const;
  for (const k of required) {
    if (!(firebaseConfig as any)[k]) return `Missing firebaseConfig.${k}`;
  }
  // Sender ID must be the numeric prefix of appId: "1:<sender>:web:..."
  const senderFromAppId = firebaseConfig.appId.split(":")[1];
  if (senderFromAppId !== firebaseConfig.messagingSenderId) {
    return `messagingSenderId (${firebaseConfig.messagingSenderId}) does not match appId sender (${senderFromAppId})`;
  }
  return null;
}

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}

export async function getMessagingSafe(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  try {
    if (!(await isSupported())) return null;
    if (_messaging) return _messaging;
    _messaging = getMessaging(getFirebaseApp());
    return _messaging;
  } catch (e) {
    console.warn("[FCM] not supported:", e);
    return null;
  }
}

export async function registerFcmServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    // Wait for SW to actually become ready (active) before token requests.
    await navigator.serviceWorker.ready;
    console.log("[FCM] service worker registered successfully:", reg.scope);
    console.log("[FCM] service worker active:", Boolean(reg.active || reg.waiting || reg.installing));
    return reg;
  } catch (e) {
    console.warn("[FCM] SW register failed:", e);
    return null;
  }
}

async function getTokenWithRetry(messaging: Messaging, swReg: ServiceWorkerRegistration, attempts = 3): Promise<string | null> {
  let lastErr: any = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg,
      });
      if (token) {
        lastTokenError = null;
        return token;
      }
      lastErr = new Error("getToken returned empty");
      console.warn(`[FCM] getToken attempt ${i} returned empty`);
    } catch (e: any) {
      lastErr = e;
      console.warn(`[FCM] getToken attempt ${i} failed:`, e?.code || "", e?.message || e);
    }
    await new Promise((r) => setTimeout(r, 400 * i));
  }
  lastTokenError = lastErr?.message ? `${lastErr.code ?? "error"}: ${lastErr.message}` : String(lastErr || "unknown");
  return null;
}

export async function requestFcmToken(): Promise<string | null> {
  lastTokenError = null;
  if (typeof window === "undefined" || !("Notification" in window)) {
    lastTokenError = "Notifications not supported in this browser";
    return null;
  }

  const cfgErr = verifyFirebaseConfig();
  if (cfgErr) {
    lastTokenError = cfgErr;
    console.warn("[FCM]", cfgErr);
    return null;
  }

  const messaging = await getMessagingSafe();
  if (!messaging) {
    lastTokenError = "Firebase Messaging not supported in this context";
    return null;
  }

  let permission = Notification.permission;
  console.log("[FCM] notification permission status:", permission);
  if (permission === "default") {
    permission = await Notification.requestPermission();
    console.log("[FCM] notification permission status after prompt:", permission);
  }
  if (permission !== "granted") {
    lastTokenError = `Permission ${permission}`;
    return null;
  }

  const vapidLooksValid = /^B[A-Za-z0-9_-]{80,}$/.test(VAPID_KEY);
  console.log("[FCM] VAPID key configured:", vapidLooksValid);
  if (!vapidLooksValid) {
    lastTokenError = "VAPID key looks invalid";
    return null;
  }

  const swReg = await registerFcmServiceWorker();
  if (!swReg) {
    lastTokenError = "Service worker registration failed";
    return null;
  }

  const token = await getTokenWithRetry(messaging, swReg, 3);
  console.log("[FCM] token registration result:", token ? "token received" : `no token (${lastTokenError})`);
  return token;
}

export async function onForegroundMessage(cb: (payload: any) => void): Promise<() => void> {
  const messaging = await getMessagingSafe();
  if (!messaging) return () => {};
  return onMessage(messaging, cb);
}

/**
 * Nuke everything related to push and start fresh.
 *  - delete current FCM token
 *  - unregister all service workers
 *  - clear all caches
 *  - delete Firebase app instance
 *  - re-register messaging SW
 *  - request fresh permission
 *  - generate a new token
 */
export async function hardResetPush(): Promise<{ token: string | null; error: string | null; steps: string[] }> {
  const steps: string[] = [];
  lastTokenError = null;

  // 1. Try to delete current FCM token
  try {
    const messaging = await getMessagingSafe();
    if (messaging) {
      const ok = await deleteToken(messaging);
      steps.push(`deleteToken: ${ok ? "ok" : "no token"}`);
    } else {
      steps.push("deleteToken: messaging unsupported");
    }
  } catch (e: any) {
    steps.push(`deleteToken error: ${e?.message || e}`);
  }

  // 2. Unregister ALL service workers
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        try {
          await r.unregister();
        } catch { /* noop */ }
      }
      steps.push(`unregistered ${regs.length} service worker(s)`);
    }
  } catch (e: any) {
    steps.push(`unregister error: ${e?.message || e}`);
  }

  // 3. Clear all caches
  try {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      steps.push(`cleared ${names.length} cache(s)`);
    }
  } catch (e: any) {
    steps.push(`caches error: ${e?.message || e}`);
  }

  // 4. Delete Firebase app instance so we re-init cleanly
  try {
    if (_app) {
      await deleteApp(_app);
      steps.push("deleted Firebase app");
    }
  } catch (e: any) {
    steps.push(`deleteApp error: ${e?.message || e}`);
  }
  _app = null;
  _messaging = null;

  // 5. Re-register SW
  const swReg = await registerFcmServiceWorker();
  steps.push(`re-registered SW: ${swReg ? "ok" : "FAILED"}`);

  // 6. Permission
  try {
    if (typeof Notification !== "undefined") {
      const p = Notification.permission === "granted"
        ? "granted"
        : await Notification.requestPermission();
      steps.push(`permission: ${p}`);
    }
  } catch (e: any) {
    steps.push(`permission error: ${e?.message || e}`);
  }

  // 7. Fresh token
  const token = await requestFcmToken();
  steps.push(token ? `new token: ${token.slice(0, 16)}…` : `new token: FAILED (${lastTokenError})`);

  return { token, error: lastTokenError, steps };
}
