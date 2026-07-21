// Price Compare — export helpers (independent module).
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import type { PCHistoryRow, PCSummary, PCSupplierRow } from "./queries";

export function exportPriceCompareExcel(
  productName: string,
  history: PCHistoryRow[],
  suppliers: PCSupplierRow[],
) {
  const wb = XLSX.utils.book_new();
  const historySheet = XLSX.utils.json_to_sheet(
    history.map((r) => ({
      Date: r.record_date,
      Market: r.market_name ?? "—",
      Supplier: r.supplier_name ?? "—",
      Purchase: r.purchase_price,
      Selling: r.selling_price ?? "",
      Offer: r.offer_price ?? "",
      "Previous Purchase": r.prev,
      "Δ SAR": r.delta,
      "Δ %": Number(r.deltaPct.toFixed(2)),
      Notes: r.notes ?? "",
    })),
  );
  const supplierSheet = XLSX.utils.json_to_sheet(
    suppliers.map((s) => ({
      Supplier: s.supplier,
      "Last Price": s.last,
      "Lowest Price": s.lowest,
      "Highest Price": s.highest,
      "Average Price": Number(s.average.toFixed(2)),
      Records: s.count,
      "Last Date": s.lastDate,
    })),
  );
  XLSX.utils.book_append_sheet(wb, historySheet, "History");
  XLSX.utils.book_append_sheet(wb, supplierSheet, "Suppliers");
  const safe = productName.replace(/[^\w\-]+/g, "_").slice(0, 40);
  XLSX.writeFile(wb, `price-compare-${safe}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportPriceComparePDF(
  productName: string,
  summary: PCSummary,
  history: PCHistoryRow[],
  suppliers: PCSupplierRow[],
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(14);
  doc.text("Price Compare Report", pageW / 2, 40, { align: "center" });
  doc.setFontSize(10);
  doc.text(productName, pageW / 2, 58, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, 72, { align: "center" });

  let y = 100;
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 40, y);
  doc.setFont("helvetica", "normal");
  y += 16;
  const s = summary;
  const lines = [
    `Current: SAR ${s.currentPurchase.toFixed(2)}   Last: SAR ${s.lastPurchase.toFixed(2)}`,
    `Lowest: SAR ${s.lowest.toFixed(2)}   Highest: SAR ${s.highest.toFixed(2)}   Avg: SAR ${s.average.toFixed(2)}`,
    `Records: ${s.totalRecords}   Current Sell: SAR ${s.currentSell.toFixed(2)}   Offer: SAR ${s.currentOffer.toFixed(2)}`,
  ];
  for (const l of lines) { doc.text(l, 40, y); y += 14; }

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Price Records", 40, y); y += 14;
  const headers = ["Date", "Market", "Supplier", "Purchase", "Sell", "Offer", "Δ"];
  const cols = [40, 110, 200, 290, 350, 400, 450];
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  doc.setFont("helvetica", "normal");
  y += 12;
  for (const r of history) {
    if (y > 780) { doc.addPage(); y = 60; }
    doc.text(r.record_date, cols[0], y);
    doc.text(String(r.market_name ?? "—").slice(0, 16), cols[1], y);
    doc.text(String(r.supplier_name ?? "—").slice(0, 16), cols[2], y);
    doc.text(r.purchase_price.toFixed(2), cols[3], y);
    doc.text(r.selling_price != null ? r.selling_price.toFixed(2) : "—", cols[4], y);
    doc.text(r.offer_price != null ? r.offer_price.toFixed(2) : "—", cols[5], y);
    doc.text(`${r.delta.toFixed(2)}`, cols[6], y);
    y += 12;
  }

  y += 10;
  if (y > 740) { doc.addPage(); y = 60; }
  doc.setFont("helvetica", "bold");
  doc.text("Suppliers (sorted by lowest price)", 40, y); y += 14;
  const sh = ["Supplier", "Last", "Low", "High", "Avg", "Records", "Last Date"];
  const sc = [40, 200, 250, 300, 350, 400, 460];
  sh.forEach((h, i) => doc.text(h, sc[i], y));
  doc.setFont("helvetica", "normal");
  y += 12;
  for (const r of suppliers) {
    if (y > 780) { doc.addPage(); y = 60; }
    doc.text(String(r.supplier).slice(0, 26), sc[0], y);
    doc.text(r.last.toFixed(2), sc[1], y);
    doc.text(r.lowest.toFixed(2), sc[2], y);
    doc.text(r.highest.toFixed(2), sc[3], y);
    doc.text(r.average.toFixed(2), sc[4], y);
    doc.text(String(r.count), sc[5], y);
    doc.text(r.lastDate, sc[6], y);
    y += 12;
  }

  const safe = productName.replace(/[^\w\-]+/g, "_").slice(0, 40);
  doc.save(`price-compare-${safe}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function sharePriceCompareWhatsApp(productName: string, summary: PCSummary, suppliers: PCSupplierRow[]) {
  const s = summary;
  const top = suppliers.slice(0, 5)
    .map((r, i) => `${i + 1}. ${r.supplier} — SAR ${r.lowest.toFixed(2)} (avg ${r.average.toFixed(2)})`)
    .join("\n");
  const text = [
    `*Price Compare — ${productName}*`,
    `Current: SAR ${s.currentPurchase.toFixed(2)}  •  Last: SAR ${s.lastPurchase.toFixed(2)}`,
    `Low: SAR ${s.lowest.toFixed(2)}  •  High: SAR ${s.highest.toFixed(2)}  •  Avg: SAR ${s.average.toFixed(2)}`,
    `Records: ${s.totalRecords}`,
    "",
    "*Best Suppliers:*",
    top || "(no data)",
  ].join("\n");
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
