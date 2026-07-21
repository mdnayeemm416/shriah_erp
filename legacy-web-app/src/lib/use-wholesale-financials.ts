import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * SINGLE SOURCE OF TRUTH for "Wholesale Value".
 *
 * Used by:
 *   - Wholesale Dashboard (Wholesale Value summary card)
 *   - Home / Summary page (Wholesale Current Value card)
 *   - Reports / Overview page (Warehouse breakdown)
 *
 * All three views MUST read from this hook so the numbers stay identical
 * regardless of which page the user is on. Do not re-implement this
 * calculation elsewhere.
 */
export const OPENING_BALANCE = 175_000;

export type WholesaleFinancials = {
  currentStock: number;
  receivable: number;
  warehouseValue: number;   // === Wholesale Value === currentStock + receivable
  convertedToCash: number;
  openingBalance: number;
  openingDue: number;
  salesDue: number;
  paidIn: number;
};

export function useWholesaleFinancials() {
  return useQuery<WholesaleFinancials>({
    queryKey: ["wh-financials"],
    staleTime: Infinity,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [products, customers, sales, payments] = await Promise.all([
        supabase.from("shop_products").select("id,stock,purchase_price,price").eq("is_deleted", false),
        supabase.from("pos_customers").select("opening_due").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales" as any).select("due_amount").eq("is_deleted", false).neq("status", "cancelled"),
        supabase.from("pos_payments" as any).select("amount,kind"),
      ]);

      // Current Stock = Σ(remaining qty × purchase/cost rate). Never use sale price.
      const currentStock = (products.data ?? []).reduce((s: number, p: any) => {
        const qty = Math.max(0, Number(p.stock ?? 0));
        const cost = Math.max(0, Number(p.purchase_price ?? 0));
        return s + qty * cost;
      }, 0);

      const openingDue = (customers.data ?? []).reduce(
        (s: number, r: any) => s + Number(r.opening_due ?? 0),
        0,
      );
      const dueSum = (sales.data ?? []).reduce(
        (s: number, r: any) => s + Number(r.due_amount ?? 0),
        0,
      );
      const paidIn = ((payments.data ?? []) as any[])
        .filter((p) => p.kind === "payment_in")
        .reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);
      const receivable = Math.max(0, openingDue + dueSum - paidIn);

      const warehouseValue = currentStock + receivable;
      const convertedToCash = OPENING_BALANCE - warehouseValue;

      return {
        currentStock,
        receivable,
        warehouseValue,
        convertedToCash,
        openingBalance: OPENING_BALANCE,
        openingDue,
        salesDue: dueSum,
        paidIn,
      };
    },
  });
}
