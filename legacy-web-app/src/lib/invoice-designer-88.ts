// Invoice Designer v4 — 88mm thermal receipt configuration.
// Self-contained schema + persistence. Used by both the designer UI
// (live preview) and the print engine, so preview = printed output.

export type Align = "left" | "center" | "right";
export type FontFamily = "english" | "arabic";

export type FontWeight = "regular" | "medium" | "bold";

export interface TextStyle {
  family: FontFamily;
  size: number;        // px
  bold: boolean;
  weight?: FontWeight; // optional explicit weight (overrides bold when present)
  align: Align;
  lineHeight: number;
  letterSpacing: number;
  uppercase?: boolean;
}

export const ARABIC_FONTS = ["Cairo", "Tajawal", "Noto Sans Arabic"] as const;
export const ENGLISH_FONTS = ["Noto Sans", "Helvetica, Arial, sans-serif", "Arial, sans-serif"] as const;

export type HeaderField =
  | "logo" | "brandEn" | "brandAr" | "shopName" | "address"
  | "phone" | "vat" | "cr" | "email" | "website";

export const HEADER_FIELDS: { key: HeaderField; label: string }[] = [
  { key: "logo", label: "Logo" },
  { key: "brandEn", label: "English Company Name" },
  { key: "brandAr", label: "Arabic Company Name" },
  { key: "shopName", label: "Shop Name" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "vat", label: "VAT" },
  { key: "cr", label: "CR" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
];

export type InfoFieldKey = "invoiceNo" | "date" | "time" | "customer" | "mobile" | "vatNumber" | "payment" | "salesman";
export const INFO_FIELDS: { key: InfoFieldKey; label: string; labelAr: string }[] = [
  { key: "invoiceNo", label: "Invoice No",     labelAr: "رقم الفاتورة" },
  { key: "date",      label: "Date",           labelAr: "التاريخ" },
  { key: "time",      label: "Time",           labelAr: "الوقت" },
  { key: "customer",  label: "Customer",       labelAr: "العميل" },
  { key: "mobile",    label: "Mobile",         labelAr: "الجوال" },
  { key: "vatNumber", label: "Cust. VAT No",   labelAr: "الرقم الضريبي للعميل" },
  { key: "payment",   label: "Payment",        labelAr: "الدفع" },
  { key: "salesman",  label: "Salesman",       labelAr: "البائع" },
];

/** Layout & Spacing — adjustable gaps (only spacing, never the item layout). */
export interface SpacingConfig {
  sectionGap: number;       // px — global gap between major sections
  productRowGap: number;    // px
  summaryRowGap: number;    // px
  dueRowGap: number;        // px
  headerBottomGap: number;  // px
  footerTopGap: number;     // px
  qrTopMargin: number;      // px
  qrBottomMargin: number;   // px
  grandTopPadding: number;  // px
  grandBottomPadding: number; // px
  topMargin: number;        // px — paper top margin
  bottomMargin: number;     // px — paper bottom margin
  /** NEW — product row layout (px). */
  productNameValueGap: number;   // gap between Product Name and value row
  productRowMinHeight: number;   // min total height per product row (0 = off)
  separatorTopGap: number;       // space above dotted separator
  separatorBottomGap: number;    // space below dotted separator
}

export const DEFAULT_SPACING: SpacingConfig = {
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
  separatorBottomGap: 2,
};


export type SectionKey = "header" | "info" | "items" | "summary" | "due" | "qr" | "footer";
export const DEFAULT_SECTION_ORDER: SectionKey[] = ["header","info","items","summary","due","qr","footer"];
export const DEFAULT_SECTION_ENABLED: Record<SectionKey, boolean> = {
  header: true, info: true, items: true, summary: true, due: true, qr: true, footer: true,
};

export type ColKey = "item" | "qty" | "rate" | "total" | "custom";
export interface ColumnDef {
  id: string;
  key: ColKey;
  label: string;
  labelAr: string;
  width: number;        // % of row
  align: Align;
  visible: boolean;
}

export type SummaryKey = "totalQty" | "subtotal" | "vat" | "discount" | "grandTotal";
export interface SummaryRow {
  id: string;
  key: SummaryKey | "custom";
  label: string;
  labelAr: string;
  visible: boolean;
  bold: boolean;
}

export type DueKey = "paid" | "current" | "previous" | "new";
export interface DueRow {
  id: string;
  key: DueKey;
  label: string;
  labelAr: string;
  visible: boolean;
  bold: boolean;
}

export interface Thermal88Config {
  templateName: string;

  sectionOrder: SectionKey[];
  sectionEnabled: Record<SectionKey, boolean>;

  /** Paper print layout (mm) — controls printable area / margins. */
  printLayout: {
    leftMargin: number;   // mm
    rightMargin: number;  // mm
    topMargin: number;    // mm
    bottomMargin: number; // mm
    safeMode: boolean;    // auto-shrink to avoid clipping
  };

  header: {

    show: Record<HeaderField, boolean>;
    en: TextStyle;
    ar: TextStyle;
    marginTop: number;
    marginBottom: number;
  };

  spacing: SpacingConfig;

  info: {
    fields: Record<InfoFieldKey, { show: boolean; labelAr: string; bold: boolean; align: Align }>;
    en: TextStyle;
    ar: TextStyle;
  };

  table: {
    columns: ColumnDef[];
    rowSpacing: number;
    padding: number;
    multiLine: boolean;
    headerStyle: TextStyle;
    itemStyle: TextStyle;
    itemArStyle: TextStyle;
    qtyStyle: TextStyle;
    rateStyle: TextStyle;
    totalStyle: TextStyle;
  };

  summary: {
    rows: SummaryRow[];
    en: TextStyle;
    ar: TextStyle;
    amount: TextStyle;
    grandTotal: TextStyle;
    grandTotalAr: TextStyle;
  };

  due: {
    rows: DueRow[];
    en: TextStyle;
    ar: TextStyle;
    amount: TextStyle;
  };

  qr: {
    show: boolean;
    size: number;          // mm
    margin: number;        // mm (inner padding)
    align: Align;
    marginTop: number;     // mm
    marginBottom: number;  // mm
    captionShow: boolean;
    captionSize: number;
    captionArSize: number;
    highQuality: boolean;
  };

  footer: {
    thankYou:      { show: boolean; text: string; style: TextStyle };
    thankYouAr:    { show: boolean; text: string; style: TextStyle };
    amountInWords: { show: boolean; style: TextStyle };
    custom:        { show: boolean; text: string; style: TextStyle };
    social:        { show: boolean; text: string; style: TextStyle };
    website:       { show: boolean; text: string; style: TextStyle };
    phone:         { show: boolean; text: string; style: TextStyle };
  };
}

/* ───── Defaults ───── */

const en = (size: number, opts: Partial<TextStyle> = {}): TextStyle => ({
  family: "english", size, bold: false, align: "left",
  lineHeight: 1.1, letterSpacing: 0, uppercase: false, ...opts,
});
const ar = (size: number, opts: Partial<TextStyle> = {}): TextStyle => ({
  family: "arabic", size, bold: true, align: "center",
  lineHeight: 1.2, letterSpacing: 0, ...opts,
});

export function defaultThermal88(name = "Default"): Thermal88Config {
  return {
    templateName: name,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionEnabled: { ...DEFAULT_SECTION_ENABLED },
    printLayout: { leftMargin: 4, rightMargin: 4, topMargin: 1, bottomMargin: 1, safeMode: true },
    header: {
      show: { logo: false, brandEn: true, brandAr: true, shopName: false, address: true, phone: true, vat: true, cr: false, email: false, website: false },
      en: en(21, { bold: true, align: "center" }),
      ar: ar(18, { align: "center" }),
      marginTop: 0, marginBottom: 1,
    },
    spacing: { ...DEFAULT_SPACING },
    info: {
      fields: {
        invoiceNo: { show: true,  labelAr: "رقم الفاتورة", bold: true,  align: "left" },
        date:      { show: true,  labelAr: "التاريخ",      bold: false, align: "left" },
        time:      { show: true,  labelAr: "الوقت",        bold: false, align: "left" },
        customer:  { show: true,  labelAr: "العميل",       bold: true,  align: "left" },
        mobile:    { show: true,  labelAr: "الجوال",       bold: false, align: "left" },
        vatNumber: { show: true,  labelAr: "الرقم الضريبي", bold: true,  align: "left" },
        payment:   { show: true,  labelAr: "الدفع",        bold: false, align: "left" },
        salesman:  { show: false, labelAr: "البائع",       bold: false, align: "left" },
      },
      en: en(13),
      ar: ar(13, { align: "right" }),
    },
    table: {
      columns: [
        { id: "c1", key: "item",  label: "Item",  labelAr: "الصنف", width: 100, align: "left",  visible: true },
        { id: "c2", key: "qty",   label: "Qty",   labelAr: "الكمية", width: 0,  align: "left",  visible: true },
        { id: "c3", key: "rate",  label: "Rate",  labelAr: "السعر",  width: 0,  align: "left",  visible: true },
        { id: "c4", key: "total", label: "Total", labelAr: "الإجمالي", width: 0, align: "right", visible: true },
      ],
      rowSpacing: 0.3,
      padding: 0,
      multiLine: true,
      headerStyle: en(12, { bold: true, uppercase: true, weight: "bold" }),
      itemStyle:   en(13, { bold: true,  weight: "bold" }),
      itemArStyle: ar(12, { align: "right", bold: false, weight: "regular" }),
      qtyStyle:    en(13, { weight: "regular" }),
      rateStyle:   en(13, { weight: "regular" }),
      totalStyle:  en(13, { bold: true, align: "right", weight: "bold" }),
    },
    summary: {
      rows: [
        { id: "s1", key: "totalQty",   label: "Total Qty",  labelAr: "إجمالي الكمية",        visible: true, bold: false },
        { id: "s2", key: "subtotal",   label: "Subtotal",   labelAr: "المجموع الفرعي",      visible: true, bold: false },
        { id: "s3", key: "vat",        label: "VAT 15%",    labelAr: "ضريبة القيمة المضافة", visible: true, bold: false },
        { id: "s4", key: "discount",   label: "Discount",   labelAr: "الخصم",                visible: true, bold: false },
        { id: "s5", key: "grandTotal", label: "Grand Total", labelAr: "الإجمالي الكلي",       visible: true, bold: true },
      ],
      en: en(14, { bold: true }),
      ar: ar(13, { align: "right" }),
      amount: en(15, { bold: true, align: "right" }),
      grandTotal: en(22, { bold: true, align: "center", letterSpacing: 0.5 }),
      grandTotalAr: ar(14, { align: "center" }),
    },
    due: {
      rows: [
        { id: "d1", key: "paid",     label: "Paid Amount",  labelAr: "المبلغ المدفوع", visible: true, bold: false },
        { id: "d2", key: "current",  label: "Current Due",  labelAr: "المستحق الحالي",  visible: true, bold: false },
        { id: "d3", key: "previous", label: "Previous Due", labelAr: "الرصيد السابق",  visible: true, bold: false },
        { id: "d4", key: "new",      label: "New Due",      labelAr: "الرصيد الجديد",  visible: true, bold: true  },
      ],
      en: en(14),
      ar: ar(13, { align: "right" }),
      amount: en(15, { bold: true, align: "right" }),
    },
    qr: {
      show: true, size: 30, margin: 2, align: "center",
      marginTop: 6, marginBottom: 4,
      captionShow: true, captionSize: 10, captionArSize: 12,
      highQuality: true,
    },
    footer: {
      thankYou:      { show: true,  text: "Thank You",            style: en(15, { bold: true, align: "center" }) },
      thankYouAr:    { show: true,  text: "شكراً لزيارتكم",         style: ar(13, { align: "center" }) },
      amountInWords: { show: true,                                style: en(11, { align: "center" }) },
      custom:        { show: false, text: "",                     style: en(12, { align: "center" }) },
      social:        { show: false, text: "",                     style: en(11, { align: "center" }) },
      website:       { show: false, text: "",                     style: en(11, { align: "center" }) },
      phone:         { show: true,  text: "WhatsApp: 0553687388", style: en(12, { align: "center" }) },
    },
  };
}

/* ───── Presets ───── */

export const PRESET_IDS = ["default", "retail", "wholesale", "mini", "premium", "simple"] as const;
export type PresetId = typeof PRESET_IDS[number];
export const PRESET_LABELS: Record<PresetId, string> = {
  default: "Default", retail: "Retail", wholesale: "Wholesale",
  mini: "Mini", premium: "Premium", simple: "Simple",
};

export function preset(id: PresetId): Thermal88Config {
  const c = defaultThermal88(PRESET_LABELS[id]);
  switch (id) {
    case "mini":
      c.header.en.size = 17; c.header.ar.size = 15;
      c.table.itemStyle.size = 14; c.table.itemArStyle.size = 12;
      c.qr.size = 36;
      c.footer.amountInWords.show = false;
      break;
    case "premium":
      c.header.en.size = 24; c.header.en.letterSpacing = 1;
      c.header.ar.size = 20;
      c.summary.grandTotal.size = 26;
      c.qr.size = 46;
      break;
    case "simple":
      c.header.show.vat = false; c.header.show.cr = false;
      c.due.rows = c.due.rows.map(r => ({ ...r, visible: r.key === "paid" || r.key === "new" }));
      c.summary.rows = c.summary.rows.map(r => ({ ...r, visible: r.key !== "discount" }));
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

/* ───── Persistence ───── */

const LS_KEY  = "invoice.designer.88.v4";
const LS_MODE = "invoice.designer.mode";

export interface Designer88State {
  mode: "simple" | "advanced";
  activeId: string;
  templates: Record<string, Thermal88Config>;
}

function defaultState(): Designer88State {
  const templates: Record<string, Thermal88Config> = {};
  for (const id of PRESET_IDS) templates[id] = preset(id);
  return { mode: "simple", activeId: "default", templates };
}

function deepMerge<T>(base: T, inc: any): T {
  if (Array.isArray(base)) return (Array.isArray(inc) ? inc : base) as T;
  if (base && typeof base === "object") {
    const out: any = { ...(base as any) };
    if (inc && typeof inc === "object") {
      for (const k of Object.keys(inc)) {
        out[k] = k in (base as any) ? deepMerge((base as any)[k], inc[k]) : inc[k];
      }
    }
    return out;
  }
  return (inc ?? base) as T;
}

export function load88(): Designer88State {
  try {
    if (typeof window === "undefined") return defaultState();
    const raw = localStorage.getItem(LS_KEY);
    const mode = (localStorage.getItem(LS_MODE) as "simple" | "advanced") || "simple";
    if (!raw) return { ...defaultState(), mode };
    const parsed = JSON.parse(raw) as Partial<Designer88State>;
    const def = defaultState();
    const out: Designer88State = {
      mode: parsed.mode ?? mode,
      activeId: parsed.activeId ?? def.activeId,
      templates: { ...def.templates },
    };
    if (parsed.templates) {
      for (const id of Object.keys(parsed.templates)) {
        const base = def.templates[id] ?? defaultThermal88(id);
        out.templates[id] = deepMerge(base, (parsed.templates as any)[id]);
      }
    }
    if (!out.templates[out.activeId]) out.activeId = "default";
    return out;
  } catch { return defaultState(); }
}

export function save88(s: Designer88State) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
    localStorage.setItem(LS_MODE, s.mode);
    window.dispatchEvent(new CustomEvent("lovable:invoice-designer-88-changed"));
  } catch {}
}

export function getActive88(): Thermal88Config {
  const s = load88();
  return s.templates[s.activeId] ?? defaultThermal88();
}
