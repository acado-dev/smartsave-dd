import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { toast } from "sonner";
import type { Role, RoleType } from "@/data/superadminData";
import { superadminActions, useSuperadminStore } from "@/hooks/useSuperadminStore";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  type: z.enum(["Platform", "Tenant"]),
  description: z.string().trim().min(5).max(300),
  isCustom: z.boolean(),
  tenantId: z.string().optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  role?: Role | null;
}

const empty = {
  name: "",
  type: "Tenant" as RoleType,
  description: "",
  isCustom: true,
  tenantId: "" as string | undefined,
};

export function RoleFormDialog({ open, onOpenChange, role }: Props) {
  const { tenants } = useSuperadminStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!role;

  useEffect(() => {
    if (role) {
      setForm({
        name: role.name, type: role.type, description: role.description,
        isCustom: role.isCustom, tenantId: role.tenantId,
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [role, open]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    const data = {
      ...parsed.data,
      tenantId: parsed.data.type === "Tenant" ? parsed.data.tenantId || undefined : undefined,
    };
    if (isEdit && role) {
      superadminActions.updateRole(role.id, data);
      toast.success(`Role "${data.name}" updated`);
    } else {
      superadminActions.createRole(data);
      toast.success(`Role "${data.name}" created`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit role" : "Create custom role"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Roles define the bundle of permissions a user receives.
          </DialogDescription>
        </DialogHeader>

        <Field label="Role name" error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Scope" error={errors.type}>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as RoleType })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="Platform">Platform</option>
              <option value="Tenant">Tenant</option>
            </select>
          </Field>
          {form.type === "Tenant" && (
            <Field label="Tenant (optional)">
              <select value={form.tenantId ?? ""} onChange={(e) => setForm({ ...form, tenantId: e.target.value || undefined })}
                className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
                <option value="">Available to all tenants</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
          )}
        </div>

        <Field label="Description" error={errors.description}>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-white/5 border-white/10 text-white min-h-[80px]" />
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</Button>
          <Button onClick={submit} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            {isEdit ? "Save changes" : "Create role"}
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
