import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // Sensible global defaults to reduce duplicate Supabase queries and
  // unnecessary refetches that were causing UI lag. Mutations still call
  // queryClient.invalidateQueries(...) explicitly, so data freshness on
  // user actions is preserved.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,       // 5-min dashboard cache; mutations explicitly invalidate
        gcTime: 30 * 60_000,         // keep cache warm between page returns
        refetchOnMount: false,
        refetchOnWindowFocus: false, // don't refetch on tab focus
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch routes on hover/touch so navigations feel instant.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
