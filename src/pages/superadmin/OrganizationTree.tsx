import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Location } from "@/data/superadminData";
import { ChevronRight, ChevronDown, Building2, MapPin, Layers, Network, Plus, Pencil, Trash2 } from "lucide-react";
import { superadminActions } from "@/hooks/useSuperadminStore";
import { useScopedSuperadminStore as useSuperadminStore } from "@/lib/superadminScope";
import { LocationFormDialog } from "@/components/superadmin/LocationFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useSuperadminAuth } from "@/contexts/SuperadminAuthContext";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { licenseMix, hardwareStats, coreDeployment, portfolioSummary } from "@/lib/subscriptionSummary";
import { LicenseMixChips } from "@/components/superadmin/LicenseMix";
import { tenantCommercial } from "@/lib/tenantCommercial";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const typeIcon: Record<string, any> = {
  HQ: Building2, Region: MapPin, Country: MapPin, Store: Building2,
  Department: Layers, BusinessUnit: Network,
};
const typeColor: Record<string, string> = {
  HQ: "text-[hsl(217,91%,75%)]", Region: "text-[hsl(187,70%,62%)]",
  Country: "text-[hsl(187,70%,62%)]", Store: "text-emerald-400",
  Department: "text-amber-400", BusinessUnit: "text-[hsl(262,60%,75%)]",
};

interface NodeProps {
  node: Location;
  depth: number;
  tenantLocations: Location[];
  onAddChild: (parent: Location) => void;
  onEdit: (l: Location) => void;
  onDelete: (l: Location) => void;
}

function TreeNode({ node, depth, tenantLocations, onAddChild, onEdit, onDelete }: NodeProps) {
  const [open, setOpen] = useState(depth < 2);
  const children = tenantLocations.filter((l) => l.parentId === node.id);
  const Icon = typeIcon[node.type] ?? Building2;
  return (
    <div>
      <div
        className="group flex flex-wrap items-center gap-2 py-2 px-3 rounded hover:bg-muted/50 min-w-0"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <Button variant="ghost" size="icon" aria-label={`${open ? "Collapse" : "Expand"} ${node.name}`} disabled={!children.length}
          onClick={() => children.length && setOpen(!open)}
          className="h-6 w-6 shrink-0"
        >
          {children.length > 0 ? (
            open ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          ) : <span className="w-3.5 inline-block" />}
        </Button>
        <Icon className={`h-4 w-4 ${typeColor[node.type] ?? "text-slate-400"}`} />
        <span className="text-sm text-foreground break-words min-w-0 flex-1">{node.name}</span>
        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 bg-transparent">{node.type}</Badge>
        {node.code && <span className="text-[10px] text-slate-500">{node.code}</span>}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onAddChild(node)} title="Add child" aria-label={`Add child to ${node.name}`} className="h-7 w-7"><Plus className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(node)} title="Edit" aria-label={`Edit ${node.name}`} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(node)} title="Delete" aria-label={`Delete ${node.name}`} className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
      {open && children.map((c) => (
        <TreeNode key={c.id} node={c} depth={depth + 1} tenantLocations={tenantLocations}
          onAddChild={onAddChild} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function OrganizationTree() {
  const { tenants, locations, partners } = useSuperadminStore();
  const { session } = useSuperadminAuth();
  const platform = session?.persona === "platform";
  const catalog = useCatalogStore();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [activeTenant, setActiveTenant] = useState(tenants[0]?.id ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Location | null>(null);

  const visibleTenants = tenants.filter(t => (channel === "all" || tenantCommercial(t).salesChannel === channel) && [t.name, t.partnerName ?? "", t.country].some(v => v.toLowerCase().includes(query.toLowerCase())));
  const current = visibleTenants.find(t => t.id === activeTenant) ?? visibleTenants[0];
  const currentId = current?.id ?? "";
  const tenantLocations = locations.filter((l) => l.tenantId === currentId);
  const roots = tenantLocations.filter((l) => !l.parentId || !tenantLocations.some(parent => parent.id === l.parentId));
  const partner = partners.find(p => p.id === current?.partnerId);
  const groups = [...new Set(visibleTenants.map(t => tenantCommercial(t).salesChannel === "direct" ? "direct" : t.partnerId ?? "unassigned"))].map(id => ({ id, name: id === "direct" ? "Direct customers" : partners.find(p => p.id === id)?.name ?? "Unassigned partner", tenants: visibleTenants.filter(t => (tenantCommercial(t).salesChannel === "direct" ? "direct" : t.partnerId ?? "unassigned") === id) }));
  const hw = hardwareStats(catalog, currentId ? [currentId] : []);
  const deployment = coreDeployment(catalog, currentId ? [currentId] : []);
  const health = portfolioSummary(catalog, currentId ? [currentId] : []);

  const openAddRoot = () => { setEditing(null); setDefaultParentId(null); setFormOpen(true); };
  const openAddChild = (parent: Location) => { setEditing(null); setDefaultParentId(parent.id); setFormOpen(true); };
  const openEdit = (l: Location) => { setEditing(l); setDefaultParentId(l.parentId); setFormOpen(true); };

  return (
    <div className="text-foreground space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organization Tree</h1>
          <p className="text-sm text-slate-400 mt-1">
            {tenants.length} tenants · {locations.filter(l => l.type === "Store").length} configured stores · {tenants.filter(t => tenantCommercial(t).salesChannel === "partner").length} partner-sourced customers
          </p>
        </div>
        <Button onClick={openAddRoot} disabled={!currentId}>
          <Plus className="h-4 w-4 mr-2" /> Add node
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1 min-w-0 space-y-4">
          <Input aria-label="Search tenants or partners" placeholder="Search tenants or partners…" value={query} onChange={e => setQuery(e.target.value)} />
          <Select value={channel} onValueChange={setChannel}><SelectTrigger aria-label="Filter customer channel"><SelectValue /></SelectTrigger><SelectContent className="dark"><SelectItem value="all">All customer channels</SelectItem><SelectItem value="direct">Direct customers</SelectItem><SelectItem value="partner">Partner customers</SelectItem></SelectContent></Select>
          {groups.map(group => <div key={group.id} className="space-y-2"><h2 className="text-xs font-semibold text-muted-foreground break-words">{group.name} · {group.tenants.length}</h2>{group.tenants.map(t => <Button key={t.id} variant={currentId === t.id ? "secondary" : "ghost"} aria-pressed={currentId === t.id} onClick={() => setActiveTenant(t.id)} className="w-full h-auto py-3 px-2 text-left justify-start whitespace-normal"><div className="min-w-0"><div className="break-words">{t.name}</div><div className="text-xs font-normal text-muted-foreground">{tenantCommercial(t).storeFormat === "single" ? "Single store" : "Chain"} · {t.storesCount.toLocaleString()} stores · {locations.filter(l => l.tenantId === t.id).length} nodes</div></div></Button>)}</div>)}
          {!visibleTenants.length && <p className="text-sm text-muted-foreground">No matching tenants.</p>}
        </aside>

        <section className="lg:col-span-3 min-w-0 border-l border-border lg:pl-5" aria-label="Selected tenant hierarchy">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
              <div>
                <div className="text-base font-semibold text-white">
                  {current?.name ?? "Select a tenant"}
                </div>
                <div className="text-xs text-slate-400">
                  {tenantLocations.length} nodes ·{" "}
                  {tenantLocations.filter((l) => l.type === "Store").length} stores ·{" "}
                  {tenantLocations.filter((l) => l.type === "Region").length} regions
                </div>
              </div>
            </div>
            {current && <div className="space-y-3 border-b border-border pb-4 mb-4">
              <div className="flex flex-wrap gap-2"><Badge variant="outline">{tenantCommercial(current).storeFormat === "single" ? "Single store" : "Chain of stores"}</Badge><Badge variant="outline">{current.status}</Badge><Badge variant="outline">{tenantCommercial(current).salesChannel === "partner" ? "Partner-sourced" : "Direct customer"}</Badge></div>
              {tenantCommercial(current).salesChannel === "partner" && <div className="text-sm break-words"><span className="font-semibold">{partner?.name ?? current.partnerName ?? "Unassigned partner"}</span>{partner && <p className="text-xs text-muted-foreground">{partner.type} · {partner.status} · {partner.country || "—"}</p>}{platform && partner && <Button asChild variant="link" size="sm" className="px-0"><Link to={`/superadmin/partners?partner=${encodeURIComponent(partner.id)}`}>View partner dashboard</Link></Button>}</div>}
              <div className="text-xs text-muted-foreground">{current.storesCount.toLocaleString()} customer stores · {tenantLocations.filter(l => l.type === "Store").length} stores configured in this tree</div>
              {session?.persona !== "tenant" && <><div className="grid grid-cols-2 xl:grid-cols-4 gap-3 text-sm"><div><div className="font-semibold">{deployment.cloud} Cloud / {deployment.onPrem} On-Prem</div><div className="text-xs text-muted-foreground">Ithina Core store licences</div></div><div><div className="font-semibold">{hw.displaysActive.toLocaleString()} / {hw.displaysTotal.toLocaleString()}</div><div className="text-xs text-muted-foreground">Displays active / total</div></div><div><div className="font-semibold">{hw.dcomActive} / {hw.dcomTotal}</div><div className="text-xs text-muted-foreground">D.COM active / total</div></div><div><div className="font-semibold">{health.renewals.length} renewals · {health.expired} expired</div><div className="text-xs text-muted-foreground">Tenant licences · next 90 days</div></div></div><LicenseMixChips groups={licenseMix(catalog, [current.id])} /></>}
            </div>}
            {roots.length === 0
              ? <div className="text-sm text-muted-foreground py-6">{current ? "No organization nodes configured for this tenant." : "No tenant selected."}</div>
              : roots.map((r) => (
                <TreeNode key={r.id} node={r} depth={0} tenantLocations={tenantLocations}
                  onAddChild={openAddChild} onEdit={openEdit} onDelete={setConfirmDelete} />
              ))}
        </section>
      </div>

      {currentId && (
        <LocationFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          tenantId={currentId}
          location={editing}
          defaultParentId={defaultParentId}
        />
      )}
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete "${confirmDelete?.name}"?`}
        description="This removes the org node and all of its children. Users assigned to these locations will need to be reassigned."
        onConfirm={() => {
          if (confirmDelete) {
            superadminActions.deleteLocation(confirmDelete.id);
            toast.success(`${confirmDelete.name} removed`);
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}
