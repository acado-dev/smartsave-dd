import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  useCatalogStore, catalogActions, nodePath, isMandatory, mandatoryGaps, effectiveStatus, daysUntil,
  SALES_SOURCES, type CustomerProduct, type SalesSource,
} from "@/hooks/useCatalogStore";
import { Plus, Pencil, Trash2, ShoppingCart, RefreshCw, AlertTriangle, ShieldCheck, Eye } from "lucide-react";
import { toast } from "sonner";

export const fieldCls = "bg-white/5 border-white/10 text-slate-200";
export const selectCls = "w-full h-10 rounded-md px-3 text-sm bg-white/5 border border-white/10 text-slate-200 [&>option]:bg-[hsl(222,47%,10%)]";
export const statusStyle: Record<CustomerProduct["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  expired: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  cancelled: "bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border-[hsl(4,84%,55%)]/30",
};

export function UsageBar({ used = 0, total }: { used?: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const color = pct >= 95 ? "bg-[hsl(4,84%,55%)]" : pct >= 80 ? "bg-amber-400" : "bg-[hsl(187,70%,42%)]";
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="h-1.5 flex-1 rounded bg-white/10 overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${pct}%` }} /></div>
      <span className="text-[11px] text-slate-400 w-9 text-right">{pct}%</span>
    </div>
  );
}

export function ExpiryText({ endDate }: { endDate: string }) {
  const d = daysUntil(endDate);
  if (d === null) return <span className="text-slate-500">Perpetual</span>;
  const cls = d < 0 ? "text-slate-500" : d <= 30 ? "text-[hsl(4,84%,70%)]" : d <= 90 ? "text-amber-300" : "text-slate-300";
  return <span className={cls}>{endDate} <span className="text-[10px]">({d < 0 ? `${-d}d ago` : `${d}d left`})</span></span>;
}

/** Banner listing mandatory catalogue items a customer is missing. */
export function MandatoryStatus({ tenantId }: { tenantId: string }) {
  const store = useCatalogStore();
  const gaps = mandatoryGaps(store, tenantId);
  if (gaps.length === 0)
    return <div className="flex items-center gap-2 text-xs text-emerald-300 p-2 rounded border border-emerald-500/30 bg-emerald-500/10"><ShieldCheck className="h-3.5 w-3.5" /> All mandatory products are subscribed.</div>;
  return (
    <div className="flex items-start gap-2 text-xs text-amber-200 p-2 rounded border border-amber-500/40 bg-amber-500/10">
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <div>Missing mandatory: {gaps.map((g) => <span key={g.id} className="font-medium">{nodePath(store.nodes, g.id)}</span>).reduce((a: React.ReactNode[], el, i) => (i ? [...a, ", ", el] : [el]), [])}</div>
    </div>
  );
}

/** Products purchased and subscriptions held by one customer (tenant). */
export function CustomerProductsPanel({ tenantId, readOnly = false }: { tenantId: string; readOnly?: boolean }) {
  const { customerProducts, skus, nodes } = useCatalogStore();
  const [dlg, setDlg] = useState<{ cp?: CustomerProduct } | null>(null);
  const [view, setView] = useState<CustomerProduct | null>(null);
  const rows = customerProducts.filter((c) => c.tenantId === tenantId);
  const purchases = rows.filter((r) => skus.find((s) => s.id === r.skuId)?.billing === "one-time");
  const subs = rows.filter((r) => skus.find((s) => s.id === r.skuId)?.billing === "subscription");

  const remove = (r: CustomerProduct) => {
    const sku = skus.find((s) => s.id === r.skuId);
    if (sku && isMandatory(nodes, sku.nodeId)) {
      const others = rows.filter((o) => o.id !== r.id && ["active", "pending"].includes(effectiveStatus(o)) && skus.find((s) => s.id === o.skuId && isMandatory(nodes, s.nodeId)));
      if (others.length === 0) return toast.error("This is the customer's only mandatory subscription and cannot be removed. Map a replacement first.");
    }
    catalogActions.deleteCustomerProduct(r.id);
    toast.success("Mapping removed");
  };

  const Row = ({ r }: { r: CustomerProduct }) => {
    const sku = skus.find((s) => s.id === r.skuId);
    if (!sku) return null;
    const st = effectiveStatus(r);
    const mand = isMandatory(nodes, sku.nodeId);
    return (
      <div className="p-3 rounded border border-white/10 bg-white/[0.03]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm text-white truncate flex items-center gap-1.5">{sku.name}
              {mand && <Badge variant="outline" className="h-4 px-1 text-[9px] border-amber-500/40 text-amber-300">MANDATORY</Badge>}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{nodePath(nodes, sku.nodeId)} · <span className="font-mono">{sku.code}</span></div>
          </div>
          <Badge variant="outline" className={statusStyle[st]}>{st}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400">
          <span>Subscribed <span className="text-slate-200">{r.startDate}</span></span>
          <span>Expires <ExpiryText endDate={r.endDate} /></span>
          <span className="col-span-2 flex items-center gap-2">Usage <span className="text-slate-200">{(r.used ?? 0).toLocaleString()} / {r.quantity.toLocaleString()} {r.usageUnit ?? ""}</span><UsageBar used={r.used} total={r.quantity} /></span>
          <span>{r.source} · {r.orderRef}</span>
          <span className="text-white">{(sku.price * r.quantity).toLocaleString()} {sku.currency}{sku.billing === "subscription" ? `/${sku.term === "annual" ? "yr" : "mo"}` : ""}</span>
        </div>
        <div className="flex gap-3 mt-2 justify-end">
          <button onClick={() => setView(r)} className="text-slate-400 hover:text-white" aria-label="View details"><Eye className="h-3.5 w-3.5" /></button>
          {!readOnly && <>
            <button onClick={() => setDlg({ cp: r })} className="text-slate-400 hover:text-white" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={() => remove(r)} className="text-slate-400 hover:text-[hsl(4,84%,75%)]" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
          </>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-slate-500">Products & subscriptions ({rows.length})</div>
        {!readOnly && (
          <Button size="sm" onClick={() => setDlg({})} className="bg-white/10 hover:bg-white/15 text-white h-7"><Plus className="h-3.5 w-3.5 mr-1" /> Map subscription</Button>
        )}
      </div>
      <MandatoryStatus tenantId={tenantId} />
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2"><RefreshCw className="h-3.5 w-3.5" /> Subscriptions ({subs.length})</div>
        <div className="space-y-2">{subs.map((r) => <Row key={r.id} r={r} />)}{subs.length === 0 && <div className="text-xs text-slate-500">None.</div>}</div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2"><ShoppingCart className="h-3.5 w-3.5" /> Purchased products ({purchases.length})</div>
        <div className="space-y-2">{purchases.map((r) => <Row key={r.id} r={r} />)}{purchases.length === 0 && <div className="text-xs text-slate-500">None.</div>}</div>
      </div>
      {dlg && <MappingDialog tenantId={tenantId} cp={dlg.cp} onClose={() => setDlg(null)} />}
      {view && <SubscriptionDetailDialog cp={view} onClose={() => setView(null)} />}
    </div>
  );
}

export function SubscriptionDetailDialog({ cp, tenantName, onClose }: { cp: CustomerProduct; tenantName?: string; onClose: () => void }) {
  const { skus, nodes, relationships } = useCatalogStore();
  const sku = skus.find((s) => s.id === cp.skuId);
  if (!sku) return null;
  const st = effectiveStatus(cp);
  const node = nodes.find((x) => x.id === sku.nodeId);
  const productId = node?.kind === "variant" ? node.parentId : node?.id;
  const requires = relationships.filter((r) => r.fromId === productId && r.type === "requires").map((r) => nodes.find((x) => x.id === r.toId)?.name).filter(Boolean);
  const F = ({ k, v }: { k: string; v: React.ReactNode }) => <div><div className="text-[11px] uppercase tracking-wider text-slate-500">{k}</div><div className="text-sm text-slate-200">{v}</div></div>;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">{sku.name}
            {isMandatory(nodes, sku.nodeId) && <Badge variant="outline" className="border-amber-500/40 text-amber-300">Mandatory</Badge>}
          </DialogTitle>
          <DialogDescription className="text-slate-400">{tenantName ? `${tenantName} · ` : ""}{nodePath(nodes, sku.nodeId)}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <F k="SKU" v={<span className="font-mono">{sku.code}</span>} />
          <F k="Status" v={<Badge variant="outline" className={statusStyle[st]}>{st}</Badge>} />
          <F k="Billing" v={sku.billing === "subscription" ? `Subscription · ${sku.term}` : "One-time purchase"} />
          <F k="Attributes" v={sku.attributes || "—"} />
          <F k="Subscription date" v={cp.startDate} />
          <F k="Expiry date" v={<ExpiryText endDate={cp.endDate} />} />
          <F k="Auto-renew" v={sku.billing === "subscription" ? (cp.autoRenew ? "Yes" : "No") : "—"} />
          <F k="Sold via" v={`${cp.source} · ${cp.orderRef}`} />
          <div className="col-span-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Usage</div>
            <div className="text-sm text-slate-200 mb-1">{(cp.used ?? 0).toLocaleString()} of {cp.quantity.toLocaleString()} {cp.usageUnit ?? "units"} used</div>
            <UsageBar used={cp.used} total={cp.quantity} />
          </div>
          <F k="Value" v={`${(sku.price * cp.quantity).toLocaleString()} ${sku.currency}${sku.billing === "subscription" ? (sku.term === "annual" ? " / year" : " / month") : ""}`} />
          <F k="Assigned to" v={cp.assignedTo || "All locations"} />
          {requires.length > 0 && <div className="col-span-2"><F k="Requires" v={requires.join(", ")} /></div>}
        </div>
        <DialogFooter><Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={onClose}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const addTerm = (start: string, term: string) => {
  if (!start || term === "—") return "";
  const d = new Date(start);
  if (term === "annual") d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export function MappingDialog({ tenantId, tenants, cp, onClose }: {
  tenantId?: string; tenants?: { id: string; name: string }[]; cp?: CustomerProduct; onClose: () => void;
}) {
  const { skus, nodes } = useCatalogStore();
  const sellable = skus.filter((s) => s.status === "approved" || s.id === cp?.skuId);
  const today = new Date().toISOString().slice(0, 10);
  const topCats = nodes.filter((x) => x.parentId === null);
  const catOf = (nodeId: string) => { let c = nodes.find((x) => x.id === nodeId); while (c?.parentId) c = nodes.find((x) => x.id === c!.parentId); return c?.id ?? ""; };
  const initialSku = cp ? skus.find((s) => s.id === cp.skuId) : undefined;
  const [cat, setCat] = useState(initialSku ? catOf(initialSku.nodeId) : topCats[0]?.id ?? "");
  const catSkus = useMemo(() => sellable.filter((s) => catOf(s.nodeId) === cat), [cat, sellable]); // eslint-disable-line react-hooks/exhaustive-deps
  const [f, setF] = useState<Omit<CustomerProduct, "id">>(cp ?? {
    tenantId: tenantId ?? tenants?.[0]?.id ?? "", skuId: "", quantity: 1, used: 0, usageUnit: "stores",
    source: "E-Com Portal", orderRef: "", startDate: today, endDate: "", status: "active", autoRenew: true, assignedTo: "",
  });
  const sku = skus.find((s) => s.id === f.skuId);
  const pickSku = (id: string) => {
    const k = skus.find((s) => s.id === id);
    setF({ ...f, skuId: id, endDate: k?.billing === "subscription" ? addTerm(f.startDate, k.term) : "", usageUnit: k?.attributes.toLowerCase().includes("store") ? "stores" : f.usageUnit });
  };
  const save = () => {
    if (!f.tenantId) return toast.error("Choose a customer");
    if (!f.skuId) return toast.error("Choose a SKU");
    if (f.quantity < 1) return toast.error("Quantity must be at least 1");
    if ((f.used ?? 0) < 0) return toast.error("Usage cannot be negative");
    if (!f.orderRef.trim()) return toast.error("Order / opportunity reference is required");
    if (f.endDate && f.endDate < f.startDate) return toast.error("Expiry date must be after subscription date");
    catalogActions.saveCustomerProduct({ ...f, id: cp?.id });
    toast.success(cp ? "Subscription updated" : "Subscription mapped to customer");
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{cp ? "Edit" : "Map"} product / subscription</DialogTitle>
          <DialogDescription className="text-slate-400">Pick a category, then an approved SKU. Mandatory items are flagged.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {tenants && !cp && (
            <div><Label>Customer</Label>
              <select className={selectCls} value={f.tenantId} onChange={(e) => setF({ ...f, tenantId: e.target.value })}>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          <div><Label>Category</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {topCats.map((c) => (
                <button key={c.id} type="button" onClick={() => { setCat(c.id); setF({ ...f, skuId: "" }); }}
                  className={`text-left p-2 rounded border text-xs ${cat === c.id ? "border-[hsl(187,70%,42%)] bg-[hsl(187,70%,42%)]/10 text-white" : "border-white/10 text-slate-300 hover:bg-white/5"}`}>
                  {c.name}{c.mandatory && <span className="ml-1 text-amber-300">· Mandatory</span>}
                </button>
              ))}
            </div>
          </div>
          <div><Label>Product / SKU</Label>
            <select className={selectCls} value={f.skuId} onChange={(e) => pickSku(e.target.value)}>
              <option value="">Select SKU…</option>
              {catSkus.map((s) => <option key={s.id} value={s.id}>{isMandatory(nodes, s.nodeId) ? "★ " : ""}{s.code} — {nodePath(nodes, s.nodeId).split(" › ").slice(1).join(" › ")} ({s.billing === "subscription" ? s.term : "one-time"})</option>)}
            </select>
            {catSkus.length === 0 && <div className="text-[11px] text-slate-500 mt-1">No approved SKUs in this category yet.</div>}
            {sku && <div className="text-[11px] text-slate-400 mt-1">{sku.price} {sku.currency} {sku.billing === "subscription" ? `per ${sku.term === "annual" ? "year" : "month"}` : "each"} · {sku.attributes}</div>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Quantity</Label><Input type="number" min={1} className={fieldCls} value={f.quantity} onChange={(e) => setF({ ...f, quantity: Number(e.target.value) })} /></div>
            <div><Label>Used</Label><Input type="number" min={0} className={fieldCls} value={f.used ?? 0} onChange={(e) => setF({ ...f, used: Number(e.target.value) })} /></div>
            <div><Label>Unit</Label><Input className={fieldCls} value={f.usageUnit ?? ""} onChange={(e) => setF({ ...f, usageUnit: e.target.value })} placeholder="stores" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Subscription date</Label><Input type="date" className={fieldCls} value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value, endDate: sku?.billing === "subscription" ? addTerm(e.target.value, sku.term) : f.endDate })} /></div>
            <div><Label>Expiry date</Label><Input type="date" className={fieldCls} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Sold via</Label>
              <select className={selectCls} value={f.source} onChange={(e) => setF({ ...f, source: e.target.value as SalesSource })}>{SALES_SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            <div><Label>Order / opportunity ref</Label><Input className={fieldCls} value={f.orderRef} onChange={(e) => setF({ ...f, orderRef: e.target.value })} placeholder="SF-OPP-… / EC-…" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Status</Label>
              <select className={selectCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as CustomerProduct["status"] })}>
                <option value="active">Active</option><option value="pending">Pending</option><option value="expired">Expired</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><Label>Assigned to</Label><Input className={fieldCls} value={f.assignedTo ?? ""} onChange={(e) => setF({ ...f, assignedTo: e.target.value })} placeholder="All locations" /></div>
          </div>
          {sku?.billing === "subscription" && (
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.autoRenew} onChange={(e) => setF({ ...f, autoRenew: e.target.checked })} /> Auto-renew at expiry</label>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={onClose}>Cancel</Button>
          <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white" onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
