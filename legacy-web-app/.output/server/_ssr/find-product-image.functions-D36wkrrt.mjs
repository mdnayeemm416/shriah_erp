import { c as createServerRpc } from "./createServerRpc-DpbYpY9o.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";
import { s as supabaseAdmin } from "./client.server-BKaVHv6C.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";




import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const BUCKET = "shop-product-images";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
async function getVqd(query) {
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: {
      "User-Agent": UA
    }
  });
  const html = await res.text();
  const m = html.match(/vqd=["']?(\d-[0-9-]+)["']?/) || html.match(/vqd=([0-9-]+)/);
  return m ? m[1] : null;
}
async function ddgSearch(query, limit) {
  const vqd = await getVqd(query);
  if (!vqd) return [];
  const url = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Referer": "https://duckduckgo.com/",
      "Accept": "application/json"
    }
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  const results = json?.results ?? [];
  return results.slice(0, limit).map((r) => ({
    thumbnail: r.thumbnail,
    image: r.image,
    title: r.title ?? "",
    source: r.source ?? r.url ?? "",
    width: r.width,
    height: r.height
  }));
}
const searchProductImages_createServerFn_handler = createServerRpc({
  id: "2958977d1401a1ac12eb5a49626ed0d94a4fc6d8582d53453f58ad7fdfd7c4e6",
  name: "searchProductImages",
  filename: "src/lib/find-product-image.functions.ts"
}, (opts) => searchProductImages.__executeServer(opts));
const searchProductImages = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  name: stringType().max(200).optional(),
  barcode: stringType().max(64).optional(),
  brand: stringType().max(100).optional(),
  itemCode: stringType().max(64).optional(),
  query: stringType().max(200).optional(),
  limit: numberType().min(1).max(12).default(6)
}).parse(input)).handler(searchProductImages_createServerFn_handler, async ({
  data
}) => {
  const queries = [];
  if (data.query?.trim()) queries.push(data.query.trim());
  if (data.barcode?.trim()) queries.push(`${data.barcode.trim()} product packaging`);
  const nameParts = [data.brand, data.name].filter(Boolean).join(" ").trim();
  if (nameParts) queries.push(`${nameParts} product package white background`);
  if (data.itemCode?.trim() && !nameParts) queries.push(data.itemCode.trim());
  const tried = /* @__PURE__ */ new Set();
  const out = [];
  for (const q of queries) {
    if (out.length >= data.limit) break;
    if (tried.has(q)) continue;
    tried.add(q);
    try {
      const r = await ddgSearch(q, data.limit);
      for (const s of r) {
        if (out.find((x) => x.image === s.image)) continue;
        out.push(s);
        if (out.length >= data.limit) break;
      }
    } catch {
    }
  }
  return {
    suggestions: out
  };
});
const saveRemoteProductImage_createServerFn_handler = createServerRpc({
  id: "2fd0bae907d3c91f1c0045e38e90ad09f93d21194d789b1746088d1a2cb34488",
  name: "saveRemoteProductImage",
  filename: "src/lib/find-product-image.functions.ts"
}, (opts) => saveRemoteProductImage.__executeServer(opts));
const saveRemoteProductImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  url: stringType().url().max(2e3)
}).parse(input)).handler(saveRemoteProductImage_createServerFn_handler, async ({
  data
}) => {
  const res = await fetch(data.url, {
    headers: {
      "User-Agent": UA,
      "Referer": "https://duckduckgo.com/"
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
  const contentType = res.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) throw new Error("URL did not return an image");
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > 8 * 1024 * 1024) throw new Error("Image too large");
  const extGuess = contentType.split("/")[1]?.split(";")[0]?.toLowerCase() || "jpg";
  const ext = ["jpeg", "jpg", "png", "webp", "gif"].includes(extGuess) ? extGuess === "jpeg" ? "jpg" : extGuess : "jpg";
  const path = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const {
    error: upErr
  } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
    contentType,
    cacheControl: "31536000",
    upsert: false
  });
  if (upErr) throw new Error(upErr.message);
  const {
    data: pub
  } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return {
    url: pub.publicUrl
  };
});
export {
  saveRemoteProductImage_createServerFn_handler,
  searchProductImages_createServerFn_handler
};
