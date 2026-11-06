import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { modules, type ModuleKey, type Tenant } from "@/data/superadminData";
import { Boxes, Building2, Layers, Lock, Network, Store } from "lucide-react";
import { toast } from "sonner";
import { superadminActions } from "@/hooks/useSuperadminStore";
import { useScopedSuperadminStore as useSuperadminStore } from "@/lib/superadminScope";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { useCatalogStore, effectiveStatus } from "@/hooks/useCatalogStore";

const GROUPS = ["Platform", "Assistants", "Operations"] as const;
/** Catalogue product node that licenses each module (null = no licence needed). */
const LICENCE_NODE: Record<ModuleKey, string | null> = {
  core: "c-core", maestro: "c-maestro", pac: "p-pac", perishables: "p-perish",
  planogram: "p-plano", promotions: "p-promo", admin: null, dis: null,
};
const dependents = (k: ModuleKey): ModuleKey[] =>
  modules.filter((m) => m.requires?.includes(k)).flatMap((m) => [m.key, ...dependents(m.key)]);

const ROLLOUT_KEY = "ithina.moduleRollout.v1";
type Rollout = Record<string, ModuleKey[]>; // storeId -> disabled modules
const loadRollout = (): Rollout => { try { return JSON.parse(localStorage.getItem(ROLLOUT_KEY) || "{}"); } catch { return {}; } };

export default function ModuleAccess() {
  usePersonaGuard("modules");
  const { tenants } = useSuperadminStore();
  const { session } = useSuperadminAuth();
  const isPlatform = !session || session.persona === "platform";
  const [view, setView] = useState<"org" | "tenant">(isPlatform ? "org" : "tenant");
  const [tenantId, setTenantId] = useState(session?.tenantId && !isPlatform ? session.tenantId : tenants[0]?.id ?? "");
  const tenant = tenants.find((t) => t.id === tenantId) ?? tenants[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Module Access</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ithina Core, Maestro, the four assistants, Admin and DIS. Disabling a module revokes its role permissions and anything that depends on it.
          </p>
        </div>
        {isPlatform && (
          <div className="flex rounded-lg border border-white/10 p-1 text-sm">
            {([["org", "All organisations", Network], ["tenant", "Single tenant", Building2]] as const).map(([k, l, I]) => (
              <button key={k} onClick={() => setView(k)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${view === k ? "bg-[hsl(187,70%,42%)]/20 text-white" : "text-slate-400 hover:text-white"}`}>
                <I className="h-4 w-4" />{l}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === "org" && isPlatform
        ? <OrgMatrix tenants={tenants} onOpen={(id) => { setTenantId(id); setView("tenant"); }} />
        : tenant && <TenantView tenant={tenant} tenants={tenants} canPick={isPlatform} onPick={setTenantId}
            canToggleTenant={session?.persona !== "tenant"} />}
    </div>
  );
}

function setModule(t: Tenant, k: ModuleKey, on: boolean) {
  const m = modules.find((x) => x.key === k)!;
  if (!on && m.mandatory) return toast.error(`${m.name} is mandatory and cannot be disabled`);
  if (on) {
    const missing = (m.requires ?? []).filter((r) => !t.modules.includes(r));
    missing.forEach((r) => superadminActions.toggleModule(t.id, r, true));
    superadminActions.toggleModule(t.id, k, true);
    if (missing.length) toast.info(`Also enabled ${missing.map((r) => modules.find((x) => x.key === r)?.name).join(", ")}`);
  } else {
    const deps = dependents(k).filter((d) => t.modules.includes(d));
    [k, ...deps].forEach((d) => superadminActions.toggleModule(t.id, d, false));
    if (deps.length) toast.info(`Also disabled ${deps.map((d) => modules.find((x) => x.key === d)?.name).join(", ")}`);
  }
}

function OrgMatrix({ tenants, onOpen }: { tenants: Tenant[]; onOpen: (id: string) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {modules.map((m) => {
          const n = tenants.filter((t) => t.modules.includes(m.key)).length;
          return (
            <Card key={m.key} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `hsl(${m.color} / 0.2)` }}>
                  <Boxes className="h-4 w-4" style={{ color: `hsl(${m.color})` }} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white flex items-center gap-1">{m.name}{m.mandatory && <Lock className="h-3 w-3 text-amber-300" />}</div>
                  <div className="text-[11px] text-slate-500">{m.group}</div>
                  <div className="text-[11px] text-slate-400 mt-1"><span className="text-white font-medium">{n}</span> / {tenants.length} tenants</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium sticky left-0 bg-[hsl(222,47%,9%)]">Organisation</th>
                {modules.map((m) => <th key={m.key} className="text-center px-2 py-3 font-medium min-w-[96px]">{m.name.replace(" Assistant", "")}</th>)}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 sticky left-0 bg-[hsl(222,47%,9%)] border-r border-white/5">
                    <button onClick={() => onOpen(t.id)} className="text-left">
                      <div className="text-white text-sm hover:underline">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.tier} · {t.storesCount.toLocaleString()} stores</div>
                    </button>
                  </td>
                  {modules.map((m) => (
                    <td key={m.key} className="px-2 py-3 text-center">
                      <Switch checked={t.modules.includes(m.key)} disabled={m.mandatory && t.modules.includes(m.key)}
                        onCheckedChange={(v) => setModule(t, m.key, !!v)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}

function TenantView({ tenant, tenants, canPick, onPick, canToggleTenant }: {
  tenant: Tenant; tenants: Tenant[]; canPick: boolean; onPick: (id: string) => void; canToggleTenant: boolean;
}) {
  const { locations } = useSuperadminStore();
  const catalog = useCatalogStore();
  const [rollout, setRollout] = useState<Rollout>(loadRollout);
  useEffect(() => { localStorage.setItem(ROLLOUT_KEY, JSON.stringify(rollout)); }, [rollout]);

  const licensed = (k: ModuleKey) => {
    const node = LICENCE_NODE[k]; if (!node) return null;
    const under = (id: string) => { let c = catalog.nodes.find((x) => x.id === id); while (c) { if (c.id === node) return true; c = catalog.nodes.find((x) => x.id === c!.parentId); } return false; };
    return catalog.customerProducts.some((cp) => cp.tenantId === tenant.id && ["active", "pending"].includes(effectiveStatus(cp))
      && under(catalog.skus.find((s) => s.id === cp.skuId)?.nodeId ?? ""));
  };
  const stores = useMemo(() => locations.filter((l) => l.tenantId === tenant.id && l.type === "Store"), [locations, tenant.id]);
  const enabled = modules.filter((m) => tenant.modules.includes(m.key));
  const toggleStore = (sid: string, k: ModuleKey, on: boolean) =>
    setRollout((r) => { const cur = r[sid] ?? []; return { ...r, [sid]: on ? cur.filter((x) => x !== k) : [...cur, k] }; });

  return (
    <div className="space-y-5">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-[hsl(187,70%,42%)]/20 flex items-center justify-center"><Building2 className="h-5 w-5 text-[hsl(187,70%,52%)]" /></div>
          <div className="flex-1 min-w-[180px]">
            {canPick ? (
              <select value={tenant.id} onChange={(e) => onPick(e.target.value)}
                className="bg-transparent text-white text-lg font-semibold border border-white/10 rounded px-2 py-1">
                {tenants.map((t) => <option key={t.id} value={t.id} className="bg-[hsl(222,47%,10%)]">{t.name}</option>)}
              </select>
            ) : <div className="text-lg font-semibold text-white">{tenant.name}</div>}
            <div className="text-xs text-slate-400 mt-0.5">{tenant.tier} · {tenant.country} · {tenant.storesCount.toLocaleString()} stores</div>
          </div>
          <div className="flex gap-6 text-center">
            <div><div className="text-xl font-bold text-white">{enabled.length}/{modules.length}</div><div className="text-[11px] text-slate-400">modules on</div></div>
            <div><div className="text-xl font-bold text-white">{enabled.filter((m) => m.group === "Assistants").length}/4</div><div className="text-[11px] text-slate-400">assistants</div></div>
            <div><div className="text-xl font-bold text-amber-300">{enabled.filter((m) => licensed(m.key) === false).length}</div><div className="text-[11px] text-slate-400">on without licence</div></div>
          </div>
        </CardContent>
      </Card>

      {GROUPS.map((g) => (
        <div key={g}>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" />{g}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {modules.filter((m) => m.group === g).map((m) => {
              const on = tenant.modules.includes(m.key);
              const lic = licensed(m.key);
              return (
                <Card key={m.key} className={`border ${on ? "bg-white/[0.06] border-white/15" : "bg-white/[0.02] border-white/5"}`}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: `hsl(${m.color} / 0.2)` }}>
                          <Boxes className="h-4 w-4" style={{ color: `hsl(${m.color})` }} />
                        </div>
                        <div className="text-sm font-semibold text-white">{m.name}</div>
                      </div>
                      <Switch checked={on} disabled={!canToggleTenant || (m.mandatory && on)} onCheckedChange={(v) => setModule(tenant, m.key, !!v)} />
                    </div>
                    <div className="text-[11px] text-slate-400 min-h-[30px]">{m.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {m.mandatory && <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">Mandatory</Badge>}
                      {m.requires?.map((r) => <Badge key={r} variant="outline" className="border-white/15 text-slate-400 text-[10px]">Needs {modules.find((x) => x.key === r)?.name}</Badge>)}
                      {lic === true && <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">Licensed</Badge>}
                      {lic === false && <Badge variant="outline" className={`text-[10px] ${on ? "border-red-500/40 text-red-300" : "border-white/10 text-slate-500"}`}>No licence</Badge>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Store className="h-4 w-4 text-[hsl(187,70%,52%)]" />
            <span className="text-sm font-semibold text-white">Store-level rollout</span>
            <span className="text-[11px] text-slate-500">Switch enabled modules off for individual stores</span>
          </div>
          {stores.length === 0 ? <div className="p-4 text-sm text-slate-500">No stores in the organisation tree for this tenant yet.</div> : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/10">
                  <tr><th className="text-left px-4 py-2 font-medium">Store</th>
                    {enabled.map((m) => <th key={m.key} className="px-2 py-2 font-medium text-center min-w-[90px]">{m.name.replace(" Assistant", "")}</th>)}</tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="px-4 py-2 text-white">{s.name}{s.code && <span className="text-[10px] text-slate-500 ml-1">{s.code}</span>}</td>
                      {enabled.map((m) => (
                        <td key={m.key} className="px-2 py-2 text-center">
                          <Switch checked={!(rollout[s.id] ?? []).includes(m.key)} disabled={m.mandatory}
                            onCheckedChange={(v) => toggleStore(s.id, m.key, !!v)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
