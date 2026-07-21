import { useEffect, useRef, useState } from "react";
import { useStoreI18n } from "@/lib/store-i18n";
import { useSwipe } from "@/hooks/use-swipe";

export type Banner = {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string | null;
  title_bn: string | null;
  title_ar: string | null;
  message: string | null;
  message_bn: string | null;
  message_ar: string | null;
  description?: string | null;
  link_type?: "none" | "product" | "category" | "url" | null;
  link_value?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

function pick(lang: "en" | "bn" | "ar", b: Banner, key: "title" | "message") {
  if (lang === "bn") return (b as any)[`${key}_bn`] || (b as any)[key];
  if (lang === "ar") return (b as any)[`${key}_ar`] || (b as any)[key];
  return (b as any)[key];
}

export function StoreBannerCarousel({
  banners,
  onAction,
}: {
  banners: Banner[];
  onAction?: (b: Banner) => void;
}) {
  const { lang, t } = useStoreI18n();
  const [i, setI] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setI((x) => (x + 1) % banners.length);
    }, 4500);
    return () => clearInterval(id);
  }, [banners.length]);

  const swipe = useSwipe({
    onLeft: () => setI((x) => (x + 1) % banners.length),
    onRight: () => setI((x) => (x - 1 + banners.length) % banners.length),
  });

  if (!banners.length) return null;
  const b = banners[i] ?? banners[0];
  const title = pick(lang, b, "title");
  const message = pick(lang, b, "message") || b.description || null;

  const handleClick = () => {
    const lt = b.link_type;
    if (lt === "product" || lt === "category") {
      onAction?.(b);
      return;
    }
    if (lt === "url" && b.link_value) {
      window.open(b.link_value, "_blank", "noopener,noreferrer");
      return;
    }
    if (b.link_url) {
      window.open(b.link_url, "_blank", "noopener,noreferrer");
    }
  };

  const clickable = !!(b.link_url || (b.link_type && b.link_type !== "none" && b.link_value));

  return (
    <div
      className="mb-5"
      onTouchStart={(e) => { pausedRef.current = true; swipe.onTouchStart(e); }}
      onTouchEnd={(e) => { swipe.onTouchEnd(e); setTimeout(() => { pausedRef.current = false; }, 600); }}
    >
      <button
        type="button"
        disabled={!clickable}
        onClick={handleClick}
        className="block w-full text-start disabled:cursor-default"
      >
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-muted">
          <img
            src={b.image_url}
            alt={title ?? ""}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {(title || message) && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 text-white">
              {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
              {message && <p className="mt-0.5 line-clamp-2 text-[11px] opacity-90">{message}</p>}
              {clickable && (
                <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                  {t("store.shopNow")} →
                </span>
              )}
            </div>
          )}
        </div>
      </button>
      {banners.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Banner ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
