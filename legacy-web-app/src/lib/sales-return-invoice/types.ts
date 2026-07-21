// Sales Return Invoice — payload type. Independent of Sales Invoice types.
import { INVOICE_V2_COMPANY, type InvoiceV2Company } from "@/lib/invoice-v2/types";

export type SalesReturnInvoiceLine = {
  name: string;
  qty: number;
  price: number;
  amount: number;
  reason?: string | null;
};

export type SalesReturnInvoiceData = {
  returnId: string;
  returnNumber: string;
  originalInvoiceNumber: number | string | null;
  date: string;
  timestamp?: string | Date;

  customerName: string;
  customerMobile?: string | null;
  customerVatNo?: string | null;

  items: SalesReturnInvoiceLine[];

  totalReturnValue: number;
  dueAdjustment: number;
  refundAmount: number;
  refundType: "cash" | "credit" | "due_reduction";

  reason?: string | null;
  processedBy?: string | null;
  notes?: string | null;
};

export const SALES_RETURN_INVOICE_COMPANY: InvoiceV2Company = INVOICE_V2_COMPANY;
export type { InvoiceV2Company };
