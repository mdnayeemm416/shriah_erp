import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { r as readSync, u as utils, a as writeSync } from "../_libs/xlsx.mjs";
import { J as JSZip } from "../_libs/jszip.mjs";

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
import "../_libs/react.mjs";
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
const BACKUP_TABLES = [
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
  "entity_history"
];
const BACKUP_MODULES = {
  finance: [
    "cash_flow_purchases",
    "cash_flow_cash_in",
    "cash_handovers",
    "cash_returns",
    "cash_flow_day_locks",
    "cf_purchase_attachments",
    "cf_activity_log",
    "transactions",
    "daily_closings",
    "cash_in_hand_snapshots"
  ],
  warehouse: ["warehouse_ledger", "warehouse_items", "parties"],
  shop: ["shops", "cashiers", "shop_entries"],
  users: ["profiles", "user_roles", "user_shop_access", "user_page_access"],
  reports: ["overview_categories", "overview_entries", "entity_history"],
  ai: ["ai_scans", "company_aliases"],
  attachments: ["cf_purchase_attachments", "ai_scans"]
};
const SHEET_LABELS = {
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
  overview_entries: "Overview Entries (Daily Sale Buy)"
};
const APP_CONFIG = {
  version: "1.0",
  app: "ShRiAh ERP",
  formulas: {
    shop_cash_position: "(Cash Sale + Withdraw) - (Purchase + Expense)",
    expected_bank_balance: "Bank Sale - Bank Withdraw",
    warehouse_current_value: "Current Stock + Receivable",
    converted_to_cash: "Current Value - Opening Stock",
    summary_total_invest: "Company Opening Balance + Total Shop Cash Position",
    total_cash_in_app: "Total Invest - Warehouse Current Value - Employee Outstanding",
    warehouse_receivable: "(Admin Opening + Party Opening) + Credit Sales - (Payments Received + Party Advances)"
  },
  shop_types: ["full_erp", "simple_cash"],
  role_permissions: {
    admin: ["all"],
    manager: ["read", "write", "warehouse"],
    staff: ["read", "write"],
    viewer: ["read"]
  },
  custom_shop_order: ["Azzouz", "Nujum", "Aklas", "Khaled"],
  working_date_rules: {
    description: "All entries use the active working date instead of the system date."
  },
  transaction_sync: {
    shop_entries: "Sync to transactions on insert/update via DB trigger.",
    warehouse_ledger: "Cash & partial payments mirrored to transactions.",
    employee_entries: "Given/Received mirrored as cash_out/cash_in."
  }
};
async function fetchAll(table) {
  const all = [];
  const PAGE = 1e3;
  let from = 0;
  while (true) {
    const { data, error } = await supabase.from(table).select("*").range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}
async function gatherAllData(onProgress) {
  const result = {};
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
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function buildExcel(data) {
  const wb = utils.book_new();
  const summary = [
    ["ShRiAh ERP — Backup"],
    ["Generated", (/* @__PURE__ */ new Date()).toISOString()],
    [],
    ["Table", "Rows"],
    ...BACKUP_TABLES.map((t) => [SHEET_LABELS[t] ?? t, data[t]?.length ?? 0])
  ];
  utils.book_append_sheet(wb, utils.aoa_to_sheet(summary), "Summary");
  const formulas = [
    ["Formula", "Expression"],
    ...Object.entries(APP_CONFIG.formulas).map(([k, v]) => [k, v])
  ];
  utils.book_append_sheet(wb, utils.aoa_to_sheet(formulas), "Formulas");
  for (const t of BACKUP_TABLES) {
    const rows = data[t] ?? [];
    const label = (SHEET_LABELS[t] ?? t).slice(0, 31);
    const ws = rows.length ? utils.json_to_sheet(rows) : utils.aoa_to_sheet([["(empty)"]]);
    utils.book_append_sheet(wb, ws, label);
  }
  const out = writeSync(wb, { type: "array", bookType: "xlsx" });
  return new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
function toCSV(rows) {
  if (!rows.length) return "";
  const cols = Array.from(rows.reduce((s, r) => {
    Object.keys(r).forEach((k) => s.add(k));
    return s;
  }, /* @__PURE__ */ new Set()));
  const esc = (v) => {
    if (v === null || v === void 0) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
async function buildCsvZip(data) {
  const zip = new JSZip();
  for (const [t, rows] of Object.entries(data)) {
    zip.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
  }
  zip.file("app_config.json", JSON.stringify(APP_CONFIG, null, 2));
  const attachments = [];
  const collect = (table, rows) => {
    rows.forEach((r) => {
      if (r.attachment_url) {
        attachments.push({
          source_table: table,
          entry_id: r.id,
          attachment_url: r.attachment_url,
          created_at: r.created_at
        });
      }
    });
  };
  for (const t of BACKUP_TABLES) collect(t, data[t] ?? []);
  zip.file("attachments_metadata.json", JSON.stringify(attachments, null, 2));
  return await zip.generateAsync({ type: "blob" });
}
function buildConfigJson() {
  return new Blob([JSON.stringify(APP_CONFIG, null, 2)], { type: "application/json" });
}
async function exportEverything(onProgress) {
  const stamp2 = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData(
    (t, i, total) => onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round(i / total * 60))
  );
  onProgress?.("Building Excel…", 70);
  const excelBlob = buildExcel(data);
  onProgress?.("Building CSV files…", 82);
  const zip = new JSZip();
  zip.file(`ShRiAh_ERP_Backup_${stamp2}.xlsx`, excelBlob);
  const csvFolder = zip.folder("csv");
  for (const [t, rows] of Object.entries(data)) {
    csvFolder.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
  }
  zip.file("app_config.json", JSON.stringify(APP_CONFIG, null, 2));
  const attachments = [];
  for (const t of BACKUP_TABLES) {
    for (const r of data[t] ?? []) {
      if (r?.attachment_url) {
        attachments.push({
          source_table: t,
          entry_id: r.id,
          attachment_url: r.attachment_url,
          created_at: r.created_at
        });
      }
    }
  }
  zip.file("attachments_metadata.json", JSON.stringify(attachments, null, 2));
  zip.file(
    "README.txt",
    `ShRiAh ERP Backup
Generated: ${(/* @__PURE__ */ new Date()).toISOString()}

Contents:
- ShRiAh_ERP_Backup_${stamp2}.xlsx (full workbook)
- csv/<table>.csv (per-table CSVs)
- app_config.json (formulas + rules)
- attachments_metadata.json (file references)

Restore: Settings → Backup & Restore → Choose Backup File.
`
  );
  onProgress?.("Packaging ZIP…", 94);
  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `ShRiAh_Backup_${stamp2}.zip`);
  onProgress?.("Done", 100);
  return data;
}
function stamp() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
async function exportExcelOnly(onProgress) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData(
    (t, i, total) => onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round(i / total * 75))
  );
  onProgress?.("Building Excel…", 88);
  const blob = buildExcel(data);
  downloadBlob(blob, `ShRiAh_Backup_${stamp()}.xlsx`);
  onProgress?.("Done", 100);
}
async function exportCsvZip(onProgress) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData(
    (t, i, total) => onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round(i / total * 75))
  );
  onProgress?.("Packaging CSVs…", 88);
  const blob = await buildCsvZip(data);
  downloadBlob(blob, `ShRiAh_CSV_${stamp()}.zip`);
  onProgress?.("Done", 100);
}
async function exportJson(onProgress) {
  onProgress?.("Collecting data…", 5);
  const data = await gatherAllData(
    (t, i, total) => onProgress?.(`Fetched ${SHEET_LABELS[t] ?? t}`, 5 + Math.round(i / total * 80))
  );
  onProgress?.("Building JSON…", 90);
  const attachments = [];
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
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    config: APP_CONFIG,
    attachments_metadata: attachments,
    data
  };
  const blob = new Blob(["\uFEFF" + JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, `ShRiAh_Backup_${stamp()}.json`);
  onProgress?.("Done", 100);
}
async function parseBackupFile(file) {
  const name = file.name.toLowerCase();
  const buf = await file.arrayBuffer();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const wb = readSync(buf, { type: "array" });
    const out = {};
    const labelToTable = new Map(Object.entries(SHEET_LABELS).map(([t, l]) => [l, t]));
    for (const sheetName of wb.SheetNames) {
      if (sheetName === "Summary" || sheetName === "Formulas") continue;
      const table = labelToTable.get(sheetName) ?? sheetName;
      if (!BACKUP_TABLES.includes(table)) continue;
      const ws = wb.Sheets[sheetName];
      out[table] = utils.sheet_to_json(ws, { defval: null });
    }
    return out;
  }
  if (name.endsWith(".zip")) {
    const zip = await JSZip.loadAsync(buf);
    const out = {};
    const xlsxName = Object.keys(zip.files).find((n) => n.toLowerCase().endsWith(".xlsx"));
    if (xlsxName) {
      const xlsxBuf = await zip.file(xlsxName).async("arraybuffer");
      const wb = readSync(xlsxBuf, { type: "array" });
      const labelToTable = new Map(Object.entries(SHEET_LABELS).map(([t, l]) => [l, t]));
      for (const sheetName of wb.SheetNames) {
        if (sheetName === "Summary" || sheetName === "Formulas") continue;
        const table = labelToTable.get(sheetName) ?? sheetName;
        if (!BACKUP_TABLES.includes(table)) continue;
        out[table] = utils.sheet_to_json(wb.Sheets[sheetName], { defval: null });
      }
      return out;
    }
    for (const t of BACKUP_TABLES) {
      const f = zip.file(`${t}.csv`) ?? zip.file(`csv/${t}.csv`);
      if (!f) continue;
      const text = (await f.async("string")).replace(/^\uFEFF/, "");
      const wb = readSync(text, { type: "string" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      out[t] = ws ? utils.sheet_to_json(ws, { defval: null }) : [];
    }
    return out;
  }
  if (name.endsWith(".json")) {
    const text = new TextDecoder().decode(buf);
    const parsed = JSON.parse(text);
    if (parsed?.formulas) return { __config__: [parsed] };
    return parsed;
  }
  throw new Error("Unsupported file type. Use .xlsx, .zip, or .json");
}
function summarizeRestore(data) {
  return Object.entries(data).filter(([t]) => t !== "__config__").map(([table, rows]) => ({ table, rows: rows.length })).filter((x) => x.rows > 0);
}
const SKIP_ON_RESTORE = /* @__PURE__ */ new Set(["entity_history", "profiles", "user_roles", "user_shop_access"]);
async function restoreData(data, onProgress) {
  const tables = BACKUP_TABLES.filter((t) => data[t]?.length && !SKIP_ON_RESTORE.has(t));
  let done = 0;
  for (const t of tables) {
    const rows = data[t];
    onProgress?.(`Restoring ${SHEET_LABELS[t] ?? t} (${rows.length})…`, Math.round(done / tables.length * 100));
    const CHUNK = 200;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK).map((r) => {
        const { ...rest } = r;
        return rest;
      });
      const { error } = await supabase.from(t).upsert(slice, { onConflict: "id" });
      if (error) {
        console.warn(`Skip ${t} chunk:`, error.message);
      }
    }
    done++;
  }
  onProgress?.("Restore complete", 100);
}
async function gatherTables(tables, onProgress) {
  const out = {};
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    onProgress?.(`Fetching ${SHEET_LABELS[t] ?? t}`, 5 + Math.round(i / tables.length * 80));
    try {
      out[t] = await fetchAll(t);
    } catch {
      out[t] = [];
    }
  }
  return out;
}
async function exportModule(moduleKey, format, onProgress) {
  const tables = BACKUP_MODULES[moduleKey];
  const data = await gatherTables(tables, onProgress);
  const name = `ShRiAh_${moduleKey}_${stamp()}`;
  onProgress?.("Packaging…", 90);
  if (format === "json") {
    const payload = { module: moduleKey, generated_at: (/* @__PURE__ */ new Date()).toISOString(), data };
    downloadBlob(new Blob(["\uFEFF" + JSON.stringify(payload, null, 2)], { type: "application/json" }), `${name}.json`);
  } else if (format === "xlsx") {
    downloadBlob(buildExcel(data), `${name}.xlsx`);
  } else {
    const zip = new JSZip();
    for (const [t, rows] of Object.entries(data)) zip.file(`${t}.csv`, `\uFEFF${toCSV(rows)}`);
    zip.file("manifest.json", JSON.stringify({ module: moduleKey, tables, generated_at: (/* @__PURE__ */ new Date()).toISOString() }, null, 2));
    downloadBlob(await zip.generateAsync({ type: "blob" }), `${name}.zip`);
  }
  onProgress?.("Done", 100);
  return { tables: Object.keys(data), totalRows: Object.values(data).reduce((s, r) => s + r.length, 0) };
}
async function exportAttachmentsManifest(onProgress) {
  onProgress?.("Collecting attachment references…", 10);
  const sources = ["shop_entries", "warehouse_ledger", "employee_entries", "transactions", "cf_purchase_attachments", "ai_scans", "cash_handovers", "cash_returns", "overview_entries"];
  const manifest = [];
  for (let i = 0; i < sources.length; i++) {
    const t = sources[i];
    onProgress?.(`Reading ${SHEET_LABELS[t] ?? t}`, 10 + Math.round(i / sources.length * 80));
    try {
      const rows = await fetchAll(t);
      for (const r of rows) {
        const url = r.attachment_url || r.storage_path || r.file_url;
        if (url) manifest.push({ source_table: t, entry_id: r.id, url, created_at: r.created_at, mime: r.mime ?? r.file_type ?? null });
      }
    } catch {
    }
  }
  const blob = new Blob(["\uFEFF" + JSON.stringify({ generated_at: (/* @__PURE__ */ new Date()).toISOString(), count: manifest.length, attachments: manifest }, null, 2)], { type: "application/json" });
  downloadBlob(blob, `ShRiAh_Attachments_${stamp()}.json`);
  onProgress?.("Done", 100);
  return manifest.length;
}
function validateBackup(data) {
  const warnings = [];
  let rows = 0;
  let tables = 0;
  for (const [t, list] of Object.entries(data)) {
    if (t === "__config__") continue;
    if (!Array.isArray(list)) {
      warnings.push(`${t}: not an array`);
      continue;
    }
    tables++;
    rows += list.length;
    const seen = /* @__PURE__ */ new Set();
    for (const r of list) {
      if (!r || typeof r !== "object") {
        warnings.push(`${t}: row not an object`);
        break;
      }
      if (r.id) {
        if (seen.has(r.id)) warnings.push(`${t}: duplicate id ${r.id}`);
        seen.add(r.id);
      }
    }
    if (!BACKUP_TABLES.includes(t)) {
      warnings.push(`${t}: unknown table (will be skipped)`);
    }
  }
  return { ok: warnings.length === 0, warnings: warnings.slice(0, 20), tables, rows };
}
const HISTORY_KEY = "shriah:backup-history:v1";
const HISTORY_MAX = 50;
function readBackupHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function recordBackup(entry) {
  try {
    const list = readBackupHistory();
    list.unshift({ ...entry, id: crypto.randomUUID(), at: (/* @__PURE__ */ new Date()).toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {
  }
}
function clearBackupHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
  }
}
const AUTO_KEY = "shriah:auto-backup:v1";
function readAutoBackup() {
  try {
    const raw = localStorage.getItem(AUTO_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return { enabled: false, interval: "weekly" };
}
function writeAutoBackup(cfg) {
  try {
    localStorage.setItem(AUTO_KEY, JSON.stringify(cfg));
  } catch {
  }
}
function isBackupDue(cfg, lastBackupISO) {
  if (!cfg.enabled) return false;
  if (!lastBackupISO) return true;
  const last = new Date(lastBackupISO).getTime();
  const days = (Date.now() - last) / 864e5;
  const threshold = cfg.interval === "daily" ? 1 : cfg.interval === "weekly" ? 7 : 30;
  return days >= threshold;
}
export {
  APP_CONFIG,
  BACKUP_MODULES,
  BACKUP_TABLES,
  SHEET_LABELS,
  buildConfigJson,
  buildCsvZip,
  buildExcel,
  clearBackupHistory,
  exportAttachmentsManifest,
  exportCsvZip,
  exportEverything,
  exportExcelOnly,
  exportJson,
  exportModule,
  gatherAllData,
  isBackupDue,
  parseBackupFile,
  readAutoBackup,
  readBackupHistory,
  recordBackup,
  restoreData,
  summarizeRestore,
  validateBackup,
  writeAutoBackup
};
