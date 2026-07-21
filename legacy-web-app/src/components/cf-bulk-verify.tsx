import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { useUserAccess } from "@/hooks/use-user-access";
import { useWorkflowVerified } from "@/components/cf-workflow-verification";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type PendingRow = {
  id: string;
  supplier_name: string | null;
  shop_id: string | null;
  cash_amount: number;
  due_amount: number;
  credit_amount: number;
  created_at: string;
  verify_status: string;
};

const SAR = (n: number) =>
  `SAR ${(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const rowTotal = (r: PendingRow) =>
  (r.cash_amount ?? 0) + (r.due_amount ?? 0) + (r.credit_amount ?? 0);

export function CfBulkVerify() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const { isAdmin, canVerify: canVerifyRaw } = useUserAccess() as any;
  const canVerify = canVerifyRaw ?? isAdmin;
  const { verified } = useWorkflowVerified(workingDate);
  const qc = useQueryClient();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<null | "verifySel" | "rejectSel" | "verifyAll">(null);
  const [processing, setProcessing] = useState(false);

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ["cf-bulk-pending", workingDate],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cash_flow_purchases")
        .select("id, supplier_name, shop_id, cash_amount, due_amount, credit_amount, created_at, verify_status")
        .eq("day_date", workingDate)
        .eq("verify_status", "pending")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PendingRow[];
    },
  });

  const pendingIds = useMemo(() => pending.map(p => p.id), [pending]);
  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);
  const pendingTotal = useMemo(() => pending.reduce((s, p) => s + rowTotal(p), 0), [pending]);
  const selectedList = useMemo(() => pending.filter(p => selected.has(p.id)), [pending, selected]);
  const selectedTotal = useMemo(() => selectedList.reduce((s, p) => s + rowTotal(p), 0), [selectedList]);

  useEffect(() => {
    setSelected(prev => {
      const next = new Set<string>();
      prev.forEach(id => { if (pendingSet.has(id)) next.add(id); });
      return next.size === prev.size ? prev : next;
    });
  }, [pendingSet]);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => setSelected(new Set(pendingIds));
  const clearAll = () => setSelected(new Set());

  const runBatch = async (mode: "verify" | "reject", ids: string[], reason?: string) => {
    if (!user || ids.length === 0) return;
    setProcessing(true);
    const patch: any = mode === "verify"
      ? { verify_status: "verified", verified_by: user.id, verified_at: new Date().toISOString(), reject_reason: null }
      : { verify_status: "rejected", verified_by: user.id, verified_at: new Date().toISOString(), reject_reason: reason ?? null };

    const failed: string[] = [];
    let ok = 0;
    for (const id of ids) {
      try {
        const { error } = await (supabase as any).from("cash_flow_purchases").update(patch).eq("id", id);
        if (error) throw error;
        ok += 1;
        try {
          await (supabase as any).from("cf_activity_log").insert({
            action: `purchase.${mode}`,
            target_table: "cash_flow_purchases",
            target_id: id,
            meta: mode === "reject" ? { reason, via: "bulk" } : { via: "bulk" },
          });
        } catch {}
      } catch {
        failed.push(id);
      }
    }
    setProcessing(false);

    // Single refresh across dependent surfaces
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["cf-bulk-pending", workingDate] }),
      qc.invalidateQueries({ queryKey: ["cf-workflow-pending", workingDate] }),
      qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
      qc.invalidateQueries({ queryKey: ["cfpa"] }),
      qc.invalidateQueries({ queryKey: ["cf_cashin"] }),
      qc.invalidateQueries({ queryKey: ["dashboard"] }),
      qc.invalidateQueries({ queryKey: ["reports"] }),
      qc.invalidateQueries({ queryKey: ["cash_balance"] }),
      qc.invalidateQueries({ queryKey: ["bank_balance"] }),
    ]);

    if (failed.length === 0) {
      toast.success(mode === "verify"
        ? `✓ ${ok} transaction${ok === 1 ? "" : "s"} verified successfully.`
        : `✓ ${ok} transaction${ok === 1 ? "" : "s"} rejected.`);
      setSelected(new Set());
    } else {
      toast.error(`${ok} succeeded · ${failed.length} failed.`);
      setSelected(new Set(failed));
    }
  };

  // Hide when locked/verified/no permission — Finalize Workflow card still shows
  if (verified || !canVerify) return null;
  if (!isLoading && pending.length === 0) return null;

  const selCount = selected.size;

  return (
    <>
      <Card className="sticky top-2 z-30 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-[0_6px_20px_-8px_rgba(0,0,0,0.25)]">
        <div className="flex items-start gap-3 border-b border-border/40 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-none">Bulk Verification</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Verify or reject pending purchases in one action. Finalize Workflow unlocks once Pending is 0.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pt-3 text-[11px]">
          <Stat label="Pending" value={String(pending.length)} tone="amber" />
          <Stat label="Selected" value={String(selCount)} tone="primary" />
          <Stat label="Total" value={SAR(selCount > 0 ? selectedTotal : pendingTotal)} tone="muted" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 px-4 pt-2.5">
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]"
            onClick={selectAll} disabled={pending.length === 0 || selCount === pending.length}>
            Select All
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]"
            onClick={clearAll} disabled={selCount === 0}>
            Clear All
          </Button>
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" variant="outline" className="h-8 rounded-full px-3 text-[11px]"
              disabled={processing || selCount === 0}
              onClick={() => setConfirm("rejectSel")}>
              <XCircle className="h-3.5 w-3.5" /> Reject Selected
            </Button>
            <Button size="sm" className="h-8 rounded-full px-3 text-[11px]"
              disabled={processing || selCount === 0}
              onClick={() => setConfirm("verifySel")}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Verify Selected
            </Button>
          </div>
        </div>

        {/* Compact selectable pending list */}
        <div className="max-h-64 overflow-y-auto px-2 py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-[11px] text-muted-foreground">
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Loading pending…
            </div>
          ) : (
            <ul className="space-y-1">
              {pending.map(p => {
                const checked = selected.has(p.id);
                return (
                  <li key={p.id}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border border-border/40 bg-background/60 px-2 py-1.5 text-[11px]",
                        checked && "border-primary/50 bg-primary/5",
                      )}>
                    <Checkbox checked={checked} onCheckedChange={() => toggle(p.id)} />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="font-medium">{p.supplier_name || "—"}</span>
                    </div>
                    <span className="tabular-nums font-semibold">{SAR(rowTotal(p))}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border/40 px-4 py-3">
          <Button
            className={cn(
              "h-11 w-full rounded-xl text-sm font-semibold shadow-[0_6px_20px_-6px_rgba(16,185,129,0.55)]",
              "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110",
            )}
            disabled={processing || pending.length === 0}
            onClick={() => setConfirm("verifyAll")}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Verify All ({pending.length})
          </Button>
        </div>
      </Card>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => { if (!o && !processing) setConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "verifyAll"
                ? "Verify all pending transactions?"
                : confirm === "verifySel"
                ? `Verify ${selCount} transaction${selCount === 1 ? "" : "s"}?`
                : `Reject ${selCount} transaction${selCount === 1 ? "" : "s"}?`}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>
                  {confirm === "verifyAll" ? "Pending Entries: " : "Selected Entries: "}
                  <b className="text-foreground">
                    {confirm === "verifyAll" ? pending.length : selCount}
                  </b>
                </div>
                <div>
                  Total Amount:{" "}
                  <b className="text-foreground">
                    {SAR(confirm === "verifyAll" ? pendingTotal : selectedTotal)}
                  </b>
                </div>
                {confirm === "rejectSel" && (
                  <div className="text-[11px]">A single reject reason will be applied to all selected entries.</div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={processing}
              className={confirm === "rejectSel"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110"}
              onClick={async (e) => {
                e.preventDefault();
                const mode = confirm;
                if (!mode) return;
                let reason: string | undefined;
                if (mode === "rejectSel") {
                  const r = window.prompt("Reject reason (applied to all selected)?", "");
                  if (r === null) return;
                  reason = r;
                }
                setConfirm(null);
                const ids = mode === "verifyAll" ? pendingIds : Array.from(selected);
                const runMode: "verify" | "reject" = mode === "rejectSel" ? "reject" : "verify";
                await runBatch(runMode, ids, reason);
              }}
            >
              {confirm === "verifyAll" ? "Verify All" : confirm === "verifySel" ? "Verify" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "amber" | "primary" | "muted" }) {
  return (
    <div className={cn(
      "rounded-lg border px-2 py-1.5",
      tone === "amber" && "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300",
      tone === "primary" && "border-primary/40 bg-primary/5 text-primary",
      tone === "muted" && "border-border/50 bg-muted/30 text-foreground",
    )}>
      <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
