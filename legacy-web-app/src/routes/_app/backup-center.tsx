import { createFileRoute, Navigate } from "@tanstack/react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Database, Download, Upload, ShieldAlert, ShieldCheck, History, Clock,
  Package, Banknote, Warehouse, Users as UsersIcon, FileBarChart, Sparkles,
  Paperclip, Trash2, AlertTriangle, CheckCircle2, Loader2, FileJson, FileSpreadsheet, FileArchive,
  Settings as SettingsIcon, ChevronRight, ShieldQuestion,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUserAccess } from "@/hooks/use-user-access";
import { useConfirm } from "@/hooks/use-confirm";
import {
  exportEverything, exportExcelOnly, exportCsvZip, exportJson, exportModule,
  exportAttachmentsManifest, parseBackupFile, summarizeRestore, restoreData,
  validateBackup, readBackupHistory, recordBackup, clearBackupHistory,
  readAutoBackup, writeAutoBackup, isBackupDue,
  BACKUP_TABLES, BACKUP_MODULES, SHEET_LABELS, type BackupModuleKey, type BackupHistoryEntry,
} from "@/lib/backup-restore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/backup-center")({
  component: BackupCenterPage,
});

function BackupCenterPage() {
  const access = useUserAccess();
  if (access.loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!access.isAdmin) {
    return <Navigate to={access.primaryRoute as any} />;
  }
  return <BackupCenter />;
}

type Progress = { busy: boolean; pct: number; msg: string };

function BackupCenter() {
  const confirm = useConfirm();
  const [progress, setProgress] = useState<Progress>({ busy: false, pct: 0, msg: "" });
  const [history, setHistory] = useState<BackupHistoryEntry[]>(() => readBackupHistory());
  const [auto, setAuto] = useState(() => readAutoBackup());
  const [confirmRestore, setConfirmRestore] = useState<null | { fileName: string; data: any; summary: { table: string; rows: number }[]; warnings: string[] }>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const lastBackup = history.find(h => h.kind !== "restore" && h.status === "success");
  const dueNow = isBackupDue(auto, lastBackup?.at);

  useEffect(() => { writeAutoBackup(auto); }, [auto]);

  const refreshHistory = () => setHistory(readBackupHistory());

  const run = async (
    label: string,
    fn: (p: (msg: string, pct: number) => void) => Promise<any>,
    extra: Partial<BackupHistoryEntry> = {},
  ) => {
    setProgress({ busy: true, pct: 0, msg: "Starting…" });
    try {
      const result = await fn((msg, pct) => setProgress({ busy: true, pct, msg }));
      recordBackup({ kind: "full", label, status: "success", ...extra });
      toast.success(`${label} complete`);
      return result;
    } catch (e: any) {
      recordBackup({ kind: "full", label, status: "failed", ...extra });
      toast.error(e?.message ?? `${label} failed`);
    } finally {
      setProgress({ busy: false, pct: 0, msg: "" });
      refreshHistory();
    }
  };

  // ------- Full snapshot
  const doFullSnapshot = () => run("Full ERP Snapshot", exportEverything, { kind: "full", format: "zip" });
  const doExcel = () => run("Excel export", exportExcelOnly, { kind: "format", format: "xlsx" });
  const doCsv = () => run("CSV ZIP export", exportCsvZip, { kind: "format", format: "csv" });
  const doJson = () => run("JSON export", exportJson, { kind: "format", format: "json" });
  const doAttachments = () => run("Attachments manifest", async (p) => {
    const n = await exportAttachmentsManifest(p);
    return { rows: n };
  }, { kind: "attachments", format: "json" });

  // ------- Module exports
  const doModule = (m: BackupModuleKey, fmt: "json" | "xlsx" | "zip") =>
    run(`${m} (${fmt})`, async (p) => exportModule(m, fmt, p), { kind: "module", format: fmt, label: `Module: ${m} (${fmt})` });

  // ------- Restore
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProgress({ busy: true, pct: 10, msg: "Reading file…" });
    try {
      const data = await parseBackupFile(file);
      const summary = summarizeRestore(data);
      const { warnings } = validateBackup(data);
      if (!summary.length) {
        toast.error("No restorable data found in file");
        return;
      }
      setConfirmRestore({ fileName: file.name, data, summary, warnings });
    } catch (err: any) {
      toast.error(err?.message ?? "Could not read file");
    } finally {
      setProgress({ busy: false, pct: 0, msg: "" });
    }
  };

  const doRestore = async () => {
    if (!confirmRestore) return;
    setProgress({ busy: true, pct: 0, msg: "Restoring…" });
    try {
      await restoreData(confirmRestore.data, (msg, pct) => setProgress({ busy: true, pct, msg }));
      recordBackup({ kind: "restore", label: `Restore: ${confirmRestore.fileName}`, status: "success" });
      toast.success("Restore complete. Reloading…");
      setConfirmRestore(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      recordBackup({ kind: "restore", label: `Restore: ${confirmRestore.fileName}`, status: "failed" });
      toast.error(e?.message ?? "Restore failed");
    } finally {
      setProgress({ busy: false, pct: 0, msg: "" });
      refreshHistory();
    }
  };

  const totalTables = BACKUP_TABLES.length;

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
          <Database className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold leading-tight">Backup Center</h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Enterprise disaster-recovery & migration toolkit · {totalTables} tables tracked
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" /> Admin
        </span>
      </div>

      {/* Auto-backup reminder */}
      {dueNow && (
        <Card className="border-amber-500/40 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Backup overdue</p>
              <p className="text-[12px] text-muted-foreground">
                Last successful backup{lastBackup ? ` ${timeAgo(lastBackup.at)}` : ": never"}. Run a Full ERP Snapshot now.
              </p>
            </div>
            <Button size="sm" onClick={doFullSnapshot} disabled={progress.busy}>
              Backup now
            </Button>
          </div>
        </Card>
      )}

      {/* Progress */}
      {progress.busy && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm font-medium truncate flex-1">{progress.msg || "Working…"}</p>
            <span className="text-xs text-muted-foreground">{progress.pct}%</span>
          </div>
          <Progress value={progress.pct} className="h-2" />
        </Card>
      )}

      {/* Hero: Full Snapshot */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/30">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
            <Package className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Full ERP Snapshot</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Everything in one ZIP: Excel workbook + per-table CSVs + JSON config + attachment manifest. Migration-ready.
            </p>
          </div>
        </div>
        <Button onClick={doFullSnapshot} disabled={progress.busy} className="mt-4 w-full">
          <Download className="mr-1.5 h-4 w-4" /> Download Full Snapshot
        </Button>
      </Card>

      {/* Quick format exports */}
      <SectionTitle icon={<FileArchive className="h-3.5 w-3.5" />}>Export by format</SectionTitle>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <FormatButton onClick={doExcel} disabled={progress.busy} icon={<FileSpreadsheet className="h-4 w-4" />} label="Excel" sub=".xlsx" />
        <FormatButton onClick={doCsv} disabled={progress.busy} icon={<FileArchive className="h-4 w-4" />} label="CSV" sub=".zip" />
        <FormatButton onClick={doJson} disabled={progress.busy} icon={<FileJson className="h-4 w-4" />} label="JSON" sub="portable" />
      </div>

      {/* Module exports */}
      <SectionTitle icon={<Package className="h-3.5 w-3.5" />}>Backup by module</SectionTitle>
      <div className="grid grid-cols-1 gap-2">
        <ModuleCard
          icon={<Banknote className="h-4 w-4" />} tone="emerald"
          title="Finance" desc="Purchases, cash-in, handovers, returns, custody, transactions, daily closings"
          tables={BACKUP_MODULES.finance.length} onExport={(f) => doModule("finance", f)} disabled={progress.busy}
        />
        <ModuleCard
          icon={<Warehouse className="h-4 w-4" />} tone="amber"
          title="Warehouse" desc="Ledger, items, parties"
          tables={BACKUP_MODULES.warehouse.length} onExport={(f) => doModule("warehouse", f)} disabled={progress.busy}
        />
        <ModuleCard
          icon={<Package className="h-4 w-4" />} tone="sky"
          title="Shops" desc="Shops, cashiers, shop entries"
          tables={BACKUP_MODULES.shop.length} onExport={(f) => doModule("shop", f)} disabled={progress.busy}
        />
        <ModuleCard
          icon={<UsersIcon className="h-4 w-4" />} tone="violet"
          title="Users & Permissions" desc="Profiles, roles, shop access, page access"
          tables={BACKUP_MODULES.users.length} onExport={(f) => doModule("users", f)} disabled={progress.busy}
        />
        <ModuleCard
          icon={<FileBarChart className="h-4 w-4" />} tone="rose"
          title="Reports" desc="Overview categories & entries, activity audit trail"
          tables={BACKUP_MODULES.reports.length} onExport={(f) => doModule("reports", f)} disabled={progress.busy}
        />
        <ModuleCard
          icon={<Sparkles className="h-4 w-4" />} tone="primary"
          title="AI & Aliases" desc="OCR scans, AI correction memory, company aliases"
          tables={BACKUP_MODULES.ai.length} onExport={(f) => doModule("ai", f)} disabled={progress.busy}
        />
      </div>

      {/* Attachments */}
      <SectionTitle icon={<Paperclip className="h-3.5 w-3.5" />}>Attachments</SectionTitle>
      <Card className="p-4">
        <p className="text-sm font-medium">Attachment manifest</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Exports a JSON index of every receipt, slip, and scan reference across the ERP. File contents stay in secure storage.
        </p>
        <Button onClick={doAttachments} disabled={progress.busy} variant="outline" className="mt-3 w-full">
          <Download className="mr-1.5 h-4 w-4" /> Export attachment manifest
        </Button>
      </Card>

      {/* Restore */}
      <SectionTitle icon={<Upload className="h-3.5 w-3.5" />}>Restore</SectionTitle>
      <Card className="p-4 border-destructive/30">
        <div className="flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Restore from backup file</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Accepts .xlsx, .zip, or .json. File is validated before any data is written. You will see a preview & must confirm.
            </p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.zip,.json" hidden onChange={onFile} />
        <Button onClick={() => fileRef.current?.click()} disabled={progress.busy} variant="outline" className="mt-3 w-full">
          <Upload className="mr-1.5 h-4 w-4" /> Choose backup file
        </Button>
      </Card>

      {/* Auto-backup */}
      <SectionTitle icon={<Clock className="h-3.5 w-3.5" />}>Auto-backup reminders</SectionTitle>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Remind me to backup</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Shows a banner here when a backup is overdue. Choose how often.
            </p>
          </div>
          <Switch checked={auto.enabled} onCheckedChange={(v) => setAuto({ ...auto, enabled: v })} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Interval</span>
          <Select
            value={auto.interval}
            onValueChange={(v: any) => setAuto({ ...auto, interval: v })}
          >
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* History */}
      <SectionTitle icon={<History className="h-3.5 w-3.5" />}>
        Backup history
        {history.length > 0 && (
          <button
            onClick={async () => { if (await confirm({ title: "Clear backup history?", description: "All backup log entries will be removed. The backup files themselves are not affected.", confirmText: "Clear history", tone: "warning", icon: "warning" })) { clearBackupHistory(); refreshHistory(); } }}
            className="ms-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        )}
      </SectionTitle>
      <Card className="overflow-hidden">
        {history.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            No backups yet. Run a Full Snapshot to get started.
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {history.slice(0, 15).map((h) => (
              <li key={h.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className={cn(
                  "grid h-7 w-7 place-items-center rounded-lg shrink-0",
                  h.status === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive",
                )}>
                  {h.status === "success" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium">{h.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(h.at).toLocaleString()} · {h.kind}{h.format ? ` · ${h.format}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Migration note */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-2">
          <ShieldQuestion className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Migration ready</p>
            JSON exports use a normalized, relational schema portable to Supabase, PostgreSQL, Firebase, or any external ERP.
            CSV files preserve UTF-8 encoding for Arabic, Bangla, and English. Your ERP data is never trapped.
          </div>
        </div>
      </Card>

      {/* Restore confirmation */}
      <AlertDialog open={!!confirmRestore} onOpenChange={(o) => !o && setConfirmRestore(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Confirm restore
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-xs">
                <p>
                  Restoring from <span className="font-mono text-foreground">{confirmRestore?.fileName}</span> may
                  overwrite current ERP data. This action cannot be undone.
                </p>
                {confirmRestore && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/50 bg-muted/30 p-2 space-y-1">
                    {confirmRestore.summary.map((s) => (
                      <div key={s.table} className="flex justify-between text-[11px]">
                        <span>{SHEET_LABELS[s.table] ?? s.table}</span>
                        <span className="font-mono text-muted-foreground">{s.rows}</span>
                      </div>
                    ))}
                  </div>
                )}
                {confirmRestore?.warnings.length ? (
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-2">
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Warnings ({confirmRestore.warnings.length})</p>
                    <ul className="list-disc ps-4 space-y-0.5 text-[10px]">
                      {confirmRestore.warnings.slice(0, 5).map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doRestore} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {icon}
      <span className="flex-1 inline-flex items-center gap-2">{children}</span>
    </div>
  );
}

function FormatButton({ onClick, disabled, icon, label, sub }: { onClick: () => void; disabled: boolean; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card px-3 py-3 text-xs font-medium shadow-sm transition-all active:scale-[0.97] hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
    >
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </button>
  );
}

const TONE: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  primary: "bg-primary/15 text-primary",
};

function ModuleCard({
  icon, tone, title, desc, tables, onExport, disabled,
}: {
  icon: React.ReactNode; tone: string; title: string; desc: string; tables: number;
  onExport: (fmt: "json" | "xlsx" | "zip") => void; disabled: boolean;
}) {
  return (
    <Card className="p-3.5">
      <div className="flex items-start gap-3">
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl shrink-0", TONE[tone] ?? TONE.primary)}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{title}</p>
            <span className="text-[10px] text-muted-foreground">{tables} tables</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <button onClick={() => onExport("json")} disabled={disabled} className="rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50">JSON</button>
        <button onClick={() => onExport("xlsx")} disabled={disabled} className="rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50">Excel</button>
        <button onClick={() => onExport("zip")} disabled={disabled} className="rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50">CSV ZIP</button>
      </div>
    </Card>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
