// Premium shop report: image + PDF print + Excel CSV + WhatsApp share.
// Zero new deps — canvas for image, window.print() for PDF, CSV blob for Excel.

export type ShopReportRow = {
  shop_id: string;
  shop_name: string;
  simple: boolean;
  pos: number;
  cash: number;
  bank: number;
  credit: number;
  totalSale: number;
  purchase: number;
  expense: number;
  withdraw: number;
  diff: number;
};

export type ShopReportInput = {
  company?: string;
  title: string;            // e.g. "Monthly Shop Report" or "Nujum · Monthly"
  rangeLabel: string;       // e.g. "01/05/2026 – 31/05/2026"
  scopeLabel: string;       // e.g. "All Shops" or "Nujum"
  rows: ShopReportRow[];    // one row per shop (or single row when shop-scoped)
};

const COMPANY_DEFAULT = "ShRiAh Group";

const fmt = (n: number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

// Totals across rows
export function totalsOf(rows: ShopReportRow[]) {
  return rows.reduce(
    (a, r) => ({
      pos: a.pos + r.pos,
      cash: a.cash + r.cash,
      bank: a.bank + r.bank,
      credit: a.credit + r.credit,
      totalSale: a.totalSale + r.totalSale,
      purchase: a.purchase + r.purchase,
      expense: a.expense + r.expense,
      withdraw: a.withdraw + r.withdraw,
      diff: a.diff + r.diff,
    }),
    { pos: 0, cash: 0, bank: 0, credit: 0, totalSale: 0, purchase: 0, expense: 0, withdraw: 0, diff: 0 },
  );
}

// ---------------- IMAGE (minimal finance white style) ----------------
export async function buildShopReportImage(input: ShopReportInput): Promise<Blob> {
  const company = input.company || COMPANY_DEFAULT;
  const W = 1080;
  const PAD = 56;
  const t = totalsOf(input.rows);

  // Layout planning
  const headerH = 180;
  const metaH = 100;
  const statRowH = 64;
  const stats: Array<{ label: string; value: number; tone?: "pos" | "neg" | "muted" }> = [
    { label: "POS Sale", value: t.pos },
    { label: "Cash Sale", value: t.cash },
    { label: "Bank Sale", value: t.bank },
    { label: "Credit Sale", value: t.credit },
    { label: "Total Sale", value: t.totalSale },
    { label: "Purchase", value: t.purchase, tone: "muted" },
    { label: "Expense", value: t.expense, tone: "muted" },
    { label: "Withdraw", value: t.withdraw, tone: "muted" },
  ];
  const statsH = stats.length * statRowH + 40;
  const cashPosH = 130;

  const breakdownRowH = 52;
  const tableH = input.rows.length > 1 ? breakdownRowH * (input.rows.length + 1) + 70 : 0;

  const footerH = 110;
  const H = headerH + metaH + statsH + cashPosH + tableH + footerH + 60;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Pure white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // ===== HEADER =====
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "800 44px Inter, system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(company, PAD, PAD);

  ctx.fillStyle = "#525252";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.fillText(input.title, PAD, PAD + 58);

  ctx.textAlign = "right";
  ctx.fillStyle = "#404040";
  ctx.font = "600 20px Inter, system-ui, sans-serif";
  ctx.fillText(input.rangeLabel, W - PAD, PAD + 6);
  ctx.fillStyle = "#737373";
  ctx.font = "500 18px Inter, system-ui, sans-serif";
  ctx.fillText(new Date().toLocaleDateString(), W - PAD, PAD + 36);

  // Header divider
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, headerH);
  ctx.lineTo(W - PAD, headerH);
  ctx.stroke();

  // ===== META (Scope) =====
  ctx.textAlign = "left";
  ctx.fillStyle = "#737373";
  ctx.font = "700 14px Inter, system-ui, sans-serif";
  ctx.fillText("SCOPE", PAD, headerH + 22);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  ctx.fillText(input.scopeLabel, PAD, headerH + 44);

  // ===== STATS (minimal label / value rows) =====
  let y = headerH + metaH;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = "700 13px Inter, system-ui, sans-serif";
  ctx.fillText("BREAKDOWN", PAD, y);
  y += 28;

  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    const rowY = y + i * statRowH;
    // Subtle divider above
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, rowY);
    ctx.lineTo(W - PAD, rowY);
    ctx.stroke();

    const isTotal = s.label === "Total Sale";
    ctx.fillStyle = isTotal ? "#0a0a0a" : "#404040";
    ctx.font = isTotal ? "700 22px Inter, system-ui, sans-serif" : "600 20px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(s.label, PAD, rowY + 22);

    ctx.fillStyle = isTotal ? "#0a0a0a" : s.tone === "muted" ? "#525252" : "#171717";
    ctx.font = isTotal ? "800 24px Inter, system-ui, sans-serif" : "700 22px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`SAR ${fmt(s.value)}`, W - PAD, rowY + 21);
  }
  y += stats.length * statRowH;

  // ===== CASH POSITION (Plus / Minus) =====
  const cpY = y + 24;
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, cpY, W - PAD * 2, cashPosH - 30);
  ctx.textAlign = "left";
  ctx.fillStyle = "#737373";
  ctx.font = "700 14px Inter, system-ui, sans-serif";
  ctx.fillText("CASH POSITION", PAD + 24, cpY + 22);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "500 14px Inter, system-ui, sans-serif";
  ctx.fillText(t.diff >= 0 ? "Surplus" : "Shortage", PAD + 24, cpY + 50);

  ctx.textAlign = "right";
  ctx.fillStyle = t.diff >= 0 ? "#047857" : "#b91c1c";
  ctx.font = "800 40px Inter, system-ui, sans-serif";
  ctx.fillText(`${t.diff >= 0 ? "+" : "−"} SAR ${fmt(Math.abs(t.diff))}`, W - PAD - 24, cpY + 30);

  y = cpY + cashPosH;

  // ===== Per-shop breakdown table =====
  if (input.rows.length > 1) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillText("PER-SHOP", PAD, y);
    y += 26;

    // Header row
    ctx.fillStyle = "#737373";
    ctx.font = "700 14px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("SHOP", PAD, y + 22);
    ctx.textAlign = "right";
    ctx.fillText("SALE", W - PAD - 380, y + 22);
    ctx.fillText("EXPENSE", W - PAD - 200, y + 22);
    ctx.fillText("+/−", W - PAD, y + 22);
    y += breakdownRowH;

    for (const r of input.rows) {
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#0a0a0a";
      ctx.font = "600 18px Inter, system-ui, sans-serif";
      ctx.fillText(r.shop_name, PAD, y + 22);

      ctx.textAlign = "right";
      ctx.fillStyle = "#404040";
      ctx.font = "600 18px Inter, system-ui, sans-serif";
      ctx.fillText(fmt(r.totalSale), W - PAD - 380, y + 22);
      ctx.fillText(fmt(r.expense), W - PAD - 200, y + 22);
      ctx.fillStyle = r.diff >= 0 ? "#047857" : "#b91c1c";
      ctx.font = "700 18px Inter, system-ui, sans-serif";
      ctx.fillText(`${r.diff >= 0 ? "+" : "−"}${fmt(Math.abs(r.diff))}`, W - PAD, y + 22);

      y += breakdownRowH;
    }
  }

  // ===== FOOTER =====
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, H - footerH);
  ctx.lineTo(W - PAD, H - footerH);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#737373";
  ctx.font = "600 16px Inter, system-ui, sans-serif";
  ctx.fillText("Generated By AhsAN Manager ShRiAh Group", W / 2, H - footerH + 28);
  ctx.fillStyle = "#a3a3a3";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText(new Date().toLocaleString(), W / 2, H - footerH + 56);

  return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png", 0.95));
}


function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------------- PDF (print) ----------------
export function printShopReportPDF(input: ShopReportInput) {
  const company = input.company || COMPANY_DEFAULT;
  const t = totalsOf(input.rows);

  const stat = (l: string, v: number, color = "#0f172a") =>
    `<div class="stat"><div class="l">${l}</div><div class="v" style="color:${color}">SAR ${fmt(v)}</div></div>`;

  const tableHtml = input.rows.length > 1
    ? `<h2>Per-Shop Breakdown</h2>
       <table><thead><tr>
         <th>Shop</th><th>POS</th><th>Cash</th><th>Bank</th><th>Credit</th>
         <th>Total Sale</th><th>Purchase</th><th>Expense</th><th>Withdraw</th><th>+/-</th>
       </tr></thead><tbody>
       ${input.rows.map((r) => `<tr>
         <td><b>${r.shop_name}</b></td>
         <td>${fmt(r.pos)}</td><td>${fmt(r.cash)}</td><td>${fmt(r.bank)}</td><td>${fmt(r.credit)}</td>
         <td><b>${fmt(r.totalSale)}</b></td>
         <td>${fmt(r.purchase)}</td><td>${fmt(r.expense)}</td><td>${fmt(r.withdraw)}</td>
         <td style="color:${r.diff >= 0 ? "#059669" : "#dc2626"};font-weight:700">${r.diff >= 0 ? "+" : "-"}${fmt(Math.abs(r.diff))}</td>
       </tr>`).join("")}
       </tbody></table>`
    : "";

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>${input.title} — ${company}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#0f172a;margin:0;padding:32px;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px}
  .brand{font-size:24px;font-weight:800;letter-spacing:-0.02em}
  .subtitle{color:#64748b;font-size:13px;margin-top:4px}
  .meta{text-align:right;color:#64748b;font-size:13px}
  .scope{display:inline-block;margin-bottom:20px;padding:8px 14px;border-radius:10px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:13px}
  .scope b{color:#0f172a}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .stat{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#f8fafc}
  .stat .l{font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:.08em}
  .stat .v{font-size:20px;font-weight:800;margin-top:6px;font-variant-numeric:tabular-nums}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#475569;margin:24px 0 10px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  thead th{text-align:right;background:#f1f5f9;color:#475569;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:8px;border-bottom:2px solid #e2e8f0}
  thead th:first-child{text-align:left}
  tbody td{padding:8px;border-bottom:1px solid #f1f5f9;text-align:right;font-variant-numeric:tabular-nums}
  tbody td:first-child{text-align:left}
  .foot{margin-top:28px;text-align:center;color:#94a3b8;font-size:11px}
  @media print{ body{padding:16px} }
</style></head><body>
  <div class="head">
    <div>
      <div class="brand">${company}</div>
      <div class="subtitle">${input.title}</div>
    </div>
    <div class="meta">
      <div>${new Date().toLocaleDateString()}</div>
      <div>${input.rangeLabel}</div>
    </div>
  </div>
  <div class="scope">Scope: <b>${input.scopeLabel}</b></div>
  <div class="grid">
    ${stat("POS Sale", t.pos)}
    ${stat("Cash Sale", t.cash)}
    ${stat("Bank Sale", t.bank)}
    ${stat("Credit Sale", t.credit)}
    ${stat("Total Sale", t.totalSale, "#0f172a")}
    ${stat("Purchase", t.purchase, "#dc2626")}
    ${stat("Expense", t.expense, "#dc2626")}
    ${stat("Withdraw", t.withdraw)}
    ${stat("Plus / Minus", t.diff, t.diff >= 0 ? "#059669" : "#dc2626")}
  </div>
  ${tableHtml}
  <div class="foot">Generated By AhsAN Manager ShRiAh Group · ${new Date().toLocaleString()}</div>
  <script>window.onload = () => { setTimeout(() => window.print(), 250); };</script>
</body></html>`;

  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!w) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `shop-report.html`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// ---------------- Excel (CSV) ----------------
export function downloadShopReportExcel(input: ShopReportInput) {
  const headers = ["Shop", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale", "Total Sale", "Purchase", "Expense", "Withdraw", "Plus/Minus"];
  const lines = [headers.join(",")];
  for (const r of input.rows) {
    lines.push([
      `"${r.shop_name.replace(/"/g, '""')}"`,
      r.pos, r.cash, r.bank, r.credit, r.totalSale, r.purchase, r.expense, r.withdraw, r.diff,
    ].join(","));
  }
  if (input.rows.length > 1) {
    const t = totalsOf(input.rows);
    lines.push(["TOTAL", t.pos, t.cash, t.bank, t.credit, t.totalSale, t.purchase, t.expense, t.withdraw, t.diff].join(","));
  }
  const meta = `# ${input.title}\n# Scope: ${input.scopeLabel}\n# Range: ${input.rangeLabel}\n`;
  const csv = meta + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${input.title.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ---------------- Image download ----------------
export async function downloadShopReportImage(input: ShopReportInput) {
  const blob = await buildShopReportImage(input);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${input.title.replace(/\s+/g, "-").toLowerCase()}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ---------------- WhatsApp share (image + text) ----------------
export async function shareShopReportWhatsApp(input: ShopReportInput) {
  const company = input.company || COMPANY_DEFAULT;
  const t = totalsOf(input.rows);
  const text = [
    company,
    input.title,
    `Scope: ${input.scopeLabel}`,
    `Range: ${input.rangeLabel}`,
    "",
    `POS Sale: SAR ${fmt(t.pos)}`,
    `Cash Sale: SAR ${fmt(t.cash)}`,
    `Bank Sale: SAR ${fmt(t.bank)}`,
    `Credit Sale: SAR ${fmt(t.credit)}`,
    `Total Sale: SAR ${fmt(t.totalSale)}`,
    `Purchase: SAR ${fmt(t.purchase)}`,
    `Expense: SAR ${fmt(t.expense)}`,
    `Withdraw: SAR ${fmt(t.withdraw)}`,
    `Plus/Minus: SAR ${fmt(t.diff)}`,
  ].join("\n");

  const blob = await buildShopReportImage(input);
  const fileName = `${input.title.replace(/\s+/g, "-").toLowerCase()}.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const navAny = navigator as any;
  const canShareFiles = !!(navAny.canShare && navAny.share && navAny.canShare({ files: [file] }));

  if (canShareFiles) {
    try {
      await navAny.share({ files: [file], title: input.title, text });
      return { kind: "shared" as const };
    } catch (err: any) {
      if (err?.name === "AbortError") return { kind: "cancelled" as const };
    }
  }
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  return { kind: "fallback-link" as const };
}
