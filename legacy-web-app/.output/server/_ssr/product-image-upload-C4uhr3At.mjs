import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { uploadProductImage } from "./image-upload-CX99TgIR.mjs";
import { F as FindProductImageDialog } from "./find-product-image-dialog-DiFuh3SA.mjs";
import { au as ImagePlus, k as LoaderCircle, l as Sparkles, i as Camera, j as Upload, T as Trash2 } from "../_libs/lucide-react.mjs";
function ProductImageUpload({ value, onChange, searchHints }) {
  const galleryRef = reactExports.useRef(null);
  const cameraRef = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [findOpen, setFindOpen] = reactExports.useState(false);
  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20 MB");
      return;
    }
    setBusy(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  const canSearch = !!(searchHints?.name || searchHints?.barcode || searchHints?.brand || searchHints?.itemCode);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/30", children: [
      value ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "Product", loading: "lazy", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-7 w-7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No image yet" })
      ] }),
      busy && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) }),
      !value && canSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setFindOpen(true),
          className: "absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-primary to-primary-glow px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            " Find Image"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: galleryRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: cameraRef,
        type: "file",
        accept: "image/*",
        capture: "environment",
        className: "hidden",
        onChange: (e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy,
          onClick: () => cameraRef.current?.click(),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4" }),
            " Camera"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy,
          onClick: () => galleryRef.current?.click(),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            " Gallery"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          disabled: busy || !canSearch,
          onClick: () => setFindOpen(true),
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
            " Find"
          ]
        }
      )
    ] }),
    value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "ghost",
        size: "sm",
        onClick: () => onChange(null),
        className: "w-full gap-1.5 text-rose-600 hover:text-rose-700",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
          " Remove image"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Auto-compressed to 1280px JPEG. Use a clear, well-lit photo of the product." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FindProductImageDialog,
      {
        open: findOpen,
        onOpenChange: setFindOpen,
        name: searchHints?.name,
        barcode: searchHints?.barcode,
        brand: searchHints?.brand,
        itemCode: searchHints?.itemCode,
        onPicked: (url) => onChange(url)
      }
    )
  ] });
}
export {
  ProductImageUpload as P
};
