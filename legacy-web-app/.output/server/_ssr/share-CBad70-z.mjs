import { t as toast } from "../_libs/sonner.mjs";
import { toPng } from "../_libs/html-to-image.mjs";
import { I as INVOICE_V2_COMPANY } from "./types-u21zQmgs.mjs";
import E from "../_libs/jspdf.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
const SALES_RETURN_INVOICE_COMPANY = INVOICE_V2_COMPANY;
const money$1 = (n) => (Number.isFinite(n) ? n : 0).toFixed(2);
const FONT_STACK = 'Arial, Tahoma, "Segoe UI", sans-serif';
const FONT_STACK_AR = "Tahoma, Arial, sans-serif";
const REFUND_LABEL = {
  cash: "Cash Refund",
  credit: "Customer Credit",
  due_reduction: "Due Adjustment"
};
async function buildSalesReturnInvoiceNode(data, company = SALES_RETURN_INVOICE_COMPANY) {
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
  const bilingual = (en, ar) => `<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${en}</span>
       <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${ar}</span>
     </span>`;
  const itemsHtml = data.items.map((it, i) => `
      <tr style="background:${i % 2 ? "#fff5f5" : "#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${i + 1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #fee2e2;text-align:left;font-weight:600;color:#0f172a;">
          ${escapeHtml(it.name)}
          ${it.reason ? `<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Reason: ${escapeHtml(it.reason)}</div>` : ""}
        </td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #fee2e2;width:64px;font-variant-numeric:tabular-nums;color:#b91c1c;font-weight:700;">${it.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #fee2e2;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${money$1(it.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #fee2e2;width:110px;font-weight:700;color:#b91c1c;font-variant-numeric:tabular-nums;">${money$1(it.amount)}</td>
      </tr>`).join("");
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
          ${summaryRow(bilingual("Total Return Value", "إجمالي قيمة المرتجع"), `SAR ${money$1(data.totalReturnValue)}`, "grand")}
          ${summaryRow(bilingual("Due Adjustment", "تسوية المستحقات"), `SAR ${money$1(data.dueAdjustment)}`, "muted")}
          ${summaryRow(bilingual("Refund Amount", "المبلغ المسترد"), `SAR ${money$1(data.refundAmount)}`, data.refundAmount > 0 ? "refund" : "muted")}
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
  node.__wrapper = wrapper;
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 300)));
  try {
    const f = document.fonts;
    if (f?.ready) await f.ready;
  } catch {
  }
  return { node, widthPx, heightPx: node.offsetHeight };
}
function bilingualHeader(en, ar) {
  return `<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${en}</span>
    <span style="font-family:${FONT_STACK_AR};direction:rtl;font-size:10px;font-weight:600;opacity:0.8;margin-top:1px;">${ar}</span>
  </div>`;
}
function refChip(en, ar, value, highlight = false) {
  return `<div style="border:1px solid ${highlight ? "#fecaca" : "#e2e8f0"};background:${highlight ? "#fef2f2" : "#f8fafc"};border-radius:8px;padding:8px 12px;">
    <div style="font-size:9.5px;color:${highlight ? "#b91c1c" : "#94a3b8"};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
      ${en} <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;">· ${ar}</span>
    </div>
    <div style="font-size:14px;font-weight:800;color:${highlight ? "#7f1d1d" : "#0f172a"};margin-top:2px;font-variant-numeric:tabular-nums;">${escapeHtml(value)}</div>
  </div>`;
}
function summaryRow(label, value, kind) {
  let bg = "#ffffff", color = "#0f172a", weight = 500, size = 12.5;
  let borderTop = "1px solid #fef2f2";
  if (kind === "grand") {
    bg = "#b91c1c";
    color = "#ffffff";
    weight = 800;
    size = 14;
    borderTop = "none";
  } else if (kind === "refund") {
    bg = "#fff7ed";
    color = "#c2410c";
    weight = 800;
    size = 14;
    borderTop = "1px solid #fed7aa";
  } else if (kind === "muted") {
    color = "#64748b";
  }
  return `<tr style="background:${bg};color:${color};">
    <td style="padding:9px 12px;font-weight:${weight};font-size:${size}px;border-top:${borderTop};">${label}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${weight};font-size:${size}px;border-top:${borderTop};font-variant-numeric:tabular-nums;">${value}</td>
  </tr>`;
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const SAFE_FONT$1 = 'Arial, Tahoma, "Segoe UI", sans-serif';
const REMOTE_FONT_RE = /(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;
function sanitize(root) {
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_FONT_RE.test(el.textContent || "")) el.remove();
  });
  root.querySelectorAll("*").forEach((el) => {
    const ff = el.style.fontFamily;
    if (!ff || REMOTE_FONT_RE.test(ff)) el.style.fontFamily = SAFE_FONT$1;
  });
  root.style.fontFamily = SAFE_FONT$1;
}
function formatError(e) {
  if (e instanceof Error) return e.message;
  if (e instanceof Event) {
    const t = e.target;
    return `Resource load failed (${e.type}${t?.src ? `: ${t.src}` : ""})`;
  }
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
async function buildSalesReturnInvoicePng(data) {
  const { node, widthPx } = await buildSalesReturnInvoiceNode(data);
  const wrapper = node.__wrapper;
  try {
    sanitize(node);
    if (node.childElementCount === 0 || node.offsetWidth === 0 || node.offsetHeight === 0) {
      throw new Error(`Return invoice DOM empty (w=${node.offsetWidth} h=${node.offsetHeight})`);
    }
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: node.offsetHeight,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT$1, position: "static", left: "0", top: "0" },
      filter: (n) => {
        const tag = n.tagName;
        return !(tag === "LINK" || tag === "STYLE");
      }
    });
    const blob = await (await fetch(dataUrl)).blob();
    const fileName = `${data.returnNumber}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx: node.offsetHeight };
  } catch (e) {
    throw new Error(`Return PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 6;
async function buildSalesReturnInvoicePdf(data) {
  const { dataUrl, widthPx, heightPx } = await buildSalesReturnInvoicePng(data);
  const doc = new E({ unit: "mm", format: "a4", orientation: "portrait" });
  const usableW = A4_W_MM - MARGIN_MM * 2;
  const usableH = A4_H_MM - MARGIN_MM * 2;
  const imgWmm = usableW;
  const imgHmm = heightPx / widthPx * imgWmm;
  if (imgHmm <= usableH) {
    doc.addImage(dataUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, imgHmm, void 0, "FAST");
  } else {
    const pxPerMm = widthPx / imgWmm;
    const pageHpx = usableH * pxPerMm;
    let offsetPx = 0;
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    const ctx = canvas.getContext("2d");
    let first = true;
    while (offsetPx < heightPx) {
      const sliceH = Math.min(pageHpx, heightPx - offsetPx);
      canvas.height = Math.ceil(sliceH);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, -offsetPx);
      const sliceUrl = canvas.toDataURL("image/png");
      if (!first) doc.addPage();
      doc.addImage(sliceUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, sliceH / pxPerMm, void 0, "FAST");
      offsetPx += sliceH;
      first = false;
    }
  }
  const blob = doc.output("blob");
  return { blob, fileName: `${data.returnNumber}.pdf` };
}
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
const money = (n) => (Number.isFinite(n) ? n : 0).toFixed(2);
const SAFE_FONT = 'Arial, Tahoma, "Segoe UI", sans-serif';
async function buildSalesReturnInvoiceThermalPng(data) {
  const c = SALES_RETURN_INVOICE_COMPANY;
  const widthPx = 380;
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
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static" }
    });
    const blob = await (await fetch(dataUrl)).blob();
    return { blob, dataUrl, fileName: `${data.returnNumber}-80mm.png`, widthPx, heightPx: node.offsetHeight };
  } finally {
    wrapper.remove();
  }
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
async function fetchSalesReturnInvoice(returnId) {
  const { data: hdr, error: hErr } = await supabase.from("sales_returns").select("*").eq("id", returnId).maybeSingle();
  if (hErr) throw hErr;
  if (!hdr) throw new Error("Return not found");
  const { data: items, error: iErr } = await supabase.from("sales_return_items").select("id,name,qty,price,line_value,reason").eq("return_id", returnId).order("created_at", { ascending: true });
  if (iErr) throw iErr;
  const h = hdr;
  const lines = (items ?? []).map((it) => ({
    name: it.name,
    qty: Number(it.qty) || 0,
    price: Number(it.price) || 0,
    amount: Number(it.line_value ?? Number(it.qty) * Number(it.price)) || 0,
    reason: it.reason ?? null
  }));
  let vat = null;
  if (h.customer_id) {
    const { data: cust } = await supabase.from("pos_customers").select("vat_number").eq("id", h.customer_id).maybeSingle();
    vat = cust?.vat_number ?? null;
  }
  return {
    returnId: h.id,
    returnNumber: h.return_number ?? "SR-—",
    originalInvoiceNumber: h.invoice_number ?? null,
    date: new Date(h.created_at).toLocaleDateString(),
    timestamp: h.created_at,
    customerName: h.customer_name ?? "Walk-in Customer",
    customerMobile: h.customer_mobile ?? null,
    customerVatNo: vat,
    items: lines,
    totalReturnValue: Number(h.return_value) || 0,
    dueAdjustment: Math.max(0, (Number(h.return_value) || 0) - (Number(h.refund_amount) || 0)),
    refundAmount: Number(h.refund_amount) || 0,
    refundType: h.refund_type ?? "due_reduction",
    reason: h.reason ?? null,
    processedBy: h.processed_by_name ?? null,
    notes: h.notes ?? null
  };
}
const SALES_RETURN_INVOICE_EVENT = "lovable:sales-return-invoice";
function openSalesReturnInvoice(input) {
  try {
    window.dispatchEvent(new CustomEvent(SALES_RETURN_INVOICE_EVENT, { detail: input }));
  } catch (e) {
    console.error("[SalesReturnInvoice] open failed", e);
  }
}
function caption(d) {
  return `Sales Return ${d.returnNumber} — ${d.customerName || "Customer"} · SAR ${d.totalReturnValue.toFixed(2)}`;
}
function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function shareOrFallback(blob, fileName, mime, cap) {
  const file = new File([blob], fileName, { type: mime });
  const nav = navigator;
  if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && typeof nav.share === "function") {
    try {
      await nav.share({ files: [file], text: cap, title: cap });
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
  }
  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}
async function resolveReturnData(input) {
  return typeof input === "string" ? await fetchSalesReturnInvoice(input) : input;
}
async function downloadSalesReturnPdf(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoicePdf(d);
    triggerDownload(blob, fileName);
    toast.success("PDF downloaded");
  } catch (e) {
    toast.error(`PDF failed: ${e?.message ?? e}`);
  }
}
async function shareSalesReturnPdf(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoicePdf(d);
    await shareOrFallback(blob, fileName, "application/pdf", caption(d));
  } catch (e) {
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function downloadSalesReturnA4Image(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoicePng(d);
    triggerDownload(blob, fileName);
    toast.success("Image downloaded");
  } catch (e) {
    toast.error(`Image failed: ${e?.message ?? e}`);
  }
}
async function shareSalesReturnA4Image(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoicePng(d);
    await shareOrFallback(blob, fileName, "image/png", caption(d));
  } catch (e) {
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function downloadSalesReturnThermalImage(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoiceThermalPng(d);
    triggerDownload(blob, fileName);
    toast.success("80mm image downloaded");
  } catch (e) {
    toast.error(`80mm failed: ${e?.message ?? e}`);
  }
}
async function shareSalesReturnThermalImage(d) {
  try {
    const { blob, fileName } = await buildSalesReturnInvoiceThermalPng(d);
    await shareOrFallback(blob, fileName, "image/png", caption(d));
  } catch (e) {
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function printSalesReturnInvoice(d) {
  try {
    const { dataUrl } = await buildSalesReturnInvoicePng(d);
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) {
      toast.error("Popup blocked");
      return;
    }
    w.document.write(`<!doctype html><html><head><title>${d.returnNumber}</title>
      <style>@page{size:A4;margin:8mm;} body{margin:0;} img{width:100%;display:block;}</style>
      </head><body><img src="${dataUrl}" onload="setTimeout(()=>{window.focus();window.print();},200)"/></body></html>`);
    w.document.close();
  } catch (e) {
    toast.error(`Print failed: ${e?.message ?? e}`);
  }
}
export {
  SALES_RETURN_INVOICE_EVENT as S,
  downloadSalesReturnA4Image as a,
  downloadSalesReturnThermalImage as b,
  shareSalesReturnPdf as c,
  downloadSalesReturnPdf as d,
  shareSalesReturnThermalImage as e,
  openSalesReturnInvoice as o,
  printSalesReturnInvoice as p,
  resolveReturnData as r,
  shareSalesReturnA4Image as s
};
