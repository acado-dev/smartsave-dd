import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { users as seedUsers, roles as seedRoles, tenants as seedTenants } from "@/data/superadminData";

export type Persona = "platform" | "organization" | "tenant";

export interface SuperadminSession {
  userId: string;
  email: string;
  name: string;
  persona: Persona;
  /** "platform" for platform persona, otherwise the tenant id */
  tenantId: string;
  tenantName: string;
  /** Restricted to these org-tree nodes for the tenant persona; empty for org/platform */
  locationIds: string[];
  primaryRoleName: string;
}

interface Ctx {
  session: SuperadminSession | null;
  signIn: (email: string) => { ok: boolean; error?: string };
  signOut: () => void;
}

const STORAGE_KEY = "ithina.superadmin.session.v1";
const AuthCtx = createContext<Ctx | null>(null);

export const DEMO_ACCOUNTS: { email: string; label: string; sub: string }[] = [
  { email: "anjali@ithina.ai", label: "Platform Super Admin", sub: "All tenants · governance · audit" },
  { email: "marcus.t@bucees.com", label: "Organization Admin — Buc-ee's", sub: "Tenant-wide scope" },
  { email: "a.kowalski@zabka.pl", label: "Organization Admin — Żabka Group", sub: "Tenant-wide scope" },
  { email: "priya@smartstore.io", label: "Organization Admin — SmartStore", sub: "Tenant-wide scope" },
  { email: "j.cole@bucees.com", label: "Tenant Admin — Buc-ee's · Texas", sub: "Region-scoped users & roles" },
  { email: "p.nowak@zabka.pl", label: "Tenant Admin — Żabka · Warsaw + Kraków", sub: "Region-scoped users & roles" },
];

function buildSession(email: string): SuperadminSession | null {
  const user = seedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const primaryRole = seedRoles.find((r) => r.id === user.roleIds[0]);
  let persona: Persona = "tenant";
  if (primaryRole?.id === "r-super" || primaryRole?.id === "r-platform" || primaryRole?.id === "r-support" || primaryRole?.id === "r-module") {
    persona = "platform";
  } else if (primaryRole?.id === "r-owner") {
    persona = "organization";
  } else {
    persona = "tenant";
  }
  const tenant = seedTenants.find((t) => t.id === user.tenantId);
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    persona,
    tenantId: user.tenantId,
    tenantName: user.tenantId === "platform" ? "Ithina Platform" : tenant?.name ?? user.tenantId,
    locationIds: persona === "tenant" ? user.locationIds : [],
    primaryRoleName: primaryRole?.name ?? "User",
  };
}

export function SuperadminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SuperadminSession | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SuperadminSession;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [session]);

  const value = useMemo<Ctx>(
    () => ({
      session,
      signIn: (email) => {
        const s = buildSession(email.trim());
        if (!s) return { ok: false, error: "No matching superadmin user found for that email." };
        setSession(s);
        return { ok: true };
      },
      signOut: () => setSession(null),
    }),
    [session],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useSuperadminAuth(): Ctx {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useSuperadminAuth must be used inside <SuperadminAuthProvider>");
  return ctx;
}
