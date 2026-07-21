import { t as toast } from "../_libs/sonner.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
const DEFAULT_SPACING = {
  sectionGap: 4,
  productRowGap: 2,
  summaryRowGap: 1,
  dueRowGap: 1,
  headerBottomGap: 4,
  footerTopGap: 4,
  qrTopMargin: 6,
  qrBottomMargin: 4,
  grandTopPadding: 3,
  grandBottomPadding: 3,
  topMargin: 4,
  bottomMargin: 4,
  productNameValueGap: 2,
  productRowMinHeight: 0,
  separatorTopGap: 0,
  separatorBottomGap: 2
};
const DEFAULT_SECTION_ORDER = ["header", "info", "items", "summary", "due", "qr", "footer"];
const DEFAULT_SECTION_ENABLED = {
  header: true,
  info: true,
  items: true,
  summary: true,
  due: true,
  qr: true,
  footer: true
};
const en = (size, opts = {}) => ({
  family: "english",
  size,
  bold: false,
  align: "left",
  lineHeight: 1.1,
  letterSpacing: 0,
  uppercase: false,
  ...opts
});
const ar = (size, opts = {}) => ({
  family: "arabic",
  size,
  bold: true,
  align: "center",
  lineHeight: 1.2,
  letterSpacing: 0,
  ...opts
});
function defaultThermal88(name = "Default") {
  return {
    templateName: name,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionEnabled: { ...DEFAULT_SECTION_ENABLED },
    printLayout: { leftMargin: 4, rightMargin: 4, topMargin: 1, bottomMargin: 1, safeMode: true },
    header: {
      show: { logo: false, brandEn: true, brandAr: true, shopName: false, address: true, phone: true, vat: true, cr: false, email: false, website: false },
      en: en(21, { bold: true, align: "center" }),
      ar: ar(18, { align: "center" }),
      marginTop: 0,
      marginBottom: 1
    },
    spacing: { ...DEFAULT_SPACING },
    info: {
      fields: {
        invoiceNo: { show: true, labelAr: "رقم الفاتورة", bold: true, align: "left" },
        date: { show: true, labelAr: "التاريخ", bold: false, align: "left" },
        time: { show: true, labelAr: "الوقت", bold: false, align: "left" },
        customer: { show: true, labelAr: "العميل", bold: true, align: "left" },
        mobile: { show: true, labelAr: "الجوال", bold: false, align: "left" },
        vatNumber: { show: true, labelAr: "الرقم الضريبي", bold: true, align: "left" },
        payment: { show: true, labelAr: "الدفع", bold: false, align: "left" },
        salesman: { show: false, labelAr: "البائع", bold: false, align: "left" }
      },
      en: en(13),
      ar: ar(13, { align: "right" })
    },
    table: {
      columns: [
        { id: "c1", key: "item", label: "Item", labelAr: "الصنف", width: 100, align: "left", visible: true },
        { id: "c2", key: "qty", label: "Qty", labelAr: "الكمية", width: 0, align: "left", visible: true },
        { id: "c3", key: "rate", label: "Rate", labelAr: "السعر", width: 0, align: "left", visible: true },
        { id: "c4", key: "total", label: "Total", labelAr: "الإجمالي", width: 0, align: "right", visible: true }
      ],
      rowSpacing: 0.3,
      padding: 0,
      multiLine: true,
      headerStyle: en(12, { bold: true, uppercase: true, weight: "bold" }),
      itemStyle: en(13, { bold: true, weight: "bold" }),
      itemArStyle: ar(12, { align: "right", bold: false, weight: "regular" }),
      qtyStyle: en(13, { weight: "regular" }),
      rateStyle: en(13, { weight: "regular" }),
      totalStyle: en(13, { bold: true, align: "right", weight: "bold" })
    },
    summary: {
      rows: [
        { id: "s1", key: "totalQty", label: "Total Qty", labelAr: "إجمالي الكمية", visible: true, bold: false },
        { id: "s2", key: "subtotal", label: "Subtotal", labelAr: "المجموع الفرعي", visible: true, bold: false },
        { id: "s3", key: "vat", label: "VAT 15%", labelAr: "ضريبة القيمة المضافة", visible: true, bold: false },
        { id: "s4", key: "discount", label: "Discount", labelAr: "الخصم", visible: true, bold: false },
        { id: "s5", key: "grandTotal", label: "Grand Total", labelAr: "الإجمالي الكلي", visible: true, bold: true }
      ],
      en: en(14, { bold: true }),
      ar: ar(13, { align: "right" }),
      amount: en(15, { bold: true, align: "right" }),
      grandTotal: en(22, { bold: true, align: "center", letterSpacing: 0.5 }),
      grandTotalAr: ar(14, { align: "center" })
    },
    due: {
      rows: [
        { id: "d1", key: "paid", label: "Paid Amount", labelAr: "المبلغ المدفوع", visible: true, bold: false },
        { id: "d2", key: "current", label: "Current Due", labelAr: "المستحق الحالي", visible: true, bold: false },
        { id: "d3", key: "previous", label: "Previous Due", labelAr: "الرصيد السابق", visible: true, bold: false },
        { id: "d4", key: "new", label: "New Due", labelAr: "الرصيد الجديد", visible: true, bold: true }
      ],
      en: en(14),
      ar: ar(13, { align: "right" }),
      amount: en(15, { bold: true, align: "right" })
    },
    qr: {
      show: true,
      size: 30,
      margin: 2,
      align: "center",
      marginTop: 6,
      marginBottom: 4,
      captionShow: true,
      captionSize: 10,
      captionArSize: 12,
      highQuality: true
    },
    footer: {
      thankYou: { show: true, text: "Thank You", style: en(15, { bold: true, align: "center" }) },
      thankYouAr: { show: true, text: "شكراً لزيارتكم", style: ar(13, { align: "center" }) },
      amountInWords: { show: true, style: en(11, { align: "center" }) },
      custom: { show: false, text: "", style: en(12, { align: "center" }) },
      social: { show: false, text: "", style: en(11, { align: "center" }) },
      website: { show: false, text: "", style: en(11, { align: "center" }) },
      phone: { show: true, text: "WhatsApp: 0553687388", style: en(12, { align: "center" }) }
    }
  };
}
const PRESET_IDS = ["default", "retail", "wholesale", "mini", "premium", "simple"];
const PRESET_LABELS = {
  default: "Default",
  retail: "Retail",
  wholesale: "Wholesale",
  mini: "Mini",
  premium: "Premium",
  simple: "Simple"
};
function preset(id) {
  const c = defaultThermal88(PRESET_LABELS[id]);
  switch (id) {
    case "mini":
      c.header.en.size = 17;
      c.header.ar.size = 15;
      c.table.itemStyle.size = 14;
      c.table.itemArStyle.size = 12;
      c.qr.size = 36;
      c.footer.amountInWords.show = false;
      break;
    case "premium":
      c.header.en.size = 24;
      c.header.en.letterSpacing = 1;
      c.header.ar.size = 20;
      c.summary.grandTotal.size = 26;
      c.qr.size = 46;
      break;
    case "simple":
      c.header.show.vat = false;
      c.header.show.cr = false;
      c.due.rows = c.due.rows.map((r) => ({ ...r, visible: r.key === "paid" || r.key === "new" }));
      c.summary.rows = c.summary.rows.map((r) => ({ ...r, visible: r.key !== "discount" }));
      c.footer.amountInWords.show = false;
      break;
    case "retail":
      c.footer.thankYou.text = "Thank you for shopping with us";
      break;
    case "wholesale":
      c.table.itemStyle.size = 17;
      c.footer.thankYou.text = "Wholesale Invoice";
      break;
  }
  return c;
}
const LS_KEY = "invoice.designer.88.v4";
const LS_MODE = "invoice.designer.mode";
function defaultState() {
  const templates = {};
  for (const id of PRESET_IDS) templates[id] = preset(id);
  return { mode: "simple", activeId: "default", templates };
}
function deepMerge(base, inc) {
  if (Array.isArray(base)) return Array.isArray(inc) ? inc : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    if (inc && typeof inc === "object") {
      for (const k of Object.keys(inc)) {
        out[k] = k in base ? deepMerge(base[k], inc[k]) : inc[k];
      }
    }
    return out;
  }
  return inc ?? base;
}
function load88() {
  try {
    if (typeof window === "undefined") return defaultState();
    const raw = localStorage.getItem(LS_KEY);
    const mode = localStorage.getItem(LS_MODE) || "simple";
    if (!raw) return { ...defaultState(), mode };
    const parsed = JSON.parse(raw);
    const def = defaultState();
    const out = {
      mode: parsed.mode ?? mode,
      activeId: parsed.activeId ?? def.activeId,
      templates: { ...def.templates }
    };
    if (parsed.templates) {
      for (const id of Object.keys(parsed.templates)) {
        const base = def.templates[id] ?? defaultThermal88(id);
        out.templates[id] = deepMerge(base, parsed.templates[id]);
      }
    }
    if (!out.templates[out.activeId]) out.activeId = "default";
    return out;
  } catch {
    return defaultState();
  }
}
function getActive88() {
  const s = load88();
  return s.templates[s.activeId] ?? defaultThermal88();
}
const BRAND_DEFAULT$1 = "Azzouz WholeSale";
const BRAND_DEFAULT_AR = "عزوز للجملة";
const BRAND_ADDRESS = "Walyal Ahd, Makkah";
const BRAND_ADDRESS_AR = "ولي العهد، مكة المكرمة";
const BRAND_TAX_NO = "311339561300003";
const BRAND_MOBILE = "0553687388";
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function zatcaTlvBase64(opts) {
  const enc = new TextEncoder();
  const fields = [
    [1, enc.encode(opts.seller)],
    [2, enc.encode(opts.vat)],
    [3, enc.encode(opts.ts)],
    [4, enc.encode(opts.total)],
    [5, enc.encode(opts.vatAmt)]
  ];
  if (opts.invoiceHash) fields.push([6, enc.encode(opts.invoiceHash)]);
  if (opts.ecdsaSignature) fields.push([7, enc.encode(opts.ecdsaSignature)]);
  if (opts.publicKey) fields.push([8, enc.encode(opts.publicKey)]);
  if (opts.certSignature) fields.push([9, enc.encode(opts.certSignature)]);
  const parts = [];
  for (const [t, b] of fields) {
    parts.push(t, b.length, ...b);
  }
  let bin = "";
  const u8 = new Uint8Array(parts);
  for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode(...u8.subarray(i, i + 32768));
  return btoa(bin);
}
function styleCss(s, opts = {}) {
  const isAr = s.family === "arabic";
  const fam = isAr ? `"Cairo","Tajawal","Noto Sans Arabic",sans-serif` : `"Noto Sans","Helvetica Neue",Arial,"Segoe UI",sans-serif`;
  const size = Math.max(1, s.size);
  const lh = Math.max(0.5, s.lineHeight);
  const dir = isAr || opts.rtl ? "direction:rtl;unicode-bidi:embed;" : "";
  const weightNum = s.weight === "medium" ? 500 : s.weight === "regular" ? 400 : s.weight === "bold" ? 700 : s.bold ? 700 : 400;
  return [
    `font-family:${fam}`,
    `font-size:${size}px`,
    `font-weight:${weightNum}`,
    `text-align:${s.align}`,
    `line-height:${lh}`,
    s.letterSpacing ? `letter-spacing:${s.letterSpacing}px` : "",
    s.uppercase ? "text-transform:uppercase" : "",
    dir
  ].filter(Boolean).join(";") + ";";
}
function span(s, text, extra = "") {
  if (!text) return "";
  const lang = s.family === "arabic" ? ` lang="ar"` : "";
  return `<span style="${styleCss(s)}${extra}"${lang}>${esc(text)}</span>`;
}
function block(s, text, extra = "") {
  if (!text) return "";
  const lang = s.family === "arabic" ? ` lang="ar"` : "";
  return `<div style="${styleCss(s)}${extra}"${lang}>${esc(text)}</div>`;
}
function zatcaPayloadForInvoice(p, taxAmt) {
  const isoTs = (() => {
    const src = p.timestamp ?? [p.date, p.time].filter(Boolean).join(" ");
    const d = src instanceof Date ? src : new Date(src);
    return isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
  })();
  const zp = p.zatca ?? {};
  return zatcaTlvBase64({
    seller: p.brand ?? BRAND_DEFAULT$1,
    vat: BRAND_TAX_NO,
    ts: isoTs,
    total: p.total.toFixed(2),
    vatAmt: taxAmt.toFixed(2),
    invoiceHash: zp.invoiceHash,
    ecdsaSignature: zp.ecdsaSignature,
    publicKey: zp.publicKey,
    certSignature: zp.certSignature
  });
}
function createQrPngDataUrl(payload, sizePx, quietModules = 4) {
  if (typeof document === "undefined") throw new Error("QR PNG generation requires browser canvas");
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const moduleCount = Number(qr.modules.size);
  const data = qr.modules.data;
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
async function buildThermalReceiptHTML(p, opts = {}) {
  const cfg = opts.cfg ?? defaultThermal88();
  const currency = p.currency ?? "SAR";
  const taxAmt = p.tax ?? 0;
  const beforeTax = Math.max(0, p.subtotal - taxAmt);
  const disc = p.discount ?? 0;
  const paid = p.paidAmount ?? 0;
  const prevDue = p.previousDue ?? 0;
  const currentDue = Math.max(0, p.total - paid);
  const newDue = p.newDue ?? Math.max(0, prevDue + p.total - paid);
  const totalQty = p.items.reduce((s, it) => s + (it.qty || 0), 0);
  const isWalkIn = !p.partyName || /walk[- ]?in/i.test(p.partyName);
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
  const h = cfg.header;
  const hEn = h.en;
  const hAr = h.ar;
  const subEn = (delta, bold = false) => ({ ...hEn, size: Math.max(1, hEn.size - delta), bold, weight: bold ? "bold" : hEn.weight });
  const subAr = (delta, bold = false) => ({ ...hAr, size: Math.max(1, hAr.size - delta), bold, weight: bold ? "bold" : hAr.weight });
  const headerHtml = `
    <div class="header-block" style="margin-top:${h.marginTop}mm;margin-bottom:${h.marginBottom}mm;">
      ${h.show.brandAr ? block(hAr, p.brandAr || BRAND_DEFAULT_AR) : ""}
      ${h.show.brandEn ? block(hEn, p.brand ?? BRAND_DEFAULT$1) : ""}
      ${h.show.address ? block(subAr(4), BRAND_ADDRESS_AR) : ""}
      ${h.show.address ? block(subEn(7), BRAND_ADDRESS) : ""}
      ${h.show.phone ? block(subEn(7), `Tel: ${BRAND_MOBILE}`) : ""}
      ${h.show.vat ? block(subEn(7), `VAT: ${BRAND_TAX_NO}`) : ""}
      ${h.show.cr ? block(subEn(7), `CR: 1010101010`) : ""}
      ${h.show.email ? block(subEn(7), `info@example.com`) : ""}
      ${h.show.website ? block(subEn(7), `www.example.com`) : ""}
      ${block(subAr(2, true), "فاتورة ضريبية مبسطة")}
      ${block(subEn(6, true), "Simplified Tax Invoice")}
    </div>
  `;
  const infoVal = (key) => {
    switch (key) {
      case "invoiceNo":
        return String(p.invoiceNumber);
      case "date":
        return p.date;
      case "time":
        return p.time || null;
      case "customer":
        return isWalkIn ? "Cash Customer" : p.partyName;
      case "mobile":
        return isWalkIn ? null : p.partyMobile || null;
      case "payment":
        return p.paymentMethod ? p.paymentMethod.toUpperCase() : null;
      case "salesman":
        return p.createdBy || null;
    }
    return null;
  };
  const labelMap = {
    invoiceNo: "Invoice No",
    date: "Date",
    time: "Time",
    customer: "Customer",
    mobile: "Mobile",
    vatNumber: "Cust. VAT No",
    payment: "Payment",
    salesman: "Salesman"
  };
  const infoVal2 = (key) => {
    if (key === "vatNumber") {
      const v = p.partyTaxNo?.toString().trim();
      return v ? v : "N/A";
    }
    return infoVal(key);
  };
  const cell = (k) => {
    const f2 = cfg.info.fields[k];
    if (!f2 || !f2.show) return null;
    const val = infoVal2(k);
    if (val == null || val === "") return null;
    const rowStyle = { ...cfg.info.en, align: f2.align, bold: f2.bold, weight: f2.bold ? "bold" : cfg.info.en.weight };
    const labelStyle = { ...rowStyle, bold: false, weight: "regular" };
    const valueStyle = { ...rowStyle, bold: f2.bold || rowStyle.bold, weight: f2.bold ? "bold" : rowStyle.weight };
    const enLbl = labelMap[k] ?? "";
    const arLbl = f2.labelAr ?? "";
    const labelHtml = `<span class="ic-label" style="${styleCss(labelStyle)}color:#555;white-space:nowrap;direction:ltr;unicode-bidi:isolate;"><bdi dir="ltr">${esc(enLbl)}</bdi>` + (arLbl ? ` / <bdi dir="rtl">${esc(arLbl)}</bdi>` : "") + `<bdi dir="ltr"> : </bdi></span>`;
    return `<div class="ic" style="text-align:${f2.align};direction:ltr;unicode-bidi:isolate;">${labelHtml}<bdi dir="ltr">${span(valueStyle, val)}</bdi></div>`;
  };
  const fullRow = (k) => {
    const c = cell(k);
    if (!c) return "";
    return `<div class="irow-full">${c}</div>`;
  };
  const pairRow = (a, b) => {
    const ca = cell(a), cb = cell(b);
    if (!ca && !cb) return "";
    return `<div class="irow">${ca ?? '<div class="ic"></div>'}${cb ?? '<div class="ic"></div>'}</div>`;
  };
  const infoTop = [
    pairRow("invoiceNo", "payment"),
    pairRow("date", "time")
  ].filter(Boolean).join("");
  const infoBottom = [
    fullRow("customer"),
    fullRow("mobile"),
    fullRow("vatNumber"),
    fullRow("salesman")
  ].filter(Boolean).join("");
  const infoRowsHtml = `${infoTop}${infoTop && infoBottom ? '<div class="info-sep"></div>' : ""}${infoBottom}`;
  const t = cfg.table;
  const showCols = t.columns.filter((c) => c.visible);
  const colHas = (k) => showCols.some((c) => c.key === k);
  const itemRows = p.items.map((it) => {
    const lineTotal = it.qty * it.price;
    const arabicName = it.nameArabic || it.nameAr || "";
    const nameCell = colHas("item") ? `<div class="i-name" style="text-align:${t.itemStyle.align};">${block(t.itemStyle, it.name || "—")}${arabicName ? block(t.itemArStyle, arabicName) : ""}</div>` : `<div class="i-name"></div>`;
    const qtyCell = colHas("qty") ? `<span class="i-qty" style="text-align:${t.qtyStyle.align};">${span(t.qtyStyle, String(it.qty))}</span>` : `<span class="i-qty"></span>`;
    const rateCell = colHas("rate") ? `<span class="i-rate" style="text-align:${t.rateStyle.align};">${span(t.rateStyle, it.price.toFixed(2))}</span>` : `<span class="i-rate"></span>`;
    const totalCell = colHas("total") ? `<span class="i-tot" style="text-align:${t.totalStyle.align};">${span(t.totalStyle, lineTotal.toFixed(2))}</span>` : `<span class="i-tot"></span>`;
    return `<div class="product">${nameCell}<div class="value-row"><span></span>${qtyCell}${rateCell}${totalCell}</div></div>`;
  }).join("");
  const tableHeadHtml = `
    <div class="items-head">
      <span style="${styleCss(t.headerStyle)}">${colHas("item") ? esc(t.columns.find((c) => c.key === "item")?.label ?? "Item") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("qty") ? esc(t.columns.find((c) => c.key === "qty")?.label ?? "Qty") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("rate") ? esc(t.columns.find((c) => c.key === "rate")?.label ?? "Rate") : ""}</span>
      <span style="${styleCss(t.headerStyle)}">${colHas("total") ? esc(t.columns.find((c) => c.key === "total")?.label ?? "Total") : ""}</span>
    </div>`;
  const sumVal = (key) => {
    switch (key) {
      case "totalQty":
        return String(totalQty);
      case "subtotal":
        return `${beforeTax.toFixed(2)} ${currency}`;
      case "vat":
        return `${taxAmt.toFixed(2)} ${currency}`;
      case "discount":
        return disc > 0 ? `- ${disc.toFixed(2)} ${currency}` : null;
      case "grandTotal":
        return `${currency} ${p.total.toFixed(2)}`;
    }
    return null;
  };
  const sumHtml = cfg.summary.rows.filter((r) => r.visible).map((r) => {
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
    const enS = { ...cfg.summary.en, bold: r.bold || cfg.summary.en.bold, weight: r.bold ? "bold" : cfg.summary.en.weight };
    return `
      <div class="kv-row">
        <div class="kv-l">${block(enS, r.label)}${block(cfg.summary.ar, r.labelAr)}</div>
        <div class="kv-v">${span(cfg.summary.amount, v)}</div>
      </div>`;
  }).join("");
  const dueVal = (key) => {
    switch (key) {
      case "paid":
        return `${paid.toFixed(2)} ${currency}`;
      case "current":
        return `${currentDue.toFixed(2)} ${currency}`;
      case "previous":
        return `${prevDue.toFixed(2)} ${currency}`;
      case "new":
        return `${newDue.toFixed(2)} ${currency}`;
    }
    return "";
  };
  const dueHtml = cfg.due.rows.filter((r) => r.visible).map((r) => {
    const enS = { ...cfg.due.en, bold: r.bold || cfg.due.en.bold, weight: r.bold ? "bold" : cfg.due.en.weight };
    const amt = { ...cfg.due.amount, bold: r.bold || cfg.due.amount.bold, weight: r.bold ? "bold" : cfg.due.amount.weight };
    return `
      <div class="kv-row">
        <div class="kv-l">${block(enS, r.label)}${block(cfg.due.ar, r.labelAr)}</div>
        <div class="kv-v">${span(amt, dueVal(r.key))}</div>
      </div>`;
  }).join("");
  const qr = cfg.qr;
  const sp = { ...DEFAULT_SPACING, ...cfg.spacing ?? {} };
  const pl = cfg.printLayout ?? { leftMargin: 4, rightMargin: 4, topMargin: 1, bottomMargin: 1, safeMode: true };
  const cw = pl.safeMode ? { qty: 10, rate: 13, total: 16 } : { qty: 12, rate: 15, total: 18 };
  const qrTopPx = 8;
  const qrBotPx = 8;
  const qrHtml = qr.show ? `
    <div class="qrwrap" style="margin:${qrTopPx}px 0 ${qrBotPx}px;text-align:center;width:100%;">
      <div class="qrbox" style="display:inline-block;padding:14px;background:#fff;border:0;margin:0 auto;">
        ${qrImgHtml}
      </div>
      ${qr.captionShow ? `
        <div style="${styleCss({ family: "arabic", size: qr.captionArSize, bold: true, align: "center", lineHeight: 1.4, letterSpacing: 0 })};margin-top:4px;text-align:center;" lang="ar">امسح الرمز للتحقق - هيئة الزكاة والضريبة</div>
        <div style="${styleCss({ family: "english", size: qr.captionSize, bold: false, align: "center", lineHeight: 1.4, letterSpacing: 0 })};text-align:center;">ZATCA — Scan to verify</div>` : ""}
    </div>` : "";
  const f = cfg.footer;
  const centerStyle = (s) => ({ ...s, align: "center" });
  const footerHtml = `
    <div class="footer">
      ${f.thankYou.show ? block(centerStyle(f.thankYou.style), f.thankYou.text) : ""}
      ${f.thankYouAr.show ? block(centerStyle(f.thankYouAr.style), f.thankYouAr.text) : ""}
      ${f.custom.show ? block(centerStyle(f.custom.style), f.custom.text) : ""}
      ${f.social.show ? block(centerStyle(f.social.style), f.social.text) : ""}
      ${f.website.show ? block(centerStyle(f.website.style), f.website.text) : ""}
      ${f.phone.show ? block(centerStyle(f.phone.style), f.phone.text) : ""}
    </div>`;
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
function renderSections(cfg, parts) {
  const order = (cfg.sectionOrder?.length ? cfg.sectionOrder : DEFAULT_SECTION_ORDER).filter(
    (k, i, a) => a.indexOf(k) === i
  );
  const enabled = { ...DEFAULT_SECTION_ENABLED, ...cfg.sectionEnabled ?? {} };
  const out = [];
  const wrap = (key, html) => `<div data-section="${key}">${html}</div>`;
  for (const key of order) {
    if (!enabled[key]) continue;
    switch (key) {
      case "header":
        if (parts.headerHtml) out.push(wrap("header", parts.headerHtml + `<hr class="hr" />`));
        break;
      case "info":
        if (parts.infoRowsHtml) out.push(wrap("info", `<div class="info">${parts.infoRowsHtml}</div><hr class="hr-thin" />`));
        break;
      case "items":
        if (parts.itemRows) out.push(wrap("items", parts.tableHeadHtml + `<div class="items">${parts.itemRows}</div><hr class="hr" />`));
        break;
      case "summary":
        if (parts.sumHtml) out.push(wrap("summary", `<div class="summary">${parts.sumHtml}</div><hr class="hr-thin" />`));
        break;
      case "due":
        if (parts.dueHtml) out.push(wrap("due", `<div class="due">${parts.dueHtml}</div>`));
        break;
      case "qr":
        if (parts.qrHtml) out.push(wrap("qr", parts.qrHtml));
        break;
      case "footer":
        if (parts.footerHtml) out.push(wrap("footer", parts.footerHtml));
        break;
    }
  }
  return out.join("\n");
}
const PRINT_QR_SELECTOR = 'img[data-role="qr"], img[data-qr], .qrwrap img';
function waitForNextPaint(win, frames = 2) {
  const target = win ?? window;
  return new Promise((resolve) => {
    let count = 0;
    const tick = () => ++count >= frames ? resolve() : target.requestAnimationFrame(tick);
    target.requestAnimationFrame(tick);
  });
}
async function waitForIframeLoad(iframe) {
  const doc = iframe.contentDocument;
  if (doc?.readyState === "complete") {
    await waitForNextPaint(iframe.contentWindow);
    return;
  }
  await new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      iframe.removeEventListener("load", onLoad);
      reject(new Error("Timed out waiting for printed receipt iframe to load"));
    }, 5e3);
    const onLoad = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    iframe.addEventListener("load", onLoad, { once: true });
  });
  await waitForNextPaint(iframe.contentWindow);
}
async function waitForImageElement(img, label) {
  if (!img.complete) {
    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        reject(new Error(`${label} timed out while loading`));
      }, 5e3);
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
    await img.decode().catch((e) => {
      throw new Error(`${label} decode failed: ${e instanceof Error ? e.message : String(e)}`);
    });
  }
}
async function waitForAllImagesInsideIframe(doc) {
  const imgs = Array.from(doc.querySelectorAll("img"));
  await Promise.all(imgs.map((img, index) => waitForImageElement(img, `Printed receipt image ${index + 1}`)));
}
async function waitForQRImageInsideIframe(doc) {
  const qr = doc.querySelector(PRINT_QR_SELECTOR);
  console.log("[PrintedReceipt] QR tagName before export =", qr?.tagName ?? "(missing)");
  if (!qr) throw new Error("Printed receipt QR not loaded in share iframe: QR element missing");
  await waitForImageElement(qr, "Printed receipt QR");
  const rect = qr.getBoundingClientRect();
  if (!qr.complete || qr.naturalWidth === 0) throw new Error("Printed receipt QR not loaded in share iframe");
  if (rect.width <= 0 || rect.height <= 0) throw new Error(`Printed receipt QR has zero rendered size: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
  if (!qr.src.startsWith("data:image/png")) throw new Error("Printed receipt QR is not PNG");
  return qr;
}
async function prepareThermalPrintDom(p, cfgOverride, label = "print") {
  let cfg = cfgOverride;
  try {
    cfg = cfg ?? getActive88();
  } catch {
    cfg = void 0;
  }
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
    doc.open();
    doc.write(html);
    doc.close();
    await waitForIframeLoad(iframe);
    try {
      await doc.fonts?.ready;
    } catch {
    }
    const receipt = doc.querySelector(".receipt");
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
async function printThermalReceipt(p, cfgOverride) {
  const printed = await prepareThermalPrintDom(p, cfgOverride, "physical-print");
  setTimeout(() => {
    try {
      const win = printed.iframe.contentWindow;
      const doc = printed.doc;
      const receipt = printed.receipt;
      const body = doc.body;
      const html = doc.documentElement;
      const cs = win?.getComputedStyle(receipt);
      const csBody = win?.getComputedStyle(body);
      const csHtml = win?.getComputedStyle(html);
      const mmPerPx = 25.4 / 96;
      const toMm = (px) => `${(px * mmPerPx).toFixed(2)}mm`;
      console.log("[ThermalPrintAudit] === Width audit before window.print() ===");
      console.log("[ThermalPrintAudit] .receipt", {
        offsetWidth: receipt.offsetWidth,
        scrollWidth: receipt.scrollWidth,
        clientWidth: receipt.clientWidth,
        computedWidth: cs?.width,
        computedMinWidth: cs?.minWidth,
        computedMaxWidth: cs?.maxWidth,
        transform: cs?.transform,
        zoom: cs?.zoom,
        offsetWidthMm: toMm(receipt.offsetWidth)
      });
      console.log("[ThermalPrintAudit] body", {
        offsetWidth: body.offsetWidth,
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        computedWidth: csBody?.width,
        transform: csBody?.transform,
        zoom: csBody?.zoom,
        offsetWidthMm: toMm(body.offsetWidth)
      });
      console.log("[ThermalPrintAudit] html", {
        offsetWidth: html.offsetWidth,
        scrollWidth: html.scrollWidth,
        clientWidth: html.clientWidth,
        computedWidth: csHtml?.width,
        transform: csHtml?.transform,
        zoom: csHtml?.zoom,
        offsetWidthMm: toMm(html.offsetWidth)
      });
      console.log("[ThermalPrintAudit] iframe", {
        styleWidth: printed.iframe.style.width,
        clientWidth: printed.iframe.clientWidth,
        offsetWidth: printed.iframe.offsetWidth
      });
    } catch (e) {
      console.error("[ThermalPrintAudit] failed to read widths", e);
    }
    printed.iframe.contentWindow?.focus();
    printed.iframe.contentWindow?.print();
    setTimeout(() => printed.cleanup(), 2e3);
  }, 80);
}
async function captureReceiptAsPng(printed, label = "printed receipt") {
  const htmlToImage = await import("../_libs/html-to-image.mjs");
  const body = printed.doc.body;
  const receipt = printed.receipt;
  const charset = (printed.doc.characterSet || "").toUpperCase();
  console.log("[PrintedReceipt] iframe characterSet =", charset);
  if (charset && charset !== "UTF-8") {
    throw new Error(`Arabic encoding failed — iframe characterSet is ${charset}, expected UTF-8`);
  }
  const THERMAL_PX = 384;
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
  try {
    await printed.doc.fonts?.ready;
  } catch {
  }
  try {
    await document.fonts?.ready;
  } catch {
  }
  await new Promise((r) => setTimeout(r, 250));
  const txt = body.innerText || body.textContent || "";
  const hasArabic = /[\u0600-\u06FF]/.test(txt);
  const mojibakeMatch = txt.match(/[ØÙÞ]|ï»¿/);
  console.log("[PrintedReceipt] Arabic chars present =", hasArabic, "| mojibake match =", mojibakeMatch?.[0] ?? "none");
  if (mojibakeMatch && !hasArabic) {
    throw new Error(`Arabic encoding failed — found "${mojibakeMatch[0]}" without any Arabic codepoints`);
  }
  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await htmlToImage.getFontEmbedCSS(receipt);
    console.log("[PrintedReceipt] embedded font CSS length =", fontEmbedCSS.length);
  } catch (e) {
    console.warn("[PrintedReceipt] font embed CSS failed", e);
  }
  const width = Math.max(THERMAL_PX, receipt.scrollWidth, body.scrollWidth);
  const height = Math.max(receipt.scrollHeight, body.scrollHeight, receipt.getBoundingClientRect().height);
  const images = Array.from(receipt.querySelectorAll("img"));
  console.log(`[IMG-DEBUG] inspecting ${images.length} <img> elements before export`);
  for (const img of images) {
    const srcShort = img.src.length > 120 ? img.src.slice(0, 80) + "…[" + img.src.length + " chars]" : img.src;
    console.log("[IMG-DEBUG]", srcShort, "complete=", img.complete, "naturalW=", img.naturalWidth, "naturalH=", img.naturalHeight, "role=", img.dataset.role ?? "(none)");
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      try {
        await img.decode();
      } catch {
      }
    }
    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      const role = img.dataset.role ?? (img.classList.contains("qr") ? "qr" : img.alt || "unknown");
      const reason = !img.complete ? "not loaded (complete=false)" : "decoded to 0×0";
      console.error("FAILED IMAGE:\n" + img.src + "\nrole: " + role + "\nreason: " + reason);
      throw new Error(`Image failed to load before export — ${role}: ${reason}
src: ${img.src}`);
    }
  }
  const dataUrl = await htmlToImage.toPng(receipt, {
    pixelRatio: 3,
    backgroundColor: "#ffffff",
    width,
    height,
    cacheBust: true,
    fontEmbedCSS,
    style: {
      transform: "none",
      margin: "0",
      background: "#ffffff"
    }
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  console.log("[PrintedReceipt] PNG capture complete", { label, width, height, size: blob.size });
  return { blob, width, height };
}
async function renderPrintedThermalReceiptImage(p, cfgOverride) {
  const printed = await prepareThermalPrintDom(p, cfgOverride, "share-printed-receipt-png");
  try {
    const cap = await captureReceiptAsPng(printed, "share printed receipt (PNG)");
    return cap.blob;
  } finally {
    printed.cleanup();
  }
}
function errorInfo(e) {
  if (e instanceof Error) {
    return {
      exception: `${e.name || "Error"}: ${e.message || String(e)}`,
      stack: e.stack || `${e.name || "Error"}: ${e.message || String(e)}`
    };
  }
  if (typeof Event !== "undefined" && e instanceof Event) {
    const target = e.target instanceof Element ? `${e.target.tagName.toLowerCase()}${e.target.id ? `#${e.target.id}` : ""}${e.target.className ? `.${String(e.target.className).trim().replace(/\s+/g, ".")}` : ""}` : "unknown target";
    const message = `Event: ${e.type || "unknown"} (${target})`;
    return { exception: message, stack: message };
  }
  return { exception: String(e), stack: String(e) };
}
function describeThermalExportError(e) {
  const maybe = e;
  if (maybe?.details?.functionName) return maybe.details;
  const info = errorInfo(e);
  return {
    step: "Unknown step",
    functionName: e instanceof Error && e.stack ? e.stack.split("\n")[1]?.trim() || e.name || "unknown()" : "unknown()",
    exception: info.exception,
    stack: info.stack
  };
}
const BRAND_DEFAULT = "Azzouz WholeSale";
async function renderInvoiceImageByFormat(p, _format) {
  console.log("[InvoiceRender] Receipt Source: ThermalReceipt (print DOM)", { note: "Share == Print: single 80mm pipeline" });
  return await renderPrintedThermalReceiptImage(p);
}
function caption(p, extra) {
  return extra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber} — ${p.brand ?? BRAND_DEFAULT}`;
}
async function shareInvoiceWithFormat(p, format, captionExtra) {
  const tag = "[InvoiceShare]";
  let blob = null;
  let file = null;
  try {
    console.log(`${tag} step=start`, {
      invoiceNumber: p.invoiceNumber,
      kind: p.kind,
      customer: p.partyName,
      format,
      itemCount: p.items?.length ?? 0
    });
    const ext = "png";
    const mime = "image/png";
    try {
      console.log(`${tag} step=render-image (thermal88 master)`);
      blob = await renderInvoiceImageByFormat(p, format);
      console.log(`${tag} step=render-image ok`, { size: blob.size, type: blob.type });
    } catch (pngErr) {
      const d = describeThermalExportError(pngErr);
      console.error(`${tag} render FAILED
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`, pngErr);
      toast.error(`Failed at ${d.functionName}: ${d.exception}`);
      return;
    }
    try {
      const fileName = `${p.kind}_${p.invoiceNumber}_${format}_${Date.now()}.${ext}`;
      file = new File([blob], fileName, { type: mime });
      console.log(`${tag} step=file-created`, { name: file.name, size: file.size, mime });
    } catch (fileErr) {
      const d = describeThermalExportError(fileErr);
      console.error(`${tag} file creation FAILED
Failed at:
new File()
Reason:
${d.exception}
Stack trace:
${d.stack}`, fileErr);
      toast.error(`Failed at new File(): ${d.exception}`);
      return;
    }
    const cap = caption(p, captionExtra);
    const nav = navigator;
    const canNativeShare = typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && typeof nav.share === "function";
    console.log(`${tag} step=share-check`, {
      canNativeShare,
      hasShare: typeof nav.share === "function",
      hasCanShare: typeof nav.canShare === "function"
    });
    console.log(`${tag} Step 7: Share started`, { functionName: "shareInvoiceWithFormat()", canNativeShare });
    if (canNativeShare) {
      try {
        console.log(`${tag} step=navigator.share opening`, { functionName: "navigator.share()", file: file.name, size: file.size });
        await nav.share({ files: [file], text: cap });
        console.log(`${tag} step=native-share ok`);
        return;
      } catch (shareErr) {
        if (shareErr?.name === "AbortError") {
          console.log(`${tag} step=native-share aborted by user`);
          return;
        }
        const d = describeThermalExportError(shareErr);
        console.error(`${tag} native share FAILED
Failed at:
navigator.share()
Reason:
${d.exception}
Stack trace:
${d.stack}`, shareErr);
        toast.message(`Share API failed: ${d.exception} — downloading image instead`);
      }
    } else {
      console.warn(`${tag} Native Share API not available — downloading instead`);
      toast.message("Native Share not supported — downloading image");
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      console.log(`${tag} step=download ok`);
      toast.success("Image downloaded — attach it in WhatsApp");
      window.open(`https://wa.me/?text=${encodeURIComponent(cap)}`, "_blank");
    } catch (dlErr) {
      const d = describeThermalExportError(dlErr);
      console.error(`${tag} download FAILED
Failed at:
downloadFallback()
Reason:
${d.exception}
Stack trace:
${d.stack}`, dlErr);
      toast.error(`Failed at downloadFallback(): ${d.exception}`);
    }
  } catch (e) {
    if (e?.name === "AbortError") return;
    const d = describeThermalExportError(e);
    console.error(`${tag} FATAL
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`, e);
    toast.error(`Failed at ${d.functionName}: ${d.exception}`);
  }
}
async function downloadInvoiceImage(p, format) {
  const tag = "[InvoiceImage]";
  try {
    console.log(`${tag} step=render format=${format} inv=${p.invoiceNumber}`);
    const blob = await renderInvoiceImageByFormat(p, format);
    console.log(`${tag} step=render ok size=${blob.size}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.kind}_${p.invoiceNumber}_${format}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Image downloaded");
  } catch (e) {
    const d = describeThermalExportError(e);
    console.error(`${tag} FAILED
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`, e);
    toast.error(`Failed at ${d.functionName}: ${d.exception}`);
  }
}
const INVOICE_PICKER_EVENT = "lovable:invoice-share";
function openInvoiceShare(_payload, _captionExtra) {
  console.warn("[InvoiceLockdown] openInvoiceShare blocked — Legacy Invoice System Disabled");
  try {
    toast.message("Legacy Invoice System Disabled", { description: "Thermal receipts are temporarily unavailable while the new invoice system is being built." });
  } catch {
  }
}
export {
  INVOICE_PICKER_EVENT as I,
  downloadInvoiceImage as a,
  describeThermalExportError as d,
  openInvoiceShare as o,
  printThermalReceipt as p,
  renderInvoiceImageByFormat as r,
  shareInvoiceWithFormat as s
};
