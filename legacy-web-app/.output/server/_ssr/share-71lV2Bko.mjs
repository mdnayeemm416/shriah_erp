import { t as toast } from "../_libs/sonner.mjs";
import E from "../_libs/jspdf.mjs";
import { toPng } from "../_libs/html-to-image.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { t as toIsoTimestamp, z as zatcaV2TlvBase64 } from "./zatca-qr-j46Mpz9I.mjs";
import { I as INVOICE_V2_COMPANY } from "./types-u21zQmgs.mjs";
import "../_libs/react.mjs";

import "../_libs/react-dom.mjs";
import "../_libs/unenv.mjs";




import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";

import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";



const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen"
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function below1000(n) {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " + below1000(n % 100) : ""}`;
}
function intToWords(n) {
  if (n === 0) return "Zero";
  const units = ["", "Thousand", "Million", "Billion"];
  let out = "";
  let i = 0;
  while (n > 0 && i < units.length) {
    const chunk = n % 1e3;
    if (chunk) out = `${below1000(chunk)}${units[i] ? " " + units[i] : ""}${out ? " " + out : ""}`;
    n = Math.floor(n / 1e3);
    i++;
  }
  return out.trim();
}
function amountInWordsSAR(amount) {
  const v = Math.max(0, Number(amount) || 0);
  const riyals = Math.floor(v);
  const halalas = Math.round((v - riyals) * 100);
  const r = intToWords(riyals);
  const h = halalas ? ` and ${intToWords(halalas)} Halalas` : "";
  return `${r} Saudi Riyal${riyals === 1 ? "" : "s"}${h} Only`;
}
const WIDTH_PX = 302;
const PAD_PX = 10;
const FONT_MAIN = "Inter, Roboto, Arial, sans-serif";
const FONT_AR = 'Cairo, Tajawal, "Noto Sans Arabic", sans-serif';
const money = (n) => (Number.isFinite(n) ? n : 0).toFixed(2);
async function qrPng(payload) {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 360,
    color: { dark: "#000000", light: "#ffffff" }
  });
}
function splitNameAr(raw) {
  if (!raw) return { en: "" };
  const s = String(raw);
  const m = s.match(/^(.*?)\s*[|/\n،]\s*(.+)$/);
  if (m) {
    const a = m[1].trim();
    const b = m[2].trim();
    if (/[\u0600-\u06FF]/.test(b)) return { en: a, ar: b };
    if (/[\u0600-\u06FF]/.test(a)) return { en: b, ar: a };
  }
  if (/[\u0600-\u06FF]/.test(s) && !/[A-Za-z]/.test(s)) return { en: s };
  return { en: s };
}
async function buildInvoiceAm80Node(data, company = INVOICE_V2_COMPANY) {
  const iso = toIsoTimestamp(data.timestamp);
  const payload = zatcaV2TlvBase64({
    sellerName: company.name,
    vatNumber: company.vatNumber,
    isoTimestamp: iso,
    totalInclVat: money(data.total),
    vatAmount: money(data.vat)
  });
  const qrDataUrl = await qrPng(payload);
  const subtotal = Math.max(0, data.subtotal - data.vat);
  const prev = data.previousDue ?? 0;
  const paid = data.paidAmount ?? 0;
  const newDue = data.newDue ?? Math.max(0, prev + data.total - paid);
  const itemsHtml = data.items.map((it) => {
    const { en, ar } = splitNameAr(it.name);
    const total = it.qty * it.price;
    const rQty = Number(it.returnedQty ?? 0);
    const netQty = Math.max(0, it.qty - rQty);
    return `
        <div class="am-item">
          <div class="am-item-name">${escapeHtml(en || "—")}</div>
          ${ar ? `<div class="am-item-name-ar">${escapeHtml(ar)}</div>` : ""}
          <table class="am-item-row">
            <colgroup>
              <col style="width:46%"><col style="width:16%"><col style="width:18%"><col style="width:20%">
            </colgroup>
            <tbody><tr>
              <td></td>
              <td class="num c qty-col">${Number(it.qty).toFixed(2)}</td>
              <td class="num r rate-col">${money(it.price)}</td>
              <td class="num r b total-col">${money(total)}</td>
            </tr></tbody>
          </table>
          ${rQty > 0 ? `<div style="font-size:10px;color:#b45309;font-weight:600;padding:2px 0 0 2px;">Returned: ${rQty.toFixed(2)} · Net Sold: ${netQty.toFixed(2)}</div>` : ""}
        </div>
        <div class="am-divider-dashed"></div>
      `;
  }).join("");
  const words = amountInWordsSAR(data.total);
  const node = document.createElement("div");
  node.setAttribute("data-am80-root", "true");
  node.className = "am80-receipt";
  node.dir = "ltr";
  node.innerHTML = `
<style>
  .am80-receipt {
    width: ${WIDTH_PX}px;
    box-sizing: border-box;
    background: #ffffff;
    color: #000000;
    font-family: ${FONT_MAIN};
    font-size: 12.5px;
    line-height: 1.4;
    padding: ${PAD_PX}px;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }
  .am80-receipt * { box-sizing: border-box; }
  .am80-receipt .ar { font-family: ${FONT_AR}; direction: rtl; }
  .am80-receipt .c { text-align: center; }
  .am80-receipt .r { text-align: right; }
  .am80-receipt .l { text-align: left; }
  .am80-receipt .b { font-weight: 700; }
  .am80-receipt .muted { color: #000; opacity: 0.85; }
  .am80-receipt .num {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }
  .am80-receipt .bi-label {
    display: block; font-size: 10.5px; line-height: 1.2;
    font-weight: 600; opacity: 0.95;
  }
  .am80-receipt .bi-label .ar {
    display: block; font-size: 10px; font-weight: 600;
  }
  .am80-receipt .am-divider {
    border: 0;
    border-top: 1px solid #000;
    margin: 6px 0;
  }
  .am80-receipt .am-divider-dashed {
    border: 0;
    border-top: 1px dashed #000;
    margin: 4px 0;
  }
  .am80-receipt .am-title {
    text-align: center;
    font-weight: 700;
    font-size: 12.5px;
    letter-spacing: 0.4px;
    line-height: 1.3;
    padding: 1px 0;
  }
  .am80-receipt .am-title.ar { font-size: 12.5px; }
  .am80-receipt .am-header { text-align: center; }
  .am80-receipt .am-header .company-en {
    font-size: 15px; font-weight: 800; letter-spacing: 0.3px;
  }
  .am80-receipt .am-header .company-ar {
    font-size: 14.5px; font-weight: 800; margin-top: 1px;
  }
  .am80-receipt .am-header .addr { font-size: 11.5px; margin-top: 2px; }
  .am80-receipt .am-header .addr.ar { font-size: 11.5px; }
  .am80-receipt .am-info, .am80-receipt .am-summary { width: 100%; border-collapse: collapse; }
  .am80-receipt .am-info td { padding: 2px 0; font-size: 12px; vertical-align: top; }
  .am80-receipt .am-info td.label { padding-bottom: 0; }
  .am80-receipt .am-info td.value { padding-top: 1px; }
  .am80-receipt .am-info td.r { text-align: right; }
  .am80-receipt .am-cols {
    width: 100%; border-collapse: collapse; font-weight: 700; font-size: 11.5px;
    letter-spacing: 0.3px;
  }
  .am80-receipt .am-cols td { padding: 2px 0; vertical-align: top; }
  .am80-receipt .am-cols td.qty-col { padding-left: 4px; }
  .am80-receipt .am-cols td.rate-col { padding-left: 6px; }
  .am80-receipt .am-cols td.total-col { padding-left: 6px; }
  .am80-receipt .am-item-name {
    font-weight: 700; font-size: 12.5px; word-break: break-word; line-height: 1.3;
  }
  .am80-receipt .am-item-name-ar {
    font-family: ${FONT_AR}; direction: rtl; font-size: 12px;
    font-weight: 600; line-height: 1.4;
  }
  .am80-receipt .am-item-row { width: 100%; border-collapse: collapse; margin-top: 1px; }
  .am80-receipt .am-item-row td { padding: 1px 0; font-size: 12.5px; }
  .am80-receipt .am-item-row td.qty-col { padding-left: 4px; }
  .am80-receipt .am-item-row td.rate-col { padding-left: 6px; }
  .am80-receipt .am-item-row td.total-col { padding-left: 6px; }
  .am80-receipt .am-summary td { padding: 2px 0; font-size: 12.5px; vertical-align: top; }
  .am80-receipt .am-summary td.r { text-align: right; }
  .am80-receipt .am-summary .grand td {
    font-size: 13.5px; font-weight: 800; padding-top: 4px; padding-bottom: 4px;
    border-top: 1px solid #000; border-bottom: 1px solid #000;
  }
  .am80-receipt .am-words {
    font-size: 11px; font-style: italic; text-align: center; margin: 4px 0;
    line-height: 1.4;
  }
  .am80-receipt .am-words .ar {
    font-style: normal; font-size: 11px; display: block; margin-top: 1px;
  }
  .am80-receipt .am-qr { text-align: center; margin: 6px 0 4px; }
  .am80-receipt .am-qr img { width: 130px; height: 130px; display: inline-block; }
  .am80-receipt .am-qr .label {
    font-size: 9.5px; margin-top: 2px; letter-spacing: 0.4px;
  }
  .am80-receipt .am-qr .label .ar { display: inline; margin-left: 4px; font-size: 9.5px; }
  .am80-receipt .am-footer { text-align: center; margin-top: 4px; }
  .am80-receipt .am-footer .ty {
    font-size: 13px; font-weight: 800; letter-spacing: 0.5px;
  }
  .am80-receipt .am-footer .ty-ar { font-size: 13px; font-weight: 800; }
  .am80-receipt .am-footer .visit { font-size: 11.5px; margin-top: 1px; }
  .am80-receipt .am-footer .visit-ar { font-size: 11.5px; }

</style>

<!-- HEADER -->
<div class="am-header">
  ${company.logoDataUrl ? `<img src="${company.logoDataUrl}" alt="logo" style="max-width:120px;max-height:60px;margin-bottom:2px;" />` : ""}
  <div class="company-ar ar">${escapeHtml(company.name)}</div>
  <div class="company-en">${escapeHtml(company.name)}</div>
  <div class="addr ar">${escapeHtml(company.address)}</div>
  <div class="addr">${escapeHtml(company.address)}</div>
  <div class="addr">Mobile / <span class="ar">رقم الجوال</span>: ${escapeHtml(company.phone)}</div>
  <div class="addr">VAT / <span class="ar">الرقم الضريبي</span>: ${escapeHtml(company.vatNumber)}</div>
</div>

<hr class="am-divider" />
<div class="am-title">Simplified Tax Invoice</div>
<div class="am-title ar">فاتورة ضريبية مبسطة</div>
<hr class="am-divider" />

<!-- INVOICE INFO -->
<table class="am-info">
  <tbody>
    <tr>
      <td class="l label">Invoice # / <span class="ar">رقم الفاتورة</span>:</td>
      <td class="r label">Pay / <span class="ar">الدفع</span>:</td>
    </tr>
    <tr>
      <td class="l value"><b>${escapeHtml(String(data.invoiceNumber))}</b></td>
      <td class="r value"><b>${escapeHtml(data.paymentMethod || "—")}</b></td>
    </tr>
    <tr>
      <td class="l label">Date / <span class="ar">التاريخ</span>:</td>
      <td class="r label">Time / <span class="ar">الوقت</span>:</td>
    </tr>
    <tr>
      <td class="l value">${escapeHtml(data.date)}</td>
      <td class="r value">${escapeHtml(new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</td>
    </tr>
    <tr>
      <td class="l label" colspan="2">Customer / <span class="ar">العميل</span>:</td>
    </tr>
    <tr>
      <td class="l value" colspan="2"><b>${escapeHtml(data.customerName || "Walk-in")}</b></td>
    </tr>
    ${data.customerMobile ? `<tr><td class="l label" colspan="2">Mobile / <span class="ar">الجوال</span>:</td></tr><tr><td class="l value" colspan="2">${escapeHtml(data.customerMobile)}</td></tr>` : ""}
    ${data.customerVatNo ? `<tr><td class="l label" colspan="2">Cust. VAT / <span class="ar">الرقم الضريبي للعميل</span>:</td></tr><tr><td class="l value" colspan="2">${escapeHtml(data.customerVatNo)}</td></tr>` : ""}
  </tbody>
</table>

<hr class="am-divider" />

<!-- PRODUCT TABLE -->
<table class="am-cols">
  <colgroup>
    <col style="width:46%"><col style="width:16%"><col style="width:18%"><col style="width:20%">
  </colgroup>
  <tbody><tr>
    <td class="l">Item<br/><span class="ar" style="font-size:10px;">الصنف</span></td>
    <td class="c qty-col">QTY<br/><span class="ar" style="font-size:10px;">الكمية</span></td>
    <td class="r rate-col">RATE<br/><span class="ar" style="font-size:10px;">السعر</span></td>
    <td class="r total-col">TOTAL<br/><span class="ar" style="font-size:10px;">الإجمالي</span></td>
  </tr></tbody>
</table>
<div class="am-divider-dashed"></div>
${itemsHtml || `<div class="am-title">No items / لا توجد أصناف</div><div class="am-divider-dashed"></div>`}

<!-- SUMMARY -->
<table class="am-summary">
  <tbody>
    <tr><td class="l">Subtotal <span class="ar">المجموع الفرعي</span></td><td class="r">SAR ${money(subtotal)}</td></tr>
    <tr><td class="l">VAT 15% <span class="ar">ضريبة القيمة المضافة ١٥٪</span></td><td class="r">SAR ${money(data.vat)}</td></tr>
    <tr class="grand"><td class="l">Grand Total <span class="ar">الإجمالي النهائي</span></td><td class="r">SAR ${money(data.total)}</td></tr>
  </tbody>
</table>

<!-- BALANCE -->
${prev || paid || newDue && newDue !== data.total ? `
<hr class="am-divider-dashed" />
<table class="am-summary">
  <tbody>
    <tr><td class="l">Old Balance <span class="ar">الرصيد السابق</span></td><td class="r">SAR ${money(prev)}</td></tr>
    <tr><td class="l">Received <span class="ar">المبلغ المستلم</span></td><td class="r">SAR ${money(paid)}</td></tr>
    <tr><td class="l b">New Balance <span class="ar">الرصيد الجديد</span></td><td class="r b">SAR ${money(newDue)}</td></tr>
  </tbody>
</table>
` : ""}

<hr class="am-divider-dashed" />
<div class="am-words">
  Amount in Words: ${escapeHtml(words)}
  <span class="ar">المبلغ كتابةً</span>
</div>
<hr class="am-divider-dashed" />

<!-- QR -->
<div class="am-qr">
  <img src="${qrDataUrl}" alt="ZATCA QR" />
  <div class="label">ZATCA QR <span class="ar">رمز الاستجابة السريعة</span></div>
</div>

<hr class="am-divider" />

<!-- FOOTER -->
<div class="am-footer">
  <div class="ty">THANK YOU</div>
  <div class="ty-ar ar">شكراً لكم</div>
  <div class="visit">Visit Again</div>
  <div class="visit-ar ar">نتمنى زيارتكم مرة أخرى</div>
</div>
`;
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-am80-wrapper", "true");
  wrapper.style.cssText = `
    position: fixed; left: -10000px; top: 0;
    width: ${WIDTH_PX}px; background: #ffffff;
    z-index: 0; pointer-events: none;
  `;
  wrapper.appendChild(node);
  document.body.appendChild(wrapper);
  node.__wrapper = wrapper;
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 250)));
  try {
    const f = document.fonts;
    if (f?.ready) await f.ready;
  } catch {
  }
  return { node, widthPx: WIDTH_PX, heightPx: node.offsetHeight, qrDataUrl };
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}
const SAFE_FONT = "Inter, Roboto, Arial, sans-serif";
const REMOTE_CSS_RE = /@import|url\s*\(/i;
function sanitize(root) {
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_CSS_RE.test(el.textContent || "")) el.remove();
  });
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
async function buildInvoiceAm80Png(data) {
  const { node, widthPx } = await buildInvoiceAm80Node(data);
  const wrapper = node.__wrapper;
  try {
    sanitize(node);
    if (node.offsetWidth === 0 || node.offsetHeight === 0) {
      throw new Error(`Invoice DOM empty (w=${node.offsetWidth} h=${node.offsetHeight})`);
    }
    const heightPx = node.offsetHeight;
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: heightPx,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static", left: "0", top: "0" },
      filter: (n) => {
        const tag = n.tagName;
        if (tag === "LINK") return false;
        return true;
      }
    });
    const blob = await (await fetch(dataUrl)).blob();
    const fileName = `am80_${data.invoiceNumber}_${Date.now()}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx };
  } catch (e) {
    throw new Error(`PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
const PAGE_W_MM = 80;
async function buildInvoiceAm80Pdf(data) {
  const { dataUrl, widthPx, heightPx } = await buildInvoiceAm80Png(data);
  const pageHmm = heightPx / widthPx * PAGE_W_MM;
  const doc = new E({ unit: "mm", format: [PAGE_W_MM, pageHmm], orientation: "portrait" });
  doc.addImage(dataUrl, "PNG", 0, 0, PAGE_W_MM, pageHmm, void 0, "FAST");
  const blob = doc.output("blob");
  const fileName = `am80_${data.invoiceNumber}_${Date.now()}.pdf`;
  return { blob, fileName };
}
function caption(d) {
  return `Invoice #${d.invoiceNumber} — ${d.customerName || "Customer"}`;
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
      console.warn("[AM80] native share failed, falling back", err);
    }
  }
  triggerDownload(blob, fileName);
  toast.success("Downloaded — attach it in WhatsApp");
  window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
}
async function downloadAm80Pdf(data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Pdf(data);
    triggerDownload(blob, fileName);
    toast.success("PDF downloaded");
  } catch (e) {
    console.error("[AM80] pdf download failed", e);
    toast.error(`PDF failed: ${e?.message ?? e}`);
  }
}
async function shareAm80Pdf(data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Pdf(data);
    await shareOrFallback(blob, fileName, "application/pdf", caption(data));
  } catch (e) {
    console.error("[AM80] pdf share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function downloadAm80Image(data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    triggerDownload(blob, fileName);
    toast.success("Image downloaded");
  } catch (e) {
    console.error("[AM80] image download failed", e);
    toast.error(`Image failed: ${e?.message ?? e}`);
  }
}
async function shareAm80Image(data) {
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    await shareOrFallback(blob, fileName, "image/png", caption(data));
  } catch (e) {
    console.error("[AM80] image share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function shareAm80ImageToCustomer(data, mobile) {
  const { normalizeMobile } = await import("./router-KeVl8_Ln.mjs").then((n) => n.b1);
  const digits = normalizeMobile(mobile ?? "");
  if (!digits) {
    toast.error("Customer mobile number not found.");
    return;
  }
  try {
    const { blob, fileName } = await buildInvoiceAm80Png(data);
    const cap = caption(data);
    const file = new File([blob], fileName, { type: "image/png" });
    const nav = navigator;
    const canNativeShare = typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && typeof nav.share === "function";
    if (canNativeShare) {
      try {
        await nav.share({ files: [file], text: cap, title: cap });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.warn("[AM80] native share failed, opening WhatsApp chat", err);
      }
    }
    triggerDownload(blob, fileName);
    toast.success("Invoice downloaded — attach it in WhatsApp");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(cap)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.error("[AM80] customer share failed", e);
    toast.error(`Share failed: ${e?.message ?? e}`);
  }
}
async function printAm80(data) {
  let iframe = null;
  try {
    const { node } = await buildInvoiceAm80Node(data);
    const html = node.outerHTML;
    const wrapper = node.__wrapper;
    wrapper?.remove();
    iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8" />
<title>Invoice ${data.invoiceNumber}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: 80mm; }
</style>
</head><body>${html}</body></html>`);
    doc.close();
    await new Promise((r) => setTimeout(r, 400));
    const win = iframe.contentWindow;
    win.focus();
    win.print();
  } catch (e) {
    console.error("[AM80] print failed", e);
    toast.error(`Print failed: ${e?.message ?? e}`);
  } finally {
    setTimeout(() => iframe?.remove(), 2e3);
  }
}
const INVOICE_AM80_EVENT = "lovable:invoice-am80";
function openInvoiceAm80(data) {
  try {
    window.dispatchEvent(new CustomEvent(INVOICE_AM80_EVENT, { detail: data }));
  } catch (e) {
    console.error("[AM80] open failed", e);
  }
}
export {
  INVOICE_AM80_EVENT,
  downloadAm80Image,
  downloadAm80Pdf,
  openInvoiceAm80,
  printAm80,
  shareAm80Image,
  shareAm80ImageToCustomer,
  shareAm80Pdf
};
