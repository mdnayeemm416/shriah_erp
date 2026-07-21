import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const erpPasswordLogin = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      identifier: z.string().trim().min(1).max(255),
      password: z.string().min(1).max(128),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: matches, error } = await (supabaseAdmin as any).rpc("verify_erp_login", {
      _identifier: data.identifier,
      _password: data.password,
    });

    if (error) throw new Error("Could not verify login");

    const match = Array.isArray(matches) ? matches[0] : null;
    if (!match?.email) {
      await (supabaseAdmin as any).rpc("bump_failed_login", { _identifier: data.identifier });
      return { ok: false as const };
    }

    const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: match.email,
    });
    if (linkError) throw new Error("Could not start session");

    const properties = (link as any)?.properties ?? {};
    return {
      ok: true as const,
      email: match.email as string,
      token_hash: properties.hashed_token as string | undefined,
      otp: properties.email_otp as string | undefined,
    };
  });