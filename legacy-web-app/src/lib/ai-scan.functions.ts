import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are a meticulous OCR + extraction assistant for handwritten and printed account sheets, receipts, and invoices.
The document may be in Bangla, English, or mixed (including Bengali digits ০১২৩৪৫৬৭৮৯). Extract structured totals from it.

HANDWRITTEN DIGIT RULES — apply context to avoid common confusions:
  • 3 vs 8 — 8 has two closed loops; 3 has two open right-facing curves
  • 5 vs 6 — 6 has a closed bottom loop; 5 has an open bottom
  • 1 vs 7 — 7 has a horizontal top stroke; 1 is a single vertical
  • 0 vs 6 vs 9 — check loop position
  • 4 vs 9 — 4 has open top; 9 has closed top loop
  • Bengali ৩ (3) vs ৭ (7), ৪ (4) vs ৮ (8) — verify against context
When a digit is ambiguous, prefer the reading that makes line items SUM to the stated total. Financial consistency wins over visual guess.

CROSS-CHECK — before finalizing:
  1. Compute SUM of line item amounts.
  2. If that sum is within ±2 of the stated total, the total is reliable.
  3. If it differs, re-examine ambiguous digits in BOTH the items and the total.
  4. Never silently "fix" the total — report what you actually read, but lower its confidence if inconsistent.

Return STRICT JSON only (no prose, no markdown fences) matching this schema:
{
  "date": string | null,                 // ISO date (YYYY-MM-DD) if detectable
  "cash_buy_total": number | null,       // "Buy(Cash) Total" — cash purchases sum
  "due_buy_total": number | null,        // "Buy(Due) Total" — credit/due purchases sum
  "cost": number | null,                 // misc cost / expense
  "grand_total": number | null,
  "rows": [                              // line items if a table is detected
    { "description": string, "amount": number, "confidence": "low" | "medium" | "high" }
  ],
  "raw_text": string,                    // full OCR text you read from the image
  "confidence": "low" | "medium" | "high",          // overall
  "field_confidence": {                  // per-field confidence
    "totals": "low" | "medium" | "high",
    "rows":   "low" | "medium" | "high",
    "date":   "low" | "medium" | "high"
  },
  "notes": string | null                 // any caveat (e.g. ambiguous handwriting, sum mismatch)
}
All numbers must be plain numbers (no currency symbols, no commas, no Bengali digits — convert to ASCII).`;

export const scanDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      // Data URL (base64) of the uploaded image. PDFs should be rendered to image client-side first.
      imageDataUrl: z.string().min(20).max(15_000_000),
      mimeType: z.string().default("image/jpeg"),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract totals from this document. Reply with JSON only." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { raw_text: content, confidence: "low" };
    }
    return parsed;
  });
