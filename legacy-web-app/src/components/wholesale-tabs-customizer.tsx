import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  LayoutGrid, ShoppingBag, Truck, Users, Wallet, ShoppingCart, Image as ImageIcon,
  Package, Tag, Bell, ClipboardList, FileSpreadsheet, BarChart3, Star, Pin, PinOff,
  ChevronUp, ChevronDown, RotateCcw, GripVertical, Store, Box, Boxes, Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabDef = { value: string; label: string; icon: any };

export type TabPref = {
  value: string;
  label?: string;
  hidden?: boolean;
  pinned?: boolean;
  iconKey?: string;
  order: number;
};

export type TabPrefs = {
  tabs: TabPref[];
  activeColor: string; // one of COLORS keys
};

const STORAGE_KEY = "wholesale.topTabs.v1";

export const ICON_LIBRARY: Record<string, any> = {
  LayoutGrid, ShoppingBag, Truck, Users, Wallet, ShoppingCart, Image: ImageIcon,
  Package, Tag, Bell, ClipboardList, FileSpreadsheet, BarChart3, Star, Store,
  Box, Boxes, Receipt,
};

export const COLORS: Record<string, { bg: string; text: string; label: string }> = {
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", label: "Emerald" },
  blue:    { bg: "bg-blue-500/15",    text: "text-blue-700 dark:text-blue-300",       label: "Blue" },
  violet:  { bg: "bg-violet-500/15",  text: "text-violet-700 dark:text-violet-300",   label: "Violet" },
  rose:    { bg: "bg-rose-500/15",    text: "text-rose-700 dark:text-rose-300",       label: "Rose" },
  amber:   { bg: "bg-amber-500/15",   text: "text-amber-700 dark:text-amber-300",     label: "Amber" },
  sky:     { bg: "bg-sky-500/15",     text: "text-sky-700 dark:text-sky-300",         label: "Sky" },
  slate:   { bg: "bg-slate-500/15",   text: "text-slate-700 dark:text-slate-200",     label: "Slate" },
};

const DEFAULT_PREFS: TabPrefs = { tabs: [], activeColor: "emerald" };

function loadPrefs(): TabPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw);
    if (!p || !Array.isArray(p.tabs)) return DEFAULT_PREFS;
    return { tabs: p.tabs, activeColor: p.activeColor ?? "emerald" };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(p: TabPrefs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  try { window.dispatchEvent(new CustomEvent("wholesale-tabs-prefs-changed")); } catch {}
}

export function useTabPrefs() {
  const [prefs, setPrefs] = useState<TabPrefs>(() => loadPrefs());
  useEffect(() => {
    const h = () => setPrefs(loadPrefs());
    window.addEventListener("wholesale-tabs-prefs-changed", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("wholesale-tabs-prefs-changed", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return prefs;
}

/** Merge stored prefs with the current tab definitions. */
export function applyTabPrefs(defs: TabDef[], prefs: TabPrefs): TabDef[] {
  const byVal = new Map(defs.map((d) => [d.value, d]));
  const seen = new Set<string>();
  const merged: (TabDef & { pinned: boolean; order: number })[] = [];
  prefs.tabs.forEach((p) => {
    const d = byVal.get(p.value);
    if (!d) return;
    if (p.hidden) { seen.add(p.value); return; }
    seen.add(p.value);
    merged.push({
      value: d.value,
      label: p.label?.trim() || d.label,
      icon: (p.iconKey && ICON_LIBRARY[p.iconKey]) || d.icon,
      pinned: !!p.pinned,
      order: p.order,
    });
  });
  // Append any newly introduced tabs not yet in prefs
  defs.forEach((d, i) => {
    if (seen.has(d.value)) return;
    merged.push({ ...d, pinned: false, order: 1000 + i });
  });
  merged.sort((a, b) => (Number(b.pinned) - Number(a.pinned)) || (a.order - b.order));
  return merged.map(({ pinned: _p, order: _o, ...rest }) => rest);
}

export function WholesaleTabsCustomizer({
  open, onOpenChange, allTabs,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  allTabs: TabDef[];
}) {
  const [prefs, setPrefs] = useState<TabPrefs>(() => loadPrefs());
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [iconPickerFor, setIconPickerFor] = useState<string | null>(null);

  useEffect(() => { if (open) setPrefs(loadPrefs()); }, [open]);

  // Build a working list combining prefs + defs
  const rows = useMemo(() => {
    const byVal = new Map(allTabs.map((d) => [d.value, d]));
    const byPrefVal = new Map(prefs.tabs.map((p) => [p.value, p]));
    const list: (TabPref & { def: TabDef })[] = [];
    // First: ordered by pref if present
    prefs.tabs.forEach((p) => {
      const d = byVal.get(p.value);
      if (d) list.push({ ...p, def: d });
    });
    // Then: any new tabs missing from prefs
    allTabs.forEach((d, i) => {
      if (byPrefVal.has(d.value)) return;
      list.push({ value: d.value, order: 1000 + i, def: d });
    });
    return list;
  }, [prefs, allTabs]);

  const update = (value: string, patch: Partial<TabPref>) => {
    setPrefs((prev) => {
      const existing = prev.tabs.find((t) => t.value === value);
      const nextTab: TabPref = existing
        ? { ...existing, ...patch }
        : { value, order: prev.tabs.length, ...patch };
      const others = prev.tabs.filter((t) => t.value !== value);
      const combined = existing
        ? prev.tabs.map((t) => (t.value === value ? nextTab : t))
        : [...others, nextTab];
      return { ...prev, tabs: combined };
    });
  };

  const reorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= rows.length) return;
    const current = rows.map((r, i) => ({ ...r, order: i }));
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved);
    setPrefs((prev) => ({
      ...prev,
      tabs: current.map((r, i) => ({
        value: r.value,
        label: r.label,
        hidden: r.hidden,
        pinned: r.pinned,
        iconKey: r.iconKey,
        order: i,
      })),
    }));
  };

  const save = () => {
    // Normalize orders based on current rows arrangement
    const normalized: TabPrefs = {
      ...prefs,
      tabs: rows.map((r, i) => ({
        value: r.value,
        label: r.label,
        hidden: r.hidden,
        pinned: r.pinned,
        iconKey: r.iconKey,
        order: i,
      })),
    };
    savePrefs(normalized);
    onOpenChange(false);
  };

  const reset = () => {
    savePrefs(DEFAULT_PREFS);
    setPrefs(DEFAULT_PREFS);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-base font-semibold">Customize Tabs</DialogTitle>
        </DialogHeader>

        {/* Active color */}
        <div className="border-b border-border/60 px-5 pb-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Tab Color</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COLORS).map(([key, c]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPrefs((p) => ({ ...p, activeColor: key }))}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-all",
                  c.bg, c.text,
                  prefs.activeColor === key ? "border-current ring-2 ring-current/30" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab list */}
        <div className="max-h-[55vh] overflow-y-auto px-3 py-3">
          <div className="space-y-1.5">
            {rows.map((r, idx) => {
              const Icon = (r.iconKey && ICON_LIBRARY[r.iconKey]) || r.def.icon;
              const isEditingIcon = iconPickerFor === r.value;
              return (
                <div
                  key={r.value}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { if (dragIdx !== null) reorder(dragIdx, idx); setDragIdx(null); }}
                  className={cn(
                    "group rounded-xl border border-border/60 bg-card p-2.5 transition-all",
                    r.hidden && "opacity-60",
                    dragIdx === idx && "ring-2 ring-primary/40",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="cursor-grab text-muted-foreground/60 active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setIconPickerFor(isEditingIcon ? null : r.value)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground hover:bg-muted/80"
                      title="Change icon"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                    <Input
                      value={r.label ?? r.def.label}
                      onChange={(e) => update(r.value, { label: e.target.value })}
                      placeholder={r.def.label}
                      className="h-8 flex-1 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => update(r.value, { pinned: !r.pinned })}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted",
                        r.pinned ? "text-amber-500" : "text-muted-foreground",
                      )}
                      title={r.pinned ? "Unpin" : "Pin"}
                    >
                      {r.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                    </button>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => reorder(idx, idx - 1)}
                        disabled={idx === 0}
                        className="flex h-4 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorder(idx, idx + 1)}
                        disabled={idx === rows.length - 1}
                        className="flex h-4 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                    <Switch
                      checked={!r.hidden}
                      onCheckedChange={(v) => update(r.value, { hidden: !v })}
                    />
                  </div>
                  {isEditingIcon && (
                    <div className="mt-2 grid grid-cols-9 gap-1 rounded-lg bg-muted/40 p-2">
                      {Object.entries(ICON_LIBRARY).map(([key, I]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => { update(r.value, { iconKey: key }); setIconPickerFor(null); }}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md hover:bg-background",
                            (r.iconKey ?? "") === key && "bg-background ring-1 ring-primary",
                          )}
                          title={key}
                        >
                          <I className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-2 border-t border-border/60 bg-muted/30 px-5 py-3">
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" /> Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={save}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
