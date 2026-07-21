// Invoice V2 — off-screen HTML builder for high-quality image / PDF capture.
// Bilingual EN + AR, Saudi tax-invoice style. Uses Google Fonts already
// loaded in __root.tsx (Cairo, Tajawal, Noto Sans Arabic).

import QRCode from "qrcode";
import { INVOICE_V2_COMPANY, type InvoiceV2Company, type InvoiceV2Data } from "./types";
import { toIsoTimestamp, zatcaV2TlvBase64 } from "./zatca-qr";

const money = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(2);

async function qrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 480,
    color: { dark: "#000000", light: "#ffffff" },
  });
}

// System-only font stack — no remote Google Fonts. html-to-image cannot
// inline cross-origin CSS (fonts.googleapis.com) and rejects with a
// SecurityError → [object Event]. Tahoma renders Arabic glyphs reliably
// across Windows / Android / iOS / macOS without any web font load.
const FONT_STACK = 'Arial, Tahoma, "Segoe UI", sans-serif';
const FONT_STACK_AR = 'Tahoma, Arial, sans-serif';

/**
 * Build the off-screen invoice node. Caller is responsible for appending it
 * to document.body BEFORE awaiting captures, and removing it afterwards.
 * Returns { node, qrPng } so PDF renderer can reuse the QR.
 */
export async function buildInvoiceV2Node(
  data: InvoiceV2Data,
  company: InvoiceV2Company = INVOICE_V2_COMPANY,
): Promise<{ node: HTMLDivElement; qrPng: string; widthPx: number; heightPx: number }> {
  const iso = toIsoTimestamp(data.timestamp);
  const qrPayload = zatcaV2TlvBase64({
    sellerName: company.name,
    vatNumber: company.vatNumber,
    isoTimestamp: iso,
    totalInclVat: money(data.total),
    vatAmount: money(data.vat),
  });
  const qrPng = await qrDataUrl(qrPayload);

  // A4 at 96dpi ≈ 794 × 1123 px. We use a fixed width and let height grow.
  const widthPx = 794;

  // IMPORTANT: the invoice node itself MUST be position:static. html-to-image
  // serialises the root node's computed style into a foreignObject and any
  // `position:fixed; left:-10000px` on the root would translate the rendered
  // content off-canvas → blank white PNG. The offscreen positioning is moved
  // to a wrapper that we attach to <body>; the invoice is a normal-flow child.
  const node = document.createElement("div");
  node.setAttribute("data-invoice-v2-root", "true");
  node.dir = "ltr";
  node.style.cssText = `
    position: static;
    width: ${widthPx}px;
    background: #ffffff;
    color: #0f172a;
    font-family: ${FONT_STACK};
    font-size: 13px;
    line-height: 1.5;
    box-sizing: border-box;
    padding: 36px 40px 28px;
    -webkit-font-smoothing: antialiased;
  `;

  const currentDue = Math.max(0, data.total - (data.paidAmount ?? 0));
  const prev = data.previousDue ?? 0;
  const newDue = data.newDue ?? prev + currentDue;
  const subtotal = data.subtotal - data.vat;

  const bilingual = (en: string, ar: string) =>
    `<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${en}</span>
       <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${ar}</span>
     </span>`;

  const itemsHtml = data.items
    .map((it, i) => {
      const rQty = Number(it.returnedQty ?? 0);
      const net = Math.max(0, it.qty - rQty);
      const nameCell = rQty > 0
        ? `${escapeHtml(it.name)}<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Returned: ${rQty} · Net Sold: ${net}</div>`
        : escapeHtml(it.name);
      return `
      <tr style="background:${i % 2 ? "#f8fafc" : "#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${i + 1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #eef2f7;text-align:left;font-weight:600;color:#0f172a;">${nameCell}</td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:64px;font-variant-numeric:tabular-nums;">${it.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #eef2f7;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${money(it.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #eef2f7;width:110px;font-weight:700;color:#0f172a;font-variant-numeric:tabular-nums;">${money(it.qty * it.price)}</td>
      </tr>`;
    })
    .join("");


  node.innerHTML = `
    <!-- HEADER -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:20px;border-bottom:3px solid #0f172a;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:72px;height:72px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:30px;color:#ffffff;overflow:hidden;box-shadow:0 2px 6px rgba(15,23,42,0.15);">
          ${company.logoDataUrl ? `<img src="${company.logoDataUrl}" style="width:100%;height:100%;object-fit:contain;" />` : escapeHtml(company.name.charAt(0).toUpperCase())}
        </div>
        <div>
          <div style="font-size:22px;font-weight:800;letter-spacing:-0.3px;color:#0f172a;">${escapeHtml(company.name)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:4px;line-height:1.55;">${escapeHtml(company.address)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">Phone · الجوال</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.phone)}</b>
          </div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">VAT · الرقم الضريبي</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.vatNumber)}</b>
            ${company.crNumber ? `&nbsp;&nbsp;<span style="color:#94a3b8;">CR · السجل</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.crNumber)}</b>` : ""}
          </div>
        </div>
      </div>
      <div style="text-align:right;min-width:220px;">
        <div style="font-size:22px;font-weight:800;color:#0f172a;letter-spacing:0.5px;">TAX INVOICE</div>
        <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:17px;font-weight:700;color:#475569;margin-top:2px;">فاتورة ضريبية</div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:6px;">
          ${infoChip("Invoice No", "رقم الفاتورة", String(data.invoiceNumber))}
          ${infoChip("Date", "التاريخ", data.date)}
          ${data.paymentMethod ? infoChip("Payment", "الدفع", data.paymentMethod) : ""}
        </div>
      </div>
    </div>

    <!-- TITLE BAND -->
    <div style="margin-top:18px;background:linear-gradient(90deg,#f1f5f9,#f8fafc);padding:10px 14px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid #e2e8f0;">
      <div style="font-weight:700;color:#0f172a;font-size:12.5px;letter-spacing:0.4px;text-transform:uppercase;">Simplified Tax Invoice</div>
      <div style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:700;color:#0f172a;font-size:13px;">فاتورة ضريبية مبسطة</div>
    </div>

    <!-- CUSTOMER -->
    <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fafbfc;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">BILL TO</div>
        <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:11px;font-weight:600;color:#94a3b8;">إلى العميل</div>
      </div>
      <div style="font-size:17px;font-weight:700;margin-top:6px;color:#0f172a;letter-spacing:-0.2px;">${escapeHtml(data.customerName || "Walk-in Customer")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:22px;margin-top:8px;font-size:11.5px;">
        ${data.customerMobile ? `<div><span style="color:#94a3b8;">Mobile · الجوال</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(data.customerMobile)}</b></div>` : ""}
        <div><span style="color:#94a3b8;">Cust. VAT No · الرقم الضريبي للعميل</span> &nbsp;<b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(data.customerVatNo || "N/A")}</b></div>
      </div>
    </div>

    <!-- ITEMS -->
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:18px;font-size:12.5px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#0f172a;color:#ffffff;">
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;letter-spacing:0.4px;">#</th>
          <th style="padding:11px 10px;text-align:left;font-weight:700;font-size:11px;letter-spacing:0.4px;">${bilingualHeader("PRODUCT", "المنتج")}</th>
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;letter-spacing:0.4px;">${bilingualHeader("QTY", "الكمية")}</th>
          <th style="padding:11px 8px;text-align:right;font-weight:700;font-size:11px;letter-spacing:0.4px;">${bilingualHeader("RATE", "السعر")}</th>
          <th style="padding:11px 10px;text-align:right;font-weight:700;font-size:11px;letter-spacing:0.4px;">${bilingualHeader("AMOUNT", "الإجمالي")}</th>
        </tr>
      </thead>
      <tbody>${itemsHtml || `<tr><td colspan="5" style="padding:18px;text-align:center;color:#94a3b8;">No items</td></tr>`}</tbody>
    </table>

    <!-- SUMMARY -->
    <div style="display:flex;justify-content:flex-end;margin-top:18px;">
      <table style="width:360px;border-collapse:separate;border-spacing:0;font-size:12.5px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#ffffff;">
        <tbody>
          ${summaryRow(bilingual("Subtotal", "المجموع الفرعي"), `SAR ${money(subtotal)}`)}
          ${summaryRow(bilingual("VAT (15%)", "ضريبة القيمة المضافة"), `SAR ${money(data.vat)}`)}
          ${summaryRow(bilingual("Grand Total", "الإجمالي"), `SAR ${money(data.total)}`, "grand")}
          ${prev !== 0 ? summaryRow(bilingual("Previous Due", "الرصيد السابق"), `SAR ${money(prev)}`, "muted") : ""}
          ${data.paidAmount != null ? summaryRow(bilingual("Paid", "المدفوع"), `SAR ${money(data.paidAmount)}`, "muted") : ""}
          ${summaryRow(bilingual("Current Invoice Due", "مستحق الفاتورة الحالية"), `SAR ${money(currentDue)}`, "muted")}
          ${summaryRow(bilingual("New Due", "الرصيد الجديد"), `SAR ${money(newDue)}`, "due")}
        </tbody>
      </table>
    </div>

    <!-- QR + FOOTER -->
    <div style="margin-top:24px;display:flex;justify-content:space-between;align-items:stretch;border-top:1px solid #e5e7eb;padding-top:20px;gap:20px;">
      <div style="display:flex;flex-direction:column;align-items:center;border:1px solid #e5e7eb;border-radius:10px;padding:10px;background:#ffffff;">
        <img src="${qrPng}" style="width:130px;height:130px;display:block;" />
        <div style="font-size:9.5px;color:#64748b;margin-top:6px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">ZATCA Phase 2 QR</div>
      </div>
      <div style="flex:1;text-align:center;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:22px;font-weight:800;color:#047857;letter-spacing:-0.3px;">Thank You</div>
        <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:20px;font-weight:800;color:#047857;margin-top:2px;">شكراً لكم</div>
        <div style="margin-top:10px;display:flex;justify-content:center;gap:18px;font-size:11.5px;color:#475569;">
          ${company.whatsapp ? `<div>💬 <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.whatsapp)}</b></div>` : ""}
          <div>📞 <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.phone)}</b></div>
        </div>
      </div>
      <div style="text-align:right;font-size:9.5px;color:#94a3b8;display:flex;flex-direction:column;justify-content:flex-end;max-width:120px;">
        <div>Generated by</div>
        <div style="font-weight:700;color:#64748b;font-size:11px;margin-top:2px;letter-spacing:0.3px;">ShRiAh ERP</div>
      </div>
    </div>
  `;


  // Offscreen but visible wrapper. The wrapper is position:fixed left:-10000px
  // so the user does not see it; the invoice node inside stays position:static
  // so html-to-image captures it at (0,0) and the cloned root is not translated
  // off-canvas.
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-invoice-v2-wrapper", "true");
  wrapper.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: ${widthPx}px;
    background: #ffffff;
    opacity: 1;
    visibility: visible;
    z-index: 0;
    pointer-events: none;
  `;
  wrapper.appendChild(node);
  document.body.appendChild(wrapper);
  (node as any).__wrapper = wrapper;

  // Wait for layout + fonts. 300ms is enough for system fonts + QR <img> decode.
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 300)));
  try {
    const f: any = (document as any).fonts;
    if (f?.ready) await f.ready;
  } catch {}

  const heightPx = node.offsetHeight;
  return { node, qrPng, widthPx, heightPx };
}

function bilingualHeader(en: string, ar: string) {
  return `<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${en}</span>
    <span style="font-family:${FONT_STACK_AR};direction:rtl;font-size:10px;font-weight:600;opacity:0.75;margin-top:1px;">${ar}</span>
  </div>`;
}

function infoChip(en: string, ar: string, value: string) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:5px 10px;">
    <span style="font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">
      ${en} <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;">· ${ar}</span>
    </span>
    <b style="font-size:12px;color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(value)}</b>
  </div>`;
}

function summaryRow(label: string, value: string, kind?: "grand" | "due" | "muted") {
  let bg = "#ffffff";
  let color = "#0f172a";
  let weight = 500;
  let fontSize = 12.5;
  let borderTop = "1px solid #f1f5f9";
  if (kind === "grand") { bg = "#0f172a"; color = "#ffffff"; weight = 800; fontSize = 14; borderTop = "none"; }
  else if (kind === "due") { bg = "#fef2f2"; color = "#b91c1c"; weight = 800; fontSize = 14; borderTop = "1px solid #fecaca"; }
  else if (kind === "muted") { color = "#64748b"; }
  return `<tr style="background:${bg};color:${color};">
    <td style="padding:9px 12px;font-weight:${weight};font-size:${fontSize}px;border-top:${borderTop};">${label}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${weight};font-size:${fontSize}px;border-top:${borderTop};font-variant-numeric:tabular-nums;">${value}</td>
  </tr>`;
}


function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
