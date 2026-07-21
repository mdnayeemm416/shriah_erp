import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useUserAccess } from "@/hooks/use-user-access";

export const Route = createFileRoute("/_app/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const access = useUserAccess();
  if (access.loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>;
  }
  return <Navigate to={access.primaryRoute as any} replace />;
}
