import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserAccess } from "@/hooks/use-user-access";
import {
  firebaseConfig,
  VAPID_KEY,
  getFirebaseApp,
  getMessagingSafe,
  registerFcmServiceWorker,
  requestFcmToken,
  onForegroundMessage,
  hardResetPush,
  lastTokenError,
} from "@/lib/firebase";
import { Copy, Send, RefreshCw, Bell, CheckCircle2, XCircle, AlertTriangle, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/push-test")({
  component: PushTestPage,
});

type Status = "unknown" | "ok" | "fail";

function PushTestPage() {
  const access = useUserAccess();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unknown" as any);
  const [swStatus, setSwStatus] = useState<string>("checking…");
  const [firebaseInit, setFirebaseInit] = useState<Status>("unknown");
  const [vapidOk, setVapidOk] = useState<Status>("unknown");
  const [lastSuccessAt, setLastSuccessAt] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const mounted = useRef(true);

  const log = (line: string) => {
    const stamp = new Date().toLocaleTimeString();
    setLogs((l) => [`[${stamp}] ${line}`, ...l].slice(0, 100));
    console.log("[push-test]", line);
  };

  useEffect(() => () => { mounted.current = false; }, []);

  // Probe everything on mount
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      // Firebase init
      try {
        const app = getFirebaseApp();
        setFirebaseInit(app ? "ok" : "fail");
        log(`Firebase app initialized: ${app?.name ?? "?"} (project ${firebaseConfig.projectId})`);
      } catch (e: any) {
        setFirebaseInit("fail");
        log(`Firebase init ERROR: ${e?.message || e}`);
      }

      // VAPID
      const vapidValid = /^B[A-Za-z0-9_-]{80,}$/.test(VAPID_KEY);
      setVapidOk(vapidValid ? "ok" : "fail");
      log(`VAPID key ${vapidValid ? "looks valid" : "INVALID"} (len ${VAPID_KEY.length})`);

      // Permission
      if (typeof Notification === "undefined") {
        setPermission("unsupported" as any);
        log("Notification API not supported in this browser");
      } else {
        setPermission(Notification.permission);
        log(`Notification permission: ${Notification.permission}`);
      }

      // Service worker
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
        } catch (e: any) {
          setSwStatus(`error: ${e?.message || e}`);
          log(`SW ERROR: ${e?.message || e}`);
        }
      } else {
        setSwStatus("not supported");
      }

      // Messaging supported?
      const messaging = await getMessagingSafe();
      if (!messaging) {
        log("Firebase Messaging not supported in this context");
      } else {
        // Subscribe to foreground messages (for test echo)
        try {
          unsub = await onForegroundMessage((p) => {
            log(`📩 foreground message: ${JSON.stringify(p?.notification || p?.data || {})}`);
            setLastSuccessAt(new Date().toISOString());
          });
        } catch (e: any) {
          log(`onMessage ERROR: ${e?.message || e}`);
        }
      }

      // Existing token (no prompt if already granted)
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          const t = await requestFcmToken();
          if (mounted.current) {
            setToken(t);
            setTokenError(t ? null : lastTokenError);
          }
          log(t ? `Token acquired (${t.slice(0, 16)}…)` : `Token request returned null — ${lastTokenError ?? "unknown"}`);
        } catch (e: any) {
          setTokenError(e?.message || String(e));
          log(`Token ERROR: ${e?.message || e}`);
        }
      }
    })();
    return () => { try { unsub(); } catch { /* noop */ } };
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
    } catch (e: any) {
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
      // Refresh SW status
      try {
        const reg = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
        if (reg) {
          const state = reg.active ? "active" : reg.waiting ? "waiting" : reg.installing ? "installing" : "unknown";
          setSwStatus(`registered (${state}) — scope ${reg.scope}`);
        }
      } catch { /* noop */ }
      if (res.token) toast.success("Hard reset complete — new token generated");
      else toast.error(`Hard reset done but no token: ${res.error || "unknown"}`);
    } catch (e: any) {
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
    } catch (e: any) {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          title: "🔔 Self-Test Push",
          body: `From admin device at ${new Date().toLocaleTimeString()}`,
        }),
      });
      const data = await r.json().catch(() => ({ raw: "non-json response" }));
      setLastResponse(data);
      log(`Server responded HTTP ${r.status}: ${JSON.stringify(data).slice(0, 300)}`);
      if (data?.ok) {
        setLastSuccessAt(new Date().toISOString());
        toast.success("Push sent — check device");
      } else {
        toast.error(`Push failed: ${data?.error || `HTTP ${r.status}`}`);
      }
    } catch (e: any) {
      log(`Send ERROR: ${e?.message || e}`);
      setLastResponse({ error: e?.message || String(e) });
      toast.error(`Network error: ${e?.message || e}`);
    } finally {
      setSending(false);
    }
  };

  if (access.loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!access.isAdmin && !access.isSuperAdmin) return <Navigate to={access.primaryRoute as any} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="font-display text-xl font-bold">Push Notification Test</h1>
        <Badge variant="outline" className="ml-2 text-[10px]">temporary / admin</Badge>
      </div>

      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold">Environment</h2>
        <Row label="Firebase initialized" status={firebaseInit} value={firebaseConfig.projectId} />
        <Row label="VAPID key" status={vapidOk} value={`${VAPID_KEY.slice(0, 12)}… (${VAPID_KEY.length} chars)`} />
        <Row
          label="Notification permission"
          status={permission === "granted" ? "ok" : permission === "denied" ? "fail" : "unknown"}
          value={String(permission)}
        />
        <Row
          label="Service worker"
          status={swStatus.startsWith("registered") ? "ok" : swStatus === "checking…" ? "unknown" : "fail"}
          value={swStatus}
        />
        <Row
          label="Last successful push"
          status={lastSuccessAt ? "ok" : "unknown"}
          value={lastSuccessAt ? new Date(lastSuccessAt).toLocaleString() : "—"}
        />
      </Card>

      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold">FCM Token</h2>
        <pre className="break-all whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-[11px] font-mono">
{token ?? "(no token — grant permission first)"}
        </pre>
        {tokenError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-[12px] text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-semibold">Token generation error</p>
              <pre className="whitespace-pre-wrap break-words font-mono text-[11px]">{tokenError}</pre>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copyToken} disabled={!token}>
            <Copy className="h-4 w-4" /> Copy token
          </Button>
          <Button size="sm" variant="outline" onClick={requestPermAndToken}>
            <RefreshCw className="h-4 w-4" /> Request / refresh
          </Button>
          <Button size="sm" onClick={sendSelfTest} disabled={!token || sending}>
            <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send self-test push"}
          </Button>
          <Button size="sm" variant="destructive" onClick={doHardReset} disabled={resetting}>
            <Trash2 className="h-4 w-4" /> {resetting ? "Resetting…" : "Hard reset push"}
          </Button>
        </div>
      </Card>

      {lastResponse && (
        <Card className="p-4 space-y-2">
          <h2 className="text-sm font-semibold">Last Firebase response</h2>
          <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] font-mono">
{JSON.stringify(lastResponse, null, 2)}
          </pre>
        </Card>
      )}

      <Card className="p-4 space-y-2">
        <h2 className="text-sm font-semibold">Activity log</h2>
        <pre className="max-h-80 overflow-y-auto rounded-lg bg-muted/50 p-3 text-[11px] font-mono">
{logs.length ? logs.join("\n") : "(no events yet)"}
        </pre>
      </Card>
    </div>
  );
}

function Row({ label, status, value }: { label: string; status: Status; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[12.5px]">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {status === "ok" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        ) : status === "fail" ? (
          <XCircle className="h-3.5 w-3.5 text-destructive" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        )}
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right font-mono text-[11px]">{value}</span>
    </div>
  );
}
