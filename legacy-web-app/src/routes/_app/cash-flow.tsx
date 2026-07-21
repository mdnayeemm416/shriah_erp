import { useHighlightRecord } from "@/hooks/use-highlight-record";
import { createFileRoute, redirect, useSearch } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wallet, ShoppingBag, CheckCircle2, XCircle, Clock, Lock, Unlock, Plus, Trash2,
  ShieldCheck, AlertTriangle, User as UserIcon, Sparkles,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkingDate } from "@/hooks/use-working-date";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAR } from "@/lib/format";
import { sortShops } from "@/lib/shop-order";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CfAttachmentManager } from "@/components/cf-attachment-manager";
import { CfPurchaseSmartForm, type SmartPurchaseInput } from "@/components/cf-purchase-smart-form";
import { useProfileMap, displayProfile, type ProfileLite } from "@/hooks/use-profile-map";
import { useWorkflowVerified } from "@/components/cf-workflow-verification";


async function logActivity(action: string, target_id: string, meta: any = {}) {
  try { await (supabase as any).from("cf_activity_log").insert({ action, target_table: "cash_flow_purchases", target_id, meta }); } catch {}
}

const CONF_BADGE: Record<string, string> = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export const Route = createFileRoute("/_app/cash-flow")({
  beforeLoad: () => { throw redirect({ to: "/finance-workflow" }); },
  component: CashFlowPage,
});

type Shop = { id: string; name: string };
type Role = "admin" | "manager" | "accountant" | "staff" | string;
type CashIn = { id: string; shop_id: string | null; day_date: string; amount: number; source: string | null; notes: string | null; created_by: string };
type Purchase = {
  id: string; shop_id: string | null; day_date: string; company: string;
  cash_amount: number; due_amount: number; credit_amount: number;
  notes: string | null; attachment_url: string | null;
  verify_status: "pending" | "verified" | "rejected";
  verified_by: string | null; verified_at: string | null; reject_reason: string | null;
  created_by: string;
  ocr_confidence: "low" | "medium" | "high" | null;
  ocr_meta: any | null;
};
type DayLock = { id: string; shop_id: string | null; day_date: string; is_locked: boolean; locked_by: string | null; locked_at: string; unlocked_by: string | null; unlocked_at: string | null };

const WAREHOUSE = "__wh__";

export function CashFlowPage() {
  useHighlightRecord();
  const search = useSearch({ strict: false }) as { highlight?: string; date?: string; shop?: string };
  const { user } = useAuth();
  const { workingDate, setWorkingDate, today, isToday } = useWorkingDate();
  const qc = useQueryClient();

  // Roles
  const access = useUserAccess();
  const { isAdmin, isPurchaser, isVerifier, canVerify, canAddPurchase, canAddCashIn } = access;
  const roleLabel = isAdmin ? "Admin" : access.isManager ? "Manager" : access.isAccountant ? "Accountant" : isVerifier ? "Verifier" : isPurchaser ? "Purchaser" : "Staff";

  // Attachments are always optional — verification no longer blocked by it.

  // Shops
  const { data: shopsRaw = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return (data ?? []) as Shop[];
    },
  });
  const shops = useMemo(() => sortShops(shopsRaw), [shopsRaw]);
  const [activeShop, setActiveShop] = useState<string>("");
  const currentShopId = activeShop && activeShop !== WAREHOUSE ? activeShop : null;
  if (!activeShop && shops.length) setTimeout(() => setActiveShop(shops[0].id), 0);

  useEffect(() => {
    if (!search.highlight) return;
    if (search.date && search.date !== workingDate) setWorkingDate(search.date);
    if (search.shop) setActiveShop(search.shop);
  }, [search.highlight, search.date, search.shop, setWorkingDate, workingDate]);

  // Data for the active shop + date
  const dayKey = ["cf", currentShopId ?? "wh", workingDate] as const;

  const { data: cashIns = [] } = useQuery({
    queryKey: ["cf_cashin", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = (supabase as any).from("cash_flow_cash_in")
        .select("*").eq("day_date", workingDate).eq("is_deleted", false);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.order("created_at", { ascending: true });
      return (data ?? []) as CashIn[];
    },
    enabled: !!activeShop,
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ["cf_purchases", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = (supabase as any).from("cash_flow_purchases")
        .select("*").eq("day_date", workingDate).eq("is_deleted", false);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.order("created_at", { ascending: true });
      return (data ?? []) as Purchase[];
    },
    enabled: !!activeShop,
  });

  const { data: lock } = useQuery({
    queryKey: ["cf_lock", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = (supabase as any).from("cash_flow_day_locks")
        .select("*").eq("day_date", workingDate);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.maybeSingle();
      return (data as DayLock | null) ?? null;
    },
    enabled: !!activeShop,
  });
  const { verified: workflowVerified, lock: workflowLock } = useWorkflowVerified(workingDate);
  const locked = !!lock?.is_locked || workflowVerified;

  // Totals
  const totals = useMemo(() => {
    const cashIn = cashIns.reduce((s, r) => s + Number(r.amount || 0), 0);
    let cashSpent = 0, due = 0, credit = 0, verified = 0, pending = 0, rejected = 0;
    for (const p of purchases) {
      cashSpent += Number(p.cash_amount || 0);
      due += Number(p.due_amount || 0);
      credit += Number(p.credit_amount || 0);
      const row = Number(p.cash_amount || 0) + Number(p.due_amount || 0) + Number(p.credit_amount || 0);
      if (p.verify_status === "verified") verified += row;
      else if (p.verify_status === "rejected") rejected += row;
      else pending += row;
    }
    return { cashIn, cashSpent, due, credit, total: cashSpent + due + credit, remaining: cashIn - cashSpent, verified, pending, rejected };
  }, [cashIns, purchases]);

  // Warnings
  const warnings = useMemo(() => {
    const w: string[] = [];
    if (totals.remaining < 0) w.push(`Purchases exceed cash in by ${SAR(Math.abs(totals.remaining))}`);
    const names = new Map<string, number>();
    for (const p of purchases) {
      const k = (p.company || "").trim().toLowerCase();
      if (!k) continue;
      names.set(k, (names.get(k) || 0) + 1);
    }
    for (const [k, c] of names) if (c > 1) w.push(`Duplicate supplier: "${k}" (${c} rows)`);
    const big = purchases.find(p => (p.cash_amount + p.due_amount + p.credit_amount) > 50000);
    if (big) w.push(`Unusually large entry for "${big.company}" — please double-check`);
    const stillPending = purchases.filter(p => p.verify_status === "pending").length;
    if (stillPending > 0 && !locked) w.push(`${stillPending} row(s) still unverified — verify before closing the day`);
    return w;
  }, [purchases, totals.remaining, locked]);

  // --- Mutations ---
  const addCashIn = useMutation({
    mutationFn: async (input: { amount: number; source: string; notes: string }) => {
      const { error } = await (supabase as any).from("cash_flow_cash_in").insert({
        shop_id: currentShopId, day_date: workingDate,
        amount: input.amount, source: input.source || null, notes: input.notes || null,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cf_cashin"] }); toast.success("Cash In added"); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const delCashIn = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("cash_flow_cash_in").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cf_cashin"] }); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const addPurchase = useMutation({
    mutationFn: async (input: SmartPurchaseInput) => {
      const { data: row, error } = await (supabase as any).from("cash_flow_purchases").insert({
        shop_id: currentShopId, day_date: workingDate,
        company: input.company.trim(),
        cash_amount: input.cash, due_amount: input.due, credit_amount: input.credit,
        notes: input.notes || null, created_by: user!.id,
        ocr_confidence: input.ocr_confidence,
        ocr_meta: input.ocr_meta,
      }).select("id").single();
      if (error) throw error;
      // Attach receipt to the new purchase
      if (input.receiptFile && row?.id) {
        const ext = (input.receiptFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `cash-flow/${row.id}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, input.receiptFile, {
          contentType: input.receiptFile.type, upsert: false,
        });
        if (!up.error) {
          await (supabase as any).from("cf_purchase_attachments").insert({
            purchase_id: row.id, storage_path: path, mime: input.receiptFile.type, uploaded_by: user!.id,
          });
          logActivity("attachment.upload", row.id, { source: "smart-form" });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_purchases"] });
      qc.invalidateQueries({ queryKey: ["cfpa"] });
      toast.success("Purchase added");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: "verified" | "rejected" | "pending"; reason?: string }) => {
      const patch: any = { verify_status: status };
      if (status === "verified") { patch.verified_by = user!.id; patch.verified_at = new Date().toISOString(); patch.reject_reason = null; }
      else if (status === "rejected") { patch.verified_by = user!.id; patch.verified_at = new Date().toISOString(); patch.reject_reason = reason ?? null; }
      else { patch.verified_by = null; patch.verified_at = null; patch.reject_reason = null; }
      const { error } = await (supabase as any).from("cash_flow_purchases").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_purchases"] });
      qc.invalidateQueries({ queryKey: ["cf-workflow-pending"] });
      qc.invalidateQueries({ queryKey: ["cf-bulk-pending"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const delPurchase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("cash_flow_purchases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const toggleLock = useMutation({
    mutationFn: async (next: boolean) => {
      if (lock) {
        const patch: any = next
          ? { is_locked: true, locked_by: user!.id, locked_at: new Date().toISOString() }
          : { is_locked: false, unlocked_by: user!.id, unlocked_at: new Date().toISOString() };
        const { error } = await (supabase as any).from("cash_flow_day_locks").update(patch).eq("id", lock.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("cash_flow_day_locks").insert({
          shop_id: currentShopId, day_date: workingDate,
          is_locked: next, locked_by: next ? user!.id : null, locked_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
    },
    onSuccess: (_d, next) => {
      qc.invalidateQueries({ queryKey: ["cf_lock"] });
      toast.success(next ? "Day locked" : "Day unlocked");
    },
    onError: (e: any) => toast.error(e.message ?? "Only admin can lock/unlock"),
  });

  return (
    <div className="mobile-page-stack mx-auto max-w-3xl px-3 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h1 className="text-base font-semibold leading-tight">Cash Flow Verification</h1>
            <p className="text-[11px] text-muted-foreground">Track cash, verify purchases, lock the day</p>
          </div>
        </div>
        <Input
          type="date"
          value={workingDate}
          max={today}
          onChange={(e) => setWorkingDate(e.target.value)}
          className="h-8 w-[140px] text-xs"
        />
      </div>

      {/* Shop tabs */}
      <Tabs value={activeShop} onValueChange={setActiveShop}>
        <TabsList className="flex w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-muted/60 p-1">
          {shops.map(s => (
            <TabsTrigger key={s.id} value={s.id} className="rounded-xl px-3 text-xs">{s.name}</TabsTrigger>
          ))}
          <TabsTrigger value={WAREHOUSE} className="rounded-xl px-3 text-xs">Warehouse</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lock banner */}
      <Card className={cn(
        "flex items-center justify-between gap-2 px-4 py-3",
        locked ? "border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5" : "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5"
      )}>
        <div className="flex items-center gap-2">
          {locked ? <Lock className="h-4 w-4 text-amber-600" /> : <Unlock className="h-4 w-4 text-emerald-600" />}
          <div className="text-xs">
            <p className="font-semibold">{locked ? "Day locked" : "Day open"}</p>
            <p className="text-muted-foreground">
              {locked
                ? `Locked ${lock?.locked_at ? new Date(lock.locked_at).toLocaleString() : ""}`
                : "Entries can be added and verified"}
            </p>
          </div>
        </div>
        {isAdmin && !workflowVerified && (
          <Button size="sm" variant={locked ? "outline" : "default"} onClick={() => toggleLock.mutate(!locked)}>
            {locked ? <><Unlock className="h-3.5 w-3.5" /> Unlock</> : <><Lock className="h-3.5 w-3.5" /> Lock Day</>}
          </Button>
        )}
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <SummaryCard icon={<Wallet className="h-4 w-4" />} label="Total Cash In" value={totals.cashIn} tone="emerald" />
        <SummaryCard icon={<ShoppingBag className="h-4 w-4" />} label="Total Purchase" value={totals.total} tone="indigo" />
        <SummaryCard icon={<Wallet className="h-4 w-4" />} label="Remaining Cash" value={totals.remaining} tone={totals.remaining < 0 ? "red" : "primary"} />
        <SummaryCard icon={<CheckCircle2 className="h-4 w-4" />} label="Verified" value={totals.verified} tone="emerald" />
        <SummaryCard icon={<Clock className="h-4 w-4" />} label="Pending" value={totals.pending} tone="amber" />
        <SummaryCard icon={<XCircle className="h-4 w-4" />} label="Due + Credit" value={totals.due + totals.credit} tone="slate" />
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="space-y-1 border-amber-500/40 bg-amber-50/50 px-4 py-3 dark:bg-amber-500/5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Smart Warnings
          </div>
          {warnings.map((w, i) => <p key={i} className="text-[11px] text-amber-700/90 dark:text-amber-300/90">• {w}</p>)}
        </Card>
      )}

      {/* Workflow-finalized banner (for non-admins in the day view) */}
      {workflowVerified && !isAdmin && (
        <Card className="flex items-start gap-2 border-emerald-500/40 bg-emerald-50/50 px-3 py-2.5 text-[11px] text-emerald-800 dark:bg-emerald-500/5 dark:text-emerald-300">
          <Lock className="mt-0.5 h-3.5 w-3.5" />
          <span>This Finance Workflow has been finalized and is locked.</span>
        </Card>
      )}

      {/* Cash In */}
      <Section title="Cash In" icon={<Wallet className="h-4 w-4" />}>
        {!locked && canAddCashIn && <CashInForm onSubmit={(v) => addCashIn.mutate(v)} busy={addCashIn.isPending} />}
        {!locked && !canAddCashIn && <p className="text-[11px] text-muted-foreground">Your role can view but not add Cash In.</p>}
        <div className="space-y-1.5">
          {cashIns.length === 0 && <Empty label="No cash in yet" />}
          {cashIns.map(c => {
            const canRemove = isAdmin || (!locked && c.created_by === user?.id);
            return (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{SAR(c.amount)}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{c.source ?? "—"}{c.notes ? ` · ${c.notes}` : ""}</p>
                </div>
                {canRemove && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={async () => {
                      if (workflowVerified) {
                        const reason = await promptAdminOverride("delete cash-in");
                        if (!reason) return;
                        delCashIn.mutate(c.id);
                        logActivity("cash_in.delete", c.id, { reason, prev: { amount: c.amount, source: c.source }, workflow_verified: true });
                      } else {
                        delCashIn.mutate(c.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Purchases */}
      <Section title="Purchase Verification" icon={<ShoppingBag className="h-4 w-4" />}>
        {!locked && canAddPurchase && <CfPurchaseSmartForm onSubmit={(v) => addPurchase.mutate(v)} busy={addPurchase.isPending} />}
        {!locked && !canAddPurchase && <p className="text-[11px] text-muted-foreground">Your role can verify but not create purchases.</p>}
        <BatchPurchaseList
          purchases={purchases}
          locked={locked}
          canVerify={canVerify}
          isAdmin={isAdmin}
          userId={user?.id}
          adminOverride={workflowVerified && isAdmin}
          onSingleReject={async (p) => {
            if (workflowVerified) {
              const overrideReason = await promptAdminOverride("reject transaction");
              if (!overrideReason) return;
              const reason = window.prompt("Reject reason?", p.reject_reason ?? "") ?? "";
              setStatus.mutate({ id: p.id, status: "rejected", reason });
              logActivity("purchase.reject", p.id, { reason, override_reason: overrideReason, prev_status: p.verify_status, workflow_verified: true });
              return;
            }
            const reason = window.prompt("Reject reason?", p.reject_reason ?? "") ?? "";
            setStatus.mutate({ id: p.id, status: "rejected", reason });
            logActivity("purchase.reject", p.id, { reason });
          }}
          onReset={async (p) => {
            if (workflowVerified) {
              const reason = await promptAdminOverride("reset transaction to pending");
              if (!reason) return;
              setStatus.mutate({ id: p.id, status: "pending" });
              logActivity("purchase.reset", p.id, { reason, prev_status: p.verify_status, workflow_verified: true });
              return;
            }
            setStatus.mutate({ id: p.id, status: "pending" });
            logActivity("purchase.reset", p.id);
          }}
          onDelete={async (p) => {
            if (workflowVerified) {
              const reason = await promptAdminOverride("delete transaction");
              if (!reason) return;
              delPurchase.mutate(p.id);
              logActivity("purchase.delete", p.id, {
                reason,
                prev: { company: p.company, cash: p.cash_amount, due: p.due_amount, credit: p.credit_amount, status: p.verify_status },
                workflow_verified: true,
              });
              return;
            }
            delPurchase.mutate(p.id);
            logActivity("purchase.delete", p.id);
          }}
          onBatchDone={() => {
            qc.invalidateQueries({ queryKey: ["cf_purchases"] });
            qc.invalidateQueries({ queryKey: ["cf-workflow-pending"] });
            qc.invalidateQueries({ queryKey: ["cf-bulk-pending"] });
          }}
          userIdForVerify={user?.id ?? ""}
        />
      </Section>
    </div>
  );
}

/** Admin-only guard for edits after a workflow is finalized. Returns the reason string, or null on cancel. */
async function promptAdminOverride(actionLabel: string): Promise<string | null> {
  const ok = window.confirm(
    "This workflow has already been finalized. Editing or deleting will affect financial records. Do you want to continue?",
  );
  if (!ok) return null;
  const reason = window.prompt(`Reason to ${actionLabel} (required):`, "");
  if (!reason || !reason.trim()) {
    toast.error("Reason is required to override a verified workflow.");
    return null;
  }
  return reason.trim();
}

function SummaryCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "emerald" | "indigo" | "amber" | "red" | "primary" | "slate" }) {
  const tones: Record<string, string> = {
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-700 dark:text-emerald-400",
    indigo: "from-indigo-500/15 to-indigo-500/0 text-indigo-700 dark:text-indigo-400",
    amber: "from-amber-500/15 to-amber-500/0 text-amber-700 dark:text-amber-400",
    red: "from-red-500/15 to-red-500/0 text-red-700 dark:text-red-400",
    primary: "from-primary/15 to-primary/0 text-primary",
    slate: "from-slate-500/15 to-slate-500/0 text-slate-700 dark:text-slate-300",
  };
  return (
    <Card className={cn("relative overflow-hidden bg-gradient-to-br p-3", tones[tone])}>
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide opacity-80">
        {icon}{label}
      </div>
      <p className="mt-1 text-base font-bold tabular-nums text-foreground">{SAR(value)}</p>
    </Card>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="space-y-2 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">{icon}{title}</div>
      {children}
    </Card>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-3 text-center text-[11px] text-muted-foreground">{label}</p>;
}

function CashInForm({ onSubmit, busy }: { onSubmit: (v: { amount: number; source: string; notes: string }) => void; busy: boolean }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <form
      className="grid grid-cols-2 gap-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        const n = Number(amount);
        if (!n || n <= 0) { toast.error("Enter amount"); return; }
        onSubmit({ amount: n, source: source.trim(), notes: notes.trim() });
        setAmount(""); setSource(""); setNotes("");
      }}
    >
      <Input className="col-span-1 h-9" placeholder="Amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
      <Input className="col-span-1 h-9" placeholder="Source (Bank/Owner)" value={source} onChange={e => setSource(e.target.value)} />
      <Input className="col-span-2 h-9" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
      <Button type="submit" disabled={busy} className="col-span-2 h-9">
        <Plus className="h-3.5 w-3.5" /> Add Cash In
      </Button>
    </form>
  );
}

function BatchPurchaseList({
  purchases, locked, canVerify, isAdmin, userId, userIdForVerify, adminOverride = false,
  onSingleReject, onReset, onDelete, onBatchDone,
}: {
  purchases: Purchase[]; locked: boolean; canVerify: boolean; isAdmin: boolean;
  userId: string | undefined; userIdForVerify: string;
  adminOverride?: boolean;
  onSingleReject: (p: Purchase) => void;
  onReset: (p: Purchase) => void;
  onDelete: (p: Purchase) => void;
  onBatchDone: () => void;
}) {
  const profileMap = useProfileMap();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState<null | "verify" | "reject" | "verifyAll">(null);
  const [processing, setProcessing] = useState(false);

  const pendingIds = useMemo(
    () => purchases.filter(p => p.verify_status === "pending").map(p => p.id),
    [purchases],
  );
  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);

  // Prune stale selections when list changes
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

  const selectedList = useMemo(
    () => purchases.filter(p => selected.has(p.id)),
    [purchases, selected],
  );
  const selectedTotal = useMemo(
    () => selectedList.reduce((s, p) => s + p.cash_amount + p.due_amount + p.credit_amount, 0),
    [selectedList],
  );
  const pendingTotal = useMemo(
    () => purchases
      .filter(p => p.verify_status === "pending")
      .reduce((s, p) => s + p.cash_amount + p.due_amount + p.credit_amount, 0),
    [purchases],
  );

  const runBatch = async (mode: "verify" | "reject", ids: string[], reason?: string) => {
    setProcessing(true);
    const patchBase: any = mode === "verify"
      ? { verify_status: "verified", verified_by: userIdForVerify, verified_at: new Date().toISOString(), reject_reason: null }
      : { verify_status: "rejected", verified_by: userIdForVerify, verified_at: new Date().toISOString(), reject_reason: reason ?? null };

    const failedIds: string[] = [];
    let ok = 0;

    // Sequential to keep it lightweight & predictable
    for (const id of ids) {
      try {
        const { error } = await (supabase as any).from("cash_flow_purchases").update(patchBase).eq("id", id);
        if (error) throw error;
        ok += 1;
        try { await (supabase as any).from("cf_activity_log").insert({ action: `purchase.${mode}`, target_table: "cash_flow_purchases", target_id: id, meta: mode === "reject" ? { reason } : {} }); } catch {}
      } catch {
        failedIds.push(id);
      }
    }

    setProcessing(false);
    onBatchDone();

    if (failedIds.length === 0) {
      toast.success(mode === "verify"
        ? `✓ ${ok} transaction${ok === 1 ? "" : "s"} verified successfully.`
        : `✓ ${ok} transaction${ok === 1 ? "" : "s"} rejected.`);
      setSelected(new Set());
    } else {
      toast.error(`${ok} transactions ${mode === "verify" ? "verified successfully" : "rejected"}. ${failedIds.length} failed.`);
      setSelected(new Set(failedIds));
    }
  };

  if (purchases.length === 0) return <Empty label="No purchases yet" />;

  const canBatch = !locked && canVerify && pendingIds.length > 0;
  const allSelected = pendingIds.length > 0 && selected.size === pendingIds.length;
  const selectedCount = selected.size;

  return (
    <>
      {canBatch && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-[11px]">
          <span className="text-muted-foreground">
            {pendingIds.length} pending · {selectedCount} selected
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={selectAll} disabled={allSelected}>
              Select All
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={clearAll} disabled={selectedCount === 0}>
              Clear All
            </Button>
            <Button
              size="sm"
              className="h-7 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-[11px] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:brightness-110"
              disabled={processing || pendingIds.length === 0}
              onClick={() => setConfirmOpen("verifyAll")}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Verify All
            </Button>
          </div>
        </div>
      )}

      <div className={cn("space-y-1.5", selectedCount > 0 && "pb-24")}>
        {purchases.map(p => (
          <PurchaseRow
            key={p.id}
            p={p}
            creator={profileMap[p.created_by] ?? null}
            verifier={p.verified_by ? (profileMap[p.verified_by] ?? null) : null}
            locked={locked}
            adminOverride={adminOverride}
            canVerify={canVerify}
            canDelete={isAdmin}
            isMine={p.created_by === userId}
            isAdmin={isAdmin}
            selectable={!locked && canVerify && p.verify_status === "pending"}
            checked={selected.has(p.id)}
            onToggle={() => toggle(p.id)}
            onReject={onSingleReject}
            onReset={onReset}
            onDelete={onDelete}
          />
        ))}
      </div>

      {canBatch && selectedCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-3 py-2.5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Selected: <b className="text-foreground">{selectedCount}</b> {selectedCount === 1 ? "entry" : "entries"}</p>
              <p className="text-sm font-semibold tabular-nums">Total: {SAR(selectedTotal)}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-10 rounded-full px-3 text-xs"
              disabled={processing}
              onClick={() => setConfirmOpen("reject")}
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
            <Button
              size="sm"
              className="h-10 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 text-xs text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:brightness-110"
              disabled={processing}
              onClick={() => setConfirmOpen("verify")}
            >
              <CheckCircle2 className="h-4 w-4" /> Verify Selected
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={confirmOpen !== null} onOpenChange={(o) => { if (!o && !processing) setConfirmOpen(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmOpen === "verifyAll"
                ? "Verify all pending transactions?"
                : confirmOpen === "verify"
                ? `Verify ${selectedCount} transaction${selectedCount === 1 ? "" : "s"}?`
                : `Reject ${selectedCount} transaction${selectedCount === 1 ? "" : "s"}?`}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-sm text-muted-foreground">
                {confirmOpen === "verifyAll" && (
                  <div>Pending Entries: <b className="text-foreground">{pendingIds.length}</b></div>
                )}
                <div>
                  Total Amount:{" "}
                  <b className="text-foreground">
                    {SAR(confirmOpen === "verifyAll" ? pendingTotal : selectedTotal)}
                  </b>
                </div>
                {confirmOpen === "reject" && (
                  <div className="text-[11px]">A single reject reason will be applied to all selected entries.</div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={processing}
              className={confirmOpen === "reject"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110"}
              onClick={async (e) => {
                e.preventDefault();
                const mode = confirmOpen;
                if (!mode) return;
                let reason: string | undefined;
                if (mode === "reject") {
                  const r = window.prompt("Reject reason (applied to all selected)?", "");
                  if (r === null) return;
                  reason = r;
                }
                setConfirmOpen(null);
                const ids = mode === "verifyAll" ? pendingIds : Array.from(selected);
                const runMode: "verify" | "reject" = mode === "reject" ? "reject" : "verify";
                await runBatch(runMode, ids, reason);
              }}
            >
              {confirmOpen === "verifyAll" ? "Verify All" : confirmOpen === "verify" ? "Verify" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const PurchaseRow = memo(function PurchaseRow({
  p, creator, verifier, locked, canVerify, canDelete, isMine, isAdmin, adminOverride = false,
  selectable, checked, onToggle,
  onReject, onReset, onDelete,
}: {
  p: Purchase; creator: ProfileLite | null; verifier: ProfileLite | null;
  locked: boolean; canVerify: boolean; canDelete: boolean; isMine: boolean; isAdmin: boolean;
  adminOverride?: boolean;
  selectable: boolean; checked: boolean; onToggle: () => void;
  onReject: (p: Purchase) => void;
  onReset: (p: Purchase) => void;
  onDelete: (p: Purchase) => void;
}) {
  const tone =
    p.verify_status === "verified" ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5" :
    p.verify_status === "rejected" ? "border-red-500/40 bg-red-50/50 dark:bg-red-500/5" :
    p.ocr_confidence === "low" ? "border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5" :
    "border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5";
  const total = p.cash_amount + p.due_amount + p.credit_amount;
  const canEditAttachments = !locked && (isAdmin || isMine || canVerify);
  return (
    <div
      data-record-id={p.id}
      className={cn(
        "rounded-xl border px-3 py-2.5 select-none flex gap-2",
        tone,
        checked && "ring-2 ring-emerald-500/50",
      )}
    >
      {selectable && (
        <div className="pt-1">
          <Checkbox checked={checked} onCheckedChange={onToggle} aria-label="Select entry" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="truncate text-sm font-semibold">{p.company}</p>
              {p.verify_status === "verified" && <Badge variant="secondary" className="h-4 gap-1 px-1.5 text-[9px]"><Lock className="h-2.5 w-2.5" /> Verified</Badge>}
              {p.verify_status === "rejected" && <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">Rejected</Badge>}
              {p.verify_status === "pending" && <Badge variant="outline" className="h-4 px-1.5 text-[9px]">Pending</Badge>}
              {p.ocr_confidence && (
                <Badge variant="outline" className={cn("h-4 gap-1 px-1.5 text-[9px] capitalize", CONF_BADGE[p.ocr_confidence])}>
                  <Sparkles className="h-2.5 w-2.5" /> OCR {p.ocr_confidence}
                </Badge>
              )}
              <CfAttachmentManager purchaseId={p.id} canEdit={canEditAttachments} />
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
              {p.cash_amount > 0 && <span>Cash <b className="text-foreground">{SAR(p.cash_amount)}</b></span>}
              {p.due_amount > 0 && <span>Due <b className="text-foreground">{SAR(p.due_amount)}</b></span>}
              {p.credit_amount > 0 && <span>Credit <b className="text-foreground">{SAR(p.credit_amount)}</b></span>}
            </div>
            {p.notes && <p className="mt-0.5 text-[10px] text-muted-foreground">{p.notes}</p>}
            {p.reject_reason && <p className="mt-0.5 text-[10px] text-red-700 dark:text-red-400">⚠ {p.reject_reason}</p>}
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums">{SAR(total)}</p>
        </div>

        {/* Creator / verifier chips */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-1.5 py-0.5">
            <UserIcon className="h-2.5 w-2.5" /> Purchased by <b className="text-foreground/80 font-medium">{displayProfile(creator)}</b>
          </span>
          {verifier && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" /> Verified by <b className="font-medium">{displayProfile(verifier)}</b>
            </span>
          )}
        </div>

        {(!locked || adminOverride) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {adminOverride && (
              <Badge variant="outline" className="h-5 gap-1 border-amber-500/40 bg-amber-500/10 px-1.5 text-[9px] text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-2.5 w-2.5" /> Admin override
              </Badge>
            )}
            {canVerify && p.verify_status !== "rejected" && (
              <Button size="sm" variant="outline" className="h-8 rounded-full px-3 text-xs" onClick={() => onReject(p)}>
                <XCircle className="h-3.5 w-3.5" /> Reject
              </Button>
            )}
            {canVerify && p.verify_status !== "pending" && (
              <Button size="sm" variant="ghost" className="h-8 rounded-full px-3 text-xs" onClick={() => onReset(p)}>
                <Clock className="h-3.5 w-3.5" /> Reset
              </Button>
            )}
            {(canDelete || (isMine && p.verify_status === "pending")) && (
              <Button size="sm" variant="ghost" className="ml-auto h-8 rounded-full px-3 text-xs text-destructive" onClick={() => onDelete(p)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

