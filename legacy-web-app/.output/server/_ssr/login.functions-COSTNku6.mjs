import { c as createServerRpc } from "./createServerRpc-DpbYpY9o.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { s as supabaseAdmin } from "./client.server-BKaVHv6C.mjs";

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
const erpPasswordLogin_createServerFn_handler = createServerRpc({
  id: "282ae33f2214e7d600b0a9d05c75806270daae4f0abd9f90ed522de1a789efc4",
  name: "erpPasswordLogin",
  filename: "src/lib/login.functions.ts"
}, (opts) => erpPasswordLogin.__executeServer(opts));
const erpPasswordLogin = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  identifier: stringType().trim().min(1).max(255),
  password: stringType().min(1).max(128)
}).parse(input)).handler(erpPasswordLogin_createServerFn_handler, async ({
  data
}) => {
  const {
    data: matches,
    error
  } = await supabaseAdmin.rpc("verify_erp_login", {
    _identifier: data.identifier,
    _password: data.password
  });
  if (error) throw new Error("Could not verify login");
  const match = Array.isArray(matches) ? matches[0] : null;
  if (!match?.email) {
    await supabaseAdmin.rpc("bump_failed_login", {
      _identifier: data.identifier
    });
    return {
      ok: false
    };
  }
  const {
    data: link,
    error: linkError
  } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email: match.email
  });
  if (linkError) throw new Error("Could not start session");
  const properties = link?.properties ?? {};
  return {
    ok: true,
    email: match.email,
    token_hash: properties.hashed_token,
    otp: properties.email_otp
  };
});
export {
  erpPasswordLogin_createServerFn_handler
};
