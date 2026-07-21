import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { k as useAuth, l as useServerFn, C as Card, L as Label, I as Input, m as Checkbox, B as Button, j as createSsrRpc } from "./router-KeVl8_Ln.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/vaul.mjs";

import "../_libs/seroval.mjs";
import { W as Wallet, a6 as EyeOff, a7 as Eye, a8 as Mail, I as MessageCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



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
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




const erpPasswordLogin = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  identifier: stringType().trim().min(1).max(255),
  password: stringType().min(1).max(128)
}).parse(input)).handler(createSsrRpc("282ae33f2214e7d600b0a9d05c75806270daae4f0abd9f90ed522de1a789efc4"));
const REMEMBER_KEY = "shriah.remember.identifier";
function LoginPage() {
  const {
    user,
    loading
  } = useAuth();
  const nav = useNavigate();
  const [identifier, setIdentifier] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [remember, setRemember] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const loginFn = useServerFn(erpPasswordLogin);
  reactExports.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_KEY) : null;
    if (saved) {
      setIdentifier(saved);
      setRemember(true);
    }
  }, []);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center text-muted-foreground", children: "Loading…" });
  if (user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  const submit = async (e) => {
    e.preventDefault();
    const id = identifier.trim();
    if (!id || password.length < 1) {
      toast.error("Enter your account and password");
      return;
    }
    setBusy(true);
    try {
      const login = await loginFn({
        data: {
          identifier: id,
          password
        }
      });
      if (!login.ok || !login.email) {
        toast.error("Wrong username or password.");
        setBusy(false);
        return;
      }
      const {
        error
      } = login.token_hash ? await supabase.auth.verifyOtp({
        type: "magiclink",
        token_hash: login.token_hash
      }) : await supabase.auth.verifyOtp({
        email: login.email.toLowerCase(),
        token: login.otp,
        type: "magiclink"
      });
      if (error) {
        throw new Error("Could not create session. Try again.");
      }
      supabase.rpc("reset_failed_login").then(() => {
      });
      if (remember) localStorage.setItem(REMEMBER_KEY, id);
      else localStorage.removeItem(REMEMBER_KEY);
      nav({
        to: "/"
      });
    } catch (err) {
      toast.error(err.message ?? "Invalid credentials");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md bg-card p-8 shadow-[var(--shadow-elegant)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight", children: "ShRiAh Group" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Finance & Warehouse" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "identifier", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "identifier", type: "text", autoComplete: "username", placeholder: "Username / Email / Mobile", value: identifier, onChange: (e) => setIdentifier(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: showPassword ? "text" : "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "pe-11", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute end-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: remember, onCheckedChange: (v) => setRemember(!!v) }),
        "Remember me on this device"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Please wait…" : "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-2 border-t border-border/60 pt-5 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "For Sign Up Please Contact Admin AhsAN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:aahsanuh62@gmail.com", className: "inline-flex items-center gap-2 text-foreground hover:text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
          "aahsanuh62@gmail.com"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://wa.me/966553687388", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 dark:text-emerald-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          "+966 55 368 7388"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  LoginPage as component
};
