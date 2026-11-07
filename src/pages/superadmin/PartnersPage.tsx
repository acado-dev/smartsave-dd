import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, ArrowLeft, Building2, Store, Package, CalendarClock, AlertTriangle, Download } from "lucide-react";
import type { Partner } from "@/data/superadminData";
import { useSuperadminStore } from "@/hooks/useSuperadminStore";
import { useCatalogStore, nodePath, isMandatory } from "@/hooks/useCatalogStore";
import { partnerReport } from "@/lib/partnerReporting";
import { licenseMix, hardwareStats, coreDeployment } from "@/lib/subscriptionSummary";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";
import { LicenseMixGrid } from "@/components/superadmin/LicenseMix";
import { PartnerFormDialog } from "@/components/superadmin/PartnerFormDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function Stat({ label, value }: { label: string; value: string | number }) { return <div className="border-b border-border py-3 min-w-0"><div className="text-2xl font-bold text-foreground break-words">{value}</div><div className="text-xs text-muted-foreground mt-1">{label}</div></div>; }
const count = (n: number) => n.toLocaleString();

export default function PartnersPage() {
  const allowed = usePersonaGuard("partners");
  const { partners, tenants } = useSuperadminStore();
  const cat = useCatalogStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [lineFilter, setLineFilter] = useState("all");
  if (!allowed) return null;
  const selected = partners.find((p) => p.id === selectedId);
  const report = (p: Partner) => partnerReport(p, tenants, cat.customerProducts, cat.skus);
  const reports = partners.map((p) => ({ p, r: report(p) }));
  const detail = selected ? report(selected) : null;
  const shown = reports.filter(({ p }) => [p.name, p.country, p.primaryContact, p.type].some((v) => v.toLowerCase().includes(query.toLowerCase())) && (status === "all" || p.status === status));
  const tenantIds = detail?.customers.map((t) => t.id) ?? [];
  const hw = hardwareStats(cat, tenantIds);
  const deployment = coreDeployment(cat, tenantIds);
  const lines = detail?.rows.filter((r) => lineFilter === "all" || (lineFilter === "renewal" ? detail.renewals.some((l) => l.c.id === r.c.id) : r.status === lineFilter)) ?? [];
  const edit = (partner: Partner | null) => { setEditing(partner); setOpen(true); };
  const exportReport = () => {
    if (!detail || !selected) return;
    const csvCell = (value: unknown) => { let text = String(value ?? ""); if (/^[=+@-]/.test(text)) text = `'${text}`; return `"${text.replaceAll('"', '""')}"`; };
    const rows = [['Partner', 'Customer', 'Stores', 'Product / SKU', 'SKU code', 'Quantity', 'Used', 'Usage unit', 'Subscription date', 'Expiry', 'Status', 'Auto renew', 'Deployment', 'Order reference'], ...lines.map((r) => [selected.name, r.tenant?.name, r.tenant?.storesCount, r.sku?.name ?? 'Unavailable SKU', r.sku?.code ?? r.c.skuId, r.c.quantity, r.c.used ?? '', r.c.usageUnit ?? '', r.c.startDate, r.c.endDate, r.status, r.c.autoRenew ? 'Yes' : 'No', r.c.deployment ?? '', r.c.orderRef])];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `partner-${selected.name.replace(/[^a-z0-9]/gi, '-')}.csv`; a.click(); URL.revokeObjectURL(url);
  };
  return <div className="dark space-y-6 text-foreground">
    <header className="flex flex-wrap gap-3 items-start justify-between">
      <div>{selected && <Button variant="ghost" size="sm" onClick={() => { setSelectedId(null); setLineFilter('all'); }}><ArrowLeft className="h-4 w-4 mr-2" />All partners</Button>}<h1 className="text-3xl font-bold break-words">{selected?.name ?? 'Partner Master'}</h1><p className="text-muted-foreground text-sm mt-1">{selected ? `${selected.type} · ${selected.country || 'Country not set'} · Partner since ${selected.createdAt}` : `${partners.length} partners · ${reports.reduce((s, x) => s + x.r.customers.length, 0)} customers brought`}</p></div>
      <Button onClick={() => edit(selected ?? null)}>{selected ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}{selected ? 'Edit partner' : 'Add partner'}</Button>
    </header>
    {!selected && <>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat label="Active partners" value={partners.filter((p) => p.status === 'active').length} />
        <Stat label="Stores brought" value={count(reports.reduce((s, x) => s + x.r.stores, 0))} />
        <Stat label="Active subscriptions" value={reports.reduce((s, x) => s + x.r.subscriptions, 0)} />
        <Stat label="Renewals within 90 days" value={reports.reduce((s, x) => s + x.r.renewals.length, 0)} />
        <Stat label="Expired licences" value={reports.reduce((s, x) => s + x.r.expired, 0)} />
      </div>
      <div className="flex gap-3 flex-wrap"><Input aria-label="Search partners" placeholder="Search partners…" className="max-w-md" value={query} onChange={(e) => setQuery(e.target.value)} /><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Filter partner status" className="w-40"><SelectValue /></SelectTrigger><SelectContent className="dark"><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{shown.map(({ p, r }) => <Card key={p.id} className="bg-card border-border rounded-lg"><CardContent className="p-5 space-y-4"><div className="flex justify-between gap-2"><div className="min-w-0"><Button variant="link" className="p-0 h-auto text-lg text-foreground whitespace-normal text-left" onClick={() => { setSelectedId(p.id); setLineFilter('all'); }}>{p.name}</Button><p className="text-xs text-muted-foreground mt-1">{p.type} · {p.country || 'Country not set'}</p></div><Badge variant="outline">{p.status}</Badge></div><div className="grid grid-cols-3 gap-3"><Stat label="Customers" value={r.customers.length} /><Stat label="Stores brought" value={count(r.stores)} /><Stat label="Active products" value={r.products} /></div><p className="text-xs text-muted-foreground">{r.chains} chains · {r.singleStores} single-store customers · {r.subscriptions} active subscriptions</p><div className="flex flex-wrap gap-3 text-sm"><span className="flex items-center gap-1"><CalendarClock className="h-4 w-4 text-accent" />{r.renewals.length} renewals ≤90d</span><span className="flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-warning" />{r.expired} expired</span></div><Button variant="outline" onClick={() => setSelectedId(p.id)}>View partner dashboard</Button></CardContent></Card>)}</div>
      {shown.length === 0 && <div className="py-12 text-center text-muted-foreground">{partners.length ? 'No partners match these filters.' : 'No partners yet.'}<div className="mt-4"><Button variant="outline" onClick={() => edit(null)}><Plus className="h-4 w-4 mr-2" />Add partner</Button></div></div>}
    </>}
    {selected && detail && <>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4"><Stat label="Customers brought" value={detail.customers.length} /><Stat label="Stores brought" value={count(detail.stores)} /><Stat label="Active products" value={detail.products} /><Stat label="Active subscriptions" value={detail.subscriptions} /><Stat label="Renewals within 90 days" value={detail.renewals.length} /><Stat label="Expired licences" value={detail.expired} /></div>
      <Tabs defaultValue="overview"><TabsList className="h-auto flex-wrap"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="customers">Customers & stores</TabsTrigger><TabsTrigger value="licences">Subscriptions & licences</TabsTrigger><TabsTrigger value="profile">Partner details</TabsTrigger></TabsList>
        <TabsContent value="overview" className="space-y-6 mt-6"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><Stat label="Chains / single-store customers" value={`${detail.chains} / ${detail.singleStores}`} /><Stat label="Displays active / total" value={`${count(hw.displaysActive)} / ${count(hw.displaysTotal)}`} /><Stat label="D.COM active / total" value={`${count(hw.dcomActive)} / ${count(hw.dcomTotal)}`} /><Stat label="Core stores · Cloud / On-Prem" value={`${count(deployment.cloud)} / ${count(deployment.onPrem)}`} /></div><h2 className="text-lg font-semibold">Products & assistants procured</h2><LicenseMixGrid groups={licenseMix(cat, tenantIds)} /><div className="flex gap-3 flex-wrap"><Button variant="outline" onClick={() => setLineFilter('renewal')} asChild><a href="#partner-licences"><CalendarClock className="h-4 w-4 mr-2" />Renewals: {detail.renewals.length}</a></Button><p className="text-muted-foreground text-sm self-center">{detail.rows.filter((r) => r.status === 'pending').length} pending mappings · {detail.expired} expired licences</p></div></TabsContent>
        <TabsContent value="customers" className="mt-6"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-muted-foreground border-b border-border"><tr>{['Customer', 'Format', 'Stores', 'Status', 'Active subscriptions', 'Renewals ≤90d', 'Expired'].map((h) => <th key={h} className="text-left p-3 whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{detail.customers.map((t) => <tr key={t.id} className="border-b border-border"><td className="p-3 font-medium"><Link to="/superadmin/tenants" className="text-accent">{t.name}</Link></td><td className="p-3">{(t.storeFormat ?? (t.storesCount === 1 ? 'single' : 'chain')) === 'single' ? 'Single store' : 'Chain'}</td><td className="p-3">{count(t.storesCount)}</td><td className="p-3">{t.status}</td><td className="p-3">{detail.live.filter((r) => r.c.tenantId === t.id && r.sku?.billing === 'subscription').length}</td><td className="p-3">{detail.renewals.filter((r) => r.c.tenantId === t.id).length}</td><td className="p-3">{detail.rows.filter((r) => r.c.tenantId === t.id && r.status === 'expired').length}</td></tr>)}</tbody></table></div>{detail.customers.length === 0 && <p className="py-8 text-muted-foreground">No customers linked to this partner.</p>}</TabsContent>
        <TabsContent value="licences" id="partner-licences" className="mt-6 space-y-4"><div className="flex flex-wrap gap-3 justify-between"><Select value={lineFilter} onValueChange={setLineFilter}><SelectTrigger aria-label="Filter licence status" className="w-52"><SelectValue /></SelectTrigger><SelectContent className="dark">{[['all','All licences'],['active','Active'],['pending','Pending'],['renewal','Renewing within 90 days'],['expired','Expired'],['cancelled','Cancelled']].map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Button variant="outline" onClick={exportReport}><Download className="h-4 w-4 mr-2" />Export report</Button></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b border-border text-muted-foreground"><tr>{['Customer / product / SKU','Licences / usage','Start date','Expiry / renewal','Status','Order / assignment'].map((h) => <th key={h} className="text-left p-3 whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{lines.map((r) => <tr key={r.c.id} className="border-b border-border align-top"><td className="p-3 min-w-64"><p className="font-semibold">{r.tenant?.name}</p><p>{r.sku?.name ?? 'Unavailable SKU'}</p><p className="text-xs text-muted-foreground">{r.sku?.code ?? r.c.skuId}</p><p className="text-xs text-muted-foreground">{r.sku ? nodePath(cat.nodes, r.sku.nodeId) : ''}</p>{r.sku && isMandatory(cat.nodes, r.sku.nodeId) && <Badge variant="outline" className="mt-1">Mandatory</Badge>}</td><td className="p-3 whitespace-nowrap">{count(r.c.quantity)} {r.c.usageUnit ?? 'units'}<p className="text-xs text-muted-foreground mt-1">Used: {r.c.used == null ? 'Not reported' : count(r.c.used)}</p><p className="text-xs">{r.c.deployment ?? ''}</p></td><td className="p-3 whitespace-nowrap">{r.c.startDate || '—'}<p className="text-xs text-muted-foreground">{r.sku?.billing === 'one-time' ? 'One-time purchase' : r.sku?.term}</p></td><td className="p-3 whitespace-nowrap">{r.c.endDate || 'No expiry'}<p className="text-xs text-muted-foreground">{r.days == null ? '' : r.days < 0 ? `${Math.abs(r.days)} days overdue` : `${r.days} days remaining`}</p>{r.sku?.billing === 'subscription' && <p className="text-xs">Auto-renew: {r.c.autoRenew ? 'Yes' : 'No'}</p>}</td><td className="p-3"><Badge variant="outline" className={r.status === 'expired' ? 'text-warning border-warning' : ''}>{r.status}</Badge></td><td className="p-3 min-w-40"><p>{r.c.orderRef || '—'}</p><p className="text-xs text-muted-foreground">{r.c.source}</p><p className="text-xs">{r.c.assignedTo || 'Unassigned'}</p></td></tr>)}</tbody></table></div>{lines.length === 0 && <p className="py-8 text-muted-foreground">No licences match this view.</p>}</TabsContent>
        <TabsContent value="profile" className="mt-6"><dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">{[['Status',selected.status],['Primary contact',selected.primaryContact],['Contact email',selected.contactEmail],['Phone',selected.phone],['Country',selected.country],['Partner type',selected.type],['Notes',selected.notes]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground mb-1">{label}</dt><dd className="break-words whitespace-pre-wrap">{value || 'Not provided'}</dd></div>)}</dl></TabsContent>
      </Tabs>
    </>}
    <PartnerFormDialog open={open} onOpenChange={setOpen} partner={editing} />
  </div>;
}