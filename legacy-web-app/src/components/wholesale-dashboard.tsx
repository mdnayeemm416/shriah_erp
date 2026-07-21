import { memo, useCallback, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  RefreshCw, TrendingUp, Wallet, Coins, ArrowDownLeft, ArrowUpRight,
  ShoppingBag, Truck, Boxes, Loader2, MessageCircle, Trash2, X, Pencil,
  Info, ChevronRight, Search, Package, AlertTriangle,
} from "lucide-react";
import { TransactionDialog } from "@/components/transaction-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PosSaleDetailsDialog } from "@/components/pos-sale-details-dialog";
import { PosCustomerStatementDialog } from "@/components/pos-customer-statement";
import { softDelete, restore } from "@/lib/soft-delete";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
// Invoice templates supported on the Wholesale page: Invoice V2 and 80mm by AM only.
// They open from PosSaleDetailsDialog. No other invoice systems are wired here.
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { SAR } from "@/lib/format";
import type { PosCustomer } from "@/lib/pos-ledger";
import { useWholesaleFinancials } from "@/lib/use-wholesale-financials";
import { useWorkingDate } from "@/hooks/use-working-date";

const fmt = (n: number) =>
  `SAR ${Math.round(Number(n) || 0).toLocaleString()}`;

/* ============ FINANCIAL SUMMARY ============ */

// Shared with Home/Summary and Reports pages — see src/lib/use-wholesale-financials.ts
const useFinancials = useWholesaleFinancials;


/* ============ PROFIT ============ */

type ProfitBucket = { profit: number; revenue: number; cost: number; qty: number };

function useProfit(workingDate: string) {
  return useQuery({
    queryKey: ["wh-profit", workingDate],
    staleTime: Infinity,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [products, sales] = await Promise.all([
        supabase.from("shop_products").select("id,purchase_price,price"),
        supabase.from("shop_sales" as any)
          .select("items,created_at")
          .eq("is_deleted", false)
          .neq("status", "cancelled"),
      ]);

      const costMap = new Map<string, number>();
      (products.data ?? []).forEach((p: any) =>
        costMap.set(p.id, Number(p.purchase_price ?? 0) || Number(p.price ?? 0))
      );

      // Anchor "today/month" to the global working date.
      const [wy, wm, wd] = workingDate.split("-").map(Number);
      const startOfDay = new Date(wy, (wm || 1) - 1, wd || 1);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay); endOfDay.setHours(23, 59, 59, 999);
      const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

      const make = (): ProfitBucket => ({ profit: 0, revenue: 0, cost: 0, qty: 0 });
      const daily = make(), monthly = make(), all = make();

      for (const row of (sales.data ?? []) as any[]) {
        const t = new Date(row.created_at).getTime();
        for (const it of (row.items ?? []) as any[]) {
          const pid = it.product_id ?? it.id;
          const qty = Number(it.qty ?? 0);
          const sale = Number(it.price ?? 0);
          if (!pid || qty <= 0) continue;
          const cost = costMap.get(pid) ?? 0;
          const rev = sale * qty;
          const totalCost = cost * qty;
          const profit = rev - totalCost;

          all.profit += profit; all.revenue += rev; all.cost += totalCost; all.qty += qty;
          if (t >= startOfMonth.getTime() && t <= endOfDay.getTime()) {
            monthly.profit += profit; monthly.revenue += rev; monthly.cost += totalCost; monthly.qty += qty;
          }
          if (t >= startOfDay.getTime() && t <= endOfDay.getTime()) {
            daily.profit += profit; daily.revenue += rev; daily.cost += totalCost; daily.qty += qty;
          }
        }
      }

      return { daily, monthly, all };
    },
  });
}

/* ============ RECENT ENTRY ============ */

type EntryKind = "sale" | "purchase" | "payment_in" | "payment_out";

type Entry = {
  id: string;          // composite for list keys
  refId: string;       // underlying row id
  kind: EntryKind;
  title: string;
  subtitle?: string | null;
  amount: number;
  at: string;
};

const ENTRY_PAGE = 10;
type EntryFilter = "all" | "sale" | "purchase" | "payment";

function useRecentEntriesPaged(filter: EntryFilter) {
  return useInfiniteQuery({
    queryKey: ["wh-recent-entries", filter],
    staleTime: Infinity,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    initialPageParam: null as string | null,
    getNextPageParam: (last: { items: Entry[]; nextCursor: string | null }) => last.nextCursor,
    queryFn: async ({ pageParam }): Promise<{ items: Entry[]; nextCursor: string | null }> => {
      const cursor = (pageParam as string | null) ?? new Date(Date.now() + 60_000).toISOString();
      const bucket: Entry[] = [];
      const wantSale = filter === "all" || filter === "sale";
      const wantPurchase = filter === "all" || filter === "purchase";
      const wantPayment = filter === "all" || filter === "payment";

      const tasks: PromiseLike<any>[] = [];
      if (wantSale) tasks.push(
        supabase.from("shop_sales" as any)
          .select("id,invoice_number,customer_name,total,created_at")
          .eq("is_deleted", false).lt("created_at", cursor)
          .order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );
      if (wantPurchase) tasks.push(
        supabase.from("shop_purchases")
          .select("id,invoice_number,supplier_name,total,created_at")
          .eq("is_deleted", false).lt("created_at", cursor)
          .order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );
      if (wantPayment) tasks.push(
        supabase.from("pos_payments" as any)
          .select("id,amount,kind,notes,created_at,customer_id")
          .lt("created_at", cursor)
          .order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );

      const results = await Promise.all(tasks);
      let i = 0;
      if (wantSale) {
        (results[i++].data ?? []).forEach((r: any) => bucket.push({
          id: `s-${r.id}`, refId: r.id, kind: "sale",
          title: r.customer_name || "Walk-in",
          subtitle: `Invoice #${r.invoice_number}`,
          amount: Number(r.total ?? 0), at: r.created_at,
        }));
      }
      if (wantPurchase) {
        (results[i++].data ?? []).forEach((r: any) => bucket.push({
          id: `p-${r.id}`, refId: r.id, kind: "purchase",
          title: r.supplier_name || "Supplier",
          subtitle: `Invoice #${r.invoice_number}`,
          amount: Number(r.total ?? 0), at: r.created_at,
        }));
      }
      if (wantPayment) {
        const rows = (results[i++].data ?? []) as any[];
        const ids = Array.from(new Set(rows.map((r) => r.customer_id).filter(Boolean))) as string[];
        const custMap = new Map<string, string>();
        if (ids.length) {
          const { data: customers } = await supabase.from("pos_customers").select("id,name").in("id", ids);
          (customers ?? []).forEach((c: any) => custMap.set(c.id, c.name));
        }
        rows.forEach((r) => {
          const isIn = r.kind === "payment_in";
          bucket.push({
            id: `${r.kind}-${r.id}`, refId: r.id,
            kind: isIn ? "payment_in" : "payment_out",
            title: (r.customer_id && custMap.get(r.customer_id)) || (isIn ? "Customer" : "Expense"),
            subtitle: r.notes || (isIn ? "Payment received" : "Payment out"),
            amount: Number(r.amount ?? 0), at: r.created_at,
          });
        });
      }

      bucket.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      const items = bucket.slice(0, ENTRY_PAGE);
      const nextCursor = items.length === ENTRY_PAGE ? items[items.length - 1].at : null;
      return { items, nextCursor };
    },
  });
}

/* ============ UI ============ */

type MetricKey = "warehouse" | "stock" | "receivable" | "converted";

function FinancialSummaryCard({
  onRefresh, onMetric,
}: {
  onRefresh: () => void;
  onMetric: (k: MetricKey) => void;
}) {
  const { data, isFetching } = useFinancials();
  const d = data;

  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 p-0 shadow-sm">
      <div className="flex items-end justify-between gap-3 border-b border-border/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Wholesale value
            </p>
            <InfoChip onClick={() => onMetric("warehouse")} />
          </div>
          <p className="mt-0.5 truncate text-[22px] font-bold leading-none tabular-nums">
            {d ? fmt(d.warehouseValue) : "—"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Stock + Receivable</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-background active:scale-95"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin text-primary" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 py-3">
        <Metric icon={Boxes} label="Stock" value={d ? fmt(d.currentStock) : "—"}
          onClick={() => onMetric("stock")} onInfo={() => onMetric("stock")} />
        <Metric icon={ArrowDownLeft} label="Receivable" value={d ? fmt(d.receivable) : "—"}
          tone={d && d.receivable > 0 ? "danger" : "muted"}
          onClick={() => onMetric("receivable")} onInfo={() => onMetric("receivable")} />
        <Metric icon={Coins} label="Converted" value={d ? fmt(d.convertedToCash) : "—"}
          tone={d && d.convertedToCash >= 0 ? "success" : "danger"}
          onInfo={() => onMetric("converted")} />
      </div>
    </Card>
  );
}

function InfoChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="More info"
    >
      <Info className="h-3 w-3" />
    </button>
  );
}

function Metric({
  icon: Icon, label, value, tone, onClick, onInfo,
}: {
  icon: any; label: string; value: string;
  tone?: "danger" | "success" | "muted";
  onClick?: () => void;
  onInfo?: () => void;
}) {
  const color =
    tone === "danger" ? "text-rose-600 dark:text-rose-400"
    : tone === "success" ? "text-emerald-600 dark:text-emerald-400"
    : "text-foreground";
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => { if (interactive && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick?.(); } }}
      className={`min-w-0 rounded-xl p-2 transition-colors ${interactive ? "cursor-pointer hover:bg-muted/60 active:bg-muted" : ""}`}
    >
      <div className="mb-0.5 flex items-center justify-between gap-1 text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1">
          <Icon className="h-3 w-3 shrink-0" />
          <span className="truncate text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </div>
        {onInfo && <InfoChip onClick={onInfo} />}
      </div>
      <p className={`truncate text-[13px] font-bold tabular-nums leading-tight ${color}`}>{value}</p>
    </div>
  );
}

/* ============ PROFIT CARD ============ */

type ProfitPeriod = "daily" | "monthly" | "all";
const PERIOD_LABEL: Record<ProfitPeriod, string> = {
  daily: "Daily", monthly: "Monthly", all: "All Time",
};

function ProfitCard() {
  const { workingDate } = useWorkingDate();
  const { data, isFetching } = useProfit(workingDate);
  const [period, setPeriod] = useState<ProfitPeriod>("monthly");
  const [open, setOpen] = useState(false);
  const b = data ? data[period] : null;

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-2xl border-border/60 p-3 shadow-sm transition-shadow hover:shadow-md active:scale-[0.997]"
        role="button"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Profit · {PERIOD_LABEL[period]}
              </p>
              <p className="truncate text-[18px] font-bold leading-tight tabular-nums text-emerald-600 dark:text-emerald-400">
                {b ? fmt(b.profit) : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-1 text-[10px] text-muted-foreground">
            Change <ChevronRight className="h-3 w-3" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
          <span>Sold: <b className="text-foreground tabular-nums">{b?.qty ?? 0}</b></span>
          <span>Sales: <b className="text-foreground tabular-nums">{b ? fmt(b.revenue) : "—"}</b></span>
          {isFetching && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
        </div>
      </Card>

      <ProfitDetailsDialog
        open={open} onOpenChange={setOpen}
        period={period} setPeriod={setPeriod}
        data={data ?? null}
      />
    </>
  );
}

function ProfitDetailsDialog({
  open, onOpenChange, period, setPeriod, data,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  period: ProfitPeriod;
  setPeriod: (p: ProfitPeriod) => void;
  data: { daily: ProfitBucket; monthly: ProfitBucket; all: ProfitBucket } | null;
}) {
  const b = data ? data[period] : null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">Profit details</DialogTitle>
        </DialogHeader>
        <div className="px-5 py-4">
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/60 p-1">
            {(["daily", "monthly", "all"] as ProfitPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all ${
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Net realized profit · {PERIOD_LABEL[period]}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {b ? fmt(b.profit) : "—"}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              (Sale rate − Purchase rate) × Sold qty
            </p>
          </div>

          <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            <DetailRow label="Total sold items">{b?.qty ?? 0}</DetailRow>
            <DetailRow label="Total sales">{b ? fmt(b.revenue) : "—"}</DetailRow>
            <DetailRow label="Total purchase cost">{b ? fmt(b.cost) : "—"}</DetailRow>
            <DetailRow label="Net realized profit">
              <span className="text-emerald-600 dark:text-emerald-400">{b ? fmt(b.profit) : "—"}</span>
            </DetailRow>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ENTRY_CFG: Record<EntryKind, { icon: any; tone: string; label: string; sign: "+" | "−" }> = {
  sale:        { icon: ShoppingBag,   tone: "text-emerald-600 bg-emerald-500/10", label: "Sale",        sign: "+" },
  purchase:    { icon: Truck,         tone: "text-amber-600 bg-amber-500/10",     label: "Purchase",    sign: "−" },
  payment_in:  { icon: ArrowDownLeft, tone: "text-emerald-600 bg-emerald-500/10", label: "Payment In",  sign: "+" },
  payment_out: { icon: ArrowUpRight,  tone: "text-rose-600 bg-rose-500/10",       label: "Payment Out", sign: "−" },
};

const EntryRow = memo(function EntryRow({ e, onOpen }: { e: Entry; onOpen: (e: Entry) => void }) {
  const cfg = ENTRY_CFG[e.kind];
  const Icon = cfg.icon;
  const time = new Date(e.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const date = new Date(e.at).toLocaleDateString(undefined, { day: "2-digit", month: "short" });

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(e)}
        onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") onOpen(e); }}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-1.5 py-2.5 text-left transition-colors hover:bg-muted/50 active:bg-muted"
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{cfg.label}</span>
            <span className="text-[10px] text-muted-foreground">· {date} {time}</span>
          </div>
          <p className="truncate text-[13px] font-medium leading-tight">{e.title}</p>
          {e.subtitle && <p className="truncate text-[10px] text-muted-foreground">{e.subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`text-[13px] font-semibold tabular-nums ${
            cfg.sign === "−" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
          }`}>
            {cfg.sign} {fmt(e.amount)}
          </span>
          {e.kind === "sale" && <SaleWhatsAppButton saleId={e.refId} />}
        </div>
      </div>
    </li>
  );
});

function SaleWhatsAppButton({ saleId }: { saleId: string }) {
  const [busy, setBusy] = useState(false);
  const onClick = useCallback(async (ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const [{ buildAm80DataFromSaleId }, { shareAm80Image }] = await Promise.all([
        import("@/lib/invoice-am80/from-sale"),
        import("@/lib/invoice-am80/share"),
      ]);
      const data = await buildAm80DataFromSaleId(saleId);
      if (!data) { toast.error("Sale not found"); return; }
      await shareAm80Image(data);
    } catch (e: any) {
      toast.error(e?.message ?? "Share failed");
    } finally {
      setBusy(false);
    }
  }, [saleId, busy]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Share on WhatsApp"
      title="Share on WhatsApp"
      disabled={busy}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20 disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageCircle className="h-3.5 w-3.5" />}
    </button>
  );
}

const ENTRY_FILTERS: { key: EntryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sale" },
  { key: "purchase", label: "Purchase" },
  { key: "payment", label: "Payment" },
];

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 px-1.5 py-2.5">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-3 w-14 animate-pulse rounded bg-muted" />
    </li>
  );
}

function RecentEntryCard({ onOpen }: { onOpen: (e: Entry) => void }) {
  const [filter, setFilter] = useState<EntryFilter>("all");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecentEntriesPaged(filter);

  const items = useMemo(() => {
    const seen = new Set<string>();
    const out: Entry[] = [];
    (data?.pages ?? []).forEach((p) => p.items.forEach((it) => {
      if (!seen.has(it.id)) { seen.add(it.id); out.push(it); }
    }));
    return out;
  }, [data]);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Recent entry
        </h2>
        <Badge variant="outline" className="rounded-full text-[10px]">{items.length}</Badge>
      </div>
      <div className="mb-2 flex gap-1 overflow-x-auto">
        {ENTRY_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <Card className="rounded-2xl p-2">
        {isLoading ? (
          <ul className="divide-y divide-border/40">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </ul>
        ) : !items.length ? (
          <p className="px-2 py-8 text-center text-sm text-muted-foreground">No entries yet.</p>
        ) : (
          <>
            <ul className="divide-y divide-border/40">
              {items.map((e) => <EntryRow key={e.id} e={e} onOpen={onOpen} />)}
            </ul>
            {hasNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-2 w-full rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 disabled:opacity-60"
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </Card>
    </section>
  );
}

/* ============ PURCHASE / PAYMENT DETAIL DIALOG ============ */

function PurchaseDetailDialog({
  open, onOpenChange, purchaseId,
}: { open: boolean; onOpenChange: (v: boolean) => void; purchaseId: string | null }) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);


  const { data, isLoading } = useQuery({
    queryKey: ["wh-purchase-detail", purchaseId],
    enabled: open && !!purchaseId,
    queryFn: async () => {
      const { data } = await supabase.from("shop_purchases").select("*").eq("id", purchaseId!).maybeSingle();
      return data;
    },
  });

  const handleDelete = async () => {
    if (!data) return;
    const d: any = data;
    if (!(await confirm({
      title: "Delete entry?",
      description: "This entry will move to Recycle Bin and stock will be restored.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning",
      details: [
        { label: "Entry Type", value: "Purchase" },
        { label: "Invoice No", value: d.invoice_number || "—" },
        { label: "Customer/Supplier", value: d.supplier_name || "—" },
        { label: "Amount", value: `SAR ${Number(d.total ?? 0).toFixed(2)}` },
        { label: "Date", value: new Date(d.created_at).toLocaleDateString() },
      ],
    }))) return;
    setBusy(true);
    const { error } = await softDelete("shop_purchases", d.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Moved to Recycle Bin", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: rErr } = await restore("shop_purchases", d.id);
          if (rErr) { toast.error(rErr.message); return; }
          toast.success("Purchase restored");
          qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
          qc.invalidateQueries({ queryKey: ["wh-financials"] });
          qc.invalidateQueries({ queryKey: ["wh-profit"] });
        },
      },
    });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    onOpenChange(false);
  };

// Purchase share removed: Wholesale page now supports only Invoice V2 and 80mm by AM,
// both of which are sales-only invoice templates.

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">Purchase Entry</DialogTitle>
        </DialogHeader>
        {isLoading || !data ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Total Purchase</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{SAR((data as any).total)}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Invoice #{(data as any).invoice_number} · {new Date((data as any).created_at).toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">Supplier: {(data as any).supplier_name}</p>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-card">
              <div className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Items
              </div>
              <ul className="divide-y divide-border/60">
                {((data as any).items ?? []).map((it: any, i: number) => (
                  <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                    <span className="min-w-0 truncate">{it.name}</span>
                    <span className="shrink-0 text-muted-foreground tabular-nums">
                      {Number(it.qty ?? 0)} × {SAR(it.price)}
                    </span>
                  </li>
                ))}
                {(!((data as any).items?.length)) && (
                  <li className="px-3 py-3 text-center text-xs text-muted-foreground">No items</li>
                )}
              </ul>
              <div className="flex items-center justify-between border-t border-border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{SAR((data as any).subtotal)}</span>
              </div>
              {Number((data as any).tax ?? 0) > 0 && (
                <div className="flex items-center justify-between px-3 py-1 text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums">{SAR((data as any).tax)}</span>
                </div>
              )}
            </div>

            {(data as any).notes && (
              <p className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap">
                {(data as any).notes}
              </p>
            )}

          </div>
        )}

        <div className="flex gap-2 border-t border-border bg-muted/20 px-5 py-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="mr-1.5 h-3.5 w-3.5" /> Close
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setEditOpen(true)} disabled={busy || !data}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete} disabled={busy || !data}>
            {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
      </DialogContent>
      <TransactionDialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) {
            qc.invalidateQueries({ queryKey: ["wh-purchase-detail", purchaseId] });
            onOpenChange(false);
          }
        }}
        kind="purchase"
        editId={purchaseId}
      />
    </Dialog>
  );
}


function PaymentDetailDialog({
  open, onOpenChange, paymentId, kind,
}: { open: boolean; onOpenChange: (v: boolean) => void; paymentId: string | null; kind: "payment_in" | "payment_out" }) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const isIn = kind === "payment_in";

  const { data, isLoading } = useQuery({
    queryKey: ["wh-payment-detail", paymentId],
    enabled: open && !!paymentId,
    queryFn: async () => {
      const { data } = await supabase
        .from("pos_payments" as any)
        .select("*, pos_customers(name,phone)")
        .eq("id", paymentId!)
        .maybeSingle();
      return data as any;
    },
  });

  const handleDelete = async () => {
    if (!data) return;
    if (!(await confirm({
      title: "Delete entry?",
      description: "This entry will be removed and the customer balance will be restored.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning",
      details: [
        { label: "Entry Type", value: isIn ? "Payment In" : "Payment Out" },
        { label: "Invoice No", value: data.reference || data.id?.slice(0, 8) || "—" },
        { label: "Customer/Supplier", value: data.pos_customers?.name || (isIn ? "Customer" : "Expense") },
        { label: "Amount", value: `SAR ${Number(data.amount ?? 0).toFixed(2)}` },
        { label: "Date", value: new Date(data.created_at).toLocaleDateString() },
      ],
    }))) return;
    setBusy(true);
    const { error } = await supabase.from("pos_payments" as any).delete().eq("id", data.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Payment deleted");
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    onOpenChange(false);
  };

  const handleShare = async () => {
    if (!data) return;
    const title = isIn ? "Payment In Receipt" : "Payment Out";
    const partyName = data.pos_customers?.name || (isIn ? "Customer" : "Expense");
    await shareToWhatsApp({
      title,
      subtitle: data.pos_customers?.phone || undefined,
      amount: SAR(data.amount),
      amountLabel: title,
      date: new Date(data.created_at).toLocaleString(),
      rows: [
        { label: "Party", value: partyName },
        { label: "Method", value: data.method || "cash" },
        { label: "Date", value: new Date(data.created_at).toLocaleString() },
      ],
      notes: data.notes || undefined,
      accent: isIn ? "in" : "out",
      caption: `${title} · ${partyName} · ${SAR(data.amount)}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">
            {isIn ? "Payment In" : "Payment Out"}
          </DialogTitle>
        </DialogHeader>
        {isLoading || !data ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
            <div className={`rounded-2xl p-4 ${isIn ? "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5" : "bg-gradient-to-br from-rose-500/15 to-rose-500/5"}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${isIn ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                Amount
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{SAR(data.amount)}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {new Date(data.created_at).toLocaleString()}
              </p>
            </div>
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              <DetailRow label="Party">{data.pos_customers?.name || "—"}</DetailRow>
              <DetailRow label="Method">{data.method || "cash"}</DetailRow>
              <DetailRow label="Date">{new Date(data.txn_date).toLocaleDateString()}</DetailRow>
              {data.notes && <DetailRow label="Notes">{data.notes}</DetailRow>}
            </dl>

            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full border-success/40 text-success hover:bg-success/10"
              onClick={handleShare}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Share as Image
            </Button>
          </div>
        )}

        <div className="flex gap-2 border-t border-border bg-muted/20 px-5 py-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="mr-1.5 h-3.5 w-3.5" /> Close
          </Button>
          <Button variant="destructive" size="sm" className="flex-1" onClick={handleDelete} disabled={busy || !data}>
            {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-2.5">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{children}</dd>
    </div>
  );
}


/* ============ ROOT ============ */



export function WholesaleDashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: fin } = useFinancials();

  const [saleId, setSaleId] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [payment, setPayment] = useState<{ id: string; kind: "payment_in" | "payment_out" } | null>(null);
  const [infoKey, setInfoKey] = useState<MetricKey | null>(null);
  const [receivableOpen, setReceivableOpen] = useState(false);
  const [customer, setCustomer] = useState<PosCustomer | null>(null);

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
  };

  const openEntry = useCallback((e: Entry) => {
    if (e.kind === "sale") setSaleId(e.refId);
    else if (e.kind === "purchase") setPurchaseId(e.refId);
    else setPayment({ id: e.refId, kind: e.kind });
  }, []);

  const onMetric = (k: MetricKey) => {
    if (k === "stock") {
      navigate({ to: "/store-admin", search: { tab: "products" } as any });
      return;
    }
    if (k === "receivable") {
      setReceivableOpen(true);
      return;
    }
    setInfoKey(k);
  };

  return (
    <div className="space-y-3">
      <FinancialSummaryCard onRefresh={refreshAll} onMetric={onMetric} />
      <ProfitCard />
      <RecentEntryCard onOpen={openEntry} />


      <PosSaleDetailsDialog open={!!saleId} onOpenChange={(v) => !v && setSaleId(null)} saleId={saleId} />
      <PurchaseDetailDialog open={!!purchaseId} onOpenChange={(v) => !v && setPurchaseId(null)} purchaseId={purchaseId} />
      <PaymentDetailDialog
        open={!!payment}
        onOpenChange={(v) => !v && setPayment(null)}
        paymentId={payment?.id ?? null}
        kind={payment?.kind ?? "payment_in"}
      />
      <MetricInfoDialog metric={infoKey} onOpenChange={(v) => !v && setInfoKey(null)} fin={fin ?? null} />
      <ReceivableBreakdownDialog
        open={receivableOpen}
        onOpenChange={setReceivableOpen}
        onOpenCustomer={(c) => { setReceivableOpen(false); setCustomer(c); }}
      />
      <PosCustomerStatementDialog
        open={!!customer}
        onOpenChange={(v) => !v && setCustomer(null)}
        customer={customer}
      />
    </div>
  );
}

/* ============ METRIC INFO DIALOG ============ */

function MetricInfoDialog({
  metric, onOpenChange, fin,
}: {
  metric: MetricKey | null;
  onOpenChange: (v: boolean) => void;
  fin: { currentStock: number; receivable: number; warehouseValue: number; convertedToCash: number; openingBalance: number; openingDue: number; salesDue: number; paidIn: number } | null;
}) {
  const open = !!metric;
  const title =
    metric === "warehouse" ? "Wholesale value"
    : metric === "stock" ? "Current stock"
    : metric === "receivable" ? "Receivable"
    : metric === "converted" ? "Converted to cash"
    : "";

  const body = (() => {
    if (!metric || !fin) return null;
    if (metric === "warehouse") return (
      <>
        <FormulaLine>Wholesale Value = Current Stock + Receivable</FormulaLine>
        <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          <DetailRow label="Current Stock">{fmt(fin.currentStock)}</DetailRow>
          <DetailRow label="Receivable">{fmt(fin.receivable)}</DetailRow>
          <DetailRow label="Total"><b className="text-primary">{fmt(fin.warehouseValue)}</b></DetailRow>
        </dl>
      </>
    );
    if (metric === "stock") return (
      <>
        <FormulaLine>Current Stock = Σ(stock × purchase/cost rate)</FormulaLine>
        <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          <DetailRow label="Total stock value"><b>{fmt(fin.currentStock)}</b></DetailRow>
        </dl>
      </>
    );
    if (metric === "receivable") return (
      <>
        <FormulaLine>Receivable = Opening Due + Sales Due − Payments In</FormulaLine>
        <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          <DetailRow label="Opening due">{fmt(fin.openingDue)}</DetailRow>
          <DetailRow label="Sales due">{fmt(fin.salesDue)}</DetailRow>
          <DetailRow label="Payments in">− {fmt(fin.paidIn)}</DetailRow>
          <DetailRow label="Total receivable"><b className="text-rose-600 dark:text-rose-400">{fmt(fin.receivable)}</b></DetailRow>
        </dl>
      </>
    );
    return (
      <>
        <FormulaLine>Converted To Cash = Opening Balance − Wholesale Value</FormulaLine>
        <dl className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          <DetailRow label="Opening balance">{fmt(fin.openingBalance)}</DetailRow>
          <DetailRow label="Wholesale value">− {fmt(fin.warehouseValue)}</DetailRow>
          <DetailRow label="Converted">
            <b className={fin.convertedToCash >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {fmt(fin.convertedToCash)}
            </b>
          </DetailRow>
        </dl>
      </>
    );
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="px-5 py-4">{body}</div>
      </DialogContent>
    </Dialog>
  );
}

function FormulaLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-primary/10 px-3 py-2 text-[12px] font-medium text-primary">
      {children}
    </div>
  );
}

/* ============ RECEIVABLE BREAKDOWN ============ */

type DueRow = { customer: PosCustomer; due: number };

function useReceivableBreakdown(enabled: boolean) {
  return useQuery({
    queryKey: ["wh-receivable-breakdown"],
    enabled,
    staleTime: Infinity,
    queryFn: async (): Promise<DueRow[]> => {
      const [custRes, salesRes, payRes] = await Promise.all([
        supabase.from("pos_customers").select("*").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales" as any).select("customer_id,due_amount,status")
          .not("customer_id", "is", null).eq("is_deleted", false),
        supabase.from("pos_payments" as any).select("customer_id,amount,kind"),
      ]);
      const map = new Map<string, number>();
      for (const c of (custRes.data ?? []) as any[]) map.set(c.id, Number(c.opening_due ?? 0));
      for (const s of (salesRes.data ?? []) as any[]) {
        if (!s.customer_id || s.status === "cancelled") continue;
        map.set(s.customer_id, (map.get(s.customer_id) ?? 0) + Number(s.due_amount ?? 0));
      }
      for (const p of (payRes.data ?? []) as any[]) {
        if (!p.customer_id || p.kind !== "payment_in") continue;
        map.set(p.customer_id, (map.get(p.customer_id) ?? 0) - Number(p.amount ?? 0));
      }
      return ((custRes.data ?? []) as any[])
        .map((c) => ({ customer: c as PosCustomer, due: map.get(c.id) ?? 0 }))
        .filter((r) => r.due > 0.5)
        .sort((a, b) => b.due - a.due);
    },
  });
}

function ReceivableBreakdownDialog({
  open, onOpenChange, onOpenCustomer,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenCustomer: (c: PosCustomer) => void;
}) {
  const { data, isLoading } = useReceivableBreakdown(open);
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter((r) =>
      r.customer.name.toLowerCase().includes(term) ||
      (r.customer.phone ?? "").toLowerCase().includes(term)
    );
  }, [data, q]);
  const total = useMemo(() => (data ?? []).reduce((s, r) => s + r.due, 0), [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">Receivable breakdown</DialogTitle>
        </DialogHeader>
        <div className="px-5 py-3">
          <div className="rounded-2xl bg-gradient-to-br from-rose-500/15 to-rose-500/5 p-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Total customer dues
            </p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400">{fmt(total)}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{rows.length} customers · sorted by highest due</p>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer…"
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="max-h-[55vh] overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
          ) : !rows.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No outstanding dues.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {rows.map((r) => (
                <li key={r.customer.id}>
                  <button
                    type="button"
                    onClick={() => onOpenCustomer(r.customer)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60 active:bg-muted"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{r.customer.name}</p>
                      {r.customer.phone && (
                        <p className="truncate text-[10px] text-muted-foreground">{r.customer.phone}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                      {fmt(r.due)}
                    </span>
                    <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
