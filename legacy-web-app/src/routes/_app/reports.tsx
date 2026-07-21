import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SARAmount } from "@/components/sar-amount";
import { SAR, SAR_WHOLE, TXN_LABELS } from "@/lib/format";
import {
  Download,
  FileText,
  Share2,
  LayoutDashboard,
  Store,
  ArrowLeftRight,
  Warehouse,
  Users,
  MessageCircle,
  Pencil,
  Trash2,
  CalendarDays,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sortShops, shopRank } from "@/lib/shop-order";
import { RecordDetailDialog, type RecordKind } from "@/components/record-detail-dialog";
import { ShopDrilldownSheet, type DrillKind } from "@/components/shop-drilldown-sheet";
import { InfoButton } from "@/components/info-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { softDelete } from "@/lib/soft-delete";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useShopPositions } from "@/hooks/use-shop-positions";
import { WholeSaleReport } from "@/components/wholesale-report";
import { useWorkingDate } from "@/hooks/use-working-date";


export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

type TabKey = "all" | "shop" | "transaction" | "employee" | "warehouse" | "wholesale";

type ActiveRecord = { id: string; kind: RecordKind } | null;

function ReportsPage() {
  const qc = useQueryClient();
  const { workingDate } = useWorkingDate();
  // Anchor default range to the global workingDate (last-30-days ending at it).
  const workingDateObj = useMemo(() => {
    const [y, m, d] = workingDate.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [workingDate]);
  const [tab, setTab] = useState<TabKey>("all");
  const [active, setActive] = useState<ActiveRecord>(null);
  const openRecord = (kind: RecordKind, id: string) => setActive({ kind, id });
  const [from, setFrom] = useState(
    format(new Date(workingDateObj.getTime() - 30 * 86400000), "yyyy-MM-dd"),
  );
  const [to, setTo] = useState(format(workingDateObj, "yyyy-MM-dd"));

  // ── Manual-generate gate ─────────────────────────────────
  // Snapshot the filters that were active when the user pressed Generate.
  // The rendered report uses ONLY these snapshots — changing tab/from/to
  // afterwards never re-fetches, re-filters, or re-renders the report.
  const [generated, setGenerated] = useState(false);
  const [lastGenAt, setLastGenAt] = useState<Date | null>(null);
  const [genSig, setGenSig] = useState<string>("");
  const [gTab, setGTab] = useState<TabKey>("all");
  const [gFrom, setGFrom] = useState<string>("");
  const [gTo, setGTo] = useState<string>("");
  const currentSig = `${tab}|${from}|${to}`;
  const filtersChanged = generated && genSig !== currentSig;

  const REPORT_KEYS = [
    "txns","shops","cashiers","parties","wh_ledger","shop_entries","categories","app_settings","employees","employee_entries",
    "ws-cust-sales","ws-supplier","ws-product-sales","ws-stock","ws-profit","ws-payments","ws-dues","ws-activity",
  ];

  function handleGenerate(force = false) {
    if (force) {
      for (const k of REPORT_KEYS) qc.invalidateQueries({ queryKey: [k] });
    }
    setGenerated(true);
    setGenSig(currentSig);
    setGTab(tab);
    setGFrom(from);
    setGTo(to);
    setLastGenAt(new Date());
  }

  // ── Data (only fetched after Generate) ───────────────────
  const { data: txns = [], isFetching: f1 } = useQuery<any[]>({
    queryKey: ["txns"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      ((await supabase.from("transactions").select("*").eq("is_deleted", false).order("txn_date", { ascending: false })).data ?? []) as any[],
  });
  const { data: shops = [], isFetching: f2 } = useQuery<any[]>({
    queryKey: ["shops"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops((data ?? []) as any[]);
    },
  });
  const { data: cashiers = [], isFetching: f3 } = useQuery<any[]>({
    queryKey: ["cashiers"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("cashiers").select("*").eq("is_deleted", false)).data ?? [],
  });
  const { data: parties = [], isFetching: f4 } = useQuery<any[]>({
    queryKey: ["parties"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (((await (supabase as any).from("parties").select("*").eq("is_deleted", false).order("name")).data) ?? []) as any[],
  });
  const { data: wh = [], isFetching: f5 } = useQuery<any[]>({
    queryKey: ["wh_ledger"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      ((await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false).order("txn_date", { ascending: false })).data ?? []) as any[],
  });
  const { data: shopEntries = [], isFetching: f6 } = useQuery<any[]>({
    queryKey: ["shop_entries"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (((await (supabase as any).from("shop_entries").select("*").eq("is_deleted", false).order("txn_date", { ascending: false })).data) ?? []) as any[],
  });
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (((await (supabase as any).from("categories").select("*").eq("is_deleted", false)).data) ?? []) as any[],
  });
  const { data: settings } = useQuery<any>({
    queryKey: ["app_settings"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (await supabase.from("app_settings").select("*").eq("id", 1).single()).data,
  });
  const { data: employees = [] } = useQuery<any[]>({
    queryKey: ["employees"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (((await (supabase as any).from("employees").select("*").eq("is_deleted", false).order("name")).data) ?? []) as any[],
  });
  const { data: employeeEntries = [] } = useQuery<any[]>({
    queryKey: ["employee_entries"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () =>
      (((await (supabase as any).from("employee_entries").select("*").eq("is_deleted", false).order("txn_date", { ascending: false })).data) ?? []) as any[],
  });

  const isGenerating = generated && (f1 || f2 || f3 || f4 || f5 || f6);

  // Uses the snapshot dates captured at Generate time, not the live filters.
  const inRange = (d: string) => d >= gFrom && d <= gTo;
  const shopName = (id?: string | null) =>
    id ? (shops.find((s: any) => s.id === id)?.name ?? "—") : "—";
  const cashierName = (id?: string | null) =>
    id ? (cashiers.find((c: any) => c.id === id)?.name ?? "—") : "—";
  const partyName = (id?: string | null) =>
    id ? (parties.find((p: any) => p.id === id)?.name ?? "—") : "—";

  return (
    <div className="space-y-6 pb-10">

      {/* Top mode tabs */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl border bg-muted/40 p-1.5">
        {(
          [
            { k: "all", label: "All", icon: LayoutDashboard },
            { k: "shop", label: "Shop", icon: Store },
            { k: "transaction", label: "Transaction", icon: ArrowLeftRight },
            { k: "employee", label: "Employee", icon: Users },
          ] as { k: TabKey; label: string; icon: any }[]
        ).map(({ k, label, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium transition-all",
              tab === k
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("warehouse")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
            tab === "warehouse"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          <Warehouse className="h-3 w-3" /> Warehouse Report
        </button>
        <button
          onClick={() => setTab("wholesale")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
            tab === "wholesale"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          <Store className="h-3 w-3" /> WholeSale Report
        </button>
      </div>

      {/* Date range (shared) */}
      <Card className="p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9" />
          </div>
          <div className="col-span-2 flex items-end gap-2 sm:col-span-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => {
                setFrom(format(new Date(workingDateObj.getTime() - 7 * 86400000), "yyyy-MM-dd"));
                setTo(format(workingDateObj, "yyyy-MM-dd"));
              }}
            >
              7d
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => {
                setFrom(format(new Date(workingDateObj.getTime() - 30 * 86400000), "yyyy-MM-dd"));
                setTo(format(workingDateObj, "yyyy-MM-dd"));
              }}
            >
              30d
            </Button>
          </div>
        </div>
      </Card>

      {/* Generate / Refresh bar */}
      <Card className="flex flex-wrap items-center justify-between gap-2 p-3">
        <div className="min-w-0 text-[11px] text-muted-foreground">
          {!generated && <span>Pick a date range and tap Generate Report.</span>}
          {generated && lastGenAt && (
            <span>
              Last generated: <span className="font-medium text-foreground">{format(lastGenAt, "MMM d, HH:mm")}</span>
              {filtersChanged && <span className="ml-2 text-warning">· filters changed</span>}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {generated && (
            <Button size="sm" variant="outline" onClick={() => handleGenerate(true)} disabled={isGenerating}>
              Refresh Report
            </Button>
          )}
          <Button size="sm" onClick={() => handleGenerate(false)} disabled={isGenerating && !filtersChanged}>
            {generated ? (filtersChanged ? "Generate" : "Re-generate") : "Generate Report"}
          </Button>
        </div>
      </Card>

      {!generated ? (
        <Card className="flex flex-col items-center justify-center gap-2 p-10 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium">No report generated yet</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Reports stay paused for speed. Choose your tab and date range, then tap <span className="font-medium text-foreground">Generate Report</span>.
          </p>
        </Card>
      ) : isGenerating ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-20 animate-pulse bg-muted/40" />
            ))}
          </div>
          <Card className="h-48 animate-pulse bg-muted/40" />
        </div>
      ) : (
        <>


      {gTab === "all" && (
        <AllReport
          txns={txns}
          wh={wh}
          shopEntries={shopEntries}
          shops={shops}
          parties={parties}
          settings={settings}
          from={gFrom}
          to={gTo}
          inRange={inRange}
          shopName={shopName}
          openRecord={openRecord}
        />
      )}
      {gTab === "shop" && (
        <ShopReport
          shopEntries={shopEntries}
          shops={shops}
          cashiers={cashiers}
          from={gFrom}
          to={gTo}
          inRange={inRange}
          shopName={shopName}
          cashierName={cashierName}
          openRecord={openRecord}
        />
      )}
      {gTab === "transaction" && (
        <TransactionReport
          txns={txns}
          shops={shops}
          categories={categories}
          from={gFrom}
          to={gTo}
          inRange={inRange}
          shopName={shopName}
          openRecord={openRecord}
        />
      )}
      {gTab === "warehouse" && (
        <WarehouseReport
          wh={wh}
          parties={parties}
          from={gFrom}
          to={gTo}
          inRange={inRange}
          partyName={partyName}
          openRecord={openRecord}
        />
      )}
      {gTab === "employee" && (
        <EmployeeReport
          employees={employees}
          employeeEntries={employeeEntries}
          shops={shops}
          from={gFrom}
          to={gTo}
          setFrom={setFrom}
          setTo={setTo}
          inRange={inRange}
          shopName={shopName}
        />
      )}
      {gTab === "wholesale" && (
        <WholeSaleReport
          from={gFrom}
          to={gTo}
          snapshotKey={lastGenAt ? String(lastGenAt.getTime()) : ""}
        />
      )}
        </>
      )}



      <RecordDetailDialog
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        recordId={active?.id ?? null}
        kind={active?.kind ?? null}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Shared UI
// ──────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  tone = "default",
  infoKey,
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger" | "info" | "warning";
  infoKey?: string;
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-destructive"
        : tone === "info"
          ? "text-primary"
          : tone === "warning"
            ? "text-warning"
            : "text-foreground";
  return (
    <Card className="relative px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {infoKey && <InfoButton metric={infoKey} size="xs" />}
      </div>
      <div className={cn("mt-0.5", toneCls)}>
        <SARAmount value={value} size="md" />
      </div>
    </Card>
  );
}

function CashPositionCard({
  value,
  info,
}: {
  value: number;
  info: { title: string; what: string; formula: string; inputs?: string[] };
}) {
  const positive = value >= 0;
  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden px-4 py-3 transition-shadow",
        positive
          ? "border-2 border-success/40 bg-gradient-to-br from-success/15 via-success/5 to-card"
          : "border-2 border-destructive/40 bg-gradient-to-br from-destructive/15 via-destructive/5 to-card",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Cash Position
            </p>
            <InfoButton info={info} size="xs" />
          </div>
          <span
            className={cn(
              "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
              positive
                ? "bg-success/15 text-success"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {positive ? "Healthy Position" : "Negative Position"}
          </span>
        </div>
        <div className={cn("shrink-0", positive ? "text-success" : "text-destructive")}>
          <SARAmount value={value} size="xl" />
        </div>
      </div>
    </Card>
  );
}

function ExportBar({
  onCSV,
  onPDF,
  onShare,
}: {
  onCSV: () => void;
  onPDF: () => void;
  onShare: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onCSV}>
        <Download className="mr-1 h-4 w-4" /> Excel
      </Button>
      <Button variant="outline" size="sm" onClick={onPDF}>
        <FileText className="mr-1 h-4 w-4" /> PDF
      </Button>
      <Button
        size="sm"
        className="bg-success text-success-foreground hover:bg-success/90"
        onClick={onShare}
      >
        <Share2 className="mr-1 h-4 w-4" /> Share
      </Button>
    </div>
  );
}

function SubTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { k: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.k}
          onClick={() => onChange(o.k)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            value === o.k
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Export helpers
// ──────────────────────────────────────────────────────────

function downloadCSV(filename: string, rows: (string | number)[][]) {
  if (rows.length <= 1) {
    toast.error("No data to export");
    return;
  }
  const csv = rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported");
}

type SummaryRow = { label: string; value: number; highlight?: boolean; status?: string; hint?: string };

function openStatementPDF(
  title: string,
  summaryRows: SummaryRow[],
  opts: { scopeLabel: string; rangeLabel: string },
) {
  const w = window.open("", "_blank");
  if (!w) return;
  const normal = summaryRows.filter((s) => !s.highlight);
  const highlight = summaryRows.filter((s) => s.highlight);
  const lineHtml = normal
    .map(
      (s) =>
        `<div class="ln"><div class="lblwrap"><div class="lbl">${s.label}</div>${s.hint ? `<div class="hint">${s.hint}</div>` : ""}</div><span class="dots"></span><span class="amt">${SAR_WHOLE(s.value)}</span></div>`,
    )
    .join("");
  const hlHtml = highlight
    .map((s) => {
      const positive = s.value >= 0;
      const color = positive ? "#047857" : "#b91c1c";
      const bg = positive ? "#ecfdf5" : "#fef2f2";
      const status = s.status ?? (positive ? "Healthy Position" : "Negative Position");
      return `<div class="cashbox" style="border-color:${color};background:${bg}">
        <div class="cb-l">${s.label.toUpperCase()}</div>
        ${s.hint ? `<div class="cb-h">${s.hint}</div>` : ""}
        <div class="cb-s" style="color:${color}">${status}</div>
        <div class="cb-v" style="color:${color}">${SAR_WHOLE(s.value)}</div>
      </div>`;
    })
    .join("");
  const now = new Date();
  w.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      *{box-sizing:border-box}
      @page{size:A4;margin:12mm}
      body{font-family:Inter,Georgia,system-ui,Arial,sans-serif;padding:0;color:#0f172a;background:#fff;font-size:12px}
      .head{text-align:center;border-bottom:2px solid #0f172a;padding-bottom:6px;margin-bottom:8px}
      .head .co{font-size:24px;font-weight:700;letter-spacing:.01em}
      .head .ti{font-size:18px;font-weight:600;color:#334155;margin-top:2px}
      .head .dt{font-size:11px;font-weight:400;color:#64748b;margin-top:3px}
      .meta{display:flex;justify-content:space-between;font-size:10px;color:#475569;margin-bottom:10px;flex-wrap:wrap;gap:4px}
      .meta b{color:#0f172a}
      h2{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#475569;border-bottom:1px solid #cbd5e1;padding-bottom:3px;margin:0 0 4px}
      .stmt{padding:0 2px}
      .ln{display:flex;align-items:center;gap:6px;min-height:24px;max-height:28px;padding:2px 0}
      .lblwrap{display:flex;flex-direction:column;line-height:1.15}
      .ln .lbl{font-size:15px;font-weight:600;color:#0f172a;white-space:nowrap}
      .ln .hint{font-size:10px;font-weight:400;color:#666;padding-left:8px;margin-top:1px}
      .ln .dots{flex:0 1 60%;border-bottom:1px dotted #94a3b8}
      .ln .amt{font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;color:#0f172a;white-space:nowrap;text-align:right;margin-left:auto}
      .cashbox{margin-top:10px;border:2px solid;border-radius:8px;padding:10px 14px;text-align:center;page-break-inside:avoid}
      .cb-l{font-size:11px;font-weight:700;letter-spacing:.16em;color:#475569}
      .cb-h{font-size:10px;font-weight:400;color:#666;margin-top:1px}
      .cb-s{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
      .cb-v{font-size:22px;font-weight:800;letter-spacing:-0.01em;font-variant-numeric:tabular-nums;margin-top:3px}
      .footer{margin-top:10px;font-size:9px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:4px}
    </style></head><body>
    <div class="head">
      <div class="co">${opts.scopeLabel}</div>
      <div class="ti">${title}</div>
      <div class="dt">${opts.rangeLabel}</div>
    </div>
    <div class="meta">
      <div><b>Generated:</b> ${now.toLocaleString()}</div>
    </div>
    <h2>Financial Summary</h2>
    <div class="stmt">${lineHtml}</div>
    ${hlHtml}
    <div class="footer">Generated By AhsAN Manager · ShRiAh Group</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),250)</script>
    </body></html>`);
  w.document.close();
}

function SummaryStatement({
  scopeLabel,
  rangeLabel,
  rows,
}: {
  scopeLabel: string;
  rangeLabel: string;
  rows: SummaryRow[];
}) {
  const normal = rows.filter((r) => !r.highlight);
  const highlight = rows.filter((r) => r.highlight);
  const now = new Date();
  return (
    <div className="rounded-2xl border border-border/60 bg-card px-5 py-5 shadow-sm sm:px-8 sm:py-6 print:border-0 print:shadow-none print:px-2 print:py-2">
      <div className="border-b-2 border-foreground/80 pb-2 text-center">
        <div className="font-display text-[24px] font-bold leading-tight tracking-tight">{scopeLabel}</div>
        <div className="mt-1 text-[18px] font-semibold leading-tight text-foreground/80">Financial Summary Report</div>
        <div className="mt-1 text-[11px] font-normal text-muted-foreground">{rangeLabel}</div>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground">
        <div><span className="font-semibold text-foreground">Generated:</span> {now.toLocaleString()}</div>
      </div>
      <h3 className="mt-3 mb-1 border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Financial Summary
      </h3>
      <div className="px-1">
        {normal.map((r) => (
          <div key={r.label} className="flex items-center gap-2 py-0.5" style={{ maxHeight: 28 }}>
            <div className="flex flex-col leading-tight">
              <span className="whitespace-nowrap text-[15px] font-semibold text-foreground">{r.label}</span>
              {r.hint && (
                <span className="pl-2 text-[10px] font-normal text-[#666]">{r.hint}</span>
              )}
            </div>
            <span className="flex-[0_1_60%] border-b border-dotted border-muted-foreground/60" />
            <span className="ml-auto whitespace-nowrap text-right text-[16px] font-bold tabular-nums text-foreground">
              {SAR_WHOLE(r.value)}
            </span>
          </div>
        ))}
      </div>
      {highlight.map((h) => {
        const positive = h.value >= 0;
        const status = h.status ?? (positive ? "Healthy Position" : "Negative Position");
        return (
          <div
            key={h.label}
            className={
              "mt-3 rounded-lg border-2 px-4 py-3 text-center " +
              (positive
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-rose-600 bg-rose-50 dark:bg-rose-950/30")
            }
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {h.label}
            </div>
            {h.hint && (
              <div className="mt-0.5 text-[10px] font-normal text-[#666]">{h.hint}</div>
            )}
            <div
              className={
                "mt-0.5 text-[10px] font-bold uppercase tracking-wider " +
                (positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")
              }
            >
              {status}
            </div>
            <div
              className={
                "mt-1 font-display text-2xl font-extrabold tabular-nums " +
                (positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")
              }
            >
              {SAR_WHOLE(h.value)}
            </div>
          </div>
        );
      })}
      <div className="mt-3 border-t border-border pt-2 text-center text-[9px] text-muted-foreground">
        Generated By AhsAN Manager · ShRiAh Group
      </div>
    </div>
  );
}



function openPDF(
  title: string,
  meta: string,
  summaryRows: SummaryRow[],
  table?: { headers: string[]; rows: (string | number)[][] },
  opts?: { statement?: boolean; scopeLabel?: string; rangeLabel?: string },
) {
  if (opts?.statement) {
    return openStatementPDF(title, summaryRows, {
      scopeLabel: opts.scopeLabel ?? "All Shops",
      rangeLabel: opts.rangeLabel ?? meta,
    });
  }
  const scopeLabel = opts?.scopeLabel ?? "All Shops";
  const w = window.open("", "_blank");
  if (!w) return;
  const normalRows = summaryRows.filter((s) => !s.highlight);
  const highlightRows = summaryRows.filter((s) => s.highlight);
  const summary = normalRows
    .map(
      (s) =>
        `<div class="kpi"><div class="kpi-l">${s.label}</div><div class="kpi-v">${SAR_WHOLE(s.value)}</div></div>`,
    )
    .join("");
  const highlightHtml = highlightRows
    .map((s) => {
      const positive = s.value >= 0;
      const color = positive ? "#059669" : "#dc2626";
      const bg = positive ? "#ecfdf5" : "#fef2f2";
      const status = s.status ?? (positive ? "Healthy Position" : "Negative Position");
      return `<div class="hl" style="border-color:${color};background:${bg}">
        <div><div class="hl-l">${s.label}</div><div class="hl-s" style="color:${color}">${status}</div></div>
        <div class="hl-v" style="color:${color}">${SAR_WHOLE(s.value)}</div>
      </div>`;
    })
    .join("");
  let detailsHtml = "";
  if (table && table.rows.length > 0) {
    const head = table.headers.map((h) => `<th>${h}</th>`).join("");
    const body = table.rows
      .map(
        (r) =>
          `<tr>${r
            .map(
              (c, i) =>
                `<td style="${i >= table.headers.length - 4 ? "text-align:right" : ""}">${
                  typeof c === "number" ? SAR(c) : String(c ?? "").replace(/</g, "&lt;")
                }</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");
    detailsHtml = `<h2>Details</h2><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  w.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      *{box-sizing:border-box}
      @page{size:A4;margin:12mm}
      body{font-family:Inter,system-ui,Arial,sans-serif;padding:0;color:#0f172a;background:#fff;font-size:11px}
      .brand{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5px solid #0f172a;padding-bottom:6px}
      .brand h1{margin:0;font-size:16px;letter-spacing:-0.01em}
      .brand p{margin:1px 0 0;color:#64748b;font-size:10px}
      h2{margin:10px 0 5px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#475569}
      .kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
      .kpi{border:1px solid #e2e8f0;border-radius:6px;padding:5px 7px;background:#f8fafc;page-break-inside:avoid}
      .kpi-l{font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:#64748b}
      .kpi-v{font-weight:700;font-size:12px;margin-top:1px;color:#0f172a;font-variant-numeric:tabular-nums}
      .hl{width:100%;border:1.5px solid;border-radius:8px;padding:8px 12px;margin-top:7px;display:flex;align-items:center;justify-content:space-between;gap:12px;page-break-inside:avoid}
      .hl-l{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569}
      .hl-v{font-size:20px;font-weight:800;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}
      .hl-s{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
      table{width:100%;border-collapse:collapse;font-size:10px;margin-top:4px}
      thead{display:table-header-group}
      tr{page-break-inside:avoid}
      th{background:#f1f5f9;text-align:left;padding:5px 7px;border-bottom:1px solid #cbd5e1;font-weight:600;color:#334155;font-size:9px}
      td{padding:4px 7px;border-bottom:1px solid #e2e8f0}
      tr:nth-child(even) td{background:#fafafa}
      .footer{margin-top:10px;font-size:9px;color:#94a3b8;text-align:center}
    </style></head><body>
    <div style="text-align:center;border-bottom:2px solid #0f172a;padding-bottom:6px;margin-bottom:8px">
      <div style="font-size:24px;font-weight:800;letter-spacing:-0.01em;color:#0f172a">${scopeLabel}</div>
      <div style="font-size:14px;font-weight:600;color:#334155;margin-top:2px">${title}</div>
    </div>
    <div class="brand"><div><h1>ShRiAh Group</h1><p>${title}</p></div><p>${meta}</p></div>
    <h2>Summary</h2><div class="kpis">${summary}</div>
    ${highlightHtml}
    ${detailsHtml}
    <div class="footer">Generated ${new Date().toLocaleString()}</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),250)</script>
    </body></html>`);
  w.document.close();
}


function shareWhatsApp(
  title: string,
  meta: string,
  summary: SummaryRow[],
) {
  const lines = [
    `*${title}*`,
    meta,
    ``,
    ...summary.map((s) => {
      if (s.highlight) {
        const status = s.status ?? (s.value >= 0 ? "Healthy Position" : "Negative Position");
        return `*${s.label}*: ${SAR_WHOLE(s.value)} (${status})`;
      }
      return `${s.label}: ${SAR_WHOLE(s.value)}`;

    }),
  ];
  window.open(
    `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`,
    "_blank",
  );
}

// ──────────────────────────────────────────────────────────
// ALL REPORT
// ──────────────────────────────────────────────────────────

function AllReport(props: any) {
  const { txns, wh, shopEntries, shops, parties, settings, from, to, inRange, shopName, openRecord } = props;

  const fTxns = txns.filter((t: any) => inRange(t.txn_date));
  const fWh = wh.filter((e: any) => inRange(e.txn_date));
  const fShop = shopEntries.filter((e: any) => inRange(e.txn_date));

  const sum = (arr: any[], k: string) =>
    arr.reduce((s, x) => s + Number(x[k] || 0), 0);
  const sumByType = (t: string) =>
    txns.filter((x: any) => x.type === t).reduce((s: number, x: any) => s + Number(x.amount), 0);

  const totalOpening = shops.reduce((s: number, x: any) => s + Number(x.opening_cash || 0), 0);
  const cashIn = sumByType("cash_in");
  const cashOut = sumByType("cash_out");
  const bankWithdraw = sumByType("bank_withdraw");
  const purchases = sumByType("purchase");
  const expenses = sumByType("expense") + sumByType("supervisor_payment");
  const adjustments = sumByType("adjustment");

  const cashInHand =
    totalOpening + cashIn + bankWithdraw - cashOut - purchases - expenses + adjustments;
  const bankBalance = -bankWithdraw;
  const totalExpense = cashOut + purchases + expenses;

  const openingStock = Number(settings?.opening_stock_value ?? 0);
  const openingDue = Number(settings?.opening_due_receivable ?? 0);
  const partyOpeningDue = parties.reduce((s: number, p: any) => s + Number(p.opening_due || 0), 0);
  const partyOpeningAdvance = parties.reduce((s: number, p: any) => s + Number(p.opening_advance || 0), 0);

  let whPurchases = 0;
  let whSales = 0;
  let whDueDelta = 0;
  for (const e of wh) {
    const amt = Number(e.amount) || 0;
    const due = Number(e.remaining_due) || 0;
    if (e.entry_type === "warehouse_purchase") whPurchases += amt;
    else if (e.entry_type === "warehouse_sale") {
      whSales += amt;
      if (e.payment_status === "credit") whDueDelta += amt;
      else if (e.payment_status === "partial") whDueDelta += due;
    } else if (e.entry_type === "payment_received") whDueDelta -= amt;
  }
  const dueReceivable = Math.max(
    0,
    openingDue + partyOpeningDue + whDueDelta - partyOpeningAdvance,
  );
  const warehouseValue = openingStock + dueReceivable + whPurchases - whSales;
  const netPosition = cashInHand + bankBalance + warehouseValue - totalExpense;

  const summary = [
    { label: "Cash In Hand", value: cashInHand },
    { label: "Bank Balance", value: bankBalance },
    { label: "Warehouse Value", value: warehouseValue },
    { label: "Total Expense", value: totalExpense },
    { label: "Due Receivable", value: dueReceivable },
    { label: "Net Position", value: netPosition },
  ];

  // Recent activity timeline (combined)
  const recent = [
    ...fTxns.map((t: any) => ({
      id: t.id,
      recordKind: "transaction" as RecordKind,
      date: t.txn_date,
      kind: "Transaction",
      label: `${TXN_LABELS[t.type] ?? t.type} · ${shopName(t.shop_id)}`,
      amount: Number(t.amount),
      sign: t.type === "cash_in" ? 1 : -1,
    })),
    ...fShop.map((e: any) => ({
      id: e.id,
      recordKind: "shop_entry" as RecordKind,
      date: e.txn_date,
      kind: "Shop",
      label: `${e.entry_type} · ${shopName(e.shop_id)}`,
      amount:
        e.entry_type === "sale"
          ? Number(e.cash_sale || 0) + Number(e.bank_sale || 0)
          : Number(e.purchase_amount || 0) + Number(e.withdraw_amount || 0),
      sign: e.entry_type === "purchase" ? -1 : 1,
    })),
    ...fWh.map((e: any) => ({
      id: e.id,
      recordKind: "warehouse_entry" as RecordKind,
      date: e.txn_date,
      kind: "Warehouse",
      label: `${e.entry_type} · ${e.party_name}`,
      amount: Number(e.amount),
      sign: e.entry_type === "warehouse_purchase" || e.entry_type === "supplier_payment" ? -1 : 1,
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 25);

  const meta = `${from} → ${to}`;
  const exportCSV = () => {
    const rows: (string | number)[][] = [["Metric", "Amount (SAR)"], ...summary.map((s) => [s.label, Math.round(s.value)])];
    rows.push([], ["Date", "Source", "Description", "Amount"]);
    recent.forEach((r) => rows.push([r.date, r.kind, r.label, (r.sign * r.amount).toFixed(2)]));
    downloadCSV(`master-summary-${from}-to-${to}.csv`, rows);
  };
  const exportPDF = () =>
    openPDF("Master Summary Report", meta, summary, {
      headers: ["Date", "Source", "Description", "Amount"],
      rows: recent.map((r) => [r.date, r.kind, r.label, r.sign * r.amount]),
    });
  const share = () => shareWhatsApp("Master Summary", meta, summary);


  return (
    <div className="space-y-4">
      <ExportBar onCSV={exportCSV} onPDF={exportPDF} onShare={share} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <SummaryCard infoKey="cash_in_hand" label="Cash In Hand" value={cashInHand} tone="success" />
        <SummaryCard infoKey="bank_balance" label="Bank Balance" value={bankBalance} tone="info" />
        <SummaryCard infoKey="warehouse_value" label="Warehouse Value" value={warehouseValue} tone="default" />
        <SummaryCard infoKey="total_expense" label="Total Expense" value={totalExpense} tone="danger" />
        <SummaryCard infoKey="due_receivable" label="Due Receivable" value={dueReceivable} tone="warning" />
        <SummaryCard infoKey="net_position" label="Net Position" value={netPosition} tone="success" />
      </div>


      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent activity
          </p>
        </div>
        <ul className="divide-y divide-border">
          {recent.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">
              No activity in range.
            </li>
          )}
          {recent.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => openRecord?.(r.recordKind, r.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/40 active:bg-accent/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.date} · {r.kind}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    r.sign > 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {r.sign > 0 ? "+" : "−"}
                  {SAR(r.amount)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <_unused v={sum(fWh, "amount")} />
    </div>
  );
}

// Tiny no-op to keep `sum` referenced without lint noise.
function _unused(_: { v: number }) {
  return null;
}

// ──────────────────────────────────────────────────────────
// Multi-select chips (used across all report filters)
// ──────────────────────────────────────────────────────────

type MSOption = { value: string; label: string };

function MultiSelectChips({
  label,
  options,
  selected,
  onChange,
  placeholder = "All",
}: {
  label: string;
  options: MSOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedSet = new Set(selected);
  const toggle = (v: string) => {
    const next = new Set(selectedSet);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange([...next]);
  };
  const remove = (v: string) => onChange(selected.filter((s) => s !== v));
  const clear = () => onChange([]);
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  return (
    <div className="relative">
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2 text-left text-sm"
      >
        <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
          {selected.length === 0
            ? placeholder
            : selected.length === 1
              ? labelOf(selected[0])
              : `${selected.length} selected`}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>
      {selected.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {selected.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
            >
              {labelOf(v)}
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label="Remove"
                className="rounded-full p-0.5 hover:bg-primary/20"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          {selected.length > 1 && (
            <button
              type="button"
              onClick={clear}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      )}
      {open && (
        <>
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
            {options.length === 0 ? (
              <div className="px-2 py-3 text-center text-xs text-muted-foreground">No options</div>
            ) : (
              options.map((o) => {
                const on = selectedSet.has(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggle(o.value)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                      on && "bg-accent/60",
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    {on && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

const inFilter = (arr: string[], v: string | null | undefined) =>
  arr.length === 0 || (v != null && arr.includes(v));

// ──────────────────────────────────────────────────────────
// SHOP REPORT
// ──────────────────────────────────────────────────────────

type ShopTxnType = "all" | "sale" | "purchase" | "expense" | "withdraw";

const SHOP_TXN_OPTIONS: { value: ShopTxnType; label: string }[] = [
  { value: "all", label: "All Transactions" },
  { value: "sale", label: "Sale" },
  { value: "purchase", label: "Purchase" },
  { value: "expense", label: "Expense" },
  { value: "withdraw", label: "Withdraw" },
];

const SHOP_TXN_BADGE: Record<string, { label: string; cls: string }> = {
  sale: { label: "Sale", cls: "bg-success/15 text-success border-success/30" },
  purchase: { label: "Purchase", cls: "bg-warning/15 text-warning border-warning/30" },
  expense: { label: "Expense", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  withdraw: { label: "Withdraw", cls: "bg-primary/15 text-primary border-primary/30" },
};

function entryAmount(e: any): number {
  switch (e.entry_type) {
    case "sale": {
      const t = e.total_sale != null
        ? Number(e.total_sale)
        : Number(e.cash_sale || 0) + Number(e.bank_sale || 0) + Number(e.credit_sale || 0);
      return t;
    }
    case "purchase": return Number(e.purchase_amount || 0);
    case "expense": return Number(e.expense_amount || 0);
    case "withdraw": return Number(e.withdraw_amount || 0);
    default: return 0;
  }
}

type ReportMode = "summary" | "detailed";

function ExportModeDialog({
  open,
  defaultMode,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  defaultMode: ReportMode;
  onCancel: () => void;
  onConfirm: (mode: ReportMode) => void;
}) {
  const [mode, setMode] = useState<ReportMode>(defaultMode);
  // Sync when re-opened
  useMemo(() => {
    if (open) setMode(defaultMode);
    return null;
  }, [open, defaultMode]);
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose report type</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {([
            { k: "summary", label: "Summary Report", desc: "Totals & cards only — A4 friendly" },
            { k: "detailed", label: "Detailed Report", desc: "Includes every transaction" },
          ] as const).map((o) => (
            <button
              key={o.k}
              onClick={() => setMode(o.k)}
              className={cn(
                "w-full rounded-md border px-3 py-2 text-left transition-colors",
                mode === o.k
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-accent/40",
              )}
            >
              <div className="text-sm font-semibold">{o.label}</div>
              <div className="text-[11px] text-muted-foreground">{o.desc}</div>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={() => onConfirm(mode)}>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ShopReport(props: any) {
  const { shopEntries, shops, cashiers, from, to, inRange, shopName, cashierName, openRecord } = props;
  const [txnType, setTxnType] = useState<ShopTxnType>("sale");
  const [mode, setMode] = useState<"shop" | "cashier">("shop");
  const [reportMode, setReportMode] = useState<ReportMode>("detailed");
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [cashierIds, setCashierIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [drill, setDrill] = useState<{ shop: { id: string; name: string }; kind: DrillKind } | null>(null);

  // Stable cashier display order within each date — alphabetical by name.
  // Editing an entry must never change cashier order.
  const cashierOrderKey = (cashierId: string | null | undefined) =>
    cashierId ? (cashierName(cashierId) || "~").toLowerCase() : "~~unassigned";

  // Sort rows: primary by txn_date (asc/desc), secondary by fixed cashier order,
  // tertiary by id for total stability.
  const sortRowsByDateAndCashier = <T extends { txn_date?: string | null; cashier_id?: string | null; id?: string }>(
    arr: T[],
  ): T[] => {
    return [...arr].sort((a, b) => {
      const da = a.txn_date || "";
      const db = b.txn_date || "";
      if (da !== db) return sortOrder === "asc" ? da.localeCompare(db) : db.localeCompare(da);
      const ca = cashierOrderKey(a.cashier_id);
      const cb = cashierOrderKey(b.cashier_id);
      if (ca !== cb) return ca.localeCompare(cb);
      return (a.id || "").localeCompare(b.id || "");
    });
  };


  // Single-selection alias used for per-shop drilldown panel.
  const shopId = shopIds.length === 1 ? shopIds[0] : "";

  const selectedShop = useMemo(
    () => (shopId ? shops.find((s: any) => s.id === shopId) ?? null : null),
    [shopId, shops],
  );
  const isSimpleSelected = selectedShop?.shop_type === "simple_cash";

  // Only Full ERP shops appear in main Shop Reports breakdown / entries table.
  const erpShopIds = useMemo(
    () => new Set(shops.filter((s: any) => s.shop_type !== "simple_cash").map((s: any) => s.id)),
    [shops],
  );

  // Title scope: "Azzouz + Nujum" style, sorted by global SHOP_ORDER.
  const scopeTitle = useMemo(() => {
    const sourceIds: string[] = shopIds.length > 0
      ? shopIds
      : shops.filter((s: any) => s.shop_type !== "simple_cash").map((s: any) => s.id);
    const names = sourceIds
      .map((id) => shops.find((s: any) => s.id === id)?.name)
      .filter(Boolean) as string[];
    if (names.length === 0) return "All Shops";
    return [...names].sort((a, b) => {
      const ra = shopRank(a);
      const rb = shopRank(b);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    }).join(" + ");
  }, [shopIds, shops]);

  const simpleShops = useMemo(
    () => shops.filter((s: any) => s.shop_type === "simple_cash"),
    [shops],
  );

  // Per-shop full summary (when a single shop is selected — works for ERP or simple)
  const shopSummary = useMemo(() => {
    if (!shopId) return null;
    const es = shopEntries.filter(
      (e: any) => e.shop_id === shopId && inRange(e.txn_date) && inFilter(cashierIds, e.cashier_id),
    );
    const sales = es.filter((e: any) => e.entry_type === "sale");
    const cash = sales.reduce((a: number, e: any) => a + Number(e.cash_sale || 0), 0);
    const bank = sales.reduce((a: number, e: any) => a + Number(e.bank_sale || 0), 0);
    const pos = sales.reduce((a: number, e: any) => a + Number(e.pos_sale || 0), 0);
    const credit = sales.reduce((a: number, e: any) => a + Number(e.credit_sale || 0), 0);
    const dueRecv = sales.reduce((a: number, e: any) => a + Number(e.due_receivable || 0), 0);
    const diff = sales.reduce((a: number, e: any) => a + Number(e.difference || 0), 0);
    const total = cash + bank + credit;
    const withdraw = es
      .filter((e: any) => e.entry_type === "withdraw")
      .reduce((a: number, e: any) => a + Number(e.withdraw_amount || 0), 0);
    const purchase = es
      .filter((e: any) => e.entry_type === "purchase")
      .reduce((a: number, e: any) => a + Number(e.purchase_amount || 0), 0);
    const expense = es
      .filter((e: any) => e.entry_type === "expense")
      .reduce((a: number, e: any) => a + Number(e.expense_amount || 0), 0);
    return { cash, bank, pos, credit, dueRecv, total, diff, withdraw, purchase, expense };
  }, [shopId, cashierIds, shopEntries, inRange]);

  const rows = useMemo(
    () =>
      shopEntries
        .filter((e: any) => inRange(e.txn_date))
        .filter((e: any) => (txnType === "all" ? true : e.entry_type === txnType))
        .filter((e: any) =>
          shopIds.length > 0 ? shopIds.includes(e.shop_id) : erpShopIds.has(e.shop_id),
        )
        .filter((e: any) => inFilter(cashierIds, e.cashier_id)),
    [shopEntries, inRange, shopIds, cashierIds, erpShopIds, txnType],
  );

  const sortedRows = useMemo(() => sortRowsByDateAndCashier(rows), [rows, sortOrder, cashierName]);

  // Simple Cash shop rollups (shown only when no shop selected)
  const simpleSummary = useMemo(() => {
    return simpleShops.map((s: any) => {
      const es = shopEntries.filter((e: any) => e.shop_id === s.id && inRange(e.txn_date));
      const cashIn = es.filter((e: any) => e.entry_type === "sale").reduce((a: number, e: any) => a + Number(e.cash_sale || 0), 0);
      const expense = es.filter((e: any) => e.entry_type === "expense").reduce((a: number, e: any) => a + Number(e.expense_amount || 0), 0);
      return { id: s.id, name: s.name, cashIn, expense, balance: cashIn - expense };
    });
  }, [simpleShops, shopEntries, inRange]);

  const totals = useMemo(() => {
    const acc = { cash: 0, bank: 0, pos: 0, credit: 0, dueRecv: 0, diff: 0, total: 0 };
    rows.forEach((r: any) => {
      const cash = Number(r.cash_sale || 0);
      const bank = Number(r.bank_sale || 0);
      const credit = Number(r.credit_sale || 0);
      const total = r.total_sale != null ? Number(r.total_sale) : cash + bank + credit;
      acc.cash += cash;
      acc.bank += bank;
      acc.pos += Number(r.pos_sale || 0);
      acc.credit += credit;
      acc.dueRecv += Number(r.due_receivable || 0);
      acc.diff += Number(r.difference || 0);
      acc.total += total;
    });
    return acc;
  }, [rows]);

  // Aggregate withdraw / purchase / expense across ERP shops (for Cash Position when no shop selected)
  const aggregateExtras = useMemo(() => {
    const es = shopEntries.filter(
      (e: any) => inRange(e.txn_date) && erpShopIds.has(e.shop_id) && inFilter(cashierIds, e.cashier_id),
    );
    const withdraw = es.filter((e: any) => e.entry_type === "withdraw").reduce((a: number, e: any) => a + Number(e.withdraw_amount || 0), 0);
    const purchase = es.filter((e: any) => e.entry_type === "purchase").reduce((a: number, e: any) => a + Number(e.purchase_amount || 0), 0);
    const expense = es.filter((e: any) => e.entry_type === "expense").reduce((a: number, e: any) => a + Number(e.expense_amount || 0), 0);
    return { withdraw, purchase, expense };
  }, [shopEntries, inRange, erpShopIds, cashierIds]);

  // Cash Position — MASTER value (single source from useShopPositions).
  // Period filter does NOT affect Cash Position; it is always all-time net cash held.
  const { byId: masterPositions, total: masterPositionsTotal } = useShopPositions({ from, to });
  const erpMasterTotal = useMemo(() => {
    let s = 0;
    for (const id of erpShopIds) s += masterPositions.get(id as string) ?? 0;
    return s;
  }, [masterPositions, erpShopIds]);
  const cashPositionPerShop = selectedShop ? (masterPositions.get(selectedShop.id) ?? 0) : 0;
  const cashPositionAggregate = selectedShop ? cashPositionPerShop : erpMasterTotal;
  void masterPositionsTotal;

  const cashPositionInfo = (totalCash: number, totalCost: number, position: number) => ({
    title: "Cash Position",
    what: "Net cash held by the shop(s) — single source from Shop Page Cash Position card. Period filter does not affect this value.",
    formula: "(Cash Sale + Bank Withdraw) − (Purchase + Expense), all-time",
    inputs: [
      `Period Total Cash = SAR ${totalCash.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Period Total Cost = SAR ${totalCost.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Master Cash Position = SAR ${position.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    ],
  });

  const grouped = useMemo(() => {
    const map = new Map<string, any>();
    rows.forEach((r: any) => {
      const key = mode === "shop" ? r.shop_id : r.cashier_id || "unassigned";
      const label =
        mode === "shop"
          ? shopName(r.shop_id)
          : r.cashier_id
            ? cashierName(r.cashier_id)
            : "Unassigned";
      const cur =
        map.get(key) ?? { label, cash: 0, bank: 0, pos: 0, credit: 0, diff: 0, total: 0, count: 0 };
      const cash = Number(r.cash_sale || 0);
      const bank = Number(r.bank_sale || 0);
      const credit = Number(r.credit_sale || 0);
      const total = r.total_sale != null ? Number(r.total_sale) : cash + bank + credit;
      cur.cash += cash;
      cur.bank += bank;
      cur.pos += Number(r.pos_sale || 0);
      cur.credit += credit;
      cur.diff += Number(r.difference || 0);
      cur.total += total;
      cur.count += 1;
      map.set(key, cur);
    });
    const arr = [...map.values()];
    if (mode === "shop") {
      return arr.sort((a, b) => {
        const ra = shopRank(a.label);
        const rb = shopRank(b.label);
        if (ra !== rb) return ra - rb;
        return b.total - a.total;
      });
    }
    return arr.sort((a, b) => b.total - a.total);
  }, [rows, mode, shopName, cashierName]);

  const expectedBankPerShop = shopSummary ? shopSummary.bank - shopSummary.withdraw : 0;
  const expectedBankAggregate = totals.bank - aggregateExtras.withdraw;

  const summary: SummaryRow[] = shopSummary
    ? isSimpleSelected
      ? [
          { label: "Cash In", value: shopSummary.cash },
          { label: "Expense", value: shopSummary.expense },
          { label: "Balance", value: shopSummary.cash - shopSummary.expense },
        ]
      : [
          { label: "Cash Sale", value: shopSummary.cash },
          { label: "Bank Sale", value: shopSummary.bank },
          { label: "Credit Sale", value: shopSummary.credit },
          { label: "Due Receivable", value: shopSummary.dueRecv, hint: "Received from previous due / baki" },
          { label: "Total Credit Due", value: shopSummary.credit - shopSummary.dueRecv, hint: "(Credit Sale − Due Receivable)" },
          { label: "POS Sale", value: shopSummary.pos },
          { label: "Total Sale", value: shopSummary.total },
          { label: "Plus / Minus", value: shopSummary.diff },
          { label: "Purchase", value: shopSummary.purchase },
          { label: "Expense", value: shopSummary.expense },
          { label: "Withdraw", value: shopSummary.withdraw },
          { label: "Expected Balance", value: expectedBankPerShop, hint: "(Bank Sale - Withdraw)" },
          { label: "Cash Position", value: cashPositionPerShop, highlight: true, hint: "(Total Cash Sale + Withdraw - Purchase - Expense)" },
        ]
    : txnType === "sale"
      ? [
          { label: "Cash Sale", value: totals.cash },
          { label: "Bank Sale", value: totals.bank },
          { label: "Credit Sale", value: totals.credit },
          { label: "Due Receivable", value: totals.dueRecv, hint: "Received from previous due / baki" },
          { label: "Total Credit Due", value: totals.credit - totals.dueRecv, hint: "(Credit Sale − Due Receivable)" },
          { label: "POS Sale", value: totals.pos },
          { label: "Total Sale", value: totals.total },
          { label: "Plus / Minus", value: totals.diff },
          { label: "Purchase", value: aggregateExtras.purchase },
          { label: "Expense", value: aggregateExtras.expense },
          { label: "Withdraw", value: aggregateExtras.withdraw },
          { label: "Expected Balance", value: expectedBankAggregate, hint: "(Bank Sale - Withdraw)" },
          { label: "Cash Position", value: cashPositionAggregate, highlight: true, hint: "(Total Cash Sale + Withdraw - Purchase - Expense)" },
        ]

      : (() => {
          const buckets: Record<string, number> = { sale: 0, purchase: 0, expense: 0, withdraw: 0 };
          for (const r of rows) buckets[r.entry_type] = (buckets[r.entry_type] ?? 0) + entryAmount(r);
          const net = buckets.sale - buckets.purchase - buckets.expense - buckets.withdraw;
          const arr: SummaryRow[] = [];
          if (txnType === "all") arr.push({ label: "Total Sales", value: buckets.sale });
          if (txnType === "all" || txnType === "purchase") arr.push({ label: "Total Purchases", value: buckets.purchase });
          if (txnType === "all" || txnType === "expense") arr.push({ label: "Total Expenses", value: buckets.expense });
          if (txnType === "all" || txnType === "withdraw") arr.push({ label: "Total Withdraws", value: buckets.withdraw });
          if (txnType === "all") arr.push({ label: "Net Position", value: net });
          return arr;
        })();
  const meta = `${from} → ${to} · ${rows.length} entries · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;

  const rowTotal = (r: any) =>
    r.total_sale != null
      ? Number(r.total_sale)
      : Number(r.cash_sale || 0) + Number(r.bank_sale || 0) + Number(r.credit_sale || 0);

  const exportCSV = (mode: ReportMode = reportMode) => {
    const summaryBlock: (string | number)[][] = [
      ["Summary", ""],
      ...summary.map((s) => [s.label + (s.highlight ? ` (${s.status ?? (s.value >= 0 ? "Healthy Position" : "Negative Position")})` : ""), s.value.toFixed(2)]),
      ["", ""],
    ];
    let csv: (string | number)[][];
    if (mode === "summary") {
      csv = summaryBlock;
    } else if (txnType === "sale") {
      csv = [
        ...summaryBlock,
        ["Date", "Cashier", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale", "Total Sale", "Plus/Minus"],
        ...sortedRows.map((r: any) => [
          r.txn_date,
          r.cashier_id ? cashierName(r.cashier_id) : "—",
          Number(r.pos_sale || 0).toFixed(2),
          Number(r.cash_sale || 0).toFixed(2),
          Number(r.bank_sale || 0).toFixed(2),
          Number(r.credit_sale || 0).toFixed(2),
          rowTotal(r).toFixed(2),
          Number(r.difference || 0).toFixed(2),
        ]),
      ];
    } else {
      csv = [
        ...summaryBlock,
        ["Date", "Shop", "Cashier", "Type", "Amount", "Notes"],
        ...sortedRows.map((r: any) => [
          r.txn_date,
          shopName(r.shop_id),
          r.cashier_id ? cashierName(r.cashier_id) : "—",
          r.entry_type,
          entryAmount(r).toFixed(2),
          r.notes ?? "",
        ]),
      ];
    }
    downloadCSV(`shop-report-${mode}-${txnType}-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = (mode: ReportMode = reportMode) => {
    if (mode === "summary") {
      const title = txnType === "sale"
        ? "Shop Sales Summary"
        : txnType === "all"
          ? "Shop Report Summary · All"
          : `Shop Summary · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
      openPDF(title, meta, summary, undefined, {
        statement: true,
        scopeLabel: scopeTitle,
        rangeLabel: `${from} → ${to}`,
      });
      return;
    }

    if (txnType === "sale") {
      openPDF("Shop Sales Report", meta, summary, {
        headers: ["Date", "Cashier", "POS", "Cash", "Bank", "Credit", "Total", "+/−"],
        rows: sortedRows.map((r: any) => [
          r.txn_date,
          r.cashier_id ? cashierName(r.cashier_id) : "—",
          Number(r.pos_sale || 0),
          Number(r.cash_sale || 0),
          Number(r.bank_sale || 0),
          Number(r.credit_sale || 0),
          rowTotal(r),
          Number(r.difference || 0),
        ]),
      }, { scopeLabel: scopeTitle });
    } else {
      const title = txnType === "all"
        ? "Shop Report · All Transactions"
        : `Shop Report · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
      openPDF(title, meta, summary, {
        headers: ["Date", "Shop", "Cashier", "Type", "Notes", "Amount"],
        rows: sortedRows.map((r: any) => [
          r.txn_date,
          shopName(r.shop_id),
          r.cashier_id ? cashierName(r.cashier_id) : "—",
          r.entry_type,
          r.notes ?? "—",
          entryAmount(r),
        ]),
      }, { scopeLabel: scopeTitle });
    }
  };
  const share = (_mode: ReportMode = reportMode) => {
    const baseTitle = txnType === "sale"
      ? "Shop Sales"
      : txnType === "all"
        ? "Shop Report · All"
        : `Shop ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
    const title = _mode === "summary" ? `${baseTitle} · Summary` : baseTitle;
    shareWhatsApp(title, meta, summary);
  };

  // Export-mode picker
  const [pendingExport, setPendingExport] = useState<null | "csv" | "pdf" | "share">(null);
  const runExport = (kind: "csv" | "pdf" | "share", mode: ReportMode) => {
    setPendingExport(null);
    if (kind === "csv") exportCSV(mode);
    else if (kind === "pdf") exportPDF(mode);
    else share(mode);
  };


  const openDrill = (kind: DrillKind) => {
    if (!selectedShop) return;
    setDrill({ shop: { id: selectedShop.id, name: selectedShop.name }, kind });
  };

  return (
    <div className="space-y-4">
      {!isSimpleSelected && (
        <SubTabs
          value={mode}
          onChange={setMode}
          options={[
            { k: "shop", label: "Shop Wise" },
            { k: "cashier", label: "Cashier Wise" },
          ]}
        />
      )}

      <Card className="p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Transaction Type
            </label>
            <select
              value={txnType}
              onChange={(e) => setTxnType(e.target.value as ShopTxnType)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {SHOP_TXN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <MultiSelectChips
            label="Shop"
            placeholder="All shops"
            options={shops.map((s: any) => ({
              value: s.id,
              label: `${s.name}${s.shop_type === "simple_cash" ? " · Simple" : ""}`,
            }))}
            selected={shopIds}
            onChange={setShopIds}
          />
          {!isSimpleSelected && (
            <MultiSelectChips
              label="Cashier"
              placeholder="All cashiers"
              options={cashiers
                .filter((c: any) => (shopIds.length > 0 ? shopIds.includes(c.shop_id) : true))
                .map((c: any) => ({ value: c.id, label: c.name }))}
              selected={cashierIds}
              onChange={setCashierIds}
            />
          )}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="asc">Oldest First (Ascending Date)</option>
              <option value="desc">Newest First (Descending Date)</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <SubTabs
          value={reportMode}
          onChange={setReportMode}
          options={[
            { k: "summary", label: "Summary Report" },
            { k: "detailed", label: "Detailed Report" },
          ]}
        />
        <ExportBar
          onCSV={() => setPendingExport("csv")}
          onPDF={() => setPendingExport("pdf")}
          onShare={() => setPendingExport("share")}
        />
      </div>

      <ExportModeDialog
        open={!!pendingExport}
        defaultMode={reportMode}
        onCancel={() => setPendingExport(null)}
        onConfirm={(m) => pendingExport && runExport(pendingExport, m)}
      />


      {/* Summary Report — financial-statement layout (no dashboard cards) */}
      {reportMode === "summary" && (
        <SummaryStatement
          scopeLabel={scopeTitle}
          rangeLabel={`${from} → ${to}`}
          rows={summary}
        />
      )}

      {/* Detailed Report — original dashboard-style cards */}
      {reportMode === "detailed" && shopSummary && selectedShop && (
        <div className="space-y-3">
          {isSimpleSelected ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <ClickableSummary label="Cash In" value={shopSummary.cash} tone="success" onClick={() => openDrill("cash_in")} />
              <ClickableSummary label="Expense" value={shopSummary.expense} tone="danger" onClick={() => openDrill("expense")} />
              <SummaryCard label="Balance" value={shopSummary.cash - shopSummary.expense} tone={shopSummary.cash - shopSummary.expense < 0 ? "danger" : "success"} />
            </div>
          ) : (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <ClickableSummary label="Cash Sale" value={shopSummary.cash} tone="success" onClick={() => openDrill("cash_sale")} />
                <ClickableSummary label="Bank Sale" value={shopSummary.bank} tone="info" onClick={() => openDrill("bank_sale")} />
                <ClickableSummary label="POS Sale" value={shopSummary.pos} onClick={() => openDrill("pos_sale")} />
                <ClickableSummary label="Credit Sale" value={shopSummary.credit} tone="warning" onClick={() => openDrill("credit_sale")} />
                <SummaryCard infoKey="total_sale" label="Total Sale" value={shopSummary.total} tone="success" />
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <SummaryCard infoKey="plus_minus" label="Plus / Minus" value={shopSummary.diff} tone={shopSummary.diff < 0 ? "danger" : "success"} />
                <ClickableSummary label="Purchase" value={shopSummary.purchase} tone="warning" onClick={() => openDrill("purchase")} />
                <ClickableSummary label="Expense" value={shopSummary.expense} tone="danger" onClick={() => openDrill("expense")} />
                <ClickableSummary label="Withdraw" value={shopSummary.withdraw} tone="info" onClick={() => openDrill("bank_withdraw")} />
                <SummaryCard label="Expected Bank" value={expectedBankPerShop} tone={expectedBankPerShop < 0 ? "danger" : "info"} />
              </div>
              {/* Row 3 — Cash Position full width */}
              <CashPositionCard
                value={cashPositionPerShop}
                info={cashPositionInfo(
                  shopSummary.cash + shopSummary.withdraw,
                  shopSummary.purchase + shopSummary.expense,
                  cashPositionPerShop,
                )}
              />
            </>
          )}
        </div>
      )}

      {/* Aggregate summary across ERP shops when no shop selected (Detailed only) */}
      {reportMode === "detailed" && !shopSummary && (
        <div className="space-y-3">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard infoKey="cash_sale" label="Cash Sale" value={totals.cash} tone="success" />
            <SummaryCard infoKey="bank_sale" label="Bank Sale" value={totals.bank} tone="info" />
            <SummaryCard infoKey="pos_sale" label="POS Sale" value={totals.pos} />
            <SummaryCard infoKey="credit_sale" label="Credit Sale" value={totals.credit} tone="warning" />
            <SummaryCard infoKey="total_sale" label="Total Sale" value={totals.total} tone="success" />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard infoKey="plus_minus" label="Plus / Minus" value={totals.diff} tone={totals.diff < 0 ? "danger" : "success"} />
            <SummaryCard label="Purchase" value={aggregateExtras.purchase} tone="warning" />
            <SummaryCard label="Expense" value={aggregateExtras.expense} tone="danger" />
            <SummaryCard label="Withdraw" value={aggregateExtras.withdraw} tone="info" />
            <SummaryCard label="Expected Bank" value={expectedBankAggregate} tone={expectedBankAggregate < 0 ? "danger" : "info"} />
          </div>
          {/* Row 3 — Cash Position full width */}
          <CashPositionCard
            value={cashPositionAggregate}
            info={cashPositionInfo(
              totals.cash + aggregateExtras.withdraw,
              aggregateExtras.purchase + aggregateExtras.expense,
              cashPositionAggregate,
            )}
          />
        </div>
      )}



      {/* Simple shops rollup — hidden when a specific shop selected */}
      {!shopId && simpleSummary.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Simple Shops
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Shop</th>
                  <th className="px-3 py-2 text-right">Cash In</th>
                  <th className="px-3 py-2 text-right">Expense</th>
                  <th className="px-3 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {simpleSummary.map((s: any) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer transition-colors hover:bg-accent/40"
                    onClick={() => setShopIds([s.id])}
                  >
                    <td className="px-3 py-2.5 font-medium">{s.name}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-success">{SAR(s.cashIn)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-destructive">{SAR(s.expense)}</td>
                    <td className={cn("px-3 py-2.5 text-right font-semibold tabular-nums", s.balance < 0 ? "text-destructive" : "text-success")}>{SAR(s.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ERP grouped + entries — hidden for simple selected shop */}
      {!isSimpleSelected && (
        <>
          {txnType === "sale" && (
            <Card className="overflow-hidden">
              <div className="border-b bg-muted/30 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {mode === "shop" ? "By Shop" : "By Cashier"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">{mode === "shop" ? "Shop" : "Cashier"}</th>
                      <th className="px-3 py-2 text-right">POS</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2 text-right">Cash</th>
                      <th className="px-3 py-2 text-right">Bank</th>
                      <th className="px-3 py-2 text-right">Credit</th>
                      <th className="px-3 py-2 text-right">+/−</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {grouped.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-muted-foreground">
                          No data in range.
                        </td>
                      </tr>
                    )}
                    {grouped.map((g: any) => (
                      <tr key={g.label}>
                        <td className="px-3 py-2.5 font-medium">{g.label}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{SAR(g.pos)}</td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{SAR(g.total)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-success">{SAR(g.cash)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-primary">{SAR(g.bank)}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{SAR(g.credit)}</td>
                        <td
                          className={cn(
                            "px-3 py-2.5 text-right font-semibold tabular-nums",
                            g.diff < 0 ? "text-destructive" : g.diff > 0 ? "text-success" : "",
                          )}
                        >
                          {SAR(g.diff)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {reportMode === "detailed" && (txnType === "sale" ? (
            <Card className="overflow-hidden">
              <div className="border-b bg-muted/30 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Entries
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Cashier</th>
                      <th className="px-3 py-2 text-right">POS</th>
                      <th className="px-3 py-2 text-right">Cash</th>
                      <th className="px-3 py-2 text-right">Bank</th>
                      <th className="px-3 py-2 text-right">Credit</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2 text-right">+/−</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-muted-foreground">
                          No entries.
                        </td>
                      </tr>
                    )}
                    {sortedRows.map((r: any) => (
                      <tr
                        key={r.id}
                        onClick={() => openRecord?.("shop_entry", r.id)}
                        className="cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">{r.txn_date}</td>
                        <td className="px-3 py-2">{r.cashier_id ? cashierName(r.cashier_id) : "—"}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{SAR(r.pos_sale)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-success">{SAR(r.cash_sale)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-primary">{SAR(r.bank_sale)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{SAR(r.credit_sale)}</td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">{SAR(rowTotal(r))}</td>
                        <td
                          className={cn(
                            "px-3 py-2 text-right font-semibold tabular-nums",
                            Number(r.difference) < 0
                              ? "text-destructive"
                              : Number(r.difference) > 0
                                ? "text-success"
                                : "",
                          )}
                        >
                          {SAR(r.difference)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Entries · {SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    {SAR(rows.reduce((s: number, r: any) => s + entryAmount(r), 0))}
                  </span>
                  {" · "}{rows.length} entries
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Shop</th>
                      <th className="px-3 py-2 text-left">Cashier</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Notes</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-muted-foreground">
                          No entries.
                        </td>
                      </tr>
                    )}
                    {sortedRows
                      .map((r: any) => {
                        const badge = SHOP_TXN_BADGE[r.entry_type] ?? { label: r.entry_type, cls: "" };
                        return (
                          <tr
                            key={r.id}
                            onClick={() => openRecord?.("shop_entry", r.id)}
                            className="cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60"
                          >
                            <td className="px-3 py-2 whitespace-nowrap">{r.txn_date}</td>
                            <td className="px-3 py-2">{shopName(r.shop_id)}</td>
                            <td className="px-3 py-2">{r.cashier_id ? cashierName(r.cashier_id) : "—"}</td>
                            <td className="px-3 py-2">
                              <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badge.cls)}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground max-w-[260px] truncate">{r.notes ?? "—"}</td>
                            <td className="px-3 py-2 text-right font-semibold tabular-nums">{SAR(entryAmount(r))}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}

        </>
      )}

      <ShopDrilldownSheet
        open={!!drill}
        onOpenChange={(v: boolean) => !v && setDrill(null)}
        shop={drill?.shop ?? null}
        kind={drill?.kind ?? null}
        initialFrom={from}
        initialTo={to}
      />
    </div>
  );
}

function ClickableSummary({
  label,
  value,
  tone = "default",
  onClick,
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger" | "info" | "warning";
  onClick: () => void;
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-destructive"
        : tone === "info"
          ? "text-primary"
          : tone === "warning"
            ? "text-warning"
            : "text-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-border/60 bg-card px-3 py-2 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className={cn("mt-0.5", toneCls)}>
        <SARAmount value={value} size="md" />
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// TRANSACTION REPORT
// ──────────────────────────────────────────────────────────

function TransactionReport(props: any) {
  const { txns, shops, categories, from, to, inRange, shopName, openRecord } = props;
  const [mode, setMode] = useState<"category" | "shop">("category");
  const [categoriesSel, setCategoriesSel] = useState<string[]>([]);
  const [subcategory, setSubcategory] = useState("");
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      txns
        .filter((t: any) => inRange(t.txn_date))
        .filter((t: any) => inFilter(categoriesSel, t.category))
        .filter((t: any) => (subcategory ? t.subcategory === subcategory : true))
        .filter((t: any) => inFilter(shopIds, t.shop_id))
        .filter((t: any) =>
          sources.length === 0
            ? true
            : sources.some((s) => (s === "manual" ? !t.source : t.source === s)),
        )
        .filter((t: any) => inFilter(types, t.type)),
    [txns, inRange, categoriesSel, subcategory, shopIds, sources, types],
  );

  const totals = useMemo(() => {
    let cashIn = 0,
      cashOut = 0;
    filtered.forEach((t: any) => {
      if (t.type === "cash_in") cashIn += Number(t.amount);
      else cashOut += Number(t.amount);
    });
    return { cashIn, cashOut, net: cashIn - cashOut };
  }, [filtered]);

  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; in: number; out: number; count: number }>();
    filtered.forEach((t: any) => {
      const key =
        mode === "category"
          ? t.category || "Uncategorized"
          : t.shop_id || "no-shop";
      const label = mode === "category" ? (t.category || "Uncategorized") : shopName(t.shop_id);
      const cur = map.get(key) ?? { label, in: 0, out: 0, count: 0 };
      if (t.type === "cash_in") cur.in += Number(t.amount);
      else cur.out += Number(t.amount);
      cur.count += 1;
      map.set(key, cur);
    });
    return [...map.values()].sort((a, b) => b.in + b.out - a.in - a.out);
  }, [filtered, mode, shopName]);

  const summary = [
    { label: "Total Cash In", value: totals.cashIn },
    { label: "Total Cash Out", value: totals.cashOut },
    { label: "Net Balance", value: totals.net },
  ];
  const meta = `${from} → ${to} · ${filtered.length} txns`;

  const exportCSV = () => {
    const csv: (string | number)[][] = [
      ["Date", "Type", "Category", "Sub-category", "Shop", "Source", "Amount", "Notes"],
      ...filtered.map((t: any) => [
        t.txn_date,
        TXN_LABELS[t.type] ?? t.type,
        t.category ?? "",
        t.subcategory ?? "",
        shopName(t.shop_id),
        t.source ?? "manual",
        Number(t.amount).toFixed(2),
        (t.notes ?? "").replace(/[\r\n,]/g, " "),
      ]),
    ];
    downloadCSV(`transactions-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = () =>
    openPDF("Transactions Report", meta, summary, {
      headers: ["Date", "Type", "Category", "Shop", "Source", "Amount"],
      rows: filtered.map((t: any) => [
        t.txn_date,
        TXN_LABELS[t.type] ?? t.type,
        t.category ?? "—",
        shopName(t.shop_id),
        t.source ?? "manual",
        Number(t.amount),
      ]),
    });
  const share = () => shareWhatsApp("Transactions", meta, summary);

  const inCats = categories.filter((c: any) => c.txn_type === "cash_in").map((c: any) => c.name);
  const outCats = categories.filter((c: any) => c.txn_type === "cash_out").map((c: any) => c.name);
  const allCats = Array.from(new Set([...inCats, ...outCats]));

  return (
    <div className="space-y-4">
      <SubTabs
        value={mode}
        onChange={setMode}
        options={[
          { k: "category", label: "Category Wise" },
          { k: "shop", label: "Shop Wise" },
        ]}
      />

      <Card className="p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MultiSelectChips
            label="Category"
            options={allCats.map((c) => ({ value: c, label: c }))}
            selected={categoriesSel}
            onChange={setCategoriesSel}
          />
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Sub-category</label>
            <Input
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="Any"
              className="mt-1 h-9"
            />
          </div>
          <MultiSelectChips
            label="Shop"
            placeholder="All shops"
            options={shops.map((s: any) => ({ value: s.id, label: s.name }))}
            selected={shopIds}
            onChange={setShopIds}
          />
          <MultiSelectChips
            label="Type"
            options={[
              { value: "cash_in", label: "Cash In" },
              { value: "cash_out", label: "Cash Out" },
            ]}
            selected={types}
            onChange={setTypes}
          />
          <MultiSelectChips
            label="Source"
            options={[
              { value: "manual", label: "Manual" },
              { value: "warehouse", label: "Warehouse" },
              { value: "shop", label: "Shop" },
            ]}
            selected={sources}
            onChange={setSources}
          />
        </div>
      </Card>

      <ExportBar onCSV={exportCSV} onPDF={exportPDF} onShare={share} />

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Cash In" value={totals.cashIn} tone="success" />
        <SummaryCard label="Cash Out" value={totals.cashOut} tone="danger" />
        <SummaryCard label="Net" value={totals.net} tone={totals.net < 0 ? "danger" : "success"} />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {mode === "category" ? "By Category" : "By Shop"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">{mode === "category" ? "Category" : "Shop"}</th>
                <th className="px-3 py-2 text-right">Txns</th>
                <th className="px-3 py-2 text-right">In</th>
                <th className="px-3 py-2 text-right">Out</th>
                <th className="px-3 py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {grouped.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">No data.</td>
                </tr>
              )}
              {grouped.map((g) => (
                <tr key={g.label}>
                  <td className="px-3 py-2.5 font-medium">{g.label}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{g.count}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-success">{SAR(g.in)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-destructive">{SAR(g.out)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{SAR(g.in - g.out)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transactions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Shop</th>
                <th className="px-3 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">No transactions.</td>
                </tr>
              )}
              {filtered.map((t: any) => (
                <tr
                  key={t.id}
                  onClick={() => openRecord?.("transaction", t.id)}
                  className="cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60"
                >
                  <td className="px-3 py-2 whitespace-nowrap">{t.txn_date}</td>
                  <td className="px-3 py-2">
                    <span className={cn("font-medium", t.type === "cash_in" ? "text-success" : "text-destructive")}>
                      {TXN_LABELS[t.type] ?? t.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {t.category ?? "—"}{t.subcategory ? ` · ${t.subcategory}` : ""}
                  </td>
                  <td className="px-3 py-2">{t.shop_id ? shopName(t.shop_id) : "—"}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">{SAR(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// WAREHOUSE REPORT
// ──────────────────────────────────────────────────────────

function WarehouseReport(props: any) {
  const { wh, parties, from, to, inRange, partyName, openRecord } = props;
  const [partyIds, setPartyIds] = useState<string[]>([]);
  const [entryTypes, setEntryTypes] = useState<string[]>([]);
  const [payStatuses, setPayStatuses] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      wh
        .filter((e: any) => inRange(e.txn_date))
        .filter((e: any) => inFilter(partyIds, e.party_id))
        .filter((e: any) => inFilter(entryTypes, e.entry_type))
        .filter((e: any) => inFilter(payStatuses, e.payment_status)),
    [wh, inRange, partyIds, entryTypes, payStatuses],
  );

  const totals = useMemo(() => {
    let sale = 0,
      credit = 0,
      cashReceived = 0,
      due = 0;
    filtered.forEach((e: any) => {
      const amt = Number(e.amount || 0);
      const paid = Number(e.paid_amount || 0);
      const rem = Number(e.remaining_due || 0);
      if (e.entry_type === "warehouse_sale") {
        sale += amt;
        if (e.payment_status === "credit") credit += amt;
        else if (e.payment_status === "partial") {
          credit += rem;
          cashReceived += paid;
        } else cashReceived += amt;
        due += rem;
      } else if (e.entry_type === "payment_received") {
        cashReceived += amt;
        due -= amt;
      }
    });
    return { sale, credit, cashReceived, due: Math.max(0, due) };
  }, [filtered]);

  // Party-wise grouping
  const grouped = useMemo(() => {
    const map = new Map<string, any>();
    filtered.forEach((e: any) => {
      const key = e.party_id || e.party_name;
      const label = e.party_id ? partyName(e.party_id) : e.party_name;
      const cur = map.get(key) ?? { label, sale: 0, paid: 0, due: 0, count: 0 };
      if (e.entry_type === "warehouse_sale") {
        cur.sale += Number(e.amount || 0);
        cur.paid += Number(e.paid_amount || 0);
        cur.due += Number(e.remaining_due || 0);
      } else if (e.entry_type === "payment_received") {
        cur.paid += Number(e.amount || 0);
        cur.due -= Number(e.amount || 0);
      }
      cur.count += 1;
      map.set(key, cur);
    });
    return [...map.values()].sort((a, b) => b.sale - a.sale);
  }, [filtered, partyName]);

  const summary = [
    { label: "Total Sale", value: totals.sale },
    { label: "Total Credit", value: totals.credit },
    { label: "Cash Received", value: totals.cashReceived },
    { label: "Due Receivable", value: totals.due },
  ];
  const meta = `${from} → ${to} · ${filtered.length} entries`;

  const exportCSV = () => {
    const csv: (string | number)[][] = [
      ["Date", "Party", "Type", "Status", "Amount", "Paid", "Due", "Notes"],
      ...filtered.map((e: any) => [
        e.txn_date,
        e.party_id ? partyName(e.party_id) : e.party_name,
        e.entry_type,
        e.payment_status,
        Number(e.amount).toFixed(2),
        Number(e.paid_amount).toFixed(2),
        Number(e.remaining_due).toFixed(2),
        (e.notes ?? "").replace(/[\r\n,]/g, " "),
      ]),
    ];
    downloadCSV(`warehouse-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = () =>
    openPDF("Warehouse Report", meta, summary, {
      headers: ["Date", "Party", "Type", "Status", "Amount", "Paid", "Due"],
      rows: filtered.map((e: any) => [
        e.txn_date,
        e.party_id ? partyName(e.party_id) : e.party_name,
        e.entry_type,
        e.payment_status,
        Number(e.amount),
        Number(e.paid_amount),
        Number(e.remaining_due),
      ]),
    });
  const share = () => shareWhatsApp("Warehouse", meta, summary);

  return (
    <div className="space-y-4">
      <SubTabs
        value={"party" as any}
        onChange={() => {}}
        options={[{ k: "party" as any, label: "Party Wise" }]}
      />

      <Card className="p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MultiSelectChips
            label="Party"
            placeholder="All parties"
            options={parties.map((p: any) => ({ value: p.id, label: p.name }))}
            selected={partyIds}
            onChange={setPartyIds}
          />
          <MultiSelectChips
            label="Entry type"
            options={[
              { value: "warehouse_sale", label: "Sale" },
              { value: "warehouse_purchase", label: "Purchase" },
              { value: "payment_received", label: "Payment Received" },
              { value: "supplier_payment", label: "Supplier Payment" },
            ]}
            selected={entryTypes}
            onChange={setEntryTypes}
          />
          <MultiSelectChips
            label="Payment status"
            options={[
              { value: "cash", label: "Cash" },
              { value: "credit", label: "Credit" },
              { value: "partial", label: "Partial" },
            ]}
            selected={payStatuses}
            onChange={setPayStatuses}
          />
        </div>
      </Card>

      <ExportBar onCSV={exportCSV} onPDF={exportPDF} onShare={share} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total Sale" value={totals.sale} tone="success" />
        <SummaryCard label="Total Credit" value={totals.credit} tone="warning" />
        <SummaryCard label="Cash Received" value={totals.cashReceived} tone="info" />
        <SummaryCard label="Due Receivable" value={totals.due} tone="danger" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Party Wise
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Party</th>
                <th className="px-3 py-2 text-right">Txns</th>
                <th className="px-3 py-2 text-right">Sale</th>
                <th className="px-3 py-2 text-right">Paid</th>
                <th className="px-3 py-2 text-right">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {grouped.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">No data.</td>
                </tr>
              )}
              {grouped.map((g: any) => (
                <tr key={g.label}>
                  <td className="px-3 py-2.5 font-medium">{g.label}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{g.count}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{SAR(g.sale)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-success">{SAR(g.paid)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-destructive font-semibold">{SAR(Math.max(0, g.due))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Party</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">No entries.</td>
                </tr>
              )}
              {filtered.map((e: any) => (
                <tr
                  key={e.id}
                  onClick={() => openRecord?.("warehouse_entry", e.id)}
                  className="cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60"
                >
                  <td className="px-3 py-2 whitespace-nowrap">{e.txn_date}</td>
                  <td className="px-3 py-2">{e.party_id ? partyName(e.party_id) : e.party_name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{e.entry_type}</td>
                  <td className="px-3 py-2 text-muted-foreground">{e.payment_status}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">{SAR(e.amount)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-destructive">{SAR(e.remaining_due)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// EMPLOYEE REPORT
// ──────────────────────────────────────────────────────────

type EmpPeriod = "today" | "yesterday" | "weekly" | "monthly" | "custom";

function EmployeeReport(props: {
  employees: any[];
  employeeEntries: any[];
  shops: any[];
  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  inRange: (d: string) => boolean;
  shopName: (id?: string | null) => string;
}) {
  const { employees, employeeEntries, shops, from, to, setFrom, setTo, inRange, shopName } = props;
  const qc = useQueryClient();
  const { user } = useAuth();
  const { data: isAdmin = false } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });

  const [period, setPeriod] = useState<EmpPeriod>("monthly");
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [activeEmp, setActiveEmp] = useState<any | null>(null);

  // Sync period → from/to
  const applyPeriod = (p: EmpPeriod) => {
    setPeriod(p);
    const now = new Date();
    const y = (d: Date) => format(d, "yyyy-MM-dd");
    if (p === "today") {
      setFrom(y(now)); setTo(y(now));
    } else if (p === "yesterday") {
      const d = new Date(Date.now() - 86400000);
      setFrom(y(d)); setTo(y(d));
    } else if (p === "weekly") {
      setFrom(y(new Date(Date.now() - 7 * 86400000))); setTo(y(now));
    } else if (p === "monthly") {
      setFrom(y(new Date(Date.now() - 30 * 86400000))); setTo(y(now));
    }
  };

  const fEntries = useMemo(
    () => employeeEntries.filter((e: any) => inRange(e.txn_date)),
    [employeeEntries, inRange],
  );

  const empRows = useMemo(() => {
    return employees
      .filter((e: any) => inFilter(shopIds, e.shop_id))
      .filter((e: any) => inFilter(employeeIds, e.id))
      .map((e: any) => {
        const es = fEntries.filter((x: any) => x.employee_id === e.id);
        const given = es.filter((x: any) => x.entry_type === "given").reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
        const received = es.filter((x: any) => x.entry_type === "received").reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
        const balance = given - received;
        return { ...e, given, received, balance, entries: es };
      })
      .filter((r: any) => {
        if (statuses.length === 0) return true;
        const match =
          (statuses.includes("outstanding") && r.balance > 0) ||
          (statuses.includes("settled") && Math.abs(r.balance) < 0.01) ||
          (statuses.includes("advance") && r.balance < 0);
        return match;
      });
  }, [employees, fEntries, employeeIds, shopIds, statuses]);

  const totals = useMemo(() => {
    return empRows.reduce(
      (a: any, r: any) => ({
        given: a.given + r.given,
        received: a.received + r.received,
        outstanding: a.outstanding + Math.max(0, r.balance),
      }),
      { given: 0, received: 0, outstanding: 0 },
    );
  }, [empRows]);

  const meta = `${from} → ${to} · ${empRows.length} employees`;
  const summary = [
    { label: "Total Given", value: totals.given },
    { label: "Total Received", value: totals.received },
    { label: "Total Outstanding", value: totals.outstanding },
  ];

  const exportCSV = () => {
    const rows: (string | number)[][] = [
      ["Employee", "Shop", "Total Given", "Total Received", "Outstanding", "Entries"],
      ...empRows.map((r: any) => [
        r.name,
        r.shop_name ?? shopName(r.shop_id),
        r.given.toFixed(2),
        r.received.toFixed(2),
        Math.max(0, r.balance).toFixed(2),
        r.entries.length,
      ]),
    ];
    downloadCSV(`employee-report-${from}-to-${to}.csv`, rows);
  };
  const exportPDF = () =>
    openPDF("Employee Report", meta, summary, {
      headers: ["Employee", "Shop", "Given", "Received", "Outstanding", "Entries"],
      rows: empRows.map((r: any) => [
        r.name,
        r.shop_name ?? shopName(r.shop_id),
        r.given,
        r.received,
        Math.max(0, r.balance),
        r.entries.length,
      ]),
    });
  const share = () => shareWhatsApp("Employee Report", meta, summary);

  return (
    <div className="space-y-4">
      {/* Period tabs */}
      <SubTabs
        value={period}
        onChange={applyPeriod}
        options={[
          { k: "today", label: "Today" },
          { k: "yesterday", label: "Yesterday" },
          { k: "weekly", label: "Weekly" },
          { k: "monthly", label: "Monthly" },
          { k: "custom", label: "Custom" },
        ]}
      />

      {/* Filters */}
      <Card className="p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MultiSelectChips
            label="Employee"
            placeholder="All employees"
            options={employees.map((e: any) => ({ value: e.id, label: e.name }))}
            selected={employeeIds}
            onChange={setEmployeeIds}
          />
          <MultiSelectChips
            label="Shop"
            placeholder="All shops"
            options={shops.map((s: any) => ({ value: s.id, label: s.name }))}
            selected={shopIds}
            onChange={setShopIds}
          />
          <MultiSelectChips
            label="Status"
            options={[
              { value: "outstanding", label: "Outstanding" },
              { value: "settled", label: "Settled" },
              { value: "advance", label: "Advance" },
            ]}
            selected={statuses}
            onChange={setStatuses}
          />
        </div>
      </Card>

      <ExportBar onCSV={exportCSV} onPDF={exportPDF} onShare={share} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total Given" value={totals.given} tone="danger" />
        <SummaryCard label="Total Received" value={totals.received} tone="success" />
        <SummaryCard label="Total Outstanding" value={totals.outstanding} tone="warning" />
        <Card className="relative p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Employees</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums">{empRows.length}</p>
        </Card>
      </div>

      {/* Employee list */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Employees
          </p>
        </div>
        <ul className="divide-y divide-border">
          {empRows.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">No employees match the filters.</li>
          )}
          {empRows.map((r: any) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setActiveEmp(r)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 active:bg-accent/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {(r.shop_name ?? shopName(r.shop_id)) || "—"} · {r.entries.length} entries
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-semibold tabular-nums", r.balance > 0 ? "text-destructive" : r.balance < 0 ? "text-success" : "text-muted-foreground")}>
                    {SAR(Math.abs(r.balance))}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.balance > 0 ? "Outstanding" : r.balance < 0 ? "Advance" : "Settled"}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <EmployeeDetailModal
        open={!!activeEmp}
        onClose={() => setActiveEmp(null)}
        emp={activeEmp}
        shopName={shopName}
        isAdmin={isAdmin}
        onDeleted={() => {
          qc.invalidateQueries({ queryKey: ["employee_entries"] });
        }}
      />
    </div>
  );
}

function EmployeeDetailModal({
  open, onClose, emp, shopName, isAdmin, onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  emp: any | null;
  shopName: (id?: string | null) => string;
  isAdmin: boolean;
  onDeleted: () => void;
}) {
  const confirm = useConfirm();
  if (!emp) return null;
  const shop = emp.shop_name ?? shopName(emp.shop_id);

  const handleShareEmployee = async () => {
    const rows = [
      { label: "Shop", value: shop || "—" },
      { label: "Total Given", value: SAR(emp.given) },
      { label: "Total Received", value: SAR(emp.received) },
      { label: "Outstanding", value: SAR(Math.max(0, emp.balance)) },
      { label: "Entries", value: String(emp.entries.length) },
    ];
    await shareToWhatsApp({
      title: `Employee Report — ${emp.name}`,
      subtitle: shop || undefined,
      amount: SAR(Math.max(0, emp.balance)),
      amountLabel: "Outstanding",
      rows,
      accent: emp.balance > 0 ? "out" : "in",
      badge: emp.balance > 0 ? "OUTSTANDING" : emp.balance < 0 ? "ADVANCE" : "SETTLED",
      caption: `Employee: ${emp.name} · Shop: ${shop || "—"} · Given: ${SAR(emp.given)} · Received: ${SAR(emp.received)} · Outstanding: ${SAR(Math.max(0, emp.balance))}`,
    });
  };

  const handleShareEntry = async (e: any) => {
    const isGiven = e.entry_type === "given";
    await shareToWhatsApp({
      title: isGiven ? "Money Given" : "Money Received",
      subtitle: emp.name,
      amount: SAR(Number(e.amount)),
      amountLabel: isGiven ? "Given" : "Received",
      date: e.txn_date,
      rows: [
        { label: "Employee", value: emp.name },
        { label: "Shop", value: shop || "—" },
        { label: "Type", value: isGiven ? "Given" : "Received" },
        { label: "Amount", value: SAR(Number(e.amount)) },
      ],
      notes: e.notes,
      badge: isGiven ? "OUT" : "IN",
      accent: isGiven ? "out" : "in",
      caption: `${isGiven ? "Money Given" : "Money Received"} · Employee: ${emp.name} · Date: ${e.txn_date} · Amount: ${SAR(Number(e.amount))}`,
    });
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm({ title: "Move entry to Recycle Bin?", description: "The employee ledger will be updated. You can restore from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { error } = await softDelete("employee_entries", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Moved to Recycle Bin");
    onDeleted();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base flex items-center gap-2">
            {emp.name}
            <Badge variant="outline" className="ml-auto text-[10px]">{shop || "No shop"}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4">
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Given" value={SAR(emp.given)} tone="text-destructive" />
            <MiniStat label="Received" value={SAR(emp.received)} tone="text-success" />
            <MiniStat label="Outstanding" value={SAR(Math.max(0, emp.balance))} tone="text-warning" />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Transaction History ({emp.entries.length})
            </p>
            <ul className="divide-y divide-border rounded-xl border border-border">
              {emp.entries.length === 0 && (
                <li className="p-4 text-center text-xs text-muted-foreground">No entries in range.</li>
              )}
              {emp.entries.map((e: any) => {
                const isGiven = e.entry_type === "given";
                return (
                  <li key={e.id} className="px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {isGiven ? "Given" : "Received"}
                          <span className="ml-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />{e.txn_date}
                          </span>
                        </p>
                        {e.notes && <p className="truncate text-[11px] text-muted-foreground">{e.notes}</p>}
                      </div>
                      <span className={cn("shrink-0 text-sm font-semibold tabular-nums", isGiven ? "text-destructive" : "text-success")}>
                        {SAR(e.amount)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] border-success/40 text-success hover:bg-success/10" onClick={() => handleShareEntry(e)}>
                        <MessageCircle className="mr-1 h-3 w-3" /> WhatsApp
                      </Button>
                      {isAdmin && (
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] text-destructive hover:text-destructive" onClick={() => handleDelete(e.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Delete
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border bg-muted/20 px-5 py-3">
          <Button size="sm" variant="outline" className="flex-1 border-success/40 text-success hover:bg-success/10" onClick={handleShareEmployee}>
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Share as Image
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-center">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm font-semibold tabular-nums", tone)}>{value}</p>
    </div>
  );
}
