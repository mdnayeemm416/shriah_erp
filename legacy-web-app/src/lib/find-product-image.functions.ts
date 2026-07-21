import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BUCKET = "shop-product-images";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function getVqd(query: string): Promise<string | null> {
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
    headers: { "User-Agent": UA },
  });
  const html = await res.text();
  const m = html.match(/vqd=["']?(\d-[0-9-]+)["']?/) || html.match(/vqd=([0-9-]+)/);
  return m ? m[1] : null;
}

type Suggestion = { thumbnail: string; image: string; title: string; source: string; width?: number; height?: number };

async function ddgSearch(query: string, limit: number): Promise<Suggestion[]> {
  const vqd = await getVqd(query);
  if (!vqd) return [];
  const url = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,,,&p=1`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Referer": "https://duckduckgo.com/",
      "Accept": "application/json",
    },
  });
  if (!res.ok) return [];
  const json: any = await res.json().catch(() => null);
  const results = (json?.results ?? []) as any[];
  return results.slice(0, limit).map((r) => ({
    thumbnail: r.thumbnail,
    image: r.image,
    title: r.title ?? "",
    source: r.source ?? r.url ?? "",
    width: r.width,
    height: r.height,
  }));
}

export const searchProductImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      name: z.string().max(200).optional(),
      barcode: z.string().max(64).optional(),
      brand: z.string().max(100).optional(),
      itemCode: z.string().max(64).optional(),
      query: z.string().max(200).optional(),
      limit: z.number().min(1).max(12).default(6),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const queries: string[] = [];
    if (data.query?.trim()) queries.push(data.query.trim());
    if (data.barcode?.trim()) queries.push(`${data.barcode.trim()} product packaging`);
    const nameParts = [data.brand, data.name].filter(Boolean).join(" ").trim();
    if (nameParts) queries.push(`${nameParts} product package white background`);
    if (data.itemCode?.trim() && !nameParts) queries.push(data.itemCode.trim());

    const tried = new Set<string>();
    const out: Suggestion[] = [];
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
        // ignore individual query failures
      }
    }
    return { suggestions: out };
  });

export const saveRemoteProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ url: z.string().url().max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const res = await fetch(data.url, { headers: { "User-Agent": UA, "Referer": "https://duckduckgo.com/" } });
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) throw new Error("URL did not return an image");
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength > 8 * 1024 * 1024) throw new Error("Image too large");

    const extGuess = contentType.split("/")[1]?.split(";")[0]?.toLowerCase() || "jpg";
    const ext = ["jpeg", "jpg", "png", "webp", "gif"].includes(extGuess) ? (extGuess === "jpeg" ? "jpg" : extGuess) : "jpg";
    const path = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);
    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return { url: pub.publicUrl };
  });
