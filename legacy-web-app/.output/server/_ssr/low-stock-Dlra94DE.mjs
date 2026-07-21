import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { B as Button, C as Card, I as Input, h as Badge, af as SAR, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, G as DialogFooter } from "./router-KeVl8_Ln.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { as as ArrowLeft, aL as CircleAlert, ao as RefreshCw, P as Plus, v as Package, a5 as Pencil } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
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
function LowStockPage() {
  const qc = useQueryClient();
  const [bucket, setBucket] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [editStock, setEditStock] = reactExports.useState("");
  const list = useQuery({
    queryKey: ["low-stock-products"],
    staleTime: 3e4,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("shop_products").select("id,name,image_url,stock,min_stock,price,purchase_price").eq("is_deleted", false).order("stock", {
        ascending: true
      });
      if (error) throw error;
      return (data ?? []).filter((p) => {
        const st = Number(p.stock ?? 0);
        const min = Number(p.min_stock ?? 0);
        return st <= 0 || min > 0 && st <= min;
      });
    }
  });
  const counts = reactExports.useMemo(() => {
    const items = list.data ?? [];
    let neg = 0, zero = 0, low = 0;
    for (const p of items) {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (st < 0) neg++;
      else if (st === 0) zero++;
      else if (min > 0 && st <= min) low++;
    }
    return {
      all: items.length,
      negative: neg,
      zero,
      low
    };
  }, [list.data]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return (list.data ?? []).filter((p) => {
      const st = Number(p.stock ?? 0);
      const min = Number(p.min_stock ?? 0);
      if (bucket === "negative" && !(st < 0)) return false;
      if (bucket === "zero" && st !== 0) return false;
      if (bucket === "low" && !(st > 0 && min > 0 && st <= min)) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [list.data, bucket, search]);
  const save = useMutation({
    mutationFn: async ({
      id,
      stock
    }) => {
      const {
        error
      } = await supabase.from("shop_products").update({
        stock
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["low-stock-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["store-admin-overview"]
      });
      qc.invalidateQueries({
        queryKey: ["warehouse-value-snapshot"]
      });
      setEditing(null);
      toast.success("Stock updated");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const tone = (p) => {
    const st = Number(p.stock ?? 0);
    if (st < 0) return {
      ring: "ring-rose-500/40 bg-rose-500/[0.04]",
      badge: "bg-rose-500",
      label: "Negative stock"
    };
    if (st === 0) return {
      ring: "ring-orange-500/40 bg-orange-500/[0.04]",
      badge: "bg-orange-500",
      label: "Out of stock"
    };
    return {
      ring: "ring-amber-500/40 bg-amber-500/[0.04]",
      badge: "bg-amber-500",
      label: "Low stock"
    };
  };
  const chips = [{
    key: "all",
    label: "All",
    count: counts.all
  }, {
    key: "negative",
    label: "Negative",
    count: counts.negative
  }, {
    key: "zero",
    label: "Zero",
    count: counts.zero
  }, {
    key: "low",
    label: "Low",
    count: counts.low
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl space-y-4 pb-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-[12px] text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/store-admin", className: "inline-flex items-center gap-1 hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
          " Warehouse Admin"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 flex items-center gap-2 text-[22px] font-bold tracking-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-500" }),
          "Low Stock"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground", children: "Products that are zero, negative, or at/below their minimum stock threshold." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => list.refetch(), className: "gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${list.isFetching ? "animate-spin" : ""}` }),
        " Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by product name…", className: "h-9 pr-9" }),
          search.trim() && filtered.length === 0 && !list.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/store-admin", search: {
            tab: "products",
            newName: search.trim()
          }, className: "absolute right-1 top-1/2 -translate-y-1/2", "aria-label": "Add new product", title: `Add "${search.trim()}" as new product`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", className: "h-7 w-7 rounded-md bg-emerald-600 text-white hover:bg-emerald-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1", children: chips.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setBucket(c.key), className: `shrink-0 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors ${bucket === c.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`, children: [
          c.label,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70", children: [
            "(",
            c.count,
            ")"
          ] })
        ] }, c.key)) })
      ] }),
      search.trim() && filtered.length === 0 && !list.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[12px] text-muted-foreground", children: [
        "No Match Found —",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/store-admin", search: {
          tab: "products",
          newName: search.trim()
        }, className: "font-medium text-emerald-600 hover:underline", children: [
          'Add "',
          search.trim(),
          '" as new product'
        ] })
      ] })
    ] }),
    list.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "Loading…" }) : filtered.length === 0 ? !search.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col items-center gap-2 p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "All clear" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: "No products match this filter." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: filtered.map((p) => {
      const t = tone(p);
      const cost = Number(p.purchase_price ?? 0) || Number(p.price ?? 0);
      const impact = Math.max(0, Number(p.stock ?? 0)) * cost;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: `p-3 ring-1 ${t.ring}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: p.name, loading: "lazy", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium leading-tight", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `${t.badge} text-white text-[10px] shrink-0`, children: t.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11.5px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Stock: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: Number(p.stock) < 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground", children: p.stock }),
                p.min_stock > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  " / min ",
                  p.min_stock
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Sale: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(p.price) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Cost: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(p.purchase_price) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Value: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: SAR(impact) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 gap-1.5", onClick: () => {
            setEditing(p);
            setEditStock(String(p.stock ?? 0));
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit stock"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/store-admin", search: {
            tab: "products"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
            " Open product"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/store-admin", search: {
            tab: "purchases"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-8 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Create purchase"
          ] }) })
        ] })
      ] }, p.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adjust stock" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: editing.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground", children: "New stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editStock, onChange: (e) => setEditStock(e.target.value), autoFocus: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
            "Current: ",
            editing.stock,
            " · Min: ",
            editing.min_stock || "—"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => editing && save.mutate({
          id: editing.id,
          stock: Number(editStock || 0)
        }), children: "Save" })
      ] })
    ] }) })
  ] });
}
export {
  LowStockPage as component
};
