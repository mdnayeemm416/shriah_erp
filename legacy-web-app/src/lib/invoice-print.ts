// 88mm thermal receipt — HTML/CSS renderer used by BOTH live preview
// and direct printing. Preview embeds this exact HTML in an iframe so
// the rendered output is pixel-identical to what the printer receives.

import QRCode from "qrcode";
import type { InvoicePayload } from "./invoice-image";
import {
  getActive88, defaultThermal88, DEFAULT_SPACING, DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ENABLED,
  type Thermal88Config, type TextStyle, type ColumnDef, type SectionKey,
} from "./invoice-designer-88";

const BRAND_DEFAULT    = "Azzouz WholeSale";
const BRAND_DEFAULT_AR = "عزوز للجملة";
const BRAND_ADDRESS    = "Walyal Ahd, Makkah";
const BRAND_ADDRESS_AR = "ولي العهد، مكة المكرمة";
const BRAND_TAX_NO     = "311339561300003";
const BRAND_MOBILE     = "0553687388";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function zatcaTlvBase64(opts: {
  seller: string; vat: string; ts: string; total: string; vatAmt: string;
  invoiceHash?: string; ecdsaSignature?: string; publicKey?: string; certSignature?: string;
}): string {
  const enc = new TextEncoder();
  const fields: [number, Uint8Array][] = [
    [1, enc.encode(opts.seller)], [2, enc.encode(opts.vat)], [3, enc.encode(opts.ts)],
    [4, enc.encode(opts.total)],  [5, enc.encode(opts.vatAmt)],
  ];
  if (opts.invoiceHash)    fields.push([6, enc.encode(opts.invoiceHash)]);
  if (opts.ecdsaSignature) fields.push([7, enc.encode(opts.ecdsaSignature)]);
  if (opts.publicKey)      fields.push([8, enc.encode(opts.publicKey)]);
  if (opts.certSignature)  fields.push([9, enc.encode(opts.certSignature)]);
  const parts: number[] = [];
  for (const [t, b] of fields) { parts.push(t, b.length, ...b); }
  let bin = ""; const u8 = new Uint8Array(parts);
  for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(bin);
}

function numberToWords(num: number): string {
  if (!isFinite(num)) return "";
  const ones = ["", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["", "", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const under1000 = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + under1000(n%100) : "");
  };
  const toWords = (n: number): string => {
    if (n === 0) return "Zero";
    const parts: string[] = [];
    const scales: [number, string][] = [[1_000_000_000,"Billion"],[1_000_000,"Million"],[1000,"Thousand"]];
    for (const [v, name] of scales) { if (n >= v) { parts.push(under1000(Math.floor(n/v)) + " " + name); n %= v; } }
    if (n > 0) parts.push(under1000(n));
    return parts.join(" ");
  };
  const sar = Math.floor(num);
  const halalas = Math.round((num - sar) * 100);
  let out = toWords(sar) + " Riyal" + (sar !== 1 ? "s" : "");
  if (halalas > 0) out += " and " + toWords(halalas) + " Halala" + (halalas !== 1 ? "s" : "");
  return out + " Only";
}

/* ───── Style helpers ───── */

function styleCss(s: TextStyle, opts: { rtl?: boolean } = {}): string {
  const isAr = s.family === "arabic";
  const fam = isAr
    ? `"Cairo","Tajawal","Noto Sans Arabic",sans-serif`
    : `"Noto Sans","Helvetica Neue",Arial,"Segoe UI",sans-serif`;
  // Respect designer values exactly — no floors, no overrides.
  const size = Math.max(1, s.size);
  const lh   = Math.max(0.5, s.lineHeight);
  const dir  = isAr || opts.rtl ? "direction:rtl;unicode-bidi:embed;" : "";
  // Map weight: explicit weight wins; otherwise fall back to bold flag.
  const weightNum = s.weight === "medium" ? 500 : s.weight === "regular" ? 400 : s.weight === "bold" ? 700 : (s.bold ? 700 : 400);
  return [
    `font-family:${fam}`,
    `font-size:${size}px`,
    `font-weight:${weightNum}`,
    `text-align:${s.align}`,
    `line-height:${lh}`,
    s.letterSpacing ? `letter-spacing:${s.letterSpacing}px` : "",
    s.uppercase ? "text-transform:uppercase" : "",
    dir,
  ].filter(Boolean).join(";") + ";";
}

function span(s: TextStyle, text: string, extra = ""): string {
  if (!text) return "";
  const lang = s.family === "arabic" ? ` lang="ar"` : "";
  return `<span style="${styleCss(s)}${extra}"${lang}>${esc(text)}</span>`;
}
function block(s: TextStyle, text: string, extra = ""): string {
  if (!text) return "";
  const lang = s.family === "arabic" ? ` lang="ar"` : "";
  return `<div style="${styleCss(s)}${extra}"${lang}>${esc(text)}</div>`;
}

/* ───── Renderer ───── */

export interface BuildOptions {
  cfg?: Thermal88Config;
  qrPngDataUrl?: string; // PNG QR image used by print + export; never export raw SVG
}

export interface Thermal88RendererDebug {
  header: { align: string; font: string; weight: string; lineHeight: number; letterSpacing: number };
  invoiceInfo: { align: string; font: string; weight: string; lineHeight: number; letterSpacing: number };
  productTable: {
    headerFont: string; productFont: string; qtyFont: string; rateFont: string; totalFont: string;
    productAlign: string; qtyAlign: string; rateAlign: string; totalAlign: string;
  };
  footer: { align: string; font: string; weight: string; lineHeight: number; letterSpacing: number };
  margins: { left: string; right: string; top: string; bottom: string };
}

function effectiveWeight(s: TextStyle): string {
  const w = s.weight ?? (s.bold ? "bold" : "regular");
  return w === "bold" ? "Bold" : w === "medium" ? "Medium" : "Regular";
}

function zatcaPayloadForInvoice(p: InvoicePayload, taxAmt: number): string {
  const isoTs = (() => {
    const src = p.timestamp ?? [p.date, p.time].filter(Boolean).join(" ");
    const d = src instanceof Date ? src : new Date(src);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  })();
  const zp = (p as any).zatca ?? {};
  return zatcaTlvBase64({
    seller: p.brand ?? BRAND_DEFAULT,
    vat: BRAND_TAX_NO,
    ts: isoTs,
    total: p.total.toFixed(2),
    vatAmt: taxAmt.toFixed(2),
    invoiceHash: zp.invoiceHash,
    ecdsaSignature: zp.ecdsaSignature,
    publicKey: zp.publicKey,
    certSignature: zp.certSignature,
  });
}

function createQrPngDataUrl(payload: string, sizePx: number, quietModules = 4): string {
  if (typeof document === "undefined") throw new Error("QR PNG generation requires browser canvas");
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" }) as any;
  const moduleCount = Number(qr.modules.size);
  const data = qr.modules.data as ArrayLike<boolean>;
  if (!moduleCount || !data) throw new Error("ZATCA QR generation failed");
  const quiet = Math.max(0, Math.round(quietModules));
  const canvas = document.createElement("canvas");
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("QR canvas context unavailable");
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, sizePx, sizePx);
  const modulePx = Math.max(1, Math.floor(sizePx / (moduleCount + quiet * 2)));
  const actual = modulePx * (moduleCount + quiet * 2);
  const offset = Math.floor((sizePx - actual) / 2);
  ctx.fillStyle = "#000000";
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (data[r * moduleCount + c]) {
        ctx.fillRect(offset + (c + quiet) * modulePx, offset + (r + quiet) * modulePx, modulePx, modulePx);
      }
    }
  }
  return canvas.toDataURL("image/png");
}

function countDarkPixels(data: Uint8ClampedArray): number {
  let dark = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 96 && data[i + 1] < 96 && data[i + 2] < 96 && data[i + 3] > 128) dark++;
  }
  return dark;
}

export function getThermal88RendererDebug(cfg: Thermal88Config): Thermal88RendererDebug {
  const pl = cfg.printLayout ?? { leftMargin: 2, rightMargin: 2, topMargin: 1, bottomMargin: 1, safeMode: true };
  const styleInfo = (s: TextStyle) => ({
    align: s.align[0].toUpperCase() + s.align.slice(1),
    font: `${s.size}px`,
    weight: effectiveWeight(s),
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
  });
  return {
    header: styleInfo(cfg.header.en),
    invoiceInfo: styleInfo(cfg.info.en),
    productTable: {
      headerFont: `${cfg.table.headerStyle.size}px`,
      productFont: `${cfg.table.itemStyle.size}px`,
      qtyFont: `${cfg.table.qtyStyle.size}px`,
      rateFont: `${cfg.table.rateStyle.size}px`,
      totalFont: `${cfg.table.totalStyle.size}px`,
      productAlign: cfg.table.itemStyle.align,
      qtyAlign: cfg.table.qtyStyle.align,
      rateAlign: cfg.table.rateStyle.align,
      totalAlign: cfg.table.totalStyle.align,
    },
    footer: styleInfo(cfg.footer.thankYou.style),
    margins: { left: `${pl.leftMargin}mm`, right: `${pl.rightMargin}mm`, top: `${pl.topMargin}mm`, bottom: `${pl.bottomMargin}mm` },
  };
}

export async function buildThermalReceiptHTML(
  p: InvoicePayload,
  opts: BuildOptions = {},
): Promise<string> {
  const cfg = opts.cfg ?? defaultThermal88();
  const currency = p.currency ?? "SAR";

  const taxAmt   = p.tax ?? 0;
  const beforeTax = Math.max(0, p.subtotal - taxAmt);
  const disc     = p.discount ?? 0;
  const paid     = p.paidAmount ?? 0;
  const prevDue  = p.previousDue ?? 0;
  const currentDue = Math.max(0, p.total - paid);
  const newDue   = p.newDue ?? Math.max(0, prevDue + p.total - paid);
  const totalQty = p.items.reduce((s, it) => s + (it.qty || 0), 0);
  const isWalkIn = !p.partyName || /walk[- ]?in/i.test(p.partyName);

  // ZATCA QR — create PNG first, then insert the same PNG into print + export.
  // Never capture raw SVG QR directly.
  const qrPx = Math.max(180, Math.round(Math.max(30, cfg.qr.size) * 3.78));
  let qrPngDataUrl = opts.qrPngDataUrl ?? "";
  if (!qrPngDataUrl) {
    let payload = "";
    try {
      payload = zatcaPayloadForInvoice(p, taxAmt);
    } catch (e) {
      console.error("[ThermalQR] ZATCA QR generation failed (TLV)", e);
      throw new Error("ZATCA QR generation failed");
    }
    if (!payload) {
      console.error("[ThermalQR] QR payload missing");
      throw new Error("QR payload missing");
    }
    console.log("[ThermalQR] QR payload generated", { length: payload.length });
    try {
      qrPngDataUrl = createQrPngDataUrl(payload, qrPx * 3, 4);
      console.log("[ThermalQR] QR image rendered", { type: "PNG", bytes: qrPngDataUrl.length, size: `${qrPx * 3}x${qrPx * 3}` });
    } catch (e) {
      console.error("[ThermalQR] ZATCA QR generation failed (PNG canvas)", e);
      throw new Error("ZATCA QR generation failed");
    }
  }
  const qrImgHtml = `<img data-role="qr" data-qr="true" src="${qrPngDataUrl}" alt="ZATCA QR" width="${qrPx}" height="${qrPx}" decoding="sync" loading="eager" style="display:block;width:${qrPx}px;height:${qrPx}px;background:#fff;margin:0 auto;image-rendering:pixelated;" />`;

  /* ─── Header ─── */
  const h = cfg.header;
  const hEn = h.en;
  const hAr = h.ar;
  // Derive subordinate sizes from configured header size (no Math.max floor).
  const subEn = (delta: number, bold = false): TextStyle => ({ ...hEn, size: Math.max(1, hEn.size - delta), bold, weight: bold ? "bold" : hEn.weight });
  const subAr = (delta: number, bold = false): TextStyle => ({ ...hAr, size: Math.max(1, hAr.size - delta), bold, weight: bold ? "bold" : hAr.weight });
  const headerHtml = `
    <div class="header-block" style="margin-top:${h.marginTop}mm;margin-bottom:${h.marginBottom}mm;">
      ${h.show.brandAr  ? block(hAr, (p as any).brandAr || BRAND_DEFAULT_AR) : ""}
      ${h.show.brandEn  ? block(hEn, p.brand ?? BRAND_DEFAULT) : ""}
      ${h.show.address  ? block(subAr(4), BRAND_ADDRESS_AR) : ""}
      ${h.show.address  ? block(subEn(7), BRAND_ADDRESS) : ""}
      ${h.show.phone    ? block(subEn(7), `Tel: ${BRAND_MOBILE}`) : ""}
      ${h.show.vat      ? block(subEn(7), `VAT: ${BRAND_TAX_NO}`) : ""}
      ${h.show.cr       ? block(subEn(7), `CR: 1010101010`) : ""}
      ${h.show.email    ? block(subEn(7), `info@example.com`) : ""}
      ${h.show.website  ? block(subEn(7), `www.example.com`) : ""}
      ${block(subAr(2, true), "فاتورة ضريبية مبسطة")}
      ${block(subEn(6, true), "Simplified Tax Invoice")}
    </div>
  `;

  /* ─── Invoice Info ─── */
  const infoVal = (key: string): string | null => {
    switch (key) {
      case "invoiceNo": return String(p.invoiceNumber);
      case "date":      return p.date;
      case "time":      return p.time || null;
      case "customer":  return isWalkIn ? "Cash Customer" : p.partyName;
      case "mobile":    return isWalkIn ? null : (p.partyMobile || null);
      case "payment":   return p.paymentMethod ? p.paymentMethod.toUpperCase() : null;
      case "salesman":  return p.createdBy || null;
    }
    return null;
  };
  const labelMap: Record<string,string> = {
    invoiceNo:"Invoice No", date:"Date", time:"Time",
    customer:"Customer", mobile:"Mobile", vatNumber:"Cust. VAT No",
    payment:"Payment", salesman:"Salesman",
  };
  const infoVal2 = (key: string): string | null => {
    if (key === "vatNumber") {
      const v = (p as any).partyTaxNo?.toString().trim();
      return v ? v : "N/A";
    }
    return infoVal(key);
  };
  const cell = (k: string) => {
    const f = cfg.info.fields[k as keyof typeof cfg.info.fields];
    if (!f || !f.show) return null;
    const val = infoVal2(k); if (val == null || val === "") return null;
    const rowStyle: TextStyle = { ...cfg.info.en, align: f.align, bold: f.bold, weight: f.bold ? "bold" : cfg.info.en.weight };
    const labelStyle: TextStyle = { ...rowStyle, bold: false, weight: "regular" };
    const valueStyle: TextStyle = { ...rowStyle, bold: f.bold || rowStyle.bold, weight: f.bold ? "bold" : rowStyle.weight };
    const enLbl = labelMap[k] ?? "";
    const arLbl = f.labelAr ?? "";
    const labelHtml =
      `<span class="ic-label" style="${styleCss(labelStyle)}color:#555;white-space:nowrap;direction:ltr;unicode-bidi:isolate;">` +
        `<bdi dir="ltr">${esc(enLbl)}</bdi>` +
        (arLbl ? ` / <bdi dir="rtl">${esc(arLbl)}</bdi>` : "") +
        `<bdi dir="ltr"> : </bdi>` +
      `</span>`;
    return `<div class="ic" style="text-align:${f.align};direction:ltr;unicode-bidi:isolate;">${labelHtml}<bdi dir="ltr">${span(valueStyle, val)}</bdi></div>`;
  };
  const fullRow = (k: string) => {
    const c = cell(k); if (!c) return "";
    return `<div class="irow-full">${c}</div>`;
  };
  const pairRow = (a: string, b: string) => {
    const ca = cell(a), cb = cell(b);
    if (!ca && !cb) return "";
    return `<div class="irow">${ca ?? '<div class="ic"></div>'}${cb ?? '<div class="ic"></div>'}</div>`;
  };
  const infoTop = [
    pairRow("invoiceNo", "payment"),
    pairRow("date", "time"),
  ].filter(Boolean).join("");
  const infoBottom = [
    fullRow("customer"),
    fullRow("mobile"),
    fullRow("vatNumber"),
    fullRow("salesman"),
  ].filter(Boolean).join("");
  const infoRowsHtml = `${infoTop}${infoTop && infoBottom ? '<div class="info-sep"></div>' : ""}${infoBottom}`;

  /* ─── Items ─── */
  const t = cfg.table;
  const showCols = t.columns.filter(c => c.visible);
  const colHas = (k: ColumnDef["key"]) => showCols.some(c => c.key === k);
  const itemRows = p.items.map((it) => {
    const lineTotal = it.qty * it.price;
    const arabicName = (it as any).nameArabic || (it as any).nameAr || "";
    const nameCell = colHas("item") ? `<div class="i-name" style="text-align:${t.itemStyle.align};">${block(t.itemStyle, it.name || "—")}${arabicName ? block(t.itemArStyle, arabicName) : ""}</div>` : `<div class="i-name"></div>`;
    const qtyCell   = colHas("qty")   ? `<span class="i-qty" style="text-align:${t.qtyStyle.align};">${span(t.qtyStyle, String(it.qty))}</span>`        : `<span class="i-qty"></span>`;
    const rateCell  = colHas("rate")  ? `<span class="i-rate" style="text-align:${t.rateStyle.align};">${span(t.rateStyle, it.price.toFixed(2))}</span>`   : `<span class="i-rate"></span>`;
    const totalCell = colHas("total") ? `<span class="i-tot" style="text-align:${t.totalStyle.align};">${span(t.totalStyle, lineTotal.toFixed(2))}</span>`  : `<span class="i-tot"></span>`;

    return `<div class="product">${nameCell}<div class="value-row"><span></span>${qtyCell}${rateCell}${totalCell}</div></div>`;
  }).join("");

  const tableHeadHtml = `
    <div class="items-head">
      <span style="${styleCss(t.headerStyle)}">${colHas("item") ? esc(t.columns.find(c => c.key === "item")?.label ?? "Item") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("qty") ? esc(t.columns.find(c => c.key === "qty")?.label ?? "Qty") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("rate") ? esc(t.columns.find(c => c.key === "rate")?.label ?? "Rate") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("total") ? esc(t.columns.find(c => c.key === "total")?.label ?? "Total") : ""}</span>
    </div>`;

  /* ─── Summary ─── */
  const sumVal = (key: string): string | null => {
    switch (key) {
      case "totalQty":   return String(totalQty);
      case "subtotal":   return `${beforeTax.toFixed(2)} ${currency}`;
      case "vat":        return `${taxAmt.toFixed(2)} ${currency}`;
      case "discount":   return disc > 0 ? `- ${disc.toFixed(2)} ${currency}` : null;
      case "grandTotal": return `${currency} ${p.total.toFixed(2)}`;
    }
    return null;
  };
  const sumHtml = cfg.summary.rows.filter(r => r.visible).map(r => {
    const v = sumVal(r.key);
    if (v == null) return "";
    if (r.key === "grandTotal") {
      const labelStyle = cfg.summary.grandTotal;
      const amtStyle = cfg.summary.amount;
      return `
        <div class="grand-wrap">
          <div class="hr-grand"></div>
          <div class="grand-line"><span class="grand-label">${span(labelStyle, r.label)}</span><span class="grand-amount">${span(amtStyle, v)}</span></div>
          ${cfg.summary.grandTotalAr ? block(cfg.summary.grandTotalAr, r.labelAr) : ""}
          <div class="hr-grand"></div>
        </div>`;
    }
    const enS = { ...cfg.summary.en, bold: r.bold || cfg.summary.en.bold, weight: r.bold ? "bold" as const : cfg.summary.en.weight };
    return `
      <div class="kv-row">
        <div class="kv-l">${block(enS, r.label)}${block(cfg.summary.ar, r.labelAr)}</div>
        <div class="kv-v">${span(cfg.summary.amount, v)}</div>
      </div>`;
  }).join("");

  /* ─── Due ─── */
  const dueVal = (key: string): string => {
    switch (key) {
      case "paid":     return `${paid.toFixed(2)} ${currency}`;
      case "current":  return `${currentDue.toFixed(2)} ${currency}`;
      case "previous": return `${prevDue.toFixed(2)} ${currency}`;
      case "new":      return `${newDue.toFixed(2)} ${currency}`;
    }
    return "";
  };
  const dueHtml = cfg.due.rows.filter(r => r.visible).map(r => {
    const enS = { ...cfg.due.en, bold: r.bold || cfg.due.en.bold, weight: r.bold ? "bold" as const : cfg.due.en.weight };
    const amt = { ...cfg.due.amount, bold: r.bold || cfg.due.amount.bold, weight: r.bold ? "bold" as const : cfg.due.amount.weight };
    return `
      <div class="kv-row">
        <div class="kv-l">${block(enS, r.label)}${block(cfg.due.ar, r.labelAr)}</div>
        <div class="kv-v">${span(amt, dueVal(r.key))}</div>
      </div>`;
  }).join("");

  /* ─── QR ─── */
  const qr = cfg.qr;
  const sp = { ...DEFAULT_SPACING, ...(cfg.spacing ?? {}) };
  const pl = cfg.printLayout ?? { leftMargin: 4, rightMargin: 4, topMargin: 1, bottomMargin: 1, safeMode: true };
  // Safe Mode: shrink number columns slightly so Total never clips.
  // Base widths chosen for 80mm - 8mm margins = 72mm printable content area (Epson TM-T20II).
  const cw = pl.safeMode
    ? { qty: 10, rate: 13, total: 16 }
    : { qty: 12, rate: 15, total: 18 };
  // Fixed spec: Due → 8px → QR → 4px → caption → 8px → Footer.
  const qrTopPx = 8;
  const qrBotPx = 8;

  const qrHtml = qr.show ? `
    <div class="qrwrap" style="margin:${qrTopPx}px 0 ${qrBotPx}px;text-align:center;width:100%;">
      <div class="qrbox" style="display:inline-block;padding:14px;background:#fff;border:0;margin:0 auto;">
        ${qrImgHtml}
      </div>
      ${qr.captionShow ? `
        <div style="${styleCss({ family:"arabic", size:qr.captionArSize, bold:true, align:"center", lineHeight:1.4, letterSpacing:0 })};margin-top:4px;text-align:center;" lang="ar">امسح الرمز للتحقق - هيئة الزكاة والضريبة</div>
        <div style="${styleCss({ family:"english", size:qr.captionSize, bold:false, align:"center", lineHeight:1.4, letterSpacing:0 })};text-align:center;">ZATCA — Scan to verify</div>` : ""}
    </div>` : "";

  /* ─── Footer ─── */
  const f = cfg.footer;
  const centerStyle = (s: TextStyle): TextStyle => ({ ...s, align: "center" });
  const footerHtml = `
    <div class="footer">
      ${f.thankYou.show      ? block(centerStyle(f.thankYou.style),   f.thankYou.text) : ""}
      ${f.thankYouAr.show    ? block(centerStyle(f.thankYouAr.style), f.thankYouAr.text) : ""}
      ${f.custom.show        ? block(centerStyle(f.custom.style),  f.custom.text) : ""}
      ${f.social.show        ? block(centerStyle(f.social.style),  f.social.text) : ""}
      ${f.website.show       ? block(centerStyle(f.website.style), f.website.text) : ""}
      ${f.phone.show         ? block(centerStyle(f.phone.style),   f.phone.text) : ""}
    </div>`;

  /* ─── Compose ─── */
  return `<!doctype html>
<html><head>
<meta charset="utf-8" />
<title>Receipt ${esc(p.invoiceNumber)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;700;900&family=Noto+Sans:wght@400;600;700;800&display=swap" />
<style>
  :root {
    --section-gap: ${sp.sectionGap}px;
    --product-row-gap: ${sp.productRowGap}px;
    --table-row-gap: ${t.rowSpacing}mm;
    --table-pad: ${t.padding}mm;
    --name-white-space: ${t.multiLine ? "normal" : "nowrap"};
    --name-val-gap: ${sp.productNameValueGap ?? 2}px;
    --row-min-h: ${sp.productRowMinHeight ?? 0}px;
    --sep-top: ${sp.separatorTopGap ?? 0}px;
    --sep-bot: ${sp.separatorBottomGap ?? 2}px;
    --summary-row-gap: ${sp.summaryRowGap}px;
    --due-row-gap: ${sp.dueRowGap}px;
    --header-bottom-gap: ${sp.headerBottomGap}px;
    --footer-top-gap: ${sp.footerTopGap}px;
    --grand-top-pad: ${sp.grandTopPadding}px;
    --grand-bot-pad: ${sp.grandBottomPadding}px;
    --pad-left: ${pl.leftMargin}mm;
    --pad-right: ${pl.rightMargin}mm;
    --pad-top: calc(${pl.topMargin}mm + ${sp.topMargin}px);
    --pad-bot: calc(${pl.bottomMargin}mm + ${sp.bottomMargin}px);
    --col-qty: ${cw.qty}mm;
    --col-rate: ${cw.rate}mm;
    --col-total: ${cw.total}mm;

  }
  @page { size: 80mm auto; margin: 0; }
  html, body { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 0 !important; background: #fff; color: #000;
    transform: none !important; zoom: 1 !important; -webkit-transform: none !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    font-family: "Noto Sans","Helvetica Neue",Arial,"Segoe UI",sans-serif; }
  * { box-sizing: border-box; }
  .receipt { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: var(--pad-top) var(--pad-right) var(--pad-bot) var(--pad-left); overflow: visible !important; word-wrap:break-word; overflow-wrap:anywhere; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
  .receipt > * { width:100%; max-width:100%; }
  .header-block { margin-bottom: var(--header-bottom-gap); width:100% !important; text-align:center !important; padding-left:0 !important; padding-right:0 !important; display:flex; flex-direction:column; align-items:center !important; justify-content:center !important; }
  .header-block > div { margin-top:0; margin-bottom:0; padding-left:0 !important; padding-right:0 !important; width:100% !important; text-align:center !important; display:block !important; }
  .header-block > div > span { display:inline-block !important; text-align:center !important; width:auto !important; }
  .hr { border:0; border-top:1px solid #000; margin: var(--section-gap) 0; }
  .hr-thin { border:0; border-top:1px dashed #000; margin: var(--section-gap) 0; }
  .hr-grand { border:0; border-top:1px solid #000; margin: 0.4mm 0; }

  .kv-row { display:flex; justify-content:space-between; gap:1.2mm; align-items:flex-start; padding: var(--summary-row-gap) 0; width:100%; min-width:0; }
  .kv-l { min-width:0; flex:1; }
  .kv-l > div { padding:0 !important; margin:0 !important; }
  .kv-v { text-align:right; word-break:break-word; overflow-wrap:anywhere; min-width:22mm; max-width:34mm; flex-shrink:0; }
  .due .kv-row { padding: var(--due-row-gap) 0; }

  .info { padding: 0; }
  .irow { display:flex; justify-content:space-between; gap:3mm; padding:2px 0; }
  .irow-full { padding:2px 0; }
  .info-sep { border-top:1px dashed #bbb; margin: 2px 0; }
  .ic { flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ic .ic-label { white-space:nowrap !important; unicode-bidi:isolate; display:inline-block; }
  .irow-full .ic { width:100%; }

  .items-head { display:grid; grid-template-columns:1fr var(--col-qty) var(--col-rate) var(--col-total); width:100%; align-items:end; gap:0;
    border-bottom:1px solid #000; padding: var(--table-pad) 0 0.6mm; margin-bottom:0.6mm; }
  .items-head > span { display:block; min-width:0; overflow:hidden; text-overflow:clip; white-space:nowrap; }

  .product { width:100%; border-bottom:1px dotted #aaa; padding: calc(var(--sep-top) + var(--table-pad)) 0 calc(var(--sep-bot) + var(--table-pad)); margin-bottom: calc(var(--product-row-gap) + var(--table-row-gap)); min-height: var(--row-min-h); overflow-wrap:anywhere; word-break:break-word; }
  .product:last-child { border-bottom:0; margin-bottom:0; }
  .i-name { width:100%; margin-bottom: var(--name-val-gap); }
  .i-name > div { padding:0 !important; margin:0 !important; white-space:var(--name-white-space); overflow:hidden; text-overflow:clip; }
  .value-row { display:grid; grid-template-columns:1fr var(--col-qty) var(--col-rate) var(--col-total); width:100%; align-items:center; gap:0; margin-top:0; }


  .value-row > span { display:block; min-width:0; overflow:hidden; }
  .value-row .i-tot  { overflow:hidden; }
  .i-tot span { max-width:100%; overflow-wrap:anywhere; word-break:break-word; }

  .grand-wrap { margin:0.5mm 0; padding-top: var(--grand-top-pad); padding-bottom: var(--grand-bot-pad); width:100%; }
  .grand-wrap > div { padding:0 !important; margin:0 !important; }
  .grand-line { display:flex; align-items:center; justify-content:space-between; gap:1mm; width:100%; white-space:nowrap; }
  .grand-label { flex:1; min-width:0; overflow:hidden; }
  .grand-amount { flex-shrink:0; max-width:38mm; overflow:hidden; }

  .qrwrap { text-align:center !important; }
  .qrwrap .qrbox { display:inline-block; background:#fff; margin:0 auto; }
  .qrwrap svg { display:block; background:#fff; shape-rendering: crispEdges; }
  .qrwrap img { display:block; background:#fff; image-rendering: -webkit-optimize-contrast; }

  .footer { margin-top: var(--footer-top-gap); width:100%; text-align:center !important; }
  .footer > div { margin: 0 auto !important; padding:0.2mm 0; width:100% !important; text-align:center !important; }
  .footer > div > span, .footer span { text-align:center !important; display:inline-block; }

  @media print {
    @page { size: 80mm auto; margin: 0; }
    html, body { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
    .receipt { width: 80mm !important; min-width: 80mm !important; max-width: 80mm !important; overflow: visible !important; transform: none !important; zoom: 1 !important; -webkit-transform: none !important; }
    button, .sidebar, .header, .navbar, footer, .floating-button { display:none !important; }
  }
</style>
</head>
<body>
  <div class="receipt">
${renderSections(cfg, { headerHtml, infoRowsHtml, tableHeadHtml, itemRows, sumHtml, dueHtml, qrHtml, footerHtml })}
  </div>
</body></html>`;
}

interface SectionParts {
  headerHtml: string; infoRowsHtml: string; tableHeadHtml: string; itemRows: string;
  sumHtml: string; dueHtml: string; qrHtml: string; footerHtml: string;
}
function renderSections(cfg: Thermal88Config, parts: SectionParts): string {
  const order: SectionKey[] = (cfg.sectionOrder?.length ? cfg.sectionOrder : DEFAULT_SECTION_ORDER).filter(
    (k, i, a) => a.indexOf(k) === i,
  );
  const enabled = { ...DEFAULT_SECTION_ENABLED, ...(cfg.sectionEnabled ?? {}) };
  const out: string[] = [];
  const wrap = (key: string, html: string) => `<div data-section="${key}">${html}</div>`;
  for (const key of order) {
    if (!enabled[key]) continue;
    switch (key) {
      case "header":  if (parts.headerHtml)   out.push(wrap("header",  parts.headerHtml + `<hr class="hr" />`)); break;
      case "info":    if (parts.infoRowsHtml) out.push(wrap("info",    `<div class="info">${parts.infoRowsHtml}</div><hr class="hr-thin" />`)); break;
      case "items":   if (parts.itemRows)     out.push(wrap("items",   parts.tableHeadHtml + `<div class="items">${parts.itemRows}</div><hr class="hr" />`)); break;
      case "summary": if (parts.sumHtml)      out.push(wrap("summary", `<div class="summary">${parts.sumHtml}</div><hr class="hr-thin" />`)); break;
      case "due":     if (parts.dueHtml)      out.push(wrap("due",     `<div class="due">${parts.dueHtml}</div>`)); break;
      case "qr":      if (parts.qrHtml)       out.push(wrap("qr",      parts.qrHtml)); break;
      case "footer":  if (parts.footerHtml)   out.push(wrap("footer",  parts.footerHtml)); break;
    }
  }
  return out.join("\n");
}

/* ───── Print entry — unchanged public API ───── */

type PreparedThermalPrintDom = {
  iframe: HTMLIFrameElement;
  doc: Document;
  receipt: HTMLElement;
  cleanup: () => void;
};

const PRINT_QR_SELECTOR = 'img[data-role="qr"], img[data-qr], .qrwrap img';

function waitForNextPaint(win: Window | null, frames = 2): Promise<void> {
  const target = win ?? window;
  return new Promise((resolve) => {
    let count = 0;
    const tick = () => (++count >= frames ? resolve() : target.requestAnimationFrame(tick));
    target.requestAnimationFrame(tick);
  });
}

async function waitForIframeLoad(iframe: HTMLIFrameElement): Promise<void> {
  const doc = iframe.contentDocument;
  if (doc?.readyState === "complete") {
    await waitForNextPaint(iframe.contentWindow);
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      iframe.removeEventListener("load", onLoad);
      reject(new Error("Timed out waiting for printed receipt iframe to load"));
    }, 5000);
    const onLoad = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    iframe.addEventListener("load", onLoad, { once: true });
  });
  await waitForNextPaint(iframe.contentWindow);
}

async function waitForImageElement(img: HTMLImageElement, label: string): Promise<void> {
  if (!img.complete) {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        reject(new Error(`${label} timed out while loading`));
      }, 5000);
      const onLoad = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      const onError = () => {
        window.clearTimeout(timeout);
        reject(new Error(`${label} failed to load`));
      };
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onError, { once: true });
    });
  }
  if (typeof img.decode === "function") {
    await img.decode().catch((e) => { throw new Error(`${label} decode failed: ${e instanceof Error ? e.message : String(e)}`); });
  }
}

async function waitForAllImagesInsideIframe(doc: Document): Promise<void> {
  const imgs = Array.from(doc.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(imgs.map((img, index) => waitForImageElement(img, `Printed receipt image ${index + 1}`)));
}

async function waitForQRImageInsideIframe(doc: Document): Promise<HTMLImageElement> {
  const qr = doc.querySelector(PRINT_QR_SELECTOR) as HTMLImageElement | null;
  console.log("[PrintedReceipt] QR tagName before export =", qr?.tagName ?? "(missing)");
  if (!qr) throw new Error("Printed receipt QR not loaded in share iframe: QR element missing");
  await waitForImageElement(qr, "Printed receipt QR");
  const rect = qr.getBoundingClientRect();
  if (!qr.complete || qr.naturalWidth === 0) throw new Error("Printed receipt QR not loaded in share iframe");
  if (rect.width <= 0 || rect.height <= 0) throw new Error(`Printed receipt QR has zero rendered size: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
  if (!qr.src.startsWith("data:image/png")) throw new Error("Printed receipt QR is not PNG");
  return qr;
}

async function loadSameQrForCanvas(qr: HTMLImageElement): Promise<HTMLImageElement> {
  const img = new Image();
  img.decoding = "sync";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Printed receipt QR could not be loaded for shared image repair"));
    img.src = qr.src;
  });
  if (typeof img.decode === "function") await img.decode().catch(() => undefined);
  const probe = document.createElement("canvas");
  probe.width = img.naturalWidth || 1;
  probe.height = img.naturalHeight || 1;
  const pctx = probe.getContext("2d");
  if (!pctx) throw new Error("Printed receipt QR probe canvas unavailable");
  pctx.drawImage(img, 0, 0);
  const sourceDark = countDarkPixels(pctx.getImageData(0, 0, probe.width, probe.height).data);
  console.log("[PrintedReceipt] Repair QR image loaded", { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, complete: img.complete, srcBytes: qr.src.length, sourceDark });
  return img;
}

async function prepareThermalPrintDom(
  p: InvoicePayload,
  cfgOverride?: Thermal88Config,
  label = "print",
): Promise<PreparedThermalPrintDom> {
  let cfg: Thermal88Config | undefined = cfgOverride;
  try { cfg = cfg ?? getActive88(); } catch { cfg = undefined; }
  const html = await buildThermalReceiptHTML(p, { cfg });
  const iframe = document.createElement("iframe");
  iframe.setAttribute("data-receipt-source", "ThermalReceipt");
  iframe.setAttribute("title", `Thermal Receipt ${label}`);
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.width = "80mm";
  iframe.style.height = "20000px";
  iframe.style.border = "0";
  iframe.style.opacity = "1";
  iframe.style.pointerEvents = "none";
  iframe.style.background = "white";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    throw new Error("Could not create thermal print DOM");
  }

  try {
    doc.open(); doc.write(html); doc.close();
    await waitForIframeLoad(iframe);
    try { await doc.fonts?.ready; } catch {}

    const receipt = doc.querySelector(".receipt") as HTMLElement | null;
    if (!receipt) throw new Error("Thermal print DOM .receipt not found");

    await waitForAllImagesInsideIframe(doc);
    const qr = await waitForQRImageInsideIframe(doc);
    await waitForNextPaint(iframe.contentWindow, 3);

    const qrRect = qr?.getBoundingClientRect();
    console.log("[PrintedReceipt] Receipt Source: ThermalReceipt");
    console.log("[PrintedReceipt] Print DOM prepared", { label, width: receipt.scrollWidth, height: receipt.scrollHeight });
    console.log("[PrintedReceipt] QR Element Found =", !!qr);
    console.log("[PrintedReceipt] QR Tag =", qr?.tagName ?? "(none)");
    console.log("[PrintedReceipt] QR Width =", Math.round(qrRect?.width ?? 0));
    console.log("[PrintedReceipt] QR Height =", Math.round(qrRect?.height ?? 0));
    console.log("[PrintedReceipt] QR Natural Width =", qr.naturalWidth);
    console.log("[PrintedReceipt] QR Natural Height =", qr.naturalHeight);

    return { iframe, doc, receipt, cleanup: () => iframe.remove() };
  } catch (e) {
    iframe.remove();
    throw e;
  }
}

export async function printThermalReceipt(p: InvoicePayload, cfgOverride?: Thermal88Config): Promise<void> {
  const printed = await prepareThermalPrintDom(p, cfgOverride, "physical-print");
  setTimeout(() => {
    try {
      const win = printed.iframe.contentWindow;
      const doc = printed.doc;
      const receipt = printed.receipt;
      const body = doc.body as HTMLElement;
      const html = doc.documentElement as HTMLElement;
      const cs = win?.getComputedStyle(receipt);
      const csBody = win?.getComputedStyle(body);
      const csHtml = win?.getComputedStyle(html);
      const mmPerPx = 25.4 / 96;
      const toMm = (px: number) => `${(px * mmPerPx).toFixed(2)}mm`;
      console.log("[ThermalPrintAudit] === Width audit before window.print() ===");
      console.log("[ThermalPrintAudit] .receipt", {
        offsetWidth: receipt.offsetWidth, scrollWidth: receipt.scrollWidth, clientWidth: receipt.clientWidth,
        computedWidth: cs?.width, computedMinWidth: cs?.minWidth, computedMaxWidth: cs?.maxWidth,
        transform: cs?.transform, zoom: (cs as any)?.zoom,
        offsetWidthMm: toMm(receipt.offsetWidth),
      });
      console.log("[ThermalPrintAudit] body", {
        offsetWidth: body.offsetWidth, scrollWidth: body.scrollWidth, clientWidth: body.clientWidth,
        computedWidth: csBody?.width, transform: csBody?.transform, zoom: (csBody as any)?.zoom,
        offsetWidthMm: toMm(body.offsetWidth),
      });
      console.log("[ThermalPrintAudit] html", {
        offsetWidth: html.offsetWidth, scrollWidth: html.scrollWidth, clientWidth: html.clientWidth,
        computedWidth: csHtml?.width, transform: csHtml?.transform, zoom: (csHtml as any)?.zoom,
        offsetWidthMm: toMm(html.offsetWidth),
      });
      console.log("[ThermalPrintAudit] iframe", {
        styleWidth: printed.iframe.style.width,
        clientWidth: printed.iframe.clientWidth,
        offsetWidth: printed.iframe.offsetWidth,
      });
    } catch (e) {
      console.error("[ThermalPrintAudit] failed to read widths", e);
    }
    printed.iframe.contentWindow?.focus();
    printed.iframe.contentWindow?.print();
    setTimeout(() => printed.cleanup(), 2000);
  }, 80);
}

/**
 * Capture the already-rendered print iframe as a high-resolution PNG using
 * html-to-image (SVG <foreignObject>). The browser renders Arabic glyphs and
 * RTL shaping itself — we DO NOT reconstruct text strings, so عزوز للجملة
 * survives exactly as it appears on paper.
 *
 * Hard requirements enforced:
 *   • iframe characterSet === "UTF-8"
 *   • document.fonts.ready (iframe + outer) resolved before capture
 *   • Arabic-capable fonts (Cairo / Tajawal / Noto Sans Arabic) embedded
 *     inline into the SVG so foreignObject can paint the glyphs
 *   • Mojibake guard: if the iframe text contains Ø/Ù/Þ/ï»¿ instead of real
 *     Arabic codepoints, throw "Arabic encoding failed" — never export.
 */
async function captureReceiptAsPng(
  printed: PreparedThermalPrintDom,
  label = "printed receipt",
): Promise<{ blob: Blob; width: number; height: number }> {
  const htmlToImage = await import("html-to-image");
  const body = printed.doc.body;
  const receipt = printed.receipt;

  // 1) Force UTF-8 — the only encoding that round-trips Arabic safely.
  const charset = (printed.doc.characterSet || "").toUpperCase();
  console.log("[PrintedReceipt] iframe characterSet =", charset);
  if (charset && charset !== "UTF-8") {
    throw new Error(`Arabic encoding failed — iframe characterSet is ${charset}, expected UTF-8`);
  }

  // 2) Lock thermal width so layout doesn't reflow during capture.
  const THERMAL_PX = 384; // 80mm @ ~120dpi
  for (const el of [body, receipt]) {
    el.style.setProperty("width", `${THERMAL_PX}px`, "important");
    el.style.setProperty("min-width", `${THERMAL_PX}px`, "important");
    el.style.setProperty("max-width", `${THERMAL_PX}px`, "important");
    el.style.setProperty("margin", "0", "important");
    el.style.setProperty("background", "#ffffff", "important");
    el.style.setProperty("transform", "none", "important");
    el.style.setProperty("zoom", "1", "important");
    el.style.setProperty("filter", "none", "important");
    el.style.setProperty("overflow", "visible", "important");
  }

  // 3) Wait until fonts (incl. Cairo / Tajawal / Noto Sans Arabic) are ready.
  try { await (printed.doc as any).fonts?.ready; } catch {}
  try { await (document as any).fonts?.ready; } catch {}
  await new Promise((r) => setTimeout(r, 250));

  // 4) Mojibake guard — abort instead of producing a broken receipt.
  const txt = body.innerText || body.textContent || "";
  const hasArabic = /[\u0600-\u06FF]/.test(txt);
  const mojibakeMatch = txt.match(/[ØÙÞ]|ï»¿/);
  console.log("[PrintedReceipt] Arabic chars present =", hasArabic, "| mojibake match =", mojibakeMatch?.[0] ?? "none");
  if (mojibakeMatch && !hasArabic) {
    throw new Error(`Arabic encoding failed — found "${mojibakeMatch[0]}" without any Arabic codepoints`);
  }

  // 5) Inline the Google Fonts CSS so foreignObject (data: URL origin) can
  //    actually use them — otherwise Arabic falls back to a glyph-less font.
  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await htmlToImage.getFontEmbedCSS(receipt as HTMLElement);
    console.log("[PrintedReceipt] embedded font CSS length =", fontEmbedCSS.length);
  } catch (e) {
    console.warn("[PrintedReceipt] font embed CSS failed", e);
  }

  const width = Math.max(THERMAL_PX, receipt.scrollWidth, body.scrollWidth);
  const height = Math.max(receipt.scrollHeight, body.scrollHeight, receipt.getBoundingClientRect().height);

  // 5b) Per-image preflight — every <img> inside the export container must be
  //     fully loaded, otherwise html-to-image emits a generic "Event: error (img)".
  //     We log each image's src + load state and abort with the exact failing src.
  const images = Array.from(receipt.querySelectorAll("img")) as HTMLImageElement[];
  console.log(`[IMG-DEBUG] inspecting ${images.length} <img> elements before export`);
  for (const img of images) {
    const srcShort = img.src.length > 120 ? img.src.slice(0, 80) + "…[" + img.src.length + " chars]" : img.src;
    console.log("[IMG-DEBUG]", srcShort, "complete=", img.complete, "naturalW=", img.naturalWidth, "naturalH=", img.naturalHeight, "role=", img.dataset.role ?? "(none)");
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      // Try one more decode pass before giving up.
      try { await img.decode(); } catch {}
    }
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      const role = img.dataset.role ?? (img.classList.contains("qr") ? "qr" : img.alt || "unknown");
      const reason = !img.complete ? "not loaded (complete=false)" : "decoded to 0×0";
      console.error("FAILED IMAGE:\n" + img.src + "\nrole: " + role + "\nreason: " + reason);
      throw new Error(`Image failed to load before export — ${role}: ${reason}\nsrc: ${img.src}`);
    }
  }

  // 6) Capture from the ALREADY rendered DOM — no string reconstruction.
  const dataUrl = await htmlToImage.toPng(receipt as HTMLElement, {
    pixelRatio: 3,
    backgroundColor: "#ffffff",
    width,
    height,
    cacheBust: true,
    fontEmbedCSS,
    style: {
      transform: "none",
      margin: "0",
      background: "#ffffff",
    },
  });

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  console.log("[PrintedReceipt] PNG capture complete", { label, width, height, size: blob.size });
  return { blob, width, height };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("blob → dataURL failed"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Build a single-page PDF wrapping the captured PNG (so PDF callers still
 * work). We never call pdf.text() on Arabic — jsPDF's built-in fonts have
 * no Arabic glyphs and no RTL shaping, which is exactly what was producing
 * "Ø Ù Þ" output.
 */
async function buildPdfFromPreparedPrintDom(
  printed: PreparedThermalPrintDom,
  label = "printed receipt",
) {
  const { default: JsPDF } = await import("jspdf");
  const cap = await captureReceiptAsPng(printed, label);
  const widthMm = 80;
  const pxToMm = widthMm / cap.width;
  const heightMm = Math.max(20, cap.height * pxToMm);
  const pdf = new JsPDF({ unit: "mm", format: [widthMm, heightMm], orientation: "portrait" });
  const dataUrl = await blobToDataUrl(cap.blob);
  pdf.addImage(dataUrl, "PNG", 0, 0, widthMm, heightMm, undefined, "FAST");
  console.log("[PrintedReceipt] PDF wrap complete", { label, widthMm, heightMm });
  return { pdf, widthMm, heightMm, pngBlob: cap.blob };
}

/**
 * Generate a PNG of the printed thermal receipt — captured from the actual
 * rendered DOM so Arabic text is preserved exactly as it prints.
 */
export async function renderPrintedThermalReceiptImage(p: InvoicePayload, cfgOverride?: Thermal88Config): Promise<Blob> {
  const printed = await prepareThermalPrintDom(p, cfgOverride, "share-printed-receipt-png");
  try {
    const cap = await captureReceiptAsPng(printed, "share printed receipt (PNG)");
    return cap.blob;
  } finally {
    printed.cleanup();
  }
}

/**
 * PDF variant — wraps the same PNG capture in a single-page PDF. Kept for
 * callers that need a PDF; never reconstructs Arabic text.
 */
export async function renderPrintedThermalReceiptPdf(p: InvoicePayload, cfgOverride?: Thermal88Config): Promise<Blob> {
  const printed = await prepareThermalPrintDom(p, cfgOverride, "share-printed-receipt-pdf");
  try {
    const { pdf } = await buildPdfFromPreparedPrintDom(printed, "share printed receipt (PDF)");
    return pdf.output("blob");
  } finally {
    printed.cleanup();
  }
}

export async function sharePrintedThermalReceipt(p: InvoicePayload, captionExtra?: string, cfgOverride?: Thermal88Config): Promise<void> {
  console.log("[PrintedReceipt] Share path: PNG capture from rendered DOM (Arabic-safe, no text reconstruction)");
  const blob = await renderPrintedThermalReceiptImage(p, cfgOverride);
  const fileName = `${p.kind}_${p.invoiceNumber}_printed_receipt_${Date.now()}.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const cap = captionExtra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber} — ${p.brand ?? BRAND_DEFAULT}`;
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> };
  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], text: cap });
      return;
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.warn("[PrintedReceipt] native share failed, falling back to download", err);
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* ─────────────── Safe-Export helpers ─────────────── */

export interface ThermalExportFailureDetails {
  step: string;
  functionName: string;
  exception: string;
  stack: string;
  section?: string;
}

export class ThermalExportFailure extends Error {
  details: ThermalExportFailureDetails;

  constructor(details: ThermalExportFailureDetails) {
    super(`${details.step} failed at ${details.functionName}: ${details.exception}`);
    this.name = "ThermalExportFailure";
    this.details = details;
    this.stack = `${this.name}: ${this.message}\nCaused by: ${details.stack}`;
  }
}

function errorInfo(e: unknown) {
  if (e instanceof Error) {
    return {
      exception: `${e.name || "Error"}: ${e.message || String(e)}`,
      stack: e.stack || `${e.name || "Error"}: ${e.message || String(e)}`,
    };
  }
  if (typeof Event !== "undefined" && e instanceof Event) {
    const target = e.target instanceof Element ? `${e.target.tagName.toLowerCase()}${e.target.id ? `#${e.target.id}` : ""}${e.target.className ? `.${String(e.target.className).trim().replace(/\s+/g, ".")}` : ""}` : "unknown target";
    const message = `Event: ${e.type || "unknown"} (${target})`;
    return { exception: message, stack: message };
  }
  return { exception: String(e), stack: String(e) };
}

function thermalFailure(step: string, functionName: string, e: unknown, section?: string): ThermalExportFailure {
  const info = errorInfo(e);
  return new ThermalExportFailure({ step, functionName, section, ...info });
}

function logThermalFailure(tag: string, e: unknown) {
  const d = describeThermalExportError(e);
  console.error(
    `${tag} Failed at:\n${d.functionName}\nReason:\n${d.exception}\nStack trace:\n${d.stack}`,
    e,
  );
}

export function describeThermalExportError(e: unknown): ThermalExportFailureDetails {
  const maybe = e as { details?: ThermalExportFailureDetails } | null;
  if (maybe?.details?.functionName) return maybe.details;
  const info = errorInfo(e);
  return {
    step: "Unknown step",
    functionName: e instanceof Error && e.stack ? (e.stack.split("\n")[1]?.trim() || e.name || "unknown()") : "unknown()",
    exception: info.exception,
    stack: info.stack,
  };
}

/**
 * Mount the receipt HTML inside an off-screen iframe, wait for images, and
 * apply "safe export mode": strip cross-origin font links, force system fonts,
 * neutralize transforms / sticky / overflow:clip / animations / backdrop-filter /
 * svg <filter>, and rasterize the QR <svg> into a PNG <img> so html-to-image
 * never has to walk it.
 */
async function mountSafeReceipt(p: InvoicePayload, cfg: Thermal88Config) {
  const tag = "[ThermalImage]";
  let html = "";
  try {
    html = await buildThermalReceiptHTML(p, { cfg });
    console.log(`${tag} Step 1: Thermal template loaded`, { functionName: "buildThermalReceiptHTML()" });
  } catch (e) {
    const info = errorInfo(e);
    const isQr = /qr|qrcode|generateThermalQrSvg/i.test(`${info.exception}\n${info.stack}`);
    throw thermalFailure(isQr ? "Step 4: QR generated" : "Step 1: Thermal template loaded", isQr ? "generateThermalQrSvg()" : "buildThermalReceiptHTML()", e, isQr ? "QR" : undefined);
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:88mm;height:20000px;border:0;opacity:1;pointer-events:none;background:#fff";
  iframe.setAttribute("sandbox", "allow-same-origin");
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) { iframe.remove(); throw thermalFailure("Step 2: Invoice DOM found", "mountSafeReceipt()", new Error("Could not create invoice renderer iframe")); }
  try {
    doc.open(); doc.write(html); doc.close();
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      iframe.onload = done;
      setTimeout(done, 350);
    });
  } catch (e) {
    iframe.remove();
    throw thermalFailure("Step 2: Invoice DOM found", "mountSafeReceipt()", e);
  }

  const receipt = doc.querySelector(".receipt") as HTMLElement | null;
  if (!receipt) { iframe.remove(); throw thermalFailure("Step 2: Invoice DOM found", "mountSafeReceipt()", new Error("Invoice DOM .receipt was not found")); }
  console.log(`${tag} Step 2: Invoice DOM found`, { functionName: "mountSafeReceipt()" });

  // 1) Strip cross-origin font links — html-to-image fails when it cannot
  //    read cssRules from a cross-origin stylesheet (Google Fonts).
  doc.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"]').forEach((n) => n.remove());

  // 2) Force system fonts and neutralize properties that break html-to-image.
  const safeCss = doc.createElement("style");
  safeCss.textContent = `
    * { transform:none !important; animation:none !important; transition:none !important;
        backdrop-filter:none !important; -webkit-backdrop-filter:none !important;
        filter:none !important; position:static !important; overflow:visible !important; }
    html, body, .receipt, .receipt * {
      font-family: Arial, "Helvetica Neue", Helvetica, "Segoe UI", "Noto Sans Arabic", sans-serif !important;
    }
    html, body, .receipt { background:#fff !important; color:#000 !important; }
    .receipt, .receipt * { overflow:visible !important; overflow-clip-margin:unset !important; color:#000; }
    svg filter, svg [filter] { display:none !important; }
  `;
  doc.head.appendChild(safeCss);
  try { await document.fonts?.ready; } catch {}
  try { await doc.fonts?.ready; } catch {}
  console.log(`${tag} Step 3: Fonts loaded`, { functionName: "mountSafeReceipt()", mode: "system font fallback", waitedForDocumentFonts: true });

  // 3) Wait for images — hide any that fail.
  const imgs = Array.from(doc.querySelectorAll("img")) as HTMLImageElement[];
  console.log(`${tag} images=${imgs.length}`);
  await Promise.all(imgs.map(async (img, idx) => {
    try {
      if (!img.complete) {
        await new Promise<void>((res) => {
          img.addEventListener("load", () => res(), { once: true });
          img.addEventListener("error", () => res(), { once: true });
          setTimeout(() => res(), 1500);
        });
      }
      if (typeof img.decode === "function") await img.decode();
    } catch (e) {
      if (img.matches('[data-role="qr"], [data-qr="true"]')) {
        throw thermalFailure("Step 4: QR generated", "HTMLImageElement.decode()", new Error("QR image decode failed"), "QR");
      }
      console.warn(`${tag} image[${idx}] decode FAILED — hiding`, e);
      img.style.display = "none";
    }
  }));
  console.log(`${tag} Images loaded`, { functionName: "mountSafeReceipt()", count: imgs.length });

  // 4) Verify the QR PNG injected by buildThermalReceiptHTML is present.
  //    Print + Share + Download all use this same PNG <img> — no separate QR.
  const printedQr = doc.querySelector('.qrwrap img[data-role="qr"], .qrwrap img[data-qr]') as HTMLImageElement | null;
  if (!printedQr) {
    iframe.remove();
    throw thermalFailure("Step 4: QR generated", "mountSafeReceipt()", new Error("QR element not found in print DOM"), "QR");
  }
  if (!printedQr.src.startsWith("data:image/png")) {
    iframe.remove();
    throw thermalFailure("Step 4: QR generated", "mountSafeReceipt()", new Error("QR image is not PNG data URL"), "QR");
  }
  if (typeof printedQr.decode === "function") {
    try { await printedQr.decode(); } catch (e) {
      iframe.remove();
      throw thermalFailure("Step 4: QR generated", "HTMLImageElement.decode()", new Error("QR image decode failed"), "QR");
    }
  }
  console.log(`${tag} Receipt Source: ThermalReceipt`, { functionName: "mountSafeReceipt()", source: "buildThermalReceiptHTML" });
  console.log(`${tag} QR Found: true`, { functionName: "mountSafeReceipt()", type: "IMG (PNG data URL)", bytes: printedQr.src.length });
  console.log(`${tag} Step 4: QR generated`, { functionName: "mountSafeReceipt()", status: "QR PNG ready" });

  return { iframe, doc, receipt };
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, data] = dataUrl.split(",");
  const mime = meta.match(/data:([^;]+)/)?.[1] ?? "image/png";
  const bin = atob(data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Extract a PNG data URL from any QR representation (IMG / CANVAS / SVG).
 * Required step before capture — html2canvas/html-to-image must never see
 * a raw <canvas> or <svg> QR.
 */
async function extractQrPngDataUrl(qrEl: Element): Promise<string> {
  const tag = "[ThermalImage]";
  const tagName = qrEl.tagName.toUpperCase();
  console.log(`${tag} QR detected — element.tagName =`, tagName);

  if (tagName === "IMG") {
    const img = qrEl as HTMLImageElement;
    console.log(`${tag} QR type: IMG`);
    if (img.src.startsWith("data:image/png")) return img.src;
    // Repaint into a canvas to coerce to PNG data URL.
    const w = img.naturalWidth || img.width || 256;
    const h = img.naturalHeight || img.height || 256;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("QR conversion failed");
    if (typeof img.decode === "function") { try { await img.decode(); } catch {} }
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/png");
  }

  if (tagName === "CANVAS") {
    console.log(`${tag} QR type: CANVAS`);
    try { return (qrEl as HTMLCanvasElement).toDataURL("image/png"); }
    catch (e) { throw new Error("QR conversion failed"); }
  }

  if (tagName === "SVG") {
    console.log(`${tag} QR type: SVG`);
    const svg = qrEl as SVGSVGElement;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("QR conversion failed")); img.src = url; });
      const w = svg.viewBox.baseVal?.width || svg.width.baseVal.value || 256;
      const h = svg.viewBox.baseVal?.height || svg.height.baseVal.value || 256;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("QR conversion failed");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return c.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  throw new Error("QR conversion failed");
}

/**
 * Build a clean clone in the MAIN document inside <div id="export-receipt">,
 * with the QR canvas/SVG/img guaranteed to be a fresh PNG <img>.
 * Caller MUST call cleanup() to remove the export DOM.
 */
async function buildMainDocExportClone(receipt: HTMLElement, label: string) {
  const tag = "[ThermalImage]";
  const srcDoc = receipt.ownerDocument;
  const width = Math.ceil(receipt.scrollWidth || receipt.getBoundingClientRect().width || 333);
  // Initial height estimate — re-measured after the clone is in the main DOM
  // because reflow under main-doc styles can change layout height significantly.
  let height = Math.ceil(receipt.scrollHeight || receipt.getBoundingClientRect().height || 100);
  const footerInSrc = receipt.querySelector('[data-section="footer"]');
  console.log("[FOOTER FOUND]", !!footerInSrc);
  if (width > 16000) throw new Error(`Canvas width exceeded for ${label}: ${width}px`);


  // 1) Find QR in the source (printed) DOM and convert to PNG.
  const qrSrc = receipt.querySelector('img[data-role="qr"], img[data-qr], canvas[data-qr], svg[data-qr], .qrwrap img, .qrwrap canvas, .qrwrap svg');
  if (!qrSrc) throw new Error("QR conversion failed");
  const qrPng = await extractQrPngDataUrl(qrSrc);
  console.log(`${tag} QR converted to PNG`, { bytes: qrPng.length });

  // 2) Remove any old export host, then build a fresh one in the MAIN document.
  document.getElementById("export-receipt")?.remove();
  const container = document.createElement("div");
  container.id = "export-receipt";
  container.setAttribute("data-export-source", "thermal-receipt-main-doc");
  container.style.cssText = [
    "position:fixed", "left:-20000px", "top:0", "z-index:-1", "opacity:1",
    "pointer-events:none", `width:${width}px`, "background:#fff", "color:#000",
    "overflow:visible", "margin:0", "padding:0",
  ].join(";");

  // 3) Copy <style> rules from the source iframe document into the main doc clone
  //    (so layout matches without leaking styles globally — scope under #export-receipt).
  const styleEl = document.createElement("style");
  let scopedCss = "";
  srcDoc.querySelectorAll("style").forEach((s) => { scopedCss += "\n" + (s.textContent ?? ""); });
  // Hard reset to avoid host page styles bleeding in.
  styleEl.textContent = `
    #export-receipt, #export-receipt * {
      box-sizing: border-box; transform:none !important; animation:none !important; transition:none !important;
      backdrop-filter:none !important; -webkit-backdrop-filter:none !important; filter:none !important;
      position:static; overflow:visible; color:#000;
      font-family: Arial,"Helvetica Neue",Helvetica,"Segoe UI","Noto Sans Arabic",sans-serif !important;
    }
    #export-receipt { background:#fff; }
    ${scopedCss}
  `;
  container.appendChild(styleEl);

  const clone = receipt.cloneNode(true) as HTMLElement;
  clone.style.width = `${width}px`;
  clone.style.minWidth = `${width}px`;
  clone.style.maxWidth = `${width}px`;
  clone.style.height = "auto";
  clone.style.minHeight = "0";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";
  clone.style.background = "#ffffff";
  clone.style.color = "#000000";
  container.appendChild(clone);
  document.body.appendChild(container);

  // 4) Replace EVERY qr representation in the clone with a fresh <canvas> that
  //    has the QR PNG drawn into it. html2canvas reliably paints canvases via
  //    their toDataURL; large data:URL <img> elements are sometimes silently
  //    dropped (slot visible, image blank — exact symptom we hit). The
  //    original print DOM is untouched and still uses <img>.
  const qrTargets = Array.from(clone.querySelectorAll('img[data-role="qr"], img[data-qr], canvas[data-qr], svg[data-qr], .qrwrap img, .qrwrap canvas, .qrwrap svg'));
  let replacedCount = 0;
  // Pre-decode the QR PNG once so every canvas draw is synchronous.
  const qrSourceImg = new Image();
  qrSourceImg.decoding = "sync";
  qrSourceImg.src = qrPng;
  await new Promise<void>((res, rej) => {
    if (qrSourceImg.complete && qrSourceImg.naturalWidth > 0) return res();
    qrSourceImg.onload = () => res();
    qrSourceImg.onerror = () => rej(new Error("QR conversion failed"));
  });
  if (typeof qrSourceImg.decode === "function") {
    try { await qrSourceImg.decode(); } catch { /* tolerated */ }
  }
  for (const t of qrTargets) {
    const w = (t as any).width?.baseVal?.value || (t as HTMLElement).getBoundingClientRect?.().width || (t as HTMLImageElement).width || 180;
    const h = (t as any).height?.baseVal?.value || (t as HTMLElement).getBoundingClientRect?.().height || (t as HTMLImageElement).height || 180;
    const cssW = Math.round(w || 180);
    const cssH = Math.round(h || 180);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("data-role", "qr");
    canvas.setAttribute("data-qr", "true");
    const scale = 3; // crisp bitmap, downscaled to CSS box
    canvas.width = cssW * scale;
    canvas.height = cssH * scale;
    canvas.style.cssText = `display:block;width:${cssW}px;height:${cssH}px;background:#fff;margin:0 auto;image-rendering:pixelated;`;
    const cctx = canvas.getContext("2d");
    if (!cctx) throw new Error("QR conversion failed");
    cctx.imageSmoothingEnabled = false;
    cctx.fillStyle = "#fff";
    cctx.fillRect(0, 0, canvas.width, canvas.height);
    cctx.drawImage(qrSourceImg, 0, 0, canvas.width, canvas.height);
    // Keep a hidden <img data-role="qr"> sibling so existing QR readiness
    // probes (which look for img[data-role="qr"]) still succeed.
    const probeImg = document.createElement("img");
    probeImg.src = qrPng;
    probeImg.setAttribute("data-role", "qr");
    probeImg.setAttribute("data-qr-probe", "true");
    probeImg.alt = "ZATCA QR";
    probeImg.decoding = "sync";
    probeImg.loading = "eager";
    probeImg.width = cssW;
    probeImg.height = cssH;
    probeImg.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;";
    const parent = t.parentElement;
    t.replaceWith(canvas);
    if (parent) parent.appendChild(probeImg);
    replacedCount++;
  }
  console.log(`${tag} QR replaced with CANVAS`, { replacedCount, qrNaturalSize: `${qrSourceImg.naturalWidth}x${qrSourceImg.naturalHeight}` });

  // 5) Verify QR canvas is present in the clone.
  const verifyQrCanvas = clone.querySelector('canvas[data-role="qr"]') as HTMLCanvasElement | null;
  if (!verifyQrCanvas) throw new Error("QR conversion failed");
  console.log(`${tag} qrElement.tagName =`, verifyQrCanvas.tagName, `canvas=${verifyQrCanvas.width}x${verifyQrCanvas.height}`);

  // 6) html2canvas cannot parse oklch()/oklab()/color-mix(). Sanitize the clone:
  //    walk every element, read computed colors, and inline plain rgb() overrides.
  sanitizeModernColors(clone);

  // 7) Re-measure height AFTER reflow in main doc + QR replacement + sanitize.
  //    Wait for fonts and a frame so layout is final.
  try { await (document as any).fonts?.ready; } catch {}
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  const cloneRect = clone.getBoundingClientRect();
  const measured = Math.ceil(Math.max(
    clone.scrollHeight,
    clone.offsetHeight,
    cloneRect.height,
    container.scrollHeight,
    height
  ));
  const footerInClone = clone.querySelector('[data-section="footer"]') as HTMLElement | null;
  if (footerInClone) {
    const fRect = footerInClone.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const footerBottom = Math.ceil(fRect.bottom - cRect.top);
    console.log("[EXPORT] footer bottom relative to container:", footerBottom);
    height = Math.max(measured, footerBottom + 8);
  } else {
    height = measured;
  }
  console.log("[EXPORT]", "scrollHeight:", clone.scrollHeight, "offsetHeight:", clone.offsetHeight, "rectHeight:", Math.ceil(cloneRect.height), "final:", height);
  if (height > 32000) throw new Error(`Canvas height exceeded for ${label}: ${height}px`);

  return { container, clone, width, height, cleanup: () => container.remove() };
}


/**
 * Replace any oklch()/oklab()/color()/color-mix() values in the export clone
 * with concrete rgb()/rgba() equivalents. html2canvas only understands the
 * legacy color models, so we must flatten everything before capture.
 */
function sanitizeModernColors(root: HTMLElement) {
  const COLOR_PROPS = [
    "color",
    "backgroundColor",
    "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor",
    "outlineColor", "textDecorationColor", "caretColor",
    "fill", "stroke",
    "columnRuleColor",
  ] as const;
  const probe = document.createElement("canvas");
  probe.width = 1; probe.height = 1;
  const ctx = probe.getContext("2d");
  const isModern = (v: string) => !!v && /oklch\(|oklab\(|color-mix\(|color\(\s*display-p3|color\(\s*rec2020|color\(\s*xyz/i.test(v);

  const toRgb = (v: string): string | null => {
    if (!ctx) return null;
    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#00000000";
      // Browsers (Chrome/Safari) accept oklch in fillStyle; the canvas converts to sRGB.
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${(d[3] / 255).toFixed(3)})`;
    } catch { return null; }
  };

  let found = 0;
  let replaced = 0;
  const walk = (el: Element) => {
    const cs = getComputedStyle(el);
    for (const prop of COLOR_PROPS) {
      const val = (cs as any)[prop] as string;
      if (isModern(val)) {
        found++;
        const rgb = toRgb(val) ?? (prop === "color" ? "#000000" : prop === "backgroundColor" ? "#ffffff" : "#d1d5db");
        try {
          (el as HTMLElement).style.setProperty(
            prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()),
            rgb,
            "important",
          );
          replaced++;
        } catch { /* ignore */ }
      }
    }
    // Nuke compound properties that may embed modern color tokens we cannot flatten.
    const shadow = cs.boxShadow;
    if (isModern(shadow)) {
      (el as HTMLElement).style.setProperty("box-shadow", "none", "important");
      found++; replaced++;
    }
    const bgImage = cs.backgroundImage;
    if (isModern(bgImage)) {
      (el as HTMLElement).style.setProperty("background-image", "none", "important");
      found++; replaced++;
    }
    const inline = (el as HTMLElement).style;
    if (inline) {
      for (let i = inline.length - 1; i >= 0; i--) {
        const name = inline.item(i);
        if (!name) continue;
        if (name.startsWith("--")) { inline.removeProperty(name); continue; }
        const v = inline.getPropertyValue(name);
        if (isModern(v)) {
          found++;
          const rgb = toRgb(v) ?? "#000000";
          inline.setProperty(name, rgb, "important");
          replaced++;
        }
      }
    }
    for (const child of Array.from(el.children)) walk(child);
  };
  walk(root);

  console.log("[ThermalImage] OKLCH colors found:", found);
  console.log("[ThermalImage] OKLCH colors replaced:", replaced);

  // Final guard: search outerHTML for any remaining modern color tokens in style attrs.
  const leftover = root.querySelector('[style*="oklch"], [style*="oklab"], [style*="color-mix"]') as HTMLElement | null;
  if (leftover) {
    console.error("[ThermalImage] OKLCH leftover element:", leftover, "style=", leftover.getAttribute("style"));
    throw new Error(`OKLCH color remains in export DOM on <${leftover.tagName.toLowerCase()}>`);
  }
}

async function ensureQrPngInExportDom(exportNode: HTMLElement, requireQr: boolean) {
  const tag = "[ThermalImage]";
  const img = exportNode.querySelector('img[data-role="qr"], img[data-qr]') as HTMLImageElement | null;
  if (!img) {
    if (requireQr) throw new Error("QR conversion failed");
    return;
  }
  if (!img.src.startsWith("data:image/png")) throw new Error("QR conversion failed");
  console.log(`${tag} Export Source Matched: true`, { functionName: "ensureQrPngInExportDom()", qrBytes: img.src.length });
}

async function waitForQrReadyBeforeCapture(exportContainer: HTMLElement, requireQr: boolean) {
  const qr = exportContainer.querySelector('img[data-role="qr"], img[src^="data:image"]') as HTMLImageElement | null;
  if (!qr) {
    if (requireQr) throw new Error("QR image not found");
    return null;
  }

  console.log("[QR] Found", { srcKind: qr.src.startsWith("data:image") ? "data:image" : qr.src.slice(0, 48) });
  console.log("[QR] Complete", qr.complete);
  console.log("[QR] NaturalWidth", qr.naturalWidth);

  if (qr.complete && qr.naturalWidth === 0) {
    console.error("[QR] QR not ready for export", { complete: qr.complete, naturalWidth: qr.naturalWidth, src: qr.src });
    throw new Error("QR not ready for export");
  }

  if (!qr.complete) {
    await new Promise<void>((resolve, reject) => {
      if (qr.complete && qr.naturalWidth > 0) {
        resolve();
      } else {
        qr.onload = () => resolve();
        qr.onerror = () => reject(new Error("QR image failed to load"));
      }
    });
  }

  console.log("[QR] Complete", qr.complete);
  console.log("[QR] NaturalWidth", qr.naturalWidth);
  if (!qr.complete || qr.naturalWidth === 0) {
    console.error("[QR] QR not ready for export", { complete: qr.complete, naturalWidth: qr.naturalWidth, src: qr.src });
    throw new Error("QR not ready for export");
  }

  try { await (exportContainer.ownerDocument as any).fonts?.ready; } catch {}
  try { await (document as any).fonts?.ready; } catch {}
  await new Promise((r) => setTimeout(r, 500));
  console.log("[QR] Loaded Successfully");
  return qr;
}

async function captureNode(node: HTMLElement, label = "node"): Promise<Blob> {
  const tag = "[ThermalImage]";
  const clean = await buildMainDocExportClone(node, label);
  const failures: string[] = [];
  try {
    const requiresQr = clean.clone.classList.contains("receipt") || clean.clone.getAttribute("data-section") === "qr" || /thermal receipt|\bqr\b/i.test(label);
    await ensureQrPngInExportDom(clean.clone, requiresQr);
    const qrInClone = await waitForQrReadyBeforeCapture(clean.container, requiresQr);
    if (requiresQr && !qrInClone) throw new Error("QR element not found in export DOM");
    console.log(`${tag} QR element found in export DOM`, {
      functionName: "cloneForCapture()",
      label,
      qrPresent: !!qrInClone,
      qrSrcKind: qrInClone?.src.startsWith("data:image/png") ? "png-data-url" : "other",
    });
    console.log(`${tag} Receipt DOM found`, { functionName: "cloneForCapture()", label, width: clean.width, height: clean.height });
    console.log(`${tag} Capture started`, { functionName: "captureNode()", label });

    // html2canvas first — it bakes the inlined PNG QR data URL reliably and
    // does not rewrite image src attributes (unlike html-to-image cacheBust).
    try {
      const { default: html2canvas } = await import("html2canvas");

      // Pre-capture: where is the QR sitting in the export DOM right now?
      const qrRect = qrInClone?.getBoundingClientRect();
      const hostRect = clean.container.getBoundingClientRect();
      console.log("[QR-DEBUG] Export DOM contains QR =", !!qrInClone,
        qrInClone ? { tag: qrInClone.tagName, w: Math.round(qrRect!.width), h: Math.round(qrRect!.height), naturalW: qrInClone.naturalWidth, naturalH: qrInClone.naturalHeight, complete: qrInClone.complete, srcKind: qrInClone.src.startsWith("data:image/png") ? "PNG data URL" : qrInClone.src.slice(0, 32) } : "(missing)");

      console.log("[CAPTURE] Started");
      const canvas = await html2canvas(clean.clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: clean.width,
        height: clean.height,
        windowWidth: clean.width,
        windowHeight: clean.height,
        scrollX: 0,
        scrollY: 0,
      });
      console.log("[CAPTURE] Finished");

      // Post-capture: sample the rendered canvas at the QR's position to prove
      // whether html2canvas actually painted QR pixels there (not just background).
      let qrPainted = false;
      if (qrInClone && qrRect) {
        try {
          const sx = Math.round((qrRect.left - hostRect.left) * 2);
          const sy = Math.round((qrRect.top - hostRect.top) * 2);
          const sw = Math.max(1, Math.round(qrRect.width * 2));
          const sh = Math.max(1, Math.round(qrRect.height * 2));
          const cctx = canvas.getContext("2d");
          const data = cctx?.getImageData(sx, sy, sw, sh).data;
          let dark = 0, total = 0;
          if (data) {
            for (let i = 0; i < data.length; i += 4 * 16) { // sample every 16th px
              total++;
              if (data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80) dark++;
            }
          }
          qrPainted = dark > 5;
          console.log("[QR-DEBUG] Rendered QR region pixels sampled =", total, "dark =", dark, qrPainted ? "→ QR painted ✓" : "→ QR NOT painted ✗ (html2canvas dropped the data:URL <img>)");
        } catch (e) {
          console.warn("[QR-DEBUG] pixel-sample failed:", e);
        }
      }

      // GUARANTEED QR: composite the QR PNG directly onto the output canvas
      // at the measured position. This makes the QR appear in the shared image
      // even if html2canvas dropped/blanked the in-DOM <canvas>/<img>.
      if (qrInClone && qrRect) {
        try {
          const cctx = canvas.getContext("2d");
          if (!cctx) throw new Error("output canvas ctx unavailable");
          const qrImg = new Image();
          qrImg.decoding = "sync";
          qrImg.src = qrInClone.src;
          await new Promise<void>((res, rej) => {
            if (qrImg.complete && qrImg.naturalWidth > 0) return res();
            qrImg.onload = () => res();
            qrImg.onerror = () => rej(new Error("QR render failed"));
          });
          if (typeof qrImg.decode === "function") { try { await qrImg.decode(); } catch {} }
          if (!qrImg.naturalWidth) throw new Error("QR render failed");
          const dx = Math.round((qrRect.left - hostRect.left) * 2);
          const dy = Math.round((qrRect.top - hostRect.top) * 2);
          const dw = Math.max(1, Math.round(qrRect.width * 2));
          const dh = Math.max(1, Math.round(qrRect.height * 2));
          cctx.imageSmoothingEnabled = false;
          // White backing so transparent edges don't show host bg.
          cctx.fillStyle = "#ffffff";
          cctx.fillRect(dx, dy, dw, dh);
          cctx.drawImage(qrImg, dx, dy, dw, dh);
          console.log("[QR-COMPOSITE] QR painted onto output canvas", { dx, dy, dw, dh });
        } catch (compErr) {
          console.error("[QR-COMPOSITE] failed:", compErr);
          if (requiresQr) throw new Error("QR render failed");
        }
      } else if (requiresQr) {
        throw new Error("QR render failed");
      }

      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("html2canvas toBlob returned empty blob")), "image/png", 1));
      console.log(`${tag} Capture success`, { functionName: "html2canvas()", label, size: blob.size });
      return blob;

    } catch (e) {
      const info = errorInfo(e);
      failures.push(`html2canvas(): ${info.exception}`);
      console.error(`${tag} renderer failed\nFailed at:\nhtml2canvas()\nReason:\n${info.exception}\nStack trace:\n${info.stack}`, e);
    }

    // html-to-image fallback
    try {
      const { toPng } = await import("html-to-image");
      console.log("[CAPTURE] Started");
      const dataUrl = await toPng(clean.clone, {
        cacheBust: false,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: clean.width,
        height: clean.height,
        style: { width: `${clean.width}px`, minHeight: `${clean.height}px`, margin: "0", background: "#fff", color: "#000" },
      });
      console.log("[CAPTURE] Finished");
      const blob = dataUrlToBlob(dataUrl);
      console.log(`${tag} Capture success`, { functionName: "toPng()", label, size: blob.size });
      return blob;
    } catch (e) {
      const info = errorInfo(e);
      failures.push(`toPng(): ${info.exception}`);
      console.error(`${tag} renderer failed\nFailed at:\ntoPng()\nReason:\n${info.exception}\nStack trace:\n${info.stack}`, e);
      throw thermalFailure("Step 5: Image render started", "captureNode()", new Error(`All capture renderers failed for ${label}. ${failures.join(" | ")}`));
    }
  } finally {
    clean.cleanup();
  }
}

const SECTION_LABELS: Record<string, string> = {
  header: "Header",
  info: "Invoice Info",
  customer: "Customer Info",
  items: "Product Table",
  summary: "Summary",
  due: "Due",
  qr: "QR",
  footer: "Footer",
};

export async function renderThermalReceiptImage(p: InvoicePayload, cfg?: Thermal88Config): Promise<Blob> {
  const tag = "[ThermalImage]";
  let mounted: Awaited<ReturnType<typeof mountSafeReceipt>> | null = null;
  try {
    let activeCfg: Thermal88Config;
    try { activeCfg = cfg ?? getActive88(); }
    catch (e) { throw thermalFailure("Step 1: Thermal template loaded", "getActive88()", e); }
    mounted = await mountSafeReceipt(p, activeCfg);
    const { receipt } = mounted;

    // ── REQUESTED RUNTIME DIAGNOSTICS (printed on every share/export) ──
    const previewQr = receipt.querySelector('.qrwrap img, .qrwrap canvas, .qrwrap svg, img[data-role="qr"], img[data-qr], canvas[data-qr], svg[data-qr]') as HTMLElement | null;
    const rect = previewQr?.getBoundingClientRect();
    console.log("[QR-DEBUG] QR Element Found =", !!previewQr);
    console.log("[QR-DEBUG] QR Tag =", previewQr?.tagName ?? "(none)");
    console.log("[QR-DEBUG] QR Width =", Math.round(rect?.width ?? 0));
    console.log("[QR-DEBUG] QR Height =", Math.round(rect?.height ?? 0));
    if (previewQr?.tagName === "IMG") {
      const im = previewQr as HTMLImageElement;
      console.log("[QR-DEBUG] QR src kind =", im.src.startsWith("data:image/png") ? "PNG data URL" : im.src.slice(0, 32));
      console.log("[QR-DEBUG] QR naturalWidth =", im.naturalWidth, "naturalHeight =", im.naturalHeight, "complete =", im.complete);
    }

    console.log(`${tag} Receipt Source: ThermalReceipt`, { functionName: "renderThermalReceiptImage()", source: "buildThermalReceiptHTML (same as print)" });
    console.log(`${tag} Step 5: Image render started`, { functionName: "captureNode(.receipt)" });
    const blob = await captureNode(receipt, "thermal receipt");

    // After-capture diagnostic: confirm the export DOM still had the QR.
    const exportHost = document.getElementById("export-receipt");
    const qrInExport = exportHost?.querySelector('img[data-role="qr"], img[data-qr]') as HTMLImageElement | null;
    console.log("[QR-DEBUG] Export DOM contains QR =", !!qrInExport);
    if (qrInExport) {
      console.log("[QR-DEBUG] Export QR tag =", qrInExport.tagName, "size =", qrInExport.width, "x", qrInExport.height,
                  "natural =", qrInExport.naturalWidth, "x", qrInExport.naturalHeight, "srcKind =",
                  qrInExport.src.startsWith("data:image/png") ? "PNG data URL" : qrInExport.src.slice(0, 32));
    } else if (previewQr) {
      console.warn("[QR-DEBUG] QR existed in preview DOM but NOT in export DOM — exact reason: clone host #export-receipt missing or QR was stripped during cloneForCapture(). Check buildMainDocExportClone replacement logs above.");
    }

    console.log(`${tag} Step 6: PNG generated`, { functionName: "captureNode(.receipt)", size: blob.size, qrPresentInExportDom: !!qrInExport });
    return blob;
  } catch (e: any) {
    logThermalFailure(tag, e);
    if (e instanceof ThermalExportFailure) throw e;
    throw thermalFailure("Step 5: Image render started", "renderThermalReceiptImage()", e);
  } finally {
    mounted?.iframe.remove();
  }
}

/**
 * Debug Export: capture each section to its own PNG and trigger downloads.
 * Lets the user identify the exact failing block by name.
 */
export async function debugExportThermalSections(
  p: InvoicePayload,
  cfg?: Thermal88Config,
): Promise<{ section: string; ok: boolean; error?: string }[]> {
  const tag = "[ThermalDebug]";
  const activeCfg = cfg ?? getActive88();
  const { iframe, receipt } = await mountSafeReceipt(p, activeCfg);
  const results: { section: string; ok: boolean; error?: string }[] = [];
  try {
    const sections = Array.from(receipt.querySelectorAll<HTMLElement>("[data-section]"));
    for (const sec of sections) {
      const key = sec.getAttribute("data-section") || "section";
      const label = SECTION_LABELS[key] ?? key;
      try {
        const blob = await captureNode(sec);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice_debug_${key}_${p.invoiceNumber}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        console.log(`${tag} ✓ ${label} exported`);
        results.push({ section: label, ok: true });
      } catch (e: any) {
        console.error(`${tag} ✗ Export failed in ${label} section`, e);
        results.push({ section: label, ok: false, error: e?.message ?? String(e) });
      }
    }
    return results;
  } finally {
    iframe.remove();
  }
}

