import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, u as useConfirm, C as Card, h as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, G as DialogFooter } from "./router-KeVl8_Ln.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { S as Switch } from "./switch-BxdoXYZW.mjs";
import { P as ProductImageUpload } from "./product-image-upload-C4uhr3At.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { as as ArrowLeft, a0 as Image, P as Plus, p as ChevronUp, aM as GripVertical, m as ChevronDown, bp as Link$1, a5 as Pencil, T as Trash2, a7 as Eye, a6 as EyeOff } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "./server-CQ33fA4m.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";



import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "./image-upload-CX99TgIR.mjs";
import "./find-product-image-dialog-DiFuh3SA.mjs";
const COLS = "id,title,subtitle,image_url,button_text,placement,link_type,link_value,is_active,sort_order";
function Field({ label, hint, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-medium text-muted-foreground", children: label }),
    children,
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-[11px] text-muted-foreground", children: hint })
  ] });
}
function BannerAdsManager() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = reactExports.useState(null);
  const list = useQuery({
    queryKey: ["banner-ads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_ads").select(COLS).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const products = useQuery({
    queryKey: ["banner-ads-products"],
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_products").select("id,name").eq("is_deleted", false).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const categories = useQuery({
    queryKey: ["banner-ads-cats"],
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_categories").select("id,name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["banner-ads"] });
    qc.invalidateQueries({ queryKey: ["admin-shop-ads"] });
    qc.invalidateQueries({ queryKey: ["store-ads"] });
    qc.invalidateQueries({ queryKey: ["shop-ads-active-count"] });
  };
  const save = useMutation({
    mutationFn: async (a) => {
      if (!a.image_url) throw new Error("Please upload a banner image");
      const linkType = a.link_type ?? "none";
      const payload = {
        title: a.title?.trim() || null,
        subtitle: a.subtitle?.trim() || null,
        image_url: a.image_url.trim(),
        button_text: a.button_text?.trim() || null,
        placement: a.placement ?? "home",
        link_type: linkType,
        link_value: linkType === "none" ? null : a.link_value?.trim() || null,
        is_active: a.is_active ?? true,
        sort_order: Number(a.sort_order ?? (list.data?.length ?? 0))
      };
      if (a.id) {
        const { error } = await supabase.from("shop_ads").update(payload).eq("id", a.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shop_ads").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Banner saved");
    },
    onError: (e) => toast.error(e?.message ?? "Failed to save")
  });
  const toggle = useMutation({
    mutationFn: async (a) => {
      const { error } = await supabase.from("shop_ads").update({ is_active: !a.is_active }).eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: invalidate
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("shop_ads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Banner deleted");
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const swap = useMutation({
    mutationFn: async ({ a, b }) => {
      const { error: e1 } = await supabase.from("shop_ads").update({ sort_order: b.sort_order }).eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("shop_ads").update({ sort_order: a.sort_order }).eq("id", b.id);
      if (e2) throw e2;
    },
    onSuccess: invalidate
  });
  const move = (idx, dir) => {
    const rows = list.data ?? [];
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = { ...rows[idx] };
    const b = { ...rows[target] };
    if (a.sort_order === b.sort_order) {
      a.sort_order = idx;
      b.sort_order = target;
    }
    swap.mutate({ a, b });
  };
  const placementLabel = (p) => p === "home" ? "Home" : p === "success" ? "Order Success" : "Home + Success";
  const linkLabel = (a) => {
    if (a.link_type === "none" || !a.link_value) return "No link";
    if (a.link_type === "product") return "Product · " + (products.data?.find((p) => p.id === a.link_value)?.name ?? "—");
    if (a.link_type === "category") return "Category · " + (categories.data?.find((c) => c.id === a.link_value)?.name ?? "—");
    return a.link_value;
  };
  const activeCount = reactExports.useMemo(() => (list.data ?? []).filter((a) => a.is_active).length, [list.data]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center justify-between gap-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total banners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-semibold", children: [
          list.data?.length ?? 0,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-2 text-xs font-normal text-muted-foreground", children: [
            activeCount,
            " active"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          className: "gap-2 rounded-2xl",
          onClick: () => setEditing({
            is_active: true,
            placement: "home",
            link_type: "none",
            sort_order: list.data?.length ?? 0
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }),
            " New banner"
          ]
        }
      )
    ] }),
    list.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : !list.data?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col items-center gap-3 p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "No banners yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Add your first promotional banner. It will appear on the storefront home page or order success page." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "mt-1 gap-2 rounded-2xl",
          onClick: () => setEditing({
            is_active: true,
            placement: "home",
            link_type: "none",
            sort_order: 0
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add first banner"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: list.data.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-1 bg-muted/40 px-1.5 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-7 w-7",
            disabled: idx === 0,
            onClick: () => move(idx, -1),
            "aria-label": "Move up",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-7 w-7",
            disabled: idx === (list.data?.length ?? 0) - 1,
            onClick: () => move(idx, 1),
            "aria-label": "Move down",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-28 flex-shrink-0 overflow-hidden bg-muted sm:w-36", children: a.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.image_url, alt: a.title ?? "banner", className: "h-full w-full object-cover", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-[10px] text-muted-foreground", children: "No image" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-semibold leading-tight", children: a.title || "(untitled banner)" }),
            a.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: a.subtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: a.is_active, onCheckedChange: () => toggle.mutate(a), "aria-label": "Active" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: placementLabel(a.placement) }),
          a.button_text && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
            "CTA: ",
            a.button_text
          ] }),
          !a.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "Disabled" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-3 w-3" }),
          " ",
          linkLabel(a)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-8 gap-1.5 rounded-full", onClick: () => setEditing(a), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " Edit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-8 gap-1.5 rounded-full text-rose-600 hover:text-rose-700",
              onClick: async () => {
                if (await confirm({ title: "Delete this banner?", description: "The banner will be removed from the storefront immediately.", confirmText: "Delete", tone: "danger" })) remove.mutate(a.id);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                " Delete"
              ]
            }
          )
        ] })
      ] })
    ] }) }, a.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => !v && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[92vh] max-w-lg overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit banner" : "New banner" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/7] w-full bg-muted", children: editing.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { loading: "lazy", decoding: "async", src: editing.image_url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-xs text-muted-foreground", children: "Banner preview" }) }),
          (editing.title || editing.subtitle || editing.button_text) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 p-3", children: [
            editing.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold leading-tight", children: editing.title }),
            editing.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: editing.subtitle }),
            editing.button_text && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground", children: editing.button_text })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Banner image", hint: "Tap to upload from your phone gallery or take a photo. Recommended 16:7.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductImageUpload,
          {
            value: editing.image_url ?? null,
            onChange: (url) => setEditing({ ...editing, image_url: url }),
            searchHints: { name: editing.title ?? void 0 }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editing.title ?? "",
            onChange: (e) => setEditing({ ...editing, title: e.target.value }),
            placeholder: "e.g. Weekend Mega Sale"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subtitle (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editing.subtitle ?? "",
            onChange: (e) => setEditing({ ...editing, subtitle: e.target.value }),
            placeholder: "e.g. Up to 40% off this Friday only"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Button text (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editing.button_text ?? "",
            onChange: (e) => setEditing({ ...editing, button_text: e.target.value }),
            placeholder: "e.g. Shop now"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Show on", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.placement ?? "home",
            onValueChange: (v) => setEditing({ ...editing, placement: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "home", children: "Home page" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "success", children: "Order success page" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "both", children: "Both pages" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "When tapped", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_type ?? "none",
            onValueChange: (v) => setEditing({ ...editing, link_type: v, link_value: null }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Do nothing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "product", children: "Open product page" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "category", children: "Open category page" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "url", children: "Open custom link" })
              ] })
            ]
          }
        ) }),
        editing.link_type === "product" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_value ?? "",
            onValueChange: (v) => setEditing({ ...editing, link_value: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose product…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: (products.data ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
            ]
          }
        ) }),
        editing.link_type === "category" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_value ?? "",
            onValueChange: (v) => setEditing({ ...editing, link_value: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose category…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-64", children: (categories.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
            ]
          }
        ) }),
        editing.link_type === "url" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Custom link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editing.link_value ?? "",
            onChange: (e) => setEditing({ ...editing, link_value: e.target.value }),
            placeholder: "https://…",
            inputMode: "url"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            editing.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: editing.is_active ? "Banner is active" : "Banner is disabled" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: editing.is_active ?? true,
              onCheckedChange: (v) => setEditing({ ...editing, is_active: v })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: save.isPending, onClick: () => editing && save.mutate(editing), children: save.isPending ? "Saving…" : "Save banner" })
      ] })
    ] }) })
  ] });
}
function BannerAdsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl space-y-5 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/store-admin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "rounded-full", "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-primary/10 p-2 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-[20px] font-bold tracking-tight sm:text-2xl", children: "Banner Ads" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: "Promotional banners for your storefront." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BannerAdsManager, {})
  ] });
}
export {
  BannerAdsPage as component
};
