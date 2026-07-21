// Persisted chat history for AI Insights — localStorage-backed.
// Stores lightweight summaries only; full results are recomputed on reopen.

const KEY = "ai-insights-history-v1";
const MAX = 40;

export type ChatThread = {
  id: string;
  query: string;
  summary: string;
  createdAt: number;
};

export function loadHistory(): ChatThread[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function pushHistory(item: Omit<ChatThread, "id" | "createdAt">) {
  const next: ChatThread = {
    id: Math.random().toString(36).slice(2, 9),
    createdAt: Date.now(),
    ...item,
  };
  const list = [next, ...loadHistory()].slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
  return next;
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function formatWhen(ts: number): string {
  const d = new Date(ts), now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}
