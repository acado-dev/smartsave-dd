
Fix the `/superadmin` blank-page issue by removing the unstable bootstrap workaround and making the superadmin section mount in a more deterministic way.

1. Stabilize app startup
- Remove the leftover service-worker/cache cleanup logic from `src/main.tsx`.
- Keep boot simple: mount React immediately and do not touch browser caches or service-worker state on every load.
- This is important because Lovable already handles SPA routing, so the current cleanup code is unnecessary and is the most suspicious remaining change from the failed fixes.

2. Refactor superadmin routing into one nested route shell
- Update `src/App.tsx` so `/superadmin` uses one shared layout route with child routes:
  - index dashboard
  - tenants
  - organization
  - users
  - roles
  - modules
  - guardrails
  - audit
- Keep lowercase/trailing-slash normalization redirects, but move the actual pages under one parent route instead of repeating `<SuperadminLayout>` on every path.
- This reduces remounting edge cases and makes the section behave like the other structured workspaces.

3. Add a non-blank fallback for superadmin rendering
- Introduce a lightweight error-safe wrapper around the superadmin area so that if a page ever fails, the user sees a visible recovery panel instead of a blank screen.
- The recovery UI should:
  - say the superadmin console failed to load
  - include a “Return to dashboard” action
  - include a “Reset superadmin demo data” action
- This protects the experience even if future state/data issues occur.

4. Harden the superadmin demo store
- Strengthen `src/hooks/useSuperadminStore.ts` so saved local data is validated before use.
- If stored data is malformed or from an older incompatible shape, automatically fall back to seeded demo data instead of letting pages break.
- Keep the existing demo persistence, but make it resilient.

5. Verify every superadmin route after the fix
- Check these routes after implementation:
  - `/superadmin`
  - `/superadmin/users`
  - `/superadmin/tenants`
  - `/superadmin/organization`
  - `/superadmin/roles`
  - `/superadmin/modules`
  - `/superadmin/guardrails`
  - `/superadmin/audit`
- Confirm:
  - no blank screen
  - sidebar and header render
  - pages load with content
  - redirects with trailing slash/case variants still land correctly

Files to update
- `src/main.tsx`
- `src/App.tsx`
- `src/hooks/useSuperadminStore.ts`
- one new small fallback component for superadmin route safety

Technical note
- The current code already contains valid `/superadmin` routes, and the console snapshot shows no active runtime crash. That means this is most likely not a missing-route problem anymore. The remaining problem is more consistent with the previous cache/service-worker workaround plus brittle superadmin mounting, so the fix should focus there rather than adding more routing hacks.
