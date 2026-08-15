## Why

Averie's salon UI runs on in-memory mocks with no real persistence, auth, or API contracts. System design docs in `docs/system-design/` are ready; this change implements MongoDB schemas, GET Route Handlers, Server Actions, and dev-only OpenAPI docs so the backend can be built and reviewed before wiring the existing UI.

## What Changes

- Add **5 Mongoose models** + **Zod validation** + **salon.mapper** per canonical naming (`visible`, `estimatedMinutes`, etc.)
- Add **seed script** (admin user, salon settings singleton, default categories)
- Wire **Auth.js Credentials** to MongoDB `users` with bcrypt; authorize admin/staff roles
- Implement **~12 GET Route Handlers** and **~15 Server Actions** from `docs/system-design/09-api-actions.md`
- Add **shared server logic** for slot availability, booking create/cancel/restore, reference IDs
- Add **API documentation**: next-openapi-gen (GET routes) + OpenAPI fragments (Server Actions) + Scalar UI at `/api/docs`
- Add **`ENABLE_API_DOCS`** to `.env.example` (dev on, prod off)

**Data layer**

- From: demo `Todo` model only
- To: full salon domain persisted in MongoDB Atlas
- Reason: Phase 1 backend foundation
- Impact: new collections; no UI behavior change yet

**Auth**

- From: mock admin gate / sessionStorage
- To: real Auth.js JWT sessions backed by `users` collection (callable; UI login wiring deferred)
- Reason: Admin/staff must authenticate against DB before UI wire-up
- Impact: non-breaking for UI until services refactored

## Non-goals

- Wiring `@services/salon.service.ts` or any UI component to real API/actions
- Removing `src/mocks/salon/data.ts` or mock admin gate in UI
- Payment, email/SMS, OAuth, multi-location, per-staff shifts, customer accounts
- REST Route Handlers for internal CRUD mutations (Server Actions only)
- Production exposure of API docs (`ENABLE_API_DOCS` unset in prod)

## Capabilities

### New Capabilities

- `salon-persistence`: Mongoose schemas, Zod mirrors, mappers, indexes, seed data for salon domain
- `salon-api-docs`: OpenAPI spec generation, Scalar docs route, env gating for dev-only access

### Modified Capabilities

- `appointment-booking`: Add backend booking reads (slots, by-reference) and mutations (create) — UI remains mock in this change
- `salon-admin`: Add backend admin reads (bookings list/detail, KPIs optional) and CRUD mutations for services, staff, schedule settings
- `account-access`: Add real Credentials authentication against MongoDB (replacing mock-only server behavior when actions are invoked)

## Impact

- **New**: `src/models/*`, `src/validations/*`, `src/actions/*`, `src/app/api/**`, `src/libs/salon.mapper.ts`, `src/libs/booking.service.ts`, `src/libs/schedule.server.ts`, `openapi/`, `scripts/seed-salon.mjs`
- **Modified**: `src/libs/auth.config.ts`, `src/actions/auth.action.ts`, `.env.example`, `package.json` (bcryptjs, next-openapi-gen, Scalar)
- **Unchanged**: UI components, `src/mocks/*`, `src/services/salon.service.ts` (still mock)
- **Dependencies**: `bcryptjs`, `next-openapi-gen`, `@scalar/nextjs-api-reference`
- **Reference**: `docs/system-design/*`
