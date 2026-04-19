import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { permissions, modules, rolePermissionMap, type PermissionAction, type Role } from "@/data/superadminData";
import { Plus, Shield, Crown, Users, ChevronRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useSuperadminStore, superadminActions } from "@/hooks/useSuperadminStore";
import { RoleFormDialog } from "@/components/superadmin/RoleFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { toast } from "sonner";

const actionColor: Record<PermissionAction, string> = {
  VIEW: "bg-slate-500/20 text-slate-300",
  CONFIGURE: "bg-[hsl(217,91%,60%)]/20 text-[hsl(217,91%,75%)]",
  EXECUTE: "bg-[hsl(187,70%,42%)]/20 text-[hsl(187,70%,62%)]",
  APPROVE: "bg-emerald-500/20 text-emerald-300",
  OVERRIDE: "bg-[hsl(4,84%,55%)]/20 text-[hsl(4,84%,75%)]",
  AUDIT: "bg-[hsl(262,60%,55%)]/20 text-[hsl(262,60%,75%)]",
};

export default function RolesPermissions() {
  const { roles } = useSuperadminStore();
  const [tab, setTab] = useState<"roles" | "matrix">("roles");
  const [selectedId, setSelectedId] = useState<string>(roles[0]?.id ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Role | null>(null);

  // keep selection valid if list changes
  useEffect(() => {
    if (!roles.find((r) => r.id === selectedId)) {
      setSelectedId(roles[0]?.id ?? "");
    }
  }, [roles, selectedId]);

  const selectedRole = roles.find((r) => r.id === selectedId) ?? roles[0];

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (r: Role) => { setEditing(r); setFormOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Permission = <span className="text-slate-200">Module</span> + <span className="text-slate-200">Resource</span> + <span className="text-slate-200">Action</span> + <span className="text-slate-200">Scope</span>.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
          <Plus className="h-4 w-4 mr-2" /> Custom role
        </Button>
      </div>

      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1 w-fit">
        {[{ k: "roles", label: "Role catalog" }, { k: "matrix", label: "Permission matrix" }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k as any)}
            className={`px-4 py-1.5 text-xs rounded ${tab === t.k ? "bg-[hsl(217,91%,60%)] text-white" : "text-slate-400 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roles" && selectedRole && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs uppercase tracking-wider text-slate-500">Platform roles</div>
            {roles.filter((r) => r.type === "Platform").map((r) => (
              <RoleCard key={r.id} r={r} active={selectedId === r.id} onClick={() => setSelectedId(r.id)}
                onEdit={() => openEdit(r)} onDelete={() => setConfirmDelete(r)} />
            ))}
            <div className="text-xs uppercase tracking-wider text-slate-500 mt-4">Tenant roles</div>
            {roles.filter((r) => r.type === "Tenant").map((r) => (
              <RoleCard key={r.id} r={r} active={selectedId === r.id} onClick={() => setSelectedId(r.id)}
                onEdit={() => openEdit(r)} onDelete={() => setConfirmDelete(r)} />
            ))}
          </div>

          <Card className="bg-white/5 border-white/10 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {selectedRole.type === "Platform"
                      ? <Crown className="h-4 w-4 text-[hsl(217,91%,75%)]" />
                      : <Shield className="h-4 w-4 text-[hsl(187,70%,62%)]" />}
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">{selectedRole.type} role</span>
                    {selectedRole.isCustom && (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">CUSTOM</Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedRole.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{selectedRole.description}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{selectedRole.usersCount}</div>
                    <div className="text-[11px] text-slate-400">users assigned</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(selectedRole)}
                      className="bg-transparent border-white/20 text-white hover:bg-white/5 h-7 text-xs">
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => setConfirmDelete(selectedRole)}
                      className="bg-[hsl(4,84%,55%)]/20 hover:bg-[hsl(4,84%,55%)]/30 text-[hsl(4,84%,75%)] border border-[hsl(4,84%,55%)]/30 h-7 text-xs">
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>

              {selectedRole.inheritsFrom && (
                <div className="mb-4 p-3 bg-white/[0.03] border border-white/5 rounded">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Inherits from</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.inheritsFrom.map((id) => (
                      <Badge key={id} variant="outline" className="border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,75%)]">
                        {roles.find((r) => r.id === id)?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Permissions ({(rolePermissionMap[selectedRole.id] ?? []).length})</div>
              <div className="space-y-1.5 max-h-[420px] overflow-auto">
                {(rolePermissionMap[selectedRole.id] ?? []).length === 0 && (
                  <div className="text-xs text-slate-500 p-3 text-center bg-white/[0.02] rounded border border-white/5">
                    No permissions assigned to this custom role yet. Use the Permission Matrix tab to grant access.
                  </div>
                )}
                {(rolePermissionMap[selectedRole.id] ?? []).map((pid) => {
                  const p = permissions.find((x) => x.id === pid);
                  if (!p) return null;
                  const m = modules.find((mm) => mm.key === p.module);
                  return (
                    <div key={p.id} className="flex items-center gap-2 p-2.5 rounded bg-white/[0.03] border border-white/5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 min-w-[80px] text-center">
                        {m?.name}
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-600" />
                      <span className="text-sm text-white">{p.resource}</span>
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-medium ${actionColor[p.action]}`}>{p.action}</span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded border border-white/10">{p.scope}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "matrix" && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0 overflow-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-white/10 sticky top-0 bg-[hsl(222,47%,9%)]">
                <tr>
                  <th className="text-left px-3 py-3 font-medium text-slate-400 sticky left-0 bg-[hsl(222,47%,9%)] min-w-[200px]">Permission</th>
                  {roles.map((r) => (
                    <th key={r.id} className="px-2 py-3 font-medium text-slate-400 text-center min-w-[60px]">
                      <div className="rotate-[-45deg] origin-bottom-left whitespace-nowrap text-[10px] inline-block">{r.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((p) => {
                  const m = modules.find((mm) => mm.key === p.module);
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-3 py-2 sticky left-0 bg-[hsl(222,47%,9%)] border-r border-white/5">
                        <div className="text-white">{p.resource}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-500">{m?.name}</span>
                          <span className={`text-[9px] px-1.5 py-0 rounded ${actionColor[p.action]}`}>{p.action}</span>
                          <span className="text-[9px] text-slate-500">· {p.scope}</span>
                        </div>
                      </td>
                      {roles.map((r) => {
                        const has = rolePermissionMap[r.id]?.includes(p.id);
                        return (
                          <td key={r.id} className="px-2 py-2 text-center">
                            {has
                              ? <span className="inline-block h-4 w-4 rounded bg-[hsl(217,91%,60%)] text-white text-[10px] leading-4">✓</span>
                              : <span className="inline-block h-4 w-4 rounded border border-white/10" />}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <RoleFormDialog open={formOpen} onOpenChange={setFormOpen} role={editing} />
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete role "${confirmDelete?.name}"?`}
        description="This removes the role from the catalog and unassigns it from all users."
        onConfirm={() => {
          if (confirmDelete) {
            superadminActions.deleteRole(confirmDelete.id);
            toast.success(`Role "${confirmDelete.name}" deleted`);
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}

function RoleCard({ r, active, onClick, onEdit, onDelete }: { r: Role; active: boolean; onClick: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition cursor-pointer ${
        active ? "bg-[hsl(217,91%,60%)]/10 border-[hsl(217,91%,60%)]/40" : "bg-white/5 border-white/10 hover:border-white/20"
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {r.type === "Platform"
            ? <Crown className="h-3.5 w-3.5 text-[hsl(217,91%,75%)] shrink-0" />
            : <Shield className="h-3.5 w-3.5 text-[hsl(187,70%,62%)] shrink-0" />}
          <span className="text-sm font-medium text-white truncate">{r.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {r.isCustom && <span className="text-[9px] text-amber-300">CUSTOM</span>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white p-1"><MoreVertical className="h-3.5 w-3.5" /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} className="cursor-pointer"><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="cursor-pointer text-[hsl(4,84%,75%)] focus:text-[hsl(4,84%,75%)]"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
        <Users className="h-3 w-3" />
        {r.usersCount} users
      </div>
    </div>
  );
}
