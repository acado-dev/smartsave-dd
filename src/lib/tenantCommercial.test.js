import { describe, expect, test } from "bun:test";
import { tenantCommercial, tenantCommercialSchema, tenantDeploymentLabel } from "./tenantCommercial";

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
    expect(tenantCommercial(tenant)).toEqual({ salesChannel: "direct", partnerName: "", storeFormat: "chain", deployment: undefined });
    expect(tenant.storesCount).toBe(12);
  });
  test("tenant form can select Cloud, On-Prem or Hybrid deployment", () => {
    const base = { salesChannel: "direct", partnerName: "", storeFormat: "chain", storesCount: 5 };
    expect(tenantCommercialSchema.parse({ ...base, deployment: "cloud" }).deployment).toBe("cloud");
    expect(tenantCommercialSchema.parse({ ...base, deployment: "onprem" }).deployment).toBe("onprem");
    expect(tenantCommercialSchema.parse({ ...base, deployment: "hybrid" }).deployment).toBe("hybrid");
    expect(tenantCommercialSchema.safeParse({ ...base, deployment: "edge" }).success).toBe(false);
  });
  test("saved tenant deployment wins over the subscription-derived split", () => {
    expect(tenantDeploymentLabel({ deployment: "onprem" }, { onPrem: 0, cloud: 40 })).toBe("On-Prem");
    expect(tenantDeploymentLabel({ deployment: "hybrid" }, { onPrem: 10, cloud: 0 })).toBe("Hybrid");
    expect(tenantDeploymentLabel({}, { onPrem: 10, cloud: 5 })).toBe("Hybrid");
    expect(tenantDeploymentLabel({}, { onPrem: 0, cloud: 5 })).toBe("Cloud");
    expect(tenantDeploymentLabel({}, { onPrem: 0, cloud: 0 })).toBe("—");
  });
});