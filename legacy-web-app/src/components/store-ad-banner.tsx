import { useEffect, useRef, useState } from "react";

export type ShopAd = {
  id: string;
  title: string | null;
  image_url: string | null;
  placement: "home" | "success" | "both";
  link_type: "none" | "product" | "category" | "url";
  link_value: string | null;
  sort_order: number;
};

function handleBannerClick(
  ad: ShopAd,
  onAction?: (a: ShopAd) => void,
) {
  if (ad.link_type === "url" && ad.link_value) {
    window.open(ad.link_value, "_blank", "noopener,noreferrer");
    return;
  }
  if ((ad.link_type === "product" || ad.link_type === "category") && ad.link_value) {
    onAction?.(ad);
  }
}

/** Single banner card. */
export function StoreAdBanner({
  ad,
  onAction,
  className,
}: {
  ad: ShopAd;
  onAction?: (a: ShopAd) => void;
  className?: string;
}) {
  const clickable = ad.link_type !== "none" && !!ad.link_value;
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => handleBannerClick(ad, onAction)}
      className={
        "group relative block w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all active:scale-[0.99] disabled:cursor-default " +
        (className ?? "")
      }
    >
      {ad.image_url ? (
        <div className="aspect-[16/8] w-full overflow-hidden bg-muted">
          <img
            src={ad.image_url}
            alt={ad.title ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/8] items-center justify-center bg-muted text-xs text-muted-foreground">
          No image
        </div>
      )}
      {ad.title && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-start">
          <p className="text-sm font-semibold text-white">{ad.title}</p>
        </div>
      )}
    </button>
  );
}

/** Horizontal swipeable carousel for the home page. */
export function StoreAdCarousel({
  ads,
  onAction,
  className,
}: {
  ads: ShopAd[];
  onAction?: (a: ShopAd) => void;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(() => setI((x) => (x + 1) % ads.length), 5000);
    return () => clearInterval(id);
  }, [ads.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    // Horizontal-only scroll — do NOT use scrollIntoView (it scrolls the page vertically
    // if the carousel is partially off-screen, causing the page to jump back to top).
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }, [i]);

  if (!ads.length) return null;
  return (
    <div className={className}>
      <div
        ref={trackRef}
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
        style={{ scrollbarWidth: "none" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const w = el.clientWidth;
          const idx = Math.round(el.scrollLeft / Math.max(1, w));
          if (idx !== i) setI(idx);
        }}
      >
        {ads.map((a) => (
          <div key={a.id} className="w-full flex-shrink-0 snap-start">
            <StoreAdBanner ad={a} onAction={onAction} />
          </div>
        ))}
      </div>
      {ads.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {ads.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Banner ${idx + 1}`}
              onClick={() => setI(idx)}
              className={
                "h-1.5 rounded-full transition-all " +
                (idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Simple vertical stack for the order success page. */
export function StoreAdStack({
  ads,
  onAction,
  className,
}: {
  ads: ShopAd[];
  onAction?: (a: ShopAd) => void;
  className?: string;
}) {
  if (!ads.length) return null;
  return (
    <div className={"space-y-3 " + (className ?? "")}>
      {ads.map((a) => (
        <StoreAdBanner key={a.id} ad={a} onAction={onAction} />
      ))}
    </div>
  );
}
