// Sends a real Firebase Cloud Messaging v1 push for a freshly created
// wholesale order to every admin/super_admin token in notification_tokens.
// Public endpoint (called right after the anonymous customer places an order),
// but it ONLY sends a push when the referenced order actually exists AND was
// created within the last 5 minutes — so it cannot be abused for spam.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/send-order-push")({
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
            orderId?: string;
          };
          const orderId = String(body.orderId || "").trim();
          if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
            return new Response(JSON.stringify({ error: "Invalid orderId" }), {
              status: 400,
              headers: cors,
            });
          }

          // Verify the order exists and is recent (anti-abuse).
          const { data: order, error: orderErr } = await supabaseAdmin
            .from("shop_orders")
            .select("id, order_number, customer_name, total, created_at, is_deleted")
            .eq("id", orderId)
            .maybeSingle();
          if (orderErr || !order || order.is_deleted) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
              status: 404,
              headers: cors,
            });
          }
          const ageMs = Date.now() - new Date(order.created_at as string).getTime();
          if (ageMs > 5 * 60_000) {
            return new Response(JSON.stringify({ error: "Order too old" }), {
              status: 410,
              headers: cors,
            });
          }

          const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
          if (!saJson) {
            console.warn("[push] FIREBASE_SERVICE_ACCOUNT_JSON not set; skipping send");
            return new Response(JSON.stringify({ skipped: true }), { status: 200, headers: cors });
          }
          const sa = JSON.parse(saJson) as {
            client_email: string;
            private_key: string;
            project_id: string;
          };

          // Fetch admin/super_admin device tokens.
          const { data: tokens, error: tokErr } = await supabaseAdmin
            .from("notification_tokens")
            .select("token, role")
            .in("role", ["admin", "super_admin"]);
          if (tokErr) {
            console.warn("[push] token query failed:", tokErr.message);
            return new Response(JSON.stringify({ error: "Token query failed" }), {
              status: 500,
              headers: cors,
            });
          }
          const list = (tokens || []).map((t: any) => t.token).filter(Boolean);
          console.log("[push] dispatching to", list.length, "admin tokens for order", order.order_number);
          if (list.length === 0) {
            return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: cors });
          }

          const accessToken = await mintAccessToken(sa);
          const title = "New Wholesale Order";
          const total = Number(order.total ?? 0).toFixed(2);
          const bodyText = `${order.customer_name || "Customer"} placed an order worth SAR ${total}`;
          const url = `/store-admin`;
          const tag = `order-${order.id}`;

          const endpoint = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
          const invalidTokens: string[] = [];
          let sent = 0;
          await Promise.all(
            list.map(async (token: string) => {
              const message = {
                message: {
                  token,
                  notification: {
                    title,
                    body: bodyText,
                  },
                  data: {
                    title,
                    body: bodyText,
                    url,
                    orderId: String(order.id),
                    tag,
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    priority: "high",
                    sound: "default",
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
                      requireInteraction: false,
                      vibrate: [200, 100, 200],
                      data: { url, orderId: String(order.id), tag },
                    },
                    fcm_options: { link: url },
                  },
                  android: {
                    priority: "HIGH" as const,
                    notification: { sound: "default" },
                  },
                },
              };
              try {
                const r = await fetch(endpoint, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(message),
                });
                if (r.ok) {
                  sent++;
                  console.log("[push] notification sent", { orderId: order.id, token: token.slice(0, 12) });
                } else {
                  const txt = await r.text().catch(() => "");
                  console.warn("[push] notification failed", r.status, txt.slice(0, 200));
                  if (
                    r.status === 404 ||
                    r.status === 400 ||
                    /UNREGISTERED|INVALID_ARGUMENT|NOT_FOUND/i.test(txt)
                  ) {
                    invalidTokens.push(token);
                  }
                }
              } catch (e: any) {
                console.warn("[push] fetch failed:", e?.message || e);
              }
            }),
          );

          // Prune dead tokens so we don't keep retrying them.
          if (invalidTokens.length > 0) {
            await supabaseAdmin
              .from("notification_tokens")
              .delete()
              .in("token", invalidTokens);
            console.log("[push] pruned", invalidTokens.length, "stale tokens");
          }

          return new Response(JSON.stringify({ sent, pruned: invalidTokens.length }), {
            status: 200,
            headers: cors,
          });
        } catch (e: any) {
          console.error("[push] handler failed:", e?.message || e);
          return new Response(JSON.stringify({ error: "send failed" }), {
            status: 500,
            headers: cors,
          });
        }
      },
    },
  },
});

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
