import { daysUntil, effectiveStatus, mandatoryGaps, type CatalogNode, type Sku, type CustomerProduct } from "@/hooks/useCatalogStore";

type Cat = { nodes: CatalogNode[]; skus: Sku[]; customerProducts: CustomerProduct[] };

export const rootOf = (nodes: CatalogNode[], id: string) => {
  let cur = nodes.find((x) => x.id === id);
  while (cur && cur.parentId) cur = nodes.find((x) => x.id === cur!.parentId);
  return cur;
};

export const fmtMoney = (v: number) =>
  v >= 1e6 ? `€${(v / 1e6).toFixed(2)}M` : v >= 1000 ? `€${(v / 1000).toFixed(1)}k` : `€${Math.round(v)}`;

/** Annualised value of a subscription line (0 for one-time). */
export const annualValue = (k: Sku, qty: number) =>
  k.billing === "subscription" ? k.price * qty * (k.term === "monthly" ? 12 : 1) : 0;

/** Portfolio-level commercial rollup for a set of tenants. */
export function portfolioSummary(cat: Cat, tenantIds: string[]) {
  const ids = new Set(tenantIds);
  const lines = cat.customerProducts
    .filter((c) => ids.has(c.tenantId))
    .map((c) => ({ c, k: cat.skus.find((x) => x.id === c.skuId), st: effectiveStatus(c), d: daysUntil(c.endDate) }))
    .filter((x) => x.k) as { c: CustomerProduct; k: Sku; st: CustomerProduct["status"]; d: number | null }[];
  const live = lines.filter((l) => l.st === "active" || l.st === "pending");
  const arr = live.reduce((s, l) => s + annualValue(l.k, l.c.quantity), 0);
  const oneTime = live.reduce((s, l) => s + (l.k.billing === "one-time" ? l.k.price * l.c.quantity : 0), 0);
  const byCategory = new Map<string, { arr: number; lines: number }>();
  live.forEach((l) => {
    const r = rootOf(cat.nodes, l.k.nodeId)?.name ?? "Other";
    const cur = byCategory.get(r) ?? { arr: 0, lines: 0 };
    byCategory.set(r, { arr: cur.arr + annualValue(l.k, l.c.quantity), lines: cur.lines + 1 });
  });
  const renewals = live.filter((l) => l.d !== null && l.d <= 90).sort((a, b) => a.d! - b.d!);
  const atRiskArr = renewals.filter((l) => !l.c.autoRenew).reduce((s, l) => s + annualValue(l.k, l.c.quantity), 0);
  const highUsage = live.filter((l) => l.c.used != null && l.c.quantity > 0 && l.c.used / l.c.quantity >= 0.9);
  const gaps = tenantIds.map((t) => ({ tenantId: t, gaps: mandatoryGaps(cat, t) })).filter((g) => g.gaps.length);
  return {
    live: live.length, expired: lines.filter((l) => l.st === "expired").length, arr, oneTime,
    byCategory: [...byCategory.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.arr - a.arr),
    renewals, atRiskArr, highUsage, gaps,
    autoRenewPct: live.length ? Math.round((live.filter((l) => l.c.autoRenew).length / live.length) * 100) : 0,
  };
}

export type LicenseItem = { name: string; qty: number; used: number; unit: string; tenants: number; skus: string[] };
export type LicenseGroup = { category: string; items: LicenseItem[]; total: number };
export const CATEGORY_ORDER = ["Ithina Core", "Hardware", "Maestro", "External Apps"];

/** Nearest product node above (or at) a node — used to group SKUs/variants by product. */
const productOf = (nodes: CatalogNode[], id: string) => {
  let cur = nodes.find((x) => x.id === id);
  while (cur && cur.kind !== "product" && cur.parentId) cur = nodes.find((x) => x.id === cur!.parentId);
  return cur;
};

/** What licences / units the given tenants hold, grouped by top-level category and product. */
export function licenseMix(cat: Cat, tenantIds: string[]): LicenseGroup[] {
  const ids = new Set(tenantIds);
  const groups = new Map<string, Map<string, LicenseItem & { tset: Set<string> }>>();
  cat.customerProducts.forEach((c) => {
    if (!ids.has(c.tenantId)) return;
    const st = effectiveStatus(c);
    if (st !== "active" && st !== "pending") return;
    const k = cat.skus.find((x) => x.id === c.skuId);
    if (!k) return;
    const root = rootOf(cat.nodes, k.nodeId)?.name ?? "Other";
    const prod = productOf(cat.nodes, k.nodeId)?.name ?? k.name;
    const g = groups.get(root) ?? new Map();
    const it = g.get(prod) ?? { name: prod, qty: 0, used: 0, unit: c.usageUnit ?? (root === "Hardware" ? "units" : "stores"), tenants: 0, skus: [], tset: new Set<string>() };
    it.qty += c.quantity; it.used += c.used ?? 0; it.tset.add(c.tenantId);
    if (!it.skus.includes(k.code)) it.skus.push(k.code);
    g.set(prod, it); groups.set(root, g);
  });
  const names = [...new Set([...CATEGORY_ORDER, ...groups.keys()])];
  return names.map((category) => {
    const items = [...(groups.get(category)?.values() ?? [])].map(({ tset, ...i }) => ({ ...i, tenants: tset.size })).sort((a, b) => b.qty - a.qty);
    return { category, items, total: items.reduce((s, i) => s + i.qty, 0) };
  });
}

/** Hardware split: displays (ESL + digital displays) and D.COM units, total vs active. */
export function hardwareStats(cat: Cat, tenantIds: string[]) {
  const ids = new Set(tenantIds);
  const under = (nodeId: string, anc: string) => { let c = cat.nodes.find((x) => x.id === nodeId); while (c) { if (c.id === anc) return true; c = cat.nodes.find((x) => x.id === c!.parentId); } return false; };
  const r = { displaysTotal: 0, displaysActive: 0, dcomTotal: 0, dcomActive: 0 };
  cat.customerProducts.forEach((c) => {
    if (!ids.has(c.tenantId)) return;
    const st = effectiveStatus(c); if (st !== "active" && st !== "pending") return;
    const k = cat.skus.find((x) => x.id === c.skuId); if (!k) return;
    if (under(k.nodeId, "p-dcom")) { r.dcomTotal += c.quantity; r.dcomActive += c.used ?? 0; }
    else if (under(k.nodeId, "f-esl") || under(k.nodeId, "f-display")) { r.displaysTotal += c.quantity; r.displaysActive += c.used ?? 0; }
  });
  return r;
}

/** Ithina Core deployment model split (stores on On-Prem vs Cloud). */
export function coreDeployment(cat: Cat, tenantIds: string[]) {
  const ids = new Set(tenantIds);
  const r = { onPrem: 0, cloud: 0, unset: 0, onPremTenants: new Set<string>(), cloudTenants: new Set<string>() };
  cat.customerProducts.forEach((c) => {
    if (!ids.has(c.tenantId)) return;
    const st = effectiveStatus(c); if (st !== "active" && st !== "pending") return;
    const k = cat.skus.find((x) => x.id === c.skuId); if (!k || rootOf(cat.nodes, k.nodeId)?.name !== "Ithina Core") return;
    if (c.deployment === "On-Prem") { r.onPrem += c.quantity; r.onPremTenants.add(c.tenantId); }
    else if (c.deployment === "Cloud") { r.cloud += c.quantity; r.cloudTenants.add(c.tenantId); }
    else r.unset += c.quantity;
  });
  return r;
}
