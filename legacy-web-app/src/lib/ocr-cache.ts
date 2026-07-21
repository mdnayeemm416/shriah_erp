// Client-side OCR cache. Hashes the (compressed) image data URL and stores
// the model's structured output, so re-uploading the same receipt skips the
// model call entirely. Cap: 50 entries, LRU eviction.

import { scanDocument } from "./ai-scan.functions";

const KEY = "ocr-cache:v1";
const MAX = 50;

type Entry = { hash: string; result: any; at: number };

async function sha256(s: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) return String(s.length) + ":" + s.slice(0, 32);
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readAll(): Entry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function writeAll(rows: Entry[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX))); } catch { /* quota */ }
}

export async function scanDocumentCached(input: { imageDataUrl: string; mimeType?: string }) {
  const hash = await sha256(input.imageDataUrl);
  const all = readAll();
  const hit = all.find((e) => e.hash === hash);
  if (hit) {
    // bump LRU
    writeAll([...all.filter((e) => e.hash !== hash), { ...hit, at: Date.now() }]);
    return hit.result;
  }
  const result = await scanDocument({ data: { imageDataUrl: input.imageDataUrl, mimeType: input.mimeType ?? "image/jpeg" } });
  writeAll([...all, { hash, result, at: Date.now() }]);
  return result;
}
