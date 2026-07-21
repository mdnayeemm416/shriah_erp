import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkingDate, todayISO } from "@/hooks/use-working-date";

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function chipLabel(iso: string): string {
  // Compact "1 Jun" style — no year, no icon.
  const d = parseISO(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
function fullLabel(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISO(d);
}
function lastMonthEndISO(): string {
  const d = new Date();
  d.setDate(0);
  return toISO(d);
}

export function WorkingDatePill({ className }: { className?: string }) {
  const { workingDate, setWorkingDate, resetToToday, isToday } = useWorkingDate();
  const [open, setOpen] = useState(false);

  const pick = (iso: string) => {
    setWorkingDate(iso);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Working date: ${fullLabel(workingDate)}${isToday ? "" : " (historical)"}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 h-7 text-[12px] font-medium leading-none tabular-nums transition-all active:scale-[0.97]",
            isToday
              ? "border-border/60 bg-muted/40 text-foreground hover:bg-muted"
              : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100",
            className,
          )}
        >
          {!isToday && <AlertTriangle className="h-3 w-3" />}
          <span>{chipLabel(workingDate)}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="border-b border-border/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Working Date
          </p>
          <p className="mt-0.5 text-[12px] font-medium">
            All dashboard cards refresh for this date.
          </p>
          {!isToday && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
              <AlertTriangle className="h-3 w-3" /> Viewing Historical Data
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2">
          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => pick(todayISO())}>
            Today
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => pick(yesterdayISO())}>
            Yesterday
          </Button>
          <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => pick(lastMonthEndISO())}>
            Last Month End
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={parseISO(workingDate)}
          onSelect={(d) => { if (d) pick(toISO(d)); }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-2">
          <span className="text-[10px] text-muted-foreground">
            Today: <span className="font-medium text-foreground">{fullLabel(todayISO())}</span>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1 px-2 text-[11px]"
            onClick={() => { resetToToday(); setOpen(false); }}
            disabled={isToday}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
