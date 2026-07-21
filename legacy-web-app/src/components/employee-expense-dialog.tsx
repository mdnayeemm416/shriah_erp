import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Camera, Image as ImageIcon, X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";
import { compressImage } from "@/lib/image-upload";
import { cn } from "@/lib/utils";
import { sendAuditEmail } from "@/lib/audit-email";
import type { WalletKind, WalletRow } from "@/lib/employee-wallet";

// Keep the old exported name so existing imports keep working.
export type EmployeeExpenseRow = WalletRow;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employeeId: string;
  expense?: WalletRow | null;
  initialKind?: WalletKind;
  /** If the current user has admin/manager rights, deposits skip pending state. */
  isAdmin?: boolean;
};

export function EmployeeExpenseDialog({
  open, onOpenChange, employeeId, expense, initialKind = "expense", isAdmin = false,
}: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!expense;

  const [kind, setKind] = useState<WalletKind>(initialKind);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [keepUrl, setKeepUrl] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["employee-expense-categories", "active"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("employee_expense_categories")
        .select("id, name, is_active")
        .eq("is_active", true)
        .order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  useEffect(() => {
    if (open) {
      setKind(expense?.kind ?? initialKind);
      setAmount(expense ? String(expense.amount) : "");
      setCategory(expense?.category ?? "");
      setNote(expense?.note ?? "");
      setDate(expense?.txn_date ?? new Date().toISOString().slice(0, 10));
      setFile(null);
      setPreviewUrl(null);
      setKeepUrl(expense?.attachment_url ?? null);
    }
  }, [open, expense, initialKind]);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (open && !editing && kind === "expense" && !category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [open, editing, kind, category, categories]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const amt = parseFloat(amount || "0");
      if (!amt || amt <= 0) throw new Error("Enter a valid amount");
      if (kind === "expense" && !category) throw new Error("Select a category");
      if (!file && !keepUrl) throw new Error("Receipt photo is required");

      let url = keepUrl;
      if (file) {
        if (!file.type.startsWith("image/")) throw new Error("Only images are allowed");
        const blob = await compressImage(file);
        const path = `${user.id}/employee-expenses/${Date.now()}.jpg`;
        const up = await supabase.storage.from("attachments").upload(path, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }

      // Deposits made by non-admin employees are pending; admin-created rows are verified.
      const status = kind === "deposit" && !isAdmin ? "pending" : "verified";

      const payload: any = {
        employee_id: employeeId,
        kind,
        status,
        amount: amt,
        category: kind === "expense" ? category : null,
        note: note.trim(),
        txn_date: date,
        attachment_url: url,
      };
      const oldValues = editing && expense ? {
        kind: expense.kind, amount: expense.amount, category: expense.category,
        note: expense.note, txn_date: expense.txn_date, attachment_url: expense.attachment_url,
      } : null;
      if (editing && expense) {
        const { error } = await (supabase as any).from("employee_expenses").update(payload).eq("id", expense.id);
        if (error) throw error;
        sendAuditEmail({
          action: "edited", module: "Employee Wallet",
          recordId: expense.id, amount: amt, notes: note.trim(),
          oldValues, newValues: payload,
        });
      } else {
        const { data: ins, error } = await (supabase as any).from("employee_expenses").insert({
          ...payload, created_by: user.id, user_id: user.id,
        }).select("id").single();
        if (error) throw error;
        sendAuditEmail({
          action: "created", module: "Employee Wallet",
          recordId: ins?.id ?? null, amount: amt, notes: note.trim(),
          newValues: payload,
        });
      }
      return { kind, status };
    },
    onSuccess: (r) => {
      toast.success(
        editing
          ? "Wallet entry updated"
          : r.status === "pending"
            ? "Deposit submitted — pending admin verification"
            : r.kind === "deposit"
              ? "Deposit saved"
              : "Expense saved",
      );
      qc.invalidateQueries({ queryKey: ["employee-expenses"] });
      qc.invalidateQueries({ queryKey: ["employee-wallet"] });
      qc.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit wallet entry" : kind === "deposit" ? "New deposit" : "New expense"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {!editing && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKind("expense")}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition-colors",
                  kind === "expense"
                    ? "border-destructive/60 bg-destructive/5 text-destructive"
                    : "border-border/60 text-muted-foreground",
                )}
              >
                <ArrowUpCircle className="h-5 w-5" />
                Expense
              </button>
              <button
                type="button"
                onClick={() => setKind("deposit")}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition-colors",
                  kind === "deposit"
                    ? "border-success/60 bg-success/5 text-success"
                    : "border-border/60 text-muted-foreground",
                )}
              >
                <ArrowDownCircle className="h-5 w-5" />
                Deposit
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Amount (SAR) *</Label>
            <Input
              type="number" inputMode="decimal" min={0} step="0.01"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg font-semibold tabular-nums"
            />
          </div>

          {kind === "expense" && (
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      No active categories. Ask admin to add some in Settings.
                    </div>
                  ) : categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Note <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              maxLength={500} rows={2}
              placeholder={kind === "deposit" ? "Who gave you this money and why?" : "What was this expense for?"}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Receipt photo * <span className="text-muted-foreground font-normal">(camera or gallery only)</span></Label>

            {(previewUrl || keepUrl) && (
              <div className="relative inline-block">
                <img
                  src={previewUrl ?? keepUrl!}
                  alt="Receipt"
                  className="max-h-40 rounded-lg border border-border/60"
                />
                <button
                  type="button"
                  onClick={() => { setFile(null); setKeepUrl(null); }}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()}>
                <Camera className="h-4 w-4" /> Camera
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => galleryRef.current?.click()}>
                <ImageIcon className="h-4 w-4" /> Gallery
              </Button>
              <input
                ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <input
                ref={galleryRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {kind === "deposit" && !isAdmin && !editing && (
            <div className="rounded-lg border border-warning/40 bg-warning/5 p-2 text-[11px] text-warning-foreground">
              This deposit will be marked <b>Pending Verification</b> until an admin confirms it.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : editing ? "Save changes" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
