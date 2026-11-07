import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { modules, type Tenant } from "@/data/superadminData";
import { superadminActions } from "@/hooks/useSuperadminStore";
import { useScopedSuperadminStore as useSuperadminStore } from "@/lib/superadminScope";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";
import { Search, Plus, Users, Store, DollarSign, MoreVertical, Pencil, Trash2, Power } from "lucide-react";
import { TenantFormDialog } from "@/components/superadmin/TenantFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { toast } from "sonner";
import { CustomerProductsPanel } from "@/components/superadmin/CustomerProductsPanel";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { useCatalogStore, daysUntil, effectiveStatus, mandatoryGaps, type CatalogNode } from "@/hooks/useCatalogStore";
import { Package, CalendarClock, AlertTriangle, ShieldCheck, Gauge, RefreshCw, Cpu, Sparkles, Plug } from "lucide-react";
import { licenseMix, hardwareStats, coreDeployment } from "@/lib/subscriptionSummary";
import { LicenseMixChips, LicenseMixGrid } from "@/components/superadmin/LicenseMix";
import { tenantCommercial } from "@/lib/tenantCommercial";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const rootOf = (nodes: CatalogNode[], id: string) => {
  let cur = nodes.find((x) => x.id === id);
  while (cur && cur.parentId) cur = nodes.find((x) => x.id === cur!.parentId);
  return cur;
};
const cmp = (v: number) => (v >= 10000 ? `${(v / 1000).toFixed(1)}k` : v.toLocaleString());
const fmtMoney = (v: number) => (v >= 1e6 ? `€${(v / 1e6).toFixed(2)}M` : v >= 1000 ? `€${(v / 1000).toFixed(1)}k` : `€${Math.round(v)}`);

const tierStyle: Record<string, string> = {
  Enterprise: "border-[hsl(262,60%,55%)]/40 text-[hsl(262,60%,75%)] bg-[hsl(262,60%,55%)]/10",
  "Mid-Market": "border-[hsl(217,91%,60%)]/40 text-[hsl(217,91%,75%)] bg-[hsl(217,91%,60%)]/10",
  SMB: "border-[hsl(187,70%,42%)]/40 text-[hsl(187,70%,62%)] bg-[hsl(187,70%,42%)]/10",
  "Single-Store": "border-slate-500/40 text-slate-300 bg-slate-500/10",
};
const statusStyle: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  trial: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  suspended: "bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border-[hsl(4,84%,55%)]/30",
};

export default function TenantsPage() {
  usePersonaGuard("tenants");
  const { tenants } = useSuperadminStore();
  const catalog = useCatalogStore();
  const { customerProducts } = catalog;
  const [sortBy, setSortBy] = useState<"name" | "renewal" | "assistants">("name");
  const summary = (tenantId: string) => {
    const mine = customerProducts.filter((c) => c.tenantId === tenantId);
    const live = mine.filter((c) => ["active", "pending"].includes(effectiveStatus(c)));
    const expired = mine.filter((c) => effectiveStatus(c) === "expired").length;
    let arr = 0, oneTime = 0, used = 0, cap = 0;
    const cats = new Set<string>();
    live.forEach((c) => {
      const k = catalog.skus.find((x) => x.id === c.skuId);
      if (!k) return;
      const r = rootOf(catalog.nodes, k.nodeId); if (r) cats.add(r.name);
      if (k.billing === "subscription") arr += k.price * c.quantity * (k.term === "monthly" ? 12 : 1);
      else oneTime += k.price * c.quantity;
      if (c.used != null) { used += c.used; cap += c.quantity; }
    });
    const renewals = live.filter((c) => c.endDate).map((c) => ({ c, d: daysUntil(c.endDate)! })).sort((a, b) => a.d - b.d);
    const next = renewals[0];
    const gaps = mandatoryGaps(catalog, tenantId);
    return { total: mine.length, live: live.length, expired, arr, oneTime, cats: [...cats], next, renewing90: renewals.filter((r) => r.d <= 90).length,
      usage: cap ? Math.round((used / cap) * 100) : null, gaps, autoRenew: live.filter((c) => c.autoRenew).length };
  };
  const { session } = useSuperadminAuth();
  const isPlatform = !session || session.persona === "platform";
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState("all");
  const [format, setFormat] = useState("all");
  const [partner, setPartner] = useState("all");
  const partnerNames = [...new Set(tenants.map((t) => t.partnerName?.trim()).filter((name): name is string => Boolean(name)))].sort();
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Tenant | null>(null);

  const filtered = tenants.filter((t) => {
    const commercial = tenantCommercial(t);
    const match = [t.name, t.industry, commercial.partnerName].some((value) => value.toLowerCase().includes(q.toLowerCase()));
    const sm = summary(t.id);
    const tier = filter === "all" || t.tier === filter
      || (filter === "renewal" && sm.renewing90 > 0) || (filter === "gap" && sm.gaps.length > 0);
    return match && tier && (channel === "all" || commercial.salesChannel === channel)
      && (format === "all" || commercial.storeFormat === format)
      && (partner === "all" || commercial.partnerName === partner);
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    const sa = summary(a.id), sb = summary(b.id);
    if (sortBy === "assistants") return mixCount(b.id, "Maestro") - mixCount(a.id, "Maestro");
    return (sa.next?.d ?? 1e9) - (sb.next?.d ?? 1e9);
  });
  const mixOf = (id: string) => licenseMix(catalog, [id]);
  const mixCount = (id: string, c: string) => mixOf(id).find((g) => g.category === c)?.items.length ?? 0;
  const portfolio = licenseMix(catalog, tenants.map((t) => t.id));
  const pc = (c: string) => portfolio.find((g) => g.category === c);
  const hw = hardwareStats(catalog, tenants.map((t) => t.id));
  const dep = coreDeployment(catalog, tenants.map((t) => t.id));
  const tHw = (id: string) => hardwareStats(catalog, [id]);
  const tDep = (id: string) => { const d = coreDeployment(catalog, [id]); return d.onPrem && d.cloud ? "Hybrid" : d.onPrem ? "On-Prem" : d.cloud ? "Cloud" : "—"; };
  const all = tenants.map((t) => summary(t.id));
  const kpi = {
    arr: all.reduce((s, x) => s + x.arr, 0),
    subs: all.reduce((s, x) => s + x.live, 0),
    renew: all.reduce((s, x) => s + x.renewing90, 0),
    gaps: all.filter((x) => x.gaps.length).length,
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (t: Tenant) => { setEditing(t); setFormOpen(true); setSelected(null); };
  const toggleSuspend = (t: Tenant) => {
    superadminActions.updateTenant(t.id, { status: t.status === "active" ? "suspended" : "active" });
    toast.success(`${t.name} ${t.status === "active" ? "suspended" : "reactivated"}`);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tenants</h1>
          <p className="text-sm text-slate-400 mt-1">
            {tenants.length} client organizations · {tenants.reduce((s, t) => s + t.storesCount, 0).toLocaleString()} stores
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
          <Plus className="h-4 w-4 mr-2" /> Provision tenant
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        <Kpi icon={ShieldCheck} label={`Core stores · ${dep.cloud} Cloud / ${dep.onPrem} On-Prem`} value={(pc("Ithina Core")?.items.find((i) => i.unit === "stores")?.qty ?? pc("Ithina Core")?.total ?? 0).toLocaleString()} />
        <Kpi icon={Cpu} label="Displays active / total" value={`${hw.displaysActive.toLocaleString()} / ${hw.displaysTotal.toLocaleString()}`} />
        <Kpi icon={Gauge} label="D.COM active / total" value={`${hw.dcomActive.toLocaleString()} / ${hw.dcomTotal.toLocaleString()}`} />
        <Kpi icon={Sparkles} label="Maestro assistants in use" value={pc("Maestro")?.items.length ?? 0} />
        <Kpi icon={Plug} label="External apps connected" value={pc("External Apps")?.items.length ?? 0} />
        <Kpi icon={CalendarClock} label="Renewals in 90 days" value={kpi.renew} tone={kpi.renew ? "warn" : undefined} onClick={() => setFilter("renewal")} />
        <Kpi icon={AlertTriangle} label="Missing mandatory product" value={kpi.gaps} tone={kpi.gaps ? "bad" : undefined} onClick={() => setFilter("gap")} />
      </div>

      <div className="flex gap-3 items-center flex-wrap">
        <Select value={channel} onValueChange={(value) => { setChannel(value); setPartner("all"); }}>
          <SelectTrigger aria-label="Filter sales channel" className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All sales channels</SelectItem><SelectItem value="direct">Direct customers</SelectItem><SelectItem value="partner">Partner customers</SelectItem></SelectContent>
        </Select>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger aria-label="Filter customer format" className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All store formats</SelectItem><SelectItem value="chain">Chains of stores</SelectItem><SelectItem value="single">Single stores</SelectItem></SelectContent>
        </Select>
        {channel !== "direct" && partnerNames.length > 0 && <Select value={partner} onValueChange={setPartner}>
          <SelectTrigger aria-label="Filter partner" className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All partners</SelectItem>{partnerNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
        </Select>}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search tenants…" value={q} onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-slate-200" />
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {["all", "Enterprise", "Mid-Market", "SMB", "Single-Store", "renewal", "gap"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded ${filter === f ? "bg-[hsl(217,91%,60%)] text-white" : "text-slate-400 hover:text-white"}`}>
              {f === "all" ? "All" : f === "renewal" ? "Renewing ≤90d" : f === "gap" ? "Compliance gap" : f}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
          className="h-9 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 px-2">
          <option value="name">Sort: Name</option>
          <option value="renewal">Sort: Next renewal</option>
          <option value="assistants">Sort: Assistants used</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="bg-white/5 border-white/10 hover:border-[hsl(217,91%,60%)]/40 transition">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div onClick={() => setSelected(t)} className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)]/30 to-[hsl(262,60%,55%)]/30 flex items-center justify-center text-white text-sm font-bold">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.industry} · {t.country}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-slate-500 hover:text-white p-1"><MoreVertical className="h-4 w-4" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
                    <DropdownMenuItem onClick={() => openEdit(t)} className="cursor-pointer"><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleSuspend(t)} className="cursor-pointer">
                      <Power className="h-3.5 w-3.5 mr-2" /> {t.status === "active" ? "Suspend" : "Reactivate"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => setConfirmDelete(t)} className="cursor-pointer text-[hsl(4,84%,75%)] focus:text-[hsl(4,84%,75%)]">
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete tenant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="border-border text-foreground">{tenantCommercial(t).storeFormat === "single" ? "Single store" : "Chain of stores"}</Badge>
                <Badge variant="outline" className="border-border text-foreground max-w-full break-words whitespace-normal">{tenantCommercial(t).salesChannel === "partner" ? `Partner · ${t.partnerName || "Unassigned"}` : "Direct customer"}</Badge>
                <Badge variant="outline" className={tierStyle[t.tier]}>{t.tier}</Badge>
                <Badge variant="outline" className={statusStyle[t.status]}>{t.status}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <Metric icon={Store} value={t.storesCount.toLocaleString()} label="stores" />
                <Metric icon={Users} value={t.usersCount.toLocaleString()} label="users" />
                <Metric icon={Package} value={summary(t.id).live} label="active licences" />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <Metric icon={ShieldCheck} value={tDep(t.id)} label="Core deployment" />
                <Metric icon={Cpu} value={`${cmp(tHw(t.id).displaysActive)}/${cmp(tHw(t.id).displaysTotal)}`} label="displays active" />
                <Metric icon={Gauge} value={`${cmp(tHw(t.id).dcomActive)}/${cmp(tHw(t.id).dcomTotal)}`} label="D.COM active" />
              </div>
              <LicenseMixChips groups={mixOf(t.id)} />
              <SubscriptionStrip sm={summary(t.id)} onOpen={() => setSelected(t)} />
              <div className="flex flex-wrap gap-1">
                {t.modules.slice(0, 4).map((m) => {
                  const mod = modules.find((x) => x.key === m);
                  return mod ? (
                    <span key={m} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {mod.name}
                    </span>
                  ) : null;
                })}
                {t.modules.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded text-slate-400">+{t.modules.length - 4}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-muted-foreground py-8 text-center">No tenants match these filters.</p>}
      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 w-[560px] sm:max-w-[560px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-white text-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(262,60%,55%)] flex items-center justify-center text-white text-sm font-bold">
                    {selected.name.slice(0, 2).toUpperCase()}
                  </div>
                  {selected.name}
                </SheetTitle>
                <SheetDescription className="text-slate-400">
                  {selected.industry} · {selected.country} · Onboarded {selected.createdAt}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="space-y-2 border-b border-border pb-4">
                  <h3 className="text-sm font-semibold text-foreground">Customer & partner</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-muted-foreground">Customer format</dt><dd className="text-foreground">{tenantCommercial(selected).storeFormat === "single" ? "Single store" : "Chain of stores"} · {selected.storesCount.toLocaleString()} stores</dd>
                    <dt className="text-muted-foreground">Sales channel</dt><dd className="text-foreground">{tenantCommercial(selected).salesChannel === "partner" ? "Partner-sourced" : "Direct"}</dd>
                    {tenantCommercial(selected).salesChannel === "partner" && <><dt className="text-muted-foreground">Partner</dt><dd className="text-foreground break-words">{selected.partnerName || "Unassigned"}</dd></>}
                  </dl>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Licences procured</div>
                  <div className="[&>div]:!grid-cols-1 sm:[&>div]:!grid-cols-2"><LicenseMixGrid groups={mixOf(selected.id)} /></div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Metric icon={ShieldCheck} value={tDep(selected.id)} label="Ithina Core deployment" />
                  <Metric icon={Cpu} value={`${tHw(selected.id).displaysActive.toLocaleString()} / ${tHw(selected.id).displaysTotal.toLocaleString()}`} label="displays active / total" />
                  <Metric icon={Gauge} value={`${tHw(selected.id).dcomActive} / ${tHw(selected.id).dcomTotal}`} label="D.COM active / total" />
                </div>
                <SubscriptionOverview sm={summary(selected.id)} />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Primary contact</div>
                  <div className="text-sm text-white">{selected.primaryContact}</div>
                  <div className="text-xs text-slate-400">{selected.contactEmail}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Modules enabled ({selected.modules.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.modules.map((mk) => {
                      const m = modules.find((x) => x.key === mk);
                      return m ? <Badge key={mk} variant="outline" className="border-white/10 text-slate-300 bg-white/5">{m.name}</Badge> : null;
                    })}
                  </div>
                </div>
                <CustomerProductsPanel tenantId={selected.id} readOnly={!isPlatform} />
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => openEdit(selected)} variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5">
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Edit tenant
                  </Button>
                  <Button onClick={() => toggleSuspend(selected)} className="flex-1 bg-[hsl(4,84%,55%)] hover:bg-[hsl(4,84%,50%)] text-white">
                    <Power className="h-3.5 w-3.5 mr-2" /> {selected.status === "active" ? "Suspend" : "Reactivate"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <TenantFormDialog open={formOpen} onOpenChange={setFormOpen} tenant={editing} />
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete ${confirmDelete?.name}?`}
        description="This permanently removes the tenant, its org tree, and its users from the platform. This action cannot be undone."
        onConfirm={() => {
          if (confirmDelete) {
            superadminActions.deleteTenant(confirmDelete.id);
            toast.success(`${confirmDelete.name} deleted`);
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}

const Metric = ({ icon: Icon, value, label }: any) => (
  <div className="p-2 rounded bg-white/[0.03] border border-white/5">
    <Icon className="h-3 w-3 text-slate-500 mb-1" />
    <div className="text-sm font-semibold text-white">{value}</div>
    <div className="text-[10px] text-slate-500">{label}</div>
  </div>
);

type Summary = ReturnType<ReturnType<typeof makeSummaryType>>;
// helper purely for typing
function makeSummaryType() { return (_: string) => ({ total: 0, live: 0, expired: 0, arr: 0, oneTime: 0, cats: [] as string[],
  next: undefined as undefined | { c: { endDate: string; autoRenew?: boolean }; d: number }, renewing90: 0, usage: null as number | null,
  gaps: [] as CatalogNode[], autoRenew: 0 }); }

const renewTone = (d?: number) => d == null ? "text-slate-400" : d < 0 ? "text-[hsl(4,84%,75%)]" : d <= 30 ? "text-[hsl(4,84%,75%)]" : d <= 90 ? "text-amber-300" : "text-emerald-300";

const SubscriptionStrip = ({ sm, onOpen }: { sm: Summary; onOpen: () => void }) => (
  <button onClick={onOpen} className="w-full text-left mb-3 p-2.5 rounded bg-white/[0.03] border border-white/5 hover:border-white/20 space-y-2">
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-slate-300 flex items-center gap-1"><Package className="h-3 w-3" /> {sm.live} active subscriptions{sm.expired ? ` · ${sm.expired} expired` : ""}</span>
      {sm.gaps.length ? (
        <span className="text-[hsl(4,84%,75%)] flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Missing {sm.gaps[0].name}</span>
      ) : (
        <span className="text-emerald-300 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Compliant</span>
      )}
    </div>
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-slate-500 flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Next renewal</span>
      <span className={renewTone(sm.next?.d)}>
        {sm.next ? `${sm.next.c.endDate} · ${sm.next.d < 0 ? "overdue" : `${sm.next.d}d`}${sm.next.c.autoRenew ? " · auto" : ""}` : "—"}
      </span>
    </div>
    {sm.usage != null && (
      <div>
        <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>License usage</span><span>{sm.usage}%</span></div>
        <div className="h-1.5 rounded bg-white/10 overflow-hidden">
          <div className={`h-full ${sm.usage > 90 ? "bg-[hsl(4,84%,55%)]" : sm.usage > 75 ? "bg-amber-400" : "bg-[hsl(187,70%,42%)]"}`} style={{ width: `${Math.min(sm.usage, 100)}%` }} />
        </div>
      </div>
    )}
    {false && sm.cats.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {sm.cats.map((c) => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(217,91%,60%)]/10 border border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,80%)]">{c}</span>)}
      </div>
    )}
  </button>
);

const SubscriptionOverview = ({ sm }: { sm: Summary }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Licence health</div>
    <div className="grid grid-cols-3 gap-2">
      <Metric icon={Package} value={sm.live} label="active licences" />
      <Metric icon={AlertTriangle} value={sm.expired} label="expired" />
      <Metric icon={Gauge} value={sm.usage != null ? `${sm.usage}%` : "—"} label="license usage" />
      <Metric icon={CalendarClock} value={sm.next ? (sm.next.d < 0 ? "Overdue" : `${sm.next.d}d`) : "—"} label={sm.next ? `renews ${sm.next.c.endDate}` : "next renewal"} />
      <Metric icon={RefreshCw} value={`${sm.autoRenew}/${sm.live}`} label="auto-renew" />
      <Metric icon={CalendarClock} value={sm.renewing90} label="renewing ≤90d" />
    </div>
    {sm.gaps.length > 0 && (
      <div className="mt-2 p-2 rounded border border-[hsl(4,84%,55%)]/30 bg-[hsl(4,84%,55%)]/10 text-[11px] text-[hsl(4,84%,80%)] flex items-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5" /> Mandatory product missing: {sm.gaps.map((g) => g.name).join(", ")}
      </div>
    )}
  </div>
);

const Kpi = ({ icon: Icon, label, value, tone, onClick }: any) => (
  <button onClick={onClick} disabled={!onClick}
    className={`text-left p-4 rounded-lg bg-white/5 border ${tone === "bad" ? "border-[hsl(4,84%,55%)]/40" : tone === "warn" ? "border-amber-500/40" : "border-white/10"} ${onClick ? "hover:bg-white/10" : ""}`}>
    <Icon className={`h-4 w-4 mb-2 ${tone === "bad" ? "text-[hsl(4,84%,70%)]" : tone === "warn" ? "text-amber-300" : "text-slate-500"}`} />
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-[11px] text-slate-400">{label}</div>
  </button>
);
