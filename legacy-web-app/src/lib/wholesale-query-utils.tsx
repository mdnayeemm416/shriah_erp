import type { QueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

// Generic cache-refresh keys shared across the Wholesale module.
export const WHOLESALE_REFRESH_KEYS = [
  ["wholesale-dashboard-summary"],
  ["dashboard-recent-entries-v2"],
  ["wh-financials"],
  ["wh-profit"],
  ["wh-recent-entries"],
  ["txn-products"],
  ["wh_ledger"],
  ["trash"],
  ["store-admin-overview"],
  ["admin-sales"],
  ["admin-purchases"],
  ["admin-orders"],
  ["admin-products"],
  ["store-products"],
  ["pos-payments"],
  ["pos-customers"],
  ["pos-customers-admin"],
  ["pos-customer-due-map"],
  ["pos-balance"],
  ["pos-customer-statement"],
] as const;

export function keepPreviousList<T>() {
  return keepPreviousData as (previousData: T[] | undefined) => T[] | undefined;
}

export const keepPreviousValue = <T,>(previousData: T | undefined) => previousData;

export function traceWholesaleFlow(event: string, detail?: unknown) {
  if (typeof window === "undefined") return;
  console.debug(`[wholesale-stability] ${event}`, detail ?? "");
}

export function withQueryTimeout<T>(promise: PromiseLike<T>, label = "Request", timeoutMs = 8_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export function notifyRefreshFailed(error: unknown) {
  if (error) toast.error("Refresh failed. Pull to retry.");
}

export async function refreshWholesaleData(queryClient: QueryClient, refetch = true) {
  traceWholesaleFlow("cache invalidation start", { refetch, keys: WHOLESALE_REFRESH_KEYS.length });
  await Promise.allSettled(
    WHOLESALE_REFRESH_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [...queryKey], refetchType: "none" }),
    ),
  );
  if (!refetch) return;
  const results = await Promise.allSettled(
    WHOLESALE_REFRESH_KEYS.map((queryKey) =>
      queryClient.refetchQueries({ queryKey: [...queryKey], type: "active" }),
    ),
  );
  const failed = results.filter((r) => r.status === "rejected").length;
  traceWholesaleFlow("cache invalidation end", { failed });
  if (failed) toast.error("Refresh failed. Pull to retry.");
}

export function refreshWholesaleDataInBackground(queryClient: QueryClient) {
  void refreshWholesaleData(queryClient).catch((error) => {
    traceWholesaleFlow("cache refresh failed", error);
    toast.error("Refresh failed. Pull to retry.");
  });
}

export function EntryListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 py-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 p-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-primary/10" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-primary/10" />
            <div className="h-3 w-full max-w-48 animate-pulse rounded bg-primary/10" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-primary/10" />
        </div>
      ))}
    </div>
  );
}
