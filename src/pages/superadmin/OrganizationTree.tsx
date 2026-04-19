import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Location } from "@/data/superadminData";
import { ChevronRight, ChevronDown, Building2, MapPin, Layers, Network, Plus, Pencil, Trash2 } from "lucide-react";
import { useSuperadminStore, superadminActions } from "@/hooks/useSuperadminStore";
import { LocationFormDialog } from "@/components/superadmin/LocationFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { toast } from "sonner";

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
        className="group flex items-center gap-2 py-2 px-3 rounded hover:bg-white/5"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <button
          onClick={() => children.length && setOpen(!open)}
          className={children.length ? "cursor-pointer" : "cursor-default"}
        >
          {children.length > 0 ? (
            open ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          ) : <span className="w-3.5 inline-block" />}
        </button>
        <Icon className={`h-4 w-4 ${typeColor[node.type] ?? "text-slate-400"}`} />
        <span className="text-sm text-slate-200">{node.name}</span>
        <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 bg-transparent">{node.type}</Badge>
        {node.code && <span className="text-[10px] text-slate-500">{node.code}</span>}
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => onAddChild(node)} title="Add child" className="p-1 text-slate-400 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
          <button onClick={() => onEdit(node)} title="Edit" className="p-1 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => onDelete(node)} title="Delete" className="p-1 text-slate-400 hover:text-[hsl(4,84%,75%)]"><Trash2 className="h-3.5 w-3.5" /></button>
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
  const { tenants, locations } = useSuperadminStore();
  const [activeTenant, setActiveTenant] = useState(tenants[0]?.id ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Location | null>(null);

  const tenantLocations = locations.filter((l) => l.tenantId === activeTenant);
  const roots = tenantLocations.filter((l) => !l.parentId);

  const openAddRoot = () => { setEditing(null); setDefaultParentId(null); setFormOpen(true); };
  const openAddChild = (parent: Location) => { setEditing(null); setDefaultParentId(parent.id); setFormOpen(true); };
  const openEdit = (l: Location) => { setEditing(l); setDefaultParentId(l.parentId); setFormOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organization Tree</h1>
          <p className="text-sm text-slate-400 mt-1">
            Platform → Tenant → Business Unit → HQ → Country → Region → Store → Department. Permissions cascade downward.
          </p>
        </div>
        <Button onClick={openAddRoot} disabled={!activeTenant}
          className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add node
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 lg:col-span-1">
          <CardContent className="p-3">
            <div className="text-xs uppercase tracking-wider text-slate-500 px-2 py-2">Tenants</div>
            <div className="space-y-1">
              {tenants.map((t) => (
                <button key={t.id} onClick={() => setActiveTenant(t.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition ${
                    activeTenant === t.id
                      ? "bg-[hsl(217,91%,60%)]/15 text-white border-l-2 border-[hsl(217,91%,60%)]"
                      : "text-slate-300 hover:bg-white/5 border-l-2 border-transparent"
                  }`}>
                  <span className="truncate">{t.name}</span>
                  <span className="text-[10px] text-slate-500">{locations.filter((l) => l.tenantId === t.id).length}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
              <div>
                <div className="text-base font-semibold text-white">
                  {tenants.find((t) => t.id === activeTenant)?.name ?? "Select a tenant"}
                </div>
                <div className="text-xs text-slate-400">
                  {tenantLocations.length} nodes ·{" "}
                  {tenantLocations.filter((l) => l.type === "Store").length} stores ·{" "}
                  {tenantLocations.filter((l) => l.type === "Region").length} regions
                </div>
              </div>
            </div>
            {roots.length === 0
              ? <div className="text-sm text-slate-500 p-6 text-center">No hierarchy configured for this tenant yet. Click "Add node" to start.</div>
              : roots.map((r) => (
                <TreeNode key={r.id} node={r} depth={0} tenantLocations={tenantLocations}
                  onAddChild={openAddChild} onEdit={openEdit} onDelete={setConfirmDelete} />
              ))}
          </CardContent>
        </Card>
      </div>

      {activeTenant && (
        <LocationFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          tenantId={activeTenant}
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
