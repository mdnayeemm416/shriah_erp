import { Info } from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { METRIC_INFO, type MetricInfo } from "@/lib/help-content";
import { cn } from "@/lib/utils";

type Props = {
  // Either pass a known key from METRIC_INFO…
  metric?: keyof typeof METRIC_INFO | string;
  // …or supply ad-hoc content
  info?: MetricInfo;
  size?: "xs" | "sm";
  className?: string;
  ariaLabel?: string;
};

/**
 * Small ⓘ button — opens a non-intrusive popover that explains what a value
 * means, how it's calculated, and which entries affect it.
 *
 * Place it in the top-right of summary cards or next to field labels.
 */
export function InfoButton({ metric, info, size = "sm", className, ariaLabel }: Props) {
  const data: MetricInfo | undefined =
    info ?? (metric ? METRIC_INFO[metric as string] : undefined);
  if (!data) return null;

  const dim = size === "xs" ? "h-4 w-4" : "h-5 w-5";
  const ico = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel ?? `What is ${data.title}?`}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground/70",
            "transition-colors hover:bg-muted hover:text-foreground",
            dim,
            className,
          )}
        >
          <Info className={ico} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 p-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-3">
          <p className="font-display text-sm font-semibold">{data.title}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            What it means
          </p>
        </div>
        <div className="space-y-3 px-4 py-3 text-[12px] leading-relaxed">
          <p className="text-foreground/85">{data.what}</p>
          {data.formula && (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Formula
              </p>
              <p className="mt-1 font-mono text-[11px] text-foreground">
                {data.formula}
              </p>
            </div>
          )}
          {data.inputs && data.inputs.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Affected by
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-foreground/80">
                {data.inputs.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          )}
          {data.example && (
            <p className="rounded-md bg-primary/5 px-2.5 py-2 text-[11px] italic text-foreground/75">
              {data.example}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
