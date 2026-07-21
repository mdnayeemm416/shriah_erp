// "80mm by AM" — high-resolution PNG capture.

import { toPng } from "html-to-image";
import { buildInvoiceAm80Node } from "./html";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";

const SAFE_FONT = 'Inter, Roboto, Arial, sans-serif';
const REMOTE_CSS_RE = /@import|url\s*\(/i;

function sanitize(root: HTMLElement) {
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_CSS_RE.test(el.textContent || "")) el.remove();
  });
}

function formatError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (e instanceof Event) {
    const t = e.target as any;
    return `Resource load failed (${e.type}${t?.src ? `: ${t.src}` : ""})`;
  }
  try { return JSON.stringify(e); } catch { return String(e); }
}

export async function buildInvoiceAm80Png(
  data: InvoiceV2Data,
): Promise<{ blob: Blob; dataUrl: string; fileName: string; widthPx: number; heightPx: number }> {
  const { node, widthPx } = await buildInvoiceAm80Node(data);
  const wrapper = (node as any).__wrapper as HTMLElement | undefined;
  try {
    sanitize(node);

    if (node.offsetWidth === 0 || node.offsetHeight === 0) {
      throw new Error(`Invoice DOM empty (w=${node.offsetWidth} h=${node.offsetHeight})`);
    }

    const heightPx = node.offsetHeight;
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: widthPx,
      height: heightPx,
      skipFonts: true,
      fontEmbedCSS: "",
      style: { transform: "none", fontFamily: SAFE_FONT, position: "static", left: "0", top: "0" },
      filter: (n: HTMLElement) => {
        const tag = (n as HTMLElement).tagName;
        if (tag === "LINK") return false;
        return true;
      },
    } as any);

    const blob = await (await fetch(dataUrl)).blob();
    const fileName = `am80_${data.invoiceNumber}_${Date.now()}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx };
  } catch (e) {
    throw new Error(`PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
