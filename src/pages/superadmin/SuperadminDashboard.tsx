import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Store, DollarSign, ShieldAlert, Activity,
  Boxes, ArrowUpRight, Crown, Server, Lock,
} from "lucide-react";
import { modules } from "@/data/superadminData";
import { useScopedSuperadminStore } from "@/lib/superadminScope";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { useNavigate } from "react-router-dom";
import { useCatalogStore, nodePath } from "@/hooks/useCatalogStore";
import { portfolioSummary, licenseMix } from "@/lib/subscriptionSummary";
import { LicenseMixGrid } from "@/components/superadmin/LicenseMix";
import { ShieldCheck, Cpu, Sparkles, Plug } from "lucide-react";
import { CalendarClock, AlertTriangle, Gauge, Package, RefreshCw } from "lucide-react";

const KPI = ({
  label, value, sub, icon: Icon, accent = "blue", trend,
}: any) => {
  const accents: Record<string, string> = {
    blue: "from-[hsl(217,91%,60%)] to-[hsl(217,91%,45%)]",
    purple: "from-[hsl(262,60%,55%)] to-[hsl(262,60%,40%)]",
    teal: "from-[hsl(187,70%,42%)] to-[hsl(187,70%,32%)]",
    amber: "from-[hsl(32,95%,50%)] to-[hsl(32,95%,40%)]",
    red: "from-[hsl(4,84%,55%)] to-[hsl(4,84%,40%)]",
    green: "from-[hsl(142,60%,42%)] to-[hsl(142,60%,32%)]",
  };
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${accents[accent]} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-2">{sub}</div>}
      </CardContent>
    </Card>
  );
};

export default function SuperadminDashboard() {
  const navigate = useNavigate();
  const { session } = useSuperadminAuth();
  const { tenants, users, audit, guardrails, roles, locations } = useScopedSuperadminStore();

  const persona = session?.persona ?? "platform";
  const catalog = useCatalogStore();
  const ps = portfolioSummary(catalog, tenants.map((t) => t.id));
  const tName = (id: string) => tenants.find((t) => t.id === id)?.name ?? id;
  const mix = licenseMix(catalog, tenants.map((t) => t.id));
  const mc = (c: string) => mix.find((g) => g.category === c);
  const coreStores = mc("Ithina Core")?.items.find((i) => i.unit === "stores")?.qty ?? mc("Ithina Core")?.total ?? 0;
  const tMix = (id: string) => licenseMix(catalog, [id]);
  const recentAudits = audit.slice(0, 6);

  const totalStores = persona === "platform"
    ? tenants.reduce((s, t) => s + t.storesCount, 0)
    : locations.filter((l) => l.type === "Store").length;

  const totalRevenue = tenants.reduce((s, t) => s + (t.monthlyRevenue ?? 0), 0);
  const pendingApprovals = audit.filter((a) => a.result === "pending").length;
  const customRoles = roles.filter((r) => r.isCustom).length;
  const enabledModulesAvg = persona === "platform"
    ? modules.length
    : tenants[0]?.modules.length ?? 0;

  const personaTitle =
    persona === "platform" ? "Platform Overview"
    : persona === "organization" ? "Organization Overview"
    : "Workspace Overview";

  const headlineSub =
    persona === "platform" ? "Govern every tenant, module, role and approval rail across Ithina."
    : persona === "organization" ? `Manage users, roles, org tree and modules across ${session?.tenantName}.`
    : `Manage users and roles within your assigned scope at ${session?.tenantName}.`;

  const tArr = (id: string) => portfolioSummary(catalog, [id]);
  const topTenants = [...tenants].sort((a, b) => tArr(b.id).live - tArr(a.id).live).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-[hsl(217,91%,75%)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(217,91%,75%)] font-semibold">{personaTitle}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {persona === "platform" ? "Superadmin Dashboard"
              : persona === "organization" ? `${session?.tenantName} — Admin Dashboard`
              : `${session?.tenantName} — Tenant Dashboard`}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{headlineSub}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Workspace health</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-300 font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {persona === "platform" && (
          <KPI label="Active tenants" value={`${tenants.filter((t) => t.status === "active").length} / ${tenants.length}`} sub="across the platform" icon={Building2} accent="blue" />
        )}
        {persona !== "platform" && (
          <KPI label="Your tenant" value={session?.tenantName ?? "—"} sub={tenants[0]?.tier ?? "—"} icon={Building2} accent="blue" />
        )}
        <KPI label={persona === "platform" ? "Platform users" : "Users in scope"} value={users.length.toLocaleString()} sub={persona === "platform" ? "across all tenants" : "managed by you"} icon={Users} accent="purple" />
        <KPI label="Stores in scope" value={totalStores.toLocaleString()} sub={persona === "platform" ? `${tenants.length} tenants` : `${locations.filter((l) => l.type === "Region").length} regions`} icon={Store} accent="teal" />
        {persona === "platform" && (
          <KPI label="Active licences" value={ps.live} sub={`${ps.expired} expired`} icon={Package} accent="green" />
        )}
        {persona !== "platform" && (
          <KPI label="Org nodes" value={locations.length} sub="HQ · regions · stores" icon={Server} accent="green" />
        )}
        <KPI label="Ithina Core store licences" value={coreStores.toLocaleString()} sub={`${mc("Ithina Core")?.items.length ?? 0} core products`} icon={ShieldCheck} accent="teal" />
        <KPI label="Hardware units deployed" value={(mc("Hardware")?.total ?? 0).toLocaleString()} sub={mc("Hardware")?.items.map((i) => i.name).slice(0, 3).join(" · ") || "none"} icon={Cpu} accent="blue" />
        <KPI label="Maestro assistants in use" value={mc("Maestro")?.items.length ?? 0} sub={mc("Maestro")?.items.map((i) => i.name.replace(" Assistant", "")).join(" · ") || "none"} icon={Sparkles} accent="purple" />
        <KPI label="External apps connected" value={mc("External Apps")?.items.length ?? 0} sub={mc("External Apps")?.items.map((i) => i.name).join(" · ") || "none"} icon={Plug} accent="amber" />
        <KPI label="Renewals in 90 days" value={ps.renewals.length} sub={`${ps.renewals.filter((r) => !r.c.autoRenew).length} not on auto-renew`} icon={CalendarClock} accent="amber" />
        <KPI label="Mandatory product gaps" value={ps.gaps.length} sub={ps.gaps.length ? "customers non-compliant" : "all customers compliant"} icon={AlertTriangle} accent={ps.gaps.length ? "red" : "green"} />
      </div>


      {/* Licence portfolio */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-white text-base flex items-center gap-2"><Package className="h-4 w-4" /> Licences procured</CardTitle>
          <button onClick={() => navigate("/superadmin/subscriptions")} className="text-xs text-[hsl(217,91%,75%)] hover:underline">Subscriptions →</button>
        </CardHeader>
        <CardContent><LicenseMixGrid groups={mix} showTenants={persona === "platform"} /></CardContent>
      </Card>

      {/* Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Upcoming license renewals (90 days)</CardTitle>
            <button onClick={() => navigate("/superadmin/subscriptions")} className="text-xs text-[hsl(217,91%,75%)] hover:underline">Subscriptions →</button>
          </CardHeader>
          <CardContent className="space-y-2">
            {ps.renewals.length === 0 && <div className="text-sm text-slate-500 p-6 text-center">No renewals due in the next 90 days.</div>}
            {ps.renewals.slice(0, 6).map(({ c, k, d }) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="min-w-0">
                  <div className="text-sm text-white font-medium truncate">{tName(c.tenantId)} · {k.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{k.code} · {nodePath(catalog.nodes, k.nodeId)}</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className={`text-sm font-medium ${d! < 0 ? "text-[hsl(4,84%,75%)]" : d! <= 30 ? "text-[hsl(4,84%,75%)]" : "text-amber-300"}`}>
                    {d! < 0 ? "Overdue" : `${d} days`}
                  </div>
                  <div className="text-[11px] text-slate-400">{c.endDate} · {c.autoRenew ? "auto-renew" : "manual"}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3"><CardTitle className="text-white text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Attention needed</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              {ps.gaps.length === 0 && ps.highUsage.length === 0 && ps.expired === 0 && <div className="text-slate-500">Nothing needs attention.</div>}
              {ps.gaps.map((g) => (
                <div key={g.tenantId} onClick={() => navigate("/superadmin/tenants")} className="cursor-pointer p-2 rounded border border-[hsl(4,84%,55%)]/30 bg-[hsl(4,84%,55%)]/10 text-[hsl(4,84%,80%)]">
                  {tName(g.tenantId)} — missing mandatory {g.gaps.map((x) => x.name).join(", ")}
                </div>
              ))}
              {ps.highUsage.map(({ c, k }) => (
                <div key={c.id} className="p-2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-200 flex items-center gap-2">
                  <Gauge className="h-3 w-3" /> {tName(c.tenantId)} · {k.name} at {Math.round((c.used! / c.quantity) * 100)}% of license
                </div>
              ))}
              {ps.expired > 0 && <div className="p-2 rounded border border-white/10 bg-white/5 text-slate-300">{ps.expired} subscription(s) expired</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top tenants / your tenant */}
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base">
              {persona === "platform" ? "Tenants by licence footprint" : "Tenant snapshot"}
            </CardTitle>
            {persona === "platform" && (
              <button onClick={() => navigate("/superadmin/tenants")} className="text-xs text-[hsl(217,91%,75%)] hover:underline">
                Manage all →
              </button>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {topTenants.length === 0 && (
              <div className="text-sm text-slate-500 p-6 text-center">No tenant in scope.</div>
            )}
            {topTenants.map((t) => (
              <div key={t.id}
                onClick={() => persona === "platform" && navigate("/superadmin/tenants")}
                className={`flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 ${persona === "platform" ? "hover:bg-white/5 cursor-pointer" : ""} transition`}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)]/30 to-[hsl(262,60%,55%)]/30 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.industry} · {t.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-white font-medium">{tMix(t.id).find((g) => g.category === "Maestro")?.items.length ?? 0} assistants · {(tMix(t.id).find((g) => g.category === "Hardware")?.total ?? 0).toLocaleString()} devices</div>
                    <div className="text-[11px] text-slate-400">{tArr(t.id).live} subs · {t.storesCount.toLocaleString()} stores · {t.usersCount.toLocaleString()} users</div>
                  </div>
                  <Badge variant="outline" className="border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,75%)] text-[10px]">
                    {t.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base">Recent activity</CardTitle>
            <button onClick={() => navigate("/superadmin/audit")} className="text-xs text-[hsl(217,91%,75%)] hover:underline">
              Audit log →
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAudits.length === 0 && (
              <div className="text-sm text-slate-500 p-6 text-center">No activity in scope yet.</div>
            )}
            {recentAudits.map((a) => (
              <div key={a.id} className="flex items-start gap-2 text-xs border-b border-white/5 pb-2 last:border-0">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                  a.result === "success" ? "bg-emerald-400"
                  : a.result === "denied" ? "bg-[hsl(4,84%,55%)]"
                  : "bg-amber-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200">
                    <span className="font-medium">{a.actor}</span>
                    <span className="text-slate-400"> · {a.action}</span>
                  </div>
                  <div className="text-slate-500 truncate">{a.resource}</div>
                  <div className="text-slate-600 mt-0.5">{a.tenant} · {a.timestamp.split(" ")[1]}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tenants", icon: Building2, route: "/superadmin/tenants", section: "tenants" as const },
          { label: "Manage roles", icon: ShieldAlert, route: "/superadmin/roles", section: "roles" as const },
          { label: "Module access", icon: Boxes, route: "/superadmin/modules", section: "modules" as const },
          { label: "Org tree", icon: Server, route: "/superadmin/organization", section: "organization" as const },
        ]
          .filter((q) =>
            persona === "platform" ? true
            : persona === "organization" ? q.section !== "tenants" || tenants.length > 1
            : ["roles", "organization"].includes(q.section),
          )
          .map((q) => (
            <button key={q.label} onClick={() => navigate(q.route)}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[hsl(217,91%,60%)]/40 transition text-left flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[hsl(217,91%,60%)]/15 flex items-center justify-center">
                <q.icon className="h-4 w-4 text-[hsl(217,91%,75%)]" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{q.label}</div>
                <div className="text-[11px] text-slate-400">Quick action</div>
              </div>
            </button>
          ))}
      </div>

      {guardrails.length > 0 && persona !== "tenant" && (
        <div className="text-[11px] text-slate-500">
          {guardrails.length} guardrail rule{guardrails.length === 1 ? "" : "s"} in your scope.
        </div>
      )}
    </div>
  );
}
