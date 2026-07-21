// Sales Return Invoice — PNG renderer (mirrors invoice-v2/image.ts).
import { toPng } from "html-to-image";
import { buildSalesReturnInvoiceNode } from "./html";
import type { SalesReturnInvoiceData } from "./types";

const SAFE_FONT = 'Arial, Tahoma, "Segoe UI", sans-serif';
const REMOTE_FONT_RE = /(Cairo|Tajawal|Noto\s+Sans\s+Arabic|Noto\s+Naskh\s+Arabic|IBM\s+Plex|Inter|Manrope|Plus\s+Jakarta)/i;

function sanitize(root: HTMLElement) {
  root.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());
  root.querySelectorAll("style").forEach((el) => {
    if (REMOTE_FONT_RE.test(el.textContent || "")) el.remove();
  });
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const ff = el.style.fontFamily;
    if (!ff || REMOTE_FONT_RE.test(ff)) el.style.fontFamily = SAFE_FONT;
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

export async function buildSalesReturnInvoicePng(
  data: SalesReturnInvoiceData,
): Promise<{ blob: Blob; dataUrl: string; fileName: string; widthPx: number; heightPx: number }> {
  const { node, widthPx } = await buildSalesReturnInvoiceNode(data);
  const wrapper = (node as any).__wrapper as HTMLElement | undefined;
  try {
    sanitize(node);
    if (node.childElementCount === 0 || node.offsetWidth === 0 || node.offsetHeight === 0) {
      throw new Error(`Return invoice DOM empty (w=${node.offsetWidth} h=${node.offsetHeight})`);
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
        return !(tag === "LINK" || tag === "STYLE");
      },
    } as any);
    const blob = await (await fetch(dataUrl)).blob();
    const fileName = `${data.returnNumber}.png`;
    return { blob, dataUrl, fileName, widthPx, heightPx: node.offsetHeight };
  } catch (e) {
    throw new Error(`Return PNG render failed: ${formatError(e)}`);
  } finally {
    (wrapper ?? node).remove();
  }
}
