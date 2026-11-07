import type { Partner, Tenant } from "./superadminData";

export const demoPartners: Partner[] = [
  { id: "partner-demo-northstar", name: "Northstar Retail Solutions (Demo)", type: "Distributor", country: "USA", primaryContact: "Morgan Ellis", contactEmail: "morgan@northstar.example", phone: "", status: "active", createdAt: "2025-04-15", notes: "Illustrative partner for North American grocery chains." },
  { id: "partner-demo-europa", name: "Europa Store Systems (Demo)", type: "System Integrator", country: "France", primaryContact: "Alex Laurent", contactEmail: "alex@europa.example", phone: "", status: "active", createdAt: "2025-02-10", notes: "Illustrative partner for European convenience and hypermarket chains." },
  { id: "partner-demo-highstreet", name: "High Street Connect (Demo)", type: "Reseller", country: "UK", primaryContact: "Jamie Clarke", contactEmail: "jamie@highstreet.example", phone: "", status: "active", createdAt: "2025-10-01", notes: "Illustrative partner for independent single-store retailers." },
];

const tenantPartners: Record<string, string> = {
  "t-smartstore": "partner-demo-northstar",
  "t-freshmart": "partner-demo-northstar",
  "t-greenleaf": "partner-demo-northstar",
  "t-zabka": "partner-demo-europa",
  "t-infomil": "partner-demo-europa",
  "t-cornerstop": "partner-demo-highstreet",
};

// Apply once to existing demo tenants; never replace an existing commercial choice.
export function addPartnerDemoData(tenants: Tenant[], partners: Partner[]) {
  const merged = [...partners];
  for (const sample of demoPartners) {
    if (!merged.some((p) => p.id === sample.id)) merged.push({ ...sample });
  }
  return {
    partners: merged,
    tenants: tenants.map((tenant) => {
      if (tenant.salesChannel || tenant.partnerId || tenant.partnerName) return tenant;
      const partner = merged.find((p) => p.id === tenantPartners[tenant.id]);
      if (!partner) return tenant;
      return { ...tenant, salesChannel: "partner" as const, partnerId: partner.id, partnerName: partner.name, storeFormat: tenant.storeFormat ?? (tenant.storesCount === 1 ? "single" as const : "chain" as const) };
    }),
  };
}