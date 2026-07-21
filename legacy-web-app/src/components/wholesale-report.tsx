import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SARAmount } from "@/components/sar-amount";
import { SAR, SAR_WHOLE } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Download,
  FileText,
  Share2,
  Users,
  Truck,
  Package,
  Boxes,
  TrendingUp,
  Wallet,
  AlertCircle,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

// ── tiny export helpers (local copy to keep this file self-contained) ──
function downloadCSV(filename: string, rows: (string | number)[][]) {
  if (rows.length <= 1) return toast.error("No data to export");
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
function openPDF(
  title: string,
  meta: string,
  summary: { label: string; value: number }[],
  table: { headers: string[]; rows: (string | number)[][] },
) {
  const w = window.open("", "_blank");
  if (!w) return;
  const kpis = summary
    .map(
      (s) =>
        `<div class="kpi"><div class="kpi-l">${s.label}</div><div class="kpi-v">${SAR_WHOLE(s.value)}</div></div>`,
    )
    .join("");
  const head = table.headers.map((h) => `<th>${h}</th>`).join("");
  const body =
    table.rows
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
      .join("") ||
    `<tr><td colspan="${table.headers.length}" style="text-align:center;color:#888;padding:18px">No data</td></tr>`;
  w.document.write(`<!doctype html><html><head><title>${title}</title>
  <style>
    body{font-family:Inter,system-ui,Arial;padding:28px;color:#0f172a;background:#fff}
    .brand{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:10px}
    h1{margin:0;font-size:20px}h2{margin:22px 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#475569}
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
    .kpi{border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;background:#f8fafc}
    .kpi-l{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
    .kpi-v{font-weight:700;font-size:15px;margin-top:4px}
    table{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px}
    th{background:#f1f5f9;text-align:left;padding:8px;border-bottom:1px solid #cbd5e1}
    td{padding:7px 8px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even) td{background:#fafafa}
  </style></head><body>
  <div class="brand"><div><h1>ShRiAh Group · WholeSale</h1><p>${title}</p></div><p>${meta}</p></div>
  <h2>Summary</h2><div class="kpis">${kpis}</div>
  <h2>Details</h2><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
  <script>window.onload=()=>setTimeout(()=>window.print(),250)</script>
  </body></html>`);
  w.document.close();
}
function shareWA(title: string, meta: string, summary: { label: string; value: number }[]) {
  const lines = [`*${title}*`, meta, "", ...summary.map((s) => `${s.label}: ${SAR_WHOLE(s.value)}`)];
  window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

function ExportBar({ onCSV, onPDF, onShare }: { onCSV: () => void; onPDF: () => void; onShare: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onCSV}><Download className="mr-1 h-4 w-4" /> Excel</Button>
      <Button variant="outline" size="sm" onClick={onPDF}><FileText className="mr-1 h-4 w-4" /> PDF</Button>
      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={onShare}>
        <Share2 className="mr-1 h-4 w-4" /> Share
      </Button>
    </div>
  );
}

function KCard({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "success" | "danger" | "warning" | "info" }) {
  const t =
    tone === "success" ? "text-success"
    : tone === "danger" ? "text-destructive"
    : tone === "warning" ? "text-warning"
    : tone === "info" ? "text-primary"
    : "text-foreground";
  return (
    <Card className="p-3.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className={cn("mt-1.5", t)}><SARAmount value={value} size="lg" /></div>
    </Card>
  );
}

type SubKey = "customers" | "suppliers" | "products" | "stock" | "profit" | "payments" | "dues" | "activity";

const SUBS: { k: SubKey; label: string; icon: any }[] = [
  { k: "customers", label: "Customer Sales", icon: Users },
  { k: "suppliers", label: "Supplier Purchase", icon: Truck },
  { k: "products", label: "Product Sales", icon: Package },
  { k: "stock", label: "Stock Value", icon: Boxes },
  { k: "profit", label: "Profit", icon: TrendingUp },
  { k: "payments", label: "Payments", icon: Wallet },
  { k: "dues", label: "Credit / Due", icon: AlertCircle },
  { k: "activity", label: "Activity", icon: Activity },
];

const PAGE = 20;

function useLoadMore<T>(rows: T[]) {
  const [n, setN] = useState(PAGE);
  const visible = rows.slice(0, n);
  const more = rows.length > n;
  return {
    visible,
    more,
    loadMore: () => setN((x) => x + PAGE),
    total: rows.length,
    shown: visible.length,
  };
}

export function WholeSaleReport({ from, to, snapshotKey = "" }: { from: string; to: string; snapshotKey?: string }) {
  const sk = snapshotKey;
  const [sub, setSub] = useState<SubKey>("customers");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SUBS.map(({ k, label, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setSub(k)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              sub === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {sub === "customers" && <CustomerSales from={from} to={to} sk={sk} />}
      {sub === "suppliers" && <SupplierPurchase from={from} to={to} sk={sk} />}
      {sub === "products" && <ProductSales from={from} to={to} sk={sk} />}
      {sub === "stock" && <StockValue sk={sk} />}
      {sub === "profit" && <ProfitReport from={from} to={to} sk={sk} />}
      {sub === "payments" && <PaymentReport from={from} to={to} sk={sk} />}
      {sub === "dues" && <DueReport from={from} to={to} sk={sk} />}
      {sub === "activity" && <ActivityReport from={from} to={to} sk={sk} />}
    </div>
  );
}

function CustomerSales({ from, to, sk }: { from: string; to: string; sk: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "high">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["ws-cust-sales", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [c, s, p] = await Promise.all([
        supabase.from("pos_customers").select("id,name,phone,opening_due").eq("is_deleted", false),
        supabase.from("shop_sales").select("id,customer_id,customer_name,txn_date,total,paid_amount,due_amount,payment_method,status").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind,txn_date").gte("txn_date", from).lte("txn_date", to),
      ]);
      return { customers: c.data ?? [], sales: s.data ?? [], payments: p.data ?? [] };
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const byId = new Map<string, any>();
    const ensure = (id: string | null, name: string, phone = "") => {
      const key = id ?? "__walkin__";
      if (!byId.has(key)) {
        byId.set(key, {
          id: key,
          name: id ? name : "Walk-in",
          phone,
          totalSales: 0,
          cashSales: 0,
          creditSales: 0,
          paid: 0,
          due: 0,
          invoices: 0,
          lastDate: "" as string,
        });
      }
      return byId.get(key);
    };
    for (const c of data.customers) ensure(c.id, c.name, c.phone ?? "").due += Number(c.opening_due ?? 0);
    for (const s of data.sales) {
      if (s.status === "cancelled") continue;
      const r = ensure(s.customer_id, s.customer_name);
      const total = Number(s.total ?? 0);
      const paid = Number(s.paid_amount ?? 0);
      const due = Number(s.due_amount ?? 0);
      r.totalSales += total;
      r.invoices += 1;
      if (due > 0) r.creditSales += due;
      r.cashSales += paid;
      r.paid += paid;
      r.due += due;
      if (!r.lastDate || s.txn_date > r.lastDate) r.lastDate = s.txn_date;
    }
    for (const p of data.payments) {
      if (p.kind !== "payment_in") continue;
      const r = ensure(p.customer_id, "");
      r.paid += Number(p.amount ?? 0);
      r.due -= Number(p.amount ?? 0);
    }
    let arr = [...byId.values()].filter((r) => r.invoices > 0 || r.due !== 0);
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter((r) => r.name.toLowerCase().includes(q) || (r.phone ?? "").includes(q));
    }
    if (filter === "paid") arr = arr.filter((r) => r.due <= 0.01);
    if (filter === "unpaid") arr = arr.filter((r) => r.due > 0.01);
    if (filter === "high") arr = arr.filter((r) => r.due > 1000);
    return arr.sort((a, b) => b.totalSales - a.totalSales);
  }, [data, search, filter]);

  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = useMemo(
    () => [
      { label: "Total Sales", value: rows.reduce((s, r) => s + r.totalSales, 0) },
      { label: "Total Paid", value: rows.reduce((s, r) => s + r.paid, 0) },
      { label: "Total Due", value: rows.reduce((s, r) => s + Math.max(0, r.due), 0) },
      { label: "Customers", value: rows.length },
    ],
    [rows],
  );
  const meta = `${from} → ${to}`;
  const headers = ["Customer", "Phone", "Invoices", "Total Sales", "Paid", "Due"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.invoices, r.totalSales, r.paid, Math.max(0, r.due)]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`customer-sales-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Customer Sales Report", meta, summary.slice(0, 3), { headers, rows: tableRows })}
        onShare={() => shareWA("Customer Sales", meta, summary.slice(0, 3))}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KCard label="Total Sales" value={summary[0].value} tone="info" />
        <KCard label="Total Paid" value={summary[1].value} tone="success" />
        <KCard label="Total Due" value={summary[2].value} tone="warning" />
        <Card className="p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Customers</p>
          <p className="mt-1.5 text-lg font-bold">{rows.length}</p>
        </Card>
      </div>
      <Card className="p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
          <Input placeholder="Search customer / phone…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
          <div className="flex gap-1">
            {["all", "paid", "unpaid", "high"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
                  filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground",
                )}
              >
                {f === "high" ? "High Due" : f}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [r.name, r.phone || "—", String(r.invoices), SAR(r.totalSales), SAR(r.paid), SAR(Math.max(0, r.due))])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function SupplierPurchase({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-supplier", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await supabase
        .from("shop_purchases")
        .select("id,supplier_name,supplier_mobile,txn_date,total,status")
        .gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false);
      return data ?? [];
    },
  });
  const rows = useMemo(() => {
    const m = new Map<string, any>();
    for (const p of data ?? []) {
      if (p.status === "cancelled") continue;
      const key = p.supplier_name || "Unknown";
      const r = m.get(key) ?? { name: key, phone: p.supplier_mobile ?? "", total: 0, cash: 0, credit: 0, paid: 0, payable: 0, invoices: 0 };
      r.total += Number(p.total ?? 0);
      r.cash += Number(p.total ?? 0);
      r.paid += Number(p.total ?? 0);
      r.invoices += 1;
      m.set(key, r);
    }
    return [...m.values()].sort((a, b) => b.total - a.total);
  }, [data]);

  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Total Purchases", value: rows.reduce((s, r) => s + r.total, 0) },
    { label: "Paid", value: rows.reduce((s, r) => s + r.paid, 0) },
    { label: "Suppliers", value: rows.length },
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Supplier", "Phone", "Invoices", "Total Purchase", "Paid", "Payable"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.invoices, r.total, r.paid, r.payable]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`supplier-purchase-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Supplier Purchase Report", meta, summary.slice(0, 2), { headers, rows: tableRows })}
        onShare={() => shareWA("Supplier Purchase", meta, summary.slice(0, 2))}
      />
      <div className="grid grid-cols-3 gap-3">
        <KCard label="Total Purchase" value={summary[0].value} tone="info" />
        <KCard label="Paid" value={summary[1].value} tone="success" />
        <Card className="p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Suppliers</p>
          <p className="mt-1.5 text-lg font-bold">{rows.length}</p>
        </Card>
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [r.name, r.phone || "—", String(r.invoices), SAR(r.total), SAR(r.paid), SAR(r.payable)])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function ProductSales({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-product-sales", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [s, prod] = await Promise.all([
        supabase.from("shop_sales").select("items,status,txn_date").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false),
        supabase.from("shop_products").select("id,name,stock,purchase_price,price").eq("is_deleted", false),
      ]);
      return { sales: s.data ?? [], products: prod.data ?? [] };
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const m = new Map<string, any>();
    for (const p of data.products) {
      m.set(p.id, {
        id: p.id,
        name: p.name,
        qty: 0,
        sale: 0,
        purchaseVal: 0,
        profit: 0,
        stock: Number(p.stock ?? 0),
        ppRef: Number(p.purchase_price ?? 0),
      });
    }
    for (const s of data.sales) {
      if (s.status === "cancelled") continue;
      const items = Array.isArray(s.items) ? s.items : [];
      for (const it of items as any[]) {
        const pid = it.product_id || it.id;
        if (!pid) continue;
        const r = m.get(pid);
        if (!r) continue;
        const qty = Number(it.qty ?? 0);
        const price = Number(it.price ?? 0);
        const pp = Number(it.purchase_price ?? r.ppRef ?? 0);
        r.qty += qty;
        r.sale += qty * price;
        r.purchaseVal += qty * pp;
        r.profit += qty * (price - pp);
      }
    }
    return [...m.values()].filter((r) => r.qty > 0).sort((a, b) => b.sale - a.sale);
  }, [data]);

  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Sale Value", value: rows.reduce((s, r) => s + r.sale, 0) },
    { label: "Cost Value", value: rows.reduce((s, r) => s + r.purchaseVal, 0) },
    { label: "Profit", value: rows.reduce((s, r) => s + r.profit, 0) },
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Product", "Qty Sold", "Sale Value", "Cost Value", "Profit", "Stock Left"];
  const tableRows = rows.map((r) => [r.name, r.qty, r.sale, r.purchaseVal, r.profit, r.stock]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`product-sales-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Product Sales Report", meta, summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Product Sales", meta, summary)}
      />
      <div className="grid grid-cols-3 gap-3">
        <KCard label="Sale Value" value={summary[0].value} tone="info" />
        <KCard label="Cost Value" value={summary[1].value} tone="warning" />
        <KCard label="Profit" value={summary[2].value} tone="success" />
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [r.name, String(r.qty), SAR(r.sale), SAR(r.purchaseVal), SAR(r.profit), String(r.stock)])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function StockValue({ sk }: { sk: string }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["ws-stock", sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await supabase
        .from("shop_products")
        .select("id,name,stock,min_stock,purchase_price,price")
        .eq("is_deleted", false);
      return data ?? [];
    },
  });

  const rows = useMemo(
    () =>
      (data as any[])
        .map((p) => ({
          name: p.name,
          stock: Number(p.stock ?? 0),
          min: Number(p.min_stock ?? 0),
          purchaseVal: Number(p.stock ?? 0) * Number(p.purchase_price ?? 0),
          saleVal: Number(p.stock ?? 0) * Number(p.price ?? 0),
        }))
        .sort((a, b) => b.purchaseVal - a.purchaseVal),
    [data],
  );

  const lowStock = rows.filter((r) => r.stock > 0 && r.stock <= r.min).length;
  const outStock = rows.filter((r) => r.stock <= 0).length;
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);

  const summary = [
    { label: "Purchase Value", value: rows.reduce((s, r) => s + r.purchaseVal, 0) },
    { label: "Sale Value", value: rows.reduce((s, r) => s + r.saleVal, 0) },
    { label: "Est. Profit", value: rows.reduce((s, r) => s + (r.saleVal - r.purchaseVal), 0) },
  ];
  const headers = ["Product", "Stock", "Min", "Purchase Value", "Sale Value"];
  const tableRows = rows.map((r) => [r.name, r.stock, r.min, r.purchaseVal, r.saleVal]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`stock-value.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Stock Value Report", new Date().toLocaleDateString(), summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Stock Value", new Date().toLocaleDateString(), summary)}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KCard label="Purchase Value" value={summary[0].value} tone="info" />
        <KCard label="Sale Value" value={summary[1].value} tone="success" />
        <Card className="p-3.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Low Stock</p>
          <p className="mt-1.5 text-lg font-bold text-warning">{lowStock}</p>
        </Card>
        <Card className="p-3.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Out of Stock</p>
          <p className="mt-1.5 text-lg font-bold text-destructive">{outStock}</p>
        </Card>
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [
          r.name,
          r.stock <= 0 ? <Badge variant="destructive" key="o">Out</Badge> : r.stock <= r.min ? <Badge className="bg-warning text-warning-foreground" key="l">{r.stock}</Badge> : String(r.stock),
          String(r.min),
          SAR(r.purchaseVal),
          SAR(r.saleVal),
        ])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function ProfitReport({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-profit", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data } = await supabase
        .from("shop_sales")
        .select("items,status,txn_date")
        .gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false);
      return data ?? [];
    },
  });

  const { daily, products } = useMemo(() => {
    const byDay = new Map<string, { date: string; sale: number; cost: number; profit: number }>();
    const byProd = new Map<string, { name: string; qty: number; profit: number }>();
    for (const s of (data ?? []) as any[]) {
      if (s.status === "cancelled") continue;
      const d = byDay.get(s.txn_date) ?? { date: s.txn_date, sale: 0, cost: 0, profit: 0 };
      for (const it of (s.items as any[]) ?? []) {
        const qty = Number(it.qty ?? 0);
        const price = Number(it.price ?? 0);
        const pp = Number(it.purchase_price ?? 0);
        const sale = qty * price;
        const cost = qty * pp;
        d.sale += sale;
        d.cost += cost;
        d.profit += sale - cost;
        const pid = it.product_id || it.id || it.name;
        const pr = byProd.get(pid) ?? { name: it.name ?? "—", qty: 0, profit: 0 };
        pr.qty += qty;
        pr.profit += sale - cost;
        byProd.set(pid, pr);
      }
      byDay.set(s.txn_date, d);
    }
    return {
      daily: [...byDay.values()].sort((a, b) => (a.date < b.date ? 1 : -1)),
      products: [...byProd.values()].sort((a, b) => b.profit - a.profit).slice(0, 50),
    };
  }, [data]);

  const totalProfit = daily.reduce((s, d) => s + d.profit, 0);
  const totalSale = daily.reduce((s, d) => s + d.sale, 0);
  const totalCost = daily.reduce((s, d) => s + d.cost, 0);
  const summary = [
    { label: "Total Sale", value: totalSale },
    { label: "Total Cost", value: totalCost },
    { label: "Total Profit", value: totalProfit },
  ];
  const { visible, more, loadMore, shown, total } = useLoadMore(daily);
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Sale", "Cost", "Profit"];
  const tableRows = daily.map((d) => [d.date, d.sale, d.cost, d.profit]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`profit-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Profit Report", meta, summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Profit", meta, summary)}
      />
      <div className="grid grid-cols-3 gap-3">
        <KCard label="Sale" value={totalSale} tone="info" />
        <KCard label="Cost" value={totalCost} tone="warning" />
        <KCard label="Profit" value={totalProfit} tone="success" />
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((d) => [d.date, SAR(d.sale), SAR(d.cost), SAR(d.profit)])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/30 px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Profit Products</p>
        </div>
        <ul className="divide-y divide-border">
          {products.slice(0, 10).map((p, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="truncate">{p.name} <span className="text-xs text-muted-foreground">×{p.qty}</span></span>
              <span className="font-semibold tabular-nums text-success">{SAR(p.profit)}</span>
            </li>
          ))}
          {products.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No data</li>}
        </ul>
      </Card>
    </div>
  );
}

function PaymentReport({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-payments", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [pay, sales] = await Promise.all([
        supabase.from("pos_payments").select("id,customer_id,amount,kind,method,txn_date,notes").gte("txn_date", from).lte("txn_date", to),
        supabase.from("shop_sales").select("id,customer_name,paid_amount,due_amount,txn_date,status").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false),
      ]);
      return { payments: pay.data ?? [], sales: sales.data ?? [] };
    },
  });

  const stats = useMemo(() => {
    let pIn = 0;
    let pOut = 0;
    let dueAdded = 0;
    for (const p of data?.payments ?? []) {
      if (p.kind === "payment_in") pIn += Number(p.amount);
      else pOut += Number(p.amount);
    }
    for (const s of data?.sales ?? []) {
      if (s.status === "cancelled") continue;
      dueAdded += Number(s.due_amount ?? 0);
    }
    return { pIn, pOut, dueAdded };
  }, [data]);

  const rows = (data?.payments ?? []).slice().sort((a: any, b: any) => (a.txn_date < b.txn_date ? 1 : -1));
  const { visible, more, loadMore, shown, total } = useLoadMore(rows as any[]);
  const summary = [
    { label: "Payment In", value: stats.pIn },
    { label: "Payment Out", value: stats.pOut },
    { label: "New Dues", value: stats.dueAdded },
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Kind", "Method", "Amount", "Notes"];
  const tableRows = (rows as any[]).map((p) => [p.txn_date, p.kind, p.method, Number(p.amount), p.notes ?? ""]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`payments-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Payment Report", meta, summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Payment Report", meta, summary)}
      />
      <div className="grid grid-cols-3 gap-3">
        <KCard label="Payment In" value={stats.pIn} tone="success" />
        <KCard label="Payment Out" value={stats.pOut} tone="danger" />
        <KCard label="New Dues" value={stats.dueAdded} tone="warning" />
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={(visible as any[]).map((p) => [p.txn_date, p.kind, p.method, SAR(Number(p.amount)), p.notes ?? ""])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function DueReport({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-dues", sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [c, s, p] = await Promise.all([
        supabase.from("pos_customers").select("id,name,phone,opening_due").eq("is_deleted", false),
        supabase.from("shop_sales").select("customer_id,due_amount,txn_date,status").eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind"),
      ]);
      return { customers: c.data ?? [], sales: s.data ?? [], payments: p.data ?? [] };
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const m = new Map<string, any>();
    for (const c of data.customers) {
      m.set(c.id, { id: c.id, name: c.name, phone: c.phone ?? "", due: Number(c.opening_due ?? 0), oldest: "" as string });
    }
    for (const s of data.sales) {
      if (!s.customer_id || s.status === "cancelled") continue;
      const r = m.get(s.customer_id);
      if (!r) continue;
      const d = Number(s.due_amount ?? 0);
      if (d > 0) {
        r.due += d;
        if (!r.oldest || s.txn_date < r.oldest) r.oldest = s.txn_date;
      }
    }
    for (const p of data.payments) {
      if (p.kind !== "payment_in") continue;
      const r = m.get(p.customer_id);
      if (!r) continue;
      r.due -= Number(p.amount ?? 0);
    }
    return [...m.values()].filter((r) => r.due > 0.01).map((r) => {
      const days = r.oldest ? Math.floor((Date.now() - new Date(r.oldest).getTime()) / 86400000) : 0;
      const bucket = days <= 30 ? "0-30" : days <= 60 ? "31-60" : days <= 90 ? "61-90" : "90+";
      return { ...r, days, bucket };
    }).sort((a, b) => b.due - a.due);
  }, [data]);

  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Total Due", value: rows.reduce((s, r) => s + r.due, 0) },
    { label: "Overdue 30d+", value: rows.filter((r) => r.days > 30).reduce((s, r) => s + r.due, 0) },
    { label: "Overdue 90d+", value: rows.filter((r) => r.days > 90).reduce((s, r) => s + r.due, 0) },
  ];
  const meta = `as of ${new Date().toLocaleDateString()}`;
  const headers = ["Customer", "Phone", "Due", "Oldest", "Days", "Aging"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.due, r.oldest || "—", r.days, r.bucket]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`dues.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Credit / Due Report", meta, summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Credit / Due", meta, summary)}
      />
      <div className="grid grid-cols-3 gap-3">
        <KCard label="Total Due" value={summary[0].value} tone="warning" />
        <KCard label="Overdue 30d+" value={summary[1].value} tone="danger" />
        <KCard label="Overdue 90d+" value={summary[2].value} tone="danger" />
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [r.name, r.phone || "—", SAR(r.due), r.oldest || "—", String(r.days), r.bucket])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function ActivityReport({ from, to, sk }: { from: string; to: string; sk: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-activity", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [s, p, pay] = await Promise.all([
        supabase.from("shop_sales").select("id,invoice_number,customer_name,total,status,is_deleted,txn_date,edit_count,created_at").gte("txn_date", from).lte("txn_date", to),
        supabase.from("shop_purchases").select("id,invoice_number,supplier_name,total,status,is_deleted,txn_date,created_at").gte("txn_date", from).lte("txn_date", to),
        supabase.from("pos_payments").select("id,amount,kind,txn_date,created_at").gte("txn_date", from).lte("txn_date", to),
      ]);
      return { sales: s.data ?? [], purchases: p.data ?? [], payments: pay.data ?? [] };
    },
  });

  const rows = useMemo(() => {
    const out: { date: string; kind: string; ref: string; detail: string; amount: number }[] = [];
    for (const s of data?.sales ?? []) {
      const kind = s.is_deleted ? "Sale Deleted" : (s.edit_count ?? 0) > 0 ? "Sale Edited" : "Sale";
      out.push({ date: s.txn_date, kind, ref: `#${s.invoice_number}`, detail: s.customer_name, amount: Number(s.total ?? 0) });
    }
    for (const p of data?.purchases ?? []) {
      const kind = p.is_deleted ? "Purchase Deleted" : "Purchase";
      out.push({ date: p.txn_date, kind, ref: `#${p.invoice_number}`, detail: p.supplier_name, amount: Number(p.total ?? 0) });
    }
    for (const pay of data?.payments ?? []) {
      out.push({ date: pay.txn_date, kind: pay.kind === "payment_in" ? "Payment In" : "Payment Out", ref: "", detail: "", amount: Number(pay.amount) });
    }
    return out.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [data]);

  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Sales Count", value: (data?.sales ?? []).filter((s: any) => !s.is_deleted).length },
    { label: "Purchases Count", value: (data?.purchases ?? []).filter((p: any) => !p.is_deleted).length },
    { label: "Deleted", value: (data?.sales ?? []).filter((s: any) => s.is_deleted).length + (data?.purchases ?? []).filter((p: any) => p.is_deleted).length },
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Action", "Ref", "Detail", "Amount"];
  const tableRows = rows.map((r) => [r.date, r.kind, r.ref, r.detail, r.amount]);

  return (
    <div className="space-y-4">
      <ExportBar
        onCSV={() => downloadCSV(`activity-${from}-to-${to}.csv`, [headers, ...tableRows])}
        onPDF={() => openPDF("Activity Report", meta, summary, { headers, rows: tableRows })}
        onShare={() => shareWA("Activity", meta, summary)}
      />
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sales</p><p className="mt-1.5 text-lg font-bold">{summary[0].value}</p></Card>
        <Card className="p-3.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Purchases</p><p className="mt-1.5 text-lg font-bold">{summary[1].value}</p></Card>
        <Card className="p-3.5"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deleted</p><p className="mt-1.5 text-lg font-bold text-destructive">{summary[2].value}</p></Card>
      </div>
      <DataTable
        loading={isLoading}
        headers={headers}
        rows={visible.map((r) => [r.date, r.kind, r.ref, r.detail, SAR(r.amount)])}
        more={more}
        loadMore={loadMore}
        shown={shown}
        total={total}
      />
    </div>
  );
}

function DataTable({
  loading,
  headers,
  rows,
  more,
  loadMore,
  shown,
  total,
}: {
  loading: boolean;
  headers: string[];
  rows: (string | number | ReactNode)[][];
  more: boolean;
  loadMore: () => void;
  shown: number;
  total: number;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
              {headers.map((h, i) => (
                <th key={i} className={cn("px-3 py-2 text-left font-semibold", i >= headers.length - 4 && "text-right")}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr><td colSpan={headers.length} className="p-6 text-center text-sm text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={headers.length} className="p-6 text-center text-sm text-muted-foreground">No data</td></tr>
            )}
            {!loading && rows.map((r, i) => (
              <tr key={i} className="hover:bg-accent/40">
                {r.map((c, j) => (
                  <td key={j} className={cn("px-3 py-2 tabular-nums", j >= headers.length - 4 && "text-right")}>{c as any}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(more || total > 0) && (
        <div className="flex items-center justify-between border-t bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
          <span>Showing {shown} of {total}</span>
          {more && (
            <Button size="sm" variant="outline" onClick={loadMore}>Load more</Button>
          )}
        </div>
      )}
    </Card>
  );
}
