import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { erpPasswordLogin } from "@/lib/login.functions";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Wallet, Mail, MessageCircle, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const REMEMBER_KEY = "shriah.remember.identifier";

function LoginPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const loginFn = useServerFn(erpPasswordLogin);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_KEY) : null;
    if (saved) {
      setIdentifier(saved);
      setRemember(true);
    }
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (user) return <Navigate to="/" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = identifier.trim();
    if (!id || password.length < 1) {
      toast.error("Enter your account and password");
      return;
    }
    setBusy(true);
    try {
      const login = await loginFn({ data: { identifier: id, password } });
      if (!login.ok || !login.email) {
        toast.error("Wrong username or password.");
        setBusy(false);
        return;
      }

      const { error } = login.token_hash
        ? await supabase.auth.verifyOtp({ type: "magiclink", token_hash: login.token_hash })
        : await supabase.auth.verifyOtp({ email: login.email.toLowerCase(), token: login.otp!, type: "magiclink" });
      if (error) {
        throw new Error("Could not create session. Try again.");
      }

      // Reset failed counter on success
      supabase.rpc("reset_failed_login").then(() => {});

      if (remember) localStorage.setItem(REMEMBER_KEY, id);
      else localStorage.removeItem(REMEMBER_KEY);

      nav({ to: "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 px-4 py-8">
      <Card className="w-full max-w-md bg-card p-8 shadow-[var(--shadow-elegant)]">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight">ShRiAh Group</h1>
            <p className="text-sm text-muted-foreground">Finance & Warehouse</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="identifier">Account</Label>
            <Input
              id="identifier"
              type="text"
              autoComplete="username"
              placeholder="Username / Email / Mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pe-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
            Remember me on this device
          </label>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 space-y-2 border-t border-border/60 pt-5 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            For Sign Up Please Contact Admin AhsAN
          </p>
          <div className="flex flex-col items-center gap-2 text-sm">
            <a
              href="mailto:aahsanuh62@gmail.com"
              className="inline-flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              aahsanuh62@gmail.com
            </a>
            <a
              href="https://wa.me/966553687388"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              <MessageCircle className="h-4 w-4" />
              +966 55 368 7388
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
