import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as useServerFn, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, B as Button, j as createSsrRpc } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";
import { l as Sparkles, k as LoaderCircle, y as Search, X } from "../_libs/lucide-react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
const searchProductImages = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  name: stringType().max(200).optional(),
  barcode: stringType().max(64).optional(),
  brand: stringType().max(100).optional(),
  itemCode: stringType().max(64).optional(),
  query: stringType().max(200).optional(),
  limit: numberType().min(1).max(12).default(6)
}).parse(input)).handler(createSsrRpc("2958977d1401a1ac12eb5a49626ed0d94a4fc6d8582d53453f58ad7fdfd7c4e6"));
const saveRemoteProductImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  url: stringType().url().max(2e3)
}).parse(input)).handler(createSsrRpc("2fd0bae907d3c91f1c0045e38e90ad09f93d21194d789b1746088d1a2cb34488"));
function FindProductImageDialog({ open, onOpenChange, name, barcode, brand, itemCode, onPicked }) {
  const search = useServerFn(searchProductImages);
  const save = useServerFn(saveRemoteProductImage);
  const [query, setQuery] = reactExports.useState("");
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [picking, setPicking] = reactExports.useState(null);
  const runSearch = async (q) => {
    setLoading(true);
    setItems([]);
    try {
      const res = await search({
        data: {
          query: q?.trim() || void 0,
          name: name ?? void 0,
          barcode: barcode ?? void 0,
          brand: brand ?? void 0,
          itemCode: itemCode ?? void 0,
          limit: 6
        }
      });
      setItems(res?.suggestions ?? []);
      if (!res?.suggestions?.length) toast.message("No images found. Try a different keyword.");
    } catch (e) {
      toast.error(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (open) {
      const seed = [brand, name].filter(Boolean).join(" ").trim() || barcode || itemCode || "";
      setQuery(seed);
      runSearch();
    } else {
      setItems([]);
      setPicking(null);
    }
  }, [open]);
  const handlePick = async (s) => {
    setPicking(s.image);
    try {
      const res = await save({ data: { url: s.image } });
      onPicked(res.url);
      toast.success("Image attached");
      onOpenChange(false);
    } catch (e) {
      toast.error(e?.message ?? "Could not save image");
    } finally {
      setPicking(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-h-[92vh] max-w-md overflow-y-auto p-4",
      onOpenAutoFocus: (e) => e.preventDefault(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
          " Find product image"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Name, barcode or brand",
              autoFocus: false,
              onKeyDown: (e) => {
                if (e.key === "Enter") runSearch(query);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => runSearch(query), disabled: loading, className: "gap-1.5", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }) })
        ] }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 pt-3", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square animate-pulse rounded-lg bg-muted" }, i)) }),
        !loading && items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 pt-3", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handlePick(s),
            disabled: !!picking,
            className: "group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30 transition-all active:scale-[0.97] hover:border-primary disabled:opacity-60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.thumbnail, alt: s.title, loading: "lazy", className: "h-full w-full object-cover" }),
              picking === s.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent p-1 text-[10px] text-white", children: s.source.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] })
            ]
          },
          s.image
        )) }),
        !loading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 pt-6 pb-2 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Type a keyword and tap search." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pt-2 text-[10px] text-muted-foreground", children: "Tap an image to attach it. Image is cached on your shop storage." })
      ]
    }
  ) });
}
export {
  FindProductImageDialog as F
};
