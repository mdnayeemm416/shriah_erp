// Invoice V2 — own ZATCA Phase 1 QR (TLV → Base64).
// Self-contained: does NOT import any frozen invoice helper.

function tlvBytes(tag: number, value: string, parts: number[]) {
  const bytes = new TextEncoder().encode(value);
  if (bytes.length > 255) throw new Error(`ZATCA TLV field ${tag} too long`);
  parts.push(tag, bytes.length, ...bytes);
}

export function zatcaV2TlvBase64(opts: {
  sellerName: string;
  vatNumber: string;
  isoTimestamp: string;
  totalInclVat: string; // e.g. "115.00"
  vatAmount: string;    // e.g. "15.00"
}): string {
  const parts: number[] = [];
  tlvBytes(1, opts.sellerName, parts);
  tlvBytes(2, opts.vatNumber, parts);
  tlvBytes(3, opts.isoTimestamp, parts);
  tlvBytes(4, opts.totalInclVat, parts);
  tlvBytes(5, opts.vatAmount, parts);
  const u8 = new Uint8Array(parts);
  let bin = "";
  for (let i = 0; i < u8.length; i += 0x8000) {
    bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

export function toIsoTimestamp(input?: string | Date): string {
  if (!input) return new Date().toISOString();
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}
