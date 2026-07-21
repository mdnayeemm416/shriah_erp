import { p as performance } from "../_libs/unenv.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { I as Input, B as Button, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as cn, S as Sheet, e as SheetContent, f as SheetHeader, g as SheetTitle, h as Badge, T as Textarea, i as buildOrderMessage, w as whatsappLink, u as useConfirm } from "./router-KeVl8_Ln.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useStoreProfile } from "./use-store-profile-Dvp1Y3Ou.mjs";
import { S as Skeleton } from "./skeleton-BjboBqhG.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { o as User, F as ShoppingCart, y as Search, a1 as Star, a2 as Languages, a3 as Bell, T as Trash2, a4 as History, n as Check, I as MessageCircle, P as Plus, Q as Minus, X, a5 as Pencil } from "../_libs/lucide-react.mjs";





import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/tslib.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
const KEY$1 = "store_cart_v1";
function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY$1);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function write(items) {
  try {
    localStorage.setItem(KEY$1, JSON.stringify(items));
  } catch {
  }
  window.dispatchEvent(new CustomEvent("store-cart-changed"));
}
function useStoreCart() {
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("store-cart-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("store-cart-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const setQty = reactExports.useCallback((p, qty) => {
    const cur = read();
    const idx = cur.findIndex((i) => i.id === p.id);
    let next = cur;
    if (qty <= 0) {
      next = cur.filter((i) => i.id !== p.id);
    } else if (idx >= 0) {
      next = cur.map((i) => i.id === p.id ? { ...i, qty } : i);
    } else {
      next = [...cur, { ...p, qty }];
    }
    write(next);
  }, []);
  const add = reactExports.useCallback((p, delta = 1) => {
    const cur = read();
    const existing = cur.find((i) => i.id === p.id);
    setQty(p, Math.max(0, (existing?.qty ?? 0) + delta));
  }, [setQty]);
  const remove = reactExports.useCallback((id) => {
    write(read().filter((i) => i.id !== id));
  }, []);
  const clear = reactExports.useCallback(() => write([]), []);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  return { items, count, total, add, setQty, remove, clear };
}
const KEY = "store-lang-v1";
const STORE_LANGS = [
  { code: "en", label: "EN", native: "English", dir: "ltr" },
  { code: "bn", label: "BN", native: "বাংলা", dir: "ltr" },
  { code: "ar", label: "AR", native: "العربية", dir: "rtl" }
];
const en = {
  "store.title": "ShRiAh Store",
  "store.tagline": "Order online",
  "store.searchPlaceholder": "Search products…",
  "store.all": "All",
  "store.featured": "Featured",
  "store.products": "Products",
  "store.noProducts": "No products found.",
  "store.helpFooter": "Prices in SAR. Need help? Contact us on WhatsApp.",
  "store.outOfStock": "Out of stock",
  "store.stockLabel": "Stock",
  "store.vatIncl": "VAT incl.",
  "store.add": "Add",
  "store.addToCart": "Add to cart",
  "store.cart": "Cart",
  "store.cartEmpty": "Your cart is empty.",
  "store.cartItem": "item",
  "store.cartItems": "items",
  "store.total": "Total",
  "store.subtotal": "Subtotal",
  "store.checkout": "Checkout",
  "store.continueCheckout": "Continue to checkout",
  "store.continueShopping": "Continue shopping",
  "store.notifications": "Notifications",
  "store.noNotifications": "No notifications.",
  "store.pinned": "Pinned",
  "store.confirmOrder": "Confirm your order",
  "store.yourName": "Your name",
  "store.namePlaceholder": "Full name",
  "store.mobile": "Mobile number",
  "store.mobilePlaceholder": "05XXXXXXXX",
  "store.address": "Delivery address (optional)",
  "store.addressPlaceholder": "Address or location notes",
  "store.notes": "Notes (optional)",
  "store.notesPlaceholder": "Anything else?",
  "store.orderSummary": "Order summary",
  "store.placeOrder": "Place order",
  "store.placing": "Placing order…",
  "store.orderPlaced": "Order placed!",
  "store.orderReceived": "Your order #{n} has been received.",
  "store.contactSoon": "We will contact you soon to confirm.",
  "store.sendWhatsApp": "Send order on WhatsApp",
  "store.done": "Done",
  "store.required": "required",
  "store.account": "My account",
  "store.savedAs": "Saved as",
  "store.changeDetails": "Change details",
  "store.orderHistory": "Order history",
  "store.noOrders": "No previous orders yet.",
  "store.reorder": "Order again",
  "store.orderNo": "Order #",
  "store.qty": "Qty",
  "store.close": "Close",
  "store.featuredBanner": "Featured",
  "store.shopNow": "Shop now",
  "store.language": "Language",
  "store.onlyXAvailable": "Only {n} available",
  "store.orderDetails": "Order details",
  "store.status": "Status",
  "store.paymentStatus": "Payment",
  "store.deliveryAddress": "Delivery address",
  "store.customer": "Customer",
  "store.phone": "Phone",
  "store.items": "Items",
  "store.grandTotal": "Grand total",
  "store.discount": "Discount",
  "store.delivery": "Delivery",
  "store.support": "WhatsApp support",
  "store.otherPrice": "Other companies",
  "store.ourPrice": "Our price",
  "store.youSave": "You save SAR {n}",
  "store.youSavePct": "You save SAR {n} ({p}%)",
  "store.totalSaving": "Total saving",
  "store.congrats": "Congratulations!",
  "store.savingMsg": "Buying from us today you are saving",
  "store.savingMsg2": "From other companies it would cost you",
  "store.savingMsg3": "With us only",
  "store.savingThanks": "Thank you for trusting us.",
  "store.successSaving": "On this order you saved",
  "store.successSavingTail": "Compared to other companies, you came out ahead. Thank you. Please shop with us again.",
  "store.totalSavingsAll": "Total savings"
};
const bn = {
  "store.title": "শ্রীয়াহ স্টোর",
  "store.tagline": "অনলাইনে অর্ডার করুন",
  "store.searchPlaceholder": "পণ্য খুঁজুন…",
  "store.all": "সব",
  "store.featured": "ফিচার্ড",
  "store.products": "পণ্য",
  "store.noProducts": "কোনো পণ্য পাওয়া যায়নি।",
  "store.helpFooter": "মূল্য SAR এ। সাহায্য দরকার? হোয়াটসঅ্যাপে যোগাযোগ করুন।",
  "store.outOfStock": "স্টক শেষ",
  "store.stockLabel": "স্টক",
  "store.vatIncl": "ভ্যাট সহ",
  "store.add": "যোগ করুন",
  "store.addToCart": "কার্টে যোগ করুন",
  "store.cart": "কার্ট",
  "store.cartEmpty": "আপনার কার্ট খালি।",
  "store.cartItem": "পণ্য",
  "store.cartItems": "পণ্য",
  "store.total": "মোট",
  "store.subtotal": "সাবটোটাল",
  "store.checkout": "চেকআউট",
  "store.continueCheckout": "চেকআউটে যান",
  "store.continueShopping": "কেনাকাটা চালিয়ে যান",
  "store.notifications": "নোটিফিকেশন",
  "store.noNotifications": "কোনো নোটিফিকেশন নেই।",
  "store.pinned": "পিনড",
  "store.confirmOrder": "আপনার অর্ডার নিশ্চিত করুন",
  "store.yourName": "আপনার নাম",
  "store.namePlaceholder": "পুরো নাম",
  "store.mobile": "মোবাইল নম্বর",
  "store.mobilePlaceholder": "05XXXXXXXX",
  "store.address": "ডেলিভারি ঠিকানা (ঐচ্ছিক)",
  "store.addressPlaceholder": "ঠিকানা বা লোকেশন",
  "store.notes": "মন্তব্য (ঐচ্ছিক)",
  "store.notesPlaceholder": "আর কিছু?",
  "store.orderSummary": "অর্ডার সারাংশ",
  "store.placeOrder": "অর্ডার করুন",
  "store.placing": "অর্ডার করা হচ্ছে…",
  "store.orderPlaced": "অর্ডার সম্পন্ন!",
  "store.orderReceived": "আপনার অর্ডার #{n} গৃহীত হয়েছে।",
  "store.contactSoon": "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
  "store.sendWhatsApp": "হোয়াটসঅ্যাপে অর্ডার পাঠান",
  "store.done": "সম্পন্ন",
  "store.required": "আবশ্যক",
  "store.account": "আমার একাউন্ট",
  "store.savedAs": "সংরক্ষিত আছে",
  "store.changeDetails": "তথ্য পরিবর্তন",
  "store.orderHistory": "অর্ডার ইতিহাস",
  "store.noOrders": "এখনো কোনো অর্ডার নেই।",
  "store.reorder": "আবার অর্ডার",
  "store.orderNo": "অর্ডার #",
  "store.qty": "পরিমাণ",
  "store.close": "বন্ধ",
  "store.featuredBanner": "ফিচার্ড",
  "store.shopNow": "এখনই কিনুন",
  "store.language": "ভাষা",
  "store.otherPrice": "অন্যান্য প্রতিষ্ঠানে",
  "store.ourPrice": "আমাদের মূল্য",
  "store.youSave": "আপনি সাশ্রয় করছেন SAR {n}",
  "store.youSavePct": "আপনি সাশ্রয় করছেন SAR {n} ({p}%)",
  "store.totalSaving": "মোট সাশ্রয়",
  "store.congrats": "🎉 অভিনন্দন!",
  "store.savingMsg": "আজ আপনি আমাদের কাছ থেকে কিনে",
  "store.savingMsg2": "অন্য কোম্পানি থেকে কিনলে আপনাকে দিতে হতো",
  "store.savingMsg3": "আমাদের কাছে মাত্র",
  "store.savingThanks": "ধন্যবাদ আমাদের উপর ভরসা রাখার জন্য।",
  "store.successSaving": "আপনি এই অর্ডারে সাশ্রয় করেছেন",
  "store.successSavingTail": "অন্য কোম্পানির তুলনায় আপনার লাভ হয়েছে। ধন্যবাদ। আবারও কেনাকাটা করুন।",
  "store.totalSavingsAll": "💰 মোট সাশ্রয়"
};
const ar = {
  "store.title": "متجر شريعة",
  "store.tagline": "اطلب عبر الإنترنت",
  "store.searchPlaceholder": "ابحث عن المنتجات…",
  "store.all": "الكل",
  "store.featured": "المميزة",
  "store.products": "المنتجات",
  "store.noProducts": "لا توجد منتجات.",
  "store.helpFooter": "الأسعار بالريال السعودي. تحتاج مساعدة؟ تواصل معنا عبر واتساب.",
  "store.outOfStock": "غير متوفر",
  "store.stockLabel": "المخزون",
  "store.vatIncl": "شامل الضريبة",
  "store.add": "أضف",
  "store.addToCart": "أضف إلى السلة",
  "store.cart": "السلة",
  "store.cartEmpty": "سلتك فارغة.",
  "store.cartItem": "منتج",
  "store.cartItems": "منتجات",
  "store.total": "الإجمالي",
  "store.subtotal": "المجموع الفرعي",
  "store.checkout": "إتمام الطلب",
  "store.continueCheckout": "متابعة الدفع",
  "store.continueShopping": "متابعة التسوق",
  "store.notifications": "الإشعارات",
  "store.noNotifications": "لا توجد إشعارات.",
  "store.pinned": "مثبت",
  "store.confirmOrder": "أكد طلبك",
  "store.yourName": "اسمك",
  "store.namePlaceholder": "الاسم الكامل",
  "store.mobile": "رقم الجوال",
  "store.mobilePlaceholder": "05XXXXXXXX",
  "store.address": "عنوان التوصيل (اختياري)",
  "store.addressPlaceholder": "العنوان أو ملاحظات الموقع",
  "store.notes": "ملاحظات (اختياري)",
  "store.notesPlaceholder": "أي شيء آخر؟",
  "store.orderSummary": "ملخص الطلب",
  "store.placeOrder": "إرسال الطلب",
  "store.placing": "جارٍ إرسال الطلب…",
  "store.orderPlaced": "تم الطلب!",
  "store.orderReceived": "تم استلام طلبك رقم #{n}.",
  "store.contactSoon": "سنتواصل معك قريباً للتأكيد.",
  "store.sendWhatsApp": "أرسل الطلب عبر واتساب",
  "store.done": "تم",
  "store.required": "مطلوب",
  "store.account": "حسابي",
  "store.savedAs": "محفوظ باسم",
  "store.changeDetails": "تغيير المعلومات",
  "store.orderHistory": "سجل الطلبات",
  "store.noOrders": "لا توجد طلبات سابقة.",
  "store.reorder": "اطلب مرة أخرى",
  "store.orderNo": "طلب #",
  "store.qty": "الكمية",
  "store.close": "إغلاق",
  "store.featuredBanner": "مميز",
  "store.shopNow": "تسوق الآن",
  "store.language": "اللغة"
};
const dicts = { en, bn, ar };
const StoreI18nCtx = reactExports.createContext({
  lang: "en",
  dir: "ltr",
  setLang: () => {
  },
  t: (k) => k
});
function interpolate(s, vars) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, n) => vars[n] != null ? String(vars[n]) : `{${n}}`);
}
function StoreI18nProvider({ children }) {
  const [lang, setLangState] = reactExports.useState("en");
  const [hydrated, setHydrated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "en" || s === "bn" || s === "ar") setLangState(s);
    } catch {
    }
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = STORE_LANGS.find((l) => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    if (hydrated) {
      try {
        localStorage.setItem(KEY, lang);
      } catch {
      }
    }
  }, [lang, hydrated]);
  const value = reactExports.useMemo(() => {
    const meta = STORE_LANGS.find((l) => l.code === lang);
    return {
      lang,
      dir: meta.dir,
      setLang: setLangState,
      t: (key, vars) => {
        const s = dicts[lang]?.[key] ?? dicts.en[key] ?? key;
        return interpolate(s, vars);
      }
    };
  }, [lang]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StoreI18nCtx.Provider, { value, children });
}
const useStoreI18n = () => reactExports.useContext(StoreI18nCtx);
const useStoreT = () => reactExports.useContext(StoreI18nCtx).t;
function pickName(lang, record) {
  if (lang === "bn" && record.name_bn) return record.name_bn;
  if (lang === "ar" && record.name_ar) return record.name_ar;
  return record.name;
}
function useSwipe({
  onLeft,
  onRight,
  threshold = 70,
  maxOffAxis = 50
}) {
  const start = reactExports.useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    const s = start.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = Math.abs(t.clientY - s.y);
    start.current = null;
    if (dy > maxOffAxis) return;
    if (Date.now() - s.t > 700) return;
    if (dx >= threshold) onRight?.();
    else if (dx <= -threshold) onLeft?.();
  };
  return { onTouchStart, onTouchEnd };
}
function pick(lang, b, key) {
  if (lang === "bn") return b[`${key}_bn`] || b[key];
  if (lang === "ar") return b[`${key}_ar`] || b[key];
  return b[key];
}
function StoreBannerCarousel({
  banners,
  onAction
}) {
  const { lang, t } = useStoreI18n();
  const [i, setI] = reactExports.useState(0);
  const pausedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setI((x) => (x + 1) % banners.length);
    }, 4500);
    return () => clearInterval(id);
  }, [banners.length]);
  const swipe = useSwipe({
    onLeft: () => setI((x) => (x + 1) % banners.length),
    onRight: () => setI((x) => (x - 1 + banners.length) % banners.length)
  });
  if (!banners.length) return null;
  const b = banners[i] ?? banners[0];
  const title = pick(lang, b, "title");
  const message = pick(lang, b, "message") || b.description || null;
  const handleClick = () => {
    const lt = b.link_type;
    if (lt === "product" || lt === "category") {
      onAction?.(b);
      return;
    }
    if (lt === "url" && b.link_value) {
      window.open(b.link_value, "_blank", "noopener,noreferrer");
      return;
    }
    if (b.link_url) {
      window.open(b.link_url, "_blank", "noopener,noreferrer");
    }
  };
  const clickable = !!(b.link_url || b.link_type && b.link_type !== "none" && b.link_value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mb-5",
      onTouchStart: (e) => {
        pausedRef.current = true;
        swipe.onTouchStart(e);
      },
      onTouchEnd: (e) => {
        swipe.onTouchEnd(e);
        setTimeout(() => {
          pausedRef.current = false;
        }, 600);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            disabled: !clickable,
            onClick: handleClick,
            className: "block w-full text-start disabled:cursor-default",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: b.image_url,
                  alt: title ?? "",
                  loading: "lazy",
                  className: "h-full w-full object-cover"
                }
              ),
              (title || message) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 text-white", children: [
                title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-tight", children: title }),
                message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 line-clamp-2 text-[11px] opacity-90", children: message }),
                clickable && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur", children: [
                  t("store.shopNow"),
                  " →"
                ] })
              ] })
            ] })
          }
        ),
        banners.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-center gap-1.5", children: banners.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setI(idx),
            "aria-label": `Banner ${idx + 1}`,
            className: `h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`
          },
          idx
        )) })
      ]
    }
  );
}
function handleBannerClick(ad, onAction) {
  if (ad.link_type === "url" && ad.link_value) {
    window.open(ad.link_value, "_blank", "noopener,noreferrer");
    return;
  }
  if ((ad.link_type === "product" || ad.link_type === "category") && ad.link_value) {
    onAction?.(ad);
  }
}
function StoreAdBanner({
  ad,
  onAction,
  className
}) {
  const clickable = ad.link_type !== "none" && !!ad.link_value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      disabled: !clickable,
      onClick: () => handleBannerClick(ad, onAction),
      className: "group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all active:scale-[0.99] disabled:cursor-default " + (className ?? ""),
      children: [
        ad.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/8] w-full overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: ad.image_url,
            alt: ad.title ?? "",
            loading: "lazy",
            className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex aspect-[16/8] items-center justify-center bg-muted text-xs text-muted-foreground", children: "No image" }),
        ad.title && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: ad.title }) })
      ]
    }
  );
}
function StoreAdCarousel({
  ads,
  onAction,
  className
}) {
  const [i, setI] = reactExports.useState(0);
  const trackRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(() => setI((x) => (x + 1) % ads.length), 5e3);
    return () => clearInterval(id);
  }, [ads.length]);
  reactExports.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i];
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [i]);
  if (!ads.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: trackRef,
        className: "-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1",
        style: { scrollbarWidth: "none" },
        onScroll: (e) => {
          const el = e.currentTarget;
          const w = el.clientWidth;
          const idx = Math.round(el.scrollLeft / Math.max(1, w));
          if (idx !== i) setI(idx);
        },
        children: ads.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex-shrink-0 snap-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreAdBanner, { ad: a, onAction }) }, a.id))
      }
    ),
    ads.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-center gap-1.5", children: ads.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        "aria-label": `Banner ${idx + 1}`,
        onClick: () => setI(idx),
        className: "h-1.5 rounded-full transition-all " + (idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")
      },
      idx
    )) })
  ] });
}
function StoreAdStack({
  ads,
  onAction,
  className
}) {
  if (!ads.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 " + (className ?? ""), children: ads.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(StoreAdBanner, { ad: a, onAction }, a.id)) });
}
function StoreRecommendations({
  excludeIds,
  preferCategoryIds,
  onAdd
}) {
  const { lang } = useStoreI18n();
  const q = useQuery({
    queryKey: ["store-recommendations"],
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_products").select("id,name,name_bn,name_ar,image_url,price,stock,category_id,is_featured,min_stock").eq("is_visible", true).eq("is_deleted", false).gt("stock", 0).order("is_featured", { ascending: false }).order("sort_order", { ascending: true }).limit(40);
      if (error) throw error;
      return data ?? [];
    }
  });
  const exclude = new Set(excludeIds);
  const list = (q.data ?? []).filter((p) => !exclude.has(p.id));
  const ranked = [...list].sort((a, b) => {
    const score = (p) => {
      let s = 0;
      if (preferCategoryIds.length && p.category_id && preferCategoryIds.includes(p.category_id)) s += 100;
      if (p.is_featured) s += 50;
      if (p.min_stock > 0 && p.stock <= p.min_stock) s += 20;
      return s;
    };
    return score(b) - score(a);
  });
  const top = ranked.slice(0, 6);
  if (q.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "You may also like" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-36 flex-shrink-0 rounded-2xl" }, i)) })
    ] });
  }
  if (!top.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold", children: "You may also like" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Recommended" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2",
        style: { scrollbarWidth: "none" },
        children: top.map((p) => {
          const name = pickName(lang, p);
          const isClearance = p.min_stock > 0 && p.stock <= p.min_stock;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "group relative flex w-36 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square w-full overflow-hidden bg-muted", children: [
                  p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: p.image_url,
                      alt: name,
                      loading: "lazy",
                      className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-[10px] text-muted-foreground", children: "No image" }),
                  isClearance && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow", children: "Clearance" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-1 p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-[12px] font-medium leading-snug", children: name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] font-bold text-primary", children: [
                    "SAR ",
                    Number(p.price).toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "mt-1 h-8 w-full text-[11px]",
                      onClick: () => onAdd({ id: p.id, name, price: Number(p.price), image_url: p.image_url }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-3 w-3" }),
                        " Add"
                      ]
                    }
                  )
                ] })
              ]
            },
            p.id
          );
        })
      }
    )
  ] });
}
const FALLBACK_WA = "0553687388";
function StoreRoot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StoreI18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StorePage, {}) });
}
function StorePage() {
  const {
    dir
  } = useStoreI18n();
  const t = useStoreT();
  const cart = useStoreCart();
  const profile = useStoreProfile();
  const [search, setSearch] = reactExports.useState("");
  const [catFilter, setCatFilter] = reactExports.useState(null);
  const [cartOpen, setCartOpen] = reactExports.useState(false);
  const [checkoutOpen, setCheckoutOpen] = reactExports.useState(false);
  const [accountOpen, setAccountOpen] = reactExports.useState(false);
  const [adShown, setAdShown] = reactExports.useState(false);
  const [adDismissed, setAdDismissed] = reactExports.useState(false);
  const products = useQuery({
    queryKey: ["store-products"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_products_public").select("id,name,name_bn,name_ar,description,image_url,price,compare_price,stock,category_id,category_ids,barcode,is_featured,show_stock").order("is_featured", {
        ascending: false
      }).order("sort_order", {
        ascending: true
      }).order("name", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
  const categories = useQuery({
    queryKey: ["store-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_categories").select("id,name,name_bn,name_ar,slug").eq("is_active", true).order("sort_order", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 6e4
  });
  const notifications = useQuery({
    queryKey: ["store-notifications"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_notifications").select("id,title,message,type,is_pinned").order("is_pinned", {
        ascending: false
      }).order("created_at", {
        ascending: false
      }).limit(10);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 6e4
  });
  const adPopup = useQuery({
    queryKey: ["store-ad"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_ad_popup").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 6e4
  });
  const banners = useQuery({
    queryKey: ["store-banners"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_banners").select("id,image_url,link_url,title,title_bn,title_ar,message,message_bn,message_ar,description,link_type,link_value,start_date,end_date").eq("is_active", true).order("sort_order", {
        ascending: true
      }).limit(20);
      if (error) return [];
      const now = Date.now();
      return (data ?? []).filter((b) => {
        if (b.start_date && new Date(b.start_date).getTime() > now) return false;
        if (b.end_date && new Date(b.end_date).getTime() < now) return false;
        return true;
      }).slice(0, 10);
    },
    staleTime: 5 * 6e4
  });
  const settings = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("app_settings").select("store_whatsapp,currency").eq("id", 1).maybeSingle();
      if (error) return null;
      return data;
    },
    staleTime: 10 * 6e4
  });
  const ads = useQuery({
    queryKey: ["store-ads"],
    staleTime: 5 * 6e4,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_ads").select("id,title,image_url,placement,link_type,link_value,sort_order").eq("is_active", true).order("sort_order", {
        ascending: true
      }).order("created_at", {
        ascending: false
      });
      if (error) return [];
      return data ?? [];
    }
  });
  const homeAds = (ads.data ?? []).filter((a) => a.placement === "home" || a.placement === "both");
  const successAds = (ads.data ?? []).filter((a) => a.placement === "success" || a.placement === "both").slice(0, 2);
  const handleAdAction = (a) => {
    if (a.link_type === "category" && a.link_value) {
      setCatFilter(a.link_value);
      setSearch("");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else if (a.link_type === "product" && a.link_value) {
      const p = (products.data ?? []).find((x) => x.id === a.link_value);
      if (p) {
        setSearch(p.name);
        setCatFilter(null);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    }
  };
  const contactWA = settings.data?.store_whatsapp || FALLBACK_WA;
  reactExports.useEffect(() => {
    if (adShown) return;
    if (!adPopup.data?.is_active) return;
    const t2 = setTimeout(() => setAdShown(true), 800);
    return () => clearTimeout(t2);
  }, [adPopup.data, adShown]);
  const {
    lang
  } = useStoreI18n();
  const catById = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    (categories.data ?? []).forEach((c) => m.set(c.id, c));
    return m;
  }, [categories.data]);
  const productCatIds = (p) => {
    const ids = /* @__PURE__ */ new Set();
    if (p.category_id) ids.add(p.category_id);
    (p.category_ids ?? []).forEach((id) => id && ids.add(id));
    return Array.from(ids);
  };
  const filtered = reactExports.useMemo(() => {
    const list = products.data ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((p) => {
      if (catFilter) {
        const ids = productCatIds(p);
        if (!ids.includes(catFilter)) return false;
      }
      if (!q) return true;
      const catNames = productCatIds(p).map((id) => catById.get(id)).filter(Boolean).flatMap((c) => [c.name, c.name_bn, c.name_ar, c.slug]).filter(Boolean).join(" ").toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.name_bn ?? "").toLowerCase().includes(q) || (p.name_ar ?? "").toLowerCase().includes(q) || (p.barcode ?? "").toLowerCase().includes(q) || catNames.includes(q);
    });
  }, [products.data, search, catFilter, catById]);
  const featured = reactExports.useMemo(() => (products.data ?? []).filter((p) => p.is_featured).slice(0, 8), [products.data]);
  const smartCats = reactExports.useMemo(() => {
    const wanted = ["recommended", "best-seller", "new-arrival", "offer"];
    const map = /* @__PURE__ */ new Map();
    (categories.data ?? []).forEach((c) => {
      const s = (c.slug ?? "").toLowerCase();
      if (s && wanted.includes(s)) map.set(s, c);
    });
    return wanted.map((slug) => map.get(slug)).filter(Boolean);
  }, [categories.data]);
  const smartSections = reactExports.useMemo(() => {
    return smartCats.map((c) => ({
      cat: c,
      products: (products.data ?? []).filter((p) => productCatIds(p).includes(c.id)).slice(0, 12)
    })).filter((s) => s.products.length > 0);
  }, [smartCats, products.data]);
  const recommendedCatId = smartCats.find((c) => (c.slug ?? "").toLowerCase() === "recommended")?.id;
  const sortedFiltered = reactExports.useMemo(() => {
    if (!recommendedCatId) return filtered;
    const rec = [], rest = [];
    for (const p of filtered) {
      (productCatIds(p).includes(recommendedCatId) ? rec : rest).push(p);
    }
    return [...rec, ...rest];
  }, [filtered, recommendedCatId]);
  const pinnedBanner = notifications.data?.find((n) => n.is_pinned);
  const reorder = (items) => {
    items.forEach((it) => {
      const product = products.data?.find((p) => p.id === it.id);
      const stock = product?.stock ?? Infinity;
      const qty = Math.min(it.qty, stock);
      if (qty > 0) {
        const cp = product?.compare_price ?? it.compare_price ?? null;
        cart.setQty({
          id: it.id,
          name: it.name,
          price: Number(it.price),
          compare_price: cp != null ? Number(cp) : null,
          image_url: it.image_url ?? null
        }, qty);
      }
    });
    setAccountOpen(false);
    setCartOpen(true);
    toast.success(t("store.cart"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-28", dir, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-2 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-base font-bold leading-tight", children: t("store.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: t("store.tagline") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LangSwitcher, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAccountOpen(true), className: "relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground", "aria-label": t("store.account"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, { items: notifications.data ?? [] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCartOpen(true), className: "relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground", "aria-label": t("store.cart"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5" }),
            cart.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground", children: cart.count })
          ] })
        ] })
      ] }),
      pinnedBanner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 px-4 py-2 text-center text-xs font-medium text-primary", children: [
        "📣 ",
        pinnedBanner.title,
        pinnedBanner.message ? ` — ${pinnedBanner.message}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: t("store.searchPlaceholder"), className: "h-11 ps-9 rounded-full" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl overflow-x-auto px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryChip, { active: !catFilter, onClick: () => setCatFilter(null), children: t("store.all") }),
        (categories.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryChip, { active: catFilter === c.id, onClick: () => setCatFilter(c.id), children: pickName(useStoreI18nLang(), c) }, c.id))
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 pt-4", children: [
      !search && !catFilter && (banners.data?.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StoreBannerCarousel, { banners: banners.data ?? [], onAction: (b) => {
        if (b.link_type === "category" && b.link_value) {
          setCatFilter(b.link_value);
          setSearch("");
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        } else if (b.link_type === "product" && b.link_value) {
          const p = (products.data ?? []).find((x) => x.id === b.link_value);
          if (p) {
            setSearch(p.name);
            setCatFilter(null);
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
        }
      } }),
      !search && !catFilter && homeAds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreAdCarousel, { ads: homeAds, onAction: handleAdAction }) }),
      !search && !catFilter && featured.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 flex items-center gap-1.5 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-amber-500" }),
          " ",
          t("store.featured")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1", children: featured.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedCard, { product: p, qty: cart.items.find((i) => i.id === p.id)?.qty ?? 0, onInc: () => cart.add(productToCart(p, lang), 1), onDec: () => cart.add(productToCart(p, lang), -1), onSet: (n) => cart.setQty(productToCart(p, lang), n) }, p.id)) })
      ] }),
      !search && !catFilter && smartSections.map(({
        cat,
        products: items
      }) => {
        const slug = (cat.slug ?? "").toLowerCase();
        const icon = slug === "best-seller" ? "🔥" : slug === "new-arrival" ? "🆕" : slug === "offer" ? "🏷" : "⭐";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: icon }),
              " ",
              pickName(lang, cat)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setCatFilter(cat.id);
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }, className: "text-[11px] font-medium text-primary", children: [
              t("store.all"),
              " →"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedCard, { product: p, qty: cart.items.find((i) => i.id === p.id)?.qty ?? 0, onInc: () => cart.add(productToCart(p, lang), 1), onDec: () => cart.add(productToCart(p, lang), -1), onSet: (n) => cart.setQty(productToCart(p, lang), n) }, p.id)) })
        ] }, cat.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold", children: t("store.products") }),
        products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56 animate-pulse rounded-2xl bg-muted/50" }, i)) }) : sortedFiltered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: t("store.noProducts") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: sortedFiltered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, qty: cart.items.find((i) => i.id === p.id)?.qty ?? 0, onInc: () => cart.add(productToCart(p, lang), 1), onDec: () => cart.add(productToCart(p, lang), -1), onSet: (n) => cart.setQty(productToCart(p, lang), n) }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 mb-4 text-center text-[11px] text-muted-foreground", children: t("store.helpFooter") })
    ] }),
    cart.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          cart.count,
          " ",
          cart.count > 1 ? t("store.cartItems") : t("store.cartItem")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold", children: [
          "SAR ",
          cart.total.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 px-6 text-base", onClick: () => {
        setCartOpen(false);
        setCheckoutOpen(true);
      }, children: t("store.checkout") })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartSheet, { open: cartOpen, onOpenChange: setCartOpen, cart, onCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccountSheet, { open: accountOpen, onOpenChange: setAccountOpen, profile, onReorder: reorder, contactWA }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutSheet, { open: checkoutOpen, onOpenChange: setCheckoutOpen, cart, profile, contactWA, successAds, allProducts: products.data ?? [], onAdAction: (a) => {
      setCheckoutOpen(false);
      handleAdAction(a);
    } }),
    adShown && !adDismissed && adPopup.data?.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && setAdDismissed(true), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm p-0 overflow-hidden", children: [
      adPopup.data.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: adPopup.data.image_url, alt: "", className: "aspect-video w-full object-cover", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl", children: adPopup.data.title ?? "Special Offer" }) }),
        adPopup.data.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground whitespace-pre-wrap", children: adPopup.data.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setAdDismissed(true), children: t("store.close") }),
          adPopup.data.button_text && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: () => {
            setAdDismissed(true);
            if (adPopup.data?.button_link) window.location.href = adPopup.data.button_link;
          }, children: adPopup.data.button_text })
        ] })
      ] })
    ] }) })
  ] });
}
function useStoreI18nLang() {
  return useStoreI18n().lang;
}
function productToCart(p, lang = "en") {
  return {
    id: p.id,
    name: pickName(lang, p),
    price: Number(p.price),
    compare_price: p.compare_price != null ? Number(p.compare_price) : null,
    image_url: p.image_url
  };
}
function calcSaving(price, comparePrice) {
  const cp = Number(comparePrice ?? 0);
  const p = Number(price ?? 0);
  if (!Number.isFinite(cp) || cp <= p) return null;
  const save = cp - p;
  const pct = Math.round(save / cp * 100);
  return {
    save,
    pct,
    comparePrice: cp
  };
}
function LangSwitcher() {
  const {
    lang,
    setLang
  } = useStoreI18n();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 rounded-full bg-muted p-0.5", role: "group", "aria-label": "Language", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "ms-1.5 h-3.5 w-3.5 text-muted-foreground" }),
    STORE_LANGS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLang(l.code), className: cn("rounded-full px-2 py-1 text-[10px] font-bold tracking-wider transition-colors", lang === l.code ? "bg-primary text-primary-foreground" : "text-muted-foreground"), "aria-pressed": lang === l.code, children: l.label }, l.code))
  ] });
}
function CategoryChip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: cn("flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"), children });
}
function QtyControl({
  qty,
  onInc,
  onDec,
  onSet,
  disabled,
  max
}) {
  const t = useStoreT();
  const [draft, setDraft] = reactExports.useState(String(qty));
  reactExports.useEffect(() => {
    setDraft(String(qty));
  }, [qty]);
  reactExports.useEffect(() => {
    if (!onSet) return;
    if (draft === "" || draft === String(qty)) return;
    const handle = setTimeout(() => {
      const parsed = parseInt(draft.replace(/[^\d]/g, ""), 10);
      if (!Number.isFinite(parsed) || parsed < 1) {
        setDraft(String(qty));
        return;
      }
      const capped = typeof max === "number" ? Math.min(parsed, Math.max(1, max)) : parsed;
      if (typeof max === "number" && parsed > max) {
        toast.warning(t("store.onlyXAvailable", {
          n: max
        }));
        setDraft(String(capped));
      }
      if (capped !== qty) onSet(capped);
    }, 150);
    return () => clearTimeout(handle);
  }, [draft, qty, max, onSet, t]);
  if (qty === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: onInc, disabled, className: "h-9 w-full rounded-full px-3 text-xs font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-4 w-4" }),
      " ",
      t("store.add")
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDec, className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-primary-foreground/15", "aria-label": "Decrease", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", inputMode: "numeric", pattern: "[0-9]*", value: draft, onChange: (e) => setDraft(e.target.value.replace(/[^\d]/g, "")), onBlur: () => {
      if (!draft) setDraft(String(qty));
    }, onFocus: (e) => e.currentTarget.select(), "aria-label": "Quantity", className: "min-w-0 flex-1 bg-transparent text-center text-sm font-semibold outline-none placeholder:text-primary-foreground/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onInc, disabled, className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-primary-foreground/15 disabled:opacity-50", "aria-label": "Increase", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }) })
  ] });
}
function ProfitBadge({
  perPiece,
  qty,
  size = "md"
}) {
  const effectiveQty = qty > 0 ? qty : 1;
  const target = perPiece * effectiveQty;
  const [display, setDisplay] = reactExports.useState(target);
  reactExports.useEffect(() => {
    let raf = 0;
    const start = display;
    const end = target;
    if (start === end) return;
    const dur = 450;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  if (perPiece <= 0) return null;
  const isSm = size === "sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { lang: "bn", className: cn("inline-flex items-center gap-1.5 rounded-full border border-emerald-400/70 bg-[#E8FFF2] dark:bg-emerald-950/40 dark:border-emerald-700", isSm ? "px-2 py-0.5" : "px-2.5 py-1", "shadow-sm transition-transform"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isSm ? "text-sm" : "text-base", children: "🎁" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-semibold text-emerald-800 dark:text-emerald-200", isSm ? "text-[9px]" : "text-[10px]"), children: qty > 0 ? "এখন পর্যন্ত আপনার লাভ" : "আপনার লাভ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums", isSm ? "text-sm" : "text-base"), children: [
        "SAR ",
        display.toFixed(2)
      ] })
    ] })
  ] });
}
function ProductCard({
  product,
  qty,
  onInc,
  onDec,
  onSet
}) {
  const t = useStoreT();
  const {
    lang
  } = useStoreI18n();
  const out = product.stock <= 0;
  const reachedMax = qty >= product.stock;
  const displayName = pickName(lang, product);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col overflow-hidden rounded-2xl border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square bg-muted", children: [
      product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: displayName, className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground text-xs", children: "—" }),
      product.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute start-2 top-2 bg-amber-500 text-white", children: "★" }),
      out && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70 text-xs font-bold uppercase tracking-wider", children: t("store.outOfStock") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 min-h-[2.4rem] text-[13px] font-medium leading-tight", children: displayName }),
      (() => {
        const s = calcSaving(product.price, product.compare_price);
        if (!s) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
              "SAR ",
              Number(product.price).toFixed(2),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-normal text-muted-foreground", children: t("store.vatIncl") })
            ] }),
            product.show_stock && !out && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              t("store.stockLabel"),
              ": ",
              product.stock
            ] })
          ] });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            t("store.otherPrice"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "line-through", children: [
              "SAR ",
              s.comparePrice.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-emerald-600 dark:text-emerald-400", children: [
            "SAR ",
            Number(product.price).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitBadge, { perPiece: s.save, qty, size: "md" }),
          product.show_stock && !out && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            t("store.stockLabel"),
            ": ",
            product.stock
          ] })
        ] });
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QtyControl, { qty, onInc, onDec, onSet, disabled: out || reachedMax, max: product.stock }) })
    ] })
  ] });
}
function FeaturedCard({
  product,
  qty,
  onInc,
  onDec,
  onSet
}) {
  const t = useStoreT();
  const {
    lang
  } = useStoreI18n();
  const out = product.stock <= 0;
  const reachedMax = qty >= product.stock;
  const displayName = pickName(lang, product);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-44 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-50/50 to-amber-100/20 dark:from-amber-950/20 dark:to-amber-900/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square w-full bg-muted", children: [
      product.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: displayName, className: "h-full w-full object-cover", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute start-2 top-2 bg-amber-500 text-white text-[10px]", children: [
        "★ ",
        t("store.featuredBanner")
      ] }),
      out && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70 text-[11px] font-bold uppercase", children: t("store.outOfStock") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-1 text-xs font-semibold", children: displayName }),
      (() => {
        const s = calcSaving(product.price, product.compare_price);
        if (!s) {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-sm font-bold text-primary", children: [
            "SAR ",
            Number(product.price).toFixed(2)
          ] });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground line-through leading-tight", children: [
            "SAR ",
            s.comparePrice.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-emerald-600 dark:text-emerald-400", children: [
            "SAR ",
            Number(product.price).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProfitBadge, { perPiece: s.save, qty, size: "sm" })
        ] });
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QtyControl, { qty, onInc, onDec, onSet, disabled: out || reachedMax, max: product.stock }) })
    ] })
  ] });
}
function NotificationBell({
  items
}) {
  const t = useStoreT();
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground", "aria-label": t("store.notifications"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
      items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground", children: items.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: t("store.notifications") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: t("store.noNotifications") }) : items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize", children: n.type.replace("_", " ") }),
          n.is_pinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px]", children: t("store.pinned") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm font-semibold", children: n.title }),
        n.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground whitespace-pre-wrap", children: n.message })
      ] }, n.id)) })
    ] }) })
  ] });
}
function CartSheet({
  open,
  onOpenChange,
  cart,
  onCheckout
}) {
  const t = useStoreT();
  const cartSaving = cart.items.reduce((s, i) => {
    const sv = calcSaving(i.price, i.compare_price);
    return s + (sv ? sv.save * i.qty : 0);
  }, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full max-w-md p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: t("store.cart") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-[calc(100vh-4rem)] flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4", children: cart.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: t("store.cartEmpty") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: cart.items.map((i) => {
        const sv = calcSaving(i.price, i.compare_price);
        const pass = {
          id: i.id,
          name: i.name,
          price: i.price,
          compare_price: i.compare_price ?? null,
          image_url: i.image_url
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted", children: i.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.image_url, alt: i.name, className: "h-full w-full object-cover", loading: "lazy" }) : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-sm font-semibold leading-tight", children: i.name }),
            sv && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px] text-muted-foreground line-through", children: [
              "SAR ",
              sv.comparePrice.toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("mt-0.5 text-xs text-muted-foreground", sv && ""), children: [
              "SAR ",
              i.price.toFixed(2),
              " × ",
              i.qty
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("mt-1 text-base font-bold", sv ? "text-emerald-600 dark:text-emerald-400" : "text-primary"), children: [
              "SAR ",
              (i.price * i.qty).toFixed(2)
            ] }),
            sv && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-1 inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300", children: [
              "🟢 ",
              t("store.youSave", {
                n: (sv.save * i.qty).toFixed(0)
              })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[120px] flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QtyControl, { qty: i.qty, onInc: () => cart.add(pass, 1), onDec: () => cart.add(pass, -1), onSet: (n) => cart.setQty(pass, n) }) })
        ] }, i.id);
      }) }) }),
      cart.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-card px-5 py-4", children: [
        cartSaving > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-center text-[13px] font-semibold text-emerald-700 dark:text-emerald-300", children: [
          "🟢 ",
          t("store.totalSaving"),
          ": SAR ",
          cartSaving.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t("store.total") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold", children: [
            "SAR ",
            cart.total.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 w-full text-base", onClick: onCheckout, children: t("store.continueCheckout") })
      ] })
    ] })
  ] }) });
}
function AccountSheet({
  open,
  onOpenChange,
  profile,
  onReorder,
  contactWA
}) {
  const t = useStoreT();
  const [editing, setEditing] = reactExports.useState(false);
  const [name, setName] = reactExports.useState(profile.profile.name);
  const [mobile, setMobile] = reactExports.useState(profile.profile.mobile);
  const [address, setAddress] = reactExports.useState(profile.profile.address);
  const [openOrderNum, setOpenOrderNum] = reactExports.useState(null);
  const openOrder = reactExports.useMemo(() => openOrderNum == null ? null : profile.history.find((o) => o.order_number === openOrderNum) ?? null, [openOrderNum, profile.history]);
  reactExports.useEffect(() => {
    if (open) {
      setName(profile.profile.name);
      setMobile(profile.profile.mobile);
      setAddress(profile.profile.address);
      setEditing(!profile.profile.name);
    }
  }, [open, profile.profile]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full max-w-md p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: t("store.account") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 overflow-y-auto px-5 py-4", style: {
        maxHeight: "calc(100vh - 4rem)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: t("store.yourName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1 h-11", value: name, onChange: (e) => setName(e.target.value), placeholder: t("store.namePlaceholder") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: t("store.mobile") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1 h-11", inputMode: "tel", value: mobile, onChange: (e) => setMobile(e.target.value), placeholder: t("store.mobilePlaceholder") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: t("store.address") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1", rows: 2, value: address, onChange: (e) => setAddress(e.target.value), placeholder: t("store.addressPlaceholder") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => {
            profile.saveProfile({
              name: name.trim(),
              mobile: mobile.trim(),
              address: address.trim()
            });
            setEditing(false);
          }, children: t("store.done") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: t("store.savedAs") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-base font-bold", children: profile.profile.name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: profile.profile.mobile || "—" }),
          profile.profile.address && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground whitespace-pre-wrap", children: profile.profile.address }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => setEditing(true), children: t("store.changeDetails") }),
            profile.profile.name && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
              profile.clearProfile();
              setEditing(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-2 flex items-center gap-1.5 text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
            " ",
            t("store.orderHistory")
          ] }),
          (() => {
            const totalSaving = profile.history.filter((o) => (o.status ?? "").toLowerCase() !== "cancelled").reduce((s, o) => s + o.items.reduce((ss, i) => {
              const sv = calcSaving(i.price, i.compare_price);
              return ss + (sv ? sv.save * i.qty : 0);
            }, 0), 0);
            return totalSaving > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300", children: t("store.totalSavingsAll") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400", children: [
                "SAR ",
                totalSaving.toFixed(2)
              ] })
            ] }) : null;
          })(),
          profile.history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-xs text-muted-foreground", children: t("store.noOrders") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: profile.history.map((o) => {
            const st = (o.status ?? "pending").toLowerCase();
            const tone = st === "cancelled" ? "bg-red-500/10 text-red-600 ring-red-500/20" : st === "delivered" || st === "converted" ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" : st === "pending" || st === "new" ? "bg-amber-500/10 text-amber-600 ring-amber-500/20" : "bg-primary/10 text-primary ring-primary/20";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setOpenOrderNum(o.order_number), className: "block w-full rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-muted/40 active:bg-muted", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold", children: [
                  t("store.orderNo"),
                  o.order_number
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(o.created_at).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground line-clamp-1", children: o.items.map((i) => `${i.name} ×${i.qty}`).join(" · ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold", children: [
                  "SAR ",
                  Number(o.total).toFixed(2)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-3 py-1 text-[11px] font-semibold capitalize ring-1", tone), children: st })
              ] })
            ] }, o.order_number);
          }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrderDetailsDialog, { order: openOrder, profile, contactWA, onOpenChange: (v) => !v && setOpenOrderNum(null), onReorder: (items) => {
      setOpenOrderNum(null);
      onReorder(items);
    } })
  ] });
}
function OrderDetailsDialog({
  order,
  profile,
  contactWA,
  onOpenChange,
  onReorder
}) {
  const t = useStoreT();
  const confirm = useConfirm();
  const open = !!order;
  const [editMode, setEditMode] = reactExports.useState(false);
  const [draftItems, setDraftItems] = reactExports.useState([]);
  const [draftNotes, setDraftNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!open) {
      setEditMode(false);
      return;
    }
    setDraftItems(order?.items ?? []);
    setDraftNotes(order?.notes ?? "");
  }, [open, order]);
  const subtotal = reactExports.useMemo(() => (order?.items ?? []).reduce((s, i) => s + i.qty * i.price, 0), [order]);
  const grand = Number(order?.total ?? subtotal);
  const diff = +(grand - subtotal).toFixed(2);
  const status = (order?.status ?? "Placed").toLowerCase();
  const editable = status === "pending" || status === "new";
  const draftTotal = reactExports.useMemo(() => draftItems.reduce((s, i) => s + i.qty * i.price, 0), [draftItems]);
  const cancelMut = useMutation({
    mutationFn: async () => {
      if (!order?.id) throw new Error("Missing order reference");
      const {
        error
      } = await supabase.rpc("cancel_public_shop_order", {
        _order_id: order.id,
        _customer_mobile: profile.profile.mobile
      });
      if (error) throw error;
    },
    onSuccess: () => {
      if (order) profile.updateOrder(order.order_number, {
        status: "cancelled"
      });
      toast.success(t("store.orderCancelled") || "Order cancelled");
    },
    onError: (e) => toast.error(e?.message ?? "Could not cancel order")
  });
  const updateMut = useMutation({
    mutationFn: async () => {
      if (!order?.id) throw new Error("Missing order reference");
      const items = draftItems.filter((i) => i.qty > 0).map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        image_url: i.image_url ?? null
      }));
      if (items.length === 0) throw new Error("Order must have at least one item");
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      const {
        error
      } = await supabase.rpc("update_public_shop_order", {
        _order_id: order.id,
        _customer_mobile: profile.profile.mobile,
        _items: items,
        _total: total,
        _notes: draftNotes.trim() || null
      });
      if (error) throw error;
      return {
        items,
        total
      };
    },
    onSuccess: ({
      items,
      total
    }) => {
      if (order) profile.updateOrder(order.order_number, {
        items,
        total,
        notes: draftNotes.trim() || void 0
      });
      setEditMode(false);
      toast.success(t("store.orderUpdated") || "Order updated successfully");
    },
    onError: (e) => toast.error(e?.message ?? "Could not update order")
  });
  const onCancelClick = async () => {
    const ok = await confirm({
      title: t("store.cancelOrderQ") || "Cancel this order?",
      description: t("store.cancelOrderDesc") || "This action will notify admin.",
      confirmText: t("store.cancelOrder") || "Cancel order",
      cancelText: t("store.keepOrder") || "Keep order",
      tone: "danger"
    });
    if (ok) cancelMut.mutate();
  };
  const setQty = (id, qty) => setDraftItems((prev) => prev.map((i) => i.id === id ? {
    ...i,
    qty: Math.max(0, qty)
  } : i));
  const removeItem = (id) => setDraftItems((prev) => prev.filter((i) => i.id !== id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md gap-0 overflow-hidden p-0", onOpenAutoFocus: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "border-b border-border px-5 py-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: editMode ? t("store.editOrder") || "Edit order" : t("store.orderDetails") }),
      order && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        t("store.orderNo"),
        order.order_number,
        " · ",
        new Date(order.created_at).toLocaleString()
      ] })
    ] }),
    order && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 px-5 py-3 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("store.status") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12px] font-semibold capitalize", children: status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("store.paymentStatus") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12px] font-semibold", children: "—" })
        ] })
      ] }),
      !editable && status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-5 mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11.5px] text-amber-700 dark:text-amber-300", children: t("store.notEditableMsg") || "This order can no longer be edited or cancelled." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("store.customer") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: profile.profile.name || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("store.phone") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tabular-nums", children: profile.profile.mobile || "—" })
        ] }),
        profile.profile.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: t("store.deliveryAddress") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 whitespace-pre-wrap", children: profile.profile.address })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
          t("store.items"),
          " · ",
          (editMode ? draftItems : order.items).length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60 rounded-xl border border-border bg-card", children: (editMode ? draftItems : order.items).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: i.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.image_url, alt: i.name, loading: "lazy", className: "h-full w-full object-cover" }) : null }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-[12.5px] font-medium leading-tight", children: i.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px] text-muted-foreground", children: editMode ? `SAR ${Number(i.price).toFixed(2)}` : `${t("store.qty")}: ${i.qty} × SAR ${Number(i.price).toFixed(2)}` })
          ] }),
          editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-7 w-7", onClick: () => setQty(i.id, i.qty - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-[12px] font-semibold tabular-nums", children: i.qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", className: "h-7 w-7", onClick: () => setQty(i.id, i.qty + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-7 w-7 text-red-600", onClick: () => removeItem(i.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-[13px] font-semibold tabular-nums", children: [
            "SAR ",
            (i.qty * i.price).toFixed(2)
          ] })
        ] }, i.id)) })
      ] }),
      editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium text-muted-foreground", children: t("store.notes") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1", rows: 2, value: draftNotes, onChange: (e) => setDraftNotes(e.target.value), placeholder: t("store.notesPlaceholder") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "rounded-xl border border-border bg-card px-3 py-2 text-[12px]", children: [
        !editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: t("store.subtotal") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "tabular-nums", children: [
              "SAR ",
              subtotal.toFixed(2)
            ] })
          ] }),
          diff < 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: t("store.discount") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "tabular-nums text-emerald-600 dark:text-emerald-400", children: [
              "− SAR ",
              Math.abs(diff).toFixed(2)
            ] })
          ] }),
          diff > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: t("store.delivery") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "tabular-nums", children: [
              "SAR ",
              diff.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline justify-between border-t border-border pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[12.5px] font-semibold", children: t("store.grandTotal") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "text-base font-bold tabular-nums text-primary", children: [
            "SAR ",
            (editMode ? draftTotal : grand).toFixed(2)
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 border-t border-border bg-muted/30 px-5 py-3", children: [
        editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setEditMode(false), disabled: updateMut.isPending, children: t("store.cancel") || "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: () => updateMut.mutate(), disabled: updateMut.isPending || draftItems.filter((i) => i.qty > 0).length === 0, children: updateMut.isPending ? "…" : t("store.saveChanges") || "Save changes" })
        ] }) : editable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1", onClick: () => setEditMode(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
              " ",
              t("store.editOrder") || "Edit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-600", onClick: onCancelClick, disabled: cancelMut.isPending, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
              " ",
              t("store.cancelOrder") || "Cancel"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full", onClick: () => onReorder(order.items), children: t("store.reorder") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", onClick: () => onReorder(order.items), children: t("store.reorder") }),
        contactWA && !editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappLink(contactWA, `Hi, I need help with order #${order.order_number}.`), target: "_blank", rel: "noreferrer", className: "inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-[12.5px] font-medium text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          " ",
          t("store.support")
        ] })
      ] })
    ] })
  ] }) });
}
function CheckoutSheet({
  open,
  onOpenChange,
  cart,
  profile,
  contactWA,
  successAds,
  allProducts,
  onAdAction
}) {
  const t = useStoreT();
  const {
    lang
  } = useStoreI18n();
  const [name, setName] = reactExports.useState("");
  const [mobile, setMobile] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(null);
  const checkoutSaving = cart.items.reduce((s, i) => {
    const sv = calcSaving(i.price, i.compare_price);
    return s + (sv ? sv.save * i.qty : 0);
  }, 0);
  const checkoutOtherTotal = cart.items.reduce((s, i) => {
    const cp = Number(i.compare_price ?? 0);
    return s + (cp > i.price ? cp : i.price) * i.qty;
  }, 0);
  reactExports.useEffect(() => {
    if (!open) return;
    setName(profile.profile.name);
    setMobile(profile.profile.mobile);
    setAddress(profile.profile.address);
    setNotes("");
  }, [open, profile.profile]);
  const submit = useMutation({
    mutationFn: async () => {
      const items = cart.items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        compare_price: i.compare_price ?? null,
        image_url: i.image_url
      }));
      const total = cart.total;
      if (items.length === 0 || total <= 0) throw new Error("Cart is empty");
      const {
        data,
        error
      } = await supabase.rpc("create_public_shop_order", {
        _customer_name: name.trim(),
        _customer_mobile: mobile.trim(),
        _customer_address: address.trim() || null,
        _notes: notes.trim() || null,
        _items: items,
        _total: total
      }).single();
      if (error) throw error;
      try {
        const orderId = data?.id;
        if (orderId) {
          fetch("/api/public/send-order-push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderId
            }),
            keepalive: true
          }).catch(() => {
          });
          fetch("/api/public/send-order-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              orderId
            }),
            keepalive: true
          }).catch(() => {
          });
        }
      } catch {
      }
      return data;
    },
    onSuccess: (data) => {
      const orderNumber = data?.order_number ?? 0;
      const items = cart.items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        compare_price: i.compare_price ?? null,
        image_url: i.image_url ?? null
      }));
      const message = buildOrderMessage({
        customerName: name.trim(),
        customerMobile: mobile.trim(),
        items: items.map(({
          image_url,
          compare_price,
          ...rest
        }) => rest),
        total: cart.total,
        orderNumber,
        status: "Pending"
      });
      profile.saveProfile({
        name: name.trim(),
        mobile: mobile.trim(),
        address: address.trim()
      });
      profile.addOrder({
        id: data?.id,
        order_number: orderNumber,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        total: cart.total,
        status: "pending",
        items,
        notes: notes.trim() || void 0
      });
      const itemIds = items.map((i) => i.id);
      const categoryIds = Array.from(new Set(items.map((i) => allProducts.find((p) => p.id === i.id)?.category_id).filter((x) => !!x)));
      const savingSnap = checkoutSaving;
      const otherSnap = checkoutOtherTotal;
      const ourSnap = cart.total;
      setSuccess({
        orderNumber,
        message,
        itemIds,
        categoryIds,
        saving: savingSnap,
        otherTotal: otherSnap,
        ourTotal: ourSnap
      });
      cart.clear();
      try {
        const link = whatsappLink(contactWA, message);
        window.open(link, "_blank", "noopener,noreferrer");
      } catch {
      }
    },
    onError: (e) => toast.error(e?.message ?? "Could not place order")
  });
  const canSubmit = name.trim().length >= 2 && mobile.replace(/\D/g, "").length >= 6 && cart.items.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => {
    onOpenChange(v);
    if (!v) {
      setSuccess(null);
    }
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "bottom", className: "h-[92vh] rounded-t-3xl p-0", children: !success ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: t("store.confirmOrder") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-muted-foreground", children: [
          t("store.yourName"),
          " *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1 h-12 text-base", value: name, onChange: (e) => setName(e.target.value), placeholder: t("store.namePlaceholder") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium text-muted-foreground", children: [
          t("store.mobile"),
          " *"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1 h-12 text-base", inputMode: "tel", value: mobile, onChange: (e) => setMobile(e.target.value), placeholder: t("store.mobilePlaceholder") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: t("store.address") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1", rows: 2, value: address, onChange: (e) => setAddress(e.target.value), placeholder: t("store.addressPlaceholder") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: t("store.notes") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: t("store.notesPlaceholder") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: t("store.orderSummary") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: cart.items.map((i) => {
          const sv = calcSaving(i.price, i.compare_price);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: i.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.image_url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) : null }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: i.name }),
              sv && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground line-through", children: [
                "SAR ",
                sv.comparePrice.toFixed(2)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                t("store.qty"),
                ": ",
                i.qty,
                " × SAR ",
                i.price.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex-shrink-0 text-sm font-bold", children: [
              "SAR ",
              (i.qty * i.price).toFixed(2)
            ] })
          ] }, i.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline justify-between border-t border-border pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: t("store.total") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold", children: [
            "SAR ",
            cart.total.toFixed(2)
          ] })
        ] })
      ] }),
      checkoutSaving > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { lang: "bn", className: "rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 p-5 text-center shadow-md shadow-emerald-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground", children: "অন্য কোম্পানি থেকে কিনলে" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground", children: "আপনার খরচ হতো" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-base font-semibold line-through text-muted-foreground", children: [
          "SAR ",
          checkoutOtherTotal.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[13px] text-muted-foreground", children: "আমাদের কাছে মাত্র" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300", children: [
          "SAR ",
          cart.total.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-emerald-500/20 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl", children: "🎁 অভিনন্দন!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] text-muted-foreground", children: "আমাদের থেকে কিনে" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground", children: "আপনার লাভ হয়েছে" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400", children: [
            "SAR ",
            checkoutSaving.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[11px] text-muted-foreground", children: "ধন্যবাদ আমাদের উপর ভরসা রাখার জন্য।" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "h-12 w-full text-base", disabled: !canSubmit || submit.isPending, onClick: () => submit.mutate(), children: submit.isPending ? t("store.placing") : t("store.placeOrder") }) })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-5 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 text-2xl font-bold", children: t("store.orderPlaced") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          t("store.orderReceived", {
            n: success.orderNumber
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          t("store.contactSoon")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 w-full max-w-xs space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappLink(contactWA, success.message), target: "_blank", rel: "noopener noreferrer", className: "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
          " ",
          t("store.sendWhatsApp")
        ] }) })
      ] }),
      success.saving > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 p-5 text-center shadow-md shadow-emerald-500/10 animate-in zoom-in duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl", children: [
          "🎉 ",
          t("store.orderPlaced")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] text-muted-foreground", children: t("store.successSaving") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400", children: [
          "SAR ",
          success.saving.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[12px] text-muted-foreground", children: t("store.successSavingTail") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreRecommendations, { excludeIds: success.itemIds, preferCategoryIds: success.categoryIds, onAdd: (p) => {
        cart.add({
          id: p.id,
          name: p.name,
          price: p.price,
          compare_price: p.compare_price ?? null,
          image_url: p.image_url
        }, 1);
        toast.success(`${p.name} ${t("store.cart")}`);
      } }) }),
      successAds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreAdStack, { ads: successAds, onAction: onAdAction }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappLink(contactWA, "Hi, I need help with my order."), target: "_blank", rel: "noopener noreferrer", className: "mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-colors hover:bg-emerald-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 text-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Need help?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Chat with us on WhatsApp anytime." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "lg", className: "h-12 w-full", onClick: () => onOpenChange(false), children: t("store.continueShopping") }) })
  ] }) }) });
}
export {
  StoreRoot as component
};
