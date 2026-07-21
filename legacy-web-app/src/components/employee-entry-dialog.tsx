import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Paperclip, ArrowDownCircle, ArrowUpCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWorkingDate } from "@/hooks/use-working-date";
import { sendAuditEmail } from "@/lib/audit-email";

type EntryType = "given" | "received";
export type EntryRow = {
  id: string;
  employee_id: string;
  entry_type: EntryType;
  amount: number;
  txn_date: string;
  notes: string | null;
  attachment_url: string | null;
};

export function EmployeeEntryDialog({
  open, onOpenChange, employeeId, initialType = "given", entry,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employeeId: string;
  initialType?: EntryType;
  entry?: EntryRow | null;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!entry;
  const { workingDate } = useWorkingDate();

  const [type, setType] = useState<EntryType>(initialType);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(workingDate);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [keepUrl, setKeepUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setType(entry?.entry_type ?? initialType);
      setAmount(entry ? String(entry.amount) : "");
      setDate(entry?.txn_date ?? workingDate);
      setNotes(entry?.notes ?? "");
      setFile(null);
      setKeepUrl(entry?.attachment_url ?? null);
    }
  }, [open, entry, initialType, workingDate]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      let url = keepUrl;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/employees/entries/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const payload = {
        employee_id: employeeId,
        entry_type: type,
        amount: amt,
        txn_date: date,
        notes: notes.trim() || null,
        attachment_url: url,
      };
      if (editing && entry) {
        const { error } = await (supabase as any).from("employee_entries").update(payload).eq("id", entry.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("employee_entries").insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Entry updated" : "Entry saved");
      qc.invalidateQueries({ queryKey: ["employee-entries"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      try {
        sendAuditEmail({
          action: editing ? "edited" : "created",
          module: "Employee Transaction",
          userName: user?.email || null,
          recordId: entry?.id ?? null,
          oldValues: editing ? entry : null,
          newValues: {
            employee_id: employeeId, entry_type: type, amount: parseFloat(amount || "0"),
            txn_date: date, notes: notes.trim() || null,
          },
          notes: notes.trim() || null,
          amount: parseFloat(amount || "0"),
        });
      } catch (e) { /* noop */ }
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to save entry"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit entry" : "New entry"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <TypePill
              active={type === "given"}
              onClick={() => setType("given")}
              icon={<ArrowUpCircle className="h-4 w-4" />}
              label="Money Given"
              tone="destructive"
            />
            <TypePill
              active={type === "received"}
              onClick={() => setType("received")}
              icon={<ArrowDownCircle className="h-4 w-4" />}
              label="Money Received"
              tone="success"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Amount (SAR) *</Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg font-semibold tabular-nums"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} />
          </div>

          <div className="space-y-1.5">
            <Label>Attachment</Label>
            {keepUrl && !file && (
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-xs">
                <span className="truncate">Existing attachment</span>
                <button onClick={() => setKeepUrl(null)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50">
              <Paperclip className="h-3.5 w-3.5" />
              {file ? file.name : "Choose file"}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : editing ? "Save changes" : "Save entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TypePill({
  active, onClick, icon, label, tone,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "destructive" | "success";
}) {
  const activeCls =
    tone === "destructive"
      ? "border-destructive bg-destructive/10 text-destructive"
      : "border-success bg-success/10 text-success";
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all tap",
        active ? activeCls : "border-border/60 text-muted-foreground hover:border-primary/40",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
