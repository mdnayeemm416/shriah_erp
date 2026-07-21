import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { format, differenceInMinutes } from "date-fns";
import {
  Package, PlayCircle, StopCircle, History, Loader2,
  ChevronRight, Printer, Share2, FileText, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SARAmount } from "@/components/sar-amount";
import { SAR } from "@/lib/format";
import {
  listSessions, startNewStockCountSession, endStockCountSession,
  getStockCountSummary, listAdjustments, getSession, softDeleteSession,
  reapplyStockCount,
} from "@/lib/stock-count/api";
import type { StockCountSession, StockCountAdjustment, StockCountSummary } from "@/lib/stock-count/types";
import { CheckCircle2 } from "lucide-react";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/stock-count/")({
  component: StockCountPage,
});

function StockCountPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [endOpen, setEndOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const sessionsQ = useQuery({
    queryKey: ["stock-count-sessions"],
    queryFn: listSessions,
    staleTime: 15_000,
  });

  const active = useMemo(
    () => (sessionsQ.data ?? []).find(
      (s) => s.status === "draft" || s.status === "in_progress"
    ) ?? null,
    [sessionsQ.data]
  );
  const history = useMemo(
    () => (sessionsQ.data ?? []).filter((s) => s.status === "approved"),
    [sessionsQ.data]
  );

  const startMut = useMutation({
    mutationFn: startNewStockCountSession,
    onSuccess: (s) => {
      toast.success(`${s.name} started`);
      qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
      navigate({ to: "/stock-count/$sessionId", params: { sessionId: s.id } });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to start"),
  });

  const endMut = useMutation({
    mutationFn: () => endStockCountSession(active!.id),
    onSuccess: (r) => {
      toast.success(`Stock count ended. ${r.adjustments} adjustments applied.`);
      const endedId = active!.id;
      qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
      qc.invalidateQueries({ queryKey: ["sc-session", endedId] });
      setEndOpen(false);
      setDetailsId(endedId);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to end"),
  });

  const discardMut = useMutation({
    mutationFn: () => softDeleteSession(active!.id),
    onSuccess: () => {
      toast.success("Stock count session discarded");
      qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
      setDiscardOpen(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to discard"),
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-6 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <Package className="h-5 w-5 text-emerald-600" /> Wholesale Stock Count
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Snapshot &rarr; count &rarr; compare &rarr; save history
          </p>
        </div>
        <Link to="/store-admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground underline">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
      </div>

      {/* Main action */}
      <Card className="mb-4 p-4">
        {active ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                  Active session
                </div>
                <div className="truncate text-base font-bold">{active.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  Started {format(new Date(active.created_at), "dd MMM yyyy, hh:mm a")}
                </div>
              </div>
              <div className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                {active.status.replace("_", " ")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() =>
                  navigate({ to: "/stock-count/$sessionId", params: { sessionId: active.id } })
                }
                className="h-11 rounded-xl"
              >
                <PlayCircle className="me-1 h-4 w-4" /> Continue counting
              </Button>
              <Button
                onClick={() => setEndOpen(true)}
                variant="destructive"
                className="h-11 rounded-xl"
              >
                <StopCircle className="me-1 h-4 w-4" /> End Stock Count
              </Button>
            </div>
            <Button
              onClick={() => setDiscardOpen(true)}
              variant="outline"
              className="h-10 w-full rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted"
            >
              <Trash2 className="me-1 h-4 w-4" /> Discard Session
            </Button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <div className="text-sm text-muted-foreground">
              No active stock count. Start a new session to snapshot current wholesale stock.
            </div>
            <Button
              onClick={() => startMut.mutate()}
              disabled={startMut.isPending}
              className="h-14 w-full rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-base font-bold shadow-lg hover:brightness-110"
            >
              {startMut.isPending ? (
                <Loader2 className="me-2 h-5 w-5 animate-spin" />
              ) : (
                <PlayCircle className="me-2 h-5 w-5" />
              )}
              Start Stock Count
            </Button>
          </div>
        )}
      </Card>

      {/* History list */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-bold">
          <History className="h-4 w-4 text-muted-foreground" /> Stock Count History
        </h2>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {history.length} sessions
        </span>
      </div>

      {sessionsQ.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : history.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No completed stock counts yet.
        </Card>
      ) : (
        <div className="space-y-2">
          {history.map((s) => (
            <HistoryCard key={s.id} session={s} onOpen={() => setDetailsId(s.id)} />
          ))}
        </div>
      )}

      {/* End confirmation */}
      <AlertDialog open={endOpen} onOpenChange={setEndOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this Stock Count?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to finish this Stock Count? After ending, the
              stock snapshot will be finalized and the comparison report will be generated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={endMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                endMut.mutate();
              }}
              disabled={endMut.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {endMut.isPending ? (
                <Loader2 className="me-1 h-4 w-4 animate-spin" />
              ) : (
                <StopCircle className="me-1 h-4 w-4" />
              )}
              End Stock Count
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard confirmation */}
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Stock Count Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the current Stock Count session and all
              counted progress. No stock adjustments will be applied. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={discardMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                discardMut.mutate();
              }}
              disabled={discardMut.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {discardMut.isPending ? (
                <Loader2 className="me-1 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="me-1 h-4 w-4" />
              )}
              Discard Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details sheet */}
      <SessionDetailsSheet
        sessionId={detailsId}
        onClose={() => setDetailsId(null)}
      />
    </div>
  );
}

function HistoryCard({
  session, onOpen,
}: {
  session: StockCountSession;
  onOpen: () => void;
}) {
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const durationMin = end ? differenceInMinutes(end, start) : 0;
  const diffVal = Number(session.diff_value ?? 0);
  const tone =
    diffVal === 0
      ? "text-muted-foreground"
      : diffVal > 0
      ? "text-emerald-700 dark:text-emerald-300"
      : "text-red-600 dark:text-red-400";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full text-left"
    >
      <Card className="p-3 transition hover:border-primary/40 active:scale-[0.99]">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{session.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {format(start, "dd MMM yyyy")}
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10.5px] text-muted-foreground">
              <span>Start {format(start, "hh:mm a")}</span>
              {end && <span>End {format(end, "hh:mm a")}</span>}
              {end && <span>· {formatDuration(durationMin)}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9.5px] uppercase tracking-wide text-muted-foreground">
              Diff
            </div>
            <div className={`text-sm font-bold ${tone}`}>
              {diffVal > 0 ? "🟢 +" : diffVal < 0 ? "🔴 " : "⚪ "}
              <SARAmount value={Math.abs(diffVal)} size="sm" className={tone} />
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </Card>
    </button>
  );
}

function formatDuration(mins: number) {
  if (mins < 1) return "< 1 min";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function SessionDetailsSheet({
  sessionId, onClose,
}: {
  sessionId: string | null;
  onClose: () => void;
}) {
  const open = !!sessionId;
  const qc = useQueryClient();
  const [applyOpen, setApplyOpen] = useState(false);

  const sessionQ = useQuery({
    queryKey: ["sc-session", sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: open,
    staleTime: 30_000,
  });
  const summaryQ = useQuery({
    queryKey: ["sc-summary", sessionId],
    queryFn: () => getStockCountSummary(sessionId!),
    enabled: open,
    staleTime: 30_000,
  });
  const adjQ = useQuery({
    queryKey: ["sc-adj", sessionId],
    queryFn: () => listAdjustments(sessionId!),
    enabled: open,
    staleTime: 30_000,
  });

  const [filter, setFilter] = useState<"changed" | "all" | "missing" | "extra">("changed");

  const session = sessionQ.data;
  const summary = summaryQ.data;
  const adjustments = adjQ.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") return adjustments;
    if (filter === "missing") return adjustments.filter((a) => a.diff_qty < 0);
    if (filter === "extra") return adjustments.filter((a) => a.diff_qty > 0);
    return adjustments; // "changed" — adjustments already only contain changed rows
  }, [adjustments, filter]);

  const start = session?.created_at ? new Date(session.created_at) : null;
  const end = session?.approved_at ? new Date(session.approved_at) : null;
  const dur = start && end ? differenceInMinutes(end, start) : 0;

  const handlePrint = () => {
    if (!session || !summary) return;
    printStockCountReport(session, summary, adjustments);
  };

  const handleShare = async () => {
    if (!session) return;
    const text = shareText(session, summary, adjustments);
    try {
      if (navigator.share) {
        await navigator.share({ title: session.name, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Report copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  const applyMut = useMutation({
    mutationFn: () => reapplyStockCount(sessionId!),
    onSuccess: (r) => {
      toast.success(`Stock applied to ${r.applied} products`);
      setApplyOpen(false);
      qc.invalidateQueries({ queryKey: ["sc-session", sessionId] });
      qc.invalidateQueries({ queryKey: ["stock-count-sessions"] });
      qc.invalidateQueries({ queryKey: ["store-products"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["shop_products"] });
      qc.invalidateQueries({ queryKey: ["wholesale-dashboard-summary"] });
      qc.invalidateQueries({ queryKey: ["wh-financials"] });
      qc.invalidateQueries({ queryKey: ["low-stock"] });
      qc.invalidateQueries({ queryKey: ["price-compare-products"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to apply stock"),
  });

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> {session?.name ?? "Session"}
          </SheetTitle>
        </SheetHeader>

        {sessionQ.isLoading || summaryQ.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : !session || !summary ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Not found.</div>
        ) : (
          <div className="mt-3 space-y-4">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Info label="Start" value={start ? format(start, "dd MMM, hh:mm a") : "—"} />
              <Info label="End" value={end ? format(end, "dd MMM, hh:mm a") : "—"} />
              <Info label="Duration" value={end ? formatDuration(dur) : "—"} />
              <Info label="Products" value={`${summary.counted} / ${summary.total}`} />
            </div>

            {/* Summary */}
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stock Summary
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Mini label="Prev Qty" value={fmt(summary.prevTotalQty)} />
                <Mini label="Curr Qty" value={fmt(summary.currTotalQty)} />
                <Mini
                  label="Net Diff"
                  value={netQtyLabel(summary)}
                  tone={netQtyTone(summary)}
                />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <MoneyMini label="Prev Value" value={summary.prevTotalValue} />
                <MoneyMini label="Curr Value" value={summary.currTotalValue} />
                <MoneyMini
                  label="Diff Value"
                  value={summary.currTotalValue - summary.prevTotalValue}
                  signed
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handlePrint} className="rounded-full">
                <Printer className="me-1 h-3.5 w-3.5" /> Print
              </Button>
              <Button size="sm" variant="outline" onClick={handlePrint} className="rounded-full">
                <FileText className="me-1 h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare} className="rounded-full">
                <Share2 className="me-1 h-3.5 w-3.5" /> Share
              </Button>
            </div>

            {/* One-time Apply Stock recovery */}
            {session.status === "approved" && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
                {session.stock_applied ? (
                  <div className="flex items-center gap-2 text-[12px] text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <div>
                      <div className="font-semibold">Stock Already Applied</div>
                      {session.stock_applied_at && (
                        <div className="text-[10.5px] text-muted-foreground">
                          {format(new Date(session.stock_applied_at), "dd MMM yyyy, hh:mm a")}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-[11.5px] leading-snug text-muted-foreground">
                      Recovery: update the current Wholesale stock using the counted
                      quantities from this session. History is not changed.
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setApplyOpen(true)}
                      className="h-9 w-full rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 text-white hover:brightness-110"
                    >
                      <CheckCircle2 className="me-1 h-4 w-4" /> Apply This Stock Count
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Filters */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Product Differences
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {filtered.length}
                </span>
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {([
                  ["changed", `Changed (${adjustments.length})`],
                  ["missing", `🔴 Missing (${adjustments.filter((a) => a.diff_qty < 0).length})`],
                  ["extra", `🟢 Extra (${adjustments.filter((a) => a.diff_qty > 0).length})`],
                  ["all", "All"],
                ] as [typeof filter, string][]).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                      filter === k
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-muted/60 text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {adjustments.length === 0 ? (
                <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                  No differences — stock matched the snapshot exactly.
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                  Nothing to show for this filter.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filtered.map((a) => (
                    <DiffRow key={a.id} adj={a} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
      <AlertDialog open={applyOpen} onOpenChange={setApplyOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Stock Count?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the current Wholesale stock using the counted
              quantities from this completed Stock Count session. History will
              remain unchanged. This can only be done once.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={applyMut.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); applyMut.mutate(); }}
              disabled={applyMut.isPending}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {applyMut.isPending ? (
                <Loader2 className="me-1 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="me-1 h-4 w-4" />
              )}
              Apply Stock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}

function DiffRow({ adj }: { adj: StockCountAdjustment }) {
  const positive = adj.diff_qty > 0;
  const tone = positive
    ? "text-emerald-700 dark:text-emerald-300"
    : "text-red-600 dark:text-red-400";
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{adj.product_name}</div>
        <div className="text-[10.5px] text-muted-foreground tabular-nums">
          {fmt(Number(adj.system_qty))} → {fmt(Number(adj.physical_qty))}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold tabular-nums ${tone}`}>
          {positive ? "🟢 +" : "🔴 "}{fmt(Math.abs(adj.diff_qty))}
        </div>
        <div className={`text-[10.5px] font-semibold ${tone}`}>
          {positive ? "+" : "−"}{SAR(Math.abs(Number(adj.diff_value)))}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "green" | "red" | "muted" }) {
  const t =
    tone === "green" ? "text-emerald-700 dark:text-emerald-300"
    : tone === "red" ? "text-red-600 dark:text-red-400"
    : tone === "muted" ? "text-muted-foreground"
    : "text-foreground";
  return (
    <div className="rounded-lg border p-1.5">
      <div className="text-[9.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${t}`}>{value}</div>
    </div>
  );
}

function MoneyMini({ label, value, signed }: { label: string; value: number; signed?: boolean }) {
  const tone = !signed
    ? ""
    : value > 0
    ? "text-emerald-700 dark:text-emerald-300"
    : value < 0
    ? "text-red-600 dark:text-red-400"
    : "text-muted-foreground";
  return (
    <div className="rounded-lg border p-1.5 text-center">
      <div className="text-[9.5px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold ${tone}`}>
        {signed && value !== 0 && (
          <span className="me-0.5">{value > 0 ? "🟢 +" : "🔴 −"}</span>
        )}
        <SARAmount value={Math.abs(value)} size="sm" className={tone} />
      </div>
    </div>
  );
}

function netQtyLabel(s: StockCountSummary) {
  const d = s.currTotalQty - s.prevTotalQty;
  if (d === 0) return "⚪ 0";
  return d > 0 ? `🟢 +${fmt(d)}` : `🔴 ${fmt(d)}`;
}

function netQtyTone(s: StockCountSummary): "green" | "red" | "muted" {
  const d = s.currTotalQty - s.prevTotalQty;
  if (d === 0) return "muted";
  return d > 0 ? "green" : "red";
}

function fmt(n: number) {
  const sign = n < 0 ? "-" : "";
  return sign + new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(Math.abs(n));
}

function shareText(
  session: StockCountSession,
  summary: StockCountSummary | undefined,
  adjustments: StockCountAdjustment[]
) {
  const s = summary;
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const lines = [
    `${session.name}`,
    `Start: ${format(start, "dd MMM yyyy, hh:mm a")}`,
    end ? `End:   ${format(end, "dd MMM yyyy, hh:mm a")}` : "",
    s ? `Products: ${s.counted}/${s.total}` : "",
    s ? `Prev Qty: ${fmt(s.prevTotalQty)}   Curr Qty: ${fmt(s.currTotalQty)}   Diff: ${fmt(s.currTotalQty - s.prevTotalQty)}` : "",
    s ? `Prev Value: ${SAR(s.prevTotalValue)}   Curr Value: ${SAR(s.currTotalValue)}   Diff: ${SAR(s.currTotalValue - s.prevTotalValue)}` : "",
    "",
    `Changed products: ${adjustments.length}`,
    ...adjustments.slice(0, 40).map(
      (a) =>
        `- ${a.product_name}: ${fmt(Number(a.system_qty))} → ${fmt(Number(a.physical_qty))} (${a.diff_qty > 0 ? "+" : ""}${fmt(a.diff_qty)}, ${SAR(a.diff_value)})`
    ),
    adjustments.length > 40 ? `…and ${adjustments.length - 40} more` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

function printStockCountReport(
  session: StockCountSession,
  summary: StockCountSummary,
  adjustments: StockCountAdjustment[]
) {
  const start = new Date(session.created_at);
  const end = session.approved_at ? new Date(session.approved_at) : null;
  const dur = end ? differenceInMinutes(end, start) : 0;
  const netQ = summary.currTotalQty - summary.prevTotalQty;
  const netV = summary.currTotalValue - summary.prevTotalValue;

  const rows = adjustments
    .map(
      (a) => `<tr>
        <td>${escapeHtml(a.product_name)}</td>
        <td class="num">${fmt(Number(a.system_qty))}</td>
        <td class="num">${fmt(Number(a.physical_qty))}</td>
        <td class="num ${a.diff_qty > 0 ? "pos" : a.diff_qty < 0 ? "neg" : ""}">${a.diff_qty > 0 ? "+" : ""}${fmt(a.diff_qty)}</td>
        <td class="num ${a.diff_value > 0 ? "pos" : a.diff_value < 0 ? "neg" : ""}">${SAR(a.diff_value)}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
    <title>${escapeHtml(session.name)}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:24px;color:#111}
      h1{margin:0 0 4px;font-size:20px}
      .sub{color:#666;font-size:12px;margin-bottom:16px}
      .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0}
      .card{border:1px solid #e5e7eb;border-radius:8px;padding:8px}
      .label{font-size:10px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em}
      .value{font-size:14px;font-weight:700;margin-top:2px}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12px}
      th,td{border-bottom:1px solid #eee;padding:6px 8px;text-align:left}
      th{background:#f9fafb;font-size:11px;text-transform:uppercase;color:#6b7280;letter-spacing:.03em}
      .num{text-align:right;font-variant-numeric:tabular-nums}
      .pos{color:#047857}
      .neg{color:#b91c1c}
      @media print{@page{margin:12mm}}
    </style></head><body>
    <h1>Azzouz WholeSale</h1>
    <div class="sub">${escapeHtml(session.name)} · Printed ${format(new Date(), "dd MMM yyyy, hh:mm a")}</div>
    <div class="grid">
      <div class="card"><div class="label">Start</div><div class="value">${format(start, "dd MMM yyyy, hh:mm a")}</div></div>
      <div class="card"><div class="label">End</div><div class="value">${end ? format(end, "dd MMM yyyy, hh:mm a") : "—"}</div></div>
      <div class="card"><div class="label">Duration</div><div class="value">${end ? formatDuration(dur) : "—"}</div></div>
      <div class="card"><div class="label">Products</div><div class="value">${summary.counted} / ${summary.total}</div></div>
      <div class="card"><div class="label">Prev Qty</div><div class="value">${fmt(summary.prevTotalQty)}</div></div>
      <div class="card"><div class="label">Curr Qty</div><div class="value">${fmt(summary.currTotalQty)}</div></div>
      <div class="card"><div class="label">Prev Value</div><div class="value">${SAR(summary.prevTotalValue)}</div></div>
      <div class="card"><div class="label">Curr Value</div><div class="value">${SAR(summary.currTotalValue)}</div></div>
      <div class="card"><div class="label">Net Qty Diff</div><div class="value ${netQ > 0 ? "pos" : netQ < 0 ? "neg" : ""}">${netQ > 0 ? "+" : ""}${fmt(netQ)}</div></div>
      <div class="card"><div class="label">Net Value Diff</div><div class="value ${netV > 0 ? "pos" : netV < 0 ? "neg" : ""}">${SAR(netV)}</div></div>
    </div>
    <h2 style="font-size:14px;margin:16px 0 4px">Product Differences (${adjustments.length})</h2>
    ${adjustments.length === 0 ? "<div style='color:#666;font-size:12px'>No differences.</div>" : `
    <table>
      <thead><tr><th>Product</th><th class="num">Prev</th><th class="num">Curr</th><th class="num">Diff Qty</th><th class="num">Diff Value</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`}
    <script>window.onload = function(){setTimeout(function(){window.print()}, 200)}</script>
    </body></html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) {
    toast.error("Pop-up blocked. Allow pop-ups to print.");
    return;
  }
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
