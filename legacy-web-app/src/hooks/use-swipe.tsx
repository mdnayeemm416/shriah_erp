import { useRef } from "react";

export function useSwipe({
  onLeft,
  onRight,
  threshold = 70,
  maxOffAxis = 50,
}: {
  onLeft?: () => void;
  onRight?: () => void;
  threshold?: number;
  maxOffAxis?: number;
}) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = start.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = Math.abs(t.clientY - s.y);
    start.current = null;
    if (dy > maxOffAxis) return;
    if (Date.now() - s.t > 700) return;
    if (dx >= threshold) onRight?.();
    else if (dx <= -threshold) onLeft?.();
  };

  return { onTouchStart, onTouchEnd };
}
