function tlvBytes(tag, value, parts) {
  const bytes = new TextEncoder().encode(value);
  if (bytes.length > 255) throw new Error(`ZATCA TLV field ${tag} too long`);
  parts.push(tag, bytes.length, ...bytes);
}
function zatcaV2TlvBase64(opts) {
  const parts = [];
  tlvBytes(1, opts.sellerName, parts);
  tlvBytes(2, opts.vatNumber, parts);
  tlvBytes(3, opts.isoTimestamp, parts);
  tlvBytes(4, opts.totalInclVat, parts);
  tlvBytes(5, opts.vatAmount, parts);
  const u8 = new Uint8Array(parts);
  let bin = "";
  for (let i = 0; i < u8.length; i += 32768) {
    bin += String.fromCharCode(...u8.subarray(i, i + 32768));
  }
  return btoa(bin);
}
function toIsoTimestamp(input) {
  if (!input) return (/* @__PURE__ */ new Date()).toISOString();
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
}
export {
  toIsoTimestamp as t,
  zatcaV2TlvBase64 as z
};
