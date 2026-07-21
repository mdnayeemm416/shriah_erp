// Sends audit notification emails to every active recipient whose per-event
// flag for the given module is not disabled. Public endpoint (fire-and-forget
// from the client right after a successful mutation). Failures are logged
// and never propagate back to the caller — email delivery must never block
// the underlying transaction.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

type AuditPayload = {
  action: "created" | "edited" | "deleted";
  module: string;
  shopName?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  recordId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  notes?: string | null;
  amount?: number | null;
  eventTime?: string | null;
};

export const Route = createFileRoute("/api/public/send-audit-email")({
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
        const cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
        try {
          const p = (await request.json().catch(() => ({}))) as AuditPayload;
          const action = String(p.action || "").toLowerCase();
          const module = String(p.module || "").trim();
          if (!["created", "edited", "deleted"].includes(action) || !module) {
            return json({ error: "Invalid payload" }, 400, cors);
          }

          const { data: recipients } = await supabaseAdmin
            .from("notification_recipients")
            .select("email, event_flags")
            .eq("is_active", true);

          const list = (recipients || [])
            .filter((r: any) => {
              const flags = (r.event_flags || {}) as Record<string, boolean>;
              return flags[module] !== false; // default ON
            })
            .map((r: any) => String(r.email))
            .filter(isValidEmail);

          if (list.length === 0) return json({ sent: 0, reason: "no recipients" }, 200, cors);

          // Module-specific enrichment: resolve FK ids to labels, sign attachment
          // URLs, and surface a dedicated attachment preview block.
          const extras: { attachmentUrl?: string | null } = {};
          if (module === "Employee Wallet") {
            await enrichEmployeeWallet(p, extras);
          }

          const subject = buildSubject(action, module, p);
          const html = renderAuditHtml(action, module, p, extras);

          let sent = 0;
          await Promise.all(
            list.map(async (to) => {
              const result = await sendGmail({ to, subject, html });
              if (result.ok) sent++;
              await logSend(to, subject, action, module, p, result);
            }),
          );
          return json({ sent, total: list.length }, 200, cors);
        } catch (e: any) {
          console.error("[audit-email] handler failed:", e?.message || e);
          return json({ error: "send failed" }, 500, cors);
        }
      },
    },
  },
});

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers });
}
function isValidEmail(s: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function buildSubject(action: string, module: string, p: AuditPayload) {
  const verb = action === "created" ? "New" : action === "edited" ? "Edited" : "Deleted";
  const amt = p.amount != null ? ` — SAR ${Number(p.amount).toFixed(2)}` : "";
  return `[Audit] ${verb} ${module}${amt}${p.shopName ? ` · ${p.shopName}` : ""}`;
}

function badgeColor(action: string) {
  if (action === "created") return "#16a34a";
  if (action === "edited") return "#2563eb";
  return "#dc2626";
}

function renderRows(obj: Record<string, unknown> | null | undefined) {
  if (!obj || typeof obj !== "object") return `<tr><td colspan="2" style="padding:8px;color:#888;font-style:italic">—</td></tr>`;
  const entries = Object.entries(obj);
  if (entries.length === 0) return `<tr><td colspan="2" style="padding:8px;color:#888;font-style:italic">—</td></tr>`;
  return entries.map(([k, v]) => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#555;width:40%">${esc(k)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee"><b>${esc(formatVal(v))}</b></td>
    </tr>`).join("");
}
function formatVal(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function renderDiff(oldV: Record<string, unknown> | null | undefined, newV: Record<string, unknown> | null | undefined) {
  const keys = Array.from(new Set([...Object.keys(oldV || {}), ...Object.keys(newV || {})]));
  if (keys.length === 0) return `<tr><td colspan="3" style="padding:8px;color:#888;font-style:italic">No field changes recorded</td></tr>`;
  return keys.map((k) => {
    const a = (oldV as any)?.[k]; const b = (newV as any)?.[k];
    const changed = JSON.stringify(a) !== JSON.stringify(b);
    return `<tr style="${changed ? "background:#fff8e1" : ""}">
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#555">${esc(k)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#b91c1c">${esc(formatVal(a))}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#166534"><b>${esc(formatVal(b))}</b></td>
    </tr>`;
  }).join("");
}

function formatSaudiTime(input?: string | null): string {
  const d = input ? new Date(input) : new Date();
  if (isNaN(d.getTime())) return String(input ?? "");
  // Asia/Riyadh = UTC+3, no DST.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).formatToParts(d);
  const g = (t: string) => parts.find((p) => p.type === t)?.value || "";
  const ampm = (g("dayPeriod") || "").toUpperCase();
  return `${g("day")}/${g("month")}/${g("year")}, ${g("hour")}:${g("minute")} ${ampm}`;
}

async function enrichEmployeeWallet(
  p: AuditPayload,
  extras: { attachmentUrl?: string | null },
): Promise<void> {
  const bag = { ...(p.newValues || {}), ...(p.oldValues || {}) } as Record<string, any>;

  // Resolve employee_id → Employee Name
  const empId = bag.employee_id || bag.employeeId;
  if (empId) {
    try {
      const { data } = await supabaseAdmin
        .from("employees").select("name").eq("id", String(empId)).maybeSingle();
      const name = (data as any)?.name;
      if (name) {
        for (const v of [p.newValues, p.oldValues]) {
          if (v && typeof v === "object" && "employee_id" in v) {
            (v as any)["Employee"] = name;
            delete (v as any).employee_id;
          }
        }
      }
    } catch (e: any) {
      console.warn("[audit-email] employee lookup failed:", e?.message || e);
    }
  }

  // Sign attachment_url and remove raw url from rendered rows.
  const rawUrl = (p.newValues as any)?.attachment_url ?? (p.oldValues as any)?.attachment_url;
  if (rawUrl) {
    const signed = await signAttachmentUrl(String(rawUrl));
    extras.attachmentUrl = signed || String(rawUrl);
    for (const v of [p.newValues, p.oldValues]) {
      if (v && typeof v === "object" && "attachment_url" in v) delete (v as any).attachment_url;
    }
  }
}

async function signAttachmentUrl(input: string): Promise<string | null> {
  try {
    const bucket = "attachments";
    let path: string | null = null;
    const marker = `/object/public/${bucket}/`;
    const signMarker = `/object/sign/${bucket}/`;
    const i = input.indexOf(marker);
    const j = input.indexOf(signMarker);
    if (i >= 0) path = decodeURIComponent(input.slice(i + marker.length));
    else if (j >= 0) path = decodeURIComponent(input.slice(j + signMarker.length).split("?")[0]);
    else if (!input.startsWith("http")) path = input;
    if (!path) return null;
    const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    return data?.signedUrl || null;
  } catch (e: any) {
    console.warn("[audit-email] sign url failed:", e?.message || e);
    return null;
  }
}

function renderAttachmentBlock(url?: string | null): string {
  if (!url) return "";
  const safe = esc(url);
  return `
    <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Attachment</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;text-align:center;background:#fafafa">
      <a href="${safe}" target="_blank" style="text-decoration:none">
        <img src="${safe}" alt="Receipt" style="max-width:100%;max-height:360px;border-radius:6px;display:block;margin:0 auto 12px" />
      </a>
      <a href="${safe}" target="_blank"
         style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;
                text-decoration:none;border-radius:6px;font-weight:600;font-size:13px">
        View Receipt
      </a>
    </div>`;
}

function renderAuditHtml(action: string, module: string, p: AuditPayload, extras: { attachmentUrl?: string | null } = {}) {
  const time = formatSaudiTime(p.eventTime);
  const badge = `<span style="display:inline-block;padding:4px 10px;border-radius:12px;background:${badgeColor(action)};color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">${esc(action)}</span>`;

  const metaTable = `
    <table style="width:100%;border-collapse:collapse;margin:12px 0 20px">
      <tr><td style="padding:6px 0;color:#666;width:35%">Module</td><td style="padding:6px 0"><b>${esc(module)}</b></td></tr>
      ${p.shopName ? `<tr><td style="padding:6px 0;color:#666">Shop</td><td style="padding:6px 0">${esc(p.shopName)}</td></tr>` : ""}
      ${p.userName || p.userEmail ? `<tr><td style="padding:6px 0;color:#666">User</td><td style="padding:6px 0">${esc(p.userName || p.userEmail)}</td></tr>` : ""}
      ${p.recordId ? `<tr><td style="padding:6px 0;color:#666">Record ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px">${esc(p.recordId)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666">Timestamp</td><td style="padding:6px 0">${esc(time)}</td></tr>
      ${p.notes ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Notes</td><td style="padding:6px 0">${esc(p.notes)}</td></tr>` : ""}
    </table>`;

  let body = "";
  if (action === "edited") {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Changes</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <thead><tr>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px">Field</th>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px;color:#b91c1c">Before</th>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px;color:#166534">After</th>
        </tr></thead>
        <tbody>${renderDiff(p.oldValues, p.newValues)}</tbody>
      </table>`;
  } else if (action === "deleted") {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Deleted Record</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <tbody>${renderRows(p.oldValues || p.newValues)}</tbody>
      </table>`;
  } else {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Record Details</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <tbody>${renderRows(p.newValues)}</tbody>
      </table>`;
  }

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;margin:0 auto;color:#111;padding:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;padding-bottom:12px">
      <div>
        <div style="font-size:18px;font-weight:700">Shriah Group ERP</div>
        <div style="color:#666;font-size:12px">Audit Notification</div>
      </div>
      ${badge}
    </div>
    ${metaTable}
    ${body}
    ${renderAttachmentBlock(extras.attachmentUrl)}
    <div style="margin-top:24px;padding-top:12px;border-top:1px solid #eee;color:#888;font-size:11px;text-align:center">
      This is an automated audit notification. Please do not reply.
    </div>
  </div>`;
}

async function sendGmail(args: { to: string; subject: string; html: string }): Promise<{ ok: boolean; error?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) return { ok: false, error: "Gmail connector not configured" };

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
      return { ok: false, error: `Gmail ${r.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}

function encodeHeader(s: string) {
  if (/^[\x20-\x7E]*$/.test(s)) return s;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}
function b64urlEncodeString(s: string) {
  const bytes = new TextEncoder().encode(s);
  let bin = ""; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function logSend(
  to: string, subject: string, action: string, module: string,
  p: AuditPayload, result: { ok: boolean; error?: string },
) {
  try {
    await supabaseAdmin.from("notification_email_log").insert({
      recipient_email: to,
      subject,
      status: result.ok ? "sent" : "failed",
      error: result.error || null,
      event_type: `${module}:${action}`,
      module,
      action,
      record_id: p.recordId || null,
      payload: { shopName: p.shopName, userName: p.userName, amount: p.amount, notes: p.notes },
    } as any);
  } catch (e: any) {
    console.warn("[audit-email] log insert failed:", e?.message || e);
  }
}
