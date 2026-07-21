import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { computeAllowedPages, isReadOnlyRole, type PageKey } from "@/lib/page-access";

export type UserAccess = {
  roles: string[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAccountant: boolean;
  isCashier: boolean;
  isPurchaser: boolean;
  isVerifier: boolean;
  isDeliveryman: boolean;
  isSalesDelivery: boolean;
  isViewer: boolean;
  isReadOnly: boolean;
  canVerify: boolean;
  canAddPurchase: boolean;
  canAddCashIn: boolean;
  canHandover: boolean;
  allowed: PageKey[];
  shopIds: string[];          // assigned shops (empty = no scoping list)
  hasAllShops: boolean;       // super_admin/admin/manager bypass shop filter
  canAccessShop: (shopId: string | null | undefined) => boolean;
  loading: boolean;
  hasPage: (key: PageKey) => boolean;
  primaryRoute: string;
};

export function useUserAccess(): UserAccess {
  const { user } = useAuth();

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      return (data ?? []).map((r: any) => String(r.role));
    },
  });

  const { data: grants = [], isLoading: grantsLoading } = useQuery({
    queryKey: ["my-page-grants", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_page_access").select("page_key").eq("user_id", user!.id);
      return (data ?? []).map((r: any) => String(r.page_key));
    },
  });

  const { data: shopIds = [], isLoading: shopsLoading } = useQuery({
    queryKey: ["my-shop-access", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("user_shop_access").select("shop_id").eq("user_id", user!.id);
      return (data ?? []).map((r: any) => String(r.shop_id));
    },
  });

  const { data: landingPage = null } = useQuery<string | null>({
    queryKey: ["my-landing-page", user?.id],
    enabled: !!user,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("profiles").select("landing_page").eq("id", user!.id).maybeSingle();
      return (data?.landing_page as string | null) ?? null;
    },
  });

  const allowed = computeAllowedPages(roles, grants);
  const isSuperAdmin = roles.includes("super_admin");
  // Treat super_admin as admin everywhere (existing has_role('admin') checks already apply
  // to anyone with the admin row, and super_admins also keep their admin row from the migration).
  const isAdmin = isSuperAdmin || roles.includes("admin");
  const isManager = roles.includes("manager");
  const isAccountant = roles.includes("accountant");
  const isCashier = roles.includes("cashier");
  const isPurchaser = roles.includes("purchaser");
  const isVerifier = roles.includes("verifier");
  const isDeliveryman = roles.includes("deliveryman");
  const isSalesDelivery = roles.includes("sales_delivery");
  const isViewer = roles.includes("viewer");
  const isReadOnly = isReadOnlyRole(roles);
  const canVerify = isAdmin || isManager || isAccountant || isVerifier;
  const canAddPurchase = isAdmin || isManager || isPurchaser;
  const canAddCashIn = isAdmin || isManager || isAccountant;
  const canHandover = isAdmin || isManager || isAccountant || isPurchaser;
  const hasAllShops = isAdmin || isManager;

  const canAccessShop = (sid: string | null | undefined) => {
    if (hasAllShops) return true;
    if (!sid) return true; // warehouse-level / unscoped
    return shopIds.includes(sid);
  };

  // Per-role home landing
  // Per-user explicit landing page (set by admin) wins over per-role default.
  const explicitLanding =
    landingPage && allowed.includes(landingPage as PageKey) ? `/${landingPage}` : null;

  const primaryRoute =
    explicitLanding ??
    (isCashier ? "/shop"
    : isDeliveryman ? "/store-admin"
    : (isPurchaser || isVerifier) ? "/finance-workflow"
    : isAdmin ? "/summary"
    : allowed.includes("summary") ? "/summary"
    : allowed.includes("finance-workflow") ? "/finance-workflow"
    : allowed[0] ? `/${allowed[0]}`
    : "/summary");

  return {
    roles,
    isSuperAdmin, isAdmin, isManager, isAccountant,
    isCashier, isPurchaser, isVerifier, isDeliveryman, isSalesDelivery, isViewer,
    isReadOnly,
    canVerify, canAddPurchase, canAddCashIn, canHandover,
    allowed,
    shopIds, hasAllShops, canAccessShop,
    loading: !user || rolesLoading || grantsLoading || shopsLoading,
    hasPage: (k) => isAdmin || allowed.includes(k),
    primaryRoute,
  };
}
