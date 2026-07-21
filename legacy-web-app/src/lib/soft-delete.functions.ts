import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TableEnum = z.enum([
  "transactions",
  "shop_entries",
  "warehouse_ledger",
  "warehouse_items",
  "ai_scans",
  "categories",
  "sub_categories",
  "parties",
  "cashiers",
  "shops",
  "employees",
  "employee_entries",
  "shop_sales",
  "shop_purchases",
  "shop_orders",
  "shop_products",
  "pos_customers",
  "company_transactions",
]);

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Only admins can delete or restore records");
}

export const softDeleteRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ table: TableEnum, id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    // Use the user-scoped supabase client so the DB trigger sees auth.uid() = admin
    const { error } = await (supabase as any)
      .from(data.table)
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      })
      .eq("id", data.id)
      .eq("is_deleted", false);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const restoreRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ table: TableEnum, id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { error } = await (supabase as any)
      .from(data.table)
      .update({ is_deleted: false, deleted_at: null, deleted_by: null })
      .eq("id", data.id)
      .eq("is_deleted", true);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
