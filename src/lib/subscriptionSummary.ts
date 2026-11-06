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
