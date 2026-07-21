// Tiny SAR amount-in-words converter (English). Independent helper.

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below1000(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " + below1000(n % 100) : ""}`;
}

function intToWords(n: number): string {
  if (n === 0) return "Zero";
  const units = ["", "Thousand", "Million", "Billion"];
  let out = "";
  let i = 0;
  while (n > 0 && i < units.length) {
    const chunk = n % 1000;
    if (chunk) out = `${below1000(chunk)}${units[i] ? " " + units[i] : ""}${out ? " " + out : ""}`;
    n = Math.floor(n / 1000);
    i++;
  }
  return out.trim();
}

export function amountInWordsSAR(amount: number): string {
  const v = Math.max(0, Number(amount) || 0);
  const riyals = Math.floor(v);
  const halalas = Math.round((v - riyals) * 100);
  const r = intToWords(riyals);
  const h = halalas ? ` and ${intToWords(halalas)} Halalas` : "";
  return `${r} Saudi Riyal${riyals === 1 ? "" : "s"}${h} Only`;
}
