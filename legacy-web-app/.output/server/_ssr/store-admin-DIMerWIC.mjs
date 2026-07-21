import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation, c as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { aq as Route$w, s as useUserAccess, ag as TransactionDialog, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, Z as DropdownMenu, _ as DropdownMenuTrigger, B as Button, $ as DropdownMenuContent, a0 as DropdownMenuItem, a1 as DropdownMenuSeparator, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, C as Card, h as Badge, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, G as DialogFooter, a8 as fetchCustomerBalance, ai as traceWholesaleFlow, aj as refreshWholesaleDataInBackground, ac as PosCustomerPicker, I as Input, T as Textarea, d as cn, ar as useDebouncedValue, m as Checkbox, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, as as BarcodeScanner, u as useConfirm, at as DropdownMenuLabel, w as whatsappLink, i as buildOrderMessage, a9 as usePosDueMap, o as useWorkingDate, k as useAuth, a2 as DialogDescription, ao as RadioGroup, ap as RadioGroupItem, L as Label, ak as Drawer, al as DrawerContent, am as DrawerHeader, an as DrawerTitle, ah as CardContent, af as SAR, aa as POS_CUSTOMER_COLS, ab as POS_CUSTOMER_QUERY_KEY, ad as useProfileMap, ae as displayProfile } from "./router-KeVl8_Ln.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { S as Switch } from "./switch-BxdoXYZW.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Progress } from "./progress-C7s7mjqg.mjs";
import { r as readSync, u as utils } from "../_libs/xlsx.mjs";
import { P as ProductImageUpload } from "./product-image-upload-C4uhr3At.mjs";
import { uploadProductImage } from "./image-upload-CX99TgIR.mjs";
import { F as FindProductImageDialog } from "./find-product-image-dialog-DiFuh3SA.mjs";
import { o as openInvoiceShare } from "./invoice-formats-3QraRpDE.mjs";
import { o as openInvoiceV2 } from "./share-CTb5yitx.mjs";
import { openInvoiceAm80 } from "./share-71lV2Bko.mjs";
import { restore, softDelete } from "./soft-delete-DQY0d6eC.mjs";
import "../_libs/qrcode.mjs";
import { S as Skeleton } from "./skeleton-BjboBqhG.mjs";
import { RecycleBin } from "./recycle-bin-BeMiddUq.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { u as useWholesaleFinancials } from "./use-wholesale-financials-C4OBwATG.mjs";
import { R as Root$1 } from "../_libs/radix-ui__react-separator.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { u as useStoreProfile } from "./use-store-profile-Dvp1Y3Ou.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/jspdf.mjs";

import { aB as LayoutGrid, e as ShoppingBag, aC as Truck, U as Users, W as Wallet, F as ShoppingCart, a0 as Image, aD as Receipt, aE as Boxes, aF as Box, aa as Store, a1 as Star, aG as ChartColumn, aH as FileSpreadsheet, aI as ClipboardList, a3 as Bell, aJ as Tag, v as Package, av as EllipsisVertical, aK as Settings2, k as LoaderCircle, j as Upload, C as CircleCheck, a as TriangleAlert, aL as CircleAlert, I as MessageCircle, z as UserPlus, aM as GripVertical, aN as Pin, aO as PinOff, p as ChevronUp, m as ChevronDown, b as RotateCcw, P as Plus, a5 as Pencil, T as Trash2, X, aP as SquareCheckBig, J as Printer, E as ScanLine, ao as RefreshCw, a7 as Eye, aQ as ArrowRight, aR as Activity, y as Search, x as Phone, aS as MapPin, a6 as EyeOff, au as ImagePlus, l as Sparkles, i as Camera, $ as FileText, _ as Download, D as UserRound, H as Hash, S as ShieldAlert, az as Save, h as Undo2, u as ChevronRight, a4 as History, Q as Minus, aT as CalendarDays, aU as ArrowDownLeft, ay as Coins, ae as TrendingUp, aA as Info, aV as ArrowUpRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/html-to-image.mjs";
import "./types-u21zQmgs.mjs";
import "./zatca-qr-j46Mpz9I.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";

import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";



function normStr(s) {
  return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}
function PosSaleDetailsDialog({ open, onOpenChange, saleId }) {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(null);
  const [productSearch, setProductSearch] = reactExports.useState("");
  const searchRef = reactExports.useRef(null);
  const sale = useQuery({
    queryKey: ["pos-sale-detail", saleId],
    enabled: open && !!saleId,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_sales").select("*").eq("id", saleId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const audit = useQuery({
    queryKey: ["pos-sale-audit", saleId],
    enabled: open && !!saleId,
    queryFn: async () => {
      const { data, error } = await supabase.from("pos_sale_edits").select("id,changed_at,changed_by,diff,note").eq("sale_id", saleId).order("changed_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const products = useQuery({
    queryKey: ["pos-edit-products"],
    enabled: open && editing,
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_products").select("id,name,price,purchase_price,stock,image_url,barcode").order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const customerBalance = useQuery({
    queryKey: ["pos-balance", sale.data?.customer_id],
    enabled: open && !!sale.data?.customer_id,
    queryFn: () => fetchCustomerBalance(sale.data.customer_id)
  });
  const dueMap = usePosDueMap(open && editing);
  const currentCustomer = useQuery({
    queryKey: ["pos-customer-lookup", draft?.customer_id ?? sale.data?.customer_id],
    enabled: open && editing && !!(draft?.customer_id ?? sale.data?.customer_id),
    queryFn: async () => {
      const id = draft?.customer_id ?? sale.data?.customer_id;
      if (!id) return null;
      const { data } = await supabase.from("pos_customers").select(POS_CUSTOMER_COLS).eq("id", id).maybeSingle();
      return data ?? null;
    }
  });
  reactExports.useEffect(() => {
    if (sale.data && editing) setDraft(structuredClone(sale.data));
  }, [editing, sale.data]);
  reactExports.useEffect(() => {
    if (!open) {
      setEditing(false);
      setDraft(null);
      setProductSearch("");
    }
  }, [open]);
  const live = editing ? draft : sale.data;
  const totals = reactExports.useMemo(() => {
    const items = live?.items ?? [];
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0);
    const tax = Math.max(0, subtotal - subtotal / 1.15);
    const discount = Number(live?.discount ?? 0);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, tax, discount, total };
  }, [live]);
  const filteredProducts = reactExports.useMemo(() => {
    const list = products.data ?? [];
    const q = normStr(productSearch);
    if (!q) return list.slice(0, 20);
    const tokens = q.split(/\s+/).filter(Boolean);
    return list.map((p) => {
      const hay = normStr(p.name) + " " + normStr(p.barcode ?? "");
      let score = 0;
      for (const t of tokens) {
        if (!hay.includes(t)) return { p, score: -1 };
        score += hay.startsWith(t) ? 3 : 1;
      }
      return { p, score };
    }).filter((x) => x.score >= 0).sort((a, b) => b.score - a.score).slice(0, 40).map((x) => x.p);
  }, [products.data, productSearch]);
  function addProduct(p) {
    if (!draft) return;
    const existing = draft.items.find((it) => it.product_id === p.id);
    if (existing) {
      setDraft({
        ...draft,
        items: draft.items.map(
          (it) => it.product_id === p.id ? { ...it, qty: it.qty + 1 } : it
        )
      });
    } else {
      setDraft({
        ...draft,
        items: [
          ...draft.items,
          {
            product_id: p.id,
            name: p.name,
            qty: 1,
            price: Number(p.price) || 0,
            cost: Number(p.purchase_price) || 0,
            image_url: p.image_url
          }
        ]
      });
    }
    setProductSearch("");
    queueMicrotask(() => searchRef.current?.focus());
  }
  const save = useMutation({
    mutationFn: async () => {
      if (!draft || !sale.data) return;
      const orig = sale.data;
      const diff = {};
      const fields = ["customer_id", "customer_name", "customer_mobile", "payment_method", "paid_amount", "due_amount", "notes", "discount"];
      for (const f of fields) {
        if (orig[f] != draft[f]) diff[f] = { from: orig[f], to: draft[f] };
      }
      const origItems = JSON.stringify(orig.items);
      const newItems = JSON.stringify(draft.items);
      if (origItems !== newItems) {
        const origIds = new Set(orig.items.map((i) => i.product_id ?? i.name));
        const newIds = new Set(draft.items.map((i) => i.product_id ?? i.name));
        diff.items = {
          from: { count: orig.items.length, total: Number(orig.total) },
          to: {
            count: draft.items.length,
            total: totals.total,
            added: draft.items.filter((i) => !origIds.has(i.product_id ?? i.name)).map((i) => i.name),
            removed: orig.items.filter((i) => !newIds.has(i.product_id ?? i.name)).map((i) => i.name)
          }
        };
      }
      if (Number(orig.total) !== totals.total) diff.total = { from: Number(orig.total), to: totals.total };
      const newDue = Math.max(0, totals.total - (Number(draft.paid_amount) || 0));
      const payload = {
        customer_id: draft.customer_id,
        customer_name: draft.customer_name,
        customer_mobile: draft.customer_mobile,
        items: draft.items,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        discount: Number(draft.discount) || 0,
        paid_amount: Number(draft.paid_amount) || 0,
        due_amount: newDue,
        payment_method: draft.payment_method,
        payment_breakdown: { [draft.payment_method]: Number(draft.paid_amount) || 0 },
        notes: draft.notes,
        edit_count: (orig.edit_count ?? 0) + 1
      };
      const { error } = await supabase.from("shop_sales").update(payload).eq("id", draft.id);
      if (error) throw error;
      if (Object.keys(diff).length > 0) {
        await supabase.from("pos_sale_edits").insert({ sale_id: draft.id, diff, note: "Edited" });
      }
      return { oldCustomerId: orig.customer_id, newCustomerId: draft.customer_id };
    },
    onSuccess: (res) => {
      toast.success("Sale updated");
      qc.invalidateQueries({ queryKey: ["pos-sale-detail", saleId] });
      qc.invalidateQueries({ queryKey: ["pos-sale-audit", saleId] });
      qc.invalidateQueries({ queryKey: ["admin-sales"] });
      qc.invalidateQueries({ queryKey: ["pos-balance"] });
      qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
      qc.invalidateQueries({ queryKey: POS_CUSTOMER_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["wh-financials"] });
      qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
      if (res?.oldCustomerId) qc.invalidateQueries({ queryKey: ["pos-balance", res.oldCustomerId] });
      if (res?.newCustomerId) qc.invalidateQueries({ queryKey: ["pos-balance", res.newCustomerId] });
      setEditing(false);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  async function buildInvoicePayload() {
    if (!sale.data) return null;
    const r = sale.data;
    const currentDue = customerBalance.data?.current_due ?? 0;
    const thisSaleDue = Number(r.due_amount ?? 0);
    const previousDue = Math.max(0, currentDue - thisSaleDue);
    const vat = await (await import("./router-KeVl8_Ln.mjs").then((n) => n.b0)).fetchCustomerVatForSale({
      customer_id: r.customer_id,
      customer_mobile: r.customer_mobile
    });
    return {
      kind: "sale",
      invoiceNumber: r.invoice_number,
      date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
      timestamp: r.created_at ?? r.txn_date,
      partyLabel: "Customer",
      partyName: r.customer_name,
      partyMobile: r.customer_mobile ?? void 0,
      partyTaxNo: vat ?? void 0,
      items: r.items,
      subtotal: Number(r.subtotal),
      discount: Number(r.discount ?? 0),
      tax: Number(r.tax),
      total: Number(r.total),
      notes: r.notes ?? void 0,
      paymentMethod: r.payment_method,
      paidAmount: Number(r.paid_amount ?? 0),
      previousDue,
      newDue: currentDue
    };
  }
  async function handleInvoiceV2() {
    const payload = await buildInvoicePayload();
    if (!payload) return;
    openInvoiceV2({
      invoiceNumber: payload.invoiceNumber,
      date: payload.date,
      timestamp: payload.timestamp,
      customerName: payload.partyName,
      customerMobile: payload.partyMobile,
      customerVatNo: payload.partyTaxNo,
      paymentMethod: payload.paymentMethod,
      items: payload.items.map((it) => ({
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0
      })),
      subtotal: Number(payload.subtotal) || 0,
      vat: Number(payload.tax) || 0,
      total: Number(payload.total) || 0,
      paidAmount: payload.paidAmount,
      previousDue: payload.previousDue,
      newDue: payload.newDue
    });
  }
  async function handleInvoiceAm80() {
    const payload = await buildInvoicePayload();
    if (!payload) return;
    openInvoiceAm80({
      invoiceNumber: payload.invoiceNumber,
      date: payload.date,
      timestamp: payload.timestamp,
      customerName: payload.partyName,
      customerMobile: payload.partyMobile,
      customerVatNo: payload.partyTaxNo,
      paymentMethod: payload.paymentMethod,
      items: payload.items.map((it) => ({
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0
      })),
      subtotal: Number(payload.subtotal) || 0,
      vat: Number(payload.tax) || 0,
      total: Number(payload.total) || 0,
      paidAmount: payload.paidAmount,
      previousDue: payload.previousDue,
      newDue: payload.newDue
    });
  }
  const liveNewDue = reactExports.useMemo(() => {
    if (!live) return 0;
    return Math.max(0, totals.total - (Number(live.paid_amount) || 0));
  }, [live, totals.total]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0",
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Sale #",
            sale.data?.invoice_number ?? "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            sale.data?.status === "partially_returned" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-amber-500 text-[10px] text-white hover:bg-amber-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-3 w-3" }),
              " Partial Return"
            ] }),
            sale.data?.status === "fully_returned" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "gap-1 bg-rose-600 text-[10px] text-white hover:bg-rose-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-3 w-3" }),
              " Fully Returned"
            ] }),
            (sale.data?.edit_count ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3 w-3" }),
              " Edited ",
              sale.data?.edit_count,
              "x"
            ] })
          ] })
        ] }) }),
        sale.isLoading || !live ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold", children: [
              "SAR ",
              totals.total.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: new Date(sale.data.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-xl border border-border bg-card p-3", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PosCustomerPicker,
              {
                value: currentCustomer.data ?? (draft?.customer_id ? {
                  id: draft.customer_id,
                  name: draft.customer_name,
                  phone: draft.customer_mobile,
                  alias: null,
                  opening_due: 0,
                  notes: null,
                  is_active: true,
                  created_at: ""
                } : null),
                onChange: (c) => {
                  if (!draft) return;
                  if (c) {
                    setDraft({ ...draft, customer_id: c.id, customer_name: c.name, customer_mobile: c.phone ?? "" });
                  } else {
                    setDraft({ ...draft, customer_id: null, customer_name: "Walk-in", customer_mobile: "" });
                  }
                },
                showDue: true,
                dueByCustomer: dueMap.data
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft?.customer_name ?? "", onChange: (e) => setDraft({ ...draft, customer_name: e.target.value }), placeholder: "Customer name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft?.customer_mobile ?? "", onChange: (e) => setDraft({ ...draft, customer_mobile: e.target.value }), placeholder: "Mobile" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: sale.data.customer_name }),
            sale.data.customer_mobile && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sale.data.customer_mobile })
          ] }) }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-primary/30 bg-primary/[0.03] p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ref: searchRef,
                  placeholder: "Add product — search by name or barcode…",
                  value: productSearch,
                  onChange: (e) => setProductSearch(e.target.value),
                  className: "h-9 pl-8 text-sm",
                  autoComplete: "off"
                }
              )
            ] }),
            productSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 max-h-48 space-y-1 overflow-y-auto", children: products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2 text-center text-xs text-muted-foreground", children: "Loading…" }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3 text-center text-xs text-muted-foreground", children: "No products found" }) : filteredProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => addProduct(p),
                className: "flex w-full items-center gap-2 rounded-lg border border-border/60 bg-card p-1.5 text-left hover:border-primary/50 active:scale-[0.99]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 flex-shrink-0 overflow-hidden rounded bg-muted", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3 text-muted-foreground/60" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-medium", children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      "SAR ",
                      p.price.toFixed(2),
                      " · Stock ",
                      p.stock
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 text-primary" })
                ]
              },
              p.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Items" }),
            (live.items ?? []).map((it, i) => {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border px-3 py-2 last:border-b-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: it.name }),
                  !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                    it.qty,
                    " × SAR ",
                    Number(it.price).toFixed(2)
                  ] })
                ] }),
                editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center rounded-md border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDraft({ ...draft, items: draft.items.map((x, idx) => idx === i ? { ...x, qty: Math.max(0, x.qty - 1) } : x).filter((x) => x.qty > 0) }), className: "px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: it.qty, onChange: (e) => setDraft({ ...draft, items: draft.items.map((x, idx) => idx === i ? { ...x, qty: Number(e.target.value) || 0 } : x) }), className: "h-7 w-12 border-0 text-center" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDraft({ ...draft, items: draft.items.map((x, idx) => idx === i ? { ...x, qty: x.qty + 1 } : x) }), className: "px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: it.price, onChange: (e) => setDraft({ ...draft, items: draft.items.map((x, idx) => idx === i ? { ...x, price: Number(e.target.value) || 0 } : x) }), className: "h-7 w-20 text-right" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDraft({ ...draft, items: draft.items.filter((_, idx) => idx !== i) }), className: "rounded p-1 text-rose-600 hover:bg-rose-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
                  "SAR ",
                  (it.qty * it.price).toFixed(2)
                ] })
              ] }, i);
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { label: "Subtotal", value: `SAR ${totals.subtotal.toFixed(2)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { label: "Paid", value: `SAR ${Number(live.paid_amount ?? 0).toFixed(2)}`, tone: "success" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Cell,
              {
                label: "Due",
                value: `SAR ${(editing ? liveNewDue : Number(live.due_amount ?? 0)).toFixed(2)}`,
                tone: (editing ? liveNewDue : Number(live.due_amount ?? 0)) > 0 ? "danger" : void 0
              }
            )
          ] }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] text-muted-foreground", children: "Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: draft?.discount ?? 0, onChange: (e) => setDraft({ ...draft, discount: Number(e.target.value) || 0 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] text-muted-foreground", children: "Paid amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: draft?.paid_amount ?? 0, onChange: (e) => setDraft({ ...draft, paid_amount: Number(e.target.value) || 0 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] text-muted-foreground", children: "Method" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: draft?.payment_method ?? "cash", onValueChange: (v) => setDraft({ ...draft, payment_method: v }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pos", children: "POS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bank", children: "Bank" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "due", children: "Due (credit)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mixed", children: "Mixed" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "col-span-2", rows: 2, value: draft?.notes ?? "", onChange: (e) => setDraft({ ...draft, notes: e.target.value }), placeholder: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("col-span-2 flex items-center justify-between rounded-lg border px-3 py-2 text-xs", liveNewDue > 0 ? "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/20" : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "New due for this sale" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                "SAR ",
                liveNewDue.toFixed(2)
              ] })
            ] })
          ] }),
          !editing && live.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: live.notes })
          ] }),
          (audit.data?.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-muted/20 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3 w-3" }),
              " Edit history"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: audit.data.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background px-2 py-1.5 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: new Date(e.changed_at).toLocaleString() }),
              Object.entries(e.diff ?? {}).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  k,
                  ":"
                ] }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: JSON.stringify(v.from)?.slice(0, 40) }),
                " → ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: JSON.stringify(v.to)?.slice(0, 40) })
              ] }, k))
            ] }, e.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-t border-border bg-muted/20 px-4 py-3", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setEditing(false), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-4 w-4" }),
            " Cancel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1", disabled: save.isPending, onClick: () => save.mutate(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-1 h-4 w-4" }),
            " Save changes"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setEditing(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1 h-4 w-4" }),
            " Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
              onClick: handleInvoiceAm80,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1 h-4 w-4" }),
                " 80mm by AM"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "flex-1",
              onClick: handleInvoiceV2,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
                " Invoice V2"
              ]
            }
          )
        ] }) })
      ]
    }
  ) });
}
function Cell({ label, value, tone }) {
  const c = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-rose-600" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-2 py-2 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-0.5 text-sm font-bold ${c}`, children: value })
  ] });
}
function PurchaseDetailsDialog({ open, onOpenChange, purchaseId }) {
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const profiles = useProfileMap();
  const [busy, setBusy] = reactExports.useState(false);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const purchase = useQuery({
    queryKey: ["purchase-detail", purchaseId],
    enabled: open && !!purchaseId,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_purchases").select("*").eq("id", purchaseId).maybeSingle();
      if (error) throw error;
      return data ?? null;
    }
  });
  const p = purchase.data;
  const items = reactExports.useMemo(() => p?.items ?? [], [p]);
  const totals = reactExports.useMemo(() => {
    let qty = 0;
    let subtotal = 0;
    for (const it of items) {
      const q = Number(it.qty) || 0;
      const price = Number(it.price) || 0;
      qty += q;
      subtotal += q * price;
    }
    return { qty, subtotal };
  }, [items]);
  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["purchase-detail", purchaseId] });
    qc.invalidateQueries({ queryKey: ["admin-purchases"] });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["warehouse-value"] });
    qc.invalidateQueries({ queryKey: ["store-admin-overview"] });
  };
  const handleDelete = async () => {
    if (!p) return;
    const ok = await confirm2({
      title: "Delete purchase?",
      description: "This will move the purchase to Recycle Bin and reverse the stock movement. You can restore it later.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning",
      details: [
        { label: "Invoice", value: `#${p.invoice_number}` },
        { label: "Supplier", value: p.supplier_name || "—" },
        { label: "Amount", value: `SAR ${Number(p.total ?? 0).toFixed(2)}` },
        { label: "Date", value: new Date(p.created_at).toLocaleDateString() }
      ]
    });
    if (!ok) return;
    setBusy(true);
    const { error } = await softDelete("shop_purchases", p.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin — stock restored", {
      duration: 5e3,
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: rErr } = await restore("shop_purchases", p.id);
          if (rErr) {
            toast.error(rErr.message);
            return;
          }
          toast.success("Purchase restored");
          invalidateAll();
        }
      }
    });
    invalidateAll();
    onOpenChange(false);
  };
  const createdByName = p?.created_by ? displayProfile(profiles[p.created_by]) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-4 py-3 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-amber-600" }),
        "Purchase ",
        p?.invoice_number ? `#${p.invoice_number}` : "…"
      ] }) }),
      purchase.isLoading || !p ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400", children: "Total Purchase" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-3xl font-bold tabular-nums", children: SAR(p.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3" }),
              new Date(p.created_at).toLocaleString()
            ] }),
            p.invoice_number != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
              "Invoice #",
              p.invoice_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Supplier", value: p.supplier_name || "—", sub: p.supplier_mobile || void 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Invoice / Memo #", value: p.invoice_number != null ? `#${p.invoice_number}` : "—" }),
          p.memo_date && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Memo Date", value: new Date(p.memo_date).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Created By", value: createdByName, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-3.5 w-3.5" }) }),
          p.txn_date && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaRow, { label: "Entry Date", value: new Date(p.txn_date).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 overflow-hidden rounded-xl border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Purchased Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              items.length,
              " item",
              items.length === 1 ? "" : "s"
            ] })
          ] }),
          items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-6 text-center text-xs text-muted-foreground", children: "No items" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60", children: items.map((it, i) => {
            const q = Number(it.qty) || 0;
            const price = Number(it.price) || 0;
            const line = q * price;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate font-medium", children: it.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 tabular-nums font-semibold", children: SAR(line) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 text-[11px] text-muted-foreground tabular-nums", children: [
                "Qty ",
                q,
                " × ",
                SAR(price)
              ] })
            ] }, i);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border border-t border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-medium", children: totals.qty })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(p.subtotal) })
            ] }),
            Number(p.tax ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(p.tax) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-amber-500/10 px-3 py-2 text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(p.total) })
            ] })
          ] })
        ] }),
        p.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }),
            " Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm", children: p.notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: () => onOpenChange(false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
          " Close"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "secondary",
            size: "sm",
            className: "flex-1",
            onClick: () => setEditOpen(true),
            disabled: busy || !p,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
              " Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            className: "flex-1",
            onClick: handleDelete,
            disabled: busy || !p,
            children: [
              busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Delete"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransactionDialog,
      {
        open: editOpen,
        onOpenChange: (v) => {
          setEditOpen(v);
          if (!v) {
            invalidateAll();
          }
        },
        kind: "purchase",
        editId: purchaseId
      }
    )
  ] });
}
function MetaRow({
  label,
  value,
  sub,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "text-right text-sm font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        icon,
        value
      ] }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-normal text-muted-foreground", children: sub })
    ] })
  ] });
}
const FIELD_ORDER = [
  "min_stock",
  "purchase_price",
  "compare_price",
  "tax_rate",
  "stock",
  "barcode",
  "item_code",
  "price",
  "location",
  "category_hint",
  "description",
  "search_keywords",
  "name"
];
const FIELD_ALIASES = {
  name: [
    "item name",
    "product name",
    "name",
    "item",
    "product",
    "particulars",
    "title"
  ],
  // NOTE: "Current Stock Quantity" (Vyapar's canonical column) is matched
  // first inside the stock aliases below — we import the exact raw value.
  item_code: [
    "item code",
    "itemcode",
    "code",
    "sku",
    "hsn",
    "hsn code",
    "product code",
    "ref",
    "reference",
    "item id"
  ],
  barcode: [
    "barcode",
    "bar code",
    "ean",
    "upc",
    "qr code",
    "qrcode"
  ],
  price: [
    "sale price",
    "selling price",
    "mrp",
    "rate",
    "price",
    "sales price",
    "unit price",
    "retail price",
    "sale rate",
    "sales rate"
  ],
  purchase_price: [
    "purchase price",
    "buying price",
    "cost",
    "cost price",
    "buy price",
    "purchase rate",
    "buy rate",
    "purchase cost",
    "wholesale price"
  ],
  compare_price: [
    "other company price",
    "compare price",
    "compare at price",
    "compare-at price",
    "market price",
    "competitor price",
    "other price",
    "rrp",
    "list price",
    "original price",
    "old price",
    "was price"
  ],
  tax_rate: [
    "tax",
    "tax %",
    "tax%",
    "gst",
    "gst %",
    "vat",
    "vat %",
    "vat%",
    "tax rate"
  ],
  stock: [
    // "current stock quantity" is the canonical Vyapar header — keep it first.
    "current stock quantity",
    "current stock qty",
    "current stock",
    "stock quantity",
    "stock qty",
    "stock",
    "available qty",
    "available quantity",
    "qty",
    "quantity",
    "opening stock",
    "opening qty",
    "opening quantity",
    "closing stock",
    "closing qty",
    "closing quantity",
    "in stock",
    "balance",
    "stk",
    "qty in stock",
    "on hand",
    "in hand"
  ],
  min_stock: [
    "minimum stock",
    "min stock",
    "min stk",
    "reorder level",
    "reorder point",
    "low stock",
    "low stock alert",
    "min qty",
    "minimum quantity",
    "min quantity"
  ],
  location: [
    "item location",
    "location",
    "rack",
    "shelf",
    "warehouse location",
    "bin"
  ],
  description: [
    "details",
    "remarks",
    "notes",
    "long description",
    "description"
  ],
  category_hint: [
    "category",
    "group",
    "item category",
    "product category",
    "type",
    "item group"
  ],
  search_keywords: ["keywords", "aliases", "tags"]
};
const VYAPAR_HEADER_HINTS = [
  "item name",
  "sale price",
  "purchase price",
  "current stock",
  "item code",
  "stock quantity",
  "opening stock"
];
async function readSpreadsheet(file) {
  const buf = await file.arrayBuffer();
  const wb = readSync(buf, { type: "array" });
  const first = wb.SheetNames[0];
  const sheet = wb.Sheets[first];
  return utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false
  });
}
function normHeader(s) {
  return String(s ?? "").replace(/[*:()\[\]]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
function findHeaderRow(rows) {
  const aliasSet = new Set(Object.values(FIELD_ALIASES).flat());
  let bestRow = 0;
  let bestScore = 0;
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const cells = rows[i].map(normHeader);
    const score = cells.filter((c) => aliasSet.has(c)).length;
    if (score > bestScore) {
      bestScore = score;
      bestRow = i;
    }
  }
  return bestScore >= 2 ? bestRow : 0;
}
function matchHeader(h) {
  for (const field of FIELD_ORDER) {
    if (FIELD_ALIASES[field].includes(h)) return field;
  }
  for (const field of FIELD_ORDER) {
    for (const a of FIELD_ALIASES[field]) {
      if (h === a || h.startsWith(a + " ") || h.endsWith(" " + a) || h === a.replace(/\s+/g, "")) {
        return field;
      }
    }
  }
  return null;
}
function mapHeaders(headers) {
  const map = {};
  const human = {};
  const claimed = /* @__PURE__ */ new Set();
  headers.forEach((raw, idx) => {
    const h = normHeader(raw);
    if (!h) return;
    const field = matchHeader(h);
    if (field && !claimed.has(field)) {
      map[idx] = field;
      human[raw] = field;
      claimed.add(field);
    }
  });
  return { map, human };
}
function toNumber(v) {
  if (v === null || v === void 0 || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v).replace(/[,٬]/g, "").replace(/[a-zA-Z%₹$€£﷼]/g, "").replace(/[^\d.\-]/g, " ").trim().split(/\s+/)[0] ?? "";
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
function toText(v) {
  return String(v ?? "").replace(/\s+/g, " ").trim();
}
const CATEGORY_KEYWORDS = [
  { name: "Oil", words: ["oil", "ghee", "sunflower", "olive", "vegetable oil"] },
  { name: "Drinks", words: ["water", "juice", "cola", "pepsi", "soda", "drink", "beverage", "tea", "coffee", "milk"] },
  { name: "Snacks", words: ["chips", "biscuit", "cookie", "snack", "wafer", "chocolate", "candy", "nuts"] },
  { name: "Frozen", words: ["frozen", "ice cream", "icecream", "freeze"] },
  { name: "Dairy", words: ["milk", "cheese", "yogurt", "yoghurt", "butter", "labneh", "cream", "dairy"] },
  { name: "Grains", words: ["rice", "flour", "wheat", "sugar", "salt", "pasta", "noodle", "bread"] },
  { name: "Spices", words: ["spice", "masala", "pepper", "cumin", "turmeric", "cinnamon", "cardamom"] },
  { name: "Canned", words: ["tuna", "sardine", "can", "canned", "tomato paste", "beans"] },
  { name: "Cleaning", words: ["soap", "detergent", "cleaner", "bleach", "tissue", "shampoo"] }
];
function detectCategory(name) {
  const n = name.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (cat.words.some((w) => n.includes(w))) return cat.name;
  }
  return null;
}
const STOP = /* @__PURE__ */ new Set(["the", "a", "an", "of", "with", "and", "for", "in", "ml", "gm", "kg", "g", "l", "pcs", "pc", "x"]);
function generateKeywords(name, code) {
  const out = /* @__PURE__ */ new Set();
  const lower = name.toLowerCase();
  out.add(lower);
  const tokens = lower.replace(/[^a-z0-9\u0600-\u06FF\u0980-\u09FF\s]/gi, " ").split(/\s+/).filter((t) => t && t.length >= 2 && !STOP.has(t));
  tokens.forEach((t) => out.add(t));
  if (tokens.length >= 2) out.add(`${tokens[0]} ${tokens[1]}`);
  if (code) out.add(code.toLowerCase());
  return Array.from(out).slice(0, 20);
}
async function parseVyaparFile(file) {
  const rows = await readSpreadsheet(file);
  if (rows.length === 0) {
    return { rows: [], skipped: 0, duplicates: 0, missingPrice: 0, missingStock: 0, detectedFormat: "generic", headerMap: {} };
  }
  const headerRowIdx = findHeaderRow(rows);
  const headers = rows[headerRowIdx].map((c) => toText(c));
  const { map, human } = mapHeaders(headers);
  const headerStr = headers.map(normHeader).join(" ");
  const isVyapar = VYAPAR_HEADER_HINTS.filter((h) => headerStr.includes(h)).length >= 2;
  const fieldIdx = {};
  for (const [idx, field] of Object.entries(map)) {
    fieldIdx[field] = Number(idx);
  }
  const nameSet = /* @__PURE__ */ new Set();
  const codeSet = /* @__PURE__ */ new Set();
  const out = [];
  let skipped = 0;
  let duplicates = 0;
  let missingPrice = 0;
  let missingStock = 0;
  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const cells = rows[i] ?? [];
    const get = (field) => {
      const idx = fieldIdx[field];
      return idx !== void 0 ? cells[idx] : "";
    };
    const name = toText(get("name"));
    if (!name || name.length < 2) {
      skipped++;
      continue;
    }
    if (/^(total|grand total|subtotal)$/i.test(name)) {
      skipped++;
      continue;
    }
    const code = toText(get("item_code")) || null;
    if (code && codeSet.has(code.toLowerCase()) || !code && nameSet.has(name.toLowerCase())) {
      duplicates++;
      continue;
    }
    if (code) codeSet.add(code.toLowerCase());
    nameSet.add(name.toLowerCase());
    const price = toNumber(get("price"));
    let stock = toNumber(get("stock"));
    if (!Number.isFinite(stock) || stock < 0) stock = 0;
    if (price <= 0) missingPrice++;
    if (stock <= 0 && fieldIdx.stock === void 0) missingStock++;
    const row = {
      name,
      item_code: code,
      barcode: toText(get("barcode")) || null,
      price,
      compare_price: fieldIdx.compare_price !== void 0 ? toNumber(get("compare_price")) || null : null,
      purchase_price: toNumber(get("purchase_price")),
      tax_rate: fieldIdx.tax_rate !== void 0 ? toNumber(get("tax_rate")) : 15,
      stock,
      min_stock: toNumber(get("min_stock")),
      location: toText(get("location")) || null,
      description: toText(get("description")) || null,
      category_hint: toText(get("category_hint")) || detectCategory(name),
      search_keywords: generateKeywords(name, code)
    };
    out.push(row);
  }
  return {
    rows: out,
    skipped,
    duplicates,
    missingPrice,
    missingStock,
    detectedFormat: isVyapar ? "vyapar" : "generic",
    headerMap: human
  };
}
async function commitImport(rows, mode, options) {
  const summary = { inserted: 0, updated: 0, skipped: 0, failed: 0, stockImported: 0, errors: [] };
  if (rows.length === 0) return summary;
  const { data: existing, error: exErr } = await supabase.from("shop_products").select("id,name,item_code,barcode");
  if (exErr) {
    summary.errors.push(exErr.message);
    return summary;
  }
  const byBarcode = /* @__PURE__ */ new Map();
  const byCode = /* @__PURE__ */ new Map();
  const byName = /* @__PURE__ */ new Map();
  (existing ?? []).forEach((p) => {
    if (p.barcode) byBarcode.set(String(p.barcode).trim().toLowerCase(), { id: p.id });
    if (p.item_code) byCode.set(String(p.item_code).trim().toLowerCase(), { id: p.id });
    byName.set(String(p.name).trim().toLowerCase(), { id: p.id });
  });
  const CHUNK = 50;
  let processed = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await Promise.all(chunk.map(async (r) => {
      try {
        const matchId = r.barcode && byBarcode.get(r.barcode.trim().toLowerCase())?.id || r.item_code && byCode.get(r.item_code.trim().toLowerCase())?.id || byName.get(r.name.trim().toLowerCase())?.id || null;
        if (matchId && mode === "skip") {
          summary.skipped++;
          return;
        }
        const safeStock = Number.isFinite(r.stock) && r.stock >= 0 ? r.stock : 0;
        const base = {
          name: r.name,
          item_code: r.item_code,
          barcode: r.barcode,
          price: r.price,
          compare_price: r.compare_price,
          purchase_price: r.purchase_price,
          tax_rate: r.tax_rate ?? 15,
          tax_inclusive: true,
          min_stock: r.min_stock,
          location: r.location,
          description: r.description,
          search_keywords: r.search_keywords,
          category_id: r.category_hint ? options.categoryMap[r.category_hint] ?? null : null
        };
        if (options.includeStock || mode === "stock_only") base.stock = safeStock;
        if (mode === "stock_only") {
          if (!matchId) {
            summary.skipped++;
            return;
          }
          const { error: error2 } = await supabase.from("shop_products").update({ stock: safeStock }).eq("id", matchId);
          if (error2) throw error2;
          summary.updated++;
          summary.stockImported += safeStock;
          return;
        }
        if (matchId && (mode === "merge" || mode === "replace")) {
          const patch = mode === "replace" ? { ...base, is_visible: true } : Object.fromEntries(Object.entries(base).filter(([, v]) => v !== null && v !== "" && v !== void 0));
          if (options.includeStock) patch.stock = safeStock;
          const { error: error2 } = await supabase.from("shop_products").update(patch).eq("id", matchId);
          if (error2) throw error2;
          summary.updated++;
          if (options.includeStock) summary.stockImported += safeStock;
          return;
        }
        const insertPayload = { ...base, is_visible: true, stock: options.includeStock ? safeStock : 0 };
        const { error } = await supabase.from("shop_products").insert(insertPayload);
        if (error) throw error;
        summary.inserted++;
        if (options.includeStock) summary.stockImported += safeStock;
      } catch (e) {
        summary.failed++;
        if (summary.errors.length < 10) summary.errors.push(`${r.name}: ${e?.message ?? e}`);
      } finally {
        processed++;
        options.onProgress?.(processed, rows.length);
      }
    }));
  }
  return summary;
}
async function buildStockPreview(rows) {
  const { data: existing } = await supabase.from("shop_products").select("id,name,item_code,barcode,stock");
  const byBarcode = /* @__PURE__ */ new Map();
  const byCode = /* @__PURE__ */ new Map();
  const byName = /* @__PURE__ */ new Map();
  (existing ?? []).forEach((p) => {
    if (p.barcode) byBarcode.set(String(p.barcode).trim().toLowerCase(), p);
    if (p.item_code) byCode.set(String(p.item_code).trim().toLowerCase(), p);
    byName.set(String(p.name).trim().toLowerCase(), p);
  });
  return rows.map((r) => {
    const bc = r.barcode && byBarcode.get(r.barcode.trim().toLowerCase());
    if (bc) return { name: r.name, match: "barcode", currentStock: Number(bc.stock ?? 0), importedStock: r.stock };
    const ic = r.item_code && byCode.get(r.item_code.trim().toLowerCase());
    if (ic) return { name: r.name, match: "item_code", currentStock: Number(ic.stock ?? 0), importedStock: r.stock };
    const nm = byName.get(r.name.trim().toLowerCase());
    if (nm) return { name: r.name, match: "name", currentStock: Number(nm.stock ?? 0), importedStock: r.stock };
    return { name: r.name, match: "new", currentStock: null, importedStock: r.stock };
  });
}
async function resolveCategories(hints) {
  const uniq = Array.from(new Set(hints.filter(Boolean)));
  if (uniq.length === 0) return {};
  const { data: existing } = await supabase.from("shop_categories").select("id,name");
  const map = {};
  const byName = /* @__PURE__ */ new Map();
  (existing ?? []).forEach((c) => byName.set(String(c.name).toLowerCase(), c.id));
  const toCreate = [];
  for (const h of uniq) {
    const found = byName.get(h.toLowerCase());
    if (found) map[h] = found;
    else toCreate.push(h);
  }
  if (toCreate.length) {
    const { data: created } = await supabase.from("shop_categories").insert(toCreate.map((name, i) => ({ name, sort_order: i, is_active: true }))).select("id,name");
    (created ?? []).forEach((c) => {
      map[c.name] = c.id;
    });
  }
  return map;
}
function VyaparImportDialog({ open, onOpenChange, onImported }) {
  const [parsed, setParsed] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("merge");
  const [includeStock, setIncludeStock] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [summary, setSummary] = reactExports.useState(null);
  const [stockPreview, setStockPreview] = reactExports.useState(null);
  const reset = () => {
    setParsed(null);
    setSummary(null);
    setBusy(false);
    setProgress(0);
    setStockPreview(null);
  };
  const onFile = async (file) => {
    setBusy(true);
    try {
      const result = await parseVyaparFile(file);
      setParsed(result);
      if (result.rows.length === 0) toast.error("No valid products found in this file");
      else {
        toast.success(`Detected ${result.rows.length} products (${result.detectedFormat})`);
        try {
          setStockPreview(await buildStockPreview(result.rows));
        } catch {
        }
      }
    } catch (e) {
      toast.error(e?.message ?? "Failed to parse file");
    } finally {
      setBusy(false);
    }
  };
  const runImport = async () => {
    if (!parsed) return;
    setBusy(true);
    setProgress(0);
    try {
      const hints = parsed.rows.map((r) => r.category_hint).filter(Boolean);
      const categoryMap = await resolveCategories(hints);
      const result = await commitImport(parsed.rows, mode, {
        includeStock,
        categoryMap,
        onProgress: (done, total) => setProgress(Math.round(done / total * 100))
      });
      setSummary(result);
      if (result.inserted + result.updated > 0) {
        toast.success(`Imported ${result.inserted} new, updated ${result.updated}`);
        onImported?.();
      }
      if (result.failed > 0) toast.error(`${result.failed} rows failed`);
    } catch (e) {
      toast.error(e?.message ?? "Import failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) reset();
    onOpenChange(v);
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-[95vw] sm:max-w-2xl max-h-[92dvh] overflow-y-auto p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base sm:text-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-5 w-5 text-primary shrink-0" }),
      " Import from Vyapar"
    ] }) }),
    !parsed && !summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 sm:px-6 sm:py-10 text-center transition-colors hover:bg-muted/50", children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: busy ? "Reading file…" : "Choose Vyapar export (.xlsx or .csv)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auto-detects Name, Code, Sale Price, Purchase Price, Stock, Tax" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            accept: ".xlsx,.xls,.csv",
            className: "hidden",
            disabled: busy,
            onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] leading-relaxed text-muted-foreground", children: [
        "Tip: in Vyapar mobile app go to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Reports → Item Report" }),
        " and Export Excel. We'll clean broken rows, normalize numbers, remove duplicates, and auto-suggest categories."
      ] })
    ] }),
    parsed && !summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 sm:space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Products", value: parsed.rows.length, tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Duplicates", value: parsed.duplicates }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Missing price", value: parsed.missingPrice, tone: parsed.missingPrice > 0 ? "warn" : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Skipped rows", value: parsed.skipped })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-2.5 sm:p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Detected columns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          Object.entries(parsed.headerMap).map(([raw, field]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[9px] sm:text-[10px]", children: [
            raw,
            " → ",
            field
          ] }, raw)),
          Object.keys(parsed.headerMap).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "No standard headers matched — please ensure first row has column titles." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Import mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: mode, onValueChange: (v) => setMode(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "text-xs sm:text-sm h-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "merge", children: "Merge — update existing, add new" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "replace", children: "Replace — overwrite all matching fields" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "skip", children: "Skip duplicates — only insert new products" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "stock_only", children: "Recalculate stock — sync Vyapar stock to existing products only" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between rounded-lg border border-border px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm", children: "Include stock quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: includeStock, onCheckedChange: setIncludeStock, disabled: mode === "stock_only" })
        ] })
      ] }),
      stockPreview && stockPreview.length > 0 && includeStock && mode !== "skip" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-2.5 sm:p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Stock preview · Vyapar → ERP after import" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-auto rounded-md border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[10px] sm:text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1 text-left", children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1 text-right", children: "Now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1 text-right", children: "After" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1 text-left", children: "Match" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stockPreview.slice(0, 20).map((p, i) => {
            const changed = p.currentStock !== null && p.currentStock !== p.importedStock;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 truncate max-w-[140px]", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-right text-muted-foreground", children: p.currentStock ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-2 py-1 text-right font-medium ${changed ? "text-primary" : ""}`, children: p.importedStock }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1 text-[9px] uppercase tracking-wider text-muted-foreground", children: p.match })
            ] }, i);
          }) })
        ] }) }),
        stockPreview.length > 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-center text-[9px] text-muted-foreground", children: [
          "+",
          stockPreview.length - 20,
          " more rows will be synced"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[10px] leading-relaxed text-muted-foreground", children: [
          "Stock is ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "replaced" }),
          " with the imported value — never added or subtracted. Matching priority: barcode → item code → exact name."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-h-48 overflow-hidden p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[10px] sm:text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-1 bg-muted/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap", children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap", children: "Sale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap", children: "Buy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-right whitespace-nowrap", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-1.5 sm:px-2 py-1.5 text-left whitespace-nowrap", children: "Category" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: parsed.rows.slice(0, 30).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1.5 sm:px-2 py-1 truncate max-w-[120px] sm:max-w-[180px]", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1.5 sm:px-2 py-1 text-muted-foreground", children: r.item_code ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1.5 sm:px-2 py-1 text-right whitespace-nowrap", children: r.price.toFixed(2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1.5 sm:px-2 py-1 text-right text-muted-foreground whitespace-nowrap", children: r.purchase_price ? r.purchase_price.toFixed(2) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-1.5 sm:px-2 py-1 text-right font-medium whitespace-nowrap ${r.stock > 0 ? "" : "text-muted-foreground"}`, children: r.stock }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-1.5 sm:px-2 py-1 whitespace-nowrap", children: r.category_hint ?? "—" })
          ] }, i)) })
        ] }) }),
        parsed.rows.length > 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "border-t border-border/40 px-2 py-1.5 text-center text-[9px] sm:text-[10px] text-muted-foreground", children: [
          "+",
          parsed.rows.length - 30,
          " more rows…"
        ] })
      ] }),
      busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
          "Importing… ",
          progress,
          "%"
        ] })
      ] })
    ] }),
    summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3 sm:p-4 text-emerald-700 dark:text-emerald-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Import complete" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "New products", value: summary.inserted, tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Updated", value: summary.updated }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Stock units", value: Math.round(summary.stockImported) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Duplicates", value: parsed?.duplicates ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Missing price", value: parsed?.missingPrice ?? 0, tone: (parsed?.missingPrice ?? 0) > 0 ? "warn" : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Failed", value: summary.failed, tone: summary.failed > 0 ? "danger" : void 0 })
      ] }),
      summary.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-2.5 sm:p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1 flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-rose-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
          " Errors"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5 text-[10px] sm:text-xs text-muted-foreground", children: summary.errors.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          e
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2", children: summary ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => onOpenChange(false), className: "w-full text-xs sm:text-sm", children: "Done" }) : parsed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: reset, disabled: busy, className: "text-xs sm:text-sm whitespace-normal h-auto py-2", children: "Choose another file" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: runImport, disabled: busy || parsed.rows.length === 0, className: "text-xs sm:text-sm whitespace-normal h-auto py-2", children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "me-1 h-4 w-4 animate-spin shrink-0" }),
        "Import ",
        parsed.rows.length,
        " products"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), className: "text-xs sm:text-sm", children: "Cancel" }) })
  ] }) });
}
function StatPill({ label, value, tone }) {
  const cls = tone === "primary" ? "bg-primary/10 text-primary" : tone === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : tone === "warn" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-muted text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl px-2.5 sm:px-3 py-2 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-lg font-bold leading-tight", children: value })
  ] });
}
function ProductGalleryUpload({
  mainUrl,
  gallery,
  onMainChange,
  onGalleryChange,
  searchHints,
  maxImages = 6
}) {
  const galleryRef = reactExports.useRef(null);
  const cameraRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [findOpen, setFindOpen] = reactExports.useState(false);
  const all = [mainUrl, ...gallery].filter(Boolean);
  const remaining = Math.max(0, maxImages - all.length);
  const canSearch = !!(searchHints?.name || searchHints?.barcode || searchHints?.brand || searchHints?.itemCode);
  const attachUrl = (url) => {
    if (!mainUrl) {
      onMainChange(url);
    } else if (gallery.length < maxImages - 1) {
      onGalleryChange([...gallery, url]);
    } else {
      toast.message(`Up to ${maxImages} images per product`);
    }
  };
  const handleFiles = async (files) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, remaining || 1);
    if (!list.length) {
      toast.message(`Up to ${maxImages} images per product`);
      return;
    }
    setBusy(true);
    try {
      for (const file of list) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name} > 20 MB`);
          continue;
        }
        const url = await uploadProductImage(file);
        attachUrl(url);
      }
      toast.success(list.length > 1 ? `${list.length} images added` : "Image added");
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  const setAsMain = (url) => {
    if (url === mainUrl) return;
    const nextGallery = gallery.filter((u) => u !== url);
    if (mainUrl) nextGallery.unshift(mainUrl);
    onMainChange(url);
    onGalleryChange(nextGallery.slice(0, maxImages - 1));
  };
  const removeImage = (url) => {
    if (url === mainUrl) {
      const [next, ...rest] = gallery;
      onMainChange(next ?? null);
      onGalleryChange(rest);
    } else {
      onGalleryChange(gallery.filter((u) => u !== url));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/30", children: [
      mainUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: mainUrl, alt: "Main", loading: "lazy", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-7 w-7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No image yet" })
      ] }),
      busy && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }),
      !mainUrl && canSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setFindOpen(true),
          className: "absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-primary to-primary-glow px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            " Find Image"
          ]
        }
      ),
      mainUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-500 text-amber-500" }),
        " Main"
      ] })
    ] }),
    all.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      all.map((url) => {
        const isMain = url === mainUrl;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "group relative h-16 w-16 overflow-hidden rounded-lg border bg-muted/40",
              isMain ? "border-primary ring-2 ring-primary/30" : "border-border"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 hidden items-end justify-between gap-0.5 bg-gradient-to-t from-black/70 to-transparent p-1 group-hover:flex group-active:flex", children: [
                !isMain && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAsMain(url),
                    title: "Set as main",
                    className: "rounded-full bg-white/90 p-1 text-amber-600 active:scale-90",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeImage(url),
                    title: "Remove",
                    className: "ml-auto rounded-full bg-white/90 p-1 text-rose-600 active:scale-90",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] })
            ]
          },
          url
        );
      }),
      remaining > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => galleryRef.current?.click(),
          disabled: busy,
          className: "flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px]", children: "Add" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: galleryRef,
        type: "file",
        accept: "image/*",
        multiple: true,
        className: "hidden",
        onChange: (e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: cameraRef,
        type: "file",
        accept: "image/*",
        capture: "environment",
        className: "hidden",
        onChange: (e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy || remaining === 0,
          onClick: () => cameraRef.current?.click(),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
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
          disabled: busy || remaining === 0,
          onClick: () => galleryRef.current?.click(),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            " Gallery"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy || !canSearch || remaining === 0,
          onClick: () => setFindOpen(true),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
            " Find"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
      all.length,
      "/",
      maxImages,
      " images · stored as URLs (files live on the CDN, not the database). Tap a thumbnail to set as main or remove."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindProductImageDialog,
      {
        open: findOpen,
        onOpenChange: setFindOpen,
        name: searchHints?.name,
        barcode: searchHints?.barcode,
        brand: searchHints?.brand,
        itemCode: searchHints?.itemCode,
        onPicked: (url) => attachUrl(url)
      }
    )
  ] });
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function computeRange(mode, anchor, from, to) {
  if (mode === "custom") {
    const s = /* @__PURE__ */ new Date(`${from}T00:00:00`);
    const e = /* @__PURE__ */ new Date(`${to}T00:00:00`);
    e.setDate(e.getDate() + 1);
    return { start: s, end: e };
  }
  const base = /* @__PURE__ */ new Date(`${anchor}T00:00:00`);
  if (mode === "daily") {
    const end2 = new Date(base);
    end2.setDate(end2.getDate() + 1);
    return { start: base, end: end2 };
  }
  if (mode === "weekly") {
    const start2 = new Date(base);
    const dow = start2.getDay();
    start2.setDate(start2.getDate() - dow);
    const end2 = new Date(start2);
    end2.setDate(end2.getDate() + 7);
    return { start: start2, end: end2 };
  }
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  return { start, end };
}
const fmtSAR = (n) => `SAR ${Math.round(n).toLocaleString("en-US")}`;
function WholesaleTotalSaleCard() {
  const today = toISODate(/* @__PURE__ */ new Date());
  const [mode, setMode] = reactExports.useState("daily");
  const [anchor, setAnchor] = reactExports.useState(today);
  const [from, setFrom] = reactExports.useState(today);
  const [to, setTo] = reactExports.useState(today);
  const { start, end } = reactExports.useMemo(
    () => computeRange(mode, anchor, from, to),
    [mode, anchor, from, to]
  );
  const { data, isFetching } = useQuery({
    queryKey: ["wh-total-sale", mode, start.toISOString(), end.toISOString()],
    staleTime: 6e4,
    queryFn: async () => {
      const { data: data2, error } = await supabase.from("shop_sales").select("total").eq("is_deleted", false).gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
      if (error) throw error;
      return (data2 ?? []).reduce(
        (s, r) => s + Number(r.total ?? 0),
        0
      );
    }
  });
  const total = data ?? 0;
  const MODES = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "custom", label: "Custom" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground", children: "Total Sale" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold leading-none tabular-nums text-emerald-700 dark:text-emerald-400", children: isFetching ? "…" : fmtSAR(total) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setMode(m.key),
        className: `shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${mode === m.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
        children: m.label
      },
      m.key
    )) }),
    mode !== "custom" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "date",
        value: anchor,
        onChange: (e) => setAnchor(e.target.value || today),
        className: "h-9 text-[12px]"
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          value: from,
          onChange: (e) => setFrom(e.target.value || today),
          className: "h-9 text-[12px]"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          value: to,
          onChange: (e) => setTo(e.target.value || today),
          className: "h-9 text-[12px]"
        }
      )
    ] })
  ] });
}
function WholesaleReturnsMiniCard() {
  const q = useQuery({
    queryKey: ["wholesale-returns-mini"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales_returns").select("created_at,return_value").order("created_at", { ascending: false }).limit(1e3);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
  const now = /* @__PURE__ */ new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const rows = q.data ?? [];
  const today = rows.filter((r) => r.created_at >= dayStart).reduce((s, r) => s + Number(r.return_value), 0);
  const monthly = rows.filter((r) => r.created_at >= monthStart).reduce((s, r) => s + Number(r.return_value), 0);
  const total = rows.reduce((s, r) => s + Number(r.return_value), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-amber-200/60 bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-950/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales-return", className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300", children: "Sales Returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Tap to view full history" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat$1, { label: "Today", value: SAR(today) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat$1, { label: "This Month", value: SAR(monthly) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat$1, { label: "Total", value: SAR(total) })
    ] })
  ] }) });
}
function Stat$1({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-background/70 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-700 dark:text-amber-300", children: value })
  ] });
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
const BRAND_DEFAULT = "Azzouz WholeSale";
async function renderPaymentReceiptImage(p) {
  const W = 1080;
  const PAD = 56;
  const currency = p.currency ?? "SAR";
  const accent = "#047857";
  const accentSoft = "#ecfdf5";
  const hasNotes = !!(p.notes && p.notes.trim());
  const H = hasNotes ? 1100 : 980;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";
  roundRect(ctx, PAD, PAD, W - PAD * 2, 260, 28);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.font = "800 36px Inter, system-ui, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD + 32, PAD + 32);
  ctx.fillStyle = accent;
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("PAYMENT RECEIPT", PAD + 32, PAD + 80);
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "800 34px Inter, sans-serif";
  ctx.fillText(`#${p.receiptNumber}`, W - PAD - 32, PAD + 32);
  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText(p.date, W - PAD - 32, PAD + 78);
  ctx.textAlign = "left";
  ctx.fillStyle = "#666";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("CUSTOMER", PAD + 32, PAD + 140);
  ctx.fillStyle = "#111";
  ctx.font = "700 28px Inter, sans-serif";
  ctx.fillText(p.customerName, PAD + 32, PAD + 168);
  if (p.customerMobile) {
    ctx.fillStyle = "#555";
    ctx.font = "500 22px Inter, sans-serif";
    ctx.fillText(p.customerMobile, PAD + 32, PAD + 206);
  }
  const ay = 360;
  roundRect(ctx, PAD, ay, W - PAD * 2, 200, 24);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("PAYMENT RECEIVED", PAD + 32, ay + 28);
  ctx.font = "800 80px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.amount.toFixed(2)}`, PAD + 32, ay + 64);
  ctx.textAlign = "right";
  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillText(`via ${p.method.toUpperCase()}`, W - PAD - 32, ay + 28);
  ctx.textAlign = "left";
  const dy = 600;
  const oldBal = p.previousDue ?? 0;
  const newBal = p.newDue ?? oldBal - p.amount;
  roundRect(ctx, PAD, dy, W - PAD * 2, 220, 22);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText("Old Balance", PAD + 32, dy + 24);
  ctx.fillText("Payment Received", PAD + 32, dy + 78);
  ctx.fillText("New Balance", PAD + 32, dy + 150);
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "700 24px Inter, sans-serif";
  ctx.fillText(`${currency} ${oldBal.toFixed(2)}`, W - PAD - 32, dy + 22);
  ctx.fillStyle = accent;
  ctx.fillText(`− ${currency} ${p.amount.toFixed(2)}`, W - PAD - 32, dy + 76);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 24, dy + 130);
  ctx.lineTo(W - PAD - 24, dy + 130);
  ctx.stroke();
  ctx.font = "800 30px Inter, sans-serif";
  ctx.fillStyle = newBal > 0 ? "#dc2626" : accent;
  ctx.fillText(`${currency} ${newBal.toFixed(2)}`, W - PAD - 32, dy + 146);
  ctx.textAlign = "left";
  if (hasNotes) {
    const ny = dy + 240;
    roundRect(ctx, PAD, ny, W - PAD * 2, 100, 18);
    ctx.fillStyle = "#f8fafc";
    ctx.fill();
    ctx.fillStyle = "#666";
    ctx.font = "700 16px Inter, sans-serif";
    ctx.fillText("NOTE", PAD + 24, ny + 18);
    ctx.fillStyle = "#111";
    ctx.font = "500 20px Inter, sans-serif";
    const note = p.notes.trim();
    ctx.fillText(note.length > 90 ? note.slice(0, 87) + "…" : note, PAD + 24, ny + 48);
  }
  ctx.fillStyle = "#666";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD, H - 70);
  ctx.textAlign = "right";
  ctx.fillText((/* @__PURE__ */ new Date()).toLocaleString(), W - PAD, H - 70);
  ctx.textAlign = "center";
  ctx.fillStyle = "#999";
  ctx.font = "500 14px Inter, sans-serif";
  ctx.fillText("Thank you for your payment", W / 2, H - 34);
  ctx.textAlign = "left";
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png", 0.95);
  });
}
async function sharePaymentReceipt(p) {
  try {
    const blob = await renderPaymentReceiptImage(p);
    const fileName = `payment_${p.receiptNumber}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const caption = `Payment Receipt #${p.receiptNumber} — ${p.customerName} · ${p.currency ?? "SAR"} ${p.amount.toFixed(2)}`;
    const nav = navigator;
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: caption });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Receipt downloaded");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e) {
    if (e?.name === "AbortError") return;
    console.error(e);
    toast.error("Could not share receipt");
  }
}
async function renderStatementImage(p) {
  const W = 1080;
  const PAD = 56;
  const currency = p.currency ?? "SAR";
  const accent = "#1d4ed8";
  const accentSoft = "#eff6ff";
  const off = document.createElement("canvas").getContext("2d");
  off.font = "600 18px Inter";
  const rowH = 70;
  const rows = p.rows.slice(0, 40);
  const headerH = 300;
  const summaryH = 200;
  const tableH = 70 + rows.length * rowH + 30;
  const H = headerH + tableH + summaryH + 120;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";
  roundRect(ctx, PAD, PAD, W - PAD * 2, headerH - 30, 28);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.font = "800 36px Inter, system-ui, sans-serif";
  ctx.fillText(p.brand ?? BRAND_DEFAULT, PAD + 32, PAD + 32);
  ctx.fillStyle = accent;
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("CUSTOMER STATEMENT", PAD + 32, PAD + 80);
  ctx.fillStyle = "#666";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("CUSTOMER", PAD + 32, PAD + 140);
  ctx.fillStyle = "#111";
  ctx.font = "700 30px Inter, sans-serif";
  ctx.fillText(p.customerName, PAD + 32, PAD + 168);
  if (p.customerMobile) {
    ctx.fillStyle = "#555";
    ctx.font = "500 22px Inter, sans-serif";
    ctx.fillText(p.customerMobile, PAD + 32, PAD + 208);
  }
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText((/* @__PURE__ */ new Date()).toLocaleDateString(), W - PAD - 32, PAD + 32);
  ctx.textAlign = "left";
  let y = PAD + headerH;
  roundRect(ctx, PAD, y, W - PAD * 2, tableH - 20, 22);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#888";
  ctx.font = "700 16px Inter, sans-serif";
  ctx.fillText("DATE", PAD + 24, y + 22);
  ctx.fillText("ACTIVITY", PAD + 170, y + 22);
  ctx.textAlign = "right";
  ctx.fillText("DEBIT", W - PAD - 360, y + 22);
  ctx.fillText("CREDIT", W - PAD - 200, y + 22);
  ctx.fillText("BALANCE", W - PAD - 28, y + 22);
  ctx.textAlign = "left";
  let ry = y + 60;
  ctx.fillStyle = "#111";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText("Opening", PAD + 24, ry);
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText("Previous balance", PAD + 170, ry);
  ctx.textAlign = "right";
  ctx.font = "700 20px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.opening.toFixed(2)}`, W - PAD - 28, ry);
  ctx.textAlign = "left";
  ry += rowH;
  for (const r of rows) {
    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(PAD + 24, ry - 8);
    ctx.lineTo(W - PAD - 24, ry - 8);
    ctx.stroke();
    ctx.fillStyle = "#444";
    ctx.font = "500 16px Inter, sans-serif";
    ctx.fillText(r.date, PAD + 24, ry);
    ctx.fillStyle = "#111";
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillText(r.label, PAD + 170, ry);
    if (r.sub) {
      ctx.fillStyle = "#888";
      ctx.font = "500 14px Inter, sans-serif";
      ctx.fillText(r.sub.slice(0, 60), PAD + 170, ry + 24);
    }
    ctx.textAlign = "right";
    ctx.font = "600 18px Inter, sans-serif";
    if (r.debit) {
      ctx.fillStyle = "#b91c1c";
      ctx.fillText(r.debit.toFixed(2), W - PAD - 360, ry);
    }
    if (r.credit) {
      ctx.fillStyle = accent;
      ctx.fillText(r.credit.toFixed(2), W - PAD - 200, ry);
    }
    ctx.fillStyle = "#111";
    ctx.font = "700 20px Inter, sans-serif";
    ctx.fillText(r.balance.toFixed(2), W - PAD - 28, ry);
    ctx.textAlign = "left";
    ry += rowH;
  }
  const sy = y + tableH;
  roundRect(ctx, PAD, sy, W - PAD * 2, summaryH - 20, 24);
  ctx.fillStyle = accentSoft;
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#555";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText("Total sales", PAD + 32, sy + 28);
  ctx.fillText("Total paid", PAD + 32, sy + 68);
  ctx.textAlign = "right";
  ctx.fillStyle = "#111";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.totalSales.toFixed(2)}`, W - PAD - 32, sy + 26);
  ctx.fillText(`${currency} ${p.totalPaid.toFixed(2)}`, W - PAD - 32, sy + 66);
  ctx.textAlign = "left";
  const tby = sy + 110;
  roundRect(ctx, PAD + 16, tby, W - PAD * 2 - 32, 64, 18);
  ctx.fillStyle = p.currentDue > 0 ? "#dc2626" : accent;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText("CURRENT DUE", PAD + 40, tby + 20);
  ctx.textAlign = "right";
  ctx.font = "800 32px Inter, sans-serif";
  ctx.fillText(`${currency} ${p.currentDue.toFixed(2)}`, W - PAD - 40, tby + 14);
  ctx.textAlign = "left";
  ctx.fillStyle = "#999";
  ctx.font = "500 14px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${p.brand ?? BRAND_DEFAULT} · Generated ${(/* @__PURE__ */ new Date()).toLocaleString()}`, W / 2, H - 38);
  ctx.textAlign = "left";
  return await new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png", 0.95);
  });
}
async function shareStatement(p) {
  try {
    const blob = await renderStatementImage(p);
    const fileName = `statement_${p.customerName.replace(/\s+/g, "_")}_${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });
    const caption = `Customer Statement — ${p.customerName} · Due ${p.currency ?? "SAR"} ${p.currentDue.toFixed(2)}`;
    const nav = navigator;
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], text: caption });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Statement downloaded");
    window.open(`https://wa.me/?text=${encodeURIComponent(caption)}`, "_blank");
  } catch (e) {
    if (e?.name === "AbortError") return;
    console.error(e);
    toast.error("Could not share statement");
  }
}
function PosPaymentInDialog({ open, onOpenChange, initialCustomer }) {
  const qc = useQueryClient();
  const [customer, setCustomer] = reactExports.useState(initialCustomer ?? null);
  const [amount, setAmount] = reactExports.useState("");
  const [method, setMethod] = reactExports.useState("cash");
  const [notes, setNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (open) {
      setCustomer(initialCustomer ?? null);
      setAmount("");
      setMethod("cash");
      setNotes("");
    }
  }, [open, initialCustomer]);
  const balance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer.id)
  });
  const save = useMutation({
    mutationFn: async (alsoShare) => {
      if (!customer) throw new Error("Pick a customer");
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { data, error } = await supabase.from("pos_payments").insert({
        customer_id: customer.id,
        amount: amt,
        method,
        notes: notes.trim() || null,
        kind: "payment_in"
      }).select("*").single();
      if (error) throw error;
      return { row: data, alsoShare, prev: balance.data?.current_due ?? 0 };
    },
    onSuccess: async ({ row, alsoShare, prev }) => {
      traceWholesaleFlow("mutation success", { type: "payment_in", id: row.id });
      qc.setQueryData(["pos-customer-due-map"], (old) => {
        const next = new Map(old ?? []);
        next.set(customer.id, (next.get(customer.id) ?? prev) - Number(row.amount ?? 0));
        return next;
      });
      qc.setQueryData(["pos-balance", customer.id], (old) => old ? {
        ...old,
        total_paid: Number(old.total_paid ?? 0) + Number(row.amount ?? 0),
        current_due: Number(old.current_due ?? prev) - Number(row.amount ?? 0)
      } : old);
      qc.setQueryData(["wh-recent-entries", 20], (old = []) => [{
        id: `payment_in-${row.id}`,
        refId: row.id,
        kind: "payment_in",
        title: customer.name,
        subtitle: row.notes || "Payment received",
        amount: Number(row.amount ?? 0),
        at: row.created_at
      }, ...old].slice(0, 20));
      refreshWholesaleDataInBackground(qc);
      toast.success("Payment recorded");
      onOpenChange(false);
      if (alsoShare && customer) {
        await sharePaymentReceipt({
          receiptNumber: String(row.id).slice(0, 8).toUpperCase(),
          date: new Date(row.created_at).toLocaleDateString(),
          customerName: customer.name,
          customerMobile: customer.phone ?? void 0,
          amount: Number(row.amount),
          method: row.method,
          notes: row.notes ?? void 0,
          previousDue: prev,
          newDue: prev - Number(row.amount)
        });
      }
    },
    onError: (e) => {
      traceWholesaleFlow("mutation failed", { type: "payment_in", message: e?.message });
      toast.error(e?.message ?? "Failed");
    }
  });
  const prevDue = balance.data?.current_due ?? 0;
  const newDue = prevDue - (Number(amount) || 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-emerald-600" }),
      "Payment In"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PosCustomerPicker, { value: customer, onChange: setCustomer, showDue: true, dueByCustomer: customer ? /* @__PURE__ */ new Map([[customer.id, prevDue]]) : void 0 }),
      customer && balance.data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Current due" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
            "SAR ",
            prevDue.toFixed(2)
          ] })
        ] }),
        amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between border-t border-border/60 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "After this payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: newDue > 0 ? "font-bold text-rose-600" : "font-bold text-emerald-600", children: [
            "SAR ",
            newDue.toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: "Amount *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              type: "number",
              step: "0.01",
              inputMode: "decimal",
              placeholder: "0.00",
              className: "h-11 text-lg font-bold"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: "Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: method, onValueChange: setMethod, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pos", children: "POS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bank", children: "Bank transfer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Notes (optional)", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) }),
      newDue < 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
        "Payment exceeds current due — customer will have credit balance."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-border bg-muted/20 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: save.isPending, onClick: () => save.mutate(true), className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
        " Save & Share"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => save.mutate(false), children: "Save payment" })
    ] })
  ] }) });
}
function PosCustomerStatementDialog({ open, onOpenChange, customer, onPaymentIn }) {
  const qc = useQueryClient();
  const { isAdmin, isManager } = useUserAccess();
  const canEditOpening = isAdmin || isManager;
  const confirm2 = useConfirm();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editValue, setEditValue] = reactExports.useState("");
  const [editNote, setEditNote] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (editOpen && customer) {
      setEditValue(String(customer.opening_due ?? 0));
      setEditNote("");
    }
  }, [editOpen, customer]);
  async function handleSaveOpening() {
    if (!customer) return;
    const next = Number(editValue);
    if (!Number.isFinite(next) || next < 0) {
      toast.error("Enter a valid opening balance");
      return;
    }
    const old = Number(customer.opening_due ?? 0);
    if (next === old) {
      setEditOpen(false);
      return;
    }
    const ok = await confirm2({
      tone: "warning",
      title: "Update opening balance?",
      description: `Change from SAR ${old.toFixed(2)} to SAR ${next.toFixed(2)}. Ledger history stays intact; only the base balance changes.`,
      confirmText: "Update"
    });
    if (!ok) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("pos_customers").update({ opening_due: next }).eq("id", customer.id);
      if (error) throw error;
      await supabase.from("pos_customer_opening_edits").insert({
        customer_id: customer.id,
        old_value: old,
        new_value: next,
        note: editNote || null
      });
      toast.success("Opening balance updated");
      setEditOpen(false);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["pos-balance", customer.id] }),
        qc.invalidateQueries({ queryKey: ["pos-customers"] }),
        qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] }),
        qc.invalidateQueries({ queryKey: ["warehouse-financial"] })
      ]);
      customer.opening_due = next;
    } catch (e) {
      toast.error(e?.message || "Failed to update opening balance");
    } finally {
      setSaving(false);
    }
  }
  const balance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer.id)
  });
  const sales = useQuery({
    queryKey: ["pos-cust-sales", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_sales").select("id,invoice_number,total,paid_amount,due_amount,txn_date,created_at,status,payment_method").eq("customer_id", customer.id).eq("is_deleted", false).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const payments = useQuery({
    queryKey: ["pos-cust-payments", customer?.id],
    enabled: open && !!customer?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("pos_payments").select("id,amount,method,txn_date,created_at,kind,notes,sale_id").eq("customer_id", customer.id).order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });
  const rows = reactExports.useMemo(() => {
    if (!customer) return [];
    const items = [];
    for (const s of sales.data ?? []) {
      if (s.status === "cancelled") continue;
      items.push({
        ts: s.created_at,
        date: new Date(s.created_at).toLocaleDateString(),
        label: `Sale #${s.invoice_number}`,
        sub: `Paid ${Number(s.paid_amount).toFixed(2)} · Due ${Number(s.due_amount).toFixed(2)}`,
        debit: Number(s.total)
      });
      if (Number(s.paid_amount) > 0) {
        items.push({
          ts: s.created_at,
          date: new Date(s.created_at).toLocaleDateString(),
          label: `Sale payment`,
          sub: `Via ${s.payment_method}`,
          credit: Number(s.paid_amount)
        });
      }
    }
    for (const p of payments.data ?? []) {
      if (p.kind === "sale_partial") continue;
      items.push({
        ts: p.created_at,
        date: new Date(p.created_at).toLocaleDateString(),
        label: p.kind === "refund" ? "Refund" : "Payment In",
        sub: p.notes ?? `via ${p.method}`,
        credit: Number(p.amount)
      });
    }
    items.sort((a, b) => a.ts.localeCompare(b.ts));
    let bal = customer.opening_due;
    const out = [];
    for (const it of items) {
      bal += (it.debit ?? 0) - (it.credit ?? 0);
      out.push({ date: it.date, label: it.label, sub: it.sub, debit: it.debit, credit: it.credit, balance: bal });
    }
    return out;
  }, [customer, sales.data, payments.data]);
  async function handleShare() {
    if (!customer || !balance.data) return;
    await shareStatement({
      customerName: customer.name,
      customerMobile: customer.phone ?? void 0,
      opening: customer.opening_due,
      rows,
      currentDue: balance.data.current_due,
      totalPaid: balance.data.total_paid,
      totalSales: balance.data.total_sales
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg gap-0 overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
        customer?.name ?? "Customer",
        " statement"
      ] }) }),
      !customer ? null : balance.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Opening", value: customer.opening_due }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total paid", value: balance.data?.total_paid ?? 0, tone: "success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Current due", value: balance.data?.current_due ?? 0, tone: balance.data && balance.data.current_due > 0 ? "danger" : "success", highlight: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Opening balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                "SAR ",
                customer.opening_due.toFixed(2)
              ] }),
              canEditOpening && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  className: "h-7 w-7",
                  onClick: () => setEditOpen(true),
                  title: "Edit opening balance",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] }),
          rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-6 text-center text-sm text-muted-foreground", children: "No activity yet" }) : rows.slice().reverse().map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: r.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
                r.date,
                r.sub ? ` · ${r.sub}` : ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              r.debit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-rose-600", children: [
                "+",
                r.debit.toFixed(2)
              ] }) : null,
              r.credit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-emerald-600", children: [
                "-",
                r.credit.toFixed(2)
              ] }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                "Bal ",
                r.balance.toFixed(2)
              ] })
            ] })
          ] }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 border-t border-border bg-muted/20 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onPaymentIn, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mr-1 h-4 w-4" }),
          " Payment In"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleShare, className: "bg-emerald-600 text-white hover:bg-emerald-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1 h-4 w-4" }),
          " Share statement"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Edit opening balance" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-medium text-muted-foreground", children: "Opening balance (SAR)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              inputMode: "decimal",
              value: editValue,
              onChange: (e) => setEditValue(e.target.value),
              min: 0,
              step: "0.01"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-medium text-muted-foreground", children: "Note (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              rows: 2,
              value: editNote,
              onChange: (e) => setEditNote(e.target.value),
              placeholder: "Reason for adjustment"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md bg-muted/40 px-2 py-1.5 text-[11px] text-muted-foreground", children: "Ledger entries stay unchanged. Current due will recalculate as: opening + sales due − payments in." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditOpen(false), disabled: saving, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSaveOpening, disabled: saving, children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }) : null,
          "Save"
        ] })
      ] })
    ] }) })
  ] });
}
function Stat({ label, value, tone, highlight }) {
  const color = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-rose-600" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border border-border ${highlight ? "bg-primary/5" : "bg-card"} px-2 py-2 text-center`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-0.5 text-sm font-bold ${color}`, children: value.toFixed(2) })
  ] });
}
const empty = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  vat_number: "",
  opening_due: "0"
};
function PosCustomerAddDialog({ open, onOpenChange, onCreated }) {
  const qc = useQueryClient();
  const [f, setF] = reactExports.useState({ ...empty });
  reactExports.useEffect(() => {
    if (open) setF({ ...empty });
  }, [open]);
  const save = useMutation({
    mutationFn: async () => {
      const name = f.name.trim();
      if (!name) throw new Error("Customer name required");
      const payload = {
        name,
        phone: f.phone.trim() || null,
        address: f.address.trim() || null,
        notes: f.notes.trim() || null,
        vat_number: f.vat_number.trim() || null,
        opening_due: Number(f.opening_due) || 0
      };
      const { data, error } = await supabase.from("pos_customers").insert(payload).select("id").single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["pos-customers"] });
      qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
      qc.invalidateQueries({ queryKey: ["pos-due-map"] });
      toast.success("Customer added");
      onCreated?.(id);
      onOpenChange(false);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5 text-primary" }),
      " Add customer"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Customer name *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: f.name, onChange: (e) => setF({ ...f, name: e.target.value }), placeholder: "Full name", autoFocus: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Mobile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: f.phone, onChange: (e) => setF({ ...f, phone: e.target.value }), inputMode: "tel", placeholder: "05xxxxxxxx" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: f.address, onChange: (e) => setF({ ...f, address: e.target.value }), placeholder: "Optional" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Tax / VAT number", hint: "Used on B2B invoices (ZATCA)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: f.vat_number, onChange: (e) => setF({ ...f, vat_number: e.target.value }), placeholder: "Optional" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Opening balance (SAR)", hint: "Previous due owed by customer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          inputMode: "decimal",
          step: "0.01",
          value: f.opening_due,
          onChange: (e) => setF({ ...f, opening_due: e.target.value })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field$2, { label: "Notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: f.notes, onChange: (e) => setF({ ...f, notes: e.target.value }), placeholder: "Optional" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => save.mutate(), children: save.isPending ? "Saving…" : "Save customer" })
    ] })
  ] }) });
}
function Field$2({ label, hint, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10.5px] text-muted-foreground", children: hint })
  ] });
}
const TAG_OPTIONS = [
  { key: "vip", label: "VIP", cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  { key: "cash", label: "Cash Customer", cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" },
  { key: "credit", label: "Credit Customer", cls: "bg-sky-500/15 text-sky-700 border-sky-500/30" },
  { key: "blocked", label: "Blocked", cls: "bg-rose-500/15 text-rose-700 border-rose-500/30" }
];
function PosCustomerDetailsDialog({
  open,
  onOpenChange,
  customerId,
  onPaymentIn,
  onViewStatement,
  onNewSale
}) {
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const { isAdmin, isManager } = useUserAccess();
  const canEditOpening = isAdmin || isManager;
  const [editing, setEditing] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(null);
  const customer = useQuery({
    queryKey: ["pos-customer-detail", customerId],
    enabled: open && !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("pos_customers").select("*").eq("id", customerId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const balance = useQuery({
    queryKey: ["pos-customer-balance", customerId],
    enabled: open && !!customerId,
    queryFn: () => fetchCustomerBalance(customerId)
  });
  const lastPayment = useQuery({
    queryKey: ["pos-customer-last-payment", customerId],
    enabled: open && !!customerId,
    queryFn: async () => {
      const { data, error } = await supabase.from("pos_payments").select("txn_date,created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const historyCounts = useQuery({
    queryKey: ["pos-customer-history-counts", customerId],
    enabled: open && !!customerId,
    queryFn: async () => {
      const [sales, payments, returns] = await Promise.all([
        supabase.from("shop_sales").select("id", { count: "exact", head: true }).eq("customer_id", customerId),
        supabase.from("pos_payments").select("id", { count: "exact", head: true }).eq("customer_id", customerId),
        supabase.from("sales_returns").select("id", { count: "exact", head: true }).eq("customer_id", customerId)
      ]);
      if (sales.error) throw sales.error;
      if (payments.error) throw payments.error;
      if (returns.error) throw returns.error;
      return {
        sales: sales.count ?? 0,
        payments: payments.count ?? 0,
        returns: returns.count ?? 0
      };
    }
  });
  reactExports.useEffect(() => {
    if (!open) {
      setEditing(false);
      setDraft(null);
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (editing && customer.data) {
      const c2 = customer.data;
      setDraft({
        name: c2.name ?? "",
        phone: c2.phone ?? "",
        vat_number: c2.vat_number ?? "",
        address: c2.address ?? "",
        notes: c2.notes ?? "",
        opening_due: String(c2.opening_due ?? 0),
        credit_limit: String(c2.credit_limit ?? 0),
        tags: Array.isArray(c2.tags) ? [...c2.tags] : []
      });
    }
  }, [editing, customer.data]);
  const save = useMutation({
    mutationFn: async () => {
      if (!draft || !customer.data) return;
      const orig = customer.data;
      const name = draft.name.trim();
      if (!name) throw new Error("Customer name required");
      const nextOpening = Number(draft.opening_due) || 0;
      const oldOpening = Number(orig.opening_due ?? 0);
      const openingChanged = nextOpening !== oldOpening;
      if (openingChanged && !canEditOpening) {
        throw new Error("Only admin or manager can change opening balance");
      }
      const payload = {
        name,
        phone: draft.phone.trim() || null,
        vat_number: draft.vat_number.trim() || null,
        address: draft.address.trim() || null,
        notes: draft.notes.trim() || null,
        opening_due: nextOpening,
        credit_limit: Number(draft.credit_limit) || 0,
        tags: draft.tags,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const { error } = await supabase.from("pos_customers").update(payload).eq("id", orig.id);
      if (error) throw error;
      if (openingChanged) {
        await supabase.from("pos_customer_opening_edits").insert({
          customer_id: orig.id,
          old_value: oldOpening,
          new_value: nextOpening,
          note: "Updated from customer details"
        });
      }
    },
    onSuccess: () => {
      toast.success("Customer updated");
      qc.invalidateQueries({ queryKey: ["pos-customer-detail", customerId] });
      qc.invalidateQueries({ queryKey: ["pos-customer-balance", customerId] });
      qc.invalidateQueries({ queryKey: ["pos-customers"] });
      qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
      qc.invalidateQueries({ queryKey: ["pos-due-map"] });
      setEditing(false);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  async function handleDelete() {
    if (!customer.data) return;
    const counts = historyCounts.data;
    const hasHistory = !!counts && (counts.sales > 0 || counts.payments > 0 || counts.returns > 0);
    if (hasHistory) {
      toast.error("Customer has ledger history and cannot be deleted");
      return;
    }
    const ok = await confirm2({
      title: "Delete this customer?",
      description: "The customer will be moved to the recycle bin. Existing sales and payments remain unchanged.",
      tone: "warning",
      confirmText: "Delete"
    });
    if (!ok) return;
    const { error } = await softDelete("pos_customers", customer.data.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to recycle bin");
    qc.invalidateQueries({ queryKey: ["pos-customers"] });
    qc.invalidateQueries({ queryKey: ["pos-customers-admin"] });
    qc.invalidateQueries({ queryKey: ["pos-due-map"] });
    onOpenChange(false);
  }
  async function handleShareStatement() {
    if (!customer.data || !balance.data) return;
    const rows = [];
    await shareStatement({
      customerName: customer.data.name,
      customerMobile: customer.data.phone ?? void 0,
      opening: Number(customer.data.opening_due ?? 0),
      rows,
      currentDue: balance.data.current_due,
      totalPaid: balance.data.total_paid,
      totalSales: balance.data.total_sales
    });
  }
  const c = customer.data;
  const lastPaymentDate = reactExports.useMemo(() => {
    const lp = lastPayment.data;
    if (!lp) return null;
    return new Date(lp.created_at ?? lp.txn_date).toLocaleDateString();
  }, [lastPayment.data]);
  function toggleTag(key) {
    if (!draft) return;
    setDraft({
      ...draft,
      tags: draft.tags.includes(key) ? draft.tags.filter((t) => t !== key) : [...draft.tags, key]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerContent, { className: "max-h-[92dvh]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerHeader, { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerTitle, { className: "flex items-center justify-between gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: c?.name ?? "Customer" })
      ] }),
      c?.tags?.length > 0 && !editing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden gap-1 sm:flex", children: c.tags.slice(0, 3).map((tag) => {
        const opt = TAG_OPTIONS.find((t) => t.key === tag);
        if (!opt) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: cn("text-[10px]", opt.cls), children: opt.label }, tag);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: customer.isLoading || !c ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: "Current due" }),
        balance.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-1 h-8 w-32" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn(
          "text-3xl font-bold tabular-nums",
          (balance.data?.current_due ?? 0) > 0 ? "text-rose-600" : "text-emerald-700"
        ), children: [
          "SAR ",
          (balance.data?.current_due ?? 0).toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Opening", value: Number(c.opening_due ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Total sales", value: balance.data?.total_sales ?? 0, loading: balance.isLoading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Total paid", value: balance.data?.total_paid ?? 0, loading: balance.isLoading, tone: "success" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[11px] text-muted-foreground", children: [
          "Last payment: ",
          lastPayment.isLoading ? "…" : lastPaymentDate ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile$1, { icon: Wallet, label: "Payment In", onClick: () => onPaymentIn?.(c) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile$1, { icon: FileText, label: "Statement", onClick: () => onViewStatement?.(c) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile$1, { icon: ShoppingCart, label: "New Sale", onClick: () => onNewSale?.(c) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile$1, { icon: MessageCircle, label: "Share", onClick: handleShareStatement }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile$1, { icon: Pencil, label: editing ? "Editing…" : "Edit", onClick: () => setEditing(true), active: editing }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionTile$1,
          {
            icon: Trash2,
            label: historyCounts.isLoading ? "Checking…" : "Delete",
            onClick: handleDelete,
            tone: "danger",
            disabled: historyCounts.isLoading
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Basic info" }),
        editing && draft ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Customer name *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.name, onChange: (e) => setDraft({ ...draft, name: e.target.value }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Mobile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.phone, inputMode: "tel", onChange: (e) => setDraft({ ...draft, phone: e.target.value }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Tax/VAT number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.vat_number, onChange: (e) => setDraft({ ...draft, vat_number: e.target.value }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.address, onChange: (e) => setDraft({ ...draft, address: e.target.value }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: draft.notes, onChange: (e) => setDraft({ ...draft, notes: e.target.value }) }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Phone, value: c.phone ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: Hash, value: c.vat_number ?? "No VAT number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: MapPin, value: c.address ?? "—" }),
          c.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg bg-muted/40 px-2 py-1.5 text-xs", children: c.notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Financial" }),
        editing && draft ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Opening balance", hint: canEditOpening ? "Receivable auto-recalculates" : "Admin/manager only", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              inputMode: "decimal",
              step: "0.01",
              value: draft.opening_due,
              disabled: !canEditOpening,
              onChange: (e) => setDraft({ ...draft, opening_due: e.target.value })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field$1, { label: "Credit limit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              inputMode: "decimal",
              step: "0.01",
              value: draft.credit_limit,
              onChange: (e) => setDraft({ ...draft, credit_limit: e.target.value })
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Opening balance", value: `SAR ${Number(c.opening_due ?? 0).toFixed(2)}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Credit limit", value: `SAR ${Number(c.credit_limit ?? 0).toFixed(2)}` })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border border-border bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          TAG_OPTIONS.map((opt) => {
            const tags = editing && draft ? draft.tags : c.tags ?? [];
            const active = tags.includes(opt.key);
            if (!editing && !active) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: !editing,
                onClick: () => toggleTag(opt.key),
                className: cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                  active ? opt.cls : "border-border text-muted-foreground hover:border-primary/40",
                  !editing && "cursor-default"
                ),
                children: opt.label
              },
              opt.key
            );
          }),
          !editing && (!c.tags || c.tags.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No tags. Tap Edit to add." })
        ] })
      ] }),
      (c.tags ?? []).includes("blocked") && !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
        " This customer is marked as blocked."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-4 py-3", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setEditing(false), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-4 w-4" }),
        " Cancel"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1", disabled: save.isPending, onClick: () => save.mutate(), children: [
        save.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-1 h-4 w-4" }),
        "Save changes"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => onOpenChange(false), children: "Close" }) })
  ] }) });
}
function Mini({ label, value, loading, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/60 px-2 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-0.5 h-3.5 w-14" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-xs font-bold tabular-nums", tone === "success" ? "text-emerald-700" : "text-foreground"), children: value.toFixed(2) })
  ] });
}
function ActionTile$1({
  icon: Icon,
  label,
  onClick,
  tone,
  active,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      className: cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[11px] font-medium transition active:scale-[0.97]",
        tone === "danger" && "border-rose-300/60 text-rose-600 hover:bg-rose-50",
        active && "border-primary/50 bg-primary/5 text-primary",
        !tone && !active && "hover:border-primary/40 hover:bg-muted/40",
        disabled && "cursor-not-allowed opacity-60 active:scale-100"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    }
  );
}
function Field$1({ label, hint, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: hint })
  ] });
}
function InfoRow({ icon: Icon, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-foreground/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: value })
  ] });
}
function KV({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/30 px-2 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold tabular-nums", children: value })
  ] });
}
const TYPE_LABEL = {
  customer: "Customer",
  supplier: "Supplier",
  mixed: "Mixed"
};
const TYPE_TONE = {
  customer: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  supplier: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  mixed: "bg-primary/15 text-primary"
};
function PartyManager({ defaultType = "all" } = {}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const [q, setQ] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState(defaultType);
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const { data: parties = [] } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await supabase.from("parties").select("*").eq("is_deleted", false).order("name")).data ?? []
  });
  const filtered = reactExports.useMemo(() => {
    return parties.filter((p) => {
      if (typeFilter !== "all" && p.party_type !== typeFilter) return false;
      if (q && !`${p.name} ${p.phone ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [parties, q, typeFilter]);
  const remove = async (id) => {
    if (!await confirm2({ title: "Move party to Recycle Bin?", description: "Linked ledger history is preserved. You can restore this party anytime from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    const { softDelete: softDelete2 } = await import("./soft-delete-DQY0d6eC.mjs");
    const { error } = await softDelete2("parties", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({ queryKey: ["parties"] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
        " Parties"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => {
        setEditing(null);
        setOpen(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add party"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid gap-2 sm:grid-cols-[1fr_180px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: "Search by name or phone…", value: q, onChange: (e) => setQ(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: typeFilter, onValueChange: (v) => setTypeFilter(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All types" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "customer", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "supplier", children: "Supplier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mixed", children: "Mixed" })
        ] })
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No parties yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border rounded-lg border border-border", children: filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("border-0", TYPE_TONE[p.party_type]), variant: "outline", children: TYPE_LABEL[p.party_type] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground", children: [
          p.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
            " ",
            p.phone
          ] }),
          p.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
            " ",
            p.address
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-x-3 text-[11px]", children: [
          Number(p.opening_due) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-600 dark:text-amber-400", children: [
            "Opening Due ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: p.opening_due, size: "sm", bold: false })
          ] }),
          Number(p.opening_advance) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
            "Advance ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: p.opening_advance, size: "sm", bold: false })
          ] }),
          Number(p.opening_payable) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-600 dark:text-rose-400", children: [
            "Payable ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: p.opening_payable, size: "sm", bold: false })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setEditing(p);
        setOpen(true);
      }, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(p.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PartyFormDialog,
      {
        open,
        onOpenChange: setOpen,
        editing,
        userId: user?.id,
        onSaved: () => qc.invalidateQueries({ queryKey: ["parties"] })
      }
    )
  ] });
}
function PartyFormDialog({
  open,
  onOpenChange,
  editing,
  userId,
  onSaved
}) {
  const [name, setName] = reactExports.useState("");
  const [partyType, setPartyType] = reactExports.useState("customer");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [openingDue, setOpeningDue] = reactExports.useState("0");
  const [openingAdvance, setOpeningAdvance] = reactExports.useState("0");
  const [openingPayable, setOpeningPayable] = reactExports.useState("0");
  const [openingNotes, setOpeningNotes] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useMemo(() => {
    if (open) {
      setName(editing?.name ?? "");
      setPartyType(editing?.party_type ?? "customer");
      setPhone(editing?.phone ?? "");
      setAddress(editing?.address ?? "");
      setOpeningDue(String(editing?.opening_due ?? 0));
      setOpeningAdvance(String(editing?.opening_advance ?? 0));
      setOpeningPayable(String(editing?.opening_payable ?? 0));
      setOpeningNotes(editing?.opening_notes ?? "");
    }
  }, [open, editing?.id]);
  const submit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("Not signed in");
    if (!name.trim()) return toast.error("Name required");
    setBusy(true);
    const payload = {
      name: name.trim(),
      party_type: partyType,
      phone: phone.trim() || null,
      address: address.trim() || null,
      opening_due: Number(openingDue) || 0,
      opening_advance: Number(openingAdvance) || 0,
      opening_payable: Number(openingPayable) || 0,
      opening_notes: openingNotes.trim() || null
    };
    const res = editing ? await supabase.from("parties").update(payload).eq("id", editing.id) : await supabase.from("parties").insert({ ...payload, created_by: userId });
    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Added");
    onSaved();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit party" : "New party" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-[1fr_160px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Bata Quraish", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: partyType, onValueChange: (v) => setPartyType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "customer", children: "Customer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "supplier", children: "Supplier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mixed", children: "Mixed" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+966…", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: address, onChange: (e) => setAddress(e.target.value), className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Opening balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: openingDue, onChange: (e) => setOpeningDue(e.target.value), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening Advance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: openingAdvance, onChange: (e) => setOpeningAdvance(e.target.value), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening Payable" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: openingPayable, onChange: (e) => setOpeningPayable(e.target.value), className: "mt-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: openingNotes, onChange: (e) => setOpeningNotes(e.target.value), className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saving…" : "Save" })
      ] })
    ] })
  ] }) });
}
const fmt = (n) => `SAR ${Math.round(Number(n) || 0).toLocaleString()}`;
const useFinancials = useWholesaleFinancials;
function useProfit(workingDate) {
  return useQuery({
    queryKey: ["wh-profit", workingDate],
    staleTime: Infinity,
    gcTime: 10 * 6e4,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const [products, sales] = await Promise.all([
        supabase.from("shop_products").select("id,purchase_price,price"),
        supabase.from("shop_sales").select("items,created_at").eq("is_deleted", false).neq("status", "cancelled")
      ]);
      const costMap = /* @__PURE__ */ new Map();
      (products.data ?? []).forEach(
        (p) => costMap.set(p.id, Number(p.purchase_price ?? 0) || Number(p.price ?? 0))
      );
      const [wy, wm, wd] = workingDate.split("-").map(Number);
      const startOfDay = new Date(wy, (wm || 1) - 1, wd || 1);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
      const make = () => ({ profit: 0, revenue: 0, cost: 0, qty: 0 });
      const daily = make(), monthly = make(), all = make();
      for (const row of sales.data ?? []) {
        const t = new Date(row.created_at).getTime();
        for (const it of row.items ?? []) {
          const pid = it.product_id ?? it.id;
          const qty = Number(it.qty ?? 0);
          const sale = Number(it.price ?? 0);
          if (!pid || qty <= 0) continue;
          const cost = costMap.get(pid) ?? 0;
          const rev = sale * qty;
          const totalCost = cost * qty;
          const profit = rev - totalCost;
          all.profit += profit;
          all.revenue += rev;
          all.cost += totalCost;
          all.qty += qty;
          if (t >= startOfMonth.getTime() && t <= endOfDay.getTime()) {
            monthly.profit += profit;
            monthly.revenue += rev;
            monthly.cost += totalCost;
            monthly.qty += qty;
          }
          if (t >= startOfDay.getTime() && t <= endOfDay.getTime()) {
            daily.profit += profit;
            daily.revenue += rev;
            daily.cost += totalCost;
            daily.qty += qty;
          }
        }
      }
      return { daily, monthly, all };
    }
  });
}
const ENTRY_PAGE = 10;
function useRecentEntriesPaged(filter) {
  return useInfiniteQuery({
    queryKey: ["wh-recent-entries", filter],
    staleTime: Infinity,
    gcTime: 10 * 6e4,
    refetchOnWindowFocus: false,
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor,
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam ?? new Date(Date.now() + 6e4).toISOString();
      const bucket = [];
      const wantSale = filter === "all" || filter === "sale";
      const wantPurchase = filter === "all" || filter === "purchase";
      const wantPayment = filter === "all" || filter === "payment";
      const tasks = [];
      if (wantSale) tasks.push(
        supabase.from("shop_sales").select("id,invoice_number,customer_name,total,created_at").eq("is_deleted", false).lt("created_at", cursor).order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );
      if (wantPurchase) tasks.push(
        supabase.from("shop_purchases").select("id,invoice_number,supplier_name,total,created_at").eq("is_deleted", false).lt("created_at", cursor).order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );
      if (wantPayment) tasks.push(
        supabase.from("pos_payments").select("id,amount,kind,notes,created_at,customer_id").lt("created_at", cursor).order("created_at", { ascending: false }).limit(ENTRY_PAGE)
      );
      const results = await Promise.all(tasks);
      let i = 0;
      if (wantSale) {
        (results[i++].data ?? []).forEach((r) => bucket.push({
          id: `s-${r.id}`,
          refId: r.id,
          kind: "sale",
          title: r.customer_name || "Walk-in",
          subtitle: `Invoice #${r.invoice_number}`,
          amount: Number(r.total ?? 0),
          at: r.created_at
        }));
      }
      if (wantPurchase) {
        (results[i++].data ?? []).forEach((r) => bucket.push({
          id: `p-${r.id}`,
          refId: r.id,
          kind: "purchase",
          title: r.supplier_name || "Supplier",
          subtitle: `Invoice #${r.invoice_number}`,
          amount: Number(r.total ?? 0),
          at: r.created_at
        }));
      }
      if (wantPayment) {
        const rows = results[i++].data ?? [];
        const ids = Array.from(new Set(rows.map((r) => r.customer_id).filter(Boolean)));
        const custMap = /* @__PURE__ */ new Map();
        if (ids.length) {
          const { data: customers } = await supabase.from("pos_customers").select("id,name").in("id", ids);
          (customers ?? []).forEach((c) => custMap.set(c.id, c.name));
        }
        rows.forEach((r) => {
          const isIn = r.kind === "payment_in";
          bucket.push({
            id: `${r.kind}-${r.id}`,
            refId: r.id,
            kind: isIn ? "payment_in" : "payment_out",
            title: r.customer_id && custMap.get(r.customer_id) || (isIn ? "Customer" : "Expense"),
            subtitle: r.notes || (isIn ? "Payment received" : "Payment out"),
            amount: Number(r.amount ?? 0),
            at: r.created_at
          });
        });
      }
      bucket.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
      const items = bucket.slice(0, ENTRY_PAGE);
      const nextCursor = items.length === ENTRY_PAGE ? items[items.length - 1].at : null;
      return { items, nextCursor };
    }
  });
}
function FinancialSummaryCard({
  onRefresh,
  onMetric
}) {
  const { data, isFetching } = useFinancials();
  const d = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden rounded-2xl border-border/60 p-0 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3 border-b border-border/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: "Wholesale value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoChip, { onClick: () => onMetric("warehouse") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-[22px] font-bold leading-none tabular-nums", children: d ? fmt(d.warehouseValue) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "Stock + Receivable" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onRefresh,
          className: "flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-background active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3 w-3 ${isFetching ? "animate-spin text-primary" : ""}` }),
            "Refresh"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 px-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Metric,
        {
          icon: Boxes,
          label: "Stock",
          value: d ? fmt(d.currentStock) : "—",
          onClick: () => onMetric("stock"),
          onInfo: () => onMetric("stock")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Metric,
        {
          icon: ArrowDownLeft,
          label: "Receivable",
          value: d ? fmt(d.receivable) : "—",
          tone: d && d.receivable > 0 ? "danger" : "muted",
          onClick: () => onMetric("receivable"),
          onInfo: () => onMetric("receivable")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Metric,
        {
          icon: Coins,
          label: "Converted",
          value: d ? fmt(d.convertedToCash) : "—",
          tone: d && d.convertedToCash >= 0 ? "success" : "danger",
          onInfo: () => onMetric("converted")
        }
      )
    ] })
  ] });
}
function InfoChip({ onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: (e) => {
        e.stopPropagation();
        onClick();
      },
      className: "flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
      "aria-label": "More info",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" })
    }
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  tone,
  onClick,
  onInfo
}) {
  const color = tone === "danger" ? "text-rose-600 dark:text-rose-400" : tone === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground";
  const interactive = !!onClick;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: interactive ? "button" : void 0,
      tabIndex: interactive ? 0 : void 0,
      onClick,
      onKeyDown: (e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      },
      className: `min-w-0 rounded-xl p-2 transition-colors ${interactive ? "cursor-pointer hover:bg-muted/60 active:bg-muted" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-0.5 flex items-center justify-between gap-1 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[10px] font-medium uppercase tracking-wider", children: label })
          ] }),
          onInfo && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoChip, { onClick: onInfo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `truncate text-[13px] font-bold tabular-nums leading-tight ${color}`, children: value })
      ]
    }
  );
}
const PERIOD_LABEL = {
  daily: "Daily",
  monthly: "Monthly",
  all: "All Time"
};
function ProfitCard() {
  const { workingDate } = useWorkingDate();
  const { data, isFetching } = useProfit(workingDate);
  const [period, setPeriod] = reactExports.useState("monthly");
  const [open, setOpen] = reactExports.useState(false);
  const b = data ? data[period] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        onClick: () => setOpen(true),
        className: "cursor-pointer rounded-2xl border-border/60 p-3 shadow-sm transition-shadow hover:shadow-md active:scale-[0.997]",
        role: "button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
                  "Profit · ",
                  PERIOD_LABEL[period]
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[18px] font-bold leading-tight tabular-nums text-emerald-600 dark:text-emerald-400", children: b ? fmt(b.profit) : "—" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-muted/60 px-2 py-1 text-[10px] text-muted-foreground", children: [
              "Change ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Sold: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground tabular-nums", children: b?.qty ?? 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Sales: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground tabular-nums", children: b ? fmt(b.revenue) : "—" })
            ] }),
            isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin text-primary" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfitDetailsDialog,
      {
        open,
        onOpenChange: setOpen,
        period,
        setPeriod,
        data: data ?? null
      }
    )
  ] });
}
function ProfitDetailsDialog({
  open,
  onOpenChange,
  period,
  setPeriod,
  data
}) {
  const b = data ? data[period] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: "Profit details" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5 rounded-xl bg-muted/60 p-1", children: ["daily", "monthly", "all"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPeriod(p),
          className: `rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-all ${period === p ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
          children: PERIOD_LABEL[p]
        },
        p
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400", children: [
          "Net realized profit · ",
          PERIOD_LABEL[period]
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400", children: b ? fmt(b.profit) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: "(Sale rate − Purchase rate) × Sold qty" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 divide-y divide-border rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total sold items", children: b?.qty ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total sales", children: b ? fmt(b.revenue) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total purchase cost", children: b ? fmt(b.cost) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Net realized profit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400", children: b ? fmt(b.profit) : "—" }) })
      ] })
    ] })
  ] }) });
}
const ENTRY_CFG = {
  sale: { icon: ShoppingBag, tone: "text-emerald-600 bg-emerald-500/10", label: "Sale", sign: "+" },
  purchase: { icon: Truck, tone: "text-amber-600 bg-amber-500/10", label: "Purchase", sign: "−" },
  payment_in: { icon: ArrowDownLeft, tone: "text-emerald-600 bg-emerald-500/10", label: "Payment In", sign: "+" },
  payment_out: { icon: ArrowUpRight, tone: "text-rose-600 bg-rose-500/10", label: "Payment Out", sign: "−" }
};
const EntryRow = reactExports.memo(function EntryRow2({ e, onOpen }) {
  const cfg = ENTRY_CFG[e.kind];
  const Icon = cfg.icon;
  const time = new Date(e.at).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
  const date = new Date(e.at).toLocaleDateString(void 0, { day: "2-digit", month: "short" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: () => onOpen(e),
      onKeyDown: (ev) => {
        if (ev.key === "Enter" || ev.key === " ") onOpen(e);
      },
      className: "flex w-full cursor-pointer items-center gap-3 rounded-xl px-1.5 py-2.5 text-left transition-colors hover:bg-muted/50 active:bg-muted",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: cfg.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              "· ",
              date,
              " ",
              time
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium leading-tight", children: e.title }),
          e.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10px] text-muted-foreground", children: e.subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[13px] font-semibold tabular-nums ${cfg.sign === "−" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`, children: [
            cfg.sign,
            " ",
            fmt(e.amount)
          ] }),
          e.kind === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsx(SaleWhatsAppButton, { saleId: e.refId })
        ] })
      ]
    }
  ) });
});
function SaleWhatsAppButton({ saleId }) {
  const [busy, setBusy] = reactExports.useState(false);
  const onClick = reactExports.useCallback(async (ev) => {
    ev.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const [{ buildAm80DataFromSaleId }, { shareAm80Image }] = await Promise.all([
        import("./from-sale-BY1n2b70.mjs"),
        import("./share-71lV2Bko.mjs")
      ]);
      const data = await buildAm80DataFromSaleId(saleId);
      if (!data) {
        toast.error("Sale not found");
        return;
      }
      await shareAm80Image(data);
    } catch (e) {
      toast.error(e?.message ?? "Share failed");
    } finally {
      setBusy(false);
    }
  }, [saleId, busy]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      "aria-label": "Share on WhatsApp",
      title: "Share on WhatsApp",
      disabled: busy,
      className: "inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366]/20 disabled:opacity-60",
      children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" })
    }
  );
}
const ENTRY_FILTERS = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sale" },
  { key: "purchase", label: "Purchase" },
  { key: "payment", label: "Payment" }
];
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 px-1.5 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 animate-pulse rounded-xl bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-1/3 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-2/3 animate-pulse rounded bg-muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-14 animate-pulse rounded bg-muted" })
  ] });
}
function RecentEntryCard({ onOpen }) {
  const [filter, setFilter] = reactExports.useState("all");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecentEntriesPaged(filter);
  const items = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    (data?.pages ?? []).forEach((p) => p.items.forEach((it) => {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    }));
    return out;
  }, [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground", children: "Recent entry" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-full text-[10px]", children: items.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex gap-1 overflow-x-auto", children: ENTRY_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setFilter(f.key),
        className: `shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
        children: f.label
      },
      f.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl p-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, i)) }) : !items.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-8 text-center text-sm text-muted-foreground", children: "No entries yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: items.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EntryRow, { e, onOpen }, e.id)) }),
      hasNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => fetchNextPage(),
          disabled: isFetchingNextPage,
          className: "mt-2 w-full rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 disabled:opacity-60",
          children: isFetchingNextPage ? "Loading…" : "Load more"
        }
      )
    ] }) })
  ] });
}
function PurchaseDetailDialog({
  open,
  onOpenChange,
  purchaseId
}) {
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const [busy, setBusy] = reactExports.useState(false);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["wh-purchase-detail", purchaseId],
    enabled: open && !!purchaseId,
    queryFn: async () => {
      const { data: data2 } = await supabase.from("shop_purchases").select("*").eq("id", purchaseId).maybeSingle();
      return data2;
    }
  });
  const handleDelete = async () => {
    if (!data) return;
    const d = data;
    if (!await confirm2({
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
        { label: "Date", value: new Date(d.created_at).toLocaleDateString() }
      ]
    })) return;
    setBusy(true);
    const { error } = await softDelete("shop_purchases", d.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin", {
      duration: 5e3,
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: rErr } = await restore("shop_purchases", d.id);
          if (rErr) {
            toast.error(rErr.message);
            return;
          }
          toast.success("Purchase restored");
          qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
          qc.invalidateQueries({ queryKey: ["wh-financials"] });
          qc.invalidateQueries({ queryKey: ["wh-profit"] });
        }
      }
    });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: "Purchase Entry" }) }),
      isLoading || !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400", children: "Total Purchase" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold tabular-nums", children: SAR(data.total) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[11px] text-muted-foreground", children: [
            "Invoice #",
            data.invoice_number,
            " · ",
            new Date(data.created_at).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Supplier: ",
            data.supplier_name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border/60", children: [
            (data.items ?? []).map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 px-3 py-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 truncate", children: it.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-muted-foreground tabular-nums", children: [
                Number(it.qty ?? 0),
                " × ",
                SAR(it.price)
              ] })
            ] }, i)),
            !data.items?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-3 py-3 text-center text-xs text-muted-foreground", children: "No items" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(data.subtotal) })
          ] }),
          Number(data.tax ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tax" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: SAR(data.tax) })
          ] })
        ] }),
        data.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm whitespace-pre-wrap", children: data.notes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: () => onOpenChange(false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
          " Close"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", className: "flex-1", onClick: () => setEditOpen(true), disabled: busy || !data, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
          " Edit"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", className: "flex-1", onClick: handleDelete, disabled: busy || !data, children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
          "Delete"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransactionDialog,
      {
        open: editOpen,
        onOpenChange: (v) => {
          setEditOpen(v);
          if (!v) {
            qc.invalidateQueries({ queryKey: ["wh-purchase-detail", purchaseId] });
            onOpenChange(false);
          }
        },
        kind: "purchase",
        editId: purchaseId
      }
    )
  ] });
}
function PaymentDetailDialog({
  open,
  onOpenChange,
  paymentId,
  kind
}) {
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const [busy, setBusy] = reactExports.useState(false);
  const isIn = kind === "payment_in";
  const { data, isLoading } = useQuery({
    queryKey: ["wh-payment-detail", paymentId],
    enabled: open && !!paymentId,
    queryFn: async () => {
      const { data: data2 } = await supabase.from("pos_payments").select("*, pos_customers(name,phone)").eq("id", paymentId).maybeSingle();
      return data2;
    }
  });
  const handleDelete = async () => {
    if (!data) return;
    if (!await confirm2({
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
        { label: "Date", value: new Date(data.created_at).toLocaleDateString() }
      ]
    })) return;
    setBusy(true);
    const { error } = await supabase.from("pos_payments").delete().eq("id", data.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
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
      subtitle: data.pos_customers?.phone || void 0,
      amount: SAR(data.amount),
      amountLabel: title,
      date: new Date(data.created_at).toLocaleString(),
      rows: [
        { label: "Party", value: partyName },
        { label: "Method", value: data.method || "cash" },
        { label: "Date", value: new Date(data.created_at).toLocaleString() }
      ],
      notes: data.notes || void 0,
      accent: isIn ? "in" : "out",
      caption: `${title} · ${partyName} · ${SAR(data.amount)}`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: isIn ? "Payment In" : "Payment Out" }) }),
    isLoading || !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl p-4 ${isIn ? "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5" : "bg-gradient-to-br from-rose-500/15 to-rose-500/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] font-semibold uppercase tracking-wider ${isIn ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`, children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl font-bold tabular-nums", children: SAR(data.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[11px] text-muted-foreground", children: new Date(data.created_at).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 divide-y divide-border rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Party", children: data.pos_customers?.name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Method", children: data.method || "cash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Date", children: new Date(data.txn_date).toLocaleDateString() }),
        data.notes && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Notes", children: data.notes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "mt-3 w-full border-success/40 text-success hover:bg-success/10",
          onClick: handleShare,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1.5 h-3.5 w-3.5" }),
            " Share as Image"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: () => onOpenChange(false), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Close"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", className: "flex-1", onClick: handleDelete, disabled: busy || !data, children: [
        busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }),
        "Delete"
      ] })
    ] })
  ] }) });
}
function DetailRow({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 px-4 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-right text-sm font-medium", children })
  ] });
}
function WholesaleDashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: fin } = useFinancials();
  const [saleId, setSaleId] = reactExports.useState(null);
  const [purchaseId, setPurchaseId] = reactExports.useState(null);
  const [payment, setPayment] = reactExports.useState(null);
  const [infoKey, setInfoKey] = reactExports.useState(null);
  const [receivableOpen, setReceivableOpen] = reactExports.useState(false);
  const [customer, setCustomer] = reactExports.useState(null);
  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["wh-financials"] });
    qc.invalidateQueries({ queryKey: ["wh-profit"] });
    qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
  };
  const openEntry = reactExports.useCallback((e) => {
    if (e.kind === "sale") setSaleId(e.refId);
    else if (e.kind === "purchase") setPurchaseId(e.refId);
    else setPayment({ id: e.refId, kind: e.kind });
  }, []);
  const onMetric = (k) => {
    if (k === "stock") {
      navigate({ to: "/store-admin", search: { tab: "products" } });
      return;
    }
    if (k === "receivable") {
      setReceivableOpen(true);
      return;
    }
    setInfoKey(k);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialSummaryCard, { onRefresh: refreshAll, onMetric }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RecentEntryCard, { onOpen: openEntry }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosSaleDetailsDialog, { open: !!saleId, onOpenChange: (v) => !v && setSaleId(null), saleId }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PurchaseDetailDialog, { open: !!purchaseId, onOpenChange: (v) => !v && setPurchaseId(null), purchaseId }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentDetailDialog,
      {
        open: !!payment,
        onOpenChange: (v) => !v && setPayment(null),
        paymentId: payment?.id ?? null,
        kind: payment?.kind ?? "payment_in"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MetricInfoDialog, { metric: infoKey, onOpenChange: (v) => !v && setInfoKey(null), fin: fin ?? null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceivableBreakdownDialog,
      {
        open: receivableOpen,
        onOpenChange: setReceivableOpen,
        onOpenCustomer: (c) => {
          setReceivableOpen(false);
          setCustomer(c);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PosCustomerStatementDialog,
      {
        open: !!customer,
        onOpenChange: (v) => !v && setCustomer(null),
        customer
      }
    )
  ] });
}
function MetricInfoDialog({
  metric,
  onOpenChange,
  fin
}) {
  const open = !!metric;
  const title = metric === "warehouse" ? "Wholesale value" : metric === "stock" ? "Current stock" : metric === "receivable" ? "Receivable" : metric === "converted" ? "Converted to cash" : "";
  const body = (() => {
    if (!metric || !fin) return null;
    if (metric === "warehouse") return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { children: "Wholesale Value = Current Stock + Receivable" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Current Stock", children: fmt(fin.currentStock) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Receivable", children: fmt(fin.receivable) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total", children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-primary", children: fmt(fin.warehouseValue) }) })
      ] })
    ] });
    if (metric === "stock") return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { children: "Current Stock = Σ(stock × purchase/cost rate)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total stock value", children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: fmt(fin.currentStock) }) }) })
    ] });
    if (metric === "receivable") return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { children: "Receivable = Opening Due + Sales Due − Payments In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Opening due", children: fmt(fin.openingDue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Sales due", children: fmt(fin.salesDue) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailRow, { label: "Payments in", children: [
          "− ",
          fmt(fin.paidIn)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Total receivable", children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-rose-600 dark:text-rose-400", children: fmt(fin.receivable) }) })
      ] })
    ] });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FormulaLine, { children: "Converted To Cash = Opening Balance − Wholesale Value" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Opening balance", children: fmt(fin.openingBalance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailRow, { label: "Wholesale value", children: [
          "− ",
          fmt(fin.warehouseValue)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Converted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: fin.convertedToCash >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400", children: fmt(fin.convertedToCash) }) })
      ] })
    ] });
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4", children: body })
  ] }) });
}
function FormulaLine({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-primary/10 px-3 py-2 text-[12px] font-medium text-primary", children });
}
function useReceivableBreakdown(enabled) {
  return useQuery({
    queryKey: ["wh-receivable-breakdown"],
    enabled,
    staleTime: Infinity,
    queryFn: async () => {
      const [custRes, salesRes, payRes] = await Promise.all([
        supabase.from("pos_customers").select("*").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales").select("customer_id,due_amount,status").not("customer_id", "is", null).eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind")
      ]);
      const map = /* @__PURE__ */ new Map();
      for (const c of custRes.data ?? []) map.set(c.id, Number(c.opening_due ?? 0));
      for (const s of salesRes.data ?? []) {
        if (!s.customer_id || s.status === "cancelled") continue;
        map.set(s.customer_id, (map.get(s.customer_id) ?? 0) + Number(s.due_amount ?? 0));
      }
      for (const p of payRes.data ?? []) {
        if (!p.customer_id || p.kind !== "payment_in") continue;
        map.set(p.customer_id, (map.get(p.customer_id) ?? 0) - Number(p.amount ?? 0));
      }
      return (custRes.data ?? []).map((c) => ({ customer: c, due: map.get(c.id) ?? 0 })).filter((r) => r.due > 0.5).sort((a, b) => b.due - a.due);
    }
  });
}
function ReceivableBreakdownDialog({
  open,
  onOpenChange,
  onOpenCustomer
}) {
  const { data, isLoading } = useReceivableBreakdown(open);
  const [q, setQ] = reactExports.useState("");
  const rows = reactExports.useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (r) => r.customer.name.toLowerCase().includes(term) || (r.customer.phone ?? "").toLowerCase().includes(term)
    );
  }, [data, q]);
  const total = reactExports.useMemo(() => (data ?? []).reduce((s, r) => s + r.due, 0), [data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md gap-0 overflow-hidden p-0",
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: "Receivable breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-rose-500/15 to-rose-500/5 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400", children: "Total customer dues" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400", children: fmt(total) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
              rows.length,
              " customers · sorted by highest due"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: q,
                onChange: (e) => setQ(e.target.value),
                placeholder: "Search customer…",
                className: "h-9 pl-8 text-sm"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[55vh] overflow-y-auto px-3 pb-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : !rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No outstanding dues." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onOpenCustomer(r.customer),
            className: "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60 active:bg-muted",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium", children: r.customer.name }),
                r.customer.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10px] text-muted-foreground", children: r.customer.phone })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[13px] font-semibold tabular-nums text-rose-600 dark:text-rose-400", children: fmt(r.due) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4 text-muted-foreground" })
            ]
          }
        ) }, r.customer.id)) }) })
      ]
    }
  ) });
}
const STORAGE_KEY$1 = "wholesale.topTabs.v1";
const ICON_LIBRARY = {
  LayoutGrid,
  ShoppingBag,
  Truck,
  Users,
  Wallet,
  ShoppingCart,
  Image,
  Package,
  Tag,
  Bell,
  ClipboardList,
  FileSpreadsheet,
  BarChart3: ChartColumn,
  Star,
  Store,
  Box,
  Boxes,
  Receipt
};
const COLORS = {
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", label: "Emerald" },
  blue: { bg: "bg-blue-500/15", text: "text-blue-700 dark:text-blue-300", label: "Blue" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-700 dark:text-violet-300", label: "Violet" },
  rose: { bg: "bg-rose-500/15", text: "text-rose-700 dark:text-rose-300", label: "Rose" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300", label: "Amber" },
  sky: { bg: "bg-sky-500/15", text: "text-sky-700 dark:text-sky-300", label: "Sky" },
  slate: { bg: "bg-slate-500/15", text: "text-slate-700 dark:text-slate-200", label: "Slate" }
};
const DEFAULT_PREFS$1 = { tabs: [], activeColor: "emerald" };
function loadPrefs$1() {
  if (typeof window === "undefined") return DEFAULT_PREFS$1;
  try {
    const raw = localStorage.getItem(STORAGE_KEY$1);
    if (!raw) return DEFAULT_PREFS$1;
    const p = JSON.parse(raw);
    if (!p || !Array.isArray(p.tabs)) return DEFAULT_PREFS$1;
    return { tabs: p.tabs, activeColor: p.activeColor ?? "emerald" };
  } catch {
    return DEFAULT_PREFS$1;
  }
}
function savePrefs$1(p) {
  try {
    localStorage.setItem(STORAGE_KEY$1, JSON.stringify(p));
  } catch {
  }
  try {
    window.dispatchEvent(new CustomEvent("wholesale-tabs-prefs-changed"));
  } catch {
  }
}
function useTabPrefs() {
  const [prefs, setPrefs] = reactExports.useState(() => loadPrefs$1());
  reactExports.useEffect(() => {
    const h = () => setPrefs(loadPrefs$1());
    window.addEventListener("wholesale-tabs-prefs-changed", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("wholesale-tabs-prefs-changed", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return prefs;
}
function applyTabPrefs(defs, prefs) {
  const byVal = new Map(defs.map((d) => [d.value, d]));
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  prefs.tabs.forEach((p) => {
    const d = byVal.get(p.value);
    if (!d) return;
    if (p.hidden) {
      seen.add(p.value);
      return;
    }
    seen.add(p.value);
    merged.push({
      value: d.value,
      label: p.label?.trim() || d.label,
      icon: p.iconKey && ICON_LIBRARY[p.iconKey] || d.icon,
      pinned: !!p.pinned,
      order: p.order
    });
  });
  defs.forEach((d, i) => {
    if (seen.has(d.value)) return;
    merged.push({ ...d, pinned: false, order: 1e3 + i });
  });
  merged.sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.order - b.order);
  return merged.map(({ pinned: _p, order: _o, ...rest }) => rest);
}
function WholesaleTabsCustomizer({
  open,
  onOpenChange,
  allTabs
}) {
  const [prefs, setPrefs] = reactExports.useState(() => loadPrefs$1());
  const [dragIdx, setDragIdx] = reactExports.useState(null);
  const [iconPickerFor, setIconPickerFor] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (open) setPrefs(loadPrefs$1());
  }, [open]);
  const rows = reactExports.useMemo(() => {
    const byVal = new Map(allTabs.map((d) => [d.value, d]));
    const byPrefVal = new Map(prefs.tabs.map((p) => [p.value, p]));
    const list = [];
    prefs.tabs.forEach((p) => {
      const d = byVal.get(p.value);
      if (d) list.push({ ...p, def: d });
    });
    allTabs.forEach((d, i) => {
      if (byPrefVal.has(d.value)) return;
      list.push({ value: d.value, order: 1e3 + i, def: d });
    });
    return list;
  }, [prefs, allTabs]);
  const update = (value, patch) => {
    setPrefs((prev) => {
      const existing = prev.tabs.find((t) => t.value === value);
      const nextTab = existing ? { ...existing, ...patch } : { value, order: prev.tabs.length, ...patch };
      const others = prev.tabs.filter((t) => t.value !== value);
      const combined = existing ? prev.tabs.map((t) => t.value === value ? nextTab : t) : [...others, nextTab];
      return { ...prev, tabs: combined };
    });
  };
  const reorder = (from, to) => {
    if (from === to || to < 0 || to >= rows.length) return;
    const current = rows.map((r, i) => ({ ...r, order: i }));
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved);
    setPrefs((prev) => ({
      ...prev,
      tabs: current.map((r, i) => ({
        value: r.value,
        label: r.label,
        hidden: r.hidden,
        pinned: r.pinned,
        iconKey: r.iconKey,
        order: i
      }))
    }));
  };
  const save = () => {
    const normalized = {
      ...prefs,
      tabs: rows.map((r, i) => ({
        value: r.value,
        label: r.label,
        hidden: r.hidden,
        pinned: r.pinned,
        iconKey: r.iconKey,
        order: i
      }))
    };
    savePrefs$1(normalized);
    onOpenChange(false);
  };
  const reset = () => {
    savePrefs$1(DEFAULT_PREFS$1);
    setPrefs(DEFAULT_PREFS$1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-5 pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold", children: "Customize Tabs" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/60 px-5 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Active Tab Color" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(COLORS).map(([key, c]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setPrefs((p) => ({ ...p, activeColor: key })),
          className: cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-all",
            c.bg,
            c.text,
            prefs.activeColor === key ? "border-current ring-2 ring-current/30" : "border-transparent opacity-70 hover:opacity-100"
          ),
          children: c.label
        },
        key
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[55vh] overflow-y-auto px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: rows.map((r, idx) => {
      const Icon = r.iconKey && ICON_LIBRARY[r.iconKey] || r.def.icon;
      const isEditingIcon = iconPickerFor === r.value;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          draggable: true,
          onDragStart: () => setDragIdx(idx),
          onDragOver: (e) => e.preventDefault(),
          onDrop: () => {
            if (dragIdx !== null) reorder(dragIdx, idx);
            setDragIdx(null);
          },
          className: cn(
            "group rounded-xl border border-border/60 bg-card p-2.5 transition-all",
            r.hidden && "opacity-60",
            dragIdx === idx && "ring-2 ring-primary/40"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-grab text-muted-foreground/60 active:cursor-grabbing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIconPickerFor(isEditingIcon ? null : r.value),
                  className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground hover:bg-muted/80",
                  title: "Change icon",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: r.label ?? r.def.label,
                  onChange: (e) => update(r.value, { label: e.target.value }),
                  placeholder: r.def.label,
                  className: "h-8 flex-1 text-[13px]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => update(r.value, { pinned: !r.pinned }),
                  className: cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted",
                    r.pinned ? "text-amber-500" : "text-muted-foreground"
                  ),
                  title: r.pinned ? "Unpin" : "Pin",
                  children: r.pinned ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => reorder(idx, idx - 1),
                    disabled: idx === 0,
                    className: "flex h-4 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => reorder(idx, idx + 1),
                    disabled: idx === rows.length - 1,
                    className: "flex h-4 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: !r.hidden,
                  onCheckedChange: (v) => update(r.value, { hidden: !v })
                }
              )
            ] }),
            isEditingIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-9 gap-1 rounded-lg bg-muted/40 p-2", children: Object.entries(ICON_LIBRARY).map(([key, I]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  update(r.value, { iconKey: key });
                  setIconPickerFor(null);
                },
                className: cn(
                  "flex h-8 w-8 items-center justify-center rounded-md hover:bg-background",
                  (r.iconKey ?? "") === key && "bg-background ring-1 ring-primary"
                ),
                title: key,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(I, { className: "h-4 w-4" })
              },
              key
            )) })
          ]
        },
        r.value
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-row items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: reset, className: "gap-1.5 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
        " Reset to Default"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: save, children: "Save" })
      ] })
    ] })
  ] }) });
}
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root$1.displayName;
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
const FIELDS = [
  { id: "image", label: "Product Image", align: "center" },
  { id: "name", label: "Product Name" },
  { id: "name_ar", label: "Arabic Name" },
  { id: "barcode", label: "Barcode" },
  { id: "sku", label: "SKU" },
  { id: "category", label: "Category" },
  { id: "brand", label: "Brand" },
  { id: "unit", label: "Unit", align: "center" },
  { id: "supplier", label: "Supplier" },
  { id: "purchase_price", label: "Purchase Price", align: "right" },
  { id: "sale_price", label: "Sale Rate", align: "right" },
  { id: "stock", label: "Current Stock", align: "center" },
  { id: "min_stock", label: "Min Stock", align: "center" },
  { id: "stock_value", label: "Stock Value", align: "right" },
  { id: "location", label: "Location" },
  { id: "expiry", label: "Expiry Date", align: "center" },
  { id: "notes", label: "Notes" },
  { id: "created_at", label: "Created", align: "center" },
  { id: "updated_at", label: "Updated", align: "center" }
];
const DEFAULT_FIELDS = ["name", "barcode", "category", "purchase_price", "sale_price", "stock"];
const STORAGE_KEY = "wh_print_product_list_prefs_v3";
const DEFAULT_PREFS = {
  fields: DEFAULT_FIELDS,
  paper: "A4",
  orientation: "portrait",
  options: {
    showCompany: true,
    showTitle: true,
    showDateTime: true,
    showTotal: true,
    repeatHeader: true,
    showBorders: true,
    altRows: true
  },
  includeOutOfStock: true
};
function loadPrefs() {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw);
    return {
      fields: Array.isArray(p.fields) && p.fields.length ? p.fields : DEFAULT_PREFS.fields,
      paper: ["A4", "A5", "Letter"].includes(p.paper) ? p.paper : "A4",
      orientation: ["portrait", "landscape"].includes(p.orientation) ? p.orientation : "portrait",
      options: { ...DEFAULT_PREFS.options, ...p.options ?? {} },
      includeOutOfStock: typeof p.includeOutOfStock === "boolean" ? p.includeOutOfStock : true
    };
  } catch {
    return DEFAULT_PREFS;
  }
}
function savePrefs(p) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
  }
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function attr(s) {
  return esc(s).replace(/`/g, "&#96;");
}
function fmtMoney(n) {
  const v = Number(n ?? 0);
  if (!isFinite(v)) return "—";
  return v.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(s) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-GB");
  } catch {
    return "—";
  }
}
function getPageMetrics(prefs) {
  const base = prefs.paper === "A5" ? { width: 148, height: 210 } : prefs.paper === "Letter" ? { width: 215.9, height: 279.4 } : { width: 210, height: 297 };
  const width = prefs.orientation === "landscape" ? base.height : base.width;
  const height = prefs.orientation === "landscape" ? base.width : base.height;
  const margin = prefs.paper === "A5" ? 10 : 12;
  const bottomMargin = 18;
  return {
    width,
    height,
    margin,
    bottomMargin,
    contentWidth: width - margin * 2,
    contentHeight: height - margin - bottomMargin
  };
}
function cellValue(p, field, categoryMap) {
  switch (field) {
    case "image":
      return p.image_url ? `<img class="product-thumb" src="${attr(p.image_url)}" alt="" onerror="this.replaceWith(document.createTextNode('—'))"/>` : "—";
    case "name":
      return `<strong class="product-name">${esc(p.name || "—")}</strong>`;
    case "name_ar":
      return esc(p.name_ar || "—");
    case "barcode":
      return esc(p.barcode || "—");
    case "sku":
      return esc(p.item_code || "—");
    case "category":
      return esc(p.category_id && categoryMap?.get(p.category_id)?.name || "—");
    case "brand":
      return esc(p.brand || "—");
    case "unit":
      return esc(p.unit || "—");
    case "supplier":
      return esc(p.supplier || "—");
    case "purchase_price":
      return fmtMoney(p.purchase_price);
    case "sale_price":
      return fmtMoney(p.price);
    case "stock":
      return String(p.stock ?? 0);
    case "min_stock":
      return String(p.min_stock ?? 0);
    case "stock_value":
      return fmtMoney(Number(p.stock ?? 0) * Number(p.purchase_price ?? 0));
    case "location":
      return esc(p.location || "—");
    case "expiry":
      return fmtDate(p.expiry_date);
    case "notes":
      return esc(p.description || "—");
    case "created_at":
      return fmtDate(p.created_at);
    case "updated_at":
      return fmtDate(p.updated_at);
  }
}
function buildHtml(products, prefs, companyName, companyLogo, categoryMap) {
  const selected = FIELDS.filter((f) => prefs.fields.includes(f.id));
  const cols = selected.length;
  const fontSize = cols <= 5 ? 11 : cols <= 8 ? 10 : 9;
  const cellPad = cols <= 8 ? "7px 8px" : "5px 6px";
  const containsImage = selected.some((f) => f.id === "image");
  const pageMetrics = getPageMetrics(prefs);
  const contentHeightMm = pageMetrics.contentHeight;
  const estimatedHeaderMm = companyLogo ? 35 : 27;
  const estimatedFooterMm = 9;
  const estimatedTableHeadMm = 8;
  const estimatedRowMm = containsImage ? 16 : cols >= 10 ? 8 : 7;
  const rowsPerPage = Math.max(
    containsImage ? 3 : 6,
    Math.floor((contentHeightMm - estimatedHeaderMm - estimatedFooterMm - estimatedTableHeadMm) / estimatedRowMm)
  );
  const border = prefs.options.showBorders ? "1px solid #2f2f2f" : "none";
  const widthWeight = (field) => field === "image" ? 0.9 : field === "stock" || field === "min_stock" || field === "unit" ? 0.7 : field === "purchase_price" || field === "sale_price" || field === "stock_value" ? 0.95 : field === "name" || field === "name_ar" ? 1.7 : field === "notes" ? 1.45 : 1;
  const totalWeight = selected.reduce((sum, f) => sum + widthWeight(f.id), 0) || 1;
  const colgroup = selected.map((f) => {
    const width = `${(widthWeight(f.id) / totalWeight * 100).toFixed(2)}%`;
    return `<col style="width:${width};"/>`;
  }).join("");
  const thead = `<thead><tr>${selected.map((f) => `<th style="border:${border};padding:${cellPad};text-align:${f.align ?? "left"};">${esc(f.label)}</th>`).join("")}</tr></thead>`;
  const makeRows = (items, offset) => items.map((p, i) => {
    const bg = prefs.options.altRows && i % 2 === 1 ? "background:#fafafa;" : "";
    const tds = selected.map((f) => `<td class="cell-${f.id}" style="border:${border};padding:${cellPad};text-align:${f.align ?? "left"};vertical-align:middle;">${cellValue(p, f.id, categoryMap)}</td>`).join("");
    return `<tr data-row="${offset + i + 1}" style="${bg}page-break-inside:avoid;">${tds}</tr>`;
  }).join("");
  const now = /* @__PURE__ */ new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const dateStr = `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  const header = `
    <div class="report-header">
      ${prefs.options.showTotal ? `<div class="header-meta header-total">Total Products: ${products.length}</div>` : ""}
      ${prefs.options.showDateTime ? `<div class="header-meta print-date">Printed: ${esc(dateStr)}</div>` : ""}
      ${companyLogo ? `<img class="company-logo" src="${attr(companyLogo)}" alt="Company Logo"/>` : ""}
      ${prefs.options.showCompany ? `<div class="company-name">Azzouz WholeSale</div>` : ""}
      ${prefs.options.showTitle ? `<div class="report-title">Wholesale Product List</div>` : ""}
    </div>`;
  const chunks = [];
  for (let i = 0; i < products.length; i += rowsPerPage) chunks.push(products.slice(i, i + rowsPerPage));
  if (!chunks.length) chunks.push([]);
  const totalPages = chunks.length;
  const pages = chunks.map((chunk, pageIndex) => {
    const bodyRows = chunk.length ? makeRows(chunk, pageIndex * rowsPerPage) : `<tr><td style="padding:20px;text-align:center;color:#666;" colspan="${Math.max(cols, 1)}">No products to print</td></tr>`;
    return `<section class="catalogue-page">
        ${header}
        <div class="table-wrap"><table>${colgroup}${thead}<tbody>${bodyRows}</tbody></table></div>
        <div class="print-footer"><span>Total Products: ${products.length}</span><span class="center">Page ${pageIndex + 1} of ${totalPages}</span><span class="right">Generated by ShRiAh ERP</span></div>
      </section>`;
  }).join("");
  return `<!doctype html><html><head><meta charset="utf-8"/>
<title>Wholesale Product List</title>
<style>
  @page { size: ${prefs.paper} ${prefs.orientation}; margin: ${pageMetrics.margin}mm ${pageMetrics.margin}mm ${pageMetrics.bottomMargin}mm ${pageMetrics.margin}mm; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; color:#000; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; background:#fff; }
  body { font-size: ${fontSize}pt; }
  .catalogue-page { min-height:${contentHeightMm}mm; display:flex; flex-direction:column; page-break-after:always; break-after:page; background:#fff; }
  .catalogue-page:last-child { page-break-after:auto; break-after:auto; }
  .table-wrap { flex:1 1 auto; }
  .report-header { position: relative; text-align:center; margin-bottom:12px; padding:0 34mm 10px; border-bottom:1.5px solid #111; min-height:${companyLogo ? "28mm" : "20mm"}; }
  .header-meta { position:absolute; top:1mm; font-size:9pt; color:#222; white-space:nowrap; }
  .header-total { left:0; }
  .print-date { right:0; }
  .company-logo { display:block; width:auto; max-width:30mm; max-height:18mm; object-fit:contain; margin:0 auto 2mm; }
  .company-name { font-size:20pt; font-weight:800; line-height:1.1; letter-spacing:0; }
  .report-title { font-size:13pt; font-weight:700; margin-top:3px; }
  table { width:100%; border-collapse: collapse; table-layout: fixed; }
  thead { display:${prefs.options.repeatHeader ? "table-header-group" : "table-row-group"}; }
  tfoot { display: table-footer-group; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  th { background:#1f1f1f !important; color:#fff !important; font-weight:800; line-height:1.2; }
  td { line-height:1.25; overflow-wrap:anywhere; }
  .product-thumb { width:45px; height:45px; object-fit:cover; border:1px solid #999; display:block; margin:0 auto; }
  .product-name { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-weight:800; }
  ${containsImage ? "tbody tr { min-height:52px; }" : ""}
  .print-footer { margin-top:auto; display:grid; grid-template-columns:1fr 1fr 1fr; align-items:center; font-size:8.5pt; color:#333; border-top:1px solid #999; padding-top:2mm; }
  .print-footer .center { text-align:center; }
  .print-footer .right { text-align:right; }
  @media print {
    html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background:#fff !important; }
  }
</style></head><body>
${pages}
</body></html>`;
}
function printDedicatedDocument(html, existingWindow) {
  const waitForImages2 = async (doc2) => {
    const images = Array.from(doc2.images);
    await Promise.all(images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }));
  };
  const printWindow = existingWindow ?? window.open("", "_blank", "width=1100,height=900");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    const runPrint = async () => {
      await waitForImages2(printWindow.document);
      try {
        printWindow.focus();
        printWindow.print();
      } catch {
      }
    };
    printWindow.addEventListener("afterprint", () => {
      try {
        printWindow.close();
      } catch {
      }
    });
    if (printWindow.document.readyState === "complete") setTimeout(runPrint, 350);
    else printWindow.addEventListener("load", () => setTimeout(runPrint, 350), { once: true });
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  const win = iframe.contentWindow;
  if (!win) return;
  const trigger = async () => {
    await waitForImages2(doc);
    try {
      win.focus();
      win.print();
    } catch {
    }
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {
      }
    }, 1500);
  };
  if (doc.readyState === "complete") setTimeout(trigger, 350);
  else win.addEventListener("load", () => setTimeout(trigger, 350), { once: true });
}
async function waitForImages(root) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }));
}
async function createCataloguePdf(html, prefs) {
  const [{ jsPDF }, html2canvasModule] = await Promise.all([import("../_libs/jspdf.mjs"), import("../_libs/html2canvas.mjs")]);
  const html2canvas = html2canvasModule.default;
  const metrics = getPageMetrics(prefs);
  const pdf = new jsPDF({
    orientation: prefs.orientation,
    unit: "mm",
    format: prefs.paper.toLowerCase(),
    compress: true
  });
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = `${metrics.contentWidth}mm`;
  container.style.background = "#ffffff";
  container.style.pointerEvents = "none";
  container.innerHTML = `
    ${styleMatch ? `<style>${styleMatch[1]}</style>` : ""}
    <style>.catalogue-page{width:${metrics.contentWidth}mm;min-height:${metrics.contentHeight}mm;}</style>
    ${bodyMatch ? bodyMatch[1] : html}
  `;
  document.body.appendChild(container);
  try {
    if ("fonts" in document) await document.fonts.ready;
    await waitForImages(container);
    const pages = Array.from(container.querySelectorAll(".catalogue-page"));
    const renderPages = pages.length ? pages : [container];
    for (const [index, page] of renderPages.entries()) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      const imageHeight = Math.min(metrics.contentHeight, canvas.height * metrics.contentWidth / Math.max(canvas.width, 1));
      if (index > 0) pdf.addPage();
      pdf.addImage(imageData, "JPEG", metrics.margin, metrics.margin, metrics.contentWidth, imageHeight, void 0, "FAST");
    }
  } finally {
    try {
      document.body.removeChild(container);
    } catch {
    }
  }
  return pdf;
}
function PrintProductListDialog({ open, onOpenChange, products, categoryMap }) {
  const { profile } = useStoreProfile();
  const [prefs, setPrefs] = reactExports.useState(DEFAULT_PREFS);
  const [isPreviewingPdf, setIsPreviewingPdf] = reactExports.useState(false);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [previewHtml, setPreviewHtml] = reactExports.useState("");
  const [previewPrefs, setPreviewPrefs] = reactExports.useState(DEFAULT_PREFS);
  reactExports.useEffect(() => {
    if (open) setPrefs(loadPrefs());
  }, [open]);
  reactExports.useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);
  const toggleField = (id) => {
    setPrefs((p) => ({ ...p, fields: p.fields.includes(id) ? p.fields.filter((f) => f !== id) : [...p.fields, id] }));
  };
  const selectAll = () => setPrefs((p) => ({ ...p, fields: FIELDS.map((f) => f.id) }));
  const clearAll = () => setPrefs((p) => ({ ...p, fields: [] }));
  const recommendLandscape = prefs.fields.length >= 7;
  const filteredProducts = reactExports.useMemo(() => {
    if (prefs.includeOutOfStock) return products;
    return products.filter((p) => Number(p.stock ?? 0) > 0);
  }, [products, prefs.includeOutOfStock]);
  const html = reactExports.useMemo(
    () => buildHtml(filteredProducts, prefs, profile.name || "", profile.logoDataUrl || profile.logo || "", categoryMap),
    [filteredProducts, prefs, profile, categoryMap]
  );
  const handlePrint = () => {
    if (!prefs.fields.length) return;
    const printWindow = window.open("", "_blank", "width=1100,height=900");
    onOpenChange(false);
    setTimeout(() => printDedicatedDocument(html, printWindow), 150);
  };
  const handlePreviewPdf = () => {
    if (!prefs.fields.length) return;
    setPreviewHtml(html);
    setPreviewPrefs(prefs);
    onOpenChange(false);
    setPreviewOpen(true);
  };
  const handleDownloadPdfFromPreview = async () => {
    if (!previewHtml) return;
    setIsPreviewingPdf(true);
    try {
      const pdf = await createCataloguePdf(previewHtml, previewPrefs);
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      pdf.save(`Wholesale_Product_List_${today}.pdf`);
    } finally {
      setIsPreviewingPdf(false);
    }
  };
  const handlePrintFromPreview = () => {
    if (!previewHtml) return;
    printDedicatedDocument(previewHtml);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[92vh] overflow-hidden flex flex-col p-0 sm:max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-5 w-5" }),
          " Print Product List"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          filteredProducts.length,
          " of ",
          products.length,
          " products · ",
          prefs.fields.length,
          " field",
          prefs.fields.length === 1 ? "" : "s",
          " selected"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Fields to Print" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: selectAll, children: "Select All" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", variant: "outline", onClick: clearAll, children: "Clear All" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 rounded-lg border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mb-2 text-sm font-semibold", children: "Products Filter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm hover:bg-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: prefs.includeOutOfStock,
                  onCheckedChange: (v) => setPrefs((p) => ({ ...p, includeOutOfStock: !!v }))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Include Out of Stock Products" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: prefs.fields.includes(f.id), onCheckedChange: () => toggleField(f.id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: f.label })
          ] }, f.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-semibold", children: "Paper Size" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: prefs.paper, onValueChange: (v) => setPrefs((p) => ({ ...p, paper: v })), className: "flex gap-4", children: ["A4", "A5", "Letter"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { id: `paper-${s}`, value: s }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `paper-${s}`, className: "cursor-pointer", children: s })
            ] }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-semibold", children: "Orientation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: prefs.orientation, onValueChange: (v) => setPrefs((p) => ({ ...p, orientation: v })), className: "flex gap-4", children: ["portrait", "landscape"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { id: `orient-${o}`, value: o }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `orient-${o}`, className: "cursor-pointer capitalize", children: o })
            ] }, o)) }),
            recommendLandscape && prefs.orientation === "portrait" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[11px] text-amber-600", children: [
              "Tip: Landscape recommended for ",
              prefs.fields.length,
              " columns."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-semibold", children: "Layout Options" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: [
            ["showCompany", "Show Company Name"],
            ["showTitle", "Show Report Title"],
            ["showDateTime", "Show Print Date & Time"],
            ["showTotal", "Show Total Products"],
            ["repeatHeader", "Repeat Table Header on Every Page"],
            ["showBorders", "Show Grid Borders"],
            ["altRows", "Alternate Row Colors"]
          ].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm hover:bg-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: prefs.options[key],
                onCheckedChange: (v) => setPrefs((p) => ({ ...p, options: { ...p.options, [key]: !!v } }))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
          ] }, key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-semibold", children: "Live Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-lg border bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "preview", srcDoc: html, className: "h-[420px] w-full" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t bg-muted/30 px-6 py-4 gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrint, disabled: !prefs.fields.length || !filteredProducts.length, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1.5 h-4 w-4" }),
          " Print (",
          filteredProducts.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: handlePreviewPdf, disabled: !prefs.fields.length || !filteredProducts.length, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1.5 h-4 w-4" }),
          " Preview PDF"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: previewOpen, onOpenChange: setPreviewOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[95vh] w-[95vw] sm:max-w-5xl overflow-hidden flex flex-col p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-6 pt-5 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }),
          " Wholesale Product List — Preview"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Preview the final A4 catalog before printing or downloading." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden bg-muted/40 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "pdf-preview", srcDoc: previewHtml, className: "h-[70vh] w-full rounded border bg-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t bg-muted/30 px-6 py-4 gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setPreviewOpen(false), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-4 w-4" }),
          " Close"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePrintFromPreview, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1.5 h-4 w-4" }),
          " Print"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", onClick: handleDownloadPdfFromPreview, disabled: isPreviewingPdf, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1.5 h-4 w-4" }),
          " ",
          isPreviewingPdf ? "Generating PDF…" : "Download PDF"
        ] })
      ] })
    ] }) })
  ] });
}
function StoreAdmin() {
  const search = Route$w.useSearch();
  const navigate = useNavigate({
    from: Route$w.fullPath
  });
  const {
    isSalesDelivery
  } = useUserAccess();
  const [tab, setTab] = reactExports.useState(search.tab ?? "dashboard");
  const [salesSubTab, setSalesSubTab] = reactExports.useState("completed");
  const [websiteSubTab, setWebsiteSubTab] = reactExports.useState("banners");
  const [importOpen, setImportOpen] = reactExports.useState(false);
  const [saleOpen, setSaleOpen] = reactExports.useState(false);
  const [purchaseOpen, setPurchaseOpen] = reactExports.useState(false);
  const [saleInitial, setSaleInitial] = reactExports.useState(void 0);
  const [payOpen, setPayOpen] = reactExports.useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = reactExports.useState(false);
  const openSale = (initial) => {
    setSaleInitial(initial);
    setSaleOpen(true);
  };
  reactExports.useEffect(() => {
    if (search.tab && search.tab !== tab) setTab(search.tab);
    if (search.newSale === "1") {
      openSale(void 0);
      navigate({
        search: (p) => ({
          ...p,
          newSale: void 0
        }),
        replace: true,
        resetScroll: false
      });
    }
    if (search.paymentIn === "1") {
      setPayOpen(true);
      navigate({
        search: (p) => ({
          ...p,
          paymentIn: void 0
        }),
        replace: true,
        resetScroll: false
      });
    }
  }, [search.tab, search.newSale, search.paymentIn]);
  const handleTabChange = (v) => {
    setTab(v);
    navigate({
      search: (p) => ({
        ...p,
        tab: v
      }),
      replace: true,
      resetScroll: false
    });
  };
  const [recycleOpen, setRecycleOpen] = reactExports.useState(false);
  const [demoOpen, setDemoOpen] = reactExports.useState(false);
  const [tabsCustomizerOpen, setTabsCustomizerOpen] = reactExports.useState(false);
  const tabPrefs = useTabPrefs();
  const {
    data: activeBannerCount = 0
  } = useQuery({
    queryKey: ["shop-ads-active-count"],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from("shop_ads").select("*", {
        count: "exact",
        head: true
      }).eq("is_active", true);
      if (error) throw error;
      return count ?? 0;
    }
  });
  !!search.tab;
  const moreMenu = /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-full text-muted-foreground hover:text-foreground", "aria-label": "More actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", sideOffset: 8, className: "w-56 rounded-2xl p-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => handleTabChange("categories"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "me-2 h-4 w-4" }),
        " Category"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => handleTabChange("customers"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "me-2 h-4 w-4" }),
        " Customer Ledger"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => handleTabChange("notifications"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "me-2 h-4 w-4" }),
        " Alert"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => navigate({
        to: "/banner-ads"
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "me-2 h-4 w-4" }),
        " Banner Ads"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => navigate({
        to: "/website-banners"
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "me-2 h-4 w-4" }),
        " Website Banners"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => handleTabChange("suppliers"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "me-2 h-4 w-4" }),
        " Suppliers"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => navigate({
        to: "/stock-count"
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "me-2 h-4 w-4" }),
        " Stock Count"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => setImportOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "me-2 h-4 w-4" }),
        " Import (Vyapar)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer rounded-xl px-3 py-2.5 text-sm", onSelect: () => setTabsCustomizerOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "me-2 h-4 w-4" }),
        " Customize Tabs"
      ] })
    ] })
  ] });
  const tabContent = {
    dashboard: isSalesDelivery ? /* @__PURE__ */ jsxRuntimeExports.jsx(SalesDeliveryDashboard, { onNewSale: () => openSale(void 0), onPaymentIn: () => setPayOpen(true), onPurchase: () => setPurchaseOpen(true), onViewOrders: () => handleTabChange("orders"), onViewCustomers: () => handleTabChange("customers"), onViewProducts: () => handleTabChange("products") }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardTab, { activeBannerCount, onNewSale: () => openSale(void 0), onPaymentIn: () => setPayOpen(true), onViewOrders: () => handleTabChange("orders"), onAddProduct: () => handleTabChange("products"), onImport: () => setImportOpen(true), onAddCustomer: () => setAddCustomerOpen(true), onPurchase: () => setPurchaseOpen(true) }),
    sales: /* @__PURE__ */ jsxRuntimeExports.jsx(SalesUnified, { sub: salesSubTab, onSubChange: setSalesSubTab, onNew: () => openSale(void 0) }),
    purchases: /* @__PURE__ */ jsxRuntimeExports.jsx(PurchasesTab, { onNew: () => setPurchaseOpen(true) }),
    customers: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersTab, { onAdd: () => setAddCustomerOpen(true) }),
    payments: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentsTab, { onPaymentIn: () => setPayOpen(true) }),
    orders: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersTab, { onConvert: (o) => openSale({
      partyName: o.customer_name,
      partyMobile: o.customer_mobile,
      orderId: o.id,
      notes: o.notes ?? "",
      items: (o.items ?? []).map((it) => ({
        product_id: it.id ?? it.product_id ?? "",
        name: it.name,
        qty: Number(it.qty) || 1,
        price: Number(it.price) || 0
      }))
    }) }),
    website: /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteSection, { sub: websiteSubTab, onSubChange: setWebsiteSubTab, activeBannerCount }),
    // legacy / secondary deep-links still supported
    products: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsTab, { onImport: () => setImportOpen(true), onOpenBin: () => setRecycleOpen(true) }),
    categories: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesTab, {}),
    ads: /* @__PURE__ */ jsxRuntimeExports.jsx(AdsTab, {}),
    notifications: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsTab, {}),
    suppliers: /* @__PURE__ */ jsxRuntimeExports.jsx(SuppliersTab, {})
  };
  const ALL_TOP_TABS = [{
    value: "dashboard",
    label: "Dashboard",
    icon: LayoutGrid
  }, {
    value: "sales",
    label: "Sale",
    icon: ShoppingBag
  }, {
    value: "purchases",
    label: "Purchase",
    icon: Truck
  }, {
    value: "customers",
    label: "Customer",
    icon: Users
  }, {
    value: "payments",
    label: "Payment",
    icon: Wallet
  }, {
    value: "orders",
    label: "Order",
    icon: ShoppingCart
  }, {
    value: "website",
    label: "Website",
    icon: Image
  }];
  const BASE_TOP_TABS = isSalesDelivery ? ALL_TOP_TABS.filter((t) => t.value !== "website") : ALL_TOP_TABS;
  const TOP_TABS = applyTabPrefs(BASE_TOP_TABS, tabPrefs);
  const activeTopTab = TOP_TABS.find((t) => t.value === tab)?.value ?? BASE_TOP_TABS[0]?.value ?? "dashboard";
  const activeColorCls = COLORS[tabPrefs.activeColor] ?? COLORS.emerald;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-5xl space-y-3 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[var(--mobile-topbar-height,0px)] z-10 -mx-4 border-b border-border/50 bg-background/90 px-3 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex w-auto min-w-full gap-1 px-1", children: TOP_TABS.map((t) => {
        const Icon = t.icon;
        const active = activeTopTab === t.value;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => handleTabChange(t.value), className: `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${active ? `${activeColorCls.bg} ${activeColorCls.text}` : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
        ] }, t.value);
      }) }) }),
      !isSalesDelivery && moreMenu
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tabContent[tab] ?? tabContent.dashboard }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VyaparImportDialog, { open: importOpen, onOpenChange: setImportOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionDialog, { open: saleOpen, onOpenChange: setSaleOpen, kind: "sale", initial: saleInitial }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionDialog, { open: purchaseOpen, onOpenChange: setPurchaseOpen, kind: "purchase" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosPaymentInDialog, { open: payOpen, onOpenChange: setPayOpen, initialCustomer: null }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosCustomerAddDialog, { open: addCustomerOpen, onOpenChange: setAddCustomerOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: recycleOpen, onOpenChange: setRecycleOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-xl overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Recycle Bin" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecycleBin, {}) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DemoCleanupDialog, { open: demoOpen, onOpenChange: setDemoOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WholesaleTabsCustomizer, { open: tabsCustomizerOpen, onOpenChange: setTabsCustomizerOpen, allTabs: BASE_TOP_TABS })
  ] });
}
function SectionHeader({
  title,
  icon: Icon,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between px-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground", children: title })
    ] }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-muted-foreground", children: hint })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value,
  tone
}) {
  const accent = tone === "primary" ? "bg-primary/10 text-primary" : tone === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-2.5 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[15px] font-bold leading-tight", children: value })
    ] })
  ] });
}
const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  preparing: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
};
function OrdersTab({
  onConvert
}) {
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const {
    isAdmin,
    isSuperAdmin
  } = useUserAccess();
  const canDelete = isAdmin || isSuperAdmin;
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(null);
  const orders = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      let q = supabase.from("shop_orders").select("*").eq("is_deleted", false).order("created_at", {
        ascending: false
      }).limit(200);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const {
        data,
        error
      } = await q;
      if (error) throw error;
      return data ?? [];
    }
  });
  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status
    }) => {
      const {
        error
      } = await supabase.from("shop_orders").update({
        status
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
      setSelected(null);
      toast.success("Order updated");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const handleShareWhatsApp = (o) => {
    const url = whatsappLink(o.customer_mobile, buildOrderMessage({
      customerName: o.customer_name,
      customerMobile: o.customer_mobile,
      items: o.items,
      total: Number(o.total),
      orderNumber: o.order_number,
      status: o.status
    }));
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const handleDelete = async (o) => {
    const ok = await confirm2({
      title: "Delete Order?",
      description: "This order will move to Recycle Bin. You can restore it later.",
      confirmText: "Delete Order",
      cancelText: "Cancel",
      tone: "warning",
      icon: "warning",
      details: [{
        label: "Order No",
        value: `#${o.order_number}`
      }, {
        label: "Customer",
        value: o.customer_name
      }, {
        label: "Mobile",
        value: o.customer_mobile || "—"
      }, {
        label: "Total",
        value: `SAR ${Number(o.total).toFixed(2)}`
      }, {
        label: "Items",
        value: `${o.items?.length ?? 0}`
      }, {
        label: "Date",
        value: new Date(o.created_at).toLocaleString()
      }, {
        label: "Status",
        value: o.status
      }]
    });
    if (!ok) return;
    const {
      error
    } = await softDelete("shop_orders", o.id);
    if (error) {
      toast.error(error.message ?? "Failed to delete");
      return;
    }
    qc.invalidateQueries({
      queryKey: ["admin-orders"]
    });
    setSelected(null);
    toast.success("Order deleted", {
      description: `#${o.order_number} moved to Recycle Bin`,
      duration: 5e3,
      action: {
        label: "Undo",
        onClick: async () => {
          const r = await restore("shop_orders", o.id);
          if (r.error) {
            toast.error(r.error.message ?? "Restore failed");
            return;
          }
          qc.invalidateQueries({
            queryKey: ["admin-orders"]
          });
          toast.success("Order restored");
        }
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "confirmed", children: "Confirmed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "preparing", children: "Preparing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "delivered", children: "Delivered" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => qc.invalidateQueries({
        queryKey: ["admin-orders"]
      }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }) })
    ] }),
    orders.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : orders.data?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-10 text-center text-sm text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: orders.data?.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "relative cursor-pointer p-4 hover:bg-muted/40", onClick: () => setSelected(o), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
            "#",
            o.order_number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: STATUS_COLORS[o.status], children: o.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-sm font-medium", children: o.customer_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
          o.customer_mobile,
          " · ",
          o.items.length,
          " items · ",
          new Date(o.created_at).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold", children: [
          "SAR ",
          Number(o.total).toFixed(2)
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 -mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuLabel, { children: [
              "Order #",
              o.order_number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
              e.stopPropagation();
              setSelected(o);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "mr-2 h-4 w-4" }),
              " View Details"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
              e.stopPropagation();
              setSelected(o);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
              " Change Status"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
              e.stopPropagation();
              handleShareWhatsApp(o);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-2 h-4 w-4" }),
              " Share WhatsApp"
            ] }),
            canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "text-red-600 focus:text-red-600", onClick: (e) => {
                e.stopPropagation();
                handleDelete(o);
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                " Delete Order"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }, o.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selected, onOpenChange: (v) => !v && setSelected(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-lg p-0 gap-0 flex flex-col max-h-[90vh] overflow-hidden", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0 border-b border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Order #",
        selected.order_number
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-3 space-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium break-words", children: selected.customer_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Mobile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium break-words", children: selected.customer_mobile })
          ] })
        ] }),
        selected.customer_address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-words", children: selected.customer_address })
        ] }),
        selected.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Customer notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-words", children: selected.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selected.status, onValueChange: (v) => updateStatus.mutate({
            id: selected.id,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "confirmed", children: "Confirmed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "preparing", children: "Preparing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "delivered", children: "Delivered" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
            "Items (",
            selected.items.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border divide-y", children: selected.items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1 break-words text-[13px] leading-snug", children: [
              it.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "× ",
                it.qty
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 whitespace-nowrap font-medium tabular-nums text-[13px]", children: [
              "SAR ",
              (it.qty * it.price).toFixed(2)
            ] })
          ] }, idx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex justify-between border-t border-border pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold tabular-nums", children: [
              "SAR ",
              Number(selected.total).toFixed(2)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "shrink-0 sticky bottom-0 z-10 flex-row flex-wrap gap-2 border-t border-border bg-background/95 backdrop-blur px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "default", size: "sm", className: "gap-1", onClick: () => {
          onConvert(selected);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }),
          " Convert"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappLink(selected.customer_mobile, buildOrderMessage({
          customerName: selected.customer_name,
          customerMobile: selected.customer_mobile,
          items: selected.items,
          total: Number(selected.total),
          orderNumber: selected.order_number,
          status: selected.status
        })), target: "_blank", rel: "noopener noreferrer", className: "inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          " WhatsApp"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setSelected(null), children: "Close" })
      ] })
    ] }) }) })
  ] });
}
function ProductsTab({
  onImport,
  onOpenBin
}) {
  const search = Route$w.useSearch();
  const navigate = useNavigate({
    from: Route$w.fullPath
  });
  const activeCategoryId = search.category ?? null;
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [scannerOpen, setScannerOpen] = reactExports.useState(false);
  const [scannerDup, setScannerDup] = reactExports.useState(null);
  async function handleProductScan(code) {
    if (!editing) return;
    const {
      data
    } = await supabase.from("shop_products").select("id,name,item_code,barcode").or(`item_code.eq.${code},barcode.eq.${code}`).eq("is_deleted", false).limit(1).maybeSingle();
    if (data && data.id !== editing.id) {
      setScannerOpen(false);
      setScannerDup({
        id: data.id,
        name: data.name,
        barcode: code
      });
      return;
    }
    setEditing({
      ...editing,
      item_code: code
    });
    setScannerOpen(false);
    toast.success(`Product barcode set: ${code}`);
  }
  const [selectMode, setSelectMode] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [confirmBulk, setConfirmBulk] = reactExports.useState(false);
  const [stockFilter, setStockFilter] = reactExports.useState("all");
  const [query, setQuery] = reactExports.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [visibleCount, setVisibleCount] = reactExports.useState(30);
  const [nameFocused, setNameFocused] = reactExports.useState(false);
  const nextProductFieldRef = reactExports.useRef(null);
  const [printOpen, setPrintOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const n = search.newName;
    if (!n || editing) return;
    setEditing({
      name: n,
      is_visible: true,
      show_stock: true,
      tax_rate: 15,
      compare_price: null,
      category_id: activeCategoryId
    });
    navigate({
      search: (p) => ({
        ...p,
        newName: void 0
      }),
      replace: true,
      resetScroll: false
    });
  }, [search.newName]);
  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_products").select("*").eq("is_deleted", false).order("sort_order").order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const cats = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const catMap = reactExports.useMemo(() => new Map((cats.data ?? []).map((c) => [c.id, c])), [cats.data]);
  const activeCategory = activeCategoryId ? catMap.get(activeCategoryId) : null;
  const filtered = reactExports.useMemo(() => {
    const list = products.data ?? [];
    const q = debouncedQuery.trim().toLowerCase();
    const matchScore = (p) => {
      if (!q) return 0;
      const cName = p.category_id && catMap.get(p.category_id)?.name || "";
      const fields = [p.name, p.name_bn, p.name_ar, p.item_code, p.barcode, cName];
      let best = 0;
      for (const f of fields) {
        const v = (f ?? "").toString().toLowerCase();
        if (!v) continue;
        if (v === q) {
          best = Math.max(best, 4);
          continue;
        }
        if (v.startsWith(q)) {
          best = Math.max(best, 3);
          continue;
        }
        if (v.includes(" " + q)) {
          best = Math.max(best, 2);
          continue;
        }
        if (v.includes(q)) {
          best = Math.max(best, 1);
        }
      }
      return best;
    };
    const productInCategory = (p, catId) => {
      if (p.category_id === catId) return true;
      const ids = Array.isArray(p.category_ids) ? p.category_ids : [];
      return ids.includes(catId);
    };
    return list.filter((p) => {
      if (activeCategoryId && !productInCategory(p, activeCategoryId)) return false;
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (stockFilter === "in") return st > 0 && !(min > 0 && st <= min);
      if (stockFilter === "low") return min > 0 && st > 0 && st <= min;
      if (stockFilter === "zero") return st === 0;
      if (stockFilter === "negative") return st < 0;
      return true;
    }).map((p, i) => ({
      p,
      i,
      score: matchScore(p)
    })).filter((x) => !q || x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i).map((x) => x.p);
  }, [products.data, catMap, debouncedQuery, activeCategoryId, stockFilter]);
  const openNewProductFromSearch = reactExports.useCallback(() => {
    const name = query.trim();
    if (!name) return;
    setEditing({
      name,
      is_visible: true,
      show_stock: true,
      price: void 0,
      compare_price: null,
      purchase_price: void 0,
      stock: void 0,
      min_stock: void 0,
      tax_rate: 15,
      category_id: activeCategoryId ?? null,
      category_ids: activeCategoryId ? [activeCategoryId] : []
    });
    window.setTimeout(() => nextProductFieldRef.current?.focus(), 0);
  }, [activeCategoryId, query]);
  reactExports.useEffect(() => {
    setVisibleCount(30);
  }, [debouncedQuery, stockFilter, activeCategoryId]);
  const totalCount = filtered.length;
  const hasMore = visibleCount < totalCount;
  const sentinelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisibleCount((c) => c < totalCount ? Math.min(c + 30, totalCount) : c);
      }
    }, {
      rootMargin: "600px 0px"
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visibleCount, totalCount]);
  const visible = reactExports.useMemo(() => {
    const slice = filtered.slice(0, visibleCount);
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const p of slice) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
    return out;
  }, [filtered, visibleCount]);
  const rawName = !editing || editing.id ? "" : editing.name ?? "";
  const debouncedName = useDebouncedValue(rawName, 500);
  const nameSuggestions = reactExports.useMemo(() => {
    if (!editing || editing.id) return [];
    const q = debouncedName.trim().replace(/\s+/g, " ").toLowerCase();
    if (q.length < 4) return [];
    const list = products.data ?? [];
    const score = (p) => {
      const v = (p.name ?? "").replace(/\s+/g, " ").toLowerCase();
      if (!v) return -1;
      if (v === q) return 4;
      if (v.startsWith(q)) return 3;
      if (v.includes(" " + q)) return 2;
      if (v.includes(q)) return 1;
      return -1;
    };
    return list.map((p) => ({
      p,
      s: score(p)
    })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || (a.p.name ?? "").length - (b.p.name ?? "").length).slice(0, 5).map((x) => x.p);
  }, [editing, debouncedName, products.data]);
  const findDuplicate = reactExports.useCallback((p) => {
    const list = products.data ?? [];
    const name = (p.name ?? "").trim().toLowerCase();
    const code = (p.item_code ?? "").trim().toLowerCase();
    const bc = (p.barcode ?? "").trim().toLowerCase();
    for (const x of list) {
      if (p.id && x.id === p.id) continue;
      if (name && (x.name ?? "").trim().toLowerCase() === name) return x;
      if (code) {
        if ((x.item_code ?? "").trim().toLowerCase() === code) return x;
        if ((x.barcode ?? "").trim().toLowerCase() === code) return x;
      }
      if (bc) {
        if ((x.barcode ?? "").trim().toLowerCase() === bc) return x;
        if ((x.item_code ?? "").trim().toLowerCase() === bc) return x;
      }
    }
    return null;
  }, [products.data]);
  const save = useMutation({
    mutationFn: async (p) => {
      const payload = {
        name: p.name?.trim() ?? "",
        name_bn: p.name_bn?.trim() || null,
        name_ar: p.name_ar?.trim() || null,
        description: p.description?.trim() || null,
        image_url: p.image_url?.trim() || null,
        gallery_image_urls: Array.isArray(p.gallery_image_urls) ? p.gallery_image_urls.filter((u) => typeof u === "string" && u.length > 0) : [],
        item_code: p.item_code?.trim() || null,
        barcode: p.barcode?.trim() || null,
        price: Number(p.price ?? 0),
        compare_price: p.compare_price == null || p.compare_price === "" ? null : Number(p.compare_price),
        purchase_price: Number(p.purchase_price ?? 0),
        tax_rate: Number(p.tax_rate ?? 15),
        tax_inclusive: true,
        stock: Number(p.stock ?? 0),
        min_stock: Number(p.min_stock ?? 0),
        category_id: p.category_id || Array.isArray(p.category_ids) && p.category_ids[0] || null,
        category_ids: Array.isArray(p.category_ids) ? p.category_ids.filter(Boolean) : p.category_id ? [p.category_id] : [],
        is_visible: p.is_visible ?? true,
        is_featured: p.is_featured ?? false,
        show_stock: p.show_stock ?? true,
        sort_order: Number(p.sort_order ?? 0)
      };
      if (!payload.name) throw new Error("Name required");
      if (p.id) {
        const {
          error
        } = await supabase.from("shop_products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("shop_products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-products"]
      });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const invalidateProductLists = reactExports.useCallback(() => {
    qc.invalidateQueries({
      queryKey: ["admin-products"]
    });
    qc.invalidateQueries({
      queryKey: ["store-products"]
    });
  }, [qc]);
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await softDelete("shop_products", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      invalidateProductLists();
      setDeleteTarget(null);
      toast.success("Product deleted", {
        description: "Moved to Recycle Bin.",
        duration: 5e3,
        action: {
          label: "Undo",
          onClick: async () => {
            const r = await restore("shop_products", id);
            if (r.error) toast.error(r.error.message);
            else {
              invalidateProductLists();
              toast.success("Restored");
            }
          }
        },
        cancel: onOpenBin ? {
          label: "View Bin",
          onClick: () => onOpenBin()
        } : void 0
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const bulkRemove = useMutation({
    mutationFn: async (ids) => {
      const results = await Promise.all(ids.map((id) => softDelete("shop_products", id)));
      const fail = results.find((r) => r.error);
      if (fail?.error) throw new Error(fail.error.message);
      return ids.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-products"]
      });
      setSelected(/* @__PURE__ */ new Set());
      setSelectMode(false);
      setConfirmBulk(false);
      toast.success(`${count} product(s) moved to Recycle Bin`);
    },
    onError: (e) => {
      setConfirmBulk(false);
      toast.error(e?.message ?? "Failed");
    }
  });
  const toggle = useMutation({
    mutationFn: async ({
      id,
      field,
      value
    }) => {
      const patch = field === "is_visible" ? {
        is_visible: value
      } : {
        is_featured: value
      };
      const {
        error
      } = await supabase.from("shop_products").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["admin-products"]
    })
  });
  const allIds = filtered.map((p) => p.id);
  const allSelected = selectMode && allIds.length > 0 && allIds.every((id) => selected.has(id));
  const counts = (() => {
    const list = products.data ?? [];
    let inS = 0, low = 0, zero = 0, neg = 0;
    for (const p of list) {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (st < 0) neg++;
      else if (st === 0) zero++;
      else if (min > 0 && st <= min) low++;
      else inS++;
    }
    return {
      all: list.length,
      in: inS,
      low,
      zero,
      negative: neg
    };
  })();
  const filterChips = [{
    key: "all",
    label: "All",
    count: counts.all
  }, {
    key: "in",
    label: "In stock",
    count: counts.in,
    tone: "text-emerald-700 dark:text-emerald-300"
  }, {
    key: "low",
    label: "Low",
    count: counts.low,
    tone: "text-amber-700 dark:text-amber-300"
  }, {
    key: "zero",
    label: "Zero",
    count: counts.zero,
    tone: "text-orange-700 dark:text-orange-300"
  }, {
    key: "negative",
    label: "Negative",
    count: counts.negative,
    tone: "text-rose-700 dark:text-rose-300"
  }];
  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const enterSelect = (id) => {
    setSelectMode(true);
    if (id) setSelected(/* @__PURE__ */ new Set([id]));
  };
  let pressTimer = null;
  const onPressStart = (id) => {
    pressTimer = setTimeout(() => enterSelect(id), 450);
  };
  const onPressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };
  const noMatch = !products.isLoading && debouncedQuery.trim().length > 0 && filtered.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 -mx-1 mb-2 bg-background/95 px-1 pb-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/70", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-3.5-3.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search name, barcode, SKU…", className: "h-10 rounded-xl pl-9 pr-9 text-sm", inputMode: "search", autoComplete: "off", autoCorrect: "off", autoCapitalize: "off", spellCheck: "false" }),
          query && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQuery(""), className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted", "aria-label": "Clear", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        noMatch && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", onClick: openNewProductFromSearch, className: "h-10 w-10 shrink-0 rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700", title: `Add "${debouncedQuery.trim()}" as new product`, "aria-label": "Add new product", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) }),
        !selectMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "h-10 w-10 shrink-0 rounded-xl", "aria-label": "Product actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onSelect: () => setEditing({
              is_visible: true,
              show_stock: true,
              price: void 0,
              compare_price: null,
              purchase_price: void 0,
              stock: void 0,
              min_stock: void 0,
              tax_rate: 15,
              category_id: activeCategoryId ?? null,
              category_ids: activeCategoryId ? [activeCategoryId] : []
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-2 h-4 w-4" }),
              " New product"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onSelect: () => setSelectMode(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "me-2 h-4 w-4" }),
              " Select / Bulk"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onSelect: onImport, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "me-2 h-4 w-4" }),
              " Import"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onSelect: () => setPrintOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "me-2 h-4 w-4" }),
              " Print Product List"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: allSelected, onCheckedChange: (v) => setSelected(v ? new Set(allIds) : /* @__PURE__ */ new Set()), "aria-label": "Select all" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: selected.size }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9", onClick: () => {
            setSelectMode(false);
            setSelected(/* @__PURE__ */ new Set());
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] })
      ] }),
      noMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 px-1 text-[12px] text-muted-foreground", children: [
        "No Match Found —",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: openNewProductFromSearch, className: "font-medium text-emerald-600 hover:underline", children: [
          'Add "',
          debouncedQuery.trim(),
          '" as new product'
        ] })
      ] })
    ] }),
    activeCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: activeCategory.name }),
        " · ",
        filtered.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "ml-auto h-7 px-2", onClick: () => navigate({
        search: (p) => ({
          ...p,
          category: void 0
        }),
        replace: true
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
        " Clear"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1", children: filterChips.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setStockFilter(c.key), className: `shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${stockFilter === c.key ? "border-primary bg-primary text-primary-foreground" : `border-border bg-background hover:bg-muted ${c.tone ?? ""}`}`, children: [
      c.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70", children: [
        "(",
        c.count,
        ")"
      ] })
    ] }, c.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", children: products.isLoading ? Array.from({
      length: 8
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCardSkeleton, {}, i)) : visible.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, selectMode, isSelected: selected.has(p.id), onToggleSelect: toggleOne, onPressStart, onPressEnd, onEdit: setEditing, onToggleVisible: (id, value) => toggle.mutate({
      id,
      field: "is_visible",
      value
    }), onAskDelete: setDeleteTarget }, p.id)) }),
    hasMore ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({
      length: 3
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCardSkeleton, {}, `more-${i}`)) }) : !products.isLoading && totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 text-center text-[11px] text-muted-foreground", children: [
      "All products loaded · ",
      totalCount
    ] }),
    !products.isLoading && filtered.length === 0 && !debouncedQuery.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl", children: "📦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold", children: "No products yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[12.5px] text-muted-foreground", children: "Add your first product to get started." })
    ] }),
    selectMode && selected.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(95vw,32rem)] items-center justify-between gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-2xl backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
        selected.size,
        " selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => {
          setSelected(/* @__PURE__ */ new Set());
          setSelectMode(false);
        }, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", onClick: () => setConfirmBulk(true), disabled: bulkRemove.isPending, className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
          " Delete ",
          selected.size
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmBulk, onOpenChange: setConfirmBulk, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete ",
          selected.size,
          " product(s)?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "They will be moved to the Recycle Bin. You can restore them later." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => bulkRemove.mutate(Array.from(selected)), className: "bg-destructive text-destructive-foreground", children: "Move to Recycle Bin" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[92vh] max-w-lg overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit product" : "New product" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product images", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGalleryUpload, { mainUrl: editing.image_url, gallery: editing.gallery_image_urls ?? [], onMainChange: (url) => setEditing({
          ...editing,
          image_url: url
        }), onGalleryChange: (urls) => setEditing({
          ...editing,
          gallery_image_urls: urls
        }), searchHints: {
          name: editing.name,
          barcode: editing.barcode,
          itemCode: editing.item_code
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product name (English) *", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.name ?? "", onChange: (e) => setEditing({
            ...editing,
            name: e.target.value
          }), onFocus: () => setNameFocused(true), onBlur: () => setTimeout(() => setNameFocused(false), 150), autoComplete: "off" }),
          !editing.id && nameFocused && nameSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900", children: "⚠️ Possible existing products — tap to edit instead" }),
            nameSuggestions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onMouseDown: (e) => {
              e.preventDefault();
              setNameFocused(false);
              setEditing(p);
              toast.message("⚠️ এই প্রোডাক্টটি আগে থেকেই আছে। নতুন প্রোডাক্ট তৈরির পরিবর্তে বিদ্যমান প্রোডাক্টটি খোলা হয়েছে।");
            }, className: "flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors hover:bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "No img" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
                  p.item_code ? `#${p.item_code}` : "No barcode",
                  " • Stock: ",
                  Number(p.stock ?? 0)
                ] })
              ] })
            ] }, p.id))
          ] }),
          !editing.id && nameFocused && debouncedName.trim().length >= 4 && nameSuggestions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800 shadow-sm", children: "✅ নতুন প্রোডাক্ট তৈরি করা যাবে।" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name (Bengali)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ref: nextProductFieldRef, value: editing.name_bn ?? "", onChange: (e) => setEditing({
            ...editing,
            name_bn: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name (Arabic)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { dir: "rtl", className: "text-right", value: editing.name_ar ?? "", onChange: (e) => setEditing({
            ...editing,
            name_ar: e.target.value
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product Barcode", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.item_code ?? "", onChange: (e) => setEditing({
            ...editing,
            item_code: e.target.value
          }), placeholder: "Scan or type barcode / SKU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "icon", onClick: () => setScannerOpen(true), title: "Scan product barcode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sale price (SAR, VAT incl.)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: editing.price ?? "", placeholder: "", onChange: (e) => setEditing({
            ...editing,
            price: e.target.value === "" ? void 0 : Number(e.target.value)
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Purchase price (SAR)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: editing.purchase_price ?? "", placeholder: "", onChange: (e) => setEditing({
            ...editing,
            purchase_price: e.target.value === "" ? void 0 : Number(e.target.value)
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Other Company Price (SAR) — optional, shown to customers as strike-through", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: editing.compare_price ?? "", placeholder: "Leave empty to hide comparison", onChange: (e) => setEditing({
          ...editing,
          compare_price: e.target.value === "" ? null : Number(e.target.value)
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tax %", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: editing.tax_rate ?? 15, onChange: (e) => setEditing({
            ...editing,
            tax_rate: Number(e.target.value)
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Stock", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editing.stock ?? "", placeholder: "", onChange: (e) => setEditing({
            ...editing,
            stock: e.target.value === "" ? void 0 : Number(e.target.value)
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Min stock", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editing.min_stock ?? "", placeholder: "", onChange: (e) => setEditing({
            ...editing,
            min_stock: e.target.value === "" ? void 0 : Number(e.target.value)
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Categories (select one or more)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-border p-2", children: [
          (cats.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No categories yet." }),
          (cats.data ?? []).map((c) => {
            const ids = new Set(Array.isArray(editing.category_ids) ? editing.category_ids : editing.category_id ? [editing.category_id] : []);
            const on = ids.has(c.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              on ? ids.delete(c.id) : ids.add(c.id);
              const arr = Array.from(ids);
              setEditing({
                ...editing,
                category_ids: arr,
                category_id: arr[0] ?? null
              });
            }, className: `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`, children: c.name }, c.id);
          })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: editing.description ?? "", onChange: (e) => setEditing({
          ...editing,
          description: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Website visible", value: editing.is_visible ?? true, onChange: (v) => setEditing({
            ...editing,
            is_visible: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Featured", value: editing.is_featured ?? false, onChange: (v) => setEditing({
            ...editing,
            is_featured: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Show stock", value: editing.show_stock ?? true, onChange: (v) => setEditing({
            ...editing,
            show_stock: v
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground", children: [
          "Sale price is the final price customers pay — 15% VAT is already included. If you enter ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "SAR 15" }),
          ", the customer sees ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "SAR 15" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => {
          if (!editing) return;
          const dup = findDuplicate(editing);
          if (dup) {
            toast.error("⚠️ এই প্রোডাক্টটি ইতিমধ্যে রয়েছে। অনুগ্রহ করে বিদ্যমান প্রোডাক্টটি Edit করুন।");
            setEditing(dup);
            return;
          }
          save.mutate(editing);
        }, children: "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BarcodeScanner, { open: scannerOpen, onOpenChange: setScannerOpen, mode: "single", title: "Scan product barcode", onDetected: handleProductScan }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!scannerDup, onOpenChange: (v) => !v && setScannerDup(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Barcode already exists" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "The barcode ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: scannerDup?.barcode }),
          " is already assigned to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: scannerDup?.name }),
          ". Duplicates are not allowed."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: () => setScannerDup(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: async () => {
          if (!scannerDup) return;
          const {
            data
          } = await supabase.from("shop_products").select("*").eq("id", scannerDup.id).maybeSingle();
          if (data) setEditing(data);
          setScannerDup(null);
        }, children: "Open existing product" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteProductDialog, { product: deleteTarget, onOpenChange: (v) => !v && setDeleteTarget(null), onConfirm: () => deleteTarget && remove.mutate(deleteTarget.id), pending: remove.isPending }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PrintProductListDialog, { open: printOpen, onOpenChange: setPrintOpen, products: filtered, categoryMap: catMap })
  ] });
}
const ProductCard = reactExports.memo(function ProductCard2({
  product: p,
  selectMode,
  isSelected,
  onToggleSelect,
  onPressStart,
  onPressEnd,
  onEdit,
  onToggleVisible,
  onAskDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `p-2 transition-colors ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""} ${selectMode ? "cursor-pointer" : ""}`, onClick: selectMode ? () => onToggleSelect(p.id) : void 0, onTouchStart: () => onPressStart(p.id), onTouchEnd: onPressEnd, onTouchMove: onPressEnd, onMouseDown: () => onPressStart(p.id), onMouseUp: onPressEnd, onMouseLeave: onPressEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    selectMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: isSelected, onCheckedChange: () => onToggleSelect(p.id), onClick: (e) => e.stopPropagation() }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: p.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, loading: "lazy", decoding: "async", className: "h-full w-full object-cover" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-semibold leading-tight text-foreground", children: p.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sale:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400", children: [
            "SAR ",
            Number(p.price).toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Purchase:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: [
            "SAR ",
            Number(p.purchase_price ?? 0).toFixed(0)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Stock:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-violet-600 dark:text-violet-400", children: p.stock }),
          Number(p.stock) < 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-rose-500 px-1.5 py-0 text-[9px] font-semibold text-white", children: "Negative" }),
          Number(p.stock) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-orange-500 px-1.5 py-0 text-[9px] font-semibold text-white", children: "Out" }),
          Number(p.stock) > 0 && Number(p.min_stock) > 0 && Number(p.stock) <= Number(p.min_stock) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0 text-[9px] font-semibold text-white", children: "Low" }),
          !p.is_visible && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full border border-border bg-background px-1.5 py-0 text-[9px] font-semibold text-muted-foreground", children: "Hidden" })
        ] }),
        p.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0 text-[9px] font-semibold text-white", children: "★" })
      ] })
    ] }),
    !selectMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 self-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: (e) => {
        e.stopPropagation();
        onEdit(p);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: (e) => {
        e.stopPropagation();
        onToggleVisible(p.id, !p.is_visible);
      }, children: p.is_visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", onClick: (e) => {
        e.stopPropagation();
        onAskDelete(p);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-rose-500" }) })
    ] })
  ] }) });
});
function ProductCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 flex-shrink-0 animate-pulse rounded-lg bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1.5 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3/5 animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-4/5 animate-pulse rounded bg-muted/70" })
    ] })
  ] }) });
}
function DeleteProductDialog({
  product,
  onOpenChange,
  onConfirm,
  pending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!product, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-sm rounded-2xl border-border/60 bg-background/95 p-0 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:rounded-2xl", children: product && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "mt-3 space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-[15px] font-display", children: "Delete Product?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[12.5px] leading-snug text-muted-foreground", children: [
        "This product will move to Recycle Bin.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "You can restore it later."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: product.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: product.name, loading: "lazy", decoding: "async", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-semibold leading-tight", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-tight text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Stock ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-violet-600 dark:text-violet-400", children: product.stock })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Sale ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400", children: [
              "SAR ",
              Number(product.price).toFixed(0)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Purchase ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: [
              "SAR ",
              Number(product.purchase_price ?? 0).toFixed(0)
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1 rounded-xl", onClick: () => onOpenChange(false), disabled: pending, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1 rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-sm hover:brightness-110", onClick: onConfirm, disabled: pending, children: pending ? "Deleting…" : "Delete Product" })
    ] })
  ] }) }) });
}
function CategoriesTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [drillCatId, setDrillCatId] = reactExports.useState(null);
  const [q, setQ] = reactExports.useState("");
  const cats = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_products").select("*").eq("is_deleted", false).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const inCat = (p, id) => p.category_id === id || Array.isArray(p.category_ids) && p.category_ids.includes(id);
  const counts = reactExports.useMemo(() => {
    const out = {};
    for (const p of products.data ?? []) {
      const ids = /* @__PURE__ */ new Set();
      if (p.category_id) ids.add(p.category_id);
      (p.category_ids ?? []).forEach((x) => x && ids.add(x));
      ids.forEach((id) => {
        out[id] = (out[id] ?? 0) + 1;
      });
    }
    return out;
  }, [products.data]);
  const save = useMutation({
    mutationFn: async (c) => {
      const payload = {
        name: c.name?.trim() ?? "",
        name_bn: c.name_bn?.trim() || null,
        name_ar: c.name_ar?.trim() || null,
        icon: c.icon?.trim() || null,
        sort_order: Number(c.sort_order ?? 0),
        is_active: c.is_active ?? true,
        slug: c.slug?.trim() ? c.slug.trim().toLowerCase() : null
      };
      if (!payload.name) throw new Error("Name required");
      if (c.id) {
        const {
          error
        } = await supabase.from("shop_categories").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("shop_categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-categories"]
      });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("shop_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-categories"]
      });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const reorder = useMutation({
    mutationFn: async ({
      id,
      dir
    }) => {
      const list = [...cats.data ?? []];
      const idx = list.findIndex((c) => c.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= list.length) return;
      const a = list[idx], b = list[swap];
      const aOrder = a.sort_order ?? 0, bOrder = b.sort_order ?? 0;
      await supabase.from("shop_categories").update({
        sort_order: bOrder
      }).eq("id", a.id);
      await supabase.from("shop_categories").update({
        sort_order: aOrder
      }).eq("id", b.id);
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["admin-categories"]
    })
  });
  if (drillCatId) {
    const cat = cats.data?.find((c) => c.id === drillCatId);
    if (!cat) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-sm text-muted-foreground", children: [
        "Category not found.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-primary underline", onClick: () => setDrillCatId(null), children: "Go back" })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryDrilldown, { category: cat, allProducts: products.data ?? [], productsLoading: products.isLoading, inCat, onBack: () => setDrillCatId(null), onEdit: () => setEditing(cat) });
  }
  const filteredCats = (cats.data ?? []).filter((c) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return c.name.toLowerCase().includes(t) || (c.name_bn ?? "").toLowerCase().includes(t) || (c.name_ar ?? "").toLowerCase().includes(t);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        cats.data?.length ?? 0,
        " categories"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEditing({
        is_active: true,
        sort_order: cats.data?.length ?? 0
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-4 w-4" }),
        " New category"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-3.5-3.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search categories…", className: "h-11 rounded-xl pl-9 text-sm", inputMode: "search" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: filteredCats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: "No categories." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: filteredCats.map((c, i) => {
      const count = counts[c.id] ?? 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 px-3 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setDrillCatId(c.id), className: "flex min-w-0 flex-1 items-center gap-3 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5", children: c.icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.icon, alt: "", loading: "lazy", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-primary/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[15px] font-semibold leading-tight", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
              count,
              " product",
              count === 1 ? "" : "s",
              !c.is_active ? " · Hidden" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", disabled: i === 0 || !!q.trim(), onClick: () => reorder.mutate({
            id: c.id,
            dir: -1
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", disabled: i === filteredCats.length - 1 || !!q.trim(), onClick: () => reorder.mutate({
            id: c.id,
            dir: 1
          }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => setEditing(c), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => confirm(`Delete "${c.name}"?`) && remove.mutate(c.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-500" }) })
        ] })
      ] }, c.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[92vh] max-w-md overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit category" : "New category" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category image / icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductImageUpload, { value: editing.icon ?? null, onChange: (url) => setEditing({
          ...editing,
          icon: url
        }), searchHints: {
          name: editing.name
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.name ?? "", onChange: (e) => setEditing({
          ...editing,
          name: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name (Bengali)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.name_bn ?? "", onChange: (e) => setEditing({
            ...editing,
            name_bn: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name (Arabic)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { dir: "rtl", className: "text-right", value: editing.name_ar ?? "", onChange: (e) => setEditing({
            ...editing,
            name_ar: e.target.value
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sort order", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editing.sort_order ?? 0, onChange: (e) => setEditing({
          ...editing,
          sort_order: Number(e.target.value)
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Smart section (optional)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm", value: editing.slug ?? "", onChange: (e) => setEditing({
            ...editing,
            slug: e.target.value || null
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— None —" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "recommended", children: "⭐ Recommended (top of home)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "best-seller", children: "🔥 Best Seller" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new-arrival", children: "🆕 New Arrival" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "offer", children: "🏷 Offer Items" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "Products assigned here automatically appear in the matching home section on the customer website." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Active", value: editing.is_active ?? true, onChange: (v) => setEditing({
          ...editing,
          is_active: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => editing && save.mutate(editing), children: "Save" })
      ] })
    ] }) })
  ] });
}
function CategoryDrilldown({
  category,
  allProducts,
  productsLoading,
  inCat,
  onBack,
  onEdit
}) {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [stockFilter, setStockFilter] = reactExports.useState("all");
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const matches = (p) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return [p.name, p.name_bn, p.name_ar, p.item_code, p.barcode].some((v) => (v ?? "").toString().toLowerCase().includes(t));
  };
  const inThisCat = allProducts.filter((p) => inCat(p, category.id));
  const counts = (() => {
    let inS = 0, low = 0, zero = 0, neg = 0;
    for (const p of inThisCat) {
      const st = Number(p.stock ?? 0), min = Number(p.min_stock ?? 0);
      if (st < 0) neg++;
      else if (st === 0) zero++;
      else if (min > 0 && st <= min) low++;
      else inS++;
    }
    return {
      all: inThisCat.length,
      in: inS,
      low,
      zero,
      negative: neg
    };
  })();
  const filtered = inThisCat.filter((p) => {
    if (!matches(p)) return false;
    const st = Number(p.stock ?? 0), min = Number(p.min_stock ?? 0);
    if (stockFilter === "in") return st > 0 && !(min > 0 && st <= min);
    if (stockFilter === "low") return min > 0 && st > 0 && st <= min;
    if (stockFilter === "zero") return st === 0;
    if (stockFilter === "negative") return st < 0;
    return true;
  });
  const chips = [{
    key: "all",
    label: "All",
    count: counts.all
  }, {
    key: "in",
    label: "In stock",
    count: counts.in,
    tone: "text-emerald-700 dark:text-emerald-300"
  }, {
    key: "low",
    label: "Low",
    count: counts.low,
    tone: "text-amber-700 dark:text-amber-300"
  }, {
    key: "zero",
    label: "Zero",
    count: counts.zero,
    tone: "text-orange-700 dark:text-orange-300"
  }, {
    key: "negative",
    label: "Negative",
    count: counts.negative,
    tone: "text-rose-700 dark:text-rose-300"
  }];
  const removeFromCat = useMutation({
    mutationFn: async (productId) => {
      const p = allProducts.find((x) => x.id === productId);
      if (!p) return;
      const current = new Set(Array.isArray(p.category_ids) ? p.category_ids : []);
      if (p.category_id) current.add(p.category_id);
      current.delete(category.id);
      const arr = Array.from(current);
      const {
        error
      } = await supabase.from("shop_products").update({
        category_ids: arr,
        category_id: p.category_id === category.id ? arr[0] ?? null : p.category_id
      }).eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-products"]
      });
      toast.success("Removed from category");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const linkProducts = useMutation({
    mutationFn: async (ids) => {
      const ops = ids.map(async (pid) => {
        const p = allProducts.find((x) => x.id === pid);
        const current = new Set(Array.isArray(p?.category_ids) ? p.category_ids : []);
        if (p?.category_id) current.add(p.category_id);
        current.add(category.id);
        const arr = Array.from(current);
        const patch = {
          category_ids: arr
        };
        if (!p?.category_id) patch.category_id = category.id;
        return supabase.from("shop_products").update(patch).eq("id", pid);
      });
      const res = await Promise.all(ops);
      const fail = res.find((r) => r.error);
      if (fail?.error) throw fail.error;
      return ids.length;
    },
    onSuccess: (n) => {
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-products"]
      });
      setPickerOpen(false);
      toast.success(`${n} product(s) added`);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: onBack, className: "-ms-2 gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 -rotate-90" }),
        " Categories"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-base font-semibold leading-tight", children: category.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          inThisCat.length,
          " product",
          inThisCat.length === 1 ? "" : "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: onEdit, className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-3.5-3.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search products in this category…", className: "h-11 rounded-xl pl-9 text-sm", inputMode: "search" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1", children: chips.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setStockFilter(c.key), className: `shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${stockFilter === c.key ? "border-primary bg-primary text-primary-foreground" : `border-border bg-background hover:bg-muted ${c.tone ?? ""}`}`, children: [
      c.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70", children: [
        "(",
        c.count,
        ")"
      ] })
    ] }, c.key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border bg-card", children: productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: inThisCat.length === 0 ? "No products in this category yet. Tap + to add some." : "No products match." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: filtered.map((p) => {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      const stockTone = st < 0 ? "text-rose-600" : st === 0 ? "text-orange-600" : min > 0 && st <= min ? "text-amber-600" : "text-emerald-700";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 px-3 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[15px] font-semibold leading-tight", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
            "Stock: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: stockTone, children: p.stock }),
            " | ",
            "Purchase: SAR ",
            Number(p.purchase_price ?? 0).toFixed(2),
            " | ",
            "Sale: SAR ",
            Number(p.price ?? 0).toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 shrink-0", onClick: () => confirm(`Remove "${p.name}" from ${category.name}?`) && removeFromCat.mutate(p.id), "aria-label": "Remove from category", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-muted-foreground" }) })
      ] }, p.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPickerOpen(true), className: "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-95", "aria-label": "Add products", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-6 w-6" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProductPickerDialog, { open: pickerOpen, onClose: () => setPickerOpen(false), categoryName: category.name, candidates: allProducts.filter((p) => !inCat(p, category.id)), busy: linkProducts.isPending, onConfirm: (ids) => linkProducts.mutate(ids) })
  ] });
}
function ProductPickerDialog({
  open,
  onClose,
  categoryName,
  candidates,
  busy,
  onConfirm
}) {
  const [q, setQ] = reactExports.useState("");
  const [picked, setPicked] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!open) {
      setQ("");
      setPicked(/* @__PURE__ */ new Set());
    }
  }, [open]);
  const t = q.trim().toLowerCase();
  const filtered = candidates.filter((p) => !t || [p.name, p.name_bn, p.name_ar, p.item_code, p.barcode].some((v) => (v ?? "").toString().toLowerCase().includes(t)));
  const toggle = (id) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex max-h-[92vh] max-w-md flex-col p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Add products to ",
      categoryName
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m21 21-3.5-3.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search products…", className: "h-11 rounded-xl pl-9 text-sm", inputMode: "search" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: candidates.length === 0 ? "All products are already in this category." : "No matches." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: filtered.map((p) => {
      const on = picked.has(p.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(p.id), className: `flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${on ? "bg-primary/10" : "hover:bg-muted/60"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: on, onCheckedChange: () => toggle(p.id), onClick: (e) => e.stopPropagation() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-semibold leading-tight", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11.5px] text-muted-foreground", children: [
            "Stock: ",
            p.stock,
            " · Sale: SAR ",
            Number(p.price ?? 0).toFixed(2)
          ] })
        ] })
      ] }) }, p.id);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, className: "flex-1", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: picked.size === 0 || busy, onClick: () => onConfirm(Array.from(picked)), className: "flex-1", children: busy ? "Adding…" : `Add ${picked.size || ""}`.trim() })
    ] })
  ] }) });
}
function AdsTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopAdsManager, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PromoPopupEditor, {})
  ] });
}
function ShopAdsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const list = useQuery({
    queryKey: ["admin-shop-ads"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_ads").select("id,title,image_url,placement,link_type,link_value,is_active,sort_order").order("sort_order", {
        ascending: true
      }).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const products = useQuery({
    queryKey: ["admin-shop-ads-products"],
    staleTime: 6e4,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_products").select("id,name").eq("is_deleted", false).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const categories = useQuery({
    queryKey: ["admin-shop-ads-cats"],
    staleTime: 6e4,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_categories").select("id,name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const invalidate = () => {
    qc.invalidateQueries({
      queryKey: ["admin-shop-ads"]
    });
    qc.invalidateQueries({
      queryKey: ["store-ads"]
    });
  };
  const save = useMutation({
    mutationFn: async (a) => {
      const linkType = a.link_type ?? "none";
      const payload = {
        title: a.title?.trim() || null,
        image_url: a.image_url?.trim() || null,
        placement: a.placement ?? "home",
        link_type: linkType,
        link_value: linkType === "none" ? null : a.link_value?.trim() || null,
        is_active: a.is_active ?? true,
        sort_order: Number(a.sort_order ?? list.data?.length ?? 0)
      };
      if (a.id) {
        const {
          error
        } = await supabase.from("shop_ads").update(payload).eq("id", a.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("shop_ads").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const toggle = useMutation({
    mutationFn: async (a) => {
      const {
        error
      } = await supabase.from("shop_ads").update({
        is_active: !a.is_active
      }).eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: invalidate
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("shop_ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    }
  });
  const reorder = useMutation({
    mutationFn: async ({
      a,
      b
    }) => {
      const {
        error: e1
      } = await supabase.from("shop_ads").update({
        sort_order: b.sort_order
      }).eq("id", a.id);
      if (e1) throw e1;
      const {
        error: e2
      } = await supabase.from("shop_ads").update({
        sort_order: a.sort_order
      }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: invalidate
  });
  const move = (idx, dir) => {
    const rows = list.data ?? [];
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    if (a.sort_order === b.sort_order) {
      supabase.from("shop_ads").update({
        sort_order: idx
      }).eq("id", a.id).then(() => {
        supabase.from("shop_ads").update({
          sort_order: target
        }).eq("id", b.id).then(invalidate);
      });
      return;
    }
    reorder.mutate({
      a,
      b
    });
  };
  const placementLabel = (p) => p === "home" ? "Home" : p === "success" ? "Order Success" : "Both";
  const linkLabel = (a) => {
    if (a.link_type === "none" || !a.link_value) return "No link";
    if (a.link_type === "product") return "Product: " + (products.data?.find((p) => p.id === a.link_value)?.name ?? "—");
    if (a.link_type === "category") return "Category: " + (categories.data?.find((c) => c.id === a.link_value)?.name ?? "—");
    return a.link_value;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: "Banner ads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Simple banners for the home page and order success page." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEditing({
        is_active: true,
        placement: "home",
        link_type: "none",
        sort_order: list.data?.length ?? 0
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-4 w-4" }),
        " New banner"
      ] })
    ] }),
    list.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : !list.data?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 text-center text-sm text-muted-foreground", children: [
      "No banners yet. Click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "New banner" }),
      " to add one."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: list.data.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-start gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", disabled: idx === 0, onClick: () => move(idx, -1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", disabled: idx === (list.data?.length ?? 0) - 1, onClick: () => move(idx, 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: a.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image_url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-[10px] text-muted-foreground", children: "No image" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: a.title || "(untitled)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: placementLabel(a.placement) }),
          !a.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Inactive" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-[11px] text-muted-foreground", children: linkLabel(a) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: a.is_active, onCheckedChange: () => toggle.mutate(a) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(a), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => confirm("Delete this banner?") && remove.mutate(a.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-500" }) })
        ] })
      ] })
    ] }, a.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit banner" : "New banner" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Banner image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductImageUpload, { value: editing.image_url ?? null, onChange: (url) => setEditing({
          ...editing,
          image_url: url
        }), searchHints: {
          name: editing.title ?? void 0
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.title ?? "", onChange: (e) => setEditing({
          ...editing,
          title: e.target.value
        }), placeholder: "e.g. Weekend sale" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Show on", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.placement ?? "home", onValueChange: (v) => setEditing({
          ...editing,
          placement: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "home", children: "Home Page" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "success", children: "Order Success Page" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "both", children: "Both" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "When tapped", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.link_type ?? "none", onValueChange: (v) => setEditing({
          ...editing,
          link_type: v,
          link_value: null
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Nothing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "product", children: "Open a product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "category", children: "Open a category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "url", children: "Open a custom link" })
          ] })
        ] }) }),
        editing.link_type === "product" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.link_value ?? "", onValueChange: (v) => setEditing({
          ...editing,
          link_value: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose product…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: (products.data ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
        ] }) }),
        editing.link_type === "category" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.link_value ?? "", onValueChange: (v) => setEditing({
          ...editing,
          link_value: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose category…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: (categories.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
        ] }) }),
        editing.link_type === "url" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Custom link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.link_value ?? "", onChange: (e) => setEditing({
          ...editing,
          link_value: e.target.value
        }), placeholder: "https://..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: editing.is_active ?? true, onCheckedChange: (v) => setEditing({
            ...editing,
            is_active: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: editing.is_active ? "Active" : "Inactive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => editing && save.mutate(editing), children: "Save" })
      ] })
    ] }) })
  ] });
}
function PromoPopupEditor() {
  const qc = useQueryClient();
  const ad = useQuery({
    queryKey: ["admin-ad"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_ad_popup").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const [draft, setDraft] = reactExports.useState(null);
  const current = draft ?? ad.data;
  const save = useMutation({
    mutationFn: async () => {
      if (!current) return;
      const payload = {
        title: current.title?.trim() || null,
        message: current.message?.trim() || null,
        image_url: current.image_url?.trim() || null,
        button_text: current.button_text?.trim() || null,
        button_link: current.button_link?.trim() || null,
        is_active: !!current.is_active
      };
      const {
        error
      } = await supabase.from("shop_ad_popup").update(payload).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-ad"]
      });
      toast.success("Popup updated");
      setDraft(null);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  if (!current) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: "Sticky promo popup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Shown once after the storefront loads." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!current.is_active, onCheckedChange: (v) => setDraft({
          ...current,
          is_active: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: current.is_active ? "Active" : "Inactive" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: current.title ?? "", onChange: (e) => setDraft({
        ...current,
        title: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Message", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: current.message ?? "", onChange: (e) => setDraft({
        ...current,
        message: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Image URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: current.image_url ?? "", onChange: (e) => setDraft({
        ...current,
        image_url: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Button text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: current.button_text ?? "", onChange: (e) => setDraft({
          ...current,
          button_text: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Button link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: current.button_link ?? "", onChange: (e) => setDraft({
          ...current,
          button_link: e.target.value
        }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      draft && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDraft(null), children: "Reset" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending || !draft, onClick: () => save.mutate(), children: "Save" })
    ] })
  ] });
}
function NotificationsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const list = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_notifications").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const save = useMutation({
    mutationFn: async (n) => {
      const payload = {
        title: n.title?.trim() ?? "",
        message: n.message?.trim() || null,
        type: n.type ?? "important",
        is_active: n.is_active ?? true,
        is_pinned: n.is_pinned ?? false,
        expires_at: n.expires_at || null
      };
      if (!payload.title) throw new Error("Title required");
      if (n.id) {
        const {
          error
        } = await supabase.from("shop_notifications").update(payload).eq("id", n.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("shop_notifications").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-notifications"]
      });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("shop_notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-notifications"]
      });
      toast.success("Deleted");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setEditing({
      is_active: true,
      type: "important"
    }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-4 w-4" }),
      " New notification"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: list.data?.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-start gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: n.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize", children: n.type.replace("_", " ") }),
          n.is_pinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px]", children: "Pinned" }),
          !n.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Inactive" })
        ] }),
        n.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: n.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(n), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => confirm("Delete?") && remove.mutate(n.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-500" }) })
    ] }, n.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit notification" : "New notification" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.title ?? "", onChange: (e) => setEditing({
          ...editing,
          title: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Message", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: editing.message ?? "", onChange: (e) => setEditing({
          ...editing,
          message: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.type ?? "important", onValueChange: (v) => setEditing({
          ...editing,
          type: v
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "offer", children: "Offer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "stock", children: "Stock update" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new_product", children: "New product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "important", children: "Important" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Active", value: editing.is_active ?? true, onChange: (v) => setEditing({
            ...editing,
            is_active: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRow, { label: "Pinned (banner)", value: editing.is_pinned ?? false, onChange: (v) => setEditing({
            ...editing,
            is_pinned: v
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => editing && save.mutate(editing), children: "Save" })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
function ToggleRow({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: value, onCheckedChange: onChange })
  ] });
}
function SalesUnified({
  sub,
  onSubChange,
  onNew
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(WholesaleTotalSaleCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WholesaleReturnsMiniCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex w-auto min-w-full gap-1 rounded-2xl bg-muted/50 p-1", children: [{
      v: "completed",
      label: "Completed Sales"
    }, {
      v: "bin",
      label: "Recycle Bin"
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onSubChange(t.v), className: `flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${sub === t.v ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`, children: t.label }, t.v)) }) }),
    sub === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(TxnList, { kind: "sale", onNew }),
    sub === "bin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecycleBin, {}) })
  ] });
}
function PaymentsTab({
  onPaymentIn
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center justify-between gap-3 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-semibold", children: "Record customer payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Apply a payment against open dues or as advance." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onPaymentIn, className: "rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "me-1.5 h-4 w-4" }),
        " Payment In"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersTab, { onAdd: () => void 0 })
  ] });
}
function WebsiteSection({
  sub,
  onSubChange,
  activeBannerCount
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex w-auto min-w-full gap-1 rounded-2xl bg-muted/50 p-1", children: [{
      v: "banners",
      label: `Banner Ads${activeBannerCount ? ` (${activeBannerCount})` : ""}`
    }, {
      v: "notifications",
      label: "Notifications"
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onSubChange(t.v), className: `flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${sub === t.v ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`, children: t.label }, t.v)) }) }),
    sub === "banners" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdsTab, {}),
    sub === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsTab, {})
  ] });
}
function PurchasesTab({
  onNew
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TxnList, { kind: "purchase", onNew });
}
function TxnList({
  kind,
  onNew
}) {
  const qc = useQueryClient();
  const navigateRoot = useNavigate();
  const [detailId, setDetailId] = reactExports.useState(null);
  const [payOpen, setPayOpen] = reactExports.useState(false);
  const table = kind === "sale" ? "shop_sales" : "shop_purchases";
  const rows = useQuery({
    queryKey: [`admin-${kind}s`],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from(table).select("*").eq("is_deleted", false).order("created_at", {
        ascending: false
      }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const cancel = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await softDelete(table, id);
      if (error) throw new Error(error.message);
      return id;
    },
    onMutate: async (id) => {
      const key = [`admin-${kind}s`];
      await qc.cancelQueries({
        queryKey: key
      });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old) => (old ?? []).filter((r) => r.id !== id));
      return {
        prev
      };
    },
    onError: (e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData([`admin-${kind}s`], ctx.prev);
      toast.error(e?.message ?? "Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [`admin-${kind}s`]
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-admin-overview"]
      });
      qc.invalidateQueries({
        queryKey: ["pos-customer-due-map"]
      });
      qc.invalidateQueries({
        queryKey: ["pos-balance"]
      });
      qc.invalidateQueries({
        queryKey: ["pos-customer-statement"]
      });
      qc.invalidateQueries({
        queryKey: ["warehouse-value"]
      });
      toast.success("Moved to Recycle Bin — stock restored");
    }
  });
  const share = async (r) => {
    if (kind === "sale") {
      const {
        fetchCustomerVatForSale
      } = await import("./router-KeVl8_Ln.mjs").then((n) => n.b0);
      await fetchCustomerVatForSale({
        customer_id: r.customer_id,
        customer_mobile: r.customer_mobile
      });
    }
    openInvoiceShare({
      invoiceNumber: r.invoice_number,
      date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
      timestamp: r.created_at ?? r.txn_date,
      partyName: (kind === "sale" ? r.customer_name : r.supplier_name) ?? "",
      partyMobile: (kind === "sale" ? r.customer_mobile : r.supplier_mobile) ?? void 0,
      items: r.items,
      subtotal: Number(r.subtotal),
      discount: Number(r.discount ?? 0),
      tax: Number(r.tax),
      total: Number(r.total),
      notes: r.notes ?? void 0
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex justify-end", children: kind === "sale" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full grid-cols-2 gap-2 sm:w-[24rem]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onNew, className: "h-10 min-w-0 rounded-xl px-3 text-xs font-semibold sm:text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New Sale"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => navigateRoot({
        to: "/sales-return",
        search: {
          new: 1
        }
      }), className: "h-10 min-w-0 rounded-xl px-3 text-xs font-semibold sm:text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" }),
        " New Sales Return"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onNew, className: "h-10 rounded-xl gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      " New ",
      kind
    ] }) }),
    rows.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : rows.data?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-10 text-center text-sm text-muted-foreground", children: [
      "No ",
      kind,
      "s yet."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rows.data?.map((r) => {
      const name = kind === "sale" ? r.customer_name : r.supplier_name;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "cursor-pointer p-3 transition-colors hover:bg-muted/40", onClick: () => setDetailId(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
            "#",
            r.invoice_number
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
            r.items.length,
            " items · ",
            new Date(r.created_at).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold", children: [
            "SAR ",
            Number(r.total).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-end gap-1", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", title: "Share to WhatsApp", onClick: () => share(r), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-emerald-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7", title: "Move to Recycle Bin", onClick: () => confirm(`Delete this ${kind}? Stock will be restored. You can recover it from Recycle Bin.`) && cancel.mutate(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-rose-500" }) })
          ] })
        ] })
      ] }) }, r.id);
    }) }),
    kind === "sale" ? /* @__PURE__ */ jsxRuntimeExports.jsx(PosSaleDetailsDialog, { open: !!detailId, onOpenChange: (v) => !v && setDetailId(null), saleId: detailId }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PurchaseDetailsDialog, { open: !!detailId, onOpenChange: (v) => !v && setDetailId(null), purchaseId: detailId })
  ] });
}
function CustomersTab({
  onAdd
}) {
  const [q, setQ] = reactExports.useState("");
  const [payCustomer, setPayCustomer] = reactExports.useState(null);
  const [payOpen, setPayOpen] = reactExports.useState(false);
  const [stmtCustomer, setStmtCustomer] = reactExports.useState(null);
  const [detailsId, setDetailsId] = reactExports.useState(null);
  const [saleOpen, setSaleOpen] = reactExports.useState(false);
  const [saleInitial, setSaleInitial] = reactExports.useState(void 0);
  const customers = useQuery({
    queryKey: ["pos-customers-admin"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("pos_customers").select("id,name,phone,alias,opening_due,notes,is_active,created_at,tags").eq("is_active", true).eq("is_deleted", false).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const dueMap = usePosDueMap();
  const filtered = (customers.data ?? []).filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return c.name.toLowerCase().includes(s) || (c.phone ?? "").toLowerCase().includes(s) || (c.alias ?? "").toLowerCase().includes(s);
  });
  const totals = (() => {
    let totalDue = 0, withDue = 0;
    for (const c of customers.data ?? []) {
      const d = dueMap.data?.get(c.id) ?? 0;
      if (d > 0) {
        totalDue += d;
        withDue++;
      }
    }
    return {
      totalDue,
      withDue
    };
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Customers", value: customers.data?.length ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleAlert, label: "With due", value: totals.withDue, tone: totals.withDue > 0 ? "danger" : void 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Wallet, label: "Total due", value: `SAR ${totals.totalDue.toFixed(0)}`, tone: totals.totalDue > 0 ? "danger" : void 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name, phone or alias…", value: q, onChange: (e) => setQ(e.target.value), className: "h-10 flex-1 min-w-[180px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onAdd, className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Add customer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
        setPayCustomer(null);
        setPayOpen(true);
      }, className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
        " Payment In"
      ] })
    ] }),
    customers.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-10 text-center text-sm text-muted-foreground", children: [
      "No customers match. ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAdd, className: "text-primary underline", children: "Add a new customer" }),
      "."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: filtered.map((c) => {
      const due = dueMap.data?.get(c.id) ?? 0;
      const tags = c.tags ?? [];
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDetailsId(c.id), className: "text-left active:scale-[0.99] transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3 hover:border-primary/40 hover:shadow-sm transition", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: c.phone ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: due > 0 ? "border-rose-500/40 text-rose-600" : "border-emerald-500/40 text-emerald-600", children: [
              "Due SAR ",
              due.toFixed(2)
            ] }),
            tags.includes("vip") && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-amber-500/40 text-amber-700 text-[10px]", children: "VIP" }),
            tags.includes("blocked") && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-rose-500/40 text-rose-600 text-[10px]", children: "Blocked" })
          ] })
        ] })
      ] }) }) }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosPaymentInDialog, { open: payOpen, onOpenChange: setPayOpen, initialCustomer: payCustomer }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosCustomerStatementDialog, { open: !!stmtCustomer, onOpenChange: (v) => !v && setStmtCustomer(null), customer: stmtCustomer, onPaymentIn: () => {
      if (stmtCustomer) {
        setPayCustomer(stmtCustomer);
        setPayOpen(true);
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PosCustomerDetailsDialog, { open: !!detailsId, onOpenChange: (v) => !v && setDetailsId(null), customerId: detailsId, onPaymentIn: (c) => {
      setPayCustomer(c);
      setPayOpen(true);
      setDetailsId(null);
    }, onViewStatement: (c) => {
      setStmtCustomer(c);
      setDetailsId(null);
    }, onNewSale: (c) => {
      setSaleInitial({
        partyName: c.name,
        partyMobile: c.phone ?? void 0
      });
      setSaleOpen(true);
      setDetailsId(null);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionDialog, { open: saleOpen, onOpenChange: setSaleOpen, kind: "sale", initial: saleInitial })
  ] });
}
function DemoCleanupDialog({
  open,
  onOpenChange
}) {
  const qc = useQueryClient();
  const [confirmText, setConfirmText] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const tables = [{
        t: "shop_sales",
        col: "notes"
      }, {
        t: "shop_purchases",
        col: "notes"
      }, {
        t: "shop_orders",
        col: "notes"
      }, {
        t: "pos_customers",
        col: "notes"
      }, {
        t: "shop_products",
        col: "description"
      }];
      let total = 0, failed = 0;
      for (const {
        t,
        col
      } of tables) {
        const {
          data,
          error
        } = await supabase.from(t).select("id").ilike(col, "%demo%").eq("is_deleted", false);
        if (error) {
          failed++;
          continue;
        }
        for (const r of data ?? []) {
          const res = await softDelete(t, r.id);
          if (res.error) failed++;
          else total++;
        }
      }
      toast.success(`Cleared ${total} demo/test record${total === 1 ? "" : "s"}${failed ? ` · ${failed} failed` : ""}`);
      qc.invalidateQueries();
      onOpenChange(false);
      setConfirmText("");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!busy) {
      onOpenChange(v);
      if (!v) setConfirmText("");
    }
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-destructive", children: "Clear demo / test data" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[13px] text-destructive", children: [
        "This will move every ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "sale, purchase, order, customer, and product" }),
        " whose notes or description contain the word",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "mx-1 rounded bg-destructive/10 px-1.5", children: "demo" }),
        "to the Recycle Bin. Stock will reverse automatically. You can restore from the Recycle Bin."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-muted-foreground", children: [
          "Type ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted px-1", children: "DELETE" }),
          " to confirm"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: confirmText, onChange: (e) => setConfirmText(e.target.value), placeholder: "DELETE", autoFocus: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", disabled: busy || confirmText !== "DELETE", onClick: run, children: busy ? "Clearing…" : "Move demo data to Recycle Bin" })
    ] })
  ] }) });
}
function DashboardTab({
  activeBannerCount,
  onNewSale,
  onPaymentIn,
  onViewOrders,
  onAddProduct,
  onImport,
  onAddCustomer,
  onPurchase
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WholesaleDashboard, {});
}
function SuppliersTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PartyManager, { defaultType: "supplier" });
}
function SalesDeliveryDashboard({
  onNewSale,
  onPaymentIn,
  onPurchase,
  onViewOrders,
  onViewCustomers,
  onViewProducts
}) {
  const {
    workingDate
  } = useWorkingDate();
  const {
    dayIso,
    dayEndIso
  } = reactExports.useMemo(() => {
    const [wy, wm, wd] = workingDate.split("-").map(Number);
    const s = new Date(wy, (wm || 1) - 1, wd || 1);
    s.setHours(0, 0, 0, 0);
    const e = new Date(s);
    e.setHours(23, 59, 59, 999);
    return {
      dayIso: s.toISOString(),
      dayEndIso: e.toISOString()
    };
  }, [workingDate]);
  const ops = useQuery({
    queryKey: ["sales-delivery-overview", dayIso],
    staleTime: 6e4,
    queryFn: async () => {
      const [pending, salesToday, purchasesToday] = await Promise.all([supabase.from("shop_orders").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pending").eq("is_deleted", false), supabase.from("shop_sales").select("id", {
        count: "exact",
        head: true
      }).gte("created_at", dayIso).lte("created_at", dayEndIso).eq("is_deleted", false), supabase.from("shop_purchases").select("id", {
        count: "exact",
        head: true
      }).gte("created_at", dayIso).lte("created_at", dayEndIso).eq("is_deleted", false)]);
      return {
        pendingOrders: pending.count ?? 0,
        salesCount: salesToday.count ?? 0,
        purchaseCount: purchasesToday.count ?? 0
      };
    }
  });
  const recent = useQuery({
    queryKey: ["sales-delivery-recent"],
    staleTime: 3e4,
    queryFn: async () => {
      const [sales, purchases, payments] = await Promise.all([supabase.from("shop_sales").select("id,invoice_number,total,created_at,customer_name").eq("is_deleted", false).order("created_at", {
        ascending: false
      }).limit(8), supabase.from("shop_purchases").select("id,total,created_at,party_name").eq("is_deleted", false).order("created_at", {
        ascending: false
      }).limit(8), supabase.from("pos_payments").select("id,amount,created_at,kind,notes").eq("kind", "payment_in").order("created_at", {
        ascending: false
      }).limit(8)]);
      const items = [...(sales.data ?? []).map((r) => ({
        id: `s-${r.id}`,
        kind: "Sale",
        title: r.customer_name ?? `Invoice #${r.invoice_number ?? ""}`,
        subtitle: r.invoice_number ? `#${r.invoice_number}` : "Sale",
        amount: Number(r.total ?? 0),
        at: r.created_at
      })), ...(purchases.data ?? []).map((r) => ({
        id: `p-${r.id}`,
        kind: "Purchase",
        title: r.party_name ?? "Purchase",
        subtitle: "Purchase",
        amount: Number(r.total ?? 0),
        at: r.created_at
      })), ...(payments.data ?? []).map((r) => ({
        id: `pi-${r.id}`,
        kind: "Payment In",
        title: r.notes ?? "Payment received",
        subtitle: "Payment In",
        amount: Number(r.amount ?? 0),
        at: r.created_at
      }))];
      return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 12);
    }
  });
  const d = ops.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Quick actions", icon: LayoutGrid, hint: "Sales & Delivery" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: ShoppingBag, label: "New Sale", onClick: onNewSale, tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: Truck, label: "Purchase", onClick: onPurchase }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: Wallet, label: "Payment In", onClick: onPaymentIn }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: Users, label: "Customers", onClick: onViewCustomers }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: ShoppingCart, label: "Pending Orders", onClick: onViewOrders, badge: d?.pendingOrders }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionTile, { icon: Package, label: "Products", onClick: onViewProducts })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Today's activity", icon: Activity, hint: "Counts only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Sales today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: d ? d.salesCount : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Purchases today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: d ? d.purchaseCount : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Pending orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: d ? d.pendingOrders : "—" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Recent entries", icon: ClipboardList, hint: "Latest 12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "divide-y divide-border/60", children: (recent.data ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-center text-sm text-muted-foreground", children: "No recent activity" }) : (recent.data ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
            r.kind,
            " • ",
            new Date(r.at).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold tabular-nums", children: [
          "SAR ",
          r.amount.toFixed(2)
        ] })
      ] }, r.id)) })
    ] })
  ] });
}
function ActionTile({
  icon: Icon,
  label,
  onClick,
  tone,
  badge
}) {
  const toneClasses = tone === "primary" ? "bg-primary/5" : tone === "return" ? "bg-rose-500/5 border-rose-500/30" : "bg-card";
  const iconClasses = tone === "primary" ? "bg-primary/15 text-primary" : tone === "return" ? "bg-rose-500/15 text-rose-600" : "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: `relative flex flex-col items-start gap-2 rounded-2xl border border-border/60 p-3 text-left transition-colors hover:bg-muted/50 ${toneClasses}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-xl ${iconClasses}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4.5 w-4.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: label }),
    typeof badge === "number" && badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white", children: badge })
  ] });
}
export {
  StoreAdmin as component
};
