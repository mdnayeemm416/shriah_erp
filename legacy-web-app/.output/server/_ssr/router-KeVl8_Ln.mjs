import process from "node:process";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQueryClient, a as useQuery, b as useMutation, c as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useSearch, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as redirect, m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports, R as React__default } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2, b as Trigger2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { C as Capacitor } from "../_libs/capacitor__core.mjs";
import { P as PushNotifications } from "../_libs/capacitor__push-notifications.mjs";
import { L as LocalNotifications } from "../_libs/capacitor__local-notifications.mjs";
import { R as Root2$1, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { h as DialogTrigger$1, D as Dialog$1, a as DialogPortal$1, b as DialogContent$1, e as DialogClose, c as DialogTitle$1, d as DialogDescription$1, g as DialogOverlay$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { r as reactDomExports } from "../_libs/react-dom.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";
import { D as Drawer$1 } from "../_libs/vaul.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { R as RadioGroup$1, a as RadioGroupItem$1, b as RadioGroupIndicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { S as SubTrigger2, a as SubContent2, P as Portal2$1, C as Content2$1, I as Item2, b as CheckboxItem2, c as ItemIndicator2, R as RadioItem2, L as Label2, d as Separator2, e as Root2$2, T as Trigger$1 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { P as Portal, C as Content2$2, R as Root2$3, T as Trigger$2, A as Anchor2 } from "../_libs/radix-ui__react-popover.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { s as supabaseAdmin } from "./client.server-BKaVHv6C.mjs";
import { T as Trash2, S as ShieldAlert, R as Recycle, a as TriangleAlert, b as RotateCcw, c as ShieldCheck, L as Lock, d as LockOpen, W as Wallet, e as ShoppingBag, C as CircleCheck, f as Clock, g as CircleX, U as Users, P as Plus, h as Undo2, i as Camera, j as Upload, X, k as LoaderCircle, l as Sparkles, B as BookmarkPlus, m as ChevronDown, n as Check, A as ArrowRightLeft, G as GitBranch, o as User, p as ChevronUp, q as Paperclip, Z as ZoomOut, r as ZoomIn, s as RotateCw, M as Maximize2, t as ChevronLeft, u as ChevronRight, v as Package, w as Circle, x as Phone, H as Hash, y as Search, z as UserPlus, D as UserRound, E as ScanLine, F as ShoppingCart, I as MessageCircle, J as Printer, K as FlashlightOff, N as Flashlight, O as Keyboard, Q as Minus, V as Ban } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, e as enumType, a as arrayType, l as literalType, b as booleanType } from "../_libs/zod.mjs";

import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";



import "../_libs/seroval-plugins.mjs";

import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
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

import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/radix-ui__react-menu.mjs";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-C1ikfg6z.css";
function dark(id, name, description, preview, vars) {
  return { id, name, mode: "dark", description, preview, vars };
}
function light(id, name, description, preview, vars) {
  return { id, name, mode: "light", description, preview, vars };
}
const THEMES = [
  dark(
    "emerald-dark",
    "Emerald Dark",
    "Modern finance dark green theme.",
    { bg: "#07111F", surface: "#0F172A", accent: "#14B8A6", text: "#F8FAFC" },
    {
      "--background": "oklch(0.18 0.025 250)",
      "--foreground": "oklch(0.97 0.005 240)",
      "--card": "oklch(0.235 0.028 252)",
      "--card-foreground": "oklch(0.97 0.005 240)",
      "--popover": "oklch(0.245 0.03 252)",
      "--popover-foreground": "oklch(0.97 0.005 240)",
      "--primary": "oklch(0.74 0.13 178)",
      "--primary-foreground": "oklch(0.16 0.025 250)",
      "--primary-glow": "oklch(0.78 0.15 165)",
      "--secondary": "oklch(0.28 0.025 252)",
      "--secondary-foreground": "oklch(0.97 0.005 240)",
      "--muted": "oklch(0.26 0.025 252)",
      "--muted-foreground": "oklch(0.72 0.02 240)",
      "--accent": "oklch(0.32 0.05 178)",
      "--accent-foreground": "oklch(0.92 0.05 178)",
      "--border": "oklch(1 0 0 / 0.06)",
      "--input": "oklch(1 0 0 / 0.09)",
      "--ring": "oklch(0.74 0.13 178)",
      "--sidebar": "oklch(0.21 0.025 250)",
      "--sidebar-foreground": "oklch(0.95 0.005 240)",
      "--sidebar-primary": "oklch(0.74 0.13 178)",
      "--sidebar-accent": "oklch(0.3 0.04 178)",
      "--sidebar-border": "oklch(1 0 0 / 0.06)"
    }
  ),
  dark(
    "midnight-blue",
    "Midnight Blue",
    "Deep navy premium banking UI.",
    { bg: "#0A1530", surface: "#13224A", accent: "#3B82F6", text: "#E8EDF8" },
    {
      "--background": "oklch(0.2 0.05 260)",
      "--foreground": "oklch(0.96 0.01 250)",
      "--card": "oklch(0.26 0.06 260)",
      "--card-foreground": "oklch(0.96 0.01 250)",
      "--popover": "oklch(0.27 0.06 260)",
      "--popover-foreground": "oklch(0.96 0.01 250)",
      "--primary": "oklch(0.7 0.17 255)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.78 0.16 240)",
      "--secondary": "oklch(0.3 0.05 260)",
      "--secondary-foreground": "oklch(0.96 0.01 250)",
      "--muted": "oklch(0.28 0.04 260)",
      "--muted-foreground": "oklch(0.72 0.03 250)",
      "--accent": "oklch(0.34 0.08 255)",
      "--accent-foreground": "oklch(0.92 0.06 250)",
      "--border": "oklch(1 0 0 / 0.07)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.7 0.17 255)",
      "--sidebar": "oklch(0.23 0.055 260)",
      "--sidebar-foreground": "oklch(0.95 0.01 250)",
      "--sidebar-primary": "oklch(0.7 0.17 255)",
      "--sidebar-accent": "oklch(0.32 0.07 255)",
      "--sidebar-border": "oklch(1 0 0 / 0.07)"
    }
  ),
  dark(
    "matte-black",
    "Matte Black",
    "Pure luxury black minimal UI.",
    { bg: "#0A0A0A", surface: "#141414", accent: "#E5E5E5", text: "#FAFAFA" },
    {
      "--background": "oklch(0.16 0 0)",
      "--foreground": "oklch(0.97 0 0)",
      "--card": "oklch(0.21 0 0)",
      "--card-foreground": "oklch(0.97 0 0)",
      "--popover": "oklch(0.22 0 0)",
      "--popover-foreground": "oklch(0.97 0 0)",
      "--primary": "oklch(0.93 0 0)",
      "--primary-foreground": "oklch(0.12 0 0)",
      "--primary-glow": "oklch(0.85 0 0)",
      "--secondary": "oklch(0.26 0 0)",
      "--secondary-foreground": "oklch(0.97 0 0)",
      "--muted": "oklch(0.24 0 0)",
      "--muted-foreground": "oklch(0.7 0 0)",
      "--accent": "oklch(0.3 0 0)",
      "--accent-foreground": "oklch(0.95 0 0)",
      "--border": "oklch(1 0 0 / 0.08)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.85 0 0)",
      "--sidebar": "oklch(0.18 0 0)",
      "--sidebar-foreground": "oklch(0.95 0 0)",
      "--sidebar-primary": "oklch(0.93 0 0)",
      "--sidebar-accent": "oklch(0.28 0 0)",
      "--sidebar-border": "oklch(1 0 0 / 0.08)"
    }
  ),
  dark(
    "glass-dark",
    "Glass Dark",
    "Blurred glassmorphism style.",
    { bg: "#0B1220", surface: "#1B2540", accent: "#8B5CF6", text: "#F1F5FF" },
    {
      "--background": "oklch(0.2 0.04 270)",
      "--foreground": "oklch(0.97 0.01 260)",
      "--card": "oklch(0.28 0.05 270 / 0.7)",
      "--card-foreground": "oklch(0.97 0.01 260)",
      "--popover": "oklch(0.3 0.05 270 / 0.85)",
      "--popover-foreground": "oklch(0.97 0.01 260)",
      "--primary": "oklch(0.72 0.18 290)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.78 0.17 270)",
      "--secondary": "oklch(0.32 0.05 270 / 0.6)",
      "--secondary-foreground": "oklch(0.97 0.01 260)",
      "--muted": "oklch(0.3 0.04 270 / 0.5)",
      "--muted-foreground": "oklch(0.74 0.03 270)",
      "--accent": "oklch(0.36 0.08 290)",
      "--accent-foreground": "oklch(0.93 0.06 290)",
      "--border": "oklch(1 0 0 / 0.1)",
      "--input": "oklch(1 0 0 / 0.12)",
      "--ring": "oklch(0.72 0.18 290)",
      "--sidebar": "oklch(0.24 0.04 270 / 0.7)",
      "--sidebar-foreground": "oklch(0.95 0.01 260)",
      "--sidebar-primary": "oklch(0.72 0.18 290)",
      "--sidebar-accent": "oklch(0.34 0.08 290)",
      "--sidebar-border": "oklch(1 0 0 / 0.1)"
    }
  ),
  light(
    "soft-white",
    "Soft White",
    "Clean minimal white ERP.",
    { bg: "#FAFBFC", surface: "#FFFFFF", accent: "#14B8A6", text: "#0F172A" },
    {
      "--background": "oklch(0.985 0.005 240)",
      "--foreground": "oklch(0.2 0.02 250)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.2 0.02 250)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.2 0.02 250)",
      "--primary": "oklch(0.66 0.13 178)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.74 0.14 165)",
      "--secondary": "oklch(0.96 0.01 240)",
      "--secondary-foreground": "oklch(0.22 0.03 250)",
      "--muted": "oklch(0.96 0.008 240)",
      "--muted-foreground": "oklch(0.5 0.02 250)",
      "--accent": "oklch(0.94 0.04 178)",
      "--accent-foreground": "oklch(0.25 0.06 178)",
      "--border": "oklch(0.91 0.01 250)",
      "--input": "oklch(0.91 0.01 250)",
      "--ring": "oklch(0.66 0.13 178)",
      "--sidebar": "oklch(0.99 0.003 240)",
      "--sidebar-foreground": "oklch(0.22 0.02 250)",
      "--sidebar-primary": "oklch(0.66 0.13 178)",
      "--sidebar-accent": "oklch(0.95 0.015 178)",
      "--sidebar-border": "oklch(0.92 0.01 250)"
    }
  ),
  light(
    "warm-beige",
    "Warm Beige",
    "Elegant soft cream business UI.",
    { bg: "#F7F1E6", surface: "#FFFBF2", accent: "#A87B4E", text: "#3A2C20" },
    {
      "--background": "oklch(0.96 0.02 80)",
      "--foreground": "oklch(0.28 0.04 60)",
      "--card": "oklch(0.99 0.015 85)",
      "--card-foreground": "oklch(0.28 0.04 60)",
      "--popover": "oklch(0.99 0.015 85)",
      "--popover-foreground": "oklch(0.28 0.04 60)",
      "--primary": "oklch(0.58 0.08 55)",
      "--primary-foreground": "oklch(0.99 0.01 85)",
      "--primary-glow": "oklch(0.68 0.1 55)",
      "--secondary": "oklch(0.93 0.025 80)",
      "--secondary-foreground": "oklch(0.3 0.05 60)",
      "--muted": "oklch(0.93 0.02 80)",
      "--muted-foreground": "oklch(0.52 0.04 60)",
      "--accent": "oklch(0.9 0.04 70)",
      "--accent-foreground": "oklch(0.32 0.07 55)",
      "--border": "oklch(0.85 0.03 70)",
      "--input": "oklch(0.88 0.025 75)",
      "--ring": "oklch(0.58 0.08 55)",
      "--sidebar": "oklch(0.97 0.02 80)",
      "--sidebar-foreground": "oklch(0.3 0.04 60)",
      "--sidebar-primary": "oklch(0.58 0.08 55)",
      "--sidebar-accent": "oklch(0.9 0.04 70)",
      "--sidebar-border": "oklch(0.86 0.03 70)"
    }
  ),
  dark(
    "royal-purple",
    "Royal Purple",
    "Luxury purple finance dashboard.",
    { bg: "#1A0F2E", surface: "#2A1A47", accent: "#A855F7", text: "#F3EBFF" },
    {
      "--background": "oklch(0.2 0.06 300)",
      "--foreground": "oklch(0.97 0.02 300)",
      "--card": "oklch(0.27 0.07 300)",
      "--card-foreground": "oklch(0.97 0.02 300)",
      "--popover": "oklch(0.28 0.07 300)",
      "--popover-foreground": "oklch(0.97 0.02 300)",
      "--primary": "oklch(0.7 0.2 305)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.78 0.18 295)",
      "--secondary": "oklch(0.32 0.06 300)",
      "--secondary-foreground": "oklch(0.97 0.02 300)",
      "--muted": "oklch(0.3 0.05 300)",
      "--muted-foreground": "oklch(0.74 0.04 300)",
      "--accent": "oklch(0.36 0.1 305)",
      "--accent-foreground": "oklch(0.93 0.08 305)",
      "--border": "oklch(1 0 0 / 0.08)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.7 0.2 305)",
      "--sidebar": "oklch(0.24 0.06 300)",
      "--sidebar-foreground": "oklch(0.95 0.02 300)",
      "--sidebar-primary": "oklch(0.7 0.2 305)",
      "--sidebar-accent": "oklch(0.34 0.1 305)",
      "--sidebar-border": "oklch(1 0 0 / 0.08)"
    }
  ),
  dark(
    "ocean-cyan",
    "Ocean Cyan",
    "Blue-cyan modern analytics feel.",
    { bg: "#08192A", surface: "#0F2A47", accent: "#22D3EE", text: "#E0F2FE" },
    {
      "--background": "oklch(0.2 0.04 230)",
      "--foreground": "oklch(0.97 0.01 220)",
      "--card": "oklch(0.26 0.05 230)",
      "--card-foreground": "oklch(0.97 0.01 220)",
      "--popover": "oklch(0.27 0.05 230)",
      "--popover-foreground": "oklch(0.97 0.01 220)",
      "--primary": "oklch(0.82 0.15 210)",
      "--primary-foreground": "oklch(0.15 0.03 230)",
      "--primary-glow": "oklch(0.86 0.14 200)",
      "--secondary": "oklch(0.3 0.05 230)",
      "--secondary-foreground": "oklch(0.97 0.01 220)",
      "--muted": "oklch(0.28 0.04 230)",
      "--muted-foreground": "oklch(0.74 0.03 220)",
      "--accent": "oklch(0.34 0.08 210)",
      "--accent-foreground": "oklch(0.92 0.08 210)",
      "--border": "oklch(1 0 0 / 0.07)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.82 0.15 210)",
      "--sidebar": "oklch(0.23 0.04 230)",
      "--sidebar-foreground": "oklch(0.95 0.01 220)",
      "--sidebar-primary": "oklch(0.82 0.15 210)",
      "--sidebar-accent": "oklch(0.32 0.08 210)",
      "--sidebar-border": "oklch(1 0 0 / 0.07)"
    }
  ),
  dark(
    "crimson-dark",
    "Crimson Dark",
    "Black + red premium style.",
    { bg: "#120708", surface: "#1F0E10", accent: "#EF4444", text: "#FEE2E2" },
    {
      "--background": "oklch(0.18 0.02 20)",
      "--foreground": "oklch(0.97 0.01 20)",
      "--card": "oklch(0.23 0.03 20)",
      "--card-foreground": "oklch(0.97 0.01 20)",
      "--popover": "oklch(0.24 0.03 20)",
      "--popover-foreground": "oklch(0.97 0.01 20)",
      "--primary": "oklch(0.66 0.22 27)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.74 0.2 22)",
      "--secondary": "oklch(0.28 0.03 20)",
      "--secondary-foreground": "oklch(0.97 0.01 20)",
      "--muted": "oklch(0.26 0.025 20)",
      "--muted-foreground": "oklch(0.72 0.03 20)",
      "--accent": "oklch(0.32 0.1 25)",
      "--accent-foreground": "oklch(0.92 0.1 25)",
      "--border": "oklch(1 0 0 / 0.07)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.66 0.22 27)",
      "--sidebar": "oklch(0.2 0.025 20)",
      "--sidebar-foreground": "oklch(0.95 0.01 20)",
      "--sidebar-primary": "oklch(0.66 0.22 27)",
      "--sidebar-accent": "oklch(0.3 0.1 25)",
      "--sidebar-border": "oklch(1 0 0 / 0.07)"
    }
  ),
  dark(
    "carbon-gray",
    "Carbon Gray",
    "Minimal gray professional ERP.",
    { bg: "#1C1C1F", surface: "#27272C", accent: "#A1A1AA", text: "#FAFAFA" },
    {
      "--background": "oklch(0.24 0.005 270)",
      "--foreground": "oklch(0.97 0.003 270)",
      "--card": "oklch(0.29 0.006 270)",
      "--card-foreground": "oklch(0.97 0.003 270)",
      "--popover": "oklch(0.3 0.006 270)",
      "--popover-foreground": "oklch(0.97 0.003 270)",
      "--primary": "oklch(0.78 0.01 270)",
      "--primary-foreground": "oklch(0.18 0.005 270)",
      "--primary-glow": "oklch(0.84 0.01 270)",
      "--secondary": "oklch(0.33 0.006 270)",
      "--secondary-foreground": "oklch(0.97 0.003 270)",
      "--muted": "oklch(0.31 0.005 270)",
      "--muted-foreground": "oklch(0.72 0.005 270)",
      "--accent": "oklch(0.36 0.01 270)",
      "--accent-foreground": "oklch(0.95 0.005 270)",
      "--border": "oklch(1 0 0 / 0.07)",
      "--input": "oklch(1 0 0 / 0.09)",
      "--ring": "oklch(0.78 0.01 270)",
      "--sidebar": "oklch(0.26 0.005 270)",
      "--sidebar-foreground": "oklch(0.95 0.003 270)",
      "--sidebar-primary": "oklch(0.78 0.01 270)",
      "--sidebar-accent": "oklch(0.34 0.01 270)",
      "--sidebar-border": "oklch(1 0 0 / 0.07)"
    }
  ),
  dark(
    "neon-dark",
    "Neon Dark",
    "Modern glowing fintech style.",
    { bg: "#080913", surface: "#0F1226", accent: "#39FF88", text: "#E6FFF0" },
    {
      "--background": "oklch(0.17 0.04 270)",
      "--foreground": "oklch(0.97 0.02 150)",
      "--card": "oklch(0.22 0.05 270)",
      "--card-foreground": "oklch(0.97 0.02 150)",
      "--popover": "oklch(0.23 0.05 270)",
      "--popover-foreground": "oklch(0.97 0.02 150)",
      "--primary": "oklch(0.88 0.25 150)",
      "--primary-foreground": "oklch(0.14 0.04 270)",
      "--primary-glow": "oklch(0.85 0.22 165)",
      "--secondary": "oklch(0.27 0.05 270)",
      "--secondary-foreground": "oklch(0.97 0.02 150)",
      "--muted": "oklch(0.25 0.04 270)",
      "--muted-foreground": "oklch(0.74 0.03 200)",
      "--accent": "oklch(0.32 0.12 150)",
      "--accent-foreground": "oklch(0.93 0.16 150)",
      "--border": "oklch(1 0 0 / 0.08)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.88 0.25 150)",
      "--sidebar": "oklch(0.19 0.04 270)",
      "--sidebar-foreground": "oklch(0.95 0.02 150)",
      "--sidebar-primary": "oklch(0.88 0.25 150)",
      "--sidebar-accent": "oklch(0.3 0.12 150)",
      "--sidebar-border": "oklch(1 0 0 / 0.08)"
    }
  ),
  dark(
    "forest-green",
    "Forest Green",
    "Dark natural green accounting theme.",
    { bg: "#0A1A12", surface: "#13291E", accent: "#4ADE80", text: "#E7F8EE" },
    {
      "--background": "oklch(0.2 0.03 155)",
      "--foreground": "oklch(0.97 0.02 150)",
      "--card": "oklch(0.26 0.04 155)",
      "--card-foreground": "oklch(0.97 0.02 150)",
      "--popover": "oklch(0.27 0.04 155)",
      "--popover-foreground": "oklch(0.97 0.02 150)",
      "--primary": "oklch(0.78 0.16 150)",
      "--primary-foreground": "oklch(0.16 0.03 155)",
      "--primary-glow": "oklch(0.82 0.15 145)",
      "--secondary": "oklch(0.3 0.04 155)",
      "--secondary-foreground": "oklch(0.97 0.02 150)",
      "--muted": "oklch(0.28 0.03 155)",
      "--muted-foreground": "oklch(0.74 0.03 150)",
      "--accent": "oklch(0.34 0.08 150)",
      "--accent-foreground": "oklch(0.93 0.1 150)",
      "--border": "oklch(1 0 0 / 0.07)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.78 0.16 150)",
      "--sidebar": "oklch(0.23 0.03 155)",
      "--sidebar-foreground": "oklch(0.95 0.02 150)",
      "--sidebar-primary": "oklch(0.78 0.16 150)",
      "--sidebar-accent": "oklch(0.32 0.08 150)",
      "--sidebar-border": "oklch(1 0 0 / 0.07)"
    }
  ),
  dark(
    "gold-luxury",
    "Gold Luxury",
    "Black + gold premium executive style.",
    { bg: "#0D0B05", surface: "#1A1608", accent: "#D4AF37", text: "#FAF3DC" },
    {
      "--background": "oklch(0.17 0.015 80)",
      "--foreground": "oklch(0.97 0.02 90)",
      "--card": "oklch(0.22 0.02 80)",
      "--card-foreground": "oklch(0.97 0.02 90)",
      "--popover": "oklch(0.23 0.02 80)",
      "--popover-foreground": "oklch(0.97 0.02 90)",
      "--primary": "oklch(0.78 0.13 85)",
      "--primary-foreground": "oklch(0.15 0.02 80)",
      "--primary-glow": "oklch(0.84 0.12 85)",
      "--secondary": "oklch(0.27 0.02 80)",
      "--secondary-foreground": "oklch(0.97 0.02 90)",
      "--muted": "oklch(0.25 0.015 80)",
      "--muted-foreground": "oklch(0.72 0.03 85)",
      "--accent": "oklch(0.32 0.07 85)",
      "--accent-foreground": "oklch(0.92 0.1 85)",
      "--border": "oklch(1 0 0 / 0.08)",
      "--input": "oklch(1 0 0 / 0.1)",
      "--ring": "oklch(0.78 0.13 85)",
      "--sidebar": "oklch(0.19 0.015 80)",
      "--sidebar-foreground": "oklch(0.95 0.02 90)",
      "--sidebar-primary": "oklch(0.78 0.13 85)",
      "--sidebar-accent": "oklch(0.3 0.07 85)",
      "--sidebar-border": "oklch(1 0 0 / 0.08)"
    }
  ),
  light(
    "clean-minimal",
    "Clean Minimal",
    "Ultra-simple modern business UI.",
    { bg: "#FFFFFF", surface: "#F4F4F5", accent: "#111111", text: "#0A0A0A" },
    {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.15 0 0)",
      "--card": "oklch(0.985 0 0)",
      "--card-foreground": "oklch(0.15 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.15 0 0)",
      "--primary": "oklch(0.2 0 0)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.3 0 0)",
      "--secondary": "oklch(0.96 0 0)",
      "--secondary-foreground": "oklch(0.2 0 0)",
      "--muted": "oklch(0.96 0 0)",
      "--muted-foreground": "oklch(0.48 0 0)",
      "--accent": "oklch(0.94 0 0)",
      "--accent-foreground": "oklch(0.2 0 0)",
      "--border": "oklch(0.9 0 0)",
      "--input": "oklch(0.9 0 0)",
      "--ring": "oklch(0.2 0 0)",
      "--sidebar": "oklch(0.99 0 0)",
      "--sidebar-foreground": "oklch(0.2 0 0)",
      "--sidebar-primary": "oklch(0.2 0 0)",
      "--sidebar-accent": "oklch(0.94 0 0)",
      "--sidebar-border": "oklch(0.9 0 0)"
    }
  ),
  light(
    "frosted-light",
    "Frosted Light",
    "Soft transparent light glass theme.",
    { bg: "#EEF2FB", surface: "#FFFFFF", accent: "#0EA5E9", text: "#0F172A" },
    {
      "--background": "oklch(0.96 0.015 240)",
      "--foreground": "oklch(0.2 0.03 250)",
      "--card": "oklch(1 0 0 / 0.75)",
      "--card-foreground": "oklch(0.2 0.03 250)",
      "--popover": "oklch(1 0 0 / 0.9)",
      "--popover-foreground": "oklch(0.2 0.03 250)",
      "--primary": "oklch(0.65 0.16 235)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--primary-glow": "oklch(0.72 0.14 225)",
      "--secondary": "oklch(0.93 0.015 240)",
      "--secondary-foreground": "oklch(0.22 0.03 250)",
      "--muted": "oklch(0.94 0.015 240)",
      "--muted-foreground": "oklch(0.5 0.03 250)",
      "--accent": "oklch(0.92 0.04 235)",
      "--accent-foreground": "oklch(0.25 0.08 235)",
      "--border": "oklch(0.88 0.02 240)",
      "--input": "oklch(0.9 0.015 240)",
      "--ring": "oklch(0.65 0.16 235)",
      "--sidebar": "oklch(0.97 0.012 240 / 0.85)",
      "--sidebar-foreground": "oklch(0.22 0.03 250)",
      "--sidebar-primary": "oklch(0.65 0.16 235)",
      "--sidebar-accent": "oklch(0.92 0.04 235)",
      "--sidebar-border": "oklch(0.88 0.02 240)"
    }
  )
];
const DEFAULT_THEME_ID = "soft-white";
function getTheme(id) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
const DEFAULT_OPTIONS = {
  compact: false,
  rounded: "round",
  glass: true,
  motion: "full"
};
const RADIUS_MAP = {
  sharp: "0.25rem",
  soft: "0.875rem",
  round: "1.5rem"
};
const ThemeCtx = reactExports.createContext({
  theme: "dark",
  toggle: () => {
  },
  themeId: DEFAULT_THEME_ID,
  setThemeId: () => {
  },
  themes: THEMES,
  options: DEFAULT_OPTIONS,
  setOptions: () => {
  },
  resetOptions: () => {
  }
});
const STORAGE_THEME = "theme-id-v1";
const STORAGE_OPTIONS = "theme-options-v1";
const STORAGE_LEGACY = "theme";
function applyTheme(themeId, options) {
  if (typeof document === "undefined") return;
  const def = getTheme(themeId);
  const root = document.documentElement;
  root.classList.toggle("dark", def.mode === "dark");
  for (const [k, v] of Object.entries(def.vars)) {
    root.style.setProperty(k, v);
  }
  root.style.setProperty("--radius", RADIUS_MAP[options.rounded]);
  root.classList.toggle("ui-compact", options.compact);
  root.classList.toggle("ui-no-glass", !options.glass);
  root.classList.remove("motion-off", "motion-subtle", "motion-full");
  root.classList.add(`motion-${options.motion}`);
  root.style.setProperty("transition", "background-color 250ms ease, color 250ms ease");
}
function ThemeProvider({ children }) {
  const themeId = DEFAULT_THEME_ID;
  const options = DEFAULT_OPTIONS;
  reactExports.useEffect(() => {
    applyTheme(themeId, options);
    try {
      localStorage.removeItem(STORAGE_THEME);
      localStorage.removeItem(STORAGE_OPTIONS);
      localStorage.removeItem(STORAGE_LEGACY);
    } catch {
    }
  }, []);
  const value = reactExports.useMemo(() => ({
    theme: "light",
    toggle: () => {
    },
    themeId,
    setThemeId: () => {
    },
    themes: THEMES,
    options,
    setOptions: () => {
    },
    resetOptions: () => {
    }
  }), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCtx.Provider, { value, children });
}
const useTheme = () => reactExports.useContext(ThemeCtx);
const STORAGE_KEY$1 = "app-lang-v1";
const LANGUAGES = [
  { code: "en", native: "English", english: "English", dir: "ltr" },
  { code: "bn", native: "বাংলা", english: "Bangla", dir: "ltr" },
  { code: "ar", native: "العربية", english: "Arabic", dir: "rtl" }
];
const en = {
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
  "settings.noMatch": 'No settings match "{query}".',
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
  "security.note": "All data access is protected by row-level security on the server."
};
const bn = {
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
  "settings.noMatch": '"{query}" এর সাথে মিল নেই।',
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
  "security.note": "সার্ভারে রো-লেভেল সিকিউরিটি দিয়ে সব ডেটা সুরক্ষিত।"
};
const ar = {
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
  "settings.noMatch": 'لا توجد نتائج لـ "{query}".',
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
  "security.note": "كل وصول للبيانات محمي بسياسات الأمان على الصفوف."
};
const dictionaries = { en, bn, ar };
const I18nCtx = reactExports.createContext({
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
function I18nProvider({ children }) {
  const [lang, setLangState] = reactExports.useState("en");
  const [hydrated, setHydrated] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY$1);
      if (s && (s === "en" || s === "bn" || s === "ar")) setLangState(s);
    } catch {
    }
    setHydrated(true);
  }, []);
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = LANGUAGES.find((l) => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY$1, lang);
      } catch {
      }
    }
  }, [lang, hydrated]);
  const value = reactExports.useMemo(() => {
    const meta = LANGUAGES.find((l) => l.code === lang);
    return {
      lang,
      dir: meta.dir,
      setLang: setLangState,
      t: (key, vars) => {
        const s = dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
        return interpolate(s, vars);
      }
    };
  }, [lang]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(I18nCtx.Provider, { value, children });
}
const useT = () => reactExports.useContext(I18nCtx).t;
const AuthCtx = reactExports.createContext({ user: null, session: null, loading: true, signOut: async () => {
} });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthCtx.Provider,
    {
      value: {
        user: session?.user ?? null,
        session,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        }
      },
      children
    }
  );
}
const useAuth = () => reactExports.useContext(AuthCtx);
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-110",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const stack = [];
let initialized$1 = false;
let suppressNextPop = false;
function ensureInit() {
  if (initialized$1 || typeof window === "undefined") return;
  initialized$1 = true;
  window.addEventListener("popstate", () => {
    if (suppressNextPop) {
      suppressNextPop = false;
      return;
    }
    const top = stack.pop();
    if (top) {
      top.fromPop = true;
      try {
        top.close();
      } catch {
      }
    }
  });
}
let nextId = 1;
function useBackClose(open, onOpenChange) {
  const onOpenChangeRef = reactExports.useRef(onOpenChange);
  reactExports.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);
  reactExports.useEffect(() => {
    if (!open || !onOpenChange || typeof window === "undefined") return;
    ensureInit();
    const entry = {
      id: nextId++,
      fromPop: false,
      close: () => onOpenChangeRef.current?.(false)
    };
    stack.push(entry);
    try {
      window.history.pushState({ __overlayId: entry.id }, "");
    } catch {
    }
    return () => {
      const idx = stack.indexOf(entry);
      if (idx >= 0) stack.splice(idx, 1);
      if (!entry.fromPop) {
        const id = entry.id;
        setTimeout(() => {
          const state = window.history.state;
          if (state && state.__overlayId === id) {
            try {
              suppressNextPop = true;
              window.history.back();
            } catch {
              suppressNextPop = false;
            }
          }
        }, 0);
      }
    };
  }, [open]);
}
const AlertDialog = ({
  open,
  onOpenChange,
  ...props
}) => {
  useBackClose(open, onOpenChange);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { open, onOpenChange, ...props });
};
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const ConfirmContext = reactExports.createContext(null);
const TONE_STYLES = {
  danger: {
    iconWrap: "bg-red-500/10 ring-1 ring-red-500/20",
    icon: "text-red-500",
    btn: "bg-gradient-to-b from-red-500 to-red-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.5)]",
    badge: "bg-red-500/10 text-red-500 ring-1 ring-red-500/20"
  },
  warning: {
    iconWrap: "bg-orange-500/10 ring-1 ring-orange-500/20",
    icon: "text-orange-500",
    btn: "bg-gradient-to-b from-orange-500 to-orange-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(249,115,22,0.5)]",
    badge: "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
  },
  safe: {
    iconWrap: "bg-emerald-500/10 ring-1 ring-emerald-500/20",
    icon: "text-emerald-500",
    btn: "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20"
  },
  destroy: {
    iconWrap: "bg-red-600/15 ring-1 ring-red-600/30",
    icon: "text-red-600",
    btn: "bg-gradient-to-b from-red-600 to-red-700 text-white hover:brightness-110 shadow-[0_8px_28px_-6px_rgba(220,38,38,0.6)]",
    badge: "bg-red-600/10 text-red-600 ring-1 ring-red-600/30"
  }
};
function pickIcon(opts) {
  const key = opts.icon ?? (opts.tone === "safe" ? "restore" : opts.tone === "warning" ? "warning" : opts.tone === "destroy" ? "shield" : "trash");
  switch (key) {
    case "restore":
      return RotateCcw;
    case "warning":
      return TriangleAlert;
    case "recycle":
      return Recycle;
    case "shield":
      return ShieldAlert;
    default:
      return Trash2;
  }
}
function ConfirmProvider({ children }) {
  const [open, setOpen] = reactExports.useState(false);
  const [opts, setOpts] = reactExports.useState({});
  const resolver = reactExports.useRef(null);
  const confirm = reactExports.useCallback((input) => {
    const next = typeof input === "string" ? { description: input } : input;
    setOpts(next);
    setOpen(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);
  const finish = (v) => {
    setOpen(false);
    resolver.current?.(v);
    resolver.current = null;
  };
  const tone = opts.tone ?? "danger";
  const t = TONE_STYLES[tone];
  const Icon = pickIcon(opts);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfirmContext.Provider, { value: confirm, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange: (o) => {
      if (!o) finish(false);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      AlertDialogContent,
      {
        className: cn(
          "max-w-[min(92vw,420px)] gap-0 overflow-hidden border-border/40 bg-background/95 p-0 backdrop-blur-xl",
          "rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)]",
          "animate-in fade-in-0 zoom-in-95 duration-150"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center px-6 pb-2 pt-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mb-3 flex h-12 w-12 items-center justify-center rounded-full", t.iconWrap), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-6 w-6", t.icon) }) }),
            opts.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide", t.badge), children: opts.badge }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { className: "space-y-1.5 text-center sm:text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-[17px] font-semibold leading-tight", children: opts.title ?? (tone === "safe" ? "Confirm action" : tone === "destroy" ? "Delete permanently?" : "Are you sure?") }),
              opts.description && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-[13px] leading-relaxed text-muted-foreground", children: opts.description })
            ] })
          ] }),
          opts.details && opts.details.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-5 mb-3 mt-1 overflow-hidden rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "divide-y divide-border/40", children: opts.details.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-3 py-2 text-[12px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "shrink-0 text-muted-foreground", children: d.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "min-w-0 truncate text-right font-medium text-foreground", children: d.value })
          ] }, i)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-row gap-2 border-t border-border/40 bg-muted/30 p-3 sm:flex-row sm:justify-stretch sm:space-x-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "m-0 h-11 flex-1 rounded-xl", children: opts.cancelText ?? "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: () => finish(true),
                className: cn("m-0 h-11 flex-1 rounded-xl border-0 font-semibold transition-transform active:scale-[0.97]", t.btn),
                children: opts.confirmText ?? (tone === "safe" ? "Confirm" : tone === "destroy" ? "Delete forever" : "Delete")
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function useConfirm() {
  const ctx = reactExports.useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
let initialized = false;
async function saveToken(token) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notification_tokens").upsert(
    {
      user_id: user.id,
      token,
      platform: Capacitor.getPlatform(),
      device_info: { ua: typeof navigator !== "undefined" ? navigator.userAgent : null },
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    { onConflict: "token" }
  );
}
async function initPushNotifications() {
  if (initialized) return;
  if (!Capacitor.isNativePlatform()) return;
  initialized = true;
  try {
    await LocalNotifications.requestPermissions();
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
      perm = await PushNotifications.requestPermissions();
    }
    if (perm.receive !== "granted") return;
    await PushNotifications.register();
    PushNotifications.addListener("registration", async (token) => {
      try {
        await saveToken(token.value);
      } catch (e) {
        console.error("Failed to save FCM token", e);
      }
    });
    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error", err);
    });
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        try {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: Math.floor(Math.random() * 2e9),
                title: notification.title ?? "Notification",
                body: notification.body ?? "",
                extra: notification.data
              }
            ]
          });
        } catch (e) {
          console.error("Local notif schedule failed", e);
        }
      }
    );
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        const url = action.notification.data?.url;
        if (url && typeof window !== "undefined") {
          window.location.href = url;
        }
      }
    );
  } catch (e) {
    console.error("initPushNotifications failed", e);
  }
}
const InvoiceShareHost = reactExports.lazy(() => import("./invoice-share-host-CId9ZXA8.mjs").then((m) => ({ default: m.InvoiceShareHost })));
const InvoiceA4ShareHost = reactExports.lazy(() => import("./invoice-a4-share-host-ChglP3zh.mjs").then((m) => ({ default: m.InvoiceA4ShareHost })));
const InvoiceV2Host = reactExports.lazy(() => import("./invoice-v2-host-D7g9fT04.mjs").then((m) => ({ default: m.InvoiceV2Host })));
const InvoiceAm80Host = reactExports.lazy(() => import("./host-CF7VLLys.mjs").then((m) => ({ default: m.InvoiceAm80Host })));
const SalesReturnInvoiceHost = reactExports.lazy(() => import("./host-DxdnhoYf.mjs").then((m) => ({ default: m.SalesReturnInvoiceHost })));
const THERMAL_EVENT = "lovable:invoice-share";
const A4_EVENT = "lovable:invoice-a4-share";
const V2_EVENT = "lovable:invoice-v2";
const AM80_EVENT = "lovable:invoice-am80";
const SRI_EVENT = "lovable:sales-return-invoice";
function InvoiceHostsBridge() {
  const [loadThermal, setLoadThermal] = reactExports.useState(false);
  const [loadA4, setLoadA4] = reactExports.useState(false);
  const [loadV2, setLoadV2] = reactExports.useState(false);
  const [loadAm80, setLoadAm80] = reactExports.useState(false);
  const [loadSri, setLoadSri] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const armed = { thermal: false, a4: false, v2: false, am80: false, sri: false };
    const make = (key, setter, eventName) => (e) => {
      const detail = e.detail;
      if (!armed[key]) {
        armed[key] = true;
        setter(true);
        const replay = () => window.dispatchEvent(new CustomEvent(eventName, { detail }));
        setTimeout(replay, 80);
        setTimeout(replay, 250);
        setTimeout(replay, 600);
      }
    };
    const t = make("thermal", setLoadThermal, THERMAL_EVENT);
    const a = make("a4", setLoadA4, A4_EVENT);
    const v = make("v2", setLoadV2, V2_EVENT);
    const m = make("am80", setLoadAm80, AM80_EVENT);
    const s = make("sri", setLoadSri, SRI_EVENT);
    window.addEventListener(THERMAL_EVENT, t);
    window.addEventListener(A4_EVENT, a);
    window.addEventListener(V2_EVENT, v);
    window.addEventListener(AM80_EVENT, m);
    window.addEventListener(SRI_EVENT, s);
    return () => {
      window.removeEventListener(THERMAL_EVENT, t);
      window.removeEventListener(A4_EVENT, a);
      window.removeEventListener(V2_EVENT, v);
      window.removeEventListener(AM80_EVENT, m);
      window.removeEventListener(SRI_EVENT, s);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, { fallback: null, children: [
    loadThermal && /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceShareHost, {}),
    loadA4 && /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceA4ShareHost, {}),
    loadV2 && /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceV2Host, {}),
    loadAm80 && /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceAm80Host, {}),
    loadSri && /* @__PURE__ */ jsxRuntimeExports.jsx(SalesReturnInvoiceHost, {})
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Page not found." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground", children: "Go home" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Try again"
      }
    )
  ] }) });
}
const Route$E = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0b0b10" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "ShRiAh ERP" },
      { name: "mobile-web-app-capable", content: "yes" },
      { title: "ShRiAh Group — Finance & Warehouse" },
      { name: "description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { property: "og:title", content: "ShRiAh Group — Finance & Warehouse" },
      { name: "twitter:title", content: "ShRiAh Group — Finance & Warehouse" },
      { property: "og:description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { name: "twitter:description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ee260a05-2ec1-4bac-80ce-e2f5bf4e2315/id-preview-b2b13fec--f7979160-307f-4af8-9e51-6bc04fb421b3.lovable.app-1779027285674.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ee260a05-2ec1-4bac-80ce-e2f5bf4e2315/id-preview-b2b13fec--f7979160-307f-4af8-9e51-6bc04fb421b3.lovable.app-1779027285674.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Roboto:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;700;900&family=Noto+Naskh+Arabic:wght@400;500;700&family=Cairo:wght@400;500;700;900&family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "min-h-screen bg-background text-foreground antialiased", children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$E.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        if (event === "INITIAL_SESSION") void initPushNotifications();
        return;
      }
      if (event === "SIGNED_OUT") {
        queryClient.clear();
      } else {
        if (event === "SIGNED_IN") void initPushNotifications();
        queryClient.invalidateQueries({ refetchType: "inactive" });
      }
      router2.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(I18nProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ConfirmProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceHostsBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) }) }) }) });
}
const $$splitComponentImporter$x = () => import("./store-B4AYqvC0.mjs");
const Route$D = createFileRoute("/store")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component"),
  head: () => ({
    meta: [{
      title: "Order Online — ShRiAh Group"
    }, {
      name: "description",
      content: "Browse products and place your order in seconds. Fast, simple, mobile-first ordering in English, Bangla and Arabic."
    }, {
      property: "og:title",
      content: "Order Online — ShRiAh Group"
    }, {
      property: "og:description",
      content: "Browse products and place your order in seconds."
    }]
  })
});
const $$splitComponentImporter$w = () => import("./login-BiEyhKRl.mjs");
const Route$C = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("../_app-DHJb4Z-8.mjs");
const Route$B = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./index-CqBExDbK.mjs");
const Route$A = createFileRoute("/_app/")({
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./website-banners-B0zx10ql.mjs");
const Route$z = createFileRoute("/_app/website-banners")({
  component: lazyRouteComponent($$splitComponentImporter$t, "component"),
  head: () => ({
    meta: [{
      title: "Website Banners · Store Admin"
    }, {
      name: "description",
      content: "Manage multiple banners shown on the customer website."
    }]
  })
});
const $$splitComponentImporter$s = () => import("./team-C97nMSAD.mjs");
const Route$y = createFileRoute("/_app/team")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./summary-DFLWhN5o.mjs");
const Route$x = createFileRoute("/_app/summary")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn(
        "rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm",
        "bg-gradient-to-b from-card to-card/95 dark:from-card dark:to-card/90",
        "transition-shadow",
        className
      ),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Tabs = Root2$1;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const Dialog = ({
  open,
  onOpenChange,
  ...props
}) => {
  useBackClose(open, onOpenChange);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog$1, { open, onOpenChange, ...props });
};
const DialogTrigger = DialogTrigger$1;
const DialogPortal = DialogPortal$1;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 md:bg-black/60 md:backdrop-blur-sm",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogOverlay$1.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-1rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-md sm:rounded-lg md:max-w-[700px] md:rounded-2xl md:shadow-2xl",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogContent$1.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogTitle$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogDescription$1.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
async function fetchCustomerBalance(customerId) {
  const { data, error } = await supabase.rpc("pos_customer_balance", { _customer_id: customerId });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return {
    opening: Number(row?.opening ?? 0),
    total_sales: Number(row?.total_sales ?? 0),
    total_paid: Number(row?.total_paid ?? 0),
    current_due: Number(row?.current_due ?? 0)
  };
}
async function fetchCustomerVatForSale(opts) {
  try {
    if (opts.customer_id) {
      const { data } = await supabase.from("pos_customers").select("vat_number").eq("id", opts.customer_id).maybeSingle();
      const v = data?.vat_number?.toString().trim();
      if (v) return v;
    }
    const phone = opts.customer_mobile?.toString().trim();
    if (phone) {
      const { data } = await supabase.from("pos_customers").select("vat_number").eq("phone", phone).limit(1);
      const v = data?.[0]?.vat_number?.toString().trim();
      if (v) return v;
    }
  } catch {
  }
  return null;
}
function norm(s) {
  return (s || "").toString().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
}
function fuzzyScore(hay, q) {
  const h = norm(hay);
  const tokens = norm(q).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;
  let score = 0;
  for (const t of tokens) {
    if (!h.includes(t)) return -1;
    if (h.startsWith(t)) score += 3;
    else score += 1;
  }
  return score;
}
const posLedger = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fetchCustomerBalance,
  fetchCustomerVatForSale,
  fuzzyScore,
  norm
}, Symbol.toStringTag, { value: "Module" }));
const POS_CUSTOMER_QUERY_KEY = ["pos-customers"];
const POS_CUSTOMER_COLS = "id,name,phone,alias,opening_due,is_active,is_deleted,notes,created_at";
async function fetchWholesaleCustomers() {
  const { data, error } = await supabase.from("pos_customers").select(POS_CUSTOMER_COLS).eq("is_active", true).eq("is_deleted", false).order("name");
  if (error) throw error;
  return data ?? [];
}
const CUSTOMER_ROW_HEIGHT = 96;
const CUSTOMER_OVERSCAN = 7;
function formatDue(amount) {
  return `SAR ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}`;
}
function PosCustomerPickerImpl({ value, onChange, showDue, dueByCustomer }) {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [creating, setCreating] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newPhone, setNewPhone] = reactExports.useState("");
  const [newOpening, setNewOpening] = reactExports.useState("");
  const scrollRef = reactExports.useRef(null);
  const [scrollTop, setScrollTop] = reactExports.useState(0);
  const [viewportHeight, setViewportHeight] = reactExports.useState(440);
  const customers = useQuery({
    queryKey: POS_CUSTOMER_QUERY_KEY,
    enabled: open,
    staleTime: 6e4,
    gcTime: 5 * 6e4,
    queryFn: fetchWholesaleCustomers
  });
  const deferredQ = reactExports.useDeferredValue(q);
  const filtered = reactExports.useMemo(() => {
    const list = customers.data ?? [];
    const term = deferredQ.trim();
    if (!term) return list;
    const out = [];
    for (const c of list) {
      const s = Math.max(
        fuzzyScore(c.name, term),
        fuzzyScore(c.phone ?? "", term),
        fuzzyScore(c.alias ?? "", term)
      );
      if (s >= 0) out.push({ c, s });
    }
    out.sort((a, b) => b.s - a.s);
    return out.map((x) => x.c);
  }, [customers.data, deferredQ]);
  reactExports.useEffect(() => {
    if (!open) return;
    const node = scrollRef.current;
    if (!node) return;
    setViewportHeight(node.clientHeight || 440);
    setScrollTop(0);
    node.scrollTop = 0;
  }, [open, deferredQ]);
  const virtualRows = reactExports.useMemo(() => {
    const total = filtered.length;
    const start = Math.max(0, Math.floor(scrollTop / CUSTOMER_ROW_HEIGHT) - CUSTOMER_OVERSCAN);
    const visibleCount = Math.ceil(viewportHeight / CUSTOMER_ROW_HEIGHT) + CUSTOMER_OVERSCAN * 2;
    const end = Math.min(total, start + visibleCount);
    return {
      totalHeight: total * CUSTOMER_ROW_HEIGHT,
      offsetY: start * CUSTOMER_ROW_HEIGHT,
      items: filtered.slice(start, end)
    };
  }, [filtered, scrollTop, viewportHeight]);
  const createCustomer = reactExports.useCallback(async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Name required");
      return;
    }
    const opening = Number(newOpening) || 0;
    const { data, error } = await supabase.from("pos_customers").insert({ name, phone: newPhone.trim() || null, opening_due: opening }).select(POS_CUSTOMER_COLS).single();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Customer added");
    qc.invalidateQueries({ queryKey: POS_CUSTOMER_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
    onChange(data);
    setCreating(false);
    setNewName("");
    setNewPhone("");
    setNewOpening("");
    setOpen(false);
  }, [newName, newPhone, newOpening, qc, onChange]);
  const handleClose = reactExports.useCallback(() => setOpen(false), []);
  const handleClear = reactExports.useCallback(() => onChange(null), [onChange]);
  const handleOpen = reactExports.useCallback(() => setOpen(true), []);
  const handleStartCreate = reactExports.useCallback(() => {
    setNewName(q);
    setCreating(true);
  }, [q]);
  const currentDue = value ? dueByCustomer?.get(value.id) ?? Number(value.opening_due ?? 0) : null;
  const totalCustomers = customers.data?.length ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2.5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold leading-tight", children: value.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground", children: [
          value.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
            value.phone
          ] }),
          value.alias && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
            value.alias
          ] }),
          showDue && currentDue != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: cn(
                "h-5 px-1.5 text-[10px] font-bold",
                currentDue > 0 ? "border-rose-500/40 bg-rose-500/10 text-rose-600" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              ),
              children: [
                "Due: ",
                formatDue(currentDue)
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleClear, className: "rounded-md p-1 text-muted-foreground hover:bg-muted", "aria-label": "Clear", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleOpen, className: "rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:bg-muted", children: "Change" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleOpen,
        className: "flex w-full items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 px-3 py-3 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: "Pick a customer…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "Optional" })
        ]
      }
    ),
    open && typeof document !== "undefined" && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto fixed inset-0 z-[100] flex items-stretch justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4", onClick: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "pointer-events-auto flex h-[100dvh] w-full flex-col overflow-hidden border border-border/70 bg-background shadow-2xl sm:h-[90dvh] sm:max-w-lg sm:rounded-[1.75rem]",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 border-b border-border/70 bg-background/95 px-4 pb-3 pt-4 shadow-sm backdrop-blur", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold leading-none", children: "Pick Customer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] font-medium text-muted-foreground", children: customers.isLoading ? "Loading customers…" : `${filtered.length} of ${totalCustomers} customers` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleClose, className: "rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted", "aria-label": "Close customer picker", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: q,
                    onChange: (e) => setQ(e.target.value),
                    placeholder: "Search by name, mobile, or code…",
                    type: "text",
                    inputMode: "text",
                    className: "h-11 rounded-2xl border-border/70 bg-muted/30 pl-9 pr-3 text-sm shadow-inner focus-visible:ring-2",
                    autoComplete: "off"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: scrollRef,
                className: "flex-1 overflow-y-auto bg-muted/20 px-2 py-2 overscroll-contain",
                onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
                children: creating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-2xl border border-border bg-card p-3 shadow-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase text-muted-foreground", children: "New Customer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Customer name *", value: newName, onChange: (e) => setNewName(e.target.value), className: "h-11 rounded-xl" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Phone", value: newPhone, onChange: (e) => setNewPhone(e.target.value), inputMode: "tel", className: "h-11 rounded-xl" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Opening due (SAR)", value: newOpening, onChange: (e) => setNewOpening(e.target.value), type: "number", inputMode: "decimal", className: "h-11 rounded-xl" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-10 flex-1 rounded-xl", onClick: () => setCreating(false), children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-10 flex-1 rounded-xl", onClick: createCustomer, children: "Save customer" })
                  ] })
                ] }) : customers.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                  " Loading customers…"
                ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No matches" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "rounded-xl", onClick: handleStartCreate, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-1 h-4 w-4" }),
                    ' Add "',
                    q || "new customer",
                    '"'
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: virtualRows.totalHeight, position: "relative" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: `translateY(${virtualRows.offsetY}px)` }, children: virtualRows.items.map((c) => {
                    const due = dueByCustomer?.get(c.id) ?? (Number(c.opening_due) || 0);
                    const isSelected = value?.id === c.id;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 py-1", style: { height: CUSTOMER_ROW_HEIGHT }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          onChange(c);
                          setOpen(false);
                          setQ("");
                        },
                        className: cn(
                          "flex h-full w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-sm transition-colors active:scale-[0.99]",
                          isSelected ? "border-emerald-500/70 bg-emerald-500/10 shadow-md" : "border-border/70 hover:border-primary/40 hover:bg-background"
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                            "flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-sm font-black shadow-inner",
                            isSelected ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                          ), children: isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }) : c.name?.charAt(0).toUpperCase() ?? "?" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[15px] font-bold leading-tight", children: c.name }),
                              c.alias && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground", children: c.alias })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 flex items-center gap-1 truncate text-[12px] text-muted-foreground", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
                              " ",
                              c.phone || "No mobile"
                            ] }),
                            c.alias && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
                              " Code: ",
                              c.alias
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                            "shrink-0 rounded-2xl border px-2.5 py-1.5 text-right shadow-sm",
                            due > 0 ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          ), children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1 text-[9px] font-bold uppercase tracking-wide opacity-80", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3" }),
                              " Due"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-black tabular-nums", children: formatDue(due) })
                          ] })
                        ]
                      }
                    ) }, c.id);
                  }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 pb-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10 w-full rounded-2xl bg-background shadow-sm", onClick: handleStartCreate, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-1 h-4 w-4" }),
                    " Add new customer"
                  ] }) })
                ] })
              }
            )
          ]
        }
      ) }),
      document.body
    )
  ] });
}
const PosCustomerPicker = reactExports.memo(PosCustomerPickerImpl);
function usePosDueMap(enabled = true) {
  return useQuery({
    queryKey: ["pos-customer-due-map"],
    enabled,
    staleTime: 3e4,
    queryFn: async () => {
      const [custRes, salesRes, payRes] = await Promise.all([
        supabase.from("pos_customers").select("id,opening_due").eq("is_active", true).eq("is_deleted", false),
        supabase.from("shop_sales").select("customer_id,due_amount,status").not("customer_id", "is", null).eq("is_deleted", false),
        supabase.from("pos_payments").select("customer_id,amount,kind")
      ]);
      if (custRes.error) throw custRes.error;
      if (salesRes.error) throw salesRes.error;
      if (payRes.error) throw payRes.error;
      const map = /* @__PURE__ */ new Map();
      for (const c of custRes.data ?? []) map.set(c.id, Number(c.opening_due ?? 0));
      for (const s of salesRes.data ?? []) {
        if (!s.customer_id) continue;
        if (s.status === "cancelled") continue;
        map.set(s.customer_id, (map.get(s.customer_id) ?? 0) + Number(s.due_amount ?? 0));
      }
      for (const p of payRes.data ?? []) {
        if (!p.customer_id) continue;
        if (p.kind !== "payment_in") continue;
        map.set(p.customer_id, (map.get(p.customer_id) ?? 0) - Number(p.amount ?? 0));
      }
      return map;
    }
  });
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const TableEnum = enumType(["transactions", "shop_entries", "warehouse_ledger", "warehouse_items", "ai_scans", "categories", "sub_categories", "parties", "cashiers", "shops", "employees", "employee_entries", "shop_sales", "shop_purchases", "shop_orders", "shop_products", "pos_customers", "company_transactions"]);
const softDeleteRecord = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  table: TableEnum,
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("aacf05a2cebdac8139b2c754498bdb45d285ad701b945d231d6b86e421b9d6d2"));
const restoreRecord = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  table: TableEnum,
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("f6008fb268cb9e2c65b3f529deb104377b2748eb3b3858ba195d74268a921e4f"));
const SAR = (n) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 2
  }).format(v || 0);
};
const SAR_WHOLE = (n) => {
  const v = typeof n === "string" ? parseFloat(n) : n ?? 0;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0
  }).format(Math.round(v || 0));
};
const TXN_LABELS = {
  cash_in: "Cash In",
  cash_out: "Cash Out",
  bank_withdraw: "Bank Withdraw",
  purchase: "Warehouse Purchase",
  expense: "Expense",
  supervisor_payment: "Supervisor Payment",
  adjustment: "Adjustment"
};
function useProfileMap() {
  const { data = {} } = useQuery({
    queryKey: ["profile-map-all"],
    queryFn: async () => {
      const { data: data2 } = await supabase.from("profiles").select("id,full_name,email,username");
      const map = {};
      (data2 ?? []).forEach((p) => {
        map[p.id] = p;
      });
      return map;
    },
    staleTime: 5 * 6e4
  });
  return data;
}
function displayProfile(p) {
  if (!p) return "Unknown";
  return p.full_name || p.username || (p.email ? p.email.split("@")[0] : null) || p.id.slice(0, 6);
}
const Drawer = ({
  shouldScaleBackground = true,
  open,
  onOpenChange,
  ...props
}) => {
  useBackClose(open, onOpenChange);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Drawer$1.Root,
    {
      shouldScaleBackground,
      open,
      onOpenChange,
      ...props
    }
  );
};
Drawer.displayName = "Drawer";
const DrawerPortal = Drawer$1.Portal;
const DrawerOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Drawer$1.Overlay,
  {
    ref,
    className: cn("fixed inset-0 z-50 bg-black/80", className),
    ...props
  }
));
DrawerOverlay.displayName = Drawer$1.Overlay.displayName;
const DrawerContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Drawer$1.Content,
    {
      ref,
      className: cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }),
        children
      ]
    }
  )
] }));
DrawerContent.displayName = "DrawerContent";
const DrawerHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid gap-1.5 p-4 text-center sm:text-left", className), ...props });
DrawerHeader.displayName = "DrawerHeader";
const DrawerTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Drawer$1.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DrawerTitle.displayName = Drawer$1.Title.displayName;
const DrawerDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Drawer$1.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DrawerDescription.displayName = Drawer$1.Description.displayName;
const SCANNER_FORMATS = [
  "EAN_13",
  "EAN_8",
  "UPC_A",
  "UPC_E",
  "CODE_128",
  "CODE_39"
];
function normalizeBarcode(code) {
  return (code || "").replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, "").trim();
}
function isProductBarcode(code) {
  const v = normalizeBarcode(code);
  if (!v) return false;
  if (/^https?:\/\//i.test(v)) return false;
  if (/[\/\?#=\s]/.test(v)) return false;
  if (!/^[0-9A-Za-z\-_.$+%]+$/.test(v)) return false;
  if (v.length < 6 || v.length > 32) return false;
  return true;
}
let beepCtx = null;
function beep() {
  try {
    beepCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = beepCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
    }, 90);
  } catch {
  }
}
function BarcodeScanner({
  open,
  onOpenChange,
  onDetected,
  lookupProduct,
  onProductScanned,
  onNotFound,
  mode = "continuous",
  title = "Scan barcode",
  statusBadge,
  cartPreview
}) {
  const videoRef = reactExports.useRef(null);
  const controlsRef = reactExports.useRef(null);
  const lastCodeRef = reactExports.useRef({ code: "", at: 0 });
  const lockUntilRef = reactExports.useRef(0);
  const candidateRef = reactExports.useRef({ code: "", count: 0, firstAt: 0 });
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [torchOn, setTorchOn] = reactExports.useState(false);
  const [torchSupported, setTorchSupported] = reactExports.useState(false);
  const [manual, setManual] = reactExports.useState("");
  const [showManual, setShowManual] = reactExports.useState(false);
  const [flash, setFlash] = reactExports.useState(false);
  const [frozen, setFrozen] = reactExports.useState(false);
  const [cartExpanded, setCartExpanded] = reactExports.useState(true);
  const streamRef = reactExports.useRef(null);
  const handleHit = async (code) => {
    const clean = normalizeBarcode(code);
    if (!clean) return;
    if (!isProductBarcode(clean)) return;
    const now = Date.now();
    if (now < lockUntilRef.current) return;
    if (lastCodeRef.current.code === clean && now - lastCodeRef.current.at < 1e3) return;
    lastCodeRef.current = { code: clean, at: now };
    lockUntilRef.current = now + 800;
    console.debug("[barcode-scan]", { scanned: code, normalized: clean, at: now });
    let matched = true;
    if (lookupProduct) {
      const product = await lookupProduct(clean);
      if (!product) {
        matched = false;
        onNotFound?.(clean);
      } else {
        onProductScanned?.(product, clean);
      }
    } else {
      await onDetected?.(clean);
    }
    if (matched) {
      try {
        navigator.vibrate?.(60);
      } catch {
      }
      beep();
      setFlash(true);
      setFrozen(true);
      setTimeout(() => setFlash(false), 250);
      setTimeout(() => setFrozen(false), 800);
    }
    if (mode === "single" && matched) onOpenChange(false);
  };
  reactExports.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    setLoading(true);
    setTorchOn(false);
    setTorchSupported(false);
    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("../_libs/zxing__browser.mjs");
        const { DecodeHintType, BarcodeFormat } = await import("../_libs/zxing__library.mjs");
        const allowedFormats = SCANNER_FORMATS.map((f) => BarcodeFormat[f]).filter((v) => v !== void 0);
        const allowedSet = new Set(allowedFormats);
        const hints = /* @__PURE__ */ new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, allowedFormats);
        hints.set(DecodeHintType.TRY_HARDER, true);
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 120 });
        const devices = await BrowserMultiFormatReader.listVideoInputDevices().catch(() => []);
        const back = devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[devices.length - 1];
        const videoBase = {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        };
        const constraints = back?.deviceId ? { video: { ...videoBase, deviceId: { exact: back.deviceId } }, audio: false } : { video: videoBase, audio: false };
        if (cancelled) return;
        if (!videoRef.current) return;
        const controls = await reader.decodeFromConstraints(constraints, videoRef.current, (result) => {
          if (!result) return;
          const fmt = result.getBarcodeFormat?.();
          if (fmt != null && !allowedSet.has(fmt)) return;
          try {
            const pts = result.getResultPoints?.();
            const video = videoRef.current;
            const vw = video?.videoWidth ?? 0;
            const vh = video?.videoHeight ?? 0;
            if (pts && pts.length && vw > 0 && vh > 0) {
              const cx = vw / 2, cy = vh / 2;
              const mx = pts.reduce((s, p) => s + p.getX(), 0) / pts.length;
              const my = pts.reduce((s, p) => s + p.getY(), 0) / pts.length;
              if (Math.abs(mx - cx) > vw * 0.275) return;
              if (Math.abs(my - cy) > vh * 0.325) return;
            }
          } catch {
          }
          const text = result.getText();
          const now = Date.now();
          const cand = candidateRef.current;
          if (cand.code === text && now - cand.firstAt < 500) {
            cand.count += 1;
          } else {
            candidateRef.current = { code: text, count: 1, firstAt: now };
            return;
          }
          if (cand.count < 2) return;
          candidateRef.current = { code: "", count: 0, firstAt: 0 };
          handleHit(text);
        });
        if (cancelled) {
          controls.stop();
          return;
        }
        controlsRef.current = controls;
        streamRef.current = videoRef.current.srcObject ?? null;
        try {
          await videoRef.current.play?.();
        } catch {
        }
        try {
          const track = streamRef.current?.getVideoTracks?.()[0];
          const caps = track?.getCapabilities?.() ?? {};
          if (caps && "torch" in caps) setTorchSupported(true);
          const advanced = [];
          if (caps?.focusMode?.includes?.("continuous")) advanced.push({ focusMode: "continuous" });
          if (caps?.zoom) {
            const target = Math.min(caps.zoom.max ?? 1, Math.max(caps.zoom.min ?? 1, 1.8));
            if (target > (caps.zoom.min ?? 1)) advanced.push({ zoom: target });
          }
          if (advanced.length) await track?.applyConstraints({ advanced }).catch(() => {
          });
        } catch {
        }
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        const name = e?.name ?? "";
        const msg = name === "NotAllowedError" ? "Camera permission denied. Enable it in browser settings or use manual entry." : name === "NotFoundError" ? "No camera found. Use manual entry below." : e?.message ?? "Failed to start camera.";
        setError(msg);
        setLoading(false);
        setShowManual(true);
      }
    })();
    return () => {
      cancelled = true;
      try {
        controlsRef.current?.stop();
      } catch {
      }
      controlsRef.current = null;
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {
      }
      streamRef.current = null;
    };
  }, [open]);
  async function toggleTorch() {
    try {
      const track = streamRef.current?.getVideoTracks?.()[0];
      if (!track) return;
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch {
      setTorchSupported(false);
    }
  }
  function submitManual() {
    const v = manual.trim();
    if (!v) return;
    setManual("");
    handleHit(v);
  }
  const overlay = reactExports.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 w-72 max-w-[80%] rounded-2xl border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-emerald-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-0.5 -top-0.5 h-5 w-5 rounded-tl-2xl border-l-4 border-t-4 border-emerald-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 h-5 w-5 rounded-tr-2xl border-r-4 border-t-4 border-emerald-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -left-0.5 h-5 w-5 rounded-bl-2xl border-b-4 border-l-4 border-emerald-300" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-br-2xl border-b-4 border-r-4 border-emerald-300" })
  ] }) }), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: cn(
        // Bottom-sheet override: anchor to bottom, ~45dvh tall, rounded top.
        "left-0 right-0 top-auto bottom-0 translate-x-0 translate-y-0",
        "flex h-[45dvh] max-h-[45dvh] w-screen max-w-none flex-col gap-0 overflow-hidden",
        "rounded-t-3xl rounded-b-none border-0 border-t border-white/10 bg-black p-0 text-white",
        "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
        "sm:max-w-none"
      ),
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "sr-only", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "z-10 flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-10 rounded-full bg-white/30" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "z-10 flex items-center justify-between gap-2 px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4 text-emerald-400" }),
            title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            torchSupported && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-white hover:bg-white/10", onClick: toggleTorch, children: torchOn ? /* @__PURE__ */ jsxRuntimeExports.jsx(FlashlightOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Flashlight, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-white hover:bg-white/10", onClick: () => setShowManual((v) => !v), title: "Manual entry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-white hover:bg-white/10", onClick: () => onOpenChange(false), title: "Close scanner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] })
        ] }),
        cartPreview && cartPreview.items.length > 0 && (() => {
          const totalQty = cartPreview.items.reduce((s, i) => s + i.qty, 0);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "z-20 mx-3 mb-2 overflow-hidden rounded-xl border border-emerald-400/50 bg-black/70 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setCartExpanded((v) => !v),
                className: "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-white", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 text-emerald-400" }),
                    "Cart",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white", children: [
                      cartPreview.items.length,
                      " items · ",
                      totalQty,
                      " qty"
                    ] })
                  ] }),
                  cartExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-white/70" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5 text-white/70" })
                ]
              }
            ),
            cartExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-28 divide-y divide-white/10 overflow-y-auto px-2 pb-1.5", children: cartPreview.items.slice().reverse().map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[12px] font-medium text-white", children: it.name }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-6 w-6 rounded-full bg-white/10 text-white hover:bg-white/20",
                    onClick: () => cartPreview.onDec?.(it.id),
                    disabled: !cartPreview.onDec,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-[1.5rem] text-center text-xs font-semibold text-white", children: it.qty }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-6 w-6 rounded-full bg-white/10 text-white hover:bg-white/20",
                    onClick: () => cartPreview.onInc?.(it.id),
                    disabled: !cartPreview.onInc,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-6 w-6 rounded-full text-rose-300 hover:bg-rose-500/20 hover:text-rose-200",
                    onClick: () => cartPreview.onRemove?.(it.id),
                    disabled: !cartPreview.onRemove,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                  }
                )
              ] })
            ] }, it.id)) })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 overflow-hidden bg-black", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              className: "absolute inset-0 h-full w-full object-cover",
              playsInline: true,
              muted: true,
              autoPlay: true
            }
          ),
          overlay,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pointer-events-none absolute inset-0 bg-emerald-400/30 transition-opacity duration-200", flash ? "opacity-100" : "opacity-0") }),
          frozen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-in zoom-in-50 fade-in rounded-full bg-emerald-500/90 p-3 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-white" }) }) }),
          loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/50 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-emerald-400" }),
            "Starting camera…"
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 top-2 z-10 rounded-xl border border-rose-400/50 bg-rose-950/70 p-2 text-[11px] text-rose-100", children: error }),
          statusBadge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 bottom-2 z-10 mx-auto max-w-md rounded-lg border border-emerald-400/60 bg-black/70 px-2.5 py-1.5 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 flex-shrink-0 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-semibold", children: statusBadge.label }),
              statusBadge.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10px] text-emerald-200/90", children: statusBadge.sub })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "z-10 space-y-1.5 px-3 pb-3 pt-2", children: showManual ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              autoFocus: true,
              value: manual,
              onChange: (e) => setManual(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") submitManual();
              },
              placeholder: "Enter barcode…",
              className: "h-9 flex-1 border-white/30 bg-white/10 text-sm text-white placeholder:text-white/50"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submitManual, className: "h-9 bg-emerald-600 hover:bg-emerald-700", children: "Add" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => onOpenChange(false),
            className: "h-9 w-full bg-emerald-600 text-white hover:bg-emerald-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-4 w-4" }),
              " Close Scanner"
            ]
          }
        ) })
      ]
    }
  ) });
}
function LockedRecordDialog({
  open,
  onOpenChange,
  mode = "edit"
}) {
  const isDelete = mode === "delete";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2", children: [
        isDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-5 w-5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-destructive" }),
        isDelete ? "Deletion Blocked" : "Record Locked"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "This record belongs to a ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Closed Month" }),
          "."
        ] }),
        isDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Deleting finalized records is not permitted to preserve accounting integrity." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Financial records for closed periods are protected to preserve accounting integrity." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/40 p-2.5 text-[12px] space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "gap-1 h-5 text-[10px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
              " CLOSED"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isDelete ? "Reopen the month before deleting any finalized record." : "To make changes: reopen the month, edit, then close it again." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => onOpenChange(false), children: "OK" }) })
  ] }) });
}
function isMonthClosedError(err) {
  const m = err?.message ?? "";
  return typeof m === "string" && m.includes("MONTH_CLOSED");
}
function normalizeMobile(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "966" + digits.slice(1);
  return digits;
}
function buildOrderMessage(opts) {
  const c = opts.currency ?? "SAR";
  const lines = [];
  lines.push("🛒 *New Order*");
  if (opts.orderNumber != null) lines.push(`Order #: ${opts.orderNumber}`);
  lines.push(`Customer: ${opts.customerName}`);
  lines.push(`Mobile: ${opts.customerMobile}`);
  lines.push("");
  lines.push("*Items:*");
  for (const it of opts.items) {
    lines.push(`• ${it.name} × ${it.qty} = ${c} ${(it.qty * it.price).toFixed(2)}`);
  }
  lines.push("");
  lines.push(`*Total:* ${c} ${opts.total.toFixed(2)}`);
  if (opts.status) lines.push(`Status: ${opts.status}`);
  return lines.join("\n");
}
function whatsappLink(mobile, message) {
  const m = normalizeMobile(mobile);
  return `https://wa.me/${m}?text=${encodeURIComponent(message)}`;
}
const whatsapp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildOrderMessage,
  normalizeMobile,
  whatsappLink
}, Symbol.toStringTag, { value: "Module" }));
function PosCustomerAutosuggestImpl({
  value,
  onChange,
  draftName,
  onDraftNameChange,
  onMobileFill,
  dueByCustomer,
  autoFocus
}) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [creating, setCreating] = reactExports.useState(false);
  const [newPhone, setNewPhone] = reactExports.useState("");
  const [newOpening, setNewOpening] = reactExports.useState("");
  const wrapRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const listsEnabled = open;
  const customers = useQuery({
    queryKey: POS_CUSTOMER_QUERY_KEY,
    enabled: listsEnabled,
    staleTime: 6e4,
    gcTime: 5 * 6e4,
    queryFn: fetchWholesaleCustomers
  });
  const recent = useQuery({
    queryKey: ["pos-recent-customers"],
    enabled: listsEnabled,
    staleTime: 5 * 6e4,
    gcTime: 10 * 6e4,
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1e3).toISOString();
      const { data } = await supabase.from("shop_sales").select("customer_id,created_at").not("customer_id", "is", null).eq("is_deleted", false).gte("created_at", since).order("created_at", { ascending: false }).limit(40);
      const ids = [];
      const seen = /* @__PURE__ */ new Set();
      for (const r of data ?? []) {
        const id = r.customer_id;
        if (id && !seen.has(id)) {
          seen.add(id);
          ids.push(id);
        }
        if (ids.length >= 8) break;
      }
      return ids;
    }
  });
  const lastInfo = useQuery({
    queryKey: ["pos-customer-last", value?.id],
    enabled: !!value?.id,
    staleTime: 6e4,
    gcTime: 5 * 6e4,
    queryFn: async () => {
      const [{ data: pay }, { data: sale }] = await Promise.all([
        supabase.from("pos_payments").select("amount,created_at").eq("customer_id", value.id).eq("kind", "payment_in").order("created_at", { ascending: false }).limit(1),
        supabase.from("shop_sales").select("created_at").eq("customer_id", value.id).eq("is_deleted", false).order("created_at", { ascending: false }).limit(1)
      ]);
      return {
        last_payment_at: pay?.[0]?.created_at ?? null,
        last_payment_amount: pay?.[0]?.amount != null ? Number(pay[0].amount) : null,
        last_purchase_at: sale?.[0]?.created_at ?? null
      };
    }
  });
  const list = customers.data;
  const q = draftName.trim();
  const deferredQ = reactExports.useDeferredValue(q);
  const byId = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const c of list ?? []) m.set(c.id, c);
    return m;
  }, [list]);
  const suggestions = reactExports.useMemo(() => {
    const items = list ?? [];
    if (!deferredQ) {
      const recentIds = recent.data ?? [];
      const recentSet = new Set(recentIds);
      const out = [];
      for (const id of recentIds) {
        const c = byId.get(id);
        if (c) out.push(c);
        if (out.length >= 8) break;
      }
      if (out.length < 8 && dueByCustomer) {
        const dues = [];
        for (const c of items) {
          if (recentSet.has(c.id)) continue;
          if ((dueByCustomer.get(c.id) ?? 0) > 0) dues.push(c);
        }
        dues.sort((a, b) => dueByCustomer.get(b.id) - dueByCustomer.get(a.id));
        for (const c of dues) {
          if (out.length >= 8) break;
          out.push(c);
        }
      }
      if (out.length === 0) return items.slice(0, 8);
      return out;
    }
    const scored = [];
    for (const c of items) {
      const s = Math.max(
        fuzzyScore(c.name, deferredQ),
        fuzzyScore(c.phone ?? "", deferredQ),
        fuzzyScore(c.alias ?? "", deferredQ)
      );
      if (s >= 0) scored.push({ c, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 8).map((x) => x.c);
  }, [list, byId, recent.data, deferredQ, dueByCustomer]);
  reactExports.useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);
  reactExports.useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [autoFocus]);
  const pick = reactExports.useCallback((c) => {
    onChange(c);
    onDraftNameChange(c.name);
    if (c.phone) onMobileFill?.(c.phone);
    setOpen(false);
    setCreating(false);
  }, [onChange, onDraftNameChange, onMobileFill]);
  const createCustomer = reactExports.useCallback(async () => {
    const name = draftName.trim();
    if (!name) {
      toast.error("Name required");
      return;
    }
    const opening = Number(newOpening) || 0;
    const { data, error } = await supabase.from("pos_customers").insert({ name, phone: newPhone.trim() || null, opening_due: opening }).select(POS_CUSTOMER_COLS).single();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Customer added");
    qc.invalidateQueries({ queryKey: POS_CUSTOMER_QUERY_KEY });
    qc.invalidateQueries({ queryKey: ["pos-customer-due-map"] });
    pick(data);
    setNewPhone("");
    setNewOpening("");
  }, [draftName, newPhone, newOpening, qc, pick]);
  const handleClear = reactExports.useCallback(() => {
    onChange(null);
    onDraftNameChange("");
  }, [onChange, onDraftNameChange]);
  if (value) {
    const due = dueByCustomer?.get(value.id) ?? 0;
    const li = lastInfo.data;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-primary/30 bg-primary/[0.04] p-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: value.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: cn(
                "h-5 px-1.5 text-[10px]",
                due > 0 ? "border-rose-500/40 text-rose-600" : "border-emerald-500/40 text-emerald-600"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mr-0.5 h-3 w-3" }),
                " Due SAR ",
                due.toFixed(2)
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground", children: [
          value.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
            value.phone
          ] }),
          li?.last_payment_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            "Last pay ",
            fmtDate(li.last_payment_at),
            li.last_payment_amount != null && ` · SAR ${li.last_payment_amount.toFixed(0)}`
          ] }),
          li?.last_purchase_at && !li.last_payment_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            " Last buy ",
            fmtDate(li.last_purchase_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          className: "rounded-md p-1 text-muted-foreground hover:bg-muted",
          "aria-label": "Change customer",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapRef, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          ref: inputRef,
          value: draftName,
          onChange: (e) => {
            onDraftNameChange(e.target.value);
            setOpen(true);
            setCreating(false);
          },
          onFocus: () => setOpen(true),
          placeholder: "Customer name * — search or add",
          className: "h-10 rounded-xl pl-9 pr-9 text-sm",
          autoComplete: "off"
        }
      ),
      draftName && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            onDraftNameChange("");
            inputRef.current?.focus();
            setOpen(true);
          },
          className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted",
          "aria-label": "Clear",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 top-[calc(100%+4px)] z-40 max-h-[60dvh] overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg", children: creating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "New customer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Customer name *", value: draftName, onChange: (e) => onDraftNameChange(e.target.value), className: "h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Mobile", value: newPhone, onChange: (e) => setNewPhone(e.target.value), inputMode: "tel", className: "h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Opening due (SAR)", value: newOpening, onChange: (e) => setNewOpening(e.target.value), type: "number", inputMode: "decimal", className: "h-9" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: () => setCreating(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "flex-1", onClick: createCustomer, children: "Save customer" })
      ] })
    ] }) : customers.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-4 text-center text-xs text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      !deferredQ && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: (recent.data?.length ?? 0) > 0 ? "Recent & due" : "Customers" }),
      suggestions.map((c) => {
        const due = dueByCustomer?.get(c.id) ?? 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => pick(c),
            className: "flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-muted/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: c.phone ?? "—" })
              ] }),
              due > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-rose-500/40 text-[10px] text-rose-600", children: [
                "Due ",
                due.toFixed(0)
              ] })
            ]
          },
          c.id
        );
      }),
      suggestions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-4 text-center text-xs text-muted-foreground", children: deferredQ ? `No match for "${deferredQ}"` : "No customers yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onMouseDown: (e) => e.preventDefault(),
          onClick: () => setCreating(true),
          className: "flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm font-medium text-primary hover:bg-primary/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
            "Add new customer",
            q ? ` "${q}"` : ""
          ]
        }
      ) })
    ] }) })
  ] });
}
const PosCustomerAutosuggest = reactExports.memo(PosCustomerAutosuggestImpl);
function fmtDate(s) {
  try {
    const d = new Date(s);
    const now = /* @__PURE__ */ new Date();
    const days = Math.floor((now.getTime() - d.getTime()) / (24 * 3600 * 1e3));
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString(void 0, { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
const WHOLESALE_REFRESH_KEYS = [
  ["wholesale-dashboard-summary"],
  ["dashboard-recent-entries-v2"],
  ["wh-financials"],
  ["wh-profit"],
  ["wh-recent-entries"],
  ["txn-products"],
  ["wh_ledger"],
  ["trash"],
  ["store-admin-overview"],
  ["admin-sales"],
  ["admin-purchases"],
  ["admin-orders"],
  ["admin-products"],
  ["store-products"],
  ["pos-payments"],
  ["pos-customers"],
  ["pos-customers-admin"],
  ["pos-customer-due-map"],
  ["pos-balance"],
  ["pos-customer-statement"]
];
function traceWholesaleFlow(event, detail) {
  if (typeof window === "undefined") return;
  console.debug(`[wholesale-stability] ${event}`, detail ?? "");
}
async function refreshWholesaleData(queryClient, refetch = true) {
  traceWholesaleFlow("cache invalidation start", { refetch, keys: WHOLESALE_REFRESH_KEYS.length });
  await Promise.allSettled(
    WHOLESALE_REFRESH_KEYS.map(
      (queryKey) => queryClient.invalidateQueries({ queryKey: [...queryKey], refetchType: "none" })
    )
  );
  if (!refetch) return;
  const results = await Promise.allSettled(
    WHOLESALE_REFRESH_KEYS.map(
      (queryKey) => queryClient.refetchQueries({ queryKey: [...queryKey], type: "active" })
    )
  );
  const failed = results.filter((r) => r.status === "rejected").length;
  traceWholesaleFlow("cache invalidation end", { failed });
  if (failed) toast.error("Refresh failed. Pull to retry.");
}
function refreshWholesaleDataInBackground(queryClient) {
  void refreshWholesaleData(queryClient).catch((error) => {
    traceWholesaleFlow("cache refresh failed", error);
    toast.error("Refresh failed. Pull to retry.");
  });
}
const AUDIT_MODULES = [
  "Shop Sale",
  "Shop Purchase",
  "Shop Expense",
  "Shop Withdraw",
  "Wholesale Sale",
  "Wholesale Purchase",
  "Sales Return",
  "Employee Transaction",
  "Company Transaction",
  "Customer Order Received",
  "Employee Wallet",
  "Other"
];
function sendAuditEmail(payload) {
  try {
    const body = JSON.stringify({
      ...payload,
      recordId: payload.recordId != null ? String(payload.recordId) : null,
      eventTime: payload.eventTime || (/* @__PURE__ */ new Date()).toISOString()
    });
    fetch("/api/public/send-audit-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch((e) => console.warn("[audit-email] request failed:", e?.message || e));
  } catch (e) {
    console.warn("[audit-email] payload build failed:", e?.message || e);
  }
}
function TransactionDialog({
  open,
  onOpenChange,
  kind,
  initial,
  editId
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [pendingLowStock, setPendingLowStock] = reactExports.useState(null);
  const [partyName, setPartyName] = reactExports.useState(initial?.partyName ?? "");
  const [partyMobile, setPartyMobile] = reactExports.useState(initial?.partyMobile ?? "");
  const [lines, setLines] = reactExports.useState(initial?.items ?? []);
  const [notes, setNotes] = reactExports.useState(initial?.notes ?? "");
  const [discount, setDiscount] = reactExports.useState(0);
  const [search, setSearch] = reactExports.useState("");
  const [detailsOpen, setDetailsOpen] = reactExports.useState(false);
  const [cartOpen, setCartOpen] = reactExports.useState(false);
  const [armedAction, setArmedAction] = reactExports.useState(null);
  const [customer, setCustomer] = reactExports.useState(null);
  const [paidStr, setPaidStr] = reactExports.useState("");
  const [paymentMethod, setPaymentMethod] = reactExports.useState("cash");
  const [attachmentUrl, setAttachmentUrl] = reactExports.useState(null);
  const [attachmentUploading, setAttachmentUploading] = reactExports.useState(false);
  const [memoDate, setMemoDate] = reactExports.useState("");
  const linesRef = reactExports.useRef(initial?.items ?? []);
  const searchRef = reactExports.useRef(null);
  const armTimerRef = reactExports.useRef(null);
  const [lockedOpen, setLockedOpen] = reactExports.useState(false);
  const isEdit = !!editId && kind === "purchase";
  const [scannerOpen, setScannerOpen] = reactExports.useState(false);
  const scannerOpenRef = reactExports.useRef(false);
  const [scannerStatus, setScannerStatus] = reactExports.useState(null);
  const scannerStatusTimerRef = reactExports.useRef(null);
  const [unknownBarcode, setUnknownBarcode] = reactExports.useState(null);
  const [quickAdd, setQuickAdd] = reactExports.useState(null);
  function flashScannerStatus(s) {
    setScannerStatus(s);
    if (scannerStatusTimerRef.current) window.clearTimeout(scannerStatusTimerRef.current);
    scannerStatusTimerRef.current = window.setTimeout(() => setScannerStatus(null), 1e3);
  }
  function updateLines(nextOrUpdater) {
    const next = typeof nextOrUpdater === "function" ? nextOrUpdater(linesRef.current) : nextOrUpdater;
    linesRef.current = next;
    setLines(next);
  }
  reactExports.useEffect(() => {
    linesRef.current = lines;
  }, [lines]);
  function onProductScanned(p, scannedBarcode) {
    setArmedAction(null);
    const current = linesRef.current;
    const existing = current.find((l) => l.product_id === p.id);
    const nextQty = (existing?.qty ?? 0) + 1;
    const next = existing ? current.map((l) => l.product_id === p.id ? { ...l, qty: nextQty, stock: p.stock } : l) : [...current, {
      product_id: p.id,
      name: p.name,
      qty: 1,
      price: Number(kind === "sale" ? p.price : p.purchase_price || p.price) || 0,
      cost: Number(p.purchase_price) || 0,
      image_url: p.image_url,
      stock: p.stock
    }];
    updateLines(next);
    console.debug("[barcode-scan]", {
      scannedBarcode,
      matchedProductId: p.id,
      addedCartId: p.id,
      currentCartQuantity: nextQty
    });
    return nextQty;
  }
  function handleProductScanned(p, scannedBarcode) {
    const newQty = onProductScanned(p, scannedBarcode);
    flashScannerStatus({ label: p.name, sub: `Qty: ${newQty}` });
  }
  function openScanner() {
    scannerOpenRef.current = true;
    setScannerStatus(null);
    setScannerOpen(true);
  }
  function handleScannerOpenChange(v) {
    if (v) {
      scannerOpenRef.current = true;
      setScannerOpen(true);
      return;
    }
    setScannerOpen(false);
    setScannerStatus(null);
    window.setTimeout(() => {
      scannerOpenRef.current = false;
    }, 250);
  }
  async function lookupScannedProduct(code) {
    const clean = (code || "").replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, "").trim();
    if (!clean) return null;
    const select = "id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code";
    let { data } = await supabase.from("shop_products").select(select).eq("item_code", clean).eq("is_deleted", false).limit(1).maybeSingle();
    if (!data) {
      ({ data } = await supabase.from("shop_products").select(select).eq("barcode", clean).eq("is_deleted", false).limit(1).maybeSingle());
    }
    if (!data && /^\d+$/.test(clean)) {
      const { data: rows } = await supabase.from("shop_products").select(select).eq("is_deleted", false).or(`item_code.ilike.%${clean}%,barcode.ilike.%${clean}%`).limit(5);
      const numeric = (rows ?? []).find((r) => {
        const a = String(r.item_code ?? "").replace(/\D/g, "");
        const b = String(r.barcode ?? "").replace(/\D/g, "");
        return a === clean || b === clean;
      });
      if (numeric) data = numeric;
    }
    console.debug("[barcode-lookup]", {
      scanned: code,
      normalized: clean,
      matchedBarcode: data?.item_code ?? data?.barcode ?? null,
      matchedProductId: data?.id ?? null
    });
    return data ?? null;
  }
  const editingRow = useQuery({
    queryKey: ["txn-edit-purchase", editId],
    enabled: open && isEdit,
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_purchases").select("*").eq("id", editId).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const dueMap = usePosDueMap();
  const customerBalance = useQuery({
    queryKey: ["pos-balance", customer?.id],
    enabled: !!customer?.id && kind === "sale",
    queryFn: () => fetchCustomerBalance(customer.id)
  });
  const supplierOptions = useQuery({
    queryKey: ["txn-supplier-options"],
    enabled: open && kind === "purchase",
    staleTime: 5 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("parties").select("id,name,phone").eq("is_deleted", false).in("party_type", ["supplier", "mixed"]).order("name").limit(200);
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
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
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (!isEdit || !open) return;
    const r = editingRow.data;
    if (!r) return;
    setPartyName(String(r.supplier_name ?? ""));
    setPartyMobile(String(r.supplier_mobile ?? ""));
    setNotes(String(r.notes ?? ""));
    setAttachmentUrl(r.attachment_url ?? null);
    setMemoDate(r.memo_date ? String(r.memo_date).slice(0, 10) : "");
    const items = Array.isArray(r.items) ? r.items : [];
    const editLines = items.map((it) => ({
      product_id: String(it.product_id ?? it.id ?? ""),
      name: String(it.name ?? ""),
      qty: Number(it.qty ?? 0) || 0,
      price: Number(it.price ?? 0) || 0,
      cost: Number(it.cost ?? it.price ?? 0) || 0,
      image_url: it.image_url ?? null,
      stock: typeof it.stock === "number" ? it.stock : void 0
    })).filter((l) => l.product_id);
    updateLines(editLines);
  }, [isEdit, open, editingRow.data]);
  reactExports.useEffect(() => {
    if (!armedAction) return;
    if (armTimerRef.current) window.clearTimeout(armTimerRef.current);
    armTimerRef.current = window.setTimeout(() => setArmedAction(null), 3500);
    return () => {
      if (armTimerRef.current) window.clearTimeout(armTimerRef.current);
    };
  }, [armedAction]);
  const debouncedSearch = useDebouncedValue(search, 250);
  const trimmedSearch = debouncedSearch.trim();
  const PAGE_SIZE = 30;
  const browse = useInfiniteQuery({
    queryKey: ["txn-products-browse"],
    enabled: open && trimmedSearch.length === 0,
    staleTime: 6e4,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase.from("shop_products").select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code").eq("is_deleted", false).order("name").range(from, to);
      if (error) throw error;
      return data ?? [];
    },
    getNextPageParam: (lastPage, allPages) => lastPage.length < PAGE_SIZE ? void 0 : allPages.length
  });
  const searchQuery = useQuery({
    queryKey: ["txn-products-search", trimmedSearch],
    enabled: open && trimmedSearch.length > 0,
    staleTime: 3e4,
    queryFn: async () => {
      const safe = trimmedSearch.replace(/[%,]/g, " ");
      const pattern = `%${safe}%`;
      const { data, error } = await supabase.from("shop_products").select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code").eq("is_deleted", false).or(`name.ilike.${pattern},barcode.ilike.${pattern},item_code.ilike.${pattern}`).order("name").limit(60);
      if (error) throw error;
      return data ?? [];
    }
  });
  const isSearching = trimmedSearch.length > 0;
  const products = {
    isLoading: isSearching ? searchQuery.isLoading : browse.isLoading
  };
  const filteredProducts = reactExports.useMemo(() => {
    if (isSearching) return searchQuery.data ?? [];
    const pages = browse.data?.pages ?? [];
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const page of pages) {
      for (const p of page) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        out.push(p);
      }
    }
    return out;
  }, [isSearching, searchQuery.data, browse.data]);
  const loadMoreRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isSearching) return;
    const node = loadMoreRef.current;
    if (!node) return;
    if (!browse.hasNextPage || browse.isFetchingNextPage) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) browse.fetchNextPage();
    }, { rootMargin: "200px 0px" });
    io.observe(node);
    return () => io.disconnect();
  }, [isSearching, browse.hasNextPage, browse.isFetchingNextPage, browse.fetchNextPage, filteredProducts.length]);
  const lineMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    lines.forEach((l) => m.set(l.product_id, l));
    return m;
  }, [lines]);
  function addOrInc(p) {
    setArmedAction(null);
    updateLines((prev) => {
      const existing = prev.find((l) => l.product_id === p.id);
      if (existing) {
        return prev.map((l) => l.product_id === p.id ? { ...l, qty: l.qty + 1, stock: p.stock } : l);
      }
      return [...prev, {
        product_id: p.id,
        name: p.name,
        qty: 1,
        price: Number(kind === "sale" ? p.price : p.purchase_price || p.price) || 0,
        cost: Number(p.purchase_price) || 0,
        image_url: p.image_url,
        stock: p.stock
      }];
    });
  }
  function setQty(id, qty) {
    setArmedAction(null);
    updateLines((prev) => prev.map((l) => l.product_id === id ? { ...l, qty } : l).filter((l) => l.qty > 0));
  }
  function setPrice(id, price) {
    setArmedAction(null);
    updateLines((prev) => prev.map((l) => l.product_id === id ? { ...l, price } : l));
  }
  function removeLine(id) {
    setArmedAction(null);
    updateLines((prev) => prev.filter((l) => l.product_id !== id));
  }
  function clearAll() {
    updateLines([]);
    setArmedAction(null);
    toast.success("Cart cleared");
  }
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const vatPortion = subtotal - subtotal / 1.15;
  const estProfit = kind === "sale" ? lines.reduce((s, l) => s + l.qty * (l.price - (l.cost ?? 0)), 0) - discount : 0;
  const paidAmount = kind === "sale" ? Math.max(0, Number(paidStr) || 0) : 0;
  const dueAmount = kind === "sale" ? Math.max(0, total - paidAmount) : 0;
  const customerCurrentDue = customerBalance.data?.current_due ?? 0;
  async function ensureCustomerForOrder() {
    if (customer) return customer;
    if (kind !== "sale" || !initial?.orderId) return null;
    const name = (initial.partyName ?? "").trim();
    const phone = (initial.partyMobile ?? "").trim();
    if (!name && !phone) return null;
    let found = null;
    if (phone) {
      const { data } = await supabase.from("pos_customers").select("*").eq("phone", phone).limit(1);
      found = data?.[0] ?? null;
    }
    if (!found && name) {
      const { data } = await supabase.from("pos_customers").select("*").ilike("name", name).limit(1);
      found = data?.[0] ?? null;
    }
    if (!found) {
      const { data, error } = await supabase.from("pos_customers").insert({ name: name || "Web customer", phone: phone || null, notes: "Auto-created from website order" }).select("*").single();
      if (error) throw error;
      found = data;
    }
    setCustomer(found);
    qc.invalidateQueries({ queryKey: ["pos-customers"] });
    return found;
  }
  const save = useMutation({
    mutationFn: async (action) => {
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
      const payload = {
        items: lines,
        subtotal,
        tax: Math.max(0, vatPortion),
        total,
        notes: notes.trim() || null
      };
      if (kind === "sale") {
        payload.customer_name = effectiveName;
        payload.customer_mobile = (activeCustomer?.phone ?? partyMobile).trim() || null;
        payload.discount = discount;
        payload.customer_id = activeCustomer.id;
        payload.paid_amount = paidAmount;
        payload.due_amount = dueAmount;
        payload.payment_method = paymentMethod === "mixed" ? "mixed" : paidAmount >= total ? paymentMethod : paidAmount > 0 ? "mixed" : "due";
        payload.payment_breakdown = { [paymentMethod]: paidAmount };
        if (initial?.orderId) payload.order_id = initial.orderId;
      } else {
        payload.supplier_name = effectiveName;
        payload.supplier_mobile = partyMobile.trim() || null;
        payload.memo_date = memoDate || null;
        if (attachmentUrl) payload.attachment_url = attachmentUrl;
      }
      const table = kind === "sale" ? "shop_sales" : "shop_purchases";
      let data;
      let error;
      if (isEdit) {
        ({ data, error } = await supabase.from(table).update(payload).eq("id", editId).select("*").single());
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
      traceWholesaleFlow("mutation success", { type: kind, id: row?.id, action });
      const listKey = [`admin-${kind}s`];
      qc.setQueryData(listKey, (old = []) => [row, ...old.filter((r2) => r2.id !== row.id)].slice(0, 200));
      qc.invalidateQueries({ queryKey: ["txn-products-browse"] });
      qc.invalidateQueries({ queryKey: ["txn-products-search"] });
      if (isEdit) {
        qc.invalidateQueries({ queryKey: ["wh-purchase-detail", editId] });
        qc.invalidateQueries({ queryKey: ["wh-recent-entries"] });
      } else {
        qc.setQueryData(["wh-recent-entries", 20], (old = []) => [{
          id: `${kind === "sale" ? "s" : "p"}-${row.id}`,
          refId: row.id,
          kind,
          title: kind === "sale" ? row.customer_name || "Walk-in" : row.supplier_name || "Supplier",
          subtitle: `Invoice #${row.invoice_number}`,
          amount: Number(row.total ?? 0),
          at: row.created_at
        }, ...old].slice(0, 20));
      }
      refreshWholesaleDataInBackground(qc);
      toast.success(isEdit ? "Purchase updated" : kind === "sale" ? "Sale completed" : "Purchase completed");
      try {
        const r2 = row;
        sendAuditEmail({
          action: isEdit ? "edited" : "created",
          module: kind === "sale" ? "Wholesale Sale" : "Wholesale Purchase",
          userName: null,
          recordId: r2?.id,
          newValues: {
            invoice_number: r2?.invoice_number,
            customer_or_supplier: kind === "sale" ? r2?.customer_name : r2?.supplier_name,
            mobile: kind === "sale" ? r2?.customer_mobile : r2?.supplier_mobile,
            total: r2?.total,
            discount: r2?.discount,
            items: Array.isArray(r2?.items) ? r2.items.length : void 0
          },
          notes: notes || null,
          amount: Number(r2?.total ?? 0)
        });
      } catch (e) {
      }
      updateLines([]);
      setPartyName("");
      setPartyMobile("");
      setNotes("");
      setDiscount(0);
      setAttachmentUrl(null);
      setCartOpen(false);
      setArmedAction(null);
      onOpenChange(false);
      navigate({ to: "/store-admin", search: { tab: "dashboard" } });
      if (action === "save") return;
      const r = row;
      if (kind !== "sale") {
        if (action === "share") {
          const mobile = String(r.supplier_mobile ?? "").trim();
          if (!mobile) {
            toast.error("Supplier mobile number not found.");
            return;
          }
          const msg = `🧾 Purchase Invoice #${r.invoice_number}
Total: SAR ${Number(r.total).toFixed(2)}`;
          try {
            window.open(whatsappLink(mobile, msg), "_blank", "noopener,noreferrer");
          } catch {
          }
        } else {
          toast.info("Print is available for sales invoices only.");
        }
        return;
      }
      try {
        const { buildAm80DataFromSaleId } = await import("./from-sale-BY1n2b70.mjs");
        const data = await buildAm80DataFromSaleId(r.id);
        if (!data) throw new Error("Could not build invoice data");
        if (action === "share") {
          const { shareAm80ImageToCustomer } = await import("./share-71lV2Bko.mjs");
          await shareAm80ImageToCustomer(data, r.customer_mobile);
        } else if (action === "print") {
          const { printAm80 } = await import("./share-71lV2Bko.mjs");
          await printAm80(data);
        }
      } catch (e) {
        console.error("[AM80] post-save action failed", e);
        toast.error(`Invoice ${action} failed: ${e?.message ?? e}`);
      }
    },
    onError: (e) => {
      traceWholesaleFlow("mutation failed", { type: kind, message: e?.message });
      setArmedAction(null);
      if (isMonthClosedError(e)) {
        setLockedOpen(true);
        return;
      }
      toast.error(e?.message ?? "Failed");
    }
  });
  function tryComplete(action) {
    if (lines.length === 0 || save.isPending) return;
    if (kind === "sale") {
      const offenders = lines.filter((l) => typeof l.stock === "number" && l.stock - l.qty < 0).map((l) => ({ name: l.name, stock: l.stock, qty: l.qty }));
      if (offenders.length > 0) {
        setPendingLowStock({ alsoShare: action !== "save", items: offenders });
        setPendingLowStock.__lastAction = action;
        return;
      }
    }
    save.mutate(action);
  }
  const title = kind === "sale" ? initial?.orderId ? "Convert order to sale" : "New sale" : isEdit ? `Edit purchase${editingRow.data?.invoice_number ? ` #${editingRow.data.invoice_number}` : ""}` : "New purchase";
  const partyLabel = kind === "sale" ? "Customer" : "Supplier";
  const completeLabel = kind === "sale" ? "Complete Sale" : isEdit ? "Update Purchase" : "Save Purchase";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (v) => {
      if (!v && scannerOpenRef.current) return;
      onOpenChange(v);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "flex h-[100dvh] max-h-[100dvh] w-screen max-w-full flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[92dvh] sm:max-w-2xl sm:rounded-2xl",
          onOpenAutoFocus: (e) => e.preventDefault(),
          onInteractOutside: (e) => {
            if (scannerOpenRef.current) e.preventDefault();
          },
          onFocusOutside: (e) => {
            if (scannerOpenRef.current) e.preventDefault();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border/60 px-4 py-3 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold sm:text-lg", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] uppercase tracking-wide", children: kind === "sale" ? "POS" : "Purchase" })
            ] }) }),
            kind === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60 bg-background px-4 py-2 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PosCustomerAutosuggest,
              {
                value: customer,
                onChange: setCustomer,
                draftName: partyName,
                onDraftNameChange: setPartyName,
                onMobileFill: (p) => setPartyMobile(p),
                dueByCustomer: dueMap.data
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/60 bg-muted/30 px-4 py-2 sm:px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setDetailsOpen((v) => !v),
                  className: "flex w-full items-center justify-between gap-2 text-left",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: kind === "sale" ? "Sale options" : `${partyLabel} details` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-medium", children: [
                        kind === "sale" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/70", children: [
                          discount > 0 ? `Discount SAR ${discount.toFixed(2)}` : "Discount & notes",
                          notes && " · note added"
                        ] }) : partyName.trim() || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/70", children: "Tap to add details" }),
                        kind !== "sale" && partyMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground", children: [
                          "· ",
                          partyMobile
                        ] })
                      ] })
                    ] }),
                    detailsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
                  ]
                }
              ),
              detailsOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2", children: [
                kind !== "sale" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      list: "txn-supplier-list",
                      placeholder: `${partyLabel} name *`,
                      value: partyName,
                      onChange: (e) => {
                        const v = e.target.value;
                        setPartyName(v);
                        const match = (supplierOptions.data ?? []).find((s) => s.name === v);
                        if (match?.phone && !partyMobile) setPartyMobile(match.phone);
                      },
                      className: "h-9"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "txn-supplier-list", children: (supplierOptions.data ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.name, children: s.phone ?? "" }, s.id)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "Mobile",
                      value: partyMobile,
                      onChange: (e) => setPartyMobile(e.target.value),
                      inputMode: "tel",
                      className: "h-9"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: [
                      "Memo Date ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case text-muted-foreground/70", children: "(supplier invoice date)" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: memoDate,
                        onChange: (e) => setMemoDate(e.target.value),
                        className: "h-9"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PurchaseAttachmentField,
                    {
                      value: attachmentUrl,
                      onChange: setAttachmentUrl,
                      uploading: attachmentUploading,
                      setUploading: setAttachmentUploading
                    }
                  ) })
                ] }),
                kind === "sale" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Discount (SAR)",
                    type: "number",
                    step: "0.01",
                    value: discount || "",
                    onChange: (e) => setDiscount(Number(e.target.value) || 0),
                    className: "h-9"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Notes",
                    rows: 2,
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    className: "sm:col-span-2"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border/60 px-4 py-2 sm:px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      ref: searchRef,
                      placeholder: "Search products, barcode…",
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      className: "h-11 rounded-xl pl-9 pr-9 text-base",
                      autoComplete: "off"
                    }
                  ),
                  search && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setSearch("");
                        searchRef.current?.focus();
                      },
                      className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted",
                      "aria-label": "Clear",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                isSearching && !products.isLoading && filteredProducts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "icon",
                    className: "h-11 w-11 flex-shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700",
                    onClick: () => setQuickAdd({ name: trimmedSearch, price: "", cost: "", saving: false }),
                    title: `Add "${trimmedSearch}" as new product`,
                    "aria-label": "Add new product",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "icon",
                    className: "h-11 w-11 flex-shrink-0 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
                    onClick: openScanner,
                    title: "Scan barcode",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-5 w-5" })
                  }
                )
              ] }),
              isSearching && !products.isLoading && filteredProducts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[12px] text-muted-foreground", children: [
                "No Match Found —",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setQuickAdd({ name: trimmedSearch, price: "", cost: "", saving: false }),
                    className: "font-medium text-emerald-600 hover:underline",
                    children: [
                      'Add "',
                      trimmedSearch,
                      '" as new product'
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-3 py-1 sm:px-5", children: products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 animate-pulse rounded-xl bg-muted/50" }, i)) }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "mb-2 h-10 w-10 text-muted-foreground/50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isSearching ? "Tap + above to create this product" : "No products found" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-1", lines.length > 0 ? "pb-16" : "pb-1"), children: [
              filteredProducts.map((p) => {
                const inCart = lineMap.get(p.id);
                const unitPrice = Number(kind === "sale" ? p.price : p.purchase_price || p.price) || 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProductPickRow,
                  {
                    product: p,
                    inCart,
                    unitPrice,
                    onAdd: () => addOrInc(p),
                    onSetQty: (q) => setQty(p.id, q)
                  },
                  p.id
                );
              }),
              !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: loadMoreRef, className: "py-3 text-center text-xs text-muted-foreground", children: browse.isFetchingNextPage ? "Loading more…" : browse.hasNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => browse.fetchNextPage(), className: "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted", children: "Load more products" }) : filteredProducts.length > PAGE_SIZE ? "All products loaded" : null })
            ] }) }),
            lines.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setCartOpen(true),
                className: "flex items-center justify-between gap-3 border-t border-border/60 bg-gradient-to-r from-primary to-primary-glow px-4 py-3 text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.99] transition-transform sm:px-5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-background px-1 text-[10px] font-bold text-primary", children: lines.length })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-left leading-tight", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-medium uppercase tracking-wider opacity-90", children: [
                        lines.length,
                        " item",
                        lines.length !== 1 ? "s" : "",
                        " · Qty ",
                        totalQty.toFixed(0)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold", children: [
                        "SAR ",
                        total.toFixed(2)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-lg bg-background/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm", children: [
                    "Review",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" })
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground sm:px-5", children: "Tap a product to add it to the cart" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Drawer, { open: cartOpen, onOpenChange: setCartOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerContent, { className: "flex h-[92dvh] max-h-[92dvh] flex-col p-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerHeader, { className: "shrink-0 border-b border-border/50 px-4 pb-2 pt-2 sm:px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DrawerTitle, { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4 text-primary" }),
            "Review cart",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
              lines.length,
              " item",
              lines.length !== 1 ? "s" : ""
            ] })
          ] }),
          lines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearAll,
              className: "rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-500/10",
              children: "Clear all"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-2 sm:px-5", children: [
          lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "mb-2 h-10 w-10 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Cart is empty" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: lines.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CartItem,
            {
              line: l,
              showCost: kind === "sale",
              onQty: (q) => setQty(l.product_id, q),
              onPrice: (v) => setPrice(l.product_id, v),
              onRemove: () => removeLine(l.product_id)
            },
            l.product_id
          )) }),
          lines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Add notes (optional)",
              rows: 2,
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              className: "mt-2 text-sm"
            }
          ),
          kind === "sale" && lines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-xl border border-border/50 bg-muted/20 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPaidStr(total.toFixed(2)), className: "rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted", children: "Paid full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                  setPaidStr("");
                  setPaymentMethod("due");
                }, className: "rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted", children: "All due" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_1fr] gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.01",
                  inputMode: "decimal",
                  placeholder: "Paid (SAR)",
                  value: paidStr,
                  onChange: (e) => setPaidStr(e.target.value),
                  className: "h-9 text-sm font-semibold"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: paymentMethod, onValueChange: (v) => setPaymentMethod(v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pos", children: "POS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bank", children: "Bank" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "due", children: "Due (credit)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mixed", children: "Mixed" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center justify-between gap-3 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Due this sale" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-bold tabular-nums", dueAmount > 0 ? "text-rose-600" : "text-emerald-600"), children: [
                "SAR ",
                dueAmount.toFixed(2)
              ] })
            ] }),
            customer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate text-muted-foreground", children: [
                customer.name,
                " · total after"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 font-bold tabular-nums", children: [
                "SAR ",
                (customerCurrentDue + dueAmount).toFixed(2)
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 border-t border-border/60 bg-background/95 px-3 pt-2 backdrop-blur sm:px-5",
            style: { paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.6rem)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-end justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Total · VAT incl." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold leading-tight tracking-tight tabular-nums", children: [
                    "SAR ",
                    total.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[10px] leading-tight text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    lines.length,
                    " item",
                    lines.length !== 1 ? "s" : "",
                    " · ",
                    totalQty.toFixed(0),
                    " qty"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "VAT ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: Math.max(0, vatPortion).toFixed(2) }),
                    discount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      " · −",
                      discount.toFixed(0)
                    ] })
                  ] }),
                  kind === "sale" && lines.length > 0 && estProfit !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("font-medium tabular-nums", estProfit >= 0 ? "text-emerald-600" : "text-rose-600"), children: [
                    "P/L ",
                    estProfit >= 0 ? "+" : "",
                    estProfit.toFixed(2)
                  ] })
                ] })
              ] }),
              kind === "sale" && !customer && !initial?.orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10.5px] font-medium text-amber-700 dark:text-amber-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Select customer before completing sale" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "default",
                    disabled: save.isPending || lines.length === 0 || kind === "sale" && !customer && !initial?.orderId,
                    onClick: () => tryComplete("save"),
                    className: "h-10 gap-1 bg-gradient-to-r from-primary to-primary-glow px-2 text-sm font-semibold shadow-md",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: completeLabel })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    disabled: save.isPending || lines.length === 0 || kind === "sale" && !customer && !initial?.orderId,
                    onClick: () => tryComplete("share"),
                    className: "h-10 gap-1 px-2 text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Save & Share" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    disabled: save.isPending || lines.length === 0 || kind === "sale" && !customer && !initial?.orderId,
                    onClick: () => tryComplete("print"),
                    className: "h-10 gap-1 px-2 text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Save & Print" })
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LowStockWarningDialog,
        {
          state: pendingLowStock,
          onCancel: () => setPendingLowStock(null),
          onConfirm: () => {
            const p = pendingLowStock;
            setPendingLowStock(null);
            if (p) {
              const act = setPendingLowStock.__lastAction;
              save.mutate(act ?? (p.alsoShare ? "share" : "save"));
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LockedRecordDialog, { open: lockedOpen, onOpenChange: setLockedOpen, mode: "edit" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BarcodeScanner,
      {
        open: scannerOpen,
        onOpenChange: handleScannerOpenChange,
        mode: "continuous",
        title: kind === "sale" ? "Scan to add to sale" : "Scan to add to purchase",
        lookupProduct: lookupScannedProduct,
        onProductScanned: (product, code) => handleProductScanned(product, code),
        onNotFound: (code) => {
          setUnknownBarcode(code);
        },
        statusBadge: scannerStatus,
        cartPreview: {
          items: lines.map((l) => ({ id: l.product_id, name: l.name, qty: l.qty, image_url: l.image_url })),
          onInc: (id) => setQty(id, (linesRef.current.find((l) => l.product_id === id)?.qty ?? 0) + 1),
          onDec: (id) => setQty(id, (linesRef.current.find((l) => l.product_id === id)?.qty ?? 0) - 1),
          onRemove: (id) => removeLine(id)
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!unknownBarcode, onOpenChange: (v) => !v && setUnknownBarcode(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Product not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "No product matches barcode ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: unknownBarcode }),
          ". Would you like to create it?"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setUnknownBarcode(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              const bc = unknownBarcode;
              setUnknownBarcode(null);
              onOpenChange(false);
              toast.info(`Open New Product and paste barcode: ${bc}`);
              navigate({ to: "/store-admin" });
            },
            children: "Create new product"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!quickAdd, onOpenChange: (v) => !v && !quickAdd?.saving && setQuickAdd(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-emerald-600" }),
          " Add new product"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Create a product and add it to this ",
          kind,
          ". You can edit full details later."
        ] })
      ] }),
      quickAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "Product name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              autoFocus: true,
              value: quickAdd.name,
              onChange: (e) => setQuickAdd({ ...quickAdd, name: e.target.value }),
              placeholder: "Product name"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: kind === "sale" ? "Sale price" : "Sale price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                inputMode: "decimal",
                value: quickAdd.price,
                onChange: (e) => setQuickAdd({ ...quickAdd, price: e.target.value }),
                placeholder: "0.00"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "Purchase cost" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                inputMode: "decimal",
                value: quickAdd.cost,
                onChange: (e) => setQuickAdd({ ...quickAdd, cost: e.target.value }),
                placeholder: "0.00"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setQuickAdd(null), disabled: quickAdd?.saving, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            disabled: !quickAdd || !quickAdd.name.trim() || quickAdd.saving,
            onClick: async () => {
              if (!quickAdd) return;
              const name = quickAdd.name.trim();
              if (!name) return;
              setQuickAdd({ ...quickAdd, saving: true });
              try {
                const { data: existing } = await supabase.from("shop_products").select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code").ilike("name", name).eq("is_deleted", false).limit(1);
                let product = existing?.[0] ?? null;
                if (product) {
                  toast.info("Product already exists — added to cart");
                } else {
                  const price = Number(quickAdd.price) || 0;
                  const cost = Number(quickAdd.cost) || 0;
                  const { data, error } = await supabase.from("shop_products").insert({
                    name,
                    price,
                    purchase_price: cost,
                    stock: 0,
                    tax_rate: 15,
                    is_visible: true,
                    show_stock: true
                  }).select("id,name,price,purchase_price,stock,image_url,tax_rate,barcode,item_code").single();
                  if (error) throw error;
                  product = data;
                  toast.success(`Added "${name}"`);
                }
                if (product) addOrInc(product);
                setSearch("");
                setQuickAdd(null);
                qc.invalidateQueries({ queryKey: ["txn-products-browse"] });
                qc.invalidateQueries({ queryKey: ["txn-products-search"] });
                qc.invalidateQueries({ queryKey: ["admin-products"] });
              } catch (e) {
                toast.error(e?.message ?? "Failed to create product");
                setQuickAdd({ ...quickAdd, saving: false });
              }
            },
            className: "bg-emerald-600 text-white hover:bg-emerald-700",
            children: quickAdd?.saving ? "Saving…" : "Create & Add"
          }
        )
      ] })
    ] }) })
  ] });
}
function LowStockWarningDialog({
  state,
  onCancel,
  onConfirm
}) {
  const open = !!state;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) onCancel();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm gap-0 overflow-hidden p-0", onOpenAutoFocus: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border/60 px-5 py-4 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-[15px] font-semibold", children: "Low stock warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-[11.5px]", children: "One or more products are out of stock or below zero." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[40vh] overflow-y-auto px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/60 rounded-xl border border-border bg-card", children: (state?.items ?? []).map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "min-w-0 flex-1 truncate text-[13px] font-medium", children: it.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right text-[11px] leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("font-semibold tabular-nums", it.stock <= 0 ? "text-rose-600" : "text-amber-600"), children: [
          "Stock: ",
          it.stock
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground tabular-nums", children: [
          "Selling: ",
          it.qty
        ] })
      ] })
    ] }, `${it.name}-${i}`)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "grid grid-cols-2 gap-2 border-t border-border/60 bg-muted/30 px-5 py-3 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onCancel, className: "h-10", children: "Cancel sale" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onConfirm,
          className: "h-10 bg-amber-500 text-white hover:bg-amber-600",
          children: "Continue anyway"
        }
      )
    ] })
  ] }) });
}
function CartItem({
  line,
  showCost,
  onQty,
  onPrice,
  onRemove
}) {
  const amount = line.qty * line.price;
  const profit = showCost ? (line.price - (line.cost ?? 0)) * line.qty : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-card shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: line.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: line.image_url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium leading-tight", children: line.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px]", children: [
          showCost && line.cost ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Buy ",
            line.cost.toFixed(1)
          ] }) : null,
          showCost && line.cost ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("font-medium", profit >= 0 ? "text-emerald-600" : "text-rose-600"), children: [
            "· ",
            profit >= 0 ? "+" : "",
            profit.toFixed(2)
          ] }) : null
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold leading-none", children: amount.toFixed(2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "SAR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onRemove,
          className: "-mr-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 active:scale-95",
          "aria-label": "Remove",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-t border-border/40 bg-muted/20 px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center rounded-lg border border-border bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onQty(Math.max(0, line.qty - 1)),
            className: "flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground active:scale-95",
            "aria-label": "Decrease",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            value: line.qty || "",
            placeholder: "0",
            onChange: (e) => onQty(Math.max(0, Number(e.target.value) || 0)),
            className: "h-8 w-12 border-0 px-0 text-center text-sm font-semibold focus-visible:ring-0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onQty(line.qty + 1),
            className: "flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground active:scale-95",
            "aria-label": "Increase",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "SAR" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            step: "0.01",
            inputMode: "decimal",
            value: line.price || "",
            placeholder: "0.00",
            onChange: (e) => onPrice(Number(e.target.value) || 0),
            className: "h-8 flex-1 text-sm"
          }
        )
      ] })
    ] })
  ] });
}
const ProductPickRow = reactExports.memo(function ProductPickRow2({
  product,
  inCart,
  unitPrice,
  onAdd,
  onSetQty
}) {
  const active = !!inCart;
  const currentQty = inCart?.qty ?? 0;
  const [editing, setEditing] = reactExports.useState(false);
  function commit(raw) {
    const n = Math.max(0, Math.floor(Number(raw) || 0));
    if (n !== currentQty) onSetQty(n);
    setEditing(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: () => {
        if (!editing) onAdd();
      },
      onKeyDown: (e) => {
        if (!editing && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onAdd();
        }
      },
      className: cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-xl border p-2 text-left transition-all touch-manipulation active:scale-[0.99] select-none",
        active ? "border-primary/50 bg-primary/[0.04]" : "border-border/60 bg-card hover:border-border"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image_url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium leading-tight", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1.5 text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              "SAR ",
              unitPrice.toFixed(2)
            ] }),
            product.purchase_price && product.purchase_price > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/70", children: [
              "· Buy ",
              product.purchase_price.toFixed(0)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-muted-foreground", product.stock <= 0 && "text-rose-600"), children: [
              "· Stock ",
              product.stock
            ] })
          ] })
        ] }),
        active ? editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            type: "number",
            inputMode: "numeric",
            pattern: "[0-9]*",
            min: 0,
            defaultValue: currentQty || "",
            onFocus: (e) => e.currentTarget.select(),
            onClick: (e) => e.stopPropagation(),
            onPointerDown: (e) => e.stopPropagation(),
            onKeyDown: (e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.preventDefault();
                commit(e.target.value);
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setEditing(false);
              }
            },
            onBlur: (e) => commit(e.currentTarget.value),
            className: "h-9 w-16 rounded-full bg-primary px-2 text-center text-xs font-bold text-primary-foreground shadow-sm outline-none ring-2 ring-primary/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          },
          `edit-${currentQty}`
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              setEditing(true);
            },
            onPointerDown: (e) => e.stopPropagation(),
            className: "flex h-9 min-w-12 items-center justify-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110",
            "aria-label": "Edit quantity",
            children: currentQty
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
      ]
    }
  );
});
function PurchaseAttachmentField({
  value,
  onChange,
  uploading,
  setUploading
}) {
  const inputRef = reactExports.useRef(null);
  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { uploadProductImage } = await import("./image-upload-CX99TgIR.mjs");
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Attachment uploaded");
    } catch (err) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border/60 bg-muted/20 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Attachment (optional)" }),
    value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "Attachment", loading: "lazy", className: "h-12 w-12 rounded-md object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 truncate text-xs text-muted-foreground", children: "Invoice photo attached" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(null),
          className: "rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-rose-600",
          "aria-label": "Remove attachment",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: "image/*", className: "hidden", onChange: onPick }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "outline",
          className: "flex-1 h-8 text-xs",
          disabled: uploading,
          onClick: () => inputRef.current?.click(),
          children: uploading ? "Uploading…" : "Add invoice photo"
        }
      )
    ] })
  ] });
}
const STORAGE_KEY = "working_date_v1";
function todayISO() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const WorkingDateContext = reactExports.createContext(null);
function WorkingDateProvider({ children }) {
  const [workingDate, setWorkingDateState] = reactExports.useState(() => {
    if (typeof window === "undefined") return todayISO();
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    } catch {
    }
    return todayISO();
  });
  const [today, setToday] = reactExports.useState(() => todayISO());
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      const t = todayISO();
      setToday((prev) => prev !== t ? t : prev);
    }, 6e4);
    return () => clearInterval(id);
  }, []);
  const setWorkingDate = reactExports.useCallback((d) => {
    setWorkingDateState(d);
    try {
      localStorage.setItem(STORAGE_KEY, d);
    } catch {
    }
  }, []);
  const resetToToday = reactExports.useCallback(() => setWorkingDate(todayISO()), [setWorkingDate]);
  const value = reactExports.useMemo(() => ({
    workingDate,
    setWorkingDate,
    resetToToday,
    isToday: workingDate === today,
    today
  }), [workingDate, setWorkingDate, resetToToday, today]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WorkingDateContext.Provider, { value, children });
}
function useWorkingDate() {
  const ctx = reactExports.useContext(WorkingDateContext);
  if (!ctx) {
    const t = todayISO();
    return {
      workingDate: t,
      setWorkingDate: () => {
      },
      resetToToday: () => {
      },
      isToday: true,
      today: t
    };
  }
  return ctx;
}
const $$splitComponentImporter$q = () => import("./store-admin-DIMerWIC.mjs");
const Route$w = createFileRoute("/_app/store-admin")({
  validateSearch: (s) => ({
    tab: typeof s.tab === "string" ? s.tab : void 0,
    newSale: s.newSale === "1" || s.newSale === true ? "1" : void 0,
    paymentIn: s.paymentIn === "1" || s.paymentIn === true ? "1" : void 0,
    category: typeof s.category === "string" ? s.category : void 0,
    newName: typeof s.newName === "string" ? s.newName : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./shop-DO94Tvxg.mjs");
const Route$v = createFileRoute("/_app/shop")({
  validateSearch: (s) => ({
    edit: typeof s.edit === "string" ? s.edit : void 0,
    detail: typeof s.detail === "string" ? s.detail : void 0,
    highlight: typeof s.highlight === "string" ? s.highlight : void 0,
    date: typeof s.date === "string" ? s.date : void 0,
    shop: typeof s.shop === "string" ? s.shop : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup$1, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = RadioGroup$1.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RadioGroupItem$1,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupIndicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
const DropdownMenu = Root2$2;
const DropdownMenuTrigger = Trigger$1;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2$1,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2$1.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const Popover = Root2$3;
const PopoverTrigger = Trigger$2;
const PopoverAnchor = Anchor2;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2$2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2$2.displayName;
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
const SHOP_ORDER = ["Azzouz", "Nujum", "Aklas", "Khaled"];
const normalize$1 = (s) => (s ?? "").trim().toLowerCase();
const ORDER_INDEX = new Map(SHOP_ORDER.map((n, i) => [normalize$1(n), i]));
function shopRank(name) {
  const idx = ORDER_INDEX.get(normalize$1(name ?? ""));
  return idx === void 0 ? Number.MAX_SAFE_INTEGER : idx;
}
function sortShops(shops) {
  return [...shops].sort((a, b) => {
    const ra = shopRank(a.name);
    const rb = shopRank(b.name);
    if (ra !== rb) return ra - rb;
    return (a.name ?? "").localeCompare(b.name ?? "");
  });
}
function isSimpleShop(shop) {
  return shop?.shop_type === "simple_cash";
}
const SHOP_TYPE_LABEL = {
  full_erp: "Full ERP",
  simple_cash: "Simple Cash"
};
const shopOrder = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHOP_ORDER,
  SHOP_TYPE_LABEL,
  isSimpleShop,
  shopRank,
  sortShops
}, Symbol.toStringTag, { value: "Module" }));
const ALL_PAGES = [
  { key: "summary", label: "Home / Summary" },
  { key: "shop", label: "Shop" },
  { key: "reports", label: "Reports" },
  { key: "finance-workflow", label: "Finance Workflow" },
  { key: "cash-flow", label: "Cash Flow (legacy)" },
  { key: "cash-custody", label: "Cash Custody (legacy)" },
  { key: "daily-closing", label: "Daily Closing" },
  { key: "ai-insights", label: "Ask AI" },
  { key: "employees", label: "Employees" },
  { key: "company-transactions", label: "Company Transactions" },
  { key: "settings", label: "Settings" },
  { key: "team", label: "Team & Access" },
  { key: "backup-center", label: "Backup Center" },
  { key: "store-admin", label: "WholeSale" },
  { key: "sales-return", label: "Sales Returns" },
  { key: "my-expenses", label: "My Wallet (Employee)" },
  { key: "employee-expenses", label: "Employee Wallet (Admin)" },
  { key: "price-compare", label: "Price Compare" }
];
const ALL_KEYS = ALL_PAGES.map((p) => p.key);
const ROLE_DEFAULTS = {
  super_admin: ALL_KEYS,
  admin: ALL_KEYS,
  manager: ALL_KEYS,
  accountant: ["finance-workflow", "reports", "daily-closing", "summary"],
  cashier: ["shop", "my-expenses"],
  purchaser: ["finance-workflow", "my-expenses"],
  verifier: ["finance-workflow", "my-expenses"],
  deliveryman: ["store-admin", "my-expenses"],
  sales_delivery: ["store-admin", "my-expenses"],
  staff: ["summary", "shop", "reports", "my-expenses"],
  viewer: []
  // viewer only sees explicitly-granted pages
};
function computeAllowedPages(roles, explicitGrants) {
  const set = new Set(explicitGrants);
  for (const r of roles) {
    const defs = ROLE_DEFAULTS[r];
    if (defs) defs.forEach((k) => set.add(k));
  }
  if (roles.includes("super_admin") || roles.includes("admin")) return ALL_KEYS;
  return ALL_KEYS.filter((k) => set.has(k));
}
function pageKeyFromPath(pathname) {
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  if (!seg) return "summary";
  const match = ALL_KEYS.find((k) => k === seg);
  return match ?? null;
}
function isReadOnlyRole(roles) {
  if (!roles.length) return false;
  return roles.every((r) => r === "viewer");
}
const ROLE = enumType(["super_admin", "admin", "manager", "accountant", "cashier", "purchaser", "verifier", "deliveryman", "sales_delivery", "staff", "viewer"]);
const listManagedUsers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2923c6bfe4ee4a4c42cf27179544627629a97b4ba688a5ff8cd5a8b16649468d"));
const createManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  email: stringType().trim().email().max(255).optional().or(literalType("")),
  username: stringType().trim().min(2).max(60).regex(/^[a-zA-Z0-9._-]+$/).optional().or(literalType("")),
  mobile: stringType().trim().min(4).max(32).optional().or(literalType("")),
  password: stringType().min(1).max(128),
  full_name: stringType().trim().min(1).max(120),
  role: ROLE.optional(),
  roles: arrayType(ROLE).min(1).max(4).optional(),
  shop_ids: arrayType(stringType().uuid()).max(50).default([])
}).refine((d) => !!(d.email || d.username || d.mobile), {
  message: "Provide at least one of email, username, or mobile"
}).parse(input)).handler(createSsrRpc("86f2b33668784a5fa4206e065b7ed1d5b206632742a97de1a331f366e77fec51"));
const updateManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  full_name: stringType().trim().min(1).max(120).optional(),
  role: ROLE.optional(),
  roles: arrayType(ROLE).min(1).max(4).optional(),
  shop_ids: arrayType(stringType().uuid()).max(50).optional(),
  page_keys: arrayType(stringType().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40).optional(),
  landing_page: stringType().min(1).max(64).regex(/^[a-z0-9-]+$/).nullable().optional()
}).parse(input)).handler(createSsrRpc("466f52ae3ae5a562e460e6a1e5660a6e9322a7d2bbcb8dfca482364d895e2736"));
const setManagedUserDisabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  disabled: booleanType()
}).parse(input)).handler(createSsrRpc("f5f10a45a6775ac9aadc54a74c16557eca5da5a0a515c56b09d0b0b2cf6648eb"));
const resetManagedUserPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  new_password: stringType().min(1).max(128)
}).parse(input)).handler(createSsrRpc("199a1dfcb832cba4276a57d1ba65c2798db766ee68beae045fa1b236e6966fa0"));
const deleteManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0312b81896911627caa331f27642b01c3f60a445abbeb99db77fdae44a25331e"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  page_keys: arrayType(stringType().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40)
}).parse(input)).handler(createSsrRpc("acd09be1e16500c343548e01ee8271391acdb54c80c99aefefb211c4a49e831d"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("8289e6ec78b8c6cef7637f9b05c922be18560a6cdc25bafe41446ed4625056ba"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  enabled: booleanType()
}).parse(input)).handler(createSsrRpc("ada96da53a57089459bc3c0ca2412497b43a7f81cf001cdc531af5057a36d9d2"));
const $$splitComponentImporter$o = () => import("./settings-CmJ_1DAg.mjs");
reactExports.lazy(() => import("./themes-panel-klrD3_bS.mjs").then((m) => ({
  default: m.ThemesPanel
})));
const Route$u = createFileRoute("/_app/settings")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./sales-return-BOzEMUvi.mjs");
const Route$t = createFileRoute("/_app/sales-return")({
  validateSearch: (s) => ({
    new: s.new === "1" || s.new === 1 || s.new === true ? 1 : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./reports-oJPEmFoH.mjs");
const Route$s = createFileRoute("/_app/reports")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./push-test-CicO6FPw.mjs");
const Route$r = createFileRoute("/_app/push-test")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./profit-summary-Npl8sIoA.mjs");
const Route$q = createFileRoute("/_app/profit-summary")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./price-compare-DJrEJQFE.mjs");
const Route$p = createFileRoute("/_app/price-compare")({
  head: () => ({
    meta: [{
      title: "Price Compare — Independent Product Price Tracker"
    }, {
      name: "description",
      content: "Track and compare purchase, selling and offer prices of your products across markets and suppliers."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./overview-ClNtkGg3.mjs");
const Route$o = createFileRoute("/_app/overview")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./my-expenses-M3HthfAg.mjs");
const Route$n = createFileRoute("/_app/my-expenses")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./monthly-snapshot-Z3-r1I-w.mjs");
const Route$m = createFileRoute("/_app/monthly-snapshot")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./monthly-closing-CXFTDL19.mjs");
const Route$l = createFileRoute("/_app/monthly-closing")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./low-stock-Dlra94DE.mjs");
const Route$k = createFileRoute("/_app/low-stock")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./help-UxbcVJSH.mjs");
const Route$j = createFileRoute("/_app/help")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./finance-workflow-CKfSLp_x.mjs");
const Route$i = createFileRoute("/_app/finance-workflow")({
  validateSearch: (s) => {
    const t = s.tab;
    return {
      ...t === "custody" || t === "cash-flow" ? {
        tab: t
      } : {},
      ...typeof s.highlight === "string" ? {
        highlight: s.highlight
      } : {},
      ...typeof s.date === "string" ? {
        date: s.date
      } : {},
      ...typeof s.shop === "string" ? {
        shop: s.shop
      } : {}
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./dashboard-yHPOJIq_.mjs");
const Route$h = createFileRoute("/_app/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./daily-closing-C1OoIMyJ.mjs");
const Route$g = createFileRoute("/_app/daily-closing")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./company-transactions-BmLlnR1f.mjs");
const Route$f = createFileRoute("/_app/company-transactions")({
  validateSearch: (s) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : void 0,
    date: typeof s.date === "string" ? s.date : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const MAX_WAIT_MS = 15e3;
const HIGHLIGHT_MS = 4e3;
function useHighlightRecord(deps = []) {
  const search = useSearch({ strict: false });
  const router2 = useRouter();
  const target = search?.highlight ?? null;
  reactExports.useEffect(() => {
    if (!target) return;
    if (typeof window === "undefined") return;
    let cancelled = false;
    let observer = null;
    let timeoutId = null;
    const selector = `[data-record-id="${CSS.escape(target)}"]`;
    const settle = (el) => {
      if (cancelled) return;
      cancelled = true;
      observer?.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
      requestAnimationFrame(() => {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {
          el.scrollIntoView();
        }
        el.classList.add("magic-highlight");
        window.setTimeout(() => {
          el.classList.remove("magic-highlight");
          try {
            router2.navigate({
              to: ".",
              search: (prev) => {
                const { highlight: _h, date: _d, shop: _s, ...rest } = prev ?? {};
                return rest;
              },
              replace: true
            });
          } catch {
          }
        }, HIGHLIGHT_MS);
      });
    };
    const tryFind = () => {
      const el = document.querySelector(selector);
      if (el) settle(el);
      return !!el;
    };
    if (tryFind()) return;
    observer = new MutationObserver(() => {
      tryFind();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    timeoutId = window.setTimeout(() => {
      cancelled = true;
      observer?.disconnect();
    }, MAX_WAIT_MS);
    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [target, ...deps]);
}
function useUserAccess() {
  const { user } = useAuth();
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      return (data ?? []).map((r) => String(r.role));
    }
  });
  const { data: grants = [], isLoading: grantsLoading } = useQuery({
    queryKey: ["my-page-grants", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("user_page_access").select("page_key").eq("user_id", user.id);
      return (data ?? []).map((r) => String(r.page_key));
    }
  });
  const { data: shopIds = [], isLoading: shopsLoading } = useQuery({
    queryKey: ["my-shop-access", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("user_shop_access").select("shop_id").eq("user_id", user.id);
      return (data ?? []).map((r) => String(r.shop_id));
    }
  });
  const { data: landingPage = null } = useQuery({
    queryKey: ["my-landing-page", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("landing_page").eq("id", user.id).maybeSingle();
      return data?.landing_page ?? null;
    }
  });
  const allowed = computeAllowedPages(roles, grants);
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = isSuperAdmin || roles.includes("admin");
  const isManager = roles.includes("manager");
  const isAccountant = roles.includes("accountant");
  const isCashier = roles.includes("cashier");
  const isPurchaser = roles.includes("purchaser");
  const isVerifier = roles.includes("verifier");
  const isDeliveryman = roles.includes("deliveryman");
  const isSalesDelivery = roles.includes("sales_delivery");
  const isViewer = roles.includes("viewer");
  const isReadOnly = isReadOnlyRole(roles);
  const canVerify = isAdmin || isManager || isAccountant || isVerifier;
  const canAddPurchase = isAdmin || isManager || isPurchaser;
  const canAddCashIn = isAdmin || isManager || isAccountant;
  const canHandover = isAdmin || isManager || isAccountant || isPurchaser;
  const hasAllShops = isAdmin || isManager;
  const canAccessShop = (sid) => {
    if (hasAllShops) return true;
    if (!sid) return true;
    return shopIds.includes(sid);
  };
  const explicitLanding = landingPage && allowed.includes(landingPage) ? `/${landingPage}` : null;
  const primaryRoute = explicitLanding ?? (isCashier ? "/shop" : isDeliveryman ? "/store-admin" : isPurchaser || isVerifier ? "/finance-workflow" : isAdmin ? "/summary" : allowed.includes("summary") ? "/summary" : allowed.includes("finance-workflow") ? "/finance-workflow" : allowed[0] ? `/${allowed[0]}` : "/summary");
  return {
    roles,
    isSuperAdmin,
    isAdmin,
    isManager,
    isAccountant,
    isCashier,
    isPurchaser,
    isVerifier,
    isDeliveryman,
    isSalesDelivery,
    isViewer,
    isReadOnly,
    canVerify,
    canAddPurchase,
    canAddCashIn,
    canHandover,
    allowed,
    shopIds,
    hasAllShops,
    canAccessShop,
    loading: !user || rolesLoading || grantsLoading || shopsLoading,
    hasPage: (k) => isAdmin || allowed.includes(k),
    primaryRoute
  };
}
const Sheet = ({
  open,
  onOpenChange,
  ...props
}) => {
  useBackClose(open, onOpenChange);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog$1, { open, onOpenChange, ...props });
};
const SheetTrigger = DialogTrigger$1;
const SheetPortal = DialogPortal$1;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = DialogOverlay$1.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-md",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent$1, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = DialogContent$1.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = DialogTitle$1.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = DialogDescription$1.displayName;
const BUCKET = "attachments";
const cache = /* @__PURE__ */ new Map();
const TTL = 60 * 55;
function extractAttachmentPath(input) {
  if (!input) return null;
  const marker = `/object/public/${BUCKET}/`;
  const i = input.indexOf(marker);
  if (i >= 0) return decodeURIComponent(input.slice(i + marker.length));
  const marker2 = `/object/sign/${BUCKET}/`;
  const j = input.indexOf(marker2);
  if (j >= 0) {
    const rest = input.slice(j + marker2.length);
    return decodeURIComponent(rest.split("?")[0]);
  }
  return input.startsWith("http") ? null : input;
}
async function getSignedAttachmentUrl(input) {
  const path = extractAttachmentPath(input);
  if (!path) return null;
  const now = Date.now() / 1e3;
  const hit = cache.get(path);
  if (hit && hit.exp > now + 30) return hit.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  cache.set(path, { url: data.signedUrl, exp: now + TTL });
  return data.signedUrl;
}
function useSignedAttachmentUrl(input) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let active = true;
    if (!input) {
      setUrl(null);
      return;
    }
    getSignedAttachmentUrl(input).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [input]);
  return url;
}
function CfAttachmentLightbox({ open, items, startIndex = 0, onClose }) {
  const [idx, setIdx] = reactExports.useState(startIndex);
  const [scale, setScale] = reactExports.useState(1);
  const [rotate, setRotate] = reactExports.useState(0);
  const [fs, setFs] = reactExports.useState(false);
  useBackClose(open, (o) => {
    if (!o) onClose();
  });
  reactExports.useEffect(() => {
    if (open) {
      setIdx(Math.max(0, Math.min(startIndex, items.length - 1)));
      setScale(1);
      setRotate(0);
    }
  }, [open, startIndex, items.length]);
  reactExports.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(items.length - 1, i + 1));
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === "r") setRotate((r) => (r + 90) % 360);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, items.length]);
  if (!open || items.length === 0) return null;
  const cur = items[idx];
  const isPdf = (cur.mime ?? "").includes("pdf") || cur.url.toLowerCase().endsWith(".pdf");
  let startX = 0;
  const onStart = (e) => {
    startX = e.touches[0].clientX;
  };
  const onEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40 && scale === 1) {
      if (dx < 0) setIdx((i) => Math.min(items.length - 1, i + 1));
      else setIdx((i) => Math.max(0, i - 1));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: onClose,
      className: cn("fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-150", fs && "p-0"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2", onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/60 truncate", children: cur.label ?? `Attachment ${idx + 1} / ${items.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
            !isPdf && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setScale((s) => Math.max(s - 0.25, 0.5)), title: "Zoom out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-[40px] text-center text-xs text-white/70", children: [
                Math.round(scale * 100),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setScale((s) => Math.min(s + 0.25, 4)), title: "Zoom in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setRotate((r) => (r + 90) % 360), title: "Rotate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setFs((f) => !f), title: "Fullscreen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: onClose, title: "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-1 items-center justify-center overflow-hidden", onClick: (e) => e.stopPropagation(), onTouchStart: onStart, onTouchEnd: onEnd, children: [
          items.length > 1 && idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx(idx - 1), className: "absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" }) }),
          items.length > 1 && idx < items.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx(idx + 1), className: "absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" }) }),
          isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: cur.url, title: "attachment", className: "h-full w-full bg-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: cur.url,
              alt: cur.label ?? "attachment",
              className: "max-h-full max-w-full select-none rounded-lg shadow-2xl transition-transform",
              style: { transform: `scale(${scale}) rotate(${rotate}deg)` },
              draggable: false
            }
          )
        ] }),
        items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1 border-t border-white/10 py-2", onClick: (e) => e.stopPropagation(), children: items.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIdx(i), className: cn("h-1.5 rounded-full transition-all", i === idx ? "w-6 bg-white" : "w-1.5 bg-white/30") }, i)) })
      ]
    }
  );
}
function IconBtn({ children, onClick, title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      title,
      onClick,
      className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10",
      children
    }
  );
}
async function logActivity$1(action, target_id, meta = {}) {
  try {
    await supabase.from("cf_activity_log").insert({ action, target_table: "cash_flow_purchases", target_id, meta });
  } catch {
  }
}
function CfAttachmentManager({
  purchaseId,
  canEdit,
  compact = false
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [open, setOpen] = reactExports.useState(false);
  const [lbIdx, setLbIdx] = reactExports.useState(null);
  const [urls, setUrls] = reactExports.useState({});
  const fileRef = reactExports.useRef(null);
  const camRef = reactExports.useRef(null);
  const { data: attachments = [] } = useQuery({
    queryKey: ["cfpa", purchaseId],
    queryFn: async () => {
      const { data } = await supabase.from("cf_purchase_attachments").select("*").eq("purchase_id", purchaseId).order("uploaded_at", { ascending: true });
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    let dead = false;
    (async () => {
      const next = {};
      for (const a of attachments) {
        if (urls[a.id]) {
          next[a.id] = urls[a.id];
          continue;
        }
        const u = await getSignedAttachmentUrl(a.storage_path);
        if (u) next[a.id] = u;
      }
      if (!dead) setUrls(next);
    })();
    return () => {
      dead = true;
    };
  }, [attachments]);
  const upload = async (files) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `cash-flow/${purchaseId}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("attachments").upload(path, file, { contentType: file.type, upsert: false });
      if (up.error) {
        toast.error(up.error.message);
        continue;
      }
      const ins = await supabase.from("cf_purchase_attachments").insert({
        purchase_id: purchaseId,
        storage_path: path,
        mime: file.type,
        uploaded_by: user.id
      });
      if (ins.error) {
        toast.error(ins.error.message);
        continue;
      }
      logActivity$1("attachment.upload", purchaseId, { mime: file.type, name: file.name });
    }
    qc.invalidateQueries({ queryKey: ["cfpa", purchaseId] });
    toast.success("Attachment added");
  };
  const remove = async (a) => {
    if (!await confirm({ title: "Delete this attachment?", description: "The file will be permanently removed from storage and cannot be recovered.", confirmText: "Delete", tone: "danger" })) return;
    await supabase.storage.from("attachments").remove([a.storage_path]);
    const { error } = await supabase.from("cf_purchase_attachments").delete().eq("id", a.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    logActivity$1("attachment.delete", purchaseId, { id: a.id });
    qc.invalidateQueries({ queryKey: ["cfpa", purchaseId] });
  };
  const items = attachments.map((a) => ({
    url: urls[a.id] ?? "",
    mime: a.mime,
    label: new Date(a.uploaded_at).toLocaleString()
  })).filter((it) => !!it.url);
  const count = attachments.length;
  const chip = count > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => count > 0 && setLbIdx(0),
      className: "inline-flex h-6 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3 w-3" }),
        " ",
        count
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex h-6 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 text-[10px] font-medium text-amber-700 dark:text-amber-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
    " No file"
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      chip,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "icon",
          variant: "ghost",
          className: "h-6 w-6 text-muted-foreground hover:text-foreground",
          onClick: () => setOpen(true),
          title: "Manage attachments",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "max-h-[85vh] rounded-t-2xl p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "border-b border-border/40 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-sm", children: "Receipt attachments" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3", children: [
        canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: "image/*,application/pdf",
              multiple: true,
              hidden: true,
              onChange: (e) => {
                upload(e.target.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: camRef,
              type: "file",
              accept: "image/*",
              capture: "environment",
              hidden: true,
              onChange: (e) => {
                upload(e.target.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10", onClick: () => camRef.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
            " Camera"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-10", onClick: () => fileRef.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            " Upload"
          ] })
        ] }),
        attachments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground", children: [
          "No attachments yet. ",
          canEdit ? "Add a receipt or photo." : ""
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: attachments.map((a, i) => {
          const u = urls[a.id];
          const isPdf = (a.mime ?? "").includes("pdf");
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => u && setLbIdx(i), className: "absolute inset-0", children: isPdf || !u ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-[10px] font-medium text-muted-foreground", children: isPdf ? "PDF" : "…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: u, alt: "", className: "h-full w-full object-cover" }) }),
            canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => remove(a),
                className: cn("absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white group-hover:flex"),
                title: "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
              }
            )
          ] }, a.id);
        }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CfAttachmentLightbox,
      {
        open: lbIdx !== null,
        items,
        startIndex: lbIdx ?? 0,
        onClose: () => setLbIdx(null)
      }
    )
  ] });
}
const scanDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  // Data URL (base64) of the uploaded image. PDFs should be rendered to image client-side first.
  imageDataUrl: stringType().min(20).max(15e6),
  mimeType: stringType().default("image/jpeg")
}).parse(input)).handler(createSsrRpc("e27b523ea095daa7d1e0d0e90d742cdfcc609072796482d7ca2bb2c7e29cf0ff"));
const KEY = "ocr-cache:v1";
const MAX = 50;
async function sha256(s) {
  if (typeof crypto === "undefined" || !crypto.subtle) return String(s.length) + ":" + s.slice(0, 32);
  const buf = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function readAll() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function writeAll(rows) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX)));
  } catch {
  }
}
async function scanDocumentCached(input) {
  const hash = await sha256(input.imageDataUrl);
  const all = readAll();
  const hit = all.find((e) => e.hash === hash);
  if (hit) {
    writeAll([...all.filter((e) => e.hash !== hash), { ...hit, at: Date.now() }]);
    return hit.result;
  }
  const result = await scanDocument({ data: { imageDataUrl: input.imageDataUrl, mimeType: input.mimeType ?? "image/jpeg" } });
  writeAll([...all, { hash, result, at: Date.now() }]);
  return result;
}
async function enhanceForOcr(file, opts = {}) {
  if (!file.type.startsWith("image/")) return file;
  const {
    maxEdge = 1200,
    quality = 0.72,
    contrast = 1.25,
    grayscale = true,
    sharpen = true
  } = opts;
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * s));
    const h = Math.max(1, Math.round(bmp.height * s));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const c = contrast;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];
      if (grayscale) {
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = y;
      }
      r = clamp((r - 128) * c + 128);
      g = clamp((g - 128) * c + 128);
      b = clamp((b - 128) * c + 128);
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
    }
    ctx.putImageData(img, 0, 0);
    if (sharpen) applyUnsharp(ctx, w, h, 0.6);
    const blob = await new Promise(
      (res) => canvas.toBlob(res, "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File(
      [blob],
      file.name.replace(/\.\w+$/, "") + ".ocr.jpg",
      { type: "image/jpeg" }
    );
  } catch {
    return file;
  }
}
function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}
function applyUnsharp(ctx, w, h, amount) {
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const s = src.data, o = dst.data;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      for (let k = 0; k < 3; k++) {
        let sum = 0;
        for (let yy = -1; yy <= 1; yy++)
          for (let xx = -1; xx <= 1; xx++)
            sum += s[((y + yy) * w + (x + xx)) * 4 + k];
        const blur = sum / 9;
        o[i + k] = clamp(s[i + k] + amount * (s[i + k] - blur));
      }
      o[i + 3] = 255;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
        const i = (y * w + x) * 4;
        o[i] = s[i];
        o[i + 1] = s[i + 1];
        o[i + 2] = s[i + 2];
        o[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(dst, 0, 0);
}
const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const BN_MAP = {
  "অ": "a",
  "আ": "a",
  "ই": "i",
  "ঈ": "i",
  "উ": "u",
  "ঊ": "u",
  "ঋ": "ri",
  "এ": "e",
  "ঐ": "oi",
  "ও": "o",
  "ঔ": "ou",
  "ক": "k",
  "খ": "kh",
  "গ": "g",
  "ঘ": "gh",
  "ঙ": "ng",
  "চ": "ch",
  "ছ": "ch",
  "জ": "j",
  "ঝ": "jh",
  "ঞ": "n",
  "ট": "t",
  "ঠ": "th",
  "ড": "d",
  "ঢ": "dh",
  "ণ": "n",
  "ত": "t",
  "থ": "th",
  "দ": "d",
  "ধ": "dh",
  "ন": "n",
  "প": "p",
  "ফ": "ph",
  "ব": "b",
  "ভ": "bh",
  "ম": "m",
  "য": "y",
  "র": "r",
  "ল": "l",
  "শ": "sh",
  "ষ": "sh",
  "স": "s",
  "হ": "h",
  "ড়": "r",
  "ঢ়": "rh",
  "য়": "y",
  "ৎ": "t",
  "ং": "ng",
  "ঃ": "h",
  "ঁ": "",
  "া": "a",
  "ি": "i",
  "ী": "i",
  "ু": "u",
  "ূ": "u",
  "ৃ": "ri",
  "ে": "e",
  "ৈ": "oi",
  "ো": "o",
  "ৌ": "ou",
  "্": ""
};
const AR_MAP = {
  "ا": "a",
  "أ": "a",
  "إ": "i",
  "آ": "a",
  "ب": "b",
  "ت": "t",
  "ث": "th",
  "ج": "j",
  "ح": "h",
  "خ": "kh",
  "د": "d",
  "ذ": "dh",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "s",
  "ض": "d",
  "ط": "t",
  "ظ": "z",
  "ع": "a",
  "غ": "gh",
  "ف": "f",
  "ق": "q",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",
  "و": "w",
  "ي": "y",
  "ى": "a",
  "ئ": "y",
  "ؤ": "w",
  "ة": "a",
  "ء": "",
  "ـ": "",
  "َ": "",
  "ُ": "",
  "ِ": "",
  "ْ": "",
  "ّ": "",
  "ً": "",
  "ٌ": "",
  "ٍ": ""
};
function phoneticize(input) {
  if (!input) return "";
  let out = "";
  let hadNonLatin = false;
  for (const ch of input) {
    if (BN_MAP[ch] !== void 0) {
      out += BN_MAP[ch];
      hadNonLatin = true;
    } else if (AR_MAP[ch] !== void 0) {
      out += AR_MAP[ch];
      hadNonLatin = true;
    } else out += ch;
  }
  if (!hadNonLatin) return "";
  return out.toLowerCase().replace(/\s+/g, " ").trim();
}
function normalize(input) {
  if (!input) return "";
  let s = input.toString();
  s = s.replace(/./g, (ch) => {
    const b = BENGALI_DIGITS.indexOf(ch);
    if (b >= 0) return String(b);
    const a = ARABIC_DIGITS.indexOf(ch);
    if (a >= 0) return String(a);
    return ch;
  });
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.toLowerCase().replace(/[.,;:!?'"()\[\]{}\-_/\\]+/g, " ").replace(/\s+/g, " ").trim();
  return s;
}
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}
function tokenSim(a, b) {
  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  ta.forEach((t) => {
    if (tb.has(t)) inter++;
  });
  return inter / (ta.size + tb.size - inter);
}
function similarity(a, b) {
  const na = normalize(a), nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const d = lev(na, nb);
  const m = Math.max(na.length, nb.length);
  const ed = 1 - d / m;
  const ts = tokenSim(na, nb);
  const sub = na.length >= 2 && (nb.includes(na) || na.includes(nb)) ? 0.85 : 0;
  const pa = phoneticize(a), pb = phoneticize(b);
  let phon = 0;
  if (pa || pb) {
    const xa = pa || na, xb = pb || nb;
    if (xa && xb) {
      const ld = lev(xa, xb);
      const lm = Math.max(xa.length, xb.length);
      phon = Math.max(1 - ld / lm, tokenSim(xa, xb));
      if (xa.length >= 2 && (xb.includes(xa) || xa.includes(xb))) phon = Math.max(phon, 0.82);
    }
  }
  return Math.max(ed, ts, sub, phon);
}
function matchAlias(raw, aliases) {
  if (!raw || !aliases.length) return null;
  const n = normalize(raw);
  if (!n) return null;
  for (const a of aliases) {
    if (a.alias_normalized === n) {
      return { canonical: a.canonical, score: 1, reason: "exact", alias: a };
    }
  }
  for (const a of aliases) {
    if (normalize(a.canonical) === n) {
      return { canonical: a.canonical, score: 1, reason: "exact", alias: a };
    }
  }
  let best = null;
  for (const a of aliases) {
    const s1 = similarity(n, a.alias_normalized);
    const s2 = similarity(n, a.canonical);
    const score = Math.max(s1, s2);
    if (score >= 0.7 && (!best || score > best.score)) {
      best = { canonical: a.canonical, score, reason: "fuzzy", alias: a };
    }
  }
  return best;
}
async function fetchAliases() {
  const { data, error } = await supabase.from("company_aliases").select("id, alias, alias_normalized, canonical, usage_count, source").order("usage_count", { ascending: false }).limit(1e3);
  if (error) return [];
  return data ?? [];
}
async function learnAlias(rawAlias, canonical, source = "auto") {
  const alias = rawAlias.trim();
  const canon = canonical.trim();
  if (!alias || !canon) return;
  const alias_normalized = normalize(alias);
  if (!alias_normalized || alias_normalized === normalize(canon)) return;
  const existing = await supabase.from("company_aliases").select("id, usage_count").eq("alias_normalized", alias_normalized).eq("canonical", canon).maybeSingle();
  if (existing.data?.id) {
    await supabase.from("company_aliases").update({ usage_count: (existing.data.usage_count ?? 0) + 1 }).eq("id", existing.data.id);
    return;
  }
  await supabase.from("company_aliases").insert({
    alias,
    alias_normalized,
    canonical: canon,
    source,
    usage_count: 1
  });
}
const CONF_TONE = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
};
function CfPurchaseSmartForm({
  onSubmit,
  busy
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [company, setCompany] = reactExports.useState("");
  const [cash, setCash] = reactExports.useState("");
  const [due, setDue] = reactExports.useState("");
  const [credit, setCredit] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [scan, setScan] = reactExports.useState(null);
  const [aliasSaved, setAliasSaved] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const camRef = reactExports.useRef(null);
  const { data: aliases = [] } = useQuery({
    queryKey: ["aliases"],
    queryFn: fetchAliases,
    staleTime: 5 * 6e4
  });
  const saveAlias = async (rawAlias, canonical) => {
    try {
      await learnAlias(rawAlias, canonical, "manual");
      setAliasSaved(true);
      qc.invalidateQueries({ queryKey: ["aliases"] });
      toast.success(`Alias saved: "${rawAlias}" → ${canonical}`);
    } catch (e) {
      toast.error(e?.message ?? "Failed to save alias");
    }
  };
  useServerFn(scanDocument);
  const attachAndScan = useMutation({
    mutationFn: async (raw) => {
      const enhanced = await enhanceForOcr(raw, { maxEdge: 1400, quality: 0.78 });
      const reader = new FileReader();
      const dataUrl = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(enhanced);
      });
      const result = await scanDocumentCached({
        imageDataUrl: dataUrl,
        mimeType: enhanced.type
      });
      return { enhanced, dataUrl, result };
    },
    onSuccess: ({ enhanced, dataUrl, result }) => {
      setFile(enhanced);
      setPreview(dataUrl);
      const amount = Number(result?.grand_total) || Number(result?.cash_buy_total) || Number(result?.due_buy_total) || null;
      const rawCompany = typeof result?.shop_name === "string" && result.shop_name || Array.isArray(result?.rows) && result.rows[0]?.brand || null;
      let matched = null;
      let matchScore = null;
      if (rawCompany) {
        const m = matchAlias(rawCompany, aliases);
        if (m) {
          matched = m.canonical;
          matchScore = m.score;
        }
      }
      const conf = result?.field_confidence?.totals === "high" ? "high" : result?.field_confidence?.totals === "medium" ? "medium" : result?.confidence === "high" ? "high" : result?.confidence === "medium" ? "medium" : "low";
      const detectedCompany = matched ?? rawCompany ?? "";
      setScan({
        company: detectedCompany || null,
        amount,
        date: result?.date ?? null,
        confidence: conf,
        matchedCanonical: matched,
        matchScore,
        raw: result
      });
      if (!company.trim() && detectedCompany) setCompany(detectedCompany);
      if (!cash && !due && !credit && amount && amount > 0) setCash(String(amount));
      toast.success("Receipt scanned");
    },
    onError: (e) => toast.error(e?.message ?? "OCR failed")
  });
  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setScan(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    attachAndScan.mutate(f);
  };
  const clearAttachment = () => {
    setFile(null);
    setPreview(null);
    setScan(null);
  };
  const submit = (e) => {
    e.preventDefault();
    if (!company.trim()) {
      toast.error("Company required");
      return;
    }
    const c = Number(cash) || 0, d = Number(due) || 0, cr = Number(credit) || 0;
    if (c + d + cr <= 0) {
      toast.error("Enter at least one amount");
      return;
    }
    if (scan?.company && scan.company.trim() && company.trim() && scan.company.trim().toLowerCase() !== company.trim().toLowerCase()) {
      learnAlias(scan.company, company.trim(), "auto").catch(() => {
      });
    }
    onSubmit({
      company: company.trim(),
      cash: c,
      due: d,
      credit: cr,
      notes: notes.trim(),
      ocr_confidence: scan?.confidence ?? null,
      ocr_meta: scan ? {
        amount: scan.amount,
        date: scan.date,
        detected_company: scan.company,
        matched_canonical: scan.matchedCanonical,
        match_score: scan.matchScore
      } : null,
      receiptFile: file
    });
    setCompany("");
    setCash("");
    setDue("");
    setCredit("");
    setNotes("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setScan(null);
    setAliasSaved(false);
  };
  const enteredTotal = (Number(cash) || 0) + (Number(due) || 0) + (Number(credit) || 0);
  const amountMismatch = scan?.amount && enteredTotal > 0 && Math.abs(scan.amount - enteredTotal) > Math.max(2, scan.amount * 0.02);
  const detected = scan?.company?.trim() ?? "";
  const typed = company.trim();
  const aliasOpportunity = !aliasSaved && detected.length > 0 && typed.length > 0 && detected.toLowerCase() !== typed.toLowerCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-2", onSubmit: submit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "col-span-3 h-10 text-sm",
          placeholder: "Company (Almarai, Nadec…)",
          value: company,
          onChange: (e) => setCompany(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-10", placeholder: "Cash", inputMode: "decimal", value: cash, onChange: (e) => setCash(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-10", placeholder: "Due", inputMode: "decimal", value: due, onChange: (e) => setDue(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "h-10", placeholder: "Credit", inputMode: "decimal", value: credit, onChange: (e) => setCredit(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "col-span-3 h-9 text-xs", placeholder: "Notes (optional)", value: notes, onChange: (e) => setNotes(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: camRef,
          type: "file",
          accept: "image/*",
          capture: "environment",
          hidden: true,
          onChange: (e) => {
            pickFile(e.target.files?.[0] ?? null);
            e.currentTarget.value = "";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/*,application/pdf",
          hidden: true,
          onChange: (e) => {
            pickFile(e.target.files?.[0] ?? null);
            e.currentTarget.value = "";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "h-10 rounded-xl", onClick: () => camRef.current?.click(), disabled: attachAndScan.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
        " Scan receipt"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "h-10 rounded-xl", onClick: () => fileRef.current?.click(), disabled: attachAndScan.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
        " Upload"
      ] })
    ] }),
    (preview || attachAndScan.isPending || scan) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-2 rounded-xl border border-border/60 bg-muted/30 p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted", children: [
        preview ? preview.startsWith("data:application/pdf") || file?.type === "application/pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-[10px] font-medium text-muted-foreground", children: "PDF" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: preview, alt: "receipt", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-[10px] text-muted-foreground", children: "…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearAttachment,
            className: "absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white",
            title: "Remove",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1 space-y-1", children: attachAndScan.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
        " Running OCR…"
      ] }) : scan ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Detected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: cn("h-5 px-1.5 text-[9px] capitalize", CONF_TONE[scan.confidence]), children: [
            scan.confidence,
            " confidence"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] leading-tight text-muted-foreground", children: [
          scan.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Supplier: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: scan.company }),
            scan.matchedCanonical && scan.matchScore && scan.matchScore < 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] text-muted-foreground", children: "(matched)" }) : null
          ] }),
          scan.amount != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Amount: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: scan.amount })
          ] }),
          scan.date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Date: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: scan.date })
          ] })
        ] }),
        amountMismatch && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-700 dark:text-amber-400", children: "⚠ Entered total differs from receipt total — double-check." }),
        aliasOpportunity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => saveAlias(detected, typed),
            className: "inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "h-3 w-3" }),
              'Save "',
              detected,
              '" → ',
              typed
            ]
          }
        ),
        aliasSaved && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
          " Alias saved"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: "Receipt attached." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy || attachAndScan.isPending, className: "h-11 w-full rounded-xl text-sm font-semibold", children: file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
      " Add Purchase with Receipt"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      " Add Purchase"
    ] }) })
  ] });
}
function useWorkflowVerified(workingDate) {
  const { data } = useQuery({
    queryKey: ["cf-workflow-lock", workingDate],
    queryFn: async () => {
      const { data: data2 } = await supabase.from("cash_flow_day_locks").select("*").is("shop_id", null).eq("day_date", workingDate).maybeSingle();
      return data2 ?? null;
    }
  });
  return { lock: data ?? null, verified: !!data?.is_locked };
}
function CfWorkflowVerification() {
  const { user } = useAuth();
  const { workingDate } = useWorkingDate();
  const { isAdmin } = useUserAccess();
  const qc = useQueryClient();
  const profiles = useProfileMap();
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const { lock, verified } = useWorkflowVerified(workingDate);
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ["cf-workflow-pending", workingDate],
    queryFn: async () => {
      const { count } = await supabase.from("cash_flow_purchases").select("id", { count: "exact", head: true }).eq("day_date", workingDate).eq("verify_status", "pending").eq("is_deleted", false);
      return count ?? 0;
    }
  });
  const { data: proofCount = 0 } = useQuery({
    queryKey: ["cf-workflow-proofs", workingDate],
    queryFn: async () => {
      const { count } = await supabase.from("cf_closing_proofs").select("id", { count: "exact", head: true }).eq("day_date", workingDate);
      return count ?? 0;
    }
  });
  const verifier = reactExports.useMemo(
    () => lock?.locked_by ? profiles[lock.locked_by] ?? null : null,
    [lock, profiles]
  );
  const canFinalize = isAdmin && pendingCount === 0 && proofCount > 0 && !verified;
  const disabledReason = verified ? "Workflow already finalized." : !isAdmin ? "Only admins can finalize the workflow." : pendingCount > 0 ? `${pendingCount} pending transaction${pendingCount === 1 ? "" : "s"} must be verified or rejected.` : proofCount === 0 ? "Upload a Closing Proof image first." : "";
  const finalize = async () => {
    if (!user) return;
    setBusy(true);
    try {
      let error;
      if (lock) {
        const { error: e } = await supabase.from("cash_flow_day_locks").update({
          is_locked: true,
          locked_by: user.id,
          locked_at: (/* @__PURE__ */ new Date()).toISOString(),
          unlocked_by: null,
          unlocked_at: null
        }).eq("id", lock.id);
        error = e;
      } else {
        const { error: e } = await supabase.from("cash_flow_day_locks").insert({
          shop_id: null,
          day_date: workingDate,
          is_locked: true,
          locked_by: user.id,
          locked_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        error = e;
      }
      if (error) throw error;
      try {
        await supabase.from("cf_activity_log").insert({
          action: "workflow.verify",
          target_table: "cash_flow_day_locks",
          meta: { day_date: workingDate, pending: 0, proofs: proofCount }
        });
      } catch {
      }
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["cf-workflow-lock", workingDate] }),
        qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
        qc.invalidateQueries({ queryKey: ["cf_lock"] })
      ]);
      toast.success("✓ Finance Workflow finalized and locked.");
      setConfirmOpen(false);
    } catch (e) {
      toast.error(e?.message ?? "Failed to finalize workflow");
    } finally {
      setBusy(false);
    }
  };
  if (verified) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-4 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-none", children: "Finance Workflow Verified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
            " Verified"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[11px] leading-relaxed text-muted-foreground", children: "This Finance Workflow has been finalized and is locked." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-muted-foreground", children: [
            "Verified by",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: displayProfile(verifier) })
          ] }),
          lock?.locked_at && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              new Date(lock.locked_at).toLocaleDateString(),
              " ",
              new Date(lock.locked_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 shrink-0 text-emerald-600" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 border-b border-border/40 bg-gradient-to-br from-primary/5 to-transparent px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold leading-none", children: "Finalize Workflow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "Lock the day's Finance Workflow once every transaction is verified and a Closing Proof is on file." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChecklistRow,
            {
              ok: pendingCount === 0,
              label: pendingCount === 0 ? "All transactions verified" : `${pendingCount} pending`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChecklistRow,
            {
              ok: proofCount > 0,
              label: proofCount > 0 ? "Closing Proof uploaded" : "Closing Proof required"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: cn(
              "h-12 w-full rounded-xl text-sm font-semibold shadow-[0_6px_20px_-6px_rgba(16,185,129,0.55)]",
              "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110"
            ),
            disabled: !canFinalize || busy,
            onClick: () => setConfirmOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
              " Verify Workflow"
            ]
          }
        ),
        !canFinalize && disabledReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5 text-[11px] text-amber-700 dark:text-amber-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3 w-3 shrink-0" }),
          disabledReason
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmOpen, onOpenChange: (o) => {
      if (!o && !busy) setConfirmOpen(false);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Finalize today's Finance Workflow?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "After verification:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "ml-4 list-disc space-y-1 text-[13px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "No more editing." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "No more deleting." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Workflow will be locked." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            disabled: busy,
            className: "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110",
            onClick: (e) => {
              e.preventDefault();
              finalize();
            },
            children: "Verify Workflow"
          }
        )
      ] })
    ] }) })
  ] });
}
function ChecklistRow({ ok, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
    "flex items-center gap-1.5 rounded-lg border px-2 py-1.5",
    ok ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300" : "border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300"
  ), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
      "grid h-4 w-4 place-items-center rounded-full",
      ok ? "bg-emerald-500/25" : "bg-amber-500/25"
    ), children: ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: label })
  ] });
}
async function logActivity(action, target_id, meta = {}) {
  try {
    await supabase.from("cf_activity_log").insert({ action, target_table: "cash_flow_purchases", target_id, meta });
  } catch {
  }
}
const CONF_BADGE = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"
};
const Route$e = createFileRoute("/_app/cash-flow")({
  beforeLoad: () => {
    throw redirect({ to: "/finance-workflow" });
  },
  component: CashFlowPage
});
const WAREHOUSE = "__wh__";
function CashFlowPage() {
  useHighlightRecord();
  const search = useSearch({ strict: false });
  const { user } = useAuth();
  const { workingDate, setWorkingDate, today, isToday } = useWorkingDate();
  const qc = useQueryClient();
  const access = useUserAccess();
  const { isAdmin, canVerify, canAddPurchase, canAddCashIn } = access;
  const { data: shopsRaw = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return data ?? [];
    }
  });
  const shops = reactExports.useMemo(() => sortShops(shopsRaw), [shopsRaw]);
  const [activeShop, setActiveShop] = reactExports.useState("");
  const currentShopId = activeShop && activeShop !== WAREHOUSE ? activeShop : null;
  if (!activeShop && shops.length) setTimeout(() => setActiveShop(shops[0].id), 0);
  reactExports.useEffect(() => {
    if (!search.highlight) return;
    if (search.date && search.date !== workingDate) setWorkingDate(search.date);
    if (search.shop) setActiveShop(search.shop);
  }, [search.highlight, search.date, search.shop, setWorkingDate, workingDate]);
  const { data: cashIns = [] } = useQuery({
    queryKey: ["cf_cashin", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = supabase.from("cash_flow_cash_in").select("*").eq("day_date", workingDate).eq("is_deleted", false);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!activeShop
  });
  const { data: purchases = [] } = useQuery({
    queryKey: ["cf_purchases", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = supabase.from("cash_flow_purchases").select("*").eq("day_date", workingDate).eq("is_deleted", false);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!activeShop
  });
  const { data: lock } = useQuery({
    queryKey: ["cf_lock", currentShopId ?? "wh", workingDate],
    queryFn: async () => {
      let q = supabase.from("cash_flow_day_locks").select("*").eq("day_date", workingDate);
      q = currentShopId ? q.eq("shop_id", currentShopId) : q.is("shop_id", null);
      const { data } = await q.maybeSingle();
      return data ?? null;
    },
    enabled: !!activeShop
  });
  const { verified: workflowVerified } = useWorkflowVerified(workingDate);
  const locked = !!lock?.is_locked || workflowVerified;
  const totals = reactExports.useMemo(() => {
    const cashIn = cashIns.reduce((s, r) => s + Number(r.amount || 0), 0);
    let cashSpent = 0, due = 0, credit = 0, verified = 0, pending = 0, rejected = 0;
    for (const p of purchases) {
      cashSpent += Number(p.cash_amount || 0);
      due += Number(p.due_amount || 0);
      credit += Number(p.credit_amount || 0);
      const row = Number(p.cash_amount || 0) + Number(p.due_amount || 0) + Number(p.credit_amount || 0);
      if (p.verify_status === "verified") verified += row;
      else if (p.verify_status === "rejected") rejected += row;
      else pending += row;
    }
    return { cashIn, cashSpent, due, credit, total: cashSpent + due + credit, remaining: cashIn - cashSpent, verified, pending, rejected };
  }, [cashIns, purchases]);
  const warnings = reactExports.useMemo(() => {
    const w = [];
    if (totals.remaining < 0) w.push(`Purchases exceed cash in by ${SAR(Math.abs(totals.remaining))}`);
    const names = /* @__PURE__ */ new Map();
    for (const p of purchases) {
      const k = (p.company || "").trim().toLowerCase();
      if (!k) continue;
      names.set(k, (names.get(k) || 0) + 1);
    }
    for (const [k, c] of names) if (c > 1) w.push(`Duplicate supplier: "${k}" (${c} rows)`);
    const big = purchases.find((p) => p.cash_amount + p.due_amount + p.credit_amount > 5e4);
    if (big) w.push(`Unusually large entry for "${big.company}" — please double-check`);
    const stillPending = purchases.filter((p) => p.verify_status === "pending").length;
    if (stillPending > 0 && !locked) w.push(`${stillPending} row(s) still unverified — verify before closing the day`);
    return w;
  }, [purchases, totals.remaining, locked]);
  const addCashIn = useMutation({
    mutationFn: async (input) => {
      const { error } = await supabase.from("cash_flow_cash_in").insert({
        shop_id: currentShopId,
        day_date: workingDate,
        amount: input.amount,
        source: input.source || null,
        notes: input.notes || null,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_cashin"] });
      toast.success("Cash In added");
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const delCashIn = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cash_flow_cash_in").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_cashin"] });
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const addPurchase = useMutation({
    mutationFn: async (input) => {
      const { data: row, error } = await supabase.from("cash_flow_purchases").insert({
        shop_id: currentShopId,
        day_date: workingDate,
        company: input.company.trim(),
        cash_amount: input.cash,
        due_amount: input.due,
        credit_amount: input.credit,
        notes: input.notes || null,
        created_by: user.id,
        ocr_confidence: input.ocr_confidence,
        ocr_meta: input.ocr_meta
      }).select("id").single();
      if (error) throw error;
      if (input.receiptFile && row?.id) {
        const ext = (input.receiptFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `cash-flow/${row.id}/${crypto.randomUUID()}.${ext}`;
        const up = await supabase.storage.from("attachments").upload(path, input.receiptFile, {
          contentType: input.receiptFile.type,
          upsert: false
        });
        if (!up.error) {
          await supabase.from("cf_purchase_attachments").insert({
            purchase_id: row.id,
            storage_path: path,
            mime: input.receiptFile.type,
            uploaded_by: user.id
          });
          logActivity("attachment.upload", row.id, { source: "smart-form" });
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_purchases"] });
      qc.invalidateQueries({ queryKey: ["cfpa"] });
      toast.success("Purchase added");
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status, reason }) => {
      const patch = { verify_status: status };
      if (status === "verified") {
        patch.verified_by = user.id;
        patch.verified_at = (/* @__PURE__ */ new Date()).toISOString();
        patch.reject_reason = null;
      } else if (status === "rejected") {
        patch.verified_by = user.id;
        patch.verified_at = (/* @__PURE__ */ new Date()).toISOString();
        patch.reject_reason = reason ?? null;
      } else {
        patch.verified_by = null;
        patch.verified_at = null;
        patch.reject_reason = null;
      }
      const { error } = await supabase.from("cash_flow_purchases").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cf_purchases"] });
      qc.invalidateQueries({ queryKey: ["cf-workflow-pending"] });
      qc.invalidateQueries({ queryKey: ["cf-bulk-pending"] });
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const delPurchase = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cash_flow_purchases").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cf_purchases"] }),
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const toggleLock = useMutation({
    mutationFn: async (next) => {
      if (lock) {
        const patch = next ? { is_locked: true, locked_by: user.id, locked_at: (/* @__PURE__ */ new Date()).toISOString() } : { is_locked: false, unlocked_by: user.id, unlocked_at: (/* @__PURE__ */ new Date()).toISOString() };
        const { error } = await supabase.from("cash_flow_day_locks").update(patch).eq("id", lock.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cash_flow_day_locks").insert({
          shop_id: currentShopId,
          day_date: workingDate,
          is_locked: next,
          locked_by: next ? user.id : null,
          locked_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (error) throw error;
      }
    },
    onSuccess: (_d, next) => {
      qc.invalidateQueries({ queryKey: ["cf_lock"] });
      toast.success(next ? "Day locked" : "Day unlocked");
    },
    onError: (e) => toast.error(e.message ?? "Only admin can lock/unlock")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack mx-auto max-w-3xl px-3 pt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-[18px] w-[18px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-semibold leading-tight", children: "Cash Flow Verification" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Track cash, verify purchases, lock the day" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          value: workingDate,
          max: today,
          onChange: (e) => setWorkingDate(e.target.value),
          className: "h-8 w-[140px] text-xs"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: activeShop, onValueChange: setActiveShop, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex w-full justify-start gap-1 overflow-x-auto rounded-2xl bg-muted/60 p-1", children: [
      shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: s.id, className: "rounded-xl px-3 text-xs", children: s.name }, s.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: WAREHOUSE, className: "rounded-xl px-3 text-xs", children: "Warehouse" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn(
      "flex items-center justify-between gap-2 px-4 py-3",
      locked ? "border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5" : "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        locked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-amber-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-4 w-4 text-emerald-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: locked ? "Day locked" : "Day open" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: locked ? `Locked ${lock?.locked_at ? new Date(lock.locked_at).toLocaleString() : ""}` : "Entries can be added and verified" })
        ] })
      ] }),
      isAdmin && !workflowVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: locked ? "outline" : "default", onClick: () => toggleLock.mutate(!locked), children: locked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-3.5 w-3.5" }),
        " Unlock"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
        " Lock Day"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), label: "Total Cash In", value: totals.cashIn, tone: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }), label: "Total Purchase", value: totals.total, tone: "indigo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), label: "Remaining Cash", value: totals.remaining, tone: totals.remaining < 0 ? "red" : "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }), label: "Verified", value: totals.verified, tone: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }), label: "Pending", value: totals.pending, tone: "amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }), label: "Due + Credit", value: totals.due + totals.credit, tone: "slate" })
    ] }),
    warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-1 border-amber-500/40 bg-amber-50/50 px-4 py-3 dark:bg-amber-500/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
        " Smart Warnings"
      ] }),
      warnings.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-amber-700/90 dark:text-amber-300/90", children: [
        "• ",
        w
      ] }, i))
    ] }),
    workflowVerified && !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-start gap-2 border-emerald-500/40 bg-emerald-50/50 px-3 py-2.5 text-[11px] text-emerald-800 dark:bg-emerald-500/5 dark:text-emerald-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mt-0.5 h-3.5 w-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "This Finance Workflow has been finalized and is locked." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Cash In", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }), children: [
      !locked && canAddCashIn && /* @__PURE__ */ jsxRuntimeExports.jsx(CashInForm, { onSubmit: (v) => addCashIn.mutate(v), busy: addCashIn.isPending }),
      !locked && !canAddCashIn && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Your role can view but not add Cash In." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        cashIns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No cash in yet" }),
        cashIns.map((c) => {
          const canRemove = isAdmin || !locked && c.created_by === user?.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: SAR(c.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
                c.source ?? "—",
                c.notes ? ` · ${c.notes}` : ""
              ] })
            ] }),
            canRemove && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-7 w-7",
                onClick: async () => {
                  if (workflowVerified) {
                    const reason = await promptAdminOverride("delete cash-in");
                    if (!reason) return;
                    delCashIn.mutate(c.id);
                    logActivity("cash_in.delete", c.id, { reason, prev: { amount: c.amount, source: c.source }, workflow_verified: true });
                  } else {
                    delCashIn.mutate(c.id);
                  }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
              }
            )
          ] }, c.id);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Purchase Verification", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }), children: [
      !locked && canAddPurchase && /* @__PURE__ */ jsxRuntimeExports.jsx(CfPurchaseSmartForm, { onSubmit: (v) => addPurchase.mutate(v), busy: addPurchase.isPending }),
      !locked && !canAddPurchase && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Your role can verify but not create purchases." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BatchPurchaseList,
        {
          purchases,
          locked,
          canVerify,
          isAdmin,
          userId: user?.id,
          adminOverride: workflowVerified && isAdmin,
          onSingleReject: async (p) => {
            if (workflowVerified) {
              const overrideReason = await promptAdminOverride("reject transaction");
              if (!overrideReason) return;
              const reason2 = window.prompt("Reject reason?", p.reject_reason ?? "") ?? "";
              setStatus.mutate({ id: p.id, status: "rejected", reason: reason2 });
              logActivity("purchase.reject", p.id, { reason: reason2, override_reason: overrideReason, prev_status: p.verify_status, workflow_verified: true });
              return;
            }
            const reason = window.prompt("Reject reason?", p.reject_reason ?? "") ?? "";
            setStatus.mutate({ id: p.id, status: "rejected", reason });
            logActivity("purchase.reject", p.id, { reason });
          },
          onReset: async (p) => {
            if (workflowVerified) {
              const reason = await promptAdminOverride("reset transaction to pending");
              if (!reason) return;
              setStatus.mutate({ id: p.id, status: "pending" });
              logActivity("purchase.reset", p.id, { reason, prev_status: p.verify_status, workflow_verified: true });
              return;
            }
            setStatus.mutate({ id: p.id, status: "pending" });
            logActivity("purchase.reset", p.id);
          },
          onDelete: async (p) => {
            if (workflowVerified) {
              const reason = await promptAdminOverride("delete transaction");
              if (!reason) return;
              delPurchase.mutate(p.id);
              logActivity("purchase.delete", p.id, {
                reason,
                prev: { company: p.company, cash: p.cash_amount, due: p.due_amount, credit: p.credit_amount, status: p.verify_status },
                workflow_verified: true
              });
              return;
            }
            delPurchase.mutate(p.id);
            logActivity("purchase.delete", p.id);
          },
          onBatchDone: () => {
            qc.invalidateQueries({ queryKey: ["cf_purchases"] });
            qc.invalidateQueries({ queryKey: ["cf-workflow-pending"] });
            qc.invalidateQueries({ queryKey: ["cf-bulk-pending"] });
          },
          userIdForVerify: user?.id ?? ""
        }
      )
    ] })
  ] });
}
async function promptAdminOverride(actionLabel) {
  const ok = window.confirm(
    "This workflow has already been finalized. Editing or deleting will affect financial records. Do you want to continue?"
  );
  if (!ok) return null;
  const reason = window.prompt(`Reason to ${actionLabel} (required):`, "");
  if (!reason || !reason.trim()) {
    toast.error("Reason is required to override a verified workflow.");
    return null;
  }
  return reason.trim();
}
function SummaryCard({ icon, label, value, tone }) {
  const tones = {
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-700 dark:text-emerald-400",
    indigo: "from-indigo-500/15 to-indigo-500/0 text-indigo-700 dark:text-indigo-400",
    amber: "from-amber-500/15 to-amber-500/0 text-amber-700 dark:text-amber-400",
    red: "from-red-500/15 to-red-500/0 text-red-700 dark:text-red-400",
    primary: "from-primary/15 to-primary/0 text-primary",
    slate: "from-slate-500/15 to-slate-500/0 text-slate-700 dark:text-slate-300"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("relative overflow-hidden bg-gradient-to-br p-3", tones[tone]), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide opacity-80", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-base font-bold tabular-nums text-foreground", children: SAR(value) })
  ] });
}
function Section({ title, icon, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "space-y-2 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground", children: [
      icon,
      title
    ] }),
    children
  ] });
}
function Empty({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-xl border border-dashed border-border/60 bg-muted/30 px-3 py-3 text-center text-[11px] text-muted-foreground", children: label });
}
function CashInForm({ onSubmit, busy }) {
  const [amount, setAmount] = reactExports.useState("");
  const [source, setSource] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      className: "grid grid-cols-2 gap-1.5",
      onSubmit: (e) => {
        e.preventDefault();
        const n = Number(amount);
        if (!n || n <= 0) {
          toast.error("Enter amount");
          return;
        }
        onSubmit({ amount: n, source: source.trim(), notes: notes.trim() });
        setAmount("");
        setSource("");
        setNotes("");
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "col-span-1 h-9", placeholder: "Amount", inputMode: "decimal", value: amount, onChange: (e) => setAmount(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "col-span-1 h-9", placeholder: "Source (Bank/Owner)", value: source, onChange: (e) => setSource(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "col-span-2 h-9", placeholder: "Notes (optional)", value: notes, onChange: (e) => setNotes(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "col-span-2 h-9", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Add Cash In"
        ] })
      ]
    }
  );
}
function BatchPurchaseList({
  purchases,
  locked,
  canVerify,
  isAdmin,
  userId,
  userIdForVerify,
  adminOverride = false,
  onSingleReject,
  onReset,
  onDelete,
  onBatchDone
}) {
  const profileMap = useProfileMap();
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [confirmOpen, setConfirmOpen] = reactExports.useState(null);
  const [processing, setProcessing] = reactExports.useState(false);
  const pendingIds = reactExports.useMemo(
    () => purchases.filter((p) => p.verify_status === "pending").map((p) => p.id),
    [purchases]
  );
  const pendingSet = reactExports.useMemo(() => new Set(pendingIds), [pendingIds]);
  reactExports.useEffect(() => {
    setSelected((prev) => {
      const next = /* @__PURE__ */ new Set();
      prev.forEach((id) => {
        if (pendingSet.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [pendingSet]);
  const toggle = reactExports.useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const selectAll = () => setSelected(new Set(pendingIds));
  const clearAll = () => setSelected(/* @__PURE__ */ new Set());
  const selectedList = reactExports.useMemo(
    () => purchases.filter((p) => selected.has(p.id)),
    [purchases, selected]
  );
  const selectedTotal = reactExports.useMemo(
    () => selectedList.reduce((s, p) => s + p.cash_amount + p.due_amount + p.credit_amount, 0),
    [selectedList]
  );
  const pendingTotal = reactExports.useMemo(
    () => purchases.filter((p) => p.verify_status === "pending").reduce((s, p) => s + p.cash_amount + p.due_amount + p.credit_amount, 0),
    [purchases]
  );
  const runBatch = async (mode, ids, reason) => {
    setProcessing(true);
    const patchBase = mode === "verify" ? { verify_status: "verified", verified_by: userIdForVerify, verified_at: (/* @__PURE__ */ new Date()).toISOString(), reject_reason: null } : { verify_status: "rejected", verified_by: userIdForVerify, verified_at: (/* @__PURE__ */ new Date()).toISOString(), reject_reason: reason ?? null };
    const failedIds = [];
    let ok = 0;
    for (const id of ids) {
      try {
        const { error } = await supabase.from("cash_flow_purchases").update(patchBase).eq("id", id);
        if (error) throw error;
        ok += 1;
        try {
          await supabase.from("cf_activity_log").insert({ action: `purchase.${mode}`, target_table: "cash_flow_purchases", target_id: id, meta: mode === "reject" ? { reason } : {} });
        } catch {
        }
      } catch {
        failedIds.push(id);
      }
    }
    setProcessing(false);
    onBatchDone();
    if (failedIds.length === 0) {
      toast.success(mode === "verify" ? `✓ ${ok} transaction${ok === 1 ? "" : "s"} verified successfully.` : `✓ ${ok} transaction${ok === 1 ? "" : "s"} rejected.`);
      setSelected(/* @__PURE__ */ new Set());
    } else {
      toast.error(`${ok} transactions ${mode === "verify" ? "verified successfully" : "rejected"}. ${failedIds.length} failed.`);
      setSelected(new Set(failedIds));
    }
  };
  if (purchases.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No purchases yet" });
  const canBatch = !locked && canVerify && pendingIds.length > 0;
  const allSelected = pendingIds.length > 0 && selected.size === pendingIds.length;
  const selectedCount = selected.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    canBatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-[11px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        pendingIds.length,
        " pending · ",
        selectedCount,
        " selected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-[11px]", onClick: selectAll, disabled: allSelected, children: "Select All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 px-2 text-[11px]", onClick: clearAll, disabled: selectedCount === 0, children: "Clear All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-7 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-3 text-[11px] text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:brightness-110",
            disabled: processing || pendingIds.length === 0,
            onClick: () => setConfirmOpen("verifyAll"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              " Verify All"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("space-y-1.5", selectedCount > 0 && "pb-24"), children: purchases.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PurchaseRow,
      {
        p,
        creator: profileMap[p.created_by] ?? null,
        verifier: p.verified_by ? profileMap[p.verified_by] ?? null : null,
        locked,
        adminOverride,
        canVerify,
        canDelete: isAdmin,
        isMine: p.created_by === userId,
        isAdmin,
        selectable: !locked && canVerify && p.verify_status === "pending",
        checked: selected.has(p.id),
        onToggle: () => toggle(p.id),
        onReject: onSingleReject,
        onReset,
        onDelete
      },
      p.id
    )) }),
    canBatch && selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-3 py-2.5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          "Selected: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: selectedCount }),
          " ",
          selectedCount === 1 ? "entry" : "entries"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold tabular-nums", children: [
          "Total: ",
          SAR(selectedTotal)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "h-10 rounded-full px-3 text-xs",
          disabled: processing,
          onClick: () => setConfirmOpen("reject"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
            " Reject"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "h-10 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 text-xs text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:brightness-110",
          disabled: processing,
          onClick: () => setConfirmOpen("verify"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            " Verify Selected"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmOpen !== null, onOpenChange: (o) => {
      if (!o && !processing) setConfirmOpen(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: confirmOpen === "verifyAll" ? "Verify all pending transactions?" : confirmOpen === "verify" ? `Verify ${selectedCount} transaction${selectedCount === 1 ? "" : "s"}?` : `Reject ${selectedCount} transaction${selectedCount === 1 ? "" : "s"}?` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [
          confirmOpen === "verifyAll" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Pending Entries: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: pendingIds.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Total Amount:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(confirmOpen === "verifyAll" ? pendingTotal : selectedTotal) })
          ] }),
          confirmOpen === "reject" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", children: "A single reject reason will be applied to all selected entries." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: processing, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            disabled: processing,
            className: confirmOpen === "reject" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:brightness-110",
            onClick: async (e) => {
              e.preventDefault();
              const mode = confirmOpen;
              if (!mode) return;
              let reason;
              if (mode === "reject") {
                const r = window.prompt("Reject reason (applied to all selected)?", "");
                if (r === null) return;
                reason = r;
              }
              setConfirmOpen(null);
              const ids = mode === "verifyAll" ? pendingIds : Array.from(selected);
              const runMode = mode === "reject" ? "reject" : "verify";
              await runBatch(runMode, ids, reason);
            },
            children: confirmOpen === "verifyAll" ? "Verify All" : confirmOpen === "verify" ? "Verify" : "Reject"
          }
        )
      ] })
    ] }) })
  ] });
}
const PurchaseRow = reactExports.memo(function PurchaseRow2({
  p,
  creator,
  verifier,
  locked,
  canVerify,
  canDelete,
  isMine,
  isAdmin,
  adminOverride = false,
  selectable,
  checked,
  onToggle,
  onReject,
  onReset,
  onDelete
}) {
  const tone = p.verify_status === "verified" ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5" : p.verify_status === "rejected" ? "border-red-500/40 bg-red-50/50 dark:bg-red-500/5" : p.ocr_confidence === "low" ? "border-rose-500/30 bg-rose-50/30 dark:bg-rose-500/5" : "border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5";
  const total = p.cash_amount + p.due_amount + p.credit_amount;
  const canEditAttachments = !locked && (isAdmin || isMine || canVerify);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-record-id": p.id,
      className: cn(
        "rounded-xl border px-3 py-2.5 select-none flex gap-2",
        tone,
        checked && "ring-2 ring-emerald-500/50"
      ),
      children: [
        selectable && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, onCheckedChange: onToggle, "aria-label": "Select entry" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: p.company }),
                p.verify_status === "verified" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "h-4 gap-1 px-1.5 text-[9px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
                  " Verified"
                ] }),
                p.verify_status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "h-4 px-1.5 text-[9px]", children: "Rejected" }),
                p.verify_status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-4 px-1.5 text-[9px]", children: "Pending" }),
                p.ocr_confidence && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: cn("h-4 gap-1 px-1.5 text-[9px] capitalize", CONF_BADGE[p.ocr_confidence]), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5" }),
                  " OCR ",
                  p.ocr_confidence
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CfAttachmentManager, { purchaseId: p.id, canEdit: canEditAttachments })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground", children: [
                p.cash_amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Cash ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(p.cash_amount) })
                ] }),
                p.due_amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Due ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(p.due_amount) })
                ] }),
                p.credit_amount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Credit ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(p.credit_amount) })
                ] })
              ] }),
              p.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: p.notes }),
              p.reject_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-red-700 dark:text-red-400", children: [
                "⚠ ",
                p.reject_reason
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shrink-0 text-sm font-bold tabular-nums", children: SAR(total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-1.5 py-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-2.5 w-2.5" }),
              " Purchased by ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground/80 font-medium", children: displayProfile(creator) })
            ] }),
            verifier && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }),
              " Verified by ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "font-medium", children: displayProfile(verifier) })
            ] })
          ] }),
          (!locked || adminOverride) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-1.5", children: [
            adminOverride && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "h-5 gap-1 border-amber-500/40 bg-amber-500/10 px-1.5 text-[9px] text-amber-700 dark:text-amber-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
              " Admin override"
            ] }),
            canVerify && p.verify_status !== "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 rounded-full px-3 text-xs", onClick: () => onReject(p), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
              " Reject"
            ] }),
            canVerify && p.verify_status !== "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 rounded-full px-3 text-xs", onClick: () => onReset(p), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              " Reset"
            ] }),
            (canDelete || isMine && p.verify_status === "pending") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "ml-auto h-8 rounded-full px-3 text-xs text-destructive", onClick: () => onDelete(p), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              " Delete"
            ] })
          ] })
        ] })
      ]
    }
  );
});
const Route$d = createFileRoute("/_app/cash-custody")({
  beforeLoad: () => {
    throw redirect({ to: "/finance-workflow", search: { tab: "custody" } });
  },
  component: CashCustodyPage
});
function nameOf(profiles, id) {
  if (!id) return "—";
  const p = profiles.find((x) => x.id === id);
  return p?.full_name || p?.email || p?.username || id.slice(0, 8);
}
function StatusChip({ status }) {
  const map = {
    pending: { c: "bg-amber-500/15 text-amber-700 dark:text-amber-300", l: "Pending", Icon: Clock },
    accepted: { c: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", l: "Accepted", Icon: CircleCheck },
    rejected: { c: "bg-rose-500/15 text-rose-700 dark:text-rose-300", l: "Rejected", Icon: CircleX },
    returned: { c: "bg-sky-500/15 text-sky-700 dark:text-sky-300", l: "Returned", Icon: Undo2 },
    closed: { c: "bg-muted text-muted-foreground", l: "Closed", Icon: CircleCheck }
  }[status];
  const Icon = map.Icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", map.c), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    " ",
    map.l
  ] });
}
function CashCustodyPage() {
  const { user } = useAuth();
  const access = useUserAccess();
  const qc = useQueryClient();
  const [tab, setTab] = reactExports.useState("holders");
  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-all"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id,full_name,email,username");
      return data ?? [];
    }
  });
  const { data: shops = [] } = useQuery({
    queryKey: ["shops-active"],
    queryFn: async () => {
      const { data } = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return data ?? [];
    }
  });
  const { data: holders = [] } = useQuery({
    queryKey: ["cash-holders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("v_cash_holders").select("*").order("balance", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: handovers = [] } = useQuery({
    queryKey: ["cash-handovers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cash_handovers").select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: returns = [] } = useQuery({
    queryKey: ["cash-returns"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cash_returns").select("*").eq("is_deleted", false).order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const { data: recon = [] } = useQuery({
    queryKey: ["cash-recon"],
    queryFn: async () => {
      const { data, error } = await supabase.from("v_cash_reconciliation").select("*").order("day_date", { ascending: false }).limit(30);
      if (error) throw error;
      return data ?? [];
    }
  });
  const pendingIncoming = reactExports.useMemo(
    () => handovers.filter((h) => h.status === "pending" && h.to_user === user?.id),
    [handovers, user?.id]
  );
  const totalsRecon = reactExports.useMemo(() => {
    let cashIn = 0, dist = 0, pur = 0, ret = 0;
    for (const r of recon) {
      cashIn += Number(r.cash_in || 0);
      dist += Number(r.distributed || 0);
      pur += Number(r.purchases || 0);
      ret += Number(r.returns || 0);
    }
    const heldByUsers = holders.reduce((s, h) => s + Number(h.balance || 0), 0);
    const expectedHeld = cashIn - pur - ret;
    const unaccounted = expectedHeld - heldByUsers;
    return { cashIn, dist, pur, ret, heldByUsers, expectedHeld, unaccounted };
  }, [recon, holders]);
  const [newOpen, setNewOpen] = reactExports.useState(false);
  const [hTo, setHTo] = reactExports.useState("");
  const [hShop, setHShop] = reactExports.useState("__none__");
  const [hAmt, setHAmt] = reactExports.useState("");
  const [hPurpose, setHPurpose] = reactExports.useState("");
  const [hNotes, setHNotes] = reactExports.useState("");
  const createHandover = useMutation({
    mutationFn: async () => {
      const amt = Number(hAmt);
      if (!hTo) throw new Error("Pick recipient");
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { error } = await supabase.from("cash_handovers").insert({
        from_user: user.id,
        to_user: hTo,
        shop_id: hShop === "__none__" ? null : hShop,
        amount: amt,
        purpose: hPurpose || null,
        notes: hNotes || null,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-handovers"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
      toast.success("Handover sent");
      setNewOpen(false);
      setHTo("");
      setHAmt("");
      setHPurpose("");
      setHNotes("");
      setHShop("__none__");
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const setHandoverStatus = useMutation({
    mutationFn: async ({ id, status, reason }) => {
      const patch = { status };
      if (status === "accepted") patch.accepted_at = (/* @__PURE__ */ new Date()).toISOString();
      if (status === "rejected") {
        patch.rejected_at = (/* @__PURE__ */ new Date()).toISOString();
        patch.reject_reason = reason ?? null;
      }
      if (status === "closed") patch.closed_at = (/* @__PURE__ */ new Date()).toISOString();
      const { error } = await supabase.from("cash_handovers").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-handovers"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  const [retOpen, setRetOpen] = reactExports.useState(false);
  const [rTo, setRTo] = reactExports.useState("__company__");
  const [rAmt, setRAmt] = reactExports.useState("");
  const [rNotes, setRNotes] = reactExports.useState("");
  const createReturn = useMutation({
    mutationFn: async () => {
      const amt = Number(rAmt);
      if (!amt || amt <= 0) throw new Error("Enter amount");
      const { error } = await supabase.from("cash_returns").insert({
        from_user: user.id,
        to_user: rTo === "__company__" ? null : rTo,
        amount: amt,
        notes: rNotes || null,
        created_by: user.id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cash-returns"] });
      qc.invalidateQueries({ queryKey: ["cash-holders"] });
      toast.success("Return recorded");
      setRetOpen(false);
      setRAmt("");
      setRNotes("");
      setRTo("__company__");
    },
    onError: (e) => toast.error(e.message ?? "Failed")
  });
  if (access.loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-muted-foreground", children: "Loading…" });
  }
  if (!access.hasPage("cash-custody")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-muted-foreground", children: "Access restricted." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mobile-page-stack", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card/70", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[15px] font-semibold leading-tight truncate", children: "Cash Custody" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Who holds company money" })
          ] })
        ] }),
        access.canHandover && /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: newOpen, onOpenChange: setNewOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "h-9 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Handover"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "rounded-t-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "New Cash Handover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "To (recipient)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: hTo, onValueChange: setHTo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Pick user" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: profiles.filter((p) => p.id !== user?.id).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name || p.email || p.username || p.id.slice(0, 8) }, p.id)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Shop (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: hShop, onValueChange: setHShop, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "— No shop —" }),
                    shops.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Amount (SAR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", value: hAmt, onChange: (e) => setHAmt(e.target.value), placeholder: "0.00" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Purpose" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: hPurpose, onChange: (e) => setHPurpose(e.target.value), placeholder: "e.g. Almarai purchase" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: hNotes, onChange: (e) => setHNotes(e.target.value), rows: 2 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: createHandover.isPending, onClick: () => createHandover.mutate(), children: "Send handover" })
            ] })
          ] })
        ] })
      ] }),
      pendingIncoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-3 mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[13px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium text-amber-800 dark:text-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
          " ",
          pendingIncoming.length,
          " incoming handover",
          pendingIncoming.length > 1 ? "s" : "",
          " need your acceptance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-1 text-xs underline", onClick: () => setTab("pending"), children: "Review now" })
      ] }),
      Math.abs(totalsRecon.unaccounted) > 0.5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-3 mb-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-[13px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium text-rose-700 dark:text-rose-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          " Unaccounted cash: ",
          SAR(Math.abs(totalsRecon.unaccounted))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[11px] text-rose-700/80 dark:text-rose-200/70", children: [
          "Expected held ",
          SAR(totalsRecon.expectedHeld),
          " · Reported held ",
          SAR(totalsRecon.heldByUsers)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, className: "px-3 pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4 h-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "holders", className: "text-xs", children: "Holders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "handovers", className: "text-xs", children: "Handovers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "returns", className: "text-xs", children: "Returns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", className: "text-xs", children: [
          "Pending ",
          pendingIncoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-4 px-1.5 text-[10px]", children: pendingIncoming.length })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "holders", className: "space-y-2 pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Cash In" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: SAR(totalsRecon.cashIn) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Purchases" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: SAR(totalsRecon.pur) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Held" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-primary", children: SAR(totalsRecon.heldByUsers) })
          ] })
        ] }) }),
        holders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No active holders yet." }) : holders.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: h.display_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              "In ",
              SAR(h.total_received),
              " · Out ",
              SAR(h.total_given),
              " · Spent ",
              SAR(h.total_spent),
              " · Returned ",
              SAR(h.total_returned)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-base font-semibold", h.balance < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"), children: SAR(h.balance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "holding" })
          ] })
        ] }) }, h.user_id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "handovers", className: "space-y-2 pt-3", children: handovers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No handovers yet." }) : handovers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(HandoverRow, { h, profiles, meId: user?.id, onStatus: (status, reason) => setHandoverStatus.mutate({ id: h.id, status, reason }) }, h.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "returns", className: "space-y-2 pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: retOpen, onOpenChange: setRetOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" }),
            " Record Return"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "rounded-t-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Return cash" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Return to" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: rTo, onValueChange: setRTo, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__company__", children: "Company (general)" }),
                    profiles.filter((p) => p.id !== user?.id).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name || p.email || p.username || p.id.slice(0, 8) }, p.id))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Amount (SAR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", value: rAmt, onChange: (e) => setRAmt(e.target.value), placeholder: "0.00" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: rNotes, onChange: (e) => setRNotes(e.target.value), rows: 2 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full", disabled: createReturn.isPending, onClick: () => createReturn.mutate(), children: "Save return" })
            ] })
          ] })
        ] }),
        returns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "No returns recorded." }) : returns.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: nameOf(profiles, r.from_user) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " → " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.to_user ? nameOf(profiles, r.to_user) : "Company" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              r.day_date,
              r.notes ? ` · ${r.notes}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sky-600 dark:text-sky-400", children: SAR(r.amount) })
        ] }) }, r.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", className: "space-y-2 pt-3", children: pendingIncoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-sm text-muted-foreground", children: "Nothing to accept right now." }) : pendingIncoming.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(HandoverRow, { h, profiles, meId: user?.id, highlight: true, onStatus: (status, reason) => setHandoverStatus.mutate({ id: h.id, status, reason }) }, h.id)) })
    ] })
  ] });
}
function HandoverRow({
  h,
  profiles,
  meId,
  highlight,
  onStatus
}) {
  const isRecipient = h.to_user === meId;
  const isSender = h.from_user === meId;
  const [rejOpen, setRejOpen] = reactExports.useState(false);
  const [reason, setReason] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("p-3", highlight && "border-amber-500/40"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: nameOf(profiles, h.from_user) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: nameOf(profiles, h.to_user) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: h.day_date }),
          h.purpose && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "· ",
            h.purpose
          ] }),
          h.parent_handover_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { className: "h-3 w-3" }),
            " chained"
          ] })
        ] }),
        h.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: h.notes }),
        h.reject_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-rose-500", children: [
          "Rejected: ",
          h.reject_reason
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: SAR(h.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: h.status })
      ] })
    ] }),
    h.status === "pending" && isRecipient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "flex-1 gap-1", onClick: () => onStatus("accepted"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
        " Accept"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: rejOpen, onOpenChange: setRejOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
          " Reject"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "rounded-t-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Reject handover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Reason (required)", rows: 3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full",
                variant: "destructive",
                disabled: !reason.trim(),
                onClick: () => {
                  onStatus("rejected", reason.trim());
                  setRejOpen(false);
                  setReason("");
                },
                children: "Confirm rejection"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    h.status === "pending" && isSender && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "w-full text-muted-foreground", onClick: () => onStatus("rejected", "Cancelled by sender"), children: "Cancel" }) })
  ] });
}
const $$splitComponentImporter$8 = () => import("./banner-ads-DmMufY-v.mjs");
const Route$c = createFileRoute("/_app/banner-ads")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  head: () => ({
    meta: [{
      title: "Banner Ads · Store Admin"
    }, {
      name: "description",
      content: "Manage promotional banners shown on the storefront and order success page."
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./backup-center-BhYHU3H9.mjs");
const Route$b = createFileRoute("/_app/backup-center")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./ai-insights-D9Qt1iZq.mjs");
reactExports.lazy(() => import("./ai-quick-panels-DGoIeCAu.mjs").then((m) => ({
  default: m.AiQuickPanels
})));
reactExports.lazy(() => import("./ai-share-modal-BfCrU7G9.mjs").then((m) => ({
  default: m.AiShareModal
})));
const Route$a = createFileRoute("/_app/ai-insights")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  validateSearch: (s) => objectType({
    q: stringType().optional()
  }).parse(s)
});
const $$splitComponentImporter$5 = () => import("./activity-DhMaZZmt.mjs");
const Route$9 = createFileRoute("/_app/activity")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
class DetailErrorBoundary extends React__default.Component {
  state = {
    hasError: false
  };
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(err) {
    console.error("[ActivityDetail]", err);
  }
  componentDidUpdate(prev) {
    if (prev.children !== this.props.children && this.state.hasError) {
      this.setState({
        hasError: false
      });
    }
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => {
        if (!o) {
          this.setState({
            hasError: false
          });
          this.props.onClose();
        }
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Unable to load activity details" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Something went wrong while opening this entry. Please try again." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          this.setState({
            hasError: false
          });
          this.props.onClose();
        }, children: "Close" })
      ] }) });
    }
    return this.props.children;
  }
}
const $$splitComponentImporter$4 = () => import("./stock-count.index-BXY_oU0B.mjs");
const Route$8 = createFileRoute("/_app/stock-count/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./employees.index-DX1kN26i.mjs");
const Route$7 = createFileRoute("/_app/employees/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const Route$6 = createFileRoute("/api/public/send-test-push")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        try {
          const body = await request.json().catch(() => ({}));
          const token = String(body.token || "").trim();
          if (token.length < 20) {
            return json$2({ ok: false, error: "Invalid token" }, 400, cors);
          }
          const { data: row, error: tokErr } = await supabaseAdmin.from("notification_tokens").select("token, role").eq("token", token).maybeSingle();
          if (tokErr) return json$2({ ok: false, error: tokErr.message }, 500, cors);
          if (!row || !["admin", "super_admin"].includes(String(row.role))) {
            return json$2({ ok: false, error: "Token not authorized" }, 403, cors);
          }
          const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
          if (!saJson) {
            return json$2(
              { ok: false, error: "FIREBASE_SERVICE_ACCOUNT_JSON not configured" },
              500,
              cors
            );
          }
          const sa = JSON.parse(saJson);
          const accessToken = await mintAccessToken$1(sa);
          const title = String(body.title || "🔔 Test Notification");
          const bodyText = String(
            body.body || `Self-test from ERP at ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`
          );
          const tag = `selftest-${Date.now()}`;
          const url = "/store-admin";
          const endpoint = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
          const message = {
            message: {
              token,
              notification: { title, body: bodyText },
              data: {
                title,
                body: bodyText,
                url,
                tag,
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                priority: "high",
                sound: "default",
                requireInteraction: "true"
              },
              webpush: {
                headers: { Urgency: "high", TTL: "300" },
                notification: {
                  title,
                  body: bodyText,
                  icon: "/favicon.ico",
                  badge: "/favicon.ico",
                  tag,
                  renotify: true,
                  requireInteraction: true,
                  vibrate: [200, 100, 200],
                  data: { url, tag }
                },
                fcm_options: { link: url }
              },
              android: {
                priority: "HIGH",
                notification: { sound: "default" }
              }
            }
          };
          const r = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
          });
          const txt = await r.text();
          let parsed = txt;
          try {
            parsed = JSON.parse(txt);
          } catch {
          }
          console.log("[push-test]", r.status, typeof parsed === "string" ? parsed.slice(0, 200) : parsed);
          return json$2(
            { ok: r.ok, status: r.status, response: parsed },
            200,
            cors
          );
        } catch (e) {
          console.error("[push-test] failed:", e?.message || e);
          return json$2({ ok: false, error: e?.message || String(e) }, 500, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          });
        }
      }
    }
  }
});
function json$2(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers });
}
async function mintAccessToken$1(sa) {
  const now = Math.floor(Date.now() / 1e3);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const enc = (o) => b64url$1(new TextEncoder().encode(JSON.stringify(o)));
  const signingInput = `${enc(header)}.${enc(claim)}`;
  const key = await importPkcs8$1(sa.private_key);
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${b64url$1(new Uint8Array(sig))}`;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`OAuth token mint failed ${r.status}: ${t.slice(0, 200)}`);
  }
  const j = await r.json();
  return j.access_token;
}
function b64url$1(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function importPkcs8$1(pem) {
  const clean = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "").replace(/-----END PRIVATE KEY-----/g, "").replace(/\\n/g, "\n").replace(/\s+/g, "");
  const bin = atob(clean);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey(
    "pkcs8",
    buf,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}
const Route$5 = createFileRoute("/api/public/send-order-push")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        try {
          const body = await request.json().catch(() => ({}));
          const orderId = String(body.orderId || "").trim();
          if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
            return new Response(JSON.stringify({ error: "Invalid orderId" }), {
              status: 400,
              headers: cors
            });
          }
          const { data: order, error: orderErr } = await supabaseAdmin.from("shop_orders").select("id, order_number, customer_name, total, created_at, is_deleted").eq("id", orderId).maybeSingle();
          if (orderErr || !order || order.is_deleted) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
              status: 404,
              headers: cors
            });
          }
          const ageMs = Date.now() - new Date(order.created_at).getTime();
          if (ageMs > 5 * 6e4) {
            return new Response(JSON.stringify({ error: "Order too old" }), {
              status: 410,
              headers: cors
            });
          }
          const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
          if (!saJson) {
            console.warn("[push] FIREBASE_SERVICE_ACCOUNT_JSON not set; skipping send");
            return new Response(JSON.stringify({ skipped: true }), { status: 200, headers: cors });
          }
          const sa = JSON.parse(saJson);
          const { data: tokens, error: tokErr } = await supabaseAdmin.from("notification_tokens").select("token, role").in("role", ["admin", "super_admin"]);
          if (tokErr) {
            console.warn("[push] token query failed:", tokErr.message);
            return new Response(JSON.stringify({ error: "Token query failed" }), {
              status: 500,
              headers: cors
            });
          }
          const list = (tokens || []).map((t) => t.token).filter(Boolean);
          console.log("[push] dispatching to", list.length, "admin tokens for order", order.order_number);
          if (list.length === 0) {
            return new Response(JSON.stringify({ sent: 0 }), { status: 200, headers: cors });
          }
          const accessToken = await mintAccessToken(sa);
          const title = "New Wholesale Order";
          const total = Number(order.total ?? 0).toFixed(2);
          const bodyText = `${order.customer_name || "Customer"} placed an order worth SAR ${total}`;
          const url = `/store-admin`;
          const tag = `order-${order.id}`;
          const endpoint = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
          const invalidTokens = [];
          let sent = 0;
          await Promise.all(
            list.map(async (token) => {
              const message = {
                message: {
                  token,
                  notification: {
                    title,
                    body: bodyText
                  },
                  data: {
                    title,
                    body: bodyText,
                    url,
                    orderId: String(order.id),
                    tag,
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    priority: "high",
                    sound: "default"
                  },
                  webpush: {
                    headers: { Urgency: "high", TTL: "300" },
                    notification: {
                      title,
                      body: bodyText,
                      icon: "/favicon.ico",
                      badge: "/favicon.ico",
                      tag,
                      renotify: true,
                      requireInteraction: false,
                      vibrate: [200, 100, 200],
                      data: { url, orderId: String(order.id), tag }
                    },
                    fcm_options: { link: url }
                  },
                  android: {
                    priority: "HIGH",
                    notification: { sound: "default" }
                  }
                }
              };
              try {
                const r = await fetch(endpoint, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(message)
                });
                if (r.ok) {
                  sent++;
                  console.log("[push] notification sent", { orderId: order.id, token: token.slice(0, 12) });
                } else {
                  const txt = await r.text().catch(() => "");
                  console.warn("[push] notification failed", r.status, txt.slice(0, 200));
                  if (r.status === 404 || r.status === 400 || /UNREGISTERED|INVALID_ARGUMENT|NOT_FOUND/i.test(txt)) {
                    invalidTokens.push(token);
                  }
                }
              } catch (e) {
                console.warn("[push] fetch failed:", e?.message || e);
              }
            })
          );
          if (invalidTokens.length > 0) {
            await supabaseAdmin.from("notification_tokens").delete().in("token", invalidTokens);
            console.log("[push] pruned", invalidTokens.length, "stale tokens");
          }
          return new Response(JSON.stringify({ sent, pruned: invalidTokens.length }), {
            status: 200,
            headers: cors
          });
        } catch (e) {
          console.error("[push] handler failed:", e?.message || e);
          return new Response(JSON.stringify({ error: "send failed" }), {
            status: 500,
            headers: cors
          });
        }
      }
    }
  }
});
async function mintAccessToken(sa) {
  const now = Math.floor(Date.now() / 1e3);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };
  const enc = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const signingInput = `${enc(header)}.${enc(claim)}`;
  const key = await importPkcs8(sa.private_key);
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${b64url(new Uint8Array(sig))}`;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`OAuth token mint failed ${r.status}: ${t.slice(0, 200)}`);
  }
  const j = await r.json();
  return j.access_token;
}
function b64url(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function importPkcs8(pem) {
  const clean = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "").replace(/-----END PRIVATE KEY-----/g, "").replace(/\\n/g, "\n").replace(/\s+/g, "");
  const bin = atob(clean);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey(
    "pkcs8",
    buf,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}
const GATEWAY_URL$1 = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const Route$4 = createFileRoute("/api/public/send-order-email")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        try {
          const body = await request.json().catch(() => ({}));
          if (body.test) {
            const to = String(body.testRecipient || "").trim();
            if (!isValidEmail$1(to)) {
              return json$1({ error: "Invalid recipient" }, 400, cors);
            }
            const result = await sendGmail$1({
              to,
              subject: "Test Notification — Order Email",
              html: `<p>This is a test notification email from your shop. If you received this, Gmail notifications are working correctly.</p>`
            });
            await logSend$1(null, to, "Test Notification — Order Email", result);
            return json$1(result.ok ? { sent: 1 } : { error: result.error }, result.ok ? 200 : 500, cors);
          }
          const orderId = String(body.orderId || "").trim();
          if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
            return json$1({ error: "Invalid orderId" }, 400, cors);
          }
          const { data: order, error: orderErr } = await supabaseAdmin.from("shop_orders").select("id, order_number, customer_name, customer_mobile, customer_address, total, items, notes, created_at, is_deleted").eq("id", orderId).maybeSingle();
          if (orderErr || !order || order.is_deleted) {
            return json$1({ error: "Order not found" }, 404, cors);
          }
          const ageMs = Date.now() - new Date(order.created_at).getTime();
          if (ageMs > 5 * 6e4) {
            return json$1({ error: "Order too old" }, 410, cors);
          }
          const { data: recipients } = await supabaseAdmin.from("notification_recipients").select("email, event_flags").eq("is_active", true);
          const ORDER_MODULE = "Customer Order Received";
          const list = (recipients || []).filter((r) => {
            const flags = r.event_flags || {};
            return flags[ORDER_MODULE] !== false;
          }).map((r) => String(r.email)).filter(isValidEmail$1);
          if (list.length === 0) {
            return json$1({ sent: 0, reason: "no recipients" }, 200, cors);
          }
          const shopName = "Shop";
          const subject = `New Order Received - ${shopName} (#${order.order_number})`;
          const html = renderOrderHtml(shopName, order);
          let sent = 0;
          await Promise.all(
            list.map(async (to) => {
              const result = await sendGmail$1({ to, subject, html });
              if (result.ok) sent++;
              await logSend$1(orderId, to, subject, result);
            })
          );
          return json$1({ sent, total: list.length }, 200, cors);
        } catch (e) {
          console.error("[order-email] handler failed:", e?.message || e);
          return json$1({ error: "send failed" }, 500, cors);
        }
      }
    }
  }
});
function json$1(payload, status, headers) {
  return new Response(JSON.stringify(payload), { status, headers });
}
function isValidEmail$1(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function esc$1(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderOrderHtml(shopName, order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const rows = items.map((it) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc$1(it.name)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${esc$1(it.qty)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">SAR ${Number(it.price || 0).toFixed(2)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">SAR ${(Number(it.qty || 0) * Number(it.price || 0)).toFixed(2)}</td>
    </tr>`).join("");
  const orderTime = new Date(order.created_at).toLocaleString();
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#111">
    <h2 style="margin:0 0 4px">New Order Received</h2>
    <p style="margin:0 0 16px;color:#666">${esc$1(shopName)} · Order #${esc$1(order.order_number)}</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0"><b>${esc$1(order.customer_name)}</b></td></tr>
      <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${esc$1(order.customer_mobile)}</td></tr>
      ${order.customer_address ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Address</td><td style="padding:6px 0">${esc$1(order.customer_address)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666">Order Time</td><td style="padding:6px 0">${esc$1(orderTime)}</td></tr>
      ${order.notes ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Notes</td><td style="padding:6px 0">${esc$1(order.notes)}</td></tr>` : ""}
    </table>

    <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
      <thead><tr>
        <th style="padding:8px;text-align:left;background:#fafafa">Product</th>
        <th style="padding:8px;text-align:center;background:#fafafa">Qty</th>
        <th style="padding:8px;text-align:right;background:#fafafa">Price</th>
        <th style="padding:8px;text-align:right;background:#fafafa">Total</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr>
        <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold">Total</td>
        <td style="padding:12px 8px;text-align:right;font-weight:bold">SAR ${Number(order.total || 0).toFixed(2)}</td>
      </tr></tfoot>
    </table>
  </div>`;
}
async function sendGmail$1(args) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    return { ok: false, error: "Gmail connector not configured" };
  }
  const mime = [
    `From: shriah28@gmail.com`,
    `To: ${args.to}`,
    `Subject: ${encodeHeader$1(args.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    args.html
  ].join("\r\n");
  const raw = b64urlEncodeString$1(mime);
  try {
    const r = await fetch(`${GATEWAY_URL$1}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw })
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.warn("[gmail] send failed", r.status, txt.slice(0, 300));
      return { ok: false, error: `Gmail ${r.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}
function encodeHeader$1(s) {
  if (/^[\x20-\x7E]*$/.test(s)) return s;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}
function b64urlEncodeString$1(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function logSend$1(orderId, to, subject, result) {
  try {
    await supabaseAdmin.from("notification_email_log").insert({
      order_id: orderId,
      recipient_email: to,
      subject,
      status: result.ok ? "sent" : "failed",
      error: result.error || null
    });
  } catch (e) {
    console.warn("[order-email] log insert failed:", e?.message || e);
  }
}
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";
const Route$3 = createFileRoute("/api/public/send-audit-email")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
        try {
          const p = await request.json().catch(() => ({}));
          const action = String(p.action || "").toLowerCase();
          const module = String(p.module || "").trim();
          if (!["created", "edited", "deleted"].includes(action) || !module) {
            return json({ error: "Invalid payload" }, 400, cors);
          }
          const { data: recipients } = await supabaseAdmin.from("notification_recipients").select("email, event_flags").eq("is_active", true);
          const list = (recipients || []).filter((r) => {
            const flags = r.event_flags || {};
            return flags[module] !== false;
          }).map((r) => String(r.email)).filter(isValidEmail);
          if (list.length === 0) return json({ sent: 0, reason: "no recipients" }, 200, cors);
          const extras = {};
          if (module === "Employee Wallet") {
            await enrichEmployeeWallet(p, extras);
          }
          const subject = buildSubject(action, module, p);
          const html = renderAuditHtml(action, module, p, extras);
          let sent = 0;
          await Promise.all(
            list.map(async (to) => {
              const result = await sendGmail({ to, subject, html });
              if (result.ok) sent++;
              await logSend(to, subject, action, module, p, result);
            })
          );
          return json({ sent, total: list.length }, 200, cors);
        } catch (e) {
          console.error("[audit-email] handler failed:", e?.message || e);
          return json({ error: "send failed" }, 500, cors);
        }
      }
    }
  }
});
function json(payload, status, headers) {
  return new Response(JSON.stringify(payload), { status, headers });
}
function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function buildSubject(action, module, p) {
  const verb = action === "created" ? "New" : action === "edited" ? "Edited" : "Deleted";
  const amt = p.amount != null ? ` — SAR ${Number(p.amount).toFixed(2)}` : "";
  return `[Audit] ${verb} ${module}${amt}${p.shopName ? ` · ${p.shopName}` : ""}`;
}
function badgeColor(action) {
  if (action === "created") return "#16a34a";
  if (action === "edited") return "#2563eb";
  return "#dc2626";
}
function renderRows(obj) {
  if (!obj || typeof obj !== "object") return `<tr><td colspan="2" style="padding:8px;color:#888;font-style:italic">—</td></tr>`;
  const entries = Object.entries(obj);
  if (entries.length === 0) return `<tr><td colspan="2" style="padding:8px;color:#888;font-style:italic">—</td></tr>`;
  return entries.map(([k, v]) => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#555;width:40%">${esc(k)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee"><b>${esc(formatVal(v))}</b></td>
    </tr>`).join("");
}
function formatVal(v) {
  if (v == null) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function renderDiff(oldV, newV) {
  const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(oldV || {}), ...Object.keys(newV || {})]));
  if (keys.length === 0) return `<tr><td colspan="3" style="padding:8px;color:#888;font-style:italic">No field changes recorded</td></tr>`;
  return keys.map((k) => {
    const a = oldV?.[k];
    const b = newV?.[k];
    const changed = JSON.stringify(a) !== JSON.stringify(b);
    return `<tr style="${changed ? "background:#fff8e1" : ""}">
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#555">${esc(k)}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#b91c1c">${esc(formatVal(a))}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;color:#166534"><b>${esc(formatVal(b))}</b></td>
    </tr>`;
  }).join("");
}
function formatSaudiTime(input) {
  const d = input ? new Date(input) : /* @__PURE__ */ new Date();
  if (isNaN(d.getTime())) return String(input ?? "");
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).formatToParts(d);
  const g = (t) => parts.find((p) => p.type === t)?.value || "";
  const ampm = (g("dayPeriod") || "").toUpperCase();
  return `${g("day")}/${g("month")}/${g("year")}, ${g("hour")}:${g("minute")} ${ampm}`;
}
async function enrichEmployeeWallet(p, extras) {
  const bag = { ...p.newValues || {}, ...p.oldValues || {} };
  const empId = bag.employee_id || bag.employeeId;
  if (empId) {
    try {
      const { data } = await supabaseAdmin.from("employees").select("name").eq("id", String(empId)).maybeSingle();
      const name = data?.name;
      if (name) {
        for (const v of [p.newValues, p.oldValues]) {
          if (v && typeof v === "object" && "employee_id" in v) {
            v["Employee"] = name;
            delete v.employee_id;
          }
        }
      }
    } catch (e) {
      console.warn("[audit-email] employee lookup failed:", e?.message || e);
    }
  }
  const rawUrl = p.newValues?.attachment_url ?? p.oldValues?.attachment_url;
  if (rawUrl) {
    const signed = await signAttachmentUrl(String(rawUrl));
    extras.attachmentUrl = signed || String(rawUrl);
    for (const v of [p.newValues, p.oldValues]) {
      if (v && typeof v === "object" && "attachment_url" in v) delete v.attachment_url;
    }
  }
}
async function signAttachmentUrl(input) {
  try {
    const bucket = "attachments";
    let path = null;
    const marker = `/object/public/${bucket}/`;
    const signMarker = `/object/sign/${bucket}/`;
    const i = input.indexOf(marker);
    const j = input.indexOf(signMarker);
    if (i >= 0) path = decodeURIComponent(input.slice(i + marker.length));
    else if (j >= 0) path = decodeURIComponent(input.slice(j + signMarker.length).split("?")[0]);
    else if (!input.startsWith("http")) path = input;
    if (!path) return null;
    const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    return data?.signedUrl || null;
  } catch (e) {
    console.warn("[audit-email] sign url failed:", e?.message || e);
    return null;
  }
}
function renderAttachmentBlock(url) {
  if (!url) return "";
  const safe = esc(url);
  return `
    <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Attachment</h3>
    <div style="border:1px solid #eee;border-radius:8px;padding:12px;text-align:center;background:#fafafa">
      <a href="${safe}" target="_blank" style="text-decoration:none">
        <img src="${safe}" alt="Receipt" style="max-width:100%;max-height:360px;border-radius:6px;display:block;margin:0 auto 12px" />
      </a>
      <a href="${safe}" target="_blank"
         style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;
                text-decoration:none;border-radius:6px;font-weight:600;font-size:13px">
        View Receipt
      </a>
    </div>`;
}
function renderAuditHtml(action, module, p, extras = {}) {
  const time = formatSaudiTime(p.eventTime);
  const badge = `<span style="display:inline-block;padding:4px 10px;border-radius:12px;background:${badgeColor(action)};color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px">${esc(action)}</span>`;
  const metaTable = `
    <table style="width:100%;border-collapse:collapse;margin:12px 0 20px">
      <tr><td style="padding:6px 0;color:#666;width:35%">Module</td><td style="padding:6px 0"><b>${esc(module)}</b></td></tr>
      ${p.shopName ? `<tr><td style="padding:6px 0;color:#666">Shop</td><td style="padding:6px 0">${esc(p.shopName)}</td></tr>` : ""}
      ${p.userName || p.userEmail ? `<tr><td style="padding:6px 0;color:#666">User</td><td style="padding:6px 0">${esc(p.userName || p.userEmail)}</td></tr>` : ""}
      ${p.recordId ? `<tr><td style="padding:6px 0;color:#666">Record ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px">${esc(p.recordId)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#666">Timestamp</td><td style="padding:6px 0">${esc(time)}</td></tr>
      ${p.notes ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Notes</td><td style="padding:6px 0">${esc(p.notes)}</td></tr>` : ""}
    </table>`;
  let body = "";
  if (action === "edited") {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Changes</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <thead><tr>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px">Field</th>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px;color:#b91c1c">Before</th>
          <th style="padding:8px;text-align:left;background:#fafafa;font-size:12px;color:#166534">After</th>
        </tr></thead>
        <tbody>${renderDiff(p.oldValues, p.newValues)}</tbody>
      </table>`;
  } else if (action === "deleted") {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Deleted Record</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <tbody>${renderRows(p.oldValues || p.newValues)}</tbody>
      </table>`;
  } else {
    body = `
      <h3 style="margin:20px 0 8px;font-size:14px;color:#111">Record Details</h3>
      <table style="width:100%;border-collapse:collapse;border-top:2px solid #111">
        <tbody>${renderRows(p.newValues)}</tbody>
      </table>`;
  }
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;margin:0 auto;color:#111;padding:20px">
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;padding-bottom:12px">
      <div>
        <div style="font-size:18px;font-weight:700">Shriah Group ERP</div>
        <div style="color:#666;font-size:12px">Audit Notification</div>
      </div>
      ${badge}
    </div>
    ${metaTable}
    ${body}
    ${renderAttachmentBlock(extras.attachmentUrl)}
    <div style="margin-top:24px;padding-top:12px;border-top:1px solid #eee;color:#888;font-size:11px;text-align:center">
      This is an automated audit notification. Please do not reply.
    </div>
  </div>`;
}
async function sendGmail(args) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) return { ok: false, error: "Gmail connector not configured" };
  const mime = [
    `From: shriah28@gmail.com`,
    `To: ${args.to}`,
    `Subject: ${encodeHeader(args.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    args.html
  ].join("\r\n");
  const raw = b64urlEncodeString(mime);
  try {
    const r = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw })
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return { ok: false, error: `Gmail ${r.status}: ${txt.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || "fetch failed" };
  }
}
function encodeHeader(s) {
  if (/^[\x20-\x7E]*$/.test(s)) return s;
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}
function b64urlEncodeString(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function logSend(to, subject, action, module, p, result) {
  try {
    await supabaseAdmin.from("notification_email_log").insert({
      recipient_email: to,
      subject,
      status: result.ok ? "sent" : "failed",
      error: result.error || null,
      event_type: `${module}:${action}`,
      module,
      action,
      record_id: p.recordId || null,
      payload: { shopName: p.shopName, userName: p.userName, amount: p.amount, notes: p.notes }
    });
  } catch (e) {
    console.warn("[audit-email] log insert failed:", e?.message || e);
  }
}
const $$splitComponentImporter$2 = () => import("./stock-count._sessionId-wRcH5v5A.mjs");
const Route$2 = createFileRoute("/_app/stock-count/$sessionId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./employees.expenses-UqA_FVR9.mjs");
const Route$1 = createFileRoute("/_app/employees/expenses")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./employees._employeeId-DOQSiR_U.mjs");
const Route = createFileRoute("/_app/employees/$employeeId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StoreRoute = Route$D.update({
  id: "/store",
  path: "/store",
  getParentRoute: () => Route$E
});
const LoginRoute = Route$C.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$E
});
const AppRoute = Route$B.update({
  id: "/_app",
  getParentRoute: () => Route$E
});
const AppIndexRoute = Route$A.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppWebsiteBannersRoute = Route$z.update({
  id: "/website-banners",
  path: "/website-banners",
  getParentRoute: () => AppRoute
});
const AppTeamRoute = Route$y.update({
  id: "/team",
  path: "/team",
  getParentRoute: () => AppRoute
});
const AppSummaryRoute = Route$x.update({
  id: "/summary",
  path: "/summary",
  getParentRoute: () => AppRoute
});
const AppStoreAdminRoute = Route$w.update({
  id: "/store-admin",
  path: "/store-admin",
  getParentRoute: () => AppRoute
});
const AppShopRoute = Route$v.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$u.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppSalesReturnRoute = Route$t.update({
  id: "/sales-return",
  path: "/sales-return",
  getParentRoute: () => AppRoute
});
const AppReportsRoute = Route$s.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AppRoute
});
const AppPushTestRoute = Route$r.update({
  id: "/push-test",
  path: "/push-test",
  getParentRoute: () => AppRoute
});
const AppProfitSummaryRoute = Route$q.update({
  id: "/profit-summary",
  path: "/profit-summary",
  getParentRoute: () => AppRoute
});
const AppPriceCompareRoute = Route$p.update({
  id: "/price-compare",
  path: "/price-compare",
  getParentRoute: () => AppRoute
});
const AppOverviewRoute = Route$o.update({
  id: "/overview",
  path: "/overview",
  getParentRoute: () => AppRoute
});
const AppMyExpensesRoute = Route$n.update({
  id: "/my-expenses",
  path: "/my-expenses",
  getParentRoute: () => AppRoute
});
const AppMonthlySnapshotRoute = Route$m.update({
  id: "/monthly-snapshot",
  path: "/monthly-snapshot",
  getParentRoute: () => AppRoute
});
const AppMonthlyClosingRoute = Route$l.update({
  id: "/monthly-closing",
  path: "/monthly-closing",
  getParentRoute: () => AppRoute
});
const AppLowStockRoute = Route$k.update({
  id: "/low-stock",
  path: "/low-stock",
  getParentRoute: () => AppRoute
});
const AppHelpRoute = Route$j.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => AppRoute
});
const AppFinanceWorkflowRoute = Route$i.update({
  id: "/finance-workflow",
  path: "/finance-workflow",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$h.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppDailyClosingRoute = Route$g.update({
  id: "/daily-closing",
  path: "/daily-closing",
  getParentRoute: () => AppRoute
});
const AppCompanyTransactionsRoute = Route$f.update({
  id: "/company-transactions",
  path: "/company-transactions",
  getParentRoute: () => AppRoute
});
const AppCashFlowRoute = Route$e.update({
  id: "/cash-flow",
  path: "/cash-flow",
  getParentRoute: () => AppRoute
});
const AppCashCustodyRoute = Route$d.update({
  id: "/cash-custody",
  path: "/cash-custody",
  getParentRoute: () => AppRoute
});
const AppBannerAdsRoute = Route$c.update({
  id: "/banner-ads",
  path: "/banner-ads",
  getParentRoute: () => AppRoute
});
const AppBackupCenterRoute = Route$b.update({
  id: "/backup-center",
  path: "/backup-center",
  getParentRoute: () => AppRoute
});
const AppAiInsightsRoute = Route$a.update({
  id: "/ai-insights",
  path: "/ai-insights",
  getParentRoute: () => AppRoute
});
const AppActivityRoute = Route$9.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => AppRoute
});
const AppStockCountIndexRoute = Route$8.update({
  id: "/stock-count/",
  path: "/stock-count/",
  getParentRoute: () => AppRoute
});
const AppEmployeesIndexRoute = Route$7.update({
  id: "/employees/",
  path: "/employees/",
  getParentRoute: () => AppRoute
});
const ApiPublicSendTestPushRoute = Route$6.update({
  id: "/api/public/send-test-push",
  path: "/api/public/send-test-push",
  getParentRoute: () => Route$E
});
const ApiPublicSendOrderPushRoute = Route$5.update({
  id: "/api/public/send-order-push",
  path: "/api/public/send-order-push",
  getParentRoute: () => Route$E
});
const ApiPublicSendOrderEmailRoute = Route$4.update({
  id: "/api/public/send-order-email",
  path: "/api/public/send-order-email",
  getParentRoute: () => Route$E
});
const ApiPublicSendAuditEmailRoute = Route$3.update({
  id: "/api/public/send-audit-email",
  path: "/api/public/send-audit-email",
  getParentRoute: () => Route$E
});
const AppStockCountSessionIdRoute = Route$2.update({
  id: "/stock-count/$sessionId",
  path: "/stock-count/$sessionId",
  getParentRoute: () => AppRoute
});
const AppEmployeesExpensesRoute = Route$1.update({
  id: "/employees/expenses",
  path: "/employees/expenses",
  getParentRoute: () => AppRoute
});
const AppEmployeesEmployeeIdRoute = Route.update({
  id: "/employees/$employeeId",
  path: "/employees/$employeeId",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppActivityRoute,
  AppAiInsightsRoute,
  AppBackupCenterRoute,
  AppBannerAdsRoute,
  AppCashCustodyRoute,
  AppCashFlowRoute,
  AppCompanyTransactionsRoute,
  AppDailyClosingRoute,
  AppDashboardRoute,
  AppFinanceWorkflowRoute,
  AppHelpRoute,
  AppLowStockRoute,
  AppMonthlyClosingRoute,
  AppMonthlySnapshotRoute,
  AppMyExpensesRoute,
  AppOverviewRoute,
  AppPriceCompareRoute,
  AppProfitSummaryRoute,
  AppPushTestRoute,
  AppReportsRoute,
  AppSalesReturnRoute,
  AppSettingsRoute,
  AppShopRoute,
  AppStoreAdminRoute,
  AppSummaryRoute,
  AppTeamRoute,
  AppWebsiteBannersRoute,
  AppIndexRoute,
  AppEmployeesEmployeeIdRoute,
  AppEmployeesExpensesRoute,
  AppStockCountSessionIdRoute,
  AppEmployeesIndexRoute,
  AppStockCountIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  AppRoute: AppRouteWithChildren,
  LoginRoute,
  StoreRoute,
  ApiPublicSendAuditEmailRoute,
  ApiPublicSendOrderEmailRoute,
  ApiPublicSendOrderPushRoute,
  ApiPublicSendTestPushRoute
};
const routeTree = Route$E._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 6e4,
        // 5-min dashboard cache; mutations explicitly invalidate
        gcTime: 30 * 6e4,
        // keep cache warm between page returns
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        // don't refetch on tab focus
        refetchOnReconnect: false,
        retry: 1
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch routes on hover/touch so navigations feel instant.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  DropdownMenuContent as $,
  SelectValue as A,
  Button as B,
  Card as C,
  Dialog as D,
  SelectContent as E,
  SelectItem as F,
  DialogFooter as G,
  listManagedUsers as H,
  Input as I,
  sortShops as J,
  setManagedUserDisabled as K,
  Label as L,
  AlertDialog as M,
  AlertDialogContent as N,
  AlertDialogHeader as O,
  Popover as P,
  AlertDialogTitle as Q,
  AlertDialogDescription as R,
  Sheet as S,
  Textarea as T,
  AlertDialogFooter as U,
  AlertDialogCancel as V,
  WorkingDateProvider as W,
  AlertDialogAction as X,
  deleteManagedUser as Y,
  DropdownMenu as Z,
  DropdownMenuTrigger as _,
  DialogContent as a,
  fetchCustomerVatForSale as a$,
  DropdownMenuItem as a0,
  DropdownMenuSeparator as a1,
  DialogDescription as a2,
  computeAllowedPages as a3,
  ALL_PAGES as a4,
  createManagedUser as a5,
  updateManagedUser as a6,
  resetManagedUserPassword as a7,
  fetchCustomerBalance as a8,
  usePosDueMap as a9,
  sendAuditEmail as aA,
  scanDocumentCached as aB,
  AUDIT_MODULES as aC,
  useTheme as aD,
  Route$t as aE,
  TXN_LABELS as aF,
  SAR_WHOLE as aG,
  shopRank as aH,
  Tabs as aI,
  TabsList as aJ,
  TabsTrigger as aK,
  TabsContent as aL,
  PopoverAnchor as aM,
  AlertDialogTrigger as aN,
  softDeleteRecord as aO,
  restoreRecord as aP,
  useBackClose as aQ,
  getSignedAttachmentUrl as aR,
  CfAttachmentLightbox as aS,
  useWorkflowVerified as aT,
  CashFlowPage as aU,
  CashCustodyPage as aV,
  CfWorkflowVerification as aW,
  SHOP_ORDER as aX,
  Route$a as aY,
  Route$2 as aZ,
  Route as a_,
  POS_CUSTOMER_COLS as aa,
  POS_CUSTOMER_QUERY_KEY as ab,
  PosCustomerPicker as ac,
  useProfileMap as ad,
  displayProfile as ae,
  SAR as af,
  TransactionDialog as ag,
  CardContent as ah,
  traceWholesaleFlow as ai,
  refreshWholesaleDataInBackground as aj,
  Drawer as ak,
  DrawerContent as al,
  DrawerHeader as am,
  DrawerTitle as an,
  RadioGroup as ao,
  RadioGroupItem as ap,
  Route$w as aq,
  useDebouncedValue as ar,
  BarcodeScanner as as,
  DropdownMenuLabel as at,
  DialogTrigger as au,
  useHighlightRecord as av,
  scanDocument as aw,
  Route$v as ax,
  isSimpleShop as ay,
  useSignedAttachmentUrl as az,
  DialogHeader as b,
  posLedger as b0,
  whatsapp as b1,
  shopOrder as b2,
  router as b3,
  DialogTitle as c,
  cn as d,
  SheetContent as e,
  SheetHeader as f,
  SheetTitle as g,
  Badge as h,
  buildOrderMessage as i,
  createSsrRpc as j,
  useAuth as k,
  useServerFn as l,
  Checkbox as m,
  buttonVariants as n,
  useWorkingDate as o,
  PopoverTrigger as p,
  PopoverContent as q,
  useT as r,
  useUserAccess as s,
  todayISO as t,
  useConfirm as u,
  pageKeyFromPath as v,
  whatsappLink as w,
  SheetTrigger as x,
  Select as y,
  SelectTrigger as z
};
