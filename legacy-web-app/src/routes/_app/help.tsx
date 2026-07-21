import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen, Calculator, LayoutDashboard, Store, ArrowLeftRight, Warehouse,
  Users, FileBarChart, Sparkles, Database, ChevronRight, Lightbulb,
} from "lucide-react";
import { HOW_TO, METRIC_INFO, CALCULATION_KEYS } from "@/lib/help-content";

export const Route = createFileRoute("/_app/help")({
  component: HelpPage,
});

const ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  shop: Store,
  transactions: ArrowLeftRight,
  warehouse: Warehouse,
  employees: Users,
  reports: FileBarChart,
  ocr: Sparkles,
  backup: Database,
};

function HelpPage() {
  return (
    <div className="mobile-page-stack md:gap-6">
      {/* Hero */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-background p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              How To Use
            </h1>
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">
              A quick guided tour of every page, what it does, what affects its
              calculations, and the best way to use it. Tap any ⓘ icon inside
              the app for the same info beside a value.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <a href="#how-to-use" className="rounded-full border border-border bg-background/70 px-3 py-1.5 hover:bg-muted/60">
            How To Use
          </a>
          <a href="#calculation-logic" className="rounded-full border border-border bg-background/70 px-3 py-1.5 hover:bg-muted/60">
            Calculation Logic
          </a>
          <a href="#tips" className="rounded-full border border-border bg-background/70 px-3 py-1.5 hover:bg-muted/60">
            Tips
          </a>
        </div>
      </div>

      {/* How To Use */}
      <section id="how-to-use" className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold tracking-tight">
            How To Use Each Page
          </h2>
        </div>
        <Card className="overflow-hidden p-0">
          <Accordion type="multiple" className="divide-y divide-border/60">
            {HOW_TO.map((s) => {
              const Icon = ICONS[s.id] ?? BookOpen;
              return (
                <AccordionItem key={s.id} value={s.id} className="border-0">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60 text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold">{s.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-5 pb-5 text-[13px] leading-relaxed">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        What this page does
                      </p>
                      <p className="mt-1 text-foreground/85">{s.purpose}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Which entries affect it
                      </p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-foreground/80">
                        {s.inputs.map((i) => <li key={i}>{i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Workflow
                      </p>
                      <ol className="mt-1 list-decimal space-y-1 pl-5 text-foreground/80">
                        {s.workflow.map((w, i) => <li key={i}>{w}</li>)}
                      </ol>
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                        Best practice
                      </p>
                      <p className="mt-1 text-foreground/85">{s.bestPractice}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Card>
      </section>

      {/* Calculation Logic */}
      <section id="calculation-logic" className="space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Calculation Logic
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {CALCULATION_KEYS.map((k) => {
            const m = METRIC_INFO[k];
            if (!m) return null;
            return (
              <Card key={k} className="p-4">
                <p className="font-display text-sm font-semibold">{m.title}</p>
                <p className="mt-1 text-[12px] text-foreground/80">{m.what}</p>
                {m.formula && (
                  <div className="mt-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Formula
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-foreground">
                      {m.formula}
                    </p>
                  </div>
                )}
                {m.example && (
                  <p className="mt-2 text-[11px] italic text-muted-foreground">
                    {m.example}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tips */}
      <section id="tips" className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Quick Tips
          </h2>
        </div>
        <Card className="p-5 text-[13px] leading-relaxed text-foreground/85">
          <ul className="space-y-2">
            <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Tap any <b>ⓘ</b> icon next to a value to see what it means and how it was calculated.</li>
            <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> The date filter (Today / Yesterday / Weekly / Monthly / Custom) controls every summary on the page.</li>
            <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Selecting a shop card narrows the report to that shop only.</li>
            <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Use Reports → Export Excel monthly for offline backups.</li>
            <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> OCR scans are a helper — always sanity-check totals before saving.</li>
          </ul>
        </Card>
        <p className="text-center text-[11px] text-muted-foreground">
          Need a deeper walkthrough? Open{" "}
          <Link to="/settings" className="underline">Settings</Link>{" "}
          to configure opening balances and shop types.
        </p>
      </section>
    </div>
  );
}
