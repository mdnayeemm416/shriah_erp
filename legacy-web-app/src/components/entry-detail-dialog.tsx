import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { softDelete } from "@/lib/soft-delete";
import { toast } from "sonner";
import {
  Pencil, Trash2, Paperclip, Sparkles, ScanLine, CalendarDays,
  Store, User2, FileText, Loader2, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignedAttachmentUrl } from "@/lib/attachment-url";
import { AttachmentLightbox } from "@/components/attachment-lightbox";
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { SAR } from "@/lib/format";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entryId: string | null;
  kind: "cash_sale" | "bank_sale" | "pos_sale" | "credit_sale" | "bank_withdraw" | "purchase" | "cash_in" | "expense" | null;
};

export function EntryDetailDialog({ open, onOpenChange, entryId, kind }: Props) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: entry, isLoading } = useQuery<any | null>({
    queryKey: ["entry-detail", entryId],
    enabled: !!entryId && open,
    queryFn: async () => {
      if (!entryId) return null;
      const { data } = await supabase
        .from("shop_entries")
        .select("*, shops(name), cashiers(name)")
        .eq("id", entryId)
        .maybeSingle();
      return data;
    },
  });

  const totalSale = useMemo(() => {
    if (!entry) return 0;
    return Number(entry.cash_sale ?? 0) + Number(entry.bank_sale ?? 0) + Number(entry.credit_sale ?? 0);
  }, [entry]);

  const handleEdit = () => {
    if (!entry) return;
    onOpenChange(false);
    navigate({ to: "/shop", search: { edit: entry.id } as any });
  };

  const handleDelete = async () => {
    if (!entry) return;
    if (!(await confirm({ title: "Move entry to Recycle Bin?", description: "Linked stock and ledger effects will be reversed. You can restore this entry from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    setDeleting(true);
    const { error } = await softDelete("shop_entries", entry.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin");
    qc.invalidateQueries({ queryKey: ["drill"] });
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["txns"] });
    qc.invalidateQueries({ queryKey: ["trash"] });
    onOpenChange(false);
  };

  const isPurchase = kind === "purchase" || entry?.entry_type === "purchase";
  const isWithdraw = kind === "bank_withdraw" || entry?.entry_type === "withdraw";
  const isExpense = kind === "expense" || entry?.entry_type === "expense";
  const isSale = !isPurchase && !isWithdraw && !isExpense;
  const isImage = entry?.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(entry.attachment_url);

  const handleShare = async () => {
    if (!entry) return;
    const title = isSale ? "Sale Entry" : isPurchase ? "Purchase Entry" : isExpense ? "Expense Entry" : "Withdraw Entry";
    const amount = isSale
      ? totalSale
      : isPurchase
        ? Number(entry.purchase_amount ?? 0)
        : isExpense
          ? Number(entry.expense_amount ?? 0)
          : Number(entry.withdraw_amount ?? 0);
    const rows = [{ label: "Date", value: entry.txn_date as string }];
    if (entry.shops?.name) rows.push({ label: "Shop", value: entry.shops.name });
    if (entry.cashiers?.name) rows.push({ label: "Cashier", value: entry.cashiers.name });
    if (isSale) {
      rows.push({ label: "POS Sale", value: SAR(entry.pos_sale) });
      rows.push({ label: "Total Sale", value: SAR(totalSale) });
      rows.push({ label: "Cash Sale", value: SAR(entry.cash_sale) });
      rows.push({ label: "Bank Sale", value: SAR(entry.bank_sale) });
      rows.push({ label: "Credit Sale", value: SAR(entry.credit_sale) });
      rows.push({ label: "Plus / Minus", value: SAR(entry.difference) });
    } else {
      rows.push({ label: "Amount", value: SAR(amount) });
    }
    const captionParts: string[] = [title];
    if (entry.shops?.name) captionParts.push(`Shop: ${entry.shops.name}`);
    if (entry.cashiers?.name) captionParts.push(`Cashier: ${entry.cashiers.name}`);
    if (entry.txn_date) captionParts.push(`Date: ${entry.txn_date}`);
    captionParts.push(`Amount: ${SAR(amount)}`);
    await shareToWhatsApp({
      title,
      subtitle: [entry.shops?.name, entry.cashiers?.name].filter(Boolean).join(" · ") || undefined,
      amount: SAR(amount),
      amountLabel: isSale ? "Total Sale" : isPurchase ? "Purchase Amount" : isExpense ? "Expense Amount" : "Withdraw Amount",
      date: entry.txn_date,
      rows,
      notes: entry.notes,
      accent: isSale ? "in" : "out",
      caption: captionParts.join(" · "),
    });
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">
            {isSale ? "Sale Entry" : isPurchase ? "Purchase Entry" : isExpense ? "Expense Entry" : "Withdraw Entry"}
          </DialogTitle>
          {entry?.ocr_scan_id && (
            <Badge variant="secondary" className="mt-1 w-fit gap-1 px-1.5 py-0.5 text-[10px]">
              <Sparkles className="h-3 w-3" /> OCR linked
            </Badge>
          )}
        </DialogHeader>

        {isLoading || !entry ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
            {/* Top summary */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                {isSale ? "Total Sale" : isPurchase ? "Purchase Amount" : isExpense ? "Expense Amount" : "Withdraw Amount"}
              </p>
              <div className="mt-1">
                <SARAmount
                  value={isSale ? totalSale : isPurchase ? Number(entry.purchase_amount ?? 0) : isExpense ? Number(entry.expense_amount ?? 0) : Number(entry.withdraw_amount ?? 0)}
                  size="2xl"
                  whole={false}

                />
              </div>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{entry.txn_date}</span>
                {entry.shops?.name && <span className="flex items-center gap-1"><Store className="h-3 w-3" />{entry.shops.name}</span>}
                {entry.cashiers?.name && <span className="flex items-center gap-1"><User2 className="h-3 w-3" />{entry.cashiers.name}</span>}
              </div>
            </div>

            {/* Field grid */}
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {isSale && (
                <>
                  <Row label="Cash Sale"><SARAmount value={entry.cash_sale} size="sm" /></Row>
                  <Row label="Bank Sale"><SARAmount value={entry.bank_sale} size="sm" /></Row>
                  <Row label="Credit Sale"><SARAmount value={entry.credit_sale} size="sm" /></Row>
                  <Row label="Total Sale" highlight><SARAmount value={totalSale} size="sm" /></Row>
                  <Row label="POS Sale"><SARAmount value={entry.pos_sale} size="sm" /></Row>
                  <Row label="Plus / Minus">
                    <span className={cn(Number(entry.difference) < 0 ? "text-destructive" : "text-success")}>
                      <SARAmount value={entry.difference} size="sm" />
                    </span>
                  </Row>
                </>
              )}
              {isPurchase && (
                <Row label="Purchase Amount"><SARAmount value={entry.purchase_amount} size="sm" /></Row>
              )}
              {isWithdraw && (
                <Row label="Withdraw Amount"><SARAmount value={entry.withdraw_amount} size="sm" /></Row>
              )}
              {isExpense && (
                <Row label="Expense Amount"><SARAmount value={entry.expense_amount} size="sm" /></Row>
              )}
            </dl>

            {entry.notes && (
              <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3 w-3" /> Notes
                </p>
                <p className="whitespace-pre-wrap text-sm">{entry.notes}</p>
              </div>
            )}

            {entry.attachment_url && (
              <AttachmentBlock url={entry.attachment_url} isImage={!!isImage} onOpenLightbox={(u) => setLightbox(u)} />
            )}

            {entry.ocr_scan_id && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  onOpenChange(false);
                  navigate({ to: "/summary", search: { scan: entry.ocr_scan_id } as any });
                }}
              >
                <ScanLine className="mr-1.5 h-3.5 w-3.5" /> View OCR Details
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-success/40 text-success hover:bg-success/10"
              onClick={handleShare}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Share via WhatsApp
            </Button>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-2 border-t border-border bg-muted/20 px-5 py-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleEdit} disabled={!entry}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete} disabled={!entry || deleting}>
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

function AttachmentBlock({ url, isImage, onOpenLightbox }: { url: string; isImage: boolean; onOpenLightbox: (u: string) => void }) {
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

