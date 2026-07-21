import { supabase } from "@/integrations/supabase/client";
import type { PosCustomer } from "@/lib/pos-ledger";

export const POS_CUSTOMER_QUERY_KEY = ["pos-customers"] as const;
export const POS_CUSTOMER_COLS = "id,name,phone,alias,opening_due,is_active,is_deleted,notes,created_at";

export async function fetchWholesaleCustomers(): Promise<PosCustomer[]> {
  const { data, error } = await supabase
    .from("pos_customers")
    .select(POS_CUSTOMER_COLS)
    .eq("is_active", true)
    .eq("is_deleted", false)
    .order("name");
  if (error) throw error;
  return (data ?? []) as PosCustomer[];
}