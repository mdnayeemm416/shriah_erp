import { useCallback, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle,
  X, Loader2, ArrowRight,
} from "lucide-react";

type Shop = { id: string; name: string };
type Cashier = { id: string; name: string; shop_id: string };

type ParsedRow = {
  idx: number;
  raw: Record<string, any>;
  date: string;
  shopName: string;
  cashierName: string;
  posSale: number;
  cashSale: number;
  bankSale: number;
  creditSale: number;
  shopId?: string;
  cashierId?: string;
  totalSale: number;
  diff: number;
  errors: string[];
  warnings: string[];
  duplicate?: boolean;
};

const HEADER_MAP: Record<string, keyof Omit<ParsedRow, "idx" | "raw" | "shopId" | "cashierId" | "totalSale" | "diff" | "errors" | "warnings" | "duplicate">> = {
  "date": "date", "txn date": "date", "transaction date": "date", "sale date": "date",
  "shop": "shopName", "shop name": "shopName", "store": "shopName", "store name": "shopName",
  "cashier": "cashierName", "cashier name": "cashierName", "employee": "cashierName",
  "pos": "posSale", "pos sale": "posSale", "pos sales": "posSale",
  "cash": "cashSale", "cash sale": "cashSale", "cash sales": "cashSale",
  "bank": "bankSale", "bank sale": "bankSale", "bank sales": "bankSale", "card": "bankSale", "card sale": "bankSale",
  "credit": "creditSale", "credit sale": "creditSale", "credit sales": "creditSale", "due": "creditSale",
};

function normalizeHeader(h: string) {
  return String(h ?? "").toLowerCase().trim().replace(/[_\-]+/g, " ").replace(/\s+/g, " ");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function parseDate(v: any): string {
  if (v == null || v === "") return "";
  // Preserve local calendar date — never use toISOString (UTC shift).
  if (v instanceof Date) {
    return `${v.getFullYear()}-${pad2(v.getMonth() + 1)}-${pad2(v.getDate())}`;
  }
  if (typeof v === "number") {
    // Excel serial date — already calendar-only
    const d = XLSX.SSF.parse_date_code(v);
    if (d) return `${d.y}-${pad2(d.m)}-${pad2(d.d)}`;
  }
  const s = String(v).trim();
  // ISO yyyy-mm-dd (with optional time) — take the calendar part as-is
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    const y = +iso[1], mo = +iso[2], da = +iso[3];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      return `${iso[1]}-${pad2(mo)}-${pad2(da)}`;
    }
  }
  // dd/mm/yyyy or dd-mm-yyyy
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const da = +m[1], mo = +m[2];
    const yr = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      return `${yr}-${pad2(mo)}-${pad2(da)}`;
    }
  }
  return "";
}

function parseNum(v: any): number {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(/[^\d.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function ShopImportDialog({
  open, onOpenChange, shops, cashiers, existingEntries,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  shops: Shop[];
  cashiers: Cashier[];
  existingEntries: any[];
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<"upload" | "preview" | "importing" | "done">("upload");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ ok: number; failed: { row: number; reason: string }[] } | null>(null);

  const reset = () => {
    setStage("upload"); setFileName(""); setRows([]);
    setProgress(0); setResult(null);
  };

  const close = () => { onOpenChange(false); setTimeout(reset, 300); };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Date", "Shop Name", "Cashier Name", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale"],
      [new Date().toISOString().slice(0, 10), shops[0]?.name ?? "Shop A", "", 0, 0, 0, 0],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shop Sales");
    XLSX.writeFile(wb, "shop-sales-template.xlsx");
  };

  const processFile = useCallback(async (f: File) => {
    setFileName(f.name);
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (!json.length) { toast.error("File has no rows"); return; }

      // Header mapping
      const firstKeys = Object.keys(json[0]);
      const keyMap: Record<string, string> = {};
      for (const k of firstKeys) {
        const mapped = HEADER_MAP[normalizeHeader(k)];
        if (mapped) keyMap[k] = mapped;
      }

      const shopByName = new Map(shops.map((s) => [s.name.toLowerCase().trim(), s]));
      const cashierKey = (shopId: string, name: string) => `${shopId}::${name.toLowerCase().trim()}`;
      const cashierByName = new Map(cashiers.map((c) => [cashierKey(c.shop_id, c.name), c]));

      const dupKey = (date: string, shopId: string, cashierId: string, total: number) =>
        `${date}|${shopId}|${cashierId}|${total.toFixed(2)}`;
      const existingDupSet = new Set(
        existingEntries
          .filter((e) => e.entry_type === "sale")
          .map((e) => dupKey(
            e.txn_date,
            e.shop_id,
            e.cashier_id ?? "",
            (Number(e.cash_sale) || 0) + (Number(e.bank_sale) || 0) + (Number(e.credit_sale) || 0),
          )),
      );

      const parsed: ParsedRow[] = json.map((r, i) => {
        const get = (field: string) => {
          for (const [orig, mapped] of Object.entries(keyMap)) {
            if (mapped === field) return r[orig];
          }
          return undefined;
        };
        const date = parseDate(get("date"));
        const shopName = String(get("shopName") ?? "").trim();
        const cashierName = String(get("cashierName") ?? "").trim();
        const posSale = parseNum(get("posSale"));
        const cashSale = parseNum(get("cashSale"));
        const bankSale = parseNum(get("bankSale"));
        const creditSale = parseNum(get("creditSale"));
        const totalSale = cashSale + bankSale + creditSale;
        const diff = totalSale - posSale;

        const errors: string[] = [];
        const warnings: string[] = [];
        if (!date) errors.push("Invalid/missing date");
        if (!shopName) errors.push("Missing shop");
        const shop = shopName ? shopByName.get(shopName.toLowerCase()) : undefined;
        if (shopName && !shop) errors.push(`Unknown shop "${shopName}"`);
        let cashier: Cashier | undefined;
        if (shop && cashierName) {
          cashier = cashierByName.get(cashierKey(shop.id, cashierName));
          if (!cashier) warnings.push(`Unknown cashier "${cashierName}"`);
        }
        if (totalSale + posSale === 0) errors.push("All amounts are zero");

        const duplicate = !!shop && existingDupSet.has(dupKey(date, shop.id, cashier?.id ?? "", totalSale));
        if (duplicate) warnings.push("Possible duplicate");

        return {
          idx: i + 2, raw: r, date, shopName, cashierName, posSale, cashSale, bankSale, creditSale,
          shopId: shop?.id, cashierId: cashier?.id, totalSale, diff, errors, warnings, duplicate,
        };
      });

      setRows(parsed);
      setStage("preview");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to read file");
    }
  }, [shops, cashiers, existingEntries]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const validRows = useMemo(() => rows.filter((r) => r.errors.length === 0), [rows]);
  const invalidRows = useMemo(() => rows.filter((r) => r.errors.length > 0), [rows]);
  const dupRows = useMemo(() => validRows.filter((r) => r.duplicate), [validRows]);

  const doImport = async () => {
    if (!user) return toast.error("Not signed in");
    if (!validRows.length) return toast.error("No valid rows to import");

    setStage("importing"); setProgress(0);
    const failed: { row: number; reason: string }[] = [];
    let ok = 0;

    const batchSize = 25;
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      const payload = batch.map((r) => ({
        txn_date: r.date,
        shop_id: r.shopId!,
        cashier_id: r.cashierId ?? null,
        entry_type: "sale",
        pos_sale: r.posSale,
        cash_sale: r.cashSale,
        bank_sale: r.bankSale,
        credit_sale: r.creditSale,
        difference: r.diff,
        purchase_amount: 0, expense_amount: 0, withdraw_amount: 0,
        notes: "Imported from file",
        created_by: user.id,
      }));
      const { error } = await (supabase as any).from("shop_entries").insert(payload);
      if (error) {
        batch.forEach((r) => failed.push({ row: r.idx, reason: error.message }));
      } else {
        ok += batch.length;
      }
      setProgress(Math.round(((i + batch.length) / validRows.length) * 100));
    }

    setResult({ ok, failed });
    setStage("done");
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["txns"] });
    if (ok) toast.success(`Imported ${ok} sale${ok === 1 ? "" : "s"}`);
    if (failed.length) toast.error(`${failed.length} row${failed.length === 1 ? "" : "s"} failed`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else onOpenChange(true); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import Shop Sales
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto -mx-6 px-6">
          {stage === "upload" && (
            <div className="space-y-4 py-2">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
                  dragOver
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-border hover:border-primary/50 hover:bg-muted/40",
                )}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-semibold">Drop Excel / CSV here, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">Supports .xlsx and .csv</p>
                <input
                  ref={fileRef} type="file" hidden
                  accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) processFile(f); }}
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Need a starting point?</p>
                  <p className="text-xs text-muted-foreground">Download a pre-filled template with the right columns.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Template
                </Button>
              </div>
              <div className="rounded-xl border bg-card p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Expected columns</p>
                <p>Date · Shop Name · Cashier Name · POS Sale · Cash Sale · Bank Sale · Credit Sale</p>
              </div>
            </div>
          )}

          {stage === "preview" && (
            <div className="space-y-3 py-2">
              <div className="flex items-center justify-between text-xs">
                <div className="truncate">
                  <span className="font-semibold">{fileName}</span>
                  <span className="text-muted-foreground"> · {rows.length} rows</span>
                </div>
                <Button variant="ghost" size="sm" onClick={reset}><X className="mr-1 h-3 w-3" /> Change file</Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Valid" value={validRows.length} tone="ok" />
                <Stat label="Errors" value={invalidRows.length} tone="err" />
                <Stat label="Duplicates" value={dupRows.length} tone="warn" />
              </div>

              <div className="rounded-xl border overflow-auto max-h-[40vh]">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 sticky top-0">
                    <tr className="text-left">
                      <th className="px-2 py-1.5">#</th>
                      <th className="px-2 py-1.5">Date</th>
                      <th className="px-2 py-1.5">Shop</th>
                      <th className="px-2 py-1.5">Cashier</th>
                      <th className="px-2 py-1.5 text-right">POS</th>
                      <th className="px-2 py-1.5 text-right">Cash</th>
                      <th className="px-2 py-1.5 text-right">Bank</th>
                      <th className="px-2 py-1.5 text-right">Credit</th>
                      <th className="px-2 py-1.5 text-right">Total</th>
                      <th className="px-2 py-1.5 text-right">+/-</th>
                      <th className="px-2 py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.idx} className={cn(
                        "border-t",
                        r.errors.length > 0 && "bg-destructive/5",
                        r.errors.length === 0 && r.duplicate && "bg-amber-500/5",
                      )}>
                        <td className="px-2 py-1.5 text-muted-foreground">{r.idx}</td>
                        <td className="px-2 py-1.5">{r.date || <span className="text-destructive">—</span>}</td>
                        <td className="px-2 py-1.5">{r.shopName || <span className="text-destructive">—</span>}</td>
                        <td className="px-2 py-1.5">{r.cashierName || <span className="text-muted-foreground">—</span>}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{r.posSale.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{r.cashSale.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{r.bankSale.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums">{r.creditSale.toFixed(2)}</td>
                        <td className="px-2 py-1.5 text-right tabular-nums font-semibold">{r.totalSale.toFixed(2)}</td>
                        <td className={cn(
                          "px-2 py-1.5 text-right tabular-nums",
                          r.diff > 0 && "text-emerald-600",
                          r.diff < 0 && "text-destructive",
                        )}>{r.diff.toFixed(2)}</td>
                        <td className="px-2 py-1.5">
                          {r.errors.length > 0 ? (
                            <Badge variant="destructive" className="gap-1 text-[10px]" title={r.errors.join("; ")}>
                              <AlertTriangle className="h-2.5 w-2.5" /> Error
                            </Badge>
                          ) : r.duplicate ? (
                            <Badge className="gap-1 text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300" title={r.warnings.join("; ")}>
                              <AlertTriangle className="h-2.5 w-2.5" /> Dup
                            </Badge>
                          ) : (
                            <Badge className="gap-1 text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="h-2.5 w-2.5" /> OK
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invalidRows.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
                  <p className="font-semibold text-destructive mb-1">{invalidRows.length} row(s) will be skipped:</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {invalidRows.slice(0, 5).map((r) => (
                      <li key={r.idx}>Row {r.idx}: {r.errors.join("; ")}</li>
                    ))}
                    {invalidRows.length > 5 && <li>…and {invalidRows.length - 5} more</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {stage === "importing" && (
            <div className="py-10 space-y-4 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-semibold">Importing {validRows.length} sales…</p>
              <Progress value={progress} className="max-w-sm mx-auto" />
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </div>
          )}

          {stage === "done" && result && (
            <div className="py-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="font-display text-xl font-bold">Import complete</p>
                <p className="text-sm text-muted-foreground">
                  {result.ok} imported · {result.failed.length} failed
                </p>
              </div>
              {result.failed.length > 0 && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs max-h-40 overflow-auto">
                  <p className="font-semibold text-destructive mb-1">Failed rows</p>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {result.failed.map((f, i) => (
                      <li key={i}>Row {f.row}: {f.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {stage === "upload" && <Button variant="ghost" onClick={close}>Cancel</Button>}
          {stage === "preview" && (
            <>
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button onClick={doImport} disabled={!validRows.length}>
                Import {validRows.length} valid <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {stage === "done" && <Button onClick={close}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "err" | "warn" }) {
  return (
    <div className={cn(
      "rounded-xl border px-3 py-2",
      tone === "ok" && "border-emerald-500/30 bg-emerald-500/5",
      tone === "err" && "border-destructive/30 bg-destructive/5",
      tone === "warn" && "border-amber-500/30 bg-amber-500/5",
    )}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
