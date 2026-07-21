// Floating "Ask AI" launcher — dispatches an open event; AI module loads on demand.
// Stays on the current page; no navigation, no separate sheet.

import { useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalAiButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on AI Insights itself (its own bar is the primary input)
  if (pathname.startsWith("/ai-insights")) return null;

  // Emergency mobile scroll recovery: remove the extra floating AI layer on
  // touch layouts so it cannot block cards, forms, or bottom-page content.

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("lovable:open-ai-copilot"))}
      className={cn(
        "fixed end-4 z-30 hidden h-11 w-11 items-center justify-center rounded-full md:flex md:h-12 md:w-12",
        "bg-primary text-primary-foreground",
        "shadow-md ring-1 ring-primary/20",
        "transition-transform hover:scale-105 active:scale-95",
        "md:bottom-6",
      )}
      aria-label="Ask AI"
    >
      <Sparkles className="h-5 w-5" />
    </button>
  );
}
