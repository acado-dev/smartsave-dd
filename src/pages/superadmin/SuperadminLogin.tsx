import { useEffect, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Building2, Users, ShieldCheck, ArrowRight } from "lucide-react";
import ithinaLogo from "@/assets/ithina-logo-white.png";
import { useSuperadminAuth, DEMO_ACCOUNTS } from "@/contexts/SuperadminAuthContext";
import { toast } from "sonner";

const personaIcon: Record<string, any> = {
  "Platform Super Admin": Crown,
  "Organization Admin": Building2,
  "Tenant Admin": Users,
};

function iconFor(label: string) {
  if (label.startsWith("Platform")) return Crown;
  if (label.startsWith("Organization")) return Building2;
  return Users;
}

export default function SuperadminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, session } = useSuperadminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as any)?.from ?? "/superadmin";

  if (session) {
    navigate(from, { replace: true });
  }

  const handleSubmit = (e: React.FormEvent, overrideEmail?: string) => {
    e.preventDefault();
    const target = (overrideEmail ?? email).trim();
    if (!target) {
      toast.error("Enter your email to continue.");
      return;
    }
    const res = signIn(target);
    if (!res.ok) {
      toast.error(res.error ?? "Sign-in failed.");
      return;
    }
    toast.success("Signed in to Superadmin Console");
    navigate(from, { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: "radial-gradient(circle at 20% 10%, hsl(217 91% 14% / 0.6), transparent 50%), hsl(222 47% 7%)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 w-full max-w-5xl">
        {/* Left — branding */}
        <div className="hidden lg:flex flex-col justify-between p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
          <div>
            <img src={ithinaLogo} alt="Ithina" className="h-10 w-auto object-contain mb-6" />
            <div className="text-[10px] uppercase tracking-[0.25em] text-[hsl(217,91%,75%)] font-semibold mb-2">
              Superadmin Console
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Govern every tenant, role and module from one rail.
            </h1>
            <p className="text-sm text-slate-400 mt-3 max-w-md">
              Sign in as a platform super admin, an organization admin, or a tenant admin — the workspace adapts to your scope automatically.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { i: Crown, l: "Platform", s: "All tenants" },
              { i: Building2, l: "Organization", s: "Your tenant" },
              { i: Users, l: "Tenant", s: "Your scope" },
            ].map((p) => (
              <div key={p.l} className="rounded-lg border border-white/10 p-3 bg-white/[0.02]">
                <p.i className="h-4 w-4 text-[hsl(217,91%,75%)] mb-2" />
                <div className="text-xs font-semibold text-white">{p.l}</div>
                <div className="text-[11px] text-slate-400">{p.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — sign-in card */}
        <Card className="bg-[hsl(222,47%,8%)] border-white/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-[hsl(217,91%,75%)]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[hsl(217,91%,75%)] font-semibold">
                Secure sign-in
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Sign in to Superadmin</h2>
            <p className="text-sm text-slate-400 mt-1">
              Access the platform, organization or tenant workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-500 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-xs">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-500 h-11"
                />
                <p className="text-[10px] text-slate-500">
                  Demo console — any password works. Workspace scope is derived from the email.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white font-medium"
              >
                Sign in
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Quick sign-in</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((a) => {
                const Icon = iconFor(a.label);
                return (
                  <button
                    key={a.email}
                    onClick={(e) => handleSubmit(e as any, a.email)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-[hsl(217,91%,60%)]/40 transition"
                  >
                    <div className="h-8 w-8 rounded-md bg-[hsl(217,91%,60%)]/15 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[hsl(217,91%,75%)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{a.label}</div>
                      <div className="text-[11px] text-slate-400 truncate">{a.email} · {a.sub}</div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
