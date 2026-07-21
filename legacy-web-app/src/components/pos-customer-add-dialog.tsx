import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { UserPlus } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (id: string) => void;
};

const empty = {
  name: "", phone: "", address: "", notes: "", vat_number: "",
  opening_due: "0",
};

export function PosCustomerAddDialog({ open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const [f, setF] = useState({ ...empty });

  useEffect(() => { if (open) setF({ ...empty }); }, [open]);

  const save = useMutation({
    mutationFn: async () => {
      const name = f.name.trim();
      if (!name) throw new Error("Customer name required");
      const payload = {
        name,
        phone: f.phone.trim() || null,
        address: f.address.trim() || null,
        notes: f.notes.trim() || null,
        vat_number: f.vat_number.trim() || null,
        opening_due: Number(f.opening_due) || 0,
      };
      const { data, error } = await supabase.from("pos_customers").insert(payload as any).select("id").single();
      if (error) throw error;
      return data!.id as string;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["pos-customers"] });
      qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
      qc.invalidateQueries({ queryKey: ["pos-due-map"] });
      toast.success("Customer added");
      onCreated?.(id);
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> Add customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Field label="Customer name *">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name" autoFocus />
          </Field>
          <Field label="Mobile">
            <Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" placeholder="05xxxxxxxx" />
          </Field>
          <Field label="Address">
            <Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Optional" />
          </Field>
          <Field label="Tax / VAT number" hint="Used on B2B invoices (ZATCA)">
            <Input value={f.vat_number} onChange={(e) => setF({ ...f, vat_number: e.target.value })} placeholder="Optional" />
          </Field>
          <Field label="Opening balance (SAR)" hint="Previous due owed by customer">
            <Input type="number" inputMode="decimal" step="0.01" value={f.opening_due}
              onChange={(e) => setF({ ...f, opening_due: e.target.value })} />
          </Field>
          <Field label="Notes">
            <Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder="Optional" />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Saving…" : "Save customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-0.5 text-[10.5px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
