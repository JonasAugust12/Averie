## Why

The Next.js landing page still shows a static 5-row pricing summary while the real salon menu has 12 treatment categories and ~55 priced services documented in the PDF and Astro site. The database seed only inserts 6 placeholder categories and 4 sample services, so booking and admin do not reflect the actual menu. Operators cannot manage what customers see, and the landing page cannot show accurate pricing without duplicating data. This change establishes one MongoDB-backed catalog shared by landing, booking, and admin.

## What Changes

**Service category model**

- From: `name`, `sortOrder`, `icon` only
- To: adds `slug`, `subtitle`, `description`, `note`, `featured`
- Reason: Landing cards need marketing metadata matching the PDF/Astro menu
- Impact: Non-breaking for reads (new fields optional); admin forms and DTOs extended

**Category count and seed data**

- From: 6 placeholder categories, 4 sample services
- To: 12 PDF-aligned categories, ~55 services with descriptions and estimated minutes
- Reason: Single source of truth for the real salon menu
- Impact: Re-seed replaces placeholder catalog; sample bookings updated

**Landing pricing section**

- From: Static `LandingPricing` with i18n rows (not mounted in page view)
- To: `LandingPriceList` fed by server-fetched catalog API data, Astro-style filter cards
- Reason: Live menu on landing without duplicate static copy
- Impact: New section in `LandingPageView`; obsolete static pricing rows removed from i18n

**Booking service step**

- From: Hardcoded `CAT_META` for 6 legacy category slugs
- To: Dynamic rendering for all 12 categories from API DTOs
- Reason: Booking must match seeded catalog
- Impact: Non-breaking UX improvement; more category groups visible

**Admin category management**

- From: Name + icon only in category form
- To: Slug, subtitle, description, note, featured fields editable
- Reason: Operators can maintain landing/booking parity
- Impact: Admin form and validation extended

## Capabilities

### New Capabilities

_(none — all changes extend existing capabilities)_

### Modified Capabilities

- `salon-persistence`: Extended `ServiceCategory` schema; full PDF menu seed; seed cleanup of obsolete categories
- `salon-marketing`: API-driven price list section with server-side catalog fetch; replace static pricing
- `appointment-booking`: Booking wizard consumes 12-category catalog without hardcoded category metadata
- `salon-admin`: Category CRUD supports new marketing fields
- `salon-fe-data-layer`: Server catalog helper for RSC landing fetch; landing initial data pattern

## Impact

**Database / seed**

- `src/models/service-category.model.ts`
- `scripts/seed-salon.mjs`, `scripts/data/salon-menu.mjs` (new)

**API / server**

- `src/mappers/service-category.mapper.ts`
- `src/validations/service-category.schema.ts`
- `src/openapi/schemas/service.schema.ts`
- `src/server/service-catalog.server.ts` (new)
- `src/app/api/service-categories/route.ts` (response shape)

**Landing**

- `src/components/landing/LandingPriceList.tsx` (new)
- `src/components/landing/LandingPageView.tsx`
- `src/app/(user)/page.tsx`
- `messages/en/salon.json`, `messages/vi/salon.json`
- Remove `LandingPricing.tsx` if superseded

**Booking**

- `src/components/booking/ServiceStep.tsx`
- `src/components/admin/bookings/BookingServiceStep.tsx`
- `messages/en/booking.json`, `messages/vi/booking.json` (if category labels needed)

**Admin**

- `src/components/admin/services/CategoryFormModal.tsx`
- `src/components/admin/services/ServiceCard.tsx`
- `src/app/admin/services/page.tsx`

**Other**

- `src/components/admin/dashboard/PopularServices.tsx` (if hardcoded names)
- OpenAPI examples

## Non-Goals

- Changes to the Astro marketing site
- Automated PDF parsing
- Booking category grouping (6-group collapse layer)
- Product catalog or promotion changes
