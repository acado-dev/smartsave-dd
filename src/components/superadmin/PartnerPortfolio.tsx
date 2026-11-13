import { Link } from "react-router-dom";
import { Handshake, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Partner, Tenant } from "@/data/superadminData";
import type { CustomerProduct, Sku } from "@/hooks/useCatalogStore";
import { partnerReport } from "@/lib/partnerReporting";

export function PartnerPortfolio({ partners, tenants, products, skus, platform, compact = false, onPartner }: {
  partners: Partner[]; tenants: Tenant[]; products: CustomerProduct[]; skus: Sku[];
  platform: boolean; compact?: boolean; onPartner?: (id: string) => void;
}) {
  const reports = partners.map(p => ({ p, r: partnerReport(p, tenants, products, skus) })).filter(({ r }) => r.customers.length > 0);
  const sourced = tenants.filter(t => t.salesChannel === "partner");
  const stats = [
    ["Partners with customers", reports.length],
    ["Partner-sourced tenants", sourced.length],
    ["Partner-sourced stores", sourced.reduce((s, t) => s + t.storesCount, 0)],
    ["Partner renewals ≤90 days", reports.reduce((s, { r }) => s + r.renewals.length, 0)],
  ] as const;
  return <section className="text-foreground space-y-4 border-y border-border py-5" aria-label="Partner contribution">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-foreground flex items-center gap-2"><Handshake className="h-4 w-4 text-accent" />Partner contribution{!platform && " in your organization"}</h2>
      {platform && <Button asChild variant="outline" size="sm"><Link to="/superadmin/partners">Partner Master<ArrowUpRight className="h-4 w-4 ml-2" /></Link></Button>}
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(([label, value]) => <div key={label} className="min-w-0"><div className="text-xl font-bold text-foreground">{value.toLocaleString()}</div><div className="text-xs text-muted-foreground">{label}</div></div>)}</div>
    <p className="text-xs text-muted-foreground">{tenants.length - sourced.length} direct tenants · {sourced.filter(t => (t.storeFormat ?? (t.storesCount === 1 ? "single" : "chain")) === "chain").length} partner chains · {sourced.filter(t => (t.storeFormat ?? (t.storesCount === 1 ? "single" : "chain")) === "single").length} partner single-store customers</p>
    {compact ? <div className="flex flex-wrap gap-2">{reports.map(({ p, r }) => <Button key={p.id} variant="outline" size="sm" className="h-auto whitespace-normal text-left py-2" onClick={() => onPartner?.(p.id)}>{p.name} · {r.customers.length} tenants · {r.stores.toLocaleString()} stores</Button>)}</div> : <div className="overflow-x-auto">
      <table className="w-full text-sm"><thead><tr className="border-b border-border text-muted-foreground">{["Partner / channel", "Tenants / stores", "Products / subscriptions", "Renewals / expired"].map(h => <th key={h} className="text-left p-3 whitespace-nowrap font-medium">{h}</th>)}</tr></thead>
      <tbody>{reports.sort((a, b) => b.r.stores - a.r.stores).map(({ p, r }) => <tr key={p.id} className="border-b border-border align-top">
        <td className="p-3 min-w-56">{platform ? <Button asChild variant="link" className="h-auto p-0 whitespace-normal text-left"><Link to={`/superadmin/partners?partner=${encodeURIComponent(p.id)}`}>{p.name}</Link></Button> : <span className="font-medium text-foreground">{p.name}</span>}<div className="text-xs text-muted-foreground mt-1">{p.type} · {p.country || "—"} <Badge variant="outline">{p.status}</Badge></div></td>
        <td className="p-3 whitespace-nowrap">{r.customers.length} tenants · {r.stores.toLocaleString()} stores<div className="text-xs text-muted-foreground">{r.chains} chains · {r.singleStores} single stores</div></td>
        <td className="p-3 whitespace-nowrap">{r.products} active products<div className="text-xs text-muted-foreground">{r.subscriptions} active subscriptions</div></td>
        <td className="p-3 whitespace-nowrap"><span className={r.renewals.length ? "text-warning" : "text-foreground"}>{r.renewals.length} renewing ≤90d</span><div className="text-xs text-muted-foreground">{r.expired} expired licences</div></td>
      </tr>)}</tbody></table>
      {reports.length === 0 && <p className="text-sm text-muted-foreground py-4">No partner-linked tenants in this workspace.</p>}
    </div>}
    {sourced.some(t => !partners.some(p => p.id === t.partnerId)) && <p className="text-xs text-warning">Some partner-sourced tenants have no linked partner master record.</p>}
  </section>;
}