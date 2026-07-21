import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, a2 as DialogDescription, B as Button, a$ as fetchCustomerVatForSale } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { k as LoaderCircle, Y as Share2, J as Printer, $ as FileText, _ as Download } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "./client-Bs6QIVWe.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";

import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";



const A4_BRAND_DEFAULT = "Azzouz WholeSale";
const A4_BRAND_AR = "عزوز للجملة";
const A4_BRAND_ADDRESS = "Walyal Ahd, Makkah";
const A4_BRAND_MOBILE = "0553687388";
const A4_BRAND_EMAIL = "info@azzouzwholesale.sa";
const A4_BRAND_TAX_NO = "311339561300003";
const A4_BRAND_CR_NO = "—";
const A4_BRAND_LOGO = "";
const VAT_RATE = 0.15;
function zatcaTlvBase64A4(sellerName, vatNumber, isoTimestamp, total, vat) {
  const enc = new TextEncoder();
  const fields = [
    [1, sellerName],
    [2, vatNumber],
    [3, isoTimestamp],
    [4, total],
    [5, vat]
  ];
  const parts = [];
  for (const [tag, value] of fields) {
    const bytes = enc.encode(value);
    if (bytes.length > 255) throw new Error(`ZATCA QR field ${tag} is too long`);
    parts.push(tag, bytes.length, ...bytes);
  }
  const u8 = new Uint8Array(parts);
  let bin = "";
  for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode(...u8.subarray(i, i + 32768));
  return btoa(bin);
}
function buildZatcaQrPngDataUrl(p, opts = {}) {
  if (typeof document === "undefined") throw new Error("A4 QR generation requires browser canvas");
  const sizePx = opts.sizePx ?? 480;
  const sellerName = p.brand ?? A4_BRAND_DEFAULT;
  const vat = (p.tax ?? Math.max(0, p.total - p.total / (1 + VAT_RATE))).toFixed(2);
  const totalStr = Number(p.total).toFixed(2);
  const iso = (() => {
    const src = p.timestamp ?? [p.date, p.time].filter(Boolean).join(" ");
    if (!src) return (/* @__PURE__ */ new Date()).toISOString();
    const d = src instanceof Date ? src : new Date(src);
    return Number.isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
  })();
  const payload = zatcaTlvBase64A4(sellerName, A4_BRAND_TAX_NO, iso, totalStr, vat);
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const moduleCount = Number(qr.modules.size);
  const data = qr.modules.data;
  const quiet = 4;
  const moduleSize = Math.max(2, Math.floor(sizePx / (moduleCount + quiet * 2)));
  const px = moduleSize * (moduleCount + quiet * 2);
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("A4 QR canvas context unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = "#000000";
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (data[row * moduleCount + col]) {
        ctx.fillRect((col + quiet) * moduleSize, (row + quiet) * moduleSize, moduleSize, moduleSize);
      }
    }
  }
  return canvas.toDataURL("image/png");
}
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
function under1000ToWords(n) {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return TENS[t] + (o ? " " + ONES[o] : "");
  }
  const h = Math.floor(n / 100);
  const r = n % 100;
  return ONES[h] + " Hundred" + (r ? " " + under1000ToWords(r) : "");
}
function integerToWords(n) {
  if (n === 0) return "Zero";
  const units = ["", "Thousand", "Million", "Billion"];
  let i = 0;
  let out = "";
  while (n > 0 && i < units.length) {
    const chunk = n % 1e3;
    if (chunk) {
      const part = under1000ToWords(chunk) + (units[i] ? " " + units[i] : "");
      out = part + (out ? " " + out : "");
    }
    n = Math.floor(n / 1e3);
    i++;
  }
  return out.trim();
}
function amountInWordsSAR(amount) {
  const safe = Math.max(0, Number(amount) || 0);
  const riyals = Math.floor(safe);
  const halalas = Math.round((safe - riyals) * 100);
  const riyalWords = integerToWords(riyals);
  let s = `${riyalWords} Saudi Riyals`;
  if (halalas > 0) s += ` and ${integerToWords(halalas)} Halalas`;
  s += " Only";
  return s;
}
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtSAR = (n) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);
function buildA4InvoiceHTML(p, opts = {}) {
  const brand = {
    name: opts.brand?.name ?? p.brand ?? A4_BRAND_DEFAULT,
    nameAr: opts.brand?.nameAr ?? A4_BRAND_AR,
    address: opts.brand?.address ?? A4_BRAND_ADDRESS,
    mobile: opts.brand?.mobile ?? A4_BRAND_MOBILE,
    email: opts.brand?.email ?? A4_BRAND_EMAIL,
    vatNo: opts.brand?.vatNo ?? A4_BRAND_TAX_NO,
    crNo: opts.brand?.crNo ?? A4_BRAND_CR_NO,
    branch: opts.brand?.branch ?? "Main Branch",
    logo: opts.brand?.logoDataUrl ?? A4_BRAND_LOGO
  };
  const grandTotal = Number(p.total) || 0;
  const subtotalExclVat = grandTotal / (1 + VAT_RATE);
  const vatAmount = grandTotal - subtotalExclVat;
  const paid = Number(p.paidAmount ?? 0);
  const prevDue = Number(p.previousDue ?? 0);
  const newDue = Number(p.newDue ?? Math.max(0, prevDue + grandTotal - paid));
  const currentInvoiceDue = Math.max(0, grandTotal - paid);
  const qrDataUrl = (() => {
    try {
      return buildZatcaQrPngDataUrl(p, { sizePx: 480 });
    } catch {
      return "";
    }
  })();
  const customerVat = p.partyTaxNo && p.partyTaxNo.trim() ? p.partyTaxNo.trim() : "N/A";
  const itemsHtml = (p.items ?? []).map((it, idx) => {
    const qty = Number(it.qty) || 0;
    const priceIncl = Number(it.price) || 0;
    const unitExcl = priceIncl / (1 + VAT_RATE);
    const subExcl = unitExcl * qty;
    return `
      <tr>
        <td class="c sl">${idx + 1}</td>
        <td class="name">${esc(it.name)}</td>
        <td class="c num">${qty}</td>
        <td class="r num">${fmtSAR(unitExcl)}</td>
        <td class="r num">${fmtSAR(subExcl)}</td>
      </tr>`;
  }).join("");
  const headerRight = `
    <div class="meta-row"><span class="meta-k">Invoice #</span><span class="meta-v">${esc(p.invoiceNumber)}</span></div>
    <div class="meta-row"><span class="meta-k">Date</span><span class="meta-v">${esc(p.date)}${p.time ? " · " + esc(p.time) : ""}</span></div>
    <div class="meta-row"><span class="meta-k">Payment</span><span class="meta-v">${esc(p.paymentMethod ?? "Cash")}</span></div>
    <div class="meta-row"><span class="meta-k">Branch</span><span class="meta-v">${esc(brand.branch)}</span></div>
  `;
  const logoBlock = brand.logo ? `<img class="logo" src="${esc(brand.logo)}" alt="Logo" />` : `<div class="logo logo-fallback">${esc(brand.name.charAt(0))}</div>`;
  const css = (
    /* css */
    `
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #f3f4f6; color: #111; font-family: "Helvetica Neue", Arial, "Segoe UI", "Noto Sans Arabic", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { width: 210mm; min-height: 297mm; margin: 0 auto; background: #ffffff; padding: 14mm 14mm 16mm; position: relative; }

    /* Header */
    .hdr { display: grid; grid-template-columns: 28mm 1fr 56mm; gap: 6mm; align-items: flex-start; padding-bottom: 6mm; border-bottom: 2px solid #0f5132; }
    .logo { width: 28mm; height: 28mm; object-fit: contain; border-radius: 3mm; background: #0f5132; }
    .logo-fallback { display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:48px; letter-spacing:1px; }
    .brand .name-en { font-size: 18pt; font-weight: 800; color: #0f5132; line-height: 1.1; }
    .brand .name-ar { font-size: 14pt; font-weight: 700; color: #0f5132; line-height: 1.2; margin-top: 1mm; direction: rtl; }
    .brand .small { font-size: 9pt; color: #374151; line-height: 1.45; margin-top: 1.5mm; }
    .brand .small .sep { color:#9ca3af; margin: 0 1mm; }
    .brand .regs { font-size: 8.5pt; color: #6b7280; margin-top: 1mm; }
    .meta { font-size: 9pt; color: #111; background:#f8fafc; border:1px solid #e5e7eb; border-radius:2mm; padding: 3mm 3.5mm; }
    .meta-row { display:flex; justify-content:space-between; gap:3mm; padding: 0.6mm 0; }
    .meta-k { color:#6b7280; font-weight:600; }
    .meta-v { color:#111; font-weight:700; }

    /* Title band */
    .title-band { margin: 5mm 0 4mm; text-align: center; }
    .title-band .en { font-size: 15pt; font-weight: 800; letter-spacing: 0.5px; color:#111; }
    .title-band .ar { font-size: 13pt; font-weight: 700; color:#0f5132; margin-top: 1mm; direction: rtl; }

    /* Customer */
    .cust { border: 1px solid #e5e7eb; border-radius: 2mm; padding: 4mm 5mm; display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 8mm; font-size: 9.5pt; }
    .cust .row { display: grid; grid-template-columns: 42mm 1fr; gap: 3mm; }
    .cust .k { color:#6b7280; font-weight:600; }
    .cust .v { color:#111; font-weight:700; }

    /* Items table */
    table.items { width: 100%; border-collapse: collapse; margin-top: 5mm; font-size: 9.5pt; }
    table.items thead th { background:#0f5132; color:#fff; padding: 2.5mm 2mm; text-align:left; font-weight:700; font-size: 9.5pt; }
    table.items thead th.c { text-align:center; }
    table.items thead th.r { text-align:right; }
    table.items tbody td { padding: 2.2mm 2mm; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    table.items tbody tr:nth-child(even) td { background:#fafafa; }
    table.items td.c { text-align:center; }
    table.items td.r { text-align:right; }
    table.items td.sl { width: 8mm; color:#6b7280; }
    table.items td.num { font-variant-numeric: tabular-nums; }
    table.items col.col-sl { width: 10mm; }
    table.items col.col-qty { width: 18mm; }
    table.items col.col-unit { width: 30mm; }
    table.items col.col-sub { width: 32mm; }

    /* Summary */
    .sum-wrap { display: grid; grid-template-columns: 1fr 80mm; gap: 6mm; margin-top: 5mm; }
    .words { font-size: 9.5pt; color:#111; border:1px dashed #cbd5e1; border-radius: 2mm; padding: 3mm 4mm; background:#fcfcf7; }
    .words .k { color:#6b7280; font-weight:600; font-size: 9pt; }
    .words .v { font-weight:700; margin-top: 1mm; line-height:1.4; }
    .sum { border:1px solid #e5e7eb; border-radius:2mm; overflow:hidden; font-size: 10pt; }
    .sum .r { display:flex; justify-content:space-between; padding: 2mm 4mm; border-bottom:1px solid #f0f0f0; }
    .sum .r:last-child { border-bottom: 0; }
    .sum .r .k { color:#374151; font-weight:600; }
    .sum .r .v { font-weight:700; font-variant-numeric: tabular-nums; }
    .sum .grand { background:#0f5132; color:#fff; font-size: 11.5pt; }
    .sum .grand .k, .sum .grand .v { color:#fff; font-weight:800; }
    .sum .newdue { background:#fff7ed; }
    .sum .newdue .k, .sum .newdue .v { color:#9a3412; font-weight:800; font-size: 11pt; }

    /* Footer (QR + thanks) */
    .footer { margin-top: 6mm; border-top: 1px solid #e5e7eb; padding-top: 5mm; display:grid; grid-template-columns: 1fr 38mm; gap: 6mm; align-items: flex-end; }
    .thanks .en { font-size: 12pt; font-weight: 800; color:#0f5132; }
    .thanks .ar { font-size: 11pt; font-weight: 700; color:#0f5132; direction:rtl; margin-top: 1mm; }
    .thanks .contact { font-size: 9pt; color:#374151; margin-top: 2mm; }
    .thanks .gen { font-size: 8.5pt; color:#9ca3af; margin-top: 3mm; }
    .qr-block { text-align:center; }
    .qr-block img { width: 36mm; height: 36mm; display:block; margin: 0 auto; background:#fff; border:1px solid #e5e7eb; padding: 1.5mm; image-rendering: pixelated; }
    .qr-block .lbl { font-size: 8pt; color:#6b7280; margin-top: 1.5mm; }

    @media print {
      html, body { background:#fff; }
      .sheet { box-shadow: none !important; margin: 0 !important; }
    }
  `
  );
  const html = (
    /* html */
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${esc(p.invoiceNumber)}</title>
  <style>${css}</style>
</head>
<body>
  <div class="sheet" id="a4-sheet">
    <!-- HEADER -->
    <div class="hdr">
      <div>${logoBlock}</div>
      <div class="brand">
        <div class="name-en">${esc(brand.name)}</div>
        <div class="name-ar" lang="ar">${esc(brand.nameAr)}</div>
        <div class="small">
          ${esc(brand.address)}<span class="sep">·</span>${esc(brand.mobile)}<span class="sep">·</span>${esc(brand.email)}
        </div>
        <div class="regs">
          VAT No: <b>${esc(brand.vatNo)}</b> &nbsp; · &nbsp; CR No: <b>${esc(brand.crNo)}</b>
        </div>
      </div>
      <div class="meta">${headerRight}</div>
    </div>

    <!-- TITLE -->
    <div class="title-band">
      <div class="en">Simplified Tax Invoice</div>
      <div class="ar" lang="ar">فاتورة ضريبية مبسطة</div>
    </div>

    <!-- CUSTOMER -->
    <div class="cust">
      <div class="row"><span class="k">Customer / العميل</span><span class="v">${esc(p.partyName || "—")}</span></div>
      <div class="row"><span class="k">Mobile / الجوال</span><span class="v">${esc(p.partyMobile || "—")}</span></div>
      <div class="row"><span class="k">Cust. VAT No / الرقم الضريبي</span><span class="v">${esc(customerVat)}</span></div>
      <div class="row"><span class="k">Invoice Type</span><span class="v">${p.kind === "sale" ? "Sale" : p.kind === "purchase" ? "Purchase" : "Order"}</span></div>
    </div>

    <!-- ITEMS -->
    <table class="items">
      <colgroup>
        <col class="col-sl" />
        <col />
        <col class="col-qty" />
        <col class="col-unit" />
        <col class="col-sub" />
      </colgroup>
      <thead>
        <tr>
          <th class="c">SL</th>
          <th>Product Name</th>
          <th class="c">Qty</th>
          <th class="r">Unit Price</th>
          <th class="r">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml || `<tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:6mm">No items</td></tr>`}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="sum-wrap">
      <div class="words">
        <div class="k">Amount In Words</div>
        <div class="v">${esc(amountInWordsSAR(grandTotal))}</div>
      </div>
      <div class="sum">
        <div class="r"><span class="k">Subtotal</span><span class="v">SAR ${fmtSAR(subtotalExclVat)}</span></div>
        <div class="r"><span class="k">VAT (15%)</span><span class="v">SAR ${fmtSAR(vatAmount)}</span></div>
        <div class="r grand"><span class="k">Grand Total</span><span class="v">SAR ${fmtSAR(grandTotal)}</span></div>
        <div class="r"><span class="k">Paid Amount</span><span class="v">SAR ${fmtSAR(paid)}</span></div>
        <div class="r"><span class="k">Previous Due</span><span class="v">SAR ${fmtSAR(prevDue)}</span></div>
        <div class="r"><span class="k">Current Invoice Due</span><span class="v">SAR ${fmtSAR(currentInvoiceDue)}</span></div>
        <div class="r newdue"><span class="k">New Due</span><span class="v">SAR ${fmtSAR(newDue)}</span></div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="thanks">
        <div class="en">Thank You For Your Business</div>
        <div class="ar" lang="ar">شكراً لتعاملكم معنا</div>
        <div class="contact">WhatsApp / Phone: <b>${esc(brand.mobile)}</b></div>
        <div class="gen">Generated by ShRiAh ERP</div>
      </div>
      <div class="qr-block">
        ${qrDataUrl ? `<img src="${qrDataUrl}" alt="ZATCA QR" />` : `<div style="width:36mm;height:36mm;border:1px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:8pt">QR</div>`}
        <div class="lbl">ZATCA — Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>`
  );
  return html;
}
async function mountA4(p, opts = {}, label = "a4") {
  const html = buildA4InvoiceHTML(p, opts);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", `A4 Invoice ${label}`);
  iframe.setAttribute("data-receipt-source", "A4Invoice");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "320mm";
  iframe.style.border = "0";
  iframe.style.background = "#fff";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("A4: could not create iframe document");
  }
  doc.open();
  doc.write(html);
  doc.close();
  await new Promise((resolve) => {
    if (doc.readyState === "complete") return resolve();
    const onLoad = () => resolve();
    iframe.addEventListener("load", onLoad, { once: true });
    setTimeout(onLoad, 600);
  });
  try {
    await doc.fonts?.ready;
  } catch {
  }
  const imgs = Array.from(doc.querySelectorAll("img"));
  await Promise.all(imgs.map(
    (img) => img.complete && img.naturalWidth > 0 ? Promise.resolve() : new Promise((res) => {
      img.addEventListener("load", () => res(), { once: true });
      img.addEventListener("error", () => res(), { once: true });
      setTimeout(res, 1500);
    })
  ));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(void 0))));
  const sheet = doc.querySelector("#a4-sheet");
  if (!sheet) {
    iframe.remove();
    throw new Error("A4: .sheet not found");
  }
  const rect = sheet.getBoundingClientRect();
  const h = Math.max(rect.height, sheet.scrollHeight, 297 * 3.7795);
  iframe.style.height = `${Math.ceil(h) + 40}px`;
  console.log("[A4Invoice] DOM mounted", { label, width: sheet.scrollWidth, height: sheet.scrollHeight });
  return { iframe, doc, sheet, cleanup: () => iframe.remove() };
}
async function captureA4AsPng(m) {
  const htmlToImage = await import("../_libs/html-to-image.mjs");
  const sheet = m.sheet;
  const width = Math.max(sheet.scrollWidth, sheet.getBoundingClientRect().width, 794);
  const height = Math.max(sheet.scrollHeight, sheet.getBoundingClientRect().height, 1123);
  const dataUrl = await htmlToImage.toPng(sheet, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    width,
    height,
    cacheBust: true
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  console.log("[A4Invoice] PNG captured", { width, height, size: blob.size });
  return { blob, width, height, dataUrl };
}
async function renderA4InvoicePng(p, opts = {}) {
  const m = await mountA4(p, opts, "png");
  try {
    const cap = await captureA4AsPng(m);
    return cap.blob;
  } finally {
    m.cleanup();
  }
}
async function renderA4InvoicePdf(p, opts = {}) {
  const m = await mountA4(p, opts, "pdf");
  try {
    const cap = await captureA4AsPng(m);
    const { default: JsPDF } = await import("../_libs/jspdf.mjs");
    const pdf = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgRatio = cap.height / cap.width;
    const totalHmm = pageW * imgRatio;
    if (totalHmm <= pageH) {
      pdf.addImage(cap.dataUrl, "PNG", 0, 0, pageW, totalHmm, void 0, "FAST");
    } else {
      const srcImg = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => rej(new Error("A4 page slice image load failed"));
        im.src = cap.dataUrl;
      });
      const pxPerMm = cap.width / pageW;
      const pageHpx = Math.floor(pageH * pxPerMm);
      let y = 0;
      let pageIdx = 0;
      while (y < cap.height) {
        const sliceH = Math.min(pageHpx, cap.height - y);
        const c = document.createElement("canvas");
        c.width = cap.width;
        c.height = sliceH;
        const ctx = c.getContext("2d");
        if (!ctx) throw new Error("A4 slice canvas context unavailable");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(srcImg, 0, y, cap.width, sliceH, 0, 0, cap.width, sliceH);
        const sliceUrl = c.toDataURL("image/png");
        const sliceHmm = sliceH / pxPerMm;
        if (pageIdx > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(sliceUrl, "PNG", 0, 0, pageW, sliceHmm, void 0, "FAST");
        y += sliceH;
        pageIdx++;
      }
    }
    return pdf.output("blob");
  } finally {
    m.cleanup();
  }
}
async function printA4Invoice(p, opts = {}) {
  const m = await mountA4(p, opts, "print");
  setTimeout(() => {
    try {
      m.iframe.contentWindow?.focus();
      m.iframe.contentWindow?.print();
    } catch (e) {
      console.error("[A4Invoice] print failed", e);
      toast.error("Could not open print dialog");
    }
    setTimeout(() => m.cleanup(), 2e3);
  }, 120);
}
function captionFor(p, extra) {
  return extra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber}`;
}
async function shareA4Invoice(p, captionExtra, opts = {}) {
  try {
    const blob = await renderA4InvoicePdf(p, opts);
    const fileName = `${p.kind}_${p.invoiceNumber}_A4.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });
    const cap = captionFor(p, captionExtra);
    const nav = navigator;
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], text: cap });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.warn("[A4Invoice] PDF share failed, trying PNG", err);
      }
    }
    const pngBlob = await renderA4InvoicePng(p, opts);
    const pngFile = new File([pngBlob], `${p.kind}_${p.invoiceNumber}_A4.png`, { type: "image/png" });
    if (nav.share && nav.canShare?.({ files: [pngFile] })) {
      try {
        await nav.share({ files: [pngFile], text: cap });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.warn("[A4Invoice] PNG share failed, downloading", err);
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 PDF downloaded — attach in WhatsApp");
    window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
  } catch (e) {
    console.error("[A4Invoice] share failed", e);
    toast.error(`A4 share failed: ${e?.message ?? e}`);
  }
}
async function downloadA4InvoicePdf(p, opts = {}) {
  try {
    const blob = await renderA4InvoicePdf(p, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.kind}_${p.invoiceNumber}_A4.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 PDF downloaded");
  } catch (e) {
    console.error("[A4Invoice] PDF download failed", e);
    toast.error(`A4 PDF failed: ${e?.message ?? e}`);
  }
}
async function downloadA4InvoicePng(p, opts = {}) {
  try {
    const blob = await renderA4InvoicePng(p, opts);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.kind}_${p.invoiceNumber}_A4.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("A4 image downloaded");
  } catch (e) {
    console.error("[A4Invoice] PNG download failed", e);
    toast.error(`A4 image failed: ${e?.message ?? e}`);
  }
}
const INVOICE_A4_PICKER_EVENT = "lovable:invoice-a4-share";
async function withCustomerVat(payload) {
  if (payload.partyTaxNo && payload.partyTaxNo.trim()) return payload;
  if (!payload.partyMobile && !payload.partyId) return payload;
  try {
    const vat = await fetchCustomerVatForSale({
      customer_id: payload.partyId ?? null,
      customer_mobile: payload.partyMobile ?? null
    });
    return vat ? { ...payload, partyTaxNo: vat } : payload;
  } catch {
    return payload;
  }
}
function InvoiceA4ShareHost() {
  const [pending, setPending] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      const ce = e;
      if (!ce.detail?.payload) return;
      setPending(ce.detail);
    };
    window.addEventListener(INVOICE_A4_PICKER_EVENT, handler);
    return () => window.removeEventListener(INVOICE_A4_PICKER_EVENT, handler);
  }, []);
  const close = () => {
    if (!busy) setPending(null);
  };
  const onShare = async () => {
    if (!pending) return;
    setBusy("share");
    try {
      const payload = await withCustomerVat(pending.payload);
      await shareA4Invoice(payload, pending.captionExtra);
    } finally {
      setBusy(null);
      setPending(null);
    }
  };
  const onPrint = async () => {
    if (!pending) return;
    setBusy("print");
    try {
      const payload = await withCustomerVat(pending.payload);
      await printA4Invoice(payload);
      setPending(null);
    } finally {
      setBusy(null);
    }
  };
  const onPdf = async () => {
    if (!pending) return;
    setBusy("pdf");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadA4InvoicePdf(payload);
    } finally {
      setBusy(null);
    }
  };
  const onPng = async () => {
    if (!pending) return;
    setBusy("png");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadA4InvoicePng(payload);
    } finally {
      setBusy(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!pending, onOpenChange: (o) => {
    if (!o) close();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "📄 A4 Portrait Invoice" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Professional A4 invoice. Print, share via WhatsApp, or download as PDF / image — all from the same A4 template." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onShare, disabled: !!busy, className: "w-full gap-2", children: [
        busy === "share" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
        "Share on WhatsApp"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onPrint, disabled: !!busy, variant: "secondary", className: "w-full gap-2", children: [
        busy === "print" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
        "Print A4"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onPdf, disabled: !!busy, variant: "outline", className: "w-full gap-2", children: [
        busy === "pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
        "Download PDF"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onPng, disabled: !!busy, variant: "ghost", className: "w-full gap-2", children: [
        busy === "png" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        "Download Image"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground", children: "Independent from thermal receipt — A4 portrait pipeline." })
    ] })
  ] }) });
}
export {
  InvoiceA4ShareHost
};
