import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { EditHistoryButton } from "@/components/edit-history";
import { useSignedAttachmentUrl } from "@/lib/attachment-url";
import { AttachmentLightbox } from "@/components/attachment-lightbox";
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { SAR } from "@/lib/format";
import {
  ArrowDownCircle, ArrowUpCircle, CalendarDays, FileText, Paperclip,
  Pencil, Share2, Trash2, User2, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntryRow } from "@/components/employee-entry-dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry: (EntryRow & { created_at?: string; created_by?: string | null }) | null;
  employeeName: string;
  createdByName?: string | null;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
};

export function EmployeeEntryDetailDialog({
  open, onOpenChange, entry, employeeName, createdByName,
  isAdmin, onEdit, onDelete, onShare,
}: Props) {
  const url = useSignedAttachmentUrl(entry?.attachment_url ?? null);
  const [zoom, setZoom] = useState(false);

  if (!entry) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Entry</DialogTitle></DialogHeader>
          <p className="py-6 text-center text-sm text-muted-foreground">Entry not available.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const isGiven = entry.entry_type === "given";
  const isImage = entry.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(entry.attachment_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isGiven ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
            )}>
              {isGiven ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
            </div>
            <span>{isGiven ? "Money Given" : "Money Received"}</span>
            <Badge variant="outline" className="ml-auto text-[10px]">{employeeName}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</p>
            <SARAmount
              value={Number(entry.amount)}
              size="3xl"
              whole={false}
              className={cn("mt-1", isGiven ? "text-destructive" : "text-success")}

            />
          </div>

          <div className="space-y-2 rounded-xl border border-border/40 p-3 text-xs">
            <Row icon={<CalendarDays className="h-3.5 w-3.5" />} label="Date">
              {new Date(entry.txn_date).toLocaleDateString()}
            </Row>
            {entry.notes && (
              <Row icon={<FileText className="h-3.5 w-3.5" />} label="Notes">
                <span className="whitespace-pre-wrap">{entry.notes}</span>
              </Row>
            )}
            {createdByName && (
              <Row icon={<User2 className="h-3.5 w-3.5" />} label="Created by">
                {createdByName}
              </Row>
            )}
          </div>

          {entry.attachment_url && (
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Paperclip className="h-3 w-3" /> Attachment
              </p>
              {isImage && url ? (
                <button
                  type="button"
                  onClick={() => setZoom(true)}
                  className="block w-full overflow-hidden rounded-xl border border-border/60"
                >
                  <img loading="lazy" decoding="async" src={url} alt="attachment" className="h-40 w-full object-cover" />
                </button>
              ) : url ? (
                <a href={url} target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-1.5 text-xs text-primary underline">
                  Open attachment
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">Loading…</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={onShare}>
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-success/40 text-success hover:bg-success/10"
              onClick={async () => {
                await shareToWhatsApp({
                  title: isGiven ? "Money Given" : "Money Received",
                  subtitle: employeeName,
                  amount: SAR(Number(entry.amount)),
                  amountLabel: isGiven ? "Given" : "Received",
                  date: new Date(entry.txn_date).toLocaleDateString(),
                  rows: [
                    { label: "Employee", value: employeeName },
                    { label: "Type", value: isGiven ? "Given" : "Received" },
                    { label: "Amount", value: SAR(Number(entry.amount)) },
                  ],
                  notes: entry.notes,
                  badge: isGiven ? "OUT" : "IN",
                  accent: isGiven ? "out" : "in",
                  caption: `${isGiven ? "Money Given" : "Money Received"} · Employee: ${employeeName} · Date: ${new Date(entry.txn_date).toLocaleDateString()} · Amount: ${SAR(Number(entry.amount))}`,
                });
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </Button>
            <EditHistoryButton entityType="employee_entries" entityId={entry.id} label="History" variant="outline" />
            {isAdmin && (
              <>
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <AttachmentLightbox open={zoom} url={url} onClose={() => setZoom(false)} />
      </DialogContent>
    </Dialog>
  );
}


function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}
