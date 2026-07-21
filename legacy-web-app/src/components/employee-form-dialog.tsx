import { useEffect, useState } from "react";
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
import { Paperclip, X } from "lucide-react";
import { toast } from "sonner";

export type EmployeeRow = {
  id: string;
  name: string;
  shop_id: string | null;
  shop_name: string | null;
  mobile: string | null;
  iqama: string | null;
  notes: string | null;
  attachment_url: string | null;
  monthly_salary?: number | null;
  user_id?: string | null;
};


export function EmployeeFormDialog({
  open, onOpenChange, employee,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee?: EmployeeRow | null;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const editing = !!employee;

  const [name, setName] = useState("");
  const [shopId, setShopId] = useState<string>("");
  const [mobile, setMobile] = useState("");
  const [iqama, setIqama] = useState("");
  const [notes, setNotes] = useState("");
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [keepUrl, setKeepUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(employee?.name ?? "");
      setShopId(employee?.shop_id ?? "");
      setMobile(employee?.mobile ?? "");
      setIqama(employee?.iqama ?? "");
      setNotes(employee?.notes ?? "");
      setMonthlySalary(
        employee?.monthly_salary != null ? String(employee.monthly_salary) : ""
      );
      setUserId(employee?.user_id ?? "");
      setFile(null);
      setKeepUrl(employee?.attachment_url ?? null);
    }
  }, [open, employee]);


  const { data: shops = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("id, name")
        .eq("is_deleted", false)
        .order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-for-employee-link"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      if (error) throw error;
      return (data ?? []) as { id: string; full_name: string | null; email: string | null }[];
    },
  });


  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!name.trim()) throw new Error("Name is required");
      let url = keepUrl;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/employees/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (up.error) throw up.error;
        url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
      }
      const shop = shops.find((s) => s.id === shopId);
      const payload = {
        name: name.trim(),
        shop_id: shopId || null,
        shop_name: shop?.name ?? null,
        mobile: mobile.trim() || null,
        iqama: iqama.trim() || null,
        notes: notes.trim() || null,
        monthly_salary: Number(monthlySalary) || 0,
        attachment_url: url,
        user_id: userId || null,
      };

      if (editing && employee) {
        const { error } = await (supabase as any).from("employees").update(payload).eq("id", employee.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("employees").insert({ ...payload, created_by: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Employee updated" : "Employee added");
      qc.invalidateQueries({ queryKey: ["employees"] });
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit employee" : "Add employee"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morshed" maxLength={120} />
          </div>

          <div className="space-y-1.5">
            <Label>Shop</Label>
            <Select value={shopId || "none"} onValueChange={(v) => setShopId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Select shop" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Mobile</Label>
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="05XXXXXXXX" maxLength={20} />
            </div>
            <div className="space-y-1.5">
              <Label>Iqama</Label>
              <Input value={iqama} onChange={(e) => setIqama(e.target.value)} placeholder="ID number" maxLength={30} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Monthly Salary (SAR)</Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="e.g. 1500"
            />
            <p className="text-[10px] text-muted-foreground">
              Used in Profit Summary salary calculation. Does not affect the employee ledger.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Linked Login (for Employee Expense)</Label>
            <Select value={userId || "none"} onValueChange={(v) => setUserId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Select login user" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Not linked —</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name || p.email || p.id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              Link this employee to a login user so they can submit their own Employee Expenses.
            </p>
          </div>




          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} />
          </div>

          <div className="space-y-1.5">
            <Label>Attachment (image or PDF)</Label>
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
            {save.isPending ? "Saving…" : editing ? "Save changes" : "Add employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
