// Invoice V2 — PDF renderer.
// Strategy: render the same off-screen HTML invoice used for image share at
// high pixel ratio, then embed into an A4 jsPDF. This guarantees Arabic
// glyphs render identically in the PDF and the shared image.

import jsPDF from "jspdf";
import { buildInvoiceV2Png } from "./image";
import type { InvoiceV2Data } from "./types";

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 6;

export async function buildInvoiceV2Pdf(
  data: InvoiceV2Data,
): Promise<{ blob: Blob; fileName: string }> {
  const { dataUrl, widthPx, heightPx } = await buildInvoiceV2Png(data);

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const usableW = A4_W_MM - MARGIN_MM * 2;
  const usableH = A4_H_MM - MARGIN_MM * 2;

  // Scale image so width fills usable area; height proportional.
  const imgWmm = usableW;
  const imgHmm = (heightPx / widthPx) * imgWmm;

  if (imgHmm <= usableH) {
    doc.addImage(dataUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, imgHmm, undefined, "FAST");
  } else {
    // Tall invoice — slice into multiple A4 pages.
    const pxPerMm = widthPx / imgWmm;
    const pageHpx = usableH * pxPerMm;
    let offsetPx = 0;
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = Math.ceil(pageHpx);
    const ctx = canvas.getContext("2d")!;
    let first = true;
    while (offsetPx < heightPx) {
      const sliceH = Math.min(pageHpx, heightPx - offsetPx);
      canvas.height = Math.ceil(sliceH);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, -offsetPx);
      const sliceUrl = canvas.toDataURL("image/png");
      if (!first) doc.addPage();
      const sliceHmm = sliceH / pxPerMm;
      doc.addImage(sliceUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, sliceHmm, undefined, "FAST");
      offsetPx += sliceH;
      first = false;
    }
  }

  const blob = doc.output("blob");
  const fileName = `invoice_${data.invoiceNumber}_${Date.now()}.pdf`;
  return { blob, fileName };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
