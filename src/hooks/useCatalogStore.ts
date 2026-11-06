import { useSyncExternalStore } from "react";

// ─── Types ────────────────────────────────────────────────────────────
/** group = any category / sub-category (unlimited depth); product; variant (model) */
export type NodeKind = "group" | "product" | "variant";
export type Channel = "Direct Sales" | "E-Commerce" | "Distributor" | "Reseller" | "System Integrator";
export const CHANNELS: Channel[] = ["Direct Sales", "E-Commerce", "Distributor", "Reseller", "System Integrator"];
export type LifecycleStatus = "draft" | "approved" | "retired";

export interface CatalogNode {
  id: string;
  parentId: string | null;
  kind: NodeKind;
  name: string;
  code: string;
  description: string;
  status: LifecycleStatus;
}

export type Billing = "one-time" | "subscription";
export interface Sku {
  id: string;
  nodeId: string; // product or variant
  code: string;
  name: string;
  attributes: string;
  billing: Billing;
  term: "monthly" | "annual" | "—";
  price: number;
  currency: string;
  channels: Channel[];
  status: LifecycleStatus;
}

export type RelationType = "requires" | "compatible-with" | "bundled-with" | "replaces";
export const RELATION_TYPES: RelationType[] = ["requires", "compatible-with", "bundled-with", "replaces"];
export interface Relationship { id: string; fromId: string; toId: string; type: RelationType }

export type SalesSource = "E-Com Portal" | "Salesforce" | "Direct" | "Partner";
export const SALES_SOURCES: SalesSource[] = ["E-Com Portal", "Salesforce", "Direct", "Partner"];
export interface CustomerProduct {
  id: string;
  tenantId: string;
  skuId: string;
  quantity: number;
  source: SalesSource;
  orderRef: string;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "cancelled";
}

export interface ConnectedSystem { id: string; name: string; lastPublished: string | null; version: number }

interface CatalogState {
  nodes: CatalogNode[];
  skus: Sku[];
  relationships: Relationship[];
  customerProducts: CustomerProduct[];
  systems: ConnectedSystem[];
  catalogVersion: number;
}

// ─── Seed ─────────────────────────────────────────────────────────────
const n = (id: string, parentId: string | null, kind: NodeKind, name: string, code: string, description = ""): CatalogNode =>
  ({ id, parentId, kind, name, code, description, status: "approved" });

const seed = (): CatalogState => ({
  nodes: [
    n("c-core", null, "group", "Ithina Core", "CORE", "Device connectivity, abstraction, control, orchestration, monitoring and lifecycle platform."),
    n("f-core-platform", "c-core", "group", "Core Platform", "CORE-PLT"),
    n("p-ithina-os", "f-core-platform", "product", "Ithina OS", "IOS", "Core device orchestration platform"),
    n("p-core-api", "f-core-platform", "product", "Connectivity APIs", "API"),
    n("c-hw", null, "group", "Hardware", "HW", "Physical devices and infrastructure supplied by Ithina or approved third-party manufacturers."),
    n("f-dcom", "c-hw", "group", "D.Com", "DCOM", "Communication infrastructure"),
    n("p-ap5", "f-dcom", "product", "AP5 Access Point", "AP5"),
    n("p-dcs", "f-dcom", "product", "DCS Gateway", "DCS"),
    n("f-esl", "c-hw", "group", "Electronic Shelf Labels", "ESL"),
    n("s-pseries", "f-esl", "group", "P Series", "ESL-P"),
    n("p-presto", "s-pseries", "product", "Presto ESL", "PRESTO"),
    n("v-presto-29", "p-presto", "variant", "Presto 2.9-inch", "PRESTO-29"),
    n("v-presto-42", "p-presto", "variant", "Presto 4.2-inch", "PRESTO-42"),
    n("s-eseries", "f-esl", "group", "E Series", "ESL-E"),
    n("p-e-label", "s-eseries", "product", "E-Ink Label", "E-LBL"),
    n("v-e-213", "p-e-label", "variant", "E-Label 2.13-inch", "E-213"),
    n("s-cseries", "f-esl", "group", "C Series", "ESL-C"),
    n("s-qseries", "f-esl", "group", "Q Series", "ESL-Q"),
    n("f-display", "c-hw", "group", "Displays", "DSP"),
    n("c-maestro", null, "group", "Maestro", "MAE", "Retail intelligence and orchestration platform and its assistants."),
    n("f-assistants", "c-maestro", "group", "Assistants", "MAE-AST"),
    n("p-maestro", "c-maestro", "product", "Maestro Platform", "MAESTRO"),
    n("p-pac", "f-assistants", "product", "PAC Assistant", "PAC"),
    n("p-plano", "f-assistants", "product", "Planogram Assistant", "PLANO"),
    n("p-perish", "f-assistants", "product", "Perishable Assistant", "PERISH"),
    n("p-promo", "f-assistants", "product", "Promotional Assistant", "PROMO"),
    n("c-ext", null, "group", "External Apps", "EXT", "Third-party applications, integrations and partner solutions connected through Ithina OS."),
    n("f-connectors", "c-ext", "group", "POS / ERP Connectors", "EXT-CON"),
    n("p-sap", "f-connectors", "product", "SAP Connector", "SAP-CON"),
  ],
  skus: [
    { id: "k1", nodeId: "v-presto-29", code: "PRS-29-BW-EU", name: "Presto 2.9\" B/W EU", attributes: "Black/White · EU · NFC", billing: "one-time", term: "—", price: 14.5, currency: "EUR", channels: ["Direct Sales", "Distributor", "Reseller"], status: "approved" },
    { id: "k2", nodeId: "v-presto-42", code: "PRS-42-BWR-EU", name: "Presto 4.2\" B/W/R EU", attributes: "Black/White/Red · EU", billing: "one-time", term: "—", price: 22, currency: "EUR", channels: ["Direct Sales", "E-Commerce", "Distributor"], status: "approved" },
    { id: "k3", nodeId: "v-e-213", code: "EL-213-BW", name: "E-Label 2.13\"", attributes: "Black/White", billing: "one-time", term: "—", price: 9.9, currency: "EUR", channels: ["E-Commerce", "Reseller"], status: "approved" },
    { id: "k4", nodeId: "p-ap5", code: "AP5-STD", name: "AP5 Access Point", attributes: "PoE · 2.4GHz", billing: "one-time", term: "—", price: 390, currency: "EUR", channels: ["Direct Sales", "System Integrator"], status: "approved" },
    { id: "k5", nodeId: "p-ithina-os", code: "IOS-STORE-M", name: "Ithina OS per store / month", attributes: "Per store", billing: "subscription", term: "monthly", price: 49, currency: "EUR", channels: ["Direct Sales", "E-Commerce", "Reseller"], status: "approved" },
    { id: "k6", nodeId: "p-perish", code: "MAE-PER-Y", name: "Perishable Assistant annual", attributes: "Per store", billing: "subscription", term: "annual", price: 990, currency: "EUR", channels: ["Direct Sales", "E-Commerce"], status: "approved" },
    { id: "k7", nodeId: "p-pac", code: "MAE-PAC-Y", name: "PAC Assistant annual", attributes: "Per store", billing: "subscription", term: "annual", price: 790, currency: "EUR", channels: ["Direct Sales"], status: "approved" },
    { id: "k8", nodeId: "p-plano", code: "MAE-PLN-M", name: "Planogram Assistant monthly", attributes: "Per store", billing: "subscription", term: "monthly", price: 59, currency: "EUR", channels: ["E-Commerce", "Reseller"], status: "draft" },
  ],
  relationships: [
    { id: "r1", fromId: "p-presto", toId: "p-ap5", type: "requires" },
    { id: "r2", fromId: "p-perish", toId: "p-ithina-os", type: "requires" },
    { id: "r3", fromId: "p-e-label", toId: "p-ap5", type: "compatible-with" },
  ],
  customerProducts: [
    { id: "cp1", tenantId: "t-bucees", skuId: "k2", quantity: 42000, source: "Salesforce", orderRef: "SF-OPP-10234", startDate: "2026-01-15", endDate: "", status: "active" },
    { id: "cp2", tenantId: "t-bucees", skuId: "k5", quantity: 52, source: "Salesforce", orderRef: "SF-OPP-10234", startDate: "2026-02-01", endDate: "2027-01-31", status: "active" },
    { id: "cp3", tenantId: "t-zabka", skuId: "k6", quantity: 1200, source: "Salesforce", orderRef: "SF-OPP-11870", startDate: "2026-03-01", endDate: "2027-02-28", status: "active" },
    { id: "cp4", tenantId: "t-cornerstop", skuId: "k3", quantity: 600, source: "E-Com Portal", orderRef: "EC-55120", startDate: "2026-05-10", endDate: "", status: "active" },
    { id: "cp5", tenantId: "t-cornerstop", skuId: "k5", quantity: 1, source: "E-Com Portal", orderRef: "EC-55121", startDate: "2026-05-10", endDate: "2026-11-10", status: "active" },
    { id: "cp6", tenantId: "t-smartstore", skuId: "k7", quantity: 30, source: "Direct", orderRef: "PO-8812", startDate: "2026-04-01", endDate: "2027-03-31", status: "pending" },
  ],
  systems: [
    { id: "sys-sf", name: "Salesforce CPQ", lastPublished: "2026-10-30 09:12", version: 12 },
    { id: "sys-ecom", name: "E-Com Portal", lastPublished: "2026-10-30 09:12", version: 12 },
    { id: "sys-erp", name: "ERP / Billing", lastPublished: "2026-10-12 17:40", version: 11 },
  ],
  catalogVersion: 13,
});

// ─── Store ────────────────────────────────────────────────────────────
const KEY = "ithina.catalog.v1";
const load = (): CatalogState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && Array.isArray(p.nodes) && Array.isArray(p.skus)) return { ...seed(), ...p };
    }
  } catch { /* ignore */ }
  return seed();
};
let state: CatalogState = typeof window === "undefined" ? seed() : load();
const listeners = new Set<() => void>();
const emit = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
};
const set = (patch: Partial<CatalogState>) => { state = { ...state, ...patch }; emit(); };
const nid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const stamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export const descendantIds = (nodes: CatalogNode[], id: string): string[] => {
  const out = [id];
  for (let i = 0; i < out.length; i++) nodes.filter((x) => x.parentId === out[i]).forEach((c) => out.push(c.id));
  return out;
};

export const nodePath = (nodes: CatalogNode[], id: string): string => {
  const parts: string[] = [];
  let cur = nodes.find((x) => x.id === id);
  while (cur) { parts.unshift(cur.name); cur = nodes.find((x) => x.id === cur!.parentId); }
  return parts.join(" › ");
};

export const catalogActions = {
  saveNode(node: Omit<CatalogNode, "id"> & { id?: string }) {
    if (node.id) set({ nodes: state.nodes.map((x) => (x.id === node.id ? { ...x, ...node } as CatalogNode : x)) });
    else set({ nodes: [...state.nodes, { ...node, id: nid("n") }] });
  },
  deleteNode(id: string) {
    const ids = new Set(descendantIds(state.nodes, id));
    const skuIds = new Set(state.skus.filter((s) => ids.has(s.nodeId)).map((s) => s.id));
    set({
      nodes: state.nodes.filter((x) => !ids.has(x.id)),
      skus: state.skus.filter((s) => !skuIds.has(s.id)),
      relationships: state.relationships.filter((r) => !ids.has(r.fromId) && !ids.has(r.toId)),
      customerProducts: state.customerProducts.filter((c) => !skuIds.has(c.skuId)),
    });
  },
  saveSku(sku: Omit<Sku, "id"> & { id?: string }) {
    if (sku.id) set({ skus: state.skus.map((x) => (x.id === sku.id ? { ...x, ...sku } as Sku : x)) });
    else set({ skus: [...state.skus, { ...sku, id: nid("k") }] });
  },
  deleteSku(id: string) {
    set({ skus: state.skus.filter((s) => s.id !== id), customerProducts: state.customerProducts.filter((c) => c.skuId !== id) });
  },
  addRelationship(r: Omit<Relationship, "id">) { set({ relationships: [...state.relationships, { ...r, id: nid("r") }] }); },
  deleteRelationship(id: string) { set({ relationships: state.relationships.filter((r) => r.id !== id) }); },
  saveCustomerProduct(cp: Omit<CustomerProduct, "id"> & { id?: string }) {
    if (cp.id) set({ customerProducts: state.customerProducts.map((x) => (x.id === cp.id ? { ...x, ...cp } as CustomerProduct : x)) });
    else set({ customerProducts: [...state.customerProducts, { ...cp, id: nid("cp") }] });
  },
  deleteCustomerProduct(id: string) { set({ customerProducts: state.customerProducts.filter((c) => c.id !== id) }); },
  publish(systemIds: string[]) {
    const v = state.catalogVersion;
    set({
      systems: state.systems.map((s) => (systemIds.includes(s.id) ? { ...s, lastPublished: stamp(), version: v } : s)),
      catalogVersion: v + 1,
    });
    return v;
  },
  reset() { state = seed(); emit(); },
};

const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };
const snap = () => state;
export function useCatalogStore() {
  return useSyncExternalStore(subscribe, snap, snap);
}
