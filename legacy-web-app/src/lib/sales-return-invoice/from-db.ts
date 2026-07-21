// Fetch a Sales Return by id and shape it into SalesReturnInvoiceData.
import { supabase } from "@/integrations/supabase/client";
import type { SalesReturnInvoiceData, SalesReturnInvoiceLine } from "./types";

export async function fetchSalesReturnInvoice(returnId: string): Promise<SalesReturnInvoiceData> {
  const { data: hdr, error: hErr } = await supabase
    .from("sales_returns" as any)
    .select("*")
    .eq("id", returnId)
    .maybeSingle();
  if (hErr) throw hErr;
  if (!hdr) throw new Error("Return not found");

  const { data: items, error: iErr } = await supabase
    .from("sales_return_items" as any)
    .select("id,name,qty,price,line_value,reason")
    .eq("return_id", returnId)
    .order("created_at", { ascending: true });
  if (iErr) throw iErr;

  const h = hdr as any;
  const lines: SalesReturnInvoiceLine[] = ((items ?? []) as any[]).map((it) => ({
    name: it.name,
    qty: Number(it.qty) || 0,
    price: Number(it.price) || 0,
    amount: Number(it.line_value ?? Number(it.qty) * Number(it.price)) || 0,
    reason: it.reason ?? null,
  }));

  // Pull customer vat no if available (best-effort; ignore errors).
  let vat: string | null = null;
  if (h.customer_id) {
    const { data: cust } = await supabase
      .from("pos_customers")
      .select("vat_number")
      .eq("id", h.customer_id)
      .maybeSingle();
    vat = (cust as any)?.vat_number ?? null;
  }

  return {
    returnId: h.id,
    returnNumber: h.return_number ?? "SR-—",
    originalInvoiceNumber: h.invoice_number ?? null,
    date: new Date(h.created_at).toLocaleDateString(),
    timestamp: h.created_at,
    customerName: h.customer_name ?? "Walk-in Customer",
    customerMobile: h.customer_mobile ?? null,
    customerVatNo: vat,
    items: lines,
    totalReturnValue: Number(h.return_value) || 0,
    dueAdjustment: Math.max(0, (Number(h.return_value) || 0) - (Number(h.refund_amount) || 0)),
    refundAmount: Number(h.refund_amount) || 0,
    refundType: (h.refund_type as any) ?? "due_reduction",
    reason: h.reason ?? null,
    processedBy: h.processed_by_name ?? null,
    notes: h.notes ?? null,
  };
}
