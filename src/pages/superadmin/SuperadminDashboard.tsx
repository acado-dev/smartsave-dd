import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Store, DollarSign, ShieldAlert, Activity,
  TrendingUp, Boxes, ArrowUpRight, Crown, Server, Lock,
} from "lucide-react";
import { tenants, users, modules, auditLogs, platformMetrics, roles } from "@/data/superadminData";
import { useNavigate } from "react-router-dom";

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
  const recentAudits = auditLogs.slice(0, 6);
  const topTenants = [...tenants].sort((a, b) => b.usersCount - a.usersCount).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5 text-[hsl(217,91%,75%)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[hsl(217,91%,75%)] font-semibold">Platform Overview</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Superadmin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Govern every tenant, module, role and approval rail across Ithina.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Platform health</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-300 font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Active tenants" value={`${platformMetrics.activeTenants} / ${platformMetrics.totalTenants}`} sub="2 trial · 1 suspended" icon={Building2} accent="blue" trend="+1 this wk" />
        <KPI label="Platform users" value={platformMetrics.totalUsers.toLocaleString()} sub="across all tenants" icon={Users} accent="purple" trend="+184 / 30d" />
        <KPI label="Stores under mgmt" value={platformMetrics.totalStores.toLocaleString()} sub="9 countries" icon={Store} accent="teal" />
        <KPI label="MRR" value={`$${(platformMetrics.monthlyRevenue / 1000).toFixed(1)}k`} sub="recurring" icon={DollarSign} accent="green" trend="+12.4%" />
        <KPI label="Pending approvals" value={platformMetrics.pendingApprovals} sub="across guardrails" icon={ShieldAlert} accent="amber" />
        <KPI label="Guardrails fired (24h)" value={platformMetrics.guardrailsTriggered24h} sub="3 escalations" icon={Activity} accent="red" />
        <KPI label="Custom roles" value={roles.filter(r => r.isCustom).length} sub={`of ${roles.length} total`} icon={Lock} accent="purple" />
        <KPI label="Modules deployed" value={modules.length} sub="enabled per tenant" icon={Boxes} accent="teal" />
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top tenants */}
        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-white text-base">Top tenants by users</CardTitle>
            <button onClick={() => navigate("/superadmin/tenants")} className="text-xs text-[hsl(217,91%,75%)] hover:underline">
              Manage all →
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {topTenants.map((t) => (
              <div key={t.id}
                onClick={() => navigate("/superadmin/tenants")}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 cursor-pointer transition">
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
                    <div className="text-sm text-white font-medium">{t.usersCount.toLocaleString()} users</div>
                    <div className="text-[11px] text-slate-400">{t.storesCount.toLocaleString()} stores</div>
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
          { label: "Provision tenant", icon: Building2, route: "/superadmin/tenants" },
          { label: "Manage roles", icon: ShieldAlert, route: "/superadmin/roles" },
          { label: "Module access", icon: Boxes, route: "/superadmin/modules" },
          { label: "View org tree", icon: Server, route: "/superadmin/organization" },
        ].map((q) => (
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
    </div>
  );
}
