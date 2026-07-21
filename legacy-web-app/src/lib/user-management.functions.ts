import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ROLE = z.enum([
  "super_admin", "admin", "manager", "accountant",
  "cashier", "purchaser", "verifier", "deliveryman",
  "sales_delivery",
  "staff", "viewer",
]);

function makeInternalAuthPassword() {
  return `Erp-${crypto.randomUUID()}-Session!9`;
}

async function getCallerRoles(context: any): Promise<string[]> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => String(r.role));
}

async function isTargetSuperAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .maybeSingle();
  return !!data;
}

/** Allow Admins and Super Admins. */
async function assertAdmin(context: any) {
  const roles = await getCallerRoles(context);
  if (!roles.includes("admin") && !roles.includes("super_admin")) {
    throw new Error("Admins only");
  }
}

/** Super Admin only. Used for actions touching Super Admin accounts. */
async function assertSuperAdmin(context: any) {
  const roles = await getCallerRoles(context);
  if (!roles.includes("super_admin")) {
    throw new Error("Super Admin only");
  }
}

/**
 * Guard for edits that affect another account. Super Admin accounts can only
 * be modified by another Super Admin. Plain Admins manage everyone else.
 */
async function assertCanManage(context: any, targetUserId: string) {
  await assertAdmin(context);
  if (await isTargetSuperAdmin(targetUserId)) {
    const callerRoles = await getCallerRoles(context);
    if (!callerRoles.includes("super_admin")) {
      throw new Error("Only a Super Admin can modify a Super Admin account");
    }
  }
}

export const listManagedUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data: authList, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (authErr) throw new Error(authErr.message);

    const { data: profiles = [] } = await supabaseAdmin.from("profiles").select("*");
    const { data: roles = [] } = await supabaseAdmin.from("user_roles").select("*");
    const { data: access = [] } = await supabaseAdmin.from("user_shop_access").select("*");
    const { data: pageGrants = [] } = await (supabaseAdmin as any).from("user_page_access").select("user_id,page_key");

    return {
      users: (authList.users ?? []).map((u) => {
        const p: any = (profiles ?? []).find((x: any) => x.id === u.id);
        const userRoles = (roles ?? []).filter((x: any) => x.user_id === u.id).map((x: any) => x.role as string);
        const primaryRole = userRoles[0] ?? "staff";
        const shopIds = (access ?? []).filter((x: any) => x.user_id === u.id).map((x: any) => x.shop_id);
        const pageKeys = (pageGrants ?? []).filter((x: any) => x.user_id === u.id).map((x: any) => x.page_key as string);
        return {
          id: u.id,
          email: u.email ?? p?.email ?? "",
          full_name: p?.full_name ?? "",
          role: primaryRole,
          roles: userRoles.length ? userRoles : [primaryRole],
          is_disabled: !!p?.is_disabled || !!(u as any).banned_until,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          shop_ids: shopIds,
          page_keys: pageKeys,
          landing_page: (p?.landing_page as string | null) ?? null,
        };
      }),
    };
  });

export const createManagedUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      email: z.string().trim().email().max(255).optional().or(z.literal("")),
      username: z.string().trim().min(2).max(60).regex(/^[a-zA-Z0-9._-]+$/).optional().or(z.literal("")),
      mobile: z.string().trim().min(4).max(32).optional().or(z.literal("")),
      password: z.string().min(1).max(128),
      full_name: z.string().trim().min(1).max(120),
      role: ROLE.optional(),
      roles: z.array(ROLE).min(1).max(4).optional(),
      shop_ids: z.array(z.string().uuid()).max(50).default([]),
    }).refine(
      (d) => !!(d.email || d.username || d.mobile),
      { message: "Provide at least one of email, username, or mobile" },
    ).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Only Super Admins can create another Super Admin.
    const rolesPicked = (data.roles && data.roles.length ? data.roles : [data.role ?? "staff"]);
    if (rolesPicked.includes("super_admin")) {
      await assertSuperAdmin(context);
    }


    const username = (data.username || "").trim() || null;
    const mobile = (data.mobile || "").trim() || null;
    const realEmail = (data.email || "").trim().toLowerCase() || null;

    const rolesToInsert = (data.roles && data.roles.length ? data.roles : [data.role ?? "staff"]);
    if (!data.shop_ids || data.shop_ids.length === 0) {
      throw new Error("Assign at least one shop before creating a user.");
    }

    // Supabase auth requires an email; synthesize a stable internal one when
    // the admin only provided username/mobile. The user logs in via the
    // find_login_email() RPC, so they never have to type the synthesized address.
    // Lowercased to match Supabase's auth.users normalization.
    const handle = (username || (mobile ? mobile.replace(/\D/g, "") : null))?.toLowerCase() ?? null;
    const authEmail = realEmail || (handle ? `${handle}@users.local` : null);
    if (!authEmail) throw new Error("Could not derive an email for the account");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password: makeInternalAuthPassword(),
      email_confirm: true,
      user_metadata: { full_name: data.full_name, username, mobile },
    });
    if (error) throw new Error(error.message);
    const newId = created.user!.id;

    await supabaseAdmin.from("profiles").upsert({
      id: newId,
      email: authEmail,
      full_name: data.full_name,
      username,
      mobile,
      is_disabled: false,
    });

    await (supabaseAdmin as any).rpc("set_erp_user_password", { _user_id: newId, _password: data.password });

    await supabaseAdmin.from("user_roles").delete().eq("user_id", newId);
    await supabaseAdmin.from("user_roles").insert(
      Array.from(new Set(rolesToInsert)).map((role) => ({ user_id: newId, role })),
    );

    if (data.shop_ids.length) {
      await supabaseAdmin
        .from("user_shop_access")
        .insert(data.shop_ids.map((shop_id) => ({ user_id: newId, shop_id })));
    }
    return { id: newId };
  });


export const updateManagedUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      user_id: z.string().uuid(),
      full_name: z.string().trim().min(1).max(120).optional(),
      role: ROLE.optional(),
      roles: z.array(ROLE).min(1).max(4).optional(),
      shop_ids: z.array(z.string().uuid()).max(50).optional(),
      page_keys: z.array(z.string().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40).optional(),
      landing_page: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/).nullable().optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertCanManage(context, data.user_id);
    // Only Super Admins can grant Super Admin role.
    if (data.roles?.includes("super_admin") || data.role === "super_admin") {
      await assertSuperAdmin(context);
    }
    // Prevent a non-super-admin from stripping super_admin off a super admin.
    if ((data.roles || data.role) && await isTargetSuperAdmin(data.user_id)) {
      const callerRoles = await getCallerRoles(context);
      const next = (data.roles && data.roles.length ? data.roles : data.role ? [data.role] : []);
      if (!callerRoles.includes("super_admin") && !next.includes("super_admin")) {
        throw new Error("Only a Super Admin can change a Super Admin's roles");
      }
    }


    if (data.full_name !== undefined) {
      await supabaseAdmin.from("profiles").update({ full_name: data.full_name }).eq("id", data.user_id);
    }
    const rolesToInsert = data.roles && data.roles.length
      ? data.roles
      : data.role ? [data.role] : null;

    // If roles are being set OR shop_ids being changed, enforce shop assignment
    // for non-admin roles. We must look up effective final roles + shops.
    const effectiveRoles = rolesToInsert ?? (
      await supabaseAdmin.from("user_roles").select("role").eq("user_id", data.user_id)
    ).data?.map((r: any) => r.role) ?? [];
    const effectiveShops = data.shop_ids ?? (
      await supabaseAdmin.from("user_shop_access").select("shop_id").eq("user_id", data.user_id)
    ).data?.map((r: any) => r.shop_id) ?? [];
    if (effectiveShops.length === 0) {
      throw new Error("Assign at least one shop before saving this user.");
    }

    if (rolesToInsert) {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
      await supabaseAdmin.from("user_roles").insert(
        Array.from(new Set(rolesToInsert)).map((role) => ({ user_id: data.user_id, role })),
      );
    }
    if (data.shop_ids) {
      await supabaseAdmin.from("user_shop_access").delete().eq("user_id", data.user_id);
      if (data.shop_ids.length) {
        await supabaseAdmin
          .from("user_shop_access")
          .insert(data.shop_ids.map((shop_id) => ({ user_id: data.user_id, shop_id })));
      }
    }
    if (data.page_keys) {
      await (supabaseAdmin as any).from("user_page_access").delete().eq("user_id", data.user_id);
      if (data.page_keys.length) {
        await (supabaseAdmin as any)
          .from("user_page_access")
          .insert(data.page_keys.map((page_key) => ({ user_id: data.user_id, page_key })));
      }
    }
    if (data.landing_page !== undefined) {
      await (supabaseAdmin as any).from("profiles").update({ landing_page: data.landing_page }).eq("id", data.user_id);
    }
    return { ok: true };
  });

export const setManagedUserDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      user_id: z.string().uuid(),
      disabled: z.boolean(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertCanManage(context, data.user_id);

    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration: data.disabled ? "876000h" : "none",
    } as any);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("profiles").update({ is_disabled: data.disabled }).eq("id", data.user_id);
    return { ok: true };
  });

export const resetManagedUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      user_id: z.string().uuid(),
      new_password: z.string().min(1).max(128),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertCanManage(context, data.user_id);
    const internalPassword = makeInternalAuthPassword();
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, { password: internalPassword });
    if (error) throw new Error(error.message);
    await (supabaseAdmin as any).rpc("set_erp_user_password", { _user_id: data.user_id, _password: data.new_password });
    return { ok: true };
  });

export const deleteManagedUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ user_id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertCanManage(context, data.user_id);
    if (data.user_id === context.userId) {
      throw new Error("You cannot delete your own account");
    }
    // Extra guard: a plain Admin cannot delete a Super Admin (already covered by assertCanManage but explicit).
    if (await isTargetSuperAdmin(data.user_id)) {
      await assertSuperAdmin(context);
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateUserPageAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      user_id: z.string().uuid(),
      page_keys: z.array(z.string().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    await supabaseAdmin.from("user_page_access").delete().eq("user_id", data.user_id);
    if (data.page_keys.length) {
      await supabaseAdmin
        .from("user_page_access")
        .insert(data.page_keys.map((page_key) => ({ user_id: data.user_id, page_key })));
    }
    return { ok: true };
  });

export const listUserPageAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows = [] } = await supabaseAdmin
      .from("user_page_access").select("page_key").eq("user_id", data.user_id);
    return { page_keys: (rows ?? []).map((r: any) => r.page_key as string) };
  });

export const setAttachmentRequired = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ enabled: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await supabaseAdmin
      .from("app_settings").update({ cf_require_attachment: data.enabled } as any).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
