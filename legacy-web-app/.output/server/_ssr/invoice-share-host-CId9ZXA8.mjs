import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, a2 as DialogDescription, B as Button, a$ as fetchCustomerVatForSale } from "./router-KeVl8_Ln.mjs";
import { I as INVOICE_PICKER_EVENT, s as shareInvoiceWithFormat, r as renderInvoiceImageByFormat, d as describeThermalExportError, a as downloadInvoiceImage, p as printThermalReceipt } from "./invoice-formats-3QraRpDE.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import "../_libs/qrcode.mjs";
import { k as LoaderCircle, Y as Share2, _ as Download, J as Printer } from "../_libs/lucide-react.mjs";

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

import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";



async function withCustomerVat(payload) {
  if (payload.partyTaxNo && payload.partyTaxNo.trim()) return payload;
  if (!payload.partyMobile && !payload.partyId) return payload;
  try {
    const vat = await fetchCustomerVatForSale({
      customer_id: payload.partyId ?? null,
      customer_mobile: payload.partyMobile ?? null
    });
    return vat ? { ...payload, partyTaxNo: vat } : payload;
  } catch {
    return payload;
  }
}
const FORMAT = "thermal88";
function InvoiceShareHost() {
  const [pending, setPending] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      const ce = e;
      if (!ce.detail?.payload) return;
      setPending(ce.detail);
    };
    window.addEventListener(INVOICE_PICKER_EVENT, handler);
    return () => window.removeEventListener(INVOICE_PICKER_EVENT, handler);
  }, []);
  const close = () => {
    if (!busy) {
      setPending(null);
    }
  };
  const onShare = async () => {
    if (!pending) return;
    setBusy("share");
    try {
      const payload = await withCustomerVat(pending.payload);
      console.log("[InvoiceShare] pre-share debug", {
        invoiceNumber: payload.invoiceNumber,
        customer: payload.partyName,
        items: payload.items?.length ?? 0,
        total: payload.total,
        template: FORMAT
      });
      await shareInvoiceWithFormat(payload, FORMAT, pending.captionExtra);
    } finally {
      setBusy(null);
      setPending(null);
    }
  };
  const onSharePrintedReceipt = async () => {
    if (!pending) return;
    setBusy("printed-share");
    let blob = null;
    try {
      const payload = await withCustomerVat(pending.payload);
      try {
        blob = await renderInvoiceImageByFormat(payload, FORMAT);
      } catch (genErr) {
        const d = describeThermalExportError(genErr);
        console.error(`[SHARE] Image generation failed
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`, genErr);
        toast.error(`Image generation failed: ${d.exception}`);
        return;
      }
      if (!blob || blob.size === 0) {
        console.error("[SHARE] Blob creation failed", { blob });
        toast.error("Blob creation failed");
        return;
      }
      console.log("[SHARE] Image generated");
      console.log("[SHARE] Blob size", blob.size, blob.type);
      const fileName = `${payload.kind}_${payload.invoiceNumber}_printed_receipt.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const cap = pending.captionExtra ?? `Invoice #${payload.invoiceNumber}`;
      const nav = navigator;
      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          console.log("[SHARE] Share started");
          await nav.share({ files: [file], text: cap });
          console.log("[SHARE] Share success");
          setPending(null);
          return;
        } catch (shareErr) {
          if (shareErr?.name === "AbortError") {
            return;
          }
          console.error("[SHARE] Android share failed", shareErr);
          toast.error(`Android share failed: ${shareErr?.message ?? String(shareErr)}`);
          return;
        }
      }
      console.log("[SHARE] navigator.share unavailable — falling back to download");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      console.log("[SHARE] Share success (download fallback)");
      setPending(null);
    } finally {
      setBusy(null);
    }
  };
  const onDownloadImage = async () => {
    if (!pending) return;
    setBusy("img");
    try {
      const payload = await withCustomerVat(pending.payload);
      await downloadInvoiceImage(payload, FORMAT);
    } finally {
      setBusy(null);
    }
  };
  const onPrint = async () => {
    if (!pending) return;
    setBusy("print");
    try {
      const payload = await withCustomerVat(pending.payload);
      await printThermalReceipt(payload);
      setPending(null);
    } catch (e) {
      console.error(e);
      toast.error("Could not open print window");
    } finally {
      setBusy(null);
    }
  };
  const onDebugExport = async () => {
    if (!pending) return;
    setBusy("debug");
    try {
      const payload = await withCustomerVat(pending.payload);
      console.log("[InvoiceDebug] Debug Export started", { invoiceNumber: payload.invoiceNumber, template: FORMAT });
      const blob = await renderInvoiceImageByFormat(payload, FORMAT);
      console.log("[InvoiceDebug] image generation works — issue is Share API if sharing still fails", { size: blob.size, type: blob.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.kind}_${payload.invoiceNumber}_${FORMAT}_debug.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast.success("Debug Export downloaded — image generation works");
    } catch (e) {
      const d = describeThermalExportError(e);
      console.error(`[InvoiceDebug] FAILED
Failed at:
${d.functionName}
Reason:
${d.exception}
Stack trace:
${d.stack}`, e);
      toast.error(`Failed at ${d.functionName}: ${d.exception}`);
    } finally {
      setBusy(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!pending, onOpenChange: (o) => {
    if (!o) close();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "🧾 88mm Thermal Receipt" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Print, Share and Download all use the exact same 88mm receipt — what prints on paper is what gets shared." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onShare, disabled: !!busy, className: "w-full gap-2", children: [
        busy === "share" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
        "Generate & Share"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onSharePrintedReceipt, disabled: !!busy, variant: "secondary", className: "w-full gap-2", children: [
        busy === "printed-share" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
        "Share Printed Receipt"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onDownloadImage, disabled: !!busy, className: "w-full gap-2", children: [
        busy === "img" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        "Download Image"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "secondary",
          onClick: onPrint,
          disabled: !!busy,
          className: "w-full gap-2",
          title: "Direct 80mm thermal print",
          children: [
            busy === "print" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
            "🖨️ Print Receipt"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          disabled: !!busy,
          className: "w-full gap-2 text-xs",
          title: "Generate and download the exact thermal receipt image without opening the Share API.",
          onClick: onDebugExport,
          children: [
            busy === "debug" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Debug Export"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-muted-foreground", children: "Master template: 88mm thermal. Image shares via WhatsApp / Android share sheet." })
    ] })
  ] }) });
}
export {
  InvoiceShareHost
};
