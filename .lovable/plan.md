## Add login + role-scoped workspace to `/superadmin`

Add a mock login screen at `/superadmin/login` and gate the existing `/superadmin/*` console behind it. After login, the same console adapts to the signed-in persona — Platform Super Admin sees everything, Organization Admin sees only their tenant/org, and Tenant Admin sees only users/roles inside their tenant scope.

### 1. Auth model (mock, demo-only)

Three personas, mapped to existing `superadminData.ts` records:

| Persona | Scope | Demo login |
|---|---|---|
| Platform Super Admin | All tenants, all modules, governance, audit, guardrails | `anjali@ithina.ai` |
| Organization Admin | Single tenant (full): users, roles, org tree, modules, audit for that tenant | `marcus.t@bucees.com` (Buc-ee's), `a.kowalski@zabka.pl` (Żabka), `priya@smartstore.io` (SmartStore) |
| Tenant Admin | Sub-scope of a tenant (e.g. region/store): users + roles only, no module/guardrail config | `j.cole@bucees.com` (Buc-ee's · Texas), `p.nowak@zabka.pl` (Żabka · Warsaw+Kraków) |

Password is ignored (demo). A "Quick sign-in" panel lists the demo accounts so reviewers can switch personas in one click.

Session is persisted in `localStorage` (`superadmin.session`). Logout clears it and returns to `/superadmin/login`.

### 2. New files

- `src/contexts/SuperadminAuthContext.tsx` — provider exposing `{ user, tenantId, persona, can(action), signIn, signOut }`. Persona is derived from the user's role (`r-super` → platform, `r-owner` → org, anything else → tenant).
- `src/pages/superadmin/SuperadminLogin.tsx` — branded login page (Ithina logo, dark navy theme matching the console) with email + password fields and the quick-sign-in list.
- `src/components/superadmin/RequireSuperadminAuth.tsx` — route guard that redirects to `/superadmin/login` when no session exists.

### 3. Edits

- `src/App.tsx` — wrap the `/superadmin` route tree with `SuperadminAuthProvider` + `RequireSuperadminAuth`, add `/superadmin/login` as a public child.
- `src/components/layouts/SuperadminLayout.tsx` — show real signed-in name/role in the header avatar block; add a logout menu; show the active tenant scope chip next to the PLATFORM badge (e.g. "Buc-ee's" for org admins).
- `src/components/navigation/SuperadminSidebar.tsx` — hide menu items the persona cannot access:
  - Platform admin: all items
  - Organization admin: Dashboard, Tenants (read-only single row), Org Tree, Users, Roles, Modules, Audit
  - Tenant admin: Dashboard, Org Tree (scoped), Users, Roles, Audit
- The console pages (`SuperadminDashboard`, `TenantsPage`, `UsersPage`, `RolesPermissions`, `OrganizationTree`, `ModuleAccess`, `GuardrailsPanel`, `AuditLog`) — filter their data through a small helper `scopeForPersona(persona, tenantId, locationIds, data)` so each persona only sees their own tenant's rows. Dashboard KPIs are recomputed against the filtered set so an org admin sees their tenant's stores/users/MRR, not platform totals.

### 4. UX details

- Login page uses the same dark navy + blue accent as the console for visual continuity; Ithina logo at the top.
- Header shows: `Ithina · Superadmin` for platform, `Ithina · {Tenant Name} Admin` for org, `Ithina · {Tenant Name} · {Scope}` for tenant admin.
- Unauthorized direct navigation (e.g. tenant admin opening `/superadmin/guardrails`) redirects to `/superadmin` with a toast.

### Technical notes

- Pure client-side mock — no Lovable Cloud, no backend. This matches the existing pattern used by `ESLLogin` (`localStorage`-based role gate).
- No changes to `superadminData.ts` shape; only consumers filter it.
- Existing deep-link redirects (`/Superadmin` → `/superadmin`) keep working; if the user is unauthenticated they land on the login page.

### Files touched

- new: `src/contexts/SuperadminAuthContext.tsx`
- new: `src/pages/superadmin/SuperadminLogin.tsx`
- new: `src/components/superadmin/RequireSuperadminAuth.tsx`
- new: `src/lib/superadminScope.ts` (small `scopeForPersona` helper)
- edit: `src/App.tsx`
- edit: `src/components/layouts/SuperadminLayout.tsx`
- edit: `src/components/navigation/SuperadminSidebar.tsx`
- edit: each page under `src/pages/superadmin/*` to apply the scope helper
