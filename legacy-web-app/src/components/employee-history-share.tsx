// Premium LIGHT employee statement: high-res fintech-style image + printable PDF + silent WhatsApp share.
// Pure white background, teal accent, modern banking aesthetic (Apple Wallet / Stripe / Notion).

export type StatementEntry = {
  id: string;
  entry_type: "given" | "received";
  amount: number;
  txn_date: string;
  notes: string | null;
};

export type StatementInput = {
  company?: string;
  employeeName: string;
  shopName?: string | null;
  mobile?: string | null;
  iqama?: string | null;
  totalGiven: number;
  totalReceived: number;
  balance: number;
  entries: StatementEntry[];
};

const COMPANY_DEFAULT = "ShRiAh Group";

// Premium LIGHT fintech palette
const C = {
  bg: "#FFFFFF",
  bgSoft: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  borderSoft: "#EEF1F5",
  text: "#111827",
  textSoft: "#6B7280",
  textMute: "#9CA3AF",
  accent: "#14B8A6",
  accentSoft: "#E6FFFB",
  accentDeep: "#0F9488",
  red: "#EF4444",
  redDeep: "#DC2626",
  redSoft: "#FEE2E2",
  green: "#22C55E",
  greenDeep: "#16A34A",
  greenSoft: "#DCFCE7",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
}
function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}
function shortId(input: StatementInput) {
  const s = `${input.employeeName}-${new Date().toISOString().slice(0, 10)}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return (Math.abs(h).toString(16).toUpperCase() + "000000").slice(0, 6);
}

// --------- IMAGE (premium LIGHT, hi-DPI) ---------
export async function buildEmployeeStatementImage(input: StatementInput): Promise<Blob> {
  const company = input.company || COMPANY_DEFAULT;
  const DPR = 2;
  const W = 1200;
  const PAD = 56;
  const rows = input.entries.slice(0, 24);
  const rowH = 78;

  const headerH = 150;
  const summaryH = 220;
  const totalsH = 110;
  const tableHeadH = 56;
  const tableH = rows.length * rowH + (input.entries.length > rows.length ? 48 : 0);
  const finalH = 170;
  const footerH = 70;

  const H = headerH + summaryH + totalsH + tableHeadH + tableH + finalH + footerH;

  const canvas = document.createElement("canvas");
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(DPR, DPR);
  (ctx as any).textRendering = "geometricPrecision";
  (ctx as any).imageSmoothingQuality = "high";

  // BG: pure white with the faintest top gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 200);
  bg.addColorStop(0, "#FAFBFC");
  bg.addColorStop(1, C.bg);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, 200);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 200, W, H - 200);

  const bal = input.balance;
  const isDue = bal > 0;
  const isAdv = bal < 0;
  const balColor = isDue ? C.red : isAdv ? C.green : C.textSoft;
  const balDeep = isDue ? C.redDeep : isAdv ? C.greenDeep : C.textSoft;
  const balSoft = isDue ? C.redSoft : isAdv ? C.greenSoft : "#F1F5F9";
  const balLabel = isDue ? "Due from Employee" : isAdv ? "Payable to Employee" : "Settled";

  // -------- HEADER --------
  const markX = PAD, markY = 50, markS = 48;
  roundRect(ctx, markX, markY, markS, markS, 12);
  const markGrad = ctx.createLinearGradient(markX, markY, markX + markS, markY + markS);
  markGrad.addColorStop(0, C.accent);
  markGrad.addColorStop(1, C.accentDeep);
  ctx.fillStyle = markGrad;
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", markX + markS / 2, markY + markS / 2 + 1);
  ctx.textBaseline = "alphabetic";

  ctx.textAlign = "left";
  ctx.fillStyle = C.text;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(company, markX + markS + 14, markY + 20);
  ctx.fillStyle = C.textSoft;
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText("Employee Statement", markX + markS + 14, markY + 40);

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const sid = `#${shortId(input)}`;
  ctx.textAlign = "right";
  ctx.fillStyle = C.text;
  ctx.font = "600 13px Inter, system-ui, sans-serif";
  ctx.fillText(today, W - PAD, markY + 20);
  ctx.fillStyle = C.textMute;
  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`Statement ${sid}`, W - PAD, markY + 40);

  // Hairline divider
  ctx.strokeStyle = C.borderSoft;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, headerH - 20);
  ctx.lineTo(W - PAD, headerH - 20);
  ctx.stroke();

  // -------- SUMMARY CARD --------
  const sx = PAD, sy = headerH, sw = W - PAD * 2, sh = 180;
  lightCard(ctx, sx, sy, sw, sh, 18);

  // Avatar
  const avS = 64, avX = sx + 24, avY = sy + 28;
  roundRect(ctx, avX, avY, avS, avS, 16);
  ctx.fillStyle = C.accentSoft;
  ctx.fill();
  ctx.fillStyle = C.accentDeep;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials(input.employeeName), avX + avS / 2, avY + avS / 2 + 1);
  ctx.textBaseline = "alphabetic";

  // Name + meta
  ctx.textAlign = "left";
  ctx.fillStyle = C.text;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(input.employeeName, avX + avS + 16, avY + 24);

  // Meta lines (stacked, easy to scan)
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  const metaItems: Array<[string, string]> = [];
  if (input.shopName) metaItems.push(["Shop", input.shopName]);
  if (input.mobile) metaItems.push(["Mobile", input.mobile]);
  if (input.iqama) metaItems.push(["Iqama", input.iqama]);
  let my = avY + 46;
  metaItems.forEach(([k, v]) => {
    ctx.fillStyle = C.textMute;
    ctx.fillText(k, avX + avS + 16, my);
    const kw = ctx.measureText(k).width;
    ctx.fillStyle = C.text;
    ctx.font = "600 12px Inter, system-ui, sans-serif";
    ctx.fillText(v, avX + avS + 16 + kw + 8, my);
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    my += 18;
  });

  // Balance block (right side, tinted by sign)
  const balBoxW = 380;
  const balBoxX = sx + sw - balBoxW - 24;
  const balBoxY = sy + 24;
  const balBoxH = sh - 48;
  roundRect(ctx, balBoxX, balBoxY, balBoxW, balBoxH, 16);
  ctx.fillStyle = balSoft;
  ctx.fill();

  // Status pill
  const pillText = balLabel;
  ctx.font = "700 10px Inter, system-ui, sans-serif";
  const pw = ctx.measureText(pillText).width + 20;
  const px = balBoxX + 20, py = balBoxY + 18;
  roundRect(ctx, px, py, pw, 22, 11);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.fillStyle = balDeep;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(pillText.toUpperCase(), px + 10, py + 11);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = C.textSoft;
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText("CURRENT BALANCE", balBoxX + 20, balBoxY + 68);

  ctx.fillStyle = balDeep;
  ctx.font = "600 15px Inter, system-ui, sans-serif";
  ctx.fillText("SAR", balBoxX + 20, balBoxY + 112);
  ctx.font = "800 40px Inter, system-ui, sans-serif";
  ctx.fillText(fmt(Math.abs(bal)), balBoxX + 64, balBoxY + 114);

  // -------- TOTALS --------
  const ty = sy + sh + 24;
  const colW = (sw - 16) / 2;
  miniStat(ctx, sx, ty, colW, 86, "Total Given", `SAR ${fmt(input.totalGiven)}`, C.redDeep, C.redSoft);
  miniStat(ctx, sx + colW + 16, ty, colW, 86, "Total Received", `SAR ${fmt(input.totalReceived)}`, C.greenDeep, C.greenSoft);

  // -------- TRANSACTION HISTORY --------
  const histTop = ty + 86 + 28;
  ctx.fillStyle = C.text;
  ctx.font = "700 15px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Transaction History", PAD, histTop);
  ctx.fillStyle = C.textMute;
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${input.entries.length} entr${input.entries.length === 1 ? "y" : "ies"}`, W - PAD, histTop);

  let y = histTop + 20;
  for (const e of rows) {
    const isGiven = e.entry_type === "given";
    const accent = isGiven ? C.redDeep : C.greenDeep;
    const accentSoft = isGiven ? C.redSoft : C.greenSoft;

    // Row card
    roundRect(ctx, PAD, y, W - PAD * 2, rowH - 10, 12);
    ctx.fillStyle = C.card;
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Type badge (left)
    const tagText = isGiven ? "GIVEN" : "RECEIVED";
    ctx.font = "700 10px Inter, system-ui, sans-serif";
    const tw = ctx.measureText(tagText).width + 16;
    const tx = PAD + 18;
    const tagY = y + 16;
    roundRect(ctx, tx, tagY, tw, 22, 11);
    ctx.fillStyle = accentSoft;
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tagText, tx + 8, tagY + 11);
    ctx.textBaseline = "alphabetic";

    // Notes (next to badge)
    if (e.notes) {
      ctx.fillStyle = C.text;
      ctx.font = "600 13px Inter, system-ui, sans-serif";
      const notes = clip(ctx, e.notes, 520);
      ctx.fillText(notes, tx + tw + 12, tagY + 16);
    }

    // Date (under badge)
    ctx.fillStyle = C.textSoft;
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.fillText(fmtDate(e.txn_date), tx, y + rowH - 22);

    // Amount (right)
    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = "700 18px Inter, system-ui, sans-serif";
    ctx.fillText(`${isGiven ? "−" : "+"} SAR ${fmt(Number(e.amount))}`, W - PAD - 20, y + 36);

    y += rowH;
  }

  if (input.entries.length > rows.length) {
    ctx.fillStyle = C.textMute;
    ctx.font = "500 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`+ ${input.entries.length - rows.length} more entries — see PDF for full history`, W / 2, y + 24);
    y += 48;
  } else {
    y += 8;
  }

  // -------- FINAL BALANCE --------
  const fy = y + 16;
  const fh = 130;
  // Soft teal gradient card
  roundRect(ctx, PAD, fy, W - PAD * 2, fh, 20);
  const fg = ctx.createLinearGradient(PAD, fy, W - PAD, fy + fh);
  fg.addColorStop(0, C.accentSoft);
  fg.addColorStop(1, "#F0FDFA");
  ctx.fillStyle = fg;
  ctx.fill();
  ctx.strokeStyle = "rgba(20,184,166,0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = C.accentDeep;
  ctx.font = "600 11px Inter, system-ui, sans-serif";
  ctx.fillText("FINAL BALANCE", PAD + 28, fy + 36);

  ctx.fillStyle = C.text;
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.fillText(balLabel, PAD + 28, fy + 84);

  ctx.textAlign = "right";
  ctx.fillStyle = balDeep;
  ctx.font = "600 14px Inter, system-ui, sans-serif";
  ctx.fillText("SAR", W - PAD - 24 - ctx.measureText(fmt(Math.abs(bal))).width * 0 - 160, fy + 56);

  ctx.font = "800 38px Inter, system-ui, sans-serif";
  ctx.fillText(fmt(Math.abs(bal)), W - PAD - 24, fy + 88);

  // -------- FOOTER --------
  ctx.textAlign = "left";
  ctx.fillStyle = C.textMute;
  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`${company} · ${sid}`, PAD, H - 28);
  ctx.textAlign = "right";
  ctx.fillText(today, W - PAD, H - 28);

  return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png", 1.0));
}

// ---- canvas helpers ----
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function lightCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  // soft shadow
  ctx.save();
  ctx.shadowColor = "rgba(17,24,39,0.05)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = C.card;
  ctx.fill();
  ctx.restore();
  // hairline
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.stroke();
}
function miniStat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string, value: string, color: string, tint: string) {
  lightCard(ctx, x, y, w, h, 14);
  // accent dot
  ctx.beginPath();
  ctx.arc(x + 24, y + h / 2, 6, 0, Math.PI * 2);
  ctx.fillStyle = tint;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 24, y + h / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = C.textSoft;
  ctx.font = "500 11px Inter, system-ui, sans-serif";
  ctx.fillText(label.toUpperCase(), x + 42, y + 32);
  ctx.fillStyle = color;
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.fillText(value, x + 42, y + 62);
}
function clip(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
  return s + "…";
}

// --------- PDF (print) ---------
export function printEmployeeStatementPDF(input: StatementInput) {
  const company = input.company || COMPANY_DEFAULT;
  const balPositive = input.balance > 0;
  const balZero = input.balance === 0;
  const balLabel = balZero ? "Settled" : balPositive ? "Due from Employee" : "Payable to Employee";
  const balColor = balZero ? "#6B7280" : balPositive ? "#DC2626" : "#16A34A";
  const sid = shortId(input);

  const rowsHtml = input.entries.map((e) => {
    const isGiven = e.entry_type === "given";
    const color = isGiven ? "#DC2626" : "#16A34A";
    return `<tr>
      <td>${fmtDate(e.txn_date)}</td>
      <td><span class="tag ${isGiven ? "given" : "received"}">${isGiven ? "GIVEN" : "RECEIVED"}</span></td>
      <td class="notes">${(e.notes ?? "").replace(/</g, "&lt;")}</td>
      <td class="amount" style="color:${color}">${isGiven ? "−" : "+"} SAR ${fmt(Number(e.amount))}</td>
    </tr>`;
  }).join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>${input.employeeName} — Statement</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#111827;margin:0;padding:32px;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #E5E7EB;padding-bottom:16px;margin-bottom:24px}
  .brand{font-size:22px;font-weight:800;letter-spacing:-0.02em;color:#111827}
  .subtitle{color:#6B7280;font-size:13px;margin-top:4px}
  .date{color:#6B7280;font-size:13px;text-align:right}
  .sid{font-family:ui-monospace,Menlo,monospace;color:#9CA3AF;font-size:11px;margin-top:2px}
  .profile{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start;gap:24px;box-shadow:0 1px 2px rgba(17,24,39,0.04)}
  .profile h1{margin:0 0 6px;font-size:20px;font-weight:700}
  .meta{color:#6B7280;font-size:13px;line-height:1.7}
  .bal{text-align:right;background:#F8FAFC;border-radius:12px;padding:16px 20px;min-width:240px}
  .bal .label{font-size:11px;text-transform:uppercase;color:#6B7280;letter-spacing:.08em}
  .bal .val{font-size:28px;font-weight:800;color:${balColor};margin-top:6px}
  .bal .sub{font-size:12px;color:#6B7280;margin-top:2px}
  .totals{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
  .totals .box{border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;background:#fff}
  .totals .box .l{font-size:11px;text-transform:uppercase;color:#6B7280;letter-spacing:.08em}
  .totals .box .v{font-size:18px;font-weight:700;margin-top:4px}
  table{width:100%;border-collapse:separate;border-spacing:0 6px;font-size:13px}
  thead th{text-align:left;color:#6B7280;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:6px 12px}
  tbody td{padding:12px;background:#fff;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;vertical-align:middle}
  tbody td:first-child{border-left:1px solid #E5E7EB;border-radius:10px 0 0 10px}
  tbody td:last-child{border-right:1px solid #E5E7EB;border-radius:0 10px 10px 0}
  .amount{text-align:right;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
  .tag{display:inline-block;padding:3px 9px;border-radius:9px;font-size:10px;font-weight:700;letter-spacing:.05em}
  .tag.given{background:#FEE2E2;color:#DC2626}
  .tag.received{background:#DCFCE7;color:#16A34A}
  .notes{color:#374151}
  .summary{margin-top:20px;background:linear-gradient(135deg,#E6FFFB,#F0FDFA);border:1px solid rgba(20,184,166,0.2);border-radius:14px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center}
  .summary .l{font-weight:600;font-size:13px;color:#0F9488}
  .summary .v{font-size:24px;font-weight:800;color:${balColor}}
  @media print{ body{padding:16px} }
</style></head><body>
  <div class="head">
    <div>
      <div class="brand">${company}</div>
      <div class="subtitle">Employee Statement</div>
    </div>
    <div>
      <div class="date">${new Date().toLocaleDateString()}</div>
      <div class="sid">Statement #${sid}</div>
    </div>
  </div>

  <div class="profile">
    <div>
      <h1>${input.employeeName}</h1>
      <div class="meta">
        ${input.shopName ? `<div>Shop: ${input.shopName}</div>` : ""}
        ${input.mobile ? `<div>Mobile: ${input.mobile}</div>` : ""}
        ${input.iqama ? `<div>Iqama: ${input.iqama}</div>` : ""}
      </div>
    </div>
    <div class="bal">
      <div class="label">Current Balance</div>
      <div class="val">SAR ${fmt(Math.abs(input.balance))}</div>
      <div class="sub">${balLabel}</div>
    </div>
  </div>

  <div class="totals">
    <div class="box"><div class="l">Total Given</div><div class="v" style="color:#DC2626">SAR ${fmt(input.totalGiven)}</div></div>
    <div class="box"><div class="l">Total Received</div><div class="v" style="color:#16A34A">SAR ${fmt(input.totalReceived)}</div></div>
  </div>

  <table>
    <thead><tr><th>Date</th><th>Type</th><th>Notes</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${rowsHtml || `<tr><td colspan="4" style="text-align:center;color:#9CA3AF;padding:24px">No entries yet</td></tr>`}</tbody>
  </table>

  <div class="summary">
    <div class="l">Final Balance · ${balLabel}</div>
    <div class="v">SAR ${fmt(Math.abs(input.balance))}</div>
  </div>

  <script>window.onload = () => { setTimeout(() => window.print(), 250); };</script>
</body></html>`;

  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!w) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${input.employeeName}-statement.html`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// --------- Share dispatchers ---------
export async function shareEmployeeStatementImage(input: StatementInput) {
  const blob = await buildEmployeeStatementImage(input);
  const file = new File([blob], `${input.employeeName.replace(/\s+/g, "-")}-statement.png`, { type: "image/png" });
  const navAny = navigator as any;
  if (navAny.canShare && navAny.canShare({ files: [file] })) {
    try {
      await navAny.share({ files: [file], title: `${input.employeeName} — Statement` });
      return;
    } catch { /* fall through */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = file.name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export type WhatsAppShareResult =
  | { kind: "shared" }
  | { kind: "cancelled" }
  | { kind: "fallback-link"; phone: string | null }
  | { kind: "unsupported"; blob: Blob; fileName: string; phone: string | null; text: string };

export async function shareEmployeeStatementWhatsApp(input: StatementInput): Promise<WhatsAppShareResult> {
  const blob = await buildEmployeeStatementImage(input);
  const fileName = `${input.employeeName.replace(/\s+/g, "-")}-statement.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const phone = normalizeWhatsAppPhone(input.mobile);

  const navAny = navigator as any;
  const canShareFiles = !!(navAny.canShare && navAny.share && navAny.canShare({ files: [file] }));

  if (canShareFiles) {
    try {
      await navAny.share({ files: [file] });
      return { kind: "shared" };
    } catch (err: any) {
      if (err?.name === "AbortError") return { kind: "cancelled" };
    }
  }

  let copied = false;
  try {
    if ((navigator as any).clipboard && (window as any).ClipboardItem) {
      await (navigator as any).clipboard.write([
        new (window as any).ClipboardItem({ "image/png": blob }),
      ]);
      copied = true;
    }
  } catch { /* ignore */ }

  if (phone) {
    window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
    return { kind: "fallback-link", phone };
  }

  if (copied) {
    return { kind: "fallback-link", phone: null };
  }
  return { kind: "unsupported", blob, fileName, phone, text: "" };
}

export function downloadStatementImage(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function normalizeWhatsAppPhone(value?: string | null) {
  const digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `966${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("5")) return `966${digits}`;
  return digits;
}
