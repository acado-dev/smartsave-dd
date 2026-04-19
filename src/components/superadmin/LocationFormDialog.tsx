import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { toast } from "sonner";
import type { Location } from "@/data/superadminData";
import { superadminActions, useSuperadminStore } from "@/hooks/useSuperadminStore";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  type: z.enum(["BusinessUnit", "HQ", "Country", "Region", "Store", "Department"]),
  parentId: z.string().nullable(),
  code: z.string().trim().max(20).optional(),
  tenantId: z.string().min(1),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tenantId: string;
  location?: Location | null;
  defaultParentId?: string | null;
}

export function LocationFormDialog({ open, onOpenChange, tenantId, location, defaultParentId }: Props) {
  const { locations } = useSuperadminStore();
  const isEdit = !!location;
  const [form, setForm] = useState({
    name: "",
    type: "Store" as Location["type"],
    parentId: defaultParentId ?? null,
    code: "",
    tenantId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location) {
      setForm({ name: location.name, type: location.type, parentId: location.parentId, code: location.code ?? "", tenantId: location.tenantId });
    } else {
      setForm({ name: "", type: "Store", parentId: defaultParentId ?? null, code: "", tenantId });
    }
    setErrors({});
  }, [location, defaultParentId, tenantId, open]);

  const tenantLocations = locations.filter((l) => l.tenantId === tenantId && l.id !== location?.id);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    const data = { ...parsed.data, code: parsed.data.code || undefined };
    if (isEdit && location) {
      superadminActions.updateLocation(location.id, data);
      toast.success(`${data.name} updated`);
    } else {
      superadminActions.createLocation(data);
      toast.success(`${data.name} added`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit org node" : "Add org node"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Build the tenant hierarchy: HQ → Region → Store → Department.
          </DialogDescription>
        </DialogHeader>

        <Field label="Name" error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" error={errors.type}>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Location["type"] })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="HQ">HQ</option>
              <option value="BusinessUnit">Business Unit</option>
              <option value="Country">Country</option>
              <option value="Region">Region</option>
              <option value="Store">Store</option>
              <option value="Department">Department</option>
            </select>
          </Field>
          <Field label="Code (optional)">
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="bg-white/5 border-white/10 text-white" />
          </Field>
        </div>

        <Field label="Parent">
          <select value={form.parentId ?? ""} onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
            className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
            <option value="">— Root —</option>
            {tenantLocations.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.type})</option>)}
          </select>
        </Field>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</Button>
          <Button onClick={submit} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            {isEdit ? "Save changes" : "Add node"}
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
