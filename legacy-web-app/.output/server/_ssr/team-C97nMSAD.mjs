import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as useUserAccess, l as useServerFn, H as listManagedUsers, J as sortShops, I as Input, d as cn, B as Button, K as setManagedUserDisabled, M as AlertDialog, N as AlertDialogContent, O as AlertDialogHeader, Q as AlertDialogTitle, R as AlertDialogDescription, U as AlertDialogFooter, V as AlertDialogCancel, X as AlertDialogAction, Y as deleteManagedUser, k as useAuth, Z as DropdownMenu, _ as DropdownMenuTrigger, $ as DropdownMenuContent, a0 as DropdownMenuItem, a1 as DropdownMenuSeparator, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, a2 as DialogDescription, L as Label, a3 as computeAllowedPages, a4 as ALL_PAGES, m as Checkbox, a5 as createManagedUser, P as Popover, p as PopoverTrigger, q as PopoverContent, a6 as updateManagedUser, a7 as resetManagedUserPassword } from "./router-KeVl8_Ln.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-Bs6QIVWe.mjs";
import "../_libs/capacitor__core.mjs";
import "../_libs/capacitor__push-notifications.mjs";
import "../_libs/capacitor__local-notifications.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/seroval.mjs";
import "../_libs/vaul.mjs";
import { c as ShieldCheck, y as Search, z as UserPlus, V as Ban, C as CircleCheck, av as EllipsisVertical, a5 as Pencil, aw as KeyRound, T as Trash2, a6 as EyeOff, a7 as Eye, X, m as ChevronDown } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
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
const ROLES = [
  { value: "super_admin", label: "Super Admin", desc: "Full unrestricted access. Manages admins & system." },
  { value: "admin", label: "Admin", desc: "Almost full access. Cannot touch Super Admins." },
  { value: "manager", label: "Manager", desc: "Edit entries, view reports for assigned shops" },
  { value: "accountant", label: "Accountant", desc: "Cash flow, closings, reports, verification" },
  { value: "cashier", label: "Cashier", desc: "Shop sales / purchases / withdraws only" },
  { value: "purchaser", label: "Purchaser", desc: "Create purchases in Finance Workflow" },
  { value: "verifier", label: "Verifier", desc: "Verify / approve / close workflow entries" },
  { value: "deliveryman", label: "Deliveryman", desc: "WholeSale sales & purchases only" },
  { value: "sales_delivery", label: "Sales & Delivery", desc: "WholeSale: sales, purchases, payments-in, deliveries. No withdraw, no edits older than today." },
  { value: "staff", label: "Staff", desc: "Add entries on assigned pages only" },
  { value: "viewer", label: "Viewer", desc: "Read-only access. All actions disabled." }
];
const ROLE_BADGE = {
  super_admin: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/25",
  admin: "bg-primary/15 text-primary border-primary/25",
  manager: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25",
  accountant: "bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/25",
  cashier: "bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/25",
  purchaser: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
  verifier: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/25",
  deliveryman: "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/25",
  sales_delivery: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/25",
  staff: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/25",
  viewer: "bg-muted text-muted-foreground border-border"
};
const ROLE_PRESETS = [
  { key: "admin", label: "Admin" },
  { key: "cashier", label: "Cashier" },
  { key: "purchaser", label: "Purchaser" },
  { key: "verifier", label: "Verifier" },
  { key: "deliveryman", label: "Deliveryman" },
  { key: "sales_delivery", label: "Sales & Delivery" },
  { key: "viewer", label: "Viewer" }
];
function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    }
  });
}
function UserManagementPanel() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const qc = useQueryClient();
  const listFn = useServerFn(listManagedUsers);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["managed-users"],
    enabled: !!isAdmin,
    queryFn: () => listFn()
  });
  const { data: shops = [] } = useQuery({
    queryKey: ["shops-for-access"],
    queryFn: async () => {
      const r = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return sortShops(r.data ?? []);
    }
  });
  const [q, setQ] = reactExports.useState("");
  const [roleFilter, setRoleFilter] = reactExports.useState("all");
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [pwdFor, setPwdFor] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  const users = data?.users ?? [];
  const filtered = reactExports.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter((u) => roleFilter === "all" || u.role === roleFilter).filter(
      (u) => !qq || u.email.toLowerCase().includes(qq) || u.full_name.toLowerCase().includes(qq)
    );
  }, [users, q, roleFilter]);
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["managed-users"] });
    refetch();
  };
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 py-6 text-sm text-muted-foreground", children: "Loading…" });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-muted/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Admins only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "User Management is restricted to administrators." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search name or email…",
            className: "h-10 rounded-xl pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 overflow-x-auto no-scrollbar", children: ["all", "super_admin", "admin", "manager", "accountant", "cashier", "purchaser", "verifier", "deliveryman", "sales_delivery", "staff", "viewer"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setRoleFilter(r),
          className: cn(
            "tap rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            roleFilter === r ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
          ),
          children: r
        },
        r
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateOpen(true), className: "sm:ml-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }),
        " Create user"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border border-border/50 bg-card/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden grid-cols-[1.6fr_1fr_1fr_120px_44px] gap-3 border-b border-border/40 bg-muted/30 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Last sign-in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-6 text-sm text-muted-foreground", children: "Loading users…" }),
      !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "No users match." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: filtered.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "grid grid-cols-[1fr_44px] items-center gap-3 px-4 py-3 sm:grid-cols-[1.6fr_1fr_1fr_120px_44px]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: u.full_name || u.email.split("@")[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: u.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", ROLE_BADGE[u.role]), children: u.role }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden text-[11px] text-muted-foreground sm:block", children: u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block", children: u.is_disabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-3 w-3" }),
              " Disabled"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
              " Active"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              UserRowMenu,
              {
                user: u,
                onEdit: () => setEditing(u),
                onResetPwd: () => setPwdFor(u),
                onToggleDisable: async () => {
                  try {
                    await setManagedUserDisabled({ data: { user_id: u.id, disabled: !u.is_disabled } });
                    toast.success(u.is_disabled ? "User enabled" : "User disabled");
                    invalidate();
                  } catch (e) {
                    toast.error(e.message);
                  }
                },
                onDelete: () => setDeleting(u)
              }
            )
          ]
        },
        u.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1 text-[11px] text-muted-foreground", children: "Public sign-up is disabled. Simple internal passwords are supported; every user must have shop access." }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateUserDialog,
      {
        shops,
        onClose: () => setCreateOpen(false),
        onCreated: () => {
          setCreateOpen(false);
          invalidate();
        }
      }
    ),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditUserDialog,
      {
        user: editing,
        shops,
        onClose: () => setEditing(null),
        onSaved: () => {
          setEditing(null);
          invalidate();
        }
      }
    ),
    pwdFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResetPasswordDialog,
      {
        user: pwdFor,
        onClose: () => setPwdFor(null),
        onDone: () => setPwdFor(null)
      }
    ),
    deleting && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: true, onOpenChange: (o) => !o && setDeleting(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete user?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This permanently removes ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: deleting.email }),
          " and all their authentication data. Their entries remain in the ledger."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            onClick: async () => {
              try {
                await deleteManagedUser({ data: { user_id: deleting.id } });
                toast.success("User deleted");
                setDeleting(null);
                invalidate();
              } catch (e) {
                toast.error(e.message);
              }
            },
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
function UserRowMenu({
  user,
  onEdit,
  onResetPwd,
  onToggleDisable,
  onDelete
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { className: "ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: onEdit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }),
        " Edit"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: onResetPwd, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }),
        " Reset password"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: onToggleDisable, children: [
        user.is_disabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
        user.is_disabled ? "Enable" : "Disable"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: onDelete, className: "text-destructive focus:text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
        " Delete"
      ] })
    ] })
  ] });
}
function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selected,
  onChange,
  minSelect = 0
}) {
  const [open, setOpen] = reactExports.useState(false);
  const toggle = (v) => {
    const has = selected.includes(v);
    const next = has ? selected.filter((x) => x !== v) : [...selected, v];
    if (next.length < minSelect) return;
    onChange(next);
  };
  const labels = selected.map((v) => options.find((o) => o.value === v)?.label).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-2.5 py-1 text-left text-sm shadow-sm hover:bg-muted/40",
          children: [
            labels.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: placeholder }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: labels.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary",
                children: [
                  l,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    X,
                    {
                      className: "h-3 w-3 cursor-pointer opacity-70 hover:opacity-100",
                      onClick: (e) => {
                        e.stopPropagation();
                        toggle(selected[i]);
                      }
                    }
                  )
                ]
              },
              l + i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { align: "start", className: "w-[--radix-popover-trigger-width] p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
        options.map((o) => {
          const checked = selected.includes(o.value);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggle(o.value),
              className: cn(
                "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/60",
                checked && "bg-primary/10"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, className: "mt-0.5 pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-medium", children: o.label }),
                  o.hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] text-muted-foreground", children: o.hint })
                ] })
              ]
            }
          ) }, o.value);
        }),
        options.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "px-2 py-3 text-center text-xs text-muted-foreground", children: "No options." })
      ] }) })
    ] })
  ] });
}
function CreateUserDialog({
  shops,
  onClose,
  onCreated
}) {
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [mobile, setMobile] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [roles, setRoles] = reactExports.useState(["purchaser"]);
  const [shopIds, setShopIds] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!email.trim() && !username.trim() && !mobile.trim()) {
      toast.error("Provide username, email or mobile");
      return;
    }
    if (password.length < 1) {
      toast.error("Password is required");
      return;
    }
    if (roles.length === 0) {
      toast.error("Select at least one role");
      return;
    }
    if (shopIds.length === 0) {
      toast.error("Assign at least one shop");
      return;
    }
    setBusy(true);
    try {
      await createManagedUser({
        data: {
          full_name: fullName.trim(),
          email: email.trim(),
          username: username.trim(),
          mobile: mobile.trim(),
          password,
          roles,
          shop_ids: shopIds
        }
      });
      toast.success("User created");
      onCreated();
    } catch (e2) {
      toast.error(e2.message ?? "Could not create account");
    } finally {
      setBusy(false);
    }
  };
  const applyPreset = (role) => {
    setRoles([role]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md p-0 gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-4 py-3 border-b border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Create user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs", children: "Login with username, email or mobile." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: fullName, onChange: (e) => setFullName(e.target.value), className: "mt-1 h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: username, onChange: (e) => setUsername(e.target.value), className: "mt-1 h-9", placeholder: "optional" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Mobile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: mobile, onChange: (e) => setMobile(e.target.value), className: "mt-1 h-9", placeholder: "optional" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 h-9", placeholder: "optional" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), className: "h-9 pe-10 font-mono", placeholder: "1111" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute end-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Name, username, password, role and shop access are enough. Email/mobile are optional." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Quick preset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1.5", children: ROLE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => applyPreset(p.key),
              className: cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                roles[0] === p.key ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
              ),
              children: p.label
            },
            p.key
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MultiSelectDropdown,
          {
            label: "Roles",
            placeholder: "Select roles…",
            minSelect: 1,
            options: ROLES.map((r) => ({ value: r.value, label: r.label, hint: r.desc })),
            selected: roles,
            onChange: (v) => setRoles(v)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MultiSelectDropdown,
          {
            label: "Shop access (required) *",
            placeholder: "Select at least one shop…",
            options: shops.map((s) => ({ value: s.id, label: s.name })),
            selected: shopIds,
            onChange: setShopIds
          }
        ),
        shopIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-destructive", children: "Every user must be assigned at least one shop." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-t border-border/40 bg-background px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "flex-[2]", children: busy ? "Saving…" : "Save & Create user" })
      ] })
    ] })
  ] }) });
}
function EditUserDialog({
  user,
  shops,
  onClose,
  onSaved
}) {
  const [fullName, setFullName] = reactExports.useState(user.full_name);
  const [roles, setRoles] = reactExports.useState(user.roles && user.roles.length ? user.roles : [user.role]);
  const [shopIds, setShopIds] = reactExports.useState(user.shop_ids);
  const [pageKeys, setPageKeys] = reactExports.useState(user.page_keys ?? []);
  const [landingPage, setLandingPage] = reactExports.useState(user.landing_page ?? "");
  const [busy, setBusy] = reactExports.useState(false);
  const effectivePages = reactExports.useMemo(
    () => computeAllowedPages(roles, pageKeys),
    [roles, pageKeys]
  );
  const isAdminRole = roles.includes("admin") || roles.includes("super_admin");
  const togglePage = (key) => {
    setPageKeys(
      (prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      toast.error("Select at least one role");
      return;
    }
    if (shopIds.length === 0) {
      toast.error("Assign at least one shop");
      return;
    }
    setBusy(true);
    try {
      await updateManagedUser({
        data: {
          user_id: user.id,
          full_name: fullName,
          roles,
          shop_ids: shopIds,
          page_keys: pageKeys,
          landing_page: landingPage ? landingPage : null
        }
      });
      toast.success("User updated");
      onSaved();
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setBusy(false);
    }
  };
  const applyPreset = (role) => {
    setRoles([role]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md p-0 gap-0 max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-4 py-3 border-b border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Edit user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs truncate", children: user.email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "flex min-h-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-3 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Full name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: fullName, onChange: (e) => setFullName(e.target.value), className: "mt-1 h-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Quick preset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1.5", children: ROLE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => applyPreset(p.key),
              className: cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                roles[0] === p.key ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground"
              ),
              children: p.label
            },
            p.key
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MultiSelectDropdown,
          {
            label: "Roles",
            placeholder: "Select roles…",
            minSelect: 1,
            options: ROLES.map((r) => ({ value: r.value, label: r.label, hint: r.desc })),
            selected: roles,
            onChange: (v) => setRoles(v)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MultiSelectDropdown,
          {
            label: "Shop access (required) *",
            placeholder: "Select at least one shop…",
            options: shops.map((s) => ({ value: s.id, label: s.name })),
            selected: shopIds,
            onChange: setShopIds
          }
        ),
        shopIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-destructive", children: "Every user must be assigned at least one shop." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Page access" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            "Effective = role defaults ∪ explicit grants.",
            isAdminRole && " Admin has full access regardless of grants."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: ALL_PAGES.map((p) => {
            const granted = pageKeys.includes(p.key);
            const inherited = !granted && effectivePages.includes(p.key);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-[11px] transition-colors",
                  granted ? "border-primary/40 bg-primary/10" : inherited ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60 bg-card hover:bg-muted/40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate font-medium text-foreground", children: p.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] text-muted-foreground", children: granted ? "Granted" : inherited ? "From role" : "Hidden" })
                  ] }),
                  isAdminRole ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: granted,
                      onCheckedChange: () => togglePage(p.key),
                      className: "h-4 w-4"
                    }
                  )
                ]
              },
              p.key
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Default landing page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: landingPage,
              onChange: (e) => setLandingPage(e.target.value),
              className: "h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Auto (based on role)" }),
                ALL_PAGES.filter((p) => isAdminRole || effectivePages.includes(p.key)).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.key, children: p.label }, p.key))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Page that opens right after this user signs in." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-t border-border/40 bg-background px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "flex-[2]", children: busy ? "Saving…" : "Save changes" })
      ] })
    ] })
  ] }) });
}
function ResetPasswordDialog({
  user,
  onClose,
  onDone
}) {
  const [pwd, setPwd] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (pwd.length < 1) {
      toast.error("Password is required");
      return;
    }
    setBusy(true);
    try {
      await resetManagedUserPassword({ data: { user_id: user.id, new_password: pwd } });
      toast.success("Password reset");
      onDone();
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm p-0 gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-4 py-3 border-b border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Reset password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-xs truncate", children: [
        "For ",
        user.email
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "New password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: showPassword ? "text" : "password", value: pwd, onChange: (e) => setPwd(e.target.value), className: "h-9 pe-10 font-mono", placeholder: "1111" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((v) => !v), className: "absolute end-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground", "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-t border-border/40 bg-background/95 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "flex-[2]", children: busy ? "Saving…" : "Reset password" })
      ] })
    ] })
  ] }) });
}
function TeamPage() {
  const {
    isAdmin,
    loading
  } = useUserAccess();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl p-6 text-sm text-muted-foreground", children: "Loading…" });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Access Restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Only admins can manage the team." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl px-3 sm:px-5 animate-in fade-in-0 duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold tracking-tight", children: "Team & Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage users, roles, shops and per-page permissions in one place." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/40 bg-card/30 p-3 sm:p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserManagementPanel, {}) })
  ] });
}
export {
  TeamPage as component
};
