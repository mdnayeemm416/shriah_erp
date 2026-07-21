import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { s as useUserAccess, aE as Route$t, af as SAR, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, I as Input, C as Card, ah as CardContent, h as Badge, a9 as usePosDueMap, a8 as fetchCustomerBalance, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, ac as PosCustomerPicker, d as cn, L as Label, T as Textarea, B as Button } from "./router-KeVl8_Ln.mjs";
import { o as openSalesReturnInvoice } from "./share-CBad70-z.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as fetchReturnedQtyMap, p as processSalesReturn, R as RETURN_REASONS } from "./sales-returns-BiNutRv_.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";

import "../_libs/jspdf.mjs";
import { h as Undo2, at as Calendar, v as Package, aG as ChartColumn, U as Users, k as LoaderCircle, $ as FileText, W as Wallet, ay as Coins, as as ArrowLeft, aQ as ArrowRight, n as Check } from "../_libs/lucide-react.mjs";
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




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/html-to-image.mjs";
import "./types-u21zQmgs.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
const keyOf = (it) => String(it.product_id ?? it.name);
function SalesReturnWizard({ open, onOpenChange }) {
  const qc = useQueryClient();
  const [step, setStep] = reactExports.useState(1);
  const [customer, setCustomer] = reactExports.useState(null);
  const [sale, setSale] = reactExports.useState(null);
  const [lines, setLines] = reactExports.useState([]);
  const [refundType, setRefundType] = reactExports.useState("due_reduction");
  const [notes, setNotes] = reactExports.useState("");
  const dueMap = usePosDueMap(open);
  reactExports.useEffect(() => {
    if (!open) {
      setStep(1);
      setCustomer(null);
      setSale(null);
      setLines([]);
      setRefundType("due_reduction");
      setNotes("");
    }
  }, [open]);
  const sales = useQuery({
    queryKey: ["sr-wizard-sales", customer?.id],
    enabled: open && step === 2 && !!customer?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_sales").select("id,invoice_number,created_at,total,paid_amount,due_amount,status,items").eq("customer_id", customer.id).neq("status", "fully_returned").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const balance = useQuery({
    queryKey: ["sr-wizard-balance", customer?.id],
    enabled: open && step === 3 && !!customer?.id,
    queryFn: () => fetchCustomerBalance(customer.id)
  });
  const returned = useQuery({
    queryKey: ["sr-wizard-returned", sale?.id],
    enabled: open && step === 3 && !!sale?.id,
    queryFn: () => fetchReturnedQtyMap(sale.id)
  });
  reactExports.useEffect(() => {
    if (step !== 3 || !sale || !returned.data) return;
    setLines(
      (sale.items ?? []).map((it) => {
        const k = keyOf(it);
        const already = returned.data.get(k)?.qty ?? 0;
        return {
          key: k,
          product_id: it.product_id ?? null,
          name: it.name,
          sold: Number(it.qty) || 0,
          already,
          price: Number(it.price) || 0,
          qty: 0,
          reason: ""
        };
      })
    );
  }, [step, sale, returned.data]);
  const totals = reactExports.useMemo(() => {
    const value = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const totalQty = lines.reduce((s, l) => s + l.qty, 0);
    const oldBal = Number(balance.data?.current_due ?? 0);
    const newBal = refundType === "due_reduction" ? oldBal - value : oldBal;
    return { value, totalQty, oldBal, newBal };
  }, [lines, balance.data, refundType]);
  const canSubmit = step === 3 && totals.totalQty > 0 && lines.every((l) => l.qty === 0 || l.qty > 0 && l.qty <= l.sold - l.already && l.reason);
  const submit = useMutation({
    mutationFn: async () => {
      if (!sale) return null;
      const items = lines.filter((l) => l.qty > 0).map((l) => ({
        product_id: l.product_id ?? null,
        name: l.name,
        qty: l.qty,
        price: l.price,
        reason: l.reason
      }));
      const tally = /* @__PURE__ */ new Map();
      for (const l of items) tally.set(l.reason, (tally.get(l.reason) ?? 0) + l.qty);
      const headerReason = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return processSalesReturn({
        saleId: sale.id,
        items,
        refundType,
        notes,
        reason: headerReason
      });
    },
    onSuccess: (id) => {
      toast.success("Sales return recorded");
      qc.invalidateQueries({ queryKey: ["sales-returns"] });
      qc.invalidateQueries({ queryKey: ["admin-sales"] });
      qc.invalidateQueries({ queryKey: ["shop_products"] });
      qc.invalidateQueries({ queryKey: ["pos-balance"] });
      qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
      onOpenChange(false);
      if (id) openSalesReturnInvoice(id);
    },
    onError: (e) => toast.error(e?.message ?? "Return failed")
  });
  function updateLine(idx, patch) {
    setLines((prev) => prev.map((l, i) => i === idx ? { ...l, ...patch } : l));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4 text-rose-600" }),
      " New Sales Return",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "ml-auto text-[10px]", children: [
        "Step ",
        step,
        " of 3"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select the customer who is returning items." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PosCustomerPicker, { value: customer, onChange: setCustomer, showDue: true, dueByCustomer: dueMap.data })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Pick the invoice being returned for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: customer?.name }),
          "."
        ] }),
        sales.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }) : (sales.data ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No returnable invoices for this customer." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: sales.data.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setSale(s);
              setStep(3);
            },
            className: cn(
              "flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
              sale?.id === s.id && "border-primary bg-primary/10"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
                  "INV-",
                  s.invoice_number
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  new Date(s.created_at).toLocaleString(),
                  " · ",
                  s.items?.length ?? 0,
                  " items"
                ] }),
                s.status === "partially_returned" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mt-1 bg-amber-500 text-[9px] text-white hover:bg-amber-500", children: "Partial Return" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: SAR(s.total) }),
                s.due_amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-rose-600", children: [
                  "Due ",
                  SAR(s.due_amount)
                ] })
              ] })
            ]
          },
          s.id
        )) })
      ] }),
      step === 3 && sale && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Returning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
            customer?.name,
            " · INV-",
            sale.invoice_number
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            "Current balance: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: SAR(totals.oldBal) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card", children: lines.map((l, i) => {
          const max = l.sold - l.already;
          const invalid = l.qty > max;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-3 last:border-b-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: l.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: [
              "Sold ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: l.sold }),
              " · Returned ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: l.already }),
              " · Available",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: max === 0 ? "text-muted-foreground" : "text-primary", children: max }),
              " ·",
              " ",
              SAR(l.price)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: "Return Qty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0,
                    max,
                    step: "1",
                    value: l.qty || "",
                    disabled: max === 0,
                    onChange: (e) => {
                      const v = Math.max(0, Math.min(max, Number(e.target.value) || 0));
                      updateLine(i, { qty: v });
                    },
                    className: invalid ? "border-rose-500" : ""
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-[1.4]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: "Reason" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: l.reason,
                    onValueChange: (v) => updateLine(i, { reason: v }),
                    disabled: l.qty === 0,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Reason" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: RETURN_REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
                    ]
                  }
                )
              ] })
            ] }),
            l.qty > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-right text-xs font-semibold", children: [
              "Line: ",
              SAR(l.qty * l.price)
            ] })
          ] }, l.key + i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-semibold uppercase text-muted-foreground", children: "Settlement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setRefundType("due_reduction"),
                className: cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition",
                  refundType === "due_reduction" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Adjust Customer Due" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Reduce outstanding balance" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setRefundType("cash"),
                className: cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition",
                  refundType === "cash" ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4 text-emerald-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Cash Refund" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Pay customer immediately" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/[0.04] p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Return Value", value: SAR(totals.value), bold: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Old Balance", value: SAR(totals.oldBal), muted: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Row,
            {
              label: "New Balance",
              value: SAR(totals.newBal),
              bold: true,
              tone: totals.newBal < 0 ? "danger" : void 0
            }
          ),
          refundType === "cash" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex justify-between rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cash out to customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: SAR(totals.value) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            rows: 2,
            placeholder: "Notes (optional)",
            value: notes,
            onChange: (e) => setNotes(e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-4 py-3", children: [
      step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setStep((s) => s - 1),
          disabled: submit.isPending,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
            " Back"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "flex-1",
          disabled: !customer,
          onClick: () => setStep(2),
          children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
          ]
        }
      ),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "flex-1", disabled: !sale, onClick: () => setStep(3), children: [
        "Continue ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "flex-1",
          disabled: !canSubmit || submit.isPending,
          onClick: () => submit.mutate(),
          children: [
            submit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-4 w-4" }),
            "Confirm Return"
          ]
        }
      )
    ] })
  ] }) });
}
function Row({
  label,
  value,
  bold,
  muted,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
    "flex justify-between",
    muted && "text-xs text-muted-foreground",
    tone === "danger" && "text-rose-600"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    bold ? /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: value }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
  ] });
}
function startOf(range) {
  const now = /* @__PURE__ */ new Date();
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  if (range === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  return null;
}
function SalesReturnPage() {
  const access = useUserAccess();
  const canView = access.isAdmin || access.isManager || access.hasPage("sales-return");
  const [q, setQ] = reactExports.useState("");
  const [range, setRange] = reactExports.useState("month");
  const [settlement, setSettlement] = reactExports.useState("all");
  const [wizardOpen, setWizardOpen] = reactExports.useState(false);
  const search = Route$t.useSearch();
  const navigate = Route$t.useNavigate();
  reactExports.useEffect(() => {
    if (search.new === 1) {
      setWizardOpen(true);
      navigate({
        search: {
          new: void 0
        },
        replace: true
      });
    }
  }, [search.new, navigate]);
  const returns = useQuery({
    queryKey: ["sales-returns", "list"],
    enabled: canView,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sales_returns").select("id,sale_id,return_number,invoice_number,customer_name,customer_mobile,total_qty,return_value,refund_type,refund_amount,reason,processed_by_name,notes,created_at").order("created_at", {
        ascending: false
      }).limit(500);
      if (error) throw error;
      return data ?? [];
    }
  });
  const returnItems = useQuery({
    queryKey: ["sales-returns", "items"],
    enabled: canView,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sales_return_items").select("return_id,name,qty,line_value").limit(5e3);
      if (error) throw error;
      return data ?? [];
    }
  });
  const filtered = reactExports.useMemo(() => {
    const list = returns.data ?? [];
    const from = startOf(range);
    const needle = q.trim().toLowerCase();
    return list.filter((r) => {
      if (from && r.created_at < from) return false;
      if (settlement !== "all" && r.refund_type !== settlement) return false;
      if (!needle) return true;
      return String(r.invoice_number ?? "").includes(needle) || (r.return_number ?? "").toLowerCase().includes(needle) || (r.customer_name ?? "").toLowerCase().includes(needle) || (r.customer_mobile ?? "").toLowerCase().includes(needle);
    });
  }, [returns.data, q, range, settlement]);
  const stats = reactExports.useMemo(() => {
    const totalValue = filtered.reduce((s, r) => s + Number(r.return_value), 0);
    const totalQty = filtered.reduce((s, r) => s + Number(r.total_qty), 0);
    return {
      totalValue,
      totalQty,
      count: filtered.length
    };
  }, [filtered]);
  const byCustomer = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const r of filtered) {
      const k = r.customer_name || "Walk-in";
      const cur = m.get(k) ?? {
        name: k,
        qty: 0,
        value: 0
      };
      cur.qty += Number(r.total_qty);
      cur.value += Number(r.return_value);
      m.set(k, cur);
    }
    return Array.from(m.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);
  const byProduct = reactExports.useMemo(() => {
    const ids = new Set(filtered.map((r) => r.id));
    const m = /* @__PURE__ */ new Map();
    for (const it of returnItems.data ?? []) {
      if (!ids.has(it.return_id)) continue;
      const cur = m.get(it.name) ?? {
        name: it.name,
        qty: 0,
        value: 0
      };
      cur.qty += Number(it.qty);
      cur.value += Number(it.line_value);
      m.set(it.name, cur);
    }
    return Array.from(m.values()).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered, returnItems.data]);
  const byDate = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const r of filtered) {
      const d = r.created_at.slice(0, 10);
      const cur = m.get(d) ?? {
        date: d,
        value: 0,
        count: 0
      };
      cur.value += Number(r.return_value);
      cur.count += 1;
      m.set(d, cur);
    }
    return Array.from(m.values()).sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 14);
  }, [filtered]);
  if (!canView) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "You don't have permission to view sales returns." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-xl font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-5 w-5 text-rose-600" }),
        " Sales Return"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Standalone module for processing and tracking returns." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }), label: "Total Return", value: SAR(stats.totalValue), sub: `${stats.count} returns` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }), label: "Total Qty", value: String(stats.totalQty), sub: "units returned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }), label: "Avg / Return", value: SAR(stats.count ? stats.totalValue / stats.count : 0), sub: "per invoice" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: range, onValueChange: (v) => setRange(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "today", children: "Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "week", children: "Last 7 days" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "month", children: "This month" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All time" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: settlement, onValueChange: (v) => setSettlement(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Settlement" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All settlements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "due_reduction", children: "Due reduced" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash refund" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "credit", children: "Credit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search return #, invoice, customer…", value: q, onChange: (e) => setQ(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReportBlock, { title: "Top Customers", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }), rows: byCustomer.map((c) => ({
        label: c.name,
        value: SAR(c.value),
        sub: `${c.qty} qty`
      })) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReportBlock, { title: "Top Products", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }), rows: byProduct.map((p) => ({
        label: p.name,
        value: SAR(p.value),
        sub: `${p.qty} qty`
      })) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReportBlock, { title: "By Date", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }), rows: byDate.map((d) => ({
      label: new Date(d.date).toLocaleDateString(void 0, {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      value: SAR(d.value),
      sub: `${d.count} returns`
    })) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: returns.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-sm text-muted-foreground", children: "No returns match the current filters." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => openSalesReturnInvoice(r.id), className: "w-full p-3 text-left transition-colors hover:bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
          r.return_number ?? `#${String(r.id).slice(0, 6)}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          "Original: INV-",
          r.invoice_number ?? "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 truncate text-xs", children: [
          r.customer_name || "Walk-in",
          r.customer_mobile ? ` · ${r.customer_mobile}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
          new Date(r.created_at).toLocaleString(),
          r.processed_by_name ? ` · by ${r.processed_by_name}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-rose-700 dark:text-rose-300", children: SAR(r.return_value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[9px]", children: r.refund_type === "cash" ? "Cash refund" : r.refund_type === "credit" ? "Credit" : "Due reduced" })
      ] })
    ] }) }, r.id)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReturnWizard, { open: wizardOpen, onOpenChange: setWizardOpen })
  ] });
}
function StatCard({
  icon,
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase text-muted-foreground", children: [
      icon,
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-lg font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: sub })
  ] }) });
}
function ReportBlock({
  title,
  icon,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground", children: [
      icon,
      " ",
      title
    ] }),
    rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No data" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 text-sm", children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-border/60 py-1 last:border-b-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: r.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: r.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: r.sub })
      ] })
    ] }, i)) })
  ] }) });
}
export {
  SalesReturnPage as component
};
