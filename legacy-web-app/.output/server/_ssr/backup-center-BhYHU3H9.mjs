import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as useUserAccess, u as useConfirm, C as Card, B as Button, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, d as cn, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction } from "./router-KeVl8_Ln.mjs";
import { P as Progress } from "./progress-C7s7mjqg.mjs";
import { S as Switch } from "./switch-BxdoXYZW.mjs";
import { readBackupHistory, readAutoBackup, isBackupDue, writeAutoBackup, BACKUP_TABLES, BACKUP_MODULES, clearBackupHistory, SHEET_LABELS, parseBackupFile, summarizeRestore, validateBackup, restoreData, recordBackup, exportEverything, exportExcelOnly, exportCsvZip, exportJson, exportAttachmentsManifest, exportModule } from "./backup-restore-CrfSxEL7.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/jszip.mjs";
import { bi as Database, c as ShieldCheck, a as TriangleAlert, k as LoaderCircle, v as Package, _ as Download, bq as FileArchive, aH as FileSpreadsheet, br as FileBraces, aZ as Banknote, b6 as Warehouse, U as Users, ac as FileChartColumnIncreasing, l as Sparkles, q as Paperclip, j as Upload, S as ShieldAlert, f as Clock, T as Trash2, a4 as History, C as CircleCheck, bs as ShieldQuestionMark } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-Bs6QIVWe.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/xlsx.mjs";
import "../_libs/readable-stream.mjs";

import "../_libs/process-nextick-args.mjs";
import "../_libs/isarray.mjs";
import "../_libs/safe-buffer.mjs";
import "../_libs/core-util-is.mjs";
import "../_libs/inherits.mjs";

import "../_libs/util-deprecate.mjs";
import "../_libs/lie.mjs";
import "../_libs/immediate.mjs";
import "../_libs/setimmediate.mjs";
import "../_libs/pako.mjs";
function BackupCenterPage() {
  const access = useUserAccess();
  if (access.loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-sm text-muted-foreground", children: "Loading…" });
  }
  if (!access.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: access.primaryRoute });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BackupCenter, {});
}
function BackupCenter() {
  const confirm = useConfirm();
  const [progress, setProgress] = reactExports.useState({
    busy: false,
    pct: 0,
    msg: ""
  });
  const [history, setHistory] = reactExports.useState(() => readBackupHistory());
  const [auto, setAuto] = reactExports.useState(() => readAutoBackup());
  const [confirmRestore, setConfirmRestore] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  const lastBackup = history.find((h) => h.kind !== "restore" && h.status === "success");
  const dueNow = isBackupDue(auto, lastBackup?.at);
  reactExports.useEffect(() => {
    writeAutoBackup(auto);
  }, [auto]);
  const refreshHistory = () => setHistory(readBackupHistory());
  const run = async (label, fn, extra = {}) => {
    setProgress({
      busy: true,
      pct: 0,
      msg: "Starting…"
    });
    try {
      const result = await fn((msg, pct) => setProgress({
        busy: true,
        pct,
        msg
      }));
      recordBackup({
        kind: "full",
        label,
        status: "success",
        ...extra
      });
      toast.success(`${label} complete`);
      return result;
    } catch (e) {
      recordBackup({
        kind: "full",
        label,
        status: "failed",
        ...extra
      });
      toast.error(e?.message ?? `${label} failed`);
    } finally {
      setProgress({
        busy: false,
        pct: 0,
        msg: ""
      });
      refreshHistory();
    }
  };
  const doFullSnapshot = () => run("Full ERP Snapshot", exportEverything, {
    kind: "full",
    format: "zip"
  });
  const doExcel = () => run("Excel export", exportExcelOnly, {
    kind: "format",
    format: "xlsx"
  });
  const doCsv = () => run("CSV ZIP export", exportCsvZip, {
    kind: "format",
    format: "csv"
  });
  const doJson = () => run("JSON export", exportJson, {
    kind: "format",
    format: "json"
  });
  const doAttachments = () => run("Attachments manifest", async (p) => {
    const n = await exportAttachmentsManifest(p);
    return {
      rows: n
    };
  }, {
    kind: "attachments",
    format: "json"
  });
  const doModule = (m, fmt) => run(`${m} (${fmt})`, async (p) => exportModule(m, fmt, p), {
    kind: "module",
    format: fmt,
    label: `Module: ${m} (${fmt})`
  });
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setProgress({
      busy: true,
      pct: 10,
      msg: "Reading file…"
    });
    try {
      const data = await parseBackupFile(file);
      const summary = summarizeRestore(data);
      const {
        warnings
      } = validateBackup(data);
      if (!summary.length) {
        toast.error("No restorable data found in file");
        return;
      }
      setConfirmRestore({
        fileName: file.name,
        data,
        summary,
        warnings
      });
    } catch (err) {
      toast.error(err?.message ?? "Could not read file");
    } finally {
      setProgress({
        busy: false,
        pct: 0,
        msg: ""
      });
    }
  };
  const doRestore = async () => {
    if (!confirmRestore) return;
    setProgress({
      busy: true,
      pct: 0,
      msg: "Restoring…"
    });
    try {
      await restoreData(confirmRestore.data, (msg, pct) => setProgress({
        busy: true,
        pct,
        msg
      }));
      recordBackup({
        kind: "restore",
        label: `Restore: ${confirmRestore.fileName}`,
        status: "success"
      });
      toast.success("Restore complete. Reloading…");
      setConfirmRestore(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      recordBackup({
        kind: "restore",
        label: `Restore: ${confirmRestore.fileName}`,
        status: "failed"
      });
      toast.error(e?.message ?? "Restore failed");
    } finally {
      setProgress({
        busy: false,
        pct: 0,
        msg: ""
      });
      refreshHistory();
    }
  };
  const totalTables = BACKUP_TABLES.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold leading-tight", children: "Backup Center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[12px] text-muted-foreground", children: [
          "Enterprise disaster-recovery & migration toolkit · ",
          totalTables,
          " tables tracked"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
        " Admin"
      ] })
    ] }),
    dueNow && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-amber-500/40 bg-amber-500/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Backup overdue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
          "Last successful backup",
          lastBackup ? ` ${timeAgo(lastBackup.at)}` : ": never",
          ". Run a Full ERP Snapshot now."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: doFullSnapshot, disabled: progress.busy, children: "Backup now" })
    ] }) }),
    progress.busy && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate flex-1", children: progress.msg || "Working…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          progress.pct,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress.pct, className: "h-2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Full ERP Snapshot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground mt-0.5", children: "Everything in one ZIP: Excel workbook + per-table CSVs + JSON config + attachment manifest. Migration-ready." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: doFullSnapshot, disabled: progress.busy, className: "mt-4 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1.5 h-4 w-4" }),
        " Download Full Snapshot"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileArchive, { className: "h-3.5 w-3.5" }), children: "Export by format" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormatButton, { onClick: doExcel, disabled: progress.busy, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }), label: "Excel", sub: ".xlsx" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormatButton, { onClick: doCsv, disabled: progress.busy, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileArchive, { className: "h-4 w-4" }), label: "CSV", sub: ".zip" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormatButton, { onClick: doJson, disabled: progress.busy, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileBraces, { className: "h-4 w-4" }), label: "JSON", sub: "portable" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }), children: "Backup by module" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-4 w-4" }), tone: "emerald", title: "Finance", desc: "Purchases, cash-in, handovers, returns, custody, transactions, daily closings", tables: BACKUP_MODULES.finance.length, onExport: (f) => doModule("finance", f), disabled: progress.busy }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-4 w-4" }), tone: "amber", title: "Warehouse", desc: "Ledger, items, parties", tables: BACKUP_MODULES.warehouse.length, onExport: (f) => doModule("warehouse", f), disabled: progress.busy }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }), tone: "sky", title: "Shops", desc: "Shops, cashiers, shop entries", tables: BACKUP_MODULES.shop.length, onExport: (f) => doModule("shop", f), disabled: progress.busy }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }), tone: "violet", title: "Users & Permissions", desc: "Profiles, roles, shop access, page access", tables: BACKUP_MODULES.users.length, onExport: (f) => doModule("users", f), disabled: progress.busy }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "h-4 w-4" }), tone: "rose", title: "Reports", desc: "Overview categories & entries, activity audit trail", tables: BACKUP_MODULES.reports.length, onExport: (f) => doModule("reports", f), disabled: progress.busy }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }), tone: "primary", title: "AI & Aliases", desc: "OCR scans, AI correction memory, company aliases", tables: BACKUP_MODULES.ai.length, onExport: (f) => doModule("ai", f), disabled: progress.busy })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3.5 w-3.5" }), children: "Attachments" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Attachment manifest" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground mt-0.5", children: "Exports a JSON index of every receipt, slip, and scan reference across the ERP. File contents stay in secure storage." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: doAttachments, disabled: progress.busy, variant: "outline", className: "mt-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1.5 h-4 w-4" }),
        " Export attachment manifest"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }), children: "Restore" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 border-destructive/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Restore from backup file" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground mt-0.5", children: "Accepts .xlsx, .zip, or .json. File is validated before any data is written. You will see a preview & must confirm." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".xlsx,.xls,.zip,.json", hidden: true, onChange: onFile }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => fileRef.current?.click(), disabled: progress.busy, variant: "outline", className: "mt-3 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-1.5 h-4 w-4" }),
        " Choose backup file"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }), children: "Auto-backup reminders" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Remind me to backup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground mt-0.5", children: "Shows a banner here when a backup is overdue. Choose how often." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: auto.enabled, onCheckedChange: (v) => setAuto({
          ...auto,
          enabled: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Interval" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: auto.interval, onValueChange: (v) => setAuto({
          ...auto,
          interval: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-32 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "monthly", children: "Monthly" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionTitle, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }), children: [
      "Backup history",
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        if (await confirm({
          title: "Clear backup history?",
          description: "All backup log entries will be removed. The backup files themselves are not affected.",
          confirmText: "Clear history",
          tone: "warning",
          icon: "warning"
        })) {
          clearBackupHistory();
          refreshHistory();
        }
      }, className: "ms-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
        " Clear"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8 text-center text-xs text-muted-foreground", children: "No backups yet. Run a Full Snapshot to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/50", children: history.slice(0, 15).map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-4 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-7 w-7 place-items-center rounded-lg shrink-0", h.status === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"), children: h.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[12px] font-medium", children: h.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
          new Date(h.at).toLocaleString(),
          " · ",
          h.kind,
          h.format ? ` · ${h.format}` : ""
        ] })
      ] })
    ] }, h.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldQuestionMark, { className: "h-4 w-4 text-muted-foreground shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "Migration ready" }),
        "JSON exports use a normalized, relational schema portable to Supabase, PostgreSQL, Firebase, or any external ERP. CSV files preserve UTF-8 encoding for Arabic, Bangla, and English. Your ERP data is never trapped."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmRestore, onOpenChange: (o) => !o && setConfirmRestore(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-5 w-5 text-destructive" }),
          " Confirm restore"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Restoring from ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: confirmRestore?.fileName }),
            " may overwrite current ERP data. This action cannot be undone."
          ] }),
          confirmRestore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 max-h-40 overflow-y-auto rounded-lg border border-border/50 bg-muted/30 p-2 space-y-1", children: confirmRestore.summary.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: SHEET_LABELS[s.table] ?? s.table }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground", children: s.rows })
          ] }, s.table)) }),
          confirmRestore?.warnings.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/40 bg-amber-500/5 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-amber-700 dark:text-amber-400 mb-1", children: [
              "Warnings (",
              confirmRestore.warnings.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc ps-4 space-y-0.5 text-[10px]", children: confirmRestore.warnings.slice(0, 5).map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: w }, i)) })
          ] }) : null
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: doRestore, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Yes, restore" })
      ] })
    ] }) })
  ] });
}
function SectionTitle({
  icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 inline-flex items-center gap-2", children })
  ] });
}
function FormatButton({
  onClick,
  disabled,
  icon,
  label,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, disabled, className: "flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card px-3 py-3 text-xs font-medium shadow-sm transition-all active:scale-[0.97] hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: sub })
  ] });
}
const TONE = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  primary: "bg-primary/15 text-primary"
};
function ModuleCard({
  icon,
  tone,
  title,
  desc,
  tables,
  onExport,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid h-9 w-9 place-items-center rounded-xl shrink-0", TONE[tone] ?? TONE.primary), children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
            tables,
            " tables"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-snug mt-0.5", children: desc })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onExport("json"), disabled, className: "rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50", children: "JSON" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onExport("xlsx"), disabled, className: "rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50", children: "Excel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onExport("zip"), disabled, className: "rounded-lg border border-border/60 px-2 py-1.5 text-[11px] font-medium hover:bg-muted disabled:opacity-50", children: "CSV ZIP" })
    ] })
  ] });
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
export {
  BackupCenterPage as component
};
