import { toast } from "sonner";

export type ShareRow = { label: string; value: string };

export type ShareHighlight = {
  label: string;
  amount: string;
  tone?: "positive" | "negative" | "neutral";
};

export const OFFICIAL_SHARE_CAPTION = "Official Financial Entry • ShRiAh Group ERP";

export type ShareImagePayload = {
  title: string;        // e.g. "Shop Sale"
  subtitle?: string;    // e.g. shop / cashier / party
  subtitleSecondary?: string; // optional second subtitle line (e.g. entry type)
  amount: string;       // formatted SAR string
  amountLabel?: string; // e.g. "Total Sale"
  date?: string;
  rows: ShareRow[];
  notes?: string | null;
  badge?: string;       // e.g. "Cash In" / "Cash Out"
  accent?: "in" | "out" | "neutral";
  accentColor?: string; // override accent (hex)
  brand?: string;       // footer brand line
  caption?: string;     // optional caption override (defaults to OFFICIAL_SHARE_CAPTION)
  footerNote?: string;  // extra footer line (e.g. "By Accountant ShRiAh Group")
  highlight?: ShareHighlight; // centered large bold value (e.g. Difference)
};

/**
 * Render a premium finance receipt image to a Blob.
 * Pure canvas — no DOM mount required. Works on mobile.
 */
export async function renderShareImage(p: ShareImagePayload): Promise<Blob> {
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
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Accent header band
  const accent =
    p.accentColor ??
    (p.accent === "in" ? "#047857" : p.accent === "out" ? "#b91c1c" : "#111111");
  const accentSoft = hexToSoft(accent);

  // Color tokens (high-contrast)
  const C_PRIMARY = "#111111";
  const C_SECONDARY = "#444444";
  const C_MUTED = "#666666";
  const C_DIVIDER = "#e5e7eb";

  // Header card
  roundRect(ctx, PAD, PAD, W - PAD * 2, headerH - 24, 28);
  ctx.fillStyle = accentSoft;
  ctx.fill();

  // Title
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

  // Badge
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

  // Amount block
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

  // Rows card
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

  // Highlight (e.g. Difference)
  const highlightY = rowsY + rowsH + 24;
  if (p.highlight) {
    const hToneColor =
      p.highlight.tone === "positive" ? "#047857"
      : p.highlight.tone === "negative" ? "#b91c1c"
      : "#111111";
    const hBg =
      p.highlight.tone === "positive" ? "#ecfdf5"
      : p.highlight.tone === "negative" ? "#fef2f2"
      : "#f3f4f6";
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

  // Notes
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

  // Footer
  const fy = H - footerH + 24;
  ctx.fillStyle = C_SECONDARY;
  ctx.font = "600 19px Inter, sans-serif";
  ctx.fillText(p.brand ?? "ShRiAh Group", PAD, fy);
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(), W - PAD, fy);
  ctx.textAlign = "left";
  if (p.footerNote) {
    ctx.fillStyle = C_PRIMARY;
    ctx.font = "700 20px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.footerNote, W / 2, fy + 34);
    ctx.textAlign = "left";
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png", 0.95);
  });
}

function hexToSoft(hex: string): string {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.08)`;
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

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
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

/**
 * Generate the receipt image and share it via WhatsApp.
 * Uses Web Share API with files (image only, no text) where available.
 * Falls back to downloading the image + opening wa.me.
 */
export async function shareToWhatsApp(p: ShareImagePayload) {
  try {
    const blob = await renderShareImage(p);
    const fileName = `${p.title.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });

    const nav = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean;
      share?: (data: ShareData) => Promise<void>;
    };

    // Caption: prefer per-share override (e.g. "Shop Entry By ShRiAh Group"),
    // fall back to the official unified caption.
    const caption = p.caption ?? OFFICIAL_SHARE_CAPTION;
    const shareData: ShareData = { files: [file], text: caption };

    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share(shareData);
      return;
    }

    // Fallback: download then open WhatsApp web
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
  } catch (e: any) {
    if (e?.name === "AbortError") return; // user cancelled
    console.error(e);
    toast.error("Could not share image");
  }
}
