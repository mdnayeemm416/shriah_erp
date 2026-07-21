import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "bn" | "ar";

const STORAGE_KEY = "app-lang-v1";

export const LANGUAGES: { code: Lang; native: string; english: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", native: "English",  english: "English", dir: "ltr" },
  { code: "bn", native: "বাংলা",    english: "Bangla",  dir: "ltr" },
  { code: "ar", native: "العربية",  english: "Arabic",  dir: "rtl" },
];

// ── Translation dictionaries ──────────────────────────────────────────────
// Strings without a key fall back to English, then to the key itself.
type Dict = Record<string, string>;

const en: Dict = {
  // App chrome
  "app.name": "ShRiAh",
  "app.tagline": "Group ERP",
  "app.signedInAs": "Signed in as",
  "app.menu": "Menu",
  "app.comingSoon": "Coming soon",
  "app.soon": "Soon",

  // Nav
  "nav.home": "Home",
  "nav.dashboard": "Dashboard",
  "nav.shop": "Shop",
  "nav.warehouse": "Warehouse",
  "nav.wholesale": "WholeSale",
  "nav.transactions": "Transactions",
  "nav.txns": "TRXNS",
  "nav.employees": "Employees",
  "nav.overview": "Overview",
  "nav.summary": "Summary",
  "nav.dailyClosing": "Daily Closing",
  "nav.dailySaleBuy": "Daily Sale & Buy",
  "app.exp": "Experiment",
  "nav.reports": "Reports",
  "nav.aiScan": "AI Scan",
  "nav.purchaseScan": "Smart Purchase Scan",
  "nav.companyAliases": "Company Aliases",
  "nav.help": "How To Use",
  "nav.settings": "Settings",
  "nav.profile": "Profile",
  "nav.backup": "Backup",
  "nav.about": "About",

  "nav.desc.employees": "Money given & received per employee",
  "nav.desc.dashboard": "Daily financial dashboard & insights",
  "nav.desc.overview": "Executive financial position overview",
  "nav.desc.summary": "Cash verification & business position",
  "nav.desc.dailyClosing": "End-of-day cash count & lock",
  "nav.desc.dailySaleBuy": "Night collection & next-day distribution",
  "nav.desc.reports": "Financial reports & exports",
  "nav.desc.aiScan": "Experimental OCR & document scan",
  "nav.desc.purchaseScan": "AI parses handwritten purchase sheets",
  "nav.desc.companyAliases": "Teach scanner brand-name mappings",
  "nav.desc.help": "Guide, formulas & calculation logic",
  "nav.desc.settings": "Workspace configuration",
  "nav.desc.profile": "Account & preferences",
  "nav.desc.backup": "Export & restore",
  "nav.desc.about": "Version & credits",

  // Common
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.close": "Close",
  "common.confirm": "Confirm",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.empty": "Nothing here yet.",
  "common.all": "All",
  "common.today": "Today",
  "common.yesterday": "Yesterday",
  "common.weekly": "Weekly",
  "common.monthly": "Monthly",
  "common.custom": "Custom",

  // Settings
  "settings.title": "Settings",
  "settings.subtitle": "Workspace configuration",
  "settings.search": "Search settings…",
  "settings.noMatch": "No settings match \"{query}\".",

  // Groups
  "settings.group.workspace": "Workspace",
  "settings.group.warehouse": "Warehouse",
  "settings.group.preferences": "Preferences",
  "settings.group.system": "System",
  "settings.group.account": "Account",
  "settings.group.advanced": "Advanced",
  "settings.group.help": "Help & info",

  // Items
  "settings.opening": "Opening Setup",
  "settings.opening.desc": "Balances before app start",
  "settings.shops": "Manage Shops",
  "settings.shops.desc": "Branches & opening cash",
  "settings.cashiers": "Manage Cashiers",
  "settings.cashiers.desc": "Staff per shop",
  "settings.parties": "Manage Parties",
  "settings.parties.desc": "Customers & suppliers",
  "settings.categories": "Categories",
  "settings.categories.desc": "Income & expense types",
  "settings.subcategories": "Sub-Categories",
  "settings.subcategories.desc": "Nested category details",

  "settings.appearance": "Appearance & Themes",
  "settings.appearance.desc": "Theme, mode, accent, density & motion",
  "settings.language": "Language",
  "settings.language.desc": "App language & text direction",
  "settings.users": "User Management",
  "settings.users.desc": "Team members & roles",
  "settings.backup": "Backup & Export",
  "settings.backup.desc": "Download your data",
  "settings.recycle": "Recycle Bin",
  "settings.recycle.desc": "Restore deleted items",
  "settings.activity": "Activity",
  "settings.activity.desc": "Track all edits, deletes and restores",
  "settings.currency": "Currency",
  "settings.currency.desc": "Display preferences",

  "settings.howto": "How To Use",
  "settings.howto.desc": "Guided tour of every page",
  "settings.calc": "Calculation Logic",
  "settings.calc.desc": "How each total is computed",
  "settings.security": "Security",
  "settings.security.desc": "Sessions & access",
  "settings.about": "About App",
  "settings.about.desc": "Version, credits & support",
  "settings.logout": "Sign out",
  "settings.logout.desc": "End this session",

  // Language section
  "language.title": "Choose language",
  "language.subtitle": "The whole app adapts — including layout direction.",
  "language.rtlBadge": "Right-to-left layout",
  "language.note": "Selection is saved on this device and used across sessions.",

  // Appearance section
  "appearance.mode": "Mode",
  "appearance.mode.light": "Light mode",
  "appearance.mode.light.desc": "Bright, classic ERP feel.",
  "appearance.mode.dark": "Dark mode",
  "appearance.mode.dark.desc": "Easy on the eyes at night.",
  "appearance.themes": "Themes & options",

  // About
  "about.version": "Version",
  "about.product": "ShRiAh Group — Finance & Warehouse ERP",
  "about.tag": "Premium mobile-first ERP for shops, warehouse and bank.",

  // Security
  "security.signedInAs": "Signed in as",
  "security.signout": "Sign out of this device",
  "security.note": "All data access is protected by row-level security on the server.",
};

const bn: Dict = {
  "app.name": "শ্রীয়াহ",
  "app.tagline": "গ্রুপ ইআরপি",
  "app.signedInAs": "সাইন ইন করেছেন",
  "app.menu": "মেনু",
  "app.comingSoon": "শীঘ্রই আসছে",
  "app.soon": "শীঘ্রই",

  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.shop": "দোকান",
  "nav.warehouse": "গুদাম",
  "nav.wholesale": "পাইকারি",
  "nav.transactions": "লেনদেন",
  "nav.txns": "লেনদেন",
  "nav.employees": "কর্মচারী",
  "nav.reports": "রিপোর্ট",
  "nav.aiScan": "এআই স্ক্যান",
  "nav.purchaseScan": "স্মার্ট পারচেজ স্ক্যান",
  "nav.companyAliases": "কোম্পানি উপনাম",
  "nav.help": "ব্যবহার নির্দেশিকা",
  "nav.settings": "সেটিংস",
  "nav.profile": "প্রোফাইল",
  "nav.backup": "ব্যাকআপ",
  "nav.about": "অ্যাপ সম্পর্কে",

  "nav.desc.employees": "প্রতি কর্মচারীর দেওয়া ও পাওয়া টাকা",
  "nav.desc.reports": "আর্থিক রিপোর্ট ও এক্সপোর্ট",
  "nav.desc.aiScan": "পরীক্ষামূলক ওসিআর ও ডকুমেন্ট স্ক্যান",
  "nav.desc.purchaseScan": "এআই হাতে লেখা ক্রয় শিট পড়ে",
  "nav.desc.help": "গাইড, সূত্র ও হিসাব",
  "nav.desc.settings": "ওয়ার্কস্পেস কনফিগারেশন",
  "nav.desc.profile": "অ্যাকাউন্ট ও পছন্দ",
  "nav.desc.backup": "এক্সপোর্ট ও পুনরুদ্ধার",
  "nav.desc.about": "ভার্সন ও ক্রেডিট",

  "common.save": "সংরক্ষণ",
  "common.cancel": "বাতিল",
  "common.delete": "মুছুন",
  "common.edit": "সম্পাদনা",
  "common.add": "যোগ করুন",
  "common.close": "বন্ধ করুন",
  "common.confirm": "নিশ্চিত করুন",
  "common.search": "খুঁজুন",
  "common.loading": "লোড হচ্ছে…",
  "common.empty": "এখনো কিছু নেই।",
  "common.all": "সব",
  "common.today": "আজ",
  "common.yesterday": "গতকাল",
  "common.weekly": "সাপ্তাহিক",
  "common.monthly": "মাসিক",
  "common.custom": "কাস্টম",

  "settings.title": "সেটিংস",
  "settings.subtitle": "ওয়ার্কস্পেস কনফিগারেশন",
  "settings.search": "সেটিংস খুঁজুন…",
  "settings.noMatch": "\"{query}\" এর সাথে মিল নেই।",

  "settings.group.workspace": "ওয়ার্কস্পেস",
  "settings.group.warehouse": "গুদাম",
  "settings.group.preferences": "পছন্দ",
  "settings.group.system": "সিস্টেম",
  "settings.group.account": "অ্যাকাউন্ট",
  "settings.group.advanced": "অ্যাডভান্সড",
  "settings.group.help": "সাহায্য ও তথ্য",

  "settings.opening": "প্রারম্ভিক সেটআপ",
  "settings.opening.desc": "অ্যাপ শুরুর আগের ব্যালেন্স",
  "settings.shops": "দোকান পরিচালনা",
  "settings.shops.desc": "শাখা ও প্রারম্ভিক ক্যাশ",
  "settings.cashiers": "ক্যাশিয়ার পরিচালনা",
  "settings.cashiers.desc": "প্রতি দোকানের কর্মী",
  "settings.parties": "পার্টি পরিচালনা",
  "settings.parties.desc": "ক্রেতা ও সরবরাহকারী",
  "settings.categories": "ক্যাটাগরি",
  "settings.categories.desc": "আয় ও ব্যয়ের ধরন",
  "settings.subcategories": "সাব-ক্যাটাগরি",
  "settings.subcategories.desc": "ক্যাটাগরির বিস্তারিত",

  "settings.appearance": "অ্যাপিয়ারেন্স ও থিম",
  "settings.appearance.desc": "থিম, মোড, কালার, ঘনত্ব ও অ্যানিমেশন",
  "settings.language": "ভাষা",
  "settings.language.desc": "অ্যাপের ভাষা ও টেক্সট দিক",
  "settings.users": "ইউজার পরিচালনা",
  "settings.users.desc": "টিম সদস্য ও ভূমিকা",
  "settings.backup": "ব্যাকআপ ও এক্সপোর্ট",
  "settings.backup.desc": "ডেটা ডাউনলোড করুন",
  "settings.recycle": "রিসাইকেল বিন",
  "settings.recycle.desc": "মুছে ফেলা আইটেম ফিরিয়ে আনুন",
  "settings.activity": "কার্যকলাপ",
  "settings.activity.desc": "সব এডিট, মুছে ফেলা ও পুনরুদ্ধার ট্র্যাক করুন",
  "settings.currency": "মুদ্রা",
  "settings.currency.desc": "প্রদর্শন পছন্দ",

  "settings.howto": "ব্যবহার নির্দেশিকা",
  "settings.howto.desc": "প্রতিটি পেজের গাইডেড ট্যুর",
  "settings.calc": "হিসাব পদ্ধতি",
  "settings.calc.desc": "প্রতিটি টোটাল কীভাবে গণনা হয়",
  "settings.security": "নিরাপত্তা",
  "settings.security.desc": "সেশন ও অ্যাক্সেস",
  "settings.about": "অ্যাপ সম্পর্কে",
  "settings.about.desc": "ভার্সন, ক্রেডিট ও সহায়তা",
  "settings.logout": "সাইন আউট",
  "settings.logout.desc": "এই সেশন শেষ করুন",

  "language.title": "ভাষা নির্বাচন করুন",
  "language.subtitle": "পুরো অ্যাপ মানিয়ে নেবে — লেআউট দিকসহ।",
  "language.rtlBadge": "ডান-থেকে-বাম লেআউট",
  "language.note": "এই ডিভাইসে নির্বাচন সংরক্ষণ থাকবে এবং সব সেশনে কাজ করবে।",

  "appearance.mode": "মোড",
  "appearance.mode.light": "লাইট মোড",
  "appearance.mode.light.desc": "উজ্জ্বল, ক্লাসিক ইআরপি অনুভূতি।",
  "appearance.mode.dark": "ডার্ক মোড",
  "appearance.mode.dark.desc": "রাতে চোখে আরাম।",
  "appearance.themes": "থিম ও অপশন",

  "about.version": "ভার্সন",
  "about.product": "শ্রীয়াহ গ্রুপ — ফাইন্যান্স ও গুদাম ইআরপি",
  "about.tag": "দোকান, গুদাম ও ব্যাংকের জন্য প্রিমিয়াম মোবাইল-ফার্স্ট ইআরপি।",

  "security.signedInAs": "সাইন ইন করেছেন",
  "security.signout": "এই ডিভাইস থেকে সাইন আউট করুন",
  "security.note": "সার্ভারে রো-লেভেল সিকিউরিটি দিয়ে সব ডেটা সুরক্ষিত।",
};

const ar: Dict = {
  "app.name": "شريعة",
  "app.tagline": "نظام إدارة الموارد",
  "app.signedInAs": "تم تسجيل الدخول كـ",
  "app.menu": "القائمة",
  "app.comingSoon": "قريبًا",
  "app.soon": "قريبًا",

  "nav.dashboard": "لوحة التحكم",
  "nav.shop": "المتجر",
  "nav.warehouse": "المستودع",
  "nav.wholesale": "الجملة",
  "nav.transactions": "المعاملات",
  "nav.txns": "المعاملات",
  "nav.employees": "الموظفون",
  "nav.reports": "التقارير",
  "nav.aiScan": "المسح الذكي",
  "nav.purchaseScan": "مسح المشتريات الذكي",
  "nav.companyAliases": "أسماء الشركات",
  "nav.help": "كيفية الاستخدام",
  "nav.settings": "الإعدادات",
  "nav.profile": "الملف الشخصي",
  "nav.backup": "النسخ الاحتياطي",
  "nav.about": "حول التطبيق",

  "nav.desc.employees": "المبالغ المُعطاة والمستلَمة لكل موظف",
  "nav.desc.reports": "التقارير المالية والتصدير",
  "nav.desc.aiScan": "مسح المستندات التجريبي",
  "nav.desc.purchaseScan": "الذكاء الاصطناعي يقرأ أوراق المشتريات المكتوبة بخط اليد",
  "nav.desc.help": "الدليل والصيغ والحسابات",
  "nav.desc.settings": "إعداد مساحة العمل",
  "nav.desc.profile": "الحساب والتفضيلات",
  "nav.desc.backup": "تصدير واستعادة",
  "nav.desc.about": "الإصدار والاعتمادات",

  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.delete": "حذف",
  "common.edit": "تعديل",
  "common.add": "إضافة",
  "common.close": "إغلاق",
  "common.confirm": "تأكيد",
  "common.search": "بحث",
  "common.loading": "جارٍ التحميل…",
  "common.empty": "لا يوجد شيء بعد.",
  "common.all": "الكل",
  "common.today": "اليوم",
  "common.yesterday": "أمس",
  "common.weekly": "أسبوعي",
  "common.monthly": "شهري",
  "common.custom": "مخصص",

  "settings.title": "الإعدادات",
  "settings.subtitle": "إعداد مساحة العمل",
  "settings.search": "ابحث في الإعدادات…",
  "settings.noMatch": "لا توجد نتائج لـ \"{query}\".",

  "settings.group.workspace": "مساحة العمل",
  "settings.group.warehouse": "المستودع",
  "settings.group.preferences": "التفضيلات",
  "settings.group.system": "النظام",
  "settings.group.account": "الحساب",
  "settings.group.advanced": "متقدم",
  "settings.group.help": "المساعدة والمعلومات",

  "settings.opening": "الإعداد الافتتاحي",
  "settings.opening.desc": "الأرصدة قبل بدء التطبيق",
  "settings.shops": "إدارة المتاجر",
  "settings.shops.desc": "الفروع والنقد الافتتاحي",
  "settings.cashiers": "إدارة الصرافين",
  "settings.cashiers.desc": "الموظفون لكل متجر",
  "settings.parties": "إدارة الأطراف",
  "settings.parties.desc": "العملاء والموردون",
  "settings.categories": "الفئات",
  "settings.categories.desc": "أنواع الدخل والمصروف",
  "settings.subcategories": "الفئات الفرعية",
  "settings.subcategories.desc": "تفاصيل الفئات",

  "settings.appearance": "المظهر والسمات",
  "settings.appearance.desc": "السمة والوضع واللون والكثافة والحركة",
  "settings.language": "اللغة",
  "settings.language.desc": "لغة التطبيق واتجاه النص",
  "settings.users": "إدارة المستخدمين",
  "settings.users.desc": "أعضاء الفريق والأدوار",
  "settings.backup": "النسخ الاحتياطي والتصدير",
  "settings.backup.desc": "تنزيل بياناتك",
  "settings.recycle": "سلة المحذوفات",
  "settings.recycle.desc": "استعادة العناصر المحذوفة",
  "settings.activity": "النشاط",
  "settings.activity.desc": "تتبع جميع التعديلات والحذف والاستعادة",
  "settings.currency": "العملة",
  "settings.currency.desc": "تفضيلات العرض",

  "settings.howto": "كيفية الاستخدام",
  "settings.howto.desc": "جولة موجهة في كل صفحة",
  "settings.calc": "منطق الحساب",
  "settings.calc.desc": "كيف يتم حساب كل إجمالي",
  "settings.security": "الأمان",
  "settings.security.desc": "الجلسات والوصول",
  "settings.about": "حول التطبيق",
  "settings.about.desc": "الإصدار والاعتمادات والدعم",
  "settings.logout": "تسجيل الخروج",
  "settings.logout.desc": "إنهاء هذه الجلسة",

  "language.title": "اختر اللغة",
  "language.subtitle": "يتكيف التطبيق بالكامل — بما في ذلك اتجاه التخطيط.",
  "language.rtlBadge": "تخطيط من اليمين إلى اليسار",
  "language.note": "يُحفظ الاختيار على هذا الجهاز ويُستخدم عبر الجلسات.",

  "appearance.mode": "الوضع",
  "appearance.mode.light": "الوضع الفاتح",
  "appearance.mode.light.desc": "شعور كلاسيكي مشرق.",
  "appearance.mode.dark": "الوضع الداكن",
  "appearance.mode.dark.desc": "مريح للعين ليلاً.",
  "appearance.themes": "السمات والخيارات",

  "about.version": "الإصدار",
  "about.product": "مجموعة شريعة — نظام إدارة المالية والمستودعات",
  "about.tag": "نظام ERP مميز للمتاجر والمستودع والبنك.",

  "security.signedInAs": "تم تسجيل الدخول كـ",
  "security.signout": "تسجيل الخروج من هذا الجهاز",
  "security.note": "كل وصول للبيانات محمي بسياسات الأمان على الصفوف.",
};

const dictionaries: Record<Lang, Dict> = { en, bn, ar };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<Ctx>({
  lang: "en",
  dir: "ltr",
  setLang: () => {},
  t: (k) => k,
});

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, n) => (vars[n] != null ? String(vars[n]) : `{${n}}`));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (s && (s === "en" || s === "bn" || s === "ar")) setLangState(s);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = LANGUAGES.find((l) => l.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    if (hydrated) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    }
  }, [lang, hydrated]);

  const value = useMemo<Ctx>(() => {
    const meta = LANGUAGES.find((l) => l.code === lang)!;
    return {
      lang,
      dir: meta.dir,
      setLang: setLangState,
      t: (key, vars) => {
        const s = dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
        return interpolate(s, vars);
      },
    };
  }, [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
export const useT = () => useContext(I18nCtx).t;
