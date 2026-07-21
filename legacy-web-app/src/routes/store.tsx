import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingCart, Plus, Minus, Bell, Star, MessageCircle, Check,
  User, History, Languages, Trash2, Pencil, X as XIcon,
} from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useStoreCart } from "@/hooks/use-store-cart";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  StoreI18nProvider, useStoreI18n, useStoreT, STORE_LANGS, pickName,
} from "@/lib/store-i18n";
import { StoreBannerCarousel, type Banner } from "@/components/store-banner-carousel";
import { StoreAdStack, StoreAdCarousel, type ShopAd } from "@/components/store-ad-banner";
import { StoreRecommendations } from "@/components/store-recommendations";

export const Route = createFileRoute("/store")({
  component: StoreRoot,
  head: () => ({
    meta: [
      { title: "Order Online — ShRiAh Group" },
      { name: "description", content: "Browse products and place your order in seconds. Fast, simple, mobile-first ordering in English, Bangla and Arabic." },
      { property: "og:title", content: "Order Online — ShRiAh Group" },
      { property: "og:description", content: "Browse products and place your order in seconds." },
    ],
  }),
});

type Product = {
   id: string;
   name: string;
   name_bn: string | null;
   name_ar: string | null;
   description: string | null;
   image_url: string | null;
   price: number;
   compare_price: number | null;
   stock: number;
   category_id: string | null;
   category_ids: string[] | null;
   barcode: string | null;
   is_featured: boolean;
   show_stock: boolean;
 };
 
 type Category = { id: string; name: string; name_bn: string | null; name_ar: string | null; slug: string | null };
type Notification = { id: string; title: string; message: string | null; type: string; is_pinned: boolean };
type AdPopup = {
  id: number; title: string | null; message: string | null;
  image_url: string | null; button_text: string | null; button_link: string | null; is_active: boolean;
};

// Store WhatsApp fallback (Saudi local format; normalized to 9665... by whatsappLink)
const FALLBACK_WA = "0553687388";


function StoreRoot() {
  return (
    <StoreI18nProvider>
      <StorePage />
    </StoreI18nProvider>
  );
}

function StorePage() {
  const { dir } = useStoreI18n();
  const t = useStoreT();
  const cart = useStoreCart();
  const profile = useStoreProfile();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adShown, setAdShown] = useState(false);
  const [adDismissed, setAdDismissed] = useState(false);

  const products = useQuery({
    queryKey: ["store-products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("shop_products_public" as any)
        .select("id,name,name_bn,name_ar,description,image_url,price,compare_price,stock,category_id,category_ids,barcode,is_featured,show_stock")
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as unknown) as Product[];
    },
    staleTime: 60_000,
  });

  const categories = useQuery({
    queryKey: ["store-categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("shop_categories")
        .select("id,name,name_bn,name_ar,slug")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
    staleTime: 5 * 60_000,
  });

  const notifications = useQuery({
    queryKey: ["store-notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from("shop_notifications")
        .select("id,title,message,type,is_pinned")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as Notification[];
    },
    staleTime: 60_000,
  });

  const adPopup = useQuery({
    queryKey: ["store-ad"],
    queryFn: async (): Promise<AdPopup | null> => {
      const { data, error } = await supabase
        .from("shop_ad_popup").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data as AdPopup | null;
    },
    staleTime: 5 * 60_000,
  });

  const banners = useQuery({
    queryKey: ["store-banners"],
    queryFn: async (): Promise<Banner[]> => {
      const { data, error } = await (supabase as any)
        .from("shop_banners")
        .select("id,image_url,link_url,title,title_bn,title_ar,message,message_bn,message_ar,description,link_type,link_value,start_date,end_date")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(20);
      if (error) return [];
      const now = Date.now();
      return ((data ?? []) as Banner[]).filter((b) => {
        if (b.start_date && new Date(b.start_date).getTime() > now) return false;
        if (b.end_date && new Date(b.end_date).getTime() < now) return false;
        return true;
      }).slice(0, 10);
    },
    staleTime: 5 * 60_000,
  });

  const settings = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("app_settings").select("store_whatsapp,currency").eq("id", 1).maybeSingle();
      if (error) return null;
      return data as { store_whatsapp: string | null; currency: string | null } | null;
    },
    staleTime: 10 * 60_000,
  });

  const ads = useQuery({
    queryKey: ["store-ads"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<ShopAd[]> => {
      const { data, error } = await (supabase as any)
        .from("shop_ads")
        .select("id,title,image_url,placement,link_type,link_value,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) return [];
      return (data ?? []) as ShopAd[];
    },
  });
  const homeAds = (ads.data ?? []).filter((a) => a.placement === "home" || a.placement === "both");
  const successAds = (ads.data ?? []).filter((a) => a.placement === "success" || a.placement === "both").slice(0, 2);

  const handleAdAction = (a: ShopAd) => {
    if (a.link_type === "category" && a.link_value) {
      setCatFilter(a.link_value);
      setSearch("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (a.link_type === "product" && a.link_value) {
      const p = (products.data ?? []).find((x) => x.id === a.link_value);
      if (p) {
        setSearch(p.name);
        setCatFilter(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const contactWA = settings.data?.store_whatsapp || FALLBACK_WA;

  useEffect(() => {
    if (adShown) return;
    if (!adPopup.data?.is_active) return;
    const t = setTimeout(() => setAdShown(true), 800);
    return () => clearTimeout(t);
  }, [adPopup.data, adShown]);

  const { lang } = useStoreI18n();
  const catById = useMemo(() => {
    const m = new Map<string, Category>();
    (categories.data ?? []).forEach((c) => m.set(c.id, c));
    return m;
  }, [categories.data]);

  const productCatIds = (p: Product): string[] => {
    const ids = new Set<string>();
    if (p.category_id) ids.add(p.category_id);
    (p.category_ids ?? []).forEach((id) => id && ids.add(id));
    return Array.from(ids);
  };

  const filtered = useMemo(() => {
    const list = products.data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter(p => {
      if (catFilter) {
        const ids = productCatIds(p);
        if (!ids.includes(catFilter)) return false;
      }
      if (!q) return true;
      // Search: name (multi-lang), barcode, and assigned category names
      const catNames = productCatIds(p)
        .map((id) => catById.get(id))
        .filter(Boolean)
        .flatMap((c) => [c!.name, c!.name_bn, c!.name_ar, c!.slug])
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.name_bn ?? "").toLowerCase().includes(q) ||
        (p.name_ar ?? "").toLowerCase().includes(q) ||
        (p.barcode ?? "").toLowerCase().includes(q) ||
        catNames.includes(q)
      );
    });
  }, [products.data, search, catFilter, catById]);


  const featured = useMemo(
    () => (products.data ?? []).filter(p => p.is_featured).slice(0, 8),
    [products.data]
  );

  // Smart-category home sections (Best Seller / New Arrival / Offer / Recommended)
  const smartCats = useMemo(() => {
    const wanted = ["recommended", "best-seller", "new-arrival", "offer"] as const;
    const map = new Map<string, Category>();
    (categories.data ?? []).forEach((c) => {
      const s = (c.slug ?? "").toLowerCase();
      if (s && (wanted as readonly string[]).includes(s)) map.set(s, c);
    });
    return wanted.map((slug) => map.get(slug)).filter(Boolean) as Category[];
  }, [categories.data]);

  const smartSections = useMemo(() => {
    return smartCats.map((c) => ({
      cat: c,
      products: (products.data ?? []).filter((p) => productCatIds(p).includes(c.id)).slice(0, 12),
    })).filter((s) => s.products.length > 0);
  }, [smartCats, products.data]);

  // Pin "Recommended" products to the top of the main grid
  const recommendedCatId = smartCats.find((c) => (c.slug ?? "").toLowerCase() === "recommended")?.id;
  const sortedFiltered = useMemo(() => {
    if (!recommendedCatId) return filtered;
    const rec: Product[] = [], rest: Product[] = [];
    for (const p of filtered) {
      (productCatIds(p).includes(recommendedCatId) ? rec : rest).push(p);
    }
    return [...rec, ...rest];
  }, [filtered, recommendedCatId]);

  const pinnedBanner = notifications.data?.find(n => n.is_pinned);

  const reorder = (items: { id: string; name: string; qty: number; price: number; compare_price?: number | null; image_url?: string | null }[]) => {
    items.forEach((it) => {
      const product = products.data?.find(p => p.id === it.id);
      const stock = product?.stock ?? Infinity;
      const qty = Math.min(it.qty, stock);
      if (qty > 0) {
        const cp = product?.compare_price ?? it.compare_price ?? null;
        cart.setQty(
          { id: it.id, name: it.name, price: Number(it.price), compare_price: cp != null ? Number(cp) : null, image_url: it.image_url ?? null },
          qty
        );
      }
    });
    setAccountOpen(false);
    setCartOpen(true);
    toast.success(t("store.cart"));
  };


  return (
    <div className="min-h-screen bg-background pb-28" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight">{t("store.title")}</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("store.tagline")}</p>
          </div>
          <div className="ms-auto flex items-center gap-1.5">
            <LangSwitcher />
            <button
              onClick={() => setAccountOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
              aria-label={t("store.account")}
            >
              <User className="h-5 w-5" />
            </button>
            <NotificationBell items={notifications.data ?? []} />
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
              aria-label={t("store.cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.count > 0 && (
                <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {cart.count}
                </span>
              )}
            </button>
          </div>
        </div>

        {pinnedBanner && (
          <div className="bg-primary/10 px-4 py-2 text-center text-xs font-medium text-primary">
            📣 {pinnedBanner.title}{pinnedBanner.message ? ` — ${pinnedBanner.message}` : ""}
          </div>
        )}

        {/* Search */}
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("store.searchPlaceholder")}
              className="h-11 ps-9 rounded-full"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="mx-auto max-w-3xl overflow-x-auto px-4 pb-3">
          <div className="flex gap-2">
            <CategoryChip active={!catFilter} onClick={() => setCatFilter(null)}>{t("store.all")}</CategoryChip>
            {(categories.data ?? []).map(c => (
              <CategoryChip key={c.id} active={catFilter === c.id} onClick={() => setCatFilter(c.id)}>
                {pickName(useStoreI18nLang(), c)}
              </CategoryChip>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {/* Banner carousel */}
        {!search && !catFilter && (banners.data?.length ?? 0) > 0 && (
          <StoreBannerCarousel
            banners={banners.data ?? []}
            onAction={(b) => {
              if (b.link_type === "category" && b.link_value) {
                setCatFilter(b.link_value);
                setSearch("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (b.link_type === "product" && b.link_value) {
                const p = (products.data ?? []).find((x) => x.id === b.link_value);
                if (p) {
                  setSearch(p.name);
                  setCatFilter(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            }}
          />
        )}

        {/* Home page promotional banners */}
        {!search && !catFilter && homeAds.length > 0 && (
          <section className="mb-5">
            <StoreAdCarousel ads={homeAds} onAction={handleAdAction} />
          </section>
        )}

        {/* Featured strip */}
        {!search && !catFilter && featured.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Star className="h-4 w-4 text-amber-500" /> {t("store.featured")}
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {featured.map(p => (
                <FeaturedCard
                  key={p.id}
                  product={p}
                  qty={cart.items.find(i => i.id === p.id)?.qty ?? 0}
                  onInc={() => cart.add(productToCart(p, lang), 1)}
                  onDec={() => cart.add(productToCart(p, lang), -1)}
                  onSet={(n) => cart.setQty(productToCart(p, lang), n)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Smart category strips (Recommended, Best Seller, New Arrival, Offer) */}
        {!search && !catFilter && smartSections.map(({ cat, products: items }) => {
          const slug = (cat.slug ?? "").toLowerCase();
          const icon = slug === "best-seller" ? "🔥" : slug === "new-arrival" ? "🆕" : slug === "offer" ? "🏷" : "⭐";
          return (
            <section key={cat.id} className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                  <span>{icon}</span> {pickName(lang, cat)}
                </h2>
                <button
                  onClick={() => { setCatFilter(cat.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-[11px] font-medium text-primary"
                >
                  {t("store.all")} →
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {items.map(p => (
                  <FeaturedCard
                    key={p.id}
                    product={p}
                    qty={cart.items.find(i => i.id === p.id)?.qty ?? 0}
                    onInc={() => cart.add(productToCart(p, lang), 1)}
                    onDec={() => cart.add(productToCart(p, lang), -1)}
                    onSet={(n) => cart.setQty(productToCart(p, lang), n)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Product grid */}
        <section>
          <h2 className="mb-3 text-sm font-semibold">{t("store.products")}</h2>
          {products.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted/50" />
              ))}
            </div>
          ) : sortedFiltered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t("store.noProducts")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sortedFiltered.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={cart.items.find(i => i.id === p.id)?.qty ?? 0}
                  onInc={() => cart.add(productToCart(p, lang), 1)}
                  onDec={() => cart.add(productToCart(p, lang), -1)}
                  onSet={(n) => cart.setQty(productToCart(p, lang), n)}
                />
              ))}
            </div>
          )}
        </section>

        <p className="mt-8 mb-4 text-center text-[11px] text-muted-foreground">
          {t("store.helpFooter")}
        </p>
      </main>

      {/* Sticky bottom cart bar */}
      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                {cart.count} {cart.count > 1 ? t("store.cartItems") : t("store.cartItem")}
              </p>
              <p className="text-base font-bold">SAR {cart.total.toFixed(2)}</p>
            </div>
            <Button size="lg" className="h-12 px-6 text-base" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
              {t("store.checkout")}
            </Button>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      {/* Account sheet */}
      <AccountSheet
        open={accountOpen}
        onOpenChange={setAccountOpen}
        profile={profile}
        onReorder={reorder}
        contactWA={contactWA}
      />

      {/* Checkout sheet */}
      <CheckoutSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        profile={profile}
        contactWA={contactWA}
        successAds={successAds}
        allProducts={products.data ?? []}
        onAdAction={(a) => { setCheckoutOpen(false); handleAdAction(a); }}
      />


      {/* Ad popup */}
      {adShown && !adDismissed && adPopup.data?.is_active && (
        <Dialog open={true} onOpenChange={(v) => !v && setAdDismissed(true)}>
          <DialogContent className="max-w-sm p-0 overflow-hidden">
            {adPopup.data.image_url && (
              <img src={adPopup.data.image_url} alt="" className="aspect-video w-full object-cover" loading="lazy" />
            )}
            <div className="p-5">
              <DialogHeader>
                <DialogTitle className="text-xl">{adPopup.data.title ?? "Special Offer"}</DialogTitle>
              </DialogHeader>
              {adPopup.data.message && (
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{adPopup.data.message}</p>
              )}
              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setAdDismissed(true)}>{t("store.close")}</Button>
                {adPopup.data.button_text && (
                  <Button className="flex-1" onClick={() => {
                    setAdDismissed(true);
                    if (adPopup.data?.button_link) window.location.href = adPopup.data.button_link;
                  }}>
                    {adPopup.data.button_text}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function useStoreI18nLang() {
  return useStoreI18n().lang;
}

function productToCart(p: Product, lang: "en" | "bn" | "ar" = "en") {
  return {
    id: p.id,
    name: pickName(lang, p),
    price: Number(p.price),
    compare_price: p.compare_price != null ? Number(p.compare_price) : null,
    image_url: p.image_url,
  };
}

/** Returns saving info if the "Other Company Price" is greater than our price. */
function calcSaving(price: number, comparePrice: number | null | undefined) {
  const cp = Number(comparePrice ?? 0);
  const p = Number(price ?? 0);
  if (!Number.isFinite(cp) || cp <= p) return null;
  const save = cp - p;
  const pct = Math.round((save / cp) * 100);
  return { save, pct, comparePrice: cp };
}



function LangSwitcher() {
  const { lang, setLang } = useStoreI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-muted p-0.5" role="group" aria-label="Language">
      <Languages className="ms-1.5 h-3.5 w-3.5 text-muted-foreground" />
      {STORE_LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={cn(
            "rounded-full px-2 py-1 text-[10px] font-bold tracking-wider transition-colors",
            lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function QtyControl({
  qty, onInc, onDec, onSet, disabled, max,
}: {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  onSet?: (n: number) => void;
  disabled?: boolean;
  max?: number;
}) {
  const t = useStoreT();
  const [draft, setDraft] = useState<string>(String(qty));

  // Keep local draft in sync when external qty changes (e.g. +/- pressed).
  useEffect(() => { setDraft(String(qty)); }, [qty]);

  // Debounced commit while typing.
  useEffect(() => {
    if (!onSet) return;
    if (draft === "" || draft === String(qty)) return;
    const handle = setTimeout(() => {
      const parsed = parseInt(draft.replace(/[^\d]/g, ""), 10);
      if (!Number.isFinite(parsed) || parsed < 1) { setDraft(String(qty)); return; }
      const capped = typeof max === "number" ? Math.min(parsed, Math.max(1, max)) : parsed;
      if (typeof max === "number" && parsed > max) {
        toast.warning(t("store.onlyXAvailable", { n: max }));
        setDraft(String(capped));
      }
      if (capped !== qty) onSet(capped);
    }, 150);
    return () => clearTimeout(handle);
  }, [draft, qty, max, onSet, t]);

  if (qty === 0) {
    return (
      <Button size="sm" onClick={onInc} disabled={disabled} className="h-9 w-full rounded-full px-3 text-xs font-semibold">
        <Plus className="me-1 h-4 w-4" /> {t("store.add")}
      </Button>
    );
  }
  return (
    <div className="flex w-full items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground">
      <button onClick={onDec} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-primary-foreground/15" aria-label="Decrease">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
        onBlur={() => { if (!draft) setDraft(String(qty)); }}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Quantity"
        className="min-w-0 flex-1 bg-transparent text-center text-sm font-semibold outline-none placeholder:text-primary-foreground/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button onClick={onInc} disabled={disabled} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-primary-foreground/15 disabled:opacity-50" aria-label="Increase">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}


function ProfitBadge({ perPiece, qty, size = "md" }: { perPiece: number; qty: number; size?: "sm" | "md" }) {
  const effectiveQty = qty > 0 ? qty : 1;
  const target = perPiece * effectiveQty;
  const [display, setDisplay] = useState(target);
  
  useEffect(() => {
    let raf = 0;
    const start = display;
    const end = target;
    if (start === end) return;
    const dur = 450;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  if (perPiece <= 0) return null;
  const isSm = size === "sm";
  return (
    <div
      lang="bn"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-400/70 bg-[#E8FFF2] dark:bg-emerald-950/40 dark:border-emerald-700",
        isSm ? "px-2 py-0.5" : "px-2.5 py-1",
        "shadow-sm transition-transform"
      )}
    >
      <span className={isSm ? "text-sm" : "text-base"}>🎁</span>
      <div className="flex flex-col leading-tight">
        <span className={cn("font-semibold text-emerald-800 dark:text-emerald-200", isSm ? "text-[9px]" : "text-[10px]")}>
          {qty > 0 ? "এখন পর্যন্ত আপনার লাভ" : "আপনার লাভ"}
        </span>
        <span className={cn("font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums", isSm ? "text-sm" : "text-base")}>
          SAR {display.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ProductCard({ product, qty, onInc, onDec, onSet }: { product: Product; qty: number; onInc: () => void; onDec: () => void; onSet?: (n: number) => void }) {

  const t = useStoreT();
  const { lang } = useStoreI18n();
  const out = product.stock <= 0;
  const reachedMax = qty >= product.stock;
  const displayName = pickName(lang, product);
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-square bg-muted">
        {product.image_url ? (
          <img src={product.image_url} alt={displayName} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">—</div>
        )}
        {product.is_featured && (
          <Badge className="absolute start-2 top-2 bg-amber-500 text-white">★</Badge>
        )}
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs font-bold uppercase tracking-wider">
            {t("store.outOfStock")}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 min-h-[2.4rem] text-[13px] font-medium leading-tight">{displayName}</p>
        {(() => {
          const s = calcSaving(product.price, product.compare_price);
          if (!s) {
            return (
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-sm font-bold">
                  SAR {Number(product.price).toFixed(2)}{" "}
                  <span className="text-[10px] font-normal text-muted-foreground">{t("store.vatIncl")}</span>
                </p>
                {product.show_stock && !out && (
                  <p className="text-[10px] text-muted-foreground">{t("store.stockLabel")}: {product.stock}</p>
                )}
              </div>
            );
          }
          return (
            <div className="mt-1.5 space-y-0.5">
              <p className="text-[11px] text-muted-foreground">
                {t("store.otherPrice")}{" "}
                <span className="line-through">SAR {s.comparePrice.toFixed(2)}</span>
              </p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                SAR {Number(product.price).toFixed(2)}
              </p>
              <ProfitBadge perPiece={s.save} qty={qty} size="md" />

              {product.show_stock && !out && (
                <p className="text-[10px] text-muted-foreground">{t("store.stockLabel")}: {product.stock}</p>
              )}
            </div>
          );
        })()}
        <div className="mt-auto pt-2">
          <QtyControl
            qty={qty}
            onInc={onInc}
            onDec={onDec}
            onSet={onSet}
            disabled={out || reachedMax}
            max={product.stock}
          />
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ product, qty, onInc, onDec, onSet }: { product: Product; qty: number; onInc: () => void; onDec: () => void; onSet?: (n: number) => void }) {
  const t = useStoreT();
  const { lang } = useStoreI18n();
  const out = product.stock <= 0;
  const reachedMax = qty >= product.stock;
  const displayName = pickName(lang, product);
  return (
    <div className="flex w-44 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-50/50 to-amber-100/20 dark:from-amber-950/20 dark:to-amber-900/10">
      <div className="relative aspect-square w-full bg-muted">
        {product.image_url && <img src={product.image_url} alt={displayName} className="h-full w-full object-cover" loading="lazy" />}
        <Badge className="absolute start-2 top-2 bg-amber-500 text-white text-[10px]">★ {t("store.featuredBanner")}</Badge>
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-[11px] font-bold uppercase">
            {t("store.outOfStock")}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-1 text-xs font-semibold">{displayName}</p>
        {(() => {
          const s = calcSaving(product.price, product.compare_price);
          if (!s) {
            return (
              <p className="mt-0.5 text-sm font-bold text-primary">
                SAR {Number(product.price).toFixed(2)}
              </p>
            );
          }
          return (
            <div className="mt-0.5">
              <p className="text-[10px] text-muted-foreground line-through leading-tight">SAR {s.comparePrice.toFixed(2)}</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">SAR {Number(product.price).toFixed(2)}</p>
              <ProfitBadge perPiece={s.save} qty={qty} size="sm" />

            </div>
          );
        })()}
        <div className="mt-auto pt-2">
          <QtyControl
            qty={qty}
            onInc={onInc}
            onDec={onDec}
            onSet={onSet}
            disabled={out || reachedMax}
            max={product.stock}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationBell({ items }: { items: Notification[] }) {
  const t = useStoreT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
        aria-label={t("store.notifications")}
      >
        <Bell className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {items.length}
          </span>
        )}
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-md">
          <SheetHeader><SheetTitle>{t("store.notifications")}</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-2">
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">{t("store.noNotifications")}</p>
            ) : items.map(n => (
              <div key={n.id} className="rounded-2xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{n.type.replace("_", " ")}</Badge>
                  {n.is_pinned && <Badge className="text-[10px]">{t("store.pinned")}</Badge>}
                </div>
                <p className="mt-1.5 text-sm font-semibold">{n.title}</p>
                {n.message && <p className="mt-0.5 text-xs text-muted-foreground whitespace-pre-wrap">{n.message}</p>}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function CartSheet({
  open, onOpenChange, cart, onCheckout,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cart: ReturnType<typeof useStoreCart>;
  onCheckout: () => void;
}) {
  const t = useStoreT();
  const cartSaving = cart.items.reduce((s, i) => {
    const sv = calcSaving(i.price, i.compare_price);
    return s + (sv ? sv.save * i.qty : 0);
  }, 0);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>{t("store.cart")}</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-4rem)] flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {cart.items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">{t("store.cartEmpty")}</p>
            ) : (
              <div className="space-y-3">
                {cart.items.map(i => {
                  const sv = calcSaving(i.price, i.compare_price);
                  const pass = { id: i.id, name: i.name, price: i.price, compare_price: i.compare_price ?? null, image_url: i.image_url };
                  return (
                  <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                      {i.image_url ? (
                        <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-tight">{i.name}</p>
                      {sv && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-through">SAR {sv.comparePrice.toFixed(2)}</p>
                      )}
                      <p className={cn("mt-0.5 text-xs text-muted-foreground", sv && "")}>
                        SAR {i.price.toFixed(2)} × {i.qty}
                      </p>
                      <p className={cn("mt-1 text-base font-bold", sv ? "text-emerald-600 dark:text-emerald-400" : "text-primary")}>
                        SAR {(i.price * i.qty).toFixed(2)}
                      </p>
                      {sv && (
                        <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                          🟢 {t("store.youSave", { n: (sv.save * i.qty).toFixed(0) })}
                        </span>
                      )}
                    </div>
                    <div className="w-[120px] flex-shrink-0">
                      <QtyControl
                        qty={i.qty}
                        onInc={() => cart.add(pass, 1)}
                        onDec={() => cart.add(pass, -1)}
                        onSet={(n) => cart.setQty(pass, n)}
                      />
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
          {cart.items.length > 0 && (
            <div className="border-t border-border bg-card px-5 py-4">
              {cartSaving > 0 && (
                <div className="mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-center text-[13px] font-semibold text-emerald-700 dark:text-emerald-300">
                  🟢 {t("store.totalSaving")}: SAR {cartSaving.toFixed(2)}
                </div>
              )}
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">{t("store.total")}</span>
                <span className="text-2xl font-bold">SAR {cart.total.toFixed(2)}</span>
              </div>
              <Button size="lg" className="h-12 w-full text-base" onClick={onCheckout}>
                {t("store.continueCheckout")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AccountSheet({
  open, onOpenChange, profile, onReorder, contactWA,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: ReturnType<typeof useStoreProfile>;
  onReorder: (items: any[]) => void;
  contactWA?: string;
}) {
  const t = useStoreT();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.profile.name);
  const [mobile, setMobile] = useState(profile.profile.mobile);
  const [address, setAddress] = useState(profile.profile.address);
  const [openOrderNum, setOpenOrderNum] = useState<number | null>(null);
  const openOrder = useMemo(
    () => openOrderNum == null ? null : profile.history.find(o => o.order_number === openOrderNum) ?? null,
    [openOrderNum, profile.history]
  );

  useEffect(() => {
    if (open) {
      setName(profile.profile.name);
      setMobile(profile.profile.mobile);
      setAddress(profile.profile.address);
      setEditing(!profile.profile.name);
    }
  }, [open, profile.profile]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle>{t("store.account")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          <section>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t("store.yourName")}</label>
                  <Input className="mt-1 h-11" value={name} onChange={e => setName(e.target.value)} placeholder={t("store.namePlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t("store.mobile")}</label>
                  <Input className="mt-1 h-11" inputMode="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder={t("store.mobilePlaceholder")} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">{t("store.address")}</label>
                  <Textarea className="mt-1" rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder={t("store.addressPlaceholder")} />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    profile.saveProfile({ name: name.trim(), mobile: mobile.trim(), address: address.trim() });
                    setEditing(false);
                  }}
                >
                  {t("store.done")}
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("store.savedAs")}</p>
                <p className="mt-1 text-base font-bold">{profile.profile.name || "—"}</p>
                <p className="text-xs text-muted-foreground">{profile.profile.mobile || "—"}</p>
                {profile.profile.address && (
                  <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">{profile.profile.address}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing(true)}>
                    {t("store.changeDetails")}
                  </Button>
                  {profile.profile.name && (
                    <Button size="sm" variant="ghost" onClick={() => { profile.clearProfile(); setEditing(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <History className="h-4 w-4" /> {t("store.orderHistory")}
            </h3>
            {(() => {
              const totalSaving = profile.history
                .filter((o) => (o.status ?? "").toLowerCase() !== "cancelled")
                .reduce((s, o) => s + o.items.reduce((ss, i) => {
                  const sv = calcSaving(i.price, (i as any).compare_price);
                  return ss + (sv ? sv.save * i.qty : 0);
                }, 0), 0);
              return totalSaving > 0 ? (
                <div className="mb-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    {t("store.totalSavingsAll")}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    SAR {totalSaving.toFixed(2)}
                  </p>
                </div>
              ) : null;
            })()}
            {profile.history.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">{t("store.noOrders")}</p>
            ) : (
              <div className="space-y-2">
                {profile.history.map((o) => {
                  const st = (o.status ?? "pending").toLowerCase();
                  const tone =
                    st === "cancelled" ? "bg-red-500/10 text-red-600 ring-red-500/20"
                    : st === "delivered" || st === "converted" ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                    : st === "pending" || st === "new" ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                    : "bg-primary/10 text-primary ring-primary/20";
                  return (
                    <button
                      type="button"
                      key={o.order_number}
                      onClick={() => setOpenOrderNum(o.order_number)}
                      className="block w-full rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40 active:bg-muted"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">{t("store.orderNo")}{o.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                        {o.items.map(i => `${i.name} ×${i.qty}`).join(" · ")}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-bold">SAR {Number(o.total).toFixed(2)}</p>
                        <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold capitalize ring-1", tone)}>
                          {st}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </SheetContent>

      <OrderDetailsDialog
        order={openOrder}
        profile={profile}
        contactWA={contactWA}
        onOpenChange={(v) => !v && setOpenOrderNum(null)}
        onReorder={(items) => { setOpenOrderNum(null); onReorder(items); }}
      />
    </Sheet>
  );
}

function OrderDetailsDialog({
  order, profile, contactWA, onOpenChange, onReorder,
}: {
  order: ReturnType<typeof useStoreProfile>["history"][number] | null;
  profile: ReturnType<typeof useStoreProfile>;
  contactWA?: string;
  onOpenChange: (v: boolean) => void;
  onReorder: (items: any[]) => void;
}) {
  const t = useStoreT();
  const confirm = useConfirm();
  const open = !!order;
  const [editMode, setEditMode] = useState(false);
  const [draftItems, setDraftItems] = useState<NonNullable<typeof order>["items"]>([]);
  const [draftNotes, setDraftNotes] = useState("");

  useEffect(() => {
    if (!open) { setEditMode(false); return; }
    setDraftItems(order?.items ?? []);
    setDraftNotes(order?.notes ?? "");
  }, [open, order]);

  const subtotal = useMemo(
    () => (order?.items ?? []).reduce((s, i) => s + i.qty * i.price, 0),
    [order]
  );
  const grand = Number(order?.total ?? subtotal);
  const diff = +(grand - subtotal).toFixed(2);
  const status = (order?.status ?? "Placed").toLowerCase();
  const editable = status === "pending" || status === "new";

  const draftTotal = useMemo(
    () => draftItems.reduce((s, i) => s + i.qty * i.price, 0),
    [draftItems]
  );

  const cancelMut = useMutation({
    mutationFn: async () => {
      if (!order?.id) throw new Error("Missing order reference");
      const { error } = await (supabase as any).rpc("cancel_public_shop_order", {
        _order_id: order.id,
        _customer_mobile: profile.profile.mobile,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      if (order) profile.updateOrder(order.order_number, { status: "cancelled" });
      toast.success(t("store.orderCancelled") || "Order cancelled");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not cancel order"),
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!order?.id) throw new Error("Missing order reference");
      const items = draftItems
        .filter(i => i.qty > 0)
        .map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, image_url: i.image_url ?? null }));
      if (items.length === 0) throw new Error("Order must have at least one item");
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      const { error } = await (supabase as any).rpc("update_public_shop_order", {
        _order_id: order.id,
        _customer_mobile: profile.profile.mobile,
        _items: items,
        _total: total,
        _notes: draftNotes.trim() || null,
      });
      if (error) throw error;
      return { items, total };
    },
    onSuccess: ({ items, total }) => {
      if (order) profile.updateOrder(order.order_number, { items, total, notes: draftNotes.trim() || undefined });
      setEditMode(false);
      toast.success(t("store.orderUpdated") || "Order updated successfully");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not update order"),
  });

  const onCancelClick = async () => {
    const ok = await confirm({
      title: t("store.cancelOrderQ") || "Cancel this order?",
      description: t("store.cancelOrderDesc") || "This action will notify admin.",
      confirmText: t("store.cancelOrder") || "Cancel order",
      cancelText: t("store.keepOrder") || "Keep order",
      tone: "danger",
    });
    if (ok) cancelMut.mutate();
  };

  const setQty = (id: string, qty: number) =>
    setDraftItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, qty) } : i));
  const removeItem = (id: string) => setDraftItems(prev => prev.filter(i => i.id !== id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base">
            {editMode ? (t("store.editOrder") || "Edit order") : t("store.orderDetails")}
          </DialogTitle>
          {order && (
            <p className="text-[11px] text-muted-foreground">
              {t("store.orderNo")}{order.order_number} · {new Date(order.created_at).toLocaleString()}
            </p>
          )}
        </DialogHeader>

        {order && (
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 px-5 py-3 text-[11px]">
              <div className="rounded-xl bg-muted/40 px-3 py-2">
                <p className="text-muted-foreground">{t("store.status")}</p>
                <p className="mt-0.5 text-[12px] font-semibold capitalize">{status}</p>
              </div>
              <div className="rounded-xl bg-muted/40 px-3 py-2">
                <p className="text-muted-foreground">{t("store.paymentStatus")}</p>
                <p className="mt-0.5 text-[12px] font-semibold">—</p>
              </div>
            </div>

            {!editable && status !== "cancelled" && (
              <div className="mx-5 mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11.5px] text-amber-700 dark:text-amber-300">
                {t("store.notEditableMsg") || "This order can no longer be edited or cancelled."}
              </div>
            )}

            <div className="px-5 pb-3">
              <div className="rounded-xl border border-border bg-card p-3 text-[12px]">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">{t("store.customer")}</span>
                  <span className="font-medium">{profile.profile.name || "—"}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-muted-foreground">{t("store.phone")}</span>
                  <span className="font-medium tabular-nums">{profile.profile.mobile || "—"}</span>
                </div>
                {profile.profile.address && (
                  <div className="mt-2">
                    <p className="text-muted-foreground">{t("store.deliveryAddress")}</p>
                    <p className="mt-0.5 whitespace-pre-wrap">{profile.profile.address}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 pb-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("store.items")} · {(editMode ? draftItems : order.items).length}
              </p>
              <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card">
                {(editMode ? draftItems : order.items).map((i) => (
                  <li key={i.id} className="flex items-center gap-3 p-2.5">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {i.image_url ? (
                        <img src={i.image_url} alt={i.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[12.5px] font-medium leading-tight">{i.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {editMode ? `SAR ${Number(i.price).toFixed(2)}` : `${t("store.qty")}: ${i.qty} × SAR ${Number(i.price).toFixed(2)}`}
                      </p>
                    </div>
                    {editMode ? (
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.id, i.qty - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-[12px] font-semibold tabular-nums">{i.qty}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQty(i.id, i.qty + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => removeItem(i.id)}>
                          <XIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="shrink-0 text-[13px] font-semibold tabular-nums">
                        SAR {(i.qty * i.price).toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {editMode && (
              <div className="px-5 pb-3">
                <label className="text-[11px] font-medium text-muted-foreground">{t("store.notes")}</label>
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={draftNotes}
                  onChange={e => setDraftNotes(e.target.value)}
                  placeholder={t("store.notesPlaceholder")}
                />
              </div>
            )}

            <div className="px-5 pb-4">
              <dl className="rounded-xl border border-border bg-card px-3 py-2 text-[12px]">
                {!editMode && (
                  <>
                    <div className="flex items-baseline justify-between py-1">
                      <dt className="text-muted-foreground">{t("store.subtotal")}</dt>
                      <dd className="tabular-nums">SAR {subtotal.toFixed(2)}</dd>
                    </div>
                    {diff < 0 && (
                      <div className="flex items-baseline justify-between py-1">
                        <dt className="text-muted-foreground">{t("store.discount")}</dt>
                        <dd className="tabular-nums text-emerald-600 dark:text-emerald-400">
                          − SAR {Math.abs(diff).toFixed(2)}
                        </dd>
                      </div>
                    )}
                    {diff > 0 && (
                      <div className="flex items-baseline justify-between py-1">
                        <dt className="text-muted-foreground">{t("store.delivery")}</dt>
                        <dd className="tabular-nums">SAR {diff.toFixed(2)}</dd>
                      </div>
                    )}
                  </>
                )}
                <div className="mt-1 flex items-baseline justify-between border-t border-border pt-2">
                  <dt className="text-[12.5px] font-semibold">{t("store.grandTotal")}</dt>
                  <dd className="text-base font-bold tabular-nums text-primary">
                    SAR {(editMode ? draftTotal : grand).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-5 py-3">
              {editMode ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)} disabled={updateMut.isPending}>
                    {t("store.cancel") || "Cancel"}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => updateMut.mutate()}
                    disabled={updateMut.isPending || draftItems.filter(i => i.qty > 0).length === 0}
                  >
                    {updateMut.isPending ? "…" : (t("store.saveChanges") || "Save changes")}
                  </Button>
                </div>
              ) : editable ? (
                <>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setEditMode(true)}>
                      <Pencil className="h-3.5 w-3.5" /> {t("store.editOrder") || "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600"
                      onClick={onCancelClick}
                      disabled={cancelMut.isPending}
                    >
                      <XIcon className="h-3.5 w-3.5" /> {t("store.cancelOrder") || "Cancel"}
                    </Button>
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => onReorder(order.items)}>
                    {t("store.reorder")}
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={() => onReorder(order.items)}>
                  {t("store.reorder")}
                </Button>
              )}
              {contactWA && !editMode && (
                <a
                  href={whatsappLink(
                    contactWA,
                    `Hi, I need help with order #${order.order_number}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-[12.5px] font-medium text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                >
                  <MessageCircle className="h-4 w-4" /> {t("store.support")}
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


function CheckoutSheet({ open, onOpenChange, cart, profile, contactWA, successAds, allProducts, onAdAction }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cart: ReturnType<typeof useStoreCart>;
  profile: ReturnType<typeof useStoreProfile>;
  contactWA: string;
  successAds: ShopAd[];
  allProducts: Product[];
  onAdAction: (a: ShopAd) => void;
}) {
  const t = useStoreT();
  const { lang } = useStoreI18n();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<null | { orderNumber: number; message: string; itemIds: string[]; categoryIds: string[]; saving: number; otherTotal: number; ourTotal: number }>(null);

  const checkoutSaving = cart.items.reduce((s, i) => {
    const sv = calcSaving(i.price, i.compare_price);
    return s + (sv ? sv.save * i.qty : 0);
  }, 0);
  const checkoutOtherTotal = cart.items.reduce((s, i) => {
    const cp = Number(i.compare_price ?? 0);
    return s + (cp > i.price ? cp : i.price) * i.qty;
  }, 0);

  // Auto-fill from saved profile when opened
  useEffect(() => {
    if (!open) return;
    setName(profile.profile.name);
    setMobile(profile.profile.mobile);
    setAddress(profile.profile.address);
    setNotes("");
  }, [open, profile.profile]);

  const submit = useMutation({
    mutationFn: async () => {
      const items = cart.items.map(i => ({
        id: i.id, name: i.name, qty: i.qty, price: i.price, compare_price: i.compare_price ?? null, image_url: i.image_url,
      }));
      const total = cart.total;
      if (items.length === 0 || total <= 0) throw new Error("Cart is empty");
      const { data, error } = await (supabase as any)
        .rpc("create_public_shop_order", {
          _customer_name: name.trim(),
          _customer_mobile: mobile.trim(),
          _customer_address: address.trim() || null,
          _notes: notes.trim() || null,
          _items: items,
          _total: total,
        })
        .single();
      if (error) throw error;
      // Fire-and-forget: trigger real FCM push + email notifications to admins.
      try {
        const orderId = (data as any)?.id;
        if (orderId) {
          fetch("/api/public/send-order-push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
            keepalive: true,
          }).catch(() => {});
          fetch("/api/public/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
            keepalive: true,
          }).catch(() => {});
        }
      } catch { /* noop */ }
      return data;
    },
    onSuccess: (data) => {
      const orderNumber = (data as any)?.order_number ?? 0;
      const items = cart.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, compare_price: i.compare_price ?? null, image_url: i.image_url ?? null }));
      const message = buildOrderMessage({
        customerName: name.trim(),
        customerMobile: mobile.trim(),
        items: items.map(({ image_url, compare_price, ...rest }) => rest),
        total: cart.total,
        orderNumber,
        status: "Pending",
      });

      // Save profile + history locally → auto-login next time
      profile.saveProfile({ name: name.trim(), mobile: mobile.trim(), address: address.trim() });
      profile.addOrder({
        id: (data as any)?.id,
        order_number: orderNumber,
        created_at: new Date().toISOString(),
        total: cart.total,
        status: "pending",
        items,
        notes: notes.trim() || undefined,
      });

      const itemIds = items.map((i) => i.id);
      const categoryIds = Array.from(new Set(
        items
          .map((i) => allProducts.find((p) => p.id === i.id)?.category_id)
          .filter((x): x is string => !!x)
      ));
      const savingSnap = checkoutSaving;
      const otherSnap = checkoutOtherTotal;
      const ourSnap = cart.total;
      setSuccess({ orderNumber, message, itemIds, categoryIds, saving: savingSnap, otherTotal: otherSnap, ourTotal: ourSnap });
      cart.clear();

      // Auto-open WhatsApp (popup may block; CTA button is also shown)
      try {
        const link = whatsappLink(contactWA, message);
        window.open(link, "_blank", "noopener,noreferrer");
      } catch {}
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not place order"),
  });

  const canSubmit = name.trim().length >= 2 && mobile.replace(/\D/g, "").length >= 6 && cart.items.length > 0;

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setSuccess(null); } }}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-3xl p-0">
        {!success ? (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>{t("store.confirmOrder")}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("store.yourName")} *</label>
                <Input className="mt-1 h-12 text-base" value={name} onChange={e => setName(e.target.value)} placeholder={t("store.namePlaceholder")} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("store.mobile")} *</label>
                <Input className="mt-1 h-12 text-base" inputMode="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder={t("store.mobilePlaceholder")} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("store.address")}</label>
                <Textarea className="mt-1" rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder={t("store.addressPlaceholder")} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("store.notes")}</label>
                <Textarea className="mt-1" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("store.notesPlaceholder")} />
              </div>

              {/* Visual order summary */}
              <div className="rounded-2xl border border-border bg-card p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("store.orderSummary")}</p>
                <div className="space-y-2">
                  {cart.items.map(i => {
                    const sv = calcSaving(i.price, i.compare_price);
                    return (
                    <div key={i.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {i.image_url ? <img src={i.image_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{i.name}</p>
                        {sv && (
                          <p className="text-[10px] text-muted-foreground line-through">SAR {sv.comparePrice.toFixed(2)}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">{t("store.qty")}: {i.qty} × SAR {i.price.toFixed(2)}</p>
                      </div>
                      <p className="flex-shrink-0 text-sm font-bold">SAR {(i.qty * i.price).toFixed(2)}</p>
                    </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold">{t("store.total")}</span>
                  <span className="text-lg font-bold">SAR {cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Live Profit Card — always Bangla, hides when profit ≤ 0 */}
              {checkoutSaving > 0 && (
                <div lang="bn" className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 p-5 text-center shadow-md shadow-emerald-500/10">
                  <p className="text-[13px] text-muted-foreground">অন্য কোম্পানি থেকে কিনলে</p>
                  <p className="text-[13px] text-muted-foreground">আপনার খরচ হতো</p>
                  <p className="mt-1 text-base font-semibold line-through text-muted-foreground">
                    SAR {checkoutOtherTotal.toFixed(2)}
                  </p>
                  <p className="mt-3 text-[13px] text-muted-foreground">আমাদের কাছে মাত্র</p>
                  <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    SAR {cart.total.toFixed(2)}
                  </p>
                  <div className="mt-4 border-t border-emerald-500/20 pt-3">
                    <p className="text-2xl">🎁 অভিনন্দন!</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">আমাদের থেকে কিনে</p>
                    <p className="text-[13px] text-muted-foreground">আপনার লাভ হয়েছে</p>
                    <p className="mt-1 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      SAR {checkoutSaving.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">ধন্যবাদ আমাদের উপর ভরসা রাখার জন্য।</p>
                </div>
              )}
            </div>
            <div className="border-t border-border px-5 py-4">
              <Button
                size="lg"
                className="h-12 w-full text-base"
                disabled={!canSubmit || submit.isPending}
                onClick={() => submit.mutate()}
              >
                {submit.isPending ? t("store.placing") : t("store.placeOrder")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-300">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">{t("store.orderPlaced")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("store.orderReceived", { n: success.orderNumber })}<br />
                  {t("store.contactSoon")}
                </p>
                <div className="mt-6 w-full max-w-xs space-y-2">
                  <a
                    href={whatsappLink(contactWA, success.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5" /> {t("store.sendWhatsApp")}
                  </a>
                </div>
              </div>

              {/* Big green savings celebration card */}
              {success.saving > 0 && (
                <div className="mt-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 p-5 text-center shadow-md shadow-emerald-500/10 animate-in zoom-in duration-500">
                  <p className="text-2xl">🎉 {t("store.orderPlaced")}</p>
                  <p className="mt-2 text-[13px] text-muted-foreground">{t("store.successSaving")}</p>
                  <p className="mt-1 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    SAR {success.saving.toFixed(2)}
                  </p>
                  <p className="mt-3 text-[12px] text-muted-foreground">{t("store.successSavingTail")}</p>
                </div>
              )}

              {/* Smart recommendations */}
              <div className="mt-8">
                <StoreRecommendations
                  excludeIds={success.itemIds}
                  preferCategoryIds={success.categoryIds}
                  onAdd={(p) => {
                    cart.add({ id: p.id, name: p.name, price: p.price, compare_price: (p as any).compare_price ?? null, image_url: p.image_url }, 1);
                    toast.success(`${p.name} ${t("store.cart")}`);
                  }}
                />
              </div>

              {/* Success-page promotional ads */}
              {successAds.length > 0 && (
                <div className="mt-6">
                  <StoreAdStack ads={successAds} onAction={onAdAction} />
                </div>
              )}

              {/* WhatsApp support banner */}
              <a
                href={whatsappLink(contactWA, "Hi, I need help with my order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-colors hover:bg-emerald-500/10"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <p className="text-sm font-semibold">Need help?</p>
                  <p className="text-[11px] text-muted-foreground">Chat with us on WhatsApp anytime.</p>
                </div>
              </a>
            </div>
            <div className="border-t border-border px-5 py-3">
              <Button variant="outline" size="lg" className="h-12 w-full" onClick={() => onOpenChange(false)}>
                {t("store.continueShopping")}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
