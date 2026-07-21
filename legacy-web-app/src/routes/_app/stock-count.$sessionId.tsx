import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, useCallback, forwardRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";
import {
  ArrowLeft, Scan, Search, Eye, EyeOff, CheckCircle2, ListChecks, Loader2,
  ChevronDown, ChevronUp, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SARAmount } from "@/components/sar-amount";
import {
  getSession, listItemsPage, updateItemQty, refreshProgress, updateSession,
  approveSession, listAdjustments, getStockCountSummary, getItemByBarcode,
  resetStockCountSession,
} from "@/lib/stock-count/api";
import { REASON_OPTIONS, type StockCountItem, type StockCountSummary } from "@/lib/stock-count/types";
import { useUserAccess } from "@/hooks/use-user-access";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export const Route = createFileRoute("/_app/stock-count/$sessionId")({
  component: SessionPage,
});

type FilterKey = "all" | "counted" | "not_counted" | "diff" | "pos" | "neg" | "nodiff";
const PAGE_SIZE = 75;
const EMPTY_SUMMARY: StockCountSummary = {
  total: 0, counted: 0, diffCount: 0, missing: 0, extra: 0, diffValue: 0,
  prevTotalQty: 0, currTotalQty: 0, prevTotalValue: 0, currTotalValue: 0,
  extraProducts: 0, missingProducts: 0, nodiffProducts: 0, extraValue: 0, missingValue: 0,
};

function SessionPage() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin } = useUserAccess();

  const { data: session } = useQuery({
    queryKey: ["sc-session", sessionId],
    queryFn: () => getSession(sessionId),
    staleTime: 30_000,
  });

  const readonly = session?.status === "approved";
  const blind = !!session?.blind_count;
  const mode = (session?.scan_mode ?? "manual") as "manual" | "increment";

  // local optimistic map of physical_qty edits
  const [edits, setEdits] = useState<Record<string, number | null>>({});
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250);
  const [scanMsg, setScanMsg] = useState<string | null>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  const itemsQuery = useInfiniteQuery({
    queryKey: ["sc-items", sessionId, filter, debouncedSearch],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listItemsPage({
      sessionId,
      filter,
      search: debouncedSearch,
      offset: pageParam,
      limit: PAGE_SIZE,
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.items.length === 0) return undefined;
      const next = lastPage.offset + lastPage.items.length;
      return next < lastPage.total ? next : undefined;
    },
    staleTime: 30_000,
  });

  const items = useMemo(
    () => itemsQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [itemsQuery.data]
  );
  const listTotal = itemsQuery.data?.pages[0]?.total ?? 0;

  const { data: summary = EMPTY_SUMMARY } = useQuery({
    queryKey: ["sc-summary", sessionId],
    queryFn: () => getStockCountSummary(sessionId),
    staleTime: 15_000,
  });

  const qtyOf = useCallback(
    (it: StockCountItem): number | null => (it.id in edits ? edits[it.id] : it.physical_qty),
    [edits]
  );

  const visible = items;
  const totalProducts = summary.total || session?.total_products || listTotal || 0;

  // Live summary: apply pending in-flight edits on top of server summary so
  // Prev/Curr Qty, Values, Net/Value Diff and Extra/Missing/No-Diff counts
  // update instantly as the user types, before the debounced save round-trips.
  const liveStats = useMemo<StockCountSummary>(() => {
    const s: StockCountSummary = { ...summary };
    const editIds = Object.keys(edits);
    if (editIds.length === 0) return s;
    const map = new Map(items.map((i) => [i.id, i]));
    const classify = (q: number | null | undefined, frozen: number) => {
      if (q === null || q === undefined) return "not" as const;
      const d = q - frozen;
      if (d > 0) return "extra" as const;
      if (d < 0) return "missing" as const;
      return "nodiff" as const;
    };
    for (const id of editIds) {
      const it = map.get(id);
      if (!it) continue;
      const newQty = edits[id];
      const oldQty = it.physical_qty;
      const frozen = Number(it.frozen_qty) || 0;
      const price = Number(it.purchase_price) || 0;

      // Curr qty/value: uncounted rows fall back to frozen (matches RPC)
      const oldEff = oldQty ?? frozen;
      const newEff = newQty ?? frozen;
      const dq = newEff - oldEff;
      s.currTotalQty += dq;
      s.currTotalValue += dq * price;
      s.diffValue += dq * price;

      if (oldQty === null && newQty !== null) s.counted += 1;
      if (oldQty !== null && newQty === null) s.counted -= 1;

      const oldC = classify(oldQty, frozen);
      const newC = classify(newQty, frozen);

      if (oldC === "extra") {
        const od = (oldQty as number) - frozen;
        s.extra -= od; s.extraValue -= od * price; s.extraProducts -= 1;
      } else if (oldC === "missing") {
        const od = frozen - (oldQty as number);
        s.missing -= od; s.missingValue -= od * price; s.missingProducts -= 1;
      } else if (oldC === "nodiff") {
        s.nodiffProducts -= 1;
      }
      if (newC === "extra") {
        const nd = (newQty as number) - frozen;
        s.extra += nd; s.extraValue += nd * price; s.extraProducts += 1;
      } else if (newC === "missing") {
        const nd = frozen - (newQty as number);
        s.missing += nd; s.missingValue += nd * price; s.missingProducts += 1;
      } else if (newC === "nodiff") {
        s.nodiffProducts += 1;
      }

      const wasDiff = oldC === "extra" || oldC === "missing";
      const isDiff = newC === "extra" || newC === "missing";
      if (wasDiff && !isDiff) s.diffCount -= 1;
      if (!wasDiff && isDiff) s.diffCount += 1;
    }
    return s;
  }, [summary, edits, items]);

  const stats = liveStats;

  // Save mutation — debounced batched by item
  const saveTimers = useRef<Map<string, any>>(new Map());
  const saveMut = useMutation({
    mutationFn: async ({ id, qty }: { id: string; qty: number | null }) => {
      await updateItemQty(id, qty);
    },
    onSuccess: (_d, vars) => {
      // Patch cache
      qc.setQueriesData({ queryKey: ["sc-items", sessionId] }, (prev: any) => {
        if (!prev?.pages) return prev;
        return {
          ...prev,
          pages: prev.pages.map((page: any) => ({
            ...page,
            items: page.items.map((x: StockCountItem) =>
              x.id === vars.id ? { ...x, physical_qty: vars.qty } : x
            ),
          })),
        };
      });
      qc.invalidateQueries({ queryKey: ["sc-summary", sessionId] });
      qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
      setEdits((e) => {
        const n = { ...e };
        delete n[vars.id];
        return n;
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });

  const scheduleSave = useCallback(
    (id: string, qty: number | null) => {
      const timers = saveTimers.current;
      const t = timers.get(id);
      if (t) clearTimeout(t);
      const handle = setTimeout(() => {
        saveMut.mutate({ id, qty });
        timers.delete(id);
      }, 500);
      timers.set(id, handle);
    },
    [saveMut]
  );

  const setQty = useCallback(
    (it: StockCountItem, qty: number | null) => {
      setEdits((e) => ({ ...e, [it.id]: qty }));
      scheduleSave(it.id, qty);
    },
    [scheduleSave]
  );

  // Flush all pending debounced saves to DB and wait for them to complete.
  // Must be awaited before any operation that reads DB source of truth
  // (Review, Approve) to prevent a race where the UI shows counted via
  // optimistic edits but the DB still has physical_qty = NULL.
  const flushPendingEdits = useCallback(async () => {
    const timers = saveTimers.current;
    const pending: Array<Promise<void>> = [];
    timers.forEach((t, id) => {
      clearTimeout(t);
      if (id in edits) {
        pending.push(updateItemQty(id, edits[id]).catch(() => {}));
      }
    });
    timers.clear();
    if (pending.length === 0) return;
    await Promise.all(pending);
    setEdits({});
    await qc.invalidateQueries({ queryKey: ["sc-items", sessionId] });
    await qc.invalidateQueries({ queryKey: ["sc-summary", sessionId] });
    await qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
  }, [edits, qc, sessionId]);
  const [flushing, setFlushing] = useState(false);

  // Flush pending saves before leaving
  useEffect(() => {
    const handler = () => {
      saveTimers.current.forEach((t, id) => {
        clearTimeout(t);
        const qty = edits[id];
        if (qty !== undefined) {
          // fire-and-forget
          updateItemQty(id, qty).catch(() => {});
        }
      });
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      handler();
    };
  }, [edits]);

  // Periodically refresh progress totals
  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => {
      refreshProgress(sessionId).then(() => {
        qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
        qc.invalidateQueries({ queryKey: ["sc-summary", sessionId] });
      });
    }, 15_000);
    return () => clearInterval(id);
  }, [session, sessionId, qc]);

  // Scan handling
  const handleScan = useCallback(
    async (code: string) => {
      const c = code.trim();
      if (!c) return;
      const match = items.find((it) => String(it.barcode ?? "").trim() === c) ?? await getItemByBarcode(sessionId, c);
      if (!match) {
        setScanMsg(`Not found: ${c}`);
        return;
      }
      const current = qtyOf(match) ?? 0;
      if (mode === "increment") {
        setQty(match, current + 1);
        setScanMsg(`${match.name} → ${current + 1}`);
      } else {
        // focus / select that row's input
        setSearch(match.barcode ?? match.name);
        setScanMsg(`Selected: ${match.name}`);
        setTimeout(() => {
          const el = document.querySelector<HTMLInputElement>(`input[data-item-id="${match.id}"]`);
          el?.focus();
          el?.select();
        }, 350);
      }
    },
    [items, mode, qtyOf, setQty, sessionId]
  );

  // Virtualizer
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: visible.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 8,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();



  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1];
    if (!last || !itemsQuery.hasNextPage || itemsQuery.isFetchingNextPage) return;
    if (last.index >= visible.length - 8) itemsQuery.fetchNextPage();
  }, [virtualItems, visible.length, itemsQuery.hasNextPage, itemsQuery.isFetchingNextPage, itemsQuery.fetchNextPage]);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const resetMut = useMutation({
    mutationFn: () => resetStockCountSession(sessionId),
    onSuccess: (n) => {
      toast.success(`Reset done. ${n} products re-snapshotted.`);
      setEdits({});
      qc.invalidateQueries({ queryKey: ["sc-items", sessionId] });
      qc.invalidateQueries({ queryKey: ["sc-summary", sessionId] });
      qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
      setResetOpen(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Reset failed"),
  });

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem-var(--mobile-bottom-nav-height,0px)-env(safe-area-inset-bottom,0px))] w-full max-w-3xl flex-col overflow-hidden md:h-[calc(100dvh-3.5rem-2rem)]">



      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-background/95 px-2 py-1 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => navigate({ to: "/stock-count" })} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight">{session?.name ?? "Loading…"}</div>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
              <Badge className="rounded-full px-1.5 py-0 text-[10px]">{session?.status?.replace("_", " ")}</Badge>
              {blind && <Badge variant="outline" className="rounded-full px-1.5 py-0 text-[10px]">Blind</Badge>}
            </div>
          </div>

          {!readonly && (
            <div className="flex items-center gap-1">
              {isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-2 text-xs"
                  onClick={() => setResetOpen(true)}
                  title="Reset counts (keeps actual stock)"
                >
                  <RotateCcw className="me-1 h-3 w-3" /> Reset
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-7 rounded-full px-2 text-xs"
                disabled={flushing}
                onClick={async () => {
                  setFlushing(true);
                  try { await flushPendingEdits(); } finally { setFlushing(false); }
                  setReviewOpen(true);
                }}
              >
                {flushing ? <Loader2 className="me-1 h-3 w-3 animate-spin" /> : <ListChecks className="me-1 h-3 w-3" />} Review
              </Button>
            </div>
          )}
        </div>

        {/* Stock Count Summary Card */}
        <SummaryCard
          stats={stats}
          total={totalProducts}
          blind={blind}
          open={summaryOpen}
          onToggle={() => setSummaryOpen((v) => !v)}
        />

        {/* Scan + search */}
        {!readonly && (
          <ScanBar
            ref={scanInputRef}
            onScan={handleScan}
            mode={mode}
            onModeChange={(m) => {
              updateSession(sessionId, { scan_mode: m }).then(() => {
                qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
              });
            }}
            blind={blind}
            onBlindChange={(v) => {
              updateSession(sessionId, { blind_count: v }).then(() => {
                qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
              });
            }}
            message={scanMsg}
          />
        )}
        <div className="mt-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or barcode"
              className="h-8 pl-7 text-xs"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="-mx-1 mt-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {(
            [
              ["all", `All (${totalProducts})`],
              ["counted", `✅ Checked (${stats.counted})`],
              ["not_counted", `Not Checked (${Math.max(0, totalProducts - stats.counted)})`],
              ["pos", `🟢 Extra (${stats.extraProducts})`],
              ["neg", `🔴 Missing (${stats.missingProducts})`],
              ["nodiff", `⚪ No Diff (${stats.nodiffProducts})`],
              ["diff", `Any Diff (${stats.diffCount})`],
            ] as [FilterKey, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === k ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted/60 text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>


      {/* List */}
      <div ref={parentRef} className="flex-1 overflow-y-auto px-2 pb-3 pt-1">
        {itemsQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading items…
          </div>
        ) : visible.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No products match.</div>
        ) : (
          <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {virtualItems.map((vi) => {
              const it = visible[vi.index];
              const physical = qtyOf(it);
              const diff = physical === null || physical === undefined ? null : physical - it.frozen_qty;
              return (
                <div
                  key={it.id}
                  ref={rowVirtualizer.measureElement}
                  data-index={vi.index}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, transform: `translateY(${vi.start}px)` }}
                  className="pb-1"
                >
                  <ProductRow
                    item={it}
                    physical={physical}
                    diff={diff}
                    blind={blind}
                    readonly={readonly}
                    onChange={(q) => setQty(it, q)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReviewSheet
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        sessionId={sessionId}
        stats={{ ...stats, total: totalProducts }}
        readonly={readonly}
        isAdmin={isAdmin}
        onApprove={async () => {
          await flushPendingEdits();
          setReviewOpen(false);
          setApproveOpen(true);
        }}
      />

      <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        sessionId={sessionId}
        onApproved={() => {
          qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
          qc.invalidateQueries({ queryKey: ["sc-items", sessionId] });
          qc.invalidateQueries({ queryKey: ["sc-summary", sessionId] });
          qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
          // Wholesale stock (shop_products) was updated by approval — refresh every
          // consumer so the new stock shows up without a manual reload.
          qc.invalidateQueries({ queryKey: ["store-products"] });
          qc.invalidateQueries({ queryKey: ["admin-products"] });
          qc.invalidateQueries({ queryKey: ["shop_products"] });
          qc.invalidateQueries({ queryKey: ["wholesale-dashboard-summary"] });
          qc.invalidateQueries({ queryKey: ["wh-financials"] });
          qc.invalidateQueries({ queryKey: ["low-stock"] });
          qc.invalidateQueries({ queryKey: ["price-compare-products"] });
        }}
      />


      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Reset stock count?</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>This clears all counted values and re-snapshots the Previous Stock baseline from your current warehouse stock.</p>
            <p className="font-medium text-foreground">Actual warehouse stock is NOT changed.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => resetMut.mutate()} disabled={resetMut.isPending}>
              {resetMut.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <RotateCcw className="me-1 h-4 w-4" />}
              Reset counts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="px-3 pb-2 pt-1">
        <Link to="/stock-count" className="text-[11px] text-muted-foreground underline">← Sessions</Link>
      </div>
    </div>
  );
}


interface ScanBarProps {
  onScan: (code: string) => void;
  mode: "manual" | "increment";
  onModeChange: (m: "manual" | "increment") => void;
  blind: boolean;
  onBlindChange: (v: boolean) => void;
  message: string | null;
}

const ScanBar = forwardRef<HTMLInputElement, ScanBarProps>(function ScanBar(
  { onScan, mode, onModeChange, blind, onBlindChange, message },
  ref
) {
  const [val, setVal] = useState("");
  const submit = () => {
    if (!val.trim()) return;
    onScan(val);
    setVal("");
  };
  return (
    <div className="mt-1 space-y-0.5">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Scan className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-600" />
          <Input
            ref={ref}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Scan or type barcode"
            className="h-8 pl-8 text-sm"
            inputMode="search"
            autoComplete="off"
          />
        </div>
        <Button onClick={submit} className="h-8 rounded-xl px-3">
          <Scan className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <Select value={mode} onValueChange={(v) => onModeChange(v as "manual" | "increment")}>
          <SelectTrigger className="h-6 w-auto rounded-full px-2 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual qty</SelectItem>
            <SelectItem value="increment">+1 per scan</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => onBlindChange(!blind)}
          className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0 text-[10px] text-muted-foreground"
        >
          {blind ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          <span>Blind: {blind ? "ON" : "OFF"}</span>
        </button>
      </div>

      {message && <div className="rounded bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">{message}</div>}
    </div>
  );
});


function ProductRow({
  item, physical, diff, blind, readonly, onChange,
}: {
  item: StockCountItem;
  physical: number | null | undefined;
  diff: number | null;
  blind: boolean;
  readonly: boolean;
  onChange: (q: number | null) => void;
}) {
  const isCounted = physical !== null && physical !== undefined;
  const showPrev = !blind || isCounted;

  const status = isCounted
    ? { label: "Checked", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" }
    : { label: "Not counted", cls: "bg-muted text-muted-foreground" };

  const diffBadge = isCounted && !blind
    ? diff === 0
      ? { label: "0", cls: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200" }
      : (diff ?? 0) > 0
      ? { label: `+${diff}`, cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" }
      : { label: `${diff}`, cls: "bg-red-500/15 text-red-700 dark:text-red-300" }
    : null;

  return (
    <Card className="p-1.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium leading-tight">{item.name}</div>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[10px] text-muted-foreground">
            <span>
              <span className="text-muted-foreground">Previous: </span>
              <b className="tabular-nums text-foreground">{showPrev ? item.frozen_qty : "—"}</b>
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="text-muted-foreground">Current: </span>
              <b className="tabular-nums text-foreground">{isCounted ? physical : "—"}</b>
            </span>
            {diffBadge && (
              <span className={`inline-flex items-center rounded-full px-1 py-0 text-[9px] font-semibold ${diffBadge.cls}`}>
                {diffBadge.label}
              </span>
            )}
          </div>
          <div className="mt-0.5">
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0 text-[9px] font-medium ${status.cls}`}>
              {isCounted && <CheckCircle2 className="h-3 w-3" />}
              {status.label}
            </span>
          </div>
        </div>
        <Input
          type="number"
          inputMode="decimal"
          data-item-id={item.id}
          disabled={readonly}
          value={physical === null || physical === undefined ? "" : String(physical)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onChange(null);
            else {
              const n = Number(v);
              if (Number.isFinite(n)) onChange(n);
            }
          }}
          className="h-8 w-[4rem] text-center text-sm font-semibold tabular-nums"
          placeholder="qty"
        />
      </div>
    </Card>
  );
}



function SummaryCard({
  stats, total, blind, open, onToggle,
}: {
  stats: StockCountSummary;
  total: number;
  blind: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const netQty = stats.currTotalQty - stats.prevTotalQty;
  const netVal = stats.currTotalValue - stats.prevTotalValue;
  const remaining = Math.max(0, total - stats.counted);

  return (

    <Card className="mt-1 overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1">
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted"
          title={open ? "Hide details" : "View details"}
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <div className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CompactStat label="Total" value={total} />
          <CompactStat label="Checked" value={stats.counted} tone="green" />
          <CompactStat label="Remaining" value={remaining} tone={remaining > 0 ? "red" : undefined} />
          {!blind && (
            <>
              <CompactStat label="Net Diff" value={`${netQty >= 0 ? "+" : ""}${fmt(netQty)}`} tone={netQty === 0 ? undefined : netQty > 0 ? "green" : "red"} />
              <CompactStat label="Value Diff" value={Math.abs(netVal)} tone={netVal === 0 ? undefined : netVal > 0 ? "green" : "red"} isMoney />
            </>
          )}
        </div>
      </div>

      {open && !blind && (
        <div className="border-t border-border/60 bg-muted/20 px-2 py-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            <MiniStat label="Prev Qty" value={fmt(stats.prevTotalQty)} />
            <MiniStat label="Curr Qty" value={fmt(stats.currTotalQty)} />
            <MiniStat label="Net Diff" value={`${netQty >= 0 ? "+" : ""}${fmt(netQty)}`} tone={netQty === 0 ? undefined : netQty > 0 ? "green" : "red"} />
            <ValStat label="Prev Value" value={stats.prevTotalValue} />
            <ValStat label="Curr Value" value={stats.currTotalValue} />
            <ValStat label="Diff Value" value={netVal} tone={netVal >= 0 ? "green" : "red"} sign={netVal >= 0 ? "+" : "−"} abs />
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            <MiniStat label="Extra" value={stats.extraProducts} tone="green" />
            <MiniStat label="Missing" value={stats.missingProducts} tone="red" />
            <MiniStat label="No Diff" value={stats.nodiffProducts} />
          </div>
        </div>
      )}
    </Card>
  );
}

function CompactStat({
  label, value, tone, isMoney,
}: {
  label: string;
  value: any;
  tone?: "green" | "red";
  isMoney?: boolean;
}) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "text-foreground";
  return (
    <div className={`flex shrink-0 flex-col items-center justify-center rounded-md border px-1.5 py-1 ${isMoney ? "min-w-[6.5rem]" : "min-w-[3.75rem]"}`}>
      <div className="text-[8px] uppercase tracking-wide leading-none text-muted-foreground">{label}</div>
      <div className={`mt-0.5 whitespace-nowrap text-[11px] font-bold tabular-nums leading-tight ${t}`}>
        {isMoney ? <SARAmount value={value} size="sm" className={t} showSign={false} /> : value}
      </div>
    </div>
  );
}



function MiniStat({ label, value, tone }: { label: string; value: any; tone?: "green" | "red" }) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "text-foreground";
  return (
    <div className="rounded-lg border p-1.5">
      <div className="text-[9.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${t}`}>{value}</div>
    </div>
  );
}

function ValStat({ label, value, tone, sign, abs }: { label: string; value: number; tone?: "green" | "red"; sign?: string; abs?: boolean }) {
  const t = tone === "green" ? "text-emerald-700 dark:text-emerald-300" : tone === "red" ? "text-red-600 dark:text-red-400" : "";
  const v = abs ? Math.abs(value) : value;
  return (
    <div className="rounded-lg border bg-background p-1.5 text-center">
      <div className="text-[9.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold ${t}`}>
        {sign && <span className="me-0.5">{sign}</span>}
        <SARAmount value={v} size="sm" className={t} />
      </div>
    </div>
  );
}

function fmt(n: number) {
  const sign = n < 0 ? "-" : "";
  return sign + new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(Math.abs(n));
}

function ReviewSheet({
  open, onOpenChange, sessionId, stats, readonly, isAdmin, onApprove,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sessionId: string;
  stats: { total: number; counted: number; diffCount: number; missing: number; extra: number; diffValue: number };
  readonly: boolean;
  isAdmin?: boolean;
  onApprove?: () => void;
}) {
  const { data: adjustments = [] } = useQuery({
    queryKey: ["sc-adj", sessionId],
    queryFn: () => listAdjustments(sessionId),
    enabled: readonly && open,
    staleTime: 60_000,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[90dvh] flex-col rounded-t-2xl p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Review Stock Count</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="Products" value={stats.total} />
            <Stat label="Counted" value={stats.counted} />
            <Stat label="With difference" value={stats.diffCount} />
            <Stat label="Missing qty" value={stats.missing} tone="red" />
            <Stat label="Extra qty" value={stats.extra} tone="green" />
            <Stat label="Inventory diff (value)" value={stats.diffValue.toFixed(2)} tone={stats.diffValue >= 0 ? "green" : "red"} />
          </div>

          {readonly && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adjustments</div>
              {adjustments.length === 0 ? (
                <div className="text-sm text-muted-foreground">No adjustments were recorded for this session.</div>
              ) : (
                <div className="space-y-1">
                  {adjustments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border p-2 text-xs">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{a.product_name}</div>
                        <div className="text-[10.5px] text-muted-foreground">{a.reason ?? "—"}</div>
                      </div>
                      <div className="text-right tabular-nums">
                        <div className={a.diff_qty > 0 ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                          {a.diff_qty > 0 ? `+${a.diff_qty}` : a.diff_qty}
                        </div>
                        <div className="text-[10.5px] text-muted-foreground">{a.system_qty} → {a.physical_qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {!readonly && (
          <div className="flex items-center justify-end gap-2 border-t bg-background px-4 py-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            {isAdmin && onApprove && (
              <Button onClick={onApprove}>
                <CheckCircle2 className="me-1 h-4 w-4" /> Approve Stock Count
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}


function Stat({ label, value, tone }: { label: string; value: any; tone?: "green" | "red" }) {
  const t = tone === "green" ? "text-emerald-700" : tone === "red" ? "text-red-600" : "";
  return (
    <div className="rounded-lg border p-2">
      <div className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold tabular-nums ${t}`}>{value}</div>
    </div>
  );
}

function ApproveDialog({
  open, onOpenChange, sessionId, onApproved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sessionId: string;
  onApproved: () => void;
}) {
  const [reason, setReason] = useState<string>(REASON_OPTIONS[0]);
  const [note, setNote] = useState("");
  const mut = useMutation({
    mutationFn: () => approveSession(sessionId, reason, note),
    onSuccess: (r) => {
      toast.success(`Approved. ${r.adjustments} adjustments applied.`);
      onApproved();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Approval failed"),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Approve & adjust stock</DialogTitle></DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Stock will be adjusted to match counted quantities. This action cannot be undone.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REASON_OPTIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Note (optional)</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
            {mut.isPending ? <Loader2 className="me-1 h-4 w-4 animate-spin" /> : <CheckCircle2 className="me-1 h-4 w-4" />}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
