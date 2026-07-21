// Admin-only self-test push endpoint.
// Sends a direct FCM v1 notification to a provided device token, bypassing
// the order system entirely. Anti-abuse: the token MUST already exist in
// notification_tokens and belong to an admin/super_admin role.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/send-test-push")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      POST: async ({ request }) => {
        const cors = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };
        try {
          const body = (await request.json().catch(() => ({}))) as {
            token?: string;
            title?: string;
            body?: string;
          };
          const token = String(body.token || "").trim();
          if (token.length < 20) {
            return json({ ok: false, error: "Invalid token" }, 400, cors);
          }

          // Anti-abuse: token must belong to an admin/super_admin device.
          const { data: row, error: tokErr } = await supabaseAdmin
            .from("notification_tokens")
            .select("token, role")
            .eq("token", token)
            .maybeSingle();
          if (tokErr) return json({ ok: false, error: tokErr.message }, 500, cors);
          if (!row || !["admin", "super_admin"].includes(String(row.role))) {
            return json({ ok: false, error: "Token not authorized" }, 403, cors);
          }

          const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
          if (!saJson) {
            return json(
              { ok: false, error: "FIREBASE_SERVICE_ACCOUNT_JSON not configured" },
              500,
              cors,
            );
          }
          const sa = JSON.parse(saJson) as {
            client_email: string;
            private_key: string;
            project_id: string;
          };

          const accessToken = await mintAccessToken(sa);
          const title = String(body.title || "🔔 Test Notification");
          const bodyText = String(
            body.body || `Self-test from ERP at ${new Date().toLocaleTimeString()}`,
          );
          const tag = `selftest-${Date.now()}`;
          const url = "/store-admin";

          const endpoint = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
          const message = {
            message: {
              token,
              notification: { title, body: bodyText },
              data: {
                title,
                body: bodyText,
                url,
                tag,
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                priority: "high",
                sound: "default",
                requireInteraction: "true",
              },
              webpush: {
                headers: { Urgency: "high", TTL: "300" },
                notification: {
                  title,
                  body: bodyText,
                  icon: "/favicon.ico",
                  badge: "/favicon.ico",
                  tag,
                  renotify: true,
                  requireInteraction: true,
                  vibrate: [200, 100, 200],
                  data: { url, tag },
                },
                fcm_options: { link: url },
              },
              android: {
                priority: "HIGH" as const,
                notification: { sound: "default" },
              },
            },
          };

          const r = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });
          const txt = await r.text();
          let parsed: unknown = txt;
          try { parsed = JSON.parse(txt); } catch { /* keep raw */ }
          console.log("[push-test]", r.status, typeof parsed === "string" ? parsed.slice(0, 200) : parsed);
          return json(
            { ok: r.ok, status: r.status, response: parsed },
            200,
            cors,
          );
        } catch (e: any) {
          console.error("[push-test] failed:", e?.message || e);
          return json({ ok: false, error: e?.message || String(e) }, 500, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          });
        }
      },
    },
  },
});

function json(obj: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(obj), { status, headers });
}

// --- Google service-account → OAuth2 access token (Web Crypto, edge-safe) ---
async function mintAccessToken(sa: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const enc = (o: unknown) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const signingInput = `${enc(header)}.${enc(claim)}`;
  const key = await importPkcs8(sa.private_key);
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${b64url(new Uint8Array(sig))}`;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`OAuth token mint failed ${r.status}: ${t.slice(0, 200)}`);
  }
  const j = (await r.json()) as { access_token: string };
  return j.access_token;
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importPkcs8(pem: string): Promise<CryptoKey> {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\s+/g, "");
  const bin = atob(clean);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey(
    "pkcs8",
    buf,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}
