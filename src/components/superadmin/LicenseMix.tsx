import { Cpu, ShieldCheck, Sparkles, Plug } from "lucide-react";
import type { LicenseGroup } from "@/lib/subscriptionSummary";

const meta: Record<string, { icon: any; tone: string; label: string }> = {
  "Ithina Core": { icon: ShieldCheck, tone: "187 70% 42%", label: "Core licences" },
  Hardware: { icon: Cpu, tone: "217 91% 60%", label: "Hardware" },
  Maestro: { icon: Sparkles, tone: "262 60% 55%", label: "Maestro assistants" },
  "External Apps": { icon: Plug, tone: "32 95% 50%", label: "External apps" },
};
const m = (c: string) => meta[c] ?? { icon: Plug, tone: "215 20% 50%", label: c };

/** Full four-column licence portfolio (dashboard + tenant detail). */
export function LicenseMixGrid({ groups, showTenants }: { groups: LicenseGroup[]; showTenants?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {groups.map((g) => {
        const { icon: Icon, tone } = m(g.category);
        return (
          <div key={g.category} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: `hsl(${tone} / 0.18)` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: `hsl(${tone})` }} />
              </div>
              <div className="text-sm font-semibold text-white">{g.category}</div>
              <span className="ml-auto text-[10px] text-slate-400">{g.items.length} product{g.items.length === 1 ? "" : "s"}</span>
            </div>
            {g.items.length === 0 && <div className="text-[11px] text-slate-500 py-2">Not procured</div>}
            <div className="space-y-2">
              {g.items.map((i) => (
                <div key={i.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 truncate">{i.name}</span>
                    <span className="text-white font-medium shrink-0 ml-2">{i.qty.toLocaleString()} <span className="text-slate-500 font-normal">{i.unit}</span></span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {i.skus.join(", ")}{showTenants ? ` · ${i.tenants} customer${i.tenants === 1 ? "" : "s"}` : ""}{i.used ? ` · ${Math.round((i.used / Math.max(1, i.qty)) * 100)}% used` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Compact chips for tenant cards. */
export function LicenseMixChips({ groups }: { groups: LicenseGroup[] }) {
  return (
    <div className="space-y-1.5 mb-3">
      {groups.map((g) => {
        const { icon: Icon, tone } = m(g.category);
        return (
          <div key={g.category} className="flex items-start gap-2 text-[11px]">
            <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: `hsl(${tone})` }} />
            <span className="text-slate-500 w-20 shrink-0">{g.category}</span>
            <div className="flex flex-wrap gap-1">
              {g.items.length === 0 ? <span className="text-slate-600">—</span> : g.items.map((i) => (
                <span key={i.name} className="px-1.5 py-0.5 rounded border text-slate-200"
                  style={{ borderColor: `hsl(${tone} / 0.35)`, background: `hsl(${tone} / 0.1)` }}>
                  {i.name}{g.category === "Hardware" || g.category === "Ithina Core" ? ` ×${i.qty.toLocaleString()}` : ""}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
