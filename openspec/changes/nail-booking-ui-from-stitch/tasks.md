## 1. Foundation (mocks, types, i18n, shared UI)

- [x] 1.1 [ui] Add shared UI primitives needed by salon surfaces (Button, Input, Badge, empty states) under `@components/ui` if missing
- [x] 1.2 [ui] Create `src/mocks` modules: services catalog, staff, availability slots, bookings, schedule/settings sample data + TypeScript types under `@typings`
- [x] 1.3 [ui] Add thin `@services` hooks that resolve mock data (TanStack Query where list/detail caching helps); no new booking Route Handlers/Actions
- [x] 1.4 [ui] Add next-intl message keys for salon marketing, booking, account, admin (`en` default + `vi`)

## 2. Shell cluster

- [x] 2.1 [ui] Implement public `SiteHeader` / `SiteFooter` (logo, nav, Book CTA) within AppShell ≤1280 + Averie tokens
- [x] 2.2 [ui] Implement booking wizard chrome (cancel, step indicator) reused across booking steps
- [x] 2.3 [ui] Implement `AdminSidebar` + admin top bar shell for `/admin/*`

## 3. Catalog cluster (landing)

- [x] 3.1 [ui] Port Stitch landing (`Luxury Nail Salon Landing Page`) to `/` with hero, feature, services preview, CTA banner sections as components
- [x] 3.2 [ui] Wire Book CTAs to `/book`; map marketing nav to in-page anchors or stubs per design
- [x] 3.3 [ui] Apply EN/VI copy + responsive layout check inside AppShell

## 4. Book cluster (wizard)

- [x] 4.1 [ui] Scaffold `/book` wizard state (`?step=` or equivalent) + `BookingSummary` sidebar
- [x] 4.2 [ui] Step: Select Service (categories + selectable cards from mocks)
- [x] 4.3 [ui] Step: Select Employee (incl. “any available” if present in Stitch)
- [x] 4.4 [ui] Steps: Select Date + Select Time (mock calendar/slots)
- [x] 4.5 [ui] Step: Customer Information (RHF + Zod `@validations`)
- [x] 4.6 [ui] Step: Review + Confirm → `/book/confirmation` with mock reference id
- [x] 4.7 [ui] Localize all booking strings EN/VI; mobile usability pass for wizard

## 5. Account cluster

- [x] 5.1 [ui] Client login page `/login` from Stitch Client Login (Zod form + mock submit)
- [x] 5.2 [auth] Admin login page `/admin/login` with mock gate redirect into `/admin` (UI-only; no real salon Auth.js roles)
- [x] 5.3 [ui] Localize account screens EN/VI

## 6. Misc cluster (admin screens + assets)

- [x] 6.1 [ui] Admin Overview `/admin` — KPI cards + today’s schedule table (mocks)
- [x] 6.2 [ui] Bookings list `/admin/bookings` + detail `/admin/bookings/[id]` (client-side filter/search on mocks)
- [x] 6.3 [ui] Service Management `/admin/services` (list + add/edit UI → mock/in-memory)
- [x] 6.4 [ui] Staff Management `/admin/staff` + Staff Schedule Details `/admin/staff/[id]/schedule`
- [x] 6.5 [ui] Master Schedule `/admin/schedule` + Shift Management `/admin/shifts` + Schedule Settings `/admin/settings/schedule`
- [x] 6.6 [ui] Place Stitch image assets into `public/` (or mock URLs) for landing/media references; skip non-UI asset routes
- [x] 6.7 [ui] Admin i18n EN/VI + responsive/sidebar collapse sanity

## 7. Verification

- [x] 7.1 [ui] Manual walkthrough: landing → book happy path → confirmation
- [x] 7.2 [ui] Manual walkthrough: admin login mock → each admin nav target renders
- [x] 7.3 [ui] Run `pnpm type-check` (and lint when many files touched); fix regressions
