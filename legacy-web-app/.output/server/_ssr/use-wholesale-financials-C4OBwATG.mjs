import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
const OPENING_BALANCE = 175e3;
function useWholesaleFinancials() {
  return useQuery({
    queryKey: ["wh-financials"],
    staleTime: Infinity,
    gcTime: 10 * 6e4,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [products, customers, sales, payments] = await Promise.all([
        supabase.from("shop_products").select("id,stock,purchase_price,price").eq("is_deleted", false),
        supabase.from("pos_customers").select("opening_due").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales").select("due_amount").eq("is_deleted", false).neq("status", "cancelled"),
        supabase.from("pos_payments").select("amount,kind")
      ]);
      const currentStock = (products.data ?? []).reduce((s, p) => {
        const qty = Math.max(0, Number(p.stock ?? 0));
        const cost = Math.max(0, Number(p.purchase_price ?? 0));
        return s + qty * cost;
      }, 0);
      const openingDue = (customers.data ?? []).reduce(
        (s, r) => s + Number(r.opening_due ?? 0),
        0
      );
      const dueSum = (sales.data ?? []).reduce(
        (s, r) => s + Number(r.due_amount ?? 0),
        0
      );
      const paidIn = (payments.data ?? []).filter((p) => p.kind === "payment_in").reduce((s, r) => s + Number(r.amount ?? 0), 0);
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
        paidIn
      };
    }
  });
}
export {
  useWholesaleFinancials as u
};
