import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `Fast OCR for Saudi ATM / POS-Mada slips. Extract ONLY these 4 fields:
- amount (INTEGER SAR — floor any decimals. e.g. 575.25 → 575). Main WITHDRAWAL or PURCHASE amount.
- bank_name (e.g. Alinma, Al Rajhi, SNB, Riyad, SAB) OR merchant_name for POS
- date (YYYY-MM-DD)
- time (HH:MM 24h)

IGNORE: approval codes, RRN, card numbers, reference numbers, available balance, terminal id, batch number, decorative text.

Convert Arabic-Indic digits (٠-٩) to ASCII. Amount must be a plain integer (no commas, no decimals, no SAR). Use null when not visible. Never invent.

Reply STRICT JSON:
{"slip_type":"atm"|"pos"|"unknown","amount":number|null,"date":string|null,"time":string|null,"bank_name":string|null,"merchant_name":string|null,"confidence":"low"|"medium"|"high"}`;

export const scanSlip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      imageDataUrl: z.string().min(20).max(8_000_000),
      mimeType: z.string().default("image/jpeg"),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { fallback: true, reason: "OCR_NOT_CONFIGURED", slip_type: "unknown", confidence: "low" };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: "Extract slip info. Reply with JSON only." },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (res.status === 429 || res.status === 402 || res.status >= 500) {
        const reason = res.status === 402 ? "OCR_CREDITS_EXHAUSTED"
          : res.status === 429 ? "OCR_RATE_LIMITED"
          : "OCR_SERVICE_UNAVAILABLE";
        return { fallback: true, reason, slip_type: "unknown", confidence: "low" };
      }
      if (!res.ok) {
        return { fallback: true, reason: `OCR_ERROR_${res.status}`, slip_type: "unknown", confidence: "low" };
      }

      const json = await res.json();
      const content: string = json?.choices?.[0]?.message?.content ?? "{}";
      try {
        return JSON.parse(content);
      } catch {
        const m = content.match(/\{[\s\S]*\}/);
        return m ? JSON.parse(m[0]) : { slip_type: "unknown", confidence: "low", raw_text: content };
      }
    } catch (e: any) {
      return { fallback: true, reason: "OCR_FETCH_FAILED", slip_type: "unknown", confidence: "low" };
    }
  });

