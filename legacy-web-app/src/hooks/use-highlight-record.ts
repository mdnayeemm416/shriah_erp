// Reads ?highlight=<id> from the URL, waits for the matching DOM node to
// appear (data is often still loading on first paint), then smooth-scrolls
// it into the middle of the viewport and applies a temporary highlight
// animation. Uses a MutationObserver so heavy lists / async filters that
// finish rendering well after mount are still caught.
import { useEffect } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";

const MAX_WAIT_MS = 15_000;
const HIGHLIGHT_MS = 4_000;

export function useHighlightRecord(deps: ReadonlyArray<unknown> = []) {
  const search = useSearch({ strict: false }) as { highlight?: string };
  const router = useRouter();
  const target = search?.highlight ?? null;

  useEffect(() => {
    if (!target) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    let observer: MutationObserver | null = null;
    let timeoutId: number | null = null;

    const selector = `[data-record-id="${CSS.escape(target)}"]`;

    const settle = (el: HTMLElement) => {
      if (cancelled) return;
      cancelled = true;
      observer?.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);

      // Wait one frame so any layout shift from data load finishes first.
      requestAnimationFrame(() => {
        try {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch {
          el.scrollIntoView();
        }
        el.classList.add("magic-highlight");
        window.setTimeout(() => {
          el.classList.remove("magic-highlight");
          // Clear ?highlight only after the animation completes, so we don't
          // re-trigger a list refetch (which could scroll the page back up)
          // while the user is still seeing the result.
          try {
            router.navigate({
              to: ".",
              search: (prev: any) => {
                const { highlight: _h, date: _d, shop: _s, ...rest } = prev ?? {};
                return rest;
              },
              replace: true,
            });
          } catch { /* no-op */ }
        }, HIGHLIGHT_MS);
      });
    };

    const tryFind = () => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) settle(el);
      return !!el;
    };

    if (tryFind()) return;

    observer = new MutationObserver(() => { tryFind(); });
    observer.observe(document.body, { childList: true, subtree: true });

    timeoutId = window.setTimeout(() => {
      cancelled = true;
      observer?.disconnect();
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);
}
