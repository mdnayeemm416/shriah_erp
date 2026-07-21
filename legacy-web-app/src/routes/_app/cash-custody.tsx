import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, ArrowRightLeft, Undo2, CheckCircle2, XCircle, Clock, AlertTriangle, Plus, Wallet, GitBranch,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useUserAccess } from "@/hooks/use-user-access";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SAR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/cash-custody")({
  beforeLoad: () => { throw redirect({ to: "/finance-workflow", search: { tab: "custody" } as any }); },
  component: CashCustodyPage,
});

type Profile = { id: string; full_name: string | null; email: string | null; username: string | null };
type Shop = { id: string; name: string };
type Holder = {
  user_id: string;
  display_name: string;
  total_received: number;
  total_given: number;
  total_spent: number;
  total_returned: number;
  balance: number;
};
type Handover = {
  id: string;
  from_user: string;
  to_user: string;
  shop_id: string | null;
  amount: number;
  purpose: string | null;
  notes: string | null;
  status: "pending" | "accepted" | "rejected" | "returned" | "closed";
  parent_handover_id: string | null;
  day_date: string;
  reject_reason: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  attachment_url: string | null;
  created_by: string;
  created_at: string;
};
type Recon = {
  day_date: string;
  shop_id: string | null;
  cash_in: number;
  distributed: number;
  purchases: number;
  returns: number;
};
type Return = {
  id: string;
  from_user: string;
  to_user: string | null;
  amount: number;
  notes: string | null;
  day_date: string;
  shop_id: string | null;
  related_handover_id: string | null;
  created_at: string;
};

function nameOf(profiles: Profile[], id?: string | null) {
  if (!id) return "—";
  const p = profiles.find((x) => x.id === id);
  return p?.full_name || p?.email || p?.username || id.slice(0, 8);
}

function StatusChip({ status }: { status: Handover["status"] }) {
  const map = {
    pending:  { c: "bg-amber-500/15 text-amber-700 dark:text-amber-300", l: "Pending", Icon: Clock },
    accepted: { c: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", l: "Accepted", Icon: CheckCircle2 },
    rejected: { c: "bg-rose-500/15 text-rose-700 dark:text-rose-300", l: "Rejected", Icon: XCircle },
    returned: { c: "bg-sky-500/15 text-sky-700 dark:text-sky-300", l: "Returned", Icon: Undo2 },
    closed:   { c: "bg-muted text-muted-foreground", l: "Closed", Icon: CheckCircle2 },
  }[status];
  const Icon = map.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", map.c)}>
      <Icon className="h-3 w-3" /> {map.l}
    </span>
  );
}

export function CashCustodyPage() {
  const { user } = useAuth();
  const access = useUserAccess();
  const qc = useQueryClient();
  const [tab, setTab] = useState("holders");

  // Profiles (for name resolution + picker)
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-all"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id,full_name,email,username");
      return (data ?? []) as Profile[];
    },
  });

  const { data: shops = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return (data ?? []) as Shop[];
    },
  });

  const { data: holders = [] } = useQuery({
    queryKey: ["cash-holders"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("v_cash_holders").select("*").order("balance", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Holder[];
    },
  });

  const { data: handovers = [] } = useQuery({
    queryKey: ["cash-handovers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("cash_handovers")
        .select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as Handover[];
    },
  });

  const { data: returns = [] } = useQuery({
    queryKey: ["cash-returns"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("cash_returns")
        .select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as Return[];
    },
  });

  const { data: recon = [] } = useQuery({
    queryKey: ["cash-recon"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("v_cash_reconciliation")
        .select("*").order("day_date", { ascending: false }).limit(30);
      if (error) throw error;
      return (data ?? []) as Recon[];
    },
  });

  const pendingIncoming = useMemo(
    () => handovers.filter((h) => h.status === "pending" && h.to_user === user?.id),
    [handovers, user?.id]
  );

  const totalsRecon = useMemo(() => {
    let cashIn = 0, dist = 0, pur = 0, ret = 0;
    for (const r of recon) {
      cashIn += Number(r.cash_in || 0);
      dist += Number(r.distributed || 0);
      pur += Number(r.purchases || 0);
      ret += Number(r.returns || 0);
    }
    const heldByUsers = holders.reduce((s, h) => s + Number(h.balance || 0), 0);
    const expectedHeld = cashIn - pur - ret;  // distributed cancels out (received-given)
    const unaccounted = expectedHeld - heldByUsers;
    return { cashIn, dist, pur, ret, heldByUsers, expectedHeld, unaccounted };
  }, [recon, holders]);

  // --- New handover ---
  const [newOpen, setNewOpen] = useState(false);
  const [hTo, setHTo] = useState("");
  const [hShop, setHShop] = useState<string>("__none__");
  const [hAmt, setHAmt] = useState("");
  const [hPurpose, setHPurpose] = useState("");
  const [hNotes, setHNotes] = useState("");

  const createHandover = useMutation({
    mutationFn: async () => {
      const amt = Number(hAmt);
      if (!hTo) throw new Error("Pick recipient");
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { error } = await (supabase as any).from("cash_handovers").insert({
        from_user: user!.id, to_user: hTo,
        shop_id: hShop === "__none__" ? null : hShop,
        amount: amt, purpose: hPurpose || null, notes: hNotes || null,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-handovers"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
      toast.success("Handover sent");
      setNewOpen(false);
      setHTo(""); setHAmt(""); setHPurpose(""); setHNotes(""); setHShop("__none__");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const setHandoverStatus = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: Handover["status"]; reason?: string }) => {
      const patch: any = { status };
      if (status === "accepted") patch.accepted_at = new Date().toISOString();
      if (status === "rejected") { patch.rejected_at = new Date().toISOString(); patch.reject_reason = reason ?? null; }
      if (status === "closed") patch.closed_at = new Date().toISOString();
      const { error } = await (supabase as any).from("cash_handovers").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-handovers"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  // --- New return ---
  const [retOpen, setRetOpen] = useState(false);
  const [rTo, setRTo] = useState<string>("__company__");
  const [rAmt, setRAmt] = useState("");
  const [rNotes, setRNotes] = useState("");

  const createReturn = useMutation({
    mutationFn: async () => {
      const amt = Number(rAmt);
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { error } = await (supabase as any).from("cash_returns").insert({
        from_user: user!.id,
        to_user: rTo === "__company__" ? null : rTo,
        amount: amt, notes: rNotes || null,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-returns"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
      toast.success("Return recorded");
      setRetOpen(false); setRAmt(""); setRNotes(""); setRTo("__company__");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  if (access.loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }
  if (!access.hasPage("cash-custody")) {
    return <div className="p-6 text-muted-foreground">Access restricted.</div>;
  }

  return (
    <div className="mobile-page-stack">
      {/* Header */}
      <div className="rounded-2xl border border-border/60 bg-card/70">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[15px] font-semibold leading-tight truncate">Cash Custody</p>
              <p className="text-[11px] text-muted-foreground">Who holds company money</p>
            </div>
          </div>
          {access.canHandover && (
          <Sheet open={newOpen} onOpenChange={setNewOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="h-9 gap-1.5">
                <Plus className="h-4 w-4" /> Handover
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader><SheetTitle>New Cash Handover</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">To (recipient)</label>
                  <Select value={hTo} onValueChange={setHTo}>
                    <SelectTrigger><SelectValue placeholder="Pick user" /></SelectTrigger>
                    <SelectContent>
                      {profiles.filter(p => p.id !== user?.id).map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.full_name || p.email || p.username || p.id.slice(0,8)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Shop (optional)</label>
                  <Select value={hShop} onValueChange={setHShop}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— No shop —</SelectItem>
                      {shops.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Amount (SAR)</label>
                  <Input type="number" inputMode="decimal" value={hAmt} onChange={e => setHAmt(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Purpose</label>
                  <Input value={hPurpose} onChange={e => setHPurpose(e.target.value)} placeholder="e.g. Almarai purchase" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Notes</label>
                  <Textarea value={hNotes} onChange={e => setHNotes(e.target.value)} rows={2} />
                </div>
                <Button className="w-full" disabled={createHandover.isPending} onClick={() => createHandover.mutate()}>
                  Send handover
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          )}
        </div>

        {/* Pending acceptance banner */}
        {pendingIncoming.length > 0 && (
          <div className="mx-3 mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[13px]">
            <div className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200">
              <Clock className="h-4 w-4" /> {pendingIncoming.length} incoming handover{pendingIncoming.length>1?"s":""} need your acceptance
            </div>
            <button className="mt-1 text-xs underline" onClick={() => setTab("pending")}>Review now</button>
          </div>
        )}

        {/* Unaccounted alert */}
        {Math.abs(totalsRecon.unaccounted) > 0.5 && (
          <div className="mx-3 mb-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-[13px]">
            <div className="flex items-center gap-2 font-medium text-rose-700 dark:text-rose-200">
              <AlertTriangle className="h-4 w-4" /> Unaccounted cash: {SAR(Math.abs(totalsRecon.unaccounted))}
            </div>
            <div className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-200/70">
              Expected held {SAR(totalsRecon.expectedHeld)} · Reported held {SAR(totalsRecon.heldByUsers)}
            </div>
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="px-3 pt-3">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="holders" className="text-xs">Holders</TabsTrigger>
          <TabsTrigger value="handovers" className="text-xs">Handovers</TabsTrigger>
          <TabsTrigger value="returns" className="text-xs">Returns</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending {pendingIncoming.length>0 && <Badge className="ml-1 h-4 px-1.5 text-[10px]">{pendingIncoming.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* HOLDERS */}
        <TabsContent value="holders" className="space-y-2 pt-3">
          <Card className="p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="text-[10px] uppercase text-muted-foreground">Cash In</p><p className="font-semibold text-sm">{SAR(totalsRecon.cashIn)}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Purchases</p><p className="font-semibold text-sm">{SAR(totalsRecon.pur)}</p></div>
              <div><p className="text-[10px] uppercase text-muted-foreground">Held</p><p className="font-semibold text-sm text-primary">{SAR(totalsRecon.heldByUsers)}</p></div>
            </div>
          </Card>
          {holders.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No active holders yet.</Card>
          ) : holders.map(h => (
            <Card key={h.user_id} className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{h.display_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    In {SAR(h.total_received)} · Out {SAR(h.total_given)} · Spent {SAR(h.total_spent)} · Returned {SAR(h.total_returned)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("text-base font-semibold", h.balance < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400")}>
                    {SAR(h.balance)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">holding</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* HANDOVERS */}
        <TabsContent value="handovers" className="space-y-2 pt-3">
          {handovers.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No handovers yet.</Card>
          ) : handovers.map(h => (
            <HandoverRow key={h.id} h={h} profiles={profiles} meId={user?.id} onStatus={(status, reason) => setHandoverStatus.mutate({ id: h.id, status, reason })} />
          ))}
        </TabsContent>

        {/* RETURNS */}
        <TabsContent value="returns" className="space-y-2 pt-3">
          <Sheet open={retOpen} onOpenChange={setRetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2"><Undo2 className="h-4 w-4" /> Record Return</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader><SheetTitle>Return cash</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Return to</label>
                  <Select value={rTo} onValueChange={setRTo}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__company__">Company (general)</SelectItem>
                      {profiles.filter(p => p.id !== user?.id).map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.full_name || p.email || p.username || p.id.slice(0,8)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Amount (SAR)</label>
                  <Input type="number" inputMode="decimal" value={rAmt} onChange={e => setRAmt(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Notes</label>
                  <Textarea value={rNotes} onChange={e => setRNotes(e.target.value)} rows={2} />
                </div>
                <Button className="w-full" disabled={createReturn.isPending} onClick={() => createReturn.mutate()}>Save return</Button>
              </div>
            </SheetContent>
          </Sheet>

          {returns.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">No returns recorded.</Card>
          ) : returns.map(r => (
            <Card key={r.id} className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{nameOf(profiles, r.from_user)}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{r.to_user ? nameOf(profiles, r.to_user) : "Company"}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">{r.day_date}{r.notes ? ` · ${r.notes}` : ""}</p>
                </div>
                <p className="font-semibold text-sky-600 dark:text-sky-400">{SAR(r.amount)}</p>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* PENDING */}
        <TabsContent value="pending" className="space-y-2 pt-3">
          {pendingIncoming.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted-foreground">Nothing to accept right now.</Card>
          ) : pendingIncoming.map(h => (
            <HandoverRow key={h.id} h={h} profiles={profiles} meId={user?.id} highlight onStatus={(status, reason) => setHandoverStatus.mutate({ id: h.id, status, reason })} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HandoverRow({
  h, profiles, meId, highlight, onStatus,
}: {
  h: Handover; profiles: Profile[]; meId?: string; highlight?: boolean;
  onStatus: (status: Handover["status"], reason?: string) => void;
}) {
  const isRecipient = h.to_user === meId;
  const isSender = h.from_user === meId;
  const [rejOpen, setRejOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Card className={cn("p-3", highlight && "border-amber-500/40")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{nameOf(profiles, h.from_user)}</span>
            <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{nameOf(profiles, h.to_user)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{h.day_date}</span>
            {h.purpose && <span>· {h.purpose}</span>}
            {h.parent_handover_id && <span className="inline-flex items-center gap-0.5"><GitBranch className="h-3 w-3" /> chained</span>}
          </div>
          {h.notes && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{h.notes}</p>}
          {h.reject_reason && <p className="mt-1 text-xs text-rose-500">Rejected: {h.reject_reason}</p>}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="font-semibold text-sm">{SAR(h.amount)}</p>
          <StatusChip status={h.status} />
        </div>
      </div>

      {h.status === "pending" && isRecipient && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1 gap-1" onClick={() => onStatus("accepted")}>
            <CheckCircle2 className="h-4 w-4" /> Accept
          </Button>
          <Sheet open={rejOpen} onOpenChange={setRejOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1 gap-1">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader><SheetTitle>Reject handover</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-3">
                <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (required)" rows={3} />
                <Button className="w-full" variant="destructive" disabled={!reason.trim()}
                  onClick={() => { onStatus("rejected", reason.trim()); setRejOpen(false); setReason(""); }}>
                  Confirm rejection
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
      {h.status === "pending" && isSender && (
        <div className="mt-3">
          <Button size="sm" variant="ghost" className="w-full text-muted-foreground" onClick={() => onStatus("rejected", "Cancelled by sender")}>
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
