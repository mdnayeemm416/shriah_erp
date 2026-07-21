import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { av as useHighlightRecord, k as useAuth, s as useUserAccess, u as useConfirm, l as useServerFn, aw as scanDocument, ax as Route$v, J as sortShops, o as useWorkingDate, ay as isSimpleShop, af as SAR, Z as DropdownMenu, _ as DropdownMenuTrigger, $ as DropdownMenuContent, a0 as DropdownMenuItem, a1 as DropdownMenuSeparator, at as DropdownMenuLabel, S as Sheet, e as SheetContent, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as cn, B as Button, L as Label, I as Input, h as Badge, C as Card, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, T as Textarea, G as DialogFooter, az as useSignedAttachmentUrl, aA as sendAuditEmail, aB as scanDocumentCached, au as DialogTrigger, j as createSsrRpc } from "./router-KeVl8_Ln.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { u as useShopPositions, a as assertShopPositionMatch } from "./use-shop-positions-B07f-IJE.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { r as readSync, u as utils, S as SSF, w as writeFileSync } from "../_libs/xlsx.mjs";
import { P as Progress } from "./progress-C7s7mjqg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as EditHistoryButton } from "./edit-history-D9fAqzXB.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { P as Provider, R as Root3, T as Trigger, a as Portal, C as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { I as InfoButton } from "./info-button-BBedyB3N.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/vaul.mjs";

import "../_libs/seroval.mjs";
import { aa as Store, av as EllipsisVertical, P as Plus, W as Wallet, v as Package, aH as FileSpreadsheet, aG as ChartColumn, aX as FileDown, $ as FileText, Y as Share2, k as LoaderCircle, aY as ImageDown, ao as RefreshCw, X, aZ as Banknote, F as ShoppingCart, aA as Info, l as Sparkles, i as Camera, j as Upload, a as TriangleAlert, C as CircleCheck, a7 as Eye, az as Save, T as Trash2, U as Users, y as Search, a5 as Pencil, a_ as Tags, aV as ArrowUpRight, a$ as ArrowDownRight, u as ChevronRight, _ as Download, aQ as ArrowRight, ae as TrendingUp, ax as TrendingDown, M as Maximize2, E as ScanLine, b0 as Ellipsis, S as ShieldAlert, q as Paperclip } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
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
import "../_libs/tslib.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/radix-ui__react-progress.mjs";
import "./help-content-CrTK3PSB.mjs";
const HEADER_MAP = {
  "date": "date",
  "txn date": "date",
  "transaction date": "date",
  "sale date": "date",
  "shop": "shopName",
  "shop name": "shopName",
  "store": "shopName",
  "store name": "shopName",
  "cashier": "cashierName",
  "cashier name": "cashierName",
  "employee": "cashierName",
  "pos": "posSale",
  "pos sale": "posSale",
  "pos sales": "posSale",
  "cash": "cashSale",
  "cash sale": "cashSale",
  "cash sales": "cashSale",
  "bank": "bankSale",
  "bank sale": "bankSale",
  "bank sales": "bankSale",
  "card": "bankSale",
  "card sale": "bankSale",
  "credit": "creditSale",
  "credit sale": "creditSale",
  "credit sales": "creditSale",
  "due": "creditSale"
};
function normalizeHeader(h) {
  return String(h ?? "").toLowerCase().trim().replace(/[_\-]+/g, " ").replace(/\s+/g, " ");
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function parseDate(v) {
  if (v == null || v === "") return "";
  if (v instanceof Date) {
    return `${v.getFullYear()}-${pad2(v.getMonth() + 1)}-${pad2(v.getDate())}`;
  }
  if (typeof v === "number") {
    const d = SSF.parse_date_code(v);
    if (d) return `${d.y}-${pad2(d.m)}-${pad2(d.d)}`;
  }
  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    +iso[1];
    const mo = +iso[2], da = +iso[3];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      return `${iso[1]}-${pad2(mo)}-${pad2(da)}`;
    }
  }
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const da = +m[1], mo = +m[2];
    const yr = m[3].length === 2 ? 2e3 + +m[3] : +m[3];
    if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
      return `${yr}-${pad2(mo)}-${pad2(da)}`;
    }
  }
  return "";
}
function parseNum(v) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(/[^\d.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function ShopImportDialog({
  open,
  onOpenChange,
  shops,
  cashiers,
  existingEntries
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileRef = reactExports.useRef(null);
  const [stage, setStage] = reactExports.useState("upload");
  const [fileName, setFileName] = reactExports.useState("");
  const [rows, setRows] = reactExports.useState([]);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [result, setResult] = reactExports.useState(null);
  const reset = () => {
    setStage("upload");
    setFileName("");
    setRows([]);
    setProgress(0);
    setResult(null);
  };
  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };
  const downloadTemplate = () => {
    const ws = utils.aoa_to_sheet([
      ["Date", "Shop Name", "Cashier Name", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale"],
      [(/* @__PURE__ */ new Date()).toISOString().slice(0, 10), shops[0]?.name ?? "Shop A", "", 0, 0, 0, 0]
    ]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Shop Sales");
    writeFileSync(wb, "shop-sales-template.xlsx");
  };
  const processFile = reactExports.useCallback(async (f) => {
    setFileName(f.name);
    try {
      const buf = await f.arrayBuffer();
      const wb = readSync(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = utils.sheet_to_json(ws, { defval: "" });
      if (!json.length) {
        toast.error("File has no rows");
        return;
      }
      const firstKeys = Object.keys(json[0]);
      const keyMap = {};
      for (const k of firstKeys) {
        const mapped = HEADER_MAP[normalizeHeader(k)];
        if (mapped) keyMap[k] = mapped;
      }
      const shopByName = new Map(shops.map((s) => [s.name.toLowerCase().trim(), s]));
      const cashierKey = (shopId, name) => `${shopId}::${name.toLowerCase().trim()}`;
      const cashierByName = new Map(cashiers.map((c) => [cashierKey(c.shop_id, c.name), c]));
      const dupKey = (date, shopId, cashierId, total) => `${date}|${shopId}|${cashierId}|${total.toFixed(2)}`;
      const existingDupSet = new Set(
        existingEntries.filter((e) => e.entry_type === "sale").map((e) => dupKey(
          e.txn_date,
          e.shop_id,
          e.cashier_id ?? "",
          (Number(e.cash_sale) || 0) + (Number(e.bank_sale) || 0) + (Number(e.credit_sale) || 0)
        ))
      );
      const parsed = json.map((r, i) => {
        const get = (field) => {
          for (const [orig, mapped] of Object.entries(keyMap)) {
            if (mapped === field) return r[orig];
          }
          return void 0;
        };
        const date = parseDate(get("date"));
        const shopName = String(get("shopName") ?? "").trim();
        const cashierName = String(get("cashierName") ?? "").trim();
        const posSale = parseNum(get("posSale"));
        const cashSale = parseNum(get("cashSale"));
        const bankSale = parseNum(get("bankSale"));
        const creditSale = parseNum(get("creditSale"));
        const totalSale = cashSale + bankSale + creditSale;
        const diff = totalSale - posSale;
        const errors = [];
        const warnings = [];
        if (!date) errors.push("Invalid/missing date");
        if (!shopName) errors.push("Missing shop");
        const shop = shopName ? shopByName.get(shopName.toLowerCase()) : void 0;
        if (shopName && !shop) errors.push(`Unknown shop "${shopName}"`);
        let cashier;
        if (shop && cashierName) {
          cashier = cashierByName.get(cashierKey(shop.id, cashierName));
          if (!cashier) warnings.push(`Unknown cashier "${cashierName}"`);
        }
        if (totalSale + posSale === 0) errors.push("All amounts are zero");
        const duplicate = !!shop && existingDupSet.has(dupKey(date, shop.id, cashier?.id ?? "", totalSale));
        if (duplicate) warnings.push("Possible duplicate");
        return {
          idx: i + 2,
          raw: r,
          date,
          shopName,
          cashierName,
          posSale,
          cashSale,
          bankSale,
          creditSale,
          shopId: shop?.id,
          cashierId: cashier?.id,
          totalSale,
          diff,
          errors,
          warnings,
          duplicate
        };
      });
      setRows(parsed);
      setStage("preview");
    } catch (err) {
      toast.error(err?.message ?? "Failed to read file");
    }
  }, [shops, cashiers, existingEntries]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };
  const validRows = reactExports.useMemo(() => rows.filter((r) => r.errors.length === 0), [rows]);
  const invalidRows = reactExports.useMemo(() => rows.filter((r) => r.errors.length > 0), [rows]);
  const dupRows = reactExports.useMemo(() => validRows.filter((r) => r.duplicate), [validRows]);
  const doImport = async () => {
    if (!user) return toast.error("Not signed in");
    if (!validRows.length) return toast.error("No valid rows to import");
    setStage("importing");
    setProgress(0);
    const failed = [];
    let ok = 0;
    const batchSize = 25;
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize);
      const payload = batch.map((r) => ({
        txn_date: r.date,
        shop_id: r.shopId,
        cashier_id: r.cashierId ?? null,
        entry_type: "sale",
        pos_sale: r.posSale,
        cash_sale: r.cashSale,
        bank_sale: r.bankSale,
        credit_sale: r.creditSale,
        difference: r.diff,
        purchase_amount: 0,
        expense_amount: 0,
        withdraw_amount: 0,
        notes: "Imported from file",
        created_by: user.id
      }));
      const { error } = await supabase.from("shop_entries").insert(payload);
      if (error) {
        batch.forEach((r) => failed.push({ row: r.idx, reason: error.message }));
      } else {
        ok += batch.length;
      }
      setProgress(Math.round((i + batch.length) / validRows.length * 100));
    }
    setResult({ ok, failed });
    setStage("done");
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["txns"] });
    if (ok) toast.success(`Imported ${ok} sale${ok === 1 ? "" : "s"}`);
    if (failed.length) toast.error(`${failed.length} row${failed.length === 1 ? "" : "s"} failed`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) close();
    else onOpenChange(true);
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-5 w-5 text-primary" }),
      "Import Shop Sales"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto -mx-6 px-6", children: [
      stage === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onDragOver: (e) => {
              e.preventDefault();
              setDragOver(true);
            },
            onDragLeave: () => setDragOver(false),
            onDrop,
            onClick: () => fileRef.current?.click(),
            className: cn(
              "rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
              dragOver ? "border-primary bg-primary/10 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/40"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Drop Excel / CSV here, or click to browse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Supports .xlsx and .csv" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileRef,
                  type: "file",
                  hidden: true,
                  accept: ".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv",
                  onChange: (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) processFile(f);
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Need a starting point?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Download a pre-filled template with the right columns." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: downloadTemplate, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-3.5 w-3.5" }),
            " Template"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Expected columns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Date · Shop Name · Cashier Name · POS Sale · Cash Sale · Bank Sale · Credit Sale" })
        ] })
      ] }),
      stage === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: fileName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              " · ",
              rows.length,
              " rows"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: reset, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-3 w-3" }),
            " Change file"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Valid", value: validRows.length, tone: "ok" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Errors", value: invalidRows.length, tone: "err" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Duplicates", value: dupRows.length, tone: "warn" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border overflow-auto max-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/60 sticky top-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "Shop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "Cashier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "POS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "Cash" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "Bank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "Credit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5 text-right", children: "+/-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1.5", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: cn(
            "border-t",
            r.errors.length > 0 && "bg-destructive/5",
            r.errors.length === 0 && r.duplicate && "bg-amber-500/5"
          ), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-muted-foreground", children: r.idx }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: r.date || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: r.shopName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: r.cashierName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.posSale.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.cashSale.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.bankSale.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right tabular-nums", children: r.creditSale.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5 text-right tabular-nums font-semibold", children: r.totalSale.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: cn(
              "px-2 py-1.5 text-right tabular-nums",
              r.diff > 0 && "text-emerald-600",
              r.diff < 0 && "text-destructive"
            ), children: r.diff.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1.5", children: r.errors.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "gap-1 text-[10px]", title: r.errors.join("; "), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
              " Error"
            ] }) : r.duplicate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300", title: r.warnings.join("; "), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
              " Dup"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }),
              " OK"
            ] }) })
          ] }, r.idx)) })
        ] }) }),
        invalidRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-destructive mb-1", children: [
            invalidRows.length,
            " row(s) will be skipped:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-0.5 text-muted-foreground", children: [
            invalidRows.slice(0, 5).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Row ",
              r.idx,
              ": ",
              r.errors.join("; ")
            ] }, r.idx)),
            invalidRows.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "…and ",
              invalidRows.length - 5,
              " more"
            ] })
          ] })
        ] })
      ] }),
      stage === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-10 space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto h-10 w-10 animate-spin text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
          "Importing ",
          validRows.length,
          " sales…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "max-w-sm mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          progress,
          "%"
        ] })
      ] }),
      stage === "done" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-7 w-7 text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold", children: "Import complete" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            result.ok,
            " imported · ",
            result.failed.length,
            " failed"
          ] })
        ] }),
        result.failed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs max-h-40 overflow-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-destructive mb-1", children: "Failed rows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5 text-muted-foreground", children: result.failed.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "Row ",
            f.row,
            ": ",
            f.reason
          ] }, i)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      stage === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: close, children: "Cancel" }),
      stage === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: close, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: doImport, disabled: !validRows.length, children: [
          "Import ",
          validRows.length,
          " valid ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })
        ] })
      ] }),
      stage === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: close, children: "Done" })
    ] })
  ] }) });
}
function Stat({ label, value, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
    "rounded-xl border px-3 py-2",
    tone === "ok" && "border-emerald-500/30 bg-emerald-500/5",
    tone === "err" && "border-destructive/30 bg-destructive/5",
    tone === "warn" && "border-amber-500/30 bg-amber-500/5"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold tabular-nums", children: value })
  ] });
}
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
const COMPANY_DEFAULT = "ShRiAh Group";
const fmt = (n) => new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
function totalsOf(rows) {
  return rows.reduce(
    (a, r) => ({
      pos: a.pos + r.pos,
      cash: a.cash + r.cash,
      bank: a.bank + r.bank,
      credit: a.credit + r.credit,
      totalSale: a.totalSale + r.totalSale,
      purchase: a.purchase + r.purchase,
      expense: a.expense + r.expense,
      withdraw: a.withdraw + r.withdraw,
      diff: a.diff + r.diff
    }),
    { pos: 0, cash: 0, bank: 0, credit: 0, totalSale: 0, purchase: 0, expense: 0, withdraw: 0, diff: 0 }
  );
}
async function buildShopReportImage(input) {
  const company = input.company || COMPANY_DEFAULT;
  const W = 1080;
  const PAD = 56;
  const t = totalsOf(input.rows);
  const headerH = 180;
  const metaH = 100;
  const statRowH = 64;
  const stats = [
    { label: "POS Sale", value: t.pos },
    { label: "Cash Sale", value: t.cash },
    { label: "Bank Sale", value: t.bank },
    { label: "Credit Sale", value: t.credit },
    { label: "Total Sale", value: t.totalSale },
    { label: "Purchase", value: t.purchase, tone: "muted" },
    { label: "Expense", value: t.expense, tone: "muted" },
    { label: "Withdraw", value: t.withdraw, tone: "muted" }
  ];
  const statsH = stats.length * statRowH + 40;
  const cashPosH = 130;
  const breakdownRowH = 52;
  const tableH = input.rows.length > 1 ? breakdownRowH * (input.rows.length + 1) + 70 : 0;
  const footerH = 110;
  const H = headerH + metaH + statsH + cashPosH + tableH + footerH + 60;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "800 44px Inter, system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(company, PAD, PAD);
  ctx.fillStyle = "#525252";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.fillText(input.title, PAD, PAD + 58);
  ctx.textAlign = "right";
  ctx.fillStyle = "#404040";
  ctx.font = "600 20px Inter, system-ui, sans-serif";
  ctx.fillText(input.rangeLabel, W - PAD, PAD + 6);
  ctx.fillStyle = "#737373";
  ctx.font = "500 18px Inter, system-ui, sans-serif";
  ctx.fillText((/* @__PURE__ */ new Date()).toLocaleDateString(), W - PAD, PAD + 36);
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, headerH);
  ctx.lineTo(W - PAD, headerH);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#737373";
  ctx.font = "700 14px Inter, system-ui, sans-serif";
  ctx.fillText("SCOPE", PAD, headerH + 22);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  ctx.fillText(input.scopeLabel, PAD, headerH + 44);
  let y = headerH + metaH;
  ctx.fillStyle = "#a3a3a3";
  ctx.font = "700 13px Inter, system-ui, sans-serif";
  ctx.fillText("BREAKDOWN", PAD, y);
  y += 28;
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    const rowY = y + i * statRowH;
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, rowY);
    ctx.lineTo(W - PAD, rowY);
    ctx.stroke();
    const isTotal = s.label === "Total Sale";
    ctx.fillStyle = isTotal ? "#0a0a0a" : "#404040";
    ctx.font = isTotal ? "700 22px Inter, system-ui, sans-serif" : "600 20px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(s.label, PAD, rowY + 22);
    ctx.fillStyle = isTotal ? "#0a0a0a" : s.tone === "muted" ? "#525252" : "#171717";
    ctx.font = isTotal ? "800 24px Inter, system-ui, sans-serif" : "700 22px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`SAR ${fmt(s.value)}`, W - PAD, rowY + 21);
  }
  y += stats.length * statRowH;
  const cpY = y + 24;
  ctx.strokeStyle = "#0a0a0a";
  ctx.lineWidth = 2;
  ctx.strokeRect(PAD, cpY, W - PAD * 2, cashPosH - 30);
  ctx.textAlign = "left";
  ctx.fillStyle = "#737373";
  ctx.font = "700 14px Inter, system-ui, sans-serif";
  ctx.fillText("CASH POSITION", PAD + 24, cpY + 22);
  ctx.fillStyle = "#0a0a0a";
  ctx.font = "500 14px Inter, system-ui, sans-serif";
  ctx.fillText(t.diff >= 0 ? "Surplus" : "Shortage", PAD + 24, cpY + 50);
  ctx.textAlign = "right";
  ctx.fillStyle = t.diff >= 0 ? "#047857" : "#b91c1c";
  ctx.font = "800 40px Inter, system-ui, sans-serif";
  ctx.fillText(`${t.diff >= 0 ? "+" : "−"} SAR ${fmt(Math.abs(t.diff))}`, W - PAD - 24, cpY + 30);
  y = cpY + cashPosH;
  if (input.rows.length > 1) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillText("PER-SHOP", PAD, y);
    y += 26;
    ctx.fillStyle = "#737373";
    ctx.font = "700 14px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("SHOP", PAD, y + 22);
    ctx.textAlign = "right";
    ctx.fillText("SALE", W - PAD - 380, y + 22);
    ctx.fillText("EXPENSE", W - PAD - 200, y + 22);
    ctx.fillText("+/−", W - PAD, y + 22);
    y += breakdownRowH;
    for (const r of input.rows) {
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, y);
      ctx.lineTo(W - PAD, y);
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.fillStyle = "#0a0a0a";
      ctx.font = "600 18px Inter, system-ui, sans-serif";
      ctx.fillText(r.shop_name, PAD, y + 22);
      ctx.textAlign = "right";
      ctx.fillStyle = "#404040";
      ctx.font = "600 18px Inter, system-ui, sans-serif";
      ctx.fillText(fmt(r.totalSale), W - PAD - 380, y + 22);
      ctx.fillText(fmt(r.expense), W - PAD - 200, y + 22);
      ctx.fillStyle = r.diff >= 0 ? "#047857" : "#b91c1c";
      ctx.font = "700 18px Inter, system-ui, sans-serif";
      ctx.fillText(`${r.diff >= 0 ? "+" : "−"}${fmt(Math.abs(r.diff))}`, W - PAD, y + 22);
      y += breakdownRowH;
    }
  }
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, H - footerH);
  ctx.lineTo(W - PAD, H - footerH);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#737373";
  ctx.font = "600 16px Inter, system-ui, sans-serif";
  ctx.fillText("Generated By AhsAN Manager ShRiAh Group", W / 2, H - footerH + 28);
  ctx.fillStyle = "#a3a3a3";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText((/* @__PURE__ */ new Date()).toLocaleString(), W / 2, H - footerH + 56);
  return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 0.95));
}
function printShopReportPDF(input) {
  const company = input.company || COMPANY_DEFAULT;
  const t = totalsOf(input.rows);
  const stat = (l, v, color = "#0f172a") => `<div class="stat"><div class="l">${l}</div><div class="v" style="color:${color}">SAR ${fmt(v)}</div></div>`;
  const tableHtml = input.rows.length > 1 ? `<h2>Per-Shop Breakdown</h2>
       <table><thead><tr>
         <th>Shop</th><th>POS</th><th>Cash</th><th>Bank</th><th>Credit</th>
         <th>Total Sale</th><th>Purchase</th><th>Expense</th><th>Withdraw</th><th>+/-</th>
       </tr></thead><tbody>
       ${input.rows.map((r) => `<tr>
         <td><b>${r.shop_name}</b></td>
         <td>${fmt(r.pos)}</td><td>${fmt(r.cash)}</td><td>${fmt(r.bank)}</td><td>${fmt(r.credit)}</td>
         <td><b>${fmt(r.totalSale)}</b></td>
         <td>${fmt(r.purchase)}</td><td>${fmt(r.expense)}</td><td>${fmt(r.withdraw)}</td>
         <td style="color:${r.diff >= 0 ? "#059669" : "#dc2626"};font-weight:700">${r.diff >= 0 ? "+" : "-"}${fmt(Math.abs(r.diff))}</td>
       </tr>`).join("")}
       </tbody></table>` : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"/>
<title>${input.title} — ${company}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#0f172a;margin:0;padding:32px;background:#fff}
  .head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px}
  .brand{font-size:24px;font-weight:800;letter-spacing:-0.02em}
  .subtitle{color:#64748b;font-size:13px;margin-top:4px}
  .meta{text-align:right;color:#64748b;font-size:13px}
  .scope{display:inline-block;margin-bottom:20px;padding:8px 14px;border-radius:10px;background:#f1f5f9;border:1px solid #e2e8f0;font-size:13px}
  .scope b{color:#0f172a}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .stat{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;background:#f8fafc}
  .stat .l{font-size:11px;text-transform:uppercase;color:#64748b;letter-spacing:.08em}
  .stat .v{font-size:20px;font-weight:800;margin-top:6px;font-variant-numeric:tabular-nums}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#475569;margin:24px 0 10px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  thead th{text-align:right;background:#f1f5f9;color:#475569;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:8px;border-bottom:2px solid #e2e8f0}
  thead th:first-child{text-align:left}
  tbody td{padding:8px;border-bottom:1px solid #f1f5f9;text-align:right;font-variant-numeric:tabular-nums}
  tbody td:first-child{text-align:left}
  .foot{margin-top:28px;text-align:center;color:#94a3b8;font-size:11px}
  @media print{ body{padding:16px} }
</style></head><body>
  <div class="head">
    <div>
      <div class="brand">${company}</div>
      <div class="subtitle">${input.title}</div>
    </div>
    <div class="meta">
      <div>${(/* @__PURE__ */ new Date()).toLocaleDateString()}</div>
      <div>${input.rangeLabel}</div>
    </div>
  </div>
  <div class="scope">Scope: <b>${input.scopeLabel}</b></div>
  <div class="grid">
    ${stat("POS Sale", t.pos)}
    ${stat("Cash Sale", t.cash)}
    ${stat("Bank Sale", t.bank)}
    ${stat("Credit Sale", t.credit)}
    ${stat("Total Sale", t.totalSale, "#0f172a")}
    ${stat("Purchase", t.purchase, "#dc2626")}
    ${stat("Expense", t.expense, "#dc2626")}
    ${stat("Withdraw", t.withdraw)}
    ${stat("Plus / Minus", t.diff, t.diff >= 0 ? "#059669" : "#dc2626")}
  </div>
  ${tableHtml}
  <div class="foot">Generated By AhsAN Manager ShRiAh Group · ${(/* @__PURE__ */ new Date()).toLocaleString()}</div>
  <script>window.onload = () => { setTimeout(() => window.print(), 250); };<\/script>
</body></html>`;
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!w) {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shop-report.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4e3);
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
function downloadShopReportExcel(input) {
  const headers = ["Shop", "POS Sale", "Cash Sale", "Bank Sale", "Credit Sale", "Total Sale", "Purchase", "Expense", "Withdraw", "Plus/Minus"];
  const lines = [headers.join(",")];
  for (const r of input.rows) {
    lines.push([
      `"${r.shop_name.replace(/"/g, '""')}"`,
      r.pos,
      r.cash,
      r.bank,
      r.credit,
      r.totalSale,
      r.purchase,
      r.expense,
      r.withdraw,
      r.diff
    ].join(","));
  }
  if (input.rows.length > 1) {
    const t = totalsOf(input.rows);
    lines.push(["TOTAL", t.pos, t.cash, t.bank, t.credit, t.totalSale, t.purchase, t.expense, t.withdraw, t.diff].join(","));
  }
  const meta = `# ${input.title}
# Scope: ${input.scopeLabel}
# Range: ${input.rangeLabel}
`;
  const csv = meta + lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${input.title.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
async function downloadShopReportImage(input) {
  const blob = await buildShopReportImage(input);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${input.title.replace(/\s+/g, "-").toLowerCase()}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
async function shareShopReportWhatsApp(input) {
  const company = input.company || COMPANY_DEFAULT;
  const t = totalsOf(input.rows);
  const text = [
    company,
    input.title,
    `Scope: ${input.scopeLabel}`,
    `Range: ${input.rangeLabel}`,
    "",
    `POS Sale: SAR ${fmt(t.pos)}`,
    `Cash Sale: SAR ${fmt(t.cash)}`,
    `Bank Sale: SAR ${fmt(t.bank)}`,
    `Credit Sale: SAR ${fmt(t.credit)}`,
    `Total Sale: SAR ${fmt(t.totalSale)}`,
    `Purchase: SAR ${fmt(t.purchase)}`,
    `Expense: SAR ${fmt(t.expense)}`,
    `Withdraw: SAR ${fmt(t.withdraw)}`,
    `Plus/Minus: SAR ${fmt(t.diff)}`
  ].join("\n");
  const blob = await buildShopReportImage(input);
  const fileName = `${input.title.replace(/\s+/g, "-").toLowerCase()}.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const navAny = navigator;
  const canShareFiles = !!(navAny.canShare && navAny.share && navAny.canShare({ files: [file] }));
  if (canShareFiles) {
    try {
      await navAny.share({ files: [file], title: input.title, text });
      return { kind: "shared" };
    } catch (err) {
      if (err?.name === "AbortError") return { kind: "cancelled" };
    }
  }
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
  return { kind: "fallback-link" };
}
function CashierManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [q, setQ] = reactExports.useState("");
  const [activeShopId, setActiveShopId] = reactExports.useState(null);
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => sortShops((await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? [])
  });
  const { data: cashiers = [] } = useQuery({
    queryKey: ["cashiers", "all"],
    queryFn: async () => (await supabase.from("cashiers").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const filteredShops = shops.filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()));
  const activeShop = shops.find((s) => s.id === activeShopId);
  const activeCashiers = cashiers.filter((c) => c.shop_id === activeShopId);
  const deleteCashier = async (id) => {
    if (!await confirm({ title: "Move cashier to Recycle Bin?", description: "Their past entries stay intact and you can restore the cashier from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    const { softDelete } = await import("./soft-delete-DQY0d6eC.mjs");
    const { error } = await softDelete("cashiers", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["cashiers"] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
        " Cashiers"
      ] }),
      activeShop && /* @__PURE__ */ jsxRuntimeExports.jsx(CashierFormDialog, { userId: user?.id, shopId: activeShop.id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search shops…", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Shops" }),
        filteredShops.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-center text-sm text-muted-foreground", children: "No shops — add above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-80 divide-y divide-border overflow-y-auto", children: filteredShops.map((s) => {
          const isActive = s.id === activeShopId;
          const count = cashiers.filter((c) => c.shop_id === s.id).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors",
                isActive ? "bg-primary/10" : "hover:bg-muted/50"
              ),
              onClick: () => setActiveShopId(s.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-sm font-medium", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground", children: count })
              ]
            },
            s.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-border px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: activeShop ? `Cashiers of ${activeShop.name}` : "Cashiers" }) }),
        !activeShop ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: "Select a shop to view its cashiers." }) : activeCashiers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-center text-sm text-muted-foreground", children: "No cashiers yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-80 divide-y divide-border overflow-y-auto", children: activeCashiers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-sm", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CashierFormDialog, { userId: user?.id, shopId: c.shop_id, editing: c, trigger: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteCashier(c.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }, c.id)) })
      ] })
    ] })
  ] });
}
function CashierFormDialog({
  userId,
  shopId,
  editing,
  trigger
}) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(editing?.name ?? "");
  const [targetShopId, setTargetShopId] = reactExports.useState(editing?.shop_id ?? shopId);
  const [busy, setBusy] = reactExports.useState(false);
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => sortShops((await supabase.from("shops").select("*").eq("is_deleted", false)).data ?? [])
  });
  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const payload = { name: name.trim(), shop_id: targetShopId };
    const { error } = editing ? await supabase.from("cashiers").update(payload).eq("id", editing.id) : await supabase.from("cashiers").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["cashiers"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
      " Add cashier"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        editing ? "Edit" : "New",
        " cashier"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5", placeholder: "e.g. Anwer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Shop" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: targetShopId, onValueChange: setTargetShopId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: busy ? "Saving…" : "Save" }) })
      ] })
    ] })
  ] });
}
function CategoryManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [q, setQ] = reactExports.useState("");
  const [activeCatId, setActiveCatId] = reactExports.useState(null);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const { data: subs = [] } = useQuery({
    queryKey: ["sub_categories"],
    queryFn: async () => (await supabase.from("sub_categories").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const filteredCats = categories.filter(
    (c) => !q || c.name.toLowerCase().includes(q.toLowerCase())
  );
  const activeCat = categories.find((c) => c.id === activeCatId);
  const activeSubs = subs.filter((s) => s.category_id === activeCatId);
  const deleteCat = async (id) => {
    if (!await confirm({ title: "Move category to Recycle Bin?", description: "Old entries will still display this category. You can restore it anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    const { softDelete } = await import("./soft-delete-DQY0d6eC.mjs");
    const { error } = await softDelete("categories", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      if (activeCatId === id) setActiveCatId(null);
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
    }
  };
  const deleteSub = async (id) => {
    if (!await confirm({ title: "Move sub-category to Recycle Bin?", description: "Existing entries keep this sub-category. Recover it from the Recycle Bin anytime.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    const { softDelete } = await import("./soft-delete-DQY0d6eC.mjs");
    const { error } = await softDelete("sub_categories", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "h-4 w-4 text-primary" }),
        " Categories & Sub-categories"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryFormDialog, { userId: user?.id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search categories…", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Categories" }),
        filteredCats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-center text-sm text-muted-foreground", children: "No categories." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-80 divide-y divide-border overflow-y-auto", children: filteredCats.map((c) => {
          const isIn = c.txn_type === "cash_in";
          const isActive = c.id === activeCatId;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors",
                isActive ? "bg-primary/10" : "hover:bg-muted/50"
              ),
              onClick: () => setActiveCatId(c.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  isIn ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                ), children: isIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-sm font-medium", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryFormDialog, { userId: user?.id, editing: c, trigger: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => e.stopPropagation(), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                  e.stopPropagation();
                  deleteCat(c.id);
                }, className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" })
              ]
            },
            c.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: activeCat ? `Sub-categories of ${activeCat.name}` : "Sub-categories" }),
          activeCat && /* @__PURE__ */ jsxRuntimeExports.jsx(SubCategoryFormDialog, { userId: user?.id, categoryId: activeCat.id })
        ] }),
        !activeCat ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: "Select a category to view its sub-categories." }) : activeSubs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-center text-sm text-muted-foreground", children: "No sub-categories yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-80 divide-y divide-border overflow-y-auto", children: activeSubs.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-sm", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SubCategoryFormDialog, { userId: user?.id, categoryId: s.category_id, editing: s, trigger: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteSub(s.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }, s.id)) })
      ] })
    ] })
  ] });
}
function CategoryFormDialog({
  userId,
  editing,
  trigger
}) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(editing?.name ?? "");
  const [type, setType] = reactExports.useState(editing?.txn_type ?? "cash_out");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const payload = { name: name.trim(), txn_type: type };
    const { error } = editing ? await supabase.from("categories").update(payload).eq("id", editing.id) : await supabase.from("categories").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
      " Add category"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        editing ? "Edit" : "New",
        " category"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5", placeholder: "e.g. Rent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Transaction type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash_in", children: "Cash In" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash_out", children: "Cash Out" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: busy ? "Saving…" : "Save" }) })
      ] })
    ] })
  ] });
}
function SubCategoryFormDialog({
  userId,
  categoryId,
  editing,
  trigger
}) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(editing?.name ?? "");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    const { error } = editing ? await supabase.from("sub_categories").update({ name: name.trim() }).eq("id", editing.id) : await supabase.from("sub_categories").insert({ name: name.trim(), category_id: categoryId, created_by: userId });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Updated" : "Added");
      qc.invalidateQueries({ queryKey: ["sub_categories"] });
      setOpen(false);
      if (!editing) setName("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3.5 w-3.5" }),
      " Add sub"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        editing ? "Edit" : "New",
        " sub-category"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5", placeholder: "e.g. Electricity" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full", children: busy ? "Saving…" : "Save" }) })
      ] })
    ] })
  ] });
}
function ShopsManager() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [name, setName] = reactExports.useState("");
  const [opening, setOpening] = reactExports.useState("0");
  const [shopType, setShopType] = reactExports.useState("full_erp");
  const [busy, setBusy] = reactExports.useState(false);
  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      const { sortShops: sortShops2 } = await import("./router-KeVl8_Ln.mjs").then((n) => n.b2);
      return sortShops2(data ?? []);
    }
  });
  const addShop = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("shops").insert({
      name,
      opening_cash: Number(opening),
      shop_type: shopType,
      created_by: user.id
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Shop added");
      setName("");
      setOpening("0");
      setShopType("full_erp");
      qc.invalidateQueries({ queryKey: ["shops"] });
    }
  };
  const setType = async (id, t) => {
    const { error } = await supabase.from("shops").update({ shop_type: t }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Type updated");
      qc.invalidateQueries({ queryKey: ["shops"] });
    }
  };
  const deleteShop = async (id) => {
    if (!await confirm({ title: "Move shop to Recycle Bin?", description: "All entries linked to this shop stay archived. You can restore the shop anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    const { softDelete } = await import("./soft-delete-DQY0d6eC.mjs");
    const { error } = await softDelete("shops", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["shops"] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addShop, className: "grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Shop name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Main branch", className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening cash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: opening, onChange: (e) => setOpening(e.target.value), className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: shopType,
            onChange: (e) => setShopType(e.target.value),
            className: "mt-1.5 block h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full_erp", children: "Full ERP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "simple_cash", children: "Simple Cash" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "sm:self-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border/50 rounded-xl border border-border/40", children: [
      shops.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-6 text-center text-sm text-muted-foreground", children: "No shops yet." }),
      shops.map((s) => {
        const simple = s.shop_type === "simple_cash";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                simple ? "bg-amber-500/15 text-amber-600 dark:text-amber-300" : "bg-primary/15 text-primary"
              ), children: simple ? "Simple" : "ERP" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              "Opening · ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.opening_cash, size: "sm", bold: false })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: s.shop_type ?? "full_erp",
              onChange: (e) => setType(s.id, e.target.value),
              className: "h-8 rounded-md border border-input bg-transparent px-1.5 text-xs",
              "aria-label": "Shop type",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full_erp", children: "Full ERP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "simple_cash", children: "Simple Cash" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteShop(s.id), className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, s.id);
      })
    ] })
  ] });
}
const scanSlip = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  imageDataUrl: stringType().min(20).max(8e6),
  mimeType: stringType().default("image/jpeg")
}).parse(input)).handler(createSsrRpc("635847dbd120c7c098b3b27b6da65c9e9f3387591c623e37d97e33e1dc692cad"));
async function compressImage(file, maxEdge = 1024, quality = 0.72) {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob) return file;
    const name = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}
function fileToDataUrl(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });
}
function WithdrawSlipScan({ onApply }) {
  const run = useServerFn(scanSlip);
  const camRef = reactExports.useRef(null);
  const imgRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [attached, setAttached] = reactExports.useState(null);
  const [needsEdit, setNeedsEdit] = reactExports.useState(false);
  const [editAmount, setEditAmount] = reactExports.useState("");
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  async function onPick(e) {
    const raw = e.target.files?.[0];
    e.target.value = "";
    if (!raw) return;
    if (!raw.type.startsWith("image/")) {
      toast.error("Please select an image of the slip.");
      return;
    }
    setBusy(true);
    setNeedsEdit(false);
    const small = await compressImage(raw);
    setAttached({ name: small.name, size: small.size });
    setPendingFile(small);
    try {
      const dataUrl = await fileToDataUrl(small);
      const r = await run({
        data: { imageDataUrl: dataUrl, mimeType: small.type }
      });
      if (r?.fallback) {
        setNeedsEdit(true);
        setBusy(false);
        return;
      }
      const amtRaw = r.amount != null ? Number(r.amount) : NaN;
      const amt = Number.isFinite(amtRaw) ? Math.floor(amtRaw) : NaN;
      const who = (r.slip_type === "pos" ? r.merchant_name : r.bank_name) ?? r.bank_name ?? r.merchant_name ?? "";
      const note = r.slip_type === "pos" ? `POS Slip${who ? " - " + who : ""}` : `Cash Withdraw${who ? " - " + who : ""}`;
      if (Number.isFinite(amt) && amt > 0) {
        onApply({ amount: amt, date: r.date ?? null, note, file: small });
        toast.success("Slip scanned");
        setPendingFile(null);
      } else {
        setNeedsEdit(true);
      }
    } catch (err) {
      setNeedsEdit(true);
    } finally {
      setBusy(false);
    }
  }
  function applyManual() {
    if (!pendingFile) return;
    const amt = Math.floor(Number(editAmount));
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    onApply({ amount: amt, date: null, note: "Cash Withdraw", file: pendingFile });
    setPendingFile(null);
    setNeedsEdit(false);
    setEditAmount("");
    toast.success("Slip applied");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Scan Slip" }),
      !busy && attached && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto flex items-center gap-1 text-[10px] text-emerald-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
        "Attached"
      ] })
    ] }),
    busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-7 w-7 animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold tracking-tight text-foreground", children: "Scanning Slip…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Reading amount & bank" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy,
          onClick: () => camRef.current?.click(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "mr-1 h-4 w-4" }),
            " Camera"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy,
          onClick: () => imgRef.current?.click(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-1 h-4 w-4" }),
            " Upload"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: camRef, type: "file", accept: "image/*", capture: "environment", hidden: true, onChange: onPick }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: imgRef, type: "file", accept: "image/jpeg,image/png,image/webp", hidden: true, onChange: onPick }),
    needsEdit && pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 space-y-2 rounded-lg border border-amber-500/40 bg-amber-50/40 p-2 dark:bg-amber-950/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }),
        "Couldn't read amount — enter it manually"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "sr-only", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              inputMode: "numeric",
              step: "1",
              placeholder: "Amount (SAR)",
              value: editAmount,
              onChange: (e) => setEditAmount(e.target.value.replace(/\D/g, "")),
              className: "h-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", onClick: applyManual, children: "Apply" })
      ] })
    ] })
  ] });
}
function DuplicateWarningDialog({
  open,
  kind,
  existing,
  details,
  isAdmin,
  onConfirmOverride,
  onContinue,
  onViewExisting,
  onCancel
}) {
  const isHard = kind === "hard";
  const cancelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) {
      const t = setTimeout(() => cancelRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);
  const handleContinue = () => {
    if (isAdmin && onConfirmOverride) return onConfirmOverride();
    onContinue?.();
  };
  const titleText = isHard ? `Duplicate ${details?.entryType ?? "Entry"} Detected` : "Possible Duplicate Withdraw";
  const detailRows = [
    { label: "Date", value: details?.date },
    { label: "Shop", value: details?.shop },
    { label: "Cashier", value: details?.cashier },
    { label: "Amount", value: details?.amount }
  ].filter((r) => !!r.value);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) onCancel();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: cn(
        "max-w-md gap-0 overflow-hidden p-0 border-2",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-screen max-sm:max-w-none max-sm:rounded-none max-sm:border-0",
        isHard ? "border-destructive" : "border-amber-500"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-start gap-3 px-5 py-4 text-white",
              isHard ? "bg-destructive" : "bg-amber-500"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20", children: isHard ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold leading-tight", children: [
                  "⚠ ",
                  titleText.toUpperCase()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs opacity-90", children: isHard ? "Verify before creating another entry" : "Please verify before continuing" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onCancel,
                  className: "rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white",
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 px-5 py-5 max-sm:overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground", children: [
            "A ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
              details?.entryType ?? "matching",
              " entry"
            ] }),
            " already exists for this shop and date."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "Creating multiple ",
            details?.entryType?.toLowerCase() ?? "duplicate",
            " entries may cause incorrect financial calculations."
          ] }),
          detailRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Existing entry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1", children: detailRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contents", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: r.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-right font-medium", children: r.value })
            ] }, r.label)) })
          ] }),
          isHard && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-[11px] text-muted-foreground", children: "Admin override will be recorded in the audit log." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex flex-col-reverse gap-2 border-t border-border bg-muted/30 px-5 py-3 sm:flex-row sm:justify-end",
              "max-sm:sticky max-sm:bottom-0"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { ref: cancelRef, variant: "outline", size: "lg", className: "sm:size-default", onClick: onCancel, children: "Cancel" }),
              existing && onViewExisting && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "lg", className: "sm:size-default", onClick: onViewExisting, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1.5 h-4 w-4" }),
                " View Existing"
              ] }),
              (onContinue || onConfirmOverride) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "lg",
                  className: cn(
                    "sm:size-default text-white",
                    isHard ? "bg-destructive hover:bg-destructive/90" : "bg-amber-500 hover:bg-amber-600"
                  ),
                  onClick: handleContinue,
                  children: "Create Anyway"
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
const SHOP_KIND_MODULE = {
  sale: "Shop Sale",
  purchase: "Shop Purchase",
  expense: "Shop Expense",
  withdraw: "Shop Withdraw"
};
function shopEntryAmount(e) {
  const k = e?.entry_type;
  if (k === "sale") return (+e.pos_sale || 0) + (+e.cash_sale || 0) + (+e.bank_sale || 0) + (+e.credit_sale || 0);
  if (k === "purchase") return +e.purchase_amount || 0;
  if (k === "expense") return +e.expense_amount || 0;
  if (k === "withdraw") return +e.withdraw_amount || 0;
  return 0;
}
function sumRows(rows) {
  if (!rows || rows.length === 0) return null;
  const s = rows.reduce((a, r) => a + (Number.isFinite(Number(r.amount)) ? Number(r.amount) : 0), 0);
  return Math.round(s * 100) / 100;
}
const DRAFT_KEY = "shop_entry_draft_v1";
const LAST_SHOP_KEY = "shop_last_shop_v1";
function ShopPage() {
  useHighlightRecord();
  const {
    user
  } = useAuth();
  const {
    isAdmin
  } = useUserAccess();
  const qc = useQueryClient();
  const confirm = useConfirm();
  useServerFn(scanDocument);
  const search = Route$v.useSearch();
  const navigate = Route$v.useNavigate();
  const [detail, setDetail] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [scanViewer, setScanViewer] = reactExports.useState(null);
  const [importOpen, setImportOpen] = reactExports.useState(false);
  const [dateRange, setDateRange] = reactExports.useState("month");
  const [customFrom, setCustomFrom] = reactExports.useState("");
  const [customTo, setCustomTo] = reactExports.useState("");
  const [shopFilter, setShopFilter] = reactExports.useState("all");
  const [activeFilters, setActiveFilters] = reactExports.useState([]);
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [reportOpen, setReportOpen] = reactExports.useState(false);
  const [reportImageUrl, setReportImageUrl] = reactExports.useState(null);
  const [workspaceTool, setWorkspaceTool] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!search.highlight) return;
    if (search.date) {
      setDateRange("custom");
      setCustomFrom(search.date);
      setCustomTo(search.date);
    }
    if (search.shop) setShopFilter(search.shop);
  }, [search.highlight, search.date, search.shop]);
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops(data ?? []);
    },
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const {
    data: cashiers = []
  } = useQuery({
    queryKey: ["cashiers", "all"],
    queryFn: async () => (await supabase.from("cashiers").select("*").eq("is_deleted", false).order("name")).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const {
    data: entries = []
  } = useQuery({
    queryKey: ["shop_entries"],
    queryFn: async () => (await supabase.from("shop_entries").select("*").eq("is_deleted", false).order("txn_date", {
      ascending: false
    }).order("created_at", {
      ascending: false
    })).data ?? [],
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const refreshShopData = reactExports.useCallback(() => {
    qc.invalidateQueries({
      queryKey: ["shops"]
    });
    qc.invalidateQueries({
      queryKey: ["cashiers", "all"]
    });
    qc.invalidateQueries({
      queryKey: ["shop_entries"]
    });
    qc.invalidateQueries({
      queryKey: ["shop_entries", "all"]
    });
  }, [qc]);
  const {
    workingDate
  } = useWorkingDate();
  const today = workingDate;
  const [kind, setKind] = reactExports.useState("sale");
  const [date, setDate] = reactExports.useState(today);
  const [shopId, setShopId] = reactExports.useState("");
  const [cashierId, setCashierId] = reactExports.useState("");
  const [pos, setPos] = reactExports.useState("");
  const [cashSale, setCashSale] = reactExports.useState("");
  const [bankSale, setBankSale] = reactExports.useState("");
  const [creditSale, setCreditSale] = reactExports.useState("");
  const [dueReceivable, setDueReceivable] = reactExports.useState("");
  const [purchaseAmt, setPurchaseAmt] = reactExports.useState("");
  const [expenseAmt, setExpenseAmt] = reactExports.useState("");
  const [withdrawAmt, setWithdrawAmt] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [notesError, setNotesError] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [attachmentUrl, setAttachmentUrl] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [warning, setWarning] = reactExports.useState(null);
  const [ocrResult, setOcrResult] = reactExports.useState(null);
  const [ocrFile, setOcrFile] = reactExports.useState(null);
  const [ocrFilePreview, setOcrFilePreview] = reactExports.useState(null);
  const [ocrOriginalAmount, setOcrOriginalAmount] = reactExports.useState(null);
  const [ocrLinkedScanId, setOcrLinkedScanId] = reactExports.useState(null);
  const [ocrScanning, setOcrScanning] = reactExports.useState(false);
  const [ocrMismatchAck, setOcrMismatchAck] = reactExports.useState(false);
  const ocrCamRef = reactExports.useRef(null);
  const ocrImgRef = reactExports.useRef(null);
  const ocrPdfRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.kind) setKind(d.kind);
        if (d.date) setDate(d.date);
        if (d.shopId) setShopId(d.shopId);
        if (d.cashierId) setCashierId(d.cashierId);
        if (d.pos) setPos(d.pos);
        if (d.cashSale) setCashSale(d.cashSale);
        if (d.bankSale) setBankSale(d.bankSale);
        if (d.creditSale) setCreditSale(d.creditSale);
        if (d.purchaseAmt) setPurchaseAmt(d.purchaseAmt);
        if (d.expenseAmt) setExpenseAmt(d.expenseAmt);
        if (d.withdrawAmt) setWithdrawAmt(d.withdrawAmt);
        if (d.notes) setNotes(d.notes);
      } else {
        const last = localStorage.getItem(LAST_SHOP_KEY);
        if (last) setShopId(last);
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    if (!search.edit || entries.length === 0) return;
    const target = entries.find((e) => e.id === search.edit);
    if (target) {
      loadEditing(target);
      navigate({
        search: {},
        replace: true
      });
    }
  }, [search.edit, entries]);
  reactExports.useEffect(() => {
    if (!search.detail || entries.length === 0) return;
    const target = entries.find((e) => e.id === search.detail);
    if (target) {
      setDetail(target);
      navigate({
        search: {},
        replace: true
      });
    }
  }, [search.detail, entries]);
  reactExports.useEffect(() => {
    if (editing) return;
    const draft = {
      kind,
      date,
      shopId,
      cashierId,
      pos,
      cashSale,
      bankSale,
      creditSale,
      purchaseAmt,
      expenseAmt,
      withdrawAmt,
      notes
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
    }
  }, [editing, kind, date, shopId, cashierId, pos, cashSale, bankSale, creditSale, purchaseAmt, expenseAmt, withdrawAmt, notes]);
  reactExports.useEffect(() => {
    if (!shopId && shops.length > 0) setShopId(shops[0].id);
  }, [shops, shopId]);
  const filteredCashiers = reactExports.useMemo(() => cashiers.filter((c) => c.shop_id === shopId), [cashiers, shopId]);
  reactExports.useEffect(() => {
    if (cashierId && !filteredCashiers.some((c) => c.id === cashierId)) setCashierId("");
  }, [filteredCashiers, cashierId]);
  const currentShop = shops.find((s) => s.id === shopId) ?? null;
  const simpleMode = isSimpleShop(currentShop);
  reactExports.useEffect(() => {
    if (simpleMode && kind !== "sale" && kind !== "expense") setKind("sale");
  }, [simpleMode, kind]);
  const num = (s) => Number(s) || 0;
  const totalSale = num(cashSale) + num(bankSale) + num(creditSale) - num(dueReceivable);
  const difference = totalSale - num(pos);
  const resetForm = (keepShop = true) => {
    setEditing(null);
    setKind("sale");
    setDate(today);
    if (!keepShop) setShopId("");
    setCashierId("");
    setPos("");
    setCashSale("");
    setBankSale("");
    setCreditSale("");
    setDueReceivable("");
    setPurchaseAmt("");
    setExpenseAmt("");
    setWithdrawAmt("");
    setNotes("");
    setFile(null);
    setAttachmentUrl(null);
    resetOcr();
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
    }
  };
  const resetOcr = () => {
    setOcrResult(null);
    setOcrFile(null);
    setOcrFilePreview(null);
    setOcrOriginalAmount(null);
    setOcrLinkedScanId(null);
    setOcrScanning(false);
    setOcrMismatchAck(false);
  };
  const loadEditing = (e) => {
    setEditing(e);
    setKind(e.entry_type);
    setDate(e.txn_date);
    setShopId(e.shop_id);
    setCashierId(e.cashier_id ?? "");
    setPos(e.pos_sale ? String(e.pos_sale) : "");
    setCashSale(e.cash_sale ? String(e.cash_sale) : "");
    setBankSale(e.bank_sale ? String(e.bank_sale) : "");
    setCreditSale(e.credit_sale ? String(e.credit_sale) : "");
    setDueReceivable(e.due_receivable ? String(e.due_receivable) : "");
    setPurchaseAmt(e.purchase_amount ? String(e.purchase_amount) : "");
    setExpenseAmt(e.expense_amount ? String(e.expense_amount) : "");
    setWithdrawAmt(e.withdraw_amount ? String(e.withdraw_amount) : "");
    setNotes(e.notes ?? "");
    setAttachmentUrl(e.attachment_url ?? null);
    setFile(null);
    setDetail(null);
    resetOcr();
    setOcrLinkedScanId(e.ocr_scan_id ?? null);
    setOcrOriginalAmount(e.ocr_original_amount ?? null);
    setFormOpen(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  const fileToDataUrl2 = (f) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(f);
  });
  const handleOcrFile = async (f) => {
    if (f.type === "application/pdf") {
      toast.error("PDF preview not supported here. Upload a page screenshot.");
      return;
    }
    setOcrFile(f);
    setOcrFilePreview(URL.createObjectURL(f));
    setOcrResult(null);
    setOcrLinkedScanId(null);
    setOcrOriginalAmount(null);
    setOcrScanning(true);
    setOcrMismatchAck(false);
    try {
      const dataUrl = await fileToDataUrl2(f);
      const r = await scanDocumentCached({
        imageDataUrl: dataUrl,
        mimeType: f.type
      });
      setOcrResult(r);
      const detected = r.grand_total ?? r.cash_buy_total ?? r.due_buy_total ?? null;
      const calc = sumRows(r.rows);
      const lowConf = r.confidence === "low" || r.field_confidence?.totals === "low";
      const diff = detected != null && calc != null ? Math.abs(calc - detected) : 0;
      const preferCalc = calc != null && (detected == null || lowConf || diff > 1);
      const chosen = preferCalc ? calc : detected;
      if (chosen != null) {
        setPurchaseAmt(String(chosen));
        setOcrOriginalAmount(detected != null ? Number(detected) : Number(chosen));
      }
      if (r.date) setDate(r.date);
      toast.success(preferCalc && detected != null ? `Used calculated sum (SAR ${calc}) — OCR total differed by ${diff}` : "Scan complete — fields auto-filled");
    } catch (err) {
      toast.error(err?.message ?? "Scan failed");
      setOcrResult(null);
    } finally {
      setOcrScanning(false);
    }
  };
  const logWarning = reactExports.useCallback(async (params) => {
    if (!user) return;
    const shop = shops.find((s) => s.id === shopId);
    try {
      await supabase.from("entry_warning_log").insert({
        user_id: user.id,
        user_name: user.user_metadata?.full_name ?? user.email ?? null,
        shop_id: shopId || null,
        shop_name: shop?.name ?? null,
        transaction_type: kind,
        warning_type: params.warningType,
        action_taken: params.actionTaken,
        existing_entry_id: params.existingEntryId ?? null,
        txn_date: date,
        cashier_id: cashierId || null,
        amount: params.amount ?? null,
        meta: {
          editing_id: editing?.id ?? null
        }
      });
    } catch {
    }
  }, [user, shops, shopId, kind, date, cashierId, editing]);
  const findDuplicate = reactExports.useCallback(() => {
    if (!shopId) return null;
    const excludeId = editing?.id;
    const shopName = shops.find((s) => s.id === shopId)?.name ?? "—";
    if (kind === "sale") {
      if (!cashierId) return null;
      const hit = entries.find((e) => e.id !== excludeId && !e.is_deleted && e.shop_id === shopId && e.txn_date === date && e.cashier_id === cashierId && e.entry_type === "sale");
      if (hit) {
        const cName = cashiers.find((c) => c.id === cashierId)?.name ?? "—";
        const amt = Number(hit.cash_sale || 0) + Number(hit.bank_sale || 0) + Number(hit.credit_sale || 0) + Number(hit.pos_sale || 0);
        return {
          kind: "hard",
          existing: {
            id: hit.id,
            label: `Sale · ${cName} · ${date}`
          },
          details: {
            entryType: "Sale",
            date,
            shop: shopName,
            cashier: cName,
            amount: SAR(amt)
          }
        };
      }
    }
    if (kind === "purchase") {
      const hit = entries.find((e) => e.id !== excludeId && !e.is_deleted && e.shop_id === shopId && e.txn_date === date && e.entry_type === "purchase");
      if (hit) {
        const cName = hit.cashier_id ? cashiers.find((c) => c.id === hit.cashier_id)?.name ?? void 0 : void 0;
        const amt = Number(hit.purchase_amount || 0);
        return {
          kind: "hard",
          existing: {
            id: hit.id,
            label: `Purchase · ${shopName} · ${date}`
          },
          details: {
            entryType: "Purchase",
            date,
            shop: shopName,
            cashier: cName,
            amount: SAR(amt)
          }
        };
      }
    }
    if (kind === "withdraw") {
      const amount = num(withdrawAmt);
      if (amount <= 0) return null;
      const hit = entries.find((e) => e.id !== excludeId && !e.is_deleted && e.entry_type === "withdraw" && e.txn_date === date && Number(e.withdraw_amount ?? 0) === amount);
      if (hit) {
        return {
          kind: "soft",
          existing: {
            id: hit.id,
            label: `Withdraw · ${SAR(amount)} · ${date}`
          },
          details: {
            entryType: "Withdraw",
            date,
            shop: shopName,
            amount: SAR(amount)
          }
        };
      }
    }
    return null;
  }, [shopId, editing, kind, cashierId, date, entries, cashiers, shops, withdrawAmt]);
  const performSave = async () => {
    if (!user || !shopId) return;
    setBusy(true);
    let url = attachmentUrl;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/shop/${Date.now()}.${ext}`;
      const up = await supabase.storage.from("attachments").upload(path, file);
      if (up.error) {
        setBusy(false);
        return toast.error(up.error.message);
      }
      url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
    }
    let scanId = ocrLinkedScanId;
    if (kind === "purchase" && ocrResult && !scanId) {
      let scanFileUrl = null;
      if (ocrFile) {
        const ext = ocrFile.name.split(".").pop();
        const path = `${user.id}/ai-scan/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, ocrFile);
        if (!up.error) {
          scanFileUrl = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
        }
      }
      const ins = await supabase.from("ai_scans").insert({
        file_url: scanFileUrl,
        file_type: ocrFile?.type ?? null,
        raw_text: ocrResult.raw_text ?? null,
        extracted: ocrResult,
        status: "shop"
      }).select("id").single();
      if (!ins.error) scanId = ins.data?.id ?? null;
    }
    const payload = {
      txn_date: date,
      shop_id: shopId,
      cashier_id: cashierId || null,
      entry_type: kind,
      pos_sale: kind === "sale" ? num(pos) : 0,
      cash_sale: kind === "sale" ? num(cashSale) : 0,
      bank_sale: kind === "sale" ? num(bankSale) : 0,
      credit_sale: kind === "sale" ? num(creditSale) : 0,
      due_receivable: kind === "sale" ? num(dueReceivable) : 0,
      difference: kind === "sale" ? difference : 0,
      purchase_amount: kind === "purchase" ? num(purchaseAmt) : 0,
      expense_amount: kind === "expense" ? num(expenseAmt) : 0,
      withdraw_amount: kind === "withdraw" ? num(withdrawAmt) : 0,
      notes: notes || null,
      attachment_url: url,
      ocr_scan_id: kind === "purchase" ? scanId : null,
      ocr_original_amount: kind === "purchase" ? ocrOriginalAmount : null,
      ocr_confidence: kind === "purchase" ? ocrResult?.confidence ?? null : null
    };
    const res = editing ? await supabase.from("shop_entries").update(payload).eq("id", editing.id).select().single() : await supabase.from("shop_entries").insert({
      ...payload,
      created_by: user.id
    }).select().single();
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Saved");
    try {
      localStorage.setItem(LAST_SHOP_KEY, shopId);
    } catch {
    }
    const saved = res.data;
    if (saved) {
      const apply = (old = []) => {
        if (editing) return old.map((e) => e.id === saved.id ? {
          ...e,
          ...saved
        } : e);
        return [saved, ...old];
      };
      qc.setQueryData(["shop_entries"], apply);
      qc.setQueryData(["shop_entries", "all"], apply);
    }
    resetForm(true);
    setFormOpen(false);
    try {
      const shopName = shops.find((s) => s.id === shopId)?.name || null;
      sendAuditEmail({
        action: editing ? "edited" : "created",
        module: SHOP_KIND_MODULE[kind] || "Other",
        shopName,
        userName: user?.email || null,
        userEmail: user?.email || null,
        recordId: saved?.id ?? editing?.id ?? null,
        oldValues: editing ? editing : null,
        newValues: saved,
        notes: notes || null,
        amount: shopEntryAmount(saved || payload)
      });
    } catch (e) {
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Not signed in");
    if (!shopId) return toast.error("Select a shop");
    if (kind === "sale" && num(pos) + num(cashSale) + num(bankSale) + num(creditSale) <= 0) return toast.error("Enter sale amounts");
    if (kind === "purchase" && num(purchaseAmt) <= 0) return toast.error("Enter purchase amount");
    if (kind === "expense" && num(expenseAmt) <= 0) return toast.error("Enter expense amount");
    if (kind === "withdraw" && num(withdrawAmt) <= 0) return toast.error("Enter withdraw amount");
    if ((kind === "purchase" || kind === "expense" || kind === "withdraw") && !notes.trim()) {
      setNotesError("Notes is required.");
      return toast.error("Notes is required.");
    }
    if (kind === "purchase" && ocrResult) {
      const calc = sumRows(ocrResult.rows);
      const ocrTotal = ocrOriginalAmount;
      if (calc != null && ocrTotal != null && Math.abs(calc - ocrTotal) > 1 && !ocrMismatchAck) {
        return toast.error("OCR total doesn't match line-item sum — review and confirm the comparison card.");
      }
    }
    const dup = findDuplicate();
    if (dup) {
      const amount = kind === "withdraw" ? num(withdrawAmt) : kind === "sale" ? num(pos) + num(cashSale) + num(bankSale) + num(creditSale) : kind === "purchase" ? num(purchaseAmt) : 0;
      void logWarning({
        warningType: dup.kind === "hard" ? "Hard Warning" : "Soft Warning",
        actionTaken: "Shown",
        existingEntryId: dup.existing.id,
        amount
      });
      setWarning(dup);
      return;
    }
    await performSave();
  };
  const remove = async (id) => {
    if (!await confirm({
      title: "Move entry to Recycle Bin?",
      description: "Linked transactions will be reversed. You can restore this from the Recycle Bin.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning"
    })) return;
    const existing = (qc.getQueryData(["shop_entries"]) || qc.getQueryData(["shop_entries", "all"]) || []).find((e) => e.id === id);
    const {
      softDelete
    } = await import("./soft-delete-DQY0d6eC.mjs");
    const {
      error
    } = await softDelete("shop_entries", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      const apply = (old = []) => old.filter((e) => e.id !== id);
      qc.setQueryData(["shop_entries"], apply);
      qc.setQueryData(["shop_entries", "all"], apply);
      setDetail(null);
      try {
        const k = existing?.entry_type;
        sendAuditEmail({
          action: "deleted",
          module: SHOP_KIND_MODULE[k] || "Other",
          shopName: shops.find((s) => s.id === existing?.shop_id)?.name || null,
          userName: user?.email || null,
          userEmail: user?.email || null,
          recordId: id,
          oldValues: existing || {
            id
          },
          notes: existing?.notes || null,
          amount: existing ? shopEntryAmount(existing) : null
        });
      } catch (e) {
      }
    }
  };
  const dateRangeBounds = reactExports.useMemo(() => {
    const [yy, mm, dd] = workingDate.split("-").map(Number);
    const anchor = new Date(yy, (mm || 1) - 1, dd || 1);
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const d = anchor.getDate();
    const fmt2 = (dt) => {
      const a = dt.getFullYear();
      const b = String(dt.getMonth() + 1).padStart(2, "0");
      const c = String(dt.getDate()).padStart(2, "0");
      return `${a}-${b}-${c}`;
    };
    if (dateRange === "today") {
      const s = fmt2(new Date(y, m, d));
      return {
        from: s,
        to: s
      };
    }
    if (dateRange === "yesterday") {
      const s = fmt2(new Date(y, m, d - 1));
      return {
        from: s,
        to: s
      };
    }
    if (dateRange === "week") {
      const start = new Date(y, m, d - 6);
      return {
        from: fmt2(start),
        to: fmt2(new Date(y, m, d))
      };
    }
    if (dateRange === "month") {
      const start = new Date(y, m, 1);
      return {
        from: fmt2(start),
        to: fmt2(new Date(y, m, d))
      };
    }
    return {
      from: customFrom || "",
      to: customTo || ""
    };
  }, [dateRange, customFrom, customTo, workingDate]);
  const filteredEntries = reactExports.useMemo(() => {
    return entries.filter((e) => {
      if (shopFilter !== "all" && e.shop_id !== shopFilter) return false;
      const {
        from,
        to
      } = dateRangeBounds;
      if (from && e.txn_date < from) return false;
      if (to && e.txn_date > to) return false;
      if (activeFilters.length === 0) return true;
      return activeFilters.some((f) => {
        switch (f) {
          case "pos_sale":
            return e.entry_type === "sale" && Number(e.pos_sale) > 0;
          case "cash_sale":
            return e.entry_type === "sale" && Number(e.cash_sale) > 0;
          case "bank_sale":
            return e.entry_type === "sale" && Number(e.bank_sale) > 0;
          case "credit_sale":
            return e.entry_type === "sale" && Number(e.credit_sale) > 0;
          case "difference":
            return e.entry_type === "sale" && Number(e.difference) !== 0;
          case "purchase":
            return e.entry_type === "purchase";
          case "expense":
            return e.entry_type === "expense";
          case "withdraw":
            return e.entry_type === "withdraw";
          default:
            return true;
        }
      });
    }).sort((a, b) => {
      if (a.txn_date !== b.txn_date) return b.txn_date.localeCompare(a.txn_date);
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [entries, shopFilter, dateRangeBounds, activeFilters]);
  const filterTotal = reactExports.useMemo(() => {
    const sumField = (field) => filteredEntries.reduce((s, e) => s + (Number(e[field]) || 0), 0);
    if (activeFilters.length === 0) {
      const cash = sumField("cash_sale"), bank = sumField("bank_sale"), credit = sumField("credit_sale");
      const wd = sumField("withdraw_amount"), pu = sumField("purchase_amount"), ex = sumField("expense_amount");
      const v = cash + bank + credit + wd - pu - ex;
      return {
        label: "Net Total (All Entries)",
        value: v,
        tone: v < 0 ? "danger" : "success"
      };
    }
    const parts = [];
    let value = 0;
    let tone = "default";
    for (const f of activeFilters) {
      switch (f) {
        case "pos_sale":
          parts.push("POS Sale");
          value += sumField("pos_sale");
          tone = "default";
          break;
        case "cash_sale":
          parts.push("Cash Sale");
          value += sumField("cash_sale");
          tone = "success";
          break;
        case "bank_sale":
          parts.push("Bank Sale");
          value += sumField("bank_sale");
          tone = "info";
          break;
        case "credit_sale":
          parts.push("Credit Sale");
          value += sumField("credit_sale");
          tone = "warning";
          break;
        case "purchase":
          parts.push("Purchase");
          value += sumField("purchase_amount");
          tone = "warning";
          break;
        case "expense":
          parts.push("Expense");
          value += sumField("expense_amount");
          tone = "danger";
          break;
        case "withdraw":
          parts.push("Withdraw");
          value += sumField("withdraw_amount");
          tone = "info";
          break;
        case "difference": {
          const v = sumField("difference");
          parts.push("Plus / Minus");
          value += v;
          tone = v < 0 ? "danger" : "success";
          break;
        }
      }
    }
    return {
      label: `${parts.join(" + ")} Total`,
      value,
      tone
    };
  }, [filteredEntries, activeFilters]);
  const dateRangeLabel = reactExports.useMemo(() => {
    if (dateRange === "today") return "Today";
    if (dateRange === "yesterday") return "Yesterday";
    if (dateRange === "week") return "Last 7 Days";
    if (dateRange === "month") return "This Month";
    const {
      from,
      to
    } = dateRangeBounds;
    if (from && to) return `${from} → ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return "Custom";
  }, [dateRange, dateRangeBounds]);
  const perShop = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const seedShops = shopFilter === "all" ? shops : shops.filter((s) => s.id === shopFilter);
    for (const s of seedShops) {
      map.set(s.id, {
        shop_id: s.id,
        shop_name: s.name,
        simple: isSimpleShop(s),
        sale: 0,
        purchase: 0,
        cash: 0,
        bank: 0,
        credit: 0,
        diff: 0,
        withdraw: 0,
        cashIn: 0,
        expense: 0
      });
    }
    for (const e of filteredEntries) {
      const k = e.shop_id;
      if (!map.has(k)) {
        const s = shops.find((x) => x.id === k);
        map.set(k, {
          shop_id: k,
          shop_name: s?.name ?? "—",
          simple: isSimpleShop(s),
          sale: 0,
          purchase: 0,
          cash: 0,
          bank: 0,
          credit: 0,
          diff: 0,
          withdraw: 0,
          cashIn: 0,
          expense: 0
        });
      }
      const row = map.get(k);
      row.sale += Number(e.pos_sale) || 0;
      row.purchase += Number(e.purchase_amount) || 0;
      row.cash += Number(e.cash_sale) || 0;
      row.bank += Number(e.bank_sale) || 0;
      row.credit += Number(e.credit_sale) || 0;
      row.diff += Number(e.difference) || 0;
      row.withdraw += Number(e.withdraw_amount) || 0;
      if (e.entry_type === "sale") row.cashIn += Number(e.cash_sale) || 0;
      if (e.entry_type === "expense") row.expense += Number(e.expense_amount) || 0;
    }
    return Array.from(map.values());
  }, [filteredEntries, shops, shopFilter]);
  const {
    byId: masterPositions,
    totalsById: masterTotals
  } = useShopPositions(dateRangeBounds);
  const shopCardSummaries = reactExports.useMemo(() => {
    const {
      from,
      to
    } = dateRangeBounds;
    const byShop = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      if (from && entry.txn_date < from) continue;
      if (to && entry.txn_date > to) continue;
      const list = byShop.get(entry.shop_id) ?? [];
      list.push(entry);
      byShop.set(entry.shop_id, list);
    }
    return shops.map((shop) => {
      const rowEntries = byShop.get(shop.id) ?? [];
      const simple = isSimpleShop(shop);
      let primary = 0, secondary = 0;
      let lastDate = null;
      let cashTot = 0, bankTot = 0, withdrawTot = 0, purchaseTot = 0, expenseTot = 0;
      for (const e of rowEntries) {
        if (!lastDate || e.txn_date > lastDate) lastDate = e.txn_date;
        if (simple) {
          if (e.entry_type === "sale") primary += Number(e.cash_sale) || 0;
          if (e.entry_type === "expense") secondary += Number(e.expense_amount) || 0;
        } else {
          cashTot += Number(e.cash_sale) || 0;
          bankTot += Number(e.bank_sale) || 0;
          withdrawTot += Number(e.withdraw_amount) || 0;
          purchaseTot += Number(e.purchase_amount) || 0;
          expenseTot += Number(e.expense_amount) || 0;
        }
      }
      const masterTotalsForShop = masterTotals.get(shop.id);
      if (masterTotalsForShop) {
        cashTot = simple ? masterTotalsForShop.cashIn : masterTotalsForShop.cashSale;
        withdrawTot = simple ? 0 : masterTotalsForShop.bankWithdraw;
        purchaseTot = simple ? 0 : masterTotalsForShop.purchase;
        expenseTot = simple ? masterTotalsForShop.simpleExpense : masterTotalsForShop.expense;
        primary = simple ? masterTotalsForShop.cashIn : primary;
        secondary = simple ? masterTotalsForShop.simpleExpense : secondary;
      }
      const cashPosition = simple ? masterTotalsForShop?.position ?? primary - secondary : masterPositions.get(shop.id) ?? cashTot + withdrawTot - (purchaseTot + expenseTot);
      const master = masterPositions.get(shop.id) ?? 0;
      assertShopPositionMatch(shop.id, cashPosition, master, "shop-card");
      return {
        shop,
        simple,
        balance: primary - secondary,
        primary,
        secondary,
        cashPosition,
        expectedBank: bankTot - withdrawTot,
        cashTot,
        bankTot,
        withdrawTot,
        purchaseTot,
        expenseTot,
        lastDate
      };
    });
  }, [entries, shops, dateRangeBounds, masterPositions, masterTotals]);
  const [visibleCount, setVisibleCount] = reactExports.useState(20);
  reactExports.useEffect(() => {
    setVisibleCount(20);
  }, [shopFilter, dateRangeBounds.from, dateRangeBounds.to, activeFilters]);
  const visibleEntries = reactExports.useMemo(() => filteredEntries.slice(0, visibleCount), [filteredEntries, visibleCount]);
  const shopNamesById = reactExports.useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);
  const openDetail = reactExports.useCallback((entry) => {
    setFormOpen(false);
    setScanViewer(null);
    setDetail(entry);
  }, []);
  const openScanViewer = reactExports.useCallback((scanId) => {
    setDetail(null);
    setScanViewer({
      scanId
    });
  }, []);
  const buildReportInput = () => {
    const rows = perShop.map((r) => {
      const totalSale2 = (Number(r.sale) || 0) + (Number(r.cash) || 0) + (Number(r.bank) || 0) + (Number(r.credit) || 0);
      return {
        shop_id: r.shop_id,
        shop_name: r.shop_name,
        simple: !!r.simple,
        pos: Number(r.sale) || 0,
        cash: Number(r.cash) || 0,
        bank: Number(r.bank) || 0,
        credit: Number(r.credit) || 0,
        totalSale: totalSale2,
        purchase: Number(r.purchase) || 0,
        expense: Number(r.expense) || 0,
        withdraw: Number(r.withdraw) || 0,
        diff: Number(r.diff) || 0
      };
    });
    const scopeLabel = shopFilter === "all" ? "All Shops" : shops.find((s) => s.id === shopFilter)?.name ?? "Shop";
    return {
      title: `${scopeLabel} · ${dateRangeLabel}`,
      rangeLabel: dateRangeLabel,
      scopeLabel,
      rows
    };
  };
  const openReport = async () => {
    setReportOpen(true);
    setReportImageUrl(null);
    try {
      const blob = await buildShopReportImage(buildReportInput());
      const url = URL.createObjectURL(blob);
      setReportImageUrl(url);
    } catch (e) {
      console.error(e);
      toast.error("Failed to render report image");
    }
  };
  reactExports.useEffect(() => {
    return () => {
      if (reportImageUrl) URL.revokeObjectURL(reportImageUrl);
    };
  }, [reportImageUrl]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-[11px] font-medium text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shops" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground/80", children: [
          "· ",
          shops.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Shop actions", className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-foreground shadow-sm transition-all hover:bg-muted/60 active:scale-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", sideOffset: 8, className: "w-60 rounded-2xl border-border/60 bg-background p-1.5 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setFormOpen(true), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" }),
            " New Entry"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground", children: "Shop Tools" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setWorkspaceTool("shops"), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-muted-foreground" }),
            " Manage Shops"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setWorkspaceTool("cashiers"), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-muted-foreground" }),
            " Cashiers"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setWorkspaceTool("categories"), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-muted-foreground" }),
            " Categories"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setImportOpen(true), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-muted-foreground" }),
            " Import Sales"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: openReport, className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-muted-foreground" }),
            " Generate Report"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "my-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => downloadShopReportExcel(buildReportInput()), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4 text-muted-foreground" }),
            " Export Excel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => printShopReportPDF(buildReportInput()), className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }),
            " Export PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: async () => {
            const r = await shareShopReportWhatsApp(buildReportInput());
            if (r.kind === "fallback-link") toast.success("WhatsApp opened — image saved separately if needed");
          }, className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 text-muted-foreground" }),
            " Share Report"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: workspaceTool !== null, onOpenChange: (o) => !o && setWorkspaceTool(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "rounded-t-3xl border-t border-border/60 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/40 bg-background px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold", children: workspaceTool === "shops" ? "Manage Shops" : workspaceTool === "cashiers" ? "Cashiers" : workspaceTool === "categories" ? "Categories" : "" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5", children: [
        workspaceTool === "shops" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShopsManager, {}),
        workspaceTool === "cashiers" && /* @__PURE__ */ jsxRuntimeExports.jsx(CashierManager, {}),
        workspaceTool === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryManager, {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: reportOpen, onOpenChange: (o) => {
      setReportOpen(o);
      if (!o) setReportImageUrl(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto rounded-3xl border-border/60 bg-gradient-to-b from-card to-background p-0 sm:max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border/60 px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          "Shop Report Preview"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          shopFilter === "all" ? "All Shops" : shops.find((s) => s.id === shopFilter)?.name ?? "Shop",
          " · ",
          dateRangeLabel
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 px-5 py-5", children: [
        (() => {
          const t = totalsOf(buildReportInput().rows);
          const cards = [{
            l: "POS Sale",
            v: t.pos
          }, {
            l: "Cash Sale",
            v: t.cash
          }, {
            l: "Bank Sale",
            v: t.bank
          }, {
            l: "Credit Sale",
            v: t.credit
          }, {
            l: "Total Sale",
            v: t.totalSale
          }, {
            l: "Purchase",
            v: t.purchase
          }, {
            l: "Expense",
            v: t.expense
          }, {
            l: "Withdraw",
            v: t.withdraw
          }, {
            l: "Plus / Minus",
            v: t.diff,
            color: t.diff >= 0 ? "text-emerald-500" : "text-rose-500"
          }];
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 md:grid-cols-3", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: c.l }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-1", c.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: c.v, size: "md" }) })
          ] }, c.l)) });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-muted/20 p-2", children: reportImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: reportImageUrl, alt: "Report preview", className: "w-full rounded-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-40 items-center justify-center text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          " Rendering premium report…"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => printShopReportPDF(buildReportInput()), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
            " PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => downloadShopReportImage(buildReportInput()), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImageDown, { className: "h-4 w-4" }),
            " Image"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => downloadShopReportExcel(buildReportInput()), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "h-4 w-4" }),
            " Excel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", size: "sm", onClick: async () => {
            const r = await shareShopReportWhatsApp(buildReportInput());
            if (r.kind === "fallback-link") toast.success("WhatsApp opened");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
            " Share"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopImportDialog, { open: importOpen, onOpenChange: setImportOpen, shops, cashiers, existingEntries: entries }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [{
      k: "today",
      l: "Today"
    }, {
      k: "yesterday",
      l: "Yesterday"
    }, {
      k: "week",
      l: "Weekly"
    }, {
      k: "month",
      l: "Monthly"
    }, {
      k: "custom",
      l: "Custom"
    }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDateRange(opt.k), className: cn("shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95", dateRange === opt.k ? "bg-primary text-primary-foreground shadow-[0_0_18px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]" : "border border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"), children: opt.l }, opt.k)) }),
    dateRange === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customFrom, onChange: (e) => setCustomFrom(e.target.value), className: "mt-1 h-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: customTo, onChange: (e) => setCustomTo(e.target.value), className: "mt-1 h-9" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground", children: "Per-shop summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: refreshShopData, className: "flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted active:scale-95", "aria-label": "Refresh shop summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
        "Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: shopCardSummaries.map((summary) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShopSummaryCard, { summary, active: shopFilter === summary.shop.id, onToggle: () => {
      setShopFilter(shopFilter === summary.shop.id ? "all" : summary.shop.id);
      refreshShopData();
    } }, summary.shop.id)) }),
    shopFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex animate-fade-in items-center justify-between rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: shops.find((s) => s.id === shopFilter)?.name ?? "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[9px]", children: dateRangeLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShopFilter("all"), className: "rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground", "aria-label": "Clear shop filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: shopFilter === "all" ? "All Shops · Recent Entries" : `${shops.find((s) => s.id === shopFilter)?.name ?? "Shop"} · Recent Entries` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: filteredEntries.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-muted/20 px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [{
        k: "all",
        l: "All"
      }, {
        k: "pos_sale",
        l: "POS Sale"
      }, {
        k: "cash_sale",
        l: "Cash Sale"
      }, {
        k: "bank_sale",
        l: "Bank Sale"
      }, {
        k: "credit_sale",
        l: "Credit Sale"
      }, {
        k: "purchase",
        l: "Purchase"
      }, {
        k: "expense",
        l: "Expense"
      }, {
        k: "withdraw",
        l: "Withdraw"
      }, {
        k: "difference",
        l: "Plus/Minus"
      }].map((opt) => {
        const on = opt.k === "all" ? activeFilters.length === 0 : activeFilters.includes(opt.k);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          if (opt.k === "all") setActiveFilters([]);
          else {
            setActiveFilters((prev) => prev.includes(opt.k) ? prev.filter((f) => f !== opt.k) : [...prev, opt.k]);
          }
        }, className: cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all active:scale-95", on ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]" : "border border-border/70 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"), children: opt.l }, opt.k);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80", children: filterTotal.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
            dateRangeLabel,
            " · ",
            filteredEntries.length,
            " ",
            filteredEntries.length === 1 ? "entry" : "entries"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-scale-in tabular-nums", filterTotal.tone === "success" && "text-success", filterTotal.tone === "danger" && "text-destructive", filterTotal.tone === "info" && "text-primary", filterTotal.tone === "warning" && "text-warning"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: filterTotal.value, size: "lg" }) }, `${activeFilters.join("-")}-${filterTotal.value}`)
      ] }) }),
      filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-8 text-center text-sm text-muted-foreground", children: "No entries for this filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: visibleEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(ShopEntryRow, { entry, shopName: shopNamesById.get(entry.shop_id) ?? "—", activeFilters, onOpen: openDetail, onOpenScan: openScanViewer }, entry.id)) }),
        filteredEntries.length > visibleEntries.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setVisibleCount((c) => c + 20), className: "inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]", children: [
          "Load More (",
          filteredEntries.length - visibleEntries.length,
          " remaining)"
        ] }) })
      ] })
    ] }),
    detail && /* @__PURE__ */ jsxRuntimeExports.jsx(EntryDetail, { entry: detail, shops, cashiers, onClose: () => setDetail(null), onEdit: loadEditing, onDelete: remove, onViewScan: openScanViewer }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScanDetailDialog, { open: !!scanViewer, scanId: scanViewer?.scanId, live: scanViewer?.live, onClose: () => setScanViewer(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopFab, { onPick: (k) => {
      if (editing) resetForm(true);
      setKind(k);
      setFormOpen(true);
    }, allowAll: !simpleMode }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DuplicateWarningDialog, { open: !!warning, kind: warning?.kind ?? "hard", existing: warning?.existing ?? null, details: warning?.details ?? null, isAdmin, onCancel: () => {
      if (warning) void logWarning({
        warningType: warning.kind === "hard" ? "Hard Warning" : "Soft Warning",
        actionTaken: "Cancelled",
        existingEntryId: warning.existing?.id
      });
      setWarning(null);
    }, onViewExisting: () => {
      const id = warning?.existing?.id;
      if (!id) return;
      void logWarning({
        warningType: warning.kind === "hard" ? "Hard Warning" : "Soft Warning",
        actionTaken: "Viewed existing",
        existingEntryId: id
      });
      setWarning(null);
      setFormOpen(false);
      const target = entries.find((e) => e.id === id);
      if (target) setDetail(target);
    }, onContinue: async () => {
      if (warning) void logWarning({
        warningType: warning.kind === "hard" ? isAdmin ? "Admin Override" : "Hard Warning" : "Soft Warning",
        actionTaken: warning.kind === "hard" && isAdmin ? "Overrode block & saved" : "Continued save",
        existingEntryId: warning.existing?.id
      });
      setWarning(null);
      await performSave();
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: formOpen, onOpenChange: (o) => {
      if (!o && editing) resetForm(true);
      setFormOpen(o);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl border-t bg-background p-0 sm:max-w-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 px-5 pb-3 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold tracking-tight", children: editing ? "Edit Entry" : "New Entry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: currentShop?.name ?? "Select a shop" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "flex min-h-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 pb-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Shop" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: shopId, onValueChange: setShopId, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select shop" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id)) })
              ] })
            ] })
          ] }),
          simpleMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "sale", onClick: () => setKind("sale"), icon: Banknote, label: "Cash In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "expense", onClick: () => setKind("expense"), icon: FileText, label: "Expense" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "sale", onClick: () => setKind("sale"), icon: ShoppingCart, label: "Sale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "purchase", onClick: () => setKind("purchase"), icon: Package, label: "Purchase" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "expense", onClick: () => setKind("expense"), icon: FileText, label: "Expense" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindTab, { active: kind === "withdraw", onClick: () => setKind("withdraw"), icon: Banknote, label: "Withdraw" })
          ] }),
          kind === "sale" && simpleMode && /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Cash In", value: cashSale, onChange: setCashSale, big: true }),
          kind === "sale" && !simpleMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Cashier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: cashierId || "__none", onValueChange: (v) => setCashierId(v === "__none" ? "" : v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: filteredCashiers.length ? "Select cashier" : "No cashiers for this shop" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none", children: "— None —" }),
                  filteredCashiers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id))
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "POS Sale", value: pos, onChange: setPos, infoKey: "pos_sale", hint: "Z-report / printed POS total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Cash Sale", value: cashSale, onChange: setCashSale, infoKey: "cash_sale", hint: "Paid in physical cash" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Bank Sale", value: bankSale, onChange: setBankSale, infoKey: "bank_sale", hint: "Card / transfer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Credit Sale", value: creditSale, onChange: setCreditSale, infoKey: "credit_sale", hint: "Sale given on due / baki" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Due Receivable", value: dueReceivable, onChange: setDueReceivable, infoKey: "due_receivable", hint: "Received from previous due / baki" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 shadow-[0_0_16px_-6px_color-mix(in_oklab,var(--primary)_18%,transparent)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-primary/80", children: "Total Sale" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 100, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { side: "top", className: "max-w-[220px] space-y-1 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Total Sale formula" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Cash Sale + Bank Sale + Credit Sale − Due Receivable" })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalSale, size: "lg" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center justify-between rounded-xl border px-4 py-3", difference === 0 ? "border-border bg-muted/40" : difference > 0 ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-destructive/40 bg-destructive/10 text-destructive"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider", children: "Plus / Minus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: difference, size: "xl", showSign: true })
            ] })
          ] }),
          kind === "purchase" && !simpleMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            !ocrResult && !ocrScanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Scan purchase sheet (optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScanBtn, { icon: Camera, label: "Camera", onClick: () => ocrCamRef.current?.click() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScanBtn, { icon: Upload, label: "Image", onClick: () => ocrImgRef.current?.click() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScanBtn, { icon: FileText, label: "PDF", onClick: () => ocrPdfRef.current?.click() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: ocrCamRef, type: "file", accept: "image/*", capture: "environment", hidden: true, onChange: (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) handleOcrFile(f);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: ocrImgRef, type: "file", accept: "image/jpeg,image/png,image/webp", hidden: true, onChange: (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) handleOcrFile(f);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: ocrPdfRef, type: "file", accept: "application/pdf", hidden: true, onChange: (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) handleOcrFile(f);
              } })
            ] }),
            ocrScanning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }),
              "Scanning sheet…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Total Purchase", value: purchaseAmt, onChange: setPurchaseAmt, big: true }),
            (ocrResult || ocrLinkedScanId) && (() => {
              const edited = ocrOriginalAmount != null && Math.abs(num(purchaseAmt) - Number(ocrOriginalAmount)) > 1e-3;
              const conf = ocrResult?.confidence ?? null;
              const low = conf === "low";
              const medium = conf === "medium";
              const high = conf === "high";
              const confStyle = low ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30" : medium ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30" : high ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30" : "bg-muted text-muted-foreground ring-1 ring-border";
              const dotStyle = low ? "bg-rose-500" : medium ? "bg-amber-500" : high ? "bg-emerald-500" : "bg-muted-foreground";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  conf && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider", confStyle), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", dotStyle, low && "animate-pulse") }),
                    conf,
                    " confidence"
                  ] }),
                  edited && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                    " Modified"
                  ] }),
                  !edited && high && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                    " Verified"
                  ] }),
                  ocrOriginalAmount != null && edited && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                    "OCR: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(ocrOriginalAmount), size: "sm" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "ml-auto h-7 px-2 text-xs", onClick: () => setScanViewer({
                    scanId: ocrLinkedScanId ?? void 0,
                    live: ocrResult ? {
                      ...ocrResult,
                      file_url: ocrFilePreview
                    } : void 0
                  }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3 w-3" }),
                    " View Scan"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "h-7 px-2 text-xs", onClick: resetOcr, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-3 w-3" }),
                    " Remove"
                  ] })
                ] }),
                (low || medium) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-start gap-2 rounded-xl border p-2.5 text-[11px]", low ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: low ? "Low confidence scan — please verify the detected total before saving." : "Medium confidence — double-check the amount looks right." })
                ] })
              ] });
            })(),
            ocrResult && (() => {
              const calc = sumRows(ocrResult.rows);
              const ocrTotal = ocrOriginalAmount;
              if (calc == null || ocrTotal == null) return null;
              const diff = Math.round((calc - ocrTotal) * 100) / 100;
              const absDiff = Math.abs(diff);
              const mismatch = absDiff > 1;
              const used = num(purchaseAmt);
              const usedCalc = Math.abs(used - calc) < 0.01;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-2xl border p-3 space-y-2", mismatch ? "border-amber-500/40 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Total validation" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[10px] font-semibold uppercase tracking-wider", mismatch ? "text-amber-600 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-300"), children: mismatch ? "Mismatch" : "Matches" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase text-muted-foreground", children: "Calculated" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: calc, size: "sm" }) }),
                    usedCalc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-300", children: "USED" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase text-muted-foreground", children: "OCR Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: ocrTotal, size: "sm" }) }),
                    !usedCalc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-300", children: "USED" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase text-muted-foreground", children: "Difference" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: absDiff, size: "sm" }) })
                  ] })
                ] }),
                mismatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 rounded-lg bg-background/60 px-2.5 py-2 text-[11px] cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: ocrMismatchAck, onChange: (e) => setOcrMismatchAck(e.target.checked), className: "h-3.5 w-3.5 accent-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "I've reviewed the totals and confirm",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: used, size: "sm" }),
                    " is correct."
                  ] })
                ] })
              ] });
            })()
          ] }),
          kind === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Expense Amount", value: expenseAmt, onChange: setExpenseAmt, big: true }),
          kind === "withdraw" && !simpleMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmountField, { label: "Withdraw Amount", value: withdrawAmt, onChange: setWithdrawAmt, big: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WithdrawSlipScan, { onApply: ({
              amount,
              date: d,
              note,
              file: slipFile
            }) => {
              setWithdrawAmt(String(Math.floor(Number(amount) || 0)));
              if (d) setDate(d);
              setNotes((prev) => prev && prev.trim().length > 0 ? prev : note);
              setFile(slipFile);
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => {
              setNotes(e.target.value);
              setNotesError("");
            }, rows: 2, className: cn("mt-1", notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") && "border-destructive"), "aria-invalid": notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") ? "true" : "false" }),
            notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: notesError })
          ] }),
          !simpleMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Attachment (image / PDF)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*,application/pdf", onChange: (e) => setFile(e.target.files?.[0] ?? null), className: "mt-1" }),
            attachmentUrl && !file && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 truncate text-xs text-muted-foreground", children: [
              "Current: ",
              attachmentUrl.split("/").pop()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80", style: {
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
            if (editing) resetForm(true);
            setFormOpen(false);
          }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "h-11 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-1 h-4 w-4" }),
            busy ? "Saving…" : editing ? "Save changes" : "Save entry"
          ] })
        ] }) })
      ] })
    ] }) })
  ] });
}
function KindTab({
  active,
  onClick,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cn("flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all", active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border-border bg-background hover:bg-muted/60"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
    " ",
    label
  ] });
}
function AmountField({
  label,
  value,
  onChange,
  big = false,
  infoKey,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: label }),
      infoKey && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { metric: infoKey, size: "xs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "SAR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", step: "0.01", placeholder: "0.00", value, onChange: (e) => onChange(e.target.value), className: cn("pl-12 font-display font-bold tabular-nums tracking-tight", big ? "h-14 text-2xl" : "h-11 text-lg") })
    ] }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: hint })
  ] });
}
const ENTRY_TYPE_META = {
  sale: {
    label: "Sale Entry",
    color: "#059669",
    badge: "Sale Entry"
  },
  purchase: {
    label: "Purchase Entry",
    color: "#ea580c",
    badge: "Purchase Entry"
  },
  expense: {
    label: "Expense Entry",
    color: "#dc2626",
    badge: "Expense Entry"
  },
  withdraw: {
    label: "Withdraw Entry",
    color: "#2563eb",
    badge: "Withdraw Entry"
  }
};
function shareShopEntryAsImage(entry, shopName, cashierName) {
  const type = String(entry?.entry_type ?? "entry").toLowerCase();
  const meta = ENTRY_TYPE_META[type] ?? {
    label: "Entry",
    color: "#0f172a",
    badge: "Entry"
  };
  const amountNum = type === "sale" ? Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0) + Number(entry?.credit_sale ?? 0) : type === "purchase" ? Number(entry?.purchase_amount ?? 0) : type === "expense" ? Number(entry?.expense_amount ?? 0) : Number(entry?.withdraw_amount ?? 0);
  const amountLabel = type === "sale" ? "Total Sale" : type === "purchase" ? "Purchase Amount" : type === "expense" ? "Expense Amount" : "Withdraw Amount";
  const rows = [];
  if (entry?.txn_date) rows.push({
    label: "Date",
    value: String(entry.txn_date)
  });
  const created = entry?.created_at ? new Date(entry.created_at) : null;
  if (created && !isNaN(created.getTime())) {
    rows.push({
      label: "Time",
      value: created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });
  }
  let highlight;
  if (type === "sale") {
    const cash = Number(entry?.cash_sale ?? 0);
    const bank = Number(entry?.bank_sale ?? 0);
    const credit = Number(entry?.credit_sale ?? 0);
    const dueReceivable = Number(entry?.due_receivable ?? 0);
    const pos = Number(entry?.pos_sale ?? 0);
    const totalSale = cash + bank + credit - dueReceivable;
    rows.push({
      label: "Cash Sale",
      value: SAR(cash)
    });
    rows.push({
      label: "Bank Sale",
      value: SAR(bank)
    });
    rows.push({
      label: "POS Sale",
      value: SAR(pos)
    });
    rows.push({
      label: "Credit Sale",
      value: SAR(credit)
    });
    const diff = totalSale - pos;
    const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
    highlight = {
      label: "Plus / Minus (Total Sale − POS Sale)",
      amount: `${sign}${SAR(Math.abs(diff))}`,
      tone: diff > 1e-3 ? "positive" : diff < -1e-3 ? "negative" : "neutral"
    };
  }
  if (entry?.attachment_url) rows.push({
    label: "Attachment",
    value: "Yes"
  });
  const dateStr = entry?.txn_date ? new Date(entry.txn_date).toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const accountantName = "AhsAN";
  const subtitle = [shopName, `Accountant: ${accountantName}`].filter(Boolean).join(" • ");
  void shareToWhatsApp({
    title: "ShRiAh Group",
    subtitle: subtitle || meta.label,
    subtitleSecondary: meta.label,
    amount: SAR(amountNum),
    amountLabel,
    date: dateStr,
    badge: meta.badge,
    accentColor: meta.color,
    rows,
    highlight,
    notes: entry?.notes ?? null,
    brand: `Accountant: ${accountantName}`,
    footerNote: "Shop Entry By ShRiAh Group",
    caption: "Shop Entry By ShRiAh Group"
  });
}
const ShopSummaryCard = reactExports.memo(function ShopSummaryCard2({
  summary,
  active,
  onToggle
}) {
  const {
    shop,
    simple,
    balance,
    primary,
    secondary,
    cashPosition,
    expectedBank,
    cashTot,
    bankTot,
    withdrawTot,
    purchaseTot,
    expenseTot,
    lastDate
  } = summary;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onToggle, className: cn("group relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3.5 text-left active:scale-[0.99]", active ? "border-primary/70 bg-gradient-to-br from-primary/[0.14] via-primary/[0.04] to-transparent" : "border-border/60 bg-gradient-to-b from-card to-card/90 hover:border-primary/30"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", simple ? "bg-amber-500/10 text-amber-500" : active ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[13px] font-semibold tracking-tight", children: shop.name }),
      active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" })
    ] }),
    simple ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: balance, size: "xl", showSign: true, className: balance > 0 ? "text-emerald-500" : balance < 0 ? "text-rose-500" : "text-foreground" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-t border-border/50 pt-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-1 text-emerald-500/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: primary, size: "sm", bold: false, className: "truncate", currencyClassName: "hidden" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-1 text-rose-500/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: secondary, size: "sm", bold: false, className: "truncate", currencyClassName: "hidden" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border px-3 py-2.5", cashPosition >= 0 ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-rose-500/30 bg-rose-500/[0.06]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Shop Cash Position" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { size: "xs", info: {
            title: "Shop Cash Position",
            what: "Net cash held by this shop. Total Cash minus Total Cost over the selected period.",
            formula: "Total Cash − Total Cost  =  (Cash Sale + Bank Withdraw) − (Purchase + Expense)",
            inputs: [`Total Cash: SAR ${(cashTot + withdrawTot).toFixed(2)}  (Cash Sale ${cashTot.toFixed(2)} + Bank Withdraw ${withdrawTot.toFixed(2)})`, `Total Cost: SAR ${(purchaseTot + expenseTot).toFixed(2)}  (Purchase ${purchaseTot.toFixed(2)} + Expense ${expenseTot.toFixed(2)})`, `Cash Position: SAR ${cashPosition.toFixed(2)}`]
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: cashPosition, size: "xl", showSign: true, className: cn("mt-1", cashPosition >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex items-center justify-between gap-2 rounded-xl border px-3 py-2", expectedBank >= 0 ? "border-teal-500/30 bg-teal-500/[0.06]" : "border-orange-500/30 bg-orange-500/[0.06]"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Expected Bank Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoButton, { size: "xs", info: {
            title: "Expected Bank Balance",
            what: "Net bank position based on bank sales and bank withdrawals.",
            formula: "Bank Sale − Bank Withdraw",
            inputs: [`Bank Sale: SAR ${bankTot.toFixed(2)}`, `Bank Withdraw: SAR ${withdrawTot.toFixed(2)}`]
          } }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: expectedBank, size: "md", showSign: true, className: cn("mt-0.5", expectedBank >= 0 ? "text-teal-600 dark:text-teal-400" : "text-orange-500") })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] leading-none text-muted-foreground/80", children: lastDate ? `Last activity · ${lastDate}` : "No activity" })
  ] });
});
const FILTER_FIELD = {
  pos_sale: {
    field: "pos_sale",
    label: "POS Sale"
  },
  cash_sale: {
    field: "cash_sale",
    label: "Cash Sale"
  },
  bank_sale: {
    field: "bank_sale",
    label: "Bank Sale"
  },
  credit_sale: {
    field: "credit_sale",
    label: "Credit Sale"
  },
  purchase: {
    field: "purchase_amount",
    label: "Purchase"
  },
  expense: {
    field: "expense_amount",
    label: "Expense"
  },
  withdraw: {
    field: "withdraw_amount",
    label: "Withdraw"
  },
  difference: {
    field: "difference",
    label: "Difference"
  }
};
const ShopEntryRow = reactExports.memo(function ShopEntryRow2({
  entry,
  shopName,
  activeFilters,
  onOpen,
  onOpenScan
}) {
  const defaultTotal = entry.entry_type === "sale" ? Number(entry.cash_sale) + Number(entry.bank_sale) + Number(entry.credit_sale) : entry.entry_type === "purchase" ? Number(entry.purchase_amount) : entry.entry_type === "expense" ? Number(entry.expense_amount) : Number(entry.withdraw_amount);
  const applicable = activeFilters.filter((f) => {
    if (f === "purchase") return entry.entry_type === "purchase";
    if (f === "expense") return entry.entry_type === "expense";
    if (f === "withdraw") return entry.entry_type === "withdraw";
    return entry.entry_type === "sale";
  });
  const displayed = applicable.length > 0 ? applicable.reduce((s, f) => s + (Number(entry[FILTER_FIELD[f].field]) || 0), 0) : defaultTotal;
  const filterLabel = applicable.length > 0 ? applicable.map((f) => FILTER_FIELD[f].label).join(" + ") : null;
  const hasOcr = !!entry.ocr_scan_id;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { "data-record-id": entry.id, onClick: () => onOpen(entry), className: "flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", entry.entry_type === "sale" ? "bg-emerald-500/10 text-emerald-500" : entry.entry_type === "purchase" ? "bg-amber-500/10 text-amber-500" : entry.entry_type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-sky-500/10 text-sky-500"), children: entry.entry_type === "sale" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }) : entry.entry_type === "purchase" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }) : entry.entry_type === "expense" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-5 text-[10px]", children: shopName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-5 text-[10px] uppercase", children: entry.entry_type }),
        hasOcr && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "h-5 gap-1 border-primary/30 bg-primary/10 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-primary hover:bg-primary/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
          " OCR"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: [
        entry.txn_date,
        entry.notes ? ` · ${entry.notes}` : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: displayed, size: "md" }),
      filterLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: filterLabel })
    ] }),
    hasOcr && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (ev) => {
      ev.stopPropagation();
      onOpenScan(entry.ocr_scan_id);
    }, className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary", "aria-label": "View OCR scan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
  ] });
});
function EntryDetail({
  entry,
  shops,
  cashiers,
  onClose,
  onEdit,
  onDelete,
  onViewScan
}) {
  const [fullscreen, setFullscreen] = reactExports.useState(false);
  const url = useSignedAttachmentUrl(entry?.attachment_url ?? null);
  const entryId = typeof entry?.id === "string" && entry.id.length > 0 ? entry.id : null;
  const entryType = typeof entry?.entry_type === "string" ? entry.entry_type : "entry";
  const hasEntry = !!entry && !!entryId;
  reactExports.useEffect(() => {
    setFullscreen(false);
  }, [entryId]);
  if (!entry) return null;
  const shop = shops.find((s) => s.id === entry?.shop_id);
  const cashier = cashiers.find((c) => c.id === entry?.cashier_id);
  const isImg = url ? /\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(url) : false;
  const isPdf = url ? /\.pdf($|\?)/i.test(url) : false;
  const totalSale = Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0) + Number(entry?.credit_sale ?? 0) - Number(entry?.due_receivable ?? 0);
  const syncedCash = entryType === "sale" ? Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0) : entryType === "purchase" ? -Number(entry?.purchase_amount ?? 0) : entryType === "expense" ? -Number(entry?.expense_amount ?? 0) : Number(entry?.withdraw_amount ?? 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!entry, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "capitalize", children: [
      entryType,
      " entry"
    ] }) }),
    !hasEntry ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground", children: "Entry details unavailable" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Date", v: entry?.txn_date ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Shop", v: shop?.name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Cashier", v: cashier?.name ?? "—" }),
      entryType === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "POS Sale", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.pos_sale ?? 0, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Total Sale", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalSale, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Cash Sale", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.cash_sale ?? 0, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Bank Sale", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.bank_sale ?? 0, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Credit Sale", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.credit_sale ?? 0, size: "sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Plus / Minus", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.difference ?? 0, size: "sm", showSign: true }) })
      ] }),
      entryType === "purchase" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Purchase Amount", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.purchase_amount ?? 0, size: "sm" }) }),
        entry.ocr_scan_id && (() => {
          const edited = entry.ocr_original_amount != null && Math.abs(Number(entry.purchase_amount) - Number(entry.ocr_original_amount)) > 1e-3;
          const low = entry.ocr_confidence === "low";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-muted/40 p-2", children: [
            edited ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              " Modified from OCR"
            ] }) : low ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              " Low Confidence"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              " OCR Verified"
            ] }),
            edited && entry.ocr_original_amount != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
              "OCR: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: Number(entry.ocr_original_amount), size: "sm" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "ml-auto h-7 px-2 text-xs", onClick: () => onViewScan(entry.ocr_scan_id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-1 h-3 w-3" }),
              " View Scan"
            ] })
          ] });
        })()
      ] }),
      entryType === "expense" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Expense Amount", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.expense_amount ?? 0, size: "sm" }) }),
      entryType === "withdraw" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Withdraw Amount", v: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry?.withdraw_amount ?? 0, size: "sm" }) }),
      entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Notes", v: entry.notes }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-primary/20 bg-primary/5 p-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-primary", children: "Synced to Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-muted-foreground", children: [
          entryType === "sale" && "Cash sale → Cash In · Bank sale → Bank balance · Credit → no cash effect",
          entryType === "purchase" && "Recorded as Warehouse Purchase (Cash Out)",
          entryType === "expense" && "Recorded as Shop Expense (Cash Out)",
          entryType === "withdraw" && "Recorded as Bank Withdraw (adds to Cash in Hand)"
        ] }),
        syncedCash !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1", children: [
          "Cash effect: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: syncedCash, size: "sm", showSign: true })
        ] })
      ] }),
      url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Attachment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFullscreen(true), className: "text-xs text-primary hover:underline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "mr-1 inline h-3 w-3" }),
            " Fullscreen"
          ] })
        ] }),
        isImg ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: url, alt: "", className: "max-h-64 w-full rounded-md object-contain" }) : isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: url, className: "h-64 w-full rounded-md border border-border" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: url, target: "_blank", rel: "noreferrer", className: "text-sm text-primary hover:underline", children: "Open attachment" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:!justify-between", children: [
      entryId ? /* @__PURE__ */ jsxRuntimeExports.jsx(EditHistoryButton, { entityType: "shop_entries", entityId: entryId, variant: "outline", label: "History" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => entry && shareShopEntryAsImage(entry, shop?.name, cashier?.name), disabled: !hasEntry, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
          " Share as Image"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => entry && onEdit(entry), disabled: !hasEntry, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1 h-4 w-4" }),
          " Edit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: () => entryId && onDelete(entryId), disabled: !entryId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-4 w-4" }),
          " Delete"
        ] })
      ] })
    ] }),
    fullscreen && url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFullscreen(false), className: "absolute right-4 top-4 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) }),
      isImg ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: url, className: "max-h-full max-w-full object-contain", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: url, className: "h-full w-full bg-white" })
    ] })
  ] }) });
}
function Row({
  k,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: v })
  ] });
}
function ScanBtn({
  icon: Icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: "flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2.5 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    label
  ] });
}
function ScanDetailDialog({
  open,
  scanId,
  live,
  onClose
}) {
  const [loaded, setLoaded] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open) {
      setLoaded(null);
      return;
    }
    if (live) return;
    if (!scanId) return;
    setLoading(true);
    supabase.from("ai_scans").select("id, created_at, file_url, file_type, raw_text, extracted, status").eq("id", scanId).maybeSingle().then((r) => {
      setLoaded(r.data ?? null);
      setLoading(false);
    });
  }, [open, scanId, live]);
  const ex = live ?? loaded?.extracted ?? {};
  const fileUrl = live?.file_url ?? loaded?.file_url ?? null;
  const fileType = loaded?.file_type ?? null;
  const isImg = fileUrl ? /\.(png|jpe?g|webp|gif)($|\?)/i.test(fileUrl) || (fileType?.startsWith("image/") ?? false) : false;
  const isPdf = fileUrl ? /\.pdf($|\?)/i.test(fileUrl) || fileType === "application/pdf" : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4 text-primary" }),
      " OCR Scan Details"
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading…"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-muted/40", children: isImg ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: fileUrl, alt: "", className: "max-h-72 w-full object-contain" }) : isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: fileUrl, className: "h-72 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: fileUrl, target: "_blank", rel: "noreferrer", className: "block p-3 text-sm text-primary", children: "Open file" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanStat, { label: "Cash Buy", value: ex.cash_buy_total ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanStat, { label: "Due Buy", value: ex.due_buy_total ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanStat, { label: "Cost", value: ex.cost ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScanStat, { label: "Grand Total", value: ex.grand_total ?? 0, highlight: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        ex.date && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
          "Date: ",
          ex.date
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
          "Confidence: ",
          ex.confidence ?? "—"
        ] }),
        loaded?.created_at && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
          "Scanned: ",
          new Date(loaded.created_at).toLocaleString()
        ] })
      ] }),
      !!ex.rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Line items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: ex.rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate pr-3", children: r.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: r.amount, size: "sm" })
        ] }, i)) })
      ] }),
      ex.raw_text && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "rounded-xl border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-xs font-medium text-muted-foreground", children: "Raw OCR text" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground", children: ex.raw_text })
      ] })
    ] })
  ] }) });
}
function ScanStat({
  label,
  value,
  highlight = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border p-3", highlight ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value, size: "md" }) })
  ] });
}
function ShopFab({
  onPick,
  allowAll
}) {
  const [open, setOpen] = reactExports.useState(false);
  const longPressTimer = reactExports.useRef(null);
  const longPressFired = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const secondary = [...allowAll ? [{
    key: "purchase",
    label: "Purchase",
    icon: Package,
    tint: "from-sky-500 to-indigo-600"
  }, {
    key: "withdraw",
    label: "Withdraw",
    icon: Banknote,
    tint: "from-amber-500 to-orange-600"
  }] : [], {
    key: "expense",
    label: "Expense",
    icon: Wallet,
    tint: "from-rose-500 to-pink-600"
  }];
  const pick = (k) => {
    setOpen(false);
    onPick(k);
  };
  const startLongPress = () => {
    longPressFired.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      setOpen(true);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate?.(15);
        } catch {
        }
      }
    }, 420);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleClick = () => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    if (open) {
      setOpen(false);
      return;
    }
    pick("sale");
  };
  const fabBottomStyle = {
    bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)"
  };
  const dialBottomStyle = {
    bottom: "calc(env(safe-area-inset-bottom, 0px) + 11rem)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close quick actions", onClick: () => setOpen(false), className: "fixed inset-0 z-40 animate-in fade-in-0 bg-black/30 backdrop-blur-[2px] duration-150 md:hidden" }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close quick actions", onClick: () => setOpen(false), className: "fixed inset-0 z-40 hidden animate-in fade-in-0 bg-black/30 backdrop-blur-[2px] duration-150 md:block" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed end-5 z-50 flex flex-col items-end gap-2 md:end-8", style: dialBottomStyle, children: secondary.map((a, i) => {
      const Icon = a.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-2 transition-all duration-200", open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"), style: {
        transitionDelay: open ? `${i * 35}ms` : "0ms"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm ring-1 ring-border/50 backdrop-blur", children: a.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => pick(a.key), "aria-label": a.label, className: cn("flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition-transform active:scale-90", a.tint), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]" }) })
      ] }, a.key);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen((o) => !o), "aria-label": open ? "Hide more actions" : "More entry actions", "aria-expanded": open, className: cn("fixed end-7 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground shadow-md ring-1 ring-border/60 backdrop-blur transition-all duration-200 active:scale-90 md:end-[2.65rem]", open && "rotate-45"), style: {
      bottom: "calc(env(safe-area-inset-bottom, 0px) + 10rem)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleClick, onPointerDown: startLongPress, onPointerUp: cancelLongPress, onPointerLeave: cancelLongPress, onPointerCancel: cancelLongPress, onContextMenu: (e) => e.preventDefault(), "aria-label": "New sale entry (long-press for more)", className: cn("fixed end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground md:end-8 md:h-16 md:w-16", "bg-gradient-to-b from-primary to-primary-glow", "shadow-[0_14px_36px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)] ring-1 ring-white/15", "transition-all duration-200 hover:brightness-110 active:scale-95 select-none touch-none"), style: fabBottomStyle, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-6 w-6 md:h-7 md:w-7" }) })
  ] });
}
export {
  ShopPage as component
};
