import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { modules } from "@/data/superadminData";
import { Boxes, Check, X } from "lucide-react";
import { useSuperadminStore, superadminActions } from "@/hooks/useSuperadminStore";

export default function ModuleAccess() {
  const { tenants } = useSuperadminStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Module Access</h1>
        <p className="text-sm text-slate-400 mt-1">
          Enable or disable Ithina modules per tenant. Disabling instantly revokes all related role permissions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {modules.map((m) => {
          const enabledCount = tenants.filter((t) => t.modules.includes(m.key)).length;
          return (
            <Card key={m.key} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(${m.color} / 0.2)` }}>
                    <Boxes className="h-5 w-5" style={{ color: `hsl(${m.color})` }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{m.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{m.description}</div>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Enabled in <span className="text-white font-medium">{enabledCount}</span> / {tenants.length} tenants
                    </div>
                  </div>
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
                <th className="text-left px-4 py-3 font-medium sticky left-0 bg-[hsl(222,47%,9%)]">Tenant</th>
                {modules.map((m) => (
                  <th key={m.key} className="text-center px-3 py-3 font-medium min-w-[120px]">{m.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 sticky left-0 bg-[hsl(222,47%,9%)] border-r border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-gradient-to-br from-[hsl(217,91%,60%)]/30 to-[hsl(262,60%,55%)]/30 flex items-center justify-center text-[10px] font-bold text-white">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white text-sm">{t.name}</div>
                        <div className="text-[10px] text-slate-500">{t.tier}</div>
                      </div>
                    </div>
                  </td>
                  {modules.map((m) => {
                    const enabled = t.modules.includes(m.key);
                    return (
                      <td key={m.key} className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(v) => superadminActions.toggleModule(t.id, m.key, !!v)}
                          />
                          {enabled
                            ? <Check className="h-3 w-3 text-emerald-400" />
                            : <X className="h-3 w-3 text-slate-600" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
