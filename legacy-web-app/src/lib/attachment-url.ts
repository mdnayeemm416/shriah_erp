import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "attachments";
const cache = new Map<string, { url: string; exp: number }>();
const TTL = 60 * 55; // seconds (signed url valid ~1h)

/** Extract storage path from a stored attachment_url (public URL or raw path). */
export function extractAttachmentPath(input: string | null | undefined): string | null {
  if (!input) return null;
  const marker = `/object/public/${BUCKET}/`;
  const i = input.indexOf(marker);
  if (i >= 0) return decodeURIComponent(input.slice(i + marker.length));
  const marker2 = `/object/sign/${BUCKET}/`;
  const j = input.indexOf(marker2);
  if (j >= 0) {
    const rest = input.slice(j + marker2.length);
    return decodeURIComponent(rest.split("?")[0]);
  }
  // Treat as bare path
  return input.startsWith("http") ? null : input;
}

export async function getSignedAttachmentUrl(input: string | null | undefined): Promise<string | null> {
  const path = extractAttachmentPath(input);
  if (!path) return null;
  const now = Date.now() / 1000;
  const hit = cache.get(path);
  if (hit && hit.exp > now + 30) return hit.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  cache.set(path, { url: data.signedUrl, exp: now + TTL });
  return data.signedUrl;
}

export function useSignedAttachmentUrl(input: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!input) { setUrl(null); return; }
    getSignedAttachmentUrl(input).then((u) => { if (active) setUrl(u); });
    return () => { active = false; };
  }, [input]);
  return url;
}
