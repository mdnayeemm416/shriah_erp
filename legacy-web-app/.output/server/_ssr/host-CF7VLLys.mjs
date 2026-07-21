import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, B as Button } from "./router-KeVl8_Ln.mjs";
import { INVOICE_AM80_EVENT, printAm80, downloadAm80Pdf, downloadAm80Image, shareAm80Image, shareAm80Pdf } from "./share-71lV2Bko.mjs";
import "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/jspdf.mjs";

import "../_libs/qrcode.mjs";
import { X, J as Printer, $ as FileText, a0 as Image, Y as Share2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "./client-Bs6QIVWe.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";



import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/html-to-image.mjs";
import "./zatca-qr-j46Mpz9I.mjs";
import "./types-u21zQmgs.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";

import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";



function InvoiceAm80Host() {
  const [data, setData] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const handler = (e) => setData(e.detail);
    window.addEventListener(INVOICE_AM80_EVENT, handler);
    return () => window.removeEventListener(INVOICE_AM80_EVENT, handler);
  }, []);
  const wrap = (key, fn) => async () => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };
  if (!data) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!data, onOpenChange: (o) => !o && setData(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm gap-3 p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "80mm by AM — #",
        data.invoiceNumber
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setData(null), "aria-label": "Close", className: "rounded p-1 hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 px-4 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: !!busy, onClick: wrap("print", () => printAm80(data)), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1 h-4 w-4" }),
        " ",
        busy === "print" ? "…" : "Print"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: !!busy, onClick: wrap("pdf", () => downloadAm80Pdf(data)), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
        " ",
        busy === "pdf" ? "…" : "PDF"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: !!busy, onClick: wrap("img", () => downloadAm80Image(data)), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "mr-1 h-4 w-4" }),
        " ",
        busy === "img" ? "…" : "Image"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-emerald-600 text-white hover:bg-emerald-700",
          disabled: !!busy,
          onClick: wrap("share-img", () => shareAm80Image(data)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
            " ",
            busy === "share-img" ? "…" : "Share Image"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "col-span-2",
          disabled: !!busy,
          onClick: wrap("share-pdf", () => shareAm80Pdf(data)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "mr-1 h-4 w-4" }),
            " ",
            busy === "share-pdf" ? "…" : "Share PDF"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-t border-border bg-muted/40 px-4 py-2 text-center text-[11px] text-muted-foreground", children: "Optimized for Epson TM-T20II / T20III, XPrinter, Sunmi (80mm)." })
  ] }) });
}
export {
  InvoiceAm80Host
};
