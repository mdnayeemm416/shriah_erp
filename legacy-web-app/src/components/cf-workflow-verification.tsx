import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { useUserAccess } from "@/hooks/use-user-access";
import { useProfileMap, displayProfile } from "@/hooks/use-profile-map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type WorkflowLock = {
  id: string;
  shop_id: string | null;
  day_date: string;
  is_locked: boolean;
  locked_by: string | null;
  locked_at: string;
  notes: string | null;
};

/** Hook: is the day-level Finance Workflow finalized for `workingDate`? */
export function useWorkflowVerified(workingDate: string) {
  const { data } = useQuery({
    queryKey: ["cf-workflow-lock", workingDate],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("cash_flow_day_locks")
        .select("*")
        .is("shop_id", null)
        .eq("day_date", workingDate)
        .maybeSingle();
      return (data ?? null) as WorkflowLock | null;
    },
  });
  return { lock: data ?? null, verified: !!data?.is_locked };
}

export function CfWorkflowVerification() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const { isAdmin } = useUserAccess();
  const qc = useQueryClient();
  const profiles = useProfileMap();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const { lock, verified } = useWorkflowVerified(workingDate);

  // Pending purchases across all shops for the day
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["cf-workflow-pending", workingDate],
    queryFn: async () => {
      const { count } = await (supabase as any)
        .from("cash_flow_purchases")
        .select("id", { count: "exact", head: true })
        .eq("day_date", workingDate)
        .eq("verify_status", "pending")
        .eq("is_deleted", false);
      return count ?? 0;
    },
  });

  // Closing proofs uploaded today
  const { data: proofCount = 0 } = useQuery({
    queryKey: ["cf-workflow-proofs", workingDate],
    queryFn: async () => {
      const { count } = await (supabase as any)
        .from("cf_closing_proofs")
        .select("id", { count: "exact", head: true })
        .eq("day_date", workingDate);
      return count ?? 0;
    },
  });

  const verifier = useMemo(
    () => (lock?.locked_by ? profiles[lock.locked_by] ?? null : null),
    [lock, profiles],
  );

  const canFinalize = isAdmin && pendingCount === 0 && proofCount > 0 && !verified;
  const disabledReason =
    verified ? "Workflow already finalized." :
    !isAdmin ? "Only admins can finalize the workflow." :
    pendingCount > 0 ? `${pendingCount} pending transaction${pendingCount === 1 ? "" : "s"} must be verified or rejected.` :
    proofCount === 0 ? "Upload a Closing Proof image first." :
    "";

  const finalize = async () => {
    if (!user) return;
    setBusy(true);
    try {
      let error;
      if (lock) {
        const { error: e } = await (supabase as any)
          .from("cash_flow_day_locks")
          .update({
            is_locked: true,
            locked_by: user.id,
            locked_at: new Date().toISOString(),
            unlocked_by: null,
            unlocked_at: null,
          })
          .eq("id", lock.id);
        error = e;
      } else {
        const { error: e } = await (supabase as any)
          .from("cash_flow_day_locks")
          .insert({
            shop_id: null,
            day_date: workingDate,
            is_locked: true,
            locked_by: user.id,
            locked_at: new Date().toISOString(),
          });
        error = e;
      }
      if (error) throw error;

      try {
        await (supabase as any).from("cf_activity_log").insert({
          action: "workflow.verify",
          target_table: "cash_flow_day_locks",
          meta: { day_date: workingDate, pending: 0, proofs: proofCount },
        });
      } catch {}

      await Promise.all([
        qc.invalidateQueries({ queryKey: ["cf-workflow-lock", workingDate] }),
        qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
        qc.invalidateQueries({ queryKey: ["cf_lock"] }),
      ]);
      toast.success("✓ Finance Workflow finalized and locked.");
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to finalize workflow");
    } finally {
      setBusy(false);
    }
  };

  if (verified) {
    return (
      <Card className="overflow-hidden border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold leading-none">Finance Workflow Verified</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              This Finance Workflow has been finalized and is locked.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                Verified by{" "}
                <b className="text-foreground">{displayProfile(verifier)}</b>
              </span>
              {lock?.locked_at && (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="text-muted-foreground">
                    {new Date(lock.locked_at).toLocaleDateString()}{" "}
                    {new Date(lock.locked_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </>
              )}
            </div>
          </div>
          <Lock className="h-4 w-4 shrink-0 text-emerald-600" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start gap-3 border-b border-border/40 bg-gradient-to-br from-primary/5 to-transparent px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-none">Finalize Workflow</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Lock the day's Finance Workflow once every transaction is verified and a Closing Proof is on file.
            </p>
          </div>
        </div>

        <div className="space-y-3 px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <ChecklistRow
              ok={pendingCount === 0}
              label={pendingCount === 0 ? "All transactions verified" : `${pendingCount} pending`}
            />
            <ChecklistRow
              ok={proofCount > 0}
              label={proofCount > 0 ? "Closing Proof uploaded" : "Closing Proof required"}
            />
          </div>

          <Button
            className={cn(
              "h-12 w-full rounded-xl text-sm font-semibold shadow-[0_6px_20px_-6px_rgba(16,185,129,0.55)]",
              "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110",
            )}
            disabled={!canFinalize || busy}
            onClick={() => setConfirmOpen(true)}
          >
            <ShieldCheck className="h-4 w-4" /> Verify Workflow
          </Button>

          {!canFinalize && disabledReason && (
            <p className="flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5 text-[11px] text-amber-700 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              {disabledReason}
            </p>
          )}
        </div>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={(o) => { if (!o && !busy) setConfirmOpen(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalize today's Finance Workflow?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>After verification:</p>
                <ul className="ml-4 list-disc space-y-1 text-[13px]">
                  <li>No more editing.</li>
                  <li>No more deleting.</li>
                  <li>Workflow will be locked.</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              className="bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110"
              onClick={(e) => { e.preventDefault(); finalize(); }}
            >
              Verify Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ChecklistRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-lg border px-2 py-1.5",
      ok
        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
        : "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300",
    )}>
      <span className={cn(
        "grid h-4 w-4 place-items-center rounded-full",
        ok ? "bg-emerald-500/25" : "bg-amber-500/25",
      )}>
        {ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-2.5 w-2.5" />}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
