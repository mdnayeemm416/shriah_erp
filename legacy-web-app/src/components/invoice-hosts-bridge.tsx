// Lazy bridge for the 3 invoice host modals.
//
// Why: InvoiceShareHost, InvoiceA4ShareHost and InvoiceV2Host transitively
// import html2canvas, html-to-image, jspdf and qrcode. Mounting them eagerly
// in __root.tsx shipped those (~hundreds of KB) on every page including
// /login. They are only ever needed when the user explicitly clicks an
// invoice action, which dispatches a window CustomEvent.
//
// This bridge keeps a tiny module-level event listener active at all times,
// and only React.lazy()-loads the matching host the first time its event
// fires. After mount, the host's own useEffect listener takes over.
// No behavior, UI, or business logic change.

import { lazy, Suspense, useEffect, useState } from "react";

const InvoiceShareHost   = lazy(() => import("@/components/invoice-share-host").then(m => ({ default: m.InvoiceShareHost })));
const InvoiceA4ShareHost = lazy(() => import("@/components/invoice-a4-share-host").then(m => ({ default: m.InvoiceA4ShareHost })));
const InvoiceV2Host      = lazy(() => import("@/components/invoice-v2/invoice-v2-host").then(m => ({ default: m.InvoiceV2Host })));
const InvoiceAm80Host    = lazy(() => import("@/components/invoice-am80/host").then(m => ({ default: m.InvoiceAm80Host })));
const SalesReturnInvoiceHost = lazy(() => import("@/components/sales-return-invoice/host").then(m => ({ default: m.SalesReturnInvoiceHost })));

const THERMAL_EVENT = "lovable:invoice-share";
const A4_EVENT      = "lovable:invoice-a4-share";
const V2_EVENT      = "lovable:invoice-v2";
const AM80_EVENT    = "lovable:invoice-am80";
const SRI_EVENT     = "lovable:sales-return-invoice";

export function InvoiceHostsBridge() {
  const [loadThermal, setLoadThermal] = useState(false);
  const [loadA4, setLoadA4]           = useState(false);
  const [loadV2, setLoadV2]           = useState(false);
  const [loadAm80, setLoadAm80]       = useState(false);
  const [loadSri, setLoadSri]         = useState(false);

  useEffect(() => {
    const armed = { thermal: false, a4: false, v2: false, am80: false, sri: false };

    const make = (key: keyof typeof armed, setter: (v: boolean) => void, eventName: string) => (e: Event) => {
      const detail = (e as CustomEvent).detail;
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
    const a = make("a4",      setLoadA4,      A4_EVENT);
    const v = make("v2",      setLoadV2,      V2_EVENT);
    const m = make("am80",    setLoadAm80,    AM80_EVENT);
    const s = make("sri",     setLoadSri,     SRI_EVENT);

    window.addEventListener(THERMAL_EVENT, t as any);
    window.addEventListener(A4_EVENT,      a as any);
    window.addEventListener(V2_EVENT,      v as any);
    window.addEventListener(AM80_EVENT,    m as any);
    window.addEventListener(SRI_EVENT,     s as any);
    return () => {
      window.removeEventListener(THERMAL_EVENT, t as any);
      window.removeEventListener(A4_EVENT,      a as any);
      window.removeEventListener(V2_EVENT,      v as any);
      window.removeEventListener(AM80_EVENT,    m as any);
      window.removeEventListener(SRI_EVENT,     s as any);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      {loadThermal && <InvoiceShareHost />}
      {loadA4      && <InvoiceA4ShareHost />}
      {loadV2      && <InvoiceV2Host />}
      {loadAm80    && <InvoiceAm80Host />}
      {loadSri     && <SalesReturnInvoiceHost />}
    </Suspense>
  );
}
