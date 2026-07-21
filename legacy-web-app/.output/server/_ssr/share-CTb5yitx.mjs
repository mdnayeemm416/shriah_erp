import { t as toast } from "../_libs/sonner.mjs";
import E from "../_libs/jspdf.mjs";
import { toPng } from "../_libs/html-to-image.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { I as INVOICE_V2_COMPANY } from "./types-u21zQmgs.mjs";
import { t as toIsoTimestamp, z as zatcaV2TlvBase64 } from "./zatca-qr-j46Mpz9I.mjs";
const money = (n) => (Number.isFinite(n) ? n : 0).toFixed(2);
async function qrDataUrl(payload) {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 480,
    color: { dark: "#000000", light: "#ffffff" }
  });
}
const FONT_STACK = 'Arial, Tahoma, "Segoe UI", sans-serif';
const FONT_STACK_AR = "Tahoma, Arial, sans-serif";
async function buildInvoiceV2Node(data, company = INVOICE_V2_COMPANY) {
  const iso = toIsoTimestamp(data.timestamp);
  const qrPayload = zatcaV2TlvBase64({
    sellerName: company.name,
    vatNumber: company.vatNumber,
    isoTimestamp: iso,
    totalInclVat: money(data.total),
    vatAmount: money(data.vat)
  });
  const qrPng = await qrDataUrl(qrPayload);
  const widthPx = 794;
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
  const bilingual = (en, ar) => `<span style="display:inline-flex;align-items:baseline;gap:6px;">
       <span>${en}</span>
       <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;color:#64748b;font-size:0.92em;">${ar}</span>
     </span>`;
  const itemsHtml = data.items.map((it, i) => {
    const rQty = Number(it.returnedQty ?? 0);
    const net = Math.max(0, it.qty - rQty);
    const nameCell = rQty > 0 ? `${escapeHtml(it.name)}<div style="font-size:10px;color:#b45309;font-weight:600;margin-top:2px;">Returned: ${rQty} · Net Sold: ${net}</div>` : escapeHtml(it.name);
    return `
      <tr style="background:${i % 2 ? "#f8fafc" : "#ffffff"};">
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:38px;color:#64748b;font-variant-numeric:tabular-nums;">${i + 1}</td>
        <td style="padding:11px 10px;border-bottom:1px solid #eef2f7;text-align:left;font-weight:600;color:#0f172a;">${nameCell}</td>
        <td style="padding:11px 8px;text-align:center;border-bottom:1px solid #eef2f7;width:64px;font-variant-numeric:tabular-nums;">${it.qty}</td>
        <td style="padding:11px 8px;text-align:right;border-bottom:1px solid #eef2f7;width:96px;font-variant-numeric:tabular-nums;color:#334155;">${money(it.price)}</td>
        <td style="padding:11px 10px;text-align:right;border-bottom:1px solid #eef2f7;width:110px;font-weight:700;color:#0f172a;font-variant-numeric:tabular-nums;">${money(it.qty * it.price)}</td>
      </tr>`;
  }).join("");
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
  node.__wrapper = wrapper;
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 300)));
  try {
    const f = document.fonts;
    if (f?.ready) await f.ready;
  } catch {
  }
  const heightPx = node.offsetHeight;
  return { node, qrPng, widthPx, heightPx };
}
function bilingualHeader(en, ar) {
  return `<div style="display:flex;flex-direction:column;line-height:1.15;">
    <span>${en}</span>
    <span style="font-family:${FONT_STACK_AR};direction:rtl;font-size:10px;font-weight:600;opacity:0.75;margin-top:1px;">${ar}</span>
  </div>`;
}
function infoChip(en, ar, value) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:5px 10px;">
    <span style="font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">
      ${en} <span style="font-family:${FONT_STACK_AR};direction:rtl;font-weight:600;">· ${ar}</span>
    </span>
    <b style="font-size:12px;color:#0f172a;font-variant-numeric:tabular-nums;">${escapeHtml(value)}</b>
  </div>`;
}
function summaryRow(label, value, kind) {
  let bg = "#ffffff";
  let color = "#0f172a";
  let weight = 500;
  let fontSize = 12.5;
  let borderTop = "1px solid #f1f5f9";
  if (kind === "grand") {
    bg = "#0f172a";
    color = "#ffffff";
    weight = 800;
    fontSize = 14;
    borderTop = "none";
  } else if (kind === "due") {
    bg = "#fef2f2";
    color = "#b91c1c";
    weight = 800;
    fontSize = 14;
    borderTop = "1px solid #fecaca";
  } else if (kind === "muted") {
    color = "#64748b";
  }
  return `<tr style="background:${bg};color:${color};">
    <td style="padding:9px 12px;font-weight:${weight};font-size:${fontSize}px;border-top:${borderTop};">${label}</td>
    <td style="padding:9px 12px;text-align:right;font-weight:${weight};font-size:${fontSize}px;border-top:${borderTop};font-variant-numeric:tabular-nums;">${value}</td>
  </tr>`;
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const SAFE_FONT = 'Arial, Tahoma, "Segoe UI", sans-serif';
const REMOTE_FONT_RE = /(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;
function sanitizeExportNode(root) {
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_FONT_RE.test(el.textContent || "")) el.remove();
  });
  const all = root.querySelectorAll("*");
  all.forEach((el) => {
    const ff = el.style.fontFamily;
    if (!ff || REMOTE_FONT_RE.test(ff)) {
      el.style.fontFamily = SAFE_FONT;
    }
  });
  root.style.fontFamily = SAFE_FONT;
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
async function buildInvoiceV2Png(data) {
  const { node, widthPx, heightPx } = await buildInvoiceV2Node(data);
  const wrapper = node.__wrapper;
  try {
    sanitizeExportNode(node);
    const diag = {
      selector: "[data-invoice-v2-root]",
      offsetWidth: node.offsetWidth,
      offsetHeight: node.offsetHeight,
      scrollWidth: node.scrollWidth,
      scrollHeight: node.scrollHeight,
      childElementCount: node.childElementCount,
      innerHTMLLength: node.innerHTML.length
    };
    console.log("[InvoiceV2] export node diagnostics", diag);
    if (node.childElementCount === 0 || node.offsetWidth === 0 || node.offsetHeight === 0 || node.innerHTML.length === 0) {
      throw new Error(
        `Invoice DOM is empty (w=${node.offsetWidth} h=${node.offsetHeight} children=${node.childElementCount})`
      );
    }
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: node.offsetHeight,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static", left: "0", top: "0" },
      filter: (n) => {
        const tag = n.tagName;
        if (tag === "LINK" || tag === "STYLE") return false;
        return true;
      }
    });
    const blob = await (await fetch(dataUrl)).blob();
    console.log("[InvoiceV2] export complete", { bytes: blob.size, width: widthPx, height: node.offsetHeight });
    const fileName = `invoice_${data.invoiceNumber}_${Date.now()}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx: node.offsetHeight };
  } catch (e) {
    throw new Error(`PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 6;
async function buildInvoiceV2Pdf(data) {
  const { dataUrl, widthPx, heightPx } = await buildInvoiceV2Png(data);
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
    canvas.height = Math.ceil(pageHpx);
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
      const sliceHmm = sliceH / pxPerMm;
      doc.addImage(sliceUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, sliceHmm, void 0, "FAST");
      offsetPx += sliceH;
      first = false;
    }
  }
  const blob = doc.output("blob");
  const fileName = `invoice_${data.invoiceNumber}_${Date.now()}.pdf`;
  return { blob, fileName };
}
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function caption(d) {
  return `Tax Invoice #${d.invoiceNumber} — ${d.customerName || "Customer"}`;
}
async function downloadInvoiceV2Pdf(data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Pdf(data);
    triggerDownload(blob, fileName);
    toast.success("PDF downloaded");
  } catch (e) {
    console.error("[InvoiceV2] download pdf failed", e);
    toast.error(`PDF failed: ${e?.message ?? e}`);
  }
}
async function shareInvoiceV2Pdf(data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Pdf(data);
    await shareOrFallback(blob, fileName, "application/pdf", caption(data));
  } catch (e) {
    console.error("[InvoiceV2] share pdf failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function downloadInvoiceV2Image(data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Png(data);
    triggerDownload(blob, fileName);
    toast.success("Image downloaded");
  } catch (e) {
    console.error("[InvoiceV2] download image failed", e);
    toast.error(`Image failed: ${e?.message ?? e}`);
  }
}
async function shareInvoiceV2Image(data) {
  try {
    const { blob, fileName } = await buildInvoiceV2Png(data);
    await shareOrFallback(blob, fileName, "image/png", caption(data));
  } catch (e) {
    console.error("[InvoiceV2] share image failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
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
  const canNativeShare = typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && typeof nav.share === "function";
  if (canNativeShare) {
    try {
      await nav.share({ files: [file], text: cap, title: cap });
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.warn("[InvoiceV2] native share failed, falling back", err);
    }
  }
  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}
const INVOICE_V2_EVENT = "lovable:invoice-v2";
function openInvoiceV2(data) {
  try {
    window.dispatchEvent(new CustomEvent(INVOICE_V2_EVENT, { detail: data }));
  } catch (e) {
    console.error("[InvoiceV2] open failed", e);
  }
}
export {
  INVOICE_V2_EVENT as I,
  downloadInvoiceV2Image as a,
  shareInvoiceV2Pdf as b,
  downloadInvoiceV2Pdf as d,
  openInvoiceV2 as o,
  shareInvoiceV2Image as s
};
