## Why

Averie needs a customer-facing nail salon booking experience and a salon-owner admin shell, already designed in Stitch (`10694160950357827758`). Building UI-first with mocks unblocks review of flows and visual structure before Mongo/API work, while keeping Averie’s AppShell and theme conventions.

## What Changes

- Port all **19 Stitch UI screens** into Next.js App Router pages/components (landing, 7-step booking, client/admin login, admin dashboards).
- Add mock data modules + thin client services/hooks; forms use RHF + Zod for UI validation only.
- Wire **next-intl** copy for new surfaces (**EN default**, VI messages).
- Keep content in **AppShell ≤1280px** with Averie tokens; map Stitch layout, not pixel-perfect HTML paste.

**Public site**

- From: demo todo/home scaffolding
- To: Avere marketing landing + book CTA + booking wizard + client login UI
- Reason: Match Stitch product surface
- Impact: non-breaking for existing auth/todo demos if kept aside

**Admin console**

- From: none
- To: mock admin overview, bookings, services, staff, schedule/shifts/settings UIs
- Reason: Full Stitch coverage includes owner tools
- Impact: new `/admin/*` routes (UI-only)

## Non-goals

- No booking REST/API Route Handlers, no Server Actions for appointments, no Mongo models.
- No real Auth.js salon roles / session enforcement for admin or client (mock UI only).
- Not pixel-perfect Stitch; no replacing Averie theme tokens with Stitch-only palettes.
- No dedicated marketing subpages beyond what Stitch provides (nav may use anchors).

## Capabilities

### New Capabilities

- `salon-marketing`: Public landing/shell (nav, hero, sections, footer) driving Book CTA.
- `appointment-booking`: Multi-step client booking wizard + confirmation with mock availability/pricing.
- `account-access`: Client and admin login page UIs (mock submit).
- `salon-admin`: Admin shell and management screens (overview, bookings, services, staff, schedules) on mocks.

### Modified Capabilities

- _(none — no existing capability specs require requirement changes)_

## Impact

- Touches `src/app`, `src/components`, `src/services`, `src/mocks` (new), `src/validations`, `messages/*`, possibly routing/layout providers.
- Does **not** change Mongo connection, Auth.js protocol routes, or existing todo API contracts.
- Depends on Stitch inventory snapshot for apply-time visual reference (`list_screens` / screenshots).
