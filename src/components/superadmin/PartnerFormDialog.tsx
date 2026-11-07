import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import type { Partner } from "@/data/superadminData";
import { superadminActions } from "@/hooks/useSuperadminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const blank = { name: "", type: "Referral Partner" as Partner["type"], country: "", primaryContact: "", contactEmail: "", phone: "", status: "active" as Partner["status"], notes: "" };
const schema = z.object({ name: z.string().trim().min(2).max(120), country: z.string().max(80), primaryContact: z.string().max(100), contactEmail: z.union([z.literal(""), z.string().email()]), phone: z.string().max(40), notes: z.string().max(2000) });

export function PartnerFormDialog({ open, onOpenChange, partner, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; partner?: Partner | null; onSaved?: (partner: Partner) => void }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  useEffect(() => { setForm(partner ? { ...partner } : blank); setError(""); }, [open, partner]);
  const save = () => {
    const result = schema.safeParse(form);
    if (!result.success) { setError(result.error.issues.map((i) => `${i.path.join(" ")}: ${i.message}`).join(" · ")); return; }
    try {
      const saved = superadminActions.savePartner({ ...form, ...result.data, id: partner?.id });
      toast.success(`${saved.name} ${partner ? "updated" : "created"}`);
      onSaved?.(saved); onOpenChange(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save partner"); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="dark bg-background text-foreground border-border max-w-xl max-h-[90vh] overflow-y-auto">
    <DialogHeader><DialogTitle>{partner ? "Edit partner" : "Add partner"}</DialogTitle><DialogDescription>Partner master record</DialogDescription></DialogHeader>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {([['name', 'Partner name'], ['country', 'Country'], ['primaryContact', 'Primary contact'], ['contactEmail', 'Contact email'], ['phone', 'Phone']] as const).map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={`partner-${key}`}>{label}</Label><Input id={`partner-${key}`} type={key === 'contactEmail' ? 'email' : 'text'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>)}
      <div className="space-y-2"><Label>Partner type</Label><Select value={form.type} onValueChange={(type: Partner['type']) => setForm({ ...form, type })}><SelectTrigger aria-label="Partner type"><SelectValue /></SelectTrigger><SelectContent className="dark">{['Distributor', 'Reseller', 'System Integrator', 'Referral Partner'].map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(status: Partner['status']) => setForm({ ...form, status })}><SelectTrigger aria-label="Partner status"><SelectValue /></SelectTrigger><SelectContent className="dark"><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="partner-notes">Notes</Label><Textarea id="partner-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
    </div>
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
    <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save}>Save partner</Button></DialogFooter>
  </DialogContent></Dialog>;
}