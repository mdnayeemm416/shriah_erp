import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2, History, Save, X, Trash2, Plus, Minus, Search, Package, FileText, Printer, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { openInvoiceV2 } from "@/lib/invoice-v2/share";
import { openInvoiceAm80 } from "@/lib/invoice-am80/share";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { PosCustomerPicker } from "@/components/pos-customer-picker";
import { usePosDueMap } from "@/hooks/use-pos-due-map";
import { POS_CUSTOMER_COLS, POS_CUSTOMER_QUERY_KEY } from "@/lib/pos-customers";
import { cn } from "@/lib/utils";

type SaleItem = { product_id?: string; name: string; qty: number; price: number; cost?: number; image_url?: string | null };

type Sale = {
  id: string; invoice_number: number; created_at: string; txn_date: string;
  customer_name: string; customer_mobile: string | null; customer_id: string | null;
  items: SaleItem[];
  subtotal: number; tax: number; discount: number; total: number;
  paid_amount: number; due_amount: number; payment_method: string;
  payment_breakdown: Record<string, number>;
  status: string; notes: string | null; edit_count: number;
};

type Product = {
  id: string; name: string; price: number; purchase_price: number;
  stock: number; image_url: string | null; barcode: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  saleId: string | null;
};

function normStr(s: string) {
  return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function PosSaleDetailsDialog({ open, onOpenChange, saleId }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Sale | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  const sale = useQuery({
    queryKey: ["pos-sale-detail", saleId],
    enabled: open && !!saleId,
    queryFn: async (): Promise<Sale | null> => {
      const { data, error } = await supabase.from("shop_sales").select("*").eq("id", saleId!).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const audit = useQuery({
    queryKey: ["pos-sale-audit", saleId],
    enabled: open && !!saleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pos_sale_edits")
        .select("id,changed_at,changed_by,diff,note")
        .eq("sale_id", saleId!)
        .order("changed_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Lazy-load product catalogue only when editing
  const products = useQuery({
    queryKey: ["pos-edit-products"],
    enabled: open && editing,
    staleTime: 60_000,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name,price,purchase_price,stock,image_url,barcode")
        .order("name");
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  // Customer current due (used to compute previousDue for ledger sharing)
  const customerBalance = useQuery({
    queryKey: ["pos-balance", sale.data?.customer_id],
    enabled: open && !!sale.data?.customer_id,
    queryFn: () => fetchCustomerBalance(sale.data!.customer_id!),
  });

  const dueMap = usePosDueMap(open && editing);

  // Load the currently-linked customer record for the picker (pre-select).
  const currentCustomer = useQuery<PosCustomer | null>({
    queryKey: ["pos-customer-lookup", draft?.customer_id ?? sale.data?.customer_id],
    enabled: open && editing && !!(draft?.customer_id ?? sale.data?.customer_id),
    queryFn: async () => {
      const id = draft?.customer_id ?? sale.data?.customer_id;
      if (!id) return null;
      const { data } = await supabase.from("pos_customers").select(POS_CUSTOMER_COLS).eq("id", id).maybeSingle();
      return (data ?? null) as PosCustomer | null;
    },
  });


  useEffect(() => {
    if (sale.data && editing) setDraft(structuredClone(sale.data));
  }, [editing, sale.data]);

  useEffect(() => {
    if (!open) { setEditing(false); setDraft(null); setProductSearch(""); }
  }, [open]);

  const live = editing ? draft : sale.data;

  const totals = useMemo(() => {
    const items = live?.items ?? [];
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0);
    const tax = Math.max(0, subtotal - subtotal / 1.15);
    const discount = Number(live?.discount ?? 0);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, tax, discount, total };
  }, [live]);

  const filteredProducts = useMemo(() => {
    const list = products.data ?? [];
    const q = normStr(productSearch);
    if (!q) return list.slice(0, 20);
    const tokens = q.split(/\s+/).filter(Boolean);
    return list
      .map(p => {
        const hay = normStr(p.name) + " " + normStr(p.barcode ?? "");
        let score = 0;
        for (const t of tokens) {
          if (!hay.includes(t)) return { p, score: -1 };
          score += hay.startsWith(t) ? 3 : 1;
        }
        return { p, score };
      })
      .filter(x => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map(x => x.p);
  }, [products.data, productSearch]);

  function addProduct(p: Product) {
    if (!draft) return;
    const existing = draft.items.find((it: any) => it.product_id === p.id);
    if (existing) {
      setDraft({
        ...draft,
        items: draft.items.map((it: any) =>
          it.product_id === p.id ? { ...it, qty: it.qty + 1 } : it,
        ),
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
            image_url: p.image_url,
          },
        ],
      });
    }
    setProductSearch("");
    queueMicrotask(() => searchRef.current?.focus());
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!draft || !sale.data) return;
      const orig = sale.data;
      const diff: Record<string, { from: any; to: any }> = {};
      const fields = ["customer_id", "customer_name", "customer_mobile", "payment_method", "paid_amount", "due_amount", "notes", "discount"];
      for (const f of fields) {
        if ((orig as any)[f] != (draft as any)[f]) diff[f] = { from: (orig as any)[f], to: (draft as any)[f] };
      }
      const origItems = JSON.stringify(orig.items);
      const newItems = JSON.stringify(draft.items);
      if (origItems !== newItems) {
        const origIds = new Set(orig.items.map((i: any) => i.product_id ?? i.name));
        const newIds = new Set(draft.items.map((i: any) => i.product_id ?? i.name));
        diff.items = {
          from: { count: orig.items.length, total: Number(orig.total) },
          to: {
            count: draft.items.length,
            total: totals.total,
            added: draft.items.filter((i: any) => !origIds.has(i.product_id ?? i.name)).map((i: any) => i.name),
            removed: orig.items.filter((i: any) => !newIds.has(i.product_id ?? i.name)).map((i: any) => i.name),
          },
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
        edit_count: (orig.edit_count ?? 0) + 1,
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
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });


  async function buildInvoicePayload() {
    if (!sale.data) return null;
    const r = sale.data;
    const currentDue = customerBalance.data?.current_due ?? 0;
    const thisSaleDue = Number(r.due_amount ?? 0);
    const previousDue = Math.max(0, currentDue - thisSaleDue);
    const vat = await (await import("@/lib/pos-ledger")).fetchCustomerVatForSale({
      customer_id: (r as any).customer_id,
      customer_mobile: r.customer_mobile,
    });
    return {
      kind: "sale" as const,
      invoiceNumber: r.invoice_number,
      date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
      timestamp: r.created_at ?? r.txn_date,
      partyLabel: "Customer",
      partyName: r.customer_name,
      partyMobile: r.customer_mobile ?? undefined,
      partyTaxNo: vat ?? undefined,
      items: r.items as any,
      subtotal: Number(r.subtotal),
      discount: Number(r.discount ?? 0),
      tax: Number(r.tax),
      total: Number(r.total),
      notes: r.notes ?? undefined,
      paymentMethod: r.payment_method,
      paidAmount: Number(r.paid_amount ?? 0),
      previousDue,
      newDue: currentDue,
    };
  }

  // Legacy thermal + A4 invoice handlers removed — Wholesale & Sale dialogs now use
  // only Invoice V2 and 80mm by AM.

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
      items: payload.items.map((it: any) => ({
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0,
      })),
      subtotal: Number(payload.subtotal) || 0,
      vat: Number(payload.tax) || 0,
      total: Number(payload.total) || 0,
      paidAmount: payload.paidAmount,
      previousDue: payload.previousDue,
      newDue: payload.newDue,
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
      items: payload.items.map((it: any) => ({
        name: it.name,
        qty: Number(it.qty) || 0,
        price: Number(it.price) || 0,
      })),
      subtotal: Number(payload.subtotal) || 0,
      vat: Number(payload.tax) || 0,
      total: Number(payload.total) || 0,
      paidAmount: payload.paidAmount,
      previousDue: payload.previousDue,
      newDue: payload.newDue,
    });
  }


  const liveNewDue = useMemo(() => {
    if (!live) return 0;
    return Math.max(0, totals.total - (Number(live.paid_amount) || 0));
  }, [live, totals.total]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[92dvh] max-w-lg flex-col gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center justify-between gap-2 text-base">
            <span>Sale #{sale.data?.invoice_number ?? "…"}</span>
            <div className="flex items-center gap-1.5">
              {sale.data?.status === "partially_returned" && (
                <Badge className="gap-1 bg-amber-500 text-[10px] text-white hover:bg-amber-500"><Undo2 className="h-3 w-3" /> Partial Return</Badge>
              )}
              {sale.data?.status === "fully_returned" && (
                <Badge className="gap-1 bg-rose-600 text-[10px] text-white hover:bg-rose-600"><Undo2 className="h-3 w-3" /> Fully Returned</Badge>
              )}
              {(sale.data?.edit_count ?? 0) > 0 && (
                <Badge variant="secondary" className="gap-1 text-[10px]"><History className="h-3 w-3" /> Edited {sale.data?.edit_count}x</Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {sale.isLoading || !live ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {/* hero */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Total</p>
              <p className="text-3xl font-bold">SAR {totals.total.toFixed(2)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(sale.data!.created_at).toLocaleString()}
              </p>
            </div>

            {/* customer */}
            <div className="mt-3 rounded-xl border border-border bg-card p-3">
              {editing ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</p>
                  <PosCustomerPicker
                    value={currentCustomer.data ?? (draft?.customer_id ? ({
                      id: draft.customer_id,
                      name: draft.customer_name,
                      phone: draft.customer_mobile,
                      alias: null,
                      opening_due: 0,
                      notes: null,
                      is_active: true,
                      created_at: "",
                    } as PosCustomer) : null)}
                    onChange={(c) => {
                      if (!draft) return;
                      if (c) {
                        setDraft({ ...draft, customer_id: c.id, customer_name: c.name, customer_mobile: c.phone ?? "" });
                      } else {
                        setDraft({ ...draft, customer_id: null, customer_name: "Walk-in", customer_mobile: "" });
                      }
                    }}
                    showDue
                    dueByCustomer={dueMap.data}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={draft?.customer_name ?? ""} onChange={(e) => setDraft({ ...draft!, customer_name: e.target.value })} placeholder="Customer name" />
                    <Input value={draft?.customer_mobile ?? ""} onChange={(e) => setDraft({ ...draft!, customer_mobile: e.target.value })} placeholder="Mobile" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{sale.data!.customer_name}</p>
                  {sale.data!.customer_mobile && <p className="text-xs text-muted-foreground">{sale.data!.customer_mobile}</p>}
                </>
              )}
            </div>


            {/* Add product (edit mode) */}
            {editing && (
              <div className="mt-3 rounded-xl border border-primary/30 bg-primary/[0.03] p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchRef}
                    placeholder="Add product — search by name or barcode…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="h-9 pl-8 text-sm"
                    autoComplete="off"
                  />
                </div>
                {productSearch && (
                  <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                    {products.isLoading ? (
                      <div className="py-2 text-center text-xs text-muted-foreground">Loading…</div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="py-3 text-center text-xs text-muted-foreground">No products found</div>
                    ) : (
                      filteredProducts.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addProduct(p)}
                          className="flex w-full items-center gap-2 rounded-lg border border-border/60 bg-card p-1.5 text-left hover:border-primary/50 active:scale-[0.99]"
                        >
                          <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded bg-muted">
                            {p.image_url ? (
                              <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center"><Package className="h-3 w-3 text-muted-foreground/60" /></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">SAR {p.price.toFixed(2)} · Stock {p.stock}</p>
                          </div>
                          <Plus className="h-3.5 w-3.5 text-primary" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* items */}
            <div className="mt-3 rounded-xl border border-border bg-card">
              <p className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Items</p>
              {(live.items ?? []).map((it, i) => {
                return (
                <div key={i} className="flex items-center gap-2 border-b border-border px-3 py-2 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{it.name}</p>
                    {!editing && <p className="text-[11px] text-muted-foreground">{it.qty} × SAR {Number(it.price).toFixed(2)}</p>}
                  </div>
                  {editing ? (
                    <>
                      <div className="flex items-center rounded-md border">
                        <button type="button" onClick={() => setDraft({ ...draft!, items: draft!.items.map((x, idx) => idx === i ? { ...x, qty: Math.max(0, x.qty - 1) } : x).filter(x => x.qty > 0) })} className="px-2 py-1"><Minus className="h-3 w-3" /></button>
                        <Input type="number" value={it.qty} onChange={(e) => setDraft({ ...draft!, items: draft!.items.map((x, idx) => idx === i ? { ...x, qty: Number(e.target.value) || 0 } : x) })} className="h-7 w-12 border-0 text-center" />
                        <button type="button" onClick={() => setDraft({ ...draft!, items: draft!.items.map((x, idx) => idx === i ? { ...x, qty: x.qty + 1 } : x) })} className="px-2 py-1"><Plus className="h-3 w-3" /></button>
                      </div>
                      <Input type="number" step="0.01" value={it.price} onChange={(e) => setDraft({ ...draft!, items: draft!.items.map((x, idx) => idx === i ? { ...x, price: Number(e.target.value) || 0 } : x) })} className="h-7 w-20 text-right" />
                      <button type="button" onClick={() => setDraft({ ...draft!, items: draft!.items.filter((_, idx) => idx !== i) })} className="rounded p-1 text-rose-600 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                    </>
                  ) : (
                    <p className="text-sm font-semibold">SAR {(it.qty * it.price).toFixed(2)}</p>
                  )}
                </div>
                );
              })}
            </div>

            {/* payment summary cells */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Cell label="Subtotal" value={`SAR ${totals.subtotal.toFixed(2)}`} />
              <Cell label="Paid" value={`SAR ${Number(live.paid_amount ?? 0).toFixed(2)}`} tone="success" />
              <Cell
                label="Due"
                value={`SAR ${(editing ? liveNewDue : Number(live.due_amount ?? 0)).toFixed(2)}`}
                tone={(editing ? liveNewDue : Number(live.due_amount ?? 0)) > 0 ? "danger" : undefined}
              />
            </div>

            {editing && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground">Discount</label>
                  <Input type="number" step="0.01" value={draft?.discount ?? 0} onChange={(e) => setDraft({ ...draft!, discount: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground">Paid amount</label>
                  <Input type="number" step="0.01" value={draft?.paid_amount ?? 0} onChange={(e) => setDraft({ ...draft!, paid_amount: Number(e.target.value) || 0 })} />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-muted-foreground">Method</label>
                  <Select value={draft?.payment_method ?? "cash"} onValueChange={(v) => setDraft({ ...draft!, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="due">Due (credit)</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea className="col-span-2" rows={2} value={draft?.notes ?? ""} onChange={(e) => setDraft({ ...draft!, notes: e.target.value })} placeholder="Notes" />
                <div className={cn("col-span-2 flex items-center justify-between rounded-lg border px-3 py-2 text-xs", liveNewDue > 0 ? "border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/20" : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20")}>
                  <span className="font-medium">New due for this sale</span>
                  <span className="font-bold">SAR {liveNewDue.toFixed(2)}</span>
                </div>
              </div>
            )}

            {!editing && live.notes && (
              <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                <p className="text-sm">{live.notes}</p>
              </div>
            )}

            {/* audit */}
            {(audit.data?.length ?? 0) > 0 && (
              <div className="mt-3 rounded-xl border border-border bg-muted/20 p-3">
                <p className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <History className="h-3 w-3" /> Edit history
                </p>
                <div className="space-y-2">
                  {audit.data!.map((e: any) => (
                    <div key={e.id} className="rounded-lg bg-background px-2 py-1.5 text-xs">
                      <p className="text-[10px] text-muted-foreground">{new Date(e.changed_at).toLocaleString()}</p>
                      {Object.entries(e.diff ?? {}).map(([k, v]: any) => (
                        <p key={k} className="truncate">
                          <span className="font-medium">{k}:</span>{" "}
                          <span className="text-muted-foreground">{JSON.stringify(v.from)?.slice(0, 40)}</span>{" → "}
                          <span className="font-medium">{JSON.stringify(v.to)?.slice(0, 40)}</span>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border bg-muted/20 px-4 py-3">
          {editing ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}><X className="mr-1 h-4 w-4" /> Cancel</Button>
              <Button className="flex-1" disabled={save.isPending} onClick={() => save.mutate()}><Save className="mr-1 h-4 w-4" /> Save changes</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="mr-1 h-4 w-4" /> Edit</Button>
              <Button
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleInvoiceAm80}
              >
                <Printer className="mr-1 h-4 w-4" /> 80mm by AM
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleInvoiceV2}
              >
                <FileText className="mr-1 h-4 w-4" /> Invoice V2
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Cell({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  const c = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-rose-600" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card px-2 py-2 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${c}`}>{value}</p>
    </div>
  );
}
