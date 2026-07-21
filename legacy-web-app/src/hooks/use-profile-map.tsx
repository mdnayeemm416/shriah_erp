import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProfileLite = {
  id: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
};

/** Cached profiles lookup. Returns a map keyed by user id. */
export function useProfileMap() {
  const { data = {} } = useQuery({
    queryKey: ["profile-map-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id,full_name,email,username");
      const map: Record<string, ProfileLite> = {};
      (data ?? []).forEach((p: any) => { map[p.id] = p; });
      return map;
    },
    staleTime: 5 * 60_000,
  });
  return data as Record<string, ProfileLite>;
}

export function displayProfile(p?: ProfileLite | null): string {
  if (!p) return "Unknown";
  return p.full_name || p.username || (p.email ? p.email.split("@")[0] : null) || p.id.slice(0, 6);
}
