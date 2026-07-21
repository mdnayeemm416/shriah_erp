import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Single global "Refresh" button — manual on-demand refresh for:
 *   Recent Entries · Dashboard cards · Financial summaries
 *   Shop summaries · Warehouse summaries
 *
 * Background/realtime/polling refresh is disabled across the app; users tap
 * this button when they want fresh numbers. Duplicate taps within the
 * in-flight window are ignored to avoid duplicate Supabase requests.
 */
const KEYS = [
  // Shop / entries
  "shop_entries",
  "shops",
  "transactions",
  "txns",
  // Warehouse
  "wh_ledger",
  "wholesale-dashboard-summary",
  "dashboard-recent-entries-v2",
  "wh-recent-entries",
  "wh-financials",
  "wh-profit",
  "wh-receivable-breakdown",
  // Summary / cash
  "parties",
  "app_settings",
  "employee-entries",
  "cash_in_hand_snapshots",
] as const;

export function GlobalRefreshButton({ className }: { className?: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const inflight = useRef(false);

  const onClick = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    setBusy(true);
    try {
      await Promise.all(KEYS.map((k) => qc.invalidateQueries({ queryKey: [k] })));
    } finally {
      // Small delay so the spinner is perceptible even on instant refetches
      setTimeout(() => {
        inflight.current = false;
        setBusy(false);
      }, 250);
    }
  }, [qc]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="Refresh data"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95 disabled:opacity-60",
        className,
      )}
    >
      <RefreshCw className={cn("h-4 w-4", busy && "animate-spin text-primary")} />
    </button>
  );
}
