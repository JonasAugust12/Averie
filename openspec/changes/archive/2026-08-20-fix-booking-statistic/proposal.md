## Why

Admin bookings statistics currently count only records on the visible paginated page, so upcoming and cancelled totals change incorrectly while operators paginate or filter. The page also lacks a clear "completed" bucket for upcoming appointments whose scheduled salon-local time has passed. Fixing this now makes the admin dashboard trustworthy without adding a database sweep job.

## What Changes

**Admin Booking Statistics**

- From: `/admin/bookings` computes upcoming and cancelled counts from the current `items` page.
- To: `GET /api/bookings` returns aggregate stats for the full filtered result set, and the UI renders those API totals.
- Reason: Stats need to represent all matching bookings, not only current page rows.
- Impact: Non-breaking additive API response change for consumers of `PaginatedBookingsDto`.

**Completed Booking Display**

- From: Past appointments remain visually labeled as upcoming until a manual or background process changes the database.
- To: The admin bookings API/UI exposes a derived completed state for `upcoming` bookings whose appointment time has passed in `America/New_York`.
- Reason: Operators need to distinguish future upcoming appointments from appointments that are already over without maintaining a cleanup job.
- Impact: UI behavior changes; persisted booking status remains `upcoming | cancelled`.

**API Documentation**

- From: Swagger documents bookings list data as `{ items, total, page, limit }`.
- To: Swagger documents the added `stats` object and any derived display state field used by booking DTOs.
- Reason: Public developer docs must match the response contract.
- Impact: OpenAPI generated files and examples need regeneration.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `salon-admin`: Admin bookings list statistics and row status display behavior change.
- `salon-api-docs`: OpenAPI documentation must describe the updated bookings list response contract.

## Impact

- API route: `src/app/api/bookings/route.ts`
- Types: `src/types/booking.type.ts`, `src/types/salon-common.type.ts` if a display status type is added
- Utilities/mappers: booking status/time derivation helpers and booking enrichment/serialization as needed
- UI: `src/app/admin/bookings/page.tsx`, `src/components/admin/bookings/*`
- i18n: `messages/en/admin.json`, `messages/vi/admin.json`
- OpenAPI: `src/openapi/schemas/booking.schema.ts`, `src/openapi/examples/booking.examples.ts`, `src/openapi/examples/responses.ts`, generated Swagger output
