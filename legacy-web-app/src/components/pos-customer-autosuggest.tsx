import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, X, User2, Phone, Wallet, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fuzzyScore, type PosCustomer } from "@/lib/pos-ledger";
import { fetchWholesaleCustomers, POS_CUSTOMER_COLS, POS_CUSTOMER_QUERY_KEY } from "@/lib/pos-customers";

type Props = {
  value: PosCustomer | null;
  onChange: (c: PosCustomer | null) => void;
  draftName: string;
  onDraftNameChange: (v: string) => void;
  onMobileFill?: (phone: string) => void;
  dueByCustomer?: Map<string, number>;
  autoFocus?: boolean;
};

type LastInfo = {
  last_payment_at: string | null;
  last_payment_amount: number | null;
  last_purchase_at: string | null;
};

function PosCustomerAutosuggestImpl({
  value, onChange, draftName, onDraftNameChange,
  onMobileFill, dueByCustomer, autoFocus,
}: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newOpening, setNewOpening] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy: only fetch lists once the dropdown is opened or there's already a selection
  // (selection needs lastInfo only; list/recent are not needed in the collapsed state).
  const listsEnabled = open;

  const customers = useQuery({
    queryKey: POS_CUSTOMER_QUERY_KEY,
    enabled: listsEnabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: fetchWholesaleCustomers,
  });

  const recent = useQuery({
    queryKey: ["pos-recent-customers"],
    enabled: listsEnabled,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    queryFn: async (): Promise<string[]> => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from("shop_sales")
        .select("customer_id,created_at")
        .not("customer_id", "is", null)
        .eq("is_deleted", false)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(40);
      const ids: string[] = [];
      const seen = new Set<string>();
      for (const r of data ?? []) {
        const id = (r as { customer_id: string | null }).customer_id;
        if (id && !seen.has(id)) { seen.add(id); ids.push(id); }
        if (ids.length >= 8) break;
      }
      return ids;
    },
  });

  const lastInfo = useQuery<LastInfo>({
    queryKey: ["pos-customer-last", value?.id],
    enabled: !!value?.id,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const [{ data: pay }, { data: sale }] = await Promise.all([
        supabase.from("pos_payments")
          .select("amount,created_at").eq("customer_id", value!.id).eq("kind", "payment_in")
          .order("created_at", { ascending: false }).limit(1),
        supabase.from("shop_sales")
          .select("created_at").eq("customer_id", value!.id).eq("is_deleted", false)
          .order("created_at", { ascending: false }).limit(1),
      ]);
      return {
        last_payment_at: pay?.[0]?.created_at ?? null,
        last_payment_amount: pay?.[0]?.amount != null ? Number(pay[0].amount) : null,
        last_purchase_at: sale?.[0]?.created_at ?? null,
      };
    },
  });

  const list = customers.data;
  const q = draftName.trim();
  const deferredQ = useDeferredValue(q);

  // Memoize id->customer map once per list reference instead of per keystroke.
  const byId = useMemo(() => {
    const m = new Map<string, PosCustomer>();
    for (const c of list ?? []) m.set(c.id, c);
    return m;
  }, [list]);

  const suggestions = useMemo(() => {
    const items = list ?? [];
    if (!deferredQ) {
      const recentIds = recent.data ?? [];
      const recentSet = new Set(recentIds);
      const out: PosCustomer[] = [];
      for (const id of recentIds) {
        const c = byId.get(id); if (c) out.push(c);
        if (out.length >= 8) break;
      }
      if (out.length < 8 && dueByCustomer) {
        const dues: PosCustomer[] = [];
        for (const c of items) {
          if (recentSet.has(c.id)) continue;
          if ((dueByCustomer.get(c.id) ?? 0) > 0) dues.push(c);
        }
        dues.sort((a, b) => (dueByCustomer.get(b.id)! - dueByCustomer.get(a.id)!));
        for (const c of dues) { if (out.length >= 8) break; out.push(c); }
      }
      if (out.length === 0) return items.slice(0, 8);
      return out;
    }
    const scored: { c: PosCustomer; s: number }[] = [];
    for (const c of items) {
      const s = Math.max(
        fuzzyScore(c.name, deferredQ),
        fuzzyScore(c.phone ?? "", deferredQ),
        fuzzyScore(c.alias ?? "", deferredQ),
      );
      if (s >= 0) scored.push({ c, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 8).map((x) => x.c);
  }, [list, byId, recent.data, deferredQ, dueByCustomer]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setCreating(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const pick = useCallback((c: PosCustomer) => {
    onChange(c);
    onDraftNameChange(c.name);
    if (c.phone) onMobileFill?.(c.phone);
    setOpen(false); setCreating(false);
  }, [onChange, onDraftNameChange, onMobileFill]);

  const createCustomer = useCallback(async () => {
    const name = draftName.trim();
    if (!name) { toast.error("Name required"); return; }
    const opening = Number(newOpening) || 0;
    const { data, error } = await supabase
      .from("pos_customers")
      .insert({ name, phone: newPhone.trim() || null, opening_due: opening })
      .select(POS_CUSTOMER_COLS).single();
    if (error) { toast.error(error.message); return; }
    toast.success("Customer added");
    qc.invalidateQueries({ queryKey: POS_CUSTOMER_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
    pick(data as PosCustomer);
    setNewPhone(""); setNewOpening("");
  }, [draftName, newPhone, newOpening, qc, pick]);

  const handleClear = useCallback(() => {
    onChange(null);
    onDraftNameChange("");
  }, [onChange, onDraftNameChange]);

  // Selected → compact header card
  if (value) {
    const due = dueByCustomer?.get(value.id) ?? 0;
    const li = lastInfo.data;
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-2.5">
        <div className="flex items-start gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <User2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold">{value.name}</p>
              <Badge
                variant="outline"
                className={cn(
                  "h-5 px-1.5 text-[10px]",
                  due > 0 ? "border-rose-500/40 text-rose-600" : "border-emerald-500/40 text-emerald-600",
                )}
              >
                <Wallet className="mr-0.5 h-3 w-3" /> Due SAR {due.toFixed(2)}
              </Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
              {value.phone && (
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{value.phone}</span>
              )}
              {li?.last_payment_at && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last pay {fmtDate(li.last_payment_at)}
                  {li.last_payment_amount != null && ` · SAR ${li.last_payment_amount.toFixed(0)}`}
                </span>
              )}
              {li?.last_purchase_at && !li.last_payment_at && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Last buy {fmtDate(li.last_purchase_at)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Change customer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Empty → unified search input
  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={draftName}
          onChange={(e) => { onDraftNameChange(e.target.value); setOpen(true); setCreating(false); }}
          onFocus={() => setOpen(true)}
          placeholder="Customer name * — search or add"
          className="h-10 rounded-xl pl-9 pr-9 text-sm"
          autoComplete="off"
        />
        {draftName && (
          <button
            type="button"
            onClick={() => { onDraftNameChange(""); inputRef.current?.focus(); setOpen(true); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 max-h-[60dvh] overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
          {creating ? (
            <div className="space-y-2 p-2">
              <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                New customer
              </p>
              <Input placeholder="Customer name *" value={draftName} onChange={(e) => onDraftNameChange(e.target.value)} className="h-9" />
              <Input placeholder="Mobile" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} inputMode="tel" className="h-9" />
              <Input placeholder="Opening due (SAR)" value={newOpening} onChange={(e) => setNewOpening(e.target.value)} type="number" inputMode="decimal" className="h-9" />
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setCreating(false)}>Cancel</Button>
                <Button size="sm" className="flex-1" onClick={createCustomer}>Save customer</Button>
              </div>
            </div>
          ) : customers.isLoading ? (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">Loading…</p>
          ) : (
            <>
              {!deferredQ && suggestions.length > 0 && (
                <p className="px-2 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {(recent.data?.length ?? 0) > 0 ? "Recent & due" : "Customers"}
                </p>
              )}
              {suggestions.map((c) => {
                const due = dueByCustomer?.get(c.id) ?? 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(c)}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-muted/60"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <User2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{c.phone ?? "—"}</p>
                    </div>
                    {due > 0 && (
                      <Badge variant="outline" className="border-rose-500/40 text-[10px] text-rose-600">
                        Due {due.toFixed(0)}
                      </Badge>
                    )}
                  </button>
                );
              })}
              {suggestions.length === 0 && (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                  {deferredQ ? `No match for "${deferredQ}"` : "No customers yet"}
                </p>
              )}
              <div className="border-t border-border/60 p-1">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setCreating(true)}
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <UserPlus className="h-4 w-4" />
                  Add new customer{q ? ` "${q}"` : ""}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export const PosCustomerAutosuggest = memo(PosCustomerAutosuggestImpl);

function fmtDate(s: string) {
  try {
    const d = new Date(s);
    const now = new Date();
    const days = Math.floor((now.getTime() - d.getTime()) / (24 * 3600 * 1000));
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
  } catch { return ""; }
}
