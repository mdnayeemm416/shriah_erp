import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { aO as softDeleteRecord, aP as restoreRecord } from "./router-KeVl8_Ln.mjs";
import "../_libs/react.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";

import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";




import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
const SOFT_DELETABLE_TABLES = [
  "transactions",
  "shop_entries",
  "warehouse_ledger",
  "warehouse_items",
  "ai_scans",
  "categories",
  "sub_categories",
  "parties",
  "cashiers",
  "shops",
  "employees",
  "employee_entries",
  "shop_sales",
  "shop_purchases",
  "shop_orders",
  "shop_products",
  "pos_customers",
  "company_transactions"
];
async function softDelete(table, id) {
  try {
    await softDeleteRecord({ data: { table, id } });
    return { error: null };
  } catch (error) {
    return { error: { message: error?.message ?? "Delete failed" } };
  }
}
async function restore(table, id) {
  try {
    await restoreRecord({ data: { table, id } });
    return { error: null };
  } catch (error) {
    return { error: { message: error?.message ?? "Restore failed" } };
  }
}
async function hardDelete(table, id) {
  return await supabase.from(table).delete().eq("id", id);
}
async function hardDeleteMany(table, ids, chunkSize = 100, onProgress) {
  let ok = 0;
  let fail = 0;
  const total = ids.length;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).delete().in("id", chunk);
    if (error) fail += chunk.length;
    else ok += chunk.length;
    onProgress?.(Math.min(i + chunk.length, total), total);
    await new Promise((r) => setTimeout(r, 0));
  }
  return { ok, fail };
}
const TABLE_LABELS = {
  transactions: { label: "Transaction", source: "Transactions" },
  shop_entries: { label: "Shop entry", source: "Shop" },
  warehouse_ledger: { label: "Warehouse entry", source: "Warehouse" },
  warehouse_items: { label: "Stock item", source: "Warehouse" },
  ai_scans: { label: "OCR scan", source: "AI Scan" },
  categories: { label: "Category", source: "Settings" },
  sub_categories: { label: "Sub-category", source: "Settings" },
  parties: { label: "Party", source: "Settings" },
  cashiers: { label: "Cashier", source: "Settings" },
  shops: { label: "Shop", source: "Settings" },
  employees: { label: "Employee", source: "Employees" },
  employee_entries: { label: "Employee entry", source: "Employees" },
  shop_sales: { label: "POS sale", source: "Sales" },
  shop_purchases: { label: "POS purchase", source: "Purchases" },
  shop_orders: { label: "Website order", source: "Orders" },
  shop_products: { label: "Product", source: "Products" },
  pos_customers: { label: "Customer", source: "Customers" },
  company_transactions: { label: "Company transaction", source: "Company" }
};
export {
  SOFT_DELETABLE_TABLES,
  TABLE_LABELS,
  hardDelete,
  hardDeleteMany,
  restore,
  softDelete
};
