import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, I as Input, B as Button, h as Badge, d as cn, u as useConfirm, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, az as useSignedAttachmentUrl, af as SAR } from "./router-KeVl8_Ln.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { softDelete } from "./soft-delete-DQY0d6eC.mjs";
import { A as AttachmentLightbox } from "./attachment-lightbox-DWyyAMyd.mjs";
import { s as shareToWhatsApp } from "./whatsapp-share-Bc5049Za.mjs";
import { y as Search, aT as CalendarDays, aX as FileDown, aH as FileSpreadsheet, Y as Share2, l as Sparkles, q as Paperclip, u as ChevronRight, k as LoaderCircle, aa as Store, D as UserRound, $ as FileText, E as ScanLine, I as MessageCircle, a5 as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
function EntryDetailDialog({ open, onOpenChange, entryId, kind }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [deleting, setDeleting] = reactExports.useState(false);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const { data: entry, isLoading } = useQuery({
    queryKey: ["entry-detail", entryId],
    enabled: !!entryId && open,
    queryFn: async () => {
      if (!entryId) return null;
      const { data } = await supabase.from("shop_entries").select("*, shops(name), cashiers(name)").eq("id", entryId).maybeSingle();
      return data;
    }
  });
  const totalSale = reactExports.useMemo(() => {
    if (!entry) return 0;
    return Number(entry.cash_sale ?? 0) + Number(entry.bank_sale ?? 0) + Number(entry.credit_sale ?? 0);
  }, [entry]);
  const handleEdit = () => {
    if (!entry) return;
    onOpenChange(false);
    navigate({ to: "/shop", search: { edit: entry.id } });
  };
  const handleDelete = async () => {
    if (!entry) return;
    if (!await confirm({ title: "Move entry to Recycle Bin?", description: "Linked stock and ledger effects will be reversed. You can restore this entry from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" })) return;
    setDeleting(true);
    const { error } = await softDelete("shop_entries", entry.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Moved to Recycle Bin");
    qc.invalidateQueries({ queryKey: ["drill"] });
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["txns"] });
    qc.invalidateQueries({ queryKey: ["trash"] });
    onOpenChange(false);
  };
  const isPurchase = kind === "purchase" || entry?.entry_type === "purchase";
  const isWithdraw = kind === "bank_withdraw" || entry?.entry_type === "withdraw";
  const isExpense = kind === "expense" || entry?.entry_type === "expense";
  const isSale = !isPurchase && !isWithdraw && !isExpense;
  const isImage = entry?.attachment_url && /\.(png|jpe?g|webp|gif)$/i.test(entry.attachment_url);
  const handleShare = async () => {
    if (!entry) return;
    const title = isSale ? "Sale Entry" : isPurchase ? "Purchase Entry" : isExpense ? "Expense Entry" : "Withdraw Entry";
    const amount = isSale ? totalSale : isPurchase ? Number(entry.purchase_amount ?? 0) : isExpense ? Number(entry.expense_amount ?? 0) : Number(entry.withdraw_amount ?? 0);
    const rows = [{ label: "Date", value: entry.txn_date }];
    if (entry.shops?.name) rows.push({ label: "Shop", value: entry.shops.name });
    if (entry.cashiers?.name) rows.push({ label: "Cashier", value: entry.cashiers.name });
    if (isSale) {
      rows.push({ label: "POS Sale", value: SAR(entry.pos_sale) });
      rows.push({ label: "Total Sale", value: SAR(totalSale) });
      rows.push({ label: "Cash Sale", value: SAR(entry.cash_sale) });
      rows.push({ label: "Bank Sale", value: SAR(entry.bank_sale) });
      rows.push({ label: "Credit Sale", value: SAR(entry.credit_sale) });
      rows.push({ label: "Plus / Minus", value: SAR(entry.difference) });
    } else {
      rows.push({ label: "Amount", value: SAR(amount) });
    }
    const captionParts = [title];
    if (entry.shops?.name) captionParts.push(`Shop: ${entry.shops.name}`);
    if (entry.cashiers?.name) captionParts.push(`Cashier: ${entry.cashiers.name}`);
    if (entry.txn_date) captionParts.push(`Date: ${entry.txn_date}`);
    captionParts.push(`Amount: ${SAR(amount)}`);
    await shareToWhatsApp({
      title,
      subtitle: [entry.shops?.name, entry.cashiers?.name].filter(Boolean).join(" · ") || void 0,
      amount: SAR(amount),
      amountLabel: isSale ? "Total Sale" : isPurchase ? "Purchase Amount" : isExpense ? "Expense Amount" : "Withdraw Amount",
      date: entry.txn_date,
      rows,
      notes: entry.notes,
      accent: isSale ? "in" : "out",
      caption: captionParts.join(" · ")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: isSale ? "Sale Entry" : isPurchase ? "Purchase Entry" : isExpense ? "Expense Entry" : "Withdraw Entry" }),
      entry?.ocr_scan_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "mt-1 w-fit gap-1 px-1.5 py-0.5 text-[10px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
        " OCR linked"
      ] })
    ] }),
    isLoading || !entry ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: isSale ? "Total Sale" : isPurchase ? "Purchase Amount" : isExpense ? "Expense Amount" : "Withdraw Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SARAmount,
          {
            value: isSale ? totalSale : isPurchase ? Number(entry.purchase_amount ?? 0) : isExpense ? Number(entry.expense_amount ?? 0) : Number(entry.withdraw_amount ?? 0),
            size: "2xl",
            whole: false
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3" }),
            entry.txn_date
          ] }),
          entry.shops?.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
            entry.shops.name
          ] }),
          entry.cashiers?.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-3 w-3" }),
            entry.cashiers.name
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 divide-y divide-border rounded-xl border border-border bg-card", children: [
        isSale && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Cash Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.cash_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Bank Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.bank_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Credit Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.credit_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total Sale", highlight: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: totalSale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "POS Sale", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.pos_sale, size: "sm" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Plus / Minus", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(Number(entry.difference) < 0 ? "text-destructive" : "text-success"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.difference, size: "sm" }) }) })
        ] }),
        isPurchase && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Purchase Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.purchase_amount, size: "sm" }) }),
        isWithdraw && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Withdraw Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.withdraw_amount, size: "sm" }) }),
        isExpense && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Expense Amount", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: entry.expense_amount, size: "sm" }) })
      ] }),
      entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" }),
          " Notes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm", children: entry.notes })
      ] }),
      entry.attachment_url && /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentBlock, { url: entry.attachment_url, isImage: !!isImage, onOpenLightbox: (u) => setLightbox(u) }),
      entry.ocr_scan_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "mt-3 w-full",
          onClick: () => {
            onOpenChange(false);
            navigate({ to: "/summary", search: { scan: entry.ocr_scan_id } });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "mr-1.5 h-3.5 w-3.5" }),
            " View OCR Details"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "mt-3 w-full border-success/40 text-success hover:bg-success/10",
          onClick: handleShare,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-1.5 h-3.5 w-3.5" }),
            " Share via WhatsApp"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-t border-border bg-muted/20 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: handleEdit, disabled: !entry, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Edit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", size: "sm", className: "flex-1", onClick: handleDelete, disabled: !entry || deleting, children: [
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
function AttachmentBlock({ url, isImage, onOpenLightbox }) {
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
const KIND_META = {
  cash_sale: { title: "Cash Sale", txnType: "cash_in", payMethod: "cash", entryType: "sale", amountField: "cash_sale" },
  bank_sale: { title: "Bank Sale", txnType: "cash_in", entryType: "sale", amountField: "bank_sale" },
  pos_sale: { title: "POS Sale", txnType: "cash_in", entryType: "sale", amountField: "pos_sale" },
  credit_sale: { title: "Credit Sale", txnType: "cash_in", entryType: "sale", amountField: "credit_sale" },
  bank_withdraw: { title: "Bank Withdraw", txnType: "bank_withdraw", entryType: "withdraw", amountField: "withdraw_amount" },
  purchase: { title: "Purchase", txnType: "purchase", entryType: "purchase", amountField: "purchase_amount" },
  cash_in: { title: "Cash In", txnType: "cash_in", payMethod: "cash", entryType: "sale", amountField: "cash_sale" },
  expense: { title: "Expense", txnType: "cash_out", entryType: "expense", amountField: "expense_amount" }
};
function ShopDrilldownSheet({ open, onOpenChange, shop, kind, initialFrom, initialTo }) {
  const [search, setSearch] = reactExports.useState("");
  const [from, setFrom] = reactExports.useState(initialFrom ?? "");
  const [to, setTo] = reactExports.useState(initialTo ?? "");
  const [activeEntry, setActiveEntry] = reactExports.useState(null);
  const meta = kind ? KIND_META[kind] : null;
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["drill", shop?.id, kind],
    enabled: !!shop && !!kind && open,
    queryFn: async () => {
      if (!shop || !meta) return [];
      const { data: entries } = await supabase.from("shop_entries").select("*, cashiers(name)").eq("shop_id", shop.id).eq("entry_type", meta.entryType).eq("is_deleted", false).order("txn_date", { ascending: false });
      return (entries ?? []).map((e) => ({
        id: e.id,
        date: e.txn_date,
        amount: Number(e[meta.amountField] ?? 0),
        cashier: e.cashiers?.name ?? null,
        attachment: e.attachment_url ?? null,
        hasOcr: !!e.ocr_scan_id,
        notes: e.notes
      })).filter((r) => r.amount > 0);
    }
  });
  const filtered = reactExports.useMemo(() => {
    return rows.filter((r) => {
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${r.date} ${r.cashier ?? ""} ${r.notes ?? ""} ${r.amount}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, from, to, search]);
  const total = filtered.reduce((s, r) => s + r.amount, 0);
  const exportCsv = () => {
    if (!shop || !meta) return;
    const cols = ["Date", "Amount (SAR)", "Cashier", "Attachment", "OCR", "Notes"];
    const lines = [cols.join(",")].concat(
      filtered.map(
        (r) => [r.date, r.amount.toFixed(2), r.cashier ?? "", r.attachment ? "Yes" : "No", r.hasOcr ? "Yes" : "No", (r.notes ?? "").replace(/[",\n]/g, " ")].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shop.name}-${meta.title}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportPdf = () => {
    if (!shop || !meta) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${esc(shop.name)} — ${esc(meta.title)}</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:32px;color:#0f172a}
        h1{margin:0 0 4px;font-size:22px}
        .sub{color:#64748b;font-size:13px;margin-bottom:18px}
        .total{font-size:20px;font-weight:700;margin:12px 0 24px;padding:14px 18px;background:#f1f5f9;border-radius:10px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e2e8f0}
        th{background:#f8fafc;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#64748b}
        td.r,th.r{text-align:right}
      </style></head><body>
      <h1>${esc(shop.name)} — ${esc(meta.title)}</h1>
      <div class="sub">${esc(from || "All")} → ${esc(to || "Now")} · ${filtered.length} entries</div>
      <div class="total">Total: SAR ${total.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <table><thead><tr><th>Date</th><th class="r">Amount</th><th>Cashier</th><th>Attachment</th><th>OCR</th><th>Notes</th></tr></thead>
      <tbody>${filtered.map(
      (r) => `<tr><td>${esc(r.date)}</td><td class="r">${r.amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>${esc(r.cashier ?? "—")}</td><td>${r.attachment ? "Yes" : "—"}</td><td>${r.hasOcr ? "Yes" : "—"}</td><td>${esc(r.notes ?? "")}</td></tr>`
    ).join("")}</tbody></table>
      <script>setTimeout(()=>window.print(),300)<\/script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };
  const share = async () => {
    if (!shop || !meta) return;
    const text = `${shop.name} — ${meta.title}
Total: SAR ${total.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Entries: ${filtered.length}`;
    try {
      if (navigator.share) await navigator.share({ title: `${shop.name} ${meta.title}`, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Summary copied to clipboard");
      }
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "bottom", className: "rounded-t-3xl p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "border-b border-border px-5 pt-5 pb-4 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "font-display text-lg", children: [
          shop?.name,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "— ",
            meta?.title
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-primary/80", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: total, size: "2xl" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
            filtered.length,
            " ",
            filtered.length === 1 ? "entry" : "entries"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-b border-border px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search…", className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), className: "pl-9 text-xs" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "to" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value), className: "flex-1 text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: exportPdf, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "mr-1.5 h-3.5 w-3.5" }),
            "PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: exportCsv, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Excel"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: share, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1.5 h-3.5 w-3.5" }),
            "Share"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-sm text-muted-foreground", children: "No entries found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveEntry(r.id),
          className: "group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)] active:scale-[0.99]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }),
                r.hasOcr && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-5 gap-0.5 px-1.5 text-[9px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
                  " OCR"
                ] }),
                r.attachment && /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3.5 w-3.5 text-muted-foreground" })
              ] }),
              (r.cashier || r.notes) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 truncate text-[11px] text-muted-foreground", children: [
                r.cashier ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.cashier }) : null,
                r.cashier && r.notes ? " · " : null,
                r.notes ?? ""
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1", kind === "purchase" || kind === "expense" ? "text-destructive" : "text-success"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: r.amount, size: "md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" })
            ] })
          ]
        }
      ) }, r.id)) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntryDetailDialog,
      {
        open: !!activeEntry,
        onOpenChange: (v) => !v && setActiveEntry(null),
        entryId: activeEntry,
        kind
      }
    )
  ] });
}
export {
  ShopDrilldownSheet as S
};
