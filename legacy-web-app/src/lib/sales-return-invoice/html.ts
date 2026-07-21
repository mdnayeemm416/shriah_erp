// Sales Return Invoice — off-screen HTML builder.
// Visually distinct from Sales Invoice (RED "SALES RETURN INVOICE" band).
// Reuses the same system-font pipeline as Invoice V2 so html-to-image works.

import { SALES_RETURN_INVOICE_COMPANY, type InvoiceV2Company, type SalesReturnInvoiceData } from "./types";

const money = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(2);
const FONT_STACK = 'Arial, Tahoma, "Segoe UI", sans-serif';
const FONT_STACK_AR = 'Tahoma, Arial, sans-serif';

const REFUND_LABEL: Record<string, string> = {
  cash: "Cash Refund",
  credit: "Customer Credit",
  due_reduction: "Due Adjustment",
};

export async function buildSalesReturnInvoiceNode(
  data: SalesReturnInvoiceData,
  company: InvoiceV2Company = SALES_RETURN_INVOICE_COMPANY,
): Promise<{ node: HTMLDivElement; widthPx: number; heightPx: number }> {
  const widthPx = 794;
  const node = document.createElement("div");
  node.setAttribute("data-sales-return-invoice-root", "true");
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

  const bilingual = (en: string, ar: string) =>
    `<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${en}</span>
       <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${ar}</span>
     </span>`;

  const itemsHtml = data.items
    .map((it, i) => `
      <tr style="background:${i % 2 ? "#fff5f5" : "#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${i + 1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #fee2e2;text-align:left;font-weight:600;color:#0f172a;">
          ${escapeHtml(it.name)}
          ${it.reason ? `<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Reason: ${escapeHtml(it.reason)}</div>` : ""}
        </td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:64px;font-variant-numeric:tabular-nums;color:#b91c1c;font-weight:700;">${it.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #fee2e2;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${money(it.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #fee2e2;width:110px;font-weight:700;color:#b91c1c;font-variant-numeric:tabular-nums;">${money(it.amount)}</td>
      </tr>`)
    .join("");

  const dt = new Date(data.timestamp ?? Date.now());
  const dtText = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  node.innerHTML = `
    <!-- HEADER (company) -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:24px;padding-bottom:18px;border-bottom:2px solid #0f172a;">
      <div style="display:flex;gap:14px;align-items:flex-start;">
        <div style="width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px;color:#fff;overflow:hidden;">
          ${company.logoDataUrl ? `<img src="${company.logoDataUrl}" style="width:100%;height:100%;object-fit:contain;" />` : escapeHtml(company.name.charAt(0).toUpperCase())}
        </div>
        <div>
          <div style="font-size:22px;font-weight:800;color:#0f172a;">${escapeHtml(company.name)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:3px;">${escapeHtml(company.address)}</div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">Phone · الجوال</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.phone)}</b>
          </div>
          <div style="color:#64748b;font-size:11.5px;margin-top:2px;">
            <span style="color:#94a3b8;">VAT · الرقم الضريبي</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(company.vatNumber)}</b>
          </div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="display:inline-block;background:#b91c1c;color:#fff;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:1px;">RETURN</div>
        <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:12px;font-weight:700;color:#b91c1c;margin-top:6px;">مرتجع مبيعات</div>
      </div>
    </div>

    <!-- BIG TITLE BAND -->
    <div style="margin-top:16px;background:#b91c1c;color:#ffffff;padding:14px 18px;border-radius:10px;text-align:center;">
      <div style="font-size:24px;font-weight:800;letter-spacing:1px;">SALES RETURN INVOICE</div>
      <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:16px;font-weight:700;margin-top:2px;opacity:0.95;">فاتورة مرتجع مبيعات</div>
    </div>

    <!-- REFERENCE STRIP -->
    <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
      ${refChip("Return No", "رقم المرتجع", data.returnNumber, true)}
      ${refChip("Original Invoice", "الفاتورة الأصلية", data.originalInvoiceNumber != null ? `INV-${data.originalInvoiceNumber}` : "—")}
      ${refChip("Return Date", "تاريخ المرتجع", dtText)}
    </div>

    <!-- CUSTOMER -->
    <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;background:#fafbfc;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">CUSTOMER</div>
        <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:11px;font-weight:600;color:#94a3b8;">العميل</div>
      </div>
      <div style="font-size:17px;font-weight:700;margin-top:6px;color:#0f172a;">${escapeHtml(data.customerName || "Walk-in Customer")}</div>
      <div style="display:flex;flex-wrap:wrap;gap:22px;margin-top:6px;font-size:11.5px;">
        ${data.customerMobile ? `<div><span style="color:#94a3b8;">Mobile · الجوال</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(data.customerMobile)}</b></div>` : ""}
        <div><span style="color:#94a3b8;">VAT No · الرقم الضريبي</span> <b style="color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(data.customerVatNo || "N/A")}</b></div>
      </div>
    </div>

    <!-- ITEMS -->
    <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:18px;font-size:12.5px;border:1px solid #fecaca;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#7f1d1d;color:#ffffff;">
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;">#</th>
          <th style="padding:11px 10px;text-align:left;font-weight:700;font-size:11px;">${bilingualHeader("PRODUCT", "المنتج")}</th>
          <th style="padding:11px 8px;text-align:center;font-weight:700;font-size:11px;">${bilingualHeader("RET QTY", "الكمية المرتجعة")}</th>
          <th style="padding:11px 8px;text-align:right;font-weight:700;font-size:11px;">${bilingualHeader("UNIT PRICE", "السعر")}</th>
          <th style="padding:11px 10px;text-align:right;font-weight:700;font-size:11px;">${bilingualHeader("RETURN AMT", "قيمة المرتجع")}</th>
        </tr>
      </thead>
      <tbody>${itemsHtml || `<tr><td colspan="5" style="padding:18px;text-align:center;color:#94a3b8;">No items</td></tr>`}</tbody>
    </table>

    <!-- SUMMARY -->
    <div style="display:flex;justify-content:flex-end;margin-top:18px;">
      <table style="width:380px;border-collapse:separate;border-spacing:0;font-size:12.5px;border:1px solid #fecaca;border-radius:10px;overflow:hidden;background:#ffffff;">
        <tbody>
          ${summaryRow(bilingual("Total Return Value", "إجمالي قيمة المرتجع"), `SAR ${money(data.totalReturnValue)}`, "grand")}
          ${summaryRow(bilingual("Due Adjustment", "تسوية المستحقات"), `SAR ${money(data.dueAdjustment)}`, "muted")}
          ${summaryRow(bilingual("Refund Amount", "المبلغ المسترد"), `SAR ${money(data.refundAmount)}`, data.refundAmount > 0 ? "refund" : "muted")}
          ${summaryRow(bilingual("Refund Method", "طريقة الاسترداد"), REFUND_LABEL[data.refundType] ?? data.refundType, "muted")}
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div style="margin-top:22px;border-top:1px dashed #cbd5e1;padding-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.6px;">Return Reason · سبب الإرجاع</div>
        <div style="font-size:13px;font-weight:600;color:#7c2d12;margin-top:4px;">${escapeHtml(data.reason || "—")}</div>
        ${data.notes ? `<div style="font-size:11px;color:#78350f;margin-top:6px;">${escapeHtml(data.notes)}</div>` : ""}
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">
        <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Processed By · بواسطة</div>
        <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:4px;">${escapeHtml(data.processedBy || "—")}</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:6px;">${dtText}</div>
      </div>
    </div>

    <div style="text-align:center;margin-top:22px;">
      <div style="font-size:20px;font-weight:800;color:#0f766e;letter-spacing:-0.3px;">Thank You</div>
      <div style="font-family:${FONT_STACK_AR};direction:rtl;font-size:18px;font-weight:800;color:#0f766e;margin-top:2px;">شكراً لكم</div>
      <div style="font-size:11px;color:#64748b;margin-top:6px;">This is an official Sales Return document.</div>
    </div>

    <div style="text-align:right;font-size:9.5px;color:#94a3b8;margin-top:12px;">
      Generated by <b style="color:#64748b;">ShRiAh ERP</b>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-sales-return-invoice-wrapper", "true");
  wrapper.style.cssText = `
    position: fixed; left: -10000px; top: 0; width: ${widthPx}px;
    background: #ffffff; opacity: 1; visibility: visible; z-index: 0; pointer-events: none;
  `;
  wrapper.appendChild(node);
  document.body.appendChild(wrapper);
  (node as any).__wrapper = wrapper;

  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 300)));
  try { const f: any = (document as any).fonts; if (f?.ready) await f.ready; } catch {}

  return { node, widthPx, heightPx: node.offsetHeight };
}

function bilingualHeader(en: string, ar: string) {
  return `<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${en}</span>
    <span style="font-family:${FONT_STACK_AR};direction:rtl;font-size:10px;font-weight:600;opacity:0.8;margin-top:1px;">${ar}</span>
  </div>`;
}

function refChip(en: string, ar: string, value: string, highlight = false) {
  return `<div style="border:1px solid ${highlight ? "#fecaca" : "#e2e8f0"};background:${highlight ? "#fef2f2" : "#f8fafc"};border-radius:8px;padding:8px 12px;">
    <div style="font-size:9.5px;color:${highlight ? "#b91c1c" : "#94a3b8"};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
      ${en} <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;">· ${ar}</span>
    </div>
    <div style="font-size:14px;font-weight:800;color:${highlight ? "#7f1d1d" : "#0f172a"};margin-top:2px;font-variant-numeric:tabular-nums;">${escapeHtml(value)}</div>
  </div>`;
}

function summaryRow(label: string, value: string, kind?: "grand" | "refund" | "muted") {
  let bg = "#ffffff", color = "#0f172a", weight = 500, size = 12.5;
  let borderTop = "1px solid #fef2f2";
  if (kind === "grand") { bg = "#b91c1c"; color = "#ffffff"; weight = 800; size = 14; borderTop = "none"; }
  else if (kind === "refund") { bg = "#fff7ed"; color = "#c2410c"; weight = 800; size = 14; borderTop = "1px solid #fed7aa"; }
  else if (kind === "muted") { color = "#64748b"; }
  return `<tr style="background:${bg};color:${color};">
    <td style="padding:9px 12px;font-weight:${weight};font-size:${size}px;border-top:${borderTop};">${label}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${weight};font-size:${size}px;border-top:${borderTop};font-variant-numeric:tabular-nums;">${value}</td>
  </tr>`;
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
