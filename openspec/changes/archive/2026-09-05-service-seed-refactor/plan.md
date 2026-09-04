# Service Seed Refactor Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Unify landing, booking, and admin around a 12-category PDF-aligned service catalog with server-fetched landing price list.

**Architecture:** Extend `ServiceCategory` with marketing metadata; seed full menu from `scripts/data/salon-menu.mjs`; server helper loads catalog for RSC landing; client components consume same DTOs as `GET /api/service-categories`.

**Tech Stack:** Next.js 15 RSC, MongoDB/Mongoose, TanStack Query (booking/admin), Lucide React, next-intl, Zod.

**References:** `design.md`, `tasks.md`, delta specs under `specs/`

---

## Task 1: Extend ServiceCategory schema [db]

- [ ] **Step 1:** Add fields to `src/models/service-category.model.ts`: `slug` (required, unique), `subtitle`, `description`, `note` (strings, default ''), `featured` (boolean, default false). Add unique index on `slug`.
- [ ] **Step 2:** Update `src/types/service-category.type.ts` DTO interface with new fields.
- [ ] **Step 3:** Update `src/mappers/service-category.mapper.ts` to map all new fields.
- [ ] **Step 4:** Extend `src/validations/service-category.schema.ts` — `slug` required on create (kebab-case regex), optional on update (omit or read-only).
- [ ] **Step 5:** Update `src/actions/service-category.action.ts` to pass new fields through create/update.
- [ ] **Step 6:** Update `src/openapi/schemas/service.schema.ts` and examples.
- [ ] **Step 7:** Run `pnpm type-check`.

**Commit:** `feat(catalog): extend ServiceCategory with marketing fields`

---

## Task 2: Create salon menu seed data [db]

- [ ] **Step 1:** Create `scripts/data/salon-menu.mjs` exporting `SALON_MENU` array — copy structure from `Averie-Astro/src/data/price-list.ts`, converting prices to numbers (strip `$`), adding `estimatedMinutes` per service.
- [ ] **Step 2:** Map 12 categories with `slug`, `name`, `subtitle`, `description`, `note`, `featured`, `sortOrder`, `icon` (Lucide names per design.md table).
- [ ] **Step 3:** Include all ~55 services with `name`, `description`, `price`, `estimatedMinutes`.
- [ ] **Step 4:** Export helper `getCategorySlugs()` for cleanup step.

**Commit:** `feat(seed): add full salon menu data module`

---

## Task 3: Refactor seed script [db]

- [ ] **Step 1:** Import `SALON_MENU` in `scripts/seed-salon.mjs`; replace `CATEGORIES` and `SAMPLE_SERVICES` constants.
- [ ] **Step 2:** Upsert categories by `slug` with `$set` for mutable fields, `$setOnInsert` for slug.
- [ ] **Step 3:** Upsert services by `{ categoryId, name }` with full field `$set`.
- [ ] **Step 4:** After upsert, `deleteMany` categories where `slug` not in menu slugs; cascade delete orphaned services.
- [ ] **Step 5:** Update `seedBookings` service names to match seeded menu (e.g. "Manicure" under Signature → use disambiguated names like "Signature Manicure" if needed).
- [ ] **Step 6:** Run `pnpm db:seed`; verify 12 categories and ~55 services in MongoDB.

**Commit:** `feat(seed): upsert full menu and prune legacy categories`

---

## Task 4: Server catalog helper [api]

- [ ] **Step 1:** Create `src/server/service-catalog.server.ts` with `getPublicServiceCatalog()` — `connectToDatabase()`, query categories sorted by `sortOrder`, services with `visible: true`, map via existing serializers.
- [ ] **Step 2:** Return `ServiceCategoryWithServicesDto[]` type (reuse from `@services/service-catalog.service`).
- [ ] **Step 3:** Update `src/app/(user)/page.tsx` — async Server Component, call helper, pass `catalog` prop to `LandingPageView`.
- [ ] **Step 4:** Update `LandingPageView` props to accept optional `catalog` and forward to price list.

**Commit:** `feat(catalog): add server-side public catalog helper for landing`

---

## Task 5: LandingPriceList component [ui]

- [ ] **Step 1:** Create `src/components/landing/LandingPriceList.tsx` — accept `categories: ServiceCategoryWithServicesDto[]`.
- [ ] **Step 2:** Implement filter tabs (client state) using slug → filterGroup map from Astro `getFilterGroup()`.
- [ ] **Step 3:** Render category cards: Lucide icon via `resolveLucideIconWithFallback`, name, subtitle, description, service rows with `formatUsd(price)`, note footer, featured badge.
- [ ] **Step 4:** Add book CTA banner linking to `/book`.
- [ ] **Step 5:** Match existing landing styles (`landingEyebrow`, `landingTitle`, `FadeIn`, `LandingBubbles`).
- [ ] **Step 6:** Add i18n keys `landing.priceList.*` in en/vi salon.json.
- [ ] **Step 7:** Export from `src/components/landing/index.ts`; mount in `LandingPageView` after `LandingServices`.
- [ ] **Step 8:** Remove `LandingPricing` from exports if fully superseded; delete file if unused.

**Commit:** `feat(landing): add API-driven price list section`

---

## Task 6: Booking ServiceStep alignment [ui]

- [ ] **Step 1:** Open `src/components/booking/ServiceStep.tsx`; delete `CAT_META` Record keyed by legacy slugs.
- [ ] **Step 2:** Use `resolveLucideIconWithFallback(cat.icon)` for category headers; use generic gradient fallback.
- [ ] **Step 3:** Verify accordion renders all categories from API; test search/filter with 12 groups.
- [ ] **Step 4:** Mirror any needed changes in `src/components/admin/bookings/BookingServiceStep.tsx`.

**Commit:** `refactor(booking): dynamic category icons for 12-category catalog`

---

## Task 7: Admin category form [ui]

- [ ] **Step 1:** Extend `CategoryFormModal` state with subtitle, description, note, featured, slug (create only).
- [ ] **Step 2:** Add form fields (textarea for description/note, toggle for featured).
- [ ] **Step 3:** Add admin i18n labels in en/vi admin.json.
- [ ] **Step 4:** Test create/edit category on `/admin/services`.

**Commit:** `feat(admin): category form supports marketing metadata`

---

## Task 8: Final verification

- [ ] **Step 1:** Run `pnpm type-check && pnpm lint`.
- [ ] **Step 2:** Smoke test `/` — price list shows 12 categories with filters.
- [ ] **Step 3:** Smoke test `/book` — all categories selectable, prices/minutes correct.
- [ ] **Step 4:** Smoke test `/admin/services` — CRUD with new fields.
- [ ] **Step 5:** Check `PopularServices` dashboard for broken hardcoded references.

**Commit:** `chore: verify service seed refactor`
