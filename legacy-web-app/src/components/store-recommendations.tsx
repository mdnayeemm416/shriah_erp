import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreI18n, pickName } from "@/lib/store-i18n";

type RecProduct = {
  id: string;
  name: string;
  name_bn: string | null;
  name_ar: string | null;
  image_url: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  is_featured: boolean;
  min_stock: number;
};

export function StoreRecommendations({
  excludeIds,
  preferCategoryIds,
  onAdd,
}: {
  excludeIds: string[];
  preferCategoryIds: string[];
  onAdd: (p: { id: string; name: string; price: number; image_url: string | null }) => void;
}) {
  const { lang } = useStoreI18n();

  const q = useQuery({
    queryKey: ["store-recommendations"],
    staleTime: 60_000,
    queryFn: async (): Promise<RecProduct[]> => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("id,name,name_bn,name_ar,image_url,price,stock,category_id,is_featured,min_stock")
        .eq("is_visible", true)
        .eq("is_deleted", false)
        .gt("stock", 0)
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .limit(40);
      if (error) throw error;
      return (data ?? []) as RecProduct[];
    },
  });

  const exclude = new Set(excludeIds);
  const list = (q.data ?? []).filter((p) => !exclude.has(p.id));

  // Smart ranking: same category > featured > low stock clearance > rest
  const ranked = [...list].sort((a, b) => {
    const score = (p: RecProduct) => {
      let s = 0;
      if (preferCategoryIds.length && p.category_id && preferCategoryIds.includes(p.category_id)) s += 100;
      if (p.is_featured) s += 50;
      if (p.min_stock > 0 && p.stock <= p.min_stock) s += 20; // clearance
      return s;
    };
    return score(b) - score(a);
  });
  const top = ranked.slice(0, 6);

  if (q.isLoading) {
    return (
      <div className="px-1">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold">You may also like</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-36 flex-shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!top.length) return null;

  return (
    <div className="px-1">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">You may also like</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Recommended
        </span>
      </div>
      <div
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {top.map((p) => {
          const name = pickName(lang, p);
          const isClearance = p.min_stock > 0 && p.stock <= p.min_stock;
          return (
            <div
              key={p.id}
              className="group relative flex w-36 flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
                {isClearance && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
                    Clearance
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-2">
                <p className="line-clamp-2 text-[12px] font-medium leading-snug">{name}</p>
                <p className="text-[13px] font-bold text-primary">SAR {Number(p.price).toFixed(2)}</p>
                <Button
                  size="sm"
                  className="mt-1 h-8 w-full text-[11px]"
                  onClick={() =>
                    onAdd({ id: p.id, name, price: Number(p.price), image_url: p.image_url })
                  }
                >
                  <Plus className="me-1 h-3 w-3" /> Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
