import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useConfirm } from "@/hooks/use-confirm";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Store, Plus, Trash2, Users, Tags, Layers, UserCog, Coins, Download, Palette, Moon, Sun,
  ChevronRight, Wallet, Contact2, Search, X, LogOut, Archive, Languages, BookOpen, Calculator,
  Shield, Info, Check, Activity as ActivityIcon, ShieldCheck, Bell, Mail, FileText,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  INVOICE_FORMAT_LABELS, getDefaultInvoiceFormat, setDefaultInvoiceFormat,
  type InvoiceFormat,
} from "@/lib/invoice-formats";
import { useFcmRegister } from "@/hooks/use-fcm";
import { useUserAccess } from "@/hooks/use-user-access";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { lazy, Suspense } from "react";
import { CategoryManager } from "@/components/category-manager";
import { CashierManager } from "@/components/cashier-manager";
import { PartyManager } from "@/components/party-manager";
import { UserManagementPanel } from "@/components/user-management-panel";
import { NotificationRecipientsManager } from "@/components/notification-recipients-manager";
import { EmployeeExpenseCategoriesManager } from "@/components/employee-expense-categories-manager";

// Heavy / rarely-opened panels — load on demand to keep Settings TTI fast.
const ThemesPanel = lazy(() => import("@/components/themes-panel").then(m => ({ default: m.ThemesPanel })));
const RecycleBin = lazy(() => import("@/components/recycle-bin").then(m => ({ default: m.RecycleBin })));

const LazyFallback = () => <div className="py-10 text-center text-xs text-muted-foreground">Loading…</div>;
import { SARAmount } from "@/components/sar-amount";
import { cn } from "@/lib/utils";
import { useI18n, useT, LANGUAGES, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

type Item = { key: string; labelKey: string; icon: any; descKey: string; render: () => React.ReactNode };
type Group = { titleKey: string; items: Item[] };

const GROUPS: Group[] = [
  // Workspace (shops, cashiers) and Warehouse (categories) management
  // have moved into the Shop page and Warehouse page 3-dot menus respectively.

  {
    titleKey: "settings.group.advanced",
    items: [
      { key: "team",      labelKey: "Team & Access",    icon: ShieldCheck, descKey: "Members, roles, shops & page permissions", render: () => <TeamShortcut /> },
      { key: "backup",    labelKey: "settings.backup",  icon: Download, descKey: "settings.backup.desc",  render: () => <BackupSection /> },
      { key: "recyclebin",labelKey: "settings.recycle", icon: Archive,  descKey: "settings.recycle.desc", render: () => <Suspense fallback={<LazyFallback />}><RecycleBin /></Suspense> },
      { key: "activity",  labelKey: "settings.activity",icon: ActivityIcon, descKey: "settings.activity.desc", render: () => <ActivityShortcut /> },
    ],
  },
  {
    titleKey: "settings.group.help",
    items: [
      { key: "notifications", labelKey: "Push Notifications", icon: Bell, descKey: "Enable browser & mobile push alerts", render: () => <PushNotificationsSection /> },
      { key: "email-recipients", labelKey: "Email Notifications", icon: Mail, descKey: "Email addresses notified on new storefront orders", render: () => <NotificationRecipientsManager /> },
      { key: "expense-cats", labelKey: "Expense Categories", icon: Wallet, descKey: "Categories employees pick when submitting expenses", render: () => <EmployeeExpenseCategoriesManager /> },
      // LEGACY (REMOVED): 80mm Invoice Maker, Invoice Designer, and Default Invoice Format
      // entries were deleted. Wholesale now uses Invoice V2 and 80mm by AM only.
      { key: "security", labelKey: "settings.security", icon: Shield,     descKey: "settings.security.desc", render: () => <SecuritySection /> },
      { key: "about",    labelKey: "settings.about",    icon: Info,       descKey: "settings.about.desc",    render: () => <AboutSection /> },
    ],
  },
  {
    titleKey: "settings.group.account",
    items: [
      { key: "logout", labelKey: "settings.logout", icon: LogOut, descKey: "settings.logout.desc", render: () => <LogoutSection /> },
    ],
  },
];

function SettingsPage() {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const t = useT();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS
      .map((g) => ({ ...g, items: g.items.filter((i) => {
        const label = t(i.labelKey).toLowerCase();
        const desc = t(i.descKey).toLowerCase();
        const title = t(g.titleKey).toLowerCase();
        return label.includes(q) || desc.includes(q) || title.includes(q);
      })}))
      .filter((g) => g.items.length > 0);
  }, [query, t]);

  return (
    <div className="w-full max-w-none min-w-0 animate-in fade-in-0 duration-300">
      <div className="mb-5">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("settings.search")}
          className="h-11 rounded-xl border-border/60 bg-muted/40 ps-10 pe-10 text-sm shadow-none focus-visible:bg-background"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-7">
        {filtered.map((group) => (
          <section key={group.titleKey} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
            <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
              {t(group.titleKey)}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40">
              {group.items.map((item, idx) => {
                const isActive = active === item.key;
                const Icon = item.icon;
                return (
                  <div key={item.key} className={cn(idx > 0 && "border-t border-border/40")}>
                    <button
                      onClick={() => setActive(isActive ? null : item.key)}
                      className={cn(
                        "group flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors",
                        "hover:bg-muted/50 active:bg-muted/70",
                        isActive && "bg-muted/40"
                      )}
                    >
                      <Icon className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} strokeWidth={1.75} />
                      <div className="min-w-0 flex-1">
                        <p className={cn("truncate text-[14px] font-medium leading-tight", isActive && "text-primary")}>
                          {t(item.labelKey)}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{t(item.descKey)}</p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-300 rtl:rotate-180",
                          isActive && "!rotate-90 text-primary"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-border/40 bg-background/40 p-4">
                          {isActive && item.render()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">{t("settings.noMatch", { query })}</p>
        )}
      </div>
    </div>
  );
}

// ─── New & merged sections ────────────────────────────────

function LanguageSection() {
  const { lang, setLang } = useI18n();
  const t = useT();
  return (
    <SectionShell>
      <div>
        <p className="text-sm font-semibold">{t("language.title")}</p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{t("language.subtitle")}</p>
      </div>
      <div className="grid gap-2">
        {LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <button
              key={l.code}
              onClick={() => setLang(l.code as Lang)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-start transition-all",
                active ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40"
              )}
            >
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg font-display text-[13px] font-bold",
                active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              )}>
                {l.code.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{l.native}</p>
                <p className="text-[11px] text-muted-foreground">
                  {l.english}{l.dir === "rtl" ? ` · ${t("language.rtlBadge")}` : ""}
                </p>
              </div>
              {active && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
      <p className="text-[10.5px] text-muted-foreground">{t("language.note")}</p>
    </SectionShell>
  );
}

function AppearanceThemesSection() {
  const { theme, toggle } = useTheme();
  const t = useT();
  const isDark = theme === "dark";
  return (
    <SectionShell>
      <div>
        <p className="text-sm font-semibold">{t("appearance.mode")}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            onClick={() => isDark && toggle()}
            className={cn(
              "rounded-xl border p-3 text-start transition-all",
              !isDark ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
            )}
          >
            <Sun className="mb-1.5 h-4 w-4 text-warning" />
            <p className="text-[13px] font-semibold">{t("appearance.mode.light")}</p>
            <p className="text-[11px] text-muted-foreground">{t("appearance.mode.light.desc")}</p>
          </button>
          <button
            onClick={() => !isDark && toggle()}
            className={cn(
              "rounded-xl border p-3 text-start transition-all",
              isDark ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
            )}
          >
            <Moon className="mb-1.5 h-4 w-4 text-primary" />
            <p className="text-[13px] font-semibold">{t("appearance.mode.dark")}</p>
            <p className="text-[11px] text-muted-foreground">{t("appearance.mode.dark.desc")}</p>
          </button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">{t("appearance.themes")}</p>
        <Suspense fallback={<LazyFallback />}><ThemesPanel /></Suspense>
      </div>
    </SectionShell>
  );
}

function HowToShortcut() {
  const t = useT();
  return (
    <SectionShell>
      <p className="text-[12px] text-muted-foreground">{t("nav.desc.help")}</p>
      <Link
        to="/help"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
      >
        <BookOpen className="h-4 w-4" /> {t("settings.howto")}
      </Link>
    </SectionShell>
  );
}

function ActivityShortcut() {
  const t = useT();
  return (
    <SectionShell>
      <p className="text-[12px] text-muted-foreground">{t("settings.activity.desc")}</p>
      <Link
        to="/activity"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
      >
        <ActivityIcon className="h-4 w-4" /> {t("settings.activity")}
      </Link>
    </SectionShell>
  );
}

function TeamShortcut() {
  return (
    <SectionShell>
      <p className="text-[12px] text-muted-foreground">
        Manage members, roles, shop assignments and per-page permissions in one place.
      </p>
      <Link
        to="/team"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95"
      >
        <ShieldCheck className="h-4 w-4" /> Open Team &amp; Access
      </Link>
    </SectionShell>
  );
}



function CalcShortcut() {
  const t = useT();
  return (
    <SectionShell>
      <p className="text-[12px] text-muted-foreground">{t("settings.calc.desc")}</p>
      <Link
        to="/help"
        hash="calculation-logic"
        className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
      >
        <Calculator className="h-4 w-4" /> {t("settings.calc")}
      </Link>
    </SectionShell>
  );
}

function SecuritySection() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const t = useT();
  const [busy, setBusy] = useState(false);
  return (
    <SectionShell>
      <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("security.signedInAs")}</p>
        <p className="mt-1 truncate text-sm font-medium">{user?.email}</p>
      </div>
      <p className="text-[11.5px] text-muted-foreground">{t("security.note")}</p>
      <Button
        variant="outline"
        disabled={busy}
        onClick={async () => { setBusy(true); await signOut(); nav({ to: "/login" }); }}
      >
        <LogOut className="me-1 h-4 w-4" /> {t("security.signout")}
      </Button>
    </SectionShell>
  );
}

function AboutSection() {
  const t = useT();
  return (
    <SectionShell>
      <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-card to-background p-4">
        <p className="font-display text-base font-bold">{t("about.product")}</p>
        <p className="mt-1 text-[12px] text-muted-foreground">{t("about.tag")}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-background/60 px-2 py-1 text-[11px]">
          <span className="text-muted-foreground">{t("about.version")}</span>
          <span className="font-mono font-semibold">1.0.0</span>
        </div>
      </div>
    </SectionShell>
  );
}

// ─── Existing sections (unchanged) ────────────────────────

function SectionShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function ShopsSection() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [name, setName] = useState("");
  const [opening, setOpening] = useState("0");
  const [shopType, setShopType] = useState<"full_erp" | "simple_cash">("full_erp");
  const [busy, setBusy] = useState(false);

  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("*").eq("is_deleted", false);
      const { sortShops } = await import("@/lib/shop-order");
      return sortShops((data ?? []) as any[]);
    },
  });

  const addShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await (supabase as any).from("shops").insert({
      name, opening_cash: Number(opening), shop_type: shopType, created_by: user.id,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Shop added");
      setName(""); setOpening("0"); setShopType("full_erp");
      qc.invalidateQueries({ queryKey: ["shops"] });
    }
  };

  const setType = async (id: string, t: "full_erp" | "simple_cash") => {
    const { error } = await (supabase as any).from("shops").update({ shop_type: t }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Type updated"); qc.invalidateQueries({ queryKey: ["shops"] }); }
  };

  const deleteShop = async (id: string) => {
    if (!(await confirm({ title: "Move shop to Recycle Bin?", description: "Entries linked to this shop stay archived. You can restore the shop from the Recycle Bin.", confirmText: "Move to Bin", icon: "recycle", tone: "warning" }))) return;
    const { softDelete } = await import("@/lib/soft-delete");
    const { error } = await softDelete("shops", id);
    if (error) toast.error(error.message);
    else { toast.success("Moved to Recycle Bin"); qc.invalidateQueries({ queryKey: ["shops"] }); }
  };

  return (
    <SectionShell>
      <form onSubmit={addShop} className="grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]">
        <div><Label className="text-xs">Shop name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main branch" className="mt-1.5" /></div>
        <div><Label className="text-xs">Opening cash</Label><Input type="number" step="0.01" value={opening} onChange={(e) => setOpening(e.target.value)} className="mt-1.5" /></div>
        <div>
          <Label className="text-xs">Type</Label>
          <select
            value={shopType}
            onChange={(e) => setShopType(e.target.value as any)}
            className="mt-1.5 block h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            <option value="full_erp">Full ERP</option>
            <option value="simple_cash">Simple Cash</option>
          </select>
        </div>
        <Button type="submit" disabled={busy} className="sm:self-end"><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </form>

      <ul className="divide-y divide-border/50 rounded-xl border border-border/40">
        {shops.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No shops yet.</li>}
        {shops.map((s: any) => {
          const simple = s.shop_type === "simple_cash";
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <span className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                    simple
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                      : "bg-primary/15 text-primary",
                  )}>
                    {simple ? "Simple" : "ERP"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Opening · <SARAmount value={s.opening_cash} size="sm" bold={false} /></p>
              </div>
              <select
                value={s.shop_type ?? "full_erp"}
                onChange={(e) => setType(s.id, e.target.value as any)}
                className="h-8 rounded-md border border-input bg-transparent px-1.5 text-xs"
                aria-label="Shop type"
              >
                <option value="full_erp">Full ERP</option>
                <option value="simple_cash">Simple Cash</option>
              </select>
              <button onClick={() => deleteShop(s.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

function UsersSection() {
  return <UserManagementPanel />;
}

function CurrencySection() {
  return (
    <SectionShell>
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary/10 px-3 py-1.5 font-display text-base font-bold text-primary">SAR</div>
        <p className="text-sm text-muted-foreground">Saudi Riyal — all values stored and displayed in SAR.</p>
      </div>
      <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Preview</p>
        <div className="mt-2"><SARAmount value={12345.67} size="2xl" /></div>
      </div>
    </SectionShell>
  );
}

function BackupSection() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [preview, setPreview] = useState<null | {
    data: Record<string, any[]>;
    summary: { table: string; rows: number }[];
    fileName: string;
  }>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin-backup", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", user!.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  if (!isAdmin) {
    return (
      <SectionShell>
        <p className="text-sm text-muted-foreground">
          <Shield className="inline h-4 w-4 mr-1" />
          Only admins can backup or restore.
        </p>
      </SectionShell>
    );
  }

  const runBackup = async () => {
    setBusy(true); setProgress(0); setStatus("");
    try {
      const { exportEverything } = await import("@/lib/backup-restore");
      await exportEverything((msg, pct) => { setStatus(msg); setProgress(pct); });
      toast.success("Full backup package downloaded");
    } catch (e: any) {
      toast.error(e.message ?? "Backup failed");
    } finally {
      setBusy(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 2500);
    }
  };

  const runExport = async (kind: "xlsx" | "csv" | "json") => {
    setBusy(true); setProgress(0); setStatus("");
    try {
      const lib = await import("@/lib/backup-restore");
      const fn = kind === "xlsx" ? lib.exportExcelOnly : kind === "csv" ? lib.exportCsvZip : lib.exportJson;
      await fn((msg, pct) => { setStatus(msg); setProgress(pct); });
      toast.success(`${kind.toUpperCase()} backup downloaded`);
    } catch (e: any) {
      toast.error(e.message ?? "Export failed");
    } finally {
      setBusy(false);
      setTimeout(() => { setProgress(0); setStatus(""); }, 2500);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setProgress(10); setStatus("Reading file…");
    try {
      const { parseBackupFile, summarizeRestore } = await import("@/lib/backup-restore");
      const data = await parseBackupFile(file);
      const summary = summarizeRestore(data);
      if (!summary.length) {
        toast.error("No restorable data found in file");
        return;
      }
      setPreview({ data, summary, fileName: file.name });
    } catch (err: any) {
      toast.error(err.message ?? "Could not read file");
    } finally {
      setBusy(false); setProgress(0); setStatus("");
    }
  };

  const confirmRestore = async () => {
    if (!preview) return;
    setBusy(true); setProgress(0);
    try {
      const { restoreData } = await import("@/lib/backup-restore");
      await restoreData(preview.data, (msg, pct) => { setStatus(msg); setProgress(pct); });
      toast.success("Restore complete. Reloading…");
      setPreview(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      toast.error(e.message ?? "Restore failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SectionShell>
      <div className="space-y-4">

        <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold">Backup & Export</p>
            <p className="text-xs text-muted-foreground">
              Export all ERP data for migration into the new ShRiAh Group ERP. UTF-8 encoded — supports Bangla & Arabic.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => runExport("xlsx")} disabled={busy} variant="outline" className="w-full">
              <Download className="mr-1 h-4 w-4" /> Excel (.xlsx)
            </Button>
            <Button onClick={() => runExport("csv")} disabled={busy} variant="outline" className="w-full">
              <Download className="mr-1 h-4 w-4" /> CSV (.zip)
            </Button>
            <Button onClick={() => runExport("json")} disabled={busy} variant="outline" className="w-full">
              <Download className="mr-1 h-4 w-4" /> JSON (.json)
            </Button>
            <Button onClick={runBackup} disabled={busy} className="w-full">
              <Download className="mr-1 h-4 w-4" /> Full Package (.zip)
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Full Package contains Excel + per-table CSVs + <code className="px-1 rounded bg-muted">app_config.json</code> + <code className="px-1 rounded bg-muted">attachments_metadata.json</code>.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-2">
          <p className="text-sm font-semibold">Restore Backup</p>
          <p className="text-xs text-muted-foreground">
            Upload a previously downloaded <strong>.xlsx</strong>, <strong>.zip</strong>, or <strong>.json</strong>.
            You will see a preview before any change is applied.
          </p>
          <input ref={fileRef} type="file" accept=".xlsx,.zip,.json" onChange={onFile} className="hidden" />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={busy}>
            <Archive className="mr-1 h-4 w-4" /> Choose Backup File…
          </Button>
        </div>

        {busy && (
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground">{status}</p>
          </div>
        )}

        <AlertDialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Restore</AlertDialogTitle>
              <AlertDialogDescription>
                File: <strong>{preview?.fileName}</strong>. The following data will be imported (existing rows with
                the same ID will be overwritten). User accounts and activity logs are skipped for safety.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-60 overflow-auto rounded-lg border border-border/60 p-3 text-xs space-y-1">
              {preview?.summary.map((s) => (
                <div key={s.table} className="flex justify-between">
                  <span>{s.table}</span><span className="font-mono">{s.rows}</span>
                </div>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRestore}>Restore</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SectionShell>
  );
}

function AppearanceSection() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <SectionShell>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => isDark && toggle()}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            !isDark ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40",
          )}
        >
          <Sun className="mb-2 h-4 w-4 text-warning" />
          <p className="text-sm font-semibold">Light mode</p>
          <p className="text-[11px] text-muted-foreground">Bright, classic ERP feel.</p>
        </button>
        <button
          onClick={() => !isDark && toggle()}
          className={cn(
            "rounded-xl border p-4 text-left transition-all",
            isDark ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40",
          )}
        >
          <Moon className="mb-2 h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Dark mode</p>
          <p className="text-[11px] text-muted-foreground">Easy on the eyes at night.</p>
        </button>
      </div>
    </SectionShell>
  );
}

function LogoutSection() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  return (
    <SectionShell>
      <p className="text-sm text-muted-foreground">You will need to sign in again to access your workspace.</p>
      <Button
        variant="destructive"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await signOut();
          nav({ to: "/login" });
        }}
        className="w-full sm:w-auto"
      >
        <LogOut className="mr-1 h-4 w-4" /> {busy ? "Signing out…" : "Sign out"}
      </Button>
    </SectionShell>
  );
}

function OpeningSetupSection() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: settings } = useQuery<any>({
    queryKey: ["app_settings"],
    queryFn: async () =>
      (await supabase.from("app_settings").select("*").eq("id", 1).single()).data,
  });

  const [warehouseBal, setWarehouseBal] = useState("0");
  const [stockVal, setStockVal] = useState("0");
  const [cashReceived, setCashReceived] = useState("0");
  const [dueRecv, setDueRecv] = useState("0");
  const [suppPay, setSuppPay] = useState("0");
  const [bankBal, setBankBal] = useState("0");

  useEffect(() => {
    if (!settings) return;
    setWarehouseBal(String(settings.opening_warehouse_balance ?? 0));
    setStockVal(String(settings.opening_stock_value ?? 0));
    setCashReceived(String(settings.opening_cash_received ?? 0));
    setDueRecv(String(settings.opening_due_receivable ?? 0));
    setSuppPay(String(settings.opening_supplier_payable ?? 0));
    setBankBal(String(settings.opening_bank_balance ?? 0));
  }, [settings]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("app_settings")
      .update({
        opening_warehouse_balance: Number(warehouseBal) || 0,
        opening_stock_value: Number(stockVal) || 0,
        opening_cash_received: Number(cashReceived) || 0,
        opening_due_receivable: Number(dueRecv) || 0,
        opening_supplier_payable: Number(suppPay) || 0,
        opening_bank_balance: Number(bankBal) || 0,
      } as any)
      .eq("id", 1);
    setBusy(false);
    setConfirmOpen(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Opening balances saved");
      qc.invalidateQueries({ queryKey: ["app_settings"] });
    }
  };

  const fields: { label: string; value: string; set: (v: string) => void; hint?: string }[] = [
    { label: "Bank Balance", value: bankBal, set: setBankBal, hint: "Initial bank balance before app start" },
    { label: "Warehouse Balance", value: warehouseBal, set: setWarehouseBal, hint: "Cash held at warehouse before app start" },
    { label: "Warehouse Stock Value", value: stockVal, set: setStockVal, hint: "Value of stock already on hand" },
    { label: "Cash Received", value: cashReceived, set: setCashReceived },
    { label: "Due Receivable", value: dueRecv, set: setDueRecv, hint: "Customers' total existing dues" },
    { label: "Supplier Payable", value: suppPay, set: setSuppPay, hint: "Existing payables to suppliers" },
  ];

  return (
    <SectionShell>
      <p className="text-[11.5px] text-muted-foreground">
        Seeds dashboards and ledger calculations before the first app transaction.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label}>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</Label>
            <Input
              type="number"
              step="0.01"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="mt-1.5"
            />
            {f.hint && <p className="mt-1 text-[10.5px] text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/30 p-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Net opening</div>
        <SARAmount
          value={
            (Number(warehouseBal) || 0) +
            (Number(stockVal) || 0) +
            (Number(dueRecv) || 0) -
            (Number(suppPay) || 0)
          }
          size="xl"
        />
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full sm:w-auto">Save opening balances</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save opening balances?</AlertDialogTitle>
            <AlertDialogDescription>
              These values are used everywhere the app calculates totals. Make sure they are correct.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Confirm & save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionShell>
  );
}

function PushNotificationsSection() {
  const { register } = useFcmRegister();
  const access = useUserAccess();
  const [busy, setBusy] = useState(false);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported",
  );

  const enable = async () => {
    setBusy(true);
    try {
      const tok = await register();
      if (typeof window !== "undefined" && "Notification" in window) setPerm(Notification.permission);
      if (!tok && Notification.permission !== "granted") {
        toast.error("Permission not granted");
      }
    } finally { setBusy(false); }
  };

  const sendTest = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") { toast.error("Enable notifications first"); return; }
    try {
      const reg = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js")
        ?? await navigator.serviceWorker.ready;
      if (reg) {
        await reg.showNotification("Test Notification", {
          body: "Push notifications are working on this device.",
          icon: "/favicon.ico",
          tag: `test-${Date.now()}`,
        });
      } else {
        new Notification("Test Notification", { body: "Push notifications are working." });
      }
      toast.success("Test sent");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send test");
    }
  };

  return (
    <div className="space-y-3 p-3">
      <p className="text-sm text-muted-foreground">
        Receive push alerts for new orders, payments, and stock — even when the app is closed.
      </p>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Status:</span>
        <span className={cn(
          "rounded-full px-2 py-0.5 font-medium",
          perm === "granted" ? "bg-emerald-100 text-emerald-700" :
          perm === "denied" ? "bg-rose-100 text-rose-700" :
          "bg-muted text-foreground",
        )}>
          {perm === "unsupported" ? "Unsupported" : perm}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={enable} disabled={busy || perm === "denied" || perm === "unsupported"} size="sm">
          {busy ? "Enabling…" : perm === "granted" ? "Re-register device" : "Enable notifications"}
        </Button>
        {access.isSuperAdmin && (
          <Button onClick={sendTest} variant="outline" size="sm" disabled={perm !== "granted"}>
            Send test notification
          </Button>
        )}
      </div>
      {perm === "denied" && (
        <p className="text-xs text-rose-600">
          Notifications are blocked. Enable them in your browser site settings, then reload.
        </p>
      )}
    </div>
  );
}

function InvoiceFormatSection() {
  const [fmt, setFmt] = useState<InvoiceFormat>(getDefaultInvoiceFormat());
  const change = (v: InvoiceFormat) => {
    setFmt(v);
    setDefaultInvoiceFormat(v);
    toast.success(`Default: ${INVOICE_FORMAT_LABELS[v]}`);
  };
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Used as the default when you tap <b>Save &amp; Share</b> on a sale or purchase. You can still
        change the format from the share popup each time.
      </p>
      <RadioGroup value={fmt} onValueChange={(v) => change(v as InvoiceFormat)} className="gap-2">
        {(["a4", "thermal88", "thermal58"] as InvoiceFormat[]).map((v) => (
          <Label
            key={v}
            htmlFor={`def-${v}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition",
              fmt === v ? "border-primary bg-primary/5" : "border-border hover:bg-accent/40",
            )}
          >
            <RadioGroupItem value={v} id={`def-${v}`} />
            <div className="flex-1 text-sm font-medium">{INVOICE_FORMAT_LABELS[v]}</div>
            {fmt === v && <Check className="h-4 w-4 text-primary" />}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
