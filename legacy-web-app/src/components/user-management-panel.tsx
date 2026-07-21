import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Search, UserPlus, MoreVertical, Pencil, KeyRound, Ban, CheckCircle2, Trash2, ChevronDown, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { sortShops } from "@/lib/shop-order";
import { ALL_PAGES, computeAllowedPages, type PageKey } from "@/lib/page-access";
import {
  listManagedUsers, createManagedUser, updateManagedUser,
  setManagedUserDisabled, resetManagedUserPassword, deleteManagedUser,
} from "@/lib/user-management.functions";

type Role =
  | "super_admin" | "admin" | "manager" | "accountant"
  | "cashier" | "purchaser" | "verifier" | "deliveryman"
  | "sales_delivery"
  | "staff" | "viewer";

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "super_admin", label: "Super Admin",  desc: "Full unrestricted access. Manages admins & system." },
  { value: "admin",       label: "Admin",        desc: "Almost full access. Cannot touch Super Admins." },
  { value: "manager",     label: "Manager",      desc: "Edit entries, view reports for assigned shops" },
  { value: "accountant",  label: "Accountant",   desc: "Cash flow, closings, reports, verification" },
  { value: "cashier",     label: "Cashier",      desc: "Shop sales / purchases / withdraws only" },
  { value: "purchaser",   label: "Purchaser",    desc: "Create purchases in Finance Workflow" },
  { value: "verifier",    label: "Verifier",     desc: "Verify / approve / close workflow entries" },
  { value: "deliveryman", label: "Deliveryman",  desc: "WholeSale sales & purchases only" },
  { value: "sales_delivery", label: "Sales & Delivery", desc: "WholeSale: sales, purchases, payments-in, deliveries. No withdraw, no edits older than today." },
  { value: "staff",       label: "Staff",        desc: "Add entries on assigned pages only" },
  { value: "viewer",      label: "Viewer",       desc: "Read-only access. All actions disabled." },
];

const ROLE_BADGE: Record<Role, string> = {
  super_admin: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/25",
  admin:       "bg-primary/15 text-primary border-primary/25",
  manager:     "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25",
  accountant:  "bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/25",
  cashier:     "bg-teal-500/15 text-teal-600 dark:text-teal-300 border-teal-500/25",
  purchaser:   "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
  verifier:    "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/25",
  deliveryman: "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/25",
  sales_delivery: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/25",
  staff:       "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/25",
  viewer:      "bg-muted text-muted-foreground border-border",
};

const ROLE_PRESETS: { key: Role; label: string }[] = [
  { key: "admin",       label: "Admin" },
  { key: "cashier",     label: "Cashier" },
  { key: "purchaser",   label: "Purchaser" },
  { key: "verifier",    label: "Verifier" },
  { key: "deliveryman", label: "Deliveryman" },
  { key: "sales_delivery", label: "Sales & Delivery" },
  { key: "viewer",      label: "Viewer" },
];

type ManagedUser = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  roles?: Role[];
  is_disabled: boolean;
  created_at: string;
  last_sign_in_at: string | null;
  shop_ids: string[];
  page_keys?: string[];
  landing_page?: string | null;
};

function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });
}

export function UserManagementPanel() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const qc = useQueryClient();
  const listFn = useServerFn(listManagedUsers);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["managed-users"],
    enabled: !!isAdmin,
    queryFn: () => listFn(),
  });

  const { data: shops = [] } = useQuery({
    queryKey: ["shops-for-access"],
    queryFn: async () => {
      const r = await supabase.from("shops").select("id,name").eq("is_deleted", false);
      return sortShops((r.data ?? []) as any[]) as { id: string; name: string }[];
    },
  });

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [pwdFor, setPwdFor] = useState<ManagedUser | null>(null);
  const [deleting, setDeleting] = useState<ManagedUser | null>(null);

  const users: ManagedUser[] = (data?.users ?? []) as ManagedUser[];
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users
      .filter((u) => roleFilter === "all" || u.role === roleFilter)
      .filter((u) =>
        !qq ||
        u.email.toLowerCase().includes(qq) ||
        u.full_name.toLowerCase().includes(qq),
      );
  }, [users, q, roleFilter]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["managed-users"] });
    refetch();
  };

  if (roleLoading) {
    return <p className="px-1 py-6 text-sm text-muted-foreground">Loading…</p>;
  }
  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
        <p className="text-sm font-medium">Admins only</p>
        <p className="mt-1 text-xs text-muted-foreground">
          User Management is restricted to administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(["all", "super_admin", "admin", "manager", "accountant", "cashier", "purchaser", "verifier", "deliveryman", "sales_delivery", "staff", "viewer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "tap rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                roleFilter === r
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreateOpen(true)} className="sm:ml-1">
          <UserPlus className="h-4 w-4" /> Create user
        </Button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40">
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_120px_44px] gap-3 border-b border-border/40 bg-muted/30 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid">
          <span>User</span>
          <span>Role</span>
          <span>Last sign-in</span>
          <span>Status</span>
          <span></span>
        </div>
        {isLoading && <p className="px-4 py-6 text-sm text-muted-foreground">Loading users…</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No users match.</p>
        )}
        <ul className="divide-y divide-border/40">
          {filtered.map((u) => (
            <li
              key={u.id}
              className="grid grid-cols-[1fr_44px] items-center gap-3 px-4 py-3 sm:grid-cols-[1.6fr_1fr_1fr_120px_44px]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {u.full_name || u.email.split("@")[0]}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
              </div>
              <div className="hidden sm:block">
                <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", ROLE_BADGE[u.role])}>
                  {u.role}
                </span>
              </div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">
                {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}
              </div>
              <div className="hidden sm:block">
                {u.is_disabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                    <Ban className="h-3 w-3" /> Disabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                )}
              </div>
              <UserRowMenu
                user={u}
                onEdit={() => setEditing(u)}
                onResetPwd={() => setPwdFor(u)}
                onToggleDisable={async () => {
                  try {
                    await setManagedUserDisabled({ data: { user_id: u.id, disabled: !u.is_disabled } });
                    toast.success(u.is_disabled ? "User enabled" : "User disabled");
                    invalidate();
                  } catch (e: any) { toast.error(e.message); }
                }}
                onDelete={() => setDeleting(u)}
              />
            </li>
          ))}
        </ul>
      </div>

        <p className="px-1 text-[11px] text-muted-foreground">
        Public sign-up is disabled. Simple internal passwords are supported; every user must have shop access.
      </p>

      {createOpen && (
        <CreateUserDialog
          shops={shops}
          onClose={() => setCreateOpen(false)}
          onCreated={() => { setCreateOpen(false); invalidate(); }}
        />
      )}
      {editing && (
        <EditUserDialog
          user={editing}
          shops={shops}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidate(); }}
        />
      )}
      {pwdFor && (
        <ResetPasswordDialog
          user={pwdFor}
          onClose={() => setPwdFor(null)}
          onDone={() => setPwdFor(null)}
        />
      )}
      {deleting && (
        <AlertDialog open onOpenChange={(o) => !o && setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes <span className="font-medium">{deleting.email}</span> and all their authentication data. Their entries remain in the ledger.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={async () => {
                  try {
                    await deleteManagedUser({ data: { user_id: deleting.id } });
                    toast.success("User deleted");
                    setDeleting(null);
                    invalidate();
                  } catch (e: any) { toast.error(e.message); }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

function UserRowMenu({
  user, onEdit, onResetPwd, onToggleDisable, onDelete,
}: {
  user: ManagedUser;
  onEdit: () => void;
  onResetPwd: () => void;
  onToggleDisable: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResetPwd}>
          <KeyRound className="h-4 w-4" /> Reset password
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleDisable}>
          {user.is_disabled ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
          {user.is_disabled ? "Enable" : "Disable"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------- Compact multi-select dropdown with chips -------- */
function MultiSelectDropdown({
  label, placeholder, options, selected, onChange, minSelect = 0,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string; hint?: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
  minSelect?: number;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) => {
    const has = selected.includes(v);
    const next = has ? selected.filter((x) => x !== v) : [...selected, v];
    if (next.length < minSelect) return;
    onChange(next);
  };
  const labels = selected
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-1">
      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-2.5 py-1 text-left text-sm shadow-sm hover:bg-muted/40"
          >
            {labels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {labels.map((l, i) => (
                  <span
                    key={l + i}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {l}
                    <X
                      className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(selected[i]);
                      }}
                    />
                  </span>
                ))}
              </div>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-1">
          <ul>
            {options.map((o) => {
              const checked = selected.includes(o.value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => toggle(o.value)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/60",
                      checked && "bg-primary/10",
                    )}
                  >
                    <Checkbox checked={checked} className="mt-0.5 pointer-events-none" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{o.label}</span>
                      {o.hint && <span className="block text-[11px] text-muted-foreground">{o.hint}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="px-2 py-3 text-center text-xs text-muted-foreground">No options.</li>
            )}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* -------- Create User -------- */
function CreateUserDialog({
  shops, onClose, onCreated,
}: { shops: { id: string; name: string }[]; onClose: () => void; onCreated: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>(["purchaser"]);
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("Full name is required"); return; }
    if (!email.trim() && !username.trim() && !mobile.trim()) {
      toast.error("Provide username, email or mobile"); return;
    }
    if (password.length < 1) { toast.error("Password is required"); return; }
    if (roles.length === 0) { toast.error("Select at least one role"); return; }
    if (shopIds.length === 0) {
      toast.error("Assign at least one shop"); return;
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
          shop_ids: shopIds,
        },
      });
      toast.success("User created");
      onCreated();
    } catch (e: any) {
      toast.error(e.message ?? "Could not create account");
    } finally {
      setBusy(false);
    }
  };

  const applyPreset = (role: Role) => {
    setRoles([role]);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border/40">
          <DialogTitle className="text-base">Create user</DialogTitle>
          <DialogDescription className="text-xs">
            Login with username, email or mobile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="space-y-3 px-4 py-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Full name</Label>
              <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-9" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 h-9" placeholder="optional" />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Mobile</Label>
                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1 h-9" placeholder="optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-9" placeholder="optional" />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Password</Label>
                <div className="relative mt-1">
                  <Input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-9 pe-10 font-mono" placeholder="1111" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute end-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">Name, username, password, role and shop access are enough. Email/mobile are optional.</p>

            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Quick preset</Label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {ROLE_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      roles[0] === p.key
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <MultiSelectDropdown
              label="Roles"
              placeholder="Select roles…"
              minSelect={1}
              options={ROLES.map((r) => ({ value: r.value, label: r.label, hint: r.desc }))}
              selected={roles}
              onChange={(v) => setRoles(v as Role[])}
            />
            <MultiSelectDropdown
              label="Shop access (required) *"
              placeholder="Select at least one shop…"
              options={shops.map((s) => ({ value: s.id, label: s.name }))}
              selected={shopIds}
              onChange={setShopIds}
            />
            {shopIds.length === 0 && (
              <p className="text-[11px] text-destructive">Every user must be assigned at least one shop.</p>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-border/40 bg-background px-4 py-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="flex-[2]">
              {busy ? "Saving…" : "Save & Create user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------- Edit User -------- */
function EditUserDialog({
  user, shops, onClose, onSaved,
}: { user: ManagedUser & { roles?: Role[] }; shops: { id: string; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const [fullName, setFullName] = useState(user.full_name);
  const [roles, setRoles] = useState<Role[]>((user.roles && user.roles.length ? user.roles : [user.role]) as Role[]);
  const [shopIds, setShopIds] = useState<string[]>(user.shop_ids);
  const [pageKeys, setPageKeys] = useState<string[]>(user.page_keys ?? []);
  const [landingPage, setLandingPage] = useState<string>(user.landing_page ?? "");
  const [busy, setBusy] = useState(false);

  // Effective allowed pages = role defaults ∪ explicit grants
  const effectivePages = useMemo(
    () => computeAllowedPages(roles, pageKeys),
    [roles, pageKeys],
  );
  const isAdminRole = roles.includes("admin") || roles.includes("super_admin");

  const togglePage = (key: PageKey) => {
    setPageKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roles.length === 0) { toast.error("Select at least one role"); return; }
    if (shopIds.length === 0) {
      toast.error("Assign at least one shop"); return;
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
          landing_page: landingPage ? landingPage : null,
        },
      });
      toast.success("User updated");
      onSaved();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const applyPreset = (role: Role) => {
    setRoles([role]);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-4 py-3 border-b border-border/40">
          <DialogTitle className="text-base">Edit user</DialogTitle>
          <DialogDescription className="text-xs truncate">{user.email}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-3 px-4 py-3 overflow-y-auto">
            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Full name</Label>
              <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-9" />
            </div>

            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Quick preset</Label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {ROLE_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      roles[0] === p.key
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <MultiSelectDropdown
              label="Roles"
              placeholder="Select roles…"
              minSelect={1}
              options={ROLES.map((r) => ({ value: r.value, label: r.label, hint: r.desc }))}
              selected={roles}
              onChange={(v) => setRoles(v as Role[])}
            />
            <MultiSelectDropdown
              label="Shop access (required) *"
              placeholder="Select at least one shop…"
              options={shops.map((s) => ({ value: s.id, label: s.name }))}
              selected={shopIds}
              onChange={setShopIds}
            />
            {shopIds.length === 0 && (
              <p className="text-[11px] text-destructive">Every user must be assigned at least one shop.</p>
            )}

            {/* Page access grid */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Page access
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Effective = role defaults ∪ explicit grants.{isAdminRole && " Admin has full access regardless of grants."}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_PAGES.map((p) => {
                  const granted = pageKeys.includes(p.key);
                  const inherited = !granted && effectivePages.includes(p.key);
                  return (
                    <label
                      key={p.key}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-[11px] transition-colors",
                        granted ? "border-primary/40 bg-primary/10" :
                        inherited ? "border-emerald-500/30 bg-emerald-500/5" :
                        "border-border/60 bg-card hover:bg-muted/40",
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">{p.label}</span>
                        <span className="block text-[9px] text-muted-foreground">
                          {granted ? "Granted" : inherited ? "From role" : "Hidden"}
                        </span>
                      </span>
                      {isAdminRole ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Checkbox
                          checked={granted}
                          onCheckedChange={() => togglePage(p.key)}
                          className="h-4 w-4"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Default landing page */}
            <div className="space-y-1">
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Default landing page
              </Label>
              <select
                value={landingPage}
                onChange={(e) => setLandingPage(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Auto (based on role)</option>
                {ALL_PAGES.filter((p) => isAdminRole || effectivePages.includes(p.key)).map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground">
                Page that opens right after this user signs in.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border/40 bg-background px-4 py-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="flex-[2]">{busy ? "Saving…" : "Save changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  user, onClose, onDone,
}: { user: ManagedUser; onClose: () => void; onDone: () => void }) {
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 1) { toast.error("Password is required"); return; }
    setBusy(true);
    try {
      await resetManagedUserPassword({ data: { user_id: user.id, new_password: pwd } });
      toast.success("Password reset");
      onDone();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border/40">
          <DialogTitle className="text-base">Reset password</DialogTitle>
          <DialogDescription className="text-xs truncate">For {user.email}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="px-4 py-3">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">New password</Label>
            <div className="relative mt-1">
              <Input required type={showPassword ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} className="h-9 pe-10 font-mono" placeholder="1111" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute end-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border/40 bg-background/95 px-4 py-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="flex-[2]">{busy ? "Saving…" : "Reset password"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

