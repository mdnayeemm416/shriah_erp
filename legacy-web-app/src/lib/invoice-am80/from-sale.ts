// Build InvoiceV2Data from a shop_sales row id, for one-tap WhatsApp share.
import { supabase } from "@/integrations/supabase/client";
import { fetchCustomerVatForSale, fetchCustomerBalance } from "@/lib/pos-ledger";
import { fetchReturnedQtyMap } from "@/lib/sales-returns";
import type { InvoiceV2Data } from "@/lib/invoice-v2/types";

export async function buildAm80DataFromSaleId(saleId: string): Promise<InvoiceV2Data | null> {
  const { data: r, error } = await supabase
    .from("shop_sales")
    .select("*")
    .eq("id", saleId)
    .maybeSingle();
  if (error || !r) return null;

  const vat = await fetchCustomerVatForSale({
    customer_id: (r as any).customer_id,
    customer_mobile: r.customer_mobile,
  }).catch(() => null);

  let currentDue = 0;
  const cid = (r as any).customer_id as string | null | undefined;
  if (cid) {
    try {
      const bal = await fetchCustomerBalance(cid);
      currentDue = Number((bal as any)?.current_due ?? 0);
    } catch {}
  }

  const thisSaleDue = Number(r.due_amount ?? 0);
  const previousDue = Math.max(0, currentDue - thisSaleDue);

  const retMap = await fetchReturnedQtyMap(saleId).catch(() => new Map<string, { qty: number; value: number }>());

  return {
    invoiceNumber: r.invoice_number,
    date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
    timestamp: r.created_at ?? r.txn_date,
    customerName: r.customer_name,
    customerMobile: r.customer_mobile ?? undefined,
    customerVatNo: vat ?? undefined,
    paymentMethod: r.payment_method,
    items: ((r.items as any) || []).map((it: any) => {
      const k = String(it.product_id ?? it.name);
      const rQty = retMap.get(k)?.qty ?? 0;
      return {
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0,
        returnedQty: rQty > 0 ? rQty : undefined,
      };
    }),
    subtotal: Number(r.subtotal) || 0,
    vat: Number(r.tax) || 0,
    total: Number(r.total) || 0,
    paidAmount: Number(r.paid_amount ?? 0),
    previousDue,
    newDue: currentDue,
  };
}
