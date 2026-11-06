import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScopedSuperadminStore } from "@/lib/superadminScope";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { useCatalogStore, nodePath, isMandatory, mandatoryGaps, effectiveStatus, daysUntil, type CustomerProduct } from "@/hooks/useCatalogStore";
import { MappingDialog, SubscriptionDetailDialog, UsageBar, ExpiryText, statusStyle, selectCls } from "@/components/superadmin/CustomerProductsPanel";
import { Plus, Search, CreditCard, AlertTriangle, CalendarClock, Gauge, ShieldCheck, Eye, Pencil } from "lucide-react";

export default function SubscriptionsPage() {
  usePersonaGuard("subscriptions");
  const { tenants } = useScopedSuperadminStore();
  const store = useCatalogStore();
  const { skus, nodes, customerProducts } = store;
  const { session } = useSuperadminAuth();
  const isPlatform = !session || session.persona === "platform";
  const [q, setQ] = useState("");
  const [tenantF, setTenantF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [mapOpen, setMapOpen] = useState(false);
  const [edit, setEdit] = useState<CustomerProduct | null>(null);
  const [view, setView] = useState<CustomerProduct | null>(null);

  const tenantIds = new Set(tenants.map((t) => t.id));
  const tName = (id: string) => tenants.find((t) => t.id === id)?.name ?? id;
  const topCats = nodes.filter((x) => x.parentId === null);
  const catOf = (nodeId: string) => { let c = nodes.find((x) => x.id === nodeId); while (c?.parentId) c = nodes.find((x) => x.id === c!.parentId); return c?.id ?? ""; };

  const scoped = customerProducts.filter((c) => tenantIds.has(c.tenantId));
  const rows = useMemo(() => scoped.filter((c) => {
    const sku = skus.find((s) => s.id === c.skuId);
    if (!sku) return false;
    const st = effectiveStatus(c);
    const d = daysUntil(c.endDate);
    if (tenantF !== "all" && c.tenantId !== tenantF) return false;
    if (catF !== "all" && catOf(sku.nodeId) !== catF) return false;
    if (statusF === "expiring" ? !(st === "active" && d !== null && d >= 0 && d <= 60) : statusF === "mandatory" ? !isMandatory(nodes, sku.nodeId) : statusF !== "all" && st !== statusF) return false;
    const hay = `${sku.name} ${sku.code} ${tName(c.tenantId)} ${c.orderRef}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }), [scoped, skus, tenantF, catF, statusF, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const subsActive = scoped.filter((c) => effectiveStatus(c) === "active" && skus.find((s) => s.id === c.skuId)?.billing === "subscription");
  const expiring = scoped.filter((c) => { const d = daysUntil(c.endDate); return effectiveStatus(c) === "active" && d !== null && d >= 0 && d <= 60; });
  const highUsage = scoped.filter((c) => effectiveStatus(c) === "active" && (c.used ?? 0) / c.quantity >= 0.9);
  const mrr = subsActive.reduce((a, c) => { const k = skus.find((s) => s.id === c.skuId)!; return a + (k.term === "annual" ? (k.price * c.quantity) / 12 : k.price * c.quantity); }, 0);
  const gaps = tenants.map((t) => ({ t, g: mandatoryGaps(store, t.id) })).filter((x) => x.g.length > 0);

  const kpis = [
    { label: "Active subscriptions", value: subsActive.length, icon: CreditCard, tone: "text-[hsl(187,70%,62%)]" },
    { label: "Recurring value / month", value: `€${Math.round(mrr).toLocaleString()}`, icon: Gauge, tone: "text-white" },
    { label: "Expiring in 60 days", value: expiring.length, icon: CalendarClock, tone: "text-amber-300" },
    { label: "Usage ≥ 90%", value: highUsage.length, icon: AlertTriangle, tone: "text-[hsl(4,84%,70%)]" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
          <p className="text-sm text-slate-400">Products and subscriptions held by {isPlatform ? "every organisation and tenant" : "your organisation"}, from the E-Com portal and Salesforce.</p>
        </div>
        {isPlatform && <Button onClick={() => setMapOpen(true)} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white"><Plus className="h-4 w-4 mr-1.5" /> Map subscription</Button>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">{k.label}<k.icon className="h-4 w-4" /></div>
            <div className={`text-2xl font-semibold mt-1 ${k.tone}`}>{k.value}</div>
          </CardContent></Card>
        ))}
      </div>

      <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-white mb-2">
          {gaps.length ? <AlertTriangle className="h-4 w-4 text-amber-300" /> : <ShieldCheck className="h-4 w-4 text-emerald-300" />}
          Mandatory product compliance
        </div>
        {gaps.length === 0 ? <div className="text-xs text-slate-400">Every customer holds all mandatory products (e.g. Ithina Core).</div> : (
          <div className="space-y-1.5">
            {gaps.map(({ t, g }) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 text-xs p-2 rounded border border-amber-500/30 bg-amber-500/5">
                <span className="text-slate-200">{t.name} <span className="text-slate-400">is missing</span> <span className="text-amber-300">{g.map((x) => x.name).join(", ")}</span></span>
                {isPlatform && <Button size="sm" className="h-6 text-xs bg-white/10 hover:bg-white/15 text-white" onClick={() => { setTenantF(t.id); setMapOpen(true); }}>Map now</Button>}
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, SKU, customer, order…" className="pl-9 bg-white/5 border-white/10 text-slate-200" />
        </div>
        {tenants.length > 1 && (
          <select className={`${selectCls} !w-44`} value={tenantF} onChange={(e) => setTenantF(e.target.value)}>
            <option value="all">All customers</option>{tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
        <select className={`${selectCls} !w-44`} value={catF} onChange={(e) => setCatF(e.target.value)}>
          <option value="all">All categories</option>{topCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={`${selectCls} !w-44`} value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option>
          <option value="expiring">Expiring ≤ 60 days</option><option value="expired">Expired</option><option value="cancelled">Cancelled</option>
          <option value="mandatory">Mandatory only</option>
        </select>
      </div>

      <Card className="bg-white/[0.03] border-white/10 overflow-hidden"><div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/10">
            <tr>{["Customer", "Product / SKU", "Type", "Subscribed", "Expiry", "Usage", "Status", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2.5">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const sku = skus.find((s) => s.id === c.skuId)!;
              const st = effectiveStatus(c);
              return (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-3 py-2.5 text-slate-200">{tName(c.tenantId)}<div className="text-[11px] text-slate-500">{c.source} · {c.orderRef}</div></td>
                  <td className="px-3 py-2.5">
                    <div className="text-white flex items-center gap-1.5">{sku.name}{isMandatory(nodes, sku.nodeId) && <Badge variant="outline" className="h-4 px-1 text-[9px] border-amber-500/40 text-amber-300">MANDATORY</Badge>}</div>
                    <div className="text-[11px] text-slate-500"><span className="font-mono">{sku.code}</span> · {nodePath(nodes, sku.nodeId)}</div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-300">{sku.billing === "subscription" ? sku.term : "one-time"}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-300 whitespace-nowrap">{c.startDate}</td>
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap"><ExpiryText endDate={c.endDate} /></td>
                  <td className="px-3 py-2.5 text-xs text-slate-300"><div>{(c.used ?? 0).toLocaleString()} / {c.quantity.toLocaleString()} {c.usageUnit}</div><UsageBar used={c.used} total={c.quantity} /></td>
                  <td className="px-3 py-2.5"><Badge variant="outline" className={statusStyle[st]}>{st}</Badge></td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <button onClick={() => setView(c)} className="text-slate-400 hover:text-white mr-3" aria-label="View details"><Eye className="h-4 w-4" /></button>
                    {isPlatform && <button onClick={() => setEdit(c)} className="text-slate-400 hover:text-white" aria-label="Edit"><Pencil className="h-4 w-4" /></button>}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-500 text-sm">No subscriptions match these filters.</td></tr>}
          </tbody>
        </table>
      </div></Card>

      {mapOpen && <MappingDialog tenants={tenantF !== "all" ? tenants.filter((t) => t.id === tenantF) : tenants} onClose={() => setMapOpen(false)} />}
      {edit && <MappingDialog cp={edit} tenantId={edit.tenantId} onClose={() => setEdit(null)} />}
      {view && <SubscriptionDetailDialog cp={view} tenantName={tName(view.tenantId)} onClose={() => setView(null)} />}
    </div>
  );
}
