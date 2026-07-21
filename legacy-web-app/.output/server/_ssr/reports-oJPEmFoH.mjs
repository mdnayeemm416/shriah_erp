import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { o as useWorkingDate, J as sortShops, d as cn, C as Card, I as Input, B as Button, aF as TXN_LABELS, af as SAR, aH as shopRank, k as useAuth, u as useConfirm, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, h as Badge, aG as SAR_WHOLE, az as useSignedAttachmentUrl } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { softDelete } from "./soft-delete-DQY0d6eC.mjs";
import { A as AttachmentLightbox } from "./attachment-lightbox-DWyyAMyd.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { S as ShopDrilldownSheet } from "./shop-drilldown-sheet-C3mMqF9g.mjs";
import { I as InfoButton } from "./info-button-BBedyB3N.mjs";
import { u as useShopPositions } from "./use-shop-positions-B07f-IJE.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { b4 as LayoutDashboard, aa as Store, b5 as ArrowLeftRight, U as Users, b6 as Warehouse, $ as FileText, aC as Truck, v as Package, aE as Boxes, ae as TrendingUp, W as Wallet, aL as CircleAlert, aR as Activity, l as Sparkles, k as LoaderCircle, aT as CalendarDays, D as UserRound, aJ as Tag, b7 as Layers, E as ScanLine, aX as FileDown, I as MessageCircle, a5 as Pencil, T as Trash2, _ as Download, Y as Share2, m as ChevronDown, X, n as Check, q as Paperclip } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";




import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/isbot.mjs";
import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "./help-content-CrTK3PSB.mjs";
const TABLE = {
  transaction: "transactions",
  shop_entry: "shop_entries",
  warehouse_entry: "warehouse_ledger"
};
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function RecordDetailDialog({ open, onOpenChange, recordId, kind }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [deleting, setDeleting] = reactExports.useState(false);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const { data: rec, isLoading } = useQuery({
    queryKey: ["record-detail", kind, recordId],
    enabled: !!recordId && !!kind && open,
    queryFn: async () => {
      if (!recordId || !kind) return null;
      let q = supabase.from(TABLE[kind]).select(
        kind === "shop_entry" ? "*, shops(name), cashiers(name)" : kind === "transaction" ? "*, shops(name)" : "*"
      ).eq("id", recordId).maybeSingle();
      const { data } = await q;
      return data;
    }
  });
  const totalSale = reactExports.useMemo(() => {
    if (!rec || kind !== "shop_entry") return 0;
    return Number(rec.cash_sale ?? 0) + Number(rec.bank_sale ?? 0) + Number(rec.credit_sale ?? 0);
  }, [rec, kind]);
  const isImage = rec?.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(rec.attachment_url);
  const headline = () => {
    if (!rec || !kind) return "Entry";
    if (kind === "transaction") return TXN_LABELS[rec.type] ?? rec.type;
    if (kind === "warehouse_entry") {
      const map = {
        warehouse_sale: "Warehouse Sale",
        warehouse_purchase: "Warehouse Purchase",
        payment_received: "Payment Received",
        supplier_payment: "Supplier Payment"
      };
      return map[rec.entry_type] ?? rec.entry_type;
    }
    if (rec.entry_type === "sale") return "Shop Sale";
    if (rec.entry_type === "purchase") return "Shop Purchase";
    if (rec.entry_type === "withdraw") return "Bank Withdraw";
    if (rec.entry_type === "expense") return "Shop Expense";
    return "Shop Entry";
  };
  const heroAmount = () => {
    if (!rec || !kind) return 0;
    if (kind === "transaction") return Number(rec.amount ?? 0);
    if (kind === "warehouse_entry") return Number(rec.amount ?? 0);
    if (rec.entry_type === "sale") return totalSale;
    if (rec.entry_type === "purchase") return Number(rec.purchase_amount ?? 0);
    if (rec.entry_type === "withdraw") return Number(rec.withdraw_amount ?? 0);
    if (rec.entry_type === "expense") return Number(rec.expense_amount ?? 0);
    return 0;
  };
  const heroLabel = () => {
    if (!rec || !kind) return "Amount";
    if (kind === "transaction") return rec.type === "cash_in" ? "Cash In" : "Cash Out";
    if (kind === "warehouse_entry") return "Amount";
    if (rec.entry_type === "sale") return "Total Sale";
    if (rec.entry_type === "purchase") return "Purchase Amount";
    if (rec.entry_type === "withdraw") return "Withdraw Amount";
    return "Amount";
  };
  const handleEdit = () => {
    if (!rec || !kind) return;
    onOpenChange(false);
    if (kind === "shop_entry") navigate({ to: "/shop", search: { edit: rec.id } });
    else if (kind === "warehouse_entry") navigate({ to: "/summary" });
    else navigate({ to: "/summary" });
  };
  const handleDelete = async () => {
    if (!rec || !kind) return;
    if (!await confirm({ title: "Move entry to Recycle Bin?", description: "All linked balances and ledgers will be reversed. You can recover this from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    setDeleting(true);
    const table = kind === "transaction" ? "transactions" : kind === "shop_entry" ? "shop_entries" : "warehouse_ledger";
    const { error } = await softDelete(table, rec.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin");
    qc.invalidateQueries({ queryKey: ["txns"] });
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["wh_ledger"] });
    qc.invalidateQueries({ queryKey: ["drill"] });
    qc.invalidateQueries({ queryKey: ["record-detail"] });
    onOpenChange(false);
  };
  const handleShare = async () => {
    if (!rec) return;
    const rows = [];
    rows.push({ label: "Date", value: rec.txn_date });
    if (kind === "shop_entry") {
      if (rec.shops?.name) rows.push({ label: "Shop", value: rec.shops.name });
      if (rec.cashiers?.name) rows.push({ label: "Cashier", value: rec.cashiers.name });
      if (rec.entry_type === "sale") {
        rows.push({ label: "POS Sale", value: SAR(rec.pos_sale) });
        rows.push({ label: "Total Sale", value: SAR(totalSale) });
        rows.push({ label: "Cash Sale", value: SAR(rec.cash_sale) });
        rows.push({ label: "Bank Sale", value: SAR(rec.bank_sale) });
        rows.push({ label: "Credit Sale", value: SAR(rec.credit_sale) });
        rows.push({ label: "Plus / Minus", value: SAR(rec.difference) });
      }
    } else if (kind === "transaction") {
      rows.push({ label: "Type", value: TXN_LABELS[rec.type] ?? rec.type });
      rows.push({ label: "Amount", value: SAR(rec.amount) });
      if (rec.category) rows.push({ label: "Category", value: rec.category });
      if (rec.subcategory) rows.push({ label: "Sub-category", value: rec.subcategory });
      if (rec.shops?.name) rows.push({ label: "Shop", value: rec.shops.name });
      if (rec.payment_method) rows.push({ label: "Payment", value: rec.payment_method });
    } else {
      rows.push({ label: "Party", value: rec.party_name });
      rows.push({ label: "Type", value: rec.entry_type });
      rows.push({ label: "Status", value: rec.payment_status });
      rows.push({ label: "Amount", value: SAR(rec.amount) });
      rows.push({ label: "Paid", value: SAR(rec.paid_amount) });
      rows.push({ label: "Remaining Due", value: SAR(rec.remaining_due) });
    }
    const accent = kind === "transaction" ? rec.type === "cash_in" ? "in" : rec.type === "cash_out" || rec.type === "purchase" ? "out" : "neutral" : kind === "shop_entry" ? rec.entry_type === "sale" ? "in" : "out" : rec.entry_type === "warehouse_sale" || rec.entry_type === "payment_received" ? "in" : "out";
    const captionParts = [headline()];
    if (kind === "shop_entry") {
      if (rec.shops?.name) captionParts.push(`Shop: ${rec.shops.name}`);
      if (rec.cashiers?.name) captionParts.push(`Cashier: ${rec.cashiers.name}`);
    } else if (kind === "warehouse_entry" && rec.party_name) {
      captionParts.push(`Party: ${rec.party_name}`);
    } else if (kind === "transaction" && rec.shops?.name) {
      captionParts.push(`Shop: ${rec.shops.name}`);
    }
    if (rec.txn_date) captionParts.push(`Date: ${rec.txn_date}`);
    captionParts.push(`Amount: ${SAR(heroAmount())}`);
    await shareToWhatsApp({
      title: headline(),
      subtitle: kind === "shop_entry" ? [rec.shops?.name, rec.cashiers?.name].filter(Boolean).join(" · ") || void 0 : kind === "warehouse_entry" ? rec.party_name : rec.shops?.name || rec.category || void 0,
      amount: SAR(heroAmount()),
      amountLabel: heroLabel(),
      date: rec.txn_date,
      rows,
      notes: rec.notes,
      badge: kind === "transaction" ? TXN_LABELS[rec.type] ?? rec.type : void 0,
      accent,
      caption: captionParts.join(" · ")
    });
  };
  const handlePDF = () => {
    if (!rec) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml = [];
    const push = (l, v) => rowsHtml.push(`<tr><td class="l">${esc(l)}</td><td class="v">${esc(v)}</td></tr>`);
    push("Date", rec.txn_date);
    if (kind === "shop_entry") {
      push("Shop", rec.shops?.name ?? "—");
      if (rec.cashiers?.name) push("Cashier", rec.cashiers.name);
      if (rec.entry_type === "sale") {
        push("POS Sale", SAR(rec.pos_sale));
        push("Total Sale", SAR(totalSale));
        push("Cash Sale", SAR(rec.cash_sale));
        push("Bank Sale", SAR(rec.bank_sale));
        push("Credit Sale", SAR(rec.credit_sale));
        push("Plus / Minus", SAR(rec.difference));
      } else {
        push("Amount", SAR(heroAmount()));
      }
    } else if (kind === "transaction") {
      push("Type", TXN_LABELS[rec.type] ?? rec.type);
      push("Amount", SAR(rec.amount));
      if (rec.category) push("Category", rec.category);
      if (rec.subcategory) push("Sub-category", rec.subcategory);
      if (rec.shops?.name) push("Shop", rec.shops.name);
      if (rec.payment_method) push("Payment", rec.payment_method);
    } else {
      push("Party", rec.party_name);
      push("Type", rec.entry_type);
      push("Status", rec.payment_status);
      push("Amount", SAR(rec.amount));
      push("Paid", SAR(rec.paid_amount));
      push("Remaining Due", SAR(rec.remaining_due));
    }
    if (rec.notes) push("Notes", rec.notes);
    w.document.write(`<!doctype html><html><head><title>${esc(headline())}</title>
      <style>
        body{font-family:Inter,system-ui,Arial,sans-serif;padding:32px;color:#0f172a}
        h1{margin:0 0 4px;font-size:22px}
        .meta{color:#64748b;font-size:12px;margin-bottom:18px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        td{padding:9px 12px;border-bottom:1px solid #e2e8f0}
        td.l{color:#64748b;width:40%;text-transform:uppercase;font-size:10px;letter-spacing:.08em}
        td.v{text-align:right;font-weight:600}
      </style></head><body>
      <h1>${esc(headline())}</h1>
      <p class="meta">${esc(SAR(heroAmount()))} · Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
      <table>${rowsHtml.join("")}</table>
      <script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script>
      </body></html>`);
    w.document.close();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: headline() }),
      rec?.ocr_scan_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "mt-1 w-fit gap-1 px-1.5 py-0.5 text-[10px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
        " OCR linked"
      ] })
    ] }),
    isLoading || !rec ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: heroLabel() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: heroAmount(), size: "2xl", whole: false }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3" }),
            rec.txn_date
          ] }),
          kind === "shop_entry" && rec.shops?.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
            rec.shops.name
          ] }),
          kind === "shop_entry" && rec.cashiers?.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-3 w-3" }),
            rec.cashiers.name
          ] }),
          kind === "transaction" && rec.shops?.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
            rec.shops.name
          ] }),
          kind === "warehouse_entry" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            rec.party_name
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 divide-y divide-border rounded-xl border border-border bg-card", children: [
        kind === "shop_entry" && rec.entry_type === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "POS Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.pos_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total Sale", highlight: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalSale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cash Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.cash_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bank Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.bank_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Credit Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.credit_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Plus / Minus", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(Number(rec.difference) < 0 ? "text-destructive" : "text-success"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.difference, size: "sm" }) }) })
        ] }),
        kind === "shop_entry" && rec.entry_type === "purchase" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Purchase Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.purchase_amount, size: "sm" }) }),
        kind === "shop_entry" && rec.entry_type === "withdraw" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Withdraw Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.withdraw_amount, size: "sm" }) }),
        kind === "shop_entry" && rec.entry_type === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Expense Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.expense_amount, size: "sm" }) }),
        kind === "transaction" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(rec.type === "cash_in" ? "text-success" : "text-destructive"), children: TXN_LABELS[rec.type] ?? rec.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Amount", highlight: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.amount, size: "sm" }) }),
          rec.category && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3 text-muted-foreground" }),
            rec.category
          ] }) }),
          rec.subcategory && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Sub-category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-muted-foreground" }),
            rec.subcategory
          ] }) }),
          rec.payment_method && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Payment", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3 text-muted-foreground" }),
            rec.payment_method
          ] }) }),
          rec.cashier && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cashier", children: rec.cashier }),
          rec.source && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Source", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "px-1.5 py-0 text-[10px]", children: rec.source }) })
        ] }),
        kind === "warehouse_entry" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Party", children: rec.party_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Type", children: rec.entry_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "px-1.5 py-0 text-[10px]", children: rec.payment_status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Amount", highlight: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.amount, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Paid", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.paid_amount, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Remaining Due", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: rec.remaining_due, size: "sm" }) }) })
        ] })
      ] }),
      rec.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }),
          " Notes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm", children: rec.notes })
      ] }),
      rec.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecAttachmentBlock,
        {
          url: rec.attachment_url,
          isImage: !!isImage,
          onOpenLightbox: (u) => setLightbox(u)
        }
      ),
      rec.ocr_scan_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "mt-3 w-full",
          onClick: () => {
            onOpenChange(false);
            navigate({ to: "/summary", search: { scan: rec.ocr_scan_id } });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "mr-1.5 h-3.5 w-3.5" }),
            " View OCR Details"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handlePDF, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "mr-1.5 h-3.5 w-3.5" }),
          " Export PDF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "border-success/40 text-success hover:bg-success/10",
            onClick: handleShare,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1.5 h-3.5 w-3.5" }),
              " WhatsApp"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: handleEdit, disabled: !rec, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Edit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", className: "flex-1", onClick: handleDelete, disabled: !rec || deleting, children: [
        deleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
        "Delete"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentLightbox, { open: !!lightbox, url: lightbox, onClose: () => setLightbox(null) })
  ] }) });
}
function Row({ label, children, highlight }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center justify-between px-4 py-2.5", highlight && "bg-primary/5"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-sm font-medium", children })
  ] });
}
function RecAttachmentBlock({
  url,
  isImage,
  onOpenLightbox
}) {
  const signed = useSignedAttachmentUrl(url);
  if (!signed) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
      " Attachment"
    ] }),
    isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onOpenLightbox(signed),
        className: "block w-full overflow-hidden rounded-xl border border-border transition-all hover:border-primary/40",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: signed, alt: "Attachment", className: "max-h-64 w-full object-contain bg-muted/30" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: signed, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "mr-1.5 h-3.5 w-3.5" }),
      " View Attachment"
    ] }) })
  ] });
}
function downloadCSV$1(filename, rows) {
  if (rows.length <= 1) return toast.error("No data to export");
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported");
}
function openPDF$1(title, meta, summary, table) {
  const w = window.open("", "_blank");
  if (!w) return;
  const kpis = summary.map(
    (s) => `<div class="kpi"><div class="kpi-l">${s.label}</div><div class="kpi-v">${SAR_WHOLE(s.value)}</div></div>`
  ).join("");
  const head = table.headers.map((h) => `<th>${h}</th>`).join("");
  const body = table.rows.map(
    (r) => `<tr>${r.map(
      (c, i) => `<td style="${i >= table.headers.length - 4 ? "text-align:right" : ""}">${typeof c === "number" ? SAR(c) : String(c ?? "").replace(/</g, "&lt;")}</td>`
    ).join("")}</tr>`
  ).join("") || `<tr><td colspan="${table.headers.length}" style="text-align:center;color:#888;padding:18px">No data</td></tr>`;
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
  <script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script>
  </body></html>`);
  w.document.close();
}
function shareWA(title, meta, summary) {
  const lines = [`*${title}*`, meta, "", ...summary.map((s) => `${s.label}: ${SAR_WHOLE(s.value)}`)];
  window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}
function ExportBar$1({ onCSV, onPDF, onShare }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: onCSV, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
      " Excel"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: onPDF, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
      " PDF"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-success text-success-foreground hover:bg-success/90", onClick: onShare, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
      " Share"
    ] })
  ] });
}
function KCard({ label, value, tone = "default" }) {
  const t = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : tone === "warning" ? "text-warning" : tone === "info" ? "text-primary" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-1.5", t), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "lg" }) })
  ] });
}
const SUBS = [
  { k: "customers", label: "Customer Sales", icon: Users },
  { k: "suppliers", label: "Supplier Purchase", icon: Truck },
  { k: "products", label: "Product Sales", icon: Package },
  { k: "stock", label: "Stock Value", icon: Boxes },
  { k: "profit", label: "Profit", icon: TrendingUp },
  { k: "payments", label: "Payments", icon: Wallet },
  { k: "dues", label: "Credit / Due", icon: CircleAlert },
  { k: "activity", label: "Activity", icon: Activity }
];
const PAGE = 20;
function useLoadMore(rows) {
  const [n, setN] = reactExports.useState(PAGE);
  const visible = rows.slice(0, n);
  const more = rows.length > n;
  return {
    visible,
    more,
    loadMore: () => setN((x) => x + PAGE),
    total: rows.length,
    shown: visible.length
  };
}
function WholeSaleReport({ from, to, snapshotKey = "" }) {
  const sk = snapshotKey;
  const [sub, setSub] = reactExports.useState("customers");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SUBS.map(({ k, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setSub(k),
        className: cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          sub === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
          " ",
          label
        ]
      },
      k
    )) }),
    sub === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerSales, { from, to, sk }),
    sub === "suppliers" && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplierPurchase, { from, to, sk }),
    sub === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSales, { from, to, sk }),
    sub === "stock" && /* @__PURE__ */ jsxRuntimeExports.jsx(StockValue, { sk }),
    sub === "profit" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitReport, { from, to, sk }),
    sub === "payments" && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentReport, { from, to, sk }),
    sub === "dues" && /* @__PURE__ */ jsxRuntimeExports.jsx(DueReport, { from, to, sk }),
    sub === "activity" && /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityReport, { from, to, sk })
  ] });
}
function CustomerSales({ from, to, sk }) {
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const { data, isLoading } = useQuery({
    queryKey: ["ws-cust-sales", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [c, s, p] = await Promise.all([
        supabase.from("pos_customers").select("id,name,phone,opening_due").eq("is_deleted", false),
        supabase.from("shop_sales").select("id,customer_id,customer_name,txn_date,total,paid_amount,due_amount,payment_method,status").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind,txn_date").gte("txn_date", from).lte("txn_date", to)
      ]);
      return { customers: c.data ?? [], sales: s.data ?? [], payments: p.data ?? [] };
    }
  });
  const rows = reactExports.useMemo(() => {
    if (!data) return [];
    const byId = /* @__PURE__ */ new Map();
    const ensure = (id, name, phone = "") => {
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
          lastDate: ""
        });
      }
      return byId.get(key);
    };
    for (const c of data.customers) ensure(c.id, c.name, c.phone ?? "").due += Number(c.opening_due ?? 0);
    for (const s of data.sales) {
      if (s.status === "cancelled") continue;
      const r = ensure(s.customer_id, s.customer_name);
      const total2 = Number(s.total ?? 0);
      const paid = Number(s.paid_amount ?? 0);
      const due = Number(s.due_amount ?? 0);
      r.totalSales += total2;
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
    if (filter === "high") arr = arr.filter((r) => r.due > 1e3);
    return arr.sort((a, b) => b.totalSales - a.totalSales);
  }, [data, search, filter]);
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = reactExports.useMemo(
    () => [
      { label: "Total Sales", value: rows.reduce((s, r) => s + r.totalSales, 0) },
      { label: "Total Paid", value: rows.reduce((s, r) => s + r.paid, 0) },
      { label: "Total Due", value: rows.reduce((s, r) => s + Math.max(0, r.due), 0) },
      { label: "Customers", value: rows.length }
    ],
    [rows]
  );
  const meta = `${from} → ${to}`;
  const headers = ["Customer", "Phone", "Invoices", "Total Sales", "Paid", "Due"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.invoices, r.totalSales, r.paid, Math.max(0, r.due)]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`customer-sales-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Customer Sales Report", meta, summary.slice(0, 3), { headers, rows: tableRows }),
        onShare: () => shareWA("Customer Sales", meta, summary.slice(0, 3))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Sales", value: summary[0].value, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Paid", value: summary[1].value, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Due", value: summary[2].value, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Customers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold", children: rows.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search customer / phone…", value: search, onChange: (e) => setSearch(e.target.value), className: "h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["all", "paid", "unpaid", "high"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilter(f),
          className: cn(
            "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
            filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
          ),
          children: f === "high" ? "High Due" : f
        },
        f
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [r.name, r.phone || "—", String(r.invoices), SAR(r.totalSales), SAR(r.paid), SAR(Math.max(0, r.due))]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function SupplierPurchase({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-supplier", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data: data2 } = await supabase.from("shop_purchases").select("id,supplier_name,supplier_mobile,txn_date,total,status").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false);
      return data2 ?? [];
    }
  });
  const rows = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
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
    { label: "Suppliers", value: rows.length }
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Supplier", "Phone", "Invoices", "Total Purchase", "Paid", "Payable"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.invoices, r.total, r.paid, r.payable]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`supplier-purchase-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Supplier Purchase Report", meta, summary.slice(0, 2), { headers, rows: tableRows }),
        onShare: () => shareWA("Supplier Purchase", meta, summary.slice(0, 2))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Purchase", value: summary[0].value, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Paid", value: summary[1].value, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Suppliers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold", children: rows.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [r.name, r.phone || "—", String(r.invoices), SAR(r.total), SAR(r.paid), SAR(r.payable)]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function ProductSales({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-product-sales", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [s, prod] = await Promise.all([
        supabase.from("shop_sales").select("items,status,txn_date").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false),
        supabase.from("shop_products").select("id,name,stock,purchase_price,price").eq("is_deleted", false)
      ]);
      return { sales: s.data ?? [], products: prod.data ?? [] };
    }
  });
  const rows = reactExports.useMemo(() => {
    if (!data) return [];
    const m = /* @__PURE__ */ new Map();
    for (const p of data.products) {
      m.set(p.id, {
        id: p.id,
        name: p.name,
        qty: 0,
        sale: 0,
        purchaseVal: 0,
        profit: 0,
        stock: Number(p.stock ?? 0),
        ppRef: Number(p.purchase_price ?? 0)
      });
    }
    for (const s of data.sales) {
      if (s.status === "cancelled") continue;
      const items = Array.isArray(s.items) ? s.items : [];
      for (const it of items) {
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
    { label: "Profit", value: rows.reduce((s, r) => s + r.profit, 0) }
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Product", "Qty Sold", "Sale Value", "Cost Value", "Profit", "Stock Left"];
  const tableRows = rows.map((r) => [r.name, r.qty, r.sale, r.purchaseVal, r.profit, r.stock]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`product-sales-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Product Sales Report", meta, summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Product Sales", meta, summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Sale Value", value: summary[0].value, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Cost Value", value: summary[1].value, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Profit", value: summary[2].value, tone: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [r.name, String(r.qty), SAR(r.sale), SAR(r.purchaseVal), SAR(r.profit), String(r.stock)]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function StockValue({ sk }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["ws-stock", sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data: data2 } = await supabase.from("shop_products").select("id,name,stock,min_stock,purchase_price,price").eq("is_deleted", false);
      return data2 ?? [];
    }
  });
  const rows = reactExports.useMemo(
    () => data.map((p) => ({
      name: p.name,
      stock: Number(p.stock ?? 0),
      min: Number(p.min_stock ?? 0),
      purchaseVal: Number(p.stock ?? 0) * Number(p.purchase_price ?? 0),
      saleVal: Number(p.stock ?? 0) * Number(p.price ?? 0)
    })).sort((a, b) => b.purchaseVal - a.purchaseVal),
    [data]
  );
  const lowStock = rows.filter((r) => r.stock > 0 && r.stock <= r.min).length;
  const outStock = rows.filter((r) => r.stock <= 0).length;
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Purchase Value", value: rows.reduce((s, r) => s + r.purchaseVal, 0) },
    { label: "Sale Value", value: rows.reduce((s, r) => s + r.saleVal, 0) },
    { label: "Est. Profit", value: rows.reduce((s, r) => s + (r.saleVal - r.purchaseVal), 0) }
  ];
  const headers = ["Product", "Stock", "Min", "Purchase Value", "Sale Value"];
  const tableRows = rows.map((r) => [r.name, r.stock, r.min, r.purchaseVal, r.saleVal]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`stock-value.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Stock Value Report", (/* @__PURE__ */ new Date()).toLocaleDateString(), summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Stock Value", (/* @__PURE__ */ new Date()).toLocaleDateString(), summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Purchase Value", value: summary[0].value, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Sale Value", value: summary[1].value, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Low Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold text-warning", children: lowStock })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Out of Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold text-destructive", children: outStock })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [
          r.name,
          r.stock <= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Out" }, "o") : r.stock <= r.min ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-warning text-warning-foreground", children: r.stock }, "l") : String(r.stock),
          String(r.min),
          SAR(r.purchaseVal),
          SAR(r.saleVal)
        ]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function ProfitReport({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-profit", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { data: data2 } = await supabase.from("shop_sales").select("items,status,txn_date").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false);
      return data2 ?? [];
    }
  });
  const { daily, products } = reactExports.useMemo(() => {
    const byDay = /* @__PURE__ */ new Map();
    const byProd = /* @__PURE__ */ new Map();
    for (const s of data ?? []) {
      if (s.status === "cancelled") continue;
      const d = byDay.get(s.txn_date) ?? { date: s.txn_date, sale: 0, cost: 0, profit: 0 };
      for (const it of s.items ?? []) {
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
      daily: [...byDay.values()].sort((a, b) => a.date < b.date ? 1 : -1),
      products: [...byProd.values()].sort((a, b) => b.profit - a.profit).slice(0, 50)
    };
  }, [data]);
  const totalProfit = daily.reduce((s, d) => s + d.profit, 0);
  const totalSale = daily.reduce((s, d) => s + d.sale, 0);
  const totalCost = daily.reduce((s, d) => s + d.cost, 0);
  const summary = [
    { label: "Total Sale", value: totalSale },
    { label: "Total Cost", value: totalCost },
    { label: "Total Profit", value: totalProfit }
  ];
  const { visible, more, loadMore, shown, total } = useLoadMore(daily);
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Sale", "Cost", "Profit"];
  const tableRows = daily.map((d) => [d.date, d.sale, d.cost, d.profit]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`profit-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Profit Report", meta, summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Profit", meta, summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Sale", value: totalSale, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Cost", value: totalCost, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Profit", value: totalProfit, tone: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((d) => [d.date, SAR(d.sale), SAR(d.cost), SAR(d.profit)]),
        more,
        loadMore,
        shown,
        total
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Top Profit Products" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border", children: [
        products.slice(0, 10).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between px-4 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
            p.name,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "×",
              p.qty
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tabular-nums text-success", children: SAR(p.profit) })
        ] }, i)),
        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-6 text-center text-sm text-muted-foreground", children: "No data" })
      ] })
    ] })
  ] });
}
function PaymentReport({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-payments", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [pay, sales] = await Promise.all([
        supabase.from("pos_payments").select("id,customer_id,amount,kind,method,txn_date,notes").gte("txn_date", from).lte("txn_date", to),
        supabase.from("shop_sales").select("id,customer_name,paid_amount,due_amount,txn_date,status").gte("txn_date", from).lte("txn_date", to).eq("is_deleted", false)
      ]);
      return { payments: pay.data ?? [], sales: sales.data ?? [] };
    }
  });
  const stats = reactExports.useMemo(() => {
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
  const rows = (data?.payments ?? []).slice().sort((a, b) => a.txn_date < b.txn_date ? 1 : -1);
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Payment In", value: stats.pIn },
    { label: "Payment Out", value: stats.pOut },
    { label: "New Dues", value: stats.dueAdded }
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Kind", "Method", "Amount", "Notes"];
  const tableRows = rows.map((p) => [p.txn_date, p.kind, p.method, Number(p.amount), p.notes ?? ""]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`payments-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Payment Report", meta, summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Payment Report", meta, summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Payment In", value: stats.pIn, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Payment Out", value: stats.pOut, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "New Dues", value: stats.dueAdded, tone: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((p) => [p.txn_date, p.kind, p.method, SAR(Number(p.amount)), p.notes ?? ""]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function DueReport({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-dues", sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [c, s, p] = await Promise.all([
        supabase.from("pos_customers").select("id,name,phone,opening_due").eq("is_deleted", false),
        supabase.from("shop_sales").select("customer_id,due_amount,txn_date,status").eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind")
      ]);
      return { customers: c.data ?? [], sales: s.data ?? [], payments: p.data ?? [] };
    }
  });
  const rows = reactExports.useMemo(() => {
    if (!data) return [];
    const m = /* @__PURE__ */ new Map();
    for (const c of data.customers) {
      m.set(c.id, { id: c.id, name: c.name, phone: c.phone ?? "", due: Number(c.opening_due ?? 0), oldest: "" });
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
      const days = r.oldest ? Math.floor((Date.now() - new Date(r.oldest).getTime()) / 864e5) : 0;
      const bucket = days <= 30 ? "0-30" : days <= 60 ? "31-60" : days <= 90 ? "61-90" : "90+";
      return { ...r, days, bucket };
    }).sort((a, b) => b.due - a.due);
  }, [data]);
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Total Due", value: rows.reduce((s, r) => s + r.due, 0) },
    { label: "Overdue 30d+", value: rows.filter((r) => r.days > 30).reduce((s, r) => s + r.due, 0) },
    { label: "Overdue 90d+", value: rows.filter((r) => r.days > 90).reduce((s, r) => s + r.due, 0) }
  ];
  const meta = `as of ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`;
  const headers = ["Customer", "Phone", "Due", "Oldest", "Days", "Aging"];
  const tableRows = rows.map((r) => [r.name, r.phone || "—", r.due, r.oldest || "—", r.days, r.bucket]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`dues.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Credit / Due Report", meta, summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Credit / Due", meta, summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Due", value: summary[0].value, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Overdue 30d+", value: summary[1].value, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Overdue 90d+", value: summary[2].value, tone: "danger" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [r.name, r.phone || "—", SAR(r.due), r.oldest || "—", String(r.days), r.bucket]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function ActivityReport({ from, to, sk }) {
  const { data, isLoading } = useQuery({
    queryKey: ["ws-activity", from, to, sk],
    enabled: !!sk,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [s, p, pay] = await Promise.all([
        supabase.from("shop_sales").select("id,invoice_number,customer_name,total,status,is_deleted,txn_date,edit_count,created_at").gte("txn_date", from).lte("txn_date", to),
        supabase.from("shop_purchases").select("id,invoice_number,supplier_name,total,status,is_deleted,txn_date,created_at").gte("txn_date", from).lte("txn_date", to),
        supabase.from("pos_payments").select("id,amount,kind,txn_date,created_at").gte("txn_date", from).lte("txn_date", to)
      ]);
      return { sales: s.data ?? [], purchases: p.data ?? [], payments: pay.data ?? [] };
    }
  });
  const rows = reactExports.useMemo(() => {
    const out = [];
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
    return out.sort((a, b) => a.date < b.date ? 1 : -1);
  }, [data]);
  const { visible, more, loadMore, shown, total } = useLoadMore(rows);
  const summary = [
    { label: "Sales Count", value: (data?.sales ?? []).filter((s) => !s.is_deleted).length },
    { label: "Purchases Count", value: (data?.purchases ?? []).filter((p) => !p.is_deleted).length },
    { label: "Deleted", value: (data?.sales ?? []).filter((s) => s.is_deleted).length + (data?.purchases ?? []).filter((p) => p.is_deleted).length }
  ];
  const meta = `${from} → ${to}`;
  const headers = ["Date", "Action", "Ref", "Detail", "Amount"];
  const tableRows = rows.map((r) => [r.date, r.kind, r.ref, r.detail, r.amount]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExportBar$1,
      {
        onCSV: () => downloadCSV$1(`activity-${from}-to-${to}.csv`, [headers, ...tableRows]),
        onPDF: () => openPDF$1("Activity Report", meta, summary, { headers, rows: tableRows }),
        onShare: () => shareWA("Activity", meta, summary)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Sales" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold", children: summary[0].value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Purchases" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold", children: summary[1].value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Deleted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-lg font-bold text-destructive", children: summary[2].value })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        loading: isLoading,
        headers,
        rows: visible.map((r) => [r.date, r.kind, r.ref, r.detail, SAR(r.amount)]),
        more,
        loadMore,
        shown,
        total
      }
    )
  ] });
}
function DataTable({
  loading,
  headers,
  rows,
  more,
  loadMore,
  shown,
  total
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground", children: headers.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: cn("px-3 py-2 text-left font-semibold", i >= headers.length - 4 && "text-right"), children: h }, i)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: headers.length, className: "p-6 text-center text-sm text-muted-foreground", children: "Loading…" }) }),
        !loading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: headers.length, className: "p-6 text-center text-sm text-muted-foreground", children: "No data" }) }),
        !loading && rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "hover:bg-accent/40", children: r.map((c, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-3 py-2 tabular-nums", j >= headers.length - 4 && "text-right"), children: c }, j)) }, i))
      ] })
    ] }) }),
    (more || total > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Showing ",
        shown,
        " of ",
        total
      ] }),
      more && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: loadMore, children: "Load more" })
    ] })
  ] });
}
function ReportsPage() {
  const qc = useQueryClient();
  const {
    workingDate
  } = useWorkingDate();
  const workingDateObj = reactExports.useMemo(() => {
    const [y, m, d] = workingDate.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [workingDate]);
  const [tab, setTab] = reactExports.useState("all");
  const [active, setActive] = reactExports.useState(null);
  const openRecord = (kind, id) => setActive({
    kind,
    id
  });
  const [from, setFrom] = reactExports.useState(format(new Date(workingDateObj.getTime() - 30 * 864e5), "yyyy-MM-dd"));
  const [to, setTo] = reactExports.useState(format(workingDateObj, "yyyy-MM-dd"));
  const [generated, setGenerated] = reactExports.useState(false);
  const [lastGenAt, setLastGenAt] = reactExports.useState(null);
  const [genSig, setGenSig] = reactExports.useState("");
  const [gTab, setGTab] = reactExports.useState("all");
  const [gFrom, setGFrom] = reactExports.useState("");
  const [gTo, setGTo] = reactExports.useState("");
  const currentSig = `${tab}|${from}|${to}`;
  const filtersChanged = generated && genSig !== currentSig;
  const REPORT_KEYS = ["txns", "shops", "cashiers", "parties", "wh_ledger", "shop_entries", "categories", "app_settings", "employees", "employee_entries", "ws-cust-sales", "ws-supplier", "ws-product-sales", "ws-stock", "ws-profit", "ws-payments", "ws-dues", "ws-activity"];
  function handleGenerate(force = false) {
    if (force) {
      for (const k of REPORT_KEYS) qc.invalidateQueries({
        queryKey: [k]
      });
    }
    setGenerated(true);
    setGenSig(currentSig);
    setGTab(tab);
    setGFrom(from);
    setGTo(to);
    setLastGenAt(/* @__PURE__ */ new Date());
  }
  const {
    data: txns = [],
    isFetching: f1
  } = useQuery({
    queryKey: ["txns"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("transactions").select("*").eq("is_deleted", false).order("txn_date", {
      ascending: false
    })).data ?? []
  });
  const {
    data: shops = [],
    isFetching: f2
  } = useQuery({
    queryKey: ["shops"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops(data ?? []);
    }
  });
  const {
    data: cashiers = [],
    isFetching: f3
  } = useQuery({
    queryKey: ["cashiers"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("cashiers").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: parties = [],
    isFetching: f4
  } = useQuery({
    queryKey: ["parties"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("parties").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const {
    data: wh = [],
    isFetching: f5
  } = useQuery({
    queryKey: ["wh_ledger"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("warehouse_ledger").select("*").eq("is_deleted", false).order("txn_date", {
      ascending: false
    })).data ?? []
  });
  const {
    data: shopEntries = [],
    isFetching: f6
  } = useQuery({
    queryKey: ["shop_entries"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false).order("txn_date", {
      ascending: false
    })).data ?? []
  });
  const {
    data: categories = []
  } = useQuery({
    queryKey: ["categories"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("categories").select("*").eq("is_deleted", false)).data ?? []
  });
  const {
    data: settings
  } = useQuery({
    queryKey: ["app_settings"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("app_settings").select("*").eq("id", 1).single()).data
  });
  const {
    data: employees = []
  } = useQuery({
    queryKey: ["employees"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("employees").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const {
    data: employeeEntries = []
  } = useQuery({
    queryKey: ["employee_entries"],
    enabled: generated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => (await supabase.from("employee_entries").select("*").eq("is_deleted", false).order("txn_date", {
      ascending: false
    })).data ?? []
  });
  const isGenerating = generated && (f1 || f2 || f3 || f4 || f5 || f6);
  const inRange = (d) => d >= gFrom && d <= gTo;
  const shopName = (id) => id ? shops.find((s) => s.id === id)?.name ?? "—" : "—";
  const cashierName = (id) => id ? cashiers.find((c) => c.id === id)?.name ?? "—" : "—";
  const partyName = (id) => id ? parties.find((p) => p.id === id)?.name ?? "—" : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 rounded-2xl border bg-muted/40 p-1.5", children: [{
      k: "all",
      label: "All",
      icon: LayoutDashboard
    }, {
      k: "shop",
      label: "Shop",
      icon: Store
    }, {
      k: "transaction",
      label: "Transaction",
      icon: ArrowLeftRight
    }, {
      k: "employee",
      label: "Employee",
      icon: Users
    }].map(({
      k,
      label,
      icon: Icon
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(k), className: cn("flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium transition-all", tab === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      label
    ] }, k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("warehouse"), className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors", tab === "warehouse" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { className: "h-3 w-3" }),
        " Warehouse Report"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("wholesale"), className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors", tab === "wholesale" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
        " WholeSale Report"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value), className: "h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex items-end gap-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "flex-1 sm:flex-none", onClick: () => {
          setFrom(format(new Date(workingDateObj.getTime() - 7 * 864e5), "yyyy-MM-dd"));
          setTo(format(workingDateObj, "yyyy-MM-dd"));
        }, children: "7d" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "flex-1 sm:flex-none", onClick: () => {
          setFrom(format(new Date(workingDateObj.getTime() - 30 * 864e5), "yyyy-MM-dd"));
          setTo(format(workingDateObj, "yyyy-MM-dd"));
        }, children: "30d" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-wrap items-center justify-between gap-2 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-[11px] text-muted-foreground", children: [
        !generated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pick a date range and tap Generate Report." }),
        generated && lastGenAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Last generated: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: format(lastGenAt, "MMM d, HH:mm") }),
          filtersChanged && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-warning", children: "· filters changed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        generated && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => handleGenerate(true), disabled: isGenerating, children: "Refresh Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => handleGenerate(false), disabled: isGenerating && !filtersChanged, children: generated ? filtersChanged ? "Generate" : "Re-generate" : "Generate Report" })
      ] })
    ] }),
    !generated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col items-center justify-center gap-2 p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No report generated yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "max-w-xs text-xs text-muted-foreground", children: [
        "Reports stay paused for speed. Choose your tab and date range, then tap ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Generate Report" }),
        "."
      ] })
    ] }) : isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "h-20 animate-pulse bg-muted/40" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "h-48 animate-pulse bg-muted/40" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      gTab === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(AllReport, { txns, wh, shopEntries, shops, parties, settings, from: gFrom, to: gTo, inRange, shopName, openRecord }),
      gTab === "shop" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShopReport, { shopEntries, shops, cashiers, from: gFrom, to: gTo, inRange, shopName, cashierName, openRecord }),
      gTab === "transaction" && /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionReport, { txns, shops, categories, from: gFrom, to: gTo, inRange, shopName, openRecord }),
      gTab === "warehouse" && /* @__PURE__ */ jsxRuntimeExports.jsx(WarehouseReport, { wh, parties, from: gFrom, to: gTo, inRange, partyName, openRecord }),
      gTab === "employee" && /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeReport, { employees, employeeEntries, shops, from: gFrom, to: gTo, setFrom, setTo, inRange, shopName }),
      gTab === "wholesale" && /* @__PURE__ */ jsxRuntimeExports.jsx(WholeSaleReport, { from: gFrom, to: gTo, snapshotKey: lastGenAt ? String(lastGenAt.getTime()) : "" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RecordDetailDialog, { open: !!active, onOpenChange: (v) => !v && setActive(null), recordId: active?.id ?? null, kind: active?.kind ?? null })
  ] });
}
function SummaryCard({
  label,
  value,
  tone = "default",
  infoKey
}) {
  const toneCls = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : tone === "info" ? "text-primary" : tone === "warning" ? "text-warning" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
      infoKey && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { metric: infoKey, size: "xs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5", toneCls), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md" }) })
  ] });
}
function CashPositionCard({
  value,
  info
}) {
  const positive = value >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: cn("relative w-full overflow-hidden px-4 py-3 transition-shadow", positive ? "border-2 border-success/40 bg-gradient-to-br from-success/15 via-success/5 to-card" : "border-2 border-destructive/40 bg-gradient-to-br from-destructive/15 via-destructive/5 to-card"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground", children: "Cash Position" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { info, size: "xs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]", positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: positive ? "Healthy Position" : "Negative Position" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("shrink-0", positive ? "text-success" : "text-destructive"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "xl" }) })
  ] }) });
}
function ExportBar({
  onCSV,
  onPDF,
  onShare
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: onCSV, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
      " Excel"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: onPDF, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
      " PDF"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "bg-success text-success-foreground hover:bg-success/90", onClick: onShare, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
      " Share"
    ] })
  ] });
}
function SubTabs({
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(o.k), className: cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", value === o.k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"), children: o.label }, o.k)) });
}
function downloadCSV(filename, rows) {
  if (rows.length <= 1) {
    toast.error("No data to export");
    return;
  }
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported");
}
function openStatementPDF(title, summaryRows, opts) {
  const w = window.open("", "_blank");
  if (!w) return;
  const normal = summaryRows.filter((s) => !s.highlight);
  const highlight = summaryRows.filter((s) => s.highlight);
  const lineHtml = normal.map((s) => `<div class="ln"><div class="lblwrap"><div class="lbl">${s.label}</div>${s.hint ? `<div class="hint">${s.hint}</div>` : ""}</div><span class="dots"></span><span class="amt">${SAR_WHOLE(s.value)}</span></div>`).join("");
  const hlHtml = highlight.map((s) => {
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
  }).join("");
  const now = /* @__PURE__ */ new Date();
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
    <script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script>
    </body></html>`);
  w.document.close();
}
function SummaryStatement({
  scopeLabel,
  rangeLabel,
  rows
}) {
  const normal = rows.filter((r) => !r.highlight);
  const highlight = rows.filter((r) => r.highlight);
  const now = /* @__PURE__ */ new Date();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card px-5 py-5 shadow-sm sm:px-8 sm:py-6 print:border-0 print:shadow-none print:px-2 print:py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b-2 border-foreground/80 pb-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-[24px] font-bold leading-tight tracking-tight", children: scopeLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[18px] font-semibold leading-tight text-foreground/80", children: "Financial Summary Report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] font-normal text-muted-foreground", children: rangeLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap justify-center gap-2 text-[10px] text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Generated:" }),
      " ",
      now.toLocaleString()
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 mb-1 border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Financial Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1", children: normal.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-0.5", style: {
      maxHeight: 28
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-nowrap text-[15px] font-semibold text-foreground", children: r.label }),
        r.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pl-2 text-[10px] font-normal text-[#666]", children: r.hint })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-[0_1_60%] border-b border-dotted border-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto whitespace-nowrap text-right text-[16px] font-bold tabular-nums text-foreground", children: SAR_WHOLE(r.value) })
    ] }, r.label)) }),
    highlight.map((h) => {
      const positive = h.value >= 0;
      const status = h.status ?? (positive ? "Healthy Position" : "Negative Position");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg border-2 px-4 py-3 text-center " + (positive ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" : "border-rose-600 bg-rose-50 dark:bg-rose-950/30"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground", children: h.label }),
        h.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] font-normal text-[#666]", children: h.hint }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] font-bold uppercase tracking-wider " + (positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"), children: status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-extrabold tabular-nums " + (positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"), children: SAR_WHOLE(h.value) })
      ] }, h.label);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 border-t border-border pt-2 text-center text-[9px] text-muted-foreground", children: "Generated By AhsAN Manager · ShRiAh Group" })
  ] });
}
function openPDF(title, meta, summaryRows, table, opts) {
  if (opts?.statement) {
    return openStatementPDF(title, summaryRows, {
      scopeLabel: opts.scopeLabel ?? "All Shops",
      rangeLabel: opts.rangeLabel ?? meta
    });
  }
  const scopeLabel = opts?.scopeLabel ?? "All Shops";
  const w = window.open("", "_blank");
  if (!w) return;
  const normalRows = summaryRows.filter((s) => !s.highlight);
  const highlightRows = summaryRows.filter((s) => s.highlight);
  const summary = normalRows.map((s) => `<div class="kpi"><div class="kpi-l">${s.label}</div><div class="kpi-v">${SAR_WHOLE(s.value)}</div></div>`).join("");
  const highlightHtml = highlightRows.map((s) => {
    const positive = s.value >= 0;
    const color = positive ? "#059669" : "#dc2626";
    const bg = positive ? "#ecfdf5" : "#fef2f2";
    const status = s.status ?? (positive ? "Healthy Position" : "Negative Position");
    return `<div class="hl" style="border-color:${color};background:${bg}">
        <div><div class="hl-l">${s.label}</div><div class="hl-s" style="color:${color}">${status}</div></div>
        <div class="hl-v" style="color:${color}">${SAR_WHOLE(s.value)}</div>
      </div>`;
  }).join("");
  let detailsHtml = "";
  if (table && table.rows.length > 0) {
    const head = table.headers.map((h) => `<th>${h}</th>`).join("");
    const body = table.rows.map((r) => `<tr>${r.map((c, i) => `<td style="${i >= table.headers.length - 4 ? "text-align:right" : ""}">${typeof c === "number" ? SAR(c) : String(c ?? "").replace(/</g, "&lt;")}</td>`).join("")}</tr>`).join("");
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
    <div class="footer">Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script>
    </body></html>`);
  w.document.close();
}
function shareWhatsApp(title, meta, summary) {
  const lines = [`*${title}*`, meta, ``, ...summary.map((s) => {
    if (s.highlight) {
      const status = s.status ?? (s.value >= 0 ? "Healthy Position" : "Negative Position");
      return `*${s.label}*: ${SAR_WHOLE(s.value)} (${status})`;
    }
    return `${s.label}: ${SAR_WHOLE(s.value)}`;
  })];
  window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}
function AllReport(props) {
  const {
    txns,
    wh,
    shopEntries,
    shops,
    parties,
    settings,
    from,
    to,
    inRange,
    shopName,
    openRecord
  } = props;
  const fTxns = txns.filter((t) => inRange(t.txn_date));
  const fWh = wh.filter((e) => inRange(e.txn_date));
  const fShop = shopEntries.filter((e) => inRange(e.txn_date));
  const sum = (arr, k) => arr.reduce((s, x) => s + Number(x[k] || 0), 0);
  const sumByType = (t) => txns.filter((x) => x.type === t).reduce((s, x) => s + Number(x.amount), 0);
  const totalOpening = shops.reduce((s, x) => s + Number(x.opening_cash || 0), 0);
  const cashIn = sumByType("cash_in");
  const cashOut = sumByType("cash_out");
  const bankWithdraw = sumByType("bank_withdraw");
  const purchases = sumByType("purchase");
  const expenses = sumByType("expense") + sumByType("supervisor_payment");
  const adjustments = sumByType("adjustment");
  const cashInHand = totalOpening + cashIn + bankWithdraw - cashOut - purchases - expenses + adjustments;
  const bankBalance = -bankWithdraw;
  const totalExpense = cashOut + purchases + expenses;
  const openingStock = Number(settings?.opening_stock_value ?? 0);
  const openingDue = Number(settings?.opening_due_receivable ?? 0);
  const partyOpeningDue = parties.reduce((s, p) => s + Number(p.opening_due || 0), 0);
  const partyOpeningAdvance = parties.reduce((s, p) => s + Number(p.opening_advance || 0), 0);
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
  const dueReceivable = Math.max(0, openingDue + partyOpeningDue + whDueDelta - partyOpeningAdvance);
  const warehouseValue = openingStock + dueReceivable + whPurchases - whSales;
  const netPosition = cashInHand + bankBalance + warehouseValue - totalExpense;
  const summary = [{
    label: "Cash In Hand",
    value: cashInHand
  }, {
    label: "Bank Balance",
    value: bankBalance
  }, {
    label: "Warehouse Value",
    value: warehouseValue
  }, {
    label: "Total Expense",
    value: totalExpense
  }, {
    label: "Due Receivable",
    value: dueReceivable
  }, {
    label: "Net Position",
    value: netPosition
  }];
  const recent = [...fTxns.map((t) => ({
    id: t.id,
    recordKind: "transaction",
    date: t.txn_date,
    kind: "Transaction",
    label: `${TXN_LABELS[t.type] ?? t.type} · ${shopName(t.shop_id)}`,
    amount: Number(t.amount),
    sign: t.type === "cash_in" ? 1 : -1
  })), ...fShop.map((e) => ({
    id: e.id,
    recordKind: "shop_entry",
    date: e.txn_date,
    kind: "Shop",
    label: `${e.entry_type} · ${shopName(e.shop_id)}`,
    amount: e.entry_type === "sale" ? Number(e.cash_sale || 0) + Number(e.bank_sale || 0) : Number(e.purchase_amount || 0) + Number(e.withdraw_amount || 0),
    sign: e.entry_type === "purchase" ? -1 : 1
  })), ...fWh.map((e) => ({
    id: e.id,
    recordKind: "warehouse_entry",
    date: e.txn_date,
    kind: "Warehouse",
    label: `${e.entry_type} · ${e.party_name}`,
    amount: Number(e.amount),
    sign: e.entry_type === "warehouse_purchase" || e.entry_type === "supplier_payment" ? -1 : 1
  }))].sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 25);
  const meta = `${from} → ${to}`;
  const exportCSV = () => {
    const rows = [["Metric", "Amount (SAR)"], ...summary.map((s) => [s.label, Math.round(s.value)])];
    rows.push([], ["Date", "Source", "Description", "Amount"]);
    recent.forEach((r) => rows.push([r.date, r.kind, r.label, (r.sign * r.amount).toFixed(2)]));
    downloadCSV(`master-summary-${from}-to-${to}.csv`, rows);
  };
  const exportPDF = () => openPDF("Master Summary Report", meta, summary, {
    headers: ["Date", "Source", "Description", "Amount"],
    rows: recent.map((r) => [r.date, r.kind, r.label, r.sign * r.amount])
  });
  const share = () => shareWhatsApp("Master Summary", meta, summary);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportBar, { onCSV: exportCSV, onPDF: exportPDF, onShare: share }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "cash_in_hand", label: "Cash In Hand", value: cashInHand, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "bank_balance", label: "Bank Balance", value: bankBalance, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "warehouse_value", label: "Warehouse Value", value: warehouseValue, tone: "default" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "total_expense", label: "Total Expense", value: totalExpense, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "due_receivable", label: "Due Receivable", value: dueReceivable, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "net_position", label: "Net Position", value: netPosition, tone: "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Recent activity" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border", children: [
        recent.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-6 text-center text-sm text-muted-foreground", children: "No activity in range." }),
        recent.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openRecord?.(r.recordKind, r.id), className: "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              r.date,
              " · ",
              r.kind
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("shrink-0 font-semibold tabular-nums", r.sign > 0 ? "text-success" : "text-destructive"), children: [
            r.sign > 0 ? "+" : "−",
            SAR(r.amount)
          ] })
        ] }) }, i))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(_unused, { v: sum(fWh, "amount") })
  ] });
}
function _unused(_) {
  return null;
}
function MultiSelectChips({
  label,
  options,
  selected,
  onChange,
  placeholder = "All"
}) {
  const [open, setOpen] = reactExports.useState(false);
  const selectedSet = new Set(selected);
  const toggle = (v) => {
    const next = new Set(selectedSet);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange([...next]);
  };
  const remove = (v) => onChange(selected.filter((s) => s !== v));
  const clear = () => onChange([]);
  const labelOf = (v) => options.find((o) => o.value === v)?.label ?? v;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpen((o) => !o), className: "mt-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2 text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("truncate", selected.length === 0 && "text-muted-foreground"), children: selected.length === 0 ? placeholder : selected.length === 1 ? labelOf(selected[0]) : `${selected.length} selected` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" })
    ] }),
    selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap gap-1", children: [
      selected.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary", children: [
        labelOf(v),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => remove(v), "aria-label": "Remove", className: "rounded-full p-0.5 hover:bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" }) })
      ] }, v)),
      selected.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: clear, className: "text-[11px] font-medium text-muted-foreground hover:text-foreground", children: "Clear" })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md", children: options.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-3 text-center text-xs text-muted-foreground", children: "No options" }) : options.map((o) => {
      const on = selectedSet.has(o.value);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(o.value), className: cn("flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent", on && "bg-accent/60"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: o.label }),
        on && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary" })
      ] }, o.value);
    }) }) })
  ] });
}
const inFilter = (arr, v) => arr.length === 0 || v != null && arr.includes(v);
const SHOP_TXN_OPTIONS = [{
  value: "all",
  label: "All Transactions"
}, {
  value: "sale",
  label: "Sale"
}, {
  value: "purchase",
  label: "Purchase"
}, {
  value: "expense",
  label: "Expense"
}, {
  value: "withdraw",
  label: "Withdraw"
}];
const SHOP_TXN_BADGE = {
  sale: {
    label: "Sale",
    cls: "bg-success/15 text-success border-success/30"
  },
  purchase: {
    label: "Purchase",
    cls: "bg-warning/15 text-warning border-warning/30"
  },
  expense: {
    label: "Expense",
    cls: "bg-destructive/15 text-destructive border-destructive/30"
  },
  withdraw: {
    label: "Withdraw",
    cls: "bg-primary/15 text-primary border-primary/30"
  }
};
function entryAmount(e) {
  switch (e.entry_type) {
    case "sale": {
      const t = e.total_sale != null ? Number(e.total_sale) : Number(e.cash_sale || 0) + Number(e.bank_sale || 0) + Number(e.credit_sale || 0);
      return t;
    }
    case "purchase":
      return Number(e.purchase_amount || 0);
    case "expense":
      return Number(e.expense_amount || 0);
    case "withdraw":
      return Number(e.withdraw_amount || 0);
    default:
      return 0;
  }
}
function ExportModeDialog({
  open,
  defaultMode,
  onCancel,
  onConfirm
}) {
  const [mode, setMode] = reactExports.useState(defaultMode);
  reactExports.useMemo(() => {
    if (open) setMode(defaultMode);
    return null;
  }, [open, defaultMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Choose report type" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [{
      k: "summary",
      label: "Summary Report",
      desc: "Totals & cards only — A4 friendly"
    }, {
      k: "detailed",
      label: "Detailed Report",
      desc: "Includes every transaction"
    }].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMode(o.k), className: cn("w-full rounded-md border px-3 py-2 text-left transition-colors", mode === o.k ? "border-primary bg-primary/5" : "border-border hover:bg-accent/40"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: o.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: o.desc })
    ] }, o.k)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => onConfirm(mode), children: "Export" })
    ] })
  ] }) });
}
function ShopReport(props) {
  const {
    shopEntries,
    shops,
    cashiers,
    from,
    to,
    inRange,
    shopName,
    cashierName,
    openRecord
  } = props;
  const [txnType, setTxnType] = reactExports.useState("sale");
  const [mode, setMode] = reactExports.useState("shop");
  const [reportMode, setReportMode] = reactExports.useState("detailed");
  const [shopIds, setShopIds] = reactExports.useState([]);
  const [cashierIds, setCashierIds] = reactExports.useState([]);
  const [sortOrder, setSortOrder] = reactExports.useState("asc");
  const [drill, setDrill] = reactExports.useState(null);
  const cashierOrderKey = (cashierId) => cashierId ? (cashierName(cashierId) || "~").toLowerCase() : "~~unassigned";
  const sortRowsByDateAndCashier = (arr) => {
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
  const shopId = shopIds.length === 1 ? shopIds[0] : "";
  const selectedShop = reactExports.useMemo(() => shopId ? shops.find((s) => s.id === shopId) ?? null : null, [shopId, shops]);
  const isSimpleSelected = selectedShop?.shop_type === "simple_cash";
  const erpShopIds = reactExports.useMemo(() => new Set(shops.filter((s) => s.shop_type !== "simple_cash").map((s) => s.id)), [shops]);
  const scopeTitle = reactExports.useMemo(() => {
    const sourceIds = shopIds.length > 0 ? shopIds : shops.filter((s) => s.shop_type !== "simple_cash").map((s) => s.id);
    const names = sourceIds.map((id) => shops.find((s) => s.id === id)?.name).filter(Boolean);
    if (names.length === 0) return "All Shops";
    return [...names].sort((a, b) => {
      const ra = shopRank(a);
      const rb = shopRank(b);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    }).join(" + ");
  }, [shopIds, shops]);
  const simpleShops = reactExports.useMemo(() => shops.filter((s) => s.shop_type === "simple_cash"), [shops]);
  const shopSummary = reactExports.useMemo(() => {
    if (!shopId) return null;
    const es = shopEntries.filter((e) => e.shop_id === shopId && inRange(e.txn_date) && inFilter(cashierIds, e.cashier_id));
    const sales = es.filter((e) => e.entry_type === "sale");
    const cash = sales.reduce((a, e) => a + Number(e.cash_sale || 0), 0);
    const bank = sales.reduce((a, e) => a + Number(e.bank_sale || 0), 0);
    const pos = sales.reduce((a, e) => a + Number(e.pos_sale || 0), 0);
    const credit = sales.reduce((a, e) => a + Number(e.credit_sale || 0), 0);
    const dueRecv = sales.reduce((a, e) => a + Number(e.due_receivable || 0), 0);
    const diff = sales.reduce((a, e) => a + Number(e.difference || 0), 0);
    const total = cash + bank + credit;
    const withdraw = es.filter((e) => e.entry_type === "withdraw").reduce((a, e) => a + Number(e.withdraw_amount || 0), 0);
    const purchase = es.filter((e) => e.entry_type === "purchase").reduce((a, e) => a + Number(e.purchase_amount || 0), 0);
    const expense = es.filter((e) => e.entry_type === "expense").reduce((a, e) => a + Number(e.expense_amount || 0), 0);
    return {
      cash,
      bank,
      pos,
      credit,
      dueRecv,
      total,
      diff,
      withdraw,
      purchase,
      expense
    };
  }, [shopId, cashierIds, shopEntries, inRange]);
  const rows = reactExports.useMemo(() => shopEntries.filter((e) => inRange(e.txn_date)).filter((e) => txnType === "all" ? true : e.entry_type === txnType).filter((e) => shopIds.length > 0 ? shopIds.includes(e.shop_id) : erpShopIds.has(e.shop_id)).filter((e) => inFilter(cashierIds, e.cashier_id)), [shopEntries, inRange, shopIds, cashierIds, erpShopIds, txnType]);
  const sortedRows = reactExports.useMemo(() => sortRowsByDateAndCashier(rows), [rows, sortOrder, cashierName]);
  const simpleSummary = reactExports.useMemo(() => {
    return simpleShops.map((s) => {
      const es = shopEntries.filter((e) => e.shop_id === s.id && inRange(e.txn_date));
      const cashIn = es.filter((e) => e.entry_type === "sale").reduce((a, e) => a + Number(e.cash_sale || 0), 0);
      const expense = es.filter((e) => e.entry_type === "expense").reduce((a, e) => a + Number(e.expense_amount || 0), 0);
      return {
        id: s.id,
        name: s.name,
        cashIn,
        expense,
        balance: cashIn - expense
      };
    });
  }, [simpleShops, shopEntries, inRange]);
  const totals = reactExports.useMemo(() => {
    const acc = {
      cash: 0,
      bank: 0,
      pos: 0,
      credit: 0,
      dueRecv: 0,
      diff: 0,
      total: 0
    };
    rows.forEach((r) => {
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
  const aggregateExtras = reactExports.useMemo(() => {
    const es = shopEntries.filter((e) => inRange(e.txn_date) && erpShopIds.has(e.shop_id) && inFilter(cashierIds, e.cashier_id));
    const withdraw = es.filter((e) => e.entry_type === "withdraw").reduce((a, e) => a + Number(e.withdraw_amount || 0), 0);
    const purchase = es.filter((e) => e.entry_type === "purchase").reduce((a, e) => a + Number(e.purchase_amount || 0), 0);
    const expense = es.filter((e) => e.entry_type === "expense").reduce((a, e) => a + Number(e.expense_amount || 0), 0);
    return {
      withdraw,
      purchase,
      expense
    };
  }, [shopEntries, inRange, erpShopIds, cashierIds]);
  const {
    byId: masterPositions,
    total: masterPositionsTotal
  } = useShopPositions({
    from,
    to
  });
  const erpMasterTotal = reactExports.useMemo(() => {
    let s = 0;
    for (const id of erpShopIds) s += masterPositions.get(id) ?? 0;
    return s;
  }, [masterPositions, erpShopIds]);
  const cashPositionPerShop = selectedShop ? masterPositions.get(selectedShop.id) ?? 0 : 0;
  const cashPositionAggregate = selectedShop ? cashPositionPerShop : erpMasterTotal;
  const cashPositionInfo = (totalCash, totalCost, position) => ({
    title: "Cash Position",
    what: "Net cash held by the shop(s) — single source from Shop Page Cash Position card. Period filter does not affect this value.",
    formula: "(Cash Sale + Bank Withdraw) − (Purchase + Expense), all-time",
    inputs: [`Period Total Cash = SAR ${totalCash.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`, `Period Total Cost = SAR ${totalCost.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`, `Master Cash Position = SAR ${position.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`]
  });
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    rows.forEach((r) => {
      const key = mode === "shop" ? r.shop_id : r.cashier_id || "unassigned";
      const label = mode === "shop" ? shopName(r.shop_id) : r.cashier_id ? cashierName(r.cashier_id) : "Unassigned";
      const cur = map.get(key) ?? {
        label,
        cash: 0,
        bank: 0,
        pos: 0,
        credit: 0,
        diff: 0,
        total: 0,
        count: 0
      };
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
  const summary = shopSummary ? isSimpleSelected ? [{
    label: "Cash In",
    value: shopSummary.cash
  }, {
    label: "Expense",
    value: shopSummary.expense
  }, {
    label: "Balance",
    value: shopSummary.cash - shopSummary.expense
  }] : [{
    label: "Cash Sale",
    value: shopSummary.cash
  }, {
    label: "Bank Sale",
    value: shopSummary.bank
  }, {
    label: "Credit Sale",
    value: shopSummary.credit
  }, {
    label: "Due Receivable",
    value: shopSummary.dueRecv,
    hint: "Received from previous due / baki"
  }, {
    label: "Total Credit Due",
    value: shopSummary.credit - shopSummary.dueRecv,
    hint: "(Credit Sale − Due Receivable)"
  }, {
    label: "POS Sale",
    value: shopSummary.pos
  }, {
    label: "Total Sale",
    value: shopSummary.total
  }, {
    label: "Plus / Minus",
    value: shopSummary.diff
  }, {
    label: "Purchase",
    value: shopSummary.purchase
  }, {
    label: "Expense",
    value: shopSummary.expense
  }, {
    label: "Withdraw",
    value: shopSummary.withdraw
  }, {
    label: "Expected Balance",
    value: expectedBankPerShop,
    hint: "(Bank Sale - Withdraw)"
  }, {
    label: "Cash Position",
    value: cashPositionPerShop,
    highlight: true,
    hint: "(Total Cash Sale + Withdraw - Purchase - Expense)"
  }] : txnType === "sale" ? [{
    label: "Cash Sale",
    value: totals.cash
  }, {
    label: "Bank Sale",
    value: totals.bank
  }, {
    label: "Credit Sale",
    value: totals.credit
  }, {
    label: "Due Receivable",
    value: totals.dueRecv,
    hint: "Received from previous due / baki"
  }, {
    label: "Total Credit Due",
    value: totals.credit - totals.dueRecv,
    hint: "(Credit Sale − Due Receivable)"
  }, {
    label: "POS Sale",
    value: totals.pos
  }, {
    label: "Total Sale",
    value: totals.total
  }, {
    label: "Plus / Minus",
    value: totals.diff
  }, {
    label: "Purchase",
    value: aggregateExtras.purchase
  }, {
    label: "Expense",
    value: aggregateExtras.expense
  }, {
    label: "Withdraw",
    value: aggregateExtras.withdraw
  }, {
    label: "Expected Balance",
    value: expectedBankAggregate,
    hint: "(Bank Sale - Withdraw)"
  }, {
    label: "Cash Position",
    value: cashPositionAggregate,
    highlight: true,
    hint: "(Total Cash Sale + Withdraw - Purchase - Expense)"
  }] : (() => {
    const buckets = {
      sale: 0,
      purchase: 0,
      expense: 0,
      withdraw: 0
    };
    for (const r of rows) buckets[r.entry_type] = (buckets[r.entry_type] ?? 0) + entryAmount(r);
    const net = buckets.sale - buckets.purchase - buckets.expense - buckets.withdraw;
    const arr = [];
    if (txnType === "all") arr.push({
      label: "Total Sales",
      value: buckets.sale
    });
    if (txnType === "all" || txnType === "purchase") arr.push({
      label: "Total Purchases",
      value: buckets.purchase
    });
    if (txnType === "all" || txnType === "expense") arr.push({
      label: "Total Expenses",
      value: buckets.expense
    });
    if (txnType === "all" || txnType === "withdraw") arr.push({
      label: "Total Withdraws",
      value: buckets.withdraw
    });
    if (txnType === "all") arr.push({
      label: "Net Position",
      value: net
    });
    return arr;
  })();
  const meta = `${from} → ${to} · ${rows.length} entries · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
  const rowTotal = (r) => r.total_sale != null ? Number(r.total_sale) : Number(r.cash_sale || 0) + Number(r.bank_sale || 0) + Number(r.credit_sale || 0);
  const exportCSV = (mode2 = reportMode) => {
    const summaryBlock = [["Summary", ""], ...summary.map((s) => [s.label + (s.highlight ? ` (${s.status ?? (s.value >= 0 ? "Healthy Position" : "Negative Position")})` : ""), s.value.toFixed(2)]), ["", ""]];
    let csv;
    if (mode2 === "summary") {
      csv = summaryBlock;
    } else if (txnType === "sale") {
      csv = [...summaryBlock, ["Date", "Cashier", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale", "Total Sale", "Plus/Minus"], ...sortedRows.map((r) => [r.txn_date, r.cashier_id ? cashierName(r.cashier_id) : "—", Number(r.pos_sale || 0).toFixed(2), Number(r.cash_sale || 0).toFixed(2), Number(r.bank_sale || 0).toFixed(2), Number(r.credit_sale || 0).toFixed(2), rowTotal(r).toFixed(2), Number(r.difference || 0).toFixed(2)])];
    } else {
      csv = [...summaryBlock, ["Date", "Shop", "Cashier", "Type", "Amount", "Notes"], ...sortedRows.map((r) => [r.txn_date, shopName(r.shop_id), r.cashier_id ? cashierName(r.cashier_id) : "—", r.entry_type, entryAmount(r).toFixed(2), r.notes ?? ""])];
    }
    downloadCSV(`shop-report-${mode2}-${txnType}-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = (mode2 = reportMode) => {
    if (mode2 === "summary") {
      const title = txnType === "sale" ? "Shop Sales Summary" : txnType === "all" ? "Shop Report Summary · All" : `Shop Summary · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
      openPDF(title, meta, summary, void 0, {
        statement: true,
        scopeLabel: scopeTitle,
        rangeLabel: `${from} → ${to}`
      });
      return;
    }
    if (txnType === "sale") {
      openPDF("Shop Sales Report", meta, summary, {
        headers: ["Date", "Cashier", "POS", "Cash", "Bank", "Credit", "Total", "+/−"],
        rows: sortedRows.map((r) => [r.txn_date, r.cashier_id ? cashierName(r.cashier_id) : "—", Number(r.pos_sale || 0), Number(r.cash_sale || 0), Number(r.bank_sale || 0), Number(r.credit_sale || 0), rowTotal(r), Number(r.difference || 0)])
      }, {
        scopeLabel: scopeTitle
      });
    } else {
      const title = txnType === "all" ? "Shop Report · All Transactions" : `Shop Report · ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
      openPDF(title, meta, summary, {
        headers: ["Date", "Shop", "Cashier", "Type", "Notes", "Amount"],
        rows: sortedRows.map((r) => [r.txn_date, shopName(r.shop_id), r.cashier_id ? cashierName(r.cashier_id) : "—", r.entry_type, r.notes ?? "—", entryAmount(r)])
      }, {
        scopeLabel: scopeTitle
      });
    }
  };
  const share = (_mode = reportMode) => {
    const baseTitle = txnType === "sale" ? "Shop Sales" : txnType === "all" ? "Shop Report · All" : `Shop ${SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label}`;
    const title = _mode === "summary" ? `${baseTitle} · Summary` : baseTitle;
    shareWhatsApp(title, meta, summary);
  };
  const [pendingExport, setPendingExport] = reactExports.useState(null);
  const runExport = (kind, mode2) => {
    setPendingExport(null);
    if (kind === "csv") exportCSV(mode2);
    else if (kind === "pdf") exportPDF(mode2);
    else share(mode2);
  };
  const openDrill = (kind) => {
    if (!selectedShop) return;
    setDrill({
      shop: {
        id: selectedShop.id,
        name: selectedShop.name
      },
      kind
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    !isSimpleSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(SubTabs, { value: mode, onChange: setMode, options: [{
      k: "shop",
      label: "Shop Wise"
    }, {
      k: "cashier",
      label: "Cashier Wise"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Transaction Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: txnType, onChange: (e) => setTxnType(e.target.value), className: "h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring", children: SHOP_TXN_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Shop", placeholder: "All shops", options: shops.map((s) => ({
        value: s.id,
        label: `${s.name}${s.shop_type === "simple_cash" ? " · Simple" : ""}`
      })), selected: shopIds, onChange: setShopIds }),
      !isSimpleSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Cashier", placeholder: "All cashiers", options: cashiers.filter((c) => shopIds.length > 0 ? shopIds.includes(c.shop_id) : true).map((c) => ({
        value: c.id,
        label: c.name
      })), selected: cashierIds, onChange: setCashierIds }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Sort Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sortOrder, onChange: (e) => setSortOrder(e.target.value), className: "h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "asc", children: "Oldest First (Ascending Date)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "desc", children: "Newest First (Descending Date)" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubTabs, { value: reportMode, onChange: setReportMode, options: [{
        k: "summary",
        label: "Summary Report"
      }, {
        k: "detailed",
        label: "Detailed Report"
      }] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportBar, { onCSV: () => setPendingExport("csv"), onPDF: () => setPendingExport("pdf"), onShare: () => setPendingExport("share") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportModeDialog, { open: !!pendingExport, defaultMode: reportMode, onCancel: () => setPendingExport(null), onConfirm: (m) => pendingExport && runExport(pendingExport, m) }),
    reportMode === "summary" && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryStatement, { scopeLabel: scopeTitle, rangeLabel: `${from} → ${to}`, rows: summary }),
    reportMode === "detailed" && shopSummary && selectedShop && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isSimpleSelected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Cash In", value: shopSummary.cash, tone: "success", onClick: () => openDrill("cash_in") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Expense", value: shopSummary.expense, tone: "danger", onClick: () => openDrill("expense") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Balance", value: shopSummary.cash - shopSummary.expense, tone: shopSummary.cash - shopSummary.expense < 0 ? "danger" : "success" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Cash Sale", value: shopSummary.cash, tone: "success", onClick: () => openDrill("cash_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Bank Sale", value: shopSummary.bank, tone: "info", onClick: () => openDrill("bank_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "POS Sale", value: shopSummary.pos, onClick: () => openDrill("pos_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Credit Sale", value: shopSummary.credit, tone: "warning", onClick: () => openDrill("credit_sale") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "total_sale", label: "Total Sale", value: shopSummary.total, tone: "success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "plus_minus", label: "Plus / Minus", value: shopSummary.diff, tone: shopSummary.diff < 0 ? "danger" : "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Purchase", value: shopSummary.purchase, tone: "warning", onClick: () => openDrill("purchase") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Expense", value: shopSummary.expense, tone: "danger", onClick: () => openDrill("expense") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClickableSummary, { label: "Withdraw", value: shopSummary.withdraw, tone: "info", onClick: () => openDrill("bank_withdraw") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Expected Bank", value: expectedBankPerShop, tone: expectedBankPerShop < 0 ? "danger" : "info" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CashPositionCard, { value: cashPositionPerShop, info: cashPositionInfo(shopSummary.cash + shopSummary.withdraw, shopSummary.purchase + shopSummary.expense, cashPositionPerShop) })
    ] }) }),
    reportMode === "detailed" && !shopSummary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "cash_sale", label: "Cash Sale", value: totals.cash, tone: "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "bank_sale", label: "Bank Sale", value: totals.bank, tone: "info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "pos_sale", label: "POS Sale", value: totals.pos }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "credit_sale", label: "Credit Sale", value: totals.credit, tone: "warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "total_sale", label: "Total Sale", value: totals.total, tone: "success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { infoKey: "plus_minus", label: "Plus / Minus", value: totals.diff, tone: totals.diff < 0 ? "danger" : "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Purchase", value: aggregateExtras.purchase, tone: "warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Expense", value: aggregateExtras.expense, tone: "danger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Withdraw", value: aggregateExtras.withdraw, tone: "info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Expected Bank", value: expectedBankAggregate, tone: expectedBankAggregate < 0 ? "danger" : "info" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CashPositionCard, { value: cashPositionAggregate, info: cashPositionInfo(totals.cash + aggregateExtras.withdraw, aggregateExtras.purchase + aggregateExtras.expense, cashPositionAggregate) })
    ] }),
    !shopId && simpleSummary.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Simple Shops" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Cash In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Expense" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Balance" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: simpleSummary.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "cursor-pointer transition-colors hover:bg-accent/40", onClick: () => setShopIds([s.id]), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-medium", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-success", children: SAR(s.cashIn) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-destructive", children: SAR(s.expense) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-3 py-2.5 text-right font-semibold tabular-nums", s.balance < 0 ? "text-destructive" : "text-success"), children: SAR(s.balance) })
        ] }, s.id)) })
      ] }) })
    ] }),
    !isSimpleSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      txnType === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: mode === "shop" ? "By Shop" : "By Cashier" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: mode === "shop" ? "Shop" : "Cashier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "POS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Cash" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Bank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Credit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "+/−" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
            grouped.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-6 text-center text-muted-foreground", children: "No data in range." }) }),
            grouped.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-medium", children: g.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums", children: SAR(g.pos) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-semibold tabular-nums", children: SAR(g.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-success", children: SAR(g.cash) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-primary", children: SAR(g.bank) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums", children: SAR(g.credit) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-3 py-2.5 text-right font-semibold tabular-nums", g.diff < 0 ? "text-destructive" : g.diff > 0 ? "text-success" : ""), children: SAR(g.diff) })
            ] }, g.label))
          ] })
        ] }) })
      ] }),
      reportMode === "detailed" && (txnType === "sale" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Entries" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Cashier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "POS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Cash" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Bank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Credit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "+/−" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
            rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "p-6 text-center text-muted-foreground", children: "No entries." }) }),
            sortedRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => openRecord?.("shop_entry", r.id), className: "cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: r.txn_date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.cashier_id ? cashierName(r.cashier_id) : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: SAR(r.pos_sale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-success", children: SAR(r.cash_sale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-primary", children: SAR(r.bank_sale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: SAR(r.credit_sale) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold tabular-nums", children: SAR(rowTotal(r)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn("px-3 py-2 text-right font-semibold tabular-nums", Number(r.difference) < 0 ? "text-destructive" : Number(r.difference) > 0 ? "text-success" : ""), children: SAR(r.difference) })
            ] }, r.id))
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b bg-muted/30 px-4 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            "Entries · ",
            SHOP_TXN_OPTIONS.find((o) => o.value === txnType)?.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Total:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: SAR(rows.reduce((s, r) => s + entryAmount(r), 0)) }),
            " · ",
            rows.length,
            " entries"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Shop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Cashier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
            rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center text-muted-foreground", children: "No entries." }) }),
            sortedRows.map((r) => {
              const badge = SHOP_TXN_BADGE[r.entry_type] ?? {
                label: r.entry_type,
                cls: ""
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => openRecord?.("shop_entry", r.id), className: "cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: r.txn_date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: shopName(r.shop_id) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.cashier_id ? cashierName(r.cashier_id) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badge.cls), children: badge.label }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[260px] truncate", children: r.notes ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold tabular-nums", children: SAR(entryAmount(r)) })
              ] }, r.id);
            })
          ] })
        ] }) })
      ] }))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopDrilldownSheet, { open: !!drill, onOpenChange: (v) => !v && setDrill(null), shop: drill?.shop ?? null, kind: drill?.kind ?? null, initialFrom: from, initialTo: to })
  ] });
}
function ClickableSummary({
  label,
  value,
  tone = "default",
  onClick
}) {
  const toneCls = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : tone === "info" ? "text-primary" : tone === "warning" ? "text-warning" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: "group rounded-2xl border border-border/60 bg-card px-3 py-2 text-left shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:scale-[0.99]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5", toneCls), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md" }) })
  ] });
}
function TransactionReport(props) {
  const {
    txns,
    shops,
    categories,
    from,
    to,
    inRange,
    shopName,
    openRecord
  } = props;
  const [mode, setMode] = reactExports.useState("category");
  const [categoriesSel, setCategoriesSel] = reactExports.useState([]);
  const [subcategory, setSubcategory] = reactExports.useState("");
  const [shopIds, setShopIds] = reactExports.useState([]);
  const [sources, setSources] = reactExports.useState([]);
  const [types, setTypes] = reactExports.useState([]);
  const filtered = reactExports.useMemo(() => txns.filter((t) => inRange(t.txn_date)).filter((t) => inFilter(categoriesSel, t.category)).filter((t) => subcategory ? t.subcategory === subcategory : true).filter((t) => inFilter(shopIds, t.shop_id)).filter((t) => sources.length === 0 ? true : sources.some((s) => s === "manual" ? !t.source : t.source === s)).filter((t) => inFilter(types, t.type)), [txns, inRange, categoriesSel, subcategory, shopIds, sources, types]);
  const totals = reactExports.useMemo(() => {
    let cashIn = 0, cashOut = 0;
    filtered.forEach((t) => {
      if (t.type === "cash_in") cashIn += Number(t.amount);
      else cashOut += Number(t.amount);
    });
    return {
      cashIn,
      cashOut,
      net: cashIn - cashOut
    };
  }, [filtered]);
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    filtered.forEach((t) => {
      const key = mode === "category" ? t.category || "Uncategorized" : t.shop_id || "no-shop";
      const label = mode === "category" ? t.category || "Uncategorized" : shopName(t.shop_id);
      const cur = map.get(key) ?? {
        label,
        in: 0,
        out: 0,
        count: 0
      };
      if (t.type === "cash_in") cur.in += Number(t.amount);
      else cur.out += Number(t.amount);
      cur.count += 1;
      map.set(key, cur);
    });
    return [...map.values()].sort((a, b) => b.in + b.out - a.in - a.out);
  }, [filtered, mode, shopName]);
  const summary = [{
    label: "Total Cash In",
    value: totals.cashIn
  }, {
    label: "Total Cash Out",
    value: totals.cashOut
  }, {
    label: "Net Balance",
    value: totals.net
  }];
  const meta = `${from} → ${to} · ${filtered.length} txns`;
  const exportCSV = () => {
    const csv = [["Date", "Type", "Category", "Sub-category", "Shop", "Source", "Amount", "Notes"], ...filtered.map((t) => [t.txn_date, TXN_LABELS[t.type] ?? t.type, t.category ?? "", t.subcategory ?? "", shopName(t.shop_id), t.source ?? "manual", Number(t.amount).toFixed(2), (t.notes ?? "").replace(/[\r\n,]/g, " ")])];
    downloadCSV(`transactions-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = () => openPDF("Transactions Report", meta, summary, {
    headers: ["Date", "Type", "Category", "Shop", "Source", "Amount"],
    rows: filtered.map((t) => [t.txn_date, TXN_LABELS[t.type] ?? t.type, t.category ?? "—", shopName(t.shop_id), t.source ?? "manual", Number(t.amount)])
  });
  const share = () => shareWhatsApp("Transactions", meta, summary);
  const inCats = categories.filter((c) => c.txn_type === "cash_in").map((c) => c.name);
  const outCats = categories.filter((c) => c.txn_type === "cash_out").map((c) => c.name);
  const allCats = Array.from(/* @__PURE__ */ new Set([...inCats, ...outCats]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubTabs, { value: mode, onChange: setMode, options: [{
      k: "category",
      label: "Category Wise"
    }, {
      k: "shop",
      label: "Shop Wise"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Category", options: allCats.map((c) => ({
        value: c,
        label: c
      })), selected: categoriesSel, onChange: setCategoriesSel }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Sub-category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: subcategory, onChange: (e) => setSubcategory(e.target.value), placeholder: "Any", className: "mt-1 h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Shop", placeholder: "All shops", options: shops.map((s) => ({
        value: s.id,
        label: s.name
      })), selected: shopIds, onChange: setShopIds }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Type", options: [{
        value: "cash_in",
        label: "Cash In"
      }, {
        value: "cash_out",
        label: "Cash Out"
      }], selected: types, onChange: setTypes }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Source", options: [{
        value: "manual",
        label: "Manual"
      }, {
        value: "warehouse",
        label: "Warehouse"
      }, {
        value: "shop",
        label: "Shop"
      }], selected: sources, onChange: setSources })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportBar, { onCSV: exportCSV, onPDF: exportPDF, onShare: share }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Cash In", value: totals.cashIn, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Cash Out", value: totals.cashOut, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Net", value: totals.net, tone: totals.net < 0 ? "danger" : "success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: mode === "category" ? "By Category" : "By Shop" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: mode === "category" ? "Category" : "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Txns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Net" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
          grouped.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-6 text-center text-muted-foreground", children: "No data." }) }),
          grouped.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-medium", children: g.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums", children: g.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-success", children: SAR(g.in) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-destructive", children: SAR(g.out) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right font-semibold tabular-nums", children: SAR(g.in - g.out) })
          ] }, g.label))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Transactions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Amount" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-6 text-center text-muted-foreground", children: "No transactions." }) }),
          filtered.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => openRecord?.("transaction", t.id), className: "cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: t.txn_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-medium", t.type === "cash_in" ? "text-success" : "text-destructive"), children: TXN_LABELS[t.type] ?? t.type }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-muted-foreground", children: [
              t.category ?? "—",
              t.subcategory ? ` · ${t.subcategory}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: t.shop_id ? shopName(t.shop_id) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold tabular-nums", children: SAR(t.amount) })
          ] }, t.id))
        ] })
      ] }) })
    ] })
  ] });
}
function WarehouseReport(props) {
  const {
    wh,
    parties,
    from,
    to,
    inRange,
    partyName,
    openRecord
  } = props;
  const [partyIds, setPartyIds] = reactExports.useState([]);
  const [entryTypes, setEntryTypes] = reactExports.useState([]);
  const [payStatuses, setPayStatuses] = reactExports.useState([]);
  const filtered = reactExports.useMemo(() => wh.filter((e) => inRange(e.txn_date)).filter((e) => inFilter(partyIds, e.party_id)).filter((e) => inFilter(entryTypes, e.entry_type)).filter((e) => inFilter(payStatuses, e.payment_status)), [wh, inRange, partyIds, entryTypes, payStatuses]);
  const totals = reactExports.useMemo(() => {
    let sale = 0, credit = 0, cashReceived = 0, due = 0;
    filtered.forEach((e) => {
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
    return {
      sale,
      credit,
      cashReceived,
      due: Math.max(0, due)
    };
  }, [filtered]);
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    filtered.forEach((e) => {
      const key = e.party_id || e.party_name;
      const label = e.party_id ? partyName(e.party_id) : e.party_name;
      const cur = map.get(key) ?? {
        label,
        sale: 0,
        paid: 0,
        due: 0,
        count: 0
      };
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
  const summary = [{
    label: "Total Sale",
    value: totals.sale
  }, {
    label: "Total Credit",
    value: totals.credit
  }, {
    label: "Cash Received",
    value: totals.cashReceived
  }, {
    label: "Due Receivable",
    value: totals.due
  }];
  const meta = `${from} → ${to} · ${filtered.length} entries`;
  const exportCSV = () => {
    const csv = [["Date", "Party", "Type", "Status", "Amount", "Paid", "Due", "Notes"], ...filtered.map((e) => [e.txn_date, e.party_id ? partyName(e.party_id) : e.party_name, e.entry_type, e.payment_status, Number(e.amount).toFixed(2), Number(e.paid_amount).toFixed(2), Number(e.remaining_due).toFixed(2), (e.notes ?? "").replace(/[\r\n,]/g, " ")])];
    downloadCSV(`warehouse-${from}-to-${to}.csv`, csv);
  };
  const exportPDF = () => openPDF("Warehouse Report", meta, summary, {
    headers: ["Date", "Party", "Type", "Status", "Amount", "Paid", "Due"],
    rows: filtered.map((e) => [e.txn_date, e.party_id ? partyName(e.party_id) : e.party_name, e.entry_type, e.payment_status, Number(e.amount), Number(e.paid_amount), Number(e.remaining_due)])
  });
  const share = () => shareWhatsApp("Warehouse", meta, summary);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubTabs, { value: "party", onChange: () => {
    }, options: [{
      k: "party",
      label: "Party Wise"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Party", placeholder: "All parties", options: parties.map((p) => ({
        value: p.id,
        label: p.name
      })), selected: partyIds, onChange: setPartyIds }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Entry type", options: [{
        value: "warehouse_sale",
        label: "Sale"
      }, {
        value: "warehouse_purchase",
        label: "Purchase"
      }, {
        value: "payment_received",
        label: "Payment Received"
      }, {
        value: "supplier_payment",
        label: "Supplier Payment"
      }], selected: entryTypes, onChange: setEntryTypes }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Payment status", options: [{
        value: "cash",
        label: "Cash"
      }, {
        value: "credit",
        label: "Credit"
      }, {
        value: "partial",
        label: "Partial"
      }], selected: payStatuses, onChange: setPayStatuses })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportBar, { onCSV: exportCSV, onPDF: exportPDF, onShare: share }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Sale", value: totals.sale, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Credit", value: totals.credit, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Cash Received", value: totals.cashReceived, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Due Receivable", value: totals.due, tone: "danger" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Party Wise" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Party" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Txns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Sale" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Due" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
          grouped.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-6 text-center text-muted-foreground", children: "No data." }) }),
          grouped.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-medium", children: g.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums", children: g.count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums", children: SAR(g.sale) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-success", children: SAR(g.paid) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right tabular-nums text-destructive font-semibold", children: SAR(Math.max(0, g.due)) })
          ] }, g.label))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Entries" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Party" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Due" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center text-muted-foreground", children: "No entries." }) }),
          filtered.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: () => openRecord?.("warehouse_entry", e.id), className: "cursor-pointer transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: e.txn_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: e.party_id ? partyName(e.party_id) : e.party_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: e.entry_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: e.payment_status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold tabular-nums", children: SAR(e.amount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-destructive", children: SAR(e.remaining_due) })
          ] }, e.id))
        ] })
      ] }) })
    ] })
  ] });
}
function EmployeeReport(props) {
  const {
    employees,
    employeeEntries,
    shops,
    from,
    to,
    setFrom,
    setTo,
    inRange,
    shopName
  } = props;
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const {
    data: isAdmin = false
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  const [period, setPeriod] = reactExports.useState("monthly");
  const [employeeIds, setEmployeeIds] = reactExports.useState([]);
  const [shopIds, setShopIds] = reactExports.useState([]);
  const [statuses, setStatuses] = reactExports.useState([]);
  const [activeEmp, setActiveEmp] = reactExports.useState(null);
  const applyPeriod = (p) => {
    setPeriod(p);
    const now = /* @__PURE__ */ new Date();
    const y = (d) => format(d, "yyyy-MM-dd");
    if (p === "today") {
      setFrom(y(now));
      setTo(y(now));
    } else if (p === "yesterday") {
      const d = new Date(Date.now() - 864e5);
      setFrom(y(d));
      setTo(y(d));
    } else if (p === "weekly") {
      setFrom(y(new Date(Date.now() - 7 * 864e5)));
      setTo(y(now));
    } else if (p === "monthly") {
      setFrom(y(new Date(Date.now() - 30 * 864e5)));
      setTo(y(now));
    }
  };
  const fEntries = reactExports.useMemo(() => employeeEntries.filter((e) => inRange(e.txn_date)), [employeeEntries, inRange]);
  const empRows = reactExports.useMemo(() => {
    return employees.filter((e) => inFilter(shopIds, e.shop_id)).filter((e) => inFilter(employeeIds, e.id)).map((e) => {
      const es = fEntries.filter((x) => x.employee_id === e.id);
      const given = es.filter((x) => x.entry_type === "given").reduce((s, x) => s + Number(x.amount || 0), 0);
      const received = es.filter((x) => x.entry_type === "received").reduce((s, x) => s + Number(x.amount || 0), 0);
      const balance = given - received;
      return {
        ...e,
        given,
        received,
        balance,
        entries: es
      };
    }).filter((r) => {
      if (statuses.length === 0) return true;
      const match = statuses.includes("outstanding") && r.balance > 0 || statuses.includes("settled") && Math.abs(r.balance) < 0.01 || statuses.includes("advance") && r.balance < 0;
      return match;
    });
  }, [employees, fEntries, employeeIds, shopIds, statuses]);
  const totals = reactExports.useMemo(() => {
    return empRows.reduce((a, r) => ({
      given: a.given + r.given,
      received: a.received + r.received,
      outstanding: a.outstanding + Math.max(0, r.balance)
    }), {
      given: 0,
      received: 0,
      outstanding: 0
    });
  }, [empRows]);
  const meta = `${from} → ${to} · ${empRows.length} employees`;
  const summary = [{
    label: "Total Given",
    value: totals.given
  }, {
    label: "Total Received",
    value: totals.received
  }, {
    label: "Total Outstanding",
    value: totals.outstanding
  }];
  const exportCSV = () => {
    const rows = [["Employee", "Shop", "Total Given", "Total Received", "Outstanding", "Entries"], ...empRows.map((r) => [r.name, r.shop_name ?? shopName(r.shop_id), r.given.toFixed(2), r.received.toFixed(2), Math.max(0, r.balance).toFixed(2), r.entries.length])];
    downloadCSV(`employee-report-${from}-to-${to}.csv`, rows);
  };
  const exportPDF = () => openPDF("Employee Report", meta, summary, {
    headers: ["Employee", "Shop", "Given", "Received", "Outstanding", "Entries"],
    rows: empRows.map((r) => [r.name, r.shop_name ?? shopName(r.shop_id), r.given, r.received, Math.max(0, r.balance), r.entries.length])
  });
  const share = () => shareWhatsApp("Employee Report", meta, summary);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SubTabs, { value: period, onChange: applyPeriod, options: [{
      k: "today",
      label: "Today"
    }, {
      k: "yesterday",
      label: "Yesterday"
    }, {
      k: "weekly",
      label: "Weekly"
    }, {
      k: "monthly",
      label: "Monthly"
    }, {
      k: "custom",
      label: "Custom"
    }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Employee", placeholder: "All employees", options: employees.map((e) => ({
        value: e.id,
        label: e.name
      })), selected: employeeIds, onChange: setEmployeeIds }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Shop", placeholder: "All shops", options: shops.map((s) => ({
        value: s.id,
        label: s.name
      })), selected: shopIds, onChange: setShopIds }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSelectChips, { label: "Status", options: [{
        value: "outstanding",
        label: "Outstanding"
      }, {
        value: "settled",
        label: "Settled"
      }, {
        value: "advance",
        label: "Advance"
      }], selected: statuses, onChange: setStatuses })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportBar, { onCSV: exportCSV, onPDF: exportPDF, onShare: share }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Given", value: totals.given, tone: "danger" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Received", value: totals.received, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total Outstanding", value: totals.outstanding, tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative p-3.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Employees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-2xl font-bold tabular-nums", children: empRows.length })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-muted/30 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Employees" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border", children: [
        empRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-6 text-center text-sm text-muted-foreground", children: "No employees match the filters." }),
        empRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveEmp(r), className: "grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 active:bg-accent/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
              (r.shop_name ?? shopName(r.shop_id)) || "—",
              " · ",
              r.entries.length,
              " entries"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-sm font-semibold tabular-nums", r.balance > 0 ? "text-destructive" : r.balance < 0 ? "text-success" : "text-muted-foreground"), children: SAR(Math.abs(r.balance)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: r.balance > 0 ? "Outstanding" : r.balance < 0 ? "Advance" : "Settled" })
          ] })
        ] }) }, r.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeDetailModal, { open: !!activeEmp, onClose: () => setActiveEmp(null), emp: activeEmp, shopName, isAdmin, onDeleted: () => {
      qc.invalidateQueries({
        queryKey: ["employee_entries"]
      });
    } })
  ] });
}
function EmployeeDetailModal({
  open,
  onClose,
  emp,
  shopName,
  isAdmin,
  onDeleted
}) {
  const confirm = useConfirm();
  if (!emp) return null;
  const shop = emp.shop_name ?? shopName(emp.shop_id);
  const handleShareEmployee = async () => {
    const rows = [{
      label: "Shop",
      value: shop || "—"
    }, {
      label: "Total Given",
      value: SAR(emp.given)
    }, {
      label: "Total Received",
      value: SAR(emp.received)
    }, {
      label: "Outstanding",
      value: SAR(Math.max(0, emp.balance))
    }, {
      label: "Entries",
      value: String(emp.entries.length)
    }];
    await shareToWhatsApp({
      title: `Employee Report — ${emp.name}`,
      subtitle: shop || void 0,
      amount: SAR(Math.max(0, emp.balance)),
      amountLabel: "Outstanding",
      rows,
      accent: emp.balance > 0 ? "out" : "in",
      badge: emp.balance > 0 ? "OUTSTANDING" : emp.balance < 0 ? "ADVANCE" : "SETTLED",
      caption: `Employee: ${emp.name} · Shop: ${shop || "—"} · Given: ${SAR(emp.given)} · Received: ${SAR(emp.received)} · Outstanding: ${SAR(Math.max(0, emp.balance))}`
    });
  };
  const handleShareEntry = async (e) => {
    const isGiven = e.entry_type === "given";
    await shareToWhatsApp({
      title: isGiven ? "Money Given" : "Money Received",
      subtitle: emp.name,
      amount: SAR(Number(e.amount)),
      amountLabel: isGiven ? "Given" : "Received",
      date: e.txn_date,
      rows: [{
        label: "Employee",
        value: emp.name
      }, {
        label: "Shop",
        value: shop || "—"
      }, {
        label: "Type",
        value: isGiven ? "Given" : "Received"
      }, {
        label: "Amount",
        value: SAR(Number(e.amount))
      }],
      notes: e.notes,
      badge: isGiven ? "OUT" : "IN",
      accent: isGiven ? "out" : "in",
      caption: `${isGiven ? "Money Given" : "Money Received"} · Employee: ${emp.name} · Date: ${e.txn_date} · Amount: ${SAR(Number(e.amount))}`
    });
  };
  const handleDelete = async (id) => {
    if (!await confirm({
      title: "Move entry to Recycle Bin?",
      description: "The employee ledger will be updated. You can restore from the Recycle Bin.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning"
    })) return;
    const {
      error
    } = await softDelete("employee_entries", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin");
    onDeleted();
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg gap-0 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base flex items-center gap-2", children: [
      emp.name,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-auto text-[10px]", children: shop || "No shop" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Given", value: SAR(emp.given), tone: "text-destructive" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Received", value: SAR(emp.received), tone: "text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Outstanding", value: SAR(Math.max(0, emp.balance)), tone: "text-warning" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Transaction History (",
          emp.entries.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border rounded-xl border border-border", children: [
          emp.entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-4 text-center text-xs text-muted-foreground", children: "No entries in range." }),
          emp.entries.map((e) => {
            const isGiven = e.entry_type === "given";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-3 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                    isGiven ? "Given" : "Received",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[11px] text-muted-foreground inline-flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3" }),
                      e.txn_date
                    ] })
                  ] }),
                  e.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: e.notes })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 text-sm font-semibold tabular-nums", isGiven ? "text-destructive" : "text-success"), children: SAR(e.amount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[11px] border-success/40 text-success hover:bg-success/10", onClick: () => handleShareEntry(e), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1 h-3 w-3" }),
                  " WhatsApp"
                ] }),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[11px] text-destructive hover:text-destructive", onClick: () => handleDelete(e.id), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3 w-3" }),
                  " Delete"
                ] })
              ] })
            ] }, e.id);
          })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 border-t border-border bg-muted/20 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1 border-success/40 text-success hover:bg-success/10", onClick: handleShareEmployee, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Share as Image"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: onClose, children: "Close" })
    ] })
  ] }) });
}
function MiniStat({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("mt-0.5 text-sm font-semibold tabular-nums", tone), children: value })
  ] });
}
export {
  ReportsPage as component
};
