/* Firebase Cloud Messaging service worker — handles true BACKGROUND pushes.
 * This file is intentionally in /public so it is served from the site root. */
/* eslint-disable no-undef */

const RECENT_TAG_TTL_MS = 15_000;
const recentTags = new Map();

function cleanupRecentTags() {
  const now = Date.now();
  for (const [tag, ts] of recentTags.entries()) {
    if (now - ts > RECENT_TAG_TTL_MS) recentTags.delete(tag);
  }
}

function normalizePayload(payload) {
  const notification = payload?.notification || payload?.webpush?.notification || {};
  const data = payload?.data || notification?.data || {};
  const title = notification.title || data.title || "Notification";
  const body = notification.body || data.body || "";
  const tag = data.tag || notification.tag || (data.orderId ? `order-${data.orderId}` : `fcm-${Date.now()}`);
  const url = data.url || payload?.fcmOptions?.link || payload?.fcm_options?.link || "/";

  return {
    title,
    options: {
      body,
      icon: notification.icon || data.icon || "/favicon.ico",
      badge: notification.badge || data.badge || "/favicon.ico",
      tag,
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { ...data, url, tag },
    },
  };
}

async function hasFocusedClient() {
  const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
  return all.some((client) => client.focused || client.visibilityState === "visible");
}

async function showPushNotification(payload) {
  cleanupRecentTags();
  const { title, options } = normalizePayload(payload);
  console.log("[FCM SW] background notification received:", {
    tag: options.tag,
    orderId: options.data?.orderId,
    title,
  });

  // DEBUG: temporarily disabled hasFocusedClient() suppression so all
  // push notifications show even when the app is focused.
  // if (await hasFocusedClient()) {
  //   console.log("[FCM SW] skipped system notification because app is foreground:", options.tag);
  //   return;
  // }

  if (recentTags.has(options.tag)) {
    console.log("[FCM SW] duplicate notification skipped:", options.tag);
    return;
  }
  recentTags.set(options.tag, Date.now());
  await self.registration.showNotification(title, options);
  console.log("[FCM SW] showNotification displayed:", options.tag);
}

// Activate immediately on install/update so a fresh SW serves pushes right away.
self.addEventListener("install", (event) => {
  console.log("[FCM SW] installing");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("[FCM SW] service worker active");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { data: { title: "Notification", body: event.data?.text?.() || "" } };
  }
  event.waitUntil(showPushNotification(payload));
});

// Click → focus existing tab on the target URL, or open a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const target = data.url || (data.orderId ? "/store-admin" : "/");
  console.log("[FCM SW] notification click:", { target, orderId: data.orderId, tag: event.notification.tag });
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      try {
        const u = new URL(c.url);
        if (u.pathname.startsWith(target.split("?")[0])) {
          await c.focus();
          return;
        }
      } catch { /* noop */ }
    }
    // Try to focus any open window first, then navigate it.
    if (all[0] && "navigate" in all[0]) {
      try { await all[0].focus(); await all[0].navigate(target); return; } catch { /* noop */ }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
