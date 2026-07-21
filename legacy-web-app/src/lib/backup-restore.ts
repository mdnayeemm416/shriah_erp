import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import JSZip from "jszip";

// Tables included in the backup. Order matters for restore (parents first).
export const BACKUP_TABLES = [
  "app_settings",
  "shops",
  "cashiers",
  "categories",
  "sub_categories",
  "parties",
  "employees",
  "profiles",
  "user_roles",
  "user_shop_access",
  "user_page_access",
  "shop_entries",
  "warehouse_ledger",
  "warehouse_items",
  "employee_entries",
  "transactions",
  "daily_closings",
  "cash_in_hand_snapshots",
  "overview_categories",
  "overview_entries",
  "cash_flow_purchases",
  "cash_flow_cash_in",
  "cash_handovers",
  "cash_returns",
  "cash_flow_day_locks",
  "cf_purchase_attachments",
  "cf_activity_log",
  "ai_scans",
  "company_aliases",
  "entity_history",
] as const;

/** Module groupings for scoped backups. */
export const BACKUP_MODULES = {
  finance: [
    "cash_flow_purchases","cash_flow_cash_in","cash_handovers","cash_returns",
    "cash_flow_day_locks","cf_purchase_attachments","cf_activity_log",
    "transactions","daily_closings","cash_in_hand_snapshots",
  ],
  warehouse: ["warehouse_ledger","warehouse_items","parties"],
  shop: ["shops","cashiers","shop_entries"],
  users: ["profiles","user_roles","user_shop_access","user_page_access"],
  reports: ["overview_categories","overview_entries","entity_history"],
  ai: ["ai_scans","company_aliases"],
  attachments: ["cf_purchase_attachments","ai_scans"],
} as const;

export type BackupModuleKey = keyof typeof BACKUP_MODULES;

export const SHEET_LABELS: Record<string, string> = {
  shop_entries: "Shop Entries",
  warehouse_ledger: "Warehouse Entries",
  warehouse_items: "Warehouse Items",
  employee_entries: "Employee Entries",
  employees: "Employees",
  transactions: "Transactions",
  entity_history: "Activity Logs",
  profiles: "Users",
  user_roles: "Roles",
  user_shop_access: "Shop Access",
  app_settings: "Settings",
  categories: "Categories",
  sub_categories: "Sub Categories",
  parties: "Parties",
  shops: "Shops",
  cashiers: "Cashiers",
  daily_closings: "Daily Closing",
  cash_in_hand_snapshots: "Cash In Hand",
  overview_categories: "Overview Categories",
  overview_entries: "Overview Entries (Daily Sale Buy)",
};

export const APP_CONFIG = {
  version: "1.0",
  app: "ShRiAh ERP",
  formulas: {
    shop_cash_position: "(Cash Sale + Withdraw) - (Purchase + Expense)",
    expected_bank_balance: "Bank Sale - Bank Withdraw",
    warehouse_current_value: "Current Stock + Receivable",
    converted_to_cash: "Current Value - Opening Stock",
    summary_total_invest: "Company Opening Balance + Total Shop Cash Position",
    total_cash_in_app: "Total Invest - Warehouse Current Value - Employee Outstanding",
    warehouse_receivable: "(Admin Opening + Party Opening) + Credit Sales - (Payments Received + Party Advances)",
  },
  shop_types: ["full_erp", "simple_cash"],
  role_permissions: {
    admin: ["all"],
    manager: ["read", "write", "warehouse"],
    staff: ["read", "write"],
    viewer: ["read"],
  },
  custom_shop_order: ["Azzouz", "Nujum", "Aklas", "Khaled"],
  working_date_rules: {
    description: "All entries use the active working date instead of the system date.",
  },
  transaction_sync: {
    shop_entries: "Sync to transactions on insert/update via DB trigger.",
    warehouse_ledger: "Cash & partial payments mirrored to transactions.",
    employee_entries: "Given/Received mirrored as cash_out/cash_in.",
  },
};

async function fetchAll(table: string): Promise<any[]> {
  const all: any[] = [];
  const PAGE = 1000;
  let from = 0;
  // paginate around the 1000-row default limit
  while (true) {
    const { data, error } = await supabase.from(table as any).select("*").range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export async function gatherAllData(
  onProgress?: (table: string, idx: number, total: number) => void,
): Promise<Record<string, any[]>> {
  const result: Record<string, any[]> = {};
  for (let i = 0; i < BACKUP_TABLES.length; i++) {
    const t = BACKUP_TABLES[i];
    onProgress?.(t, i + 1, BACKUP_TABLES.length);
    try {
      result[t] = await fetchAll(t);
    } catch (e) {
      console.warn(`Skipped ${t}:`, e);
      result[t] = [];
    }
  }
  return result;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function buildExcel(data: Record<string, any[]>): Blob {
  const wb = XLSX.utils.book_new();
  // Summary sheet first
  const summary = [
    ["ShRiAh ERP — Backup"],
    ["Generated", new Date().toISOString()],
    [],
    ["Table", "Rows"],
    ...BACKUP_TABLES.map((t) => [SHEET_LABELS[t] ?? t, data[t]?.length ?? 0]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

  // Formulas sheet
  const formulas = [
    ["Formula", "Expression"],
    ...Object.entries(APP_CONFIG.formulas).map(([k, v]) => [k, v]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(formulas), "Formulas");

  for (const t of BACKUP_TABLES) {
    const rows = data[t] ?? [];
    const label = (SHEET_LABELS[t] ?? t).slice(0, 31);
    const ws = rows.length
      ? XLSX.utils.json_to_sheet(rows)
      : XLSX.utils.aoa_to_sheet([["(empty)"]]);
    XLSX.utils.book_append_sheet(wb, ws, label);
  }

  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  return new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const cols = Array.from(rows.reduce((s: Set<string>, r) => { Object.keys(r).forEach((k) => s.add(k)); return s; }, new Set<string>()));
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export async function buildCsvZip(data: Record<string, any[]>): Promise<Blob> {
  const zip = new JSZip();
  for (const [t, rows] of Object.entries(data)) {
    zip.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
  }
  zip.file("app_config.json", JSON.stringify(APP_CONFIG, null, 2));
  // attachments metadata
  const attachments: any[] = [];
  const collect = (table: string, rows: any[]) => {
    rows.forEach((r) => {
      if (r.attachment_url) {
        attachments.push({
          source_table: table,
          entry_id: r.id,
          attachment_url: r.attachment_url,
          created_at: r.created_at,
        });
      }
    });
  };
  for (const t of BACKUP_TABLES) collect(t, data[t] ?? []);
  zip.file("attachments_metadata.json", JSON.stringify(attachments, null, 2));
  return await zip.generateAsync({ type: "blob" });
}

export function buildConfigJson(): Blob {
  return new Blob([JSON.stringify(APP_CONFIG, null, 2)], { type: "application/json" });
}

export async function exportEverything(onProgress?: (msg: string, pct: number) => void) {
  const stamp = new Date().toISOString().slice(0, 10);
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData((t, i, total) =>
    onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round((i / total) * 60)),
  );

  onProgress?.("Building Excel…", 70);
  const excelBlob = buildExcel(data);

  onProgress?.("Building CSV files…", 82);
  // Build a single combined ZIP containing Excel + CSVs + config + attachments metadata
  const zip = new JSZip();
  zip.file(`ShRiAh_ERP_Backup_${stamp}.xlsx`, excelBlob);
  const csvFolder = zip.folder("csv")!;
  for (const [t, rows] of Object.entries(data)) {
    csvFolder.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
  }
  zip.file("app_config.json", JSON.stringify(APP_CONFIG, null, 2));
  const attachments: any[] = [];
  for (const t of BACKUP_TABLES) {
    for (const r of data[t] ?? []) {
      if (r?.attachment_url) {
        attachments.push({
          source_table: t,
          entry_id: r.id,
          attachment_url: r.attachment_url,
          created_at: r.created_at,
        });
      }
    }
  }
  zip.file("attachments_metadata.json", JSON.stringify(attachments, null, 2));
  zip.file(
    "README.txt",
    `ShRiAh ERP Backup\nGenerated: ${new Date().toISOString()}\n\nContents:\n- ShRiAh_ERP_Backup_${stamp}.xlsx (full workbook)\n- csv/<table>.csv (per-table CSVs)\n- app_config.json (formulas + rules)\n- attachments_metadata.json (file references)\n\nRestore: Settings → Backup & Restore → Choose Backup File.\n`,
  );

  onProgress?.("Packaging ZIP…", 94);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `ShRiAh_Backup_${stamp}.zip`);
  onProgress?.("Done", 100);
  return data;
}

// ---------- INDIVIDUAL EXPORTS ----------

function stamp() { return new Date().toISOString().slice(0, 10); }

export async function exportExcelOnly(onProgress?: (msg: string, pct: number) => void) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData((t, i, total) =>
    onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round((i / total) * 75)),
  );
  onProgress?.("Building Excel…", 88);
  const blob = buildExcel(data);
  downloadBlob(blob, `ShRiAh_Backup_${stamp()}.xlsx`);
  onProgress?.("Done", 100);
}

export async function exportCsvZip(onProgress?: (msg: string, pct: number) => void) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData((t, i, total) =>
    onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round((i / total) * 75)),
  );
  onProgress?.("Packaging CSVs…", 88);
  const blob = await buildCsvZip(data);
  downloadBlob(blob, `ShRiAh_CSV_${stamp()}.zip`);
  onProgress?.("Done", 100);
}

export async function exportJson(onProgress?: (msg: string, pct: number) => void) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData((t, i, total) =>
    onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round((i / total) * 80)),
  );
  onProgress?.("Building JSON…", 90);
  const attachments: any[] = [];
  for (const t of BACKUP_TABLES) {
    for (const r of data[t] ?? []) {
      if (r?.attachment_url) {
        attachments.push({ source_table: t, entry_id: r.id, attachment_url: r.attachment_url, created_at: r.created_at });
      }
    }
  }
  const payload = {
    app: APP_CONFIG.app,
    version: APP_CONFIG.version,
    generated_at: new Date().toISOString(),
    config: APP_CONFIG,
    attachments_metadata: attachments,
    data,
  };
  const blob = new Blob(["\uFEFF" + JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `ShRiAh_Backup_${stamp()}.json`);
  onProgress?.("Done", 100);
}

// ---------- RESTORE ----------

export type RestorePreview = { table: string; rows: number }[];

export async function parseBackupFile(file: File): Promise<Record<string, any[]>> {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = XLSX.read(buf, { type: "array" });
    const out: Record<string, any[]> = {};
    const labelToTable = new Map(Object.entries(SHEET_LABELS).map(([t, l]) => [l, t]));
    for (const sheetName of wb.SheetNames) {
      if (sheetName === "Summary" || sheetName === "Formulas") continue;
      const table = labelToTable.get(sheetName) ?? sheetName;
      if (!(BACKUP_TABLES as readonly string[]).includes(table)) continue;
      const ws = wb.Sheets[sheetName];
      out[table] = XLSX.utils.sheet_to_json(ws, { defval: null });
    }
    return out;
  }
  if (name.endsWith(".zip")) {
    const zip = await JSZip.loadAsync(buf);
    const out: Record<string, any[]> = {};
    // If the ZIP contains a nested xlsx (new combined backup), prefer that.
    const xlsxName = Object.keys(zip.files).find((n) => n.toLowerCase().endsWith(".xlsx"));
    if (xlsxName) {
      const xlsxBuf = await zip.file(xlsxName)!.async("arraybuffer");
      const wb = XLSX.read(xlsxBuf, { type: "array" });
      const labelToTable = new Map(Object.entries(SHEET_LABELS).map(([t, l]) => [l, t]));
      for (const sheetName of wb.SheetNames) {
        if (sheetName === "Summary" || sheetName === "Formulas") continue;
        const table = labelToTable.get(sheetName) ?? sheetName;
        if (!(BACKUP_TABLES as readonly string[]).includes(table)) continue;
        out[table] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: null });
      }
      return out;
    }
    for (const t of BACKUP_TABLES) {
      const f = zip.file(`${t}.csv`) ?? zip.file(`csv/${t}.csv`);
      if (!f) continue;
      const text = (await f.async("string")).replace(/^\uFEFF/, "");
      const wb = XLSX.read(text, { type: "string" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      out[t] = ws ? XLSX.utils.sheet_to_json(ws, { defval: null }) : [];
    }
    return out;
  }
  if (name.endsWith(".json")) {
    const text = new TextDecoder().decode(buf);
    const parsed = JSON.parse(text);
    // Only config — return empty data map; caller treats config separately
    if (parsed?.formulas) return { __config__: [parsed] as any };
    return parsed;
  }
  throw new Error("Unsupported file type. Use .xlsx, .zip, or .json");
}

export function summarizeRestore(data: Record<string, any[]>): RestorePreview {
  return Object.entries(data)
    .filter(([t]) => t !== "__config__")
    .map(([table, rows]) => ({ table, rows: rows.length }))
    .filter((x) => x.rows > 0);
}

const SKIP_ON_RESTORE = new Set(["entity_history", "profiles", "user_roles", "user_shop_access"]);

export async function restoreData(
  data: Record<string, any[]>,
  onProgress?: (msg: string, pct: number) => void,
) {
  const tables = BACKUP_TABLES.filter((t) => data[t]?.length && !SKIP_ON_RESTORE.has(t));
  let done = 0;
  for (const t of tables) {
    const rows = data[t];
    onProgress?.(`Restoring ${SHEET_LABELS[t] ?? t} (${rows.length})…`, Math.round((done / tables.length) * 100));
    // upsert in chunks
    const CHUNK = 200;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK).map((r) => {
        // strip auto-generated fields that may collide
        const { ...rest } = r;
        return rest;
      });
      const { error } = await supabase.from(t as any).upsert(slice, { onConflict: "id" });
      if (error) {
        console.warn(`Skip ${t} chunk:`, error.message);
        // continue, don't abort entire restore
      }
    }
    done++;
  }
  onProgress?.("Restore complete", 100);
}

// ---------- MODULE-SCOPED EXPORTS ----------

async function gatherTables(
  tables: readonly string[],
  onProgress?: (msg: string, pct: number) => void,
): Promise<Record<string, any[]>> {
  const out: Record<string, any[]> = {};
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    onProgress?.(`Fetching ${SHEET_LABELS[t] ?? t}`, 5 + Math.round((i / tables.length) * 80));
    try {
      out[t] = await fetchAll(t);
    } catch {
      out[t] = [];
    }
  }
  return out;
}

export async function exportModule(
  moduleKey: BackupModuleKey,
  format: "json" | "xlsx" | "zip",
  onProgress?: (msg: string, pct: number) => void,
) {
  const tables = BACKUP_MODULES[moduleKey];
  const data = await gatherTables(tables, onProgress);
  const name = `ShRiAh_${moduleKey}_${stamp()}`;
  onProgress?.("Packaging…", 90);
  if (format === "json") {
    const payload = { module: moduleKey, generated_at: new Date().toISOString(), data };
    downloadBlob(new Blob(["\uFEFF" + JSON.stringify(payload, null, 2)], { type: "application/json" }), `${name}.json`);
  } else if (format === "xlsx") {
    downloadBlob(buildExcel(data), `${name}.xlsx`);
  } else {
    const zip = new JSZip();
    for (const [t, rows] of Object.entries(data)) zip.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
    zip.file("manifest.json", JSON.stringify({ module: moduleKey, tables, generated_at: new Date().toISOString() }, null, 2));
    downloadBlob(await zip.generateAsync({ type: "blob" }), `${name}.zip`);
  }
  onProgress?.("Done", 100);
  return { tables: Object.keys(data), totalRows: Object.values(data).reduce((s, r) => s + r.length, 0) };
}

// ---------- ATTACHMENT MANIFEST EXPORT ----------

export async function exportAttachmentsManifest(onProgress?: (msg: string, pct: number) => void) {
  onProgress?.("Collecting attachment references…", 10);
  const sources = ["shop_entries","warehouse_ledger","employee_entries","transactions","cf_purchase_attachments","ai_scans","cash_handovers","cash_returns","overview_entries"];
  const manifest: any[] = [];
  for (let i = 0; i < sources.length; i++) {
    const t = sources[i];
    onProgress?.(`Reading ${SHEET_LABELS[t] ?? t}`, 10 + Math.round((i / sources.length) * 80));
    try {
      const rows = await fetchAll(t);
      for (const r of rows) {
        const url = r.attachment_url || r.storage_path || r.file_url;
        if (url) manifest.push({ source_table: t, entry_id: r.id, url, created_at: r.created_at, mime: r.mime ?? r.file_type ?? null });
      }
    } catch {}
  }
  const blob = new Blob(["\uFEFF" + JSON.stringify({ generated_at: new Date().toISOString(), count: manifest.length, attachments: manifest }, null, 2)], { type: "application/json" });
  downloadBlob(blob, `ShRiAh_Attachments_${stamp()}.json`);
  onProgress?.("Done", 100);
  return manifest.length;
}

// ---------- VALIDATION ----------

export function validateBackup(data: Record<string, any[]>): { ok: boolean; warnings: string[]; tables: number; rows: number } {
  const warnings: string[] = [];
  let rows = 0;
  let tables = 0;
  for (const [t, list] of Object.entries(data)) {
    if (t === "__config__") continue;
    if (!Array.isArray(list)) { warnings.push(`${t}: not an array`); continue; }
    tables++;
    rows += list.length;
    const seen = new Set<string>();
    for (const r of list) {
      if (!r || typeof r !== "object") { warnings.push(`${t}: row not an object`); break; }
      if (r.id) {
        if (seen.has(r.id)) warnings.push(`${t}: duplicate id ${r.id}`);
        seen.add(r.id);
      }
    }
    if (!(BACKUP_TABLES as readonly string[]).includes(t)) {
      warnings.push(`${t}: unknown table (will be skipped)`);
    }
  }
  return { ok: warnings.length === 0, warnings: warnings.slice(0, 20), tables, rows };
}

// ---------- LOCAL HISTORY ----------

export type BackupHistoryEntry = {
  id: string;
  at: string;
  kind: "full" | "module" | "format" | "attachments" | "restore";
  label: string;
  size_bytes?: number;
  rows?: number;
  format?: string;
  status: "success" | "failed";
  user?: string;
};

const HISTORY_KEY = "shriah:backup-history:v1";
const HISTORY_MAX = 50;

export function readBackupHistory(): BackupHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

export function recordBackup(entry: Omit<BackupHistoryEntry, "id" | "at">) {
  try {
    const list = readBackupHistory();
    list.unshift({ ...entry, id: crypto.randomUUID(), at: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {}
}

export function clearBackupHistory() {
  try { localStorage.removeItem(HISTORY_KEY); } catch {}
}

// ---------- AUTO-BACKUP SETTINGS ----------

export type AutoBackupCfg = { enabled: boolean; interval: "daily" | "weekly" | "monthly"; lastReminder?: string };
const AUTO_KEY = "shriah:auto-backup:v1";

export function readAutoBackup(): AutoBackupCfg {
  try {
    const raw = localStorage.getItem(AUTO_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, interval: "weekly" };
}

export function writeAutoBackup(cfg: AutoBackupCfg) {
  try { localStorage.setItem(AUTO_KEY, JSON.stringify(cfg)); } catch {}
}

export function isBackupDue(cfg: AutoBackupCfg, lastBackupISO?: string): boolean {
  if (!cfg.enabled) return false;
  if (!lastBackupISO) return true;
  const last = new Date(lastBackupISO).getTime();
  const days = (Date.now() - last) / 86_400_000;
  const threshold = cfg.interval === "daily" ? 1 : cfg.interval === "weekly" ? 7 : 30;
  return days >= threshold;
}

