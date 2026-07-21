// Sends order notification emails via Gmail (connector gateway) to every
// active recipient in notification_recipients. Public endpoint (called right
// after the anonymous customer places an order) but it ONLY sends when the
// referenced order exists AND was created within the last 5 minutes.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

export const Route = createFileRoute("/api/public/send-order-email")({
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
            test?: boolean;
            testRecipient?: string;
          };

          // ---- TEST MODE (admin-triggered) ----
          if (body.test) {
            const to = String(body.testRecipient || "").trim();
            if (!isValidEmail(to)) {
              return json({ error: "Invalid recipient" }, 400, cors);
            }
            const result = await sendGmail({
              to,
              subject: "Test Notification — Order Email",
              html: `<p>This is a test notification email from your shop. If you received this, Gmail notifications are working correctly.</p>`,
            });
            await logSend(null, to, "Test Notification — Order Email", result);
            return json(result.ok ? { sent: 1 } : { error: result.error }, result.ok ? 200 : 500, cors);
          }

          // ---- ORDER MODE ----
          const orderId = String(body.orderId || "").trim();
          if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
            return json({ error: "Invalid orderId" }, 400, cors);
          }

          const { data: order, error: orderErr } = await supabaseAdmin
            .from("shop_orders")
            .select("id, order_number, customer_name, customer_mobile, customer_address, total, items, notes, created_at, is_deleted")
            .eq("id", orderId)
            .maybeSingle();
          if (orderErr || !order || (order as any).is_deleted) {
            return json({ error: "Order not found" }, 404, cors);
          }
          const ageMs = Date.now() - new Date((order as any).created_at as string).getTime();
          if (ageMs > 5 * 60_000) {
            return json({ error: "Order too old" }, 410, cors);
          }

          const { data: recipients } = await supabaseAdmin
            .from("notification_recipients")
            .select("email, event_flags")
            .eq("is_active", true);
          const ORDER_MODULE = "Customer Order Received";
          const list = (recipients || [])
            .filter((r: any) => {
              const flags = r.event_flags || {};
              // Default ON when flag missing (backward compatible with pre-existing recipients)
              return flags[ORDER_MODULE] !== false;
            })
            .map((r: any) => String(r.email))
            .filter(isValidEmail);
          if (list.length === 0) {
            return json({ sent: 0, reason: "no recipients" }, 200, cors);
          }

          const shopName = "Shop";

          const subject = `New Order Received - ${shopName} (#${(order as any).order_number})`;
          const html = renderOrderHtml(shopName, order as any);

          let sent = 0;
          await Promise.all(
            list.map(async (to) => {
              const result = await sendGmail({ to, subject, html });
              if (result.ok) sent++;
              await logSend(orderId, to, subject, result);
            }),
          );

          return json({ sent, total: list.length }, 200, cors);
        } catch (e: any) {
          console.error("[order-email] handler failed:", e?.message || e);
          return json({ error: "send failed" }, 500, cors);
        }
      },
    },
  },
});

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers });
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function renderOrderHtml(shopName: string, order: any): string {
  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const rows = items.map((it) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc(it.name)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${esc(it.qty)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">SAR ${Number(it.price || 0).toFixed(2)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">SAR ${(Number(it.qty || 0) * Number(it.price || 0)).toFixed(2)}</td>
    </tr>`).join("");
  const orderTime = new Date(order.created_at).toLocaleString();
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#111">
    <h2 style="margin:0 0 4px">New Order Received</h2>
    <p style="margin:0 0 16px;color:#666">${esc(shopName)} · Order #${esc(order.order_number)}</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0"><b>${esc(order.customer_name)}</b></td></tr>
      <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${esc(order.customer_mobile)}</td></tr>
      ${order.customer_address ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Address</td><td style="padding:6px 0">${esc(order.customer_address)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666">Order Time</td><td style="padding:6px 0">${esc(orderTime)}</td></tr>
      ${order.notes ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Notes</td><td style="padding:6px 0">${esc(order.notes)}</td></tr>` : ""}
    </table>

    <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
      <thead><tr>
        <th style="padding:8px;text-align:left;background:#fafafa">Product</th>
        <th style="padding:8px;text-align:center;background:#fafafa">Qty</th>
        <th style="padding:8px;text-align:right;background:#fafafa">Price</th>
        <th style="padding:8px;text-align:right;background:#fafafa">Total</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold">Total</td>
        <td style="padding:12px 8px;text-align:right;font-weight:bold">SAR ${Number(order.total || 0).toFixed(2)}</td>
      </tr></tfoot>
    </table>
  </div>`;
}

async function sendGmail(args: { to: string; subject: string; html: string }): Promise<{ ok: boolean; error?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    return { ok: false, error: "Gmail connector not configured" };
  }

  // RFC 2822 message
  const mime = [
    `From: shriah28@gmail.com`,
    `To: ${args.to}`,
    `Subject: ${encodeHeader(args.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    args.html,
  ].join("\r\n");

  const raw = b64urlEncodeString(mime);

  try {
    const r = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.warn("[gmail] send failed", r.status, txt.slice(0, 300));
      return { ok: false, error: `Gmail ${r.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}

function encodeHeader(s: string): string {
  // RFC 2047 encoded-word for any non-ASCII
  if (/^[\x20-\x7E]*$/.test(s)) return s;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}

function b64urlEncodeString(s: string): string {
  // Encode as UTF-8 then base64url
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function logSend(orderId: string | null, to: string, subject: string, result: { ok: boolean; error?: string }) {
  try {
    await supabaseAdmin.from("notification_email_log").insert({
      order_id: orderId,
      recipient_email: to,
      subject,
      status: result.ok ? "sent" : "failed",
      error: result.error || null,
    });
  } catch (e: any) {
    console.warn("[order-email] log insert failed:", e?.message || e);
  }
}
