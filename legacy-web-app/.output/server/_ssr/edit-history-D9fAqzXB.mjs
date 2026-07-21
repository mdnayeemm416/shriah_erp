import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { D as Dialog, au as DialogTrigger, B as Button, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./router-KeVl8_Ln.mjs";
import { a4 as History } from "../_libs/lucide-react.mjs";
const FIELD_LABEL = {
  amount: "Amount",
  type: "Type",
  category: "Category",
  subcategory: "Sub-category",
  notes: "Notes",
  txn_date: "Date",
  payment_method: "Payment method",
  shop_id: "Shop",
  cashier_id: "Cashier",
  cashier: "Cashier",
  attachment_url: "Attachment",
  name: "Name",
  phone: "Phone",
  address: "Address",
  party_type: "Party type",
  party_name: "Party",
  party_id: "Party",
  entry_type: "Entry type",
  cash_sale: "Cash sale",
  pos_sale: "POS sale",
  bank_sale: "Bank sale",
  credit_sale: "Credit sale",
  difference: "Difference",
  purchase_amount: "Purchase amount",
  withdraw_amount: "Withdraw amount",
  expense_amount: "Expense amount",
  payment_status: "Payment status",
  paid_amount: "Paid amount",
  remaining_due: "Remaining due",
  product_name: "Product",
  quantity: "Quantity",
  purchase_price: "Purchase price",
  status: "Status",
  is_deleted: "Deleted"
};
function fmt(v) {
  if (v === null || v === void 0) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function EditHistoryButton({ entityType, entityId, label = "View Edit History", variant = "ghost" }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant, size: "sm", type: "button", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit history" }) }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTimeline, { entityType, entityId })
    ] })
  ] });
}
function HistoryTimeline({ entityType, entityId }) {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["entity_history", entityType, entityId],
    queryFn: async () => {
      const { data } = await supabase.from("entity_history").select("*").eq("entity_type", entityType).eq("entity_id", entityId).order("changed_at", { ascending: false });
      return data ?? [];
    }
  });
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("id,full_name,email")).data ?? []
  });
  const profMap = reactExports.useMemo(
    () => new Map(profiles.map((p) => [p.id, p.full_name || p.email || "—"])),
    [profiles]
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "Loading…" });
  if (rows.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-sm text-muted-foreground", children: "No edits recorded yet." });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative space-y-4 border-l border-border/60 pl-4", children: rows.map((r) => {
    const changes = r.changes ?? {};
    const fields = Object.keys(changes);
    const tag = r.action === "soft_delete" ? "Moved to Recycle Bin" : r.action === "restore" ? "Restored" : "Edited";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-[11.5px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(r.changed_at).toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider", children: tag })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11.5px] text-muted-foreground", children: [
        "By ",
        r.changed_by ? profMap.get(r.changed_by) ?? "—" : "system"
      ] }),
      fields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1.5 rounded-lg border border-border/40 bg-muted/30 p-2.5", children: fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
          FIELD_LABEL[f] ?? f,
          ": "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-destructive/10 px-1 text-destructive line-through", children: fmt(changes[f].from) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1 text-muted-foreground", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-emerald-500/10 px-1 text-emerald-700 dark:text-emerald-400", children: fmt(changes[f].to) })
      ] }, f)) })
    ] }, r.id);
  }) });
}
export {
  EditHistoryButton as E
};
