

## Replace "DD Brain" branding with Ithina logo in Superadmin

Swap the "DD Brain" text branding in the Superadmin console for the uploaded Ithina logo. Leave the Infomil presentations untouched (they reference "DD Brain" as a separate product narrative).

### 1. Add the logo asset
- Copy `user-uploads://ithina_final_white-3.png` into `src/assets/ithina-logo-white.png` so it can be imported as a bundled module.

### 2. Update the Superadmin sidebar (`src/components/navigation/SuperadminSidebar.tsx`)
- Replace the gradient crown tile + "DD Brain" / "Superadmin Console" text block with the Ithina logo image.
- Expanded state: show the Ithina logo (height ~28–32px, `object-contain`) followed by a small "Superadmin Console" caption underneath in the existing light-blue uppercase style.
- Collapsed state: show just the logo, scaled down to fit the 16px-wide rail (height ~28px, centered).
- Keep the existing dark header background and bottom border.

### 3. Update the Superadmin top header (`src/components/layouts/SuperadminLayout.tsx`)
- Change the subtitle text from `Ithina · DD Brain Governance Console` to `Ithina · Superadmin Governance Console`.
- Keep the PLATFORM badge and crown icon as-is (they're a role indicator, not branding).

### 4. Update the Superadmin dashboard copy (`src/pages/superadmin/SuperadminDashboard.tsx`)
- Change the subtitle from "Govern every tenant, module, role and approval rail across DD Brain." to "Govern every tenant, module, role and approval rail across Ithina."

### 5. Update Module Access copy (`src/pages/superadmin/ModuleAccess.tsx`)
- Change "Enable or disable DD Brain modules per tenant…" to "Enable or disable Ithina modules per tenant…"

### Out of scope (intentionally not changed)
- `InfomilPresentation.tsx` and `InfomilStrategicPresentation.tsx` — "DD Brain" there is a distinct product narrative for the Infomil pitch deck.
- `src/data/superadminData.ts` header comment — internal-only, not user-visible.
- `src/App.tsx` route comment — internal-only.

### Files touched
- `src/assets/ithina-logo-white.png` (new, copied from upload)
- `src/components/navigation/SuperadminSidebar.tsx`
- `src/components/layouts/SuperadminLayout.tsx`
- `src/pages/superadmin/SuperadminDashboard.tsx`
- `src/pages/superadmin/ModuleAccess.tsx`

