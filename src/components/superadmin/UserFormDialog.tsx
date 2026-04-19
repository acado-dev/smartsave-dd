import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "sonner";
import type { User } from "@/data/superadminData";
import { superadminActions, useSuperadminStore } from "@/hooks/useSuperadminStore";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  tenantId: z.string().min(1),
  status: z.enum(["active", "invited", "suspended"]),
  mfaEnabled: z.boolean(),
  roleIds: z.array(z.string()).min(1, "Select at least one role"),
  locationIds: z.array(z.string()),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  user?: User | null;
}

const empty: Omit<User, "id" | "lastActive"> = {
  name: "",
  email: "",
  tenantId: "platform",
  roleIds: [],
  locationIds: [],
  status: "invited",
  mfaEnabled: false,
};

export function UserFormDialog({ open, onOpenChange, user }: Props) {
  const { tenants, roles, locations } = useSuperadminStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!user;

  useEffect(() => {
    if (user) {
      const { id, lastActive, ...rest } = user;
      setForm(rest);
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [user, open]);

  const availableRoles = form.tenantId === "platform"
    ? roles.filter((r) => r.type === "Platform")
    : roles.filter((r) => r.type === "Tenant" && (!r.tenantId || r.tenantId === form.tenantId));

  const availableLocations = locations.filter((l) => l.tenantId === form.tenantId);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    const data = parsed.data as Omit<User, "id" | "lastActive">;
    if (isEdit && user) {
      superadminActions.updateUser(user.id, data);
      toast.success(`${data.name} updated`);
    } else {
      superadminActions.createUser(data);
      toast.success(`${data.name} invited`);
    }
    onOpenChange(false);
  };

  const toggle = (key: "roleIds" | "locationIds", id: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit user" : "Invite user"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Assign tenant scope, roles, and locations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" error={errors.name}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Tenant" error={errors.tenantId}>
            <select value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value, roleIds: [], locationIds: [] })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="platform">Platform (Ithina)</option>
              {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Status" error={errors.status}>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User["status"] })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 p-3 rounded bg-white/5 border border-white/10 cursor-pointer">
          <Checkbox checked={form.mfaEnabled} onCheckedChange={(v) => setForm({ ...form, mfaEnabled: !!v })} />
          <div>
            <div className="text-sm text-white">Require MFA</div>
            <div className="text-[11px] text-slate-400">Multi-factor authentication for this user.</div>
          </div>
        </label>

        <div>
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Roles</Label>
          {errors.roleIds && <div className="text-xs text-[hsl(4,84%,75%)] mt-1">{errors.roleIds}</div>}
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
            {availableRoles.map((r) => (
              <label key={r.id} className="flex items-start gap-2 p-2 rounded bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07]">
                <Checkbox checked={form.roleIds.includes(r.id)} onCheckedChange={() => toggle("roleIds", r.id)} className="mt-0.5" />
                <div>
                  <div className="text-sm text-white">{r.name}</div>
                  <div className="text-[11px] text-slate-400">{r.description}</div>
                </div>
              </label>
            ))}
            {availableRoles.length === 0 && <div className="text-xs text-slate-500">No roles available for this tenant.</div>}
          </div>
        </div>

        {availableLocations.length > 0 && (
          <div>
            <Label className="text-slate-300 text-xs uppercase tracking-wider">Locations</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
              {availableLocations.map((l) => (
                <label key={l.id} className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07]">
                  <Checkbox checked={form.locationIds.includes(l.id)} onCheckedChange={() => toggle("locationIds", l.id)} />
                  <div className="text-sm text-white">{l.name} <span className="text-[10px] text-slate-500">{l.type}</span></div>
                </label>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</Button>
          <Button onClick={submit} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            {isEdit ? "Save changes" : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-slate-300 text-xs uppercase tracking-wider mb-1.5 block">{label}</Label>
    {children}
    {error && <div className="text-xs text-[hsl(4,84%,75%)] mt-1">{error}</div>}
  </div>
);
