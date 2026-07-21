import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@tanstack/react-router";
import { Search, Store, Building2, Users, Package, Wallet, ReceiptText } from "lucide-react";
import { SAR } from "@/lib/format";
import type { MagicSearchResult, MagicHit } from "@/lib/magic-search";

function moduleIcon(m: string) {
  if (m.startsWith("Shop")) return <Store className="h-3.5 w-3.5" />;
  if (m.startsWith("Company")) return <Building2 className="h-3.5 w-3.5" />;
  if (m.startsWith("Employee")) return <Users className="h-3.5 w-3.5" />;
  if (m.startsWith("Wholesale")) return <Package className="h-3.5 w-3.5" />;
  if (m.startsWith("Cash Flow")) return <Wallet className="h-3.5 w-3.5" />;
  return <ReceiptText className="h-3.5 w-3.5" />;
}

function HitRow({ h, target }: { h: MagicHit; target: number | null }) {
  const router = useRouter();
  const body = (
    <div className="flex items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/60 active:bg-muted">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {moduleIcon(h.module)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="truncate">{h.module}</span>
          <span>·</span>
          <span className="truncate">{h.refType}</span>
        </div>
        <p className="mt-0.5 truncate text-[12.5px] font-medium leading-tight">
          {h.note || h.reference || "—"}
        </p>
        <p className="text-[10.5px] text-muted-foreground">{h.date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums">{SAR(h.amount)}</p>
        {target != null && (h.delta ?? 0) > 0 && (
          <p className="text-[9.5px] text-muted-foreground">±{SAR(h.delta!)}</p>
        )}
      </div>
    </div>
  );
  if (h.link) {
    const [path, qs] = h.link.split("?");
    const search = Object.fromEntries(new URLSearchParams(qs ?? ""));
    return (
      <button
        type="button"
        onClick={() => router.navigate({ to: path as any, search: search as any })}
        className="block w-full text-left border-b border-border/40 last:border-0"
      >
        {body}
      </button>
    );
  }
  return <div className="border-b border-border/40 last:border-0">{body}</div>;
}

export function MagicSearchCard({
  result,
  query,
  target,
}: {
  result: MagicSearchResult;
  query: string;
  target: number | null;
}) {
  const hasResults = result.exact.length > 0 || result.nearby.length > 0;
  return (
    <Card className="m-2 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/8 via-background to-background animate-fade-in">
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Search className="h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">Magic Search</p>
            <p className="truncate text-[12.5px] font-medium">"{query}"</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {result.exact.length + result.nearby.length} hit{(result.exact.length + result.nearby.length) === 1 ? "" : "s"}
        </Badge>
      </div>

      {!hasResults && (
        <div className="px-3.5 py-6 text-center text-xs text-muted-foreground">
          No matching records found across the ERP.
        </div>
      )}

      {result.exact.length > 0 && (
        <div>
          <div className="bg-muted/40 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            Exact Matches
          </div>
          {result.exact.map((h) => <HitRow key={h.id} h={h} target={target} />)}
        </div>
      )}

      {result.nearby.length > 0 && (
        <div>
          <div className="bg-muted/40 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
            Similar Values
          </div>
          {result.nearby.map((h) => <HitRow key={h.id} h={h} target={target} />)}
        </div>
      )}
    </Card>
  );
}
