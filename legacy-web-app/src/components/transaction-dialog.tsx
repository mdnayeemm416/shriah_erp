import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2, Search, MessageCircle, ChevronDown, ChevronUp, X, Package, ShoppingCart, CheckCircle2, AlertTriangle, ScanLine, Printer } from "lucide-react";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { LockedRecordDialog, isMonthClosedError } from "@/components/locked-record-dialog";
import { toast } from "sonner";
import { type InvoiceLine } from "@/lib/invoice-image";
import { whatsappLink } from "@/lib/whatsapp";
import { openInvoiceShare } from "@/lib/invoice-formats";
import { cn } from "@/lib/utils";
import { PosCustomerAutosuggest } from "./pos-customer-autosuggest";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { fetchCustomerBalance, type PosCustomer } from "@/lib/pos-ledger";
import { usePosDueMap } from "@/hooks/use-pos-due-map";
import { refreshWholesaleDataInBackground, traceWholesaleFlow } from "@/lib/wholesale-query-utils";
import { sendAuditEmail } from "@/lib/audit-email";





type Kind = "sale" | "purchase";

type Line = {
  product_id: string;
  name: string;
  qty: number;
  price: number;
  cost?: number; // for profit estimate
  image_url?: string | null;
  stock?: number; // captured at add-time for low-stock validation
};

type Product = {
  id: string; name: string; price: number; purchase_price: number;
  stock: number; image_url: string | null; tax_rate: number;
  barcode?: string | null;
  item_code?: string | null;
};

type Initial = {
  partyName?: string;
  partyMobile?: string;
  items?: Line[];
  orderId?: string;
  notes?: string;
};

function norm(s: string) {
  return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function TransactionDialog({
  open, onOpenChange, kind, initial, editId,
}: { open: boolean; onOpenChange: (v: boolean) => void; kind: Kind; initial?: Initial; editId?: string | null }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [pendingLowStock, setPendingLowStock] = useState<null | { alsoShare: boolean; items: { name: string; stock: number; qty: number }[] }>(null);
  const [partyName, setPartyName] = useState(initial?.partyName ?? "");
  const [partyMobile, setPartyMobile] = useState(initial?.partyMobile ?? "");
  const [lines, setLines] = useState<Line[]>(initial?.items ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [discount, setDiscount] = useState(0);
  const [search, setSearch] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [armedAction, setArmedAction] = useState<null | "save" | "share">(null);
  const [customer, setCustomer] = useState<PosCustomer | null>(null);
  const [paidStr, setPaidStr] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "pos" | "bank" | "due" | "mixed">("cash");
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [memoDate, setMemoDate] = useState<string>("");
  const linesRef = useRef<Line[]>(initial?.items ?? []);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const armTimerRef = useRef<number | null>(null);
  const [lockedOpen, setLockedOpen] = useState(false);
  const isEdit = !!editId && kind === "purchase";
  const [scannerOpen, setScannerOpen] = useState(false);
  const scannerOpenRef = useRef(false);
  const [scannerStatus, setScannerStatus] = useState<{ label: string; sub?: string } | null>(null);
  const scannerStatusTimerRef = useRef<number | null>(null);
  const [unknownBarcode, setUnknownBarcode] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState<null | { name: string; price: string; cost: string; saving: boolean }>(null);

  function flashScannerStatus(s: { label: string; sub?: string }) {
    setScannerStatus(s);
    if (scannerStatusTimerRef.current) window.clearTimeout(scannerStatusTimerRef.current);
    scannerStatusTimerRef.current = window.setTimeout(() => setScannerStatus(null), 1000);
  }

  function updateLines(nextOrUpdater: Line[] | ((prev: Line[]) => Line[])) {
    const next = typeof nextOrUpdater === "function" ? nextOrUpdater(linesRef.current) : nextOrUpdater;
    linesRef.current = next;
    setLines(next);
  }

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  function onProductScanned(p: Product, scannedBarcode?: string) {
    setArmedAction(null);
    const current = linesRef.current;
    const existing = current.find(l => l.product_id === p.id);
    const nextQty = (existing?.qty ?? 0) + 1;
    const next = existing
      ? current.map(l => l.product_id === p.id ? { ...l, qty: nextQty, stock: p.stock } : l)
      : [...current, {
        product_id: p.id,
        name: p.name,
        qty: 1,
        price: Number(kind === "sale" ? p.price : (p.purchase_price || p.price)) || 0,
        cost: Number(p.purchase_price) || 0,
        image_url: p.image_url,
        stock: p.stock,
      }];
    updateLines(next);
    console.debug("[barcode-scan]", {
      scannedBarcode,
      matchedProductId: p.id,
      addedCartId: p.id,
      currentCartQuantity: nextQty,
    });
    return nextQty;
  }

  function handleProductScanned(p: Product, scannedBarcode: string) {
    const newQty = onProductScanned(p, scannedBarcode);
    flashScannerStatus({ label: p.name, sub: `Qty: ${newQty}` });
  }

  function openScanner() {
    scannerOpenRef.current = true;
    setScannerStatus(null);
    setScannerOpen(true);
  }

  function handleScannerOpenChange(v: boolean) {
    if (v) {
      scannerOpenRef.current = true;
      setScannerOpen(true);
      return;
    }
    setScannerOpen(false);
    setScannerStatus(null);
    window.setTimeout(() => { scannerOpenRef.current = false; }, 250);
  }

  async function lookupScannedProduct(code: string): Promise<Product | null> {
    // Normalize: strip whitespace, line breaks, and hidden/zero-width chars.
    const clean = (code || "")
      .replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, "")
      .trim();
    if (!clean) return null;

    // Fresh lookup against Product Barcode (item_code) with legacy barcode fallback.
    const select = "id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code";
    let { data } = await supabase
      .from("shop_products")
      .select(select)
      .eq("item_code", clean)
      .eq("is_deleted", false)
      .limit(1)
      .maybeSingle();

    if (!data) {
      ({ data } = await supabase
        .from("shop_products")
        .select(select)
        .eq("barcode", clean)
        .eq("is_deleted", false)
        .limit(1)
        .maybeSingle());
    }

    // If still nothing and the code is purely numeric, try a tolerant numeric
    // match (handles old rows stored with stray leading zeros / spaces).
    if (!data && /^\d+$/.test(clean)) {
      const { data: rows } = await supabase
        .from("shop_products")
        .select(select)
        .eq("is_deleted", false)
        .or(`item_code.ilike.%${clean}%,barcode.ilike.%${clean}%`)
        .limit(5);
      const numeric = (rows ?? []).find((r: any) => {
        const a = String(r.item_code ?? "").replace(/\D/g, "");
        const b = String(r.barcode ?? "").replace(/\D/g, "");
        return a === clean || b === clean;
      });
      if (numeric) data = numeric as any;
    }

    console.debug("[barcode-lookup]", {
      scanned: code,
      normalized: clean,
      matchedBarcode: (data as any)?.item_code ?? (data as any)?.barcode ?? null,
      matchedProductId: (data as any)?.id ?? null,
    });

    return (data as Product | null) ?? null;
  }


  // Load existing purchase when editing
  const editingRow = useQuery({
    queryKey: ["txn-edit-purchase", editId],
    enabled: open && isEdit,
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_purchases").select("*").eq("id", editId!).maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });


  const dueMap = usePosDueMap();
  const customerBalance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: !!customer?.id && kind === "sale",
    queryFn: () => fetchCustomerBalance(customer!.id),
  });

  // Supplier suggestions for purchase entry — lightweight, cached 5min.
  const supplierOptions = useQuery({
    queryKey: ["txn-supplier-options"],
    enabled: open && kind === "purchase",
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("parties")
        .select("id,name,phone")
        .eq("is_deleted", false)
        .in("party_type", ["supplier", "mixed"])
        .order("name")
        .limit(200);
      return (data ?? []) as { id: string; name: string; phone: string | null }[];
    },
  });



  useEffect(() => {
    if (open) {
      setPartyName(initial?.partyName ?? "");
      setPartyMobile(initial?.partyMobile ?? "");
      const initialLines = initial?.items ?? [];
      updateLines(initialLines);
      setNotes(initial?.notes ?? "");
      setDiscount(0);
      setSearch("");
      setDetailsOpen(false);
      setCartOpen(false);
      setArmedAction(null);
      setCustomer(null);
      setPaidStr("");
      setPaymentMethod("cash");
      setAttachmentUrl(null);
      setAttachmentUploading(false);
      setMemoDate("");
      // Do not auto-focus the search input — that pops the mobile keyboard.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Prefill the form when editing a purchase, once the row is loaded
  useEffect(() => {
    if (!isEdit || !open) return;
    const r = editingRow.data;
    if (!r) return;
    setPartyName(String(r.supplier_name ?? ""));
    setPartyMobile(String(r.supplier_mobile ?? ""));
    setNotes(String(r.notes ?? ""));
    setAttachmentUrl(r.attachment_url ?? null);
    setMemoDate(r.memo_date ? String(r.memo_date).slice(0, 10) : "");
    const items = Array.isArray(r.items) ? r.items : [];
    const editLines = items.map((it: any) => ({
      product_id: String(it.product_id ?? it.id ?? ""),
      name: String(it.name ?? ""),
      qty: Number(it.qty ?? 0) || 0,
      price: Number(it.price ?? 0) || 0,
      cost: Number(it.cost ?? it.price ?? 0) || 0,
      image_url: it.image_url ?? null,
      stock: typeof it.stock === "number" ? it.stock : undefined,
    })).filter((l: Line) => l.product_id);
    updateLines(editLines);
  }, [isEdit, open, editingRow.data]);



  // Auto-clear armed state after 3.5s
  useEffect(() => {
    if (!armedAction) return;
    if (armTimerRef.current) window.clearTimeout(armTimerRef.current);
    armTimerRef.current = window.setTimeout(() => setArmedAction(null), 3500);
    return () => {
      if (armTimerRef.current) window.clearTimeout(armTimerRef.current);
    };
  }, [armedAction]);

  // Debounce the search term so each keystroke doesn't trigger a network call.
  const debouncedSearch = useDebouncedValue(search, 250);
  const trimmedSearch = debouncedSearch.trim();

  // Paginated browse query (no search): load 30 at a time as user scrolls.
  // Keeps initial memory + render cost low for large inventories.
  const PAGE_SIZE = 30;
  const browse = useInfiniteQuery({
    queryKey: ["txn-products-browse"],
    enabled: open && trimmedSearch.length === 0,
    staleTime: 60_000,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code")
        .eq("is_deleted", false)
        .order("name")
        .range(from, to);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
  });

  // Search query: server-side ilike across name + barcode. Avoids loading the
  // whole catalogue just to filter locally.
  const searchQuery = useQuery({
    queryKey: ["txn-products-search", trimmedSearch],
    enabled: open && trimmedSearch.length > 0,
    staleTime: 30_000,
    queryFn: async (): Promise<Product[]> => {
      const safe = trimmedSearch.replace(/[%,]/g, " ");
      const pattern = `%${safe}%`;
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code")
        .eq("is_deleted", false)
        .or(`name.ilike.${pattern},barcode.ilike.${pattern},item_code.ilike.${pattern}`)
        .order("name")
        .limit(60);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const isSearching = trimmedSearch.length > 0;
  const products = {
    isLoading: isSearching ? searchQuery.isLoading : browse.isLoading,
    data: undefined as Product[] | undefined,
  };

  const filteredProducts = useMemo<Product[]>(() => {
    if (isSearching) return searchQuery.data ?? [];
    const pages = browse.data?.pages ?? [];
    const seen = new Set<string>();
    const out: Product[] = [];
    for (const page of pages) {
      for (const p of page) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }, [isSearching, searchQuery.data, browse.data]);

  // Sentinel for infinite scroll (only in browse mode).
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSearching) return;
    const node = loadMoreRef.current;
    if (!node) return;
    if (!browse.hasNextPage || browse.isFetchingNextPage) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) browse.fetchNextPage();
    }, { rootMargin: "200px 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, [isSearching, browse.hasNextPage, browse.isFetchingNextPage, browse.fetchNextPage, filteredProducts.length]);

  const lineMap = useMemo(() => {
    const m = new Map<string, Line>();
    lines.forEach(l => m.set(l.product_id, l));
    return m;
  }, [lines]);

  function addOrInc(p: Product) {
    setArmedAction(null);
    updateLines(prev => {
      const existing = prev.find(l => l.product_id === p.id);
      if (existing) {
        return prev.map(l => l.product_id === p.id ? { ...l, qty: l.qty + 1, stock: p.stock } : l);
      }
      return [...prev, {
        product_id: p.id,
        name: p.name,
        qty: 1,
        price: Number(kind === "sale" ? p.price : (p.purchase_price || p.price)) || 0,
        cost: Number(p.purchase_price) || 0,
        image_url: p.image_url,
        stock: p.stock,
      }];
    });
    // POS-style behavior: keep the current search/keyword/scroll state intact
    // so the user can tap the same product or nearby products repeatedly
    // without re-searching. The search box only clears when the user clears
    // it manually, closes the picker, or saves the transaction.
  }

  function setQty(id: string, qty: number) {
    setArmedAction(null);
    updateLines(prev => prev
      .map(l => l.product_id === id ? { ...l, qty } : l)
      .filter(l => l.qty > 0));
  }
  function setPrice(id: string, price: number) {
    setArmedAction(null);
    updateLines(prev => prev.map(l => l.product_id === id ? { ...l, price } : l));
  }
  function removeLine(id: string) {
    setArmedAction(null);
    updateLines(prev => prev.filter(l => l.product_id !== id));
  }
  function clearAll() {
    updateLines([]);
    setArmedAction(null);
    toast.success("Cart cleared");
    // No auto-focus — keyboard should only open on explicit user tap.
  }

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const vatPortion = subtotal - subtotal / 1.15;
  const estProfit = kind === "sale"
    ? lines.reduce((s, l) => s + l.qty * (l.price - (l.cost ?? 0)), 0) - discount
    : 0;

  // Payment math (sale)
  const paidAmount = kind === "sale" ? Math.max(0, Number(paidStr) || 0) : 0;
  const dueAmount = kind === "sale" ? Math.max(0, total - paidAmount) : 0;
  const customerCurrentDue = customerBalance.data?.current_due ?? 0;

  // For website-order conversions: auto-link or auto-create a customer
  // so every sale belongs to a ledger record.
  async function ensureCustomerForOrder(): Promise<PosCustomer | null> {
    if (customer) return customer;
    if (kind !== "sale" || !initial?.orderId) return null;
    const name = (initial.partyName ?? "").trim();
    const phone = (initial.partyMobile ?? "").trim();
    if (!name && !phone) return null;
    let found: any = null;
    if (phone) {
      const { data } = await supabase.from("pos_customers").select("*").eq("phone", phone).limit(1);
      found = data?.[0] ?? null;
    }
    if (!found && name) {
      const { data } = await supabase.from("pos_customers").select("*").ilike("name", name).limit(1);
      found = data?.[0] ?? null;
    }
    if (!found) {
      const { data, error } = await supabase
        .from("pos_customers")
        .insert({ name: name || "Web customer", phone: phone || null, notes: "Auto-created from website order" })
        .select("*").single();
      if (error) throw error;
      found = data;
    }
    setCustomer(found as PosCustomer);
    qc.invalidateQueries({ queryKey: ["pos-customers"] });
    return found as PosCustomer;
  }

  const save = useMutation({
    mutationFn: async (action: "save" | "share" | "print") => {
      let activeCustomer = customer;
      if (kind === "sale") {
        activeCustomer = await ensureCustomerForOrder();
        if (!activeCustomer) {
          throw new Error("Please select customer first");
        }
      }
      const effectiveName = activeCustomer?.name ?? partyName.trim();
      if (kind === "purchase" && !effectiveName) {
        setDetailsOpen(true);
        throw new Error("Supplier name required");
      }
      if (lines.length === 0) throw new Error("Add at least one product");
      const payload: any = {
        items: lines,
        subtotal,
        tax: Math.max(0, vatPortion),
        total,
        notes: notes.trim() || null,
      };
      if (kind === "sale") {
        payload.customer_name = effectiveName;
        payload.customer_mobile = (activeCustomer?.phone ?? partyMobile).trim() || null;
        payload.discount = discount;
        payload.customer_id = activeCustomer!.id;
        payload.paid_amount = paidAmount;
        payload.due_amount = dueAmount;
        payload.payment_method = paymentMethod === "mixed" ? "mixed" : (paidAmount >= total ? paymentMethod : (paidAmount > 0 ? "mixed" : "due"));
        payload.payment_breakdown = { [paymentMethod]: paidAmount };
        if (initial?.orderId) payload.order_id = initial.orderId;
      } else {
        payload.supplier_name = effectiveName;
        payload.supplier_mobile = partyMobile.trim() || null;
        payload.memo_date = memoDate || null;
        if (attachmentUrl) payload.attachment_url = attachmentUrl;
      }

      const table = kind === "sale" ? "shop_sales" : "shop_purchases";
      let data: any; let error: any;
      if (isEdit) {
        ({ data, error } = await supabase.from(table).update(payload).eq("id", editId!).select("*").single());
      } else {
        ({ data, error } = await supabase.from(table).insert(payload).select("*").single());
      }
      if (error) throw error;
      if (kind === "sale" && initial?.orderId) {
        await supabase.from("shop_orders").update({ status: "delivered" }).eq("id", initial.orderId);
      }
      return { row: data, action };
    },

    onSuccess: async ({ row, action }) => {
      traceWholesaleFlow("mutation success", { type: kind, id: (row as any)?.id, action });
      const listKey = [`admin-${kind}s`];
      qc.setQueryData<any[]>(listKey, (old = []) => [row, ...old.filter((r) => r.id !== (row as any).id)].slice(0, 200));
      // Invalidate the paginated product browse + any active search so stock
      // numbers refresh on next view. Cheaper than mutating every cached page.
      qc.invalidateQueries({ queryKey: ["txn-products-browse"] });
      qc.invalidateQueries({ queryKey: ["txn-products-search"] });
      if (isEdit) {
        qc.invalidateQueries({ queryKey: ["wh-purchase-detail", editId] });
        qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
      } else {
        qc.setQueryData<any[]>(["wh-recent-entries", 20], (old = []) => [{
          id: `${kind === "sale" ? "s" : "p"}-${(row as any).id}`,
          refId: (row as any).id,
          kind,
          title: kind === "sale" ? ((row as any).customer_name || "Walk-in") : ((row as any).supplier_name || "Supplier"),
          subtitle: `Invoice #${(row as any).invoice_number}`,
          amount: Number((row as any).total ?? 0),
          at: (row as any).created_at,
        }, ...old].slice(0, 20));
      }
      refreshWholesaleDataInBackground(qc);
      toast.success(isEdit ? "Purchase updated" : (kind === "sale" ? "Sale completed" : "Purchase completed"));
      // Fire-and-forget audit email (never blocks)
      try {
        const r: any = row;
        sendAuditEmail({
          action: isEdit ? "edited" : "created",
          module: kind === "sale" ? "Wholesale Sale" : "Wholesale Purchase",
          userName: null,
          recordId: r?.id,
          newValues: {
            invoice_number: r?.invoice_number,
            customer_or_supplier: kind === "sale" ? r?.customer_name : r?.supplier_name,
            mobile: kind === "sale" ? r?.customer_mobile : r?.supplier_mobile,
            total: r?.total,
            discount: r?.discount,
            items: Array.isArray(r?.items) ? r.items.length : undefined,
          },
          notes: notes || null,
          amount: Number(r?.total ?? 0),
        });
      } catch (e) { /* noop */ }
      // Clear all in-memory entry/cart state so a stale form never lingers.
      updateLines([]);
      setPartyName("");
      setPartyMobile("");
      setNotes("");
      setDiscount(0);
      setAttachmentUrl(null);
      setCartOpen(false);
      setArmedAction(null);
      onOpenChange(false);
      // Auto-navigate back to the Wholesale dashboard after every completion.
      navigate({ to: "/store-admin", search: { tab: "dashboard" } as any });

      if (action === "save") return;

      const r: any = row;
      // Only sales are supported by the 80mm by AM invoice template.
      if (kind !== "sale") {
        if (action === "share") {
          const mobile = String(r.supplier_mobile ?? "").trim();
          if (!mobile) { toast.error("Supplier mobile number not found."); return; }
          const msg = `🧾 Purchase Invoice #${r.invoice_number}\nTotal: SAR ${Number(r.total).toFixed(2)}`;
          try { window.open(whatsappLink(mobile, msg), "_blank", "noopener,noreferrer"); } catch {}
        } else {
          toast.info("Print is available for sales invoices only.");
        }
        return;
      }

      try {
        // Generate the AM80 invoice ONCE from the freshly-saved sale row.
        const { buildAm80DataFromSaleId } = await import("@/lib/invoice-am80/from-sale");
        const data = await buildAm80DataFromSaleId(r.id);
        if (!data) throw new Error("Could not build invoice data");

        if (action === "share") {
          const { shareAm80ImageToCustomer } = await import("@/lib/invoice-am80/share");
          await shareAm80ImageToCustomer(data, r.customer_mobile);
        } else if (action === "print") {
          const { printAm80 } = await import("@/lib/invoice-am80/share");
          await printAm80(data);
        }
      } catch (e: any) {
        console.error("[AM80] post-save action failed", e);
        toast.error(`Invoice ${action} failed: ${e?.message ?? e}`);
      }
    },
    onError: (e: any) => {
      traceWholesaleFlow("mutation failed", { type: kind, message: e?.message });
      setArmedAction(null);
      if (isMonthClosedError(e)) {
        setLockedOpen(true);
        return;
      }
      toast.error(e?.message ?? "Failed");
    },
  });

  // Soft validate stock for sales — never block, only warn.
  function tryComplete(action: "save" | "share" | "print") {
    if (lines.length === 0 || save.isPending) return;
    if (kind === "sale") {
      const offenders = lines
        .filter(l => typeof l.stock === "number" && (l.stock as number) - l.qty < 0)
        .map(l => ({ name: l.name, stock: l.stock as number, qty: l.qty }));
      if (offenders.length > 0) {
        setPendingLowStock({ alsoShare: action !== "save", items: offenders } as any);
        (setPendingLowStock as any).__lastAction = action;
        return;
      }
    }
    save.mutate(action);
  }

  function handlePrimaryAction(kind2: "save" | "share") {
    if (lines.length === 0) return;
    if (armedAction !== kind2) {
      setArmedAction(kind2);
      return;
    }
    tryComplete(kind2 === "share" ? "share" : "save");
  }



  const title = kind === "sale"
    ? (initial?.orderId ? "Convert order to sale" : "New sale")
    : (isEdit
        ? `Edit purchase${editingRow.data?.invoice_number ? ` #${editingRow.data.invoice_number}` : ""}`
        : "New purchase");

  const partyLabel = kind === "sale" ? "Customer" : "Supplier";
  const completeLabel = kind === "sale" ? "Complete Sale" : (isEdit ? "Update Purchase" : "Save Purchase");

  return (
    <>
    <Dialog open={open} onOpenChange={(v) => { if (!v && scannerOpenRef.current) return; onOpenChange(v); }}>
      <DialogContent
        className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-full flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[92dvh] sm:max-w-2xl sm:rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => { if (scannerOpenRef.current) e.preventDefault(); }}
        onFocusOutside={(e) => { if (scannerOpenRef.current) e.preventDefault(); }}
      >
        {/* Header */}
        <DialogHeader className="border-b border-border/60 px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base font-semibold sm:text-lg">{title}</DialogTitle>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {kind === "sale" ? "POS" : "Purchase"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Unified customer search (sale) */}
        {kind === "sale" && (
          <div className="border-b border-border/60 bg-background px-4 py-2 sm:px-5">
            <PosCustomerAutosuggest
              value={customer}
              onChange={setCustomer}
              draftName={partyName}
              onDraftNameChange={setPartyName}
              onMobileFill={(p) => setPartyMobile(p)}
              dueByCustomer={dueMap.data}
            />
          </div>
        )}

        {/* Collapsible extra details */}
        <div className="border-b border-border/60 bg-muted/30 px-4 py-2 sm:px-5">
          <button
            type="button"
            onClick={() => setDetailsOpen(v => !v)}
            className="flex w-full items-center justify-between gap-2 text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {kind === "sale" ? "Sale options" : `${partyLabel} details`}
              </p>
              <p className="truncate text-sm font-medium">
                {kind === "sale" ? (
                  <span className="text-muted-foreground/70">
                    {discount > 0 ? `Discount SAR ${discount.toFixed(2)}` : "Discount & notes"}
                    {notes && " · note added"}
                  </span>
                ) : (
                  partyName.trim() || <span className="text-muted-foreground/70">Tap to add details</span>
                )}
                {kind !== "sale" && partyMobile && <span className="ml-2 text-xs text-muted-foreground">· {partyMobile}</span>}
              </p>
            </div>
            {detailsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>

          {detailsOpen && (
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {kind !== "sale" && (
                <>
                  <Input
                    list="txn-supplier-list"
                    placeholder={`${partyLabel} name *`}
                    value={partyName}
                    onChange={(e) => {
                      const v = e.target.value;
                      setPartyName(v);
                      const match = (supplierOptions.data ?? []).find((s) => s.name === v);
                      if (match?.phone && !partyMobile) setPartyMobile(match.phone);
                    }}
                    className="h-9"
                  />
                  <datalist id="txn-supplier-list">
                    {(supplierOptions.data ?? []).map((s) => (
                      <option key={s.id} value={s.name}>{s.phone ?? ""}</option>
                    ))}
                  </datalist>
                  <Input
                    placeholder="Mobile"
                    value={partyMobile}
                    onChange={(e) => setPartyMobile(e.target.value)}
                    inputMode="tel"
                    className="h-9"
                  />
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Memo Date <span className="normal-case text-muted-foreground/70">(supplier invoice date)</span>
                    </label>
                    <Input
                      type="date"
                      value={memoDate}
                      onChange={(e) => setMemoDate(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <PurchaseAttachmentField
                      value={attachmentUrl}
                      onChange={setAttachmentUrl}
                      uploading={attachmentUploading}
                      setUploading={setAttachmentUploading}
                    />
                  </div>
                </>
              )}

              {kind === "sale" && (
                <Input
                  placeholder="Discount (SAR)"
                  type="number"
                  step="0.01"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="h-9"
                />
              )}
              <Textarea
                placeholder="Notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="sm:col-span-2"
              />
            </div>
          )}
        </div>


        {/* Search */}
        <div className="border-b border-border/60 px-4 py-2 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Search products, barcode…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl pl-9 pr-9 text-base"
                autoComplete="off"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {isSearching && !products.isLoading && filteredProducts.length === 0 && (
              <Button
                type="button"
                size="icon"
                className="h-11 w-11 flex-shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setQuickAdd({ name: trimmedSearch, price: "", cost: "", saving: false })}
                title={`Add "${trimmedSearch}" as new product`}
                aria-label="Add new product"
              >
                <Plus className="h-5 w-5" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 flex-shrink-0 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              onClick={openScanner}
              title="Scan barcode"
            >
              <ScanLine className="h-5 w-5" />
            </Button>
          </div>
          {isSearching && !products.isLoading && filteredProducts.length === 0 && (
            <p className="mt-1.5 text-[12px] text-muted-foreground">
              No Match Found —{" "}
              <button
                type="button"
                onClick={() => setQuickAdd({ name: trimmedSearch, price: "", cost: "", saving: false })}
                className="font-medium text-emerald-600 hover:underline"
              >
                Add &quot;{trimmedSearch}&quot; as new product
              </button>
            </p>
          )}
        </div>

        {/* Product list (scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-1 sm:px-5">
          {products.isLoading ? (
            <div className="space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/50" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {isSearching ? "Tap + above to create this product" : "No products found"}
              </p>
            </div>

          ) : (
            <div className={cn("space-y-1", lines.length > 0 ? "pb-16" : "pb-1")}>
              {filteredProducts.map(p => {
                const inCart = lineMap.get(p.id);
                const unitPrice = Number(kind === "sale" ? p.price : (p.purchase_price || p.price)) || 0;
                return (
                  <ProductPickRow
                    key={p.id}
                    product={p}
                    inCart={inCart}
                    unitPrice={unitPrice}
                    onAdd={() => addOrInc(p)}
                    onSetQty={(q: number) => setQty(p.id, q)}
                  />
                );
              })}
              {!isSearching && (
                <div ref={loadMoreRef} className="py-3 text-center text-xs text-muted-foreground">
                  {browse.isFetchingNextPage
                    ? "Loading more…"
                    : browse.hasNextPage
                    ? <button type="button" onClick={() => browse.fetchNextPage()} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted">Load more products</button>
                    : filteredProducts.length > PAGE_SIZE ? "All products loaded" : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compact sticky mini-cart bar — opens review drawer */}
        {lines.length > 0 ? (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex items-center justify-between gap-3 border-t border-border/60 bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.99] transition-transform sm:px-5"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-background px-1 text-[10px] font-bold text-primary">
                  {lines.length}
                </span>
              </div>
              <div className="min-w-0 text-left leading-tight">
                <p className="text-[11px] font-medium uppercase tracking-wider opacity-90">
                  {lines.length} item{lines.length !== 1 ? "s" : ""} · Qty {totalQty.toFixed(0)}
                </p>
                <p className="text-base font-bold">SAR {total.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-background/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
              Review
              <ChevronUp className="h-3.5 w-3.5" />
            </div>
          </button>
        ) : (
          <div className="border-t border-border/60 bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground sm:px-5">
            Tap a product to add it to the cart
          </div>
        )}
      </DialogContent>

      {/* Review Cart bottom drawer */}
      <Drawer open={cartOpen} onOpenChange={setCartOpen}>
        <DrawerContent className="flex h-[92dvh] max-h-[92dvh] flex-col p-0">
          {/* Sticky header */}
          <DrawerHeader className="shrink-0 border-b border-border/50 px-4 pb-2 pt-2 sm:px-5">
            <div className="flex items-center justify-between gap-2">
              <DrawerTitle className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Review cart
                <Badge variant="secondary" className="text-[10px]">
                  {lines.length} item{lines.length !== 1 ? "s" : ""}
                </Badge>
              </DrawerTitle>
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-500/10"
                >
                  Clear all
                </button>
              )}
            </div>
          </DrawerHeader>

          {/* Scrollable body: items + notes + payment */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-2 sm:px-5">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {lines.map(l => (
                  <CartItem
                    key={l.product_id}
                    line={l}
                    showCost={kind === "sale"}
                    onQty={(q) => setQty(l.product_id, q)}
                    onPrice={(v) => setPrice(l.product_id, v)}
                    onRemove={() => removeLine(l.product_id)}
                  />
                ))}
              </div>
            )}

            {lines.length > 0 && (
              <Textarea
                placeholder="Add notes (optional)"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 text-sm"
              />
            )}

            {/* Payment block (sale) — compact horizontal */}
            {kind === "sale" && lines.length > 0 && (
              <div className="mt-2 rounded-xl border border-border/50 bg-muted/20 p-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Payment</p>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setPaidStr(total.toFixed(2))} className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted">Paid full</button>
                    <button type="button" onClick={() => { setPaidStr(""); setPaymentMethod("due"); }} className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted">All due</button>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_1fr] gap-1.5">
                  <Input
                    type="number" step="0.01" inputMode="decimal"
                    placeholder="Paid (SAR)"
                    value={paidStr}
                    onChange={(e) => setPaidStr(e.target.value)}
                    className="h-9 text-sm font-semibold"
                  />
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="due">Due (credit)</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px]">
                  <span className="text-muted-foreground">Due this sale</span>
                  <span className={cn("font-bold tabular-nums", dueAmount > 0 ? "text-rose-600" : "text-emerald-600")}>SAR {dueAmount.toFixed(2)}</span>
                </div>
                {customer && (
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="truncate text-muted-foreground">{customer.name} · total after</span>
                    <span className="shrink-0 font-bold tabular-nums">SAR {(customerCurrentDue + dueAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky bottom: totals + warning + actions, safe-area aware */}
          <div
            className="shrink-0 border-t border-border/60 bg-background/95 px-3 pt-2 backdrop-blur sm:px-5"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.6rem)" }}
          >
            <div className="mb-1.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total · VAT incl.</p>
                <p className="text-xl font-bold leading-tight tracking-tight tabular-nums">SAR {total.toFixed(2)}</p>
              </div>
              <div className="text-right text-[10px] leading-tight text-muted-foreground">
                <p>{lines.length} item{lines.length !== 1 ? "s" : ""} · {totalQty.toFixed(0)} qty</p>
                <p>VAT <span className="tabular-nums">{Math.max(0, vatPortion).toFixed(2)}</span>{discount > 0 && <> · −{discount.toFixed(0)}</>}</p>
                {kind === "sale" && lines.length > 0 && estProfit !== 0 && (
                  <p className={cn("font-medium tabular-nums", estProfit >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    P/L {estProfit >= 0 ? "+" : ""}{estProfit.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {kind === "sale" && !customer && !initial?.orderId && (
              <div className="mb-1.5 flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10.5px] font-medium text-amber-700 dark:text-amber-400">
                <span>⚠</span>
                <span className="truncate">Select customer before completing sale</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="default"
                disabled={save.isPending || lines.length === 0 || (kind === "sale" && !customer && !initial?.orderId)}
                onClick={() => tryComplete("save")}
                className="h-10 gap-1 bg-gradient-to-r from-primary to-primary-glow px-2 text-sm font-semibold shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="truncate">{completeLabel}</span>
              </Button>
              <Button
                variant="outline"
                disabled={save.isPending || lines.length === 0 || (kind === "sale" && !customer && !initial?.orderId)}
                onClick={() => tryComplete("share")}
                className="h-10 gap-1 px-2 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="truncate">Save & Share</span>
              </Button>
              <Button
                variant="outline"
                disabled={save.isPending || lines.length === 0 || (kind === "sale" && !customer && !initial?.orderId)}
                onClick={() => tryComplete("print")}
                className="h-10 gap-1 px-2 text-sm"
              >
                <Printer className="h-4 w-4" />
                <span className="truncate">Save & Print</span>
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <LowStockWarningDialog
        state={pendingLowStock}
        onCancel={() => setPendingLowStock(null)}
        onConfirm={() => {
          const p = pendingLowStock;
          setPendingLowStock(null);
          if (p) {
            const act = (setPendingLowStock as any).__lastAction as "save" | "share" | "print" | undefined;
            save.mutate(act ?? (p.alsoShare ? "share" : "save"));
          }
        }}
      />
      <LockedRecordDialog open={lockedOpen} onOpenChange={setLockedOpen} mode="edit" />
    </Dialog>

    <BarcodeScanner
      open={scannerOpen}
      onOpenChange={handleScannerOpenChange}
      mode="continuous"
      title={kind === "sale" ? "Scan to add to sale" : "Scan to add to purchase"}
      lookupProduct={lookupScannedProduct}
      onProductScanned={(product, code) => handleProductScanned(product as Product, code)}
      onNotFound={(code) => { setUnknownBarcode(code); }}
      statusBadge={scannerStatus}
      cartPreview={{
        items: lines.map(l => ({ id: l.product_id, name: l.name, qty: l.qty, image_url: l.image_url })),
        onInc: (id) => setQty(id, (linesRef.current.find(l => l.product_id === id)?.qty ?? 0) + 1),
        onDec: (id) => setQty(id, (linesRef.current.find(l => l.product_id === id)?.qty ?? 0) - 1),
        onRemove: (id) => removeLine(id),
      }}
    />


    <Dialog open={!!unknownBarcode} onOpenChange={(v) => !v && setUnknownBarcode(null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Product not found</DialogTitle>
          <DialogDescription>
            No product matches barcode <b>{unknownBarcode}</b>. Would you like to create it?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setUnknownBarcode(null)}>Cancel</Button>
          <Button
            onClick={() => {
              const bc = unknownBarcode;
              setUnknownBarcode(null);
              onOpenChange(false);
              toast.info(`Open New Product and paste barcode: ${bc}`);
              navigate({ to: "/store-admin" });
            }}
          >
            Create new product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Quick Add product from no-match search (Sale / Purchase) */}
    <Dialog open={!!quickAdd} onOpenChange={(v) => !v && !quickAdd?.saving && setQuickAdd(null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" /> Add new product
          </DialogTitle>
          <DialogDescription>
            Create a product and add it to this {kind}. You can edit full details later.
          </DialogDescription>
        </DialogHeader>
        {quickAdd && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Product name *</label>
              <Input
                autoFocus
                value={quickAdd.name}
                onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {kind === "sale" ? "Sale price" : "Sale price"}
                </label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={quickAdd.price}
                  onChange={(e) => setQuickAdd({ ...quickAdd, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Purchase cost</label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={quickAdd.cost}
                  onChange={(e) => setQuickAdd({ ...quickAdd, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setQuickAdd(null)} disabled={quickAdd?.saving}>Cancel</Button>
          <Button
            disabled={!quickAdd || !quickAdd.name.trim() || quickAdd.saving}
            onClick={async () => {
              if (!quickAdd) return;
              const name = quickAdd.name.trim();
              if (!name) return;
              setQuickAdd({ ...quickAdd, saving: true });
              try {
                // Duplicate check by name (case-insensitive)
                const { data: existing } = await supabase
                  .from("shop_products")
                  .select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code")
                  .ilike("name", name)
                  .eq("is_deleted", false)
                  .limit(1);
                let product = (existing?.[0] as Product | undefined) ?? null;
                if (product) {
                  toast.info("Product already exists — added to cart");
                } else {
                  const price = Number(quickAdd.price) || 0;
                  const cost = Number(quickAdd.cost) || 0;
                  const { data, error } = await supabase
                    .from("shop_products")
                    .insert({
                      name,
                      price,
                      purchase_price: cost,
                      stock: 0,
                      tax_rate: 15,
                      is_visible: true,
                      show_stock: true,
                    } as any)
                    .select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code")
                    .single();
                  if (error) throw error;
                  product = data as Product;
                  toast.success(`Added "${name}"`);
                }
                if (product) addOrInc(product);
                setSearch("");
                setQuickAdd(null);
                qc.invalidateQueries({ queryKey: ["txn-products-browse"] });
                qc.invalidateQueries({ queryKey: ["txn-products-search"] });
                qc.invalidateQueries({ queryKey: ["admin-products"] });
              } catch (e: any) {
                toast.error(e?.message ?? "Failed to create product");
                setQuickAdd({ ...quickAdd, saving: false });
              }
            }}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {quickAdd?.saving ? "Saving…" : "Create & Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>

  );
}

function LowStockWarningDialog({
  state, onCancel, onConfirm,
}: {
  state: null | { alsoShare: boolean; items: { name: string; stock: number; qty: number }[] };
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const open = !!state;
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b border-border/60 px-5 py-4 text-left">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-[15px] font-semibold">Low stock warning</DialogTitle>
              <DialogDescription className="text-[11.5px]">
                One or more products are out of stock or below zero.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="max-h-[40vh] overflow-y-auto px-5 py-3">
          <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card">
            {(state?.items ?? []).map((it, i) => (
              <li key={`${it.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2">
                <p className="min-w-0 flex-1 truncate text-[13px] font-medium">{it.name}</p>
                <div className="shrink-0 text-right text-[11px] leading-tight">
                  <p className={cn("font-semibold tabular-nums", it.stock <= 0 ? "text-rose-600" : "text-amber-600")}>
                    Stock: {it.stock}
                  </p>
                  <p className="text-muted-foreground tabular-nums">Selling: {it.qty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 sm:flex-row">
          <Button variant="outline" onClick={onCancel} className="h-10">Cancel sale</Button>
          <Button
            onClick={onConfirm}
            className="h-10 bg-amber-500 text-white hover:bg-amber-600"
          >
            Continue anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function CartItem({
  line, showCost, onQty, onPrice, onRemove,
}: {
  line: Line;
  showCost: boolean;
  onQty: (q: number) => void;
  onPrice: (v: number) => void;
  onRemove: () => void;
}) {
  const amount = line.qty * line.price;
  const profit = showCost ? (line.price - (line.cost ?? 0)) * line.qty : 0;
  return (
    <div className="rounded-xl border border-primary/30 bg-card shadow-sm">
      <div className="flex items-start gap-2 p-2">
        <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {line.image_url ? (
            <img src={line.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <Package className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{line.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px]">
            {showCost && line.cost ? (
              <span className="text-muted-foreground">Buy {line.cost.toFixed(1)}</span>
            ) : null}
            {showCost && line.cost ? (
              <span className={cn("font-medium", profit >= 0 ? "text-emerald-600" : "text-rose-600")}>
                · {profit >= 0 ? "+" : ""}{profit.toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold leading-none">{amount.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">SAR</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="-mr-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 active:scale-95"
          aria-label="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2 border-t border-border/40 bg-muted/20 px-2 py-1.5">
        <div className="flex items-center rounded-lg border border-border bg-background">
          <button
            type="button"
            onClick={() => onQty(Math.max(0, line.qty - 1))}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground active:scale-95"
            aria-label="Decrease"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <Input
            type="number"
            inputMode="decimal"
            value={line.qty || ""}
            placeholder="0"
            onChange={(e) => onQty(Math.max(0, Number(e.target.value) || 0))}
            className="h-8 w-12 border-0 px-0 text-center text-sm font-semibold focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => onQty(line.qty + 1)}
            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground active:scale-95"
            aria-label="Increase"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex flex-1 items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">SAR</span>
          <Input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={line.price || ""}
            placeholder="0.00"
            onChange={(e) => onPrice(Number(e.target.value) || 0)}
            className="h-8 flex-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

const ProductPickRow = memo(function ProductPickRow({
  product, inCart, unitPrice, onAdd, onSetQty,
}: {
  product: Product;
  inCart: Line | undefined;
  unitPrice: number;
  onAdd: () => void;
  onSetQty: (qty: number) => void;
}) {
  const active = !!inCart;
  const currentQty = inCart?.qty ?? 0;
  const [editing, setEditing] = useState(false);

  function commit(raw: string) {
    const n = Math.max(0, Math.floor(Number(raw) || 0));
    if (n !== currentQty) onSetQty(n);
    setEditing(false);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => { if (!editing) onAdd(); }}
      onKeyDown={(e) => { if (!editing && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onAdd(); } }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-xl border p-2 text-left transition-all touch-manipulation active:scale-[0.99] select-none",
        active
          ? "border-primary/50 bg-primary/[0.04]"
          : "border-border/60 bg-card hover:border-border",
      )}
    >
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <Package className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
          <span className="font-semibold text-foreground">SAR {unitPrice.toFixed(2)}</span>
          {product.purchase_price && product.purchase_price > 1 && (
            <span className="text-muted-foreground/70">· Buy {product.purchase_price.toFixed(0)}</span>
          )}
          <span className={cn("text-muted-foreground", product.stock <= 0 && "text-rose-600")}>
            · Stock {product.stock}
          </span>
        </div>
      </div>
      {active ? (
        editing ? (
          <input
            key={`edit-${currentQty}`}
            autoFocus
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            defaultValue={currentQty || ""}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") { e.preventDefault(); commit((e.target as HTMLInputElement).value); }
              if (e.key === "Escape") { e.preventDefault(); setEditing(false); }
            }}
            onBlur={(e) => commit(e.currentTarget.value)}
            className="h-9 w-16 rounded-full bg-primary px-2 text-center text-xs font-bold text-primary-foreground shadow-sm outline-none ring-2 ring-primary/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex h-9 min-w-12 items-center justify-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110"
            aria-label="Edit quantity"
          >
            {currentQty}
          </button>
        )
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Plus className="h-4 w-4" />
        </div>
      )}
    </div>
  );
});

function PurchaseAttachmentField({
  value, onChange, uploading, setUploading,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { uploadProductImage } = await import("@/lib/image-upload");
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Attachment uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-2">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Attachment (optional)
      </p>
      {value ? (
        <div className="flex items-center gap-2">
          <img src={value} alt="Attachment" loading="lazy" className="h-12 w-12 rounded-md object-cover" />
          <p className="flex-1 truncate text-xs text-muted-foreground">Invoice photo attached</p>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-rose-600"
            aria-label="Remove attachment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          <Button
            type="button" size="sm" variant="outline" className="flex-1 h-8 text-xs"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Add invoice photo"}
          </Button>
        </div>
      )}
    </div>
  );
}
