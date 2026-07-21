import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { searchProductImages, saveRemoteProductImage } from "@/lib/find-product-image.functions";

type Suggestion = { thumbnail: string; image: string; title: string; source: string; width?: number; height?: number };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name?: string | null;
  barcode?: string | null;
  brand?: string | null;
  itemCode?: string | null;
  onPicked: (url: string) => void;
};

export function FindProductImageDialog({ open, onOpenChange, name, barcode, brand, itemCode, onPicked }: Props) {
  const search = useServerFn(searchProductImages);
  const save = useServerFn(saveRemoteProductImage);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState<string | null>(null);

  const runSearch = async (q?: string) => {
    setLoading(true);
    setItems([]);
    try {
      const res: any = await search({
        data: {
          query: q?.trim() || undefined,
          name: name ?? undefined,
          barcode: barcode ?? undefined,
          brand: brand ?? undefined,
          itemCode: itemCode ?? undefined,
          limit: 6,
        },
      });
      setItems(res?.suggestions ?? []);
      if (!res?.suggestions?.length) toast.message("No images found. Try a different keyword.");
    } catch (e: any) {
      toast.error(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      const seed = [brand, name].filter(Boolean).join(" ").trim() || barcode || itemCode || "";
      setQuery(seed);
      // Auto-fire first search using available hints
      runSearch();
    } else {
      setItems([]);
      setPicking(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePick = async (s: Suggestion) => {
    setPicking(s.image);
    try {
      const res: any = await save({ data: { url: s.image } });
      onPicked(res.url);
      toast.success("Image attached");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not save image");
    } finally {
      setPicking(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] max-w-md overflow-y-auto p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Find product image
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, barcode or brand"
            autoFocus={false}
            onKeyDown={(e) => { if (e.key === "Enter") runSearch(query); }}
          />
          <Button size="sm" variant="outline" onClick={() => runSearch(query)} disabled={loading} className="gap-1.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-2 pt-3">
            {[0,1,2,3].map(i => <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />)}
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-3">
            {items.map((s) => (
              <button
                key={s.image}
                type="button"
                onClick={() => handlePick(s)}
                disabled={!!picking}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30 transition-all active:scale-[0.97] hover:border-primary disabled:opacity-60"
              >
                <img src={s.thumbnail} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                {picking === s.image && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent p-1 text-[10px] text-white">
                  {s.source.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 pt-6 pb-2 text-center text-muted-foreground">
            <X className="h-6 w-6 opacity-50" />
            <p className="text-xs">Type a keyword and tap search.</p>
          </div>
        )}

        <p className="pt-2 text-[10px] text-muted-foreground">
          Tap an image to attach it. Image is cached on your shop storage.
        </p>
      </DialogContent>
    </Dialog>
  );
}
