// "80mm by AM" — thermal PDF (80mm × auto height).
// Wraps the rendered PNG into a jsPDF with exact 80mm page width.

import jsPDF from "jspdf";
import { buildInvoiceAm80Png } from "./image";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";

const PAGE_W_MM = 80;

export async function buildInvoiceAm80Pdf(
  data: InvoiceV2Data,
): Promise<{ blob: Blob; fileName: string }> {
  const { dataUrl, widthPx, heightPx } = await buildInvoiceAm80Png(data);

  // Convert px → mm at the captured pixel ratio (image is widthPx wide at
  // the receipt CSS width, which is 80mm). So 1 px == 80mm / widthPx.
  const pageHmm = (heightPx / widthPx) * PAGE_W_MM;

  const doc = new jsPDF({ unit: "mm", format: [PAGE_W_MM, pageHmm], orientation: "portrait" });
  doc.addImage(dataUrl, "PNG", 0, 0, PAGE_W_MM, pageHmm, undefined, "FAST");

  const blob = doc.output("blob");
  const fileName = `am80_${data.invoiceNumber}_${Date.now()}.pdf`;
  return { blob, fileName };
}
