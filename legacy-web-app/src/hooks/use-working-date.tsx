import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "working_date_v1";

export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Ctx = {
  workingDate: string; // YYYY-MM-DD
  setWorkingDate: (d: string) => void;
  resetToToday: () => void;
  isToday: boolean;
  today: string;
};

const WorkingDateContext = createContext<Ctx | null>(null);

export function WorkingDateProvider({ children }: { children: React.ReactNode }) {
  const [workingDate, setWorkingDateState] = useState<string>(() => {
    if (typeof window === "undefined") return todayISO();
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    } catch { /* noop */ }
    return todayISO();
  });

  const [today, setToday] = useState<string>(() => todayISO());

  // Keep "today" fresh (for the badge), but DO NOT auto-change workingDate.
  useEffect(() => {
    const id = setInterval(() => {
      const t = todayISO();
      setToday((prev) => (prev !== t ? t : prev));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const setWorkingDate = useCallback((d: string) => {
    setWorkingDateState(d);
    try { localStorage.setItem(STORAGE_KEY, d); } catch { /* noop */ }
  }, []);

  const resetToToday = useCallback(() => setWorkingDate(todayISO()), [setWorkingDate]);

  const value = useMemo<Ctx>(() => ({
    workingDate,
    setWorkingDate,
    resetToToday,
    isToday: workingDate === today,
    today,
  }), [workingDate, setWorkingDate, resetToToday, today]);

  return <WorkingDateContext.Provider value={value}>{children}</WorkingDateContext.Provider>;
}

export function useWorkingDate(): Ctx {
  const ctx = useContext(WorkingDateContext);
  if (!ctx) {
    // Safe fallback so components don't crash if used outside the provider.
    const t = todayISO();
    return {
      workingDate: t,
      setWorkingDate: () => { /* noop */ },
      resetToToday: () => { /* noop */ },
      isToday: true,
      today: t,
    };
  }
  return ctx;
}
