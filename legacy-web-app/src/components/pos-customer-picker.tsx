import { memo, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Hash, Loader2, Phone, Search, UserPlus, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fuzzyScore, type PosCustomer } from "@/lib/pos-ledger";
import { fetchWholesaleCustomers, POS_CUSTOMER_COLS, POS_CUSTOMER_QUERY_KEY } from "@/lib/pos-customers";

type Props = {
  value: PosCustomer | null;
  onChange: (c: PosCustomer | null) => void;
  showDue?: boolean;
  dueByCustomer?: Map<string, number>;
};

const CUSTOMER_ROW_HEIGHT = 96;
const CUSTOMER_OVERSCAN = 7;

function formatDue(amount: number) {
  return `SAR ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

function PosCustomerPickerImpl({ value, onChange, showDue, dueByCustomer }: Props) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newOpening, setNewOpening] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(440);

  // Lazy: only fetch customer list when picker actually opens.
  const customers = useQuery({
    queryKey: POS_CUSTOMER_QUERY_KEY,
    enabled: open,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: fetchWholesaleCustomers,
  });

  // Defer the query string so typing stays responsive on low-end devices.
  const deferredQ = useDeferredValue(q);

  const filtered = useMemo(() => {
    const list = customers.data ?? [];
    const term = deferredQ.trim();
    if (!term) return list; // Show ALL customers when no search term
    const out: { c: PosCustomer; s: number }[] = [];
    for (const c of list) {
      const s = Math.max(
        fuzzyScore(c.name, term),
        fuzzyScore(c.phone ?? "", term),
        fuzzyScore(c.alias ?? "", term),
      );
      if (s >= 0) out.push({ c, s });
    }
    out.sort((a, b) => b.s - a.s);
    return out.map((x) => x.c);
  }, [customers.data, deferredQ]);

  useEffect(() => {
    if (!open) return;
    const node = scrollRef.current;
    if (!node) return;
    setViewportHeight(node.clientHeight || 440);
    setScrollTop(0);
    node.scrollTop = 0;
  }, [open, deferredQ]);

  const virtualRows = useMemo(() => {
    const total = filtered.length;
    const start = Math.max(0, Math.floor(scrollTop / CUSTOMER_ROW_HEIGHT) - CUSTOMER_OVERSCAN);
    const visibleCount = Math.ceil(viewportHeight / CUSTOMER_ROW_HEIGHT) + CUSTOMER_OVERSCAN * 2;
    const end = Math.min(total, start + visibleCount);
    return {
      totalHeight: total * CUSTOMER_ROW_HEIGHT,
      offsetY: start * CUSTOMER_ROW_HEIGHT,
      items: filtered.slice(start, end),
    };
  }, [filtered, scrollTop, viewportHeight]);

  const createCustomer = useCallback(async () => {
    const name = newName.trim();
    if (!name) { toast.error("Name required"); return; }
    const opening = Number(newOpening) || 0;
    const { data, error } = await supabase
      .from("pos_customers")
      .insert({ name, phone: newPhone.trim() || null, opening_due: opening })
      .select(POS_CUSTOMER_COLS)
      .single();
    if (error) { toast.error(error.message); return; }
    toast.success("Customer added");
    qc.invalidateQueries({ queryKey: POS_CUSTOMER_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
    onChange(data as PosCustomer);
    setCreating(false);
    setNewName(""); setNewPhone(""); setNewOpening("");
    setOpen(false);
  }, [newName, newPhone, newOpening, qc, onChange]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleClear = useCallback(() => onChange(null), [onChange]);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleStartCreate = useCallback(() => { setNewName(q); setCreating(true); }, [q]);

  const currentDue = value ? dueByCustomer?.get(value.id) ?? Number(value.opening_due ?? 0) : null;
  const totalCustomers = customers.data?.length ?? 0;

  return (
    <div className="space-y-1">
      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">{value.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              {value.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{value.phone}</span>}
              {value.alias && <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" />{value.alias}</span>}
              {showDue && currentDue != null && (
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 px-1.5 text-[10px] font-bold",
                    currentDue > 0 ? "border-rose-500/40 bg-rose-500/10 text-rose-600" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  )}
                >
                  Due: {formatDue(currentDue)}
                </Badge>
              )}
            </div>
          </div>
          <button type="button" onClick={handleClear} className="rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Clear">
            <X className="h-4 w-4" />
          </button>
          <button type="button" onClick={handleOpen} className="rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:bg-muted">
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 px-3 py-3 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted/40"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Pick a customer…</span>
          <Badge variant="secondary" className="text-[10px]">Optional</Badge>
        </button>
      )}

      {open && typeof document !== "undefined" && createPortal(
        <div className="pointer-events-auto fixed inset-0 z-[100] flex items-stretch justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={handleClose}>
          <div
            className="pointer-events-auto flex h-[100dvh] w-full flex-col overflow-hidden border border-border/70 bg-background shadow-2xl sm:h-[90dvh] sm:max-w-lg sm:rounded-[1.75rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-border/70 bg-background/95 px-4 pb-3 pt-4 shadow-sm backdrop-blur">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold leading-none">Pick Customer</p>
                  <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                    {customers.isLoading ? "Loading customers…" : `${filtered.length} of ${totalCustomers} customers`}
                  </p>
                </div>
                <button onClick={handleClose} className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted" aria-label="Close customer picker">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, mobile, or code…"
                  type="text"
                  inputMode="text"
                  className="h-11 rounded-2xl border-border/70 bg-muted/30 pl-9 pr-3 text-sm shadow-inner focus-visible:ring-2"
                  autoComplete="off"
                />
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-muted/20 px-2 py-2 overscroll-contain"
              onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
            >
              {creating ? (
                <div className="space-y-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
                  <p className="text-xs font-bold uppercase text-muted-foreground">New Customer</p>
                  <Input placeholder="Customer name *" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-11 rounded-xl" />
                  <Input placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} inputMode="tel" className="h-11 rounded-xl" />
                  <Input placeholder="Opening due (SAR)" value={newOpening} onChange={(e) => setNewOpening(e.target.value)} type="number" inputMode="decimal" className="h-11 rounded-xl" />
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="h-10 flex-1 rounded-xl" onClick={() => setCreating(false)}>Cancel</Button>
                    <Button className="h-10 flex-1 rounded-xl" onClick={createCustomer}>Save customer</Button>
                  </div>
                </div>
              ) : customers.isLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading customers…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                  <p>No matches</p>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={handleStartCreate}>
                    <UserPlus className="mr-1 h-4 w-4" /> Add "{q || "new customer"}"
                  </Button>
                </div>
              ) : (
                <>
                  <div style={{ height: virtualRows.totalHeight, position: "relative" }}>
                    <div style={{ transform: `translateY(${virtualRows.offsetY}px)` }}>
                      {virtualRows.items.map((c) => {
                        const due = dueByCustomer?.get(c.id) ?? (Number(c.opening_due) || 0);
                        const isSelected = value?.id === c.id;
                        return (
                          <div key={c.id} className="px-1 py-1" style={{ height: CUSTOMER_ROW_HEIGHT }}>
                            <button
                              type="button"
                              onClick={() => { onChange(c); setOpen(false); setQ(""); }}
                              className={cn(
                                "flex h-full w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-sm transition-colors active:scale-[0.99]",
                                isSelected
                                  ? "border-emerald-500/70 bg-emerald-500/10 shadow-md"
                                  : "border-border/70 hover:border-primary/40 hover:bg-background",
                              )}
                            >
                              <div className={cn(
                                "flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-sm font-black shadow-inner",
                                isSelected ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground",
                              )}>
                                {isSelected ? <CheckCircle2 className="h-5 w-5" /> : (c.name?.charAt(0).toUpperCase() ?? "?")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <p className="truncate text-[15px] font-bold leading-tight">{c.name}</p>
                                  {c.alias && (
                                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
                                      {c.alias}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 flex items-center gap-1 truncate text-[12px] text-muted-foreground">
                                  <Phone className="h-3.5 w-3.5" /> {c.phone || "No mobile"}
                                </p>
                                {c.alias && (
                                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                                    <Hash className="h-3 w-3" /> Code: {c.alias}
                                  </p>
                                )}
                              </div>
                              <div className={cn(
                                "shrink-0 rounded-2xl border px-2.5 py-1.5 text-right shadow-sm",
                                due > 0
                                  ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                              )}>
                                <span className="flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-wide opacity-80">
                                  <Wallet className="h-3 w-3" /> Due
                                </span>
                                <span className="block text-sm font-black tabular-nums">{formatDue(due)}</span>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-1 pb-2 pt-1">
                    <Button variant="outline" className="h-10 w-full rounded-2xl bg-background shadow-sm" onClick={handleStartCreate}>
                      <UserPlus className="mr-1 h-4 w-4" /> Add new customer
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export const PosCustomerPicker = memo(PosCustomerPickerImpl);
