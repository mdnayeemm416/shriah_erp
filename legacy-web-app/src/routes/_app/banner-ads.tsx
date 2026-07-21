import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerAdsManager } from "@/components/banner-ads-manager";

export const Route = createFileRoute("/_app/banner-ads")({
  component: BannerAdsPage,
  head: () => ({
    meta: [
      { title: "Banner Ads · Store Admin" },
      { name: "description", content: "Manage promotional banners shown on the storefront and order success page." },
    ],
  }),
});

function BannerAdsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-24">
      <header className="flex items-center gap-3">
        <Link to="/store-admin">
          <Button size="icon" variant="ghost" className="rounded-full" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[20px] font-bold tracking-tight sm:text-2xl">Banner Ads</h1>
            <p className="text-[12px] text-muted-foreground">Promotional banners for your storefront.</p>
          </div>
        </div>
      </header>

      <BannerAdsManager />
    </div>
  );
}
