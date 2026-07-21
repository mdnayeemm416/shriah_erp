import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { Wallet, Users, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CashFlowPage } from "./cash-flow";
import { CashCustodyPage } from "./cash-custody";
import { CfClosingProof } from "@/components/cf-closing-proof";
import { CfBulkVerify } from "@/components/cf-bulk-verify";
import { CfWorkflowVerification } from "@/components/cf-workflow-verification";

type TabKey = "cash-flow" | "custody";

export const Route = createFileRoute("/_app/finance-workflow")({
  validateSearch: (s: Record<string, unknown>): { tab?: TabKey; highlight?: string; date?: string; shop?: string } => {
    const t = s.tab as string | undefined;
    return {
      ...(t === "custody" || t === "cash-flow" ? { tab: t } : {}),
      ...(typeof s.highlight === "string" ? { highlight: s.highlight } : {}),
      ...(typeof s.date === "string" ? { date: s.date } : {}),
      ...(typeof s.shop === "string" ? { shop: s.shop } : {}),
    };
  },
  component: FinanceWorkflowPage,
});

function FinanceWorkflowPage() {
  const search = useSearch({ from: "/_app/finance-workflow" });
  const nav = useNavigate({ from: "/finance-workflow" });

  const tab: TabKey = (search.tab as TabKey) ?? "cash-flow";

  const tabs = useMemo(() => {
    const items: { value: TabKey; label: string; icon: any; show: boolean }[] = [
      { value: "cash-flow", label: "Cash & Purchases", icon: Wallet, show: true },
      { value: "custody",   label: "Custody & Handovers", icon: Users, show: true },
    ];
    return items.filter((t) => t.show);
  }, []);

  const setTab = (v: string) =>
    nav({ search: { tab: v === "cash-flow" ? undefined : (v as TabKey) }, replace: true });


  return (
    <div className="mobile-page-stack md:pb-8">
      <Card className="p-4 md:p-5 bg-gradient-to-br from-primary/8 via-background to-background border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-glow)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-lg md:text-xl font-semibold leading-tight">Finance Workflow</h1>
            <p className="text-xs text-muted-foreground">
              Cash · Purchases · Custody · OCR — one unified flow
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <div className="-mx-1 overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full md:min-w-0 gap-1 bg-muted/50 p-1 rounded-2xl">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="gap-2 rounded-xl px-3 py-2 text-xs md:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <TabsContent value="cash-flow" className="mt-0">
          <CashFlowPage />
        </TabsContent>
        <TabsContent value="custody" className="mt-0">
          <CashCustodyPage />
        </TabsContent>

      </Tabs>

      <CfClosingProof />
      <CfBulkVerify />
      <CfWorkflowVerification />
    </div>
  );
}
