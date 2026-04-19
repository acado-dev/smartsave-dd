// Mock data for the Superadmin / DD Brain RBAC console
// All data is in-memory only; no backend wiring.

export type ModuleKey =
  | "roos"
  | "goal-console"
  | "pricing-os"
  | "perishables"
  | "promotions"
  | "admin";

export type PermissionAction =
  | "VIEW"
  | "CONFIGURE"
  | "EXECUTE"
  | "APPROVE"
  | "OVERRIDE"
  | "AUDIT";

export type PermissionScope = "Global" | "Tenant" | "Country" | "Region" | "Store";

export type RoleType = "Platform" | "Tenant";

export type TenantTier = "Enterprise" | "Mid-Market" | "SMB" | "Single-Store";

export interface Module {
  key: ModuleKey;
  name: string;
  description: string;
  color: string; // hsl token reference
}

export interface Tenant {
  id: string;
  name: string;
  tier: TenantTier;
  industry: string;
  country: string;
  storesCount: number;
  usersCount: number;
  status: "active" | "suspended" | "trial";
  createdAt: string;
  modules: ModuleKey[];
  primaryContact: string;
  contactEmail: string;
  monthlyRevenue: number;
}

export interface Location {
  id: string;
  tenantId: string;
  name: string;
  type: "BusinessUnit" | "HQ" | "Country" | "Region" | "Store" | "Department";
  parentId: string | null;
  code?: string;
}

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  description: string;
  isCustom: boolean;
  inheritsFrom?: string[];
  usersCount: number;
  tenantId?: string; // null for platform roles
}

export interface Permission {
  id: string;
  module: ModuleKey;
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tenantId: string | "platform";
  roleIds: string[];
  locationIds: string[];
  status: "active" | "invited" | "suspended";
  lastActive: string;
  mfaEnabled: boolean;
}

export interface GuardrailRule {
  id: string;
  name: string;
  module: ModuleKey;
  trigger: string;
  approvers: string[]; // role ids
  escalateAfterHours: number;
  overrideRoleId: string;
  status: "active" | "draft";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  tenant: string;
  action: string;
  resource: string;
  scope: PermissionScope;
  result: "success" | "denied" | "pending";
  ip: string;
}

// ─── Modules ──────────────────────────────────────────────────────────
export const modules: Module[] = [
  { key: "roos", name: "ROOS", description: "Retail Operating OS — orchestration core", color: "187 70% 42%" },
  { key: "goal-console", name: "Goal Console", description: "OKR & target alignment across stores", color: "262 60% 55%" },
  { key: "pricing-os", name: "Pricing OS", description: "Dynamic & promotional pricing engine", color: "4 84% 49%" },
  { key: "perishables", name: "Perishables Assistant", description: "Freshness, expiry & waste prevention", color: "142 60% 42%" },
  { key: "promotions", name: "Promotions Assistant", description: "Campaign planning & execution", color: "32 95% 50%" },
  { key: "admin", name: "Admin", description: "Governance, RBAC, audit", color: "222 47% 30%" },
];

// ─── Tenants ──────────────────────────────────────────────────────────
export const tenants: Tenant[] = [
  {
    id: "t-bucees", name: "Buc-ee's", tier: "Enterprise", industry: "Convenience / Fuel",
    country: "USA", storesCount: 47, usersCount: 312, status: "active",
    createdAt: "2024-03-12", modules: ["roos", "goal-console", "pricing-os", "perishables", "promotions", "admin"],
    primaryContact: "Marcus Tanner", contactEmail: "marcus.t@bucees.com", monthlyRevenue: 48500,
  },
  {
    id: "t-zabka", name: "Żabka Group", tier: "Enterprise", industry: "Convenience",
    country: "Poland", storesCount: 9842, usersCount: 1240, status: "active",
    createdAt: "2024-01-08", modules: ["roos", "pricing-os", "perishables", "promotions", "admin"],
    primaryContact: "Anna Kowalski", contactEmail: "a.kowalski@zabka.pl", monthlyRevenue: 142000,
  },
  {
    id: "t-smartstore", name: "SmartStore Demo", tier: "Mid-Market", industry: "Grocery",
    country: "USA", storesCount: 12, usersCount: 64, status: "active",
    createdAt: "2024-06-22", modules: ["pricing-os", "perishables", "admin"],
    primaryContact: "Priya Shah", contactEmail: "priya@smartstore.io", monthlyRevenue: 8400,
  },
  {
    id: "t-freshmart", name: "FreshMart Co-op", tier: "SMB", industry: "Organic Grocery",
    country: "Canada", storesCount: 4, usersCount: 18, status: "trial",
    createdAt: "2026-02-14", modules: ["perishables", "admin"],
    primaryContact: "Daniel Brun", contactEmail: "dan@freshmart.ca", monthlyRevenue: 0,
  },
  {
    id: "t-cornerstop", name: "CornerStop", tier: "Single-Store", industry: "Convenience",
    country: "UK", storesCount: 1, usersCount: 4, status: "active",
    createdAt: "2025-11-03", modules: ["perishables", "promotions", "admin"],
    primaryContact: "Aisha Patel", contactEmail: "aisha@cornerstop.uk", monthlyRevenue: 240,
  },
  {
    id: "t-greenleaf", name: "GreenLeaf Markets", tier: "Mid-Market", industry: "Specialty Grocery",
    country: "USA", storesCount: 22, usersCount: 96, status: "suspended",
    createdAt: "2024-09-18", modules: ["roos", "perishables", "admin"],
    primaryContact: "Robert Chen", contactEmail: "rchen@greenleaf.com", monthlyRevenue: 12600,
  },
  {
    id: "t-infomil", name: "Infomil Retail", tier: "Enterprise", industry: "Hypermarket",
    country: "France", storesCount: 156, usersCount: 482, status: "active",
    createdAt: "2025-01-30", modules: ["roos", "goal-console", "pricing-os", "perishables", "admin"],
    primaryContact: "Camille Rousseau", contactEmail: "c.rousseau@infomil.fr", monthlyRevenue: 96400,
  },
];

// ─── Locations (org hierarchy) ─────────────────────────────────────────
export const locations: Location[] = [
  // Buc-ee's hierarchy
  { id: "l-bu-hq", tenantId: "t-bucees", name: "Buc-ee's HQ", type: "HQ", parentId: null, code: "BU-HQ" },
  { id: "l-bu-tx", tenantId: "t-bucees", name: "Texas Region", type: "Region", parentId: "l-bu-hq", code: "TX" },
  { id: "l-bu-fl", tenantId: "t-bucees", name: "Florida Region", type: "Region", parentId: "l-bu-hq", code: "FL" },
  { id: "l-bu-tx-101", tenantId: "t-bucees", name: "Buc-ee's #101 New Braunfels", type: "Store", parentId: "l-bu-tx", code: "TX-101" },
  { id: "l-bu-tx-102", tenantId: "t-bucees", name: "Buc-ee's #102 Luling", type: "Store", parentId: "l-bu-tx", code: "TX-102" },
  { id: "l-bu-fl-201", tenantId: "t-bucees", name: "Buc-ee's #201 Daytona", type: "Store", parentId: "l-bu-fl", code: "FL-201" },
  { id: "l-bu-tx-101-deli", tenantId: "t-bucees", name: "Deli Department", type: "Department", parentId: "l-bu-tx-101" },
  { id: "l-bu-tx-101-bake", tenantId: "t-bucees", name: "Bakery Department", type: "Department", parentId: "l-bu-tx-101" },
  // Żabka hierarchy (compact)
  { id: "l-zab-hq", tenantId: "t-zabka", name: "Żabka HQ Poznań", type: "HQ", parentId: null, code: "ZAB-HQ" },
  { id: "l-zab-warsaw", tenantId: "t-zabka", name: "Warsaw Region", type: "Region", parentId: "l-zab-hq", code: "WAR" },
  { id: "l-zab-krakow", tenantId: "t-zabka", name: "Kraków Region", type: "Region", parentId: "l-zab-hq", code: "KRK" },
  { id: "l-zab-w-001", tenantId: "t-zabka", name: "Żabka W-001 Mokotów", type: "Store", parentId: "l-zab-warsaw" },
  { id: "l-zab-w-002", tenantId: "t-zabka", name: "Żabka W-002 Praga", type: "Store", parentId: "l-zab-warsaw" },
  { id: "l-zab-k-001", tenantId: "t-zabka", name: "Żabka K-001 Stare Miasto", type: "Store", parentId: "l-zab-krakow" },
  // SmartStore
  { id: "l-ss-hq", tenantId: "t-smartstore", name: "SmartStore HQ", type: "HQ", parentId: null },
  { id: "l-ss-down", tenantId: "t-smartstore", name: "Downtown Branch", type: "Store", parentId: "l-ss-hq" },
  { id: "l-ss-up", tenantId: "t-smartstore", name: "Uptown Branch", type: "Store", parentId: "l-ss-hq" },
];

// ─── Roles ───────────────────────────────────────────────────────────
export const roles: Role[] = [
  // Platform roles
  { id: "r-super", name: "Super Admin", type: "Platform", description: "Full platform control. Reserved for Ithina staff.", isCustom: false, usersCount: 4 },
  { id: "r-platform", name: "Platform Admin", type: "Platform", description: "Manage tenants, modules, billing. No tenant data access.", isCustom: false, inheritsFrom: ["r-super"], usersCount: 7 },
  { id: "r-module", name: "Module Admin", type: "Platform", description: "Configure module-level features and defaults.", isCustom: false, usersCount: 12 },
  { id: "r-support", name: "Support Admin", type: "Platform", description: "Read-only access plus impersonation for support tickets.", isCustom: false, usersCount: 18 },
  // Tenant roles
  { id: "r-owner", name: "Owner", type: "Tenant", description: "Tenant owner — full tenant scope.", isCustom: false, usersCount: 9 },
  { id: "r-pricing-mgr", name: "Pricing Manager", type: "Tenant", description: "Configure pricing rules; approve markdowns.", isCustom: false, usersCount: 34 },
  { id: "r-category-mgr", name: "Category Manager", type: "Tenant", description: "Manage assortment & category strategy.", isCustom: false, usersCount: 52 },
  { id: "r-merch", name: "Merchandising", type: "Tenant", description: "Planogram, displays, in-store visuals.", isCustom: false, usersCount: 78 },
  { id: "r-marketing", name: "Marketing", type: "Tenant", description: "Promotions, campaigns, signage.", isCustom: false, usersCount: 41 },
  { id: "r-store-ops", name: "Store Operations", type: "Tenant", description: "Day-to-day store running & compliance.", isCustom: false, usersCount: 184 },
  { id: "r-store-mgr", name: "Store Manager", type: "Tenant", description: "Single-store leadership.", isCustom: false, usersCount: 412 },
  { id: "r-associate", name: "Associate", type: "Tenant", description: "Floor staff. Handheld + task execution only.", isCustom: false, usersCount: 1284 },
  { id: "r-finance", name: "Finance", type: "Tenant", description: "Margin, P&L, reporting.", isCustom: false, usersCount: 22 },
  { id: "r-it-analyst", name: "IT / Analyst", type: "Tenant", description: "Integrations, data exports, BI.", isCustom: false, usersCount: 19 },
  // Custom example
  { id: "r-cust-night", name: "Night Shift Lead", type: "Tenant", description: "Custom — overnight ops + waste close-out.", isCustom: true, inheritsFrom: ["r-store-ops"], usersCount: 24, tenantId: "t-bucees" },
];

// ─── Permission matrix entries ────────────────────────────────────────
export const permissions: Permission[] = [
  // Pricing OS
  { id: "p1", module: "pricing-os", resource: "Pricing Rules", action: "VIEW", scope: "Tenant" },
  { id: "p2", module: "pricing-os", resource: "Pricing Rules", action: "CONFIGURE", scope: "Tenant" },
  { id: "p3", module: "pricing-os", resource: "Markdowns", action: "EXECUTE", scope: "Store" },
  { id: "p4", module: "pricing-os", resource: "Markdowns", action: "APPROVE", scope: "Region" },
  { id: "p5", module: "pricing-os", resource: "Markdowns", action: "OVERRIDE", scope: "Tenant" },
  // Perishables
  { id: "p6", module: "perishables", resource: "Expiring Items", action: "VIEW", scope: "Store" },
  { id: "p7", module: "perishables", resource: "Waste Log", action: "AUDIT", scope: "Tenant" },
  { id: "p8", module: "perishables", resource: "Donation Routing", action: "CONFIGURE", scope: "Region" },
  // Promotions
  { id: "p9", module: "promotions", resource: "Campaigns", action: "CONFIGURE", scope: "Tenant" },
  { id: "p10", module: "promotions", resource: "Campaigns", action: "APPROVE", scope: "Tenant" },
  // Admin
  { id: "p11", module: "admin", resource: "Users", action: "CONFIGURE", scope: "Tenant" },
  { id: "p12", module: "admin", resource: "Roles", action: "CONFIGURE", scope: "Tenant" },
  { id: "p13", module: "admin", resource: "Audit Log", action: "VIEW", scope: "Global" },
];

// Mapping: which roles get which permissions (for the matrix)
export const rolePermissionMap: Record<string, string[]> = {
  "r-super": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13"],
  "r-platform": ["p1", "p2", "p11", "p12", "p13"],
  "r-module": ["p1", "p2", "p9", "p13"],
  "r-support": ["p1", "p6", "p13"],
  "r-owner": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12"],
  "r-pricing-mgr": ["p1", "p2", "p3", "p4"],
  "r-category-mgr": ["p1", "p6", "p9"],
  "r-merch": ["p1", "p9"],
  "r-marketing": ["p9", "p10"],
  "r-store-ops": ["p1", "p3", "p6"],
  "r-store-mgr": ["p1", "p3", "p4", "p6", "p7"],
  "r-associate": ["p6"],
  "r-finance": ["p1", "p4", "p7"],
  "r-it-analyst": ["p1", "p13"],
  "r-cust-night": ["p1", "p3", "p6", "p7"],
};

// ─── Users ───────────────────────────────────────────────────────────
export const users: User[] = [
  { id: "u-1", name: "Anjali Mehta", email: "anjali@ithina.ai", tenantId: "platform", roleIds: ["r-super"], locationIds: [], status: "active", lastActive: "2 min ago", mfaEnabled: true },
  { id: "u-2", name: "Devon Park", email: "devon@ithina.ai", tenantId: "platform", roleIds: ["r-platform"], locationIds: [], status: "active", lastActive: "14 min ago", mfaEnabled: true },
  { id: "u-3", name: "Kira Yilmaz", email: "kira@ithina.ai", tenantId: "platform", roleIds: ["r-support"], locationIds: [], status: "active", lastActive: "1 hr ago", mfaEnabled: true },
  { id: "u-4", name: "Marcus Tanner", email: "marcus.t@bucees.com", tenantId: "t-bucees", roleIds: ["r-owner"], locationIds: ["l-bu-hq"], status: "active", lastActive: "32 min ago", mfaEnabled: true },
  { id: "u-5", name: "Jamie Cole", email: "j.cole@bucees.com", tenantId: "t-bucees", roleIds: ["r-pricing-mgr"], locationIds: ["l-bu-hq", "l-bu-tx"], status: "active", lastActive: "5 min ago", mfaEnabled: true },
  { id: "u-6", name: "Tasha Vaughn", email: "t.vaughn@bucees.com", tenantId: "t-bucees", roleIds: ["r-store-mgr"], locationIds: ["l-bu-tx-101"], status: "active", lastActive: "1 hr ago", mfaEnabled: false },
  { id: "u-7", name: "Hector Ruiz", email: "h.ruiz@bucees.com", tenantId: "t-bucees", roleIds: ["r-cust-night", "r-associate"], locationIds: ["l-bu-tx-101"], status: "active", lastActive: "12 hr ago", mfaEnabled: false },
  { id: "u-8", name: "Anna Kowalski", email: "a.kowalski@zabka.pl", tenantId: "t-zabka", roleIds: ["r-owner"], locationIds: ["l-zab-hq"], status: "active", lastActive: "8 min ago", mfaEnabled: true },
  { id: "u-9", name: "Piotr Nowak", email: "p.nowak@zabka.pl", tenantId: "t-zabka", roleIds: ["r-category-mgr", "r-pricing-mgr"], locationIds: ["l-zab-warsaw", "l-zab-krakow"], status: "active", lastActive: "22 min ago", mfaEnabled: true },
  { id: "u-10", name: "Magda Lis", email: "m.lis@zabka.pl", tenantId: "t-zabka", roleIds: ["r-store-mgr"], locationIds: ["l-zab-w-001"], status: "active", lastActive: "3 hr ago", mfaEnabled: false },
  { id: "u-11", name: "Priya Shah", email: "priya@smartstore.io", tenantId: "t-smartstore", roleIds: ["r-owner"], locationIds: ["l-ss-hq"], status: "active", lastActive: "Just now", mfaEnabled: true },
  { id: "u-12", name: "Liam Foster", email: "liam@smartstore.io", tenantId: "t-smartstore", roleIds: ["r-store-mgr"], locationIds: ["l-ss-down"], status: "active", lastActive: "1 day ago", mfaEnabled: false },
  { id: "u-13", name: "Daniel Brun", email: "dan@freshmart.ca", tenantId: "t-freshmart", roleIds: ["r-owner"], locationIds: [], status: "active", lastActive: "4 hr ago", mfaEnabled: true },
  { id: "u-14", name: "Aisha Patel", email: "aisha@cornerstop.uk", tenantId: "t-cornerstop", roleIds: ["r-owner", "r-store-mgr"], locationIds: [], status: "active", lastActive: "30 min ago", mfaEnabled: false },
  { id: "u-15", name: "Robert Chen", email: "rchen@greenleaf.com", tenantId: "t-greenleaf", roleIds: ["r-owner"], locationIds: [], status: "suspended", lastActive: "12 days ago", mfaEnabled: true },
  { id: "u-16", name: "Camille Rousseau", email: "c.rousseau@infomil.fr", tenantId: "t-infomil", roleIds: ["r-owner"], locationIds: [], status: "active", lastActive: "1 hr ago", mfaEnabled: true },
  { id: "u-17", name: "Sara Olsson", email: "s.olsson@ithina.ai", tenantId: "platform", roleIds: ["r-module"], locationIds: [], status: "invited", lastActive: "—", mfaEnabled: false },
];

// ─── Guardrails ──────────────────────────────────────────────────────
export const guardrails: GuardrailRule[] = [
  { id: "g-1", name: "Markdown > 30%", module: "pricing-os", trigger: "Markdown depth exceeds 30%", approvers: ["r-pricing-mgr", "r-owner"], escalateAfterHours: 4, overrideRoleId: "r-owner", status: "active" },
  { id: "g-2", name: "Bulk Donation Routing", module: "perishables", trigger: "Donation batch > 200 units", approvers: ["r-store-mgr"], escalateAfterHours: 12, overrideRoleId: "r-owner", status: "active" },
  { id: "g-3", name: "Promo Activation Tenant-Wide", module: "promotions", trigger: "Campaign scope = entire tenant", approvers: ["r-marketing", "r-owner"], escalateAfterHours: 24, overrideRoleId: "r-owner", status: "active" },
  { id: "g-4", name: "Role Assignment > Manager", module: "admin", trigger: "Assigning Owner / Pricing Mgr", approvers: ["r-owner"], escalateAfterHours: 8, overrideRoleId: "r-platform", status: "active" },
  { id: "g-5", name: "Module Enable / Disable", module: "admin", trigger: "Toggling tenant module", approvers: ["r-platform"], escalateAfterHours: 48, overrideRoleId: "r-super", status: "active" },
  { id: "g-6", name: "Cross-Region Price Override", module: "pricing-os", trigger: "Override applied across > 1 region", approvers: ["r-owner"], escalateAfterHours: 2, overrideRoleId: "r-super", status: "draft" },
];

// ─── Audit log ───────────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: "a-1", timestamp: "2026-04-19 14:42:11", actor: "Anjali Mehta", actorRole: "Super Admin", tenant: "Platform", action: "Enabled module", resource: "Promotions Assistant → Buc-ee's", scope: "Tenant", result: "success", ip: "10.0.4.22" },
  { id: "a-2", timestamp: "2026-04-19 14:38:02", actor: "Jamie Cole", actorRole: "Pricing Manager", tenant: "Buc-ee's", action: "Approved markdown", resource: "SKU 88421 — 35% off", scope: "Region", result: "success", ip: "172.18.9.4" },
  { id: "a-3", timestamp: "2026-04-19 14:21:55", actor: "Piotr Nowak", actorRole: "Category Manager", tenant: "Żabka Group", action: "Configured guardrail", resource: "Markdown > 30%", scope: "Tenant", result: "pending", ip: "85.219.4.180" },
  { id: "a-4", timestamp: "2026-04-19 13:52:00", actor: "Hector Ruiz", actorRole: "Night Shift Lead", tenant: "Buc-ee's", action: "Override attempt", resource: "Pricing rule lock", scope: "Store", result: "denied", ip: "172.18.9.55" },
  { id: "a-5", timestamp: "2026-04-19 13:18:44", actor: "Devon Park", actorRole: "Platform Admin", tenant: "Platform", action: "Created tenant", resource: "FreshMart Co-op (trial)", scope: "Global", result: "success", ip: "10.0.4.18" },
  { id: "a-6", timestamp: "2026-04-19 12:55:21", actor: "Magda Lis", actorRole: "Store Manager", tenant: "Żabka Group", action: "Bulk donation routed", resource: "240 units → Caritas Warsaw", scope: "Store", result: "success", ip: "85.219.7.91" },
  { id: "a-7", timestamp: "2026-04-19 12:31:09", actor: "Kira Yilmaz", actorRole: "Support Admin", tenant: "GreenLeaf Markets", action: "Impersonation start", resource: "Owner session (45 min)", scope: "Tenant", result: "success", ip: "10.0.4.31" },
  { id: "a-8", timestamp: "2026-04-19 11:48:50", actor: "Marcus Tanner", actorRole: "Owner", tenant: "Buc-ee's", action: "Created custom role", resource: "Night Shift Lead", scope: "Tenant", result: "success", ip: "67.221.8.12" },
  { id: "a-9", timestamp: "2026-04-19 11:14:33", actor: "Anna Kowalski", actorRole: "Owner", tenant: "Żabka Group", action: "Invited user", resource: "kasia.w@zabka.pl → Marketing", scope: "Tenant", result: "success", ip: "85.219.4.12" },
  { id: "a-10", timestamp: "2026-04-19 10:42:08", actor: "System", actorRole: "—", tenant: "GreenLeaf Markets", action: "Tenant suspended", resource: "Billing failure (auto)", scope: "Tenant", result: "success", ip: "—" },
  { id: "a-11", timestamp: "2026-04-19 10:08:17", actor: "Anjali Mehta", actorRole: "Super Admin", tenant: "Platform", action: "Permission grant", resource: "AUDIT scope=Global → Module Admin", scope: "Global", result: "success", ip: "10.0.4.22" },
  { id: "a-12", timestamp: "2026-04-19 09:51:02", actor: "Camille Rousseau", actorRole: "Owner", tenant: "Infomil Retail", action: "Module configured", resource: "Goal Console — Q2 targets", scope: "Tenant", result: "success", ip: "193.51.4.88" },
];

// ─── Aggregate metrics for the dashboard ─────────────────────────────
export const platformMetrics = {
  totalTenants: tenants.length,
  activeTenants: tenants.filter(t => t.status === "active").length,
  totalUsers: users.length + 8421, // baseline + visible
  totalStores: tenants.reduce((s, t) => s + t.storesCount, 0),
  monthlyRevenue: tenants.reduce((s, t) => s + t.monthlyRevenue, 0),
  pendingApprovals: 7,
  guardrailsTriggered24h: 23,
  failedLogins24h: 4,
};
