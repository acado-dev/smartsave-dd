import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Shield, MapPin, Pencil, Trash2, Power } from "lucide-react";
import { useSuperadminStore, superadminActions } from "@/hooks/useSuperadminStore";
import { UserFormDialog } from "@/components/superadmin/UserFormDialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import type { User } from "@/data/superadminData";
import { toast } from "sonner";

const statusStyle: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  invited: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  suspended: "bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border-[hsl(4,84%,55%)]/30",
};

export default function UsersPage() {
  const { users, roles, tenants } = useSuperadminStore();
  const [q, setQ] = useState("");
  const [tenantFilter, setTenantFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    const match = u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
    const tf = tenantFilter === "all" || u.tenantId === tenantFilter;
    return match && tf;
  });

  const tenantName = (id: string) => id === "platform" ? "Platform (Ithina)" : tenants.find((t) => t.id === id)?.name ?? id;
  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? id;

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setFormOpen(true); };
  const toggleSuspend = (u: User) => {
    const next = u.status === "suspended" ? "active" : "suspended";
    superadminActions.updateUser(u.id, { status: next });
    toast.success(`${u.name} ${next === "suspended" ? "suspended" : "reactivated"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-sm text-slate-400 mt-1">
            {users.length} visible users · multi-tenant assignment with role-based access.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            <Plus className="h-4 w-4 mr-2" /> Invite user
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-slate-200" />
        </div>
        <select value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-slate-200 text-sm rounded-md px-3 py-2">
          <option value="all">All tenants</option>
          <option value="platform">Platform (Ithina)</option>
          {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Tenant</th>
                <th className="text-left px-4 py-3 font-medium">Roles</th>
                <th className="text-left px-4 py-3 font-medium">Locations</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">MFA</th>
                <th className="text-left px-4 py-3 font-medium">Last active</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(262,60%,55%)] flex items-center justify-center text-[11px] font-bold text-white">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{tenantName(u.tenantId)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roleIds.map((r) => (
                        <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,75%)] border border-[hsl(217,91%,60%)]/20">
                          <Shield className="inline h-2.5 w-2.5 mr-1" />{roleName(r)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {u.locationIds.length === 0 ? "—" : (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {u.locationIds.length} location{u.locationIds.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className={statusStyle[u.status]}>{u.status}</Badge></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${u.mfaEnabled ? "text-emerald-400" : "text-amber-400"}`}>
                      {u.mfaEnabled ? "● On" : "○ Off"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{u.lastActive}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-slate-500 hover:text-white p-1"><MoreVertical className="h-4 w-4" /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
                        <DropdownMenuItem onClick={() => openEdit(u)} className="cursor-pointer"><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleSuspend(u)} className="cursor-pointer">
                          <Power className="h-3.5 w-3.5 mr-2" /> {u.status === "suspended" ? "Reactivate" : "Suspend"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => setConfirmDelete(u)} className="cursor-pointer text-[hsl(4,84%,75%)] focus:text-[hsl(4,84%,75%)]">
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-500">No users match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} />
      <ConfirmDeleteDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete ${confirmDelete?.name}?`}
        description="This removes the user from the platform. They will lose access immediately."
        onConfirm={() => {
          if (confirmDelete) {
            superadminActions.deleteUser(confirmDelete.id);
            toast.success(`${confirmDelete.name} deleted`);
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}
