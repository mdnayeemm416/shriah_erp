import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type StoreLang = "en" | "bn" | "ar";

const KEY = "store-lang-v1";

export const STORE_LANGS: { code: StoreLang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", native: "English", dir: "ltr" },
  { code: "bn", label: "BN", native: "বাংলা", dir: "ltr" },
  { code: "ar", label: "AR", native: "العربية", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
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
  "store.totalSavingsAll": "Total savings",
};

const bn: Dict = {
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
  "store.totalSavingsAll": "💰 মোট সাশ্রয়",
};

const ar: Dict = {
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
  "store.language": "اللغة",
};

const dicts: Record<StoreLang, Dict> = { en, bn, ar };

type Ctx = {
  lang: StoreLang;
  dir: "ltr" | "rtl";
  setLang: (l: StoreLang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const StoreI18nCtx = createContext<Ctx>({
  lang: "en",
  dir: "ltr",
  setLang: () => {},
  t: (k) => k,
});

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, n) => (vars[n] != null ? String(vars[n]) : `{${n}}`));
}

export function StoreI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<StoreLang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY) as StoreLang | null;
      if (s === "en" || s === "bn" || s === "ar") setLangState(s);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = STORE_LANGS.find((l) => l.code === lang)!;
    // Scope dir change to <html> while user is on the store page.
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    if (hydrated) {
      try { localStorage.setItem(KEY, lang); } catch {}
    }
  }, [lang, hydrated]);

  const value = useMemo<Ctx>(() => {
    const meta = STORE_LANGS.find((l) => l.code === lang)!;
    return {
      lang,
      dir: meta.dir,
      setLang: setLangState,
      t: (key, vars) => {
        const s = dicts[lang]?.[key] ?? dicts.en[key] ?? key;
        return interpolate(s, vars);
      },
    };
  }, [lang]);

  return <StoreI18nCtx.Provider value={value}>{children}</StoreI18nCtx.Provider>;
}

export const useStoreI18n = () => useContext(StoreI18nCtx);
export const useStoreT = () => useContext(StoreI18nCtx).t;

// Helper to pick a localized name from product/category records that may have name_bn etc.
export function pickName(
  lang: StoreLang,
  record: { name: string; name_bn?: string | null; name_ar?: string | null }
): string {
  if (lang === "bn" && record.name_bn) return record.name_bn;
  if (lang === "ar" && (record as any).name_ar) return (record as any).name_ar;
  return record.name;
}
