import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as useUserAccess, h as Badge, C as Card, B as Button } from "./router-KeVl8_Ln.mjs";
import { getFirebaseApp, firebaseConfig, registerFcmServiceWorker, getMessagingSafe, onForegroundMessage, requestFcmToken, lastTokenError, VAPID_KEY, hardResetPush } from "./firebase-DqLwa6e3.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__messaging.mjs";
import { a3 as Bell, a as TriangleAlert, b8 as Copy, ao as RefreshCw, b3 as Send, T as Trash2, C as CircleCheck, g as CircleX } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-Bs6QIVWe.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__installations.mjs";
function PushTestPage() {
  const access = useUserAccess();
  const [token, setToken] = reactExports.useState(null);
  const [permission, setPermission] = reactExports.useState("unknown");
  const [swStatus, setSwStatus] = reactExports.useState("checking…");
  const [firebaseInit, setFirebaseInit] = reactExports.useState("unknown");
  const [vapidOk, setVapidOk] = reactExports.useState("unknown");
  const [lastSuccessAt, setLastSuccessAt] = reactExports.useState(null);
  const [logs, setLogs] = reactExports.useState([]);
  const [sending, setSending] = reactExports.useState(false);
  const [lastResponse, setLastResponse] = reactExports.useState(null);
  const [tokenError, setTokenError] = reactExports.useState(null);
  const [resetting, setResetting] = reactExports.useState(false);
  const mounted = reactExports.useRef(true);
  const log = (line) => {
    const stamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    setLogs((l) => [`[${stamp}] ${line}`, ...l].slice(0, 100));
    console.log("[push-test]", line);
  };
  reactExports.useEffect(() => () => {
    mounted.current = false;
  }, []);
  reactExports.useEffect(() => {
    let unsub = () => {
    };
    (async () => {
      try {
        const app = getFirebaseApp();
        setFirebaseInit(app ? "ok" : "fail");
        log(`Firebase app initialized: ${app?.name ?? "?"} (project ${firebaseConfig.projectId})`);
      } catch (e) {
        setFirebaseInit("fail");
        log(`Firebase init ERROR: ${e?.message || e}`);
      }
      const vapidValid = /^B[A-Za-z0-9_-]{80,}$/.test(VAPID_KEY);
      setVapidOk(vapidValid ? "ok" : "fail");
      log(`VAPID key ${vapidValid ? "looks valid" : "INVALID"} (len ${VAPID_KEY.length})`);
      if (typeof Notification === "undefined") {
        setPermission("unsupported");
        log("Notification API not supported in this browser");
      } else {
        setPermission(Notification.permission);
        log(`Notification permission: ${Notification.permission}`);
      }
      if ("serviceWorker" in navigator) {
        try {
          const reg = await registerFcmServiceWorker();
          if (reg) {
            const state = reg.active ? "active" : reg.waiting ? "waiting" : reg.installing ? "installing" : "unknown";
            setSwStatus(`registered (${state}) — scope ${reg.scope}`);
            log(`Service worker ${state} at ${reg.scope}`);
          } else {
            setSwStatus("registration failed");
            log("Service worker registration returned null");
          }
        } catch (e) {
          setSwStatus(`error: ${e?.message || e}`);
          log(`SW ERROR: ${e?.message || e}`);
        }
      } else {
        setSwStatus("not supported");
      }
      const messaging = await getMessagingSafe();
      if (!messaging) {
        log("Firebase Messaging not supported in this context");
      } else {
        try {
          unsub = await onForegroundMessage((p) => {
            log(`📩 foreground message: ${JSON.stringify(p?.notification || p?.data || {})}`);
            setLastSuccessAt((/* @__PURE__ */ new Date()).toISOString());
          });
        } catch (e) {
          log(`onMessage ERROR: ${e?.message || e}`);
        }
      }
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          const t = await requestFcmToken();
          if (mounted.current) {
            setToken(t);
            setTokenError(t ? null : lastTokenError);
          }
          log(t ? `Token acquired (${t.slice(0, 16)}…)` : `Token request returned null — ${lastTokenError ?? "unknown"}`);
        } catch (e) {
          setTokenError(e?.message || String(e));
          log(`Token ERROR: ${e?.message || e}`);
        }
      }
    })();
    return () => {
      try {
        unsub();
      } catch {
      }
    };
  }, []);
  const requestPermAndToken = async () => {
    try {
      if (typeof Notification === "undefined") return;
      const p = await Notification.requestPermission();
      setPermission(p);
      log(`Permission after prompt: ${p}`);
      if (p !== "granted") return;
      const t = await requestFcmToken();
      setToken(t);
      setTokenError(t ? null : lastTokenError);
      log(t ? `Token refreshed (${t.slice(0, 16)}…)` : `Token request returned null — ${lastTokenError ?? "unknown"}`);
    } catch (e) {
      setTokenError(e?.message || String(e));
      log(`Permission/token ERROR: ${e?.message || e}`);
    }
  };
  const doHardReset = async () => {
    setResetting(true);
    setTokenError(null);
    log("⚠️  Hard reset: deleting token, unregistering SWs, clearing caches…");
    try {
      const res = await hardResetPush();
      res.steps.forEach((s) => log(`  • ${s}`));
      setToken(res.token);
      setTokenError(res.token ? null : res.error);
      if (typeof Notification !== "undefined") setPermission(Notification.permission);
      try {
        const reg = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
        if (reg) {
          const state = reg.active ? "active" : reg.waiting ? "waiting" : reg.installing ? "installing" : "unknown";
          setSwStatus(`registered (${state}) — scope ${reg.scope}`);
        }
      } catch {
      }
      if (res.token) toast.success("Hard reset complete — new token generated");
      else toast.error(`Hard reset done but no token: ${res.error || "unknown"}`);
    } catch (e) {
      log(`Hard reset ERROR: ${e?.message || e}`);
      setTokenError(e?.message || String(e));
      toast.error(`Hard reset failed: ${e?.message || e}`);
    } finally {
      setResetting(false);
    }
  };
  const copyToken = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      toast.success("Token copied");
    } catch (e) {
      toast.error(`Copy failed: ${e?.message || e}`);
    }
  };
  const sendSelfTest = async () => {
    if (!token) {
      toast.error("No FCM token");
      return;
    }
    setSending(true);
    setLastResponse(null);
    log("Sending self-test push…");
    try {
      const r = await fetch("/api/public/send-test-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          title: "🔔 Self-Test Push",
          body: `From admin device at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`
        })
      });
      const data = await r.json().catch(() => ({
        raw: "non-json response"
      }));
      setLastResponse(data);
      log(`Server responded HTTP ${r.status}: ${JSON.stringify(data).slice(0, 300)}`);
      if (data?.ok) {
        setLastSuccessAt((/* @__PURE__ */ new Date()).toISOString());
        toast.success("Push sent — check device");
      } else {
        toast.error(`Push failed: ${data?.error || `HTTP ${r.status}`}`);
      }
    } catch (e) {
      log(`Send ERROR: ${e?.message || e}`);
      setLastResponse({
        error: e?.message || String(e)
      });
      toast.error(`Network error: ${e?.message || e}`);
    } finally {
      setSending(false);
    }
  };
  if (access.loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" });
  if (!access.isAdmin && !access.isSuperAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: access.primaryRoute });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Push Notification Test" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-2 text-[10px]", children: "temporary / admin" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Environment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Firebase initialized", status: firebaseInit, value: firebaseConfig.projectId }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "VAPID key", status: vapidOk, value: `${VAPID_KEY.slice(0, 12)}… (${VAPID_KEY.length} chars)` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Notification permission", status: permission === "granted" ? "ok" : permission === "denied" ? "fail" : "unknown", value: String(permission) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Service worker", status: swStatus.startsWith("registered") ? "ok" : swStatus === "checking…" ? "unknown" : "fail", value: swStatus }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Last successful push", status: lastSuccessAt ? "ok" : "unknown", value: lastSuccessAt ? new Date(lastSuccessAt).toLocaleString() : "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "FCM Token" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "break-all whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-[11px] font-mono", children: token ?? "(no token — grant permission first)" }),
      tokenError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-[12px] text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Token generation error" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap break-words font-mono text-[11px]", children: tokenError })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: copyToken, disabled: !token, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
          " Copy token"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: requestPermAndToken, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
          " Request / refresh"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: sendSelfTest, disabled: !token || sending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " ",
          sending ? "Sending…" : "Send self-test push"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: doHardReset, disabled: resetting, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
          " ",
          resetting ? "Resetting…" : "Hard reset push"
        ] })
      ] })
    ] }),
    lastResponse && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Last Firebase response" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] font-mono", children: JSON.stringify(lastResponse, null, 2) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Activity log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "max-h-80 overflow-y-auto rounded-lg bg-muted/50 p-3 text-[11px] font-mono", children: logs.length ? logs.join("\n") : "(no events yet)" })
    ] })
  ] });
}
function Row({
  label,
  status,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 text-[12.5px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
      status === "ok" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }) : status === "fail" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-muted-foreground/40" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[60%] truncate text-right font-mono text-[11px]", children: value })
  ] });
}
export {
  PushTestPage as component
};
