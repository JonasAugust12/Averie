# Nail Booking UI from Stitch — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development
> to implement this plan task-by-task. Prefer UI/UX Pro Max before heavy visual polish.

**Goal:** Port all 19 Avere Stitch UI screens into Averie as a mock-backed salon marketing, booking, and admin UI inside AppShell ≤1280 with Averie tokens and EN/VI i18n.

**Architecture:** Feature folders under `@components/{marketing,booking,admin,ui}`; mock domain data in `src/mocks` consumed by thin `@services` hooks; App Router routes for public (`/`, `/book`, `/login`) and admin (`/admin/**`); no new booking API/Mongo. Stitch screenshots/HTML are reference only — port to React + Tailwind.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 4, Lucide, next-intl (EN default + VI), RHF + Zod, TanStack Query (optional for mock lists), Zustand optional for wizard state if URL query is insufficient.

**Stitch:** projectId `10694160950357827758` — inventory at `%USERPROFILE%\.cursor\stitch\inventory-10694160950357827758.json`.

**Refs:** `brainstorm.md`, `design.md`, `proposal.md`, `specs/*`, `tasks.md`, `docs/overview.md`.

---

## File map (expected)

| Path                                                         | Responsibility                                      |
| ------------------------------------------------------------ | --------------------------------------------------- |
| `src/mocks/salon/*`                                          | services, staff, slots, bookings, schedule fixtures |
| `src/types/salon*.ts`                                        | domain types                                        |
| `src/services/salon*.service.ts`                             | hooks over mocks                                    |
| `src/validations/booking.schema.ts` / `salon-auth.schema.ts` | Zod                                                 |
| `src/components/ui/*`                                        | shared primitives                                   |
| `src/components/marketing/*`                                 | landing sections, public header/footer              |
| `src/components/booking/*`                                   | wizard, steps, summary                              |
| `src/components/admin/*`                                     | sidebar, tables, KPI cards                          |
| `src/app/**/page.tsx`                                        | thin route entries                                  |
| `messages/en.json`, `messages/vi.json`                       | copy namespaces `Salon*`, `Booking*`, `Admin*`      |
| `public/salon/*`                                             | exported marketing images from Stitch assets        |

---

## Task 1: Foundation — mocks, types, i18n, UI primitives

- [ ] **Step 1:** Inspect existing `@components`, AppShell, i18n layout patterns in Averie.
- [ ] **Step 2:** Add salon TypeScript types (`Service`, `Staff`, `TimeSlot`, `Booking`, `ScheduleSettings`).
- [ ] **Step 3:** Create mock fixtures with ≥2 categories of services, ≥3 staff, sample slots/bookings.
- [ ] **Step 4:** Add `@services` hooks returning mocks (Promise + Query keys).
- [ ] **Step 5:** Add missing UI primitives (Button/Input/Badge) matching Averie tokens.
- [ ] **Step 6:** Insert empty `en`/`vi` namespaces for SalonMarketing, Booking, Account, Admin.
- [ ] **Step 7:** `pnpm type-check` — fix type-only regressions.

## Task 2: Shell cluster

- [ ] **Step 1:** Build `SiteHeader` + `SiteFooter` with Book CTA → `/book`.
- [ ] **Step 2:** Build booking chrome (`BookingHeader`, step label “Step X of 7”).
- [ ] **Step 3:** Build `AdminSidebar` + admin header strip.
- [ ] **Step 4:** Visual smoke in Story-less page stubs or temp routes; confirm ≤1280 containment.
- [ ] **Step 5:** Commit point: `feat(ui): add salon public/admin shells`.

## Task 3: Catalog — landing `/`

- [ ] **Step 1:** Pull Stitch landing screenshot/HTML ref (`7af10a90…`).
- [ ] **Step 2:** Implement section components: Hero, FeatureMoment, MarqueeCTA, ServicesPreview.
- [ ] **Step 3:** Compose `/` page inside AppShell + public shell.
- [ ] **Step 4:** Wire i18n strings; mobile stack pass.
- [ ] **Step 5:** Manual check Book CTAs; commit `feat(ui): port avere marketing landing`.

## Task 4: Book wizard

- [ ] **Step 1:** Scaffold `/book` with step state (`searchParams.step` 1–6) + `BookingSummary`.
- [ ] **Step 2:** Service step — select one mock service; summary updates.
- [ ] **Step 3:** Employee step — staff list + optional “Any available”.
- [ ] **Step 4:** Date step — calendar UI; disable closed days from mock settings.
- [ ] **Step 5:** Time step — slot buttons from mock availability.
- [ ] **Step 6:** Customer step — RHF+Zod; block invalid continue.
- [ ] **Step 7:** Review step — read-only summary; Confirm writes mock ref and navigates `/book/confirmation`.
- [ ] **Step 8:** Confirmation page — show mock booking number + details.
- [ ] **Step 9:** EN/VI + mobile pass; commit `feat(ui): mock appointment booking wizard`.

## Task 5: Account screens

- [ ] **Step 1:** `/login` client form UI from Stitch; Zod schema.
- [ ] **Step 2:** `/admin/login` form UI; on mock success set client gate + redirect `/admin`.
- [ ] **Step 3:** i18n + error states; commit `feat(ui): salon login screens (mock)`.

## Task 6: Admin misc screens

- [ ] **Step 1:** `/admin` overview — KPI cards + today’s table from mocks.
- [ ] **Step 2:** Bookings list + detail pages with client-side filter/search.
- [ ] **Step 3:** Services CRUD UI (in-memory mock mutation).
- [ ] **Step 4:** Staff list + staff schedule detail.
- [ ] **Step 5:** Master schedule, shifts, schedule settings pages.
- [ ] **Step 6:** Drop usable Stitch assets into `public/salon/`; reference from landing.
- [ ] **Step 7:** Admin i18n + nav highlight; commit `feat(ui): mock salon admin console`.

## Task 7: Verification

- [ ] **Step 1:** Walk landing → book → confirmation.
- [ ] **Step 2:** Walk admin login → each sidebar route renders without crash.
- [ ] **Step 3:** `pnpm type-check` (+ lint if broad touch).
- [ ] **Step 4:** Note residual polish for UI/UX Pro Max (not blocking apply).

---

## Apply notes

- Do **not** add booking Route Handlers or Mongo models in this change.
- Prefer component splits over mega-pages.
- When unsure of layout, re-open Stitch screenshot via inventory URLs before inventing UI.
