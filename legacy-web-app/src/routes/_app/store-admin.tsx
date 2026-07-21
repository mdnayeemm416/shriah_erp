import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";


import {
  Package, Tag, Megaphone, Bell, ClipboardList, Plus, Pencil, Trash2, ExternalLink, MessageCircle, RefreshCw, Eye, EyeOff, Star,
  FileSpreadsheet, ShoppingCart, AlertCircle, Wallet,
  ShoppingBag, Truck, ArrowRight, Users, FileText, UserPlus, LayoutGrid, Undo2,
  ChevronUp, ChevronDown, Image,
} from "lucide-react";



import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { VyaparImportDialog } from "@/components/vyapar-import-dialog";
import { ProductImageUpload } from "@/components/product-image-upload";
import { ProductGalleryUpload } from "@/components/product-gallery-upload";
import { TransactionDialog } from "@/components/transaction-dialog";
import { openInvoiceShare } from "@/lib/invoice-formats";
import { useConfirm } from "@/hooks/use-confirm";
import { PosSaleDetailsDialog } from "@/components/pos-sale-details-dialog";
import { PurchaseDetailsDialog } from "@/components/purchase-details-dialog";
import { WholesaleTotalSaleCard } from "@/components/wholesale-total-sale-card";
import { WholesaleReturnsMiniCard } from "@/components/wholesale-returns-mini-card";
import { PosPaymentInDialog } from "@/components/pos-payment-in-dialog";
import { PosCustomerStatementDialog } from "@/components/pos-customer-statement";
import { PosCustomerAddDialog } from "@/components/pos-customer-add-dialog";
import { PosCustomerDetailsDialog } from "@/components/pos-customer-details-dialog";
import { RecycleBin } from "@/components/recycle-bin";
import { softDelete } from "@/lib/soft-delete";
import { useWorkingDate } from "@/hooks/use-working-date";
import { PartyManager } from "@/components/party-manager";
import { BarcodeScanner } from "@/components/barcode-scanner";
import { ScanLine } from "lucide-react";

import { WholesaleDashboard } from "@/components/wholesale-dashboard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MoreVertical, Trash, Database, FileSpreadsheet as FileSheet, Activity, Settings as SettingsIcon, BarChart3, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { usePosDueMap } from "@/hooks/use-pos-due-map";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckSquare, X as XIcon } from "lucide-react";
import type { PosCustomer } from "@/lib/pos-ledger";
import { useUserAccess } from "@/hooks/use-user-access";
import { restore } from "@/lib/soft-delete";
import { WholesaleTabsCustomizer, useTabPrefs, applyTabPrefs, COLORS as TAB_COLORS } from "@/components/wholesale-tabs-customizer";
import { Settings2, Printer } from "lucide-react";
import { PrintProductListDialog } from "@/components/print-product-list-dialog";




export const Route = createFileRoute("/_app/store-admin")({
  validateSearch: (s: Record<string, unknown>) => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
    newSale: s.newSale === "1" || s.newSale === true ? "1" : undefined,
    paymentIn: s.paymentIn === "1" || s.paymentIn === true ? "1" : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    newName: typeof s.newName === "string" ? s.newName : undefined,
  }),

  component: StoreAdmin,
});



type Product = {
  id: string; name: string; name_bn: string | null; name_ar: string | null; description: string | null;
  image_url: string | null; gallery_image_urls: string[]; price: number; compare_price: number | null; purchase_price: number; tax_rate: number;
  stock: number; min_stock: number; category_id: string | null; category_ids: string[] | null;
  item_code: string | null; barcode: string | null;
  warehouse_item_id: string | null; is_visible: boolean; is_featured: boolean;
  show_stock: boolean; sort_order: number;
};
type Category = { id: string; name: string; name_bn: string | null; name_ar: string | null; icon: string | null; sort_order: number; is_active: boolean; slug: string | null };
type Order = {
  id: string; order_number: number; customer_name: string; customer_mobile: string;
  customer_address: string | null; items: any[]; total: number;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  notes: string | null; admin_notes: string | null; created_at: string;
};
type Notif = { id: string; title: string; message: string | null; type: string; is_active: boolean; is_pinned: boolean; expires_at: string | null };

function StoreAdmin() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { isSalesDelivery } = useUserAccess();
  const [tab, setTab] = useState(search.tab ?? "dashboard");
  const [salesSubTab, setSalesSubTab] = useState<"completed" | "bin">("completed");
  const [websiteSubTab, setWebsiteSubTab] = useState<"banners" | "notifications">("banners");


  const [importOpen, setImportOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [saleInitial, setSaleInitial] = useState<any>(undefined);
  const [payOpen, setPayOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  const openSale = (initial?: any) => { setSaleInitial(initial); setSaleOpen(true); };

  // Sync from deep-link search params
  useEffect(() => {
    if (search.tab && search.tab !== tab) setTab(search.tab);
    if (search.newSale === "1") {
      openSale(undefined);
      navigate({ search: (p: any) => ({ ...p, newSale: undefined }), replace: true, resetScroll: false });
    }
    if (search.paymentIn === "1") {
      setPayOpen(true);
      navigate({ search: (p: any) => ({ ...p, paymentIn: undefined }), replace: true, resetScroll: false });
    }
  }, [search.tab, search.newSale, search.paymentIn]);

  const handleTabChange = (v: string) => {
    setTab(v);
    navigate({ search: (p: any) => ({ ...p, tab: v }), replace: true, resetScroll: false });
  };

  const [recycleOpen, setRecycleOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [tabsCustomizerOpen, setTabsCustomizerOpen] = useState(false);
  const tabPrefs = useTabPrefs();

  const { data: activeBannerCount = 0 } = useQuery({
    queryKey: ["shop-ads-active-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("shop_ads")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (error) throw error;
      return count ?? 0;
    },
  });


  const advanced = !!search.tab;

  const moreMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground" aria-label="More actions">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl p-1.5">
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => handleTabChange("categories")}>
          <Tag className="me-2 h-4 w-4" /> Category
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => handleTabChange("customers")}>
          <Users className="me-2 h-4 w-4" /> Customer Ledger
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => handleTabChange("notifications")}>
          <Bell className="me-2 h-4 w-4" /> Alert
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => navigate({ to: "/banner-ads" })}>
          <Image className="me-2 h-4 w-4" /> Banner Ads
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => navigate({ to: "/website-banners" })}>
          <Image className="me-2 h-4 w-4" /> Website Banners
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => handleTabChange("suppliers")}>
          <Truck className="me-2 h-4 w-4" /> Suppliers
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => navigate({ to: "/stock-count" })}>
          <ClipboardList className="me-2 h-4 w-4" /> Stock Count
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => setImportOpen(true)}>
          <FileSpreadsheet className="me-2 h-4 w-4" /> Import (Vyapar)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 text-sm" onSelect={() => setTabsCustomizerOpen(true)}>
          <Settings2 className="me-2 h-4 w-4" /> Customize Tabs
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );


  const tabContent: Record<string, React.ReactNode> = {
    dashboard: isSalesDelivery ? (
      <SalesDeliveryDashboard
        onNewSale={() => openSale(undefined)}
        onPaymentIn={() => setPayOpen(true)}
        onPurchase={() => setPurchaseOpen(true)}
        onViewOrders={() => handleTabChange("orders")}
        onViewCustomers={() => handleTabChange("customers")}
        onViewProducts={() => handleTabChange("products")}
      />
    ) : (
      <DashboardTab
        activeBannerCount={activeBannerCount}
        onNewSale={() => openSale(undefined)}
        onPaymentIn={() => setPayOpen(true)}
        onViewOrders={() => handleTabChange("orders")}
        onAddProduct={() => handleTabChange("products")}
        onImport={() => setImportOpen(true)}
        onAddCustomer={() => setAddCustomerOpen(true)}
        onPurchase={() => setPurchaseOpen(true)}
      />
    ),

    sales: (
      <SalesUnified
        sub={salesSubTab}
        onSubChange={setSalesSubTab}
        onNew={() => openSale(undefined)}
      />
    ),
    purchases: <PurchasesTab onNew={() => setPurchaseOpen(true)} />,
    customers: <CustomersTab onAdd={() => setAddCustomerOpen(true)} />,
    payments: <PaymentsTab onPaymentIn={() => setPayOpen(true)} />,
    orders: (
      <OrdersTab
        onConvert={(o: Order) => openSale({
          partyName: o.customer_name, partyMobile: o.customer_mobile, orderId: o.id, notes: o.notes ?? "",
          items: (o.items ?? []).map((it: any) => ({ product_id: it.id ?? it.product_id ?? "", name: it.name, qty: Number(it.qty) || 1, price: Number(it.price) || 0 })),
        })}
      />
    ),
    website: (
      <WebsiteSection sub={websiteSubTab} onSubChange={setWebsiteSubTab} activeBannerCount={activeBannerCount} />
    ),
    // legacy / secondary deep-links still supported
    products: <ProductsTab onImport={() => setImportOpen(true)} onOpenBin={() => setRecycleOpen(true)} />,
    categories: <CategoriesTab />,
    ads: <AdsTab />,
    notifications: <NotificationsTab />,
    suppliers: <SuppliersTab />,

  };

  const ALL_TOP_TABS: { value: string; label: string; icon: any }[] = [
    { value: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { value: "sales",     label: "Sale",      icon: ShoppingBag },
    { value: "purchases", label: "Purchase",  icon: Truck },
    { value: "customers", label: "Customer",  icon: Users },
    { value: "payments",  label: "Payment",   icon: Wallet },
    { value: "orders",    label: "Order",     icon: ShoppingCart },
    { value: "website",   label: "Website",   icon: Image },
  ];
  const BASE_TOP_TABS = isSalesDelivery
    ? ALL_TOP_TABS.filter((t) => t.value !== "website")
    : ALL_TOP_TABS;
  const TOP_TABS = applyTabPrefs(BASE_TOP_TABS, tabPrefs);
  const activeTopTab = TOP_TABS.find((t) => t.value === tab)?.value ?? BASE_TOP_TABS[0]?.value ?? "dashboard";
  const activeColorCls = TAB_COLORS[tabPrefs.activeColor] ?? TAB_COLORS.emerald;



  return (
    <div className="mx-auto w-full max-w-5xl space-y-3 pb-24">
      {/* Compact sticky ERP-style top tab bar */}
      <div className="sticky top-[var(--mobile-topbar-height,0px)] z-10 -mx-4 border-b border-border/50 bg-background/90 px-3 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <div className="flex items-center gap-1.5">
          <div className="-mx-1 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex w-auto min-w-full gap-1 px-1">
              {TOP_TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTopTab === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleTabChange(t.value)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                      active
                        ? `${activeColorCls.bg} ${activeColorCls.text}`
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {!isSalesDelivery && moreMenu}
        </div>
      </div>


      {/* Active tab content (lazy: only the active one is rendered) */}
      <>{tabContent[tab] ?? tabContent.dashboard}</>







      <VyaparImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <TransactionDialog open={saleOpen} onOpenChange={setSaleOpen} kind="sale" initial={saleInitial} />
      <TransactionDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} kind="purchase" />
      <PosPaymentInDialog open={payOpen} onOpenChange={setPayOpen} initialCustomer={null} />
      <PosCustomerAddDialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen} />

      {/* Recycle Bin sheet */}
      <Sheet open={recycleOpen} onOpenChange={setRecycleOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>Recycle Bin</SheetTitle></SheetHeader>
          <div className="mt-4"><RecycleBin /></div>
        </SheetContent>
      </Sheet>

      <DemoCleanupDialog open={demoOpen} onOpenChange={setDemoOpen} />

      <WholesaleTabsCustomizer
        open={tabsCustomizerOpen}
        onOpenChange={setTabsCustomizerOpen}
        allTabs={BASE_TOP_TABS}
      />
    </div>
  );
}



/* ============ SECTION WRAPPER ============ */

function SectionHeader({ title, icon: Icon, hint }: { title: string; icon?: any; hint?: string }) {
  return (
    <div className="mb-2 flex items-center justify-between px-0.5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</h2>
      </div>
      {hint && <span className="text-[10.5px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

function SectionTabs({
  title, value, onValueChange, tabs, children,
}: {
  title: string;
  value: string;
  onValueChange: (v: string) => void;
  tabs: { value: string; label: string; icon: any }[];
  children: React.ReactNode;
}) {
  const isActive = tabs.some((t) => t.value === value);
  // Default to first tab if current isn't in this group (each section keeps its own children visible only when active)
  return (
    <section>
      <Tabs value={isActive ? value : tabs[0].value} onValueChange={onValueChange}>

        <div className="-mx-1 overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full gap-1 rounded-2xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger key={t.value} value={t.value} className="rounded-xl px-3">
                  <Icon className="me-1.5 h-4 w-4" />
                  <span>{t.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        {isActive ? children : null}
      </Tabs>
    </section>
  );
}

/* ============ BUSINESS OVERVIEW ============ */

function BusinessOverview() {
  const { workingDate } = useWorkingDate();
  const stats = useQuery({
    queryKey: ["store-admin-overview", workingDate],
    staleTime: 60_000,
    queryFn: async () => {
      const [wy, wm, wd] = workingDate.split("-").map(Number);
      const dayStart = new Date(wy, (wm || 1) - 1, wd || 1); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
      const iso = dayStart.toISOString();
      const isoEnd = dayEnd.toISOString();
      const [orders, products, sales, purchases, customers, payments] = await Promise.all([
        supabase.from("shop_orders").select("status", { count: "exact", head: true }).eq("status", "pending").eq("is_deleted", false),
        supabase.from("shop_products").select("price,purchase_price,stock,min_stock").eq("is_deleted", false),
        supabase.from("shop_sales" as any).select("total,created_at").gte("created_at", iso).lte("created_at", isoEnd).eq("is_deleted", false),
        supabase.from("shop_purchases").select("total,created_at").gte("created_at", iso).lte("created_at", isoEnd).eq("is_deleted", false),
        supabase.from("pos_customers").select("opening_due").eq("is_active", true).eq("is_deleted", false),
        supabase.from("pos_payments" as any).select("amount,kind"),
      ]);
      const pendingOrders = orders.count ?? 0;
      // Vyapar parity: clamp negative stock to 0 in valuation (still visible elsewhere).
      const stockValue = (products.data ?? []).reduce((s, p: any) => {
        const qty = Math.max(0, Number(p.stock ?? 0));
        const cost = Number(p.purchase_price ?? 0) || Number(p.price ?? 0);
        return s + qty * cost;
      }, 0);
      const lowStock = (products.data ?? []).filter((p: any) => {
        const st = Number(p.stock ?? 0);
        const min = Number(p.min_stock ?? 0);
        return st <= 0 || (min > 0 && st <= min);
      }).length;
      const negativeStock = (products.data ?? []).filter((p: any) => Number(p.stock ?? 0) < 0).length;
      const todaySales = (sales.data ?? []).reduce((s: number, r: any) => s + Number(r.total ?? 0), 0);
      const todayPurchases = (purchases.data ?? []).reduce((s: number, r: any) => s + Number(r.total ?? 0), 0);

      // Customer due (approximation): sum of opening_due + (sales totals) – (payment_in totals)
      // Use sales totals + opening due − payments for a rough but cheap snapshot.
      const opening = (customers.data ?? []).reduce((s: number, r: any) => s + Number(r.opening_due ?? 0), 0);
      const allSalesQ = await supabase.from("shop_sales" as any).select("total,due_amount,customer_id").eq("is_deleted", false);
      const dueSum = (allSalesQ.data ?? []).reduce((s: number, r: any) => s + Number(r.due_amount ?? 0), 0);
      const paidIn = (payments.data ?? []).filter((p: any) => p.kind === "payment_in").reduce((s: number, r: any) => s + Number(r.amount ?? 0), 0);
      const customerDue = Math.max(0, opening + dueSum - paidIn);

      return { pendingOrders, stockValue, lowStock, negativeStock, todaySales, todayPurchases, customerDue };
    },
  });

  const d = stats.data;
  return (
    <section>
      <SectionHeader title="Business overview" icon={LayoutGrid} hint="Today" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={ShoppingBag} label="Today sales"     value={d ? `SAR ${Math.round(d.todaySales).toLocaleString()}` : "—"} tone="primary" />
        <StatCard icon={Truck}       label="Today purchase"  value={d ? `SAR ${Math.round(d.todayPurchases).toLocaleString()}` : "—"} />
        <StatCard icon={Wallet}      label="Customer due"    value={d ? `SAR ${Math.round(d.customerDue).toLocaleString()}` : "—"} tone={d && d.customerDue > 0 ? "danger" : undefined} />
        <StatCard icon={Package}     label="Stock value"     value={d ? `SAR ${Math.round(d.stockValue).toLocaleString()}` : "—"} />
        <StatCard icon={ShoppingCart} label="Pending orders" value={d?.pendingOrders ?? "—"} tone={d && d.pendingOrders > 0 ? "primary" : undefined} />
      </div>
      {d && d.negativeStock > 0 && (
        <Link to="/low-stock" className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-[12px] text-rose-700 dark:text-rose-300 hover:bg-rose-500/10">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> ⚠ {d.negativeStock} product{d.negativeStock === 1 ? "" : "s"} need stock update (negative stock)</span>
          <span className="text-[11px] font-medium underline">Open Low Stock</span>
        </Link>
      )}
      {d && d.lowStock > 0 && (
        <Link to="/low-stock" className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[12px] text-amber-700 dark:text-amber-300 hover:bg-amber-500/10">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {d.lowStock} product{d.lowStock === 1 ? "" : "s"} low or out of stock</span>
          <span className="text-[11px] font-medium underline">View</span>
        </Link>
      )}
    </section>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number | string; tone?: "primary" | "danger" }) {
  const accent =
    tone === "primary" ? "bg-primary/10 text-primary"
    : tone === "danger" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    : "bg-muted text-muted-foreground";
  return (
    <Card className="flex items-center gap-2.5 p-2.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-[15px] font-bold leading-tight">{value}</p>
      </div>
    </Card>
  );
}

/* ============ QUICK ACTIONS ============ */

function QuickActions({
  onImport, onOrders, onSale, onPurchase, onPaymentIn, onAddCustomer, onBannerAds, activeBannerCount,
}: {
  onImport: () => void; onOrders: () => void; onSale: () => void;
  onPurchase: () => void; onPaymentIn: () => void; onAddCustomer: () => void;
  onBannerAds?: () => void; activeBannerCount?: number;
}) {
  return (
    <section>
      <SectionHeader title="Quick actions" />
      <Card className="p-2.5">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <ActionBtn icon={ShoppingBag} label="New sale"     onClick={onSale} accent />
          <ActionBtn icon={Truck}       label="New purchase" onClick={onPurchase} />
          <ActionBtn icon={Wallet}      label="Payment In"   onClick={onPaymentIn} />
          <ActionBtn icon={UserPlus}    label="Add customer" onClick={onAddCustomer} />
          <ActionBtn icon={FileSpreadsheet} label="Import Vyapar" onClick={onImport} />
          <ActionBtn icon={ShoppingCart} label="Open orders" onClick={onOrders} />
          <ActionBtn icon={Image} label="Banner Ads" onClick={onBannerAds} badge={activeBannerCount} />
        </div>
      </Card>
    </section>
  );
}

function ActionBtn({ icon: Icon, label, onClick, accent, badge }: { icon: any; label: string; onClick?: () => void; accent?: boolean; badge?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-medium leading-tight transition-all active:scale-95 ${
        accent
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-sm">
          {badge}
        </span>
      )}

      <Icon className="h-5 w-5" />
      <span className="text-center">{label}</span>
    </button>
  );
}




/* ============ ORDERS ============ */

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  preparing: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

function OrdersTab({ onConvert }: { onConvert: (o: Order) => void }) {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const { isAdmin, isSuperAdmin } = useUserAccess();
  const canDelete = isAdmin || isSuperAdmin;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const orders = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async (): Promise<Order[]> => {
      let q = supabase.from("shop_orders").select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
      if (statusFilter !== "all") q = q.eq("status", statusFilter as Order["status"]);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) => {
      const { error } = await supabase.from("shop_orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      setSelected(null);
      toast.success("Order updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const handleShareWhatsApp = (o: Order) => {
    const url = whatsappLink(o.customer_mobile, buildOrderMessage({
      customerName: o.customer_name,
      customerMobile: o.customer_mobile,
      items: o.items,
      total: Number(o.total),
      orderNumber: o.order_number,
      status: o.status,
    }));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (o: Order) => {
    const ok = await confirm({
      title: "Delete Order?",
      description: "This order will move to Recycle Bin. You can restore it later.",
      confirmText: "Delete Order",
      cancelText: "Cancel",
      tone: "warning",
      icon: "warning",
      details: [
        { label: "Order No", value: `#${o.order_number}` },
        { label: "Customer", value: o.customer_name },
        { label: "Mobile", value: o.customer_mobile || "—" },
        { label: "Total", value: `SAR ${Number(o.total).toFixed(2)}` },
        { label: "Items", value: `${o.items?.length ?? 0}` },
        { label: "Date", value: new Date(o.created_at).toLocaleString() },
        { label: "Status", value: o.status },
      ],
    });
    if (!ok) return;
    const { error } = await softDelete("shop_orders", o.id);
    if (error) { toast.error(error.message ?? "Failed to delete"); return; }
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    setSelected(null);
    toast.success("Order deleted", {
      description: `#${o.order_number} moved to Recycle Bin`,
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          const r = await restore("shop_orders", o.id);
          if (r.error) { toast.error(r.error.message ?? "Restore failed"); return; }
          qc.invalidateQueries({ queryKey: ["admin-orders"] });
          toast.success("Order restored");
        },
      },
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["admin-orders"] })}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {orders.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
       orders.data?.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No orders yet.</Card>
       ) : (
        <div className="space-y-2">
          {orders.data?.map(o => (
            <Card key={o.id} className="relative cursor-pointer p-4 hover:bg-muted/40" onClick={() => setSelected(o)}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">#{o.order_number}</span>
                    <Badge className={STATUS_COLORS[o.status]}>{o.status}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium">{o.customer_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.customer_mobile} · {o.items.length} items · {new Date(o.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-start gap-1">
                  <div className="text-right">
                    <p className="text-lg font-bold">SAR {Number(o.total).toFixed(2)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Order #{o.order_number}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelected(o); }}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelected(o); }}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShareWhatsApp(o); }}>
                        <MessageCircle className="mr-2 h-4 w-4" /> Share WhatsApp
                      </DropdownMenuItem>
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => { e.stopPropagation(); handleDelete(o); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
       )}


      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg p-0 gap-0 flex flex-col max-h-[90vh] overflow-hidden">
          {selected && (
            <>
              <DialogHeader className="shrink-0 border-b border-border px-5 py-3">
                <DialogTitle>Order #{selected.order_number}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="min-w-0"><p className="text-xs text-muted-foreground">Customer</p><p className="font-medium break-words">{selected.customer_name}</p></div>
                  <div className="min-w-0"><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium break-words">{selected.customer_mobile}</p></div>
                </div>
                {selected.customer_address && <div><p className="text-xs text-muted-foreground">Address</p><p className="break-words">{selected.customer_address}</p></div>}
                {selected.notes && <div><p className="text-xs text-muted-foreground">Customer notes</p><p className="break-words">{selected.notes}</p></div>}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select value={selected.status} onValueChange={(v) => updateStatus.mutate({ id: selected.id, status: v as Order["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Items ({selected.items.length})</p>
                  <div className="rounded-lg border border-border divide-y">
                    {selected.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex items-start justify-between gap-3 p-2">
                        <span className="min-w-0 flex-1 break-words text-[13px] leading-snug">{it.name} <span className="text-muted-foreground">× {it.qty}</span></span>
                        <span className="shrink-0 whitespace-nowrap font-medium tabular-nums text-[13px]">SAR {(it.qty * it.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between border-t border-border pt-2">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold tabular-nums">SAR {Number(selected.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="shrink-0 sticky bottom-0 z-10 flex-row flex-wrap gap-2 border-t border-border bg-background/95 backdrop-blur px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:gap-2">
                <Button variant="default" size="sm" className="gap-1" onClick={() => { onConvert(selected); }}>
                  <ArrowRight className="h-4 w-4" /> Convert
                </Button>
                <a
                  href={whatsappLink(selected.customer_mobile, buildOrderMessage({
                    customerName: selected.customer_name,
                    customerMobile: selected.customer_mobile,
                    items: selected.items,
                    total: Number(selected.total),
                    orderNumber: selected.order_number,
                    status: selected.status,
                  }))}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-medium text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ PRODUCTS ============ */

function ProductsTab({ onImport, onOpenBin }: { onImport: () => void; onOpenBin?: () => void }) {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const activeCategoryId = search.category ?? null;
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerDup, setScannerDup] = useState<{ id: string; name: string; barcode: string } | null>(null);

  async function handleProductScan(code: string) {
    if (!editing) return;
    // Backward compat: a scanned code may live in item_code (Product Barcode)
    // or in the legacy barcode column. Check both.
    const { data } = await supabase
      .from("shop_products")
      .select("id,name,item_code,barcode")
      .or(`item_code.eq.${code},barcode.eq.${code}`)
      .eq("is_deleted", false)
      .limit(1)
      .maybeSingle();
    if (data && data.id !== editing.id) {
      setScannerOpen(false);
      setScannerDup({ id: data.id, name: data.name, barcode: code });
      return;
    }
    setEditing({ ...editing, item_code: code });
    setScannerOpen(false);
    toast.success(`Product barcode set: ${code}`);
  }
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "zero" | "negative">("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const [nameFocused, setNameFocused] = useState(false);
  const nextProductFieldRef = useRef<HTMLInputElement | null>(null);
  const [printOpen, setPrintOpen] = useState(false);

  // Auto-open New Product dialog when arriving with ?newName=...
  useEffect(() => {
    const n = search.newName;
    if (!n || editing) return;
    setEditing({
      name: n,
      is_visible: true,
      show_stock: true,
      tax_rate: 15,
      compare_price: null,
      category_id: activeCategoryId,
    } as Partial<Product>);
    navigate({ search: (p: any) => ({ ...p, newName: undefined }), replace: true, resetScroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.newName]);




  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from("shop_products").select("*").eq("is_deleted", false).order("sort_order").order("name");
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const cats = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase.from("shop_categories").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
  const catMap = useMemo(
    () => new Map((cats.data ?? []).map((c) => [c.id, c])),
    [cats.data],
  );
  const activeCategory = activeCategoryId ? catMap.get(activeCategoryId) : null;

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    const q = debouncedQuery.trim().toLowerCase();
    const matchScore = (p: Product): number => {
      if (!q) return 0;
      const cName = (p.category_id && catMap.get(p.category_id)?.name) || "";
      const fields = [p.name, p.name_bn, p.name_ar, p.item_code, p.barcode, cName];
      let best = 0;
      for (const f of fields) {
        const v = (f ?? "").toString().toLowerCase();
        if (!v) continue;
        if (v === q) { best = Math.max(best, 4); continue; }
        if (v.startsWith(q)) { best = Math.max(best, 3); continue; }
        if (v.includes(" " + q)) { best = Math.max(best, 2); continue; }
        if (v.includes(q)) { best = Math.max(best, 1); }
      }
      return best;
    };
    const productInCategory = (p: Product, catId: string) => {
      if (p.category_id === catId) return true;
      const ids = Array.isArray(p.category_ids) ? p.category_ids : [];
      return ids.includes(catId);
    };
    return list
      .filter((p) => {
        if (activeCategoryId && !productInCategory(p, activeCategoryId)) return false;
        const st = Number(p.stock ?? 0);
        const min = Number(p.min_stock ?? 0);
        if (stockFilter === "in") return st > 0 && !(min > 0 && st <= min);
        if (stockFilter === "low") return min > 0 && st > 0 && st <= min;
        if (stockFilter === "zero") return st === 0;
        if (stockFilter === "negative") return st < 0;
        return true;
      })
      .map((p, i) => ({ p, i, score: matchScore(p) }))
      .filter((x) => !q || x.score > 0)
      .sort((a, b) => (b.score - a.score) || (a.i - b.i))
      .map((x) => x.p);
  }, [products.data, catMap, debouncedQuery, activeCategoryId, stockFilter]);

  const openNewProductFromSearch = useCallback(() => {
    const name = query.trim();
    if (!name) return;
    setEditing({
      name,
      is_visible: true,
      show_stock: true,
      price: undefined as any,
      compare_price: null,
      purchase_price: undefined as any,
      stock: undefined as any,
      min_stock: undefined as any,
      tax_rate: 15,
      category_id: activeCategoryId ?? null,
      category_ids: activeCategoryId ? [activeCategoryId] : [],
    });
    window.setTimeout(() => nextProductFieldRef.current?.focus(), 0);
  }, [activeCategoryId, query]);

  // Reset progressive window when filters/search change
  useEffect(() => {
    setVisibleCount(30);
  }, [debouncedQuery, stockFilter, activeCategoryId]);

  const totalCount = filtered.length;
  const hasMore = visibleCount < totalCount;

  // Infinite-scroll sentinel.
  // IMPORTANT: re-create the observer whenever visibleCount/total changes so
  // it re-fires even when the sentinel never leaves the viewport between batches.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => (c < totalCount ? Math.min(c + 30, totalCount) : c));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visibleCount, totalCount]);

  const visible = useMemo(() => {
    // Slice + de-dupe by id as a safety net against any duplicate rows
    const slice = filtered.slice(0, visibleCount);
    const seen = new Set<string>();
    const out: Product[] = [];
    for (const p of slice) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      out.push(p);
    }
    return out;
  }, [filtered, visibleCount]);


  // Live duplicate-name autocomplete for the New Product dialog.
  // Debounced to 500ms + minimum 4 chars to keep the form lightweight.
  const rawName = (!editing || editing.id) ? "" : (editing.name ?? "");
  const debouncedName = useDebouncedValue(rawName, 500);
  const nameSuggestions = useMemo(() => {
    if (!editing || editing.id) return [] as Product[];
    const q = debouncedName.trim().replace(/\s+/g, " ").toLowerCase();
    if (q.length < 4) return [];
    const list = products.data ?? [];
    const score = (p: Product) => {
      const v = (p.name ?? "").replace(/\s+/g, " ").toLowerCase();
      if (!v) return -1;
      if (v === q) return 4;
      if (v.startsWith(q)) return 3;
      if (v.includes(" " + q)) return 2;
      if (v.includes(q)) return 1;
      return -1;
    };
    return list
      .map((p) => ({ p, s: score(p) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || (a.p.name ?? "").length - (b.p.name ?? "").length)
      .slice(0, 5)
      .map((x) => x.p);
  }, [editing, debouncedName, products.data]);


  const findDuplicate = useCallback((p: Partial<Product>): Product | null => {
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

    mutationFn: async (p: Partial<Product>) => {
      const payload: any = {
        name: p.name?.trim() ?? "",
        name_bn: p.name_bn?.trim() || null,
        name_ar: p.name_ar?.trim() || null,
        description: p.description?.trim() || null,
        image_url: p.image_url?.trim() || null,
        gallery_image_urls: Array.isArray(p.gallery_image_urls)
          ? p.gallery_image_urls.filter((u): u is string => typeof u === "string" && u.length > 0)
          : [],
        item_code: p.item_code?.trim() || null,
        barcode: p.barcode?.trim() || null,
        price: Number(p.price ?? 0),
        compare_price: p.compare_price == null || (p.compare_price as any) === "" ? null : Number(p.compare_price),
        purchase_price: Number(p.purchase_price ?? 0),
        tax_rate: Number(p.tax_rate ?? 15),
        tax_inclusive: true,
        stock: Number(p.stock ?? 0),
        min_stock: Number(p.min_stock ?? 0),
        category_id: p.category_id || (Array.isArray(p.category_ids) && p.category_ids[0]) || null,
        category_ids: Array.isArray(p.category_ids) ? p.category_ids.filter(Boolean) : (p.category_id ? [p.category_id] : []),
        is_visible: p.is_visible ?? true,
        is_featured: p.is_featured ?? false,
        show_stock: p.show_stock ?? true,
        sort_order: Number(p.sort_order ?? 0),
      };
      if (!payload.name) throw new Error("Name required");
      if (p.id) {
        const { error } = await supabase.from("shop_products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shop_products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-products"] });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const invalidateProductLists = useCallback(() => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["store-products"] });
  }, [qc]);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await softDelete("shop_products", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: (id) => {
      invalidateProductLists();
      setDeleteTarget(null);
      toast.success("Product deleted", {
        description: "Moved to Recycle Bin.",
        duration: 5000,
        action: {
          label: "Undo",
          onClick: async () => {
            const r = await restore("shop_products", id);
            if (r.error) toast.error(r.error.message);
            else { invalidateProductLists(); toast.success("Restored"); }
          },
        },
        cancel: onOpenBin
          ? { label: "View Bin", onClick: () => onOpenBin() }
          : undefined,
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });


  const bulkRemove = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(ids.map((id) => softDelete("shop_products", id)));
      const fail = results.find((r) => r.error);
      if (fail?.error) throw new Error(fail.error.message);
      return ids.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-products"] });
      setSelected(new Set());
      setSelectMode(false);
      setConfirmBulk(false);
      toast.success(`${count} product(s) moved to Recycle Bin`);
    },
    onError: (e: any) => { setConfirmBulk(false); toast.error(e?.message ?? "Failed"); },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: "is_visible" | "is_featured"; value: boolean }) => {
      const patch = field === "is_visible" ? { is_visible: value } : { is_featured: value };
      const { error } = await supabase.from("shop_products").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-products"] }),
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
    return { all: list.length, in: inS, low, zero, negative: neg };
  })();
  const filterChips: { key: typeof stockFilter; label: string; count: number; tone?: string }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "in", label: "In stock", count: counts.in, tone: "text-emerald-700 dark:text-emerald-300" },
    { key: "low", label: "Low", count: counts.low, tone: "text-amber-700 dark:text-amber-300" },
    { key: "zero", label: "Zero", count: counts.zero, tone: "text-orange-700 dark:text-orange-300" },
    { key: "negative", label: "Negative", count: counts.negative, tone: "text-rose-700 dark:text-rose-300" },
  ];
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const enterSelect = (id?: string) => {
    setSelectMode(true);
    if (id) setSelected(new Set([id]));
  };

  // Long-press handler (mobile)
  let pressTimer: any = null;
  const onPressStart = (id: string) => {
    pressTimer = setTimeout(() => enterSelect(id), 450);
  };
  const onPressEnd = () => { if (pressTimer) clearTimeout(pressTimer); };

  const noMatch =
    !products.isLoading && debouncedQuery.trim().length > 0 && filtered.length === 0;

  return (
    <div>
      {/* Compact sticky toolbar: search + 3-dot actions */}
      <div className="sticky top-0 z-30 -mx-1 mb-2 bg-background/95 px-1 pb-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, barcode, SKU…"
              className="h-10 rounded-xl pl-9 pr-9 text-sm"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Clear"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          {noMatch && (
            <Button
              type="button"
              size="icon"
              onClick={openNewProductFromSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
              title={`Add "${debouncedQuery.trim()}" as new product`}
              aria-label="Add new product"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {!selectMode ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl" aria-label="Product actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onSelect={() => setEditing({ is_visible: true, show_stock: true, price: undefined as any, compare_price: null, purchase_price: undefined as any, stock: undefined as any, min_stock: undefined as any, tax_rate: 15, category_id: activeCategoryId ?? null, category_ids: activeCategoryId ? [activeCategoryId] : [] })}>
                  <Plus className="me-2 h-4 w-4" /> New product
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectMode(true)}>
                  <CheckSquare className="me-2 h-4 w-4" /> Select / Bulk
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onImport}>
                  <FileSpreadsheet className="me-2 h-4 w-4" /> Import
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPrintOpen(true)}>
                  <Printer className="me-2 h-4 w-4" /> Print Product List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex shrink-0 items-center gap-1.5">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => setSelected(v ? new Set(allIds) : new Set())}
                aria-label="Select all"
              />
              <span className="text-[11px] text-muted-foreground">{selected.size}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {noMatch && (
          <p className="mt-1.5 px-1 text-[12px] text-muted-foreground">
            No Match Found —{" "}
            <button
              type="button"
              onClick={openNewProductFromSearch}
              className="font-medium text-emerald-600 hover:underline"
            >
              Add &quot;{debouncedQuery.trim()}&quot; as new product
            </button>
          </p>
        )}
      </div>


      {activeCategory && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5">
          <Tag className="h-3.5 w-3.5 text-primary" />
          <span className="text-[12px]">
            <b>{activeCategory.name}</b> · {filtered.length}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-7 px-2"
            onClick={() => navigate({ search: (p: any) => ({ ...p, category: undefined }), replace: true })}
          >
            <XIcon className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      )}

      <div className="mb-2 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {filterChips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setStockFilter(c.key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${
              stockFilter === c.key
                ? "border-primary bg-primary text-primary-foreground"
                : `border-border bg-background hover:bg-muted ${c.tone ?? ""}`
            }`}
          >
            {c.label} <span className="opacity-70">({c.count})</span>
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {products.isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                selectMode={selectMode}
                isSelected={selected.has(p.id)}
                onToggleSelect={toggleOne}
                onPressStart={onPressStart}
                onPressEnd={onPressEnd}
                onEdit={setEditing}
                onToggleVisible={(id, value) => toggle.mutate({ id, field: "is_visible", value })}
                onAskDelete={setDeleteTarget}
              />
            ))}
      </div>

      {/* Infinite-scroll sentinel */}
      {hasMore ? (
        <div ref={sentinelRef} className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={`more-${i}`} />)}
        </div>
      ) : (
        !products.isLoading && totalCount > 0 && (
          <div className="py-4 text-center text-[11px] text-muted-foreground">
            All products loaded · {totalCount}
          </div>
        )
      )}
      {!products.isLoading && filtered.length === 0 && !debouncedQuery.trim() && (
        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl">📦</div>
          <div className="text-base font-semibold">No products yet</div>
          <div className="mt-1 text-[12.5px] text-muted-foreground">Add your first product to get started.</div>
        </div>
      )}




      {/* Sticky bulk action bar */}
      {selectMode && selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(95vw,32rem)] items-center justify-between gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-2xl backdrop-blur">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setSelected(new Set()); setSelectMode(false); }}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => setConfirmBulk(true)} disabled={bulkRemove.isPending} className="gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete {selected.size}
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={confirmBulk} onOpenChange={setConfirmBulk}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} product(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be moved to the Recycle Bin. You can restore them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => bulkRemove.mutate(Array.from(selected))} className="bg-destructive text-destructive-foreground">
              Move to Recycle Bin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Product images">
                <ProductGalleryUpload
                  mainUrl={editing.image_url}
                  gallery={editing.gallery_image_urls ?? []}
                  onMainChange={(url) => setEditing({ ...editing, image_url: url })}
                  onGalleryChange={(urls) => setEditing({ ...editing, gallery_image_urls: urls })}
                  searchHints={{ name: editing.name, barcode: editing.barcode, itemCode: editing.item_code }}
                />
              </Field>


              <Field label="Product name (English) *">
                <div className="relative">
                  <Input
                    value={editing.name ?? ""}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setTimeout(() => setNameFocused(false), 150)}
                    autoComplete="off"
                  />
                  {!editing.id && nameFocused && nameSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                      <div className="border-b border-border bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900">
                        ⚠️ Possible existing products — tap to edit instead
                      </div>
                      {nameSuggestions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setNameFocused(false);
                            setEditing(p as any);
                            toast.message("⚠️ এই প্রোডাক্টটি আগে থেকেই আছে। নতুন প্রোডাক্ট তৈরির পরিবর্তে বিদ্যমান প্রোডাক্টটি খোলা হয়েছে।");
                          }}
                          className="flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors hover:bg-muted"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                            {p.image_url
                              ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                              : <span className="text-[10px] text-muted-foreground">No img</span>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {p.item_code ? `#${p.item_code}` : "No barcode"} • Stock: {Number(p.stock ?? 0)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {!editing.id && nameFocused && debouncedName.trim().length >= 4 && nameSuggestions.length === 0 && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800 shadow-sm">
                      ✅ নতুন প্রোডাক্ট তৈরি করা যাবে।

                    </div>
                  )}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name (Bengali)"><Input ref={nextProductFieldRef} value={editing.name_bn ?? ""} onChange={e => setEditing({ ...editing, name_bn: e.target.value })} /></Field>
                <Field label="Name (Arabic)"><Input dir="rtl" className="text-right" value={editing.name_ar ?? ""} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
              </div>





              <Field label="Product Barcode">
                <div className="flex gap-1.5">
                  <Input
                    value={editing.item_code ?? ""}
                    onChange={e => setEditing({ ...editing, item_code: e.target.value })}
                    placeholder="Scan or type barcode / SKU"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => setScannerOpen(true)} title="Scan product barcode">
                    <ScanLine className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Sale price (SAR, VAT incl.)">
                  <Input type="number" step="0.01" value={editing.price ?? ""} placeholder="" onChange={e => setEditing({ ...editing, price: e.target.value === "" ? (undefined as any) : Number(e.target.value) })} />
                </Field>
                <Field label="Purchase price (SAR)">
                  <Input type="number" step="0.01" value={editing.purchase_price ?? ""} placeholder="" onChange={e => setEditing({ ...editing, purchase_price: e.target.value === "" ? (undefined as any) : Number(e.target.value) })} />
                </Field>
              </div>

              <Field label="Other Company Price (SAR) — optional, shown to customers as strike-through">
                <Input
                  type="number"
                  step="0.01"
                  value={editing.compare_price ?? ""}
                  placeholder="Leave empty to hide comparison"
                  onChange={e => setEditing({ ...editing, compare_price: e.target.value === "" ? null : Number(e.target.value) })}
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Tax %"><Input type="number" step="0.01" value={editing.tax_rate ?? 15} onChange={e => setEditing({ ...editing, tax_rate: Number(e.target.value) })} /></Field>
                <Field label="Stock"><Input type="number" value={editing.stock ?? ""} placeholder="" onChange={e => setEditing({ ...editing, stock: e.target.value === "" ? (undefined as any) : Number(e.target.value) })} /></Field>
                <Field label="Min stock"><Input type="number" value={editing.min_stock ?? ""} placeholder="" onChange={e => setEditing({ ...editing, min_stock: e.target.value === "" ? (undefined as any) : Number(e.target.value) })} /></Field>
              </div>

              <Field label="Categories (select one or more)">
                <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-border p-2">
                  {(cats.data ?? []).length === 0 && (
                    <span className="text-xs text-muted-foreground">No categories yet.</span>
                  )}
                  {(cats.data ?? []).map((c) => {
                    const ids = new Set(Array.isArray(editing.category_ids) ? editing.category_ids : (editing.category_id ? [editing.category_id] : []));
                    const on = ids.has(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          on ? ids.delete(c.id) : ids.add(c.id);
                          const arr = Array.from(ids);
                          setEditing({ ...editing, category_ids: arr, category_id: arr[0] ?? null });
                        }}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Description"><Textarea rows={2} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>

              <div className="grid grid-cols-3 gap-2">
                <ToggleRow label="Website visible" value={editing.is_visible ?? true} onChange={(v) => setEditing({ ...editing, is_visible: v })} />
                <ToggleRow label="Featured" value={editing.is_featured ?? false} onChange={(v) => setEditing({ ...editing, is_featured: v })} />
                <ToggleRow label="Show stock" value={editing.show_stock ?? true} onChange={(v) => setEditing({ ...editing, show_stock: v })} />
              </div>

              <p className="rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
                Sale price is the final price customers pay — 15% VAT is already included.
                If you enter <b>SAR 15</b>, the customer sees <b>SAR 15</b>.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => {
              if (!editing) return;
              const dup = findDuplicate(editing);
              if (dup) {
                toast.error("⚠️ এই প্রোডাক্টটি ইতিমধ্যে রয়েছে। অনুগ্রহ করে বিদ্যমান প্রোডাক্টটি Edit করুন।");
                setEditing(dup as any);
                return;
              }
              save.mutate(editing);
            }}>Save</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BarcodeScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        mode="single"
        title="Scan product barcode"
        onDetected={handleProductScan}
      />

      <AlertDialog open={!!scannerDup} onOpenChange={(v) => !v && setScannerDup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Barcode already exists</AlertDialogTitle>
            <AlertDialogDescription>
              The barcode <b>{scannerDup?.barcode}</b> is already assigned to <b>{scannerDup?.name}</b>. Duplicates are not allowed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setScannerDup(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!scannerDup) return;
                const { data } = await supabase.from("shop_products").select("*").eq("id", scannerDup.id).maybeSingle();
                if (data) setEditing(data as any);
                setScannerDup(null);
              }}
            >Open existing product</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteProductDialog
        product={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
        pending={remove.isPending}
      />

      <PrintProductListDialog
        open={printOpen}
        onOpenChange={setPrintOpen}
        products={filtered as any}
        categoryMap={catMap as any}
      />
    </div>
  );
}

/* ============ Product list helpers ============ */

type ProductCardProps = {
  product: Product;
  selectMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onPressStart: (id: string) => void;
  onPressEnd: () => void;
  onEdit: (p: Product) => void;
  onToggleVisible: (id: string, value: boolean) => void;
  onAskDelete: (p: Product) => void;
};

const ProductCard = memo(function ProductCard({
  product: p, selectMode, isSelected, onToggleSelect,
  onPressStart, onPressEnd, onEdit, onToggleVisible, onAskDelete,
}: ProductCardProps) {
  return (
    <Card
      className={`p-2 transition-colors ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""} ${selectMode ? "cursor-pointer" : ""}`}
      onClick={selectMode ? () => onToggleSelect(p.id) : undefined}
      onTouchStart={() => onPressStart(p.id)}
      onTouchEnd={onPressEnd}
      onTouchMove={onPressEnd}
      onMouseDown={() => onPressStart(p.id)}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
    >
      <div className="flex gap-2">
        {selectMode && (
          <div className="flex items-center">
            <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(p.id)} onClick={(e) => e.stopPropagation()} />
          </div>
        )}
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight text-foreground">{p.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] leading-tight">
            <span><span className="text-muted-foreground">Sale:</span> <span className="font-semibold text-emerald-600 dark:text-emerald-400">SAR {Number(p.price).toFixed(0)}</span></span>
            <span><span className="text-muted-foreground">Purchase:</span> <span className="font-semibold text-blue-600 dark:text-blue-400">SAR {Number(p.purchase_price ?? 0).toFixed(0)}</span></span>
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground">Stock:</span> <span className="font-semibold text-violet-600 dark:text-violet-400">{p.stock}</span>
              {Number(p.stock) < 0 && <span className="inline-flex items-center rounded-full bg-rose-500 px-1.5 py-0 text-[9px] font-semibold text-white">Negative</span>}
              {Number(p.stock) === 0 && <span className="inline-flex items-center rounded-full bg-orange-500 px-1.5 py-0 text-[9px] font-semibold text-white">Out</span>}
              {Number(p.stock) > 0 && Number(p.min_stock) > 0 && Number(p.stock) <= Number(p.min_stock) && (
                <span className="inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0 text-[9px] font-semibold text-white">Low</span>
              )}
              {!p.is_visible && <span className="inline-flex items-center rounded-full border border-border bg-background px-1.5 py-0 text-[9px] font-semibold text-muted-foreground">Hidden</span>}
            </span>
            {p.is_featured && <span className="inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0 text-[9px] font-semibold text-white">★</span>}
          </div>
        </div>
        {!selectMode && (
          <div className="flex items-center gap-1 self-center">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEdit(p); }}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onToggleVisible(p.id, !p.is_visible); }}>
              {p.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onAskDelete(p); }}>
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
});

function ProductCardSkeleton() {
  return (
    <Card className="p-2">
      <div className="flex gap-2">
        <div className="h-12 w-12 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
        <div className="min-w-0 flex-1 space-y-1.5 py-1">
          <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-4/5 animate-pulse rounded bg-muted/70" />
        </div>
      </div>
    </Card>
  );
}

function DeleteProductDialog({
  product, onOpenChange, onConfirm, pending,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl border-border/60 bg-background/95 p-0 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:rounded-2xl">
        {product && (
          <div className="p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogHeader className="mt-3 space-y-1">
                <DialogTitle className="text-[15px] font-display">Delete Product?</DialogTitle>
              </DialogHeader>
              <p className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                This product will move to Recycle Bin.<br />You can restore it later.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {product.image_url && <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-semibold leading-tight">{product.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-tight text-muted-foreground">
                  <span>Stock <span className="font-semibold text-violet-600 dark:text-violet-400">{product.stock}</span></span>
                  <span>Sale <span className="font-semibold text-emerald-600 dark:text-emerald-400">SAR {Number(product.price).toFixed(0)}</span></span>
                  <span>Purchase <span className="font-semibold text-blue-600 dark:text-blue-400">SAR {Number(product.purchase_price ?? 0).toFixed(0)}</span></span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)} disabled={pending}>
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-sm hover:brightness-110"
                onClick={onConfirm}
                disabled={pending}
              >
                {pending ? "Deleting…" : "Delete Product"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


/* ============ CATEGORIES ============ */

function CategoriesTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [drillCatId, setDrillCatId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const cats = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase.from("shop_categories").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase.from("shop_products").select("*").eq("is_deleted", false).order("name");
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const inCat = (p: Product, id: string) => p.category_id === id || (Array.isArray(p.category_ids) && p.category_ids.includes(id));

  const counts = useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const p of products.data ?? []) {
      const ids = new Set<string>();
      if (p.category_id) ids.add(p.category_id);
      (p.category_ids ?? []).forEach((x) => x && ids.add(x));
      ids.forEach((id) => { out[id] = (out[id] ?? 0) + 1; });
    }
    return out;
  }, [products.data]);

  const save = useMutation({
    mutationFn: async (c: Partial<Category>) => {
      const payload = {
        name: c.name?.trim() ?? "",
        name_bn: c.name_bn?.trim() || null,
        name_ar: c.name_ar?.trim() || null,
        icon: c.icon?.trim() || null,
        sort_order: Number(c.sort_order ?? 0),
        is_active: c.is_active ?? true,
        slug: c.slug?.trim() ? c.slug.trim().toLowerCase() : null,
      };
      if (!payload.name) throw new Error("Name required");
      if (c.id) {
        const { error } = await supabase.from("shop_categories").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shop_categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shop_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, dir }: { id: string; dir: -1 | 1 }) => {
      const list = [...(cats.data ?? [])];
      const idx = list.findIndex((c) => c.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= list.length) return;
      const a = list[idx], b = list[swap];
      const aOrder = a.sort_order ?? 0, bOrder = b.sort_order ?? 0;
      await supabase.from("shop_categories").update({ sort_order: bOrder }).eq("id", a.id);
      await supabase.from("shop_categories").update({ sort_order: aOrder }).eq("id", b.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
  });

  // Drilldown view
  if (drillCatId) {
    const cat = cats.data?.find((c) => c.id === drillCatId);
    if (!cat) {
      return (
        <div className="p-6 text-center text-sm text-muted-foreground">
          Category not found.{" "}
          <button className="text-primary underline" onClick={() => setDrillCatId(null)}>Go back</button>
        </div>
      );
    }
    return (
      <CategoryDrilldown
        category={cat}
        allProducts={products.data ?? []}
        productsLoading={products.isLoading}
        inCat={inCat}
        onBack={() => setDrillCatId(null)}
        onEdit={() => setEditing(cat)}
      />
    );
  }

  // List view
  const filteredCats = (cats.data ?? []).filter((c) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return (
      c.name.toLowerCase().includes(t) ||
      (c.name_bn ?? "").toLowerCase().includes(t) ||
      (c.name_ar ?? "").toLowerCase().includes(t)
    );
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{cats.data?.length ?? 0} categories</p>
        <Button onClick={() => setEditing({ is_active: true, sort_order: (cats.data?.length ?? 0) })}>
          <Plus className="me-1 h-4 w-4" /> New category
        </Button>
      </div>

      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search categories…"
          className="h-11 rounded-xl pl-9 text-sm"
          inputMode="search"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filteredCats.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No categories.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filteredCats.map((c, i) => {
              const count = counts[c.id] ?? 0;
              return (
                <li key={c.id} className="flex items-center gap-2 px-3 py-3">
                  <button
                    type="button"
                    onClick={() => setDrillCatId(c.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                      {c.icon
                        ? <img src={c.icon} alt="" loading="lazy" className="h-full w-full object-cover" />
                        : <Tag className="h-4 w-4 text-primary/60" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold leading-tight">{c.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {count} product{count === 1 ? "" : "s"}{!c.is_active ? " · Hidden" : ""}
                      </p>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button size="icon" variant="ghost" className="h-8 w-8" disabled={i === 0 || !!q.trim()} onClick={() => reorder.mutate({ id: c.id, dir: -1 })}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" disabled={i === filteredCats.length - 1 || !!q.trim()} onClick={() => reorder.mutate({ id: c.id, dir: 1 })}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => confirm(`Delete "${c.name}"?`) && remove.mutate(c.id)}>
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Category image / icon">
                <ProductImageUpload
                  value={editing.icon ?? null}
                  onChange={(url) => setEditing({ ...editing, icon: url })}
                  searchHints={{ name: editing.name }}
                />
              </Field>
              <Field label="Name *"><Input value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name (Bengali)"><Input value={editing.name_bn ?? ""} onChange={e => setEditing({ ...editing, name_bn: e.target.value })} /></Field>
                <Field label="Name (Arabic)"><Input dir="rtl" className="text-right" value={editing.name_ar ?? ""} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} /></Field>
              </div>
              <Field label="Sort order"><Input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
              <Field label="Smart section (optional)">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value || null })}
                >
                  <option value="">— None —</option>
                  <option value="recommended">⭐ Recommended (top of home)</option>
                  <option value="best-seller">🔥 Best Seller</option>
                  <option value="new-arrival">🆕 New Arrival</option>
                  <option value="offer">🏷 Offer Items</option>
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Products assigned here automatically appear in the matching home section on the customer website.
                </p>
              </Field>
              <ToggleRow label="Active" value={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => editing && save.mutate(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ CATEGORY DRILLDOWN ============ */

function CategoryDrilldown({
  category, allProducts, productsLoading, inCat, onBack, onEdit,
}: {
  category: Category;
  allProducts: Product[];
  productsLoading: boolean;
  inCat: (p: Product, id: string) => boolean;
  onBack: () => void;
  onEdit: () => void;
}) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "zero" | "negative">("all");
  const [pickerOpen, setPickerOpen] = useState(false);

  const matches = (p: Product) => {
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
    return { all: inThisCat.length, in: inS, low, zero, negative: neg };
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

  const chips: { key: typeof stockFilter; label: string; count: number; tone?: string }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "in", label: "In stock", count: counts.in, tone: "text-emerald-700 dark:text-emerald-300" },
    { key: "low", label: "Low", count: counts.low, tone: "text-amber-700 dark:text-amber-300" },
    { key: "zero", label: "Zero", count: counts.zero, tone: "text-orange-700 dark:text-orange-300" },
    { key: "negative", label: "Negative", count: counts.negative, tone: "text-rose-700 dark:text-rose-300" },
  ];

  const removeFromCat = useMutation({
    mutationFn: async (productId: string) => {
      const p = allProducts.find((x) => x.id === productId);
      if (!p) return;
      const current = new Set<string>(Array.isArray(p.category_ids) ? p.category_ids : []);
      if (p.category_id) current.add(p.category_id);
      current.delete(category.id);
      const arr = Array.from(current);
      const { error } = await supabase
        .from("shop_products")
        .update({ category_ids: arr, category_id: p.category_id === category.id ? (arr[0] ?? null) : p.category_id })
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-products"] });
      toast.success("Removed from category");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const linkProducts = useMutation({
    mutationFn: async (ids: string[]) => {
      const ops = ids.map(async (pid) => {
        const p = allProducts.find((x) => x.id === pid);
        const current = new Set<string>(Array.isArray(p?.category_ids) ? p!.category_ids! : []);
        if (p?.category_id) current.add(p.category_id);
        current.add(category.id);
        const arr = Array.from(current);
        const patch: any = { category_ids: arr };
        if (!p?.category_id) patch.category_id = category.id;
        return supabase.from("shop_products").update(patch).eq("id", pid);
      });
      const res = await Promise.all(ops);
      const fail = res.find((r) => r.error);
      if (fail?.error) throw fail.error;
      return ids.length;
    },
    onSuccess: (n) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-products"] });
      setPickerOpen(false);
      toast.success(`${n} product(s) added`);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <div className="relative pb-20">
      <div className="mb-3 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ms-2 gap-1.5">
          <ChevronUp className="h-4 w-4 -rotate-90" /> Categories
        </Button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight">{category.name}</h3>
          <p className="text-[11px] text-muted-foreground">{inThisCat.length} product{inThisCat.length === 1 ? "" : "s"}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products in this category…"
          className="h-11 rounded-xl pl-9 text-sm"
          inputMode="search"
        />
      </div>

      <div className="mb-3 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setStockFilter(c.key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${
              stockFilter === c.key
                ? "border-primary bg-primary text-primary-foreground"
                : `border-border bg-background hover:bg-muted ${c.tone ?? ""}`
            }`}
          >
            {c.label} <span className="opacity-70">({c.count})</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {productsLoading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {inThisCat.length === 0 ? "No products in this category yet. Tap + to add some." : "No products match."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((p) => {
              const st = Number(p.stock ?? 0);
              const min = Number(p.min_stock ?? 0);
              const stockTone = st < 0 ? "text-rose-600" : st === 0 ? "text-orange-600" : (min > 0 && st <= min) ? "text-amber-600" : "text-emerald-700";
              return (
                <li key={p.id} className="flex items-center gap-2 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold leading-tight">{p.name}</p>
                    <p className="text-[12px] text-muted-foreground">
                      Stock: <b className={stockTone}>{p.stock}</b>
                      {" | "}Purchase: SAR {Number(p.purchase_price ?? 0).toFixed(2)}
                      {" | "}Sale: SAR {Number(p.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => confirm(`Remove "${p.name}" from ${category.name}?`) && removeFromCat.mutate(p.id)}
                    aria-label="Remove from category"
                  >
                    <XIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-95"
        aria-label="Add products"
      >
        <Plus className="h-6 w-6" />
      </button>

      <ProductPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        categoryName={category.name}
        candidates={allProducts.filter((p) => !inCat(p, category.id))}
        busy={linkProducts.isPending}
        onConfirm={(ids) => linkProducts.mutate(ids)}
      />
    </div>
  );
}

function ProductPickerDialog({
  open, onClose, categoryName, candidates, busy, onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  candidates: Product[];
  busy: boolean;
  onConfirm: (ids: string[]) => void;
}) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => { if (!open) { setQ(""); setPicked(new Set()); } }, [open]);

  const t = q.trim().toLowerCase();
  const filtered = candidates.filter((p) =>
    !t || [p.name, p.name_bn, p.name_ar, p.item_code, p.barcode].some((v) => (v ?? "").toString().toLowerCase().includes(t))
  );

  const toggle = (id: string) => {
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[92vh] max-w-md flex-col p-0">
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle>Add products to {categoryName}</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border p-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-3.5-3.5"/></svg>
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="h-11 rounded-xl pl-9 text-sm"
              inputMode="search"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {candidates.length === 0 ? "All products are already in this category." : "No matches."}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((p) => {
                const on = picked.has(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${on ? "bg-primary/10" : "hover:bg-muted/60"}`}
                    >
                      <Checkbox checked={on} onCheckedChange={() => toggle(p.id)} onClick={(e) => e.stopPropagation()} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold leading-tight">{p.name}</p>
                        <p className="text-[11.5px] text-muted-foreground">
                          Stock: {p.stock} · Sale: SAR {Number(p.price ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DialogFooter className="border-t border-border p-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            disabled={picked.size === 0 || busy}
            onClick={() => onConfirm(Array.from(picked))}
            className="flex-1"
          >
            {busy ? "Adding…" : `Add ${picked.size || ""}`.trim()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============ AD POPUP ============ */

type ShopAdRow = {
  id: string;
  title: string | null;
  image_url: string | null;
  placement: "home" | "success" | "both";
  link_type: "none" | "product" | "category" | "url";
  link_value: string | null;
  is_active: boolean;
  sort_order: number;
};

function AdsTab() {
  return (
    <div className="space-y-6">
      <ShopAdsManager />
      <PromoPopupEditor />
    </div>
  );
}

function ShopAdsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ShopAdRow> | null>(null);

  const list = useQuery({
    queryKey: ["admin-shop-ads"],
    queryFn: async (): Promise<ShopAdRow[]> => {
      const { data, error } = await (supabase as any)
        .from("shop_ads").select("id,title,image_url,placement,link_type,link_value,is_active,sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ShopAdRow[];
    },
  });

  const products = useQuery({
    queryKey: ["admin-shop-ads-products"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_products").select("id,name").eq("is_deleted", false).order("name");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const categories = useQuery({
    queryKey: ["admin-shop-ads-cats"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_categories").select("id,name").order("sort_order");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-shop-ads"] });
    qc.invalidateQueries({ queryKey: ["store-ads"] });
  };

  const save = useMutation({
    mutationFn: async (a: Partial<ShopAdRow>) => {
      const linkType = (a.link_type ?? "none") as ShopAdRow["link_type"];
      const payload: any = {
        title: a.title?.trim() || null,
        image_url: a.image_url?.trim() || null,
        placement: (a.placement ?? "home") as ShopAdRow["placement"],
        link_type: linkType,
        link_value: linkType === "none" ? null : (a.link_value?.trim() || null),
        is_active: a.is_active ?? true,
        sort_order: Number(a.sort_order ?? (list.data?.length ?? 0)),
      };
      if (a.id) {
        const { error } = await (supabase as any).from("shop_ads").update(payload).eq("id", a.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("shop_ads").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { invalidate(); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const toggle = useMutation({
    mutationFn: async (a: ShopAdRow) => {
      const { error } = await (supabase as any).from("shop_ads").update({ is_active: !a.is_active }).eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("shop_ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success("Deleted"); },
  });

  const reorder = useMutation({
    mutationFn: async ({ a, b }: { a: ShopAdRow; b: ShopAdRow }) => {
      const { error: e1 } = await (supabase as any).from("shop_ads").update({ sort_order: b.sort_order }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await (supabase as any).from("shop_ads").update({ sort_order: a.sort_order }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: invalidate,
  });

  const move = (idx: number, dir: -1 | 1) => {
    const rows = list.data ?? [];
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    // ensure unique sort order
    if (a.sort_order === b.sort_order) {
      (supabase as any).from("shop_ads").update({ sort_order: idx }).eq("id", a.id).then(() => {
        (supabase as any).from("shop_ads").update({ sort_order: target }).eq("id", b.id).then(invalidate);
      });
      return;
    }
    reorder.mutate({ a, b });
  };

  const placementLabel = (p: string) => p === "home" ? "Home" : p === "success" ? "Order Success" : "Both";
  const linkLabel = (a: ShopAdRow) => {
    if (a.link_type === "none" || !a.link_value) return "No link";
    if (a.link_type === "product") return "Product: " + (products.data?.find(p => p.id === a.link_value)?.name ?? "—");
    if (a.link_type === "category") return "Category: " + (categories.data?.find(c => c.id === a.link_value)?.name ?? "—");
    return a.link_value;
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Banner ads</h3>
          <p className="text-xs text-muted-foreground">Simple banners for the home page and order success page.</p>
        </div>
        <Button onClick={() => setEditing({ is_active: true, placement: "home", link_type: "none", sort_order: (list.data?.length ?? 0) })}>
          <Plus className="me-1 h-4 w-4" /> New banner
        </Button>
      </div>

      {list.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !list.data?.length ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          No banners yet. Click <strong>New banner</strong> to add one.
        </Card>
      ) : (
        <div className="space-y-2">
          {list.data.map((a, idx) => (
            <Card key={a.id} className="flex items-start gap-3 p-3">
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === 0} onClick={() => move(idx, -1)}><ChevronUp className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={idx === (list.data?.length ?? 0) - 1} onClick={() => move(idx, 1)}><ChevronDown className="h-4 w-4" /></Button>
              </div>
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {a.image_url ? (
                  <img src={a.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No image</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate font-medium">{a.title || "(untitled)"}</p>
                  <Badge variant="outline" className="text-[10px]">{placementLabel(a.placement)}</Badge>
                  {!a.is_active && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                </div>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{linkLabel(a)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Switch checked={a.is_active} onCheckedChange={() => toggle.mutate(a)} />
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => confirm("Delete this banner?") && remove.mutate(a.id)}>
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Banner image">
                <ProductImageUpload
                  value={editing.image_url ?? null}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  searchHints={{ name: editing.title ?? undefined }}
                />
              </Field>
              <Field label="Title (optional)">
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Weekend sale" />
              </Field>
              <Field label="Show on">
                <Select value={editing.placement ?? "home"} onValueChange={(v) => setEditing({ ...editing, placement: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Page</SelectItem>
                    <SelectItem value="success">Order Success Page</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="When tapped">
                <Select value={editing.link_type ?? "none"} onValueChange={(v) => setEditing({ ...editing, link_type: v as any, link_value: null })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nothing</SelectItem>
                    <SelectItem value="product">Open a product</SelectItem>
                    <SelectItem value="category">Open a category</SelectItem>
                    <SelectItem value="url">Open a custom link</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {editing.link_type === "product" && (
                <Field label="Product">
                  <Select value={editing.link_value ?? ""} onValueChange={(v) => setEditing({ ...editing, link_value: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose product…" /></SelectTrigger>
                    <SelectContent className="max-h-64">
                      {(products.data ?? []).map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "category" && (
                <Field label="Category">
                  <Select value={editing.link_value ?? ""} onValueChange={(v) => setEditing({ ...editing, link_value: v })}>
                    <SelectTrigger><SelectValue placeholder="Choose category…" /></SelectTrigger>
                    <SelectContent className="max-h-64">
                      {(categories.data ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              {editing.link_type === "url" && (
                <Field label="Custom link">
                  <Input value={editing.link_value ?? ""} onChange={(e) => setEditing({ ...editing, link_value: e.target.value })} placeholder="https://..." />
                </Field>
              )}
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <span className="text-sm">{editing.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => editing && save.mutate(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function PromoPopupEditor() {
  const qc = useQueryClient();
  const ad = useQuery({
    queryKey: ["admin-ad"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_ad_popup").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [draft, setDraft] = useState<any | null>(null);
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
        is_active: !!current.is_active,
      };
      const { error } = await supabase.from("shop_ad_popup").update(payload).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ad"] }); toast.success("Popup updated"); setDraft(null); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  if (!current) return null;

  return (
    <Card className="max-w-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Sticky promo popup</h3>
          <p className="text-xs text-muted-foreground">Shown once after the storefront loads.</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={!!current.is_active} onCheckedChange={(v) => setDraft({ ...current, is_active: v })} />
          <span className="text-sm">{current.is_active ? "Active" : "Inactive"}</span>
        </div>
      </div>
      <div className="space-y-3">
        <Field label="Title"><Input value={current.title ?? ""} onChange={e => setDraft({ ...current, title: e.target.value })} /></Field>
        <Field label="Message"><Textarea rows={3} value={current.message ?? ""} onChange={e => setDraft({ ...current, message: e.target.value })} /></Field>
        <Field label="Image URL"><Input value={current.image_url ?? ""} onChange={e => setDraft({ ...current, image_url: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Button text"><Input value={current.button_text ?? ""} onChange={e => setDraft({ ...current, button_text: e.target.value })} /></Field>
          <Field label="Button link"><Input value={current.button_link ?? ""} onChange={e => setDraft({ ...current, button_link: e.target.value })} /></Field>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {draft && <Button variant="outline" onClick={() => setDraft(null)}>Reset</Button>}
        <Button disabled={save.isPending || !draft} onClick={() => save.mutate()}>Save</Button>
      </div>
    </Card>
  );
}

/* ============ NOTIFICATIONS ============ */

function NotificationsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Notif> | null>(null);

  const list = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async (): Promise<Notif[]> => {
      const { data, error } = await supabase.from("shop_notifications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Notif[];
    },
  });

  const save = useMutation({
    mutationFn: async (n: Partial<Notif>) => {
      const payload = {
        title: n.title?.trim() ?? "",
        message: n.message?.trim() || null,
        type: (n.type as any) ?? "important",
        is_active: n.is_active ?? true,
        is_pinned: n.is_pinned ?? false,
        expires_at: n.expires_at || null,
      };
      if (!payload.title) throw new Error("Title required");
      if (n.id) {
        const { error } = await supabase.from("shop_notifications").update(payload).eq("id", n.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shop_notifications").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-notifications"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shop_notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-notifications"] }); toast.success("Deleted"); },
  });

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button onClick={() => setEditing({ is_active: true, type: "important" })}><Plus className="me-1 h-4 w-4" /> New notification</Button>
      </div>
      <div className="space-y-2">
        {list.data?.map(n => (
          <Card key={n.id} className="flex items-start gap-3 p-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-medium">{n.title}</p>
                <Badge variant="outline" className="text-[10px] capitalize">{n.type.replace("_", " ")}</Badge>
                {n.is_pinned && <Badge className="text-[10px]">Pinned</Badge>}
                {!n.is_active && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
              </div>
              {n.message && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{n.message}</p>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => setEditing(n)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => confirm("Delete?") && remove.mutate(n.id)}>
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit notification" : "New notification"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Title *"><Input value={editing.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Message"><Textarea rows={3} value={editing.message ?? ""} onChange={e => setEditing({ ...editing, message: e.target.value })} /></Field>
              <Field label="Type">
                <Select value={editing.type ?? "important"} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="stock">Stock update</SelectItem>
                    <SelectItem value="new_product">New product</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <ToggleRow label="Active" value={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} />
                <ToggleRow label="Pinned (banner)" value={editing.is_pinned ?? false} onChange={(v) => setEditing({ ...editing, is_pinned: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => editing && save.mutate(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ shared ============ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-xs">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

/* ============ SALES / PURCHASES ============ */

type TxnRow = {
  id: string; invoice_number: number; txn_date: string; created_at: string;
  items: any[]; subtotal: number; tax: number; total: number; status: string;
  notes: string | null; discount?: number;
  customer_name?: string; customer_mobile?: string | null;
  supplier_name?: string; supplier_mobile?: string | null;
};

function SalesTab({ onNew }: { onNew: () => void }) {
  return <TxnList kind="sale" onNew={onNew} />;
}

function SalesUnified({
  sub, onSubChange, onNew,
}: {
  sub: "completed" | "bin";
  onSubChange: (v: "completed" | "bin") => void;
  onNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <WholesaleTotalSaleCard />
      <WholesaleReturnsMiniCard />

      <div className="-mx-1 overflow-x-auto">
        <div className="inline-flex w-auto min-w-full gap-1 rounded-2xl bg-muted/50 p-1">
          {[
            { v: "completed", label: "Completed Sales" },
            { v: "bin",       label: "Recycle Bin" },
          ].map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => onSubChange(t.v as any)}
              className={`flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                sub === t.v ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {sub === "completed" && <TxnList kind="sale" onNew={onNew} />}
      {sub === "bin"       && <div className="rounded-xl border border-border bg-card p-1"><RecycleBin /></div>}
    </div>
  );
}

function PaymentsTab({ onPaymentIn }: { onPaymentIn: () => void }) {
  return (
    <div className="space-y-3">
      <Card className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold">Record customer payment</p>
          <p className="text-[11px] text-muted-foreground">Apply a payment against open dues or as advance.</p>
        </div>
        <Button onClick={onPaymentIn} className="rounded-xl">
          <Wallet className="me-1.5 h-4 w-4" /> Payment In
        </Button>
      </Card>
      <CustomersTab onAdd={() => undefined} />
    </div>
  );
}

function WebsiteSection({
  sub, onSubChange, activeBannerCount,
}: {
  sub: "banners" | "notifications";
  onSubChange: (v: "banners" | "notifications") => void;
  activeBannerCount: number;
}) {
  return (
    <div className="space-y-3">
      <div className="-mx-1 overflow-x-auto">
        <div className="inline-flex w-auto min-w-full gap-1 rounded-2xl bg-muted/50 p-1">
          {[
            { v: "banners", label: `Banner Ads${activeBannerCount ? ` (${activeBannerCount})` : ""}` },
            { v: "notifications", label: "Notifications" },
          ].map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => onSubChange(t.v as any)}
              className={`flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                sub === t.v ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {sub === "banners" && <AdsTab />}
      {sub === "notifications" && <NotificationsTab />}
    </div>
  );
}

function PurchasesTab({ onNew }: { onNew: () => void }) {
  return <TxnList kind="purchase" onNew={onNew} />;
}

function TxnList({ kind, onNew }: { kind: "sale" | "purchase"; onNew: () => void }) {
  const qc = useQueryClient();
  const navigateRoot = useNavigate();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const table = kind === "sale" ? "shop_sales" : "shop_purchases";

  const rows = useQuery({
    queryKey: [`admin-${kind}s`],
    queryFn: async (): Promise<TxnRow[]> => {
      const { data, error } = await supabase.from(table)
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as any;
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await softDelete(table as any, id);
      if (error) throw new Error(error.message);
      return id;
    },
    onMutate: async (id: string) => {
      const key = [`admin-${kind}s`];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<TxnRow[]>(key);
      qc.setQueryData<TxnRow[]>(key, (old) => (old ?? []).filter((r) => r.id !== id));
      return { prev };
    },
    onError: (e: any, _id, ctx: any) => {
      if (ctx?.prev) qc.setQueryData([`admin-${kind}s`], ctx.prev);
      toast.error(e?.message ?? "Failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`admin-${kind}s`] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["store-admin-overview"] });
      qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
      qc.invalidateQueries({ queryKey: ["pos-balance"] });
      qc.invalidateQueries({ queryKey: ["pos-customer-statement"] });
      qc.invalidateQueries({ queryKey: ["warehouse-value"] });
      toast.success("Moved to Recycle Bin — stock restored");
    },
  });

  const share = async (r: TxnRow) => {
    let partyTaxNo: string | undefined;
    if (kind === "sale") {
      const { fetchCustomerVatForSale } = await import("@/lib/pos-ledger");
      const vat = await fetchCustomerVatForSale({
        customer_id: (r as any).customer_id,
        customer_mobile: (r as any).customer_mobile,
      });
      partyTaxNo = vat ?? undefined;
    }
    openInvoiceShare({
      kind,
      invoiceNumber: r.invoice_number,
      date: new Date(r.txn_date ?? r.created_at).toLocaleDateString(),
      timestamp: r.created_at ?? r.txn_date,
      partyLabel: kind === "sale" ? "Customer" : "Supplier",
      partyName: (kind === "sale" ? r.customer_name : r.supplier_name) ?? "",
      partyMobile: (kind === "sale" ? r.customer_mobile : r.supplier_mobile) ?? undefined,
      partyTaxNo,
      items: r.items as any,
      subtotal: Number(r.subtotal),
      discount: Number(r.discount ?? 0),
      tax: Number(r.tax),
      total: Number(r.total),
      notes: r.notes ?? undefined,
    });
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        {kind === "sale" ? (
          <div className="grid w-full grid-cols-2 gap-2 sm:w-[24rem]">
            <Button onClick={onNew} className="h-10 min-w-0 rounded-xl px-3 text-xs font-semibold sm:text-sm">
              <Plus className="h-4 w-4" /> New Sale
            </Button>
            <Button
              onClick={() => navigateRoot({ to: "/sales-return", search: { new: 1 } as any })}
              className="h-10 min-w-0 rounded-xl px-3 text-xs font-semibold sm:text-sm"
            >
              <Undo2 className="h-4 w-4" /> New Sales Return
            </Button>
          </div>
        ) : (
          <Button onClick={onNew} className="h-10 rounded-xl gap-1"><Plus className="h-4 w-4" /> New {kind}</Button>
        )}
      </div>
      {rows.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
       rows.data?.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No {kind}s yet.</Card>
       ) : (
        <div className="space-y-2">
          {rows.data?.map(r => {
            const name = kind === "sale" ? r.customer_name : r.supplier_name;
            return (
              <Card
                key={r.id}
                className="cursor-pointer p-3 transition-colors hover:bg-muted/40"
                onClick={() => setDetailId(r.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">#{r.invoice_number}</span>
                    </div>
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {r.items.length} items · {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold">SAR {Number(r.total).toFixed(2)}</p>
                    <div className="mt-1 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Share to WhatsApp" onClick={() => share(r)}>
                        <MessageCircle className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" title="Move to Recycle Bin"
                        onClick={() => confirm(`Delete this ${kind}? Stock will be restored. You can recover it from Recycle Bin.`) && cancel.mutate(r.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
       )}

      {kind === "sale" ? (
        <PosSaleDetailsDialog open={!!detailId} onOpenChange={(v) => !v && setDetailId(null)} saleId={detailId} />
      ) : (
        <PurchaseDetailsDialog open={!!detailId} onOpenChange={(v) => !v && setDetailId(null)} purchaseId={detailId} />
      )}
    </div>
  );
}

/* ============ CUSTOMERS ============ */

function CustomersTab({ onAdd }: { onAdd: () => void }) {
  const [q, setQ] = useState("");
  const [payCustomer, setPayCustomer] = useState<PosCustomer | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [stmtCustomer, setStmtCustomer] = useState<PosCustomer | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const [saleInitial, setSaleInitial] = useState<{ partyName?: string; partyMobile?: string } | undefined>(undefined);

  const customers = useQuery({
    queryKey: ["pos-customers-admin"],
    queryFn: async (): Promise<PosCustomer[]> => {
      const { data, error } = await supabase
        .from("pos_customers")
        .select("id,name,phone,alias,opening_due,notes,is_active,created_at,tags")
        .eq("is_active", true)
        .eq("is_deleted", false)
        .order("name");
      if (error) throw error;
      return (data ?? []) as PosCustomer[];
    },
  });
  const dueMap = usePosDueMap();

  const filtered = (customers.data ?? []).filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      c.name.toLowerCase().includes(s) ||
      (c.phone ?? "").toLowerCase().includes(s) ||
      (c.alias ?? "").toLowerCase().includes(s)
    );
  });

  const totals = (() => {
    let totalDue = 0, withDue = 0;
    for (const c of customers.data ?? []) {
      const d = dueMap.data?.get(c.id) ?? 0;
      if (d > 0) { totalDue += d; withDue++; }
    }
    return { totalDue, withDue };
  })();

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <StatCard icon={Users} label="Customers" value={customers.data?.length ?? "—"} />
        <StatCard icon={AlertCircle} label="With due" value={totals.withDue} tone={totals.withDue > 0 ? "danger" : undefined} />
        <StatCard icon={Wallet} label="Total due" value={`SAR ${totals.totalDue.toFixed(0)}`} tone={totals.totalDue > 0 ? "danger" : undefined} />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <Input
          placeholder="Search by name, phone or alias…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-10 flex-1 min-w-[180px]"
        />
        <Button onClick={onAdd} className="gap-1.5"><UserPlus className="h-4 w-4" /> Add customer</Button>
        <Button variant="outline" onClick={() => { setPayCustomer(null); setPayOpen(true); }} className="gap-1.5">
          <Wallet className="h-4 w-4" /> Payment In
        </Button>
      </div>

      {customers.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> :
       filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No customers match. <button onClick={onAdd} className="text-primary underline">Add a new customer</button>.
        </Card>
       ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((c) => {
            const due = dueMap.data?.get(c.id) ?? 0;
            const tags = ((c as any).tags ?? []) as string[];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setDetailsId(c.id)}
                className="text-left active:scale-[0.99] transition-transform"
              >
                <Card className="p-3 hover:border-primary/40 hover:shadow-sm transition">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.phone ?? "—"}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={due > 0 ? "border-rose-500/40 text-rose-600" : "border-emerald-500/40 text-emerald-600"}
                        >
                          Due SAR {due.toFixed(2)}
                        </Badge>
                        {tags.includes("vip") && <Badge variant="outline" className="border-amber-500/40 text-amber-700 text-[10px]">VIP</Badge>}
                        {tags.includes("blocked") && <Badge variant="outline" className="border-rose-500/40 text-rose-600 text-[10px]">Blocked</Badge>}
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
       )}

      <PosPaymentInDialog open={payOpen} onOpenChange={setPayOpen} initialCustomer={payCustomer} />
      <PosCustomerStatementDialog
        open={!!stmtCustomer}
        onOpenChange={(v) => !v && setStmtCustomer(null)}
        customer={stmtCustomer}
        onPaymentIn={() => { if (stmtCustomer) { setPayCustomer(stmtCustomer); setPayOpen(true); } }}
      />
      <PosCustomerDetailsDialog
        open={!!detailsId}
        onOpenChange={(v) => !v && setDetailsId(null)}
        customerId={detailsId}
        onPaymentIn={(c) => { setPayCustomer(c); setPayOpen(true); setDetailsId(null); }}
        onViewStatement={(c) => { setStmtCustomer(c); setDetailsId(null); }}
        onNewSale={(c) => {
          setSaleInitial({ partyName: c.name, partyMobile: c.phone ?? undefined });
          setSaleOpen(true);
          setDetailsId(null);
        }}
      />
      <TransactionDialog open={saleOpen} onOpenChange={setSaleOpen} kind="sale" initial={saleInitial} />

    </div>
  );
}

/* ============ DEMO CLEANUP ============ */

function DemoCleanupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const qc = useQueryClient();
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const tables: { t: string; col: string }[] = [
        { t: "shop_sales", col: "notes" },
        { t: "shop_purchases", col: "notes" },
        { t: "shop_orders", col: "notes" },
        { t: "pos_customers", col: "notes" },
        { t: "shop_products", col: "description" },
      ];
      let total = 0, failed = 0;
      for (const { t, col } of tables) {
        const { data, error } = await (supabase as any).from(t).select("id").ilike(col, "%demo%").eq("is_deleted", false);
        if (error) { failed++; continue; }
        for (const r of (data ?? []) as { id: string }[]) {
          const res = await softDelete(t as any, r.id);
          if (res.error) failed++; else total++;
        }
      }
      toast.success(`Cleared ${total} demo/test record${total === 1 ? "" : "s"}${failed ? ` · ${failed} failed` : ""}`);
      qc.invalidateQueries();
      onOpenChange(false);
      setConfirmText("");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!busy) { onOpenChange(v); if (!v) setConfirmText(""); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Clear demo / test data</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[13px] text-destructive">
            This will move every <strong>sale, purchase, order, customer, and product</strong> whose notes or description contain the word
            <code className="mx-1 rounded bg-destructive/10 px-1.5">demo</code>
            to the Recycle Bin. Stock will reverse automatically. You can restore from the Recycle Bin.
          </p>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Type <code className="rounded bg-muted px-1">DELETE</code> to confirm</label>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" autoFocus />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button variant="destructive" disabled={busy || confirmText !== "DELETE"} onClick={run}>
            {busy ? "Clearing…" : "Move demo data to Recycle Bin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




function DashboardTab({
  activeBannerCount,
  onNewSale, onPaymentIn, onViewOrders, onAddProduct, onImport, onAddCustomer, onPurchase,
}: {
  activeBannerCount: number;
  onNewSale: () => void;
  onPaymentIn: () => void;
  onViewOrders: () => void;
  onAddProduct: () => void;
  onImport: () => void;
  onAddCustomer: () => void;
  onPurchase: () => void;
}) {
  return <WholesaleDashboard />;
}

function SuppliersTab() {
  return <PartyManager defaultType="supplier" />;
}


/* ============ SALES & DELIVERY DASHBOARD (no financial KPIs) ============ */

function SalesDeliveryDashboard({
  onNewSale, onPaymentIn, onPurchase, onViewOrders, onViewCustomers, onViewProducts,
}: {
  onNewSale: () => void;
  onPaymentIn: () => void;
  onPurchase: () => void;
  onViewOrders: () => void;
  onViewCustomers: () => void;
  onViewProducts: () => void;
}) {
  const { workingDate } = useWorkingDate();
  const { dayIso, dayEndIso } = useMemo(() => {
    const [wy, wm, wd] = workingDate.split("-").map(Number);
    const s = new Date(wy, (wm || 1) - 1, wd || 1); s.setHours(0, 0, 0, 0);
    const e = new Date(s); e.setHours(23, 59, 59, 999);
    return { dayIso: s.toISOString(), dayEndIso: e.toISOString() };
  }, [workingDate]);

  const ops = useQuery({
    queryKey: ["sales-delivery-overview", dayIso],
    staleTime: 60_000,
    queryFn: async () => {
      const [pending, salesToday, purchasesToday] = await Promise.all([
        supabase.from("shop_orders").select("id", { count: "exact", head: true }).eq("status", "pending").eq("is_deleted", false),
        supabase.from("shop_sales" as any).select("id", { count: "exact", head: true }).gte("created_at", dayIso).lte("created_at", dayEndIso).eq("is_deleted", false),
        supabase.from("shop_purchases").select("id", { count: "exact", head: true }).gte("created_at", dayIso).lte("created_at", dayEndIso).eq("is_deleted", false),
      ]);
      return {
        pendingOrders: pending.count ?? 0,
        salesCount: salesToday.count ?? 0,
        purchaseCount: purchasesToday.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["sales-delivery-recent"],
    staleTime: 30_000,
    queryFn: async () => {
      const [sales, purchases, payments] = await Promise.all([
        supabase.from("shop_sales" as any).select("id,invoice_number,total,created_at,customer_name").eq("is_deleted", false).order("created_at", { ascending: false }).limit(8),
        supabase.from("shop_purchases").select("id,total,created_at,party_name").eq("is_deleted", false).order("created_at", { ascending: false }).limit(8),
        supabase.from("pos_payments" as any).select("id,amount,created_at,kind,notes").eq("kind", "payment_in").order("created_at", { ascending: false }).limit(8),
      ]);
      const items: { id: string; kind: string; title: string; subtitle: string; amount: number; at: string }[] = [
        ...((sales.data ?? []) as any[]).map((r) => ({ id: `s-${r.id}`, kind: "Sale", title: r.customer_name ?? `Invoice #${r.invoice_number ?? ""}`, subtitle: r.invoice_number ? `#${r.invoice_number}` : "Sale", amount: Number(r.total ?? 0), at: r.created_at })),
        ...((purchases.data ?? []) as any[]).map((r) => ({ id: `p-${r.id}`, kind: "Purchase", title: r.party_name ?? "Purchase", subtitle: "Purchase", amount: Number(r.total ?? 0), at: r.created_at })),
        ...((payments.data ?? []) as any[]).map((r) => ({ id: `pi-${r.id}`, kind: "Payment In", title: r.notes ?? "Payment received", subtitle: "Payment In", amount: Number(r.amount ?? 0), at: r.created_at })),
      ];
      return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 12);
    },
  });

  const d = ops.data;

  return (
    <div className="space-y-4">
      <section>
        <SectionHeader title="Quick actions" icon={LayoutGrid} hint="Sales & Delivery" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <ActionTile icon={ShoppingBag} label="New Sale" onClick={onNewSale} tone="primary" />
          <ActionTile icon={Truck} label="Purchase" onClick={onPurchase} />
          <ActionTile icon={Wallet} label="Payment In" onClick={onPaymentIn} />
          <ActionTile icon={Users} label="Customers" onClick={onViewCustomers} />
          <ActionTile icon={ShoppingCart} label="Pending Orders" onClick={onViewOrders} badge={d?.pendingOrders} />
          <ActionTile icon={Package} label="Products" onClick={onViewProducts} />
        </div>
      </section>

      <section>
        <SectionHeader title="Today's activity" icon={Activity} hint="Counts only" />
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">Sales today</div><div className="text-xl font-bold">{d ? d.salesCount : "—"}</div></Card>
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">Purchases today</div><div className="text-xl font-bold">{d ? d.purchaseCount : "—"}</div></Card>
          <Card className="p-3"><div className="text-[11px] text-muted-foreground">Pending orders</div><div className="text-xl font-bold">{d ? d.pendingOrders : "—"}</div></Card>
        </div>
      </section>

      <section>
        <SectionHeader title="Recent entries" icon={ClipboardList} hint="Latest 12" />
        <Card className="divide-y divide-border/60">
          {(recent.data ?? []).length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No recent activity</div>
          ) : (recent.data ?? []).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{r.title}</div>
                <div className="text-[11px] text-muted-foreground">{r.kind} • {new Date(r.at).toLocaleString()}</div>
              </div>
              <div className="text-sm font-bold tabular-nums">SAR {r.amount.toFixed(2)}</div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}




function ActionTile({ icon: Icon, label, onClick, tone, badge }: { icon: any; label: string; onClick: () => void; tone?: "primary" | "return"; badge?: number }) {
  const toneClasses =
    tone === "primary"
      ? "bg-primary/5"
      : tone === "return"
        ? "bg-rose-500/5 border-rose-500/30"
        : "bg-card";
  const iconClasses =
    tone === "primary"
      ? "bg-primary/15 text-primary"
      : tone === "return"
        ? "bg-rose-500/15 text-rose-600"
        : "bg-muted text-muted-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-start gap-2 rounded-2xl border border-border/60 p-3 text-left transition-colors hover:bg-muted/50 ${toneClasses}`}
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClasses}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="text-sm font-semibold">{label}</div>
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute right-2 top-2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{badge}</span>
      )}
    </button>
  );
}
