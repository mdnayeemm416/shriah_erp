// Lightweight canvas-based invoice image renderer for WhatsApp sharing.
// Produces a single PNG blob — no DOM mount needed.

import { toast } from "sonner";
import QRCode from "qrcode";

const INVOICE_COLORS = {
  paper: "#fffdfa",
  panel: "#f7f4ee",
  panelSoft: "#fbfaf7",
  line: "#d8d3c8",
  ink: "#1f2933",
  muted: "#59636e",
  emerald: "#047857",
  emeraldDark: "#064e3b",
  emeraldSoft: "#ecfdf5",
  danger: "#9f1239",
  success: "#047857",
};

/** Encode the ZATCA VAT QR payload as Base64 TLV text (tags 1..5). */
function zatcaTlvBase64(
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
  for (let i = 0; i < u8.length; i += 0x8000) {
    bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

function invoiceTimestamp(p: Pick<InvoicePayload, "date" | "time" | "timestamp">): string {
  const source: string | Date = p.timestamp ?? [p.date, p.time].filter(Boolean).join(" ");
  const parsed = source instanceof Date ? source : new Date(source);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function drawQrMatrix(
  ctx: CanvasRenderingContext2D,
  payload: string,
  x: number,
  y: number,
  size: number,
) {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "Q" }) as any;
  const moduleCount = qr.modules.size as number;
  const data = qr.modules.data as ArrayLike<boolean>;
  const quietModules = 4;
  const moduleSize = Math.max(4, Math.floor(size / (moduleCount + quietModules * 2)));
  const actualSize = moduleSize * (moduleCount + quietModules * 2);
  const ox = Math.round(x + (size - actualSize) / 2);
  const oy = Math.round(y + (size - actualSize) / 2);

  const prevSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(ox, oy, actualSize, actualSize);
  ctx.fillStyle = "#000000";
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (data[row * moduleCount + col]) {
        ctx.fillRect(
          ox + (col + quietModules) * moduleSize,
          oy + (row + quietModules) * moduleSize,
          moduleSize,
          moduleSize,
        );
      }
    }
  }
  ctx.imageSmoothingEnabled = prevSmoothing;
}

export type InvoiceLine = {
  name: string;
  qty: number;
  price: number; // unit price (VAT incl)
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = String(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW) {
      if (line) lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

export type InvoicePayload = {
  kind: "sale" | "purchase" | "order";
  invoiceNumber: number | string;
  date: string; // formatted date
  time?: string; // formatted time (optional)
  timestamp?: string | Date; // actual invoice timestamp for ZATCA QR
  createdBy?: string;
  partyLabel: string; // "Customer" / "Supplier"
  partyName: string;
  partyMobile?: string;
  partyTaxNo?: string;
  items: InvoiceLine[];
  subtotal: number; // VAT-inclusive sum of line totals
  discount?: number;
  tax?: number; // VAT component included in subtotal
  total: number;
  notes?: string;
  brand?: string;
  currency?: string;
  paymentMethod?: string;
  paidAmount?: number;
  previousDue?: number;
  newDue?: number;
};

// Company header — Azzouz WholeSale defaults
const BRAND_DEFAULT = "Azzouz WholeSale";
const BRAND_ADDRESS = "Walyal Ahd, Makkah";
const BRAND_TAX_NO = "311339561300003";
const BRAND_MOBILE = "0553687388";
const FONT = "Helvetica, Arial, system-ui, sans-serif";

function fmt(n: number, currency = "SAR") {
  return `${currency} ${n.toFixed(2)}`;
}

export async function renderInvoiceImage(p: InvoicePayload): Promise<Blob> {
  const W = 1000;
  const PAD = 40;
  const currency = p.currency ?? "SAR";
  const kindLabel =
    p.kind === "sale" ? "TAX INVOICE" :
    p.kind === "purchase" ? "PURCHASE INVOICE" :
    "CUSTOMER ORDER";

  // Pre-measure rows (larger font + taller rows)
  const off = document.createElement("canvas").getContext("2d")!;
  off.font = `600 24px ${FONT}`;
  const nameColW = W - PAD * 2 - 32 - 60 - 160 - 110 - 170;
  const itemBlocks = p.items.map((it, idx) => {
    const lines = wrap(off, it.name || "—", nameColW);
    return { ...it, lines, serial: idx + 1 };
  });
  const ROW_LINE_H = 30;
  const itemsBodyH = itemBlocks.reduce(
    (s, b) => s + Math.max(54, b.lines.length * ROW_LINE_H + 20),
    0
  );

  // Generate QR using the official Saudi VAT TLV payload (Base64 text, tags 1..5).
  const isoTs = invoiceTimestamp(p);
  const taxAmtForQr = (p.tax ?? 0).toFixed(2);
  const totalForQr = p.total.toFixed(2);
  const qrPayload = zatcaTlvBase64(
    BRAND_DEFAULT,
    BRAND_TAX_NO,
    isoTs,
    totalForQr,
    taxAmtForQr,
  );
  const QR_SIZE = 300;

  // Sizing
  const headerH = 220;
  const metaH = 170;
  const tableHeadH = 50;
  const tableH = tableHeadH + itemsBodyH + 18;
  const showLedger = p.paidAmount != null || p.previousDue != null || p.newDue != null;
  const totalsH = 210 + (p.discount && p.discount > 0 ? 36 : 0);
  const payH = showLedger ? 230 : 60;
  const notesH = p.notes ? 90 : 0;
  const footerH = QR_SIZE + 90; // QR + thank-you
  const H = PAD + headerH + metaH + tableH + totalsH + payH + notesH + footerH;

  // Hi-res canvas (2x) for crisp WhatsApp/screenshot/print output
  const SCALE = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = INVOICE_COLORS.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";

  /* --------- COMPANY HEADER (centered) --------- */
  let y = PAD;
  ctx.fillStyle = INVOICE_COLORS.emeraldDark;
  ctx.textAlign = "center";
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText(p.brand ?? BRAND_DEFAULT, W / 2, y);
  y += 56;
  ctx.font = `500 20px ${FONT}`;
  ctx.fillStyle = INVOICE_COLORS.muted;
  ctx.fillText(BRAND_ADDRESS, W / 2, y); y += 28;
  ctx.fillText(`Tax No: ${BRAND_TAX_NO}    |    Mobile: ${BRAND_MOBILE}`, W / 2, y);
  y += 34;

  // Invoice title chip
  ctx.font = `800 22px ${FONT}`;
  const chipW = ctx.measureText(kindLabel).width + 48;
  const chipX = (W - chipW) / 2;
  roundRect(ctx, chipX, y, chipW, 38, 6);
  ctx.fillStyle = INVOICE_COLORS.emeraldDark;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillText(kindLabel, W / 2, y + 8);
  y += 50;

  // divider
  ctx.strokeStyle = INVOICE_COLORS.emeraldDark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();
  ctx.textAlign = "left";

  /* --------- META --------- */
  y += 18;
  const metaTop = y;
  const colW = (W - PAD * 2 - 30) / 2;
  const labelFont = `700 14px ${FONT}`;
  const valueFont = `600 18px ${FONT}`;

  const drawField = (lbl: string, val: string, x: number, yy: number) => {
    ctx.fillStyle = INVOICE_COLORS.muted;
    ctx.font = labelFont;
    ctx.fillText(lbl.toUpperCase(), x, yy);
    ctx.fillStyle = INVOICE_COLORS.ink;
    ctx.font = valueFont;
    ctx.fillText(val || "—", x, yy + 18);
  };

  drawField(`${p.partyLabel} Name`, p.partyName, PAD, metaTop);
  drawField("Mobile No", p.partyMobile ?? "—", PAD, metaTop + 46);
  drawField("Cust. VAT No / الرقم الضريبي", (p.partyTaxNo?.toString().trim() || "N/A"), PAD, metaTop + 92);

  const rx = PAD + colW + 30;
  drawField("Invoice No", `#${p.invoiceNumber}`, rx, metaTop);
  drawField("Date", p.date, rx + 220, metaTop);
  drawField("Time", p.time ?? "—", rx, metaTop + 46);
  drawField("Created By", p.createdBy ?? "—", rx + 220, metaTop + 46);
  drawField("Payment", (p.paymentMethod ?? "—").toUpperCase(), rx, metaTop + 92);

  y = metaTop + metaH - 18;

  ctx.strokeStyle = INVOICE_COLORS.line;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();

  /* --------- PRODUCT TABLE --------- */
  const colS = PAD + 8;
  const colItem = PAD + 60;
  const colPrice = W - PAD - 380;
  const colQty = W - PAD - 220;
  const colTotal = W - PAD - 8;

  // header
  ctx.fillStyle = INVOICE_COLORS.emeraldDark;
  ctx.fillRect(PAD, y + 4, W - PAD * 2, tableHeadH);
  ctx.fillStyle = "#fff";
  ctx.font = `700 18px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText("#", colS, y + 20);
  ctx.fillText("ITEM", colItem, y + 20);
  ctx.textAlign = "right";
  ctx.fillText("PRICE", colPrice, y + 20);
  ctx.textAlign = "center";
  ctx.fillText("QTY", colQty, y + 20);
  ctx.textAlign = "right";
  ctx.fillText("TOTAL", colTotal, y + 20);
  ctx.textAlign = "left";

  let ry = y + 4 + tableHeadH + 14;
  for (const b of itemBlocks) {
    const rowH = Math.max(54, b.lines.length * ROW_LINE_H + 20);
    if (b.serial % 2 === 0) {
      ctx.fillStyle = INVOICE_COLORS.panel;
      ctx.fillRect(PAD, ry - 10, W - PAD * 2, rowH);
    }
    ctx.fillStyle = INVOICE_COLORS.ink;
    ctx.font = `600 20px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(String(b.serial), colS, ry);
    ctx.font = `600 22px ${FONT}`;
    b.lines.forEach((ln, i) => ctx.fillText(ln, colItem, ry + i * ROW_LINE_H));

    ctx.textAlign = "right";
    ctx.font = `500 20px ${FONT}`;
    ctx.fillText(b.price.toFixed(2), colPrice, ry);
    ctx.textAlign = "center";
    ctx.fillText(String(b.qty), colQty, ry);
    ctx.textAlign = "right";
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText((b.qty * b.price).toFixed(2), colTotal, ry);
    ctx.textAlign = "left";

    ry += rowH;
  }

  ctx.strokeStyle = INVOICE_COLORS.line;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, ry + 4);
  ctx.lineTo(W - PAD, ry + 4);
  ctx.stroke();

  /* --------- TOTALS --------- */
  const taxAmt = p.tax ?? 0;
  const beforeTax = Math.max(0, p.subtotal - taxAmt);
  const disc = p.discount ?? 0;

  let ty = ry + 20;
  const totalsX = W - PAD - 360;
  const totalsW = 360;

  const totalRow = (lbl: string, val: string) => {
    ctx.fillStyle = INVOICE_COLORS.muted;
    ctx.font = `500 18px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(lbl, totalsX, ty);
    ctx.fillStyle = INVOICE_COLORS.ink;
    ctx.font = `700 18px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(val, colTotal, ty);
    ctx.textAlign = "left";
    ty += 30;
  };

  totalRow("Total (incl. VAT)", fmt(p.subtotal, currency));
  totalRow("Total Before Tax", fmt(beforeTax, currency));
  totalRow("VAT (15%)", fmt(taxAmt, currency));
  if (disc > 0) totalRow("Discount", `- ${fmt(disc, currency)}`);

  ty += 10;
  // Grand total — premium high-contrast bar
  ctx.fillStyle = INVOICE_COLORS.emeraldDark;
  ctx.fillRect(totalsX - 12, ty, totalsW + 12, 68);
  ctx.fillStyle = "#fff";
  ctx.font = `800 22px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText("GRAND TOTAL", totalsX, ty + 22);
  ctx.font = `800 32px ${FONT}`;
  ctx.textAlign = "right";
  ctx.fillText(fmt(p.total, currency), colTotal, ty + 18);
  ctx.textAlign = "left";
  ty += 78;

  /* --------- PAYMENT SUMMARY (bigger fonts, Current Due dominant) --------- */
  let py = ty + 18;
  if (showLedger) {
    const boxH = 210;
    ctx.fillStyle = INVOICE_COLORS.panelSoft;
    ctx.fillRect(PAD, py, W - PAD * 2, boxH);
    ctx.strokeStyle = INVOICE_COLORS.line;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(PAD, py, W - PAD * 2, boxH);

    // Title bar
    ctx.fillStyle = INVOICE_COLORS.emeraldDark;
    ctx.fillRect(PAD, py, W - PAD * 2, 38);
    ctx.fillStyle = "#fff";
    ctx.font = `800 18px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText("PAYMENT SUMMARY", PAD + 14, py + 10);

    const due = p.newDue ?? Math.max(0, (p.previousDue ?? 0) + p.total - (p.paidAmount ?? 0));

    // Paid + Previous (two compact rows)
    let py2 = py + 56;
    const smallRow = (lbl: string, val: string) => {
      ctx.fillStyle = INVOICE_COLORS.muted;
      ctx.font = `600 20px ${FONT}`;
      ctx.textAlign = "left";
      ctx.fillText(lbl, PAD + 16, py2);
      ctx.fillStyle = INVOICE_COLORS.ink;
      ctx.font = `700 22px ${FONT}`;
      ctx.textAlign = "right";
      ctx.fillText(val, W - PAD - 16, py2);
      ctx.textAlign = "left";
      py2 += 36;
    };
    smallRow("Paid Amount", fmt(p.paidAmount ?? 0, currency));
    smallRow("Previous Due", fmt(p.previousDue ?? 0, currency));

    // Current Due — large, bold, high contrast
    const cdY = py + 138;
    const cdColor = due > 0 ? INVOICE_COLORS.danger : INVOICE_COLORS.success;
    ctx.fillStyle = cdColor;
    ctx.fillRect(PAD, cdY, W - PAD * 2, 62);
    ctx.fillStyle = "#fff";
    ctx.font = `800 22px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText("CURRENT DUE", PAD + 16, cdY + 20);
    ctx.font = `900 34px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(fmt(due, currency), W - PAD - 16, cdY + 15);
    ctx.textAlign = "left";

    py += payH;
  } else {
    py += 16;
  }

  /* --------- NOTES --------- */
  if (p.notes) {
    ctx.fillStyle = INVOICE_COLORS.muted;
    ctx.font = `700 14px ${FONT}`;
    ctx.fillText("NOTES", PAD, py);
    ctx.fillStyle = INVOICE_COLORS.ink;
    ctx.font = `500 16px ${FONT}`;
    const noteLines = wrap(ctx, p.notes, W - PAD * 2).slice(0, 2);
    noteLines.forEach((ln, i) => ctx.fillText(ln, PAD, py + 22 + i * 22));
    py += notesH;
  }

  /* --------- FOOTER: QR (centered) + thank you --------- */
  const fy = H - footerH + 10;
  const qrX = (W - QR_SIZE) / 2;
  // white padding around QR for max scan reliability
  ctx.fillStyle = "#fff";
  ctx.fillRect(qrX - 18, fy - 18, QR_SIZE + 36, QR_SIZE + 36);
  ctx.strokeStyle = INVOICE_COLORS.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(qrX - 18, fy - 18, QR_SIZE + 36, QR_SIZE + 36);
  drawQrMatrix(ctx, qrPayload, qrX, fy, QR_SIZE);

  ctx.fillStyle = INVOICE_COLORS.muted;
  ctx.font = `600 13px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText("ZATCA Phase 2 — Scan to verify", W / 2, fy + QR_SIZE + 8);

  ctx.fillStyle = INVOICE_COLORS.emeraldDark;
  ctx.font = `700 22px ${FONT}`;
  ctx.fillText("Thank You For Shopping", W / 2, fy + QR_SIZE + 34);
  ctx.fillStyle = INVOICE_COLORS.muted;
  ctx.font = `500 13px ${FONT}`;
  ctx.fillText(
    `${p.brand ?? BRAND_DEFAULT} · VAT 15% included where applicable`,
    W / 2,
    fy + QR_SIZE + 62
  );
  ctx.textAlign = "left";

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png", 1);
  });
}

export async function shareInvoice(p: InvoicePayload, captionExtra?: string) {
  try {
    const blob = await renderInvoiceImage(p);
    const fileName = `${p.kind}_${p.invoiceNumber}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const caption = captionExtra ?? `${p.kind === "sale" ? "Sales" : p.kind === "purchase" ? "Purchase" : "Order"} Invoice #${p.invoiceNumber} — ${p.brand ?? BRAND_DEFAULT}`;
    const nav = navigator as any;
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: caption });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Image downloaded — attach it in WhatsApp");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e: any) {
    if (e?.name === "AbortError") return;
    console.error(`[LegacyInvoiceShare] FAILED\nFailed at:\nshareInvoice()\nReason:\n${e?.name ?? "Error"}: ${e?.message ?? e}\nStack trace:\n${e?.stack ?? e}`, e);
    toast.error(`Share failed at shareInvoice(): ${e?.message ?? e}`);
  }
}

/* ===================================================================
 * Payment Receipt — for Payment In / partial payments
 * ================================================================ */
export type PaymentReceiptPayload = {
  receiptNumber: number | string;
  date: string;
  customerName: string;
  customerMobile?: string;
  amount: number;
  method: string;
  notes?: string;
  previousDue?: number;
  newDue?: number;
  brand?: string;
  currency?: string;
};

export async function renderPaymentReceiptImage(p: PaymentReceiptPayload): Promise<Blob> {
  const W = 1080;
  const PAD = 56;
  const currency = p.currency ?? "SAR";
  const accent = "#047857";
  const accentSoft = "#ecfdf5";
  const hasNotes = !!(p.notes && p.notes.trim());
  const H = hasNotes ? 1100 : 980;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";

  // header
  roundRect(ctx, PAD, PAD, W - PAD * 2, 260, 28);
  ctx.fillStyle = accentSoft; ctx.fill();
  ctx.fillStyle = "#111";
  ctx.font = "800 36px Inter, system-ui, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD + 32, PAD + 32);
  ctx.fillStyle = accent;
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("PAYMENT RECEIPT", PAD + 32, PAD + 80);
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "800 34px Inter, sans-serif";
  ctx.fillText(`#${p.receiptNumber}`, W - PAD - 32, PAD + 32);
  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText(p.date, W - PAD - 32, PAD + 78);
  ctx.textAlign = "left";
  ctx.fillStyle = "#666";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("CUSTOMER", PAD + 32, PAD + 140);
  ctx.fillStyle = "#111";
  ctx.font = "700 28px Inter, sans-serif";
  ctx.fillText(p.customerName, PAD + 32, PAD + 168);
  if (p.customerMobile) {
    ctx.fillStyle = "#555";
    ctx.font = "500 22px Inter, sans-serif";
    ctx.fillText(p.customerMobile, PAD + 32, PAD + 206);
  }

  // amount block
  const ay = 360;
  roundRect(ctx, PAD, ay, W - PAD * 2, 200, 24);
  ctx.fillStyle = accent; ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("PAYMENT RECEIVED", PAD + 32, ay + 28);
  ctx.font = "800 80px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.amount.toFixed(2)}`, PAD + 32, ay + 64);
  ctx.textAlign = "right";
  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillText(`via ${p.method.toUpperCase()}`, W - PAD - 32, ay + 28);
  ctx.textAlign = "left";

  // balance summary: Old Balance → Payment Received → New Balance
  const dy = 600;
  const oldBal = p.previousDue ?? 0;
  const newBal = p.newDue ?? (oldBal - p.amount);
  roundRect(ctx, PAD, dy, W - PAD * 2, 220, 22);
  ctx.fillStyle = accentSoft; ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText("Old Balance", PAD + 32, dy + 24);
  ctx.fillText("Payment Received", PAD + 32, dy + 78);
  ctx.fillText("New Balance", PAD + 32, dy + 150);

  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "700 24px Inter, sans-serif";
  ctx.fillText(`${currency} ${oldBal.toFixed(2)}`, W - PAD - 32, dy + 22);
  ctx.fillStyle = accent;
  ctx.fillText(`− ${currency} ${p.amount.toFixed(2)}`, W - PAD - 32, dy + 76);

  // divider above new balance
  ctx.strokeStyle = accent; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD + 24, dy + 130); ctx.lineTo(W - PAD - 24, dy + 130); ctx.stroke();

  ctx.font = "800 30px Inter, sans-serif";
  ctx.fillStyle = newBal > 0 ? "#dc2626" : accent;
  ctx.fillText(`${currency} ${newBal.toFixed(2)}`, W - PAD - 32, dy + 146);
  ctx.textAlign = "left";

  if (hasNotes) {
    const ny = dy + 240;
    roundRect(ctx, PAD, ny, W - PAD * 2, 100, 18);
    ctx.fillStyle = "#f8fafc"; ctx.fill();
    ctx.fillStyle = "#666";
    ctx.font = "700 16px Inter, sans-serif";
    ctx.fillText("NOTE", PAD + 24, ny + 18);
    ctx.fillStyle = "#111";
    ctx.font = "500 20px Inter, sans-serif";
    const note = p.notes!.trim();
    ctx.fillText(note.length > 90 ? note.slice(0, 87) + "…" : note, PAD + 24, ny + 48);
  }

  // footer
  ctx.fillStyle = "#666";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD, H - 70);
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(), W - PAD, H - 70);
  ctx.textAlign = "center";
  ctx.fillStyle = "#999";
  ctx.font = "500 14px Inter, sans-serif";
  ctx.fillText("Thank you for your payment", W / 2, H - 34);
  ctx.textAlign = "left";

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png", 0.95);
  });
}

export async function sharePaymentReceipt(p: PaymentReceiptPayload) {
  try {
    const blob = await renderPaymentReceiptImage(p);
    const fileName = `payment_${p.receiptNumber}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const caption = `Payment Receipt #${p.receiptNumber} — ${p.customerName} · ${p.currency ?? "SAR"} ${p.amount.toFixed(2)}`;
    const nav = navigator as any;
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: caption });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Receipt downloaded");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e: any) {
    if (e?.name === "AbortError") return;
    console.error(e);
    toast.error("Could not share receipt");
  }
}

/* ===================================================================
 * Customer Statement — timeline of sales + payments
 * ================================================================ */
export type StatementRow = {
  date: string;
  label: string;       // e.g. "Sale #103" or "Payment In"
  sub?: string;        // mobile, notes
  debit?: number;      // adds to due
  credit?: number;     // reduces due
  balance: number;     // running balance after this row
};

export type StatementPayload = {
  customerName: string;
  customerMobile?: string;
  opening: number;
  rows: StatementRow[];
  currentDue: number;
  totalPaid: number;
  totalSales: number;
  brand?: string;
  currency?: string;
};

export async function renderStatementImage(p: StatementPayload): Promise<Blob> {
  const W = 1080;
  const PAD = 56;
  const currency = p.currency ?? "SAR";
  const accent = "#1d4ed8";
  const accentSoft = "#eff6ff";

  const off = document.createElement("canvas").getContext("2d")!;
  off.font = "600 18px Inter";
  const rowH = 70;
  const rows = p.rows.slice(0, 40); // cap
  const headerH = 300;
  const summaryH = 200;
  const tableH = 70 + rows.length * rowH + 30;
  const H = headerH + tableH + summaryH + 120;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";

  // header
  roundRect(ctx, PAD, PAD, W - PAD * 2, headerH - 30, 28);
  ctx.fillStyle = accentSoft; ctx.fill();
  ctx.fillStyle = "#111";
  ctx.font = "800 36px Inter, system-ui, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD + 32, PAD + 32);
  ctx.fillStyle = accent;
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("CUSTOMER STATEMENT", PAD + 32, PAD + 80);
  ctx.fillStyle = "#666";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("CUSTOMER", PAD + 32, PAD + 140);
  ctx.fillStyle = "#111";
  ctx.font = "700 30px Inter, sans-serif";
  ctx.fillText(p.customerName, PAD + 32, PAD + 168);
  if (p.customerMobile) {
    ctx.fillStyle = "#555";
    ctx.font = "500 22px Inter, sans-serif";
    ctx.fillText(p.customerMobile, PAD + 32, PAD + 208);
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText(new Date().toLocaleDateString(), W - PAD - 32, PAD + 32);
  ctx.textAlign = "left";

  // table
  let y = PAD + headerH;
  roundRect(ctx, PAD, y, W - PAD * 2, tableH - 20, 22);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 2;
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#888";
  ctx.font = "700 16px Inter, sans-serif";
  ctx.fillText("DATE", PAD + 24, y + 22);
  ctx.fillText("ACTIVITY", PAD + 170, y + 22);
  ctx.textAlign = "right";
  ctx.fillText("DEBIT", W - PAD - 360, y + 22);
  ctx.fillText("CREDIT", W - PAD - 200, y + 22);
  ctx.fillText("BALANCE", W - PAD - 28, y + 22);
  ctx.textAlign = "left";

  // opening row
  let ry = y + 60;
  ctx.fillStyle = "#111";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("Opening", PAD + 24, ry);
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText("Previous balance", PAD + 170, ry);
  ctx.textAlign = "right";
  ctx.font = "700 20px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.opening.toFixed(2)}`, W - PAD - 28, ry);
  ctx.textAlign = "left";
  ry += rowH;

  for (const r of rows) {
    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath(); ctx.moveTo(PAD + 24, ry - 8); ctx.lineTo(W - PAD - 24, ry - 8); ctx.stroke();
    ctx.fillStyle = "#444";
    ctx.font = "500 16px Inter, sans-serif";
    ctx.fillText(r.date, PAD + 24, ry);
    ctx.fillStyle = "#111";
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillText(r.label, PAD + 170, ry);
    if (r.sub) {
      ctx.fillStyle = "#888";
      ctx.font = "500 14px Inter, sans-serif";
      ctx.fillText(r.sub.slice(0, 60), PAD + 170, ry + 24);
    }
    ctx.textAlign = "right";
    ctx.font = "600 18px Inter, sans-serif";
    if (r.debit) { ctx.fillStyle = "#b91c1c"; ctx.fillText(r.debit.toFixed(2), W - PAD - 360, ry); }
    if (r.credit) { ctx.fillStyle = accent; ctx.fillText(r.credit.toFixed(2), W - PAD - 200, ry); }
    ctx.fillStyle = "#111";
    ctx.font = "700 20px Inter, sans-serif";
    ctx.fillText(r.balance.toFixed(2), W - PAD - 28, ry);
    ctx.textAlign = "left";
    ry += rowH;
  }

  // summary
  const sy = y + tableH;
  roundRect(ctx, PAD, sy, W - PAD * 2, summaryH - 20, 24);
  ctx.fillStyle = accentSoft; ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();

  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText("Total sales", PAD + 32, sy + 28);
  ctx.fillText("Total paid", PAD + 32, sy + 68);
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.totalSales.toFixed(2)}`, W - PAD - 32, sy + 26);
  ctx.fillText(`${currency} ${p.totalPaid.toFixed(2)}`, W - PAD - 32, sy + 66);
  ctx.textAlign = "left";

  const tby = sy + 110;
  roundRect(ctx, PAD + 16, tby, W - PAD * 2 - 32, 64, 18);
  ctx.fillStyle = p.currentDue > 0 ? "#dc2626" : accent;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("CURRENT DUE", PAD + 40, tby + 20);
  ctx.textAlign = "right";
  ctx.font = "800 32px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.currentDue.toFixed(2)}`, W - PAD - 40, tby + 14);
  ctx.textAlign = "left";

  // footer
  ctx.fillStyle = "#999";
  ctx.font = "500 14px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${p.brand ?? BRAND_DEFAULT} · Generated ${new Date().toLocaleString()}`, W / 2, H - 38);
  ctx.textAlign = "left";

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png", 0.95);
  });
}

export async function shareStatement(p: StatementPayload) {
  try {
    const blob = await renderStatementImage(p);
    const fileName = `statement_${p.customerName.replace(/\s+/g, "_")}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const caption = `Customer Statement — ${p.customerName} · Due ${p.currency ?? "SAR"} ${p.currentDue.toFixed(2)}`;
    const nav = navigator as any;
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: caption });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Statement downloaded");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e: any) {
    if (e?.name === "AbortError") return;
    console.error(e);
    toast.error("Could not share statement");
  }
}

