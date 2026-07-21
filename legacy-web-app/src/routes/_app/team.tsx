import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { UserManagementPanel } from "@/components/user-management-panel";
import { useUserAccess } from "@/hooks/use-user-access";

export const Route = createFileRoute("/_app/team")({
  component: TeamPage,
});

function TeamPage() {
  const { isAdmin, loading } = useUserAccess();

  if (loading) {
    return <div className="mx-auto max-w-4xl p-6 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
        <h2 className="font-display text-xl font-semibold">Access Restricted</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only admins can manage the team.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-5 animate-in fade-in-0 duration-300">
      <div className="mb-5 px-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Team &amp; Access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage users, roles, shops and per-page permissions in one place.
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/30 p-3 sm:p-4">
        <UserManagementPanel />
      </div>
    </div>
  );
}
