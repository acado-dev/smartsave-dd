import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { modules, type Tenant } from "@/data/superadminData";
import { useSuperadminStore, superadminActions } from "@/hooks/useSuperadminStore";
import { Search, Plus, Users, Store, DollarSign, MoreVertical, Pencil, Trash2, Power } from "lucide-react";
import { TenantFormDialog } from "@/components/superadmin/TenantFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { toast } from "sonner";

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
  const { tenants } = useSuperadminStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Tenant | null>(null);

  const filtered = tenants.filter((t) => {
    const match = t.name.toLowerCase().includes(q.toLowerCase()) || t.industry.toLowerCase().includes(q.toLowerCase());
    const tier = filter === "all" || t.tier === filter;
    return match && tier;
  });

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

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search tenants…" value={q} onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-slate-200" />
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {["all", "Enterprise", "Mid-Market", "SMB", "Single-Store"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded ${filter === f ? "bg-[hsl(217,91%,60%)] text-white" : "text-slate-400 hover:text-white"}`}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
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

              <div className="flex gap-2 mb-3">
                <Badge variant="outline" className={tierStyle[t.tier]}>{t.tier}</Badge>
                <Badge variant="outline" className={statusStyle[t.status]}>{t.status}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <Metric icon={Store} value={t.storesCount.toLocaleString()} label="stores" />
                <Metric icon={Users} value={t.usersCount.toLocaleString()} label="users" />
                <Metric icon={DollarSign} value={t.monthlyRevenue ? `$${(t.monthlyRevenue / 1000).toFixed(1)}k` : "—"} label="MRR" />
              </div>

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

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 w-[480px] sm:max-w-[480px]">
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
