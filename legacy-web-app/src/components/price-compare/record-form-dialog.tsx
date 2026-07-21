// Price record form dialog for Price Compare — Add/Edit record.
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";
import { uploadProductImage } from "@/lib/image-upload";
import {
  createRecord, updateRecord, type PCRecord, type PCRecordInput,
} from "@/lib/price-compare/queries";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  productId: string;
  record?: PCRecord | null;
  onSaved: (r: PCRecord) => void;
};

function todayIso() { return new Date().toISOString().slice(0, 10); }

const emptyFor = (productId: string): PCRecordInput => ({
  product_id: productId,
  record_date: todayIso(),
  market_name: null, supplier_name: null,
  purchase_price: 0, selling_price: null, offer_price: null,
  notes: null, image_url: null,
});

export function RecordFormDialog({ open, onOpenChange, productId, record, onSaved }: Props) {
  const [form, setForm] = useState<PCRecordInput>(emptyFor(productId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (record) {
      const { id: _id, created_at: _c, ...rest } = record;
      setForm(rest);
    } else setForm(emptyFor(productId));
  }, [open, record, productId]);

  function set<K extends keyof PCRecordInput>(k: K, v: PCRecordInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onFile(f: File | null) {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(f);
      set("image_url", url);
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally { setUploading(false); }
  }

  async function submit() {
    if (!form.record_date) { toast.error("Date is required"); return; }
    if (!(Number(form.purchase_price) > 0)) { toast.error("Purchase price is required"); return; }
    setSaving(true);
    try {
      const payload: PCRecordInput = {
        product_id: productId,
        record_date: form.record_date,
        market_name: form.market_name?.toString().trim() || null,
        supplier_name: form.supplier_name?.toString().trim() || null,
        purchase_price: Number(form.purchase_price) || 0,
        selling_price: form.selling_price != null && form.selling_price !== ("" as any)
          ? Number(form.selling_price) : null,
        offer_price: form.offer_price != null && form.offer_price !== ("" as any)
          ? Number(form.offer_price) : null,
        notes: form.notes?.toString().trim() || null,
        image_url: form.image_url || null,
      };
      const saved = record
        ? await updateRecord(record.id, payload)
        : await createRecord(payload);
      onSaved(saved);
      onOpenChange(false);
      toast.success(record ? "Record updated" : "Record added");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Price Record" : "Add Price Record"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date *">
              <Input type="date" value={form.record_date}
                onChange={(e) => set("record_date", e.target.value)} />
            </Field>
            <Field label="Market / Shop">
              <Input value={form.market_name ?? ""} onChange={(e) => set("market_name", e.target.value)} />
            </Field>
          </div>
          <Field label="Supplier">
            <Input value={form.supplier_name ?? ""} onChange={(e) => set("supplier_name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Purchase *">
              <Input type="number" inputMode="decimal" step="0.01"
                value={form.purchase_price || ""}
                onChange={(e) => set("purchase_price", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Selling">
              <Input type="number" inputMode="decimal" step="0.01"
                value={form.selling_price ?? ""}
                onChange={(e) => set("selling_price", e.target.value === "" ? null : Number(e.target.value))} />
            </Field>
            <Field label="Offer">
              <Input type="number" inputMode="decimal" step="0.01"
                value={form.offer_price ?? ""}
                onChange={(e) => set("offer_price", e.target.value === "" ? null : Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea rows={2} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          </Field>
          <Field label="Product Photo">
            {form.image_url ? (
              <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => set("image_url", null)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed h-20 cursor-pointer hover:bg-accent/40">
                <Camera className="h-4 w-4" />
                <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
              </label>
            )}
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving || uploading}>
            {saving ? "Saving…" : record ? "Update" : "Add Record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
