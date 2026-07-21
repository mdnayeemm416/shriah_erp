import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  parseVyaparFile, commitImport, resolveCategories, buildStockPreview,
  type ParseResult, type ImportMode, type ImportSummary, type StockPreviewRow,
} from "@/lib/vyapar-import";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImported?: () => void;
};

export function VyaparImportDialog({ open, onOpenChange, onImported }: Props) {
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [includeStock, setIncludeStock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [stockPreview, setStockPreview] = useState<StockPreviewRow[] | null>(null);

  const reset = () => { setParsed(null); setSummary(null); setBusy(false); setProgress(0); setStockPreview(null); };

  const onFile = async (file: File) => {
    setBusy(true);
    try {
      const result = await parseVyaparFile(file);
      setParsed(result);
      if (result.rows.length === 0) toast.error("No valid products found in this file");
      else {
        toast.success(`Detected ${result.rows.length} products (${result.detectedFormat})`);
        // Build lightweight stock preview (Vyapar → ERP after import)
        try { setStockPreview(await buildStockPreview(result.rows)); } catch { /* ignore */ }
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to parse file");
    } finally {
      setBusy(false);
    }
  };

  const runImport = async () => {
    if (!parsed) return;
    setBusy(true);
    setProgress(0);
    try {
      const hints = parsed.rows.map(r => r.category_hint).filter(Boolean) as string[];
      const categoryMap = await resolveCategories(hints);
      const result = await commitImport(parsed.rows, mode, {
        includeStock,
        categoryMap,
        onProgress: (done, total) => setProgress(Math.round((done / total) * 100)),
      });
      setSummary(result);
      if (result.inserted + result.updated > 0) {
        toast.success(`Imported ${result.inserted} new, updated ${result.updated}`);
        onImported?.();
      }
      if (result.failed > 0) toast.error(`${result.failed} rows failed`);
    } catch (e: any) {
      toast.error(e?.message ?? "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[92dvh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileSpreadsheet className="h-5 w-5 text-primary shrink-0" /> Import from Vyapar
          </DialogTitle>
        </DialogHeader>

        {!parsed && !summary && (
          <div className="space-y-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 sm:px-6 sm:py-10 text-center transition-colors hover:bg-muted/50">
              {busy
                ? <Loader2 className="h-8 w-8 animate-spin text-primary" />
                : <Upload className="h-8 w-8 text-muted-foreground" />}
              <p className="text-sm font-medium">{busy ? "Reading file…" : "Choose Vyapar export (.xlsx or .csv)"}</p>
              <p className="text-xs text-muted-foreground">Auto-detects Name, Code, Sale Price, Purchase Price, Stock, Tax</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                disabled={busy}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
              />
            </label>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Tip: in Vyapar mobile app go to <b>Reports → Item Report</b> and Export Excel.
              We'll clean broken rows, normalize numbers, remove duplicates, and auto-suggest categories.
            </p>
          </div>
        )}

        {parsed && !summary && (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatPill label="Products" value={parsed.rows.length} tone="primary" />
              <StatPill label="Duplicates" value={parsed.duplicates} />
              <StatPill label="Missing price" value={parsed.missingPrice} tone={parsed.missingPrice > 0 ? "warn" : undefined} />
              <StatPill label="Skipped rows" value={parsed.skipped} />
            </div>
            <Card className="p-2.5 sm:p-3">
              <p className="mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detected columns</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(parsed.headerMap).map(([raw, field]) => (
                  <Badge key={raw} variant="outline" className="text-[9px] sm:text-[10px]">{raw} → {field}</Badge>
                ))}
                {Object.keys(parsed.headerMap).length === 0 && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground">No standard headers matched — please ensure first row has column titles.</p>
                )}
              </div>
            </Card>

            <div className="space-y-2">
              <div>
                <p className="mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Import mode</p>
                <Select value={mode} onValueChange={(v) => setMode(v as ImportMode)}>
                  <SelectTrigger className="text-xs sm:text-sm h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merge">Merge — update existing, add new</SelectItem>
                    <SelectItem value="replace">Replace — overwrite all matching fields</SelectItem>
                    <SelectItem value="skip">Skip duplicates — only insert new products</SelectItem>
                    <SelectItem value="stock_only">Recalculate stock — sync Vyapar stock to existing products only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-xs sm:text-sm">Include stock quantity</span>
                <Switch checked={includeStock} onCheckedChange={setIncludeStock} disabled={mode === "stock_only"} />
              </label>
            </div>

            {stockPreview && stockPreview.length > 0 && includeStock && mode !== "skip" && (
              <Card className="p-2.5 sm:p-3">
                <p className="mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stock preview · Vyapar → ERP after import
                </p>
                <div className="max-h-40 overflow-auto rounded-md border border-border/40">
                  <table className="w-full text-[10px] sm:text-xs">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr>
                        <th className="px-2 py-1 text-left">Product</th>
                        <th className="px-2 py-1 text-right">Now</th>
                        <th className="px-2 py-1 text-right">After</th>
                        <th className="px-2 py-1 text-left">Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockPreview.slice(0, 20).map((p, i) => {
                        const changed = p.currentStock !== null && p.currentStock !== p.importedStock;
                        return (
                          <tr key={i} className="border-t border-border/40">
                            <td className="px-2 py-1 truncate max-w-[140px]">{p.name}</td>
                            <td className="px-2 py-1 text-right text-muted-foreground">{p.currentStock ?? "—"}</td>
                            <td className={`px-2 py-1 text-right font-medium ${changed ? "text-primary" : ""}`}>{p.importedStock}</td>
                            <td className="px-2 py-1 text-[9px] uppercase tracking-wider text-muted-foreground">{p.match}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {stockPreview.length > 20 && (
                  <p className="mt-1 text-center text-[9px] text-muted-foreground">
                    +{stockPreview.length - 20} more rows will be synced
                  </p>
                )}
                <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
                  Stock is <b>replaced</b> with the imported value — never added or subtracted.
                  Matching priority: barcode → item code → exact name.
                </p>
              </Card>
            )}

            <Card className="max-h-48 overflow-hidden p-1">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-xs">
                  <thead className="sticky top-1 bg-muted/80">
                    <tr>
                      <th className="px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap">Name</th>
                      <th className="px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap">Code</th>
                      <th className="px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap">Sale</th>
                      <th className="px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap">Buy</th>
                      <th className="px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap">Stock</th>
                      <th className="px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 30).map((r, i) => (
                      <tr key={i} className="border-t border-border/40">
                        <td className="px-1.5 sm:px-2 py-1 truncate max-w-[120px] sm:max-w-[180px]">{r.name}</td>
                        <td className="px-1.5 sm:px-2 py-1 text-muted-foreground">{r.item_code ?? "—"}</td>
                        <td className="px-1.5 sm:px-2 py-1 text-right whitespace-nowrap">{r.price.toFixed(2)}</td>
                        <td className="px-1.5 sm:px-2 py-1 text-right text-muted-foreground whitespace-nowrap">{r.purchase_price ? r.purchase_price.toFixed(2) : "—"}</td>
                        <td className={`px-1.5 sm:px-2 py-1 text-right font-medium whitespace-nowrap ${r.stock > 0 ? "" : "text-muted-foreground"}`}>{r.stock}</td>
                        <td className="px-1.5 sm:px-2 py-1 whitespace-nowrap">{r.category_hint ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsed.rows.length > 30 && (
                <p className="border-t border-border/40 px-2 py-1.5 text-center text-[9px] sm:text-[10px] text-muted-foreground">
                  +{parsed.rows.length - 30} more rows…
                </p>
              )}
            </Card>

            {busy && (
              <div className="space-y-1.5">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-xs text-muted-foreground">Importing… {progress}%</p>
              </div>
            )}
          </div>
        )}

        {summary && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3 sm:p-4 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">Import complete</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatPill label="New products" value={summary.inserted} tone="primary" />
              <StatPill label="Updated" value={summary.updated} />
              <StatPill label="Stock units" value={Math.round(summary.stockImported)} />
              <StatPill label="Duplicates" value={parsed?.duplicates ?? 0} />
              <StatPill label="Missing price" value={parsed?.missingPrice ?? 0} tone={(parsed?.missingPrice ?? 0) > 0 ? "warn" : undefined} />
              <StatPill label="Failed" value={summary.failed} tone={summary.failed > 0 ? "danger" : undefined} />
            </div>
            {summary.errors.length > 0 && (
              <Card className="p-2.5 sm:p-3">
                <p className="mb-1 flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-rose-600">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Errors
                </p>
                <ul className="space-y-0.5 text-[10px] sm:text-xs text-muted-foreground">
                  {summary.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {summary ? (
            <Button onClick={() => onOpenChange(false)} className="w-full text-xs sm:text-sm">Done</Button>
          ) : parsed ? (
            <>
              <Button variant="outline" onClick={reset} disabled={busy} className="text-xs sm:text-sm whitespace-normal h-auto py-2">Choose another file</Button>
              <Button onClick={runImport} disabled={busy || parsed.rows.length === 0} className="text-xs sm:text-sm whitespace-normal h-auto py-2">
                {busy && <Loader2 className="me-1 h-4 w-4 animate-spin shrink-0" />}
                Import {parsed.rows.length} products
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs sm:text-sm">Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatPill({ label, value, tone }: { label: string; value: number; tone?: "primary" | "danger" | "warn" }) {
  const cls =
    tone === "primary" ? "bg-primary/10 text-primary"
    : tone === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    : tone === "warn" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
    : "bg-muted text-foreground";
  return (
    <div className={`rounded-xl px-2.5 sm:px-3 py-2 ${cls}`}>
      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-sm sm:text-lg font-bold leading-tight">{value}</p>
    </div>
  );
}
