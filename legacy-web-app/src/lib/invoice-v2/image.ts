// Invoice V2 — high-quality PNG renderer (html-to-image).
// IMPORTANT: html-to-image cannot inline cross-origin CSS (Google Fonts)
// — it throws SecurityError that surfaces as `[object Event]`. We disable
// web-font embedding entirely and sanitize the node to use only system
// fonts (Arial / Tahoma) which render Arabic correctly on all platforms.

import { toPng } from "html-to-image";
import { buildInvoiceV2Node } from "./html";
import type { InvoiceV2Data } from "./types";

const SAFE_FONT = 'Arial, Tahoma, "Segoe UI", sans-serif';
const REMOTE_FONT_RE = /(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;

function sanitizeExportNode(root: HTMLElement) {
  // Strip any external stylesheet links that might have been injected.
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_FONT_RE.test(el.textContent || "")) el.remove();
  });
  // Force every node's inline font-family to the safe system stack.
  const all = root.querySelectorAll<HTMLElement>("*");
  all.forEach((el) => {
    const ff = el.style.fontFamily;
    if (!ff || REMOTE_FONT_RE.test(ff)) {
      el.style.fontFamily = SAFE_FONT;
    }
  });
  root.style.fontFamily = SAFE_FONT;
}

function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e instanceof Event) {
    const t = e.target as any;
    return `Resource load failed (${e.type}${t?.src ? `: ${t.src}` : ""})`;
  }
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function buildInvoiceV2Png(
  data: InvoiceV2Data,
): Promise<{ blob: Blob; dataUrl: string; fileName: string; widthPx: number; heightPx: number }> {
  const { node, widthPx, heightPx } = await buildInvoiceV2Node(data);
  const wrapper = (node as any).__wrapper as HTMLElement | undefined;
  try {
    sanitizeExportNode(node);

    // ---- Diagnostics: prove the captured node is non-empty before toPng ----
    const diag = {
      selector: "[data-invoice-v2-root]",
      offsetWidth: node.offsetWidth,
      offsetHeight: node.offsetHeight,
      scrollWidth: node.scrollWidth,
      scrollHeight: node.scrollHeight,
      childElementCount: node.childElementCount,
      innerHTMLLength: node.innerHTML.length,
    };
    // eslint-disable-next-line no-console
    console.log("[InvoiceV2] export node diagnostics", diag);

    if (
      node.childElementCount === 0 ||
      node.offsetWidth === 0 ||
      node.offsetHeight === 0 ||
      node.innerHTML.length === 0
    ) {
      throw new Error(
        `Invoice DOM is empty (w=${node.offsetWidth} h=${node.offsetHeight} children=${node.childElementCount})`,
      );
    }

    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: node.offsetHeight,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static", left: "0", top: "0" },
      filter: (n: HTMLElement) => {
        const tag = (n as HTMLElement).tagName;
        if (tag === "LINK" || tag === "STYLE") return false;
        return true;
      },
    } as any);

    const blob = await (await fetch(dataUrl)).blob();
    // eslint-disable-next-line no-console
    console.log("[InvoiceV2] export complete", { bytes: blob.size, width: widthPx, height: node.offsetHeight });
    const fileName = `invoice_${data.invoiceNumber}_${Date.now()}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx: node.offsetHeight };
  } catch (e) {
    throw new Error(`PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
