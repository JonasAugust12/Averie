## Why

Landing was realigned to Stitch HTML and now matches design; booking, login, and admin UIs still look generic versus Stitch screens. A dedicated fidelity pass—fetching each screen’s HTML/image first—prevents another approximate rewrite and keeps the salon product visually coherent with the approved design source.

## What Changes

- Re-port **book wizard** steps + confirmation to match Stitch layout/components (Service → Employee → Date → Time → Customer → Review → Confirmation).
- Re-port **client login** and **admin login** to Stitch layouts.
- Re-port **admin shell and all admin pages** (overview, bookings list/detail, services, staff, staff schedule, master schedule, shifts, settings) to Stitch structure.
- Save per-screen HTML references under `docs/stitch/` during apply.
- Prefer Tailwind **canonical** utilities over arbitrary values that trigger `suggestCanonicalClasses`.

**Visual fidelity (book / account / admin)**

- From: functional but generic Averie layouts
- To: structure, hierarchy, spacing, and component shapes from Stitch HTML, with Averie tokens + AppShell ≤1280
- Reason: Owner design source is Stitch; landing already proves the method
- Impact: non-breaking for mock behavior; UI-only

## Non-goals

- No API, Mongo, or real Auth.js salon roles.
- No wholesale paste of Stitch HTML into the app.
- No redesign of landing (already aligned) except regression fixes.
- Not claiming pixel-perfect outside AppShell/token constraints.
- No new booking business logic beyond existing mocks.

## Capabilities

### New Capabilities

- _(none)_

### Modified Capabilities

- `appointment-booking`: Visual/layout requirements MUST match Stitch booking screens while keeping mock-only behavior.
- `account-access`: Client and admin login UIs MUST match Stitch login screens (still mock auth).
- `salon-admin`: Admin shell and management pages MUST match Stitch admin screens (still mock data).

## Impact

- Primarily `src/components/booking/**`, `src/components/account/**`, `src/components/admin/**`, related `(user)` / `admin` page views, messages if copy must match Stitch.
- Touches `docs/stitch/` for HTML refs.
- Does not change API routes, Mongo models, or Auth.js protocol.
