import { describe, expect, test } from "bun:test";
import { tenantCommercial, tenantCommercialSchema } from "./tenantCommercial";

describe("tenant commercial dimensions", () => {
  test("a partner can bring a chain of stores", () => {
    const data = tenantCommercialSchema.parse({ salesChannel: "partner", partnerName: "Retail Partner", storeFormat: "chain", storesCount: 25 });
    expect(data).toEqual({ salesChannel: "partner", partnerName: "Retail Partner", storeFormat: "chain", storesCount: 25 });
  });
  test("a partner can bring a single store", () => {
    expect(tenantCommercialSchema.parse({ salesChannel: "partner", partnerName: "Retail Partner", storeFormat: "single", storesCount: 1 }).storesCount).toBe(1);
    expect(tenantCommercialSchema.safeParse({ salesChannel: "partner", partnerName: "Retail Partner", storeFormat: "single", storesCount: 2 }).success).toBe(false);
  });
  test("partner sourcing requires a named partner", () => {
    expect(tenantCommercialSchema.safeParse({ salesChannel: "partner", partnerName: " ", storeFormat: "chain", storesCount: 10 }).success).toBe(false);
  });
  test("switching to direct clears partner attribution", () => {
    expect(tenantCommercialSchema.parse({ salesChannel: "direct", partnerName: "Old Partner", storeFormat: "single", storesCount: 1 }).partnerName).toBe("");
  });
  test("legacy customers keep inferred store format without changing counts", () => {
    const tenant = { tier: "SMB", storesCount: 12 };
    expect(tenantCommercial(tenant)).toEqual({ salesChannel: "direct", partnerName: "", storeFormat: "chain" });
    expect(tenant.storesCount).toBe(12);
  });
});