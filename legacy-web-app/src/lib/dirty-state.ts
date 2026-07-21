// Tiny pub/sub for "data is outdated, refresh on demand" UX.
// Mutations call markDirty('analytics'); cards subscribe via useIsDirty.
// No automatic refetch — consumers decide when (usually on tap).

import { useEffect, useState } from "react";

export type DirtyDomain =
  | "purchases"
  | "cash"
  | "custody"
  | "shops"
  | "warehouse"
  | "employees"
  | "analytics";

type Listener = () => void;
const listeners = new Map<DirtyDomain, Set<Listener>>();
const dirty = new Map<DirtyDomain, number>(); // version counter per domain

function emit(d: DirtyDomain) {
  listeners.get(d)?.forEach((l) => l());
}

export function markDirty(...domains: DirtyDomain[]) {
  for (const d of domains) {
    dirty.set(d, (dirty.get(d) ?? 0) + 1);
    emit(d);
  }
}

export function clearDirty(...domains: DirtyDomain[]) {
  for (const d of domains) {
    if (dirty.has(d)) {
      dirty.delete(d);
      emit(d);
    }
  }
}

export function useIsDirty(domain: DirtyDomain): boolean {
  const [v, setV] = useState(() => dirty.get(domain) ?? 0);
  useEffect(() => {
    const set = listeners.get(domain) ?? new Set<Listener>();
    const fn = () => setV(dirty.get(domain) ?? 0);
    set.add(fn);
    listeners.set(domain, set);
    return () => { set.delete(fn); };
  }, [domain]);
  return v > 0;
}
