// Sales Return Invoice — 80mm thermal variant.
// Renders a narrow (80mm ≈ 300px @ ~96dpi) receipt-style HTML and captures it.
import { toPng } from "html-to-image";
import type { SalesReturnInvoiceData } from "./types";
import { SALES_RETURN_INVOICE_COMPANY } from "./types";

const money = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(2);
const SAFE_FONT = 'Arial, Tahoma, "Segoe UI", sans-serif';

export async function buildSalesReturnInvoiceThermalPng(
  data: SalesReturnInvoiceData,
): Promise<{ blob: Blob; dataUrl: string; fileName: string; widthPx: number; heightPx: number }> {
  const c = SALES_RETURN_INVOICE_COMPANY;
  const widthPx = 380; // 80mm at ~120dpi for crisp print
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `position:fixed;left:-10000px;top:0;width:${widthPx}px;background:#fff;`;
  const node = document.createElement("div");
  node.style.cssText = `
    width:${widthPx}px;background:#fff;color:#000;font-family:${SAFE_FONT};
    font-size:12px;line-height:1.4;padding:14px 12px;box-sizing:border-box;
  `;

  const dt = new Date(data.timestamp ?? Date.now());
  const dtText = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const rows = data.items.map((it) => `
    <tr>
      <td style="padding:4px 0;vertical-align:top;">
        <div style="font-weight:700;">${esc(it.name)}</div>
        <div style="color:#666;font-size:10.5px;">${it.qty} × ${money(it.price)}${it.reason ? ` · ${esc(it.reason)}` : ""}</div>
      </td>
      <td style="padding:4px 0;text-align:right;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;">${money(it.amount)}</td>
    </tr>`).join("");

  node.innerHTML = `
    <div style="text-align:center;border-bottom:1px dashed #000;padding-bottom:8px;">
      <div style="font-size:15px;font-weight:800;">${esc(c.name)}</div>
      <div style="font-size:10.5px;color:#333;">${esc(c.address)}</div>
      <div style="font-size:10.5px;color:#333;">Tel: ${esc(c.phone)} · VAT: ${esc(c.vatNumber)}</div>
    </div>
    <div style="text-align:center;margin-top:8px;background:#000;color:#fff;padding:6px;border-radius:4px;">
      <div style="font-weight:800;letter-spacing:1px;">SALES RETURN INVOICE</div>
      <div style="font-size:10.5px;">فاتورة مرتجع مبيعات</div>
    </div>
    <div style="margin-top:8px;font-size:11px;">
      <div style="display:flex;justify-content:space-between;"><span>Return #</span><b>${esc(data.returnNumber)}</b></div>
      <div style="display:flex;justify-content:space-between;"><span>Orig. Invoice</span><b>${data.originalInvoiceNumber != null ? `INV-${data.originalInvoiceNumber}` : "—"}</b></div>
      <div style="display:flex;justify-content:space-between;"><span>Date</span><b>${dtText}</b></div>
    </div>
    <div style="border-top:1px dashed #000;margin-top:8px;padding-top:6px;font-size:11px;">
      <div><b>${esc(data.customerName || "Walk-in Customer")}</b></div>
      ${data.customerMobile ? `<div style="color:#333;">${esc(data.customerMobile)}</div>` : ""}
      ${data.customerVatNo ? `<div style="color:#333;">VAT: ${esc(data.customerVatNo)}</div>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;border-top:1px dashed #000;">
      <tbody>${rows || `<tr><td style="text-align:center;padding:8px;color:#666;">No items</td></tr>`}</tbody>
    </table>
    <div style="border-top:1px dashed #000;margin-top:6px;padding-top:6px;font-size:12px;">
      <div style="display:flex;justify-content:space-between;font-weight:800;background:#000;color:#fff;padding:4px 6px;border-radius:3px;">
        <span>Total Return</span><span>SAR ${money(data.totalReturnValue)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;">
        <span>Due Adjustment</span><b>SAR ${money(data.dueAdjustment)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span>Refund</span><b>SAR ${money(data.refundAmount)} (${data.refundType})</b>
      </div>
    </div>
    <div style="border-top:1px dashed #000;margin-top:8px;padding-top:6px;font-size:10.5px;">
      <div><b>Reason:</b> ${esc(data.reason || "—")}</div>
      <div><b>Processed by:</b> ${esc(data.processedBy || "—")}</div>
      ${data.notes ? `<div style="margin-top:2px;color:#333;">${esc(data.notes)}</div>` : ""}
    </div>
    <div style="text-align:center;margin-top:10px;font-weight:800;">Thank You · شكراً لكم</div>
    <div style="text-align:center;font-size:9.5px;color:#666;margin-top:4px;">ShRiAh ERP</div>
  `;

  wrapper.appendChild(node);
  document.body.appendChild(wrapper);
  try {
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 200)));
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: node.offsetHeight,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static" },
    } as any);
    const blob = await (await fetch(dataUrl)).blob();
    return { blob, dataUrl, fileName: `${data.returnNumber}-80mm.png`, widthPx, heightPx: node.offsetHeight };
  } finally {
    wrapper.remove();
  }
}

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
