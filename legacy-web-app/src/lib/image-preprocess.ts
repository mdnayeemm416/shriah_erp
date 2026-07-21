// Lightweight client-side image enhancement for OCR.
// Grayscale + contrast boost + soft unsharp mask. Pure canvas, no deps.

export type PreprocessOptions = {
  maxEdge?: number;     // resize cap
  quality?: number;     // jpeg quality
  contrast?: number;    // 1.0 = none, 1.3 = +30%
  grayscale?: boolean;
  sharpen?: boolean;
};

/** Enhance a photo of a handwritten purchase sheet before sending to OCR. */
export async function enhanceForOcr(
  file: File,
  opts: PreprocessOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const {
    maxEdge = 1200,
    quality = 0.72,
    contrast = 1.25,
    grayscale = true,
    sharpen = true,
  } = opts;


  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * s));
    const h = Math.max(1, Math.round(bmp.height * s));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();

    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;

    // Grayscale + contrast (around mid-grey 128).
    const c = contrast;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];
      if (grayscale) {
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = y;
      }
      r = clamp((r - 128) * c + 128);
      g = clamp((g - 128) * c + 128);
      b = clamp((b - 128) * c + 128);
      d[i] = r; d[i + 1] = g; d[i + 2] = b;
    }
    ctx.putImageData(img, 0, 0);

    if (sharpen) applyUnsharp(ctx, w, h, 0.6);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", quality),
    );
    if (!blob) return file;
    return new File(
      [blob],
      file.name.replace(/\.\w+$/, "") + ".ocr.jpg",
      { type: "image/jpeg" },
    );
  } catch {
    return file;
  }
}

function clamp(v: number) { return v < 0 ? 0 : v > 255 ? 255 : v; }

/** Cheap 3x3 unsharp mask. amount in 0..1 = sharpening strength. */
function applyUnsharp(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount: number,
) {
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const s = src.data, o = dst.data;
  // Kernel: identity + amount*(identity - blur). Blur = 3x3 box.
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      for (let k = 0; k < 3; k++) {
        let sum = 0;
        for (let yy = -1; yy <= 1; yy++)
          for (let xx = -1; xx <= 1; xx++)
            sum += s[((y + yy) * w + (x + xx)) * 4 + k];
        const blur = sum / 9;
        o[i + k] = clamp(s[i + k] + amount * (s[i + k] - blur));
      }
      o[i + 3] = 255;
    }
  }
  // Copy edges unmodified.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
        const i = (y * w + x) * 4;
        o[i] = s[i]; o[i + 1] = s[i + 1]; o[i + 2] = s[i + 2]; o[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(dst, 0, 0);
}
