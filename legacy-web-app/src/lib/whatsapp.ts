// Lightweight WhatsApp helper — builds wa.me links without external deps.

export type OrderLine = {
  name: string;
  qty: number;
  price: number;
};

export function normalizeMobile(input: string): string {
  // strip non-digits; if local SA-style (starts with 0), prefix with country code 966
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "966" + digits.slice(1);
  return digits;
}

export function buildOrderMessage(opts: {
  customerName: string;
  customerMobile: string;
  items: OrderLine[];
  total: number;
  orderNumber?: number | string;
  status?: string;
  currency?: string;
}): string {
  const c = opts.currency ?? "SAR";
  const lines: string[] = [];
  lines.push("🛒 *New Order*");
  if (opts.orderNumber != null) lines.push(`Order #: ${opts.orderNumber}`);
  lines.push(`Customer: ${opts.customerName}`);
  lines.push(`Mobile: ${opts.customerMobile}`);
  lines.push("");
  lines.push("*Items:*");
  for (const it of opts.items) {
    lines.push(`• ${it.name} × ${it.qty} = ${c} ${(it.qty * it.price).toFixed(2)}`);
  }
  lines.push("");
  lines.push(`*Total:* ${c} ${opts.total.toFixed(2)}`);
  if (opts.status) lines.push(`Status: ${opts.status}`);
  return lines.join("\n");
}

export function whatsappLink(mobile: string, message: string): string {
  const m = normalizeMobile(mobile);
  return `https://wa.me/${m}?text=${encodeURIComponent(message)}`;
}
