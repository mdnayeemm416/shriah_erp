import { supabase } from "@/integrations/supabase/client";
import { restoreRecord, softDeleteRecord } from "@/lib/soft-delete.functions";

export const SOFT_DELETABLE_TABLES = [
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
] as const;

export type SoftDeletableTable = (typeof SOFT_DELETABLE_TABLES)[number];

export async function softDelete(table: SoftDeletableTable, id: string) {
  try {
    await softDeleteRecord({ data: { table, id } });
    return { error: null };
  } catch (error: any) {
    return { error: { message: error?.message ?? "Delete failed" } };
  }
}

export async function softDeleteMany(table: SoftDeletableTable, ids: string[]) {
  let ok = 0;
  let fail = 0;
  for (const id of ids) {
    const { error } = await softDelete(table, id);
    if (error) fail++;
    else ok++;
  }
  return { ok, fail };
}

export async function restore(table: SoftDeletableTable, id: string) {
  try {
    await restoreRecord({ data: { table, id } });
    return { error: null };
  } catch (error: any) {
    return { error: { message: error?.message ?? "Restore failed" } };
  }
}

export async function hardDelete(table: SoftDeletableTable, id: string) {
  return await (supabase as any).from(table).delete().eq("id", id);
}

/** Batched hard delete using `.in('id', ids)` — much faster than per-row. */
export async function hardDeleteMany(
  table: SoftDeletableTable,
  ids: string[],
  chunkSize = 100,
  onProgress?: (done: number, total: number) => void,
): Promise<{ ok: number; fail: number }> {
  let ok = 0;
  let fail = 0;
  const total = ids.length;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const { error } = await (supabase as any).from(table).delete().in("id", chunk);
    if (error) fail += chunk.length;
    else ok += chunk.length;
    onProgress?.(Math.min(i + chunk.length, total), total);
    await new Promise((r) => setTimeout(r, 0));
  }
  return { ok, fail };
}

export const TABLE_LABELS: Record<SoftDeletableTable, { label: string; source: string }> = {
  transactions: { label: "Transaction", source: "Transactions" },
  shop_entries: { label: "Shop entry", source: "Shop" },
  warehouse_ledger: { label: "Warehouse entry", source: "Warehouse" },
  warehouse_items: { label: "Stock item", source: "Warehouse" },
  ai_scans: { label: "OCR scan", source: "AI Scan" },
  categories: { label: "Category", source: "Settings" },
  sub_categories: { label: "Sub-category", source: "Settings" },
  parties: { label: "Party", source: "Settings" },
  cashiers: { label: "Cashier", source: "Settings" },
  shops: { label: "Shop", source: "Settings" },
  employees: { label: "Employee", source: "Employees" },
  employee_entries: { label: "Employee entry", source: "Employees" },
  shop_sales: { label: "POS sale", source: "Sales" },
  shop_purchases: { label: "POS purchase", source: "Purchases" },
  shop_orders: { label: "Website order", source: "Orders" },
  shop_products: { label: "Product", source: "Products" },
  pos_customers: { label: "Customer", source: "Customers" },
  company_transactions: { label: "Company transaction", source: "Company" },
};
