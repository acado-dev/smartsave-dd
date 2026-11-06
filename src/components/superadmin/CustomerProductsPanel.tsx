import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCatalogStore, catalogActions, nodePath, SALES_SOURCES, type CustomerProduct, type SalesSource } from "@/hooks/useCatalogStore";
import { Plus, Pencil, Trash2, ShoppingCart, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const fieldCls = "bg-white/5 border-white/10 text-slate-200";
const selectCls = "w-full h-10 rounded-md px-3 text-sm bg-white/5 border border-white/10 text-slate-200 [&>option]:bg-[hsl(222,47%,10%)]";
const statusStyle: Record<CustomerProduct["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  expired: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  cancelled: "bg-[hsl(4,84%,55%)]/15 text-[hsl(4,84%,75%)] border-[hsl(4,84%,55%)]/30",
};

/** Products purchased and subscriptions held by one customer (tenant). */
export function CustomerProductsPanel({ tenantId, readOnly = false }: { tenantId: string; readOnly?: boolean }) {
  const { customerProducts, skus, nodes } = useCatalogStore();
  const [dlg, setDlg] = useState<{ cp?: CustomerProduct } | null>(null);
  const rows = customerProducts.filter((c) => c.tenantId === tenantId);
  const purchases = rows.filter((r) => skus.find((s) => s.id === r.skuId)?.billing === "one-time");
  const subs = rows.filter((r) => skus.find((s) => s.id === r.skuId)?.billing === "subscription");

  const Row = ({ r }: { r: CustomerProduct }) => {
    const sku = skus.find((s) => s.id === r.skuId);
    if (!sku) return null;
    return (
      <div className="p-3 rounded border border-white/10 bg-white/[0.03]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm text-white truncate">{sku.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{nodePath(nodes, sku.nodeId)} · <span className="font-mono">{sku.code}</span></div>
          </div>
          <Badge variant="outline" className={statusStyle[r.status]}>{r.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400">
          <span>Qty <span className="text-white">{r.quantity.toLocaleString()}</span></span>
          <span>{r.source} · {r.orderRef}</span>
          <span>{r.startDate}{r.endDate ? ` → ${r.endDate}` : ""}</span>
          <span className="text-white">{(sku.price * r.quantity).toLocaleString()} {sku.currency}{sku.billing === "subscription" ? `/${sku.term === "annual" ? "yr" : "mo"}` : ""}</span>
        </div>
        {!readOnly && (
          <div className="flex gap-3 mt-2 justify-end">
            <button onClick={() => setDlg({ cp: r })} className="text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={() => { catalogActions.deleteCustomerProduct(r.id); toast.success("Mapping removed"); }} className="text-slate-400 hover:text-[hsl(4,84%,75%)]"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-slate-500">Products & subscriptions ({rows.length})</div>
        {!readOnly && (
          <Button size="sm" onClick={() => setDlg({})} className="bg-white/10 hover:bg-white/15 text-white h-7"><Plus className="h-3.5 w-3.5 mr-1" /> Map product</Button>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2"><ShoppingCart className="h-3.5 w-3.5" /> Purchased products ({purchases.length})</div>
        <div className="space-y-2">{purchases.map((r) => <Row key={r.id} r={r} />)}{purchases.length === 0 && <div className="text-xs text-slate-500">None.</div>}</div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2"><RefreshCw className="h-3.5 w-3.5" /> Subscriptions ({subs.length})</div>
        <div className="space-y-2">{subs.map((r) => <Row key={r.id} r={r} />)}{subs.length === 0 && <div className="text-xs text-slate-500">None.</div>}</div>
      </div>
      {dlg && <MappingDialog tenantId={tenantId} cp={dlg.cp} onClose={() => setDlg(null)} />}
    </div>
  );
}

function MappingDialog({ tenantId, cp, onClose }: { tenantId: string; cp?: CustomerProduct; onClose: () => void }) {
  const { skus, nodes } = useCatalogStore();
  const sellable = skus.filter((s) => s.status === "approved" || s.id === cp?.skuId);
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState<Omit<CustomerProduct, "id">>(cp ?? {
    tenantId, skuId: sellable[0]?.id ?? "", quantity: 1, source: "E-Com Portal", orderRef: "", startDate: today, endDate: "", status: "active",
  });
  const sku = skus.find((s) => s.id === f.skuId);
  const save = () => {
    if (!f.skuId) return toast.error("Choose a SKU");
    if (f.quantity < 1) return toast.error("Quantity must be at least 1");
    if (!f.orderRef.trim()) return toast.error("Order / opportunity reference is required");
    if (f.endDate && f.endDate < f.startDate) return toast.error("End date must be after start date");
    catalogActions.saveCustomerProduct({ ...f, id: cp?.id });
    toast.success(cp ? "Mapping updated" : "Product mapped to customer");
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">{cp ? "Edit" : "Map"} product / subscription</DialogTitle>
          <DialogDescription className="text-slate-400">Only approved catalogue SKUs can be mapped.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>SKU</Label>
            <select className={selectCls} value={f.skuId} onChange={(e) => setF({ ...f, skuId: e.target.value })}>
              {sellable.map((s) => <option key={s.id} value={s.id}>{s.code} — {nodePath(nodes, s.nodeId)} ({s.billing === "subscription" ? s.term : "one-time"})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Quantity</Label><Input type="number" min={1} className={fieldCls} value={f.quantity} onChange={(e) => setF({ ...f, quantity: Number(e.target.value) })} /></div>
            <div><Label>Sold via</Label>
              <select className={selectCls} value={f.source} onChange={(e) => setF({ ...f, source: e.target.value as SalesSource })}>{SALES_SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
          </div>
          <div><Label>Order / opportunity reference</Label><Input className={fieldCls} value={f.orderRef} onChange={(e) => setF({ ...f, orderRef: e.target.value })} placeholder="EC-55120 or SF-OPP-10234" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Start</Label><Input type="date" className={fieldCls} value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} /></div>
            <div><Label>{sku?.billing === "subscription" ? "Renewal / end" : "End (optional)"}</Label><Input type="date" className={fieldCls} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} /></div>
            <div><Label>Status</Label>
              <select className={selectCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as CustomerProduct["status"] })}>
                {["active", "pending", "expired", "cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={onClose}>Cancel</Button>
          <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white" onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
