import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSession } from "@/lib/stock-count/api";

export function NewSessionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState("");
  const [date, setDate] = useState(today);
  const [blind, setBlind] = useState(false);
  const [mode, setMode] = useState<"manual" | "increment">("manual");

  const mut = useMutation({
    mutationFn: createSession,
    onSuccess: (s) => {
      toast.success("Session created. Wholesale stock frozen.");
      qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
      onOpenChange(false);
      setName("");
      navigate({ to: "/stock-count/$sessionId", params: { sessionId: s.id } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to create session"),
  });

  const submit = () => {
    if (!name.trim()) {
      toast.error("Session name is required");
      return;
    }
    mut.mutate({
      name: name.trim(),
      count_date: date,
      shop_id: null,
      blind_count: blind,
      scan_mode: mode,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Wholesale Stock Count</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Session name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. June 2026 Wholesale Count" />
          </div>
          <div className="space-y-1.5">
            <Label>Count date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Scan mode</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Scan → enter quantity</SelectItem>
                <SelectItem value="increment">Scan → +1 each scan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="text-sm font-medium">Blind count</div>
              <div className="text-[11px] text-muted-foreground">Hide system quantity from counter</div>
            </div>
            <Switch checked={blind} onCheckedChange={setBlind} />
          </div>
          <div className="rounded-lg border border-dashed p-2 text-[11px] text-muted-foreground">
            Counts only Wholesale products. Shop inventory is not affected.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={mut.isPending}>
            {mut.isPending ? "Creating…" : "Start counting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

