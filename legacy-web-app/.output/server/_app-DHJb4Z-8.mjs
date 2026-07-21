import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, u as useRouter, f as useRouterState, N as Navigate, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { k as useAuth, r as useT, s as useUserAccess, v as pageKeyFromPath, d as cn, B as Button, W as WorkingDateProvider, S as Sheet, x as SheetTrigger, e as SheetContent, o as useWorkingDate, P as Popover, p as PopoverTrigger, q as PopoverContent, t as todayISO, n as buttonVariants } from "./_ssr/router-KeVl8_Ln.mjs";
import { s as supabase } from "./_ssr/client-Bs6QIVWe.mjs";
import { u as useFcmRegister } from "./_ssr/use-fcm-B-dQhcZ8.mjs";
import "./_libs/capacitor__core.mjs";
import "./_libs/capacitor__push-notifications.mjs";
import "./_libs/capacitor__local-notifications.mjs";
import "./_libs/react-dom.mjs";

import "./_libs/seroval.mjs";
import "./_libs/vaul.mjs";
import { a9 as House, aa as Store, ab as Globe, ac as FileChartColumnIncreasing, h as Undo2, ad as CircleArrowUp, ae as TrendingUp, af as Workflow, ag as CalendarCheck, ah as CalendarRange, ai as Building2, L as Lock, U as Users, aj as Settings, W as Wallet, X, ak as LogOut, al as PanelLeftOpen, am as PanelLeftClose, l as Sparkles, an as Menu, u as ChevronRight, a as TriangleAlert, b as RotateCcw, ao as RefreshCw, a3 as Bell, ap as VolumeX, aq as Volume2, n as Check, T as Trash2, ar as BellOff, a7 as Eye, I as MessageCircle, S as ShieldAlert, t as ChevronLeft, m as ChevronDown } from "./_libs/lucide-react.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "./_libs/react-day-picker.mjs";

import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";


import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/tslib.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-tabs.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_ssr/server-CQ33fA4m.mjs";
import "./_libs/h3-v2.mjs";
import "./_libs/unenv.mjs";



import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";




import "./_ssr/auth-middleware-Cokoym5w.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-radio-group.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_ssr/client.server-BKaVHv6C.mjs";
import "./_libs/zod.mjs";
import "./_libs/date-fns__tz.mjs";
import "./_libs/date-fns.mjs";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function chipLabel(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
function fullLabel(iso) {
  const d = parseISO(iso);
  return d.toLocaleDateString(void 0, { day: "numeric", month: "short", year: "numeric" });
}
function yesterdayISO() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - 1);
  return toISO(d);
}
function lastMonthEndISO() {
  const d = /* @__PURE__ */ new Date();
  d.setDate(0);
  return toISO(d);
}
function WorkingDatePill({ className }) {
  const { workingDate, setWorkingDate, resetToToday, isToday } = useWorkingDate();
  const [open, setOpen] = reactExports.useState(false);
  const pick = (iso) => {
    setWorkingDate(iso);
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "aria-label": `Working date: ${fullLabel(workingDate)}${isToday ? "" : " (historical)"}`,
        className: cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 h-7 text-[12px] font-medium leading-none tabular-nums transition-all active:scale-[0.97]",
          isToday ? "border-border/60 bg-muted/40 text-foreground hover:bg-muted" : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100",
          className
        ),
        children: [
          !isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: chipLabel(workingDate) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-auto p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/60 px-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground", children: "Working Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12px] font-medium", children: "All dashboard cards refresh for this date." }),
        !isToday && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          " Viewing Historical Data"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[11px]", onClick: () => pick(todayISO()), children: "Today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[11px]", onClick: () => pick(yesterdayISO()), children: "Yesterday" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-7 px-2 text-[11px]", onClick: () => pick(lastMonthEndISO()), children: "Last Month End" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Calendar,
        {
          mode: "single",
          selected: parseISO(workingDate),
          onSelect: (d) => {
            if (d) pick(toISO(d));
          },
          initialFocus: true,
          className: cn("p-3 pointer-events-auto")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
          "Today: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: fullLabel(todayISO()) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 gap-1 px-2 text-[11px]",
            onClick: () => {
              resetToToday();
              setOpen(false);
            },
            disabled: isToday,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
              " Reset"
            ]
          }
        )
      ] })
    ] })
  ] });
}
const OrderNotificationsContext = reactExports.createContext(null);
const ADMIN_WA_FALLBACK = "0553687388";
const STORAGE_KEY = "erp_order_notifications_v1";
const MUTE_KEY = "erp_order_notifications_muted";
const MAX_KEEP = 50;
function normalizeWA(num) {
  const digits = (num || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "966" + digits.slice(1);
  return digits;
}
function loadStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX_KEEP) : [];
  } catch {
    return [];
  }
}
function playBeep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.setValueAtTime(660, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(1e-4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.35);
    o.start();
    o.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close(), 600);
  } catch {
  }
}
function OrderNotificationsProvider({ children }) {
  const [notifications, setNotifications] = reactExports.useState(() => loadStored());
  const [muted, setMutedState] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MUTE_KEY) === "1";
  });
  const [permission, setPermission] = reactExports.useState(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [whatsappNumber, setWhatsappNumber] = reactExports.useState(ADMIN_WA_FALLBACK);
  const seenIds = reactExports.useRef(new Set(notifications.map((n) => n.orderId)));
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_KEEP)));
    } catch {
    }
  }, [notifications]);
  const setMuted = reactExports.useCallback((v) => {
    setMutedState(v);
    try {
      localStorage.setItem(MUTE_KEY, v ? "1" : "0");
    } catch {
    }
  }, []);
  const requestPermission = reactExports.useCallback(async () => {
    if (!("Notification" in window)) return;
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase.from("app_settings").select("store_whatsapp").eq("id", 1).maybeSingle();
        if (alive && data?.store_whatsapp) setWhatsappNumber(data.store_whatsapp);
      } catch {
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  reactExports.useEffect(() => {
    (async () => {
      try {
        const { count, error } = await supabase.from("notification_tokens").select("id", { count: "exact", head: true }).in("role", ["admin", "super_admin"]);
        if (error) {
          console.warn("[OrderNotify] token count query failed:", error.message);
        } else {
          console.log("[OrderNotify] admin/super_admin notification tokens registered:", count ?? 0);
        }
      } catch (e) {
        console.warn("[OrderNotify] token count check failed:", e);
      }
    })();
  }, []);
  const pushNotification = reactExports.useCallback((row) => {
    const orderId = row.id;
    if (seenIds.current.has(orderId)) return;
    seenIds.current.add(orderId);
    const items = Array.isArray(row.items) ? row.items : [];
    const itemCount = items.reduce((s, it) => s + (Number(it?.qty) || 1), 0) || items.length;
    const n = {
      id: `${orderId}-${Date.now()}`,
      orderId,
      orderNumber: row.order_number ?? 0,
      customer: row.customer_name ?? "Customer",
      mobile: row.customer_mobile ?? "",
      total: Number(row.total ?? 0),
      itemCount,
      status: row.status ?? "pending",
      createdAt: row.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    setNotifications((prev) => [n, ...prev].slice(0, MAX_KEEP));
    if (!muted) playBeep();
    toast.success(`🛒 New Wholesale Order #${n.orderNumber}`, {
      description: `${n.customer} — SAR ${n.total.toFixed(2)}`,
      duration: 6e3
    });
    const title = "New Wholesale Order";
    const body = `${n.customer} placed an order worth SAR ${n.total.toFixed(2)}`;
    const opts = {
      body,
      tag: `order-${orderId}`,
      // dedupe
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url: "/store-admin", orderId }
    };
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      const showViaSw = async () => {
        try {
          if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) {
              await reg.showNotification(title, opts);
              console.log("[OrderNotify] sent via SW for order", orderId);
              return true;
            }
          }
        } catch (e) {
          console.warn("[OrderNotify] SW notification failed:", e);
        }
        return false;
      };
      showViaSw().then((ok) => {
        if (ok) return;
        try {
          const note = new Notification(title, opts);
          note.onclick = () => {
            try {
              window.focus();
            } catch {
            }
            note.close();
          };
          console.log("[OrderNotify] sent via Notification() for order", orderId);
        } catch (e) {
          console.warn("[OrderNotify] notification failed:", e);
        }
      });
    } else {
      console.log("[OrderNotify] skipped — permission:", typeof Notification !== "undefined" ? Notification.permission : "unsupported");
    }
  }, [muted]);
  reactExports.useEffect(() => {
    const channel = supabase.channel("shop_orders_alerts").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "shop_orders" },
      (payload) => {
        const row = payload.new;
        if (!row || row.is_deleted) return;
        console.log("[OrderNotify] new order received:", row.id, "customer:", row.customer_name, "total:", row.total);
        try {
          pushNotification(row);
        } catch (e) {
          console.warn("[OrderNotify] push failed (non-fatal):", e);
        }
      }
    ).subscribe((status) => {
      console.log("[OrderNotify] realtime channel status:", status);
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [pushNotification]);
  const markAllRead = reactExports.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const markRead = reactExports.useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);
  const clear = reactExports.useCallback(() => {
    setNotifications([]);
    seenIds.current.clear();
  }, []);
  const openWhatsApp = reactExports.useCallback((n) => {
    const wa = normalizeWA(whatsappNumber);
    const msg = `🛒 New Order Received%0A%0ACustomer: ${encodeURIComponent(n.customer)}%0AOrder ID: #${n.orderNumber}%0AItems: ${n.itemCount}%0ATotal: SAR ${n.total.toFixed(2)}%0A%0AOpen ERP to review order.`;
    const url = `https://wa.me/${wa}?text=${msg}`;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
    }
  }, [whatsappNumber]);
  const unread = reactExports.useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const value = {
    notifications,
    unread,
    muted,
    setMuted,
    permission,
    requestPermission,
    markAllRead,
    markRead,
    clear,
    openWhatsApp,
    whatsappNumber
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OrderNotificationsContext.Provider, { value, children });
}
function useOrderNotifications() {
  const ctx = reactExports.useContext(OrderNotificationsContext);
  if (!ctx) throw new Error("useOrderNotifications must be used within OrderNotificationsProvider");
  return ctx;
}
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1e3;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
function NotificationBell({ className }) {
  const { notifications, unread, muted, setMuted, permission, requestPermission, markAllRead, markRead, clear, openWhatsApp } = useOrderNotifications();
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "aria-label": "Notifications",
        className: cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted active:scale-95 transition-transform",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-[18px] w-[18px]" }),
          unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1", children: unread > 99 ? "99+" : unread })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-[92vw] max-w-[360px] p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2.5 border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Notifications" }),
          unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary", children: [
            unread,
            " new"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setMuted(!muted),
              title: muted ? "Unmute" : "Mute",
              className: "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
              children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" })
            }
          ),
          notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: markAllRead,
                title: "Mark all read",
                className: "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: clear,
                title: "Clear",
                className: "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }),
      permission !== "granted" && permission !== "unsupported" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60 bg-muted/30 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-4 w-4 mt-0.5 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-medium", children: "Enable browser alerts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Get alerts even when tab is in background." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "default", className: "h-7 text-[11px]", onClick: requestPermission, children: "Allow" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto overscroll-contain", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "mx-auto h-8 w-8 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] text-muted-foreground", children: "No notifications yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/70", children: "New orders will appear here instantly." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/50", children: notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: cn(
            "px-3 py-2.5 transition-colors",
            !n.read && "bg-primary/[0.04]"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
              "mt-0.5 h-2 w-2 rounded-full shrink-0",
              n.read ? "bg-transparent" : "bg-primary"
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px] font-semibold truncate", children: [
                  "🛒 Order #",
                  n.orderNumber
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: timeAgo(n.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground truncate", children: [
                n.customer,
                " — ",
                n.itemCount,
                " items · SAR ",
                n.total.toFixed(2)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/store-admin",
                    search: { tab: "notifications" },
                    onClick: () => {
                      markRead(n.id);
                      setOpen(false);
                    },
                    className: "inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
                      " View"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => openWhatsApp(n),
                    className: "inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-emerald-700",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3" }),
                      " WhatsApp"
                    ]
                  }
                ),
                !n.read && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => markRead(n.id),
                    className: "inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] })
          ] })
        },
        n.id
      )) }) })
    ] })
  ] });
}
const KEYS = [
  // Shop / entries
  "shop_entries",
  "shops",
  "transactions",
  "txns",
  // Warehouse
  "wh_ledger",
  "wholesale-dashboard-summary",
  "dashboard-recent-entries-v2",
  "wh-recent-entries",
  "wh-financials",
  "wh-profit",
  "wh-receivable-breakdown",
  // Summary / cash
  "parties",
  "app_settings",
  "employee-entries",
  "cash_in_hand_snapshots"
];
function GlobalRefreshButton({ className }) {
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const inflight = reactExports.useRef(false);
  const onClick = reactExports.useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    setBusy(true);
    try {
      await Promise.all(KEYS.map((k) => qc.invalidateQueries({ queryKey: [k] })));
    } finally {
      setTimeout(() => {
        inflight.current = false;
        setBusy(false);
      }, 250);
    }
  }, [qc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled: busy,
      "aria-label": "Refresh data",
      className: cn(
        "flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95 disabled:opacity-60",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-4 w-4", busy && "animate-spin text-primary") })
    }
  );
}
const GlobalSearch = reactExports.lazy(() => import("./_ssr/global-search-DZ5P9yrm.mjs").then((m) => ({
  default: m.GlobalSearch
})));
const GlobalAiButton = reactExports.lazy(() => import("./_ssr/global-ai-button-C1jEv0_p.mjs").then((m) => ({
  default: m.GlobalAiButton
})));
const BOTTOM_NAV = [{
  to: "/summary",
  labelKey: "nav.home",
  icon: House
}, {
  to: "/shop",
  labelKey: "nav.shop",
  icon: Store
}, {
  to: "/store-admin",
  labelKey: "nav.wholesale",
  icon: Globe
}, {
  to: "/reports",
  labelKey: "nav.reports",
  icon: FileChartColumnIncreasing
}];
const NAV_GROUPS = [{
  title: "Main",
  items: [{
    to: "/summary",
    label: "Home",
    icon: House,
    pageKey: pageKeyFromPath("/summary") ?? void 0
  }, {
    to: "/shop",
    label: "Shop",
    icon: Store,
    pageKey: pageKeyFromPath("/shop") ?? void 0
  }, {
    to: "/store-admin",
    label: "Wholesale",
    icon: Globe,
    pageKey: pageKeyFromPath("/store-admin") ?? void 0
  }, {
    to: "/reports",
    label: "Reports",
    icon: FileChartColumnIncreasing,
    pageKey: "reports"
  }, {
    to: "/sales-return",
    label: "Sales Return",
    icon: Undo2,
    pageKey: "sales-return"
  }, {
    to: "/my-expenses",
    label: "My Wallet",
    icon: CircleArrowUp,
    pageKey: "my-expenses"
  }, {
    to: "/price-compare",
    label: "Price Compare",
    icon: TrendingUp,
    pageKey: "price-compare"
  }]
}, {
  title: "Workspace",
  items: [{
    to: "/finance-workflow",
    label: "Finance Workflow",
    icon: Workflow,
    pageKey: "finance-workflow"
  }, {
    to: "/daily-closing",
    label: "Daily Closing",
    icon: CalendarCheck,
    pageKey: "daily-closing"
  }, {
    to: "/monthly-snapshot",
    label: "Monthly Snapshot",
    icon: CalendarRange,
    pageKey: "reports"
  }, {
    to: "/profit-summary",
    label: "Profit Summary",
    icon: TrendingUp,
    pageKey: "reports"
  }, {
    to: "/company-transactions",
    label: "Company Transactions",
    icon: Building2,
    pageKey: "company-transactions"
  }, {
    to: "/monthly-closing",
    label: "Monthly Closing",
    icon: Lock,
    pageKey: "reports"
  }, {
    to: "/employees",
    label: "Employees",
    icon: Users,
    pageKey: "employees"
  }, {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    pageKey: "settings"
  }]
}];
function AppLayout() {
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const nav = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("erp.sidebar.collapsed") === "1";
    } catch {
      return false;
    }
  });
  const toggleSidebar = reactExports.useCallback(() => {
    setSidebarCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem("erp.sidebar.collapsed", next ? "1" : "0");
      } catch {
      }
      return next;
    });
  }, []);
  const t = useT();
  const access = useUserAccess();
  const handleSignOut = reactExports.useCallback(async () => {
    try {
      setDrawerOpen(false);
      await signOut();
      qc.clear();
      router.invalidate();
      toast.success("Signed out");
      nav({
        to: "/login"
      });
    } catch (e) {
      toast.error(e?.message ?? "Could not sign out");
    }
  }, [signOut, qc, router, nav]);
  reactExports.useEffect(() => {
    const open = () => setSearchOpen(true);
    window.addEventListener("lovable:open-ai-copilot", open);
    return () => window.removeEventListener("lovable:open-ai-copilot", open);
  }, []);
  useFcmRegister();
  const {
    BOTTOM,
    GROUPS
  } = reactExports.useMemo(() => {
    const hasAccess = (key) => !key || access.hasPage(key);
    const B = BOTTOM_NAV.filter((it) => hasAccess(pageKeyFromPath(it.to) ?? void 0));
    const G = NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => hasAccess(it.pageKey))
    })).filter((g) => g.items.length > 0);
    return {
      BOTTOM: B,
      GROUPS: G
    };
  }, [access.hasPage]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center text-muted-foreground", children: t("common.loading") });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  const currentKey = pageKeyFromPath(pathname);
  const routeAllowed = access.loading || !currentKey || access.hasPage(currentKey);
  const canAi = access.hasPage("ai-insights");
  const isItemActive = (item) => {
    if (!pathname.startsWith(item.to)) return false;
    try {
      const sp = new URLSearchParams(window.location.search);
      const currentTab = sp.get("tab");
      if (item.search?.tab) return currentTab === item.search.tab;
      return !currentTab;
    } catch {
      return !item.search?.tab;
    }
  };
  const renderDrawerItem = (item) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, search: item.search, onClick: () => setDrawerOpen(false), className: cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/60"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex h-9 w-9 items-center justify-center rounded-xl transition-colors", active ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground group-hover:text-foreground"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", strokeWidth: 1.75 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-[14px] font-medium leading-tight", children: item.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground/40 rtl:rotate-180" })
    ] }, `${item.to}-${item.label}`);
  };
  const renderDesktopItem = (item) => {
    const Icon = item.icon;
    const active = isItemActive(item);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, search: item.search, title: sidebarCollapsed ? item.label : void 0, className: cn("group flex items-center gap-3 rounded-xl py-2 text-[13.5px] font-medium transition-all", sidebarCollapsed ? "justify-center px-2" : "px-3", active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-soft)]" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[16px] w-[16px] shrink-0", strokeWidth: 1.75 }),
      !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.label })
    ] }, `${item.to}-${item.label}`);
  };
  const SideDrawerContent = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold leading-tight", children: t("app.name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.14em] text-muted-foreground", children: t("app.tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDrawerOpen(false), className: "flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground md:hidden", "aria-label": t("common.close"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 [-webkit-overflow-scrolling:touch]", children: GROUPS.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(gi > 0 && "mt-5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70", children: group.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: group.items.map(renderDrawerItem) })
    ] }, group.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 px-5 py-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: t("app.signedInAs") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-center gap-2", onClick: handleSignOut, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WorkingDateProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderNotificationsProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: cn("fixed inset-y-0 start-0 z-30 hidden flex-col border-e border-sidebar-border bg-sidebar p-4 transition-[width] duration-200 md:flex", sidebarCollapsed ? "w-[72px]" : "w-64"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/summary", className: cn("mb-4 flex items-center gap-3 transition-opacity hover:opacity-90", sidebarCollapsed ? "justify-center px-0" : "px-2"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }) }),
        !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-base font-bold leading-tight", children: t("app.name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] uppercase tracking-wider text-muted-foreground", children: t("app.tagline") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: toggleSidebar, className: "mb-3 flex h-8 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/40 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", "aria-label": sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar", title: sidebarCollapsed ? "Expand" : "Collapse", children: sidebarCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Collapse" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-4 overflow-y-auto pr-1", children: GROUPS.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70", children: group.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: group.items.map(renderDesktopItem) })
      ] }, group.title)) }),
      !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-2 pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 truncate text-xs text-muted-foreground", children: user.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSignOut, className: "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive", "aria-label": "Sign out", title: "Sign out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
      ] }),
      sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSignOut, className: "mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive", "aria-label": "Sign out", title: "Sign out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: cn("fixed top-0 end-0 z-20 hidden h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:flex", sidebarCollapsed ? "start-[72px]" : "start-64"), children: [
      canAi && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSearchOpen(true), className: "flex h-9 max-w-md flex-1 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 text-[13px] text-muted-foreground transition-colors hover:bg-muted/60", "aria-label": "Search anything", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-left", children: "Search anything…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground", children: "⌘K" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WorkingDatePill, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalRefreshButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)] md:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[var(--mobile-topbar-height)] items-center justify-between px-4 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: drawerOpen, onOpenChange: setDrawerOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted active:scale-95", "aria-label": t("app.menu"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "w-[82vw] max-w-[340px] border-e border-border/60 bg-background p-0 rtl:border-e-0 rtl:border-s", children: SideDrawerContent })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: access.primaryRoute, className: "flex items-center gap-2 active:scale-[0.98] transition-transform", "aria-label": t("app.name"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WorkingDatePill, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalRefreshButton, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationBell, {})
        ] })
      ] }),
      canAi && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSearchOpen(true), className: "flex w-full items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-2 text-left text-[12.5px] text-muted-foreground transition-colors hover:bg-muted/60 active:scale-[0.99]", "aria-label": "Search anything", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: "Search anything…" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, { fallback: null, children: [
      searchOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalSearch, { open: searchOpen, onOpenChange: setSearchOpen }),
      canAi && /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalAiButton, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: cn("mobile-scroll-page pt-[112px] pb-bottom-nav md:pt-14", sidebarCollapsed ? "md:ms-[72px]" : "md:ms-64"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-7xl min-w-0 flex-col gap-4 overflow-visible p-4 md:max-w-none md:gap-6 md:p-6 xl:p-8", children: access.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-sm text-muted-foreground", children: "Loading access…" }) : routeAllowed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AccessRestricted, { to: access.primaryRoute }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed inset-x-0 bottom-0 z-20 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pointer-events-none md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border/60 bg-background px-2 py-1.5 shadow-sm", children: (BOTTOM.length ? BOTTOM : []).map((item) => {
      const active = pathname.startsWith(item.to);
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, search: item.search, className: cn("relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground hover:text-foreground"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex h-9 w-9 items-center justify-center rounded-xl", active && "bg-primary/15 scale-110"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[19px] w-[19px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("transition-opacity", active ? "opacity-100" : "opacity-70"), children: t(item.labelKey) })
      ] }, item.to);
    }) }) })
  ] }) }) });
}
function AccessRestricted({
  to
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center justify-center gap-3 px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-b from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-7 w-7" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold", children: "Access Denied" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
      "Insufficient Permission. Ask an admin to grant access from",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 font-medium text-foreground", children: "Team & Access" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "mt-1 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90", children: [
      "Go to my workspace ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 rtl:rotate-180" })
    ] })
  ] });
}
export {
  AppLayout as component
};
