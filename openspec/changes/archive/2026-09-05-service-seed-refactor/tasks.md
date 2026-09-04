## 1. Schema and data layer [db]

- [x] 1.1 [db] Extend `ServiceCategory` Mongoose schema with `slug`, `subtitle`, `description`, `note`, `featured` and unique index on `slug`
- [x] 1.2 [db] Update `ServiceCategoryDto`, mapper, Zod create/update schemas, and OpenAPI schema for new fields
- [x] 1.3 [db] Update `createServiceCategoryAction` / `updateServiceCategoryAction` to persist new fields
- [x] 1.4 [db] Ensure `GET /api/service-categories` serializes new category fields in response

## 2. Seed menu data [db]

- [x] 2.1 [db] Create `scripts/data/salon-menu.mjs` with 12 categories and ~55 services from PDF/Astro (prices, descriptions, estimated minutes)
- [x] 2.2 [db] Refactor `scripts/seed-salon.mjs` to upsert categories by `slug` and services by `(categorySlug, name)`
- [x] 2.3 [db] Add seed cleanup: delete categories not in menu file and their services
- [x] 2.4 [db] Update sample bookings in seed to reference valid seeded service names
- [x] 2.5 [db] Run `pnpm db:seed` and verify MongoDB contains full menu

## 3. Server catalog helper [api]

- [x] 3.1 [api] Create `src/server/service-catalog.server.ts` with `getPublicServiceCatalog()` returning categories + visible services DTOs
- [x] 3.2 [api] Wire `src/app/(user)/page.tsx` to fetch catalog server-side and pass to `LandingPageView`

## 4. Landing price list UI [ui]

- [x] 4.1 [ui] Create `LandingPriceList` component (port Astro layout: filters, cards, featured badge, book CTA) using Lucide icons
- [x] 4.2 [ui] Add `landing.priceList.*` i18n keys in `messages/en/salon.json` and `messages/vi/salon.json`
- [x] 4.3 [ui] Mount `LandingPriceList` in `LandingPageView` after `LandingServices`; remove `LandingPricing` import/export if unused
- [x] 4.4 [ui] Remove obsolete `landing.pricing.rows.*` i18n keys after confirming no references

## 5. Booking alignment [ui]

- [x] 5.1 [ui] Remove hardcoded `CAT_META` slug map from `ServiceStep.tsx`; use category DTO `icon` dynamically
- [x] 5.2 [ui] Verify `BookingServiceStep` (admin) renders correctly with 12 categories
- [x] 5.3 [ui] Update booking i18n if any category-specific copy references legacy six-category names

## 6. Admin alignment [ui]

- [x] 6.1 [ui] Extend `CategoryFormModal` with slug (create only), subtitle, description, note, featured fields
- [x] 6.2 [ui] Update admin i18n labels for new category fields in `messages/en/admin.json` and `messages/vi/admin.json`
- [x] 6.3 [ui] Verify `ServiceCard` / services page display with expanded catalog

## 7. Verification [api]

- [x] 7.1 [api] Run `pnpm type-check` and `pnpm lint`
- [x] 7.2 [ui] Manual smoke: `/` price list, `/book` service step, `/admin/services` CRUD
- [x] 7.3 [api] Update OpenAPI examples if service category example lacks new fields
