import { c as createServerRpc } from "./createServerRpc-DpbYpY9o.mjs";
import { c as createServerFn } from "./server-CQ33fA4m.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Cokoym5w.mjs";
import { s as supabaseAdmin } from "./client.server-BKaVHv6C.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, a as arrayType, s as stringType, l as literalType, b as booleanType } from "../_libs/zod.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";




import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const ROLE = enumType(["super_admin", "admin", "manager", "accountant", "cashier", "purchaser", "verifier", "deliveryman", "sales_delivery", "staff", "viewer"]);
function makeInternalAuthPassword() {
  return `Erp-${crypto.randomUUID()}-Session!9`;
}
async function getCallerRoles(context) {
  const {
    data,
    error
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => String(r.role));
}
async function isTargetSuperAdmin(userId) {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "super_admin").maybeSingle();
  return !!data;
}
async function assertAdmin(context) {
  const roles = await getCallerRoles(context);
  if (!roles.includes("admin") && !roles.includes("super_admin")) {
    throw new Error("Admins only");
  }
}
async function assertSuperAdmin(context) {
  const roles = await getCallerRoles(context);
  if (!roles.includes("super_admin")) {
    throw new Error("Super Admin only");
  }
}
async function assertCanManage(context, targetUserId) {
  await assertAdmin(context);
  if (await isTargetSuperAdmin(targetUserId)) {
    const callerRoles = await getCallerRoles(context);
    if (!callerRoles.includes("super_admin")) {
      throw new Error("Only a Super Admin can modify a Super Admin account");
    }
  }
}
const listManagedUsers_createServerFn_handler = createServerRpc({
  id: "2923c6bfe4ee4a4c42cf27179544627629a97b4ba688a5ff8cd5a8b16649468d",
  name: "listManagedUsers",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => listManagedUsers.__executeServer(opts));
const listManagedUsers = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(listManagedUsers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context);
  const {
    data: authList,
    error: authErr
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });
  if (authErr) throw new Error(authErr.message);
  const {
    data: profiles = []
  } = await supabaseAdmin.from("profiles").select("*");
  const {
    data: roles = []
  } = await supabaseAdmin.from("user_roles").select("*");
  const {
    data: access = []
  } = await supabaseAdmin.from("user_shop_access").select("*");
  const {
    data: pageGrants = []
  } = await supabaseAdmin.from("user_page_access").select("user_id,page_key");
  return {
    users: (authList.users ?? []).map((u) => {
      const p = (profiles ?? []).find((x) => x.id === u.id);
      const userRoles = (roles ?? []).filter((x) => x.user_id === u.id).map((x) => x.role);
      const primaryRole = userRoles[0] ?? "staff";
      const shopIds = (access ?? []).filter((x) => x.user_id === u.id).map((x) => x.shop_id);
      const pageKeys = (pageGrants ?? []).filter((x) => x.user_id === u.id).map((x) => x.page_key);
      return {
        id: u.id,
        email: u.email ?? p?.email ?? "",
        full_name: p?.full_name ?? "",
        role: primaryRole,
        roles: userRoles.length ? userRoles : [primaryRole],
        is_disabled: !!p?.is_disabled || !!u.banned_until,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        shop_ids: shopIds,
        page_keys: pageKeys,
        landing_page: p?.landing_page ?? null
      };
    })
  };
});
const createManagedUser_createServerFn_handler = createServerRpc({
  id: "86f2b33668784a5fa4206e065b7ed1d5b206632742a97de1a331f366e77fec51",
  name: "createManagedUser",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => createManagedUser.__executeServer(opts));
const createManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  email: stringType().trim().email().max(255).optional().or(literalType("")),
  username: stringType().trim().min(2).max(60).regex(/^[a-zA-Z0-9._-]+$/).optional().or(literalType("")),
  mobile: stringType().trim().min(4).max(32).optional().or(literalType("")),
  password: stringType().min(1).max(128),
  full_name: stringType().trim().min(1).max(120),
  role: ROLE.optional(),
  roles: arrayType(ROLE).min(1).max(4).optional(),
  shop_ids: arrayType(stringType().uuid()).max(50).default([])
}).refine((d) => !!(d.email || d.username || d.mobile), {
  message: "Provide at least one of email, username, or mobile"
}).parse(input)).handler(createManagedUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context);
  const rolesPicked = data.roles && data.roles.length ? data.roles : [data.role ?? "staff"];
  if (rolesPicked.includes("super_admin")) {
    await assertSuperAdmin(context);
  }
  const username = (data.username || "").trim() || null;
  const mobile = (data.mobile || "").trim() || null;
  const realEmail = (data.email || "").trim().toLowerCase() || null;
  const rolesToInsert = data.roles && data.roles.length ? data.roles : [data.role ?? "staff"];
  if (!data.shop_ids || data.shop_ids.length === 0) {
    throw new Error("Assign at least one shop before creating a user.");
  }
  const handle = (username || (mobile ? mobile.replace(/\D/g, "") : null))?.toLowerCase() ?? null;
  const authEmail = realEmail || (handle ? `${handle}@users.local` : null);
  if (!authEmail) throw new Error("Could not derive an email for the account");
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: authEmail,
    password: makeInternalAuthPassword(),
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name,
      username,
      mobile
    }
  });
  if (error) throw new Error(error.message);
  const newId = created.user.id;
  await supabaseAdmin.from("profiles").upsert({
    id: newId,
    email: authEmail,
    full_name: data.full_name,
    username,
    mobile,
    is_disabled: false
  });
  await supabaseAdmin.rpc("set_erp_user_password", {
    _user_id: newId,
    _password: data.password
  });
  await supabaseAdmin.from("user_roles").delete().eq("user_id", newId);
  await supabaseAdmin.from("user_roles").insert(Array.from(new Set(rolesToInsert)).map((role) => ({
    user_id: newId,
    role
  })));
  if (data.shop_ids.length) {
    await supabaseAdmin.from("user_shop_access").insert(data.shop_ids.map((shop_id) => ({
      user_id: newId,
      shop_id
    })));
  }
  return {
    id: newId
  };
});
const updateManagedUser_createServerFn_handler = createServerRpc({
  id: "466f52ae3ae5a562e460e6a1e5660a6e9322a7d2bbcb8dfca482364d895e2736",
  name: "updateManagedUser",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => updateManagedUser.__executeServer(opts));
const updateManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  full_name: stringType().trim().min(1).max(120).optional(),
  role: ROLE.optional(),
  roles: arrayType(ROLE).min(1).max(4).optional(),
  shop_ids: arrayType(stringType().uuid()).max(50).optional(),
  page_keys: arrayType(stringType().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40).optional(),
  landing_page: stringType().min(1).max(64).regex(/^[a-z0-9-]+$/).nullable().optional()
}).parse(input)).handler(updateManagedUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertCanManage(context, data.user_id);
  if (data.roles?.includes("super_admin") || data.role === "super_admin") {
    await assertSuperAdmin(context);
  }
  if ((data.roles || data.role) && await isTargetSuperAdmin(data.user_id)) {
    const callerRoles = await getCallerRoles(context);
    const next = data.roles && data.roles.length ? data.roles : data.role ? [data.role] : [];
    if (!callerRoles.includes("super_admin") && !next.includes("super_admin")) {
      throw new Error("Only a Super Admin can change a Super Admin's roles");
    }
  }
  if (data.full_name !== void 0) {
    await supabaseAdmin.from("profiles").update({
      full_name: data.full_name
    }).eq("id", data.user_id);
  }
  const rolesToInsert = data.roles && data.roles.length ? data.roles : data.role ? [data.role] : null;
  rolesToInsert ?? (await supabaseAdmin.from("user_roles").select("role").eq("user_id", data.user_id)).data?.map((r) => r.role) ?? [];
  const effectiveShops = data.shop_ids ?? (await supabaseAdmin.from("user_shop_access").select("shop_id").eq("user_id", data.user_id)).data?.map((r) => r.shop_id) ?? [];
  if (effectiveShops.length === 0) {
    throw new Error("Assign at least one shop before saving this user.");
  }
  if (rolesToInsert) {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    await supabaseAdmin.from("user_roles").insert(Array.from(new Set(rolesToInsert)).map((role) => ({
      user_id: data.user_id,
      role
    })));
  }
  if (data.shop_ids) {
    await supabaseAdmin.from("user_shop_access").delete().eq("user_id", data.user_id);
    if (data.shop_ids.length) {
      await supabaseAdmin.from("user_shop_access").insert(data.shop_ids.map((shop_id) => ({
        user_id: data.user_id,
        shop_id
      })));
    }
  }
  if (data.page_keys) {
    await supabaseAdmin.from("user_page_access").delete().eq("user_id", data.user_id);
    if (data.page_keys.length) {
      await supabaseAdmin.from("user_page_access").insert(data.page_keys.map((page_key) => ({
        user_id: data.user_id,
        page_key
      })));
    }
  }
  if (data.landing_page !== void 0) {
    await supabaseAdmin.from("profiles").update({
      landing_page: data.landing_page
    }).eq("id", data.user_id);
  }
  return {
    ok: true
  };
});
const setManagedUserDisabled_createServerFn_handler = createServerRpc({
  id: "f5f10a45a6775ac9aadc54a74c16557eca5da5a0a515c56b09d0b0b2cf6648eb",
  name: "setManagedUserDisabled",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => setManagedUserDisabled.__executeServer(opts));
const setManagedUserDisabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  disabled: booleanType()
}).parse(input)).handler(setManagedUserDisabled_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertCanManage(context, data.user_id);
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
    ban_duration: data.disabled ? "876000h" : "none"
  });
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("profiles").update({
    is_disabled: data.disabled
  }).eq("id", data.user_id);
  return {
    ok: true
  };
});
const resetManagedUserPassword_createServerFn_handler = createServerRpc({
  id: "199a1dfcb832cba4276a57d1ba65c2798db766ee68beae045fa1b236e6966fa0",
  name: "resetManagedUserPassword",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => resetManagedUserPassword.__executeServer(opts));
const resetManagedUserPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  new_password: stringType().min(1).max(128)
}).parse(input)).handler(resetManagedUserPassword_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertCanManage(context, data.user_id);
  const internalPassword = makeInternalAuthPassword();
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
    password: internalPassword
  });
  if (error) throw new Error(error.message);
  await supabaseAdmin.rpc("set_erp_user_password", {
    _user_id: data.user_id,
    _password: data.new_password
  });
  return {
    ok: true
  };
});
const deleteManagedUser_createServerFn_handler = createServerRpc({
  id: "0312b81896911627caa331f27642b01c3f60a445abbeb99db77fdae44a25331e",
  name: "deleteManagedUser",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => deleteManagedUser.__executeServer(opts));
const deleteManagedUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid()
}).parse(input)).handler(deleteManagedUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertCanManage(context, data.user_id);
  if (data.user_id === context.userId) {
    throw new Error("You cannot delete your own account");
  }
  if (await isTargetSuperAdmin(data.user_id)) {
    await assertSuperAdmin(context);
  }
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const updateUserPageAccess_createServerFn_handler = createServerRpc({
  id: "acd09be1e16500c343548e01ee8271391acdb54c80c99aefefb211c4a49e831d",
  name: "updateUserPageAccess",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => updateUserPageAccess.__executeServer(opts));
const updateUserPageAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid(),
  page_keys: arrayType(stringType().min(1).max(64).regex(/^[a-z0-9-]+$/)).max(40)
}).parse(input)).handler(updateUserPageAccess_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context);
  await supabaseAdmin.from("user_page_access").delete().eq("user_id", data.user_id);
  if (data.page_keys.length) {
    await supabaseAdmin.from("user_page_access").insert(data.page_keys.map((page_key) => ({
      user_id: data.user_id,
      page_key
    })));
  }
  return {
    ok: true
  };
});
const listUserPageAccess_createServerFn_handler = createServerRpc({
  id: "8289e6ec78b8c6cef7637f9b05c922be18560a6cdc25bafe41446ed4625056ba",
  name: "listUserPageAccess",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => listUserPageAccess.__executeServer(opts));
const listUserPageAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  user_id: stringType().uuid()
}).parse(input)).handler(listUserPageAccess_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context);
  const {
    data: rows = []
  } = await supabaseAdmin.from("user_page_access").select("page_key").eq("user_id", data.user_id);
  return {
    page_keys: (rows ?? []).map((r) => r.page_key)
  };
});
const setAttachmentRequired_createServerFn_handler = createServerRpc({
  id: "ada96da53a57089459bc3c0ca2412497b43a7f81cf001cdc531af5057a36d9d2",
  name: "setAttachmentRequired",
  filename: "src/lib/user-management.functions.ts"
}, (opts) => setAttachmentRequired.__executeServer(opts));
const setAttachmentRequired = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  enabled: booleanType()
}).parse(input)).handler(setAttachmentRequired_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context);
  const {
    error
  } = await supabaseAdmin.from("app_settings").update({
    cf_require_attachment: data.enabled
  }).eq("id", 1);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createManagedUser_createServerFn_handler,
  deleteManagedUser_createServerFn_handler,
  listManagedUsers_createServerFn_handler,
  listUserPageAccess_createServerFn_handler,
  resetManagedUserPassword_createServerFn_handler,
  setAttachmentRequired_createServerFn_handler,
  setManagedUserDisabled_createServerFn_handler,
  updateManagedUser_createServerFn_handler,
  updateUserPageAccess_createServerFn_handler
};
