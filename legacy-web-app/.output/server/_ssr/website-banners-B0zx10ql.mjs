import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, u as useConfirm, C as Card, h as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, I as Input, T as Textarea, y as Select, z as SelectTrigger, A as SelectValue, E as SelectContent, F as SelectItem, G as DialogFooter } from "./router-KeVl8_Ln.mjs";
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
import { as as ArrowLeft, a0 as Image, P as Plus, p as ChevronUp, m as ChevronDown, a7 as Eye, a6 as EyeOff, a5 as Pencil, T as Trash2, at as Calendar } from "../_libs/lucide-react.mjs";

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
const COLS = "id,image_url,title,description,link_type,link_value,is_active,sort_order,start_date,end_date";
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-medium text-muted-foreground", children: label }),
    children
  ] });
}
function toLocalInput(v) {
  if (!v) return "";
  const d = new Date(v);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v) {
  return v ? new Date(v).toISOString() : null;
}
function WebsiteBannersManager() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [editing, setEditing] = reactExports.useState(null);
  const list = useQuery({
    queryKey: ["website-banners-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_banners").select(COLS).order("sort_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
  const products = useQuery({
    queryKey: ["website-banners-products"],
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_products").select("id,name").eq("is_deleted", false).order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const categories = useQuery({
    queryKey: ["website-banners-cats"],
    staleTime: 6e4,
    queryFn: async () => {
      const { data, error } = await supabase.from("shop_categories").select("id,name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["website-banners-admin"] });
    qc.invalidateQueries({ queryKey: ["store-banners"] });
  };
  const save = useMutation({
    mutationFn: async (b) => {
      if (!b.image_url) throw new Error("Banner image is required");
      const payload = {
        image_url: b.image_url,
        title: b.title?.trim() || null,
        description: b.description?.trim() || null,
        link_type: b.link_type || "none",
        link_value: b.link_type && b.link_type !== "none" ? b.link_value || null : null,
        is_active: b.is_active ?? true,
        sort_order: b.sort_order ?? 0,
        start_date: b.start_date || null,
        end_date: b.end_date || null
      };
      if (b.id) {
        const { error } = await supabase.from("shop_banners").update(payload).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("shop_banners").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("Banner saved");
    },
    onError: (e) => toast.error(e.message ?? "Save failed")
  });
  const toggleActive = useMutation({
    mutationFn: async (b) => {
      const { error } = await supabase.from("shop_banners").update({ is_active: !b.is_active }).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: invalidate
  });
  const reorder = useMutation({
    mutationFn: async ({ id, sort_order }) => {
      const { error } = await supabase.from("shop_banners").update({ sort_order }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("shop_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Banner deleted");
    }
  });
  const items = list.data ?? [];
  const nextOrder = reactExports.useMemo(
    () => items.length ? Math.max(...items.map((b) => b.sort_order)) + 1 : 0,
    [items]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Website Banners" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Shown on the customer storefront top carousel." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setEditing({ is_active: true, sort_order: nextOrder, link_type: "none" }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "me-1 h-4 w-4" }),
        " Add Banner"
      ] })
    ] }),
    list.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex flex-col items-center gap-2 p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No banners yet. Add your first banner." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((b, idx) => {
      const now = /* @__PURE__ */ new Date();
      const scheduled = b.start_date && new Date(b.start_date) > now || b.end_date && new Date(b.end_date) < now;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "flex items-center gap-3 overflow-hidden p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted", children: b.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.image_url, alt: "", loading: "lazy", className: "h-full w-full object-cover" }) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: b.title || "Untitled banner" }),
            !b.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "Inactive" }),
            scheduled && b.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Scheduled" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "line-clamp-1 text-[11px] text-muted-foreground", children: [
            "Order ",
            b.sort_order,
            " · Link: ",
            b.link_type
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-7 w-7",
              disabled: idx === 0,
              onClick: () => {
                const prev = items[idx - 1];
                if (!prev) return;
                reorder.mutate({ id: b.id, sort_order: prev.sort_order });
                reorder.mutate({ id: prev.id, sort_order: b.sort_order });
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              className: "h-7 w-7",
              disabled: idx === items.length - 1,
              onClick: () => {
                const next = items[idx + 1];
                if (!next) return;
                reorder.mutate({ id: b.id, sort_order: next.sort_order });
                reorder.mutate({ id: next.id, sort_order: b.sort_order });
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => toggleActive.mutate(b), "aria-label": "Toggle", children: b.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(b), "aria-label": "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            "aria-label": "Delete",
            onClick: async () => {
              const ok = await confirm({ title: "Delete banner?", description: "This cannot be undone." });
              if (ok) del.mutate(b.id);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" })
          }
        )
      ] }, b.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "Edit Banner" : "Add Banner" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Banner image *", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductImageUpload,
          {
            value: editing.image_url ?? null,
            onChange: (url) => setEditing({ ...editing, image_url: url ?? void 0 })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: editing.title ?? "",
            onChange: (e) => setEditing({ ...editing, title: e.target.value }),
            placeholder: "e.g. Mega Sale"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            rows: 2,
            value: editing.description ?? "",
            onChange: (e) => setEditing({ ...editing, description: e.target.value }),
            placeholder: "Short message"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Link type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_type ?? "none",
            onValueChange: (v) => setEditing({ ...editing, link_type: v, link_value: null }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "product", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "category", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "url", children: "External URL" })
              ] })
            ]
          }
        ) }),
        editing.link_type === "product" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Choose product", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_value ?? "",
            onValueChange: (v) => setEditing({ ...editing, link_value: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select product" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (products.data ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
            ]
          }
        ) }),
        editing.link_type === "category" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Choose category", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: editing.link_value ?? "",
            onValueChange: (v) => setEditing({ ...editing, link_value: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (categories.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
            ]
          }
        ) }),
        editing.link_type === "url" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "url",
            value: editing.link_value ?? "",
            onChange: (e) => setEditing({ ...editing, link_value: e.target.value }),
            placeholder: "https://…"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Start date (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "datetime-local",
              value: toLocalInput(editing.start_date ?? null),
              onChange: (e) => setEditing({ ...editing, start_date: fromLocalInput(e.target.value) })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "End date (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "datetime-local",
              value: toLocalInput(editing.end_date ?? null),
              onChange: (e) => setEditing({ ...editing, end_date: fromLocalInput(e.target.value) })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Display order", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: editing.sort_order ?? 0,
              onChange: (e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: editing.is_active ?? true,
                onCheckedChange: (v) => setEditing({ ...editing, is_active: v })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Active" })
          ] })
        ] }),
        (editing.start_date || editing.end_date) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          "Banner will only show between the selected dates."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setEditing(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => editing && save.mutate(editing), disabled: save.isPending, children: save.isPending ? "Saving…" : "Save" })
      ] })
    ] }) })
  ] });
}
function WebsiteBannersPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl space-y-5 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/store-admin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "rounded-full", "aria-label": "Back", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-primary/10 p-2 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "truncate text-[20px] font-bold tracking-tight sm:text-2xl", children: "Website Banners" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: "Banners shown on your customer-facing website." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteBannersManager, {})
  ] });
}
export {
  WebsiteBannersPage as component
};
