import type { Partner, Tenant } from "../data/superadminData";
import type { CustomerProduct, Sku } from "../hooks/useCatalogStore";

export const partnerKey = (name: string) => name.trim().toLowerCase();

/** Upgrade free-text attribution to master IDs without replacing any tenant records. */
export function reconcilePartners(tenants: Tenant[], existing: Partner[] = []) {
  const partners = existing.map((p) => ({ ...p }));
  const linked = tenants.map((tenant) => {
    if (tenant.salesChannel !== "partner") return tenant;
    const named = tenant.partnerName?.trim();
    let partner = partners.find((p) => p.id === tenant.partnerId);
    if (!partner && named) partner = partners.find((p) => partnerKey(p.name) === partnerKey(named));
    if (!partner && named) {
      partner = { id: `partner-legacy-${encodeURIComponent(partnerKey(named))}`, name: named, type: "Referral Partner", country: "", primaryContact: "", contactEmail: "", phone: "", status: "active", createdAt: tenant.createdAt, notes: "" };
      partners.push(partner);
    }
    return partner ? { ...tenant, partnerId: partner.id, partnerName: partner.name } : tenant;
  });
  return { partners, tenants: linked };
}

export function partnerCustomers(partner: Partner, tenants: Tenant[]) {
  return tenants.filter((t) => t.salesChannel === "partner" &&
    (t.partnerId ? t.partnerId === partner.id : partnerKey(t.partnerName ?? "") === partnerKey(partner.name)));
}

export function partnerReport(partner: Partner, tenants: Tenant[], products: CustomerProduct[], skus: Sku[], today = new Date().toISOString().slice(0, 10)) {
  const customers = partnerCustomers(partner, tenants);
  const ids = new Set(customers.map((t) => t.id));
  const rows = products.filter((c) => ids.has(c.tenantId)).map((c) => {
    const expiredByDate = Boolean(c.endDate && c.endDate < today);
    const status = (c.status === "active" || c.status === "pending") && expiredByDate ? "expired" : c.status;
    const days = c.endDate ? Math.round((Date.parse(c.endDate) - Date.parse(today)) / 86400000) : null;
    return { c, sku: skus.find((k) => k.id === c.skuId), tenant: customers.find((t) => t.id === c.tenantId), status, days };
  });
  const live = rows.filter((r) => r.status === "active");
  const renewals = rows.filter((r) => (r.status === "active" || r.status === "pending") && r.sku?.billing === "subscription" && r.days !== null && r.days >= 0 && r.days <= 90);
  return {
    customers, rows, live, renewals,
    stores: customers.reduce((sum, t) => sum + t.storesCount, 0),
    chains: customers.filter((t) => (t.storeFormat ?? (t.storesCount === 1 ? "single" : "chain")) === "chain").length,
    singleStores: customers.filter((t) => (t.storeFormat ?? (t.storesCount === 1 ? "single" : "chain")) === "single").length,
    subscriptions: live.filter((r) => r.sku?.billing === "subscription").length,
    products: new Set(live.map((r) => r.sku?.nodeId).filter(Boolean)).size,
    expired: rows.filter((r) => r.status === "expired").length,
  };
}