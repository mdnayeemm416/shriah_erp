// Employee Wallet — shared types and export helpers.
// IMPORTANT: Wallet is purely a tracking module. It must NEVER affect
// company accounting (cash, shop position, invest, P&L, reports, etc.).
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export type WalletKind = "expense" | "deposit";
export type WalletStatus = "pending" | "verified" | "rejected";

export type WalletRow = {
  id: string;
  employee_id: string;
  kind: WalletKind;
  status: WalletStatus;
  amount: number;
  category: string | null;
  note: string;
  txn_date: string;
  attachment_url: string | null;
  created_at?: string;
  created_by?: string | null;
};

export type WalletTotals = {
  deposit: number;
  expense: number;
  balance: number; // deposit - expense (positive = employee holds company money)
  depositMonth: number;
  expenseMonth: number;
};

export function computeWalletTotals(rows: WalletRow[]): WalletTotals {
  const monthPrefix = new Date().toISOString().slice(0, 7);
  let d = 0, e = 0, dm = 0, em = 0;
  for (const r of rows) {
    // Pending deposits don't count towards the balance until verified.
    if (r.kind === "deposit") {
      if (r.status === "verified") {
        d += Number(r.amount);
        if (r.txn_date.startsWith(monthPrefix)) dm += Number(r.amount);
      }
    } else {
      e += Number(r.amount);
      if (r.txn_date.startsWith(monthPrefix)) em += Number(r.amount);
    }
  }
  return { deposit: d, expense: e, balance: d - e, depositMonth: dm, expenseMonth: em };
}

export function walletRowsToSheet(rows: WalletRow[], nameLookup: (id: string) => string) {
  return rows.map((r) => ({
    Date: r.txn_date,
    Employee: nameLookup(r.employee_id),
    Type: r.kind === "deposit" ? "Deposit" : "Expense",
    Status: r.status,
    Category: r.category ?? "",
    Amount: Number(r.amount),
    Note: r.note,
    Attachment: r.attachment_url ?? "",
  }));
}

export function exportWalletExcel(rows: WalletRow[], nameLookup: (id: string) => string, filename = "employee-wallet") {
  const data = walletRowsToSheet(rows, nameLookup);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Wallet");
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportWalletPDF(
  rows: WalletRow[],
  nameLookup: (id: string) => string,
  title = "Employee Wallet Report",
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(14);
  doc.text(title, pageW / 2, 40, { align: "center" });
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, 56, { align: "center" });

  let y = 88;
  const headers = ["Date", "Employee", "Type", "Category", "Amount", "Note"];
  const cols = [50, 110, 220, 280, 360, 430];
  doc.setFont("helvetica", "bold");
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  doc.setFont("helvetica", "normal");
  y += 14;

  let totalDep = 0, totalExp = 0;
  for (const r of rows) {
    if (y > 780) { doc.addPage(); y = 60; }
    doc.text(r.txn_date, cols[0], y);
    doc.text(String(nameLookup(r.employee_id)).slice(0, 22), cols[1], y);
    doc.text(r.kind === "deposit" ? "Deposit" : "Expense", cols[2], y);
    doc.text((r.category ?? "-").slice(0, 16), cols[3], y);
    doc.text(Number(r.amount).toFixed(2), cols[4], y);
    doc.text(String(r.note ?? "").slice(0, 40), cols[5], y);
    y += 14;
    if (r.kind === "deposit" && r.status === "verified") totalDep += Number(r.amount);
    if (r.kind === "expense") totalExp += Number(r.amount);
  }

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Deposit: SAR ${totalDep.toFixed(2)}`, 50, y); y += 14;
  doc.text(`Total Expense: SAR ${totalExp.toFixed(2)}`, 50, y); y += 14;
  doc.text(`Wallet Balance: SAR ${(totalDep - totalExp).toFixed(2)}`, 50, y);

  doc.save(`employee-wallet-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function walletShareText(rows: WalletRow[], nameLookup: (id: string) => string) {
  const totals = computeWalletTotals(rows);
  const lines = [
    "*Employee Wallet Report*",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `Total Deposit: SAR ${totals.deposit.toFixed(2)}`,
    `Total Expense: SAR ${totals.expense.toFixed(2)}`,
    `Wallet Balance: SAR ${totals.balance.toFixed(2)}`,
    "",
    "Recent transactions:",
    ...rows.slice(0, 20).map(
      (r) =>
        `• ${r.txn_date} — ${nameLookup(r.employee_id)} — ${
          r.kind === "deposit" ? "Deposit" : "Expense"
        } — SAR ${Number(r.amount).toFixed(2)}${r.category ? ` (${r.category})` : ""}`,
    ),
  ];
  return lines.join("\n");
}

export async function shareWalletWhatsApp(rows: WalletRow[], nameLookup: (id: string) => string) {
  const text = walletShareText(rows, nameLookup);
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}
