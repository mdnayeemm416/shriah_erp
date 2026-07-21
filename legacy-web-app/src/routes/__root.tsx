import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { ConfirmProvider } from "@/hooks/use-confirm";
import { initPushNotifications } from "@/lib/push-notifications";
import { InvoiceHostsBridge } from "@/components/invoice-hosts-bridge";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <a href="/" className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0b0b10" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "ShRiAh ERP" },
      { name: "mobile-web-app-capable", content: "yes" },
      { title: "ShRiAh Group — Finance & Warehouse" },
      { name: "description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { property: "og:title", content: "ShRiAh Group — Finance & Warehouse" },
      { name: "twitter:title", content: "ShRiAh Group — Finance & Warehouse" },
      { property: "og:description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { name: "twitter:description", content: "Track cash flow across shops, warehouse and bank for ShRiAh Group." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ee260a05-2ec1-4bac-80ce-e2f5bf4e2315/id-preview-b2b13fec--f7979160-307f-4af8-9e51-6bc04fb421b3.lovable.app-1779027285674.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ee260a05-2ec1-4bac-80ce-e2f5bf4e2315/id-preview-b2b13fec--f7979160-307f-4af8-9e51-6bc04fb421b3.lovable.app-1779027285674.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Roboto:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;700;900&family=Noto+Naskh+Arabic:wght@400;500;700&family=Cairo:wght@400;500;700;900&family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        if (event === "INITIAL_SESSION") void initPushNotifications();
        return;
      }

      if (event === "SIGNED_OUT") {
        queryClient.clear();
      } else {
        if (event === "SIGNED_IN") void initPushNotifications();
        queryClient.invalidateQueries({ refetchType: "inactive" });
      }
      router.invalidate();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <ConfirmProvider>
              <Outlet />
              <InvoiceHostsBridge />
              <Toaster richColors position="top-right" />
            </ConfirmProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
