// Lightweight voice input for Magic Search / AI Insights.
// Uses the browser Web Speech API (free, on-device on most platforms).
// No always-listening, no streaming AI — single short capture per tap.

import { useEffect, useRef, useState } from "react";
import { Mic, Loader2, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type VoiceLang = "en-US" | "bn-BD" | "ar-SA";

const LANG_LABEL: Record<VoiceLang, string> = {
  "en-US": "EN",
  "bn-BD": "BN",
  "ar-SA": "AR",
};
const LANG_ORDER: VoiceLang[] = ["en-US", "bn-BD", "ar-SA"];
const LS_KEY = "ai_voice_lang";

function getInitialLang(): VoiceLang {
  if (typeof window === "undefined") return "en-US";
  const v = (window.localStorage.getItem(LS_KEY) || "") as VoiceLang;
  return LANG_ORDER.includes(v) ? v : "en-US";
}

type SR = any;
function getSpeechRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export type VoiceMicProps = {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  size?: "sm" | "md";
  showLangToggle?: boolean;
  className?: string;
};

export function VoiceMicButton({
  onTranscript, onInterim, size = "md", showLangToggle = false, className,
}: VoiceMicProps) {
  const SR = typeof window !== "undefined" ? getSpeechRecognition() : null;
  const [supported] = useState<boolean>(!!SR);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lang, setLang] = useState<VoiceLang>(getInitialLang);
  const recRef = useRef<any>(null);
  const finalRef = useRef<string>("");

  useEffect(() => {
    return () => {
      try { recRef.current?.stop?.(); } catch {}
      recRef.current = null;
    };
  }, []);

  function cycleLang() {
    const idx = LANG_ORDER.indexOf(lang);
    const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
    setLang(next);
    try { localStorage.setItem(LS_KEY, next); } catch {}
  }

  function stop() {
    try { recRef.current?.stop?.(); } catch {}
  }

  function start() {
    if (!SR) {
      toast.error("Voice not supported", { description: "Your browser does not support speech input." });
      return;
    }
    if (listening) { stop(); return; }
    finalRef.current = "";
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else interim += r[0].transcript;
      }
      onInterim?.((finalRef.current + " " + interim).trim());
    };
    rec.onerror = (e: any) => {
      setListening(false); setProcessing(false);
      const err = e?.error || "error";
      if (err === "not-allowed" || err === "service-not-allowed") {
        toast.error("Microphone permission required", { description: "Enable mic access in your browser settings." });
      } else if (err === "no-speech") {
        toast.message("Didn't hear anything", { description: "Tap the mic and try again." });
      } else if (err !== "aborted") {
        toast.error("Voice error", { description: err });
      }
    };
    rec.onend = () => {
      setListening(false);
      const text = finalRef.current.trim();
      if (!text) { setProcessing(false); return; }
      setProcessing(true);
      // brief tick so the UI shows "Understanding…" before the parser runs
      setTimeout(() => {
        setProcessing(false);
        onTranscript(text);
      }, 120);
    };

    recRef.current = rec;
    try { rec.start(); } catch (err: any) {
      toast.error("Could not start mic", { description: err?.message ?? "" });
      setListening(false);
    }
  }

  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        aria-label="Voice not supported"
        title="Voice search isn't supported in this browser"
        className={cn(
          "flex items-center justify-center rounded-xl border border-border/40 bg-muted/30 text-muted-foreground/50",
          dim, className,
        )}
      >
        <MicOff className={iconSize} />
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showLangToggle && (
        <button
          type="button"
          onClick={cycleLang}
          title={`Voice language: ${LANG_LABEL[lang]} — tap to switch`}
          className="rounded-md border border-border/50 bg-background/70 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground hover:bg-muted"
        >
          {LANG_LABEL[lang]}
        </button>
      )}
      <button
        type="button"
        onClick={start}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        aria-pressed={listening}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl transition-all active:scale-95",
          dim,
          listening
            ? "bg-destructive text-destructive-foreground shadow-[0_0_0_4px_hsl(var(--destructive)/0.18)]"
            : processing
              ? "bg-primary/15 text-primary"
              : "bg-muted/60 text-foreground/70 hover:bg-muted",
        )}
      >
        {processing ? (
          <Loader2 className={cn(iconSize, "animate-spin")} />
        ) : (
          <Mic className={iconSize} />
        )}
        {listening && (
          <>
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-destructive/50 animate-ping" />
            <span className="pointer-events-none absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-end gap-[2px]">
              <span className="h-1.5 w-[2px] rounded-full bg-destructive animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="h-2.5 w-[2px] rounded-full bg-destructive animate-pulse" style={{ animationDelay: "120ms" }} />
              <span className="h-1.5 w-[2px] rounded-full bg-destructive animate-pulse" style={{ animationDelay: "240ms" }} />
            </span>
          </>
        )}
      </button>
    </div>
  );
}

/** Compact status pill shown next to or below the search bar while listening/processing. */
export function VoiceStatusPill({ listening, processing, interim }: { listening: boolean; processing: boolean; interim?: string | null }) {
  if (!listening && !processing) return null;
  return (
    <div className="mt-2 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11.5px] text-foreground/80 backdrop-blur animate-fade-in">
      <span className={cn(
        "inline-block h-2 w-2 rounded-full",
        listening ? "bg-destructive animate-pulse" : "bg-primary",
      )} />
      <span className="font-medium">
        {processing ? "Understanding…" : "Listening…"}
      </span>
      {interim && (
        <span className="truncate text-muted-foreground italic">{interim}</span>
      )}
    </div>
  );
}
