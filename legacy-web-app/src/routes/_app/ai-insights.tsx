import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Loader2, Compass, FileText, X, Calendar, ArrowRight, Search, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { parseSmartQuery } from "@/lib/smart-query";
import { parseErpIntent, hasErpIntent } from "@/lib/erp-query";
import { runMetric, runReport, type MetricResult, type ReportResult } from "@/lib/erp-runner";
import { ErpMetricCard, ErpReportCard } from "@/components/erp-result-card";
import {
  detectNavigationIntent, detectEntryIntent, INSIGHT_SUGGESTIONS,
  resolveQuickRange, type DateQuickRange, type EntryDraft,
} from "@/lib/ai-insights-intent";
import { buildSuggestionPool, rankSuggestions } from "@/lib/search-suggestions";
import { buildDictionary, normalizeQuery, suggestCorrection } from "@/lib/erp-dictionary";
import { detectCompareIntent, runCompare, type CompareResult } from "@/lib/ai-compare";
import { runMagicSearch, type MagicSearchResult } from "@/lib/magic-search";
import { MagicSearchCard } from "@/components/magic-search-card";
// Heavy panels — only mount when their data is present.
const AiCompareCard = lazy(() => import("@/components/ai-compare-card").then(m => ({ default: m.AiCompareCard })));
const AiQuickPanels = lazy(() => import("@/components/ai-quick-panels").then(m => ({ default: m.AiQuickPanels })));
const AiShareModal = lazy(() => import("@/components/ai-share-modal").then(m => ({ default: m.AiShareModal })));
import { renderCompareImage } from "@/lib/magic-share";
import { loadHistory, pushHistory, clearHistory, formatWhen, type ChatThread } from "@/lib/ai-chat-history";
import { SAR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";
import { VoiceMicButton, VoiceStatusPill } from "@/components/voice-mic-button";
import { useUserAccess } from "@/hooks/use-user-access";
import { pageKeyFromPath } from "@/lib/page-access";

export const Route = createFileRoute("/_app/ai-insights")({
  component: AiInsightsPage,
  validateSearch: (s: Record<string, unknown>) =>
    z.object({ q: z.string().optional() }).parse(s),
});

type Bubble =
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "metric"; query: string; result: MetricResult }
  | { id: string; kind: "report"; query: string; result: ReportResult }
  | { id: string; kind: "compare"; query: string; result: CompareResult }
  | { id: string; kind: "navigate"; query: string; to: string; label: string }
  | { id: string; kind: "entry"; query: string; draft: EntryDraft }
  | { id: string; kind: "magic"; query: string; result: MagicSearchResult; target: number | null }
  | { id: string; kind: "empty"; query: string; reason: string };

const QUICK_RANGES: { id: DateQuickRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "custom", label: "Custom" },
];

const ROTATING_PLACEHOLDERS = [
  "This Month Azzouz Total Sale",
  "Today Withdraw",
  "Why was cash short yesterday?",
  "Top suppliers this month",
  "Open Shop",
  "23 May Azzouz Purchase 5000",
  "Compare this month vs last month",
  "Business stability score",
];

function uid() { return Math.random().toString(36).slice(2, 9); }

function AiInsightsPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const access = useUserAccess();
  const [input, setInput] = useState("");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [loading, setLoading] = useState(false);
  const [quick, setQuick] = useState<DateQuickRange>("this_month");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [parties, setParties] = useState<string[]>([]);
  const [shops, setShops] = useState<string[]>([]);
  const [history, setHistory] = useState<ChatThread[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCaption, setShareCaption] = useState("");
  const [cashiers, setCashiers] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState<string | null>(null);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [openMonthStart, setOpenMonthStart] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize range
  useEffect(() => {
    const r = resolveQuickRange("this_month");
    if (r) { setFrom(r.from); setTo(r.to); }
  }, []);

  // Rotate placeholder every 3.5s when input is empty + unfocused
  useEffect(() => {
    if (input || focused) return;
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [input, focused]);

  // Load entities for suggestions, dictionary, and entity matching
  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, c, e, s] = await Promise.all([
        supabase.from("parties").select("name").eq("is_deleted", false).limit(200),
        supabase.from("cashiers").select("name").eq("is_deleted", false).limit(200),
        supabase.from("employees").select("name").eq("is_deleted", false).limit(200),
        supabase.from("shops").select("name").eq("is_deleted", false).limit(100),
      ]);
      if (!alive) return;
      const pn = (p.data ?? []).map((r: any) => r.name).filter(Boolean);
      const cn = (c.data ?? []).map((r: any) => r.name).filter(Boolean);
      const en = (e.data ?? []).map((r: any) => r.name).filter(Boolean);
      const sn = (s.data ?? []).map((r: any) => r.name).filter(Boolean);
      setParties(pn); setCashiers(cn); setEmployees(en); setShops(sn);
      buildDictionary({ shops: sn, cashiers: cn, employees: en, parties: pn });
    })();
    buildDictionary();
    setHistory(loadHistory());
    // Determine the current open month start = day after the latest closed month end.
    (async () => {
      const { data } = await supabase
        .from("monthly_closings")
        .select("month")
        .eq("status", "closed")
        .order("month", { ascending: false })
        .limit(1);
      const last = data?.[0]?.month;
      if (last) {
        const d = new Date(last);
        // monthly_closings.month is the first day of the closed month; open month starts the following month.
        const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        const y = next.getFullYear();
        const m = String(next.getMonth() + 1).padStart(2, "0");
        setOpenMonthStart(`${y}-${m}-01`);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [bubbles, loading]);

  const pool = useMemo(
    () => buildSuggestionPool(parties, cashiers, employees),
    [parties, cashiers, employees],
  );

  // Debounced suggestions — rank against the NORMALIZED input so typos still surface results
  const [debouncedInput, setDebouncedInput] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(input), 120);
    return () => clearTimeout(t);
  }, [input]);

  const autocompletes = useMemo(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed.length < 1) return [];
    const norm = normalizeQuery(trimmed) || trimmed;
    const primary = rankSuggestions(norm, pool, 7);
    if (primary.length >= 3 || norm.toLowerCase() === trimmed.toLowerCase()) return primary;
    const fallback = rankSuggestions(trimmed, pool, 7);
    return Array.from(new Set([...primary, ...fallback])).slice(0, 7);
  }, [debouncedInput, pool]);

  // (suggestions + scroll effects defined above)

  function pickQuick(r: DateQuickRange) {
    setQuick(r);
    if (r === "custom") return;
    const range = resolveQuickRange(r);
    if (range) { setFrom(range.from); setTo(range.to); }
  }

  async function run(rawQ: string) {
    const original = rawQ.trim();
    if (!original) return;

    // ERP dictionary pass: insert missing spaces ("20mayazzouzsale"),
    // fix typos ("azzoz"→"azzouz", "wdraw"→"withdraw"), expand "20may"→"20 may".
    const normalized = normalizeQuery(original) || original;
    const text = normalized;
    const corrected = suggestCorrection(original);

    setInput("");
    setBubbles((b) => [...b, { id: uid(), kind: "user", text: original }]);
    if (corrected && corrected.toLowerCase() !== original.toLowerCase()) {
      toast.message("Auto-corrected", { description: `Interpreted as: ${corrected}` });
    }

    const nav = detectNavigationIntent(text);
    if (nav) {
      const key = pageKeyFromPath(nav.to);
      if (key && !access.hasPage(key)) {
        setBubbles((b) => [...b, { id: uid(), kind: "empty", query: text, reason: `Access Restricted — you can't open ${nav.label}. Ask an admin to grant access.` }]);
        return;
      }
      setBubbles((b) => [...b, { id: uid(), kind: "navigate", query: text, to: nav.to, label: nav.label }]);
      setTimeout(() => navigate({ to: nav.to as any }), 400);
      return;
    }


    setLoading(true);
    try {
      const sq = parseSmartQuery(text);
      const erp = parseErpIntent(text, { cashiers, employees, parties });

      const draft = detectEntryIntent(text, sq, erp);
      if (draft) {
        setBubbles((b) => [...b, { id: uid(), kind: "entry", query: text, draft }]);
        setHistory((h) => [pushHistory({ query: text, summary: `Draft: ${draft.type} ${SAR(draft.amount)}` }), ...h]);
        return;
      }

      const bounds = {
        from: sq.dateFrom ?? from ?? null,
        to: sq.dateTo ?? to ?? null,
      };

      const cmp = detectCompareIntent(text, { shops, cashiers, employees, parties });
      if (cmp) {
        const result = await runCompare(cmp, bounds);
        setBubbles((b) => [...b, { id: uid(), kind: "compare", query: text, result }]);
        setHistory((h) => [pushHistory({ query: text, summary: `Compare ${result.aLabel} vs ${result.bLabel}` }), ...h]);
        return;
      }

      if (hasErpIntent(erp)) {
        if (erp.reportMode || !erp.metric) {
          const result = await runReport(erp, bounds);
          setBubbles((b) => [...b, { id: uid(), kind: "report", query: text, result }]);
          setHistory((h) => [pushHistory({ query: text, summary: `Report · ${result.scopeLabel}` }), ...h]);
        } else {
          const result = await runMetric(erp, bounds);
          if (result) {
            setBubbles((b) => [...b, { id: uid(), kind: "metric", query: text, result }]);
            setHistory((h) => [pushHistory({ query: text, summary: `${result.label}: ${SAR(result.value)}` }), ...h]);
          } else {
            setBubbles((b) => [...b, { id: uid(), kind: "empty", query: text, reason: "No matching data found." }]);
          }
        }
        return;
      }

      // Magic Search — number, free-text, or date lookup across the whole ERP.
      // Triggers when the query has a concrete value/text/date but no ERP
      // metric, no scope (shop/cashier/employee/party), and no report intent.
      const hasMagicSignal =
        sq.amount != null ||
        (sq.text && sq.text.trim().length >= 2) ||
        sq.dateFrom != null;
      if (hasMagicSignal) {
        // Default search scope: current open month only. Closed-month rows stay
        // inside Monthly Closing History. Toggle "Include Closed Months" to
        // search the full ERP history.
        let magicFrom = sq.dateFrom ?? bounds.from;
        if (!includeClosed && openMonthStart) {
          if (!magicFrom || magicFrom < openMonthStart) magicFrom = openMonthStart;
        }
        const magic = await runMagicSearch({
          amount: sq.amount,
          text: sq.text?.trim() || null,
          dateFrom: magicFrom,
          dateTo: sq.dateTo ?? bounds.to,
        });
        if (magic.exact.length > 0 || magic.nearby.length > 0) {
          const scopeNote = includeClosed ? "all history" : "current open month";
          setBubbles((b) => [...b, { id: uid(), kind: "magic", query: text, result: magic, target: sq.amount }]);
          setHistory((h) => [pushHistory({ query: text, summary: `Magic · ${magic.exact.length + magic.nearby.length} hits · ${scopeNote}` }), ...h]);
          return;
        }
      }

      const result = await runReport(erp, bounds);
      setBubbles((b) => [...b, { id: uid(), kind: "report", query: text, result }]);
      setHistory((h) => [pushHistory({ query: text, summary: `Report · ${result.scopeLabel}` }), ...h]);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to run query");
      setBubbles((b) => [...b, { id: uid(), kind: "empty", query: text, reason: "Could not understand. Try a different query." }]);
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft(draft: EntryDraft) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) throw new Error("Not signed in");
      const date = draft.date ?? new Date().toISOString().slice(0, 10);

      if (draft.type === "expense" || draft.type === "withdraw" || draft.type === "purchase") {
        let shopId: string | null = null;
        if (draft.shop) {
          const { data: s } = await supabase.from("shops").select("id").ilike("name", draft.shop).limit(1);
          shopId = s?.[0]?.id ?? null;
        }
        if (shopId) {
          const payload: any = {
            txn_date: date, shop_id: shopId, entry_type: draft.type, created_by: userId,
            notes: draft.note,
            purchase_amount: draft.type === "purchase" ? draft.amount : 0,
            expense_amount: draft.type === "expense" ? draft.amount : 0,
            withdraw_amount: draft.type === "withdraw" ? draft.amount : 0,
          };
          const { error } = await supabase.from("shop_entries").insert(payload);
          if (error) throw error;
          toast.success("Entry saved");
          navigate({ to: "/shop" });
          return;
        }
        const { error } = await supabase.from("transactions").insert({
          txn_date: date,
          type: draft.type === "purchase" ? "purchase" : draft.type,
          amount: draft.amount,
          notes: draft.note,
          created_by: userId,
          payment_method: "cash",
        } as any);
        if (error) throw error;
        toast.success("Transaction saved");
        navigate({ to: "/summary" });
        return;
      }

      if (draft.type === "employee_given" || draft.type === "employee_received") {
        if (!draft.employee) {
          toast.error("Employee not specified");
          return;
        }
        const { data: emp } = await supabase.from("employees").select("id").ilike("name", draft.employee).limit(1);
        const empId = emp?.[0]?.id;
        if (!empId) throw new Error("Employee not found");
        const { error } = await supabase.from("employee_entries").insert({
          txn_date: date,
          employee_id: empId,
          entry_type: draft.type === "employee_given" ? "given" : "received",
          amount: draft.amount,
          notes: draft.note,
          created_by: userId,
        } as any);
        if (error) throw error;
        toast.success("Employee entry saved");
        navigate({ to: "/employees" });
        return;
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    }
  }

  function clearAll() { setBubbles([]); }

  // Auto-run a query passed via ?q=… (used by the global floating AI button)
  const ranOnceRef = useRef<string | null>(null);
  useEffect(() => {
    const q = (search?.q ?? "").toString().trim();
    if (!q || ranOnceRef.current === q) return;
    ranOnceRef.current = q;
    // small delay so entities load first for better entity matching
    const t = setTimeout(() => run(q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.q]);

  const currentPlaceholder = ROTATING_PLACEHOLDERS[placeholderIdx];

  return (
    <div className="mobile-page-stack mx-auto max-w-3xl">
      {/* === AI SEARCH BAR (normal document flow) === */}
      <div className="-mx-3 mb-4 px-3 pb-3 pt-2 md:-mx-6 md:px-6">

        {/* Header row — hidden when compact to free vertical space */}
        <div className={cn(
          "mb-2 flex items-center justify-between gap-2",
        )}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">Ask AI</p>
              <h1 className="font-display text-base font-bold leading-none">Ask AI</h1>
            </div>
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
             className="flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-1 text-[10px] font-medium text-foreground/70 hover:bg-muted"
          >
            <Calendar className="h-3 w-3" />
            {QUICK_RANGES.find((r) => r.id === quick)?.label ?? "Range"}
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); run(input); }}
          className={cn(
            "group relative flex items-center gap-2 rounded-2xl border bg-background p-1.5 pl-3 shadow-sm transition-all",
            focused
              ? "border-primary/50 ring-2 ring-primary/20 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.35)]"
              : "border-border/60",
          )}
        >
          <Search className={cn("h-4 w-4 shrink-0 transition-colors", focused ? "text-primary" : "text-muted-foreground")} />
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={currentPlaceholder}
            className="h-10 flex-1 border-0 bg-transparent text-sm shadow-none transition-all focus-visible:ring-0"
          />
          {input && (
            <button
              type="button"
              onClick={() => { setInput(""); inputRef.current?.focus(); }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Clear input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <VoiceMicButton
            size="md"
            showLangToggle
            onInterim={(t) => setVoiceInterim(t)}
            onTranscript={(t) => {
              setVoiceInterim(null);
              toast.message("You said", { description: t });
              run(t);
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm transition-all hover:from-primary hover:to-primary"
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>

          {/* Live suggestion dropdown */}
          {focused && autocompletes.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-border/60 bg-background shadow-md animate-fade-in">
              <div className="px-3 pt-2 pb-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                Smart Suggestions
              </div>
              <ul className="pb-1.5">
                {autocompletes.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); run(s); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] hover:bg-muted/70"
                    >
                      <Sparkles className="h-3 w-3 shrink-0 text-primary/70" />
                      <span className="truncate">{s}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <VoiceStatusPill listening={voiceInterim !== null && voiceInterim !== ""} processing={false} interim={voiceInterim} />



        {/* Collapsible date filters */}
        {filtersOpen && (
          <Card className="mt-2 border-border/60 bg-background p-2.5 animate-fade-in">
            <div className="flex flex-wrap gap-1.5">
              {QUICK_RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => pickQuick(r.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                    quick === r.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-background text-foreground/80 hover:bg-muted",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Input
                type="date" value={from}
                onChange={(e) => { setFrom(e.target.value); setQuick("custom"); }}
                className="h-8 text-[12px]"
              />
              <Input
                type="date" value={to}
                onChange={(e) => { setTo(e.target.value); setQuick("custom"); }}
                className="h-8 text-[12px]"
              />
            </div>
            <button
              type="button"
              onClick={() => setIncludeClosed((v) => !v)}
              className={cn(
                "mt-2 flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                includeClosed
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/60 bg-background text-foreground/80 hover:bg-muted",
              )}
            >
              <span className="flex flex-col items-start">
                <span>Magic Search Scope</span>
                <span className="text-[9.5px] font-normal text-muted-foreground">
                  {includeClosed ? "Searching all history" : "Current open month only"}
                </span>
              </span>
              <span className={cn(
                "rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
                includeClosed ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground",
              )}>
                {includeClosed ? "Closed: ON" : "Closed: OFF"}
              </span>
            </button>
          </Card>
        )}
      </div>

      {/* === EMPTY-STATE SUGGESTION CHIPS === */}
      {bubbles.length === 0 && (
        <div className="mb-4 space-y-4 animate-fade-in">
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-4">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                <Sparkles className="h-3 w-3" /> Welcome
              </div>
              <h2 className="mt-1 font-display text-lg font-bold leading-tight">
                Ask anything about your business
              </h2>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Get instant reports, detect anomalies, create entries, or just navigate — all with natural language.
              </p>
            </div>
          </Card>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking</p>
            <div className="flex flex-wrap gap-1.5">
              {INSIGHT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => run(s)}
                  className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-foreground/80 shadow-sm transition-all hover:scale-[1.02] hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === BUBBLES === */}
      <div className="space-y-3">
        {bubbles.map((b) => {
          if (b.kind === "user") {
            return (
              <div key={b.id} className="flex justify-end animate-fade-in">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-primary to-primary/85 px-3.5 py-2 text-sm text-primary-foreground shadow-md">
                  {b.text}
                </div>
              </div>
            );
          }
          if (b.kind === "metric") return <div key={b.id} className="animate-fade-in"><ErpMetricCard r={b.result} query={b.query} /></div>;
          if (b.kind === "report") return <div key={b.id} className="animate-fade-in"><ErpReportCard r={b.result} query={b.query} /></div>;
          if (b.kind === "navigate") {
            return (
              <Card key={b.id} className="m-2 flex items-center gap-3 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-3 animate-fade-in">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Navigating</p>
                  <p className="truncate text-sm font-medium">Opening {b.label}…</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Card>
            );
          }
          if (b.kind === "entry") {
            const d = b.draft;
            const typeLabel = d.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <Card key={b.id} className="m-2 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/8 via-background to-background p-3.5 shadow-md animate-fade-in">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  <Sparkles className="h-3 w-3" /> Confirm Entry
                </div>
                <p className="mt-1 text-base font-semibold">{typeLabel}</p>
                <ul className="mt-2 space-y-1 text-[12px]">
                  <li className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold tabular-nums">{SAR(d.amount)}</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{d.date ?? "Today"}</span></li>
                  {d.shop && <li className="flex justify-between"><span className="text-muted-foreground">Shop</span><span>{d.shop}</span></li>}
                  {d.party && <li className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span>{d.party}</span></li>}
                  {d.employee && <li className="flex justify-between"><span className="text-muted-foreground">Employee</span><span>{d.employee}</span></li>}
                  {d.note && <li className="flex justify-between"><span className="text-muted-foreground">Note</span><span>{d.note}</span></li>}
                </ul>
                <div className="mt-3 flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setBubbles((bs) => bs.filter((x) => x.id !== b.id))}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    const path = d.type.startsWith("employee") ? "/employees" : d.shop ? "/shop" : "/summary";
                    navigate({ to: path as any });
                  }}>Edit</Button>
                  <Button size="sm" onClick={() => saveDraft(d)}>Save</Button>
                </div>
              </Card>
            );
          }
          if (b.kind === "compare") {
            return (
              <div key={b.id} className="animate-fade-in">
                <Suspense fallback={<Card className="m-2 p-4 text-xs text-muted-foreground">Loading comparison…</Card>}>
                  <AiCompareCard
                    r={b.result}
                    onShare={() => {
                      setShareUrl(renderCompareImage(b.result, b.query));
                      setShareCaption(`*AI Compare*\n${b.result.aLabel} vs ${b.result.bLabel}\n${b.result.dateLabel}\n— ShRiAh Group`);
                      setShareOpen(true);
                    }}
                  />
                </Suspense>
              </div>
            );
          }
          if (b.kind === "magic") {
            return (
              <div key={b.id} className="animate-fade-in">
                <MagicSearchCard result={b.result} query={b.query} target={b.target} />
              </div>
            );
          }
          return (
            <Card key={b.id} className="m-2 flex items-center gap-3 p-3 animate-fade-in">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{b.reason}</p>
            </Card>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/30 px-3 py-2 text-sm text-muted-foreground animate-fade-in">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="bg-gradient-to-r from-foreground/80 via-primary to-foreground/80 bg-[length:200%_auto] bg-clip-text text-transparent animate-pulse">
              Thinking…
            </span>
          </div>
        )}

        {bubbles.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              onClick={clearAll}
              className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10.5px] font-medium text-muted-foreground hover:bg-muted"
            >
              Clear conversation
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

void Badge;
