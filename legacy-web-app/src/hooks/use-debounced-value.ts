import { useEffect, useState } from "react";

/**
 * Returns `value` debounced by `delay` ms. Use to throttle search inputs and
 * other rapidly-changing values that drive queries / filtering.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
