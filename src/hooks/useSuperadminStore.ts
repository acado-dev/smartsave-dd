import { useSyncExternalStore } from "react";
import {
  tenants as seedTenants,
  locations as seedLocations,
  users as seedUsers,
  roles as seedRoles,
  guardrails as seedGuardrails,
  auditLogs as seedAudit,
  modules as seedModules,
  type Tenant,
  type Location,
  type User,
  type Role,
  type GuardrailRule,
  type AuditLog,
  type ModuleKey,
} from "@/data/superadminData";

// ─── Storage layer ────────────────────────────────────────────────────
const STORAGE_KEY = "ithina.superadmin.v1";

interface StoreShape {
  tenants: Tenant[];
  locations: Location[];
  users: User[];
  roles: Role[];
  guardrails: GuardrailRule[];
  audit: AuditLog[];
  // tenantId -> enabled module keys (mirrors tenant.modules but editable per page)
  tenantModules: Record<string, ModuleKey[]>;
}

const seed = (): StoreShape => ({
  tenants: structuredClone(seedTenants),
  locations: structuredClone(seedLocations),
  users: structuredClone(seedUsers),
  roles: structuredClone(seedRoles),
  guardrails: structuredClone(seedGuardrails),
  audit: structuredClone(seedAudit),
  tenantModules: Object.fromEntries(seedTenants.map((t) => [t.id, [...t.modules]])),
});

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const load = (): StoreShape => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed: unknown = JSON.parse(raw);
    if (!isObj(parsed)) return seed();
    const fallback = seed();
    const arr = <T,>(v: unknown, fb: T[]): T[] => (Array.isArray(v) ? (v as T[]) : fb);
    return {
      tenants: arr(parsed.tenants, fallback.tenants),
      locations: arr(parsed.locations, fallback.locations),
      users: arr(parsed.users, fallback.users),
      roles: arr(parsed.roles, fallback.roles),
      guardrails: arr(parsed.guardrails, fallback.guardrails),
      audit: arr(parsed.audit, fallback.audit),
      tenantModules: isObj(parsed.tenantModules)
        ? (parsed.tenantModules as Record<string, ModuleKey[]>)
        : fallback.tenantModules,
    };
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return seed();
  }
};

let state: StoreShape = load();
const listeners = new Set<() => void>();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — silent in demo */
  }
};

const emit = () => {
  persist();
  listeners.forEach((l) => l());
};

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// ─── ID + audit helpers ───────────────────────────────────────────────
const nid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const audit = (entry: Omit<AuditLog, "id" | "timestamp" | "actor" | "actorRole" | "ip">) => {
  state.audit = [
    {
      id: nid("a"),
      timestamp: nowStamp(),
      actor: "Anjali Mehta",
      actorRole: "Super Admin",
      ip: "10.0.4.22",
      ...entry,
    },
    ...state.audit,
  ];
};

// ─── Mutations ────────────────────────────────────────────────────────
export const superadminActions = {
  // Tenants
  createTenant(input: Omit<Tenant, "id" | "createdAt" | "usersCount" | "storesCount"> & {
    storesCount?: number;
    usersCount?: number;
  }) {
    const t: Tenant = {
      ...input,
      id: nid("t"),
      storesCount: input.storesCount ?? 0,
      usersCount: input.usersCount ?? 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    state.tenants = [t, ...state.tenants];
    state.tenantModules = { ...state.tenantModules, [t.id]: [...input.modules] };
    audit({ tenant: t.name, action: "Created tenant", resource: `${t.name} (${t.tier})`, scope: "Global", result: "success" });
    emit();
    return t;
  },
  updateTenant(id: string, patch: Partial<Tenant>) {
    state.tenants = state.tenants.map((t) => (t.id === id ? { ...t, ...patch } : t));
    if (patch.modules) {
      state.tenantModules = { ...state.tenantModules, [id]: [...patch.modules] };
    }
    const t = state.tenants.find((x) => x.id === id);
    audit({ tenant: t?.name ?? "—", action: "Updated tenant", resource: t?.name ?? id, scope: "Tenant", result: "success" });
    emit();
  },
  deleteTenant(id: string) {
    const t = state.tenants.find((x) => x.id === id);
    state.tenants = state.tenants.filter((x) => x.id !== id);
    state.locations = state.locations.filter((l) => l.tenantId !== id);
    state.users = state.users.filter((u) => u.tenantId !== id);
    const { [id]: _drop, ...rest } = state.tenantModules;
    state.tenantModules = rest;
    audit({ tenant: t?.name ?? "—", action: "Deleted tenant", resource: t?.name ?? id, scope: "Global", result: "success" });
    emit();
  },

  // Locations (org tree)
  createLocation(input: Omit<Location, "id">) {
    const l: Location = { ...input, id: nid("l") };
    state.locations = [...state.locations, l];
    const t = state.tenants.find((x) => x.id === l.tenantId);
    audit({ tenant: t?.name ?? "—", action: "Added org node", resource: `${l.type}: ${l.name}`, scope: "Tenant", result: "success" });
    emit();
    return l;
  },
  updateLocation(id: string, patch: Partial<Location>) {
    state.locations = state.locations.map((l) => (l.id === id ? { ...l, ...patch } : l));
    const l = state.locations.find((x) => x.id === id);
    const t = state.tenants.find((x) => x.id === l?.tenantId);
    audit({ tenant: t?.name ?? "—", action: "Updated org node", resource: l?.name ?? id, scope: "Tenant", result: "success" });
    emit();
  },
  deleteLocation(id: string) {
    const target = state.locations.find((l) => l.id === id);
    // cascade: drop direct children too
    const children = new Set<string>();
    const collect = (parentId: string) => {
      state.locations.filter((l) => l.parentId === parentId).forEach((c) => {
        children.add(c.id);
        collect(c.id);
      });
    };
    collect(id);
    children.add(id);
    state.locations = state.locations.filter((l) => !children.has(l.id));
    const t = state.tenants.find((x) => x.id === target?.tenantId);
    audit({ tenant: t?.name ?? "—", action: "Removed org node", resource: target?.name ?? id, scope: "Tenant", result: "success" });
    emit();
  },

  // Users
  createUser(input: Omit<User, "id" | "lastActive">) {
    const u: User = { ...input, id: nid("u"), lastActive: "Just now" };
    state.users = [u, ...state.users];
    const t = state.tenants.find((x) => x.id === u.tenantId);
    audit({ tenant: t?.name ?? "Platform", action: "Created user", resource: `${u.name} <${u.email}>`, scope: "Tenant", result: "success" });
    emit();
    return u;
  },
  updateUser(id: string, patch: Partial<User>) {
    state.users = state.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    const u = state.users.find((x) => x.id === id);
    const t = state.tenants.find((x) => x.id === u?.tenantId);
    audit({ tenant: t?.name ?? "Platform", action: "Updated user", resource: u?.email ?? id, scope: "Tenant", result: "success" });
    emit();
  },
  deleteUser(id: string) {
    const u = state.users.find((x) => x.id === id);
    state.users = state.users.filter((x) => x.id !== id);
    const t = state.tenants.find((x) => x.id === u?.tenantId);
    audit({ tenant: t?.name ?? "Platform", action: "Deleted user", resource: u?.email ?? id, scope: "Tenant", result: "success" });
    emit();
  },

  // Roles
  createRole(input: Omit<Role, "id" | "usersCount">) {
    const r: Role = { ...input, id: nid("r"), usersCount: 0 };
    state.roles = [...state.roles, r];
    audit({ tenant: input.tenantId ? state.tenants.find((t) => t.id === input.tenantId)?.name ?? "—" : "Platform", action: "Created role", resource: r.name, scope: input.type === "Platform" ? "Global" : "Tenant", result: "success" });
    emit();
    return r;
  },
  updateRole(id: string, patch: Partial<Role>) {
    state.roles = state.roles.map((r) => (r.id === id ? { ...r, ...patch } : r));
    const r = state.roles.find((x) => x.id === id);
    audit({ tenant: r?.tenantId ? state.tenants.find((t) => t.id === r.tenantId)?.name ?? "—" : "Platform", action: "Updated role", resource: r?.name ?? id, scope: r?.type === "Platform" ? "Global" : "Tenant", result: "success" });
    emit();
  },
  deleteRole(id: string) {
    const r = state.roles.find((x) => x.id === id);
    state.roles = state.roles.filter((x) => x.id !== id);
    // also strip role from users
    state.users = state.users.map((u) =>
      u.roleIds.includes(id) ? { ...u, roleIds: u.roleIds.filter((x) => x !== id) } : u,
    );
    audit({ tenant: r?.tenantId ? state.tenants.find((t) => t.id === r.tenantId)?.name ?? "—" : "Platform", action: "Deleted role", resource: r?.name ?? id, scope: r?.type === "Platform" ? "Global" : "Tenant", result: "success" });
    emit();
  },

  // Module access
  toggleModule(tenantId: string, mod: ModuleKey, enabled: boolean) {
    const current = state.tenantModules[tenantId] ?? [];
    const next = enabled ? Array.from(new Set([...current, mod])) : current.filter((m) => m !== mod);
    state.tenantModules = { ...state.tenantModules, [tenantId]: next };
    state.tenants = state.tenants.map((t) => (t.id === tenantId ? { ...t, modules: next } : t));
    const t = state.tenants.find((x) => x.id === tenantId);
    const modName = seedModules.find((m) => m.key === mod)?.name ?? mod;
    audit({ tenant: t?.name ?? "—", action: enabled ? "Enabled module" : "Disabled module", resource: `${modName} → ${t?.name ?? "—"}`, scope: "Tenant", result: "success" });
    emit();
  },

  // Guardrails
  createGuardrail(input: Omit<GuardrailRule, "id">) {
    const g: GuardrailRule = { ...input, id: nid("g") };
    state.guardrails = [...state.guardrails, g];
    audit({ tenant: "Platform", action: "Created guardrail", resource: g.name, scope: "Global", result: "success" });
    emit();
    return g;
  },
  updateGuardrail(id: string, patch: Partial<GuardrailRule>) {
    state.guardrails = state.guardrails.map((g) => (g.id === id ? { ...g, ...patch } : g));
    const g = state.guardrails.find((x) => x.id === id);
    audit({ tenant: "Platform", action: "Updated guardrail", resource: g?.name ?? id, scope: "Global", result: "success" });
    emit();
  },
  deleteGuardrail(id: string) {
    const g = state.guardrails.find((x) => x.id === id);
    state.guardrails = state.guardrails.filter((x) => x.id !== id);
    audit({ tenant: "Platform", action: "Deleted guardrail", resource: g?.name ?? id, scope: "Global", result: "success" });
    emit();
  },

  // Maintenance
  resetAll() {
    state = seed();
    emit();
  },
};

// ─── Hook ─────────────────────────────────────────────────────────────
const getSnapshot = () => state;

export function useSuperadminStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
