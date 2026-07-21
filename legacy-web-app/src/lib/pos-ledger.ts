import { supabase } from "@/integrations/supabase/client";

export type PosCustomer = {
  id: string;
  name: string;
  phone: string | null;
  alias: string | null;
  opening_due: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  address?: string | null;
  credit_limit?: number | null;
  vat_number?: string | null;
  tags?: string[] | null;
  customer_type?: string | null;
};

export type PosBalance = {
  opening: number;
  total_sales: number;
  total_paid: number;
  current_due: number;
};

export type PaymentBreakdown = {
  cash?: number;
  pos?: number;
  bank?: number;
};

export async function fetchCustomerBalance(customerId: string): Promise<PosBalance> {
  const { data, error } = await supabase.rpc("pos_customer_balance", { _customer_id: customerId });
  if (error) throw error;
  const row = (Array.isArray(data) ? data[0] : data) as any;
  return {
    opening: Number(row?.opening ?? 0),
    total_sales: Number(row?.total_sales ?? 0),
    total_paid: Number(row?.total_paid ?? 0),
    current_due: Number(row?.current_due ?? 0),
  };
}

/** Resolve the latest VAT number for a sale's customer. Looks up by
 *  customer_id first, then falls back to phone match. Returns null when
 *  no customer record or no VAT is on file. */
export async function fetchCustomerVatForSale(opts: {
  customer_id?: string | null;
  customer_mobile?: string | null;
}): Promise<string | null> {
  try {
    if (opts.customer_id) {
      const { data } = await supabase
        .from("pos_customers")
        .select("vat_number")
        .eq("id", opts.customer_id)
        .maybeSingle();
      const v = (data as any)?.vat_number?.toString().trim();
      if (v) return v;
    }
    const phone = opts.customer_mobile?.toString().trim();
    if (phone) {
      const { data } = await supabase
        .from("pos_customers")
        .select("vat_number")
        .eq("phone", phone)
        .limit(1);
      const v = (data as any)?.[0]?.vat_number?.toString().trim();
      if (v) return v;
    }
  } catch { /* ignore */ }
  return null;
}

export function norm(s: string) {
  return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function fuzzyScore(hay: string, q: string) {
  const h = norm(hay);
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;
  let score = 0;
  for (const t of tokens) {
    if (!h.includes(t)) return -1;
    if (h.startsWith(t)) score += 3; else score += 1;
  }
  return score;
}
