import { Check, Sparkles, RotateCcw } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ThemeDef, ThemeOptions } from "@/lib/themes";

export function ThemesPanel() {
  const { themes, themeId, setThemeId, options, setOptions, resetOptions } = useTheme();

  const darkThemes = themes.filter((t) => t.mode === "dark");
  const lightThemes = themes.filter((t) => t.mode === "light");

  return (
    <div className="space-y-8 animate-fade-in">
      <Section title="Dark themes" subtitle="Premium dark palettes tuned for finance dashboards.">
        <ThemeGrid items={darkThemes} active={themeId} onSelect={setThemeId} />
      </Section>

      <Section title="Light themes" subtitle="Clean light palettes for daytime workflows.">
        <ThemeGrid items={lightThemes} active={themeId} onSelect={setThemeId} />
      </Section>

      <Section title="Advanced options" subtitle="Fine-tune density, corners, glass and motion.">
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionRow
            label="Compact mode"
            hint="Tighter spacing across the app."
            checked={options.compact}
            onChange={(v) => setOptions({ compact: v })}
          />
          <OptionRow
            label="Glass effect"
            hint="Frosted blur on cards & popovers."
            checked={options.glass}
            onChange={(v) => setOptions({ glass: v })}
          />
          <SegmentRow
            label="Rounded corners"
            value={options.rounded}
            options={[
              { value: "sharp", label: "Sharp" },
              { value: "soft", label: "Soft" },
              { value: "round", label: "Round" },
            ]}
            onChange={(v) => setOptions({ rounded: v as ThemeOptions["rounded"] })}
          />
          <SegmentRow
            label="Animation"
            value={options.motion}
            options={[
              { value: "off", label: "Off" },
              { value: "subtle", label: "Subtle" },
              { value: "full", label: "Full" },
            ]}
            onChange={(v) => setOptions({ motion: v as ThemeOptions["motion"] })}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetOptions}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset options
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ThemeGrid({
  items,
  active,
  onSelect,
}: {
  items: ThemeDef[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((t) => (
        <ThemeCard key={t.id} theme={t} active={t.id === active} onClick={() => onSelect(t.id)} />
      ))}
    </div>
  );
}

function ThemeCard({ theme, active, onClick }: { theme: ThemeDef; active: boolean; onClick: () => void }) {
  const { bg, surface, accent, text } = theme.preview;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-3 text-left transition-all tap",
        "hover:border-primary/50 hover:shadow-[var(--shadow-soft)]",
        active ? "border-primary ring-2 ring-primary/30" : "border-border/60",
      )}
    >
      {/* mini preview */}
      <div
        className="relative h-24 w-full overflow-hidden rounded-xl border border-black/10"
        style={{ background: bg }}
      >
        <div
          className="absolute left-2 top-2 h-3 w-12 rounded-full"
          style={{ background: surface, opacity: 0.9 }}
        />
        <div
          className="absolute left-2 top-7 h-9 w-[55%] rounded-md"
          style={{ background: surface }}
        />
        <div
          className="absolute right-2 top-7 h-9 w-[30%] rounded-md"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 4px 14px -2px ${accent}66`,
          }}
        />
        <div
          className="absolute bottom-2 left-2 h-1.5 w-[40%] rounded-full"
          style={{ background: text, opacity: 0.6 }}
        />
        <div
          className="absolute bottom-2 left-[44%] h-1.5 w-[30%] rounded-full"
          style={{ background: text, opacity: 0.3 }}
        />
        {active && (
          <div
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: accent, color: bg }}
          >
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight">{theme.name}</p>
          <p className="truncate text-[10.5px] text-muted-foreground">{theme.description}</p>
        </div>
        <Sparkles
          className={cn(
            "mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors",
            active ? "text-primary" : "text-muted-foreground/40",
          )}
        />
      </div>
    </button>
  );
}

function OptionRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/60 p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function SegmentRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition-all",
              value === o.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
