import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns a map: customer_id -> current due (opening + sales due - payments in).
 * Computed client-side to avoid an RPC per row.
 */
export function usePosDueMap(enabled = true) {
  return useQuery({
    queryKey: ["pos-customer-due-map"],
    enabled,
    staleTime: 30_000,
    queryFn: async (): Promise<Map<string, number>> => {
      const [custRes, salesRes, payRes] = await Promise.all([
        supabase.from("pos_customers").select("id,opening_due").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales").select("customer_id,due_amount,status").not("customer_id", "is", null).eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind"),
      ]);
      if (custRes.error) throw custRes.error;
      if (salesRes.error) throw salesRes.error;
      if (payRes.error) throw payRes.error;

      const map = new Map<string, number>();
      for (const c of custRes.data ?? []) map.set(c.id, Number(c.opening_due ?? 0));
      for (const s of salesRes.data ?? []) {
        if (!s.customer_id) continue;
        if (s.status === "cancelled") continue;
        map.set(s.customer_id, (map.get(s.customer_id) ?? 0) + Number(s.due_amount ?? 0));
      }
      for (const p of payRes.data ?? []) {
        if (!p.customer_id) continue;
        if (p.kind !== "payment_in") continue;
        map.set(p.customer_id, (map.get(p.customer_id) ?? 0) - Number(p.amount ?? 0));
      }
      return map;
    },
  });
}
