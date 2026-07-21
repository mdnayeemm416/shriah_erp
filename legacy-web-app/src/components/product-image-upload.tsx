import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/image-upload";
import { FindProductImageDialog } from "@/components/find-product-image-dialog";

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  searchHints?: {
    name?: string | null;
    barcode?: string | null;
    brand?: string | null;
    itemCode?: string | null;
  };
};

export function ProductImageUpload({ value, onChange, searchHints }: Props) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [findOpen, setFindOpen] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please pick an image"); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("Image must be under 20 MB"); return; }
    setBusy(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const canSearch = !!(searchHints?.name || searchHints?.barcode || searchHints?.brand || searchHints?.itemCode);

  return (
    <div className="space-y-2">
      <div className="relative h-40 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
        {value ? (
          <img src={value} alt="Product" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImagePlus className="h-7 w-7" />
            <p className="text-xs">No image yet</p>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!value && canSearch && (
          <button
            type="button"
            onClick={() => setFindOpen(true)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-primary to-primary-glow px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" /> Find Image
          </button>
        )}
      </div>

      <input ref={galleryRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }} />

      <div className="grid grid-cols-3 gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy}
          onClick={() => cameraRef.current?.click()} className="gap-1.5">
          <Camera className="h-4 w-4" /> Camera
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy}
          onClick={() => galleryRef.current?.click()} className="gap-1.5">
          <Upload className="h-4 w-4" /> Gallery
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy || !canSearch}
          onClick={() => setFindOpen(true)} className="gap-1.5">
          <Sparkles className="h-4 w-4" /> Find
        </Button>
      </div>

      {value && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}
          className="w-full gap-1.5 text-rose-600 hover:text-rose-700">
          <Trash2 className="h-4 w-4" /> Remove image
        </Button>
      )}
      <p className="text-[10px] text-muted-foreground">
        Auto-compressed to 1280px JPEG. Use a clear, well-lit photo of the product.
      </p>

      <FindProductImageDialog
        open={findOpen}
        onOpenChange={setFindOpen}
        name={searchHints?.name}
        barcode={searchHints?.barcode}
        brand={searchHints?.brand}
        itemCode={searchHints?.itemCode}
        onPicked={(url) => onChange(url)}
      />
    </div>
  );
}
