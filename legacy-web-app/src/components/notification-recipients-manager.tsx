import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Mail, Plus, Trash2, Send, History, ChevronDown, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { AUDIT_MODULES } from "@/lib/audit-email";

type Recipient = {
  id: string;
  email: string;
  label: string | null;
  is_active: boolean;
  event_flags: Record<string, boolean> | null;
  created_at: string;
};

type LogRow = {
  id: string;
  recipient_email: string;
  subject: string | null;
  status: string;
  error: string | null;
  sent_at: string;
  module: string | null;
  action: string | null;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NotificationRecipientsManager() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: recipients = [], isLoading } = useQuery({
    queryKey: ["notification-recipients"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("notification_recipients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Recipient[]) || [];
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["notification-email-log"],
    enabled: showHistory,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("notification_email_log")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as LogRow[]) || [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const e = email.trim().toLowerCase();
      if (!emailRe.test(e)) throw new Error("Invalid email address");
      const allOn: Record<string, boolean> = {};
      AUDIT_MODULES.forEach(m => { allOn[m] = true; });
      const { error } = await (supabase as any)
        .from("notification_recipients")
        .insert({ email: e, label: label.trim() || null, created_by: user?.id, event_flags: allOn });
      if (error) throw error;
    },
    onSuccess: () => {
      setEmail(""); setLabel("");
      qc.invalidateQueries({ queryKey: ["notification-recipients"] });
      toast.success("Recipient added");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add recipient"),
  });

  const toggle = useMutation({
    mutationFn: async (r: Recipient) => {
      const { error } = await (supabase as any)
        .from("notification_recipients")
        .update({ is_active: !r.is_active })
        .eq("id", r.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-recipients"] }),
  });

  const toggleEvent = useMutation({
    mutationFn: async (args: { r: Recipient; module: string; value: boolean }) => {
      const flags = { ...(args.r.event_flags || {}) };
      flags[args.module] = args.value;
      const { error } = await (supabase as any)
        .from("notification_recipients")
        .update({ event_flags: flags })
        .eq("id", args.r.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-recipients"] }),
    onError: (e: any) => toast.error(e.message || "Failed to update"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("notification_recipients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notification-recipients"] });
      toast.success("Recipient removed");
    },
    onError: (e: any) => toast.error(e.message || "Failed to remove"),
  });

  const test = useMutation({
    mutationFn: async (to: string) => {
      const r = await fetch("/api/public/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, testRecipient: to }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `Failed (${r.status})`);
      return j;
    },
    onSuccess: () => toast.success("Test email sent — check inbox"),
    onError: (e: any) => toast.error(e.message || "Test failed"),
  });

  const activeCount = recipients.filter(r => r.is_active).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">Email Notifications</div>
            <div className="text-xs text-muted-foreground">Audit alerts for sales, purchases, expenses, edits & deletes</div>
          </div>
        </div>
        <Badge variant={activeCount > 0 ? "default" : "secondary"}>{activeCount} active</Badge>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="ne">Email address</Label>
            <Input id="ne" type="email" placeholder="name@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nl">Label (optional)</Label>
            <Input id="nl" placeholder="e.g. Owner, Manager"
              value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <Button onClick={() => add.mutate()} disabled={add.isPending || !email.trim()} className="w-full">
            <Plus className="h-4 w-4" /> Add recipient
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {isLoading && <div className="text-xs text-muted-foreground">Loading…</div>}
        {!isLoading && recipients.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
            No recipients yet. Add one above to start receiving audit emails.
          </div>
        )}
        {recipients.map((r) => {
          const flags = r.event_flags || {};
          const enabledCount = AUDIT_MODULES.filter(m => flags[m] !== false).length;
          const isOpen = openId === r.id;
          return (
            <Card key={r.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.email}</div>
                    {r.label && <div className="text-xs text-muted-foreground truncate">{r.label}</div>}
                  </div>
                  <Switch checked={r.is_active} onCheckedChange={() => toggle.mutate(r)} />
                  <Button size="icon" variant="ghost" onClick={() => test.mutate(r.email)}
                    disabled={test.isPending} title="Send test email">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove.mutate(r.id)}
                    disabled={remove.isPending} title="Remove">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Collapsible open={isOpen} onOpenChange={(o) => setOpenId(o ? r.id : null)}>
                  <CollapsibleTrigger asChild>
                    <button className="mt-2 w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground px-1 py-1.5 rounded">
                      <span className="flex items-center gap-1.5">
                        <Settings2 className="h-3.5 w-3.5" />
                        Notification types ({enabledCount}/{AUDIT_MODULES.length} enabled)
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 border-t mt-1 space-y-1.5">
                    {AUDIT_MODULES.map((m) => {
                      const on = flags[m] !== false;
                      return (
                        <div key={m} className="flex items-center justify-between text-sm py-1">
                          <span>{m}</span>
                          <Switch
                            checked={on}
                            onCheckedChange={(v) => toggleEvent.mutate({ r, module: m, value: v })}
                          />
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <Button variant="outline" size="sm" onClick={() => setShowHistory(s => !s)} className="w-full">
          <History className="h-4 w-4" />
          {showHistory ? "Hide" : "View"} send history
        </Button>
      </div>

      {showHistory && (
        <div className="space-y-1.5">
          {history.length === 0 && (
            <div className="text-xs text-muted-foreground text-center py-4">No emails sent yet.</div>
          )}
          {history.map((h) => (
            <div key={h.id} className="text-xs p-2 rounded border bg-card flex items-center gap-2">
              <Badge variant={h.status === "sent" ? "default" : "destructive"} className="shrink-0">
                {h.status}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="truncate">{h.recipient_email}</div>
                <div className="text-muted-foreground truncate">
                  {h.module ? `${h.module}${h.action ? ` · ${h.action}` : ""}` : h.subject}
                </div>
                {h.error && <div className="text-destructive truncate">{h.error}</div>}
              </div>
              <div className="text-muted-foreground shrink-0">
                {new Date(h.sent_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
