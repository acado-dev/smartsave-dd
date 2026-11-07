import { z } from "zod";
import type { Tenant } from "../data/superadminData";

export const tenantCommercialSchema = z.object({
  salesChannel: z.enum(["direct", "partner"]),
  partnerName: z.string().trim().max(120),
  storeFormat: z.enum(["chain", "single"]),
  storesCount: z.coerce.number().int().min(1, "At least one store is required").max(100000),
}).superRefine((data, ctx) => {
  if (data.salesChannel === "partner" && data.partnerName.length < 2) {
    ctx.addIssue({ code: "custom", path: ["partnerName"], message: "Select or enter a partner name" });
  }
  if (data.storeFormat === "single" && data.storesCount !== 1) {
    ctx.addIssue({ code: "custom", path: ["storesCount"], message: "A single-store customer must have exactly one store" });
  }
}).transform((data) => ({ ...data, partnerName: data.salesChannel === "partner" ? data.partnerName : "" }));

// Legacy tenants retain their records; derive missing commercial dimensions only.
export function tenantCommercial(tenant: Pick<Tenant, "storesCount" | "tier" | "salesChannel" | "partnerName" | "storeFormat">) {
  return {
    salesChannel: tenant.salesChannel ?? "direct",
    partnerName: tenant.partnerName ?? "",
    storeFormat: tenant.storeFormat ?? (tenant.storesCount === 1 || tenant.tier === "Single-Store" ? "single" : "chain"),
  };
}