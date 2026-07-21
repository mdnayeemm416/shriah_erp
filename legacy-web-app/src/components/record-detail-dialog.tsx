import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { SAR, TXN_LABELS } from "@/lib/format";
import { softDelete } from "@/lib/soft-delete";
import { toast } from "sonner";
import {
  Pencil, Trash2, Paperclip, Sparkles, ScanLine, CalendarDays,
  Store, User2, FileText, Loader2, FileDown, Tag, Layers,
  Wallet, Users, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignedAttachmentUrl } from "@/lib/attachment-url";
import { AttachmentLightbox } from "@/components/attachment-lightbox";
import { shareToWhatsApp, type ShareRow } from "@/lib/whatsapp-share";
import { useConfirm } from "@/hooks/use-confirm";

export type RecordKind = "transaction" | "shop_entry" | "warehouse_entry";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  recordId: string | null;
  kind: RecordKind | null;
};

const TABLE: Record<RecordKind, string> = {
  transaction: "transactions",
  shop_entry: "shop_entries",
  warehouse_entry: "warehouse_ledger",
};

function esc(s: any) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function RecordDetailDialog({ open, onOpenChange, recordId, kind }: Props) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);


  const { data: rec, isLoading } = useQuery<any | null>({
    queryKey: ["record-detail", kind, recordId],
    enabled: !!recordId && !!kind && open,
    queryFn: async () => {
      if (!recordId || !kind) return null;
      let q = supabase.from(TABLE[kind] as any).select(
        kind === "shop_entry"
          ? "*, shops(name), cashiers(name)"
          : kind === "transaction"
            ? "*, shops(name)"
            : "*",
      ).eq("id", recordId).maybeSingle();
      const { data } = await q;
      return data;
    },
  });

  const totalSale = useMemo(() => {
    if (!rec || kind !== "shop_entry") return 0;
    return Number(rec.cash_sale ?? 0) + Number(rec.bank_sale ?? 0) + Number(rec.credit_sale ?? 0);
  }, [rec, kind]);

  const isImage = rec?.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(rec.attachment_url);

  const headline = () => {
    if (!rec || !kind) return "Entry";
    if (kind === "transaction") return TXN_LABELS[rec.type] ?? rec.type;
    if (kind === "warehouse_entry") {
      const map: Record<string, string> = {
        warehouse_sale: "Warehouse Sale",
        warehouse_purchase: "Warehouse Purchase",
        payment_received: "Payment Received",
        supplier_payment: "Supplier Payment",
      };
      return map[rec.entry_type] ?? rec.entry_type;
    }
    if (rec.entry_type === "sale") return "Shop Sale";
    if (rec.entry_type === "purchase") return "Shop Purchase";
    if (rec.entry_type === "withdraw") return "Bank Withdraw";
    if (rec.entry_type === "expense") return "Shop Expense";
    return "Shop Entry";
  };

  const heroAmount = () => {
    if (!rec || !kind) return 0;
    if (kind === "transaction") return Number(rec.amount ?? 0);
    if (kind === "warehouse_entry") return Number(rec.amount ?? 0);
    if (rec.entry_type === "sale") return totalSale;
    if (rec.entry_type === "purchase") return Number(rec.purchase_amount ?? 0);
    if (rec.entry_type === "withdraw") return Number(rec.withdraw_amount ?? 0);
    if (rec.entry_type === "expense") return Number(rec.expense_amount ?? 0);
    return 0;
  };

  const heroLabel = () => {
    if (!rec || !kind) return "Amount";
    if (kind === "transaction") return rec.type === "cash_in" ? "Cash In" : "Cash Out";
    if (kind === "warehouse_entry") return "Amount";
    if (rec.entry_type === "sale") return "Total Sale";
    if (rec.entry_type === "purchase") return "Purchase Amount";
    if (rec.entry_type === "withdraw") return "Withdraw Amount";
    return "Amount";
  };

  const handleEdit = () => {
    if (!rec || !kind) return;
    onOpenChange(false);
    if (kind === "shop_entry") navigate({ to: "/shop", search: { edit: rec.id } as any });
    else if (kind === "warehouse_entry") navigate({ to: "/summary" as any });
    else navigate({ to: "/summary" as any });
  };

  const handleDelete = async () => {
    if (!rec || !kind) return;
    if (!(await confirm({ title: "Move entry to Recycle Bin?", description: "All linked balances and ledgers will be reversed. You can recover this from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    setDeleting(true);
    const table = (kind === "transaction" ? "transactions" : kind === "shop_entry" ? "shop_entries" : "warehouse_ledger") as any;
    const { error } = await softDelete(table, rec.id);
    setDeleting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Moved to Recycle Bin");
    qc.invalidateQueries({ queryKey: ["txns"] });
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["wh_ledger"] });
    qc.invalidateQueries({ queryKey: ["drill"] });
    qc.invalidateQueries({ queryKey: ["record-detail"] });
    onOpenChange(false);
  };

  const handleShare = async () => {
    if (!rec) return;
    const rows: ShareRow[] = [];
    rows.push({ label: "Date", value: rec.txn_date });
    if (kind === "shop_entry") {
      if (rec.shops?.name) rows.push({ label: "Shop", value: rec.shops.name });
      if (rec.cashiers?.name) rows.push({ label: "Cashier", value: rec.cashiers.name });
      if (rec.entry_type === "sale") {
        rows.push({ label: "POS Sale", value: SAR(rec.pos_sale) });
        rows.push({ label: "Total Sale", value: SAR(totalSale) });
        rows.push({ label: "Cash Sale", value: SAR(rec.cash_sale) });
        rows.push({ label: "Bank Sale", value: SAR(rec.bank_sale) });
        rows.push({ label: "Credit Sale", value: SAR(rec.credit_sale) });
        rows.push({ label: "Plus / Minus", value: SAR(rec.difference) });
      }
    } else if (kind === "transaction") {
      rows.push({ label: "Type", value: TXN_LABELS[rec.type] ?? rec.type });
      rows.push({ label: "Amount", value: SAR(rec.amount) });
      if (rec.category) rows.push({ label: "Category", value: rec.category });
      if (rec.subcategory) rows.push({ label: "Sub-category", value: rec.subcategory });
      if (rec.shops?.name) rows.push({ label: "Shop", value: rec.shops.name });
      if (rec.payment_method) rows.push({ label: "Payment", value: rec.payment_method });
    } else {
      rows.push({ label: "Party", value: rec.party_name });
      rows.push({ label: "Type", value: rec.entry_type });
      rows.push({ label: "Status", value: rec.payment_status });
      rows.push({ label: "Amount", value: SAR(rec.amount) });
      rows.push({ label: "Paid", value: SAR(rec.paid_amount) });
      rows.push({ label: "Remaining Due", value: SAR(rec.remaining_due) });
    }
    const accent: "in" | "out" | "neutral" =
      kind === "transaction"
        ? rec.type === "cash_in"
          ? "in"
          : rec.type === "cash_out" || rec.type === "purchase"
            ? "out"
            : "neutral"
        : kind === "shop_entry"
          ? rec.entry_type === "sale"
            ? "in"
            : "out"
          : rec.entry_type === "warehouse_sale" || rec.entry_type === "payment_received"
            ? "in"
            : "out";
    const captionParts: string[] = [headline()];
    if (kind === "shop_entry") {
      if (rec.shops?.name) captionParts.push(`Shop: ${rec.shops.name}`);
      if (rec.cashiers?.name) captionParts.push(`Cashier: ${rec.cashiers.name}`);
    } else if (kind === "warehouse_entry" && rec.party_name) {
      captionParts.push(`Party: ${rec.party_name}`);
    } else if (kind === "transaction" && rec.shops?.name) {
      captionParts.push(`Shop: ${rec.shops.name}`);
    }
    if (rec.txn_date) captionParts.push(`Date: ${rec.txn_date}`);
    captionParts.push(`Amount: ${SAR(heroAmount())}`);
    await shareToWhatsApp({
      title: headline(),
      subtitle:
        kind === "shop_entry"
          ? [rec.shops?.name, rec.cashiers?.name].filter(Boolean).join(" · ") || undefined
          : kind === "warehouse_entry"
            ? rec.party_name
            : rec.shops?.name || rec.category || undefined,
      amount: SAR(heroAmount()),
      amountLabel: heroLabel(),
      date: rec.txn_date,
      rows,
      notes: rec.notes,
      badge: kind === "transaction" ? (TXN_LABELS[rec.type] ?? rec.type) : undefined,
      accent,
      caption: captionParts.join(" · "),
    });
  };


  const handlePDF = () => {
    if (!rec) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml: string[] = [];
    const push = (l: string, v: string) =>
      rowsHtml.push(`<tr><td class="l">${esc(l)}</td><td class="v">${esc(v)}</td></tr>`);
    push("Date", rec.txn_date);
    if (kind === "shop_entry") {
      push("Shop", rec.shops?.name ?? "—");
      if (rec.cashiers?.name) push("Cashier", rec.cashiers.name);
      if (rec.entry_type === "sale") {
        push("POS Sale", SAR(rec.pos_sale));
        push("Total Sale", SAR(totalSale));
        push("Cash Sale", SAR(rec.cash_sale));
        push("Bank Sale", SAR(rec.bank_sale));
        push("Credit Sale", SAR(rec.credit_sale));
        push("Plus / Minus", SAR(rec.difference));
      } else {
        push("Amount", SAR(heroAmount()));
      }
    } else if (kind === "transaction") {
      push("Type", TXN_LABELS[rec.type] ?? rec.type);
      push("Amount", SAR(rec.amount));
      if (rec.category) push("Category", rec.category);
      if (rec.subcategory) push("Sub-category", rec.subcategory);
      if (rec.shops?.name) push("Shop", rec.shops.name);
      if (rec.payment_method) push("Payment", rec.payment_method);
    } else {
      push("Party", rec.party_name);
      push("Type", rec.entry_type);
      push("Status", rec.payment_status);
      push("Amount", SAR(rec.amount));
      push("Paid", SAR(rec.paid_amount));
      push("Remaining Due", SAR(rec.remaining_due));
    }
    if (rec.notes) push("Notes", rec.notes);
    w.document.write(`<!doctype html><html><head><title>${esc(headline())}</title>
      <style>
        body{font-family:Inter,system-ui,Arial,sans-serif;padding:32px;color:#0f172a}
        h1{margin:0 0 4px;font-size:22px}
        .meta{color:#64748b;font-size:12px;margin-bottom:18px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        td{padding:9px 12px;border-bottom:1px solid #e2e8f0}
        td.l{color:#64748b;width:40%;text-transform:uppercase;font-size:10px;letter-spacing:.08em}
        td.v{text-align:right;font-weight:600}
      </style></head><body>
      <h1>${esc(headline())}</h1>
      <p class="meta">${esc(SAR(heroAmount()))} · Generated ${new Date().toLocaleString()}</p>
      <table>${rowsHtml.join("")}</table>
      <script>window.onload=()=>setTimeout(()=>window.print(),250)</script>
      </body></html>`);
    w.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">{headline()}</DialogTitle>
          {rec?.ocr_scan_id && (
            <Badge variant="secondary" className="mt-1 w-fit gap-1 px-1.5 py-0.5 text-[10px]">
              <Sparkles className="h-3 w-3" /> OCR linked
            </Badge>
          )}
        </DialogHeader>

        {isLoading || !rec ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                {heroLabel()}
              </p>
              <div className="mt-1"><SARAmount value={heroAmount()} size="2xl" whole={false} /></div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{rec.txn_date}</span>
                {kind === "shop_entry" && rec.shops?.name && (
                  <span className="flex items-center gap-1"><Store className="h-3 w-3" />{rec.shops.name}</span>
                )}
                {kind === "shop_entry" && rec.cashiers?.name && (
                  <span className="flex items-center gap-1"><User2 className="h-3 w-3" />{rec.cashiers.name}</span>
                )}
                {kind === "transaction" && rec.shops?.name && (
                  <span className="flex items-center gap-1"><Store className="h-3 w-3" />{rec.shops.name}</span>
                )}
                {kind === "warehouse_entry" && (
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{rec.party_name}</span>
                )}
              </div>
            </div>

            <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {kind === "shop_entry" && rec.entry_type === "sale" && (
                <>
                  <Row label="POS Sale"><SARAmount value={rec.pos_sale} size="sm" /></Row>
                  <Row label="Total Sale" highlight><SARAmount value={totalSale} size="sm" /></Row>
                  <Row label="Cash Sale"><SARAmount value={rec.cash_sale} size="sm" /></Row>
                  <Row label="Bank Sale"><SARAmount value={rec.bank_sale} size="sm" /></Row>
                  <Row label="Credit Sale"><SARAmount value={rec.credit_sale} size="sm" /></Row>
                  <Row label="Plus / Minus">
                    <span className={cn(Number(rec.difference) < 0 ? "text-destructive" : "text-success")}>
                      <SARAmount value={rec.difference} size="sm" />
                    </span>
                  </Row>
                </>
              )}
              {kind === "shop_entry" && rec.entry_type === "purchase" && (
                <Row label="Purchase Amount"><SARAmount value={rec.purchase_amount} size="sm" /></Row>
              )}
              {kind === "shop_entry" && rec.entry_type === "withdraw" && (
                <Row label="Withdraw Amount"><SARAmount value={rec.withdraw_amount} size="sm" /></Row>
              )}
              {kind === "shop_entry" && rec.entry_type === "expense" && (
                <Row label="Expense Amount"><SARAmount value={rec.expense_amount} size="sm" /></Row>
              )}

              {kind === "transaction" && (
                <>
                  <Row label="Type">
                    <span className={cn(rec.type === "cash_in" ? "text-success" : "text-destructive")}>
                      {TXN_LABELS[rec.type] ?? rec.type}
                    </span>
                  </Row>
                  <Row label="Amount" highlight><SARAmount value={rec.amount} size="sm" /></Row>
                  {rec.category && <Row label="Category"><span className="inline-flex items-center gap-1"><Tag className="h-3 w-3 text-muted-foreground" />{rec.category}</span></Row>}
                  {rec.subcategory && <Row label="Sub-category"><span className="inline-flex items-center gap-1"><Layers className="h-3 w-3 text-muted-foreground" />{rec.subcategory}</span></Row>}
                  {rec.payment_method && <Row label="Payment"><span className="inline-flex items-center gap-1"><Wallet className="h-3 w-3 text-muted-foreground" />{rec.payment_method}</span></Row>}
                  {rec.cashier && <Row label="Cashier">{rec.cashier}</Row>}
                  {rec.source && <Row label="Source"><Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{rec.source}</Badge></Row>}
                </>
              )}

              {kind === "warehouse_entry" && (
                <>
                  <Row label="Party">{rec.party_name}</Row>
                  <Row label="Type">{rec.entry_type}</Row>
                  <Row label="Status"><Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{rec.payment_status}</Badge></Row>
                  <Row label="Amount" highlight><SARAmount value={rec.amount} size="sm" /></Row>
                  <Row label="Paid"><SARAmount value={rec.paid_amount} size="sm" /></Row>
                  <Row label="Remaining Due">
                    <span className="text-destructive"><SARAmount value={rec.remaining_due} size="sm" /></span>
                  </Row>
                </>
              )}
            </dl>

            {rec.notes && (
              <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3 w-3" /> Notes
                </p>
                <p className="whitespace-pre-wrap text-sm">{rec.notes}</p>
              </div>
            )}

            {rec.attachment_url && (
              <RecAttachmentBlock
                url={rec.attachment_url}
                isImage={!!isImage}
                onOpenLightbox={(u) => setLightbox(u)}
              />
            )}


            {rec.ocr_scan_id && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate({ to: "/summary", search: { scan: rec.ocr_scan_id } as any });
                }}
              >
                <ScanLine className="mr-1.5 h-3.5 w-3.5" /> View OCR Details
              </Button>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handlePDF}>
                <FileDown className="mr-1.5 h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-success/40 text-success hover:bg-success/10"
                onClick={handleShare}
              >
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
              </Button>

            </div>
          </div>
        )}

        <div className="flex gap-2 border-t border-border bg-muted/20 px-5 py-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleEdit} disabled={!rec}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete} disabled={!rec || deleting}>
            {deleting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
        <AttachmentLightbox open={!!lightbox} url={lightbox} onClose={() => setLightbox(null)} />
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-2.5", highlight && "bg-primary/5")}>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

function RecAttachmentBlock({
  url,
  isImage,
  onOpenLightbox,
}: {
  url: string;
  isImage: boolean;
  onOpenLightbox: (signedUrl: string) => void;
}) {
  const signed = useSignedAttachmentUrl(url);
  if (!signed) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Paperclip className="h-3 w-3" /> Attachment
      </p>
      {isImage ? (
        <button
          type="button"
          onClick={() => onOpenLightbox(signed)}
          className="block w-full overflow-hidden rounded-xl border border-border transition-all hover:border-primary/40"
        >
          <img loading="lazy" decoding="async" src={signed} alt="Attachment" className="max-h-64 w-full object-contain bg-muted/30" />
        </button>
      ) : (
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={signed} target="_blank" rel="noreferrer">
            <Paperclip className="mr-1.5 h-3.5 w-3.5" /> View Attachment
          </a>
        </Button>
      )}
    </div>
  );
}

