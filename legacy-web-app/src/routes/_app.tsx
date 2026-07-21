import { Link, Outlet, useNavigate, useRouter, useRouterState, createFileRoute, Navigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Store, FileBarChart, Settings, Wallet,
  Menu, X, ChevronRight, ChevronLeft, Sparkles, Users, ShieldCheck, ShieldAlert, LogOut, HardDriveDownload,
  Package, ShoppingCart, ClipboardList, AlertTriangle, ArrowDownCircle, ArrowUpCircle, BookOpen, Workflow, Bell, Home,
  Globe, CalendarCheck, CalendarRange, TrendingUp, Building2, Lock, PanelLeftClose, PanelLeftOpen, Undo2, Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { WorkingDateProvider } from "@/hooks/use-working-date";
import { WorkingDatePill } from "@/components/working-date-pill";

import { useUserAccess } from "@/hooks/use-user-access";
import { pageKeyFromPath, type PageKey } from "@/lib/page-access";
import { Card } from "@/components/ui/card";
import { OrderNotificationsProvider } from "@/hooks/use-order-notifications";
import { NotificationBell } from "@/components/notification-bell";
import { GlobalRefreshButton } from "@/components/global-refresh-button";
import { useFcmRegister } from "@/hooks/use-fcm";

// Lazy-load heavy chrome — neither blocks first paint, both ship their own chunk.
const GlobalSearch = lazy(() => import("@/components/global-search").then(m => ({ default: m.GlobalSearch })));
const GlobalAiButton = lazy(() => import("@/components/global-ai-button").then(m => ({ default: m.GlobalAiButton })));

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const BOTTOM_NAV = [
  { to: "/summary", labelKey: "nav.home", icon: Home },
  { to: "/shop", labelKey: "nav.shop", icon: Store },
  { to: "/store-admin", labelKey: "nav.wholesale", icon: Globe },
  { to: "/reports", labelKey: "nav.reports", icon: FileBarChart },
] as const;

type NavItem = {
  to: string;
  label: string;
  icon: any;
  pageKey?: PageKey;
  search?: Record<string, string>;
};

type NavGroup = { title: string; items: NavItem[] };

// Minimal sidebar — only the essential workspaces. All other features remain
// accessible from inside their related pages (Shop, WholeSale, Finance Workflow).
const NAV_GROUPS: NavGroup[] = [
  {
    title: "Main",
    items: [
      { to: "/summary",       label: "Home",       icon: Home,        pageKey: pageKeyFromPath("/summary") ?? undefined },
      { to: "/shop",          label: "Shop",       icon: Store,       pageKey: pageKeyFromPath("/shop") ?? undefined },
      { to: "/store-admin",   label: "Wholesale",  icon: Globe,       pageKey: pageKeyFromPath("/store-admin") ?? undefined },
      { to: "/reports",       label: "Reports",    icon: FileBarChart, pageKey: "reports" },
      { to: "/sales-return",  label: "Sales Return",  icon: Undo2,    pageKey: "sales-return" },
      { to: "/my-expenses",   label: "My Wallet",     icon: ArrowUpCircle, pageKey: "my-expenses" },
      { to: "/price-compare", label: "Price Compare", icon: TrendingUp,    pageKey: "price-compare" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { to: "/finance-workflow",  label: "Finance Workflow",  icon: Workflow,      pageKey: "finance-workflow" },
      { to: "/daily-closing",     label: "Daily Closing",     icon: CalendarCheck, pageKey: "daily-closing" },
      { to: "/monthly-snapshot",  label: "Monthly Snapshot",  icon: CalendarRange, pageKey: "reports" },
      { to: "/profit-summary",    label: "Profit Summary",    icon: TrendingUp,    pageKey: "reports" },

      { to: "/company-transactions", label: "Company Transactions", icon: Building2, pageKey: "company-transactions" },
      { to: "/monthly-closing",   label: "Monthly Closing",   icon: Lock,          pageKey: "reports" },
      { to: "/employees",         label: "Employees",         icon: Users,         pageKey: "employees" },
      { to: "/settings",          label: "Settings",          icon: Settings,      pageKey: "settings" },
    ],
  },
];


function AppLayout() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return localStorage.getItem("erp.sidebar.collapsed") === "1"; } catch { return false; }
  });
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem("erp.sidebar.collapsed", next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);
  const t = useT();
  const access = useUserAccess();

  const handleSignOut = useCallback(async () => {
    try {
      setDrawerOpen(false);
      await signOut();
      qc.clear();
      router.invalidate();
      toast.success("Signed out");
      nav({ to: "/login" });
    } catch (e: any) {
      toast.error(e?.message ?? "Could not sign out");
    }
  }, [signOut, qc, router, nav]);

  // Global "Ask AI" open event — keep a single lightweight listener at the
  // layout level so the heavy GlobalSearch module stays unloaded until needed.
  useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener("lovable:open-ai-copilot", open);
    return () => window.removeEventListener("lovable:open-ai-copilot", open);
  }, []);

  // Auto-register FCM token if permission already granted (admins/staff).
  useFcmRegister();

  // Memoize derived nav groups so they don't recompute on every keystroke /
  // unrelated state change. Recomputes only when role/page access changes.
  const { BOTTOM, GROUPS } = useMemo(() => {
    const hasAccess = (key?: PageKey) => !key || access.hasPage(key);
    const B = BOTTOM_NAV.filter((it) => hasAccess(pageKeyFromPath(it.to) ?? undefined));
    const G = NAV_GROUPS
      .map((g) => ({ ...g, items: g.items.filter((it) => hasAccess(it.pageKey)) }))
      .filter((g) => g.items.length > 0);
    return { BOTTOM: B, GROUPS: G };
  }, [access.hasPage]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">{t("common.loading")}</div>;
  if (!user) return <Navigate to="/login" />;

  const currentKey = pageKeyFromPath(pathname);
  const routeAllowed = access.loading || !currentKey || access.hasPage(currentKey);
  const canAi = access.hasPage("ai-insights");

  const isItemActive = (item: NavItem) => {
    if (!pathname.startsWith(item.to)) return false;
    // Disambiguate when multiple sidebar items share a route via ?tab=
    try {
      const sp = new URLSearchParams(window.location.search);
      const currentTab = sp.get("tab");
      if (item.search?.tab) return currentTab === item.search.tab;
      // Item has no tab: only active when URL also has no tab
      return !currentTab;
    } catch {
      return !item.search?.tab;
    }
  };

  const renderDrawerItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <Link
        key={`${item.to}-${item.label}`}
        to={item.to}
        search={item.search as any}
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/60"
        )}
      >
        <span className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
          active ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
        )}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-tight">{item.label}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 rtl:rotate-180" />
      </Link>
    );
  };

  const renderDesktopItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return (
      <Link
        key={`${item.to}-${item.label}`}
        to={item.to}
        search={item.search as any}
        title={sidebarCollapsed ? item.label : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-xl py-2 text-[13.5px] font-medium transition-all",
          sidebarCollapsed ? "justify-center px-2" : "px-3",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-soft)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-[16px] w-[16px] shrink-0" strokeWidth={1.75} />
        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  const SideDrawerContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight">{t("app.name")}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t("app.tagline")}</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          aria-label={t("common.close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 [-webkit-overflow-scrolling:touch]">
        {GROUPS.map((group, gi) => (
          <div key={group.title} className={cn(gi > 0 && "mt-5")}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(renderDrawerItem)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/50 px-5 py-4 space-y-3">
        <div>
          <p className="truncate text-[11px] text-muted-foreground">{t("app.signedInAs")}</p>
          <p className="truncate text-[13px] font-medium">{user.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <WorkingDateProvider>
    <OrderNotificationsProvider>
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-30 hidden flex-col border-e border-sidebar-border bg-sidebar p-4 transition-[width] duration-200 md:flex",
          sidebarCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <Link
          to="/summary"
          className={cn(
            "mb-4 flex items-center gap-3 transition-opacity hover:opacity-90",
            sidebarCollapsed ? "justify-center px-0" : "px-2"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
            <Wallet className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold leading-tight">{t("app.name")}</p>
              <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">{t("app.tagline")}</p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={toggleSidebar}
          className="mb-3 flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand" : "Collapse"}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : (<><PanelLeftClose className="h-4 w-4" /><span>Collapse</span></>)}
        </button>

        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
          {GROUPS.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(renderDesktopItem)}
              </div>
            </div>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="flex items-center gap-2 px-2 pt-3">
            <p className="flex-1 truncate text-xs text-muted-foreground">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
        {sidebarCollapsed && (
          <button
            onClick={handleSignOut}
            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </aside>

      {/* Desktop sticky header */}
      <header
        className={cn(
          "fixed top-0 end-0 z-20 hidden h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:flex",
          sidebarCollapsed ? "start-[72px]" : "start-64"
        )}
      >
        {canAi && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 text-[13px] text-muted-foreground transition-colors hover:bg-muted/60"
            aria-label="Search anything"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span className="flex-1 truncate text-left">Search anything…</span>
            <kbd className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
          </button>
        )}
        <div className="ms-auto flex items-center gap-2">
          <WorkingDatePill />
          <GlobalRefreshButton />
          <NotificationBell />
        </div>
      </header>


      {/* Mobile top bar — sticky; hamburger + compact Magic Search */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)] md:hidden">
        <div className="flex min-h-[var(--mobile-topbar-height)] items-center justify-between px-4 py-2.5">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95"
                aria-label={t("app.menu")}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[82vw] max-w-[340px] border-e border-border/60 bg-background p-0 rtl:border-e-0 rtl:border-s"
            >
              {SideDrawerContent}
            </SheetContent>
          </Sheet>

          <Link to={access.primaryRoute as any} className="flex items-center gap-2 active:scale-[0.98] transition-transform" aria-label={t("app.name")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
              <Wallet className="h-4 w-4" />
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <WorkingDatePill />
            <GlobalRefreshButton />
            <NotificationBell />
          </div>
        </div>

        {canAi && (
          <div className="px-3 pb-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex w-full items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-2 text-left text-[12.5px] text-muted-foreground transition-colors hover:bg-muted/60 active:scale-[0.99]"
              aria-label="Search anything"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="flex-1 truncate">Search anything…</span>
            </button>
          </div>
        )}
      </header>

      <Suspense fallback={null}>
        {searchOpen && <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />}
        {canAi && <GlobalAiButton />}
      </Suspense>

      {/* Main content */}
      <main
        className={cn(
          "mobile-scroll-page pt-[112px] pb-bottom-nav md:pt-14",
          sidebarCollapsed ? "md:ms-[72px]" : "md:ms-64"
        )}
      >
        <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-4 overflow-visible p-4 md:max-w-none md:gap-6 md:p-6 xl:p-8">
          {access.loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading access…</div>
          ) : routeAllowed ? <Outlet /> : <AccessRestricted to={access.primaryRoute} />}
        </div>
      </main>

      {/* Bottom nav — mobile (glassmorphism) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pointer-events-none md:hidden">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border/60 bg-background px-2 py-1.5 shadow-sm">
          {(BOTTOM.length ? BOTTOM : []).map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                search={(item as any).search}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    active && "bg-primary/15 scale-110"
                  )}
                >
                  <Icon className="h-[19px] w-[19px]" />
                </span>
                <span className={cn("transition-opacity", active ? "opacity-100" : "opacity-70")}>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
    </OrderNotificationsProvider>
    </WorkingDateProvider>
  );
}

function AccessRestricted({ to }: { to: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-b from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-400">
        <ShieldAlert className="h-7 w-7" />
      </span>
      <h1 className="font-display text-lg font-bold">Access Denied</h1>
      <p className="text-[12px] text-muted-foreground">
        Insufficient Permission. Ask an admin to grant access from
        <span className="px-1 font-medium text-foreground">Team &amp; Access</span>.
      </p>
      <Link
        to={to as any}
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90"
      >
        Go to my workspace <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </Link>
    </div>
  );
}
