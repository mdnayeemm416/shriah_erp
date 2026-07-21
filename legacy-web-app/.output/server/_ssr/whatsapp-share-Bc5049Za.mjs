import { t as toast } from "../_libs/sonner.mjs";
const OFFICIAL_SHARE_CAPTION = "Official Financial Entry • ShRiAh Group ERP";
async function renderShareImage(p) {
  const W = 1080;
  const PAD = 64;
  const ROW_H = 64;
  const subtitleExtra = p.subtitleSecondary ? 32 : 0;
  const headerH = 260 + subtitleExtra;
  const footerH = 120;
  const notesH = p.notes ? 180 : 0;
  const rowsH = p.rows.length * ROW_H + 40;
  const highlightH = p.highlight ? 180 : 0;
  const H = headerH + rowsH + highlightH + notesH + footerH + 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const accent = p.accentColor ?? (p.accent === "in" ? "#047857" : p.accent === "out" ? "#b91c1c" : "#111111");
  const accentSoft = hexToSoft(accent);
  const C_PRIMARY = "#111111";
  const C_SECONDARY = "#444444";
  const C_MUTED = "#666666";
  const C_DIVIDER = "#e5e7eb";
  roundRect(ctx, PAD, PAD, W - PAD * 2, headerH - 24, 28);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.fillStyle = C_PRIMARY;
  ctx.font = "800 40px Inter, system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(p.title, PAD + 36, PAD + 36);
  if (p.subtitle) {
    ctx.fillStyle = C_SECONDARY;
    ctx.font = "600 24px Inter, system-ui, -apple-system, sans-serif";
    ctx.fillText(p.subtitle, PAD + 36, PAD + 86);
  }
  if (p.subtitleSecondary) {
    ctx.fillStyle = C_MUTED;
    ctx.font = "500 21px Inter, system-ui, -apple-system, sans-serif";
    ctx.fillText(p.subtitleSecondary, PAD + 36, PAD + 86 + (p.subtitle ? 32 : 0));
  }
  if (p.badge) {
    const padX = 18;
    ctx.font = "700 20px Inter, system-ui, sans-serif";
    const bw = ctx.measureText(p.badge).width + padX * 2;
    const bx = W - PAD - 36 - bw;
    const by = PAD + 36;
    roundRect(ctx, bx, by, bw, 36, 18);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(p.badge, bx + padX, by + 18);
    ctx.textBaseline = "top";
  }
  ctx.fillStyle = C_MUTED;
  ctx.font = "700 18px Inter, system-ui, sans-serif";
  ctx.fillText((p.amountLabel ?? "Amount").toUpperCase(), PAD + 36, PAD + 130);
  ctx.fillStyle = accent;
  ctx.font = "800 64px Inter, system-ui, sans-serif";
  ctx.fillText(p.amount, PAD + 36, PAD + 156);
  if (p.date) {
    ctx.fillStyle = C_SECONDARY;
    ctx.font = "600 21px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(p.date, W - PAD - 36, PAD + headerH - 84);
    ctx.textAlign = "left";
  }
  const rowsY = headerH + 40;
  roundRect(ctx, PAD, rowsY, W - PAD * 2, rowsH, 24);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = C_DIVIDER;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  p.rows.forEach((r, i) => {
    const y = rowsY + 24 + i * ROW_H;
    if (i > 0) {
      ctx.strokeStyle = C_DIVIDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD + 28, y);
      ctx.lineTo(W - PAD - 28, y);
      ctx.stroke();
    }
    ctx.fillStyle = C_SECONDARY;
    ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillText(r.label, PAD + 36, y + 18);
    ctx.fillStyle = C_PRIMARY;
    ctx.font = "700 24px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(r.value, W - PAD - 36, y + 17);
    ctx.textAlign = "left";
  });
  const highlightY = rowsY + rowsH + 24;
  if (p.highlight) {
    const hToneColor = p.highlight.tone === "positive" ? "#047857" : p.highlight.tone === "negative" ? "#b91c1c" : "#111111";
    const hBg = p.highlight.tone === "positive" ? "#ecfdf5" : p.highlight.tone === "negative" ? "#fef2f2" : "#f3f4f6";
    const hCardH = highlightH - 24;
    roundRect(ctx, PAD, highlightY, W - PAD * 2, hCardH, 24);
    ctx.fillStyle = hBg;
    ctx.fill();
    ctx.strokeStyle = hToneColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = C_SECONDARY;
    ctx.font = "700 20px Inter, system-ui, sans-serif";
    ctx.fillText(p.highlight.label.toUpperCase(), W / 2, highlightY + 28);
    ctx.fillStyle = hToneColor;
    ctx.font = "800 58px Inter, system-ui, sans-serif";
    ctx.fillText(p.highlight.amount, W / 2, highlightY + 68);
    ctx.textAlign = "left";
  }
  if (p.notes) {
    const ny = highlightY + highlightH;
    roundRect(ctx, PAD, ny, W - PAD * 2, notesH - 24, 24);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.fillStyle = C_MUTED;
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillText("NOTES", PAD + 28, ny + 24);
    ctx.fillStyle = C_PRIMARY;
    ctx.font = "500 22px Inter, sans-serif";
    wrapText(ctx, p.notes, PAD + 28, ny + 60, W - PAD * 2 - 56, 30);
  }
  const fy = H - footerH + 24;
  ctx.fillStyle = C_SECONDARY;
  ctx.font = "600 19px Inter, sans-serif";
  ctx.fillText(p.brand ?? "ShRiAh Group", PAD, fy);
  ctx.textAlign = "right";
  ctx.fillText((/* @__PURE__ */ new Date()).toLocaleString(), W - PAD, fy);
  ctx.textAlign = "left";
  if (p.footerNote) {
    ctx.fillStyle = C_PRIMARY;
    ctx.font = "700 20px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.footerNote, W / 2, fy + 34);
    ctx.textAlign = "left";
  }
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png", 0.95);
  });
}
function hexToSoft(hex) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.08)`;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
      if (yy > y + lh * 3) {
        ctx.fillText(line + "…", x, yy);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
async function shareToWhatsApp(p) {
  try {
    const blob = await renderShareImage(p);
    const fileName = `${p.title.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const nav = navigator;
    const caption = p.caption ?? OFFICIAL_SHARE_CAPTION;
    const shareData = { files: [file], text: caption };
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share(shareData);
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Image downloaded — attach it in WhatsApp");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e) {
    if (e?.name === "AbortError") return;
    console.error(e);
    toast.error("Could not share image");
  }
}
export {
  shareToWhatsApp as s
};
