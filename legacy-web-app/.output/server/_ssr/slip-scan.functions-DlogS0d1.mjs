import process from "node:process";
import { c as createServerRpc } from "./createServerRpc-DpbYpY9o.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const SYSTEM_PROMPT = `Fast OCR for Saudi ATM / POS-Mada slips. Extract ONLY these 4 fields:
- amount (INTEGER SAR — floor any decimals. e.g. 575.25 → 575). Main WITHDRAWAL or PURCHASE amount.
- bank_name (e.g. Alinma, Al Rajhi, SNB, Riyad, SAB) OR merchant_name for POS
- date (YYYY-MM-DD)
- time (HH:MM 24h)

IGNORE: approval codes, RRN, card numbers, reference numbers, available balance, terminal id, batch number, decorative text.

Convert Arabic-Indic digits (٠-٩) to ASCII. Amount must be a plain integer (no commas, no decimals, no SAR). Use null when not visible. Never invent.

Reply STRICT JSON:
{"slip_type":"atm"|"pos"|"unknown","amount":number|null,"date":string|null,"time":string|null,"bank_name":string|null,"merchant_name":string|null,"confidence":"low"|"medium"|"high"}`;
const scanSlip_createServerFn_handler = createServerRpc({
  id: "635847dbd120c7c098b3b27b6da65c9e9f3387591c623e37d97e33e1dc692cad",
  name: "scanSlip",
  filename: "src/lib/slip-scan.functions.ts"
}, (opts) => scanSlip.__executeServer(opts));
const scanSlip = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  imageDataUrl: stringType().min(20).max(8e6),
  mimeType: stringType().default("image/jpeg")
}).parse(input)).handler(scanSlip_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return {
      fallback: true,
      reason: "OCR_NOT_CONFIGURED",
      slip_type: "unknown",
      confidence: "low"
    };
  }
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{
          role: "system",
          content: SYSTEM_PROMPT
        }, {
          role: "user",
          content: [{
            type: "text",
            text: "Extract slip info. Reply with JSON only."
          }, {
            type: "image_url",
            image_url: {
              url: data.imageDataUrl
            }
          }]
        }],
        response_format: {
          type: "json_object"
        }
      })
    });
    if (res.status === 429 || res.status === 402 || res.status >= 500) {
      const reason = res.status === 402 ? "OCR_CREDITS_EXHAUSTED" : res.status === 429 ? "OCR_RATE_LIMITED" : "OCR_SERVICE_UNAVAILABLE";
      return {
        fallback: true,
        reason,
        slip_type: "unknown",
        confidence: "low"
      };
    }
    if (!res.ok) {
      return {
        fallback: true,
        reason: `OCR_ERROR_${res.status}`,
        slip_type: "unknown",
        confidence: "low"
      };
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      return m ? JSON.parse(m[0]) : {
        slip_type: "unknown",
        confidence: "low",
        raw_text: content
      };
    }
  } catch (e) {
    return {
      fallback: true,
      reason: "OCR_FETCH_FAILED",
      slip_type: "unknown",
      confidence: "low"
    };
  }
});
export {
  scanSlip_createServerFn_handler
};
