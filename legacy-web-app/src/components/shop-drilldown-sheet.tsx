import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import { Search, FileDown, FileSpreadsheet, Share2, Paperclip, Sparkles, CalendarDays, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { EntryDetailDialog } from "@/components/entry-detail-dialog";

export type DrillKind = "cash_sale" | "bank_sale" | "pos_sale" | "credit_sale" | "bank_withdraw" | "purchase" | "cash_in" | "expense";

const KIND_META: Record<DrillKind, { title: string; txnType: string; payMethod?: string; entryType?: string; amountField: string }> = {
  cash_sale: { title: "Cash Sale", txnType: "cash_in", payMethod: "cash", entryType: "sale", amountField: "cash_sale" },
  bank_sale: { title: "Bank Sale", txnType: "cash_in", entryType: "sale", amountField: "bank_sale" },
  pos_sale: { title: "POS Sale", txnType: "cash_in", entryType: "sale", amountField: "pos_sale" },
  credit_sale: { title: "Credit Sale", txnType: "cash_in", entryType: "sale", amountField: "credit_sale" },
  bank_withdraw: { title: "Bank Withdraw", txnType: "bank_withdraw", entryType: "withdraw", amountField: "withdraw_amount" },
  purchase: { title: "Purchase", txnType: "purchase", entryType: "purchase", amountField: "purchase_amount" },
  cash_in: { title: "Cash In", txnType: "cash_in", payMethod: "cash", entryType: "sale", amountField: "cash_sale" },
  expense: { title: "Expense", txnType: "cash_out", entryType: "expense", amountField: "expense_amount" },
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  shop: { id: string; name: string } | null;
  kind: DrillKind | null;
  initialFrom?: string | null;
  initialTo?: string | null;
};

type Row = {
  id: string;
  date: string;
  amount: number;
  cashier?: string | null;
  attachment?: string | null;
  hasOcr?: boolean;
  notes?: string | null;
};

export function ShopDrilldownSheet({ open, onOpenChange, shop, kind, initialFrom, initialTo }: Props) {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  const [activeEntry, setActiveEntry] = useState<string | null>(null);

  const meta = kind ? KIND_META[kind] : null;

  const { data: rows = [], isLoading } = useQuery<Row[]>({
    queryKey: ["drill", shop?.id, kind],
    enabled: !!shop && !!kind && open,
    queryFn: async () => {
      if (!shop || !meta) return [];
      // Pull from shop_entries (source of truth, also has OCR/attachment info)
      const { data: entries } = await supabase
        .from("shop_entries")
        .select("*, cashiers(name)")
        .eq("shop_id", shop.id)
        .eq("entry_type", meta.entryType!)
        .eq("is_deleted", false)
        .order("txn_date", { ascending: false });
      return ((entries ?? []) as any[]).map((e) => ({
        id: e.id,
        date: e.txn_date,
        amount: Number(e[meta.amountField] ?? 0),
        cashier: e.cashiers?.name ?? null,
        attachment: e.attachment_url ?? null,
        hasOcr: !!e.ocr_scan_id,
        notes: e.notes,
      })).filter((r) => r.amount > 0);
    },
  });

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${r.date} ${r.cashier ?? ""} ${r.notes ?? ""} ${r.amount}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, from, to, search]);

  const total = filtered.reduce((s, r) => s + r.amount, 0);

  const exportCsv = () => {
    if (!shop || !meta) return;
    const cols = ["Date", "Amount (SAR)", "Cashier", "Attachment", "OCR", "Notes"];
    const lines = [cols.join(",")].concat(
      filtered.map((r) =>
        [r.date, r.amount.toFixed(2), r.cashier ?? "", r.attachment ? "Yes" : "No", r.hasOcr ? "Yes" : "No", (r.notes ?? "").replace(/[",\n]/g, " ")]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shop.name}-${meta.title}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!shop || !meta) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    const esc = (s: unknown) =>
      String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${esc(shop.name)} — ${esc(meta.title)}</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:32px;color:#0f172a}
        h1{margin:0 0 4px;font-size:22px}
        .sub{color:#64748b;font-size:13px;margin-bottom:18px}
        .total{font-size:20px;font-weight:700;margin:12px 0 24px;padding:14px 18px;background:#f1f5f9;border-radius:10px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e2e8f0}
        th{background:#f8fafc;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#64748b}
        td.r,th.r{text-align:right}
      </style></head><body>
      <h1>${esc(shop.name)} — ${esc(meta.title)}</h1>
      <div class="sub">${esc(from || "All")} → ${esc(to || "Now")} · ${filtered.length} entries</div>
      <div class="total">Total: SAR ${total.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <table><thead><tr><th>Date</th><th class="r">Amount</th><th>Cashier</th><th>Attachment</th><th>OCR</th><th>Notes</th></tr></thead>
      <tbody>${filtered
        .map(
          (r) =>
            `<tr><td>${esc(r.date)}</td><td class="r">${r.amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>${esc(r.cashier ?? "—")}</td><td>${r.attachment ? "Yes" : "—"}</td><td>${r.hasOcr ? "Yes" : "—"}</td><td>${esc(r.notes ?? "")}</td></tr>`,
        )
        .join("")}</tbody></table>
      <script>setTimeout(()=>window.print(),300)</script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  const share = async () => {
    if (!shop || !meta) return;
    const text = `${shop.name} — ${meta.title}\nTotal: SAR ${total.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nEntries: ${filtered.length}`;
    try {
      if (navigator.share) await navigator.share({ title: `${shop.name} ${meta.title}`, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Summary copied to clipboard");
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0">
        <div className="flex flex-col">
          <SheetHeader className="border-b border-border px-5 pt-5 pb-4 text-left">
            <SheetTitle className="font-display text-lg">
              {shop?.name} <span className="text-muted-foreground">— {meta?.title}</span>
            </SheetTitle>
            <div className="mt-3 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Total</p>
              <div className="mt-1">
                <SARAmount value={total} size="2xl" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
              </p>
            </div>
          </SheetHeader>

          {/* Controls */}
          <div className="space-y-2 border-b border-border px-5 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-9 text-xs" />
              </div>
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 text-xs" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={exportPdf}><FileDown className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
              <Button size="sm" variant="outline" onClick={exportCsv}><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />Excel</Button>
              <Button size="sm" variant="outline" onClick={share}><Share2 className="mr-1.5 h-3.5 w-3.5" />Share</Button>
            </div>
          </div>

          {/* List */}
          <div className="px-3 py-3">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No entries found.</div>
            ) : (
              <ul className="space-y-2">
                {filtered.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setActiveEntry(r.id)}
                      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:scale-[0.99]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                          {r.hasOcr && (
                            <Badge variant="secondary" className="h-5 gap-0.5 px-1.5 text-[9px]">
                              <Sparkles className="h-2.5 w-2.5" /> OCR
                            </Badge>
                          )}
                          {r.attachment && <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                        {(r.cashier || r.notes) && (
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {r.cashier ? <span className="font-medium">{r.cashier}</span> : null}
                            {r.cashier && r.notes ? " · " : null}
                            {r.notes ?? ""}
                          </p>
                        )}
                      </div>
                      <div className={cn("flex items-center gap-1", (kind === "purchase" || kind === "expense") ? "text-destructive" : "text-success")}>
                        <SARAmount value={r.amount} size="md" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
      <EntryDetailDialog
        open={!!activeEntry}
        onOpenChange={(v) => !v && setActiveEntry(null)}
        entryId={activeEntry}
        kind={kind}
      />
    </Sheet>
  );
}
