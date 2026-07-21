// Fire-and-forget audit email trigger. Called from the client immediately
// after a successful mutation. Uses `keepalive` so the request survives page
// navigation. Failures are swallowed — email delivery must never block the
// underlying transaction.

export type AuditAction = "created" | "edited" | "deleted";

// Canonical module names. The Email Notifications settings UI shows a toggle
// per module and stores { [module]: boolean } in notification_recipients.event_flags.
export const AUDIT_MODULES = [
  "Shop Sale",
  "Shop Purchase",
  "Shop Expense",
  "Shop Withdraw",
  "Wholesale Sale",
  "Wholesale Purchase",
  "Sales Return",
  "Employee Transaction",
  "Company Transaction",
  "Customer Order Received",
  "Employee Wallet",
  "Other",
] as const;
export type AuditModule = typeof AUDIT_MODULES[number];

export interface AuditEmailPayload {
  action: AuditAction;
  module: AuditModule | string;
  shopName?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  recordId?: string | number | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  notes?: string | null;
  amount?: number | null;
  eventTime?: string | null;
}

export function sendAuditEmail(payload: AuditEmailPayload): void {
  try {
    const body = JSON.stringify({
      ...payload,
      recordId: payload.recordId != null ? String(payload.recordId) : null,
      eventTime: payload.eventTime || new Date().toISOString(),
    });
    // Fire-and-forget. Do not await — must never block the caller.
    fetch("/api/public/send-audit-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch((e) => console.warn("[audit-email] request failed:", e?.message || e));
  } catch (e: any) {
    console.warn("[audit-email] payload build failed:", e?.message || e);
  }
}
