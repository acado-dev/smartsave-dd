import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { toast } from "sonner";
import type { GuardrailRule, ModuleKey } from "@/data/superadminData";
import { superadminActions, useSuperadminStore } from "@/hooks/useSuperadminStore";
import { modules } from "@/data/superadminData";

const schema = z.object({
  name: z.string().trim().min(3).max(80),
  module: z.enum(["roos", "goal-console", "pricing-os", "perishables", "promotions", "admin"]),
  trigger: z.string().trim().min(5).max(200),
  approvers: z.array(z.string()).min(1, "Pick at least one approver role"),
  escalateAfterHours: z.coerce.number().int().min(1).max(168),
  overrideRoleId: z.string().min(1),
  status: z.enum(["active", "draft"]),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  rule?: GuardrailRule | null;
}

const empty: Omit<GuardrailRule, "id"> = {
  name: "",
  module: "admin",
  trigger: "",
  approvers: [],
  escalateAfterHours: 4,
  overrideRoleId: "",
  status: "draft",
};

export function GuardrailFormDialog({ open, onOpenChange, rule }: Props) {
  const { roles } = useSuperadminStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = !!rule;

  useEffect(() => {
    if (rule) {
      const { id, ...rest } = rule;
      setForm(rest);
    } else {
      setForm(empty);
    }
    setErrors({});
  }, [rule, open]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    const data = { ...parsed.data, module: parsed.data.module as ModuleKey } as Omit<GuardrailRule, "id">;
    if (isEdit && rule) {
      superadminActions.updateGuardrail(rule.id, data);
      toast.success(`Guardrail "${data.name}" updated`);
    } else {
      superadminActions.createGuardrail(data);
      toast.success(`Guardrail "${data.name}" created`);
    }
    onOpenChange(false);
  };

  const toggleApprover = (id: string) => {
    setForm((f) => ({
      ...f,
      approvers: f.approvers.includes(id) ? f.approvers.filter((x) => x !== id) : [...f.approvers, id],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Edit guardrail" : "New guardrail"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Define approval workflows and override authority for high-impact actions.
          </DialogDescription>
        </DialogHeader>

        <Field label="Name" error={errors.name}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10 text-white" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Module" error={errors.module}>
            <select value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value as ModuleKey })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              {modules.map((m) => <option key={m.key} value={m.key}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Status" error={errors.status}>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as GuardrailRule["status"] })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
        </div>

        <Field label="Trigger condition" error={errors.trigger}>
          <Textarea value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })}
            placeholder="e.g. Markdown depth exceeds 30%"
            className="bg-white/5 border-white/10 text-white min-h-[70px]" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Escalate after (hours)" error={errors.escalateAfterHours}>
            <Input type="number" min={1} max={168} value={form.escalateAfterHours}
              onChange={(e) => setForm({ ...form, escalateAfterHours: Number(e.target.value) })}
              className="bg-white/5 border-white/10 text-white" />
          </Field>
          <Field label="Override authority (role)" error={errors.overrideRoleId}>
            <select value={form.overrideRoleId} onChange={(e) => setForm({ ...form, overrideRoleId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 h-10 text-sm">
              <option value="">— Select role —</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
        </div>

        <div>
          <Label className="text-slate-300 text-xs uppercase tracking-wider">Approver roles</Label>
          {errors.approvers && <div className="text-xs text-[hsl(4,84%,75%)] mt-1">{errors.approvers}</div>}
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
            {roles.map((r) => (
              <label key={r.id} className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07]">
                <Checkbox checked={form.approvers.includes(r.id)} onCheckedChange={() => toggleApprover(r.id)} />
                <span className="text-sm text-white">{r.name}</span>
                <span className="text-[10px] text-slate-500 ml-auto">{r.type}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-white/20 text-white hover:bg-white/5">Cancel</Button>
          <Button onClick={submit} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            {isEdit ? "Save changes" : "Create guardrail"}
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
