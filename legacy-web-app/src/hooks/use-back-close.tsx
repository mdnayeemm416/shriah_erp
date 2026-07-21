import { useEffect, useRef } from "react";

/**
 * Integrates an overlay (dialog / sheet / drawer / fullscreen viewer) with the
 * browser history stack so that the hardware / browser Back button closes the
 * topmost overlay before navigating away from the page.
 *
 * Behavior:
 *  - When `open` becomes true, a sentinel entry is pushed onto window.history.
 *  - Pressing Back fires popstate → we pop the topmost overlay and call its
 *    onOpenChange(false). The page itself is NOT navigated.
 *  - When the overlay is closed programmatically (X button, outside click,
 *    Escape, action button), we transparently rewind the sentinel entry so the
 *    history stack stays clean.
 *  - Nested overlays work: each push adds its own entry, Back unwinds them in
 *    LIFO order, only then leaves the page.
 *
 * Safe to call with `open` undefined (no-op) for uncontrolled primitives.
 */

type Entry = { id: number; close: () => void; fromPop: boolean };

const stack: Entry[] = [];
let initialized = false;
let suppressNextPop = false;

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  window.addEventListener("popstate", () => {
    if (suppressNextPop) {
      suppressNextPop = false;
      return;
    }
    const top = stack.pop();
    if (top) {
      top.fromPop = true;
      try {
        top.close();
      } catch {
        /* ignore */
      }
    }
  });
}

let nextId = 1;

export function useBackClose(open?: boolean, onOpenChange?: (o: boolean) => void) {
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !onOpenChange || typeof window === "undefined") return;
    ensureInit();

    const entry: Entry = {
      id: nextId++,
      fromPop: false,
      close: () => onOpenChangeRef.current?.(false),
    };
    stack.push(entry);

    try {
      window.history.pushState({ __overlayId: entry.id }, "");
    } catch {
      /* ignore */
    }

    return () => {
      const idx = stack.indexOf(entry);
      if (idx >= 0) stack.splice(idx, 1);

      // Programmatic close: rewind the sentinel we pushed so the history
      // stack doesn't accumulate phantom entries. Defer to a microtask so
      // any in-flight router navigation (e.g. clicking a <Link> inside the
      // overlay) lands first — otherwise history.back() would undo it.
      if (!entry.fromPop) {
        const id = entry.id;
        setTimeout(() => {
          const state = window.history.state as { __overlayId?: number } | null;
          if (state && state.__overlayId === id) {
            try {
              suppressNextPop = true;
              window.history.back();
            } catch {
              suppressNextPop = false;
              /* ignore */
            }
          }
        }, 0);
      }
    };
  }, [open]);
}
