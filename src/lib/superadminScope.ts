import { useMemo } from "react";
import { useSuperadminStore } from "@/hooks/useSuperadminStore";
import { useSuperadminAuth, type SuperadminSession } from "@/contexts/SuperadminAuthContext";

/**
 * Returns the superadmin store filtered to whatever the signed-in persona is allowed to see.
 * Mirrors the shape of useSuperadminStore() so call-sites can swap with one import change.
 */
export function useScopedSuperadminStore() {
  const full = useSuperadminStore();
  const { session } = useSuperadminAuth();

  return useMemo(() => scope(full, session), [full, session]);
}

function scope(full: ReturnType<typeof useSuperadminStore>, session: SuperadminSession | null) {
  // Not logged in or platform admin → full data.
  if (!session || session.persona === "platform") return full;

  const tenantId = session.tenantId;

  const tenants = full.tenants.filter((t) => t.id === tenantId);
  const locations = full.locations.filter((l) => l.tenantId === tenantId);

  // Build set of in-scope location ids for the tenant persona.
  const allowedLocationIds = (() => {
    if (session.persona === "organization") return new Set(locations.map((l) => l.id));
    // Tenant persona: include the assigned nodes + all their descendants.
    const allowed = new Set<string>(session.locationIds);
    let changed = true;
    while (changed) {
      changed = false;
      for (const l of locations) {
        if (l.parentId && allowed.has(l.parentId) && !allowed.has(l.id)) {
          allowed.add(l.id);
          changed = true;
        }
      }
    }
    return allowed;
  })();

  const scopedLocations =
    session.persona === "organization" ? locations : locations.filter((l) => allowedLocationIds.has(l.id));

  const users = full.users.filter((u) => {
    if (u.tenantId !== tenantId) return false;
    if (session.persona === "organization") return true;
    // tenant persona: include users that touch any allowed location, plus the user themselves
    if (u.id === session.userId) return true;
    if (u.locationIds.length === 0) return false;
    return u.locationIds.some((id) => allowedLocationIds.has(id));
  });

  const roles = full.roles.filter((r) => {
    if (r.type === "Platform") return false; // hide platform roles
    if (r.tenantId && r.tenantId !== tenantId) return false;
    return true;
  });

  const audit = full.audit.filter(
    (a) => a.tenant === session.tenantName || a.tenant === full.tenants.find((t) => t.id === tenantId)?.name,
  );

  // Guardrails are platform-managed in the demo; tenant personas don't see them.
  const guardrails = session.persona === "organization" ? full.guardrails : [];

  return {
    ...full,
    tenants,
    locations: scopedLocations,
    users,
    roles,
    audit,
    guardrails,
  };
}

/** Convenience: which menu items / pages a persona may access. */
export function canAccess(
  section:
    | "dashboard"
    | "tenants"
    | "organization"
    | "users"
    | "roles"
    | "modules"
    | "guardrails"
    | "audit",
  persona: SuperadminSession["persona"] | undefined,
) {
  if (!persona || persona === "platform") return true;
  if (persona === "organization") {
    return ["dashboard", "tenants", "organization", "users", "roles", "modules", "audit"].includes(section);
  }
  // tenant
  return ["dashboard", "organization", "users", "roles", "audit"].includes(section);
}
