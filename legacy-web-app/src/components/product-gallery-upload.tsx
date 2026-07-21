import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, Sparkles, Star, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/image-upload";
import { FindProductImageDialog } from "@/components/find-product-image-dialog";
import { cn } from "@/lib/utils";

type SearchHints = {
  name?: string | null;
  barcode?: string | null;
  brand?: string | null;
  itemCode?: string | null;
};

type Props = {
  /** Main image URL (DB column: image_url). */
  mainUrl: string | null | undefined;
  /** Gallery URLs (DB column: gallery_image_urls text[]). */
  gallery: string[];
  onMainChange: (url: string | null) => void;
  onGalleryChange: (urls: string[]) => void;
  searchHints?: SearchHints;
  /** Cap to keep things light. */
  maxImages?: number;
};

/**
 * Premium multi-image picker.
 * - Only URLs are persisted to the database.
 * - Files live in the external public storage bucket (CDN-served).
 * - Compressed to ~1280px JPEG before upload.
 */
export function ProductGalleryUpload({
  mainUrl,
  gallery,
  onMainChange,
  onGalleryChange,
  searchHints,
  maxImages = 6,
}: Props) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [findOpen, setFindOpen] = useState(false);

  const all: string[] = [mainUrl, ...gallery].filter(Boolean) as string[];
  const remaining = Math.max(0, maxImages - all.length);
  const canSearch = !!(searchHints?.name || searchHints?.barcode || searchHints?.brand || searchHints?.itemCode);

  const attachUrl = (url: string) => {
    if (!mainUrl) {
      onMainChange(url);
    } else if (gallery.length < maxImages - 1) {
      onGalleryChange([...gallery, url]);
    } else {
      toast.message(`Up to ${maxImages} images per product`);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, remaining || 1);
    if (!list.length) {
      toast.message(`Up to ${maxImages} images per product`);
      return;
    }
    setBusy(true);
    try {
      for (const file of list) {
        if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image`); continue; }
        if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name} > 20 MB`); continue; }
        const url = await uploadProductImage(file);
        attachUrl(url);
      }
      toast.success(list.length > 1 ? `${list.length} images added` : "Image added");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const setAsMain = (url: string) => {
    if (url === mainUrl) return;
    const nextGallery = gallery.filter((u) => u !== url);
    if (mainUrl) nextGallery.unshift(mainUrl);
    onMainChange(url);
    onGalleryChange(nextGallery.slice(0, maxImages - 1));
  };

  const removeImage = (url: string) => {
    if (url === mainUrl) {
      const [next, ...rest] = gallery;
      onMainChange(next ?? null);
      onGalleryChange(rest);
    } else {
      onGalleryChange(gallery.filter((u) => u !== url));
    }
  };

  return (
    <div className="space-y-2">
      {/* Main preview */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
        {mainUrl ? (
          <img src={mainUrl} alt="Main" loading="lazy" className="h-full w-full object-cover" />
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
        {!mainUrl && canSearch && (
          <button
            type="button"
            onClick={() => setFindOpen(true)}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-primary to-primary-glow px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" /> Find Image
          </button>
        )}
        {mainUrl && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Main
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {all.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {all.map((url) => {
            const isMain = url === mainUrl;
            return (
              <div
                key={url}
                className={cn(
                  "group relative h-16 w-16 overflow-hidden rounded-lg border bg-muted/40",
                  isMain ? "border-primary ring-2 ring-primary/30" : "border-border",
                )}
              >
                <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 hidden items-end justify-between gap-0.5 bg-gradient-to-t from-black/70 to-transparent p-1 group-hover:flex group-active:flex">
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => setAsMain(url)}
                      title="Set as main"
                      className="rounded-full bg-white/90 p-1 text-amber-600 active:scale-90"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    title="Remove"
                    className="ml-auto rounded-full bg-white/90 p-1 text-rose-600 active:scale-90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              disabled={busy}
              className="flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="text-[9px]">Add</span>
            </button>
          )}
        </div>
      )}

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />

      <div className="grid grid-cols-3 gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy || remaining === 0}
          onClick={() => cameraRef.current?.click()} className="gap-1.5">
          <Camera className="h-4 w-4" /> Camera
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy || remaining === 0}
          onClick={() => galleryRef.current?.click()} className="gap-1.5">
          <Upload className="h-4 w-4" /> Gallery
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={busy || !canSearch || remaining === 0}
          onClick={() => setFindOpen(true)} className="gap-1.5">
          <Sparkles className="h-4 w-4" /> Find
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {all.length}/{maxImages} images · stored as URLs (files live on the CDN, not the database).
        Tap a thumbnail to set as main or remove.
      </p>

      <FindProductImageDialog
        open={findOpen}
        onOpenChange={setFindOpen}
        name={searchHints?.name}
        barcode={searchHints?.barcode}
        brand={searchHints?.brand}
        itemCode={searchHints?.itemCode}
        onPicked={(url) => attachUrl(url)}
      />
    </div>
  );
}
