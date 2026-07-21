// Sales Return Invoice — PDF renderer (A4).
import jsPDF from "jspdf";
import { buildSalesReturnInvoicePng } from "./image";
import type { SalesReturnInvoiceData } from "./types";

const A4_W_MM = 210;
const A4_H_MM = 297;
const MARGIN_MM = 6;

export async function buildSalesReturnInvoicePdf(
  data: SalesReturnInvoiceData,
): Promise<{ blob: Blob; fileName: string }> {
  const { dataUrl, widthPx, heightPx } = await buildSalesReturnInvoicePng(data);
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const usableW = A4_W_MM - MARGIN_MM * 2;
  const usableH = A4_H_MM - MARGIN_MM * 2;
  const imgWmm = usableW;
  const imgHmm = (heightPx / widthPx) * imgWmm;
  if (imgHmm <= usableH) {
    doc.addImage(dataUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, imgHmm, undefined, "FAST");
  } else {
    const pxPerMm = widthPx / imgWmm;
    const pageHpx = usableH * pxPerMm;
    let offsetPx = 0;
    const img = await loadImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
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
      doc.addImage(sliceUrl, "PNG", MARGIN_MM, MARGIN_MM, imgWmm, sliceH / pxPerMm, undefined, "FAST");
      offsetPx += sliceH;
      first = false;
    }
  }
  const blob = doc.output("blob");
  return { blob, fileName: `${data.returnNumber}.pdf` };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
