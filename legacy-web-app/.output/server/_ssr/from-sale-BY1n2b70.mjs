import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { a$ as fetchCustomerVatForSale, a8 as fetchCustomerBalance } from "./router-KeVl8_Ln.mjs";
import { f as fetchReturnedQtyMap } from "./sales-returns-BiNutRv_.mjs";
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
async function buildAm80DataFromSaleId(saleId) {
  const { data: r, error } = await supabase.from("shop_sales").select("*").eq("id", saleId).maybeSingle();
  if (error || !r) return null;
  const vat = await fetchCustomerVatForSale({
    customer_id: r.customer_id,
    customer_mobile: r.customer_mobile
  }).catch(() => null);
  let currentDue = 0;
  const cid = r.customer_id;
  if (cid) {
    try {
      const bal = await fetchCustomerBalance(cid);
      currentDue = Number(bal?.current_due ?? 0);
    } catch {
    }
  }
  const thisSaleDue = Number(r.due_amount ?? 0);
  const previousDue = Math.max(0, currentDue - thisSaleDue);
  const retMap = await fetchReturnedQtyMap(saleId).catch(() => /* @__PURE__ */ new Map());
  return {
    invoiceNumber: r.invoice_number,
    date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
    timestamp: r.created_at ?? r.txn_date,
    customerName: r.customer_name,
    customerMobile: r.customer_mobile ?? void 0,
    customerVatNo: vat ?? void 0,
    paymentMethod: r.payment_method,
    items: (r.items || []).map((it) => {
      const k = String(it.product_id ?? it.name);
      const rQty = retMap.get(k)?.qty ?? 0;
      return {
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0,
        returnedQty: rQty > 0 ? rQty : void 0
      };
    }),
    subtotal: Number(r.subtotal) || 0,
    vat: Number(r.tax) || 0,
    total: Number(r.total) || 0,
    paidAmount: Number(r.paid_amount ?? 0),
    previousDue,
    newDue: currentDue
  };
}
export {
  buildAm80DataFromSaleId
};
