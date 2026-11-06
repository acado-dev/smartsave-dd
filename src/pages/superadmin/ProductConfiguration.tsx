import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/superadmin/ConfirmDeleteDialog";
import { usePersonaGuard } from "@/hooks/usePersonaGuard";
import {
  useCatalogStore, catalogActions, nodePath, descendantIds, CHANNELS, RELATION_TYPES,
  type CatalogNode, type NodeKind, type Sku, type Channel, type RelationType, type LifecycleStatus,
} from "@/hooks/useCatalogStore";
import { ChevronRight, ChevronDown, FolderTree, Package, Layers, Plus, Pencil, Trash2, Tag, Link2, Send, Search, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const fieldCls = "bg-white/5 border-white/10 text-slate-200";
const selectCls = "w-full h-10 rounded-md px-3 text-sm bg-white/5 border border-white/10 text-slate-200 [&>option]:bg-[hsl(222,47%,10%)]";
const kindIcon: Record<NodeKind, any> = { group: FolderTree, product: Package, variant: Layers };
const kindLabel: Record<NodeKind, string> = { group: "Category", product: "Product", variant: "Model / Variant" };
const statusStyle: Record<LifecycleStatus, string> = {
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  draft: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  retired: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};
/** Which child kinds a node may hold. Categories nest to unlimited depth. */
const allowedChildren = (k: NodeKind | null): NodeKind[] =>
  k === null ? ["group"] : k === "group" ? ["group", "product"] : k === "product" ? ["variant"] : [];

export default function ProductConfiguration() {
  usePersonaGuard("products");
  const { nodes, skus, relationships, systems, catalogVersion, customerProducts } = useCatalogStore();
  const [selectedId, setSelectedId] = useState<string | null>("c-hw");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["c-hw", "f-esl", "s-pseries", "p-presto"]));
  const [nodeDlg, setNodeDlg] = useState<{ node?: CatalogNode; parentId: string | null; kind: NodeKind } | null>(null);
  const [skuDlg, setSkuDlg] = useState<{ sku?: Sku; nodeId?: string } | null>(null);
  const [relDlg, setRelDlg] = useState(false);
  const [delNode, setDelNode] = useState<CatalogNode | null>(null);
  const [delSku, setDelSku] = useState<Sku | null>(null);
  const [skuQ, setSkuQ] = useState("");

  const selected = nodes.find((x) => x.id === selectedId) ?? null;
  const children = (pid: string | null) => nodes.filter((x) => x.parentId === pid);
  const toggle = (id: string) => setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const subtreeSkus = useMemo(() => {
    if (!selected) return [];
    const ids = new Set(descendantIds(nodes, selected.id));
    return skus.filter((s) => ids.has(s.nodeId));
  }, [selected, nodes, skus]);

  const renderTree = (pid: string | null, depth = 0): JSX.Element[] =>
    children(pid).map((node) => {
      const kids = children(node.id);
      const Icon = kindIcon[node.kind];
      const open = expanded.has(node.id);
      return (
        <div key={node.id}>
          <div
            onClick={() => setSelectedId(node.id)}
            className={`flex items-center gap-1.5 py-1.5 pr-2 rounded cursor-pointer text-sm ${selectedId === node.id ? "bg-[hsl(217,91%,60%)]/15 text-white" : "text-slate-300 hover:bg-white/5"}`}
            style={{ paddingLeft: 6 + depth * 16 }}
          >
            <button onClick={(e) => { e.stopPropagation(); toggle(node.id); }} className="w-4 text-slate-500">
              {kids.length > 0 ? (open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : null}
            </button>
            <Icon className={`h-3.5 w-3.5 shrink-0 ${node.kind === "group" ? "text-[hsl(187,70%,55%)]" : node.kind === "product" ? "text-[hsl(217,91%,70%)]" : "text-slate-400"}`} />
            <span className="truncate flex-1">{node.name}</span>
            {node.status !== "approved" && <span className="text-[9px] uppercase text-amber-300">{node.status}</span>}
          </div>
          {open && renderTree(node.id, depth + 1)}
        </div>
      );
    });

  const filteredSkus = skus.filter((s) =>
    `${s.code} ${s.name} ${nodePath(nodes, s.nodeId)}`.toLowerCase().includes(skuQ.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Configuration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Approved Ithina catalogue · {nodes.filter((x) => x.kind === "product").length} products · {skus.length} SKUs · draft v{catalogVersion}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5"
            onClick={() => { catalogActions.reset(); toast.success("Catalogue reset to seed data"); }}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={() => setNodeDlg({ parentId: null, kind: "group" })} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white">
            <Plus className="h-4 w-4 mr-2" /> New top-level category
          </Button>
        </div>
      </div>

      <Tabs defaultValue="catalogue">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="skus">SKUs</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        {/* ── Catalogue tree ── */}
        <TabsContent value="catalogue" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3 max-h-[640px] overflow-auto">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 px-2 mb-2">Catalogue hierarchy</div>
                {renderTree(null)}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                {!selected ? (
                  <div className="text-slate-400 text-sm">Select a node in the hierarchy.</div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="text-xs text-slate-500">{nodePath(nodes, selected.id)}</div>
                        <h2 className="text-xl font-semibold text-white mt-1">{selected.name}</h2>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="border-white/15 text-slate-300">{kindLabel[selected.kind]}</Badge>
                          <Badge variant="outline" className="border-white/15 text-slate-300 font-mono">{selected.code}</Badge>
                          <Badge variant="outline" className={statusStyle[selected.status]}>{selected.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5"
                          onClick={() => setNodeDlg({ node: selected, parentId: selected.parentId, kind: selected.kind })}>
                          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent border-[hsl(4,84%,55%)]/40 text-[hsl(4,84%,75%)] hover:bg-[hsl(4,84%,55%)]/10"
                          onClick={() => setDelNode(selected)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                        </Button>
                      </div>
                    </div>
                    {selected.description && <p className="text-sm text-slate-400">{selected.description}</p>}

                    <div className="flex flex-wrap gap-2">
                      {allowedChildren(selected.kind).map((k) => (
                        <Button key={k} size="sm" onClick={() => { setNodeDlg({ parentId: selected.id, kind: k }); setExpanded((s) => new Set(s).add(selected.id)); }}
                          className="bg-white/10 hover:bg-white/15 text-white">
                          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add {k === "group" ? "sub-category" : kindLabel[k].toLowerCase()}
                        </Button>
                      ))}
                      {selected.kind !== "group" && (
                        <Button size="sm" onClick={() => setSkuDlg({ nodeId: selected.id })} className="bg-white/10 hover:bg-white/15 text-white">
                          <Tag className="h-3.5 w-3.5 mr-1.5" /> Add SKU
                        </Button>
                      )}
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Direct children ({children(selected.id).length})</div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {children(selected.id).map((c) => {
                          const Icon = kindIcon[c.kind];
                          return (
                            <button key={c.id} onClick={() => { setSelectedId(c.id); setExpanded((s) => new Set(s).add(selected.id)); }}
                              className="text-left p-3 rounded border border-white/10 bg-white/[0.03] hover:border-[hsl(217,91%,60%)]/40">
                              <div className="flex items-center gap-2 text-sm text-white"><Icon className="h-3.5 w-3.5 text-slate-400" />{c.name}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{kindLabel[c.kind]} · {c.code}</div>
                            </button>
                          );
                        })}
                        {children(selected.id).length === 0 && <div className="text-sm text-slate-500">None yet.</div>}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">SKUs in this branch ({subtreeSkus.length})</div>
                      <SkuTable skus={subtreeSkus} nodes={nodes} onEdit={(s) => setSkuDlg({ sku: s })} onDelete={setDelSku} />
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Relationships</div>
                      <div className="space-y-1">
                        {relationships.filter((r) => r.fromId === selected.id || r.toId === selected.id).map((r) => (
                          <div key={r.id} className="text-sm text-slate-300">
                            {nodes.find((x) => x.id === r.fromId)?.name} <span className="text-[hsl(187,70%,60%)]">{r.type}</span> {nodes.find((x) => x.id === r.toId)?.name}
                          </div>
                        ))}
                        {!relationships.some((r) => r.fromId === selected.id || r.toId === selected.id) && <div className="text-sm text-slate-500">None.</div>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── SKUs ── */}
        <TabsContent value="skus" className="mt-4 space-y-3">
          <div className="flex gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input placeholder="Search SKUs…" value={skuQ} onChange={(e) => setSkuQ(e.target.value)} className={`pl-9 ${fieldCls}`} />
            </div>
            <Button onClick={() => setSkuDlg({})} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white"><Plus className="h-4 w-4 mr-2" /> New SKU</Button>
          </div>
          <Card className="bg-white/5 border-white/10"><CardContent className="p-0">
            <SkuTable skus={filteredSkus} nodes={nodes} onEdit={(s) => setSkuDlg({ sku: s })} onDelete={setDelSku} showPath customerProducts={customerProducts} />
          </CardContent></Card>
        </TabsContent>

        {/* ── Relationships ── */}
        <TabsContent value="relationships" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button onClick={() => setRelDlg(true)} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white"><Link2 className="h-4 w-4 mr-2" /> New relationship</Button>
          </div>
          <Card className="bg-white/5 border-white/10"><CardContent className="p-0 divide-y divide-white/5">
            {relationships.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div className="text-slate-200">
                  {nodePath(nodes, r.fromId)} <Badge variant="outline" className="mx-2 border-[hsl(187,70%,42%)]/40 text-[hsl(187,70%,62%)]">{r.type}</Badge> {nodePath(nodes, r.toId)}
                </div>
                <button onClick={() => { catalogActions.deleteRelationship(r.id); toast.success("Relationship removed"); }} className="text-slate-500 hover:text-[hsl(4,84%,75%)]"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {relationships.length === 0 && <div className="p-4 text-sm text-slate-500">No relationships defined.</div>}
          </CardContent></Card>
        </TabsContent>

        {/* ── Publishing ── */}
        <TabsContent value="publishing" className="mt-4">
          <PublishPanel systems={systems} version={catalogVersion} approvedSkus={skus.filter((s) => s.status === "approved").length} />
        </TabsContent>
      </Tabs>

      {nodeDlg && <NodeDialog {...nodeDlg} nodes={nodes} onClose={() => setNodeDlg(null)} onSaved={(id) => id && setSelectedId(id)} />}
      {skuDlg && <SkuDialog sku={skuDlg.sku} nodeId={skuDlg.nodeId} nodes={nodes} onClose={() => setSkuDlg(null)} />}
      {relDlg && <RelationshipDialog nodes={nodes} onClose={() => setRelDlg(false)} />}

      <ConfirmDeleteDialog
        open={!!delNode} onOpenChange={(o) => !o && setDelNode(null)}
        title={`Delete ${delNode?.name}?`}
        description="This removes the node, everything beneath it, its SKUs, relationships and any customer mappings to those SKUs."
        onConfirm={() => { if (delNode) { catalogActions.deleteNode(delNode.id); toast.success(`${delNode.name} deleted`); setSelectedId(delNode.parentId); setDelNode(null); } }}
      />
      <ConfirmDeleteDialog
        open={!!delSku} onOpenChange={(o) => !o && setDelSku(null)}
        title={`Delete SKU ${delSku?.code}?`}
        description="Customer product mappings using this SKU will also be removed."
        onConfirm={() => { if (delSku) { catalogActions.deleteSku(delSku.id); toast.success("SKU deleted"); setDelSku(null); } }}
      />
    </div>
  );
}

function SkuTable({ skus, nodes, onEdit, onDelete, showPath, customerProducts }: {
  skus: Sku[]; nodes: CatalogNode[]; onEdit: (s: Sku) => void; onDelete: (s: Sku) => void; showPath?: boolean;
  customerProducts?: { skuId: string }[];
}) {
  if (skus.length === 0) return <div className="text-sm text-slate-500 p-3">No SKUs.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-slate-500">
          <tr className="border-b border-white/10">
            <th className="text-left p-3">SKU</th>
            {showPath && <th className="text-left p-3">Catalogue path</th>}
            <th className="text-left p-3">Billing</th>
            <th className="text-right p-3">Price</th>
            <th className="text-left p-3">Channels</th>
            {customerProducts && <th className="text-right p-3">Customers</th>}
            <th className="text-left p-3">Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {skus.map((s) => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-3"><div className="font-mono text-white text-xs">{s.code}</div><div className="text-xs text-slate-400">{s.name}</div></td>
              {showPath && <td className="p-3 text-xs text-slate-400">{nodePath(nodes, s.nodeId)}</td>}
              <td className="p-3 text-xs text-slate-300">{s.billing === "subscription" ? `Subscription · ${s.term}` : "One-time"}</td>
              <td className="p-3 text-right text-white">{s.price.toLocaleString()} {s.currency}</td>
              <td className="p-3"><div className="flex flex-wrap gap-1">{s.channels.map((c) => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{c}</span>)}</div></td>
              {customerProducts && <td className="p-3 text-right text-slate-300">{new Set(customerProducts.filter((c) => c.skuId === s.id).map((c: any) => c.tenantId)).size}</td>}
              <td className="p-3"><Badge variant="outline" className={statusStyle[s.status]}>{s.status}</Badge></td>
              <td className="p-3 whitespace-nowrap text-right">
                <button onClick={() => onEdit(s)} className="text-slate-400 hover:text-white mr-2"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => onDelete(s)} className="text-slate-400 hover:text-[hsl(4,84%,75%)]"><Trash2 className="h-3.5 w-3.5" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NodeDialog({ node, parentId, kind, nodes, onClose, onSaved }: {
  node?: CatalogNode; parentId: string | null; kind: NodeKind; nodes: CatalogNode[]; onClose: () => void; onSaved: (id?: string) => void;
}) {
  const [f, setF] = useState({ name: node?.name ?? "", code: node?.code ?? "", description: node?.description ?? "", status: node?.status ?? ("draft" as LifecycleStatus), mandatory: node?.mandatory ?? false });
  const parent = nodes.find((x) => x.id === parentId);
  const save = () => {
    if (!f.name.trim() || !f.code.trim()) return toast.error("Name and code are required");
    const dup = nodes.find((x) => x.code.toLowerCase() === f.code.trim().toLowerCase() && x.id !== node?.id);
    if (dup) return toast.error(`Code already used by ${dup.name}`);
    catalogActions.saveNode({ id: node?.id, parentId, kind, ...f, name: f.name.trim(), code: f.code.trim().toUpperCase() });
    toast.success(node ? "Saved" : `${kindLabel[kind]} created`);
    onSaved(node?.id);
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">{node ? "Edit" : "New"} {kind === "group" && parent ? "sub-category" : kindLabel[kind].toLowerCase()}</DialogTitle>
          <DialogDescription className="text-slate-400">{parent ? `Under ${nodePath(nodes, parent.id)}` : "Top-level catalogue category"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name</Label><Input className={fieldCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. P Series" /></div>
            <div><Label>Code</Label><Input className={`${fieldCls} font-mono`} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="ESL-P" /></div>
          </div>
          <div><Label>Description</Label><Textarea className={fieldCls} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div><Label>Lifecycle status</Label>
            <select className={selectCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as LifecycleStatus })}>
              <option value="draft">Draft</option><option value="approved">Approved</option><option value="retired">Retired</option>
            </select>
          </div>
          {kind !== "variant" && (
            <label className="flex items-start gap-2 p-3 rounded border border-white/10 bg-white/[0.03] cursor-pointer">
              <input type="checkbox" className="mt-1" checked={f.mandatory} onChange={(e) => setF({ ...f, mandatory: e.target.checked })} />
              <span><span className="text-sm text-white">Mandatory for every customer</span><br />
              <span className="text-xs text-slate-400">Each organisation / tenant must hold an active SKU from this {kind === "group" ? "category" : "product"} (e.g. Ithina Core).</span></span>
            </label>
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

function SkuDialog({ sku, nodeId, nodes, onClose }: { sku?: Sku; nodeId?: string; nodes: CatalogNode[]; onClose: () => void }) {
  const targets = nodes.filter((x) => x.kind !== "group");
  const [f, setF] = useState<Omit<Sku, "id">>(sku ?? {
    nodeId: nodeId ?? targets[0]?.id ?? "", code: "", name: "", attributes: "", billing: "one-time", term: "—",
    price: 0, currency: "EUR", channels: ["Direct Sales"], status: "draft",
  });
  const toggleCh = (c: Channel) => setF({ ...f, channels: f.channels.includes(c) ? f.channels.filter((x) => x !== c) : [...f.channels, c] });
  const save = () => {
    if (!f.code.trim() || !f.name.trim() || !f.nodeId) return toast.error("SKU code, name and product are required");
    if (f.channels.length === 0) return toast.error("Select at least one sales channel");
    catalogActions.saveSku({ ...f, id: sku?.id, code: f.code.trim().toUpperCase() });
    toast.success(sku ? "SKU saved" : "SKU created");
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200 max-w-lg">
        <DialogHeader><DialogTitle className="text-white">{sku ? "Edit SKU" : "New SKU"}</DialogTitle>
          <DialogDescription className="text-slate-400">Create a SKU only when the difference affects selling, fulfilment, licensing or provisioning.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Product / variant</Label>
            <select className={selectCls} value={f.nodeId} onChange={(e) => setF({ ...f, nodeId: e.target.value })}>
              {targets.map((t) => <option key={t.id} value={t.id}>{nodePath(nodes, t.id)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>SKU code</Label><Input className={`${fieldCls} font-mono`} value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></div>
            <div><Label>Name</Label><Input className={fieldCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          </div>
          <div><Label>Distinguishing attributes</Label><Input className={fieldCls} value={f.attributes} onChange={(e) => setF({ ...f, attributes: e.target.value })} placeholder="Colour · region · connectivity · firmware" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Billing</Label>
              <select className={selectCls} value={f.billing} onChange={(e) => { const b = e.target.value as Sku["billing"]; setF({ ...f, billing: b, term: b === "subscription" ? "monthly" : "—" }); }}>
                <option value="one-time">One-time</option><option value="subscription">Subscription</option>
              </select>
            </div>
            <div><Label>Term</Label>
              <select className={selectCls} value={f.term} disabled={f.billing !== "subscription"} onChange={(e) => setF({ ...f, term: e.target.value as Sku["term"] })}>
                {f.billing === "subscription" ? <><option value="monthly">Monthly</option><option value="annual">Annual</option></> : <option value="—">—</option>}
              </select>
            </div>
            <div><Label>Status</Label>
              <select className={selectCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as LifecycleStatus })}>
                <option value="draft">Draft</option><option value="approved">Approved</option><option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>List price</Label><Input type="number" min={0} className={fieldCls} value={f.price} onChange={(e) => setF({ ...f, price: Math.max(0, Number(e.target.value)) })} /></div>
            <div><Label>Currency</Label>
              <select className={selectCls} value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })}>
                {["EUR", "USD", "PLN", "GBP", "INR"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><Label>Sales channels</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {CHANNELS.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm"><Checkbox checked={f.channels.includes(c)} onCheckedChange={() => toggleCh(c)} />{c}</label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={onClose}>Cancel</Button>
          <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white" onClick={save}>Save SKU</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RelationshipDialog({ nodes, onClose }: { nodes: CatalogNode[]; onClose: () => void }) {
  const products = nodes.filter((x) => x.kind !== "group");
  const [fromId, setFrom] = useState(products[0]?.id ?? "");
  const [toId, setTo] = useState(products[1]?.id ?? "");
  const [type, setType] = useState<RelationType>("requires");
  const save = () => {
    if (fromId === toId) return toast.error("Choose two different products");
    catalogActions.addRelationship({ fromId, toId, type });
    toast.success("Relationship added");
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[hsl(222,47%,8%)] border-white/10 text-slate-200">
        <DialogHeader><DialogTitle className="text-white">New product relationship</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Product</Label><select className={selectCls} value={fromId} onChange={(e) => setFrom(e.target.value)}>{products.map((p) => <option key={p.id} value={p.id}>{nodePath(nodes, p.id)}</option>)}</select></div>
          <div><Label>Relationship</Label><select className={selectCls} value={type} onChange={(e) => setType(e.target.value as RelationType)}>{RELATION_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><Label>Related product</Label><select className={selectCls} value={toId} onChange={(e) => setTo(e.target.value)}>{products.map((p) => <option key={p.id} value={p.id}>{nodePath(nodes, p.id)}</option>)}</select></div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent border-white/20 text-white" onClick={onClose}>Cancel</Button>
          <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white" onClick={save}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PublishPanel({ systems, version, approvedSkus }: { systems: { id: string; name: string; lastPublished: string | null; version: number }[]; version: number; approvedSkus: number }) {
  const [sel, setSel] = useState<string[]>(systems.map((s) => s.id));
  return (
    <Card className="bg-white/5 border-white/10"><CardContent className="p-5 space-y-4">
      <div className="text-sm text-slate-400">Only <span className="text-white">approved</span> products and SKUs ({approvedSkus} SKUs) are published to connected commercial and operational systems.</div>
      <div className="divide-y divide-white/5 border border-white/10 rounded">
        {systems.map((s) => (
          <label key={s.id} className="flex items-center justify-between p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <Checkbox checked={sel.includes(s.id)} onCheckedChange={() => setSel(sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id])} />
              <div><div className="text-white text-sm">{s.name}</div><div className="text-xs text-slate-500">Last published {s.lastPublished ?? "never"} · v{s.version}</div></div>
            </div>
            <Badge variant="outline" className={s.version === version - 1 ? statusStyle.approved : statusStyle.draft}>{s.version === version - 1 ? "In sync" : "Behind"}</Badge>
          </label>
        ))}
      </div>
      <Button disabled={sel.length === 0} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white"
        onClick={() => { const v = catalogActions.publish(sel); toast.success(`Catalogue v${v} published to ${sel.length} system(s)`); }}>
        <Send className="h-4 w-4 mr-2" /> Publish catalogue v{version}
      </Button>
    </CardContent></Card>
  );
}
