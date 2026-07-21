import { createContext, useContext, useEffect, useMemo } from "react";
import {
  THEMES,
  DEFAULT_THEME_ID,
  DEFAULT_OPTIONS,
  RADIUS_MAP,
  getTheme,
  type ThemeDef,
  type ThemeOptions,
} from "@/lib/themes";

type Theme = "light" | "dark";

type Ctx = {
  // Legacy API (kept for backward compat with existing code)
  theme: Theme;
  toggle: () => void;
  // New API
  themeId: string;
  setThemeId: (id: string) => void;
  themes: ThemeDef[];
  options: ThemeOptions;
  setOptions: (next: Partial<ThemeOptions>) => void;
  resetOptions: () => void;
};

const ThemeCtx = createContext<Ctx>({
  theme: "dark",
  toggle: () => {},
  themeId: DEFAULT_THEME_ID,
  setThemeId: () => {},
  themes: THEMES,
  options: DEFAULT_OPTIONS,
  setOptions: () => {},
  resetOptions: () => {},
});

const STORAGE_THEME = "theme-id-v1";
const STORAGE_OPTIONS = "theme-options-v1";
const STORAGE_LEGACY = "theme"; // legacy light/dark key

function applyTheme(themeId: string, options: ThemeOptions) {
  if (typeof document === "undefined") return;
  const def = getTheme(themeId);
  const root = document.documentElement;

  // mode class for any code/styles relying on .dark
  root.classList.toggle("dark", def.mode === "dark");

  // Apply CSS variable overrides
  for (const [k, v] of Object.entries(def.vars)) {
    root.style.setProperty(k, v);
  }

  // Apply option-derived variables
  root.style.setProperty("--radius", RADIUS_MAP[options.rounded]);

  // Compact mode shrinks base spacing/typography slightly
  root.classList.toggle("ui-compact", options.compact);
  root.classList.toggle("ui-no-glass", !options.glass);
  root.classList.remove("motion-off", "motion-subtle", "motion-full");
  root.classList.add(`motion-${options.motion}`);

  // Smooth color transition
  root.style.setProperty("transition", "background-color 250ms ease, color 250ms ease");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme is permanently locked to the Soft White light theme.
  // No persistence, no toggle, no user customization.
  const themeId = DEFAULT_THEME_ID;
  const options = DEFAULT_OPTIONS;

  useEffect(() => {
    applyTheme(themeId, options);
    // Clear any legacy stored preferences so old dark themes don't linger.
    try {
      localStorage.removeItem(STORAGE_THEME);
      localStorage.removeItem(STORAGE_OPTIONS);
      localStorage.removeItem(STORAGE_LEGACY);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => ({
    theme: "light",
    toggle: () => {},
    themeId,
    setThemeId: () => {},
    themes: THEMES,
    options,
    setOptions: () => {},
    resetOptions: () => {},
  }), []);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
