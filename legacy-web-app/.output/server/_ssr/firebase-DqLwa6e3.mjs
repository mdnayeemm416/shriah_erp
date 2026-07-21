import "../_libs/firebase.mjs";
import { i as isWindowSupported, g as getMessagingInWindow, o as onMessage, d as deleteToken, a as getToken } from "../_libs/firebase__messaging.mjs";
import { b as getApps, i as initializeApp, d as deleteApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__installations.mjs";
import "../_libs/unenv.mjs";





import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__logger.mjs";
const firebaseConfig = {
  apiKey: "AIzaSyC0KJvWgfX-RysDJzVBqANOTPeRfRLSkfw",
  authDomain: "shriah-app.firebaseapp.com",
  projectId: "shriah-app",
  storageBucket: "shriah-app.firebasestorage.app",
  messagingSenderId: "723242229889",
  appId: "1:723242229889:web:0baf9ffb84e69daa4c6d80",
  measurementId: "G-XDSLVN868Y"
};
const VAPID_KEY = "BKSDr1voK1RogexAf6WBHDRIRkrUxsda-bpA-Of0ydAogGRfS0v2xnpYFkab5CXPz23k16cGW0hKsg710mOnSZM";
let lastTokenError = null;
let _app = null;
let _messaging = null;
function verifyFirebaseConfig() {
  const required = ["apiKey", "projectId", "messagingSenderId", "appId"];
  for (const k of required) {
    if (!firebaseConfig[k]) return `Missing firebaseConfig.${k}`;
  }
  const senderFromAppId = firebaseConfig.appId.split(":")[1];
  if (senderFromAppId !== firebaseConfig.messagingSenderId) {
    return `messagingSenderId (${firebaseConfig.messagingSenderId}) does not match appId sender (${senderFromAppId})`;
  }
  return null;
}
function getFirebaseApp() {
  if (_app) return _app;
  _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}
async function getMessagingSafe() {
  if (typeof window === "undefined") return null;
  try {
    if (!await isWindowSupported()) return null;
    if (_messaging) return _messaging;
    _messaging = getMessagingInWindow(getFirebaseApp());
    return _messaging;
  } catch (e) {
    console.warn("[FCM] not supported:", e);
    return null;
  }
}
async function registerFcmServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/"
    });
    await navigator.serviceWorker.ready;
    console.log("[FCM] service worker registered successfully:", reg.scope);
    console.log("[FCM] service worker active:", Boolean(reg.active || reg.waiting || reg.installing));
    return reg;
  } catch (e) {
    console.warn("[FCM] SW register failed:", e);
    return null;
  }
}
async function getTokenWithRetry(messaging, swReg, attempts = 3) {
  let lastErr = null;
  for (let i = 1; i <= attempts; i++) {
    try {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg
      });
      if (token) {
        lastTokenError = null;
        return token;
      }
      lastErr = new Error("getToken returned empty");
      console.warn(`[FCM] getToken attempt ${i} returned empty`);
    } catch (e) {
      lastErr = e;
      console.warn(`[FCM] getToken attempt ${i} failed:`, e?.code || "", e?.message || e);
    }
    await new Promise((r) => setTimeout(r, 400 * i));
  }
  lastTokenError = lastErr?.message ? `${lastErr.code ?? "error"}: ${lastErr.message}` : String(lastErr || "unknown");
  return null;
}
async function requestFcmToken() {
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
async function onForegroundMessage(cb) {
  const messaging = await getMessagingSafe();
  if (!messaging) return () => {
  };
  return onMessage(messaging, cb);
}
async function hardResetPush() {
  const steps = [];
  lastTokenError = null;
  try {
    const messaging = await getMessagingSafe();
    if (messaging) {
      const ok = await deleteToken(messaging);
      steps.push(`deleteToken: ${ok ? "ok" : "no token"}`);
    } else {
      steps.push("deleteToken: messaging unsupported");
    }
  } catch (e) {
    steps.push(`deleteToken error: ${e?.message || e}`);
  }
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        try {
          await r.unregister();
        } catch {
        }
      }
      steps.push(`unregistered ${regs.length} service worker(s)`);
    }
  } catch (e) {
    steps.push(`unregister error: ${e?.message || e}`);
  }
  try {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      steps.push(`cleared ${names.length} cache(s)`);
    }
  } catch (e) {
    steps.push(`caches error: ${e?.message || e}`);
  }
  try {
    if (_app) {
      await deleteApp(_app);
      steps.push("deleted Firebase app");
    }
  } catch (e) {
    steps.push(`deleteApp error: ${e?.message || e}`);
  }
  _app = null;
  _messaging = null;
  const swReg = await registerFcmServiceWorker();
  steps.push(`re-registered SW: ${swReg ? "ok" : "FAILED"}`);
  try {
    if (typeof Notification !== "undefined") {
      const p = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
      steps.push(`permission: ${p}`);
    }
  } catch (e) {
    steps.push(`permission error: ${e?.message || e}`);
  }
  const token = await requestFcmToken();
  steps.push(token ? `new token: ${token.slice(0, 16)}…` : `new token: FAILED (${lastTokenError})`);
  return { token, error: lastTokenError, steps };
}
export {
  VAPID_KEY,
  firebaseConfig,
  getFirebaseApp,
  getMessagingSafe,
  hardResetPush,
  lastTokenError,
  onForegroundMessage,
  registerFcmServiceWorker,
  requestFcmToken
};
