// Invoice V2 — independent payload type.
// Intentionally NOT importing the legacy InvoicePayload shape, so this
// module has no compile-time coupling to the frozen invoice system.

export type InvoiceV2Line = {
  name: string;
  qty: number;
  /** Unit price (VAT inclusive). */
  price: number;
  /** Quantity returned so far via Sales Returns (for display only). */
  returnedQty?: number;
};

export type InvoiceV2Data = {
  invoiceNumber: number | string;
  /** Human-readable date, e.g. "12/11/2025". */
  date: string;
  /** ISO timestamp for the ZATCA QR. Falls back to now if omitted. */
  timestamp?: string | Date;

  customerName: string;
  customerMobile?: string;
  customerVatNo?: string;

  paymentMethod?: string;

  items: InvoiceV2Line[];

  /** VAT-inclusive sum of line totals. */
  subtotal: number;
  /** VAT portion already inside subtotal. */
  vat: number;
  /** Grand total payable. */
  total: number;

  paidAmount?: number;
  previousDue?: number;
  /** New total due AFTER this invoice (customer-level). */
  newDue?: number;
};

export type InvoiceV2Company = {
  name: string;
  vatNumber: string;
  crNumber?: string;
  address: string;
  phone: string;
  whatsapp?: string;
  logoDataUrl?: string;
};

export const INVOICE_V2_COMPANY: InvoiceV2Company = {
  name: "Azzouz WholeSale",
  vatNumber: "311339561300003",
  crNumber: "",
  address: "Walyal Ahd, Makkah",
  phone: "0553687388",
  whatsapp: "0553687388",
};
