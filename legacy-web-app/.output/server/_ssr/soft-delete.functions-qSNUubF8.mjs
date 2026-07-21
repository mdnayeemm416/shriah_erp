import { c as createServerRpc } from "./createServerRpc-DpbYpY9o.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType } from "../_libs/zod.mjs";

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
const TableEnum = enumType(["transactions", "shop_entries", "warehouse_ledger", "warehouse_items", "ai_scans", "categories", "sub_categories", "parties", "cashiers", "shops", "employees", "employee_entries", "shop_sales", "shop_purchases", "shop_orders", "shop_products", "pos_customers", "company_transactions"]);
async function assertAdmin(supabase, userId) {
  const {
    data,
    error
  } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Only admins can delete or restore records");
}
const softDeleteRecord_createServerFn_handler = createServerRpc({
  id: "aacf05a2cebdac8139b2c754498bdb45d285ad701b945d231d6b86e421b9d6d2",
  name: "softDeleteRecord",
  filename: "src/lib/soft-delete.functions.ts"
}, (opts) => softDeleteRecord.__executeServer(opts));
const softDeleteRecord = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  table: TableEnum,
  id: stringType().uuid()
}).parse(input)).handler(softDeleteRecord_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabase.from(data.table).update({
    is_deleted: true,
    deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
    deleted_by: userId
  }).eq("id", data.id).eq("is_deleted", false);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const restoreRecord_createServerFn_handler = createServerRpc({
  id: "f6008fb268cb9e2c65b3f529deb104377b2748eb3b3858ba195d74268a921e4f",
  name: "restoreRecord",
  filename: "src/lib/soft-delete.functions.ts"
}, (opts) => restoreRecord.__executeServer(opts));
const restoreRecord = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  table: TableEnum,
  id: stringType().uuid()
}).parse(input)).handler(restoreRecord_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await assertAdmin(supabase, userId);
  const {
    error
  } = await supabase.from(data.table).update({
    is_deleted: false,
    deleted_at: null,
    deleted_by: null
  }).eq("id", data.id).eq("is_deleted", true);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  restoreRecord_createServerFn_handler,
  softDeleteRecord_createServerFn_handler
};
