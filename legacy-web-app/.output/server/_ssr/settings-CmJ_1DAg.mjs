import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import { k as useAuth, u as useConfirm, L as Label, I as Input, B as Button, d as cn, r as useT, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, s as useUserAccess, aC as AUDIT_MODULES, h as Badge, C as Card, ah as CardContent } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useFcmRegister } from "./use-fcm-B-dQhcZ8.mjs";
import { L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as Switch } from "./switch-BxdoXYZW.mjs";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent } from "./collapsible-DUtqt5i7.mjs";
import { S as SARAmount } from "./sar-amount-C377BzWB.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { P as Plus, T as Trash2, c as ShieldCheck, _ as Download, b1 as Archive, aR as Activity, a3 as Bell, a8 as Mail, W as Wallet, b2 as Shield, aA as Info, ak as LogOut, y as Search, X, u as ChevronRight, b3 as Send, aK as Settings2, m as ChevronDown, a4 as History, n as Check, a5 as Pencil } from "../_libs/lucide-react.mjs";

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
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

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




import "../_libs/isbot.mjs";
import "./auth-middleware-Cokoym5w.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "./client.server-BKaVHv6C.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function NotificationRecipientsManager() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [label, setLabel] = reactExports.useState("");
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  const { data: recipients = [], isLoading } = useQuery({
    queryKey: ["notification-recipients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notification_recipients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
  const { data: history = [] } = useQuery({
    queryKey: ["notification-email-log"],
    enabled: showHistory,
    queryFn: async () => {
      const { data, error } = await supabase.from("notification_email_log").select("*").order("sent_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    }
  });
  const add = useMutation({
    mutationFn: async () => {
      const e = email.trim().toLowerCase();
      if (!emailRe.test(e)) throw new Error("Invalid email address");
      const allOn = {};
      AUDIT_MODULES.forEach((m) => {
        allOn[m] = true;
      });
      const { error } = await supabase.from("notification_recipients").insert({ email: e, label: label.trim() || null, created_by: user?.id, event_flags: allOn });
      if (error) throw error;
    },
    onSuccess: () => {
      setEmail("");
      setLabel("");
      qc.invalidateQueries({ queryKey: ["notification-recipients"] });
      toast.success("Recipient added");
    },
    onError: (e) => toast.error(e.message || "Failed to add recipient")
  });
  const toggle = useMutation({
    mutationFn: async (r) => {
      const { error } = await supabase.from("notification_recipients").update({ is_active: !r.is_active }).eq("id", r.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-recipients"] })
  });
  const toggleEvent = useMutation({
    mutationFn: async (args) => {
      const flags = { ...args.r.event_flags || {} };
      flags[args.module] = args.value;
      const { error } = await supabase.from("notification_recipients").update({ event_flags: flags }).eq("id", args.r.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-recipients"] }),
    onError: (e) => toast.error(e.message || "Failed to update")
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("notification_recipients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notification-recipients"] });
      toast.success("Recipient removed");
    },
    onError: (e) => toast.error(e.message || "Failed to remove")
  });
  const test = useMutation({
    mutationFn: async (to) => {
      const r = await fetch("/api/public/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, testRecipient: to })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || `Failed (${r.status})`);
      return j;
    },
    onSuccess: () => toast.success("Test email sent — check inbox"),
    onError: (e) => toast.error(e.message || "Test failed")
  });
  const activeCount = recipients.filter((r) => r.is_active).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Email Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Audit alerts for sales, purchases, expenses, edits & deletes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: activeCount > 0 ? "default" : "secondary", children: [
        activeCount,
        " active"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ne", children: "Email address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ne",
            type: "email",
            placeholder: "name@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nl", children: "Label (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nl",
            placeholder: "e.g. Owner, Manager",
            value: label,
            onChange: (e) => setLabel(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => add.mutate(), disabled: add.isPending || !email.trim(), className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add recipient"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Loading…" }),
      !isLoading && recipients.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg", children: "No recipients yet. Add one above to start receiving audit emails." }),
      recipients.map((r) => {
        const flags = r.event_flags || {};
        const enabledCount = AUDIT_MODULES.filter((m) => flags[m] !== false).length;
        const isOpen = openId === r.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: r.email }),
              r.label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: r.label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: r.is_active, onCheckedChange: () => toggle.mutate(r) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => test.mutate(r.email),
                disabled: test.isPending,
                title: "Send test email",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => remove.mutate(r.id),
                disabled: remove.isPending,
                title: "Remove",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapsible, { open: isOpen, onOpenChange: (o) => setOpenId(o ? r.id : null), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-2 w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground px-1 py-1.5 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5" }),
                "Notification types (",
                enabledCount,
                "/",
                AUDIT_MODULES.length,
                " enabled)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}` })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "pt-2 border-t mt-1 space-y-1.5", children: AUDIT_MODULES.map((m) => {
              const on = flags[m] !== false;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm py-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: on,
                    onCheckedChange: (v) => toggleEvent.mutate({ r, module: m, value: v })
                  }
                )
              ] }, m);
            }) })
          ] })
        ] }) }, r.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowHistory((s) => !s), className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
      showHistory ? "Hide" : "View",
      " send history"
    ] }) }),
    showHistory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-center py-4", children: "No emails sent yet." }),
      history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs p-2 rounded border bg-card flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: h.status === "sent" ? "default" : "destructive", className: "shrink-0", children: h.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: h.recipient_email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate", children: h.module ? `${h.module}${h.action ? ` · ${h.action}` : ""}` : h.subject }),
          h.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-destructive truncate", children: h.error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground shrink-0", children: new Date(h.sent_at).toLocaleString() })
      ] }, h.id))
    ] })
  ] });
}
function EmployeeExpenseCategoriesManager() {
  const qc = useQueryClient();
  const [newName, setNewName] = reactExports.useState("");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["employee-expense-categories", "manage"],
    queryFn: async () => {
      const { data, error } = await supabase.from("employee_expense_categories").select("id, name, is_active, sort_order").order("sort_order").order("name");
      if (error) throw error;
      return data ?? [];
    }
  });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["employee-expense-categories"] });
  };
  const addMut = useMutation({
    mutationFn: async (name) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Enter a name");
      const nextOrder = (rows.reduce((m, r) => Math.max(m, r.sort_order), 0) || 0) + 10;
      const { error } = await supabase.from("employee_expense_categories").insert({ name: trimmed, sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category added");
      setNewName("");
      invalidate();
    },
    onError: (e) => toast.error(e.message || "Failed")
  });
  const renameMut = useMutation({
    mutationFn: async ({ id, name }) => {
      if (!name.trim()) throw new Error("Enter a name");
      const { error } = await supabase.from("employee_expense_categories").update({ name: name.trim() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Renamed");
      setEditingId(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message || "Failed")
  });
  const toggleMut = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { error } = await supabase.from("employee_expense_categories").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e) => toast.error(e.message || "Failed")
  });
  const delMut = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("employee_expense_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e) => toast.error(e.message || "Cannot delete (may be in use)")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage categories employees can pick when submitting expenses. Disable to hide from the picker." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: newName,
          onChange: (e) => setNewName(e.target.value),
          placeholder: "New category name",
          onKeyDown: (e) => {
            if (e.key === "Enter") addMut.mutate(newName);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => addMut.mutate(newName), disabled: addMut.isPending || !newName.trim(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 animate-pulse rounded-xl bg-muted/40" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-xs text-muted-foreground", children: "No categories yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: rows.map((r) => {
      const editing = editingId === r.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 rounded-xl border border-border/60 bg-card p-2.5", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editName, onChange: (e) => setEditName(e.target.value), className: "h-8 flex-1", autoFocus: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-8 w-8",
            onClick: () => renameMut.mutate({ id: r.id, name: editName }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8", onClick: () => setEditingId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `flex-1 text-sm font-medium ${r.is_active ? "" : "text-muted-foreground line-through"}`, children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.is_active ? "Active" : "Off" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: r.is_active,
              onCheckedChange: (v) => toggleMut.mutate({ id: r.id, is_active: v })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-8 w-8",
            onClick: () => {
              setEditingId(r.id);
              setEditName(r.name);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-8 w-8 text-destructive",
            onClick: () => {
              if (confirm(`Delete "${r.name}"?`)) delMut.mutate(r.id);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        )
      ] }) }, r.id);
    }) })
  ] });
}
reactExports.lazy(() => import("./themes-panel-klrD3_bS.mjs").then((m) => ({
  default: m.ThemesPanel
})));
const RecycleBin = reactExports.lazy(() => import("./recycle-bin-BeMiddUq.mjs").then((m) => ({
  default: m.RecycleBin
})));
const LazyFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-xs text-muted-foreground", children: "Loading…" });
const GROUPS = [
  // Workspace (shops, cashiers) and Warehouse (categories) management
  // have moved into the Shop page and Warehouse page 3-dot menus respectively.
  {
    titleKey: "settings.group.advanced",
    items: [{
      key: "team",
      labelKey: "Team & Access",
      icon: ShieldCheck,
      descKey: "Members, roles, shops & page permissions",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(TeamShortcut, {})
    }, {
      key: "backup",
      labelKey: "settings.backup",
      icon: Download,
      descKey: "settings.backup.desc",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(BackupSection, {})
    }, {
      key: "recyclebin",
      labelKey: "settings.recycle",
      icon: Archive,
      descKey: "settings.recycle.desc",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecycleBin, {}) })
    }, {
      key: "activity",
      labelKey: "settings.activity",
      icon: Activity,
      descKey: "settings.activity.desc",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityShortcut, {})
    }]
  },
  {
    titleKey: "settings.group.help",
    items: [
      {
        key: "notifications",
        labelKey: "Push Notifications",
        icon: Bell,
        descKey: "Enable browser & mobile push alerts",
        render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(PushNotificationsSection, {})
      },
      {
        key: "email-recipients",
        labelKey: "Email Notifications",
        icon: Mail,
        descKey: "Email addresses notified on new storefront orders",
        render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationRecipientsManager, {})
      },
      {
        key: "expense-cats",
        labelKey: "Expense Categories",
        icon: Wallet,
        descKey: "Categories employees pick when submitting expenses",
        render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeExpenseCategoriesManager, {})
      },
      // LEGACY (REMOVED): 80mm Invoice Maker, Invoice Designer, and Default Invoice Format
      // entries were deleted. Wholesale now uses Invoice V2 and 80mm by AM only.
      {
        key: "security",
        labelKey: "settings.security",
        icon: Shield,
        descKey: "settings.security.desc",
        render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySection, {})
      },
      {
        key: "about",
        labelKey: "settings.about",
        icon: Info,
        descKey: "settings.about.desc",
        render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {})
      }
    ]
  },
  {
    titleKey: "settings.group.account",
    items: [{
      key: "logout",
      labelKey: "settings.logout",
      icon: LogOut,
      descKey: "settings.logout.desc",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(LogoutSection, {})
    }]
  }
];
function SettingsPage() {
  const [active, setActive] = reactExports.useState(null);
  const [query, setQuery] = reactExports.useState("");
  const t = useT();
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => {
        const label = t(i.labelKey).toLowerCase();
        const desc = t(i.descKey).toLowerCase();
        const title = t(g.titleKey).toLowerCase();
        return label.includes(q) || desc.includes(q) || title.includes(q);
      })
    })).filter((g) => g.items.length > 0);
  }, [query, t]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-none min-w-0 animate-in fade-in-0 duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold tracking-tight", children: t("settings.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("settings.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: t("settings.search"), className: "h-11 rounded-xl border-border/60 bg-muted/40 ps-10 pe-10 text-sm shadow-none focus-visible:bg-background" }),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuery(""), className: "absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-7", children: [
      filtered.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "animate-in fade-in-0 slide-in-from-bottom-1 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80", children: t(group.titleKey) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border/50 bg-card/40", children: group.items.map((item, idx) => {
          const isActive = active === item.key;
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(idx > 0 && "border-t border-border/40"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(isActive ? null : item.key), className: cn("group flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors", "hover:bg-muted/50 active:bg-muted/70", isActive && "bg-muted/40"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-[18px] w-[18px] shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"), strokeWidth: 1.75 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("truncate text-[14px] font-medium leading-tight", isActive && "text-primary"), children: t(item.labelKey) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-muted-foreground", children: t(item.descKey) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-300 rtl:rotate-180", isActive && "!rotate-90 text-primary") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("grid transition-all duration-300 ease-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 bg-background/40 p-4", children: isActive && item.render() }) }) })
          ] }, item.key);
        }) })
      ] }, group.titleKey)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: t("settings.noMatch", {
        query
      }) })
    ] })
  ] });
}
function ActivityShortcut() {
  const t = useT();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: t("settings.activity.desc") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/activity", className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
      " ",
      t("settings.activity")
    ] })
  ] });
}
function TeamShortcut() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: "Manage members, roles, shop assignments and per-page permissions in one place." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/team", className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
      " Open Team & Access"
    ] })
  ] });
}
function SecuritySection() {
  const {
    user,
    signOut
  } = useAuth();
  const nav = useNavigate();
  const t = useT();
  const [busy, setBusy] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-muted/30 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: t("security.signedInAs") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-sm font-medium", children: user?.email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11.5px] text-muted-foreground", children: t("security.note") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", disabled: busy, onClick: async () => {
      setBusy(true);
      await signOut();
      nav({
        to: "/login"
      });
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "me-1 h-4 w-4" }),
      " ",
      t("security.signout")
    ] })
  ] });
}
function AboutSection() {
  const t = useT();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-card to-background p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-bold", children: t("about.product") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12px] text-muted-foreground", children: t("about.tag") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 inline-flex items-center gap-2 rounded-md bg-background/60 px-2 py-1 text-[11px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("about.version") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: "1.0.0" })
    ] })
  ] }) });
}
function SectionShell({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children });
}
function ShopsSection() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const confirm2 = useConfirm();
  const [name, setName] = reactExports.useState("");
  const [opening, setOpening] = reactExports.useState("0");
  const [shopType, setShopType] = reactExports.useState("full_erp");
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data: shops = []
  } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("shops").select("*").eq("is_deleted", false);
      const {
        sortShops
      } = await import("./router-KeVl8_Ln.mjs").then((n) => n.b2);
      return sortShops(data ?? []);
    }
  });
  const addShop = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("shops").insert({
      name,
      opening_cash: Number(opening),
      shop_type: shopType,
      created_by: user.id
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Shop added");
      setName("");
      setOpening("0");
      setShopType("full_erp");
      qc.invalidateQueries({
        queryKey: ["shops"]
      });
    }
  };
  const setType = async (id, t) => {
    const {
      error
    } = await supabase.from("shops").update({
      shop_type: t
    }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Type updated");
      qc.invalidateQueries({
        queryKey: ["shops"]
      });
    }
  };
  const deleteShop = async (id) => {
    if (!await confirm2({
      title: "Move shop to Recycle Bin?",
      description: "Entries linked to this shop stay archived. You can restore the shop from the Recycle Bin.",
      confirmText: "Move to Bin",
      icon: "recycle",
      tone: "warning"
    })) return;
    const {
      softDelete
    } = await import("./soft-delete-DQY0d6eC.mjs");
    const {
      error
    } = await softDelete("shops", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Moved to Recycle Bin");
      qc.invalidateQueries({
        queryKey: ["shops"]
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addShop, className: "grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Shop name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Main branch", className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Opening cash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", value: opening, onChange: (e) => setOpening(e.target.value), className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: shopType, onChange: (e) => setShopType(e.target.value), className: "mt-1.5 block h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full_erp", children: "Full ERP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "simple_cash", children: "Simple Cash" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "sm:self-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y divide-border/50 rounded-xl border border-border/40", children: [
      shops.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-6 text-center text-sm text-muted-foreground", children: "No shops yet." }),
      shops.map((s) => {
        const simple = s.shop_type === "simple_cash";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider", simple ? "bg-amber-500/15 text-amber-600 dark:text-amber-300" : "bg-primary/15 text-primary"), children: simple ? "Simple" : "ERP" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              "Opening · ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SARAmount, { value: s.opening_cash, size: "sm", bold: false })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: s.shop_type ?? "full_erp", onChange: (e) => setType(s.id, e.target.value), className: "h-8 rounded-md border border-input bg-transparent px-1.5 text-xs", "aria-label": "Shop type", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full_erp", children: "Full ERP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "simple_cash", children: "Simple Cash" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteShop(s.id), className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, s.id);
      })
    ] })
  ] });
}
function BackupSection() {
  const {
    user
  } = useAuth();
  const [busy, setBusy] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [status, setStatus] = reactExports.useState("");
  const [preview, setPreview] = reactExports.useState(null);
  const fileRef = React__default.useRef(null);
  const {
    data: isAdmin
  } = useQuery({
    queryKey: ["is-admin-backup", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "inline h-4 w-4 mr-1" }),
      "Only admins can backup or restore."
    ] }) });
  }
  const runBackup = async () => {
    setBusy(true);
    setProgress(0);
    setStatus("");
    try {
      const {
        exportEverything
      } = await import("./backup-restore-CrfSxEL7.mjs");
      await exportEverything((msg, pct) => {
        setStatus(msg);
        setProgress(pct);
      });
      toast.success("Full backup package downloaded");
    } catch (e) {
      toast.error(e.message ?? "Backup failed");
    } finally {
      setBusy(false);
      setTimeout(() => {
        setProgress(0);
        setStatus("");
      }, 2500);
    }
  };
  const runExport = async (kind) => {
    setBusy(true);
    setProgress(0);
    setStatus("");
    try {
      const lib = await import("./backup-restore-CrfSxEL7.mjs");
      const fn = kind === "xlsx" ? lib.exportExcelOnly : kind === "csv" ? lib.exportCsvZip : lib.exportJson;
      await fn((msg, pct) => {
        setStatus(msg);
        setProgress(pct);
      });
      toast.success(`${kind.toUpperCase()} backup downloaded`);
    } catch (e) {
      toast.error(e.message ?? "Export failed");
    } finally {
      setBusy(false);
      setTimeout(() => {
        setProgress(0);
        setStatus("");
      }, 2500);
    }
  };
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setProgress(10);
    setStatus("Reading file…");
    try {
      const {
        parseBackupFile,
        summarizeRestore
      } = await import("./backup-restore-CrfSxEL7.mjs");
      const data = await parseBackupFile(file);
      const summary = summarizeRestore(data);
      if (!summary.length) {
        toast.error("No restorable data found in file");
        return;
      }
      setPreview({
        data,
        summary,
        fileName: file.name
      });
    } catch (err) {
      toast.error(err.message ?? "Could not read file");
    } finally {
      setBusy(false);
      setProgress(0);
      setStatus("");
    }
  };
  const confirmRestore = async () => {
    if (!preview) return;
    setBusy(true);
    setProgress(0);
    try {
      const {
        restoreData
      } = await import("./backup-restore-CrfSxEL7.mjs");
      await restoreData(preview.data, (msg, pct) => {
        setStatus(msg);
        setProgress(pct);
      });
      toast.success("Restore complete. Reloading…");
      setPreview(null);
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      toast.error(e.message ?? "Restore failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Backup & Export" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Export all ERP data for migration into the new ShRiAh Group ERP. UTF-8 encoded — supports Bangla & Arabic." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => runExport("xlsx"), disabled: busy, variant: "outline", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
          " Excel (.xlsx)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => runExport("csv"), disabled: busy, variant: "outline", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
          " CSV (.zip)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => runExport("json"), disabled: busy, variant: "outline", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
          " JSON (.json)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: runBackup, disabled: busy, className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
          " Full Package (.zip)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        "Full Package contains Excel + per-table CSVs + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "px-1 rounded bg-muted", children: "app_config.json" }),
        " + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "px-1 rounded bg-muted", children: "attachments_metadata.json" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Restore Backup" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Upload a previously downloaded ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".xlsx" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".zip" }),
        ", or ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ".json" }),
        ". You will see a preview before any change is applied."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".xlsx,.zip,.json", onChange: onFile, className: "hidden" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => fileRef.current?.click(), disabled: busy, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "mr-1 h-4 w-4" }),
        " Choose Backup File…"
      ] })
    ] }),
    busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
        width: `${progress}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!preview, onOpenChange: (o) => !o && setPreview(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirm Restore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "File: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: preview?.fileName }),
          ". The following data will be imported (existing rows with the same ID will be overwritten). User accounts and activity logs are skipped for safety."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-auto rounded-lg border border-border/60 p-3 text-xs space-y-1", children: preview?.summary.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.table }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: s.rows })
      ] }, s.table)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: confirmRestore, children: "Restore" })
      ] })
    ] }) })
  ] }) });
}
function LogoutSection() {
  const {
    signOut
  } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You will need to sign in again to access your workspace." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", disabled: busy, onClick: async () => {
      setBusy(true);
      await signOut();
      nav({
        to: "/login"
      });
    }, className: "w-full sm:w-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-1 h-4 w-4" }),
      " ",
      busy ? "Signing out…" : "Sign out"
    ] })
  ] });
}
function PushNotificationsSection() {
  const {
    register
  } = useFcmRegister();
  const access = useUserAccess();
  const [busy, setBusy] = reactExports.useState(false);
  const [perm, setPerm] = reactExports.useState(typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported");
  const enable = async () => {
    setBusy(true);
    try {
      const tok = await register();
      if (typeof window !== "undefined" && "Notification" in window) setPerm(Notification.permission);
      if (!tok && Notification.permission !== "granted") {
        toast.error("Permission not granted");
      }
    } finally {
      setBusy(false);
    }
  };
  const sendTest = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") {
      toast.error("Enable notifications first");
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js") ?? await navigator.serviceWorker.ready;
      if (reg) {
        await reg.showNotification("Test Notification", {
          body: "Push notifications are working on this device.",
          icon: "/favicon.ico",
          tag: `test-${Date.now()}`
        });
      } else {
        new Notification("Test Notification", {
          body: "Push notifications are working."
        });
      }
      toast.success("Test sent");
    } catch (e) {
      toast.error(e?.message ?? "Failed to send test");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receive push alerts for new orders, payments, and stock — even when the app is closed." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-2 py-0.5 font-medium", perm === "granted" ? "bg-emerald-100 text-emerald-700" : perm === "denied" ? "bg-rose-100 text-rose-700" : "bg-muted text-foreground"), children: perm === "unsupported" ? "Unsupported" : perm })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: enable, disabled: busy || perm === "denied" || perm === "unsupported", size: "sm", children: busy ? "Enabling…" : perm === "granted" ? "Re-register device" : "Enable notifications" }),
      access.isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: sendTest, variant: "outline", size: "sm", disabled: perm !== "granted", children: "Send test notification" })
    ] }),
    perm === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-600", children: "Notifications are blocked. Enable them in your browser site settings, then reload." })
  ] });
}
export {
  ShopsSection,
  SettingsPage as component
};
