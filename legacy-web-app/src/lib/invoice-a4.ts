// ─────────────────────────────────────────────────────────────────────────────
// A4 Portrait Invoice — completely independent module.
//
// Does NOT import any thermal CSS, thermal DOM, thermal designer, thermal QR
// renderer or thermal width logic. The only things imported are:
//   • InvoicePayload (type only)
//   • The `qrcode` npm package (same library the thermal path uses, but invoked
//     locally — no thermal helpers reused).
//
// Owns its own HTML, CSS, ZATCA TLV builder and English number-to-words util.
// ─────────────────────────────────────────────────────────────────────────────

import QRCode from "qrcode";
import type { InvoicePayload } from "./invoice-image";

const A4_BRAND_DEFAULT = "Azzouz WholeSale";
const A4_BRAND_AR = "عزوز للجملة";
const A4_BRAND_ADDRESS = "Walyal Ahd, Makkah";
const A4_BRAND_MOBILE = "0553687388";
const A4_BRAND_EMAIL = "info@azzouzwholesale.sa";
const A4_BRAND_TAX_NO = "311339561300003";
const A4_BRAND_CR_NO = "—";
const A4_BRAND_LOGO = ""; // optional data URL

const VAT_RATE = 0.15;

// ── ZATCA QR (own copy — does NOT reuse thermal code) ───────────────────────

function zatcaTlvBase64A4(
  sellerName: string,
  vatNumber: string,
  isoTimestamp: string,
  total: string,
  vat: string,
): string {
  const enc = new TextEncoder();
  const fields: [number, string][] = [
    [1, sellerName],
    [2, vatNumber],
    [3, isoTimestamp],
    [4, total],
    [5, vat],
  ];
  const parts: number[] = [];
  for (const [tag, value] of fields) {
    const bytes = enc.encode(value);
    if (bytes.length > 255) throw new Error(`ZATCA QR field ${tag} is too long`);
    parts.push(tag, bytes.length, ...bytes);
  }
  const u8 = new Uint8Array(parts);
  let bin = "";
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(bin);
}

function buildZatcaQrPngDataUrl(p: InvoicePayload, opts: { sizePx?: number } = {}): string {
  if (typeof document === "undefined") throw new Error("A4 QR generation requires browser canvas");
  const sizePx = opts.sizePx ?? 480;
  const sellerName = p.brand ?? A4_BRAND_DEFAULT;
  const vat = (p.tax ?? Math.max(0, p.total - p.total / (1 + VAT_RATE))).toFixed(2);
  const totalStr = Number(p.total).toFixed(2);
  const iso = (() => {
    const src: string | Date | undefined = p.timestamp ?? [p.date, p.time].filter(Boolean).join(" ");
    if (!src) return new Date().toISOString();
    const d = src instanceof Date ? src : new Date(src);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  })();
  const payload = zatcaTlvBase64A4(sellerName, A4_BRAND_TAX_NO, iso, totalStr, vat);
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" }) as any;
  const moduleCount = Number(qr.modules.size);
  const data = qr.modules.data as ArrayLike<boolean>;
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

// ── Number → English words ──────────────────────────────────────────────────

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function under1000ToWords(n: number): string {
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

function integerToWords(n: number): string {
  if (n === 0) return "Zero";
  const units = ["", "Thousand", "Million", "Billion"];
  let i = 0;
  let out = "";
  while (n > 0 && i < units.length) {
    const chunk = n % 1000;
    if (chunk) {
      const part = under1000ToWords(chunk) + (units[i] ? " " + units[i] : "");
      out = part + (out ? " " + out : "");
    }
    n = Math.floor(n / 1000);
    i++;
  }
  return out.trim();
}

export function amountInWordsSAR(amount: number): string {
  const safe = Math.max(0, Number(amount) || 0);
  const riyals = Math.floor(safe);
  const halalas = Math.round((safe - riyals) * 100);
  const riyalWords = integerToWords(riyals);
  let s = `${riyalWords} Saudi Riyals`;
  if (halalas > 0) s += ` and ${integerToWords(halalas)} Halalas`;
  s += " Only";
  return s;
}

// ── Formatting helpers ──────────────────────────────────────────────────────

const esc = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtSAR = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);

// ── Main HTML builder ───────────────────────────────────────────────────────

export type A4BuildOptions = {
  brand?: { name?: string; nameAr?: string; address?: string; mobile?: string; email?: string; vatNo?: string; crNo?: string; logoDataUrl?: string; branch?: string };
};

export function buildA4InvoiceHTML(p: InvoicePayload, opts: A4BuildOptions = {}): string {
  const brand = {
    name: opts.brand?.name ?? p.brand ?? A4_BRAND_DEFAULT,
    nameAr: opts.brand?.nameAr ?? A4_BRAND_AR,
    address: opts.brand?.address ?? A4_BRAND_ADDRESS,
    mobile: opts.brand?.mobile ?? A4_BRAND_MOBILE,
    email: opts.brand?.email ?? A4_BRAND_EMAIL,
    vatNo: opts.brand?.vatNo ?? A4_BRAND_TAX_NO,
    crNo: opts.brand?.crNo ?? A4_BRAND_CR_NO,
    branch: opts.brand?.branch ?? "Main Branch",
    logo: opts.brand?.logoDataUrl ?? A4_BRAND_LOGO,
  };

  // Derive amounts. Lines store VAT-inclusive unit prices, so:
  //   subtotal (incl VAT) = sum(qty * price)
  //   subtotal (excl VAT) = subtotal / 1.15
  //   vat = subtotal - subtotal_excl
  const grandTotal = Number(p.total) || 0;
  const subtotalExclVat = grandTotal / (1 + VAT_RATE);
  const vatAmount = grandTotal - subtotalExclVat;

  const paid = Number(p.paidAmount ?? 0);
  const prevDue = Number(p.previousDue ?? 0);
  const newDue = Number(p.newDue ?? Math.max(0, prevDue + grandTotal - paid));
  const currentInvoiceDue = Math.max(0, grandTotal - paid);

  const qrDataUrl = (() => {
    try { return buildZatcaQrPngDataUrl(p, { sizePx: 480 }); } catch { return ""; }
  })();

  const customerVat = p.partyTaxNo && p.partyTaxNo.trim() ? p.partyTaxNo.trim() : "N/A";

  const itemsHtml = (p.items ?? []).map((it, idx) => {
    const qty = Number(it.qty) || 0;
    const priceIncl = Number(it.price) || 0;
    // Show unit price & subtotal EXCLUDING VAT (line excludes tax column entirely)
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

  const logoBlock = brand.logo
    ? `<img class="logo" src="${esc(brand.logo)}" alt="Logo" />`
    : `<div class="logo logo-fallback">${esc(brand.name.charAt(0))}</div>`;

  const css = /* css */ `
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
  `;

  const html = /* html */ `<!DOCTYPE html>
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
        ${qrDataUrl
          ? `<img src="${qrDataUrl}" alt="ZATCA QR" />`
          : `<div style="width:36mm;height:36mm;border:1px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:8pt">QR</div>`}
        <div class="lbl">ZATCA — Scan to verify</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
}
