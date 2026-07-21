import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { aQ as useBackClose, d as cn } from "./router-KeVl8_Ln.mjs";
import { Z as ZoomOut, r as ZoomIn, s as RotateCw, _ as Download, X } from "../_libs/lucide-react.mjs";
function AttachmentLightbox({ open, url, onClose, alt = "attachment" }) {
  const [scale, setScale] = reactExports.useState(1);
  const [rotate, setRotate] = reactExports.useState(0);
  useBackClose(open, (o) => {
    if (!o) onClose();
  });
  reactExports.useEffect(() => {
    if (!open) return;
    setScale(1);
    setRotate(0);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key === "r") setRotate((r) => (r + 90) % 360);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || !url) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: onClose,
      className: "fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-150",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/60", children: "Attachment viewer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setScale((s) => Math.max(s - 0.25, 0.5)), title: "Zoom out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-[44px] text-center text-xs text-white/70", children: [
                  Math.round(scale * 100),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setScale((s) => Math.min(s + 0.25, 4)), title: "Zoom in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: () => setRotate((r) => (r + 90) % 360), title: "Rotate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: url,
                    download: true,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10",
                    title: "Download",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { onClick: onClose, title: "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center justify-center overflow-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: url,
            alt,
            onClick: (e) => e.stopPropagation(),
            className: cn("max-h-full max-w-full select-none rounded-lg shadow-2xl transition-transform"),
            style: { transform: `scale(${scale}) rotate(${rotate}deg)` },
            draggable: false
          }
        ) })
      ]
    }
  );
}
function IconBtn({
  children,
  onClick,
  title
}) {
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
export {
  AttachmentLightbox as A
};
