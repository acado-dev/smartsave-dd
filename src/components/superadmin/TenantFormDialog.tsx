import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "sonner";
import { modules, type Tenant, type TenantTier, type ModuleKey } from "@/data/superadminData";
import { superadminActions } from "@/hooks/useSuperadminStore";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  industry: z.string().trim().min(2, "Industry is required").max(80),
  country: z.string().trim().min(2, "Country is required").max(60),
  tier: z.enum(["Enterprise", "Mid-Market", "SMB", "Single-Store"]),
  status: z.enum(["active", "suspended", "trial"]),
  primaryContact: z.string().trim().min(2, "Contact name required").max(80),
  contactEmail: z.string().trim().email("Invalid email").max(120),
  storesCount: z.coerce.number().int().min(0).max(100000),
  monthlyRevenue: z.coerce.number().min(0).max(10000000),
  modules: z.array(z.string()).min(1, "Select at least one module"),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tenant?: Tenant | null;
}

const empty = {
  name: "",
  industry: "",
  country: "",
  tier: "SMB" as TenantTier,
  status: "trial" as Tenant["status"],
  primaryContact: "",
  contactEmail: "",
  storesCount: 1,
  monthlyRevenue: 0,
  modules: ["admin"] as string[],
};

export function TenantFormDialog({ open, onOpenChange, tenant }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!tenant;

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name, industry: tenant.industry, country: tenant.country,
        tier: tenant.tier, status: tenant.status,
        primaryContact: tenant.primaryContact, contactEmail: tenant.contactEmail,
        storesCount: tenant.storesCount, monthlyRevenue: tenant.monthlyRevenue,
        modules: [...tenant.modules],
      });
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [tenant, open]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    const data = { ...parsed.data, modules: parsed.data.modules as ModuleKey[] };
    if (isEdit && tenant) {
      superadminActions.updateTenant(tenant.id, data);
      toast.success(`${data.name} updated`);
    } else {
      superadminActions.createTenant(data);
      toast.success(`${data.name} provisioned`);
    }
    onOpenChange(false);
  };

  const toggleModule = (k: string) => {
    setForm((f) => ({
      ...f,
      modules: f.modules.includes(k) ? f.modules.filter((m) => m !== k) : [...f.modules, k],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit tenant" : "Provision new tenant"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEdit ? "Update tenant details, modules, and status." : "Create a client organization with module access."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tenant name" error={errors.name}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Industry" error={errors.industry}>
            <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Country" error={errors.country}>
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Tier" error={errors.tier}>
            <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as TenantTier })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="SMB">SMB</option>
              <option value="Single-Store">Single-Store</option>
            </select>
          </Field>
          <Field label="Primary contact" error={errors.primaryContact}>
            <Input value={form.primaryContact} onChange={(e) => setForm({ ...form, primaryContact: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Contact email" error={errors.contactEmail}>
            <Input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Stores" error={errors.storesCount}>
            <Input type="number" value={form.storesCount} onChange={(e) => setForm({ ...form, storesCount: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Monthly revenue (USD)" error={errors.monthlyRevenue}>
            <Input type="number" value={form.monthlyRevenue} onChange={(e) => setForm({ ...form, monthlyRevenue: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Status" error={errors.status}>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Tenant["status"] })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </Field>
        </div>

        <div>
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Modules enabled</Label>
          {errors.modules && <div className="text-xs text-[hsl(4,84%,75%)] mt-1">{errors.modules}</div>}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {modules.map((m) => (
              <label key={m.key} className="flex items-start gap-2 p-3 rounded bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07]">
                <Checkbox checked={form.modules.includes(m.key)} onCheckedChange={() => toggleModule(m.key)} className="mt-0.5" />
                <div>
                  <div className="text-sm text-white">{m.name}</div>
                  <div className="text-[11px] text-slate-400">{m.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</Button>
          <Button onClick={submit} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            {isEdit ? "Save changes" : "Provision tenant"}
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
