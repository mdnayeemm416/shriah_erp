import { useHighlightRecord } from "@/hooks/use-highlight-record";
import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { sortShops, isSimpleShop } from "@/lib/shop-order";
import { useShopPositions, assertShopPositionMatch } from "@/hooks/use-shop-positions";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { SARAmount } from "@/components/sar-amount";
import {
  Store, ShoppingCart, Package, Banknote, Save, Trash2, Pencil,
  Maximize2, X, FileText, ScanLine, Sparkles, Loader2, AlertTriangle,
  CheckCircle2, Eye, Camera, Upload, Info, FileSpreadsheet, Plus,
  ChevronRight, TrendingUp, TrendingDown, Wallet, MoreVertical, MoreHorizontal,
  FileDown, ImageDown, Share2, BarChart3, RefreshCw,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ShopImportDialog } from "@/components/shop-import-dialog";
import { toast } from "sonner";
import { useWorkingDate } from "@/hooks/use-working-date";
import { cn } from "@/lib/utils";
import { useSignedAttachmentUrl } from "@/lib/attachment-url";
import { scanDocument } from "@/lib/ai-scan.functions";
import { scanDocumentCached } from "@/lib/ocr-cache";
import { EditHistoryButton } from "@/components/edit-history";
import { shareToWhatsApp } from "@/lib/whatsapp-share";
import { SAR } from "@/lib/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  buildShopReportImage, printShopReportPDF, downloadShopReportExcel,
  downloadShopReportImage, shareShopReportWhatsApp, totalsOf,
  type ShopReportInput, type ShopReportRow,
} from "@/components/shop-report-share";
import { InfoButton } from "@/components/info-button";
import { CashierManager } from "@/components/cashier-manager";
import { CategoryManager } from "@/components/category-manager";
import { ShopsManager as ShopsManagerInline } from "@/components/shops-manager";
import { sendAuditEmail } from "@/lib/audit-email";

const SHOP_KIND_MODULE = {
  sale: "Shop Sale",
  purchase: "Shop Purchase",
  expense: "Shop Expense",
  withdraw: "Shop Withdraw",
} as const;
function shopEntryAmount(e: any): number {
  const k = e?.entry_type;
  if (k === "sale") return (+e.pos_sale || 0) + (+e.cash_sale || 0) + (+e.bank_sale || 0) + (+e.credit_sale || 0);
  if (k === "purchase") return +e.purchase_amount || 0;
  if (k === "expense") return +e.expense_amount || 0;
  if (k === "withdraw") return +e.withdraw_amount || 0;
  return 0;
}
import { WithdrawSlipScan } from "@/components/withdraw-slip-scan";
import { DuplicateWarningDialog, type DuplicateWarningKind } from "@/components/duplicate-warning-dialog";
import { useUserAccess } from "@/hooks/use-user-access";

export const Route = createFileRoute("/_app/shop")({
  validateSearch: (s: Record<string, unknown>) => ({
    edit: typeof s.edit === "string" ? s.edit : undefined,
    detail: typeof s.detail === "string" ? s.detail : undefined,
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
    shop: typeof s.shop === "string" ? s.shop : undefined,
  }),
  component: ShopPage,
});

type EntryKind = "sale" | "purchase" | "expense" | "withdraw";
type Shop = { id: string; name: string; shop_type?: "full_erp" | "simple_cash" | null };
type Cashier = { id: string; name: string; shop_id: string };
type ShopCardSummary = {
  shop: Shop;
  simple: boolean;
  balance: number;
  primary: number;
  secondary: number;
  cashPosition: number;
  expectedBank: number;
  cashTot: number;
  bankTot: number;
  withdrawTot: number;
  purchaseTot: number;
  expenseTot: number;
  lastDate: string | null;
};
type OcrResult = {
  date?: string | null;
  cash_buy_total?: number | null;
  due_buy_total?: number | null;
  cost?: number | null;
  grand_total?: number | null;
  rows?: { description: string; amount: number; confidence?: "low" | "medium" | "high" }[];
  raw_text?: string;
  confidence?: "low" | "medium" | "high";
  field_confidence?: {
    totals?: "low" | "medium" | "high";
    rows?: "low" | "medium" | "high";
    date?: "low" | "medium" | "high";
  };
  notes?: string | null;
};

// Sum of detected line items (ignoring NaN/null)
function sumRows(rows?: OcrResult["rows"]): number | null {
  if (!rows || rows.length === 0) return null;
  const s = rows.reduce((a, r) => a + (Number.isFinite(Number(r.amount)) ? Number(r.amount) : 0), 0);
  return Math.round(s * 100) / 100;
}

const DRAFT_KEY = "shop_entry_draft_v1";
const LAST_SHOP_KEY = "shop_last_shop_v1";

function ShopPage() {
  useHighlightRecord();
  const { user } = useAuth();
  const { isAdmin } = useUserAccess();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const runScan = useServerFn(scanDocument);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [detail, setDetail] = useState<any | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [scanViewer, setScanViewer] = useState<{ scanId?: string; live?: OcrResult & { file_url?: string | null } } | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  // Filters for Per-Shop Summary & Recent Entries
  type DateRangeKind = "today" | "yesterday" | "week" | "month" | "custom";
  const [dateRange, setDateRange] = useState<DateRangeKind>("month");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [shopFilter, setShopFilter] = useState<string>("all"); // "all" | shop.id
  type EntryTypeFilter = "all" | "pos_sale" | "cash_sale" | "bank_sale" | "credit_sale" | "purchase" | "expense" | "withdraw" | "difference";
  const [activeFilters, setActiveFilters] = useState<Exclude<EntryTypeFilter, "all">[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportImageUrl, setReportImageUrl] = useState<string | null>(null);
  const [workspaceTool, setWorkspaceTool] = useState<"shops" | "cashiers" | "categories" | null>(null);

  useEffect(() => {
    if (!search.highlight) return;
    if (search.date) {
      setDateRange("custom");
      setCustomFrom(search.date);
      setCustomTo(search.date);
    }
    if (search.shop) setShopFilter(search.shop);
  }, [search.highlight, search.date, search.shop]);


  const { data: shops = [] } = useQuery<Shop[]>({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      return sortShops((data ?? []) as Shop[]);
    },
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: cashiers = [] } = useQuery<Cashier[]>({
    queryKey: ["cashiers", "all"],
    queryFn: async () => ((await (supabase as any).from("cashiers").select("*").eq("is_deleted", false).order("name")).data ?? []) as Cashier[],
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: entries = [] } = useQuery<any[]>({
    queryKey: ["shop_entries"],
    queryFn: async () =>
      (((await (supabase as any).from("shop_entries").select("*").eq("is_deleted", false).order("txn_date", { ascending: false }).order("created_at", { ascending: false })).data) ?? []) as any[],
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Manual refresh — re-fetches summary cards + recent entries together.
  const refreshShopData = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["shops"] });
    qc.invalidateQueries({ queryKey: ["cashiers", "all"] });
    qc.invalidateQueries({ queryKey: ["shop_entries"] });
    qc.invalidateQueries({ queryKey: ["shop_entries", "all"] });
  }, [qc]);

  // ----- Form state with draft -----
  const { workingDate } = useWorkingDate();
  const today = workingDate;
  const [kind, setKind] = useState<EntryKind>("sale");
  const [date, setDate] = useState(today);
  const [shopId, setShopId] = useState<string>("");
  const [cashierId, setCashierId] = useState<string>("");
  const [pos, setPos] = useState("");
  const [cashSale, setCashSale] = useState("");
  const [bankSale, setBankSale] = useState("");
  const [creditSale, setCreditSale] = useState("");
  const [dueReceivable, setDueReceivable] = useState("");
  const [purchaseAmt, setPurchaseAmt] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [notes, setNotes] = useState("");
  const [notesError, setNotesError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Duplicate warning state
  const [warning, setWarning] = useState<{
    kind: DuplicateWarningKind;
    existing: { id: string; label: string } | null;
    details?: { date?: string; shop?: string; cashier?: string; amount?: string; entryType?: string };
  } | null>(null);

  // OCR purchase state
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrFilePreview, setOcrFilePreview] = useState<string | null>(null);
  const [ocrOriginalAmount, setOcrOriginalAmount] = useState<number | null>(null);
  const [ocrLinkedScanId, setOcrLinkedScanId] = useState<string | null>(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrMismatchAck, setOcrMismatchAck] = useState(false);
  const ocrCamRef = useRef<HTMLInputElement>(null);
  const ocrImgRef = useRef<HTMLInputElement>(null);
  const ocrPdfRef = useRef<HTMLInputElement>(null);

  // Load draft + remember last shop
  useEffect(() => {
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
    } catch {/* noop */}
  }, []);

  // Deep-link: ?edit=<entryId> opens entry in edit mode
  useEffect(() => {
    if (!search.edit || entries.length === 0) return;
    const target = entries.find((e) => e.id === search.edit);
    if (target) {
      loadEditing(target);
      navigate({ search: {} as any, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.edit, entries]);

  // Deep-link: ?detail=<entryId> opens entry in the detail dialog
  useEffect(() => {
    if (!search.detail || entries.length === 0) return;
    const target = entries.find((e) => e.id === search.detail);
    if (target) {
      setDetail(target);
      navigate({ search: {} as any, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.detail, entries]);

  // Auto-save draft
  useEffect(() => {
    if (editing) return;
    const draft = { kind, date, shopId, cashierId, pos, cashSale, bankSale, creditSale, purchaseAmt, expenseAmt, withdrawAmt, notes };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch {/* noop */}
  }, [editing, kind, date, shopId, cashierId, pos, cashSale, bankSale, creditSale, purchaseAmt, expenseAmt, withdrawAmt, notes]);

  // Default shop selection
  useEffect(() => {
    if (!shopId && shops.length > 0) setShopId(shops[0].id);
  }, [shops, shopId]);

  const filteredCashiers = useMemo(
    () => cashiers.filter((c) => c.shop_id === shopId),
    [cashiers, shopId],
  );
  useEffect(() => {
    if (cashierId && !filteredCashiers.some((c) => c.id === cashierId)) setCashierId("");
  }, [filteredCashiers, cashierId]);

  // Shop type awareness — Simple Cash shops use a stripped-down workflow.
  const currentShop = shops.find((s) => s.id === shopId) ?? null;
  const simpleMode = isSimpleShop(currentShop);
  // Force kind into the simple-shop allowed set whenever the user switches shop
  useEffect(() => {
    if (simpleMode && kind !== "sale" && kind !== "expense") setKind("sale");
  }, [simpleMode, kind]);

  const num = (s: string) => Number(s) || 0;
  // Total Sale = Cash Sale + Bank Sale + Credit Sale − Due Receivable
  const totalSale = num(cashSale) + num(bankSale) + num(creditSale) - num(dueReceivable);
  // Plus/Minus = Total Sale − POS Sale
  const difference = totalSale - num(pos);

  const resetForm = (keepShop = true) => {
    setEditing(null);
    setKind("sale");
    setDate(today);
    if (!keepShop) setShopId("");
    setCashierId("");
    setPos(""); setCashSale(""); setBankSale(""); setCreditSale(""); setDueReceivable("");
    setPurchaseAmt(""); setExpenseAmt(""); setWithdrawAmt("");
    setNotes(""); setFile(null); setAttachmentUrl(null);
    resetOcr();
    try { localStorage.removeItem(DRAFT_KEY); } catch {/* noop */}
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

  const loadEditing = (e: any) => {
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
    // Reset OCR state - existing OCR data stays in DB and is shown via badge
    resetOcr();
    setOcrLinkedScanId(e.ocr_scan_id ?? null);
    setOcrOriginalAmount(e.ocr_original_amount ?? null);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fileToDataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });

  const handleOcrFile = async (f: File) => {
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
      const dataUrl = await fileToDataUrl(f);
      const r = (await scanDocumentCached({ imageDataUrl: dataUrl, mimeType: f.type })) as OcrResult;
      setOcrResult(r);

      // Priority: calculated line-item sum > OCR detected total > nothing
      const detected = r.grand_total ?? r.cash_buy_total ?? r.due_buy_total ?? null;
      const calc = sumRows(r.rows);
      const lowConf = r.confidence === "low" || r.field_confidence?.totals === "low";
      const diff = detected != null && calc != null ? Math.abs(calc - detected) : 0;
      // Prefer calculated sum if it disagrees with OCR or OCR confidence is low
      const preferCalc = calc != null && (detected == null || lowConf || diff > 1);
      const chosen = preferCalc ? calc : detected;

      if (chosen != null) {
        setPurchaseAmt(String(chosen));
        // Track what OCR originally read so the comparison card stays meaningful
        setOcrOriginalAmount(detected != null ? Number(detected) : Number(chosen));
      }
      if (r.date) setDate(r.date);
      toast.success(
        preferCalc && detected != null
          ? `Used calculated sum (SAR ${calc}) — OCR total differed by ${diff}`
          : "Scan complete — fields auto-filled",
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Scan failed");
      setOcrResult(null);
    } finally {
      setOcrScanning(false);
    }
  };

  const logWarning = useCallback(async (params: {
    warningType: "Hard Warning" | "Soft Warning" | "Admin Override";
    actionTaken: string;
    existingEntryId?: string | null;
    amount?: number | null;
  }) => {
    if (!user) return;
    const shop = shops.find((s) => s.id === shopId);
    try {
      await (supabase as any).from("entry_warning_log").insert({
        user_id: user.id,
        user_name: (user as any).user_metadata?.full_name ?? user.email ?? null,
        shop_id: shopId || null,
        shop_name: shop?.name ?? null,
        transaction_type: kind,
        warning_type: params.warningType,
        action_taken: params.actionTaken,
        existing_entry_id: params.existingEntryId ?? null,
        txn_date: date,
        cashier_id: cashierId || null,
        amount: params.amount ?? null,
        meta: { editing_id: editing?.id ?? null },
      });
    } catch {/* non-blocking */}
  }, [user, shops, shopId, kind, date, cashierId, editing]);

  const findDuplicate = useCallback((): {
    kind: DuplicateWarningKind;
    existing: { id: string; label: string };
    details: { date?: string; shop?: string; cashier?: string; amount?: string; entryType?: string };
  } | null => {
    if (!shopId) return null;
    const excludeId = editing?.id;
    const shopName = shops.find((s) => s.id === shopId)?.name ?? "—";

    if (kind === "sale") {
      if (!cashierId) return null;
      const hit = entries.find((e) =>
        e.id !== excludeId &&
        !e.is_deleted &&
        e.shop_id === shopId &&
        e.txn_date === date &&
        e.cashier_id === cashierId &&
        e.entry_type === "sale",
      );
      if (hit) {
        const cName = cashiers.find((c) => c.id === cashierId)?.name ?? "—";
        const amt = Number(hit.cash_sale || 0) + Number(hit.bank_sale || 0)
          + Number(hit.credit_sale || 0) + Number(hit.pos_sale || 0);
        return {
          kind: "hard",
          existing: { id: hit.id, label: `Sale · ${cName} · ${date}` },
          details: { entryType: "Sale", date, shop: shopName, cashier: cName, amount: SAR(amt) },
        };
      }
    }

    if (kind === "purchase") {
      // Rule: one purchase per Shop + Date (cashier ignored)
      const hit = entries.find((e) =>
        e.id !== excludeId &&
        !e.is_deleted &&
        e.shop_id === shopId &&
        e.txn_date === date &&
        e.entry_type === "purchase",
      );
      if (hit) {
        const cName = hit.cashier_id
          ? (cashiers.find((c) => c.id === hit.cashier_id)?.name ?? undefined)
          : undefined;
        const amt = Number(hit.purchase_amount || 0);
        return {
          kind: "hard",
          existing: { id: hit.id, label: `Purchase · ${shopName} · ${date}` },
          details: { entryType: "Purchase", date, shop: shopName, cashier: cName, amount: SAR(amt) },
        };
      }
    }

    if (kind === "withdraw") {
      const amount = num(withdrawAmt);
      if (amount <= 0) return null;
      const hit = entries.find((e) =>
        e.id !== excludeId &&
        !e.is_deleted &&
        e.entry_type === "withdraw" &&
        e.txn_date === date &&
        Number(e.withdraw_amount ?? 0) === amount,
      );
      if (hit) {
        return {
          kind: "soft",
          existing: { id: hit.id, label: `Withdraw · ${SAR(amount)} · ${date}` },
          details: { entryType: "Withdraw", date, shop: shopName, amount: SAR(amount) },
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
      if (up.error) { setBusy(false); return toast.error(up.error.message); }
      url = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
    }

    // If purchase and we have a live OCR scan not yet persisted, save it to ai_scans
    let scanId = ocrLinkedScanId;
    if (kind === "purchase" && ocrResult && !scanId) {
      let scanFileUrl: string | null = null;
      if (ocrFile) {
        const ext = ocrFile.name.split(".").pop();
        const path = `${user.id}/ai-scan/${Date.now()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, ocrFile);
        if (!up.error) {
          scanFileUrl = supabase.storage.from("attachments").getPublicUrl(path).data.publicUrl;
        }
      }
      const ins = await (supabase as any).from("ai_scans").insert({
        file_url: scanFileUrl,
        file_type: ocrFile?.type ?? null,
        raw_text: ocrResult.raw_text ?? null,
        extracted: ocrResult,
        status: "shop",
      }).select("id").single();
      if (!ins.error) scanId = ins.data?.id ?? null;
    }

    const payload: any = {
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
      ocr_confidence: kind === "purchase" ? (ocrResult?.confidence ?? null) : null,
    };

    const res = editing
      ? await (supabase as any).from("shop_entries").update(payload).eq("id", editing.id).select().single()
      : await (supabase as any).from("shop_entries").insert({ ...payload, created_by: user.id }).select().single();

    setBusy(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Updated" : "Saved");
    try { localStorage.setItem(LAST_SHOP_KEY, shopId); } catch {/* noop */}
    const saved = res.data;
    if (saved) {
      const apply = (old: any[] = []) => {
        if (editing) return old.map((e) => (e.id === saved.id ? { ...e, ...saved } : e));
        return [saved, ...old];
      };
      qc.setQueryData<any[]>(["shop_entries"], apply);
      qc.setQueryData<any[]>(["shop_entries", "all"], apply);
    }
    resetForm(true);
    setFormOpen(false);

    // Fire-and-forget audit email (never blocks the transaction)
    try {
      const shopName = shops.find((s) => s.id === shopId)?.name || null;
      sendAuditEmail({
        action: editing ? "edited" : "created",
        module: SHOP_KIND_MODULE[kind as keyof typeof SHOP_KIND_MODULE] || "Other",
        shopName,
        userName: user?.email || null,
        userEmail: user?.email || null,
        recordId: saved?.id ?? editing?.id ?? null,
        oldValues: editing ? editing : null,
        newValues: saved,
        notes: notes || null,
        amount: shopEntryAmount(saved || payload),
      });
    } catch (e) { /* noop */ }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Not signed in");
    if (!shopId) return toast.error("Select a shop");

    if (kind === "sale" && num(pos) + num(cashSale) + num(bankSale) + num(creditSale) <= 0)
      return toast.error("Enter sale amounts");
    if (kind === "purchase" && num(purchaseAmt) <= 0)
      return toast.error("Enter purchase amount");
    if (kind === "expense" && num(expenseAmt) <= 0)
      return toast.error("Enter expense amount");
    if (kind === "withdraw" && num(withdrawAmt) <= 0)
      return toast.error("Enter withdraw amount");

    // Notes required for purchase, expense, and withdraw
    if ((kind === "purchase" || kind === "expense" || kind === "withdraw") && !notes.trim()) {
      setNotesError("Notes is required.");
      return toast.error("Notes is required.");
    }


    // OCR mismatch confirmation gate
    if (kind === "purchase" && ocrResult) {
      const calc = sumRows(ocrResult.rows);
      const ocrTotal = ocrOriginalAmount;
      if (calc != null && ocrTotal != null && Math.abs(calc - ocrTotal) > 1 && !ocrMismatchAck) {
        return toast.error("OCR total doesn't match line-item sum — review and confirm the comparison card.");
      }
    }

    // Duplicate detection — blocks save (hard) or asks for confirmation (soft).
    const dup = findDuplicate();
    if (dup) {
      const amount = kind === "withdraw"
        ? num(withdrawAmt)
        : kind === "sale" ? num(pos) + num(cashSale) + num(bankSale) + num(creditSale)
        : kind === "purchase" ? num(purchaseAmt) : 0;
      void logWarning({
        warningType: dup.kind === "hard" ? "Hard Warning" : "Soft Warning",
        actionTaken: "Shown",
        existingEntryId: dup.existing.id,
        amount,
      });
      setWarning(dup);
      return;
    }

    await performSave();
  };

  const remove = async (id: string) => {
    if (!(await confirm({ title: "Move entry to Recycle Bin?", description: "Linked transactions will be reversed. You can restore this from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const existing = (qc.getQueryData<any[]>(["shop_entries"]) || qc.getQueryData<any[]>(["shop_entries", "all"]) || []).find((e: any) => e.id === id);
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("shop_entries", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      const apply = (old: any[] = []) => old.filter((e) => e.id !== id);
      qc.setQueryData<any[]>(["shop_entries"], apply);
      qc.setQueryData<any[]>(["shop_entries", "all"], apply);
      setDetail(null);
      try {
        const k = existing?.entry_type;
        sendAuditEmail({
          action: "deleted",
          module: SHOP_KIND_MODULE[k as keyof typeof SHOP_KIND_MODULE] || "Other",
          shopName: shops.find((s) => s.id === existing?.shop_id)?.name || null,
          userName: user?.email || null,
          userEmail: user?.email || null,
          recordId: id,
          oldValues: existing || { id },
          notes: existing?.notes || null,
          amount: existing ? shopEntryAmount(existing) : null,
        });
      } catch (e) { /* noop */ }
    }
  };

  // ----- Date range computation (anchored to the global workingDate) -----
  const dateRangeBounds = useMemo(() => {
    const [yy, mm, dd] = workingDate.split("-").map(Number);
    const anchor = new Date(yy, (mm || 1) - 1, dd || 1);
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const d = anchor.getDate();
    const fmt = (dt: Date) => {
      const a = dt.getFullYear();
      const b = String(dt.getMonth() + 1).padStart(2, "0");
      const c = String(dt.getDate()).padStart(2, "0");
      return `${a}-${b}-${c}`;
    };
    if (dateRange === "today") {
      const s = fmt(new Date(y, m, d));
      return { from: s, to: s };
    }
    if (dateRange === "yesterday") {
      const s = fmt(new Date(y, m, d - 1));
      return { from: s, to: s };
    }
    if (dateRange === "week") {
      const start = new Date(y, m, d - 6);
      return { from: fmt(start), to: fmt(new Date(y, m, d)) };
    }
    if (dateRange === "month") {
      // Selected-date month: 1st of that month → selected date
      const start = new Date(y, m, 1);
      return { from: fmt(start), to: fmt(new Date(y, m, d)) };
    }
    return { from: customFrom || "", to: customTo || "" };
  }, [dateRange, customFrom, customTo, workingDate]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        if (shopFilter !== "all" && e.shop_id !== shopFilter) return false;
        const { from, to } = dateRangeBounds;
        if (from && e.txn_date < from) return false;
        if (to && e.txn_date > to) return false;
        if (activeFilters.length === 0) return true;
        return activeFilters.some((f) => {
          switch (f) {
            case "pos_sale": return e.entry_type === "sale" && Number(e.pos_sale) > 0;
            case "cash_sale": return e.entry_type === "sale" && Number(e.cash_sale) > 0;
            case "bank_sale": return e.entry_type === "sale" && Number(e.bank_sale) > 0;
            case "credit_sale": return e.entry_type === "sale" && Number(e.credit_sale) > 0;
            case "difference": return e.entry_type === "sale" && Number(e.difference) !== 0;
            case "purchase": return e.entry_type === "purchase";
            case "expense": return e.entry_type === "expense";
            case "withdraw": return e.entry_type === "withdraw";
            default: return true;
          }
        });
      })
      .sort((a, b) => {
        if (a.txn_date !== b.txn_date) return b.txn_date.localeCompare(a.txn_date);
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      });
  }, [entries, shopFilter, dateRangeBounds, activeFilters]);

  const filterTotal = useMemo<{ label: string; value: number; tone: "default" | "success" | "danger" | "info" | "warning" }>(() => {
    const sumField = (field: string) =>
      filteredEntries.reduce((s, e) => s + (Number(e[field]) || 0), 0);
    if (activeFilters.length === 0) {
      const cash = sumField("cash_sale"), bank = sumField("bank_sale"), credit = sumField("credit_sale");
      const wd = sumField("withdraw_amount"), pu = sumField("purchase_amount"), ex = sumField("expense_amount");
      const v = cash + bank + credit + wd - pu - ex;
      return { label: "Net Total (All Entries)", value: v, tone: v < 0 ? "danger" : "success" };
    }
    const parts: string[] = [];
    let value = 0;
    let tone: "default" | "success" | "danger" | "info" | "warning" = "default";
    for (const f of activeFilters) {
      switch (f) {
        case "pos_sale": parts.push("POS Sale"); value += sumField("pos_sale"); tone = "default"; break;
        case "cash_sale": parts.push("Cash Sale"); value += sumField("cash_sale"); tone = "success"; break;
        case "bank_sale": parts.push("Bank Sale"); value += sumField("bank_sale"); tone = "info"; break;
        case "credit_sale": parts.push("Credit Sale"); value += sumField("credit_sale"); tone = "warning"; break;
        case "purchase": parts.push("Purchase"); value += sumField("purchase_amount"); tone = "warning"; break;
        case "expense": parts.push("Expense"); value += sumField("expense_amount"); tone = "danger"; break;
        case "withdraw": parts.push("Withdraw"); value += sumField("withdraw_amount"); tone = "info"; break;
        case "difference": {
          const v = sumField("difference");
          parts.push("Plus / Minus");
          value += v;
          tone = v < 0 ? "danger" : "success";
          break;
        }
      }
    }
    return { label: `${parts.join(" + ")} Total`, value, tone };
  }, [filteredEntries, activeFilters]);

  const dateRangeLabel = useMemo(() => {
    if (dateRange === "today") return "Today";
    if (dateRange === "yesterday") return "Yesterday";
    if (dateRange === "week") return "Last 7 Days";
    if (dateRange === "month") return "This Month";
    const { from, to } = dateRangeBounds;
    if (from && to) return `${from} → ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return "Custom";
  }, [dateRange, dateRangeBounds]);

  const perShop = useMemo(() => {
    const map = new Map<string, any>();
    // Seed with shops in custom order so empty shops still show when "all"
    const seedShops = shopFilter === "all" ? shops : shops.filter((s) => s.id === shopFilter);
    for (const s of seedShops) {
      map.set(s.id, {
        shop_id: s.id, shop_name: s.name, simple: isSimpleShop(s),
        sale: 0, purchase: 0, cash: 0, bank: 0, credit: 0, diff: 0, withdraw: 0,
        cashIn: 0, expense: 0,
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
          sale: 0, purchase: 0, cash: 0, bank: 0, credit: 0, diff: 0, withdraw: 0,
          cashIn: 0, expense: 0,
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
      // Simple-shop figures: cash_sale represents Cash In; expense_amount represents Expense
      if (e.entry_type === "sale") row.cashIn += Number(e.cash_sale) || 0;
      if (e.entry_type === "expense") row.expense += Number(e.expense_amount) || 0;
    }
    return Array.from(map.values());
  }, [filteredEntries, shops, shopFilter]);

  const { byId: masterPositions, totalsById: masterTotals } = useShopPositions(dateRangeBounds);

  const shopCardSummaries = useMemo<ShopCardSummary[]>(() => {
    const { from, to } = dateRangeBounds;
    const byShop = new Map<string, any[]>();
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
      let lastDate: string | null = null;
      // Period-bound totals — these are the SAME numbers shown on the card,
      // in the InfoButton, and used to compute Cash Position. Single source.
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
      // Cash Position = (Cash Sale + Bank Withdraw) − (Purchase + Expense)
      // Read from the deduped shared Shop Position engine so no previous/opening/carry-forward value is added.
      const cashPosition = simple
        ? (masterTotalsForShop?.position ?? (primary - secondary))
        : (masterPositions.get(shop.id) ?? ((cashTot + withdrawTot) - (purchaseTot + expenseTot)));
      // Cross-check against master all-time value (warns if drift detected).
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
        lastDate,
      };
    });
  }, [entries, shops, dateRangeBounds, masterPositions, masterTotals]);

  // Lightweight pagination — default 20, +20 per "Load More" click.
  // Reset whenever the filtered result set changes (shop, dates, type pills).
  const [visibleCount, setVisibleCount] = useState(20);
  useEffect(() => { setVisibleCount(20); }, [shopFilter, dateRangeBounds.from, dateRangeBounds.to, activeFilters]);
  const visibleEntries = useMemo(() => filteredEntries.slice(0, visibleCount), [filteredEntries, visibleCount]);
  const shopNamesById = useMemo(() => new Map(shops.map((s) => [s.id, s.name])), [shops]);
  const openDetail = useCallback((entry: any) => {
    setFormOpen(false);
    setScanViewer(null);
    setDetail(entry);
  }, []);
  const openScanViewer = useCallback((scanId: string) => {
    setDetail(null);
    setScanViewer({ scanId });
  }, []);

  // Build the share-ready Shop Report payload from current filters & perShop data.
  const buildReportInput = (): ShopReportInput => {
    const rows: ShopReportRow[] = perShop.map((r: any) => {
      const totalSale = (Number(r.sale) || 0) + (Number(r.cash) || 0) + (Number(r.bank) || 0) + (Number(r.credit) || 0);
      return {
        shop_id: r.shop_id,
        shop_name: r.shop_name,
        simple: !!r.simple,
        pos: Number(r.sale) || 0,
        cash: Number(r.cash) || 0,
        bank: Number(r.bank) || 0,
        credit: Number(r.credit) || 0,
        totalSale,
        purchase: Number(r.purchase) || 0,
        expense: Number(r.expense) || 0,
        withdraw: Number(r.withdraw) || 0,
        diff: Number(r.diff) || 0,
      };
    });
    const scopeLabel = shopFilter === "all"
      ? "All Shops"
      : (shops.find((s) => s.id === shopFilter)?.name ?? "Shop");
    return {
      title: `${scopeLabel} · ${dateRangeLabel}`,
      rangeLabel: dateRangeLabel,
      scopeLabel,
      rows,
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

  useEffect(() => {
    return () => { if (reportImageUrl) URL.revokeObjectURL(reportImageUrl); };
  }, [reportImageUrl]);


  return (
    <div className="space-y-5 pb-32">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
          <Store className="h-3.5 w-3.5 text-primary" />
          <span>Shops</span>
          <span className="text-foreground/80">· {shops.length}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Shop actions"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-foreground shadow-sm transition-all hover:bg-muted/60 active:scale-95"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 rounded-2xl border-border/60 bg-background p-1.5 shadow-md"
          >
            <DropdownMenuItem
              onClick={() => setFormOpen(true)}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <Plus className="h-4 w-4 text-primary" /> New Entry
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Shop Tools
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setWorkspaceTool("shops")}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <Store className="h-4 w-4 text-muted-foreground" /> Manage Shops
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setWorkspaceTool("cashiers")}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <Wallet className="h-4 w-4 text-muted-foreground" /> Cashiers
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setWorkspaceTool("categories")}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <Package className="h-4 w-4 text-muted-foreground" /> Categories
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => setImportOpen(true)}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" /> Import Sales
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openReport}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <BarChart3 className="h-4 w-4 text-muted-foreground" /> Generate Report
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => downloadShopReportExcel(buildReportInput())}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <FileDown className="h-4 w-4 text-muted-foreground" /> Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => printShopReportPDF(buildReportInput())}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <FileText className="h-4 w-4 text-muted-foreground" /> Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const r = await shareShopReportWhatsApp(buildReportInput());
                if (r.kind === "fallback-link") toast.success("WhatsApp opened — image saved separately if needed");
              }}
              className="cursor-pointer rounded-xl px-3 py-2.5 text-sm"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" /> Share Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workspace tools sheet */}
      <Sheet open={workspaceTool !== null} onOpenChange={(o) => !o && setWorkspaceTool(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl border-t border-border/60 p-0">
          <div className="border-b border-border/40 bg-background px-5 py-4">
            <p className="text-base font-display font-semibold">
              {workspaceTool === "shops" ? "Manage Shops"
                : workspaceTool === "cashiers" ? "Cashiers"
                : workspaceTool === "categories" ? "Categories" : ""}
            </p>
          </div>
          <div className="px-5 py-5">
            {workspaceTool === "shops" && <ShopsManagerInline />}
            {workspaceTool === "cashiers" && <CashierManager />}
            {workspaceTool === "categories" && <CategoryManager />}
          </div>
        </SheetContent>
      </Sheet>

      {/* Generate Report dialog */}
      <Dialog open={reportOpen} onOpenChange={(o) => { setReportOpen(o); if (!o) setReportImageUrl(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-border/60 bg-gradient-to-b from-card to-background p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Shop Report Preview
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {shopFilter === "all" ? "All Shops" : (shops.find((s) => s.id === shopFilter)?.name ?? "Shop")}
              {" · "}{dateRangeLabel}
            </p>
          </DialogHeader>
          <div className="space-y-4 px-5 py-5">
            {(() => {
              const t = totalsOf(buildReportInput().rows);
              const cards: { l: string; v: number; color?: string }[] = [
                { l: "POS Sale", v: t.pos },
                { l: "Cash Sale", v: t.cash },
                { l: "Bank Sale", v: t.bank },
                { l: "Credit Sale", v: t.credit },
                { l: "Total Sale", v: t.totalSale },
                { l: "Purchase", v: t.purchase },
                { l: "Expense", v: t.expense },
                { l: "Withdraw", v: t.withdraw },
                { l: "Plus / Minus", v: t.diff, color: t.diff >= 0 ? "text-emerald-500" : "text-rose-500" },
              ];
              return (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {cards.map((c) => (
                    <div key={c.l} className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/60 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.l}</div>
                      <div className={cn("mt-1", c.color)}>
                        <SARAmount value={c.v} size="md" />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-2">
              {reportImageUrl ? (
                <img loading="lazy" decoding="async" src={reportImageUrl} alt="Report preview" className="w-full rounded-xl" />
              ) : (
                <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rendering premium report…
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <Button type="button" variant="outline" size="sm" onClick={() => printShopReportPDF(buildReportInput())}>
                <FileText className="h-4 w-4" /> PDF
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadShopReportImage(buildReportInput())}>
                <ImageDown className="h-4 w-4" /> Image
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadShopReportExcel(buildReportInput())}>
                <FileDown className="h-4 w-4" /> Excel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  const r = await shareShopReportWhatsApp(buildReportInput());
                  if (r.kind === "fallback-link") toast.success("WhatsApp opened");
                }}
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <ShopImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        shops={shops}
        cashiers={cashiers}
        existingEntries={entries}
      />

      {/* Date range pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {([
          { k: "today", l: "Today" },
          { k: "yesterday", l: "Yesterday" },
          { k: "week", l: "Weekly" },
          { k: "month", l: "Monthly" },
          { k: "custom", l: "Custom" },
        ] as { k: typeof dateRange; l: string }[]).map((opt) => (
          <button
            key={opt.k}
            type="button"
            onClick={() => setDateRange(opt.k)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95",
              dateRange === opt.k
                ? "bg-primary text-primary-foreground shadow-[0_0_18px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                : "border border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {opt.l}
          </button>
        ))}
      </div>
      {dateRange === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">From</Label>
            <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="mt-1 h-9" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">To</Label>
            <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="mt-1 h-9" />
          </div>
        </div>
      )}

      {/* Per-shop summary cards */}
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Per-shop summary
        </h2>
        <button
          type="button"
          onClick={refreshShopData}
          className="flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition hover:bg-muted active:scale-95"
          aria-label="Refresh shop summary"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {shopCardSummaries.map((summary) => (
          <ShopSummaryCard
            key={summary.shop.id}
            summary={summary}
            active={shopFilter === summary.shop.id}
            onToggle={() => {
              setShopFilter(shopFilter === summary.shop.id ? "all" : summary.shop.id);
              refreshShopData();
            }}
          />
        ))}
      </div>

      {/* Active shop filter banner */}
      {shopFilter !== "all" && (
        <div className="flex animate-fade-in items-center justify-between rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs">
          <span className="flex items-center gap-2">
            <Store className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold">{shops.find((s) => s.id === shopFilter)?.name ?? "Shop"}</span>
            <Badge variant="outline" className="text-[9px]">{dateRangeLabel}</Badge>
          </span>
          <button
            type="button"
            onClick={() => setShopFilter("all")}
            className="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Clear shop filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Recent entries */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              {shopFilter === "all"
                ? "All Shops · Recent Entries"
                : `${shops.find((s) => s.id === shopFilter)?.name ?? "Shop"} · Recent Entries`}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{filteredEntries.length}</span>
        </div>
        {/* Entry type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/60 bg-muted/20 px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {([
            { k: "all", l: "All" },
            { k: "pos_sale", l: "POS Sale" },
            { k: "cash_sale", l: "Cash Sale" },
            { k: "bank_sale", l: "Bank Sale" },
            { k: "credit_sale", l: "Credit Sale" },
            { k: "purchase", l: "Purchase" },
            { k: "expense", l: "Expense" },
            { k: "withdraw", l: "Withdraw" },
            { k: "difference", l: "Plus/Minus" },
          ] as { k: EntryTypeFilter; l: string }[]).map((opt) => {
            const on = opt.k === "all" ? activeFilters.length === 0 : activeFilters.includes(opt.k as any);
            return (
              <button
                key={opt.k}
                type="button"
                onClick={() => {
                  if (opt.k === "all") setActiveFilters([]);
                  else {
                    setActiveFilters((prev) =>
                      prev.includes(opt.k as any)
                        ? prev.filter((f) => f !== opt.k)
                        : [...prev, opt.k as any]
                    );
                  }
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all active:scale-95",
                  on
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                    : "border border-border/70 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {opt.l}
              </button>
            );
          })}
        </div>
        {/* Filter total — premium compact summary */}
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/8 via-primary/5 to-transparent px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                {filterTotal.label}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {dateRangeLabel} · {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
              </p>
            </div>
            <div
              key={`${activeFilters.join("-")}-${filterTotal.value}`}
              className={cn(
                "animate-scale-in tabular-nums",
                filterTotal.tone === "success" && "text-success",
                filterTotal.tone === "danger" && "text-destructive",
                filterTotal.tone === "info" && "text-primary",
                filterTotal.tone === "warning" && "text-warning",
              )}
            >
              <SARAmount value={filterTotal.value} size="lg" />
            </div>
          </div>
        </div>
        {filteredEntries.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No entries for this filter.</p>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {visibleEntries.map((entry) => (
                <ShopEntryRow
                  key={entry.id}
                  entry={entry}
                  shopName={shopNamesById.get(entry.shop_id) ?? "—"}
                  activeFilters={activeFilters}
                  onOpen={openDetail}
                  onOpenScan={openScanViewer}
                />
              ))}
            </ul>
            {filteredEntries.length > visibleEntries.length && (
              <div className="border-t border-border px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 20)}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
                >
                  Load More ({filteredEntries.length - visibleEntries.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </Card>

      {detail && (
        <EntryDetail
          entry={detail}
          shops={shops}
          cashiers={cashiers}
          onClose={() => setDetail(null)}
          onEdit={loadEditing}
          onDelete={remove}
          onViewScan={openScanViewer}
        />
      )}

      <ScanDetailDialog
        open={!!scanViewer}
        scanId={scanViewer?.scanId}
        live={scanViewer?.live}
        onClose={() => setScanViewer(null)}
      />

      {/* Premium Floating Action Button + Quick Actions */}
      <ShopFab
        onPick={(k) => {
          if (editing) resetForm(true);
          setKind(k);
          setFormOpen(true);
        }}
        allowAll={!simpleMode}
      />


      <DuplicateWarningDialog
        open={!!warning}
        kind={warning?.kind ?? "hard"}
        existing={warning?.existing ?? null}
        details={warning?.details ?? null}
        isAdmin={isAdmin}
        onCancel={() => {
          if (warning) void logWarning({
            warningType: warning.kind === "hard" ? "Hard Warning" : "Soft Warning",
            actionTaken: "Cancelled",
            existingEntryId: warning.existing?.id,
          });
          setWarning(null);
        }}
        onViewExisting={() => {
          const id = warning?.existing?.id;
          if (!id) return;
          void logWarning({
            warningType: warning!.kind === "hard" ? "Hard Warning" : "Soft Warning",
            actionTaken: "Viewed existing",
            existingEntryId: id,
          });
          setWarning(null);
          setFormOpen(false);
          const target = entries.find((e) => e.id === id);
          if (target) setDetail(target);
        }}
        onContinue={async () => {
          if (warning) void logWarning({
            warningType: warning.kind === "hard"
              ? (isAdmin ? "Admin Override" : "Hard Warning")
              : "Soft Warning",
            actionTaken: warning.kind === "hard" && isAdmin
              ? "Overrode block & saved"
              : "Continued save",
            existingEntryId: warning.existing?.id,
          });
          setWarning(null);
          await performSave();
        }}
      />

      {/* Entry form bottom sheet */}
      <Sheet
        open={formOpen}
        onOpenChange={(o) => { if (!o && editing) resetForm(true); setFormOpen(o); }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl border-t bg-background p-0 sm:max-w-none"
        >
          <div className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 px-5 pb-3 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  {editing ? "Edit Entry" : "New Entry"}
                </h2>
                <p className="truncate text-[11px] text-muted-foreground">
                  {currentShop?.name ?? "Select a shop"}
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 pb-4 pt-4">

          {/* Top row: date + shop */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Shop</Label>
              <Select value={shopId} onValueChange={setShopId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select shop" /></SelectTrigger>
                <SelectContent>
                  {shops.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          {simpleMode ? (
            <div className="grid grid-cols-2 gap-2">
              <KindTab active={kind === "sale"} onClick={() => setKind("sale")} icon={Banknote} label="Cash In" />
              <KindTab active={kind === "expense"} onClick={() => setKind("expense")} icon={FileText} label="Expense" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              <KindTab active={kind === "sale"} onClick={() => setKind("sale")} icon={ShoppingCart} label="Sale" />
              <KindTab active={kind === "purchase"} onClick={() => setKind("purchase")} icon={Package} label="Purchase" />
              <KindTab active={kind === "expense"} onClick={() => setKind("expense")} icon={FileText} label="Expense" />
              <KindTab active={kind === "withdraw"} onClick={() => setKind("withdraw")} icon={Banknote} label="Withdraw" />
            </div>
          )}

          {kind === "sale" && simpleMode && (
            <AmountField label="Cash In" value={cashSale} onChange={setCashSale} big />
          )}

          {kind === "sale" && !simpleMode && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Cashier</Label>
                <Select value={cashierId || "__none"} onValueChange={(v) => setCashierId(v === "__none" ? "" : v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={filteredCashiers.length ? "Select cashier" : "No cashiers for this shop"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— None —</SelectItem>
                    {filteredCashiers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AmountField label="POS Sale" value={pos} onChange={setPos} infoKey="pos_sale" hint="Z-report / printed POS total" />
                <AmountField label="Cash Sale" value={cashSale} onChange={setCashSale} infoKey="cash_sale" hint="Paid in physical cash" />
                <AmountField label="Bank Sale" value={bankSale} onChange={setBankSale} infoKey="bank_sale" hint="Card / transfer" />
                <AmountField label="Credit Sale" value={creditSale} onChange={setCreditSale} infoKey="credit_sale" hint="Sale given on due / baki" />
              </div>

              <AmountField label="Due Receivable" value={dueReceivable} onChange={setDueReceivable} infoKey="due_receivable" hint="Received from previous due / baki" />



              {/* Total Sale (read-only summary) */}
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 shadow-[0_0_16px_-6px_color-mix(in_oklab,var(--primary)_18%,transparent)]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">Total Sale</span>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] space-y-1 text-xs">
                        <p className="font-semibold text-foreground">Total Sale formula</p>
                        <p className="text-muted-foreground">Cash Sale + Bank Sale + Credit Sale − Due Receivable</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <SARAmount value={totalSale} size="lg" />
              </div>

              <div
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3",
                  difference === 0
                    ? "border-border bg-muted/40"
                    : difference > 0
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                <span className="text-xs font-medium uppercase tracking-wider">Plus / Minus</span>
                <SARAmount value={difference} size="xl" showSign />
              </div>
            </div>
          )}

          {kind === "purchase" && !simpleMode && (
            <div className="space-y-3">
              {/* Scan upload row */}
              {!ocrResult && !ocrScanning && (
                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">Scan purchase sheet (optional)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <ScanBtn icon={Camera} label="Camera" onClick={() => ocrCamRef.current?.click()} />
                    <ScanBtn icon={Upload} label="Image" onClick={() => ocrImgRef.current?.click()} />
                    <ScanBtn icon={FileText} label="PDF" onClick={() => ocrPdfRef.current?.click()} />
                  </div>
                  <input ref={ocrCamRef} type="file" accept="image/*" capture="environment" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleOcrFile(f); }} />
                  <input ref={ocrImgRef} type="file" accept="image/jpeg,image/png,image/webp" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleOcrFile(f); }} />
                  <input ref={ocrPdfRef} type="file" accept="application/pdf" hidden
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleOcrFile(f); }} />
                </div>
              )}

              {ocrScanning && (
                <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Scanning sheet…
                </div>
              )}

              <AmountField label="Total Purchase" value={purchaseAmt} onChange={setPurchaseAmt} big />

              {/* OCR status badges */}
              {(ocrResult || ocrLinkedScanId) && (() => {
                const edited =
                  ocrOriginalAmount != null && Math.abs(num(purchaseAmt) - Number(ocrOriginalAmount)) > 0.001;
                const conf = ocrResult?.confidence ?? null;
                const low = conf === "low";
                const medium = conf === "medium";
                const high = conf === "high";
                const confStyle = low
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30"
                  : medium
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/30"
                  : high
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30"
                  : "bg-muted text-muted-foreground ring-1 ring-border";
                const dotStyle = low
                  ? "bg-rose-500"
                  : medium
                  ? "bg-amber-500"
                  : high
                  ? "bg-emerald-500"
                  : "bg-muted-foreground";
                return (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {conf && (
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider", confStyle)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", dotStyle, low && "animate-pulse")} />
                          {conf} confidence
                        </span>
                      )}
                      {edited && (
                        <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300">
                          <AlertTriangle className="h-3 w-3" /> Modified
                        </Badge>
                      )}
                      {!edited && high && (
                        <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                      {ocrOriginalAmount != null && edited && (
                        <span className="text-[11px] text-muted-foreground">
                          OCR: <SARAmount value={Number(ocrOriginalAmount)} size="sm" />
                        </span>
                      )}
                      <Button
                        type="button" variant="outline" size="sm" className="ml-auto h-7 px-2 text-xs"
                        onClick={() => setScanViewer({
                          scanId: ocrLinkedScanId ?? undefined,
                          live: ocrResult ? { ...ocrResult, file_url: ocrFilePreview } : undefined,
                        })}
                      >
                        <Eye className="mr-1 h-3 w-3" /> View Scan
                      </Button>
                      <Button
                        type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs"
                        onClick={resetOcr}
                      >
                        <X className="mr-1 h-3 w-3" /> Remove
                      </Button>
                    </div>
                    {(low || medium) && (
                      <div className={cn(
                        "flex items-start gap-2 rounded-xl border p-2.5 text-[11px]",
                        low
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
                      )}>
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          {low
                            ? "Low confidence scan — please verify the detected total before saving."
                            : "Medium confidence — double-check the amount looks right."}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Smart validation: line-item sum vs OCR total */}
              {ocrResult && (() => {
                const calc = sumRows(ocrResult.rows);
                const ocrTotal = ocrOriginalAmount;
                if (calc == null || ocrTotal == null) return null;
                const diff = Math.round((calc - ocrTotal) * 100) / 100;
                const absDiff = Math.abs(diff);
                const mismatch = absDiff > 1;
                const used = num(purchaseAmt);
                const usedCalc = Math.abs(used - calc) < 0.01;
                return (
                  <div className={cn(
                    "rounded-2xl border p-3 space-y-2",
                    mismatch
                      ? "border-amber-500/40 bg-amber-500/5"
                      : "border-emerald-500/30 bg-emerald-500/5",
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Total validation
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        mismatch ? "text-amber-600 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-300",
                      )}>
                        {mismatch ? "Mismatch" : "Matches"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-background/60 p-2">
                        <p className="text-[9px] uppercase text-muted-foreground">Calculated</p>
                        <div className="mt-0.5"><SARAmount value={calc} size="sm" /></div>
                        {usedCalc && <p className="mt-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-300">USED</p>}
                      </div>
                      <div className="rounded-lg bg-background/60 p-2">
                        <p className="text-[9px] uppercase text-muted-foreground">OCR Total</p>
                        <div className="mt-0.5"><SARAmount value={ocrTotal} size="sm" /></div>
                        {!usedCalc && <p className="mt-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-300">USED</p>}
                      </div>
                      <div className="rounded-lg bg-background/60 p-2">
                        <p className="text-[9px] uppercase text-muted-foreground">Difference</p>
                        <div className="mt-0.5"><SARAmount value={absDiff} size="sm" /></div>
                      </div>
                    </div>
                    {mismatch && (
                      <label className="flex items-center gap-2 rounded-lg bg-background/60 px-2.5 py-2 text-[11px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ocrMismatchAck}
                          onChange={(e) => setOcrMismatchAck(e.target.checked)}
                          className="h-3.5 w-3.5 accent-primary"
                        />
                        <span>
                          I've reviewed the totals and confirm{" "}
                          <SARAmount value={used} size="sm" /> is correct.
                        </span>
                      </label>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {kind === "expense" && (
            <AmountField label="Expense Amount" value={expenseAmt} onChange={setExpenseAmt} big />
          )}

          {kind === "withdraw" && !simpleMode && (
            <>
              <AmountField label="Withdraw Amount" value={withdrawAmt} onChange={setWithdrawAmt} big />
              <WithdrawSlipScan
                onApply={({ amount, date: d, note, file: slipFile }) => {
                  setWithdrawAmt(String(Math.floor(Number(amount) || 0)));
                  if (d) setDate(d);
                  setNotes((prev) => (prev && prev.trim().length > 0 ? prev : note));
                  setFile(slipFile);
                }}
              />
            </>
          )}

          {/* Common */}
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesError(""); }}
              rows={2}
              className={cn("mt-1", notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") && "border-destructive")}
              aria-invalid={notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") ? "true" : "false"}
            />
            {notesError && (kind === "purchase" || kind === "expense" || kind === "withdraw") && (
              <p className="mt-1 text-xs text-destructive">{notesError}</p>
            )}
          </div>

          {!simpleMode && (
            <div>
              <Label className="text-xs">Attachment (image / PDF)</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1"
              />
              {attachmentUrl && !file && (
                <p className="mt-1 truncate text-xs text-muted-foreground">Current: {attachmentUrl.split("/").pop()}</p>
              )}
            </div>
          )}

            </div>

            {/* Sticky Save row */}
            <div
              className="shrink-0 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
            >
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { if (editing) resetForm(true); setFormOpen(false); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={busy} className="h-11 flex-1">
                  <Save className="mr-1 h-4 w-4" />
                  {busy ? "Saving…" : editing ? "Save changes" : "Save entry"}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>

      </Sheet>
    </div>
  );
}

/* ---------- helpers ---------- */

function KindTab({
  active, onClick, icon: Icon, label,
}: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
          : "border-border bg-background hover:bg-muted/60",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function AmountField({
  label, value, onChange, big = false, infoKey, hint,
}: { label: string; value: string; onChange: (v: string) => void; big?: boolean; infoKey?: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <Label className="text-xs">{label}</Label>
        {infoKey && <InfoButton metric={infoKey} size="xs" />}
      </div>
      <div className="relative mt-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          SAR
        </span>
        <Input
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pl-12 font-display font-bold tabular-nums tracking-tight",
            big ? "h-14 text-2xl" : "h-11 text-lg",
          )}
        />
      </div>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, tone,
}: { label: string; value: number; icon: React.ElementType; tone: "primary" | "success" | "info" | "warn" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-500",
    info: "bg-sky-500/10 text-sky-500",
    warn: "bg-amber-500/10 text-amber-500",
  }[tone];
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", toneCls)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2"><SARAmount value={value} size="xl" /></div>
    </Card>
  );
}

function Mini({ label, value, signed = false }: { label: string; value: number; signed?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <SARAmount value={value} size="sm" showSign={signed} />
    </div>
  );
}

const ENTRY_TYPE_META: Record<string, { label: string; color: string; badge: string }> = {
  sale:     { label: "Sale Entry",     color: "#059669", badge: "Sale Entry" },
  purchase: { label: "Purchase Entry", color: "#ea580c", badge: "Purchase Entry" },
  expense:  { label: "Expense Entry",  color: "#dc2626", badge: "Expense Entry" },
  withdraw: { label: "Withdraw Entry", color: "#2563eb", badge: "Withdraw Entry" },
};

function shareShopEntryAsImage(entry: any, shopName?: string, cashierName?: string) {
  const type = String(entry?.entry_type ?? "entry").toLowerCase();
  const meta = ENTRY_TYPE_META[type] ?? { label: "Entry", color: "#0f172a", badge: "Entry" };

  const amountNum =
    type === "sale"
      ? Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0) + Number(entry?.credit_sale ?? 0)
      : type === "purchase" ? Number(entry?.purchase_amount ?? 0)
      : type === "expense"  ? Number(entry?.expense_amount ?? 0)
      : Number(entry?.withdraw_amount ?? 0);

  const amountLabel =
    type === "sale" ? "Total Sale"
      : type === "purchase" ? "Purchase Amount"
      : type === "expense" ? "Expense Amount"
      : "Withdraw Amount";

  const rows: { label: string; value: string }[] = [];
  if (entry?.txn_date) rows.push({ label: "Date", value: String(entry.txn_date) });
  const created = entry?.created_at ? new Date(entry.created_at) : null;
  if (created && !isNaN(created.getTime())) {
    rows.push({ label: "Time", value: created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
  }

  // Sale-specific breakdown + Difference highlight (Total Sale − POS Sale)
  let highlight: { label: string; amount: string; tone: "positive" | "negative" | "neutral" } | undefined;
  if (type === "sale") {
    const cash = Number(entry?.cash_sale ?? 0);
    const bank = Number(entry?.bank_sale ?? 0);
    const credit = Number(entry?.credit_sale ?? 0);
    const dueReceivable = Number(entry?.due_receivable ?? 0);
    const pos = Number(entry?.pos_sale ?? 0);
    const totalSale = cash + bank + credit - dueReceivable;
    rows.push({ label: "Cash Sale",   value: SAR(cash) });
    rows.push({ label: "Bank Sale",   value: SAR(bank) });
    rows.push({ label: "POS Sale",    value: SAR(pos) });
    rows.push({ label: "Credit Sale", value: SAR(credit) });
    const diff = totalSale - pos;
    const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
    highlight = {
      label: "Plus / Minus (Total Sale − POS Sale)",
      amount: `${sign}${SAR(Math.abs(diff))}`,
      tone: diff > 0.001 ? "positive" : diff < -0.001 ? "negative" : "neutral",
    };
  }
  if (entry?.attachment_url) rows.push({ label: "Attachment", value: "Yes" });

  const dateStr = entry?.txn_date
    ? new Date(entry.txn_date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });

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
    caption: "Shop Entry By ShRiAh Group",
  });
}

const ShopSummaryCard = memo(function ShopSummaryCard({
  summary,
  active,
  onToggle,
}: {
  summary: ShopCardSummary;
  active: boolean;
  onToggle: () => void;
}) {
  const { shop, simple, balance, primary, secondary, cashPosition, expectedBank, cashTot, bankTot, withdrawTot, purchaseTot, expenseTot, lastDate } = summary;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-3.5 text-left active:scale-[0.99]",
        active
          ? "border-primary/70 bg-gradient-to-br from-primary/[0.14] via-primary/[0.04] to-transparent"
          : "border-border/60 bg-gradient-to-b from-card to-card/90 hover:border-primary/30",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          simple ? "bg-amber-500/10 text-amber-500" : active ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary",
        )}>
          <Store className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-[13px] font-semibold tracking-tight">{shop.name}</span>
        {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
      </div>

      {simple ? (
        <>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Balance</span>
            <SARAmount value={balance} size="xl" showSign className={balance > 0 ? "text-emerald-500" : balance < 0 ? "text-rose-500" : "text-foreground"} />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
            <div className="flex min-w-0 items-center gap-1 text-emerald-500/90">
              <TrendingUp className="h-3 w-3 shrink-0" />
              <SARAmount value={primary} size="sm" bold={false} className="truncate" currencyClassName="hidden" />
            </div>
            <div className="flex min-w-0 items-center gap-1 text-rose-500/90">
              <TrendingDown className="h-3 w-3 shrink-0" />
              <SARAmount value={secondary} size="sm" bold={false} className="truncate" currencyClassName="hidden" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={cn("rounded-xl border px-3 py-2.5", cashPosition >= 0 ? "border-emerald-500/30 bg-emerald-500/[0.06]" : "border-rose-500/30 bg-rose-500/[0.06]") }>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Shop Cash Position</span>
              <span onClick={(e) => e.stopPropagation()}>
                <InfoButton size="xs" info={{ title: "Shop Cash Position", what: "Net cash held by this shop. Total Cash minus Total Cost over the selected period.", formula: "Total Cash − Total Cost  =  (Cash Sale + Bank Withdraw) − (Purchase + Expense)", inputs: [`Total Cash: SAR ${(cashTot + withdrawTot).toFixed(2)}  (Cash Sale ${cashTot.toFixed(2)} + Bank Withdraw ${withdrawTot.toFixed(2)})`, `Total Cost: SAR ${(purchaseTot + expenseTot).toFixed(2)}  (Purchase ${purchaseTot.toFixed(2)} + Expense ${expenseTot.toFixed(2)})`, `Cash Position: SAR ${cashPosition.toFixed(2)}`] }} />
              </span>
            </div>
            <SARAmount value={cashPosition} size="xl" showSign className={cn("mt-1", cashPosition >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500")} />
          </div>
          <div className={cn("flex items-center justify-between gap-2 rounded-xl border px-3 py-2", expectedBank >= 0 ? "border-teal-500/30 bg-teal-500/[0.06]" : "border-orange-500/30 bg-orange-500/[0.06]") }>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Expected Bank Balance</span>
                <span onClick={(e) => e.stopPropagation()}>
                  <InfoButton size="xs" info={{ title: "Expected Bank Balance", what: "Net bank position based on bank sales and bank withdrawals.", formula: "Bank Sale − Bank Withdraw", inputs: [`Bank Sale: SAR ${bankTot.toFixed(2)}`, `Bank Withdraw: SAR ${withdrawTot.toFixed(2)}`] }} />
                </span>
              </div>
              <SARAmount value={expectedBank} size="md" showSign className={cn("mt-0.5", expectedBank >= 0 ? "text-teal-600 dark:text-teal-400" : "text-orange-500")} />
            </div>
          </div>
        </>
      )}

      <p className="text-[10px] leading-none text-muted-foreground/80">
        {lastDate ? `Last activity · ${lastDate}` : "No activity"}
      </p>
    </button>
  );
});

type ShopFilterKey = "pos_sale" | "cash_sale" | "bank_sale" | "credit_sale" | "purchase" | "expense" | "withdraw" | "difference";

const FILTER_FIELD: Record<ShopFilterKey, { field: string; label: string }> = {
  pos_sale: { field: "pos_sale", label: "POS Sale" },
  cash_sale: { field: "cash_sale", label: "Cash Sale" },
  bank_sale: { field: "bank_sale", label: "Bank Sale" },
  credit_sale: { field: "credit_sale", label: "Credit Sale" },
  purchase: { field: "purchase_amount", label: "Purchase" },
  expense: { field: "expense_amount", label: "Expense" },
  withdraw: { field: "withdraw_amount", label: "Withdraw" },
  difference: { field: "difference", label: "Difference" },
};

const ShopEntryRow = memo(function ShopEntryRow({
  entry,
  shopName,
  activeFilters,
  onOpen,
  onOpenScan,
}: {
  entry: any;
  shopName: string;
  activeFilters: ShopFilterKey[];
  onOpen: (entry: any) => void;
  onOpenScan: (scanId: string) => void;
}) {
  const defaultTotal =
    entry.entry_type === "sale"
      ? Number(entry.cash_sale) + Number(entry.bank_sale) + Number(entry.credit_sale)
      : entry.entry_type === "purchase"
        ? Number(entry.purchase_amount)
        : entry.entry_type === "expense"
          ? Number(entry.expense_amount)
          : Number(entry.withdraw_amount);

  // When filters are active, only sum filter-matched fields relevant to this entry
  const applicable = activeFilters.filter((f) => {
    if (f === "purchase") return entry.entry_type === "purchase";
    if (f === "expense") return entry.entry_type === "expense";
    if (f === "withdraw") return entry.entry_type === "withdraw";
    return entry.entry_type === "sale";
  });

  const displayed =
    applicable.length > 0
      ? applicable.reduce((s, f) => s + (Number(entry[FILTER_FIELD[f].field]) || 0), 0)
      : defaultTotal;

  const filterLabel = applicable.length > 0
    ? applicable.map((f) => FILTER_FIELD[f].label).join(" + ")
    : null;

  const hasOcr = !!entry.ocr_scan_id;

  return (
    <li
      data-record-id={entry.id}
      onClick={() => onOpen(entry)}
      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/40"
    >
      <div className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        entry.entry_type === "sale" ? "bg-emerald-500/10 text-emerald-500"
          : entry.entry_type === "purchase" ? "bg-amber-500/10 text-amber-500"
          : entry.entry_type === "expense" ? "bg-rose-500/10 text-rose-500"
          : "bg-sky-500/10 text-sky-500",
      )}>
        {entry.entry_type === "sale" ? <ShoppingCart className="h-4 w-4" />
          : entry.entry_type === "purchase" ? <Package className="h-4 w-4" />
          : entry.entry_type === "expense" ? <FileText className="h-4 w-4" />
          : <Banknote className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="h-5 text-[10px]">{shopName}</Badge>
          <Badge variant="outline" className="h-5 text-[10px] uppercase">{entry.entry_type}</Badge>
          {hasOcr && (
            <Badge className="h-5 gap-1 border-primary/30 bg-primary/10 px-1.5 text-[9px] font-semibold uppercase tracking-wider text-primary hover:bg-primary/15">
              <Sparkles className="h-2.5 w-2.5" /> OCR
            </Badge>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.txn_date}{entry.notes ? ` · ${entry.notes}` : ""}</p>
      </div>
      <div className="flex flex-col items-end">
        <SARAmount value={displayed} size="md" />
        {filterLabel && (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {filterLabel}
          </span>
        )}
      </div>
      {hasOcr && (
        <button
          type="button"
          onClick={(ev) => { ev.stopPropagation(); onOpenScan(entry.ocr_scan_id); }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
          aria-label="View OCR scan"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

    </li>
  );
});

function EntryDetail({
  entry, shops, cashiers, onClose, onEdit, onDelete, onViewScan,
}: {
  entry: any | null;
  shops: Shop[];
  cashiers: Cashier[];
  onClose: () => void;
  onEdit: (e: any) => void;
  onDelete: (id: string) => void;
  onViewScan: (scanId: string) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const url: string | null = useSignedAttachmentUrl(entry?.attachment_url ?? null);
  const entryId = typeof entry?.id === "string" && entry.id.length > 0 ? entry.id : null;
  const entryType = typeof entry?.entry_type === "string" ? entry.entry_type : "entry";
  const hasEntry = !!entry && !!entryId;

  useEffect(() => {
    setFullscreen(false);
  }, [entryId]);

  if (!entry) return null;
  const shop = shops.find((s) => s.id === entry?.shop_id);
  const cashier = cashiers.find((c) => c.id === entry?.cashier_id);
  const isImg = url ? /\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(url) : false;
  const isPdf = url ? /\.pdf($|\?)/i.test(url) : false;
  const totalSale = Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0) + Number(entry?.credit_sale ?? 0) - Number(entry?.due_receivable ?? 0);

  const syncedCash =
    entryType === "sale" ? Number(entry?.cash_sale ?? 0) + Number(entry?.bank_sale ?? 0)
      : entryType === "purchase" ? -Number(entry?.purchase_amount ?? 0)
      : entryType === "expense" ? -Number(entry?.expense_amount ?? 0)
      : Number(entry?.withdraw_amount ?? 0);

  return (
    <Dialog open={!!entry} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{entryType} entry</DialogTitle>
        </DialogHeader>
        {!hasEntry ? (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Entry details unavailable
          </div>
        ) : (
        <div className="space-y-3 text-sm">
          <Row k="Date" v={entry?.txn_date ?? "—"} />
          <Row k="Shop" v={shop?.name ?? "—"} />
          <Row k="Cashier" v={cashier?.name ?? "—"} />
          {entryType === "sale" && (
            <>
              <Row k="POS Sale" v={<SARAmount value={entry?.pos_sale ?? 0} size="sm" />} />
              <Row k="Total Sale" v={<SARAmount value={totalSale} size="sm" />} />
              <Row k="Cash Sale" v={<SARAmount value={entry?.cash_sale ?? 0} size="sm" />} />
              <Row k="Bank Sale" v={<SARAmount value={entry?.bank_sale ?? 0} size="sm" />} />
              <Row k="Credit Sale" v={<SARAmount value={entry?.credit_sale ?? 0} size="sm" />} />
              <Row k="Plus / Minus" v={<SARAmount value={entry?.difference ?? 0} size="sm" showSign />} />
            </>
          )}
          {entryType === "purchase" && (
            <>
              <Row k="Purchase Amount" v={<SARAmount value={entry?.purchase_amount ?? 0} size="sm" />} />
              {entry.ocr_scan_id && (() => {
                const edited =
                  entry.ocr_original_amount != null &&
                  Math.abs(Number(entry.purchase_amount) - Number(entry.ocr_original_amount)) > 0.001;
                const low = entry.ocr_confidence === "low";
                return (
                  <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-muted/40 p-2">
                    {edited ? (
                      <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> Modified from OCR
                      </Badge>
                    ) : low ? (
                      <Badge className="gap-1 bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-300">
                        <AlertTriangle className="h-3 w-3" /> Low Confidence
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> OCR Verified
                      </Badge>
                    )}
                    {edited && entry.ocr_original_amount != null && (
                      <span className="text-[11px] text-muted-foreground">
                        OCR: <SARAmount value={Number(entry.ocr_original_amount)} size="sm" />
                      </span>
                    )}
                    <Button
                      type="button" variant="outline" size="sm" className="ml-auto h-7 px-2 text-xs"
                      onClick={() => onViewScan(entry.ocr_scan_id)}
                    >
                      <Eye className="mr-1 h-3 w-3" /> View Scan
                    </Button>
                  </div>
                );
              })()}
            </>
          )}
          {entryType === "expense" && (
            <Row k="Expense Amount" v={<SARAmount value={entry?.expense_amount ?? 0} size="sm" />} />
          )}
          {entryType === "withdraw" && (
            <Row k="Withdraw Amount" v={<SARAmount value={entry?.withdraw_amount ?? 0} size="sm" />} />
          )}
          {entry.notes && <Row k="Notes" v={entry.notes} />}

          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs">
              <p className="font-semibold text-primary">Synced to Transactions</p>
            <p className="mt-1 text-muted-foreground">
              {entryType === "sale" && "Cash sale → Cash In · Bank sale → Bank balance · Credit → no cash effect"}
              {entryType === "purchase" && "Recorded as Warehouse Purchase (Cash Out)"}
              {entryType === "expense" && "Recorded as Shop Expense (Cash Out)"}
              {entryType === "withdraw" && "Recorded as Bank Withdraw (adds to Cash in Hand)"}
            </p>
            {syncedCash !== 0 && (
              <p className="mt-1">
                Cash effect: <SARAmount value={syncedCash} size="sm" showSign />
              </p>
            )}
          </div>

          {url && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Attachment</span>
                <button onClick={() => setFullscreen(true)} className="text-xs text-primary hover:underline">
                  <Maximize2 className="mr-1 inline h-3 w-3" /> Fullscreen
                </button>
              </div>
              {isImg ? (
                <img loading="lazy" decoding="async" src={url} alt="" className="max-h-64 w-full rounded-md object-contain" />
              ) : isPdf ? (
                <iframe src={url} className="h-64 w-full rounded-md border border-border" />
              ) : (
                <a href={url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                  Open attachment
                </a>
              )}
            </div>
          )}
        </div>
        )}
        <DialogFooter className="gap-2 sm:!justify-between">
          {entryId ? <EditHistoryButton entityType="shop_entries" entityId={entryId} variant="outline" label="History" /> : <span />}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => entry && shareShopEntryAsImage(entry, shop?.name, cashier?.name)}
              disabled={!hasEntry}
            >
              <Share2 className="mr-1 h-4 w-4" /> Share as Image
            </Button>
            <Button variant="outline" onClick={() => entry && onEdit(entry)} disabled={!hasEntry}>
              <Pencil className="mr-1 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => entryId && onDelete(entryId)} disabled={!entryId}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </div>
        </DialogFooter>

        {fullscreen && url && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <button onClick={() => setFullscreen(false)} className="absolute right-4 top-4 text-white">
              <X className="h-6 w-6" />
            </button>
            {isImg ? (
              <img loading="lazy" decoding="async" src={url} className="max-h-full max-w-full object-contain" alt="" />
            ) : (
              <iframe src={url} className="h-full w-full bg-white" />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}

function ScanBtn({
  icon: Icon, label, onClick,
}: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-2.5 text-xs font-medium transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95"
    >
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </button>
  );
}

function ScanDetailDialog({
  open, scanId, live, onClose,
}: {
  open: boolean;
  scanId?: string;
  live?: (OcrResult & { file_url?: string | null });
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) { setLoaded(null); return; }
    if (live) return;
    if (!scanId) return;
    setLoading(true);
    (supabase as any)
      .from("ai_scans")
      .select("id, created_at, file_url, file_type, raw_text, extracted, status")
      .eq("id", scanId)
      .maybeSingle()
      .then((r: any) => { setLoaded(r.data ?? null); setLoading(false); });
  }, [open, scanId, live]);

  const ex: OcrResult = (live ?? loaded?.extracted ?? {}) as OcrResult;
  const fileUrl: string | null = live?.file_url ?? loaded?.file_url ?? null;
  const fileType: string | null = loaded?.file_type ?? null;
  const isImg = fileUrl ? /\.(png|jpe?g|webp|gif)($|\?)/i.test(fileUrl) || (fileType?.startsWith("image/") ?? false) : false;
  const isPdf = fileUrl ? /\.pdf($|\?)/i.test(fileUrl) || fileType === "application/pdf" : false;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-primary" /> OCR Scan Details
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-3">
            {fileUrl && (
              <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
                {isImg ? (
                  <img loading="lazy" decoding="async" src={fileUrl} alt="" className="max-h-72 w-full object-contain" />
                ) : isPdf ? (
                  <iframe src={fileUrl} className="h-72 w-full" />
                ) : (
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="block p-3 text-sm text-primary">
                    Open file
                  </a>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <ScanStat label="Cash Buy" value={ex.cash_buy_total ?? 0} />
              <ScanStat label="Due Buy" value={ex.due_buy_total ?? 0} />
              <ScanStat label="Cost" value={ex.cost ?? 0} />
              <ScanStat label="Grand Total" value={ex.grand_total ?? 0} highlight />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ex.date && <Badge variant="outline">Date: {ex.date}</Badge>}
              <Badge variant="outline">Confidence: {ex.confidence ?? "—"}</Badge>
              {loaded?.created_at && (
                <Badge variant="outline">Scanned: {new Date(loaded.created_at).toLocaleString()}</Badge>
              )}
            </div>

            {!!ex.rows?.length && (
              <div className="rounded-xl border border-border p-2">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Line items
                </p>
                <div className="space-y-1.5">
                  {ex.rows.map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                      <span className="truncate pr-3">{r.description}</span>
                      <SARAmount value={r.amount} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ex.raw_text && (
              <details className="rounded-xl border border-border p-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Raw OCR text
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {ex.raw_text}
                </pre>
              </details>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ScanStat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border p-3",
      highlight ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30",
    )}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1"><SARAmount value={value} size="md" /></div>
    </div>
  );
}


// ============================================================
// Premium Floating Action Button + Quick Action Speed Dial
// ============================================================
function ShopFab({
  onPick,
  allowAll,
}: {
  onPick: (k: EntryKind) => void;
  allowAll: boolean;
}) {
  const [open, setOpen] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const secondary: { key: EntryKind; label: string; icon: typeof ShoppingCart; tint: string }[] = [
    ...(allowAll
      ? ([
          { key: "purchase" as EntryKind, label: "Purchase", icon: Package,  tint: "from-sky-500 to-indigo-600" },
          { key: "withdraw" as EntryKind, label: "Withdraw", icon: Banknote, tint: "from-amber-500 to-orange-600" },
        ])
      : []),
    { key: "expense",  label: "Expense",  icon: Wallet,       tint: "from-rose-500 to-pink-600" },
  ];

  const pick = (k: EntryKind) => { setOpen(false); onPick(k); };

  const startLongPress = () => {
    longPressFired.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressFired.current = true;
      setOpen(true);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate?.(15); } catch {}
      }
    }, 420);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };
  const handleClick = () => {
    if (longPressFired.current) { longPressFired.current = false; return; }
    if (open) { setOpen(false); return; }
    pick("sale");
  };

  // Bottom offset: clear the mobile bottom-nav (≈ 76px nav + safe-area).
  const fabBottomStyle = { bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)" } as const;
  const dialBottomStyle = { bottom: "calc(env(safe-area-inset-bottom, 0px) + 11rem)" } as const;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close quick actions"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 animate-in fade-in-0 bg-black/30 backdrop-blur-[2px] duration-150 md:hidden"
        />
      )}
      {open && (
        <button
          type="button"
          aria-label="Close quick actions"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 hidden animate-in fade-in-0 bg-black/30 backdrop-blur-[2px] duration-150 md:block"
        />
      )}

      {/* Secondary speed-dial actions (only when expanded) */}
      <div
        className="pointer-events-none fixed end-5 z-50 flex flex-col items-end gap-2 md:end-8"
        style={dialBottomStyle}
      >
        {secondary.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={a.key}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                open
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-1 opacity-0",
              )}
              style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }}
            >
              <span className="rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm ring-1 ring-border/50 backdrop-blur">
                {a.label}
              </span>
              <button
                type="button"
                onClick={() => pick(a.key)}
                aria-label={a.label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] ring-1 ring-white/10 transition-transform active:scale-90",
                  a.tint,
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* "More" chip — small secondary toggle, sits just above the main FAB */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide more actions" : "More entry actions"}
        aria-expanded={open}
        className={cn(
          "fixed end-7 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground shadow-md ring-1 ring-border/60 backdrop-blur transition-all duration-200 active:scale-90 md:end-[2.65rem]",
          open && "rotate-45",
        )}
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 10rem)" }}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>

      {/* Main FAB — single tap opens Sale */}
      <button
        type="button"
        onClick={handleClick}
        onPointerDown={startLongPress}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="New sale entry (long-press for more)"
        className={cn(
          "fixed end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground md:end-8 md:h-16 md:w-16",
          "bg-gradient-to-b from-primary to-primary-glow",
          "shadow-[0_14px_36px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)] ring-1 ring-white/15",
          "transition-all duration-200 hover:brightness-110 active:scale-95 select-none touch-none",
        )}
        style={fabBottomStyle}
      >
        <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
      </button>
    </>
  );
}
